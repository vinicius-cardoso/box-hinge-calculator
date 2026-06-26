# Backend — Box Hinge Calculator

API em FastAPI que resolve o mecanismo de 4 barras e exporta o modelo em **STEP** e
**STL** usando CadQuery (kernel OpenCASCADE).

> Estado: esqueleto. O solver tem uma implementação inicial; a geração de geometria
> (`geometry.py`) é stub e será implementada após a integração do frontend.

## Setup

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Se a instalação do CadQuery der trabalho via pip, use conda:
`conda install -c conda-forge cadquery`.

## Endpoints

| Método | Rota             | Descrição                                   |
|--------|------------------|---------------------------------------------|
| GET    | `/health`        | healthcheck                                 |
| POST   | `/solve`         | recebe `Params`, devolve `SolveResult`      |
| POST   | `/export/{fmt}`  | `fmt` = `step` \| `stl`, devolve o arquivo  |

O corpo das requisições segue [`docs/parameter-contract.md`](../docs/parameter-contract.md).

## Módulos

- `models.py` — contrato de parâmetros + validações (Pydantic).
- `solver.py` — síntese de dois pontos do mecanismo (ver `docs/hinge-math.md`).
- `geometry.py` — sólidos paramétricos + exportação (CadQuery). **A implementar.**
- `main.py` — app FastAPI.
