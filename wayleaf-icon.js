// Wayleaf icon rendering module. Keep primary, secondary, and fallback routes here; newtab.js only calls the public API.

const SITE_ICON_DIRECTORY = "icons/sites";
const SITE_ICON_CACHE_STORAGE_KEY = "siteIconCache";
const MAX_CACHED_SITE_ICONS = 80;
const MAX_CACHED_SITE_ICON_BYTES = 96 * 1024;
const SITE_ICON_RAW_SVG_CACHE_STORAGE_KEY = "__wayleaf_site_icon_svg__";
const MAX_CACHED_SITE_ICON_SVG_BYTES = 256 * 1024;
const MAX_CACHED_SITE_ICON_SVG_ENTRIES = 12;
const SITE_ICON_CODE_HASH_STORAGE_KEY = "__wayleaf_icon_code_hash__";
const ICON_CODE_SOURCE_FILES = ["wayleaf-icon.js", "newtab.js"];
const SITE_ICON_DISCOVERY_TIMEOUT_MS = 3500;
const SITE_ICON_DOCUMENT_DISCOVERY_TIMEOUT_MS = 15000;
const SITE_ICON_FETCH_TIMEOUT_MS = 4500;
const SITE_ICON_DEFAULT_RESCUE_TIMEOUT_MS = 8000;
const SITE_ICON_DISCOVERY_HTML_MAX_BYTES = 256 * 1024;
const SITE_ICON_DISCOVERY_TARGET_SIZE = 128;
const SITE_ICON_DISCOVERY_CANDIDATE_LIMIT = 12;
const SITE_ICON_DISCOVERY_MEMORY_CACHE_LIMIT = 96;
const SITE_ICON_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const REMOTE_BRAND_ICON_MISSING_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const REMOTE_BRAND_ICON_INDEX_TTL_MS = 24 * 60 * 60 * 1000;
const REMOTE_BRAND_ICON_PROVIDER_VERSION = 3;
const FAVICON_BACKGROUND_SAMPLE_SIZE = 32;
const FAVICON_BACKGROUND_ALPHA_MIN = 0.35;
const FAVICON_BACKGROUND_COLOR_DISTANCE = 58;
const FAVICON_BACKGROUND_CONFIDENCE_MIN = 0.32;
const FAVICON_FOREGROUND_COLOR_DISTANCE = 12;
const FAVICON_LOW_CONTRAST_FOREGROUND_COVERAGE_MIN = 0.018;
const FAVICON_LOW_CONTRAST_AVERAGE_MAX = 1.32;
const FAVICON_LOW_CONTRAST_PEAK_MAX = 1.65;
const FAVICON_TRANSPARENT_GLYPH_COVERAGE_MAX = 0.48;
const FAVICON_TRANSPARENT_GLYPH_COVERAGE_MIN = 0.01;
const FAVICON_TRANSPARENT_GLYPH_EDGE_CONFIDENCE_MAX = 0.22;
const FAVICON_TRANSPARENT_GLYPH_CANDIDATE_RATIO_MIN = 0.48;
const FAVICON_NEAR_WHITE_GLYPH_LUMINANCE_MIN = 0.82;
const FAVICON_NEAR_WHITE_GLYPH_FOREGROUND_COVERAGE_MAX = 0.035;
const FAVICON_PAPER_SURFACE_COVERAGE_MIN = 0.12;
const FAVICON_PAPER_SURFACE_ARTWORK_COVERAGE_MIN = 0.012;
const FAVICON_PAPER_SURFACE_SPAN_MIN = 0.38;
const FAVICON_EDGE_CARRIER_CONFIDENCE_MIN = 0.48;
const FAVICON_EMBEDDED_TILE_EDGE_CONFIDENCE_MAX = 0.24;
const FAVICON_EMBEDDED_TILE_INNER_CONFIDENCE_MIN = 0.34;
const FAVICON_EMBEDDED_TILE_CONTRAST_MIN = 1.35;
const FAVICON_EMBEDDED_TILE_CONTRAST_MAX_MIX = 0.42;
const FAVICON_EMBEDDED_TILE_FUSION_CLEAR_DISTANCE = 48;
const FAVICON_EMBEDDED_TILE_FUSION_FEATHER_DISTANCE = 24;
const FAVICON_READABLE_CARRIER_CONTRAST_MIN = 3;
const FAVICON_READABLE_CARRIER_MAX_MIX = 0.72;
const FAVICON_ADAPTIVE_CARRIER_VERSION = 12;
const BRAND_ICON_VI_CONTRAST_MIN = 2.75;
const BRAND_ICON_DARK_MODE_CARRIER = "#f8fafc";
const BRAND_ICON_LIGHT_MODE_DARK_CARRIER = "#102019";
const BRAND_ICON_MULTICOLOR_PAPER_CARRIER = "#ffffff";
const BRAND_ICON_MULTICOLOR_DARK_CARRIER = "#111827";
const GENERIC_SITE_FALLBACK_ICON = `${SITE_ICON_DIRECTORY}/fallback.svg`;
const GENERIC_SITE_FALLBACK_TILE_COLOR = "#f04424";
const SITE_ICON_FILE_BY_SITE_KEY = Object.freeze({
  "1688.com": "1688.ico",
  "alipay.com": "alipay.svg",
  "alibaba.com": "alibaba.svg",
  "aistudio.google.com": "aistudio.svg",
  "atlassian.net": "jira.svg",
  "azure.microsoft.com": "azure.svg",
  "b.ai": "bai.png",
  "bitbucket.org": "bitbucket.svg",
  "booking.com": "bookingdotcom.svg",
  "bsky.app": "bluesky.svg",
  "chrome.google.com": "chrome.svg",
  "cloud.google.com": "googlecloud.svg",
  "colab.research.google.com": "colab.svg",
  "datadoghq.com": "datadog.svg",
  "developer.mozilla.org": "mdn.svg",
  "chatglm.cn": "glm.svg",
  "doubao.com": "doubao.svg",
  "docs.b.ai": "baidocs.svg",
  "douyin.com": "douyin.svg",
  "store.epicgames.com": "epicgames.svg",
  "feishu.cn": "feishu.png",
  "firefly.adobe.com": "adobefirefly.svg",
  "firebase.google.com": "firebase.svg",
  "gemini.google.com": "googlegemini.svg",
  "itch.io": "itchdotio.svg",
  "jd.com": "jd.svg",
  "jimeng.jianying.com": "jimeng.svg",
  "iqiyi.com": "iqiyi.svg",
  "kimi.com": "kimi.svg",
  "larksuite.com": "larksuite.ico",
  "mimo.mi.com": "xiaomimimo.svg",
  "mimo.xiaomi.com": "xiaomimimo.svg",
  "mgtv.com": "mgtv.svg",
  "music.163.com": "neteasecloudmusic.svg",
  "nodejs.org": "nodedotjs.svg",
  "npmjs.com": "npm.svg",
  "pinduoduo.com": "pinduoduo.svg",
  "proton.me": "protonmail.svg",
  "qq.com": "qq.svg",
  "tmall.com": "tmall.png",
  "uizard.io": "uizard.ico",
  "v.qq.com": "vqq.svg",
  "vuejs.org": "vuedotjs.svg",
  "yandex.com": "yandex.ico"
});
const REMOTE_BRAND_ICON_PROVIDERS = Object.freeze([
  {
    id: "thesvg",
    index: "thesvg",
    urlForSlug: (slug) => `https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/${encodeURIComponent(slug)}/default.svg`
  },
  {
    id: "lobehub",
    index: "lobehub-static-svg",
    packageName: "@lobehub/icons-static-svg",
    urlForSlug: (slug) => `https://unpkg.com/@lobehub/icons-static-svg@latest/icons/${encodeURIComponent(slug)}.svg`
  }
]);
const REMOTE_BRAND_ICON_SLUGS_BY_SITE_KEY = Object.freeze({
  "analytics.google.com": ["googleanalytics", "google"],
  "atlassian.net": ["atlassian", "jira"],
  "calendar.google.com": ["googlecalendar", "google"],
  "code.visualstudio.com": ["visualstudiocode"],
  "developer.mozilla.org": ["mdnwebdocs", "mdn"],
  "docs.google.com": ["googledocs", "google"],
  "drive.google.com": ["googledrive", "google"],
  "gmail.com": ["gmail", "google"],
  "maps.google.com": ["googlemaps", "google"],
  "meet.google.com": ["googlemeet", "google"],
  "music.163.com": ["neteasecloudmusic"],
  "nextjs.org": ["nextdotjs", "nextjs"],
  "nodejs.org": ["nodedotjs", "nodejs"],
  "npmjs.com": ["npm"],
  "office.com": ["microsoftoffice", "microsoft"],
  "proton.me": ["protonmail", "proton"],
  "react.dev": ["react"],
  "steamcommunity.com": ["steam"],
  "steampowered.com": ["steam"],
  "stackoverflow.com": ["stackoverflow"],
  "teams.microsoft.com": ["microsoftteams", "microsoft"],
  "trip.com": ["tripdotcom"],
  "twitter.com": ["x", "twitter"],
  "vuejs.org": ["vuedotjs", "vue"],
  "x.com": ["x", "twitter"]
});
const SITE_ICON_TILE_COLOR_BY_SITE_KEY = Object.freeze({
  "1688.com": "#ff6000",
  "adobe.com": "#ff0000",
  "airbnb.com": "#ff5a5f",
  "alibaba.com": "#ff6a00",
  "alibabacloud.com": "#ff6a00",
  "aliexpress.com": "#e62e04",
  "alipay.com": "#1677ff",
  "amazon.com": "#ff9900",
  "anthropic.com": "#191919",
  "apple.com": "#000000",
  "atlassian.com": "#0052cc",
  "atlassian.net": "#0052cc",
  "aistudio.google.com": "#4285f4",
  "aws.amazon.com": "#ff9900",
  "azure.microsoft.com": "#0078d4",
  "baidu.com": "#2932e1",
  "bilibili.com": "#00a1d6",
  "bing.com": "#258ffa",
  "bitbucket.org": "#0052cc",
  "canva.com": "#00c4cc",
  "chatgpt.com": "#ffffff",
  "claude.ai": "#d97757",
  "cloudflare.com": "#f38020",
  "cloud.google.com": "#4285f4",
  "colab.research.google.com": "#f9ab00",
  "chrome.google.com": "#4285f4",
  "cursor.com": "#000000",
  "deepseek.com": "#4d6bfe",
  "discord.com": "#5865f2",
  "developer.mozilla.org": "#15141a",
  "docs.b.ai": "#111827",
  "chatglm.cn": "#3859ff",
  "doubao.com": "#1e37fc",
  "docs.google.com": "#4285f4",
  "douyin.com": "#000000",
  "duckduckgo.com": "#de5833",
  "figma.com": "#f24e1e",
  "firefly.adobe.com": "#ff0000",
  "firebase.google.com": "#dd2c00",
  "framer.com": "#000000",
  "calendar.google.com": "#4285f4",
  "gemini.google.com": "#4285f4",
  "github.com": "#181717",
  "gmail.com": "#ea4335",
  "google.com": "#4285f4",
  "grok.com": "#000000",
  "drive.google.com": "#4285f4",
  "huggingface.co": "#ffd21e",
  "iconfont.cn": "#0c6066",
  "instagram.com": "#e4405f",
  "iqiyi.com": "#689f38",
  "jd.com": "#ff0000",
  "jimeng.jianying.com": "#1c6fff",
  "kagi.com": "#ffb319",
  "kimi.com": "#111827",
  "larksuite.com": "#00d6b9",
  "linkedin.com": "#0a66c2",
  "microsoft.com": "#5e5e5e",
  "mimo.mi.com": "#000000",
  "mimo.xiaomi.com": "#000000",
  "mgtv.com": "#f86f11",
  "midjourney.com": "#0050c9",
  "notion.so": "#000000",
  "openai.com": "#412991",
  "perplexity.ai": "#1fb8cd",
  "pinterest.com": "#bd081c",
  "pinduoduo.com": "#e02e24",
  "poe.com": "#5d5cde",
  "reddit.com": "#ff4500",
  "replicate.com": "#000000",
  "slack.com": "#4a154b",
  "sogou.com": "#fb6022",
  "spotify.com": "#1ed760",
  "stackoverflow.com": "#f58025",
  "suno.com": "#000000",
  "taobao.com": "#e94f20",
  "teams.microsoft.com": "#6264a7",
  "threads.com": "#000000",
  "tiktok.com": "#000000",
  "tmall.com": "#ff0036",
  "uizard.io": "#00f9e5",
  "v.qq.com": "#30a3f9",
  "vercel.com": "#000000",
  "wechat.com": "#07c160",
  "weibo.com": "#e6162d",
  "x.com": "#000000",
  "xiaohongshu.com": "#ff2442",
  "xiaomimimo.com": "#000000",
  "yandex.com": "#ffcc00",
  "youtube.com": "#ff0000",
  "zhihu.com": "#0084ff"
});
const ORIGINAL_ARTWORK_BRAND_TILE_SITE_KEYS = new Set([
  "developer.mozilla.org",
  "jd.com"
]);

let availableSiteIconFiles = new Set();
let siteIconIndexLoaded = false;
let siteIconIndexState = "pending";
let resolveSiteIconIndexReady = () => {};
const siteIconIndexReadyPromise = new Promise((resolve) => {
  resolveSiteIconIndexReady = resolve;
});
const whiteSvgIconDataUrlCache = new Map();
const localSiteIconBrandColorCache = new Map();
const localSiteIconRenderModeCache = new Map();
const localSiteIconExplicitBrandColorCache = new Map();
const localSiteIconVisibleColorsCache = new Map();
const localSiteIconEmbeddedCarrierColorCache = new Map();
const localSiteIconBrandColorRequests = new Map();
const siteIconDiscoveryCache = new Map();
const remoteBrandIconIndexCache = new Map();
const siteIconRawSvgTextCache = new Map();
const siteIconRawSvgStalePaths = new Set();
const siteIconRawSvgRevalidatedPaths = new Set();

function firstPaintIconCacheKey(site) {
  const url = safeUrl(site?.url);
  return siteGroupKey(url) || url?.hostname || "";
}

function siteIconFileNameForSiteKey(siteKey) {
  return siteKey ? SITE_ICON_FILE_BY_SITE_KEY[siteKey] || `${siteKey.split(".")[0]}.svg` : "";
}

function siteIconPathFromFileName(fileName) {
  return fileName ? `${SITE_ICON_DIRECTORY}/${fileName}` : "";
}

function warmFirstPaintLocalIconForSiteKey(siteKey) {
  const fileName = siteIconFileNameForSiteKey(siteKey);
  const iconPath = siteIconPathFromFileName(fileName);
  if (!siteIconSourceLooksLikeSvg(iconPath)) {
    return "";
  }
  if (SITE_ICON_FILE_BY_SITE_KEY[siteKey]) {
    return iconPath;
  }
  return siteIconRawSvgTextCache.has(iconPath) ? iconPath : "";
}

function warmFirstPaintLocalIconForUrl(url) {
  return warmFirstPaintLocalIconForSiteKey(siteGroupKey(safeUrl(url)));
}

function cachedFirstPaintIconRender(iconRenders, site) {
  const mode = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  const entry = iconRenders?.[firstPaintIconCacheKey(site)];
  const value = entry?.[mode];
  const src = typeof value?.src === "string" && value.src.length <= MAX_CACHED_SITE_ICON_BYTES * 2 ? value.src : "";
  const tileLight = typeof value?.tileLight === "string" && value.tileLight.length <= 128 ? value.tileLight : "";
  const tileDark = typeof value?.tileDark === "string" && value.tileDark.length <= 128 ? value.tileDark : "";
  if (!src || !tileLight || !tileDark || Date.now() - Number(value.updatedAt || 0) > SITE_ICON_CACHE_TTL_MS) {
    return null;
  }
  return {
    src,
    source: typeof entry.source === "string" && entry.source.length <= MAX_CACHED_SITE_ICON_BYTES * 2 ? entry.source : "",
    tile: value.tile === "brand" || value.tile === "generated" ? value.tile : "plain",
    tileLight,
    tileDark,
    local: Boolean(value.local),
    generic: Boolean(value.generic),
    adaptiveCarrierVersion: Number(value.adaptiveCarrierVersion || 0)
  };
}

function restoreFirstPaintIconRender(icon, site, render) {
  storeIconSiteContext(icon, site);
  icon.dataset.siteKey = firstPaintIconCacheKey(site);
  const localIcon = localIconForUrl(site.url) || warmFirstPaintLocalIconForUrl(site.url);
  const localTile = localIcon ? syncLocalIconTile(site, localIcon) : null;
  const currentRender = firstPaintIconRenderWithCurrentTile(site, render);
  if (localIcon && firstPaintRenderStaleForLocalIcon(icon.dataset.siteKey, localIcon, render)) {
    const requestToken = beginIconRouteRequest(icon, "primary_hit");
    if (!localTile && siteIconSourceLooksLikeSvg(localIcon) && !localSiteIconRenderModeCache.has(localIcon)) {
      paintPendingLocalSvgIcon(icon, site, localIcon, requestToken);
      return;
    }
    renderPrimarySiteIcon(icon, site, localIcon, {}, requestToken);
    return;
  }
  if (firstPaintRenderStaleForAdaptiveFavicon(localIcon, currentRender)) {
    applySiteIcon(icon, site);
    return;
  }
  if (currentRender.source) {
    icon.dataset.iconSource = currentRender.source;
    icon.dataset.iconCandidate = currentRender.source;
  }
  icon.classList.toggle("site-icon-generic-fallback", currentRender.generic);
  applyIconTile(icon, currentRender.tile, { light: currentRender.tileLight, dark: currentRender.tileDark }, currentRender.local);
  icon.dataset.iconCacheHydrated = "true";
  icon.addEventListener("error", () => {
    if (icon.dataset.iconCacheHydrated === "true") {
      delete icon.dataset.iconCacheHydrated;
      applySiteIcon(icon, site);
    }
  }, { once: true });
  icon.src = currentRender.src;
}

function paintPendingLocalSvgIcon(icon, site, localIcon, requestToken) {
  if (paintCachedPrimaryLocalSvgIcon(icon, site, localIcon, requestToken)) {
    return;
  }
  const siteKey = firstPaintIconCacheKey(site);
  setIconRouteState(icon, "primary_hit", requestToken);
  icon.dataset.siteKey = siteKey;
  icon.dataset.iconSource = localIcon;
  icon.dataset.iconCandidate = localIcon;
  delete icon.dataset.iconDefaultRescue;
  delete icon.dataset.iconDefaultProbe;
  icon.classList.remove("site-icon-generic-fallback");
  applyIconTile(icon, "brand", { light: BRAND_ICON_MULTICOLOR_PAPER_CARRIER, dark: BRAND_ICON_MULTICOLOR_PAPER_CARRIER }, true);
  icon.src = localIcon;
  icon.removeAttribute("srcset");
  bindFaviconFallback(icon, site);
  loadLocalSiteIconBrandColor(localIcon).then(() => {
    if (iconRouteRequestStillCurrent(icon, siteKey, requestToken) && iconStillRenderingCandidate(icon, localIcon)) {
      renderPrimarySiteIcon(icon, site, localIcon, {}, requestToken);
    }
  });
}

function paintCachedPrimaryLocalSvgIcon(icon, site, localIcon, requestToken) {
  if (!localSiteIconRawSvgText(localIcon)) {
    return false;
  }
  const siteKey = firstPaintIconCacheKey(site);
  const syncTile = syncLocalIconTile(site, localIcon);
  if (!syncTile) {
    return false;
  }
  setIconRouteState(icon, "primary_hit", requestToken);
  icon.dataset.siteKey = siteKey;
  icon.dataset.iconSource = localIcon;
  icon.dataset.iconCandidate = localIcon;
  delete icon.dataset.iconDefaultRescue;
  delete icon.dataset.iconDefaultProbe;
  icon.classList.remove("site-icon-generic-fallback");
  applyIconTile(icon, syncTile.tileMode, syncTile.tileColors, syncTile.isLocalIconSource);
  const displaySource = syncLocalIconFinalSrc(icon, localIcon);
  if (!displaySource) {
    return false;
  }
  icon.src = displaySource;
  icon.removeAttribute("srcset");
  bindFaviconFallback(icon, site);
  cacheRenderedSiteIcon(icon, site);
  return true;
}

function firstPaintIconRenderWithCurrentTile(site, render) {
  const source = render.source || render.src || "";
  const remoteDescriptor = remoteBrandSvgDescriptorFromSource(source);
  if (!siteIconSourceLooksLikeSvg(source) && !remoteDescriptor) {
    return render;
  }
  if (!remoteDescriptor && !localSiteIconRenderModeCache.has(source)) {
    return render;
  }
  const tileSource = remoteDescriptor ? source : localIconForUrl(site.url) || warmFirstPaintLocalIconForUrl(site.url) || source;
  const siteKey = firstPaintIconCacheKey(site);
  const tileColor = siteIconBrandColor(siteKey, tileSource);
  const svgRenderMode = primarySvgIconRenderMode(tileSource);
  if (!tileColor && !primarySvgRenderModeUsesCarrier(svgRenderMode)) {
    return render;
  }
  const tileColors = brandIconTileColors(tileColor, siteKey, tileSource);
  return {
    ...render,
    tile: tileSource ? "brand" : render.tile,
    tileLight: tileColors.light,
    tileDark: tileColors.dark,
    local: String(tileSource || "").startsWith("icons/") || render.local
  };
}

function firstPaintRenderStaleForLocalIcon(siteKey, localIcon, render) {
  if (!localIcon) {
    return false;
  }
  if (render.src !== localIcon && render.source !== localIcon) {
    return true;
  }
  if (render.source === localIcon && siteIconSourceLooksLikeSvg(localIcon) && !localSiteIconRenderModeCache.has(localIcon)) {
    return !firstPaintLocalSvgRenderMatchesKnownMaskCarrier(siteKey, localIcon, render);
  }
  return render.source === localIcon
    && render.src !== localIcon
    && keepsBrandIconOriginal(siteKey, localIcon);
}

function firstPaintLocalSvgRenderMatchesKnownMaskCarrier(siteKey, localIcon, render) {
  const color = siteIconBrandColor(siteKey, localIcon);
  if (!color || render.tile !== "brand" || !render.local) {
    return false;
  }
  const tileColors = monochromePrimarySvgIconTileColors(color, siteKey, localIcon);
  return render.tileLight === tileColors.light && render.tileDark === tileColors.dark;
}

function firstPaintRenderStaleForAdaptiveFavicon(localIcon, render) {
  return !localIcon
    && render.tile === "plain"
    && !render.local
    && !render.generic
    && render.adaptiveCarrierVersion !== FAVICON_ADAPTIVE_CARRIER_VERSION;
}

function adaptiveFaviconCarrierCacheVersion(icon) {
  return icon.dataset.iconTile === "plain"
    && !icon.classList.contains("site-icon-local")
    && !icon.classList.contains("site-icon-generic-fallback")
    ? FAVICON_ADAPTIVE_CARRIER_VERSION
    : 0;
}

function cacheRenderedSiteIcon(icon, site) {
  if (icon.dataset.iconDefaultProbe === "pending" || icon.dataset.iconDefaultRescue === "pending") {
    return;
  }
  if (["primary_pending", "primary_miss", "secondary_pending", "fallback"].includes(icon.dataset.iconRouteState || "")) {
    return;
  }
  // Do not cache a temporary favicon render over a known local Wayleaf icon.
  if (!siteIconIndexLoaded) {
    return;
  }
  if (localIconForUrl(site.url) && !icon.classList.contains("site-icon-local")) {
    return;
  }
  const key = firstPaintIconCacheKey(site);
  const src = icon.getAttribute("src") || "";
  const source = icon.dataset.iconSource || src;
  if (String(source || "").startsWith(`${SITE_ICON_DIRECTORY}/`) && siteIconSourceLooksLikeSvg(source) && !localSiteIconRenderModeCache.has(source)) {
    return;
  }
  const tileLight = icon.style.getPropertyValue("--site-icon-tile-light").trim();
  const tileDark = icon.style.getPropertyValue("--site-icon-tile-dark").trim();
  if (!key || !src || src.length > MAX_CACHED_SITE_ICON_BYTES * 2 || !tileLight || !tileDark) {
    return;
  }
  const mode = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  const cache = readFirstPaintCache();
  const iconRenders = { ...(cache.iconRenders || {}) };
  const adaptiveCarrierVersion = adaptiveFaviconCarrierCacheVersion(icon);
  const render = {
    src,
    tile: icon.dataset.iconTile || "plain",
    tileLight,
    tileDark,
    local: icon.classList.contains("site-icon-local"),
    generic: icon.classList.contains("site-icon-generic-fallback"),
    adaptiveCarrierVersion,
    updatedAt: Date.now()
  };
  const themedRenders = adaptiveCarrierVersion || firstPaintRenderIsThemeInvariant(source)
    ? { light: render, dark: render }
    : { [mode]: render };
  iconRenders[key] = {
    ...(iconRenders[key] || {}),
    source: source || iconRenders[key]?.source || "",
    ...themedRenders
  };
  // Keep fixed first-paint surfaces out of transient history eviction.
  const protectedKeys = firstPaintProtectedIconKeys(cache);
  const renderRecency = (entry) => Math.max(Number(entry.light?.updatedAt || 0), Number(entry.dark?.updatedAt || 0));
  Object.entries(iconRenders)
    .filter(([entryKey]) => !protectedKeys.has(entryKey))
    .sort(([, first], [, second]) => renderRecency(second) - renderRecency(first))
    .slice(MAX_CACHED_SITE_ICONS)
    .forEach(([staleKey]) => delete iconRenders[staleKey]);
  writeFirstPaintCache({ iconRenders });
}

function firstPaintRenderIsThemeInvariant(source) {
  return siteIconSourceLooksLikeSvg(source)
    && (usesGradientIconCarrier(source) || usesOriginalIconCarrier(source));
}

function firstPaintProtectedIconKeys(cache = readFirstPaintCache()) {
  const keys = new Set();
  for (const site of normalizeCachedFavoriteSites(cache.favoriteSites)) {
    const key = firstPaintIconCacheKey(site);
    if (key) {
      keys.add(key);
    }
  }
  if (Array.isArray(cache.recentGroups)) {
    for (const group of cache.recentGroups) {
      if (group?.key) {
        keys.add(String(group.key));
      }
    }
  }
  return keys;
}

function cacheRenderedSiteIconFromContext(icon) {
  if (!icon.closest(".favorite-site, .recent-folder-item, .today-history-item")) {
    return;
  }
  cacheRenderedSiteIcon(icon, {
    title: icon.dataset.siteTitle || icon.alt || "",
    url: icon.dataset.siteUrl || ""
  });
}

function cacheRenderedSiteIconOnLoad(icon, site) {
  icon.addEventListener("load", () => cacheRenderedSiteIcon(icon, site));
}

// SECONDARY_FAVICON_ROUTE:START
const SECONDARY_FAVICON_TILE_COLORS = Object.freeze({
  light: "#ffffff",
  dark: "#ffffff"
});
const SECONDARY_FAVICON_DISPLAY_SIZE = 64;
const ICON_ROUTE_STATES = new Set([
  "primary_pending",
  "primary_hit",
  "primary_miss",
  "secondary_pending",
  "secondary_hit",
  "fallback"
]);

function setIconRouteState(icon, state, requestToken = "") {
  if (!ICON_ROUTE_STATES.has(state)) {
    return "";
  }
  icon.dataset.iconRouteState = state;
  icon.classList.toggle("site-icon-loading", state === "primary_pending" || state === "secondary_pending");
  if (requestToken) {
    icon.dataset.iconRouteRequest = requestToken;
  }
  return state;
}

function beginIconRouteRequest(icon, state) {
  const requestToken = String(Number(icon.dataset.iconRouteSequence || 0) + 1);
  icon.dataset.iconRouteSequence = requestToken;
  setIconRouteState(icon, state, requestToken);
  return requestToken;
}

function secondaryFaviconRouteCanStart(state) {
  return state === "primary_miss";
}

function secondaryFaviconRequestStillCurrent(icon, siteKey, requestToken) {
  return Boolean(icon
    && icon.dataset.iconRouteRequest === requestToken
    && icon.dataset.siteKey === siteKey
    && ["primary_miss", "secondary_pending", "secondary_hit"].includes(icon.dataset.iconRouteState));
}

function secondaryFaviconDisplaySource(site) {
  const parsedUrl = safeUrl(site.url);
  if (!parsedUrl) {
    return "";
  }
  const localFavicon = localFaviconForUrl(parsedUrl.href);
  if (localFavicon) {
    return localFavicon;
  }
  const storedIcon = normalizeStoredSiteIcon(site.icon || "");
  if (storedIcon && !siteIconSourceLooksLikeSvg(storedIcon)) {
    return storedIcon;
  }
  try {
    const faviconUrl = new URL(chrome.runtime.getURL("/_favicon/"));
    faviconUrl.searchParams.set("pageUrl", parsedUrl.href);
    faviconUrl.searchParams.set("size", String(SECONDARY_FAVICON_DISPLAY_SIZE));
    return faviconUrl.toString();
  } catch {
    return "";
  }
}

function applySecondaryFaviconFallback(icon, site, siteKey, requestToken) {
  if (!secondaryFaviconRequestStillCurrent(icon, siteKey, requestToken)) {
    return;
  }
  setIconRouteState(icon, "fallback", requestToken);
  applyGenericFallbackSiteIcon(icon, safeUrl(site.url)?.hostname || site.title || "");
}

function paintSecondaryFaviconSource(icon, site, siteKey, source, requestToken) {
  if (!secondaryFaviconRequestStillCurrent(icon, siteKey, requestToken)) {
    return;
  }
  setIconRouteState(icon, "secondary_pending", requestToken);
  icon.removeAttribute("srcset");
  icon.dataset.iconMissing = "false";
  icon.dataset.iconCandidate = source;
  icon.dataset.iconSource = source;
  delete icon.dataset.iconFusedTile;
  delete icon.dataset.iconDefaultRescue;
  delete icon.dataset.iconDefaultRescueCandidate;
  delete icon.dataset.iconDefaultProbe;
  icon.classList.remove("site-icon-generic-fallback");
  applyIconTile(icon, "plain", SECONDARY_FAVICON_TILE_COLORS, false);

  icon.addEventListener("load", () => {
    if (secondaryFaviconRequestStillCurrent(icon, siteKey, requestToken)
      && icon.dataset.iconCandidate === source) {
      setIconRouteState(icon, "secondary_hit", requestToken);
      cacheRenderedSiteIcon(icon, site);
    }
  }, { once: true });
  icon.addEventListener("error", () => {
    if (secondaryFaviconRequestStillCurrent(icon, siteKey, requestToken)
      && icon.dataset.iconCandidate === source) {
      applySecondaryFaviconFallback(icon, site, siteKey, requestToken);
    }
  }, { once: true });
  icon.src = source;
}

function startSecondaryFaviconRoute(icon, site, requestToken = icon.dataset.iconRouteRequest || "") {
  if (!secondaryFaviconRouteCanStart(icon.dataset.iconRouteState)) {
    return;
  }
  const siteKey = siteGroupKey(safeUrl(site.url));
  if (!siteKey) {
    applySecondaryFaviconFallback(icon, site, siteKey, requestToken);
    return;
  }
  const source = secondaryFaviconDisplaySource(site);
  if (!source) {
    applySecondaryFaviconFallback(icon, site, siteKey, requestToken);
    return;
  }
  paintSecondaryFaviconSource(icon, site, siteKey, source, requestToken);
}
// SECONDARY_FAVICON_ROUTE:END

// PRIMARY_SITE_ICON_ROUTE:START
function waitForSiteIconIndex() {
  return siteIconIndexLoaded ? Promise.resolve(siteIconIndexState) : siteIconIndexReadyPromise;
}

function iconRouteRequestStillCurrent(icon, siteKey, requestToken) {
  return Boolean(icon
    && icon.dataset.iconRouteRequest === requestToken
    && icon.dataset.siteKey === siteKey);
}

