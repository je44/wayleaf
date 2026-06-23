"use strict";

const AUTO_SYNC_ALARM_NAME = "wayleaf-daily-auto-sync";
const AUTO_SYNC_PERIOD_MINUTES = 24 * 60;
const CUSTOM_PORTALS_STORAGE_KEY = "customPortals";
const FAVORITE_SITES_STORAGE_KEY = "favoriteSites";
const PINNED_HISTORY_STORAGE_KEY = "pinnedHistory";
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
const SYNC_STORAGE_KEYS = [
  CUSTOM_PORTALS_STORAGE_KEY,
  FAVORITE_SITES_STORAGE_KEY,
  PINNED_HISTORY_STORAGE_KEY,
  BOOKMARK_FOLDER_STORAGE_KEY,
  PORTAL_CATEGORY_STATE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  THEME_PALETTE_STORAGE_KEY,
  LANGUAGE_STORAGE_KEY,
  SEARCH_SETTINGS_STORAGE_KEY,
  CUSTOM_MEDIA_FEEDS_STORAGE_KEY
];

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
    ...values,
    [SYNC_META_STORAGE_KEY]: {
      syncedAt: Date.now(),
      source: "auto"
    }
  });
}

function reportBackgroundError(error) {
  console.warn("Wayleaf background sync failed", error);
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
});

chrome.runtime?.onStartup?.addListener(() => {
  ensureDailyAutoSyncAlarm().catch(reportBackgroundError);
});

chrome.alarms?.onAlarm?.addListener((alarm) => {
  if (alarm.name === AUTO_SYNC_ALARM_NAME) {
    runAutoSyncSettings().catch(reportBackgroundError);
  }
});

chrome.tabs?.onUpdated?.addListener((tabId, changeInfo, tab) => {
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
});

ensureDailyAutoSyncAlarm().catch(reportBackgroundError);
