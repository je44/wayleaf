"use strict";

const AUTO_SYNC_ALARM_NAME = "wayleaf-daily-auto-sync";
const AUTO_SYNC_PERIOD_MINUTES = 24 * 60;
const CUSTOM_PORTALS_STORAGE_KEY = "customPortals";
const FAVORITE_SITES_STORAGE_KEY = "favoriteSites";
const RECENT_HISTORY_STARTED_AT_STORAGE_KEY = "recentHistoryStartedAt";
const BOOKMARK_FOLDER_STORAGE_KEY = "bookmarkFolderId";
const PORTAL_CATEGORY_STATE_STORAGE_KEY = "portalCategoryState";
const THEME_STORAGE_KEY = "themeMode";
const THEME_PALETTE_STORAGE_KEY = "themePalette";
const LANGUAGE_STORAGE_KEY = "languagePreference";
const SEARCH_SETTINGS_STORAGE_KEY = "searchSettings";
const CUSTOM_MEDIA_FEEDS_STORAGE_KEY = "customMediaFeeds";
const SYNC_META_STORAGE_KEY = "syncMeta";
const AI_DIRECT_PROMPT_STORAGE_KEY = "aiDirectPrompts";
const AI_DIRECT_PROMPT_TOKEN_PARAM = "_wayleaf_prompt";
const AI_DIRECT_PROMPT_TEXT_PARAM = "_wayleaf_text";
const AI_DIRECT_MAX_PROMPT_LENGTH = 12000;
const AI_DIRECT_ATTACHMENT_MAX_COUNT = 2;
const GEMINI_ATTACHMENT_UPLOAD_ACTION = "wayleaf:gemini-attachment-upload";
const VIDEO_PIP_ACTIVATE_ACTION = "wayleaf:video-pip-activate";
const VIDEO_PIP_SELECT_STATUS_ACTION = "wayleaf:video-pip-select-status";
const VIDEO_PIP_ENABLED_STORAGE_KEY = "videoPipEnabled";
const LEGACY_VIDEO_PIP_GLOBAL_ENABLED_STORAGE_KEY = "videoPipGlobalEnabled";
const LEGACY_SOCIAL_VIDEO_EXTRACTOR_ENABLED_STORAGE_KEY = "socialVideoExtractorEnabled";
const AI_DIRECT_PROVIDER_HOSTS = new Set([
  "chatgpt.com",
  "claude.ai",
  "gemini.google.com",
  "grok.com",
  "chat.deepseek.com",
  "doubao.com",
  "kimi.com",
  "kimi.moonshot.cn",
  "chatglm.cn",
  "z.ai",
  "chat.qwen.ai",
  "jimeng.jianying.com"
]);
const pendingAiDirectRequests = new Map();
const CUSTOMIZABLE_SETTINGS_STORAGE_KEYS = [
  THEME_STORAGE_KEY,
  THEME_PALETTE_STORAGE_KEY,
  LANGUAGE_STORAGE_KEY,
  SEARCH_SETTINGS_STORAGE_KEY
];
const SYNC_STORAGE_KEYS = [
  CUSTOM_PORTALS_STORAGE_KEY,
  FAVORITE_SITES_STORAGE_KEY,
  BOOKMARK_FOLDER_STORAGE_KEY,
  PORTAL_CATEGORY_STATE_STORAGE_KEY,
  ...CUSTOMIZABLE_SETTINGS_STORAGE_KEYS,
  CUSTOM_MEDIA_FEEDS_STORAGE_KEY
];

function favoriteSitesForCloudSync(sites) {
  return Array.isArray(sites)
    ? sites.map((site) => {
      if (!site || typeof site !== "object" || Array.isArray(site)) {
        return site;
      }
      const { icon: _icon, ...portableSite } = site;
      return portableSite;
    })
    : sites;
}

function cloudSyncPayload(values = {}) {
  const payload = { ...values };
  if (Object.prototype.hasOwnProperty.call(payload, FAVORITE_SITES_STORAGE_KEY)) {
    payload[FAVORITE_SITES_STORAGE_KEY] = favoriteSitesForCloudSync(payload[FAVORITE_SITES_STORAGE_KEY]);
  }
  return payload;
}

