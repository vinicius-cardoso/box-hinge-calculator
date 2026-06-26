/**
 * Design System "Blueprint" — tokens.
 * Fonte da verdade dos valores. O theme.css espelha estes mesmos valores como
 * CSS custom properties (--ds-*).
 */
export const tokens = {
  color: {
    green: "#5EBE83",        // acento primário — só ação/estado/destaque
    greenBright: "#84DBA6",  // brilho, valores, hover, foco
    greenDim: "#3E8E5E",     // bordas verdes discretas
    greenDeep: "#1C3A2A",    // preenchimento de hover (outline)
    paper: "#0F1518",        // fundo (grafite com viés azul de prancheta)
    sheet: "#121A1E",        // superfície de seções
    panel: "#16201F",        // painéis/cards
    line: "#243036",         // bordas e grade
    line2: "#2E3C40",        // bordas de inputs/molduras
    ink: "#DCE8E4",          // texto principal
    muted: "#7E8C88",        // texto secundário
    faint: "#54605C",        // rótulos discretos/metadados
    dim: "#79B9A4",          // linhas de cota
  },
  font: {
    // títulos / rótulos / botões — lettering técnico (ISOCPEUR embarcada)
    display: '"ISOCPEUR",system-ui,sans-serif',
    // texto corrido — fontes de sistema
    sans: 'system-ui,-apple-system,"Segoe UI",Roboto,sans-serif',
    // números, valores e cotas (sempre com unidade) — mono de sistema
    mono: 'ui-monospace,"SF Mono",Menlo,Consolas,monospace',
  },
  size: { display: 40, h2: 24, h3: 18, body: 15, mono: 14, label: 11 },
  radius: 0,                 // cantos retos em tudo
  space: [0, 4, 8, 12, 16, 24, 32, 48], // base 4px
  borderWidth: 1,
} as const;

export type Tokens = typeof tokens;
