import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const newtabSource = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");
const submitSource = readFileSync(new URL("../ai-submit.js", import.meta.url), "utf8");
const backgroundSource = readFileSync(new URL("../background.js", import.meta.url), "utf8");
const manifest = JSON.parse(readFileSync(new URL("../manifest.json", import.meta.url), "utf8"));
const claudeProviderSource = submitSource.match(/"claude\.ai": \{[\s\S]*?\n  \},\n  "gemini\.google\.com":/)?.[0] || "";

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
assert.match(newtabSource, /const AI_DIRECT_ATTACHMENT_MAX_COUNT = 2;/, "AI attachments should be capped at two files.");
assert.match(newtabSource, /const AI_DIRECT_ATTACHMENT_MAX_BYTES = 10 \* 1024 \* 1024;/, "AI attachments should be capped at 10MB each.");
assert.match(newtabSource, /const AI_DIRECT_ATTACHMENT_ENGINE_IDS = new Set\(\["chatgpt", "claude", "gemini"\]\);/, "AI attachments should be limited to ChatGPT, Claude, and Gemini.");
assert.match(newtabSource, /aiAttachmentButton[\s\S]*aiAttachmentInput[\s\S]*aiAttachmentPill/, "New tab should expose an AI attachment button, file input, and staged attachment chip.");
assert.match(newtabSource, /supportsAiAttachmentsForActiveEngine\(\)[\s\S]*AI_DIRECT_ATTACHMENT_ENGINE_IDS\.has\(activeSearchEngine\)/, "AI attachments should only be available for the supported engines.");
assert.match(newtabSource, /files\.slice\(0, AI_DIRECT_ATTACHMENT_MAX_COUNT\)[\s\S]*file\.size > AI_DIRECT_ATTACHMENT_MAX_BYTES/, "Attachment selection should enforce count and size limits before handoff.");
assert.match(newtabSource, /await saveAiDirectPrompt\(token,[\s\S]*engineId: engine\.id,[\s\S]*createdAt: Date\.now\(\)[\s\S]*destination = aiDirectTargetUrl\(targetUrl, token, engine\.urlPromptFallback \? query : ""\);/, "AI direct search must save the prompt before navigating with the token.");
assert.match(newtabSource, /attachments: AI_DIRECT_ATTACHMENT_ENGINE_IDS\.has\(engine\.id\) \? aiDirectAttachments : \[\]/, "Only supported AI engines should receive staged attachments in the handoff payload.");
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
assert.match(submitSource, /function normalizePromptItem\(value\)[\s\S]*attachments: normalizeAttachments\(value\.attachments\)/, "Content script must read structured prompt payloads with attachments.");
assert.match(submitSource, /"gemini\.google\.com": \{[\s\S]*engineId: "gemini"[\s\S]*mainWorldAttachment: true/, "Gemini should defer attachment upload to the page MAIN world.");
assert.ok(claudeProviderSource, "Claude provider block should be present.");
assert.doesNotMatch(claudeProviderSource, /mainWorldAttachment/, "Gemini attachment repair must not move Claude onto the Gemini MAIN-world bridge.");
assert.match(submitSource, /const WAYLEAF_GEMINI_ATTACHMENT_ATTR = "data-wayleaf-gemini-attachment-handoff";/, "Content script and MAIN-world Gemini upload should share an attachment status marker.");
assert.match(submitSource, /const WAYLEAF_GEMINI_ATTACHMENT_UPLOAD_ACTION = "wayleaf:gemini-attachment-upload";/, "Gemini content script should use a runtime message to request MAIN-world upload.");
assert.match(submitSource, /async function attachPromptFiles\(config, attachments\)[\s\S]*config\.engineId === "chatgpt"[\s\S]*attachChatgptPromptFiles\(attachments\)[\s\S]*config\.engineId === "claude"[\s\S]*attachClaudePromptFiles\(config, attachments\)[\s\S]*config\.engineId === "gemini"[\s\S]*attachGeminiPromptFiles\(config, attachments\)/, "Each AI provider should keep a separate attachment entry point after the shared Wayleaf payload.");
assert.match(submitSource, /async function attachChatgptPromptFiles\(attachments\)[\s\S]*#upload-files[\s\S]*#upload-photos[\s\S]*attachFilesToInput\(input, attachments\)/, "ChatGPT should keep its own provider file-input path.");
assert.match(submitSource, /async function attachClaudePromptFiles\(config, attachments\)[\s\S]*attachmentSelectors[\s\S]*attachFilesToInput\(input, attachments\)/, "Claude should keep its own provider file-input path.");
assert.match(submitSource, /async function attachGeminiPromptFiles\(config, attachments\)[\s\S]*requestGeminiMainWorldAttachmentUpload\(attachments\)[\s\S]*waitForGeminiMainWorldAttachment\(\)/, "Gemini should keep its own MAIN-world provider upload path.");
assert.match(submitSource, /async function attachFilesToInput\(input, attachments\)[\s\S]*new DataTransfer\(\)[\s\S]*input\.files = transfer\.files[\s\S]*dispatchBasicEvent\(input, "change"\)/, "File-input providers may share only the tiny file replay primitive.");
assert.match(submitSource, /async function waitForGeminiMainWorldAttachment\(\)[\s\S]*getAttribute\(WAYLEAF_GEMINI_ATTACHMENT_ATTR\)[\s\S]*state === "uploaded"[\s\S]*state === "failed" \|\| state === "missing"/, "Gemini content script should wait for MAIN-world upload success before submitting.");
assert.match(submitSource, /async function requestGeminiMainWorldAttachmentUpload\(attachments\)[\s\S]*chrome\.runtime\.sendMessage\(\{[\s\S]*action: WAYLEAF_GEMINI_ATTACHMENT_UPLOAD_ACTION,[\s\S]*attachments[\s\S]*response\?\.ok !== false/, "Gemini content script should pass the already-read attachment payload to the background upload bridge.");
assert.match(submitSource, /async function waitForAttachmentReady\(config, input, attachmentCount\)[\s\S]*config\.engineId === "chatgpt"[\s\S]*waitForChatgptAttachmentReady\(config, input, attachmentCount\)[\s\S]*config\.engineId === "claude"[\s\S]*waitForClaudeAttachmentReady\(config, input\)[\s\S]*config\.engineId === "gemini"[\s\S]*waitForGeminiAttachmentReady\(config, input, attachmentCount\)/, "Attachment readiness should dispatch to separate provider wait functions.");
assert.match(submitSource, /async function waitForClaudeAttachmentReady\(config, input\)[\s\S]*WAYLEAF_ATTACHMENT_READY_TIMEOUT_MS[\s\S]*findSubmitButton\(config, input\)[\s\S]*WAYLEAF_ATTACHMENT_READY_STABLE_MS[\s\S]*return null/, "Claude attachment readiness should allow the send button to appear and stay stable.");
assert.match(submitSource, /const WAYLEAF_GEMINI_ATTACHMENT_READY_STABLE_MS = 3000;/, "Gemini should wait for attachment previews to remain stable before submitting.");
assert.match(submitSource, /async function waitForGeminiAttachmentReady\(config, input, attachmentCount\)[\s\S]*countGeminiReadyAttachments\(\)[\s\S]*readyCount === lastReadyCount[\s\S]*WAYLEAF_GEMINI_ATTACHMENT_READY_STABLE_MS[\s\S]*return null/, "Gemini attachment submits should wait for a stable preview count instead of sending as soon as the first preview appears.");
assert.match(submitSource, /function countGeminiReadyAttachments\(\)[\s\S]*uploader-file-preview[\s\S]*\.file-preview-chip[\s\S]*filter\(isVisible\)\.length/, "Gemini attachment readiness should be based on visible Gemini file preview chips.");
assert.doesNotMatch(submitSource, /function openAttachmentInput|function findAttachmentButton|function findAttachmentMenuItem/, "Provider attachment entry points should not be collapsed into a shared button/menu opener.");
assert.match(submitSource, /function attachmentToFile\(attachment\)[\s\S]*atob\(match\[3\]\)[\s\S]*new File\(\[bytes\], attachment\.name/, "Stored attachment data URLs should be rebuilt as File objects.");
assert.match(submitSource, /async function submitPromptWhenReady\(config, prompt, attachments = \[\]\) \{[\s\S]*let filesAttached = true[\s\S]*filesAttached = await attachPromptFiles\(config, attachments\)[\s\S]*if \(attachments\.length && !filesAttached\) \{[\s\S]*return "filled";/, "Attachment submits should fill but not auto-send when upload is not confirmed.");
assert.match(submitSource, /if \(attachments\.length && config\.engineId === "gemini" && !submitButton\) \{[\s\S]*return "filled";[\s\S]*\}/, "Gemini attachment submits should not fall back to Enter when preview readiness times out.");
assert.match(submitSource, /async function fillPromptIntoLiveInput\(config, prompt, attempts = 1\) \{[\s\S]*waitForElement\([\s\S]*focusAndSetInputValue\(input, prompt\);[\s\S]*normalizePromptComparisonText\(inputText\(input\)\) === normalizedPrompt/, "Prompt filling should retry against the live composer until the expected text is present.");
assert.match(submitSource, /"kimi\.com": \{[\s\S]*engineId: "kimi"[\s\S]*\.chat-input-editor\[role=\\"textbox\\"\]\[contenteditable=\\"true\\"\]/, "Kimi should prefer its chat-input editor before generic contenteditable fallbacks.");
assert.match(submitSource, /async function fillPromptIntoLiveInput\(config, prompt, attempts = 1\) \{[\s\S]*config\.engineId === "kimi"[\s\S]*focusAndSetKimiInputValue\(input, prompt\)[\s\S]*focusAndSetInputValue\(input, prompt\)/, "Kimi should use a provider-specific fill path to avoid duplicated text.");
assert.match(submitSource, /function focusAndSetKimiInputValue\(input, value\) \{[\s\S]*execCommand\?\.\("insertText", false, value\)[\s\S]*dispatchBasicEvent\(input, "input"\)[\s\S]*dispatchBasicEvent\(input, "change"\)/, "Kimi fill should use the editor insert path and dispatch input without replaying the full prompt as event data.");
assert.doesNotMatch(submitSource, /function focusAndSetKimiInputValue\(input, value\) \{[\s\S]*dispatchInputLikeEvent\(input, "input", value\)/, "Kimi fill must not replay the full prompt through InputEvent.data.");
assert.match(submitSource, /const WAYLEAF_ATTACHMENT_READY_TIMEOUT_MS = 15000;/, "Attachment submits should allow extra time for provider-side upload processing.");
assert.match(submitSource, /async function waitForChatgptAttachmentReady\(config, input, attachmentCount\) \{[\s\S]*countChatgptReadyAttachments\(\) >= attachmentCount[\s\S]*!hasChatgptAttachmentBusyState\(\)[\s\S]*WAYLEAF_ATTACHMENT_READY_STABLE_MS/, "ChatGPT attachment submits should wait for the upload to finish and stay stable before sending.");
assert.match(submitSource, /cleanupPromptTokenFromUrl\(\);[\s\S]*findStoredPromptForProvider\(provider, token\)/, "Content script must clean the URL token before consuming stored prompts.");
assert.match(submitSource, /const fallbackPrompt = promptTextFromLocation\(location\);[\s\S]*!entry && !fallbackPrompt[\s\S]*await submitPrompt\(fallbackPrompt\)/, "Content script must submit the fragment prompt when storage lookup misses.");
assert.match(submitSource, /function promptTextFromLocation\(currentLocation\) \{[\s\S]*URLSearchParams[\s\S]*WAYLEAF_PROMPT_TEXT_PARAM/, "Content script must read prompt text from the URL fragment.");
assert.match(submitSource, /hashParams\.delete\(WAYLEAF_PROMPT_TEXT_PARAM\);/, "Content script must clean the URL-fragment prompt fallback.");
assert.match(submitSource, /function isTerminalStatus\(status\) \{[\s\S]*status === "submitted"[\s\S]*status === "filled"[\s\S]*status === "missing-prompt"[\s\S]*status === "unsupported-host"/, "Filled manual fallback must stop retry loops without being treated as a removable success.");
assert.match(submitSource, /function shouldRemoveStoredPrompt\(status\) \{[\s\S]*status === "submitted"[\s\S]*status === "missing-prompt"[\s\S]*status === "unsupported-host"[\s\S]*\}/, "Only submitted or unrecoverable prompt states should remove stored prompts.");
assert.doesNotMatch(submitSource, /function shouldRemoveStoredPrompt\(status\) \{[\s\S]*status === "filled"/, "Filled manual fallback must keep the stored prompt until TTL cleanup.");
assert.match(submitSource, /const submitButton = attachments\.length[\s\S]*await clickSubmitButton\(submitButton\);[\s\S]*if \(promptSubmissionLooksComplete\(input, prompt, startedUrl\)\) \{[\s\S]*return "submitted";[\s\S]*submitWithEnter\(input\);[\s\S]*return normalizePromptComparisonText\(inputText\(input\)\) === normalizePromptComparisonText\(prompt\) \? "filled" : "submitted";/, "Submit flow must wait for attachment-ready send state when needed, verify click success, fall back to Enter, and report filled when manual fallback remains.");
assert.match(submitSource, /function findSubmitButton\(config, input\) \{[\s\S]*config\.submitSelectors[\s\S]*input\.closest\("form"\)[\s\S]*isLikelySubmitButton/, "Submit fallback must search scoped likely send buttons after provider selectors.");
assert.match(submitSource, /config\.engineId === "doubao"[\s\S]*findDoubaoSubmitButton\(input\)/, "Doubao should use a provider-specific fallback for the unlabeled blue submit button.");
assert.match(submitSource, /function findDoubaoSubmitButton\(input\) \{[\s\S]*\[class\*=\\"send\\"\][\s\S]*buttonCenterX\(node\) > inputRect\.left \+ inputRect\.width \* 0\.7[\s\S]*buttonCenterX\(b\) - buttonCenterX\(a\)/, "Doubao fallback should choose the rightmost small clickable control near the composer.");
assert.match(submitSource, /config\.engineId === "deepseek"[\s\S]*findDeepseekSubmitButton\(input\)/, "DeepSeek should use a provider-specific fallback for its unlabeled primary send button.");
assert.match(submitSource, /function findDeepseekSubmitButton\(input\) \{[\s\S]*ds-button--primary[\s\S]*!className\.includes\("ds-button--disabled"\)[\s\S]*buttonCenterX\(node\) > inputRect\.left \+ inputRect\.width \* 0\.7[\s\S]*buttonCenterX\(b\) - buttonCenterX\(a\)/, "DeepSeek fallback should choose the enabled rightmost primary button near the composer.");
assert.match(submitSource, /config\.engineId === "kimi"[\s\S]*findKimiSubmitButton\(input\)/, "Kimi should use a provider-specific fallback for its unlabeled send button.");
assert.match(submitSource, /function findKimiSubmitButton\(input\) \{[\s\S]*send-button-container[\s\S]*!className\.includes\("disabled"\)[\s\S]*buttonCenterX\(node\) > inputRect\.left \+ inputRect\.width \* 0\.7[\s\S]*buttonCenterX\(b\) - buttonCenterX\(a\)/, "Kimi fallback should choose the enabled rightmost send button near the composer.");
assert.match(submitSource, /config\.engineId === "glm"[\s\S]*findGlmSubmitButton\(input\)/, "GLM should use a provider-specific fallback for its unlabeled enter button.");
assert.match(submitSource, /function findGlmSubmitButton\(input\) \{[\s\S]*enter-icon-container[\s\S]*!className\.includes\("empty"\)[\s\S]*buttonCenterX\(node\) > inputRect\.left \+ inputRect\.width \* 0\.7[\s\S]*buttonCenterX\(b\) - buttonCenterX\(a\)/, "GLM fallback should choose the enabled rightmost enter button near the composer.");
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
assert.ok(manifest.permissions.includes("unlimitedStorage"), "AI file handoff should have storage headroom for short-lived attachments.");

assert.match(backgroundSource, /const AI_DIRECT_PROMPT_TOKEN_PARAM = "_wayleaf_prompt";/, "Background injection must recognize prompt-token URLs.");
assert.match(backgroundSource, /const AI_DIRECT_PROMPT_TEXT_PARAM = "_wayleaf_text";/, "Background injection must recognize fragment prompt fallback URLs.");
assert.match(backgroundSource, /const AI_DIRECT_ATTACHMENT_MAX_COUNT = 2;/, "Background should keep the same short attachment cap when normalizing handoff payloads.");
assert.match(backgroundSource, /const GEMINI_ATTACHMENT_UPLOAD_ACTION = "wayleaf:gemini-attachment-upload";/, "Background should recognize the Gemini attachment bridge message.");
assert.match(backgroundSource, /const pendingAiDirectRequests = new Map\(\);/, "Background injection should retry after provider page load completes.");
assert.match(backgroundSource, /chrome\.tabs\?\.onUpdated\?\.addListener[\s\S]*pendingAiDirectRequests\.set\(tabId, request\)[\s\S]*injectAiSubmit\(tabId, pendingRequest\)/, "Background should reinject AI submit on provider prompt URLs.");
assert.match(backgroundSource, /files:\s*\["ai-submit\.js"\]/, "Background injection must execute the AI submit content script.");
assert.match(backgroundSource, /async function handleGeminiAttachmentUpload\(message, sender\)[\s\S]*sender\?\.tab\?\.id[\s\S]*normalizeAiDirectAttachments\(message\.attachments\)[\s\S]*world:\s*"MAIN"[\s\S]*func:\s*uploadGeminiAttachments/, "Gemini attachments should be uploaded from the page MAIN world when the content script has the payload.");
assert.match(backgroundSource, /const results = await chrome\.scripting\.executeScript\([\s\S]*return \{ ok: results\?\.\[0\]\?\.result === true \};/, "Gemini bridge should only report ok when the MAIN-world upload function returns true.");
assert.match(backgroundSource, /chrome\.runtime\?\.onMessage\?\.addListener\(\(message, sender, sendResponse\) => \{[\s\S]*message\?\.action === GEMINI_ATTACHMENT_UPLOAD_ACTION[\s\S]*handleGeminiAttachmentUpload\(message, sender\)/, "Background should service the Gemini attachment bridge message.");
assert.match(backgroundSource, /function normalizeAiDirectAttachments\(value\)[\s\S]*slice\(0, AI_DIRECT_ATTACHMENT_MAX_COUNT\)[\s\S]*dataUrl[\s\S]*name[\s\S]*type/, "Background should normalize stored attachment payloads before MAIN-world injection.");
assert.match(backgroundSource, /async function uploadGeminiAttachments\(attachments\)[\s\S]*data-wayleaf-gemini-attachment-handoff[\s\S]*uploader-file-preview[\s\S]*file-preview-chip/, "Gemini MAIN-world upload should mark state and detect real Gemini preview chips.");
assert.match(backgroundSource, /webkitGetAsEntry:\s*\(\) => fileToWebkitEntry\(file\)/, "Gemini MAIN-world upload should expose webkitGetAsEntry for Gemini's drop handler.");
assert.match(backgroundSource, /Object\.defineProperty\(event, "dataTransfer", \{ value: transfer \}\);[\s\S]*target\.dispatchEvent\(event\)/, "Gemini MAIN-world upload should dispatch drop events with the custom transfer object.");
assert.match(backgroundSource, /const button = await waitFor\(findToolsButton, 3000\)[\s\S]*const item = await waitFor\(findUploadMenuItem, 1500\)[\s\S]*if \(!hasFileChip\(\) && input\) \{[\s\S]*attachToInput\(input\)[\s\S]*else if \(!hasFileChip\(\)\) \{[\s\S]*dispatchUploadDrop\(\)/, "Gemini MAIN-world upload should open the provider upload menu and use the real file input before falling back to drop.");
assert.match(backgroundSource, /const attachToInput = \(input\) => \{[\s\S]*input\.files = transfer\.files[\s\S]*input\.dispatchEvent\(new Event\("change"/, "Gemini file-input fallback should still set files and dispatch change.");
assert.match(backgroundSource, /world:\s*"MAIN"[\s\S]*func:\s*submitJimengPrompt/, "Jimeng should receive a page-world ProseMirror handoff.");
assert.match(backgroundSource, /window\.setInterval\(\(\) => \{[\s\S]*filled = fillAndSubmit\(\)[\s\S]*clickSubmit\(\)/, "Jimeng handoff should wait for the editor and enabled generate button.");
assert.match(backgroundSource, /document\.execCommand\?\.\("insertText", false, text\)/, "Jimeng handoff should insert prompt text through the editor.");
assert.match(backgroundSource, /button\.click\(\)/, "Jimeng handoff should click the enabled generate button.");

console.log("ai direct search fixtures passed");
