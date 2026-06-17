import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../newtab.css", import.meta.url), "utf8");

assert.match(styles, /\.search-suggestions\s*\{[\s\S]*align-content:\s*start;[\s\S]*grid-auto-rows:\s*max-content;/, "Search suggestions must keep sparse symbol queries from stretching a single row.");
assert.match(source, /function searchSuggestionsNaturalContentHeight\(\) \{[\s\S]*searchSuggestions\.children[\s\S]*rowGap[\s\S]*getBoundingClientRect\(\)\.height/, "Search suggestions must measure child rows instead of relying only on container scrollHeight.");
assert.match(source, /const paddingY = searchWorkbench\?\.classList\.contains\("suggestions-open"\)[\s\S]*SEARCH_SUGGESTIONS_OPEN_PADDING_Y;/, "Search suggestions must include opening-state padding before the expanded class is applied.");
assert.match(source, /const contentHeight = searchSuggestionsNaturalContentHeight\(\);[\s\S]*`\$\{Math\.ceil\(contentHeight \+ paddingY\)\}px`/, "Search suggestions height must shrink to the current result set's natural content height.");
assert.match(source, /const AI_MODE_EXIT_MS = 300;/, "AI mode exit timing should be a named constant shared by the state cleanup.");
assert.match(source, /prefersReducedMotion\(\) \? 0 : AI_MODE_EXIT_MS/, "AI mode exit cleanup must finish immediately for reduced-motion users.");

assert.match(styles, /\.search-workbench\s*\{[\s\S]*--ai-engine-column-width:\s*50px;[\s\S]*--ai-search-entry-offset:\s*14px;/, "AI mode should reserve a stable engine column without depending on intrinsic pill width.");
assert.match(styles, /\.search-workbench\[data-ai-active\] \.topbar-search\s*\{[\s\S]*grid-template-columns:\s*var\(--ai-engine-column-width\) minmax\(0,\s*1fr\);/, "AI mode should use a fixed column so the default search box can transition back without remeasuring the pill.");
assert.match(styles, /\.ai-engine-pill\[data-exiting="true"\]\s*\{[\s\S]*position:\s*absolute;[\s\S]*left:\s*var\(--ai-engine-pill-left\);/, "AI pill exit should be out of normal grid flow so the default search box can restore immediately.");
assert.doesNotMatch(styles, /\.search-workbench\[data-ai-exiting\] \.quick-search-entry\s*\{[\s\S]*margin-left:/, "AI mode exit must not keep the input offset locked after switching back to the default search box.");
assert.match(styles, /\.search-workbench\[data-ai-active\] \.favorite-add-button,\s*\.search-workbench\[data-ai-exiting\] \.favorite-add-button\s*\{[\s\S]*visibility:\s*hidden;/, "AI mode should keep the favorite add affordance hidden through the exit transition.");
assert.match(styles, /@media \(max-width: 560px\)[\s\S]*\.search-workbench\s*\{[\s\S]*--ai-engine-column-width:\s*43px;[\s\S]*--ai-search-entry-offset:\s*13px;[\s\S]*\.search-workbench\[data-ai-active\] \.topbar-search\s*\{[\s\S]*height:\s*56px;/, "Mobile AI mode should keep compact active geometry while letting exit restore the default search field immediately.");
