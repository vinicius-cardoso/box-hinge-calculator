"""Solver da dobradiça de 4 barras — SÍNTESE DE 2 POSIÇÕES (método do docs/dobradica.pdf).

Ideia (rigid-body guidance / base de Burmester):
- Cada furo da TAMPA tem uma posição FECHADA e uma ABERTA (tampa a 90°, vertical,
  base em v=0, atrás da caixa). O braço é rígido → o furo da CAIXA é equidistante das
  duas posições do furo da tampa, ou seja, está na MEDIATRIZ do segmento que as une.
- Há dois furos na tampa, a `edge` mm de CADA ponta (um na frente, um no fundo). Isso
  faz a tampa tombar para trás até a vertical sem as barras se chocarem.
- Escolhe-se, em cada mediatriz, o ponto que (a) cai dentro da caixa, (b) mantém o furo
  traseiro perto da parede de trás e (c) não gera colisão (barra×barra, tampa×caixa) em
  nenhum ângulo do percurso.

A tampa SEMPRE termina perpendicular à posição fechada (exatos 90°), por construção.
Plano 2D: (u, v) = (Y profundidade [0=frente, L=fundo], Z altura [0=base]).
Point2D.z = u, Point2D.y = v.
"""
from __future__ import annotations

import math

import numpy as np

from .models import Params, Point2D, SolveResult


def _circ_intersect(c0, r0, c1, r1, branch):
    d = np.asarray(c1) - np.asarray(c0)
    D = float(np.hypot(d[0], d[1]))
    if D < 1e-9 or D > r0 + r1 + 1e-9 or D < abs(r0 - r1) - 1e-9:
        return None
    a = (r0 * r0 - r1 * r1 + D * D) / (2 * D)
    h2 = r0 * r0 - a * a
    h = math.sqrt(h2) if h2 > 0 else 0.0
    base = np.asarray(c0) + a * d / D
    return base + branch * h * np.array([-d[1], d[0]]) / D


def _rigid(a, b, A, B):
    """(R, t) com a->A, b->B."""
    ang = math.atan2((B - A)[1], (B - A)[0]) - math.atan2((b - a)[1], (b - a)[0])
    c, s = math.cos(ang), math.sin(ang)
    R = np.array([[c, -s], [s, c]])
    return R, A - R @ a


def _seg_hit(p1, p2, p3, p4):
    """Interseção própria de segmentos (p1p2)×(p3p4)."""
    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    d1 = cross(p3, p4, p1); d2 = cross(p3, p4, p2)
    d3 = cross(p1, p2, p3); d4 = cross(p1, p2, p4)
    return ((d1 > 0) != (d2 > 0)) and ((d3 > 0) != (d4 > 0))


def _bisector(P, Q):
    """Retorna (M, n): ponto médio e direção unitária da mediatriz de PQ."""
    M = (np.asarray(P) + np.asarray(Q)) / 2.0
    d = np.asarray(Q) - np.asarray(P)
    n = np.array([-d[1], d[0]])
    return M, n / (np.linalg.norm(n) + 1e-12)


def _lid_corners(p: Params):
    L, H, lh = p.shared.length, p.box.height, p.lid.height
    return [np.array([0.0, H]), np.array([L, H]), np.array([L, H + lh]), np.array([0.0, H + lh])]


