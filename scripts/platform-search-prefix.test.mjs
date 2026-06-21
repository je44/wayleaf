import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../newtab.html", import.meta.url), "utf8");
const styles = readFileSync(new URL("../newtab.css", import.meta.url), "utf8");

const targetsMatch = source.match(/const PLATFORM_SEARCH_TARGETS = Object\.freeze\((\[[\s\S]*?\n\])\);/);
assert.ok(targetsMatch, "Platform search targets should be declared as a testable built-in config.");
const targets = Function(`"use strict"; return (${targetsMatch[1]});`)();
const targetById = Object.fromEntries(targets.map((target) => [target.id, target]));

assert.deepEqual(
  Object.keys(targetById),
  ["youtube", "x", "xiaohongshu", "instagram", "threads", "douyin", "zhihu", "bilibili", "tiktok"],
  "Platform search should cover the requested built-in targets in a stable order."
);

const prefixOwner = new Map();
for (const target of targets) {
  for (const prefix of target.prefixes) {
    assert.equal(prefix, prefix.toLowerCase(), `${target.id} prefixes should be lowercase.`);
    assert.equal(prefix.startsWith("*"), true, `${target.id} prefixes should require an explicit * activator.`);
    assert.equal(prefixOwner.has(prefix), false, `${prefix} should not be shared by multiple platforms.`);
    prefixOwner.set(prefix, target.id);
  }
}

assert.deepEqual(
  Object.fromEntries(targets.map((target) => [target.id, target.prefixes])),
  {
    youtube: ["*yt", "*youtube"],
    x: ["*x", "*twitter"],
    xiaohongshu: ["*xhs", "*rednote"],
    instagram: ["*ig", "*instagram"],
    threads: ["*threads", "*th"],
    douyin: ["*dy", "*douyin"],
    zhihu: ["*zhihu", "*zh"],
    bilibili: ["*bili", "*bilibili"],
    tiktok: ["*tt", "*tiktok"]
  },
  "Every platform abbreviation and full-name activator should start with *."
);

function platformSearchDestination(platform, query) {
  const searchUrl = new URL(platform.searchUrl);
  Object.entries(platform.searchParams || {}).forEach(([key, value]) => {
    searchUrl.searchParams.set(key, value);
  });
  if (platform.pathQuery) {
    const basePath = searchUrl.pathname.replace(/\/?$/, "/");
    searchUrl.pathname = `${basePath}${encodeURIComponent(query)}`;
  } else {
    searchUrl.searchParams.set(platform.queryParam || "q", query);
  }
  return searchUrl.href;
}

function searchPlatformPrefix(value) {
  const match = String(value || "").match(/^(\*[a-z][a-z0-9-]*)(?:\s+|$)(.*)$/i);
  if (!match) {
    return null;
  }
  const prefix = match[1].toLowerCase();
  const remainder = match[2] || "";
  const platform = targets.find((target) => (
    target.prefixes.some((item) => item.toLowerCase() === prefix)
  ));
  if (!platform) {
    return null;
  }
  return {
    platform,
    prefix,
    remainder
  };
}

function platformSearchActivators() {
  return targets.flatMap((platform, platformIndex) => (
    platform.prefixes.map((prefix, prefixIndex) => ({
      platform,
      prefix: prefix.toLowerCase(),
      order: (platformIndex * 10) + prefixIndex
    }))
  ));
}

function platformSearchActivationHint(value) {
  const input = String(value || "").trim().toLowerCase();
  if (!/^\*[a-z][a-z0-9-]*$/.test(input)) {
    return null;
  }
  const matches = platformSearchActivators()
    .filter((item) => item.prefix.startsWith(input))
    .sort((left, right) => (
      left.prefix.length - right.prefix.length || left.order - right.order
    ));
  const match = matches[0];
  if (!match) {
    return null;
  }
  return {
    ...match,
    alternative: match.prefix === input
      ? matches.find((item) => item.platform.id !== match.platform.id) || null
      : null
  };
}

function hasConflictingLongerPlatformActivator(match) {
  return platformSearchActivators().some((item) => (
    item.platform.id !== match.platform.id && item.prefix.startsWith(match.prefix)
  ));
}

function platformActivationDecision(value) {
  const match = searchPlatformPrefix(value);
  if (!match) {
    return "search";
  }
  return !match.remainder && !/\s$/.test(value) && hasConflictingLongerPlatformActivator(match)
    ? "confirm"
    : `activate:${match.platform.id}`;
}

{
  const url = new URL(platformSearchDestination(targetById.youtube, "lofi beats/东京"));
  assert.equal(url.hostname, "www.youtube.com", "YouTube search should stay on YouTube.");
  assert.equal(url.searchParams.get("search_query"), "lofi beats/东京", "YouTube query should round-trip through URLSearchParams.");
  assert.match(url.href, /search_query=lofi\+beats%2F%E4%B8%9C%E4%BA%AC/, "YouTube query should be encoded and preserved.");
}

