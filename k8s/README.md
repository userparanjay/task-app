# Taskflow Kubernetes

Deploy the full stack (infra + microservices + frontend).

## Prerequisites

- Cluster running (e.g. Minikube)
- Images on Docker Hub (or build and set `image` in each Deployment):
  - `pnajan/taskflow-auth-service:v1`
  - `pnajan/taskflow-task-service:v1`
  - `pnajan/taskflow-notification-service:v1`
  - `pnajan/taskflow-email-service:v1`
  - `pnajan/taskflow-api-gateway:v1`
  - `pnajan/taskflow-fe:v1`

## Deploy

```bash
kubectl apply -k k8s/

# Create tables (required once on fresh Postgres PVC)
kubectl apply -f k8s/jobs/
kubectl wait job/db-migrate -n taskflow --for=condition=complete --timeout=120s
```

Without this step, **signup returns 500** (`public.users` does not exist).

## Local access

If port-forward says **address already in use**, forwards are already running — open the URLs below.

- **App:** http://localhost:3000  
- **API:** http://localhost:5000  

```bash
# API
kubectl port-forward -n taskflow svc/api-gateway 5000:5000

# Frontend
kubectl port-forward -n taskflow svc/frontend 3000:80

# Kafka UI (compose used :8081)
kubectl port-forward -n taskflow svc/kafka-ui 8081:8080

# Bull Board (compose used :3001)
kubectl port-forward -n taskflow svc/bullmq-ui 3001:3000
```

### Ingress (optional)

```bash
minikube addons enable ingress
echo "$(minikube ip) taskflow.local" | sudo tee -a /etc/hosts
```

Open http://taskflow.local — API at http://taskflow.local/api

Rebuild frontend with `VITE_API_BASE_URL=/api` for Ingress to work.

## Secrets

Update before production:

- `auth-service/secret.yaml` — `JWT_SECRET`
- `task-service/secret.yaml` — same `JWT_SECRET`
- `notification-service/secret.yaml`
- `email-service` SMTP — create secret without committing passwords:

```bash
kubectl create secret generic email-service-secret -n taskflow \
  --from-literal=EMAIL_USER='you@gmail.com' \
  --from-literal=EMAIL_PASS='16charAppPasswordNoSpaces' \
  --from-literal=EMAIL_TO='you@gmail.com' \
  --dry-run=client -o yaml | kubectl apply -f -
kubectl rollout restart deployment/email-service -n taskflow
```

Gmail App Password must be **16 characters with no spaces**. `EMAIL_USER` must be the same Google account (Gmail or Google Workspace).
- `infra/postgres/secret.yaml` — DB password

## Kafka note

Kafka Deployment uses `enableServiceLinks: false` because a Service named `kafka` injects `KAFKA_PORT` and breaks the Confluent image.
