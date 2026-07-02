import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const styles = readFileSync(new URL("../newtab.css", import.meta.url), "utf8");
const source = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");
const warmDarkPaletteBlock = styles.match(
  /:root\[data-theme="dark"\]\[data-theme-palette="amber"\],\s*:root\[data-theme="dark"\]\[data-theme-palette="peach"\]\s*\{(?<body>[\s\S]*?)\n\}/
)?.groups?.body || "";

assert.match(
  source,
  /document\.documentElement\.dataset\.themePalette\s*=\s*activeThemePalette;/,
  "The root element should expose the active palette for palette-specific theme controls."
);

assert.match(
  warmDarkPaletteBlock,
  /--theme-mode-control-bg:\s*color-mix\(in srgb,\s*var\(--panel-soft\)\s*72%,\s*var\(--paper\)\);[\s\S]*--theme-mode-active-bg:\s*color-mix\(in srgb,\s*var\(--accent\)\s*18%,\s*var\(--panel-soft\)\);/,
  "Yuzu and papaya dark palettes should use a stronger mode-control base and accent-tinted selected state."
);

assert.match(
  warmDarkPaletteBlock,
  /--theme-mode-active-shadow:\s*0 10px 24px rgb\(0 0 0 \/ 0\.16\);[\s\S]*--theme-mode-button-color:\s*color-mix\(in srgb,\s*var\(--ink\)\s*70%,\s*var\(--faint\)\);/,
  "Yuzu and papaya selected states should use depth and readable inactive labels without adding an outline."
);

assert.doesNotMatch(
  warmDarkPaletteBlock,
  /--theme-mode-active-shadow:[\s\S]*inset/,
  "Yuzu and papaya dark mode controls should not add an inset outline that other palettes do not use."
);
