import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const styles = readFileSync(new URL("../newtab.css", import.meta.url), "utf8");
const source = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../newtab.html", import.meta.url), "utf8");

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

assert.doesNotMatch(html, /smartPortalTab|smartPortalView|data\/recommendedSites\.js/, "The navigation hub should expose bookmarks only.");
assert.doesNotMatch(html, /id="chooseBookmarkFolderButton"/, "The bookmark header should not duplicate the folder lane with a second folder icon.");
assert.match(html, /id="bookmarkSearchInput"/, "The bookmark hub should provide in-folder search.");
assert.match(html, /id="bookmarkFolderLane"/, "The bookmark hub should provide one-click folder switching.");
assert.match(source, /function renderBookmarkFolderLane\(/, "Bookmark folders should render through one shared quick-switch lane.");
assert.match(source, /activeButton\?\.scrollIntoView\(\{ block: "nearest", inline: "nearest" \}\);/, "Overflowing bookmark folder chips should keep the active folder visible.");
assert.match(source, /function renderVisibleBookmarkSites\(/, "Bookmark search and sorting should share one rendering path.");
assert.match(source, /function prepareBookmarkRouteFragment[\s\S]*trackBookmarkRouteIconCache\(staging, iconSelector\);[\s\S]*ready\.append\(\.\.\.staging\.childNodes\);/, "Bookmark folder switches should track icon cache without blocking the grid swap.");
assert.doesNotMatch(source, /await waitForBookmarkRouteIcons/, "Bookmark folder switches must not wait for every icon route before showing the folder.");
assert.match(source, /const bookmarkFolderViewCache = new Map\(\);/, "Loaded bookmark folder DOM should be reusable when switching back.");
assert.match(source, /function activateBookmarkFolderView\(view\)[\s\S]*cachedView\.hidden = true;[\s\S]*bookmarkGrid\.appendChild\(view\);[\s\S]*view\.hidden = false;/, "Bookmark folder switches should keep inactive icon nodes connected and only toggle their visibility.");
assert.match(source, /function rememberBookmarkFolderView\(key, view\)[\s\S]*node: view/, "Bookmark folder view cache should preserve one connected view instead of rebuilding icon nodes.");
assert.match(source, /function activateCachedBookmarkFolderView\(folderId\)[\s\S]*activateBookmarkFolderView\(cachedView\.node\);[\s\S]*return true;/, "A loaded bookmark folder should reveal its existing icon nodes before async bookmark reads finish.");
assert.doesNotMatch(source, /bookmarkGrid\.replaceChildren\(\.\.\.cachedView\.nodes\)/, "Cached bookmark icons must not be detached and reinserted during folder switches.");
assert.match(source, /async function selectBookmarkFolder\(folderId\) \{\s*bookmarkSearchInput\.value = "";\s*const saveSelection = saveSelectedBookmarkFolderId\(folderId\);\s*await closeBookmarkPicker\(folderId\);\s*await saveSelection;/, "Folder switching should render immediately instead of waiting for the storage write.");
assert.match(source, /async function renderSelectedBookmarkFolder\(selectedFolderId\) \{\s*const renderRequestId = \+\+bookmarkRenderRequestId;[\s\S]*activateCachedBookmarkFolderView\(folderId\);/, "Each folder selection should invalidate older async renders before activating its cached view.");
assert.match(source, /async function renderBookmarkFolderLane\(selectedId, renderRequestId = 0\)[\s\S]*renderRequestId !== bookmarkRenderRequestId[\s\S]*bookmarkFolderLane\.replaceChildren\(fragment\);/, "A stale folder-tree request must not replace the active quick-switch lane.");
assert.match(source, /function requestBookmarkRefresh\(\) \{[\s\S]*clearBookmarkFolderViewCache\(\);/, "Bookmark view cache must clear when Chrome bookmark data changes.");
assert.match(source, /function bookmarkRouteIconSettled\(icon\)[\s\S]*\["primary_pending", "primary_miss", "secondary_pending"\]\.includes\(icon\.dataset\.iconRouteState \|\| ""\)[\s\S]*return false;/, "Bookmark folder switches must not cache pending route spinners as settled icons.");
assert.match(source, /attributeFilter: \[[\s\S]*"data-icon-route-state"/, "Bookmark icon settling must observe route-state changes from secondary and fallback routes.");
assert.match(source, /function cacheBookmarkRouteIconWhenSettled\(icon\)[\s\S]*WayleafIcon\.cacheRenderedSiteIcon\(icon, \{[\s\S]*url: icon\.dataset\.siteUrl/, "Settled bookmark icons must reuse the shared Wayleaf first-paint cache writer.");
assert.match(source, /latestBookmarkRenderContext = \{ \.\.\.latestBookmarkRenderContext, iconRenders: readFirstPaintCache\(\)\.iconRenders \};/, "Bookmark rerenders should reuse the fresh first-paint cache after route settling.");
assert.match(source, /createSiteCard\(site, \{ \.\.\.options, allowFavorite: false \}, renderBookmarkSiteIcon\)/, "Bookmark-only rows should use immediate native favicon rendering without exposing shortcut promotion controls.");
assert.match(styles, /\.bookmark-folder-lane\s*\{[\s\S]*overflow-x:\s*auto;/, "Bookmark folders should remain reachable in the narrow navigation surface.");
assert.match(styles, /\.bookmark-folder-view:not\(\[hidden\]\)\s*\{[\s\S]*display:\s*contents;/, "The active connected bookmark view should preserve the existing grid layout.");
assert.match(styles, /\.bookmark-folder-view\[hidden\]\s*\{[\s\S]*display:\s*none;/, "Inactive connected bookmark views should remain non-visible.");
assert.match(styles, /\.portal-panel \.panel-header\s*\{[\s\S]*margin-right:\s*0;/, "The bookmark refresh action should align to the header edge instead of reserving space for the removed folder icon.");
assert.match(styles, /\.bookmark-main-section \.bookmark-letter-grid\s*\{[\s\S]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\);/, "The selected folder should use the chosen dense two-column layout.");

const activateBookmarkFolderViewSource = source.match(/function activateBookmarkFolderView\(view\) \{[\s\S]*?\n\}/)?.[0] || "";
assert.ok(activateBookmarkFolderViewSource, "Bookmark folder view activation helper should remain testable.");

const bookmarkGridFixture = {
  children: [],
  querySelectorAll() {
    return [...this.children];
  },
  appendChild(view) {
    if (view.parentElement?.children) {
      view.parentElement.children = view.parentElement.children.filter((child) => child !== view);
    }
    this.children.push(view);
    view.parentElement = this;
  }
};
const createViewFixture = (key) => ({
  dataset: { bookmarkFolderView: key },
  hidden: false,
  parentElement: null,
  remove() {
    if (this.parentElement?.children) {
      this.parentElement.children = this.parentElement.children.filter((child) => child !== this);
    }
    this.parentElement = null;
  }
});
const activationContext = { bookmarkGrid: bookmarkGridFixture, globalThis: null };
activationContext.globalThis = activationContext;
vm.runInNewContext(`${activateBookmarkFolderViewSource}\n;globalThis.activateBookmarkFolderView = activateBookmarkFolderView;`, activationContext);

const firstFolderView = createViewFixture("first");
const secondFolderView = createViewFixture("second");
activationContext.activateBookmarkFolderView(firstFolderView);
activationContext.activateBookmarkFolderView(secondFolderView);
assert.equal(firstFolderView.parentElement, bookmarkGridFixture, "Inactive bookmark favicon nodes must remain connected to the grid.");
assert.equal(firstFolderView.hidden, true, "Inactive bookmark folders should be hidden without detaching their icons.");
activationContext.activateBookmarkFolderView(firstFolderView);
assert.equal(firstFolderView.hidden, false, "Returning to a cached bookmark folder should reveal the same connected view.");
assert.equal(secondFolderView.parentElement, bookmarkGridFixture, "Previously visible bookmark icons should stay connected for the next return.");
