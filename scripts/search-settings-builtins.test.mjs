import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../newtab.html", import.meta.url), "utf8");

assert.match(
  html,
  /<section class="settings-group settings-platform-search-group" aria-labelledby="searchSettingsPlatformTitle">[\s\S]*id="platformSearchSettingsList"[\s\S]*需要登录的平台请先完成首次登录再使用。/,
  "Search settings should include a built-in platform search module with first-login guidance."
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

[
  ["doubao", /doubao:\s*\{\s*mode:\s*"original",\s*tile:\s*"#ffffff"\s*\}/],
  ["instagram", /instagram:\s*\{\s*mode:\s*"original",\s*tile:\s*"#ffffff"\s*\}/],
  ["douyin", /douyin:\s*\{\s*mode:\s*"original",\s*tile:\s*"#ffffff"\s*\}/],
  ["gemini", /gemini:\s*\{\s*mode:\s*"original",\s*tile:\s*"#ffffff"\s*\}/],
  ["glm", /glm:\s*\{\s*mode:\s*"mask",\s*tile:\s*"#ffffff",\s*glyph:\s*"#3859ff"\s*\}/],
  ["jimeng", /jimeng:\s*\{\s*mode:\s*"original",\s*tile:\s*"#000000"\s*\}/],
  ["xiaohongshu", /xiaohongshu:\s*\{\s*mode:\s*"mask",\s*tile:\s*"#ff2442",\s*glyph:\s*"#ffffff"\s*\}/],
  ["zhihu", /zhihu:\s*\{\s*mode:\s*"mask",\s*tile:\s*"#0084ff",\s*glyph:\s*"#ffffff"\s*\}/]
].forEach(([engineId, pattern]) => {
  assert.match(source, pattern, `${engineId} should use the requested settings icon strategy.`);
});

assert.match(
  source,
  /if \(target\.id === "jimeng"\) \{\s*applyIconTile\(icon, "brand", \{ light: "#000000", dark: "#000000" \}, true\);\s*\}/,
  "Jimeng should use a black tile in the active AI engine pill."
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