async function ensureDailyAutoSyncAlarm() {
  if (!chrome.alarms?.create) {
    return;
  }
  const existingAlarm = await chrome.alarms.get(AUTO_SYNC_ALARM_NAME);
  if (existingAlarm) {
    return;
  }
  await chrome.alarms.create(AUTO_SYNC_ALARM_NAME, {
    delayInMinutes: AUTO_SYNC_PERIOD_MINUTES,
    periodInMinutes: AUTO_SYNC_PERIOD_MINUTES,
    persistAcrossSessions: true
  });
}

async function runAutoSyncSettings() {
  if (!chrome.storage?.sync) {
    return;
  }
  const sourceStorage = chrome.storage?.local || chrome.storage.sync;
  const values = await sourceStorage.get(SYNC_STORAGE_KEYS);
  await chrome.storage.sync.set({
    ...cloudSyncPayload(values),
    [SYNC_META_STORAGE_KEY]: {
      syncedAt: Date.now(),
      source: "auto"
    }
  });
}

function reportBackgroundError(error) {
  console.warn("Wayleaf background sync failed", error);
}

function supportsVideoPip(url) {
  try {
    return ["http:", "https:"].includes(new URL(url).protocol);
  } catch {
    return false;
  }
}

async function injectVideoPipController(tabId) {
  if (!Number.isInteger(tabId) || !chrome.scripting?.executeScript) {
    return false;
  }
  try {
    await chrome.scripting.executeScript({
      target: { tabId, allFrames: true },
      files: ["video-pip.js"]
    });
    return true;
  } catch (error) {
    console.warn("Wayleaf video mini-player injection failed", { tabId, error });
    return false;
  }
}

async function migrateVideoPipSetting() {
  const storage = chrome.storage?.local || chrome.storage?.sync;
  if (!storage?.get) {
    return true;
  }
  const stored = await storage.get({
    [VIDEO_PIP_ENABLED_STORAGE_KEY]: null,
    [LEGACY_VIDEO_PIP_GLOBAL_ENABLED_STORAGE_KEY]: false,
    [LEGACY_SOCIAL_VIDEO_EXTRACTOR_ENABLED_STORAGE_KEY]: true
  });
  const enabled = typeof stored[VIDEO_PIP_ENABLED_STORAGE_KEY] === "boolean"
    ? stored[VIDEO_PIP_ENABLED_STORAGE_KEY]
    : stored[LEGACY_VIDEO_PIP_GLOBAL_ENABLED_STORAGE_KEY] === true ||
      stored[LEGACY_SOCIAL_VIDEO_EXTRACTOR_ENABLED_STORAGE_KEY] !== false;
  const migration = {};
  if (typeof stored[VIDEO_PIP_ENABLED_STORAGE_KEY] !== "boolean") {
    migration[VIDEO_PIP_ENABLED_STORAGE_KEY] = enabled;
  }
  if (stored[LEGACY_VIDEO_PIP_GLOBAL_ENABLED_STORAGE_KEY] !== false) {
    migration[LEGACY_VIDEO_PIP_GLOBAL_ENABLED_STORAGE_KEY] = false;
  }
  if (Object.keys(migration).length) {
    await storage.set(migration);
  }
  return enabled;
}

async function invokeVideoPipSelection(tabId) {
  return chrome.scripting.executeScript({
    target: { tabId, allFrames: true },
    func: async () => {
      const controller = window.__wayleafVideoPipController;
      // An extension reload can leave a callable controller from the invalidated context on an open page.
      // Treat legacy or invalid controllers as unavailable so the current controller is injected again.
      if (
        typeof controller?.isReady !== "function" ||
        controller.isReady() !== true ||
        typeof controller?.startSelection !== "function"
      ) {
        return { ready: false, selectionActive: false };
      }
      return {
        ready: true,
        selectionActive: await controller.startSelection()
      };
    }
  });
}

