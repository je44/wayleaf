<p align="center">
  <img src="icons/wayleaf-flat-128.png" width="96" height="96" alt="Wayleaf icon">
</p>

<h1 align="center">Wayleaf Chrome Extension</h1>

<p align="center">
  <strong>Turn Chrome's new tab page into a local-first workspace.</strong><br>
  Search, shortcuts, selected bookmarks, recent browsing, tech feeds, and AI commands live on one screen.
</p>

<p align="center">
  <a href="README.md">中文</a> | English ·
  <a href="https://github.com/je44/wayleaf/releases/latest">Releases</a> ·
  <a href="https://github.com/je44/wayleaf/releases/download/v1.3/wayleaf-v1.3.0.zip">Download v1.3.0</a>
</p>

## Preview

| Light mode | Dark mode |
| --- | --- |
| ![Wayleaf light mode](docs/previews/wayleaf-light.png) | ![Wayleaf dark mode](docs/previews/wayleaf-dark.png) |

## Why Wayleaf

Most new-tab sessions start with the same small set of actions: open a frequent site, recover a page you just visited, search something, jump into a bookmark folder, or send a question to an AI assistant. Chrome's default new tab page does not put those actions together, and a traditional bookmark page can become another system to maintain.

`Wayleaf` makes a few deliberate tradeoffs:

- **One screen for the next action**: shortcuts, bookmarks, history, search, feeds, and AI commands share one workspace.
- **Local-first by default**: no backend account. Preferences, custom shortcuts, pinned pages, and bookmark choices stay in Chrome extension storage.
- **Dense but controlled**: built-in categories are ready to use, while selected bookmarks and up to 48 custom shortcuts keep the page personal.
- **Directly loadable**: Manifest V3, no build step, and release packages that can be unzipped and loaded as a Chrome extension.

## Core Experience

| What you want to do | How Wayleaf handles it |
| --- | --- |
| Search or open a site | The search box supports local history/bookmarks, full URLs, Google, Baidu, Bing, and aggregate Google+Bing search. |
| Manage frequent destinations | Built-in categories cover search, social, shopping, developer, productivity, media, design, and AI sites; custom shortcuts are supported. |
| Continue recent browsing | Recent pages are grouped by repeat visits per site, with pin and delete actions for important or noisy pages. |
| Show a bookmark folder | Pick one Chrome bookmark folder; Wayleaf highlights sites added in the last 3 days and groups the rest by title initial. |
| Collect high-frequency sites | Favorite sites are deduplicated, and sites from the active bookmark folder can be added directly to favorites. |
| Send a prompt to AI | Use `/gpt`, `/claude`, `/gemini`, or `/grok` to open the matching AI site and try to fill the prompt. |
| Read tech feeds | Built-in Chinese and English tech sources are included, and custom RSS/JSON sources can be added. |
| Tune appearance and sync | System/light/dark themes, preset color pairs, custom light/dark primary and secondary colors, and `chrome.storage.sync` preference sync are supported. |

The interface follows the browser language for Chinese, English, Japanese, Korean, Spanish, French, or German.

## Quick Install

Current version: `1.3.0`

