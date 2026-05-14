"use strict";

const PORTALS = [
  { title: "百度", url: "https://www.baidu.com", icon: "icons/portals/baidu.svg", category: "search" },
  { title: "知乎", url: "https://www.zhihu.com", icon: "icons/portals/zhihu.svg", category: "social" },
  { title: "哔哩哔哩", url: "https://www.bilibili.com", icon: "icons/portals/bilibili.svg", category: "media" },
  { title: "微博", url: "https://weibo.com", icon: "icons/portals/weibo.svg", category: "social" },
  { title: "淘宝", url: "https://www.taobao.com", icon: "icons/portals/taobao.svg", category: "shopping" },
  { title: "京东", url: "https://www.jd.com", icon: "icons/portals/jd.ico", category: "shopping" },
  { title: "GitHub", url: "https://github.com", icon: "icons/portals/github.svg", category: "developer" },
  { title: "MDN", url: "https://developer.mozilla.org", icon: "icons/portals/mdn.svg", category: "developer" },
  { title: "YouTube", url: "https://www.youtube.com", icon: "icons/portals/youtube.svg", category: "media" },
  { title: "Google", url: "https://www.google.com", icon: "icons/portals/google.svg", category: "search" },
  { title: "ChatGPT", url: "https://chatgpt.com", icon: "icons/portals/chatgpt.svg", category: "ai" },
  { title: "Claude", url: "https://claude.ai", icon: "icons/portals/claude.svg", category: "ai" },
  { title: "Gemini", url: "https://gemini.google.com", icon: "icons/portals/gemini.svg", category: "ai" },
  { title: "Perplexity", url: "https://www.perplexity.ai", icon: "icons/portals/perplexity.svg", category: "ai" },
  { title: "Notion", url: "https://www.notion.so", icon: "icons/portals/notion.svg", category: "productivity" },
  { title: "Figma", url: "https://www.figma.com", icon: "icons/portals/figma.svg", category: "design" },
  { title: "Vercel", url: "https://vercel.com", icon: "icons/portals/vercel.svg", category: "developer" },
  { title: "Cloudflare", url: "https://www.cloudflare.com", icon: "icons/portals/cloudflare.svg", category: "developer" },
  { title: "Gmail", url: "https://mail.google.com", icon: "icons/portals/gmail.svg", category: "productivity" },
  { title: "Google Drive", url: "https://drive.google.com", icon: "icons/portals/google-drive.svg", category: "productivity" },
  { title: "Discord", url: "https://discord.com", icon: "icons/portals/discord.svg", category: "social" },
  { title: "小红书", url: "https://www.xiaohongshu.com", icon: "icons/portals/xiaohongshu.svg", category: "social" },
  { title: "LinkedIn", url: "https://www.linkedin.com", icon: "icons/portals/linkedin.ico", category: "social" },
  { title: "Canva", url: "https://www.canva.com", icon: "icons/portals/canva.ico", category: "design" },
  { title: "飞书", url: "https://www.feishu.cn", icon: "icons/portals/feishu.png", category: "productivity" }
];
const CUSTOM_PORTALS_STORAGE_KEY = "customPortals";
const PINNED_HISTORY_STORAGE_KEY = "pinnedHistory";
const BOOKMARK_FOLDER_STORAGE_KEY = "bookmarkFolderId";
const BOOKMARK_LAYOUT_STORAGE_KEY = "bookmarkLayout";
const PORTAL_SECTION_ORDER_STORAGE_KEY = "portalSectionOrder";
const PORTAL_CATEGORIES_EXPANDED_STORAGE_KEY = "portalCategoriesExpanded";
const THEME_STORAGE_KEY = "themeMode";
const THEME_PALETTE_STORAGE_KEY = "themePalette";
const SEARCH_ENGINE_STORAGE_KEY = "quickSearchEngine";
const MAX_HISTORY_SITE_GROUPS = 9;
const MAX_HISTORY_PAGES_PER_SITE = 4;
const MAX_PINNED_HISTORY_ITEMS = 6;
const MAX_CUSTOM_PORTALS = 48;
const MAX_PORTAL_TITLE_LENGTH = 32;
const MAX_PORTAL_URL_LENGTH = 512;
const MAX_BOOKMARK_FOLDER_OPTIONS = 160;
const MAX_PORTAL_FEATURED_ITEMS = 6;
const MAX_BOOKMARK_PORTAL_ITEMS = 120;
const MAX_BOOKMARK_HISTORY_ITEMS = 180;
const MAX_RECENT_BOOKMARK_ITEMS = 2;
const BOOKMARK_HISTORY_LOOKBACK_DAYS = 45;
const DEFAULT_PORTAL_CATEGORY = "developer";
const DEFAULT_SEARCH_ENGINE = "google";
const DEFAULT_PORTAL_SECTION_ORDER = ["featured", "active"];
const COLLAPSED_PORTAL_CATEGORY_COUNT = 2;
const DEFAULT_THEME_MODE = "system";
const DEFAULT_THEME_PALETTE = "forest";
const CUSTOM_THEME_PALETTE_ID = "custom";
const DEFAULT_CUSTOM_THEME_COLORS = Object.freeze({ light: "#0d6d59", dark: "#68c19e" });
const THEME_PALETTES = [
  { id: "forest", label: "松石", light: "#0d6d59", dark: "#68c19e" },
  { id: "cobalt", label: "钴蓝", light: "#2f6fd6", dark: "#7cb7ff" },
  { id: "rose", label: "玫瑰", light: "#b94f67", dark: "#ff9ab1" }
];
const SEARCH_ENGINES = [
  { id: "google", label: "Google", icon: "icons/portals/google.svg", searchUrl: "https://www.google.com/search", queryParam: "q" },
  { id: "baidu", label: "百度", icon: "icons/portals/baidu.svg", searchUrl: "https://www.baidu.com/s", queryParam: "wd" },
  { id: "bing", label: "Bing", icon: "icons/portals/bing.svg", searchUrl: "https://www.bing.com/search", queryParam: "q" },
  { id: "duckduckgo", label: "DuckDuckGo", icon: "icons/portals/duckduckgo.svg", searchUrl: "https://duckduckgo.com/", queryParam: "q" },
  { id: "kagi", label: "Kagi", icon: "icons/portals/kagi.svg", searchUrl: "https://kagi.com/search", queryParam: "q" }
];
const PORTAL_CATEGORY_ORDER = [
  "custom",
  "developer",
  "ai",
  "productivity",
  "design",
  "search",
  "social",
  "shopping",
  "media",
  "other"
];
const BOOKMARK_CATEGORY_RULES = {
  developer: {
    hosts: ["github", "gitlab", "bitbucket", "stackoverflow", "stackexchange", "developer", "mozilla", "mdn", "npm", "vercel", "cloudflare", "docs", "api", "react", "vue", "svelte", "python", "nodejs", "docker"],
    text: ["开发", "代码", "工程", "编程", "技术", "文档", "接口", "源码", "仓库", "developer", "docs", "api", "code", "engineering", "programming"]
  },
  ai: {
    hosts: ["chatgpt", "openai", "claude", "anthropic", "gemini", "perplexity", "poe", "midjourney", "replicate", "huggingface", "cursor"],
    text: ["ai", "人工智能", "大模型", "模型", "提示词", "prompt", "agent", "智能体", "生成", "llm", "gpt", "Claude", "Gemini"]
  },
  productivity: {
    hosts: ["notion", "drive", "docs.google", "gmail", "calendar", "slack", "teams", "feishu", "larksuite", "office", "dropbox", "linear", "trello", "asana"],
    text: ["效率", "工作", "协作", "办公", "项目", "任务", "笔记", "文档", "productivity", "work", "office", "notes", "task", "calendar"]
  },
  design: {
    hosts: ["figma", "canva", "dribbble", "behance", "framer", "webflow", "uizard", "iconfont"],
    text: ["设计", "素材", "图片", "图标", "排版", "原型", "design", "ui", "ux", "mockup", "prototype", "icon"]
  },
  search: {
    hosts: ["google", "bing", "duckduckgo", "baidu", "kagi", "yandex", "sogou"],
    text: ["搜索", "搜尋", "search", "query", "检索"]
  },
  social: {
    hosts: ["x.com", "twitter", "linkedin", "discord", "weibo", "zhihu", "xiaohongshu", "reddit", "facebook", "instagram", "threads"],
    text: ["社交", "社区", "论坛", "问答", "social", "community", "forum"]
  },
  shopping: {
    hosts: ["taobao", "tmall", "jd", "amazon", "pinduoduo", "1688", "aliexpress", "ebay", "shopify"],
    text: ["购物", "商城", "电商", "订单", "优惠", "shopping", "shop", "store", "deal"]
  },
  media: {
    hosts: ["youtube", "bilibili", "netflix", "spotify", "music", "twitch", "douyin", "vimeo", "podcasts"],
    text: ["影音", "视频", "音乐", "播客", "直播", "media", "video", "music", "podcast", "stream"]
  }
};
const SITE_NAME_BY_KEY = {
  "b.ai": "B.AI",
  "bilibili.com": "哔哩哔哩",
  "chatgpt.com": "ChatGPT",
  "cloudflare.com": "Cloudflare",
  "developer.mozilla.org": "MDN",
  "discord.com": "Discord",
  "docs.b.ai": "B.AI Docs",
  "drive.google.com": "Google Drive",
  "figma.com": "Figma",
  "github.com": "GitHub",
  "gmail.com": "Gmail",
  "google.com": "Google",
  "linkedin.com": "LinkedIn",
  "npmjs.com": "npm",
  "notion.so": "Notion",
  "react.dev": "React",
  "stackoverflow.com": "Stack Overflow",
  "taobao.com": "淘宝",
  "trip.com": "Trip.com",
  "vercel.com": "Vercel",
  "x.com": "X",
  "xiaohongshu.com": "小红书",
  "youtube.com": "YouTube",
  "zhihu.com": "知乎"
};
const SITE_GROUP_OVERRIDES = {
  "docs.b.ai": "docs.b.ai",
  "drive.google.com": "drive.google.com",
  "mail.google.com": "gmail.com",
  "developer.mozilla.org": "developer.mozilla.org",
  "gemini.google.com": "gemini.google.com"
};
const HOME_URL_BY_KEY = {
  "developer.mozilla.org": "https://developer.mozilla.org/",
  "docs.b.ai": "https://docs.b.ai/",
  "drive.google.com": "https://drive.google.com/",
  "gemini.google.com": "https://gemini.google.com/",
  "gmail.com": "https://mail.google.com/",
  "google.com": "https://www.google.com/",
  "react.dev": "https://react.dev/"
};
const SITE_GROUP_SUFFIXES = [
  "bilibili.com",
  "cloudflare.com",
  "github.com",
  "google.com",
  "linkedin.com",
  "npmjs.com",
  "notion.so",
  "stackoverflow.com",
  "taobao.com",
  "twitter.com",
  "vercel.com",
  "x.com",
  "xiaohongshu.com",
  "youtube.com",
  "zhihu.com"
];
const MULTIPART_PUBLIC_SUFFIXES = new Set([
  "com.cn",
  "net.cn",
  "org.cn",
  "com.hk",
  "com.tw",
  "com.au",
  "co.jp",
  "co.kr",
  "co.uk"
]);
const TITLE_SUFFIX_SEPARATORS = [
  " - ",
  " — ",
  " – ",
  " | ",
  "_",
  "-"
];
const PORTAL_ICON_BY_SITE_KEY = Object.freeze(Object.fromEntries(PORTALS.map((portal) => {
  const url = new URL(portal.url);
  return [canonicalSiteHost(url.hostname), portal.icon];
})));
const PORTAL_CATEGORY_BY_SITE_KEY = Object.freeze(Object.fromEntries(PORTALS.map((portal) => {
  const url = new URL(portal.url);
  return [canonicalSiteHost(url.hostname), portal.category];
})));
const DEFAULT_LOCALE = "zh-CN";
const SUPPORTED_LOCALES = ["zh-CN", "zh-TW", "en", "ja", "ko", "es", "fr", "de"];
const MESSAGES = {
  "zh-CN": {
    topbarLabel: "顶部功能区",
    shellLabel: "tab-tab 控制台",
    portalTitle: "常用网站",
    mobilePortalTab: "快捷",
    mobileBookmarkTab: "书签",
    mobileHistoryTab: "历史",
    portalCategoryFeatured: "常用入口",
    portalCategoryRecentBookmarks: "最近加入书签",
    portalCategoryCustom: "自定义",
    portalCategoryShopping: "购物",
    portalCategoryAi: "AI",
    portalCategorySocial: "社交",
    portalCategorySearch: "搜索",
    portalCategoryDeveloper: "开发",
    portalCategoryProductivity: "效率",
    portalCategoryMedia: "影音",
    portalCategoryDesign: "设计",
    portalCategoryOther: "其他",
    portalCategories: "智能分类",
    portalCategoriesExpand: "展开 {count} 项",
    portalCategoriesCollapse: "收起",
    portalSourceBookmarks: "本地智能分类 · 自动合并书签",
    portalSourceFallback: "默认入口 · 授权后自动智能分类",
    addPortal: "添加入口",
    portalName: "名称",
    portalUrl: "网址",
    portalCategory: "归类",
    portalNamePlaceholder: "例如：Notion",
    portalUrlPlaceholder: "https://www.notion.so",
    cancel: "取消",
    add: "添加",
    bookmarksTitle: "书签",
    refreshBookmarkFolder: "刷新当前书签文件夹",
    switchBookmarkLayoutToList: "切换为列表显示",
    switchBookmarkLayoutToGrid: "切换为一行 4 个显示",
    chooseBookmarkFolder: "选择书签文件夹",
    back: "返回",
    chooseBookmarkFolderPrompt: "选择一个书签文件夹",
    historyTitle: "最近浏览",
    refreshHistory: "刷新历史记录",
    pinnedTitle: "置顶",
    recentTitle: "最近 · 时间流",
    quickSearchPlaceholder: "搜索或输入网址",
    quickSearch: "搜索",
    quickSearchEngine: "搜索引擎",
    quickSearchWith: "使用 {engine} 搜索",
    portalCategoryItems: "{count} 个入口",
    deleteCustomPortal: "删除自定义入口",
    openSettings: "设置中心",
    closeSettings: "关闭设置中心",
    settingsTitle: "设置中心",
    appearanceModeTitle: "外观模式",
    themeModeSystem: "跟随",
    themeModeLight: "日间",
    themeModeDark: "夜间",
    presetPaletteTitle: "默认双色",
    customPaletteTitle: "自定义双色",
    lightAccent: "日间",
    darkAccent: "夜间",
    portalNameRequired: "请填写入口名称。",
    portalUrlRequired: "请输入 http 或 https 开头的网址。",
    customPortalLimit: "自定义入口最多 {count} 个。",
    savePortalFailed: "保存入口失败，请减少数量或缩短内容后重试。",
    loadCustomPortalsFailed: "读取自定义入口失败，请刷新后重试。",
    deletePortalFailed: "删除入口失败，请刷新后重试。",
    bookmarkNoFolder: "还没有选择书签文件夹。点击右上角 + 后选择一个文件夹。",
    bookmarkFolderMissing: "已选文件夹不存在，请重新选择。",
    unnamedFolder: "未命名文件夹",
    bookmarkMeta: "{folder} · {count} 个网站",
    bookmarkEmpty: "这个文件夹里没有可显示的网站书签。",
    bookmarkReadFailed: "无法读取书签，请确认扩展已获得 bookmarks 权限。",
    deleteBookmark: "删除 {title}",
    deleteBookmarkAction: "删除",
    deleteBookmarkFailed: "删除失败，可能已在其他位置变更。",
    loadingBookmarkFolders: "正在读取书签文件夹。",
    bookmarkFolderReadFailed: "无法读取书签文件夹。",
    noBookmarkFolders: "没有找到包含网站书签的文件夹。",
    bookmarkRoot: "书签",
    bookmarkCount: "{count} 个网站",
    pageCount: "{count} 个页面",
    historySitePageMeta: "{count} 个相关页面",
    historyExpandPages: "展开 {count} 个相关页面",
    historyCollapsePages: "收起相关页面",
    historyRelatedPages: "相关页面",
    historyPrimaryPage: "最近页面",
    historyJustNow: "刚刚",
    historyMinutesAgo: "{count} 分钟前",
    historyHoursAgo: "{count} 小时前",
    historyReadFailed: "无法读取历史记录，请确认扩展已获得 history 权限。",
    deleteHistory: "删除 {title}",
    deleteHistoryFailed: "删除失败，可能已在其他位置变更。",
    noPinnedItems: "还没有置顶项目。",
    noHistoryItems: "暂无最近浏览记录。",
    openSiteHome: "打开 {name} 首页",
    openPage: "打开 {title}",
    unpin: "取消置顶",
    pin: "置顶",
    unnamedPage: "未命名页面",
    website: "网站"
  },
  "zh-TW": {
    portalTitle: "常用網站",
    mobilePortalTab: "快捷",
    mobileBookmarkTab: "書籤",
    mobileHistoryTab: "歷史",
    quickSearchPlaceholder: "搜尋或輸入網址",
    quickSearch: "搜尋",
    quickSearchEngine: "搜尋引擎",
    quickSearchWith: "使用 {engine} 搜尋",
    portalCategoryItems: "{count} 個入口",
    portalCategories: "智能分類",
    portalCategoriesExpand: "展開 {count} 項",
    portalCategoriesCollapse: "收起",
    portalCategoryFeatured: "常用入口",
    portalCategoryRecentBookmarks: "最近加入書籤",
    portalSourceBookmarks: "本地智能分類 · 自動合併書籤",
    portalSourceFallback: "預設入口 · 授權後自動智能分類",
    historyJustNow: "剛剛",
    historyMinutesAgo: "{count} 分鐘前",
    historyHoursAgo: "{count} 小時前",
    portalName: "名稱",
    portalUrl: "網址",
    cancel: "取消",
    add: "新增",
    addPortal: "新增入口",
    bookmarksTitle: "書籤",
    back: "返回",
    chooseBookmarkFolderPrompt: "選擇一個書籤資料夾",
    historyTitle: "最近瀏覽",
    pinnedTitle: "釘選",
    recentTitle: "最近",
    unnamedFolder: "未命名資料夾",
    bookmarkRoot: "書籤",
    bookmarkMeta: "{folder} · {count} 個網站",
    bookmarkCount: "{count} 個網站",
    deleteBookmarkAction: "刪除",
    historyExpandPages: "展開 {count} 個相關頁面",
    historyCollapsePages: "收起相關頁面",
    historyRelatedPages: "相關頁面",
    historyPrimaryPage: "最近頁面",
    unnamedPage: "未命名頁面",
    website: "網站"
  },
  en: {
    topbarLabel: "Top bar",
    shellLabel: "tab-tab dashboard",
    portalTitle: "Top sites",
    mobilePortalTab: "Shortcuts",
    mobileBookmarkTab: "Bookmarks",
    mobileHistoryTab: "History",
    portalCategoryFeatured: "Frequent shortcuts",
    portalCategoryRecentBookmarks: "Recently bookmarked",
    portalCategoryCustom: "Custom",
    portalCategoryShopping: "Shopping",
    portalCategoryAi: "AI",
    portalCategorySocial: "Social",
    portalCategorySearch: "Search",
    portalCategoryDeveloper: "Developer",
    portalCategoryProductivity: "Productivity",
    portalCategoryMedia: "Media",
    portalCategoryDesign: "Design",
    portalCategoryOther: "Other",
    portalCategories: "Smart categories",
    portalCategoriesExpand: "Show {count} more",
    portalCategoriesCollapse: "Collapse",
    portalSourceBookmarks: "Local smart sorting · Bookmarks merged automatically",
    portalSourceFallback: "Default shortcuts · Smart sorting after bookmark permission",
    addPortal: "Add portal",
    portalName: "Name",
    portalUrl: "URL",
    portalCategory: "Category",
    portalNamePlaceholder: "Example: Notion",
    portalUrlPlaceholder: "https://www.notion.so",
    cancel: "Cancel",
    add: "Add",
    bookmarksTitle: "Bookmarks",
    refreshBookmarkFolder: "Refresh current bookmark folder",
    switchBookmarkLayoutToList: "Switch to list view",
    switchBookmarkLayoutToGrid: "Switch to 4-column grid view",
    chooseBookmarkFolder: "Choose bookmark folder",
    back: "Back",
    chooseBookmarkFolderPrompt: "Choose a bookmark folder",
    historyTitle: "Recent browsing",
    refreshHistory: "Refresh history",
    pinnedTitle: "Pinned",
    recentTitle: "Recent timeline",
    quickSearchPlaceholder: "Search or enter URL",
    quickSearch: "Search",
    quickSearchEngine: "Search engine",
    quickSearchWith: "Search with {engine}",
    portalCategoryItems: "{count} shortcuts",
    deleteCustomPortal: "Remove custom portal",
    openSettings: "Settings",
    closeSettings: "Close settings",
    settingsTitle: "Settings",
    appearanceModeTitle: "Appearance",
    themeModeSystem: "Follow",
    themeModeLight: "Light",
    themeModeDark: "Dark",
    presetPaletteTitle: "Preset pairs",
    customPaletteTitle: "Custom pair",
    lightAccent: "Light",
    darkAccent: "Dark",
    portalNameRequired: "Enter a portal name.",
    portalUrlRequired: "Enter an http or https URL.",
    customPortalLimit: "You can add up to {count} custom portals.",
    savePortalFailed: "Could not save this portal. Try fewer or shorter entries.",
    loadCustomPortalsFailed: "Could not load custom portals. Refresh and try again.",
    deletePortalFailed: "Could not remove this portal. Refresh and try again.",
    bookmarkNoFolder: "No bookmark folder selected. Use + in the top right to choose one.",
    bookmarkFolderMissing: "The selected folder no longer exists. Choose another folder.",
    unnamedFolder: "Untitled folder",
    bookmarkMeta: "{folder} · {count} sites",
    bookmarkEmpty: "This folder has no website bookmarks to show.",
    bookmarkReadFailed: "Could not read bookmarks. Check that the extension has bookmarks permission.",
    deleteBookmark: "Remove {title}",
    deleteBookmarkAction: "Remove",
    deleteBookmarkFailed: "Could not remove it. It may have changed elsewhere.",
    loadingBookmarkFolders: "Loading bookmark folders.",
    bookmarkFolderReadFailed: "Could not read bookmark folders.",
    noBookmarkFolders: "No bookmark folders with website bookmarks found.",
    bookmarkRoot: "Bookmarks",
    bookmarkCount: "{count} sites",
    pageCount: "{count} pages",
    historySitePageMeta: "{count} related pages",
    historyExpandPages: "Show {count} related pages",
    historyCollapsePages: "Hide related pages",
    historyRelatedPages: "Related pages",
    historyPrimaryPage: "Latest page",
    historyJustNow: "Just now",
    historyMinutesAgo: "{count} min ago",
    historyHoursAgo: "{count} hr ago",
    historyReadFailed: "Could not read history. Check that the extension has history permission.",
    deleteHistory: "Remove {title}",
    deleteHistoryFailed: "Could not remove it. It may have changed elsewhere.",
    noPinnedItems: "No pinned items yet.",
    noHistoryItems: "No recent browsing yet.",
    openSiteHome: "Open {name} home page",
    openPage: "Open {title}",
    unpin: "Unpin",
    pin: "Pin",
    unnamedPage: "Untitled page",
    website: "Website"
  },
  ja: {
    portalTitle: "人気のおすすめ",
    addPortal: "入口を追加",
    portalName: "名前",
    portalUrl: "URL",
    cancel: "キャンセル",
    add: "追加",
    bookmarksTitle: "ブックマーク",
    back: "戻る",
    chooseBookmarkFolderPrompt: "ブックマークフォルダを選択",
    historyTitle: "最近の閲覧",
    pinnedTitle: "固定",
    recentTitle: "最近",
    unnamedFolder: "名称未設定のフォルダ",
    bookmarkRoot: "ブックマーク",
    bookmarkMeta: "{folder} · {count} 件のサイト",
    bookmarkCount: "{count} 件のサイト",
    unnamedPage: "名称未設定のページ",
    website: "Website"
  },
  ko: {
    portalTitle: "인기 추천",
    addPortal: "항목 추가",
    portalName: "이름",
    portalUrl: "URL",
    cancel: "취소",
    add: "추가",
    bookmarksTitle: "북마크",
    back: "뒤로",
    chooseBookmarkFolderPrompt: "북마크 폴더 선택",
    historyTitle: "최근 방문",
    pinnedTitle: "고정",
    recentTitle: "최근",
    unnamedFolder: "이름 없는 폴더",
    bookmarkRoot: "북마크",
    bookmarkMeta: "{folder} · 사이트 {count}개",
    bookmarkCount: "사이트 {count}개",
    unnamedPage: "제목 없는 페이지",
    website: "Website"
  },
  es: {
    portalTitle: "Recomendados",
    addPortal: "Agregar acceso",
    portalName: "Nombre",
    portalUrl: "URL",
    cancel: "Cancelar",
    add: "Agregar",
    bookmarksTitle: "Marcadores",
    back: "Volver",
    chooseBookmarkFolderPrompt: "Elige una carpeta de marcadores",
    historyTitle: "Recientes",
    pinnedTitle: "Fijados",
    recentTitle: "Recientes",
    unnamedFolder: "Carpeta sin título",
    bookmarkRoot: "Marcadores",
    bookmarkMeta: "{folder} · {count} sitios",
    bookmarkCount: "{count} sitios",
    unnamedPage: "Página sin título",
    website: "Website"
  },
  fr: {
    portalTitle: "Recommandés",
    addPortal: "Ajouter un raccourci",
    portalName: "Nom",
    portalUrl: "URL",
    cancel: "Annuler",
    add: "Ajouter",
    bookmarksTitle: "Favoris",
    back: "Retour",
    chooseBookmarkFolderPrompt: "Choisir un dossier de favoris",
    historyTitle: "Navigation récente",
    pinnedTitle: "Épinglés",
    recentTitle: "Récents",
    unnamedFolder: "Dossier sans titre",
    bookmarkRoot: "Favoris",
    bookmarkMeta: "{folder} · {count} sites",
    bookmarkCount: "{count} sites",
    unnamedPage: "Page sans titre",
    website: "Website"
  },
  de: {
    portalTitle: "Empfohlen",
    addPortal: "Eintrag hinzufügen",
    portalName: "Name",
    portalUrl: "URL",
    cancel: "Abbrechen",
    add: "Hinzufügen",
    bookmarksTitle: "Lesezeichen",
    back: "Zurück",
    chooseBookmarkFolderPrompt: "Lesezeichenordner auswählen",
    historyTitle: "Zuletzt besucht",
    pinnedTitle: "Angeheftet",
    recentTitle: "Zuletzt",
    unnamedFolder: "Unbenannter Ordner",
    bookmarkRoot: "Lesezeichen",
    bookmarkMeta: "{folder} · {count} Websites",
    bookmarkCount: "{count} Websites",
    unnamedPage: "Unbenannte Seite",
    website: "Website"
  }
};
const LOCALE = resolveLocale();

