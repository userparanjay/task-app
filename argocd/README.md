# Argo CD — GitOps for Taskflow

Argo CD watches your Git repo and keeps the cluster in sync with `k8s/`.

```
GitHub (task-app)  →  Argo CD  →  Kubernetes (namespace: taskflow)
```

**Dockerfile → cluster:** Argo CD does not build images. See [DOCKER-WORKFLOW.md](./DOCKER-WORKFLOW.md) and `scripts/build-and-push-images.sh`.

## Architecture

| Argo CD resource | Purpose |
|------------------|---------|
| `projects/taskflow.yaml` | AppProject — allowed repo + namespace |
| `applications/taskflow.yaml` | Syncs `k8s/` (all microservices + infra) |
| `applications/taskflow-db-migrate.yaml` | Syncs `k8s/jobs/` (Postgres tables) |
| `applications/root.yaml` | App-of-apps — installs the two apps above |

## 1. Install Argo CD

```bash
bash argocd/install/install.sh
```

Or manually:

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl wait --for=condition=available deployment/argocd-server -n argocd --timeout=300s
```

## 2. Open Argo CD UI

```bash
# Password (first login only)
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath='{.data.password}' | base64 -d; echo

kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Open **https://localhost:8080** → login `admin` / password above.

## 3. Register Taskflow apps

**Push your branch to GitHub first** — Argo CD pulls from the remote repo, not your laptop.

```bash
git push origin master

kubectl apply -f argocd/projects/taskflow.yaml
kubectl apply -f argocd/applications/root.yaml
```

Or apply apps individually:

```bash
kubectl apply -f argocd/applications/taskflow.yaml
kubectl apply -f argocd/applications/taskflow-db-migrate.yaml
```

## 4. Sync

1. In UI: open **taskflow** → **Sync** → **Synchronize**
2. After postgres is healthy, sync **taskflow-db-migrate** once (creates `users` table, etc.)
3. Confirm **taskflow** shows **Healthy** + **Synced**

CLI:

```bash
# Install argocd CLI: https://argo-cd.readthedocs.io/en/stable/cli_installation/
argocd login localhost:8080 --username admin --insecure

argocd app sync taskflow
argocd app sync taskflow-db-migrate
argocd app wait taskflow --health
```

## 5. Change repo URL / branch

Edit `repoURL` and `targetRevision` in:

- `argocd/applications/taskflow.yaml`
- `argocd/applications/taskflow-db-migrate.yaml`
- `argocd/applications/root.yaml`

Default: `https://github.com/userparanjay/task-app.git` @ `master`.

## Secrets (important)

Placeholder secrets live in `k8s/**/secret.yaml`. For production use one of:

- [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets)
- [External Secrets Operator](https://external-secrets.io/)
- Argo CD + Vault / SOPS plugins

Do not commit real SMTP or JWT secrets to Git.

## Domain (taskflow.local)

Argo CD deploys the same manifests as `kubectl apply -k k8s/`. See [k8s/README.md](../k8s/README.md) for Ingress + `/etc/hosts`.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `ComparisonError` / repo not found | Push to GitHub; check `repoURL` |
| Signup 500 | Sync **taskflow-db-migrate** |
| OutOfSync secrets | Expected if you patch secrets live; use `ignoreDifferences` or stop tracking secrets |
| Kafka CrashLoop | See `enableServiceLinks: false` on kafka Deployment |

```bash
kubectl get applications -n argocd
argocd app get taskflow
argocd app diff taskflow
```