async function startVideoPipSelection(tabId) {
  let results = await invokeVideoPipSelection(tabId);
  if (results.some((entry) => entry.result?.ready)) {
    return {
      ok: true,
      selectionActive: results.some((entry) => entry.result?.selectionActive)
    };
  }
  const injected = await injectVideoPipController(tabId);
  if (!injected) {
    throw new Error(`Unable to inject the video mini-player controller into tab ${tabId}.`);
  }
  try {
    results = await invokeVideoPipSelection(tabId);
  } catch (error) {
    console.warn("Wayleaf video mini-player activation failed", { tabId, error });
    throw error;
  }
  if (!results.some((entry) => entry.result?.ready)) {
    throw new Error(`Injected video mini-player controller did not initialize in tab ${tabId}.`);
  }
  return {
    ok: true,
    selectionActive: results.some((entry) => entry.result?.selectionActive)
  };
}

async function setVideoPipActionState(tabId, state, title = "Wayleaf") {
  await chrome.action.setBadgeBackgroundColor({ tabId, color: "#00b8d9" });
  await chrome.action.setBadgeText({ tabId, text: state === "active" ? "VID" : "" });
  await chrome.action.setTitle({ tabId, title });
}

async function handleVideoPipAction(tab) {
  if (!Number.isInteger(tab?.id)) {
    return { ok: false, reason: "missing-tab" };
  }
  if (!supportsVideoPip(tab.url || "")) {
    await chrome.action.setBadgeText({ tabId: tab.id, text: "" });
    await chrome.action.setTitle({ tabId: tab.id, title: "Wayleaf · Video mini-player is unavailable on this page" });
    return { ok: false, reason: "unsupported" };
  }
  try {
    if (!await migrateVideoPipSetting()) {
      await chrome.action.setBadgeText({ tabId: tab.id, text: "" });
      await chrome.action.setTitle({ tabId: tab.id, title: "Wayleaf · Video mini-player disabled in Laboratory" });
      return { ok: false, reason: "disabled" };
    }
    const result = await startVideoPipSelection(tab.id);
    await setVideoPipActionState(
      tab.id,
      result?.selectionActive ? "active" : "idle",
      result?.selectionActive
        ? "Wayleaf · Select a video to open in Picture-in-Picture"
        : "Wayleaf · No compatible video found"
    );
    return result?.selectionActive
      ? { ok: true, selectionActive: true }
      : { ok: false, reason: "no-video", selectionActive: false };
  } catch (error) {
    console.warn("Wayleaf video mini-player failed", { tabId: tab.id, url: tab.url || "", error });
    return { ok: false, reason: "failed" };
  }
}

async function handleVideoPipMenuAction() {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  return handleVideoPipAction(tab);
}

async function handleVideoPipSelectStatus(message, sender) {
  const tabId = sender?.tab?.id;
  if (!Number.isInteger(tabId)) {
    return;
  }
  if (message.type === "started") {
    await setVideoPipActionState(tabId, "active", "Wayleaf · Select a video to open in Picture-in-Picture");
    return;
  }
  const title = message.type === "entered"
    ? "Wayleaf · Video opened in Picture-in-Picture"
    : message.type === "failed"
      ? "Wayleaf · Picture-in-Picture request failed"
      : "Wayleaf";
  await setVideoPipActionState(tabId, "idle", title);
}

function aiDirectPromptRequest(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    const hashParams = new URLSearchParams(parsed.hash.replace(/^#/, ""));
    const token = parsed.searchParams.get(AI_DIRECT_PROMPT_TOKEN_PARAM) || "";
    const prompt = String(hashParams.get(AI_DIRECT_PROMPT_TEXT_PARAM) || "").trim().slice(0, AI_DIRECT_MAX_PROMPT_LENGTH);
    if (!AI_DIRECT_PROVIDER_HOSTS.has(host) || (!token && !prompt)) {
      return null;
    }
    return { host, token, prompt };
  } catch {
    return null;
  }
}

function aiDirectRequestMatchesUrl(request, url) {
  if (!request) {
    return false;
  }
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "") === request.host;
  } catch {
    return false;
  }
}

async function injectAiSubmit(tabId, request) {
  if (!chrome.scripting?.executeScript) {
    return;
  }
  if (!request) {
    return;
  }
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ["ai-submit.js"]
  });
  if (request.host === "jimeng.jianying.com") {
    const prompt = request.prompt || await readStoredAiPrompt(request.token, "jimeng");
    if (prompt) {
      await chrome.scripting.executeScript({
        target: { tabId },
        world: "MAIN",
        func: submitJimengPrompt,
        args: [prompt]
      });
    }
  }
  if (request.host === "chat.qwen.ai") {
    const prompt = request.prompt || await readStoredAiPrompt(request.token, "qwen");
    if (prompt) {
      await chrome.scripting.executeScript({
        target: { tabId },
        world: "MAIN",
        func: submitQwenPrompt,
        args: [prompt]
      });
    }
  }
}

