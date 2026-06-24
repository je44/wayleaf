import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const html = readFileSync(new URL("../newtab.html", import.meta.url), "utf8");
const styles = readFileSync(new URL("../newtab.css", import.meta.url), "utf8");
const source = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");
const background = readFileSync(new URL("../background.js", import.meta.url), "utf8");
const manifest = JSON.parse(readFileSync(new URL("../manifest.json", import.meta.url), "utf8"));

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

function storageKeys(requested) {
  return Array.isArray(requested) ? requested : Object.keys(requested);
}

function sourceBetween(start, end) {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex);
  assert.ok(startIndex >= 0 && endIndex > startIndex, `${start} should appear before ${end}`);
  return source.slice(startIndex, endIndex);
}

async function runStoredValuesFixture({ localStore = {}, syncStore = {}, defaults = {} }) {
  const calls = [];
  const sandbox = {
    SYNC_STORAGE_KEYS: new Set(["favoriteSites", "themeMode"]),
    chrome: {
      storage: {
        local: {
          async get(requested) {
            calls.push(["local", storageKeys(requested)]);
            return Array.isArray(requested)
              ? Object.fromEntries(requested.map((key) => [key, localStore[key]]).filter(([, value]) => typeof value !== "undefined"))
              : { ...requested, ...localStore };
          }
        },
        sync: {
          async get(requested) {
            calls.push(["sync", storageKeys(requested)]);
            return Array.isArray(requested)
              ? Object.fromEntries(requested.map((key) => [key, syncStore[key]]).filter(([, value]) => typeof value !== "undefined"))
              : { ...requested, ...syncStore };
          }
        }
      }
    }
  };
  vm.createContext(sandbox);
  vm.runInContext(`${sourceBetween("function storageAreaForKey", "async function setStoredValues")}\nglobalThis.getStoredValues = getStoredValues;`, sandbox);
  const values = await sandbox.getStoredValues(defaults);
  return { calls: plain(calls), values: plain(values) };
}

function parseWayleafConfigFixture(text) {
  const sandbox = {
    SYNC_META_STORAGE_KEY: "syncMeta",
    SYNC_STORAGE_KEYS: new Set(["favoriteSites", "themeMode", "syncMeta"])
  };
  vm.createContext(sandbox);
  vm.runInContext(`${sourceBetween("function wayleafConfigKeys", "function downloadWayleafConfig")}\nglobalThis.parseWayleafConfigPackage = parseWayleafConfigPackage;`, sandbox);
  return plain(sandbox.parseWayleafConfigPackage(text));
}

function wayleafConfigFileNameFixture(now, random) {
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`${sourceBetween("function wayleafConfigFileName", "function downloadWayleafConfig")}\nglobalThis.wayleafConfigFileName = wayleafConfigFileName;`, sandbox);
  return sandbox.wayleafConfigFileName(now, random);
}

function cloudSyncPayloadFixture(values) {
  const sandbox = { FAVORITE_SITES_STORAGE_KEY: "favoriteSites" };
  vm.createContext(sandbox);
  vm.runInContext(`${sourceBetween("function favoriteSitesForCloudSync", "function readFirstPaintCache")}\nglobalThis.cloudSyncPayload = cloudSyncPayload;`, sandbox);
  return plain(sandbox.cloudSyncPayload(values));
}

assert.equal(
  manifest.background?.service_worker,
  "background.js",
  "Manifest should register the auto sync service worker."
);

assert.ok(
  manifest.permissions.includes("alarms"),
  "Manifest should request alarms permission for scheduled auto sync."
);

{
  const { calls, values } = await runStoredValuesFixture({
    syncStore: { favoriteSites: [{ title: "Restored", url: "https://example.com" }] },
    defaults: { favoriteSites: [], aiDirectPrompts: {} }
  });
  assert.deepEqual(
    values,
    { favoriteSites: [{ title: "Restored", url: "https://example.com" }], aiDirectPrompts: {} },
    "A reinstall with empty local storage should read synced settings from chrome.storage.sync."
  );
  assert.deepEqual(
    calls,
    [["local", ["favoriteSites", "aiDirectPrompts"]], ["sync", ["favoriteSites"]]],
    "Only sync-managed keys should be read from chrome.storage.sync."
  );
}

