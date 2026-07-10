import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const controllerSource = readFileSync(new URL("../video-pip.js", import.meta.url), "utf8");
const backgroundSource = readFileSync(new URL("../background.js", import.meta.url), "utf8");
const newtabSource = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../newtab.html", import.meta.url), "utf8");
const popupHtml = readFileSync(new URL("../popup.html", import.meta.url), "utf8");
const popupStyles = readFileSync(new URL("../popup.css", import.meta.url), "utf8");
const popupSource = readFileSync(new URL("../popup.js", import.meta.url), "utf8");
const packageSource = readFileSync(new URL("./package-release.sh", import.meta.url), "utf8");
const manifest = JSON.parse(readFileSync(new URL("../manifest.json", import.meta.url), "utf8"));

const messagesSource = newtabSource
  .match(/const MESSAGES = (\{[\s\S]*?\n\});\nconst LOCALE_COMPLETIONS =/)?.[1];
assert.ok(messagesSource, "Localized UI messages should be readable for Laboratory coverage.");
const messages = Function(`"use strict"; return (${messagesSource});`)();
for (const locale of ["zh-CN", "zh-TW", "en", "ja", "ko", "es", "fr", "de"]) {
  for (const key of ["videoPipLabTitle", "videoPipLabDescription", "videoPipLabel", "videoPipHint"]) {
    assert.ok(messages[locale]?.[key]?.trim(), `${locale}.${key} should be translated.`);
  }
  for (const removedKey of [
    "videoPipGlobalLabel",
    "videoPipGlobalHint",
    "socialVideoExtractorTitle",
    "socialVideoExtractorDescription",
    "socialVideoExtractorLabel",
    "socialVideoExtractorHint",
    "socialVideoExtractorSupport"
  ]) {
    assert.equal(messages[locale]?.[removedKey], undefined, `${locale}.${removedKey} should be removed after feature merging.`);
  }
}

const chromeLocales = {
  "zh-CN": "zh_CN",
  "zh-TW": "zh_TW",
  en: "en",
  ja: "ja",
  ko: "ko",
  es: "es",
  fr: "fr",
  de: "de"
};
for (const [locale, chromeLocale] of Object.entries(chromeLocales)) {
  const localeMessages = JSON.parse(readFileSync(new URL(`../_locales/${chromeLocale}/messages.json`, import.meta.url), "utf8"));
  for (const key of [
    "popupVideoPipLabel",
    "popupVideoPipDisabled",
    "popupVideoPipUnavailable",
    "popupVideoPipStarting",
    "popupVideoPipNoVideo",
    "popupVideoPipFailed"
  ]) {
    assert.ok(localeMessages[key]?.message?.trim(), `${locale}.${key} should be translated for the toolbar feature menu.`);
  }
}
assert.equal(
  JSON.parse(readFileSync(new URL("../_locales/zh_TW/messages.json", import.meta.url), "utf8")).popupVideoPipLabel.message,
  "視頻小窗",
  "The Traditional Chinese toolbar item should use the requested 視頻小窗 label."
);
assert.equal(messages["zh-TW"].videoPipLabTitle, "視頻小窗", "Laboratory and toolbar terminology should stay aligned in Traditional Chinese.");

for (const locale of ["zh-CN", "zh-TW", "en", "ja", "ko", "es", "fr", "de"]) {
  assert.match(controllerSource, new RegExp(`(?:"${locale}"|${locale}):`), `Video selection prompt should cover ${locale}.`);
}

const videoContentScript = manifest.content_scripts.find((entry) => entry.js?.includes("video-pip.js"));
assert.equal(videoContentScript, undefined, "Video PiP should only inject after a toolbar click.");
assert.ok(packageSource.split(/\s+/).includes("video-pip.js"), "Release packages should include the video selector controller.");
for (const popupFile of ["popup.html", "popup.css", "popup.js"]) {
  assert.ok(packageSource.split(/\s+/).includes(popupFile), `Release packages should include ${popupFile}.`);
}
assert.equal(packageSource.includes("video-pip-coordinator.js"), false, "Release packages should not include the removed automatic PiP coordinator.");

