(() => {
"use strict";

const WAYLEAF_STORAGE_KEY = "aiDirectPrompts";
const WAYLEAF_PROMPT_TOKEN_PARAM = "_wayleaf_prompt";
const WAYLEAF_MAX_PROMPT_LENGTH = 12000;
const WAYLEAF_PROMPT_TTL_MS = 2 * 60 * 1000;
const WAYLEAF_SUBMIT_TIMEOUT_MS = 12000;
const WAYLEAF_EDITOR_SYNC_DELAY_MS = 260;
const WAYLEAF_BOOT_DELAY_MS = 500;
const WAYLEAF_BOOT_MAX_ATTEMPTS = 18;
const WAYLEAF_TOKEN_CLEANUP_DURATION_MS = 15000;

const PROVIDERS = {
  "chatgpt.com": {
    engineId: "chatgpt",
    inputSelectors: [
      "#prompt-textarea",
      "textarea[placeholder]",
      "div[contenteditable=\"true\"]"
    ],
    submitSelectors: [
      "#composer-submit-button",
      "button[data-testid=\"send-button\"]",
      "button[aria-label*=\"发送提示\"]",
      "button[aria-label*=\"Send\"]",
      "button[aria-label*=\"发送\"]"
    ]
  },
  "claude.ai": {
    engineId: "claude",
    inputSelectors: [
      "div.ProseMirror[contenteditable=\"true\"]",
      "[contenteditable=\"true\"][data-testid]",
      "div[contenteditable=\"true\"]",
      "textarea"
    ],
    submitSelectors: [
      "button[data-testid=\"send-button\"]",
      "button[aria-label*=\"Send message\"]",
      "button[aria-label*=\"Send Message\"]",
      "button[aria-label*=\"Send\"]",
      "button[aria-label*=\"Submit\"]",
      "button[aria-label*=\"发送\"]",
      "button[aria-label*=\"提交\"]",
      "button[aria-label*=\"傳送\"]",
      "button[type=\"submit\"]"
    ]
  },
  "gemini.google.com": {
    engineId: "gemini",
    inputSelectors: [
      "rich-textarea div[contenteditable=\"true\"]",
      "div[contenteditable=\"true\"]",
      "textarea"
    ],
    submitSelectors: [
      "button[aria-label*=\"Send\"]",
      "button[aria-label*=\"Send message\"]",
      "button[aria-label*=\"发送\"]",
      "button[aria-label*=\"提交\"]",
      "button[aria-label*=\"傳送\"]",
      "button[aria-label*=\"Submit\"]"
    ]
  },
  "grok.com": {
    engineId: "grok",
    inputSelectors: [
      "div.ProseMirror[contenteditable=\"true\"]",
      "div[contenteditable=\"true\"]",
      "textarea"
    ],
    submitSelectors: [
      "button[data-testid=\"chat-submit\"]",
      "button[aria-label*=\"Send\"]",
      "button[aria-label*=\"发送\"]",
      "button[aria-label*=\"提交\"]",
      "button[type=\"submit\"]"
    ]
  }
};

window.wayleafSubmitStoredPrompt = submitStoredPrompt;
window.wayleafSubmitPrompt = submitPrompt;

consumeStoredPromptForCurrentProvider();
watchPromptTokenCleanup();

function providerForLocation(currentLocation) {
  const host = currentLocation.hostname.replace(/^www\./, "");
  return PROVIDERS[host] || null;
}

async function submitStoredPrompt(token) {
  const promptText = await readPromptFromStorage(token);
  const result = await submitPrompt(promptText);
  if (shouldRemoveStoredPrompt(result.status)) {
    await removePromptFromStorage(token);
  }
  return result;
}

async function submitPrompt(promptText) {
  const provider = providerForLocation(location);
  if (!provider) {
    return { status: "unsupported-host" };
  }
  if (!promptText) {
    return { status: "missing-prompt" };
  }
  const status = await submitPromptWhenReady(provider, promptText);
  return { status };
}

async function readPromptFromStorage(token) {
  if (!token || !chrome.storage?.local) {
    return "";
  }
  const result = await chrome.storage.local.get({ [WAYLEAF_STORAGE_KEY]: {} });
  const prompts = result[WAYLEAF_STORAGE_KEY] || {};
  const item = prompts[token];
  return String(item?.prompt || "").trim().slice(0, WAYLEAF_MAX_PROMPT_LENGTH);
}

async function removePromptFromStorage(token) {
  if (!token || !chrome.storage?.local) {
    return;
  }
  const result = await chrome.storage.local.get({ [WAYLEAF_STORAGE_KEY]: {} });
  const prompts = result[WAYLEAF_STORAGE_KEY] || {};
  delete prompts[token];
  await chrome.storage.local.set({ [WAYLEAF_STORAGE_KEY]: prompts });
}

async function consumeStoredPromptForCurrentProvider() {
  if (!chrome.storage?.local) {
    return;
  }
  const provider = providerForLocation(location);
  if (!provider) {
    return;
  }
  const token = promptTokenFromLocation(location);
  cleanupPromptTokenFromUrl();
  for (let attempt = 0; attempt < WAYLEAF_BOOT_MAX_ATTEMPTS; attempt += 1) {
    const entry = await findStoredPromptForProvider(provider, token);
    if (!entry) {
      await delay(WAYLEAF_BOOT_DELAY_MS);
      continue;
    }
    const result = await submitStoredPrompt(entry.token);
    if (isTerminalStatus(result.status)) {
      return;
    }
    await delay(WAYLEAF_BOOT_DELAY_MS);
  }
}

async function findStoredPromptForProvider(provider, targetToken) {
  const result = await chrome.storage.local.get({ [WAYLEAF_STORAGE_KEY]: {} });
  const prompts = result[WAYLEAF_STORAGE_KEY] || {};
  const now = Date.now();
  let changed = false;
  for (const [storedToken, item] of Object.entries(prompts)) {
    const createdAt = Number(item?.createdAt || 0);
    const expired = now - createdAt >= WAYLEAF_PROMPT_TTL_MS;
    if (expired) {
      delete prompts[storedToken];
      changed = true;
      continue;
    }
  }
  if (changed) {
    await chrome.storage.local.set({ [WAYLEAF_STORAGE_KEY]: prompts });
  }
  const item = targetToken
    ? prompts[targetToken]
    : latestStoredPromptForProvider(prompts, provider);
  if (!item || item.engineId !== provider.engineId || !item.prompt) {
    return null;
  }
  return { token: targetToken || item.token, createdAt: Number(item.createdAt || 0) };
}

function latestStoredPromptForProvider(prompts, provider) {
  return Object.entries(prompts)
    .filter(([, item]) => item?.engineId === provider.engineId && item.prompt)
    .map(([token, item]) => ({ ...item, token }))
    .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0))[0] || null;
}

