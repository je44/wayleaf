import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");
const match = source.match(/function looksLikeUrl\(value\) \{([\s\S]*?)\n\}/);
assert.ok(match, "Search URL detection should remain directly testable.");
const looksLikeUrl = Function(`"use strict"; return function (value) {${match[1]}\n};`)();

[
  "icon.svg",
  "photo.png",
  "picture.jpg",
  "archive.tar.gz",
  "report.pdf",
  "README.md",
  "types.d.ts",
  "model.ai",
  "installer.app",
  "package.zip",
  "notes.txt?download=1"
].forEach((query) => {
  assert.equal(looksLikeUrl(query), false, `${query} should stay a regular search query.`);
});

assert.equal(looksLikeUrl("https://example.com/file.svg"), true, "An explicit HTTPS URL should still open directly.");
assert.equal(looksLikeUrl("http://example.com"), true, "An explicit HTTP URL should still open directly.");
assert.equal(looksLikeUrl("www.example.com/path"), true, "A www-prefixed address should still open directly.");
assert.equal(looksLikeUrl("localhost:3000/path"), true, "A localhost address should still open directly.");
assert.equal(looksLikeUrl("example.com"), false, "An ambiguous bare dotted token should stay a regular search query.");

console.log("search URL detection fixtures passed");
