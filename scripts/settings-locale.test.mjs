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
  assert.match(localeMessages.extName?.message || "", /^Wayleaf(?:\b| - )/, `${chromeLocale} should define a localized Wayleaf extension name.`);
  assert.ok(localeMessages.extDescription?.message?.trim(), `${chromeLocale} should define the extension description.`);
  assert.ok(localeMessages.extName.message.length <= 75, `${chromeLocale} extension name should fit Chrome's 75-character manifest limit.`);
  assert.ok(localeMessages.extDescription.message.length <= 132, `${chromeLocale} extension description should fit Chrome's 132-character manifest limit.`);
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
function isIntentionallyEmptyLocaleKey(locale, key) {
  return key === "syncSettingsReadyDetail" ||
    key === "socialVideoExtractorDescription" ||
    (locale === "zh-TW" && key === "videoPipLabDescription");
}
for (const locale of supportedLocales) {
  const missingKeys = baselineLocaleKeys.filter((key) => (
    typeof messages[locale]?.[key] !== "string" ||
    (!isIntentionallyEmptyLocaleKey(locale, key) && !messages[locale][key].trim())
  ));
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
  "brandBaidu",
  "brandDoubao",
  "brandQwen",
  "brandJimeng",
  "brandXiaohongshu",
  "brandDouyin",
  "brandZhihu",
  "openSettings",
  "settingsBackHome",
  "settingsTitle",
  "settingsSubtitle",
  "settingsTabsLabel",
  "settingsBasicTab",
  "settingsSearchTab",
  "settingsLaboratoryTab",
  "videoPipLabTitle",
  "videoPipLabDescription",
  "videoPipGlobalLabel",
  "videoPipGlobalHint",
  "socialVideoExtractorTitle",
  "socialVideoExtractorDescription",
  "socialVideoExtractorLabel",
  "socialVideoExtractorHint",
  "socialVideoExtractorSupport",
  "languageSettingsTitle",
  "appearanceModeTitle",
  "themeModeSystem",
  "themeModeLight",
  "themeModeDark",
  "presetPaletteTitle",
  "themePaletteSage",
  "themePaletteForest",
  "themePaletteAmber",
  "themePaletteSky",
  "themePalettePeach",
  "themePaletteNeutral",
  "syncSettingsTitle",
  "syncSettingsReady",
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
  "searchSettingsResetDone"
];

