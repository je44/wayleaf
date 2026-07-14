<p align="center">
  <img src="icons/wayleaf-flat-128.png" width="96" height="96" alt="Wayleaf icon">
</p>

<h1 align="center">Wayleaf</h1>

<p align="center">
  <strong>A Chrome new tab extension</strong><br>
  Search, shortcuts, bookmarks, and most visited sites.
</p>

<p align="center">
  <a href="README.md">中文</a> | English ·
  <a href="https://github.com/je44/wayleaf/releases/latest">Releases</a> ·
  <a href="https://github.com/je44/wayleaf/releases/download/v1.0/wayleaf-v1.0.1.zip">Download v1.0.1</a>
</p>

## Preview

| Light mode | Dark mode |
| --- | --- |
| ![Wayleaf light mode](docs/previews/wayleaf-light.png) | ![Wayleaf dark mode](docs/previews/wayleaf-dark.png) |

## Features

### Search

- Search by keyword or open a full URL directly.
- Match local Chrome history and bookmarks from the same search box.
- Use Google, Baidu, Bing, or open Google and Bing together.
- Enter prefixes such as `*yt`, `*xhs`, or `*bili` to search supported platforms.

### Shortcuts

- Browse built-in groups of commonly used websites.
- Add up to 48 custom sites and assign a category.
- Add sites from a Chrome bookmark folder without duplicating the same URL.

### Bookmarks

- Select and switch between Chrome bookmark folders.
- Search the current folder and sort by recent additions or title A–Z.
- Mark bookmarks added within the last three days.
- Refresh folder contents or remove bookmarks from the extension.

### Most visited

- Rank frequently visited sites from local Chrome history.
- Keep one main entry per site and show related pages from the same site.
- Remove unwanted history entries.

### Appearance, language, and sync

- Follow the system theme or use light and dark modes.
- Set separate primary and secondary colors for light and dark modes.
- Use Chinese, English, Japanese, Korean, Spanish, French, or German.
- Sync settings manually or once per day, and import or export a configuration.

### Video mini-player

Enable it under Laboratory, click the Wayleaf icon in the Chrome toolbar, choose Video mini-player, then select a playable video on the page. It works on pages that support standard HTML5 video and Picture-in-Picture.

### AI page shortcuts (optional)

Commands such as `/gpt` and `/claude` open the matching website and try to fill the question. Supported services, commands, and URLs are listed in Search Settings. Sign-in, generated content, and data handling are controlled by the selected service.

## Install

Current version: `1.0.1`

1. Download and unzip [wayleaf-v1.0.1.zip](https://github.com/je44/wayleaf/releases/download/v1.0/wayleaf-v1.0.1.zip).
2. Open `chrome://extensions/`.
3. Turn on Developer mode.
4. Click Load unpacked.
5. Select the unzipped folder that contains `manifest.json`.

> Chrome cannot load the ZIP file directly.

## Common actions

| Action | Result |
| --- | --- |
| Type a keyword and press Enter | Search with the current engine. |
| Type a full URL and press Enter | Open the URL directly. |
| Enter a `*platform prefix` | Switch to the matching platform search. |
| Choose a local search result | Open a matching history item or bookmark. |
| Open the top-left navigation hub | Manage shortcuts and bookmark folders. |
| Open Settings in the top-right | Change language, theme, sync, and search settings. |

Platform search supports YouTube, X, Xiaohongshu/RedNote, Instagram, Threads, Douyin, Zhihu, Bilibili, and TikTok. Search Settings lists every available prefix.

## Permissions and privacy

Wayleaf does not require an account and does not operate a backend. History, bookmarks, settings, and caches stay in the browser extension environment.

| Permission | Purpose |
| --- | --- |
| `bookmarks` | Read the selected bookmark folder and remove bookmarks after a user action. |
| `history` | Read local history, rank most visited sites, and remove history after a user action. |
| `favicon` | Display website icons through Chrome. |
| `storage` | Save themes, shortcuts, bookmark choices, search settings, and sync state. |
| `unlimitedStorage` | Provide space for local icon caches and short-lived page handoff data. |
| `alarms` | Run once-daily automatic settings sync. |
| `tabs` | Open search results and coordinate video mini-player state. |
| `scripting` | Support the video mini-player and optional page handoff helpers. |
| `http://*/*`, `https://*/*` | Discover site icons and support relevant features on pages opened by the user. |

Network requests occur when:

- A search is sent to the selected search engine or platform.
- An AI page shortcut sends a question to the selected service.
- Site icon discovery requests a target site or icon provider.

See [PRIVACY.md](PRIVACY.md) for the full policy.

## Local development

The project has no dependency installation or build step.

```sh
git clone https://github.com/je44/wayleaf.git
cd wayleaf
```

After editing, reload the Wayleaf card in `chrome://extensions/` and open a new tab.

Create a loadable directory and release ZIP:

```sh
bash scripts/package-release.sh
```

Output:

- `dist/wayleaf-v1.0.1/`
- `dist/wayleaf-v1.0.1.zip`

Checks to run before committing:

```sh
jq empty manifest.json
node --check background.js
node --check newtab.js
node --check popup.js
node --check ai-submit.js
node --check video-pip.js
node --test scripts/*.test.mjs
```

<details>
<summary>Project structure and release check</summary>

```text
.
├── manifest.json        # Extension metadata, permissions, and entry points
├── background.js        # Background scheduling
├── newtab.html          # New tab structure
├── newtab.css           # Layout, themes, and motion
├── newtab.js            # State, rendering, and interaction
├── popup.*              # Chrome toolbar menu
├── ai-submit.js         # Optional page handoff helper
├── video-pip.js         # Video mini-player
├── wayleaf-icon.js      # Site icon handling
├── icons/               # Extension and site icons
└── docs/                # Documentation and previews
```

Confirm that the ZIP contains `manifest.json` at its root:

```sh
unzip -t dist/wayleaf-v1.0.1.zip
```

</details>

## Troubleshooting

### The new tab page did not change

Make sure Wayleaf is enabled and `chrome://extensions/` shows no errors. If another new tab extension is installed, disable it and check again.

### The bookmark area is empty

Choose a folder that contains website bookmarks. A folder with only subfolders and no page URLs does not display any sites.

### Settings did not sync to another device

Make sure both devices use the same Chrome account and Chrome is allowed to sync extension data. If sync is unavailable, settings remain on the current device.

## Support and license

- Support: [GitHub Issues](https://github.com/je44/wayleaf/issues)
- This repository does not currently include a `LICENSE` file. Confirm permission before reuse or redistribution.
