import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../newtab.css", import.meta.url), "utf8");
const html = readFileSync(new URL("../newtab.html", import.meta.url), "utf8");

assert.match(source, /const ONBOARDING_STEPS = \[[\s\S]*target: "\.search-panel"[\s\S]*target: "#favoriteStrip"[\s\S]*target: "\.recent-folders"[\s\S]*target: "#portalSurfaceButton"[\s\S]*target: "#settingsButton"[\s\S]*\];/, "The first-run tour must keep the requested five-step order.");
assert.match(source, /const ONBOARDING_PREVIEW_FAVORITES = \[[\s\S]*onboarding-github[\s\S]*onboarding-chatgpt[\s\S]*\];/, "The tour should seed a full favorite row with temporary demo data.");
assert.match(source, /async function renderOnboardingPreview\(\)[\s\S]*renderFavoriteSiteList\(ONBOARDING_PREVIEW_FAVORITES\)[\s\S]*renderRecentFolders\(groupHistoryBySite/, "The preview must reuse the real favorite and recent-browsing renderers.");
assert.match(source, /onboardingPreviewActive = false;\s*await Promise\.allSettled\(\[renderFavoriteSites\(\), refreshHistory\(\)\]\);/, "Finishing the tour must restore real user data before closing.");
const dismissOnboardingSource = source.match(/async function dismissOnboardingGuide\(\) \{[\s\S]*?\n\}\n\nfunction handleSettingsPanelDismiss/)?.[0] || "";
assert.ok(dismissOnboardingSource, "The onboarding dismiss flow should remain available for focus checks.");
assert.doesNotMatch(dismissOnboardingSource, /quickSearchInput\.focus/, "Finishing the tour must leave the search box in its normal unfocused state.");
assert.match(source, /function advanceOnboardingGuide\(\)[\s\S]*ONBOARDING_STEPS\.length - 1[\s\S]*dismissOnboardingGuide\(\)[\s\S]*onboardingStepIndex \+= 1;[\s\S]*showOnboardingStep\(\);/, "Next must advance through all steps and finish only after the fifth.");
assert.match(html, /id="onboardingCard"[\s\S]*id="onboardingStepTitle"[\s\S]*id="onboardingStepBody"[\s\S]*id="onboardingDoneButton"/, "The tour needs one accessible bubble and one next button.");
assert.doesNotMatch(`${html}\n${source}\n${styles}`, /onboardingSpotlight|onboarding-spotlight/, "The tour must not cut a spotlight hole around each target.");
assert.match(styles, /\.onboarding-guide\s*\{[\s\S]*background:\s*rgb\(20 27 24 \/ 0\.58\);/, "The tour should use one uniform page scrim.");
assert.match(source, /const arrowPosition = placement === "top" \|\| placement === "bottom"[\s\S]*targetRect\.left \+ targetRect\.width \/ 2 - left - 7[\s\S]*targetRect\.top \+ targetRect\.height \/ 2 - top - 7;/, "The bubble arrow must stay aligned to the active target center.");
assert.match(styles, /\.onboarding-card\[data-placement="bottom"\]::after[\s\S]*\.onboarding-card\[data-placement="top"\]::after[\s\S]*\.onboarding-card\[data-placement="right"\]::after[\s\S]*\.onboarding-card\[data-placement="left"\]::after/, "The bubble marker must point to targets on every edge.");
