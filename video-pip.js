"use strict";

(() => {
  const CONTROLLER_KEY = "__wayleafVideoPipController";
  const GLOBAL_ENABLED_STORAGE_KEY = "videoPipGlobalEnabled";
  const TOGGLE_PIN_ACTION = "wayleaf:toggle-video-pip-pin";
  const EXTRACT_START_ACTION = "wayleaf:social-video-extract-start";
  const EXTRACT_STATUS_ACTION = "wayleaf:social-video-extract-status";
  const REQUEST_ACTION = "wayleaf:video-pip-request";
  const COMMAND_ACTION = "wayleaf:video-pip-command";
  const EXTRACT_HIGHLIGHT_COLOR = "#00b8d9";
  const MIN_EXTRACT_VIDEO_AREA = 12000;
  let globalEnabled = false;
  let pinned = false;
  let entering = false;
  let extractEntering = false;
  let extractorActive = false;
  let exiting = false;
  let managedPipNeedsCleanup = false;
  let managedPipVideo = null;
  let extractTargetVideo = null;
  let extractOverlay = null;
  let extensionContextInvalid = false;
  let pendingVideoScan = false;
  let disposed = false;
  let mutationObserver = null;
  let storageChangeListener = null;
  let runtimeMessageListener = null;
  const documentListeners = [];
  const previousController = window[CONTROLLER_KEY];
  const controller = {
    dispose() {
      disposed = true;
      pendingVideoScan = false;
      extractorActive = false;
      extractOverlay?.remove();
      extractOverlay = null;
      for (const [type, listener, options] of documentListeners.splice(0)) {
        try {
          document.removeEventListener(type, listener, options);
        } catch {}
      }
      try {
        mutationObserver?.disconnect();
      } catch {}
      mutationObserver = null;
      try {
        if (typeof chrome !== "undefined" && storageChangeListener) {
          chrome.storage?.onChanged?.removeListener?.(storageChangeListener);
        }
      } catch {}
      try {
        if (typeof chrome !== "undefined" && runtimeMessageListener) {
          chrome.runtime?.onMessage?.removeListener?.(runtimeMessageListener);
        }
      } catch {}
      if (window[CONTROLLER_KEY] === controller) {
        try {
          delete window[CONTROLLER_KEY];
        } catch {
          window[CONTROLLER_KEY] = null;
        }
      }
    }
  };

  if (typeof previousController?.dispose === "function") {
    previousController.dispose();
  }
  window[CONTROLLER_KEY] = controller;

  function noteExtensionContextError(error) {
    if (String(error?.message || error).includes("Extension context invalidated")) {
      extensionContextInvalid = true;
      controller.dispose();
      return true;
    }
    return false;
  }

  function guardExtensionContext(callback, fallback) {
    if (disposed) {
      return fallback;
    }
    try {
      return callback();
    } catch (error) {
      if (noteExtensionContextError(error)) {
        return fallback;
      }
      throw error;
    }
  }

  async function guardExtensionContextAsync(callback, fallback) {
    if (disposed) {
      return fallback;
    }
    try {
      return await callback();
    } catch (error) {
      if (noteExtensionContextError(error)) {
        return fallback;
      }
      throw error;
    }
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

  function safeSendMessage(message) {
    if (disposed || !hasExtensionContext()) {
      return;
    }
    try {
      chrome.runtime.sendMessage(message).catch(noteExtensionContextError);
    } catch (error) {
      noteExtensionContextError(error);
    }
  }

  function enabled() {
    return !disposed && (globalEnabled || pinned);
  }

  function isPlaying(video) {
    try {
      return video instanceof HTMLVideoElement &&
        !video.paused &&
        !video.ended &&
        Number(video.readyState || 0) >= 2;
    } catch (error) {
      noteExtensionContextError(error);
      return false;
    }
  }

  function videoArea(video) {
    try {
      const rect = video.getBoundingClientRect?.();
      const renderedArea = Math.max(0, Number(rect?.width || 0)) * Math.max(0, Number(rect?.height || 0));
      return renderedArea || (Number(video.videoWidth || 0) * Number(video.videoHeight || 0));
    } catch (error) {
      noteExtensionContextError(error);
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
        width * height < MIN_EXTRACT_VIDEO_AREA ||
        right <= 0 ||
        bottom <= 0 ||
        left >= Number(window.innerWidth || right) ||
        top >= Number(window.innerHeight || bottom)
      ) {
        return null;
      }
      return { left, top, width, height };
    } catch (error) {
      noteExtensionContextError(error);
      return null;
    }
  }

  function queryVideos(root = document, seen = new Set()) {
    if (disposed || extensionContextInvalid || seen.has(root)) {
      return [];
    }
    let videos = [];
    let nodes = [];
    try {
      if (!root?.querySelectorAll) {
        return [];
      }
      seen.add(root);
      videos = [...root.querySelectorAll("video")];
      nodes = [...root.querySelectorAll("*")];
    } catch (error) {
      noteExtensionContextError(error);
      return [];
    }
    for (const node of nodes) {
      let shadowRoot = null;
      try {
        shadowRoot = node.shadowRoot;
      } catch (error) {
        noteExtensionContextError(error);
      }
      if (shadowRoot) {
        videos.push(...queryVideos(shadowRoot, seen));
      }
    }
    return videos;
  }

  function nodeContainsVideo(node, seen = new Set()) {
    if (!node || seen.has(node)) {
      return false;
    }
    seen.add(node);
    try {
      if (node instanceof HTMLVideoElement) {
        return true;
      }
      if (typeof node.querySelector === "function" && node.querySelector("video")) {
        return true;
      }
      const shadowRoot = node.shadowRoot;
      return Boolean(shadowRoot && nodeContainsVideo(shadowRoot, seen));
    } catch (error) {
      noteExtensionContextError(error);
      return false;
    }
  }

  function scheduleVideoScan() {
    if (disposed || pendingVideoScan) {
      return;
    }
    pendingVideoScan = true;
    Promise.resolve().then(() => {
      pendingVideoScan = false;
      if (disposed) {
        return;
      }
      notifyCoordinator("enter");
    });
  }

  function handleDomMutation(mutations) {
    guardExtensionContext(() => {
      if (!enabled() || document.visibilityState !== "hidden") {
        return;
      }
      if (mutations.some((mutation) => [...mutation.addedNodes || []].some((node) => nodeContainsVideo(node)))) {
        scheduleVideoScan();
      }
    });
  }

  function supportsPictureInPicture(video) {
    try {
      return Number(video.videoWidth || 0) > 0 &&
        Number(video.videoHeight || 0) > 0 &&
        typeof video.requestPictureInPicture === "function";
    } catch (error) {
      noteExtensionContextError(error);
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
    } catch {
      return false;
    }
  }

  function pickPlayingVideo() {
    return queryVideos()
      .filter((video) => (
        isPlaying(video) &&
        supportsPictureInPicture(video)
      ))
      .sort((left, right) => videoArea(right) - videoArea(left))[0] || null;
  }

  function pickLargestExtractableVideo() {
    return queryVideos()
      .filter((video) => supportsPictureInPicture(video) && visibleVideoRect(video))
      .sort((left, right) => videoArea(right) - videoArea(left))[0] || null;
  }

  function pointInsideRect(rect, x, y) {
    return x >= rect.left && x <= rect.left + rect.width && y >= rect.top && y <= rect.top + rect.height;
  }

  function pickExtractableVideoAtPoint(x, y) {
    return queryVideos()
      .filter((video) => {
        const rect = visibleVideoRect(video);
        return rect && pointInsideRect(rect, x, y) && supportsPictureInPicture(video);
      })
      .sort((left, right) => videoArea(right) - videoArea(left))[0] || null;
  }

  function ensureExtractOverlay() {
    if (extractOverlay?.isConnected) {
      return extractOverlay;
    }
    const overlay = document.createElement("div");
    overlay.setAttribute("aria-hidden", "true");
    overlay.style.setProperty("all", "initial");
    overlay.style.position = "fixed";
    overlay.style.zIndex = "2147483647";
    overlay.style.boxSizing = "border-box";
    overlay.style.display = "none";
    overlay.style.border = `3px dashed ${EXTRACT_HIGHLIGHT_COLOR}`;
    overlay.style.borderRadius = "8px";
    overlay.style.background = "rgb(0 184 217 / 10%)";
    overlay.style.pointerEvents = "none";
    overlay.style.userSelect = "none";
    (document.body || document.documentElement)?.append(overlay);
    extractOverlay = overlay;
    return overlay;
  }

  function updateExtractOverlay(video) {
    const overlay = ensureExtractOverlay();
    const rect = video ? visibleVideoRect(video) : null;
    extractTargetVideo = rect ? video : null;
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

  function stopVideoExtractor(type = "cancelled") {
    extractorActive = false;
    extractTargetVideo = null;
    extractOverlay?.remove();
    extractOverlay = null;
    safeSendMessage({ action: EXTRACT_STATUS_ACTION, type });
  }

  function startVideoExtractor() {
    if (extractorActive) {
      stopVideoExtractor("cancelled");
      return false;
    }
    const video = pickLargestExtractableVideo();
    if (!video) {
      return false;
    }
    extractorActive = true;
    updateExtractOverlay(video);
    safeSendMessage({ action: EXTRACT_STATUS_ACTION, type: "started" });
    return true;
  }

  async function enterExtractedPictureInPicture(video) {
    if (extractEntering || !video || !supportsPictureInPicture(video) || document.pictureInPictureEnabled !== true) {
      return false;
    }
    if (!allowPictureInPicture(video)) {
      return false;
    }
    extractEntering = true;
    try {
      await video.requestPictureInPicture();
      return true;
    } catch {
      return false;
    } finally {
      extractEntering = false;
    }
  }

  function handleExtractorPointerMove(event) {
    if (!extractorActive) {
      return;
    }
    updateExtractOverlay(pickExtractableVideoAtPoint(event.clientX, event.clientY));
  }

  function handleExtractorClick(event) {
    if (!extractorActive) {
      return;
    }
    const video = pickExtractableVideoAtPoint(event.clientX, event.clientY) || extractTargetVideo;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!video) {
      stopVideoExtractor("cancelled");
      return;
    }
    extractorActive = false;
    extractOverlay?.remove();
    extractOverlay = null;
    enterExtractedPictureInPicture(video).then((entered) => {
      stopVideoExtractor(entered ? "entered" : "failed");
    });
  }

  function handleExtractorKeydown(event) {
    if (extractorActive && event.key === "Escape") {
      event.preventDefault();
      event.stopImmediatePropagation();
      stopVideoExtractor("cancelled");
    }
  }

  function handleExtractorViewportChange() {
    if (extractorActive) {
      updateExtractOverlay(extractTargetVideo);
    }
  }

  function notifyCoordinator(type) {
    guardExtensionContext(() => {
      if (type === "enter") {
        if (!enabled() || document.visibilityState !== "hidden") {
          return;
        }
        const video = pickPlayingVideo();
        if (!video || document.pictureInPictureEnabled !== true) {
          return;
        }
        safeSendMessage({ action: REQUEST_ACTION, type, score: videoArea(video) });
        return;
      }
      safeSendMessage({ action: REQUEST_ACTION, type });
    });
  }

  async function enterPictureInPicture() {
    return guardExtensionContextAsync(async () => {
      if (!enabled() || document.visibilityState !== "hidden" || entering || exiting || document.pictureInPictureElement) {
        return false;
      }
      const video = pickPlayingVideo();
      if (!video || document.pictureInPictureEnabled !== true) {
        return false;
      }
      if (!allowPictureInPicture(video)) {
        return false;
      }
      entering = true;
      try {
        await video.requestPictureInPicture();
        managedPipNeedsCleanup = true;
        managedPipVideo = video;
        return true;
      } catch {
        return false;
      } finally {
        entering = false;
      }
    }, false);
  }

  async function exitManagedPictureInPicture() {
    return guardExtensionContextAsync(async () => {
      if (!managedPipNeedsCleanup || exiting || entering) {
        return false;
      }
      if (!document.pictureInPictureElement) {
        managedPipNeedsCleanup = false;
        managedPipVideo = null;
        return false;
      }
      if (document.pictureInPictureElement !== managedPipVideo) {
        managedPipNeedsCleanup = false;
        managedPipVideo = null;
        return false;
      }
      exiting = true;
      try {
        await document.exitPictureInPicture();
        managedPipNeedsCleanup = false;
        managedPipVideo = null;
        return true;
      } catch {
        return false;
      } finally {
        exiting = false;
      }
    }, false);
  }

  function bindAutomaticPictureInPicture() {
    if (!enabled() || !navigator.mediaSession?.setActionHandler) {
      return;
    }
    try {
      navigator.mediaSession.setActionHandler("enterpictureinpicture", () => notifyCoordinator("enter"));
    } catch {
      // Older Chromium builds may not expose this media session action.
    }
  }

  function updateGlobalEnabled(value) {
    globalEnabled = value === true;
    if (enabled()) {
      bindAutomaticPictureInPicture();
      notifyCoordinator("enter");
      return;
    }
    notifyCoordinator("exit");
  }

  function handleVisibilityChange() {
    guardExtensionContext(() => {
      notifyCoordinator(document.visibilityState === "hidden" ? "enter" : "exit");
    });
  }

  function handleVideoPlayback(event) {
    guardExtensionContext(() => {
      if (!(event.target instanceof HTMLVideoElement) || !isPlaying(event.target)) {
        return;
      }
      bindAutomaticPictureInPicture();
      notifyCoordinator("enter");
    });
  }

  if (
    !hasExtensionContext() ||
    !chrome.storage?.local?.get ||
    !chrome.storage?.onChanged?.addListener ||
    !chrome.runtime?.onMessage?.addListener
  ) {
    controller.dispose();
    return;
  }

  try {
    chrome.storage.local.get({ [GLOBAL_ENABLED_STORAGE_KEY]: false }, (result) => {
      updateGlobalEnabled(result?.[GLOBAL_ENABLED_STORAGE_KEY]);
    });
    storageChangeListener = (changes, areaName) => {
      if (areaName === "local" && changes[GLOBAL_ENABLED_STORAGE_KEY]) {
        updateGlobalEnabled(changes[GLOBAL_ENABLED_STORAGE_KEY].newValue);
      }
    };
    chrome.storage.onChanged.addListener(storageChangeListener);
    runtimeMessageListener = (message, _sender, sendResponse) => {
      if (message?.action === EXTRACT_START_ACTION) {
        sendResponse({ ok: true, extractorActive: startVideoExtractor() });
        return;
      }
      if (message?.action === TOGGLE_PIN_ACTION) {
        pinned = !pinned;
        if (enabled()) {
          bindAutomaticPictureInPicture();
          notifyCoordinator("enter");
        } else {
          notifyCoordinator("exit");
        }
        sendResponse({ ok: true, pinned, globalEnabled, enabled: enabled() });
        return;
      }
      if (message?.action !== COMMAND_ACTION) {
        return;
      }
      (async () => {
        if (message.command === "enter") {
          sendResponse({ entered: await enterPictureInPicture() });
          return;
        }
        if (message.command === "exit") {
          sendResponse({ exited: await exitManagedPictureInPicture() });
          return;
        }
        sendResponse({ ok: false });
      })();
      return true;
    };
    chrome.runtime.onMessage.addListener(runtimeMessageListener);
  } catch {
    extensionContextInvalid = true;
    controller.dispose();
    return;
  }

  function addDocumentListener(type, listener, options) {
    document.addEventListener(type, listener, options);
    documentListeners.push([type, listener, options]);
  }

  function handleLeavePictureInPicture(event) {
    guardExtensionContext(() => {
      if (event.target === managedPipVideo) {
        managedPipNeedsCleanup = false;
        managedPipVideo = null;
        notifyCoordinator("left");
      }
    });
  }

  addDocumentListener("visibilitychange", handleVisibilityChange, true);
  addDocumentListener("pointermove", handleExtractorPointerMove, true);
  addDocumentListener("click", handleExtractorClick, true);
  addDocumentListener("keydown", handleExtractorKeydown, true);
  addDocumentListener("scroll", handleExtractorViewportChange, true);
  addDocumentListener("play", handleVideoPlayback, true);
  addDocumentListener("playing", handleVideoPlayback, true);
  addDocumentListener("loadedmetadata", handleVideoPlayback, true);
  if (typeof MutationObserver === "function") {
    try {
      mutationObserver = new MutationObserver(handleDomMutation);
      mutationObserver.observe(document.documentElement || document, {
        childList: true,
        subtree: true
      });
    } catch {
      // DOM observation is only a retry path; media events still drive normal PiP.
    }
  }
  addDocumentListener("leavepictureinpicture", handleLeavePictureInPicture, true);
})();
