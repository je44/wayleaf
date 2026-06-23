import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const controllerSource = readFileSync(new URL("../video-pip.js", import.meta.url), "utf8");
const backgroundSource = readFileSync(new URL("../background.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../newtab.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../newtab.css", import.meta.url), "utf8");
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
    "videoPipGlobalHint"
  ]) {
    assert.ok(messages[locale]?.[key]?.trim(), `${locale}.${key} should be translated.`);
  }
}

const videoContentScript = manifest.content_scripts.find((entry) => entry.js?.includes("video-pip.js"));
assert.ok(videoContentScript, "Manifest should load the video PiP controller on supported sites.");
assert.deepEqual(
  videoContentScript.matches,
  ["*://youtube.com/*", "*://*.youtube.com/*", "*://bilibili.com/*", "*://*.bilibili.com/*"],
  "The first release should stay limited to YouTube and Bilibili."
);
assert.match(
  backgroundSource,
  /chrome\.action\?\.onClicked\?\.addListener[\s\S]*handleVideoPipAction/,
  "The pinned Wayleaf toolbar action should toggle per-tab video PiP."
);
assert.match(
  html,
  /id="settingsLaboratoryTab"[\s\S]*data-settings-tab="laboratory"[\s\S]*id="videoPipGlobalToggle"[\s\S]*role="switch"[\s\S]*aria-checked="false"/,
  "Settings should expose the Laboratory destination and accessible global PiP switch."
);
assert.match(
  css,
  /\.laboratory-switch\s*\{[\s\S]*width:\s*52px;[\s\S]*height:\s*30px;[\s\S]*border-radius:\s*999px;[\s\S]*\.laboratory-switch-thumb\s*\{[\s\S]*border-radius:\s*999px;[\s\S]*\.laboratory-switch\[aria-checked="true"\] \.laboratory-switch-thumb\s*\{[\s\S]*translateX\(22px\)/,
  "The Laboratory control should keep the requested round capsule switch treatment."
);

class FakeVideo {}

function createControllerHarness() {
  const documentListeners = new Map();
  const storageListeners = [];
  const runtimeListeners = [];
  let mediaSessionHandler = null;
  let requestCount = 0;
  let exitCount = 0;
  let animationFrameId = 0;
  const animationFrames = new Map();
  let queryVideos = [];
  const documentMock = {
    visibilityState: "visible",
    pictureInPictureEnabled: true,
    pictureInPictureElement: null,
    querySelectorAll(selector) {
      return selector === "video" ? queryVideos : [];
    },
    addEventListener(type, listener) {
      const listeners = documentListeners.get(type) || [];
      listeners.push(listener);
      documentListeners.set(type, listeners);
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
        }
      }
    },
    runtime: {
      onMessage: {
        addListener(listener) {
          runtimeListeners.push(listener);
        }
      }
    }
  };
  vm.runInNewContext(controllerSource, {
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
    Promise
  });
  queryVideos = [video];
  return {
    documentMock,
    runtimeListeners,
    storageListeners,
    video,
    replacementVideo,
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
    flushAnimationFrame() {
      const callbacks = [...animationFrames.values()];
      animationFrames.clear();
      for (const callback of callbacks) {
        callback();
      }
    },
    dispatch(type, target = documentMock) {
      for (const listener of documentListeners.get(type) || []) {
        listener({ type, target });
      }
    }
  };
}

const harness = createControllerHarness();
const { documentMock, runtimeListeners, storageListeners, video, replacementVideo, dispatch } = harness;

async function settle() {
  await Promise.resolve();
  await Promise.resolve();
}

let pinResponse = null;
runtimeListeners[0]({ action: "wayleaf:toggle-video-pip-pin" }, {}, (response) => {
  pinResponse = response;
});
assert.equal(pinResponse?.pinned, true, "Toolbar action should pin the current video tab.");
assert.equal(typeof harness.mediaSessionHandler, "function", "Pinning should register the automatic PiP media-session handler.");

documentMock.visibilityState = "hidden";
dispatch("visibilitychange");
await settle();
assert.equal(harness.requestCount, 0, "A pinned supported-site tab should wait until its video is playing.");

video.paused = false;
dispatch("playing", video);
await settle();
assert.equal(harness.requestCount, 1, "A pinned hidden tab should not request PiP twice for the same window.");

documentMock.visibilityState = "visible";
dispatch("visibilitychange");
await settle();
assert.equal(harness.exitCount, 0, "PiP should stay open until the source page has rendered a visible frame.");
harness.flushAnimationFrame();
await settle();
assert.equal(harness.exitCount, 0, "PiP should stay open through the source page's first visible paint.");
harness.flushAnimationFrame();
await settle();
assert.equal(harness.exitCount, 1, "Returning to the source tab should close only the Wayleaf-managed PiP window.");

runtimeListeners[0]({ action: "wayleaf:toggle-video-pip-pin" }, {}, () => {});
storageListeners[0]({ videoPipGlobalEnabled: { newValue: true } }, "local");
video.paused = true;
documentMock.visibilityState = "hidden";
dispatch("visibilitychange");
await settle();
assert.equal(harness.requestCount, 1, "Global mode must still ignore a supported page until video playback starts.");

video.paused = false;
dispatch("play", video);
await settle();
assert.equal(harness.requestCount, 2, "Global mode should enter PiP for a playing supported-site video after tab switch.");

documentMock.pictureInPictureElement = replacementVideo;
documentMock.visibilityState = "visible";
dispatch("visibilitychange");
harness.flushAnimationFrame();
harness.flushAnimationFrame();
await settle();
assert.equal(harness.exitCount, 1, "Returning to the source tab must not close a PiP window opened for another video.");

documentMock.pictureInPictureElement = null;
documentMock.visibilityState = "hidden";
dispatch("play", video);
await settle();
assert.equal(harness.requestCount, 3, "Global mode should still enter PiP again after a stale source-tab cleanup.");
documentMock.pictureInPictureElement = null;
dispatch("leavepictureinpicture", video);
documentMock.visibilityState = "visible";
dispatch("visibilitychange");
await settle();
assert.equal(harness.exitCount, 1, "Returning after an already-closed PiP window should clear Wayleaf state without calling exit twice.");
documentMock.visibilityState = "hidden";
dispatch("play", video);
await settle();
assert.equal(harness.requestCount, 4, "A tab should be able to re-enter PiP after the source page cleanup path.");

const externalHarness = createControllerHarness();
externalHarness.documentMock.pictureInPictureElement = externalHarness.replacementVideo;
externalHarness.setQueryVideos([externalHarness.replacementVideo]);
externalHarness.documentMock.visibilityState = "hidden";
externalHarness.dispatch("visibilitychange");
await settle();
externalHarness.documentMock.visibilityState = "visible";
externalHarness.dispatch("visibilitychange");
await settle();
assert.equal(externalHarness.exitCount, 0, "Wayleaf should not close PiP windows it did not open.");

const visibleLeaveHarness = createControllerHarness();
visibleLeaveHarness.runtimeListeners[0]({ action: "wayleaf:toggle-video-pip-pin" }, {}, () => {});
visibleLeaveHarness.video.paused = false;
visibleLeaveHarness.documentMock.visibilityState = "hidden";
visibleLeaveHarness.dispatch("visibilitychange");
await settle();
assert.equal(visibleLeaveHarness.requestCount, 1, "Pinned playback should enter PiP for visible-leave cleanup coverage.");
visibleLeaveHarness.documentMock.pictureInPictureElement = null;
visibleLeaveHarness.documentMock.visibilityState = "visible";
visibleLeaveHarness.dispatch("leavepictureinpicture", visibleLeaveHarness.video);
visibleLeaveHarness.documentMock.pictureInPictureElement = visibleLeaveHarness.replacementVideo;
visibleLeaveHarness.dispatch("visibilitychange");
await settle();
assert.equal(visibleLeaveHarness.exitCount, 0, "Visible PiP leave should clear Wayleaf state before another PiP window appears.");
