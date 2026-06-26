import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const html = readFileSync(new URL("../newtab.html", import.meta.url), "utf8");
const source = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");
const recommendationsSource = readFileSync(new URL("../data/recommendedSites.js", import.meta.url), "utf8");
const packageSource = readFileSync(new URL("./package-release.sh", import.meta.url), "utf8");

assert.match(
  html,
  /<script src="data\/recommendedSites\.js"><\/script>\s*<script src="newtab\.js"><\/script>/,
  "Recommended sites should load as local static data before newtab.js."
);
assert.ok(packageSource.split(/\s+/).includes("data"), "Release packages should include local recommendation data.");

const context = { window: {} };
vm.runInNewContext(recommendationsSource, context);
assert.ok(Array.isArray(context.window.WAYLEAF_RECOMMENDED_SITES), "Recommended site data should be a local static array.");
assert.ok(context.window.WAYLEAF_RECOMMENDED_SITES.length >= 120, "Recommended site data should cover a broad set of popular domains.");
assert.ok(
  context.window.WAYLEAF_RECOMMENDED_SITES.every((site) => site.id && site.name && /^https:\/\//.test(site.url) && site.category),
  "Each recommended site should expose id, name, https url, and category."
);
assert.ok(
  context.window.WAYLEAF_RECOMMENDED_SITES.every((site) => !Object.prototype.hasOwnProperty.call(site, "icon")),
  "Recommended site data should not reference icon resources."
);
assert.ok(
  new Set(context.window.WAYLEAF_RECOMMENDED_SITES.map((site) => site.category)).has("portal"),
  "Recommended sites should include the common portal category."
);

const renderPortals = source.match(/async function renderPortals\(\) \{[\s\S]*?\n\}/)?.[0] || "";
assert.match(renderPortals, /loadRecommendedSites\(\)/, "Navigation hub smart tab should read recommended site data.");
assert.doesNotMatch(renderPortals, /loadBookmarkDrivenPortals|loadBookmarkPortalItems/, "Recommended sites must not be derived from bookmarks.");
assert.doesNotMatch(renderPortals, /loadCustomPortals/, "Recommended sites should render from the local recommendation list only.");
assert.match(
  source,
  /function loadRecommendedSites\(\)[\s\S]*recommended: true,[\s\S]*keywords: Array\.isArray\(site\.keywords\)[\s\S]*\}\)\);[\s\S]*\n\}/,
  "Recommended sites should map only URL metadata and leave icons to the shared site icon resolver."
);
assert.doesNotMatch(
  source.match(/async function loadRecommendedSites\(\) \{[\s\S]*?\n\}/)?.[0] || "",
  /site\.icon|normalizeStoredSiteIcon/,
  "Recommended sites must not carry icon resources into the navigation hub."
);
assert.match(
  source,
  /function createSiteCard\(site, options = \{\}\) \{[\s\S]*renderSharedSiteIcon\(icon, site, options\);/,
  "Recommended site cards should keep using the shared Wayleaf site icon flow."
);
assert.match(
  source,
  /const iconSite = site\?\.recommended \? site : siteWithFavoriteIcon\(site, options\.favoriteIconMap\);[\s\S]*const cachedIconRender = site\?\.recommended \? null : cachedFirstPaintIconRender\(options\.iconRenders, iconSite\);[\s\S]*applySiteIcon\(icon, iconSite\);/,
  "Recommended site icons should enter the URL-based icon priority flow instead of favorite or first-paint icon caches."
);
assert.match(
  source,
  /if \(site\?\.recommended\) \{\s*return Boolean\(\s*favoriteKey\s*&& favoriteKeys\.size < MAX_FAVORITE_SITES\s*&& !favoriteKeys\.has\(favoriteKey\)\s*\);/m,
  "Recommended-site add buttons should hide when favorite sites are full."
);
