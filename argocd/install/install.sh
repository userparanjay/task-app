#!/usr/bin/env bash
# Install Argo CD into cluster (run once)
set -euo pipefail

ARGOCD_VERSION="${ARGOCD_VERSION:-stable}"

echo "Creating namespace argocd..."
kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -

echo "Installing Argo CD (${ARGOCD_VERSION})..."
kubectl apply -n argocd -f "https://raw.githubusercontent.com/argoproj/argo-cd/${ARGOCD_VERSION}/manifests/install.yaml"

echo "Waiting for Argo CD server..."
kubectl wait --for=condition=available deployment/argocd-server -n argocd --timeout=300s

echo ""
echo "Argo CD installed."
echo ""
echo "Get admin password:"
echo "  kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' | base64 -d; echo"
echo ""
echo "Port-forward UI:"
echo "  kubectl port-forward svc/argocd-server -n argocd 8080:443"
echo "  open https://localhost:8080  (user: admin, accept self-signed cert)"
echo ""
echo "Then register apps:"
echo "  kubectl apply -f argocd/projects/taskflow.yaml"
echo "  kubectl apply -f argocd/applications/root.yaml"
