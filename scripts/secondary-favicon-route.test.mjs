import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";

const iconSource = readFileSync(new URL("../wayleaf-icon.js", import.meta.url), "utf8");
const newtabSource = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");
const cssSource = readFileSync(new URL("../newtab.css", import.meta.url), "utf8");
const source = `${iconSource}\n${newtabSource}`;
const primaryStartMarker = "// PRIMARY_SITE_ICON_ROUTE:START";
const primaryEndMarker = "// PRIMARY_SITE_ICON_ROUTE:END";
const startMarker = "// SECONDARY_FAVICON_ROUTE:START";
const endMarker = "// SECONDARY_FAVICON_ROUTE:END";
const fallbackStartMarker = "// FALLBACK_SITE_ICON_ROUTE:START";
const fallbackEndMarker = "// FALLBACK_SITE_ICON_ROUTE:END";

function sourceBetween(startText, endText, label) {
  const start = source.indexOf(startText);
  const end = source.indexOf(endText);
  assert.ok(start >= 0 && end > start, `${label} must have an explicit code boundary.`);
  return source.slice(start, end + endText.length);
}

function markerCount(marker) {
  return source.split(marker).length - 1;
}

const primaryRouteSource = sourceBetween(primaryStartMarker, primaryEndMarker, "The primary icon route");
const routeSource = sourceBetween(startMarker, endMarker, "The secondary favicon route");
const fallbackRouteSource = sourceBetween(fallbackStartMarker, fallbackEndMarker, "The fallback icon route");

for (const marker of [
  primaryStartMarker,
  primaryEndMarker,
  startMarker,
  endMarker,
  fallbackStartMarker,
  fallbackEndMarker
]) {
  assert.equal(markerCount(marker), 1, `${marker} must appear exactly once.`);
}

