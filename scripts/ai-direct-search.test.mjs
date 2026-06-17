import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const newtabSource = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");
const submitSource = readFileSync(new URL("../ai-submit.js", import.meta.url), "utf8");

assert.match(newtabSource, /const AI_DIRECT_PROMPT_STORAGE_KEY = "aiDirectPrompts";/, "New tab prompt handoff must use the shared local storage key.");
assert.match(newtabSource, /const AI_DIRECT_PROMPT_TOKEN_PARAM = "_wayleaf_prompt";/, "New tab prompt handoff must include a URL token parameter.");
assert.match(newtabSource, /const AI_DIRECT_PROMPT_TTL_MS = 2 \* 60 \* 1000;/, "New tab prompt handoff must keep a short prompt TTL.");
assert.match(newtabSource, /await saveAiDirectPrompt\(token,[\s\S]*engineId: engine\.id,[\s\S]*createdAt: Date\.now\(\)[\s\S]*destination = aiDirectTargetUrl\(targetUrl, token\);/, "AI direct search must save the prompt before navigating with the token.");
assert.match(newtabSource, /let destination = engineSearchDestination\(engine, query\);[\s\S]*destination = aiDirectTargetUrl\(targetUrl, token\);[\s\S]*console\.warn\("Failed to save AI direct prompt before navigation", error\);[\s\S]*window\.location\.assign\(destination\);/, "AI direct search must fall back to the provider query URL if prompt storage fails.");
assert.match(newtabSource, /function pruneAiDirectPrompts\(prompts\) \{[\s\S]*now - Number\(item\?\.createdAt \|\| 0\) < AI_DIRECT_PROMPT_TTL_MS/, "New tab prompt handoff must prune expired prompts before storage writes.");

assert.match(submitSource, /const WAYLEAF_STORAGE_KEY = "aiDirectPrompts";/, "Content script must read the shared prompt storage key.");
assert.match(submitSource, /const WAYLEAF_PROMPT_TOKEN_PARAM = "_wayleaf_prompt";/, "Content script must read and clean the shared prompt token parameter.");
assert.match(submitSource, /cleanupPromptTokenFromUrl\(\);[\s\S]*findStoredPromptForProvider\(provider, token\)/, "Content script must clean the URL token before consuming stored prompts.");
assert.match(submitSource, /function isTerminalStatus\(status\) \{[\s\S]*status === "submitted"[\s\S]*status === "filled"[\s\S]*status === "missing-prompt"[\s\S]*status === "unsupported-host"/, "Filled manual fallback must stop retry loops without being treated as a removable success.");
assert.match(submitSource, /function shouldRemoveStoredPrompt\(status\) \{[\s\S]*status === "submitted"[\s\S]*status === "missing-prompt"[\s\S]*status === "unsupported-host"[\s\S]*\}/, "Only submitted or unrecoverable prompt states should remove stored prompts.");
assert.doesNotMatch(submitSource, /function shouldRemoveStoredPrompt\(status\) \{[\s\S]*status === "filled"/, "Filled manual fallback must keep the stored prompt until TTL cleanup.");
assert.match(submitSource, /const submitButton = await waitForSubmitButton\(config, input, 6000\);[\s\S]*await clickSubmitButton\(submitButton\);[\s\S]*if \(promptSubmissionLooksComplete\(input, prompt, startedUrl\)\) \{[\s\S]*return "submitted";[\s\S]*submitWithEnter\(input\);[\s\S]*return normalizePromptComparisonText\(inputText\(input\)\) === normalizePromptComparisonText\(prompt\) \? "filled" : "submitted";/, "Submit flow must verify click success, fall back to Enter, and report filled when manual fallback remains.");
assert.match(submitSource, /function findSubmitButton\(config, input\) \{[\s\S]*config\.submitSelectors[\s\S]*input\.closest\("form"\)[\s\S]*isLikelySubmitButton/, "Submit fallback must search scoped likely send buttons after provider selectors.");
assert.match(submitSource, /function promptSubmissionLooksComplete\(input, prompt, startedUrl\) \{[\s\S]*location\.href !== startedUrl[\s\S]*!document\.contains\(input\)[\s\S]*normalizePromptComparisonText\(inputText\(input\)\) !== normalizePromptComparisonText\(prompt\)/, "Submitted state must be based on URL, input removal/visibility, or normalized prompt text changing.");
assert.match(submitSource, /function normalizePromptComparisonText\(value\) \{[\s\S]*replace\(\/\\u00a0\/g, " "\)[\s\S]*replace\(\/\\s\+\/g, " "\)/, "Submit completion checks must ignore editor whitespace normalization.");

console.log("ai direct search fixtures passed");
