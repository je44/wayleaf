<p align="center">
  <img src="icons/wayleaf-flat-128.png" width="96" height="96" alt="Wayleaf icon">
</p>

<h1 align="center">Wayleaf - 新标签页&AI 聚合搜索</h1>

<p align="center">
  <strong>把 Chrome 新标签页变成本地优先的工作台。</strong><br>
  搜索、快捷入口、书签、最常访问和 AI 指令都放在一页。
</p>

<p align="center">
  中文 | <a href="README.en.md">English</a> ·
  <a href="https://github.com/je44/wayleaf/releases/latest">Releases</a> ·
  <a href="https://github.com/je44/wayleaf/releases/download/v1.0/wayleaf-v1.0.0.zip">下载 v1.0.0</a>
</p>

## 预览

| 浅色模式 | 深色模式 |
| --- | --- |
| ![Wayleaf 浅色模式](docs/previews/wayleaf-light.png) | ![Wayleaf 深色模式](docs/previews/wayleaf-dark.png) |

## Wayleaf 是什么

Wayleaf 是一个 Chrome 新标签页扩展。它把常用入口、搜索、书签、最常访问和 AI 指令放在同一页，让新建标签页变成开始下一步的地方。

它不需要账号，也没有后端服务。主题、入口、书签选择、搜索设置和同步状态都保存在 Chrome 扩展存储里。

## v1.0 能做什么

| 你想完成的事 | Wayleaf 的处理方式 |
| --- | --- |
| 搜索或打开网页 | 输入关键词、完整 URL，或用 Google、百度、Bing、Google+Bing 聚合搜索。 |
| 搜索历史和书签 | 在搜索框里直接找本地历史记录和书签。 |
| 平台搜索 | 用 `*yt`、`*xhs`、`*bili` 等前缀直达平台搜索。 |
| 打开常用入口 | 使用内置分类入口，也可以添加自己的快捷入口。 |
| 整理高频网站 | 常用入口会去重，也可以从书签文件夹加入首页入口。 |
| 整理最常访问 | 按站点整理最常访问的网址。 |
| 查看书签文件夹 | 选择一个 Chrome 书签文件夹，按名称首字母分组，并标出 3 天内新增的网站。 |
| 发送 AI 指令 | 用 `/gpt`、`/claude`、`/gemini`、`/grok`、`/deepseek`、`/doubao`、`/kimi`、`/glm` 打开对应 AI 页面并尝试填入问题。 |
| 使用视频画中画 | 在支持标准 HTML5 视频的页面使用 Picture-in-Picture 辅助。 |

## 可以自定义什么

- 常用入口：最多添加 48 个自定义网站，并选择分类。
- 书签区域：选择一个 Chrome 书签文件夹作为首页书签区。
- 搜索设置：选择默认搜索引擎，查看 AI 指令和平台搜索前缀。
- 外观主题：使用系统、浅色、深色主题，或设置浅色/深色的主色和辅色。
- 同步方式：手动同步设置，或启用后每天自动同步一次。
- 备份迁移：导入、导出当前设置。

界面会根据浏览器语言显示中文、英文、日文、韩文、西班牙文、法文或德文。

## 快速安装

当前版本：`1.0.0`