{
  const { values } = await runStoredValuesFixture({
    localStore: { favoriteSites: [{ title: "Local", url: "https://local.test" }] },
    syncStore: { favoriteSites: [{ title: "Cloud", url: "https://cloud.test" }] },
    defaults: { favoriteSites: [] }
  });
  assert.deepEqual(
    values.favoriteSites,
    [{ title: "Local", url: "https://local.test" }],
    "Local settings should still win over older synced settings."
  );
}

assert.deepEqual(
  parseWayleafConfigFixture(JSON.stringify({
    settings: {
      favoriteSites: [{ title: "Restored", url: "https://example.com" }],
      themeMode: "dark",
      syncMeta: { syncedAt: 1 },
      aiDirectPrompts: { stale: true }
    }
  })),
  {
    favoriteSites: [{ title: "Restored", url: "https://example.com" }],
    themeMode: "dark"
  },
  "Wayleaf .wy import should only accept sync-managed config keys and exclude sync metadata."
);

assert.deepEqual(
  cloudSyncPayloadFixture({
    favoriteSites: [{ id: "1", title: "Example", url: "https://example.com", icon: `data:image/png;base64,${"a".repeat(12000)}` }],
    themeMode: "dark",
    themePalette: { palette: "sage" },
    languagePreference: "zh-TW",
    searchSettings: { defaultSearchEngine: "google" }
  }),
  {
    favoriteSites: [{ id: "1", title: "Example", url: "https://example.com" }],
    themeMode: "dark",
    themePalette: { palette: "sage" },
    languagePreference: "zh-TW",
    searchSettings: { defaultSearchEngine: "google" }
  },
  "Cloud sync should preserve favorite-site identity and all customizable settings without quota-heavy icon data."
);

assert.throws(
  () => parseWayleafConfigFixture(JSON.stringify({ favoriteSites: [] })),
  /Invalid Wayleaf config package/,
  "Wayleaf .wy import should reject files without a settings package."
);

assert.match(
  html,
  /<div class="settings-group-heading sync-settings-heading">[\s\S]*id="syncSettingsTitle"[\s\S]*class="sync-settings-auto-pill" id="syncSettingsAutoButton"[\s\S]*class="sync-settings-auto-label">Auto sync<\/span>[\s\S]*class="sync-settings-auto-hint">Daily auto sync<\/span>/,
  "Auto sync should render as a pill beside the Cloud sync heading."
);

assert.match(
  html,
  /<span id="syncSettingsDetail" hidden><\/span>/,
  "Cloud sync ready state should not render the old second-line restore explanation."
);

assert.match(
  html,
  /<span class="sync-settings-actions" aria-label="Sync methods">[\s\S]*id="syncSettingsNowButton"[\s\S]*id="exportSettingsButton"[\s\S]*id="importSettingsButton"[\s\S]*id="importSettingsInput" type="file" accept="\.wy" hidden/,
  "Cloud sync settings should render manual sync and .wy import/export controls in the action row."
);

assert.doesNotMatch(
  html,
  /sync-settings-actions[\s\S]*id="syncSettingsAutoButton"/,
  "Auto sync should no longer be part of the lower action row."
);

assert.doesNotMatch(
  html,
  /sync-settings-mark/,
  "Cloud sync settings should not render the left-side status icon block."
);

assert.doesNotMatch(
  styles,
  /\.sync-settings-mark/,
  "Cloud sync settings should not keep styles for the removed left-side icon block."
);

assert.match(
  styles,
  /\.sync-settings-actions\s*\{[\s\S]*display:\s*flex;[\s\S]*flex-wrap:\s*wrap;[\s\S]*gap:\s*8px;[\s\S]*\}/,
  "Sync buttons should share a compact flex row."
);

assert.match(
  styles,
  /\.sync-settings-title-line\s*\{[\s\S]*display:\s*flex;[\s\S]*justify-content:\s*space-between;[\s\S]*\}/,
  "Cloud sync title should share a row with the auto sync pill."
);

