import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../newtab.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../newtab.css", import.meta.url), "utf8");

assert.match(
  source,
  /async function initWithStorageMigration\(\) \{\s*void migrateSyncStorageFromLocal\(\);\s*await init\(\);\s*\}/,
  "New tab startup must not wait for sync migration."
);

assert.match(
  source,
  /function storageAreaForKey\(key\) \{[\s\S]*return chrome\.storage\?\.local \|\| chrome\.storage\?\.sync;[\s\S]*\}/,
  "Normal new-tab reads and writes should prefer local storage."
);

assert.doesNotMatch(
  source,
  /function storageAreaForKey\(key\) \{[\s\S]*SYNC_STORAGE_KEYS\.has\(key\)[\s\S]*return chrome\.storage\.sync;/,
  "Normal new-tab writes must not route sync-managed keys directly through chrome.storage.sync."
);

assert.match(
  source,
  /async function getStoredValues\(defaults = \{\}\) \{[\s\S]*const syncedKeys = keys\.filter\(\(key\) => SYNC_STORAGE_KEYS\.has\(key\)\);[\s\S]*chrome\.storage\.local\.get\(keys\),[\s\S]*chrome\.storage\.sync\.get\(syncedKeys\)[\s\S]*typeof localValues\[key\] !== "undefined"[\s\S]*typeof syncValues\[key\] !== "undefined" \? syncValues\[key\] : defaults\[key\]/,
  "Synced settings should fall back to chrome.storage.sync when local storage is empty after reinstall."
);

const initBody = source.match(/async function init\(\) \{([\s\S]*?)\n\}/)?.[1] || "";
assert.match(
  html,
  /<html lang="en" class="[^"]*\blocale-hydrating\b[^"]*"/,
  "Static HTML should stay hidden until runtime locale hydration replaces the English baseline."
);

assert.match(
  css,
  /html\.locale-hydrating body\s*\{[\s\S]*visibility:\s*hidden;/,
  "Locale hydration should hide the English HTML baseline before first paint."
);

assert.ok(
  initBody.indexOf("applyLocale();") !== -1
    && initBody.indexOf("applyLocale();") < initBody.indexOf("const searchSettingsReady = initSearchSettings();"),
  "Locale must be applied before startup awaits so system language does not flicker from the HTML default."
);

assert.ok(
  initBody.indexOf("applyLocale();") !== -1
    && initBody.indexOf('document.documentElement.classList.remove("locale-hydrating");') > initBody.indexOf("applyLocale();")
    && initBody.indexOf('document.documentElement.classList.remove("locale-hydrating");') < initBody.indexOf("renderFirstPaintCache();"),
  "The page should become visible only after system locale text has replaced the English baseline."
);

assert.match(
  initBody,
  /try\s*\{\s*applyLocale\(\);\s*\}\s*finally\s*\{\s*document\.documentElement\.classList\.remove\("locale-hydrating"\);\s*\}/,
  "Locale hydration must not leave the page permanently hidden if localization throws."
);

assert.match(
  initBody,
  /const siteIconIndexReady = initSiteIconIndex\(\);[\s\S]*siteIconIndexReady\.then\(refreshRenderedSiteIcons\)/,
  "Site icon index loading should refresh rendered icons instead of blocking the first content render."
);

assert.match(
  source,
  /let siteIconIndexLoaded = false;[\s\S]*async function initSiteIconIndex\(\) \{[\s\S]*siteIconIndexLoaded = false;[\s\S]*finally\s*\{[\s\S]*siteIconIndexLoaded = true;/,
  "Startup should keep first content render non-blocking while exposing when local icon coverage is known."
);

assert.match(
  source,
  /async function discoverRemoteBrandIconDataUrl\(url\) \{[\s\S]*const localIcon = localIconForUrl\(parsedUrl\.href\);[\s\S]*localIcon && !localIconNeedsRemoteBrandColor\(siteKey, localIcon\)[\s\S]*return "";/,
  "Remote brand discovery should wait for the local icon index and skip deployed local icons unless they need cloud VI-color hydration."
);

assert.match(
  source,
  /const shouldRefreshRemoteBrand = localIcon[\s\S]*localIconNeedsRemoteBrandColor\(siteGroupKey\(safeUrl\(site\.url\)\), localIcon\)[\s\S]*siteIcon && !siteIconIsRemoteBrand;[\s\S]*if \(shouldRefreshRemoteBrand\) \{[\s\S]*refreshRemoteBrandIcon\(icon, site\);/,
  "Stored site ico renders and local SVGs missing VI color should still allow the remote SVG branch after the local icon index is ready."
);

assert.match(
  html,
  /<link rel="icon" type="image\/png" sizes="32x32" href="icons\/wayleaf-flat-32\.png">/,
  "HTTP previews should declare an existing favicon instead of letting the browser request /favicon.ico."
);

assert.ok(
  initBody.indexOf("renderFavoriteSites();") < initBody.indexOf("void searchSettingsReady;"),
  "Favorite content should not wait for search settings storage."
);

assert.doesNotMatch(
  initBody,
  /await siteIconIndexReady;|await initSearchSettings\(\);/,
  "First content render must not wait for site icon index or search settings."
);

assert.ok(
  initBody.indexOf("renderFirstPaintCache();") !== -1
    && initBody.indexOf("renderFirstPaintCache();") < initBody.indexOf("const siteIconIndexReady = initSiteIconIndex();"),
  "Favorite and recent card snapshots should render before async icon/storage/history startup work."
);

assert.match(
  source,
  /function serializeRecentGroupsForFirstPaint\(groups\)[\s\S]*pages:[\s\S]*title:[\s\S]*url:[\s\S]*lastVisitTime:/,
  "First-paint recent cache should store card data."
);

assert.match(
  source,
  /function cacheRenderedSiteIcon\(icon, site\)[\s\S]*iconRenders\[key\][\s\S]*source:[\s\S]*src,[\s\S]*tileLight,[\s\S]*tileDark/,
  "First-paint cache should preserve source metadata and reuse the existing icon algorithm's final rendered output."
);

assert.match(
  source,
  /function cacheRenderedSiteIcon\(icon, site\)[\s\S]*iconDefaultProbe === "pending"[\s\S]*iconDefaultRescue === "pending"[\s\S]*return;/,
  "An unreadable favicon must not cache its temporary generic tile while async sampling or rescue is pending."
);

assert.match(
  source,
  /function applyFaviconSampleDecision\(icon, sample, options = \{\}\)[\s\S]*applySampledFaviconTile\(icon, sample, color, tileColors\);[\s\S]*cacheRenderedSiteIconFromContext\(icon\);/,
  "Async favicon sampling should cache the settled tile after the existing color algorithm finishes."
);

assert.match(
  source,
  /\.slice\(MAX_FAVORITE_SITES \+ MAX_HISTORY_SITE_GROUPS\)[\s\S]*delete iconRenders\[staleKey\]/,
  "First-paint icon output must remain bounded to the cards that can be rendered."
);

assert.match(
  source,
  /function createRecentFolderItem\(group, options = \{\}\)[\s\S]*cachedFirstPaintIconRender[\s\S]*restoreFirstPaintIconRender[\s\S]*applyHistoryIcon/,
  "Recent cards should restore cached icon output and retain the original icon algorithm as the cache-miss path."
);

assert.match(
  source,
  /function createFavoriteSite\(site, index, options = \{\}\)[\s\S]*restoreFirstPaintIconRender[\s\S]*applySiteIcon/,
  "Favorite cards should restore cached icon output and retain the original icon algorithm as the cache-miss path."
);

assert.match(
  source,
  /function restoreFirstPaintIconRender\(icon, site, render\)[\s\S]*addEventListener\("error"[\s\S]*applySiteIcon\(icon, site\)/,
  "A broken cached output should fall back to the unchanged site icon algorithm."
);

const themePreload = readFileSync(new URL("../theme-preload.js", import.meta.url), "utf8");
assert.match(themePreload, /root\.dataset\.theme = resolved;[\s\S]*root\.dataset\.themePalette = palette;[\s\S]*root\.style\.setProperty\(name, value\)/,
  "Theme preload should restore mode, palette, and generated theme variables before CSS paints.");

assert.match(source, /if \(previousResolvedTheme && previousResolvedTheme !== resolvedTheme\) \{\s*refreshAdaptiveSiteIcons\(\);/,
  "Theme hydration should not rerender adaptive icons when the resolved mode is unchanged.");

const adaptiveIconRefresh = source.match(/function refreshAdaptiveSiteIcons\(\) \{[\s\S]*?\n\}/)?.[0] || "";
assert.doesNotMatch(adaptiveIconRefresh, /^\s*icon\.src = source;$/m,
  "Theme switching must keep the current glyph visible until the next themed SVG is ready.");
assert.match(adaptiveIconRefresh, /iconThemeRequest/,
  "Theme switching should identify the latest SVG render request per icon.");
assert.match(adaptiveIconRefresh, /document\.documentElement\.dataset\.theme === requestTheme/,
  "An SVG render from an obsolete theme must not overwrite the current glyph.");
assert.doesNotMatch(adaptiveIconRefresh, /requestAnimationFrame/,
  "Theme switching must not start a per-icon frame loop that can run forever for lower-contrast brand colors.");

const initialIconRender = source.match(/function displayIconSource\(icon, source, options = \{\}\) \{[\s\S]*?\n\}/)?.[0] || "";
assert.match(initialIconRender, /const requestTheme = document\.documentElement\.dataset\.theme;[\s\S]*iconThemeRequest/,
  "Initial SVG rendering should capture the theme and share the per-icon request token with theme refreshes.");
assert.match(initialIconRender, /icon\.dataset\.iconThemeRequest === requestToken[\s\S]*document\.documentElement\.dataset\.theme === requestTheme/,
  "An initial SVG render from an obsolete theme must not overwrite the current glyph.");
assert.doesNotMatch(initialIconRender, /icon\.isConnected/,
  "Initial SVG rendering must also settle while favorite cards are still in a DocumentFragment.");

assert.doesNotMatch(
  source,
  /fetch\(`\$\{SITE_ICON_DIRECTORY\}\/index\.json`,\s*\{\s*cache:\s*"no-store"\s*\}\)/,
  "Site icon index should not bypass the browser cache on every new tab."
);

assert.match(
  source,
  /async function handleManualSyncSettings\(\)[\s\S]*chrome\.storage\.sync\.set\(cloudSyncPayload\(payload\)\)/,
  "Manual sync should still explicitly write local settings to chrome.storage.sync."
);
