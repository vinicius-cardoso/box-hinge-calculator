Panel from @box-hinge/blueprint-design-system. Use via `window.BlueprintDS.Panel` (bundle loaded from the root `_ds_bundle.js`).

Painel Blueprint com cabeçalho em bloco de título.

## Props

```ts
interface PanelProps {
  title: string;
  /** etiqueta mono à direita do cabeçalho (ex.: nome técnico). */
  tag?: string;
  children?: React.ReactNode;
}
```

## Examples

### ParametrosDaCaixa

```jsx
() => (
  <div style={{ width: 300 }}>
    <Panel title="Caixa" tag="box">
      <NumberField label="Largura" value={62} unit="mm" min={20} max={200} />
      <NumberField label="Altura" value={22} unit="mm" min={5} max={120} />
      <Button variant="primary">Exportar STEP</Button>
    </Panel>
  </div>
)
```
