# Dockerfile ↔ Argo CD — how they work together

Argo CD **only syncs Kubernetes YAML** from Git (`k8s/`). It does **not** read or build `Dockerfile`s.

```
Dockerfile  →  docker build  →  docker push  →  image in registry
                                                      ↓
Git (k8s/*.yaml image: tag)  →  Argo CD sync  →  Pods pull new image
```

## Two workflows

### A. Docker Compose (local dev)

Uses `docker-compose.yml` at repo root + per-service compose files:

```bash
docker compose up -d          # infra: postgres, kafka, redis
# build & run services from each service's Dockerfile via compose
```

Compose builds from Dockerfile **on your machine** — no Argo CD involved.

### B. Kubernetes + Argo CD (cluster)

1. **Build** from Dockerfile  
2. **Push** to a registry (Docker Hub, GHCR, etc.)  
3. **Set** `image: registry/name:tag` in `k8s/**/deployment.yaml`  
4. **Push** Git  
5. **Argo CD sync** (or auto-sync) applies Deployments → cluster pulls new image  

## Build all app images

```bash
docker login
export REGISTRY=pnajan    # your Docker Hub user
export TAG=v2
bash scripts/build-and-push-images.sh
```

## Point Kubernetes at the new tag

Edit each deployment, e.g. `k8s/auth-service/deployment.yaml`:

```yaml
image: pnajan/taskflow-auth-service:v2
```

Or use one tag everywhere and search-replace `v1` → `v2`.

## Argo CD picks it up

```bash
git add k8s/
git commit -m "Bump images to v2"
git push origin master

# CLI
argocd app sync taskflow

# Or wait if automated sync is on
```

Argo CD updates Deployments; Kubernetes does a **rolling restart** with the new image.

## Minikube (no registry push)

Build and load into Minikube’s Docker daemon:

```bash
eval $(minikube docker-env)
docker build -t pnajan/taskflow-auth-service:v2 taskflow-backend/auth-service/
# ... repeat for each service
kubectl rollout restart deployment/auth-service -n taskflow
```

Or: `docker build` on host → `minikube image load pnajan/taskflow-fe:v2`

Argo CD still syncs YAML; image must exist on the node.

## What Argo CD never does

| Argo CD | Docker / Compose |
|---------|------------------|
| Sync `k8s/*.yaml` | Build from `Dockerfile` |
| Watch Git branch | `docker compose up` |
| Deploy to cluster | Run containers locally |

## Optional: CI builds Dockerfile on every push

GitHub Actions (example flow):

1. Push code → Action runs `docker build` + `docker push`  
2. Action updates image tag in `k8s/` (or commits to a env branch)  
3. Argo CD detects Git change → sync  

That connects Dockerfile changes to Argo CD **through Git + registry**, not directly.

## Service map

| Dockerfile | K8s deployment | Default image |
|------------|----------------|---------------|
| `taskflow-backend/auth-service/Dockerfile` | `k8s/auth-service/` | `pnajan/taskflow-auth-service:v1` |
| `taskflow-backend/task-service/Dockerfile` | `k8s/task-service/` | `pnajan/taskflow-task-service:v1` |
| `taskflow-backend/notification-service/Dockerfile` | `k8s/notification-service/` | `pnajan/taskflow-notification-service:v1` |
| `taskflow-backend/email-service/Dockerfile` | `k8s/email-service/` | `pnajan/taskflow-email-service:v1` |
| `taskflow-backend/api-gateway/Dockerfile` | `k8s/api-gateway/` | `pnajan/taskflow-api-gateway:v1` |
| `taskflow-frontend/Dockerfile` | `k8s/frontend/` | `pnajan/taskflow-fe:v2` |

Infra (postgres, redis, kafka) use public images — no app Dockerfile.
