import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const newtabSource = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");
const iconSource = readFileSync(new URL("../wayleaf-icon.js", import.meta.url), "utf8");
const source = `${newtabSource}\n${iconSource}`;

assert.match(
  source,
  /document\.addEventListener\("dragstart",\s*preventNativeSiteIconDrag,\s*true\);/,
  "Site icon drag blocking must run in the capture phase before native link/image dragging starts."
);

assert.match(
  source,
  /function storeIconSiteContext\(icon, site\) \{[\s\S]*icon\.draggable = false;[\s\S]*icon\.dataset\.siteUrl = site\.url/,
  "Every rendered site icon must opt out of native image dragging at the shared icon boundary."
);

assert.match(
  source,
  /function preventNativeSiteIconDrag\(event\) \{[\s\S]*event\.target\?\.closest\?\.\("\.favorite-link, \.recent-folder-face, \.site-link"\)[\s\S]*event\.preventDefault\(\);[\s\S]*\}/,
  "Favorite, recent, and shared site-card links must not start native drag operations."
);
