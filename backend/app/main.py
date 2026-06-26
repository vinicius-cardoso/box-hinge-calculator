"""API FastAPI: resolve o mecanismo e exporta STEP/STL.

Rodar:  uvicorn app.main:app --reload  (a partir de backend/)
"""
from __future__ import annotations

from pathlib import Path
from tempfile import mkdtemp

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from . import geometry, solver
from .models import Params, SolveResult

app = FastAPI(title="Box Hinge Calculator API", version="0.1.0")

# Durante o dev o frontend roda em outra porta (Vite). Restringir em produção.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/solve", response_model=SolveResult)
def solve_endpoint(params: Params) -> SolveResult:
    """Resolve a geometria do mecanismo de 4 barras. O frontend pode chamar isto para
    validação autoritativa (o preview já roda o mesmo algoritmo localmente)."""
    return solver.solve(params)


@app.post("/export/{fmt}")
def export_endpoint(fmt: str, params: Params) -> FileResponse:
    """Gera e devolve o arquivo CAD ('step' ou 'stl')."""
    if fmt not in ("step", "stl"):
        raise HTTPException(400, "formato deve ser 'step' ou 'stl'")
    try:
        path = geometry.export(params, fmt, Path(mkdtemp()))
    except ValueError as e:
        raise HTTPException(422, str(e))
    return FileResponse(path, filename=path.name)
