import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../newtab.css", import.meta.url), "utf8");

assert.match(source, /const MAX_HISTORY_PAGES_PER_SITE = 4;/, "Same-site recent cards must keep a strict four-page cap.");
assert.doesNotMatch(source, /maxPagesPerSite:\s*MAX_HISTORY_PAGES_PER_SITE\s*\+\s*1/, "Recent card grouping must not request more than four same-site pages.");
assert.match(source, /maxPagesPerSite:\s*MAX_HISTORY_PAGES_PER_SITE/, "Recent refresh should pass the strict same-site page cap into grouping.");
assert.match(source, /const pages = group\.pages\.slice\(0,\s*MAX_HISTORY_PAGES_PER_SITE\);/, "Recent card rendering must still clamp same-site pages defensively.");
assert.match(source, /pageIndicator\.className = "recent-card-page-indicator";/, "Recent card drawer needs a page indicator container.");
assert.match(source, /pages\.forEach\(\(_, pageIndex\) => \{[\s\S]*dot\.className = "recent-card-page-dot";[\s\S]*pageIndicator\.append\(dot\);[\s\S]*\}\);/, "Recent card drawer must render one indicator dot per same-site page.");
assert.match(source, /pageIndicator\.querySelectorAll\("\.recent-card-page-dot"\)\.forEach\(\(dot, dotIndex\) => \{[\s\S]*dot\.classList\.toggle\("active", dotIndex === index\);[\s\S]*\}\);/, "Recent card switching must update the active page indicator.");
assert.match(source, /bottomBar\.append\(pageIndicator,\s*controls\);/, "Recent card drawer should place indicators before the existing right-side controls.");

assert.match(styles, /\.recent-card-page-indicator\s*\{[\s\S]*display:\s*flex;[\s\S]*align-items:\s*center;[\s\S]*min-height:\s*28px;/, "Indicator rail should horizontally align with the right-side switch buttons.");
assert.match(styles, /\.recent-card-page-dot\s*\{[\s\S]*background:\s*color-mix\(in srgb, var\(--muted\) 58%, transparent\);/, "Inactive indicators should use the existing muted gray tone.");
assert.match(styles, /\.recent-card-page-dot\.active\s*\{[\s\S]*background:\s*#f2c94c;/, "The active indicator must be yellow.");
assert.match(styles, /\.recent-card-bottom-bar\s*\{[\s\S]*align-items:\s*center;[\s\S]*justify-content:\s*space-between;/, "Drawer content should align indicators and switch controls on one horizontal row.");
