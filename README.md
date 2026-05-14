# tab-tab Chrome 扩展

`tab-tab` 是一个替代 Chrome 新标签页的本地扩展，用门户快捷入口、指定书签文件夹和最近浏览记录组成一个可快速扫视的起始页。

## 用户说明

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

### 主要功能

- 左侧：热门门户网站入口，默认站点优先使用扩展内置高清图标。
- 左侧入口：支持添加和删除自定义门户，数据保存在本机扩展存储中。
- 中间：选择一个 Chrome 书签文件夹后，以门户入口样式展示该文件夹内的书签。
- 右侧：按网站归组展示最近一周浏览历史，支持将常用页面置顶。

### 权限与隐私

- `bookmarks`：读取书签文件夹和书签项，用于中间书签面板。
- `history`：读取最近浏览记录，用于右侧历史记录面板。
- `favicon`：通过 Chrome 官方 favicon API 显示动态网站图标。
- `storage`：保存自定义门户、已选书签文件夹和置顶历史项。

扩展不包含远程脚本，也不会上传浏览器数据；门户、书签选择和置顶状态保存在本机浏览器扩展存储中。

## 技术说明

### 项目结构

- `manifest.json`：Chrome Manifest V3 配置，版本号为 `1.0.0`。
- `newtab.html`：新标签页入口。
- `newtab.css`：页面样式。
- `newtab.js`：门户、书签、历史记录和本地状态逻辑。
- `icons/`：扩展图标和默认门户图标。
- `docs/icon-sources.md`：默认入口图标来源记录。

### 打包发布

发布包是标准 Chrome 扩展 zip 格式：`manifest.json` 位于 zip 根目录，扩展运行所需的 `newtab.*` 文件和 `icons/` 目录随包发布。

本地打包命令：

```sh
mkdir -p dist
zip -r dist/tab-tab-v1.0.0.zip manifest.json newtab.html newtab.css newtab.js icons
```

发布流程：

1. 确认 `manifest.json` 的 `version` 与 Release 版本一致。
2. 生成 `dist/tab-tab-v1.0.0.zip`。
3. 创建 Git tag `v1.0`。
4. 在 GitHub Releases 发布 `v1.0`，上传 zip 安装包。

### 开发验证

```sh
jq empty manifest.json
node --check newtab.js
unzip -t dist/tab-tab-v1.0.0.zip
```

安装包验证重点：

- zip 根目录存在 `manifest.json`。
- `manifest.json` 可以被 `jq` 正常解析。
- `newtab.js` 通过 Node 语法检查。
- zip 结构可以被 `unzip -t` 完整校验。
