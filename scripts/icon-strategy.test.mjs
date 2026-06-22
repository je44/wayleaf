import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");
const siteIconIndex = JSON.parse(readFileSync(new URL("../icons/sites/index.json", import.meta.url), "utf8"));
const zhihuSvgSource = readFileSync(new URL("../icons/sites/zhihu.svg", import.meta.url), "utf8");
const linkedInSvgSource = readFileSync(new URL("../icons/sites/linkedin.svg", import.meta.url), "utf8");
const grokSvgSource = readFileSync(new URL("../icons/sites/grok.svg", import.meta.url), "utf8");
const availableSiteIconFiles = new Set(siteIconIndex);
const LOCAL_BRAND_CARRIER_CONTRAST_MIN = 2.75;
const SITE_ICON_TILE_COLOR_BY_SITE_KEY_FOR_TEST = Object.freeze({
  "1688.com": "#ff6000",
  "aistudio.google.com": "#4285f4",
  "aws.amazon.com": "#ff9900",
  "azure.microsoft.com": "#0078d4",
  "b.ai": "#111827",
  "baidu.com": "#2932e1",
  "bilibili.com": "#00a1d6",
  "bitbucket.org": "#0052cc",
  "chrome.google.com": "#4285f4",
  "cloud.google.com": "#4285f4",
  "colab.research.google.com": "#f9ab00",
  "developer.mozilla.org": "#15141a",
  "chatglm.cn": "#3859ff",
  "doubao.com": "#1e37fc",
  "douyin.com": "#000000",
  "firefly.adobe.com": "#ff0000",
  "firebase.google.com": "#dd2c00",
  "google.com": "#4285f4",
  "grok.com": "#000000",
  "huggingface.co": "#ffd21e",
  "instagram.com": "#e4405f",
  "jd.com": "#ff0000",
  "jimeng.jianying.com": "#1c6fff",
  "kimi.com": "#111827",
  "linkedin.com": "#0a66c2",
  "mimo.mi.com": "#000000",
  "mimo.xiaomi.com": "#000000",
  "raycast.com": "#ff6363",
  "spotify.com": "#1ed760",
  "suno.com": "#000000",
  "tiktok.com": "#000000",
  "xiaomimimo.com": "#000000",
  "zhihu.com": "#0084ff"
});
const MULTICOLOR_BRAND_ICON_SITE_KEYS_FOR_TEST = new Set([
  "alipay.com",
  "doubao.com",
  "douyin.com",
  "instagram.com",
  "google.com",
  "huggingface.co",
  "jimeng.jianying.com",
  "tiktok.com"
]);
const ORIGINAL_ARTWORK_BRAND_TILE_SITE_KEYS_FOR_TEST = new Set([
  "developer.mozilla.org",
  "jd.com"
]);
const REMOTE_BRAND_ICON_DIRECT_FETCH_SCORE_MIN = 90;

