<p align="center">
  <img src="icons/tab-tab-flat-128.png" width="96" height="96" alt="tab-tab icon">
</p>

<h1 align="center">tab-tab Chrome 扩展</h1>

<p align="center">
  中文 | <a href="README.en.md">English</a>
</p>

`tab-tab` 是一个给 Chrome 新标签页用的本地扩展。它把搜索、常用网站、AI 入口、书签和最近浏览放在同一页。打开新标签页，就能直接去常用网站、继续刚才的页面，或把问题发给 AI。

## 预览

| 日间模式 | 夜间模式 |
| --- | --- |
| ![tab-tab 日间模式](docs/previews/tab-tab-light.png) | ![tab-tab 夜间模式](docs/previews/tab-tab-dark.png) |

## 下载和安装

建议直接到 [Releases 页面](https://github.com/je44/tab-tab-chrome-extension/releases/latest) 下载最新打包产物。

当前版本安装包：[tab-tab-v1.0.0.zip](https://github.com/je44/tab-tab-chrome-extension/releases/download/v1.0/tab-tab-v1.0.0.zip)

1. 下载 `tab-tab-v1.0.0.zip` 并解压。
2. 打开 Chrome 的 `chrome://extensions/`。
3. 打开右上角「开发者模式」。
4. 点击「加载已解压的扩展程序」。
5. 选择刚才解压出来的文件夹。
6. 新建一个标签页，确认页面已经切换为 `tab-tab`。

## 功能说明

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

## AI 怎么用

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

## 权限说明

- `bookmarks`：读取你选择展示的书签文件夹。
- `history`：读取最近浏览记录，用来生成最近浏览区域。
- `favicon`：显示网站图标。
- `storage`：保存主题、入口、置顶和布局偏好。
- `tabs`、`scripting`：支持 AI 页面直达和自动填入。
- `http://*/*`、`https://*/*`：让扩展可以识别和展示网页入口。

所有偏好和浏览相关数据都保存在本地浏览器里。

## 项目结构

这是一个无构建步骤的 Chrome Manifest V3 扩展，整个目录可以直接交给 Chrome 加载。

- `manifest.json`：扩展声明、版本号、权限、图标和新标签页入口。
- `newtab.html`：新标签页页面结构。
- `newtab.css`：布局、主题、响应式规则和动效。
- `newtab.js`：页面运行逻辑，负责 Chrome API 读取、状态保存、渲染和交互。
- `ai-submit.js`：AI 页面直达后的输入辅助脚本。
- `icons/`：扩展图标、常用网站图标和 AI 图标。
- `docs/`：预览图、产品说明和图标来源记录。

## 打包发布

```sh
mkdir -p dist
zip -r -X dist/tab-tab-v1.0.0.zip manifest.json newtab.html newtab.css newtab.js ai-submit.js icons
jq empty manifest.json
node --check newtab.js
node --check ai-submit.js
unzip -t dist/tab-tab-v1.0.0.zip
```

发布包要求 `manifest.json` 位于 zip 根目录，并与 GitHub Release 版本保持一致。
