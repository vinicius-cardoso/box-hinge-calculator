Badge from @box-hinge/blueprint-design-system. Use via `window.BlueprintDS.Badge` (bundle loaded from the root `_ds_bundle.js`).

Chip/badge mono Blueprint.

## Props

```ts
interface BadgeProps {
  children: React.ReactNode;
  /** "outline" (padrão), "solid" (estado afirmativo, ex.: VIÁVEL), "dashed" (opcional). */
  variant?: "outline" | "solid" | "dashed";
}
```

## Examples

### Viavel

```jsx
() => <Badge variant="solid">VIÁVEL</Badge>
```

### Estado

```jsx
() => <Badge variant="outline">gap 2 mm</Badge>
```

### Opcional

```jsx
() => <Badge variant="dashed">opcional</Badge>
```
