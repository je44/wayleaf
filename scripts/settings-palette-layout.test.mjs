import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const styles = readFileSync(new URL("../newtab.css", import.meta.url), "utf8");
const html = readFileSync(new URL("../newtab.html", import.meta.url), "utf8");
const source = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");
const packageSource = readFileSync(new URL("./package-release.sh", import.meta.url), "utf8");

assert.match(styles, /:root\s*\{[\s\S]*font-family:\s*system-ui, sans-serif;/, "Global UI typography should follow the user's platform and locale.");
assert.doesNotMatch(styles, /PingFang|Microsoft YaHei|-apple-system|BlinkMacSystemFont|Segoe UI/, "Global UI typography should not hard-code platform or Chinese locale fonts.");

assert.match(
  html,
  /<h3 id="presetPaletteTitle">Colors<\/h3>\s*<\/div>/,
  "Palette settings should not render descriptive copy below the title."
);

assert.match(
  html,
  /<button class="settings-page-return" id="closeSettingsButton" type="button" aria-label="Back home" title="Back home">\s*<span class="button-icon" aria-hidden="true"><\/span>\s*<\/button>/,
  "Settings return should render as an arrow icon button with the English baseline accessible label."
);

assert.match(
  styles,
  /\.palette-preset-grid\s*\{[\s\S]*grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\);[\s\S]*width:\s*100%;/,
  "Palette presets should fill the settings content width with four equal desktop columns."
);

assert.match(
  styles,
  /\.settings-page-return\s*\{[\s\S]*width:\s*36px;[\s\S]*height:\s*36px;[\s\S]*justify-content:\s*center;[\s\S]*color:\s*var\(--muted\);[\s\S]*\}/,
  "Settings return should use a stable icon hit area without visible label layout."
);

assert.match(
  styles,
  /\.settings-page-return:hover,[\s\S]*?\.settings-page-return:active\s*\{[\s\S]*color:\s*var\(--ink\);[\s\S]*outline:\s*0;[\s\S]*\}/,
  "Settings return hover and active states should share the same icon color treatment."
);

assert.match(
  styles,
  /\.settings-page-return \.button-icon\s*\{[\s\S]*border:\s*0;[\s\S]*background:\s*transparent;[\s\S]*\}/,
  "Settings return icon should not draw an extra outer mask."
);

assert.match(
  styles,
  /\.palette-preset-button\s*\{[\s\S]*grid-template-columns:\s*auto minmax\(0,\s*1fr\);[\s\S]*width:\s*100%;[\s\S]*min-height:\s*64px;/,
  "Palette preset buttons should be full-width rows with stable swatch and label columns."
);

assert.match(
  styles,
  /\.palette-swatch-pair\s*\{[\s\S]*width:\s*28\.16px;[\s\S]*height:\s*28\.16px;[\s\S]*border-radius:\s*999px;[\s\S]*linear-gradient\(\s*135deg,[\s\S]*var\(--palette-swatch-light\)\s*0\s*50%,[\s\S]*var\(--palette-swatch-dark\)\s*50%\s*100%/,
  "Palette swatches should be smaller circular marks with a hard diagonal split between light and dark accents."
);

assert.match(
  styles,
  /\.palette-swatch-pair\s*\{(?:(?!border:|box-shadow:)[\s\S])*?\n\}/,
  "Palette swatches should not draw their own outline or inset stroke."
);

assert.match(
  source,
  /swatch\.style\.setProperty\("--palette-swatch-light", lightMode\.accent\);[\s\S]*swatch\.style\.setProperty\("--palette-swatch-dark", darkMode\.accent\);/,
  "Palette rendering should pass light and dark colors to the CSS swatch instead of rendering two rectangular halves."
);

assert.match(
  source,
  /const label = themePaletteLabel\(palette\);[\s\S]*button\.setAttribute\("aria-label", label\);[\s\S]*name\.textContent = label;/,
  "Palette preset labels and aria labels should come from localized palette copy."
);

assert.doesNotMatch(
  `${source}\n${styles}\n${html}`,
  /CUSTOM_THEME_PALETTE_ID|activeCustomThemeColors|handleCustomThemeColorInput|color-picker-/,
  "Disconnected custom-theme color picker code should stay removed."
);

const paletteSource = source.match(/const THEME_PALETTES = (?<value>\[[\s\S]*?\n\]);\nconst DEFAULT_LOCAL_SEARCH_ENGINE =/)?.groups?.value;
assert.ok(paletteSource, "Theme palettes should remain readable by the palette regression check.");
const visiblePalettes = vm.runInNewContext(paletteSource).filter(({ id }) => ["sage", "amber", "peach", "sky"].includes(id));

function relativeLuminance(hex) {
  return hex.slice(1).match(/../g).map((value) => Number.parseInt(value, 16) / 255)
    .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
    .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
}

function contrastRatio(first, second) {
  const [lighter, darker] = [relativeLuminance(first), relativeLuminance(second)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

for (const palette of visiblePalettes) {
  for (const surface of ["paper", "panel", "panelSoft", "inputBg", "hoverBg"]) {
    assert.ok(contrastRatio(palette.modes.light[surface], "#ffffff") >= 1.12, `${palette.id} ${surface} must remain distinct from white icon carriers.`);
    assert.ok(contrastRatio(palette.modes.dark[surface], "#000000") >= 1.35, `${palette.id} ${surface} must remain distinct from black icon carriers.`);
  }
  for (const mode of ["light", "dark"]) {
    const colors = palette.modes[mode];
    assert.ok(contrastRatio(colors.ink, colors.panel) >= 7, `${palette.id} ${mode} primary text must meet enhanced contrast.`);
    assert.ok(contrastRatio(colors.muted, colors.panel) >= 4.5, `${palette.id} ${mode} secondary text must meet normal-text contrast.`);
    assert.ok(contrastRatio(colors.accent, colors.onAccent) >= 4.5, `${palette.id} ${mode} accent content must remain readable.`);
  }
}

assert.match(styles, /\.search-panel\s*\{[\s\S]*linear-gradient\(var\(--input-bg\), var\(--input-bg\)\) padding-box/, "The main search surface should follow each palette input background.");
assert.match(styles, /\.recent-card-inner\s*\{[\s\S]*background:\s*var\(--panel\);/, "Recent browsing cards should follow each palette panel background.");
assert.match(styles, /\.settings-group\s*\{[\s\S]*background:\s*color-mix\(in srgb, var\(--panel\) 88%, transparent\);/, "Settings cards should follow each palette panel background.");
assert.match(styles, /\.portal-panel\s*\{[\s\S]*background:\s*var\(--panel\);/, "The navigation hub should follow each palette panel background.");

assert.match(
  source,
  /id:\s*"sage"[\s\S]*accent:\s*"#26766d"[\s\S]*focus:\s*"#b85f58"[\s\S]*paper:\s*"#eceee9"/,
  "The Wayleaf palette should reuse the extension icon's leaf and coral family on quiet surfaces."
);

assert.match(
  source,
  /themePaletteSage:\s*"Wayleaf"[\s\S]*themePaletteAmber:\s*"Yuzu"[\s\S]*themePaletteSky:\s*"Denim"[\s\S]*themePalettePeach:\s*"Papaya"/,
  "The English palette labels should describe the new material color directions."
);

assert.match(
  source,
  /id:\s*"amber"[\s\S]*accent:\s*"#8a6515"[\s\S]*id:\s*"sky"[\s\S]*accent:\s*"#3a6f96"[\s\S]*id:\s*"peach"[\s\S]*accent:\s*"#a95643"/,
  "Yuzu, denim, and papaya should keep distinct restrained accent families."
);

assert.match(
  source,
  /id:\s*"peach"[\s\S]*dark:\s*\{[\s\S]*onAccent:\s*"#282422"[\s\S]*id:\s*"neutral"/,
  "Papaya dark mode should use dark text on its lighter accent."
);

assert.match(
  source,
  /const closeSettingsIcon = closeSettingsButton\?\.querySelector\("\.button-icon"\);[\s\S]*closeSettingsIcon\.innerHTML = arrowLeftIcon\(\);/,
  "Settings return should use the semantic arrow-left icon."
);

assert.match(
  source,
  /if \(closeSettingsButton\) \{[\s\S]*closeSettingsButton\.title = t\("settingsBackHome"\);[\s\S]*\}/,
  "Settings return should localize the native tooltip instead of replacing the icon node with text."
);

assert.doesNotMatch(
  source,
  /settingsReturnLabel[\s\S]*textContent = t\("settingsBackHome"\)/,
  "Settings return localization must not write text into the icon-only button."
);

assert.match(
  styles,
  /@media \(max-width: 560px\)[\s\S]*\.palette-preset-grid\s*\{[\s\S]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/,
  "Palette presets should collapse to two equal columns on narrow screens."
);

assert.doesNotMatch(
  styles,
  /grid-template-columns:\s*repeat\(4,\s*76px\);/,
  "Palette presets must not return to fixed-width cards that leave the content area ragged."
);

for (const mode of ["system", "light", "dark"]) {
  assert.match(
    html,
    new RegExp(`data-theme-mode="${mode}"[\\s\\S]*assets/appearance/theme-${mode}\\.svg`),
    `The ${mode} appearance option should embed its real Wayleaf preview asset.`
  );
}
assert.ok(packageSource.split(/\s+/).includes("assets"), "Release packages should include appearance preview assets.");

assert.match(
  styles,
  /#themeModeControl \.theme-mode-button\.active \.theme-mode-preview\s*\{[\s\S]*outline:\s*1px solid var\(--accent\);[\s\S]*box-shadow:\s*none;/,
  "The selected appearance preview should keep one 1px accent outline without shadow."
);

assert.match(
  styles,
  /#themeModeControl\s*\{[\s\S]*--appearance-mode-card-width:\s*calc\(\(420px - 28px\) \/ 3\);[\s\S]*width:\s*min\(100%,\s*420px\);[\s\S]*justify-self:\s*end;[\s\S]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*var\(--appearance-mode-card-width\)\)\);[\s\S]*gap:\s*14px;[\s\S]*#themeModeControl \.theme-mode-button\s*\{[\s\S]*justify-items:\s*center;[\s\S]*text-align:\s*center;[\s\S]*#themeModeControl \.theme-mode-preview\s*\{[\s\S]*aspect-ratio:\s*5\s*\/\s*3;[\s\S]*overflow:\s*hidden;[\s\S]*border:\s*0;[\s\S]*outline:\s*1px solid color-mix\(in srgb,\s*var\(--ink\) 20%,\s*transparent\);[\s\S]*box-shadow:\s*none;/,
  "Appearance cards should keep compact card width in the right column with only a subtle 1px unselected outline."
);

assert.match(
  styles,
  /#themeModeControl \.theme-mode-check\s*\{[\s\S]*width:\s*20\.3px;[\s\S]*height:\s*20\.3px;[\s\S]*#themeModeControl \.theme-mode-check svg\s*\{[\s\S]*width:\s*12\.9px;[\s\S]*height:\s*12\.9px;/,
  "The selected appearance check icon should be scaled down by about 15% in area."
);

assert.doesNotMatch(
  styles,
  /#themeModeControl \.theme-mode-button:hover \.theme-mode-preview/,
  "Appearance preview cards should not animate or shift on hover."
);

assert.match(
  styles,
  /\.settings-mode-group\s*\{[\s\S]*grid-template-columns:\s*minmax\(220px,\s*1fr\) minmax\(0,\s*420px\);[\s\S]*column-gap:\s*32px;[\s\S]*row-gap:\s*10px;[\s\S]*align-items:\s*start;[\s\S]*\.settings-mode-group \.settings-group-heading\s*\{[\s\S]*grid-column:\s*1;[\s\S]*grid-row:\s*1;[\s\S]*align-self:\s*start;[\s\S]*\.settings-mode-group \.settings-group-control\s*\{[\s\S]*display:\s*contents;[\s\S]*\.settings-mode-group #themeModeControl\s*\{[\s\S]*grid-column:\s*2;[\s\S]*grid-row:\s*1 \/ span 2;[\s\S]*align-self:\s*start;/,
  "Appearance settings group should keep title text in the left column and cards in the right column."
);

assert.match(
  styles,
  /@media \(max-width: 900px\)[\s\S]*\.settings-mode-group\s*\{[\s\S]*grid-template-columns:\s*1fr;[\s\S]*\.settings-mode-group \.settings-group-control\s*\{[\s\S]*display:\s*grid;/,
  "Appearance settings group should collapse cleanly on narrower screens."
);