1. 下载 [wayleaf-v1.0.0.zip](https://github.com/je44/wayleaf/releases/download/v1.0/wayleaf-v1.0.0.zip) 并解压。
2. 打开 Chrome 的 `chrome://extensions/`。
3. 打开右上角「开发者模式」。
4. 点击「加载已解压的扩展程序」。
5. 选择刚才解压出来、包含 `manifest.json` 的文件夹，不要选择项目仓库根目录。
6. 新建标签页，确认页面已经切换为 `Wayleaf`。

> Chrome 不能直接加载 zip 文件，先解压，再选择解压后的目录。

## 用法速记

| 操作 | 说明 |
| --- | --- |
| 输入关键词后按回车 | 使用当前搜索引擎搜索。 |
| 输入完整网址后按回车 | 直接打开该网址。 |
| 输入完整的 `*平台缩写或名称`，例如 `*yt` 或 `*youtube` | 切换到对应平台搜索；如果短前缀也能匹配其他平台，如 `*x` / `*xhs`，按空格或回车确认短前缀。 |
| 在设置中心选择默认搜索引擎 | 修改普通关键词默认使用的搜索入口。 |
| 在本地搜索结果中选择条目 | 打开匹配的历史记录或书签。 |
| 在导航中枢查找书签 | 切换书签文件夹、搜索当前文件夹，或按最近加入与标题排序。 |
| 在「自选书签」点击 `+` | 选择一个包含网站书签的 Chrome 文件夹。 |

AI 指令示例：

```text
/gpt 帮我总结这段文字
/claude 写一封简短邮件
/gemini 给我三个旅行计划
/grok 解释这条新闻
/deepseek 分析这段代码
/doubao 写一个小红书标题
/kimi 总结这个长文档
/glm 生成一个学习计划
```

如果你已经登录对应 AI 网站，Wayleaf 会跳转过去并尝试填入问题。遇到未登录、加载慢或页面结构变化时，自动填入可能失败，但跳转和问题暂存会尽量保留。

内置平台搜索前缀：

| 前缀 | 平台 | 行为 |
| --- | --- | --- |
| `*yt` / `*youtube` | YouTube | 打开 YouTube 搜索结果。 |
| `*x` / `*twitter` | X | 打开 X 搜索结果；如需登录请先完成首次登录。 |
| `*xhs` / `*rednote` | 小红书 | 打开小红书搜索结果；如需登录请先完成首次登录。 |
| `*ig` / `*instagram` | Instagram | 使用 Instagram Web 搜索入口；若站点限制搜索，会保留已编码查询供手动恢复。 |
| `*threads` / `*th` | Threads | 使用 Threads Web 搜索入口；若站点限制搜索，会保留已编码查询供手动恢复。 |
| `*dy` / `*douyin` | 抖音 | 打开抖音搜索结果；如需登录请先完成首次登录。 |
| `*zhihu` / `*zh` | 知乎 | 打开知乎搜索结果。 |
| `*bili` / `*bilibili` | Bilibili | 打开 Bilibili 搜索结果。 |
| `*tt` / `*tiktok` | TikTok | 打开 TikTok 搜索结果；如需登录请先完成首次登录。 |

在「搜索设置」中可以查看内置 AI 引擎、触发词、搜索链接和平台搜索前缀。

## 权限和隐私

`Wayleaf` 没有后端服务，也不要求创建账号。浏览历史、书签读取和偏好保存都发生在浏览器扩展环境内。

| 权限 | 用途 |
| --- | --- |
| `bookmarks` | 读取你选择展示的书签文件夹，并支持从扩展中删除对应书签。 |
| `history` | 读取本地历史记录、统计最常访问网站，并支持删除历史条目。 |
| `favicon` | 通过 Chrome 的 favicon 能力显示网站图标。 |
| `storage` | 保存主题、入口、书签选择、同步状态和布局偏好。 |
| `alarms` | 在扩展启用时触发每日一次的自动同步。 |
| `tabs` | 打开搜索结果、AI 页面和多个搜索目标，并协调视频画中画状态。 |
| `scripting` | 配合 AI 页面直达功能尝试填入问题，并支持视频页面画中画辅助。 |
| `http://*/*`、`https://*/*` | 识别网页入口、获取站点图标，在支持的网站上完成 AI 页面辅助，并支持标准 HTML5 视频页面的画中画能力。 |

网络行为：

- 搜索会把关键词发送给你选择的搜索引擎。
- AI 指令会把问题发送到你选择的 AI 网站；账号、隐私和数据政策由对应服务提供方负责。
- 站点图标发现可能请求目标网站的图标或清单资源。

完整隐私政策见 [PRIVACY.md](PRIVACY.md)。

## 本地开发

这个项目不需要安装依赖，也不需要构建。

```sh
git clone https://github.com/je44/wayleaf.git
cd wayleaf
```

开发时修改 `manifest.json`、`background.js`、`newtab.html`、`newtab.css`、`newtab.js`、`popup.html`、`popup.css`、`popup.js` 或 `ai-submit.js`，然后在 `chrome://extensions/` 的 `Wayleaf` 卡片上点击刷新，再检查新标签页和工具栏菜单。

如果需要检查真实安装体积，先生成干净的可加载目录，再在 Chrome 中选择 `dist/wayleaf-v1.0.0/`：

```sh
./scripts/package-release.sh
```

脚本同时生成可直接上传 Chrome Web Store 的 `dist/wayleaf-v1.0.0.zip`。

可以用本地静态服务器做布局预览，但 Chrome 扩展 API 只有在扩展环境里才完整可用：

```sh
python3 -m http.server 8080
```

然后打开 `http://127.0.0.1:8080/newtab.html`。

提交前至少运行：

```sh
jq empty manifest.json
node --check background.js
node --check newtab.js
node --check popup.js
node --check ai-submit.js
```

<details>
<summary>项目结构和发布检查</summary>

```text
.
├── manifest.json        # 扩展声明、权限、图标和新标签页入口
├── background.js        # 每日自动同步的后台调度
├── newtab.html          # 新标签页页面结构
├── newtab.css           # 布局、主题、响应式规则和动效
├── newtab.js            # Chrome API 读取、状态保存、渲染和交互
├── popup.html           # 工具栏功能列表结构
├── popup.css            # 工具栏功能列表样式
├── popup.js             # 工具栏功能选择与后台启动交互
├── ai-submit.js         # AI 页面直达后的输入辅助脚本
├── icons/               # 扩展图标和常用网站图标
├── vendor/              # 前端运行时依赖
└── docs/                # README 预览图
```

发布前检查 zip 根目录是否直接包含 `manifest.json`：

```sh
./scripts/package-release.sh
unzip -t dist/wayleaf-v1.0.0.zip
```

发布清单：

1. 更新 `manifest.json` 中的 `version`。
2. 更新 README 中的当前安装包版本和下载链接。
3. 运行验证命令。
4. 确认 zip 根目录直接包含 `manifest.json`。
5. 在 GitHub Release 上传 `dist/wayleaf-vX.Y.Z.zip`。

README 顶部使用当前的 `icons/wayleaf-flat-128.png` 主图标；`manifest.json` 按 `16/32/48/128` 指向对应的原生尺寸图标，避免 Chrome 运行时再缩放。发布包会包含 `icons/wayleaf-flat-16.png`、`32.png`、`48.png`、`128.png`、`1024.png` 和 `icons/sites/` 本地站点图标资源。

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
