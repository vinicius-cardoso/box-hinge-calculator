# Blueprint — Design System (pacote de código)

Biblioteca de componentes que materializa o Design System **Blueprint** do Box Hinge
Calculator: grafite escuro, verde técnico (`#5EBE83`) e tipografia **ISOCPEUR** (lettering
de prancheta) com dados em monoespaçada. Spec completa em
[`../docs/design-system-blueprint.md`](../docs/design-system-blueprint.md).

Este pacote é a **fonte da verdade** que o **Claude Design** lê via `/design-sync`.

## Conteúdo

```
design-system/
├── package.json
└── src/
    ├── index.ts            # entrada (exporta tokens + componentes)
    ├── tokens.ts           # cores, fontes, tamanhos, espaçamento
    ├── theme.css           # @font-face ISOCPEUR + CSS vars + classes
    ├── fonts/ISOCPEUR.ttf  # fonte embutida
    └── components/
        ├── Button.tsx       # primário (verde) / secundário (outline)
        ├── NumberField.tsx  # parâmetro: valor mono + unidade + trilho
        ├── Panel.tsx        # painel com cabeçalho de bloco de título
        ├── Badge.tsx        # outline / solid (VIÁVEL) / dashed
        ├── Dimension.tsx    # linha de cota técnica
        └── TitleBlock.tsx   # bloco de título de desenho
```

## Sincronizar com o Claude Design

```bash
cd design-system
claude
/design-sync
```

O `/design-sync` lê os tokens e componentes React deste pacote e publica o Design System.
> Observação: ao sincronizar nesta conta da organização, o sistema fica **visível para
> todos da org** no Claude Design.

## Regras de uso

- **Verde** só para ação/estado/destaque — nunca em grandes áreas.
- **Cantos retos** (radius 0) em tudo.
- **ISOCPEUR** só em títulos, rótulos e botões; números/cotas em **IBM Plex Mono** (com
  unidade); texto corrido em **IBM Plex Sans**.
- Fundo sempre com a **grade técnica** sutil (classe `ds-surface`).