const portalGrid = document.querySelector("#portalGrid");
const portalSourceText = document.querySelector("#portalSourceText");
const bookmarkGrid = document.querySelector("#bookmarkGrid");
const bookmarkMainView = document.querySelector("#bookmarkMainView");
const bookmarkFolderMeta = document.querySelector("#bookmarkFolderMeta");
const bookmarkPicker = document.querySelector("#bookmarkPicker");
const bookmarkFolderList = document.querySelector("#bookmarkFolderList");
const chooseBookmarkFolderButton = document.querySelector("#chooseBookmarkFolderButton");
const refreshBookmarkFolderButton = document.querySelector("#refreshBookmarkFolderButton");
const toggleBookmarkLayoutButton = document.querySelector("#toggleBookmarkLayoutButton");
const closeBookmarkPickerButton = document.querySelector("#closeBookmarkPickerButton");
const pinnedGrid = document.querySelector("#pinnedGrid");
const historyGrid = document.querySelector("#historyGrid");
const refreshHistoryButton = document.querySelector("#refreshHistoryButton");
const siteCardTemplate = document.querySelector("#siteCardTemplate");
const settingsButton = document.querySelector("#settingsButton");
const settingsPanel = document.querySelector("#settingsPanel");
const closeSettingsButton = document.querySelector("#closeSettingsButton");
const palettePresetGrid = document.querySelector("#palettePresetGrid");
const lightAccentInput = document.querySelector("#lightAccentInput");
const darkAccentInput = document.querySelector("#darkAccentInput");
const lightAccentValue = document.querySelector("#lightAccentValue");
const darkAccentValue = document.querySelector("#darkAccentValue");
const quickSearchForm = document.querySelector("#quickSearchForm");
const quickSearchInput = document.querySelector("#quickSearchInput");
const quickSearchButton = document.querySelector("#quickSearchButton");
const quickSearchEngineButton = document.querySelector("#quickSearchEngineButton");
const quickSearchEngineMenu = document.querySelector("#quickSearchEngineMenu");
const quickSearchEngineLogo = document.querySelector("#quickSearchEngineLogo");
const quickSearchEngineName = document.querySelector("#quickSearchEngineName");
const togglePortalFormButton = document.querySelector("#togglePortalFormButton");
const portalForm = document.querySelector("#portalForm");
const portalTitleInput = document.querySelector("#portalTitleInput");
const portalUrlInput = document.querySelector("#portalUrlInput");
const portalCategorySelect = document.querySelector("#portalCategorySelect");
const portalFormError = document.querySelector("#portalFormError");
const cancelPortalButton = document.querySelector("#cancelPortalButton");
const mobileSectionTabs = [...document.querySelectorAll(".mobile-section-tab")];
let bookmarkRefreshTimer = 0;
let activeBookmarkDeleteCard = null;
let bookmarkLayout = "grid";
let activePortalCategory = DEFAULT_PORTAL_CATEGORY;
let activeSearchEngine = DEFAULT_SEARCH_ENGINE;
let draggedPortalSectionRole = "";
let portalCategoriesExpanded = false;
let activeThemeMode = DEFAULT_THEME_MODE;
let activeThemePalette = DEFAULT_THEME_PALETTE;
let activeCustomThemeColors = { ...DEFAULT_CUSTOM_THEME_COLORS };
let systemThemeQuery = null;
let settingsPanelCloseTimer = 0;

