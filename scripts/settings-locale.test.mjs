import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../newtab.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../newtab.css", import.meta.url), "utf8");
const manifest = JSON.parse(readFileSync(new URL("../manifest.json", import.meta.url), "utf8"));

assert.equal(manifest.default_locale, "en", "Chrome extension metadata should use English as its default locale.");
assert.equal(manifest.name, "__MSG_extName__", "Extension name should use Chrome i18n messages.");
assert.equal(manifest.description, "__MSG_extDescription__", "Extension description should use Chrome i18n messages.");

assert.match(
  source,
  /const DEFAULT_LOCALE = "en";/,
  "English should be the fallback locale when no supported system language is available."
);

assert.match(
  html,
  /<html lang="en"/,
  "Static HTML should use English as the baseline before runtime locale hydration."
);

assert.doesNotMatch(
  html,
  /[\u4e00-\u9fff]/,
  "Static HTML should not default the extension UI to Chinese; runtime locale hydration supplies translated copy."
);

assert.match(
  source,
  /return DEFAULT_LOCALE;\s*\n\}/,
  "Unsupported system languages should fall back to the default locale."
);

const supportedLocalesMatch = source.match(/const SUPPORTED_LOCALES = (\[[^\]]+\]);/);
assert.ok(supportedLocalesMatch, "Supported locales should be declared.");
const supportedLocales = JSON.parse(supportedLocalesMatch[1]);
const chromeLocaleByAppLocale = {
  "zh-CN": "zh_CN",
  "zh-TW": "zh_TW",
  en: "en",
  ja: "ja",
  ko: "ko",
  es: "es",
  fr: "fr",
  de: "de"
};

for (const locale of supportedLocales) {
  const chromeLocale = chromeLocaleByAppLocale[locale];
  assert.ok(chromeLocale, `${locale} should map to a Chrome _locales directory.`);
  const localeMessages = JSON.parse(readFileSync(new URL(`../_locales/${chromeLocale}/messages.json`, import.meta.url), "utf8"));
  assert.equal(localeMessages.extName?.message, "Wayleaf", `${chromeLocale} should define the extension name.`);
  assert.ok(localeMessages.extDescription?.message?.trim(), `${chromeLocale} should define the extension description.`);
}

const messagesMatch = source.match(/const MESSAGES = (\{[\s\S]*?\n\});\nconst LOCALE_COMPLETIONS =/);
assert.ok(messagesMatch, "Messages object should be available for locale coverage checks.");
const messages = Function(`"use strict"; return (${messagesMatch[1]});`)();

const completionsMatch = source.match(/const LOCALE_COMPLETIONS = (\{[\s\S]*?\n\});\nfor \(const \[locale, messages\] of Object\.entries\(LOCALE_COMPLETIONS\)\)/);
assert.ok(completionsMatch, "Locale completions should be available for full locale coverage checks.");
const completions = Function(`"use strict"; return (${completionsMatch[1]});`)();
for (const [locale, completion] of Object.entries(completions)) {
  Object.assign(messages[locale], completion);
}

const baselineLocaleKeys = Object.keys(messages.en);
for (const locale of supportedLocales) {
  const missingKeys = baselineLocaleKeys.filter((key) => typeof messages[locale]?.[key] !== "string" || !messages[locale][key].trim());
  assert.deepEqual(missingKeys, [], `${locale} should cover every English baseline UI key without falling back to another language.`);
}

const messageTemplateSource = source.match(/function messageTemplate\(key\) \{[\s\S]*?\n\}/)?.[0] || "";
assert.ok(messageTemplateSource, "Message fallback helper should be declared.");
assert.match(
  messageTemplateSource,
  /MESSAGES\[DEFAULT_LOCALE\]\[key\]/,
  "Missing UI strings should fall back to the default locale."
);
assert.doesNotMatch(
  messageTemplateSource,
  /zh-CN|MESSAGES\["zh-CN"\]/,
  "Simplified Chinese must stay a selectable system locale only, never a fallback source."
);

const settingsLocaleKeys = [
  "quickSearchAggregate",
  "openSettings",
  "settingsBackHome",
  "settingsTitle",
  "settingsSubtitle",
  "settingsTabsLabel",
  "settingsBasicTab",
  "settingsSearchTab",
  "languageSettingsTitle",
  "languageSettingsDescription",
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
  /quickSearchInput\.labels\?\.forEach\(\(label\) => \{\s*label\.textContent = t\("quickSearchPlaceholder"\);\s*\}\);/,
  "The hidden quick-search label should hydrate with the system locale, not keep the English HTML baseline."
);

