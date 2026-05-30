<p align="center">
  <img src="icons/tab-tab-flat-128.png" width="96" height="96" alt="tab-tab icon">
</p>

<h1 align="center">tab-tab Chrome Extension</h1>

<p align="center">
  <a href="README.md">中文</a> | English
</p>

`tab-tab` is a local Chrome new tab extension. It puts search, favorite sites, AI shortcuts, bookmarks, and recent browsing on one page. Open a new tab, then go to a site, continue a recent page, or send a question to an AI engine.

## Preview

| Light mode | Dark mode |
| --- | --- |
| ![tab-tab light mode](docs/previews/tab-tab-light.png) | ![tab-tab dark mode](docs/previews/tab-tab-dark.png) |

## Download and Install

Download the latest package from the [Releases page](https://github.com/je44/tab-tab-chrome-extension/releases/latest).

Current package: [tab-tab-v1.0.0.zip](https://github.com/je44/tab-tab-chrome-extension/releases/download/v1.0/tab-tab-v1.0.0.zip)

1. Download `tab-tab-v1.0.0.zip` and unzip it.
2. Open `chrome://extensions/` in Chrome.
3. Turn on Developer mode.
4. Click Load unpacked.
5. Select the unzipped folder.
6. Open a new tab and check that it shows `tab-tab`.

## Features

- **Favorite sites**: Show sites you use often in the middle of the page.
- **Add a favorite site**: Click the add button below the search box, enter a URL, then save it.
- **Recent browsing**: Show sites you visited repeatedly, so you can continue where you left off.
- **Pinned history**: Pin important recent pages so they stay easy to find.
- **Bookmark folder**: Pick a Chrome bookmark folder and show its pages on the new tab.
- **Quick search**: Type a keyword in the center search box, then press Enter.
- **Open a URL**: Type a full URL in the search box, then press Enter.
- **AI shortcuts**: Use ChatGPT, Claude, Gemini, and Grok from the search box.
- **AI commands**: Type a command plus your question, then press Enter. `tab-tab` opens the AI page and tries to fill and send the question.
- **Appearance**: Choose system, light, or dark mode in settings.
- **Colors**: Pick a preset color or set your own light and dark colors.
- **Local storage**: Favorite sites, theme, bookmark choice, and pinned history stay in your browser.

## How to Use AI

Type one of these formats in the center search box, then press Enter:

```text
/gpt Summarize this text
/claude Write a short email
/gemini Give me three travel plans
/grok Explain this news
```

Available commands:

- `/gpt`: send to ChatGPT.
- `/claude`: send to Claude.
- `/gemini`: send to Gemini.
- `/grok`: send to Grok.

Notes:

- If you are already signed in to the AI site, `tab-tab` opens it and tries to put your question in the input box.
- If the AI site asks you to sign in, sign in first, then send the question from `tab-tab` again.
- If the AI site changes its page, auto-send may fail, but `tab-tab` still tries to keep the jump and saved question.
- To leave AI mode, press `Esc`, or clear the search box and press Backspace.

## Permissions

- `bookmarks`: reads the bookmark folder you choose to show.
- `history`: reads recent browsing history for the recent section.
- `favicon`: shows site icons.
- `storage`: saves theme, favorite sites, pinned pages, and layout choices.
- `tabs` and `scripting`: support AI page handoff and auto-fill.
- `http://*/*` and `https://*/*`: let the extension recognize and show web entries.

All preferences and browsing-related data stay in your local browser.

## Project Structure

This is a Chrome Manifest V3 extension with no build step. Chrome can load the folder directly.

- `manifest.json`: extension metadata, version, permissions, icons, and new tab entry.
- `newtab.html`: new tab page structure.
- `newtab.css`: layout, theme, responsive rules, and motion.
- `newtab.js`: page logic for Chrome APIs, saved state, rendering, and interactions.
- `ai-submit.js`: helper script for AI page handoff and input.
- `icons/`: extension icons, site icons, and AI icons.
- `docs/`: preview images, product notes, and icon source notes.

## Packaging

```sh
mkdir -p dist
zip -r -X dist/tab-tab-v1.0.0.zip manifest.json newtab.html newtab.css newtab.js ai-submit.js icons
jq empty manifest.json
node --check newtab.js
node --check ai-submit.js
unzip -t dist/tab-tab-v1.0.0.zip
```

The release package must keep `manifest.json` at the zip root and match the GitHub Release version.