function promptTokenFromLocation(currentLocation) {
  try {
    return new URL(currentLocation.href).searchParams.get(WAYLEAF_PROMPT_TOKEN_PARAM) || "";
  } catch {
    return "";
  }
}

function urlWithoutPromptToken(currentLocation) {
  try {
    const url = new URL(currentLocation.href);
    url.searchParams.delete(WAYLEAF_PROMPT_TOKEN_PARAM);
    return url.href;
  } catch {
    return currentLocation.href;
  }
}

function cleanupPromptTokenFromUrl() {
  if (!promptTokenFromLocation(location)) {
    return false;
  }
  history.replaceState(null, "", urlWithoutPromptToken(location));
  return true;
}

function watchPromptTokenCleanup() {
  const startedAt = Date.now();
  cleanupPromptTokenFromUrl();
  const intervalId = window.setInterval(() => {
    cleanupPromptTokenFromUrl();
    if (Date.now() - startedAt >= WAYLEAF_TOKEN_CLEANUP_DURATION_MS) {
      window.clearInterval(intervalId);
    }
  }, 500);
}

function isTerminalStatus(status) {
  return status === "submitted"
    || status === "filled"
    || status === "missing-prompt"
    || status === "unsupported-host";
}

function shouldRemoveStoredPrompt(status) {
  return status === "submitted"
    || status === "missing-prompt"
    || status === "unsupported-host";
}