async function handleGeminiAttachmentUpload(message, sender) {
  const tabId = sender?.tab?.id;
  if (!Number.isInteger(tabId) || !chrome.scripting?.executeScript) {
    return { ok: false };
  }
  const attachments = normalizeAiDirectAttachments(message.attachments);
  if (!attachments.length) {
    return { ok: false };
  }
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    world: "MAIN",
    func: uploadGeminiAttachments,
    args: [attachments]
  });
  return { ok: results?.[0]?.result === true };
}

async function readStoredAiPrompt(token, engineId) {
  if (!token || !chrome.storage?.local) {
    return "";
  }
  const result = await chrome.storage.local.get({ [AI_DIRECT_PROMPT_STORAGE_KEY]: {} });
  const item = result[AI_DIRECT_PROMPT_STORAGE_KEY]?.[token];
  return item?.engineId === engineId
    ? String(item.prompt || "").trim().slice(0, AI_DIRECT_MAX_PROMPT_LENGTH)
    : "";
}

function normalizeAiDirectAttachments(value) {
  return Array.isArray(value)
    ? value
      .filter((item) => item && typeof item === "object" && item.dataUrl && item.name)
      .slice(0, AI_DIRECT_ATTACHMENT_MAX_COUNT)
      .map((item) => ({
        dataUrl: String(item.dataUrl || ""),
        name: String(item.name || "attachment"),
        type: String(item.type || "application/octet-stream")
      }))
    : [];
}

