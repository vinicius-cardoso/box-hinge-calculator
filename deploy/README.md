# Deploy (systemd)

Units para rodar o Box Hinge Calculator no boot (testado no `corvax`, Ubuntu,
usuário `ubuntu`, projeto em `/home/ubuntu/box-hinge-calculator`).

Pré-requisito: o venv do backend já criado (`scripts/run.sh` cria, ou
`python3 -m venv backend/.venv && backend/.venv/bin/pip install -r backend/requirements.txt`).

```bash
# instalar / atualizar as units
sudo cp deploy/bhc-backend.service deploy/bhc-frontend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now bhc-backend bhc-frontend

# status / logs
systemctl status bhc-backend bhc-frontend
journalctl -u bhc-backend -f

# atualizar o código e reiniciar
git pull && sudo systemctl restart bhc-backend bhc-frontend
```

Frontend em `:5500`, backend em `:8000`. O HTML chama o backend no mesmo host
automaticamente. Caminhos/usuário estão fixados nos `.service` — ajuste se mudar.