document.addEventListener("DOMContentLoaded", init);

function resolveLocale() {
  const languageCandidates = [
    globalThis.chrome?.i18n?.getUILanguage?.(),
    ...(navigator.languages || []),
    navigator.language
  ].filter(Boolean);

  for (const language of languageCandidates) {
    const normalized = String(language).replace("_", "-");
    const exactMatch = SUPPORTED_LOCALES.find((locale) => locale.toLowerCase() === normalized.toLowerCase());
    if (exactMatch) {
      return exactMatch;
    }
    const languageCode = normalized.split("-")[0].toLowerCase();
    if (languageCode === "zh") {
      return /(?:tw|hk|mo|hant)/i.test(normalized) ? "zh-TW" : "zh-CN";
    }
    const baseMatch = SUPPORTED_LOCALES.find((locale) => locale === languageCode);
    if (baseMatch) {
      return baseMatch;
    }
  }

  return DEFAULT_LOCALE;
}

function t(key, values = {}) {
  const template = messageTemplate(key);
  return template.replace(/\{(\w+)\}/g, (_, valueKey) => String(values[valueKey] ?? ""));
}

function messageTemplate(key) {
  if (MESSAGES[LOCALE]?.[key]) {
    return MESSAGES[LOCALE][key];
  }
  if (LOCALE === "zh-TW" && MESSAGES[DEFAULT_LOCALE]?.[key]) {
    return MESSAGES[DEFAULT_LOCALE][key];
  }
  return MESSAGES.en[key] || MESSAGES[DEFAULT_LOCALE][key] || key;
}

function applyLocale() {
  document.documentElement.lang = LOCALE;
  document.querySelector(".topbar")?.setAttribute("aria-label", t("topbarLabel"));
  document.querySelector(".shell")?.setAttribute("aria-label", t("shellLabel"));
  document.querySelector("#portal-title").textContent = t("portalTitle");
  if (portalSourceText) {
    portalSourceText.textContent = t("portalSourceFallback");
  }
  document.querySelector("#bookmark-title").textContent = t("bookmarksTitle");
  document.querySelector("#history-title").textContent = t("historyTitle");
  document.querySelector("#pinned-title").textContent = t("pinnedTitle");
  document.querySelector("#recent-title").textContent = t("recentTitle");
  setMobileTabLabel("portalPanel", t("mobilePortalTab"));
  setMobileTabLabel("bookmarkPanel", t("mobileBookmarkTab"));
  setMobileTabLabel("historyPanel", t("mobileHistoryTab"));

  setButtonLabel(togglePortalFormButton, t("addPortal"));
  setButtonLabel(refreshBookmarkFolderButton, t("refreshBookmarkFolder"));
  updateBookmarkLayoutButton();
  setButtonLabel(chooseBookmarkFolderButton, t("chooseBookmarkFolder"));
  setButtonLabel(refreshHistoryButton, t("refreshHistory"));
  setButtonLabel(settingsButton, t("openSettings"));
  setButtonLabel(closeSettingsButton, t("closeSettings"));
  setStaticButtonIcons();
  applySettingsLocale();
  updateQuickSearchButtonLabel();
  quickSearchInput.placeholder = t("quickSearchPlaceholder");
  quickSearchInput.setAttribute("aria-label", t("quickSearchPlaceholder"));
  quickSearchEngineButton?.setAttribute("title", t("quickSearchEngine"));

  const portalTitleLabel = portalTitleInput.closest("label")?.querySelector("span");
  const portalUrlLabel = portalUrlInput.closest("label")?.querySelector("span");
  const portalCategoryLabel = portalCategorySelect.closest("label")?.querySelector("span");
  if (portalTitleLabel) {
    portalTitleLabel.textContent = t("portalName");
  }
  if (portalUrlLabel) {
    portalUrlLabel.textContent = t("portalUrl");
  }
  if (portalCategoryLabel) {
    portalCategoryLabel.textContent = t("portalCategory");
  }
  populatePortalCategoryOptions();
  portalTitleInput.placeholder = t("portalNamePlaceholder");
  portalUrlInput.placeholder = t("portalUrlPlaceholder");
  cancelPortalButton.textContent = t("cancel");
  portalForm.querySelector('button[type="submit"]').textContent = t("add");
  closeBookmarkPickerButton.textContent = t("back");
  const bookmarkPickerTitle = document.querySelector(".bookmark-picker-toolbar span");
  if (bookmarkPickerTitle) {
    bookmarkPickerTitle.textContent = t("chooseBookmarkFolderPrompt");
  }
}

function setMobileTabLabel(panelId, label) {
  const tab = mobileSectionTabs.find((item) => item.dataset.panelTarget === panelId);
  if (tab) {
    tab.textContent = label;
  }
}

function setButtonLabel(button, label) {
  if (!button) {
    return;
  }
  button.title = label;
  button.setAttribute("aria-label", label);
}

function setStaticButtonIcons() {
  togglePortalFormButton.querySelector(".button-icon").innerHTML = plusIcon();
  refreshBookmarkFolderButton.querySelector(".button-icon").innerHTML = refreshIcon();
  chooseBookmarkFolderButton.querySelector(".button-icon").innerHTML = folderPlusIcon();
  refreshHistoryButton.querySelector(".button-icon").innerHTML = refreshIcon();
  settingsButton.querySelector(".theme-toggle-icon").innerHTML = settingsIcon();
  closeSettingsButton.querySelector(".button-icon").innerHTML = closeIcon();
}

function applySettingsLocale() {
  document.querySelector("#settingsTitle").textContent = t("settingsTitle");
  document.querySelector("#appearanceModeTitle").textContent = t("appearanceModeTitle");
  document.querySelector("#presetPaletteTitle").textContent = t("presetPaletteTitle");
  document.querySelector("#customPaletteTitle").textContent = t("customPaletteTitle");
  document.querySelector('[data-theme-mode="system"]').textContent = t("themeModeSystem");
  document.querySelector('[data-theme-mode="light"]').textContent = t("themeModeLight");
  document.querySelector('[data-theme-mode="dark"]').textContent = t("themeModeDark");
  lightAccentInput.closest("label").querySelector("span").textContent = t("lightAccent");
  darkAccentInput.closest("label").querySelector("span").textContent = t("darkAccent");
}

function init() {
  applyLocale();
  initThemeMode();
  initQuickSearchEngine();
  renderPortals();
  initBookmarkLayout();
  renderSelectedBookmarkFolder();
  refreshHistory();

  chooseBookmarkFolderButton.addEventListener("click", openBookmarkPicker);
  refreshBookmarkFolderButton.addEventListener("click", renderSelectedBookmarkFolder);
  toggleBookmarkLayoutButton.addEventListener("click", toggleBookmarkLayout);
  closeBookmarkPickerButton.addEventListener("click", closeBookmarkPicker);
  refreshHistoryButton.addEventListener("click", refreshHistory);
  quickSearchForm.addEventListener("submit", handleQuickSearchSubmit);
  quickSearchInput.addEventListener("keydown", handleQuickSearchInputKeydown);
  quickSearchEngineButton.addEventListener("click", toggleSearchEngineMenu);
  quickSearchEngineButton.addEventListener("keydown", handleSearchEngineButtonKeydown);
  togglePortalFormButton.addEventListener("click", showPortalForm);
  cancelPortalButton.addEventListener("click", hidePortalForm);
  portalForm.addEventListener("submit", handlePortalSubmit);
  settingsButton.addEventListener("click", toggleSettingsPanel);
  closeSettingsButton.addEventListener("click", () => closeSettingsPanel({ restoreFocus: true }));
  document.querySelectorAll("[data-theme-mode]").forEach((button) => {
    button.addEventListener("click", () => setThemeMode(button.dataset.themeMode, { persist: true }));
  });
  lightAccentInput.addEventListener("input", handleCustomThemeColorInput);
  darkAccentInput.addEventListener("input", handleCustomThemeColorInput);
  mobileSectionTabs.forEach((tab) => {
    tab.addEventListener("click", () => activateMobilePanel(tab.dataset.panelTarget));
  });
  document.addEventListener("pointerdown", handleBookmarkDeleteDismiss, true);
  document.addEventListener("pointerdown", handleSearchEngineMenuDismiss, true);
  document.addEventListener("pointerdown", handleSettingsPanelDismiss, true);
  document.addEventListener("keydown", handleBookmarkDeleteEscape);
  document.addEventListener("keydown", handleGlobalEscape);
  bindBookmarkChangeEvents();
}

function activateMobilePanel(panelId) {
  if (!panelId) {
    return;
  }
  mobileSectionTabs.forEach((tab) => {
    const isActive = tab.dataset.panelTarget === panelId;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.toggle("mobile-active", panel.id === panelId);
  });
}

async function initThemeMode() {
  renderThemePalettePresets();
  bindSystemThemeListener();
  try {
    const result = await chrome.storage.local.get({
      [THEME_STORAGE_KEY]: DEFAULT_THEME_MODE,
      [THEME_PALETTE_STORAGE_KEY]: defaultThemePaletteSettings()
    });
    const savedTheme = result[THEME_STORAGE_KEY];
    const savedPalette = normalizeThemePaletteSettings(result[THEME_PALETTE_STORAGE_KEY]);
    activeThemePalette = savedPalette.palette;
    activeCustomThemeColors = savedPalette.custom;
    updateCustomThemeInputs();
    applyThemePalette();
    applyThemeMode(savedTheme === "dark" || savedTheme === "light" || savedTheme === "system" ? savedTheme : DEFAULT_THEME_MODE);
  } catch (error) {
    console.warn("Failed to load theme mode", error);
    applyThemePalette();
    applyThemeMode(DEFAULT_THEME_MODE);
  }
}

async function initQuickSearchEngine() {
  populateQuickSearchEngineOptions();
  try {
    const result = await chrome.storage.local.get({ [SEARCH_ENGINE_STORAGE_KEY]: DEFAULT_SEARCH_ENGINE });
    setQuickSearchEngine(result[SEARCH_ENGINE_STORAGE_KEY], { persist: false });
  } catch (error) {
    console.warn("Failed to load search engine", error);
    setQuickSearchEngine(DEFAULT_SEARCH_ENGINE, { persist: false });
  }
}

function populateQuickSearchEngineOptions() {
  quickSearchEngineMenu.replaceChildren(...SEARCH_ENGINES.map((engine) => {
    const option = document.createElement("button");
    const icon = document.createElement("img");
    const label = document.createElement("span");
    option.className = "search-engine-option";
    option.type = "button";
    option.setAttribute("role", "option");
    option.dataset.engine = engine.id;
    option.setAttribute("aria-selected", "false");
    icon.src = engine.icon;
    icon.alt = "";
    label.textContent = engine.label;
    option.append(icon, label);
    option.addEventListener("click", () => selectSearchEngineFromMenu(engine.id));
    option.addEventListener("keydown", handleSearchEngineOptionKeydown);
    return option;
  }));
}

async function selectSearchEngineFromMenu(engineId) {
  await setQuickSearchEngine(engineId, { persist: true });
  closeSearchEngineMenu({ restoreFocus: true });
}

function toggleSearchEngineMenu() {
  if (quickSearchEngineMenu.hidden) {
    openSearchEngineMenu();
    return;
  }
  closeSearchEngineMenu({ restoreFocus: true });
}

function openSearchEngineMenu() {
  quickSearchEngineMenu.hidden = false;
  quickSearchEngineButton.setAttribute("aria-expanded", "true");
  quickSearchEngineMenu.querySelector(`[data-engine="${CSS.escape(activeSearchEngine)}"]`)?.focus();
}

function closeSearchEngineMenu(options = {}) {
  if (quickSearchEngineMenu.hidden) {
    return;
  }
  quickSearchEngineMenu.hidden = true;
  quickSearchEngineButton.setAttribute("aria-expanded", "false");
  if (options.restoreFocus) {
    quickSearchEngineButton.focus({ preventScroll: true });
  }
}

function handleSearchEngineButtonKeydown(event) {
  if (event.key !== "ArrowDown" && event.key !== "Enter" && event.key !== " ") {
    return;
  }
  event.preventDefault();
  openSearchEngineMenu();
}

function handleSearchEngineOptionKeydown(event) {
  const options = [...quickSearchEngineMenu.querySelectorAll(".search-engine-option")];
  const currentIndex = options.indexOf(event.currentTarget);
  if (event.key === "Escape") {
    event.preventDefault();
    closeSearchEngineMenu({ restoreFocus: true });
    return;
  }
  if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
    return;
  }
  event.preventDefault();
  const offset = event.key === "ArrowDown" ? 1 : -1;
  const nextIndex = (currentIndex + offset + options.length) % options.length;
  options[nextIndex]?.focus();
}

function handleSearchEngineMenuDismiss(event) {
  if (quickSearchEngineMenu.hidden) {
    return;
  }
  const target = event.target;
  if (target instanceof Element && (quickSearchEngineMenu.contains(target) || quickSearchEngineButton.contains(target))) {
    return;
  }
  closeSearchEngineMenu();
}

function handleGlobalEscape(event) {
  if (event.key !== "Escape") {
    return;
  }
  closeSearchEngineMenu();
  closeSettingsPanel();
}

async function setQuickSearchEngine(engineId, options = {}) {
  const nextEngine = searchEngineById(engineId);
  activeSearchEngine = nextEngine.id;
  updateQuickSearchButtonLabel();
  if (!options.persist) {
    return;
  }
  try {
    await chrome.storage.local.set({ [SEARCH_ENGINE_STORAGE_KEY]: nextEngine.id });
  } catch (error) {
    console.warn("Failed to save search engine", error);
  }
}

