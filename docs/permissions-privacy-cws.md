# Permissions, Privacy, And Chrome Web Store Notes

This document explains the current Manifest V3 permission surface. It does not recommend changing permissions in the current release.

## Permission Use

| Permission | Current use |
| --- | --- |
| `bookmarks` | Reads the user-selected bookmark folder, renders bookmark cards, watches bookmark changes, and removes a bookmark only when the user triggers deletion. |
| `history` | Reads local browser history, ranks most visited site groups, reads visit counts, and deletes history URLs only when the user triggers deletion. |
| `favicon` | Uses Chrome favicon URLs as one step in the site icon fallback chain. |
| `search` | Sends regular keyword searches through the search provider already selected by the user in Chrome. |
| `storage` | Stores theme, language, favorite sites, custom portals, bookmark folder choice, search settings, sync metadata, icon cache, and short-lived AI prompt handoff data. |
| `unlimitedStorage` | Provides storage headroom for local icon caches and short-lived AI attachment handoff payloads without sending that data to a Wayleaf backend. |
| `tabs` | Opens multi-target searches and coordinates video Picture-in-Picture state. |
| `scripting` | Injects helper scripts for AI direct-submit handoff after navigation and video Picture-in-Picture support on video pages. |
| `alarms` | Schedules daily automatic settings sync while the extension is enabled. |
| `http://*/*`, `https://*/*` | Allows favicon/site icon discovery for arbitrary visited or saved web pages, AI handoff support on provider pages, and video Picture-in-Picture support on pages with standard HTML5 video. |

## Host And Content Script Scope

The broad host permission supports icon discovery for arbitrary user history, bookmarks, favorites, and custom shortcuts. AI handoff is limited to the supported provider pages declared in `manifest.json`; video Picture-in-Picture support runs on HTTP(S) pages so it can detect standard HTML5 video in any user-opened tab.

If host permissions are narrowed later, verify that these still work before shipping:

- local history and bookmark icon fallback for arbitrary sites
- custom shortcut icon discovery
- Chrome favicon fallback
- AI prompt handoff on every supported provider
- video Picture-in-Picture on standard HTML5 video pages
- remote brand icon fallback where no local icon exists

Permission narrowing may affect visible icon quality, so treat it as a long-term review item, not a drive-by cleanup.

## Data Handling

Wayleaf has no backend service. Browser history, bookmarks, settings, and caches stay in the browser extension environment.

Network behavior is user-driven or display-driven:

- Search queries go to the selected search engine.
- AI prompts go to the selected AI provider.
- Icon discovery may request a target site's root page, manifest, icon file, Chrome favicon endpoint, or remote brand icon provider.

Short-lived AI prompt handoff uses `aiDirectPrompts` plus `_wayleaf_prompt`. Some providers also use `_wayleaf_text` in the URL fragment as a fallback, then `ai-submit.js` cleans the token/fragment from the URL.

## Chrome Web Store Form Notes

Use the current implementation as the source of truth when filling the CWS privacy form:

- Single purpose: new-tab productivity workspace with search, shortcuts, selected bookmarks, most visited sites, theming, sync, and AI page handoff.
- Data collection: no off-browser backend collection by Wayleaf.
- Browsing history: used locally to render most visited sites and local search suggestions.
- Bookmarks: used locally to render the selected folder and support deletion from the extension UI.
- Website content / web activity: host access is used for icon discovery, AI provider handoff, and video Picture-in-Picture support on pages with standard HTML5 video.
- User content: AI prompts are sent to the provider chosen by the user; provider policies apply after navigation.
- Authentication: Wayleaf does not manage user accounts or provider tokens.

## Reviewer Explanation

If Chrome Web Store review asks about broad host permissions, use this concise explanation:

> Wayleaf replaces the new tab page and renders user-selected bookmarks, most visited sites, custom shortcuts, and site icons for arbitrary web pages. Broad host access is used to discover site icons and manifests for those user-visible URLs and to support video Picture-in-Picture on pages with standard HTML5 video. AI helper behavior is limited to the supported AI provider pages declared in `content_scripts`.

## Current Non-Goals

- Do not add telemetry.
- Do not upload history or bookmarks to a Wayleaf service.
- Do not move icon caches or AI prompt handoff data into `chrome.storage.sync`.
- Do not broaden content script matches beyond the current provider list without a separate review.