for (const locale of supportedLocales) {
  assert.ok(messages[locale], `${locale} messages should exist.`);
  for (const key of settingsLocaleKeys) {
    assert.equal(typeof messages[locale][key], "string", `${locale}.${key} should be translated without fallback.`);
    if (!isIntentionallyEmptyLocaleKey(locale, key)) {
      assert.ok(messages[locale][key].trim(), `${locale}.${key} should not be empty.`);
    }
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

for (const [engineId, label, labelKey] of [
  ["baidu", "Baidu", "brandBaidu"],
  ["doubao", "Doubao", "brandDoubao"],
  ["qwen", "Qwen", "brandQwen"],
  ["jimeng", "Jimeng", "brandJimeng"],
  ["xiaohongshu", "RedNote", "brandXiaohongshu"],
  ["douyin", "Douyin", "brandDouyin"],
  ["zhihu", "Zhihu", "brandZhihu"]
]) {
  assert.match(
    source,
    new RegExp(`\\{ id: "${engineId}"[^}]*label: "${label}", labelKey: "${labelKey}"`),
    `${engineId} should use an English baseline plus a localized display key.`
  );
}

for (const locale of ["en", "ja", "ko", "es", "fr", "de"]) {
  for (const key of ["brandBaidu", "brandDoubao", "brandQwen", "brandJimeng", "brandXiaohongshu", "brandDouyin", "brandZhihu"]) {
    assert.doesNotMatch(messages[locale][key], /[\u3400-\u9fff]/, `${locale}.${key} should not leak a Chinese default name.`);
  }
}

const normalizeCustomLabelSource = source.match(/function normalizeSearchEngineCustomLabel\(value, engine\) \{[\s\S]*?\n\}/)?.[0];
assert.ok(normalizeCustomLabelSource, "Built-in search engine label migration should be declared.");
const normalizeCustomLabel = Function(
  "normalizeSettingText",
  "SUPPORTED_LOCALES",
  "MESSAGES",
  `${normalizeCustomLabelSource}; return normalizeSearchEngineCustomLabel;`
)(
  (value, fallback, maxLength) => String(value || "").trim().slice(0, maxLength) || fallback,
  supportedLocales,
  messages
);
const doubaoEngine = { label: "Doubao", labelKey: "brandDoubao" };
assert.equal(normalizeCustomLabel("豆包", doubaoEngine), "", "A saved Simplified Chinese default should migrate to the active locale.");
assert.equal(normalizeCustomLabel("Doubao", doubaoEngine), "", "A saved English default should remain locale-driven.");
assert.equal(normalizeCustomLabel("My assistant", doubaoEngine), "My assistant", "A user-customized engine name should remain unchanged.");

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
  /settingsBasicTab\.querySelector\("\.settings-tab-label"\)\.textContent = t\("settingsBasicTab"\);[\s\S]*settingsSearchTab\.querySelector\("\.settings-tab-label"\)\.textContent = t\("settingsSearchTab"\);[\s\S]*settingsLaboratoryTab\.querySelector\("\.settings-tab-label"\)\.textContent = t\("settingsLaboratoryTab"\);[\s\S]*settingsBasicTab\.setAttribute\("aria-label", t\("settingsBasicTab"\)\);[\s\S]*settingsSearchTab\.setAttribute\("aria-label", t\("settingsSearchTab"\)\);[\s\S]*settingsLaboratoryTab\.setAttribute\("aria-label", t\("settingsLaboratoryTab"\)\);/,
  "Icon-only settings tabs should localize their hidden labels and accessible names without replacing their icons."
);

assert.doesNotMatch(
  source,
  /document\.querySelector\("#settings(?:Basic|Search|Laboratory)Tab"\)\.textContent/,
  "Settings localization must not replace icon-only tab contents with visible text."
);

assert.match(
  source,
  /document\.querySelector\("\.sync-settings-actions"\)\?\.setAttribute\("aria-label", t\("syncSettingsActionsLabel"\)\);/,
  "Sync action group aria label should be localized."
);

assert.match(
  source,
  /videoPipLabDescription\.hidden = !videoPipLabDescriptionText\.trim\(\);/,
  "Empty Laboratory description copy should remove the spare description line."
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
  /<div class="theme-mode-control settings-language-control" id="languageOptions" role="radiogroup" aria-labelledby="languageSettingsTitle" data-active-index="0"><\/div>/,
  "Basic settings should expose all language choices through the existing appearance segmented-control style."
);

assert.doesNotMatch(
  html,
  /id="languageTrigger"|id="languagePicker"|<select[^>]+id="languageSelect"/,
  "Language settings should not keep a dropdown trigger or invoke the native system select menu."
);

assert.match(
  source,
  /option\.className = "theme-mode-button settings-language-option";/,
  "Language choices should reuse the appearance button style without duplicating its CSS."
);

assert.match(
  source,
  /option\.setAttribute\("role", "radio"\);/,
  "Language choices should remain an isolated accessible radio group."
);

assert.match(
  css,
  /\.settings-language-control\s*\{[\s\S]*?grid-template-columns: repeat\(6, minmax\(0, 1fr\)\);[\s\S]*?\}/,
  "All six language choices should stay in one horizontal row."
);

assert.match(
  css,
  /\.settings-language-control::before\s*\{[\s\S]*?width: calc\(\(100% - \(var\(--theme-mode-padding\) \* 2\) - \(var\(--theme-mode-gap\) \* 5\)\) \/ 6\);[\s\S]*?\}/,
  "The reused appearance selection indicator should fit one of six language columns."
);

assert.match(
  css,
  /@media \(max-width: 560px\)[\s\S]*?\.settings-language-control\s*\{[\s\S]*?--theme-mode-gap: 2px;[\s\S]*?\.settings-language-control \.theme-mode-button\s*\{[\s\S]*?padding: 0 2px;[\s\S]*?font-size: 11px;/,
  "Narrow settings should keep all six language labels readable on one row."
);

assert.match(
  css,
  /\.theme-mode-control\[data-active-index="5"\]::before\s*\{\s*transform: translateX\(calc\(\(100% \+ var\(--theme-mode-gap\)\) \* 5\)\);\s*\}/,
  "The shared appearance indicator should reach the sixth language choice."
);

assert.doesNotMatch(
  css,
  /settings-language-trigger|settings-language-options|settings-language-option-icon/,
  "Legacy dropdown-only language styles should be removed."
);

assert.match(
  source,
  /languageOptions\.setAttribute\("data-active-index", String\(activeIndex\)\);[\s\S]*option\.setAttribute\("aria-checked", String\(isSelected\)\);/,
  "Language selection state should remain isolated from appearance state while driving the shared UI."
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
