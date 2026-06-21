import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");

function sourceFunction(name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `${name} should exist.`);
  const bodyStart = source.indexOf("{", start);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    if (source[index] === "{") {
      depth += 1;
    } else if (source[index] === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(start, index + 1);
      }
    }
  }
  throw new Error(`${name} should have a complete function body.`);
}

const helpers = Function(`"use strict";
${source.match(/const GOOGLE_AI_MODE_COMMAND = "[^"]+";/)?.[0] || ""}
${source.match(/const GOOGLE_AI_MODE_SEARCH_URL = "[^"]+";/)?.[0] || ""}
${sourceFunction("googleAiModeQuery")}
${sourceFunction("googleAiModeDestination")}
return { GOOGLE_AI_MODE_COMMAND, GOOGLE_AI_MODE_SEARCH_URL, googleAiModeQuery, googleAiModeDestination };
`)();

assert.equal(helpers.GOOGLE_AI_MODE_COMMAND, "/ai", "Google AI mode should use the requested /ai command.");
assert.equal(helpers.GOOGLE_AI_MODE_SEARCH_URL, "https://www.google.com/ai", "Google AI mode should use Google's stable AI entrypoint.");
assert.equal(helpers.googleAiModeQuery("/ai"), "", "/ai alone should open blank Google AI mode.");
assert.equal(helpers.googleAiModeQuery("/ai Wayleaf 路由测试"), "Wayleaf 路由测试", "/ai should strip the command and preserve query text.");
assert.equal(helpers.googleAiModeQuery("/AI Search Labs"), "Search Labs", "/ai matching should be case-insensitive.");
assert.equal(helpers.googleAiModeQuery("/aigc tools"), null, "Partial /ai prefixes should remain ordinary search text.");
assert.equal(helpers.googleAiModeQuery("Google AI mode"), null, "Ordinary Google searches should stay ordinary.");

{
  const url = new URL(helpers.googleAiModeDestination("Wayleaf 路由测试"));
  assert.equal(url.href, "https://www.google.com/ai?q=Wayleaf+%E8%B7%AF%E7%94%B1%E6%B5%8B%E8%AF%95", "Google AI mode should carry the prompt through q.");
  assert.equal(url.searchParams.get("q"), "Wayleaf 路由测试", "Google AI query text should round-trip through URLSearchParams.");
}

assert.match(
  source,
  /function submitEngineQuickSearch\(engine, query\) \{[\s\S]*const googleAiQuery = googleAiModeQuery\(query\);[\s\S]*engine\?\.id === "google" && googleAiQuery !== null[\s\S]*window\.location\.assign\(googleAiModeDestination\(googleAiQuery\)\);[\s\S]*const localUrl = localhostUrl\(query\);/,
  "Only the selected Google search engine should route /ai queries before normal search handling."
);

console.log("google ai mode search fixtures passed");
