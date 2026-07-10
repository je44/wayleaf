"use strict";

const VIDEO_PIP_ACTIVATE_ACTION = "wayleaf:video-pip-activate";
const VIDEO_PIP_ENABLED_STORAGE_KEY = "videoPipEnabled";

const videoPipAction = document.querySelector("#videoPipAction");
let activeTab = null;

function message(key, fallback = "") {
  return chrome.i18n?.getMessage?.(key) || fallback;
}

function applyLocalizedCopy() {
  document.documentElement.lang = String(chrome.i18n?.getUILanguage?.() || "en").replace("_", "-");
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = message(node.dataset.i18n, node.textContent);
  });
}

function setActionState(key, fallback, state = "") {
  const detail = message(key, fallback);
  const label = message("popupVideoPipLabel", "Video mini-player");
  videoPipAction.title = detail;
  videoPipAction.setAttribute("aria-label", detail ? `${label}. ${detail}` : label);
  videoPipAction.dataset.state = state;
}

function supportsVideoPip(url) {
  try {
    return ["http:", "https:"].includes(new URL(url).protocol);
  } catch {
    return false;
  }
}

async function initializePopup() {
  applyLocalizedCopy();
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  activeTab = tab || null;
  if (!Number.isInteger(activeTab?.id) || !supportsVideoPip(activeTab?.url || "")) {
    videoPipAction.disabled = true;
    setActionState("popupVideoPipUnavailable", "Unavailable on this page.");
    return;
  }
  const stored = await chrome.storage.local.get({ [VIDEO_PIP_ENABLED_STORAGE_KEY]: null });
  if (stored[VIDEO_PIP_ENABLED_STORAGE_KEY] === false) {
    videoPipAction.disabled = true;
    setActionState("popupVideoPipDisabled", "Enable Video mini-player in Laboratory first.");
    return;
  }
  setActionState("", "");
}

async function activateVideoPip() {
  if (videoPipAction.disabled || !Number.isInteger(activeTab?.id)) {
    return;
  }
  videoPipAction.disabled = true;
  setActionState("popupVideoPipStarting", "Starting video selection…");
  try {
    const response = await chrome.runtime.sendMessage({ action: VIDEO_PIP_ACTIVATE_ACTION });
    if (response?.ok && response?.selectionActive) {
      window.close();
      return;
    }
    if (response?.reason === "disabled") {
      setActionState("popupVideoPipDisabled", "Enable Video mini-player in Laboratory first.");
      return;
    }
    if (response?.reason === "unsupported") {
      setActionState("popupVideoPipUnavailable", "Unavailable on this page.");
      return;
    }
    if (response?.reason === "no-video") {
      setActionState("popupVideoPipNoVideo", "No compatible video was found on this page.", "error");
      videoPipAction.disabled = false;
      return;
    }
    console.error("Wayleaf toolbar video mini-player activation failed", {
      tabId: activeTab.id,
      url: activeTab.url || "",
      reason: response?.reason || "unknown"
    });
    setActionState("popupVideoPipFailed", "Could not start video selection.", "error");
    videoPipAction.disabled = false;
  } catch (error) {
    console.error("Wayleaf toolbar video mini-player activation failed", {
      tabId: activeTab.id,
      url: activeTab.url || "",
      error
    });
    setActionState("popupVideoPipFailed", "Could not start video selection.", "error");
    videoPipAction.disabled = false;
  }
}

videoPipAction.addEventListener("click", activateVideoPip);
initializePopup().catch((error) => {
  console.error("Wayleaf toolbar menu initialization failed", { error });
  videoPipAction.disabled = true;
  setActionState("popupVideoPipFailed", "Could not start video selection.", "error");
});
