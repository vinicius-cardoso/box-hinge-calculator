"""Geometria exata (CadQuery / OpenCASCADE) + exportação STEP/STL.

Constrói, a partir da solução de Burmester (solver.solve), o conjunto montado em pose
FECHADA: caixa + tampa (empilhada em cima) com FUROS PASSANTES, e 4 barras (2 curtas +
2 longas) em forma de "stadium" (prisma chato com pontas em arco) e PINOS cilíndricos
press-fit. As 2 barras de cada lado ficam em planos X distintos → sem colisão.

Eixos 3D: X = largura (centrado), Y = comprimento/profundidade (0=frente, L=fundo),
Z = altura (0=base). O solver entrega pivôs no plano (u, v) = (Y, Z), via Point2D.z=Y e
Point2D.y=Z.
"""
from __future__ import annotations

import math
from pathlib import Path

import cadquery as cq

from . import solver
from .models import Params

COL_BODY = cq.Color(0.37, 0.74, 0.51)
COL_BAR = cq.Color(0.24, 0.56, 0.38)


def _xcyl(radius: float, length: float, xc: float, Y: float, Z: float):
    """Cilindro com eixo ao longo de X, centrado em (xc, Y, Z)."""
    return (cq.Workplane("XY").cylinder(length, radius)
            .rotate((0, 0, 0), (0, 1, 0), 90)
            .translate((xc, Y, Z)))


def _box_solid(p: Params):
    W, L, H = p.shared.width, p.shared.length, p.box.height
    wt, pt = p.shared.wallThickness, p.shared.panelThickness
    outer = cq.Workplane("XY").box(W, L, H).translate((0, L / 2, H / 2))
    cav_h = H - pt + 2
    inner = cq.Workplane("XY").box(W - 2 * wt, L - 2 * wt, cav_h).translate((0, L / 2, pt + cav_h / 2))
    return outer.cut(inner)


def _lid_solid(p: Params):
    W, L, H = p.shared.width, p.shared.length, p.box.height
    wt, pt, lh = p.shared.wallThickness, p.shared.panelThickness, p.lid.height
    # Tampa empilhada em cima: Z∈[H, H+lh], bandeja com topo em cima (abre p/ baixo).
    outer = cq.Workplane("XY").box(W, L, lh).translate((0, L / 2, H + lh / 2))
    cav_h = lh - pt + 2
    cav_cz = H + (lh - pt) / 2 - 1            # cavidade aberta por baixo
    inner = cq.Workplane("XY").box(W - 2 * wt, L - 2 * wt, cav_h).translate((0, L / 2, cav_cz))
    return outer.cut(inner)


def _make_bar(p: Params, G, m, side: int):
    """Barra stadium (corpo chato + 2 arcos) com 2 pinos. As 2 barras de cada lado são
    COPLANARES (mesmo plano X, logo fora da parede). Espessura = espessura da parede.
    Pino: Ø do furo, comprimento = parede + 1.2 mm."""
    W, wt = p.shared.width, p.shared.wallThickness
    bt = wt                                       # espessura da barra = parede (req)
    bw, pd = p.bars.width, p.bars.pegDiameter
    clear_gap = 0.2
    gy, gz, my, mz = G.z, G.y, m.z, m.y           # (Y, Z) de cada pivô
    length = math.hypot(my - gy, mz - gz)
    deg = math.degrees(math.atan2(mz - gz, my - gy))

    x_in = side * (W / 2 + clear_gap)             # face interna da barra (fora da parede)
    xc = x_in + side * (bt / 2)

    body = (cq.Workplane("XY").box(bt, length, bw)
            .rotate((0, 0, 0), (1, 0, 0), deg)
            .translate((xc, (gy + my) / 2, (gz + mz) / 2)))
    cap1 = _xcyl(bw / 2, bt, xc, gy, gz)
    cap2 = _xcyl(bw / 2, bt, xc, my, mz)

    l_peg = wt + 1.2                              # entra na parede e um pouco além
    pcx = x_in - side * (l_peg / 2)
    peg1 = _xcyl(pd / 2, l_peg, pcx, gy, gz)
    peg2 = _xcyl(pd / 2, l_peg, pcx, my, mz)

    return body.union(cap1).union(cap2).union(peg1).union(peg2)


def build_assembly(p: Params):
    """Resolve o mecanismo e monta caixa + tampa (com furos) + 4 barras. Retorna o
    cq.Assembly e a solução."""
    sol = solver.solve(p)
    if not sol.feasible:
        raise ValueError("configuração inviável: " + "; ".join(sol.warnings or ["sem solução"]))

    box = _box_solid(p)
    lid = _lid_solid(p)
    hr = p.shared.holeDiameter / 2.0
    for piv in sol.boxPivots:
        box = box.cut(_xcyl(hr, p.shared.width + 4, 0, piv.z, piv.y))
    for piv in sol.lidPivots:
        lid = lid.cut(_xcyl(hr, p.shared.width + 4, 0, piv.z, piv.y))

    pairs = [(sol.boxPivots[0], sol.lidPivots[0]), (sol.boxPivots[1], sol.lidPivots[1])]
    asm = cq.Assembly()
    asm.add(box, name="caixa", color=COL_BODY)
    asm.add(lid, name="tampa", color=COL_BODY)
    for side in (1, -1):
        for idx, (G, m) in enumerate(pairs):
            tag = "A_longa" if idx == 0 else "B_curta"
            asm.add(_make_bar(p, G, m, side), name=f"barra_{tag}_{'+' if side > 0 else '-'}", color=COL_BAR)
    return asm, sol


def export(p: Params, fmt: str, out_dir: Path) -> Path:
    """Gera STEP ou STL do conjunto montado. Retorna o caminho do arquivo."""
    asm, _ = build_assembly(p)
    out_dir.mkdir(parents=True, exist_ok=True)
    fmt = fmt.lower()
    if fmt == "step":
        path = out_dir / "box-hinge.step"
        asm.export(str(path))
    elif fmt == "stl":
        path = out_dir / "box-hinge.stl"
        cq.exporters.export(asm.toCompound(), str(path))
    else:
        raise ValueError(f"formato não suportado: {fmt}")
    return path
