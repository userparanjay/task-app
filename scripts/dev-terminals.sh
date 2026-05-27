#!/usr/bin/env bash
# Opens one GNOME Terminal window per service (works reliably on most Linux/GNOME setups).
# Infra is already running detached via: npm run infra:up

set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if ! command -v gnome-terminal >/dev/null 2>&1; then
  echo "gnome-terminal is not installed. Use: npm run dev:concurrent"
  exit 1
fi

# Each gnome-terminal call opens its own window (same pattern as the original dev script).
gnome-terminal --tab --title="Docker Logs" -- bash -c "cd \"$ROOT\" && docker compose logs -f; exec bash"
gnome-terminal --tab --title="API Gateway" -- bash -c "cd \"$ROOT/taskflow-backend/api-gateway\" && npm run dev; exec bash"
gnome-terminal --tab --title="Auth Service" -- bash -c "cd \"$ROOT/taskflow-backend/auth-service\" && npm run dev; exec bash"
gnome-terminal --tab --title="Task Service" -- bash -c "cd \"$ROOT/taskflow-backend/task-service\" && npm run dev; exec bash"
gnome-terminal --tab --title="Email Service" -- bash -c "cd \"$ROOT/taskflow-backend/email-service\" && npm run dev; exec bash"
gnome-terminal --tab --title="Notification Service" -- bash -c "cd \"$ROOT/taskflow-backend/notification-service\" && npm run dev; exec bash"
gnome-terminal --tab --title="Frontend" -- bash -c "cd \"$ROOT/taskflow-frontend\" && npm run dev; exec bash"

echo "Opened 7 terminal windows (Docker logs + 6 services)."