function pendingSiteIconDataUrl() {
  const color = getComputedStyle(document.documentElement).getPropertyValue("--accent-strong").trim() || "#74807b";
  return svgTextDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" color="${color}">
  <path d="M0 0h24v24H0z" fill="none"/>
  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3c4.97 0 9 4.03 9 9">
    <animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/>
  </path>
</svg>`);
}

function paintPendingSiteIcon(icon) {
  const pendingIcon = pendingSiteIconDataUrl();
  icon.removeAttribute("srcset");
  icon.dataset.iconCandidate = pendingIcon;
  icon.dataset.iconSource = pendingIcon;
  delete icon.dataset.iconFusedTile;
  icon.classList.remove("site-icon-generic-fallback");
  icon.classList.add("site-icon-loading");
  applyIconTile(icon, "plain", { light: "var(--light-icon-tile)", dark: "var(--dark-icon-tile)" }, false);
  icon.src = pendingIcon;
}

function applySiteIcon(icon, site, options = {}) {
  storeIconSiteContext(icon, site);
  const siteKey = siteGroupKey(safeUrl(site.url)) || "";
  icon.dataset.siteKey = siteKey;
  delete icon.dataset.iconCacheHydrated;
  const requestToken = beginIconRouteRequest(icon, "primary_pending");
  const warmLocalIcon = warmFirstPaintLocalIconForUrl(site.url);
  if (warmLocalIcon) {
    setIconRouteState(icon, "primary_hit", requestToken);
    return Promise.resolve(renderPrimarySiteIcon(icon, site, warmLocalIcon, options, requestToken));
  }
  paintPendingSiteIcon(icon);
  return waitForSiteIconIndex().then(() => resolvePrimarySiteIconRoute(icon, site, options, requestToken));
}

async function resolvePrimarySiteIconRoute(icon, site, options, requestToken) {
  const parsedUrl = safeUrl(site.url);
  const siteKey = siteGroupKey(parsedUrl) || "";
  if (!iconRouteRequestStillCurrent(icon, siteKey, requestToken)) {
    return;
  }
  if (siteIconIndexState !== "ready") {
    setIconRouteState(icon, "fallback", requestToken);
    applyGenericFallbackSiteIcon(icon, parsedUrl?.hostname || site.title || "");
    return;
  }
  const localIcon = localIconForUrl(site.url);
  const siteIcon = normalizeStoredSiteIcon(site.icon || "");
  const siteIconIsRemoteBrand = Boolean(remoteBrandSvgDescriptorFromSource(siteIcon));
  const iconSource = localIcon || (siteIconIsRemoteBrand ? siteIcon : "");
  if (iconSource) {
    setIconRouteState(icon, "primary_hit", requestToken);
    return renderPrimarySiteIcon(icon, site, iconSource, options, requestToken);
  }
  let remoteBrandIcon;
  try {
    remoteBrandIcon = await discoverRemoteBrandIconDataUrl(site.url, { requireStableMiss: true });
  } catch {
    if (iconRouteRequestStillCurrent(icon, siteKey, requestToken)) {
      setIconRouteState(icon, "fallback", requestToken);
      applyGenericFallbackSiteIcon(icon, parsedUrl?.hostname || site.title || "");
    }
    return;
  }
  if (!iconRouteRequestStillCurrent(icon, siteKey, requestToken)) {
    return;
  }
  const currentLocalIcon = localIconForUrl(site.url);
  if (currentLocalIcon) {
    setIconRouteState(icon, "primary_hit", requestToken);
    return renderPrimarySiteIcon(icon, site, currentLocalIcon, options, requestToken);
  }
  if (remoteBrandIcon) {
    setIconRouteState(icon, "primary_hit", requestToken);
    applyRemoteBrandIcon(icon, site, remoteBrandIcon);
    return;
  }
  setIconRouteState(icon, "primary_miss", requestToken);
  return startSecondaryFaviconRoute(icon, site, requestToken);
}

function renderPrimarySiteIcon(icon, site, iconSource, options = {}, requestToken = icon.dataset.iconRouteRequest || "") {
  const render = primarySiteIconRenderDescriptor(site, iconSource);
  if (render.pendingLocalSvgAnalysis) {
    paintPendingLocalSvgIcon(icon, site, render.localIconSource, requestToken);
    return undefined;
  }
  applySiteIconTile(icon, site, render.tileIconSource);
  hydrateLocalSiteIconBrandColor(icon, site, render.tileIconSource);
  if (render.localIconSource) {
    delete icon.dataset.remoteBrandIconRequest;
  }
  const displayIcon = displayIconSource(icon, render.iconSource, options);
  const setIconSource = (source) => {
    if (!iconRouteRequestStillCurrent(icon, render.siteKey, requestToken)) {
      return;
    }
    icon.dataset.iconSource = render.iconSource;
    icon.dataset.iconCandidate = render.iconSource;
    delete icon.dataset.iconDefaultRescue;
    delete icon.dataset.iconDefaultProbe;
    icon.classList.remove("site-icon-generic-fallback");
    if (render.canUseBitmapTileFusion) {
      icon.addEventListener("load", () => {
        if (iconStillRenderingCandidate(icon, render.iconSource)) {
          applyFaviconMatchedTile(icon);
        }
      }, { once: true });
    }
    icon.src = source;
    icon.removeAttribute("srcset");
    bindFaviconFallback(icon, site);
    if (render.shouldRefreshRemoteBrand) {
      refreshRemoteBrandIcon(icon, site);
    }
  };
  if (displayIcon instanceof Promise) {
    return displayIcon.then((source) => setIconSource(source));
  }
  setIconSource(displayIcon);
  return undefined;
}

function primarySiteIconRenderDescriptor(site, iconSource) {
  const localIcon = localIconForUrl(site.url);
  const source = String(iconSource || "");
  const localIconSource = localIcon || (source.startsWith(`${SITE_ICON_DIRECTORY}/`) ? source : "");
  const siteIconIsRemoteBrand = Boolean(remoteBrandSvgDescriptorFromSource(source));
  const tileIconSource = localIconSource || (siteIconIsRemoteBrand ? source : "");
  const siteKey = siteGroupKey(safeUrl(site.url)) || "";
  const pendingLocalSvgAnalysis = Boolean(localIconSource
    && siteIconSourceLooksLikeSvg(localIconSource)
    && !syncLocalIconTile(site, localIconSource)
    && !localSiteIconRenderModeCache.has(localIconSource));
  const shouldRefreshRemoteBrand = Boolean(localIconSource
    && localSiteIconRenderMode(localIconSource)
    && localIconNeedsRemoteBrandColor(siteKey, localIconSource));
  return {
    iconSource: source,
    localIconSource,
    tileIconSource,
    siteKey,
    pendingLocalSvgAnalysis,
    shouldRefreshRemoteBrand,
    canUseBitmapTileFusion: iconSourceCanUseBitmapTileFusion(source)
  };
}
// PRIMARY_SITE_ICON_ROUTE:END

function explicitAiIconUrl(engine) {
  const value = String(engine?.iconUrl || "").trim();
  return (engine?.id === "doubao" || engine?.id === "qwen") && value.startsWith(`${SITE_ICON_DIRECTORY}/`) ? value : "";
}

function applyExplicitSiteIcon(icon, site, iconSource) {
  storeIconSiteContext(icon, site);
  applySiteIconTile(icon, site, iconSource);
  hydrateLocalSiteIconBrandColor(icon, site, iconSource);
  icon.dataset.iconSource = iconSource;
  icon.dataset.iconCandidate = iconSource;
  icon.dataset.explicitAiIcon = "true";
  delete icon.dataset.iconDefaultRescue;
  delete icon.dataset.iconDefaultProbe;
  icon.classList.remove("site-icon-generic-fallback");
  icon.src = iconSource;
  icon.removeAttribute("srcset");
}

function refreshRemoteBrandIcon(icon, site) {
  const parsedUrl = safeUrl(site.url);
  const siteKey = siteGroupKey(parsedUrl);
  const localIcon = localIconForUrl(site.url);
  if (!siteIconIndexLoaded || !parsedUrl || !siteKey || (localIcon && !localIconNeedsRemoteBrandColor(siteKey, localIcon))) {
    return;
  }
  const requestToken = `${siteKey}:${parsedUrl.href}`;
  icon.dataset.remoteBrandIconRequest = requestToken;
  discoverRemoteBrandIconDataUrl(parsedUrl.href).then((iconDataUrl) => {
    if (
      !iconDataUrl
      || !icon.isConnected
      || icon.dataset.remoteBrandIconRequest !== requestToken
      || siteGroupKey(safeUrl(icon.dataset.siteUrl)) !== siteKey
    ) {
      return;
    }
    const activeLocalIcon = localIconForUrl(site.url);
    if (activeLocalIcon && localIconNeedsRemoteBrandColor(siteKey, activeLocalIcon)) {
      applyRemoteBrandColorToLocalIcon(icon, site, activeLocalIcon, iconDataUrl);
      return;
    }
    applyRemoteBrandIcon(icon, site, iconDataUrl);
  }).catch(() => {});
}

function applyRemoteBrandColorToLocalIcon(icon, site, localIcon, iconDataUrl) {
  const descriptor = remoteBrandSvgDescriptorFromSource(iconDataUrl);
  if (!descriptor?.brandColor) {
    return;
  }
  localSiteIconBrandColorCache.set(localIcon, descriptor.brandColor);
  localSiteIconRenderModeCache.set(localIcon, localSiteIconRenderMode(localIcon) || "mask");
  localSiteIconExplicitBrandColorCache.set(localIcon, true);
  localSiteIconVisibleColorsCache.set(localIcon, descriptor.visibleColors || []);
  localSiteIconEmbeddedCarrierColorCache.set(localIcon, localSiteIconEmbeddedCarrierColor(localIcon));
  applySiteIconTile(icon, site, localIcon);
  const displayIcon = displayIconSource(icon, localIcon);
  if (displayIcon instanceof Promise) {
    displayIcon.then((source) => {
      if (iconStillRenderingCandidate(icon, localIcon)) {
        icon.src = source;
      }
    });
    return;
  }
  icon.src = displayIcon;
}

function applyRemoteBrandIcon(icon, site, iconDataUrl) {
  if (icon.dataset.iconRouteState !== "primary_hit") {
    beginIconRouteRequest(icon, "primary_hit");
  }
  icon.removeAttribute("srcset");
  storeIconSiteContext(icon, site);
  icon.dataset.iconMissing = "false";
  icon.dataset.iconCandidate = iconDataUrl;
  icon.dataset.iconSource = iconDataUrl;
  delete icon.dataset.iconDefaultRescue;
  delete icon.dataset.iconDefaultRescueCandidate;
  delete icon.dataset.iconDefaultProbe;
  icon.classList.remove("site-icon-generic-fallback");
  applySiteIconTile(icon, site, iconDataUrl);
  const displayIcon = displayIconSource(icon, iconDataUrl);
  if (displayIcon instanceof Promise) {
    icon.src = iconDataUrl;
    displayIcon.then((source) => {
      if (iconStillRenderingCandidate(icon, iconDataUrl)) {
        icon.src = source;
      }
    });
    return;
  }
  icon.src = displayIcon;
}

function localIconForUrl(url) {
  const parsedUrl = safeUrl(url);
  const siteKey = siteGroupKey(parsedUrl);
  const iconPath = siteIconPathForSiteKey(siteKey);
  return siteIconSourceLooksLikeSvg(iconPath) ? iconPath : "";
}

function localFaviconForUrl(url) {
  const parsedUrl = safeUrl(url);
  const siteKey = siteGroupKey(parsedUrl);
  const iconPath = siteIconPathForSiteKey(siteKey);
  return iconPath && !siteIconSourceLooksLikeSvg(iconPath) ? iconPath : "";
}

function localIconNeedsRemoteBrandColor(siteKey, iconPath = "") {
  return Boolean(siteKey
    && iconPath
    && siteIconSourceLooksLikeSvg(iconPath)
    && !keepsBrandIconOriginal(siteKey, iconPath)
    && !embeddedSvgBrandColor(iconPath)
    && !localSiteIconHasExplicitBrandColor(iconPath));
}

function siteIconPathForSiteKey(siteKey) {
  if (!siteKey) {
    return "";
  }
  const fileName = siteIconFileNameForSiteKey(siteKey);
  if (!availableSiteIconFiles.has(fileName)) {
    return "";
  }
  return siteIconPathFromFileName(fileName);
}

function applyHistoryIcon(icon, site) {
  applySiteIcon(icon, site);
}

// FALLBACK_SITE_ICON_ROUTE:START
function applyGeneratedSiteIcon(icon, site = {}) {
  const parsedUrl = safeUrl(site.url);
  const seed = parsedUrl?.hostname || site.url || site.title || "";
  storeIconSiteContext(icon, site);
  applyGenericFallbackSiteIcon(icon, seed);
}

function applyGenericFallbackSiteIcon(icon, seed = "") {
  icon.removeAttribute("srcset");
  icon.dataset.iconMissing = "false";
  icon.dataset.iconCandidate = GENERIC_SITE_FALLBACK_ICON;
  icon.dataset.iconSource = GENERIC_SITE_FALLBACK_ICON;
  delete icon.dataset.iconDefaultRescue;
  delete icon.dataset.iconDefaultRescueCandidate;
  delete icon.dataset.iconDefaultProbe;
  icon.classList.remove("site-icon-loading");
  icon.classList.add("site-icon-generic-fallback");
  const tileColors = genericSiteFallbackTileColors();
  applyIconTile(icon, "generated", tileColors, false);
  icon.src = GENERIC_SITE_FALLBACK_ICON;
}

function genericSiteFallbackTileColors() {
  return {
    light: GENERIC_SITE_FALLBACK_TILE_COLOR,
    dark: GENERIC_SITE_FALLBACK_TILE_COLOR
  };
}
// FALLBACK_SITE_ICON_ROUTE:END
async function initSiteIconIndex() {
  siteIconIndexLoaded = false;
  siteIconIndexState = "pending";
  try {
    const response = await fetch(`${SITE_ICON_DIRECTORY}/index.json`);
    if (!response.ok) {
      throw new Error(`Site icon index request failed: ${response.status}`);
    }
    const files = await response.json();
    availableSiteIconFiles = new Set(Array.isArray(files)
      ? files.filter((file) => typeof file === "string")
      : []);
    siteIconIndexState = "ready";
  } catch (error) {
    console.warn("Failed to load site icon index", error);
    availableSiteIconFiles = new Set();
    siteIconIndexState = "failed";
  } finally {
    siteIconIndexLoaded = true;
    resolveSiteIconIndexReady(siteIconIndexState);
  }
}

function refreshAdaptiveSiteIcons() {
  const requestTheme = document.documentElement.dataset.theme;
  document.querySelectorAll('img[data-icon-tile="brand"][data-site-url]').forEach((icon) => {
    const source = icon.dataset.iconSource || "";
    if (!source) {
      const site = {
        title: icon.dataset.siteTitle || icon.alt || "",
        url: icon.dataset.siteUrl || ""
      };
      applySiteIcon(icon, site);
      return;
    }
    const requestToken = String(Number(icon.dataset.iconThemeRequest || 0) + 1);
    icon.dataset.iconThemeRequest = requestToken;
    Promise.resolve(displayIconSource(icon, source, { awaitDisplayIcon: true })).then((nextSource) => {
      if (
        icon.isConnected
        && icon.dataset.iconSource === source
        && icon.dataset.iconThemeRequest === requestToken
        && document.documentElement.dataset.theme === requestTheme
      ) {
        icon.src = nextSource;
      }
    });
  });
}

function refreshRenderedSiteIcons() {
  document.querySelectorAll("img[data-site-url]").forEach((icon) => {
    const site = {
      title: icon.dataset.siteTitle || icon.alt || "",
      url: icon.dataset.siteUrl || ""
    };
    const localIcon = localIconForUrl(site.url);
    if (localIcon && siteIconRawSvgStalePaths.has(localIcon)) {
      scheduleIconIdleTask(() => revalidateDisplayedLocalSiteIcon(localIcon));
    }
    if (icon.dataset.iconCacheHydrated === "true") {
      if (!localIcon) {
        if (!remoteBrandSvgDescriptorFromSource(icon.dataset.iconSource || icon.currentSrc || icon.src || "")) {
          refreshRemoteBrandIcon(icon, site);
        }
        return;
      }
      const siteKey = icon.dataset.siteKey || siteGroupKey(safeUrl(site.url));
      icon.dataset.iconSource = localIcon;
      icon.dataset.iconCandidate = localIcon;
      // Fast path: recompute the full render (tile + glyph) synchronously from cached raw
      // SVG text and apply it atomically. Skip entirely when nothing changed (steady state).
      const syncTile = syncLocalIconTile(site, localIcon);
      if (syncTile) {
        const currentLight = icon.style.getPropertyValue("--site-icon-tile-light").trim();
        const currentDark = icon.style.getPropertyValue("--site-icon-tile-dark").trim();
        const tileUnchanged = icon.dataset.iconTile === syncTile.tileMode
          && currentLight === String(syncTile.tileColors.light)
          && currentDark === String(syncTile.tileColors.dark);
        if (!tileUnchanged) {
          icon.dataset.siteKey = syncTile.siteKey;
          applyIconTile(icon, syncTile.tileMode, syncTile.tileColors, syncTile.isLocalIconSource);
        }
        const nextSource = syncLocalIconFinalSrc(icon, localIcon);
        if (nextSource !== null) {
          if (tileUnchanged && icon.getAttribute("src") === nextSource) {
            return;
          }
          icon.src = nextSource;
          delete icon.dataset.iconCacheHydrated;
          cacheRenderedSiteIcon(icon, site);
          if (localIconNeedsRemoteBrandColor(siteKey, localIcon)) {
            refreshRemoteBrandIcon(icon, site);
          }
          return;
        }
      }
      // Fallback (raw text not cached yet): async render, which also warms the raw-text
      // cache so the next refresh is synchronous.
      loadLocalSiteIconBrandColor(localIcon).then(() => {
        if (
          !icon.isConnected
          || icon.dataset.iconSource !== localIcon
          || siteGroupKey(safeUrl(icon.dataset.siteUrl)) !== siteKey
        ) {
          return;
        }
        applySiteIconTile(icon, site, localIcon);
        const nextSource = displayIconSource(icon, localIcon, { awaitDisplayIcon: true });
        Promise.resolve(nextSource).then((source) => {
          if (!icon.isConnected || icon.dataset.iconSource !== localIcon) {
            return;
          }
          icon.src = source;
          delete icon.dataset.iconCacheHydrated;
          cacheRenderedSiteIcon(icon, site);
          if (localIconNeedsRemoteBrandColor(siteKey, localIcon)) {
            refreshRemoteBrandIcon(icon, site);
          }
        });
      });
      return;
    }
    if (localIcon) {
      delete icon.dataset.iconCacheHydrated;
    }
    applySiteIcon(icon, site);
  });
}

async function discoverFavoriteSiteIcon(url) {
  const parsedUrl = safeUrl(url);
  const localIcon = localIconForUrl(url);
  if (!siteIconIndexLoaded || !siteGroupKey(parsedUrl) || (localIcon && !localIconNeedsRemoteBrandColor(siteGroupKey(parsedUrl), localIcon))) {
    return "";
  }
  return discoverSiteIconDataUrl(url);
}

async function loadCachedSiteIcon(siteKey) {
  try {
    const entry = await loadCachedSiteIconEntry(siteKey);
    if (!siteIconCacheEntryIsFresh(entry)) {
      return "";
    }
    return normalizeStoredSiteIcon(entry.icon);
  } catch {
    return "";
  }
}

async function loadCachedSiteIconEntry(siteKey) {
  if (!siteKey) {
    return null;
  }
  const cache = await loadSiteIconCache();
  const entry = cache[siteKey];
  return entry && typeof entry === "object" && !Array.isArray(entry) ? entry : null;
}

function siteIconCacheEntryIsFresh(entry, ttl = SITE_ICON_CACHE_TTL_MS) {
  if (!entry || Date.now() - Number(entry.updatedAt || 0) > ttl) {
    return false;
  }
  // 已准备好嘅 remote-brand SVG data-url 把渲染管线决策（render-mode / brand-color 等）
  // 焗死喺 data-wayleaf-* 属性度。一旦图标渲染代码改变，必须连同第一帧缓存一齐失效，
  // 否则会一直返焗死咗旧逻辑嘅 data-url。非 svg（favicon 等）只受 TTL 约束。
  if (isSvgDataUrl(entry.icon)) {
    return entry.codeSignature === iconRenderCodeSignature();
  }
  return true;
}

async function cacheSiteIcon(siteKey, icon, metadata = {}) {
  const normalizedIcon = normalizeStoredSiteIcon(icon);
  if (!siteKey || !normalizedIcon) {
    return;
  }
  const tileColor = embeddedSvgBrandColor(normalizedIcon) || "";
  const strategy = remoteBrandSvgCacheStrategy(normalizedIcon);
  const cache = await loadSiteIconCache();
  cache[siteKey] = {
    icon: normalizedIcon,
    tileColor,
    source: metadata.source || (tileColor ? "remote-brand" : "site-icon"),
    ...(strategy ? { strategy } : {}),
    ...(isSvgDataUrl(normalizedIcon) ? { codeSignature: iconRenderCodeSignature() } : {}),
    missing: false,
    updatedAt: Date.now()
  };
  await saveSiteIconCache(cache);
}

async function cacheRemoteBrandIconMiss(siteKey) {
  if (!siteKey) {
    return;
  }
  const cache = await loadSiteIconCache();
  cache[siteKey] = {
    icon: "",
    missing: true,
    source: "remote-brand",
    providerVersion: REMOTE_BRAND_ICON_PROVIDER_VERSION,
    updatedAt: Date.now()
  };
  await saveSiteIconCache(cache);
}

async function saveSiteIconCache(cache) {
  const entries = Object.entries(cache)
    .filter(([, entry]) => normalizeStoredSiteIcon(entry?.icon) || entry?.missing)
    .sort(([, a], [, b]) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0))
    .slice(0, MAX_CACHED_SITE_ICONS);
  await setStoredValues({ [SITE_ICON_CACHE_STORAGE_KEY]: Object.fromEntries(entries) });
}

async function loadSiteIconCache() {
  const result = await getStoredValues({ [SITE_ICON_CACHE_STORAGE_KEY]: {} });
  const cache = result[SITE_ICON_CACHE_STORAGE_KEY];
  return cache && typeof cache === "object" && !Array.isArray(cache) ? cache : {};
}

async function discoverSiteIconDataUrl(url, options = {}) {
  const parsedUrl = safeUrl(url);
  if (!parsedUrl) {
    return "";
  }
  const siteKey = siteGroupKey(parsedUrl);
  if (siteKey && !options.skipStoredCache) {
    const cachedIcon = await loadCachedSiteIcon(siteKey);
    if (cachedIcon) {
      return cachedIcon;
    }
  }
  const cacheKey = siteIconDiscoveryCacheKey(parsedUrl);
  if (siteIconDiscoveryCache.has(cacheKey)) {
    return siteIconDiscoveryCache.get(cacheKey);
  }
  const request = fetchBestSiteIconDataUrl(parsedUrl)
    .then((iconDataUrl) => {
      if (iconDataUrl && siteKey) {
        cacheSiteIcon(siteKey, iconDataUrl).catch(() => {});
      }
      return iconDataUrl;
    })
    .catch(() => "");
  rememberSiteIconDiscoveryRequest(cacheKey, request);
  return request;
}

function siteIconDiscoveryCacheKey(parsedUrl) {
  return `${parsedUrl.protocol}//${parsedUrl.hostname}`.toLowerCase();
}

function rememberSiteIconDiscoveryRequest(cacheKey, request) {
  siteIconDiscoveryCache.set(cacheKey, request);
  if (siteIconDiscoveryCache.size <= SITE_ICON_DISCOVERY_MEMORY_CACHE_LIMIT) {
    return;
  }
  const oldestKey = siteIconDiscoveryCache.keys().next().value;
  if (oldestKey) {
    siteIconDiscoveryCache.delete(oldestKey);
  }
}

async function fetchBestSiteIconDataUrl(parsedUrl) {
  const remoteBrandIcon = await discoverRemoteBrandIconDataUrl(parsedUrl.href);
  if (remoteBrandIcon) {
    return remoteBrandIcon;
  }
  const candidates = await discoverSiteIconCandidates(parsedUrl);
  for (const candidate of candidates.slice(0, SITE_ICON_DISCOVERY_CANDIDATE_LIMIT)) {
    try {
      const iconDataUrl = await fetchImageDataUrl(candidate.url);
      if (iconDataUrl) {
        return iconDataUrl;
      }
    } catch {
      // Try the next declared icon when one candidate is missing or blocked.
    }
  }
  return "";
}

async function discoverRemoteBrandIconDataUrl(url, options = {}) {
  const parsedUrl = safeUrl(url);
  const siteKey = siteGroupKey(parsedUrl);
  const localIcon = localIconForUrl(parsedUrl.href);
  if (!siteIconIndexLoaded || !siteKey || (localIcon && !localIconNeedsRemoteBrandColor(siteKey, localIcon))) {
    return "";
  }
  const cachedEntry = await loadCachedSiteIconEntry(siteKey);
  if (siteIconCacheEntryIsFresh(cachedEntry)) {
    const cachedIcon = normalizeStoredSiteIcon(cachedEntry.icon);
    if (cachedIcon && cachedSiteIconEntryIsRemoteBrand(cachedEntry)) {
      return cachedIcon;
    }
  }
  if (remoteBrandIconMissCacheIsFresh(cachedEntry)) {
    return "";
  }
  const cacheKey = `remote-brand:${siteKey}`;
  if (siteIconDiscoveryCache.has(cacheKey)) {
    const cachedRequest = siteIconDiscoveryCache.get(cacheKey);
    return options.requireStableMiss ? cachedRequest : cachedRequest.catch(() => "");
  }
  const request = fetchRemoteBrandIconDataUrl(parsedUrl)
    .then((iconDataUrl) => {
      if (iconDataUrl) {
        cacheSiteIcon(siteKey, iconDataUrl, { source: "remote-brand" }).catch(() => {});
      } else {
        cacheRemoteBrandIconMiss(siteKey).catch(() => {});
      }
      return iconDataUrl;
    })
    .catch((error) => {
      if (siteIconDiscoveryCache.get(cacheKey) === request) {
        siteIconDiscoveryCache.delete(cacheKey);
      }
      throw error;
    });
  rememberSiteIconDiscoveryRequest(cacheKey, request);
  return options.requireStableMiss ? request : request.catch(() => "");
}

function cachedSiteIconEntryIsRemoteBrand(entry) {
  return entry?.source === "remote-brand" || Boolean(embeddedSvgBrandColor(entry?.icon || ""));
}

function remoteBrandIconMissCacheIsFresh(entry) {
  return Boolean(entry?.missing
    && entry?.source === "remote-brand"
    && entry?.providerVersion === REMOTE_BRAND_ICON_PROVIDER_VERSION
    && siteIconCacheEntryIsFresh(entry, REMOTE_BRAND_ICON_MISSING_TTL_MS));
}

function remoteBrandSvgCacheStrategy(icon) {
  const descriptor = remoteBrandSvgDescriptorFromSource(icon);
  if (!descriptor) {
    return null;
  }
  return {
    kind: "remote-brand-svg",
    brandColor: descriptor.brandColor,
    renderMode: descriptor.renderMode,
    isMonochrome: descriptor.isMonochrome,
    visibleColors: descriptor.visibleColors || [],
    embeddedCarrierColor: descriptor.embeddedCarrierColor || "",
    qualityScore: descriptor.qualityScore
  };
}

async function fetchRemoteBrandIconDataUrl(parsedUrl) {
  const candidates = remoteBrandIconSlugCandidates(parsedUrl);
  const siteKey = siteGroupKey(parsedUrl);
  let transientFailure = false;
  for (const candidate of candidates) {
    for (const provider of REMOTE_BRAND_ICON_PROVIDERS) {
      const canFetchDirectly = candidate.score >= REMOTE_BRAND_ICON_DIRECT_FETCH_SCORE_MIN;
      if (canFetchDirectly) {
        try {
          const directIconDataUrl = await fetchRemoteBrandSvgDataUrl(provider.urlForSlug(candidate.slug), {
            candidate,
            providerId: provider.id,
            siteKey,
            allowSiteKeyColorFallback: !localIconForUrl(parsedUrl.href)
          });
          if (directIconDataUrl) {
            return directIconDataUrl;
          }
        } catch (error) {
          transientFailure ||= remoteBrandLookupErrorIsTransient(error);
          // Fall through to an indexed alias or the next provider.
        }
      }
      try {
        const providerSlug = await remoteBrandProviderSlugForCandidate(provider, candidate.slug);
        if (!providerSlug || (canFetchDirectly && providerSlug === candidate.slug)) {
          continue;
        }
        const iconDataUrl = await fetchRemoteBrandSvgDataUrl(provider.urlForSlug(providerSlug), {
          candidate,
          providerId: provider.id,
          siteKey,
          allowSiteKeyColorFallback: !localIconForUrl(parsedUrl.href)
        });
        if (iconDataUrl) {
          return iconDataUrl;
        }
      } catch (error) {
        transientFailure ||= remoteBrandLookupErrorIsTransient(error);
        // Try the next remote brand source or slug.
      }
    }
  }
  if (transientFailure) {
    throw new Error("Remote brand lookup was temporarily unavailable.");
  }
  return "";
}

function remoteBrandLookupErrorIsTransient(error) {
  const status = Number(String(error?.message || "").match(/request failed:\s*(\d{3})/i)?.[1] || 0);
  return !status || status === 408 || status === 425 || status === 429 || status >= 500;
}

async function remoteBrandProviderHasSlug(provider, slug) {
  return Boolean(await remoteBrandProviderSlugForCandidate(provider, slug));
}

async function remoteBrandProviderSlugForCandidate(provider, slug) {
  const normalizedSlug = remoteBrandIconSlug(slug);
  if (!normalizedSlug) {
    return "";
  }
  if (!provider.index) {
    return normalizedSlug;
  }
  const slugs = await remoteBrandProviderSlugs(provider);
  return slugs instanceof Map
    ? slugs.get(normalizedSlug) || ""
    : slugs.has(normalizedSlug) ? normalizedSlug : "";
}

async function remoteBrandProviderSlugs(provider) {
  const cachedEntry = remoteBrandIconIndexCache.get(provider.index);
  if (cachedEntry?.request) {
    return cachedEntry.request;
  }
  if (cachedEntry && Date.now() - cachedEntry.updatedAt < REMOTE_BRAND_ICON_INDEX_TTL_MS) {
    return cachedEntry.slugs;
  }
  const request = remoteBrandProviderSlugRequest(provider);
  remoteBrandIconIndexCache.set(provider.index, { request });
  let slugs;
  try {
    slugs = await request;
  } catch (error) {
    remoteBrandIconIndexCache.delete(provider.index);
    throw error;
  }
  remoteBrandIconIndexCache.set(provider.index, {
    slugs,
    updatedAt: Date.now()
  });
  return slugs;
}

async function remoteBrandProviderSlugRequest(provider) {
  if (provider.index === "lobehub-static-svg") {
    return fetchLobeHubStaticSvgSlugs(provider.packageName);
  }
  if (provider.index === "thesvg") {
    return fetchTheSvgSlugs();
  }
  return new Set();
}

async function fetchLobeHubStaticSvgSlugs(packageName) {
  const version = await fetchNpmPackageLatestVersion(packageName);
  if (!version) {
    return new Set();
  }
  const encodedPackageName = encodeURIComponent(packageName);
  const response = await fetchJsonWithTimeout(`https://data.jsdelivr.com/v1/package/npm/${encodedPackageName}@${encodeURIComponent(version)}/flat`);
  return remoteBrandSlugsFromFileList(response?.files, /^\/icons\/(.+)\.svg$/i);
}

async function fetchNpmPackageLatestVersion(packageName) {
  const encodedPackageName = encodeURIComponent(packageName).replace(/^%40/i, "@");
  const response = await fetchJsonWithTimeout(`https://registry.npmjs.org/${encodedPackageName}/latest`);
  return typeof response?.version === "string" ? response.version : "";
}

