import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const manifest = JSON.parse(readFileSync(new URL("../manifest.json", import.meta.url), "utf8"));
const source = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");

assert.ok(manifest.permissions.includes("search"), "Chrome default search requires the search permission.");
assert.match(source, /const DEFAULT_LOCAL_SEARCH_ENGINE = "browser";/, "Regular search should default to the browser provider.");
assert.match(source, /const EDITABLE_LOCAL_SEARCH_ENGINE_IDS = \["browser"\];/, "Store builds must not replace Chrome's default with a persisted horizontal provider.");
assert.match(source, /\{ id: "browser", label: "Chrome default", labelKey: "browserDefaultSearch", chromeDefault: true \}/, "The browser-default option should be explicit.");
assert.match(source, /chrome\.search\.query\(\{ text: query, disposition: "CURRENT_TAB" \}\)/, "Regular search should use the Chrome Search API.");

console.log("Chrome search policy checks passed.");
