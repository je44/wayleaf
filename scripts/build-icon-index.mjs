#!/usr/bin/env node
// Regenerate icons/sites/index.json from the files actually on disk.
//
// The runtime treats index.json as the source of truth for "does this local
// icon exist" (availableSiteIconFiles in newtab.js). If a bundled SVG is added
// or removed without updating index.json, the registry drifts: deleted icons
// 404 and never fall back to the cloud provider, and added icons stay invisible.
// Running this before packaging keeps the registry == the bundle, so drift can
// never ship. Idempotent.
import { readdirSync, writeFileSync } from "node:fs";

const dirUrl = new URL("../icons/sites/", import.meta.url);
const indexUrl = new URL("../icons/sites/index.json", import.meta.url);

const files = readdirSync(dirUrl)
  .filter((name) => name !== "index.json" && !name.startsWith("."))
  .sort();

writeFileSync(indexUrl, `${JSON.stringify(files, null, 2)}\n`);
console.log(`build-icon-index: wrote ${files.length} entries to icons/sites/index.json`);
