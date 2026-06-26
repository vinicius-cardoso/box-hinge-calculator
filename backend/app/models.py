"""Modelos Pydantic do contrato de parâmetros (ver docs/parameter-contract.md).

Regras do usuário:
- largura, comprimento, espessura das paredes, Ø dos furos e espessura do painel são
  COMPARTILHADOS entre caixa e tampa. Só a ALTURA é própria de cada um.
- espessura da barra = espessura das paredes (não editável).
- encaixe (pino) das barras = Ø do furo (press-fit).
- parede mínima 0,8 mm; medidas idealmente múltiplas de 0,4 mm (bico de impressora).
"""
from __future__ import annotations

from pydantic import BaseModel, Field, model_validator

MIN_WALL = 0.8


class Shared(BaseModel):
    width: float = Field(60, gt=0)                 # X externo (caixa == tampa)
    length: float = Field(30, gt=0)                # Y externo (caixa == tampa)
    wallThickness: float = Field(1.2, ge=MIN_WALL) # paredes (caixa == tampa)
    holeDiameter: float = Field(2, gt=0)           # Ø furos (caixa == tampa)
    panelThickness: float = Field(1.2, ge=MIN_WALL)  # fundo da caixa == topo da tampa


class Box(BaseModel):
    height: float = Field(16.2, gt=0)              # altura própria da caixa


class Lid(BaseModel):
    height: float = Field(6.2, gt=0)               # altura própria da tampa


class Bars(BaseModel):
    width: float = Field(4.8, gt=0)                # largura da barra (raio do arco = width/2)
    pegDiameter: float = Field(2, gt=0)            # Ø do pino — press-fit == holeDiameter
    # espessura da barra NÃO é parâmetro: vale sempre shared.wallThickness.


class Hinge(BaseModel):
    openGap: float = Field(2, ge=0)                # folga (mm) com a tampa 100% aberta (vertical)


class Params(BaseModel):
    units: str = "mm"
    shared: Shared = Shared()
    box: Box = Box()
    lid: Lid = Lid()
    bars: Bars = Bars()
    hinge: Hinge = Hinge()

    @model_validator(mode="after")
    def _checks(self) -> "Params":
        s = self.shared
        if 2 * s.wallThickness >= s.width:
            raise ValueError("paredes não cabem na largura")
        if 2 * s.wallThickness >= s.length:
            raise ValueError("paredes não cabem no comprimento")
        if s.panelThickness >= self.box.height:
            raise ValueError("panelThickness precisa ser menor que box.height")
        if s.holeDiameter >= self.box.height:
            raise ValueError("holeDiameter precisa ser menor que box.height")
        if self.bars.pegDiameter > s.holeDiameter + 1e-9:
            raise ValueError("pegDiameter não pode exceder holeDiameter (press-fit)")
        if self.bars.pegDiameter > self.bars.width + 1e-9:
            raise ValueError("o pino não cabe na largura da barra")
        return self


# --- Saída do solver ---

class Point2D(BaseModel):
    y: float   # altura (v)
    z: float   # profundidade (u)


class SolveResult(BaseModel):
    feasible: bool
    boxPivots: list[Point2D] = []     # [O_A, O_B] — furos/pivôs fixos na caixa
    lidPivots: list[Point2D] = []     # [A, B] — furos na tampa (pose FECHADA)
    barLengths: list[float] = []      # [rA, rB] — braço dianteiro (longo) e traseiro (curto)
    couplerLength: float = 0          # |A - B| (rígido na tampa)
    crankClosed: float = 0            # ângulo da manivela O_A->A (rad) — fechada
    crankOpen: float = 0              # ângulo da manivela O_A->A (rad) — aberta (vertical)
    branch: int = 1                   # ramo da interseção círculo-círculo (+1/-1)
    clearance: float = 0              # folga mínima tampa↔caixa no curso (mm)
    warnings: list[str] = []
