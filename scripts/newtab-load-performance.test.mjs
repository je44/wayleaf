import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const newtabSource = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");
const iconSource = readFileSync(new URL("../wayleaf-icon.js", import.meta.url), "utf8");
const source = `${iconSource}\n${newtabSource}`;
const html = readFileSync(new URL("../newtab.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../newtab.css", import.meta.url), "utf8");

assert.ok(
  html.indexOf('<script src="wayleaf-icon.js"></script>') !== -1
    && html.indexOf('<script src="wayleaf-icon.js"></script>') < html.indexOf('<script src="newtab.js"></script>'),
  "Wayleaf icon rendering must load as an independent module before newtab.js."
);

assert.doesNotMatch(
  newtabSource,
  /\b(?:async function|function|const)\s+(?:resolvePrimarySiteIconRoute|startSecondaryFaviconRoute|renderPrimarySiteIcon|renderFallbackSiteIcon|discoverRemoteBrandIconDataUrl|applySiteIconTile|displayIconSource|syncLocalIconTile|sampleFaviconImageData|selectFaviconBackgroundCandidate|iconRenderCodeSignature|SITE_ICON_CACHE_STORAGE_KEY|FAVICON_BACKGROUND_SAMPLE_SIZE|BRAND_ICON_VI_CONTRAST_MIN)\b/,
  "newtab.js must not own Wayleaf icon route, cache, SVG, favicon, or carrier algorithms."
);

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

const initBody = newtabSource.match(/async function init\(\) \{([\s\S]*?)\n\}/)?.[1] || "";
const createBookmarkSiteCardBody = newtabSource.match(/function createBookmarkSiteCard\(site, options = \{\}\) \{[\s\S]*?\n\}/)?.[0] || "";
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
  /const siteIconIndexReady = WayleafIcon\.initSiteIconIndex\(\);[\s\S]*const themeModeReady = initThemeMode\(\);[\s\S]*Promise\.all\(\[siteIconIndexReady, themeModeReady\]\)\.then\(\(\) => \{[\s\S]*WayleafIcon\.refreshRenderedSiteIcons\(\);[\s\S]*\}\)\.catch\(\(\) => \{\}\);/,
  "Site icon index and resolved theme should refresh rendered icons together without blocking first content render."
);

