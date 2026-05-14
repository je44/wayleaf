# tab-tab Chrome 扩展

`tab-tab` 是一个替代 Chrome 新标签页的本地扩展。它把常用入口、书签文件夹、最近浏览和快速搜索放在同一张工作台上，让打开新标签页这件事更像一次清晰的「回到桌面」，而不是重新寻找方向。

## 用户说明

### 设计定位

`tab-tab` 面向每天高频切换网页、工具和资料的人。它不是一个装饰型起始页，而是一个为浏览器工作流设计的启动界面：少一点噪音，多一点秩序，让常用路径、临时线索和长期收藏都能被快速看见。

界面采用三栏信息架构：

- **入口区**：放最常用的网站和工具，像工作台上的固定物件，打开新标签页后第一眼就能触达。
- **书签区**：把用户选定的 Chrome 书签文件夹转成更易浏览的入口墙，适合项目资料、设计参考、产品后台或研究收藏。
- **历史区**：按网站归组最近浏览，帮助找回刚看过的页面，并支持置顶那些短期内反复使用的页面。

### 体验原则

- **扫视优先**：入口、书签和历史都以卡片化信息呈现，重点是快速识别，而不是堆满文字。
- **本地优先**：自定义入口、书签选择、置顶历史和主题偏好都保存在本机浏览器中。
- **低打扰**：新标签页不放广告、不加载远程脚本，也不把浏览数据上传到外部服务。
- **可塑性**：默认入口提供开箱即用的结构，用户也可以继续添加自己的门户，形成个人化起始页。
- **连续性**：最近历史和置顶页面保留了当下工作的上下文，适合在多任务切换时快速回到现场。

### v1.0 下载渠道

- 最新版本下载页：[GitHub Releases](https://github.com/je44/tab-tab-chrome-extension/releases/latest)
- v1.0 固定版本页：[v1.0 Release](https://github.com/je44/tab-tab-chrome-extension/releases/tag/v1.0)
- v1.0 安装包：[tab-tab-v1.0.0.zip](https://github.com/je44/tab-tab-chrome-extension/releases/download/v1.0/tab-tab-v1.0.0.zip)

### 安装

1. 从 Releases 下载 `tab-tab-v1.0.0.zip`。
2. 解压 zip，保留解压后的整个文件夹。
3. 打开 Chrome 的 `chrome://extensions/`。
4. 开启右上角「开发者模式」。
5. 点击「加载已解压的扩展程序」，选择刚才解压出的文件夹。
6. 新建一个标签页，确认新标签页已切换为 `tab-tab`。

### 权限与隐私

- `bookmarks`：读取书签文件夹和书签项，用于书签区展示。
- `history`：读取最近浏览记录，用于历史区归组和找回页面。
- `favicon`：通过 Chrome 官方 favicon API 显示动态网站图标。
- `storage`：保存自定义入口、已选书签文件夹、置顶历史、主题和布局偏好。

扩展不包含远程脚本，也不会上传浏览器数据。

## 技术说明

### 运行模型

项目是一个无构建步骤的 Chrome Manifest V3 扩展。`manifest.json` 通过 `chrome_url_overrides.newtab` 把 `newtab.html` 注册为 Chrome 新标签页，页面直接加载 `newtab.css` 和 `newtab.js`，因此源码目录本身就是可加载的扩展目录。

当前版本号为 `1.0.0`，发布包是标准 Chrome 扩展 zip：`manifest.json` 位于压缩包根目录，`newtab.*` 和 `icons/` 随包发布。

### 代码结构

- `manifest.json`：扩展声明、版本号、权限、图标和新标签页覆盖入口。
- `newtab.html`：DOM 结构和可访问性骨架，包含顶部搜索、移动端分区切换、入口区、书签区、历史区和卡片模板。
- `newtab.css`：视觉系统和响应式布局，负责三栏工作台、移动端切换、卡片样式、主题状态和交互反馈。
- `newtab.js`：单页运行时，集中处理数据读取、状态保存、渲染、事件绑定、URL 规范化、站点归组和本地化文案。
- `icons/`：扩展图标与默认门户图标。默认入口优先使用本地图标，动态网站图标通过 Chrome favicon 能力补齐。
- `docs/icon-sources.md`：默认入口图标来源记录。
- `docs/product-facts.md`：与扩展能力和 Manifest V3 行为相关的事实记录。

### 前端架构

`newtab.js` 目前按功能域组织，而不是按组件框架拆分：

- **配置层**：顶部常量定义默认门户、搜索引擎、分类顺序、限制数量、存储 key 和多语言文案。
- **初始化层**：`DOMContentLoaded` 后执行 `init()`，依次初始化主题、搜索引擎、书签布局、入口、书签和历史模块。
- **状态层**：使用 `chrome.storage.local` 保存用户偏好和本地数据，包括自定义门户、书签文件夹、入口排序、置顶历史、主题和搜索引擎。
- **数据适配层**：通过 `chrome.bookmarks` 和 `chrome.history` 读取浏览器数据，再做 URL 规范化、站点归组、书签评分和历史去重。
- **渲染层**：以 DOM API 和 `template` 生成入口卡片、书签卡片、历史分组、搜索引擎菜单和空状态。
- **交互层**：表单、拖拽排序、移动端分区切换、键盘关闭、置顶/取消置顶、书签删除和主题切换都在页面内完成。

### 架构方向

短期内项目保持轻量：不引入构建工具和前端框架，让扩展目录可以直接被 Chrome 加载，降低安装、调试和发布成本。

后续扩展时优先遵循这几个方向：

- **先拆边界，再加抽象**：当 `newtab.js` 继续增长时，优先按 `portals`、`bookmarks`、`history`、`search`、`storage`、`i18n` 拆成清晰模块，而不是提前引入复杂状态管理。
- **保持数据本地化**：浏览器数据只通过 Chrome 扩展 API 在本地读取和呈现；除非有明确产品需求，不增加远程同步层。
- **把设计系统沉到 CSS 变量**：尺寸、颜色、间距、主题和响应式断点应继续沉淀为稳定变量，避免散落的视觉 magic number。
- **让权限跟功能对齐**：新增功能前先确认是否需要新权限；能用现有权限完成的交互，不扩大扩展权限面。
- **保留可验证发布链路**：发布前检查 manifest、JS 语法和 zip 结构，确保 GitHub Release 资产就是 Chrome 可加载的扩展包。

### 打包发布

本地打包命令：

```sh
mkdir -p dist
zip -r -X dist/tab-tab-v1.0.0.zip manifest.json newtab.html newtab.css newtab.js icons
```

发布检查：

```sh
jq empty manifest.json
node --check newtab.js
unzip -t dist/tab-tab-v1.0.0.zip
unzip -p dist/tab-tab-v1.0.0.zip manifest.json | jq -r '.name + " " + .version'
```

发布流程：

1. 确认 `manifest.json` 的 `version` 与 Release 版本一致。
2. 生成 `dist/tab-tab-v1.0.0.zip`。
3. 将 zip 上传到对应 GitHub Release。
4. 下载线上资产回本地做哈希或结构校验。
