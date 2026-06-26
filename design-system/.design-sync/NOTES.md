# Notas de sync — Blueprint Design System

Gotchas e contexto para futuros `/design-sync`.

## Setup específico deste repo
- O pacote **não tinha build**; foi adicionado **tsup** (`buildCmd: npm run build`) que
  emite `dist/index.js` + `dist/index.d.ts`. `tsconfig.json` precisa de `jsx: react-jsx`.
- O conversor exige o pacote resolvível em `node_modules/<pkg>`. Como é o próprio repo,
  há um **self-link**: `node_modules/@box-hinge/blueprint-design-system -> ../..`
  (recriar por clone: `ln -sfn ../.. node_modules/@box-hinge/blueprint-design-system`).
- Conversor rodado com `--entry ./dist/index.js --node-modules ./node_modules`.
- **Playwright fixado em 1.60.0** para casar com o chromium **1223** em cache
  (`~/.cache/ms-playwright`). 1.61+ aponta para 1228 (não cacheado) e falha o launch.

## Fontes
- Só a **ISOCPEUR** embarca (`@font-face`, em `fonts/`). Corpo e números usam fontes de
  **sistema** por decisão de design (`--ds-sans` = system-ui, `--ds-mono` = ui-monospace).
- Os stacks foram enxugados para referenciar só a ISOCPEUR como webfont nomeada, evitando
  `[FONT_MISSING]`. **Não** reintroduzir "IBM Plex Sans/Mono", "Saira", "JetBrains Mono"
  nos stacks sem embarcar os `.woff2` correspondentes via `cfg.extraFonts`.

## CSS
- `cssEntry: src/theme.css`. O bundle JS **não** importa CSS (decoupled); todo o estilo
  vem de `theme.css` → `styles.css`.

## Known render warns
- (nenhum recorrente; render check ficou 6/6, 0 bad)

## Re-sync risks
- Os previews em `.design-sync/previews/*.tsx` compõem via props reais dos componentes.
  Se as props mudarem (ex.: `Button.variant`, `NumberField.unit`), atualizar os previews.
- O self-link e o `node_modules` são recriados por clone (gitignored). Sem o self-link,
  o conversor falha em `projectFor` (não acha `package.json` do pacote).
- Grades em `.design-sync/.cache/review/*.grade.json` são gitignored; o que torna a
  verificação durável é o `_ds_sync.json` já enviado ao projeto.
