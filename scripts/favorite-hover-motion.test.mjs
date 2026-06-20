import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const styles = readFileSync(new URL("../newtab.css", import.meta.url), "utf8");

assert.match(
  styles,
  /\.favorite-icon-shell\s*\{[\s\S]*transform:\s*scale\(1\);[\s\S]*transform-origin:\s*center;[\s\S]*transition:\s*[\s\S]*transform\s+260ms\s+cubic-bezier\(0\.18,\s*1\.36,\s*0\.32,\s*1\)/,
  "Favorite icon shells need a centered transform baseline with springy transform easing."
);

assert.match(
  styles,
  /@media\s*\(hover:\s*hover\)\s*and\s*\(pointer:\s*fine\)\s*\{[\s\S]*\.favorite-site:not\(\.pressing\):not\(\.delete-ready\):not\(\.clearing\):not\(\.removing\)\s+\.favorite-link:is\(:hover,\s*:focus-visible\)\s+\.favorite-icon-shell\s*\{[\s\S]*transform:\s*scale\(1\.05\);/,
  "Favorite icon hover motion must scale to 105% only on fine pointer hover and avoid delete/press states."
);
