#!/usr/bin/env bash
set -euo pipefail

say(){ printf "\n\033[1;32m%s\033[0m\n" "$*"; }
warn(){ printf "\n\033[1;33m%s\033[0m\n" "$*"; }
err(){ printf "\n\033[1;31m%s\033[0m\n" "$*"; }

say "🔧 Schreibe replit.nix (Node 18 + npm + CA-Zertifikate)…"
cat > replit.nix <<'NIX'
{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.nodePackages.npm
    pkgs.cacert
  ];
}
NIX

say "🔧 Schreibe .replit (korrektes TOML)…"
cat > .replit <<'TOML'
run = "npm run start"
language = "nodejs"
TOML

say "🧹 Entferne große ZIPs (lokal & aus Git-Index)…"
find . -maxdepth 2 -name "*.zip" -print -delete || true
git rm --cached *.zip 2>/dev/null || true

# Falls npm noch nicht verfügbar ist (Recovery-Mode / noch kein Rebuild)
if ! command -v npm >/dev/null 2>&1; then
  warn "npm ist noch nicht verfügbar. In Replit oben auf '⋯ → Rebuild environment' klicken und dieses Script danach NOCHMAL ausführen:"
  warn "bash replit_fix.sh"
  exit 0
fi

say "📦 Lese/patchte package.json (Vite/CRA/statisch)…"
node - <<'NODE'
const fs = require('fs');
if (!fs.existsSync('package.json')) {
  console.error('package.json fehlt – hier ist nichts zu patchen.');
  process.exit(1);
}
const pkg = JSON.parse(fs.readFileSync('package.json','utf8'));
pkg.scripts = pkg.scripts || {};

const buildStr = (pkg.scripts.build || '');
const isVite = !!(buildStr.includes('vite') || (pkg.devDependencies && pkg.devDependencies.vite) || (pkg.dependencies && pkg.dependencies.vite));
const isCRA  = buildStr.includes('react-scripts');

if (isVite) {
  pkg.scripts.dev = 'vite --host 0.0.0.0 --port $PORT';
  pkg.scripts.preview = 'vite preview --host 0.0.0.0 --port $PORT';
  pkg.scripts.start = pkg.scripts.preview;
} else if (isCRA) {
  // CRA: serve benutzt den Build-Ordner
  pkg.scripts.start = 'serve -s build -l $PORT';
  if (!pkg.devDependencies) pkg.devDependencies = {};
  if (!pkg.devDependencies.serve && !(pkg.dependencies && pkg.dependencies.serve)) {
    pkg.devDependencies.serve = '^14.2.0';
  }
} else {
  // Statisch: http-server auf Root
  pkg.scripts.start = 'http-server . -p $PORT --silent';
  if (!pkg.devDependencies) pkg.devDependencies = {};
  if (!pkg.devDependencies['http-server'] && !(pkg.dependencies && pkg.dependencies['http-server'])) {
    pkg.devDependencies['http-server'] = '^14.1.1';
  }
}

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log(JSON.stringify({ isVite, isCRA }, null, 2));
NODE

# Minimalen vite.config.js erzeugen, wenn Vite, aber keine Config
if npm pkg get scripts.build 2>/dev/null | grep -q vite; then
  if [ ! -f vite.config.ts ] && [ ! -f vite.config.js ]; then
cat > vite.config.js <<'VC'
import { defineConfig } from 'vite'
export default defineConfig({
  server:  { host: true, port: Number(process.env.PORT) || 5173 },
  preview: { host: true, port: Number(process.env.PORT) || 5173 }
})
VC
  fi
fi

say "📦 Installiere Dependencies (npm ci/install)…"
if [ -f package-lock.json ]; then
  npm ci || npm install
else
  npm install
fi

say "🏗️  Baue Projekt falls Build-Script existiert…"
if npm pkg get scripts.build 2>/dev/null | grep -vq 'undefined'; then
  npm run -s build || warn "Build fehlgeschlagen – starte trotzdem (statischer/Preview-Server)."
fi

say "🚀 Starte App (npm run start)…"
npm run start
