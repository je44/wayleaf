# tab-tab Chrome 扩展

选择语言： [中文](#中文) | [English](#english)

## 中文

`tab-tab` 是一个给 Chrome 新标签页用的本地扩展。它把搜索、常用网站、AI 入口、书签和最近浏览放在同一页。打开新标签页，就能直接去常用网站、继续刚才的页面，或把问题发给 AI。

### 预览

| 日间模式 | 夜间模式 |
| --- | --- |
| ![tab-tab 日间模式](docs/previews/tab-tab-light.png) | ![tab-tab 夜间模式](docs/previews/tab-tab-dark.png) |

### 下载和安装

建议直接到 [Releases 页面](https://github.com/je44/tab-tab-chrome-extension/releases/latest) 下载最新打包产物。

当前版本安装包：[tab-tab-v1.0.0.zip](https://github.com/je44/tab-tab-chrome-extension/releases/download/v1.0/tab-tab-v1.0.0.zip)

1. 下载 `tab-tab-v1.0.0.zip` 并解压。
2. 打开 Chrome 的 `chrome://extensions/`。
3. 打开右上角「开发者模式」。
4. 点击「加载已解压的扩展程序」。
5. 选择刚才解压出来的文件夹。
6. 新建一个标签页，确认页面已经切换为 `tab-tab`。

### 功能说明

- **常用网站**：页面中间显示你常去的网站。点击图标就能打开。
- **添加常用网站**：点击搜索框下方的添加按钮，填入网址后保存。
- **最近浏览**：自动显示最近反复访问的网站，方便继续刚才的页面。
- **置顶历史**：把重要的最近浏览页面固定住，之后更容易找。
- **自选书签**：选择一个 Chrome 书签文件夹，让这个文件夹里的网页直接出现在新标签页。
- **快速搜索**：在中间搜索框输入关键词，按回车搜索。
- **打开网址**：在搜索框输入完整网址，按回车直接打开。
- **AI 入口**：默认提供 ChatGPT、Claude、Gemini 和 Grok。
- **AI 指令触发**：在搜索框输入指令加问题，按回车即可跳到对应 AI 页面，并尝试自动填入和发送。
- **切换外观**：在设置里选择跟随系统、日间或夜间。
- **自定义颜色**：在设置里选择预设颜色，或自己设置日间和夜间颜色。
- **本地保存**：常用网站、主题、书签选择和置顶记录都保存在本地浏览器。

### AI 怎么用

在新标签页中间的搜索框输入下面任意一种格式，然后按回车：

```text
/gpt 帮我总结这段文字
/claude 写一封简短邮件
/gemini 给我三个旅行计划
/grok 解释这条新闻
```

可用指令：

- `/gpt`：发送到 ChatGPT。
- `/claude`：发送到 Claude。
- `/gemini`：发送到 Gemini。
- `/grok`：发送到 Grok。

说明：

- 如果你已经登录对应 AI 网站，`tab-tab` 会跳转过去，并尝试把问题填入输入框。
- 如果 AI 网站要求登录，先完成登录，再重新从 `tab-tab` 发送一次。
- 如果目标网站改版，自动发送可能失败，但跳转和问题保存仍会尽量保留。
- 不想继续 AI 模式时，按 `Esc`，或清空搜索框后按退格。

### 权限说明

- `bookmarks`：读取你选择展示的书签文件夹。
- `history`：读取最近浏览记录，用来生成最近浏览区域。
- `favicon`：显示网站图标。
- `storage`：保存主题、入口、置顶和布局偏好。
- `tabs`、`scripting`：支持 AI 页面直达和自动填入。
- `http://*/*`、`https://*/*`：让扩展可以识别和展示网页入口。

所有偏好和浏览相关数据都保存在本地浏览器里。

## English

`tab-tab` is a local Chrome new tab extension. It puts search, favorite sites, AI shortcuts, bookmarks, and recent browsing on one page. Open a new tab, then go to a site, continue a recent page, or send a question to an AI engine.

### Preview

| Light mode | Dark mode |
| --- | --- |
| ![tab-tab light mode](docs/previews/tab-tab-light.png) | ![tab-tab dark mode](docs/previews/tab-tab-dark.png) |

### Download and Install

Download the latest package from the [Releases page](https://github.com/je44/tab-tab-chrome-extension/releases/latest).

Current package: [tab-tab-v1.0.0.zip](https://github.com/je44/tab-tab-chrome-extension/releases/download/v1.0/tab-tab-v1.0.0.zip)

1. Download `tab-tab-v1.0.0.zip` and unzip it.
2. Open `chrome://extensions/` in Chrome.
3. Turn on Developer mode.
4. Click Load unpacked.
5. Select the unzipped folder.
6. Open a new tab and check that it shows `tab-tab`.

### Features

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

### How to Use AI

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

### Permissions

- `bookmarks`: reads the bookmark folder you choose to show.
- `history`: reads recent browsing history for the recent section.
- `favicon`: shows site icons.
- `storage`: saves theme, favorite sites, pinned pages, and layout choices.
- `tabs` and `scripting`: support AI page handoff and auto-fill.
- `http://*/*` and `https://*/*`: let the extension recognize and show web entries.

All preferences and browsing-related data stay in your local browser.

## 项目结构 / Project Structure

这是一个无构建步骤的 Chrome Manifest V3 扩展，整个目录可以直接交给 Chrome 加载。

This is a Chrome Manifest V3 extension with no build step. Chrome can load the folder directly.

- `manifest.json`：扩展声明、版本号、权限、图标和新标签页入口。Extension metadata, version, permissions, icons, and new tab entry.
- `newtab.html`：新标签页页面结构。New tab page structure.
- `newtab.css`：布局、主题、响应式规则和动效。Layout, theme, responsive rules, and motion.
- `newtab.js`：页面运行逻辑，负责 Chrome API 读取、状态保存、渲染和交互。Page logic for Chrome APIs, saved state, rendering, and interactions.
- `ai-submit.js`：AI 页面直达后的输入辅助脚本。Helper script for AI page handoff and input.
- `icons/`：扩展图标、常用网站图标和 AI 图标。Extension icons, site icons, and AI icons.
- `docs/`：预览图、产品说明和图标来源记录。Preview images, product notes, and icon source notes.

## 打包发布 / Packaging

```sh
mkdir -p dist
zip -r -X dist/tab-tab-v1.0.0.zip manifest.json newtab.html newtab.css newtab.js ai-submit.js icons
jq empty manifest.json
node --check newtab.js
node --check ai-submit.js
unzip -t dist/tab-tab-v1.0.0.zip
```

发布包要求 `manifest.json` 位于 zip 根目录，并与 GitHub Release 版本保持一致。

The release package must keep `manifest.json` at the zip root and match the GitHub Release version.
