# Blueprint — convenções do design system

Estética de **prancheta de desenho técnico**: fundo grafite, acento verde, títulos em
**ISOCPEUR**, números/cotas em monoespaçada, **cantos retos**.

## Setup
- **Não há provider.** Garanta que `styles.css` esteja carregado — ele traz os tokens, a
  fonte **ISOCPEUR** (embutida) e os estilos dos componentes.
- Envolva a superfície da página na classe **`.ds-surface`** para o fundo grafite com a
  grade técnica. Sem ela, o fundo fica sem a grade e sem a cor base.

## Idioma de estilo
- Os componentes já vêm estilizados — **componha via props**, não via classes
  (ex.: `<Button variant="primary">`, `<Badge variant="solid">`).
- Para o SEU layout (espaçamento, grids), use as **CSS custom properties** do tema,
  nunca cores cruas:
  - cores: `--ds-green` (#5EBE83), `--ds-green-bright`, `--ds-paper` (fundo),
    `--ds-panel`, `--ds-line` (bordas/grade), `--ds-ink` (texto), `--ds-muted`.
  - fontes: `--ds-display` (ISOCPEUR — títulos/rótulos/botões, MAIÚSCULAS),
    `--ds-mono` (números, valores e cotas — **sempre com unidade**), `--ds-sans` (corpo).
- Regras: verde só para ação/estado/destaque (nunca grandes áreas); **border-radius 0**
  em tudo; todo número acompanhado de unidade, em mono.

## Componentes
- **TitleBlock** — cabeçalho em bloco de título (eyebrow + título + células de
  metadados). Use `<em>` no título para destacar parte em verde.
- **Panel** — painel com cabeçalho; agrupa campos e controles.
- **NumberField** — campo numérico de parâmetro (`label`, `value`, `unit`, `min`, `max`);
  mostra um trilho proporcional.
- **Button** — `variant="primary"` (ação principal) ou `"secondary"` (outline).
- **Badge** — `variant="solid"` (afirmativo, ex.: VIÁVEL) / `"outline"` / `"dashed"`.
- **Dimension** — linha de cota técnica (`label` como `"62.0"` ou `"Ø2.0 H7"`).

A verdade dos estilos vive em `styles.css` (e seus `@import`s) — leia antes de estilizar
layout próprio. Docs por componente em cada `<Name>.prompt.md`.

## Exemplo
```tsx
<div className="ds-surface" style={{ padding: 24, display: "grid", gap: 16 }}>
  <TitleBlock
    eyebrow="Design System · DWG-01"
    cells={[{ k: "Scale", v: "1:1" }, { k: "Units", v: "mm" }, { k: "Rev", v: "A" }]}
  >
    Box <em>Hinge</em> Calculator
  </TitleBlock>
  <Panel title="Caixa" tag="box">
    <NumberField label="Largura" value={62} unit="mm" min={20} max={200} />
    <Button variant="primary">Exportar STEP</Button>
  </Panel>
</div>
```

# BlueprintDS (@box-hinge/blueprint-design-system@0.1.0)

This design system is the published @box-hinge/blueprint-design-system React library, bundled as a single
browser global. All 6 components are the real upstream code.

## Where things are

- `_ds_bundle.js` — the whole-DS bundle at the project root; loads every component to `window.BlueprintDS`. First line is a `/* @ds-bundle: … */` metadata header.
- `styles.css` — the single stylesheet entry: it `@import`s the tokens, fonts, and component styles (`_ds_bundle.css`). Link this one file.
- `components/<group>/<Name>/<Name>.prompt.md` (example JSX + variants), `<Name>.d.ts` (types), `<Name>.html` (variant grid).
- `tokens/*.css` — CSS custom properties, names verbatim from upstream.
- `fonts/` — `@font-face` files + `fonts.css` (when the package ships fonts).

For a specific component, `read_file("components/<group>/<Name>/<Name>.prompt.md")`.

## Loading

Add these two lines to your page once (React must be on the page first):

```html
<link rel="stylesheet" href="styles.css">
<script src="_ds_bundle.js"></script>
```

Components are then available at `window.BlueprintDS.*`. Mount into a dedicated child node (e.g. `<div id="ds-root">`), not the host page's own React root, so the two trees don't collide:

```jsx
const { Badge } = window.BlueprintDS;
ReactDOM.createRoot(document.getElementById('ds-root')).render(<Badge />);
```

## Tokens

16 CSS custom properties from @box-hinge/blueprint-design-system. Names are
preserved verbatim from upstream. They are declared inside `_ds_bundle.css` (this DS ships one compiled stylesheet rather than separate token files).

- **other** (16): `--ds-green`, `--ds-green-bright`, `--ds-green-dim`, …

## Components

### general
- `Badge` — Chip/badge mono Blueprint.
- `Button` — Boto Blueprint  maisculas em ISOCPEUR, cantos retos.
- `Dimension` — Linha de cota Blueprint (ticks nas pontas + setas), para comunicar medidas.
- `NumberField` — Campo de parmetro Blueprint: rtulo + valor mono  direita, input com sufixo de
- `Panel` — Painel Blueprint com cabealho em bloco de ttulo.
- `TitleBlock` — Cabealho em bloco de ttulo de desenho tcnico.