function updateQuickSearchButtonLabel() {
  const engine = searchEngineById(activeSearchEngine);
  setButtonLabel(quickSearchButton, t("quickSearchWith", { engine: engine.label }));
  quickSearchButton.textContent = t("quickSearch");
  if (quickSearchEngineLogo) {
    quickSearchEngineLogo.src = engine.icon;
    quickSearchEngineLogo.alt = "";
  }
  if (quickSearchEngineName) {
    quickSearchEngineName.textContent = engine.label;
  }
  quickSearchEngineButton.title = `${t("quickSearchEngine")}: ${engine.label}`;
  quickSearchEngineMenu?.querySelectorAll(".search-engine-option").forEach((option) => {
    const isSelected = option.dataset.engine === engine.id;
    option.classList.toggle("active", isSelected);
    option.setAttribute("aria-selected", String(isSelected));
  });
}

function searchEngineById(engineId) {
  return SEARCH_ENGINES.find((engine) => engine.id === engineId) || SEARCH_ENGINES[0];
}

async function initBookmarkLayout() {
  try {
    const result = await chrome.storage.local.get({ [BOOKMARK_LAYOUT_STORAGE_KEY]: "grid" });
    applyBookmarkLayout(result[BOOKMARK_LAYOUT_STORAGE_KEY] === "list" ? "list" : "grid");
  } catch (error) {
    console.warn("Failed to load bookmark layout", error);
    applyBookmarkLayout("grid");
  }
}

async function toggleBookmarkLayout() {
  const nextLayout = bookmarkLayout === "list" ? "grid" : "list";
  applyBookmarkLayout(nextLayout);
  try {
    await chrome.storage.local.set({ [BOOKMARK_LAYOUT_STORAGE_KEY]: nextLayout });
  } catch (error) {
    console.warn("Failed to save bookmark layout", error);
  }
}

function applyBookmarkLayout(layout) {
  bookmarkLayout = layout === "list" ? "list" : "grid";
  bookmarkGrid.classList.toggle("list-layout", bookmarkLayout === "list");
  bookmarkGrid.classList.toggle("grid-layout", bookmarkLayout !== "list");
  updateBookmarkLayoutButton();
}

function updateBookmarkLayoutButton() {
  if (!toggleBookmarkLayoutButton) {
    return;
  }
  const isList = bookmarkLayout === "list";
  const label = isList ? t("switchBookmarkLayoutToGrid") : t("switchBookmarkLayoutToList");
  setButtonLabel(toggleBookmarkLayoutButton, label);
  toggleBookmarkLayoutButton.setAttribute("aria-pressed", String(isList));
  toggleBookmarkLayoutButton.querySelector(".button-icon").innerHTML = isList ? gridIcon() : listIcon();
}

function applyThemeMode(theme) {
  activeThemeMode = theme === "dark" || theme === "light" || theme === "system" ? theme : DEFAULT_THEME_MODE;
  const resolvedTheme = resolvedThemeMode();
  document.documentElement.dataset.theme = resolvedTheme;
  updateThemeSettingsUi();
}

function resolvedThemeMode() {
  if (activeThemeMode === "system") {
    return systemPrefersDark() ? "dark" : "light";
  }
  return activeThemeMode === "dark" ? "dark" : "light";
}

function systemPrefersDark() {
  return Boolean(systemThemeQuery?.matches || window.matchMedia?.("(prefers-color-scheme: dark)").matches);
}

async function setThemeMode(mode, options = {}) {
  applyThemeMode(mode);
  if (!options.persist) {
    return;
  }
  try {
    await chrome.storage.local.set({ [THEME_STORAGE_KEY]: activeThemeMode });
  } catch (error) {
    console.warn("Failed to save theme mode", error);
  }
}

function bindSystemThemeListener() {
  if (!window.matchMedia) {
    return;
  }
  systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  systemThemeQuery.addEventListener?.("change", handleSystemThemeChange);
}

function handleSystemThemeChange() {
  if (activeThemeMode === "system") {
    applyThemeMode("system");
  } else {
    updateThemeSettingsUi();
  }
}

function defaultThemePaletteSettings() {
  return {
    palette: DEFAULT_THEME_PALETTE,
    custom: { ...DEFAULT_CUSTOM_THEME_COLORS }
  };
}

function normalizeThemePaletteSettings(value) {
  const fallback = defaultThemePaletteSettings();
  if (!value || typeof value !== "object") {
    return fallback;
  }
  const palette = value.palette === CUSTOM_THEME_PALETTE_ID || THEME_PALETTES.some((item) => item.id === value.palette)
    ? value.palette
    : DEFAULT_THEME_PALETTE;
  return {
    palette,
    custom: {
      light: normalizeColor(value.custom?.light, fallback.custom.light),
      dark: normalizeColor(value.custom?.dark, fallback.custom.dark)
    }
  };
}

function normalizeColor(value, fallback) {
  return /^#[\da-f]{6}$/i.test(String(value || "")) ? String(value).toLowerCase() : fallback;
}

function renderThemePalettePresets() {
  palettePresetGrid.replaceChildren(...THEME_PALETTES.map((palette) => {
    const button = document.createElement("button");
    button.className = "palette-preset-button";
    button.type = "button";
    button.dataset.palette = palette.id;
    button.setAttribute("role", "radio");
    button.innerHTML = `
      <span class="palette-swatch-pair" aria-hidden="true">
        <span style="background:${palette.light}"></span>
        <span style="background:${palette.dark}"></span>
      </span>
      <span class="palette-preset-name">${palette.label}</span>
    `;
    button.addEventListener("click", () => setThemePalette(palette.id, { persist: true }));
    return button;
  }));
}

async function setThemePalette(paletteId, options = {}) {
  activeThemePalette = paletteId === CUSTOM_THEME_PALETTE_ID || THEME_PALETTES.some((palette) => palette.id === paletteId)
    ? paletteId
    : DEFAULT_THEME_PALETTE;
  applyThemePalette();
  updateThemeSettingsUi();
  if (!options.persist) {
    return;
  }
  await saveThemePaletteSettings();
}

function applyThemePalette() {
  const colors = activeThemePalette === CUSTOM_THEME_PALETTE_ID
    ? activeCustomThemeColors
    : themePaletteById(activeThemePalette);
  setAccentVariables(colors.light, colors.dark);
}

function themePaletteById(paletteId) {
  return THEME_PALETTES.find((palette) => palette.id === paletteId) || THEME_PALETTES[0];
}

function setAccentVariables(lightColor, darkColor) {
  const rootStyle = document.documentElement.style;
  rootStyle.setProperty("--light-accent", lightColor);
  rootStyle.setProperty("--light-accent-strong", mixHexColors(lightColor, "#000000", 0.32));
  rootStyle.setProperty("--light-focus", mixHexColors(lightColor, "#2f82c4", 0.48));
  rootStyle.setProperty("--dark-accent", darkColor);
  rootStyle.setProperty("--dark-accent-strong", mixHexColors(darkColor, "#ffffff", 0.28));
  rootStyle.setProperty("--dark-focus", mixHexColors(darkColor, "#68b7f2", 0.4));
}

function mixHexColors(color, target, amount) {
  const sourceRgb = hexToRgb(color);
  const targetRgb = hexToRgb(target);
  const mixed = sourceRgb.map((channel, index) => {
    return Math.round(channel + (targetRgb[index] - channel) * amount);
  });
  return rgbToHex(mixed);
}

function hexToRgb(color) {
  const normalized = normalizeColor(color, "#000000").slice(1);
  return [0, 2, 4].map((start) => parseInt(normalized.slice(start, start + 2), 16));
}

function rgbToHex(channels) {
  return `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

async function handleCustomThemeColorInput() {
  activeThemePalette = CUSTOM_THEME_PALETTE_ID;
  activeCustomThemeColors = {
    light: normalizeColor(lightAccentInput.value, DEFAULT_CUSTOM_THEME_COLORS.light),
    dark: normalizeColor(darkAccentInput.value, DEFAULT_CUSTOM_THEME_COLORS.dark)
  };
  updateCustomThemeInputs();
  applyThemePalette();
  updateThemeSettingsUi();
  await saveThemePaletteSettings();
}

function updateCustomThemeInputs() {
  lightAccentInput.value = activeCustomThemeColors.light;
  darkAccentInput.value = activeCustomThemeColors.dark;
  lightAccentValue.value = activeCustomThemeColors.light;
  darkAccentValue.value = activeCustomThemeColors.dark;
}

async function saveThemePaletteSettings() {
  try {
    await chrome.storage.local.set({
      [THEME_PALETTE_STORAGE_KEY]: {
        palette: activeThemePalette,
        custom: activeCustomThemeColors
      }
    });
  } catch (error) {
    console.warn("Failed to save theme palette", error);
  }
}

function updateThemeSettingsUi() {
  document.querySelectorAll("[data-theme-mode]").forEach((button) => {
    const isActive = button.dataset.themeMode === activeThemeMode;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  palettePresetGrid.querySelectorAll(".palette-preset-button").forEach((button) => {
    const isActive = button.dataset.palette === activeThemePalette;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-checked", String(isActive));
  });
}

function toggleSettingsPanel() {
  if (settingsPanel.hidden) {
    openSettingsPanel();
    return;
  }
  closeSettingsPanel({ restoreFocus: true });
}

function openSettingsPanel() {
  closeSearchEngineMenu();
  window.clearTimeout(settingsPanelCloseTimer);
  settingsPanel.hidden = false;
  settingsPanel.dataset.open = "true";
  settingsButton.setAttribute("aria-expanded", "true");
  updateThemeSettingsUi();
}

function closeSettingsPanel(options = {}) {
  if (settingsPanel.hidden && settingsPanel.dataset.open !== "true") {
    return;
  }
  window.clearTimeout(settingsPanelCloseTimer);
  settingsPanel.dataset.open = "false";
  settingsButton.setAttribute("aria-expanded", "false");
  settingsPanelCloseTimer = window.setTimeout(() => {
    if (settingsPanel.dataset.open !== "true") {
      settingsPanel.hidden = true;
    }
  }, 180);
  if (options.restoreFocus) {
    settingsButton.focus({ preventScroll: true });
  }
}

function handleSettingsPanelDismiss(event) {
  if (settingsPanel.hidden) {
    return;
  }
  const target = event.target;
  if (target instanceof Element && (settingsPanel.contains(target) || settingsButton.contains(target))) {
    return;
  }
  closeSettingsPanel();
}

function handleQuickSearchSubmit(event) {
  event.preventDefault();
  submitQuickSearch();
}

function handleQuickSearchInputKeydown(event) {
  if (event.key !== "Enter" || event.isComposing) {
    return;
  }
  event.preventDefault();
  submitQuickSearch();
}

function submitQuickSearch() {
  const query = normalizeText(quickSearchInput.value);
  if (!query) {
    quickSearchInput.focus();
    return;
  }
  window.location.assign(quickSearchDestination(query));
}

function quickSearchDestination(query) {
  const localUrl = localhostUrl(query);
  if (localUrl) {
    return localUrl;
  }
  const directUrl = looksLikeUrl(query) ? normalizePortalUrl(query) : "";
  if (directUrl) {
    return directUrl;
  }

  const engine = searchEngineById(activeSearchEngine);
  const searchUrl = new URL(engine.searchUrl);
  searchUrl.searchParams.set(engine.queryParam, query);
  return searchUrl.href;
}

function looksLikeUrl(value) {
  return /^[a-z][a-z\d+.-]*:\/\//i.test(value)
    || /^[\w.-]+\.[a-z]{2,}(?:[/:?#]|$)/i.test(value)
    || /^localhost(?::\d+)?(?:[/?#]|$)/i.test(value);
}

function localhostUrl(value) {
  return /^localhost(?::\d+)?(?:[/?#]|$)/i.test(value)
    ? normalizePortalUrl(`http://${value}`)
    : "";
}

async function renderPortals() {
  const fragment = document.createDocumentFragment();
  const customPortals = await loadCustomPortals();
  const portalData = await loadBookmarkDrivenPortals(customPortals);
  const featuredPortals = featuredPortalItems(portalData.items);
  const groups = groupPortalsByCategory(portalData.items);
  const sectionOrder = await loadPortalSectionOrder();
  portalCategoriesExpanded = await loadPortalCategoriesExpanded();
  if (portalSourceText) {
    portalSourceText.textContent = t(portalData.usingBookmarks ? "portalSourceBookmarks" : "portalSourceFallback");
  }
  activePortalCategory = resolvedActivePortalCategory(groups);
  if (groups.length) {
    fragment.appendChild(createPortalCategoryTabs(groups, portalCategoriesExpanded));
  }
  const sectionByRole = new Map();
  if (featuredPortals.length) {
    sectionByRole.set("featured", createPortalCategorySection({
      category: "featured",
      items: featuredPortals,
      featured: true,
      reorderRole: "featured"
    }));
  }
  const activeGroup = groups.find((group) => group.category === activePortalCategory);
  if (activeGroup) {
    sectionByRole.set("active", createPortalCategorySection({
      ...activeGroup,
      active: true,
      reorderRole: "active"
    }));
  }
  sectionOrder.forEach((role) => {
    const section = sectionByRole.get(role);
    if (section) {
      fragment.appendChild(section);
    }
  });
  sectionByRole.forEach((section, role) => {
    if (!sectionOrder.includes(role)) {
      fragment.appendChild(section);
    }
  });
  if (portalData.recentItems.length) {
    fragment.appendChild(createPortalCategorySection({
      category: "recentBookmarks",
      items: portalData.recentItems,
      recent: true
    }));
  }
  portalGrid.replaceChildren(fragment);
}

async function loadPortalSectionOrder() {
  try {
    const result = await chrome.storage.local.get({ [PORTAL_SECTION_ORDER_STORAGE_KEY]: DEFAULT_PORTAL_SECTION_ORDER });
    const parsed = result[PORTAL_SECTION_ORDER_STORAGE_KEY];
    if (!Array.isArray(parsed)) {
      return DEFAULT_PORTAL_SECTION_ORDER.slice();
    }
    const order = parsed.filter((role) => DEFAULT_PORTAL_SECTION_ORDER.includes(role));
    return order.length ? order : DEFAULT_PORTAL_SECTION_ORDER.slice();
  } catch {
    return DEFAULT_PORTAL_SECTION_ORDER.slice();
  }
}

async function savePortalSectionOrder(order) {
  await chrome.storage.local.set({ [PORTAL_SECTION_ORDER_STORAGE_KEY]: order });
}

async function loadPortalCategoriesExpanded() {
  try {
    const result = await chrome.storage.local.get({ [PORTAL_CATEGORIES_EXPANDED_STORAGE_KEY]: false });
    return Boolean(result[PORTAL_CATEGORIES_EXPANDED_STORAGE_KEY]);
  } catch {
    return false;
  }
}

async function savePortalCategoriesExpanded(expanded) {
  await chrome.storage.local.set({ [PORTAL_CATEGORIES_EXPANDED_STORAGE_KEY]: Boolean(expanded) });
}

async function togglePortalCategoriesExpanded() {
  portalCategoriesExpanded = !portalCategoriesExpanded;
  applyPortalCategoryExpansionState(portalCategoriesExpanded);
  await savePortalCategoriesExpanded(portalCategoriesExpanded);
}