assert.equal(manifest.action?.default_popup, "popup.html", "The Wayleaf toolbar icon should open the feature list before any video action starts.");
assert.match(popupHtml, /id="videoPipAction"[\s\S]*data-i18n="popupVideoPipLabel"/, "The toolbar feature list should expose a Video mini-player action.");
assert.doesNotMatch(
  popupHtml,
  /menu-header|wayleaf-flat-32|<h1|popupLaboratoryLabel|videoPipDescription|feature-arrow|popupVideoPipDescription/,
  "The toolbar popup should render only the feature module icon and feature name."
);
assert.match(popupStyles, /\.feature-list[\s\S]*\.feature-item[\s\S]*:focus-visible/, "The toolbar feature list should preserve a visible keyboard focus state.");
assert.match(popupSource, /videoPipAction\.addEventListener\("click", activateVideoPip\)[\s\S]*initializePopup/, "Opening the toolbar menu alone must not activate video selection.");
assert.match(popupSource, /async function activateVideoPip\(\)[\s\S]*chrome\.runtime\.sendMessage\(\{ action: VIDEO_PIP_ACTIVATE_ACTION \}\)/, "Clicking Video mini-player should request selection from the background worker.");
assert.doesNotMatch(backgroundSource, /chrome\.action\?\.onClicked/, "The toolbar icon itself should no longer start video selection directly.");
assert.match(backgroundSource, /VIDEO_PIP_ACTIVATE_ACTION[\s\S]*async function handleVideoPipMenuAction\(\)[\s\S]*chrome\.tabs\.query\(\{ active: true, lastFocusedWindow: true \}\)[\s\S]*handleVideoPipAction\(tab\)/, "The background worker should start selection only after the popup action message.");

function createPopupHarness(options = {}) {
  const clickListeners = [];
  const runtimeMessages = [];
  const errors = [];
  let closeCount = 0;
  const videoPipAction = {
    disabled: false,
    title: "",
    dataset: {},
    attributes: {},
    setAttribute(name, value) {
      this.attributes[name] = value;
    },
    addEventListener(type, listener) {
      if (type === "click") {
        clickListeners.push(listener);
      }
    }
  };
  const documentMock = {
    documentElement: { lang: "" },
    querySelector(selector) {
      return {
        "#videoPipAction": videoPipAction
      }[selector] || null;
    },
    querySelectorAll() {
      return [];
    }
  };
  const chromeMock = {
    i18n: {
      getMessage(key) {
        return key;
      },
      getUILanguage() {
        return "en";
      }
    },
    tabs: {
      async query() {
        return [{ id: 17, url: options.url || "https://video.example/watch" }];
      }
    },
    storage: {
      local: {
        async get(defaults) {
          return { ...defaults, videoPipEnabled: options.enabled ?? true };
        }
      }
    },
    runtime: {
      async sendMessage(message) {
        runtimeMessages.push(message);
        return options.response || { ok: true, selectionActive: true };
      }
    }
  };
  const context = {
    document: documentMock,
    chrome: chromeMock,
    URL,
    window: {
      close() {
        closeCount += 1;
      }
    },
    console: {
      error(...args) {
        errors.push(args);
      }
    }
  };
  vm.runInNewContext(popupSource, context);
  return {
    videoPipAction,
    runtimeMessages,
    errors,
    async click() {
      return clickListeners[0]?.();
    },
    get closeCount() {
      return closeCount;
    }
  };
}

async function settlePopup() {
  await new Promise((resolve) => setImmediate(resolve));
}

const popupHarness = createPopupHarness();
await settlePopup();
assert.equal(popupHarness.runtimeMessages.length, 0, "Opening the toolbar feature list must not start video selection.");
assert.equal(popupHarness.videoPipAction.disabled, false, "Video mini-player should be available on a supported page when Laboratory enables it.");
await popupHarness.click();
assert.equal(popupHarness.runtimeMessages.length, 1);
assert.equal(popupHarness.runtimeMessages[0]?.action, "wayleaf:video-pip-activate");
assert.equal(popupHarness.closeCount, 1, "The toolbar list should close after page video selection starts.");

const disabledPopupHarness = createPopupHarness({ enabled: false });
await settlePopup();
assert.equal(disabledPopupHarness.videoPipAction.disabled, true, "The toolbar list should reflect a disabled Laboratory switch.");
assert.equal(disabledPopupHarness.videoPipAction.title, "popupVideoPipDisabled");
await disabledPopupHarness.click();
assert.equal(disabledPopupHarness.runtimeMessages.length, 0, "A disabled list item must not request video selection.");

const unsupportedPopupHarness = createPopupHarness({ url: "chrome://settings/" });
await settlePopup();
assert.equal(unsupportedPopupHarness.videoPipAction.disabled, true, "The toolbar list should disable video selection on unsupported pages.");
assert.equal(unsupportedPopupHarness.videoPipAction.title, "popupVideoPipUnavailable");

