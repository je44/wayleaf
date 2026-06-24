import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const styles = readFileSync(new URL("../newtab.css", import.meta.url), "utf8");

assert.match(
  styles,
  /\.favorite-icon-shell\s*\{[\s\S]*transform:\s*scale\(1\);[\s\S]*transform-origin:\s*center;[\s\S]*transition:\s*[\s\S]*transform\s+320ms\s+cubic-bezier\(0\.2,\s*0,\s*0\.16,\s*1\.18\)/,
  "Favorite icon shells need a centered transform baseline with a springy hover-out return."
);

assert.match(
  styles,
  /@media\s*\(hover:\s*hover\)\s*and\s*\(pointer:\s*fine\)\s*\{[\s\S]*\.favorite-site:not\(\.pressing\):not\(\.delete-ready\):not\(\.clearing\):not\(\.removing\)\s+\.favorite-link:is\(:hover,\s*:focus-visible\)\s+\.favorite-icon-shell\s*\{[\s\S]*transform:\s*translateY\(-2px\)\s+scale\(1\.07\);[\s\S]*transform\s+360ms\s+cubic-bezier\(0\.18,\s*1\.18,\s*0\.22,\s*1\)/,
  "Favorite icon hover motion must lift and scale with spring-like easing only on fine pointer hover."
);

assert.match(
  styles,
  /\.favorite-site\.pressing\s+\.favorite-icon-shell\s*\{[\s\S]*animation:\s*favoritePressHold\s+650ms\s+cubic-bezier\(0\.2,\s*0\.82,\s*0\.24,\s*1\)\s+both;[\s\S]*\.favorite-site\.delete-ready\s+\.favorite-icon-shell\s*\{[\s\S]*animation:\s*favoriteDeleteReadyActivate\s+520ms\s+cubic-bezier\(0\.18,\s*0\.82,\s*0\.18,\s*1\)\s+both;[\s\S]*\.favorite-site\.clearing\s+\.favorite-icon-shell\s*\{[\s\S]*animation:\s*favoriteCancelDelete\s+360ms\s+cubic-bezier\(0\.22,\s*0,\s*0\.2,\s*1\)\s+both;/,
  "Favorite long-press states should use distinct press, activate, and cancel motions."
);

assert.match(
  styles,
  /@keyframes\s+favoriteDeleteReadyActivate\s*\{[\s\S]*0%\s*\{[\s\S]*transform:\s*translateY\(1px\)\s+scale\(0\.96\);[\s\S]*36%\s*\{[\s\S]*transform:\s*translateY\(-3px\)\s+scale\(1\.105\);[\s\S]*54%\s*\{[\s\S]*transform:\s*translateY\(-1px\)\s+scale\(1\.045\);[\s\S]*72%\s*\{[\s\S]*transform:\s*translateY\(-2\.4px\)\s+scale\(1\.082\);[\s\S]*86%\s*\{[\s\S]*transform:\s*translateY\(-1\.8px\)\s+scale\(1\.063\);[\s\S]*100%\s*\{[\s\S]*transform:\s*translateY\(-2px\)\s+scale\(1\.07\);[\s\S]*@keyframes\s+favoriteCancelDelete\s*\{[\s\S]*0%\s*\{[\s\S]*transform:\s*translateY\(-2px\)\s+scale\(1\.07\);[\s\S]*42%\s*\{[\s\S]*transform:\s*translateY\(1\.2px\)\s+scale\(0\.94\);[\s\S]*68%\s*\{[\s\S]*transform:\s*translateY\(-0\.4px\)\s+scale\(1\.015\);[\s\S]*84%\s*\{[\s\S]*transform:\s*translateY\(0\.1px\)\s+scale\(0\.992\);[\s\S]*100%\s*\{[\s\S]*transform:\s*translateY\(0\)\s+scale\(1\);/,
  "Favorite activate/cancel keyframes should use damped overshoot frames instead of snapping between plain scales."
);

assert.match(
  styles,
  /\.favorite-remove\s*\{[\s\S]*top:\s*-2px;[\s\S]*right:\s*-2px;[\s\S]*width:\s*20px;[\s\S]*height:\s*20px;[\s\S]*border-radius:\s*999px;[\s\S]*background:\s*color-mix\(in srgb,\s*var\(--paper\)\s+94%,\s*transparent\);[\s\S]*box-shadow:[\s\S]*inset 0 0 0 1px color-mix\(in srgb,\s*var\(--line-strong\)\s+64%,\s*transparent\);/,
  "Favorite delete control should stay anchored to the icon corner instead of drifting into the search box."
);
