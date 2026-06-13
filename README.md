<p align="center">
  <img src="icons/wayleaf-flat-128.png" width="96" height="96" alt="Wayleaf icon">
</p>

<h1 align="center">Wayleaf</h1>

<p align="center">
  <strong>把 Chrome 新标签页变成一张本地优先的工作台。</strong><br>
  搜索、常用入口、自选书签、最近浏览、技术资讯和 AI 指令都在同一屏完成。
</p>

<p align="center">
  中文 | <a href="README.en.md">English</a> ·
  <a href="https://github.com/je44/wayleaf/releases/latest">Releases</a> ·
  <a href="https://github.com/je44/wayleaf/releases/download/v1.3/wayleaf-v1.3.0.zip">下载 v1.3.0</a>
</p>

## 预览

| 日间模式 | 夜间模式 |
| --- | --- |
| ![Wayleaf 日间模式](docs/previews/wayleaf-light.png) | ![Wayleaf 夜间模式](docs/previews/wayleaf-dark.png) |

## 为什么用 Wayleaf

每次新建标签页，大多数人其实是在做几件重复的事：打开常用网站、找刚刚看过的页面、搜索资料、跳到书签文件夹，或者把一句问题发送给 AI。Chrome 默认新标签页无法把这些动作放在一起，传统书签页又容易变成另一个需要整理的系统。

`Wayleaf` 的取舍很明确：

- **一屏开始下一步**：入口、书签、历史、搜索、资讯和 AI 指令在同一个界面里，不需要在多个页面之间切换。
- **本地优先**：没有后端账号；偏好、自定义入口、置顶记录和书签选择都保存在 Chrome 扩展存储里。
- **高密度但可控**：默认提供常用分类，也允许你只选择一个书签文件夹、最多添加 48 个自定义入口。
- **可直接加载**：Manifest V3，无构建步骤，下载 Release 包解压后即可作为 Chrome 扩展加载。

## 主要体验

| 你想完成的事 | Wayleaf 的处理方式 |
| --- | --- |
| 搜索或打开网页 | 搜索框支持本地历史/书签、完整 URL、Google、百度、Bing 和 Google+Bing 聚合搜索。 |
| 管理常用入口 | 内置搜索、社交、购物、开发、效率、影音、设计和 AI 分类；也可以添加自定义入口。 |
| 继续刚才的浏览 | 最近浏览按站点聚合重复访问页面，重要页面可以置顶或删除。 |
| 展示书签文件夹 | 选择一个 Chrome 书签文件夹，Wayleaf 会突出显示 3 天内新加入的网站，并按名称首字母分组。 |
| 收集高频网站 | 常用入口支持去重；在书签视图里也可以把当前文件夹中的网站直接加入常用入口。 |
| 把问题发给 AI | 用 `/gpt`、`/claude`、`/gemini`、`/grok` 直达对应 AI 页面并尝试填入问题。 |
| 看技术资讯 | 内置中英文技术资讯源，也支持自定义 RSS/JSON 信息源。 |
| 调整外观和同步 | 支持系统/日间/夜间主题、预设双色、自定义日夜主辅色和 `chrome.storage.sync` 偏好同步。 |

界面会根据浏览器语言显示中文、英文、日文、韩文、西班牙文、法文或德文。

## 快速安装

当前版本：`1.3.0`