const emptyPopupHarness = createPopupHarness({ response: { ok: false, reason: "no-video" } });
await settlePopup();
await emptyPopupHarness.click();
assert.equal(emptyPopupHarness.closeCount, 0, "The toolbar list should stay open when no compatible playing video is available.");
assert.equal(emptyPopupHarness.videoPipAction.title, "popupVideoPipNoVideo");
assert.equal(emptyPopupHarness.videoPipAction.dataset.state, "error");
assert.match(
  backgroundSource,
  /function supportsVideoPip\(url\)[\s\S]*\["http:", "https:"\]/,
  "The merged selector should accept ordinary HTTP(S) pages."
);
assert.match(
  backgroundSource,
  /async function invokeVideoPipSelection\(tabId\)[\s\S]*target: \{ tabId, allFrames: true \}[\s\S]*startSelection/,
  "The Video mini-player menu action should activate the shared selector in every frame."
);
assert.match(
  backgroundSource,
  /async function handleVideoPipAction\(tab\)[\s\S]*!supportsVideoPip\(tab\.url \|\| ""\)[\s\S]*migrateVideoPipSetting\(\)[\s\S]*startVideoPipSelection\(tab\.id\)/,
  "The popup action handler should gate only by page protocol and the merged Laboratory switch."
);
assert.doesNotMatch(
  backgroundSource,
  /SOCIAL_VIDEO_EXTRACT_HOSTS|supportsSocialVideoExtraction|refreshVideoPipControllers|injectVideoPipControllerWhenGlobalEnabled|videoPipCoordinator|importScripts\("video-pip-coordinator\.js"\)/,
  "The background worker should not retain social-host routing or automatic PiP coordination."
);
assert.doesNotMatch(
  controllerSource,
  /videoPipGlobalEnabled|socialVideoExtractorEnabled|mediaSession|enterpictureinpicture|visibilitychange|wayleaf:video-pip-request|wayleaf:video-pip-command/,
  "The page controller should contain no automatic PiP trigger or old split-feature setting."
);
assert.match(
  controllerSource,
  /Picture-in-Picture request failed[\s\S]*sourceUrl:[\s\S]*videoArea:/,
  "Native PiP failures should record page and video context."
);

assert.equal((html.match(/id="videoPipToggle"/g) || []).length, 1, "Laboratory should expose one merged video mini-player switch.");
assert.equal(html.includes("socialVideoExtractorToggle"), false, "The separate social-video switch should be removed.");
assert.equal(html.includes("videoPipGlobalToggle"), false, "The old global automatic PiP switch should be removed.");
assert.match(
  html,
  /id="videoPipLabTitle">Video mini-player<[\s\S]*id="videoPipHint">Click the Wayleaf icon in the Chrome toolbar, choose Video mini-player, then select a playable video on the page\./,
  "Static Laboratory copy should describe the explicit toolbar-menu-and-select workflow."
);
assert.doesNotMatch(html, /automatic video|globally|Social video mini-player|Currently supported: Xiaohongshu, X/i);

const migrationMatch = backgroundSource.match(
  /(async function migrateVideoPipSetting\(\) \{[\s\S]*?\n\})\n\nasync function invokeVideoPipSelection/
);
assert.ok(migrationMatch, "The merged setting migration should be readable for behavior coverage.");

async function runMigration(initial) {
  const writes = [];
  const context = {
    VIDEO_PIP_ENABLED_STORAGE_KEY: "videoPipEnabled",
    LEGACY_VIDEO_PIP_GLOBAL_ENABLED_STORAGE_KEY: "videoPipGlobalEnabled",
    LEGACY_SOCIAL_VIDEO_EXTRACTOR_ENABLED_STORAGE_KEY: "socialVideoExtractorEnabled",
    chrome: {
      storage: {
        local: {
          async get(defaults) {
            return { ...defaults, ...initial };
          },
          async set(values) {
            writes.push(JSON.parse(JSON.stringify(values)));
          }
        }
      }
    }
  };
  vm.runInNewContext(`${migrationMatch[1]}; globalThis.run = migrateVideoPipSetting;`, context);
  return { enabled: await context.run(), writes };
}