async function fetchTheSvgSlugs() {
  const response = await fetchJsonWithTimeout("https://data.jsdelivr.com/v1/package/gh/glincker/thesvg@main/flat");
  return remoteBrandSlugMapFromFileList(response?.files, /^\/public\/icons\/(.+)\/default\.svg$/i);
}

function remoteBrandSlugsFromFileList(files, pattern) {
  const slugs = new Set();
  if (!Array.isArray(files)) {
    return slugs;
  }
  for (const file of files) {
    const name = String(file?.name || "");
    const match = name.match(pattern);
    if (match?.[1]) {
      slugs.add(remoteBrandIconSlug(match[1]));
    }
  }
  return slugs;
}

function remoteBrandSlugMapFromFileList(files, pattern) {
  const slugs = new Map();
  if (!Array.isArray(files)) {
    return slugs;
  }
  for (const file of files) {
    const name = String(file?.name || "");
    const match = name.match(pattern);
    if (match?.[1]) {
      const slug = remoteBrandIconSlug(match[1]);
      if (slug && !slugs.has(slug)) {
        slugs.set(slug, match[1]);
      }
    }
  }
  return slugs;
}

async function fetchJsonWithTimeout(url) {
  const response = await withTimeout(fetch(url, {
    cache: "force-cache",
    credentials: "omit",
    redirect: "follow"
  }), SITE_ICON_FETCH_TIMEOUT_MS, "Remote brand index request timed out.");
  if (!response.ok) {
    throw new Error(`Remote brand index request failed: ${response.status}`);
  }
  return response.json();
}

async function fetchRemoteBrandSvgDataUrl(url, options = {}) {
  const siteKey = options.siteKey || "";
  const response = await withTimeout(fetch(url, {
    cache: "force-cache",
    credentials: "omit",
    redirect: "follow"
  }), SITE_ICON_FETCH_TIMEOUT_MS, "Remote brand icon request timed out.");
  if (!response.ok) {
    throw new Error(`Remote brand icon request failed: ${response.status}`);
  }
  const contentType = response.headers.get("content-type") || "";
  if (!remoteBrandSvgResponseMayContainSvg(contentType, response.url || url)) {
    return "";
  }
  const svg = await response.text();
  const quality = remoteBrandSvgQuality(svg, options);
  if (!quality.accepted) {
    return "";
  }
  const brandColor = remoteBrandSvgBrandColor(svg, options);
  return svgTextDataUrl(prepareRemoteBrandSvg(svg, {
    brandColor,
    qualityScore: quality.score,
    siteKey
  }));
}