1. 下载 [wayleaf-v1.3.0.zip](https://github.com/je44/wayleaf/releases/download/v1.3/wayleaf-v1.3.0.zip) 并解压。
2. 打开 Chrome 的 `chrome://extensions/`。
3. 打开右上角「开发者模式」。
4. 点击「加载已解压的扩展程序」。
5. 选择刚才解压出来、包含 `manifest.json` 的文件夹。
6. 新建标签页，确认页面已经切换为 `Wayleaf`。

> Chrome 不会直接加载 zip 文件。必须先解压，再选择解压后的目录。

## 用法速记

| 操作 | 说明 |
| --- | --- |
| 输入关键词后按回车 | 使用当前搜索引擎搜索。 |
| 输入完整网址后按回车 | 直接打开该网址。 |
| 点击搜索框左侧图标 | 切换本地搜索、Google、百度、Bing 或 AI 指令模式。 |
| 在本地搜索结果中选择条目 | 打开匹配的历史记录或书签。 |
| 在导航中枢添加入口 | 填入名称、`http` 或 `https` 开头的网址，并选择分类。 |
| 在「自选书签」点击 `+` | 选择一个包含网站书签的 Chrome 文件夹。 |

AI 指令示例：

```text
/gpt 帮我总结这段文字
/claude 写一封简短邮件
/gemini 给我三个旅行计划
/grok 解释这条新闻
```

如果你已经登录对应 AI 网站，`Wayleaf` 会跳转过去并尝试填入问题；如果目标网站要求登录、加载较慢或页面结构变化，自动填入可能失败，但跳转和问题暂存仍会尽量保留。

## 权限和隐私

`Wayleaf` 没有后端服务，也不要求创建账号。浏览历史、书签读取和偏好保存都发生在浏览器扩展环境内。

| 权限 | 用途 |
| --- | --- |
| `bookmarks` | 读取你选择展示的书签文件夹，并支持从扩展中删除对应书签。 |
| `history` | 读取最近浏览记录、统计重复访问网站，并支持删除历史条目。 |
| `favicon` | 通过 Chrome 的 favicon 能力显示网站图标。 |
| `storage` | 保存主题、入口、书签选择、置顶历史、同步状态和布局偏好。 |
| `tabs` | 打开搜索结果、AI 页面和多个搜索目标。 |
| `scripting` | 配合 AI 页面直达功能尝试填入问题。 |
| `http://*/*`、`https://*/*` | 识别网页入口、获取站点图标，并在支持的网站上完成 AI 页面辅助。 |

需要注意的网络行为：

- 搜索会把关键词发送给你选择的搜索引擎。
- AI 指令会把问题发送到你选择的 AI 网站；账号、隐私和数据政策由对应服务提供方负责。
- 资讯面板会请求内置或自定义的 RSS/JSON 信息源。
- 站点图标发现可能请求目标网站的图标或清单资源。

## 本地开发

这个项目不需要安装依赖，也不需要构建。

```sh
git clone https://github.com/je44/wayleaf.git
cd wayleaf
```

开发时修改 `manifest.json`、`newtab.html`、`newtab.css`、`newtab.js` 或 `ai-submit.js`，然后在 `chrome://extensions/` 的 `Wayleaf` 卡片上点击刷新，再新建标签页检查效果。

可以用本地静态服务器做布局预览，但 Chrome 扩展 API 只有在扩展环境里才完整可用：

```sh
python3 -m http.server 8080
```

然后打开 `http://127.0.0.1:8080/newtab.html`。

提交前至少运行：

```sh
jq empty manifest.json
node --check newtab.js
node --check ai-submit.js
```

<details>
<summary>项目结构和发布检查</summary>

```text
.
├── manifest.json        # 扩展声明、权限、图标和新标签页入口
├── newtab.html          # 新标签页页面结构
├── newtab.css           # 布局、主题、响应式规则和动效
├── newtab.js            # Chrome API 读取、状态保存、渲染和交互
├── ai-submit.js         # AI 页面直达后的输入辅助脚本
├── icons/               # 扩展图标和常用网站图标
├── vendor/              # 前端运行时依赖
└── docs/                # README 预览图
```

发布前检查 zip 根目录是否直接包含 `manifest.json`：

```sh
mkdir -p dist
zip -r -X dist/wayleaf-v1.3.0.zip manifest.json newtab.html newtab.css newtab.js ai-submit.js icons vendor docs -x '*/._*' '._*' '*.DS_Store' '*/.DS_Store'
unzip -t dist/wayleaf-v1.3.0.zip
```

发布清单：

1. 更新 `manifest.json` 中的 `version`。
2. 更新 README 中的当前安装包版本和下载链接。
3. 运行验证命令。
4. 确认 zip 根目录直接包含 `manifest.json`。
5. 在 GitHub Release 上传 `dist/wayleaf-vX.Y.Z.zip`。

README 顶部、扩展主图标、安装页图标和工具栏图标都使用当前的 `icons/wayleaf-flat-128.png` 主图标；`manifest.json` 中仍按 `16/32/48/128` 声明，让 Chrome 从 128px 源图缩放以提升小尺寸清晰度。发布包会包含 `icons/wayleaf-flat-16.png`、`32.png`、`48.png`、`128.png`、`1024.png` 和 `icons/sites/` 本地站点图标资源。

</details>

## 常见问题

### 安装后没有替换新标签页

确认扩展已启用，并且 Chrome 扩展页没有提示 manifest 或权限错误。若你安装了多个新标签页扩展，Chrome 通常只会使用当前启用的覆盖页。

### 书签区域为空

先在「自选书签」里选择一个包含网页书签的文件夹。只包含子文件夹、没有网页 URL 的文件夹不会显示网站。

### AI 自动填入失败

目标 AI 网站可能未登录、加载较慢，或页面结构已经变化。先完成登录，再从 `Wayleaf` 重新发送一次；如果仍失败，可以在目标页面手动粘贴问题。

### 设置没有同步到另一台设备

确认两台设备使用同一个 Chrome/Google 账号，并允许 Chrome 同步扩展数据。同步不可用时，设置会保留在当前设备。

## 支持和许可

- 问题反馈：在 [GitHub Issues](https://github.com/je44/wayleaf/issues) 里附上浏览器版本、Wayleaf 版本和复现步骤。
- 维护目标：保持轻量、本地优先、可直接加载、权限解释清楚和核心体验稳定。
- 许可状态：仓库当前没有包含 `LICENSE` 文件；复用或分发前请先确认许可。
