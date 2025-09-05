#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Entferne alte ZIPs..."
rm -f *.zip || true
git rm --cached *.zip 2>/dev/null || true

echo "🔧 Setze replit.nix auf Node 18..."
cat > replit.nix <<'NIX'
{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.nodePackages.npm
    pkgs.cacert
  ];
}
NIX

echo "🔧 Setze .replit..."
cat > .replit <<'CONF'
run = "npm run start"
language = "nodejs"
CONF

echo "🔧 Prüfe/aktualisiere package.json..."
node - <<'NODE'
const fs = require('fs');
if (!fs.existsSync('package.json')) process.exit(0);
let pkg = JSON.parse(fs.readFileSync('package.json','utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts.start = "vite preview --host 0.0.0.0 --port $PORT";
pkg.scripts.dev   = "vite --host 0.0.0.0 --port $PORT";
pkg.scripts.preview = "vite preview --host 0.0.0.0 --port $PORT";
fs.writeFileSync('package.json', JSON.stringify(pkg,null,2));
NODE

if [ ! -f vite.config.js ]; then
  echo "🔧 Erstelle vite.config.js..."
  cat > vite.config.js <<'VC'
import { defineConfig } from 'vite'
export default defineConfig({
  server:  { host: true, port: Number(process.env.PORT) || 5173 },
  preview: { host: true, port: Number(process.env.PORT) || 5173 }
})
VC
fi

echo "📦 Installiere Abhängigkeiten..."
npm install

echo "🏗️ Baue Projekt..."
npm run build || true

echo "🚀 Starte Projekt..."
npm run start