function submitJimengPrompt(prompt) {
  const marker = "data-wayleaf-jimeng-handoff";
  const text = String(prompt || "").trim();
  if (!text) {
    return;
  }
  document.documentElement.setAttribute(marker, "pending");

  const deadline = Date.now() + 12000;
  const isVisible = (node) => {
    const rect = node.getBoundingClientRect();
    const style = window.getComputedStyle(node);
    return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
  };
  const editorText = (node) => (node.innerText || node.textContent || "").trim();

  const findEditor = () => [...document.querySelectorAll("div.tiptap.ProseMirror[contenteditable=\"true\"], div[role=\"textbox\"][contenteditable=\"true\"], [contenteditable=\"true\"]")]
      .filter(isVisible)
      .sort((a, b) => {
        const ar = a.getBoundingClientRect();
        const br = b.getBoundingClientRect();
        return (br.width * br.height) - (ar.width * ar.height);
      })[0] || null;
  const clickSubmit = () => {
    const button = [...document.querySelectorAll("button[class*=\"submit-button\"], button[aria-label*=\"生成\"], [role=\"button\"][aria-label*=\"生成\"]")]
      .filter((node) => {
        const disabled = node.disabled || node.getAttribute("aria-disabled") === "true" || node.getAttribute("data-disabled") === "true";
        return !disabled && isVisible(node);
      })
      .find((node) => String(node.className || "").includes("submit-button-XRhOZM"))
      || [...document.querySelectorAll("button[class*=\"submit-button\"], button[aria-label*=\"生成\"], [role=\"button\"][aria-label*=\"生成\"]")]
        .filter((node) => {
          const disabled = node.disabled || node.getAttribute("aria-disabled") === "true" || node.getAttribute("data-disabled") === "true";
          return !disabled && isVisible(node);
        })[0];
    if (button) {
      button.click();
      document.documentElement.setAttribute(marker, "submitted");
      return true;
    }
    return false;
  };
  const fillAndSubmit = () => {
    const editor = findEditor();
    if (!editor) {
      return false;
    }

    editor.focus();
    const selection = window.getSelection?.();
    if (selection) {
      const range = document.createRange();
      range.selectNodeContents(editor);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    const inserted = document.execCommand?.("insertText", false, text);
    if (!inserted || editorText(editor) !== text) {
      editor.textContent = "";
      editor.appendChild(document.createTextNode(text));
    }
    try {
      editor.dispatchEvent(new InputEvent("input", {
        bubbles: true,
        cancelable: true,
        composed: true,
        inputType: "insertText",
        data: text
      }));
    } catch {
      editor.dispatchEvent(new Event("input", { bubbles: true, cancelable: true, composed: true }));
    }
    editor.dispatchEvent(new Event("change", { bubbles: true, cancelable: true, composed: true }));
    return true;
  };

  let filled = false;
  const intervalId = window.setInterval(() => {
    if (!filled) {
      filled = fillAndSubmit();
    }
    if (filled && clickSubmit()) {
      window.clearInterval(intervalId);
      return;
    }
    if (Date.now() >= deadline) {
      window.clearInterval(intervalId);
    }
  }, 250);
}

function submitQwenPrompt(prompt) {
  const marker = "data-wayleaf-qwen-handoff";
  const text = String(prompt || "").trim();
  if (!text) {
    return;
  }
  document.documentElement.setAttribute(marker, "pending");

  const deadline = Date.now() + 12000;
  const isVisible = (node) => {
    const rect = node.getBoundingClientRect();
    const style = window.getComputedStyle(node);
    return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
  };
  const findInput = () => [...document.querySelectorAll("textarea.message-input-textarea, textarea")]
    .filter(isVisible)
    .sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      return (br.width * br.height) - (ar.width * ar.height);
    })[0] || null;
  const findSubmit = () => [...document.querySelectorAll("button.send-button")]
    .filter((node) => {
      const disabled = node.disabled || node.getAttribute("aria-disabled") === "true" || node.getAttribute("data-disabled") === "true";
      return !disabled && isVisible(node);
    })[0] || null;
  const dispatchMouseLikeEvent = (target, type) => {
    const rect = target.getBoundingClientRect();
    const options = {
      bubbles: true,
      cancelable: true,
      composed: true,
      view: window,
      button: 0,
      buttons: type.endsWith("down") ? 1 : 0,
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2
    };
    const EventConstructor = type.startsWith("pointer") && typeof PointerEvent === "function" ? PointerEvent : MouseEvent;
    target.dispatchEvent(new EventConstructor(type, {
      ...options,
      pointerId: 1,
      pointerType: "mouse",
      isPrimary: true
    }));
  };
  const dispatchEnter = (target) => {
    target.focus();
    for (const type of ["keydown", "keypress", "keyup"]) {
      target.dispatchEvent(new KeyboardEvent(type, {
        bubbles: true,
        cancelable: true,
        composed: true,
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13
      }));
    }
  };
  const dispatchQwenSendEvent = () => {
    document.dispatchEvent(new CustomEvent("QwenEvent.onSendMessage", {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: { inputText: text }
    }));
  };
  const fillInput = (input) => {
    input.focus();
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set
      || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), "value")?.set;
    if (setter) {
      setter.call(input, text);
    } else {
      input.value = text;
    }
    input._valueTracker?.setValue?.("");
    input.dispatchEvent(new InputEvent("input", {
      bubbles: true,
      cancelable: true,
      composed: true,
      inputType: "insertText",
      data: text
    }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    return input.value.trim() === text;
  };
  const submitInput = (input, button) => {
    dispatchQwenSendEvent();
    button.focus({ preventScroll: true });
    for (const type of ["pointerdown", "mousedown", "pointerup", "mouseup", "click"]) {
      dispatchMouseLikeEvent(button, type);
    }
    button.click();
    window.setTimeout(() => {
      if (input.isConnected && input.value.trim() === text) {
        dispatchEnter(input);
      }
    }, 600);
  };
  let filled = false;
  let lastSubmitAt = 0;
  const intervalId = window.setInterval(() => {
    const input = findInput();
    if (input && (!filled || input.value.trim() !== text)) {
      filled = fillInput(input);
    }
    if (filled && input && input.value.trim() !== text) {
      document.documentElement.setAttribute(marker, "submitted");
      window.clearInterval(intervalId);
      return;
    }
    if (filled) {
      const submitButton = findSubmit();
      if (input && submitButton && Date.now() - lastSubmitAt > 900) {
        lastSubmitAt = Date.now();
        submitInput(input, submitButton);
        document.documentElement.setAttribute(marker, "submitting");
      }
      if (!submitButton) {
        document.documentElement.setAttribute(marker, "filled");
      }
    }
    if (Date.now() > deadline) {
      document.documentElement.setAttribute(marker, filled ? "filled" : "missing");
      window.clearInterval(intervalId);
    }
  }, 250);
}

