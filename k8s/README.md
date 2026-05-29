# Taskflow Kubernetes

Deploy the full stack (infra + microservices + frontend).

**GitOps (Argo CD):** see [argocd/README.md](../argocd/README.md) to sync this folder from Git automatically.

## Domain access (recommended — no localhost)

Default domain: **`taskflow.local`**

| URL | Service |
|-----|---------|
| http://taskflow.local | React app |
| http://taskflow.local/api | API gateway |
| http://kafka.taskflow.local | Kafka UI |
| http://bullmq.taskflow.local | Bull Board |

### Setup (Minikube)

```bash
minikube addons enable ingress
kubectl apply -k k8s/
kubectl apply -f k8s/jobs/
kubectl wait job/db-migrate -n taskflow --for=condition=complete --timeout=120s

# Show /etc/hosts lines
bash k8s/scripts/setup-domain.sh
# Then add those lines to /etc/hosts (sudo nano /etc/hosts)
```

### Rebuild frontend for domain (required once)

The UI must call `/api` on the same host (not `localhost:5000`):

```bash
docker build -t pnajan/taskflow-fe:v2 taskflow-frontend/
minikube image load pnajan/taskflow-fe:v2   # minikube only
kubectl rollout restart deployment/frontend -n taskflow
```

Rebuild API gateway if you changed CORS in code:

```bash
docker build -t pnajan/taskflow-api-gateway:v2 taskflow-backend/api-gateway/
minikube image load pnajan/taskflow-api-gateway:v2
kubectl set image deployment/api-gateway api-gateway=pnajan/taskflow-api-gateway:v2 -n taskflow
kubectl rollout restart deployment/api-gateway -n taskflow
```

### Custom domain

1. Edit host names in `k8s/ingress.yaml` (e.g. `app.mycompany.com`)
2. Update `CORS_ORIGIN` in `k8s/api-gateway/configmap.yaml`
3. Update `server_name` in `k8s/frontend/nginx-configmap.yaml`
4. Add the domain to `/etc/hosts` (or real DNS → Ingress IP)

---

## Deploy (summary)

```bash
kubectl apply -k k8s/
kubectl apply -f k8s/jobs/
kubectl wait job/db-migrate -n taskflow --for=condition=complete --timeout=120s
```

Without DB migrate, **signup returns 500** (`public.users` does not exist).

## Localhost (optional fallback)

Only if you prefer port-forward instead of Ingress:

```bash
kubectl port-forward -n taskflow svc/frontend 3000:80
kubectl port-forward -n taskflow svc/api-gateway 5000:5000
```

- http://localhost:3000 — needs frontend built with `http://localhost:5000/api`

## Secrets

- `auth-service/secret.yaml` — `JWT_SECRET` (same value in task + notification)
- `email-service` — SMTP via `kubectl create secret` (see below)
- `infra/postgres/secret.yaml` — DB password

```bash
kubectl create secret generic email-service-secret -n taskflow \
  --from-literal=EMAIL_USER='you@gmail.com' \
  --from-literal=EMAIL_PASS='16charAppPasswordNoSpaces' \
  --from-literal=EMAIL_TO='you@gmail.com' \
  --dry-run=client -o yaml | kubectl apply -f -
kubectl rollout restart deployment/email-service -n taskflow
```

## Kafka note

Kafka Deployment uses `enableServiceLinks: false` because a Service named `kafka` injects `KAFKA_PORT` and breaks the Confluent image.