function remoteBrandSvgQuality(svg, options = {}) {
  const text = String(svg || "").trim();
  const candidateScore = Number(options.candidate?.score || 0);
  if (!remoteBrandSvgLooksUsable(svg) || candidateScore < 50) {
    return { accepted: false, score: 0 };
  }
  if (/<(?:foreignObject|iframe|object|embed|image)\b/i.test(text)
    || /\son[a-z]+\s*=/i.test(text)
    || /\s(?:href|xlink:href)\s*=\s*(["'])https?:\/\//i.test(text)) {
    return { accepted: false, score: 0 };
  }
  const geometry = remoteBrandSvgGeometry(text);
  if (!geometry.valid) {
    return { accepted: false, score: 0 };
  }
  const shapeCount = remoteBrandSvgShapeCount(text);
  if (shapeCount <= 0 || shapeCount > 220) {
    return { accepted: false, score: 0 };
  }
  let score = 100;
  if (candidateScore < 70) {
    score -= 20;
  }
  if (shapeCount > 80) {
    score -= 18;
  }
  if (geometry.aspectRatio > 10 || geometry.aspectRatio < 0.1) {
    score -= 25;
  }
  if (remoteBrandSvgHasComplexPaint(text)) {
    score -= 8;
  }
  return {
    accepted: score >= 60,
    score
  };
}

function remoteBrandSvgResponseMayContainSvg(contentType, url = "") {
  const mime = normalizeSiteIconMime(contentType);
  if (mime === "image/svg+xml") {
    return true;
  }
  if (mime && !/^(?:application\/octet-stream|text\/plain)$/i.test(mime)) {
    return false;
  }
  return /\.svg(?:[?#].*)?$/i.test(String(url || ""));
}

function remoteBrandSvgLooksUsable(svg) {
  const text = String(svg || "").trim();
  return text.length > 0
    && text.length <= MAX_CACHED_SITE_ICON_BYTES
    && remoteBrandSvgHasRootElement(text)
    && !/<script\b/i.test(text);
}

function remoteBrandSvgHasRootElement(svg) {
  return /^(?:\s*<\?xml[^>]*>\s*)?(?:\s*<!doctype[^>]*>\s*)?(?:\s*<!--[\s\S]*?-->\s*)*<svg\b/i.test(String(svg || ""));
}

function remoteBrandSvgGeometry(svg) {
  const viewBoxMatch = String(svg || "").match(/\sviewBox=(["'])\s*([-+.\deE]+)[,\s]+([-+.\deE]+)[,\s]+([-+.\deE]+)[,\s]+([-+.\deE]+)\s*\1/i);
  if (viewBoxMatch) {
    const width = Number(viewBoxMatch[4]);
    const height = Number(viewBoxMatch[5]);
    return remoteBrandSvgGeometryResult(width, height);
  }
  const width = remoteBrandSvgLengthAttribute(svg, "width");
  const height = remoteBrandSvgLengthAttribute(svg, "height");
  return remoteBrandSvgGeometryResult(width, height);
}

function remoteBrandSvgLengthAttribute(svg, name) {
  const match = String(svg || "").match(new RegExp(`\\s${name}=(["'])\\s*([0-9.]+)(?:px)?\\s*\\1`, "i"));
  return match ? Number(match[2]) : 0;
}

function remoteBrandSvgGeometryResult(width, height) {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return { valid: false, aspectRatio: 1 };
  }
  const aspectRatio = width / height;
  return {
    valid: aspectRatio >= 0.05 && aspectRatio <= 20,
    aspectRatio
  };
}

function remoteBrandSvgShapeCount(svg) {
  return (String(svg || "").match(/<(?:path|circle|rect|polygon|polyline|line|ellipse)\b/gi) || []).length;
}

function prepareRemoteBrandSvg(svg, options = {}) {
  const descriptor = remoteBrandSvgDescriptor(svg, options);
  const color = descriptor.brandColor;
  const isMonochrome = descriptor.isMonochrome;
  const visibleColorAttr = svgPaletteDataAttribute(descriptor.visibleColors);
  const embeddedCarrierAttr = descriptor.embeddedCarrierColor || "";
  let output = String(svg || "").trim();
  output = output.replace(/<\?xml[^>]*>\s*/i, "");
  output = output.replace(/<!doctype[^>]*>\s*/i, "");
  if (color && isMonochrome) {
    output = applySvgGlyphColor(output, color, { onlyCurrentColor: true });
  }
  output = output.replace(/<svg\b([^>]*)>/i, (match, attrs) => {
    const cleanedAttrs = attrs
      .replace(/\sdata-wayleaf-brand-color=(["'])[^"']*\1/gi, "")
      .replace(/\sdata-wayleaf-monochrome=(["'])[^"']*\1/gi, "")
      .replace(/\sdata-wayleaf-remote-brand=(["'])[^"']*\1/gi, "")
      .replace(/\sdata-wayleaf-render-mode=(["'])[^"']*\1/gi, "")
      .replace(/\sdata-wayleaf-tile-light=(["'])[^"']*\1/gi, "")
      .replace(/\sdata-wayleaf-tile-dark=(["'])[^"']*\1/gi, "")
      .replace(/\sdata-wayleaf-glyph-light=(["'])[^"']*\1/gi, "")
      .replace(/\sdata-wayleaf-glyph-dark=(["'])[^"']*\1/gi, "")
      .replace(/\sdata-wayleaf-visible-colors=(["'])[^"']*\1/gi, "")
      .replace(/\sdata-wayleaf-embedded-carrier=(["'])[^"']*\1/gi, "")
      .replace(/\sdata-wayleaf-quality=(["'])[^"']*\1/gi, "");
    const brandAttr = color ? ` data-wayleaf-brand-color="${color}"` : "";
    const visibleColorsAttr = visibleColorAttr ? ` data-wayleaf-visible-colors="${visibleColorAttr}"` : "";
    const embeddedCarrierColorAttr = embeddedCarrierAttr ? ` data-wayleaf-embedded-carrier="${embeddedCarrierAttr}"` : "";
    const metadataAttrs = [
      `data-wayleaf-remote-brand="true"`,
      `data-wayleaf-monochrome="${isMonochrome ? "true" : "false"}"`,
      `data-wayleaf-render-mode="${descriptor.renderMode}"`,
      `data-wayleaf-quality="${descriptor.qualityScore}"`
    ];
    return `<svg${cleanedAttrs} ${metadataAttrs.join(" ")}${brandAttr}${visibleColorsAttr}${embeddedCarrierColorAttr}>`;
  });
  return output;
}

function remoteBrandSvgDescriptor(svg, options = {}) {
  const brandColor = normalizeHexColor(options.brandColor || "") || "";
  const analysis = svgPaintAnalysis(svg);
  const isMonochrome = !analysis.usesPaintServer && analysis.visibleColors.length <= 1;
  const renderMode = remoteBrandSvgHasComplexPaintAnalysis(analysis)
    ? "gradient"
    : isMonochrome ? "mask" : "original";
  return {
    brandColor,
    isMonochrome,
    renderMode,
    visibleColors: analysis.colors,
    embeddedCarrierColor: svgEmbeddedCarrierColor(svg, analysis),
    qualityScore: Math.max(0, Math.min(100, Math.round(Number(options.qualityScore || 0))))
  };
}

function svgTextDataUrl(svg) {
  return `data:image/svg+xml,${encodeURIComponent(String(svg || ""))}`;
}

function remoteBrandSvgDescriptorFromSource(source) {
  if (!isSvgDataUrl(source)) {
    return null;
  }
  const svg = decodeSvgDataUrl(source);
  if (!/\sdata-wayleaf-remote-brand=(["'])true\1/i.test(svg)) {
    return null;
  }
  const attr = (name) => remoteBrandSvgDataAttribute(svg, name);
  return {
    brandColor: normalizeHexColor(attr("brand-color")),
    isMonochrome: attr("monochrome") === "true",
    renderMode: attr("render-mode") || "mask",
    visibleColors: svgPaletteDataAttributeColors(attr("visible-colors")),
    embeddedCarrierColor: normalizeHexColor(attr("embedded-carrier")),
    qualityScore: Number(attr("quality") || 0)
  };
}

function remoteBrandSvgDataAttribute(svg, name) {
  const match = String(svg || "").match(new RegExp(`\\sdata-wayleaf-${name}=(["'])([^"']*)\\1`, "i"));
  return match?.[2] || "";
}

function embeddedSvgBrandColor(value) {
  const svg = decodeSvgDataUrl(value) || String(value || "");
  const match = svg.match(/\sdata-wayleaf-brand-color=(["'])(#[0-9a-f]{6})\1/i);
  return normalizeHexColor(match?.[2] || "");
}

function remoteBrandSvgBrandColor(svg, options = {}) {
  const embeddedColor = embeddedSvgBrandColor(svg);
  if (embeddedColor) {
    return embeddedColor;
  }
  const palette = extractSvgColorPalette(svg);
  const localColor = options.allowSiteKeyColorFallback === false
    ? ""
    : normalizeHexColor(SITE_ICON_TILE_COLOR_BY_SITE_KEY[options.siteKey] || "");
  const expressiveColor = palette.find((color) => !remoteBrandColorLooksNeutral(color));
  // 单色 svg（含 currentColor→黑）直接读色生效，优先于白名单 VI 表。
  return expressiveColor || remoteBrandSvgMonochromeBrandColor(svg, palette) || localColor || "";
}

function remoteBrandColorLooksNeutral(color) {
  const normalized = normalizeHexColor(color);
  if (!normalized) {
    return true;
  }
  const [red, green, blue] = hexToRgb(normalized).map((channel) => channel / 255);
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const luminance = relativeLuminance(normalized);
  return max - min < 0.06 || luminance < 0.04 || luminance > 0.94;
}

function nearBlackBrandColor(color) {
  const normalized = normalizeHexColor(color);
  return Boolean(normalized && relativeLuminance(normalized) < 0.04);
}

function blackishCarrierColor(color) {
  const normalized = normalizeHexColor(color);
  if (!normalized) {
    return false;
  }
  const [red, green, blue] = hexToRgb(normalized).map((channel) => channel / 255);
  const chroma = Math.max(red, green, blue) - Math.min(red, green, blue);
  return relativeLuminance(normalized) < 0.045 && chroma < 0.12;
}

function remoteBrandSvgMonochromeBrandColor(svg, palette = extractSvgColorPalette(svg)) {
  if (!remoteBrandSvgIsMonochrome(svg)) {
    return "";
  }
  // 以「可见色」为准（已排除 clipPath/defs 等纯定义色），决定单色锚 —— 唔受裁剪/定义色污染。
  const visible = uniqueNormalizedHexColors(svgPaintAnalysis(svg).visibleColors);
  if (visible.length === 1) {
    // 无彩度（黑/白/灰）锚定近黑，行黑色方案；有彩度则用本色。
    return remoteBrandColorLooksNeutral(visible[0]) ? "#000000" : visible[0];
  }
  return remoteBrandSvgMonochromeDefaultsToBlack(svg) ? "#000000" : "";
}

function remoteBrandSvgIsMonochrome(svg) {
  const analysis = svgPaintAnalysis(svg);
  if (analysis.usesPaintServer) {
    return false;
  }
  return analysis.visibleColors.length <= 1;
}

function remoteBrandSvgUsesImplicitBlack(svg) {
  const text = String(svg || "");
  return remoteBrandSvgHasRootElement(text)
    && remoteBrandSvgShapeCount(text) > 0
    && !/\s(?:fill|stroke|color)\s*=/i.test(text)
    && !/(?:fill|stroke|color)\s*:/i.test(text);
}

// 单色 svg 但抽唔到具体色（无声明 = 隐式黑，或仅 currentColor/var() 未解析）。
// 呢类嘅有效渲染色就係 CSS 默认文字色黑，应锚定近黑行黑色方案。
function remoteBrandSvgMonochromeDefaultsToBlack(svg) {
  const text = String(svg || "");
  if (!remoteBrandSvgHasRootElement(text) || remoteBrandSvgShapeCount(text) <= 0) {
    return false;
  }
  const analysis = svgPaintAnalysis(text);
  if (analysis.usesPaintServer || analysis.visibleColors.length > 0) {
    return false;
  }
  return remoteBrandSvgUsesImplicitBlack(text)
    || /(?:fill|stroke|color)\s*[:=]\s*["']?\s*currentColor\b/i.test(text);
}

function remoteBrandSvgHasComplexPaint(svg) {
  return remoteBrandSvgHasComplexPaintAnalysis(svgPaintAnalysis(svg));
}

function remoteBrandSvgHasComplexPaintAnalysis(analysis) {
  return analysis.paintServerColors.length > 1
    || (analysis.paintServerColors.length > 0 && analysis.visibleColors.length > 1)
    || (analysis.hasEffectPaintServer && analysis.visibleColors.length > 1);
}

function remoteBrandSvgUsesPaintServer(svg) {
  return svgPaintAnalysis(svg).usesPaintServer;
}

function extractSvgColorPalette(svg) {
  return svgPaintAnalysis(svg).colors;
}

function extractSvgPaintServerColors(svg) {
  return svgPaintAnalysis(svg).paintServerColors;
}

function svgEmbeddedCarrierColor(svg, analysis = svgPaintAnalysis(svg)) {
  if (uniqueNormalizedHexColors(analysis.visibleColors).length <= 1) {
    return "";
  }
  const viewBox = svgViewBox(String(svg || ""));
  if (!viewBox) {
    return "";
  }
  const shape = String(svg || "").match(/<(path|rect)\b([^>]*)>/i);
  if (!shape) {
    return "";
  }
  const attrs = svgAttributeMap(shape[2]);
  const color = normalizeSvgHexColor(attrs.fill || svgInlineStyleProperty(attrs.style || "", "fill"));
  if (!color || color === "none") {
    return "";
  }
  const rounded = shape[1].toLowerCase() === "rect"
    ? svgRectCoversViewBoxWithEqualRadius(attrs, viewBox)
    : svgPathCoversViewBoxWithEqualRadius(attrs.d || "", viewBox);
  return rounded ? color : "";
}

function svgViewBox(svg) {
  const match = String(svg || "").match(/<svg\b[^>]*\sviewBox=(["'])([^"']+)\1/i);
  if (!match) {
    return null;
  }
  const values = match[2].trim().split(/[\s,]+/).map(Number);
  if (values.length !== 4 || values.some((value) => !Number.isFinite(value))) {
    return null;
  }
  return { x: values[0], y: values[1], width: values[2], height: values[3] };
}

function svgAttributeMap(attrs) {
  const map = {};
  for (const match of String(attrs || "").matchAll(/([:\w.-]+)\s*=\s*(["'])(.*?)\2/g)) {
    map[match[1].toLowerCase()] = match[3];
  }
  return map;
}

function svgRectCoversViewBoxWithEqualRadius(attrs, viewBox) {
  const x = Number(attrs.x || 0);
  const y = Number(attrs.y || 0);
  const width = Number(attrs.width || viewBox.width);
  const height = Number(attrs.height || viewBox.height);
  const rx = Number(attrs.rx || attrs.ry || 0);
  const ry = Number(attrs.ry || attrs.rx || 0);
  return Math.abs(x - viewBox.x) <= 0.01
    && Math.abs(y - viewBox.y) <= 0.01
    && Math.abs(width - viewBox.width) <= 0.01
    && Math.abs(height - viewBox.height) <= 0.01
    && rx > 0
    && Math.abs(rx - ry) <= 0.01;
}

function svgPathCoversViewBoxWithEqualRadius(d, viewBox) {
  const segments = svgPathSegments(d);
  if (!segments.length) {
    return false;
  }
  const points = segments.flatMap((segment) => segment.points);
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const roundedCornerRadii = svgPathEqualCornerRadii(segments, viewBox);
  return Math.abs(minX - viewBox.x) <= 0.01
    && Math.abs(minY - viewBox.y) <= 0.01
    && Math.abs(maxX - (viewBox.x + viewBox.width)) <= 0.01
    && Math.abs(maxY - (viewBox.y + viewBox.height)) <= 0.01
    && roundedCornerRadii.length === 4;
}

function svgPathSegments(d) {
  const tokens = [...String(d || "").matchAll(/[AaCcHhLlMmQqSsTtVvZz]|[-+]?(?:\d*\.\d+|\d+\.?)(?:e[-+]?\d+)?/gi)].map((match) => match[0]);
  const segments = [];
  let index = 0;
  let command = "";
  let point = { x: 0, y: 0 };
  let startPoint = { x: 0, y: 0 };
  let lastControl = null;
  const isCommand = (value) => /^[AaCcHhLlMmQqSsTtVvZz]$/.test(value || "");
  const hasNumbers = (count) => tokens.slice(index, index + count).length === count
    && tokens.slice(index, index + count).every((token) => !isCommand(token));
  const read = () => Number(tokens[index++]);
  const skipInvalidPathToken = () => {
    if (index < tokens.length && !isCommand(tokens[index])) {
      index += 1;
    } else {
      command = "";
    }
  };
  const makePoint = (x, y, relative) => ({
    x: relative ? point.x + x : x,
    y: relative ? point.y + y : y
  });
  const push = (type, end, extraPoints = [], extra = {}) => {
    segments.push({ type, start: point, end, points: [point, ...extraPoints, end], ...extra });
    point = end;
  };
  while (index < tokens.length) {
    if (isCommand(tokens[index])) {
      command = tokens[index++];
    }
    if (!command) {
      break;
    }
    const relative = command === command.toLowerCase();
    switch (command.toUpperCase()) {
      case "M": {
        if (!hasNumbers(2)) {
          return segments;
        }
        point = makePoint(read(), read(), relative);
        startPoint = point;
        command = relative ? "l" : "L";
        lastControl = null;
        break;
      }
      case "L":
        if (!hasNumbers(2)) {
          skipInvalidPathToken();
          break;
        }
        while (hasNumbers(2)) {
          push("L", makePoint(read(), read(), relative));
          lastControl = null;
        }
        break;
      case "H":
        if (!hasNumbers(1)) {
          skipInvalidPathToken();
          break;
        }
        while (hasNumbers(1)) {
          const x = relative ? point.x + read() : read();
          push("L", { x, y: point.y });
          lastControl = null;
        }
        break;
      case "V":
        if (!hasNumbers(1)) {
          skipInvalidPathToken();
          break;
        }
        while (hasNumbers(1)) {
          const y = relative ? point.y + read() : read();
          push("L", { x: point.x, y });
          lastControl = null;
        }
        break;
      case "C":
        if (!hasNumbers(6)) {
          skipInvalidPathToken();
          break;
        }
        while (hasNumbers(6)) {
          const control1 = makePoint(read(), read(), relative);
          const control2 = makePoint(read(), read(), relative);
          push("C", makePoint(read(), read(), relative), [control1, control2]);
          lastControl = control2;
        }
        break;
      case "S":
        if (!hasNumbers(4)) {
          skipInvalidPathToken();
          break;
        }
        while (hasNumbers(4)) {
          const control1 = lastControl ? { x: point.x * 2 - lastControl.x, y: point.y * 2 - lastControl.y } : point;
          const control2 = makePoint(read(), read(), relative);
          push("S", makePoint(read(), read(), relative), [control1, control2]);
          lastControl = control2;
        }
        break;
      case "Q":
        if (!hasNumbers(4)) {
          skipInvalidPathToken();
          break;
        }
        while (hasNumbers(4)) {
          const control = makePoint(read(), read(), relative);
          push("Q", makePoint(read(), read(), relative), [control]);
          lastControl = control;
        }
        break;
      case "T":
        if (!hasNumbers(2)) {
          skipInvalidPathToken();
          break;
        }
        while (hasNumbers(2)) {
          const control = lastControl ? { x: point.x * 2 - lastControl.x, y: point.y * 2 - lastControl.y } : point;
          push("T", makePoint(read(), read(), relative), [control]);
          lastControl = control;
        }
        break;
      case "A":
        if (!hasNumbers(7)) {
          skipInvalidPathToken();
          break;
        }
        while (hasNumbers(7)) {
          const rx = Math.abs(read());
          const ry = Math.abs(read());
          read();
          read();
          read();
          push("A", makePoint(read(), read(), relative), [], { radius: { x: rx, y: ry } });
          lastControl = null;
        }
        break;
      case "Z":
        push("Z", startPoint);
        lastControl = null;
        command = "";
        break;
      default:
        index += 1;
    }
  }
  return segments;
}

function svgPathEqualCornerRadii(segments, viewBox) {
  const tolerance = Math.max(0.01, Math.max(viewBox.width, viewBox.height) * 0.015);
  const cornerSpecs = [
    { key: "topLeft", x: viewBox.x, y: viewBox.y },
    { key: "topRight", x: viewBox.x + viewBox.width, y: viewBox.y },
    { key: "bottomRight", x: viewBox.x + viewBox.width, y: viewBox.y + viewBox.height },
    { key: "bottomLeft", x: viewBox.x, y: viewBox.y + viewBox.height }
  ];
  const radii = new Map();
  const onX = (point, x) => Math.abs(point.x - x) <= tolerance;
  const onY = (point, y) => Math.abs(point.y - y) <= tolerance;
  const acceptRadius = (corner, rx, ry, segment) => {
    const radiusTolerance = Math.max(tolerance, Math.max(rx, ry) * 0.08);
    if (rx <= tolerance || ry <= tolerance || Math.abs(rx - ry) > radiusTolerance) {
      return;
    }
    if (segment.type === "A" && Math.abs(segment.radius.x - segment.radius.y) > radiusTolerance) {
      return;
    }
    radii.set(corner.key, (rx + ry) / 2);
  };
  segments.filter((segment) => /[CQSTA]/.test(segment.type)).forEach((segment) => {
    cornerSpecs.forEach((corner) => {
      const points = [segment.start, segment.end];
      const horizontal = points.find((candidate) => onY(candidate, corner.y));
      const vertical = points.find((candidate) => onX(candidate, corner.x));
      if (!horizontal || !vertical || horizontal === vertical) {
        return;
      }
      acceptRadius(corner, Math.abs(horizontal.x - corner.x), Math.abs(vertical.y - corner.y), segment);
    });
  });
  if (radii.size !== 4) {
    return [];
  }
  const values = [...radii.values()];
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const radiusTolerance = Math.max(tolerance, average * 0.08);
  return Math.max(...values) - Math.min(...values) <= radiusTolerance ? values : [];
}

function svgPaletteDataAttribute(colors) {
  const palette = uniqueNormalizedHexColors(colors);
  return palette.length ? palette.join(",") : "";
}

function svgPaletteDataAttributeColors(value) {
  return uniqueNormalizedHexColors(String(value || "").split(","));
}

function uniqueNormalizedHexColors(colors) {
  const output = [];
  const seen = new Set();
  (Array.isArray(colors) ? colors : []).forEach((color) => {
    const normalized = normalizeHexColor(color);
    if (!normalized || seen.has(normalized)) {
      return;
    }
    seen.add(normalized);
    output.push(normalized);
  });
  return output;
}

function svgPaintAnalysis(svg) {
  const text = String(svg || "");
  const domAnalysis = svgPaintAnalysisFromDom(text);
  return domAnalysis || svgPaintAnalysisFromText(text);
}

function svgPaintAnalysisFromDom(svg) {
  if (typeof DOMParser === "undefined" || !remoteBrandSvgHasRootElement(svg)) {
    return null;
  }
  let doc;
  try {
    doc = new DOMParser().parseFromString(svg, "image/svg+xml");
  } catch {
    return null;
  }
  if (!doc?.documentElement || doc.querySelector("parsererror")) {
    return null;
  }
  const colors = [];
  const visibleColors = [];
  const definitionColors = [];
  const paintServerColors = [];
  const seenColors = new Set();
  const seenVisibleColors = new Set();
  const seenDefinitionColors = new Set();
  const seenPaintServerColors = new Set();
  // clippath 係纯几何裁剪，其子元素嘅 fill 永远唔会上色，应当定义色处理（唔计入可见色）。
  const paintServerTags = new Set(["lineargradient", "radialgradient", "meshgradient", "pattern", "filter", "mask", "clippath"]);
  const effectPaintServerTags = new Set(["pattern", "filter", "mask"]);
  const styleRules = svgStyleRules(doc);
  const idMap = new Map([...doc.querySelectorAll("[id]")].map((element) => [element.id, element]));
  let usesPaintServer = false;
  let hasEffectPaintServer = false;
  const push = (target, seen, value, currentColor = "") => {
    const color = normalizeSvgHexColor(resolveSvgColorValue(value, currentColor));
    if (!color || seen.has(color)) {
      return;
    }
    seen.add(color);
    target.push(color);
  };
  const styleValue = (element, property) => {
    const attributeValue = element.hasAttribute(property) ? element.getAttribute(property) || "" : "";
    let value = attributeValue;
    for (const rule of styleRules) {
      if (rule.properties[property] && svgElementMatches(element, rule.selector)) {
        value = rule.properties[property];
      }
    }
    const inlineValue = svgInlineStyleProperty(element.getAttribute("style") || "", property);
    return {
      attributeValue,
      value: inlineValue || value
    };
  };
  const paintValue = (element, property) => styleValue(element, property).value;
  const isInsidePaintServerDefinition = (element) => {
    let current = element;
    while (current?.nodeType === 1) {
      if (paintServerTags.has(current.tagName.toLowerCase())) {
        return true;
      }
      current = current.parentElement;
    }
    return false;
  };
  const inheritedColor = (element) => {
    let current = element;
    while (current?.nodeType === 1) {
      const value = paintValue(current, "color");
      const color = normalizeSvgHexColor(resolveSvgColorValue(value));
      if (color) {
        return color;
      }
      current = current.parentElement;
    }
    return "";
  };
  const collectPaintServerColors = (paintServer, visited = new Set()) => {
    if (!paintServer || visited.has(paintServer)) {
      return;
    }
    visited.add(paintServer);
    [paintServer, ...paintServer.querySelectorAll("*")].forEach((element) => {
      const currentColor = inheritedColor(element);
      SVG_PAINT_COLOR_PROPERTIES.forEach((property) => {
        const value = paintValue(element, property);
        push(definitionColors, seenDefinitionColors, value, currentColor);
        push(paintServerColors, seenPaintServerColors, value, currentColor);
      });
      const href = element.getAttribute("href") || element.getAttribute("xlink:href") || "";
      const inheritedPaintServer = href.startsWith("#") ? idMap.get(href.slice(1)) : null;
      if (inheritedPaintServer) {
        collectPaintServerColors(inheritedPaintServer, visited);
      }
    });
  };
  const collectPaintServer = (value) => {
    const match = String(value || "").match(/url\(\s*#([^)\s]+)\s*\)/i);
    if (!match) {
      return;
    }
    const paintServer = idMap.get(match[1]);
    if (!paintServer) {
      return;
    }
    usesPaintServer = true;
    const tagName = paintServer.tagName.toLowerCase();
    if (effectPaintServerTags.has(tagName)) {
      hasEffectPaintServer = true;
    }
    collectPaintServerColors(paintServer);
  };
  const hasImplicitBlackPaint = (element) => {
    if (!["path", "circle", "rect", "polygon", "polyline", "line", "ellipse"].includes(element.tagName.toLowerCase())
      || isInsidePaintServerDefinition(element)) {
      return false;
    }
    let current = element;
    while (current?.nodeType === 1) {
      if (styleValue(current, "fill").value || styleValue(current, "stroke").value) {
        return false;
      }
      current = current.parentElement;
    }
    return true;
  };

  doc.querySelectorAll("*").forEach((element) => {
    const currentColor = inheritedColor(element);
    SVG_PAINT_COLOR_PROPERTIES.forEach((property) => {
      const { attributeValue, value } = styleValue(element, property);
      if (!isInsidePaintServerDefinition(element)) {
        push(visibleColors, seenVisibleColors, value, currentColor);
        if (/^url\(/i.test(String(value || "").trim())) {
          push(visibleColors, seenVisibleColors, attributeValue, currentColor);
        }
      } else {
        push(definitionColors, seenDefinitionColors, value, currentColor);
      }
      collectPaintServer(value);
    });
    SVG_PAINT_SERVER_REFERENCE_PROPERTIES.forEach((property) => {
      collectPaintServer(paintValue(element, property));
    });
  });
  if (visibleColors.length > 1 && [...doc.querySelectorAll("*")].some(hasImplicitBlackPaint)) {
    push(visibleColors, seenVisibleColors, "#000000");
  }
  visibleColors.forEach((color) => push(colors, seenColors, color));
  definitionColors.forEach((color) => push(colors, seenColors, color));
  paintServerColors.forEach((color) => push(visibleColors, seenVisibleColors, color));
  paintServerColors.forEach((color) => push(colors, seenColors, color));
  return { colors, visibleColors, definitionColors, paintServerColors, usesPaintServer, hasEffectPaintServer };
}

const SVG_PAINT_COLOR_PROPERTIES = Object.freeze([
  "fill",
  "stroke",
  "color",
  "stop-color",
  "flood-color",
  "lighting-color"
]);
const SVG_PAINT_SERVER_REFERENCE_PROPERTIES = Object.freeze([
  "fill",
  "stroke",
  "filter",
  "mask"
]);
const SVG_PAINT_STYLE_PROPERTIES = Object.freeze([
  ...new Set([...SVG_PAINT_COLOR_PROPERTIES, ...SVG_PAINT_SERVER_REFERENCE_PROPERTIES])
]);

function svgPaintAnalysisFromText(svg) {
  const palette = [];
  const visibleColors = [];
  const definitionColors = [];
  const paintServerColors = [];
  const seen = new Set();
  const seenVisibleColors = new Set();
  const seenDefinitionColors = new Set();
  const seenPaintServerColors = new Set();
  const pushColor = (target, targetSeen, value) => {
    const color = normalizeSvgHexColor(resolveSvgColorValue(value));
    if (!color || targetSeen.has(color)) {
      return;
    }
    targetSeen.add(color);
    target.push(color);
  };
  const text = String(svg || "");
  const paintServerBlockPattern = /<(?:linearGradient|radialGradient|meshgradient|pattern|filter|mask|clipPath)\b[\s\S]*?<\/(?:linearGradient|radialGradient|meshgradient|pattern|filter|mask|clipPath)>/gi;
  const referencedPaintServer = /\s(?:fill|stroke|filter|mask)\s*=\s*(["'])\s*url\(/i.test(text)
    || /(?:fill|stroke|filter|mask)\s*:\s*url\(/i.test(text);
  const referencedEffectPaintServer = /\s(?:filter|mask)\s*=\s*(["'])\s*url\(/i.test(text)
    || /(?:filter|mask)\s*:\s*url\(/i.test(text);
  const directText = text.replace(paintServerBlockPattern, "");
  const colorAttributeMatches = directText.matchAll(/\s(?:fill|stroke|color|stop-color|flood-color|lighting-color)\s*=\s*(["'])([^"']+)\1/gi);
  for (const match of colorAttributeMatches) {
    pushColor(visibleColors, seenVisibleColors, match[2]);
  }
  const inlineStyleMatches = directText.matchAll(/(?:^|["'{;\s])(?:fill|stroke|color|stop-color|flood-color|lighting-color)\s*:\s*([^;"'}\s][^;"'}]*)/gi);
  for (const match of inlineStyleMatches) {
    pushColor(visibleColors, seenVisibleColors, match[1]);
  }
  const implicitBlackShapeMatches = [...directText.matchAll(/<(?:path|circle|rect|polygon|polyline|line|ellipse)\b(?:(?!\s(?:fill|stroke|class|id)\s*=)[^>])*?>/gi)];
  if (visibleColors.length > 1) {
    for (const match of implicitBlackShapeMatches) {
      if (!/style\s*=\s*(["'])(?:(?!\1)[\s\S])*(?:fill|stroke)\s*:/i.test(match[0])) {
        pushColor(visibleColors, seenVisibleColors, "#000000");
      }
    }
  }
  const allPaintServerText = (String(svg || "").match(paintServerBlockPattern) || []).join("");
  const allPaintServerAttributeMatches = allPaintServerText.matchAll(/\s(?:fill|stroke|color|stop-color|flood-color|lighting-color)\s*=\s*(["'])([^"']+)\1/gi);
  for (const match of allPaintServerAttributeMatches) {
    pushColor(definitionColors, seenDefinitionColors, match[2]);
  }
  const allPaintServerStyleMatches = allPaintServerText.matchAll(/(?:^|["'{;\s])(?:fill|stroke|color|stop-color|flood-color|lighting-color)\s*:\s*([^;"'}\s][^;"'}]*)/gi);
  for (const match of allPaintServerStyleMatches) {
    pushColor(definitionColors, seenDefinitionColors, match[1]);
  }
  const referencedPaintServerText = referencedPaintServer ? allPaintServerText : "";
  const paintServerAttributeMatches = referencedPaintServerText.matchAll(/\s(?:fill|stroke|color|stop-color|flood-color|lighting-color)\s*=\s*(["'])([^"']+)\1/gi);
  for (const match of paintServerAttributeMatches) {
    pushColor(paintServerColors, seenPaintServerColors, match[2]);
  }
  const paintServerStyleMatches = referencedPaintServerText.matchAll(/(?:^|["'{;\s])(?:fill|stroke|color|stop-color|flood-color|lighting-color)\s*:\s*([^;"'}\s][^;"'}]*)/gi);
  for (const match of paintServerStyleMatches) {
    pushColor(paintServerColors, seenPaintServerColors, match[1]);
  }
  visibleColors.forEach((color) => pushColor(palette, seen, color));
  definitionColors.forEach((color) => pushColor(palette, seen, color));
  paintServerColors.forEach((color) => pushColor(visibleColors, seenVisibleColors, color));
  paintServerColors.forEach((color) => pushColor(palette, seen, color));
  return {
    colors: palette,
    visibleColors,
    definitionColors,
    paintServerColors,
    usesPaintServer: referencedPaintServer,
    hasEffectPaintServer: referencedEffectPaintServer
      || (referencedPaintServer && /<(?:pattern|filter|mask)\b/i.test(text))
  };
}

function svgStyleRules(doc) {
  const rules = [];
  doc.querySelectorAll("style").forEach((styleElement) => {
    const css = styleElement.textContent || "";
    for (const match of css.matchAll(/([^{}]+)\{([^{}]+)\}/g)) {
      const properties = svgStyleDeclarationProperties(match[2]);
      if (!Object.keys(properties).length) {
        continue;
      }
      match[1].split(",").map((selector) => selector.trim()).filter(Boolean).forEach((selector) => {
        rules.push({ selector, properties });
      });
    }
  });
  return rules;
}

function svgElementMatches(element, selector) {
  try {
    return element.matches(selector);
  } catch {
    return false;
  }
}

function svgStyleDeclarationProperties(styleText) {
  const properties = {};
  String(styleText || "").split(";").forEach((declaration) => {
    const separator = declaration.indexOf(":");
    if (separator <= 0) {
      return;
    }
    const property = declaration.slice(0, separator).trim().toLowerCase();
    if (!SVG_PAINT_STYLE_PROPERTIES.includes(property)) {
      return;
    }
    properties[property] = declaration.slice(separator + 1).trim();
  });
  return properties;
}

function svgInlineStyleProperty(styleText, property) {
  return svgStyleDeclarationProperties(styleText)[property] || "";
}

function resolveSvgColorValue(value, currentColor = "") {
  const raw = String(value || "").trim();
  if (/^currentColor$/i.test(raw)) {
    return currentColor;
  }
  const varMatch = raw.match(/^var\(\s*--[^,\s)]+(?:\s*,\s*([^)]+))?\)$/i);
  if (varMatch?.[1]) {
    return varMatch[1].trim();
  }
  return raw;
}

function normalizeSvgHexColor(value) {
  const color = String(value || "")
    .trim()
    .replace(/\s*!important\s*$/i, "")
    .toLowerCase();
  if (!color || /^(?:none|transparent|currentcolor|inherit|initial|unset)$/i.test(color) || /^url\(/i.test(color)) {
    return "";
  }
  if (/^#[0-9a-f]{6}$/i.test(color)) {
    return color;
  }
  if (/^#[0-9a-f]{8}$/i.test(color)) {
    return color.slice(7, 9) === "00" ? "" : color.slice(0, 7);
  }
  if (/^#[0-9a-f]{3}$/i.test(color)) {
    return `#${[...color.slice(1)].map((character) => character + character).join("")}`;
  }
  if (/^#[0-9a-f]{4}$/i.test(color)) {
    const [red, green, blue, alpha] = [...color.slice(1)];
    if (alpha === "0") {
      return "";
    }
    return `#${red}${red}${green}${green}${blue}${blue}`;
  }
  const rgbMatch = color.match(/^rgba?\(\s*([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)(?:\s*,\s*([+-]?\d*(?:\.\d+)?))?\s*\)$/i);
  if (rgbMatch) {
    if (rgbMatch[4] !== undefined && Number(rgbMatch[4]) <= 0) {
      return "";
    }
    return rgbToHex([rgbMatch[1], rgbMatch[2], rgbMatch[3]].map((channel) => {
      return Math.round(Math.max(0, Math.min(255, Number(channel))));
    }));
  }
  const namedColors = {
    black: "#000000",
    blue: "#0000ff",
    cyan: "#00ffff",
    gray: "#808080",
    green: "#008000",
    grey: "#808080",
    lime: "#00ff00",
    magenta: "#ff00ff",
    orange: "#ffa500",
    purple: "#800080",
    red: "#ff0000",
    white: "#ffffff",
    yellow: "#ffff00"
  };
  if (Object.hasOwn(namedColors, color)) {
    return namedColors[color];
  }
  return "";
}

function decodeSvgDataUrl(value) {
  const source = String(value || "");
  if (!/^data:image\/svg\+xml[,;]/i.test(source)) {
    return "";
  }
  const commaIndex = source.indexOf(",");
  if (commaIndex < 0) {
    return "";
  }
  const metadata = source.slice(0, commaIndex).toLowerCase();
  const payload = source.slice(commaIndex + 1);
  try {
    return metadata.includes(";base64")
      ? atob(payload)
      : decodeURIComponent(payload);
  } catch {
    return "";
  }
}

function remoteBrandIconSlugCandidates(parsedUrl) {
  const siteKey = siteGroupKey(parsedUrl);
  const candidates = [];
  const addCandidate = (value, score, source) => {
    const slug = remoteBrandIconSlug(value);
    if (!slug || (slug.length < 2 && slug !== "x")) {
      return;
    }
    candidates.push({ slug, score, source });
  };
  (REMOTE_BRAND_ICON_SLUGS_BY_SITE_KEY[siteKey] || []).forEach((slug, index) => {
    addCandidate(slug, index === 0 ? 100 : 88, "alias");
  });
  const host = normalizeHostname(siteKey);
  const labels = host.split(".").filter(Boolean);
  if (labels.length) {
    const registrableLabels = remoteBrandIconRegistrableLabels(labels);
    addCandidate(registrableLabels.join(""), 92, "registrable");
    addCandidate(labels.join(""), 74, "host");
    addCandidate(labels[0], 68, "host-label");
  }
  addCandidate(SITE_NAME_BY_KEY[siteKey] || "", 64, "site-name");
  return remoteBrandIconRankedCandidates(candidates).slice(0, 8);
}

function remoteBrandIconRankedCandidates(candidates) {
  const bestBySlug = new Map();
  for (const candidate of candidates) {
    const existing = bestBySlug.get(candidate.slug);
    if (!existing || candidate.score > existing.score) {
      bestBySlug.set(candidate.slug, candidate);
    }
  }
  return [...bestBySlug.values()].sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug));
}

function remoteBrandIconRegistrableLabels(labels) {
  if (labels.length <= 2) {
    return labels.slice(0, 1);
  }
  const suffix = labels.slice(-2).join(".");
  const labelCount = MULTIPART_PUBLIC_SUFFIXES.has(suffix) ? 3 : 2;
  return labels.slice(0, -labelCount + 1);
}

function remoteBrandIconSlug(value) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\+/g, "plus")
    .replace(/\./g, "dot")
    .replace(/[^a-z0-9]+/g, "");
}

async function discoverSiteIconCandidateEntries(url) {
  const parsedUrl = safeUrl(url);
  if (!parsedUrl) {
    return [];
  }
  const candidates = await discoverSiteIconCandidates(parsedUrl);
  const seenUrls = new Set();
  return candidates
    .slice(0, SITE_ICON_DISCOVERY_CANDIDATE_LIMIT)
    .filter((candidate) => {
      const key = String(candidate?.url || "").replace(/#.*$/, "");
      if (!key || seenUrls.has(key)) {
        return false;
      }
      seenUrls.add(key);
      return true;
    });
}

async function discoverSiteIconCandidates(parsedUrl) {
  const candidates = [...rootSiteIconCandidates(parsedUrl)];
  try {
    const document = await fetchSiteIconDocument(`${parsedUrl.origin}/`);
    const extracted = extractSiteIconDocumentCandidates(document.html, document.baseUrl);
    candidates.push(...extracted.icons);
    for (const manifest of extracted.manifests.slice(0, 3)) {
      const manifestIcons = await fetchManifestIconCandidates(manifest.url, manifest.score);
      candidates.push(...manifestIcons);
    }
  } catch {
    // Root favicon candidates still cover sites that block page HTML fetches.
  }
  return dedupeAndSortSiteIconCandidates(candidates);
}

async function fetchSiteIconDocument(url) {
  const response = await withTimeout(fetch(url, {
    cache: "force-cache",
    credentials: "omit",
    redirect: "follow"
  }), SITE_ICON_DOCUMENT_DISCOVERY_TIMEOUT_MS, "Site icon document discovery timed out.");
  if (!response.ok) {
    throw new Error(`Site icon page request failed: ${response.status}`);
  }
  const contentType = response.headers.get("content-type") || "";
  if (contentType && !/\b(?:text\/html|application\/xhtml\+xml|text\/plain)\b/i.test(contentType)) {
    throw new Error(`Site icon page is not HTML: ${contentType}`);
  }
  const html = (await response.text()).slice(0, SITE_ICON_DISCOVERY_HTML_MAX_BYTES);
  return {
    html,
    baseUrl: response.headers.get("x-wayleaf-final-url") || response.url || url
  };
}

function extractSiteIconDocumentCandidates(html, baseUrl) {
  const markup = String(html || "");
  const icons = [];
  const manifests = [];
  const linkPattern = /<link\b[^>]*>/gi;
  let linkMatch;
  let index = 0;
  while ((linkMatch = linkPattern.exec(markup))) {
    const attrs = parseHtmlTagAttributes(linkMatch[0]);
    const relTokens = siteIconRelTokens(attrs.rel);
    const href = normalizeText(attrs.href);
    if (!href) {
      index += 1;
      continue;
    }
    if (relTokens.has("manifest")) {
      const manifestUrl = absoluteIconUrl(href, baseUrl);
      if (manifestUrl) {
        manifests.push({
          url: manifestUrl,
          source: "document",
          score: 520 + index / 1000
        });
      }
    }
    const relScore = siteIconRelScore(relTokens);
    if (relScore) {
      const iconUrl = absoluteIconUrl(href, baseUrl);
      if (iconUrl) {
        const sizes = parseIconSizes(attrs.sizes);
        const type = normalizeText(attrs.type).toLowerCase();
        icons.push({
          url: iconUrl,
          source: "document",
          score: relScore
            + siteIconSizeScore(sizes)
            + siteIconTypeScore(type, iconUrl)
            + index / 1000
        });
      }
    }
    index += 1;
  }
  return {
    icons: dedupeAndSortSiteIconCandidates(icons),
    manifests: dedupeAndSortSiteIconCandidates(manifests)
  };
}

function parseHtmlTagAttributes(tag) {
  const attrs = {};
  const attrPattern = /([^\s"'<>/=]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;
  let attrMatch;
  while ((attrMatch = attrPattern.exec(String(tag || "")))) {
    const name = attrMatch[1]?.toLowerCase();
    if (!name) {
      continue;
    }
    attrs[name] = decodeHtmlAttribute(attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? "");
  }
  return attrs;
}

function decodeHtmlAttribute(value) {
  const text = String(value || "");
  if (!text.includes("&")) {
    return text;
  }
  if (typeof document !== "undefined" && document.createElement) {
    const element = document.createElement("textarea");
    element.innerHTML = text;
    return element.value;
  }
  return text.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function siteIconRelTokens(value) {
  return new Set(normalizeText(value).toLowerCase().split(/\s+/).filter(Boolean));
}

function siteIconRelScore(relTokens) {
  if (relTokens.has("icon")) {
    return 1100;
  }
  if (relTokens.has("apple-touch-icon") || relTokens.has("apple-touch-icon-precomposed")) {
    return 900;
  }
  if (relTokens.has("mask-icon")) {
    return 620;
  }
  return 0;
}

async function fetchManifestIconCandidates(manifestUrl, baseScore = 0) {
  try {
    const response = await withTimeout(fetch(manifestUrl, {
      cache: "force-cache",
      credentials: "omit",
      redirect: "follow"
    }), SITE_ICON_DISCOVERY_TIMEOUT_MS, "Site icon manifest request timed out.");
    if (!response.ok) {
      return [];
    }
    const manifest = await response.json();
    const icons = Array.isArray(manifest?.icons) ? manifest.icons : [];
    return dedupeAndSortSiteIconCandidates(icons.map((icon, index) => {
      const iconUrl = absoluteIconUrl(icon?.src || "", response.url || manifestUrl);
      if (!iconUrl) {
        return null;
      }
      const sizes = parseIconSizes(icon.sizes);
      const type = normalizeText(icon.type).toLowerCase();
      const purpose = normalizeText(icon.purpose).toLowerCase();
      return {
        url: iconUrl,
        source: "manifest",
        score: baseScore
          + 320
          + siteIconSizeScore(sizes)
          + siteIconTypeScore(type, iconUrl)
          + siteIconPurposeScore(purpose)
          + index / 1000
      };
    }).filter(Boolean));
  } catch {
    return [];
  }
}

function rootSiteIconCandidates(parsedUrl) {
  return [
    { href: "/favicon.ico", score: 470 },
    { href: "/favicon.png", score: 450 },
    { href: "/favicon.svg", score: 430 },
    { href: "/apple-touch-icon.png", score: 390 },
    { href: "/apple-touch-icon-precomposed.png", score: 370 }
  ].map((candidate) => ({
    url: absoluteIconUrl(candidate.href, parsedUrl.origin),
    source: "root",
    score: candidate.score + siteIconTypeScore("", candidate.href)
  })).filter((candidate) => candidate.url);
}

function parseIconSizes(value) {
  const text = normalizeText(value).toLowerCase();
  if (/\bany\b/.test(text)) {
    return [Infinity];
  }
  return (text.match(/\d+x\d+/gi) || [])
    .map((size) => {
      const [width, height] = size.toLowerCase().split("x").map(Number);
      return Math.min(width || 0, height || 0);
    })
    .filter((size) => Number.isFinite(size) && size > 0);
}

function siteIconSizeScore(sizes) {
  if (!sizes.length) {
    return 42;
  }
  if (sizes.some((size) => size === Infinity)) {
    return 180;
  }
  const target = SITE_ICON_DISCOVERY_TARGET_SIZE;
  const bestAtLeastTarget = sizes
    .filter((size) => size >= target)
    .sort((a, b) => a - b)[0];
  const bestSize = bestAtLeastTarget || Math.max(...sizes);
  if (bestSize >= target) {
    return 180 - Math.min(70, (bestSize - target) * 0.25);
  }
  return 42 + Math.min(100, bestSize * 0.75);
}

function siteIconTypeScore(type, url) {
  const mime = normalizeSiteIconMime(type) || siteIconMimeFromUrl(url);
  if (/^image\/(?:png|webp|svg\+xml)$/i.test(mime)) {
    return 82;
  }
  if (/^image\/(?:x-icon|vnd\.microsoft\.icon|jpeg|jpg)$/i.test(mime)) {
    return 70;
  }
  return siteIconUrlLooksLikeImage(url) ? 48 : 0;
}

function siteIconPurposeScore(purpose) {
  const tokens = new Set(normalizeText(purpose).toLowerCase().split(/\s+/).filter(Boolean));
  if (tokens.has("monochrome") && !tokens.has("any") && !tokens.has("maskable")) {
    return -180;
  }
  if (tokens.has("any")) {
    return 34;
  }
  if (tokens.has("maskable")) {
    return 20;
  }
  return 0;
}

function dedupeAndSortSiteIconCandidates(candidates) {
  const seen = new Set();
  return candidates
    .filter((candidate) => candidate?.url)
    .sort((a, b) => b.score - a.score)
    .filter((candidate) => {
      const key = candidate.url.replace(/#.*$/, "");
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
}

function absoluteIconUrl(value, baseUrl) {
  const dataUrl = normalizeStoredSiteIcon(value);
  if (dataUrl) {
    return dataUrl;
  }
  try {
    const iconUrl = new URL(value, baseUrl);
    return /^https?:$/.test(iconUrl.protocol) ? iconUrl.href : "";
  } catch {
    return "";
  }
}

async function fetchImageDataUrl(url) {
  const dataUrl = normalizeStoredSiteIcon(url);
  if (dataUrl) {
    return dataUrl;
  }
  const response = await withTimeout(fetch(url, {
    cache: "force-cache",
    credentials: "omit",
    redirect: "follow"
  }), SITE_ICON_FETCH_TIMEOUT_MS, "Site icon image request timed out.");
  if (!response.ok) {
    throw new Error(`Site icon image request failed: ${response.status}`);
  }
  const contentType = response.headers.get("content-type") || "";
  const responseUrl = response.url || url;
  if (!siteIconResponseLooksLikeImage(contentType, responseUrl)) {
    return "";
  }
  const blob = await response.blob();
  if (!blob.size || blob.size > MAX_CACHED_SITE_ICON_BYTES) {
    return "";
  }
  const mime = normalizeSiteIconMime(blob.type)
    || normalizeSiteIconMime(contentType)
    || siteIconMimeFromUrl(responseUrl);
  return await blobToDataUrl(mime ? new Blob([blob], { type: mime }) : blob);
}

function siteIconResponseLooksLikeImage(contentType, url) {
  const mime = normalizeSiteIconMime(contentType);
  if (supportedSiteIconMime(mime)) {
    return true;
  }
  return (!mime || /^application\/octet-stream$/i.test(mime)) && siteIconUrlLooksLikeImage(url);
}

function normalizeSiteIconMime(value) {
  return normalizeText(value).split(";")[0].trim().toLowerCase();
}

function supportedSiteIconMime(mime) {
  return /^image\/(?:png|jpe?g|webp|svg\+xml|x-icon|vnd\.microsoft\.icon)$/i.test(mime);
}

function siteIconUrlLooksLikeImage(url) {
  return /\.(?:ico|png|jpe?g|webp|svg)(?:[?#].*)?$/i.test(String(url || ""));
}

function siteIconMimeFromUrl(url) {
  const pathname = (() => {
    try {
      return new URL(url, "https://example.com").pathname.toLowerCase();
    } catch {
      return String(url || "").toLowerCase();
    }
  })();
  if (pathname.endsWith(".ico")) {
    return "image/x-icon";
  }
  if (pathname.endsWith(".png")) {
    return "image/png";
  }
  if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) {
    return "image/jpeg";
  }
  if (pathname.endsWith(".webp")) {
    return "image/webp";
  }
  if (pathname.endsWith(".svg")) {
    return "image/svg+xml";
  }
  return "";
}

function blobToDataUrl(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(normalizeStoredSiteIcon(reader.result)));
    reader.addEventListener("error", () => resolve(""));
    reader.readAsDataURL(blob);
  });
}

function normalizeStoredSiteIcon(icon) {
  const value = normalizeText(icon);
  if (!value || value.length > MAX_CACHED_SITE_ICON_BYTES * 2) {
    return "";
  }
  return /^data:image\/(?:png|jpe?g|webp|svg\+xml|x-icon|vnd\.microsoft\.icon);base64,/i.test(value)
    || /^data:image\/svg\+xml(?:;charset=[^,;]+)?(?:;utf8)?[,;]/i.test(value)
    ? value
    : "";
}

function favoriteSiteTitleFromUrl(url) {
  const parsedUrl = safeUrl(url);
  return siteDisplayName(parsedUrl, "").slice(0, MAX_PORTAL_TITLE_LENGTH) || compactSiteDomain(url);
}

function favoriteSiteKey(url) {
  return normalizePortalUrl(url);
}

function favoriteSiteKeySet(sites = []) {
  return new Set(
    sites
      .map((site) => favoriteSiteKey(site?.url))
      .filter(Boolean)
  );
}

async function removeFavoriteSite(id, node) {
  if (node?.classList.contains("removing")) {
    return;
  }
  if (node) {
    if (activeFavoriteDeleteCard === node) {
      activeFavoriteDeleteCard = null;
    }
    node.classList.remove("pressing", "clearing");
    node.classList.add("removing");
    await animateFavoriteTearAway(node);
  }
  const nextSites = (await loadFavoriteSites()).filter((site) => site.id !== id);
  await saveFavoriteSites(nextSites);
  await renderFavoriteDependentSurfaces({ preserveBookmarkScroll: true });
}

function wait(duration) {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

async function animateFavoriteTearAway(node) {
  const shell = node.querySelector(".favorite-icon-shell");
  if (!shell) {
    await wait(FAVORITE_DELETE_EXIT_MS);
    return;
  }
  const rect = shell.getBoundingClientRect();
  const layer = document.createElement("div");
  const topPiece = createFavoriteTearPiece(shell, rect, "top");
  const bottomPiece = createFavoriteTearPiece(shell, rect, "bottom");
  layer.className = "favorite-tear-layer";
  layer.append(topPiece, bottomPiece);
  document.body.appendChild(layer);
  shell.style.visibility = "hidden";
  const gsap = getGsap();
  if (gsap) {
    await new Promise((resolve) => {
      const midpointDuration = gsapDuration(FAVORITE_DELETE_EXIT_MS * 0.42);
      const exitDuration = gsapDuration(FAVORITE_DELETE_EXIT_MS * 0.58);
      gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: resolve
      })
        .set([topPiece, bottomPiece], { autoAlpha: 1, x: 0, y: 0, rotation: 0, scale: 0.82 })
        .to(topPiece, { x: -3, y: -7, rotation: -4, scale: 0.78, duration: midpointDuration }, 0)
        .to(bottomPiece, { x: 4, y: 8, rotation: 5, scale: 0.78, duration: midpointDuration }, 0)
        .to(topPiece, { autoAlpha: 0, x: -18, y: -34, rotation: -18, scale: 0.46, duration: exitDuration }, midpointDuration)
        .to(bottomPiece, { autoAlpha: 0, x: 22, y: 36, rotation: 20, scale: 0.44, duration: exitDuration }, midpointDuration);
    });
    layer.remove();
    return;
  }
  const timing = {
    duration: FAVORITE_DELETE_EXIT_MS,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    fill: "forwards"
  };
  const topAnimation = topPiece.animate([
    { opacity: 1, transform: "translate3d(0, 0, 0) rotate(0deg) scale(0.82)" },
    { opacity: 1, transform: "translate3d(-3px, -7px, 0) rotate(-4deg) scale(0.78)", offset: 0.42 },
    { opacity: 0, transform: "translate3d(-18px, -34px, 0) rotate(-18deg) scale(0.46)" }
  ], timing);
  const bottomAnimation = bottomPiece.animate([
    { opacity: 1, transform: "translate3d(0, 0, 0) rotate(0deg) scale(0.82)" },
    { opacity: 1, transform: "translate3d(4px, 8px, 0) rotate(5deg) scale(0.78)", offset: 0.42 },
    { opacity: 0, transform: "translate3d(22px, 36px, 0) rotate(20deg) scale(0.44)" }
  ], timing);
  await Promise.allSettled([topAnimation.finished, bottomAnimation.finished]);
  layer.remove();
}

function createFavoriteTearPiece(shell, rect, part) {
  const piece = document.createElement("div");
  const clone = shell.cloneNode(true);
  const topOffset = part === "top" ? 0 : rect.height / 2;
  piece.className = `favorite-tear-piece ${part}`;
  piece.style.left = `${rect.left}px`;
  piece.style.top = `${rect.top + topOffset}px`;
  piece.style.width = `${rect.width}px`;
  piece.style.height = `${rect.height / 2}px`;
  clone.style.top = `${-topOffset}px`;
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  piece.appendChild(clone);
  return piece;
}

function compactSiteDomain(url) {
  const parsedUrl = safeUrl(url);
  if (!parsedUrl) {
    return "";
  }
  return parsedUrl.hostname.replace(/^www\./, "");
}


function hashText(value) {
  let hash = 0;
  for (const character of String(value || "")) {
    hash = ((hash << 5) - hash + character.charCodeAt(0)) | 0;
  }
  return hash;
}

function storeIconSiteContext(icon, site) {
  icon.draggable = false;
  icon.dataset.siteUrl = site.url || "";
  icon.dataset.siteTitle = site.title || icon.alt || "";
}

function preventNativeSiteIconDrag(event) {
  if (event.target?.closest?.(".favorite-link, .recent-folder-face, .site-link")) {
    event.preventDefault();
  }
}

function computeSiteIconTile(site, iconPath = "") {
  const parsedUrl = safeUrl(site.url);
  const siteKey = siteGroupKey(parsedUrl);
  const tileColor = siteIconBrandColor(siteKey, iconPath);
  const svgRenderMode = primarySvgIconRenderMode(iconPath);
  const tileMode = iconPath ? "brand" : "plain";
  const isLocalIconSource = String(iconPath || "").startsWith("icons/");
  let tileColors = genericIconTileColors(parsedUrl?.hostname || site.url || site.title);
  if (iconPath && (tileColor || primarySvgRenderModeUsesCarrier(svgRenderMode))) {
    tileColors = brandIconTileColors(tileColor, siteKey, iconPath);
  }
  return { siteKey: siteKey || "", tileMode, tileColors, isLocalIconSource };
}

function applySiteIconTile(icon, site, iconPath = "") {
  const tile = computeSiteIconTile(site, iconPath);
  icon.dataset.siteKey = tile.siteKey;
  applyIconTile(icon, tile.tileMode, tile.tileColors, tile.isLocalIconSource);
}

function hydrateLocalSiteIconBrandColor(icon, site, iconPath = "") {
  if (!localSiteIconSourceCanLoadBrandColor(iconPath)
    || (localSiteIconRenderMode(iconPath) && !siteIconRawSvgStalePaths.has(iconPath))) {
    return;
  }
  loadLocalSiteIconBrandColor(iconPath).then(() => {
    if (!icon.isConnected || !iconStillRenderingCandidate(icon, iconPath)) {
      return;
    }
    const hasIconStrategy = siteIconBrandColor(icon.dataset.siteKey || siteGroupKey(safeUrl(site.url)), iconPath)
      || ["gradient", "original"].includes(localSiteIconRenderMode(iconPath));
    if (hasIconStrategy) {
      applySiteIconTile(icon, site, iconPath);
      const displayIcon = displayIconSource(icon, iconPath);
      if (displayIcon instanceof Promise) {
        displayIcon.then((source) => {
          if (iconStillRenderingCandidate(icon, iconPath)) {
            icon.src = source;
          }
        });
      } else {
        icon.src = displayIcon;
      }
    }
    if (localIconNeedsRemoteBrandColor(icon.dataset.siteKey || siteGroupKey(safeUrl(site.url)), iconPath)) {
      refreshRemoteBrandIcon(icon, site);
    }
  });
}

function loadLocalSiteIconBrandColor(source) {
  const value = String(source || "");
  if (!localSiteIconSourceCanLoadBrandColor(value)) {
    return Promise.resolve("");
  }
  const shouldRevalidate = siteIconRawSvgStalePaths.has(value);
  if (!shouldRevalidate && localSiteIconBrandColorCache.has(value)) {
    return Promise.resolve(localSiteIconBrandColorCache.get(value));
  }
  if (!shouldRevalidate && localSiteIconBrandColorRequests.has(value)) {
    return localSiteIconBrandColorRequests.get(value);
  }
  const request = fetch(value, shouldRevalidate ? { cache: "no-store" } : undefined)
    .then((response) => response.ok ? response.text() : "")
    .then((svg) => {
      rememberSiteIconRawSvgText(value, svg);
      const analysis = localSiteIconAnalysisFromSvg(svg);
      cacheLocalSiteIconAnalysis(value, analysis);
      return analysis.brandColor;
    })
    .catch(() => {
      localSiteIconBrandColorCache.set(value, "");
      localSiteIconRenderModeCache.set(value, "");
      localSiteIconExplicitBrandColorCache.set(value, false);
      localSiteIconVisibleColorsCache.set(value, []);
      localSiteIconEmbeddedCarrierColorCache.set(value, "");
      return "";
    });
  localSiteIconBrandColorRequests.set(value, request);
  return request;
}

function siteIconBrandColor(siteKey = "", iconPath = "") {
  const remoteDescriptor = remoteBrandSvgDescriptorFromSource(iconPath);
  if (remoteDescriptor) {
    return remoteDescriptor.brandColor;
  }
  const localColor = localSiteIconBrandColor(iconPath);
  const embeddedColor = embeddedSvgBrandColor(iconPath);
  if (embeddedColor) {
    return embeddedColor;
  }
  if (localColor && !remoteBrandColorLooksNeutral(localColor) && !nearBlackBrandColor(localColor)) {
    return localColor;
  }
  // 单色 svg 读到嘅锚色（含近黑/白→黑）直接生效，毋须白名单覆盖。
  if (localColor && localSiteIconHasExplicitBrandColor(iconPath)) {
    return localColor;
  }
  if (localColor && !localSiteIconHasExplicitBrandColor(iconPath)) {
    return localColor;
  }
  return normalizeHexColor(siteKey ? SITE_ICON_TILE_COLOR_BY_SITE_KEY[siteKey] || "" : "")
    || localColor;
}

function localSiteIconBrandColor(source) {
  const value = String(source || "");
  if (localSiteIconBrandColorCache.has(value)) {
    return localSiteIconBrandColorCache.get(value);
  }
  if (isSvgDataUrl(value)) {
    const analysis = localSiteIconAnalysisFromSvg(decodeSvgDataUrl(value));
    cacheLocalSiteIconAnalysis(value, analysis);
    return analysis.brandColor;
  }
  return "";
}

function localSiteIconHasExplicitBrandColor(source) {
  const value = String(source || "");
  if (localSiteIconExplicitBrandColorCache.has(value)) {
    return localSiteIconExplicitBrandColorCache.get(value);
  }
  if (isSvgDataUrl(value)) {
    const analysis = localSiteIconAnalysisFromSvg(decodeSvgDataUrl(value));
    cacheLocalSiteIconAnalysis(value, analysis);
    return analysis.hasExplicitBrandColor;
  }
  return false;
}

function localSiteIconRenderMode(source) {
  const value = String(source || "");
  if (localSiteIconRenderModeCache.has(value)) {
    return localSiteIconRenderModeCache.get(value);
  }
  if (isSvgDataUrl(value)) {
    const analysis = localSiteIconAnalysisFromSvg(decodeSvgDataUrl(value));
    cacheLocalSiteIconAnalysis(value, analysis);
    return analysis.renderMode;
  }
  return "";
}

function localSiteIconVisibleColors(source) {
  const value = String(source || "");
  if (localSiteIconVisibleColorsCache.has(value)) {
    return localSiteIconVisibleColorsCache.get(value);
  }
  if (isSvgDataUrl(value)) {
    const analysis = localSiteIconAnalysisFromSvg(decodeSvgDataUrl(value));
    cacheLocalSiteIconAnalysis(value, analysis);
    return analysis.visibleColors;
  }
  return [];
}

function localSiteIconEmbeddedCarrierColor(source) {
  const value = String(source || "");
  if (localSiteIconEmbeddedCarrierColorCache.has(value)) {
    return localSiteIconEmbeddedCarrierColorCache.get(value);
  }
  if (isSvgDataUrl(value)) {
    const analysis = localSiteIconAnalysisFromSvg(decodeSvgDataUrl(value));
    cacheLocalSiteIconAnalysis(value, analysis);
    return analysis.embeddedCarrierColor;
  }
  return "";
}

function cacheLocalSiteIconAnalysis(source, analysis) {
  localSiteIconBrandColorCache.set(source, analysis.brandColor);
  localSiteIconRenderModeCache.set(source, analysis.renderMode);
  localSiteIconExplicitBrandColorCache.set(source, analysis.hasExplicitBrandColor);
  localSiteIconVisibleColorsCache.set(source, analysis.visibleColors);
  localSiteIconEmbeddedCarrierColorCache.set(source, analysis.embeddedCarrierColor || "");
}

function localSiteIconAnalysisFromSvg(svg) {
  if (!remoteBrandSvgHasRootElement(svg)) {
    return { brandColor: "", renderMode: "", hasExplicitBrandColor: false, visibleColors: [], embeddedCarrierColor: "" };
  }
  const analysis = svgPaintAnalysis(svg);
  const isMonochrome = !analysis.usesPaintServer && analysis.visibleColors.length <= 1;
  const palette = analysis.colors;
  // 单色一律走统一锚色：有彩度=本色，无彩度/白/黑/currentColor=近黑。
  const monochromeBrandColor = isMonochrome ? remoteBrandSvgMonochromeBrandColor(svg, palette) : "";
  return {
    brandColor: monochromeBrandColor,
    renderMode: remoteBrandSvgHasComplexPaintAnalysis(analysis) ? "gradient" : isMonochrome ? "mask" : "original",
    hasExplicitBrandColor: Boolean(monochromeBrandColor),
    visibleColors: analysis.colors,
    embeddedCarrierColor: svgEmbeddedCarrierColor(svg)
  };
}

function localSiteIconSourceCanLoadBrandColor(source) {
  return String(source || "").startsWith(`${SITE_ICON_DIRECTORY}/`)
    && siteIconSourceLooksLikeSvg(source);
}

function brandIconTileColors(tileColor, siteKey = "", iconPath = "") {
  const color = normalizeHexColor(tileColor);
  return primarySvgIconRenderer(iconPath).tileColors(color, siteKey, iconPath);
}

function primarySvgIconRenderMode(iconPath = "") {
  const remoteDescriptor = remoteBrandSvgDescriptorFromSource(iconPath);
  if (remoteDescriptor) {
    return remoteDescriptor.renderMode || "";
  }
  return localSiteIconRenderMode(iconPath);
}

function primarySvgRenderModeUsesCarrier(renderMode) {
  return primarySvgRendererForMode(renderMode).usesCarrier;
}

function primarySvgIconRenderer(iconPath = "") {
  return primarySvgRendererForMode(primarySvgIconRenderMode(iconPath));
}

function primarySvgRendererForMode(renderMode = "") {
  return PRIMARY_SVG_RENDERERS[renderMode] || PRIMARY_SVG_RENDERERS.mask;
}

const PRIMARY_SVG_RENDERERS = Object.freeze({
  mask: Object.freeze({
    usesCarrier: false,
    keepsOriginalGlyph: false,
    tileColors: monochromePrimarySvgIconTileColors
  }),
  original: Object.freeze({
    usesCarrier: true,
    keepsOriginalGlyph: true,
    tileColors: originalPrimarySvgIconTileColors
  }),
  gradient: Object.freeze({
    usesCarrier: true,
    keepsOriginalGlyph: true,
    tileColors: (color, _siteKey, iconPath) => gradientSvgIconTileColors(color, iconPath)
  })
});

// PRIMARY SVG MONOCHROME SUBROUTE
function monochromePrimarySvgIconTileColors(color, siteKey = "", iconPath = "") {
  if (!color) {
    return genericIconTileColors("");
  }
  if (keepsBrandIconOriginalOnBrandTile(siteKey, iconPath)) {
    return {
      light: color,
      dark: color
    };
  }
  // 白/近白锚定近黑（兜住白名单来源的白色，如 chatgpt #ffffff），避免深色模式白底白 logo。
  const maskAnchor = nearWhiteBrandColor(color) ? "#000000" : color;
  return {
    light: brandIconLightCarrierColor(maskAnchor),
    dark: brandIconDarkCarrierColor(maskAnchor)
  };
}

// PRIMARY SVG MULTICOLOR SUBROUTE
function originalPrimarySvgIconTileColors(color, siteKey = "", iconPath = "") {
  if (color && keepsBrandIconOriginalOnBrandTile(siteKey, iconPath)) {
    return {
      light: color,
      dark: color
    };
  }
  const paletteTileColors = originalSvgIconTileColors(color, iconPath);
  if (paletteTileColors) {
    return paletteTileColors;
  }
  return color ? monochromePrimarySvgIconTileColors(color, siteKey, iconPath) : genericIconTileColors("");
}

// PRIMARY SVG GRADIENT SUBROUTE
function gradientSvgIconTileColors(brandColor, iconPath = "") {
  const palette = originalSvgVisiblePalette(brandColor, iconPath);
  if (palette.length > 1) {
    const carrier = gradientPaletteCarrierColor(palette);
    return {
      light: carrier,
      dark: carrier
    };
  }
  const color = normalizeHexColor(brandColor);
  if (!color) {
    return genericIconTileColors("");
  }
  return {
    light: brandIconLightCarrierColor(color),
    dark: brandIconDarkCarrierColor(color)
  };
}

function gradientPaletteCarrierColor(palette) {
  return gradientPaletteNeedsDarkAppIconCarrier(palette)
    ? BRAND_ICON_MULTICOLOR_DARK_CARRIER
    : BRAND_ICON_MULTICOLOR_PAPER_CARRIER;
}

function gradientPaletteNeedsDarkAppIconCarrier(palette) {
  const colors = uniqueNormalizedHexColors(palette);
  if (colors.length <= 1) {
    return false;
  }
  const traits = paletteColorTraits(colors);
  const lowContrastOnPaperRatio = colors.filter((color) => contrastRatio(color, BRAND_ICON_MULTICOLOR_PAPER_CARRIER) < BRAND_ICON_VI_CONTRAST_MIN).length / colors.length;
  const hueSpan = paletteHueSpan(colors);
  if (hueSpan >= 120 && (traits.averageLuminance < 0.5 || (traits.saturatedMulticolor && lowContrastOnPaperRatio < 0.8))) {
    return false;
  }
  return !traits.hasDark
    && lowContrastOnPaperRatio >= 0.65
    && traits.averageLuminance >= 0.45;
}

function paletteHueSpan(palette) {
  const hues = uniqueNormalizedHexColors(palette)
    .map((color) => {
      const stats = hexColorStats(color);
      const [red, green, blue] = hexToRgb(color).map((channel) => channel / 255);
      const chroma = Math.max(red, green, blue) - Math.min(red, green, blue);
      return chroma >= 0.18 ? stats?.hue || 0 : null;
    })
    .filter((hue) => hue !== null);
  return hues.length ? Math.max(...hues) - Math.min(...hues) : 0;
}

function usesOriginalIconCarrier(iconPath = "") {
  return primarySvgIconRenderMode(iconPath) === "original";
}

function originalSvgIconTileColors(brandColor, iconPath = "") {
  const palette = originalSvgVisiblePalette(brandColor, iconPath);
  if (palette.length <= 1) {
    return null;
  }
  const embeddedCarrier = originalSvgEmbeddedCarrierColor(iconPath);
  if (embeddedCarrier) {
    return {
      light: embeddedCarrier,
      dark: embeddedCarrier
    };
  }
  return {
    light: paletteAwareBrandIconCarrierColor(brandColor, palette, "light"),
    dark: paletteAwareBrandIconCarrierColor(brandColor, palette, "dark")
  };
}

function originalSvgEmbeddedCarrierColor(iconPath = "") {
  const remoteDescriptor = remoteBrandSvgDescriptorFromSource(iconPath);
  return remoteDescriptor?.embeddedCarrierColor || localSiteIconEmbeddedCarrierColor(iconPath);
}

function originalSvgVisiblePalette(brandColor, iconPath = "") {
  const remoteDescriptor = remoteBrandSvgDescriptorFromSource(iconPath);
  const visibleColors = remoteDescriptor?.visibleColors || localSiteIconVisibleColors(iconPath);
  const palette = uniqueNormalizedHexColors(visibleColors);
  if (palette.length > 1) {
    return palette;
  }
  const brand = normalizeHexColor(brandColor);
  return uniqueNormalizedHexColors([...palette, ...(brand && !remoteBrandColorLooksNeutral(brand) ? [brand] : [])]);
}

function paletteAwareBrandIconCarrierColor(brandColor, palette, mode) {
  const colors = uniqueNormalizedHexColors(palette);
  const anchor = paletteCarrierAnchorColor(brandColor, colors);
  if (!anchor || colors.length <= 1) {
    return mode === "dark" ? brandIconDarkCarrierColor(anchor) : brandIconLightCarrierColor(anchor);
  }
  return paletteNeedsDarkAppIconCarrier(palette)
    ? BRAND_ICON_MULTICOLOR_DARK_CARRIER
    : BRAND_ICON_MULTICOLOR_PAPER_CARRIER;
}

function paletteColorTraits(palette) {
  const colors = uniqueNormalizedHexColors(palette);
  const samples = colors.map((color) => {
    const stats = hexColorStats(color);
    const [red, green, blue] = hexToRgb(color).map((channel) => channel / 255);
    const chroma = Math.max(red, green, blue) - Math.min(red, green, blue);
    return {
      color,
      chroma,
      hue: stats?.hue || 0,
      luminance: stats?.luminance ?? relativeLuminance(color),
      saturated: chroma >= 0.24
    };
  });
  const count = Math.max(1, samples.length);
  const lightRatio = samples.filter((sample) => sample.luminance >= 0.72).length / count;
  const darkRatio = samples.filter((sample) => sample.luminance <= 0.16).length / count;
  const saturatedSamples = samples.filter((sample) => sample.saturated);
  const coloredSamples = samples.filter((sample) => sample.chroma >= 0.18);
  return {
    hasDark: darkRatio > 0,
    hasLight: lightRatio > 0,
    lightDominant: lightRatio >= 0.5,
    darkDominant: darkRatio >= 0.6,
    saturatedMulticolor: saturatedSamples.length >= 2,
    coloredRatio: coloredSamples.length / count,
    averageLuminance: samples.reduce((sum, sample) => sum + sample.luminance, 0) / count
  };
}

function paletteNeedsDarkAppIconCarrier(palette) {
  const traits = paletteColorTraits(palette);
  return traits.lightDominant
    && !traits.hasDark
    && traits.averageLuminance >= 0.58
    && traits.coloredRatio <= 0.5;
}

function paletteCarrierAnchorColor(brandColor, palette) {
  const brand = normalizeHexColor(brandColor);
  if (brand && !remoteBrandColorLooksNeutral(brand)) {
    return brand;
  }
  return uniqueNormalizedHexColors(palette).find((color) => !remoteBrandColorLooksNeutral(color)) || brand || "";
}

function brandIconLightCarrierColor(brandColor) {
  const brand = normalizeHexColor(brandColor);
  if (!brand) {
    return "";
  }
  if (contrastRatio(brand, "#ffffff") >= BRAND_ICON_VI_CONTRAST_MIN) {
    return brand;
  }
  for (let amount = 0.04; amount < 1; amount += 0.04) {
    const mixed = mixHexColors(brand, BRAND_ICON_LIGHT_MODE_DARK_CARRIER, amount);
    if (contrastRatio(mixed, "#ffffff") >= BRAND_ICON_VI_CONTRAST_MIN) {
      return mixed;
    }
  }
  return BRAND_ICON_LIGHT_MODE_DARK_CARRIER;
}

function brandIconDarkCarrierColor(brandColor) {
  const brand = normalizeHexColor(brandColor);
  if (!brand) {
    return "";
  }
  return BRAND_ICON_DARK_MODE_CARRIER;
}

function keepsBrandIconOriginal(siteKey, iconPath = "") {
  if (keepsBrandIconOriginalOnBrandTile(siteKey, iconPath)) {
    return true;
  }
  const remoteDescriptor = remoteBrandSvgDescriptorFromSource(iconPath);
  if (remoteDescriptor) {
    return primarySvgRendererForMode(remoteDescriptor.renderMode).keepsOriginalGlyph;
  }
  const localRenderMode = localSiteIconRenderMode(iconPath);
  if (localRenderMode) {
    return primarySvgRendererForMode(localRenderMode).keepsOriginalGlyph;
  }
  if (!siteIconSourceLooksLikeSvg(iconPath)) {
    return true;
  }
  return isSvgDataUrl(iconPath) && !remoteBrandSvgSourceIsMaskable(iconPath);
}

function usesGradientIconCarrier(iconPath = "") {
  return primarySvgIconRenderMode(iconPath) === "gradient";
}

function svgUsesGradientIconCarrier(svg) {
  return remoteBrandSvgHasComplexPaint(svg);
}

function keepsBrandIconOriginalOnBrandTile(siteKey, iconPath = "") {
  return ORIGINAL_ARTWORK_BRAND_TILE_SITE_KEYS.has(siteKey)
    && String(iconPath || "").startsWith(`${SITE_ICON_DIRECTORY}/`)
    && siteIconSourceLooksLikeSvg(iconPath);
}

function siteIconSourceLooksLikeSvg(source) {
  const value = String(source || "");
  return value.endsWith(".svg") || isSvgDataUrl(value);
}

function isSvgDataUrl(source) {
  return /^data:image\/svg\+xml[,;]/i.test(String(source || ""));
}

function remoteBrandSvgSourceIsMaskable(source) {
  const descriptor = remoteBrandSvgDescriptorFromSource(source);
  if (descriptor) {
    return descriptor.renderMode === "mask";
  }
  const svg = decodeSvgDataUrl(source);
  if (!svg || !embeddedSvgBrandColor(source)) {
    return false;
  }
  const match = svg.match(/\sdata-wayleaf-monochrome=(["'])(true|false)\1/i);
  return match ? match[2] === "true" : remoteBrandSvgIsMonochrome(svg);
}

function genericIconTileColors(seed) {
  const hue = Math.abs(hashText(seed || "site")) % 360;
  return {
    light: `hsl(${hue} 42% 92%)`,
    dark: `hsl(${hue} 26% 24%)`
  };
}

function normalizeHexColor(tileColor) {
  const color = String(tileColor || "").trim();
  const match = color.match(/^#([0-9a-f]{6})$/i);
  if (!match) {
    return "";
  }
  return `#${match[1].toLowerCase()}`;
}

function applyIconTile(icon, tileMode, tileColors, hasLocalIcon) {
  icon.dataset.iconTile = tileMode;
  icon.style.setProperty("--site-icon-tile", tileColors.light);
  icon.style.setProperty("--site-icon-tile-light", tileColors.light);
  icon.style.setProperty("--site-icon-tile-dark", tileColors.dark);
  applyIconTileEdge(icon, tileColors);
  icon.classList.toggle("site-icon-local", Boolean(hasLocalIcon));
  applyIconTileToShell(icon, tileMode, tileColors);
}

function applyIconTileEdge(node, tileColors) {
  node.style.setProperty("--site-icon-edge-light", "var(--custom-site-icon-shadow)");
  node.style.setProperty(
    "--site-icon-edge-dark",
    blackishCarrierColor(tileColors.dark) ? "none" : "var(--custom-site-icon-shadow)"
  );
}

function applyIconTileToShell(icon, tileMode, tileColors) {
  const shell = icon.closest(".favorite-icon-shell");
  if (!shell) {
    return;
  }
  shell.dataset.iconTile = tileMode;
  shell.style.setProperty("--site-icon-tile", tileColors.light);
  shell.style.setProperty("--site-icon-tile-light", tileColors.light);
  shell.style.setProperty("--site-icon-tile-dark", tileColors.dark);
  applyIconTileEdge(shell, tileColors);
}

function iconSourceCanUseBitmapTileFusion(source) {
  return Boolean(source)
    && !siteIconSourceLooksLikeSvg(source)
    && !remoteBrandSvgDescriptorFromSource(source);
}

function displayIconSource(icon, source, options = {}) {
  if (icon.dataset.iconTile !== "brand" || !siteIconSourceLooksLikeSvg(source)) {
    return source;
  }
  if (icon.dataset.iconTile === "brand" && !shouldInvertBrandSvg(icon, source)) {
    return source;
  }
  const glyphColor = iconGlyphColorForCurrentTile(icon, source);
  if (!glyphColor) {
    return source;
  }
  if (options.awaitDisplayIcon) {
    return coloredSvgIconSource(source, glyphColor);
  }
  // Zero-delay: when the raw SVG text is already cached, recolor synchronously so the
  // caller sets the final (recolored) src in one tick — no raw-then-recolor swap, and no
  // visual change (same applySvgGlyphColor output as the async path).
  const syncText = isSvgDataUrl(source) ? decodeSvgDataUrl(source) : localSiteIconRawSvgText(source);
  if (syncText) {
    return svgTextDataUrl(applySvgGlyphColor(syncText, glyphColor));
  }
  const requestTheme = document.documentElement.dataset.theme;
  const requestToken = String(Number(icon.dataset.iconThemeRequest || 0) + 1);
  icon.dataset.iconThemeRequest = requestToken;
  coloredSvgIconSource(source, glyphColor).then((displaySource) => {
    const stillRenderingSource = icon.dataset.iconCandidate === source
      || icon.src.endsWith(source)
      || icon.getAttribute("src") === source;
    if (
      stillRenderingSource
      && icon.dataset.iconThemeRequest === requestToken
      && document.documentElement.dataset.theme === requestTheme
    ) {
      icon.src = displaySource;
    }
  });
  return source;
}

// Synchronous tile for a local SVG icon, used by the first-paint reconcile so the
// complete icon (tile + glyph) lands in one tick. Returns null when the analysis
// can't be warmed synchronously (no cached raw text) so callers fall back to async.
function syncLocalIconTile(site, iconPath) {
  const path = String(iconPath || "");
  if (!path.startsWith(`${SITE_ICON_DIRECTORY}/`) || !siteIconSourceLooksLikeSvg(path)) {
    return null;
  }
  if (!localSiteIconRenderModeCache.has(path)) {
    const text = localSiteIconRawSvgText(path);
    if (!text) {
      return null;
    }
    hydrateLocalSiteIconAnalysisFromText(path, text);
  }
  return computeSiteIconTile(site, path);
}

// Synchronous mirror of displayIconSource's decision, called AFTER the tile is applied
// (glyph color reads the just-applied tile var). Returns null when recolor would need a
// fetch (no cached raw text) so the caller can fall back to the async path.
function syncLocalIconFinalSrc(icon, iconPath) {
  const path = String(iconPath || "");
  if (icon.dataset.iconTile !== "brand" || !siteIconSourceLooksLikeSvg(path)) {
    return path;
  }
  if (!shouldInvertBrandSvg(icon, path)) {
    return path;
  }
  const glyphColor = iconGlyphColorForCurrentTile(icon, path);
  if (!glyphColor) {
    return path;
  }
  const text = localSiteIconRawSvgText(path);
  if (!text) {
    return null;
  }
  return svgTextDataUrl(applySvgGlyphColor(text, glyphColor));
}

function currentIconTileColor(icon) {
  if (document.documentElement.dataset.theme === "dark") {
    const darkColor = getComputedStyle(icon).getPropertyValue("--site-icon-tile-dark").trim()
      || icon.style.getPropertyValue("--site-icon-tile-dark").trim();
    if (darkColor) {
      return darkColor;
    }
  }
  const computedColor = getComputedStyle(icon).getPropertyValue("--site-icon-tile").trim();
  return computedColor || icon.style.getPropertyValue("--site-icon-tile").trim();
}

function shouldInvertBrandSvg(icon, source) {
  const siteKey = icon.dataset.siteKey || siteGroupKey(safeUrl(icon.dataset.siteUrl));
  if (keepsBrandIconOriginal(siteKey, source)) {
    return false;
  }
  if (localSiteIconSourceCanLoadBrandColor(source) && !localSiteIconRenderMode(source)) {
    return false;
  }
  const tileColor = siteIconBrandColor(siteKey, source);
  return Boolean(tileColor);
}

function iconGlyphColorForCurrentTile(icon, source = "") {
  const tileColor = normalizeHexColor(currentIconTileColor(icon));
  if (!tileColor) {
    return "";
  }
  const siteKey = icon.dataset.siteKey || siteGroupKey(safeUrl(icon.dataset.siteUrl));
  const brandColor = siteIconBrandColor(siteKey, source);
  if (isSvgDataUrl(source)) {
    return localBrandGlyphColorForTile(tileColor, brandColor);
  }
  if (brandColor) {
    return localBrandGlyphColorForTile(tileColor, brandColor);
  }
  if (iconTileShouldUseOriginalGlyph(tileColor)) {
    return "";
  }
  return readableIconGlyphColor(tileColor);
}

function localBrandGlyphColor(tileColor) {
  return normalizeHexColor(tileColor) ? "#ffffff" : "";
}

function localBrandGlyphColorForTile(tileColor, brandColor = "") {
  const tile = normalizeHexColor(tileColor);
  const brand = normalizeHexColor(brandColor);
  if (!tile) {
    return "";
  }
  if (!brand || tile === brand) {
    return localBrandGlyphColor(tile);
  }
  if (relativeLuminance(tile) < 0.5) {
    return "#ffffff";
  }
  if (contrastRatio(tile, brand) >= BRAND_ICON_VI_CONTRAST_MIN) {
    return brand;
  }
  for (let amount = 0.04; amount < 1; amount += 0.04) {
    const mixed = mixHexColors(brand, BRAND_ICON_LIGHT_MODE_DARK_CARRIER, amount);
    if (contrastRatio(tile, mixed) >= BRAND_ICON_VI_CONTRAST_MIN) {
      return mixed;
    }
  }
  return BRAND_ICON_LIGHT_MODE_DARK_CARRIER;
}

function hexColorStats(tileColor) {
  const color = normalizeHexColor(tileColor);
  if (!color) {
    return null;
  }
  const [red, green, blue] = hexToRgb(color).map((channel) => channel / 255);
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  let hue = 0;
  if (delta) {
    if (max === red) {
      hue = 60 * (((green - blue) / delta) % 6);
    } else if (max === green) {
      hue = 60 * ((blue - red) / delta + 2);
    } else {
      hue = 60 * ((red - green) / delta + 4);
    }
    if (hue < 0) {
      hue += 360;
    }
  }
  return {
    hue,
    luminance: relativeLuminance(color),
    lightContrast: contrastRatio(color, "#ffffff"),
    darkContrast: contrastRatio(color, "#102019")
  };
}

function iconTileShouldUseOriginalGlyph(tileColor) {
  const color = normalizeHexColor(tileColor);
  return !color || contrastRatio(color, "#102019") >= 8;
}

function readableIconGlyphColor(tileColor) {
  const color = normalizeHexColor(tileColor);
  if (!color) {
    return "";
  }
  const darkGlyph = "#102019";
  const lightGlyph = "#ffffff";
  const lightContrast = contrastRatio(color, lightGlyph);
  const darkContrast = contrastRatio(color, darkGlyph);
  return lightContrast >= 3 || lightContrast >= darkContrast ? lightGlyph : darkGlyph;
}

function nearWhiteBrandColor(tileColor) {
  const hex = normalizeHexColor(tileColor);
  if (!hex) {
    return false;
  }
  const red = parseInt(hex.slice(1, 3), 16);
  const green = parseInt(hex.slice(3, 5), 16);
  const blue = parseInt(hex.slice(5, 7), 16);
  const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722;
  const spread = Math.max(red, green, blue) - Math.min(red, green, blue);
  return luminance > 235 && spread < 28;
}


function coloredSvgIconSource(source, glyphColor) {
  const color = normalizeHexColor(glyphColor);
  if (!color) {
    return Promise.resolve(source);
  }
  const cacheKey = `${color}:${source}`;
  if (whiteSvgIconDataUrlCache.has(cacheKey)) {
    return whiteSvgIconDataUrlCache.get(cacheKey);
  }
  const cachedText = isSvgDataUrl(source) ? "" : localSiteIconRawSvgText(source);
  const request = isSvgDataUrl(source)
    ? Promise.resolve(svgTextDataUrl(applySvgGlyphColor(decodeSvgDataUrl(source), color)))
    : cachedText
      ? Promise.resolve(svgTextDataUrl(applySvgGlyphColor(cachedText, color)))
      : fetch(source)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Icon request failed: ${response.status}`);
          }
          return response.text();
        })
        .then((svg) => {
          rememberSiteIconRawSvgText(source, svg);
          return svgTextDataUrl(applySvgGlyphColor(svg, color));
        })
        .catch(() => source);
  whiteSvgIconDataUrlCache.set(cacheKey, request);
  return request;
}

function applySvgGlyphColor(svg, glyphColor, options = {}) {
  const color = normalizeHexColor(glyphColor);
  if (!color) {
    return String(svg || "");
  }
  let output = String(svg || "");
  const replaceColorAttribute = (attributeName, match, quote, value) => {
    if (/^(?:none|transparent)$/i.test(value) || (options.onlyCurrentColor && !/^currentColor$/i.test(value))) {
      return match;
    }
    return ` ${attributeName}=${quote}${color}${quote}`;
  };
  const replaceStyleColor = (match, quote, value) => {
    const nextValue = String(value).replace(/(^|;)(\s*)(fill|stroke|color)(\s*:\s*)([^;]+)/gi, (
      declaration,
      prefix,
      spacing,
      property,
      separator,
      rawValue
    ) => {
      const valueText = String(rawValue || "");
      const important = /\s!important\s*$/i.test(valueText) ? " !important" : "";
      const normalizedValue = valueText.replace(/\s!important\s*$/i, "").trim();
      if (
        /^(?:none|transparent)$/i.test(normalizedValue)
        || (options.onlyCurrentColor && !/^currentColor$/i.test(normalizedValue))
      ) {
        return declaration;
      }
      return `${prefix}${spacing}${property}${separator}${color}${important}`;
    });
    return ` style=${quote}${nextValue}${quote}`;
  };
  output = output.replace(/\sfill=(["'])([^"']*)\1/gi, (match, quote, value) => (
    replaceColorAttribute("fill", match, quote, value)
  ));
  output = output.replace(/\sstroke=(["'])([^"']*)\1/gi, (match, quote, value) => (
    replaceColorAttribute("stroke", match, quote, value)
  ));
  output = output.replace(/\scolor=(["'])([^"']*)\1/gi, (match, quote, value) => (
    replaceColorAttribute("color", match, quote, value)
  ));
  output = output.replace(/\sstyle=(["'])([^"']*)\1/gi, (match, quote, value) => (
    replaceStyleColor(match, quote, value)
  ));
  output = output.replace(/<svg\b([^>]*)>/i, (match, attrs) => (
    /\sfill=/i.test(attrs) ? `<svg${attrs}>` : `<svg${attrs} fill="${color}">`
  ));
  return output;
}

function bindFaviconFallback(icon, site) {
  const candidateToken = icon.dataset.iconCandidate || "";
  icon.addEventListener("error", () => {
    if (!iconStillRenderingCandidate(icon, candidateToken)) {
      return;
    }
    if (forgetMissingLocalSiteIcon(candidateToken)) {
      WayleafIcon.applySiteIcon(icon, site);
      return;
    }
    const requestToken = beginIconRouteRequest(icon, "primary_miss");
    startSecondaryFaviconRoute(icon, site, requestToken);
  }, { once: true });
}

function forgetMissingLocalSiteIcon(candidate) {
  const prefix = `${SITE_ICON_DIRECTORY}/`;
  if (!String(candidate || "").startsWith(prefix)) {
    return false;
  }
  const fileName = candidate.slice(prefix.length).split(/[?#]/)[0];
  if (!fileName || !availableSiteIconFiles.has(fileName)) {
    return false;
  }
  availableSiteIconFiles.delete(fileName);
  return true;
}

function iconStillRenderingCandidate(icon, candidateToken) {
  return icon.isConnected && Boolean(candidateToken) && (icon.dataset.iconCandidate || "") === candidateToken;
}

// Per-site favicon tile memo for the current session. Surfaces like today history show several
// pages of the SAME site at once; sampling each favicon independently is non-deterministic (canvas
// decode timing + floating-point colour bucketing), so the same site could otherwise get different
// tile colours side by side. Resolve the adaptive tile once per site (keyed by theme, since the
// fused bitmap is theme-specific) and reuse it for every later same-site item, so one site always
// reads as one tile — the way the single-card recent view already looked before today history.
const faviconSiteTileMemo = new Map();
const MAX_FAVICON_SITE_TILE_MEMO = 200;

function faviconSiteTileMemoKey(icon) {
  const siteKey = icon.dataset.siteKey || siteGroupKey(safeUrl(icon.dataset.siteUrl)) || "";
  if (!siteKey) {
    return "";
  }
  const mode = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  return `${siteKey}|${mode}`;
}

function restoreFaviconSiteTile(icon) {
  const key = faviconSiteTileMemoKey(icon);
  const entry = key ? faviconSiteTileMemo.get(key) : null;
  if (!entry) {
    return false;
  }
  const hasLocalIcon = icon.classList.contains("site-icon-local");
  applyIconTile(icon, entry.tileMode, entry.tileColors, hasLocalIcon);
  if (entry.fusedSrc) {
    icon.dataset.iconFusedTile = "true";
    icon.src = entry.fusedSrc;
  } else {
    delete icon.dataset.iconFusedTile;
  }
  return true;
}

function rememberFaviconSiteTile(icon, entry) {
  const key = faviconSiteTileMemoKey(icon);
  if (!key || !entry?.tileColors) {
    return;
  }
  faviconSiteTileMemo.set(key, entry);
  if (faviconSiteTileMemo.size > MAX_FAVICON_SITE_TILE_MEMO) {
    faviconSiteTileMemo.delete(faviconSiteTileMemo.keys().next().value);
  }
}

// One deterministic favicon -> tile resolver, replacing the old sync-sample / async-probe split.
// It (1) DECODES the favicon before reading the canvas so the sampled pixels — hence the tile colour
// — are stable (a load event is not a decode), and (2) resolves each site AT MOST ONCE per session
// via an in-flight promise map keyed by siteKey|theme, sharing the settled tile to every same-site
// row through the memo + broadcast in applySampledFaviconTile. The colour maths it feeds are
// untouched, so the rendered tile for a given favicon is byte-identical to before — just stable.
const faviconTileResolveInFlight = new Map();

function applyFaviconMatchedTile(icon, options = {}) {
  const candidateToken = icon.dataset.iconCandidate || "";
  if (!iconSourceCanUseBitmapTileFusion(candidateToken)
    || (icon.dataset.iconTile !== "plain" && icon.dataset.iconTile !== "brand")) {
    return;
  }
  // Same site already resolved this session -> reuse its tile instead of resampling. This is what
  // keeps every "CloudFox" / "Kedaya" row identical rather than each sampling its own colour.
  if (restoreFaviconSiteTile(icon)) {
    cacheRenderedSiteIconFromContext(icon);
    return;
  }
  const sampleOptions = {
    ...options,
    adaptiveFaviconCarrier: icon.dataset.iconTile === "plain" && !icon.classList.contains("site-icon-local")
  };
  // Gate caching of the provisional generic tile until the sampled tile settles: cacheRenderedSiteIcon
  // skips while iconDefaultProbe is "pending", so a load-time cache write cannot capture the pre-sample tile.
  icon.dataset.iconDefaultProbe = "pending";
  resolveFaviconTile(icon, candidateToken, sampleOptions);
}

function resolveFaviconTile(icon, candidateToken, options = {}) {
  const inFlightKey = faviconSiteTileMemoKey(icon);
  const inFlight = inFlightKey ? faviconTileResolveInFlight.get(inFlightKey) : null;
  if (inFlight) {
    // Another row of this site is already sampling — wait for its result and reuse it rather than
    // decode+sample a second bitmap in parallel (which is where the same site drifted to two colours).
    inFlight.then(() => {
      delete icon.dataset.iconDefaultProbe;
      if (iconStillRenderingCandidate(icon, candidateToken) && restoreFaviconSiteTile(icon)) {
        cacheRenderedSiteIconFromContext(icon);
      }
    });
    return;
  }
  const run = decodedFaviconSample(icon).then((sample) => {
    delete icon.dataset.iconDefaultProbe;
    if (!iconStillRenderingCandidate(icon, candidateToken)) {
      return;
    }
    if (sample) {
      applyFaviconSampleDecision(icon, sample, options);
      return;
    }
    resolveUnreadableFaviconCandidate(icon, options);
  }).catch(() => {
    delete icon.dataset.iconDefaultProbe;
    if (iconStillRenderingCandidate(icon, candidateToken)) {
      resolveUnreadableFaviconCandidate(icon, options);
    }
  });
  if (inFlightKey) {
    faviconTileResolveInFlight.set(inFlightKey, run);
    run.finally(() => {
      if (faviconTileResolveInFlight.get(inFlightKey) === run) {
        faviconTileResolveInFlight.delete(inFlightKey);
      }
    });
  }
}

async function decodedFaviconSample(icon) {
  // A load event is not a decode: drawing an undecoded bitmap to the canvas yields unstable pixels,
  // so the same favicon could sample to different colours run to run. Decode first, then read once.
  try {
    if (typeof icon.decode === "function") {
      await icon.decode();
    }
  } catch {
    // decode() rejects on a broken image; the canvas read below returns null and we fall through.
  }
  const sample = sampleFaviconImageData(icon);
  if (sample) {
    return sample;
  }
  // The synchronous read failed (cross-origin taint on the Chrome _favicon image). Re-fetch the bytes
  // and decode through ImageBitmap, which is always readable. Only Chrome _favicon sources are
  // re-fetched — the same scope the old probe used.
  const candidate = icon.dataset.iconCandidate || icon.currentSrc || icon.src || "";
  if (!faviconCandidateIsChromeFavicon(candidate)) {
    return null;
  }
  return sampleFaviconImageDataFromUrl(icon.currentSrc || icon.src || candidate);
}

function resolveUnreadableFaviconCandidate(icon, options = {}) {
  // The favicon could not be read even via the fetch path. Reproduce the old probe's terminal
  // decisions: trusted declared icons keep what they have; a Chrome default globe is replaced by a
  // discovered declared icon or the generic tile.
  if (options.trustSiteIcon
    || !faviconCandidateIsChromeFavicon(icon.dataset.iconCandidate || icon.currentSrc || icon.src)) {
    return;
  }
  icon.dataset.iconDefaultProbe = "unreadable";
  if (options.skipDefaultFaviconDiscovery) {
    applyGenericFallbackSiteIcon(icon);
    return;
  }
  rescueDefaultFaviconWithDeclaredIcon(icon);
}

function applyFaviconSampleDecision(icon, sample, options = {}) {
  if (faviconSampleLooksLikeBrowserDefault(sample)) {
    if (options.trustSiteIcon) {
      const color = dominantFaviconSampleBackgroundColor(sample, options);
      const tileColors = color?.confidence ? faviconMatchedTileColors(color, options) : null;
      if (tileColors) {
        applySampledFaviconTile(icon, sample, color, tileColors, options);
        cacheRenderedSiteIconFromContext(icon);
      } else if (options.adaptiveFaviconCarrier) {
        applyGenericFallbackSiteIcon(icon);
      }
      return;
    }
    if (options.skipDefaultFaviconDiscovery) {
      applyGenericFallbackSiteIcon(icon);
    } else {
      rescueDefaultFaviconWithDeclaredIcon(icon);
    }
    return;
  }
  const color = dominantFaviconSampleBackgroundColor(sample, options);
  if (!color || !color.confidence) {
    return;
  }
  const tileColors = faviconMatchedTileColors(color, options);
  if (!tileColors) {
    if (options.adaptiveFaviconCarrier) {
      applyGenericFallbackSiteIcon(icon);
    }
    return;
  }
  applySampledFaviconTile(icon, sample, color, tileColors, options);
  cacheRenderedSiteIconFromContext(icon);
}

function applySampledFaviconTile(icon, sample, color, tileColors, options = {}) {
  const tileMode = icon.dataset.iconTile === "brand" ? "brand" : "plain";
  const hasLocalIcon = icon.classList.contains("site-icon-local");
  applyIconTile(icon, tileMode, tileColors, hasLocalIcon);
  fuseEmbeddedFaviconTile(icon, sample, color, tileColors, options);
  // Publish this site's settled tile so other same-site rows reuse it verbatim: memo for rows that
  // render later, live broadcast for rows already on screen that resolved (or are resolving) in
  // parallel. Together they guarantee every visible row of one site reads as one tile — even when
  // decode timing sends siblings down independent async sampling paths.
  const entry = {
    tileMode,
    tileColors,
    fusedSrc: icon.dataset.iconFusedTile === "true" ? (icon.getAttribute("src") || "") : ""
  };
  rememberFaviconSiteTile(icon, entry);
  broadcastFaviconSiteTile(icon, entry);
}

function broadcastFaviconSiteTile(sourceIcon, entry) {
  const siteKey = sourceIcon.dataset.siteKey || siteGroupKey(safeUrl(sourceIcon.dataset.siteUrl));
  if (!siteKey || !entry?.tileColors) {
    return;
  }
  document.querySelectorAll("img[data-site-url]").forEach((sibling) => {
    if (sibling === sourceIcon
      || sibling.classList.contains("site-icon-local")
      || sibling.classList.contains("site-icon-generic-fallback")
      || (sibling.dataset.iconTile !== "plain" && sibling.dataset.iconTile !== "brand")) {
      return;
    }
    const siblingKey = sibling.dataset.siteKey || siteGroupKey(safeUrl(sibling.dataset.siteUrl));
    if (siblingKey !== siteKey) {
      return;
    }
    applyIconTile(sibling, entry.tileMode, entry.tileColors, false);
    if (entry.fusedSrc) {
      sibling.dataset.iconFusedTile = "true";
      if (sibling.getAttribute("src") !== entry.fusedSrc) {
        sibling.src = entry.fusedSrc;
      }
    }
    cacheRenderedSiteIconFromContext(sibling);
  });
}

function fuseEmbeddedFaviconTile(icon, sample, color, tileColors, options = {}) {
  const tileColor = document.documentElement.dataset.theme === "dark"
    ? tileColors.dark
    : tileColors.light;
  if (!faviconShouldFuseEmbeddedTile(color, tileColor, options)) {
    delete icon.dataset.iconFusedTile;
    return;
  }
  const fused = fusedEmbeddedFaviconPixelData(
    sample,
    tileColor,
    rgbChannelsToHex(color.red, color.green, color.blue),
    faviconFusionDistances(color, options)
  );
  if (!fused) {
    delete icon.dataset.iconFusedTile;
    return;
  }
  const canvas = document.createElement("canvas");
  canvas.width = fused.size;
  canvas.height = fused.size;
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }
  context.putImageData(new ImageData(fused.data, fused.size, fused.size), 0, 0);
  icon.dataset.iconFusedTile = "true";
  icon.src = canvas.toDataURL("image/png");
}

function faviconCandidateIsChromeFavicon(value) {
  const text = String(value || "");
  return text.includes("/_favicon/") || text.includes("_favicon/?");
}

function rescueDefaultFaviconWithDeclaredIcon(icon) {
  const siteUrl = icon.dataset.siteUrl || "";
  const parsedUrl = safeUrl(siteUrl);
  if (!parsedUrl) {
    applyGenericFallbackSiteIcon(icon);
    return;
  }
  const candidateToken = icon.dataset.iconCandidate || icon.currentSrc || icon.src || "";
  if (icon.dataset.iconDefaultRescue === "pending") {
    return;
  }
  icon.dataset.iconDefaultRescue = "pending";
  const timeoutId = window.setTimeout(() => {
    if (!iconStillRenderingCandidate(icon, candidateToken)) {
      return;
    }
    applyGenericFallbackSiteIcon(icon, parsedUrl.hostname);
    icon.dataset.iconDefaultRescue = "timed-out";
    icon.dataset.iconDefaultRescueCandidate = candidateToken;
  }, SITE_ICON_DEFAULT_RESCUE_TIMEOUT_MS);
  discoverSiteIconCandidateEntries(parsedUrl.href).then((candidates) => {
    window.clearTimeout(timeoutId);
    if (!iconRescueCanStillApply(icon, candidateToken)) {
      return;
    }
    const usableCandidates = candidates.filter((candidate) => candidate?.url && candidate.url !== candidateToken);
    if (!usableCandidates.length) {
      applyGenericFallbackSiteIcon(icon, parsedUrl.hostname);
      return;
    }
    applyDiscoveredSiteFaviconCandidates(icon, usableCandidates, parsedUrl.hostname, candidateToken);
  }).catch(() => {
    window.clearTimeout(timeoutId);
    if (!iconRescueCanStillApply(icon, candidateToken)) {
      return;
    }
    applyGenericFallbackSiteIcon(icon, parsedUrl.hostname);
  });
}

function applyDiscoveredSiteFaviconCandidates(icon, candidates = [], seed = "", rescueCandidateToken = "") {
  const [candidate, ...remainingCandidates] = candidates.filter((entry) => entry?.url);
  const candidateUrl = candidate?.url || "";
  if (!candidateUrl) {
    applyGenericFallbackSiteIcon(icon, seed);
    return;
  }
  fetchImageDataUrl(candidateUrl).then((iconDataUrl) => {
    if (!iconRescueCanStillApply(icon, rescueCandidateToken)) {
      return;
    }
    if (!iconDataUrl || iconDataUrl === rescueCandidateToken) {
      applyDiscoveredSiteFaviconCandidates(icon, remainingCandidates, seed, rescueCandidateToken);
      return;
    }
    applyDiscoveredSiteFavicon(icon, iconDataUrl, seed, {
      candidateSource: candidate.source || "url",
      fallbackCandidates: remainingCandidates,
      rescueCandidateToken
    });
  }).catch(() => {
    if (iconRescueCanStillApply(icon, rescueCandidateToken)) {
      applyDiscoveredSiteFaviconCandidates(icon, remainingCandidates, seed, rescueCandidateToken);
    }
  });
}

function iconRescueCanStillApply(icon, candidateToken) {
  if (iconStillRenderingCandidate(icon, candidateToken)) {
    return true;
  }
  return icon.isConnected
    && (icon.dataset.iconCandidate || "") === GENERIC_SITE_FALLBACK_ICON
    && (icon.dataset.iconDefaultRescueCandidate || "") === candidateToken;
}

function applyDiscoveredSiteFavicon(icon, iconDataUrl, seed = "", options = {}) {
  icon.removeAttribute("srcset");
  icon.dataset.iconMissing = "false";
  icon.dataset.iconCandidate = iconDataUrl;
  icon.dataset.iconSource = iconDataUrl;
  icon.dataset.iconDefaultRescue = "resolved";
  delete icon.dataset.iconDefaultRescueCandidate;
  delete icon.dataset.iconDefaultProbe;
  icon.classList.remove("site-icon-generic-fallback");
  applyIconTile(icon, "plain", genericIconTileColors(seed), false);
  icon.addEventListener("load", () => {
    if (iconStillRenderingCandidate(icon, iconDataUrl)) {
      if (faviconElementLooksLikeBrowserDefault(icon) && !trustedDeclaredSiteIconSource(options.candidateSource)) {
        applyDiscoveredSiteFaviconCandidates(
          icon,
          options.fallbackCandidates,
          seed,
          options.rescueCandidateToken
        );
        return;
      }
      applyFaviconMatchedTile(icon, {
        skipDefaultFaviconDiscovery: true,
        trustSiteIcon: trustedDeclaredSiteIconSource(options.candidateSource)
      });
      cacheRenderedDiscoveredSiteIcon(icon, iconDataUrl);
    }
  }, { once: true });
  icon.addEventListener("error", () => {
    if (iconStillRenderingCandidate(icon, iconDataUrl)) {
      applyDiscoveredSiteFaviconCandidates(
        icon,
        options.fallbackCandidates,
        seed,
        options.rescueCandidateToken
      );
    }
  }, { once: true });
  icon.src = iconDataUrl;
}

function trustedDeclaredSiteIconSource(source) {
  return source === "document" || source === "manifest";
}

function faviconElementLooksLikeBrowserDefault(icon) {
  const sample = sampleFaviconImageData(icon);
  return Boolean(sample && faviconSampleLooksLikeBrowserDefault(sample));
}

function faviconSampleLooksLikeBrowserDefault(sample) {
  return faviconImageDataLooksLikeBrowserDefault(sample.data, sample.size)
    || faviconImageDataLooksLikeEmbeddedBrowserDefault(sample.data, sample.size)
    || faviconImageDataLooksLikeNeutralBrowserFallbackGlyph(sample.data, sample.size);
}

function cacheRenderedDiscoveredSiteIcon(icon, iconDataUrl) {
  const siteKey = icon.dataset.siteKey || siteGroupKey(safeUrl(icon.dataset.siteUrl));
  if (siteKey && normalizeStoredSiteIcon(iconDataUrl)) {
    cacheSiteIcon(siteKey, iconDataUrl).catch(() => {});
  }
}

function dominantFaviconSampleBackgroundColor(sample, options = {}) {
  return selectFaviconBackgroundCandidate(analyzeFaviconImageColors(sample.data, sample.size), sample.size, options);
}

function sampleFaviconImageData(image) {
  if (!image.naturalWidth || !image.naturalHeight) {
    return null;
  }
  const canvas = document.createElement("canvas");
  const size = FAVICON_BACKGROUND_SAMPLE_SIZE;
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    return null;
  }
  try {
    context.drawImage(image, 0, 0, size, size);
    const { data } = context.getImageData(0, 0, size, size);
    return { data, size };
  } catch {
    return null;
  }
}

async function sampleFaviconImageDataFromUrl(url) {
  const text = String(url || "");
  if (!text) {
    return null;
  }
  const response = await fetch(text, { cache: "force-cache" });
  if (!response.ok) {
    return null;
  }
  const blob = await response.blob();
  if (!blob || (blob.type && !String(blob.type).startsWith("image/"))) {
    return null;
  }
  const bitmap = await createImageBitmap(blob);
  try {
    const canvas = document.createElement("canvas");
    const size = FAVICON_BACKGROUND_SAMPLE_SIZE;
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {
      return null;
    }
    context.drawImage(bitmap, 0, 0, size, size);
    const { data } = context.getImageData(0, 0, size, size);
    return { data, size };
  } finally {
    bitmap.close?.();
  }
}

function faviconImageDataLooksLikeBrowserDefault(data, size) {
  let opaqueWeight = 0;
  let neutralWeight = 0;
  let colorWeight = 0;
  let edgeWeight = 0;
  let edgeSampleWeight = 0;
  let red = 0;
  let green = 0;
  let blue = 0;
  let minX = size;
  let minY = size;
  let maxX = -1;
  let maxY = -1;
  for (let index = 0; index < data.length; index += 4) {
    const pixelIndex = index / 4;
    const x = pixelIndex % size;
    const y = Math.floor(pixelIndex / size);
    const edgeSample = iconDefaultFaviconEdgeSampleWeight(x, y, size);
    edgeSampleWeight += edgeSample;
    const alpha = data[index + 3] / 255;
    if (alpha < FAVICON_BACKGROUND_ALPHA_MIN) {
      continue;
    }
    const pixelRed = data[index];
    const pixelGreen = data[index + 1];
    const pixelBlue = data[index + 2];
    const weight = alpha;
    const spread = colorChannelSpread(pixelRed, pixelGreen, pixelBlue);
    const saturation = spread / Math.max(1, pixelRed, pixelGreen, pixelBlue);
    opaqueWeight += weight;
    edgeWeight += edgeSample * weight;
    red += pixelRed * weight;
    green += pixelGreen * weight;
    blue += pixelBlue * weight;
    if (spread <= 28 || saturation <= 0.16) {
      neutralWeight += weight;
    }
    if (saturation >= 0.24 && spread >= 42) {
      colorWeight += weight;
    }
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  if (!opaqueWeight || maxX < minX || maxY < minY) {
    return false;
  }
  const coverage = opaqueWeight / (size * size);
  if (coverage < DEFAULT_FAVICON_MIN_COVERAGE || coverage > DEFAULT_FAVICON_MAX_COVERAGE) {
    return false;
  }
  const averageRed = red / opaqueWeight;
  const averageGreen = green / opaqueWeight;
  const averageBlue = blue / opaqueWeight;
  const luminance = averageRed * 0.2126 + averageGreen * 0.7152 + averageBlue * 0.0722;
  if (luminance < DEFAULT_FAVICON_MIN_LUMINANCE || luminance > DEFAULT_FAVICON_MAX_LUMINANCE) {
    return false;
  }
  const neutralRatio = neutralWeight / opaqueWeight;
  const colorRatio = colorWeight / opaqueWeight;
  if (neutralRatio < DEFAULT_FAVICON_MIN_NEUTRAL_RATIO || colorRatio > DEFAULT_FAVICON_MAX_COLOR_RATIO) {
    return false;
  }
  const bounds = { minX, minY, maxX, maxY };
  const width = maxX - minX + 1;
  const height = maxY - minY + 1;
  const minSpan = Math.min(width / size, height / size);
  const maxSpan = Math.max(width / size, height / size);
  if (minSpan < 0.42 || maxSpan > 0.9 || !faviconCandidateSpansCenter(bounds, size)) {
    return false;
  }
  const edgeOpacity = edgeWeight / Math.max(1, edgeSampleWeight);
  return edgeOpacity <= DEFAULT_FAVICON_MAX_EDGE_OPACITY;
}

function faviconImageDataLooksLikeEmbeddedBrowserDefault(data, size) {
  let opaqueWeight = 0;
  let coloredWeight = 0;
  let neutralWeight = 0;
  let edgeWeight = 0;
  let edgeSampleWeight = 0;
  let red = 0;
  let green = 0;
  let blue = 0;
  let minX = size;
  let minY = size;
  let maxX = -1;
  let maxY = -1;
  for (let index = 0; index < data.length; index += 4) {
    const pixelIndex = index / 4;
    const x = pixelIndex % size;
    const y = Math.floor(pixelIndex / size);
    const edgeSample = iconDefaultFaviconEdgeSampleWeight(x, y, size);
    edgeSampleWeight += edgeSample;
    const alpha = data[index + 3] / 255;
    if (alpha < FAVICON_BACKGROUND_ALPHA_MIN) {
      continue;
    }
    const pixelRed = data[index];
    const pixelGreen = data[index + 1];
    const pixelBlue = data[index + 2];
    const weight = alpha;
    const saturation = colorSaturation(pixelRed, pixelGreen, pixelBlue);
    const luminance = colorLuminance(pixelRed, pixelGreen, pixelBlue);
    opaqueWeight += weight;
    if (saturation >= 0.22 && colorChannelSpread(pixelRed, pixelGreen, pixelBlue) >= 36) {
      coloredWeight += weight;
    }
    if (
      saturation <= 0.18
      && luminance >= DEFAULT_FAVICON_MIN_LUMINANCE
      && luminance <= DEFAULT_FAVICON_MAX_LUMINANCE
    ) {
      neutralWeight += weight;
      edgeWeight += edgeSample * weight;
      red += pixelRed * weight;
      green += pixelGreen * weight;
      blue += pixelBlue * weight;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  if (!opaqueWeight || !neutralWeight || maxX < minX || maxY < minY) {
    return false;
  }
  const opaqueCoverage = opaqueWeight / (size * size);
  const neutralCoverage = neutralWeight / (size * size);
  if (
    opaqueCoverage < 0.58
    || neutralCoverage < DEFAULT_FAVICON_EMBEDDED_MIN_COVERAGE
    || neutralCoverage > DEFAULT_FAVICON_EMBEDDED_MAX_COVERAGE
  ) {
    return false;
  }
  if (coloredWeight / opaqueWeight < 0.18) {
    return false;
  }
  const averageRed = red / neutralWeight;
  const averageGreen = green / neutralWeight;
  const averageBlue = blue / neutralWeight;
  const averageSaturation = colorSaturation(averageRed, averageGreen, averageBlue);
  if (averageSaturation > 0.14) {
    return false;
  }
  const bounds = { minX, minY, maxX, maxY };
  const width = maxX - minX + 1;
  const height = maxY - minY + 1;
  const minSpan = Math.min(width / size, height / size);
  const maxSpan = Math.max(width / size, height / size);
  if (minSpan < 0.42 || maxSpan > 0.9 || !faviconCandidateSpansCenter(bounds, size)) {
    return false;
  }
  const edgeOpacity = edgeWeight / Math.max(1, edgeSampleWeight);
  return edgeOpacity <= DEFAULT_FAVICON_EMBEDDED_MAX_EDGE_OPACITY;
}

function faviconImageDataLooksLikeNeutralBrowserFallbackGlyph(data, size) {
  let opaqueWeight = 0;
  let neutralWeight = 0;
  let colorWeight = 0;
  let edgeWeight = 0;
  let edgeSampleWeight = 0;
  let red = 0;
  let green = 0;
  let blue = 0;
  let minX = size;
  let minY = size;
  let maxX = -1;
  let maxY = -1;
  for (let index = 0; index < data.length; index += 4) {
    const pixelIndex = index / 4;
    const x = pixelIndex % size;
    const y = Math.floor(pixelIndex / size);
    const edgeSample = iconDefaultFaviconEdgeSampleWeight(x, y, size);
    edgeSampleWeight += edgeSample;
    const alpha = data[index + 3] / 255;
    if (alpha < FAVICON_BACKGROUND_ALPHA_MIN) {
      continue;
    }
    const pixelRed = data[index];
    const pixelGreen = data[index + 1];
    const pixelBlue = data[index + 2];
    const weight = alpha;
    const spread = colorChannelSpread(pixelRed, pixelGreen, pixelBlue);
    const saturation = colorSaturation(pixelRed, pixelGreen, pixelBlue);
    const luminance = colorLuminance(pixelRed, pixelGreen, pixelBlue);
    opaqueWeight += weight;
    edgeWeight += edgeSample * weight;
    red += pixelRed * weight;
    green += pixelGreen * weight;
    blue += pixelBlue * weight;
    if (spread <= 34 || saturation <= 0.2) {
      neutralWeight += weight;
    }
    if (saturation >= 0.24 && spread >= 42) {
      colorWeight += weight;
    }
    if (luminance >= 24 && luminance <= 210) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  if (!opaqueWeight || maxX < minX || maxY < minY) {
    return false;
  }
  const coverage = opaqueWeight / (size * size);
  if (
    coverage < DEFAULT_FAVICON_NEUTRAL_GLYPH_MIN_COVERAGE
    || coverage > DEFAULT_FAVICON_NEUTRAL_GLYPH_MAX_COVERAGE
  ) {
    return false;
  }
  const averageRed = red / opaqueWeight;
  const averageGreen = green / opaqueWeight;
  const averageBlue = blue / opaqueWeight;
  const luminance = colorLuminance(averageRed, averageGreen, averageBlue);
  if (luminance < DEFAULT_FAVICON_MIN_LUMINANCE || luminance > DEFAULT_FAVICON_MAX_LUMINANCE) {
    return false;
  }
  const neutralRatio = neutralWeight / opaqueWeight;
  const colorRatio = colorWeight / opaqueWeight;
  if (
    neutralRatio < DEFAULT_FAVICON_NEUTRAL_GLYPH_MIN_NEUTRAL_RATIO
    || colorRatio > DEFAULT_FAVICON_NEUTRAL_GLYPH_MAX_COLOR_RATIO
  ) {
    return false;
  }
  const bounds = { minX, minY, maxX, maxY };
  const width = maxX - minX + 1;
  const height = maxY - minY + 1;
  const minSpan = Math.min(width / size, height / size);
  const maxSpan = Math.max(width / size, height / size);
  if (minSpan < 0.34 || maxSpan > 0.92 || !faviconCandidateSpansCenter(bounds, size)) {
    return false;
  }
  const edgeOpacity = edgeWeight / Math.max(1, edgeSampleWeight);
  return edgeOpacity <= DEFAULT_FAVICON_NEUTRAL_GLYPH_MAX_EDGE_OPACITY;
}

function iconDefaultFaviconEdgeSampleWeight(x, y, size) {
  const edgeDistance = Math.min(x, y, size - 1 - x, size - 1 - y);
  return edgeDistance <= 2 ? 1 : 0;
}

function colorChannelSpread(red, green, blue) {
  return Math.max(red, green, blue) - Math.min(red, green, blue);
}

function colorSaturation(red, green, blue) {
  return colorChannelSpread(red, green, blue) / Math.max(1, red, green, blue);
}

function colorLuminance(red, green, blue) {
  return red * 0.2126 + green * 0.7152 + blue * 0.0722;
}

function analyzeFaviconImageColors(data, size) {
  const pixels = [];
  const buckets = new Map();
  let edgeSampleWeight = 0;
  let opaqueWeight = 0;
  for (let index = 0; index < data.length; index += 4) {
    const pixelIndex = index / 4;
    const x = pixelIndex % size;
    const y = Math.floor(pixelIndex / size);
    const edgeWeight = iconBackgroundSampleWeight(x, y, size);
    edgeSampleWeight += edgeWeight;
    const alpha = data[index + 3] / 255;
    if (alpha < FAVICON_BACKGROUND_ALPHA_MIN) {
      continue;
    }
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    opaqueWeight += alpha;
    const pixel = {
      x,
      y,
      red,
      green,
      blue,
      weight: alpha,
      edgeWeight: alpha * edgeWeight
    };
    pixels.push(pixel);
    const bucketKey = faviconColorBucketKey(red, green, blue);
    const bucket = buckets.get(bucketKey) || {
      red: 0,
      green: 0,
      blue: 0,
      weight: 0
    };
    bucket.red += red * alpha;
    bucket.green += green * alpha;
    bucket.blue += blue * alpha;
    bucket.weight += alpha;
    buckets.set(bucketKey, bucket);
  }
  return {
    pixels,
    buckets,
    totalWeight: size * size,
    opaqueWeight,
    edgeSampleWeight
  };
}

function selectFaviconBackgroundCandidate(analysis, size, options = {}) {
  if (!analysis.pixels.length || !analysis.buckets.size) {
    return null;
  }
  const unframedGlyph = Boolean(
    options.adaptiveFaviconCarrier && faviconAnalysisLooksLikeUnframedGlyph(analysis, size)
  );
  const baseBuckets = [...analysis.buckets.values()]
    .filter((bucket) => bucket.weight)
    .map(faviconAverageColorBucket)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 14);
  const candidates = baseBuckets
    .map((bucket) => faviconBackgroundCandidateFromBucket(bucket, analysis, size))
    .filter(Boolean)
    .map((candidate) => ({
      ...candidate,
      unframedGlyph,
      compactEmblem: Boolean(
        options.adaptiveFaviconCarrier && faviconCandidateLooksLikeCompactEmblem(candidate, analysis, size)
      )
    }))
    .sort((a, b) => b.score - a.score || b.confidence - a.confidence);
  const candidate = (options.adaptiveFaviconCarrier ? faviconPreferredSelfContainedTileCandidate(candidates, analysis, size) : null)
    || ((candidates[0]?.confidence || 0) >= FAVICON_BACKGROUND_CONFIDENCE_MIN
    ? candidates[0]
    : faviconTransparentGlyphCandidateFromBucket(baseBuckets[0], analysis, size)
      || (options.adaptiveFaviconCarrier ? faviconTransparentGlyphCandidateFromAnalysis(analysis, size) : null));
  if (!candidate?.confidence) {
    return null;
  }
  const matchMode = candidate.compactEmblem
    ? "full-surface"
    : candidate.preferredSelfContainedTile ? "embedded-tile" : faviconBackgroundMatchMode(candidate);
  const selectedColor = matchMode === "embedded-tile"
    ? {
      red: Math.round(candidate.red),
      green: Math.round(candidate.green),
      blue: Math.round(candidate.blue)
    }
    : {
      red: Math.round(candidate.carrierRed ?? candidate.red),
      green: Math.round(candidate.carrierGreen ?? candidate.green),
      blue: Math.round(candidate.carrierBlue ?? candidate.blue)
    };
  const selected = {
    ...selectedColor,
    paletteRed: Math.round(candidate.red),
    paletteGreen: Math.round(candidate.green),
    paletteBlue: Math.round(candidate.blue),
    confidence: candidate.confidence,
    coverage: candidate.coverage,
    opaqueCoverage: analysis.opaqueWeight / analysis.totalWeight,
    edgeConfidence: candidate.edgeConfidence,
    innerTileConfidence: candidate.innerTileConfidence,
    ownTileShapeConfidence: candidate.ownTileShapeConfidence,
    ownTileCornerStyle: candidate.ownTileCornerStyle,
    unframedGlyph: Boolean(candidate.unframedGlyph),
    compactEmblem: Boolean(candidate.compactEmblem),
    preferredSelfContainedTile: Boolean(candidate.preferredSelfContainedTile),
    matchMode,
    foreground: faviconForegroundStatsForCandidate(selectedColor, analysis, size),
    paperSurface: faviconPaperSurfaceStats(analysis, size)
  };
  return selected;
}

function faviconPreferredSelfContainedTileCandidate(candidates, analysis, size) {
  const analysisTileShape = faviconAnalysisOwnTileShape(analysis, size);
  const opaqueCoverage = analysis.opaqueWeight / Math.max(1, analysis.totalWeight);
  const candidate = candidates.map((item) => {
    const candidateOpaqueRatio = (item.coverage || 0)
      / Math.max(0.001, opaqueCoverage);
    const tileShape = opaqueCoverage >= 0.42
      && analysisTileShape.confidence >= 0.42
      && candidateOpaqueRatio >= 0.28
      ? analysisTileShape
      : {
        confidence: item.ownTileShapeConfidence || 0,
        cornerStyle: item.ownTileCornerStyle || ""
      };
    return {
      ...item,
      ownTileShapeConfidence: tileShape.confidence,
      ownTileCornerStyle: tileShape.cornerStyle
    };
  }).find((item) => {
    const tileColor = rgbChannelsToHex(item.red, item.green, item.blue);
    const foreground = faviconForegroundStatsForCandidate({
      red: Math.round(item.red),
      green: Math.round(item.green),
      blue: Math.round(item.blue)
    }, analysis, size);
    return (item.ownTileShapeConfidence || 0) >= 0.42
      && !item.compactEmblem
      && !faviconCarrierLooksNeutralPaperLike(tileColor)
      && (!faviconAnalysisHasDominantPaperInset(analysis, size)
        || (item.edgeConfidence || 0) <= FAVICON_EMBEDDED_TILE_EDGE_CONFIDENCE_MAX)
      && (foreground.coverage || 0) >= FAVICON_LOW_CONTRAST_FOREGROUND_COVERAGE_MIN
      && (foreground.span || 0) >= 0.18
      && (foreground.maxContrast || 0) > FAVICON_LOW_CONTRAST_PEAK_MAX
      && !faviconCandidateLooksLikeSameHueFullSurfaceArtwork(item, foreground, tileColor, analysis, size);
  });
  return candidate
    ? {
      ...candidate,
      preferredSelfContainedTile: true,
      confidence: Math.max(candidate.confidence, FAVICON_BACKGROUND_CONFIDENCE_MIN)
    }
    : null;
}

function faviconAnalysisOwnTileShape(analysis, size) {
  if (!analysis?.pixels?.length) {
    return { confidence: 0, cornerStyle: "" };
  }
  const bounds = analysis.pixels.reduce((result, pixel) => ({
    minX: Math.min(result.minX, pixel.x),
    minY: Math.min(result.minY, pixel.y),
    maxX: Math.max(result.maxX, pixel.x),
    maxY: Math.max(result.maxY, pixel.y)
  }), { minX: size, minY: size, maxX: -1, maxY: -1 });
  return faviconOwnTileShapeSupport(
    analysis.pixels,
    bounds,
    size,
    analysis.opaqueWeight / Math.max(1, analysis.totalWeight)
  );
}

function faviconAnalysisLooksLikeUnframedGlyph(analysis, size) {
  const opaqueCoverage = analysis.opaqueWeight / Math.max(1, analysis.totalWeight);
  const bounds = analysis.pixels.reduce((result, pixel) => ({
    minX: Math.min(result.minX, pixel.x),
    minY: Math.min(result.minY, pixel.y),
    maxX: Math.max(result.maxX, pixel.x),
    maxY: Math.max(result.maxY, pixel.y)
  }), { minX: size, minY: size, maxX: -1, maxY: -1 });
  const width = Math.max(0, bounds.maxX - bounds.minX + 1);
  const height = Math.max(0, bounds.maxY - bounds.minY + 1);
  const density = analysis.opaqueWeight / Math.max(1, width * height);
  return opaqueCoverage >= FAVICON_TRANSPARENT_GLYPH_COVERAGE_MIN
    && opaqueCoverage <= FAVICON_TRANSPARENT_GLYPH_COVERAGE_MAX
    && (density < 0.78 || faviconAnalysisOwnTileShape(analysis, size).confidence < 0.42);
}

function faviconCandidateLooksLikeCompactEmblem(candidate, analysis, size) {
  const bounds = analysis.pixels.reduce((result, pixel) => ({
    minX: Math.min(result.minX, pixel.x),
    minY: Math.min(result.minY, pixel.y),
    maxX: Math.max(result.maxX, pixel.x),
    maxY: Math.max(result.maxY, pixel.y)
  }), { minX: size, minY: size, maxX: -1, maxY: -1 });
  if (bounds.maxX < bounds.minX || bounds.maxY < bounds.minY) {
    return false;
  }
  const width = bounds.maxX - bounds.minX + 1;
  const height = bounds.maxY - bounds.minY + 1;
  const minSpan = Math.min(width, height) / size;
  const aspectRatio = Math.min(width, height) / Math.max(width, height);
  const density = analysis.opaqueWeight / Math.max(1, width * height);
  const cornerStyle = candidate.ownTileCornerStyle || faviconAnalysisOwnTileShape(analysis, size).cornerStyle;
  if (cornerStyle !== "rounded" && cornerStyle !== "circle") {
    return false;
  }
  const emblemGeometry = minSpan >= 0.62
    && aspectRatio >= 0.85
    && density >= 0.5
    && density <= 0.86;
  if (cornerStyle === "circle") {
    // A saturated disc is its own colored tile and should fuse with a matching carrier;
    // only a neutral/low-saturation disc reads as a paper emblem needing a generated carrier.
    return emblemGeometry
      && colorSaturation(candidate.red, candidate.green, candidate.blue) <= 0.22;
  }
  return emblemGeometry;
}

function faviconCandidateLooksLikeSameHueFullSurfaceArtwork(candidate, foreground, tileColor, analysis, size) {
  const [red, green, blue] = hexToRgb(tileColor);
  return blue >= red + 24
    && (blue >= green || green >= red + 20)
    && candidate.ownTileCornerStyle === "straight"
    && ((analysis?.opaqueWeight || 0) / Math.max(1, analysis?.totalWeight || 1)) >= 0.82
    && (faviconPaperSurfaceStats(analysis, size).coverage || 0) < 0.08
    && faviconPaletteLooksLikeBlueGradientArtwork([
      tileColor,
      ...(foreground.colors || []),
      ...faviconAnalysisPaletteColors(analysis)
    ]);
}

function faviconAnalysisPaletteColors(analysis) {
  return [...(analysis?.buckets?.values?.() || [])]
    .filter((bucket) => bucket.weight)
    .map(faviconAverageColorBucket)
    .sort((first, second) => second.weight - first.weight)
    .slice(0, 8)
    .map((bucket) => rgbChannelsToHex(bucket.red, bucket.green, bucket.blue));
}

function faviconAnalysisHasDominantPaperInset(analysis, size) {
  const surface = faviconPaperSurfaceStats(analysis, size);
  if (
    (surface.coverage || 0) < 0.28
    || (surface.span || 0) < 0.5
    || !surface.spansCenter
  ) {
    return false;
  }
  const coreMin = Math.floor(size * 0.25);
  const coreMax = Math.ceil(size * 0.75) - 1;
  let paperWeight = 0;
  let totalWeight = 0;
  for (const pixel of analysis.pixels) {
    if (pixel.x < coreMin || pixel.x > coreMax || pixel.y < coreMin || pixel.y > coreMax) {
      continue;
    }
    totalWeight += pixel.weight;
    if (faviconCarrierLooksNeutralPaperLike(rgbChannelsToHex(pixel.red, pixel.green, pixel.blue))) {
      paperWeight += pixel.weight;
    }
  }
  return totalWeight > 0
    && paperWeight / totalWeight >= 0.52
    && (surface.coverage || 0) >= 0.28
    && (surface.span || 0) >= 0.5
    && surface.spansCenter;
}

function faviconTransparentGlyphCandidateFromBucket(bucket, analysis, size) {
  if (!bucket?.weight || !analysis.opaqueWeight || !analysis.totalWeight) {
    return null;
  }
  const colorDistanceLimit = FAVICON_BACKGROUND_COLOR_DISTANCE ** 2;
  let red = 0;
  let green = 0;
  let blue = 0;
  let weight = 0;
  let edgeWeight = 0;
  for (const pixel of analysis.pixels) {
    if (colorDistanceSquared(pixel, bucket) > colorDistanceLimit) {
      continue;
    }
    red += pixel.red * pixel.weight;
    green += pixel.green * pixel.weight;
    blue += pixel.blue * pixel.weight;
    weight += pixel.weight;
    edgeWeight += pixel.edgeWeight;
  }
  if (!weight) {
    return null;
  }
  const opaqueCoverage = analysis.opaqueWeight / analysis.totalWeight;
  const coverage = weight / analysis.totalWeight;
  const edgeConfidence = edgeWeight / Math.max(1, analysis.edgeSampleWeight);
  const unframedGlyph = faviconAnalysisLooksLikeUnframedGlyph(analysis, size);
  if (
    opaqueCoverage < FAVICON_TRANSPARENT_GLYPH_COVERAGE_MIN
    || opaqueCoverage > FAVICON_TRANSPARENT_GLYPH_COVERAGE_MAX
    || coverage / opaqueCoverage < FAVICON_TRANSPARENT_GLYPH_CANDIDATE_RATIO_MIN
    || (edgeConfidence > FAVICON_TRANSPARENT_GLYPH_EDGE_CONFIDENCE_MAX && !unframedGlyph)
  ) {
    return null;
  }
  return {
    red: red / weight,
    green: green / weight,
    blue: blue / weight,
    confidence: FAVICON_BACKGROUND_CONFIDENCE_MIN,
    coverage,
    edgeConfidence,
    innerTileConfidence: 0,
    unframedGlyph,
    score: FAVICON_BACKGROUND_CONFIDENCE_MIN
  };
}

function faviconTransparentGlyphCandidateFromAnalysis(analysis, size) {
  const opaqueCoverage = analysis.opaqueWeight / analysis.totalWeight;
  const edgeConfidence = analysis.pixels.reduce((sum, pixel) => sum + pixel.edgeWeight, 0)
    / Math.max(1, analysis.edgeSampleWeight);
  const unframedGlyph = faviconAnalysisLooksLikeUnframedGlyph(analysis, size);
  if (
    opaqueCoverage < FAVICON_TRANSPARENT_GLYPH_COVERAGE_MIN
    || opaqueCoverage > FAVICON_TRANSPARENT_GLYPH_COVERAGE_MAX
    || (edgeConfidence > FAVICON_TRANSPARENT_GLYPH_EDGE_CONFIDENCE_MAX && !unframedGlyph)
  ) {
    return null;
  }
  const totals = analysis.pixels.reduce((result, pixel) => {
    result.red += pixel.red * pixel.weight;
    result.green += pixel.green * pixel.weight;
    result.blue += pixel.blue * pixel.weight;
    return result;
  }, { red: 0, green: 0, blue: 0 });
  return {
    red: totals.red / analysis.opaqueWeight,
    green: totals.green / analysis.opaqueWeight,
    blue: totals.blue / analysis.opaqueWeight,
    confidence: FAVICON_BACKGROUND_CONFIDENCE_MIN,
    coverage: opaqueCoverage,
    edgeConfidence,
    innerTileConfidence: 0,
    unframedGlyph,
    score: FAVICON_BACKGROUND_CONFIDENCE_MIN
  };
}

function faviconForegroundStatsForCandidate(candidate, analysis, size) {
  const colorDistanceLimit = FAVICON_FOREGROUND_COLOR_DISTANCE ** 2;
  const background = {
    red: candidate.red,
    green: candidate.green,
    blue: candidate.blue
  };
  const backgroundHex = rgbChannelsToHex(candidate.red, candidate.green, candidate.blue);
  let weight = 0;
  let contrastWeight = 0;
  let maxContrast = 0;
  let red = 0;
  let green = 0;
  let blue = 0;
  const colorBuckets = new Map();
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -1;
  let maxY = -1;
  for (const pixel of analysis.pixels) {
    if (colorDistanceSquared(pixel, background) <= colorDistanceLimit) {
      continue;
    }
    const contrast = contrastRatio(backgroundHex, rgbChannelsToHex(pixel.red, pixel.green, pixel.blue));
    weight += pixel.weight;
    contrastWeight += contrast * pixel.weight;
    maxContrast = Math.max(maxContrast, contrast);
    red += pixel.red * pixel.weight;
    green += pixel.green * pixel.weight;
    blue += pixel.blue * pixel.weight;
    const bucketKey = faviconColorBucketKey(pixel.red, pixel.green, pixel.blue);
    const bucket = colorBuckets.get(bucketKey) || { red: 0, green: 0, blue: 0, weight: 0 };
    bucket.red += pixel.red * pixel.weight;
    bucket.green += pixel.green * pixel.weight;
    bucket.blue += pixel.blue * pixel.weight;
    bucket.weight += pixel.weight;
    colorBuckets.set(bucketKey, bucket);
    minX = Math.min(minX, pixel.x);
    minY = Math.min(minY, pixel.y);
    maxX = Math.max(maxX, pixel.x);
    maxY = Math.max(maxY, pixel.y);
  }
  if (!weight || maxX < minX || maxY < minY) {
    return {
      coverage: 0,
      averageContrast: 0,
      maxContrast: 0,
      red: 0,
      green: 0,
      blue: 0,
      colors: [],
      spansCenter: false,
      span: 0
    };
  }
  const bounds = { minX, minY, maxX, maxY };
  const colors = [...colorBuckets.values()]
    .map(faviconAverageColorBucket)
    .sort((first, second) => second.weight - first.weight)
    .slice(0, 6)
    .map((bucket) => rgbChannelsToHex(bucket.red, bucket.green, bucket.blue));
  return {
    coverage: weight / Math.max(1, analysis.totalWeight),
    averageContrast: contrastWeight / weight,
    maxContrast,
    red: red / weight,
    green: green / weight,
    blue: blue / weight,
    colors,
    spansCenter: faviconCandidateSpansCenter(bounds, size),
    span: Math.max(maxX - minX + 1, maxY - minY + 1) / size
  };
}

function faviconPaperSurfaceStats(analysis, size) {
  let paperWeight = 0;
  let artworkWeight = 0;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -1;
  let maxY = -1;
  for (const pixel of analysis.pixels) {
    const color = rgbChannelsToHex(pixel.red, pixel.green, pixel.blue);
    if (faviconCarrierLooksNeutralPaperLike(color)) {
      paperWeight += pixel.weight;
      minX = Math.min(minX, pixel.x);
      minY = Math.min(minY, pixel.y);
      maxX = Math.max(maxX, pixel.x);
      maxY = Math.max(maxY, pixel.y);
    } else if (contrastRatio(color, "#ffffff") >= 1.28) {
      artworkWeight += pixel.weight;
    }
  }
  if (!paperWeight || maxX < minX || maxY < minY) {
    return { coverage: 0, artworkCoverage: 0, spansCenter: false, span: 0 };
  }
  const bounds = { minX, minY, maxX, maxY };
  return {
    coverage: paperWeight / Math.max(1, analysis.totalWeight),
    artworkCoverage: artworkWeight / Math.max(1, analysis.totalWeight),
    spansCenter: faviconCandidateSpansCenter(bounds, size),
    span: Math.max(maxX - minX + 1, maxY - minY + 1) / size
  };
}

function faviconCandidateHasLowContrastForeground(color) {
  const foreground = color.foreground || {};
  return (foreground.coverage || 0) >= FAVICON_LOW_CONTRAST_FOREGROUND_COVERAGE_MIN
    && (foreground.averageContrast || 0) <= FAVICON_LOW_CONTRAST_AVERAGE_MAX
    && (foreground.maxContrast || 0) <= FAVICON_LOW_CONTRAST_PEAK_MAX;
}

function faviconCandidateHasUnreadableForeground(color, tileColor) {
  return faviconCandidateHasVisibleForeground(color)
    && contrastRatio(tileColor, faviconForegroundRepresentativeColor(color, tileColor)) < FAVICON_READABLE_CARRIER_CONTRAST_MIN;
}

function faviconCandidateHasVisibleForeground(color) {
  const foreground = color.foreground || {};
  return (foreground.coverage || 0) >= FAVICON_LOW_CONTRAST_FOREGROUND_COVERAGE_MIN
    && foreground.spansCenter
    && (foreground.span || 0) >= 0.18;
}

function faviconCandidateHasRecoverableForeground(color) {
  const foreground = color.foreground || {};
  return (foreground.coverage || 0) >= FAVICON_LOW_CONTRAST_FOREGROUND_COVERAGE_MIN
    && (foreground.span || 0) >= 0.14;
}

function faviconCandidateLooksLikeTransparentGlyph(color, tileColor) {
  const background = normalizeHexColor(tileColor);
  if (!background) {
    return false;
  }
  if (faviconCandidateHasEmbeddedForeground(color)) {
    return false;
  }
  const opaqueCoverage = color.opaqueCoverage || 0;
  if (
    opaqueCoverage <= 0
    || opaqueCoverage > FAVICON_TRANSPARENT_GLYPH_COVERAGE_MAX
    || (color.coverage || 0) / opaqueCoverage < FAVICON_TRANSPARENT_GLYPH_CANDIDATE_RATIO_MIN
    || ((color.edgeConfidence || 0) > FAVICON_TRANSPARENT_GLYPH_EDGE_CONFIDENCE_MAX && !color.unframedGlyph)
  ) {
    return false;
  }
  return true;
}

function faviconCandidateHasEmbeddedForeground(color) {
  if (color.matchMode !== "embedded-tile") {
    return false;
  }
  const foreground = color.foreground || {};
  return (foreground.coverage || 0) >= FAVICON_LOW_CONTRAST_FOREGROUND_COVERAGE_MIN
    && (foreground.maxContrast || 0) > FAVICON_LOW_CONTRAST_PEAK_MAX;
}

function faviconCandidateLooksLikeNearWhiteGlyph(color, tileColor) {
  const background = normalizeHexColor(tileColor);
  if (!background || relativeLuminance(background) < FAVICON_NEAR_WHITE_GLYPH_LUMINANCE_MIN) {
    return false;
  }
  const foreground = color.foreground || {};
  return (foreground.coverage || 0) <= FAVICON_NEAR_WHITE_GLYPH_FOREGROUND_COVERAGE_MAX
    || faviconCandidateHasLowContrastForeground(color);
}

function faviconCandidateNeedsReadableCarrier(color, tileColor, options = {}) {
  if (
    options.adaptiveFaviconCarrier
    && color?.preferredSelfContainedTile
  ) {
    return false;
  }
  const nearWhiteGlyph = faviconCandidateLooksLikeNearWhiteGlyph(color, tileColor);
  return (options.adaptiveFaviconCarrier
      && faviconCandidateHasRecoverableForeground(color)
      && (faviconCandidateHasLowContrastForeground(color) || faviconCandidateHasUnreadableForeground(color, tileColor)))
    || faviconCandidateLooksLikeTransparentGlyph(color, tileColor)
    || (nearWhiteGlyph
      && (!options.adaptiveFaviconCarrier || !faviconCandidateHasPaperSurfaceArtwork(color)));
}

function faviconShouldFuseEmbeddedTile(color, tileColor, options = {}) {
  if (!normalizeHexColor(tileColor)) {
    return false;
  }
  if (color?.compactEmblem) {
    return false;
  }
  if (color?.matchMode === "embedded-tile") {
    return Boolean(faviconCandidateHasEmbeddedForeground(color)
      || (options.adaptiveFaviconCarrier
        && faviconCandidateHasRecoverableForeground(color)
        && faviconCandidateHasLowContrastForeground(color)));
  }
  if (options.adaptiveFaviconCarrier && color?.matchMode === "full-surface") {
    return normalizeHexColor(tileColor) === rgbChannelsToHex(color.red, color.green, color.blue)
      && faviconCandidateHasVisibleForeground(color)
      && (!faviconCandidateHasUnreadableForeground(color, tileColor) || faviconCarrierLooksPaperLike(tileColor));
  }
  return false;
}

function faviconFusionDistances(color, options = {}) {
  return options.adaptiveFaviconCarrier && faviconCandidateHasLowContrastForeground(color)
    ? { clear: FAVICON_FOREGROUND_COLOR_DISTANCE, feather: 4 }
    : { clear: FAVICON_EMBEDDED_TILE_FUSION_CLEAR_DISTANCE, feather: FAVICON_EMBEDDED_TILE_FUSION_FEATHER_DISTANCE };
}

function fusedEmbeddedFaviconPixelData(sample, tileColor, embeddedTileColor = "", distances = {}) {
  const clearColor = normalizeHexColor(embeddedTileColor) || normalizeHexColor(tileColor);
  if (!sample?.data || !sample.size || !clearColor) {
    return null;
  }
  const [tileRed, tileGreen, tileBlue] = hexToRgb(clearColor);
  const clearLimit = distances.clear ?? FAVICON_EMBEDDED_TILE_FUSION_CLEAR_DISTANCE;
  const featherLimit = clearLimit + (distances.feather ?? FAVICON_EMBEDDED_TILE_FUSION_FEATHER_DISTANCE);
  const clearLimitSquared = clearLimit ** 2;
  const featherLimitSquared = featherLimit ** 2;
  const output = new Uint8ClampedArray(sample.data);
  let adjusted = 0;
  for (let index = 0; index < output.length; index += 4) {
    const alpha = output[index + 3];
    if (!alpha) {
      continue;
    }
    const distanceSquared = (output[index] - tileRed) ** 2
      + (output[index + 1] - tileGreen) ** 2
      + (output[index + 2] - tileBlue) ** 2;
    if (distanceSquared <= clearLimitSquared) {
      output[index + 3] = 0;
      adjusted += 1;
      continue;
    }
    if (distanceSquared <= featherLimitSquared) {
      const distance = Math.sqrt(distanceSquared);
      const opacity = Math.max(0, Math.min(1, (distance - clearLimit) / Math.max(1, featherLimit - clearLimit)));
      const nextAlpha = Math.round(alpha * opacity);
      if (nextAlpha < alpha) {
        output[index + 3] = nextAlpha;
        adjusted += 1;
      }
    }
  }
  return adjusted ? { data: output, size: sample.size } : null;
}

function faviconBackgroundCandidateFromBucket(bucket, analysis, size) {
  const colorDistanceLimit = FAVICON_BACKGROUND_COLOR_DISTANCE ** 2;
  const samples = [];
  let red = 0;
  let green = 0;
  let blue = 0;
  let weight = 0;
  let edgeWeight = 0;
  let carrierEdgeWeight = 0;
  let edgeRed = 0;
  let edgeGreen = 0;
  let edgeBlue = 0;
  let minX = size;
  let minY = size;
  let maxX = -1;
  let maxY = -1;
  for (const pixel of analysis.pixels) {
    if (colorDistanceSquared(pixel, bucket) > colorDistanceLimit) {
      continue;
    }
    samples.push(pixel);
    red += pixel.red * pixel.weight;
    green += pixel.green * pixel.weight;
    blue += pixel.blue * pixel.weight;
    weight += pixel.weight;
    edgeWeight += pixel.edgeWeight;
    if (pixel.edgeWeight > 0.35) {
      carrierEdgeWeight += pixel.edgeWeight;
      edgeRed += pixel.red * pixel.edgeWeight;
      edgeGreen += pixel.green * pixel.edgeWeight;
      edgeBlue += pixel.blue * pixel.edgeWeight;
    }
    minX = Math.min(minX, pixel.x);
    minY = Math.min(minY, pixel.y);
    maxX = Math.max(maxX, pixel.x);
    maxY = Math.max(maxY, pixel.y);
  }
  if (!weight || maxX < minX || maxY < minY) {
    return null;
  }
  const bounds = { minX, minY, maxX, maxY };
  const coverage = weight / analysis.totalWeight;
  const edgeConfidence = edgeWeight / analysis.edgeSampleWeight;
  const innerTileConfidence = faviconInnerTileConfidence(samples, bounds, size, coverage);
  const ownTileShape = faviconOwnTileShapeSupport(samples, bounds, size, coverage);
  const confidence = Math.min(1, Math.max(edgeConfidence, innerTileConfidence));
  if (!confidence) {
    return null;
  }
  const edgeCarrierColor = edgeConfidence >= FAVICON_EDGE_CARRIER_CONFIDENCE_MIN && carrierEdgeWeight > 0
    ? {
      carrierRed: edgeRed / carrierEdgeWeight,
      carrierGreen: edgeGreen / carrierEdgeWeight,
      carrierBlue: edgeBlue / carrierEdgeWeight
    }
    : {};
  return {
    red: red / weight,
    green: green / weight,
    blue: blue / weight,
    ...edgeCarrierColor,
    confidence,
    coverage,
    edgeConfidence,
    innerTileConfidence,
    ownTileShapeConfidence: ownTileShape.confidence,
    ownTileCornerStyle: ownTileShape.cornerStyle,
    score: confidence + coverage * 0.18 + Math.min(0.12, edgeConfidence * 0.2)
  };
}

function faviconBackgroundMatchMode(candidate) {
  const innerTileConfidence = candidate.innerTileConfidence || 0;
  const edgeConfidence = candidate.edgeConfidence || 0;
  if (
    innerTileConfidence >= FAVICON_EMBEDDED_TILE_INNER_CONFIDENCE_MIN
    && edgeConfidence <= FAVICON_EMBEDDED_TILE_EDGE_CONFIDENCE_MAX
    && innerTileConfidence >= edgeConfidence * 1.25
  ) {
    return "embedded-tile";
  }
  return "full-surface";
}

function faviconInnerTileConfidence(samples, bounds, size, coverage) {
  const width = bounds.maxX - bounds.minX + 1;
  const height = bounds.maxY - bounds.minY + 1;
  const span = Math.min(width / size, height / size);
  if (coverage < 0.14 || span < 0.34 || !faviconCandidateSpansCenter(bounds, size)) {
    return 0;
  }
  const density = samples.reduce((sum, sample) => sum + sample.weight, 0) / (width * height);
  if (density < 0.42) {
    return 0;
  }
  const sideSupport = faviconCandidateSideSupport(samples, bounds);
  if (sideSupport.supportedSides < 3 && sideSupport.average < 0.34) {
    return 0;
  }
  const gridSupport = faviconCandidateGridSupport(samples, bounds);
  if (gridSupport.supportedCells < 10 || gridSupport.average < 0.28) {
    return 0;
  }
  const surfaceSupport = faviconCandidateSurfaceSupport(samples, bounds);
  if (surfaceSupport.rowRatio < 0.52 || surfaceSupport.columnRatio < 0.52) {
    return 0;
  }
  return Math.min(
    1,
    coverage * 1.1
      + density * 0.14
      + sideSupport.average * 0.14
      + gridSupport.average * 0.22
      + surfaceSupport.average * 0.28
  );
}

function faviconOwnTileShapeSupport(samples, bounds, size, coverage) {
  const width = bounds.maxX - bounds.minX + 1;
  const height = bounds.maxY - bounds.minY + 1;
  const minSpan = Math.min(width / size, height / size);
  const maxSpan = Math.max(width / size, height / size);
  if (coverage < 0.14 || minSpan < 0.34 || maxSpan > 1.01 || !faviconCandidateSpansCenter(bounds, size)) {
    return { confidence: 0, cornerStyle: "" };
  }
  const density = samples.reduce((sum, sample) => sum + sample.weight, 0) / Math.max(1, width * height);
  if (density < 0.42) {
    return { confidence: 0, cornerStyle: "" };
  }
  const cornerSupport = faviconCandidateCornerSupport(samples, bounds);
  const sideSupport = faviconCandidateSideSupport(samples, bounds);
  const surfaceSupport = faviconCandidateSurfaceSupport(samples, bounds);
  const aspectRatio = Math.min(width, height) / Math.max(width, height);
  const straightCornerConfidence = cornerSupport.extremeMinimum >= 0.5
    && cornerSupport.pointMinimum >= 0.5
    && cornerSupport.pointSpread <= 0.5
    ? Math.max(cornerSupport.pointAverage, cornerSupport.average * 0.72)
    : 0;
  const roundedCornerConfidence = cornerSupport.extremeMaximum <= 0.15
    && sideSupport.supportedSides === 4
    && surfaceSupport.rowRatio >= 0.5
    && surfaceSupport.columnRatio >= 0.5
    ? Math.max(1 - cornerSupport.extremeMaximum, 1 - cornerSupport.pointAverage, 1 - cornerSupport.average)
    : 0;
  const softRoundedCornerConfidence = cornerSupport.extremeMaximum <= 0.62
    && cornerSupport.pointAverage <= 0.82
    && cornerSupport.pointMaximum <= 0.88
    && sideSupport.supportedSides === 4
    && surfaceSupport.rowRatio >= 0.5
    && surfaceSupport.columnRatio >= 0.5
    ? Math.max(1 - cornerSupport.pointAverage * 0.56, 1 - cornerSupport.extremeMaximum * 0.55)
    : 0;
  // A full-bleed disc fills only ~pi/4 of its bounding box, so its density sits well
  // below a square/rounded-rect tile (~0.9+) while it still reaches all four edges at
  // the mid-arcs and leaves the corner bands empty. Recognising it as its own circular
  // tile keeps a circular favicon on the fusion path instead of being mistaken for a
  // padded compact emblem (which forces an opaque neutral carrier).
  const circleCornerConfidence = cornerSupport.extremeMaximum <= 0.15
    && cornerSupport.maximum <= 0.42
    && sideSupport.supportedSides === 4
    && surfaceSupport.rowRatio >= 0.45
    && surfaceSupport.columnRatio >= 0.45
    && aspectRatio >= 0.82
    && minSpan >= 0.6
    && density >= 0.45
    && density <= 0.88
    ? Math.max(1 - cornerSupport.maximum, 1 - cornerSupport.average)
    : 0;
  // The circle gate is a positive disc test (empty corners + round fill density + near
  // full-bleed), so when it fires it is authoritative: a disc also satisfies the rounded
  // gate because its corners are empty too, and rounded's score saturates at 1, so we must
  // not let it outrank the circle classification.
  const confidence = circleCornerConfidence > 0
    ? circleCornerConfidence
    : Math.max(straightCornerConfidence, roundedCornerConfidence, softRoundedCornerConfidence);
  if (confidence < 0.42) {
    return { confidence: 0, cornerStyle: "" };
  }
  const cornerStyle = circleCornerConfidence > 0
    ? "circle"
    : Math.max(roundedCornerConfidence, softRoundedCornerConfidence) > straightCornerConfidence ? "rounded" : "straight";
  return {
    confidence: Math.min(1, confidence * 0.72 + density * 0.16 + sideSupport.average * 0.12),
    cornerStyle
  };
}

function faviconCandidateSpansCenter(bounds, size) {
  const centerMin = Math.floor(size * 0.38);
  const centerMax = Math.ceil(size * 0.62);
  return bounds.minX <= centerMin
    && bounds.maxX >= centerMax
    && bounds.minY <= centerMin
    && bounds.maxY >= centerMax;
}

function faviconCandidateSideSupport(samples, bounds) {
  const bandSize = 2;
  const width = bounds.maxX - bounds.minX + 1;
  const height = bounds.maxY - bounds.minY + 1;
  const sideWeights = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
  for (const sample of samples) {
    if (sample.y <= bounds.minY + bandSize - 1) {
      sideWeights.top += sample.weight;
    }
    if (sample.y >= bounds.maxY - bandSize + 1) {
      sideWeights.bottom += sample.weight;
    }
    if (sample.x <= bounds.minX + bandSize - 1) {
      sideWeights.left += sample.weight;
    }
    if (sample.x >= bounds.maxX - bandSize + 1) {
      sideWeights.right += sample.weight;
    }
  }
  const top = Math.min(1, sideWeights.top / Math.max(1, width * bandSize));
  const bottom = Math.min(1, sideWeights.bottom / Math.max(1, width * bandSize));
  const left = Math.min(1, sideWeights.left / Math.max(1, height * bandSize));
  const right = Math.min(1, sideWeights.right / Math.max(1, height * bandSize));
  const values = [top, right, bottom, left];
  return {
    average: values.reduce((sum, value) => sum + value, 0) / values.length,
    supportedSides: values.filter((value) => value >= 0.24).length
  };
}

function faviconCandidateCornerSupport(samples, bounds) {
  const width = bounds.maxX - bounds.minX + 1;
  const height = bounds.maxY - bounds.minY + 1;
  const bandSize = Math.max(2, Math.round(Math.min(width, height) * 0.16));
  const cornerWeights = {
    topLeft: 0,
    topRight: 0,
    bottomRight: 0,
    bottomLeft: 0
  };
  for (const sample of samples) {
    const left = sample.x <= bounds.minX + bandSize - 1;
    const right = sample.x >= bounds.maxX - bandSize + 1;
    const top = sample.y <= bounds.minY + bandSize - 1;
    const bottom = sample.y >= bounds.maxY - bandSize + 1;
    if (top && left) {
      cornerWeights.topLeft += sample.weight;
    }
    if (top && right) {
      cornerWeights.topRight += sample.weight;
    }
    if (bottom && right) {
      cornerWeights.bottomRight += sample.weight;
    }
    if (bottom && left) {
      cornerWeights.bottomLeft += sample.weight;
    }
  }
  const cornerArea = bandSize * bandSize;
  const values = Object.values(cornerWeights).map((weight) => Math.min(1, weight / Math.max(1, cornerArea)));
  const pointBandSize = 2;
  const pointArea = pointBandSize * pointBandSize;
  const pointWeights = {
    topLeft: 0,
    topRight: 0,
    bottomRight: 0,
    bottomLeft: 0
  };
  const extremeWeights = {
    topLeft: 0,
    topRight: 0,
    bottomRight: 0,
    bottomLeft: 0
  };
  for (const sample of samples) {
    const left = sample.x <= bounds.minX + pointBandSize - 1;
    const right = sample.x >= bounds.maxX - pointBandSize + 1;
    const top = sample.y <= bounds.minY + pointBandSize - 1;
    const bottom = sample.y >= bounds.maxY - pointBandSize + 1;
    if (top && left) {
      pointWeights.topLeft += sample.weight;
    }
    if (top && right) {
      pointWeights.topRight += sample.weight;
    }
    if (bottom && right) {
      pointWeights.bottomRight += sample.weight;
    }
    if (bottom && left) {
      pointWeights.bottomLeft += sample.weight;
    }
    if (sample.x === bounds.minX && sample.y === bounds.minY) {
      extremeWeights.topLeft += sample.weight;
    }
    if (sample.x === bounds.maxX && sample.y === bounds.minY) {
      extremeWeights.topRight += sample.weight;
    }
    if (sample.x === bounds.maxX && sample.y === bounds.maxY) {
      extremeWeights.bottomRight += sample.weight;
    }
    if (sample.x === bounds.minX && sample.y === bounds.maxY) {
      extremeWeights.bottomLeft += sample.weight;
    }
  }
  const pointValues = Object.values(pointWeights).map((weight) => Math.min(1, weight / Math.max(1, pointArea)));
  const extremeValues = Object.values(extremeWeights).map((weight) => Math.min(1, weight));
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const pointMinimum = Math.min(...pointValues);
  const pointMaximum = Math.max(...pointValues);
  return {
    average: values.reduce((sum, value) => sum + value, 0) / values.length,
    minimum,
    maximum,
    spread: maximum - minimum,
    pointAverage: pointValues.reduce((sum, value) => sum + value, 0) / pointValues.length,
    pointMinimum,
    pointMaximum,
    pointSpread: pointMaximum - pointMinimum,
    extremeMinimum: Math.min(...extremeValues),
    extremeMaximum: Math.max(...extremeValues)
  };
}

function faviconCandidateGridSupport(samples, bounds) {
  const gridSize = 4;
  const width = bounds.maxX - bounds.minX + 1;
  const height = bounds.maxY - bounds.minY + 1;
  const cells = Array.from({ length: gridSize * gridSize }, () => 0);
  for (const sample of samples) {
    const column = Math.min(gridSize - 1, Math.floor(((sample.x - bounds.minX) / width) * gridSize));
    const row = Math.min(gridSize - 1, Math.floor(((sample.y - bounds.minY) / height) * gridSize));
    cells[row * gridSize + column] += sample.weight;
  }
  const cellArea = width * height / cells.length;
  const normalizedCells = cells.map((weight) => Math.min(1, weight / Math.max(1, cellArea)));
  return {
    average: normalizedCells.reduce((sum, value) => sum + value, 0) / normalizedCells.length,
    supportedCells: normalizedCells.filter((value) => value >= 0.18).length
  };
}

function faviconCandidateSurfaceSupport(samples, bounds) {
  const width = bounds.maxX - bounds.minX + 1;
  const height = bounds.maxY - bounds.minY + 1;
  const rowWeights = Array.from({ length: height }, () => 0);
  const columnWeights = Array.from({ length: width }, () => 0);
  for (const sample of samples) {
    rowWeights[sample.y - bounds.minY] += sample.weight;
    columnWeights[sample.x - bounds.minX] += sample.weight;
  }
  const rowFill = rowWeights.map((weight) => Math.min(1, weight / width));
  const columnFill = columnWeights.map((weight) => Math.min(1, weight / height));
  const rowRatio = rowFill.filter((fill) => fill >= 0.58).length / Math.max(1, rowFill.length);
  const columnRatio = columnFill.filter((fill) => fill >= 0.58).length / Math.max(1, columnFill.length);
  return {
    average: (rowRatio + columnRatio) / 2,
    rowRatio,
    columnRatio
  };
}

function iconBackgroundSampleWeight(x, y, size) {
  const edgeDistance = Math.min(x, y, size - 1 - x, size - 1 - y);
  if (edgeDistance <= 1) {
    return 3;
  }
  if (edgeDistance <= 3) {
    return 2;
  }
  if (edgeDistance <= 5) {
    return 1;
  }
  return 0.35;
}

function faviconColorBucketKey(red, green, blue) {
  return [
    Math.round(red / 16),
    Math.round(green / 16),
    Math.round(blue / 16)
  ].join(":");
}

function faviconAverageColorBucket(bucket) {
  return {
    red: bucket.red / bucket.weight,
    green: bucket.green / bucket.weight,
    blue: bucket.blue / bucket.weight,
    weight: bucket.weight
  };
}

function colorDistanceSquared(first, second) {
  return (first.red - second.red) ** 2
    + (first.green - second.green) ** 2
    + (first.blue - second.blue) ** 2;
}

function faviconMatchedTileColors(color, options = {}) {
  if (!faviconColorShouldUseOriginalTile(color, options)) {
    return null;
  }
  const tileColor = rgbChannelsToHex(color.red, color.green, color.blue);
  if (options.adaptiveFaviconCarrier && faviconCandidateLooksLikePaperTileArtwork(color, tileColor)) {
    return {
      light: "#ffffff",
      dark: "#ffffff"
    };
  }
  if (color.matchMode === "embedded-tile") {
    return faviconSeparatedTileColors(tileColor, color, options);
  }
  return faviconSurfaceTileColors(tileColor, color, options);
}

function faviconSurfaceTileColors(tileColor, color, options = {}) {
  const preferReadableCarrier = faviconCandidateNeedsReadableCarrier(color, tileColor, options);
  const foregroundColors = faviconForegroundPaletteColors(color, tileColor);
  if (
    options.adaptiveFaviconCarrier
    && faviconCandidateLooksLikeTransparentGlyph(color, tileColor)
    && faviconPaletteHasDistinctHueFamilies(foregroundColors)
  ) {
    return {
      light: "#ffffff",
      dark: "#ffffff"
    };
  }
  if (
    options.adaptiveFaviconCarrier
    && color.matchMode === "full-surface"
    && faviconFullSurfaceHasPaperOutlineArtwork(color, tileColor, foregroundColors)
  ) {
    return {
      light: "#ffffff",
      dark: "#ffffff"
    };
  }
  if (
    options.adaptiveFaviconCarrier
    && color.matchMode === "full-surface"
    && faviconFullSurfaceHasLowContrastMonochromeArtwork(color, tileColor)
  ) {
    return {
      light: "#ffffff",
      dark: "#ffffff"
    };
  }
  if (
    options.adaptiveFaviconCarrier
    && color.matchMode === "full-surface"
    && !faviconCandidateLooksLikeTransparentGlyph(color, tileColor)
    && faviconFullSurfacePrefersPaperCarrier(tileColor, foregroundColors)
  ) {
    return {
      light: "#ffffff",
      dark: "#ffffff"
    };
  }
  const carrier = faviconCarrierTileColor(tileColor, "dark", {
    preferReadableCarrier,
    foregroundColors,
    neutralReadableCarrier: options.adaptiveFaviconCarrier
  });
  return {
    light: carrier,
    dark: carrier
  };
}

function faviconSeparatedTileColors(tileColor, color, options = {}) {
  const preferReadableCarrier = faviconCandidateNeedsReadableCarrier(color, tileColor, options);
  const foregroundColors = faviconForegroundPaletteColors(color, tileColor);
  const carrier = faviconCarrierTileColor(tileColor, "dark", {
    preferReadableCarrier,
    foregroundColors,
    neutralReadableCarrier: options.adaptiveFaviconCarrier,
    separate: preferReadableCarrier
  });
  return {
    light: carrier,
    dark: carrier
  };
}

function faviconCarrierTileColor(tileColor, mode, options = {}) {
  const color = normalizeHexColor(tileColor);
  if (!color) {
    return tileColor;
  }
  if (options.preferReadableCarrier) {
    return options.neutralReadableCarrier
      ? faviconReadableNeutralCarrierTileColor(options.foregroundColors || [color])
      : faviconReadableCarrierTileColor(color, mode);
  }
  if (!options.separate) {
    return color;
  }
  const luminance = relativeLuminance(color);
  const target = luminance < (mode === "dark" ? 0.48 : 0.58) ? "#ffffff" : "#000000";
  const initialAmount = mode === "dark" ? 0.18 : 0.24;
  return mixColorUntilContrast(color, target, FAVICON_EMBEDDED_TILE_CONTRAST_MIN, initialAmount);
}

function faviconForegroundRepresentativeColor(color, fallbackColor) {
  const foreground = color.foreground || {};
  if (faviconCandidateHasVisibleForeground(color)) {
    return rgbChannelsToHex(foreground.red, foreground.green, foreground.blue);
  }
  return fallbackColor;
}

function faviconForegroundPaletteColors(color, fallbackColor) {
  if (color.compactEmblem) {
    return [fallbackColor];
  }
  const foregroundColors = (color.foreground?.colors || []).map(normalizeHexColor).filter(Boolean);
  if (faviconCandidateLooksLikeTransparentGlyph(color, fallbackColor)) {
    return [...new Set([fallbackColor, ...foregroundColors])];
  }
  return foregroundColors.length ? foregroundColors : [faviconForegroundRepresentativeColor(color, fallbackColor)];
}

function faviconCandidateLooksLikeTransparentPaperArtwork(color, tileColor) {
  return faviconCandidateLooksLikePaperTileArtwork(color, tileColor);
}

function faviconCandidateLooksLikePaperTileArtwork(color, tileColor) {
  const paperColor = normalizeHexColor(tileColor);
  if (color?.preferredSelfContainedTile && !faviconCarrierLooksNeutralPaperLike(paperColor)) {
    return false;
  }
  const foreground = color.foreground || {};
  const accents = (foreground.colors || []).map(normalizeHexColor).filter(Boolean);
  const transparentGlyph = faviconCandidateLooksLikeTransparentGlyph(color, tileColor);
  const ownNonPaperTile = faviconCandidateHasOwnTileShape(color) && !faviconCarrierLooksPaperLike(paperColor);
  const hasPaperSurface = faviconCarrierLooksPaperLike(paperColor)
    || (!ownNonPaperTile && faviconCandidateHasPaperSurfaceArtwork(color));
  const hasReadableArtwork = accents.some((accent) => (
    !faviconCarrierLooksPaperLike(accent) && contrastRatio(accent, "#ffffff") >= 1.28
  )) || ((foreground.maxContrast || 0) >= 1.28 && (foreground.span || 0) >= 0.18);
  const hasOwnPaperSurface = (((color.matchMode === "embedded-tile" || color.matchMode === "full-surface")
      && faviconCandidateHasOwnTileShape(color)
      && !ownNonPaperTile)
      || (!ownNonPaperTile && faviconCandidateHasPaperSurfaceArtwork(color)))
    || transparentGlyph;
  return hasOwnPaperSurface
    && (color.opaqueCoverage || 0) >= 0.08
    && (foreground.coverage || 0) >= 0.018
    && (foreground.span || 0) >= 0.2
    && hasPaperSurface
    && hasReadableArtwork;
}

function faviconCandidateHasPaperSurfaceArtwork(color) {
  const surface = color.paperSurface || {};
  return (surface.coverage || 0) >= FAVICON_PAPER_SURFACE_COVERAGE_MIN
    && (surface.artworkCoverage || 0) >= FAVICON_PAPER_SURFACE_ARTWORK_COVERAGE_MIN
    && (surface.span || 0) >= FAVICON_PAPER_SURFACE_SPAN_MIN
    && surface.spansCenter;
}

function faviconCandidateHasOwnTileShape(color) {
  return (color.ownTileShapeConfidence || 0) >= 0.42
    && (color.edgeConfidence || 0) <= FAVICON_EMBEDDED_TILE_EDGE_CONFIDENCE_MAX
    && (color.ownTileCornerStyle === "straight"
      || color.ownTileCornerStyle === "rounded"
      || color.ownTileCornerStyle === "circle");
}

function faviconReadableCarrierTileColor(color, mode) {
  const luminance = relativeLuminance(color);
  const target = luminance < 0.5 ? "#ffffff" : "#000000";
  const [red, green, blue] = hexToRgb(color);
  const neutral = colorChannelSpread(red, green, blue) <= 18;
  if (neutral && luminance >= 0.88) {
    return "#000000";
  }
  if (neutral && luminance <= 0.04) {
    return "#ffffff";
  }
  const initialAmount = mode === "dark" ? 0.34 : 0.42;
  const mixed = mixColorUntilContrast(
    color,
    target,
    FAVICON_READABLE_CARRIER_CONTRAST_MIN,
    initialAmount,
    FAVICON_READABLE_CARRIER_MAX_MIX
  );
  if (contrastRatio(color, mixed) >= FAVICON_READABLE_CARRIER_CONTRAST_MIN) {
    return mixed;
  }
  const inverted = invertHexColor(color);
  return contrastRatio(color, inverted) >= contrastRatio(color, mixed) ? inverted : mixed;
}

function faviconReadableNeutralCarrierTileColor(colors) {
  const palette = colors.map(normalizeHexColor).filter(Boolean);
  if (!palette.length) {
    return "#f8fafc";
  }
  const averageLuminance = palette.reduce((sum, color) => sum + relativeLuminance(color), 0) / Math.max(1, palette.length);
  const candidates = averageLuminance < 0.5
    ? ["#ffffff", "#f8fafc", "#e5e7eb", "#111827", "#000000", "#374151"]
    : ["#111827", "#000000", "#374151", "#ffffff", "#f8fafc", "#e5e7eb"];
  const minimumContrast = (candidate) => Math.min(...palette.map((color) => contrastRatio(color, candidate)));
  return candidates.find((candidate) => minimumContrast(candidate) >= FAVICON_READABLE_CARRIER_CONTRAST_MIN)
    || candidates.reduce((best, candidate) => (
      minimumContrast(candidate) > minimumContrast(best) ? candidate : best
    ));
}

function faviconFullSurfacePrefersPaperCarrier(tileColor, palette) {
  const carrier = normalizeHexColor(tileColor);
  if (!carrier || faviconCarrierLooksPaperLike(carrier)) {
    return false;
  }
  if (faviconCarrierLooksSoftTintCarrier(carrier)) {
    return false;
  }
  return faviconPalettePrefersPaperCarrier(palette)
    || faviconPaletteLooksLikeBlueGradientArtwork([carrier, ...palette]);
}

function faviconFullSurfaceHasPaperOutlineArtwork(color, tileColor, palette) {
  const carrier = normalizeHexColor(tileColor);
  if (!carrier) {
    return false;
  }
  const [red, green, blue] = hexToRgb(carrier);
  const foreground = color.foreground || {};
  return relativeLuminance(carrier) <= 0.18
    && colorSaturation(red, green, blue) <= 0.18
    && (foreground.coverage || 0) >= FAVICON_PAPER_SURFACE_ARTWORK_COVERAGE_MIN
    && (foreground.span || 0) >= 0.2
    && (foreground.maxContrast || 0) >= FAVICON_READABLE_CARRIER_CONTRAST_MIN
    && palette.some((foregroundColor) => faviconCarrierLooksPaperLike(foregroundColor));
}

function faviconFullSurfaceHasLowContrastMonochromeArtwork(color, tileColor) {
  const carrier = normalizeHexColor(tileColor);
  const foreground = color.foreground || {};
  return Boolean(carrier)
    && !faviconCarrierLooksPaperLike(carrier)
    && (color.opaqueCoverage || 0) >= 0.78
    && faviconCandidateHasVisibleForeground(color)
    && (foreground.averageContrast || 0) <= 1.18
    && contrastRatio(carrier, "#ffffff") >= FAVICON_READABLE_CARRIER_CONTRAST_MIN;
}

function faviconPalettePrefersPaperCarrier(palette) {
  return palette.some((color) => {
    const [red, green, blue] = hexToRgb(color);
    return colorSaturation(red, green, blue) >= 0.32
      && relativeLuminance(color) <= 0.68
      && contrastRatio(color, "#ffffff") >= 1.9;
  });
}

function faviconPaletteHasDistinctHueFamilies(palette) {
  const families = new Set();
  for (const color of palette.map(normalizeHexColor).filter(Boolean)) {
    const [red, green, blue] = hexToRgb(color);
    if (colorSaturation(red, green, blue) < 0.28) {
      continue;
    }
    const peak = Math.max(red, green, blue);
    families.add(peak === red ? "red" : peak === green ? "green" : "blue");
  }
  return families.size >= 2;
}

function faviconCarrierLooksPaperLike(color) {
  const normalized = normalizeHexColor(color);
  if (!normalized) {
    return false;
  }
  const [red, green, blue] = hexToRgb(normalized);
  return relativeLuminance(normalized) >= 0.82 && colorSaturation(red, green, blue) <= 0.22;
}

function faviconCarrierLooksNeutralPaperLike(color) {
  const normalized = normalizeHexColor(color);
  if (!normalized) {
    return false;
  }
  const [red, green, blue] = hexToRgb(normalized);
  return relativeLuminance(normalized) >= 0.88
    && colorChannelSpread(red, green, blue) <= 10
    && colorSaturation(red, green, blue) <= 0.08;
}

function faviconCarrierLooksSoftTintCarrier(color) {
  const normalized = normalizeHexColor(color);
  if (!normalized) {
    return false;
  }
  const [red, green, blue] = hexToRgb(normalized);
  return relativeLuminance(normalized) >= 0.86
    && colorSaturation(red, green, blue) <= 0.18
    && contrastRatio(normalized, "#ffffff") <= 1.18;
}

function faviconPaletteLooksLikeBlueGradientArtwork(palette) {
  const blues = [...new Set(palette.map(normalizeHexColor).filter(Boolean))]
    .map((color) => {
      const [red, green, blue] = hexToRgb(color);
      return { color, red, green, blue };
    })
    .filter(({ red, green, blue }) => blue >= red + 24 && (blue >= green || green >= red + 20));
  if (blues.length < 2) {
    return false;
  }
  const luminanceValues = blues.map(({ color }) => relativeLuminance(color));
  const luminanceSpread = Math.max(...luminanceValues) - Math.min(...luminanceValues);
  const saturationPeak = Math.max(...blues.map(({ red, green, blue }) => colorSaturation(red, green, blue)));
  return saturationPeak >= 0.32 && luminanceSpread >= 0.045;
}

function mixColorUntilContrast(
  color,
  target,
  minimumContrast,
  initialAmount,
  maxMix = FAVICON_EMBEDDED_TILE_CONTRAST_MAX_MIX
) {
  for (
    let amount = initialAmount;
    amount <= maxMix;
    amount += 0.04
  ) {
    const mixed = mixHexColors(color, target, amount);
    if (contrastRatio(color, mixed) >= minimumContrast) {
      return mixed;
    }
  }
  return mixHexColors(color, target, maxMix);
}

function faviconColorShouldUseOriginalTile(color, options = {}) {
  return color.confidence >= FAVICON_BACKGROUND_CONFIDENCE_MIN
    && !(options.adaptiveFaviconCarrier
      && color.matchMode === "full-surface"
      && color.opaqueCoverage >= 0.86
      && (color.foreground?.coverage || 0) < FAVICON_LOW_CONTRAST_FOREGROUND_COVERAGE_MIN);
}

function invertHexColor(color) {
  return rgbToHex(hexToRgb(color).map((channel) => 255 - channel));
}

function rgbChannelsToHex(red, green, blue) {
  return `#${[red, green, blue].map((channel) => Math.round(Math.max(0, Math.min(255, channel)))
    .toString(16)
    .padStart(2, "0")).join("")}`;
}


// Tier 1 (synchronous) of the render-cache invalidation. Signature over the icon-rendering
// functions' source: an edit to any listed function changes this string, so the first-paint
// render-output cache is treated as empty and icons recompute from current code — instantly,
// on the same refresh. Tier 2 (verifyIconCodeHashAndHealStaleIcons) hashes the whole script
// source asynchronously and backstops any helper not listed here, so coverage is absolute
// even if this list drifts. The raw-SVG text cache intentionally uses neither — raw text is
// algorithm input, not output.
let iconRenderCodeSignatureMemo = "";
function iconRenderCodeSignature() {
  if (iconRenderCodeSignatureMemo) {
    return iconRenderCodeSignatureMemo;
  }
  // Comprehensive over the icon visual pipeline: entry points, tile/carrier decision,
  // glyph recolor, SVG paint/colour-complexity analysis, palette helpers, and the colour
  // math they depend on. Editing any of these changes the signature, so the render-output
  // cache is dropped and icons recompute from current code (this is what lets a code revert
  // restore icons without a reinstall). Add new icon-render helpers here when introduced.
  const fns = [
    applySiteIcon, applySiteIconTile, computeSiteIconTile, applyIconTile, displayIconSource,
    coloredSvgIconSource, applySvgGlyphColor, iconGlyphColorForCurrentTile, shouldInvertBrandSvg,
    localBrandGlyphColorForTile, iconTileShouldUseOriginalGlyph, readableIconGlyphColor,
    brandIconTileColors, gradientSvgIconTileColors, originalSvgIconTileColors, genericIconTileColors,
    brandIconLightCarrierColor, brandIconDarkCarrierColor, blackishCarrierColor,
    usesGradientIconCarrier, usesOriginalIconCarrier, keepsBrandIconOriginal, keepsBrandIconOriginalOnBrandTile,
    gradientPaletteCarrierColor, gradientPaletteNeedsDarkAppIconCarrier, paletteHueSpan,
    originalSvgVisiblePalette, originalSvgEmbeddedCarrierColor, paletteAwareBrandIconCarrierColor, paletteColorTraits,
    svgEmbeddedCarrierColor, svgPaintAnalysis, svgPaintAnalysisFromDom, svgPaintAnalysisFromText,
    localSiteIconAnalysisFromSvg, siteIconBrandColor, localSiteIconBrandColor, localSiteIconRenderMode,
    localSiteIconVisibleColors, localSiteIconEmbeddedCarrierColor, embeddedSvgBrandColor,
    remoteBrandSvgDescriptor, remoteBrandSvgBrandColor, remoteBrandSvgMonochromeBrandColor,
    remoteBrandSvgIsMonochrome, remoteBrandSvgHasComplexPaint, remoteBrandSvgHasComplexPaintAnalysis,
    remoteBrandSvgUsesPaintServer, uniqueNormalizedHexColors, contrastRatio, relativeLuminance,
    mixHexColors, hexColorStats
  ];
  let hash = 0;
  let lenSum = 0;
  for (const fn of fns) {
    let src = "";
    try {
      src = typeof fn === "function" ? fn.toString() : "";
    } catch {
      src = "";
    }
    lenSum += src.length;
    for (let index = 0; index < src.length; index += 1) {
      hash = ((hash << 5) - hash + src.charCodeAt(index)) | 0;
    }
  }
  iconRenderCodeSignatureMemo = `${lenSum.toString(36)}.${(hash >>> 0).toString(36)}`;
  return iconRenderCodeSignatureMemo;
}

// Zero-maintenance, absolute-coverage safety net behind the function-list signature:
// hash this script's own source. Any change to ANY icon-rendering code (including helpers
// not listed in iconRenderCodeSignature) changes the hash; reverting the code restores it.
// Async because reading the source needs a fetch, so it runs after first paint and heals
// any stale render the synchronous signature missed.
async function computeIconCodeSourceHash() {
  const getUrl = globalThis.chrome?.runtime?.getURL;
  if (typeof getUrl !== "function") {
    return "";
  }
  let combined = 0;
  let lenSum = 0;
  for (const file of ICON_CODE_SOURCE_FILES) {
    let text = "";
    try {
      const response = await fetch(getUrl(file));
      text = response.ok ? await response.text() : "";
    } catch {
      text = "";
    }
    if (!text) {
      return "";
    }
    lenSum += text.length;
    let hash = 0;
    for (let index = 0; index < text.length; index += 1) {
      hash = ((hash << 5) - hash + text.charCodeAt(index)) | 0;
    }
    combined = ((combined << 5) - combined + hash) | 0;
  }
  return `${lenSum.toString(36)}.${(combined >>> 0).toString(36)}`;
}

// Compare the live source hash against the last verified one. If the icon code changed
// since the render cache was written (e.g. an edit/revert to a helper the function-list
// signature does not cover), drop the render-output cache and re-render the displayed
// icons from current code. Unchanged source → no work; re-render is equality-gated so an
// unchanged-output edit produces no visible flash.
async function verifyIconCodeHashAndHealStaleIcons() {
  const hash = await computeIconCodeSourceHash();
  if (!hash) {
    return;
  }
  let stored = "";
  try {
    stored = localStorage.getItem(SITE_ICON_CODE_HASH_STORAGE_KEY) || "";
  } catch {
    stored = "";
  }
  if (stored === hash) {
    return;
  }
  try {
    localStorage.setItem(SITE_ICON_CODE_HASH_STORAGE_KEY, hash);
  } catch {}
  // First run (no stored hash) just records the baseline — nothing to heal.
  if (!stored) {
    return;
  }
  writeFirstPaintCache({ iconRenders: {} });
  refreshRenderedSiteIcons();
}

function readSiteIconRawSvgCache() {
  try {
    const cache = JSON.parse(localStorage.getItem(SITE_ICON_RAW_SVG_CACHE_STORAGE_KEY) || "{}");
    return cache && typeof cache === "object" && !Array.isArray(cache) ? cache : {};
  } catch {
    return {};
  }
}

function writeSiteIconRawSvgCacheEntry(path, svg) {
  const key = String(path || "");
  const text = String(svg || "");
  if (!key.startsWith(`${SITE_ICON_DIRECTORY}/`) || !text || text.length > MAX_CACHED_SITE_ICON_SVG_BYTES) {
    return;
  }
  const cache = readSiteIconRawSvgCache();
  cache[key] = { svg: text, updatedAt: Date.now(), version: firstPaintExtensionVersion() };
  const evictPast = (entries, keepCount) => {
    entries
      .sort(([, first], [, second]) => Number(second?.updatedAt || 0) - Number(first?.updatedAt || 0))
      .slice(keepCount)
      .forEach(([staleKey]) => delete cache[staleKey]);
  };
  evictPast(Object.entries(cache), MAX_CACHED_SITE_ICON_SVG_ENTRIES);
  try {
    localStorage.setItem(SITE_ICON_RAW_SVG_CACHE_STORAGE_KEY, JSON.stringify(cache));
  } catch {
    evictPast(Object.entries(cache), Math.floor(MAX_CACHED_SITE_ICON_SVG_ENTRIES / 2));
    try {
      localStorage.setItem(SITE_ICON_RAW_SVG_CACHE_STORAGE_KEY, JSON.stringify(cache));
    } catch {}
  }
}

function rememberSiteIconRawSvgText(path, svg) {
  const key = String(path || "");
  const text = String(svg || "");
  if (!key || !text) {
    return;
  }
  siteIconRawSvgTextCache.set(key, text);
  // Freshly fetched under the current version → no longer version-stale.
  siteIconRawSvgStalePaths.delete(key);
  writeSiteIconRawSvgCacheEntry(key, text);
}

function localSiteIconRawSvgText(path) {
  return siteIconRawSvgTextCache.get(String(path || "")) || "";
}

// Run the existing synchronous analysis pipeline over cached SVG text so tile/brand-color
// decisions are warm before first paint. Never overrides an analysis already present
// (e.g. remote-brand overrides set elsewhere).
function hydrateLocalSiteIconAnalysisFromText(path, svg) {
  const key = String(path || "");
  const text = String(svg || "");
  if (!key || !text || localSiteIconRenderModeCache.has(key)) {
    return;
  }
  cacheLocalSiteIconAnalysis(key, localSiteIconAnalysisFromSvg(text));
}

function primeSiteIconRawSvgCacheFromStorage() {
  const cache = readSiteIconRawSvgCache();
  Object.entries(cache).forEach(([path, entry]) => {
    const text = typeof entry?.svg === "string" ? entry.svg : "";
    if (!text) {
      return;
    }
    siteIconRawSvgTextCache.set(path, text);
    hydrateLocalSiteIconAnalysisFromText(path, text);
    // ponytail: unpacked extensions can replace an SVG without changing the manifest
    // version; revalidate only displayed paths once per page so edits self-heal on refresh.
    siteIconRawSvgStalePaths.add(path);
  });
}

function invalidateLocalSiteIconRenderCaches(path) {
  const key = String(path || "");
  if (!key) {
    return;
  }
  localSiteIconBrandColorCache.delete(key);
  localSiteIconRenderModeCache.delete(key);
  localSiteIconExplicitBrandColorCache.delete(key);
  localSiteIconVisibleColorsCache.delete(key);
  localSiteIconEmbeddedCarrierColorCache.delete(key);
  localSiteIconBrandColorRequests.delete(key);
  for (const memoKey of [...whiteSvgIconDataUrlCache.keys()]) {
    if (memoKey.endsWith(`:${key}`)) {
      whiteSvgIconDataUrlCache.delete(memoKey);
    }
  }
}

function scheduleIconIdleTask(task) {
  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(task, { timeout: 2000 });
  } else {
    setTimeout(task, 200);
  }
}

// Background self-heal for a displayed local icon. This also covers unpacked extensions
// where a bundled SVG changes without a manifest-version bump.
// Re-renders only when the file actually changed — unchanged files just re-stamp silently,
// so the user never sees a reload for a fixed-style icon.
function revalidateDisplayedLocalSiteIcon(path) {
  const key = String(path || "");
  if (!siteIconRawSvgStalePaths.has(key) || siteIconRawSvgRevalidatedPaths.has(key)) {
    return;
  }
  siteIconRawSvgRevalidatedPaths.add(key);
  fetch(key, { cache: "no-store" })
    .then((response) => response.ok ? response.text() : "")
    .then((svg) => {
      if (!svg) {
        siteIconRawSvgStalePaths.delete(key);
        return;
      }
      const previous = siteIconRawSvgTextCache.get(key) || "";
      rememberSiteIconRawSvgText(key, svg);
      if (svg === previous) {
        return;
      }
      invalidateLocalSiteIconRenderCaches(key);
      hydrateLocalSiteIconAnalysisFromText(key, svg);
      document.querySelectorAll("img[data-site-url]").forEach((node) => {
        if (node.dataset.iconSource !== key) {
          return;
        }
        applySiteIcon(node, {
          title: node.dataset.siteTitle || node.alt || "",
          url: node.dataset.siteUrl || ""
        });
      });
    })
    .catch(() => {});
}


const WayleafIcon = Object.freeze({
  iconRenderCodeSignature,
  primeSiteIconRawSvgCacheFromStorage,
  verifyIconCodeHashAndHealStaleIcons,
  discoverFavoriteSiteIcon,
  discoverSiteIconDataUrl,
  initSiteIconIndex,
  localIconForUrl,
  cachedFirstPaintIconRender,
  restoreFirstPaintIconRender,
  cacheRenderedSiteIcon,
  cacheRenderedSiteIconOnLoad,
  applySiteIcon,
  applyExplicitSiteIcon,
  applyGeneratedSiteIcon,
  applyHistoryIcon,
  refreshAdaptiveSiteIcons,
  refreshRenderedSiteIcons,
  siteIconDirectory: SITE_ICON_DIRECTORY,
  genericFallbackIcon: GENERIC_SITE_FALLBACK_ICON
});

window.WayleafIcon = WayleafIcon;
