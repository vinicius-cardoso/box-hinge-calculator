Dimension from @box-hinge/blueprint-design-system. Use via `window.BlueprintDS.Dimension` (bundle loaded from the root `_ds_bundle.js`).

Linha de cota Blueprint (ticks nas pontas + setas), para comunicar medidas.

## Props

```ts
interface DimensionProps {
  /** texto da cota, ex.: "62.0" ou "Ø2.0 H7". */
  label: string;
}
```

## Examples

### Largura

```jsx
() => (
  <div style={{ width: 220 }}>
    <Dimension label="62.0" />
  </div>
)
```

### Furo

```jsx
() => (
  <div style={{ width: 160 }}>
    <Dimension label="Ø2.0 H7" />
  </div>
)
```
