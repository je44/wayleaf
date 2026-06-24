import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const controllerSource = readFileSync(new URL("../video-pip.js", import.meta.url), "utf8");
const coordinatorSource = readFileSync(new URL("../video-pip-coordinator.js", import.meta.url), "utf8");
const backgroundSource = readFileSync(new URL("../background.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../newtab.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../newtab.css", import.meta.url), "utf8");
const packageSource = readFileSync(new URL("./package-release.sh", import.meta.url), "utf8");
const manifest = JSON.parse(readFileSync(new URL("../manifest.json", import.meta.url), "utf8"));

const messagesSource = readFileSync(new URL("../newtab.js", import.meta.url), "utf8")
  .match(/const MESSAGES = (\{[\s\S]*?\n\});\nconst LOCALE_COMPLETIONS =/)?.[1];
assert.ok(messagesSource, "Localized UI messages should be readable for Laboratory coverage.");
const messages = Function(`"use strict"; return (${messagesSource});`)();
for (const locale of ["zh-CN", "zh-TW", "en", "ja", "ko", "es", "fr", "de"]) {
  for (const key of [
    "settingsLaboratoryTab",
    "videoPipLabTitle",
    "videoPipLabDescription",
    "videoPipGlobalLabel",
    "videoPipGlobalHint",
    "socialVideoExtractorTitle",
    "socialVideoExtractorDescription",
    "socialVideoExtractorLabel",
    "socialVideoExtractorHint"
  ]) {
    if (locale === "zh-TW" && key === "videoPipLabDescription") {
      assert.equal(messages[locale]?.[key], "", `${locale}.${key} should be removed.`);
    } else {
      assert.ok(messages[locale]?.[key]?.trim(), `${locale}.${key} should be translated.`);
    }
  }
}

