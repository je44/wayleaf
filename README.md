<p align="center">
  <img src="icons/wayleaf-flat-1024.png" width="96" height="96" alt="Wayleaf icon">
</p>

<h1 align="center">Wayleaf</h1>

<p align="center">
  本地优先的 Chrome 新标签页工作台：搜索、常用入口、书签、最近浏览、资讯和 AI 指令放在同一屏。
</p>

<p align="center">
  中文 | <a href="README.en.md">English</a>
</p>

<p align="center">
  <a href="#预览">预览</a> ·
  <a href="#快速安装">快速安装</a> ·
  <a href="#核心功能">核心功能</a> ·
  <a href="#权限和隐私">权限和隐私</a> ·
  <a href="#本地开发">本地开发</a>
</p>

## 预览

| 日间模式 | 夜间模式 |
| --- | --- |
| ![Wayleaf 日间模式](docs/previews/wayleaf-light.png) | ![Wayleaf 夜间模式](docs/previews/wayleaf-dark.png) |

## 项目概览

| 项 | 说明 |
| --- | --- |
| 当前版本 | `1.3.0` |
| 运行环境 | Chrome / Chromium Manifest V3 |
| 安装方式 | 下载 Release 包后通过 `chrome://extensions/` 加载已解压目录 |
| 构建方式 | 无构建步骤，源码目录可直接加载 |
| 数据位置 | 浏览器扩展存储；偏好可写入 `chrome.storage.sync` |
| 后端服务 | 无后端、无账号系统 |

`Wayleaf` 适合想把默认新标签页换成高密度入口页的人：常用网站、自选书签文件夹、重复访问的最近页面、RSS/JSON 资讯源和 AI 页面直达都在一个本地工作台里完成。

## 快速安装