assert.deepEqual(
  await runMigration({ videoPipEnabled: false, videoPipGlobalEnabled: true }),
  { enabled: false, writes: [{ videoPipGlobalEnabled: false }] },
  "An explicit merged preference should win while the legacy automatic flag is forcibly disabled."
);
assert.deepEqual(
  await runMigration({ videoPipGlobalEnabled: true, socialVideoExtractorEnabled: false }),
  { enabled: true, writes: [{ videoPipEnabled: true, videoPipGlobalEnabled: false }] },
  "Either previously enabled feature should migrate to the merged switch."
);
assert.deepEqual(
  await runMigration({ videoPipGlobalEnabled: false, socialVideoExtractorEnabled: false }),
  { enabled: false, writes: [{ videoPipEnabled: false }] },
  "Users who disabled both old features should keep the merged feature disabled."
);

class FakeVideo {}

function createControllerHarness(options = {}) {
  const documentListeners = new Map();
  const appendedElements = [];
  const statusMessages = [];
  const warnings = [];
  let queryVideos = [];
  let requestCount = 0;

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
    pictureInPictureEnabled: true,
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
    }
  };
  const video = Object.assign(new FakeVideo(), {
    videoWidth: 1280,
    videoHeight: 720,
    paused: false,
    ended: false,
    disablePictureInPicture: Boolean(options.disablePictureInPicture),
    getBoundingClientRect() {
      return { left: 0, top: 0, right: 960, bottom: 540, width: 960, height: 540 };
    },
    removeAttribute() {},
    async requestPictureInPicture() {
      requestCount += 1;
      if (options.rejectPictureInPicture) {
        throw new Error("native PiP rejected");
      }
    }
  });
  const windowMock = {
    innerWidth: 1280,
    innerHeight: 720,
    location: { href: options.url || "https://example.com/watch" }
  };
  const chromeMock = {
    i18n: {
      getUILanguage() {
        return options.uiLanguage || "en";
      }
    },
    storage: {
      local: {
        get(_defaults, callback) {
          callback({ languagePreference: options.languagePreference || "system" });
        }
      }
    },
    runtime: {
      id: "wayleaf-test",
      lastError: null,
      sendMessage(message) {
        statusMessages.push(message);
        return Promise.resolve({ ok: true });
      }
    }
  };
  const context = {
    window: windowMock,
    document: documentMock,
    navigator: { language: options.navigatorLanguage || "en" },
    chrome: chromeMock,
    HTMLVideoElement: FakeVideo,
    console: {
      warn(...args) {
        warnings.push(args);
      }
    },
    Promise
  };
  vm.createContext(context);
  vm.runInContext(controllerSource, context);
  queryVideos = [video];

  return {
    context,
    controller: windowMock.__wayleafVideoPipController,
    documentMock,
    documentListeners,
    appendedElements,
    statusMessages,
    warnings,
    video,
    setQueryVideos(videos) {
      queryVideos = videos;
    },
    dispatch(type, values = {}) {
      const event = {
        type,
        target: documentMock,
        preventDefault() {},
        stopImmediatePropagation() {},
        ...values
      };
      for (const listener of documentListeners.get(type) || []) {
        listener(event);
      }
    },
    get requestCount() {
      return requestCount;
    }
  };
}

