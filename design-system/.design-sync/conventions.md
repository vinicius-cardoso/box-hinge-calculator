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