推荐从 [Releases 页面](https://github.com/je44/wayleaf/releases/latest) 获取最新打包产物。

当前安装包：[wayleaf-v1.3.0.zip](https://github.com/je44/wayleaf/releases/download/v1.3/wayleaf-v1.3.0.zip)

1. 下载 `wayleaf-v1.3.0.zip` 并解压。
2. 打开 Chrome 的 `chrome://extensions/`。
3. 打开右上角「开发者模式」。
4. 点击「加载已解压的扩展程序」。
5. 选择刚才解压出来、包含 `manifest.json` 的文件夹。
6. 新建标签页，确认页面已经切换为 `Wayleaf`。

> Chrome 不会直接加载 zip 文件。必须先解压，再通过「加载已解压的扩展程序」选择目录。

## 核心功能

| 功能 | 说明 |
| --- | --- |
| 导航中枢 | 内置搜索、社交、购物、开发、效率、影音、设计和 AI 入口，并按类别整理。 |
| 自定义入口 | 添加最多 48 个自定义网站入口，名称、网址和分类保存在浏览器里。 |
| 自选书签 | 选择一个 Chrome 书签文件夹，把其中的网站按名称首字母分组展示。 |
| 最近浏览 | 读取重复访问的网站，帮助继续刚才的页面；重要页面可以置顶。 |
| 本地搜索 | 在搜索框里搜索历史记录和书签，也可以直接输入完整网址打开。 |
| 聚合搜索 | 默认搜索可同时打开 Google 和 Bing，也支持 Google、百度、Bing 单独搜索。 |
| AI 指令 | 用 `/gpt`、`/claude`、`/gemini`、`/grok` 把问题发送到对应 AI 页面。 |
| 资讯面板 | 内置中英文技术资讯源，并可添加自定义 RSS/JSON 信息源。 |
| 主题外观 | 支持跟随系统、日间、夜间、预设强调色和自定义日夜颜色。 |
| Chrome 同步 | 支持同步偏好写入 `chrome.storage.sync`；浏览器不支持时保留在本机。 |
| 多语言界面 | 根据浏览器语言显示中文、英文、日文、韩文、西班牙文、法文或德文界面。 |

## 日常使用

### 搜索和打开网站

- 输入关键词后按回车：使用当前搜索引擎搜索。
- 输入完整网址后按回车：直接打开该网址。
- 点击搜索框左侧图标：切换本地搜索、Google、百度、Bing 或 AI 指令模式。
- 在本地搜索结果中选择历史记录或书签：直接打开对应页面。

### 添加常用入口

1. 打开右上角导航中枢。
2. 点击添加按钮。
3. 填入名称、`http` 或 `https` 开头的网址，并选择分类。
4. 保存后入口会出现在对应分类中。

### 展示书签文件夹

1. 打开导航中枢。
2. 切换到「自选书签」。
3. 点击 `+` 选择一个包含网站书签的文件夹。
4. 之后该文件夹内的网站会显示在新标签页中，并随 Chrome 书签变化刷新。

### 使用 AI 指令

在新标签页中间的搜索框输入下面任意一种格式，然后按回车：

```text
/gpt 帮我总结这段文字
/claude 写一封简短邮件
/gemini 给我三个旅行计划
/grok 解释这条新闻
```

说明：

- 如果你已经登录对应 AI 网站，`Wayleaf` 会跳转过去，并尝试把问题填入输入框。
- 如果 AI 网站要求登录，先完成登录，再重新从 `Wayleaf` 发送一次。
- 如果目标网站改版，自动填入或自动发送可能失败，但跳转和问题暂存仍会尽量保留。
- 不想继续 AI 模式时，按 `Esc`，或清空搜索框后按退格。

## 权限和隐私

`Wayleaf` 没有后端服务，也不要求创建账号。偏好、入口、置顶记录、书签选择和 AI 暂存问题保存在 Chrome 的扩展存储里。

| 权限 | 用途 |
| --- | --- |
| `bookmarks` | 读取你选择展示的书签文件夹，并支持从扩展中删除对应书签。 |
| `history` | 读取最近浏览记录、统计重复访问网站，并支持删除历史条目。 |
| `favicon` | 通过 Chrome 的 favicon 能力显示网站图标。 |
| `storage` | 保存主题、入口、书签选择、置顶历史、同步状态和布局偏好。 |
| `tabs` | 打开搜索结果、AI 页面和多个搜索目标。 |
| `scripting` | 配合 AI 页面直达功能尝试填入问题。 |
| `http://*/*`、`https://*/*` | 识别网页入口、获取站点图标，并在支持的网站上完成 AI 页面辅助。 |

注意事项：

- 浏览历史和书签读取发生在本机浏览器内。
- 自定义入口和外观偏好会优先同步到同一 Chrome 账号；浏览器不支持同步时只保存在本机。
- AI 指令会把你的问题带到对应 AI 网站；该网站的账号、隐私和数据政策由对应服务提供方负责。

## 本地开发

这是一个无构建步骤的 Chrome Manifest V3 扩展，整个目录可以直接交给 Chrome 加载。

```text
.
├── manifest.json        # 扩展声明、权限、图标和新标签页入口
├── newtab.html          # 新标签页页面结构
├── newtab.css           # 布局、主题、响应式规则和动效
├── newtab.js            # Chrome API 读取、状态保存、渲染和交互
├── ai-submit.js         # AI 页面直达后的输入辅助脚本
├── icons/               # 扩展图标和常用网站图标
├── vendor/              # 前端运行时依赖
└── docs/                # 预览图
```

### 开发流程

1. 修改 `manifest.json`、`newtab.html`、`newtab.css`、`newtab.js` 或 `ai-submit.js`。
2. 打开 `chrome://extensions/`。
3. 在 `Wayleaf` 卡片上点击刷新。
4. 新建标签页检查效果。

可以用只读本地服务器预览静态页面，但 Chrome 扩展 API 只有在扩展环境里才完整可用：

```sh
python3 -m http.server 8080
```

然后打开 `http://127.0.0.1:8080/newtab.html` 做布局检查。

### 验证

提交前至少运行：

```sh
jq empty manifest.json
node --check newtab.js
node --check ai-submit.js
```

发布包还应检查 zip 结构：

```sh
mkdir -p dist
zip -r -X dist/wayleaf-v1.3.0.zip manifest.json newtab.html newtab.css newtab.js ai-submit.js icons vendor docs -x '*/._*' '._*' '*.DS_Store' '*/.DS_Store'
unzip -t dist/wayleaf-v1.3.0.zip
```

### 发布清单

1. 更新 `manifest.json` 中的 `version`。
2. 更新 README 中的当前安装包版本和下载链接。
3. 运行验证命令。
4. 确认 zip 根目录直接包含 `manifest.json`。
5. 在 GitHub Release 上传 `dist/wayleaf-vX.Y.Z.zip`。

扩展主图标、安装页图标和工具栏图标在 `manifest.json` 中按 `16/32/48/128` 声明，但运行时统一指向 `icons/wayleaf-flat-128.png`，让 Chrome 从 128px 源图缩放以提升小尺寸清晰度；发布包会直接包含 `icons/wayleaf-flat-16.png`、`32.png`、`48.png`、`128.png`、`1024.png` 和 `icons/sites/` 本地站点图标资源。

## 常见问题

### 安装后没有替换新标签页

确认扩展已启用，并且 Chrome 扩展页没有提示 manifest 或权限错误。若你安装了多个新标签页扩展，Chrome 通常只会使用当前启用的覆盖页。

### 书签区域为空

先在「自选书签」里选择一个包含网页书签的文件夹。只包含子文件夹、没有网页 URL 的文件夹不会显示网站。

### AI 自动填入失败

目标 AI 网站可能未登录、加载较慢，或页面结构已经变化。先完成登录，再从 `Wayleaf` 重新发送一次；如果仍失败，可以在目标页面手动粘贴问题。

### 设置没有同步到另一台设备

确认两台设备使用同一个 Chrome/Google 账号，并允许 Chrome 同步扩展数据。同步不可用时，设置会保留在当前设备。

## 维护和支持

- 维护目标：保持无构建步骤、可直接加载、权限解释清楚和核心体验稳定。
- 问题反馈：在 [GitHub Issues](https://github.com/je44/wayleaf/issues) 里附上浏览器版本、Wayleaf 版本和复现步骤。
- 许可状态：仓库当前没有包含 `LICENSE` 文件；复用或分发前请先确认许可。

## 相关文档

- [日间模式预览](docs/previews/wayleaf-light.png)
- [夜间模式预览](docs/previews/wayleaf-dark.png)
