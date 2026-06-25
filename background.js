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
const VIDEO_PIP_TOGGLE_ACTION = "wayleaf:toggle-video-pip-pin";
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

function toggleVideoPipPinInFrame() {
  const controller = window.__wayleafVideoPipController;
  return typeof controller?.togglePin === "function" ? controller.togglePin() : null;
}

function pickVideoPipToggleResult(results) {
  return (Array.isArray(results) ? results : [])
    .map((item) => item?.result)
    .filter(Boolean)
    .sort((left, right) => Number(Boolean(right.hasVideo)) - Number(Boolean(left.hasVideo)))[0] || null;
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

const videoPipCoordinator = globalThis.WayleafVideoPipCoordinator.create({
  command: sendVideoPipCommand,
  loadOwner: loadVideoPipOwner,
  saveOwner: saveVideoPipOwner
});

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

async function toggleVideoPipPin(tabId) {
  if (!chrome.scripting?.executeScript) {
    return chrome.tabs.sendMessage(tabId, { action: VIDEO_PIP_TOGGLE_ACTION });
  }
  let result = pickVideoPipToggleResult(await chrome.scripting.executeScript({
    target: { tabId, allFrames: true },
    func: toggleVideoPipPinInFrame
  }));
  if (result) {
    return result;
  }
  await injectVideoPipController(tabId);
  result = pickVideoPipToggleResult(await chrome.scripting.executeScript({
    target: { tabId, allFrames: true },
    func: toggleVideoPipPinInFrame
  }));
  return result || { ok: false };
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
  if (!supportsVideoPip(tab.url || "")) {
    await chrome.action.setBadgeText({ tabId: tab.id, text: "" });
    await chrome.action.setTitle({ tabId: tab.id, title: "Wayleaf · Video PiP requires an HTTP(S) video page" });
    return;
  }
  try {
    if (supportsSocialVideoExtraction(tab.url || "") && await socialVideoExtractorEnabled()) {
      const result = await startSocialVideoExtraction(tab.id);
      await setSocialVideoExtractActionState(
        tab.id,
        result?.extractorActive ? "active" : "idle",
        result?.extractorActive
          ? "Wayleaf · Move over the social video, then click to extract"
          : "Wayleaf · No compatible social video found"
      );
      return;
    }
    const result = await toggleVideoPipPin(tab.id);
    const pinned = Boolean(result?.pinned);
    await chrome.action.setBadgeBackgroundColor({ tabId: tab.id, color: "#3f7f68" });
    await chrome.action.setBadgeText({ tabId: tab.id, text: pinned ? "PIP" : "" });
    await chrome.action.setTitle({
      tabId: tab.id,
      title: pinned
        ? "Wayleaf · Video PiP pinned"
        : (result?.globalEnabled ? "Wayleaf · Global video PiP enabled" : "Wayleaf")
    });
  } catch (error) {
    console.warn("Wayleaf video PiP pin failed", error);
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
  const pendingRequest = request || pendingAiDirectRequests.get(tabId);
  if (pendingRequest) {
    pendingAiDirectRequests.delete(tabId);
    injectAiSubmit(tabId, pendingRequest).catch(reportBackgroundError);
  }
});

chrome.tabs?.onRemoved?.addListener((tabId) => {
  pendingAiDirectRequests.delete(tabId);
  videoPipCoordinator.handle({ type: "removed" }, { tabId }).catch(reportBackgroundError);
});

ensureDailyAutoSyncAlarm().catch(reportBackgroundError);
