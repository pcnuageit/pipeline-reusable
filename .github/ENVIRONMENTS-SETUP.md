# Configuração dos GitHub Environments e SDLC

---

## Fluxo SDLC

```
                    ┌─────────────┐
                    │  Developer  │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  feature/*  │  ← desenvolvimento
                    └──────┬──────┘
                           │ PR (code review)
                    ┌──────▼──────┐
                    │   sandbox   │  ← push aqui trigga sandbox
                    └──────┬──────┘
                           │
              ┌────────────▼────────────┐
              │  📦 Build + 🚀 Deploy   │
              │  → ALL clientes SANDBOX │
              │  → Conta 118690287580   │
              └────────────┬────────────┘
                           │
                    Validar no sandbox
                           │
                    ┌──────▼──────┐
                    │    main     │  ← merge sandbox → main
                    └──────┬──────┘
                           │
              ┌────────────▼────────────┐
              │  📦 Build + 🚀 Deploy   │
              │  → ALL clientes PROD    │
              │  → Conta 385697366782   │
              └─────────────────────────┘
```

### Regras

| Ação | Branch | Ambiente | Conta AWS |
|---|---|---|---|
| Push em `sandbox` | sandbox | sandbox | 118690287580 |
| Push em `main` | main | production | 385697366782 |
| workflow_dispatch + sandbox | qualquer | sandbox | 118690287580 |
| workflow_dispatch + production | qualquer | production | 385697366782 |

### Dia a dia do desenvolvedor

```bash
# 1. Criar feature branch a partir de sandbox
git checkout sandbox
git checkout -b feature/nova-funcionalidade

# 2. Desenvolver e commitar
git add .
git commit -m "feat: nova funcionalidade"

# 3. Push e abrir PR para sandbox
git push origin feature/nova-funcionalidade
# → PR: feature/nova-funcionalidade → sandbox
# → PR validation roda lint + build check

# 4. Merge na sandbox → deploy automático de TODOS os clientes no SANDBOX
# → Validar no sandbox

# 5. Quando estiver OK, merge sandbox → main
# → Deploy automático de TODOS os clientes em PRODUCTION
```

---

## Configuração dos Environments no GitHub

```
GitHub → Repo → Settings → Environments → New environment
```

### Environment: `sandbox`

**Secrets (Settings → Environments → sandbox → Add secret):**

| Secret | Valor |
|---|---|
| `AWS_ACCESS_KEY_ID` | Access key da conta **118690287580** |
| `AWS_SECRET_ACCESS_KEY` | Secret key da conta **118690287580** |

### Environment: `production`

**Secrets (Settings → Environments → production → Add secret):**

| Secret | Valor |
|---|---|
| `AWS_ACCESS_KEY_ID` | Access key da conta **385697366782** |
| `AWS_SECRET_ACCESS_KEY` | Secret key da conta **385697366782** |

---

## Deploy Manual (Emergência / Hotfix)

### Deploy de todos os clientes
```
GitHub → Actions → Deploy ALL Dashboards → Run workflow
  → Branch: sandbox (ou main)
  → Environment: sandbox (ou production)
  → Client: all
  → Run
```

### Deploy de 1 cliente específico
```
GitHub → Actions → Deploy ALL Dashboards → Run workflow
  → Branch: sandbox
  → Environment: sandbox
  → Client: concorrencia
  → Run
```

Ou usar o workflow individual:
```
GitHub → Actions → Deploy Dashboard — Concorrência (individual) → Run workflow
  → Environment: sandbox
  → Run
```
Test