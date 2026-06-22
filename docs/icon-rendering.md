# Wayleaf Icon Rendering

This document records the current icon path. It is not a request to change icon priority, tile styling, masks, rounded corners, colors, or fallback order.

## Current Priority

1. Normalize a page URL into a site key with `siteGroupKey()` and `canonicalSiteHost()`.
2. Check `icons/sites/index.json` and use a deployed local file from `icons/sites/` when present.
3. Use an explicit stored site icon when a favorite or cached site already has one.
4. Try remote brand SVG providers only when the local icon index has loaded and no local file matches.
5. Try declared site icons from the page root, HTML `<link>` tags, web manifest icons, and Chrome favicon.
6. Detect unreadable/default browser favicon output and rescue with declared site icons.
7. Fall back to `icons/sites/fallback.svg` through `applyGenericFallbackSiteIcon()`.

Local assets intentionally outrank remote/provider icons. Do not change that without a rendered regression pass.

## Normalization

The runtime groups related URLs before icon lookup:

- `http` and `https` pages are accepted; non-web schemes are ignored for history/icon grouping.
- `www`, `m`, and `mobile` prefixes are stripped before fallback domain grouping.
- Known aliases and product hosts are handled through `SITE_GROUP_OVERRIDES`, `SITE_GROUP_SUFFIXES`, `HOME_URL_BY_KEY`, and `SITE_NAME_BY_KEY`.
- The final local filename is `SITE_ICON_FILE_BY_SITE_KEY[siteKey]` or the first host label plus `.svg`, but only if `icons/sites/index.json` lists that file.

## Remote And Site Icon Fetching

Remote discovery uses `credentials: "omit"` and bounded timeouts. The current providers are Simple Icons CDN, Iconify Simple Icons, and LobeHub static SVG. Provider SVGs must pass the runtime quality gate before being cached: no embedded external image/object content, no event handlers, valid geometry, and reasonable shape count.

Site icon discovery fetches the site root HTML, extracts icon and manifest candidates, caps HTML bytes, caps candidates, and falls back when a candidate fails. Failed remote-brand lookups are cached briefly as misses so a missing provider icon does not refetch forever.

## Cache Boundaries

The runtime has two icon cache layers:

- `siteIconCache` in extension storage for discovered icon data URLs and remote-brand misses.
- first-paint cache in `localStorage` for already-rendered favorite/recent card icon output.

Keep bulky and transient icon state out of `chrome.storage.sync`. If a cached render breaks, the image error handler returns to the normal icon algorithm.

## Do Not Change Lightly

Do not change these without visual proof on favorites, recent history, bookmark cards, and settings/search surfaces:

- local icon priority over remote/provider icons
- `fallback.svg` order
- default-browser-favicon detection
- SVG recoloring and tile fusion rules
- `icons/sites/index.json` hydration behavior
- first-paint cache shape

## Verification Checklist

Run the targeted static checks first:

```sh
jq empty manifest.json
node --check newtab.js
node scripts/icon-strategy.test.mjs
node scripts/newtab-load-performance.test.mjs
```

For rendered proof, load `newtab.html` through a local `127.0.0.1` server or as the unpacked extension, then verify final `img.src`, `data-icon-tile`, `--site-icon-tile-light`, and `--site-icon-tile-dark` for at least:

- a local SVG site icon
- a local bitmap site icon
- a site with only Chrome favicon
- a site with no useful favicon
- a cached first-paint recent/favorite card
