"use strict";

(() => {
  if (window.__wayleafVideoPipController || window.top !== window.self) {
    return;
  }
  window.__wayleafVideoPipController = true;

  const GLOBAL_ENABLED_STORAGE_KEY = "videoPipGlobalEnabled";
  const TOGGLE_PIN_ACTION = "wayleaf:toggle-video-pip-pin";
  let globalEnabled = false;
  let pinned = false;
  let entering = false;
  let exiting = false;
  let managedPipNeedsCleanup = false;
  let managedPipVideo = null;
  let exitFrame = 0;

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

  function pickPlayingVideo() {
    return [...document.querySelectorAll("video")]
      .filter((video) => (
        isPlaying(video) &&
        !video.disablePictureInPicture &&
        Number(video.videoWidth || 0) > 0 &&
        Number(video.videoHeight || 0) > 0 &&
        typeof video.requestPictureInPicture === "function"
      ))
      .sort((left, right) => videoArea(right) - videoArea(left))[0] || null;
  }

  function cancelScheduledExit() {
    if (!exitFrame) {
      return;
    }
    cancelAnimationFrame(exitFrame);
    exitFrame = 0;
  }

  async function enterPictureInPicture() {
    if (!enabled() || document.visibilityState !== "hidden" || entering || exiting || document.pictureInPictureElement) {
      return false;
    }
    const video = pickPlayingVideo();
    if (!video || document.pictureInPictureEnabled !== true) {
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

  function scheduleManagedPictureInPictureExit() {
    if (exitFrame || !managedPipNeedsCleanup) {
      return;
    }
    exitFrame = requestAnimationFrame(() => {
      exitFrame = requestAnimationFrame(() => {
        exitFrame = 0;
        void exitManagedPictureInPicture();
      });
    });
  }

  function bindAutomaticPictureInPicture() {
    if (!enabled() || !navigator.mediaSession?.setActionHandler) {
      return;
    }
    try {
      navigator.mediaSession.setActionHandler("enterpictureinpicture", enterPictureInPicture);
    } catch {
      // Older Chromium builds may not expose this media session action.
    }
  }

  function updateGlobalEnabled(value) {
    globalEnabled = value === true;
    if (enabled()) {
      bindAutomaticPictureInPicture();
      return;
    }
    void exitManagedPictureInPicture();
  }

  function handleVisibilityChange() {
    if (document.visibilityState === "hidden") {
      cancelScheduledExit();
      void enterPictureInPicture();
      return;
    }
    scheduleManagedPictureInPictureExit();
  }

  function handleVideoPlayback(event) {
    if (!(event.target instanceof HTMLVideoElement) || !isPlaying(event.target)) {
      return;
    }
    bindAutomaticPictureInPicture();
    if (document.visibilityState === "hidden") {
      void enterPictureInPicture();
    }
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
    if (message?.action !== TOGGLE_PIN_ACTION) {
      return;
    }
    pinned = !pinned;
    if (enabled()) {
      bindAutomaticPictureInPicture();
    } else {
      void exitManagedPictureInPicture();
    }
    sendResponse({ ok: true, pinned, globalEnabled, enabled: enabled() });
  });

  document.addEventListener("visibilitychange", handleVisibilityChange, true);
  document.addEventListener("play", handleVideoPlayback, true);
  document.addEventListener("playing", handleVideoPlayback, true);
  document.addEventListener("loadedmetadata", handleVideoPlayback, true);
  document.addEventListener("leavepictureinpicture", (event) => {
    if (event.target === managedPipVideo) {
      cancelScheduledExit();
      managedPipNeedsCleanup = false;
      managedPipVideo = null;
    }
  }, true);
})();
