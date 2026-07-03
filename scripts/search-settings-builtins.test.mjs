import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../newtab.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../newtab.css", import.meta.url), "utf8");
const siteIconIndex = JSON.parse(readFileSync(new URL("../icons/sites/index.json", import.meta.url), "utf8"));
const zhihuSettingsSvg = readFileSync(new URL("../icons/sites/zhihu.svg", import.meta.url), "utf8");

assert.match(
  html,
  /<section class="settings-group settings-platform-search-group" aria-labelledby="searchSettingsPlatformTitle">[\s\S]*id="platformSearchSettingsList"[\s\S]*Sign in first where required\./,
  "Search settings should include a built-in platform search module with English baseline first-login guidance."
);

assert.match(
  source,
  /searchSettingsAiHint:\s*"触发词用空格或逗号分隔，例如 \/gpt \/chatgpt。需要登录的平台请先完成首次登录再使用。"/,
  "Chinese AI settings copy should explicitly tell users to finish first login on required platforms."
);

assert.match(
  source,
  /searchSettingsAiHint:\s*"Separate triggers with spaces or commas, for example \/gpt \/chatgpt\. Sign in to platforms that require login before first use\."/,
  "English AI settings copy should explicitly tell users to sign in before first use when required."
);

assert.match(
  source,
  /aiEngineSettingsList\.replaceChildren\(\.\.\.editableAiSearchEngines\(\)\.map\(createAiEngineSettingsCard\)\);/,
  "AI engine settings should render from the editable built-in AI engine list."
);

assert.match(
  source,
  /platformSearchSettingsList\?\.replaceChildren\(\.\.\.platformSearchTargets\(\)\.map\(createPlatformSearchSettingsCard\)\);/,
  "Platform search settings should render all built-in platform targets."
);

assert.match(
  source,
  /\(engine\.id === "kimi" \|\| engine\.id === "zhihu"\)[\s\S]*`\$\{WayleafIcon\.siteIconDirectory\}\/\$\{engine\.id\}\.svg`/,
  "Kimi and Zhihu settings cards should use their shared local site SVGs directly."
);

assert.ok(siteIconIndex.includes("zhihu.svg"), "The outer Wayleaf icon flow should share the Zhihu SVG.");
assert.match(zhihuSettingsSvg, /<svg\b[^>]*fill=["']#0084FF["']/i, "The shared Zhihu SVG should preserve its original blue logo color.");

assert.match(
  css,
  /\.settings-engine-icon\s*\{[\s\S]*box-sizing:\s*border-box;[\s\S]*border:\s*1px solid rgb\(20 27 24 \/ 0\.1\);/,
  "Settings AI engine icons should keep one visible outer shell stroke."
);

assert.doesNotMatch(
  css,
  /\.settings-engine-icon\[data-engine-icon="[^"]+"\][\s\S]*(?:border|box-shadow):/,
  "Individual settings AI engine icons must not override the shared shell stroke."
);

assert.match(
  css,
  /\.ai-engine-pill img\[data-engine-icon="doubao"\]\[data-explicit-ai-icon="true"\]\s*\{[\s\S]*padding:\s*0;[\s\S]*object-fit:\s*cover;/,
  "Doubao active AI icon should keep its original full-bleed PNG crop."
);

assert.match(
  css,
  /\.settings-engine-icon-image\[data-engine-icon="doubao"\]\[data-explicit-ai-icon="true"\]\s*\{[\s\S]*width:\s*100%;[\s\S]*height:\s*100%;[\s\S]*object-fit:\s*cover;/,
  "Doubao settings AI icon should keep its original full-bleed PNG crop."
);

[
  ["doubao", /doubao:\s*\{\s*mode:\s*"original",\s*tile:\s*"#ffffff"\s*\}/],
  ["instagram", /instagram:\s*\{\s*mode:\s*"original",\s*tile:\s*"#ffffff"\s*\}/],
  ["douyin", /douyin:\s*\{\s*mode:\s*"original",\s*tile:\s*"#ffffff"\s*\}/],
  ["gemini", /gemini:\s*\{\s*mode:\s*"original",\s*tile:\s*"#ffffff"\s*\}/],
  ["glm", /glm:\s*\{\s*mode:\s*"mask",\s*tile:\s*"#ffffff",\s*glyph:\s*"#3859ff"\s*\}/],
  ["jimeng", /jimeng:\s*\{\s*mode:\s*"original",\s*tile:\s*"#000000"\s*\}/],
  ["kimi", /kimi:\s*\{\s*mode:\s*"original",\s*tile:\s*"#000000"\s*\}/],
  ["qwen", /qwen:\s*\{\s*mode:\s*"original",\s*tile:\s*"#ffffff"\s*\}/],
  ["xiaohongshu", /xiaohongshu:\s*\{\s*mode:\s*"mask",\s*tile:\s*"#ff2442",\s*glyph:\s*"#ffffff"\s*\}/],
  ["zhihu", /zhihu:\s*\{\s*mode:\s*"original",\s*tile:\s*"#ffffff"\s*\}/]
].forEach(([engineId, pattern]) => {
  assert.match(source, pattern, `${engineId} should use the requested settings icon strategy.`);
});

assert.doesNotMatch(
  source,
  /if \(target\.id === "jimeng"\) \{\s*applyIconTile\(icon, "brand"/,
  "Jimeng active AI engine pill should use the shared SVG content strategy, not a hard-coded tile override."
);

[
  "chatgpt",
  "claude",
  "gemini",
  "grok",
  "deepseek",
  "doubao",
  "kimi",
  "glm",
  "qwen",
  "jimeng"
].forEach((engineId) => {
  assert.match(source, new RegExp(`EDITABLE_AI_ENGINE_IDS = \\[[\\s\\S]*"${engineId}"`), `${engineId} should be included in AI settings.`);
});

[
  "searchSettingsPlatformTitle",
  "searchSettingsPlatformDescription",
  "searchSettingsPlatformHint",
  "searchSettingsPlatformPrefix",
  "searchSettingsBuiltInBadge",
  "platformSearchDirectBehavior",
  "platformSearchLoginBehavior",
  "platformSearchFallbackBehavior"
].forEach((messageKey) => {
  assert.match(source, new RegExp(`${messageKey}:`), `${messageKey} should be localized for settings display.`);
});

console.log("search settings built-ins fixtures passed");
