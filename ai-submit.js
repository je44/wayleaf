(() => {
"use strict";

if (window.__wayleafAiSubmitLoaded) {
  return;
}
window.__wayleafAiSubmitLoaded = true;

const WAYLEAF_STORAGE_KEY = "aiDirectPrompts";
const WAYLEAF_PROMPT_TOKEN_PARAM = "_wayleaf_prompt";
const WAYLEAF_PROMPT_TEXT_PARAM = "_wayleaf_text";
const WAYLEAF_MAX_PROMPT_LENGTH = 12000;
const WAYLEAF_PROMPT_TTL_MS = 2 * 60 * 1000;
const WAYLEAF_SUBMIT_TIMEOUT_MS = 12000;
const WAYLEAF_EDITOR_SYNC_DELAY_MS = 260;
const WAYLEAF_ATTACHMENT_READY_TIMEOUT_MS = 15000;
const WAYLEAF_ATTACHMENT_READY_STABLE_MS = 800;
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
    attachmentSelectors: [
      "input[type=\"file\"][multiple]",
      "input[type=\"file\"]"
    ],
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
  },
  "chat.deepseek.com": {
    engineId: "deepseek",
    inputSelectors: [
      "textarea",
      "div[contenteditable=\"true\"]",
      "[contenteditable=\"true\"]"
    ],
    submitSelectors: [
      "button[aria-label*=\"Send\"]",
      "button[aria-label*=\"发送\"]",
      "button[aria-label*=\"提交\"]",
      "button[type=\"submit\"]"
    ]
  },
  "doubao.com": {
    engineId: "doubao",
    inputSelectors: [
      "textarea",
      "div[contenteditable=\"true\"]",
      "[contenteditable=\"true\"]"
    ],
    submitSelectors: [
      "button[aria-label*=\"Send\"]",
      "button[aria-label*=\"发送\"]",
      "button[aria-label*=\"提交\"]",
      "button[type=\"submit\"]"
    ]
  },
  "kimi.com": {
    engineId: "kimi",
    inputSelectors: [
      "textarea",
      "div[contenteditable=\"true\"]",
      "[contenteditable=\"true\"]"
    ],
    submitSelectors: [
      "button[aria-label*=\"Send\"]",
      "button[aria-label*=\"发送\"]",
      "button[aria-label*=\"提交\"]",
      "button[type=\"submit\"]"
    ]
  },
  "kimi.moonshot.cn": {
    engineId: "kimi",
    inputSelectors: [
      "textarea",
      "div[contenteditable=\"true\"]",
      "[contenteditable=\"true\"]"
    ],
    submitSelectors: [
      "button[aria-label*=\"Send\"]",
      "button[aria-label*=\"发送\"]",
      "button[aria-label*=\"提交\"]",
      "button[type=\"submit\"]"
    ]
  },
  "chatglm.cn": {
    engineId: "glm",
    inputSelectors: [
      "textarea",
      "div[contenteditable=\"true\"]",
      "[contenteditable=\"true\"]"
    ],
    submitSelectors: [
      "button[aria-label*=\"Send\"]",
      "button[aria-label*=\"发送\"]",
      "button[aria-label*=\"提交\"]",
      "button[type=\"submit\"]"
    ]
  },
  "z.ai": {
    engineId: "glm",
    inputSelectors: [
      "textarea",
      "div[contenteditable=\"true\"]",
      "[contenteditable=\"true\"]"
    ],
    submitSelectors: [
      "button[aria-label*=\"Send\"]",
      "button[aria-label*=\"发送\"]",
      "button[aria-label*=\"提交\"]",
      "button[type=\"submit\"]"
    ]
  },
  "jimeng.jianying.com": {
    engineId: "jimeng",
    inputSelectors: [
      "div.tiptap.ProseMirror[contenteditable=\"true\"]",
      "div.ProseMirror[contenteditable=\"true\"]",
      "div[role=\"textbox\"][contenteditable=\"true\"]",
      "[contenteditable]:not([contenteditable=\"false\"])",
      "textarea"
    ],
    submitSelectors: [
      "button[class*=\"submit-button\"]",
      "button[class*=\"send\"]",
      "button[class*=\"generate\"]",
      "button[aria-label*=\"生成\"]",
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
  const promptItem = await readPromptFromStorage(token);
  const result = await submitPrompt(promptItem);
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
  const promptItem = normalizePromptItem(promptText);
  const prompt = promptItem.prompt;
  if (!prompt) {
    return { status: "missing-prompt" };
  }
  const status = await submitPromptWhenReady(provider, prompt, promptItem.attachments);
  return { status };
}

async function readPromptFromStorage(token) {
  if (!token || !hasChromeLocalStorage()) {
    return "";
  }
  const result = await chrome.storage.local.get({ [WAYLEAF_STORAGE_KEY]: {} });
  const prompts = result[WAYLEAF_STORAGE_KEY] || {};
  const item = prompts[token];
  return normalizePromptItem(item);
}

function normalizePromptItem(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { prompt: String(value || "").trim().slice(0, WAYLEAF_MAX_PROMPT_LENGTH), attachments: [] };
  }
  return {
    attachments: normalizeAttachments(value.attachments),
    prompt: String(value.prompt || "").trim().slice(0, WAYLEAF_MAX_PROMPT_LENGTH)
  };
}

function normalizeAttachments(value) {
  return Array.isArray(value)
    ? value
      .filter((item) => item && typeof item === "object" && item.dataUrl && item.name)
      .slice(0, 2)
      .map((item) => ({
        dataUrl: String(item.dataUrl || ""),
        name: String(item.name || "attachment"),
        type: String(item.type || "application/octet-stream")
      }))
    : [];
}

async function removePromptFromStorage(token) {
  if (!token || !hasChromeLocalStorage()) {
    return;
  }
  const result = await chrome.storage.local.get({ [WAYLEAF_STORAGE_KEY]: {} });
  const prompts = result[WAYLEAF_STORAGE_KEY] || {};
  delete prompts[token];
  await chrome.storage.local.set({ [WAYLEAF_STORAGE_KEY]: prompts });
}

async function consumeStoredPromptForCurrentProvider() {
  const provider = providerForLocation(location);
  if (!provider) {
    return;
  }
  const token = promptTokenFromLocation(location);
  const fallbackPrompt = promptTextFromLocation(location);
  cleanupPromptTokenFromUrl();
  for (let attempt = 0; attempt < WAYLEAF_BOOT_MAX_ATTEMPTS; attempt += 1) {
    const entry = hasChromeLocalStorage()
      ? await findStoredPromptForProvider(provider, token)
      : null;
    if (!entry && !fallbackPrompt) {
      await delay(WAYLEAF_BOOT_DELAY_MS);
      continue;
    }
    const result = entry
      ? await submitStoredPrompt(entry.token)
      : await submitPrompt(fallbackPrompt);
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

function hasChromeLocalStorage() {
  return typeof chrome !== "undefined" && Boolean(chrome.storage?.local);
}

function promptTokenFromLocation(currentLocation) {
  try {
    return new URL(currentLocation.href).searchParams.get(WAYLEAF_PROMPT_TOKEN_PARAM) || "";
  } catch {
    return "";
  }
}

function promptTextFromLocation(currentLocation) {
  try {
    const hashParams = new URLSearchParams(new URL(currentLocation.href).hash.replace(/^#/, ""));
    return String(hashParams.get(WAYLEAF_PROMPT_TEXT_PARAM) || "").trim().slice(0, WAYLEAF_MAX_PROMPT_LENGTH);
  } catch {
    return "";
  }
}

function urlWithoutPromptToken(currentLocation) {
  try {
    const url = new URL(currentLocation.href);
    url.searchParams.delete(WAYLEAF_PROMPT_TOKEN_PARAM);
    const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
    hashParams.delete(WAYLEAF_PROMPT_TEXT_PARAM);
    url.hash = hashParams.toString();
    return url.href;
  } catch {
    return currentLocation.href;
  }
}

function cleanupPromptTokenFromUrl() {
  if (!promptTokenFromLocation(location) && !promptTextFromLocation(location)) {
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

async function submitPromptWhenReady(config, prompt, attachments = []) {
  const startedUrl = location.href;
  let filesAttached = true;
  if (attachments.length) {
    filesAttached = await attachPromptFiles(config, attachments);
  }
  const input = await fillPromptIntoLiveInput(config, prompt, attachments.length > 0 ? 4 : 1);
  if (!input) {
    return "input-not-found";
  }
  if (attachments.length && !filesAttached) {
    return "filled";
  }
  const submitButton = attachments.length
    ? await waitForChatgptAttachmentReady(config, input, attachments.length)
    : await waitForSubmitButton(config, input, 6000);
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

async function fillPromptIntoLiveInput(config, prompt, attempts = 1) {
  const normalizedPrompt = normalizePromptComparisonText(prompt);
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const input = await waitForElement(
      config.inputSelectors,
      isWritableInput,
      attempt === 0 ? WAYLEAF_SUBMIT_TIMEOUT_MS : 2000
    );
    if (!input) {
      return null;
    }
    focusAndSetInputValue(input, prompt);
    await delay(WAYLEAF_EDITOR_SYNC_DELAY_MS);
    if (normalizePromptComparisonText(inputText(input)) === normalizedPrompt) {
      return input;
    }
    await delay(250);
  }
  return waitForElement(config.inputSelectors, isWritableInput, 1200);
}

async function waitForChatgptAttachmentReady(config, input, attachmentCount) {
  if (config.engineId === "claude" && attachmentCount > 0) {
    return waitForClaudeAttachmentReady(config, input);
  }
  if (config.engineId !== "chatgpt" || attachmentCount <= 0) {
    return waitForSubmitButton(config, input, 6000);
  }
  const startedAt = Date.now();
  let readySince = 0;
  while (Date.now() - startedAt <= WAYLEAF_ATTACHMENT_READY_TIMEOUT_MS) {
    const submitButton = findSubmitButton(config, input);
    const ready = submitButton
      && countChatgptReadyAttachments() >= attachmentCount
      && !hasChatgptAttachmentBusyState();
    if (ready) {
      readySince ||= Date.now();
      if (Date.now() - readySince >= WAYLEAF_ATTACHMENT_READY_STABLE_MS) {
        return submitButton;
      }
    } else {
      readySince = 0;
    }
    await delay(200);
  }
  return waitForSubmitButton(config, input, 1200);
}

function countChatgptReadyAttachments() {
  return document.querySelectorAll('[aria-label*="移除文件"], [aria-label*="Remove file"]').length;
}

function hasChatgptAttachmentBusyState() {
  if (document.querySelector('[aria-busy="true"], [role="progressbar"], [data-state="uploading"], [data-state="loading"]')) {
    return true;
  }
  return [...document.querySelectorAll('[aria-label], [class], [data-state]')].some((node) => {
    const descriptor = [
      node.getAttribute("aria-label"),
      node.getAttribute("class"),
      node.getAttribute("data-state"),
      node.textContent
    ].filter(Boolean).join(" ").toLowerCase();
    return /upload|loading|processing|attaching|上传中|上传|处理中|附件处理中/.test(descriptor);
  });
}

async function waitForClaudeAttachmentReady(config, input) {
  const startedAt = Date.now();
  let readySince = 0;
  while (Date.now() - startedAt <= WAYLEAF_ATTACHMENT_READY_TIMEOUT_MS) {
    const submitButton = findSubmitButton(config, input);
    if (submitButton) {
      readySince ||= Date.now();
      if (Date.now() - readySince >= WAYLEAF_ATTACHMENT_READY_STABLE_MS) {
        return submitButton;
      }
    } else {
      readySince = 0;
    }
    await delay(200);
  }
  return null;
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
  if (config.engineId === "doubao") {
    const doubaoSubmitButton = findDoubaoSubmitButton(input);
    if (doubaoSubmitButton) {
      return doubaoSubmitButton;
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

function findDoubaoSubmitButton(input) {
  const inputRect = input.getBoundingClientRect();
  const maxDistanceY = Math.max(64, inputRect.height + 44);
  return [...document.querySelectorAll("button, [role=\"button\"], [tabindex], [class*=\"send\"], [class*=\"submit\"], [class*=\"button\"]")]
    .filter(isClickableElement)
    .filter((node) => {
      const rect = node.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      return rect.width >= 24
        && rect.width <= 72
        && rect.height >= 24
        && rect.height <= 72
        && buttonCenterX(node) > inputRect.left + inputRect.width * 0.7
        && Math.abs(centerY - (inputRect.top + inputRect.height / 2)) <= maxDistanceY;
    })
    .sort((a, b) => buttonCenterX(b) - buttonCenterX(a))[0] || null;
}

function buttonCenterX(node) {
  const rect = node.getBoundingClientRect();
  return rect.left + rect.width / 2;
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

function isClickableElement(node) {
  return node instanceof HTMLElement
    && !(node instanceof HTMLButtonElement && node.disabled)
    && node.getAttribute("aria-disabled") !== "true"
    && node.getAttribute("data-disabled") !== "true"
    && window.getComputedStyle(node).pointerEvents !== "none"
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
    || /发送|提交|傳送|生成/.test(descriptor);
}

function isVisible(node) {
  const rect = node.getBoundingClientRect();
  const style = window.getComputedStyle(node);
  return rect.width > 0
    && rect.height > 0
    && style.visibility !== "hidden"
    && style.display !== "none";
}

async function attachPromptFiles(config, attachments) {
  if (!attachments.length) {
    return false;
  }
  const files = attachments.map(attachmentToFile).filter(Boolean);
  if (!files.length) {
    return false;
  }
  const input = attachmentInputForProvider(config);
  if (!(input instanceof HTMLInputElement)) {
    return false;
  }
  const transfer = new DataTransfer();
  files.forEach((file) => transfer.items.add(file));
  input.files = transfer.files;
  dispatchBasicEvent(input, "input");
  dispatchBasicEvent(input, "change");
  await delay(1200);
  return true;
}

function attachmentInputForProvider(config) {
  if (config.engineId === "chatgpt") {
    return document.querySelector("#upload-files")
      || document.querySelector("#upload-photos")
      || document.querySelector('input[type="file"][multiple]');
  }
  if (config.engineId === "claude") {
    return (config.attachmentSelectors || [])
      .flatMap((selector) => [...document.querySelectorAll(selector)])
      .find((node) => node instanceof HTMLInputElement && node.type === "file" && !node.disabled) || null;
  }
  return null;
}

function attachmentToFile(attachment) {
  try {
    const match = String(attachment.dataUrl || "").match(/^data:([^;,]+)?(;base64)?,(.*)$/);
    if (!match) {
      return null;
    }
    const mime = attachment.type || match[1] || "application/octet-stream";
    const body = match[2]
      ? atob(match[3])
      : decodeURIComponent(match[3]);
    const bytes = new Uint8Array(body.length);
    for (let index = 0; index < body.length; index += 1) {
      bytes[index] = body.charCodeAt(index);
    }
    return new File([bytes], attachment.name || "attachment", { type: mime });
  } catch {
    return null;
  }
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