assert.match(source, /viewbox=auto/, "Simple Icons CDN requests should normalize the SVG viewBox.");
assert.match(source, /@lobehub\/icons-static-svg/, "LobeHub static SVG package must be available as a supplemental remote provider.");
assert.match(source, /function remoteBrandProviderHasSlug[\s\S]*remoteBrandProviderSlugs/, "Remote providers must check an index before fetching a slug.");
assert.match(source, /function fetchLobeHubStaticSvgSlugs/, "LobeHub provider must discover SVG slugs from the static SVG package index.");
assert.match(source, /function fetchSimpleIconSlugs/, "Simple Icons provider must discover SVG slugs from its package index.");
assert.match(source, /function fetchIconifyCollectionSlugs/, "Iconify provider must discover SVG slugs from the Simple Icons collection index.");
assert.match(source, /if \(cachedEntry\?\.request\) \{[\s\S]*return cachedEntry\.request;/, "Concurrent icon cards should share one provider index request.");
assert.match(source, /return remoteBrandGlyphColorForTile\(tileColor, brandColor\);/, "Remote SVG data URLs must use the cloud glyph strategy.");
assert.match(source, /return localBrandGlyphColorForTile\(tileColor, brandColor\);/, "Local brand icons must keep the local glyph strategy with known VI color recovery.");
assert.match(source, /function remoteBrandSvgHasComplexPaint/, "Remote SVG classification must reject complex paint sources.");
assert.match(source, /function remoteBrandSvgQuality/, "Remote SVGs must pass a quality gate before being cached.");
assert.match(source, /function remoteBrandIconRankedCandidates/, "Remote slug candidates must be ranked before fetching.");
assert.match(source, /data-wayleaf-render-mode/, "Remote SVGs must carry a render mode descriptor.");
assert.match(source, /remoteBrandSvgDescriptorFromSource\(siteIcon\)/, "Cached remote SVGs must drive their own tile strategy.");
assert.match(source, /function remoteBrandSvgCacheStrategy/, "Remote SVG cache entries must retain a strategy descriptor.");
assert.match(source, /const isLocalIconSource = String\(iconPath \|\| ""\)\.startsWith\("icons\/"\);/, "Only deployed local icon files should receive the local icon marker.");
assert.match(source, /function remoteBrandSvgResponseMayContainSvg/, "Provider responses must reject explicit non-SVG content types.");
assert.match(source, /function remoteBrandIconMissCacheIsFresh/, "Provider misses must have an explicit freshness gate.");
assert.match(source, /function remoteBrandProviderColorLooksDrifted/, "Provider color drift must be detected against known local VI colors.");
assert.match(source, /remoteBrandSvgBrandColor\(svg, options\)/, "Fetched provider SVGs must derive brand color through the provider trust gate.");
assert.match(source, /SITE_ICON_TILE_COLOR_BY_SITE_KEY\[options\.siteKey\]/, "Provider color drift checks must compare against known local VI colors.");
assert.match(source, /function keepsBrandIconOriginalOnBrandTile/, "Local SVGs with an embedded VI carrier can preserve original artwork on a brand tile.");
assert.match(source, /"suno\.com": "#000000"/, "Suno's monochrome local SVG must share the black/white mask carrier used by X and GitHub.");
assert.doesNotMatch(source, /nativeRoundedBrandIcon|NATIVE_ROUNDED_BRAND_ICON_SITE_KEYS/, "Grok must not keep a dedicated native-rounded SVG rendering branch.");
assert.match(zhihuSvgSource, /<path\b/i, "Zhihu local SVG keeps a maskable path resource.");
assert.match(linkedInSvgSource, /fill:\s*rgb\(0,\s*0,\s*0\)/i, "LinkedIn local SVG exercises inline style recoloring.");
assert.match(source, /function discoverRemoteBrandIconDataUrl[\s\S]*localIconForUrl\(parsedUrl\.href\)[\s\S]*return "";/, "Remote provider discovery must short-circuit for deployed local icons.");
assert.match(source, /function refreshRemoteBrandIcon[\s\S]*localIconForUrl\(site\.url\)[\s\S]*return;/, "Async remote refresh must short-circuit for deployed local icons.");
assert.match(source, /const GENERIC_SITE_FALLBACK_ICON = `\$\{SITE_ICON_DIRECTORY\}\/fallback\.svg`;/, "No-site-ico fallback should use the full SVG asset instead of the old PNG tile.");
assert.doesNotMatch(source, /generic-site-fallback\.png/, "Runtime fallback rendering must not use the legacy PNG asset.");
assert.match(source, /function createSiteCard[\s\S]*renderSharedSiteIcon\(icon, site, options\);/, "Navigation hub site cards must render through the shared icon context.");
assert.match(source, /function createPortalCategorySection[\s\S]*createSiteCard\(portal, \{[\s\S]*favoriteIconMap: group\.favoriteIconMap,[\s\S]*iconRenders: group\.iconRenders[\s\S]*\}\);/, "Navigation hub categories must pass the shared favorite and first-paint icon context.");
assert.match(source, /function renderSelectedBookmarkFolder[\s\S]*const favoriteIconMap = favoriteSiteIconMap\(favoriteSites\);[\s\S]*const iconRenders = readFirstPaintCache\(\)\.iconRenders;[\s\S]*createBookmarkInitialSection\(group, \{ favoriteKeys, favoriteIconMap, iconRenders \}\)/, "Navigation hub bookmark view must use the same shared icon context as smart shortcuts.");
assert.match(source, /function renderSharedSiteIcon[\s\S]*cachedFirstPaintIconRender\(options\.iconRenders, iconSite\)[\s\S]*restoreFirstPaintIconRender\(icon, iconSite, cachedIconRender\)[\s\S]*applySiteIcon\(icon, iconSite\);/, "Shared site cards must restore cached renders before falling back to the existing icon algorithm.");
assert.match(source, /function applySiteIcon[\s\S]*iconSourceCanUseBitmapTileFusion\(iconSource\)[\s\S]*applyFaviconMatchedTile\(icon\);/, "Local and stored bitmap site icons must enter the shared favicon tile sampler.");
assert.match(source, /function applyIconCandidate[\s\S]*iconSourceCanUseBitmapTileFusion\(nextIcon\)[\s\S]*applyFaviconMatchedTile\(icon\);/, "Fallback local and cloud bitmap icon candidates must enter the shared favicon tile sampler.");
assert.match(source, /function applyFaviconMatchedTile[\s\S]*iconSourceCanUseBitmapTileFusion\(candidateToken\)[\s\S]*icon\.dataset\.iconTile !== "plain" && icon\.dataset\.iconTile !== "brand"/, "Bitmap fusion should accept both plain favicon tiles and local brand bitmap tiles.");
assert.match(source, /function applySampledFaviconTile[\s\S]*const tileMode = icon\.dataset\.iconTile === "brand" \? "brand" : "plain";[\s\S]*fuseEmbeddedFaviconTile\(icon, sample, color, tileColors\);/, "Sampled favicon tiles must preserve local bitmap markers and run embedded tile fusion.");

function normalizeHexColor(tileColor) {
  const color = String(tileColor || "").trim();
  const match = color.match(/^#([0-9a-f]{6})$/i);
  return match ? `#${match[1].toLowerCase()}` : "";
}

function hexToRgb(color) {
  const normalized = normalizeHexColor(color).slice(1);
  return [0, 2, 4].map((start) => parseInt(normalized.slice(start, start + 2), 16));
}

function relativeLuminance(color) {
  return hexToRgb(color)
    .map((channel) => {
      const normalized = channel / 255;
      return normalized <= 0.03928
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4;
    })
    .reduce((total, channel, index) => total + channel * [0.2126, 0.7152, 0.0722][index], 0);
}

function contrastRatio(colorA, colorB) {
  const [lighter, darker] = [relativeLuminance(colorA), relativeLuminance(colorB)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
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

function localBrandGlyphColor(tileColor) {
  const color = normalizeHexColor(tileColor);
  if (!color) {
    return "";
  }
  return nearWhiteBrandColor(color) ? readableIconGlyphColor(color) : "#ffffff";
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
  if (contrastRatio(tile, brand) >= LOCAL_BRAND_CARRIER_CONTRAST_MIN) {
    return brand;
  }
  return readableIconGlyphColor(tile);
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

function remoteBrandTilePrefersDarkGlyph(tileColor) {
  const stats = hexColorStats(tileColor);
  if (!stats) {
    return false;
  }
  if (nearWhiteBrandColor(tileColor)) {
    return true;
  }
  const whiteIsTooWeak = stats.lightContrast < 2.85 && stats.darkContrast >= 3;
  const warmBright = stats.hue >= 30 && stats.hue <= 95 && stats.luminance >= 0.38;
  const vividBright = stats.luminance >= 0.46 && stats.darkContrast >= stats.lightContrast + 2;
  return whiteIsTooWeak || warmBright || vividBright;
}

function remoteBrandGlyphColor(tileColor) {
  const color = normalizeHexColor(tileColor);
  if (!color) {
    return "";
  }
  return remoteBrandTilePrefersDarkGlyph(color) ? "#102019" : "#ffffff";
}

function remoteBrandGlyphColorForTile(tileColor, brandColor = "") {
  const tile = normalizeHexColor(tileColor);
  const brand = normalizeHexColor(brandColor);
  if (!tile) {
    return "";
  }
  if (brand && tile !== brand && contrastRatio(tile, brand) >= 3) {
    return "";
  }
  return remoteBrandGlyphColor(tile);
}

function remoteBrandIconSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\+/g, "plus")
    .replace(/\./g, "dot")
    .replace(/[^a-z0-9]+/g, "");
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

function remoteBrandIconSlugCandidatesForTest(siteKey, siteName = "", aliases = []) {
  const candidates = [];
  const addCandidate = (value, score, source) => {
    const slug = remoteBrandIconSlug(value);
    if (!slug || (slug.length < 2 && slug !== "x")) {
      return;
    }
    candidates.push({ slug, score, source });
  };
  aliases.forEach((slug, index) => addCandidate(slug, index === 0 ? 100 : 88, "alias"));
  const labels = siteKey.split(".").filter(Boolean);
  if (labels.length) {
    const registrableLabels = labels.length <= 2 ? labels.slice(0, 1) : labels.slice(0, -1);
    addCandidate(registrableLabels.join(""), 92, "registrable");
    addCandidate(labels.join(""), 74, "host");
    addCandidate(labels[0], 68, "host-label");
  }
  addCandidate(siteName, 64, "site-name");
  return remoteBrandIconRankedCandidates(candidates).slice(0, 8);
}

function remoteBrandSlugsFromFileListForTest(files, pattern) {
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

function remoteBrandProviderHasSlugForTest(slugs, slug) {
  const normalizedSlug = remoteBrandIconSlug(slug);
  return Boolean(normalizedSlug && slugs.has(normalizedSlug));
}

function remoteBrandShouldFetchCandidateForTest(slugs, candidate) {
  return remoteBrandProviderHasSlugForTest(slugs, candidate.slug)
    || candidate.score >= REMOTE_BRAND_ICON_DIRECT_FETCH_SCORE_MIN;
}

const SITE_ICON_FILE_BY_SITE_KEY_FOR_TEST = Object.freeze({
  "1688.com": "1688.ico",
  "alipay.com": "alipay.svg",
  "aistudio.google.com": "aistudio.svg",
  "atlassian.net": "jira.svg",
  "aws.amazon.com": "aws.svg",
  "azure.microsoft.com": "azure.svg",
  "b.ai": "bai.png",
  "bitbucket.org": "bitbucket.svg",
  "calendar.google.com": "googlecalendar.svg",
  "chrome.google.com": "chrome.svg",
  "chatglm.cn": "glm.svg",
  "cloud.google.com": "googlecloud.svg",
  "colab.research.google.com": "colab.svg",
  "developer.mozilla.org": "mdn.svg",
  "doubao.com": "doubao.svg",
  "douyin.com": "douyin.svg",
  "docs.google.com": "googledocs.svg",
  "drive.google.com": "googledrive.svg",
  "firefly.adobe.com": "adobefirefly.svg",
  "firebase.google.com": "firebase.svg",
  "gemini.google.com": "googlegemini.svg",
  "jimeng.jianying.com": "jimeng.svg",
  "maps.google.com": "googlemaps.svg",
  "meet.google.com": "googlemeet.svg",
  "mimo.mi.com": "xiaomimimo.svg",
  "mimo.xiaomi.com": "xiaomimimo.svg",
  "music.163.com": "neteasecloudmusic.svg",
  "kimi.com": "kimi.svg",
  "npmjs.com": "npm.svg",
  "office.com": "microsoftoffice.svg",
  "stackoverflow.com": "stackoverflow.svg",
  "teams.microsoft.com": "microsoftteams.svg"
});

function localIconForSiteKeyForTest(siteKey) {
  const fileName = SITE_ICON_FILE_BY_SITE_KEY_FOR_TEST[siteKey] || `${String(siteKey || "").split(".")[0]}.svg`;
  return availableSiteIconFiles.has(fileName) ? `icons/sites/${fileName}` : "";
}

function remoteProviderCanRunForSiteKeyForTest(siteKey) {
  return !localIconForSiteKeyForTest(siteKey);
}

function remoteBrandSvgHasComplexPaint(svg) {
  const text = String(svg || "");
  return /<(?:linearGradient|radialGradient|meshgradient|pattern|filter|mask)\b/i.test(text)
    || /\s(?:fill|stroke)\s*=\s*(["'])\s*url\(/i.test(text)
    || /(?:fill|stroke)\s*:\s*url\(/i.test(text);
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

function remoteBrandSvgLooksUsable(svg) {
  const text = String(svg || "").trim();
  return text.length > 0
    && text.length <= 80 * 1024
    && remoteBrandSvgHasRootElement(text)
    && !/<script\b/i.test(text);
}

function remoteBrandSvgHasRootElement(svg) {
  return /^(?:\s*<\?xml[^>]*>\s*)?(?:\s*<!doctype[^>]*>\s*)?<svg\b/i.test(String(svg || ""));
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
  const mime = String(contentType || "").split(";")[0].trim().toLowerCase();
  if (mime === "image/svg+xml") {
    return true;
  }
  if (mime && !/^(?:application\/octet-stream|text\/plain)$/i.test(mime)) {
    return false;
  }
  return /\.svg(?:[?#].*)?$/i.test(String(url || ""));
}

function siteIconCacheEntryIsFresh(entry, ttl, now) {
  return Boolean(entry && now - Number(entry.updatedAt || 0) <= ttl);
}

function remoteBrandIconMissCacheIsFresh(entry, ttl, now) {
  return Boolean(entry?.missing && entry?.source === "remote-brand" && siteIconCacheEntryIsFresh(entry, ttl, now));
}

function remoteBrandDescriptorTileColors(brandColor, renderMode = "mask") {
  const color = normalizeHexColor(brandColor);
  if (renderMode === "original") {
    return {
      light: "#ffffff",
      dark: "#f8fafc"
    };
  }
  if (!color) {
    return {
      light: "#ffffff",
      dark: "#f8fafc"
    };
  }
  if (nearWhiteBrandColor(color)) {
    return {
      light: "#000000",
      dark: "#f8fafc"
    };
  }
  return {
    light: color,
    dark: "#f8fafc"
  };
}

function remoteBrandSvgDescriptor(svg, options = {}) {
  const brandColor = normalizeHexColor(options.brandColor || "") || "";
  const isMonochrome = remoteBrandSvgIsMonochrome(svg);
  const renderMode = isMonochrome ? "mask" : "original";
  const tileColors = remoteBrandDescriptorTileColors(brandColor, renderMode);
  return {
    brandColor,
    isMonochrome,
    renderMode,
    tileLight: tileColors.light,
    tileDark: tileColors.dark,
    glyphLight: renderMode === "mask" ? remoteBrandGlyphColorForTile(tileColors.light, brandColor) : "",
    glyphDark: renderMode === "mask" ? remoteBrandGlyphColorForTile(tileColors.dark, brandColor) : "",
    qualityScore: Math.max(0, Math.min(100, Math.round(Number(options.qualityScore || 0))))
  };
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
    tileLight: descriptor.tileLight,
    tileDark: descriptor.tileDark,
    glyphLight: descriptor.glyphLight,
    glyphDark: descriptor.glyphDark,
    qualityScore: descriptor.qualityScore
  };
}

function svgTextDataUrl(svg) {
  return `data:image/svg+xml,${encodeURIComponent(String(svg || ""))}`;
}

function remoteBrandSvgDataAttribute(svg, name) {
  const match = String(svg || "").match(new RegExp(`\\sdata-wayleaf-${name}=(["'])([^"']*)\\1`, "i"));
  return match?.[2] || "";
}

function remoteBrandSvgGlyphAttribute(value) {
  return value === "original" ? "" : normalizeHexColor(value);
}

function remoteBrandSvgDescriptorFromSource(source) {
  const svg = decodeURIComponent(String(source || "").slice(String(source || "").indexOf(",") + 1));
  if (!/\sdata-wayleaf-remote-brand=(["'])true\1/i.test(svg)) {
    return null;
  }
  const attr = (name) => remoteBrandSvgDataAttribute(svg, name);
  return {
    brandColor: normalizeHexColor(attr("brand-color")),
    isMonochrome: attr("monochrome") === "true",
    renderMode: attr("render-mode") || "mask",
    tileLight: normalizeHexColor(attr("tile-light")),
    tileDark: normalizeHexColor(attr("tile-dark")),
    glyphLight: remoteBrandSvgGlyphAttribute(attr("glyph-light")),
    glyphDark: remoteBrandSvgGlyphAttribute(attr("glyph-dark")),
    qualityScore: Number(attr("quality") || 0)
  };
}

function prepareRemoteBrandSvgForTest(svg, options = {}) {
  const descriptor = remoteBrandSvgDescriptor(svg, options);
  const color = descriptor.brandColor;
  return String(svg || "").trim().replace(/<svg\b([^>]*)>/i, (match, attrs) => {
    const brandAttr = color ? ` data-wayleaf-brand-color="${color}"` : "";
    const metadataAttrs = [
      `data-wayleaf-remote-brand="true"`,
      `data-wayleaf-monochrome="${descriptor.isMonochrome ? "true" : "false"}"`,
      `data-wayleaf-render-mode="${descriptor.renderMode}"`,
      `data-wayleaf-tile-light="${descriptor.tileLight}"`,
      `data-wayleaf-tile-dark="${descriptor.tileDark}"`,
      `data-wayleaf-glyph-light="${descriptor.glyphLight || "original"}"`,
      `data-wayleaf-glyph-dark="${descriptor.glyphDark || "original"}"`,
      `data-wayleaf-quality="${descriptor.qualityScore}"`
    ];
    return `<svg${attrs} ${metadataAttrs.join(" ")}${brandAttr}>`;
  });
}

function normalizeSvgHexColor(value) {
  const color = String(value || "").trim().toLowerCase();
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
  return "";
}

function extractSvgColorPalette(svg) {
  const palette = [];
  const seen = new Set();
  const pushColor = (value) => {
    const color = normalizeSvgHexColor(value);
    if (!color || seen.has(color)) {
      return;
    }
    seen.add(color);
    palette.push(color);
  };
  const text = String(svg || "");
  const colorAttributeMatches = text.matchAll(/\s(?:fill|stroke|color)\s*=\s*(["'])(#[0-9a-f]{3,8})\1/gi);
  for (const match of colorAttributeMatches) {
    pushColor(match[2]);
  }
  const inlineStyleMatches = text.matchAll(/(?:^|["'{;\s])(?:fill|stroke|color)\s*:\s*(#[0-9a-f]{3,8})\b/gi);
  for (const match of inlineStyleMatches) {
    pushColor(match[1]);
  }
  return palette;
}

function remoteBrandSvgIsMonochrome(svg) {
  if (remoteBrandSvgHasComplexPaint(svg)) {
    return false;
  }
  const palette = extractSvgColorPalette(svg);
  return palette.length <= 1;
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

function remoteBrandSvgBrandColor(svg, options = {}) {
  const palette = extractSvgColorPalette(svg);
  const localColor = normalizeHexColor(options.localColor || "");
  if (options.providerId === "simple-icons-cdn" && palette[0]) {
    return remoteBrandProviderColorLooksDrifted(palette[0], localColor) ? localColor : palette[0];
  }
  const expressiveColor = palette.find((color) => !remoteBrandColorLooksNeutral(color));
  return expressiveColor || localColor || "";
}

function remoteBrandProviderColorLooksDrifted(providerColor, localColor) {
  const provider = normalizeHexColor(providerColor);
  const local = normalizeHexColor(localColor);
  if (!provider || !local || remoteBrandColorLooksNeutral(provider)) {
    return false;
  }
  const [providerRed, providerGreen, providerBlue] = hexToRgb(provider);
  const [localRed, localGreen, localBlue] = hexToRgb(local);
  const distance = Math.hypot(providerRed - localRed, providerGreen - localGreen, providerBlue - localBlue);
  return distance > 96 && contrastRatio(provider, local) > 1.35;
}

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
const FAVICON_TRANSPARENT_GLYPH_CANDIDATE_RATIO_MIN = 0.58;
const FAVICON_NEAR_WHITE_GLYPH_LUMINANCE_MIN = 0.82;
const FAVICON_NEAR_WHITE_GLYPH_FOREGROUND_COVERAGE_MAX = 0.035;
const FAVICON_EDGE_CARRIER_CONFIDENCE_MIN = 0.48;
const FAVICON_EMBEDDED_TILE_EDGE_CONFIDENCE_MAX = 0.24;
const FAVICON_EMBEDDED_TILE_INNER_CONFIDENCE_MIN = 0.34;
const FAVICON_EMBEDDED_TILE_CONTRAST_MIN = 1.35;
const FAVICON_EMBEDDED_TILE_CONTRAST_MAX_MIX = 0.42;
const FAVICON_EMBEDDED_TILE_FUSION_CLEAR_DISTANCE = 48;
const FAVICON_EMBEDDED_TILE_FUSION_FEATHER_DISTANCE = 24;
const FAVICON_READABLE_CARRIER_CONTRAST_MIN = 3;
const FAVICON_READABLE_CARRIER_MAX_MIX = 0.72;
const GENERIC_SITE_FALLBACK_TILE_COLOR = "#f04424";

function rgbaSample(size, painter) {
  const data = new Uint8ClampedArray(size * size * 4);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const index = (y * size + x) * 4;
      const pixel = painter(x, y, size) || [0, 0, 0, 0];
      data[index] = pixel[0] || 0;
      data[index + 1] = pixel[1] || 0;
      data[index + 2] = pixel[2] || 0;
      data[index + 3] = pixel[3] || 0;
    }
  }
  return { data, size };
}

function hexChannels(color) {
  return [...hexToRgb(color), 255];
}

function rgbChannelsToHex(red, green, blue) {
  return `#${[red, green, blue].map((channel) => Math.round(Math.max(0, Math.min(255, channel)))
    .toString(16)
    .padStart(2, "0")).join("")}`;
}

function samplePixelAlpha(sample, x, y) {
  return sample.data[(y * sample.size + x) * 4 + 3];
}

function rgbToHex(channels) {
  return `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function mixHexColors(color, target, amount) {
  const sourceRgb = hexToRgb(color);
  const targetRgb = hexToRgb(target);
  return rgbToHex(sourceRgb.map((channel, index) => {
    return Math.round(channel + (targetRgb[index] - channel) * amount);
  }));
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

function colorChannelSpread(red, green, blue) {
  return Math.max(red, green, blue) - Math.min(red, green, blue);
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
    const pixel = { x, y, red, green, blue, weight: alpha, edgeWeight: alpha * edgeWeight };
    pixels.push(pixel);
    const bucketKey = faviconColorBucketKey(red, green, blue);
    const bucket = buckets.get(bucketKey) || { red: 0, green: 0, blue: 0, weight: 0 };
    bucket.red += red * alpha;
    bucket.green += green * alpha;
    bucket.blue += blue * alpha;
    bucket.weight += alpha;
    buckets.set(bucketKey, bucket);
  }
  return { pixels, buckets, totalWeight: size * size, opaqueWeight, edgeSampleWeight };
}

function selectFaviconBackgroundCandidate(analysis, size) {
  if (!analysis.pixels.length || !analysis.buckets.size) {
    return null;
  }
  const baseBuckets = [...analysis.buckets.values()]
    .filter((bucket) => bucket.weight)
    .map(faviconAverageColorBucket)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 14);
  const candidates = baseBuckets
    .map((bucket) => faviconBackgroundCandidateFromBucket(bucket, analysis, size))
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || b.confidence - a.confidence);
  const candidate = (candidates[0]?.confidence || 0) >= FAVICON_BACKGROUND_CONFIDENCE_MIN
    ? candidates[0]
    : faviconTransparentGlyphCandidateFromBucket(baseBuckets[0], analysis);
  if (!candidate?.confidence) {
    return null;
  }
  const matchMode = faviconBackgroundMatchMode(candidate);
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
  return {
    ...selectedColor,
    paletteRed: Math.round(candidate.red),
    paletteGreen: Math.round(candidate.green),
    paletteBlue: Math.round(candidate.blue),
    confidence: candidate.confidence,
    coverage: candidate.coverage,
    opaqueCoverage: analysis.opaqueWeight / analysis.totalWeight,
    edgeConfidence: candidate.edgeConfidence,
    innerTileConfidence: candidate.innerTileConfidence,
    matchMode,
    foreground: faviconForegroundStatsForCandidate(selectedColor, analysis, size)
  };
}

function faviconTransparentGlyphCandidateFromBucket(bucket, analysis) {
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
  if (
    opaqueCoverage < FAVICON_TRANSPARENT_GLYPH_COVERAGE_MIN
    || opaqueCoverage > FAVICON_TRANSPARENT_GLYPH_COVERAGE_MAX
    || coverage / opaqueCoverage < FAVICON_TRANSPARENT_GLYPH_CANDIDATE_RATIO_MIN
    || edgeConfidence > FAVICON_TRANSPARENT_GLYPH_EDGE_CONFIDENCE_MAX
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
    score: FAVICON_BACKGROUND_CONFIDENCE_MIN
  };
}

function faviconForegroundStatsForCandidate(candidate, analysis, size) {
  const colorDistanceLimit = FAVICON_FOREGROUND_COLOR_DISTANCE ** 2;
  const background = { red: candidate.red, green: candidate.green, blue: candidate.blue };
  const backgroundHex = rgbChannelsToHex(candidate.red, candidate.green, candidate.blue);
  let weight = 0;
  let contrastWeight = 0;
  let maxContrast = 0;
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
    minX = Math.min(minX, pixel.x);
    minY = Math.min(minY, pixel.y);
    maxX = Math.max(maxX, pixel.x);
    maxY = Math.max(maxY, pixel.y);
  }
  if (!weight || maxX < minX || maxY < minY) {
    return { coverage: 0, averageContrast: 0, maxContrast: 0, spansCenter: false, span: 0 };
  }
  const bounds = { minX, minY, maxX, maxY };
  return {
    coverage: weight / Math.max(1, analysis.totalWeight),
    averageContrast: contrastWeight / weight,
    maxContrast,
    spansCenter: faviconCandidateSpansCenter(bounds, size),
    span: Math.max(maxX - minX + 1, maxY - minY + 1) / size
  };
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
  if (coverage < 0.14 || span < 0.38 || !faviconCandidateSpansCenter(bounds, size)) {
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
  const sideWeights = { top: 0, right: 0, bottom: 0, left: 0 };
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
  return { average: (rowRatio + columnRatio) / 2, rowRatio, columnRatio };
}

function dominantFaviconSampleBackgroundColor(sample) {
  return selectFaviconBackgroundCandidate(analyzeFaviconImageColors(sample.data, sample.size), sample.size);
}

function faviconCandidateHasLowContrastForeground(color) {
  const foreground = color.foreground || {};
  return (foreground.coverage || 0) >= FAVICON_LOW_CONTRAST_FOREGROUND_COVERAGE_MIN
    && (foreground.averageContrast || 0) <= FAVICON_LOW_CONTRAST_AVERAGE_MAX
    && (foreground.maxContrast || 0) <= FAVICON_LOW_CONTRAST_PEAK_MAX;
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
    || (color.edgeConfidence || 0) > FAVICON_TRANSPARENT_GLYPH_EDGE_CONFIDENCE_MAX
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

function faviconCandidateNeedsReadableCarrier(color, tileColor) {
  return faviconCandidateLooksLikeTransparentGlyph(color, tileColor)
    || faviconCandidateLooksLikeNearWhiteGlyph(color, tileColor);
}

function faviconShouldFuseEmbeddedTile(color, tileColor) {
  return Boolean(normalizeHexColor(tileColor))
    && color?.matchMode === "embedded-tile"
    && faviconCandidateHasEmbeddedForeground(color);
}

function fusedEmbeddedFaviconPixelData(sample, tileColor, embeddedTileColor = "") {
  const clearColor = normalizeHexColor(embeddedTileColor) || normalizeHexColor(tileColor);
  if (!sample?.data || !sample.size || !clearColor) {
    return null;
  }
  const [tileRed, tileGreen, tileBlue] = hexToRgb(clearColor);
  const clearLimit = FAVICON_EMBEDDED_TILE_FUSION_CLEAR_DISTANCE;
  const featherLimit = clearLimit + FAVICON_EMBEDDED_TILE_FUSION_FEATHER_DISTANCE;
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

function faviconMatchedTileColors(color) {
  if (!faviconColorShouldUseOriginalTile(color)) {
    return null;
  }
  const tileColor = rgbChannelsToHex(color.red, color.green, color.blue);
  if (color.matchMode === "embedded-tile") {
    return faviconSeparatedTileColors(tileColor, color);
  }
  return faviconSurfaceTileColors(tileColor, color);
}

function faviconSurfaceTileColors(tileColor, color) {
  const preferReadableCarrier = faviconCandidateNeedsReadableCarrier(color, tileColor);
  const carrier = faviconCarrierTileColor(tileColor, "dark", { preferReadableCarrier });
  return {
    light: carrier,
    dark: carrier
  };
}

function faviconSeparatedTileColors(tileColor, color) {
  const preferReadableCarrier = faviconCandidateNeedsReadableCarrier(color, tileColor);
  const carrier = faviconCarrierTileColor(tileColor, "dark", {
    preferReadableCarrier,
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
    return faviconReadableCarrierTileColor(color, mode);
  }
  if (!options.separate) {
    return color;
  }
  const luminance = relativeLuminance(color);
  const target = luminance < (mode === "dark" ? 0.48 : 0.58) ? "#ffffff" : "#000000";
  const initialAmount = mode === "dark" ? 0.18 : 0.24;
  return mixColorUntilContrast(color, target, FAVICON_EMBEDDED_TILE_CONTRAST_MIN, initialAmount);
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

function mixColorUntilContrast(color, target, minimumContrast, initialAmount, maxMix = FAVICON_EMBEDDED_TILE_CONTRAST_MAX_MIX) {
  for (let amount = initialAmount; amount <= maxMix; amount += 0.04) {
    const mixed = mixHexColors(color, target, amount);
    if (contrastRatio(color, mixed) >= minimumContrast) {
      return mixed;
    }
  }
  return mixHexColors(color, target, maxMix);
}

function faviconColorShouldUseOriginalTile(color) {
  return color.confidence >= FAVICON_BACKGROUND_CONFIDENCE_MIN;
}

function invertHexColor(color) {
  return rgbToHex(hexToRgb(color).map((channel) => 255 - channel));
}

function genericSiteFallbackTileColors() {
  return {
    light: GENERIC_SITE_FALLBACK_TILE_COLOR,
    dark: GENERIC_SITE_FALLBACK_TILE_COLOR
  };
}

function decodeSvgDataUrl(source) {
  const value = String(source || "");
  if (!/^data:image\/svg\+xml[,;]/i.test(value)) {
    return "";
  }
  const commaIndex = value.indexOf(",");
  if (commaIndex < 0) {
    return "";
  }
  const payload = value.slice(commaIndex + 1);
  if (/^data:image\/svg\+xml[^,]*;base64,/i.test(value)) {
    return Buffer.from(payload, "base64").toString("utf8");
  }
  return decodeURIComponent(payload);
}

function embeddedSvgBrandColorForTest(value) {
  const svg = decodeSvgDataUrl(value) || String(value || "");
  const match = svg.match(/\sdata-wayleaf-brand-color=(["'])(#[0-9a-f]{6})\1/i);
  return normalizeHexColor(match?.[2] || "");
}

function siteKeyForUrlForTest(url) {
  const parsedUrl = new URL(url);
  return parsedUrl.hostname.replace(/^www\./, "").toLowerCase();
}

function localIconForUrlForTest(url) {
  return localIconForSiteKeyForTest(siteKeyForUrlForTest(url));
}

function siteIconSourceLooksLikeSvgForTest(source) {
  const value = String(source || "");
  return value.endsWith(".svg") || /^data:image\/svg\+xml[,;]/i.test(value);
}

function iconSourceCanUseBitmapTileFusionForTest(source) {
  return Boolean(source)
    && !siteIconSourceLooksLikeSvgForTest(source)
    && !remoteBrandSvgDescriptorFromSource(source);
}

function remoteBrandSvgSourceIsMaskableForTest(source) {
  const descriptor = remoteBrandSvgDescriptorFromSource(source);
  if (descriptor) {
    return descriptor.renderMode === "mask";
  }
  const svg = decodeSvgDataUrl(source);
  if (!svg || !embeddedSvgBrandColorForTest(source)) {
    return false;
  }
  const match = svg.match(/\sdata-wayleaf-monochrome=(["'])(true|false)\1/i);
  return match ? match[2] === "true" : remoteBrandSvgIsMonochrome(svg);
}

function siteIconBrandColorForTest(siteKey = "", iconPath = "") {
  const remoteDescriptor = remoteBrandSvgDescriptorFromSource(iconPath);
  if (remoteDescriptor) {
    return remoteDescriptor.brandColor;
  }
  return normalizeHexColor(siteKey ? SITE_ICON_TILE_COLOR_BY_SITE_KEY_FOR_TEST[siteKey] || "" : "")
    || embeddedSvgBrandColorForTest(iconPath);
}

function remoteBrandDescriptorDisplayTileColorsForTest(descriptor) {
  const light = normalizeHexColor(descriptor?.tileLight || "");
  const dark = normalizeHexColor(descriptor?.tileDark || "");
  return light && dark
    ? { light, dark }
    : remoteBrandDescriptorTileColors(descriptor?.brandColor || "", descriptor?.renderMode || "mask");
}

function keepsBrandIconOriginalForTest(siteKey, iconPath = "") {
  if (keepsBrandIconOriginalOnBrandTileForTest(siteKey, iconPath)) {
    return true;
  }
  if (MULTICOLOR_BRAND_ICON_SITE_KEYS_FOR_TEST.has(siteKey)) {
    return true;
  }
  const remoteDescriptor = remoteBrandSvgDescriptorFromSource(iconPath);
  if (remoteDescriptor) {
    return remoteDescriptor.renderMode === "original";
  }
  if (!siteIconSourceLooksLikeSvgForTest(iconPath)) {
    return true;
  }
  return /^data:image\/svg\+xml[,;]/i.test(iconPath) && !remoteBrandSvgSourceIsMaskableForTest(iconPath);
}

function keepsBrandIconOriginalOnBrandTileForTest(siteKey, iconPath = "") {
  return ORIGINAL_ARTWORK_BRAND_TILE_SITE_KEYS_FOR_TEST.has(siteKey)
    && String(iconPath || "").startsWith("icons/")
    && siteIconSourceLooksLikeSvgForTest(iconPath);
}

function brandIconTileColorsForTest(tileColor, siteKey = "", iconPath = "") {
  const color = normalizeHexColor(tileColor);
  if (!color) {
    return { light: "#ffffff", dark: "#202922" };
  }
  if (keepsBrandIconOriginalOnBrandTileForTest(siteKey, iconPath)) {
    return { light: color, dark: color };
  }
  if (keepsBrandIconOriginalForTest(siteKey, iconPath)) {
    return { light: "#ffffff", dark: "#f8fafc" };
  }
  if (nearWhiteBrandColor(color)) {
    return { light: "#000000", dark: "#f8fafc" };
  }
  return { light: color, dark: "#f8fafc" };
}

class TestStyle {
  #values = new Map();

  setProperty(name, value) {
    this.#values.set(name, String(value));
  }

  getPropertyValue(name) {
    return this.#values.get(name) || "";
  }
}

class TestClassList {
  #values = new Set();

  toggle(name, force) {
    if (force) {
      this.#values.add(name);
    } else {
      this.#values.delete(name);
    }
  }

  contains(name) {
    return this.#values.has(name);
  }
}

class TestIcon {
  constructor() {
    this.dataset = {};
    this.style = new TestStyle();
    this.classList = new TestClassList();
    this.src = "";
  }

  getAttribute(name) {
    return name === "src" ? this.src : "";
  }

  removeAttribute(name) {
    if (name === "srcset") {
      this.srcset = "";
    }
  }
}

let testTheme = "light";

function currentIconTileColorForTest(icon) {
  if (testTheme === "dark") {
    return icon.style.getPropertyValue("--site-icon-tile-dark").trim();
  }
  return icon.style.getPropertyValue("--site-icon-tile").trim()
    || icon.style.getPropertyValue("--site-icon-tile-light").trim();
}

function applyIconTileForTest(icon, tileMode, tileColors, hasLocalIcon) {
  icon.dataset.iconTile = tileMode;
  icon.style.setProperty("--site-icon-tile", tileColors.light);
  icon.style.setProperty("--site-icon-tile-light", tileColors.light);
  icon.style.setProperty("--site-icon-tile-dark", tileColors.dark);
  icon.classList.toggle("site-icon-local", Boolean(hasLocalIcon));
}

function applySiteIconTileForTest(icon, site, iconPath = "") {
  const siteKey = siteKeyForUrlForTest(site.url);
  icon.dataset.siteKey = siteKey || "";
  const tileColor = siteIconBrandColorForTest(siteKey, iconPath);
  const tileMode = iconPath ? "brand" : "plain";
  const remoteDescriptor = remoteBrandSvgDescriptorFromSource(iconPath);
  const isLocalIconSource = String(iconPath || "").startsWith("icons/");
  let tileColors = { light: "#ffffff", dark: "#202922" };
  if (remoteDescriptor) {
    tileColors = remoteBrandDescriptorDisplayTileColorsForTest(remoteDescriptor);
  } else if (iconPath && tileColor) {
    tileColors = brandIconTileColorsForTest(tileColor, siteKey, iconPath);
  }
  applyIconTileForTest(icon, tileMode, tileColors, isLocalIconSource);
}

function shouldInvertBrandSvgForTest(icon, source) {
  const siteKey = icon.dataset.siteKey || siteKeyForUrlForTest(icon.dataset.siteUrl);
  if (keepsBrandIconOriginalForTest(siteKey, source)) {
    return false;
  }
  return Boolean(siteIconBrandColorForTest(siteKey, source));
}

function remoteBrandDescriptorGlyphColorForCurrentThemeForTest(source) {
  const descriptor = remoteBrandSvgDescriptorFromSource(source);
  if (!descriptor || descriptor.renderMode !== "mask") {
    return null;
  }
  return testTheme === "dark" ? descriptor.glyphDark : descriptor.glyphLight;
}

function iconGlyphColorForCurrentTileForTest(icon, source = "") {
  const tileColor = normalizeHexColor(currentIconTileColorForTest(icon));
  if (!tileColor) {
    return "";
  }
  const siteKey = icon.dataset.siteKey || siteKeyForUrlForTest(icon.dataset.siteUrl);
  const brandColor = siteIconBrandColorForTest(siteKey, source);
  if (/^data:image\/svg\+xml[,;]/i.test(source)) {
    const descriptorGlyph = remoteBrandDescriptorGlyphColorForCurrentThemeForTest(source);
    if (descriptorGlyph !== null) {
      return descriptorGlyph;
    }
    return remoteBrandGlyphColorForTile(tileColor, brandColor);
  }
  if (brandColor) {
    return localBrandGlyphColorForTile(tileColor, brandColor);
  }
  return readableIconGlyphColor(tileColor);
}

function applySvgGlyphColorForTest(svg, glyphColor) {
  const color = normalizeHexColor(glyphColor);
  if (!color) {
    return String(svg || "");
  }
  let output = String(svg || "");
  output = output.replace(/\sfill=(["'])([^"']*)\1/gi, (match, quote, value) => (
    /^(?:none|transparent)$/i.test(value) ? match : ` fill=${quote}${color}${quote}`
  ));
  output = output.replace(/\sstroke=(["'])([^"']*)\1/gi, (match, quote, value) => (
    /^(?:none|transparent)$/i.test(value) ? match : ` stroke=${quote}${color}${quote}`
  ));
  output = output.replace(/\scolor=(["'])([^"']*)\1/gi, (match, quote, value) => (
    /^(?:none|transparent)$/i.test(value) ? match : ` color=${quote}${color}${quote}`
  ));
  output = output.replace(/\sstyle=(["'])([^"']*)\1/gi, (match, quote, value) => {
    const nextValue = String(value).replace(/(^|;)(\s*)(fill|stroke|color)(\s*:\s*)([^;]+)/gi, (
      declaration,
      prefix,
      spacing,
      property,
      separator,
      rawValue
    ) => {
      const normalizedValue = String(rawValue || "").trim();
      return /^(?:none|transparent)$/i.test(normalizedValue)
        ? declaration
        : `${prefix}${spacing}${property}${separator}${color}`;
    });
    return ` style=${quote}${nextValue}${quote}`;
  });
  output = output.replace(/<svg\b([^>]*)>/i, (match, attrs) => (
    /\sfill=/i.test(attrs) ? `<svg${attrs}>` : `<svg${attrs} fill="${color}">`
  ));
  return output;
}

const LOCAL_SVG_SOURCE_BY_PATH_FOR_TEST = Object.freeze({
  "icons/sites/baidu.svg": '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M0 0h24v24H0z"/></svg>',
  "icons/sites/bilibili.svg": '<svg fill="#00a1d6" viewBox="0 0 24 24"><path d="M0 0h24v24H0z"/></svg>',
  "icons/sites/google.svg": '<svg viewBox="0 0 24 24"><path fill="#4285f4"/><path fill="#ea4335"/></svg>',
  "icons/sites/grok.svg": grokSvgSource,
  "icons/sites/linkedin.svg": linkedInSvgSource,
  "icons/sites/zhihu.svg": zhihuSvgSource
});

function coloredSvgIconSourceForTest(source, glyphColor) {
  const svg = /^data:image\/svg\+xml[,;]/i.test(source)
    ? decodeSvgDataUrl(source)
    : LOCAL_SVG_SOURCE_BY_PATH_FOR_TEST[source] || '<svg viewBox="0 0 24 24"><path fill="currentColor"/></svg>';
  return svgTextDataUrl(applySvgGlyphColorForTest(svg, glyphColor));
}

function displayIconSourceForTest(icon, source) {
  if (icon.dataset.iconTile !== "brand" || !siteIconSourceLooksLikeSvgForTest(source)) {
    return source;
  }
  if (!shouldInvertBrandSvgForTest(icon, source)) {
    return source;
  }
  const glyphColor = iconGlyphColorForCurrentTileForTest(icon, source);
  return glyphColor ? coloredSvgIconSourceForTest(source, glyphColor) : source;
}

function applySiteIconForTest(icon, site) {
  const localIcon = localIconForUrlForTest(site.url);
  const siteIcon = String(site.icon || "");
  const iconSource = localIcon || siteIcon;
  const siteIconIsRemoteBrand = Boolean(remoteBrandSvgDescriptorFromSource(siteIcon));
  const tileIconSource = localIcon || (siteIconIsRemoteBrand ? siteIcon : "");
  const shouldRefreshRemoteBrand = !localIcon && siteIcon && !siteIconIsRemoteBrand;
  icon.dataset.siteUrl = site.url || "";
  applySiteIconTileForTest(icon, site, tileIconSource);
  if (!iconSource) {
    return;
  }
  icon.dataset.iconSource = iconSource;
  icon.dataset.iconCandidate = iconSource;
  icon.src = displayIconSourceForTest(icon, iconSource);
  icon.removeAttribute("srcset");
  if (shouldRefreshRemoteBrand) {
    icon.dataset.remoteBrandRefreshEligible = "true";
  }
}

function refreshAdaptiveSiteIconsForTest(icons) {
  for (const icon of icons) {
    if (icon.dataset.iconTile !== "brand" || !icon.dataset.iconSource) {
      continue;
    }
    const source = icon.dataset.iconSource;
    icon.src = source;
    const nextSource = displayIconSourceForTest(icon, source);
    if (icon.dataset.iconSource === source) {
      icon.src = nextSource;
    }
  }
}

function discoverRemoteBrandIconDataUrlForTest(siteUrl, provider) {
  const localIcon = localIconForUrlForTest(siteUrl);
  if (localIcon) {
    return "";
  }
  return provider(siteKeyForUrlForTest(siteUrl));
}

function refreshRenderedSiteIconDecisionForTest(icon, site) {
  const localIcon = localIconForUrlForTest(site.url);
  if (icon.dataset.iconCacheHydrated === "true") {
    if (!localIcon) {
      return "refresh-remote-brand";
    }
    if (icon.dataset.iconSource === localIcon || icon.getAttribute("src") === localIcon) {
      return "keep-local-cache";
    }
  }
  return localIcon ? "rerender-local" : "rerender-site";
}

assert.equal(localBrandGlyphColor("#00a1d6"), "#ffffff", "Local bilibili keeps a white glyph on the blue tile.");
assert.equal(localBrandGlyphColor("#ffffff"), "#102019", "Local near-white brand tiles use a dark glyph.");
assert.equal(localBrandGlyphColorForTile("#2932e1", "#2932e1"), "#ffffff", "Local Baidu brand tiles keep a white glyph on blue.");
assert.equal(localBrandGlyphColorForTile("#f8fafc", "#2932e1"), "#2932e1", "Local Baidu SVGs recover the blue VI glyph on light carrier tiles.");
assert.equal(localBrandGlyphColorForTile("#f8fafc", "#d97757"), "#d97757", "Local Claude SVGs recover the clay VI glyph on light carrier tiles.");
assert.equal(localBrandGlyphColorForTile("#f8fafc", "#00a1d6"), "#00a1d6", "Local Bilibili SVGs recover the blue VI glyph on light carrier tiles.");
assert.equal(localBrandGlyphColorForTile("#f8fafc", "#1ed760"), "#102019", "Low-contrast local green glyphs fall back to a readable glyph on light carrier tiles.");
assert.equal(localBrandGlyphColorForTile("#f8fafc", "#ffcc00"), "#102019", "Low-contrast local yellow glyphs fall back to a readable glyph on light carrier tiles.");

assert.equal(remoteBrandGlyphColor("#00a1d6"), "#ffffff", "Remote brand blue near the contrast threshold should keep a white glyph.");
assert.equal(remoteBrandGlyphColor("#1db954"), "#102019", "Remote bright green should switch to a dark glyph for contrast.");
assert.equal(remoteBrandGlyphColor("#ffcc00"), "#102019", "Remote yellow should use a dark glyph.");
assert.equal(remoteBrandGlyphColorForTile("#f8fafc", "#362d59"), "", "Remote dark brand glyphs are preserved on light night tiles when contrast is sufficient.");
assert.equal(remoteBrandGlyphColorForTile("#f8fafc", "#ffcc00"), "#102019", "Remote light brand glyphs are replaced on light night tiles.");
assert.equal(remoteBrandGlyphColorForTile("#1ed760", "#1ed760"), "#102019", "Spotify green cloud tiles use a dark glyph in day mode.");
assert.equal(remoteBrandGlyphColorForTile("#181717", "#181717"), "#ffffff", "GitHub dark cloud tiles use a white glyph in day mode.");
assert.equal(remoteBrandGlyphColorForTile("#ffcc00", "#ffcc00"), "#102019", "Yandex yellow cloud tiles use a dark glyph in day mode.");
assert.equal(remoteBrandGlyphColorForTile("#000000", "#000000"), "#ffffff", "Notion black cloud tiles use a white glyph in day mode.");

const adaptiveFixtureSvg = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M0 0h24v24H0z"/></svg>';

{
  const remoteCachedIcon = svgTextDataUrl(prepareRemoteBrandSvgForTest(adaptiveFixtureSvg, { brandColor: "#1db954", qualityScore: 92 }));
  const providerCalls = [];
  const icon = new TestIcon();
  testTheme = "light";
  applySiteIconForTest(icon, { url: "https://www.baidu.com/search", icon: remoteCachedIcon });
  assert.equal(icon.dataset.iconSource, "icons/sites/baidu.svg", "A deployed local SVG must outrank a cached remote SVG data URL.");
  assert.equal(icon.dataset.iconCandidate, "icons/sites/baidu.svg", "Local SVG candidates must keep the local resource token.");
  assert.equal(icon.dataset.iconTile, "brand", "Local SVGs keep the brand tile mode.");
  assert.equal(icon.classList.contains("site-icon-local"), true, "Local SVGs keep the local icon marker.");
  assert.equal(icon.style.getPropertyValue("--site-icon-tile-light"), "#2932e1", "Local SVGs keep their known VI day tile.");
  assert.equal(icon.style.getPropertyValue("--site-icon-tile-dark"), "#f8fafc", "Local SVGs keep the local night carrier tile.");
  assert.match(decodeSvgDataUrl(icon.src), /fill="#ffffff"/, "Local SVG day glyphs render white on their brand tile.");
  assert.doesNotMatch(decodeSvgDataUrl(icon.src), /data-wayleaf-remote-brand/, "Local SVG display data must not inherit remote descriptor metadata.");
  assert.equal(discoverRemoteBrandIconDataUrlForTest("https://www.baidu.com/search", (siteKey) => {
    providerCalls.push(siteKey);
    return remoteCachedIcon;
  }), "", "Remote provider discovery short-circuits when a deployed local icon exists.");
  assert.deepEqual(providerCalls, [], "Local SVG discovery must not call the remote provider.");

  testTheme = "dark";
  refreshAdaptiveSiteIconsForTest([icon]);
  assert.equal(currentIconTileColorForTest(icon), "#f8fafc", "Dark refresh reads the local SVG night tile.");
  assert.match(decodeSvgDataUrl(icon.src), /fill="#2932e1"/, "Dark refresh restores the local known VI glyph instead of remote glyph rules.");
  assert.doesNotMatch(decodeSvgDataUrl(icon.src), /fill="#102019"/, "Local SVG dark refresh must not fall through to the cloud dark glyph.");

  testTheme = "light";
  refreshAdaptiveSiteIconsForTest([icon]);
  assert.equal(currentIconTileColorForTest(icon), "#2932e1", "Light refresh restores the local SVG day tile.");
  assert.match(decodeSvgDataUrl(icon.src), /fill="#ffffff"/, "Light refresh restores the local white glyph on the brand tile.");
}

{
  const remoteCachedIcon = svgTextDataUrl(prepareRemoteBrandSvgForTest(adaptiveFixtureSvg, { brandColor: "#1db954", qualityScore: 92 }));
  const icon = new TestIcon();
  testTheme = "light";
  applySiteIconForTest(icon, { url: "https://www.google.com/search", icon: remoteCachedIcon });
  assert.equal(icon.dataset.iconSource, "icons/sites/google.svg", "Local multicolor SVGs outrank cached remote SVG data URLs.");
  assert.equal(icon.classList.contains("site-icon-local"), true, "Local multicolor SVGs keep the local marker.");
  assert.equal(icon.style.getPropertyValue("--site-icon-tile-light"), "#ffffff", "Local multicolor SVGs keep a neutral day tile.");
  assert.equal(icon.style.getPropertyValue("--site-icon-tile-dark"), "#f8fafc", "Local multicolor SVGs keep a neutral night tile.");
  assert.equal(icon.src, "icons/sites/google.svg", "Local multicolor SVGs render original artwork without mask recoloring.");
  testTheme = "dark";
  refreshAdaptiveSiteIconsForTest([icon]);
  assert.equal(icon.src, "icons/sites/google.svg", "Local multicolor SVGs stay original after dark refresh.");
}

{
  const remoteCachedIcon = svgTextDataUrl(prepareRemoteBrandSvgForTest(adaptiveFixtureSvg, { brandColor: "#1db954", qualityScore: 92 }));
  const icon = new TestIcon();
  testTheme = "light";
  applySiteIconForTest(icon, { url: "https://www.jd.com/", icon: remoteCachedIcon });
  assert.equal(icon.dataset.iconSource, "icons/sites/jd.svg", "JD uses the deployed local SVG instead of cached remote SVGs.");
  assert.equal(icon.classList.contains("site-icon-local"), true, "JD keeps the local icon marker.");
  assert.equal(icon.style.getPropertyValue("--site-icon-tile-light"), "#ff0000", "JD local SVGs sit on the brand VI red day tile.");
  assert.equal(icon.style.getPropertyValue("--site-icon-tile-dark"), "#ff0000", "JD local SVGs keep the red carrier in dark mode.");
  assert.equal(icon.src, "icons/sites/jd.svg", "JD local SVGs preserve original artwork instead of mask recoloring the red carrier.");

  testTheme = "dark";
  refreshAdaptiveSiteIconsForTest([icon]);
  assert.equal(currentIconTileColorForTest(icon), "#ff0000", "Dark refresh keeps the JD brand red tile.");
  assert.equal(icon.src, "icons/sites/jd.svg", "Dark refresh does not recolor JD's original embedded red artwork.");
}

{
  const remoteSvg = svgTextDataUrl(prepareRemoteBrandSvgForTest(adaptiveFixtureSvg, { brandColor: "#ff0000", qualityScore: 92 }));
  const icon = new TestIcon();
  testTheme = "light";
  applySiteIconTileForTest(icon, { url: "https://www.jd.com/" }, remoteSvg);
  icon.dataset.iconSource = remoteSvg;
  icon.dataset.iconCandidate = remoteSvg;
  icon.src = displayIconSourceForTest(icon, remoteSvg);
  assert.match(decodeSvgDataUrl(icon.src), /fill="#ffffff"/, "Remote JD SVG descriptors still use mask recoloring instead of the local original-artwork branch.");
}

[
  {
    name: "Zhihu",
    url: "https://www.zhihu.com/",
    source: "icons/sites/zhihu.svg",
    tile: "#0084ff"
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/",
    source: "icons/sites/linkedin.svg",
    tile: "#0a66c2"
  },
  {
    name: "Grok",
    url: "https://grok.com/",
    source: "icons/sites/grok.svg",
    tile: "#000000"
  }
].forEach((sample) => {
  const remoteCachedIcon = svgTextDataUrl(prepareRemoteBrandSvgForTest(adaptiveFixtureSvg, { brandColor: "#1db954", qualityScore: 92 }));
  const icon = new TestIcon();
  testTheme = "light";
  applySiteIconForTest(icon, { url: sample.url, icon: remoteCachedIcon });
  assert.equal(icon.dataset.iconSource, sample.source, `${sample.name} uses the deployed local SVG instead of cached remote SVGs.`);
  assert.equal(icon.classList.contains("site-icon-local"), true, `${sample.name} keeps the local icon marker.`);
  assert.equal(icon.style.getPropertyValue("--site-icon-tile-light"), sample.tile, `${sample.name} local SVGs use the shared local SVG day tile strategy.`);
  assert.equal(icon.style.getPropertyValue("--site-icon-tile-dark"), "#f8fafc", `${sample.name} local SVGs use the shared local SVG night tile strategy.`);
  assert.match(decodeSvgDataUrl(icon.src), /fill="#ffffff"|fill:\s*#ffffff/, `${sample.name} local SVGs use shared mask recoloring in day mode.`);
  assert.notEqual(icon.src, sample.source, `${sample.name} local SVGs do not use the original-artwork branch.`);

  testTheme = "dark";
  refreshAdaptiveSiteIconsForTest([icon]);
  assert.equal(currentIconTileColorForTest(icon), "#f8fafc", `${sample.name} dark refresh reads the shared local SVG night tile.`);
  assert.match(decodeSvgDataUrl(icon.src), new RegExp(`fill="${sample.tile}"|fill:\\s*${sample.tile}`, "i"), `${sample.name} dark refresh restores the VI glyph through shared local recoloring.`);
});

[
  {
    name: "MDN",
    url: "https://developer.mozilla.org/",
    source: "icons/sites/mdn.svg",
    tile: "#15141a"
  }
].forEach((sample) => {
  const remoteCachedIcon = svgTextDataUrl(prepareRemoteBrandSvgForTest(adaptiveFixtureSvg, { brandColor: "#1db954", qualityScore: 92 }));
  const icon = new TestIcon();
  testTheme = "light";
  applySiteIconForTest(icon, { url: sample.url, icon: remoteCachedIcon });
  assert.equal(icon.dataset.iconSource, sample.source, `${sample.name} uses the deployed local SVG instead of cached remote SVGs.`);
  assert.equal(icon.classList.contains("site-icon-local"), true, `${sample.name} keeps the local icon marker.`);
  assert.equal(icon.style.getPropertyValue("--site-icon-tile-light"), sample.tile, `${sample.name} local SVGs sit on their known VI day tile.`);
  assert.equal(icon.style.getPropertyValue("--site-icon-tile-dark"), sample.tile, `${sample.name} local SVGs keep their VI carrier in dark mode.`);
  assert.equal(icon.src, sample.source, `${sample.name} local SVGs preserve original artwork instead of mask recoloring.`);
});

{
  const icoIcon = new TestIcon();
  const pngIcon = new TestIcon();
  applySiteIconForTest(icoIcon, { url: "https://1688.com/", icon: "" });
  applySiteIconForTest(pngIcon, { url: "https://b.ai/", icon: "" });
  assert.equal(icoIcon.dataset.iconSource, "icons/sites/1688.ico", "Local ico resources keep priority over remote discovery.");
  assert.equal(pngIcon.dataset.iconSource, "icons/sites/bai.png", "Local png resources keep priority over remote discovery.");
  assert.equal(icoIcon.src, "icons/sites/1688.ico", "Local ico resources are not SVG recolored.");
  assert.equal(pngIcon.src, "icons/sites/bai.png", "Local png resources are not SVG recolored.");
  assert.equal(icoIcon.classList.contains("site-icon-local"), true, "Local ico resources keep the local marker.");
  assert.equal(pngIcon.classList.contains("site-icon-local"), true, "Local png resources keep the local marker.");
  assert.equal(iconSourceCanUseBitmapTileFusionForTest(icoIcon.dataset.iconCandidate), true, "Local ico resources must enter the shared bitmap tile sampler.");
  assert.equal(iconSourceCanUseBitmapTileFusionForTest(pngIcon.dataset.iconCandidate), true, "Local png resources must enter the shared bitmap tile sampler.");
  assert.equal(iconSourceCanUseBitmapTileFusionForTest("icons/sites/baidu.svg"), false, "Local SVG resources stay on the existing brand SVG algorithm.");
}

{
  const icon = new TestIcon();
  const storedIco = "data:image/x-icon;base64,fixture";
  testTheme = "light";
  applySiteIconForTest(icon, { url: "https://raycast.com/", icon: storedIco });
  assert.equal(icon.dataset.iconSource, storedIco, "A site-provided ico should still render first when no deployed local SVG exists.");
  assert.equal(icon.dataset.remoteBrandRefreshEligible, "true", "A site-provided ico should still be eligible for remote SVG replacement.");
  assert.equal(icon.dataset.iconTile, "plain", "Site-provided ico starts on the favicon tile path before remote SVG replacement.");
}

{
  const remoteSvg = svgTextDataUrl(prepareRemoteBrandSvgForTest(adaptiveFixtureSvg, { brandColor: "#1db954", qualityScore: 92 }));
  const icon = new TestIcon();
  testTheme = "light";
  applySiteIconForTest(icon, { url: "https://raycast.com/", icon: remoteSvg });
  assert.equal(icon.dataset.iconSource, remoteSvg, "Sites without local resources may use a cached remote SVG data URL.");
  assert.equal(icon.classList.contains("site-icon-local"), false, "Remote SVG data URLs must not receive the local icon marker.");
  assert.equal(icon.style.getPropertyValue("--site-icon-tile-light"), "#1db954", "Remote SVG data URLs use descriptor day tiles.");
  assert.equal(icon.style.getPropertyValue("--site-icon-tile-dark"), "#f8fafc", "Remote SVG data URLs use descriptor night tiles.");
  assert.equal(iconSourceCanUseBitmapTileFusionForTest(icon.dataset.iconCandidate), false, "Remote cloud SVG descriptors stay on the cloud SVG tile algorithm.");
  assert.equal(iconSourceCanUseBitmapTileFusionForTest("data:image/png;base64,fixture"), true, "Remote cached bitmap data URLs use the shared bitmap tile sampler.");
  assert.match(decodeSvgDataUrl(icon.src), /fill="#102019"/, "Remote SVG data URLs use cloud glyph rules on bright brand tiles.");
  testTheme = "dark";
  refreshAdaptiveSiteIconsForTest([icon]);
  assert.match(decodeSvgDataUrl(icon.src), /fill="#102019"/, "Remote SVG data URLs continue to use descriptor glyphs after dark refresh.");
}

{
  const remoteSvg = svgTextDataUrl(prepareRemoteBrandSvgForTest(adaptiveFixtureSvg, { brandColor: "#ff6363", qualityScore: 100 }));
  const providerCalls = [];
  const discovered = discoverRemoteBrandIconDataUrlForTest("https://raycast.com/", (siteKey) => {
    providerCalls.push(siteKey);
    return remoteSvg;
  });
  assert.equal(discovered, remoteSvg, "Sites without deployed local resources can fall through to the remote provider.");
  assert.deepEqual(providerCalls, ["raycast.com"], "Remote provider discovery runs only for non-local sites.");
}

const faviconFixtureSize = 32;
const centeredBox = (x, y, size, inset) => x >= inset && x < size - inset && y >= inset && y < size - inset;
const centeredGlyph = (x, y, size) => centeredBox(x, y, size, 6);
const smallGlyph = (x, y, size) => centeredBox(x, y, size, 11);
const sparseDotGlyph = (x, y) => {
  for (let dotX = 9; dotX <= 21; dotX += 4) {
    for (let dotY = 9; dotY <= 21; dotY += 4) {
      if ((x - dotX) ** 2 + (y - dotY) ** 2 <= 1.35) {
        return true;
      }
    }
  }
  return false;
};
const faviconTileDecision = (sample) => {
  const color = dominantFaviconSampleBackgroundColor(sample);
  return {
    color,
    tileColors: color ? faviconMatchedTileColors(color) : null
  };
};

{
  const { color, tileColors } = faviconTileDecision(rgbaSample(faviconFixtureSize, (x, y, size) => {
    return smallGlyph(x, y, size) ? hexChannels("#2f6bff") : hexChannels("#eef4ff");
  }));
  assert.equal(rgbChannelsToHex(color.red, color.green, color.blue), "#eef4ff", "Light favicon backgrounds should remain the sampled carrier color.");
  assert.deepEqual(tileColors, { light: "#eef4ff", dark: "#eef4ff" }, "Ordinary light ico tiles keep the natural sampled color.");
}

{
  const orangeEmbeddedSample = rgbaSample(faviconFixtureSize, (x, y, size) => {
    const inTile = centeredBox(x, y, size, 6);
    const inGlyph = x >= 10 && x <= 22 && y >= 12 && y <= 19;
    const nearEdge = x < 8 || x >= size - 8 || y < 8 || y >= size - 8;
    return inTile ? hexChannels(inGlyph ? "#101010" : nearEdge ? "#fc8f00" : "#ff9600") : [0, 0, 0, 0];
  });
  const { color, tileColors } = faviconTileDecision(orangeEmbeddedSample);
  const fused = fusedEmbeddedFaviconPixelData(orangeEmbeddedSample, tileColors.light);
  const sampledTile = rgbChannelsToHex(color.red, color.green, color.blue);
  assert.equal(color.matchMode, "embedded-tile", "Centered ico artwork with a solid carrier should use the embedded-tile branch.");
  assert.equal(sampledTile, "#fe9300", "Orange embedded ico tiles should expose the site-owned carrier color.");
  assert.deepEqual(tileColors, { light: "#fe9300", dark: "#fe9300" }, "Embedded ico tiles with readable foreground should use a 100% opaque carrier-matched mask color.");
  assert.equal(faviconShouldFuseEmbeddedTile(color, tileColors.light), true, "Embedded ico tiles with real foreground should run pixel-level carrier fusion.");
  assert.ok(fused, "Embedded ico carrier fusion should produce adjusted pixel data.");
  assert.equal(samplePixelAlpha(fused, 7, 7), 0, "Embedded ico carrier pixels matching the mapped tile become transparent.");
  assert.ok(samplePixelAlpha(fused, 16, 16) > 230, "Embedded ico foreground text remains opaque after carrier fusion.");
}

{
  const whiteShellSample = rgbaSample(faviconFixtureSize, (x, y, size) => {
    const inTile = centeredBox(x, y, size, 5);
    const inGlyph = (x >= 9 && x <= 23 && y >= 10 && y <= 12)
      || (x >= 11 && x <= 21 && y >= 16 && y <= 18);
    return inTile ? hexChannels(inGlyph ? "#1677ff" : "#ffffff") : [0, 0, 0, 0];
  });
  const { color, tileColors } = faviconTileDecision(whiteShellSample);
  const fused = fusedEmbeddedFaviconPixelData(whiteShellSample, tileColors.light, rgbChannelsToHex(color.red, color.green, color.blue));
  assert.equal(color.matchMode, "embedded-tile", "Alipay-like favicon artwork with a white app tile should use the embedded-tile branch.");
  assert.equal(faviconShouldFuseEmbeddedTile(color, tileColors.light), true, "Embedded favicon tiles should fuse even when the derived carrier differs from the original app-tile color.");
  assert.ok(fused, "Derived carrier fusion should still produce adjusted pixel data.");
  assert.equal(samplePixelAlpha(fused, 6, 6), 0, "Original white app-tile pixels become transparent instead of nesting inside Wayleaf's carrier.");
  assert.ok(samplePixelAlpha(fused, 16, 11) > 230, "Colored site glyph pixels remain opaque after white app-tile fusion.");
}

{
  const { color, tileColors } = faviconTileDecision(rgbaSample(faviconFixtureSize, (x, y, size) => {
    const inTile = centeredBox(x, y, size, 5);
    const inGlyph = (x >= 9 && x <= 23 && y >= 10 && y <= 12)
      || (x >= 11 && x <= 21 && y >= 16 && y <= 18)
      || ((x + y) % 6 === 0 && x >= 9 && x <= 23 && y >= 9 && y <= 23);
    return inTile ? hexChannels(inGlyph ? "#ffffff" : "#007f8f") : [0, 0, 0, 0];
  }));
  const sampledTile = rgbChannelsToHex(color.red, color.green, color.blue);
  assert.equal(color.matchMode, "embedded-tile", "Che168-like centered ico artwork should still use the embedded-tile branch.");
  assert.equal(sampledTile, "#007f8f", "Che168-like ico tiles should keep the blue-green site-owned carrier instead of foreground speckles.");
  assert.deepEqual(tileColors, { light: "#007f8f", dark: "#007f8f" }, "Che168-like ico tiles should map the site-owned blue-green carrier into the mask tile.");
}

{
  const transparentGlyphSample = rgbaSample(faviconFixtureSize, (x, y, size) => {
    return centeredGlyph(x, y, size) ? hexChannels("#101820") : [0, 0, 0, 0];
  });
  const { color, tileColors } = faviconTileDecision(transparentGlyphSample);
  const sampledGlyph = rgbChannelsToHex(color.red, color.green, color.blue);
  assert.equal(sampledGlyph, "#101820", "Transparent dark ico glyphs still expose their palette color to the sampler.");
  assert.notEqual(tileColors.light, sampledGlyph, "Transparent dark ico glyphs should not reuse the glyph as the mask carrier.");
  assert.ok(contrastRatio(tileColors.light, sampledGlyph) >= FAVICON_READABLE_CARRIER_CONTRAST_MIN, "Transparent dark ico glyphs receive a high-contrast derived carrier.");
  assert.equal(faviconShouldFuseEmbeddedTile(color, tileColors.light), false, "Transparent glyphs should not run embedded carrier fusion.");
}

{
  const { color, tileColors } = faviconTileDecision(rgbaSample(faviconFixtureSize, (x, y, size) => {
    return centeredGlyph(x, y, size) ? hexChannels("#f2f5f7") : [0, 0, 0, 0];
  }));
  const sampledGlyph = rgbChannelsToHex(color.red, color.green, color.blue);
  assert.equal(sampledGlyph, "#f2f5f7", "Transparent light ico glyphs still expose their palette color to the sampler.");
  assert.notEqual(tileColors.light, sampledGlyph, "Transparent light ico glyphs should get a dark derived carrier instead of white-on-white.");
  assert.ok(contrastRatio(tileColors.light, sampledGlyph) >= FAVICON_READABLE_CARRIER_CONTRAST_MIN, "Transparent light ico glyphs receive a high-contrast derived carrier.");
}

{
  const { color, tileColors } = faviconTileDecision(rgbaSample(faviconFixtureSize, (x, y, size) => {
    return centeredGlyph(x, y, size) ? hexChannels("#3a3a3a") : [0, 0, 0, 0];
  }));
  const sampledGlyph = rgbChannelsToHex(color.red, color.green, color.blue);
  assert.equal(sampledGlyph, "#3a3a3a", "Transparent gray ico glyphs expose the neutral glyph color to the sampler.");
  assert.notEqual(tileColors.light, sampledGlyph, "Transparent gray ico glyphs should not render as a same-color blank square.");
  assert.ok(contrastRatio(tileColors.light, sampledGlyph) >= FAVICON_READABLE_CARRIER_CONTRAST_MIN, "Transparent gray ico glyphs receive a readable derived carrier.");
}

{
  const { color, tileColors } = faviconTileDecision(rgbaSample(faviconFixtureSize, (x, y, size) => {
    return sparseDotGlyph(x, y, size) ? hexChannels("#e89bc5") : [0, 0, 0, 0];
  }));
  const sampledGlyph = rgbChannelsToHex(color.red, color.green, color.blue);
  assert.equal(sampledGlyph, "#e89bc5", "Transparent pink ico glyphs expose the colored glyph palette.");
  assert.notEqual(tileColors.light, sampledGlyph, "Transparent pink ico glyphs should use a derived carrier instead of pink-on-pink.");
  assert.ok(contrastRatio(tileColors.light, sampledGlyph) >= FAVICON_READABLE_CARRIER_CONTRAST_MIN, "Transparent pink ico glyphs receive a readable same-palette carrier.");
  assert.equal(tileColors.dark, tileColors.light, "Sampled favicon carriers must remain fixed when Wayleaf switches light/dark mode.");
}

{
  const { color, tileColors } = faviconTileDecision(rgbaSample(faviconFixtureSize, () => {
    return hexChannels("#ffffff");
  }));
  const sampledGlyph = rgbChannelsToHex(color.red, color.green, color.blue);
  assert.equal(sampledGlyph, "#ffffff", "Arkham-like white ico tiles expose a near-white palette color.");
  assert.notEqual(tileColors.light, sampledGlyph, "Arkham-like white ico tiles should not render white-on-white.");
  assert.ok(contrastRatio(tileColors.light, sampledGlyph) >= FAVICON_READABLE_CARRIER_CONTRAST_MIN, "Arkham-like white ico tiles receive a dark high-contrast carrier.");
}

{
  const { color, tileColors } = faviconTileDecision(rgbaSample(faviconFixtureSize, (x, y, size) => {
    return smallGlyph(x, y, size) ? hexChannels("#ffffff") : hexChannels("#101820");
  }));
  assert.equal(rgbChannelsToHex(color.red, color.green, color.blue), "#101820", "Dark full-surface favicon backgrounds should be selected as the carrier.");
  assert.deepEqual(tileColors, { light: "#101820", dark: "#101820" }, "Dark ico backgrounds with readable content keep their natural fused tile.");
}

{
  const { color, tileColors } = faviconTileDecision(rgbaSample(faviconFixtureSize, (x, y, size) => {
    return smallGlyph(x, y, size) ? hexChannels("#202326") : hexChannels("#060708");
  }));
  const sampledTile = rgbChannelsToHex(color.red, color.green, color.blue);
  assert.equal(sampledTile, "#060708", "Xiaomi-like dark ico backgrounds should use the edge-supported favicon carrier color.");
  assert.deepEqual(tileColors, { light: "#060708", dark: "#060708" }, "Xiaomi-like dark ico backgrounds keep the sampled carrier even when internal text is low contrast.");
}

assert.deepEqual(genericSiteFallbackTileColors(), { light: "#f04424", dark: "#f04424" }, "No-site-ico fallback tile colors remain unchanged.");

assert.deepEqual(extractSvgColorPalette('<svg><path fill="#abc"/><path stroke="#aabbcc"/></svg>'), ["#aabbcc"], "Equivalent short and long hex colors should dedupe.");
assert.deepEqual(extractSvgColorPalette('<svg><path style="fill:#111;stroke:#222"/></svg>'), ["#111111", "#222222"], "Inline style colors must be included in the palette.");
assert.equal(remoteBrandSvgIsMonochrome('<svg><path fill="#111"/><path stroke="#111"/></svg>'), true, "Single-color SVGs are maskable.");
assert.equal(remoteBrandSvgIsMonochrome('<svg><path style="fill:#111;stroke:#222"/></svg>'), false, "Two-color SVGs are not maskable.");
assert.equal(remoteBrandSvgIsMonochrome('<svg><linearGradient id="g"/><path fill="url(#g)"/></svg>'), false, "Gradient SVGs are not maskable.");
assert.equal(remoteBrandSvgIsMonochrome('<svg><path fill="currentColor"/></svg>'), true, "CurrentColor-only SVGs are maskable.");

assert.deepEqual(
  remoteBrandIconSlugCandidatesForTest("x.ai", "X", ["x"]).map((candidate) => candidate.slug).slice(0, 3),
  ["x", "xai"],
  "Explicit aliases should outrank registrable and host-derived slugs."
);
assert.deepEqual(
  remoteBrandIconRankedCandidates([
    { slug: "example", score: 64, source: "site-name" },
    { slug: "example", score: 100, source: "alias" },
    { slug: "exampledotcom", score: 74, source: "host" }
  ]),
  [
    { slug: "example", score: 100, source: "alias" },
    { slug: "exampledotcom", score: 74, source: "host" }
  ],
  "Duplicate slug candidates should keep the highest score."
);

const simpleIconProviderSlugs = remoteBrandSlugsFromFileListForTest([
  { name: "/icons/raycast.svg" },
  { name: "/icons/raycast.svg" },
  { name: "/icons/raycast-wordmark.svg" },
  { name: "/data/simple-icons.json" }
], /^\/icons\/(.+)\.svg$/i);
assert.equal(remoteBrandProviderHasSlugForTest(simpleIconProviderSlugs, "raycast"), true, "Simple Icons package index should allow existing slugs before provider fetch.");
assert.equal(remoteBrandProviderHasSlugForTest(simpleIconProviderSlugs, "missing-brand"), false, "Simple Icons package index should suppress missing slug fetches instead of probing 404s.");
{
  const [teslaCandidate, teslaComCandidate] = remoteBrandIconSlugCandidatesForTest("tesla.com", "Tesla");
  assert.deepEqual(
    [teslaCandidate, teslaComCandidate].map((candidate) => [
      candidate.slug,
      remoteBrandShouldFetchCandidateForTest(new Set(), candidate)
    ]),
    [
      ["tesla", true],
      ["teslacom", false]
    ],
    "High-confidence registrable slugs should get one direct cloud fetch when a stale provider index misses, while low-score host guesses stay suppressed."
  );
}

const lobeHubProviderSlugs = remoteBrandSlugsFromFileListForTest([
  { name: "/icons/xai.svg" },
  { name: "/icons/xiaomimimo.svg" },
  { name: "/README.md" }
], /^\/icons\/(.+)\.svg$/i);
assert.equal(remoteBrandProviderHasSlugForTest(lobeHubProviderSlugs, "xai"), true, "LobeHub static SVG index should allow AI brand slugs before provider fetch.");
assert.equal(
  remoteBrandIconSlugCandidatesForTest("x.ai", "X", ["xai"]).some((candidate) => remoteBrandProviderHasSlugForTest(lobeHubProviderSlugs, candidate.slug)),
  true,
  "LobeHub static SVG index should match a normalized candidate for dotted AI domains."
);
assert.equal(remoteBrandProviderHasSlugForTest(lobeHubProviderSlugs, "raycast"), false, "LobeHub supplemental provider should not probe unavailable slugs.");

assert.deepEqual(
  ["bilibili.com", "github.com", "google.com", "figma.com", "slack.com", "spotify.com", "suno.com", "notion.so"]
    .map((siteKey) => [siteKey, localIconForSiteKeyForTest(siteKey), remoteProviderCanRunForSiteKeyForTest(siteKey)]),
  [
    ["bilibili.com", "icons/sites/bilibili.svg", false],
    ["github.com", "icons/sites/github.svg", false],
    ["google.com", "icons/sites/google.svg", false],
    ["figma.com", "icons/sites/figma.svg", false],
    ["slack.com", "icons/sites/slack.svg", false],
    ["spotify.com", "icons/sites/spotify.svg", false],
    ["suno.com", "icons/sites/suno.svg", false],
    ["notion.so", "icons/sites/notion.svg", false]
  ],
  "Representative deployed local SVG icons should be resolved locally and skip the remote provider branch."
);

assert.deepEqual(
  [
    ["ai.google.dev", "aistudio.google.com"],
    ["makersuite.google.com", "aistudio.google.com"],
    ["console.cloud.google.com", "cloud.google.com"],
    ["colab.research.google.com", "colab.research.google.com"],
    ["chromewebstore.google.com", "chrome.google.com"],
    ["console.firebase.google.com", "firebase.google.com"],
    ["firefly.adobe.com", "firefly.adobe.com"],
    ["console.aws.amazon.com", "aws.amazon.com"],
    ["portal.azure.com", "azure.microsoft.com"],
    ["microsoft365.com", "office.com"],
    ["teams.live.com", "teams.microsoft.com"],
    ["jira.atlassian.com", "atlassian.net"],
    ["bitbucket.atlassian.com", "bitbucket.org"],
    ["chat.openai.com", "chatgpt.com"],
    ["hf.co", "huggingface.co"],
    ["discord.gg", "discord.com"],
    ["youtu.be", "youtube.com"]
  ].map(([host, siteKey]) => [
    host,
    source.includes(`"${host}": "${siteKey}"`),
    localIconForSiteKeyForTest(siteKey),
    remoteProviderCanRunForSiteKeyForTest(siteKey)
  ]),
  [
    ["ai.google.dev", true, "icons/sites/aistudio.svg", false],
    ["makersuite.google.com", true, "icons/sites/aistudio.svg", false],
    ["console.cloud.google.com", true, "icons/sites/googlecloud.svg", false],
    ["colab.research.google.com", true, "icons/sites/colab.svg", false],
    ["chromewebstore.google.com", true, "icons/sites/chrome.svg", false],
    ["console.firebase.google.com", true, "icons/sites/firebase.svg", false],
    ["firefly.adobe.com", true, "icons/sites/adobefirefly.svg", false],
    ["console.aws.amazon.com", true, "icons/sites/aws.svg", false],
    ["portal.azure.com", true, "icons/sites/azure.svg", false],
    ["microsoft365.com", true, "icons/sites/microsoftoffice.svg", false],
    ["teams.live.com", true, "icons/sites/microsoftteams.svg", false],
    ["jira.atlassian.com", true, "icons/sites/jira.svg", false],
    ["bitbucket.atlassian.com", true, "icons/sites/bitbucket.svg", false],
    ["chat.openai.com", true, "icons/sites/chatgpt.svg", false],
    ["hf.co", true, "icons/sites/huggingface.svg", false],
    ["discord.gg", true, "icons/sites/discord.svg", false],
    ["youtu.be", true, "icons/sites/youtube.svg", false]
  ],
  "High-confidence product domains should normalize to deployed local icon keys before cloud, favicon, or fallback paths."
);

assert.deepEqual(
  brandIconTileColorsForTest("#000000", "suno.com", "icons/sites/suno.svg"),
  { light: "#000000", dark: "#f8fafc" },
  "Suno should render a black carrier with white glyph in light mode and a white carrier with black glyph in dark mode."
);

assert.deepEqual(
  ["cohere.com", "jina.ai", "openrouter.ai", "qwen.ai", "zhipu.com"]
    .map((siteKey) => [siteKey, localIconForSiteKeyForTest(siteKey), remoteProviderCanRunForSiteKeyForTest(siteKey)]),
  [
    ["cohere.com", "icons/sites/cohere.svg", false],
    ["jina.ai", "icons/sites/jina.svg", false],
    ["openrouter.ai", "icons/sites/openrouter.svg", false],
    ["qwen.ai", "icons/sites/qwen.svg", false],
    ["zhipu.com", "icons/sites/zhipu.svg", false]
  ],
  "LobeHub supplemental SVGs should be deployed as default local site-key matches."
);

assert.equal(
  remoteProviderCanRunForSiteKeyForTest("unlisted-provider-fixture.example"),
  true,
  "Sites without deployed local resources remain eligible for the remote provider branch."
);

const simpleSvg = '<svg viewBox="0 0 24 24"><path fill="#1db954" d="M0 0h24v24H0z"/></svg>';
const currentColorSvg = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M0 0h24v24H0z"/></svg>';
assert.equal(remoteBrandSvgQuality(simpleSvg, { candidate: { score: 92 } }).accepted, true, "Simple scored SVGs should pass the quality gate.");
assert.equal(remoteBrandSvgQuality("", { candidate: { score: 92 } }).accepted, false, "Empty provider responses should fail the quality gate.");
assert.equal(remoteBrandSvgQuality("not an svg", { candidate: { score: 92 } }).accepted, false, "Non-SVG provider responses should fail the quality gate.");
assert.equal(remoteBrandSvgQuality('<html><body><svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"/></svg></body></html>', { candidate: { score: 92 } }).accepted, false, "Embedded SVG inside an HTML response should not pass as a provider SVG.");
assert.equal(remoteBrandSvgQuality('<svg><path d="M0 0h1v1H0z"/></svg>', { candidate: { score: 92 } }).accepted, false, "SVGs without usable geometry should fail.");
assert.equal(remoteBrandSvgQuality('<svg viewBox="0 0 24 24"><foreignObject/></svg>', { candidate: { score: 92 } }).accepted, false, "SVGs with embedded HTML should fail.");
assert.equal(remoteBrandSvgQuality('<svg viewBox="0 0 24 24"><path onclick="alert(1)" d="M0 0h1v1H0z"/></svg>', { candidate: { score: 92 } }).accepted, false, "SVGs with event handlers should fail.");
assert.equal(remoteBrandSvgQuality(simpleSvg, { candidate: { score: 44 } }).accepted, false, "Low-confidence slug matches should fail.");

assert.equal(remoteBrandSvgBrandColor(simpleSvg, { providerId: "simple-icons-cdn" }), "#1db954", "Simple Icons provider color should be trusted.");
assert.equal(remoteBrandSvgBrandColor('<svg viewBox="0 0 24 24"><path fill="#ff0000"/></svg>', { providerId: "simple-icons-cdn", localColor: "#1ed760" }), "#1ed760", "Strong provider color drift should fall back to known local VI color.");
assert.equal(remoteBrandSvgBrandColor('<svg viewBox="0 0 24 24"><path fill="#1db954"/></svg>', { providerId: "simple-icons-cdn", localColor: "#1ed760" }), "#1db954", "Small provider color variance should remain trusted.");
assert.equal(remoteBrandSvgBrandColor('<svg viewBox="0 0 24 24"><path fill="#000000"/></svg>', { providerId: "iconify" }), "", "Neutral Iconify SVG color should not become the brand color by itself.");
assert.equal(remoteBrandSvgBrandColor('<svg viewBox="0 0 24 24"><path fill="#000000"/></svg>', { providerId: "iconify", localColor: "#ffcc00" }), "#ffcc00", "Local VI color should be used when remote color is neutral.");

assert.equal(remoteBrandSvgResponseMayContainSvg("image/svg+xml; charset=utf-8", "https://cdn.example/icon"), true, "Explicit SVG content types should be accepted.");
assert.equal(remoteBrandSvgResponseMayContainSvg("text/html", "https://cdn.example/icon.svg"), false, "Explicit HTML provider responses should be rejected even when the URL ends in .svg.");
assert.equal(remoteBrandSvgResponseMayContainSvg("application/octet-stream", "https://cdn.example/icon.svg"), true, "Generic binary content may be accepted when the provider URL is an SVG.");
assert.equal(remoteBrandIconMissCacheIsFresh({ missing: true, source: "remote-brand", updatedAt: 1_000 }, 500, 1_400), true, "Fresh provider misses should suppress repeated provider fetches.");
assert.equal(remoteBrandIconMissCacheIsFresh({ missing: true, source: "remote-brand", updatedAt: 1_000 }, 500, 1_600), false, "Expired provider misses should allow provider retry.");
assert.equal(remoteBrandIconMissCacheIsFresh({ missing: true, source: "site-icon", updatedAt: 1_000 }, 500, 1_400), false, "Non-provider misses should not suppress remote provider retries.");

const cloudProviderSamples = [
  {
    siteKey: "raycast.com",
    siteName: "Raycast",
    color: "#ff6363",
    svg: '<svg fill="#FF6363" role="img" viewBox="0 0 24 24"><title>Raycast</title><path d="M0 0h24v24H0z"/></svg>',
    descriptor: {
      brandColor: "#ff6363",
      isMonochrome: true,
      renderMode: "mask",
      tileLight: "#ff6363",
      tileDark: "#f8fafc",
      glyphLight: "#ffffff",
      glyphDark: "#102019",
      qualityScore: 100
    }
  },
  {
    siteKey: "calendly.com",
    siteName: "Calendly",
    color: "#006bff",
    svg: '<svg fill="#006BFF" role="img" viewBox="0 0 24 24"><title>Calendly</title><path d="M0 0h24v24H0z"/></svg>',
    descriptor: {
      brandColor: "#006bff",
      isMonochrome: true,
      renderMode: "mask",
      tileLight: "#006bff",
      tileDark: "#f8fafc",
      glyphLight: "#ffffff",
      glyphDark: "",
      qualityScore: 100
    }
  },
  {
    siteKey: "arc.net",
    siteName: "Arc",
    color: "#fcbfbd",
    svg: '<svg fill="#FCBFBD" role="img" viewBox="0 0 29 24"><title>Arc</title><path d="M0 0h29v24H0z"/></svg>',
    descriptor: {
      brandColor: "#fcbfbd",
      isMonochrome: true,
      renderMode: "mask",
      tileLight: "#fcbfbd",
      tileDark: "#f8fafc",
      glyphLight: "#102019",
      glyphDark: "#102019",
      qualityScore: 100
    }
  }
];

for (const sample of cloudProviderSamples) {
  assert.equal(localIconForSiteKeyForTest(sample.siteKey), "", `${sample.siteName} has no deployed local fixture and should exercise the cloud branch.`);
  assert.equal(remoteProviderCanRunForSiteKeyForTest(sample.siteKey), true, `${sample.siteName} remains eligible for remote provider discovery.`);
  assert.equal(remoteBrandIconSlugCandidatesForTest(sample.siteKey, sample.siteName)[0].slug, sample.siteKey.split(".")[0], `${sample.siteName} should produce a stable provider slug.`);
  assert.deepEqual(remoteBrandSvgQuality(sample.svg, { candidate: { score: 92 } }), { accepted: true, score: 100 }, `${sample.siteName} provider SVG should pass the quality gate.`);
  assert.equal(remoteBrandSvgBrandColor(sample.svg, { providerId: "simple-icons-cdn" }), sample.color, `${sample.siteName} provider color should be trusted when no local VI color exists.`);
  assert.deepEqual(remoteBrandSvgDescriptor(sample.svg, { brandColor: sample.color, qualityScore: 100 }), sample.descriptor, `${sample.siteName} should produce the expected cloud day/night tile descriptor.`);
}

assert.equal(localIconForSiteKeyForTest("shadcn.com"), "", "shadcn has no deployed local fixture and should not be mistaken for a local icon.");
assert.equal(remoteProviderCanRunForSiteKeyForTest("shadcn.com"), true, "shadcn remains eligible for remote provider discovery before favicon fallback.");
assert.equal(remoteBrandIconSlugCandidatesForTest("shadcn.com", "Shadcn")[0].slug, "shadcn", "shadcn should produce a deterministic provider slug before falling back.");
assert.equal(remoteBrandSvgResponseMayContainSvg("text/html", "https://ui.shadcn.com"), false, "A shadcn-style non-SVG provider/fetch response must not be cached as a remote SVG.");

assert.equal(localIconForUrlForTest("https://www.doubao.com/chat/"), "icons/sites/doubao.svg", "Doubao should use the deployed multicolor local SVG.");
assert.equal(localIconForUrlForTest("https://www.kimi.com/"), "icons/sites/kimi.svg", "Kimi should use the deployed local SVG.");
assert.equal(localIconForUrlForTest("https://chatglm.cn/"), "icons/sites/glm.svg", "GLM/ChatGLM should use the deployed local SVG.");
assert.equal(localIconForUrlForTest("https://www.douyin.com/search/"), "icons/sites/douyin.svg", "Douyin should use the deployed multicolor local SVG instead of the legacy ico.");
assert.equal(localIconForUrlForTest("https://www.alipay.com/"), "icons/sites/alipay.svg", "Alipay should use the deployed multicolor local SVG.");
assert.equal(localIconForUrlForTest("https://www.instagram.com/"), "icons/sites/instagram.svg", "Instagram should use the deployed multicolor local SVG.");
assert.equal(localIconForUrlForTest("https://huggingface.co/"), "icons/sites/huggingface.svg", "Hugging Face should use the deployed multicolor local SVG.");
assert.equal(localIconForUrlForTest("https://jimeng.jianying.com/"), "icons/sites/jimeng.svg", "Jimeng should use the deployed multicolor local SVG.");
assert.equal(localIconForUrlForTest("https://mimo.mi.com/"), "icons/sites/xiaomimimo.svg", "MiMo should use the deployed local SVG.");
assert.equal(localIconForUrlForTest("https://www.tiktok.com/"), "icons/sites/tiktok.svg", "TikTok should use the deployed multicolor local SVG.");
{
  const icon = new TestIcon();
  icon.dataset.iconCacheHydrated = "true";
  icon.src = "data:image/png;base64,old-tesla-favicon";
  assert.equal(localIconForUrlForTest("https://www.tesla.com/model3"), "", "Tesla should stay cloud-provider eligible when no deployed local SVG exists.");
  assert.equal(remoteBrandIconSlugCandidatesForTest("tesla.com", "Tesla")[0].slug, "tesla", "Tesla should produce the Simple Icons provider slug.");
  assert.equal(
    refreshRenderedSiteIconDecisionForTest(icon, { url: "https://www.tesla.com/model3" }),
    "refresh-remote-brand",
    "First-paint cached favicons without local assets must still trigger remote brand refresh."
  );
}
{
  const icon = new TestIcon();
  icon.dataset.iconCacheHydrated = "true";
  icon.dataset.iconSource = "icons/sites/doubao.svg";
  icon.src = "icons/sites/doubao.svg";
  assert.equal(
    refreshRenderedSiteIconDecisionForTest(icon, { url: "https://www.doubao.com/chat/" }),
    "keep-local-cache",
    "First-paint cached local SVGs should keep the cheap local short-circuit."
  );
}
assert.deepEqual(
  brandIconTileColorsForTest("#1677ff", "alipay.com", "icons/sites/alipay.svg"),
  { light: "#ffffff", dark: "#f8fafc" },
  "Alipay should follow the Google-like multicolor white-tile strategy."
);
assert.deepEqual(
  brandIconTileColorsForTest("#1e37fc", "doubao.com", "icons/sites/doubao.svg"),
  { light: "#ffffff", dark: "#f8fafc" },
  "Doubao should follow the Google-like multicolor white-tile strategy."
);
assert.deepEqual(
  brandIconTileColorsForTest("#000000", "douyin.com", "icons/sites/douyin.svg"),
  { light: "#ffffff", dark: "#f8fafc" },
  "Douyin should follow the Google-like multicolor white-tile strategy."
);
assert.deepEqual(
  brandIconTileColorsForTest("#e4405f", "instagram.com", "icons/sites/instagram.svg"),
  { light: "#ffffff", dark: "#f8fafc" },
  "Instagram should follow the Google-like multicolor white-tile strategy."
);
assert.deepEqual(
  brandIconTileColorsForTest("#ffd21e", "huggingface.co", "icons/sites/huggingface.svg"),
  { light: "#ffffff", dark: "#f8fafc" },
  "Hugging Face should follow the Google-like multicolor white-tile strategy."
);
assert.deepEqual(
  brandIconTileColorsForTest("#1c6fff", "jimeng.jianying.com", "icons/sites/jimeng.svg"),
  { light: "#ffffff", dark: "#f8fafc" },
  "Jimeng should follow the Google-like multicolor white-tile strategy."
);
assert.deepEqual(
  brandIconTileColorsForTest("#000000", "tiktok.com", "icons/sites/tiktok.svg"),
  { light: "#ffffff", dark: "#f8fafc" },
  "TikTok should follow the Google-like multicolor white-tile strategy."
);
assert.equal(siteIconBrandColorForTest("chatglm.cn", "icons/sites/glm.svg"), "#3859ff", "GLM should use its blue VI color for mask recoloring.");
assert.equal(siteIconBrandColorForTest("kimi.com", "icons/sites/kimi.svg"), "#111827", "Kimi should use its dark VI color for mask recoloring.");
assert.equal(siteIconBrandColorForTest("mimo.mi.com", "icons/sites/xiaomimimo.svg"), "#000000", "MiMo should use a black tile for mask recoloring.");

assert.deepEqual(
  remoteBrandSvgDescriptor(simpleSvg, { brandColor: "#1db954", qualityScore: 92 }),
  {
    brandColor: "#1db954",
    isMonochrome: true,
    renderMode: "mask",
    tileLight: "#1db954",
    tileDark: "#f8fafc",
    glyphLight: "#102019",
    glyphDark: "#102019",
    qualityScore: 92
  },
  "Cloud maskable icons should produce a complete day/night descriptor."
);
assert.deepEqual(
  remoteBrandSvgDescriptor(currentColorSvg, { brandColor: "#00a1d6", qualityScore: 95 }),
  {
    brandColor: "#00a1d6",
    isMonochrome: true,
    renderMode: "mask",
    tileLight: "#00a1d6",
    tileDark: "#f8fafc",
    glyphLight: "#ffffff",
    glyphDark: "#102019",
    qualityScore: 95
  },
  "A cloud bilibili-like fixture keeps a remote descriptor separate from the local bilibili white-on-blue rule while preserving night readability."
);
assert.deepEqual(
  remoteBrandSvgDescriptor(currentColorSvg, { brandColor: "#ffcc00", qualityScore: 93 }),
  {
    brandColor: "#ffcc00",
    isMonochrome: true,
    renderMode: "mask",
    tileLight: "#ffcc00",
    tileDark: "#f8fafc",
    glyphLight: "#102019",
    glyphDark: "#102019",
    qualityScore: 93
  },
  "Yandex-like yellow cloud icons should use dark glyphs in both day and night tile strategies."
);
assert.deepEqual(
  remoteBrandSvgDescriptor(currentColorSvg, { brandColor: "#000000", qualityScore: 90 }),
  {
    brandColor: "#000000",
    isMonochrome: true,
    renderMode: "mask",
    tileLight: "#000000",
    tileDark: "#f8fafc",
    glyphLight: "#ffffff",
    glyphDark: "",
    qualityScore: 90
  },
  "GitHub/Notion-like black cloud icons should use a white day glyph and preserve the dark glyph on the light night tile."
);
assert.deepEqual(
  remoteBrandSvgDescriptor(currentColorSvg, { brandColor: "#ffffff", qualityScore: 88 }),
  {
    brandColor: "#ffffff",
    isMonochrome: true,
    renderMode: "mask",
    tileLight: "#000000",
    tileDark: "#f8fafc",
    glyphLight: "",
    glyphDark: "#102019",
    qualityScore: 88
  },
  "Notion/near-white-like cloud brands should flip to a dark day tile instead of rendering low-contrast white-on-white."
);
const multicolorSvg = '<svg viewBox="0 0 24 24"><path fill="#4285f4"/><path fill="#ea4335"/></svg>';
assert.deepEqual(
  remoteBrandSvgDescriptor(multicolorSvg, { brandColor: "#4285f4", qualityScore: 84 }),
  {
    brandColor: "#4285f4",
    isMonochrome: false,
    renderMode: "original",
    tileLight: "#ffffff",
    tileDark: "#f8fafc",
    glyphLight: "",
    glyphDark: "",
    qualityScore: 84
  },
  "Google-like cloud multicolor icons should produce an original-render descriptor with neutral tiles."
);
assert.deepEqual(
  remoteBrandSvgDescriptor('<svg viewBox="0 0 24 24"><linearGradient id="g"/><path fill="url(#g)" d="M0 0h24v24H0z"/></svg>', { brandColor: "#4a154b", qualityScore: 82 }),
  {
    brandColor: "#4a154b",
    isMonochrome: false,
    renderMode: "original",
    tileLight: "#ffffff",
    tileDark: "#f8fafc",
    glyphLight: "",
    glyphDark: "",
    qualityScore: 82
  },
  "Slack/Figma-like multicolor or gradient cloud SVGs must stay original and avoid mask recoloring."
);
const preparedRemoteSvg = prepareRemoteBrandSvgForTest(simpleSvg, { brandColor: "#1db954", qualityScore: 92 });
const preparedRemoteDataUrl = svgTextDataUrl(preparedRemoteSvg);
assert.deepEqual(
  remoteBrandSvgDescriptorFromSource(preparedRemoteDataUrl),
  {
    brandColor: "#1db954",
    isMonochrome: true,
    renderMode: "mask",
    tileLight: "#1db954",
    tileDark: "#f8fafc",
    glyphLight: "#102019",
    glyphDark: "#102019",
    qualityScore: 92
  },
  "Cached cloud SVG data URLs should round-trip their descriptor."
);
assert.deepEqual(
  remoteBrandSvgCacheStrategy(preparedRemoteDataUrl),
  {
    kind: "remote-brand-svg",
    brandColor: "#1db954",
    renderMode: "mask",
    isMonochrome: true,
    tileLight: "#1db954",
    tileDark: "#f8fafc",
    glyphLight: "#102019",
    glyphDark: "#102019",
    qualityScore: 92
  },
  "Cached Spotify-like cloud SVGs retain their post-cache tile and glyph strategy."
);

console.log("icon strategy fixtures passed");
