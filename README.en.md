<p align="center">
  <img src="icons/wayleaf-flat-1024.png" width="96" height="96" alt="Wayleaf icon">
</p>

<h1 align="center">Wayleaf Chrome Extension</h1>

<p align="center">
  <a href="README.md">中文</a> | English
</p>

`Wayleaf` is a local-first Chrome new tab extension. It puts search, shortcuts, selected bookmarks, recent browsing, and AI commands in one workspace, so every new tab can start with the next action.

## Preview

| Light mode | Dark mode |
| --- | --- |
| ![Wayleaf light mode](docs/previews/wayleaf-light.png) | ![Wayleaf dark mode](docs/previews/wayleaf-dark.png) |

## Who It Is For

- People who want a denser replacement for Chrome's default new tab page.
- People who want frequent sites, bookmark folders, and recent pages on one screen.
- People who often send prompts from the search box to ChatGPT, Claude, Gemini, or Grok.
- People who prefer local browser storage over creating an account for a new tab tool.

## Features

- **Navigation hub**: Built-in shortcuts for search, social, shopping, developer, productivity, media, design, and AI sites.
- **Custom shortcuts**: Add up to 48 custom sites with a title, URL, and category.
- **Selected bookmarks**: Pick one Chrome bookmark folder and show its sites grouped by title initial.
- **Recent browsing**: Surface repeatedly visited sites so you can continue where you left off; important pages can be pinned.
- **Local search**: Search history and bookmarks from the main search box, or open a full URL directly.
- **Search engines**: Use Google, Baidu, Bing, or the default aggregate search that opens Google and Bing.
- **AI commands**: Send prompts to ChatGPT, Claude, Gemini, or Grok with `/gpt`, `/claude`, `/gemini`, or `/grok`.
- **Feeds panel**: Read built-in Chinese and English tech sources, or add custom RSS/JSON sources.
- **Appearance**: Use system, light, dark, preset accent colors, or custom light/dark colors.
- **Chrome sync**: Preferences can be written to `chrome.storage.sync`; unsupported browsers keep them on the current device.
- **Localized interface**: The UI follows the browser language for Chinese, English, Japanese, Korean, Spanish, French, or German.

## Download and Install

