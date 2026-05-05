# tab-tab 扩展事实记录

> 采集日期：2026-05-04

## 扩展能力

- Chrome Manifest V3 支持通过 `chrome_url_overrides.newtab` 将扩展页面注册为新标签页。
- `chrome.history.search` 可以读取浏览历史，需要 `history` 权限。
- Manifest V3 扩展应声明 `favicon` 权限，并通过 `chrome.runtime.getURL("/_favicon/")` 构造 favicon URL。
- 自定义入口使用 `chrome.storage.local` 保存，避免依赖页面级 `localStorage`。
- 置顶历史项使用独立的 `chrome.storage.local` 数组键保存，不改变 Chrome 原始历史记录。

## 设计假设

- 目标是日常启用的工具页，不做营销落地页。
- 视觉方向采用克制的纸面网格、衬线标题和高密度列表，避免泛科技渐变风格。
- 中间栏是搜索中心，不再读取当前浏览器标签。
- 搜索中心不展示无法带关键词直达的 AI 入口，避免用户误以为入口页支持搜索。
