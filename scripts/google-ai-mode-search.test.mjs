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
${source.match(/const GOOGLE_AI_MODE_SEARCH_URL = "[^"]+";/)?.[0] || ""}
${sourceFunction("googleAiModeDestination")}
${sourceFunction("googleAiModeHistoryUrl")}
return { GOOGLE_AI_MODE_SEARCH_URL, googleAiModeDestination, googleAiModeHistoryUrl };
`)();

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
  /let googleAiModeActiveStartedAt = 0;/,
  "Google AI mode should remember when the flowing border started so exit can freeze the current angle."
);

assert.match(
  source,
  /const GOOGLE_AI_MODE_EXIT_MS = 480;/,
  "Google AI mode should use a softer dedicated exit duration than the compact AI pill exit."
);

assert.match(
  source,
  /const GOOGLE_AI_MODE_REDUCED_EXIT_MS = 420;/,
  "Google AI reduced-motion exit should still cover the icon cross-fade duration."
);

assert.match(
  source,
  /quickSearchLeadingIcon\?\.addEventListener\("click", handleQuickSearchLeadingIconClick\);/,
  "The leading search icon should own Google AI mode activation."
);

assert.match(
  source,
  /quickSearchLeadingIcon\?\.addEventListener\("pointerdown", handleQuickSearchLeadingIconPointerDown\);/,
  "The leading search icon should preserve the search input focus before click toggles Google AI mode."
);

assert.match(
  source,
  /function handleQuickSearchLeadingIconClick\(\) \{[\s\S]*if \(!canActivateGoogleAiSearchMode\(\)\) \{[\s\S]*return;[\s\S]*if \(!isQuickSearchActive\(\)\) \{[\s\S]*quickSearchInput\.focus\(\{ preventScroll: true \}\);[\s\S]*setQuickSearchActive\(true\);[\s\S]*exitGoogleAiSearchMode\(\);[\s\S]*googleAiSearchModeActive = true;[\s\S]*renderLocalSearchSuggestions\(normalizeText\(quickSearchInput\.value\)\);[\s\S]*quickSearchInput\.focus\(\{ preventScroll: true \}\);/,
  "Clicking the leading search icon should toggle Google AI mode only while the search box is active and should preserve input focus and active search styling."
);

assert.match(
  source,
  /function handleQuickSearchLeadingIconPointerDown\(event\) \{[\s\S]*!canActivateGoogleAiSearchMode\(\) \|\| !isQuickSearchActive\(\)[\s\S]*event\.preventDefault\(\);[\s\S]*quickSearchInput\.focus\(\{ preventScroll: true \}\);/,
  "Pointerdown on the leading icon should not steal focus from an active search input."
);

assert.match(
  source,
  /function updateQuickSearchLeadingIcon\(\) \{[\s\S]*const available = canActivateGoogleAiSearchMode\(\);[\s\S]*quickSearchLeadingIcon\.disabled = !available;[\s\S]*quickSearchLeadingIcon\.tabIndex = active \? 0 : -1;[\s\S]*quickSearchLeadingIcon\.setAttribute\("aria-disabled", String\(!available\)\);[\s\S]*quickSearchLeadingIcon\.title = available \? quickSearchLeadingIcon\.getAttribute\("aria-label"\) : "";/,
  "The leading search icon should be disabled outside Google's ordinary search engine, drop its tooltip, and leave keyboard order until Google search is active."
);

assert.match(
  styles,
  /\.search-engine-search-icon:disabled\s*\{[\s\S]*cursor:\s*default;/,
  "The disabled leading search icon should not show a clickable cursor."
);

assert.match(
  source,
  /function isQuickSearchActive\(\) \{[\s\S]*searchWorkbench\?\.classList\.contains\("search-active"\)[\s\S]*document\.activeElement === quickSearchInput/,
  "Google AI icon activation should respect both the search-active class and the current input focus."
);

assert.doesNotMatch(
  source,
  /activateGoogleAiSearchModeFromInput|GOOGLE_AI_MODE_COMMAND/,
  "The old /ai typed activation path should not remain after switching to icon activation."
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
  /function startGoogleAiModeExit\(\) \{[\s\S]*setProperty\("--google-ai-exit-border-angle", googleAiModeExitBorderAngle\(\)\);[\s\S]*setAttribute\("data-google-ai-exiting", ""\);[\s\S]*window\.clearTimeout\(googleAiModeExitTimer\);[\s\S]*removeAttribute\("data-google-ai-exiting"\);[\s\S]*removeProperty\("--google-ai-exit-border-angle"\);[\s\S]*updateGoogleImageSearchButton\(\);[\s\S]*prefersReducedMotion\(\) \? GOOGLE_AI_MODE_REDUCED_EXIT_MS : GOOGLE_AI_MODE_EXIT_MS/,
  "Google AI mode exit state should finish before ordinary image search re-enters."
);

assert.match(
  source,
  /function updateQuickSearchLeadingIcon\(\) \{[\s\S]*toggleAttribute\("data-google-ai-active", googleAiSearchModeActive\);[\s\S]*if \(googleAiSearchModeActive\) \{[\s\S]*window\.clearTimeout\(googleAiModeExitTimer\);[\s\S]*removeAttribute\("data-google-ai-exiting"\);[\s\S]*removeProperty\("--google-ai-exit-border-angle"\);/,
  "Re-entering Google AI mode should cancel any pending soft-exit state."
);

assert.doesNotMatch(
  source,
  /function googleAiModeQuery/,
  "The old /ai plus query parser should not remain after switching to an activated mode."
);

assert.match(
  source,
  /googleAiSearchModeActive = true;[\s\S]*googleAiModeActiveStartedAt = performance\.now\(\);/,
  "Entering Google AI mode should start the border clock for a seamless exit handoff."
);

assert.match(
  source,
  /function googleAiModeExitBorderAngle\(\) \{[\s\S]*performance\.now\(\) - googleAiModeActiveStartedAt[\s\S]*% 1800[\s\S]*90 \+ \(progress \* 360\)/,
  "Exiting Google AI mode should preserve the current rainbow angle instead of restarting the flow animation."
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
  "Search suggestions should use the current Google search mode icon."
);

assert.match(
  source,
  /function updateQuickSearchLeadingIcon\(\) \{[\s\S]*search-icon-layer search-icon-regular[\s\S]*tdesignIcon\("search"\)[\s\S]*search-icon-layer search-icon-ai[\s\S]*tdesignIcon\("ai-search"\)/,
  "The leading search control should keep ordinary and Google AI icons mounted for animated switching."
);

assert.match(
  styles,
  /@property --google-ai-border-angle\s*\{[\s\S]*syntax:\s*"<angle>";[\s\S]*inherits:\s*true;[\s\S]*initial-value:\s*90deg;/,
  "Google AI mode should animate its rainbow outline with a typed angle custom property."
);

assert.match(
  styles,
  /@property --google-ai-edge-alpha\s*\{[\s\S]*syntax:\s*"<number>";[\s\S]*initial-value:\s*0;/,
  "Google AI mode should animate a typed alpha property from the ordinary transparent state."
);

assert.match(
  styles,
  /\.search-workbench\s*\{[\s\S]*--google-ai-edge-alpha:\s*0;/,
  "Google AI mode should keep its mounted visual layers transparent in ordinary mode."
);

assert.match(
  styles,
  /\.search-workbench\[data-google-ai-active\],\s*\.search-workbench\[data-google-ai-exiting\]\s*\{[\s\S]*--google-ai-edge-alpha:\s*1;/,
  "Google AI active and exiting states should only raise the shared edge layer alpha."
);

assert.match(
  styles,
  /\.search-workbench\[data-google-ai-active\]::before,\s*\.search-workbench\[data-google-ai-active\] \.search-panel\s*\{[\s\S]*animation:\s*googleAiBorderFlow 1\.8s linear infinite;/,
  "Only the visible Google AI glow and the single panel border should flow the rainbow outline."
);

assert.match(
  styles,
  /\.search-workbench\[data-google-ai-exiting\]\s*\{[\s\S]*--google-ai-border-angle:\s*var\(--google-ai-exit-border-angle,\s*90deg\);[\s\S]*animation:\s*googleAiModeEdgeExit 480ms linear forwards;/,
  "Google AI exiting state should freeze the current rainbow angle and only fade the edge."
);

assert.doesNotMatch(
  styles,
  /\.search-workbench\[data-google-ai-exiting\]\s*\{[^}]*googleAiBorderFlow/,
  "Google AI exiting state must not restart the flowing border animation."
);

const googleAiGlowRule = styles.match(/\.search-workbench::before\s*\{[^}]*\}/)?.[0] || "";

assert.match(
  googleAiGlowRule,
  /z-index:\s*1;[\s\S]*height:\s*calc\(64px \+ 2px\);[\s\S]*border-radius:\s*12px;[\s\S]*background:\s*conic-gradient\([\s\S]*from var\(--google-ai-border-angle\)[\s\S]*filter:\s*blur\(8px\);[\s\S]*transform:\s*scale\(var\(--search-panel-scale\)\);/,
  "Google AI mode should keep the original soft outer glow shape while flowing with the panel border."
);

assert.doesNotMatch(
  googleAiGlowRule,
  /mask-composite|padding:\s*9px|height:\s*calc\(64px \+ 18px\)/,
  "Google AI outer glow must not be converted into a separate ring shape."
);

const googleAiPanelRule = styles.match(/\.search-workbench\[data-google-ai-active\] \.search-panel,\s*\.search-workbench\[data-google-ai-exiting\] \.search-panel\s*\{[^}]*\}/)?.[0] || "";

assert.match(
  googleAiPanelRule,
  /linear-gradient\(var\(--input-bg\),\s*var\(--input-bg\)\) padding-box,[\s\S]*conic-gradient\([\s\S]*from var\(--google-ai-border-angle\)[\s\S]*border-box;/,
  "Google AI mode should replace the single panel border slot with the animated gradient."
);

assert.match(
  styles,
  /\.search-panel\s*\{[\s\S]*border:\s*1px solid transparent;[\s\S]*linear-gradient\(var\(--input-bg\),\s*var\(--input-bg\)\) padding-box,[\s\S]*linear-gradient\(var\(--line\),\s*var\(--line\)\) border-box;/,
  "The search panel should reserve one transparent border slot instead of stacking a second AI border."
);

assert.doesNotMatch(
  googleAiPanelRule,
  /border-color:/,
  "Google AI mode must not stack an ordinary border color under the gradient border."
);

assert.doesNotMatch(
  styles,
  /\.search-panel::after/,
  "Google AI mode must not add a second inner border layer."
);

assert.match(
  styles,
  /\.search-workbench\.search-active:not\(\[data-google-ai-active\]\):not\(\[data-google-ai-exiting\]\) \.search-panel\s*\{[\s\S]*linear-gradient\(var\(--input-bg\),\s*var\(--input-bg\)\) padding-box,[\s\S]*linear-gradient\(var\(--line-strong\),\s*var\(--line-strong\)\) border-box;/,
  "The ordinary active border should use the same single border slot as Google AI mode."
);

assert.doesNotMatch(
  styles,
  /\.search-workbench\[data-google-ai-active\] \.search-panel::before/,
  "Google AI mode should not add an inset border pseudo-element that competes with the panel background."
);

assert.match(
  styles,
  /\.search-icon-layer\s*\{[\s\S]*opacity 360ms ease,[\s\S]*transform 420ms cubic-bezier\(0\.22, 1, 0\.36, 1\),[\s\S]*filter 320ms ease;[\s\S]*\.search-icon-ai\s*\{[\s\S]*scale\(0\.82\) rotate\(-10deg\)[\s\S]*\.search-workbench\[data-google-ai-active\] \.search-icon-regular\s*\{[\s\S]*scale\(0\.82\) rotate\(10deg\)[\s\S]*\.search-workbench\[data-google-ai-active\] \.search-icon-ai\s*\{[\s\S]*opacity:\s*1;/,
  "Ordinary and Google AI search icons should use a slower, softer icon-local cross-fade."
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