function applyPortalCategoryExpansionState(expanded) {
  const switcher = portalGrid.querySelector(".portal-category-switcher");
  const toggleButton = switcher?.querySelector(".portal-switcher-toggle");
  if (!switcher || !toggleButton) {
    return;
  }
  const hiddenCount = Number(switcher.dataset.hiddenCount || 0);
  const isCollapsible = hiddenCount > 0;
  switcher.classList.toggle("expanded", expanded || !isCollapsible);
  switcher.classList.toggle("collapsed", !expanded && isCollapsible);
  toggleButton.setAttribute("aria-expanded", String(expanded));
  toggleButton.querySelector(".portal-switcher-toggle-label").textContent = expanded
    ? t("portalCategoriesCollapse")
    : t("portalCategoriesExpand", { count: hiddenCount });
}

async function swapPortalSectionOrder(sourceRole, targetRole) {
  if (!sourceRole || !targetRole || sourceRole === targetRole) {
    return;
  }
  const order = await loadPortalSectionOrder();
  const sourceIndex = order.indexOf(sourceRole);
  const targetIndex = order.indexOf(targetRole);
  if (sourceIndex === -1 || targetIndex === -1) {
    return;
  }
  [order[sourceIndex], order[targetIndex]] = [order[targetIndex], order[sourceIndex]];
  await savePortalSectionOrder(order);
}

async function loadBookmarkDrivenPortals(customPortals) {
  const bookmarkData = await loadBookmarkPortalItems();
  const bookmarkItems = bookmarkData.items;
  const items = bookmarkItems.length
    ? mergePortalItems(customPortals, bookmarkItems)
    : mergePortalItems(customPortals, PORTALS);

  return {
    items,
    recentItems: bookmarkData.recentItems,
    usingBookmarks: bookmarkItems.length > 0
  };
}

async function loadBookmarkPortalItems() {
  if (!chrome.bookmarks?.getTree) {
    return {
      items: [],
      recentItems: []
    };
  }

  try {
    const [tree, historyItems] = await Promise.all([
      chrome.bookmarks.getTree(),
      loadBookmarkRankingHistory()
    ]);
    const entries = flattenBookmarkSites(tree);
    const historyStats = bookmarkHistoryStats(historyItems);
    return {
      items: bookmarkEntriesToPortalItems(entries, historyStats),
      recentItems: recentBookmarkPortalItems(entries)
    };
  } catch (error) {
    console.warn("Failed to load bookmark shortcuts", error);
    return {
      items: [],
      recentItems: []
    };
  }
}

async function loadBookmarkRankingHistory() {
  if (!chrome.history?.search) {
    return [];
  }
  try {
    return await chrome.history.search({
      text: "",
      startTime: Date.now() - 1000 * 60 * 60 * 24 * BOOKMARK_HISTORY_LOOKBACK_DAYS,
      maxResults: MAX_BOOKMARK_HISTORY_ITEMS
    });
  } catch {
    return [];
  }
}

function flattenBookmarkSites(nodes, parents = []) {
  const sites = [];

  for (const node of nodes || []) {
    const title = normalizeText(node.title);
    const pathParts = node.url ? parents : (title ? [...parents, title] : parents);
    if (node.url && isWebUrl(node.url)) {
      sites.push({
        bookmarkId: node.id,
        title,
        url: node.url,
        path: parents.join(" / "),
        dateAdded: Number(node.dateAdded || 0),
        dateLastUsed: Number(node.dateLastUsed || 0)
      });
      continue;
    }
    if (Array.isArray(node.children)) {
      sites.push(...flattenBookmarkSites(node.children, pathParts));
    }
  }

  return sites;
}

function bookmarkEntriesToPortalItems(entries, historyStats) {
  const bySite = new Map();

  for (const entry of entries) {
    const url = safeUrl(entry.url);
    const key = siteGroupKey(url);
    if (!key) {
      continue;
    }
    const history = historyStats.get(key) || {};
    const item = {
      bookmarkId: entry.bookmarkId,
      title: siteDisplayName(url, entry.title),
      url: siteHomeUrl(key, entry.url),
      category: bookmarkCategoryForEntry(entry, url),
      bookmarkPath: entry.path,
      dateAdded: entry.dateAdded,
      score: bookmarkPortalScore(entry, history)
    };
    const existing = bySite.get(key);
    if (!existing || item.score > existing.score) {
      bySite.set(key, item);
    }
  }

  return [...bySite.values()]
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, LOCALE))
    .slice(0, MAX_BOOKMARK_PORTAL_ITEMS);
}

