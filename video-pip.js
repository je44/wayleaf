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

  function enabled() {
    return globalEnabled || pinned;
  }

  function isPlaying(video) {
    return video instanceof HTMLVideoElement &&
      !video.paused &&
      !video.ended &&
      Number(video.readyState || 0) >= 2;
  }

  function videoArea(video) {
    const rect = video.getBoundingClientRect?.();
    const renderedArea = Math.max(0, Number(rect?.width || 0)) * Math.max(0, Number(rect?.height || 0));
    return renderedArea || (Number(video.videoWidth || 0) * Number(video.videoHeight || 0));
  }

  function queryVideos(root = document, seen = new Set()) {
    if (!root?.querySelectorAll || seen.has(root)) {
      return [];
    }
    seen.add(root);
    const videos = [...root.querySelectorAll("video")];
    for (const node of root.querySelectorAll("*")) {
      if (node.shadowRoot) {
        videos.push(...queryVideos(node.shadowRoot, seen));
      }
    }
    return videos;
  }

  function allowPictureInPicture(video) {
    if (!video.disablePictureInPicture) {
      return true;
    }
    try {
      video.disablePictureInPicture = false;
      video.removeAttribute?.("disablepictureinpicture");
    } catch {
      return false;
    }
    return !video.disablePictureInPicture;
  }

  function pickPlayingVideo() {
    return queryVideos()
      .filter((video) => (
        isPlaying(video) &&
        Number(video.videoWidth || 0) > 0 &&
        Number(video.videoHeight || 0) > 0 &&
        typeof video.requestPictureInPicture === "function"
      ))
      .sort((left, right) => videoArea(right) - videoArea(left))[0] || null;
  }

  function notifyCoordinator(type) {
    if (type === "enter") {
      if (!enabled() || document.visibilityState !== "hidden") {
        return;
      }
      const video = pickPlayingVideo();
      if (!video || document.pictureInPictureEnabled !== true) {
        return;
      }
      chrome.runtime.sendMessage({ action: REQUEST_ACTION, type, score: videoArea(video) }).catch(() => {});
      return;
    }
    chrome.runtime.sendMessage({ action: REQUEST_ACTION, type }).catch(() => {});
  }

  async function enterPictureInPicture() {
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
  }

  async function exitManagedPictureInPicture() {
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
    notifyCoordinator(document.visibilityState === "hidden" ? "enter" : "exit");
  }

  function handleVideoPlayback(event) {
    if (!(event.target instanceof HTMLVideoElement) || !isPlaying(event.target)) {
      return;
    }
    bindAutomaticPictureInPicture();
    notifyCoordinator("enter");
  }

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

  document.addEventListener("visibilitychange", handleVisibilityChange, true);
  document.addEventListener("play", handleVideoPlayback, true);
  document.addEventListener("playing", handleVideoPlayback, true);
  document.addEventListener("loadedmetadata", handleVideoPlayback, true);
  document.addEventListener("leavepictureinpicture", (event) => {
    if (event.target === managedPipVideo) {
      managedPipNeedsCleanup = false;
      managedPipVideo = null;
      notifyCoordinator("left");
    }
  }, true);
})();
