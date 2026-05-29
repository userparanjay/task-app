#!/usr/bin/env bash
# Enable Ingress and print /etc/hosts lines for taskflow.local
set -euo pipefail

DOMAIN="${TASKFLOW_DOMAIN:-taskflow.local}"
KAFKA_HOST="kafka.taskflow.local"
BULLMQ_HOST="bullmq.taskflow.local"

echo "Enabling minikube ingress addon..."
minikube addons enable ingress 2>/dev/null || true

IP="$(minikube ip 2>/dev/null || true)"
if [[ -z "$IP" ]]; then
  IP="$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}' 2>/dev/null || true)"
fi

echo ""
echo "Add these lines to /etc/hosts (sudo):"
echo ""
echo "${IP:-<INGRESS_IP>} $DOMAIN"
echo "${IP:-<INGRESS_IP>} $KAFKA_HOST"
echo "${IP:-<INGRESS_IP>} $BULLMQ_HOST"
echo ""
echo "Open in browser:"
echo "  App:        http://$DOMAIN"
echo "  API:        http://$DOMAIN/api/health"
echo "  Kafka UI:   http://$KAFKA_HOST"
echo "  Bull Board: http://$BULLMQ_HOST"
