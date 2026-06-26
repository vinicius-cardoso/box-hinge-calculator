# Dobradiça de 4 barras — fundamentação do solver

Método implementado em `backend/app/solver.py`, baseado em
[`docs/dobradica.pdf`](./dobradica.pdf) (síntese de corpo rígido por **2 posições** —
a base da teoria de Burmester). Substitui a tentativa anterior de Burmester de 4 poses.

## 1. Plano e convenção

Tudo se passa na **vista lateral**, plano `(u, v)`:
- `u` = profundidade/comprimento (Y) — `0` = frente, `L` = fundo.
- `v` = altura (Z) — `0` = base da caixa.
- O eixo da dobradiça corre ao longo da **largura** (X); o mecanismo é espelhado nas
  duas faces de largura. `Point2D.z = u`, `Point2D.y = v`.

A caixa ocupa `u∈[0,L], v∈[0,H]`. A tampa fica **empilhada em cima**, `v∈[H, H+lh]`.

## 2. As duas posições da tampa

A tampa é um corpo rígido com **dois furos**, a `edge` mm de **cada ponta** (um
dianteiro, um traseiro). `edge = clamp(2·Ø_furo, 3, L/2 − parede − 1.5)`.

**Fechada** (furos na meia-altura da tampa, `v = H + lh/2`):
```
A_f = (edge,       H + lh/2)      (dianteiro)
B_f = (L − edge,   H + lh/2)      (traseiro)
```

**Aberta** — a tampa tomba para trás até ficar **vertical (90°)**, base em `v=0`, atrás
da caixa. O `u` dos furos vem da parede externa + folga + meia-altura da tampa:
`u_o = L + gap + lh/2`. A tampa, agora vertical, mede `L` na altura; os furos ficam a
`edge` de cada ponta. Como ela tomba para a direita, a ponta dianteira sobe:
```
A_a = (u_o, L − edge)             (dianteiro → topo)
B_a = (u_o, edge)                 (traseiro → base)
```

O acoplador é rígido: `|A_f − B_f| = |A_a − B_a| = L − 2·edge` ✓. E a tampa gira
**exatamente 90°** (o vetor A→B passa de horizontal para vertical) — garantindo o
requisito de abertura perpendicular.

## 3. Furo da caixa = mediatriz

O braço é rígido: o furo da caixa é o pivô fixo e o furo da tampa gira em torno dele.
Logo o furo da caixa é **equidistante** das posições fechada e aberta do furo da tampa,
ou seja, está na **mediatriz** do segmento que as une:
```
O_A ∈ mediatriz(A_f, A_a)        O_B ∈ mediatriz(B_f, B_a)
```
A mediatriz é uma reta inteira (1 grau de liberdade por braço).

## 4. Escolha do ponto na mediatriz

Varremos cada mediatriz e escolhemos o par `(O_A, O_B)` que:
- **(a)** cai **dentro do corpo da caixa** (`u∈[r, L−r], v∈[r, H−r]`, com margem);
- **(b)** mantém `O_B` perto da **parede traseira** (a tampa sobe antes de tombar);
- **(c)** **não colide** em nenhum ângulo do percurso — verificado simulando o
  mecanismo do fechado→aberto e testando **barra×barra** (interseção de segmentos) e
  **tampa×caixa** (folga ≥ 0). Custo favorece folga ampla e braços moderados.

Comprimentos dos braços: `rA = |O_A − A_f|`, `rB = |O_B − B_f|` (um longo, um curto →
"2 menores + 2 maiores", espelhados nos dois lados).

## 5. Simulação / animação (replay)

Mecanismo de 1 GDL. Dada a manivela `O_A→A` no ângulo `θ` (de `θ_fechado` a `θ_aberto`):
`A = O_A + rA·(cosθ, sinθ)`; `B = ` interseção dos círculos `(O_B, rB)` e `(A, coupler)`
no ramo coerente; pose da tampa = transformação rígida que leva `(A_f,B_f) → (A,B)`. Por
construção, em `θ_aberto` a tampa está vertical. O **preview (JS)** roda exatamente este
replay (rápido); o **backend** entrega os pivôs/ângulos via `/solve`.

## 6. Validação contra o PDF

Caixa de referência (60×30×16,2; parede 1,2; tampa 6,2; furo 2; folga 2) →
acoplador 22 mm, braços ≈ 21,7 e 9,4 mm (o PDF cita 23,65 e 9,25 — pontos válidos na
mesma mediatriz, escolha diferente do parâmetro livre). Furos de referência e fotos em
[`img/`](../img).
