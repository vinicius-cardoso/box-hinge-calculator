TitleBlock from @box-hinge/blueprint-design-system. Use via `window.BlueprintDS.TitleBlock` (bundle loaded from the root `_ds_bundle.js`).

Cabeçalho em "bloco de título" de desenho técnico.

## Props

```ts
interface TitleBlockProps {
  eyebrow?: string;
  /** título; use <em> via children para destacar parte em verde. */
  children: React.ReactNode;
  /** células de metadados à direita (ex.: Scale 1:1, Units mm, Rev A). */
  cells?: TitleBlockCell[];
}
```

## Examples

### Padrao

```jsx
() => (
  <div style={{ width: 460 }}>
    <TitleBlock
      eyebrow="Design System · DWG-01"
      cells={[
        { k: "Scale", v: "1:1" },
        { k: "Units", v: "mm" },
        { k: "Rev", v: "A" },
      ]}
    >
      Box <em>Hinge</em> Calculator
    </TitleBlock>
  </div>
)
```
