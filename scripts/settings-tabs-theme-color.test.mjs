import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const styles = readFileSync(new URL("../newtab.css", import.meta.url), "utf8");
const html = readFileSync(new URL("../newtab.html", import.meta.url), "utf8");
const source = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");

function cssBlock(selector) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return styles.match(new RegExp(`${escapedSelector}\\s*\\{([\\s\\S]*?)\\n\\}`))?.[1] || "";
}

const rootBlock = cssBlock(":root");
const darkBlock = cssBlock(':root[data-theme="dark"]');
const warmDarkBlock = styles.match(
  /:root\[data-theme="dark"\]\[data-theme-palette="amber"\],\s*:root\[data-theme="dark"\]\[data-theme-palette="peach"\]\s*\{(?<body>[\s\S]*?)\n\}/
)?.groups?.body || "";
const settingsPageBlock = cssBlock(".settings-page");
const settingsBrandBlock = cssBlock(".settings-brand");
const settingsTabsBlock = cssBlock(".settings-tabs");
const settingsTabsShellBlock = cssBlock(".settings-tabs-shell");
const settingsTabBlock = cssBlock(".settings-tab");
const settingsTabActiveBlock = cssBlock(".settings-tab.active");
const settingsLanguageControlBlock = cssBlock(".settings-language-control");
const settingsLanguageControlIndicatorBlock = cssBlock(".settings-language-control::before");
const desktopSettingsTitlebarBlock = styles.match(
  /@media \(min-width: 1120px\)[\s\S]*?\.settings-page::before\s*\{(?<body>[\s\S]*?)\n  \}/
)?.groups?.body || "";
const fontPath = new URL("../vendor/fonts/VujahdayScript-Regular.ttf", import.meta.url);

assert.match(
  html,
  /<div class="settings-brand" aria-hidden="true">WayLeaf<\/div>\s*<div class="settings-tabs-shell">[\s\S]*id="settingsBasicTab"[\s\S]*settings-tab-icon[\s\S]*id="settingsSearchTab"[\s\S]*settings-tab-icon[\s\S]*id="settingsLaboratoryTab"[\s\S]*settings-tab-icon/,
  "Settings page should keep the WayLeaf wordmark and render all settings destinations as icon controls."
);

assert.match(
  html,
  /<h3 id="appearanceModeTitle">Appearance<\/h3>\s*<\/div>/,
  "Appearance settings should not render descriptive copy below the title."
);

assert.equal(
  existsSync(fontPath),
  true,
  "Vujahday Script font should be deployed inside the extension assets."
);

