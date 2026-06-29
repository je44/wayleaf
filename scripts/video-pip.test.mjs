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
    "socialVideoExtractorHint",
    "socialVideoExtractorSupport"
  ]) {
    if ((locale === "zh-TW" && key === "videoPipLabDescription") || key === "socialVideoExtractorDescription") {
      assert.equal(messages[locale]?.[key], "", `${locale}.${key} should be removed.`);
    } else {
      assert.ok(messages[locale]?.[key]?.trim(), `${locale}.${key} should be translated.`);
    }
  }
}

const videoContentScript = manifest.content_scripts.find((entry) => entry.js?.includes("video-pip.js"));
assert.equal(videoContentScript, undefined, "Video PiP should not statically inject into every http/https frame.");
for (const runtimeFile of ["video-pip.js", "video-pip-coordinator.js"]) {
  assert.ok(packageSource.split(/\s+/).includes(runtimeFile), `Release packages should include ${runtimeFile}.`);
}
assert.match(
  backgroundSource,
  /chrome\.action\?\.onClicked\?\.addListener[\s\S]*handleVideoPipAction/,
  "The Wayleaf toolbar action should route through the social video mini-player handler."
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
assert.doesNotMatch(
  backgroundSource,
  /function toggleVideoPipPin|toggleVideoPipPinInFrame|VIDEO_PIP_TOGGLE_ACTION/,
  "Toolbar clicks must not dispatch to generic or global video PiP pinning."
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
  /function injectVideoPipControllerWhenGlobalEnabled\(tabId, url\)[\s\S]*supportsVideoPip\(url \|\| ""\)[\s\S]*chrome\.storage\.local\.get\(\{ \[VIDEO_PIP_GLOBAL_ENABLED_STORAGE_KEY\]: false \}\)[\s\S]*stored\[VIDEO_PIP_GLOBAL_ENABLED_STORAGE_KEY\] === true[\s\S]*injectVideoPipController\(tabId\)/,
  "Completed page loads should attach the PiP controller only when global PiP is enabled."
);
const lazyInjectionSource = backgroundSource.match(/async function injectVideoPipControllerWhenGlobalEnabled\(tabId, url\) \{[\s\S]*?\n\}/)?.[0];
assert.ok(lazyInjectionSource, "Global PiP lazy injection helper should be readable for behavior coverage.");
let lazyInjectionEnabled = false;
let lazyInjectionStorageReads = 0;
const lazyInjectionTargets = [];
const lazyInjectionContext = {
  VIDEO_PIP_GLOBAL_ENABLED_STORAGE_KEY: "videoPipGlobalEnabled",
  supportsVideoPip: (url) => /^https?:/.test(url),
  injectVideoPipController: async (tabId) => lazyInjectionTargets.push(tabId),
  chrome: {
    storage: {
      local: {
        async get() {
          lazyInjectionStorageReads += 1;
          return { videoPipGlobalEnabled: lazyInjectionEnabled };
        }
      }
    }
  }
};
vm.runInNewContext(`${lazyInjectionSource}; globalThis.testLazyInjection = injectVideoPipControllerWhenGlobalEnabled;`, lazyInjectionContext);
await lazyInjectionContext.testLazyInjection(7, "chrome://extensions/");
assert.equal(lazyInjectionStorageReads, 0, "Unsupported pages should not read the global PiP setting.");
await lazyInjectionContext.testLazyInjection(7, "https://www.youtube.com/watch?v=test");
assert.deepEqual(lazyInjectionTargets, [], "Disabled global PiP should not inject into supported pages.");
lazyInjectionEnabled = true;
await lazyInjectionContext.testLazyInjection(9, "https://www.bilibili.com/video/test");
assert.deepEqual(lazyInjectionTargets, [9], "Enabled global PiP should inject into supported pages.");
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
  /chrome\.tabs\?\.onUpdated\?\.addListener[\s\S]*changeInfo\.status === "complete"[\s\S]*injectVideoPipControllerWhenGlobalEnabled\(tabId, url\)/,
  "New page loads should lazily attach the PiP controller after the global switch is enabled."
);
assert.match(
  backgroundSource,
  /!supportsVideoPip\(tab\.url \|\| ""\) \|\| !supportsSocialVideoExtraction\(tab\.url \|\| ""\)[\s\S]*startSocialVideoExtraction\(tab\.id\)/,
  "Toolbar action should only start the social video mini-player on supported social hosts."
);
assert.match(
  backgroundSource,
  /const SOCIAL_VIDEO_EXTRACT_HOSTS = new Set\(\[[\s\S]*"x\.com"[\s\S]*"twitter\.com"[\s\S]*"xiaohongshu\.com"/,
  "Social video extraction should reuse the same hover-to-extract path on X and Xiaohongshu hosts."
);
assert.match(
  html,
  /Currently supported: Xiaohongshu, X/,
  "The static Laboratory copy should label the social video mini-player support boundary."
);
assert.match(
  messagesSource,
  /Enable social video mini-player[\s\S]*Currently supported: Xiaohongshu, X/,
  "Localized Laboratory copy should separate the social mini-player toggle from global automatic PiP."
);
assert.doesNotMatch(
  controllerSource,
  /window\[CONTROLLER_KEY\]\s*=\s*null/,
  "Invalidated content scripts must not write the controller marker while disposing."
);
assert.doesNotMatch(
  controllerSource,
  /togglePin|togglePinned|enterPinnedPictureInPicture|TOGGLE_PIN_ACTION|wayleaf:toggle-video-pip-pin/,
  "The content script should not keep a generic toolbar PiP pin entrypoint."
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

function createControllerHarness(initialController = undefined, options = {}) {
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
  windowMock.location = { hostname: options.hostname || "example.com" };
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
let legacyPinCallbackCalled = false;
const legacyPinReturn = runtimeListeners[0]({ action: "wayleaf:toggle-video-pip-pin" }, {}, () => {
  legacyPinCallbackCalled = true;
});
assert.equal(legacyPinReturn, undefined, "Legacy toolbar PiP pin messages should not be handled.");
assert.equal(legacyPinCallbackCalled, false, "Legacy toolbar PiP pin messages should not get a content-script response.");
assert.equal(harness.requestCount, 0, "Toolbar messages must not enter generic PiP.");
storageListeners[0]({ videoPipGlobalEnabled: { newValue: true } }, "local");
assert.equal(typeof harness.mediaSessionHandler, "function", "Global PiP should register the automatic PiP media-session handler.");

const extractHarness = createControllerHarness();
extractHarness.documentMock.querySelectorAll = querySelectorAllForLightAndShadow([extractHarness.video]);
let extractStartResponse = null;
extractHarness.runtimeListeners[0]({ action: "wayleaf:social-video-extract-start" }, {}, (response) => {
  extractStartResponse = response;
});
assert.equal(extractStartResponse?.extractorActive, true, "Toolbar extraction should start a page-level video picker.");
assert.equal(extractHarness.appendedElements.at(-2)?.textContent, "選擇需要小窗化的視頻窗口", "Extraction should show the pinned bottom prompt.");
assert.equal(extractHarness.appendedElements.at(-2)?.style.background, "rgb(0 0 0 / 80%)", "Extraction prompt should use an 80% transparent dark capsule.");
assert.equal(extractHarness.appendedElements.at(-2)?.style.boxShadow, "0 14px 34px rgb(0 0 0 / 26%)", "Extraction prompt should use a soft outer shadow.");
assert.equal(extractHarness.appendedElements.at(-2)?.style.borderRadius, "999px", "Extraction prompt should render as a capsule.");
assert.equal(extractHarness.appendedElements.at(-2)?.style.bottom, "28px", "Extraction prompt should be pinned near the bottom of the page.");
assert.equal(extractHarness.appendedElements.at(-1)?.style.display, "grid", "Extraction should draw the detected video overlay.");
assert.equal(extractHarness.appendedElements.at(-1)?.textContent, "", "Extraction overlay should not cover the video with center text.");
assert.equal(extractHarness.appendedElements.at(-1)?.style.border, "3px dashed #00b8d9", "Extraction overlay should use a lake-blue border.");
assert.equal(extractHarness.appendedElements.at(-1)?.style.background, "rgb(0 184 217 / 10%)", "Extraction overlay fill should use 10% lake-blue transparency.");
const extractPrompt = extractHarness.appendedElements.at(-2);
extractHarness.dispatch("click", {
  clientX: 12,
  clientY: 12,
  preventDefault() {},
  stopImmediatePropagation() {}
});
await settle();
assert.equal(extractHarness.requestCount, 1, "Clicking a detected video should request native PiP from the page gesture.");
assert.equal(extractPrompt?.isConnected, false, "Extraction prompt should disappear after choosing a video.");
assert.equal(extractHarness.appendedElements.at(-1)?.isConnected, false, "Extraction should remove the overlay after a PiP attempt.");
assert.equal(extractHarness.coordinatorRequests.at(-1)?.type, "entered", "A successful extraction should clear the toolbar waiting state.");

documentMock.visibilityState = "hidden";
dispatch("visibilitychange");
await settle();
assert.equal(harness.requestCount, 0, "Global automatic PiP should wait for the browser-level coordinator grant.");
assert.equal(harness.coordinatorRequests.at(-1)?.type, "enter", "A hidden playing tab should request coordinated PiP ownership.");
assert.equal((await harness.command("enter"))?.entered, true, "The granted owner should enter PiP.");
assert.equal(harness.requestCount, 1, "The coordinator grant should enter PiP once.");

video.paused = false;
dispatch("playing", video);
await settle();
assert.equal(harness.requestCount, 1, "Content scripts must not enter a second PiP before the browser-level coordinator grants ownership.");
assert.equal(harness.coordinatorRequests.at(-1)?.type, "enter", "Hidden playback should request coordinated PiP ownership.");
assert.equal((await harness.command("enter"))?.entered, false, "The granted owner should not duplicate an already-open PiP window.");
assert.equal(harness.requestCount, 1, "The coordinator command should not duplicate an already-open pinned PiP window.");

documentMock.visibilityState = "visible";
dispatch("visibilitychange");
await settle();
assert.equal(harness.exitCount, 0, "Visible tabs should request release instead of racing a local delayed exit.");
assert.equal(harness.coordinatorRequests.at(-1)?.type, "enter", "Returning to the source tab should not release coordinated ownership.");

assert.equal((await harness.command("exit"))?.exited, true, "The coordinator should explicitly close the Wayleaf-managed PiP window.");
assert.equal(harness.exitCount, 1, "The coordinator should close only the Wayleaf-managed PiP window.");
storageListeners[0]({ videoPipGlobalEnabled: { newValue: true } }, "local");
video.paused = true;
documentMock.visibilityState = "visible";
const pausedVisibleRequestCount = harness.coordinatorRequests.length;
dispatch("playing", video);
await settle();
assert.equal(harness.requestCount, 1, "Global mode must still ignore a supported page until video playback starts.");
assert.equal(harness.coordinatorRequests.length, pausedVisibleRequestCount, "Paused visible video should not request coordinated PiP.");

video.paused = false;
const resumedVisibleRequestCount = harness.coordinatorRequests.length;
dispatch("playing", video);
await settle();
assert.equal(harness.coordinatorRequests.length, resumedVisibleRequestCount, "Resuming playback on the source tab should wait for a tab switch.");
documentMock.visibilityState = "hidden";
dispatch("visibilitychange");
await settle();
assert.equal(harness.coordinatorRequests.at(-1)?.type, "enter", "A resumed video should request coordinated PiP when the tab later becomes hidden.");
assert.equal((await harness.command("enter"))?.entered, true, "Global fallback should enter PiP for a resumed playing video after tab switch.");
assert.equal(harness.requestCount, 2, "Global fallback should cover Chrome auto-PiP eligibility misses.");
documentMock.visibilityState = "visible";
dispatch("visibilitychange");
await settle();
assert.equal(harness.coordinatorRequests.at(-1)?.type, "enter", "Returning to the source tab should not release the global fallback owner.");
assert.equal(harness.exitCount, 1, "Global fallback PiP should stay open when the source tab is visible again.");

documentMock.visibilityState = "hidden";
documentMock.pictureInPictureElement = null;
video.paused = false;
const enabledMediaSessionHandler = harness.mediaSessionHandler;
await enabledMediaSessionHandler();
await settle();
assert.equal(harness.requestCount, 3, "Chrome's media-session automatic PiP handler should request native PiP directly.");
assert.equal(harness.coordinatorRequests.at(-1)?.type, "entered", "A media-session auto PiP entry should record the active owner.");

storageListeners[0]({ videoPipGlobalEnabled: { newValue: false } }, "local");
assert.equal(harness.mediaSessionHandler, null, "Disabling global PiP should unregister the automatic PiP handler.");
documentMock.pictureInPictureElement = null;
await enabledMediaSessionHandler();
await settle();
assert.equal(harness.requestCount, 3, "A stale Chrome automatic PiP handler should fail closed after Wayleaf disables PiP.");
storageListeners[0]({ videoPipGlobalEnabled: { newValue: true } }, "local");
assert.equal(typeof harness.mediaSessionHandler, "function", "Re-enabling global PiP should restore the automatic PiP handler.");

for (const hostname of ["x.com", "www.xiaohongshu.com"]) {
  const socialHarness = createControllerHarness(undefined, { hostname });
  socialHarness.documentMock.querySelectorAll = querySelectorAllForLightAndShadow([socialHarness.video]);
  socialHarness.storageListeners[0]({ videoPipGlobalEnabled: { newValue: true } }, "local");
  assert.equal(socialHarness.mediaSessionHandler, null, `${hostname} should not register global automatic PiP.`);
  socialHarness.video.paused = false;
  socialHarness.documentMock.visibilityState = "hidden";
  socialHarness.dispatch("playing", socialHarness.video);
  await settle();
  assert.equal(socialHarness.requestCount, 0, `${hostname} should require toolbar extraction instead of global automatic PiP.`);
  assert.equal(
    socialHarness.coordinatorRequests.some((request) => ["enter", "entered"].includes(request.type)),
    false,
    `${hostname} should not request coordinated global PiP.`
  );
}

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
visibleLeaveHarness.storageListeners[0]({ videoPipGlobalEnabled: { newValue: true } }, "local");
visibleLeaveHarness.video.paused = false;
visibleLeaveHarness.documentMock.visibilityState = "hidden";
visibleLeaveHarness.dispatch("visibilitychange");
await settle();
await visibleLeaveHarness.command("enter");
assert.equal(visibleLeaveHarness.requestCount, 1, "Global playback should enter PiP for visible-leave cleanup coverage.");
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
shadowHarness.storageListeners[0]({ videoPipGlobalEnabled: { newValue: true } }, "local");
shadowHarness.documentMock.visibilityState = "hidden";
shadowHarness.dispatch("visibilitychange");
await settle();
assert.equal((await shadowHarness.command("enter"))?.entered, true, "Global PiP should enter for videos inside open shadow DOM.");
assert.equal(shadowHarness.requestCount, 1, "Global PiP should request PiP for videos inside open shadow DOM.");

const delayedVideoHarness = createControllerHarness();
delayedVideoHarness.video.paused = false;
delayedVideoHarness.documentMock.visibilityState = "hidden";
delayedVideoHarness.documentMock.querySelectorAll = querySelectorAllForLightAndShadow([delayedVideoHarness.video]);
delayedVideoHarness.storageListeners[0]({ videoPipGlobalEnabled: { newValue: true } }, "local");
delayedVideoHarness.dispatch("visibilitychange");
await settle();
assert.equal((await delayedVideoHarness.command("enter"))?.entered, true, "Global PiP should enter for a delayed inserted video.");
assert.equal(delayedVideoHarness.requestCount, 1, "Global PiP should request PiP for a delayed inserted video.");

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
assert.equal(storedOwner?.sourceTabId, targets.youtube.tabId, "A PiP session should be bound to its source tab.");
assert.equal(storedOwner?.status, "active", "A live PiP session should be stored as active.");
await coordinator.handle({ type: "enter" }, targets.youtube);
assert.deepEqual(commands.slice(-1), ["enter:youtube"], "A remembered owner must retry enter instead of assuming stale browser PiP state is still active.");

targetStates.get("youtube").hidden = false;
const nonSourceCommandCount = commands.length;
await Promise.all([
  coordinator.handle({ type: "enter" }, targets.bilibili),
  coordinator.handle({ type: "source-lost", sourceUrl: "https://bilibili.example/refresh" }, targets.bilibili),
  coordinator.handle({ type: "removed" }, targets.bilibili)
]);
assert.equal(commands.length, nonSourceCommandCount, "Non-source tab enter/update/remove events must not reset the active PiP owner.");
assert.equal(storedOwner?.documentId, "youtube", "Ownership should stay with the source tab while PiP is active.");
assert.equal([...targetStates.values()].filter((state) => state.pip).length, 1, "Only one page may own the browser PiP window.");

await coordinator.handle({ type: "source-lost", sourceUrl: "https://youtube.example/reloaded" }, { tabId: targets.youtube.tabId });
assert.equal(storedOwner?.status, "source-lost", "Reloading the source tab should mark the session source-lost.");
assert.equal(storedOwner?.sourceTabId, targets.youtube.tabId, "A source-lost session should still remember its source tab.");
const youtubeReloaded = { tabId: 11, frameId: 0, documentId: "youtube-reloaded", score: 900 };
targetStates.set("youtube-reloaded", { hidden: true, playing: true, pip: false });
await coordinator.handle({ type: "enter", playing: true, currentTime: 12, volume: 0.5, muted: true }, youtubeReloaded);
assert.equal(storedOwner?.documentId, "youtube-reloaded", "The source tab may re-enter PiP after reload.");
assert.equal(storedOwner?.currentTime, 12, "The PiP session should retain media metadata.");
assert.equal(storedOwner?.volume, 0.5, "The PiP session should retain volume metadata.");
assert.equal(storedOwner?.muted, true, "The PiP session should retain muted metadata.");

await coordinator.handle({ type: "removed" }, { tabId: targets.bilibili.tabId });
assert.equal(storedOwner?.documentId, "youtube-reloaded", "Closing a non-source tab should not clear the PiP session.");
await coordinator.handle({ type: "source-lost", sourceUrl: "https://youtube.example/lost-again" }, { tabId: targets.youtube.tabId });
await coordinator.handle({ type: "enter" }, targets.futurePlatform);
assert.equal(storedOwner?.documentId, "future-platform", "A non-source tab may take over after the previous source is lost.");
await coordinator.handle({ type: "enter", playing: true, currentTime: 99 }, youtubeReloaded);
assert.equal(storedOwner?.documentId, "future-platform", "A stale previous source must not overwrite a new active owner.");
await coordinator.handle({ type: "removed" }, { tabId: targets.youtube.tabId });
assert.equal(storedOwner?.documentId, "future-platform", "Closing the previous source tab should not clear the new active owner.");
await coordinator.handle({ type: "removed" }, { tabId: targets.futurePlatform.tabId });
assert.equal(storedOwner, null, "Closing the source tab should clear the PiP session.");
await coordinator.handle({ type: "enter" }, targets.bilibili);
assert.equal(storedOwner?.documentId, "bilibili", "A new source can own PiP after the previous source is closed.");

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
const restartedCommandCount = commands.length;
await restartedCoordinator.handle({ type: "enter" }, targets.youtube);
assert.equal(commands.length, restartedCommandCount, "A restarted service worker should ignore non-source tab entry while an owner is persisted.");
assert.equal(storedOwner?.documentId, "bilibili", "A restarted service worker should recover the persisted source owner.");
await restartedCoordinator.handle({ type: "left" }, targets.bilibili);
assert.equal(storedOwner, null, "A native PiP close should clear stale ownership so the source page cannot remain stuck in PiP state.");
await restartedCoordinator.handle({ type: "enter" }, targets.bilibili);
assert.deepEqual(
  commands.slice(-1),
  ["enter:bilibili"],
  "A new platform should not need to exit a stale owner after the old PiP window has already left."
);
