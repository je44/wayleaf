# Verification Checklist

Wayleaf has no package manager, build step, or CI workflow. Use these checks directly from the repository root.

## Baseline

Run this before any release or broad review:

```sh
jq empty manifest.json
node --check background.js
node --check newtab.js
node --check popup.js
node --check ai-submit.js
git diff --check -- manifest.json background.js newtab.html newtab.css newtab.js popup.html popup.css popup.js ai-submit.js theme-preload.js docs scripts
```

## Node Regression Scripts

Run all tracked regression scripts with one shell command:

```sh
for test in scripts/*.test.mjs; do
  node "$test"
done
```

The `scripts/._*.test.mjs` files, if present locally, are AppleDouble metadata and are not tracked runtime tests.

For focused checks:

| Area | Command |
| --- | --- |
| Icon rendering | `node scripts/icon-strategy.test.mjs` |
| New-tab first paint and storage routing | `node scripts/newtab-load-performance.test.mjs` |
| AI direct-submit handoff | `node scripts/ai-direct-search.test.mjs` |
| Search URL detection | `node scripts/search-url-detection.test.mjs` |
| Platform search prefixes | `node scripts/platform-search-prefix.test.mjs` |
| Search settings | `node scripts/search-settings-builtins.test.mjs` |
| Settings localization | `node scripts/settings-locale.test.mjs` |
| Settings palette and tabs | `node scripts/settings-palette-layout.test.mjs` and `node scripts/settings-tabs-theme-color.test.mjs` |
| Sync settings | `node scripts/sync-settings.test.mjs` |
| Recent history cards | `node scripts/recent-history-card.test.mjs` and `node scripts/recent-history-order.test.mjs` |
| Onboarding and launcher layout | `node scripts/onboarding-tour.test.mjs` and `node scripts/surface-launcher-position.test.mjs` |
| Motion and hover behavior | `node scripts/favorite-hover-motion.test.mjs`, `node scripts/search-suggestions-layout.test.mjs`, and `node scripts/theme-mode-warm-palette-contrast.test.mjs` |
| Google AI mode | `node scripts/google-ai-mode-search.test.mjs` |

## Browser Smoke

For layout-only checks:

```sh
python3 -m http.server 8080
```

Open `http://127.0.0.1:8080/newtab.html`. Keep the claim narrow because Chrome extension APIs are only complete in the unpacked extension runtime.

For extension behavior checks:

1. Run `./scripts/package-release.sh`.
2. Open `chrome://extensions/`.
3. Load or refresh `dist/wayleaf-v1.6.0/`.
4. Open a new tab and verify the changed surface.

Use the unpacked extension for bookmarks, history, favicon, storage sync, tabs, scripting, and AI handoff checks.

## Release Package

Before uploading a release zip:

```sh
./scripts/package-release.sh
unzip -t dist/wayleaf-v1.6.0.zip
zipinfo -1 dist/wayleaf-v1.6.0.zip | sed -n '1,80p'
```

The zip should contain runtime files only:

- `_locales/`
- `ai-submit.js`
- `background.js`
- `icons/`
- `manifest.json`
- `newtab.css`
- `newtab.html`
- `newtab.js`
- `popup.css`
- `popup.html`
- `popup.js`
- `theme-preload.js`
- `vendor/`

It should not include `scripts/`, `.git/`, local tooling scratch directories, `tmp/`, or AppleDouble `._*` files.

## When To Broaden Verification

Broaden from targeted scripts to browser checks when a change touches:

- `manifest.json` permissions, host permissions, or content script matches
- icon priority, fallback, SVG recoloring, or `icons/sites/index.json`
- AI prompt transport, provider selectors, auto-fill, or auto-submit
- bookmarks, history, tabs, storage sync, or deletion paths
- CSS that affects first paint, settings, search, recent cards, or mobile layout