assert.match(
  styles,
  /@font-face\s*\{[\s\S]*font-family:\s*"Wayleaf Vujahday Script";[\s\S]*src:\s*url\("vendor\/fonts\/VujahdayScript-Regular\.ttf"\)\s*format\("truetype"\);/,
  "WayLeaf brand title should load Vujahday Script from the packaged extension font asset."
);

assert.match(
  settingsPageBlock,
  /--settings-content-width:\s*min\(760px,\s*calc\(100vw - 48px\)\);/,
  "Settings page should expose one shared content width for the brand, tabs, and panel."
);

assert.match(
  settingsBrandBlock,
  /display:\s*block;[\s\S]*width:\s*var\(--settings-content-width\);[\s\S]*min-height:\s*48px;[\s\S]*margin:\s*36px 0 0;[\s\S]*font-family:\s*"Wayleaf Vujahday Script"[\s\S]*font-size:\s*40\.48px;/,
  "WayLeaf title should align to the settings content, use Vujahday Script, render 10% larger, and move down 4px."
);

assert.match(
  settingsBrandBlock,
  /font-feature-settings:\s*"kern" 1;[\s\S]*font-kerning:\s*normal;[\s\S]*letter-spacing:\s*0;[\s\S]*text-rendering:\s*optimizeLegibility;/,
  "WayLeaf title should keep neutral tracking while enabling font kerning for better character spacing."
);

assert.match(
  rootBlock,
  /--settings-tabs-bg:\s*color-mix\(in srgb, var\(--panel\) 88%, transparent\);[\s\S]*--settings-tab-color:\s*var\(--muted\);/,
  "Settings tabs should share the same background and muted icon color as the settings cards."
);

assert.doesNotMatch(
  darkBlock,
  /--settings-tabs-bg:/,
  "Dark settings tabs should inherit the same card-matched tab tokens instead of using a separate control color."
);

assert.doesNotMatch(
  warmDarkBlock,
  /--settings-tabs-bg:/,
  "Warm dark palettes should not override the card-matched settings tab background."
);

assert.match(
  settingsTabsBlock,
  /min-width:\s*132px;[\s\S]*border:\s*1px solid var\(--line\);[\s\S]*border-radius:\s*4px;[\s\S]*background:\s*var\(--settings-tabs-bg\);/,
  "Settings icon rail should match the settings card background with a 4px outlined mask and no visible reserved slot."
);

assert.match(
  settingsTabsShellBlock,
  /--settings-tabs-panel-gap:\s*14px;[\s\S]*width:\s*var\(--settings-content-width\);[\s\S]*margin:\s*25px 0 var\(--settings-tabs-panel-gap\);[\s\S]*padding:\s*10px 0 0;/,
  "Settings tabs should share the settings content left edge and keep the requested 15px downward offset."
);

assert.match(
  styles,
  /@media \(max-width: 560px\)[\s\S]*\.settings-page\s*\{[\s\S]*--settings-content-width:\s*min\(100%,\s*calc\(100vw - 24px\)\);[\s\S]*\.settings-tabs-shell\s*\{[\s\S]*--settings-tabs-panel-gap:\s*10px;[\s\S]*margin:\s*10px 0 var\(--settings-tabs-panel-gap\);[\s\S]*padding:\s*8px 0 0;/,
  "Narrow settings tabs should keep compact spacing while sharing the same content width variable."
);

assert.match(
  styles,
  /@media \(min-width: 1120px\)[\s\S]*\.settings-page\s*\{[\s\S]*--settings-titlebar-height:\s*70px;[\s\S]*\.settings-tabs-shell\s*\{[\s\S]*position:\s*fixed;[\s\S]*top:\s*149px;[\s\S]*left:\s*calc\(50% - 440px\);[\s\S]*width:\s*44px;[\s\S]*\.settings-tabs\s*\{[\s\S]*grid-auto-flow:\s*row;[\s\S]*grid-auto-rows:\s*44px;[\s\S]*min-height:\s*132px;[\s\S]*\.settings-tab \+ \.settings-tab::before\s*\{[\s\S]*width:\s*26px;[\s\S]*height:\s*1px;/,
  "Desktop settings navigation should be a compact vertical icon rail beside the first settings card, without rendering future empty slots."
);

assert.doesNotMatch(
  desktopSettingsTitlebarBlock,
  /transition:[\s\S]*background/,
  "Desktop settings titlebar should not tween its background during theme switches."
);

assert.match(
  settingsLanguageControlBlock,
  /transition:\s*color 160ms ease;/,
  "Language settings control should keep only text color transition during theme switches."
);

assert.match(
  settingsLanguageControlIndicatorBlock,
  /transition:\s*transform 180ms cubic-bezier\(0\.2, 0, 0, 1\);/,
  "Language settings indicator should move without tweening theme backgrounds."
);

assert.match(
  styles,
  /\.settings-page\[data-scrollable="false"\]\s*\{\s*overflow-y:\s*hidden;\s*\}/,
  "Settings page should disable vertical scrolling when the active content is already fully visible."
);

assert.match(
  styles,
  /@media \(min-width: 1120px\)[\s\S]*\.settings-tabs-shell\[data-faded="true"\]\s*\{[\s\S]*opacity:\s*0;[\s\S]*pointer-events:\s*none;[\s\S]*transform:\s*translateY\(-6px\);/,
  "Desktop settings icon rail should fade out after a real downward scroll."
);

assert.match(
  settingsTabBlock,
  /color:\s*var\(--settings-tab-color\);/,
  "Inactive settings tab labels should consume the theme-aware label token."
);

assert.match(
  settingsTabActiveBlock,
  /background:\s*transparent;[\s\S]*color:\s*var\(--ink\);/,
  "Active settings tabs should avoid selected fill and rely on filled icon state plus stronger color."
);

assert.match(
  source,
  /const SETTINGS_TAB_ICONS = Object\.freeze\(\{[\s\S]*basic:\s*\{ inactive:\s*"system-setting", active:\s*"system-setting-filled" \},[\s\S]*search:\s*\{ inactive:\s*"ai-search", active:\s*"ai-search-filled" \},[\s\S]*laboratory:\s*\{ inactive:\s*"filter-2", active:\s*"filter-2-filled" \}/,
  "Settings tab icons should be data-mapped so future settings sections can be added in code without rendering placeholder slots."
);

assert.match(
  source,
  /function closeSettingsPanel\(\) \{[\s\S]*\}, prefersReducedMotion\(\) \? 0 : 220\);/,
  "Settings cleanup should match the 220ms close transition and finish immediately for reduced-motion users."
);

assert.doesNotMatch(
  settingsTabActiveBlock,
  /border/,
  "Active settings tabs should follow the no-outline selected-state style."
);