function recentBookmarkPortalItems(entries) {
  const recent = [];
  const seen = new Set();

  for (const entry of [...entries].sort((a, b) => b.dateAdded - a.dateAdded)) {
    const url = safeUrl(entry.url);
    const key = siteGroupKey(url);
    if (!key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    recent.push({
      bookmarkId: entry.bookmarkId,
      title: siteDisplayName(url, entry.title),
      url: entry.url,
      category: "recentBookmarks",
      dateAdded: entry.dateAdded
    });
    if (recent.length >= MAX_RECENT_BOOKMARK_ITEMS) {
      break;
    }
  }

  return recent;
}

function bookmarkHistoryStats(historyItems) {
  const stats = new Map();

  for (const item of historyItems || []) {
    const url = safeUrl(item.url);
    const key = siteGroupKey(url);
    if (!key) {
      continue;
    }
    const current = stats.get(key) || {
      visits: 0,
      lastVisitTime: 0
    };
    current.visits += Math.max(1, Number(item.visitCount || 0));
    current.lastVisitTime = Math.max(current.lastVisitTime, Number(item.lastVisitTime || 0));
    stats.set(key, current);
  }

  return stats;
}

function bookmarkPortalScore(entry, history) {
  const savedAt = Math.max(Number(entry.dateAdded || 0), Number(entry.dateLastUsed || 0));
  return (Number(history.visits || 0) * 12)
    + recencyScore(Number(history.lastVisitTime || 0), BOOKMARK_HISTORY_LOOKBACK_DAYS) * 18
    + recencyScore(savedAt, 180) * 10
    + folderPriorityScore(entry.path);
}

function recencyScore(timestamp, days) {
  if (!timestamp) {
    return 0;
  }
  const age = Date.now() - Number(timestamp);
  if (!Number.isFinite(age) || age < 0) {
    return 1;
  }
  return Math.max(0, 1 - (age / (1000 * 60 * 60 * 24 * days)));
}

function folderPriorityScore(path) {
  const lower = normalizeText(path).toLowerCase();
  if (matchesAny(lower, ["书签栏", "favorites bar", "bookmarks bar", "toolbar", "常用", "快捷", "quick", "pinned"])) {
    return 18;
  }
  if (matchesAny(lower, ["work", "工作", "开发", "design", "效率", "productivity"])) {
    return 8;
  }
  return 0;
}

function bookmarkCategoryForEntry(entry, url) {
  const siteKey = siteGroupKey(url);
  const title = normalizeText(entry.title).toLowerCase();
  const path = normalizeText(entry.path).toLowerCase();
  const host = `${url.hostname} ${siteKey}`.toLowerCase();
  const combinedText = `${title} ${path}`.toLowerCase();
  const scores = new Map(PORTAL_CATEGORY_ORDER.map((category) => [category, 0]));
  const knownCategory = PORTAL_CATEGORY_BY_SITE_KEY[siteKey];
  if (knownCategory) {
    scores.set(knownCategory, (scores.get(knownCategory) || 0) + 80);
  }

  Object.entries(BOOKMARK_CATEGORY_RULES).forEach(([category, rule]) => {
    if (matchesAny(host, rule.hosts)) {
      scores.set(category, (scores.get(category) || 0) + 36);
    }
    if (matchesAny(title, rule.text)) {
      scores.set(category, (scores.get(category) || 0) + 18);
    }
    if (matchesAny(path, rule.text)) {
      scores.set(category, (scores.get(category) || 0) + 14);
    }
    if (matchesAny(combinedText, rule.hosts)) {
      scores.set(category, (scores.get(category) || 0) + 8);
    }
  });

  const [bestCategory, bestScore] = [...scores.entries()]
    .filter(([category]) => PORTAL_CATEGORY_ORDER.includes(category))
    .sort(([categoryA, scoreA], [categoryB, scoreB]) => (
      scoreB - scoreA || categoryOrderIndex(categoryA) - categoryOrderIndex(categoryB)
    ))[0] || ["other", 0];
  return bestScore > 0 ? bestCategory : "other";
}

function matchesAny(value, needles) {
  return needles.some((needle) => value.includes(String(needle).toLowerCase()));
}

function mergePortalItems(priorityItems, secondaryItems) {
  const seen = new Set();
  const merged = [];

  for (const item of [...priorityItems, ...secondaryItems]) {
    const key = siteGroupKey(safeUrl(item.url)) || normalizeText(item.url).toLowerCase();
    if (!key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    merged.push(item);
  }

  return merged;
}

function resolvedActivePortalCategory(groups) {
  if (groups.some((group) => group.category === activePortalCategory)) {
    return activePortalCategory;
  }
  if (groups.some((group) => group.category === DEFAULT_PORTAL_CATEGORY)) {
    return DEFAULT_PORTAL_CATEGORY;
  }
  return groups[0]?.category || DEFAULT_PORTAL_CATEGORY;
}

function createPortalCategoryTabs(groups, expanded) {
  const section = document.createElement("section");
  const header = document.createElement("header");
  const title = document.createElement("h3");
  const toggleButton = document.createElement("button");
  const toggleLabel = document.createElement("span");
  const toggleIcon = document.createElement("span");
  const nav = document.createElement("nav");
  const hiddenCount = Math.max(0, groups.length - COLLAPSED_PORTAL_CATEGORY_COUNT);
  const visibleRowCount = Math.ceil(Math.min(groups.length, COLLAPSED_PORTAL_CATEGORY_COUNT) / 2);
  const expandedRowCount = Math.ceil(groups.length / 2);
  const collapsedHeight = Math.max(42, visibleRowCount * 42 + Math.max(0, visibleRowCount - 1) * 8);
  const expandedHeight = Math.max(collapsedHeight, expandedRowCount * 42 + Math.max(0, expandedRowCount - 1) * 8);
  section.className = "portal-category-switcher";
  section.classList.toggle("expanded", expanded || hiddenCount === 0);
  section.classList.toggle("collapsed", !expanded && hiddenCount > 0);
  section.dataset.hiddenCount = String(hiddenCount);
  section.style.setProperty("--portal-tabs-collapsed-height", `${collapsedHeight}px`);
  section.style.setProperty("--portal-tabs-expanded-height", `${expandedHeight}px`);
  header.className = "portal-switcher-header";
  title.className = "portal-switcher-title";
  title.textContent = t("portalCategories");
  toggleButton.className = "portal-switcher-toggle";
  toggleButton.type = "button";
  toggleButton.hidden = hiddenCount === 0;
  toggleButton.setAttribute("aria-expanded", String(expanded));
  toggleLabel.className = "portal-switcher-toggle-label";
  toggleLabel.textContent = expanded ? t("portalCategoriesCollapse") : t("portalCategoriesExpand", { count: hiddenCount });
  toggleIcon.className = "portal-switcher-toggle-icon";
  toggleIcon.setAttribute("aria-hidden", "true");
  toggleIcon.innerHTML = chevronDownIcon();
  toggleButton.append(toggleLabel, toggleIcon);
  toggleButton.addEventListener("click", togglePortalCategoriesExpanded);
  nav.className = "portal-category-tabs";
  nav.setAttribute("aria-label", t("portalCategories"));
  header.append(title, toggleButton);

  groups.forEach((group, index) => {
    const button = document.createElement("button");
    const marker = document.createElement("span");
    const copy = document.createElement("span");
    const label = document.createElement("span");
    const meta = document.createElement("span");
    const count = document.createElement("span");
    const isActive = group.category === activePortalCategory;

    button.className = "portal-category-tab";
    button.dataset.category = group.category;
    if (index >= COLLAPSED_PORTAL_CATEGORY_COUNT) {
      button.dataset.overflow = "true";
    }
    button.classList.toggle("active", isActive);
    button.type = "button";
    button.setAttribute("aria-pressed", String(isActive));
    marker.className = "portal-category-marker";
    copy.className = "portal-category-copy";
    label.className = "portal-category-name";
    label.textContent = portalCategoryLabel(group.category);
    meta.className = "portal-category-meta";
    meta.textContent = t("portalCategoryItems", { count: group.items.length });
    count.className = "portal-category-tab-count";
    count.textContent = String(group.items.length);
    copy.append(label, meta);
    button.append(marker, copy, count);
    button.addEventListener("click", () => {
      activePortalCategory = group.category;
      renderPortals();
    });
    nav.appendChild(button);
  });

  section.append(header, nav);
  return section;
}

function featuredPortalItems(portals) {
  return portals.slice(0, MAX_PORTAL_FEATURED_ITEMS);
}

function groupPortalsByCategory(portals) {
  const groups = new Map();
  portals.forEach((portal) => {
    const category = portal.category || "other";
    if (!groups.has(category)) {
      groups.set(category, []);
    }
    groups.get(category).push(portal);
  });

  return [...groups.entries()]
    .sort(([categoryA], [categoryB]) => categoryOrderIndex(categoryA) - categoryOrderIndex(categoryB))
    .map(([category, items]) => ({ category, items }));
}

function categoryOrderIndex(category) {
  const index = PORTAL_CATEGORY_ORDER.indexOf(category);
  return index === -1 ? PORTAL_CATEGORY_ORDER.length : index;
}

function createPortalCategorySection(group) {
  const section = document.createElement("section");
  const header = document.createElement("header");
  const title = document.createElement("h3");
  const count = document.createElement("span");
  const grid = document.createElement("div");

  section.className = "portal-category";
  section.classList.toggle("featured-category", Boolean(group.featured));
  section.classList.toggle("active-category", Boolean(group.active));
  section.classList.toggle("recent-bookmark-category", Boolean(group.recent));
  header.className = "portal-category-header";
  if (group.reorderRole) {
    section.dataset.portalSectionRole = group.reorderRole;
    header.draggable = true;
    bindPortalSectionDrag(section, header, group.reorderRole);
  }
  title.className = "portal-category-title";
  title.textContent = portalCategoryLabel(group.category);
  count.className = "portal-category-count";
  count.textContent = String(group.items.length);
  grid.className = "portal-category-grid";
  group.items.slice(0, group.featured ? MAX_PORTAL_FEATURED_ITEMS : group.items.length).forEach((portal) => {
    grid.appendChild(createSiteCard(portal));
  });
  header.append(title, count);
  section.append(header, grid);
  return section;
}

function bindPortalSectionDrag(section, handle, role) {
  let lastDropPosition = "";
  handle.addEventListener("dragstart", (event) => {
    draggedPortalSectionRole = role;
    section.classList.add("dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", role);
  });
  handle.addEventListener("dragend", () => {
    draggedPortalSectionRole = "";
    clearPortalDropIndicators();
  });
  section.addEventListener("dragover", (event) => {
    if (!draggedPortalSectionRole || draggedPortalSectionRole === role) {
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    const rect = section.getBoundingClientRect();
    const before = event.clientY < rect.top + rect.height / 2;
    const nextPosition = before ? "before" : "after";
    if (section.classList.contains("drag-over") && lastDropPosition === nextPosition) {
      return;
    }
    lastDropPosition = nextPosition;
    clearPortalDropIndicators(section);
    section.classList.add("drag-over");
    section.classList.toggle("drop-before", before);
    section.classList.toggle("drop-after", !before);
  });
  section.addEventListener("dragleave", () => {
    lastDropPosition = "";
    section.classList.remove("drag-over", "drop-before", "drop-after");
  });
  section.addEventListener("drop", async (event) => {
    event.preventDefault();
    const sourceRole = event.dataTransfer.getData("text/plain") || draggedPortalSectionRole;
    lastDropPosition = "";
    section.classList.remove("drag-over", "drop-before", "drop-after");
    await swapPortalSectionOrder(sourceRole, role);
    renderPortals();
  });
}

function clearPortalDropIndicators(keepNode = null) {
  document.querySelectorAll(".portal-category.dragging, .portal-category.drag-over, .portal-category.drop-before, .portal-category.drop-after").forEach((node) => {
    if (node !== keepNode) {
      node.classList.remove("drag-over", "drop-before", "drop-after");
      if (!keepNode) {
        node.classList.remove("dragging");
      }
    }
  });
}

function portalCategoryLabel(category) {
  if (category === "featured") {
    return t("portalCategoryFeatured");
  }
  if (category === "recentBookmarks") {
    return t("portalCategoryRecentBookmarks");
  }
  const messageKey = `portalCategory${category.charAt(0).toUpperCase()}${category.slice(1)}`;
  return t(messageKey);
}

function populatePortalCategoryOptions() {
  portalCategorySelect.replaceChildren(...PORTAL_CATEGORY_ORDER.map((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = portalCategoryLabel(category);
    return option;
  }));
  portalCategorySelect.value = "custom";
}

function createSiteCard(site) {
  const node = siteCardTemplate.content.firstElementChild.cloneNode(true);
  const link = node.querySelector(".site-link");
  const icon = node.querySelector(".site-icon");
  const domain = node.querySelector(".site-domain");
  const removeButton = node.querySelector(".site-remove");
  link.href = site.url;
  applySiteIcon(icon, site);
  icon.alt = "";
  node.querySelector(".site-title").textContent = site.title;
  domain.textContent = compactSiteDomain(site.url);
  if (site.custom) {
    node.classList.add("custom");
    setButtonLabel(removeButton, t("deleteCustomPortal"));
    removeButton.innerHTML = trashIcon();
    removeButton.addEventListener("click", () => removeCustomPortal(site.id));
  } else {
    removeButton.remove();
  }
  return node;
}

function compactSiteDomain(url) {
  const parsedUrl = safeUrl(url);
  if (!parsedUrl) {
    return "";
  }
  return parsedUrl.hostname.replace(/^www\./, "");
}

function applySiteIcon(icon, site) {
  const localIcon = site.icon || localIconForUrl(site.url);
  if (localIcon) {
    icon.src = localIcon;
    icon.removeAttribute("srcset");
    bindFaviconFallback(icon, site, 128);
  } else {
    applyFaviconIcon(icon, site, 128);
  }
}

function localIconForUrl(url) {
  const parsedUrl = safeUrl(url);
  const siteKey = siteGroupKey(parsedUrl);
  return siteKey ? PORTAL_ICON_BY_SITE_KEY[siteKey] || "" : "";
}

function applyHistoryIcon(icon, site) {
  const localIcon = localIconForUrl(site.url);
  if (localIcon) {
    icon.src = localIcon;
    icon.removeAttribute("srcset");
    bindFaviconFallback(icon, site, 64);
  } else {
    applyFaviconIcon(icon, site, 64);
  }
}

function bindFaviconFallback(icon, site, size) {
  icon.addEventListener("error", () => {
    applyFaviconIcon(icon, site, size);
  }, { once: true });
}

function applyFaviconIcon(icon, site, size) {
  icon.src = faviconUrl(site.url, size);
  icon.srcset = `${faviconUrl(site.url, Math.max(16, size / 2))} 1x, ${faviconUrl(site.url, size)} 2x`;
  icon.addEventListener("error", () => {
    applyGeneratedFallbackIcon(icon, site);
  }, { once: true });
}

function showPortalForm() {
  portalForm.hidden = false;
  portalFormError.textContent = "";
  portalTitleInput.focus();
}

function hidePortalForm() {
  portalForm.hidden = true;
  portalForm.reset();
  portalFormError.textContent = "";
}

async function handlePortalSubmit(event) {
  event.preventDefault();
  portalFormError.textContent = "";

  const title = normalizeText(portalTitleInput.value).slice(0, MAX_PORTAL_TITLE_LENGTH);
  const url = normalizePortalUrl(portalUrlInput.value);
  const category = normalizePortalCategory(portalCategorySelect.value);

  if (!title) {
    portalFormError.textContent = t("portalNameRequired");
    portalTitleInput.focus();
    return;
  }

  if (!url) {
    portalFormError.textContent = t("portalUrlRequired");
    portalUrlInput.focus();
    return;
  }

  const customPortals = await loadCustomPortals();
  if (customPortals.length >= MAX_CUSTOM_PORTALS) {
    portalFormError.textContent = t("customPortalLimit", { count: MAX_CUSTOM_PORTALS });
    return;
  }

  customPortals.push({
    id: String(Date.now()),
    custom: true,
    title,
    url,
    category
  });
  try {
    await saveCustomPortals(customPortals);
    hidePortalForm();
    renderPortals();
  } catch {
    portalFormError.textContent = t("savePortalFailed");
  }
}

async function loadCustomPortals() {
  try {
    const result = await chrome.storage.local.get({ [CUSTOM_PORTALS_STORAGE_KEY]: [] });
    const parsed = result[CUSTOM_PORTALS_STORAGE_KEY];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .filter((portal) => portal?.custom && portal.title && isWebUrl(portal.url))
      .map((portal) => ({
        ...portal,
        category: normalizePortalCategory(portal.category)
      }));
  } catch (error) {
    console.warn("Failed to load custom portals", error);
    portalFormError.textContent = t("loadCustomPortalsFailed");
    return [];
  }
}

function normalizePortalCategory(category) {
  return PORTAL_CATEGORY_ORDER.includes(category) ? category : "custom";
}

async function saveCustomPortals(portals) {
  await chrome.storage.local.set({ [CUSTOM_PORTALS_STORAGE_KEY]: portals });
}

async function removeCustomPortal(id) {
  const nextPortals = (await loadCustomPortals()).filter((portal) => portal.id !== id);
  try {
    await saveCustomPortals(nextPortals);
    renderPortals();
  } catch {
    portalFormError.textContent = t("deletePortalFailed");
  }
}

async function renderSelectedBookmarkFolder() {
  try {
    clearBookmarkDeleteMode();
    const folderId = await loadSelectedBookmarkFolderId();
    if (!folderId) {
      renderBookmarkEmptyState(t("bookmarkNoFolder"));
      return;
    }

    const folder = await loadBookmarkFolder(folderId);
    if (!folder) {
      await saveSelectedBookmarkFolderId("");
      renderBookmarkEmptyState(t("bookmarkFolderMissing"));
      return;
    }

    const children = await chrome.bookmarks.getChildren(folder.id);
    const sites = children
      .filter((item) => item.url && isWebUrl(item.url))
      .map((item) => ({
        bookmarkId: item.id,
        title: siteDisplayName(safeUrl(item.url), item.title),
        url: item.url
      }));

    bookmarkFolderMeta.textContent = t("bookmarkMeta", {
      folder: folder.title || t("unnamedFolder"),
      count: sites.length
    });
    if (!sites.length) {
      bookmarkGrid.innerHTML = emptyState(t("bookmarkEmpty"));
      return;
    }

    const fragment = document.createDocumentFragment();
    sites.forEach((site) => {
      fragment.appendChild(createBookmarkSiteCard(site));
    });
    bookmarkGrid.replaceChildren(fragment);
  } catch (error) {
    console.warn("Failed to load bookmarks", error);
    renderBookmarkEmptyState(t("bookmarkReadFailed"));
  }
}

function renderBookmarkEmptyState(message) {
  bookmarkFolderMeta.textContent = "";
  bookmarkGrid.innerHTML = emptyState(message);
}

function createBookmarkSiteCard(site) {
  const node = createSiteCard(site);
  const deleteButton = document.createElement("button");

  node.classList.add("bookmark-site-card");
  deleteButton.className = "bookmark-delete-button";
  deleteButton.type = "button";
  deleteButton.innerHTML = `${trashIcon()}<span>${t("deleteBookmarkAction")}</span>`;
  deleteButton.setAttribute("aria-label", t("deleteBookmark", { title: site.title }));
  deleteButton.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await removeBookmarkSite(site);
  });
  node.appendChild(deleteButton);
  bindBookmarkLongPress(node, site);
  return node;
}

function bindBookmarkLongPress(node, site) {
  const link = node.querySelector(".site-link");
  let timer = 0;
  let suppressNextClick = false;

  const clearPressTimer = () => {
    if (timer) {
      clearTimeout(timer);
      timer = 0;
    }
  };

  const startPress = () => {
    if (node.classList.contains("delete-ready")) {
      return;
    }
    clearPressTimer();
    node.classList.add("pressing");
    timer = window.setTimeout(() => {
      node.classList.remove("pressing");
      suppressNextClick = true;
      showBookmarkDeleteMode(node);
    }, 700);
  };

  const cancelPress = () => {
    clearPressTimer();
    node.classList.remove("pressing");
  };

  link.addEventListener("pointerdown", startPress);
  link.addEventListener("pointerup", cancelPress);
  link.addEventListener("pointerleave", cancelPress);
  link.addEventListener("pointercancel", cancelPress);
  link.addEventListener("dragstart", cancelPress);
  link.addEventListener("click", (event) => {
    if (!node.classList.contains("delete-ready") && !suppressNextClick) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    suppressNextClick = false;
  });

  node.addEventListener("bookmark-delete-mode-clear", () => {
    suppressNextClick = false;
    clearPressTimer();
    node.classList.remove("pressing");
  });
}

function showBookmarkDeleteMode(node) {
  clearBookmarkDeleteMode();
  activeBookmarkDeleteCard = node;
  node.classList.add("delete-ready");
  const deleteButton = node.querySelector(".bookmark-delete-button");
  if (deleteButton) {
    deleteButton.style.display = "grid";
    deleteButton.focus({ preventScroll: true });
  }
}

function handleBookmarkDeleteDismiss(event) {
  if (!activeBookmarkDeleteCard) {
    return;
  }
  const target = event.target;
  if (target instanceof Element && activeBookmarkDeleteCard.contains(target)) {
    return;
  }
  clearBookmarkDeleteMode();
}

function handleBookmarkDeleteEscape(event) {
  if (event.key === "Escape") {
    clearBookmarkDeleteMode();
  }
}

function clearBookmarkDeleteMode() {
  if (!activeBookmarkDeleteCard) {
    return;
  }
  const node = activeBookmarkDeleteCard;
  activeBookmarkDeleteCard = null;
  node.classList.remove("delete-ready");
  if (document.activeElement instanceof Element && node.contains(document.activeElement)) {
    document.activeElement.blur();
  }
  const deleteButton = node.querySelector(".bookmark-delete-button");
  if (deleteButton) {
    deleteButton.style.display = "";
  }
  node.dispatchEvent(new CustomEvent("bookmark-delete-mode-clear"));
}

async function removeBookmarkSite(site) {
  if (!site.bookmarkId) {
    clearBookmarkDeleteMode();
    return;
  }
  try {
    await chrome.bookmarks.remove(site.bookmarkId);
    await renderSelectedBookmarkFolder();
  } catch (error) {
    console.warn("Failed to remove bookmark", error);
    renderBookmarkTransientMessage(t("deleteBookmarkFailed"));
    renderSelectedBookmarkFolder();
  }
}

function renderBookmarkTransientMessage(message) {
  bookmarkFolderMeta.textContent = message;
}

function bindBookmarkChangeEvents() {
  chrome.bookmarks.onCreated.addListener(requestBookmarkRefresh);
  chrome.bookmarks.onRemoved.addListener(requestBookmarkRefresh);
  chrome.bookmarks.onChanged.addListener(requestBookmarkRefresh);
  chrome.bookmarks.onMoved.addListener(requestBookmarkRefresh);
  chrome.bookmarks.onChildrenReordered.addListener(requestBookmarkRefresh);
  chrome.bookmarks.onImportEnded.addListener(requestBookmarkRefresh);
}

function requestBookmarkRefresh() {
  clearTimeout(bookmarkRefreshTimer);
  bookmarkRefreshTimer = window.setTimeout(() => {
    renderPortals();
    if (bookmarkPicker.hidden) {
      renderSelectedBookmarkFolder();
      return;
    }
    openBookmarkPicker();
  }, 120);
}

async function openBookmarkPicker() {
  bookmarkMainView.hidden = true;
  bookmarkPicker.hidden = false;
  bookmarkFolderList.innerHTML = emptyState(t("loadingBookmarkFolders"));

  try {
    const tree = await chrome.bookmarks.getTree();
    const selectedId = await loadSelectedBookmarkFolderId();
    const folders = flattenBookmarkFolders(tree);
    renderBookmarkFolderOptions(folders, selectedId);
  } catch (error) {
    console.warn("Failed to open bookmark picker", error);
    bookmarkFolderList.innerHTML = emptyState(t("bookmarkFolderReadFailed"));
  }
}

function closeBookmarkPicker() {
  bookmarkPicker.hidden = true;
  bookmarkMainView.hidden = false;
}

function renderBookmarkFolderOptions(folders, selectedId) {
  const visibleFolders = folders
    .filter((folder) => folder.bookmarkCount > 0)
    .slice(0, MAX_BOOKMARK_FOLDER_OPTIONS);

  if (!visibleFolders.length) {
    bookmarkFolderList.innerHTML = emptyState(t("noBookmarkFolders"));
    return;
  }

  const fragment = document.createDocumentFragment();
  visibleFolders.forEach((folder) => {
    const option = document.createElement("button");
    const title = document.createElement("strong");
    const path = document.createElement("span");
    const count = document.createElement("span");

    option.className = "bookmark-folder-option";
    option.classList.toggle("active", folder.id === selectedId);
    option.type = "button";
    title.textContent = folder.title || t("unnamedFolder");
    path.textContent = folder.path;
    count.textContent = `${folder.bookmarkCount}`;
    count.title = t("bookmarkCount", { count: folder.bookmarkCount });
    option.append(title, path, count);
    option.addEventListener("click", () => selectBookmarkFolder(folder.id));
    fragment.appendChild(option);
  });

  bookmarkFolderList.replaceChildren(fragment);
}

async function selectBookmarkFolder(folderId) {
  await saveSelectedBookmarkFolderId(folderId);
  closeBookmarkPicker();
  renderSelectedBookmarkFolder();
}

function flattenBookmarkFolders(nodes, parents = []) {
  const folders = [];

  for (const node of nodes || []) {
    const isFolder = !node.url;
    const title = normalizeText(node.title);
    const pathParts = title ? [...parents, title] : parents;
    if (isFolder && Array.isArray(node.children)) {
      const bookmarkCount = node.children.filter((child) => child.url && isWebUrl(child.url)).length;
      if (node.id !== "0") {
        folders.push({
          id: node.id,
          title,
          path: pathParts.join(" / ") || t("bookmarkRoot"),
          bookmarkCount
        });
      }
      folders.push(...flattenBookmarkFolders(node.children, pathParts));
    }
  }

  return folders;
}

async function loadBookmarkFolder(folderId) {
  try {
    const [folder] = await chrome.bookmarks.get(folderId);
    if (!folder || folder.url) {
      return null;
    }
    return folder;
  } catch {
    return null;
  }
}

async function loadSelectedBookmarkFolderId() {
  const result = await chrome.storage.local.get({ [BOOKMARK_FOLDER_STORAGE_KEY]: "" });
  return String(result[BOOKMARK_FOLDER_STORAGE_KEY] || "");
}

async function saveSelectedBookmarkFolderId(folderId) {
  await chrome.storage.local.set({ [BOOKMARK_FOLDER_STORAGE_KEY]: folderId });
}

async function refreshHistory() {
  try {
    const oneWeekAgo = Date.now() - 1000 * 60 * 60 * 24 * 7;
    const [items, pinnedItems] = await Promise.all([
      chrome.history.search({
        text: "",
        startTime: oneWeekAgo,
        maxResults: 80
      }),
      loadPinnedHistory()
    ]);
    const pinnedKeys = new Set(pinnedItems.map((item) => normalizeHistoryKey(item.url)));
    const recentItems = dedupeHistory(items)
      .filter((item) => !pinnedKeys.has(normalizeHistoryKey(item.url)));
    renderPinnedHistory(pinnedItems);
    renderHistory(groupHistoryBySite(recentItems));
  } catch (error) {
    pinnedGrid.innerHTML = "";
    historyGrid.innerHTML = emptyState(t("historyReadFailed"));
  }
}

function dedupeHistory(items) {
  const seen = new Set();
  const filtered = [];

  for (const item of items) {
    const url = safeUrl(item.url);
    const key = normalizeHistoryKey(item.url);
    if (!url || !/^https?:$/.test(url.protocol) || !key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    filtered.push(item);
  }

  return filtered;
}

function renderPinnedHistory(items) {
  if (!items.length) {
    pinnedGrid.innerHTML = emptyState(t("noPinnedItems"));
    return;
  }

  const fragment = document.createDocumentFragment();
  const groups = groupHistoryBySite(items, {
    maxGroups: MAX_PINNED_HISTORY_ITEMS,
    maxPagesPerSite: MAX_PINNED_HISTORY_ITEMS
  });

  groups.forEach((group) => {
    fragment.appendChild(createHistorySiteGroup(group, { pinned: true }));
  });
  pinnedGrid.replaceChildren(fragment);
}

function renderHistory(groups) {
  if (!groups.length) {
    historyGrid.innerHTML = emptyState(t("noHistoryItems"));
    return;
  }

  const fragment = document.createDocumentFragment();
  groups.forEach((group) => {
    fragment.appendChild(createHistoryFeedGroup(group));
  });

  historyGrid.replaceChildren(fragment);
}

function groupHistoryBySite(items, options = {}) {
  const maxGroups = options.maxGroups || MAX_HISTORY_SITE_GROUPS;
  const maxPagesPerSite = options.maxPagesPerSite || MAX_HISTORY_PAGES_PER_SITE;
  const groups = new Map();

  for (const item of items) {
    const url = safeUrl(item.url);
    const key = siteGroupKey(url);
    if (!key) {
      continue;
    }
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        name: siteDisplayName(url, item.title),
        url: item.url,
        homeUrl: siteHomeUrl(key, item.url),
        pages: [],
        pageKeys: new Set(),
        deleteUrls: [],
        deleteUrlKeys: new Set()
      });
    }
    const group = groups.get(key);
    const deleteUrl = normalizeHistoryDeleteUrl(item.url);
    const deleteKey = deleteUrl;
    if (deleteKey && !group.deleteUrlKeys.has(deleteKey)) {
      group.deleteUrlKeys.add(deleteKey);
      group.deleteUrls.push(deleteUrl);
    }
    const pageKey = historyPageKey(item, url, key);
    if (!group.pageKeys.has(pageKey) && group.pages.length < maxPagesPerSite) {
      group.pageKeys.add(pageKey);
      group.pages.push(item);
    }
  }

  return [...groups.values()]
    .map(({ pageKeys, deleteUrlKeys, ...group }) => group)
    .slice(0, maxGroups);
}