assert.match(
  styles,
  /\.sync-settings-auto-pill\s*\{[\s\S]*border:\s*1px solid color-mix\(in srgb, #39ff88 72%, var\(--line\)\);[\s\S]*border-radius:\s*999px;[\s\S]*background:\s*color-mix\(in srgb, #39ff88 18%, var\(--panel\)\);/,
  "Auto sync pill should use fluorescent green capsule styling."
);

assert.doesNotMatch(
  styles,
  /\.sync-settings-auto-pill:hover,[\s\S]*?border-color:\s*#39ff88/,
  "Hovering the auto sync pill should not restyle the capsule itself."
);

assert.match(
  styles,
  /\.sync-settings-auto-hint\s*\{[\s\S]*position:\s*absolute;[\s\S]*bottom:\s*calc\(100% \+ 8px\);[\s\S]*max-width:\s*min\(220px, calc\(100vw - 40px\)\);[\s\S]*opacity:\s*0;[\s\S]*\}[\s\S]*\.sync-settings-auto-pill:hover \.sync-settings-auto-hint,[\s\S]*?\.sync-settings-auto-pill:focus-visible \.sync-settings-auto-hint\s*\{[\s\S]*opacity:\s*1;/,
  "Auto sync logic details should appear as a short tooltip bubble on hover or focus."
);

assert.match(
  styles,
  /\.sync-settings-action,[\s\S]*?\.sync-settings-action\.text-button\s*\{[\s\S]*min-width:\s*104px;[\s\S]*min-height:\s*40px;[\s\S]*font-size:\s*13px;/,
  "Sync action buttons should be smaller than the previous large manual-only button."
);

assert.match(
  styles,
  /\.sync-settings-action,[\s\S]*?\.sync-settings-action\.text-button\s*\{[\s\S]*border:\s*1px solid var\(--line-strong\);[\s\S]*background:\s*transparent;[\s\S]*color:\s*var\(--muted\);/,
  "Manual sync should use the neutral action color by default."
);

assert.match(
  styles,
  /\.sync-settings-action:hover,[\s\S]*?\.sync-settings-action:focus-visible,[\s\S]*?\.sync-settings-action:active\s*\{[\s\S]*border-color:\s*var\(--accent\);[\s\S]*background:\s*var\(--accent-wash-soft\);[\s\S]*color:\s*var\(--accent-strong\);/,
  "Manual sync should only switch to accent color on hover, focus, or press."
);

assert.match(
  styles,
  /\.sync-settings-row\[data-status="unavailable"\] \.sync-settings-action-manual\s*\{[\s\S]*pointer-events:\s*none;/,
  "When cloud sync is unavailable, only the manual cloud-sync action should stop receiving pointer events."
);

assert.doesNotMatch(
  styles,
  /\.sync-settings-row\[data-status="unavailable"\] \.sync-settings-action\s*\{/,
  "Import and export should stay available when cloud sync is unavailable."
);

assert.match(
  source,
  /const syncSettingsAutoButton = document\.querySelector\("#syncSettingsAutoButton"\);/,
  "New tab UI should track the auto sync display button."
);

assert.equal(
  wayleafConfigFileNameFixture(new Date(2026, 5, 23, 14, 7, 9), 0.007),
  "wayleaf-settings-20260623-140709-007.wy",
  "Wayleaf config export should include the local timestamp and a three-digit random suffix."
);

assert.match(
  source,
  /function wayleafConfigKeys\(\) \{[\s\S]*return \[\.\.\.SYNC_STORAGE_KEYS\]\.filter\(\(key\) => key !== SYNC_META_STORAGE_KEY\);[\s\S]*\}/,
  "Wayleaf config import/export should reuse the sync-managed settings whitelist without sync metadata."
);

assert.match(
  source,
  /function parseWayleafConfigPackage\(text\) \{[\s\S]*JSON\.parse\(text\)[\s\S]*parsed\?\.settings[\s\S]*Object\.prototype\.hasOwnProperty\.call\(settings, key\)[\s\S]*\}/,
  "Wayleaf config import should only accept keys from the settings package and whitelist."
);

assert.match(
  source,
  /function downloadWayleafConfig\(settings\) \{[\s\S]*new Blob\(\[JSON\.stringify\(\{[\s\S]*app: "Wayleaf"[\s\S]*version: WAYLEAF_CONFIG_EXPORT_VERSION[\s\S]*settings[\s\S]*link\.download = wayleafConfigFileName\(\);/,
  "Wayleaf config export should download a versioned .wy settings package."
);

assert.match(
  source,
  /async function handleImportSettingsFile\(file\) \{[\s\S]*\.endsWith\("\.wy"\)[\s\S]*await setStoredValues\(settings\);[\s\S]*chrome\.storage\.sync\.set\(cloudSyncPayload\(settings\)\);[\s\S]*\}/,
  "Wayleaf config import should require .wy files, write local settings, and sync them when available."
);

assert.match(
  source,
  /const CUSTOMIZABLE_SETTINGS_STORAGE_KEYS = \[[\s\S]*THEME_STORAGE_KEY,[\s\S]*THEME_PALETTE_STORAGE_KEY,[\s\S]*LANGUAGE_STORAGE_KEY,[\s\S]*SEARCH_SETTINGS_STORAGE_KEY[\s\S]*\];[\s\S]*SYNC_STORAGE_KEYS = new Set\([\s\S]*FAVORITE_SITES_STORAGE_KEY,[\s\S]*\.\.\.CUSTOMIZABLE_SETTINGS_STORAGE_KEYS/,
  "Manual sync and Wayleaf export should include favorite sites and every customizable settings key."
);

assert.match(
  source,
  /async function handleManualSyncSettings\(\) \{[\s\S]*chrome\.storage\.sync\.set\(cloudSyncPayload\(payload\)\)/,
  "Manual sync should upload the quota-safe favorite sites and all settings."
);

assert.match(
  source,
  /syncSettingsAutoButton\.setAttribute\("aria-disabled", "true"\);[\s\S]*syncSettingsAutoButton\.querySelector\("\.sync-settings-auto-label"\)\.textContent = t\("syncSettingsAuto"\);[\s\S]*syncSettingsAutoButton\.querySelector\("\.sync-settings-auto-hint"\)\.textContent = t\("syncSettingsAutoHint"\);/,
  "Auto sync pill should update its label and short tooltip copy from locale strings."
);

assert.doesNotMatch(
  source,
  /backupFilledIcon|backup-filled/,
  "Auto sync pill should not render the old auto-sync icon."
);

assert.match(
  source,
  /syncSettingsReadyDetail:\s*""/,
  "Ready-state cloud sync detail should be intentionally empty."
);

assert.match(
  source,
  /syncSettingsAutoHint:\s*"Daily sync"/,
  "English auto sync tooltip should stay short."
);

assert.match(
  source,
  /syncSettingsStatus\.textContent = t\("syncSettingsReady"\);[\s\S]*setSyncSettingsDetail\(""\);/,
  "Ready-state cloud sync status should hide the detail line."
);

assert.match(
  background,
  /const AUTO_SYNC_PERIOD_MINUTES = 24 \* 60;/,
  "Auto sync period should be one day."
);

assert.match(
  background,
  /chrome\.alarms\.create\(AUTO_SYNC_ALARM_NAME,\s*\{[\s\S]*delayInMinutes:\s*AUTO_SYNC_PERIOD_MINUTES,[\s\S]*periodInMinutes:\s*AUTO_SYNC_PERIOD_MINUTES[\s\S]*\}\);/,
  "Auto sync alarm should first run after one day and repeat daily."
);

assert.match(
  background,
  /\[SYNC_META_STORAGE_KEY\]:\s*\{[\s\S]*syncedAt:\s*Date\.now\(\),[\s\S]*source:\s*"auto"[\s\S]*\}/,
  "Auto sync should write metadata that distinguishes it from manual sync."
);

assert.match(
  background,
  /const CUSTOMIZABLE_SETTINGS_STORAGE_KEYS = \[[\s\S]*THEME_STORAGE_KEY,[\s\S]*THEME_PALETTE_STORAGE_KEY,[\s\S]*LANGUAGE_STORAGE_KEY,[\s\S]*SEARCH_SETTINGS_STORAGE_KEY[\s\S]*\];[\s\S]*SYNC_STORAGE_KEYS = \[[\s\S]*FAVORITE_SITES_STORAGE_KEY,[\s\S]*\.\.\.CUSTOMIZABLE_SETTINGS_STORAGE_KEYS/,
  "Auto sync should include favorite sites and every customizable settings key."
);

assert.match(
  background,
  /async function runAutoSyncSettings\(\) \{[\s\S]*\.\.\.cloudSyncPayload\(values\),[\s\S]*source:\s*"auto"/,
  "Auto sync should upload the quota-safe favorite sites and all settings."
);
