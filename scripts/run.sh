#!/usr/bin/env bash
# Box Hinge Calculator — sobe backend (FastAPI/CadQuery) + frontend (estático).
# Uso:  scripts/run.sh            (portas padrão 8000/5500)
#       BACK_PORT=8000 FRONT_PORT=5500 scripts/run.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACK_PORT="${BACK_PORT:-8000}"
FRONT_PORT="${FRONT_PORT:-5500}"

# --- backend ---
cd "$ROOT/backend"
if [ ! -d .venv ]; then
  echo "[setup] criando venv + instalando dependências (cadquery pode demorar)…"
  python3 -m venv .venv
  ./.venv/bin/pip install -q --upgrade pip wheel
  ./.venv/bin/pip install -q -r requirements.txt
fi

pkill -f "uvicorn app.main" 2>/dev/null || true
pkill -f "http.server ${FRONT_PORT}" 2>/dev/null || true
sleep 1

mkdir -p "$ROOT/.run"
nohup ./.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port "$BACK_PORT" --log-level warning \
  > "$ROOT/.run/backend.log" 2>&1 &
echo "[ok] backend  → porta $BACK_PORT (log: .run/backend.log)"

# --- frontend (estático) ---
cd "$ROOT"
nohup python3 -m http.server "$FRONT_PORT" --directory design --bind 0.0.0.0 \
  > "$ROOT/.run/frontend.log" 2>&1 &
echo "[ok] frontend → porta $FRONT_PORT (log: .run/frontend.log)"

HOST="$(hostname -I 2>/dev/null | awk '{print $1}')"
echo
echo "Abra:  http://${HOST:-<host>}:${FRONT_PORT}/Box%20Hinge%20Calculator.html"
echo "(o frontend chama o backend automaticamente em <mesmo-host>:${BACK_PORT})"