function createHistorySiteGroup(group, options = {}) {
  const card = document.createElement("section");
  const header = document.createElement("div");
  const homeLink = document.createElement("a");
  const icon = document.createElement("img");
  const name = document.createElement("strong");
  const count = document.createElement("span");
  const list = document.createElement("div");
  const isPinned = Boolean(options.pinned);
  const singlePinnedPage = isPinned && group.pages.length === 1 ? group.pages[0] : null;
  const singlePinnedTitle = singlePinnedPage
    ? (normalizeText(singlePinnedPage.title) || historyFallbackTitle(safeUrl(singlePinnedPage.url)))
    : "";
  const isSinglePinnedDuplicate = isPinned
    && group.pages.length === 1
    && singlePinnedTitle === normalizeText(group.name);
  const homeHref = isSinglePinnedDuplicate
    ? singlePinnedPage.url
    : (group.homeUrl || siteHomeUrl(group.key, group.url));
  const homeLabel = isSinglePinnedDuplicate
    ? t("openPage", { title: singlePinnedTitle })
    : t("openSiteHome", { name: group.name });

  card.className = "history-site-group";
  card.classList.toggle("pinned", isPinned);
  card.classList.toggle("single-page-duplicate", isSinglePinnedDuplicate);
  header.className = "history-site-header";
  homeLink.className = "history-site-home";
  homeLink.href = homeHref;
  homeLink.target = "_blank";
  homeLink.rel = "noopener noreferrer";
  homeLink.title = homeLabel;
  homeLink.setAttribute("aria-label", homeLabel);
  icon.className = "history-site-logo";
  applyHistoryIcon(icon, {
    title: group.name,
    url: group.homeUrl || group.url
  });
  icon.alt = "";
  name.className = "history-site-name";
  name.textContent = group.name;
  count.className = "history-site-count";
  count.textContent = String(group.pages.length);
  count.title = t("pageCount", { count: group.pages.length });
  list.className = "history-page-list";

  group.pages.forEach((item) => {
    list.appendChild(createHistoryPageItem(item, options));
  });

  homeLink.append(icon, name);
  header.append(homeLink, count);
  card.append(header, list);
  return card;
}

function createHistoryPageItem(item, options = {}) {
  const url = safeUrl(item.url);
  const title = normalizeText(item.title) || historyFallbackTitle(url);
  const row = document.createElement("div");
  const time = document.createElement("time");
  const timelineCard = document.createElement("span");
  const link = document.createElement("a");
  const label = document.createElement("span");
  const actions = document.createElement("span");
  const pinButton = document.createElement("button");
  const deleteButton = document.createElement("button");
  const isPinned = Boolean(options.pinned);
  const showTimeline = Boolean(options.timeline);

  row.className = "history-page-item";
  row.classList.toggle("timeline", showTimeline);
  if (showTimeline) {
    time.className = "history-page-time";
    time.dateTime = historyDateTimeAttribute(item.lastVisitTime);
    time.textContent = formatHistoryAnchorTime(item.lastVisitTime);
    time.title = formatHistoryFullTime(item.lastVisitTime);
  }
  link.className = "history-page-link";
  link.href = item.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.title = title;
  link.setAttribute("aria-label", t("openPage", { title }));
  link.textContent = title;
  if (options.label) {
    label.className = "history-page-label";
    label.textContent = options.label;
    link.prepend(label);
  }
  pinButton.className = "history-page-pin";
  pinButton.classList.toggle("active", isPinned);
  pinButton.type = "button";
  pinButton.innerHTML = historyPinIcon(isPinned);
  pinButton.title = isPinned ? t("unpin") : t("pin");
  pinButton.setAttribute("aria-label", `${isPinned ? t("unpin") : t("pin")} ${title}`);
  pinButton.addEventListener("click", () => {
    if (isPinned) {
      unpinHistoryItem(item.url);
      return;
    }
    pinHistoryItem(item);
  });

  deleteButton.className = "history-page-delete";
  deleteButton.type = "button";
  deleteButton.innerHTML = trashIcon();
  deleteButton.title = t("deleteHistory", { title });
  deleteButton.setAttribute("aria-label", t("deleteHistory", { title }));
  deleteButton.addEventListener("click", () => deleteHistoryItem(item.url));

  actions.className = "history-page-actions";
  actions.append(pinButton, deleteButton);
  if (showTimeline) {
    timelineCard.className = "history-page-card";
    timelineCard.append(link, actions);
    row.append(time, timelineCard);
  } else {
    row.append(link, actions);
  }
  return row;
}

function createHistoryFeedGroup(group) {
  const item = group.pages[0];
  const title = normalizeText(item?.title) || historyFallbackTitle(safeUrl(group.url));
  const row = document.createElement("article");
  const homeLink = document.createElement("a");
  const icon = document.createElement("img");
  const copy = document.createElement("span");
  const name = document.createElement("strong");
  const pageLink = document.createElement("a");
  const meta = document.createElement("span");
  const summary = document.createElement("div");
  const actions = document.createElement("span");
  const expandButton = document.createElement("button");
  const pinButton = document.createElement("button");
  const deleteButton = document.createElement("button");
  const pageList = document.createElement("div");
  const pageListInner = document.createElement("div");
  const relatedPages = group.pages.slice(1);
  const isExpandable = relatedPages.length > 0;

  row.className = "history-feed-item";
  row.classList.toggle("expandable", isExpandable);
  row.addEventListener("click", (event) => {
    const target = event.target;
    if (!isExpandable || (target instanceof Element && target.closest("a, button"))) {
      return;
    }
    toggleHistoryFeedGroup(row);
  });
  homeLink.className = "history-feed-home";
  homeLink.href = group.homeUrl || siteHomeUrl(group.key, group.url);
  homeLink.target = "_blank";
  homeLink.rel = "noopener noreferrer";
  homeLink.title = t("openSiteHome", { name: group.name });
  homeLink.setAttribute("aria-label", t("openSiteHome", { name: group.name }));
  icon.className = "history-site-logo";
  applyHistoryIcon(icon, {
    title: group.name,
    url: group.homeUrl || group.url
  });
  icon.alt = "";
  homeLink.appendChild(icon);

  copy.className = "history-feed-copy";
  name.className = "history-site-name";
  name.textContent = group.name;
  pageLink.className = "history-page-link history-feed-page-link";
  pageLink.href = item?.url || group.url;
  pageLink.target = "_blank";
  pageLink.rel = "noopener noreferrer";
  pageLink.title = title;
  pageLink.setAttribute("aria-label", t("openPage", { title }));
  pageLink.textContent = group.name;
  meta.className = "history-feed-meta";
  meta.textContent = [
    group.pages.length > 1
      ? t("historySitePageMeta", { count: group.pages.length })
      : compactHistoryUrl(safeUrl(item?.url || group.url)),
    formatHistoryTime(item?.lastVisitTime)
  ].filter(Boolean).join(" · ");
  copy.append(isExpandable ? name : pageLink, meta);

  expandButton.className = "history-feed-expand";
  expandButton.type = "button";
  expandButton.innerHTML = chevronDownIcon();
  expandButton.title = t("historyExpandPages", { count: relatedPages.length });
  expandButton.setAttribute("aria-label", t("historyExpandPages", { count: relatedPages.length }));
  expandButton.setAttribute("aria-expanded", "false");
  expandButton.setAttribute("aria-hidden", String(!isExpandable));
  expandButton.tabIndex = isExpandable ? 0 : -1;
  expandButton.disabled = !isExpandable;
  expandButton.addEventListener("click", () => toggleHistoryFeedGroup(row));

  pinButton.className = "history-page-pin";
  pinButton.type = "button";
  pinButton.innerHTML = historyPinIcon(false);
  pinButton.title = t("pin");
  pinButton.setAttribute("aria-label", `${t("pin")} ${title}`);
  pinButton.addEventListener("click", () => pinHistoryItem(item || {
    title,
    url: group.url
  }));

  deleteButton.className = "history-page-delete";
  deleteButton.type = "button";
  deleteButton.innerHTML = trashIcon();
  deleteButton.title = t("deleteHistory", { title: group.name });
  deleteButton.setAttribute("aria-label", t("deleteHistory", { title: group.name }));
  deleteButton.addEventListener("click", () => deleteHistoryGroup(group));

  pageList.className = "history-feed-pages";
  pageList.id = `history-feed-pages-${group.key.replace(/[^a-z0-9_-]+/gi, "-")}`;
  pageList.dataset.relatedCount = String(relatedPages.length);
  pageList.setAttribute("aria-hidden", "true");
  pageList.inert = true;
  pageListInner.className = "history-feed-pages-inner";
  pageList.appendChild(pageListInner);
  if (isExpandable) {
    const listTitle = document.createElement("span");
    listTitle.className = "history-feed-pages-title";
    listTitle.textContent = t("historyRelatedPages");
    pageListInner.appendChild(listTitle);
    pageListInner.appendChild(createHistoryPageItem(item, {
      label: t("historyPrimaryPage"),
      timeline: true
    }));
    relatedPages.forEach((relatedItem) => {
      pageListInner.appendChild(createHistoryPageItem(relatedItem, { timeline: true }));
    });
  }

  actions.className = "history-feed-actions";
  actions.appendChild(expandButton);
  if (isExpandable) {
    expandButton.setAttribute("aria-controls", pageList.id);
    requestAnimationFrame(() => {
      pageList.style.setProperty("--history-feed-pages-height", `${pageListInner.scrollHeight}px`);
    });
  }
  actions.append(pinButton, deleteButton);
  summary.className = "history-feed-summary";
  summary.append(homeLink, copy, actions);
  row.append(summary, pageList);
  return row;
}

