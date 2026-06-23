#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

version="$(node -e "process.stdout.write(require('./manifest.json').version)")"
out_dir="dist/wayleaf-v${version}"
zip_file="${out_dir}.zip"
runtime_items=(
  _locales
  ai-submit.js
  background.js
  icons
  manifest.json
  newtab.css
  newtab.html
  newtab.js
  theme-preload.js
  vendor
  video-pip-coordinator.js
  video-pip.js
)

rm -rf "$out_dir" "$zip_file"
mkdir -p "$out_dir"

for item in "${runtime_items[@]}"; do
  cp -R "$item" "$out_dir/"
done

find "$out_dir" \( -name '.DS_Store' -o -name '._*' \) -delete
(cd "$out_dir" && zip -qr -X "../wayleaf-v${version}.zip" .)
unzip -t "$zip_file" >/dev/null

du -sh "$out_dir" "$zip_file"
