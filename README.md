<p align="center">
  <img src="icons/wayleaf-flat-128.png" width="96" height="96" alt="Wayleaf 图标">
</p>

<h1 align="center">Wayleaf</h1>

<p align="center">
  <strong>Chrome 新标签页扩展</strong><br>
  搜索、快捷入口、书签与最常访问。
</p>

<p align="center">
  中文 | <a href="README.en.md">English</a> ·
  <a href="https://github.com/je44/wayleaf/releases/latest">Releases</a> ·
  <a href="https://github.com/je44/wayleaf/releases/download/v1.0/wayleaf-v1.0.1.zip">下载 v1.0.1</a>
</p>

## 预览

| 浅色模式 | 深色模式 |
| --- | --- |
| ![Wayleaf 浅色模式](docs/previews/wayleaf-light.png) | ![Wayleaf 深色模式](docs/previews/wayleaf-dark.png) |

## 功能

### 搜索

- 输入关键词搜索，粘贴完整网址可直接打开。
- 搜索框同时匹配本机浏览历史和书签。
- 可选择 Google、百度、Bing，或同时打开 Google 与 Bing。
- 使用 `*yt`、`*xhs`、`*bili` 等前缀直达平台搜索。

### 快捷入口

- 内置常用网站分类。
- 最多添加 48 个自定义网站，并选择所属分类。
- 可从 Chrome 书签文件夹加入首页入口；相同网址不会重复添加。

### 书签中心

- 选择并切换 Chrome 书签文件夹。
- 搜索当前文件夹，按最近加入或标题 A–Z 排序。
- 标记最近 3 天加入的书签。
- 刷新文件夹内容，或直接删除不再需要的书签。

### 最常访问

- 根据本机 Chrome 历史记录整理常用网站。
- 每个网站保留一个主要入口，并可查看同站点的相关页面。
- 支持删除不需要的历史记录。

### 外观、语言与同步

- 支持跟随系统、浅色和深色主题。
- 可分别设置浅色与深色模式的主色和辅色。
- 支持中文、英文、日文、韩文、西班牙文、法文和德文。
- 设置可手动同步或每天自动同步一次，也可导入、导出。

### 视频小窗

在设置中心的「实验室」启用后，点击 Chrome 工具栏里的 Wayleaf 图标，选择「视频小窗」，再选择页面中的可播放视频。该功能适用于支持标准 HTML5 视频和 Picture-in-Picture 的网页。

### AI 页面直达（可选）

在搜索框输入 `/gpt`、`/claude` 等指令，可打开对应网站并尝试填入问题。支持的服务、指令和链接可在搜索设置中查看；登录状态、生成内容和数据处理由对应服务负责。

## 安装

当前版本：`1.0.1`

1. 下载 [wayleaf-v1.0.1.zip](https://github.com/je44/wayleaf/releases/download/v1.0/wayleaf-v1.0.1.zip) 并解压。
2. 打开 `chrome://extensions/`。
3. 开启右上角的「开发者模式」。
4. 点击「加载已解压的扩展程序」。
5. 选择包含 `manifest.json` 的解压目录。

> Chrome 不能直接加载 ZIP 文件。

## 常用操作

| 操作 | 结果 |
| --- | --- |
| 输入关键词后按回车 | 使用当前搜索引擎搜索。 |
| 输入完整网址后按回车 | 直接打开网址。 |
| 输入 `*平台前缀` | 切换到对应平台搜索。 |
| 选择本地搜索结果 | 打开匹配的历史记录或书签。 |
| 打开左上角导航中枢 | 管理快捷入口和书签文件夹。 |
| 打开右上角设置中心 | 调整语言、主题、同步与搜索设置。 |

平台搜索支持 YouTube、X、小红书、Instagram、Threads、抖音、知乎、Bilibili 和 TikTok。完整前缀可在搜索设置中查看。

## 权限与隐私

Wayleaf 不要求创建账号，也没有自建后端。浏览历史、书签、设置和缓存保存在浏览器扩展环境中。

| 权限 | 用途 |
| --- | --- |
| `bookmarks` | 读取所选书签文件夹，并在用户操作时删除书签。 |
| `history` | 读取本机历史、统计最常访问，并在用户操作时删除历史记录。 |
| `favicon` | 通过 Chrome 显示网站图标。 |
| `storage` | 保存主题、入口、书签选择、搜索设置和同步状态。 |
| `unlimitedStorage` | 为本地图标缓存和短期页面交接数据留出空间。 |
| `alarms` | 执行每日一次的自动同步。 |
| `tabs` | 打开搜索结果，并协调视频小窗状态。 |
| `scripting` | 支持视频小窗和可选的页面直达辅助。 |
| `http://*/*`、`https://*/*` | 发现网站图标，并在用户打开的网页中支持相关功能。 |

会产生网络请求的情况：

- 搜索内容会发送给用户选择的搜索引擎或平台。
- 使用 AI 页面直达时，问题会发送给用户选择的服务。
- 网站图标发现可能请求目标网站或图标服务。

完整说明见 [PRIVACY.md](PRIVACY.md)。

## 本地开发

项目不需要安装依赖，也不需要构建。

```sh
git clone https://github.com/je44/wayleaf.git
cd wayleaf
```

修改文件后，在 `chrome://extensions/` 的 Wayleaf 卡片上点击刷新，再打开新标签页检查。

生成可加载目录和发布包：

```sh
bash scripts/package-release.sh
```

输出：

- `dist/wayleaf-v1.0.1/`
- `dist/wayleaf-v1.0.1.zip`

提交前检查：

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
<summary>项目结构与发布检查</summary>

```text
.
├── manifest.json        # 扩展声明、权限和入口
├── background.js        # 后台调度
├── newtab.html          # 新标签页结构
├── newtab.css           # 布局、主题和动效
├── newtab.js            # 状态、渲染和交互
├── popup.*              # Chrome 工具栏菜单
├── ai-submit.js         # 可选页面直达辅助
├── video-pip.js         # 视频小窗
├── wayleaf-icon.js      # 网站图标处理
├── icons/               # 扩展图标和网站图标
└── docs/                # 文档与预览图
```

发布前确认 ZIP 根目录包含 `manifest.json`：

```sh
unzip -t dist/wayleaf-v1.0.1.zip
```

</details>

## 常见问题

### 新标签页没有变化

确认 Wayleaf 已启用，且 `chrome://extensions/` 没有显示错误。如果安装了多个新标签页扩展，请停用其他同类扩展后再检查。

### 书签区域为空

请先选择一个包含网站书签的文件夹。只有子文件夹、没有网页网址的文件夹不会显示内容。

### 设置没有同步到其他设备

确认设备使用同一个 Chrome 账号，并允许同步扩展数据。同步不可用时，设置仍会保存在当前设备。

## 支持与许可

- 问题反馈：[GitHub Issues](https://github.com/je44/wayleaf/issues)
- 当前仓库未包含 `LICENSE` 文件；复用或再分发前请先确认许可。
