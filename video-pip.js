"use strict";

(() => {
  const CONTROLLER_KEY = "__wayleafVideoPipController";
  const LANGUAGE_STORAGE_KEY = "languagePreference";
  const SELECT_STATUS_ACTION = "wayleaf:video-pip-select-status";
  const SELECT_HIGHLIGHT_COLOR = "#00b8d9";
  const MIN_SELECTABLE_VIDEO_AREA = 12000;
  const SELECT_PROMPT_BY_LOCALE = {
    "zh-CN": "选择需要小窗播放的视频",
    "zh-TW": "選擇要以小視窗播放的影片",
    en: "Select a video to open in Picture-in-Picture",
    ja: "ピクチャーインピクチャーで開く動画を選択",
    ko: "PIP로 열 동영상을 선택하세요",
    es: "Selecciona un vídeo para abrirlo en imagen en imagen",
    fr: "Sélectionnez une vidéo à ouvrir en mode image dans l’image",
    de: "Wähle ein Video für Bild-in-Bild aus"
  };

  let disposed = false;
  let extensionContextInvalid = false;
  let languagePreference = "system";
  let selectionActive = false;
  let selectionEntering = false;
  let selectionTargetVideo = null;
  let selectionOverlay = null;
  let selectionPrompt = null;
  const documentListeners = [];

  function isExtensionContextError(error) {
    return String(error?.message || error).includes("Extension context invalidated");
  }

  function noteExtensionContextError(error) {
    if (!isExtensionContextError(error)) {
      return false;
    }
    extensionContextInvalid = true;
    controller.dispose({ clearControllerKey: false });
    return true;
  }

  function reportControllerError(message, error, details = {}) {
    if (!noteExtensionContextError(error)) {
      console.warn(message, { ...details, error });
    }
  }

  function clearSelectionUi() {
    selectionActive = false;
    selectionTargetVideo = null;
    selectionOverlay?.remove();
    selectionOverlay = null;
    selectionPrompt?.remove();
    selectionPrompt = null;
  }

  const controller = {
    isReady() {
      return !disposed && !extensionContextInvalid && hasExtensionContext();
    },
    async startSelection() {
      if (disposed || extensionContextInvalid) {
        return false;
      }
      languagePreference = await readLanguagePreference();
      return startVideoSelection();
    },
    dispose({ clearControllerKey = true } = {}) {
      disposed = true;
      clearSelectionUi();
      for (const [type, listener, options] of documentListeners.splice(0)) {
        try {
          document.removeEventListener(type, listener, options);
        } catch (error) {
          if (!isExtensionContextError(error)) {
            console.warn("Wayleaf video mini-player listener cleanup failed", { type, error });
          }
        }
      }
      try {
        if (clearControllerKey && window[CONTROLLER_KEY] === controller) {
          delete window[CONTROLLER_KEY];
        }
      } catch (error) {
        if (!isExtensionContextError(error)) {
          console.warn("Wayleaf video mini-player controller cleanup failed", error);
        }
      }
    }
  };

  let previousController = null;
  try {
    previousController = window[CONTROLLER_KEY];
  } catch (error) {
    if (!isExtensionContextError(error)) {
      throw error;
    }
  }
  if (typeof previousController?.dispose === "function") {
    try {
      previousController.dispose();
    } catch (error) {
      if (!isExtensionContextError(error)) {
        throw error;
      }
    }
  }
  try {
    window[CONTROLLER_KEY] = controller;
  } catch (error) {
    if (!isExtensionContextError(error)) {
      throw error;
    }
    extensionContextInvalid = true;
    controller.dispose({ clearControllerKey: false });
    return;
  }

  function hasExtensionContext() {
    if (disposed || extensionContextInvalid || typeof chrome === "undefined") {
      return false;
    }
    try {
      return Boolean(chrome.runtime?.id);
    } catch (error) {
      noteExtensionContextError(error);
      return false;
    }
  }

  function safeSendStatus(type) {
    if (!hasExtensionContext()) {
      return;
    }
    try {
      chrome.runtime.sendMessage({ action: SELECT_STATUS_ACTION, type }).catch((error) => {
        reportControllerError("Wayleaf video mini-player status update failed", error, { type });
      });
    } catch (error) {
      reportControllerError("Wayleaf video mini-player status update failed", error, { type });
    }
  }

  function readLanguagePreference() {
    if (!hasExtensionContext() || !chrome.storage?.local?.get) {
      return Promise.resolve("system");
    }
    return new Promise((resolve) => {
      try {
        chrome.storage.local.get({ [LANGUAGE_STORAGE_KEY]: "system" }, (result) => {
          const error = chrome.runtime?.lastError;
          if (error) {
            console.warn("Wayleaf video mini-player language read failed", error);
            resolve("system");
            return;
          }
          resolve(result?.[LANGUAGE_STORAGE_KEY] || "system");
        });
      } catch (error) {
        reportControllerError("Wayleaf video mini-player language read failed", error);
        resolve("system");
      }
    });
  }

  function videoArea(video) {
    try {
      const rect = video.getBoundingClientRect?.();
      const renderedArea = Math.max(0, Number(rect?.width || 0)) * Math.max(0, Number(rect?.height || 0));
      return renderedArea || (Number(video.videoWidth || 0) * Number(video.videoHeight || 0));
    } catch (error) {
      reportControllerError("Wayleaf video mini-player could not measure a video", error);
      return 0;
    }
  }

  function visibleVideoRect(video) {
    try {
      const rect = video.getBoundingClientRect?.();
      const width = Math.max(0, Number(rect?.width || 0));
      const height = Math.max(0, Number(rect?.height || 0));
      const left = Number(rect?.left || 0);
      const top = Number(rect?.top || 0);
      const right = Number.isFinite(Number(rect?.right)) ? Number(rect.right) : left + width;
      const bottom = Number.isFinite(Number(rect?.bottom)) ? Number(rect.bottom) : top + height;
      if (
        width * height < MIN_SELECTABLE_VIDEO_AREA ||
        right <= 0 ||
        bottom <= 0 ||
        left >= Number(window.innerWidth || right) ||
        top >= Number(window.innerHeight || bottom)
      ) {
        return null;
      }
      return { left, top, width, height };
    } catch (error) {
      reportControllerError("Wayleaf video mini-player could not locate a video", error);
      return null;
    }
  }

  function queryVideos(root = document, seen = new Set()) {
    if (disposed || extensionContextInvalid || seen.has(root) || !root?.querySelectorAll) {
      return [];
    }
    seen.add(root);
    let videos = [];
    let nodes = [];
    try {
      videos = [...root.querySelectorAll("video")];
      nodes = [...root.querySelectorAll("*")];
    } catch (error) {
      reportControllerError("Wayleaf video mini-player video scan failed", error);
      return [];
    }
    for (const node of nodes) {
      try {
        if (node.shadowRoot) {
          videos.push(...queryVideos(node.shadowRoot, seen));
        }
      } catch (error) {
        reportControllerError("Wayleaf video mini-player shadow-root scan failed", error);
      }
    }
    return videos;
  }

  function supportsPictureInPicture(video) {
    try {
      return video instanceof HTMLVideoElement &&
        video.paused === false &&
        video.ended !== true &&
        typeof video.requestPictureInPicture === "function" &&
        Boolean(visibleVideoRect(video));
    } catch (error) {
      reportControllerError("Wayleaf video mini-player eligibility check failed", error);
      return false;
    }
  }

  function allowPictureInPicture(video) {
    try {
      if (!video.disablePictureInPicture) {
        return true;
      }
      video.disablePictureInPicture = false;
      video.removeAttribute?.("disablepictureinpicture");
      return !video.disablePictureInPicture;
    } catch (error) {
      reportControllerError("Wayleaf video mini-player could not enable Picture-in-Picture", error);
      return false;
    }
  }

  function pickLargestSelectableVideo() {
    return queryVideos()
      .filter(supportsPictureInPicture)
      .sort((left, right) => videoArea(right) - videoArea(left))[0] || null;
  }

  function pointInsideRect(rect, x, y) {
    return x >= rect.left && x <= rect.left + rect.width && y >= rect.top && y <= rect.top + rect.height;
  }

  function pickSelectableVideoAtPoint(x, y) {
    return queryVideos()
      .filter((video) => {
        const rect = visibleVideoRect(video);
        return rect && pointInsideRect(rect, x, y) && supportsPictureInPicture(video);
      })
      .sort((left, right) => videoArea(right) - videoArea(left))[0] || null;
  }

  function selectionPromptText() {
    const language = languagePreference === "system"
      ? (chrome.i18n?.getUILanguage?.() || navigator.language || "en")
      : languagePreference;
    const normalized = String(language).replace("_", "-");
    const locale = /^zh(?:-|$)/i.test(normalized)
      ? (/(?:tw|hk|mo|hant)/i.test(normalized) ? "zh-TW" : "zh-CN")
      : normalized.split("-")[0].toLowerCase();
    return SELECT_PROMPT_BY_LOCALE[locale] || SELECT_PROMPT_BY_LOCALE.en;
  }

  function ensureSelectionOverlay() {
    if (selectionOverlay?.isConnected) {
      return selectionOverlay;
    }
    const overlay = document.createElement("div");
    overlay.setAttribute("aria-hidden", "true");
    overlay.style.setProperty("all", "initial");
    overlay.style.position = "fixed";
    overlay.style.zIndex = "2147483647";
    overlay.style.boxSizing = "border-box";
    overlay.style.display = "none";
    overlay.style.border = `3px dashed ${SELECT_HIGHLIGHT_COLOR}`;
    overlay.style.borderRadius = "8px";
    overlay.style.background = "rgb(0 184 217 / 10%)";
    overlay.style.boxShadow = "0 4px 7px rgb(0 0 0 / 20%)";
    overlay.style.pointerEvents = "auto";
    overlay.style.userSelect = "none";
    (document.body || document.documentElement)?.append(overlay);
    selectionOverlay = overlay;
    return overlay;
  }

  function ensureSelectionPrompt() {
    if (selectionPrompt?.isConnected) {
      return selectionPrompt;
    }
    const prompt = document.createElement("div");
    prompt.textContent = selectionPromptText();
    prompt.style.setProperty("all", "initial");
    prompt.style.position = "fixed";
    prompt.style.left = "16px";
    prompt.style.right = "16px";
    prompt.style.bottom = "28px";
    prompt.style.zIndex = "2147483647";
    prompt.style.boxSizing = "border-box";
    prompt.style.display = "flex";
    prompt.style.alignItems = "center";
    prompt.style.justifyContent = "center";
    prompt.style.width = "fit-content";
    prompt.style.maxWidth = "calc(100vw - 32px)";
    prompt.style.margin = "0 auto";
    prompt.style.padding = "10px 18px";
    prompt.style.borderRadius = "999px";
    prompt.style.background = "rgb(0 0 0 / 80%)";
    prompt.style.boxShadow = "0 14px 34px rgb(0 0 0 / 26%)";
    prompt.style.color = "#fff";
    prompt.style.fontFamily = "system-ui, sans-serif";
    prompt.style.fontSize = "14px";
    prompt.style.fontWeight = "600";
    prompt.style.lineHeight = "20px";
    prompt.style.textAlign = "center";
    prompt.style.whiteSpace = "nowrap";
    prompt.style.pointerEvents = "none";
    prompt.style.userSelect = "none";
    (document.body || document.documentElement)?.append(prompt);
    selectionPrompt = prompt;
    return prompt;
  }

  function updateSelectionOverlay(video) {
    const overlay = ensureSelectionOverlay();
    const rect = video ? visibleVideoRect(video) : null;
    selectionTargetVideo = rect ? video : null;
    if (!rect) {
      overlay.style.display = "none";
      return;
    }
    overlay.style.left = `${Math.round(rect.left)}px`;
    overlay.style.top = `${Math.round(rect.top)}px`;
    overlay.style.width = `${Math.round(rect.width)}px`;
    overlay.style.height = `${Math.round(rect.height)}px`;
    overlay.style.display = "grid";
  }

  function stopVideoSelection(type = "cancelled") {
    clearSelectionUi();
    safeSendStatus(type);
  }

  function startVideoSelection() {
    if (selectionActive) {
      return true;
    }
    const video = pickLargestSelectableVideo();
    if (!video) {
      return false;
    }
    selectionActive = true;
    ensureSelectionPrompt();
    updateSelectionOverlay(video);
    safeSendStatus("started");
    return true;
  }

  async function enterSelectedPictureInPicture(video) {
    if (selectionEntering || !video || !supportsPictureInPicture(video) || document.pictureInPictureEnabled !== true) {
      return false;
    }
    if (!allowPictureInPicture(video)) {
      return false;
    }
    selectionEntering = true;
    try {
      await video.requestPictureInPicture();
      return true;
    } catch (error) {
      reportControllerError("Wayleaf video mini-player Picture-in-Picture request failed", error, {
        sourceUrl: String(window.location?.href || ""),
        videoArea: videoArea(video)
      });
      return false;
    } finally {
      selectionEntering = false;
    }
  }

  function handleSelectionPointerMove(event) {
    if (selectionActive) {
      updateSelectionOverlay(pickSelectableVideoAtPoint(event.clientX, event.clientY));
    }
  }

  function handleSelectionClick(event) {
    if (!selectionActive) {
      return;
    }
    const video = pickSelectableVideoAtPoint(event.clientX, event.clientY) || selectionTargetVideo;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!video) {
      stopVideoSelection("cancelled");
      return;
    }
    clearSelectionUi();
    enterSelectedPictureInPicture(video).then((entered) => {
      safeSendStatus(entered ? "entered" : "failed");
    });
  }

  function handleSelectionKeydown(event) {
    if (selectionActive && event.key === "Escape") {
      event.preventDefault();
      event.stopImmediatePropagation();
      stopVideoSelection("cancelled");
    }
  }

  function handleSelectionViewportChange() {
    if (selectionActive) {
      updateSelectionOverlay(selectionTargetVideo);
    }
  }

  function addDocumentListener(type, listener, options) {
    document.addEventListener(type, listener, options);
    documentListeners.push([type, listener, options]);
  }

  if (!hasExtensionContext() || !chrome.runtime?.sendMessage || !chrome.storage?.local?.get) {
    controller.dispose();
    return;
  }

  addDocumentListener("pointermove", handleSelectionPointerMove, true);
  addDocumentListener("click", handleSelectionClick, true);
  addDocumentListener("keydown", handleSelectionKeydown, true);
  addDocumentListener("scroll", handleSelectionViewportChange, true);
  addDocumentListener("pagehide", () => {
    if (selectionActive) {
      stopVideoSelection("cancelled");
    }
  }, true);
})();
