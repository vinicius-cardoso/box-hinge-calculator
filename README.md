# Box Hinge Calculator

Ferramenta paramétrica para projetar uma **caixa com tampa e dobradiça de 4 barras**
("box lid with 4-bar hinge"). O usuário ajusta dimensões (caixa, tampa, barras, furos)
e o sistema resolve o mecanismo para a tampa **abrir sem interferir** com a caixa,
terminando com uma folga ajustável (2 mm por padrão). Tudo com preview 3D ao vivo,
girando lentamente, e exportação em **STEP / STL**.

## Como funciona

- **Frontend** (React + Three.js): preview 3D paramétrico, animação de abertura,
  exportação STL local.
- **Backend** (FastAPI + CadQuery/OpenCASCADE): geometria exata e exportação STEP/STL.
- **Solver de 4 barras**: calcula automaticamente pivôs e barras (síntese de dois
  pontos + verificação de interferência). Ver [`docs/hinge-math.md`](docs/hinge-math.md).

Visão completa em [`ARCHITECTURE.md`](ARCHITECTURE.md).

## Estado do projeto

- [x] Estrutura, contrato de parâmetros e fundamentação do solver
- [x] Esqueleto do backend (FastAPI) + solver inicial
- [x] Prompt do frontend → [`docs/claude-design-prompt.md`](docs/claude-design-prompt.md)
- [ ] Frontend (gerado pelo Claude Design) integrado em `frontend/`
- [ ] `geometry.py` (CadQuery) + exportação STEP/STL
- [ ] Teste de paridade do solver (JS × Python)

## Referência

`/3d` e `/img` contêm o modelo Onshape e os renders originais do usuário, usados para
calibrar os valores padrão (caixa ~62×30×22 mm, furo Ø2, peg Ø1,9, barra ~3,5 mm).
