import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

const source = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");
const cssSource = readFileSync(new URL("../newtab.css", import.meta.url), "utf8");
const siteIconIndex = JSON.parse(readFileSync(new URL("../icons/sites/index.json", import.meta.url), "utf8"));
const siteIconFiles = new Set(readdirSync(new URL("../icons/sites/", import.meta.url)).filter((fileName) => fileName !== "index.json"));
const readSiteIconFixture = (fileName, fallback) => siteIconFiles.has(fileName)
  ? readFileSync(new URL(`../icons/sites/${fileName}`, import.meta.url), "utf8")
  : fallback;
const alibabaSvgSource = readSiteIconFixture("alibabadotcom.svg", '<svg fill="#000000" viewBox="0 0 24 24"><path d="M2 2h20v20H2z"/></svg>');
const alipaySvgSource = readFileSync(new URL("../icons/sites/alipay.svg", import.meta.url), "utf8");
const antigravitySvgSource = readFileSync(new URL("../icons/sites/antigravity.svg", import.meta.url), "utf8");
const bingSvgSource = readFileSync(new URL("../icons/sites/bing.svg", import.meta.url), "utf8");
const chatgptSvgSource = readFileSync(new URL("../icons/sites/chatgpt.svg", import.meta.url), "utf8");
const chromeSvgSource = readFileSync(new URL("../icons/sites/chrome.svg", import.meta.url), "utf8");
const googleSvgSource = readFileSync(new URL("../icons/sites/google.svg", import.meta.url), "utf8");
const doubaoSvgSource = readFileSync(new URL("../icons/sites/doubao.svg", import.meta.url), "utf8");
const douyinSvgSource = readFileSync(new URL("../icons/sites/douyin.svg", import.meta.url), "utf8");
const huggingfaceSvgSource = readFileSync(new URL("../icons/sites/huggingface.svg", import.meta.url), "utf8");
const instagramSvgSource = readFileSync(new URL("../icons/sites/instagram.svg", import.meta.url), "utf8");
const jimengSvgSource = readFileSync(new URL("../icons/sites/jimeng.svg", import.meta.url), "utf8");
const kimiSvgSource = readFileSync(new URL("../icons/sites/kimi.svg", import.meta.url), "utf8");
const linkedInSvgSource = readFileSync(new URL("../icons/sites/linkedin.svg", import.meta.url), "utf8");
const grokSvgSource = readFileSync(new URL("../icons/sites/grok.svg", import.meta.url), "utf8");
const dailymotionSvgSource = readFileSync(new URL("../icons/sites/dailymotion.svg", import.meta.url), "utf8");
const epicGamesSvgSource = readFileSync(new URL("../icons/sites/epicgames.svg", import.meta.url), "utf8");
const mediumSvgSource = readFileSync(new URL("../icons/sites/medium.svg", import.meta.url), "utf8");
const mgtvSvgSource = readFileSync(new URL("../icons/sites/mgtv.svg", import.meta.url), "utf8");
const netflixSvgSource = readFileSync(new URL("../icons/sites/netflix.svg", import.meta.url), "utf8");
const pinduoduoSvgSource = readFileSync(new URL("../icons/sites/pinduoduo.svg", import.meta.url), "utf8");
const robloxSvgSource = readSiteIconFixture("roblox.svg", '<svg fill="#000000" viewBox="0 0 24 24"><path d="M0 4l20-4 4 20-20 4z"/></svg>');
const teamsSvgSource = readSiteIconFixture("microsoftteams.svg", '<svg viewBox="0 0 24 24"><defs><linearGradient id="g"><stop stop-color="#5059c9"/><stop offset="1" stop-color="#7b83eb"/></linearGradient></defs><path fill="url(#g)" d="M0 0h24v24H0z"/></svg>');
const tiktokSvgSource = readFileSync(new URL("../icons/sites/tiktok.svg", import.meta.url), "utf8");
const tripdotcomSvgSource = readSiteIconFixture("tripdotcom.svg", '<svg viewBox="0 0 24 24"><path d="M2 2h20v20H2z"/></svg>');
const qqSvgSource = readFileSync(new URL("../icons/sites/qq.svg", import.meta.url), "utf8");
const vqqSvgSource = readFileSync(new URL("../icons/sites/vqq.svg", import.meta.url), "utf8");
const wikipediaSvgSource = readSiteIconFixture("wikipedia.svg", '<svg fill="#000000" viewBox="0 0 24 24"><path d="M2 2h20v20H2z"/></svg>');
const whatsappSvgSource = readFileSync(new URL("../icons/sites/whatsapp.svg", import.meta.url), "utf8");
const wechatSvgSource = readFileSync(new URL("../icons/sites/wechat.svg", import.meta.url), "utf8");
const spotifySvgSource = readFileSync(new URL("../icons/sites/spotify.svg", import.meta.url), "utf8");
const xiaohongshuSvgSource = readFileSync(new URL("../icons/sites/xiaohongshu.svg", import.meta.url), "utf8");
const youtubeSvgSource = readFileSync(new URL("../icons/sites/youtube.svg", import.meta.url), "utf8");
const availableSiteIconFiles = new Set(siteIconIndex);
const BRAND_ICON_VI_CONTRAST_MIN = 2.75;
const BRAND_ICON_DARK_MODE_CARRIER = "#f8fafc";
const BRAND_ICON_LIGHT_MODE_DARK_CARRIER = "#102019";
const BRAND_ICON_MULTICOLOR_PAPER_CARRIER = "#ffffff";
const BRAND_ICON_MULTICOLOR_DARK_CARRIER = "#111827";
const SITE_ICON_TILE_COLOR_BY_SITE_KEY_FOR_TEST = Object.freeze({
  "1688.com": "#ff6000",
  "aistudio.google.com": "#4285f4",
  "alibaba.com": "#ff6a00",
  "aws.amazon.com": "#ff9900",
  "azure.microsoft.com": "#0078d4",
  "b.ai": "#111827",
  "baidu.com": "#2932e1",
  "bing.com": "#258ffa",
  "bilibili.com": "#00a1d6",
  "bitbucket.org": "#0052cc",
  "calendar.google.com": "#4285f4",
  "chrome.google.com": "#4285f4",
  "cloud.google.com": "#4285f4",
  "colab.research.google.com": "#f9ab00",
  "developer.mozilla.org": "#15141a",
  "chatglm.cn": "#3859ff",
  "doubao.com": "#1e37fc",
  "douyin.com": "#000000",
  "docs.google.com": "#4285f4",
  "firefly.adobe.com": "#ff0000",
  "firebase.google.com": "#dd2c00",
  "google.com": "#4285f4",
  "grok.com": "#000000",
  "huggingface.co": "#ffd21e",
  "instagram.com": "#e4405f",
  "iqiyi.com": "#689f38",
  "jd.com": "#ff0000",
  "jimeng.jianying.com": "#1c6fff",
  "kimi.com": "#111827",
  "linkedin.com": "#0a66c2",
  "mimo.mi.com": "#000000",
  "mimo.xiaomi.com": "#000000",
  "mgtv.com": "#f86f11",
  "midjourney.com": "#0050c9",
  "openai.com": "#412991",
  "pinduoduo.com": "#e02e24",
  "raycast.com": "#ff6363",
  "spotify.com": "#1ed760",
  "suno.com": "#000000",
  "tiktok.com": "#000000",
  "teams.microsoft.com": "#6264a7",
  "v.qq.com": "#30a3f9",
  "xiaohongshu.com": "#ff2442",
  "xiaomimimo.com": "#000000",
  "zhihu.com": "#0084ff"
});
const ORIGINAL_ARTWORK_BRAND_TILE_SITE_KEYS_FOR_TEST = new Set([
  "developer.mozilla.org",
  "jd.com"
]);
const REMOTE_BRAND_ICON_DIRECT_FETCH_SCORE_MIN = 90;
const REMOTE_BRAND_ICON_PROVIDER_VERSION = 2;

assert.match(
  source,
  /function bindFaviconFallback[\s\S]*forgetMissingLocalSiteIcon[\s\S]*recoverMissingLocalIconViaCloud/,
  "Indexed local icons removed from the bundle must recover through cloud providers before favicon fallback."
);
const runtimeSiteIconMapSource = source.match(/const SITE_ICON_FILE_BY_SITE_KEY = Object\.freeze\(\{[\s\S]*?\n\}\);/)?.[0] || "";
assert.equal(
  [...runtimeSiteIconMapSource.matchAll(/:\s*"([^\"]+\.(?:svg|png|ico))"/g)]
    .map((match) => match[1])
    .filter((fileName) => !siteIconIndex.includes(fileName))
    .length,
  0,
  "Runtime local-icon mappings must stay represented in the icon index so missing files can enter cloud recovery."
);

