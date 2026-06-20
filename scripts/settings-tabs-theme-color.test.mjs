import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const styles = readFileSync(new URL("../newtab.css", import.meta.url), "utf8");
const html = readFileSync(new URL("../newtab.html", import.meta.url), "utf8");

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
const fontPath = new URL("../vendor/fonts/VujahdayScript-Regular.ttf", import.meta.url);

assert.match(
  html,
  /<div class="settings-brand" aria-hidden="true">WayLeaf<\/div>\s*<div class="settings-tabs-shell">/,
  "Settings page should render the WayLeaf brand title as one text run so the font can apply natural kerning."
);

assert.match(
  html,
  /<h3 id="appearanceModeTitle">外观<\/h3>\s*<p>选择 Wayleaf 的外观<\/p>/,
  "Appearance mode heading and helper copy should use the shorter visible label."
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
  /--settings-tabs-bg:\s*var\(--theme-mode-control-bg\);[\s\S]*--settings-tab-active-bg:\s*var\(--theme-mode-active-bg\);[\s\S]*--settings-tab-active-shadow:\s*var\(--theme-mode-active-shadow\);[\s\S]*--settings-tab-color:\s*var\(--theme-mode-button-color\);/,
  "Settings tabs should share the same background and selected-state tokens as the appearance mode control."
);

assert.match(
  darkBlock,
  /--settings-tabs-bg:\s*var\(--theme-mode-control-bg\);[\s\S]*--settings-tab-active-bg:\s*var\(--theme-mode-active-bg\);/,
  "Dark settings tabs should continue to reuse appearance mode control colors."
);

assert.match(
  warmDarkBlock,
  /--settings-tabs-bg:\s*var\(--theme-mode-control-bg\);[\s\S]*--settings-tab-active-bg:\s*var\(--theme-mode-active-bg\);[\s\S]*--settings-tab-color:\s*var\(--theme-mode-button-color\);/,
  "Amber and coral dark settings tabs should match the appearance mode control base and selected fill."
);

assert.match(
  settingsTabsBlock,
  /background:\s*var\(--settings-tabs-bg\);/,
  "Settings tab rail should consume the theme-aware background token."
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
  /@media \(min-width: 1120px\)[\s\S]*\.settings-page\s*\{[\s\S]*--settings-sidebar-left:\s*0px;[\s\S]*--settings-sidebar-width:\s*336px;[\s\S]*--settings-titlebar-height:\s*70px;[\s\S]*padding:\s*0 32px 56px;[\s\S]*\.settings-page\.page-active\s*\{[\s\S]*transform:\s*none;[\s\S]*\.settings-page::before\s*\{[\s\S]*position:\s*fixed;[\s\S]*height:\s*var\(--settings-titlebar-height\);[\s\S]*border-bottom:\s*1px solid transparent;[\s\S]*box-shadow:\s*none;[\s\S]*\.settings-page\[data-stuck="true"\]::before\s*\{[\s\S]*border-bottom-color:\s*color-mix\(in srgb, var\(--line\) 76%, transparent\);[\s\S]*box-shadow:\s*0 8px 18px rgb\(0 0 0 \/ 0\.14\);[\s\S]*\.settings-brand\s*\{[\s\S]*top:\s*23px;[\s\S]*\.settings-tabs-shell\s*\{[\s\S]*position:\s*fixed;[\s\S]*left:\s*var\(--settings-sidebar-left\);[\s\S]*width:\s*var\(--settings-sidebar-width\);[\s\S]*\.settings-tabs\s*\{[\s\S]*display:\s*grid;[\s\S]*background:\s*transparent;[\s\S]*\.settings-tab\s*\{[\s\S]*justify-content:\s*flex-start;[\s\S]*padding:\s*0 18px 0 44px;[\s\S]*border-radius:\s*0 4px 4px 0;[\s\S]*\.settings-tab\.active\s*\{[\s\S]*background:\s*color-mix\(in srgb, var\(--accent\) 18%, var\(--panel-soft\)\);[\s\S]*\.settings-panel\s*\{[\s\S]*margin-top:\s*96px;[\s\S]*\.settings-header\s*\{[\s\S]*position:\s*static;/,
  "Desktop settings navigation should switch from top tabs to a Chrome-like left sidebar without changing panel content."
);

assert.match(
  settingsTabBlock,
  /color:\s*var\(--settings-tab-color\);/,
  "Inactive settings tab labels should consume the theme-aware label token."
);

assert.match(
  settingsTabActiveBlock,
  /background:\s*var\(--settings-tab-active-bg\);[\s\S]*box-shadow:\s*var\(--settings-tab-active-shadow\);/,
  "Active settings tabs should consume the theme-aware selected fill and shadow tokens."
);

assert.doesNotMatch(
  settingsTabActiveBlock,
  /border|inset/,
  "Active settings tabs should follow the no-outline selected-state style."
);