async function submitPromptWhenReady(config, prompt) {
  const input = await waitForElement(config.inputSelectors, isWritableInput, WAYLEAF_SUBMIT_TIMEOUT_MS);
  if (!input) {
    return "input-not-found";
  }
  const startedUrl = location.href;
  focusAndSetInputValue(input, prompt);
  await delay(WAYLEAF_EDITOR_SYNC_DELAY_MS);
  const submitButton = await waitForSubmitButton(config, input, 6000);
  if (submitButton) {
    await clickSubmitButton(submitButton);
    await delay(900);
    if (promptSubmissionLooksComplete(input, prompt, startedUrl)) {
      return "submitted";
    }
  }
  submitWithEnter(input);
  await delay(900);
  if (promptSubmissionLooksComplete(input, prompt, startedUrl)) {
    return "submitted";
  }
  return normalizePromptComparisonText(inputText(input)) === normalizePromptComparisonText(prompt) ? "filled" : "submitted";
}

function waitForElement(selectors, predicate, timeoutMs) {
  return waitForCandidate(() => {
    for (const selector of selectors) {
      const nodes = [...document.querySelectorAll(selector)];
      const match = nodes.find(predicate);
      if (match) {
        return match;
      }
    }
    return null;
  }, timeoutMs);
}

function waitForSubmitButton(config, input, timeoutMs) {
  return waitForCandidate(() => findSubmitButton(config, input), timeoutMs);
}

function waitForCandidate(findCandidate, timeoutMs) {
  const startedAt = Date.now();
  return new Promise((resolve) => {
    const find = () => {
      const match = findCandidate();
      if (match) {
        resolve(match);
        return true;
      }
      if (Date.now() - startedAt > timeoutMs) {
        resolve(null);
        return true;
      }
      return false;
    };

    if (find()) {
      return;
    }
    const observer = new MutationObserver(() => {
      if (find()) {
        observer.disconnect();
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["aria-disabled", "disabled", "data-disabled", "class"],
      childList: true,
      subtree: true
    });
    window.setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeoutMs + 100);
  });
}

function findSubmitButton(config, input) {
  for (const selector of config.submitSelectors) {
    const nodes = [...document.querySelectorAll(selector)];
    const match = nodes.find(isClickableButton);
    if (match) {
      return match;
    }
  }
  const scopedRoot = input.closest("form")
    || input.closest("[role=\"form\"]")
    || input.closest("main")
    || document;
  const scopedMatch = [...scopedRoot.querySelectorAll("button, [role=\"button\"]")]
    .find((node) => isClickableButton(node) && isLikelySubmitButton(node));
  if (scopedMatch) {
    return scopedMatch;
  }
  return [...document.querySelectorAll("button, [role=\"button\"]")]
    .find((node) => isClickableButton(node) && isLikelySubmitButton(node)) || null;
}

function isWritableInput(node) {
  if (!(node instanceof HTMLElement)) {
    return false;
  }
  if (node instanceof HTMLTextAreaElement || node instanceof HTMLInputElement) {
    return !node.disabled && !node.readOnly && isVisible(node);
  }
  return node.isContentEditable && isVisible(node);
}

function isClickableButton(node) {
  return node instanceof HTMLElement
    && (node.tagName === "BUTTON" || node.getAttribute("role") === "button")
    && !(node instanceof HTMLButtonElement && node.disabled)
    && node.getAttribute("aria-disabled") !== "true"
    && node.getAttribute("data-disabled") !== "true"
    && isVisible(node);
}