assert.match(source, /@lobehub\/icons-static-svg/, "LobeHub static SVG package must be available as a supplemental remote provider.");
assert.match(source, /function remoteBrandProviderHasSlug[\s\S]*remoteBrandProviderSlugs/, "Remote providers must check an index before fetching a slug.");
assert.match(source, /function fetchLobeHubStaticSvgSlugs/, "LobeHub provider must discover SVG slugs from the static SVG package index.");
assert.match(source, /id: "thesvg"[\s\S]*urlForSlug: \(slug\) => `https:\/\/cdn\.jsdelivr\.net\/gh\/glincker\/thesvg@main\/public\/icons\/\$\{encodeURIComponent\(slug\)\}\/default\.svg`/, "theSVG provider must download the default SVG from the same jsDelivr repository used by its index.");
assert.doesNotMatch(source, /https:\/\/thesvg\.org\/icons\/\$\{encodeURIComponent\(slug\)\}/, "theSVG downloads must not split index and content across different routing surfaces.");
assert.match(source, /function fetchTheSvgSlugs[\s\S]*\/\^\\\/public\\\/icons\\\/\(\.\+\)\\\/default\\\.svg\$\/i/, "theSVG provider must discover default SVG slugs from the jsDelivr GitHub package index.");
assert.match(
  source,
  /const REMOTE_BRAND_ICON_PROVIDERS = Object\.freeze\(\[\s*\{\s*id: "thesvg"[\s\S]*?\},\s*\{\s*id: "lobehub"[\s\S]*?\}\s*\]\);/,
  "Remote cloud providers must be limited to theSVG and LobeHub."
);
assert.match(
  source,
  /async function remoteBrandProviderSlugRequest\(provider\) \{\s*if \(provider\.index === "lobehub-static-svg"\) \{\s*return fetchLobeHubStaticSvgSlugs\(provider\.packageName\);\s*\}\s*if \(provider\.index === "thesvg"\) \{\s*return fetchTheSvgSlugs\(\);\s*\}\s*return new Set\(\);\s*\}/,
  "Remote provider index dispatch must only route theSVG and LobeHub."
);
assert.match(source, /if \(cachedEntry\?\.request\) \{[\s\S]*return cachedEntry\.request;/, "Concurrent icon cards should share one provider index request.");
assert.doesNotMatch(source, /function remoteBrandGlyphColorForTile/, "Remote SVG data URLs must not fork a separate glyph strategy from local SVGs.");
assert.match(source, /isSvgDataUrl\(source\)[\s\S]*return localBrandGlyphColorForTile\(tileColor, brandColor\);/, "Remote SVG data URLs must use the same glyph strategy as local SVGs.");
assert.equal(source.includes("`data-wayleaf-" + "tile-light="), false, "Remote SVG descriptors must not cache display tile decisions separately from local SVG rendering.");
assert.equal(source.includes("`data-wayleaf-" + "glyph-light="), false, "Remote SVG descriptors must not cache display glyph decisions separately from local SVG rendering.");
assert.match(source, /if \(iconPath && \(tileColor \|\| originalSvgColor \|\| gradientSvgColor\)\) \{[\s\S]*tileColors = brandIconTileColors\(tileColor \|\| originalSvgColor \|\| gradientSvgColor, siteKey, iconPath\);/, "Remote SVG data URLs must use the same tile strategy entrypoint as local SVGs.");
assert.match(source, /function remoteBrandSvgHasComplexPaint/, "Remote SVG classification must reject complex paint sources.");
assert.match(source, /function remoteBrandSvgQuality/, "Remote SVGs must pass a quality gate before being cached.");
assert.match(source, /function remoteBrandIconRankedCandidates/, "Remote slug candidates must be ranked before fetching.");
assert.match(source, /data-wayleaf-render-mode/, "Remote SVGs must carry a render mode descriptor.");
assert.match(source, /remoteBrandSvgDescriptorFromSource\(siteIcon\)/, "Cached remote SVGs must drive their own tile strategy.");
assert.match(source, /function remoteBrandSvgCacheStrategy/, "Remote SVG cache entries must retain a strategy descriptor.");
assert.match(source, /const isLocalIconSource = String\(iconPath \|\| ""\)\.startsWith\("icons\/"\);/, "Only deployed local icon files should receive the local icon marker.");
assert.match(source, /function remoteBrandSvgResponseMayContainSvg/, "Provider responses must reject explicit non-SVG content types.");
assert.doesNotMatch(source, /parseFromString\([^)]*text\/html|createHTMLDocument/, "Remote site icon discovery must not parse third-party HTML as a live extension-page document.");
const siteIconDocumentExtractorSource = source.match(/function extractSiteIconDocumentCandidates\([\s\S]*?\n}\n\nfunction parseHtmlTagAttributes/)?.[0] || "";
assert.match(siteIconDocumentExtractorSource, /<link\\b/, "Remote site icon discovery should stay limited to link-tag markup extraction.");
assert.doesNotMatch(siteIconDocumentExtractorSource, /DOMParser|createHTMLDocument|innerHTML|querySelectorAll|appendChild|insertAdjacentHTML/, "Remote site icon discovery must not reintroduce live third-party HTML parsing sinks.");
assert.match(source, /function remoteBrandIconMissCacheIsFresh/, "Provider misses must have an explicit freshness gate.");
assert.match(source, /remoteBrandSvgBrandColor\(svg, options\)/, "Fetched provider SVGs must derive brand color through the provider trust gate.");
assert.match(source, /SITE_ICON_TILE_COLOR_BY_SITE_KEY\[options\.siteKey\]/, "Provider color fallback must compare against known local VI colors.");
assert.match(source, /function hydrateLocalSiteIconBrandColor[\s\S]*loadLocalSiteIconBrandColor\(iconPath\)/, "Local SVGs missing a VI table entry must hydrate their own parsed monochrome brand color.");
assert.match(source, /function applyRemoteBrandColorToLocalIcon[\s\S]*localSiteIconBrandColorCache\.set\(localIcon, descriptor\.brandColor\)/, "Local SVGs missing a VI color must allow a remote provider SVG to supplement only the color strategy.");
assert.match(source, /function keepsBrandIconOriginalOnBrandTile/, "Local SVGs with an embedded VI carrier can preserve original artwork on a brand tile.");
assert.match(source, /"suno\.com": "#000000"/, "Suno's monochrome local SVG must share the black/white mask carrier used by X and GitHub.");
assert.doesNotMatch(source, /nativeRoundedBrandIcon|NATIVE_ROUNDED_BRAND_ICON_SITE_KEYS/, "Grok must not keep a dedicated native-rounded SVG rendering branch.");
assert.match(linkedInSvgSource, /fill=["']#0A66C2["']/i, "LinkedIn local SVG keeps its explicit brand blue.");
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
assert.match(source, /function applyIconTileEdge[\s\S]*blackishCarrierColor\(tileColors\.dark\) \? "none" : "var\(--custom-site-icon-shadow\)"/, "Site icon edges must hide only blackish dark-mode carriers.");
assert.match(cssSource, /\.recent-folder-logo,[\s\S]*\.site-icon:not\(\.favorite-icon\) \{\s*box-shadow: var\(--site-icon-edge-light, var\(--custom-site-icon-shadow\)\);/m, "Shared site icon edges must read the light-theme edge variable.");
assert.match(cssSource, /:root\[data-theme="dark"\] \.recent-folder-logo,[\s\S]*:root\[data-theme="dark"\] \.site-icon:not\(\.favorite-icon\) \{\s*box-shadow: var\(--site-icon-edge-dark, var\(--custom-site-icon-shadow\)\);/m, "Shared site icon edges must read the dark-theme edge variable.");
assert.match(cssSource, /\.ai-engine-pill img\.site-icon \{\s*box-shadow: none;\s*\}/m, "Search AI engine pill icons must stay outside shared site icon edge rendering.");
assert.match(cssSource, /:root\[data-theme="dark"\] \.ai-engine-pill img\.site-icon \{\s*box-shadow: none;\s*\}/m, "Search AI engine pill icons must stay outside dark-mode shared site icon edge rendering.");
assert.equal(
  /\.settings-engine-icon[^{]*\{[^}]*--site-icon-edge/.test(cssSource),
  false,
  "Settings engine icons must not consume shared site icon edge variables."
);
assert.match(source, /function applySampledFaviconTile[\s\S]*const tileMode = icon\.dataset\.iconTile === "brand" \? "brand" : "plain";[\s\S]*fuseEmbeddedFaviconTile\(icon, sample, color, tileColors, options\);/, "Sampled favicon tiles must preserve local bitmap markers and run embedded tile fusion.");
assert.match(source, /const FIRST_PAINT_CACHE_VERSION = 8;/, "First-paint cache must be bumped when adaptive favicon carrier output changes.");
assert.match(source, /function primeSiteIconRawSvgCacheFromStorage\([\s\S]*siteIconRawSvgStalePaths\.add\(path\);/, "Cached local SVGs must revalidate after same-version asset edits.");
assert.doesNotMatch(source, /entry\?\.version !== currentVersion/, "Local SVG revalidation must not depend on a manifest-version bump.");
assert.match(source, /function revalidateDisplayedLocalSiteIcon\([\s\S]*fetch\(key, \{ cache: "no-store" \}\)/, "Local SVG revalidation must bypass the browser cache.");
assert.match(source, /function hydrateLocalSiteIconBrandColor[\s\S]*localSiteIconRenderMode\(iconPath\) && !siteIconRawSvgStalePaths\.has\(iconPath\)/, "Stale local SVGs must rehydrate even when an old render-mode cache exists.");
assert.match(source, /function loadLocalSiteIconBrandColor[\s\S]*const shouldRevalidate = siteIconRawSvgStalePaths\.has\(value\);[\s\S]*fetch\(value, shouldRevalidate \? \{ cache: "no-store" \} : undefined\)/, "Stale local SVG reloads must bypass both Wayleaf analysis caches and browser cache.");

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

function hexColorStatsForTest(tileColor) {
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

function assertReadableIconPair(tileColor, glyphColor, message, minContrast = BRAND_ICON_VI_CONTRAST_MIN) {
  assert.ok(
    contrastRatio(tileColor, glyphColor) >= minContrast,
    `${message}: ${tileColor} on ${glyphColor} contrast ${contrastRatio(tileColor, glyphColor).toFixed(2)}`
  );
}

function assertPaletteCarrierSeparatedForTest(iconPath, brandColor, carrierColor, mode, message) {
  const palette = originalSvgVisiblePaletteForTest(brandColor, iconPath);
  assert.ok(palette.length > 1, `${message}: SVG palette must be multicolor`);
  assert.ok(
    [BRAND_ICON_MULTICOLOR_PAPER_CARRIER, BRAND_ICON_MULTICOLOR_DARK_CARRIER].includes(carrierColor),
    `${message}: ${carrierColor} must use the neutral app-icon carrier system`
  );
  const expected = paletteNeedsDarkAppIconCarrierForTest(palette)
    ? BRAND_ICON_MULTICOLOR_DARK_CARRIER
    : BRAND_ICON_MULTICOLOR_PAPER_CARRIER;
  assert.equal(carrierColor, expected, `${message}: carrier must follow the paper-default design rule`);
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

function remoteBrandSlugMapFromFileListForTest(files, pattern) {
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

function remoteBrandProviderSlugForCandidateForTest(slugs, slug) {
  const normalizedSlug = remoteBrandIconSlug(slug);
  if (!normalizedSlug) {
    return "";
  }
  return slugs instanceof Map
    ? slugs.get(normalizedSlug) || ""
    : slugs.has(normalizedSlug) ? normalizedSlug : "";
}

function remoteBrandProviderHasSlugForTest(slugs, slug) {
  return Boolean(remoteBrandProviderSlugForCandidateForTest(slugs, slug));
}

function remoteBrandShouldFetchCandidateForTest(slugs, candidate) {
  return remoteBrandProviderHasSlugForTest(slugs, candidate.slug)
    || candidate.score >= REMOTE_BRAND_ICON_DIRECT_FETCH_SCORE_MIN;
}

const SITE_ICON_FILE_BY_SITE_KEY_FOR_TEST = Object.freeze({
  "1688.com": "1688.ico",
  "alibaba.com": "alibabadotcom.svg",
  "alipay.com": "alipay.svg",
  "aistudio.google.com": "aistudio.svg",
  "atlassian.net": "jira.svg",
  "aws.amazon.com": "aws.svg",
  "azure.microsoft.com": "azure.svg",
  "b.ai": "bai.png",
  "bitbucket.org": "bitbucket.svg",
  "chrome.google.com": "chrome.svg",
  "chatglm.cn": "glm.svg",
  "cloud.google.com": "googlecloud.svg",
  "colab.research.google.com": "colab.svg",
  "developer.mozilla.org": "mdn.svg",
  "doubao.com": "doubao.svg",
  "douyin.com": "douyin.svg",
  "firefly.adobe.com": "adobefirefly.svg",
  "firebase.google.com": "firebase.svg",
  "gemini.google.com": "googlegemini.svg",
  "iqiyi.com": "iqiyi.svg",
  "jimeng.jianying.com": "jimeng.svg",
  "mimo.mi.com": "xiaomimimo.svg",
  "mimo.xiaomi.com": "xiaomimimo.svg",
  "mgtv.com": "mgtv.svg",
  "music.163.com": "neteasecloudmusic.svg",
  "kimi.com": "kimi.svg",
  "npmjs.com": "npm.svg",
  "office.com": "microsoftoffice.svg",
  "openai.com": "chatgpt.svg",
  "pinduoduo.com": "pinduoduo.svg",
  "qq.com": "qq.svg",
  "stackoverflow.com": "stackoverflow.svg",
  "store.epicgames.com": "epicgames.svg",
  "teams.microsoft.com": "microsoftteams.svg",
  "trip.com": "tripdotcom.svg",
  "v.qq.com": "vqq.svg",
  "xiaohongshu.com": "xiaohongshu.svg"
});

function localIconForSiteKeyForTest(siteKey) {
  const fileName = SITE_ICON_FILE_BY_SITE_KEY_FOR_TEST[siteKey] || `${String(siteKey || "").split(".")[0]}.svg`;
  return availableSiteIconFiles.has(fileName) ? `icons/sites/${fileName}` : "";
}

function remoteProviderCanRunForSiteKeyForTest(siteKey) {
  return !localIconForSiteKeyForTest(siteKey);
}

function remoteBrandSvgHasComplexPaint(svg) {
  return remoteBrandSvgHasComplexPaintAnalysisForTest(svgPaintAnalysis(svg));
}

function remoteBrandSvgHasComplexPaintAnalysisForTest(analysis) {
  return analysis.paintServerColors.length > 1
    || (analysis.paintServerColors.length > 0 && analysis.visibleColors.length > 1)
    || (analysis.hasEffectPaintServer && analysis.visibleColors.length > 1);
}

function remoteBrandSvgUsesPaintServer(svg) {
  return svgPaintAnalysis(svg).usesPaintServer;
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
  return /^(?:\s*<\?xml[^>]*>\s*)?(?:\s*<!doctype[^>]*>\s*)?(?:\s*<!--[\s\S]*?-->\s*)*<svg\b/i.test(String(svg || ""));
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
  return Boolean(entry?.missing
    && entry?.source === "remote-brand"
    && entry?.providerVersion === REMOTE_BRAND_ICON_PROVIDER_VERSION
    && siteIconCacheEntryIsFresh(entry, ttl, now));
}

function remoteBrandSvgDescriptor(svg, options = {}) {
  const brandColor = normalizeHexColor(options.brandColor || "") || "";
  const analysis = svgPaintAnalysis(svg);
  const isMonochrome = !analysis.usesPaintServer && analysis.visibleColors.length <= 1;
  const renderMode = remoteBrandSvgHasComplexPaintAnalysisForTest(analysis)
    ? "gradient"
    : isMonochrome ? "mask" : "original";
  return {
    brandColor,
    isMonochrome,
    renderMode,
    visibleColors: analysis.colors,
    embeddedCarrierColor: svgEmbeddedCarrierColorForTest(svg, analysis),
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
    visibleColors: descriptor.visibleColors || [],
    embeddedCarrierColor: descriptor.embeddedCarrierColor || "",
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
    visibleColors: svgPaletteDataAttributeColors(attr("visible-colors")),
    embeddedCarrierColor: normalizeHexColor(attr("embedded-carrier")),
    qualityScore: Number(attr("quality") || 0)
  };
}

function prepareRemoteBrandSvgForTest(svg, options = {}) {
  const descriptor = remoteBrandSvgDescriptor(svg, options);
  const color = descriptor.brandColor;
  const visibleColorAttr = svgPaletteDataAttribute(descriptor.visibleColors);
  const embeddedCarrierAttr = descriptor.embeddedCarrierColor || "";
  return String(svg || "").trim().replace(/<svg\b([^>]*)>/i, (match, attrs) => {
    const brandAttr = color ? ` data-wayleaf-brand-color="${color}"` : "";
    const visibleColorsAttr = visibleColorAttr ? ` data-wayleaf-visible-colors="${visibleColorAttr}"` : "";
    const embeddedCarrierColorAttr = embeddedCarrierAttr ? ` data-wayleaf-embedded-carrier="${embeddedCarrierAttr}"` : "";
    const metadataAttrs = [
      `data-wayleaf-remote-brand="true"`,
      `data-wayleaf-monochrome="${descriptor.isMonochrome ? "true" : "false"}"`,
      `data-wayleaf-render-mode="${descriptor.renderMode}"`,
      `data-wayleaf-quality="${descriptor.qualityScore}"`
    ];
    return `<svg${attrs} ${metadataAttrs.join(" ")}${brandAttr}${visibleColorsAttr}${embeddedCarrierColorAttr}>`;
  });
}

function svgEmbeddedCarrierColorForTest(svg, analysis = svgPaintAnalysis(svg)) {
  if (uniqueNormalizedHexColorsForTest(analysis.visibleColors).length <= 1) {
    return "";
  }
  const viewBox = svgViewBoxForTest(String(svg || ""));
  if (!viewBox) {
    return "";
  }
  const shape = String(svg || "").match(/<(path|rect)\b([^>]*)>/i);
  if (!shape) {
    return "";
  }
  const attrs = svgAttributesForTest(shape[2]);
  const color = normalizeSvgHexColor(attrs.fill || svgStyleDeclarationPropertiesForTest(attrs.style || "").fill);
  if (!color) {
    return "";
  }
  const rounded = shape[1].toLowerCase() === "rect"
    ? svgRectCoversViewBoxWithEqualRadiusForTest(attrs, viewBox)
    : svgPathCoversViewBoxWithEqualRadiusForTest(attrs.d || "", viewBox);
  return rounded ? color : "";
}

function svgViewBoxForTest(svg) {
  const match = String(svg || "").match(/<svg\b[^>]*\sviewBox=(["'])([^"']+)\1/i);
  const values = match?.[2]?.trim().split(/[\s,]+/).map(Number) || [];
  return values.length === 4 && values.every(Number.isFinite)
    ? { x: values[0], y: values[1], width: values[2], height: values[3] }
    : null;
}

function svgRectCoversViewBoxWithEqualRadiusForTest(attrs, viewBox) {
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

function svgPathCoversViewBoxWithEqualRadiusForTest(d, viewBox) {
  const segments = svgPathSegmentsForTest(d);
  if (!segments.length) {
    return false;
  }
  const points = segments.flatMap((segment) => segment.points);
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const roundedCornerRadii = svgPathEqualCornerRadiiForTest(segments, viewBox);
  return Math.abs(Math.min(...xs) - viewBox.x) <= 0.01
    && Math.abs(Math.min(...ys) - viewBox.y) <= 0.01
    && Math.abs(Math.max(...xs) - (viewBox.x + viewBox.width)) <= 0.01
    && Math.abs(Math.max(...ys) - (viewBox.y + viewBox.height)) <= 0.01
    && roundedCornerRadii.length === 4;
}

function svgPathSegmentsForTest(d) {
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

function svgPathEqualCornerRadiiForTest(segments, viewBox) {
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

function extractSvgColorPalette(svg) {
  return svgPaintAnalysis(svg).colors;
}

function extractSvgPaintServerColors(svg) {
  return svgPaintAnalysis(svg).paintServerColors;
}

function svgPaletteDataAttribute(colors) {
  const palette = uniqueNormalizedHexColorsForTest(colors);
  return palette.length ? palette.join(",") : "";
}

function svgPaletteDataAttributeColors(value) {
  return uniqueNormalizedHexColorsForTest(String(value || "").split(","));
}

function uniqueNormalizedHexColorsForTest(colors) {
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
  return svgPaintAnalysisFromText(String(svg || ""));
}

const SVG_PAINT_COLOR_PROPERTIES_FOR_TEST = Object.freeze([
  "fill",
  "stroke",
  "color",
  "stop-color",
  "flood-color",
  "lighting-color"
]);
const SVG_PAINT_SERVER_REFERENCE_PROPERTIES_FOR_TEST = Object.freeze([
  "fill",
  "stroke",
  "filter",
  "mask"
]);
const SVG_PAINT_STYLE_PROPERTIES_FOR_TEST = Object.freeze([
  ...new Set([...SVG_PAINT_COLOR_PROPERTIES_FOR_TEST, ...SVG_PAINT_SERVER_REFERENCE_PROPERTIES_FOR_TEST])
]);

function svgPaintAnalysisFromText(svg) {
  const text = String(svg || "");
  const elements = svgElementsForTest(text);
  const byId = new Map(elements.filter((element) => element.attributes.id).map((element) => [element.attributes.id, element]));
  const styleRules = svgStyleRulesForTest(text);
  const colors = [];
  const visibleColors = [];
  const definitionColors = [];
  const paintServerColors = [];
  const seenColors = new Set();
  const seenVisibleColors = new Set();
  const seenDefinitionColors = new Set();
  const seenPaintServerColors = new Set();
  const effectPaintServerTags = new Set(["pattern", "filter", "mask"]);
  const paintServerTags = new Set(["lineargradient", "radialgradient", "meshgradient", "pattern", "filter", "mask", "clippath"]);
  let usesPaintServer = false;
  let hasEffectPaintServer = false;
  const push = (target, seen, value, currentColor = "") => {
    const color = normalizeSvgHexColor(resolveSvgColorValueForTest(value, currentColor));
    if (!color || seen.has(color)) {
      return;
    }
    seen.add(color);
    target.push(color);
  };
  const styleValue = (element, property) => {
    const attributeValue = element.attributes[property] || "";
    let value = attributeValue;
    styleRules.forEach((rule) => {
      if (rule.properties[property] && svgElementMatchesForTest(element, rule.selector)) {
        value = rule.properties[property];
      }
    });
    return {
      attributeValue,
      value: svgStyleDeclarationPropertiesForTest(element.attributes.style || "")[property] || value
    };
  };
  const paintValue = (element, property) => styleValue(element, property).value;
  const isInsidePaintServerDefinition = (element) => {
    let current = element;
    while (current) {
      if (paintServerTags.has(current.tag)) {
        return true;
      }
      current = current.parent;
    }
    return false;
  };
  const inheritedColor = (element) => {
    let current = element;
    while (current) {
      const color = normalizeSvgHexColor(resolveSvgColorValueForTest(paintValue(current, "color")));
      if (color) {
        return color;
      }
      current = current.parent;
    }
    return "";
  };
  const collectPaintServerColors = (paintServer, visited = new Set()) => {
    if (!paintServer || visited.has(paintServer)) {
      return;
    }
    visited.add(paintServer);
    [paintServer, ...svgDescendantsForTest(paintServer)].forEach((element) => {
      const currentColor = inheritedColor(element);
      SVG_PAINT_COLOR_PROPERTIES_FOR_TEST.forEach((property) => {
        const value = paintValue(element, property);
        push(definitionColors, seenDefinitionColors, value, currentColor);
        push(paintServerColors, seenPaintServerColors, value, currentColor);
      });
      const href = element.attributes.href || element.attributes["xlink:href"] || "";
      const inheritedPaintServer = href.startsWith("#") ? byId.get(href.slice(1)) : null;
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
    const paintServer = byId.get(match[1]);
    if (!paintServer) {
      return;
    }
    usesPaintServer = true;
    if (effectPaintServerTags.has(paintServer.tag)) {
      hasEffectPaintServer = true;
    }
    collectPaintServerColors(paintServer);
  };
  const hasImplicitBlackPaint = (element) => {
    if (!["path", "circle", "rect", "polygon", "polyline", "line", "ellipse"].includes(element.tag)
      || isInsidePaintServerDefinition(element)) {
      return false;
    }
    let current = element;
    while (current) {
      if (styleValue(current, "fill").value || styleValue(current, "stroke").value) {
        return false;
      }
      current = current.parent;
    }
    return true;
  };

  elements.forEach((element) => {
    const currentColor = inheritedColor(element);
    SVG_PAINT_COLOR_PROPERTIES_FOR_TEST.forEach((property) => {
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
    SVG_PAINT_SERVER_REFERENCE_PROPERTIES_FOR_TEST.forEach((property) => {
      collectPaintServer(paintValue(element, property));
    });
  });
  if (visibleColors.length > 1 && elements.some(hasImplicitBlackPaint)) {
    push(visibleColors, seenVisibleColors, "#000000");
  }
  visibleColors.forEach((color) => push(colors, seenColors, color));
  definitionColors.forEach((color) => push(colors, seenColors, color));
  paintServerColors.forEach((color) => push(visibleColors, seenVisibleColors, color));
  paintServerColors.forEach((color) => push(colors, seenColors, color));
  return { colors, visibleColors, definitionColors, paintServerColors, usesPaintServer, hasEffectPaintServer };
}

function svgElementsForTest(svg) {
  const root = { tag: "#root", attributes: {}, parent: null, children: [] };
  const stack = [root];
  const elements = [];
  const leafTags = new Set(["path", "rect", "circle", "ellipse", "line", "polyline", "polygon", "stop", "feflood", "feblend", "fegaussianblur", "use"]);
  for (const match of String(svg || "").matchAll(/<\/?([A-Za-z][\w:.-]*)([^<>]*?)(\/?)>/g)) {
    const full = match[0];
    const tag = match[1].toLowerCase();
    if (full.startsWith("</")) {
      while (stack.length > 1) {
        const current = stack.pop();
        if (current?.tag === tag) {
          break;
        }
      }
      continue;
    }
    if (/^<!(?:--|\[CDATA\[)/.test(full) || tag.startsWith("?")) {
      continue;
    }
    const parent = stack[stack.length - 1];
    const element = {
      tag,
      attributes: svgAttributesForTest(match[2] || ""),
      parent,
      children: []
    };
    parent.children.push(element);
    elements.push(element);
    if (!match[3] && !/\/>$/.test(full) && !leafTags.has(tag)) {
      stack.push(element);
    }
  }
  return elements;
}

function svgDescendantsForTest(element) {
  const descendants = [];
  const visit = (current) => {
    current.children.forEach((child) => {
      descendants.push(child);
      visit(child);
    });
  };
  visit(element);
  return descendants;
}

function svgAttributesForTest(attrs) {
  const result = {};
  for (const match of String(attrs || "").matchAll(/([:\w.-]+)\s*=\s*(["'])(.*?)\2/g)) {
    result[match[1].toLowerCase()] = match[3];
  }
  return result;
}

function svgStyleRulesForTest(svg) {
  const rules = [];
  const stylePattern = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
  const cssSources = [];
  for (const match of String(svg || "").matchAll(stylePattern)) {
    cssSources.push(match[1]);
  }
  cssSources.forEach((css) => {
    for (const match of String(css || "").matchAll(/([^{}]+)\{([^{}]+)\}/g)) {
      const properties = svgStyleDeclarationPropertiesForTest(match[2]);
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

function svgStyleDeclarationPropertiesForTest(styleText) {
  const properties = {};
  String(styleText || "").split(";").forEach((declaration) => {
    const separator = declaration.indexOf(":");
    if (separator <= 0) {
      return;
    }
    const property = declaration.slice(0, separator).trim().toLowerCase();
    if (!SVG_PAINT_STYLE_PROPERTIES_FOR_TEST.includes(property)) {
      return;
    }
    properties[property] = declaration.slice(separator + 1).trim();
  });
  return properties;
}

function svgElementMatchesForTest(element, selector) {
  const value = String(selector || "").trim();
  if (!value || /[\s>+~:[\]]/.test(value)) {
    return false;
  }
  if (value === "*") {
    return true;
  }
  if (value.startsWith(".")) {
    return String(element.attributes.class || "").split(/\s+/).includes(value.slice(1));
  }
  if (value.startsWith("#")) {
    return element.attributes.id === value.slice(1);
  }
  const compound = value.match(/^([a-z][\w:-]*)(?:\.([\w-]+))?$/i);
  if (compound) {
    return element.tag === compound[1].toLowerCase()
      && (!compound[2] || String(element.attributes.class || "").split(/\s+/).includes(compound[2]));
  }
  return false;
}

function resolveSvgColorValueForTest(value, currentColor = "") {
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

function remoteBrandSvgIsMonochrome(svg) {
  const analysis = svgPaintAnalysis(svg);
  if (analysis.usesPaintServer) {
    return false;
  }
  return analysis.visibleColors.length <= 1;
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

function remoteBrandSvgBrandColor(svg, options = {}) {
  const palette = extractSvgColorPalette(svg);
  const localColor = options.allowSiteKeyColorFallback === false
    ? ""
    : normalizeHexColor(options.siteKey ? SITE_ICON_TILE_COLOR_BY_SITE_KEY_FOR_TEST[options.siteKey] || "" : "");
  const expressiveColor = palette.find((color) => !remoteBrandColorLooksNeutral(color));
  return expressiveColor || localColor || remoteBrandSvgMonochromeBrandColor(svg, palette) || "";
}

function remoteBrandSvgMonochromeBrandColor(svg, palette = extractSvgColorPalette(svg)) {
  if (!remoteBrandSvgIsMonochrome(svg)) {
    return "";
  }
  if (palette.length === 1) {
    const color = normalizeHexColor(palette[0]);
    return color && !nearWhiteBrandColor(color) ? color : "";
  }
  return remoteBrandSvgUsesImplicitBlack(svg) ? "#000000" : "";
}

function remoteBrandSvgUsesImplicitBlack(svg) {
  const text = String(svg || "");
  return remoteBrandSvgHasRootElement(text)
    && remoteBrandSvgShapeCount(text) > 0
    && !/\s(?:fill|stroke|color)\s*=/i.test(text)
    && !/(?:fill|stroke|color)\s*:/i.test(text);
}

function localSiteIconAnalysisFromSvgForTest(svg) {
  if (!remoteBrandSvgHasRootElement(svg)) {
    return { brandColor: "", renderMode: "", hasExplicitBrandColor: false, visibleColors: [], embeddedCarrierColor: "" };
  }
  const analysis = svgPaintAnalysis(svg);
  const isMonochrome = !analysis.usesPaintServer && analysis.visibleColors.length <= 1;
  const palette = analysis.colors;
  const explicitBrandColor = isMonochrome && palette.length === 1
    ? remoteBrandSvgMonochromeBrandColor(svg, palette)
    : "";
  return {
    brandColor: explicitBrandColor || (isMonochrome && remoteBrandSvgUsesImplicitBlack(svg) ? "#000000" : ""),
    renderMode: remoteBrandSvgHasComplexPaintAnalysisForTest(analysis) ? "gradient" : isMonochrome ? "mask" : "original",
    hasExplicitBrandColor: Boolean(explicitBrandColor),
    visibleColors: analysis.colors,
    embeddedCarrierColor: svgEmbeddedCarrierColorForTest(svg, analysis)
  };
}

function svgUsesGradientIconCarrierForTest(svg) {
  return remoteBrandSvgHasComplexPaint(svg);
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
const FAVICON_ADAPTIVE_CARRIER_VERSION = 10;
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

function colorSaturation(red, green, blue) {
  return colorChannelSpread(red, green, blue) / Math.max(1, red, green, blue);
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
    ownTileShapeConfidence: candidate.ownTileShapeConfidence,
    ownTileCornerStyle: candidate.ownTileCornerStyle,
    unframedGlyph: Boolean(candidate.unframedGlyph),
    compactEmblem: Boolean(candidate.compactEmblem),
    preferredSelfContainedTile: Boolean(candidate.preferredSelfContainedTile),
    matchMode,
    foreground: faviconForegroundStatsForCandidate(selectedColor, analysis, size),
    paperSurface: faviconPaperSurfaceStats(analysis, size)
  };
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
  const background = { red: candidate.red, green: candidate.green, blue: candidate.blue };
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
    return { coverage: 0, averageContrast: 0, maxContrast: 0, red: 0, green: 0, blue: 0, colors: [], spansCenter: false, span: 0 };
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

function faviconOwnTileShapeSupport(samples, bounds, size, coverage) {
  const width = bounds.maxX - bounds.minX + 1;
  const height = bounds.maxY - bounds.minY + 1;
  const minSpan = Math.min(width / size, height / size);
  const maxSpan = Math.max(width / size, height / size);
  if (coverage < 0.14 || minSpan < 0.38 || maxSpan > 1.01 || !faviconCandidateSpansCenter(bounds, size)) {
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
  const confidence = circleCornerConfidence > 0
    ? circleCornerConfidence
    : Math.max(straightCornerConfidence, roundedCornerConfidence);
  if (confidence < 0.42) {
    return { confidence: 0, cornerStyle: "" };
  }
  const cornerStyle = circleCornerConfidence > 0
    ? "circle"
    : roundedCornerConfidence > straightCornerConfidence ? "rounded" : "straight";
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
  return { average: (rowRatio + columnRatio) / 2, rowRatio, columnRatio };
}

function dominantFaviconSampleBackgroundColor(sample, options = {}) {
  return selectFaviconBackgroundCandidate(analyzeFaviconImageColors(sample.data, sample.size), sample.size, options);
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
      && !faviconCandidateHasUnreadableForeground(color, tileColor);
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

function mixColorUntilContrast(color, target, minimumContrast, initialAmount, maxMix = FAVICON_EMBEDDED_TILE_CONTRAST_MAX_MIX) {
  for (let amount = initialAmount; amount <= maxMix; amount += 0.04) {
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

const LOCAL_SVG_SOURCE_BY_PATH_FOR_TEST = Object.freeze({
  "icons/sites/alibabadotcom.svg": alibabaSvgSource,
  "icons/sites/alipay.svg": alipaySvgSource,
  "icons/sites/antigravity.svg": antigravitySvgSource,
  "icons/sites/baidu.svg": '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M0 0h24v24H0z"/></svg>',
  "icons/sites/bilibili.svg": '<svg fill="#00a1d6" viewBox="0 0 24 24"><path d="M0 0h24v24H0z"/></svg>',
  "icons/sites/bing.svg": bingSvgSource,
  "icons/sites/chatgpt.svg": chatgptSvgSource,
  "icons/sites/chrome.svg": chromeSvgSource,
  "icons/sites/dailymotion.svg": dailymotionSvgSource,
  "icons/sites/doubao.svg": doubaoSvgSource,
  "icons/sites/douyin.svg": douyinSvgSource,
  "icons/sites/epicgames.svg": epicGamesSvgSource,
  "icons/sites/huggingface.svg": huggingfaceSvgSource,
  "icons/sites/instagram.svg": instagramSvgSource,
  "icons/sites/jimeng.svg": jimengSvgSource,
  "icons/sites/kimi.svg": kimiSvgSource,
  "icons/sites/google.svg": googleSvgSource,
  "icons/sites/unlistedmulticolor.svg": '<svg viewBox="0 0 24 24"><path fill="#4285f4"/><path fill="#ea4335"/></svg>',
  "icons/sites/grok.svg": grokSvgSource,
  "icons/sites/linkedin.svg": linkedInSvgSource,
  "icons/sites/medium.svg": mediumSvgSource,
  "icons/sites/mgtv.svg": mgtvSvgSource,
  "icons/sites/netflix.svg": netflixSvgSource,
  "icons/sites/pinduoduo.svg": pinduoduoSvgSource,
  "icons/sites/qq.svg": qqSvgSource,
  "icons/sites/roblox.svg": robloxSvgSource,
  "icons/sites/microsoftteams.svg": teamsSvgSource,
  "icons/sites/tiktok.svg": tiktokSvgSource,
  "icons/sites/tripdotcom.svg": tripdotcomSvgSource,
  "icons/sites/vqq.svg": vqqSvgSource,
  "icons/sites/wikipedia.svg": wikipediaSvgSource,
  "icons/sites/whatsapp.svg": whatsappSvgSource,
  "icons/sites/wechat.svg": wechatSvgSource,
  "icons/sites/spotify.svg": spotifySvgSource,
  "icons/sites/xiaohongshu.svg": xiaohongshuSvgSource,
  "icons/sites/youtube.svg": youtubeSvgSource
});

const localSiteIconBrandColorCacheForTest = new Map();
const localSiteIconRenderModeCacheForTest = new Map();
const localSiteIconExplicitBrandColorCacheForTest = new Map();
const localSiteIconVisibleColorsCacheForTest = new Map();
const localSiteIconEmbeddedCarrierColorCacheForTest = new Map();

function localSiteIconSvgSourceForTest(source) {
  const fixture = LOCAL_SVG_SOURCE_BY_PATH_FOR_TEST[source];
  if (fixture) {
    return fixture;
  }
  const value = String(source || "");
  if (!value.startsWith("icons/sites/") || !value.endsWith(".svg")) {
    return "";
  }
  const fileName = value.slice("icons/sites/".length);
  if (!siteIconFiles.has(fileName)) {
    return "";
  }
  return readFileSync(new URL(`../icons/sites/${fileName}`, import.meta.url), "utf8");
}

function analyzeLocalSiteIconForTest(source) {
  return localSiteIconAnalysisFromSvgForTest(localSiteIconSvgSourceForTest(source));
}

function cacheLocalSiteIconAnalysisForTest(source, analysis) {
  localSiteIconBrandColorCacheForTest.set(source, analysis.brandColor);
  localSiteIconRenderModeCacheForTest.set(source, analysis.renderMode);
  localSiteIconExplicitBrandColorCacheForTest.set(source, analysis.hasExplicitBrandColor);
  localSiteIconVisibleColorsCacheForTest.set(source, analysis.visibleColors);
  localSiteIconEmbeddedCarrierColorCacheForTest.set(source, analysis.embeddedCarrierColor || "");
}

function localSiteIconBrandColorForTest(source) {
  if (localSiteIconBrandColorCacheForTest.has(source)) {
    return localSiteIconBrandColorCacheForTest.get(source);
  }
  const analysis = analyzeLocalSiteIconForTest(source);
  cacheLocalSiteIconAnalysisForTest(source, analysis);
  return analysis.brandColor;
}

function localSiteIconHasExplicitBrandColorForTest(source) {
  if (localSiteIconExplicitBrandColorCacheForTest.has(source)) {
    return localSiteIconExplicitBrandColorCacheForTest.get(source);
  }
  const analysis = analyzeLocalSiteIconForTest(source);
  cacheLocalSiteIconAnalysisForTest(source, analysis);
  return analysis.hasExplicitBrandColor;
}

function localSiteIconRenderModeForTest(source) {
  if (localSiteIconRenderModeCacheForTest.has(source)) {
    return localSiteIconRenderModeCacheForTest.get(source);
  }
  const analysis = analyzeLocalSiteIconForTest(source);
  cacheLocalSiteIconAnalysisForTest(source, analysis);
  return analysis.renderMode;
}

function localSiteIconVisibleColorsForTest(source) {
  if (localSiteIconVisibleColorsCacheForTest.has(source)) {
    return localSiteIconVisibleColorsCacheForTest.get(source);
  }
  const analysis = analyzeLocalSiteIconForTest(source);
  cacheLocalSiteIconAnalysisForTest(source, analysis);
  return analysis.visibleColors;
}

function localSiteIconEmbeddedCarrierColorForTest(source) {
  if (localSiteIconEmbeddedCarrierColorCacheForTest.has(source)) {
    return localSiteIconEmbeddedCarrierColorCacheForTest.get(source);
  }
  const analysis = analyzeLocalSiteIconForTest(source);
  cacheLocalSiteIconAnalysisForTest(source, analysis);
  return analysis.embeddedCarrierColor;
}

function siteKeyForUrlForTest(url) {
  const parsedUrl = new URL(url);
  const host = parsedUrl.hostname.replace(/^(www|m|mobile)\./, "").toLowerCase();
  return {
    "v.qq.com": "v.qq.com",
    "video.qq.com": "v.qq.com"
  }[host] || (host.endsWith(".qq.com") ? "qq.com" : host);
}

function localIconForUrlForTest(url) {
  return localIconForSiteKeyForTest(siteKeyForUrlForTest(url));
}

function localIconNeedsRemoteBrandColorForTest(siteKey, iconPath = "") {
  return Boolean(siteKey
    && iconPath
    && siteIconSourceLooksLikeSvgForTest(iconPath)
    && !keepsBrandIconOriginalForTest(siteKey, iconPath)
    && !embeddedSvgBrandColorForTest(iconPath)
    && !localSiteIconHasExplicitBrandColorForTest(iconPath));
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

assert.equal(iconSourceCanUseBitmapTileFusionForTest("icons/sites/google.svg"), false, "Local SVGs must stay on the brand/SVG route, never the favicon adaptive route.");
assert.equal(
  iconSourceCanUseBitmapTileFusionForTest(svgTextDataUrl(prepareRemoteBrandSvgForTest('<svg viewBox="0 0 24 24"><path fill="#4285f4" d="M0 0h24v24H0z"/></svg>', { brandColor: "#4285f4" }))),
  false,
  "Remote SVG descriptors must stay on the brand/SVG route, never the favicon adaptive route."
);
assert.equal(iconSourceCanUseBitmapTileFusionForTest("data:image/png;base64,favicon"), true, "Bitmap favicons remain eligible for the favicon adaptive route.");

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
  const localColor = localSiteIconBrandColorForTest(iconPath);
  const embeddedColor = embeddedSvgBrandColorForTest(iconPath);
  if (embeddedColor) {
    return embeddedColor;
  }
  if (localColor && !remoteBrandColorLooksNeutral(localColor) && !nearBlackBrandColor(localColor)) {
    return localColor;
  }
  if (localColor && !localSiteIconHasExplicitBrandColorForTest(iconPath)) {
    return localColor;
  }
  return normalizeHexColor(siteKey ? SITE_ICON_TILE_COLOR_BY_SITE_KEY_FOR_TEST[siteKey] || "" : "")
    || localColor;
}

function keepsBrandIconOriginalForTest(siteKey, iconPath = "") {
  if (keepsBrandIconOriginalOnBrandTileForTest(siteKey, iconPath)) {
    return true;
  }
  const remoteDescriptor = remoteBrandSvgDescriptorFromSource(iconPath);
  if (remoteDescriptor) {
    return remoteDescriptor.renderMode === "original" || remoteDescriptor.renderMode === "gradient";
  }
  const localRenderMode = localSiteIconRenderModeForTest(iconPath);
  if (localRenderMode === "gradient") {
    return true;
  }
  if (localRenderMode === "original") {
    return true;
  }
  if (localRenderMode === "mask") {
    return false;
  }
  if (!siteIconSourceLooksLikeSvgForTest(iconPath)) {
    return true;
  }
  return /^data:image\/svg\+xml[,;]/i.test(iconPath) && !remoteBrandSvgSourceIsMaskableForTest(iconPath);
}

function usesGradientIconCarrierForTest(iconPath = "") {
  const remoteDescriptor = remoteBrandSvgDescriptorFromSource(iconPath);
  if (remoteDescriptor) {
    return remoteDescriptor.renderMode === "gradient";
  }
  return localSiteIconRenderModeForTest(iconPath) === "gradient";
}

function keepsBrandIconOriginalOnBrandTileForTest(siteKey, iconPath = "") {
  return ORIGINAL_ARTWORK_BRAND_TILE_SITE_KEYS_FOR_TEST.has(siteKey)
    && String(iconPath || "").startsWith("icons/")
    && siteIconSourceLooksLikeSvgForTest(iconPath);
}

function brandIconTileColorsForTest(tileColor, siteKey = "", iconPath = "") {
  const color = normalizeHexColor(tileColor);
  if (usesGradientIconCarrierForTest(iconPath)) {
    return gradientSvgIconTileColorsForTest(color, iconPath);
  }
  if (!color) {
    return { light: "#ffffff", dark: "#202922" };
  }
  if (keepsBrandIconOriginalOnBrandTileForTest(siteKey, iconPath)) {
    return { light: color, dark: color };
  }
  if (usesOriginalIconCarrierForTest(iconPath)) {
    const paletteTileColors = originalSvgIconTileColorsForTest(color, iconPath);
    if (paletteTileColors) {
      return paletteTileColors;
    }
  }
  return {
    light: brandIconLightCarrierColorForTest(color),
    dark: brandIconDarkCarrierColorForTest(color)
  };
}

function gradientSvgIconTileColorsForTest(brandColor, iconPath = "") {
  const palette = originalSvgVisiblePaletteForTest(brandColor, iconPath);
  if (palette.length > 1) {
    const carrier = gradientPaletteCarrierColorForTest(palette);
    return {
      light: carrier,
      dark: carrier
    };
  }
  const color = normalizeHexColor(brandColor);
  if (!color) {
    return { light: "#ffffff", dark: "#202922" };
  }
  return {
    light: brandIconLightCarrierColorForTest(color),
    dark: brandIconDarkCarrierColorForTest(color)
  };
}

function gradientPaletteCarrierColorForTest(palette) {
  return gradientPaletteNeedsDarkAppIconCarrierForTest(palette)
    ? BRAND_ICON_MULTICOLOR_DARK_CARRIER
    : BRAND_ICON_MULTICOLOR_PAPER_CARRIER;
}

function gradientPaletteNeedsDarkAppIconCarrierForTest(palette) {
  const colors = uniqueNormalizedHexColorsForTest(palette);
  if (colors.length <= 1) {
    return false;
  }
  const traits = paletteColorTraitsForTest(colors);
  const lowContrastOnPaperRatio = colors.filter((color) => contrastRatio(color, BRAND_ICON_MULTICOLOR_PAPER_CARRIER) < BRAND_ICON_VI_CONTRAST_MIN).length / colors.length;
  const hueSpan = paletteHueSpanForTest(colors);
  if (hueSpan >= 120 && (traits.averageLuminance < 0.5 || (traits.saturatedMulticolor && lowContrastOnPaperRatio < 0.8))) {
    return false;
  }
  return !traits.hasDark
    && lowContrastOnPaperRatio >= 0.65
    && traits.averageLuminance >= 0.45;
}

function paletteHueSpanForTest(palette) {
  const hues = uniqueNormalizedHexColorsForTest(palette)
    .map((color) => {
      const stats = hexColorStatsForTest(color);
      const [red, green, blue] = hexToRgb(color).map((channel) => channel / 255);
      const chroma = Math.max(red, green, blue) - Math.min(red, green, blue);
      return chroma >= 0.18 ? stats?.hue || 0 : null;
    })
    .filter((hue) => hue !== null);
  return hues.length ? Math.max(...hues) - Math.min(...hues) : 0;
}

function gradientCarrierRiskForTest(palette) {
  const colors = uniqueNormalizedHexColorsForTest(palette);
  if (colors.length <= 1) {
    return null;
  }
  const traits = paletteColorTraitsForTest(colors);
  const lowContrastOnPaperRatio = colors.filter((color) => contrastRatio(color, BRAND_ICON_MULTICOLOR_PAPER_CARRIER) < BRAND_ICON_VI_CONTRAST_MIN).length / colors.length;
  const hueSpan = paletteHueSpanForTest(colors);
  const paperSafe = hueSpan >= 120 && (traits.averageLuminance < 0.5 || (traits.saturatedMulticolor && lowContrastOnPaperRatio < 0.8));
  const darkScore = (traits.hasDark ? -2 : 0)
    + (lowContrastOnPaperRatio - 0.65) * 4
    + (traits.averageLuminance - 0.45) * 4
    + (paperSafe ? -2 : 0);
  return {
    darkScore,
    lowContrastOnPaperRatio,
    averageLuminance: traits.averageLuminance,
    hueSpan
  };
}

function usesOriginalIconCarrierForTest(iconPath = "") {
  const remoteDescriptor = remoteBrandSvgDescriptorFromSource(iconPath);
  if (remoteDescriptor) {
    return remoteDescriptor.renderMode === "original";
  }
  return localSiteIconRenderModeForTest(iconPath) === "original";
}

function originalSvgIconTileColorsForTest(brandColor, iconPath = "") {
  const palette = originalSvgVisiblePaletteForTest(brandColor, iconPath);
  if (palette.length <= 1) {
    return null;
  }
  const embeddedCarrier = originalSvgEmbeddedCarrierColorForTest(iconPath);
  if (embeddedCarrier) {
    return {
      light: embeddedCarrier,
      dark: embeddedCarrier
    };
  }
  return {
    light: paletteAwareBrandIconCarrierColorForTest(brandColor, palette, "light"),
    dark: paletteAwareBrandIconCarrierColorForTest(brandColor, palette, "dark")
  };
}

function originalSvgEmbeddedCarrierColorForTest(iconPath = "") {
  const remoteDescriptor = remoteBrandSvgDescriptorFromSource(iconPath);
  return remoteDescriptor?.embeddedCarrierColor || localSiteIconEmbeddedCarrierColorForTest(iconPath);
}

function originalSvgVisiblePaletteForTest(brandColor, iconPath = "") {
  const remoteDescriptor = remoteBrandSvgDescriptorFromSource(iconPath);
  const visibleColors = remoteDescriptor?.visibleColors || localSiteIconVisibleColorsForTest(iconPath);
  const palette = uniqueNormalizedHexColorsForTest(visibleColors);
  if (palette.length > 1) {
    return palette;
  }
  const brand = normalizeHexColor(brandColor);
  return uniqueNormalizedHexColorsForTest([...palette, ...(brand && !remoteBrandColorLooksNeutral(brand) ? [brand] : [])]);
}

function paletteAwareBrandIconCarrierColorForTest(brandColor, palette, mode) {
  const colors = uniqueNormalizedHexColorsForTest(palette);
  const anchor = paletteCarrierAnchorColorForTest(brandColor, colors);
  if (!anchor || colors.length <= 1) {
    return mode === "dark" ? brandIconDarkCarrierColorForTest(anchor) : brandIconLightCarrierColorForTest(anchor);
  }
  return paletteNeedsDarkAppIconCarrierForTest(palette)
    ? BRAND_ICON_MULTICOLOR_DARK_CARRIER
    : BRAND_ICON_MULTICOLOR_PAPER_CARRIER;
}

function paletteColorTraitsForTest(palette) {
  const colors = uniqueNormalizedHexColorsForTest(palette);
  const samples = colors.map((color) => {
    const stats = hexColorStatsForTest(color);
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

function paletteNeedsDarkAppIconCarrierForTest(palette) {
  const traits = paletteColorTraitsForTest(palette);
  return traits.lightDominant
    && !traits.hasDark
    && traits.averageLuminance >= 0.58
    && traits.coloredRatio <= 0.5;
}

function paletteCarrierAnchorColorForTest(brandColor, palette) {
  const brand = normalizeHexColor(brandColor);
  if (brand && !remoteBrandColorLooksNeutral(brand)) {
    return brand;
  }
  return uniqueNormalizedHexColorsForTest(palette).find((color) => !remoteBrandColorLooksNeutral(color)) || brand || "";
}

function brandIconLightCarrierColorForTest(brandColor) {
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

function brandIconDarkCarrierColorForTest(brandColor) {
  const brand = normalizeHexColor(brandColor);
  if (!brand) {
    return "";
  }
  return BRAND_ICON_DARK_MODE_CARRIER;
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
  applyIconTileEdgeForTest(icon, tileColors);
  icon.classList.toggle("site-icon-local", Boolean(hasLocalIcon));
}

function applyIconTileEdgeForTest(icon, tileColors) {
  icon.style.setProperty("--site-icon-edge-light", "var(--custom-site-icon-shadow)");
  icon.style.setProperty(
    "--site-icon-edge-dark",
    blackishCarrierColor(tileColors.dark) ? "none" : "var(--custom-site-icon-shadow)"
  );
}

function applySiteIconTileForTest(icon, site, iconPath = "") {
  const siteKey = siteKeyForUrlForTest(site.url);
  icon.dataset.siteKey = siteKey || "";
  const tileColor = siteIconBrandColorForTest(siteKey, iconPath);
  const remoteDescriptor = remoteBrandSvgDescriptorFromSource(iconPath);
  const originalSvgColor = remoteDescriptor?.renderMode === "original" ? "#ffffff" : "";
  const gradientSvgColor = usesGradientIconCarrierForTest(iconPath) ? "#ffffff" : "";
  const tileMode = iconPath ? "brand" : "plain";
  const isLocalIconSource = String(iconPath || "").startsWith("icons/");
  let tileColors = { light: "#ffffff", dark: "#202922" };
  if (iconPath && (tileColor || originalSvgColor || gradientSvgColor)) {
    tileColors = brandIconTileColorsForTest(tileColor || originalSvgColor || gradientSvgColor, siteKey, iconPath);
  }
  applyIconTileForTest(icon, tileMode, tileColors, isLocalIconSource);
}

function shouldInvertBrandSvgForTest(icon, source) {
  const siteKey = icon.dataset.siteKey || siteKeyForUrlForTest(icon.dataset.siteUrl);
  if (keepsBrandIconOriginalForTest(siteKey, source)) {
    return false;
  }
  if (String(source || "").startsWith("icons/") && !localSiteIconRenderModeForTest(source)) {
    return false;
  }
  return Boolean(siteIconBrandColorForTest(siteKey, source));
}

function iconGlyphColorForCurrentTileForTest(icon, source = "") {
  const tileColor = normalizeHexColor(currentIconTileColorForTest(icon));
  if (!tileColor) {
    return "";
  }
  const siteKey = icon.dataset.siteKey || siteKeyForUrlForTest(icon.dataset.siteUrl);
  const brandColor = siteIconBrandColorForTest(siteKey, source);
  if (/^data:image\/svg\+xml[,;]/i.test(source)) {
    return localBrandGlyphColorForTile(tileColor, brandColor);
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

function renderedSvgGlyphForTest(icon) {
  const svg = decodeSvgDataUrl(icon.src);
  return normalizeHexColor(svg.match(/\sfill=(["'])(#[0-9a-f]{6})\1/i)?.[2] || "")
    || normalizeHexColor(svg.match(/fill:\s*(#[0-9a-f]{6})/i)?.[1] || "");
}

function assertIconRenderStrategy(icon, expected, message) {
  const lightTile = icon.style.getPropertyValue("--site-icon-tile-light");
  const darkTile = icon.style.getPropertyValue("--site-icon-tile-dark");
  assert.equal(lightTile, expected.lightTile, `${message} light carrier`);
  assert.equal(darkTile, expected.darkTile, `${message} dark carrier`);
  assert.equal(renderedSvgGlyphForTest(icon), expected.lightGlyph, `${message} light glyph`);
  assertReadableIconPair(lightTile, expected.lightGlyph, `${message} day contrast`);
  testTheme = "dark";
  refreshAdaptiveSiteIconsForTest([icon]);
  assert.equal(currentIconTileColorForTest(icon), expected.darkTile, `${message} active dark carrier`);
  assert.equal(renderedSvgGlyphForTest(icon), expected.darkGlyph, `${message} dark glyph`);
  assertReadableIconPair(darkTile, expected.darkGlyph, `${message} night contrast`);
  testTheme = "light";
}

function applySiteIconForTest(icon, site) {
  const localIcon = localIconForUrlForTest(site.url);
  const siteIcon = String(site.icon || "");
  const iconSource = localIcon || siteIcon;
  const siteIconIsRemoteBrand = Boolean(remoteBrandSvgDescriptorFromSource(siteIcon));
  const tileIconSource = localIcon || (siteIconIsRemoteBrand ? siteIcon : "");
  const siteKey = siteKeyForUrlForTest(site.url);
  const shouldRefreshRemoteBrand = localIcon
    ? localIconNeedsRemoteBrandColorForTest(siteKey, localIcon)
    : siteIcon && !siteIconIsRemoteBrand;
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
    if (icon.dataset.iconTile !== "brand") {
      continue;
    }
    const source = icon.dataset.iconSource || "";
    if (!source) {
      applySiteIconForTest(icon, {
        title: icon.dataset.siteTitle || "",
        url: icon.dataset.siteUrl || ""
      });
      continue;
    }
    icon.src = source;
    const nextSource = displayIconSourceForTest(icon, source);
    if (icon.dataset.iconSource === source) {
      icon.src = nextSource;
    }
  }
}

function discoverRemoteBrandIconDataUrlForTest(siteUrl, provider) {
  const localIcon = localIconForUrlForTest(siteUrl);
  const siteKey = siteKeyForUrlForTest(siteUrl);
  if (localIcon && !localIconNeedsRemoteBrandColorForTest(siteKey, localIcon)) {
    return "";
  }
  return provider(siteKey);
}

function applyRemoteBrandColorToLocalIconForTest(icon, site, localIcon, iconDataUrl) {
  const descriptor = remoteBrandSvgDescriptorFromSource(iconDataUrl);
  if (!descriptor?.brandColor) {
    return false;
  }
  localSiteIconBrandColorCacheForTest.set(localIcon, descriptor.brandColor);
  localSiteIconRenderModeCacheForTest.set(localIcon, localSiteIconRenderModeForTest(localIcon) || "mask");
  applySiteIconTileForTest(icon, site, localIcon);
  icon.src = displayIconSourceForTest(icon, localIcon);
  return true;
}

function refreshRenderedSiteIconDecisionForTest(icon, site) {
  const localIcon = localIconForUrlForTest(site.url);
  if (icon.dataset.iconCacheHydrated === "true") {
    if (!localIcon) {
      if (remoteBrandSvgDescriptorFromSource(icon.dataset.iconSource || icon.src || "")) {
        return "keep-remote-brand-cache";
      }
      return "refresh-remote-brand";
    }
    icon.dataset.iconSource = localIcon;
    icon.dataset.iconCandidate = localIcon;
    applySiteIconTileForTest(icon, site, localIcon);
    icon.src = displayIconSourceForTest(icon, localIcon);
    return "sync-local-cache-render";
  }
  return localIcon ? "rerender-local" : "rerender-site";
}

function firstPaintRenderStaleForLocalIconForTest(siteKey, localIcon, render) {
  if (!localIcon) {
    return false;
  }
  if (render.src !== localIcon && render.source !== localIcon) {
    return true;
  }
  return render.source === localIcon
    && render.src !== localIcon
    && keepsBrandIconOriginalForTest(siteKey, localIcon);
}

function firstPaintIconRenderWithCurrentTileForTest(site, render) {
  const source = render.source || render.src || "";
  const remoteDescriptor = remoteBrandSvgDescriptorFromSource(source);
  if (!siteIconSourceLooksLikeSvgForTest(source) && !remoteDescriptor) {
    return render;
  }
  if (!remoteDescriptor && !localSiteIconRenderModeCacheForTest.has(source)) {
    return render;
  }
  const tileSource = remoteDescriptor ? source : localIconForUrlForTest(site.url) || source;
  const siteKey = siteKeyForUrlForTest(site.url);
  const tileColor = siteIconBrandColorForTest(siteKey, tileSource);
  const originalSvgColor = usesOriginalIconCarrierForTest(tileSource) ? "#ffffff" : "";
  const gradientSvgColor = usesGradientIconCarrierForTest(tileSource) ? "#ffffff" : "";
  if (!tileColor && !originalSvgColor && !gradientSvgColor) {
    return render;
  }
  const tileColors = brandIconTileColorsForTest(tileColor || originalSvgColor || gradientSvgColor, siteKey, tileSource);
  return {
    ...render,
    tile: tileSource ? "brand" : render.tile,
    tileLight: tileColors.light,
    tileDark: tileColors.dark,
    local: String(tileSource || "").startsWith("icons/") || render.local
  };
}

function firstPaintRenderStaleForAdaptiveFaviconForTest(localIcon, render) {
  return !localIcon
    && render.tile === "plain"
    && !render.local
    && !render.generic
    && render.adaptiveCarrierVersion !== FAVICON_ADAPTIVE_CARRIER_VERSION;
}

function adaptiveFaviconCarrierCacheVersionForTest(icon) {
  return icon.dataset.iconTile === "plain"
    && !icon.classList.contains("site-icon-local")
    && !icon.classList.contains("site-icon-generic-fallback")
    ? FAVICON_ADAPTIVE_CARRIER_VERSION
    : 0;
}

function cachedFirstPaintIconRenderEntryForTest(icon, mode = "light") {
  const tileLight = icon.style.getPropertyValue("--site-icon-tile-light").trim();
  const tileDark = icon.style.getPropertyValue("--site-icon-tile-dark").trim();
  const adaptiveCarrierVersion = adaptiveFaviconCarrierCacheVersionForTest(icon);
  const render = {
    src: icon.getAttribute("src") || "",
    tile: icon.dataset.iconTile || "plain",
    tileLight,
    tileDark,
    local: icon.classList.contains("site-icon-local"),
    generic: icon.classList.contains("site-icon-generic-fallback"),
    adaptiveCarrierVersion,
    updatedAt: 1
  };
  const themedRenders = adaptiveCarrierVersion
    ? { light: render, dark: render }
    : { [mode]: render };
  return {
    source: icon.dataset.iconSource || "",
    ...themedRenders
  };
}

assert.equal(
  firstPaintRenderStaleForAdaptiveFaviconForTest("", { tile: "plain", local: false, generic: false }),
  true,
  "Legacy first-paint favicon renders must be invalidated so the adaptive carrier algorithm can resample."
);
assert.equal(
  firstPaintRenderStaleForAdaptiveFaviconForTest("", { tile: "plain", local: false, generic: false, adaptiveCarrierVersion: FAVICON_ADAPTIVE_CARRIER_VERSION }),
  false,
  "Current adaptive favicon renders can still use the first-paint cache."
);
assert.equal(
  firstPaintRenderStaleForAdaptiveFaviconForTest("icons/sites/example.svg", { tile: "plain", local: true, generic: false }),
  false,
  "Local icon cache renders must stay outside favicon adaptive carrier invalidation."
);
{
  const icon = new TestIcon();
  icon.src = "data:image/png;base64,favicon";
  applyIconTileForTest(icon, "plain", { light: "#ffffff", dark: "#ffffff" }, false);
  const entry = cachedFirstPaintIconRenderEntryForTest(icon, "light");
  assert.deepEqual(entry.light, entry.dark, "Adaptive favicon first-paint cache must be theme-agnostic after one sampled render.");
  assert.equal(entry.light.adaptiveCarrierVersion, FAVICON_ADAPTIVE_CARRIER_VERSION, "Adaptive favicon cache keeps the current carrier algorithm version.");
}

{
  const icon = new TestIcon();
  icon.src = "icons/sites/baidu.svg";
  icon.dataset.iconSource = "icons/sites/baidu.svg";
  applyIconTileForTest(icon, "brand", { light: "#2932e1", dark: "#f8fafc" }, true);
  const entry = cachedFirstPaintIconRenderEntryForTest(icon, "light");
  assert.ok(entry.light, "Local SVG first-paint cache keeps the active theme render.");
  assert.equal(entry.dark, undefined, "Local SVG first-paint cache must not be collapsed into a fixed favicon carrier.");
}

assert.equal(localBrandGlyphColor("#00a1d6"), "#ffffff", "Local bilibili preserves its blue-carrier white-glyph VI pairing.");
assert.equal(localBrandGlyphColor("#ffffff"), "#ffffff", "Mask glyphs stay white; low-contrast VI colors are fixed by adjusting the carrier.");
assert.equal(localBrandGlyphColorForTile("#2932e1", "#2932e1"), "#ffffff", "Local Baidu brand tiles keep a white glyph on blue.");
assert.equal(localBrandGlyphColorForTile("#f8fafc", "#2932e1"), "#2932e1", "Local Baidu SVGs recover the blue VI glyph on light carrier tiles.");
assert.equal(localBrandGlyphColorForTile(brandIconLightCarrierColorForTest("#d97757"), "#d97757"), "#ffffff", "Local Claude SVGs keep a readable glyph on their brand light carrier.");
assert.equal(localBrandGlyphColorForTile("#f8fafc", "#00a1d6"), "#00a1d6", "Local Bilibili SVGs recover the blue VI glyph on dark-mode light carrier tiles.");
assert.equal(localBrandGlyphColorForTile("#f8fafc", "#1ed760"), "#1bab4f", "Low-contrast local green glyphs retain their hue while meeting the light-carrier contrast threshold.");
assert.equal(localBrandGlyphColorForTile("#f8fafc", "#ffcc00"), "#b39508", "Low-contrast local yellow glyphs retain their hue while meeting the light-carrier contrast threshold.");

assert.equal(localBrandGlyphColorForTile(brandIconLightCarrierColorForTest("#1ed760"), "#1ed760"), "#ffffff", "Spotify-like mask SVGs use white glyphs on readable VI carriers.");
assert.equal(localBrandGlyphColorForTile(brandIconLightCarrierColorForTest("#ffcc00"), "#ffcc00"), "#ffffff", "Yellow mask SVGs darken the VI carrier and keep a white glyph.");
assert.equal(localBrandGlyphColorForTile("#f8fafc", "#362d59"), "#362d59", "Remote cached dark glyphs recover the brand color on night light tiles when local SVGs would.");

{
  const blackCarrierIcon = new TestIcon();
  applyIconTileForTest(blackCarrierIcon, "brand", { light: "#000000", dark: "#000000" }, true);
  assert.equal(blackCarrierIcon.style.getPropertyValue("--site-icon-edge-light"), "var(--custom-site-icon-shadow)", "Blackish carriers keep a defining edge in light mode.");
  assert.equal(blackCarrierIcon.style.getPropertyValue("--site-icon-edge-dark"), "none", "Blackish carriers hide the redundant edge in dark mode.");
}

{
  const darkBrandIcon = new TestIcon();
  applyIconTileForTest(darkBrandIcon, "brand", { light: "#001a66", dark: "#001a66" }, true);
  assert.equal(darkBrandIcon.style.getPropertyValue("--site-icon-edge-light"), "var(--custom-site-icon-shadow)", "Dark saturated brand carriers keep the light-mode edge.");
  assert.equal(darkBrandIcon.style.getPropertyValue("--site-icon-edge-dark"), "var(--custom-site-icon-shadow)", "Dark saturated brand carriers are not treated as blackish grayscale.");
}

{
  const paperCarrierIcon = new TestIcon();
  applyIconTileForTest(paperCarrierIcon, "brand", { light: "#ffffff", dark: "#ffffff" }, true);
  assert.equal(paperCarrierIcon.style.getPropertyValue("--site-icon-edge-light"), "var(--custom-site-icon-shadow)", "Paper carriers keep the light-mode edge.");
  assert.equal(paperCarrierIcon.style.getPropertyValue("--site-icon-edge-dark"), "var(--custom-site-icon-shadow)", "Paper carriers keep the dark-mode edge.");
}

{
  const icon = new TestIcon();
  icon.dataset.iconTile = "brand";
  icon.dataset.siteUrl = "https://spotify.com/";
  icon.src = "data:image/svg+xml,stale-light-render";
  testTheme = "dark";
  refreshAdaptiveSiteIconsForTest([icon]);
  assert.equal(icon.dataset.iconSource, "icons/sites/spotify.svg", "A cached recent icon without source metadata should recover its local source during theme refresh.");
  assert.equal(renderedSvgGlyphForTest(icon), "#1bab4f", "Recovered recent icons should render the current dark-theme glyph instead of the cached light glyph.");
  testTheme = "light";
}

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
  assert.equal(icon.style.getPropertyValue("--site-icon-tile-light"), "#2932e1", "Local SVGs use the known VI color as the light-mode carrier.");
  assert.equal(icon.style.getPropertyValue("--site-icon-tile-dark"), "#f8fafc", "Local SVGs keep the local night carrier tile.");
  assert.match(decodeSvgDataUrl(icon.src), /fill="#ffffff"/, "Local SVG day glyphs render white on the brand carrier.");
  assertReadableIconPair("#2932e1", "#ffffff", "Local SVG day carrier and glyph must be readable");
  assert.doesNotMatch(decodeSvgDataUrl(icon.src), /data-wayleaf-remote-brand/, "Local SVG display data must not inherit remote descriptor metadata.");
  assert.equal(discoverRemoteBrandIconDataUrlForTest("https://www.baidu.com/search", (siteKey) => {
    providerCalls.push(siteKey);
    return remoteCachedIcon;
  }), remoteCachedIcon, "Remote provider discovery may supplement VI color when a local SVG lacks explicit color.");
  assert.deepEqual(providerCalls, ["baidu.com"], "Local SVG color supplementation stays scoped to its site key.");

  testTheme = "dark";
  refreshAdaptiveSiteIconsForTest([icon]);
  assert.equal(currentIconTileColorForTest(icon), "#f8fafc", "Dark refresh reads the local SVG night tile.");
  assert.match(decodeSvgDataUrl(icon.src), /fill="#2932e1"/, "Dark refresh restores the local known VI glyph instead of remote glyph rules.");
  assertReadableIconPair("#f8fafc", "#2932e1", "Local SVG night carrier and VI glyph must be readable");
  assert.doesNotMatch(decodeSvgDataUrl(icon.src), /fill="#102019"/, "Local SVG dark refresh must not fall through to the cloud dark glyph.");

  testTheme = "light";
  refreshAdaptiveSiteIconsForTest([icon]);
  assert.equal(currentIconTileColorForTest(icon), "#2932e1", "Light refresh restores the local SVG VI day carrier.");
  assert.match(decodeSvgDataUrl(icon.src), /fill="#ffffff"/, "Light refresh restores the local white glyph on the brand carrier.");
}

{
  const remoteCachedIcon = svgTextDataUrl(prepareRemoteBrandSvgForTest(adaptiveFixtureSvg, { brandColor: "#1db954", qualityScore: 92 }));
  const icon = new TestIcon();
  testTheme = "light";
  applySiteIconForTest(icon, { url: "https://www.google.com/search", icon: remoteCachedIcon });
  assert.equal(icon.dataset.iconSource, "icons/sites/google.svg", "Local multicolor SVGs outrank cached remote SVG data URLs.");
  assert.equal(icon.classList.contains("site-icon-local"), true, "Local multicolor SVGs keep the local marker.");
  assert.deepEqual(
    {
      light: icon.style.getPropertyValue("--site-icon-tile-light"),
      dark: icon.style.getPropertyValue("--site-icon-tile-dark")
    },
    brandIconTileColorsForTest("#4285f4", "google.com", "icons/sites/google.svg"),
    "Local multicolor SVGs use palette-aware day and night carriers."
  );
  assertPaletteCarrierSeparatedForTest("icons/sites/google.svg", "#4285f4", icon.style.getPropertyValue("--site-icon-tile-light"), "light", "Local multicolor day carrier");
  assertPaletteCarrierSeparatedForTest("icons/sites/google.svg", "#4285f4", icon.style.getPropertyValue("--site-icon-tile-dark"), "dark", "Local multicolor night carrier");
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
  assert.notEqual(icon.src, remoteSvg, "Remote JD SVG descriptors still use mask recoloring instead of the local original-artwork branch.");
  assert.match(decodeSvgDataUrl(icon.src), /fill="#ffffff"/, "Remote JD SVG descriptors use a readable white glyph on the VI carrier.");
  assertReadableIconPair(currentIconTileColorForTest(icon), "#ffffff", "Remote JD carrier and glyph must be readable");
}

[
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/",
    source: "icons/sites/linkedin.svg",
    tile: "#0a66c2",
    carriers: { light: "#0a66c2", dark: "#f8fafc" },
    glyphs: { light: "#ffffff", dark: "#0a66c2" }
  },
  {
    name: "Grok",
    url: "https://grok.com/",
    source: "icons/sites/grok.svg",
    tile: "#000000",
    carriers: { light: "#000000", dark: "#f8fafc" },
    glyphs: { light: "#ffffff", dark: "#000000" }
  }
].forEach((sample) => {
  const remoteCachedIcon = svgTextDataUrl(prepareRemoteBrandSvgForTest(adaptiveFixtureSvg, { brandColor: "#1db954", qualityScore: 92 }));
  const icon = new TestIcon();
  testTheme = "light";
  applySiteIconForTest(icon, { url: sample.url, icon: remoteCachedIcon });
  assert.equal(icon.dataset.iconSource, sample.source, `${sample.name} uses the deployed local SVG instead of cached remote SVGs.`);
  assert.equal(icon.classList.contains("site-icon-local"), true, `${sample.name} keeps the local icon marker.`);
  assert.equal(icon.style.getPropertyValue("--site-icon-tile-light"), sample.carriers.light, `${sample.name} local SVGs use the shared local SVG day carrier strategy.`);
  assert.equal(icon.style.getPropertyValue("--site-icon-tile-dark"), sample.carriers.dark, `${sample.name} local SVGs use the shared local SVG night carrier strategy.`);
  assert.match(decodeSvgDataUrl(icon.src), new RegExp(`fill="${sample.glyphs.light}"|fill:\\s*${sample.glyphs.light}`, "i"), `${sample.name} local SVGs use shared mask recoloring in day mode.`);
  assertReadableIconPair(sample.carriers.light, sample.glyphs.light, `${sample.name} day carrier and glyph must be readable`);
  assert.notEqual(icon.src, sample.source, `${sample.name} local SVGs do not use the original-artwork branch.`);

  testTheme = "dark";
  refreshAdaptiveSiteIconsForTest([icon]);
  assert.equal(currentIconTileColorForTest(icon), sample.carriers.dark, `${sample.name} dark refresh reads the shared local SVG night carrier.`);
  assert.match(decodeSvgDataUrl(icon.src), new RegExp(`fill="${sample.glyphs.dark}"|fill:\\s*${sample.glyphs.dark}`, "i"), `${sample.name} dark refresh restores the expected glyph through shared local recoloring.`);
  assertReadableIconPair(sample.carriers.dark, sample.glyphs.dark, `${sample.name} night carrier and glyph must be readable`);
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
  const icon = new TestIcon();
  testTheme = "light";
  applySiteIconForTest(icon, { url: "https://news.qq.com/", icon: "" });
  assert.equal(icon.dataset.iconSource, "icons/sites/qq.svg", "QQ pages use the deployed local SVG.");
  assert.equal(icon.src, "icons/sites/qq.svg", "QQ local SVG renders original artwork instead of mask recoloring.");
}

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
  assert.equal(icon.style.getPropertyValue("--site-icon-tile-light"), "#1cb352", "Remote mask SVG data URLs use a readable VI carrier in light mode.");
  assert.equal(icon.style.getPropertyValue("--site-icon-tile-dark"), "#f8fafc", "Remote mask SVG data URLs use the shared light carrier in dark mode.");
  assert.equal(iconSourceCanUseBitmapTileFusionForTest(icon.dataset.iconCandidate), false, "Remote cloud SVG descriptors stay on the shared SVG tile path.");
  assert.equal(iconSourceCanUseBitmapTileFusionForTest("data:image/png;base64,fixture"), true, "Remote cached bitmap data URLs use the shared bitmap tile sampler.");
  assert.match(decodeSvgDataUrl(icon.src), /fill="#ffffff"/, "Remote SVG data URLs keep a white day glyph on the VI carrier.");
  assertReadableIconPair("#1cb352", "#ffffff", "Remote SVG day carrier and glyph must be readable");
  testTheme = "dark";
  refreshAdaptiveSiteIconsForTest([icon]);
  assert.match(decodeSvgDataUrl(icon.src), /fill="#1cad4f"/, "Remote mask SVG data URLs retain a contrast-adjusted brand glyph on the dark-mode light carrier.");
  assertReadableIconPair("#f8fafc", "#1cad4f", "Remote SVG night carrier and glyph must be readable");
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
const edgeReachingGlyph = (x, y) => (
  (x >= 5 && x <= 26 && y >= 2 && y <= 7)
  || (x >= 5 && x <= 26 && y >= 13 && y <= 18)
  || (x >= 5 && x <= 26 && y >= 24 && y <= 29)
  || (x >= 3 && x <= 8 && y >= 6 && y <= 15)
  || (x >= 23 && x <= 28 && y >= 16 && y <= 25)
);
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
const adaptiveFaviconOptions = { adaptiveFaviconCarrier: true };
const faviconTileDecision = (sample) => {
  const color = dominantFaviconSampleBackgroundColor(sample, adaptiveFaviconOptions);
  return {
    color,
    tileColors: color ? faviconMatchedTileColors(color, adaptiveFaviconOptions) : null
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
  const straightPaperTileSample = rgbaSample(faviconFixtureSize, (x, y, size) => {
    const inTile = centeredBox(x, y, size, 4);
    const inMark = (x >= 11 && x <= 20 && y >= 10 && y <= 13)
      || (x >= 13 && x <= 18 && y >= 16 && y <= 21);
    return inTile ? hexChannels(inMark ? "#4b5563" : "#ffffff") : [0, 0, 0, 0];
  });
  const { color, tileColors } = faviconTileDecision(straightPaperTileSample);
  const fused = fusedEmbeddedFaviconPixelData(straightPaperTileSample, tileColors.light, rgbChannelsToHex(color.red, color.green, color.blue));
  assert.equal(color.matchMode, "embedded-tile", "Straight-corner paper favicon tiles should be recognized as site-owned tiles.");
  assert.equal(color.ownTileCornerStyle, "straight", "Four equal filled corners should classify the favicon tile as straight-corner artwork.");
  assert.equal(faviconCandidateLooksLikePaperTileArtwork(color, rgbChannelsToHex(color.red, color.green, color.blue)), true, "Straight white paper favicon tiles should receive a white carrier.");
  assert.deepEqual(tileColors, { light: "#ffffff", dark: "#ffffff" }, "Straight paper favicon tiles should visually merge with Wayleaf's white carrier.");
  assert.equal(faviconShouldFuseEmbeddedTile(color, tileColors.light, adaptiveFaviconOptions), true, "Straight paper favicon carrier pixels should be fused into the outer carrier.");
  assert.equal(samplePixelAlpha(fused, 5, 5), 0, "Straight paper tile pixels are removed during fusion.");
  assert.ok(samplePixelAlpha(fused, 15, 18) > 230, "Straight paper tile foreground remains visible after fusion.");
}

{
  const roundedPaperTileSample = rgbaSample(faviconFixtureSize, (x, y, size) => {
    const inset = 4;
    const left = inset;
    const top = inset;
    const right = size - inset - 1;
    const bottom = size - inset - 1;
    const radius = 5;
    const inBounds = x >= left && x <= right && y >= top && y <= bottom;
    const inCornerCutout = (x < left + radius && y < top + radius && (x - (left + radius)) ** 2 + (y - (top + radius)) ** 2 > radius ** 2)
      || (x > right - radius && y < top + radius && (x - (right - radius)) ** 2 + (y - (top + radius)) ** 2 > radius ** 2)
      || (x > right - radius && y > bottom - radius && (x - (right - radius)) ** 2 + (y - (bottom - radius)) ** 2 > radius ** 2)
      || (x < left + radius && y > bottom - radius && (x - (left + radius)) ** 2 + (y - (bottom - radius)) ** 2 > radius ** 2);
    const inTile = inBounds && !inCornerCutout;
    const inMark = Math.abs(x - 16) + Math.abs(y - 16) <= 6;
    return inTile ? hexChannels(inMark ? "#ec4899" : "#ffffff") : [0, 0, 0, 0];
  });
  const { color, tileColors } = faviconTileDecision(roundedPaperTileSample);
  const fused = fusedEmbeddedFaviconPixelData(roundedPaperTileSample, tileColors.light, rgbChannelsToHex(color.red, color.green, color.blue));
  assert.equal(color.matchMode, "embedded-tile", "Rounded paper favicon tiles should be recognized as site-owned tiles.");
  assert.ok(color.ownTileCornerStyle, "Four equal missing corners should classify the favicon as its own tile shape.");
  assert.equal(faviconCandidateLooksLikePaperTileArtwork(color, rgbChannelsToHex(color.red, color.green, color.blue)), true, "Rounded white paper favicon tiles should receive a white carrier.");
  assert.deepEqual(tileColors, { light: "#ffffff", dark: "#ffffff" }, "Rounded paper favicon tiles should visually merge with Wayleaf's white carrier.");
  assert.equal(faviconShouldFuseEmbeddedTile(color, tileColors.light, adaptiveFaviconOptions), true, "Rounded paper favicon carrier pixels should be fused into the outer carrier.");
  assert.equal(samplePixelAlpha(fused, 16, 5), 0, "Rounded paper tile pixels are removed during fusion.");
  assert.ok(samplePixelAlpha(fused, 16, 16) > 230, "Rounded paper tile foreground remains visible after fusion.");
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
  const hupuLikeNestedTileSample = rgbaSample(faviconFixtureSize, (x, y, size) => {
    const outerPaper = centeredBox(x, y, size, 3);
    const innerTile = centeredBox(x, y, size, 8);
    const glyph = innerTile && (x >= 12 && x <= 20) && (y >= 10 && y <= 22) && ((x + y) % 3 !== 0);
    if (glyph) {
      return hexChannels("#ffffff");
    }
    if (innerTile) {
      return hexChannels("#d60000");
    }
    return outerPaper ? hexChannels("#ffffff") : [0, 0, 0, 0];
  });
  const { color, tileColors } = faviconTileDecision(hupuLikeNestedTileSample);
  const sampledTile = rgbChannelsToHex(color.red, color.green, color.blue);
  assert.ok(tileColors, "Nested colored favicon tiles should produce carrier colors.");
  const fused = fusedEmbeddedFaviconPixelData(hupuLikeNestedTileSample, tileColors.light, sampledTile);
  assert.equal(sampledTile, "#d60000", "Nested favicon tiles should prefer the self-contained colored app tile over the outer paper shell.");
  assert.deepEqual(tileColors, { light: "#d60000", dark: "#d60000" }, "Nested colored favicon tiles should make the Wayleaf carrier match the favicon tile color.");
  assert.equal(faviconShouldFuseEmbeddedTile(color, tileColors.light, adaptiveFaviconOptions), true, "Nested colored favicon tile pixels should be fused into the matching carrier.");
  assert.equal(samplePixelAlpha(fused, 9, 9), 0, "Nested colored tile background is removed during fusion.");
  assert.ok(samplePixelAlpha(fused, 16, 16) > 230, "Nested colored tile foreground remains visible after fusion.");
}

{
  const darkNestedTileSample = rgbaSample(faviconFixtureSize, (x, y, size) => {
    const outerPaper = centeredBox(x, y, size, 3);
    const innerTile = centeredBox(x, y, size, 7);
    const glyph = innerTile && x >= 11 && x <= 20 && y >= 11 && y <= 20 && Math.abs(x - y) <= 4;
    if (glyph) {
      return hexChannels("#80d8ff");
    }
    if (innerTile) {
      return hexChannels("#27313d");
    }
    return outerPaper ? hexChannels("#f8fafc") : [0, 0, 0, 0];
  });
  const { color, tileColors } = faviconTileDecision(darkNestedTileSample);
  const sampledTile = rgbChannelsToHex(color.red, color.green, color.blue);
  assert.equal(sampledTile, "#27313d", "Dark nested favicon tiles should expose their own background instead of the paper shell.");
  assert.deepEqual(tileColors, { light: "#27313d", dark: "#27313d" }, "Dark nested favicon tiles should not receive an unrelated white/gray carrier.");
  assert.equal(faviconShouldFuseEmbeddedTile(color, tileColors.light, adaptiveFaviconOptions), true, "Dark nested favicon tile pixels should fuse into their matching carrier.");
}

{
  const fullSquareGreenTileSample = rgbaSample(faviconFixtureSize, (x, y) => {
    const glyph = x >= 10 && x <= 22 && y >= 7 && y <= 24 && Math.abs((x - 16) - (y - 16)) <= 4;
    return hexChannels(glyph ? "#050806" : "#00dc68");
  });
  const { color, tileColors } = faviconTileDecision(fullSquareGreenTileSample);
  const sampledTile = rgbChannelsToHex(color.red, color.green, color.blue);
  assert.equal(color.matchMode, "embedded-tile", "Full-square favicon tiles with readable foreground should be treated as self-contained app tiles.");
  assert.equal(color.ownTileCornerStyle, "straight", "Four equal full corners should classify as a straight self-owned favicon tile.");
  assert.equal(sampledTile, "#00dc68", "Full-square green favicon tiles should expose their own tile color.");
  assert.deepEqual(tileColors, { light: "#00dc68", dark: "#00dc68" }, "Full-square green favicon tiles should make the Wayleaf carrier match the favicon background.");
  assert.equal(faviconShouldFuseEmbeddedTile(color, tileColors.light, adaptiveFaviconOptions), true, "Full-square green tile backgrounds should fuse into the matching carrier.");
}

{
  const fullSquareBlueTileSample = rgbaSample(faviconFixtureSize, (x, y) => {
    const glyph = (x >= 9 && x <= 21 && y >= 8 && y <= 11)
      || (x >= 9 && x <= 18 && y >= 15 && y <= 18)
      || (x >= 9 && x <= 22 && y >= 22 && y <= 25)
      || (x >= 9 && x <= 12 && y >= 8 && y <= 25);
    return hexChannels(glyph ? "#ffffff" : "#0074c8");
  });
  const { color, tileColors } = faviconTileDecision(fullSquareBlueTileSample);
  const sampledTile = rgbChannelsToHex(color.red, color.green, color.blue);
  assert.equal(color.matchMode, "embedded-tile", "Full-square blue favicon tiles with white foreground should not be pushed into the paper-carrier branch.");
  assert.equal(sampledTile, "#0074c8", "Full-square blue favicon tiles should preserve the favicon's own background.");
  assert.deepEqual(tileColors, { light: "#0074c8", dark: "#0074c8" }, "Full-square blue favicon tiles should visually merge with a matching Wayleaf carrier.");
}

{
  const fullSquareDarkTileSample = rgbaSample(faviconFixtureSize, (x, y) => {
    const armA = Math.abs((x - 16) - (y - 16)) <= 3 && x >= 7 && x <= 24 && y >= 7 && y <= 24;
    const armB = Math.abs((x - 16) + (y - 16)) <= 3 && x >= 7 && x <= 24 && y >= 7 && y <= 24;
    return hexChannels(armA || armB ? "#74c7ff" : "#30363d");
  });
  const { color, tileColors } = faviconTileDecision(fullSquareDarkTileSample);
  const sampledTile = rgbChannelsToHex(color.red, color.green, color.blue);
  assert.equal(color.matchMode, "embedded-tile", "Full-square dark favicon tiles with readable artwork should be treated as self-contained tiles.");
  assert.equal(sampledTile, "#30363d", "Full-square dark favicon tiles should expose their own background instead of receiving a white shell.");
  assert.deepEqual(tileColors, { light: "#30363d", dark: "#30363d" }, "Full-square dark favicon tiles should make the Wayleaf carrier match the favicon background.");
}

{
  const framedBlueTileSample = rgbaSample(faviconFixtureSize, (x, y, size) => {
    const inTile = centeredBox(x, y, size, 5);
    const glyph = (x >= 9 && x <= 21 && y >= 8 && y <= 11)
      || (x >= 9 && x <= 18 && y >= 15 && y <= 18)
      || (x >= 9 && x <= 22 && y >= 22 && y <= 25)
      || (x >= 9 && x <= 12 && y >= 8 && y <= 25);
    if (!inTile) {
      return hexChannels("#ffffff");
    }
    const tileColor = x + y < size ? "#087bc9" : "#0c73bd";
    return hexChannels(glyph ? "#ffffff" : tileColor);
  });
  const { color, tileColors } = faviconTileDecision(framedBlueTileSample);
  const sampledTile = rgbChannelsToHex(color.red, color.green, color.blue);
  assert.notEqual(sampledTile, "#ffffff", "Blue favicon tiles inside an opaque white frame should select the inner tile, not the frame.");
  assert.deepEqual(tileColors, { light: sampledTile, dark: sampledTile }, "Blue favicon tiles inside a white frame should visually merge with their sampled blue carrier.");
}

{
  const framedDarkTileSample = rgbaSample(faviconFixtureSize, (x, y, size) => {
    const inTile = centeredBox(x, y, size, 5);
    const armA = Math.abs((x - 16) - (y - 16)) <= 3 && x >= 8 && x <= 23 && y >= 8 && y <= 23;
    const armB = Math.abs((x - 16) + (y - 16)) <= 3 && x >= 8 && x <= 23 && y >= 8 && y <= 23;
    if (!inTile) {
      return hexChannels("#ffffff");
    }
    const markColor = x < size / 2 ? "#63b9ec" : "#77c7f4";
    return hexChannels(armA || armB ? markColor : "#30363d");
  });
  const { color, tileColors } = faviconTileDecision(framedDarkTileSample);
  const sampledTile = rgbChannelsToHex(color.red, color.green, color.blue);
  assert.equal(sampledTile, "#30363d", "Dark favicon tiles with blue artwork inside a white frame should select the dark tile background.");
  assert.deepEqual(tileColors, { light: "#30363d", dark: "#30363d" }, "Dark framed favicon tiles should not be mistaken for blue full-surface artwork.");
}

{
  const paleBluePaperTileSample = rgbaSample(faviconFixtureSize, (x, y, size) => {
    const inTile = centeredBox(x, y, size, 5);
    const mark = (x >= 13 && x <= 18 && y >= 8 && y <= 23 && (x + y) % 2 === 0)
      || (x >= 9 && x <= 21 && y >= 17 && y <= 24 && Math.abs(x - 15) <= 5);
    return inTile ? hexChannels(mark ? "#3b9df2" : "#e8f2f7") : [0, 0, 0, 0];
  });
  const { color, tileColors } = faviconTileDecision(paleBluePaperTileSample);
  const sampledTile = rgbChannelsToHex(color.red, color.green, color.blue);
  assert.equal(sampledTile, "#e8f2f7", "Pale self-contained favicon tiles should expose their own soft background instead of the outer shell.");
  assert.deepEqual(tileColors, { light: "#e8f2f7", dark: "#e8f2f7" }, "Pale blue self-contained favicons should visually merge with their own tile color.");
  assert.equal(faviconShouldFuseEmbeddedTile(color, tileColors.light, adaptiveFaviconOptions), true, "Pale self-contained favicon tile backgrounds should fuse into the matching carrier.");
}

{
  const paleLineArtTileSample = rgbaSample(faviconFixtureSize, (x, y, size) => {
    const inTile = centeredBox(x, y, size, 5);
    const lineA = Math.abs((x - 16) - (y - 16)) <= 1 && x >= 9 && x <= 23 && y >= 9 && y <= 23;
    const lineB = Math.abs((x - 16) + (y - 16)) <= 1 && x >= 9 && x <= 23 && y >= 9 && y <= 23;
    return inTile ? hexChannels(lineA || lineB ? "#475569" : "#fbfbfb") : [0, 0, 0, 0];
  });
  const { color, tileColors } = faviconTileDecision(paleLineArtTileSample);
  assert.equal(rgbChannelsToHex(color.red, color.green, color.blue), "#fbfbfb", "White line-art favicon tiles should sample their own paper background.");
  assert.deepEqual(tileColors, { light: "#ffffff", dark: "#ffffff" }, "White line-art favicon tiles should merge into Wayleaf's paper carrier.");
  assert.equal(faviconShouldFuseEmbeddedTile(color, tileColors.light, adaptiveFaviconOptions), true, "White paper tile backgrounds should fuse into the white carrier.");
}

{
  const roundedGreenTileSample = rgbaSample(faviconFixtureSize, (x, y, size) => {
    const inset = 4;
    const radius = 5;
    const left = inset;
    const top = inset;
    const right = size - inset - 1;
    const bottom = size - inset - 1;
    const inBounds = x >= left && x <= right && y >= top && y <= bottom;
    const cornerCut = (x < left + radius && y < top + radius && (x - (left + radius)) ** 2 + (y - (top + radius)) ** 2 > radius ** 2)
      || (x > right - radius && y < top + radius && (x - (right - radius)) ** 2 + (y - (top + radius)) ** 2 > radius ** 2)
      || (x > right - radius && y > bottom - radius && (x - (right - radius)) ** 2 + (y - (bottom - radius)) ** 2 > radius ** 2)
      || (x < left + radius && y > bottom - radius && (x - (left + radius)) ** 2 + (y - (bottom - radius)) ** 2 > radius ** 2);
    const mark = (x >= 10 && x <= 22 && y >= 10 && y <= 22)
      && (Math.abs((x - 16) - (y - 16)) <= 3 || Math.abs((x - 16) + (y - 16)) <= 3);
    return inBounds && !cornerCut ? hexChannels(mark ? "#ffffff" : "#0f9f82") : [0, 0, 0, 0];
  });
  const { color, tileColors } = faviconTileDecision(roundedGreenTileSample);
  assert.equal(color.ownTileCornerStyle, "rounded", "Rounded colored favicon tiles should keep their rounded self-owned tile classification.");
  assert.equal(rgbChannelsToHex(color.red, color.green, color.blue), "#0f9f82", "Rounded green favicon tiles should expose their own carrier.");
  assert.deepEqual(tileColors, { light: "#0f9f82", dark: "#0f9f82" }, "Rounded green favicon tiles should not receive a white outer shell.");
}

{
  const roundedBlueTileSample = rgbaSample(faviconFixtureSize, (x, y, size) => {
    const inset = 3;
    const radius = 6;
    const left = inset;
    const top = inset;
    const right = size - inset - 1;
    const bottom = size - inset - 1;
    const inBounds = x >= left && x <= right && y >= top && y <= bottom;
    const cornerCut = (x < left + radius && y < top + radius && (x - (left + radius)) ** 2 + (y - (top + radius)) ** 2 > radius ** 2)
      || (x > right - radius && y < top + radius && (x - (right - radius)) ** 2 + (y - (top + radius)) ** 2 > radius ** 2)
      || (x > right - radius && y > bottom - radius && (x - (right - radius)) ** 2 + (y - (bottom - radius)) ** 2 > radius ** 2)
      || (x < left + radius && y > bottom - radius && (x - (left + radius)) ** 2 + (y - (bottom - radius)) ** 2 > radius ** 2);
    const mark = x >= 9 && x <= 23 && y >= 9 && y <= 23
      && (Math.abs((x - 16) - (y - 16)) <= 3 || Math.abs((x - 16) + (y - 16)) <= 3);
    const background = x + y < size ? "#1d3975" : "#29468a";
    return inBounds && !cornerCut ? hexChannels(mark ? "#38d9f8" : background) : [0, 0, 0, 0];
  });
  const { color, tileColors } = faviconTileDecision(roundedBlueTileSample);
  const sampledTile = rgbChannelsToHex(color.red, color.green, color.blue);
  const [sampledRed, sampledGreen, sampledBlue] = hexToRgb(sampledTile);
  assert.equal(color.ownTileCornerStyle, "rounded", "Rounded blue-gradient favicon tiles should stay classified as self-owned rounded tiles.");
  assert.ok(sampledBlue >= sampledRed + 40 && sampledBlue >= sampledGreen + 20, "Rounded blue-gradient favicon tiles should expose their sampled dark-blue background.");
  assert.deepEqual(tileColors, { light: sampledTile, dark: sampledTile }, "Rounded blue-gradient favicon tiles must not regress to a white carrier.");
}

{
  const microRoundedBlueTileSample = rgbaSample(faviconFixtureSize, (x, y, size) => {
    const extremeCorner = (x === 0 || x === size - 1) && (y === 0 || y === size - 1);
    if (extremeCorner) {
      return [0, 0, 0, 0];
    }
    const glyph = (x >= 7 && x <= 18 && y >= 6 && y <= 9)
      || (x >= 7 && x <= 16 && y >= 13 && y <= 16)
      || (x >= 7 && x <= 19 && y >= 20 && y <= 23)
      || (x >= 7 && x <= 10 && y >= 6 && y <= 23);
    return hexChannels(glyph ? "#ffffff" : "#036cbd");
  });
  const { color, tileColors } = faviconTileDecision(microRoundedBlueTileSample);
  assert.equal(color.ownTileCornerStyle, "rounded", "Micro-rounded low-resolution favicon tiles should use transparent extreme corners, not the filled 2x2 corner block.");
  assert.equal(rgbChannelsToHex(color.red, color.green, color.blue), "#036cbd", "Micro-rounded blue favicon tiles should expose their blue background.");
  assert.deepEqual(tileColors, { light: "#036cbd", dark: "#036cbd" }, "Micro-rounded blue favicon tiles should merge with a blue carrier instead of a white shell.");
}

{
  const roundedPurpleTileSample = rgbaSample(faviconFixtureSize, (x, y, size) => {
    const inTile = centeredBox(x, y, size, 5);
    const mark = (x >= 10 && x <= 13 && y >= 11 && y <= 21)
      || (x >= 19 && x <= 22 && y >= 11 && y <= 21)
      || (x >= 13 && x <= 19 && y >= 18 && y <= 21);
    return inTile ? hexChannels(mark ? "#ffffff" : "#6255f6") : [0, 0, 0, 0];
  });
  const { color, tileColors } = faviconTileDecision(roundedPurpleTileSample);
  assert.equal(rgbChannelsToHex(color.red, color.green, color.blue), "#6255f6", "Purple self-contained favicon tiles should expose their own background.");
  assert.deepEqual(tileColors, { light: "#6255f6", dark: "#6255f6" }, "Purple self-contained favicon tiles should visually merge with a matching carrier.");
}

{
  const circleFaviconSample = rgbaSample(faviconFixtureSize, (x, y, size) => {
    const center = (size - 1) / 2;
    const radius = size / 2 - 0.5;
    if ((x - center) ** 2 + (y - center) ** 2 > radius ** 2) {
      return [0, 0, 0, 0];
    }
    const glyph = (x >= 14 && x <= 17 && y >= 8 && y <= 20)
      || (x >= 11 && x <= 20 && y >= 12 && y <= 15);
    return hexChannels(glyph ? "#ffffff" : "#2f6bff");
  });
  const { color, tileColors } = faviconTileDecision(circleFaviconSample);
  assert.equal(color.ownTileCornerStyle, "circle", "Full-bleed circular favicons should be classified as their own circular tile shape.");
  assert.equal(color.compactEmblem, false, "A circular favicon tile must not be mistaken for a padded compact emblem.");
  assert.equal(color.preferredSelfContainedTile, true, "Circular favicon tiles should take the self-contained colored tile path.");
  assert.equal(rgbChannelsToHex(color.red, color.green, color.blue), "#2f6bff", "Circular favicon tiles should expose their own disc background color.");
  assert.deepEqual(tileColors, { light: "#2f6bff", dark: "#2f6bff" }, "Circular favicons should fuse into a carrier matching their disc color, not a dark neutral mask.");
  assert.equal(faviconShouldFuseEmbeddedTile(color, tileColors.light, adaptiveFaviconOptions), true, "Circular favicon disc backgrounds should fuse into the matching carrier.");
}

{
  const orangeRingTileSample = rgbaSample(faviconFixtureSize, (x, y, size) => {
    const inTile = centeredBox(x, y, size, 5);
    const distance = Math.hypot(x - 16, y - 16);
    const ring = distance >= 5 && distance <= 8;
    return inTile ? hexChannels(ring ? "#ffffff" : "#ff6a00") : [0, 0, 0, 0];
  });
  const { color, tileColors } = faviconTileDecision(orangeRingTileSample);
  assert.equal(rgbChannelsToHex(color.red, color.green, color.blue), "#ff6a00", "Orange ring favicon tiles should expose their own background.");
  assert.deepEqual(tileColors, { light: "#ff6a00", dark: "#ff6a00" }, "Orange ring favicon tiles should not be placed inside a white carrier shell.");
}

{
  const redSquareTileSample = rgbaSample(faviconFixtureSize, (x, y, size) => {
    const inTile = centeredBox(x, y, size, 5);
    const mark = x >= 10 && x <= 22 && y >= 10 && y <= 23 && ((x + y) % 4 !== 0);
    return inTile ? hexChannels(mark ? "#ffffff" : "#d80000") : [0, 0, 0, 0];
  });
  const { color, tileColors } = faviconTileDecision(redSquareTileSample);
  assert.equal(rgbChannelsToHex(color.red, color.green, color.blue), "#d80000", "Red square favicon tiles should expose their own background.");
  assert.deepEqual(tileColors, { light: "#d80000", dark: "#d80000" }, "Red square favicon tiles should visually merge with a matching carrier.");
}

{
  const lowContrastBlueSample = rgbaSample(faviconFixtureSize, (x, y, size) => {
    return smallGlyph(x, y, size) ? hexChannels("#168bdc") : hexChannels("#0d7de4");
  });
  const { color, tileColors } = faviconTileDecision(lowContrastBlueSample);
  const foregroundColor = faviconForegroundRepresentativeColor(color, "#0d7de4");
  assert.equal(color.matchMode, "full-surface", "Full-surface favicon artwork remains distinguishable from centered embedded app tiles.");
  assert.equal(faviconCandidateHasLowContrastForeground(color), true, "Blue-on-blue favicon artwork should be detected as low-contrast foreground, not accepted as a brand carrier.");
  assert.equal(tileColors.light, "#ffffff", "Low-contrast blue favicons should use a white carrier, not another blue surface.");
  assert.ok(contrastRatio(tileColors.light, foregroundColor) >= FAVICON_READABLE_CARRIER_CONTRAST_MIN, "The neutral carrier must contrast with the extracted favicon foreground color.");
  assert.equal(faviconShouldFuseEmbeddedTile(color, tileColors.light, adaptiveFaviconOptions), false, "Full-surface favicons should keep their original bitmap artwork instead of being pixel-fused.");
}

{
  const wnacgLikeBlueSample = rgbaSample(faviconFixtureSize, (x, y, size) => {
    return smallGlyph(x, y, size) ? hexChannels("#38bdf8") : hexChannels("#0d7de4");
  });
  const { color, tileColors } = faviconTileDecision(wnacgLikeBlueSample);
  assert.equal(faviconCandidateHasLowContrastForeground(color), false, "Readable-carrier selection should not depend only on the narrow low-contrast heuristic.");
  assert.equal(faviconCandidateHasUnreadableForeground(color, rgbChannelsToHex(color.red, color.green, color.blue)), true, "Blue favicon foreground that is still visually weak on blue must reject the sampled blue carrier.");
  assert.equal(tileColors.light, "#ffffff", "Wnacg-like blue favicons should render on a white carrier.");
  assert.equal(faviconShouldFuseEmbeddedTile(color, tileColors.light, adaptiveFaviconOptions), false, "Wnacg-like full-surface favicons keep their original bitmap artwork.");
}

{
  const cyanFullSurfaceSample = rgbaSample(faviconFixtureSize, (x, y, size) => {
    const logo = x >= 8 && x <= 23 && y >= 9 && y <= 22 && (x + y) % 3 !== 0;
    return logo ? hexChannels("#00a7e8") : hexChannels("#0b82e6");
  });
  const { color, tileColors } = faviconTileDecision(cyanFullSurfaceSample);
  assert.equal(color.matchMode, "full-surface", "Saturated full-surface favicon art should stay in the full-surface branch.");
  assert.equal(faviconCandidateHasLowContrastForeground(color), false, "Paper-carrier choice is a design classification, not only a low-contrast rescue.");
  assert.equal(tileColors.light, "#ffffff", "Saturated blue/cyan full-surface favicons should use a paper carrier instead of blue-on-blue masking.");
  assert.equal(tileColors.dark, "#ffffff", "Favicon fallback carriers are fixed and do not follow Wayleaf light/dark mode.");
}

{
  const gradientBlueSample = rgbaSample(faviconFixtureSize, (x, y, size) => {
    const mark = x >= 8 && x <= 23 && y >= 9 && y <= 22;
    const t = (x + y) / (size * 2);
    if (mark && t > 0.34 && t < 0.78) {
      return hexChannels(t < 0.56 ? "#22c7f5" : "#0ea5e9");
    }
    return hexChannels(t < 0.5 ? "#0b8ee8" : "#0969d9");
  });
  const { color, tileColors } = faviconTileDecision(gradientBlueSample);
  const palette = faviconForegroundPaletteColors(color, rgbChannelsToHex(color.red, color.green, color.blue));
  assert.equal(faviconPaletteLooksLikeBlueGradientArtwork([rgbChannelsToHex(color.red, color.green, color.blue), ...palette]), true, "Gradient-blue favicons should be detected as layered artwork instead of one flat blue.");
  assert.equal(tileColors.light, "#ffffff", "Gradient-blue favicon artwork should use a white carrier instead of another blue tile.");
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
  const { color, tileColors } = faviconTileDecision(rgbaSample(faviconFixtureSize, (x, y) => {
    return edgeReachingGlyph(x, y) ? hexChannels("#333333") : [0, 0, 0, 0];
  }));
  assert.ok(color, "Edge-reaching transparent glyphs should remain readable candidates instead of falling back to an unrelated generic tile.");
  const sampledGlyph = rgbChannelsToHex(color.red, color.green, color.blue);
  assert.equal(faviconCandidateLooksLikeTransparentGlyph(color, sampledGlyph), true, "Irregular alpha silhouettes should be recognized as glyphs even when their artwork enters the edge sampling band.");
  assert.notEqual(tileColors.light, sampledGlyph, "Edge-reaching neutral glyphs must not inherit a same-color carrier.");
  assert.ok(contrastRatio(tileColors.light, sampledGlyph) >= FAVICON_READABLE_CARRIER_CONTRAST_MIN, "Edge-reaching neutral glyphs receive a readable carrier.");
}

{
  const cursorBadgeSample = rgbaSample(faviconFixtureSize, (x, y, size) => {
    const backgroundNoise = ((x * 13 + y * 17) % 32) - 16;
    const background = [104 + backgroundNoise, 120 + backgroundNoise, 137 + backgroundNoise, 76];
    const cursorHead = x >= 3 && x <= 16 && y >= 4 && y <= 17 && (x - 3) <= (y - 4) * 0.82;
    const cursorStem = x >= 12 && x <= 23 && y >= 15 && y <= 27 && Math.abs((x - 12) - (y - 15)) <= 3;
    const cursorFoot = x >= 15 && x <= 25 && y >= 22 && y <= 28 && Math.abs((x - 15) - (y - 22)) <= 2;
    const cursor = cursorHead || cursorStem || cursorFoot;
    const stroke = !cursor && (
      (x >= 2 && x <= 17 && y >= 3 && y <= 18 && (x - 2) <= (y - 3) * 0.9)
      || (x >= 11 && x <= 24 && y >= 14 && y <= 28 && Math.abs((x - 11) - (y - 14)) <= 4)
    );
    if (cursor) {
      return hexChannels("#000000");
    }
    if (stroke) {
      return hexChannels("#ffffff");
    }
    return background;
  });
  const { color, tileColors } = faviconTileDecision(cursorBadgeSample);
  assert.equal(color.matchMode, "full-surface", "SSSAiCode-like cursor favicon should be treated as full-surface artwork, not a black embedded app tile.");
  assert.equal(tileColors.light, "#ffffff", "SSSAiCode-like cursor favicon should render on a paper carrier instead of a black square.");
  assert.equal(tileColors.dark, "#ffffff", "Sampled favicon paper carriers remain fixed across Wayleaf themes.");
  assert.equal(faviconShouldFuseEmbeddedTile(color, tileColors.light, adaptiveFaviconOptions), false, "SSSAiCode-like cursor favicon pixels must not be fused into a black carrier.");
}

{
  const circularEmblemSample = rgbaSample(faviconFixtureSize, (x, y) => {
    const distance = Math.hypot(x - 15.5, y - 15.5);
    if (distance > 15.5) {
      return [0, 0, 0, 0];
    }
    const globeLine = Math.abs(x - 15.5) <= 1
      || Math.abs(y - 15.5) <= 1
      || Math.abs(distance - 9) <= 1;
    return hexChannels(globeLine ? "#bbbbbb" : "#7e7e7e");
  });
  const { color, tileColors } = faviconTileDecision(circularEmblemSample);
  assert.equal(color.compactEmblem, true, "Circular silhouettes should be read as complete emblems instead of rounded-square app tiles.");
  assert.deepEqual(tileColors, { light: "#ffffff", dark: "#ffffff" }, "Neutral circular emblems should use a paper carrier selected from their outer silhouette.");
  assert.equal(faviconShouldFuseEmbeddedTile(color, tileColors.light, adaptiveFaviconOptions), false, "Circular emblem pixels must stay intact instead of being fused as a square tile background.");
}

{
  const { color, tileColors } = faviconTileDecision(rgbaSample(faviconFixtureSize, (x, y, size) => {
    return sparseDotGlyph(x, y, size) ? hexChannels("#e89bc5") : [0, 0, 0, 0];
  }));
  const sampledGlyph = rgbChannelsToHex(color.red, color.green, color.blue);
  assert.equal(sampledGlyph, "#e89bc5", "Transparent pink ico glyphs expose the colored glyph palette.");
  assert.notEqual(tileColors.light, sampledGlyph, "Transparent pink ico glyphs should use a neutral carrier instead of pink-on-pink.");
  assert.ok(contrastRatio(tileColors.light, sampledGlyph) >= FAVICON_READABLE_CARRIER_CONTRAST_MIN, "Transparent pink ico glyphs receive a readable neutral carrier.");
  assert.equal(tileColors.dark, tileColors.light, "Sampled favicon carriers must remain fixed when Wayleaf switches light/dark mode.");
}

{
  const lowContrastPinkTileSample = rgbaSample(faviconFixtureSize, (x, y, size) => {
    const mark = centeredBox(x, y, size, 8)
      && (Math.abs((x - 16) - (y - 16)) <= 3 || Math.abs((x - 16) + (y - 16)) <= 3);
    return hexChannels(mark ? "#dc91bb" : "#e89bc5");
  });
  const { color, tileColors } = faviconTileDecision(lowContrastPinkTileSample);
  assert.equal(color.matchMode, "full-surface", "Low-contrast pink favicon tiles are complete artwork, not transparent glyphs.");
  assert.deepEqual(tileColors, { light: "#ffffff", dark: "#ffffff" }, "Low-contrast pink favicon artwork should use a paper carrier instead of pink-on-pink masking.");
  assert.equal(faviconShouldFuseEmbeddedTile(color, tileColors.light, adaptiveFaviconOptions), false, "Low-contrast full-surface favicon artwork should keep its bitmap, not fuse into the carrier.");
}

{
  const paperMascotSample = rgbaSample(faviconFixtureSize, (x, y, size) => {
    const paper = centeredBox(x, y, size, 6);
    const star = Math.abs(x - 16) + Math.abs(y - 15) <= 6 || (x >= 13 && x <= 19 && y >= 17 && y <= 19);
    const grayStroke = paper && (
      x === 8 || x === 23 || y === 8 || y === 23 || Math.abs((x - 9) - (y - 8)) <= 1
    );
    if (star) {
      return hexChannels("#ff9fb5");
    }
    if (grayStroke) {
      return hexChannels("#9ca3af");
    }
    return paper ? hexChannels("#f8fafc") : [0, 0, 0, 0];
  });
  const { color, tileColors } = faviconTileDecision(paperMascotSample);
  assert.equal(faviconCandidateLooksLikeTransparentPaperArtwork(color, rgbChannelsToHex(color.red, color.green, color.blue)), true, "Paper-backed mascot favicons should be classified as complete artwork, not white glyphs.");
  assert.deepEqual(tileColors, { light: "#ffffff", dark: "#ffffff" }, "Paper-backed mascot favicons should keep a paper carrier instead of being pushed onto a dark tile.");
  assert.equal(faviconShouldFuseEmbeddedTile(color, tileColors.light, adaptiveFaviconOptions), false, "Transparent paper artwork should preserve the original bitmap rather than fusing pixels.");
}

{
  const { color, tileColors } = faviconTileDecision(rgbaSample(faviconFixtureSize, (x, y, size) => {
    const paper = centeredBox(x, y, size, 5);
    const mark = x >= 12 && x <= 20 && y >= 11 && y <= 20;
    if (paper) {
      return hexChannels(mark ? "#111827" : "#ffffff");
    }
    return hexChannels("#101820");
  }));
  assert.equal(color.matchMode, "full-surface", "A dark outer favicon shell with a white inner tile should not be mistaken for a colored embedded brand tile.");
  assert.equal(faviconCandidateHasPaperSurfaceArtwork(color), true, "White inner-tile favicon artwork should be recognized from the whole bitmap, not only the sampled carrier.");
  assert.deepEqual(tileColors, { light: "#ffffff", dark: "#ffffff" }, "White inner-tile favicons should use a paper carrier instead of a dark double-frame mask.");
}

{
  const { color, tileColors } = faviconTileDecision(rgbaSample(faviconFixtureSize, (x, y, size) => {
    if (!centeredGlyph(x, y, size)) {
      return [0, 0, 0, 0];
    }
    return hexChannels(x < 13 ? "#e53935" : x < 20 ? "#1976d2" : "#fbc02d");
  }));
  const palette = faviconForegroundPaletteColors(color, rgbChannelsToHex(color.red, color.green, color.blue));
  assert.ok(palette.length >= 3, "Transparent multicolor favicons should retain their major visible colors instead of collapsing to one average.");
  assert.deepEqual(tileColors, { light: "#ffffff", dark: "#ffffff" }, "Transparent saturated multicolor favicon artwork should use a white paper carrier instead of a mathematically darker tile.");
}

{
  const newApiLikeSample = rgbaSample(faviconFixtureSize, (x, y) => {
    const distance = Math.hypot(x - 16, y - 16);
    if (distance < 5 || distance > 9) {
      return [0, 0, 0, 0];
    }
    if (x < 14) {
      return hexChannels(y < 17 ? "#24e0f0" : "#738ef6");
    }
    return hexChannels(y < 17 ? "#f85fb0" : "#bd42fa");
  });
  const { color, tileColors } = faviconTileDecision(newApiLikeSample);
  const palette = faviconForegroundPaletteColors(color, rgbChannelsToHex(color.red, color.green, color.blue));
  assert.equal(faviconCandidateLooksLikeTransparentGlyph(color, rgbChannelsToHex(color.red, color.green, color.blue)), true, "New API-like artwork should remain a transparent glyph, not become a self-contained dark tile.");
  assert.equal(faviconPaletteHasDistinctHueFamilies(palette), true, "New API-like cyan and pink artwork should be recognized as saturated multicolor branding.");
  assert.deepEqual(tileColors, { light: "#ffffff", dark: "#ffffff" }, "New API-like transparent multicolor favicon artwork should use a white carrier.");
}

{
  const { color, tileColors } = faviconTileDecision(rgbaSample(faviconFixtureSize, () => {
    return hexChannels("#ffffff");
  }));
  assert.equal(rgbChannelsToHex(color.red, color.green, color.blue), "#ffffff", "Solid near-white favicon samples are still measurable.");
  assert.equal(tileColors, null, "Opaque favicon samples without identifiable foreground must use the conservative generic fallback instead of a blank tile.");
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
  const localBitmapTileColors = faviconMatchedTileColors(color);
  assert.equal(sampledTile, "#060708", "Xiaomi-like dark ico backgrounds should use the edge-supported favicon carrier color.");
  assert.notEqual(tileColors.light, sampledTile, "Dark low-contrast favicon backgrounds should not remain dark-on-dark.");
  assert.ok(contrastRatio(tileColors.light, faviconForegroundRepresentativeColor(color, sampledTile)) >= FAVICON_READABLE_CARRIER_CONTRAST_MIN, "Dark low-contrast favicon foreground receives a readable neutral carrier.");
  assert.equal(faviconShouldFuseEmbeddedTile(color, tileColors.light, adaptiveFaviconOptions), false, "Dark low-contrast full-surface favicons keep their original bitmap artwork.");
  assert.deepEqual(localBitmapTileColors, { light: "#060708", dark: "#060708" }, "Local bitmap resources keep the pre-existing carrier strategy outside the favicon fallback branch.");
  assert.equal(faviconShouldFuseEmbeddedTile(color, localBitmapTileColors.light), false, "Local bitmap resources do not enter the new low-contrast full-surface fusion rule.");
}

assert.deepEqual(genericSiteFallbackTileColors(), { light: "#f04424", dark: "#f04424" }, "No-site-ico fallback tile colors remain unchanged.");

assert.deepEqual(extractSvgColorPalette('<svg><path fill="#abc"/><path stroke="#aabbcc"/></svg>'), ["#aabbcc"], "Equivalent short and long hex colors should dedupe.");
assert.deepEqual(extractSvgColorPalette('<svg><path style="fill:#111;stroke:#222"/></svg>'), ["#111111", "#222222"], "Inline style colors must be included in the palette.");
assert.deepEqual(
  extractSvgColorPalette('<svg><style>.a{fill:red}.b{stroke:rgb(0, 128, 255)}</style><path class="a"/><path class="b"/></svg>'),
  ["#ff0000", "#0080ff"],
  "SVG style blocks should expose named and rgb body colors."
);
assert.deepEqual(
  extractSvgColorPalette('<svg><linearGradient id="g"><stop stop-color="yellow"/><stop style="stop-color:rgba(0,128,255,1)"/></linearGradient></svg>'),
  ["#ffff00", "#0080ff"],
  "Gradient stop colors should be part of the parsed SVG body palette."
);
assert.deepEqual(
  extractSvgColorPalette('<svg color="#13579b"><g><path fill="currentColor"/></g></svg>'),
  ["#13579b"],
  "Inherited currentColor should resolve before mask and gradient classification."
);
assert.equal(remoteBrandSvgIsMonochrome('<svg><path fill="#111"/><path stroke="#111"/></svg>'), true, "Single-color SVGs are maskable.");
assert.equal(remoteBrandSvgIsMonochrome('<svg><path style="fill:#111;stroke:#222"/></svg>'), false, "Two-color SVGs are not maskable.");
assert.equal(remoteBrandSvgIsMonochrome('<svg><linearGradient id="g"/><path fill="url(#g)"/></svg>'), false, "Gradient SVGs are not maskable.");
assert.equal(remoteBrandSvgIsMonochrome('<svg><path fill="currentColor"/></svg>'), true, "CurrentColor-only SVGs are maskable.");
assert.deepEqual(
  localSiteIconAnalysisFromSvgForTest('<svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"/></svg>'),
  { brandColor: "#000000", renderMode: "mask", hasExplicitBrandColor: false, visibleColors: [], embeddedCarrierColor: "" },
  "Implicit-black monochrome SVGs should render through the mask pipeline without claiming an explicit VI color."
);
assert.deepEqual(
  localSiteIconAnalysisFromSvgForTest('<svg viewBox="0 0 24 24"><path fill="currentColor" d="M0 0h24v24H0z"/></svg>'),
  { brandColor: "", renderMode: "mask", hasExplicitBrandColor: false, visibleColors: [], embeddedCarrierColor: "" },
  "Unknown currentColor SVGs stay maskable but do not guess a VI color."
);
assert.deepEqual(
  localSiteIconAnalysisFromSvgForTest('<svg viewBox="0 0 24 24"><path fill="#111111" d="M0 0h24v24H0z"/></svg>'),
  { brandColor: "#111111", renderMode: "mask", hasExplicitBrandColor: true, visibleColors: ["#111111"], embeddedCarrierColor: "" },
  "Explicit dark monochrome SVGs should provide a stable VI color."
);
assert.deepEqual(
  localSiteIconAnalysisFromSvgForTest('<svg viewBox="0 0 24 24"><path fill="#ffffff" d="M0 0h24v24H0z"/></svg>'),
  { brandColor: "", renderMode: "mask", hasExplicitBrandColor: false, visibleColors: ["#ffffff"], embeddedCarrierColor: "" },
  "Explicit white monochrome SVGs should not create white-on-white VI rendering."
);
assert.equal(
  localSiteIconAnalysisFromSvgForTest('<svg viewBox="0 0 24 24"><path fill="#111"/><path fill="#222"/></svg>').renderMode,
  "original",
  "Multicolor SVGs should preserve original artwork instead of entering mask recoloring."
);
assert.equal(
  localSiteIconAnalysisFromSvgForTest(pinduoduoSvgSource).embeddedCarrierColor,
  "#f40009",
  "Pinduoduo-like multicolor SVGs with a full equal-radius carrier should expose the embedded carrier color."
);
assert.equal(
  localSiteIconAnalysisFromSvgForTest('<svg viewBox="0 0 24 24"><rect width="24" height="24" rx="5" ry="5" fill="#f40009"/><path fill="#fff" d="M4 4h16v16H4z"/></svg>').embeddedCarrierColor,
  "#f40009",
  "Rounded rect multicolor SVGs should use their own app-icon carrier color."
);
assert.equal(
  localSiteIconAnalysisFromSvgForTest('<svg viewBox="0 0 24 24"><rect width="24" height="24" fill="#f40009"/><path fill="#fff" d="M4 4h16v16H4z"/></svg>').embeddedCarrierColor,
  "",
  "Full rectangular multicolor SVG backgrounds without rounded corners must not be treated as embedded app-icon carriers."
);
assert.equal(
  localSiteIconAnalysisFromSvgForTest('<svg viewBox="0 0 24 24"><path fill="#f40009" d="M4 0H20Q24 0 24 4V18Q24 24 18 24H6Q0 24 0 18V4Q0 0 4 0Z"/><path fill="#fff" d="M4 4h16v16H4z"/></svg>').embeddedCarrierColor,
  "",
  "Path backgrounds with unequal corner radii must not be treated as embedded app-icon carriers."
);
assert.equal(
  localSiteIconAnalysisFromSvgForTest('<svg viewBox="0 0 24 24"><linearGradient id="g"/><path fill="url(#g)" d="M0 0h24v24H0z"/></svg>').renderMode,
  "original",
  "Gradient structure without readable body colors should not claim the gradient carrier path."
);
assert.equal(
  localSiteIconAnalysisFromSvgForTest('<svg viewBox="0 0 24 24"><linearGradient id="g"><stop stop-color="red"/><stop stop-color="rgb(0,128,255)"/></linearGradient><path fill="url(#g)" d="M0 0h24v24H0z"/></svg>').renderMode,
  "gradient",
  "Gradient SVGs with readable body colors should keep original artwork while using palette-aware carriers."
);


const realSiteSvgClassifications = [...siteIconFiles]
  .filter((fileName) => fileName.endsWith(".svg"))
  .map((fileName) => {
    const svg = readFileSync(new URL(`../icons/sites/${fileName}`, import.meta.url), "utf8");
    const analysis = localSiteIconAnalysisFromSvgForTest(svg);
    return [fileName, analysis.renderMode];
  });
assert.equal(
  realSiteSvgClassifications.every(([, renderMode]) => ["mask", "original", "gradient"].includes(renderMode)),
  true,
  "Every deployed local SVG must classify as mask, original artwork, or gradient artwork."
);
assert.equal(realSiteSvgClassifications.some(([, renderMode]) => renderMode === "mask"), true, "The deployed SVG set must keep maskable logo coverage.");
assert.equal(realSiteSvgClassifications.some(([, renderMode]) => renderMode === "original"), true, "The deployed SVG set must keep original-artwork coverage.");
assert.equal(realSiteSvgClassifications.some(([, renderMode]) => renderMode === "gradient"), true, "The deployed SVG set must keep gradient-artwork coverage.");
assert.deepEqual(
  [
    "spotify.svg",
    "whatsapp.svg",
    "wechat.svg",
    "mgtv.svg",
    "googlegemini.svg",
    "jimeng.svg",
    "antigravity.svg",
    "qq.svg",
    "github.svg",
    "x.svg"
  ].map((fileName) => [fileName, realSiteSvgClassifications.find(([name]) => name === fileName)?.[1] || "missing"]),
  [
    ["spotify.svg", "mask"],
    ["whatsapp.svg", "mask"],
    ["wechat.svg", "mask"],
    ["mgtv.svg", "original"],
    ["googlegemini.svg", "gradient"],
    ["jimeng.svg", "gradient"],
    ["antigravity.svg", "gradient"],
    ["qq.svg", "original"],
    ["github.svg", "mask"],
    ["x.svg", "mask"]
  ],
  "Representative local SVGs should stay on the intended shared render branch."
);
const siteKeyByIconFileForTest = new Map(
  Object.entries(SITE_ICON_FILE_BY_SITE_KEY_FOR_TEST).map(([siteKey, fileName]) => [fileName, siteKey])
);
const gradientCarrierAudit = realSiteSvgClassifications
  .filter(([, renderMode]) => renderMode === "gradient")
  .map(([fileName]) => {
    const iconPath = `icons/sites/${fileName}`;
    localSiteIconRenderModeForTest(iconPath);
    const siteKey = siteKeyByIconFileForTest.get(fileName) || "";
    const brandColor = siteKey ? siteIconBrandColorForTest(siteKey, iconPath) : "";
    const tileColors = brandIconTileColorsForTest(brandColor, siteKey, iconPath);
    const palette = originalSvgVisiblePaletteForTest(brandColor, iconPath);
    return { fileName, tileColors, risk: gradientCarrierRiskForTest(palette) };
  });
assert.deepEqual(
  gradientCarrierAudit
    .filter(({ tileColors }) => !(
      tileColors.light === tileColors.dark
        && [BRAND_ICON_MULTICOLOR_PAPER_CARRIER, BRAND_ICON_MULTICOLOR_DARK_CARRIER].includes(tileColors.light)
    ))
    .map(({ fileName, tileColors }) => [fileName, tileColors]),
  [],
  "Every deployed gradient SVG must resolve to one stable neutral carrier before release."
);
assert.deepEqual(
  gradientCarrierAudit
    .filter(({ risk }) => risk && Math.abs(risk.darkScore) < 0.2)
    .map(({ fileName }) => fileName),
  [],
  "No deployed gradient SVG should sit on a carrier decision cliff before release."
);

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

const theSvgProviderSlugs = remoteBrandSlugMapFromFileListForTest([
  { name: "/public/icons/github-copilot/default.svg" },
  { name: "/public/icons/github-copilot/light.svg" },
  { name: "/public/icons/visual-studio-code/default.svg" },
  { name: "/public/icons/visual-studio-code/wordmark.svg" },
  { name: "/public/icons/github/default.svg" }
], /^\/public\/icons\/(.+)\/default\.svg$/i);
assert.equal(remoteBrandProviderHasSlugForTest(theSvgProviderSlugs, "github-copilot"), true, "theSVG provider index should allow dashed default SVG slugs.");
assert.equal(remoteBrandProviderHasSlugForTest(theSvgProviderSlugs, "visual-studio-code"), true, "theSVG provider index should use the default.svg variant as the availability gate.");
assert.equal(remoteBrandProviderSlugForCandidateForTest(theSvgProviderSlugs, "githubcopilot"), "github-copilot", "theSVG provider should fetch with the original dashed slug after normalized matching.");
assert.equal(remoteBrandProviderSlugForCandidateForTest(theSvgProviderSlugs, "visualstudiocode"), "visual-studio-code", "theSVG provider should preserve original provider slugs in request URLs.");
assert.equal(remoteBrandProviderHasSlugForTest(theSvgProviderSlugs, "wordmark"), false, "theSVG provider index should not treat non-default variants as brand slugs.");

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
  "Suno should render as black carrier with white glyph in light mode and light carrier with black glyph in dark mode."
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
const multicolorSvg = '<svg viewBox="0 0 24 24"><path fill="#4285f4"/><path fill="#ea4335"/></svg>';
const midjourneyDefaultSvg = '<svg width="698" height="583" viewBox="0 0 698 583" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 573.5C29 573.5 59 531.5 94 525.5" stroke="white" stroke-width="18"/></svg>';
assert.equal(remoteBrandSvgQuality(simpleSvg, { candidate: { score: 92 } }).accepted, true, "Simple scored SVGs should pass the quality gate.");
assert.equal(remoteBrandSvgQuality("", { candidate: { score: 92 } }).accepted, false, "Empty provider responses should fail the quality gate.");
assert.equal(remoteBrandSvgQuality("not an svg", { candidate: { score: 92 } }).accepted, false, "Non-SVG provider responses should fail the quality gate.");
assert.equal(remoteBrandSvgQuality('<html><body><svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"/></svg></body></html>', { candidate: { score: 92 } }).accepted, false, "Embedded SVG inside an HTML response should not pass as a provider SVG.");
assert.equal(remoteBrandSvgQuality('<svg><path d="M0 0h1v1H0z"/></svg>', { candidate: { score: 92 } }).accepted, false, "SVGs without usable geometry should fail.");
assert.equal(remoteBrandSvgQuality('<svg viewBox="0 0 24 24"><foreignObject/></svg>', { candidate: { score: 92 } }).accepted, false, "SVGs with embedded HTML should fail.");
assert.equal(remoteBrandSvgQuality('<svg viewBox="0 0 24 24"><path onclick="alert(1)" d="M0 0h1v1H0z"/></svg>', { candidate: { score: 92 } }).accepted, false, "SVGs with event handlers should fail.");
assert.equal(remoteBrandSvgQuality(simpleSvg, { candidate: { score: 44 } }).accepted, false, "Low-confidence slug matches should fail.");
assert.equal(remoteBrandSvgQuality(midjourneyDefaultSvg, { candidate: { score: 92 } }).accepted, true, "theSVG Midjourney default geometry should pass the remote quality gate.");
assert.equal(remoteBrandSvgBrandColor(midjourneyDefaultSvg, { siteKey: "midjourney.com" }), "#0050c9", "Midjourney default SVG should use the maintained VI color for shared mask rendering.");
assert.match(
  source.match(/async function fetchRemoteBrandIconDataUrl\(parsedUrl\) \{[\s\S]*?\n\}/)?.[0] || "",
  /candidate\.score >= REMOTE_BRAND_ICON_DIRECT_FETCH_SCORE_MIN[\s\S]*provider\.urlForSlug\(candidate\.slug\)[\s\S]*remoteBrandProviderSlugForCandidate/,
  "High-confidence Midjourney-like slugs should try the deterministic default SVG before waiting for the provider index."
);

assert.equal(remoteBrandSvgBrandColor(simpleSvg, { providerId: "lobehub" }), "#1db954", "Expressive remote provider colors should be trusted.");
assert.equal(remoteBrandSvgBrandColor('<svg viewBox="0 0 24 24"><path fill="#000000"/></svg>', { providerId: "lobehub" }), "#000000", "Monochrome black provider SVGs should remain valid mask VI colors.");
assert.equal(remoteBrandSvgBrandColor('<svg viewBox="0 0 24 24"><path fill="#000000"/></svg>', { providerId: "lobehub", siteKey: "bilibili.com" }), "#00a1d6", "Known local VI color should be used when remote color is neutral.");
assert.equal(remoteBrandSvgBrandColor(currentColorSvg, { providerId: "lobehub", siteKey: "bilibili.com" }), "#00a1d6", "currentColor remote SVGs should use the known siteKey VI color before shared color strategy.");
assert.equal(remoteBrandSvgBrandColor(currentColorSvg, { providerId: "lobehub", siteKey: "unknown.example" }), "", "Unknown currentColor remote SVGs must not guess a VI color.");
assert.equal(remoteBrandSvgBrandColor(currentColorSvg, { providerId: "thesvg", siteKey: "openai.com", allowSiteKeyColorFallback: false }), "", "Remote supplements for local SVGs must not overwrite an implicit-black local logo with the siteKey VI table.");
assert.equal(remoteBrandSvgBrandColor('<svg viewBox="0 0 24 24"><path fill="#ffffff"/></svg>', { providerId: "lobehub" }), "", "Monochrome white provider SVGs should not become a white-on-white VI color.");

assert.equal(remoteBrandSvgResponseMayContainSvg("image/svg+xml; charset=utf-8", "https://cdn.example/icon"), true, "Explicit SVG content types should be accepted.");
assert.equal(remoteBrandSvgResponseMayContainSvg("text/html", "https://cdn.example/icon.svg"), false, "Explicit HTML provider responses should be rejected even when the URL ends in .svg.");
assert.equal(remoteBrandSvgResponseMayContainSvg("application/octet-stream", "https://cdn.example/icon.svg"), true, "Generic binary content may be accepted when the provider URL is an SVG.");
assert.equal(remoteBrandIconMissCacheIsFresh({ missing: true, source: "remote-brand", providerVersion: 2, updatedAt: 1_000 }, 500, 1_400), true, "Fresh provider misses from the current provider contract should suppress repeated fetches.");
assert.equal(remoteBrandIconMissCacheIsFresh({ missing: true, source: "remote-brand", providerVersion: 2, updatedAt: 1_000 }, 500, 1_600), false, "Expired provider misses should allow provider retry.");
assert.equal(remoteBrandIconMissCacheIsFresh({ missing: true, source: "remote-brand", updatedAt: 1_000 }, 500, 1_400), false, "Misses from an older provider URL contract must retry immediately.");
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
      visibleColors: ["#ff6363"],
      embeddedCarrierColor: "",
      qualityScore: 100
    },
    tileColors: { light: "#ff6363", dark: "#f8fafc" },
    lightGlyph: "#ffffff",
    darkGlyph: "#ff6363"
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
      visibleColors: ["#006bff"],
      embeddedCarrierColor: "",
      qualityScore: 100
    },
    tileColors: { light: "#006bff", dark: "#f8fafc" },
    lightGlyph: "#ffffff",
    darkGlyph: "#006bff"
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
      visibleColors: ["#fcbfbd"],
      embeddedCarrierColor: "",
      qualityScore: 100
    },
    tileColors: { light: brandIconLightCarrierColorForTest("#fcbfbd"), dark: "#f8fafc" },
    lightGlyph: "#ffffff",
    darkGlyph: "#b08c89"
  }
];

for (const sample of cloudProviderSamples) {
  assert.equal(localIconForSiteKeyForTest(sample.siteKey), "", `${sample.siteName} has no deployed local fixture and should exercise the cloud branch.`);
  assert.equal(remoteProviderCanRunForSiteKeyForTest(sample.siteKey), true, `${sample.siteName} remains eligible for remote provider discovery.`);
  assert.equal(remoteBrandIconSlugCandidatesForTest(sample.siteKey, sample.siteName)[0].slug, sample.siteKey.split(".")[0], `${sample.siteName} should produce a stable provider slug.`);
  assert.deepEqual(remoteBrandSvgQuality(sample.svg, { candidate: { score: 92 } }), { accepted: true, score: 100 }, `${sample.siteName} provider SVG should pass the quality gate.`);
  assert.equal(remoteBrandSvgBrandColor(sample.svg, { providerId: "lobehub" }), sample.color, `${sample.siteName} provider color should be trusted when no local VI color exists.`);
  assert.deepEqual(remoteBrandSvgDescriptor(sample.svg, { brandColor: sample.color, qualityScore: 100 }), sample.descriptor, `${sample.siteName} should cache only source metadata, not a separate display tile descriptor.`);
  const remoteDataUrl = svgTextDataUrl(prepareRemoteBrandSvgForTest(sample.svg, { brandColor: sample.color, qualityScore: 100 }));
  const icon = new TestIcon();
  testTheme = "light";
  applySiteIconForTest(icon, { url: `https://${sample.siteKey}/`, icon: remoteDataUrl });
  assert.deepEqual(
    {
      light: icon.style.getPropertyValue("--site-icon-tile-light"),
      dark: icon.style.getPropertyValue("--site-icon-tile-dark")
    },
    sample.tileColors,
    `${sample.siteName} cached cloud SVG should use the same tile colors as local SVG rendering.`
  );
  assert.match(decodeSvgDataUrl(icon.src), new RegExp(`fill="${sample.lightGlyph}"`), `${sample.siteName} cached cloud SVG should use the shared light glyph rule.`);
  assertReadableIconPair(sample.tileColors.light, sample.lightGlyph, `${sample.siteName} cloud day carrier and glyph must be readable`);
  testTheme = "dark";
  refreshAdaptiveSiteIconsForTest([icon]);
  assert.match(decodeSvgDataUrl(icon.src), new RegExp(`fill="${sample.darkGlyph}"`), `${sample.siteName} cached cloud SVG should use the shared dark glyph rule.`);
  assertReadableIconPair(sample.tileColors.dark, sample.darkGlyph, `${sample.siteName} cloud night carrier and glyph must be readable`);
}

assert.equal(localIconForSiteKeyForTest("shadcn.com"), "", "shadcn has no deployed local fixture and should not be mistaken for a local icon.");
assert.equal(localIconForSiteKeyForTest("midjourney.com"), "", "Midjourney should exercise the theSVG default provider instead of an obsolete local asset.");
assert.equal(remoteProviderCanRunForSiteKeyForTest("midjourney.com"), true, "Midjourney must remain eligible for cloud SVG discovery.");
assert.equal(remoteProviderCanRunForSiteKeyForTest("shadcn.com"), true, "shadcn remains eligible for remote provider discovery before favicon fallback.");
assert.equal(remoteBrandIconSlugCandidatesForTest("shadcn.com", "Shadcn")[0].slug, "shadcn", "shadcn should produce a deterministic provider slug before falling back.");
assert.equal(remoteBrandSvgResponseMayContainSvg("text/html", "https://ui.shadcn.com"), false, "A shadcn-style non-SVG provider/fetch response must not be cached as a remote SVG.");

for (const [siteKey, providerSlug] of [
  ["analytics.google.com", "googleanalytics"],
  ["calendar.google.com", "googlecalendar"],
  ["docs.google.com", "googledocs"],
  ["drive.google.com", "googledrive"],
  ["maps.google.com", "googlemaps"],
  ["meet.google.com", "googlemeet"]
]) {
  assert.equal(localIconForSiteKeyForTest(siteKey), "", `${siteKey} should not retain a deleted local icon mapping.`);
  assert.equal(remoteProviderCanRunForSiteKeyForTest(siteKey), true, `${siteKey} should remain eligible for cloud provider discovery.`);
  assert.equal(remoteBrandIconSlugCandidatesForTest(siteKey, "", [providerSlug, "google"])[0].slug, providerSlug, `${siteKey} should prefer its specific cloud provider slug.`);
  assert.equal(source.includes(`"${siteKey}": ["${providerSlug}", "google"]`), true, `${siteKey} should wire its cloud provider aliases in runtime code.`);
}

assert.equal(localIconForUrlForTest("https://www.doubao.com/chat/"), "icons/sites/doubao.svg", "Doubao should use the deployed multicolor local SVG.");
assert.equal(localIconForUrlForTest("https://www.kimi.com/"), "icons/sites/kimi.svg", "Kimi should use the deployed local SVG.");
assert.equal(localIconForUrlForTest("https://chatglm.cn/"), "icons/sites/glm.svg", "GLM/ChatGLM should use the deployed local SVG.");
assert.equal(localIconForUrlForTest("https://www.douyin.com/search/"), "icons/sites/douyin.svg", "Douyin should use the deployed multicolor local SVG instead of the legacy ico.");
assert.equal(localIconForUrlForTest("https://www.alipay.com/"), "icons/sites/alipay.svg", "Alipay should use the deployed multicolor local SVG.");
assert.equal(localIconForUrlForTest("https://www.instagram.com/"), "icons/sites/instagram.svg", "Instagram should use the deployed multicolor local SVG.");
assert.equal(localIconForUrlForTest("https://www.iqiyi.com/"), "icons/sites/iqiyi.svg", "iQIYI should use the deployed local SVG.");
assert.equal(localIconForUrlForTest("https://huggingface.co/"), "icons/sites/huggingface.svg", "Hugging Face should use the deployed multicolor local SVG.");
assert.equal(localIconForUrlForTest("https://jimeng.jianying.com/"), "icons/sites/jimeng.svg", "Jimeng should use the deployed multicolor local SVG.");
assert.equal(localIconForUrlForTest("https://mimo.mi.com/"), "icons/sites/xiaomimimo.svg", "MiMo should use the deployed local SVG.");
assert.equal(localIconForUrlForTest("https://www.mgtv.com/"), "icons/sites/mgtv.svg", "MGTV should use the deployed local SVG.");
assert.equal(localIconForUrlForTest("https://www.qq.com/"), "icons/sites/qq.svg", "QQ should use the deployed local SVG.");
assert.equal(localIconForUrlForTest("https://video.qq.com/"), "icons/sites/vqq.svg", "Tencent Video should use the deployed local SVG without taking over all qq.com pages.");
assert.equal(localIconForUrlForTest("https://v.qq.com/x/cover/sample.html"), "icons/sites/vqq.svg", "v.qq.com should use the deployed Tencent Video SVG.");
assert.equal(localIconForUrlForTest("https://www.tiktok.com/"), "icons/sites/tiktok.svg", "TikTok should use the deployed multicolor local SVG.");
{
  const icon = new TestIcon();
  icon.dataset.iconCacheHydrated = "true";
  icon.src = "data:image/png;base64,old-tesla-favicon";
  assert.equal(localIconForUrlForTest("https://www.tesla.com/model3"), "", "Tesla should stay cloud-provider eligible when no deployed local SVG exists.");
  assert.equal(remoteBrandIconSlugCandidatesForTest("tesla.com", "Tesla")[0].slug, "tesla", "Tesla should produce a deterministic remote brand slug.");
  assert.equal(
    refreshRenderedSiteIconDecisionForTest(icon, { url: "https://www.tesla.com/model3" }),
    "refresh-remote-brand",
    "First-paint cached favicons without local assets must still trigger remote brand refresh."
  );
}
{
  const remoteGradient = svgTextDataUrl(prepareRemoteBrandSvgForTest('<svg viewBox="0 0 24 24"><linearGradient id="g"><stop stop-color="#30f5fe"/><stop stop-color="#f0fefc"/><stop stop-color="#fbc610"/></linearGradient><path fill="url(#g)" d="M0 0h24v24H0z"/></svg>', { brandColor: "#4ac7ff", qualityScore: 100 }));
  const icon = new TestIcon();
  icon.dataset.iconCacheHydrated = "true";
  icon.dataset.iconSource = remoteGradient;
  icon.src = remoteGradient;
  assert.equal(
    refreshRenderedSiteIconDecisionForTest(icon, { url: "https://remote-gradient.example/" }),
    "keep-remote-brand-cache",
    "First-paint cached remote SVG results should not be overwritten by the remote refresh branch."
  );
}
{
  const icon = new TestIcon();
  icon.dataset.iconCacheHydrated = "true";
  icon.dataset.iconSource = "icons/sites/doubao.svg";
  icon.src = "icons/sites/doubao.svg";
  assert.equal(
    refreshRenderedSiteIconDecisionForTest(icon, { url: "https://www.doubao.com/chat/" }),
    "sync-local-cache-render",
    "First-paint cached local SVG display nodes should resync from the shared Wayleaf icon result on refresh."
  );
}
{
  const icon = new TestIcon();
  icon.dataset.iconCacheHydrated = "true";
  icon.dataset.siteKey = "google.com";
  icon.src = "data:image/svg+xml,legacy-google-render";
  assert.equal(
    refreshRenderedSiteIconDecisionForTest(icon, { url: "https://www.google.com/search" }),
    "sync-local-cache-render",
    "Legacy first-paint local SVG cache should sync source and tile metadata without falling back to favicon."
  );
  assert.equal(icon.dataset.iconSource, "icons/sites/google.svg", "Legacy local cache recovers the shared source for theme refresh.");
  assert.equal(icon.dataset.iconCandidate, "icons/sites/google.svg", "Legacy local cache recovers the shared candidate token.");
  assert.deepEqual(
    {
      light: icon.style.getPropertyValue("--site-icon-tile-light"),
      dark: icon.style.getPropertyValue("--site-icon-tile-dark")
    },
    brandIconTileColorsForTest("#4285f4", "google.com", "icons/sites/google.svg"),
    "Legacy Google cache resyncs the existing multicolor carriers."
  );
  assert.equal(icon.src, "icons/sites/google.svg", "Legacy Google cache keeps the local Wayleaf icon path instead of favicon fallback.");
}
{
  const icon = new TestIcon();
  icon.dataset.iconCacheHydrated = "true";
  icon.dataset.siteKey = "v.qq.com";
  icon.dataset.iconSource = "icons/sites/vqq.svg";
  icon.src = "data:image/svg+xml,%3Csvg viewBox='0 0 24 24'%3E%3Cpath fill='%23092018' d='M4 2l16 10L4 22z'/%3E%3C/svg%3E";
  assert.equal(
    refreshRenderedSiteIconDecisionForTest(icon, { url: "https://v.qq.com/" }),
    "sync-local-cache-render",
    "First-paint cached display nodes must sync from the shared local Wayleaf icon result when cached data is stale."
  );
}
[
  ["alipay.com", "icons/sites/alipay.svg", "#1677ff", { light: "#ffffff", dark: "#ffffff" }, "gradient"],
  ["douyin.com", "icons/sites/douyin.svg", "#000000", { light: "#ffffff", dark: "#ffffff" }, "original"],
  ["instagram.com", "icons/sites/instagram.svg", "#e4405f", { light: "#ffffff", dark: "#ffffff" }, "gradient"],
  ["huggingface.co", "icons/sites/huggingface.svg", "#ffd21e", { light: "#ffffff", dark: "#ffffff" }, "original"],
  ["tiktok.com", "icons/sites/tiktok.svg", "#000000", { light: "#ffffff", dark: "#ffffff" }, "original"],
  ["v.qq.com", "icons/sites/vqq.svg", "#30a3f9", { light: "#ffffff", dark: "#ffffff" }, "original"]
].forEach(([siteKey, iconPath, color, tileColors, renderMode]) => {
  assert.equal(localSiteIconRenderModeForTest(iconPath), renderMode, `${iconPath} should classify from SVG content, not a site whitelist.`);
  assert.deepEqual(brandIconTileColorsForTest(color, siteKey, iconPath), tileColors, `${iconPath} should derive tile colors from SVG content.`);
  if (renderMode === "original") {
    assertPaletteCarrierSeparatedForTest(iconPath, color, tileColors.light, "light", `${iconPath} light carrier`);
    assertPaletteCarrierSeparatedForTest(iconPath, color, tileColors.dark, "dark", `${iconPath} dark carrier`);
  }
});
assert.deepEqual(
  brandIconTileColorsForTest("#1c6fff", "jimeng.jianying.com", "icons/sites/jimeng.svg"),
  { light: "#111827", dark: "#111827" },
  "Light-dominant gradients with severe white-paper washout should use a dark carrier."
);
assert.deepEqual(
  brandIconTileColorsForTest("#ffffff", "antigravity.example", "icons/sites/antigravity.svg"),
  { light: "#ffffff", dark: "#ffffff" },
  "Wide-hue saturated gradients that are not severely washed out should keep the paper carrier."
);
assert.deepEqual(
  brandIconTileColorsForTest("#4285f4", "google.com", "icons/sites/google.svg"),
  { light: "#ffffff", dark: "#ffffff" },
  "Wide-hue gradients with moderate average luminance should keep the paper carrier."
);
assert.deepEqual(
  brandIconTileColorsForTest("#4285f4", "chrome.google.com", "icons/sites/chrome.svg"),
  { light: "#ffffff", dark: "#ffffff" },
  "Gradient artwork with dark anchors should keep the paper carrier."
);
assert.deepEqual(
  brandIconTileColorsForTest("#258ffa", "bing.com", "icons/sites/bing.svg"),
  { light: "#ffffff", dark: "#ffffff" },
  "Single-hue gradients with a dark anchor should keep the paper carrier."
);
assert.deepEqual(
  gradientSvgIconTileColorsForTest("#4ac7ff", svgTextDataUrl(prepareRemoteBrandSvgForTest('<svg viewBox="0 0 24 24"><linearGradient id="g"><stop stop-color="#30f5fe"/><stop stop-color="#f0fefc"/><stop stop-color="#fbc610"/></linearGradient><path fill="url(#g)" d="M0 0h24v24H0z"/></svg>', { brandColor: "#4ac7ff", qualityScore: 100 }))),
  { light: "#111827", dark: "#111827" },
  "Unlisted light-dominant gradient SVGs should choose a dark carrier from palette readability."
);
{
  const remoteGradient = svgTextDataUrl(prepareRemoteBrandSvgForTest('<svg viewBox="0 0 24 24"><linearGradient id="g"><stop stop-color="#30f5fe"/><stop stop-color="#f0fefc"/><stop stop-color="#fbc610"/></linearGradient><path fill="url(#g)" d="M0 0h24v24H0z"/></svg>', { brandColor: "#4ac7ff", qualityScore: 100 }));
  assert.deepEqual(
    firstPaintIconRenderWithCurrentTileForTest(
      { url: "https://remote-gradient.example/" },
      { src: remoteGradient, source: remoteGradient, tile: "brand", tileLight: "#ffffff", tileDark: "#ffffff", local: false, generic: false }
    ),
    { src: remoteGradient, source: remoteGradient, tile: "brand", tileLight: "#111827", tileDark: "#111827", local: false, generic: false },
    "First-paint cached remote SVGs should sync carrier colors before display instead of replaying a visible correction."
  );
}
{
  const render = { src: "icons/sites/jimeng.svg", source: "icons/sites/jimeng.svg", tile: "brand", tileLight: "#ffffff", tileDark: "#ffffff", local: true, generic: false };
  const previousAnalysis = localSiteIconRenderModeCacheForTest.get("icons/sites/jimeng.svg");
  localSiteIconRenderModeCacheForTest.delete("icons/sites/jimeng.svg");
  assert.strictEqual(
    firstPaintIconRenderWithCurrentTileForTest({ url: "https://jimeng.jianying.com/" }, render),
    render,
    "First-paint cached local SVGs should not synchronously reload SVG analysis and expose icon formation during refresh."
  );
  if (previousAnalysis) {
    localSiteIconRenderModeCacheForTest.set("icons/sites/jimeng.svg", previousAnalysis);
  }
}
assert.equal(siteIconBrandColorForTest("chatglm.cn", "icons/sites/glm.svg"), "#3859ff", "GLM should use its blue VI color for mask recoloring.");
assert.equal(siteIconBrandColorForTest("kimi.com", "icons/sites/kimi.svg"), "#111827", "Kimi should use its dark VI color for mask recoloring.");
assert.deepEqual(
  brandIconTileColorsForTest("#111827", "kimi.com", "icons/sites/kimi.svg"),
  { light: "#111827", dark: "#111827" },
  "Kimi-like light artwork should use one stable dark neutral carrier across themes."
);
assert.deepEqual(
  brandIconTileColorsForTest("#1e37fc", "doubao.com", "icons/sites/doubao.svg"),
  { light: "#ffffff", dark: "#ffffff" },
  "Doubao-like saturated multicolor artwork should use the paper app-icon carrier across themes."
);
assert.equal(siteIconBrandColorForTest("mimo.mi.com", "icons/sites/xiaomimimo.svg"), "#000000", "MiMo should use a black tile for mask recoloring.");
assert.equal(siteIconBrandColorForTest("openai.com", "icons/sites/chatgpt.svg"), "#000000", "ChatGPT/OpenAI local implicit-black SVG should not be overwritten by the OpenAI VI table color.");
assert.equal(siteIconBrandColorForTest("xiaohongshu.com", "icons/sites/xiaohongshu.svg"), "#ff2442", "Xiaohongshu's explicit red SVG should drive its monochrome carrier.");
assert.equal(siteIconBrandColorForTest("alibaba.com", "icons/sites/alibabadotcom.svg"), "#ff6a00", "Known VI colors should override black marketplace local SVG exports.");
assert.equal(source.includes('"netflix.com":'), false, "Netflix should not be special-cased in the VI color table.");
assert.equal(localSiteIconBrandColorForTest("icons/sites/netflix.svg"), "#e50914", "Netflix should recover its local SVG red as a trusted monochrome VI color.");
assert.equal(siteIconBrandColorForTest("netflix.com", "icons/sites/netflix.svg"), "#e50914", "Netflix should use parsed local SVG VI color when the siteKey table has no entry.");
assert.equal(siteIconBrandColorForTest("youtube.com", "icons/sites/youtube.svg"), "#ff0000", "YouTube should still prefer its maintained VI table color.");
assert.equal(localSiteIconBrandColorForTest("icons/sites/tripdotcom.svg"), "#000000", "Trip.com local SVG should have a readable implicit-black mask fallback.");
assert.equal(localSiteIconHasExplicitBrandColorForTest("icons/sites/tripdotcom.svg"), false, "Trip.com local SVG still has no explicit VI color.");
assert.equal(localIconNeedsRemoteBrandColorForTest("trip.com", "icons/sites/tripdotcom.svg"), true, "Trip.com local SVG should allow a remote default SVG to supplement VI color.");
assert.equal(localSiteIconRenderModeForTest("icons/sites/unlistedmulticolor.svg"), "original", "Local multicolor SVGs should classify as original without a manual siteKey list.");
assert.equal(localSiteIconRenderModeForTest("icons/sites/mgtv.svg"), "original", "Mango TV's orange and dark-gray SVG should classify as original artwork without a site whitelist.");
assert.equal(localSiteIconRenderModeForTest("icons/sites/qq.svg"), "original", "QQ's multicolor local SVG should preserve original artwork.");
assert.deepEqual(
  brandIconTileColorsForTest("#ffffff", "qq.com", "icons/sites/qq.svg"),
  { light: "#ffffff", dark: "#ffffff" },
  "QQ's implicit black plus red/yellow artwork should use the paper app-icon carrier."
);
assert.equal(localSiteIconRenderModeForTest("icons/sites/pinduoduo.svg"), "original", "Pinduoduo multicolor local SVG should preserve original artwork.");
assert.equal(localSiteIconRenderModeForTest("icons/sites/microsoftteams.svg"), "gradient", "Microsoft Teams gradient local SVG should use the palette-aware gradient carrier.");
assert.deepEqual(
  brandIconTileColorsForTest("#ffffff", "unlisted-multicolor.example", "icons/sites/unlistedmulticolor.svg"),
  { light: "#ffffff", dark: "#ffffff" },
  "Unlisted local multicolor SVGs should use the paper app-icon carrier without manual maintenance."
);
assertPaletteCarrierSeparatedForTest("icons/sites/unlistedmulticolor.svg", "#ffffff", "#ffffff", "light", "Unlisted local multicolor light carrier");
assertPaletteCarrierSeparatedForTest("icons/sites/unlistedmulticolor.svg", "#ffffff", "#ffffff", "dark", "Unlisted local multicolor dark carrier");

[
  { name: "Xiaohongshu", url: "https://www.xiaohongshu.com/", lightTile: "#ff2442", darkGlyph: "#ff2442" },
  { name: "Alibaba", url: "https://www.alibaba.com/", lightTile: "#ff6a00", darkGlyph: "#f56701" }
].forEach((sample) => {
  const icon = new TestIcon();
  testTheme = "light";
  applySiteIconForTest(icon, { url: sample.url, icon: "" });
  assertIconRenderStrategy(icon, {
    lightTile: sample.lightTile,
    darkTile: "#f8fafc",
    lightGlyph: "#ffffff",
    darkGlyph: sample.darkGlyph
  }, `${sample.name} known VI local SVG`);
});

[
  { name: "Pinduoduo", url: "https://www.pinduoduo.com/", source: "icons/sites/pinduoduo.svg", lightTile: "#f40009", darkTile: "#f40009", brandColor: "#e02e24", renderMode: "original", embeddedCarrierColor: "#f40009" },
  { name: "Microsoft Teams", url: "https://teams.microsoft.com/", source: "icons/sites/microsoftteams.svg", lightTile: "#ffffff", darkTile: "#ffffff" }
].forEach((sample) => {
  const icon = new TestIcon();
  testTheme = "light";
  applySiteIconForTest(icon, { url: sample.url, icon: "" });
  assert.equal(icon.dataset.iconSource, sample.source, `${sample.name} should use the deployed local SVG.`);
  assert.equal(icon.src, sample.source, `${sample.name} should preserve original artwork in light mode.`);
  assert.equal(icon.style.getPropertyValue("--site-icon-tile-light"), sample.lightTile, `${sample.name} should use its content-aware light carrier.`);
  assert.equal(icon.style.getPropertyValue("--site-icon-tile-dark"), sample.darkTile, `${sample.name} should use its content-aware dark carrier.`);
  if (sample.embeddedCarrierColor) {
    assert.equal(originalSvgEmbeddedCarrierColorForTest(sample.source), sample.embeddedCarrierColor, `${sample.name} should inherit its own rounded SVG carrier.`);
  } else if (sample.renderMode === "original") {
    assertPaletteCarrierSeparatedForTest(sample.source, sample.brandColor, sample.lightTile, "light", `${sample.name} light carrier`);
    assertPaletteCarrierSeparatedForTest(sample.source, sample.brandColor, sample.darkTile, "dark", `${sample.name} dark carrier`);
  }
  testTheme = "dark";
  refreshAdaptiveSiteIconsForTest([icon]);
  assert.equal(icon.src, sample.source, `${sample.name} should preserve original artwork after theme switch.`);
  testTheme = "light";
});

{
  const icon = new TestIcon();
  testTheme = "light";
  applySiteIconForTest(icon, { url: "https://www.mgtv.com/", icon: "" });
  assert.equal(icon.src, "icons/sites/mgtv.svg", "Mango TV should preserve its two-color local artwork in light mode.");
  assert.equal(icon.style.getPropertyValue("--site-icon-tile-light"), "#ffffff", "Mango TV should use the paper app-icon carrier in light mode.");
  assert.equal(icon.style.getPropertyValue("--site-icon-tile-dark"), "#ffffff", "Mango TV should use the paper app-icon carrier in dark mode.");
  assertPaletteCarrierSeparatedForTest("icons/sites/mgtv.svg", "#f86f11", "#ffffff", "light", "Mango TV light carrier");
  assertPaletteCarrierSeparatedForTest("icons/sites/mgtv.svg", "#f86f11", "#ffffff", "dark", "Mango TV dark carrier");
  testTheme = "dark";
  refreshAdaptiveSiteIconsForTest([icon]);
  assert.equal(icon.src, "icons/sites/mgtv.svg", "Mango TV should remain original artwork after a theme switch.");
  testTheme = "light";
}

{
  const openAiRemoteFallbackSvg = svgTextDataUrl(prepareRemoteBrandSvgForTest(currentColorSvg, {
    brandColor: remoteBrandSvgBrandColor(currentColorSvg, {
      siteKey: "openai.com",
      allowSiteKeyColorFallback: false
    }),
    qualityScore: 95
  }));
  const icon = new TestIcon();
  testTheme = "light";
  applySiteIconForTest(icon, { url: "https://openai.com/", icon: "" });
  assert.equal(siteIconBrandColorForTest("openai.com", "icons/sites/chatgpt.svg"), "#000000", "OpenAI/ChatGPT keeps the local implicit-black logo over the purple VI table.");
  assert.equal(applyRemoteBrandColorToLocalIconForTest(icon, { url: "https://openai.com/" }, "icons/sites/chatgpt.svg", openAiRemoteFallbackSvg), false, "Remote provider fallback without an expressive default color must not recolor a local black logo.");
  assertIconRenderStrategy(icon, {
    lightTile: "#000000",
    darkTile: "#f8fafc",
    lightGlyph: "#ffffff",
    darkGlyph: "#000000"
  }, "OpenAI local implicit-black SVG after remote fallback probe");
}

{
  const tripRemoteDefaultSvg = tripdotcomSvgSource.replace("<svg ", '<svg fill="#287DFA" ');
  const remoteDataUrl = svgTextDataUrl(prepareRemoteBrandSvgForTest(tripRemoteDefaultSvg, { brandColor: "#287dfa", qualityScore: 100 }));
  const providerCalls = [];
  const icon = new TestIcon();
  testTheme = "light";
  applySiteIconForTest(icon, { url: "https://trip.com/", icon: "" });
  assert.equal(icon.dataset.iconSource, "icons/sites/tripdotcom.svg", "Trip.com starts from the deployed local SVG.");
  assert.equal(icon.dataset.remoteBrandRefreshEligible, "true", "Trip.com local SVG with no VI color should still refresh the remote provider.");
  assert.equal(discoverRemoteBrandIconDataUrlForTest("https://trip.com/", (siteKey) => {
    providerCalls.push(siteKey);
    return remoteDataUrl;
  }), remoteDataUrl, "Trip.com remote provider may supplement VI color even though a local SVG exists.");
  assert.deepEqual(providerCalls, ["trip.com"], "Trip.com provider refresh stays scoped to its site key.");
  assert.equal(applyRemoteBrandColorToLocalIconForTest(icon, { url: "https://trip.com/" }, "icons/sites/tripdotcom.svg", remoteDataUrl), true, "Trip.com remote default SVG color should hydrate the local icon strategy.");
  assert.equal(icon.dataset.iconSource, "icons/sites/tripdotcom.svg", "Trip.com keeps the local SVG as the render source after remote VI hydration.");
  assertIconRenderStrategy(icon, {
    lightTile: "#287dfa",
    darkTile: "#f8fafc",
    lightGlyph: "#ffffff",
    darkGlyph: "#287dfa"
  }, "Trip.com local SVG with cloud VI color");
}

[
  {
    name: "Dailymotion",
    url: "https://www.dailymotion.com/",
    source: "icons/sites/dailymotion.svg",
    color: "#0a0a0a"
  },
  {
    name: "Epic Games",
    url: "https://store.epicgames.com/",
    source: "icons/sites/epicgames.svg",
    color: "#313131"
  },
  {
    name: "Roblox",
    url: "https://www.roblox.com/",
    source: "icons/sites/roblox.svg",
    color: "#000000"
  },
  {
    name: "Wikipedia",
    url: "https://www.wikipedia.org/",
    source: "icons/sites/wikipedia.svg",
    color: "#000000"
  },
  {
    name: "Medium",
    url: "https://medium.com/",
    source: "icons/sites/medium.svg",
    color: "#000000"
  }
].forEach((sample) => {
  const icon = new TestIcon();
  testTheme = "light";
  assert.equal(localSiteIconBrandColorForTest(sample.source), sample.color, `${sample.name} should recover its monochrome dark SVG color.`);
  applySiteIconForTest(icon, { url: sample.url, icon: "" });
  assert.equal(icon.dataset.iconSource, sample.source, `${sample.name} keeps the deployed local SVG source.`);
  assertIconRenderStrategy(icon, {
    lightTile: sample.color,
    darkTile: "#f8fafc",
    lightGlyph: "#ffffff",
    darkGlyph: sample.color
  }, `${sample.name} monochrome SVG rendering`);
});

[
  {
    name: "WhatsApp",
    url: "https://www.whatsapp.com/",
    source: "icons/sites/whatsapp.svg",
    color: "#25d366",
    darkGlyph: "#20a854"
  },
  {
    name: "WeChat",
    url: "https://wechat.com/",
    source: "icons/sites/wechat.svg",
    color: "#07c160",
    darkGlyph: "#08ae57"
  },
  {
    name: "Spotify",
    url: "https://spotify.com/",
    source: "icons/sites/spotify.svg",
    color: "#1ed760",
    darkGlyph: "#1bab4f"
  }
].forEach((sample) => {
  const icon = new TestIcon();
  testTheme = "light";
  assert.equal(localSiteIconBrandColorForTest(sample.source), sample.color, `${sample.name} should recover its bright local VI color.`);
  assert.equal(localSiteIconRenderModeForTest(sample.source), "mask", `${sample.name} should classify as a monochrome mask without a site whitelist.`);
  applySiteIconForTest(icon, { url: sample.url, icon: "" });
  assertIconRenderStrategy(icon, {
    lightTile: brandIconLightCarrierColorForTest(sample.color),
    darkTile: "#f8fafc",
    lightGlyph: "#ffffff",
    darkGlyph: sample.darkGlyph
  }, `${sample.name} bright monochrome SVG rendering`);
  assert.notEqual(sample.darkGlyph, "#102019", `${sample.name} dark glyph should retain its brand hue.`);
});

[
  {
    name: "Netflix",
    url: "https://www.netflix.com/",
    lightTile: "#e50914",
    darkGlyph: "#e50914"
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/",
    lightTile: "#ff0000",
    darkGlyph: "#ff0000"
  }
].forEach((sample) => {
  const icon = new TestIcon();
  testTheme = "light";
  applySiteIconForTest(icon, { url: sample.url, icon: "" });
  assert.equal(icon.classList.contains("site-icon-local"), true, `${sample.name} keeps the deployed local SVG path.`);
  assertIconRenderStrategy(icon, {
    lightTile: sample.lightTile,
    darkTile: "#f8fafc",
    lightGlyph: "#ffffff",
    darkGlyph: sample.darkGlyph
  }, `${sample.name} local SVG VI rendering`);
});

{
  const icon = new TestIcon();
  testTheme = "light";
  applySiteIconForTest(icon, { url: "https://www.baidu.com/", icon: "" });
  assert.equal(icon.dataset.iconSource, "icons/sites/baidu.svg", "Monochrome local SVGs keep local priority.");
  assertIconRenderStrategy(icon, {
    lightTile: "#2932e1",
    darkTile: "#f8fafc",
    lightGlyph: "#ffffff",
    darkGlyph: "#2932e1"
  }, "Monochrome local SVG");
}

{
  const remoteSvg = svgTextDataUrl(prepareRemoteBrandSvgForTest('<svg viewBox="0 0 24 24"><path fill="#006bff" d="M0 0h24v24H0z"/></svg>', { brandColor: "#006bff", qualityScore: 100 }));
  const icon = new TestIcon();
  testTheme = "light";
  applySiteIconForTest(icon, { url: "https://calendly.com/", icon: remoteSvg });
  assert.equal(icon.dataset.iconSource, remoteSvg, "Monochrome remote SVGs use the same render entry as local SVGs.");
  assertIconRenderStrategy(icon, {
    lightTile: "#006bff",
    darkTile: "#f8fafc",
    lightGlyph: "#ffffff",
    darkGlyph: "#006bff"
  }, "Monochrome remote SVG");
}

{
  const brandColor = remoteBrandSvgBrandColor(currentColorSvg, { siteKey: "raycast.com" });
  const remoteSvg = svgTextDataUrl(prepareRemoteBrandSvgForTest(currentColorSvg, { brandColor, qualityScore: 95 }));
  const icon = new TestIcon();
  testTheme = "light";
  applySiteIconForTest(icon, { url: "https://raycast.com/", icon: remoteSvg });
  assertIconRenderStrategy(icon, {
    lightTile: "#ff6363",
    darkTile: "#f8fafc",
    lightGlyph: "#ffffff",
    darkGlyph: "#ff6363"
  }, "currentColor remote SVG with known VI color");
}

{
  const icon = new TestIcon();
  const remoteDataUrl = svgTextDataUrl(prepareRemoteBrandSvgForTest(multicolorSvg, { brandColor: "#4285f4", qualityScore: 84 }));
  testTheme = "light";
  applySiteIconForTest(icon, { url: "https://example-cloud-multicolor.test/", icon: remoteDataUrl });
  assert.equal(icon.src, remoteDataUrl, "Multicolor remote SVGs preserve original artwork.");
  assert.equal(icon.style.getPropertyValue("--site-icon-tile-light"), "#ffffff", "Multicolor remote SVGs use the paper light carrier.");
  assert.equal(icon.style.getPropertyValue("--site-icon-tile-dark"), "#ffffff", "Multicolor remote SVGs use the paper dark carrier.");
  assertPaletteCarrierSeparatedForTest(remoteDataUrl, "#4285f4", "#ffffff", "light", "Remote multicolor light carrier");
  assertPaletteCarrierSeparatedForTest(remoteDataUrl, "#4285f4", "#ffffff", "dark", "Remote multicolor dark carrier");
  testTheme = "dark";
  refreshAdaptiveSiteIconsForTest([icon]);
  assert.equal(icon.src, remoteDataUrl, "Multicolor remote SVGs stay original after dark refresh.");
  testTheme = "light";
}

{
  const remoteSvg = svgTextDataUrl(prepareRemoteBrandSvgForTest('<svg viewBox="0 0 24 24"><path fill="#ffcc00" d="M0 0h24v24H0z"/></svg>', { brandColor: "#ffcc00", qualityScore: 100 }));
  const icon = new TestIcon();
  testTheme = "light";
  applySiteIconForTest(icon, { url: "https://yellow-low-contrast.example/", icon: remoteSvg });
  assertIconRenderStrategy(icon, {
    lightTile: brandIconLightCarrierColorForTest("#ffcc00"),
    darkTile: "#f8fafc",
    lightGlyph: "#ffffff",
    darkGlyph: "#b39508"
  }, "Low-contrast brand color");
}

{
  const icon = new TestIcon();
  const unknownBrandColor = remoteBrandSvgBrandColor(currentColorSvg, { siteKey: "unknown.example" });
  testTheme = "light";
  applySiteIconForTest(icon, { url: "https://unknown.example/", icon: "" });
  assert.equal(unknownBrandColor, "", "Unknown sites must not guess VI color for currentColor SVGs.");
  assert.equal(icon.dataset.iconTile, "plain", "Unknown sites without a trusted brand color stay on fallback tile logic.");
  assert.equal(icon.dataset.iconSource, undefined, "Unknown sites without an icon do not synthesize a brand source.");
}

assert.deepEqual(
  remoteBrandSvgDescriptor(simpleSvg, { brandColor: "#1db954", qualityScore: 92 }),
  {
    brandColor: "#1db954",
    isMonochrome: true,
    renderMode: "mask",
    visibleColors: ["#1db954"],
    embeddedCarrierColor: "",
    qualityScore: 92
  },
  "Cloud maskable descriptors should cache source metadata only."
);
assert.deepEqual(
  remoteBrandSvgDescriptor(currentColorSvg, { brandColor: "#00a1d6", qualityScore: 95 }),
  {
    brandColor: "#00a1d6",
    isMonochrome: true,
    renderMode: "mask",
    visibleColors: [],
    embeddedCarrierColor: "",
    qualityScore: 95
  },
  "Cloud maskable descriptors should not duplicate display tile/glyph decisions."
);
assert.deepEqual(
  remoteBrandSvgDescriptor(multicolorSvg, { brandColor: "#4285f4", qualityScore: 84 }),
  {
    brandColor: "#4285f4",
    isMonochrome: false,
    renderMode: "original",
    visibleColors: ["#4285f4", "#ea4335"],
    embeddedCarrierColor: "",
    qualityScore: 84
  },
  "Google-like cloud multicolor descriptors should remain source metadata only."
);
{
  const remoteDataUrl = svgTextDataUrl(prepareRemoteBrandSvgForTest(multicolorSvg, { brandColor: "#4285f4", qualityScore: 84 }));
  const icon = new TestIcon();
  testTheme = "light";
  applySiteIconForTest(icon, { url: "https://example-cloud-multicolor.test/", icon: remoteDataUrl });
  assert.equal(icon.style.getPropertyValue("--site-icon-tile-light"), "#ffffff", "Remote multicolor descriptors use the paper day carrier.");
  assert.equal(icon.style.getPropertyValue("--site-icon-tile-dark"), "#ffffff", "Remote multicolor descriptors use the paper night carrier.");
  assertPaletteCarrierSeparatedForTest(remoteDataUrl, "#4285f4", "#ffffff", "light", "Remote descriptor multicolor light carrier");
  assertPaletteCarrierSeparatedForTest(remoteDataUrl, "#4285f4", "#ffffff", "dark", "Remote descriptor multicolor dark carrier");
  assert.equal(icon.src, remoteDataUrl, "Remote multicolor descriptors preserve original artwork like local multicolor SVGs.");
}
{
  const roundedCarrierSvg = '<svg viewBox="0 0 24 24"><rect width="24" height="24" rx="5" ry="5" fill="#f40009"/><path fill="#fff" d="M4 4h16v16H4z"/></svg>';
  const remoteDataUrl = svgTextDataUrl(prepareRemoteBrandSvgForTest(roundedCarrierSvg, { brandColor: "#f40009", qualityScore: 91 }));
  const icon = new TestIcon();
  assert.equal(
    remoteBrandSvgDescriptorFromSource(remoteDataUrl).embeddedCarrierColor,
    "#f40009",
    "Remote rounded multicolor SVG metadata should round-trip the embedded carrier color."
  );
  testTheme = "light";
  applySiteIconForTest(icon, { url: "https://example-cloud-rounded.test/", icon: remoteDataUrl });
  assert.equal(icon.style.getPropertyValue("--site-icon-tile-light"), "#f40009", "Remote rounded multicolor SVGs should inherit their own light carrier.");
  assert.equal(icon.style.getPropertyValue("--site-icon-tile-dark"), "#f40009", "Remote rounded multicolor SVGs should inherit their own dark carrier.");
}
assert.deepEqual(
  remoteBrandSvgDescriptor('<svg viewBox="0 0 24 24"><linearGradient id="g"><stop stop-color="#4a154b"/><stop stop-color="rgb(0,128,255)"/></linearGradient><path fill="url(#g)" d="M0 0h24v24H0z"/></svg>', { brandColor: "#4a154b", qualityScore: 82 }),
  {
    brandColor: "#4a154b",
    isMonochrome: false,
    renderMode: "gradient",
    visibleColors: ["#4a154b", "#0080ff"],
    embeddedCarrierColor: "",
    qualityScore: 82
  },
  "Slack/Figma-like gradient descriptors should use gradient-render metadata."
);
{
  const steamGradientSvg = '<svg viewBox="0 0 65 65" fill="#fff"><defs><linearGradient id="A"><stop stop-color="#111d2e"/><stop stop-color="#1387b8"/></linearGradient></defs><path fill="url(#A)" d="M0 0h65v65H0z"/><path d="M4 4h12v12H4z"/></svg>';
  const remoteDataUrl = svgTextDataUrl(prepareRemoteBrandSvgForTest(steamGradientSvg, { brandColor: "", qualityScore: 88 }));
  const icon = new TestIcon();
  testTheme = "light";
  assert.deepEqual(remoteBrandSvgDescriptor(steamGradientSvg, { brandColor: "", qualityScore: 88 }), {
    brandColor: "",
    isMonochrome: false,
    renderMode: "gradient",
    visibleColors: ["#ffffff", "#111d2e", "#1387b8"],
    embeddedCarrierColor: "",
    qualityScore: 88
  }, "Steam-like gradient provider SVGs should classify as gradient without a brand color.");
  applySiteIconForTest(icon, { url: "https://store.steampowered.com/", icon: remoteDataUrl });
  assert.equal(icon.style.getPropertyValue("--site-icon-tile-light"), "#ffffff", "Steam-like gradient cloud SVGs use the palette-aware light carrier without a manual siteKey list.");
  assert.equal(icon.style.getPropertyValue("--site-icon-tile-dark"), "#ffffff", "Steam-like gradient cloud SVGs use the palette-aware dark carrier without a manual siteKey list.");
  assert.equal(icon.src, remoteDataUrl, "Steam-like gradient cloud SVGs preserve original artwork.");
}
const preparedRemoteSvg = prepareRemoteBrandSvgForTest(simpleSvg, { brandColor: "#1db954", qualityScore: 92 });
const preparedRemoteDataUrl = svgTextDataUrl(preparedRemoteSvg);
assert.deepEqual(
  remoteBrandSvgDescriptorFromSource(preparedRemoteDataUrl),
  {
    brandColor: "#1db954",
    isMonochrome: true,
    renderMode: "mask",
    visibleColors: ["#1db954"],
    embeddedCarrierColor: "",
    qualityScore: 92
  },
  "Cached cloud SVG data URLs should round-trip source metadata only."
);
assert.deepEqual(
  remoteBrandSvgCacheStrategy(preparedRemoteDataUrl),
  {
    kind: "remote-brand-svg",
    brandColor: "#1db954",
    renderMode: "mask",
    isMonochrome: true,
    visibleColors: ["#1db954"],
    embeddedCarrierColor: "",
    qualityScore: 92
  },
  "Cached cloud SVG strategy must not store a separate display tile/glyph algorithm."
);

console.log("icon strategy fixtures passed");
