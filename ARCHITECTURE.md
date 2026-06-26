# Arquitetura

## Visão geral

```
                ┌─────────────────────────────────────────┐
                │  FRONTEND (React + Three.js / R3F)        │
                │  • painel de parâmetros (sliders/inputs)  │
                │  • viewport 3D: carrega e exibe o modelo  │
                │    gerado pelo backend (mesh do STL),     │
                │    girando lentamente na horizontal       │
                └───────────────┬───────────────────────────┘
                    POST params  │  ▲  modelo gerado (mesh STL/glTF)
                   (debounce)    ▼  │  + arquivo STEP/STL para download
                ┌─────────────────────────────────────────┐
                │  BACKEND (FastAPI + CadQuery/OpenCASCADE) │
                │  • /solve → geometria do mecanismo        │
                │  • /model → mesh para o preview           │
                │  • /export → STEP (B-rep) e STL exatos    │
                └─────────────────────────────────────────┘
```

## Decisões

1. **Fonte única da verdade: o backend gera a geometria; o preview exibe esse mesmo
   modelo.** O viewport 3D **não reconstrói uma aproximação em JS** — ele carrega o
   modelo gerado pelo backend (a mesh do próprio STL) e o exibe girando. Assim, o que
   aparece na tela é exatamente o que o usuário baixa em STEP/STL. Cada mudança de
   parâmetro dispara uma regeneração no backend (com **debounce** para suavizar);
   STEP exige o kernel B-rep (OpenCASCADE/CadQuery), que só existe no servidor.

2. **Contrato único de parâmetros.** Frontend e backend falam o mesmo JSON
   ([`docs/parameter-contract.md`](docs/parameter-contract.md)). Defaults em
   [`shared/default-params.json`](shared/default-params.json).

3. **Solver canônico no backend** ([`docs/hinge-math.md`](docs/hinge-math.md)).
   Como o preview usa a geometria gerada pelo servidor, não há solver duplicado em JS
   nem risco de divergência. (Opcional: uma animação leve de abertura pode ser feita no
   cliente apenas para efeito visual, sem valor geométrico autoritativo.)

4. **Parâmetros travados** (largura/comprimento/espessura do painel entre caixa e tampa;
   peg ≤ furo) são validados na UI e revalidados no backend.

## Estrutura de pastas

```
box-hinge-calculator/
├── README.md
├── ARCHITECTURE.md
├── shared/
│   └── default-params.json        # fonte da verdade dos defaults
├── docs/
│   ├── parameter-contract.md      # schema compartilhado frontend/backend
│   ├── hinge-math.md              # fundamentação + algoritmo do solver
│   └── claude-design-prompt.md    # >>> PROMPT para colar no Claude Design <<<
├── frontend/                      # (a popular com a saída do Claude Design)
├── backend/                       # FastAPI + CadQuery
│   ├── requirements.txt
│   ├── README.md
│   └── app/{main,models,solver,geometry}.py
├── 3d/                            # modelo de referência do usuário (Onshape)
└── img/                           # renders de referência (fechada/aberta)
```

## Fluxo de trabalho

1. **Agora:** colar `docs/claude-design-prompt.md` no Claude Design → obter o frontend.
2. Colocar a saída em `frontend/` e ligar os pontos de integração
   (`solveHinge(params)` e os botões de export) à API.
3. Implementar `backend/app/geometry.py` (CadQuery) + o teste de paridade do solver.
4. Refinar o solver (varredura de interferência) usando o modelo de `/3d` como gabarito.