assert.match(
  source,
  /let siteIconIndexLoaded = false;[\s\S]*async function initSiteIconIndex\(\) \{[\s\S]*siteIconIndexLoaded = false;[\s\S]*finally\s*\{[\s\S]*siteIconIndexLoaded = true;/,
  "Startup should keep first content render non-blocking while exposing when local icon coverage is known."
);

assert.match(
  source,
  /async function discoverRemoteBrandIconDataUrl\(url, options = \{\}\) \{[\s\S]*const localIcon = localIconForUrl\(parsedUrl\.href\);[\s\S]*localIcon && !localIconNeedsRemoteBrandColor\(siteKey, localIcon\)[\s\S]*return "";/,
  "Remote brand discovery should wait for the local icon index and skip deployed local icons unless they need cloud VI-color hydration."
);

assert.match(
  source,
  /async function resolvePrimarySiteIconRoute[\s\S]*localIconForUrl\(site\.url\)[\s\S]*discoverRemoteBrandIconDataUrl\(site\.url, \{ requireStableMiss: true \}\)[\s\S]*setIconRouteState\(icon, "primary_miss"[\s\S]*startSecondaryFaviconRoute/,
  "Cloud SVG resolution must finish before a primary miss can enter the secondary favicon route."
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
    && initBody.indexOf("renderFirstPaintCache();") < initBody.indexOf("const siteIconIndexReady = WayleafIcon.initSiteIconIndex();"),
  "Favorite and recent card snapshots should render before async icon/storage/history startup work."
);

assert.match(
  source,
  /function serializeRecentGroupsForFirstPaint\(groups\)[\s\S]*pages:[\s\S]*title:[\s\S]*url:[\s\S]*lastVisitTime:/,
  "First-paint recent cache should store card data."
);

assert.match(
  source,
  /function cacheRenderedSiteIcon\(icon, site\)[\s\S]*const src = icon\.getAttribute\("src"\)[\s\S]*const source = icon\.dataset\.iconSource \|\| src[\s\S]*const tileLight = icon\.style\.getPropertyValue\("--site-icon-tile-light"\)[\s\S]*const tileDark = icon\.style\.getPropertyValue\("--site-icon-tile-dark"\)[\s\S]*source: source \|\| iconRenders\[key\]\?\.source/,
  "First-paint cache should preserve source metadata and reuse the existing icon algorithm's final rendered output."
);

assert.match(
  source,
  /function cacheRenderedSiteIcon\(icon, site\)[\s\S]*iconDefaultProbe === "pending"[\s\S]*iconDefaultRescue === "pending"[\s\S]*return;/,
  "An unreadable favicon must not cache its temporary generic tile while async sampling or rescue is pending."
);

// Tier integrity: no surface may persist a tier-1 site as a tier-2 favicon. Before the icon index
// is known we cannot tell the tier (don't cache); once known, a site that HAS a local icon may only
// be cached as its local render, never as a stand-in favicon. This is what stops today history (or
// any future surface) from racing e.g. Iconify down to a favicon in the shared first-paint cache.
assert.match(
  source,
  /function cacheRenderedSiteIcon\(icon, site\)[\s\S]*if \(!siteIconIndexLoaded\) \{\s*return;\s*\}\s*if \(localIconForUrl\(site\.url\) && !icon\.classList\.contains\("site-icon-local"\)\) \{\s*return;\s*\}/,
  "cacheRenderedSiteIcon must never persist a pre-index or tier-2 render for a site that has a tier-1 local icon."
);

assert.match(
  source,
  /function applyFaviconSampleDecision\(icon, sample, options = \{\}\)[\s\S]*applySampledFaviconTile\(icon, sample, color, tileColors[\s\S]*cacheRenderedSiteIconFromContext\(icon\);/,
  "Async favicon sampling should cache the settled tile after the existing color algorithm finishes."
);

assert.match(
  source,
  /const protectedKeys = firstPaintProtectedIconKeys\(cache\);[\s\S]*\.filter\(\(\[entryKey\]\) => !protectedKeys\.has\(entryKey\)\)[\s\S]*\.slice\(MAX_CACHED_SITE_ICONS\)[\s\S]*delete iconRenders\[staleKey\]/,
  "First-paint icon output must stay bounded (transient renders capped at MAX_CACHED_SITE_ICONS) while the always-present favorites/recent renders are protected from eviction."
);

assert.match(
  source,
  /function firstPaintProtectedIconKeys\(cache = readFirstPaintCache\(\)\)[\s\S]*normalizeCachedFavoriteSites\(cache\.favoriteSites\)[\s\S]*cache\.recentGroups[\s\S]*keys\.add\(String\(group\.key\)\)/,
  "Protected first-paint keys must cover both favorites and recent groups so the today-history view can never evict their cached tiles (which would re-sample the same favicon differently each refresh)."
);

assert.match(
  source,
  /function createRecentFolderItem\(group, options = \{\}\)[\s\S]*renderHistorySiteIcon\(icon, iconSite, options\);/,
  "Recent cards must use the shared history icon display path instead of owning cache/restore/apply order."
);

assert.match(
  source,
  /function createFavoriteSite\(site, index, options = \{\}\)[\s\S]*restoreFirstPaintIconRender[\s\S]*applySiteIcon/,
  "Favorite cards should restore cached icon output and retain the original icon algorithm as the cache-miss path."
);

assert.match(
  source,
  /function renderSelectedBookmarkFolder\(\)[\s\S]*bookmarkGrid\.replaceChildren\(await prepareBookmarkRouteFragment\(fragment\)\);/,
  "Bookmark route content should be staged until its icons have settled instead of showing favicon rendering in place."
);

assert.match(
  source,
  /function waitForBookmarkRouteIcons\(root, iconSelector = "\.bookmark-site-card img\.site-icon"\) \{[\s\S]*root\.querySelectorAll\(iconSelector\)/,
  "Bookmark icon staging must default to second-level bookmark route cards."
);

assert.doesNotMatch(
  source,
  /function renderTodayHistory\(options = \{\}\)[\s\S]*prepareBookmarkRouteFragment\(/,
  "Today history must render rows immediately instead of waiting for icon staging."
);

assert.match(
  source,
  /function renderTodayHistory\(options = \{\}\)[\s\S]*recentHistoryFolders\.replaceChildren\(fragment\);/,
  "Today history data should replace the visible list as soon as rows are built."
);

assert.doesNotMatch(
  source.match(/function waitForBookmarkRouteIcons[\s\S]*?\n}\n\nfunction waitForBookmarkRouteIcon/)?.[0] || "",
  /favorite-site|favorite-icon|#favoriteStrip/,
  "Staged icon waiting must not include first-level favorite route icons."
);

assert.doesNotMatch(
  createBookmarkSiteCardBody,
  /cacheRenderedSiteIconOnLoad/,
  "Bookmark route staging must not write second-level icon output into the shared first-paint icon cache."
);

assert.match(
  source,
  /function restoreFirstPaintIconRender\(icon, site, render\)[\s\S]*addEventListener\("error"[\s\S]*applySiteIcon\(icon, site\)/,
  "A broken cached output should fall back to the unchanged site icon algorithm."
);

const themePreload = readFileSync(new URL("../theme-preload.js", import.meta.url), "utf8");
assert.match(themePreload, /root\.dataset\.theme = resolved;[\s\S]*root\.dataset\.themePalette = palette;[\s\S]*root\.style\.setProperty\(name, value\)/,
  "Theme preload should restore mode, palette, and generated theme variables before CSS paints.");

assert.match(source, /if \(previousResolvedTheme && previousResolvedTheme !== resolvedTheme\) \{\s*WayleafIcon\.refreshAdaptiveSiteIcons\(\);/,
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
