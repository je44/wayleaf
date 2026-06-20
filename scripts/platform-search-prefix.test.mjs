import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../newtab.html", import.meta.url), "utf8");

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
    assert.equal(prefixOwner.has(prefix), false, `${prefix} should not be shared by multiple platforms.`);
    prefixOwner.set(prefix, target.id);
  }
}

assert.equal(prefixOwner.get("yt"), "youtube", "yt should activate YouTube search.");
assert.equal(prefixOwner.get("x"), "x", "x should activate X search.");
assert.equal(prefixOwner.get("xhs"), "xiaohongshu", "xhs should activate Xiaohongshu search.");
assert.equal(prefixOwner.get("ig"), "instagram", "ig should activate Instagram search.");
assert.equal(prefixOwner.get("threads"), "threads", "threads should activate Threads search.");
assert.equal(prefixOwner.get("dy"), "douyin", "dy should activate Douyin search.");
assert.equal(prefixOwner.get("zhihu"), "zhihu", "zhihu should activate Zhihu search.");
assert.equal(prefixOwner.get("bili"), "bilibili", "bili should activate Bilibili search.");
assert.equal(prefixOwner.get("tt"), "tiktok", "tt should activate TikTok search.");

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

function platformSearchPrefixes() {
  return targets.flatMap((target) => (
    target.prefixes.map((prefix) => ({
      platform: target,
      prefix: prefix.toLowerCase()
    }))
  ));
}

function splitLongPlatformPrefix(prefix, remainder, currentPlatform = null) {
  const firstTokenMatch = String(remainder || "").match(/^([a-z0-9-]+)(?:\s+(\S.*))?$/i);
  if (!firstTokenMatch) {
    return null;
  }
  const combinedPrefix = `${prefix}${firstTokenMatch[1].toLowerCase()}`;
  const match = platformSearchPrefixes().find((item) => (
    item.prefix.length > prefix.length
      && item.prefix === combinedPrefix
      && item.platform.id !== currentPlatform?.id
  ));
  if (!match || typeof firstTokenMatch[2] === "undefined") {
    return null;
  }
  return {
    platform: match.platform,
    prefix: match.prefix,
    remainder: firstTokenMatch[2] || ""
  };
}

function isPartialSplitPlatformPrefix(prefix, remainder, currentPlatform = null) {
  const firstTokenMatch = String(remainder || "").match(/^([a-z0-9-]+)$/i);
  if (!firstTokenMatch) {
    return false;
  }
  const combinedPrefix = `${prefix}${firstTokenMatch[1].toLowerCase()}`;
  return platformSearchPrefixes().some((item) => (
    item.prefix.length > prefix.length
    && item.platform.id !== currentPlatform?.id
    && item.prefix.startsWith(combinedPrefix)
  ));
}

function searchPlatformPrefix(value) {
  const match = String(value || "").match(/^([a-z][a-z0-9-]*)\s+(\S.*)$/i);
  if (!match) {
    return null;
  }
  const prefix = match[1].toLowerCase();
  const remainder = match[2] || "";
  const platform = targets.find((target) => (
    target.prefixes.some((item) => item.toLowerCase() === prefix)
  ));
  const splitPrefixMatch = splitLongPlatformPrefix(prefix, remainder, platform);
  if (splitPrefixMatch) {
    return splitPrefixMatch;
  }
  if (isPartialSplitPlatformPrefix(prefix, remainder, platform)) {
    return null;
  }
  if (!platform) {
    return null;
  }
  return {
    platform,
    prefix,
    remainder
  };
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
assert.equal(searchPlatformPrefix("x "), null, "A bare short prefix and trailing space should not activate without a query.");
assert.equal(searchPlatformPrefix("x h"), null, "Typing the middle of xhs should not prematurely activate X.");
assert.equal(searchPlatformPrefix("x hs"), null, "Typing the split middle of xhs should stay uncommitted until a query exists.");
assert.equal(searchPlatformPrefix("x design").platform.id, "x", "X should still activate when the query is not a split xhs prefix.");
assert.equal(searchPlatformPrefix("xhs 咖啡").platform.id, "xiaohongshu", "Complete xhs prefix should activate Xiaohongshu.");
assert.deepEqual(
  {
    platform: searchPlatformPrefix("x hs 咖啡").platform.id,
    prefix: searchPlatformPrefix("x hs 咖啡").prefix,
    remainder: searchPlatformPrefix("x hs 咖啡").remainder
  },
  { platform: "xiaohongshu", prefix: "xhs", remainder: "咖啡" },
  "A split xhs prefix should recover to Xiaohongshu once the real query begins."
);
assert.equal(searchPlatformPrefix("th readers").platform.id, "threads", "Same-platform th/threads aliases should not be blocked by the split-prefix guard.");
assert.equal(searchPlatformPrefix("zh 知识").platform.id, "zhihu", "Same-platform zh/zhihu aliases should not be blocked by the split-prefix guard.");
assert.equal(searchPlatformPrefix("bili AI").platform.id, "bilibili", "Bilibili should activate from its short prefix.");
assert.equal(searchPlatformPrefix("jm 生成视频"), null, "Jimeng should be handled as an AI engine command, not a platform prefix.");
assert.equal(searchPlatformPrefix("tt edits").platform.id, "tiktok", "TikTok should activate from its short prefix.");
assert.match(source, /function searchPlatformPrefix\(value\) \{[\s\S]*\\s\+\(\\S\.\*\)\$[\s\S]*splitLongPlatformPrefix[\s\S]*isPartialSplitPlatformPrefix/, "Platform prefix parsing should require real query text and guard split-prefix conflicts.");
assert.match(source, /function submitLocalQuickSearch\(query\) \{[\s\S]*platformSearchTargetById\(activePlatformSearchTarget\)[\s\S]*submitPlatformQuickSearch\(platform, query\);/, "Active platform mode should take precedence over regular local search submission.");
assert.match(source, /function createSearchEngineSuggestion\(query\) \{[\s\S]*selectedPlatformId: platform\.id/, "Search suggestions should carry the active platform target.");
assert.match(html, /id="platformSearchSettingsList"/, "Search settings should render the built-in platform search module.");

console.log("platform search prefix fixtures passed");
