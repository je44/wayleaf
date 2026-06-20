import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const styles = readFileSync(new URL("../newtab.css", import.meta.url), "utf8");
const html = readFileSync(new URL("../newtab.html", import.meta.url), "utf8");
const source = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");

assert.match(
  html,
  /<h3 id="presetPaletteTitle">Colors<\/h3>\s*<p>Choose the default accent pair for light and dark modes<\/p>/,
  "Default HTML palette copy should use the English baseline before locale hydration."
);

assert.match(
  html,
  /<button class="settings-page-return" id="closeSettingsButton" type="button" aria-label="Back home" title="Back home">\s*<span class="button-icon" aria-hidden="true"><\/span>\s*<\/button>/,
  "Settings return should render as an arrow icon button with the English baseline accessible label."
);

assert.match(
  source,
  /presetPaletteTitle:\s*"色彩"[\s\S]*presetPaletteDescription:\s*"为浅色与深色模式选择一组默认强调色"/,
  "Chinese palette settings copy should stay aligned with the updated meaning."
);

assert.match(
  source,
  /presetPaletteTitle:\s*"Colors"[\s\S]*presetPaletteDescription:\s*"Choose the default accent pair for light and dark modes"/,
  "English palette settings copy should stay aligned with the updated meaning."
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

assert.match(
  source,
  /id:\s*"amber"[\s\S]*light:\s*\{[\s\S]*onAccent:\s*"#ffffff"[\s\S]*dark:/,
  "Amber light palette should use white hint text on accent surfaces."
);

assert.match(
  source,
  /id:\s*"amber"[\s\S]*dark:\s*\{[\s\S]*onAccent:\s*"#ffffff"[\s\S]*id:\s*"sky"/,
  "Amber dark palette should use white hint text on accent surfaces."
);

assert.match(
  source,
  /id:\s*"peach"[\s\S]*light:\s*\{[\s\S]*onAccent:\s*"#ffffff"[\s\S]*dark:/,
  "Coral light palette should use white hint text on accent surfaces."
);

assert.match(
  source,
  /id:\s*"peach"[\s\S]*dark:\s*\{[\s\S]*onAccent:\s*"#ffffff"[\s\S]*id:\s*"neutral"/,
  "Coral dark palette should use white hint text on accent surfaces."
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