const videoContentScript = manifest.content_scripts.find((entry) => entry.js?.includes("video-pip.js"));
assert.ok(videoContentScript, "Manifest should load the video PiP controller on supported sites.");
assert.deepEqual(
  videoContentScript.matches,
  ["http://*/*", "https://*/*"],
  "The generic HTML5 video controller should be available to future platforms without host-specific code."
);
assert.equal(videoContentScript.all_frames, true, "Embedded players should use the same frame-aware PiP protocol.");
assert.equal(videoContentScript.match_about_blank, true, "Related about:blank video frames should receive the PiP controller.");
assert.equal(videoContentScript.match_origin_as_fallback, true, "Related blob/data video frames should receive the PiP controller.");
assert.equal(videoContentScript.run_at, "document_start", "Automatic PiP should register the Chrome media-session handler as early as the page allows.");
for (const runtimeFile of ["video-pip.js", "video-pip-coordinator.js"]) {
  assert.ok(packageSource.split(/\s+/).includes(runtimeFile), `Release packages should include ${runtimeFile}.`);
}
assert.match(
  backgroundSource,
  /chrome\.action\?\.onClicked\?\.addListener[\s\S]*handleVideoPipAction/,
  "The pinned Wayleaf toolbar action should toggle per-tab video PiP."
);
assert.match(
  backgroundSource,
  /target:\s*\{\s*tabId,\s*allFrames:\s*true\s*\}/,
  "Toolbar fallback injection should refresh the PiP controller in embedded frames."
);
assert.match(
  backgroundSource,
  /function injectVideoPipController\(tabId\)[\s\S]*target:\s*\{\s*tabId,\s*allFrames:\s*true\s*\}[\s\S]*files:\s*\["video-pip\.js"\]/,
  "Video PiP should have one all-frame controller injection path."
);
assert.match(
  backgroundSource,
  /function toggleVideoPipPinInFrame\(\)[\s\S]*__wayleafVideoPipController[\s\S]*togglePin/,
  "Toolbar pinning should call the in-frame video PiP controller directly."
);
assert.match(
  backgroundSource,
  /function pickVideoPipToggleResult\(results\)[\s\S]*hasVideo[\s\S]*return result \|\| \{ ok: false \};/,
  "All-frame toolbar pinning should prefer the frame that actually owns a video."
);
assert.match(
  backgroundSource,
  /function toggleVideoPipPin\(tabId\)[\s\S]*target:\s*\{\s*tabId,\s*allFrames:\s*true\s*\}[\s\S]*func:\s*toggleVideoPipPinInFrame/,
  "Toolbar pinning should fan out across all frames instead of trusting one tabs.sendMessage response."
);
assert.match(
  backgroundSource,
  /function refreshVideoPipControllersInOpenTabs\(\)[\s\S]*chrome\.tabs\.query\(\{\}\)[\s\S]*supportsVideoPip\(tab\.url \|\| ""\)[\s\S]*injectVideoPipController\(tab\.id\)/,
  "Open-tab PiP controller refresh should only target supported video tabs."
);
assert.match(
  backgroundSource,
  /function refreshVideoPipControllersWhenGlobalEnabled\(\)[\s\S]*chrome\.storage\.local\.get\(\{ \[VIDEO_PIP_GLOBAL_ENABLED_STORAGE_KEY\]: false \}\)[\s\S]*stored\[VIDEO_PIP_GLOBAL_ENABLED_STORAGE_KEY\] === true[\s\S]*refreshVideoPipControllersInOpenTabs\(\)/,
  "Service-worker reload/startup should reattach old video tabs only when global PiP is enabled."
);
assert.match(
  backgroundSource,
  /onInstalled\?\.addListener[\s\S]*refreshVideoPipControllersWhenGlobalEnabled\(\)/,
  "Reloaded unpacked extensions should check whether old video tabs need reattaching."
);
assert.match(
  backgroundSource,
  /refreshVideoPipControllersWhenGlobalEnabled\(\)\.catch\(reportBackgroundError\);[\s\S]*chrome\.action\?\.onClicked/,
  "A restarted service worker should check already-open video tabs before waiting for the next action."
);
assert.match(
  backgroundSource,
  /chrome\.storage\?\.onChanged\?\.addListener[\s\S]*VIDEO_PIP_GLOBAL_ENABLED_STORAGE_KEY[\s\S]*refreshVideoPipControllersInOpenTabs\(\)/,
  "Turning global PiP on should attach controllers to already-open tabs."
);
assert.match(
  backgroundSource,
  /supportsSocialVideoExtraction\(tab\.url \|\| ""\)[\s\S]*startSocialVideoExtraction[\s\S]*return;[\s\S]*const result = await toggleVideoPipPin/,
  "Toolbar action should reserve social-video extraction for Xiaohongshu-style hosts and leave dedicated video sites on pinned PiP."
);
assert.doesNotMatch(
  controllerSource,
  /window\[CONTROLLER_KEY\]\s*=\s*null/,
  "Invalidated content scripts must not write the controller marker while disposing."
);
assert.match(
  controllerSource,
  /togglePin\(\)\s*\{[\s\S]*togglePinned\(\)/,
  "The injected controller should expose the same pin toggle used by runtime messages."
);
assert.match(
  controllerSource,
  /async function enterPinnedPictureInPicture\(\)[\s\S]*pickPictureInPictureCandidateVideo\(\) \|\| pickLargestExtractableVideo\(\)[\s\S]*type: "entered"/,
  "Manual toolbar pinning should use the click gesture to request native PiP immediately."
);
assert.match(
  controllerSource,
  /async function handleAutomaticPictureInPicture\(\)[\s\S]*pickPlayingVideo\(\) \|\| pickPictureInPictureCandidateVideo\(\)[\s\S]*requestPictureInPictureForVideo\(video\)/,
  "Automatic PiP should follow Chrome's media-session handler path and prefer the playing video inside that handler."
);
assert.match(
  controllerSource,
  /setActionHandler\("enterpictureinpicture", enabled\(\) \? handleAutomaticPictureInPicture : null\)/,
  "Automatic PiP should unregister the Chrome media-session handler when Wayleaf disables PiP."
);
assert.match(
  html,
  /id="settingsLaboratoryTab"[\s\S]*data-settings-tab="laboratory"[\s\S]*id="videoPipGlobalToggle"[\s\S]*role="switch"[\s\S]*aria-checked="false"/,
  "Settings should expose the Laboratory destination and accessible global PiP switch."
);
assert.match(
  html,
  /aria-labelledby="socialVideoExtractorTitle"[\s\S]*id="socialVideoExtractorDescription"[\s\S]*id="socialVideoExtractorToggle"[\s\S]*role="switch"[\s\S]*aria-checked="true"/,
  "Settings should expose social video extraction as a separate default-on Laboratory feature."
);
assert.match(
  html,
  /id="videoPipLabDescription"[\s\S]*HTML5 video/,
  "The static Laboratory fallback copy should describe generic HTML5 video support."
);
assert.doesNotMatch(
  html,
  /Currently supported platforms: YouTube and Bilibili/,
  "Video PiP should not be documented as a two-platform feature."
);
assert.match(
  css,
  /\.laboratory-switch\s*\{[\s\S]*width:\s*52px;[\s\S]*height:\s*30px;[\s\S]*transform:\s*scale\(0\.8\);[\s\S]*\.laboratory-switch-thumb\s*\{[\s\S]*width:\s*22px;[\s\S]*height:\s*22px;[\s\S]*border-radius:\s*999px;[\s\S]*\.laboratory-switch\[aria-checked="true"\] \.laboratory-switch-thumb\s*\{[\s\S]*translateX\(22px\)/,
  "The Laboratory control should keep its layout position while rendering 20% smaller."
);

class FakeVideo {}

function createControllerHarness(initialController = undefined) {
  const documentListeners = new Map();
  const storageListeners = [];
  const runtimeListeners = [];
  const mutationObservers = [];
  let mediaSessionHandler = null;
  let requestCount = 0;
  let exitCount = 0;
  let animationFrameId = 0;
  const animationFrames = new Map();
  const coordinatorRequests = [];
  let queryVideos = [];
  const appendedElements = [];
  const appendElement = (node) => {
    node.isConnected = true;
    appendedElements.push(node);
  };
  const makeElement = () => ({
    isConnected: false,
    textContent: "",
    style: {
      setProperty(name, value) {
        this[name] = value;
      }
    },
    setAttribute() {},
    remove() {
      this.isConnected = false;
    }
  });
  const documentMock = {
    visibilityState: "visible",
    pictureInPictureEnabled: true,
    pictureInPictureElement: null,
    body: { append: appendElement },
    documentElement: { append: appendElement },
    createElement: makeElement,
    querySelectorAll(selector) {
      return selector === "video" ? queryVideos : [];
    },
    addEventListener(type, listener) {
      const listeners = documentListeners.get(type) || [];
      listeners.push(listener);
      documentListeners.set(type, listeners);
    },
    removeEventListener(type, listener) {
      documentListeners.set(type, (documentListeners.get(type) || []).filter((item) => item !== listener));
    },
    async exitPictureInPicture() {
      exitCount += 1;
      const video = this.pictureInPictureElement;
      this.pictureInPictureElement = null;
      for (const listener of documentListeners.get("leavepictureinpicture") || []) {
        listener({ type: "leavepictureinpicture", target: video });
      }
    }
  };
  const video = Object.assign(new FakeVideo(), {
    paused: true,
    ended: false,
    readyState: 4,
    videoWidth: 1280,
    videoHeight: 720,
    disablePictureInPicture: false,
    getBoundingClientRect() {
      return { width: 960, height: 540 };
    },
    async requestPictureInPicture() {
      requestCount += 1;
      documentMock.pictureInPictureElement = this;
    }
  });
  const replacementVideo = Object.assign(new FakeVideo(), {
    paused: false,
    ended: false,
    readyState: 4,
    videoWidth: 1280,
    videoHeight: 720,
    disablePictureInPicture: false,
    getBoundingClientRect() {
      return { width: 960, height: 540 };
    },
    async requestPictureInPicture() {
      throw new Error("replacement video should only cover stale PiP cleanup");
    }
  });
  const windowMock = {};
  windowMock.top = windowMock;
  windowMock.self = windowMock;
  windowMock.innerWidth = 1280;
  windowMock.innerHeight = 720;
  if (initialController?.throwOnControllerRead) {
    Object.defineProperty(windowMock, "__wayleafVideoPipController", {
      configurable: true,
      get() {
        throw new Error("Extension context invalidated.");
      },
      set(value) {
        Object.defineProperty(windowMock, "__wayleafVideoPipController", {
          configurable: true,
          writable: true,
          value
        });
      }
    });
  } else if (initialController !== undefined) {
    windowMock.__wayleafVideoPipController = initialController;
  }
  const chromeMock = {
    storage: {
      local: {
        get(_defaults, callback) {
          callback({ videoPipGlobalEnabled: false });
        }
      },
      onChanged: {
        addListener(listener) {
          storageListeners.push(listener);
        },
        removeListener(listener) {
          const index = storageListeners.indexOf(listener);
          if (index >= 0) {
            storageListeners.splice(index, 1);
          }
        }
      }
    },
    runtime: {
      id: "wayleaf-test",
      sendMessage(message) {
        coordinatorRequests.push(message);
        return Promise.resolve({ ok: true });
      },
      onMessage: {
        addListener(listener) {
          runtimeListeners.push(listener);
        },
        removeListener(listener) {
          const index = runtimeListeners.indexOf(listener);
          if (index >= 0) {
            runtimeListeners.splice(index, 1);
          }
        }
      }
    }
  };
  const context = {
    window: windowMock,
    document: documentMock,
    navigator: {
      mediaSession: {
        setActionHandler(action, handler) {
          if (action === "enterpictureinpicture") {
            mediaSessionHandler = handler;
          }
        }
      }
    },
    chrome: chromeMock,
    HTMLVideoElement: FakeVideo,
    requestAnimationFrame(callback) {
      animationFrameId += 1;
      animationFrames.set(animationFrameId, callback);
      return animationFrameId;
    },
    cancelAnimationFrame(frameId) {
      animationFrames.delete(frameId);
    },
    console,
    Promise,
    MutationObserver: class {
      constructor(callback) {
        this.callback = callback;
        mutationObservers.push(this);
      }

      observe(target, options) {
        this.target = target;
        this.options = options;
      }

      disconnect() {
        const index = mutationObservers.indexOf(this);
        if (index >= 0) {
          mutationObservers.splice(index, 1);
        }
      }
    }
  };
  vm.createContext(context);
  vm.runInContext(controllerSource, context);
  queryVideos = [video];
  return {
    documentMock,
    context,
    runtimeListeners,
    storageListeners,
    video,
    replacementVideo,
    coordinatorRequests,
    appendedElements,
    setQueryVideos(videos) {
      queryVideos = videos;
    },
    get mediaSessionHandler() {
      return mediaSessionHandler;
    },
    get requestCount() {
      return requestCount;
    },
    get exitCount() {
      return exitCount;
    },
    command(command) {
      return new Promise((resolve) => {
        for (const listener of runtimeListeners) {
          if (listener({ action: "wayleaf:video-pip-command", command }, {}, resolve) === true) {
            return;
          }
        }
        resolve(null);
      });
    },
    flushAnimationFrame() {
      const callbacks = [...animationFrames.values()];
      animationFrames.clear();
      for (const callback of callbacks) {
        callback();
      }
    },
    mutate(mutations) {
      for (const observer of mutationObservers) {
        observer.callback(mutations);
      }
    },
    dispatch(type, target = documentMock) {
      const event = target && typeof target === "object" && (
        "clientX" in target ||
        "clientY" in target ||
        "key" in target ||
        "preventDefault" in target
      )
        ? { type, target: target.target || documentMock, ...target }
        : { type, target };
      for (const listener of documentListeners.get(type) || []) {
        listener(event);
      }
    }
  };
}

function querySelectorAllForLightAndShadow(videos, shadowVideos = []) {
  const shadowHost = {
    shadowRoot: {
      querySelectorAll(selector) {
        return selector === "video" ? shadowVideos : [];
      }
    }
  };
  return (selector) => {
    if (selector === "video") {
      return videos;
    }
    if (selector === "*") {
      return shadowVideos.length ? [shadowHost] : [];
    }
    return [];
  };
}

const harness = createControllerHarness();
const { documentMock, runtimeListeners, storageListeners, video, replacementVideo, dispatch } = harness;
documentMock.querySelectorAll = querySelectorAllForLightAndShadow([video]);

async function settle() {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

video.paused = false;
const pinResponse = await new Promise((resolve) => {
  runtimeListeners[0]({ action: "wayleaf:toggle-video-pip-pin" }, {}, resolve);
});
assert.equal(pinResponse?.pinned, true, "Toolbar action should pin the current video tab.");
assert.equal(pinResponse?.entered, true, "Toolbar pinning should request native PiP from the user gesture.");
assert.equal(harness.requestCount, 1, "Toolbar pinning should enter PiP immediately for the selected playing video.");
assert.equal(typeof harness.mediaSessionHandler, "function", "Pinning should register the automatic PiP media-session handler.");
assert.ok(harness.coordinatorRequests.some((request) => request.type === "entered"), "Successful toolbar PiP should tell the coordinator which tab owns the window.");

const directToggleHarness = createControllerHarness();
directToggleHarness.documentMock.querySelectorAll = querySelectorAllForLightAndShadow([directToggleHarness.video]);
directToggleHarness.video.paused = false;
const directToggleResponse = await directToggleHarness.context.window.__wayleafVideoPipController.togglePin();
assert.equal(directToggleResponse?.pinned, true, "Background frame fan-out should reuse the same pin toggle path.");
assert.equal(directToggleResponse?.entered, true, "Background frame fan-out should request PiP inside the selected frame.");

const extractHarness = createControllerHarness();
extractHarness.documentMock.querySelectorAll = querySelectorAllForLightAndShadow([extractHarness.video]);
let extractStartResponse = null;
extractHarness.runtimeListeners[0]({ action: "wayleaf:social-video-extract-start" }, {}, (response) => {
  extractStartResponse = response;
});
assert.equal(extractStartResponse?.extractorActive, true, "Toolbar extraction should start a page-level video picker.");
assert.equal(extractHarness.appendedElements.at(-1)?.style.display, "grid", "Extraction should draw the detected video overlay.");
assert.equal(extractHarness.appendedElements.at(-1)?.textContent, "", "Extraction overlay should not cover the video with center text.");
assert.equal(extractHarness.appendedElements.at(-1)?.style.border, "3px dashed #00b8d9", "Extraction overlay should use a lake-blue border.");
assert.equal(extractHarness.appendedElements.at(-1)?.style.background, "rgb(0 184 217 / 10%)", "Extraction overlay fill should use 10% lake-blue transparency.");
extractHarness.dispatch("click", {
  clientX: 12,
  clientY: 12,
  preventDefault() {},
  stopImmediatePropagation() {}
});
await settle();
assert.equal(extractHarness.requestCount, 1, "Clicking a detected video should request native PiP from the page gesture.");
assert.equal(extractHarness.appendedElements.at(-1)?.isConnected, false, "Extraction should remove the overlay after a PiP attempt.");
assert.equal(extractHarness.coordinatorRequests.at(-1)?.type, "entered", "A successful extraction should clear the toolbar waiting state.");

documentMock.visibilityState = "hidden";
dispatch("visibilitychange");
await settle();
assert.equal(harness.requestCount, 1, "A pinned tab that already entered PiP should not request PiP again on hide.");
assert.equal(harness.coordinatorRequests.at(-1)?.type, "enter", "A pinned tab should notify the coordinator when it later becomes hidden.");

video.paused = false;
dispatch("playing", video);
await settle();
assert.equal(harness.requestCount, 1, "Content scripts must not enter a second PiP before the browser-level coordinator grants ownership.");
assert.equal(harness.coordinatorRequests.at(-1)?.type, "enter", "Hidden playback should request coordinated PiP ownership.");
assert.equal((await harness.command("enter"))?.entered, false, "The granted owner should not duplicate a PiP window opened from the toolbar gesture.");
assert.equal(harness.requestCount, 1, "The coordinator command should not duplicate an already-open pinned PiP window.");

documentMock.visibilityState = "visible";
dispatch("visibilitychange");
await settle();
assert.equal(harness.exitCount, 0, "Visible tabs should request release instead of racing a local delayed exit.");
assert.equal(harness.coordinatorRequests.at(-1)?.type, "exit", "Returning to the source tab should release coordinated ownership.");
assert.equal((await harness.command("exit"))?.exited, true, "The current owner should exit on coordinator command.");
assert.equal(harness.exitCount, 1, "The coordinator should close only the Wayleaf-managed PiP window.");

runtimeListeners[0]({ action: "wayleaf:toggle-video-pip-pin" }, {}, () => {});
storageListeners[0]({ videoPipGlobalEnabled: { newValue: true } }, "local");
video.paused = true;
documentMock.visibilityState = "visible";
dispatch("playing", video);
await settle();
assert.equal(harness.requestCount, 1, "Global mode must still ignore a supported page until video playback starts.");
assert.equal(harness.coordinatorRequests.at(-1)?.type, "exit", "Paused visible video should not request coordinated PiP.");

video.paused = false;
dispatch("playing", video);
await settle();
assert.equal(harness.coordinatorRequests.at(-1)?.type, "exit", "Resuming playback on the source tab should wait for a tab switch.");
documentMock.visibilityState = "hidden";
dispatch("visibilitychange");
await settle();
assert.equal(harness.coordinatorRequests.at(-1)?.type, "enter", "A resumed video should request coordinated PiP when the tab later becomes hidden.");
assert.equal((await harness.command("enter"))?.entered, true, "Global fallback should enter PiP for a resumed playing video after tab switch.");
assert.equal(harness.requestCount, 2, "Global fallback should cover Chrome auto-PiP eligibility misses.");
documentMock.visibilityState = "visible";
dispatch("visibilitychange");
await settle();
assert.equal(harness.coordinatorRequests.at(-1)?.type, "exit", "Returning to the source tab should release the global fallback owner.");
assert.equal((await harness.command("exit"))?.exited, true, "Returning to the source tab should close a Wayleaf-managed fallback PiP window.");
assert.equal(harness.exitCount, 2, "Global fallback PiP should auto-restore when the source tab is visible again.");

documentMock.visibilityState = "hidden";
documentMock.pictureInPictureElement = null;
video.paused = false;
const enabledMediaSessionHandler = harness.mediaSessionHandler;
await enabledMediaSessionHandler();
await settle();
assert.equal(harness.requestCount, 3, "Chrome's media-session automatic PiP handler should request native PiP directly.");
assert.equal(harness.coordinatorRequests.at(-1)?.type, "entered", "A media-session auto PiP entry should record the active owner.");

storageListeners[0]({ videoPipGlobalEnabled: { newValue: false } }, "local");
assert.equal(harness.mediaSessionHandler, null, "Disabling global PiP with no pin should unregister the automatic PiP handler.");
documentMock.pictureInPictureElement = null;
await enabledMediaSessionHandler();
await settle();
assert.equal(harness.requestCount, 3, "A stale Chrome automatic PiP handler should fail closed after Wayleaf disables PiP.");
storageListeners[0]({ videoPipGlobalEnabled: { newValue: true } }, "local");
assert.equal(typeof harness.mediaSessionHandler, "function", "Re-enabling global PiP should restore the automatic PiP handler.");

documentMock.pictureInPictureElement = replacementVideo;
documentMock.visibilityState = "visible";
const staleOtherVideoExitBaseline = harness.exitCount;
dispatch("visibilitychange");
await settle();
assert.equal((await harness.command("exit"))?.exited, false, "A stale owner must not close a PiP window opened for another video.");
assert.equal(harness.exitCount, staleOtherVideoExitBaseline, "Returning to the source tab must not close a PiP window opened for another video.");

documentMock.pictureInPictureElement = null;
documentMock.visibilityState = "hidden";
dispatch("play", video);
await settle();
assert.equal((await harness.command("enter"))?.entered, true, "A stale source-tab cleanup should not block the next grant.");
assert.equal(harness.requestCount, 4, "Global mode should still enter PiP again after a stale source-tab cleanup.");
documentMock.pictureInPictureElement = null;
dispatch("leavepictureinpicture", video);
await settle();
assert.equal(harness.coordinatorRequests.at(-1)?.type, "left", "A closed PiP window should release browser-level ownership.");
documentMock.visibilityState = "visible";
dispatch("visibilitychange");
await settle();
assert.equal(harness.exitCount, staleOtherVideoExitBaseline, "Returning after an already-closed PiP window should clear Wayleaf state without calling exit twice.");
documentMock.visibilityState = "hidden";
dispatch("play", video);
await settle();
assert.equal((await harness.command("enter"))?.entered, true, "A cleaned-up tab should accept a later grant.");
assert.equal(harness.requestCount, 5, "A tab should be able to re-enter PiP after the source page cleanup path.");

const externalHarness = createControllerHarness();
externalHarness.documentMock.querySelectorAll = querySelectorAllForLightAndShadow([externalHarness.replacementVideo]);
externalHarness.documentMock.pictureInPictureElement = externalHarness.replacementVideo;
externalHarness.setQueryVideos([externalHarness.replacementVideo]);
externalHarness.documentMock.visibilityState = "hidden";
externalHarness.dispatch("visibilitychange");
await settle();
externalHarness.documentMock.visibilityState = "visible";
externalHarness.dispatch("visibilitychange");
await externalHarness.command("exit");
assert.equal(externalHarness.exitCount, 0, "Wayleaf should not close PiP windows it did not open.");

const visibleLeaveHarness = createControllerHarness();
visibleLeaveHarness.documentMock.querySelectorAll = querySelectorAllForLightAndShadow([visibleLeaveHarness.video]);
visibleLeaveHarness.runtimeListeners[0]({ action: "wayleaf:toggle-video-pip-pin" }, {}, () => {});
visibleLeaveHarness.video.paused = false;
visibleLeaveHarness.documentMock.visibilityState = "hidden";
visibleLeaveHarness.dispatch("visibilitychange");
await settle();
await visibleLeaveHarness.command("enter");
assert.equal(visibleLeaveHarness.requestCount, 1, "Pinned playback should enter PiP for visible-leave cleanup coverage.");
visibleLeaveHarness.documentMock.pictureInPictureElement = null;
visibleLeaveHarness.documentMock.visibilityState = "visible";
visibleLeaveHarness.dispatch("leavepictureinpicture", visibleLeaveHarness.video);
visibleLeaveHarness.documentMock.pictureInPictureElement = visibleLeaveHarness.replacementVideo;
visibleLeaveHarness.dispatch("visibilitychange");
await visibleLeaveHarness.command("exit");
assert.equal(visibleLeaveHarness.exitCount, 0, "Visible PiP leave should clear Wayleaf state before another PiP window appears.");

const disabledHarness = createControllerHarness();
disabledHarness.documentMock.querySelectorAll = querySelectorAllForLightAndShadow([disabledHarness.video]);
disabledHarness.storageListeners[0]({ videoPipGlobalEnabled: { newValue: true } }, "local");
disabledHarness.video.paused = false;
disabledHarness.video.disablePictureInPicture = true;
disabledHarness.documentMock.visibilityState = "hidden";
disabledHarness.dispatch("playing", disabledHarness.video);
await settle();
assert.equal((await disabledHarness.command("enter"))?.entered, true, "Generic PiP should retry videos that expose disablePictureInPicture.");
assert.equal(disabledHarness.video.disablePictureInPicture, false, "Wayleaf should clear the per-video PiP disabled flag before requesting PiP.");

const invalidatedVideoHarness = createControllerHarness();
invalidatedVideoHarness.documentMock.querySelectorAll = querySelectorAllForLightAndShadow([invalidatedVideoHarness.video]);
invalidatedVideoHarness.storageListeners[0]({ videoPipGlobalEnabled: { newValue: true } }, "local");
invalidatedVideoHarness.video.paused = false;
Object.defineProperty(invalidatedVideoHarness.video, "disablePictureInPicture", {
  configurable: true,
  get() {
    throw new Error("Extension context invalidated.");
  },
  set() {}
});
invalidatedVideoHarness.documentMock.visibilityState = "hidden";
invalidatedVideoHarness.dispatch("playing", invalidatedVideoHarness.video);
await settle();
assert.equal((await invalidatedVideoHarness.command("enter"))?.entered, false, "A stale content-script video should fail closed instead of reporting an extension error.");

const invalidatedDomHarness = createControllerHarness();
invalidatedDomHarness.storageListeners[0]({ videoPipGlobalEnabled: { newValue: true } }, "local");
invalidatedDomHarness.video.paused = false;
invalidatedDomHarness.documentMock.querySelectorAll = () => {
  throw new Error("Extension context invalidated.");
};
invalidatedDomHarness.documentMock.visibilityState = "hidden";
const staleDomRequestCount = invalidatedDomHarness.coordinatorRequests.length;
assert.doesNotThrow(() => invalidatedDomHarness.dispatch("playing", invalidatedDomHarness.video), "Stale content-script DOM scans must be swallowed at the query boundary.");
await settle();
assert.equal(invalidatedDomHarness.coordinatorRequests.length, staleDomRequestCount, "A stale content-script DOM scan should not send a new PiP request.");

const legacyMarkerHarness = createControllerHarness(true);
assert.equal(legacyMarkerHarness.runtimeListeners.length, 1, "A legacy boolean controller marker should not block fresh injection.");
assert.equal(legacyMarkerHarness.storageListeners.length, 1, "A legacy boolean controller marker should still initialize the fresh controller.");

const invalidatedPreviousControllerHarness = createControllerHarness({
  dispose() {
    throw new Error("Extension context invalidated.");
  }
});
assert.equal(invalidatedPreviousControllerHarness.runtimeListeners.length, 1, "An invalidated previous controller should not block fresh injection.");
assert.equal(invalidatedPreviousControllerHarness.storageListeners.length, 1, "An invalidated previous controller should not block storage listener setup.");

const invalidatedControllerReadHarness = createControllerHarness({ throwOnControllerRead: true });
assert.equal(invalidatedControllerReadHarness.runtimeListeners.length, 1, "An invalidated controller marker read should not block fresh injection.");
assert.equal(invalidatedControllerReadHarness.storageListeners.length, 1, "An invalidated controller marker read should not block storage listener setup.");

const invalidatedPreviousDisposeReadHarness = createControllerHarness(Object.defineProperty({}, "dispose", {
  configurable: true,
  get() {
    throw new Error("Extension context invalidated.");
  }
}));
assert.equal(invalidatedPreviousDisposeReadHarness.runtimeListeners.length, 1, "An invalidated previous dispose getter should not block fresh injection.");
assert.equal(invalidatedPreviousDisposeReadHarness.storageListeners.length, 1, "An invalidated previous dispose getter should not block storage listener setup.");

const reinjectedHarness = createControllerHarness();
const firstRuntimeListener = reinjectedHarness.runtimeListeners[0];
const firstStorageListener = reinjectedHarness.storageListeners[0];
reinjectedHarness.documentMock.querySelectorAll = querySelectorAllForLightAndShadow([reinjectedHarness.video]);
vm.runInContext(controllerSource, reinjectedHarness.context);
assert.notEqual(reinjectedHarness.runtimeListeners[0], firstRuntimeListener, "A reinjected content script should replace the stale runtime listener.");
assert.notEqual(reinjectedHarness.storageListeners[0], firstStorageListener, "A reinjected content script should replace the stale storage listener.");
assert.equal(reinjectedHarness.runtimeListeners.length, 1, "Reinjection should not leave duplicate runtime listeners behind.");
assert.equal(reinjectedHarness.storageListeners.length, 1, "Reinjection should not leave duplicate storage listeners behind.");
reinjectedHarness.storageListeners[0]({ videoPipGlobalEnabled: { newValue: true } }, "local");
reinjectedHarness.video.paused = false;
reinjectedHarness.documentMock.visibilityState = "hidden";
reinjectedHarness.dispatch("playing", reinjectedHarness.video);
await settle();
await reinjectedHarness.mediaSessionHandler();
assert.equal(reinjectedHarness.requestCount, 1, "The replacement controller should handle browser-triggered auto PiP after reinjection.");

const invalidatedCommandHarness = createControllerHarness();
Object.defineProperty(invalidatedCommandHarness.documentMock, "visibilityState", {
  configurable: true,
  get() {
    throw new Error("Extension context invalidated.");
  }
});
assert.equal((await invalidatedCommandHarness.command("enter"))?.entered, false, "A stale coordinator command should fail closed instead of throwing.");

const shadowHarness = createControllerHarness();
shadowHarness.video.paused = false;
shadowHarness.documentMock.querySelectorAll = querySelectorAllForLightAndShadow([], [shadowHarness.video]);
await shadowHarness.context.window.__wayleafVideoPipController.togglePin();
await settle();
assert.equal(shadowHarness.requestCount, 1, "Manual pinning should directly enter PiP for videos inside open shadow DOM.");

const delayedVideoHarness = createControllerHarness();
delayedVideoHarness.video.paused = false;
delayedVideoHarness.documentMock.visibilityState = "hidden";
delayedVideoHarness.documentMock.querySelectorAll = querySelectorAllForLightAndShadow([delayedVideoHarness.video]);
await delayedVideoHarness.context.window.__wayleafVideoPipController.togglePin();
await settle();
assert.equal(delayedVideoHarness.requestCount, 1, "Manual pinning should directly enter PiP for a delayed inserted video.");

const coordinatorContext = {};
coordinatorContext.globalThis = coordinatorContext;
vm.runInNewContext(coordinatorSource, coordinatorContext);
const createCoordinator = coordinatorContext.WayleafVideoPipCoordinator?.create;
assert.equal(typeof createCoordinator, "function", "The browser-level PiP coordinator should expose a testable factory.");

const targets = {
  youtube: { tabId: 11, frameId: 0, documentId: "youtube", score: 900 },
  bilibili: { tabId: 12, frameId: 0, documentId: "bilibili", score: 800 },
  futurePlatform: { tabId: 13, frameId: 4, documentId: "future-platform", score: 1200 }
};
const targetStates = new Map(Object.values(targets).map((target) => [target.documentId, {
  hidden: true,
  playing: true,
  pip: false
}]));
const commands = [];
let storedOwner = null;
const coordinator = createCoordinator({
  async command(target, command) {
    commands.push(`${command}:${target.documentId}`);
    const state = targetStates.get(target.documentId);
    if (!state) {
      throw new Error("unreachable target");
    }
    if (command === "enter") {
      if (!state.hidden || !state.playing) {
        return { entered: false };
      }
      state.pip = true;
      return { entered: true };
    }
    state.pip = false;
    return { exited: true };
  },
  async loadOwner() {
    return storedOwner;
  },
  async saveOwner(owner) {
    storedOwner = owner;
  }
});

await coordinator.handle({ type: "enter" }, targets.youtube);
assert.equal(storedOwner?.documentId, "youtube", "The first playing page should own PiP.");
await coordinator.handle({ type: "enter" }, targets.youtube);
assert.deepEqual(commands.slice(-1), ["enter:youtube"], "A remembered owner must retry enter instead of assuming stale browser PiP state is still active.");

targetStates.get("youtube").hidden = false;
await Promise.all([
  coordinator.handle({ type: "enter" }, targets.bilibili),
  coordinator.handle({ type: "exit" }, targets.youtube)
]);
assert.deepEqual(
  commands.slice(-2),
  ["exit:youtube", "enter:bilibili"],
  "A competing platform must exit the previous owner before entering PiP."
);
assert.equal(storedOwner?.documentId, "bilibili", "Ownership should move to the newly hidden platform.");
assert.equal([...targetStates.values()].filter((state) => state.pip).length, 1, "Only one page may own the browser PiP window.");

targetStates.get("bilibili").hidden = false;
targetStates.get("future-platform").hidden = true;
await Promise.all([
  coordinator.handle({ type: "enter" }, targets.futurePlatform),
  coordinator.handle({ type: "exit" }, targets.bilibili)
]);
assert.deepEqual(
  commands.slice(-2),
  ["exit:bilibili", "enter:future-platform"],
  "The same serialized handoff must work for future platforms and embedded frames."
);
assert.equal(storedOwner?.documentId, "future-platform", "The coordinator must remain host-agnostic.");

const restartedCoordinator = createCoordinator({
  async command(target, command) {
    commands.push(`${command}:${target.documentId}`);
    return command === "enter" ? { entered: true } : { exited: true };
  },
  async loadOwner() {
    return storedOwner;
  },
  async saveOwner(owner) {
    storedOwner = owner;
  }
});
await restartedCoordinator.handle({ type: "enter" }, targets.youtube);
assert.deepEqual(
  commands.slice(-2),
  ["exit:future-platform", "enter:youtube"],
  "A restarted service worker should recover the persisted owner before handoff."
);
await restartedCoordinator.handle({ type: "left" }, targets.youtube);
assert.equal(storedOwner, null, "A native PiP close should clear stale ownership so the source page cannot remain stuck in PiP state.");
await restartedCoordinator.handle({ type: "enter" }, targets.bilibili);
assert.deepEqual(
  commands.slice(-1),
  ["enter:bilibili"],
  "A new platform should not need to exit a stale owner after the old PiP window has already left."
);
