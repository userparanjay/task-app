#!/usr/bin/env bash
set -euo pipefail

files=(
  src/app.js
  src/server.js
  src/routes/auth.routes.js
  src/routes/task.routes.js
  src/utils/forwardRequest.js
)

for file in "${files[@]}"; do
  if ! node --check "$file"; then
    echo "::error title=Build failed::Syntax check failed for ${file}" >&2
    exit 1
  fi
done

echo "Build OK: all source files passed syntax check"
