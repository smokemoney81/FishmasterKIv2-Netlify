#!/usr/bin/env bash
set -euo pipefail

ts=$(date +"%Y%m%d-%H%M")
zipname="fishmasterki-netlify-$ts.zip"

rm -f fishmasterki-*.zip || true

has_pkg=false
[ -f package.json ] && has_pkg=true

build_ok=false
if $has_pkg; then
  if [ -f package-lock.json ]; then
    npm ci || npm install
  else
    npm install
  fi

  if npm run -s build; then
    build_ok=true
  fi
fi

out=""
if $build_ok; then
  for d in dist build out public; do
    [ -d "$d" ] && out="$d" && break
  done
  [ -z "$out" ] && { echo "Kein Build-Ausgabeordner gefunden."; exit 1; }
else
  if [ -f index.html ]; then
    out="."
  else
    echo "Keine index.html gefunden und Build fehlgeschlagen."
    exit 1
  fi
fi

if [ "$out" = "." ]; then
  zip -r "$zipname" . \
    -x "node_modules/*" ".git/*" "*.zip" "package-lock.json" "pnpm-lock.yaml" "yarn.lock"
else
  zip -r "$zipname" "$out"
fi

echo "✅ Fertig: $zipname"
