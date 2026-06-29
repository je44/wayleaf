# Wayleaf Privacy Policy

Last updated: June 24, 2026

Wayleaf is a local-first Chrome new tab extension. It does not provide a backend service, does not require a Wayleaf account, and does not sell user data.

## Data Used In The Browser

Wayleaf uses browser extension APIs to show and manage the new tab workspace:

- Browsing history: read locally to show recent browsing, repeated site groups, local search suggestions, and user-triggered history deletion.
- Bookmarks: read locally to show a selected bookmark folder and support user-triggered bookmark deletion.
- Tabs: used to open search and AI pages, support multi-search, include long-open pages in recent browsing, and coordinate video Picture-in-Picture behavior.
- Storage: used to save theme, language, favorite sites, custom shortcuts, bookmark folder choice, search settings, sync metadata, icon cache, and short-lived AI prompt handoff data.
- Host access for `http://*/*` and `https://*/*`: used to discover site icons and manifests for user-visible URLs, support AI page handoff on supported providers, and support video Picture-in-Picture on pages with standard HTML5 video.
- Scripting: used to inject helper scripts for AI prompt handoff and video Picture-in-Picture behavior.
- Alarms: used to schedule once-daily automatic settings sync while enabled.

## Network Behavior

Wayleaf does not send browsing history, bookmarks, settings, or icon caches to a Wayleaf server.

Some features contact third-party sites as part of user-visible behavior:

- Search queries go to the search engine selected by the user.
- AI prompts go to the AI provider selected by the user. The provider's account, privacy, and data rules apply after navigation.
- Icon discovery may request a target site's root page, manifest, icon file, Chrome favicon endpoint, or remote brand icon provider.

## Sync

When Chrome extension sync is available and enabled in Wayleaf, selected settings are stored with `chrome.storage.sync` through the user's Chrome account. Bulky or transient data such as icon caches and short-lived AI prompt handoff entries stay in local extension storage.

## Data Sharing

Wayleaf does not sell, rent, or transfer user data to a Wayleaf-operated backend. Third-party sites receive only the requests needed for the features the user uses, such as searches, AI prompts, or icon discovery.

Wayleaf's use of information received from Chrome extension APIs adheres to the Chrome Web Store User Data Policy, including the Limited Use requirements.

## Contact

Report issues at https://github.com/je44/wayleaf/issues.