def _evaluate(p, O_A, O_B, Af, Bf, Aa, Ba):
    """Simula o curso fechado→aberto. Retorna (ok, min_clr, bar_hit)."""
    L, H = p.shared.length, p.box.height
    rA = float(np.hypot(*(Af - O_A)))
    rB = float(np.hypot(*(Bf - O_B)))
    coupler = float(np.hypot(*(Af - Bf)))
    # ramo coerente com a pose fechada
    branch = None
    for b in (+1, -1):
        t = _circ_intersect(O_B, rB, Af, coupler, b)
        if t is not None and np.hypot(*(t - Bf)) < 0.4:
            branch = b
            break
    if branch is None:
        return False, -1e9, True, None
    a0 = math.atan2((Af - O_A)[1], (Af - O_A)[0])
    a1 = math.atan2((Aa - O_A)[1], (Aa - O_A)[0])
    # caminho angular curto
    da = (a1 - a0 + math.pi) % (2 * math.pi) - math.pi
    corners = _lid_corners(p)
    min_clr, bar_hit = 1e9, False
    for i in range(0, 31):
        s = i / 30.0
        A = O_A + rA * np.array([math.cos(a0 + da * s), math.sin(a0 + da * s)])
        B = _circ_intersect(O_B, rB, A, coupler, branch)
        if B is None:
            return False, -1e9, True, None
        if s > 0.04 and _seg_hit(O_A, A, O_B, B):
            bar_hit = True
        R, t = _rigid(Af, Bf, A, B)
        for cpt in corners:
            q = R @ cpt + t
            dx = max(0.0 - q[0], q[0] - L, 0.0)
            dy = max(0.0 - q[1], q[1] - H, 0.0)
            sd = math.hypot(dx, dy) if (dx or dy) else -min(q[0], L - q[0], q[1], H - q[1])
            if s > 0.10:
                min_clr = min(min_clr, sd)
    # confere fechamento a 90°
    A_end = O_A + rA * np.array([math.cos(a0 + da), math.sin(a0 + da)])
    if np.hypot(*(A_end - Aa)) > 0.5:
        return False, -1e9, bar_hit, None
    return (not bar_hit) and min_clr >= 0.0, min_clr, bar_hit, (rA, rB, coupler, branch, a0, a0 + da)


def solve(p: Params) -> SolveResult:
    L, H, lh = p.shared.length, p.box.height, p.lid.height
    wt, hd, gap = p.shared.wallThickness, p.shared.holeDiameter, p.hinge.openGap
    hr = hd / 2.0

    edge = min(max(2.0 * hd, 3.0), L / 2.0 - wt - 1.5)     # furos a `edge` de cada ponta
    if edge <= hr:
        return SolveResult(feasible=False, warnings=["caixa curta demais para posicionar os furos"])

    yC = H + lh / 2.0                                       # furos da tampa (fechada): meia-altura
    uo = L + gap + lh / 2.0                                 # u dos furos (abertos), atrás da caixa
    Af = np.array([edge, yC]);        Bf = np.array([L - edge, yC])
    Aa = np.array([uo, L - edge]);    Ba = np.array([uo, edge])

    MA, nA = _bisector(Af, Aa)
    MB, nB = _bisector(Bf, Ba)

    def inside(O):
        m = hr + 0.8
        return (m <= O[0] <= L - m) and (m <= O[1] <= H - m)

    span = 2.0 * (L + H)
    tA = np.linspace(-span, span, 220)
    tB = np.linspace(-span, span, 220)
    candA = [MA + t * nA for t in tA if inside(MA + t * nA)]
    candB = [MB + t * nB for t in tB if inside(MB + t * nB)]
    if not candA or not candB:
        return SolveResult(feasible=False, warnings=["mediatriz não cruza o corpo da caixa — ajuste folga/alturas"])

    best = None
    for O_A in candA:
        for O_B in candB:
            if np.hypot(*(O_A - O_B)) < hd + 1.5:
                continue
            ok, clr, bar_hit, extra = _evaluate(p, O_A, O_B, Af, Bf, Aa, Ba)
            if not ok:
                continue
            rA, rB, coupler, branch, a0, a1 = extra
            # custo: O_B perto da parede traseira; folga ampla; braços moderados
            cost = (L - O_B[0]) - 1.2 * min(clr, 4.0) + 0.12 * (rA + rB)
            if best is None or cost < best[0]:
                best = (cost, O_A, O_B, rA, rB, coupler, branch, a0, a1, clr)

    if best is None:
        return SolveResult(feasible=False, warnings=["sem posição de furo sem colisão — ajuste folga, altura da tampa ou furos"])

    _, O_A, O_B, rA, rB, coupler, branch, a0, a1, clr = best
    return SolveResult(
        feasible=True,
        boxPivots=[Point2D(y=float(O_A[1]), z=float(O_A[0])), Point2D(y=float(O_B[1]), z=float(O_B[0]))],
        lidPivots=[Point2D(y=float(Af[1]), z=float(Af[0])), Point2D(y=float(Bf[1]), z=float(Bf[0]))],
        barLengths=[float(rA), float(rB)],
        couplerLength=float(coupler),
        crankClosed=float(a0),
        crankOpen=float(a1),
        branch=int(branch),
        clearance=float(max(0.0, clr)),
        warnings=[],
    )
