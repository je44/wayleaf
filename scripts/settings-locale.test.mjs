import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");

const supportedLocalesMatch = source.match(/const SUPPORTED_LOCALES = (\[[^\]]+\]);/);
assert.ok(supportedLocalesMatch, "Supported locales should be declared.");
const supportedLocales = JSON.parse(supportedLocalesMatch[1]);

const messagesMatch = source.match(/const MESSAGES = (\{[\s\S]*?\n\});\nconst LOCALE =/);
assert.ok(messagesMatch, "Messages object should be available for locale coverage checks.");
const messages = Function(`"use strict"; return (${messagesMatch[1]});`)();

const settingsLocaleKeys = [
  "quickSearchAggregate",
  "openSettings",
  "settingsBackHome",
  "settingsTitle",
  "settingsSubtitle",
  "settingsTabsLabel",
  "settingsBasicTab",
  "settingsSearchTab",
  "appearanceModeTitle",
  "appearanceModeDescription",
  "appearanceModeHint",
  "themeModeSystem",
  "themeModeLight",
  "themeModeDark",
  "presetPaletteTitle",
  "presetPaletteDescription",
  "presetPaletteHint",
  "themePaletteSage",
  "themePaletteForest",
  "themePaletteAmber",
  "themePaletteSky",
  "themePalettePeach",
  "themePaletteNeutral",
  "syncSettingsTitle",
  "syncSettingsDescription",
  "syncSettingsReady",
  "syncSettingsReadyDetail",
  "syncSettingsUnavailable",
  "syncSettingsUnavailableDetail",
  "syncSettingsDone",
  "syncSettingsDoneDetail",
  "syncSettingsNow",
  "syncSettingsAuto",
  "syncSettingsActionsLabel",
  "searchSettingsDefaultTitle",
  "searchSettingsDefaultDescription",
  "searchSettingsDefaultHint",
  "searchSettingsAiTitle",
  "searchSettingsAiDescription",
  "searchSettingsAiHint",
  "searchSettingsPlatformTitle",
  "searchSettingsPlatformDescription",
  "searchSettingsPlatformHint",
  "searchSettingsPlatformPrefix",
  "searchSettingsPlatformQuery",
  "searchSettingsBuiltInBadge",
  "platformSearchDirectBehavior",
  "platformSearchLoginBehavior",
  "platformSearchFallbackBehavior",
  "searchSettingsSetDefault",
  "searchSettingsDefaultBadge",
  "searchSettingsEdit",
  "searchSettingsDoneEdit",
  "searchSettingsEngineName",
  "searchSettingsEngineCommands",
  "searchSettingsEngineUrl",
  "searchSettingsSave",
  "searchSettingsReset",
  "searchSettingsSaved",
  "searchSettingsResetDone",
  "customPaletteTitle",
  "customPaletteDescription",
  "customPaletteHint",
  "lightAccent",
  "darkAccent"
];

for (const locale of supportedLocales) {
  assert.ok(messages[locale], `${locale} messages should exist.`);
  for (const key of settingsLocaleKeys) {
    assert.equal(typeof messages[locale][key], "string", `${locale}.${key} should be translated without fallback.`);
    assert.ok(messages[locale][key].trim(), `${locale}.${key} should not be empty.`);
  }
}

const themePalettesMatch = source.match(/const THEME_PALETTES = \[[\s\S]*?\n\];\nconst DEFAULT_LOCAL_SEARCH_ENGINE =/);
assert.ok(themePalettesMatch, "Theme palettes should be declared.");
assert.doesNotMatch(
  themePalettesMatch[0],
  /label:\s*"/,
  "Theme palette labels should use locale keys instead of fixed display strings."
);

assert.match(
  source,
  /\{ id: "local", label: "Aggregate search", labelKey: "quickSearchAggregate", local: true \}/,
  "The local aggregate search engine should expose a locale key for display."
);

assert.match(
  source,
  /document\.querySelector\("\.settings-tabs"\)\?\.setAttribute\("aria-label", t\("settingsTabsLabel"\)\);/,
  "Settings tab list aria label should be localized."
);

assert.match(
  source,
  /document\.querySelector\("\.sync-settings-actions"\)\?\.setAttribute\("aria-label", t\("syncSettingsActionsLabel"\)\);/,
  "Sync action group aria label should be localized."
);

assert.match(
  source,
  /function updateSettingsActiveSummary\(tabName = "basic"\) \{[\s\S]*querySelectorAll\("\.settings-group h3"\)[\s\S]*\.join\(" \/ "\);[\s\S]*document\.querySelector\("#settingsTitle"\)\.textContent = title;[\s\S]*document\.querySelector\("#settingsSubtitle"\)\.textContent = details \|\| t\("settingsSubtitle"\);/,
  "Visible settings header should describe the selected settings function from localized section headings."
);

assert.match(
  source,
  /updateSettingsActiveSummary\(settingsTabButtons\.find\(\(button\) => button\.classList\.contains\("active"\)\)\?\.dataset\.settingsTab\);/,
  "Locale refresh should keep the visible settings header aligned with the active tab."
);

assert.match(
  source,
  /settingsTabsShell\.setAttribute\("data-stuck", isStuck \? "true" : "false"\);[\s\S]*settingsShell\?\.setAttribute\("data-stuck", isStuck \? "true" : "false"\);/,
  "Settings scroll state should drive the fixed titlebar shadow, not only the sidebar tab rail."
);
