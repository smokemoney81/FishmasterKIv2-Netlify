#!/bin/bash
# Build-Script für kompletten Workspace

# Zielordner für ZIPs
DIST_DIR="dist"
mkdir -p "$DIST_DIR"

# Alte ZIPs im dist-Ordner löschen
rm -f "$DIST_DIR"/*.zip

# Name des neuen Zips (mit Zeitstempel)
ZIP_NAME="workspace_$(date +%Y%m%d_%H%M%S).zip"

echo "Erstelle $DIST_DIR/$ZIP_NAME ..."

# Alles ins ZIP, aber bestimmte Ordner/Dateien ausschließen
zip -r "$DIST_DIR/$ZIP_NAME" . \
  -x "node_modules/*" \
  -x ".git/*" \
  -x "*.zip" \
  -x "dist/*" \
  > /dev/null

echo "Fertig: $DIST_DIR/$ZIP_NAME"