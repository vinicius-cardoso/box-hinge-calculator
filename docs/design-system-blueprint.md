# Design System — "Blueprint"

Identidade visual do Box Hinge Calculator. Linguagem de **prancheta de desenho
técnico**: grafite escuro, verde como acento, grade fina, blocos de título, linhas de
cota e cantos retos. Página de referência (style guide) gerada como artifact.

## Tokens

### Cores

| Token            | Hex       | Uso                                        |
|------------------|-----------|--------------------------------------------|
| `--green`        | `#5EBE83` | acento primário, ações, destaques          |
| `--green-bright` | `#84DBA6` | brilho, valores, hover, foco               |
| `--green-dim`    | `#3E8E5E` | bordas verdes discretas                    |
| `--green-deep`   | `#1C3A2A` | preenchimento de hover de botão outline    |
| `--paper`        | `#0F1518` | fundo (grafite com leve viés azul)         |
| `--sheet`        | `#121A1E` | superfície de seções                       |
| `--panel`        | `#16201F` | painéis/cards                              |
| `--line`         | `#243036` | bordas e grade                             |
| `--line-2`       | `#2E3C40` | bordas de inputs/molduras                  |
| `--ink`          | `#DCE8E4` | texto principal (off-white frio)           |
| `--muted`        | `#7E8C88` | texto secundário                           |
| `--faint`        | `#54605C` | rótulos discretos, metadados               |
| `--dim`          | `#79B9A4` | linhas de cota                             |

Regra de cor: **verde nunca preenche grandes áreas** — é reservado para ação, estado e
destaque. Cores semânticas (erro/aviso) ficam fora do verde de acento.

### Tipografia

- **Display / títulos:** `ISOCPEUR` → fallback `Saira Semi Condensed`, `Oswald`,
  `Arial Narrow`. Sempre **MAIÚSCULAS**, `letter-spacing: .02–.05em`, peso 600.
- **Corpo:** `IBM Plex Sans` (fallback system-ui).
- **Dados / cotas / rótulos:** `IBM Plex Mono` (fallback `ui-monospace`). Toda medida,
  dimensão e número usa mono **com unidade** (`62.0 mm`, `Ø2.0`, `θ110°`).

Escala (px): display 40 · h2 24 · h3 18 · body 15 · mono 14 · label 11 (caps, tracking .2em).

### Forma e espaço

- **Border-radius: 0** (cantos retos em tudo — botões, inputs, painéis, chips).
- Bordas hairline de 1px em `--line`.
- **Grade de fundo** sempre visível e sutil (20px menor + 100px maior).
- Espaçamento por grid/flex `gap`, base de 4px.

### Motivos da linguagem "blueprint"

- **Bloco de título** (title block) no cabeçalho: nome do projeto + células de
  metadados (Scale 1:1, Units mm, Rev A).
- **Marcas de canto** (colchetes) e **crosshair** no viewport 3D.
- **Linhas de cota** com ticks e setas para comunicar medidas reais.
- Seções numeradas com letra/índice mono.

## Componentes

- **Botão primário:** preenchido verde, texto `#0A130D`, display caps, radius 0; hover
  → `--green-bright` + glow sutil.
- **Botão secundário (outline):** borda verde, texto `--green-bright`, fundo
  transparente; hover → preenche `--green-deep`.
- **Input de parâmetro:** moldura `--line-2`, valor em mono, sufixo de unidade à direita
  separado por borda; slider com trilho fino e thumb quadrado verde.
- **Badge/chip:** mono, borda verde (estado), ou tracejada (opcional), ou sólida verde
  (estado afirmativo, ex.: "VIÁVEL").
- **Foco visível:** `outline: 2px var(--green-bright)`.

## Acessibilidade / qualidade

- Respeitar `prefers-reduced-motion` (auto-rotação e animações desligam).
- Contraste do texto `--ink` sobre `--paper` ok; `--muted` só para secundário.

---

## Texto pronto para colar no Claude Design

> Cole isto ao criar o Design System ("Create your own"):

```
Design System "Blueprint" — estética de prancheta de desenho técnico (engenharia/CAD), tema escuro.

CORES
- Acento primário (verde): #5EBE83 ; verde brilho: #84DBA6 ; verde discreto: #3E8E5E ; verde profundo (hover): #1C3A2A
- Fundo: #0F1518 ; superfície: #121A1E ; painel: #16201F
- Linhas/grade: #243036 ; bordas de input: #2E3C40
- Texto: #DCE8E4 ; secundário: #7E8C88 ; discreto: #54605C ; linhas de cota: #79B9A4
- Verde é só para ação/estado/destaque; nunca preencher grandes áreas com verde.

TIPOGRAFIA
- Títulos: ISOCPEUR se disponível, senão Saira Semi Condensed / Oswald. SEMPRE MAIÚSCULAS, letter-spacing 0.02–0.05em, peso 600.
- Corpo: IBM Plex Sans.
- Dados, números, cotas e rótulos: IBM Plex Mono, sempre com unidade (ex.: 62.0 mm, Ø2.0, θ110°).
- Escala px: display 40 / h2 24 / h3 18 / corpo 15 / mono 14 / rótulo 11 (caps, tracking 0.2em).

FORMA
- border-radius 0 em TUDO (cantos retos). Bordas de 1px.
- Fundo SEMPRE com grade técnica sutil (quadriculado 20px + linhas mestras 100px).
- Espaçamento por grid/flex gap, base 4px.

MOTIVOS BLUEPRINT
- Cabeçalho em "bloco de título" de desenho: nome + células de metadados (Scale 1:1, Units mm, Rev A).
- Marcas de canto em colchete e crosshair no viewport 3D.
- Linhas de cota (com ticks/setas) para mostrar medidas.
- Seções numeradas com índice em mono.

COMPONENTES
- Botão primário: verde preenchido (#5EBE83), texto #0A130D, maiúsculas condensadas, radius 0, hover #84DBA6 + leve glow.
- Botão secundário: outline verde, texto #84DBA6, transparente; hover preenche #1C3A2A.
- Input: moldura #2E3C40, valor em mono, unidade à direita separada por borda; slider de trilho fino com thumb quadrado verde.
- Badge: mono; borda verde (estado), tracejada (opcional) ou sólida verde (afirmativo, ex.: "VIÁVEL").
- Foco visível: outline 2px #84DBA6.

TOM
- Técnico, preciso, confiante. Respeitar prefers-reduced-motion.
```
