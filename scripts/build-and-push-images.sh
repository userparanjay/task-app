#!/usr/bin/env bash
# Build images from Dockerfiles and push to Docker Hub (or your registry).
# Argo CD does NOT build Dockerfiles — it only syncs k8s/ YAML that reference these tags.
#
# Usage:
#   export REGISTRY=pnajan          # Docker Hub username
#   export TAG=v2                   # image tag
#   docker login
#   bash scripts/build-and-push-images.sh
#
# Then update image: lines in k8s/*/deployment.yaml, git push, Argo CD sync.

set -euo pipefail

REGISTRY="${REGISTRY:-pnajan}"
TAG="${TAG:-v2}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

build() {
  local name="$1"
  local context="$2"
  shift 2
  local image="${REGISTRY}/taskflow-${name}:${TAG}"
  echo "==> Building ${image}"
  docker build -t "${image}" "$@" "${context}"
  docker push "${image}"
  echo "    OK ${image}"
}

build "auth-service" "${ROOT}/taskflow-backend/auth-service"
build "task-service" "${ROOT}/taskflow-backend/task-service"
build "notification-service" "${ROOT}/taskflow-backend/notification-service"
build "email-service" "${ROOT}/taskflow-backend/email-service"
build "api-gateway" "${ROOT}/taskflow-backend/api-gateway"

# Frontend — relative /api for Ingress domain (taskflow.local)
build "fe" "${ROOT}/taskflow-frontend" \
  --build-arg VITE_API_BASE_URL=/api \
  --build-arg VITE_AUTH_API_URL=/api/auth

echo ""
echo "Done. Update k8s deployments to :${TAG} and push Git, then Argo CD sync."
echo "Minikube local images: minikube image load ${REGISTRY}/taskflow-fe:${TAG}"
