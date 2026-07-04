import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const styles = readFileSync(new URL("../newtab.css", import.meta.url), "utf8");
const source = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");

function cssBlock(selector) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = styles.match(new RegExp(`${escapedSelector}\\s*\\{([\\s\\S]*?)\\n\\}`));
  return match?.[1] || "";
}

const surfaceOpenHomeStageRule = cssBlock("body.surface-open .home-stage");
const surfaceOpenTopbarRule = cssBlock("body.surface-open .topbar");
const surfaceOpenLaunchersRule = cssBlock("body.surface-open .surface-launchers");
const surfaceBackdropRule = cssBlock(".surface-backdrop");
const surfaceOpenBackdropRule = cssBlock("body.surface-open .surface-backdrop");
const surfaceShellRule = cssBlock(".shell");
const surfaceOpenShellRule = cssBlock(".shell.surface-open");
const surfaceClosingShellRule = cssBlock(".shell.surface-closing");
const surfacePanelRule = cssBlock(".panel");

assert.match(
  surfaceOpenHomeStageRule,
  /transform:\s*none;/,
  "Opening a secondary surface should leave the home stage spatially fixed."
);

assert.doesNotMatch(surfaceOpenHomeStageRule, /filter:/, "Opening a secondary surface should only dim the home stage.");

assert.match(
  surfaceOpenTopbarRule,
  /transform:\s*none;/,
  "Topbar controls must remain fixed while secondary surfaces animate in."
);

assert.doesNotMatch(surfaceOpenTopbarRule, /filter:/, "Opening a secondary surface should only dim the topbar.");

assert.match(surfaceBackdropRule, /opacity 220ms[\s\S]*visibility 0s linear 220ms;/, "The navigation backdrop should close with the surface shell.");
assert.match(surfaceOpenBackdropRule, /opacity 260ms/, "The navigation backdrop should open with the surface shell.");
assert.match(surfaceShellRule, /transform 220ms[\s\S]*visibility 0s linear 220ms;/, "The navigation shell should use the shared close duration.");
assert.match(surfaceOpenShellRule, /transform 260ms/, "The navigation shell should use the restrained open duration.");
assert.match(surfaceClosingShellRule, /transform 220ms/, "The navigation shell should close without a delayed second movement.");
assert.doesNotMatch(surfacePanelRule, /(?:opacity|transform):/, "The inner navigation panel should stay static while the shell moves.");
assert.doesNotMatch(styles, /@keyframes surfacePanel(?:Enter|Exit)/, "The inner navigation panel should not run a second entrance or exit animation.");

assert.doesNotMatch(
  surfaceOpenLaunchersRule,
  /transform\s*:/,
  "The top-left navigation launcher must not move while the navigation surface opens."
);

assert.doesNotMatch(
  source,
  /portalSurfaceButton\.focus\(\{ preventScroll: true \}\)/,
  "Closing the navigation hub should not force focus back to the top-left launcher."
);

assert.doesNotMatch(
  source,
  /settingsButton\.focus\(\{ preventScroll: true \}\)/,
  "Closing settings should not leave the same launcher focus ring on the top-right control."
);

assert.doesNotMatch(
  source,
  /surfaceBackdrop\.setAttribute\("aria-hidden"/,
  "The focusable navigation backdrop must not be hidden from accessibility while it can retain focus."
);

assert.match(
  source,
  /function setActiveSurfacePanel\(panelId\) \{[\s\S]*\}, prefersReducedMotion\(\) \? 0 : 220\);/,
  "Navigation surface cleanup should match the 220ms close transition and finish immediately for reduced-motion users."
);

assert.match(
  styles,
  /\.panel-header :is\(h1, h2\):focus\s*\{\s*outline:\s*0;\s*\}/,
  "Programmatic panel-heading focus should not draw the browser default text outline."
);

assert.match(
  styles,
  /\.bookmark-site-card\.delete-ready \.site-link\s*\{[\s\S]*border-color:\s*transparent;/,
  "Bookmark delete-ready rows should not add a selected outline around the bookmark."
);

assert.match(
  styles,
  /\.site-card:not\(\.bookmark-site-card\):hover \.site-link,\s*\.featured-category \.site-link:hover,\s*\.featured-category \.site-card:not\(\.bookmark-site-card\):hover \.site-link,\s*\.bookmark-site-card:hover \.site-link\s*\{[\s\S]*transform:\s*scale3d\(1\.03,\s*1\.03,\s*1\);/,
  "Navigation hub rows should keep the move-in and move-out hover scale effect."
);

assert.match(
  source,
  /const BOOKMARK_LONG_PRESS_MS = 700;\s*const BOOKMARK_LONG_PRESS_FEEDBACK_DELAY_MS = 160;/,
  "Bookmark rows should separate ordinary click timing from long-press feedback timing."
);

assert.match(
  source,
  /feedbackTimer = window\.setTimeout\(\(\) => \{\s*node\.classList\.add\("pressing"\);[\s\S]*\}, BOOKMARK_LONG_PRESS_FEEDBACK_DELAY_MS\);\s*holdTimer = window\.setTimeout/,
  "Bookmark rows should not enter the long-press visual state immediately on pointerdown."
);

assert.match(
  styles,
  /\.bookmark-site-card\.pressing \.site-link::after\s*\{[\s\S]*animation:\s*bookmarkHoldProgress 540ms linear forwards;/,
  "Bookmark hold progress should match the visible portion after the click-safe feedback delay."
);

assert.match(
  styles,
  /\.bookmark-delete-button:hover,\s*\.bookmark-delete-button:focus-visible,\s*\.bookmark-delete-button\.is-filled\s*\{[\s\S]*outline:\s*0;/,
  "Bookmark delete hover/focus should not add an outer outline around the delete icon."
);

assert.match(
  source,
  /function setBookmarkDeleteButtonFilled\(button, isFilled\) \{[\s\S]*button\.classList\.toggle\("is-filled", isFilled\);[\s\S]*trashFilledIcon\(\)[\s\S]*trashIcon\(\)/,
  "Bookmark delete buttons should switch from tdesign delete to delete-filled for hover/focus without changing the icon renderer."
);