assert.match(
  source,
  /document\.querySelector\("\.settings-tabs"\)\?\.setAttribute\("aria-label", t\("settingsTabsLabel"\)\);/,
  "Settings tab list aria label should be localized."
);

assert.match(
  source,
  /settingsBasicTab\.querySelector\("\.settings-tab-label"\)\.textContent = t\("settingsBasicTab"\);[\s\S]*settingsSearchTab\.querySelector\("\.settings-tab-label"\)\.textContent = t\("settingsSearchTab"\);[\s\S]*settingsBasicTab\.setAttribute\("aria-label", t\("settingsBasicTab"\)\);[\s\S]*settingsSearchTab\.setAttribute\("aria-label", t\("settingsSearchTab"\)\);/,
  "Icon-only settings tabs should localize their hidden labels and accessible names without replacing their icons."
);

assert.doesNotMatch(
  source,
  /document\.querySelector\("#settings(?:Basic|Search)Tab"\)\.textContent/,
  "Settings localization must not replace icon-only tab contents with visible text."
);

assert.match(
  source,
  /document\.querySelector\("\.sync-settings-actions"\)\?\.setAttribute\("aria-label", t\("syncSettingsActionsLabel"\)\);/,
  "Sync action group aria label should be localized."
);

assert.match(
  source,
  /const LANGUAGE_PREFERENCES = \["system", "zh-TW", "zh-CN", "en", "ja", "ko"\];/,
  "Language settings should expose exactly the requested choices."
);

assert.match(
  source,
  /await setStoredValues\(\{ \[LANGUAGE_STORAGE_KEY\]: activeLanguagePreference \}\);/,
  "The selected language should persist with the existing settings storage path."
);

assert.match(
  html,
  /<button class="portal-category-trigger settings-language-trigger" id="languageTrigger"[^>]+aria-haspopup="listbox"[^>]+aria-controls="languageOptions"/,
  "Basic settings should use Wayleaf's custom listbox trigger."
);

assert.doesNotMatch(
  html,
  /<select[^>]+id="languageSelect"/,
  "Language settings should not invoke the native system select menu."
);

assert.match(
  source,
  /document\.querySelector\("\.settings-language-trigger-icon"\)\.innerHTML = chevronDownIcon\(\);/,
  "The language menu trigger should use Wayleaf's existing TDesign chevron."
);

assert.match(
  source,
  /icon\.innerHTML = tdesignIcon\("check"\);/,
  "The selected language should use a TDesign check icon."
);

assert.match(
  css,
  /\.settings-language-trigger:focus,[\s\S]*?border-color: var\(--accent-border\);[\s\S]*?outline: 0;[\s\S]*?box-shadow: none;/,
  "The custom language trigger should replace the native blue focus ring with Wayleaf's accent border."
);

assert.match(
  css,
  /\.settings-language-trigger \{\s*min-height: 40px;\s*\}/,
  "The language trigger should match the 40px active appearance control height."
);

assert.match(
  css,
  /\.settings-language-option \{\s*min-height: 40px;/,
  "Every expanded language option should match the 40px trigger height."
);

assert.match(
  css,
  /\.settings-language-options \{[\s\S]*?position: absolute;[\s\S]*?top: calc\(100% \+ 6px\);/,
  "Opening the language menu should overlay the settings page instead of changing its layout height."
);

assert.match(
  source,
  /openLanguagePicker\(\{ focusOption: event\?\.detail === 0 \}\);/,
  "Pointer-opened language menus should keep trigger focus and avoid scrolling the settings page."
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
  /const lastContent = activeBody\?\.lastElementChild \|\| activeBody;[\s\S]*contentBottom[\s\S]*settingsShell\.scrollTop[\s\S]*const isScrollable = contentBottom > settingsShell\.clientHeight \+ 2;/,
  "Settings scrollability should be measured from the active panel content, not a fixed baseline or page padding."
);

assert.match(
  source,
  /settingsShell\.setAttribute\("data-scrollable", isScrollable \? "true" : "false"\);[\s\S]*settingsTabsShell\.setAttribute\("data-faded", isStuck \? "true" : "false"\);[\s\S]*settingsShell\.setAttribute\("data-stuck", isStuck \? "true" : "false"\);/,
  "Settings scroll state should lock non-scrollable pages and fade the fixed tab rail only after real scrolling."
);
