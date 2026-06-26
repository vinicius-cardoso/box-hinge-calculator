Button from @box-hinge/blueprint-design-system. Use via `window.BlueprintDS.Button` (bundle loaded from the root `_ds_bundle.js`).

Botão Blueprint — maiúsculas em ISOCPEUR, cantos retos.

## Props

```ts
interface ButtonProps {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** "primary" = ação principal (verde preenchido); "secondary" = outline. */
  variant?: "primary" | "secondary";
}
```

## Examples

### Primario

```jsx
() => <Button variant="primary">Exportar STEP</Button>
```

### Secundario

```jsx
() => <Button variant="secondary">Exportar STL</Button>
```

### Desabilitado

```jsx
() => (
  <Button variant="primary" disabled>
    Exportar STEP
  </Button>
)
```
