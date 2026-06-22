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
  /let googleAiModeExitTimer = 0;/,
  "Google AI mode should keep a timer for its soft exit animation."
);

assert.match(
  source,
  /const GOOGLE_AI_MODE_EXIT_MS = 480;/,
  "Google AI mode should use a softer dedicated exit duration than the compact AI pill exit."
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

assert.match(
  source,
  /function exitGoogleAiSearchMode\(\) \{[\s\S]*googleAiSearchModeActive = false;[\s\S]*startGoogleAiModeExit\(\);[\s\S]*updateQuickSearchModeUi\(\);/,
  "Exiting Google AI mode should enter a soft visual exit state before normal search styling fully returns."
);

assert.match(
  source,
  /function startGoogleAiModeExit\(\) \{[\s\S]*setAttribute\("data-google-ai-exiting", ""\);[\s\S]*window\.clearTimeout\(googleAiModeExitTimer\);[\s\S]*removeAttribute\("data-google-ai-exiting"\);[\s\S]*prefersReducedMotion\(\) \? 0 : GOOGLE_AI_MODE_EXIT_MS/,
  "Google AI mode exit state should clean itself up after the shared AI-mode exit duration."
);

assert.match(
  source,
  /function updateQuickSearchLeadingIcon\(\) \{[\s\S]*toggleAttribute\("data-google-ai-active", googleAiSearchModeActive\);[\s\S]*if \(googleAiSearchModeActive\) \{[\s\S]*window\.clearTimeout\(googleAiModeExitTimer\);[\s\S]*removeAttribute\("data-google-ai-exiting"\);/,
  "Re-entering Google AI mode should cancel any pending soft-exit state."
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
  /@property --google-ai-edge-alpha\s*\{[\s\S]*syntax:\s*"<number>";[\s\S]*initial-value:\s*1;/,
  "Google AI mode should animate a typed alpha property for soft exit."
);

assert.match(
  styles,
  /\.search-workbench\[data-google-ai-active\],\s*\.search-workbench\[data-google-ai-exiting\]\s*\{[\s\S]*--google-ai-edge-alpha:\s*1;/,
  "Google AI mode active and exiting states should start from a visible rainbow edge."
);

assert.match(
  styles,
  /\.search-workbench\[data-google-ai-exiting\]\s*\{[\s\S]*animation:\s*googleAiModeEdgeExit 480ms linear forwards;/,
  "Google AI exiting state should softly fade the rainbow edge over its dedicated exit duration."
);

const googleAiGlowRule = styles.match(/\.search-workbench\[data-google-ai-active\]::before,\s*\.search-workbench\[data-google-ai-exiting\]::before\s*\{[^}]*\}/)?.[0] || "";

assert.match(
  googleAiGlowRule,
  /z-index:\s*1;[\s\S]*height:\s*64px;[\s\S]*rgb\(66 133 244 \/ var\(--google-ai-edge-alpha\)\)[\s\S]*filter:\s*blur\(8px\);[\s\S]*transform:\s*scale\(var\(--search-panel-scale\)\);[\s\S]*animation:\s*googleAiBorderFlow 1\.8s linear infinite;/,
  "Google AI mode should add an 8px animated rainbow edge glow around the active search box."
);

const googleAiPanelRule = styles.match(/\.search-workbench\[data-google-ai-active\] \.search-panel,\s*\.search-workbench\[data-google-ai-exiting\] \.search-panel\s*\{[^}]*\}/)?.[0] || "";

assert.match(
  googleAiPanelRule,
  /border-color:\s*var\(--line\);/,
  "Google AI active and exiting states should keep the panel body on the ordinary background and border to avoid interior flicker."
);

const googleAiPanelEdgeRule = styles.match(/\.search-workbench\[data-google-ai-active\] \.search-panel::before,\s*\.search-workbench\[data-google-ai-exiting\] \.search-panel::before\s*\{[^}]*\}/)?.[0] || "";

assert.match(
  googleAiPanelEdgeRule,
  /padding:\s*1px;[\s\S]*rgb\(66 133 244 \/ var\(--google-ai-edge-alpha\)\)[\s\S]*animation:\s*googleAiBorderFlow 1\.8s linear infinite;[\s\S]*mask-composite:\s*exclude;/,
  "Google AI outline should render as a separate 1px edge layer instead of changing the panel background stack."
);

assert.match(
  styles,
  /\.search-panel\s*\{[\s\S]*z-index:\s*2;[\s\S]*overflow:\s*hidden;[\s\S]*background:\s*var\(--input-bg\);/,
  "The opaque search panel should sit above the glow layer so the glow only appears around the edge."
);

assert.match(
  styles,
  /@keyframes googleAiBorderFlow\s*\{[\s\S]*--google-ai-border-angle:\s*450deg;/,
  "Google AI mode should flow the rainbow outline around the search box."
);

assert.match(
  styles,
  /@keyframes googleAiModeEdgeExit\s*\{[\s\S]*--google-ai-edge-alpha:\s*0;/,
  "Google AI mode should fade its rainbow edge out during exit."
);

console.log("google ai mode search fixtures passed");