const fallbackCalls = [];
const cachedIcons = [];
const context = {
  URL,
  Object,
  Number,
  String,
  Boolean,
  Set,
  safeUrl: (value) => {
    try {
      return new URL(value);
    } catch {
      return null;
    }
  },
  siteGroupKey: (parsedUrl) => parsedUrl?.hostname.replace(/^www\./, "") || "",
  localFaviconForUrl: (value) => new URL(value).hostname === "local.example"
    ? "icons/sites/local.ico"
    : "",
  normalizeStoredSiteIcon: (value) => String(value || "").startsWith("data:image/")
    ? String(value)
    : "",
  siteIconSourceLooksLikeSvg: (value) => /image\/svg|\.svg(?:[?#]|$)/i.test(String(value || "")),
  chrome: {
    runtime: {
      getURL: (path) => `chrome-extension://test${path}`
    }
  },
  applyIconTile: (icon, mode, colors) => {
    icon.dataset.iconTile = mode;
    icon.dataset.tileLight = colors.light;
    icon.dataset.tileDark = colors.dark;
  },
  applyGenericFallbackSiteIcon: (icon, seed) => {
    fallbackCalls.push(seed);
    icon.dataset.fallback = "true";
  },
  cacheRenderedSiteIcon: (icon, site) => {
    cachedIcons.push({ state: icon.dataset.iconRouteState, source: icon.dataset.iconSource, url: site.url });
  },
  globalThis: null
};
context.globalThis = context;
vm.runInNewContext(`${routeSource}
;globalThis.__secondaryRouteTestApi = {
  SECONDARY_FAVICON_TILE_COLORS,
  beginIconRouteRequest,
  secondaryFaviconRouteCanStart,
  secondaryFaviconRequestStillCurrent,
  secondaryFaviconDisplaySource,
  startSecondaryFaviconRoute
};`, context);

const api = context.__secondaryRouteTestApi;

function createIcon(siteKey = "example.com", state = "primary_miss", requestToken = "1") {
  const listeners = new Map();
  return {
    dataset: {
      siteKey,
      iconRouteRequest: requestToken,
      iconRouteSequence: requestToken,
      iconRouteState: state
    },
    classList: {
      add() {},
      remove() {},
      toggle() {}
    },
    removeAttribute() {},
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
    dispatch(type) {
      listeners.get(type)?.();
    }
  };
}

assert.equal(api.secondaryFaviconRouteCanStart("primary_pending"), false);
assert.equal(api.secondaryFaviconRouteCanStart("primary_hit"), false);
assert.equal(api.secondaryFaviconRouteCanStart("primary_miss"), true);
assert.deepEqual(
  { ...api.SECONDARY_FAVICON_TILE_COLORS },
  { light: "#ffffff", dark: "#ffffff" },
  "Secondary favicons must use one fixed white Wayleaf tile in both themes."
);

assert.equal(
  api.secondaryFaviconDisplaySource({ url: "https://local.example/path" }),
  "icons/sites/local.ico",
  "Bundled bitmap icons may render directly without byte parsing."
);
assert.equal(
  api.secondaryFaviconDisplaySource({
    url: "https://stored.example/path",
    icon: "data:image/png;base64,AAAA"
  }),
  "data:image/png;base64,AAAA",
  "Stored raster icons may render directly."
);
assert.match(
  api.secondaryFaviconDisplaySource({
    url: "https://example.com/path",
    icon: "data:image/svg+xml;base64,PHN2Zy8+"
  }),
  /^chrome-extension:\/\/test\/_favicon\/\?pageUrl=https%3A%2F%2Fexample\.com%2Fpath&size=64$/,
  "Secondary routing must leave SVG to the primary route and use Chrome's native favicon URL."
);

const icon = createIcon();
api.startSecondaryFaviconRoute(icon, { title: "Example", url: "https://example.com/path" }, "1");
assert.equal(icon.dataset.iconRouteState, "secondary_pending");
assert.equal(icon.dataset.iconTile, "plain");
assert.equal(icon.dataset.tileLight, "#ffffff");
assert.equal(icon.dataset.tileDark, "#ffffff");
assert.equal(icon.src, icon.dataset.iconSource);
assert.match(icon.src, /\/_favicon\/\?/);
icon.dispatch("load");
assert.equal(icon.dataset.iconRouteState, "secondary_hit", "A native image load must settle the secondary route.");
assert.deepEqual(cachedIcons, [{
  state: "secondary_hit",
  source: icon.dataset.iconSource,
  url: "https://example.com/path"
}], "A settled secondary favicon must enter first-paint cache so refresh can replay the site icon.");

const broken = createIcon("broken.example");
api.startSecondaryFaviconRoute(broken, { title: "Broken", url: "https://broken.example" }, "1");
broken.dispatch("error");
assert.equal(broken.dataset.iconRouteState, "fallback");
assert.equal(broken.dataset.fallback, "true");
assert.deepEqual(fallbackCalls, ["broken.example"]);

const stale = createIcon();
api.beginIconRouteRequest(stale, "primary_hit");
assert.equal(api.secondaryFaviconRequestStillCurrent(stale, "example.com", "1"), false);

assert.match(
  primaryRouteSource,
  /localIconForUrl[\s\S]*setIconRouteState\(icon, "primary_hit"[\s\S]*discoverRemoteBrandIconDataUrl[\s\S]*setIconRouteState\(icon, "primary_miss"[\s\S]*startSecondaryFaviconRoute/,
  "Secondary routing must remain behind local and cloud SVG resolution."
);
assert.doesNotMatch(
  primaryRouteSource,
  /SECONDARY_FAVICON_TILE_COLORS|secondaryFaviconDisplaySource/,
  "Primary rendering must not implement the secondary display policy."
);
assert.doesNotMatch(
  routeSource,
  /fetch\(|arrayBuffer|Uint8Array|DataView|createImageBitmap|canvas|getImageData|toDataURL|tileColor|AverageColor|Fingerprint|secondaryFaviconCache|localStorage|setStoredValues|getStoredValues/,
  "Secondary routing must not fetch, decode, sample, recolor, fingerprint, or cache favicon bytes."
);
assert.doesNotMatch(
  routeSource,
  /document\.documentElement\.dataset\.theme|data-theme|themeMode|resolvedTheme/,
  "The fixed secondary tile must not depend on theme state."
);
assert.doesNotMatch(
  routeSource,
  /favicon\.ico|apple-touch-icon|discoverSiteIconCandidateEntries|fetchImageDataUrl/,
  "Secondary routing must not probe or extract site icon files."
);
assert.match(
  routeSource,
  /chrome\.runtime\.getURL\("\/_favicon\/"\)[\s\S]*icon\.src = source/,
  "The browser-native favicon URL must be handed directly to the image element."
);
assert.match(
  source,
  /function cacheRenderedSiteIcon\(icon, site\)[\s\S]*"secondary_pending"[\s\S]*"fallback"[\s\S]*function firstPaintRenderIsThemeInvariant/,
  "First-paint cache must skip pending/fallback route states without excluding settled secondary favicons."
);
assert.match(
  fallbackRouteSource,
  /GENERIC_SITE_FALLBACK_ICON[\s\S]*site-icon-generic-fallback[\s\S]*icon\.src = GENERIC_SITE_FALLBACK_ICON/,
  "fallback.svg must remain isolated in the fallback route."
);
assert.doesNotMatch(routeSource, /GENERIC_SITE_FALLBACK_ICON|fallback\.svg/);
assert.doesNotMatch(cssSource, /\.site-icon-loading\s*\{/);
assert.match(newtabSource, /function createFavoriteSite[\s\S]*WayleafIcon\.applySiteIcon\(icon, site/);
assert.match(newtabSource, /function renderHistorySiteIcon[\s\S]*renderSharedSiteIcon\(icon, site, options\)/);
assert.match(newtabSource, /function createSiteCard[\s\S]*renderSharedSiteIcon\(icon, site, options\)/);

console.log("secondary favicon route fixtures passed");
