import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../newtab.css", import.meta.url), "utf8");

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
${sourceFunction("googleAiModeDestination")}
${sourceFunction("googleAiModeHistoryUrl")}
return { GOOGLE_AI_MODE_COMMAND, GOOGLE_AI_MODE_SEARCH_URL, googleAiModeDestination, googleAiModeHistoryUrl };
`)();

assert.equal(helpers.GOOGLE_AI_MODE_COMMAND, "/ai", "Google AI mode should use the requested /ai command.");
assert.equal(helpers.GOOGLE_AI_MODE_SEARCH_URL, "https://www.google.com/ai", "Google AI mode should use Google's stable AI entrypoint.");
assert.equal(helpers.googleAiModeHistoryUrl(new URL("https://www.google.com/ai?q=Wayleaf")), true, "Google AI entrypoint history should be visible in Google AI mode.");
assert.equal(helpers.googleAiModeHistoryUrl(new URL("https://www.google.com/search?udm=50&q=Wayleaf")), true, "Google AI redirected search history should be visible in Google AI mode.");
assert.equal(helpers.googleAiModeHistoryUrl(new URL("https://www.google.com/search?q=Wayleaf")), false, "Ordinary Google search history should not leak into Google AI mode.");
assert.equal(helpers.googleAiModeHistoryUrl(new URL("https://www.bilibili.com/video/BV1")), false, "Non-Google history should not leak into Google AI mode.");

{
  const url = new URL(helpers.googleAiModeDestination("Wayleaf 路由测试"));
  assert.equal(url.href, "https://www.google.com/ai?q=Wayleaf+%E8%B7%AF%E7%94%B1%E6%B5%8B%E8%AF%95", "Google AI mode should carry the prompt through q.");
  assert.equal(url.searchParams.get("q"), "Wayleaf 路由测试", "Google AI query text should round-trip through URLSearchParams.");
}

assert.match(
  source,
  /let googleAiSearchModeActive = false;/,
  "Google AI mode should be a local search mode state, not a normal AI engine."
);

assert.match(
  source,
  /function handleQuickSearchInput\(\) \{[\s\S]*activateGoogleAiSearchModeFromInput\(\)[\s\S]*searchAiCommand\(quickSearchInput\.value\)/,
  "Typing the complete /ai command should activate Google AI mode before regular AI command parsing."
);

assert.match(
  source,
  /function activateGoogleAiSearchModeFromInput\(\) \{[\s\S]*normalizeText\(quickSearchInput\.value\)\.toLowerCase\(\) !== GOOGLE_AI_MODE_COMMAND[\s\S]*googleAiSearchModeActive = true;[\s\S]*quickSearchInput\.value = "";[\s\S]*hideSearchSuggestions\(\);/,
  "Google AI mode should activate only on the complete /ai command and clear the command from the input."
);

assert.match(
  source,
  /function canActivateGoogleAiSearchMode\(\) \{[\s\S]*selectedLocalSearchEngine === "google"/,
  "Google AI mode should only activate when Google is the selected default search engine."
);

assert.match(
  source,
  /function activeSearchSuggestionScope\(\) \{[\s\S]*googleAiSearchModeActive[\s\S]*return googleAiSearchSuggestionScope\(\);[\s\S]*platformSearchTargetById/,
  "Google AI mode should use its own scoped history lane before ordinary platform or AI scopes."
);

assert.match(
  source,
  /function googleAiSearchSuggestionScope\(\) \{[\s\S]*siteKeys:\s*\["google\.com"\][\s\S]*googleAiMode:\s*true/,
  "Google AI mode suggestions should stay on the Google AI history path."
);

assert.match(
  source,
  /function localSearchMatchesScope\(item, scope\) \{[\s\S]*scope\.siteKeys\.includes\(siteKey\)[\s\S]*!scope\.googleAiMode \|\| googleAiModeHistoryUrl\(url\)/,
  "Google AI mode should filter scoped suggestions by AI-mode URL shape, not only the Google domain."
);

assert.match(
  source,
  /function submitEngineQuickSearch\(engine, query\) \{[\s\S]*engine\?\.id === "google" && googleAiSearchModeActive[\s\S]*window\.location\.assign\(googleAiModeDestination\(query\)\);[\s\S]*const localUrl = localhostUrl\(query\);/,
  "In Google AI mode, Enter should send the current input directly to google.com/ai."
);

assert.match(
  source,
  /function handleQuickSearchInputKeydown\(event\) \{[\s\S]*event\.key === "Escape"[\s\S]*googleAiSearchModeActive[\s\S]*exitGoogleAiSearchMode\(\);[\s\S]*event\.key === "Backspace"[\s\S]*googleAiSearchModeActive && quickSearchInput\.value\.length === 0[\s\S]*exitGoogleAiSearchMode\(\);/,
  "Escape or Backspace on an empty input should exit Google AI mode without blurring the search box."
);

assert.doesNotMatch(
  source,
  /function googleAiModeQuery/,
  "The old /ai plus query parser should not remain after switching to an activated mode."
);

assert.match(
  source,
  /quickSearchWithGoogleAi:\s*"使用 Google AI搜索"/,
  "Google AI mode should expose the requested Chinese hint text."
);

assert.match(
  source,
  /function createSearchEngineSuggestion\(query\) \{[\s\S]*hint:\s*googleAiSearchModeActive[\s\S]*t\("quickSearchWithGoogleAi"\)[\s\S]*selectedEngine[\s\S]*t\("quickSearchWith"/,
  "Google AI mode should use a dedicated suggestion hint while normal Google search keeps the default label."
);

assert.match(
  source,
  /function searchEngineSearchIcon\(\) \{[\s\S]*tdesignIcon\(googleAiSearchModeActive \? "ai-search" : "search"\)/,
  "The leading search icon should switch to tdesign:ai-search while Google AI mode is active."
);

assert.match(
  styles,
  /@property --google-ai-border-angle\s*\{[\s\S]*syntax:\s*"<angle>";[\s\S]*initial-value:\s*90deg;/,
  "Google AI mode should animate its rainbow outline with a typed angle custom property."
);

assert.match(
  styles,
  /\.search-workbench\[data-google-ai-active\] \.search-panel\s*\{[\s\S]*border:\s*1px solid transparent;[\s\S]*conic-gradient\(from var\(--google-ai-border-angle\), #4285f4, #34a853, #fbbc05, #ea4335, #a142f4, #4285f4\) border-box;[\s\S]*animation:\s*googleAiBorderFlow 1\.8s linear infinite;/,
  "Google AI mode should render a 1px animated rainbow gradient search-box outline."
);

assert.match(
  styles,
  /@keyframes googleAiBorderFlow\s*\{[\s\S]*--google-ai-border-angle:\s*450deg;/,
  "Google AI mode should flow the rainbow outline around the search box."
);

console.log("google ai mode search fixtures passed");
