#!/usr/bin/env bash
set -euo pipefail

shopt -s nullglob
files=(test/*.test.js)

if [ ${#files[@]} -eq 0 ]; then
  echo "::error::No test files found in test/" >&2
  exit 1
fi

node --test --test-reporter=spec "${files[@]}"
