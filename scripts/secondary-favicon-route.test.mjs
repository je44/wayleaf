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
const cacheRenderedSiteIconSource = source.match(/function cacheRenderedSiteIcon\(icon, site\) \{[\s\S]*?\n\}\n\nfunction firstPaintRenderIsThemeInvariant/)?.[0] || "";
const cacheRenderedSiteIconOnLoadSource = source.match(/function cacheRenderedSiteIconOnLoad\(icon, site\) \{[\s\S]*?\n\}/)?.[0] || "";

for (const marker of [
  primaryStartMarker,
  primaryEndMarker,
  startMarker,
  endMarker
]) {
  assert.equal(markerCount(marker), 1, `${marker} must appear exactly once.`);
}

const cachedIcons = [];
const discoveredUrls = [];
const fetchedUrls = [];
const context = {
  URL,
  Object,
  Number,
  String,
  Boolean,
  Set,
  Promise,
  SITE_ICON_DIRECTORY: "icons/sites",
  safeUrl: (value) => {
    try {
      return new URL(value);
    } catch {
      return null;
    }
  },
  siteGroupKey: (parsedUrl) => parsedUrl?.hostname.replace(/^www\./, "") || "",
  siteIconRouteKey: (value) => {
    const parsedUrl = value instanceof URL ? value : context.safeUrl(value);
    return context.siteGroupKey(parsedUrl);
  },
  localFaviconForUrl: (value) => new URL(value).hostname === "local.example"
    ? "icons/sites/local.ico"
    : "",
  normalizeStoredSiteIcon: (value) => String(value || "").startsWith("data:image/")
    ? String(value)
    : "",
  siteIconSourceLooksLikeSvg: (value) => /image\/svg|\.svg(?:[?#]|$)/i.test(String(value || "")),
  faviconCandidateIsChromeFavicon: (value) => String(value || "").includes("/_favicon/"),
  faviconElementLooksLikeBrowserDefault: (icon) => icon.dataset.browserDefault === "true",
  discoverSiteIconCandidateEntries: (value) => {
    discoveredUrls.push(value);
    const hostname = new URL(value).hostname;
    return Promise.resolve(hostname === "empty.example" ? [] : [{
      url: `https://${hostname}/site-icon`,
      source: "document"
    }]);
  },
  fetchImageDataUrl: (value) => {
    fetchedUrls.push(value);
    return Promise.resolve("data:image/avif;base64,AAAA");
  },
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

const cacheOnLoadCalls = [];
const cacheOnLoadTasks = [];
const cacheOnLoadContext = {
  cacheRenderedSiteIcon: (icon, site) => {
    cacheOnLoadCalls.push({ source: icon.getAttribute("src"), url: site.url });
  },
  queueMicrotask: (task) => cacheOnLoadTasks.push(task),
  globalThis: null
};
cacheOnLoadContext.globalThis = cacheOnLoadContext;
vm.runInNewContext(`${cacheRenderedSiteIconOnLoadSource}
;globalThis.__cacheRenderedSiteIconOnLoad = cacheRenderedSiteIconOnLoad;`, cacheOnLoadContext);

let cacheOnLoadListenerType = "";
const completeFaviconIcon = {
  complete: true,
  addEventListener(type) {
    cacheOnLoadListenerType = type;
  },
  getAttribute(name) {
    return name === "src" ? "data:image/png;base64,AAAA" : "";
  }
};
cacheOnLoadContext.__cacheRenderedSiteIconOnLoad(completeFaviconIcon, { url: "https://example.com/" });
assert.equal(cacheOnLoadListenerType, "load", "Icon cache helper must still listen for future load events.");
assert.equal(cacheOnLoadTasks.length, 1, "Already-complete favicons must queue a first-paint cache write.");
cacheOnLoadTasks[0]();
assert.deepEqual(cacheOnLoadCalls, [{
  source: "data:image/png;base64,AAAA",
  url: "https://example.com/"
}], "Queued favicon cache write must preserve the loaded icon source and site context.");

function createIcon(siteKey = "example.com", state = "primary_miss", requestToken = "1") {
  const listeners = new Map();
  const classes = new Set();
  return {
    dataset: {
      siteKey,
      iconRouteRequest: requestToken,
      iconRouteSequence: requestToken,
      iconRouteState: state
    },
    classList: {
      add(name) {
        classes.add(name);
      },
      remove(name) {
        classes.delete(name);
      },
      toggle(name, enabled) {
        if (enabled) {
          classes.add(name);
        } else {
          classes.delete(name);
        }
      },
      contains(name) {
        return classes.has(name);
      }
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
  /^data:image\/svg\+xml;base64,PHN2Zy8\+$/,
  "Secondary routing must render any stored site image data URL without format filtering."
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

const defaultIcon = createIcon("default.example");
api.startSecondaryFaviconRoute(defaultIcon, { title: "Default", url: "https://default.example/path" }, "1");
defaultIcon.dataset.browserDefault = "true";
defaultIcon.dispatch("load");
assert.equal(defaultIcon.dataset.iconRouteState, "secondary_hit", "Chrome's loaded default globe must settle without another site-icon request.");
assert.match(defaultIcon.src, /\/_favicon\/\?/);
assert.deepEqual(discoveredUrls, []);
assert.deepEqual(fetchedUrls, []);

const storedIcon = createIcon("stored.example");
api.startSecondaryFaviconRoute(storedIcon, {
  title: "Stored",
  url: "https://stored.example/path",
  icon: "data:image/png;base64,AAAA"
}, "1");
assert.equal(storedIcon.dataset.iconRouteState, "secondary_hit", "A site-provided raster icon should render directly without a loading state.");
assert.equal(storedIcon.classList.contains("site-icon-loading"), false, "Direct secondary icons must not show the loading treatment.");
assert.equal(storedIcon.src, "data:image/png;base64,AAAA");

const broken = createIcon("broken.example");
api.startSecondaryFaviconRoute(broken, { title: "Broken", url: "https://broken.example" }, "1");
broken.dispatch("error");
assert.equal(broken.dataset.iconRouteState, "secondary_hit");
assert.equal(broken.dataset.iconMissing, "true");
assert.deepEqual(discoveredUrls, []);
assert.deepEqual(fetchedUrls, []);

const empty = createIcon("empty.example");
api.startSecondaryFaviconRoute(empty, { title: "Empty", url: "https://empty.example/path" }, "1");
empty.dispatch("error");
assert.equal(empty.dataset.iconRouteState, "secondary_hit");
assert.equal(empty.dataset.iconMissing, "true");

const brokenDirect = createIcon("local.example");
api.startSecondaryFaviconRoute(brokenDirect, { title: "Local", url: "https://local.example/path" }, "1");
brokenDirect.dispatch("error");
assert.equal(brokenDirect.dataset.iconRouteState, "secondary_pending");
assert.match(brokenDirect.src, /\/_favicon\/\?/);
brokenDirect.dispatch("error");
assert.equal(brokenDirect.dataset.iconRouteState, "secondary_hit");
assert.equal(brokenDirect.dataset.iconMissing, "true");

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
  /arrayBuffer|Uint8Array|DataView|createImageBitmap|canvas|getImageData|toDataURL|tileColor|AverageColor|Fingerprint|secondaryFaviconCache|localStorage|setStoredValues|getStoredValues/,
  "Secondary routing must not decode, sample, recolor, fingerprint, or cache favicon bytes."
);
assert.doesNotMatch(
  routeSource,
  /document\.documentElement\.dataset\.theme|data-theme|themeMode|resolvedTheme/,
  "The fixed secondary tile must not depend on theme state."
);
assert.doesNotMatch(
  routeSource,
  /discoverSiteIconCandidateEntries|fetchImageDataUrl/,
  "Secondary routing must accept Chrome's favicon result without document discovery."
);
assert.match(
  routeSource,
  /chrome\.runtime\.getURL\("\/_favicon\/"\)[\s\S]*icon\.src = source/,
  "The browser-native favicon URL must be handed directly to the image element."
);
assert.match(
  cacheRenderedSiteIconSource,
  /"primary_pending"[\s\S]*"primary_miss"[\s\S]*"secondary_pending"/,
  "First-paint cache must skip pending route states without excluding settled secondary favicons."
);
assert.match(
  cacheRenderedSiteIconOnLoadSource,
  /const cache = \(\) => cacheRenderedSiteIcon\(icon, site\);[\s\S]*icon\.addEventListener\("load", cache\);[\s\S]*icon\.complete[\s\S]*icon\.getAttribute\("src"\)[\s\S]*queueMicrotask\(cache\)/,
  "Icon load caching must also write already-complete favicon renders for the next Wayleaf tab."
);
assert.doesNotMatch(source, /GENERIC_SITE_FALLBACK_ICON|fallback\.svg|applyGenericFallbackSiteIcon|site-icon-generic-fallback/);
assert.doesNotMatch(cssSource, /\.site-icon-loading\s*\{/);
assert.match(newtabSource, /function createFavoriteSite[\s\S]*WayleafIcon\.applySiteIcon\(icon, site/);
assert.match(newtabSource, /function renderHistorySiteIcon[\s\S]*renderSharedSiteIcon\(icon, site, options\)/);
assert.match(newtabSource, /function renderBookmarkSiteIcon[\s\S]*WayleafIcon\.applyBookmarkSiteIcon\(icon, iconSite\)/);
assert.match(newtabSource, /function createSiteCard\(site, options = \{\}, renderIcon = renderSharedSiteIcon\)[\s\S]*renderIcon\(icon, site, options\)/);
assert.match(newtabSource, /function createBookmarkSiteCard[\s\S]*createSiteCard\(site, \{ \.\.\.options, allowFavorite: false \}, renderBookmarkSiteIcon\)/);

console.log("secondary favicon route fixtures passed");