1. Download [wayleaf-v1.3.0.zip](https://github.com/je44/wayleaf/releases/download/v1.3/wayleaf-v1.3.0.zip) and unzip it.
2. Open `chrome://extensions/` in Chrome.
3. Turn on Developer mode.
4. Click Load unpacked.
5. Select the unzipped folder that contains `manifest.json`.
6. Open a new tab and confirm that it shows `Wayleaf`.

> Chrome does not load the zip file directly. Unzip it first, then load the unzipped folder.

## Usage Cheatsheet

| Action | Result |
| --- | --- |
| Type a keyword and press Enter | Search with the current engine. |
| Type a full URL and press Enter | Open the URL directly. |
| Click the icon on the left side of the search box | Switch between local search, Google, Baidu, Bing, and AI command modes. |
| Pick a local search result | Open a matching history item or bookmark. |
| Add an item in the navigation hub | Save a titled `http` or `https` shortcut in a category. |
| Click `+` in Bookmarks | Select a Chrome folder that contains website bookmarks. |

AI command examples:

```text
/gpt Summarize this text
/claude Write a short email
/gemini Give me three travel plans
/grok Explain this news
```

If you are already signed in to the selected AI site, `Wayleaf` opens it and tries to fill the prompt. If the site asks you to sign in, loads slowly, or changes its page structure, auto-fill may fail, but the jump and temporary prompt handoff still try to work.

## Permissions and Privacy

`Wayleaf` has no backend service and does not require an account. History access, bookmark access, and preference storage happen inside the browser extension environment.

| Permission | Purpose |
| --- | --- |
| `bookmarks` | Read the bookmark folder you choose and support deleting those bookmarks from the extension. |
| `history` | Read recent browsing history, detect repeated sites, and support deleting history entries. |
| `favicon` | Show site icons through Chrome's favicon support. |
| `storage` | Save theme, shortcuts, bookmark choice, pinned pages, sync state, and layout preferences. |
| `tabs` | Open search results, AI pages, and multiple search targets. |
| `scripting` | Support AI page handoff and prompt fill. |
| `http://*/*`, `https://*/*` | Recognize web shortcuts, fetch site icons, and assist supported AI pages. |

Expected network behavior:

- Search sends the query to the search engine you choose.
- AI commands send the prompt to the AI website you choose. Account, privacy, and data rules are controlled by that provider.
- The feeds panel requests built-in or custom RSS/JSON sources.
- Site icon discovery may request icon or manifest resources from the target site.

## Local Development

This project has no dependency installation step and no build step.

```sh
git clone https://github.com/je44/wayleaf.git
cd wayleaf
```

Edit `manifest.json`, `newtab.html`, `newtab.css`, `newtab.js`, or `ai-submit.js`, then click reload on the `Wayleaf` extension card in `chrome://extensions/` and open a new tab.

You can preview the static page with a local server, but Chrome extension APIs only work fully inside the extension environment:

```sh
python3 -m http.server 8080
```

Then open `http://127.0.0.1:8080/newtab.html`.

Run at least these checks before committing:

```sh
jq empty manifest.json
node --check newtab.js
node --check ai-submit.js
```

<details>
<summary>Project structure and release checks</summary>

```text
.
├── manifest.json        # Extension metadata, permissions, icons, and new tab entry
├── newtab.html          # New tab page structure
├── newtab.css           # Layout, theme, responsive rules, and motion
├── newtab.js            # Chrome API reads, state persistence, rendering, and interaction
├── ai-submit.js         # Helper script for AI page handoff
├── icons/               # Extension icons and site icons
├── vendor/              # Frontend runtime dependencies
└── docs/                # README preview images
```

Verify that the release zip has `manifest.json` at its root:

```sh
mkdir -p dist
zip -r -X dist/wayleaf-v1.3.0.zip manifest.json newtab.html newtab.css newtab.js ai-submit.js icons vendor docs -x '*/._*' '._*' '*.DS_Store' '*/.DS_Store'
unzip -t dist/wayleaf-v1.3.0.zip
```

Release checklist:

1. Update `version` in `manifest.json`.
2. Update the current package version and download link in the README files.
3. Run the verification commands.
4. Confirm that `manifest.json` is at the zip root.
5. Upload `dist/wayleaf-vX.Y.Z.zip` to the GitHub Release.

The README header, extension icon, install-page icon, and toolbar icon all use the current `icons/wayleaf-flat-128.png` primary icon. `manifest.json` still declares `16/32/48/128` entries so Chrome scales from the 128px source for clearer small icons. Release packages include `icons/wayleaf-flat-16.png`, `32.png`, `48.png`, `128.png`, `1024.png`, and the local `icons/sites/` site icon catalog.

</details>

## Troubleshooting

### The new tab page did not change

Make sure the extension is enabled and Chrome's extension page shows no manifest or permission errors. If multiple new tab extensions are installed, Chrome usually uses the currently enabled override page.

### The bookmark area is empty

Choose a folder with website bookmarks in the Bookmarks view first. A folder with only subfolders and no page URLs will not show sites.

### AI auto-fill failed

The target AI site may be signed out, slow to load, or using a changed page structure. Sign in first, then send the prompt from `Wayleaf` again. If it still fails, paste the prompt manually on the target page.

### Settings did not sync to another device

Make sure both devices use the same Chrome/Google account and that Chrome is allowed to sync extension data. If sync is unavailable, settings stay on the current device.

## Support and License

- Support: open a [GitHub Issue](https://github.com/je44/wayleaf/issues) with your browser version, Wayleaf version, and reproduction steps.
- Maintenance goal: keep the extension lightweight, local-first, directly loadable, clear about permissions, and stable in the core new tab experience.
- License status: this repository does not currently include a `LICENSE` file. Confirm licensing before reuse or redistribution.