{
  const url = new URL(platformSearchDestination(targetById.x, "AI agents/工具"));
  assert.equal(url.hostname, "x.com", "X search should stay on x.com.");
  assert.equal(url.searchParams.get("src"), "typed_query", "X search should preserve the typed-query source marker.");
  assert.equal(url.searchParams.get("q"), "AI agents/工具", "X query should round-trip through URLSearchParams.");
}

{
  const url = new URL(platformSearchDestination(targetById.xiaohongshu, "咖啡 店/上海"));
  assert.equal(url.hostname, "www.xiaohongshu.com", "Xiaohongshu search should stay on xiaohongshu.com.");
  assert.equal(url.searchParams.get("keyword"), "咖啡 店/上海", "Xiaohongshu keyword should round-trip through URLSearchParams.");
  assert.equal(url.searchParams.get("source"), "web_explore_feed", "Xiaohongshu search should keep its stable web source parameter.");
}

{
  const destination = platformSearchDestination(targetById.douyin, "猫 咖啡/店");
  const url = new URL(destination);
  assert.equal(url.hostname, "www.douyin.com", "Douyin search should stay on douyin.com.");
  assert.equal(url.searchParams.get("type"), "general", "Douyin search should preserve its general search type.");
  assert.match(destination, /\/search\/%E7%8C%AB%20%E5%92%96%E5%95%A1%2F%E5%BA%97\?/, "Douyin path query should encode spaces, Chinese text, and slashes as one query segment.");
}

{
  const url = new URL(platformSearchDestination(targetById.bilibili, "AI 视频/教程"));
  assert.equal(url.hostname, "search.bilibili.com", "Bilibili search should stay on search.bilibili.com.");
  assert.equal(url.searchParams.get("keyword"), "AI 视频/教程", "Bilibili keyword should round-trip through URLSearchParams.");
}

{
  const url = new URL(platformSearchDestination(targetById.tiktok, "AI video/tutorial"));
  assert.equal(url.hostname, "www.tiktok.com", "TikTok search should stay on tiktok.com.");
  assert.equal(url.pathname, "/search", "TikTok search should use the web search route.");
  assert.equal(url.searchParams.get("q"), "AI video/tutorial", "TikTok query should round-trip through URLSearchParams.");
}

