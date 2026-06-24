"use strict";

(() => {
  if (window.__wayleafVideoPipController) {
    return;
  }
  window.__wayleafVideoPipController = true;

  const GLOBAL_ENABLED_STORAGE_KEY = "videoPipGlobalEnabled";
  const TOGGLE_PIN_ACTION = "wayleaf:toggle-video-pip-pin";
  const REQUEST_ACTION = "wayleaf:video-pip-request";
  const COMMAND_ACTION = "wayleaf:video-pip-command";
  let globalEnabled = false;
  let pinned = false;
  let entering = false;
  let exiting = false;
  let managedPipNeedsCleanup = false;
  let managedPipVideo = null;
  let extensionContextInvalid = false;

  function noteExtensionContextError(error) {
    if (String(error?.message || error).includes("Extension context invalidated")) {
      extensionContextInvalid = true;
      return true;
    }
    return false;
  }

  function guardExtensionContext(callback, fallback) {
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
    if (extensionContextInvalid || typeof chrome === "undefined") {
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
    if (!hasExtensionContext()) {
      return;
    }
    try {
      chrome.runtime.sendMessage(message).catch(noteExtensionContextError);
    } catch (error) {
      noteExtensionContextError(error);
    }
  }

  function enabled() {
    return globalEnabled || pinned;
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

  function queryVideos(root = document, seen = new Set()) {
    if (extensionContextInvalid || seen.has(root)) {
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
    return;
  }

  try {
    chrome.storage.local.get({ [GLOBAL_ENABLED_STORAGE_KEY]: false }, (result) => {
      updateGlobalEnabled(result?.[GLOBAL_ENABLED_STORAGE_KEY]);
    });
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === "local" && changes[GLOBAL_ENABLED_STORAGE_KEY]) {
        updateGlobalEnabled(changes[GLOBAL_ENABLED_STORAGE_KEY].newValue);
      }
    });
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
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
    });
  } catch {
    extensionContextInvalid = true;
    return;
  }

  document.addEventListener("visibilitychange", handleVisibilityChange, true);
  document.addEventListener("play", handleVideoPlayback, true);
  document.addEventListener("playing", handleVideoPlayback, true);
  document.addEventListener("loadedmetadata", handleVideoPlayback, true);
  document.addEventListener("leavepictureinpicture", (event) => {
    guardExtensionContext(() => {
      if (event.target === managedPipVideo) {
        managedPipNeedsCleanup = false;
        managedPipVideo = null;
        notifyCoordinator("left");
      }
    });
  }, true);
})();
