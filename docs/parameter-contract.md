# Contrato de Parâmetros

Objeto JSON compartilhado entre frontend (preview) e backend (`/solve`, `/export`).
Fonte da verdade dos defaults: [`shared/default-params.json`](../shared/default-params.json).
Unidades em **mm**; ângulos em graus. Eixos: **X** = largura (eixo da dobradiça),
**Y** = comprimento/profundidade, **Z** = altura.

## Regras (do usuário)
- **Compartilhados** entre caixa e tampa: `width`, `length`, `wallThickness`,
  `holeDiameter`, `panelThickness`. Só a **altura** é própria de cada um (`box.height`,
  `lid.height`).
- **Espessura da barra = `wallThickness`** (não é parâmetro editável).
- **Encaixe (pino) da barra = `holeDiameter`** (press-fit; a UI trava os dois juntos).
- Parede **mínima 0,8 mm**. Todas as medidas idealmente **múltiplas de 0,4 mm**
  (bico de impressora 3D) — a UI usa passo 0,4 e arredonda ao confirmar.
- A tampa **sempre abre exatamente 90°** (vertical) na posição 100% aberta.

## Schema

```jsonc
{
  "units": "mm",
  "shared": {
    "width": 60,            // X externo (caixa == tampa)
    "length": 30,           // Y externo (caixa == tampa)
    "wallThickness": 1.2,   // paredes (== caixa e tampa) — mínimo 0.8
    "holeDiameter": 2,      // Ø dos furos passantes (== encaixe das barras)
    "panelThickness": 1.2   // fundo da caixa == topo da tampa — mínimo 0.8
  },
  "box": { "height": 16.2 },  // altura própria da caixa
  "lid": { "height": 6.2 },   // altura própria da tampa (empilhada em cima)
  "bars": {
    "width": 4.8,           // largura da barra (raio do arco = width/2)
    "pegDiameter": 2        // == holeDiameter (press-fit). espessura da barra = wallThickness
  },
  "hinge": { "openGap": 2 } // folga (mm) tampa↔caixa com a tampa vertical
}
```

> Removidos do schema antigo: `bars.thickness` (agora = `wallThickness`) e
> `hinge.openAngle` (a abertura é sempre 90°). `holeDiameter`/`wallThickness`/
> `panelThickness` deixaram de ser de `box` e passaram a `shared`.

## Validação
Caixa/tampa: `2·wallThickness < width` e `< length`; `panelThickness < box.height`;
`holeDiameter < box.height`; `wallThickness, panelThickness ≥ 0.8`;
`pegDiameter ≤ holeDiameter`; `pegDiameter ≤ bars.width`. Quando **inviável**
(geometria sem solução sem colisão), o backend devolve `warnings` acionáveis e a UI
destaca o que mudar.

## Saída do solver (`/solve` → `SolveResult`)

```jsonc
{
  "feasible": true,
  "boxPivots": [ {y,z}, {y,z} ],   // [O_A, O_B] — furos/pivôs na caixa
  "lidPivots": [ {y,z}, {y,z} ],   // [A, B] — furos na tampa (pose fechada)
  "barLengths": [rA, rB],          // braço dianteiro (longo) e traseiro (curto)
  "couplerLength": 22.0,           // |A − B| (rígido)
  "crankClosed": .., "crankOpen": ..,  // ângulo da manivela O_A→A (rad), fechada/aberta
  "branch": 1,                     // ramo da interseção círculo-círculo
  "clearance": 2.0,                // folga mínima tampa↔caixa no curso (mm)
  "warnings": []
}
```
`Point2D.z = u` (profundidade Y), `Point2D.y = v` (altura Z). Método em
[`hinge-math.md`](./hinge-math.md).

## Exportação (`/export/{fmt}`)
`fmt ∈ {step, stl}`. Gera o conjunto montado (pose fechada): **caixa + tampa + 4 barras**
(2 curtas + 2 longas), furos passantes, pinos press-fit (Ø furo, comprimento
`parede + 1.2`), via CadQuery/OpenCASCADE.