Download the latest package from the [Releases page](https://github.com/je44/wayleaf/releases/latest).

Current package: [wayleaf-v1.2.0.zip](https://github.com/je44/wayleaf/releases/download/v1.2/wayleaf-v1.2.0.zip)

1. Download `wayleaf-v1.2.0.zip` and unzip it.
2. Open `chrome://extensions/` in Chrome.
3. Turn on Developer mode.
4. Click Load unpacked.
5. Select the unzipped folder that contains `manifest.json`.
6. Open a new tab and confirm that it shows `Wayleaf`.

> Chrome does not load the zip file directly. Unzip it first, then load the folder as an unpacked extension.

## Daily Use

### Search and Open Sites

- Type a keyword and press Enter to search with the current engine.
- Type a full URL and press Enter to open it directly.
- Click the icon on the left side of the search box to switch between local search, Google, Baidu, Bing, and AI command modes.
- Pick a local search result to open a matching history item or bookmark.

### Add a Shortcut

1. Open the navigation hub in the top right.
2. Click the add button.
3. Enter a title, an `http` or `https` URL, and a category.
4. Save it. The shortcut appears in its category.

### Show a Bookmark Folder

1. Open the navigation hub.
2. Switch to Bookmarks.
3. Click `+` and choose a folder with website bookmarks.
4. Sites from that folder appear on the new tab page and refresh when Chrome bookmarks change.

### Use AI Commands

Type one of these formats in the center search box, then press Enter:

```text
/gpt Summarize this text
/claude Write a short email
/gemini Give me three travel plans
/grok Explain this news
```

Notes:

- If you are already signed in to the AI site, `Wayleaf` opens it and tries to fill the prompt.
- If the AI site asks you to sign in, sign in first, then send the prompt from `Wayleaf` again.
- If the target site changes its page, auto-fill or auto-submit may fail, but the jump and temporary prompt handoff still try to work.
- To leave AI mode, press `Esc`, or clear the search box and press Backspace.

## Permissions and Privacy

`Wayleaf` has no backend service and does not require an account. Preferences, shortcuts, pinned pages, bookmark choices, and temporary AI prompts stay in Chrome extension storage.

| Permission | Purpose |
| --- | --- |
| `bookmarks` | Read the bookmark folder you choose and support deleting those bookmarks from the extension. |
| `history` | Read recent browsing history, detect repeated sites, and support deleting history entries. |
| `favicon` | Show site icons through Chrome's favicon support. |
| `storage` | Save theme, shortcuts, bookmark choice, pinned pages, sync state, and layout preferences. |
| `tabs` | Open search results, AI pages, and multiple search targets. |
| `scripting` | Support AI page handoff and prompt fill. |
| `http://*/*`, `https://*/*` | Recognize web shortcuts, fetch site icons, and assist supported AI pages. |

Notes:

- History and bookmark access happen inside your local browser.
- Custom shortcuts and appearance preferences sync to the same Chrome account when sync is available; otherwise they stay on the current device.
- AI commands send your prompt to the selected AI website. That service's account, privacy, and data rules are controlled by that provider.

## Project Structure

This is a Chrome Manifest V3 extension with no build step. Chrome can load the folder directly.

```text
.
├── manifest.json        # Extension metadata, permissions, icons, and new tab entry
├── newtab.html          # New tab page structure
├── newtab.css           # Layout, theme, responsive rules, and motion
├── newtab.js            # Chrome API reads, state persistence, rendering, and interaction
├── ai-submit.js         # Helper script for AI page handoff
├── icons/               # Extension icons, site icons, and AI icons
└── docs/                # Preview images, product facts, and icon source notes
```

## Local Development

This project has no dependency installation step.

1. Edit `manifest.json`, `newtab.html`, `newtab.css`, `newtab.js`, or `ai-submit.js`.
2. Open `chrome://extensions/`.
3. Click reload on the `Wayleaf` extension card.
4. Open a new tab and check the result.

You can preview the static page with a local read-only server, but Chrome extension APIs only work fully inside the extension environment:

```sh
python3 -m http.server 8080
```

Then open `http://127.0.0.1:8080/newtab.html` for layout checks.

## Verification

Run at least these checks before committing:

```sh
jq empty manifest.json
node --check newtab.js
node --check ai-submit.js
```

For release packages, also verify the zip structure:

```sh
mkdir -p dist
zip -r -X dist/wayleaf-v1.2.0.zip manifest.json newtab.html newtab.css newtab.js ai-submit.js icons vendor docs -x '*/._*' '._*' '*.DS_Store' '*/.DS_Store'
unzip -t dist/wayleaf-v1.2.0.zip
```

## Release Checklist

1. Update `version` in `manifest.json`.
2. Update the current package version and download link in the README files.
3. Run the verification commands.
4. Confirm that `manifest.json` is at the zip root.
5. Upload `dist/wayleaf-vX.Y.Z.zip` to the GitHub Release.

## Troubleshooting

### The new tab page did not change

Make sure the extension is enabled and Chrome's extension page shows no manifest or permission errors. If multiple new tab extensions are installed, Chrome usually uses the currently enabled override page.

### The bookmark area is empty

Choose a folder with website bookmarks in the Bookmarks view first. A folder with only subfolders and no page URLs will not show sites.

### AI auto-fill failed

The target AI site may be signed out, slow to load, or using a changed page structure. Sign in first, then send the prompt from `Wayleaf` again. If it still fails, paste the prompt manually on the target page.

### Settings did not sync to another device

Make sure both devices use the same Chrome/Google account and that Chrome is allowed to sync extension data. If sync is unavailable, settings stay on the current device.

## Maintenance Status

Current version: `1.2.0`. The project stays focused on being a lightweight local extension with no build step, direct loading, clear permission explanations, and a stable core new tab experience.

## Related Docs

- [Product facts](docs/product-facts.md)
- [Icon source notes](docs/icon-sources.md)
