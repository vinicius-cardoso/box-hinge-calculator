NumberField from @box-hinge/blueprint-design-system. Use via `window.BlueprintDS.NumberField` (bundle loaded from the root `_ds_bundle.js`).

Campo de parâmetro Blueprint: rótulo + valor mono à direita, input com sufixo de
unidade e um trilho fino mostrando a posição entre min/max.

## Props

```ts
interface NumberFieldProps {
  label: string;
  value: number;
  unit?: string;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
}
```

## Examples

### Largura

```jsx
() => (
  <div style={{ width: 280 }}>
    <NumberField label="Largura" value={62} unit="mm" min={20} max={200} />
  </div>
)
```

### FolgaAberta

```jsx
() => (
  <div style={{ width: 280 }}>
    <NumberField label="Folga aberta" value={2} unit="mm" min={0} max={10} />
  </div>
)
```
