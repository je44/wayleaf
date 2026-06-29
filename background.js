"use strict";

importScripts("video-pip-coordinator.js");

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
const VIDEO_PIP_REQUEST_ACTION = "wayleaf:video-pip-request";
const VIDEO_PIP_COMMAND_ACTION = "wayleaf:video-pip-command";
const SOCIAL_VIDEO_EXTRACT_START_ACTION = "wayleaf:social-video-extract-start";
const SOCIAL_VIDEO_EXTRACT_STATUS_ACTION = "wayleaf:social-video-extract-status";
const VIDEO_PIP_OWNER_STORAGE_KEY = "videoPipOwner";
const VIDEO_PIP_GLOBAL_ENABLED_STORAGE_KEY = "videoPipGlobalEnabled";
const SOCIAL_VIDEO_EXTRACTOR_ENABLED_STORAGE_KEY = "socialVideoExtractorEnabled";
const SOCIAL_VIDEO_EXTRACT_HOSTS = new Set([
  "x.com",
  "www.x.com",
  "twitter.com",
  "www.twitter.com",
  "xiaohongshu.com",
  "www.xiaohongshu.com"
]);
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

function supportsSocialVideoExtraction(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return SOCIAL_VIDEO_EXTRACT_HOSTS.has(host) || SOCIAL_VIDEO_EXTRACT_HOSTS.has(`www.${host}`);
  } catch {
    return false;
  }
}

let fallbackVideoPipOwner = null;

async function loadVideoPipOwner() {
  if (!chrome.storage?.session) {
    return fallbackVideoPipOwner;
  }
  const stored = await chrome.storage.session.get({ [VIDEO_PIP_OWNER_STORAGE_KEY]: null });
  return stored[VIDEO_PIP_OWNER_STORAGE_KEY] || null;
}

async function saveVideoPipOwner(owner) {
  fallbackVideoPipOwner = owner;
  if (chrome.storage?.session) {
    await chrome.storage.session.set({ [VIDEO_PIP_OWNER_STORAGE_KEY]: owner });
  }
}

function videoPipMessageTarget(target) {
  if (target.documentId) {
    return { documentId: target.documentId };
  }
  return { frameId: Number.isInteger(target.frameId) ? target.frameId : 0 };
}

async function sendVideoPipCommand(target, command) {
  return chrome.tabs.sendMessage(
    target.tabId,
    { action: VIDEO_PIP_COMMAND_ACTION, command },
    videoPipMessageTarget(target)
  );
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
  } catch {
    return false;
  }
}

async function refreshVideoPipControllersInOpenTabs() {
  if (!chrome.tabs?.query || !chrome.scripting?.executeScript) {
    return;
  }
  const tabs = await chrome.tabs.query({});
  await Promise.all(tabs
    .filter((tab) => Number.isInteger(tab.id) && supportsVideoPip(tab.url || ""))
    .map((tab) => injectVideoPipController(tab.id)));
}

async function refreshVideoPipControllersWhenGlobalEnabled() {
  if (!chrome.storage?.local?.get) {
    return;
  }
  const stored = await chrome.storage.local.get({ [VIDEO_PIP_GLOBAL_ENABLED_STORAGE_KEY]: false });
  if (stored[VIDEO_PIP_GLOBAL_ENABLED_STORAGE_KEY] === true) {
    await refreshVideoPipControllersInOpenTabs();
  }
}

async function injectVideoPipControllerWhenGlobalEnabled(tabId, url) {
  if (!Number.isInteger(tabId) || !supportsVideoPip(url || "")) {
    return;
  }
  const stored = await chrome.storage.local.get({ [VIDEO_PIP_GLOBAL_ENABLED_STORAGE_KEY]: false });
  if (stored[VIDEO_PIP_GLOBAL_ENABLED_STORAGE_KEY] === true) {
    await injectVideoPipController(tabId);
  }
}

const videoPipCoordinator = globalThis.WayleafVideoPipCoordinator.create({
  command: sendVideoPipCommand,
  loadOwner: loadVideoPipOwner,
  saveOwner: saveVideoPipOwner
});

function videoPipSourceTabId(owner) {
  return Number.isInteger(owner?.sourceTabId) ? owner.sourceTabId : owner?.tabId;
}

async function handleVideoPipTabUpdated(tabId, changeInfo, tab) {
  if (!changeInfo?.url && changeInfo?.status !== "loading") {
    return;
  }
  const owner = await loadVideoPipOwner();
  if (videoPipSourceTabId(owner) !== tabId) {
    return;
  }
  await videoPipCoordinator.handle(
    { type: "source-lost", sourceUrl: changeInfo.url || tab?.url || owner?.sourceUrl || "" },
    { tabId }
  );
}

async function handleVideoPipTabRemoved(tabId) {
  const owner = await loadVideoPipOwner();
  if (videoPipSourceTabId(owner) !== tabId) {
    return;
  }
  await videoPipCoordinator.handle({ type: "removed" }, { tabId });
}

function videoPipTargetFromSender(sender, score = 0) {
  if (!Number.isInteger(sender?.tab?.id)) {
    return null;
  }
  return {
    tabId: sender.tab.id,
    frameId: Number.isInteger(sender.frameId) ? sender.frameId : 0,
    documentId: typeof sender.documentId === "string" ? sender.documentId : "",
    score: Math.max(0, Number(score || 0))
  };
}