assert.equal(targetById.instagram.fallback, true, "Instagram should be marked as a testable web-search fallback.");
assert.equal(targetById.threads.fallback, true, "Threads should be marked as a testable web-search fallback.");
assert.equal(searchPlatformPrefix("*yt").platform.id, "youtube", "A complete starred abbreviation should activate immediately without a query.");
assert.equal(searchPlatformPrefix("*youtube").platform.id, "youtube", "A complete starred platform name should activate immediately without a query.");
assert.equal(searchPlatformPrefix("*x ").platform.id, "x", "A starred activator may still include trailing space without requiring query text.");
assert.equal(searchPlatformPrefix("x design"), null, "Ordinary searches starting with a platform abbreviation should stay ordinary.");
assert.equal(searchPlatformPrefix("youtube reviews"), null, "Ordinary searches starting with a platform full name should stay ordinary.");
assert.equal(searchPlatformPrefix("x hs 咖啡"), null, "The removed split phrase-and-space syntax should not activate platform search.");
assert.equal(searchPlatformPrefix("*x design").platform.id, "x", "A starred short activator should select X.");
assert.equal(searchPlatformPrefix("*xhs 咖啡").platform.id, "xiaohongshu", "A starred xhs activator should select Xiaohongshu.");
assert.equal(searchPlatformPrefix("*youtube lofi").platform.id, "youtube", "A starred full-name activator should select YouTube.");
assert.equal(searchPlatformPrefix("*th readers").platform.id, "threads", "A starred alias should select Threads.");
assert.equal(searchPlatformPrefix("*zh 知识").platform.id, "zhihu", "A starred alias should select Zhihu.");
assert.equal(searchPlatformPrefix("*bili AI").platform.id, "bilibili", "A starred short activator should select Bilibili.");
assert.equal(searchPlatformPrefix("*jm 生成视频"), null, "Jimeng should remain an AI engine command, not a platform activator.");
assert.equal(searchPlatformPrefix("*tt edits").platform.id, "tiktok", "A starred short activator should select TikTok.");
assert.deepEqual(
  { prefix: platformSearchActivationHint("*y").prefix, platform: platformSearchActivationHint("*y").platform.id },
  { prefix: "*yt", platform: "youtube" },
  "A first-letter hint should suggest the shortest matching platform activator."
);
assert.deepEqual(
  { prefix: platformSearchActivationHint("*ti").prefix, platform: platformSearchActivationHint("*ti").platform.id },
  { prefix: "*tiktok", platform: "tiktok" },
  "A second-letter hint should narrow to the matching platform."
);
assert.deepEqual(
  { prefix: platformSearchActivationHint("*t").prefix, platform: platformSearchActivationHint("*t").platform.id },
  { prefix: "*th", platform: "threads" },
  "Ambiguous hints should prefer the shortest activator and stable platform order."
);
assert.deepEqual(
  {
    prefix: platformSearchActivationHint("*x").prefix,
    platform: platformSearchActivationHint("*x").platform.id,
    alternativePrefix: platformSearchActivationHint("*x").alternative.prefix,
    alternativePlatform: platformSearchActivationHint("*x").alternative.platform.id
  },
  { prefix: "*x", platform: "x", alternativePrefix: "*xhs", alternativePlatform: "xiaohongshu" },
  "The *x hint should expose Xiaohongshu as the longer conflicting platform activator."
);
assert.equal(hasConflictingLongerPlatformActivator(searchPlatformPrefix("*x")), true, "*x should wait because *xhs belongs to a different platform.");
assert.equal(hasConflictingLongerPlatformActivator(searchPlatformPrefix("*th")), false, "Same-platform *th/*threads aliases should not delay activation.");
assert.equal(platformActivationDecision("*x"), "confirm", "*x should require an explicit commit because *xhs is still a valid continuation.");
assert.equal(platformActivationDecision("*xh"), "search", "An incomplete *xhs activator should not enter X mode.");
assert.equal(platformActivationDecision("*xhs"), "activate:xiaohongshu", "The complete *xhs activator should enter Xiaohongshu mode.");
assert.equal(platformActivationDecision("*x "), "activate:x", "A trailing space should explicitly commit the complete *x activator.");
assert.equal(platformSearchActivationHint("query"), null, "Ordinary search text should not show a platform activator hint.");
assert.match(source, /function searchPlatformPrefix\(value\) \{[\s\S]*\\\*\[a-z\][\s\S]*\(\?:\\s\+\|\$\)\(\.\*\)\$/, "Platform parsing should allow a complete starred activator with no space or query.");
assert.doesNotMatch(source, /PLATFORM_CONFLICT_ACTIVATION_DELAY_MS|platformActivationTimer/, "Cross-platform prefix collisions should not activate on a timer.");
assert.match(source, /handleQuickSearchInputKeydown[\s\S]*searchPlatformPrefix\(quickSearchInput\.value\)[\s\S]*activatePlatformSearchMatch\(platformMatch\)/, "Enter should explicitly commit a complete ambiguous platform activator.");
assert.match(source, /!\s*\/\\s\$\/\.test\(platformInput\)[\s\S]*hasConflictingLongerPlatformActivator\(platformMatch\)/, "A trailing space should commit the short starred activator instead of waiting for longer alternatives.");
assert.match(source, /function hasConflictingLongerPlatformActivator\(match\) \{[\s\S]*item\.platform\.id !== match\.platform\.id[\s\S]*item\.prefix\.startsWith\(match\.prefix\)/, "Only activators owned by a different platform should delay the short activator.");
assert.doesNotMatch(source, /splitLongPlatformPrefix|isPartialSplitPlatformPrefix/, "Removed phrase-and-space compatibility parsing should not remain in production code.");
assert.match(source, /function submitLocalQuickSearch\(query\) \{[\s\S]*platformSearchTargetById\(activePlatformSearchTarget\)[\s\S]*submitPlatformQuickSearch\(platform, query\);/, "Active platform mode should take precedence over regular local search submission.");
assert.match(source, /function createSearchEngineSuggestion\(query\) \{[\s\S]*selectedPlatformId: platform\.id/, "Search suggestions should carry the active platform target.");
assert.match(html, /id="platformSearchSettingsList"/, "Search settings should render the built-in platform search module.");
assert.match(html, /id="platformActivationHint"[^>]+role="status"[^>]+aria-live="polite"/, "The inline platform activator hint should be exposed as a polite live status.");
assert.match(styles, /\.platform-activation-hint\s*\{[\s\S]*max-width:\s*min\(220px, 42%\);[\s\S]*text-overflow:\s*ellipsis;/, "The trial hint should stay compact in the search box's right edge.");
assert.match(source, /function renderPlatformActivationHint\(value\) \{[\s\S]*quickSearchPlatformActivationHint[\s\S]*platformActivationHint\.hidden = false;/, "The partial activator hint should name the completion and target platform.");
assert.match(source, /match\.alternative[\s\S]*match\.prefix[\s\S]*match\.alternative\.prefix/, "The *x conflict hint should display both platform choices while activation is pending.");

console.log("platform search prefix fixtures passed");
