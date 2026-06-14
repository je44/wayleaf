import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");
const siteIconIndex = JSON.parse(readFileSync(new URL("../icons/sites/index.json", import.meta.url), "utf8"));
const availableSiteIconFiles = new Set(siteIconIndex);

assert.match(source, /viewbox=auto/, "Simple Icons CDN requests should normalize the SVG viewBox.");
assert.match(source, /return remoteBrandGlyphColorForTile\(tileColor, brandColor\);/, "Remote SVG data URLs must use the cloud glyph strategy.");
assert.match(source, /return localBrandGlyphColor\(tileColor\);/, "Local brand icons must keep the local glyph strategy.");
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
assert.match(source, /function discoverRemoteBrandIconDataUrl[\s\S]*localIconForUrl\(parsedUrl\.href\)[\s\S]*return "";/, "Remote provider discovery must short-circuit for deployed local icons.");
assert.match(source, /function refreshRemoteBrandIcon[\s\S]*localIconForUrl\(site\.url\)[\s\S]*return;/, "Async remote refresh must short-circuit for deployed local icons.");

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

const SITE_ICON_FILE_BY_SITE_KEY_FOR_TEST = Object.freeze({
  "calendar.google.com": "googlecalendar.svg",
  "docs.google.com": "googledocs.svg",
  "drive.google.com": "googledrive.svg",
  "gemini.google.com": "googlegemini.svg",
  "maps.google.com": "googlemaps.svg",
  "meet.google.com": "googlemeet.svg",
  "music.163.com": "neteasecloudmusic.svg",
  "npmjs.com": "npm.svg",
  "office.com": "microsoftoffice.svg",
  "stackoverflow.com": "stackoverflow.svg",
  "teams.microsoft.com": "microsoftteams.ico"
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

assert.equal(localBrandGlyphColor("#00a1d6"), "#ffffff", "Local bilibili keeps a white glyph on the blue tile.");
assert.equal(localBrandGlyphColor("#ffffff"), "#102019", "Local near-white brand tiles use a dark glyph.");

assert.equal(remoteBrandGlyphColor("#00a1d6"), "#ffffff", "Remote brand blue near the contrast threshold should keep a white glyph.");
assert.equal(remoteBrandGlyphColor("#1db954"), "#102019", "Remote bright green should switch to a dark glyph for contrast.");
assert.equal(remoteBrandGlyphColor("#ffcc00"), "#102019", "Remote yellow should use a dark glyph.");
assert.equal(remoteBrandGlyphColorForTile("#f8fafc", "#362d59"), "", "Remote dark brand glyphs are preserved on light night tiles when contrast is sufficient.");
assert.equal(remoteBrandGlyphColorForTile("#f8fafc", "#ffcc00"), "#102019", "Remote light brand glyphs are replaced on light night tiles.");
assert.equal(remoteBrandGlyphColorForTile("#1ed760", "#1ed760"), "#102019", "Spotify green cloud tiles use a dark glyph in day mode.");
assert.equal(remoteBrandGlyphColorForTile("#181717", "#181717"), "#ffffff", "GitHub dark cloud tiles use a white glyph in day mode.");
assert.equal(remoteBrandGlyphColorForTile("#ffcc00", "#ffcc00"), "#102019", "Yandex yellow cloud tiles use a dark glyph in day mode.");
assert.equal(remoteBrandGlyphColorForTile("#000000", "#000000"), "#ffffff", "Notion black cloud tiles use a white glyph in day mode.");

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

assert.deepEqual(
  ["bilibili.com", "github.com", "google.com", "figma.com", "slack.com", "spotify.com", "notion.so"]
    .map((siteKey) => [siteKey, localIconForSiteKeyForTest(siteKey), remoteProviderCanRunForSiteKeyForTest(siteKey)]),
  [
    ["bilibili.com", "icons/sites/bilibili.svg", false],
    ["github.com", "icons/sites/github.svg", false],
    ["google.com", "icons/sites/google.svg", false],
    ["figma.com", "icons/sites/figma.svg", false],
    ["slack.com", "icons/sites/slack.svg", false],
    ["spotify.com", "icons/sites/spotify.svg", false],
    ["notion.so", "icons/sites/notion.svg", false]
  ],
  "Representative deployed local SVG icons should be resolved locally and skip the remote provider branch."
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
