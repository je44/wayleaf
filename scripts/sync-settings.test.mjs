import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../newtab.html", import.meta.url), "utf8");
const styles = readFileSync(new URL("../newtab.css", import.meta.url), "utf8");
const source = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");
const background = readFileSync(new URL("../background.js", import.meta.url), "utf8");
const manifest = JSON.parse(readFileSync(new URL("../manifest.json", import.meta.url), "utf8"));

assert.equal(
  manifest.background?.service_worker,
  "background.js",
  "Manifest should register the auto sync service worker."
);

assert.ok(
  manifest.permissions.includes("alarms"),
  "Manifest should request alarms permission for scheduled auto sync."
);

assert.match(
  html,
  /<span class="sync-settings-actions" aria-label="Sync methods">[\s\S]*id="syncSettingsNowButton"[\s\S]*id="syncSettingsAutoButton"[\s\S]*aria-disabled="true" disabled/,
  "Cloud sync settings should render manual and disabled auto sync buttons with the English baseline label."
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
  /\.sync-settings-action-auto,[\s\S]*?\.sync-settings-action-auto\.text-button\s*\{[\s\S]*border-color:\s*var\(--accent\);[\s\S]*background:\s*var\(--accent-wash\);[\s\S]*color:\s*var\(--accent-strong\);/,
  "Auto sync should keep a highlighted default state."
);

assert.match(
  styles,
  /\.sync-settings-action-auto:disabled,[\s\S]*?\.sync-settings-action-auto\.text-button:disabled\s*\{[\s\S]*border-color:\s*var\(--accent\);[\s\S]*background:\s*var\(--accent-wash\);[\s\S]*color:\s*var\(--accent-strong\);[\s\S]*opacity:\s*1;/,
  "The disabled auto sync display button should remain highlighted."
);

assert.match(
  source,
  /const syncSettingsAutoButton = document\.querySelector\("#syncSettingsAutoButton"\);/,
  "New tab UI should track the auto sync display button."
);

assert.match(
  source,
  /syncSettingsAutoButton\.disabled = true;[\s\S]*syncSettingsAutoButton\.setAttribute\("aria-disabled", "true"\);/,
  "Auto sync button must remain a non-interactive display control."
);

assert.match(
  source,
  /"backup-filled":\s*'<path fill="currentColor"/,
  "Auto sync should have a local backup-filled fallback icon."
);

assert.match(
  source,
  /function backupFilledIcon\(\) \{[\s\S]*return tdesignIcon\("backup-filled"\);[\s\S]*\}/,
  "Auto sync should render the TDesign backup-filled icon."
);

assert.match(
  source,
  /syncSettingsAutoButton\.querySelector\("\.button-icon"\)\.innerHTML = backupFilledIcon\(\);/,
  "Auto sync display button should use the backup-filled icon."
);

assert.match(
  source,
  /syncSettingsReadyDetail:\s*"同一 Google 账号安装后会自动恢复；扩展启用时每天自动同步一次。"/,
  "Chinese sync status copy should describe daily auto sync while enabled."
);

assert.match(
  source,
  /syncSettingsReadyDetail:\s*"Install with the same Google account to restore; auto sync runs once daily while the extension is enabled\."/,
  "English sync status copy should describe daily auto sync while enabled."
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