async function settle() {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

const genericHarness = createControllerHarness({ languagePreference: "en", url: "https://video.example/watch" });
assert.equal(await genericHarness.controller.startSelection(), true, "A generic video page should start selection after the toolbar menu action.");
assert.equal(genericHarness.appendedElements.at(-2)?.textContent, "Select a video to open in Picture-in-Picture");
assert.equal(genericHarness.appendedElements.at(-2)?.style.background, "rgb(0 0 0 / 80%)");
assert.equal(genericHarness.appendedElements.at(-2)?.style.left, "16px");
assert.equal(genericHarness.appendedElements.at(-2)?.style.right, "16px");
assert.equal(genericHarness.appendedElements.at(-2)?.style.margin, "0 auto");
assert.equal(genericHarness.appendedElements.at(-2)?.style.display, "flex");
assert.equal(genericHarness.appendedElements.at(-2)?.style.alignItems, "center");
assert.equal(genericHarness.appendedElements.at(-2)?.style.justifyContent, "center");
assert.equal(genericHarness.appendedElements.at(-1)?.style.border, "3px dashed #00b8d9");
assert.equal(
  genericHarness.appendedElements.at(-1)?.style.pointerEvents,
  "auto",
  "The selection layer should receive the click instead of letting the playing video pause underneath it."
);
assert.equal(
  genericHarness.appendedElements.at(-1)?.style.boxShadow,
  "0 4px 7px rgb(0 0 0 / 20%)",
  "The selection frame should use the requested downward 4px, 7px black shadow at 20% opacity."
);
assert.equal(genericHarness.statusMessages.at(-1)?.type, "started");
genericHarness.dispatch("click", { clientX: 10, clientY: 10 });
await settle();
assert.equal(genericHarness.requestCount, 1, "Selecting the highlighted video should request native PiP from the page gesture.");
assert.equal(genericHarness.statusMessages.at(-1)?.type, "entered");
assert.equal(genericHarness.appendedElements.at(-1)?.isConnected, false, "The selection overlay should be removed after selection.");

const repeatedStartHarness = createControllerHarness();
assert.equal(await repeatedStartHarness.controller.startSelection(), true);
assert.equal(await repeatedStartHarness.controller.startSelection(), true, "Selecting Video mini-player again should keep the explicit selection flow active.");
assert.equal(repeatedStartHarness.statusMessages.filter((message) => message.type === "started").length, 1, "Repeated menu activation should not duplicate selection state.");

const escapeHarness = createControllerHarness();
await escapeHarness.controller.startSelection();
escapeHarness.dispatch("keydown", { key: "Escape" });
assert.equal(escapeHarness.statusMessages.at(-1)?.type, "cancelled", "Escape should cancel video selection.");

const emptyHarness = createControllerHarness();
emptyHarness.setQueryVideos([]);
assert.equal(await emptyHarness.controller.startSelection(), false, "A page without a selectable video should report no active selection.");
assert.equal(emptyHarness.appendedElements.length, 0, "A page without video should not render stale selection UI.");

const pausedHarness = createControllerHarness();
pausedHarness.video.paused = true;
assert.equal(await pausedHarness.controller.startSelection(), false, "The selector should only target a video that is currently playing.");

const traditionalChineseHarness = createControllerHarness({ languagePreference: "zh-TW" });
await traditionalChineseHarness.controller.startSelection();
assert.equal(traditionalChineseHarness.appendedElements.at(-2)?.textContent, "選擇要以小視窗播放的影片");

const disabledFlagHarness = createControllerHarness({ disablePictureInPicture: true });
await disabledFlagHarness.controller.startSelection();
disabledFlagHarness.dispatch("click", { clientX: 10, clientY: 10 });
await settle();
assert.equal(disabledFlagHarness.video.disablePictureInPicture, false, "The shared selector should clear a page-level PiP disable flag before requesting PiP.");
assert.equal(disabledFlagHarness.statusMessages.at(-1)?.type, "entered");

const rejectionHarness = createControllerHarness({ rejectPictureInPicture: true, url: "https://fail.example/video" });
await rejectionHarness.controller.startSelection();
rejectionHarness.dispatch("click", { clientX: 10, clientY: 10 });
await settle();
assert.equal(rejectionHarness.statusMessages.at(-1)?.type, "failed", "A rejected native PiP request should be visible to the toolbar state.");
assert.equal(
  rejectionHarness.warnings.some(([message, details]) => (
    message === "Wayleaf video mini-player Picture-in-Picture request failed" &&
    details?.sourceUrl === "https://fail.example/video" &&
    details?.videoArea > 0
  )),
  true,
  "A rejected native PiP request should log its source URL and video size."
);

const shadowHarness = createControllerHarness();
const shadowVideo = shadowHarness.video;
const shadowRoot = {
  querySelectorAll(selector) {
    return selector === "video" ? [shadowVideo] : [];
  }
};
shadowHarness.documentMock.querySelectorAll = (selector) => {
  if (selector === "video") {
    return [];
  }
  return selector === "*" ? [{ shadowRoot }] : [];
};
assert.equal(await shadowHarness.controller.startSelection(), true, "The shared selector should discover videos inside open shadow roots.");

const reinjectedHarness = createControllerHarness();
const firstController = reinjectedHarness.controller;
const firstClickListener = reinjectedHarness.documentListeners.get("click")?.[0];
vm.runInContext(controllerSource, reinjectedHarness.context);
assert.notEqual(reinjectedHarness.context.window.__wayleafVideoPipController, firstController, "Reinjection should replace the previous controller.");
assert.equal(reinjectedHarness.documentListeners.get("click")?.includes(firstClickListener), false, "Reinjection should remove stale page listeners.");
assert.equal(reinjectedHarness.documentListeners.get("click")?.length, 1, "Reinjection should leave one click listener.");

console.log("Video mini-player checks passed.");