function toggleHistoryFeedGroup(row) {
  const isExpanded = row.classList.toggle("expanded");
  const button = row.querySelector(".history-feed-expand");
  const pageList = row.querySelector(".history-feed-pages");
  if (button) {
    const count = Number(pageList?.dataset.relatedCount || 0);
    button.setAttribute("aria-expanded", String(isExpanded));
    button.title = isExpanded ? t("historyCollapsePages") : t("historyExpandPages", { count });
    button.setAttribute("aria-label", isExpanded ? t("historyCollapsePages") : t("historyExpandPages", { count }));
  }
  if (pageList) {
    pageList.setAttribute("aria-hidden", String(!isExpanded));
    pageList.inert = !isExpanded;
  }
}

function formatHistoryTime(timestamp) {
  const time = Number(timestamp);
  if (!Number.isFinite(time) || time <= 0) {
    return "";
  }
  const visitDate = new Date(time);
  const now = Date.now();
  const minutesAgo = Math.max(0, Math.round((now - time) / 60000));
  if (minutesAgo < 1) {
    return t("historyJustNow");
  }
  if (minutesAgo < 60) {
    return t("historyMinutesAgo", { count: minutesAgo });
  }
  if (minutesAgo < 60 * 24) {
    return t("historyHoursAgo", { count: Math.floor(minutesAgo / 60) });
  }
  return new Intl.DateTimeFormat(LOCALE, {
    month: "numeric",
    day: "numeric"
  }).format(visitDate);
}

function formatHistoryAnchorTime(timestamp) {
  const time = Number(timestamp);
  if (!Number.isFinite(time) || time <= 0) {
    return "--:--";
  }
  return new Intl.DateTimeFormat(LOCALE, {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(time));
}

function formatHistoryFullTime(timestamp) {
  const time = Number(timestamp);
  if (!Number.isFinite(time) || time <= 0) {
    return "";
  }
  return new Intl.DateTimeFormat(LOCALE, {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(time));
}

function historyDateTimeAttribute(timestamp) {
  const time = Number(timestamp);
  if (!Number.isFinite(time) || time <= 0) {
    return "";
  }
  return new Date(time).toISOString();
}

async function loadPinnedHistory() {
  try {
    const result = await chrome.storage.local.get({ [PINNED_HISTORY_STORAGE_KEY]: [] });
    const parsed = result[PINNED_HISTORY_STORAGE_KEY];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .filter((item) => item?.url && isWebUrl(item.url))
      .sort((a, b) => Number(b.pinnedAt || 0) - Number(a.pinnedAt || 0))
      .slice(0, MAX_PINNED_HISTORY_ITEMS);
  } catch (error) {
    console.warn("Failed to load pinned history", error);
    return [];
  }
}

async function savePinnedHistory(items) {
  await chrome.storage.local.set({ [PINNED_HISTORY_STORAGE_KEY]: items.slice(0, MAX_PINNED_HISTORY_ITEMS) });
}

async function pinHistoryItem(item) {
  try {
    const key = normalizeHistoryKey(item.url);
    if (!key) {
      return;
    }
    const pinnedItems = await loadPinnedHistory();
    const nextItems = [
      {
        url: item.url,
        title: normalizeText(item.title),
        pinnedAt: Date.now()
      },
      ...pinnedItems.filter((pinnedItem) => normalizeHistoryKey(pinnedItem.url) !== key)
    ];
    await savePinnedHistory(nextItems);
    refreshHistory();
  } catch (error) {
    console.warn("Failed to pin history item", error);
  }
}

async function unpinHistoryItem(url) {
  try {
    const key = normalizeHistoryKey(url);
    const nextItems = (await loadPinnedHistory()).filter((item) => normalizeHistoryKey(item.url) !== key);
    await savePinnedHistory(nextItems);
    refreshHistory();
  } catch (error) {
    console.warn("Failed to unpin history item", error);
  }
}

async function deleteHistoryItem(url) {
  const deleteUrl = normalizeHistoryDeleteUrl(url);
  if (!deleteUrl) {
    return;
  }
  await deleteHistoryUrls([deleteUrl]);
}

async function deleteHistoryGroup(group) {
  const urls = Array.isArray(group.deleteUrls) && group.deleteUrls.length
    ? group.deleteUrls
    : group.pages.map((item) => normalizeHistoryDeleteUrl(item.url)).filter(Boolean);
  await deleteHistoryUrls(urls, group.key);
}

async function deleteHistoryUrls(urls, siteKey = "") {
  const uniqueUrls = [...new Set(urls.map(normalizeHistoryDeleteUrl).filter(Boolean))];
  if (!uniqueUrls.length) {
    return;
  }
  try {
    await Promise.all(uniqueUrls.map((url) => chrome.history.deleteUrl({ url })));
    const deletedKeys = new Set(uniqueUrls.map(normalizeHistoryKey).filter(Boolean));
    const nextPinnedItems = (await loadPinnedHistory()).filter((item) => {
      if (deletedKeys.has(normalizeHistoryKey(item.url))) {
        return false;
      }
      return !siteKey || siteGroupKey(safeUrl(item.url)) !== siteKey;
    });
    await savePinnedHistory(nextPinnedItems);
    refreshHistory();
  } catch (error) {
    console.warn("Failed to delete history item", error);
    renderHistoryTransientMessage(t("deleteHistoryFailed"));
  }
}

function renderHistoryTransientMessage(message) {
  const previousMessage = document.querySelector(".history-transient-message");
  if (previousMessage) {
    previousMessage.remove();
  }
  const messageNode = document.createElement("p");
  messageNode.className = "history-transient-message";
  messageNode.textContent = message;
  document.querySelector(".recent-group")?.prepend(messageNode);
  window.setTimeout(() => {
    messageNode.remove();
  }, 2400);
}

function inlineIcon(markup) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${markup.trim()}</svg>`;
}

function historyPinIcon(active) {
  if (active) {
    return inlineIcon(`
      <path d="M12 17v5"></path>
      <path d="M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89"></path>
      <path d="m2 2 20 20"></path>
      <path d="M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11"></path>
    `);
  }
  return inlineIcon(`
    <path d="M12 17v5"></path>
    <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"></path>
  `);
}

function plusIcon() {
  return inlineIcon(`
    <path d="M12 5v14"></path>
    <path d="M5 12h14"></path>
  `);
}

function refreshIcon() {
  return inlineIcon(`
    <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8"></path>
    <path d="M21 3v5h-5"></path>
    <path d="M21 12a9 9 0 0 1-15.5 6.2L3 16"></path>
    <path d="M3 21v-5h5"></path>
  `);
}

function listIcon() {
  return inlineIcon(`
    <line x1="8" x2="21" y1="6" y2="6"></line>
    <line x1="8" x2="21" y1="12" y2="12"></line>
    <line x1="8" x2="21" y1="18" y2="18"></line>
    <line x1="3" x2="3.01" y1="6" y2="6"></line>
    <line x1="3" x2="3.01" y1="12" y2="12"></line>
    <line x1="3" x2="3.01" y1="18" y2="18"></line>
  `);
}

function gridIcon() {
  return inlineIcon(`
    <rect width="7" height="7" x="3" y="3" rx="1"></rect>
    <rect width="7" height="7" x="14" y="3" rx="1"></rect>
    <rect width="7" height="7" x="14" y="14" rx="1"></rect>
    <rect width="7" height="7" x="3" y="14" rx="1"></rect>
  `);
}

function folderPlusIcon() {
  return inlineIcon(`
    <path d="M12 10v6"></path>
    <path d="M9 13h6"></path>
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
  `);
}

function settingsIcon() {
  return inlineIcon(`
    <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path>
    <circle cx="12" cy="12" r="3"></circle>
  `);
}

function closeIcon() {
  return inlineIcon(`
    <path d="M18 6 6 18"></path>
    <path d="m6 6 12 12"></path>
  `);
}

function trashIcon() {
  return inlineIcon(`
    <path d="M10 11v6"></path>
    <path d="M14 11v6"></path>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
    <path d="M3 6h18"></path>
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  `);
}

function emptyStateIcon() {
  return inlineIcon(`
    <path d="M22 12h-6l-2 3h-4l-2-3H2"></path>
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z"></path>
  `);
}

function chevronDownIcon() {
  return inlineIcon(`
    <path d="m7 9.5 5 5 5-5"></path>
  `);
}

function faviconUrl(url, size) {
  const favicon = new URL(chrome.runtime.getURL("/_favicon/"));
  favicon.searchParams.set("pageUrl", url || "https://www.google.com");
  favicon.searchParams.set("size", String(size));
  return favicon.toString();
}

function compactHistoryUrl(url) {
  if (!url) {
    return "";
  }
  const host = url.hostname.replace(/^www\./, "");
  const path = `${url.pathname}${url.search}`.replace(/\/$/, "");
  return `${host}${path}`.slice(0, 120);
}

function historyFallbackTitle(url) {
  if (!url) {
    return t("unnamedPage");
  }
  const path = `${url.pathname}${url.search}`.replace(/\/$/, "");
  return path && path !== "/" ? path : (url.hostname.replace(/^www\./, "") || t("unnamedPage"));
}

function siteGroupKey(url) {
  if (!url || !/^https?:$/.test(url.protocol)) {
    return "";
  }
  return canonicalSiteHost(url.hostname);
}

function siteHomeUrl(siteKey, fallbackUrl) {
  const fallback = safeUrl(fallbackUrl);
  const key = normalizeHostname(siteKey);
  if (HOME_URL_BY_KEY[key]) {
    return HOME_URL_BY_KEY[key];
  }
  if (fallback && /^https?:$/.test(fallback.protocol)) {
    return `${fallback.origin}/`;
  }
  if (!key) {
    return "https://www.google.com/";
  }
  return `https://${key}/`;
}

function siteDisplayName(url, title) {
  const key = siteGroupKey(url);
  if (SITE_NAME_BY_KEY[key]) {
    return SITE_NAME_BY_KEY[key];
  }

  const fromTitle = siteNameFromTitle(title);
  if (fromTitle) {
    return fromTitle;
  }

  return readableHostName(key);
}

function canonicalSiteHost(hostname) {
  const host = normalizeHostname(hostname);
  if (!host) {
    return "";
  }
  if (SITE_GROUP_OVERRIDES[host]) {
    return SITE_GROUP_OVERRIDES[host];
  }

  const bareHost = host.replace(/^(www|m|mobile)\./, "");
  if (SITE_GROUP_OVERRIDES[bareHost]) {
    return SITE_GROUP_OVERRIDES[bareHost];
  }

  const matchedSuffix = SITE_GROUP_SUFFIXES.find((suffix) => (
    bareHost === suffix || bareHost.endsWith(`.${suffix}`)
  ));
  if (matchedSuffix) {
    return matchedSuffix === "twitter.com" ? "x.com" : matchedSuffix;
  }

  return registrableDomain(bareHost);
}

function normalizeHostname(hostname) {
  return String(hostname || "")
    .trim()
    .replace(/\.$/, "")
    .toLowerCase();
}

function registrableDomain(hostname) {
  const parts = hostname.split(".").filter(Boolean);
  if (parts.length <= 2) {
    return hostname;
  }

  const suffix = parts.slice(-2).join(".");
  if (MULTIPART_PUBLIC_SUFFIXES.has(suffix) && parts.length >= 3) {
    return parts.slice(-3).join(".");
  }
  return parts.slice(-2).join(".");
}

function historyPageKey(item, url, siteKey) {
  const title = normalizeText(item.title);
  if (!title) {
    return `url:${normalizeHistoryKey(item.url) || `${siteKey}${url?.pathname || ""}`}`;
  }

  return `title:${normalizeHistoryTitleKey(title, siteKey)}`;
}

function normalizeHistoryTitleKey(title, siteKey) {
  let normalized = normalizeText(title).toLowerCase();
  const siteNames = [
    SITE_NAME_BY_KEY[siteKey],
    readableHostName(siteKey),
    siteKey
  ]
    .filter(Boolean)
    .map((value) => normalizeText(value).toLowerCase());

  let changed = true;
  while (changed) {
    changed = false;
    for (const siteName of siteNames) {
      for (const separator of TITLE_SUFFIX_SEPARATORS) {
        const suffix = `${separator}${siteName}`;
        if (normalized.endsWith(suffix)) {
          normalized = normalized.slice(0, -suffix.length).trim();
          changed = true;
        }
      }
    }
  }

  return normalized || title.toLowerCase();
}

function siteNameFromTitle(title) {
  const cleanTitle = normalizeText(title);
  if (!cleanTitle) {
    return "";
  }
  const parts = cleanTitle
    .split(/\s[-|—–]\s| \/ /)
    .map((part) => part.trim())
    .filter(Boolean);
  const candidate = parts.at(-1);
  if (!candidate || candidate.length > 24 || /^https?:\/\//i.test(candidate)) {
    return "";
  }
  return candidate;
}

function readableHostName(hostname) {
  if (!hostname) {
    return t("website");
  }
  const core = hostname
    .replace(/^m\./, "")
    .split(".")
    .filter(Boolean)
    .at(-2) || hostname;
  return core.charAt(0).toUpperCase() + core.slice(1);
}

function normalizeHistoryKey(value) {
  const url = safeUrl(value);
  if (!url || !/^https?:$/.test(url.protocol)) {
    return "";
  }
  url.hash = "";
  return url.href;
}

function normalizeHistoryDeleteUrl(value) {
  const url = safeUrl(value);
  if (!url || !/^https?:$/.test(url.protocol)) {
    return "";
  }
  return url.href;
}

function applyGeneratedFallbackIcon(icon, site) {
  icon.removeAttribute("srcset");
  icon.src = fallbackIconDataUrl(site?.title || site?.url || t("website"));
}

function fallbackIconDataUrl(label) {
  const letter = iconLetter(label);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <rect width="128" height="128" rx="28" fill="#315c45"/>
      <text x="64" y="75" text-anchor="middle" fill="#fffdf7" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif" font-size="54" font-weight="700">${escapeHtml(letter)}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function iconLetter(label) {
  const cleanLabel = normalizeText(label);
  return [...cleanLabel][0]?.toUpperCase() || "•";
}

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function safeUrl(value) {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function isWebUrl(value) {
  const url = safeUrl(value);
  return Boolean(url && (url.protocol === "http:" || url.protocol === "https:"));
}

function normalizePortalUrl(value) {
  const trimmed = normalizeText(value);
  if (!trimmed || trimmed.length > MAX_PORTAL_URL_LENGTH) {
    return "";
  }

  const withProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const url = safeUrl(withProtocol);
  if (!url || !isWebUrl(url.href) || url.username || url.password) {
    return "";
  }
  return url.href;
}

function emptyState(message) {
  return `
    <div class="empty-state">
      <div>
        <span class="empty-mark">${emptyStateIcon()}</span>
        <p>${escapeHtml(message)}</p>
      </div>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
