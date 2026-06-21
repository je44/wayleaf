import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const newtabSource = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");
const submitSource = readFileSync(new URL("../ai-submit.js", import.meta.url), "utf8");
const backgroundSource = readFileSync(new URL("../background.js", import.meta.url), "utf8");
const manifest = JSON.parse(readFileSync(new URL("../manifest.json", import.meta.url), "utf8"));

function searchAiCommand(value) {
  const match = String(value || "").match(/^\/([a-z][a-z0-9-]*)(?:\s+|$)(.*)$/i);
  if (!match || !["/gpt", "/chatgpt"].includes(`/${match[1].toLowerCase()}`)) {
    return null;
  }
  return match[2] || "";
}

assert.match(newtabSource, /const AI_DIRECT_PROMPT_STORAGE_KEY = "aiDirectPrompts";/, "New tab prompt handoff must use the shared local storage key.");
assert.match(newtabSource, /const AI_DIRECT_PROMPT_TOKEN_PARAM = "_wayleaf_prompt";/, "New tab prompt handoff must include a URL token parameter.");
assert.match(newtabSource, /const AI_DIRECT_PROMPT_TEXT_PARAM = "_wayleaf_text";/, "New tab prompt handoff must include a URL-fragment prompt fallback.");
assert.match(newtabSource, /const AI_DIRECT_PROMPT_TTL_MS = 2 \* 60 \* 1000;/, "New tab prompt handoff must keep a short prompt TTL.");
assert.match(newtabSource, /await saveAiDirectPrompt\(token,[\s\S]*engineId: engine\.id,[\s\S]*createdAt: Date\.now\(\)[\s\S]*destination = aiDirectTargetUrl\(targetUrl, token, engine\.urlPromptFallback \? query : ""\);/, "AI direct search must save the prompt before navigating with the token.");
assert.match(newtabSource, /let destination = engineSearchDestination\(engine, query\);[\s\S]*destination = aiDirectTargetUrl\(targetUrl, token, engine\.urlPromptFallback \? query : ""\);[\s\S]*console\.warn\("Failed to save AI direct prompt before navigation", error\);[\s\S]*window\.location\.assign\(destination\);/, "AI direct search must fall back to the provider query URL if prompt storage fails.");
assert.match(newtabSource, /function pruneAiDirectPrompts\(prompts\) \{[\s\S]*now - Number\(item\?\.createdAt \|\| 0\) < AI_DIRECT_PROMPT_TTL_MS/, "New tab prompt handoff must prune expired prompts before storage writes.");
assert.match(newtabSource, /const EDITABLE_AI_ENGINE_IDS = \["chatgpt", "claude", "gemini", "grok", "deepseek", "doubao", "kimi", "glm", "jimeng"\];/, "Search settings should expose all built-in AI direct engines.");
assert.match(newtabSource, /quickSearchAiPlaceholder:\s*"使用\{engine\}进行提问"/, "Chinese AI mode placeholder should name the active engine.");
assert.match(newtabSource, /quickSearchAiPlaceholder:\s*"Ask with \{engine\}"/, "English AI mode placeholder should name the active engine.");
assert.match(
  newtabSource,
  /function updateQuickSearchModeUi\(\) \{[\s\S]*googleAiSearchModeActive[\s\S]*t\("quickSearchAiPlaceholder", \{ engine: "Google AI" \}\)[\s\S]*engine\.local[\s\S]*t\("quickSearchPlaceholder"\)[\s\S]*t\("quickSearchAiPlaceholder", \{ engine: searchEngineLabel\(engine\) \}\)/,
  "AI active modes should replace the default search placeholder with the active AI engine placeholder."
);
[
  ["deepseek", "/deepseek", "https://chat.deepseek.com/"],
  ["doubao", "/doubao", "https://www.doubao.com/chat/"],
  ["kimi", "/kimi", "https://www.kimi.com/"],
  ["glm", "/glm", "https://chatglm.cn/"],
  ["jimeng", "/jimeng", "https://jimeng.jianying.com/ai-tool/home"]
].forEach(([engineId, command, directUrl]) => {
  assert.match(
    newtabSource,
    new RegExp(`\\{ id: "${engineId}", command: "${command}"[\\s\\S]*searchUrl: "${directUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[\\s\\S]*aiDirect: true[\\s\\S]*autoSubmit: true[\\s\\S]*directUrl: "${directUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`),
    `${engineId} should be configured as an AI direct engine.`
  );
});
assert.match(newtabSource, /\{ id: "jimeng"[\s\S]*commands: \["\/jimeng", "\/jm"\][\s\S]*urlPromptFallback: true/, "Jimeng should be an AI engine with a short command and URL-fragment fallback.");
assert.match(newtabSource, /\{ id: "doubao"[\s\S]*iconUrl: "icons\/sites\/doubao\.png"/, "Doubao AI engine should use the explicit PNG icon without changing generic doubao.com site icon routing.");
assert.ok(newtabSource.includes('engine?.id === "doubao"'), "Explicit PNG icon routing should stay scoped to the Doubao AI engine.");
assert.equal(searchAiCommand("/g"), null, "A partial AI command should remain ordinary input.");
assert.equal(searchAiCommand("/chat"), null, "A partial long AI alias should remain ordinary input.");
assert.equal(searchAiCommand("/gptx"), null, "An AI command must match the complete configured command.");
assert.equal(searchAiCommand("/gpt"), "", "The complete short AI command should activate without prompt text.");
assert.equal(searchAiCommand("/chatgpt explain this"), "explain this", "The complete long AI command should activate and preserve the prompt.");
assert.match(newtabSource, /function searchAiCommand\(value\) \{[\s\S]*\(\?:\\s\+\|\$\)[\s\S]*aiEngineCommands\(item\)\.includes\(command\)/, "Production AI activation should require a complete configured command.");

assert.match(submitSource, /const WAYLEAF_STORAGE_KEY = "aiDirectPrompts";/, "Content script must read the shared prompt storage key.");
assert.match(submitSource, /const WAYLEAF_PROMPT_TOKEN_PARAM = "_wayleaf_prompt";/, "Content script must read and clean the shared prompt token parameter.");
assert.match(submitSource, /const WAYLEAF_PROMPT_TEXT_PARAM = "_wayleaf_text";/, "Content script must know the URL-fragment prompt fallback parameter.");
assert.match(submitSource, /window\.__wayleafAiSubmitLoaded/, "Content script must guard against duplicate programmatic injection.");
assert.match(submitSource, /cleanupPromptTokenFromUrl\(\);[\s\S]*findStoredPromptForProvider\(provider, token\)/, "Content script must clean the URL token before consuming stored prompts.");
assert.match(submitSource, /const fallbackPrompt = promptTextFromLocation\(location\);[\s\S]*!entry && !fallbackPrompt[\s\S]*await submitPrompt\(fallbackPrompt\)/, "Content script must submit the fragment prompt when storage lookup misses.");
assert.match(submitSource, /function promptTextFromLocation\(currentLocation\) \{[\s\S]*URLSearchParams[\s\S]*WAYLEAF_PROMPT_TEXT_PARAM/, "Content script must read prompt text from the URL fragment.");
assert.match(submitSource, /hashParams\.delete\(WAYLEAF_PROMPT_TEXT_PARAM\);/, "Content script must clean the URL-fragment prompt fallback.");
assert.match(submitSource, /function isTerminalStatus\(status\) \{[\s\S]*status === "submitted"[\s\S]*status === "filled"[\s\S]*status === "missing-prompt"[\s\S]*status === "unsupported-host"/, "Filled manual fallback must stop retry loops without being treated as a removable success.");
assert.match(submitSource, /function shouldRemoveStoredPrompt\(status\) \{[\s\S]*status === "submitted"[\s\S]*status === "missing-prompt"[\s\S]*status === "unsupported-host"[\s\S]*\}/, "Only submitted or unrecoverable prompt states should remove stored prompts.");
assert.doesNotMatch(submitSource, /function shouldRemoveStoredPrompt\(status\) \{[\s\S]*status === "filled"/, "Filled manual fallback must keep the stored prompt until TTL cleanup.");
assert.match(submitSource, /const submitButton = await waitForSubmitButton\(config, input, 6000\);[\s\S]*await clickSubmitButton\(submitButton\);[\s\S]*if \(promptSubmissionLooksComplete\(input, prompt, startedUrl\)\) \{[\s\S]*return "submitted";[\s\S]*submitWithEnter\(input\);[\s\S]*return normalizePromptComparisonText\(inputText\(input\)\) === normalizePromptComparisonText\(prompt\) \? "filled" : "submitted";/, "Submit flow must verify click success, fall back to Enter, and report filled when manual fallback remains.");
assert.match(submitSource, /function findSubmitButton\(config, input\) \{[\s\S]*config\.submitSelectors[\s\S]*input\.closest\("form"\)[\s\S]*isLikelySubmitButton/, "Submit fallback must search scoped likely send buttons after provider selectors.");
assert.match(submitSource, /config\.engineId === "doubao"[\s\S]*findDoubaoSubmitButton\(input\)/, "Doubao should use a provider-specific fallback for the unlabeled blue submit button.");
assert.match(submitSource, /function findDoubaoSubmitButton\(input\) \{[\s\S]*\[class\*=\\"send\\"\][\s\S]*buttonCenterX\(node\) > inputRect\.left \+ inputRect\.width \* 0\.7[\s\S]*buttonCenterX\(b\) - buttonCenterX\(a\)/, "Doubao fallback should choose the rightmost small clickable control near the composer.");
assert.match(submitSource, /function promptSubmissionLooksComplete\(input, prompt, startedUrl\) \{[\s\S]*location\.href !== startedUrl[\s\S]*!document\.contains\(input\)[\s\S]*normalizePromptComparisonText\(inputText\(input\)\) !== normalizePromptComparisonText\(prompt\)/, "Submitted state must be based on URL, input removal/visibility, or normalized prompt text changing.");
assert.match(submitSource, /function normalizePromptComparisonText\(value\) \{[\s\S]*replace\(\/\\u00a0\/g, " "\)[\s\S]*replace\(\/\\s\+\/g, " "\)/, "Submit completion checks must ignore editor whitespace normalization.");
[
  ["chat.deepseek.com", "deepseek"],
  ["doubao.com", "doubao"],
  ["kimi.com", "kimi"],
  ["kimi.moonshot.cn", "kimi"],
  ["chatglm.cn", "glm"],
  ["z.ai", "glm"],
  ["jimeng.jianying.com", "jimeng"]
].forEach(([host, engineId]) => {
  assert.match(submitSource, new RegExp(`"${host}": \\{[\\s\\S]*engineId: "${engineId}"`), `${host} should map to ${engineId}.`);
});
assert.match(submitSource, /"jimeng\.jianying\.com": \{[\s\S]*div\.tiptap\.ProseMirror\[contenteditable=\\"true\\"\][\s\S]*\[contenteditable\]:not\(\[contenteditable=\\"false\\"\]\)[\s\S]*textarea[\s\S]*button\[class\*=\\"submit-button\\"\][\s\S]*button\[class\*=\\"generate\\"\]/, "Jimeng should target flexible editor variants and generate buttons.");
assert.match(submitSource, /发送\|提交\|傳送\|生成/, "Generic submit detection must recognize Jimeng's generate action.");
[
  "https://chat.deepseek.com/*",
  "https://www.doubao.com/*",
  "https://www.kimi.com/*",
  "https://kimi.moonshot.cn/*",
  "https://chatglm.cn/*",
  "https://z.ai/*",
  "https://jimeng.jianying.com/*"
].forEach((matchPattern) => {
  assert.ok(manifest.content_scripts[0].matches.includes(matchPattern), `${matchPattern} should load the AI submit content script.`);
});

assert.match(backgroundSource, /const AI_DIRECT_PROMPT_TOKEN_PARAM = "_wayleaf_prompt";/, "Background injection must recognize prompt-token URLs.");
assert.match(backgroundSource, /const AI_DIRECT_PROMPT_TEXT_PARAM = "_wayleaf_text";/, "Background injection must recognize fragment prompt fallback URLs.");
assert.match(backgroundSource, /const pendingAiDirectRequests = new Map\(\);/, "Background injection should retry after provider page load completes.");
assert.match(backgroundSource, /chrome\.tabs\?\.onUpdated\?\.addListener[\s\S]*pendingAiDirectRequests\.set\(tabId, request\)[\s\S]*injectAiSubmit\(tabId, pendingRequest\)/, "Background should reinject AI submit on provider prompt URLs.");
assert.match(backgroundSource, /files:\s*\["ai-submit\.js"\]/, "Background injection must execute the AI submit content script.");
assert.match(backgroundSource, /world:\s*"MAIN"[\s\S]*func:\s*submitJimengPrompt/, "Jimeng should receive a page-world ProseMirror handoff.");
assert.match(backgroundSource, /window\.setInterval\(\(\) => \{[\s\S]*filled = fillAndSubmit\(\)[\s\S]*clickSubmit\(\)/, "Jimeng handoff should wait for the editor and enabled generate button.");
assert.match(backgroundSource, /document\.execCommand\?\.\("insertText", false, text\)/, "Jimeng handoff should insert prompt text through the editor.");
assert.match(backgroundSource, /button\.click\(\)/, "Jimeng handoff should click the enabled generate button.");

console.log("ai direct search fixtures passed");