async function socialVideoExtractorEnabled() {
  const storage = chrome.storage?.local || chrome.storage?.sync;
  if (!storage?.get) {
    return true;
  }
  const stored = await storage.get({ [SOCIAL_VIDEO_EXTRACTOR_ENABLED_STORAGE_KEY]: true });
  return stored[SOCIAL_VIDEO_EXTRACTOR_ENABLED_STORAGE_KEY] !== false;
}

async function startSocialVideoExtraction(tabId) {
  try {
    return await chrome.tabs.sendMessage(tabId, { action: SOCIAL_VIDEO_EXTRACT_START_ACTION });
  } catch {
    await injectVideoPipController(tabId);
    return chrome.tabs.sendMessage(tabId, { action: SOCIAL_VIDEO_EXTRACT_START_ACTION });
  }
}

async function setSocialVideoExtractActionState(tabId, state, title = "Wayleaf") {
  await chrome.action.setBadgeBackgroundColor({ tabId, color: "#00b8d9" });
  await chrome.action.setBadgeText({ tabId, text: state === "active" ? "VID" : "" });
  await chrome.action.setTitle({ tabId, title });
}

async function handleVideoPipAction(tab) {
  if (!Number.isInteger(tab?.id)) {
    return;
  }
  if (!supportsVideoPip(tab.url || "") || !supportsSocialVideoExtraction(tab.url || "")) {
    await chrome.action.setBadgeText({ tabId: tab.id, text: "" });
    await chrome.action.setTitle({ tabId: tab.id, title: "Wayleaf · Social video mini-player supports Xiaohongshu and X" });
    return;
  }
  try {
    if (!await socialVideoExtractorEnabled()) {
      await chrome.action.setBadgeText({ tabId: tab.id, text: "" });
      await chrome.action.setTitle({ tabId: tab.id, title: "Wayleaf · Social video mini-player disabled in Laboratory" });
      return;
    }
    const result = await startSocialVideoExtraction(tab.id);
    await setSocialVideoExtractActionState(
      tab.id,
      result?.extractorActive ? "active" : "idle",
      result?.extractorActive
        ? "Wayleaf · Move over the social video, then click to extract"
        : "Wayleaf · No compatible social video found"
    );
  } catch (error) {
    console.warn("Wayleaf social video mini-player failed", error);
  }
}

async function handleSocialVideoExtractStatus(message, sender) {
  const tabId = sender?.tab?.id;
  if (!Number.isInteger(tabId)) {
    return;
  }
  if (message.type === "started") {
    await setSocialVideoExtractActionState(tabId, "active", "Wayleaf · Move over the social video, then click to extract");
    return;
  }
  await setSocialVideoExtractActionState(tabId, "idle", message.type === "entered" ? "Wayleaf · Social video extracted" : "Wayleaf");
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
  refreshVideoPipControllersWhenGlobalEnabled().catch(reportBackgroundError);
});

chrome.runtime?.onStartup?.addListener(() => {
  ensureDailyAutoSyncAlarm().catch(reportBackgroundError);
  refreshVideoPipControllersWhenGlobalEnabled().catch(reportBackgroundError);
});

chrome.alarms?.onAlarm?.addListener((alarm) => {
  if (alarm.name === AUTO_SYNC_ALARM_NAME) {
    runAutoSyncSettings().catch(reportBackgroundError);
  }
});

chrome.storage?.onChanged?.addListener((changes, areaName) => {
  if (areaName === "local" && changes[VIDEO_PIP_GLOBAL_ENABLED_STORAGE_KEY]?.newValue === true) {
    refreshVideoPipControllersInOpenTabs().catch(reportBackgroundError);
  }
});

refreshVideoPipControllersWhenGlobalEnabled().catch(reportBackgroundError);

chrome.action?.onClicked?.addListener((tab) => {
  handleVideoPipAction(tab).catch(reportBackgroundError);
});

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
  if (message?.action === SOCIAL_VIDEO_EXTRACT_STATUS_ACTION) {
    handleSocialVideoExtractStatus(message, sender).catch(reportBackgroundError);
    sendResponse({ ok: true });
    return;
  }
  if (message?.action !== VIDEO_PIP_REQUEST_ACTION) {
    return;
  }
  const target = videoPipTargetFromSender(sender, message.score);
  if (!target) {
    sendResponse({ ok: false });
    return;
  }
  videoPipCoordinator.handle(message, target)
    .then(sendResponse)
    .catch((error) => {
      console.warn("Wayleaf video PiP coordination failed", error);
      sendResponse({ ok: false });
    });
  return true;
});

chrome.tabs?.onUpdated?.addListener((tabId, changeInfo, tab) => {
  handleVideoPipTabUpdated(tabId, changeInfo, tab).catch(reportBackgroundError);
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
  if (changeInfo.status === "complete") {
    injectVideoPipControllerWhenGlobalEnabled(tabId, url).catch(reportBackgroundError);
  }
  const pendingRequest = request || pendingAiDirectRequests.get(tabId);
  if (pendingRequest) {
    pendingAiDirectRequests.delete(tabId);
    injectAiSubmit(tabId, pendingRequest).catch(reportBackgroundError);
  }
});

chrome.tabs?.onRemoved?.addListener((tabId) => {
  pendingAiDirectRequests.delete(tabId);
  handleVideoPipTabRemoved(tabId).catch(reportBackgroundError);
});

ensureDailyAutoSyncAlarm().catch(reportBackgroundError);
