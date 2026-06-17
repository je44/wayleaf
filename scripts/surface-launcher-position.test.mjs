import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const styles = readFileSync(new URL("../newtab.css", import.meta.url), "utf8");

function cssBlock(selector) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = styles.match(new RegExp(`${escapedSelector}\\s*\\{([\\s\\S]*?)\\n\\}`));
  return match?.[1] || "";
}

const surfaceOpenHomeStageRule = cssBlock("body.surface-open .home-stage");
const surfaceOpenTopbarRule = cssBlock("body.surface-open .topbar");
const surfaceOpenLaunchersRule = cssBlock("body.surface-open .surface-launchers");

assert.match(
  surfaceOpenHomeStageRule,
  /transform:\s*translate3d\(-30px,\s*0,\s*0\) scale\(0\.982\);/,
  "Opening a secondary surface should keep the page-content offset on the home stage."
);

assert.match(
  surfaceOpenTopbarRule,
  /transform:\s*none;/,
  "Topbar controls must remain fixed while secondary surfaces animate in."
);

assert.doesNotMatch(
  surfaceOpenLaunchersRule,
  /transform\s*:/,
  "The top-left navigation launcher must not move while the navigation surface opens."
);
