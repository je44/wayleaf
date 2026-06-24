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
    "videoPipGlobalHint"
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
  html,
  /id="settingsLaboratoryTab"[\s\S]*data-settings-tab="laboratory"[\s\S]*id="videoPipGlobalToggle"[\s\S]*role="switch"[\s\S]*aria-checked="false"/,
  "Settings should expose the Laboratory destination and accessible global PiP switch."
);
assert.match(
  html,
  /id="videoPipGlobalHint"[\s\S]*standard HTML5 video/,
  "The static Laboratory fallback copy should describe generic HTML5 video support."
);
assert.match(
  css,
  /\.laboratory-switch\s*\{[\s\S]*width:\s*52px;[\s\S]*height:\s*30px;[\s\S]*transform:\s*scale\(0\.8\);[\s\S]*\.laboratory-switch-thumb\s*\{[\s\S]*width:\s*22px;[\s\S]*height:\s*22px;[\s\S]*border-radius:\s*999px;[\s\S]*\.laboratory-switch\[aria-checked="true"\] \.laboratory-switch-thumb\s*\{[\s\S]*translateX\(22px\)/,
  "The Laboratory control should keep its layout position while rendering 20% smaller."
);

class FakeVideo {}

function createControllerHarness() {
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
      id: "wayleaf-test",
      sendMessage(message) {
        coordinatorRequests.push(message);
        return Promise.resolve({ ok: true });
      },
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
    }
  });
  queryVideos = [video];
  return {
    documentMock,
    runtimeListeners,
    storageListeners,
    video,
    replacementVideo,
    coordinatorRequests,
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
      for (const listener of documentListeners.get(type) || []) {
        listener({ type, target });
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
assert.equal(harness.requestCount, 0, "Content scripts must not enter PiP before the browser-level coordinator grants ownership.");
assert.equal(harness.coordinatorRequests.at(-1)?.type, "enter", "Hidden playback should request coordinated PiP ownership.");
assert.equal((await harness.command("enter"))?.entered, true, "The granted owner should enter PiP.");
assert.equal(harness.requestCount, 1, "The coordinator command should enter PiP exactly once.");

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
documentMock.visibilityState = "hidden";
dispatch("visibilitychange");
await settle();
assert.equal(harness.requestCount, 1, "Global mode must still ignore a supported page until video playback starts.");

video.paused = false;
dispatch("play", video);
await settle();
assert.equal(harness.requestCount, 1, "Global mode should still wait for a coordinator grant.");
assert.equal((await harness.command("enter"))?.entered, true, "Global mode should enter after ownership is granted.");
assert.equal(harness.requestCount, 2, "Global mode should enter PiP for a playing supported-site video after tab switch.");

documentMock.pictureInPictureElement = replacementVideo;
documentMock.visibilityState = "visible";
dispatch("visibilitychange");
await settle();
assert.equal((await harness.command("exit"))?.exited, false, "A stale owner must not close a PiP window opened for another video.");
assert.equal(harness.exitCount, 1, "Returning to the source tab must not close a PiP window opened for another video.");

documentMock.pictureInPictureElement = null;
documentMock.visibilityState = "hidden";
dispatch("play", video);
await settle();
assert.equal((await harness.command("enter"))?.entered, true, "A stale source-tab cleanup should not block the next grant.");
assert.equal(harness.requestCount, 3, "Global mode should still enter PiP again after a stale source-tab cleanup.");
documentMock.pictureInPictureElement = null;
dispatch("leavepictureinpicture", video);
await settle();
assert.equal(harness.coordinatorRequests.at(-1)?.type, "left", "A closed PiP window should release browser-level ownership.");
documentMock.visibilityState = "visible";
dispatch("visibilitychange");
await settle();
assert.equal(harness.exitCount, 1, "Returning after an already-closed PiP window should clear Wayleaf state without calling exit twice.");
documentMock.visibilityState = "hidden";
dispatch("play", video);
await settle();
assert.equal((await harness.command("enter"))?.entered, true, "A cleaned-up tab should accept a later grant.");
assert.equal(harness.requestCount, 4, "A tab should be able to re-enter PiP after the source page cleanup path.");

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
shadowHarness.dispatch("playing", shadowHarness.video);
await settle();
assert.equal((await shadowHarness.command("enter"))?.entered, true, "Generic PiP should find playable videos inside open shadow DOM.");

const delayedVideoHarness = createControllerHarness();
delayedVideoHarness.storageListeners[0]({ videoPipGlobalEnabled: { newValue: true } }, "local");
delayedVideoHarness.video.paused = false;
delayedVideoHarness.documentMock.visibilityState = "hidden";
delayedVideoHarness.documentMock.querySelectorAll = querySelectorAllForLightAndShadow([delayedVideoHarness.video]);
delayedVideoHarness.mutate([{ addedNodes: [delayedVideoHarness.video] }]);
await settle();
assert.equal(delayedVideoHarness.coordinatorRequests.at(-1)?.type, "enter", "Delayed inserted video elements should retry coordinated PiP.");
assert.equal((await delayedVideoHarness.command("enter"))?.entered, true, "A delayed inserted video should enter PiP after ownership is granted.");

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