async function uploadGeminiAttachments(attachments) {
  const marker = "data-wayleaf-gemini-attachment-handoff";
  const root = document.documentElement;
  const files = attachments.map(attachmentToFile).filter(Boolean);
  if (!files.length) {
    root.setAttribute(marker, "missing");
    return false;
  }
  root.setAttribute(marker, "pending");

  const deadline = Date.now() + 15000;
  const delay = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
  const visible = (node) => {
    const rect = node.getBoundingClientRect();
    const style = window.getComputedStyle(node);
    return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
  };
  const clickable = (node) => node instanceof HTMLElement
    && !(node instanceof HTMLButtonElement && node.disabled)
    && node.getAttribute("aria-disabled") !== "true"
    && visible(node);
  const query = (selectors) => selectors.flatMap((selector) => [...document.querySelectorAll(selector)]);
  const waitFor = async (find, timeoutMs) => {
    const startedAt = Date.now();
    while (Date.now() - startedAt <= timeoutMs) {
      const match = find();
      if (match) {
        return match;
      }
      await delay(100);
    }
    return null;
  };
  const findInput = () => query(["input[type=\"file\"][multiple]", "input[type=\"file\"]"])
    .find((node) => node instanceof HTMLInputElement && node.type === "file" && !node.disabled) || null;
  const findToolsButton = () => query([
    "button[aria-label*=\"Add files\"]",
    "button[aria-label*=\"Upload\"]",
    "button[aria-label*=\"Attach\"]",
    "button[aria-label*=\"Upload and tools\"]",
    "button[aria-label*=\"上載同工具\"]",
    "button[aria-label*=\"添加文件\"]",
    "button[aria-label*=\"上传\"]"
  ]).find(clickable) || null;
  const findUploadMenuItem = () => query([
    "[data-test-id=\"local-images-files-uploader-button\"]",
    "[data-testid=\"local-images-files-uploader-button\"]",
    "button[aria-label*=\"Upload files\"]",
    "button[aria-label*=\"上載檔案\"]",
    "button[aria-label*=\"上传文件\"]",
    "button[aria-label*=\"上傳檔案\"]"
  ]).find(clickable) || null;
  const countFilePreviews = () => query([
    "uploader-file-preview",
    "uploader-file-preview-container",
    ".file-preview-chip",
    ".uploader-file-preview-container"
  ]).filter(visible).length;
  const initialPreviewCount = countFilePreviews();
  const hasFileChip = () => {
    const text = `${document.body?.innerText || ""} ${document.body?.textContent || ""}`;
    return files.some((file) => text.includes(file.name))
      || countFilePreviews() >= initialPreviewCount + files.length;
  };
  const findDropTarget = () => query([
    ".xap-uploader-dropzone",
    "input-area-v2",
    ".input-area",
    ".chat-container",
    "main"
  ]).find(visible) || document.body;
  const fileToWebkitEntry = (file) => ({
    file: (callback) => callback(file),
    fullPath: `/${file.name}`,
    isDirectory: false,
    isFile: true,
    name: file.name
  });
  const filesToUploadTransfer = () => {
    const uploadFiles = [...files];
    const items = uploadFiles.map((file) => ({
      getAsFile: () => file,
      kind: "file",
      type: file.type,
      webkitGetAsEntry: () => fileToWebkitEntry(file)
    }));
    uploadFiles.item = (index) => uploadFiles[index] || null;
    items.item = (index) => items[index] || null;
    return {
      clearData: () => undefined,
      dropEffect: "copy",
      effectAllowed: "all",
      files: uploadFiles,
      getData: () => "",
      items,
      setData: () => undefined,
      types: ["Files"]
    };
  };
  const dispatchUploadDrop = () => {
    const target = findDropTarget();
    const transfer = filesToUploadTransfer();
    for (const type of ["dragenter", "dragover", "drop"]) {
      const event = new Event(type, { bubbles: true, cancelable: true, composed: true });
      Object.defineProperty(event, "dataTransfer", { value: transfer });
      target.dispatchEvent(event);
    }
  };
  const attachToInput = (input) => {
    const transfer = new DataTransfer();
    files.forEach((file) => transfer.items.add(file));
    input.files = transfer.files;
    input.dispatchEvent(new Event("input", { bubbles: true, cancelable: true, composed: true }));
    input.dispatchEvent(new Event("change", { bubbles: true, cancelable: true, composed: true }));
  };

  let input = findInput();
  if (!hasFileChip() && !input) {
    const button = await waitFor(findToolsButton, 3000);
    button?.click();
    input = await waitFor(findInput, 600);
    if (!input) {
      const item = await waitFor(findUploadMenuItem, 1500);
      item?.click();
      input = await waitFor(findInput, 1500);
    }
  }
  if (!hasFileChip() && input) {
    attachToInput(input);
  } else if (!hasFileChip()) {
    dispatchUploadDrop();
    await delay(1200);
  }

  while (Date.now() <= deadline) {
    if (hasFileChip()) {
      root.setAttribute(marker, "uploaded");
      return true;
    }
    await delay(200);
  }
  root.setAttribute(marker, "failed");
  return false;

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
}