function isLikelySubmitButton(button) {
  const descriptor = [
    button.getAttribute("aria-label"),
    button.getAttribute("title"),
    button.getAttribute("data-testid"),
    button.getAttribute("class"),
    button.textContent
  ].filter(Boolean).join(" ").toLowerCase();
  return /\b(send|submit|composer-submit|chat-submit)\b/.test(descriptor)
    || /发送|提交|傳送/.test(descriptor);
}

function isVisible(node) {
  const rect = node.getBoundingClientRect();
  const style = window.getComputedStyle(node);
  return rect.width > 0
    && rect.height > 0
    && style.visibility !== "hidden"
    && style.display !== "none";
}

function focusAndSetInputValue(input, value) {
  input.focus();
  if (input instanceof HTMLTextAreaElement || input instanceof HTMLInputElement) {
    const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), "value")?.set;
    if (setter) {
      setter.call(input, value);
    } else {
      input.value = value;
    }
    dispatchInputLikeEvent(input, "input", value);
    dispatchBasicEvent(input, "change");
    return;
  }
  setContentEditableValue(input, value);
}

function setContentEditableValue(input, value) {
  input.focus();
  const selection = window.getSelection?.();
  if (selection) {
    const range = document.createRange();
    range.selectNodeContents(input);
    selection.removeAllRanges();
    selection.addRange(range);
  }
  const inserted = document.execCommand?.("insertText", false, value);
  if (!inserted || inputText(input).trim() !== value.trim()) {
    input.textContent = "";
    input.appendChild(document.createTextNode(value));
  }
  dispatchInputLikeEvent(input, "input", value);
  dispatchBasicEvent(input, "change");
}

async function clickSubmitButton(button) {
  button.focus({ preventScroll: true });
  const rect = button.getBoundingClientRect();
  const eventOptions = {
    bubbles: true,
    cancelable: true,
    composed: true,
    view: window,
    button: 0,
    clientX: rect.left + rect.width / 2,
    clientY: rect.top + rect.height / 2
  };
  for (const type of ["pointerdown", "mousedown", "pointerup", "mouseup", "click"]) {
    dispatchMouseLikeEvent(button, type, eventOptions);
  }
}

function submitWithEnter(input) {
  input.focus();
  for (const type of ["keydown", "keypress", "keyup"]) {
    dispatchKeyboardLikeEvent(input, type, {
      bubbles: true,
      cancelable: true,
      composed: true,
      key: "Enter",
      code: "Enter",
      keyCode: 13,
      which: 13
    });
  }
}

function dispatchInputLikeEvent(target, type, data) {
  try {
    target.dispatchEvent(new InputEvent(type, {
      bubbles: true,
      cancelable: true,
      composed: true,
      inputType: "insertText",
      data
    }));
    return;
  } catch {
    dispatchBasicEvent(target, type);
  }
}

function dispatchMouseLikeEvent(target, type, options) {
  try {
    target.dispatchEvent(new MouseEvent(type, options));
    return;
  } catch {
    dispatchBasicEvent(target, type, options);
  }
}

function dispatchKeyboardLikeEvent(target, type, options) {
  try {
    target.dispatchEvent(new KeyboardEvent(type, options));
    return;
  } catch {
    dispatchBasicEvent(target, type, options);
  }
}

function dispatchBasicEvent(target, type, options = {}) {
  try {
    target.dispatchEvent(new Event(type, { bubbles: true, cancelable: true, composed: true, ...options }));
    return;
  } catch {
    const event = document.createEvent("Event");
    event.initEvent(type, true, true);
    target.dispatchEvent(event);
  }
}

function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function inputText(input) {
  return input instanceof HTMLTextAreaElement || input instanceof HTMLInputElement
    ? input.value
    : input.textContent || "";
}

function promptSubmissionLooksComplete(input, prompt, startedUrl) {
  if (location.href !== startedUrl) {
    return true;
  }
  if (!document.contains(input) || !isVisible(input)) {
    return true;
  }
  return normalizePromptComparisonText(inputText(input)) !== normalizePromptComparisonText(prompt);
}

function normalizePromptComparisonText(value) {
  return String(value || "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
})();
