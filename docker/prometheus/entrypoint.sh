#!/bin/sh
set -eu

if [ -z "${HOST_IP:-}" ]; then
  echo "HOST_IP must be set in docker/prometheus/.env (see .env.example)" >&2
  exit 1
fi

sed "s/\${HOST_IP}/${HOST_IP}/g" /etc/prometheus/prometheus.yml.template > /tmp/prometheus.yml
exec /bin/prometheus --config.file=/tmp/prometheus.yml "$@"