chrome.runtime?.onInstalled?.addListener((details) => {
  if (details.reason === "install") {
    chrome.storage?.local?.set({ [RECENT_HISTORY_STARTED_AT_STORAGE_KEY]: Date.now() })
      .catch(reportBackgroundError);
  }
  ensureDailyAutoSyncAlarm().catch(reportBackgroundError);
  migrateVideoPipSetting().catch(reportBackgroundError);
});

chrome.runtime?.onStartup?.addListener(() => {
  ensureDailyAutoSyncAlarm().catch(reportBackgroundError);
  migrateVideoPipSetting().catch(reportBackgroundError);
});

chrome.alarms?.onAlarm?.addListener((alarm) => {
  if (alarm.name === AUTO_SYNC_ALARM_NAME) {
    runAutoSyncSettings().catch(reportBackgroundError);
  }
});

migrateVideoPipSetting().catch(reportBackgroundError);

chrome.runtime?.onMessage?.addListener((message, sender, sendResponse) => {
  if (message?.action === GEMINI_ATTACHMENT_UPLOAD_ACTION) {
    handleGeminiAttachmentUpload(message, sender)
      .then(sendResponse)
      .catch((error) => {
        console.warn("Wayleaf Gemini attachment upload failed", error);
        sendResponse({ ok: false });
      });
    return true;
  }
  if (message?.action === VIDEO_PIP_ACTIVATE_ACTION) {
    handleVideoPipMenuAction()
      .then(sendResponse)
      .catch((error) => {
        console.warn("Wayleaf toolbar video mini-player request failed", { error });
        sendResponse({ ok: false, reason: "failed" });
      });
    return true;
  }
  if (message?.action === VIDEO_PIP_SELECT_STATUS_ACTION) {
    handleVideoPipSelectStatus(message, sender).catch(reportBackgroundError);
    sendResponse({ ok: true });
    return;
  }
});

chrome.tabs?.onUpdated?.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    chrome.action?.setBadgeText({ tabId, text: "" }).catch(reportBackgroundError);
    chrome.action?.setTitle({ tabId, title: "Wayleaf" }).catch(reportBackgroundError);
  }
  const url = changeInfo.url || tab.url || "";
  const request = aiDirectPromptRequest(url);
  if (request) {
    pendingAiDirectRequests.set(tabId, request);
  }
  if (changeInfo.status && changeInfo.status !== "complete") {
    return;
  }
  const pendingRequest = request || (
    aiDirectRequestMatchesUrl(pendingAiDirectRequests.get(tabId), url)
      ? pendingAiDirectRequests.get(tabId)
      : null
  );
  if (pendingRequest) {
    pendingAiDirectRequests.delete(tabId);
    injectAiSubmit(tabId, pendingRequest).catch(reportBackgroundError);
  }
});

chrome.tabs?.onRemoved?.addListener((tabId) => {
  pendingAiDirectRequests.delete(tabId);
});

ensureDailyAutoSyncAlarm().catch(reportBackgroundError);
