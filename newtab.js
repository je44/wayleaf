"use strict";

const PORTALS = [
  { title: "百度", url: "https://www.baidu.com", category: "search" },
  { title: "知乎", url: "https://www.zhihu.com", category: "social" },
  { title: "哔哩哔哩", url: "https://www.bilibili.com", category: "media" },
  { title: "微博", url: "https://weibo.com", category: "social" },
  { title: "淘宝", url: "https://www.taobao.com", category: "shopping" },
  { title: "京东", url: "https://www.jd.com", category: "shopping" },
  { title: "GitHub", url: "https://github.com", category: "developer" },
  { title: "MDN", url: "https://developer.mozilla.org", category: "developer" },
  { title: "YouTube", url: "https://www.youtube.com", category: "media" },
  { title: "Google", url: "https://www.google.com", category: "search" },
  { title: "ChatGPT", url: "https://chatgpt.com", category: "ai" },
  { title: "Claude", url: "https://claude.ai", category: "ai" },
  { title: "Gemini", url: "https://gemini.google.com", category: "ai" },
  { title: "Perplexity", url: "https://www.perplexity.ai", category: "ai" },
  { title: "Notion", url: "https://www.notion.so", category: "productivity" },
  { title: "Figma", url: "https://www.figma.com", category: "design" },
  { title: "Vercel", url: "https://vercel.com", category: "developer" },
  { title: "Cloudflare", url: "https://www.cloudflare.com", category: "developer" },
  { title: "Gmail", url: "https://mail.google.com", category: "productivity" },
  { title: "Google Drive", url: "https://drive.google.com", category: "productivity" },
  { title: "Discord", url: "https://discord.com", category: "social" },
  { title: "小红书", url: "https://www.xiaohongshu.com", category: "social" },
  { title: "LinkedIn", url: "https://www.linkedin.com", category: "social" },
  { title: "Canva", url: "https://www.canva.com", category: "design" },
  { title: "飞书", url: "https://www.feishu.cn", category: "productivity" }
];
const CUSTOM_PORTALS_STORAGE_KEY = "customPortals";
const FAVORITE_SITES_STORAGE_KEY = "favoriteSites";
const RECENT_HISTORY_STARTED_AT_STORAGE_KEY = "recentHistoryStartedAt";
const RECENT_VIEW_MODE_STORAGE_KEY = "recentViewMode";
const BOOKMARK_FOLDER_STORAGE_KEY = "bookmarkFolderId";
const PORTAL_CATEGORY_STATE_STORAGE_KEY = "portalCategoryState";
const THEME_STORAGE_KEY = "themeMode";
const THEME_PALETTE_STORAGE_KEY = "themePalette";
const LANGUAGE_STORAGE_KEY = "languagePreference";
const THEME_BOOT_STORAGE_KEY = "__wayleaf_theme_boot__";
const SEARCH_SETTINGS_STORAGE_KEY = "searchSettings";
const VIDEO_PIP_ENABLED_STORAGE_KEY = "videoPipEnabled";
const LEGACY_VIDEO_PIP_GLOBAL_ENABLED_STORAGE_KEY = "videoPipGlobalEnabled";
const LEGACY_SOCIAL_VIDEO_EXTRACTOR_ENABLED_STORAGE_KEY = "socialVideoExtractorEnabled";
const FIRST_PAINT_CACHE_STORAGE_KEY = "__wayleaf_first_paint_cache__";
const FIRST_PAINT_CACHE_VERSION = 16;
const AI_DIRECT_PROMPT_STORAGE_KEY = "aiDirectPrompts";
const AI_PROMPT_HISTORY_STORAGE_KEY = "aiPromptHistory";
const SYNC_META_STORAGE_KEY = "syncMeta";
const ONBOARDING_GUIDE_STORAGE_KEY = "onboardingGuideDismissed";
const ONBOARDING_STEPS = [
  { target: ".search-panel", titleKey: "onboardingPrivacyTitle", bodyKey: "onboardingPrivacyBody", placement: "bottom" },
  { target: "#favoriteStrip", titleKey: "onboardingPermissionTitle", bodyKey: "onboardingPermissionBody", placement: "bottom" },
  { target: "#portalSurfaceButton", titleKey: "onboardingAiTitle", bodyKey: "onboardingAiBody", placement: "right" },
  { target: "#settingsButton", titleKey: "onboardingStartTitle", bodyKey: "onboardingStartBody", placement: "left" }
];
const ONBOARDING_PREVIEW_FAVORITES = [
  { id: "onboarding-github", title: "GitHub", url: "https://github.com" },
  { id: "onboarding-notion", title: "Notion", url: "https://www.notion.so" },
  { id: "onboarding-youtube", title: "YouTube", url: "https://www.youtube.com" },
  { id: "onboarding-figma", title: "Figma", url: "https://www.figma.com" },
  { id: "onboarding-chatgpt", title: "ChatGPT", url: "https://chatgpt.com" }
];
const AI_DIRECT_PROMPT_TOKEN_PARAM = "_wayleaf_prompt";
const AI_DIRECT_PROMPT_TEXT_PARAM = "_wayleaf_text";
const AI_DIRECT_PROMPT_TTL_MS = 2 * 60 * 1000;
const AI_PROMPT_HISTORY_MAX_PROMPT_LENGTH = 12000;
const AI_DIRECT_ATTACHMENT_MAX_COUNT = 2;
const AI_DIRECT_ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;
const AI_DIRECT_ATTACHMENT_ENGINE_IDS = new Set(["chatgpt", "claude", "gemini"]);
const MAX_HISTORY_SITE_GROUPS = 9;
const MAX_HISTORY_PAGES_PER_SITE = 4;
const MAX_RECENT_FOLDER_ITEMS = 4;
const MAX_TODAY_HISTORY_ITEMS_PER_PAGE = 12;
const MOST_VISITED_HISTORY_FALLBACK_LOOKBACK_MS = 30 * 24 * 60 * 60 * 1000;
const MOST_VISITED_HISTORY_MAX_RESULTS = 480;
const MIN_MOST_VISITED_HISTORY_VISITS = 2;
const MAX_CUSTOM_PORTALS = 48;
const MAX_FAVORITE_SITES = 5;
const MAX_PORTAL_TITLE_LENGTH = 32;
const MAX_PORTAL_URL_LENGTH = 512;
const MAX_LOCAL_SEARCH_RESULTS = 8;
const MAX_AI_PROMPT_HISTORY_ITEMS = 48;
const FAVORITE_REORDER_MS = 260;
const FAVORITE_DELETE_EXIT_MS = 360;
const FAVORITE_DELETE_CANCEL_MS = 280;
const BOOKMARK_LONG_PRESS_MS = 700;
const BOOKMARK_LONG_PRESS_FEEDBACK_DELAY_MS = 160;
const SEARCH_SUGGESTIONS_EXIT_MS = 260;
const SEARCH_SUGGESTIONS_OPEN_PADDING_Y = 18;
const AI_MODE_EXIT_MS = 300;
const GOOGLE_AI_MODE_EXIT_MS = 480;
const GOOGLE_AI_MODE_REDUCED_EXIT_MS = 420;
const MAX_BOOKMARK_FOLDER_OPTIONS = 160;
const MAX_PORTAL_FEATURED_ITEMS = 6;
const MAX_BOOKMARK_PORTAL_ITEMS = 120;
const MAX_BOOKMARK_HISTORY_ITEMS = 180;
const BOOKMARK_HISTORY_LOOKBACK_DAYS = 45;
const RECENT_BOOKMARK_LOOKBACK_MS = 3 * 24 * 60 * 60 * 1000;
const BOOKMARK_FOLDER_VIEW_CACHE_LIMIT = 8;
const BOOKMARK_ICON_RENDER_QUIET_MS = 120;
const BOOKMARK_ICON_RENDER_SETTLE_TIMEOUT_MS = 2200;
const ISSUE_FEEDBACK_URL = "https://github.com/je44/wayleaf/issues";
const WAYLEAF_CONFIG_EXPORT_VERSION = 1;
const CUSTOMIZABLE_SETTINGS_STORAGE_KEYS = [
  THEME_STORAGE_KEY,
  THEME_PALETTE_STORAGE_KEY,
  LANGUAGE_STORAGE_KEY,
  SEARCH_SETTINGS_STORAGE_KEY
];
const SYNC_STORAGE_KEYS = new Set([
  CUSTOM_PORTALS_STORAGE_KEY,
  FAVORITE_SITES_STORAGE_KEY,
  BOOKMARK_FOLDER_STORAGE_KEY,
  PORTAL_CATEGORY_STATE_STORAGE_KEY,
  ...CUSTOMIZABLE_SETTINGS_STORAGE_KEYS,
  SYNC_META_STORAGE_KEY
]);
const RECENT_CARD_DELETE_EXIT_MS = 140;
const RECENT_CARD_ENTER_MS = 150;
const RECENT_FOLDER_PAGE_SWITCH_MS = 330;
const RECENT_FOLDER_PAGE_SWITCH_EXIT_MS = 240;
const RECENT_FOLDER_PAGE_SWITCH_STAGGER_MS = 28;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const DEFAULT_FAVICON_MIN_COVERAGE = 0.12;
const DEFAULT_FAVICON_MAX_COVERAGE = 0.46;
const DEFAULT_FAVICON_MIN_NEUTRAL_RATIO = 0.88;
const DEFAULT_FAVICON_MAX_COLOR_RATIO = 0.08;
const DEFAULT_FAVICON_MIN_LUMINANCE = 58;
const DEFAULT_FAVICON_MAX_LUMINANCE = 178;
const DEFAULT_FAVICON_MAX_EDGE_OPACITY = 0.08;
const DEFAULT_FAVICON_EMBEDDED_MIN_COVERAGE = 0.055;
const DEFAULT_FAVICON_EMBEDDED_MAX_COVERAGE = 0.42;
const DEFAULT_FAVICON_EMBEDDED_MAX_EDGE_OPACITY = 0.16;
const DEFAULT_FAVICON_NEUTRAL_GLYPH_MIN_COVERAGE = 0.035;
const DEFAULT_FAVICON_NEUTRAL_GLYPH_MAX_COVERAGE = 0.52;
const DEFAULT_FAVICON_NEUTRAL_GLYPH_MIN_NEUTRAL_RATIO = 0.78;
const DEFAULT_FAVICON_NEUTRAL_GLYPH_MAX_COLOR_RATIO = 0.14;
const DEFAULT_FAVICON_NEUTRAL_GLYPH_MAX_EDGE_OPACITY = 0.2;
const REMOTE_BRAND_ICON_DIRECT_FETCH_SCORE_MIN = 90;
let gsapPluginsRegistered = false;

function getGsap() {
  const gsap = window.gsap;
  if (!gsap) {
    return null;
  }
  if (!gsapPluginsRegistered) {
    if (window.Flip) {
      gsap.registerPlugin(window.Flip);
    }
    gsapPluginsRegistered = true;
  }
  return gsap;
}

function getGsapFlip() {
  const gsap = getGsap();
  const Flip = window.Flip;
  return gsap && Flip ? { gsap, Flip } : null;
}

function prefersReducedMotion() {
  return Boolean(window.matchMedia?.(REDUCED_MOTION_QUERY).matches);
}

function gsapDuration(milliseconds) {
  return prefersReducedMotion() ? 0 : milliseconds / 1000;
}

function animatePageRefreshEntry() {
  const gsap = getGsap();
  if (!gsap || prefersReducedMotion()) {
    document.documentElement.classList.remove("refresh-enter");
    return;
  }
  const targets = [
    document.querySelector(".topbar"),
    document.querySelector(".home-stage")
  ].filter(Boolean);
  if (!targets.length) {
    document.documentElement.classList.remove("refresh-enter");
    return;
  }
  gsap.to(targets, {
    autoAlpha: 1,
    y: 0,
    duration: 0.24,
    ease: "power2.out",
    stagger: 0.018,
    onStart() {
      document.documentElement.classList.remove("refresh-enter");
    },
    onComplete() {
      gsap.set(targets, { clearProps: "opacity,visibility,transform" });
    }
  });
}

const DEFAULT_SEARCH_ENGINE = "local";
const DEFAULT_THEME_MODE = "system";
const DEFAULT_THEME_PALETTE = "sage";
const THEME_BACKGROUND_TRANSITION_MS = 300;
const THEME_MODE_ICON_BY_MODE = Object.freeze({
  system: "desktop",
  light: "sunny-filled",
  dark: "moon-filled"
});
const SETTINGS_TAB_ICONS = Object.freeze({
  basic: { inactive: "system-setting", active: "system-setting-filled" },
  search: { inactive: "ai-search", active: "ai-search-filled" },
  laboratory: { inactive: "filter-2", active: "filter-2-filled" }
});
const THEME_PALETTE_DISPLAY_ORDER = ["sage", "amber", "peach", "sky"];
const VISIBLE_THEME_PALETTE_IDS = new Set(THEME_PALETTE_DISPLAY_ORDER);
const THEME_PALETTES = [
  {
    id: "sage",
    labelKey: "themePaletteSage",
    light: "#26766d",
    dark: "#6cb6a9",
    modes: {
      light: {
        accent: "#26766d",
        accentStrong: "#1f5d56",
        focus: "#b85f58",
        paper: "#eceee9",
        panel: "#f1f2ed",
        panelSoft: "#e4e8e2",
        inputBg: "#f1f2ed",
        hoverBg: "#dde4de",
        ink: "#202725",
        muted: "#5e6965",
        faint: "#78827e",
        onAccent: "#ffffff"
      },
      dark: {
        accent: "#6cb6a9",
        accentStrong: "#9bcfc5",
        focus: "#df8b83",
        paper: "#202625",
        panel: "#2a302e",
        panelSoft: "#343c39",
        inputBg: "#2a302e",
        hoverBg: "#3d4743",
        ink: "#eef2f0",
        muted: "#b7c0bc",
        faint: "#919b97",
        onAccent: "#17201e"
      }
    }
  },
  {
    id: "forest",
    labelKey: "themePaletteForest",
    light: "#0f5b4d",
    dark: "#8db6a6",
    modes: {
      light: {
        accent: "#0f5b4d",
        accentStrong: "#073d34",
        focus: "#4b7d68",
        paper: "#f7f8f3",
        panel: "#fffefa",
        panelSoft: "#eff4ee",
        inputBg: "#fffefa",
        hoverBg: "#e9f1ed",
        ink: "#151a17",
        muted: "#5b665f",
        faint: "#77817a"
      },
      dark: {
        accent: "#8db6a6",
        accentStrong: "#bad9cc",
        focus: "#99c3df",
        paper: "#101512",
        panel: "#171d1a",
        panelSoft: "#202922",
        inputBg: "#121815",
        hoverBg: "#26332d",
        ink: "#eff6f3",
        muted: "#b7c4be",
        faint: "#84928c",
        onAccent: "#102019"
      }
    }
  },
  {
    id: "amber",
    labelKey: "themePaletteAmber",
    light: "#8a6515",
    dark: "#dbc06a",
    modes: {
      light: {
        accent: "#8a6515",
        accentStrong: "#674b0d",
        focus: "#3a6f96",
        paper: "#f1ede3",
        panel: "#f3efe5",
        panelSoft: "#e9e2d3",
        inputBg: "#f3efe5",
        hoverBg: "#e2dac8",
        ink: "#29261f",
        muted: "#696357",
        faint: "#857e70",
        onAccent: "#ffffff"
      },
      dark: {
        accent: "#dbc06a",
        accentStrong: "#efd58a",
        focus: "#76afd2",
        paper: "#25241f",
        panel: "#2d2b25",
        panelSoft: "#38352d",
        inputBg: "#2d2b25",
        hoverBg: "#423e34",
        ink: "#f4f0e6",
        muted: "#c5bdab",
        faint: "#9e9685",
        onAccent: "#25241f"
      }
    }
  },
  {
    id: "sky",
    labelKey: "themePaletteSky",
    light: "#3a6f96",
    dark: "#76afd2",
    modes: {
      light: {
        accent: "#3a6f96",
        accentStrong: "#285473",
        focus: "#a45e2d",
        paper: "#e9edf0",
        panel: "#eef1f3",
        panelSoft: "#dfe6ea",
        inputBg: "#eef1f3",
        hoverBg: "#d7e0e5",
        ink: "#22292f",
        muted: "#606a72",
        faint: "#7b858c",
        onAccent: "#ffffff"
      },
      dark: {
        accent: "#76afd2",
        accentStrong: "#a5cae1",
        focus: "#d59963",
        paper: "#20252a",
        panel: "#2a3036",
        panelSoft: "#343c44",
        inputBg: "#2a3036",
        hoverBg: "#3d4750",
        ink: "#edf1f4",
        muted: "#b5bec5",
        faint: "#8f9aa3",
        onAccent: "#20252a"
      }
    }
  },
  {
    id: "peach",
    labelKey: "themePalettePeach",
    light: "#a95643",
    dark: "#de8b75",
    modes: {
      light: {
        accent: "#a95643",
        accentStrong: "#843f31",
        focus: "#26766d",
        paper: "#f1ebe8",
        panel: "#f4eeeb",
        panelSoft: "#e9ded9",
        inputBg: "#f4eeeb",
        hoverBg: "#e1d4ce",
        ink: "#2d2522",
        muted: "#6f625e",
        faint: "#8b7c76",
        onAccent: "#ffffff"
      },
      dark: {
        accent: "#de8b75",
        accentStrong: "#f0ad9b",
        focus: "#70b5aa",
        paper: "#282422",
        panel: "#302a28",
        panelSoft: "#3a322f",
        inputBg: "#302a28",
        hoverBg: "#443a36",
        ink: "#f4efed",
        muted: "#c7b9b4",
        faint: "#9f908a",
        onAccent: "#282422"
      }
    }
  },
  {
    id: "neutral",
    labelKey: "themePaletteNeutral",
    light: "#585b56",
    dark: "#aaada7",
    modes: {
      light: {
        accent: "#585b56",
        accentStrong: "#373a35",
        focus: "#5f7e9a",
        paper: "#f8f8f3",
        panel: "#fffefa",
        panelSoft: "#f0f1ec",
        inputBg: "#fffefa",
        hoverBg: "#ebeee8",
        ink: "#171915",
        muted: "#61655e",
        faint: "#7d8179"
      },
      dark: {
        accent: "#aaada7",
        accentStrong: "#d2d4ce",
        focus: "#9bbdd7",
        paper: "#111310",
        panel: "#1a1d18",
        panelSoft: "#232720",
        inputBg: "#181b16",
        hoverBg: "#2a3027",
        ink: "#f1f3ed",
        muted: "#c0c4bd",
        faint: "#8e938b",
        onAccent: "#171915"
      }
    }
  }
];
const DEFAULT_LOCAL_SEARCH_ENGINE = "google";
const EDITABLE_LOCAL_SEARCH_ENGINE_IDS = ["google", "baidu", "bing"];
const EDITABLE_AI_ENGINE_IDS = ["chatgpt", "claude", "gemini", "grok", "deepseek", "doubao", "kimi", "glm", "qwen", "jimeng"];
const GOOGLE_AI_MODE_SEARCH_URL = "https://www.google.com/ai";
const SETTINGS_ENGINE_ICON_STYLES = Object.freeze({
  baidu: { mode: "mask", tile: "#ffffff", glyph: "#2932e1" },
  chatgpt: { mode: "mask", tile: "#ffffff", glyph: "#000000" },
  claude: { mode: "mask", tile: "#ffffff", glyph: "#d97757" },
  deepseek: { mode: "mask", tile: "#ffffff", glyph: "#4d6bfe" },
  doubao: { mode: "original", tile: "#ffffff" },
  douyin: { mode: "original", tile: "#ffffff" },
  gemini: { mode: "original", tile: "#ffffff" },
  glm: { mode: "mask", tile: "#ffffff", glyph: "#3859ff" },
  instagram: { mode: "original", tile: "#ffffff" },
  jimeng: { mode: "original", tile: "#000000" },
  kimi: { mode: "original", tile: "#000000" },
  qwen: { mode: "original", tile: "#ffffff" },
  xiaohongshu: { mode: "mask", tile: "#ff2442", glyph: "#ffffff" },
  zhihu: { mode: "original", tile: "#ffffff" }
});
const DEFAULT_SEARCH_ENGINES = [
  { id: "local", label: "Aggregate search", labelKey: "quickSearchAggregate", local: true },
  { id: "google", label: "Google", searchUrl: "https://www.google.com/search", queryParam: "q", aggregateDefault: true },
  { id: "baidu", label: "Baidu", labelKey: "brandBaidu", searchUrl: "https://www.baidu.com/s", queryParam: "wd" },
  { id: "bing", label: "Bing", searchUrl: "https://www.bing.com/search", queryParam: "q", aggregateDefault: true },
  { id: "chatgpt", command: "/gpt", commands: ["/gpt", "/chatgpt"], label: "ChatGPT", searchUrl: "https://chatgpt.com/", queryParam: "q", aiDirect: true, autoSubmit: true, directUrl: "https://chatgpt.com/", themeColor: "#10a37f" },
  { id: "claude", command: "/claude", label: "Claude", searchUrl: "https://claude.ai/new", queryParam: "q", aiDirect: true, autoSubmit: true, directUrl: "https://claude.ai/new", themeColor: "#d97757" },
  { id: "gemini", command: "/gemini", label: "Gemini", searchUrl: "https://gemini.google.com/app", queryParam: "q", aiDirect: true, autoSubmit: true, directUrl: "https://gemini.google.com/app", themeColor: "#4285f4" },
  { id: "grok", command: "/grok", label: "Grok", searchUrl: "https://grok.com/", queryParam: "q", aiDirect: true, autoSubmit: true, directUrl: "https://grok.com/", themeColor: "#777f86" },
  { id: "deepseek", command: "/deepseek", commands: ["/deepseek", "/ds"], label: "DeepSeek", searchUrl: "https://chat.deepseek.com/", queryParam: "q", aiDirect: true, autoSubmit: true, directUrl: "https://chat.deepseek.com/", themeColor: "#4d6bfe" },
  { id: "doubao", command: "/doubao", commands: ["/doubao", "/db"], label: "Doubao", labelKey: "brandDoubao", searchUrl: "https://www.doubao.com/chat/", queryParam: "q", aiDirect: true, autoSubmit: true, directUrl: "https://www.doubao.com/chat/", iconUrl: "icons/sites/doubao.png", themeColor: "#1e37fc" },
  { id: "kimi", command: "/kimi", label: "Kimi", searchUrl: "https://www.kimi.com/", queryParam: "q", aiDirect: true, autoSubmit: true, directUrl: "https://www.kimi.com/", themeColor: "#111827" },
  { id: "glm", command: "/glm", commands: ["/glm", "/chatglm", "/zhipu"], label: "GLM", searchUrl: "https://chatglm.cn/", queryParam: "q", aiDirect: true, autoSubmit: true, directUrl: "https://chatglm.cn/", themeColor: "#3859ff" },
  { id: "qwen", command: "/qwen", label: "Qwen", labelKey: "brandQwen", searchUrl: "https://chat.qwen.ai/", queryParam: "q", aiDirect: true, autoSubmit: true, directUrl: "https://chat.qwen.ai/", iconUrl: "icons/sites/qwen.svg", themeColor: "#6f69f7", urlPromptFallback: true },
  { id: "jimeng", command: "/jimeng", commands: ["/jimeng", "/jm"], label: "Jimeng", labelKey: "brandJimeng", searchUrl: "https://jimeng.jianying.com/ai-tool/home", queryParam: "q", aiDirect: true, autoSubmit: true, directUrl: "https://jimeng.jianying.com/ai-tool/home", themeColor: "#1c6fff", urlPromptFallback: true }
];
const PLATFORM_SEARCH_TARGETS = Object.freeze([
  { id: "youtube", label: "YouTube", prefixes: ["*yt", "*youtube"], searchUrl: "https://www.youtube.com/results", queryParam: "search_query", iconUrl: "https://www.youtube.com/", themeColor: "#ff0000", behaviorKey: "platformSearchDirectBehavior" },
  { id: "x", label: "X", prefixes: ["*x", "*twitter"], searchUrl: "https://x.com/search", queryParam: "q", searchParams: { src: "typed_query" }, iconUrl: "https://x.com/", themeColor: "#000000", behaviorKey: "platformSearchLoginBehavior" },
  { id: "xiaohongshu", label: "RedNote", labelKey: "brandXiaohongshu", prefixes: ["*xhs", "*rednote"], searchUrl: "https://www.xiaohongshu.com/search_result", queryParam: "keyword", searchParams: { source: "web_explore_feed" }, iconUrl: "https://www.xiaohongshu.com/", themeColor: "#ff2442", behaviorKey: "platformSearchLoginBehavior" },
  { id: "instagram", label: "Instagram", prefixes: ["*ig", "*instagram"], searchUrl: "https://www.instagram.com/explore/search/keyword/", queryParam: "q", iconUrl: "https://www.instagram.com/", fallback: true, themeColor: "#e4405f", behaviorKey: "platformSearchFallbackBehavior" },
  { id: "threads", label: "Threads", prefixes: ["*threads", "*th"], searchUrl: "https://www.threads.com/search", queryParam: "q", iconUrl: "https://www.threads.com/", fallback: true, themeColor: "#000000", behaviorKey: "platformSearchFallbackBehavior" },
  { id: "douyin", label: "Douyin", labelKey: "brandDouyin", prefixes: ["*dy", "*douyin"], searchUrl: "https://www.douyin.com/search/", pathQuery: true, searchParams: { type: "general" }, iconUrl: "https://www.douyin.com/", themeColor: "#000000", behaviorKey: "platformSearchLoginBehavior" },
  { id: "zhihu", label: "Zhihu", labelKey: "brandZhihu", prefixes: ["*zhihu", "*zh"], searchUrl: "https://www.zhihu.com/search", queryParam: "q", searchParams: { type: "content" }, iconUrl: "https://www.zhihu.com/", themeColor: "#0084ff", behaviorKey: "platformSearchDirectBehavior" },
  { id: "bilibili", label: "Bilibili", prefixes: ["*bili", "*bilibili"], searchUrl: "https://search.bilibili.com/all", queryParam: "keyword", iconUrl: "https://www.bilibili.com/", themeColor: "#00a1d6", behaviorKey: "platformSearchDirectBehavior" },
  { id: "tiktok", label: "TikTok", prefixes: ["*tt", "*tiktok"], searchUrl: "https://www.tiktok.com/search", queryParam: "q", iconUrl: "https://www.tiktok.com/", themeColor: "#000000", behaviorKey: "platformSearchLoginBehavior" }
]);
let searchEngines = DEFAULT_SEARCH_ENGINES.map(cloneSearchEngine);
const AGGREGATE_SEARCH_ENGINE_IDS = ["google", "baidu", "bing"];
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
  "portal",
  "other"
];
const BOOKMARK_CATEGORY_RULES = {
  developer: {
    hosts: ["github", "gitlab", "bitbucket", "stackoverflow", "stackexchange", "developer", "mozilla", "mdn", "npm", "vercel", "cloudflare", "docs", "api", "react", "vue", "svelte", "python", "nodejs", "docker"],
    text: ["开发", "代码", "工程", "编程", "技术", "文档", "接口", "源码", "仓库", "developer", "docs", "api", "code", "engineering", "programming"]
  },
  ai: {
    hosts: ["chatgpt", "openai", "claude", "anthropic", "gemini", "grok", "deepseek", "doubao", "kimi", "chatglm", "zhipu", "perplexity", "poe", "midjourney", "replicate", "huggingface", "cursor"],
    text: ["ai", "人工智能", "大模型", "模型", "提示词", "prompt", "agent", "智能体", "生成", "llm", "gpt", "Claude", "Gemini", "DeepSeek", "Kimi", "GLM", "豆包"]
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
    hosts: ["youtube", "bilibili", "netflix", "spotify", "music", "twitch", "douyin", "iqiyi", "mgtv", "v.qq", "vimeo", "podcasts"],
    text: ["影音", "视频", "音乐", "播客", "直播", "media", "video", "music", "podcast", "stream"]
  }
};
const SITE_NAME_BY_KEY = {
  "b.ai": "B.AI",
  "bilibili.com": "哔哩哔哩",
  "bitbucket.org": "Bitbucket",
  "chatgpt.com": "ChatGPT",
  "cloudflare.com": "Cloudflare",
  "developer.mozilla.org": "MDN",
  "deepseek.com": "DeepSeek",
  "discord.com": "Discord",
  "docs.b.ai": "B.AI Docs",
  "doubao.com": "豆包",
  "drive.google.com": "Google Drive",
  "aistudio.google.com": "Google AI Studio",
  "aws.amazon.com": "AWS",
  "azure.microsoft.com": "Microsoft Azure",
  "chrome.google.com": "Chrome Web Store",
  "cloud.google.com": "Google Cloud",
  "colab.research.google.com": "Google Colab",
  "firefly.adobe.com": "Adobe Firefly",
  "firebase.google.com": "Firebase",
  "figma.com": "Figma",
  "github.com": "GitHub",
  "gmail.com": "Gmail",
  "google.com": "Google",
  "instagram.com": "Instagram",
  "kimi.com": "Kimi",
  "linkedin.com": "LinkedIn",
  "npmjs.com": "npm",
  "notion.so": "Notion",
  "office.com": "Microsoft 365",
  "react.dev": "React",
  "stackoverflow.com": "Stack Overflow",
  "taobao.com": "淘宝",
  "teams.microsoft.com": "Microsoft Teams",
  "threads.com": "Threads",
  "trip.com": "Trip.com",
  "v.qq.com": "腾讯视频",
  "vercel.com": "Vercel",
  "x.com": "X",
  "xiaohongshu.com": "小红书",
  "youtube.com": "YouTube",
  "zhihu.com": "知乎"
};
const SITE_GROUP_OVERRIDES = {
  "ai.google.dev": "aistudio.google.com",
  "aistudio.google.com": "aistudio.google.com",
  "makersuite.google.com": "aistudio.google.com",
  "cloud.google.com": "cloud.google.com",
  "console.cloud.google.com": "cloud.google.com",
  "colab.research.google.com": "colab.research.google.com",
  "chromewebstore.google.com": "chrome.google.com",
  "youtu.be": "youtube.com",
  "docs.b.ai": "docs.b.ai",
  "calendar.google.com": "calendar.google.com",
  "drive.google.com": "drive.google.com",
  "docs.google.com": "docs.google.com",
  "console.firebase.google.com": "firebase.google.com",
  "firebase.google.com": "firebase.google.com",
  "mail.google.com": "gmail.com",
  "chat.openai.com": "chatgpt.com",
  "hf.co": "huggingface.co",
  "discord.gg": "discord.com",
  "discordapp.com": "discord.com",
  "firefly.adobe.com": "firefly.adobe.com",
  "console.aws.amazon.com": "aws.amazon.com",
  "docs.aws.amazon.com": "aws.amazon.com",
  "signin.aws.amazon.com": "aws.amazon.com",
  "portal.azure.com": "azure.microsoft.com",
  "admin.microsoft.com": "office.com",
  "microsoft365.com": "office.com",
  "teams.microsoft.com": "teams.microsoft.com",
  "teams.live.com": "teams.microsoft.com",
  "v.qq.com": "v.qq.com",
  "video.qq.com": "v.qq.com",
  "jira.atlassian.com": "atlassian.net",
  "bitbucket.atlassian.com": "bitbucket.org",
  "www.office.com": "office.com",
  "music.163.com": "music.163.com",
  "developer.mozilla.org": "developer.mozilla.org",
  "gemini.google.com": "gemini.google.com",
  "aws.amazon.com": "aws.amazon.com",
  "azure.microsoft.com": "azure.microsoft.com",
  "code.visualstudio.com": "code.visualstudio.com",
  "chrome.google.com": "chrome.google.com",
  "analytics.google.com": "analytics.google.com",
  "googleads.google.com": "googleads.google.com",
  "chat.deepseek.com": "deepseek.com",
  "chatglm.cn": "chatglm.cn",
  "jimeng.jianying.com": "jimeng.jianying.com",
  "kimi.moonshot.cn": "kimi.com",
  "maps.google.com": "maps.google.com",
  "meet.google.com": "meet.google.com",
  "mimo.mi.com": "mimo.mi.com",
  "mimo.xiaomi.com": "mimo.xiaomi.com",
  "web.wechat.com": "wechat.com",
  "weixin.qq.com": "wechat.com"
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
  "amazon.com",
  "deepseek.com",
  "doubao.com",
  "instagram.com",
  "kimi.com",
  "microsoft.com",
  "linkedin.com",
  "npmjs.com",
  "notion.so",
  "pinterest.com",
  "qq.com",
  "stackoverflow.com",
  "taobao.com",
  "threads.com",
  "twitter.com",
  "vercel.com",
  "x.com",
  "xiaohongshu.com",
  "youtube.com",
  "zhihu.com"
];
const GOOGLE_REGIONAL_HOST_PATTERN = /^google\.(com?\.)?[a-z]{2}$/;
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
const AUTH_RELATED_HISTORY_HOSTS = new Set([
  "accounts.google.com",
  "appleid.apple.com",
  "auth.openai.com",
  "id.atlassian.com",
  "login.live.com",
  "login.microsoftonline.com",
  "oauth.telegram.org"
]);
const AUTH_RELATED_HISTORY_HOST_SUFFIXES = [
  ".auth0.com",
  ".okta.com",
  ".okta-emea.com",
  ".onelogin.com"
];
const AUTH_RELATED_HISTORY_HOST_PARTS = new Set([
  "auth",
  "login",
  "oauth",
  "signin",
  "sso"
]);
const STRONG_AUTH_HISTORY_PATH_SEGMENTS = new Set([
  "authorize",
  "authorization",
  "callback",
  "callbacks",
  "oauth",
  "oauth2",
  "saml",
  "sso"
]);
const AUTH_HISTORY_PATH_SEGMENTS = new Set([
  ...STRONG_AUTH_HISTORY_PATH_SEGMENTS,
  "auth",
  "login",
  "signin",
  "sign-in"
]);
const AUTH_HISTORY_QUERY_PARAMS = new Set([
  "client_id",
  "code",
  "oauth_token",
  "redirect_uri",
  "response_type",
  "samlrequest",
  "samlresponse",
  "scope",
  "state"
]);
const PORTAL_CATEGORY_BY_SITE_KEY = Object.freeze(Object.fromEntries(PORTALS.map((portal) => {
  const url = new URL(portal.url);
  return [canonicalSiteHost(url.hostname), portal.category];
})));
const DEFAULT_LOCALE = "en";
const SUPPORTED_LOCALES = ["zh-CN", "zh-TW", "en", "ja", "ko", "es", "fr", "de"];
const LANGUAGE_PREFERENCES = ["system", "zh-TW", "zh-CN", "en", "ja", "ko"];
const LANGUAGE_OPTION_LABELS = {
  "zh-TW": "繁體中文",
  "zh-CN": "简体中文",
  en: "English",
  ja: "日本語",
  ko: "한국어"
};
const MESSAGES = {
  "zh-CN": {
    topbarLabel: "顶部功能区",
    shellLabel: "Wayleaf 控制台",
    portalTitle: "导航中枢",
    mobilePortalTab: "书签",
    mobileMediaTab: "信息",
    mobileHistoryTab: "历史",
    smartPortalTab: "网站推荐",
    bookmarkPortalTab: "书签",
    bookmarkSearchPlaceholder: "搜索当前文件夹",
    bookmarkFolders: "书签文件夹",
    bookmarkSortLabel: "书签排序",
    bookmarkSortRecent: "最近加入",
    bookmarkSortTitle: "A–Z",
    bookmarkSearchEmpty: "没有找到匹配的书签。",
    portalCategoryFeatured: "常用入口",
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
    portalCategoryPortal: "常用门户",
    portalCategories: "推荐分类",
    portalCategoriesExpand: "展开",
    portalCategoriesCollapse: "收起",
    addPortal: "添加入口",
    portalName: "名称",
    portalUrl: "网址",
    portalCategory: "归类",
    portalNamePlaceholder: "例如：Notion",
    portalUrlPlaceholder: "https://www.notion.so",
    cancel: "取消",
    add: "添加",
    refreshBookmarkFolder: "刷新当前书签文件夹",
    chooseBookmarkFolder: "选择书签文件夹",
    collapseSurface: "收起面板",
    back: "返回",
    chooseBookmarkFolderPrompt: "选择一个书签文件夹",
    historyTitle: "最常访问",
    todayHistoryTitle: "今日历史记录",
    todayHistoryEmpty: "当前没任何的历史记录",
    recentViewToggleToToday: "切换到今日历史记录",
    recentViewToggleToRecent: "切换到最常访问",
    todayHistoryPrevious: "上一组今日历史记录",
    todayHistoryNext: "下一组今日历史记录",
    openPortalSurface: "打开导航中枢",
    recentFoldersSwitch: "切换最常访问卡片",
    recentFoldersPrevious: "上一组最常访问",
    recentFoldersNext: "下一组最常访问",
    historyPreviousPage: "上一条最常访问",
    historyNextPage: "下一条最常访问",
    quickSearchPlaceholder: "搜索或输入网址",
    googleImageSearch: "使用 Google 以图搜索",
    aiAttachmentAdd: "添加附件到 {engine}",
    aiAttachmentClear: "移除附件",
    aiAttachmentCount: "{count} 个附件",
    quickSearch: "搜索",
    quickSearchLocal: "打开",
    quickSearchAggregate: "聚合搜索",
    quickSearchAiCommandHint: "输入 /gpt、/claude、/gemini、/grok、/deepseek、/doubao、/kimi 或 /glm 切换 AI",
    quickSearchAiSelected: "当前选择",
    quickSearchEngine: "搜索模式",
    quickSearchWith: "使用 {engine} 搜索",
    quickSearchWithGoogleAi: "使用 Google AI搜索",
    quickSearchWithAi: "发送到 {engine}",
    quickSearchAiPlaceholder: "使用{engine}进行提问",
    quickSearchWithPlatform: "在 {platform} 搜索",
    quickSearchPlatformPlaceholder: "在 {platform} 搜索",
    quickSearchPlatformActivationHint: "输入 {prefix} 激活 {platform}",
    localSearchHistory: "历史",
    localSearchBookmark: "书签",
    localSearchNoResults: "没有匹配的历史或书签。",
    addFavoriteSite: "添加常用网站",
    addBookmarkToFavorites: "将 {title} 添加到常用网站",
    deleteFavoriteSite: "删除常用网站",
    favoriteSiteLimit: "常用网站最多 {count} 个。",
    favoriteSiteExists: "{title} 已在常用网站中。",
    portalCategoryItems: "{count} 个入口",
    deleteCustomPortal: "删除自定义入口",
    openSettings: "设置中心",
    closeSettings: "返回首页",
    settingsBackHome: "返回首页",
    help: "帮助",
    settingsTitle: "设置中心",
    settingsSubtitle: "个性化 Wayleaf，管理同步与主题偏好。",
    settingsTabsLabel: "设置分类",
    settingsBasicTab: "基本设置",
    settingsSearchTab: "搜索设置",
    settingsLaboratoryTab: "实验室",
    videoPipLabTitle: "视频小窗",
    videoPipLabDescription: "为兼容的 HTML5 视频开启画中画。",
    videoPipLabel: "启用视频小窗",
    videoPipHint: "点击 Chrome 工具栏中的 Wayleaf 图标，再选择页面中的可播放视频。",
    languageSettingsTitle: "语言",
    appearanceModeTitle: "外观",
    themeModeSystem: "跟随系统",
    themeModeLight: "浅色",
    themeModeDark: "深色",
    presetPaletteTitle: "色彩",
    themePaletteSage: "Wayleaf",
    themePaletteForest: "墨绿",
    themePaletteAmber: "柚黄",
    themePaletteSky: "丹宁",
    themePalettePeach: "木瓜",
    themePaletteNeutral: "中性",
    syncSettingsTitle: "云端同步",
    syncSettingsReady: "配置会跟随 Chrome 账号同步",
    syncSettingsReadyDetail: "",
    syncSettingsUnavailable: "当前浏览器不支持同步",
    syncSettingsUnavailableDetail: "仍会保存在这台设备。",
    syncSettingsDone: "刚刚写入同步区",
    syncSettingsDoneDetail: "Chrome 会自动分发到同账号设备。",
    syncSettingsNow: "手动同步",
    syncSettingsAuto: "自动同步",
    syncSettingsAutoHint: "每日同步",
    syncSettingsExport: "导出",
    syncSettingsImport: "导入",
    syncSettingsExported: "配置已导出",
    syncSettingsExportedDetail: "已保存 Wayleaf 全局配置文件。",
    syncSettingsImported: "配置已导入",
    syncSettingsImportedDetail: "正在刷新 Wayleaf。",
    syncSettingsImportFailed: "导入失败",
    syncSettingsImportFailedDetail: "请选择 Wayleaf .wy 配置文件。",
    syncSettingsActionsLabel: "同步方式",
    brandBaidu: "百度",
    brandDoubao: "豆包",
    brandQwen: "千问",
    brandJimeng: "即梦",
    brandXiaohongshu: "小红书",
    brandDouyin: "抖音",
    brandZhihu: "知乎",
    searchSettingsDefaultTitle: "基本搜索",
    searchSettingsDefaultDescription: "设置普通关键词默认使用的搜索入口",
    searchSettingsDefaultHint: "输入普通关键词时，Wayleaf 会优先使用标记为默认的基本搜索。",
    searchSettingsAiTitle: "AI 搜索引擎",
    searchSettingsAiDescription: "修改内建 AI 引擎的名称、触发词和搜索链接",
    searchSettingsAiHint: "触发词用空格或逗号分隔，例如 /gpt /chatgpt。需要登录的平台请先完成首次登录再使用。",
    searchSettingsPlatformTitle: "平台搜索",
    searchSettingsPlatformDescription: "使用以 * 开头的内置激活词直达常用平台搜索结果",
    searchSettingsPlatformHint: "输入完整的 *平台缩写或名称（例如 *yt 或 *youtube）即可切换到对应平台；若短激活词也是其他平台的开头（如 *x / *xhs），请按空格或回车确认 *x。需要登录的平台请先完成首次登录再使用。",
    searchSettingsPlatformPrefix: "前缀",
    searchSettingsPlatformQuery: "内容",
    searchSettingsBuiltInBadge: "内置",
    platformSearchDirectBehavior: "直接打开平台搜索结果",
    platformSearchLoginBehavior: "打开平台搜索结果；如需登录请先完成首次登录",
    platformSearchFallbackBehavior: "使用平台 Web 搜索入口；若站点限制搜索，会保留已编码查询供手动恢复",
    searchSettingsSetDefault: "设为默认",
    searchSettingsDefaultBadge: "默认",
    searchSettingsEdit: "编辑",
    searchSettingsDoneEdit: "完成",
    searchSettingsEngineName: "名称",
    searchSettingsEngineCommands: "触发词",
    searchSettingsEngineUrl: "搜索链接",
    searchSettingsSave: "保存搜索设置",
    searchSettingsReset: "恢复默认",
    searchSettingsSaved: "搜索设置已保存。",
    searchSettingsResetDone: "已恢复默认搜索设置。",
    onboardingKicker: "第一次使用",
    onboardingTitle: "先花一分钟了解 Wayleaf",
    onboardingIntro: "Wayleaf 会把新标签页变成你的本地工作台。下面这些点能帮你安全、顺手地开始。",
    onboardingPrivacyTitle: "从中心搜索栏开始",
    onboardingPrivacyBody: "输入关键词、网址或 /AI 指令，Wayleaf 会从这个主区域开始搜索与跳转。",
    onboardingPermissionTitle: "添加自定义喜好网站",
    onboardingPermissionBody: "搜索栏下方可添加最多 5 个常用网站，点击图标即可快速打开。",
    onboardingSyncTitle: "查看最常访问",
    onboardingSyncBody: "下方会按网站整理最常访问的网址，并保留同一网站的相关页面。",
    onboardingAiTitle: "打开导航中枢",
    onboardingAiBody: "左上角入口集中管理快捷网站与自选书签文件夹。",
    onboardingStartTitle: "进入设置中心",
    onboardingStartBody: "右上角设置中心用于调整语言、外观、同步与搜索偏好。",
    onboardingFeedbackTitle: "遇到问题直接反馈",
    onboardingFeedbackBody: "反馈时带上浏览器、Wayleaf 版本和失败场景，最容易定位。",
    onboardingFeedback: "反馈问题",
    onboardingNext: "下一步",
    onboardingDone: "完成",
    closeOnboarding: "关闭指引",
    portalNameRequired: "请填写入口名称。",
    portalUrlRequired: "请输入 http 或 https 开头的网址。",
    customPortalLimit: "自定义入口最多 {count} 个。",
    savePortalFailed: "保存入口失败，请减少数量或缩短内容后重试。",
    loadCustomPortalsFailed: "读取自定义入口失败，请刷新后重试。",
    deletePortalFailed: "删除入口失败，请刷新后重试。",
    bookmarkNoFolder: "还没有选择书签文件夹。请从文件夹列表选择一个。",
    bookmarkFolderMissing: "已选文件夹不存在，请重新选择。",
    unnamedFolder: "未命名文件夹",
    bookmarkMeta: "{folder} · {count} 个网站",
    bookmarkRecentTitle: "最近加入",
    bookmarkRecentMeta: "3 天内",
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
    deleteHistory: "删除 {title}",
    deleteHistoryFailed: "删除失败，可能已在其他位置变更。",
    openSiteHome: "打开 {name} 首页",
    openPage: "打开 {title}",
    unnamedPage: "未命名页面",
    website: "网站"
  },
  "zh-TW": {
    topbarLabel: "頂部功能區",
    shellLabel: "Wayleaf 控制台",
    portalTitle: "導航中樞",
    mobilePortalTab: "書籤",
    mobileMediaTab: "資訊",
    smartPortalTab: "網站推薦",
    bookmarkPortalTab: "書籤",
    bookmarkSearchPlaceholder: "搜尋目前資料夾",
    bookmarkFolders: "書籤資料夾",
    bookmarkSortLabel: "書籤排序",
    bookmarkSortRecent: "最近加入",
    bookmarkSortTitle: "A–Z",
    bookmarkSearchEmpty: "找不到符合的書籤。",
    mobileHistoryTab: "歷史",
    portalCategoryCustom: "自訂",
    portalCategoryShopping: "購物",
    portalCategoryAi: "AI",
    portalCategorySocial: "社交",
    portalCategorySearch: "搜尋",
    portalCategoryDeveloper: "開發",
    portalCategoryProductivity: "效率",
    portalCategoryMedia: "影音",
    portalCategoryDesign: "設計",
    portalCategoryOther: "其他",
    portalCategoryPortal: "常用門戶",
    quickSearchPlaceholder: "搜尋或輸入網址",
    googleImageSearch: "使用 Google 以圖搜尋",
    aiAttachmentAdd: "新增附件到 {engine}",
    aiAttachmentClear: "移除附件",
    aiAttachmentCount: "{count} 個附件",
    quickSearch: "搜尋",
    quickSearchLocal: "打開",
    quickSearchAggregate: "聚合搜尋",
    quickSearchAiCommandHint: "輸入 /gpt、/claude、/gemini、/grok、/deepseek、/doubao、/kimi 或 /glm 切換 AI",
    quickSearchAiSelected: "目前選擇",
    quickSearchEngine: "搜尋模式",
    quickSearchWith: "使用 {engine} 搜尋",
    quickSearchWithGoogleAi: "使用 Google AI搜索",
    quickSearchWithAi: "送到 {engine}",
    quickSearchAiPlaceholder: "使用{engine}提問",
    quickSearchWithPlatform: "在 {platform} 搜尋",
    quickSearchPlatformPlaceholder: "在 {platform} 搜尋",
    quickSearchPlatformActivationHint: "輸入 {prefix} 啟用 {platform}",
    portalCategoryItems: "{count} 個入口",
    portalCategories: "推薦分類",
    portalCategoriesExpand: "展開",
    portalCategoriesCollapse: "收起",
    portalCategoryFeatured: "常用入口",
    portalCategory: "分類",
    portalNamePlaceholder: "例如：Notion",
    portalUrlPlaceholder: "https://www.notion.so",
    portalName: "名稱",
    portalUrl: "網址",
    cancel: "取消",
    add: "新增",
    addPortal: "新增入口",
    refreshBookmarkFolder: "刷新目前書籤資料夾",
    chooseBookmarkFolder: "選擇書籤資料夾",
    collapseSurface: "收起面板",
    back: "返回",
    chooseBookmarkFolderPrompt: "選擇一個書籤資料夾",
    historyTitle: "最常訪問",
    todayHistoryTitle: "歷史記錄",
    todayHistoryEmpty: "當前沒任何的歷史記錄",
    recentViewToggleToToday: "切換到今日歷史記錄",
    recentViewToggleToRecent: "切換到最常訪問",
    todayHistoryPrevious: "上一組今日歷史記錄",
    todayHistoryNext: "下一組今日歷史記錄",
    openPortalSurface: "打開導航中樞",
    recentFoldersSwitch: "切換最常訪問卡片",
    recentFoldersPrevious: "上一組最常訪問",
    recentFoldersNext: "下一組最常訪問",
    historyPreviousPage: "上一條最常訪問",
    historyNextPage: "下一條最常訪問",
    unnamedFolder: "未命名資料夾",
    bookmarkRoot: "書籤",
    bookmarkMeta: "{folder} · {count} 個網站",
    bookmarkRecentTitle: "最近加入",
    bookmarkRecentMeta: "3 天內",
    bookmarkCount: "{count} 個網站",
    quickSearchLocal: "打開",
    localSearchHistory: "歷史",
    localSearchBookmark: "書籤",
    localSearchNoResults: "沒有匹配的歷史或書籤。",
    addFavoriteSite: "新增常用網站",
    addBookmarkToFavorites: "將 {title} 新增到常用網站",
    deleteFavoriteSite: "刪除常用網站",
    favoriteSiteLimit: "常用網站最多 {count} 個。",
    favoriteSiteExists: "{title} 已在常用網站中。",
    deleteCustomPortal: "刪除自訂入口",
    deleteBookmarkAction: "刪除",
    openSettings: "設定",
    closeSettings: "返回首頁",
    settingsBackHome: "返回首頁",
    help: "說明",
    settingsTitle: "設定",
    settingsSubtitle: "個人化 Wayleaf，管理同步與主題偏好。",
    settingsTabsLabel: "設定分類",
    settingsBasicTab: "基本設定",
    settingsSearchTab: "搜尋設定",
    settingsLaboratoryTab: "實驗室",
    videoPipLabTitle: "影片小視窗",
    videoPipLabDescription: "為相容的 HTML5 影片開啟畫中畫。",
    videoPipLabel: "啟用影片小視窗",
    videoPipHint: "點擊 Chrome 工具列的 Wayleaf 圖標，再選取頁面中的可播放影片。",
    languageSettingsTitle: "語言",
    appearanceModeTitle: "外觀",
    themeModeSystem: "跟隨系統",
    themeModeLight: "淺色",
    themeModeDark: "深色",
    presetPaletteTitle: "色彩",
    themePaletteSage: "Wayleaf",
    themePaletteForest: "墨綠",
    themePaletteAmber: "柚黃",
    themePaletteSky: "丹寧",
    themePalettePeach: "木瓜",
    themePaletteNeutral: "中性",
    syncSettingsTitle: "雲端同步",
    syncSettingsReady: "設定會跟隨 Chrome 帳號同步",
    syncSettingsReadyDetail: "",
    syncSettingsUnavailable: "目前瀏覽器不支援同步",
    syncSettingsUnavailableDetail: "仍會保存在這台裝置。",
    syncSettingsDone: "剛剛寫入同步區",
    syncSettingsDoneDetail: "Chrome 會自動分發到同帳號裝置。",
    syncSettingsNow: "手動同步",
    syncSettingsAuto: "自動同步",
    syncSettingsAutoHint: "每日同步",
    syncSettingsExport: "匯出",
    syncSettingsImport: "匯入",
    syncSettingsExported: "設定已匯出",
    syncSettingsExportedDetail: "已儲存 Wayleaf 全域設定檔。",
    syncSettingsImported: "設定已匯入",
    syncSettingsImportedDetail: "正在重新整理 Wayleaf。",
    syncSettingsImportFailed: "匯入失敗",
    syncSettingsImportFailedDetail: "請選擇 Wayleaf .wy 設定檔。",
    syncSettingsActionsLabel: "同步方式",
    brandBaidu: "百度",
    brandDoubao: "豆包",
    brandQwen: "千問",
    brandJimeng: "即夢",
    brandXiaohongshu: "小紅書",
    brandDouyin: "抖音",
    brandZhihu: "知乎",
    searchSettingsDefaultTitle: "基本搜尋",
    searchSettingsDefaultDescription: "設定普通關鍵字預設使用的搜尋入口",
    searchSettingsDefaultHint: "輸入普通關鍵字時，Wayleaf 會優先使用標記為預設的基本搜尋。",
    searchSettingsAiTitle: "AI 搜尋引擎",
    searchSettingsAiDescription: "修改內建 AI 引擎的名稱、觸發詞和搜尋連結",
    searchSettingsAiHint: "觸發詞用空格或逗號分隔，例如 /gpt /chatgpt。需要登入的平台請先完成首次登入再使用。",
    searchSettingsPlatformTitle: "平台搜尋",
    searchSettingsPlatformDescription: "使用以 * 開頭的內建啟用詞直達常用平台搜尋結果",
    searchSettingsPlatformHint: "輸入完整的 *平台縮寫或名稱（例如 *yt 或 *youtube）即可切換到對應平台；若短啟用詞也是其他平台的開頭（如 *x / *xhs），請按空格或 Enter 確認 *x。需要登入的平台請先完成首次登入再使用。",
    searchSettingsPlatformPrefix: "前綴",
    searchSettingsPlatformQuery: "內容",
    searchSettingsBuiltInBadge: "內建",
    platformSearchDirectBehavior: "直接打開平台搜尋結果",
    platformSearchLoginBehavior: "打開平台搜尋結果；如需登入請先完成首次登入",
    platformSearchFallbackBehavior: "使用平台 Web 搜尋入口；若站點限制搜尋，會保留已編碼查詢供手動恢復",
    searchSettingsSetDefault: "設為預設",
    searchSettingsDefaultBadge: "預設",
    searchSettingsEdit: "編輯",
    searchSettingsDoneEdit: "完成",
    searchSettingsEngineName: "名稱",
    searchSettingsEngineCommands: "觸發詞",
    searchSettingsEngineUrl: "搜尋連結",
    searchSettingsSave: "儲存搜尋設定",
    searchSettingsReset: "恢復預設",
    searchSettingsSaved: "搜尋設定已儲存。",
    searchSettingsResetDone: "已恢復預設搜尋設定。",
    onboardingKicker: "第一次使用",
    onboardingTitle: "先花一分鐘了解 Wayleaf",
    onboardingIntro: "Wayleaf 會把新分頁變成你的本機工作台。下面這些重點能幫你安全、順手地開始。",
    onboardingPrivacyTitle: "從中央搜尋列開始",
    onboardingPrivacyBody: "輸入關鍵字、網址或 /AI 指令，Wayleaf 會從這個主要區域開始搜尋與跳轉。",
    onboardingPermissionTitle: "新增自訂喜好網站",
    onboardingPermissionBody: "搜尋列下方可新增最多 5 個常用網站，點擊圖示即可快速開啟。",
    onboardingSyncTitle: "查看最常訪問",
    onboardingSyncBody: "下方會依網站整理最常訪問的網址，並保留同一網站的相關頁面。",
    onboardingAiTitle: "開啟導航中樞",
    onboardingAiBody: "左上角入口集中管理快捷網站與自選書籤資料夾。",
    onboardingStartTitle: "進入設定中心",
    onboardingStartBody: "右上角設定中心可調整語言、外觀、同步與搜尋偏好。",
    onboardingFeedbackTitle: "遇到問題直接回報",
    onboardingFeedbackBody: "回報時帶上瀏覽器、Wayleaf 版本和失敗場景，最容易定位。",
    onboardingFeedback: "回報問題",
    onboardingNext: "下一步",
    onboardingDone: "完成",
    closeOnboarding: "關閉指引",
    portalNameRequired: "請填寫入口名稱。",
    portalUrlRequired: "請輸入 http 或 https 開頭的網址。",
    customPortalLimit: "自訂入口最多 {count} 個。",
    savePortalFailed: "儲存入口失敗，請減少數量或縮短內容後重試。",
    loadCustomPortalsFailed: "讀取自訂入口失敗，請刷新後重試。",
    deletePortalFailed: "刪除入口失敗，請刷新後重試。",
    bookmarkNoFolder: "尚未選擇書籤資料夾。請從資料夾列表選擇一個。",
    bookmarkFolderMissing: "已選資料夾不存在，請重新選擇。",
    bookmarkEmpty: "這個資料夾裡沒有可顯示的網站書籤。",
    bookmarkReadFailed: "無法讀取書籤，請確認擴充功能已獲得 bookmarks 權限。",
    deleteBookmark: "刪除 {title}",
    deleteBookmarkFailed: "刪除失敗，可能已在其他位置變更。",
    loadingBookmarkFolders: "正在讀取書籤資料夾。",
    bookmarkFolderReadFailed: "無法讀取書籤資料夾。",
    noBookmarkFolders: "沒有找到包含網站書籤的資料夾。",
    pageCount: "{count} 個頁面",
    deleteHistory: "刪除 {title}",
    deleteHistoryFailed: "刪除失敗，可能已在其他位置變更。",
    openSiteHome: "打開 {name} 首頁",
    openPage: "打開 {title}",
    unnamedPage: "未命名頁面",
    website: "網站"
  },
  en: {
    topbarLabel: "Top bar",
    shellLabel: "Wayleaf dashboard",
    portalTitle: "Navigation hub",
    mobilePortalTab: "Bookmarks",
    mobileMediaTab: "Media",
    mobileHistoryTab: "History",
    smartPortalTab: "Recommended",
    bookmarkPortalTab: "Bookmarks",
    bookmarkSearchPlaceholder: "Search current folder",
    bookmarkFolders: "Bookmark folders",
    bookmarkSortLabel: "Sort bookmarks",
    bookmarkSortRecent: "Recently added",
    bookmarkSortTitle: "A–Z",
    bookmarkSearchEmpty: "No matching bookmarks.",
    portalCategoryFeatured: "Frequent shortcuts",
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
    portalCategoryPortal: "Portals",
    portalCategories: "Recommended categories",
    portalCategoriesExpand: "Expand",
    portalCategoriesCollapse: "Collapse",
    addPortal: "Add portal",
    portalName: "Name",
    portalUrl: "URL",
    portalCategory: "Category",
    portalNamePlaceholder: "Example: Notion",
    portalUrlPlaceholder: "https://www.notion.so",
    cancel: "Cancel",
    add: "Add",
    refreshBookmarkFolder: "Refresh current bookmark folder",
    collapseSurface: "Collapse panel",
    back: "Back",
    chooseBookmarkFolderPrompt: "Choose a bookmark folder",
    historyTitle: "Most visited",
    todayHistoryTitle: "Today history",
    todayHistoryEmpty: "No browsing history today.",
    recentViewToggleToToday: "Show today's history",
    recentViewToggleToRecent: "Show most visited",
    todayHistoryPrevious: "Previous today history rows",
    todayHistoryNext: "Next today history rows",
    openPortalSurface: "Open navigation hub",
    recentFoldersSwitch: "Switch most visited cards",
    recentFoldersPrevious: "Previous most visited cards",
    recentFoldersNext: "Next most visited cards",
    historyPreviousPage: "Previous most visited page",
    historyNextPage: "Next most visited page",
    quickSearchPlaceholder: "Search or enter URL",
    googleImageSearch: "Search by image with Google",
    aiAttachmentAdd: "Add files to {engine}",
    aiAttachmentClear: "Remove attachments",
    aiAttachmentCount: "{count} files",
    quickSearch: "Search",
    quickSearchLocal: "Open",
    quickSearchAggregate: "Aggregate search",
    quickSearchAiCommandHint: "Type /gpt, /claude, /gemini, /grok, /deepseek, /doubao, /kimi, or /glm to switch AI",
    quickSearchAiSelected: "Selected",
    quickSearchEngine: "Search mode",
    quickSearchWith: "Search with {engine}",
    quickSearchWithGoogleAi: "Search with Google AI",
    quickSearchWithAi: "Send to {engine}",
    quickSearchAiPlaceholder: "Ask with {engine}",
    quickSearchWithPlatform: "Search on {platform}",
    quickSearchPlatformPlaceholder: "Search on {platform}",
    quickSearchPlatformActivationHint: "Type {prefix} for {platform}",
    localSearchHistory: "History",
    localSearchBookmark: "Bookmark",
    localSearchNoResults: "No matching history or bookmarks.",
    addFavoriteSite: "Add favorite site",
    addBookmarkToFavorites: "Add {title} to favorite sites",
    deleteFavoriteSite: "Remove favorite site",
    favoriteSiteLimit: "Up to {count} favorite sites.",
    favoriteSiteExists: "{title} is already in favorite sites.",
    portalCategoryItems: "{count} shortcuts",
    deleteCustomPortal: "Remove custom portal",
    openSettings: "Settings",
    closeSettings: "Back home",
    settingsBackHome: "Back home",
    help: "Help",
    settingsTitle: "Settings",
    settingsSubtitle: "Personalize Wayleaf and manage sync and theme preferences.",
    settingsTabsLabel: "Settings categories",
    settingsBasicTab: "Basic",
    settingsSearchTab: "Search",
    settingsLaboratoryTab: "Laboratory",
    videoPipLabTitle: "Video mini-player",
    videoPipLabDescription: "Open compatible HTML5 video in Picture-in-Picture.",
    videoPipLabel: "Enable video mini-player",
    videoPipHint: "Click the Wayleaf icon in the Chrome toolbar, then select a playable video on the page.",
    languageSettingsTitle: "Language",
    appearanceModeTitle: "Appearance",
    themeModeSystem: "System",
    themeModeLight: "Light",
    themeModeDark: "Dark",
    presetPaletteTitle: "Colors",
    themePaletteSage: "Wayleaf",
    themePaletteForest: "Forest",
    themePaletteAmber: "Yuzu",
    themePaletteSky: "Denim",
    themePalettePeach: "Papaya",
    themePaletteNeutral: "Neutral",
    syncSettingsTitle: "Cloud sync",
    syncSettingsReady: "Settings sync with your Chrome account",
    syncSettingsReadyDetail: "",
    syncSettingsUnavailable: "Sync is unavailable in this browser",
    syncSettingsUnavailableDetail: "Settings still stay on this device.",
    syncSettingsDone: "Written to sync storage",
    syncSettingsDoneDetail: "Chrome will distribute it to signed-in devices.",
    syncSettingsNow: "Sync now",
    syncSettingsAuto: "Auto sync",
    syncSettingsAutoHint: "Daily sync",
    syncSettingsExport: "Export",
    syncSettingsImport: "Import",
    syncSettingsExported: "Config exported",
    syncSettingsExportedDetail: "Wayleaf global config file was saved.",
    syncSettingsImported: "Config imported",
    syncSettingsImportedDetail: "Refreshing Wayleaf.",
    syncSettingsImportFailed: "Import failed",
    syncSettingsImportFailedDetail: "Choose a Wayleaf .wy config file.",
    syncSettingsActionsLabel: "Sync method",
    brandBaidu: "Baidu",
    brandDoubao: "Doubao",
    brandQwen: "Qwen",
    brandJimeng: "Jimeng",
    brandXiaohongshu: "RedNote",
    brandDouyin: "Douyin",
    brandZhihu: "Zhihu",
    searchSettingsDefaultTitle: "Basic search",
    searchSettingsDefaultDescription: "Configure the search entry used for regular queries",
    searchSettingsDefaultHint: "Wayleaf uses the basic search marked as default for regular keywords.",
    searchSettingsAiTitle: "AI search engines",
    searchSettingsAiDescription: "Edit built-in AI engine names, triggers, and search links",
    searchSettingsAiHint: "Separate triggers with spaces or commas, for example /gpt /chatgpt. Sign in to platforms that require login before first use.",
    searchSettingsPlatformTitle: "Platform search",
    searchSettingsPlatformDescription: "Use built-in *-prefixed activators to jump to common platform search results",
    searchSettingsPlatformHint: "Type a complete * platform abbreviation or name (for example, *yt or *youtube) to switch platforms. When a short activator also starts another platform (such as *x / *xhs), press Space or Enter to confirm *x. Sign in first when a platform requires login.",
    searchSettingsPlatformPrefix: "Prefix",
    searchSettingsPlatformQuery: "query",
    searchSettingsBuiltInBadge: "Built in",
    platformSearchDirectBehavior: "Opens the platform search results directly",
    platformSearchLoginBehavior: "Opens platform search results; sign in first if required",
    platformSearchFallbackBehavior: "Uses the platform web search entry; if the site limits search, the encoded query remains recoverable",
    searchSettingsSetDefault: "Set default",
    searchSettingsDefaultBadge: "Default",
    searchSettingsEdit: "Edit",
    searchSettingsDoneEdit: "Done",
    searchSettingsEngineName: "Name",
    searchSettingsEngineCommands: "Triggers",
    searchSettingsEngineUrl: "Search link",
    searchSettingsSave: "Save search settings",
    searchSettingsReset: "Restore defaults",
    searchSettingsSaved: "Search settings saved.",
    searchSettingsResetDone: "Default search settings restored.",
    onboardingKicker: "First run",
    onboardingTitle: "Take one minute to understand Wayleaf",
    onboardingIntro: "Wayleaf turns your new tab into a local workspace. These notes help you start safely and smoothly.",
    onboardingPrivacyTitle: "Start with the center search bar",
    onboardingPrivacyBody: "Enter a keyword, URL, or /AI command here to search and jump directly to a destination.",
    onboardingPermissionTitle: "Add favorite websites",
    onboardingPermissionBody: "Add up to five favorite sites below the search bar, then open them with one click.",
    onboardingSyncTitle: "Review most visited",
    onboardingSyncBody: "Frequently visited URLs are grouped by website below, including related pages from the same site.",
    onboardingAiTitle: "Open the navigation hub",
    onboardingAiBody: "Use the top-left hub to manage shortcuts and selected bookmark folders.",
    onboardingStartTitle: "Open Settings",
    onboardingStartBody: "Use the top-right Settings center for language, appearance, sync, and search preferences.",
    onboardingFeedbackTitle: "Report issues directly",
    onboardingFeedbackBody: "Include your browser, Wayleaf version, and the failed scenario so the issue is easy to reproduce.",
    onboardingFeedback: "Report issue",
    onboardingNext: "Next",
    onboardingDone: "Finish",
    closeOnboarding: "Close guide",
    portalNameRequired: "Enter a portal name.",
    portalUrlRequired: "Enter an http or https URL.",
    customPortalLimit: "You can add up to {count} custom portals.",
    savePortalFailed: "Could not save this portal. Try fewer or shorter entries.",
    loadCustomPortalsFailed: "Could not load custom portals. Refresh and try again.",
    deletePortalFailed: "Could not remove this portal. Refresh and try again.",
    bookmarkNoFolder: "No bookmark folder selected. Choose one from the folder list.",
    bookmarkFolderMissing: "The selected folder no longer exists. Choose another folder.",
    unnamedFolder: "Untitled folder",
    bookmarkMeta: "{folder} · {count} sites",
    bookmarkRecentTitle: "Recently added",
    bookmarkRecentMeta: "Last 3 days",
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
    deleteHistory: "Remove {title}",
    deleteHistoryFailed: "Could not remove it. It may have changed elsewhere.",
    openSiteHome: "Open {name} home page",
    openPage: "Open {title}",
    unnamedPage: "Untitled page",
    website: "Website"
  },
  ja: {
    portalTitle: "ナビゲーションハブ",
    addPortal: "入口を追加",
    portalName: "名前",
    portalUrl: "URL",
    cancel: "キャンセル",
    add: "追加",
    bookmarksTitle: "ブックマーク",
    back: "戻る",
    chooseBookmarkFolderPrompt: "ブックマークフォルダを選択",
    historyTitle: "よく見るサイト",
    todayHistoryTitle: "今日の履歴",
    todayHistoryEmpty: "今日の履歴はありません。",
    recentViewToggleToToday: "今日の履歴に切り替え",
    recentViewToggleToRecent: "よく見るサイトに切り替え",
    todayHistoryPrevious: "前の今日の履歴",
    todayHistoryNext: "次の今日の履歴",
    unnamedFolder: "名称未設定のフォルダ",
    bookmarkRoot: "ブックマーク",
    bookmarkMeta: "{folder} · {count} 件のサイト",
    bookmarkRecentTitle: "最近追加",
    bookmarkRecentMeta: "3日以内",
    bookmarkCount: "{count} 件のサイト",
    unnamedPage: "名称未設定のページ",
    website: "Website",
    quickSearchAggregate: "統合検索",
    openSettings: "設定",
    closeSettings: "ホームに戻る",
    settingsBackHome: "ホームに戻る",
    help: "ヘルプ",
    settingsTitle: "設定",
    settingsSubtitle: "Wayleaf をカスタマイズし、同期とテーマ設定を管理します。",
    settingsTabsLabel: "設定カテゴリ",
    settingsBasicTab: "基本",
    settingsSearchTab: "検索",
    settingsLaboratoryTab: "ラボ",
    videoPipLabTitle: "動画ミニプレーヤー",
    videoPipLabDescription: "対応する HTML5 動画をピクチャーインピクチャーで開きます。",
    videoPipLabel: "動画ミニプレーヤーを有効化",
    videoPipHint: "Chrome ツールバーの Wayleaf アイコンをクリックし、ページ内の再生可能な動画を選択します。",
    languageSettingsTitle: "言語",
    appearanceModeTitle: "外観",
    themeModeSystem: "システム",
    themeModeLight: "ライト",
    themeModeDark: "ダーク",
    presetPaletteTitle: "カラー",
    themePaletteSage: "Wayleaf",
    themePaletteForest: "フォレスト",
    themePaletteAmber: "柚子",
    themePaletteSky: "デニム",
    themePalettePeach: "パパイヤ",
    themePaletteNeutral: "ニュートラル",
    syncSettingsTitle: "クラウド同期",
    syncSettingsReady: "Chrome アカウントで設定を同期します",
    syncSettingsReadyDetail: "",
    syncSettingsUnavailable: "このブラウザでは同期を利用できません",
    syncSettingsUnavailableDetail: "設定はこのデバイスに保存されます。",
    syncSettingsDone: "同期ストレージに書き込みました",
    syncSettingsDoneDetail: "Chrome が同じアカウントのデバイスへ配信します。",
    syncSettingsNow: "今すぐ同期",
    syncSettingsAuto: "自動同期",
    syncSettingsAutoHint: "毎日同期",
    syncSettingsExport: "エクスポート",
    syncSettingsImport: "インポート",
    syncSettingsExported: "設定をエクスポートしました",
    syncSettingsExportedDetail: "Wayleaf の全体設定ファイルを保存しました。",
    syncSettingsImported: "設定をインポートしました",
    syncSettingsImportedDetail: "Wayleaf を更新しています。",
    syncSettingsImportFailed: "インポートに失敗しました",
    syncSettingsImportFailedDetail: "Wayleaf .wy 設定ファイルを選択してください。",
    syncSettingsActionsLabel: "同期方法",
    brandBaidu: "Baidu",
    brandDoubao: "Doubao",
    brandQwen: "Qwen",
    brandJimeng: "Jimeng",
    brandXiaohongshu: "RedNote",
    brandDouyin: "Douyin",
    brandZhihu: "Zhihu",
    searchSettingsDefaultTitle: "基本検索",
    searchSettingsDefaultDescription: "通常のキーワードで使う検索先を設定",
    searchSettingsDefaultHint: "通常のキーワードでは、既定に設定した基本検索を優先して使います。",
    searchSettingsAiTitle: "AI 検索エンジン",
    searchSettingsAiDescription: "内蔵 AI エンジンの名前、トリガー、検索リンクを編集",
    searchSettingsAiHint: "トリガーはスペースまたはカンマで区切ります。例: /gpt /chatgpt。ログインが必要なプラットフォームは初回利用前にログインしてください。",
    searchSettingsPlatformTitle: "プラットフォーム検索",
    searchSettingsPlatformDescription: "* で始まる内蔵アクティベーターで主要プラットフォームの検索結果へ移動",
    searchSettingsPlatformHint: "完全な * プラットフォーム略称または名前（例: *yt、*youtube）を入力すると切り替わります。短いアクティベーターが別の候補の先頭でもある場合（*x / *xhs など）、*x はスペースまたは Enter で確定します。ログインが必要な場合は先にログインしてください。",
    searchSettingsPlatformPrefix: "プレフィックス",
    searchSettingsPlatformQuery: "query",
    searchSettingsBuiltInBadge: "内蔵",
    platformSearchDirectBehavior: "プラットフォーム検索結果を直接開く",
    platformSearchLoginBehavior: "検索結果を開きます。必要な場合は先にログインしてください",
    platformSearchFallbackBehavior: "Web 検索入口を使用し、制限時もエンコード済みクエリを保持します",
    searchSettingsSetDefault: "既定にする",
    searchSettingsDefaultBadge: "既定",
    searchSettingsEdit: "編集",
    searchSettingsDoneEdit: "完了",
    searchSettingsEngineName: "名前",
    searchSettingsEngineCommands: "トリガー",
    searchSettingsEngineUrl: "検索リンク",
    searchSettingsSave: "検索設定を保存",
    searchSettingsReset: "既定に戻す",
    searchSettingsSaved: "検索設定を保存しました。",
    searchSettingsResetDone: "既定の検索設定に戻しました。"
  },
  ko: {
    portalTitle: "탐색 허브",
    addPortal: "항목 추가",
    portalName: "이름",
    portalUrl: "URL",
    cancel: "취소",
    add: "추가",
    bookmarksTitle: "북마크",
    back: "뒤로",
    chooseBookmarkFolderPrompt: "북마크 폴더 선택",
    historyTitle: "자주 방문",
    todayHistoryTitle: "오늘 기록",
    todayHistoryEmpty: "오늘 기록이 없습니다.",
    recentViewToggleToToday: "오늘 기록으로 전환",
    recentViewToggleToRecent: "자주 방문으로 전환",
    todayHistoryPrevious: "이전 오늘 기록",
    todayHistoryNext: "다음 오늘 기록",
    unnamedFolder: "이름 없는 폴더",
    bookmarkRoot: "북마크",
    bookmarkMeta: "{folder} · 사이트 {count}개",
    bookmarkRecentTitle: "최근 추가",
    bookmarkRecentMeta: "최근 3일",
    bookmarkCount: "사이트 {count}개",
    unnamedPage: "제목 없는 페이지",
    website: "Website",
    quickSearchAggregate: "통합 검색",
    openSettings: "설정",
    closeSettings: "홈으로 돌아가기",
    settingsBackHome: "홈으로 돌아가기",
    help: "도움말",
    settingsTitle: "설정",
    settingsSubtitle: "Wayleaf를 개인화하고 동기화와 테마 환경설정을 관리합니다.",
    settingsTabsLabel: "설정 분류",
    settingsBasicTab: "기본",
    settingsSearchTab: "검색",
    settingsLaboratoryTab: "실험실",
    videoPipLabTitle: "동영상 미니 플레이어",
    videoPipLabDescription: "호환 HTML5 동영상을 화면 속 화면으로 엽니다.",
    videoPipLabel: "동영상 미니 플레이어 사용",
    videoPipHint: "Chrome 도구 모음의 Wayleaf 아이콘을 클릭한 뒤 페이지의 재생 가능한 동영상을 선택하세요.",
    languageSettingsTitle: "언어",
    appearanceModeTitle: "모양",
    themeModeSystem: "시스템",
    themeModeLight: "라이트",
    themeModeDark: "다크",
    presetPaletteTitle: "색상",
    themePaletteSage: "Wayleaf",
    themePaletteForest: "포레스트",
    themePaletteAmber: "유자",
    themePaletteSky: "데님",
    themePalettePeach: "파파야",
    themePaletteNeutral: "중립",
    syncSettingsTitle: "클라우드 동기화",
    syncSettingsReady: "Chrome 계정과 설정이 동기화됩니다",
    syncSettingsReadyDetail: "",
    syncSettingsUnavailable: "이 브라우저에서는 동기화를 사용할 수 없습니다",
    syncSettingsUnavailableDetail: "설정은 이 기기에 계속 저장됩니다.",
    syncSettingsDone: "동기화 저장소에 기록했습니다",
    syncSettingsDoneDetail: "Chrome이 같은 계정의 기기로 배포합니다.",
    syncSettingsNow: "지금 동기화",
    syncSettingsAuto: "자동 동기화",
    syncSettingsAutoHint: "매일 동기화",
    syncSettingsExport: "내보내기",
    syncSettingsImport: "가져오기",
    syncSettingsExported: "설정을 내보냈습니다",
    syncSettingsExportedDetail: "Wayleaf 전역 설정 파일을 저장했습니다.",
    syncSettingsImported: "설정을 가져왔습니다",
    syncSettingsImportedDetail: "Wayleaf를 새로고침합니다.",
    syncSettingsImportFailed: "가져오기 실패",
    syncSettingsImportFailedDetail: "Wayleaf .wy 설정 파일을 선택하세요.",
    syncSettingsActionsLabel: "동기화 방식",
    brandBaidu: "Baidu",
    brandDoubao: "Doubao",
    brandQwen: "Qwen",
    brandJimeng: "Jimeng",
    brandXiaohongshu: "RedNote",
    brandDouyin: "Douyin",
    brandZhihu: "Zhihu",
    searchSettingsDefaultTitle: "기본 검색",
    searchSettingsDefaultDescription: "일반 키워드에 사용할 기본 검색 항목 설정",
    searchSettingsDefaultHint: "일반 키워드에는 기본으로 표시된 기본 검색을 우선 사용합니다.",
    searchSettingsAiTitle: "AI 검색 엔진",
    searchSettingsAiDescription: "내장 AI 엔진의 이름, 트리거, 검색 링크 편집",
    searchSettingsAiHint: "트리거는 공백 또는 쉼표로 구분하세요. 예: /gpt /chatgpt. 로그인이 필요한 플랫폼은 먼저 로그인하세요.",
    searchSettingsPlatformTitle: "플랫폼 검색",
    searchSettingsPlatformDescription: "*로 시작하는 내장 활성어로 주요 플랫폼 검색 결과 열기",
    searchSettingsPlatformHint: "완전한 * 플랫폼 약칭 또는 이름(예: *yt 또는 *youtube)을 입력하면 전환됩니다. 짧은 활성어가 다른 플랫폼의 시작이기도 한 경우(예: *x / *xhs), 스페이스나 Enter로 *x를 확정하세요. 로그인이 필요한 경우 먼저 로그인하세요.",
    searchSettingsPlatformPrefix: "접두어",
    searchSettingsPlatformQuery: "query",
    searchSettingsBuiltInBadge: "내장",
    platformSearchDirectBehavior: "플랫폼 검색 결과를 바로 엽니다",
    platformSearchLoginBehavior: "검색 결과를 엽니다. 필요한 경우 먼저 로그인하세요",
    platformSearchFallbackBehavior: "웹 검색 입구를 사용하며, 제한 시 인코딩된 쿼리를 유지합니다",
    searchSettingsSetDefault: "기본값으로 설정",
    searchSettingsDefaultBadge: "기본값",
    searchSettingsEdit: "편집",
    searchSettingsDoneEdit: "완료",
    searchSettingsEngineName: "이름",
    searchSettingsEngineCommands: "트리거",
    searchSettingsEngineUrl: "검색 링크",
    searchSettingsSave: "검색 설정 저장",
    searchSettingsReset: "기본값 복원",
    searchSettingsSaved: "검색 설정을 저장했습니다.",
    searchSettingsResetDone: "기본 검색 설정을 복원했습니다."
  },
  es: {
    portalTitle: "Centro de navegación",
    addPortal: "Agregar acceso",
    portalName: "Nombre",
    portalUrl: "URL",
    cancel: "Cancelar",
    add: "Agregar",
    bookmarksTitle: "Marcadores",
    back: "Volver",
    chooseBookmarkFolderPrompt: "Elige una carpeta de marcadores",
    historyTitle: "Más visitados",
    todayHistoryTitle: "Historial de hoy",
    todayHistoryEmpty: "No hay historial de hoy.",
    recentViewToggleToToday: "Cambiar al historial de hoy",
    recentViewToggleToRecent: "Cambiar a más visitados",
    todayHistoryPrevious: "Historial de hoy anterior",
    todayHistoryNext: "Historial de hoy siguiente",
    unnamedFolder: "Carpeta sin título",
    bookmarkRoot: "Marcadores",
    bookmarkMeta: "{folder} · {count} sitios",
    bookmarkRecentTitle: "Añadidos recientemente",
    bookmarkRecentMeta: "Últimos 3 días",
    bookmarkCount: "{count} sitios",
    unnamedPage: "Página sin título",
    website: "Website",
    quickSearchAggregate: "Búsqueda agregada",
    openSettings: "Configuración",
    closeSettings: "Volver al inicio",
    settingsBackHome: "Volver al inicio",
    help: "Ayuda",
    settingsTitle: "Configuración",
    settingsSubtitle: "Personaliza Wayleaf y gestiona la sincronización y el tema.",
    settingsTabsLabel: "Categorías de configuración",
    settingsBasicTab: "Básico",
    settingsSearchTab: "Búsqueda",
    settingsLaboratoryTab: "Laboratorio",
    videoPipLabTitle: "Mini reproductor de vídeo",
    videoPipLabDescription: "Abre vídeo HTML5 compatible en imagen dentro de imagen.",
    videoPipLabel: "Activar mini reproductor de vídeo",
    videoPipHint: "Haz clic en el icono de Wayleaf en la barra de Chrome y selecciona un vídeo reproducible en la página.",
    languageSettingsTitle: "Idioma",
    appearanceModeTitle: "Apariencia",
    themeModeSystem: "Sistema",
    themeModeLight: "Claro",
    themeModeDark: "Oscuro",
    presetPaletteTitle: "Colores",
    themePaletteSage: "Wayleaf",
    themePaletteForest: "Bosque",
    themePaletteAmber: "Yuzu",
    themePaletteSky: "Denim",
    themePalettePeach: "Papaya",
    themePaletteNeutral: "Neutro",
    syncSettingsTitle: "Sincronización en la nube",
    syncSettingsReady: "Los ajustes se sincronizan con tu cuenta de Chrome",
    syncSettingsReadyDetail: "",
    syncSettingsUnavailable: "La sincronización no está disponible en este navegador",
    syncSettingsUnavailableDetail: "Los ajustes seguirán en este dispositivo.",
    syncSettingsDone: "Escrito en el almacenamiento de sincronización",
    syncSettingsDoneDetail: "Chrome lo distribuirá a los dispositivos de la misma cuenta.",
    syncSettingsNow: "Sincronizar",
    syncSettingsAuto: "Sincronización automática",
    syncSettingsAutoHint: "Sync diaria",
    syncSettingsExport: "Exportar",
    syncSettingsImport: "Importar",
    syncSettingsExported: "Configuración exportada",
    syncSettingsExportedDetail: "Se guardó el archivo global de Wayleaf.",
    syncSettingsImported: "Configuración importada",
    syncSettingsImportedDetail: "Actualizando Wayleaf.",
    syncSettingsImportFailed: "Error al importar",
    syncSettingsImportFailedDetail: "Elige un archivo .wy de Wayleaf.",
    syncSettingsActionsLabel: "Método de sincronización",
    brandBaidu: "Baidu",
    brandDoubao: "Doubao",
    brandQwen: "Qwen",
    brandJimeng: "Jimeng",
    brandXiaohongshu: "RedNote",
    brandDouyin: "Douyin",
    brandZhihu: "Zhihu",
    searchSettingsDefaultTitle: "Búsqueda básica",
    searchSettingsDefaultDescription: "Configura el buscador para consultas normales",
    searchSettingsDefaultHint: "Wayleaf usa el buscador básico marcado como predeterminado para palabras clave normales.",
    searchSettingsAiTitle: "Motores de búsqueda de IA",
    searchSettingsAiDescription: "Edita nombres, activadores y enlaces de búsqueda de los motores de IA integrados",
    searchSettingsAiHint: "Separa los activadores con espacios o comas, por ejemplo /gpt /chatgpt. Inicia sesión antes en las plataformas que lo requieran.",
    searchSettingsPlatformTitle: "Búsqueda de plataformas",
    searchSettingsPlatformDescription: "Usa activadores integrados que empiezan por * para abrir resultados en plataformas comunes",
    searchSettingsPlatformHint: "Escribe una abreviatura o nombre de plataforma completo con * (por ejemplo, *yt o *youtube) para cambiar. Si un activador corto también inicia otro (como *x / *xhs), pulsa Espacio o Enter para confirmar *x. Inicia sesión primero si hace falta.",
    searchSettingsPlatformPrefix: "Prefijo",
    searchSettingsPlatformQuery: "query",
    searchSettingsBuiltInBadge: "Integrado",
    platformSearchDirectBehavior: "Abre directamente los resultados de la plataforma",
    platformSearchLoginBehavior: "Abre resultados de la plataforma; inicia sesión primero si hace falta",
    platformSearchFallbackBehavior: "Usa la entrada web de búsqueda y conserva la consulta codificada si el sitio limita la búsqueda",
    searchSettingsSetDefault: "Predeterminar",
    searchSettingsDefaultBadge: "Predeterminado",
    searchSettingsEdit: "Editar",
    searchSettingsDoneEdit: "Listo",
    searchSettingsEngineName: "Nombre",
    searchSettingsEngineCommands: "Activadores",
    searchSettingsEngineUrl: "Enlace de búsqueda",
    searchSettingsSave: "Guardar ajustes de búsqueda",
    searchSettingsReset: "Restaurar valores",
    searchSettingsSaved: "Ajustes de búsqueda guardados.",
    searchSettingsResetDone: "Ajustes de búsqueda predeterminados restaurados."
  },
  fr: {
    portalTitle: "Centre de navigation",
    addPortal: "Ajouter un raccourci",
    portalName: "Nom",
    portalUrl: "URL",
    cancel: "Annuler",
    add: "Ajouter",
    bookmarksTitle: "Favoris",
    back: "Retour",
    chooseBookmarkFolderPrompt: "Choisir un dossier de favoris",
    historyTitle: "Les plus visités",
    todayHistoryTitle: "Historique du jour",
    todayHistoryEmpty: "Aucun historique aujourd'hui.",
    recentViewToggleToToday: "Afficher l'historique du jour",
    recentViewToggleToRecent: "Afficher les plus visités",
    todayHistoryPrevious: "Historique du jour précédent",
    todayHistoryNext: "Historique du jour suivant",
    unnamedFolder: "Dossier sans titre",
    bookmarkRoot: "Favoris",
    bookmarkMeta: "{folder} · {count} sites",
    bookmarkRecentTitle: "Ajouts récents",
    bookmarkRecentMeta: "3 derniers jours",
    bookmarkCount: "{count} sites",
    unnamedPage: "Page sans titre",
    website: "Website",
    quickSearchAggregate: "Recherche agrégée",
    openSettings: "Paramètres",
    closeSettings: "Retour à l'accueil",
    settingsBackHome: "Retour à l'accueil",
    help: "Aide",
    settingsTitle: "Paramètres",
    settingsSubtitle: "Personnalisez Wayleaf et gérez la synchronisation et le thème.",
    settingsTabsLabel: "Catégories de paramètres",
    settingsBasicTab: "Général",
    settingsSearchTab: "Recherche",
    settingsLaboratoryTab: "Laboratoire",
    videoPipLabTitle: "Mini-lecteur vidéo",
    videoPipLabDescription: "Ouvrez une vidéo HTML5 compatible en mode image dans l’image.",
    videoPipLabel: "Activer le mini-lecteur vidéo",
    videoPipHint: "Cliquez sur l’icône Wayleaf dans la barre d’outils Chrome, puis sélectionnez une vidéo lisible sur la page.",
    languageSettingsTitle: "Langue",
    appearanceModeTitle: "Apparence",
    themeModeSystem: "Système",
    themeModeLight: "Clair",
    themeModeDark: "Sombre",
    presetPaletteTitle: "Couleurs",
    themePaletteSage: "Wayleaf",
    themePaletteForest: "Forêt",
    themePaletteAmber: "Yuzu",
    themePaletteSky: "Denim",
    themePalettePeach: "Papaye",
    themePaletteNeutral: "Neutre",
    syncSettingsTitle: "Synchronisation cloud",
    syncSettingsReady: "Les paramètres se synchronisent avec votre compte Chrome",
    syncSettingsReadyDetail: "",
    syncSettingsUnavailable: "La synchronisation n'est pas disponible dans ce navigateur",
    syncSettingsUnavailableDetail: "Les paramètres restent sur cet appareil.",
    syncSettingsDone: "Écrit dans le stockage synchronisé",
    syncSettingsDoneDetail: "Chrome le diffusera aux appareils du même compte.",
    syncSettingsNow: "Synchroniser",
    syncSettingsAuto: "Synchro auto",
    syncSettingsAutoHint: "Sync quotidienne",
    syncSettingsExport: "Exporter",
    syncSettingsImport: "Importer",
    syncSettingsExported: "Configuration exportée",
    syncSettingsExportedDetail: "Le fichier global Wayleaf a été enregistré.",
    syncSettingsImported: "Configuration importée",
    syncSettingsImportedDetail: "Actualisation de Wayleaf.",
    syncSettingsImportFailed: "Échec de l'import",
    syncSettingsImportFailedDetail: "Choisissez un fichier Wayleaf .wy.",
    syncSettingsActionsLabel: "Méthode de synchronisation",
    brandBaidu: "Baidu",
    brandDoubao: "Doubao",
    brandQwen: "Qwen",
    brandJimeng: "Jimeng",
    brandXiaohongshu: "RedNote",
    brandDouyin: "Douyin",
    brandZhihu: "Zhihu",
    searchSettingsDefaultTitle: "Recherche de base",
    searchSettingsDefaultDescription: "Configurer le moteur utilisé pour les requêtes normales",
    searchSettingsDefaultHint: "Wayleaf utilise le moteur de base marqué par défaut pour les mots-clés normaux.",
    searchSettingsAiTitle: "Moteurs de recherche IA",
    searchSettingsAiDescription: "Modifier les noms, déclencheurs et liens de recherche des moteurs IA intégrés",
    searchSettingsAiHint: "Séparez les déclencheurs par des espaces ou des virgules, par exemple /gpt /chatgpt. Connectez-vous d'abord aux plateformes qui l'exigent.",
    searchSettingsPlatformTitle: "Recherche de plateformes",
    searchSettingsPlatformDescription: "Utiliser des déclencheurs intégrés commençant par * pour ouvrir les résultats de plateformes courantes",
    searchSettingsPlatformHint: "Saisissez une abréviation ou un nom de plateforme complet avec * (par exemple *yt ou *youtube) pour basculer. Si un activateur court commence aussi un autre activateur (comme *x / *xhs), appuyez sur Espace ou Entrée pour confirmer *x. Connectez-vous d'abord si nécessaire.",
    searchSettingsPlatformPrefix: "Préfixe",
    searchSettingsPlatformQuery: "query",
    searchSettingsBuiltInBadge: "Intégré",
    platformSearchDirectBehavior: "Ouvre directement les résultats de la plateforme",
    platformSearchLoginBehavior: "Ouvre les résultats de la plateforme ; connectez-vous d'abord si nécessaire",
    platformSearchFallbackBehavior: "Utilise l'entrée de recherche Web et garde la requête encodée si le site limite la recherche",
    searchSettingsSetDefault: "Définir par défaut",
    searchSettingsDefaultBadge: "Par défaut",
    searchSettingsEdit: "Modifier",
    searchSettingsDoneEdit: "Terminé",
    searchSettingsEngineName: "Nom",
    searchSettingsEngineCommands: "Déclencheurs",
    searchSettingsEngineUrl: "Lien de recherche",
    searchSettingsSave: "Enregistrer les paramètres",
    searchSettingsReset: "Restaurer les valeurs par défaut",
    searchSettingsSaved: "Paramètres de recherche enregistrés.",
    searchSettingsResetDone: "Paramètres de recherche par défaut restaurés."
  },
  de: {
    portalTitle: "Navigationszentrale",
    addPortal: "Eintrag hinzufügen",
    portalName: "Name",
    portalUrl: "URL",
    cancel: "Abbrechen",
    add: "Hinzufügen",
    bookmarksTitle: "Lesezeichen",
    back: "Zurück",
    chooseBookmarkFolderPrompt: "Lesezeichenordner auswählen",
    historyTitle: "Meistbesucht",
    todayHistoryTitle: "Heutiger Verlauf",
    todayHistoryEmpty: "Heute gibt es keinen Verlauf.",
    recentViewToggleToToday: "Zum heutigen Verlauf wechseln",
    recentViewToggleToRecent: "Zu meistbesucht wechseln",
    todayHistoryPrevious: "Vorheriger heutiger Verlauf",
    todayHistoryNext: "Nächster heutiger Verlauf",
    unnamedFolder: "Unbenannter Ordner",
    bookmarkRoot: "Lesezeichen",
    bookmarkMeta: "{folder} · {count} Websites",
    bookmarkRecentTitle: "Neu hinzugefügt",
    bookmarkRecentMeta: "Letzte 3 Tage",
    bookmarkCount: "{count} Websites",
    unnamedPage: "Unbenannte Seite",
    website: "Website",
    quickSearchAggregate: "Aggregierte Suche",
    openSettings: "Einstellungen",
    closeSettings: "Zur Startseite",
    settingsBackHome: "Zur Startseite",
    help: "Hilfe",
    settingsTitle: "Einstellungen",
    settingsSubtitle: "Personalisiere Wayleaf und verwalte Synchronisierung und Design.",
    settingsTabsLabel: "Einstellungskategorien",
    settingsBasicTab: "Allgemein",
    settingsSearchTab: "Suche",
    settingsLaboratoryTab: "Labor",
    videoPipLabTitle: "Video-Miniplayer",
    videoPipLabDescription: "Öffnet kompatible HTML5-Videos im Bild-in-Bild-Modus.",
    videoPipLabel: "Video-Miniplayer aktivieren",
    videoPipHint: "Klicken Sie in der Chrome-Symbolleiste auf das Wayleaf-Symbol und wählen Sie ein abspielbares Video auf der Seite aus.",
    languageSettingsTitle: "Sprache",
    appearanceModeTitle: "Darstellung",
    themeModeSystem: "System",
    themeModeLight: "Hell",
    themeModeDark: "Dunkel",
    presetPaletteTitle: "Farben",
    themePaletteSage: "Wayleaf",
    themePaletteForest: "Wald",
    themePaletteAmber: "Yuzu",
    themePaletteSky: "Denim",
    themePalettePeach: "Papaya",
    themePaletteNeutral: "Neutral",
    syncSettingsTitle: "Cloud-Synchronisierung",
    syncSettingsReady: "Einstellungen werden mit deinem Chrome-Konto synchronisiert",
    syncSettingsReadyDetail: "",
    syncSettingsUnavailable: "Synchronisierung ist in diesem Browser nicht verfügbar",
    syncSettingsUnavailableDetail: "Einstellungen bleiben auf diesem Gerät.",
    syncSettingsDone: "In den Sync-Speicher geschrieben",
    syncSettingsDoneDetail: "Chrome verteilt sie an Geräte mit demselben Konto.",
    syncSettingsNow: "Jetzt synchronisieren",
    syncSettingsAuto: "Automatisch",
    syncSettingsAutoHint: "Täglich syncen",
    syncSettingsExport: "Exportieren",
    syncSettingsImport: "Importieren",
    syncSettingsExported: "Konfiguration exportiert",
    syncSettingsExportedDetail: "Die globale Wayleaf-Konfigurationsdatei wurde gespeichert.",
    syncSettingsImported: "Konfiguration importiert",
    syncSettingsImportedDetail: "Wayleaf wird aktualisiert.",
    syncSettingsImportFailed: "Import fehlgeschlagen",
    syncSettingsImportFailedDetail: "Wähle eine Wayleaf-.wy-Datei.",
    syncSettingsActionsLabel: "Synchronisierungsart",
    brandBaidu: "Baidu",
    brandDoubao: "Doubao",
    brandQwen: "Qwen",
    brandJimeng: "Jimeng",
    brandXiaohongshu: "RedNote",
    brandDouyin: "Douyin",
    brandZhihu: "Zhihu",
    searchSettingsDefaultTitle: "Basissuche",
    searchSettingsDefaultDescription: "Suchziel für normale Suchanfragen konfigurieren",
    searchSettingsDefaultHint: "Wayleaf verwendet für normale Suchbegriffe die als Standard markierte Basissuche.",
    searchSettingsAiTitle: "KI-Suchmaschinen",
    searchSettingsAiDescription: "Namen, Auslöser und Suchlinks der integrierten KI-Engines bearbeiten",
    searchSettingsAiHint: "Auslöser mit Leerzeichen oder Kommas trennen, z. B. /gpt /chatgpt. Melde dich bei Plattformen mit Loginpflicht vor der ersten Nutzung an.",
    searchSettingsPlatformTitle: "Plattformsuche",
    searchSettingsPlatformDescription: "Mit integrierten, mit * beginnenden Aktivierungswörtern Suchergebnisse auf häufigen Plattformen öffnen",
    searchSettingsPlatformHint: "Gib eine vollständige Plattformabkürzung oder einen Namen mit * ein (zum Beispiel *yt oder *youtube), um umzuschalten. Wenn ein kurzer Aktivator zugleich der Anfang eines anderen ist (wie *x / *xhs), bestätige *x mit Leertaste oder Enter. Melde dich bei Bedarf zuerst an.",
    searchSettingsPlatformPrefix: "Präfix",
    searchSettingsPlatformQuery: "query",
    searchSettingsBuiltInBadge: "Integriert",
    platformSearchDirectBehavior: "Öffnet die Suchergebnisse der Plattform direkt",
    platformSearchLoginBehavior: "Öffnet Plattform-Suchergebnisse; bei Bedarf zuerst anmelden",
    platformSearchFallbackBehavior: "Nutzt den Web-Sucheinstieg und behält die codierte Abfrage bei, falls die Website Suche einschränkt",
    searchSettingsSetDefault: "Als Standard",
    searchSettingsDefaultBadge: "Standard",
    searchSettingsEdit: "Bearbeiten",
    searchSettingsDoneEdit: "Fertig",
    searchSettingsEngineName: "Name",
    searchSettingsEngineCommands: "Auslöser",
    searchSettingsEngineUrl: "Suchlink",
    searchSettingsSave: "Sucheinstellungen speichern",
    searchSettingsReset: "Standard wiederherstellen",
    searchSettingsSaved: "Sucheinstellungen gespeichert.",
    searchSettingsResetDone: "Standard-Sucheinstellungen wiederhergestellt."
  }
};
const LOCALE_COMPLETIONS = {
  ja: {
    topbarLabel: "トップバー",
    shellLabel: "Wayleaf ダッシュボード",
    mobilePortalTab: "ブックマーク",
    mobileMediaTab: "メディア",
    mobileHistoryTab: "履歴",
    smartPortalTab: "おすすめ",
    bookmarkPortalTab: "ブックマーク",
    bookmarkSearchPlaceholder: "ブックマークを検索",
    bookmarkFolders: "ブックマークフォルダ",
    bookmarkSortLabel: "並び順",
    bookmarkSortRecent: "新しい順",
    bookmarkSortTitle: "名前順",
    bookmarkSearchEmpty: "一致するブックマークはありません。",
    portalCategoryFeatured: "よく使うショートカット",
    portalCategoryCustom: "カスタム",
    portalCategoryShopping: "ショッピング",
    portalCategoryAi: "AI",
    portalCategorySocial: "ソーシャル",
    portalCategorySearch: "検索",
    portalCategoryDeveloper: "開発",
    portalCategoryProductivity: "生産性",
    portalCategoryMedia: "メディア",
    portalCategoryDesign: "デザイン",
    portalCategoryOther: "その他",
    portalCategoryPortal: "ポータル",
    portalCategories: "おすすめ分類",
    portalCategoriesExpand: "展開",
    portalCategoriesCollapse: "折りたたむ",
    portalCategory: "カテゴリ",
    portalNamePlaceholder: "例: Notion",
    portalUrlPlaceholder: "https://www.notion.so",
    refreshBookmarkFolder: "現在のブックマークフォルダを更新",
    chooseBookmarkFolder: "ブックマークフォルダを選択",
    collapseSurface: "パネルを閉じる",
    openPortalSurface: "ナビゲーションハブを開く",
    recentFoldersSwitch: "よく見るサイトカードを切り替え",
    recentFoldersPrevious: "前のよく見るサイトカード",
    recentFoldersNext: "次のよく見るサイトカード",
    historyPreviousPage: "前のよく見るページ",
    historyNextPage: "次のよく見るページ",
    quickSearchPlaceholder: "検索または URL を入力",
    googleImageSearch: "Google で画像検索",
    quickSearch: "検索",
    quickSearchLocal: "開く",
    quickSearchAiCommandHint: "/gpt、/claude、/gemini、/grok、/deepseek、/doubao、/kimi、/glm で AI を切り替え",
    quickSearchAiSelected: "選択中",
    quickSearchEngine: "検索モード",
    quickSearchWith: "{engine} で検索",
    quickSearchWithGoogleAi: "Google AI で検索",
    quickSearchWithAi: "{engine} に送信",
    quickSearchAiPlaceholder: "{engine} に質問",
    aiAttachmentAdd: "{engine} にファイルを追加",
    aiAttachmentClear: "添付を削除",
    aiAttachmentCount: "{count} 件のファイル",
    quickSearchWithPlatform: "{platform} で検索",
    quickSearchPlatformPlaceholder: "{platform} で検索",
    quickSearchPlatformActivationHint: "{prefix} で {platform} を有効化",
    localSearchHistory: "履歴",
    localSearchBookmark: "ブックマーク",
    localSearchNoResults: "一致する履歴またはブックマークはありません。",
    addFavoriteSite: "お気に入りサイトを追加",
    addBookmarkToFavorites: "{title} をお気に入りサイトに追加",
    deleteFavoriteSite: "お気に入りサイトを削除",
    favoriteSiteLimit: "お気に入りサイトは最大 {count} 件です。",
    favoriteSiteExists: "{title} はすでにお気に入りサイトにあります。",
    portalCategoryItems: "{count} 件のショートカット",
    deleteCustomPortal: "カスタムポータルを削除",
    onboardingKicker: "初回起動",
    onboardingTitle: "Wayleaf を 1 分で理解する",
    onboardingIntro: "Wayleaf は新しいタブをローカル優先のワークスペースに変えます。以下のメモで安全かつスムーズに始められます。",
    onboardingPrivacyTitle: "中央の検索バーから開始",
    onboardingPrivacyBody: "キーワード、URL、または /AI コマンドを入力して検索や移動を開始します。",
    onboardingPermissionTitle: "お気に入りサイトを追加",
    onboardingPermissionBody: "検索バーの下に最大 5 件のサイトを追加し、ワンクリックで開けます。",
    onboardingSyncTitle: "よく見るサイトを確認",
    onboardingSyncBody: "よく訪問する URL がサイトごとに整理され、同じサイトの関連ページも表示されます。",
    onboardingAiTitle: "ナビゲーションハブを開く",
    onboardingAiBody: "左上のハブでショートカットと選択したブックマークフォルダを管理します。",
    onboardingStartTitle: "設定を開く",
    onboardingStartBody: "右上の設定で言語、外観、同期、検索の設定を変更します。",
    onboardingFeedbackTitle: "問題を直接報告",
    onboardingFeedbackBody: "ブラウザ、Wayleaf バージョン、失敗した場面を含めると再現しやすくなります。",
    onboardingFeedback: "問題を報告",
    onboardingNext: "次へ",
    onboardingDone: "完了",
    closeOnboarding: "ガイドを閉じる",
    portalNameRequired: "ポータル名を入力してください。",
    portalUrlRequired: "http または https の URL を入力してください。",
    customPortalLimit: "カスタムポータルは最大 {count} 件まで追加できます。",
    savePortalFailed: "このポータルを保存できませんでした。件数を減らすか短くしてください。",
    loadCustomPortalsFailed: "カスタムポータルを読み込めませんでした。更新して再試行してください。",
    deletePortalFailed: "このポータルを削除できませんでした。更新して再試行してください。",
    bookmarkNoFolder: "ブックマークフォルダが選択されていません。フォルダ一覧から選択してください。",
    bookmarkFolderMissing: "選択したフォルダは存在しません。別のフォルダを選んでください。",
    bookmarkEmpty: "このフォルダには表示できる Web ブックマークがありません。",
    bookmarkReadFailed: "ブックマークを読み込めません。拡張機能に bookmarks 権限があるか確認してください。",
    deleteBookmark: "{title} を削除",
    deleteBookmarkAction: "削除",
    deleteBookmarkFailed: "削除できませんでした。別の場所で変更された可能性があります。",
    loadingBookmarkFolders: "ブックマークフォルダを読み込み中。",
    bookmarkFolderReadFailed: "ブックマークフォルダを読み込めません。",
    noBookmarkFolders: "Web ブックマークを含むフォルダが見つかりません。",
    pageCount: "{count} ページ",
    deleteHistory: "{title} を削除",
    deleteHistoryFailed: "削除できませんでした。別の場所で変更された可能性があります。",
    openSiteHome: "{name} のホームページを開く",
    openPage: "{title} を開く",
  },
  ko: {
    topbarLabel: "상단 바",
    shellLabel: "Wayleaf 대시보드",
    mobilePortalTab: "북마크",
    mobileMediaTab: "미디어",
    mobileHistoryTab: "기록",
    smartPortalTab: "추천 사이트",
    bookmarkPortalTab: "북마크",
    bookmarkSearchPlaceholder: "북마크 검색",
    bookmarkFolders: "북마크 폴더",
    bookmarkSortLabel: "정렬",
    bookmarkSortRecent: "최근 추가순",
    bookmarkSortTitle: "이름순",
    bookmarkSearchEmpty: "일치하는 북마크가 없습니다.",
    portalCategoryFeatured: "자주 쓰는 바로가기",
    portalCategoryCustom: "사용자 지정",
    portalCategoryShopping: "쇼핑",
    portalCategoryAi: "AI",
    portalCategorySocial: "소셜",
    portalCategorySearch: "검색",
    portalCategoryDeveloper: "개발",
    portalCategoryProductivity: "생산성",
    portalCategoryMedia: "미디어",
    portalCategoryDesign: "디자인",
    portalCategoryOther: "기타",
    portalCategoryPortal: "포털",
    portalCategories: "추천 분류",
    portalCategoriesExpand: "펼치기",
    portalCategoriesCollapse: "접기",
    portalCategory: "분류",
    portalNamePlaceholder: "예: Notion",
    portalUrlPlaceholder: "https://www.notion.so",
    refreshBookmarkFolder: "현재 북마크 폴더 새로고침",
    chooseBookmarkFolder: "북마크 폴더 선택",
    collapseSurface: "패널 접기",
    openPortalSurface: "탐색 허브 열기",
    recentFoldersSwitch: "자주 방문 카드 전환",
    recentFoldersPrevious: "이전 자주 방문 카드",
    recentFoldersNext: "다음 자주 방문 카드",
    historyPreviousPage: "이전 자주 방문 페이지",
    historyNextPage: "다음 자주 방문 페이지",
    quickSearchPlaceholder: "검색 또는 URL 입력",
    googleImageSearch: "Google로 이미지 검색",
    quickSearch: "검색",
    quickSearchLocal: "열기",
    quickSearchAiCommandHint: "/gpt, /claude, /gemini, /grok, /deepseek, /doubao, /kimi, /glm으로 AI 전환",
    quickSearchAiSelected: "선택됨",
    quickSearchEngine: "검색 모드",
    quickSearchWith: "{engine}로 검색",
    quickSearchWithGoogleAi: "Google AI로 검색",
    quickSearchWithAi: "{engine}에 보내기",
    quickSearchAiPlaceholder: "{engine}에 질문",
    aiAttachmentAdd: "{engine}에 파일 추가",
    aiAttachmentClear: "첨부 파일 제거",
    aiAttachmentCount: "파일 {count}개",
    quickSearchWithPlatform: "{platform}에서 검색",
    quickSearchPlatformPlaceholder: "{platform}에서 검색",
    quickSearchPlatformActivationHint: "{prefix} 입력 시 {platform} 활성화",
    localSearchHistory: "기록",
    localSearchBookmark: "북마크",
    localSearchNoResults: "일치하는 기록이나 북마크가 없습니다.",
    addFavoriteSite: "즐겨찾기 사이트 추가",
    addBookmarkToFavorites: "{title}을 즐겨찾기 사이트에 추가",
    deleteFavoriteSite: "즐겨찾기 사이트 삭제",
    favoriteSiteLimit: "즐겨찾기 사이트는 최대 {count}개입니다.",
    favoriteSiteExists: "{title}은 이미 즐겨찾기 사이트에 있습니다.",
    portalCategoryItems: "바로가기 {count}개",
    deleteCustomPortal: "사용자 지정 포털 삭제",
    onboardingKicker: "첫 실행",
    onboardingTitle: "Wayleaf를 1분 안에 알아보기",
    onboardingIntro: "Wayleaf는 새 탭을 로컬 우선 작업 공간으로 바꿉니다. 아래 안내로 안전하고 빠르게 시작하세요.",
    onboardingPrivacyTitle: "중앙 검색창에서 시작",
    onboardingPrivacyBody: "키워드, URL 또는 /AI 명령을 입력해 검색하거나 바로 이동하세요.",
    onboardingPermissionTitle: "즐겨찾기 사이트 추가",
    onboardingPermissionBody: "검색창 아래에 사이트를 최대 5개 추가하고 한 번의 클릭으로 열 수 있습니다.",
    onboardingSyncTitle: "자주 방문 확인",
    onboardingSyncBody: "자주 방문한 URL이 사이트별로 정리되며 같은 사이트의 관련 페이지도 함께 표시됩니다.",
    onboardingAiTitle: "탐색 허브 열기",
    onboardingAiBody: "왼쪽 위 허브에서 바로가기와 선택한 북마크 폴더를 관리하세요.",
    onboardingStartTitle: "설정 열기",
    onboardingStartBody: "오른쪽 위 설정에서 언어, 화면, 동기화, 검색 환경설정을 조정하세요.",
    onboardingFeedbackTitle: "문제 직접 신고",
    onboardingFeedbackBody: "브라우저, Wayleaf 버전, 실패 상황을 포함하면 재현이 쉬워집니다.",
    onboardingFeedback: "문제 신고",
    onboardingNext: "다음",
    onboardingDone: "완료",
    closeOnboarding: "가이드 닫기",
    portalNameRequired: "포털 이름을 입력하세요.",
    portalUrlRequired: "http 또는 https URL을 입력하세요.",
    customPortalLimit: "사용자 지정 포털은 최대 {count}개까지 추가할 수 있습니다.",
    savePortalFailed: "이 포털을 저장할 수 없습니다. 항목을 줄이거나 짧게 해보세요.",
    loadCustomPortalsFailed: "사용자 지정 포털을 불러올 수 없습니다. 새로고침 후 다시 시도하세요.",
    deletePortalFailed: "이 포털을 삭제할 수 없습니다. 새로고침 후 다시 시도하세요.",
    bookmarkNoFolder: "선택된 북마크 폴더가 없습니다. 폴더 목록에서 선택하세요.",
    bookmarkFolderMissing: "선택한 폴더가 더 이상 없습니다. 다른 폴더를 선택하세요.",
    bookmarkEmpty: "이 폴더에는 표시할 웹사이트 북마크가 없습니다.",
    bookmarkReadFailed: "북마크를 읽을 수 없습니다. 확장 프로그램에 bookmarks 권한이 있는지 확인하세요.",
    deleteBookmark: "{title} 삭제",
    deleteBookmarkAction: "삭제",
    deleteBookmarkFailed: "삭제할 수 없습니다. 다른 곳에서 변경되었을 수 있습니다.",
    loadingBookmarkFolders: "북마크 폴더 불러오는 중.",
    bookmarkFolderReadFailed: "북마크 폴더를 읽을 수 없습니다.",
    noBookmarkFolders: "웹사이트 북마크가 있는 폴더를 찾지 못했습니다.",
    pageCount: "페이지 {count}개",
    deleteHistory: "{title} 삭제",
    deleteHistoryFailed: "삭제할 수 없습니다. 다른 곳에서 변경되었을 수 있습니다.",
    openSiteHome: "{name} 홈페이지 열기",
    openPage: "{title} 열기",
  },
  es: {
    topbarLabel: "Barra superior",
    shellLabel: "Panel de Wayleaf",
    mobilePortalTab: "Marcadores",
    mobileMediaTab: "Medios",
    mobileHistoryTab: "Historial",
    smartPortalTab: "Recomendados",
    bookmarkPortalTab: "Marcadores",
    bookmarkSearchPlaceholder: "Buscar marcadores",
    bookmarkFolders: "Carpetas de marcadores",
    bookmarkSortLabel: "Ordenar",
    bookmarkSortRecent: "Más recientes",
    bookmarkSortTitle: "Por nombre",
    bookmarkSearchEmpty: "No hay marcadores coincidentes.",
    portalCategoryFeatured: "Accesos frecuentes",
    portalCategoryCustom: "Personalizado",
    portalCategoryShopping: "Compras",
    portalCategoryAi: "IA",
    portalCategorySocial: "Social",
    portalCategorySearch: "Búsqueda",
    portalCategoryDeveloper: "Desarrollo",
    portalCategoryProductivity: "Productividad",
    portalCategoryMedia: "Medios",
    portalCategoryDesign: "Diseño",
    portalCategoryOther: "Otros",
    portalCategoryPortal: "Portales",
    portalCategories: "Categorías recomendadas",
    portalCategoriesExpand: "Expandir",
    portalCategoriesCollapse: "Contraer",
    portalCategory: "Categoría",
    portalNamePlaceholder: "Ejemplo: Notion",
    portalUrlPlaceholder: "https://www.notion.so",
    refreshBookmarkFolder: "Actualizar carpeta de marcadores actual",
    chooseBookmarkFolder: "Elegir carpeta de marcadores",
    collapseSurface: "Contraer panel",
    openPortalSurface: "Abrir centro de navegación",
    recentFoldersSwitch: "Cambiar tarjetas más visitadas",
    recentFoldersPrevious: "Tarjetas más visitadas anteriores",
    recentFoldersNext: "Tarjetas más visitadas siguientes",
    historyPreviousPage: "Página más visitada anterior",
    historyNextPage: "Página más visitada siguiente",
    quickSearchPlaceholder: "Buscar o escribir URL",
    googleImageSearch: "Buscar por imagen con Google",
    quickSearch: "Buscar",
    quickSearchLocal: "Abrir",
    quickSearchAiCommandHint: "Escribe /gpt, /claude, /gemini, /grok, /deepseek, /doubao, /kimi o /glm para cambiar de IA",
    quickSearchAiSelected: "Seleccionado",
    quickSearchEngine: "Modo de búsqueda",
    quickSearchWith: "Buscar con {engine}",
    quickSearchWithGoogleAi: "Buscar con Google AI",
    quickSearchWithAi: "Enviar a {engine}",
    quickSearchAiPlaceholder: "Preguntar con {engine}",
    aiAttachmentAdd: "Añadir archivos a {engine}",
    aiAttachmentClear: "Quitar adjuntos",
    aiAttachmentCount: "{count} archivos",
    quickSearchWithPlatform: "Buscar en {platform}",
    quickSearchPlatformPlaceholder: "Buscar en {platform}",
    quickSearchPlatformActivationHint: "Escribe {prefix} para {platform}",
    localSearchHistory: "Historial",
    localSearchBookmark: "Marcador",
    localSearchNoResults: "No hay historial ni marcadores coincidentes.",
    addFavoriteSite: "Agregar sitio favorito",
    addBookmarkToFavorites: "Agregar {title} a favoritos",
    deleteFavoriteSite: "Eliminar sitio favorito",
    favoriteSiteLimit: "Hasta {count} sitios favoritos.",
    favoriteSiteExists: "{title} ya está en favoritos.",
    portalCategoryItems: "{count} accesos",
    deleteCustomPortal: "Eliminar portal personalizado",
    onboardingKicker: "Primer uso",
    onboardingTitle: "Entiende Wayleaf en un minuto",
    onboardingIntro: "Wayleaf convierte tu nueva pestaña en un espacio local. Estas notas te ayudan a empezar con seguridad y rapidez.",
    onboardingPrivacyTitle: "Empieza por la barra de búsqueda central",
    onboardingPrivacyBody: "Escribe una palabra, URL o comando /AI para buscar o abrir un destino directamente.",
    onboardingPermissionTitle: "Agrega sitios favoritos",
    onboardingPermissionBody: "Añade hasta cinco sitios debajo de la búsqueda y ábrelos con un clic.",
    onboardingSyncTitle: "Revisa los más visitados",
    onboardingSyncBody: "Las URL más visitadas se agrupan por sitio e incluyen páginas relacionadas del mismo dominio.",
    onboardingAiTitle: "Abre el centro de navegación",
    onboardingAiBody: "Usa el acceso superior izquierdo para gestionar atajos y carpetas de marcadores.",
    onboardingStartTitle: "Abre Configuración",
    onboardingStartBody: "En la esquina superior derecha puedes ajustar idioma, apariencia, sincronización y búsqueda.",
    onboardingFeedbackTitle: "Informa problemas directamente",
    onboardingFeedbackBody: "Incluye navegador, versión de Wayleaf y escenario fallido para facilitar la reproducción.",
    onboardingFeedback: "Informar problema",
    onboardingNext: "Siguiente",
    onboardingDone: "Finalizar",
    closeOnboarding: "Cerrar guía",
    portalNameRequired: "Introduce un nombre de portal.",
    portalUrlRequired: "Introduce una URL http o https.",
    customPortalLimit: "Puedes agregar hasta {count} portales personalizados.",
    savePortalFailed: "No se pudo guardar este portal. Prueba con menos o más corto.",
    loadCustomPortalsFailed: "No se pudieron cargar portales personalizados. Actualiza e inténtalo de nuevo.",
    deletePortalFailed: "No se pudo eliminar este portal. Actualiza e inténtalo de nuevo.",
    bookmarkNoFolder: "No hay carpeta de marcadores seleccionada. Elige una en la lista de carpetas.",
    bookmarkFolderMissing: "La carpeta seleccionada ya no existe. Elige otra.",
    bookmarkEmpty: "Esta carpeta no tiene marcadores web para mostrar.",
    bookmarkReadFailed: "No se pudieron leer los marcadores. Comprueba el permiso bookmarks.",
    deleteBookmark: "Eliminar {title}",
    deleteBookmarkAction: "Eliminar",
    deleteBookmarkFailed: "No se pudo eliminar. Puede haber cambiado en otro lugar.",
    loadingBookmarkFolders: "Cargando carpetas de marcadores.",
    bookmarkFolderReadFailed: "No se pudieron leer las carpetas de marcadores.",
    noBookmarkFolders: "No se encontraron carpetas con marcadores web.",
    pageCount: "{count} páginas",
    deleteHistory: "Eliminar {title}",
    deleteHistoryFailed: "No se pudo eliminar. Puede haber cambiado en otro lugar.",
    openSiteHome: "Abrir inicio de {name}",
    openPage: "Abrir {title}",
  },
  fr: {
    topbarLabel: "Barre supérieure",
    shellLabel: "Tableau de bord Wayleaf",
    mobilePortalTab: "Favoris",
    mobileMediaTab: "Médias",
    mobileHistoryTab: "Historique",
    smartPortalTab: "Recommandés",
    bookmarkPortalTab: "Favoris",
    bookmarkSearchPlaceholder: "Rechercher dans les favoris",
    bookmarkFolders: "Dossiers de favoris",
    bookmarkSortLabel: "Trier",
    bookmarkSortRecent: "Ajoutés récemment",
    bookmarkSortTitle: "Par nom",
    bookmarkSearchEmpty: "Aucun favori correspondant.",
    portalCategoryFeatured: "Raccourcis fréquents",
    portalCategoryCustom: "Personnalisé",
    portalCategoryShopping: "Achats",
    portalCategoryAi: "IA",
    portalCategorySocial: "Social",
    portalCategorySearch: "Recherche",
    portalCategoryDeveloper: "Développement",
    portalCategoryProductivity: "Productivité",
    portalCategoryMedia: "Médias",
    portalCategoryDesign: "Design",
    portalCategoryOther: "Autre",
    portalCategoryPortal: "Portails",
    portalCategories: "Catégories recommandées",
    portalCategoriesExpand: "Développer",
    portalCategoriesCollapse: "Réduire",
    portalCategory: "Catégorie",
    portalNamePlaceholder: "Exemple : Notion",
    portalUrlPlaceholder: "https://www.notion.so",
    refreshBookmarkFolder: "Actualiser le dossier de favoris actuel",
    chooseBookmarkFolder: "Choisir un dossier de favoris",
    collapseSurface: "Réduire le panneau",
    openPortalSurface: "Ouvrir le centre de navigation",
    recentFoldersSwitch: "Changer les cartes les plus visitées",
    recentFoldersPrevious: "Cartes les plus visitées précédentes",
    recentFoldersNext: "Cartes les plus visitées suivantes",
    historyPreviousPage: "Page la plus visitée précédente",
    historyNextPage: "Page la plus visitée suivante",
    quickSearchPlaceholder: "Rechercher ou saisir une URL",
    googleImageSearch: "Rechercher par image avec Google",
    quickSearch: "Rechercher",
    quickSearchLocal: "Ouvrir",
    quickSearchAiCommandHint: "Tapez /gpt, /claude, /gemini, /grok, /deepseek, /doubao, /kimi ou /glm pour changer d'IA",
    quickSearchAiSelected: "Sélectionné",
    quickSearchEngine: "Mode de recherche",
    quickSearchWith: "Rechercher avec {engine}",
    quickSearchWithGoogleAi: "Rechercher avec Google AI",
    quickSearchWithAi: "Envoyer à {engine}",
    quickSearchAiPlaceholder: "Interroger {engine}",
    aiAttachmentAdd: "Ajouter des fichiers à {engine}",
    aiAttachmentClear: "Supprimer les pièces jointes",
    aiAttachmentCount: "{count} fichiers",
    quickSearchWithPlatform: "Rechercher sur {platform}",
    quickSearchPlatformPlaceholder: "Rechercher sur {platform}",
    quickSearchPlatformActivationHint: "Saisissez {prefix} pour {platform}",
    localSearchHistory: "Historique",
    localSearchBookmark: "Favori",
    localSearchNoResults: "Aucun historique ou favori correspondant.",
    addFavoriteSite: "Ajouter un site favori",
    addBookmarkToFavorites: "Ajouter {title} aux favoris",
    deleteFavoriteSite: "Supprimer le site favori",
    favoriteSiteLimit: "Jusqu'à {count} sites favoris.",
    favoriteSiteExists: "{title} est déjà dans les favoris.",
    portalCategoryItems: "{count} raccourcis",
    deleteCustomPortal: "Supprimer le portail personnalisé",
    onboardingKicker: "Première utilisation",
    onboardingTitle: "Comprendre Wayleaf en une minute",
    onboardingIntro: "Wayleaf transforme votre nouvel onglet en espace local. Ces notes vous aident à démarrer vite et en sécurité.",
    onboardingPrivacyTitle: "Commencez par la barre de recherche centrale",
    onboardingPrivacyBody: "Saisissez un mot-clé, une URL ou une commande /AI pour rechercher ou ouvrir une destination.",
    onboardingPermissionTitle: "Ajoutez des sites favoris",
    onboardingPermissionBody: "Ajoutez jusqu'à cinq sites sous la recherche, puis ouvrez-les en un clic.",
    onboardingSyncTitle: "Consultez les plus visités",
    onboardingSyncBody: "Les URL les plus visitées sont regroupées par site avec les pages associées du même domaine.",
    onboardingAiTitle: "Ouvrez le centre de navigation",
    onboardingAiBody: "Le bouton en haut à gauche gère les raccourcis et les dossiers de favoris sélectionnés.",
    onboardingStartTitle: "Ouvrez les paramètres",
    onboardingStartBody: "Les paramètres en haut à droite contrôlent la langue, l'apparence, la synchronisation et la recherche.",
    onboardingFeedbackTitle: "Signaler les problèmes directement",
    onboardingFeedbackBody: "Incluez navigateur, version de Wayleaf et scénario en échec pour faciliter la reproduction.",
    onboardingFeedback: "Signaler un problème",
    onboardingNext: "Suivant",
    onboardingDone: "Terminer",
    closeOnboarding: "Fermer le guide",
    portalNameRequired: "Saisissez un nom de portail.",
    portalUrlRequired: "Saisissez une URL http ou https.",
    customPortalLimit: "Vous pouvez ajouter jusqu'à {count} portails personnalisés.",
    savePortalFailed: "Impossible d'enregistrer ce portail. Essayez avec moins ou plus court.",
    loadCustomPortalsFailed: "Impossible de charger les portails personnalisés. Actualisez et réessayez.",
    deletePortalFailed: "Impossible de supprimer ce portail. Actualisez et réessayez.",
    bookmarkNoFolder: "Aucun dossier de favoris sélectionné. Choisissez-en un dans la liste des dossiers.",
    bookmarkFolderMissing: "Le dossier sélectionné n'existe plus. Choisissez un autre dossier.",
    bookmarkEmpty: "Ce dossier n'a aucun favori Web à afficher.",
    bookmarkReadFailed: "Impossible de lire les favoris. Vérifiez l'autorisation bookmarks.",
    deleteBookmark: "Supprimer {title}",
    deleteBookmarkAction: "Supprimer",
    deleteBookmarkFailed: "Impossible de supprimer. Il a peut-être changé ailleurs.",
    loadingBookmarkFolders: "Chargement des dossiers de favoris.",
    bookmarkFolderReadFailed: "Impossible de lire les dossiers de favoris.",
    noBookmarkFolders: "Aucun dossier avec des favoris Web trouvé.",
    pageCount: "{count} pages",
    deleteHistory: "Supprimer {title}",
    deleteHistoryFailed: "Impossible de supprimer. Il a peut-être changé ailleurs.",
    openSiteHome: "Ouvrir l'accueil de {name}",
    openPage: "Ouvrir {title}",
  },
  de: {
    topbarLabel: "Obere Leiste",
    shellLabel: "Wayleaf-Dashboard",
    mobilePortalTab: "Lesezeichen",
    mobileMediaTab: "Medien",
    mobileHistoryTab: "Verlauf",
    smartPortalTab: "Empfohlen",
    bookmarkPortalTab: "Lesezeichen",
    bookmarkSearchPlaceholder: "Lesezeichen durchsuchen",
    bookmarkFolders: "Lesezeichenordner",
    bookmarkSortLabel: "Sortieren",
    bookmarkSortRecent: "Zuletzt hinzugefügt",
    bookmarkSortTitle: "Nach Name",
    bookmarkSearchEmpty: "Keine passenden Lesezeichen.",
    portalCategoryFeatured: "Häufige Kurzbefehle",
    portalCategoryCustom: "Benutzerdefiniert",
    portalCategoryShopping: "Shopping",
    portalCategoryAi: "KI",
    portalCategorySocial: "Sozial",
    portalCategorySearch: "Suche",
    portalCategoryDeveloper: "Entwicklung",
    portalCategoryProductivity: "Produktivität",
    portalCategoryMedia: "Medien",
    portalCategoryDesign: "Design",
    portalCategoryOther: "Sonstiges",
    portalCategoryPortal: "Portale",
    portalCategories: "Empfohlene Kategorien",
    portalCategoriesExpand: "Erweitern",
    portalCategoriesCollapse: "Reduzieren",
    portalCategory: "Kategorie",
    portalNamePlaceholder: "Beispiel: Notion",
    portalUrlPlaceholder: "https://www.notion.so",
    refreshBookmarkFolder: "Aktuellen Lesezeichenordner aktualisieren",
    chooseBookmarkFolder: "Lesezeichenordner auswählen",
    collapseSurface: "Panel einklappen",
    openPortalSurface: "Navigationszentrale öffnen",
    recentFoldersSwitch: "Meistbesuchte Karten wechseln",
    recentFoldersPrevious: "Vorherige meistbesuchte Karten",
    recentFoldersNext: "Nächste meistbesuchte Karten",
    historyPreviousPage: "Vorherige meistbesuchte Seite",
    historyNextPage: "Nächste meistbesuchte Seite",
    quickSearchPlaceholder: "Suchen oder URL eingeben",
    googleImageSearch: "Mit Google per Bild suchen",
    quickSearch: "Suchen",
    quickSearchLocal: "Öffnen",
    quickSearchAiCommandHint: "Mit /gpt, /claude, /gemini, /grok, /deepseek, /doubao, /kimi oder /glm die KI wechseln",
    quickSearchAiSelected: "Ausgewählt",
    quickSearchEngine: "Suchmodus",
    quickSearchWith: "Mit {engine} suchen",
    quickSearchWithGoogleAi: "Mit Google AI suchen",
    quickSearchWithAi: "An {engine} senden",
    quickSearchAiPlaceholder: "Mit {engine} fragen",
    aiAttachmentAdd: "Dateien zu {engine} hinzufügen",
    aiAttachmentClear: "Anhänge entfernen",
    aiAttachmentCount: "{count} Dateien",
    quickSearchWithPlatform: "Auf {platform} suchen",
    quickSearchPlatformPlaceholder: "Auf {platform} suchen",
    quickSearchPlatformActivationHint: "{prefix} aktiviert {platform}",
    localSearchHistory: "Verlauf",
    localSearchBookmark: "Lesezeichen",
    localSearchNoResults: "Keine passenden Verlaufs- oder Lesezeicheneinträge.",
    addFavoriteSite: "Lieblingswebsite hinzufügen",
    addBookmarkToFavorites: "{title} zu Lieblingswebsites hinzufügen",
    deleteFavoriteSite: "Lieblingswebsite entfernen",
    favoriteSiteLimit: "Bis zu {count} Lieblingswebsites.",
    favoriteSiteExists: "{title} ist bereits in den Lieblingswebsites.",
    portalCategoryItems: "{count} Kurzbefehle",
    deleteCustomPortal: "Benutzerdefiniertes Portal entfernen",
    onboardingKicker: "Erster Start",
    onboardingTitle: "Wayleaf in einer Minute verstehen",
    onboardingIntro: "Wayleaf macht den neuen Tab zu einem lokalen Arbeitsbereich. Diese Hinweise helfen beim sicheren und schnellen Start.",
    onboardingPrivacyTitle: "Mit der zentralen Suche starten",
    onboardingPrivacyBody: "Gib ein Stichwort, eine URL oder einen /AI-Befehl ein, um zu suchen oder direkt zu öffnen.",
    onboardingPermissionTitle: "Lieblingswebsites hinzufügen",
    onboardingPermissionBody: "Füge unter der Suche bis zu fünf Websites hinzu und öffne sie mit einem Klick.",
    onboardingSyncTitle: "Meistbesuchte Seiten ansehen",
    onboardingSyncBody: "Häufig besuchte URLs werden nach Website gruppiert und zeigen auch zugehörige Seiten derselben Domain.",
    onboardingAiTitle: "Navigationszentrale öffnen",
    onboardingAiBody: "Oben links verwaltest du Kurzbefehle und ausgewählte Lesezeichenordner.",
    onboardingStartTitle: "Einstellungen öffnen",
    onboardingStartBody: "Oben rechts stellst du Sprache, Darstellung, Synchronisierung und Suche ein.",
    onboardingFeedbackTitle: "Probleme direkt melden",
    onboardingFeedbackBody: "Gib Browser, Wayleaf-Version und das fehlgeschlagene Szenario an, damit es leicht reproduzierbar ist.",
    onboardingFeedback: "Problem melden",
    onboardingNext: "Weiter",
    onboardingDone: "Fertig",
    closeOnboarding: "Anleitung schließen",
    portalNameRequired: "Gib einen Portalnamen ein.",
    portalUrlRequired: "Gib eine http- oder https-URL ein.",
    customPortalLimit: "Du kannst bis zu {count} benutzerdefinierte Portale hinzufügen.",
    savePortalFailed: "Dieses Portal konnte nicht gespeichert werden. Weniger oder kürzere Einträge versuchen.",
    loadCustomPortalsFailed: "Benutzerdefinierte Portale konnten nicht geladen werden. Aktualisieren und erneut versuchen.",
    deletePortalFailed: "Dieses Portal konnte nicht entfernt werden. Aktualisieren und erneut versuchen.",
    bookmarkNoFolder: "Kein Lesezeichenordner ausgewählt. Wähle einen aus der Ordnerliste.",
    bookmarkFolderMissing: "Der ausgewählte Ordner existiert nicht mehr. Wähle einen anderen.",
    bookmarkEmpty: "Dieser Ordner enthält keine anzeigbaren Website-Lesezeichen.",
    bookmarkReadFailed: "Lesezeichen konnten nicht gelesen werden. Prüfe die bookmarks-Berechtigung.",
    deleteBookmark: "{title} entfernen",
    deleteBookmarkAction: "Entfernen",
    deleteBookmarkFailed: "Konnte nicht entfernt werden. Es wurde möglicherweise anderswo geändert.",
    loadingBookmarkFolders: "Lesezeichenordner werden geladen.",
    bookmarkFolderReadFailed: "Lesezeichenordner konnten nicht gelesen werden.",
    noBookmarkFolders: "Keine Ordner mit Website-Lesezeichen gefunden.",
    pageCount: "{count} Seiten",
    deleteHistory: "{title} entfernen",
    deleteHistoryFailed: "Konnte nicht entfernt werden. Es wurde möglicherweise anderswo geändert.",
    openSiteHome: "{name}-Startseite öffnen",
    openPage: "{title} öffnen",
  }
};
for (const [locale, messages] of Object.entries(LOCALE_COMPLETIONS)) {
  Object.assign(MESSAGES[locale], messages);
}
let LOCALE = resolveLocale();

const secondaryShell = document.querySelector("#secondaryShell");
const homeStage = document.querySelector(".home-stage");
const topbar = document.querySelector(".topbar");
const surfaceBackdrop = document.querySelector("#surfaceBackdrop");
const portalSurfaceButton = document.querySelector("#portalSurfaceButton");
const surfaceBackButtons = [...document.querySelectorAll(".surface-back-button")];
const portalGrid = document.querySelector("#portalGrid");
const portalModeTabs = [...document.querySelectorAll("[data-portal-view]")];
const portalViews = [...document.querySelectorAll(".portal-view")];
const bookmarkGrid = document.querySelector("#bookmarkGrid");
const bookmarkMainView = document.querySelector("#bookmarkMainView");
const bookmarkMainToolbar = document.querySelector("#bookmarkMainToolbar");
const bookmarkFolderMeta = document.querySelector("#bookmarkFolderMeta");
const bookmarkSearch = document.querySelector(".bookmark-search");
const bookmarkSearchInput = document.querySelector("#bookmarkSearchInput");
const bookmarkSearchLabel = document.querySelector("#bookmarkSearchLabel");
const bookmarkFolderLane = document.querySelector("#bookmarkFolderLane");
const bookmarkSortSelect = document.querySelector("#bookmarkSortSelect");
const bookmarkSortLabel = document.querySelector("#bookmarkSortLabel");
const bookmarkPicker = document.querySelector("#bookmarkPicker");
const bookmarkPickerToolbar = document.querySelector("#bookmarkPickerToolbar");
const bookmarkFolderList = document.querySelector("#bookmarkFolderList");
const refreshBookmarkFolderButton = document.querySelector("#refreshBookmarkFolderButton");
const bookmarkFavoriteAddButton = document.querySelector("#bookmarkFavoriteAddButton");
const closeBookmarkPickerButton = document.querySelector("#closeBookmarkPickerButton");
const bookmarkPickerTitle = document.querySelector("#bookmarkPickerTitle");
const recentHistoryFolders = document.querySelector("#recentHistoryFolders");
const recentViewToggleButton = document.querySelector("#recentViewToggleButton");
const recentFoldersPreviousButton = document.querySelector("#recentFoldersPreviousButton");
const recentFoldersNextButton = document.querySelector("#recentFoldersNextButton");
const siteCardTemplate = document.querySelector("#siteCardTemplate");
const settingsButton = document.querySelector("#settingsButton");
const settingsShell = document.querySelector("#settingsShell");
const settingsPanel = document.querySelector("#settingsPanel");
const closeSettingsButton = document.querySelector("#closeSettingsButton");
const settingsTabsShell = document.querySelector(".settings-tabs-shell");
const settingsTabButtons = [...document.querySelectorAll("[data-settings-tab]")];
const settingsTabPanels = [...document.querySelectorAll("[data-settings-panel]")];
const languageOptions = document.querySelector("#languageOptions");
const palettePresetGrid = document.querySelector("#palettePresetGrid");
const syncSettingsRow = document.querySelector("#syncSettingsRow");
const syncSettingsStatus = document.querySelector("#syncSettingsStatus");
const syncSettingsDetail = document.querySelector("#syncSettingsDetail");
const syncSettingsNowButton = document.querySelector("#syncSettingsNowButton");
const syncSettingsAutoButton = document.querySelector("#syncSettingsAutoButton");
const exportSettingsButton = document.querySelector("#exportSettingsButton");
const importSettingsButton = document.querySelector("#importSettingsButton");
const importSettingsInput = document.querySelector("#importSettingsInput");
const searchSettingsForm = document.querySelector("#searchSettingsForm");
const basicSearchEngineList = document.querySelector("#basicSearchEngineList");
const aiEngineSettingsList = document.querySelector("#aiEngineSettingsList");
const platformSearchSettingsList = document.querySelector("#platformSearchSettingsList");
const resetSearchSettingsButton = document.querySelector("#resetSearchSettingsButton");
const searchSettingsStatus = document.querySelector("#searchSettingsStatus");
const videoPipToggle = document.querySelector("#videoPipToggle");
const quickSearchForm = document.querySelector("#quickSearchForm");
const quickSearchInput = document.querySelector("#quickSearchInput");
const quickSearchLeadingIcon = document.querySelector(".search-engine-search-icon");
const googleImageSearchButton = document.querySelector("#googleImageSearchButton");
const googleImageSearchForm = document.querySelector("#googleImageSearchForm");
const googleImageSearchInput = document.querySelector("#googleImageSearchInput");
const googleImageSearchFilename = document.querySelector("#googleImageSearchFilename");
const aiAttachmentButton = document.querySelector("#aiAttachmentButton");
const aiAttachmentInput = document.querySelector("#aiAttachmentInput");
const aiAttachmentPill = document.querySelector("#aiAttachmentPill");
const aiAttachmentPillText = document.querySelector("#aiAttachmentPillText");
const platformActivationHint = document.querySelector("#platformActivationHint");
const aiEnginePill = document.querySelector("#aiEnginePill");
const searchSuggestions = document.querySelector("#searchSuggestions");
const searchWorkbench = document.querySelector(".search-workbench");
const favoriteStrip = document.querySelector("#favoriteStrip");
const favoriteSiteTemplate = document.querySelector("#favoriteSiteTemplate");
const favoriteAddButton = document.querySelector("#favoriteAddButton");
const favoriteForm = document.querySelector("#favoriteForm");
const favoriteUrlInput = document.querySelector("#favoriteUrlInput");
const favoriteFormError = document.querySelector("#favoriteFormError");
const cancelFavoriteButton = document.querySelector("#cancelFavoriteButton");
const onboardingGuide = document.querySelector("#onboardingGuide");
const onboardingCard = document.querySelector("#onboardingCard");
const onboardingCloseButton = document.querySelector("#onboardingCloseButton");
const onboardingDoneButton = document.querySelector("#onboardingDoneButton");
const onboardingKicker = document.querySelector("#onboardingKicker");
const onboardingStepTitle = document.querySelector("#onboardingStepTitle");
const onboardingStepBody = document.querySelector("#onboardingStepBody");
const togglePortalFormButton = document.querySelector("#togglePortalFormButton");
const portalForm = document.querySelector("#portalForm");
const portalTitleInput = document.querySelector("#portalTitleInput");
const portalUrlInput = document.querySelector("#portalUrlInput");
const portalCategorySelect = document.querySelector("#portalCategorySelect");
const portalCategoryPicker = document.querySelector("#portalCategoryPicker");
const portalCategoryTrigger = document.querySelector("#portalCategoryTrigger");
const portalCategoryCurrent = document.querySelector("#portalCategoryCurrent");
const portalCategoryList = document.querySelector("#portalCategoryList");
const portalFormError = document.querySelector("#portalFormError");
const cancelPortalButton = document.querySelector("#cancelPortalButton");
const mobileSectionTabs = [...document.querySelectorAll(".mobile-section-tab")];
let bookmarkRefreshTimer = 0;
let recentBookmarkExpiryTimer = 0;
let bookmarkRenderRequestId = 0;
let latestBookmarkFolder = null;
let latestBookmarkSites = [];
let latestBookmarkRenderContext = null;
const bookmarkFolderViewCache = new Map();
let activeBookmarkDeleteCard = null;
let activeFavoriteDeleteCard = null;
let localSearchRequestId = 0;
let localSearchResults = [];
let searchSuggestionsHideTimer = 0;
let searchSuggestionsShowFrame = 0;
let activeSurfacePanelId = "";
let activeSearchEngine = DEFAULT_SEARCH_ENGINE;
let selectedLocalSearchEngine = DEFAULT_LOCAL_SEARCH_ENGINE;
let activePlatformSearchTarget = "";
let googleAiSearchModeActive = false;
let googleAiModeExitTimer = 0;
let googleAiModeActiveStartedAt = 0;
let aiModeExitTimer = 0;
let portalCategoryState = {};
let activePortalView = "bookmarks";
let activeThemeMode = DEFAULT_THEME_MODE;
let activeLanguagePreference = "system";
let activeResolvedTheme = "";
let activeThemePalette = DEFAULT_THEME_PALETTE;
let themeBackgroundTransitionTimer = 0;
let themeBackgroundTransitionSequence = 0;
let systemThemeQuery = null;
let settingsPanelCloseTimer = 0;
let pendingRecentPreviousKeys = null;
let latestRecentFolderGroups = [];
let recentFolderPageIndex = 0;
let activeRecentFolderPageSwitchAnimation = null;
let activeRecentViewSurfaceAnimation = null;
let recentViewMode = "recent";
let latestTodayHistoryItems = [];
let todayHistoryPageIndex = 0;
let todayHistoryHydrated = false;
let favoriteSitesHydrated = false;
let onboardingStepIndex = 0;
let onboardingPreviewActive = false;
let videoPipEnabled = true;
let aiDirectAttachments = [];

ensureChromeApiFallback();
document.addEventListener("DOMContentLoaded", initWithStorageMigration);

async function initWithStorageMigration() {
  void migrateSyncStorageFromLocal();
  await init();
}


function ensureChromeApiFallback() {
  if (globalThis.chrome?.storage?.local && globalThis.chrome?.history && globalThis.chrome?.bookmarks) {
    return;
  }
  const fallbackStorageKey = "__wayleaf_preview_storage__";
  const readFallbackStore = () => {
    try {
      return JSON.parse(localStorage.getItem(fallbackStorageKey) || "{}");
    } catch (error) {
      console.warn("Failed to read preview storage", error);
      return {};
    }
  };
  const writeFallbackStore = (values) => {
    try {
      localStorage.setItem(fallbackStorageKey, JSON.stringify(values));
    } catch (error) {
      console.warn("Failed to write preview storage", error);
    }
  };
  const emptyEvent = { addListener: () => {}, removeListener: () => {} };
  globalThis.chrome = {
    ...globalThis.chrome,
    i18n: globalThis.chrome?.i18n || { getUILanguage: () => navigator.language },
    runtime: globalThis.chrome?.runtime || { getURL: (path) => path },
    storage: {
      ...globalThis.chrome?.storage,
      local: globalThis.chrome?.storage?.local || {
        async get(defaults = {}) {
          return { ...defaults, ...readFallbackStore() };
        },
        async set(values = {}) {
          writeFallbackStore({ ...readFallbackStore(), ...values });
        }
      }
    },
    history: globalThis.chrome?.history || {
      async search() {
        return [];
      },
      async getVisits() {
        return [];
      },
      async deleteUrl() {}
    },
    bookmarks: globalThis.chrome?.bookmarks || {
      async getTree() {
        return [{ id: "0", title: "Bookmarks", children: [] }];
      },
      async getChildren() {
        return [];
      },
      async get() {
        return [];
      },
      async remove() {},
      onCreated: emptyEvent,
      onRemoved: emptyEvent,
      onChanged: emptyEvent,
      onMoved: emptyEvent,
      onChildrenReordered: emptyEvent,
      onImportEnded: emptyEvent
    }
  };
}

function storageAreaForKey(key) {
  return chrome.storage?.local || chrome.storage?.sync;
}

async function getStoredValues(defaults = {}) {
  if (chrome.storage?.local && chrome.storage?.sync && chrome.storage.local !== chrome.storage.sync) {
    const keys = Object.keys(defaults);
    const syncedKeys = keys.filter((key) => SYNC_STORAGE_KEYS.has(key));
    if (syncedKeys.length) {
      const [localValues, syncValues] = await Promise.all([
        chrome.storage.local.get(keys),
        chrome.storage.sync.get(syncedKeys)
      ]);
      return Object.fromEntries(keys.map((key) => [
        key,
        typeof localValues[key] !== "undefined"
          ? localValues[key]
          : (SYNC_STORAGE_KEYS.has(key) && typeof syncValues[key] !== "undefined" ? syncValues[key] : defaults[key])
      ]));
    }
  }
  const storage = storageAreaForKey();
  return storage ? storage.get(defaults) : { ...defaults };
}

async function setStoredValues(values = {}) {
  const storage = storageAreaForKey();
  if (storage) {
    await storage.set(values);
  }
}

function favoriteSitesForCloudSync(sites) {
  return Array.isArray(sites)
    ? sites.map((site) => {
      if (!site || typeof site !== "object" || Array.isArray(site)) {
        return site;
      }
      const { icon: _icon, ...portableSite } = site;
      return portableSite;
    })
    : sites;
}

function cloudSyncPayload(values = {}) {
  const payload = { ...values };
  if (Object.prototype.hasOwnProperty.call(payload, FAVORITE_SITES_STORAGE_KEY)) {
    payload[FAVORITE_SITES_STORAGE_KEY] = favoriteSitesForCloudSync(payload[FAVORITE_SITES_STORAGE_KEY]);
  }
  return payload;
}

function readFirstPaintCache() {
  try {
    const cache = JSON.parse(localStorage.getItem(FIRST_PAINT_CACHE_STORAGE_KEY) || "{}");
    if (cache?.version !== FIRST_PAINT_CACHE_VERSION || cache.extensionVersion !== firstPaintExtensionVersion()) {
      return {};
    }
    if (cache.codeSignature !== WayleafIcon.iconRenderCodeSignature()) {
      // Icon algorithm changed: keep the cheap site-list scaffold so layout still paints
      // instantly, but drop the rendered icon outputs so they recompute from the latest code.
      return { ...cache, iconRenders: {} };
    }
    return cache;
  } catch {
    return {};
  }
}

function writeFirstPaintCache(values = {}) {
  try {
    localStorage.setItem(FIRST_PAINT_CACHE_STORAGE_KEY, JSON.stringify({
      ...readFirstPaintCache(),
      ...values,
      version: FIRST_PAINT_CACHE_VERSION,
      extensionVersion: firstPaintExtensionVersion(),
      codeSignature: WayleafIcon.iconRenderCodeSignature()
    }));
  } catch {}
}

function firstPaintExtensionVersion() {
  try {
    return chrome.runtime?.getManifest?.().version || "preview";
  } catch {
    return "preview";
  }
}


function renderFirstPaintCache() {
  WayleafIcon.primeSiteIconRawSvgCacheFromStorage();
  const cache = readFirstPaintCache();
  const favoriteSites = normalizeCachedFavoriteSites(cache.favoriteSites);
  const recentGroups = normalizeCachedRecentGroups(cache.recentGroups);
  const favoriteIconMap = favoriteSiteIconMap(favoriteSites);
  if (favoriteSites.length) {
    renderFavoriteSiteList(favoriteSites, { iconRenders: cache.iconRenders });
  }
  if (recentGroups.length) {
    renderRecentFolders(recentGroups, { iconRenders: cache.iconRenders, favoriteIconMap });
  }
}

function normalizeCachedFavoriteSites(value) {
  return Array.isArray(value)
    ? value
      .filter((site) => site?.url && isWebUrl(site.url))
      .slice(0, MAX_FAVORITE_SITES)
      .map((site) => ({
        id: String(site.id || site.url),
        title: normalizeText(site.title) || compactSiteDomain(site.url),
        url: site.url,
        icon: normalizeStoredSiteIcon(site.icon)
      }))
    : [];
}

function normalizeCachedRecentGroups(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((group) => {
    const pages = Array.isArray(group?.pages)
      ? group.pages
        .filter((item) => item?.url && isDisplayableHistoryUrl(safeUrl(item.url)))
        .slice(0, MAX_HISTORY_PAGES_PER_SITE)
        .map((item) => ({
          title: normalizeText(item.title) || historyFallbackTitle(safeUrl(item.url)),
          url: item.url,
          icon: historyItemIcon(item),
          lastVisitTime: Number(item.lastVisitTime || 0),
          visitCount: Number(item.visitCount || 0),
          typedCount: Number(item.typedCount || 0)
        }))
      : [];
    if (!pages.length) {
      return null;
    }
    const firstUrl = safeUrl(pages[0].url);
    const key = siteGroupKey(safeUrl(group?.url)) || siteGroupKey(firstUrl);
    if (!key) {
      return null;
    }
    return {
      key,
      name: normalizeText(group.name) || siteDisplayName(firstUrl, pages[0].title),
      url: isDisplayableHistoryUrl(safeUrl(group.url)) ? group.url : pages[0].url,
      homeUrl: isDisplayableHistoryUrl(safeUrl(group.homeUrl)) ? group.homeUrl : siteHomeUrl(key, pages[0].url),
      icon: historyItemIcon(group),
      visitCount: Number(group.visitCount || 0),
      typedCount: Number(group.typedCount || 0),
      lastVisitTime: Number(group.lastVisitTime || 0),
      pages,
      deleteUrls: Array.isArray(group.deleteUrls) ? group.deleteUrls.filter(Boolean) : []
    };
  }).filter(Boolean).slice(0, MAX_HISTORY_SITE_GROUPS);
}

function serializeRecentGroupsForFirstPaint(groups) {
  return (groups || []).slice(0, MAX_HISTORY_SITE_GROUPS).map((group) => ({
    key: group.key,
    name: group.name,
    url: group.url,
    homeUrl: group.homeUrl,
    icon: historyItemIcon(group),
    visitCount: Number(group.visitCount || 0),
    typedCount: Number(group.typedCount || 0),
    lastVisitTime: Number(group.lastVisitTime || 0),
    deleteUrls: group.deleteUrls,
    pages: (group.pages || []).slice(0, MAX_HISTORY_PAGES_PER_SITE).map((item) => ({
      title: normalizeText(item.title),
      url: item.url,
      icon: historyItemIcon(item),
      lastVisitTime: Number(item.lastVisitTime || 0),
      visitCount: Number(item.visitCount || 0),
      typedCount: Number(item.typedCount || 0)
    }))
  }));
}

function historyItemIcon(item) {
  return normalizeStoredSiteIcon(item?.icon || item?.favIconUrl || "");
}


async function migrateSyncStorageFromLocal() {
  if (!chrome.storage?.sync || !chrome.storage?.local || chrome.storage.sync === chrome.storage.local) {
    return;
  }
  const keys = [...SYNC_STORAGE_KEYS];
  try {
    const [localValues, syncValues] = await Promise.all([
      chrome.storage.local.get(keys),
      chrome.storage.sync.get(keys)
    ]);
    const missingLocalValues = {};
    const missingSyncValues = {};
    keys.forEach((key) => {
      if (typeof localValues[key] === "undefined" && typeof syncValues[key] !== "undefined") {
        missingLocalValues[key] = syncValues[key];
      }
      if (typeof localValues[key] !== "undefined" && typeof syncValues[key] === "undefined") {
        missingSyncValues[key] = localValues[key];
      }
    });
    await Promise.all([
      Object.keys(missingLocalValues).length ? chrome.storage.local.set(missingLocalValues) : Promise.resolve(),
      Object.keys(missingSyncValues).length ? chrome.storage.sync.set(cloudSyncPayload(missingSyncValues)) : Promise.resolve()
    ]);
  } catch (error) {
    console.warn("Failed to migrate synced settings", error);
  }
}

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

function normalizeLanguagePreference(value) {
  return LANGUAGE_PREFERENCES.includes(value) ? value : "system";
}

function applyLanguagePreference(preference) {
  activeLanguagePreference = normalizeLanguagePreference(preference);
  LOCALE = activeLanguagePreference === "system" ? resolveLocale() : activeLanguagePreference;
}

function t(key, values = {}) {
  const template = messageTemplate(key);
  return template.replace(/\{(\w+)\}/g, (_, valueKey) => String(values[valueKey] ?? ""));
}

function searchEngineLabel(engine) {
  if (!engine) {
    return "";
  }
  return engine.customLabel || (engine.labelKey ? t(engine.labelKey) : (engine.label || ""));
}

function themePaletteLabel(palette) {
  if (!palette) {
    return "";
  }
  return palette.labelKey ? t(palette.labelKey) : (palette.label || palette.id || "");
}

function messageTemplate(key) {
  if (Object.prototype.hasOwnProperty.call(MESSAGES[LOCALE] || {}, key)) {
    return MESSAGES[LOCALE][key];
  }
  if (Object.prototype.hasOwnProperty.call(MESSAGES[DEFAULT_LOCALE] || {}, key)) {
    return MESSAGES[DEFAULT_LOCALE][key];
  }
  return Object.prototype.hasOwnProperty.call(MESSAGES.en || {}, key) ? MESSAGES.en[key] : key;
}

function applyLocale() {
  document.documentElement.lang = LOCALE;
  document.querySelector(".topbar")?.setAttribute("aria-label", t("topbarLabel"));
  document.querySelector(".shell")?.setAttribute("aria-label", t("shellLabel"));
  setButtonLabel(portalSurfaceButton, t("openPortalSurface"));
  surfaceBackButtons.forEach((button) => setButtonLabel(button, t("collapseSurface")));
  setButtonLabel(surfaceBackdrop, t("collapseSurface"));
  updateRecentHeaderState();
  document.querySelector(".recent-folder-switch-controls")?.setAttribute("aria-label", t("recentFoldersSwitch"));
  document.querySelector("#portal-title").textContent = t("bookmarkPortalTab");
  setMobileTabLabel("portalPanel", t("mobilePortalTab"));

  setButtonLabel(refreshBookmarkFolderButton, t("refreshBookmarkFolder"));
  setButtonLabel(bookmarkFavoriteAddButton, t("addFavoriteSite"));
  setButtonLabel(settingsButton, t("openSettings"));
  setButtonLabel(closeSettingsButton, t("settingsBackHome"));
  settingsShell?.setAttribute("aria-label", t("settingsTitle"));
  setButtonLabel(favoriteAddButton, t("addFavoriteSite"));
  setStaticButtonIcons();
  bookmarkSearchInput.placeholder = t("bookmarkSearchPlaceholder");
  bookmarkSearchInput.setAttribute("aria-label", t("bookmarkSearchPlaceholder"));
  bookmarkSearchLabel.textContent = t("bookmarkSearchPlaceholder");
  bookmarkFolderLane.setAttribute("aria-label", t("bookmarkFolders"));
  bookmarkSortLabel.textContent = t("bookmarkSortLabel");
  bookmarkSortSelect.options[0].textContent = t("bookmarkSortRecent");
  bookmarkSortSelect.options[1].textContent = t("bookmarkSortTitle");
  applySettingsLocale();
  quickSearchInput.placeholder = t("quickSearchPlaceholder");
  quickSearchInput.setAttribute("aria-label", t("quickSearchPlaceholder"));
  googleImageSearchButton?.setAttribute("aria-label", t("googleImageSearch"));
  if (googleImageSearchButton) {
    googleImageSearchButton.title = t("googleImageSearch");
  }
  const attachmentLabel = aiAttachmentButtonLabel();
  aiAttachmentButton?.setAttribute("aria-label", attachmentLabel);
  if (aiAttachmentButton) {
    aiAttachmentButton.title = attachmentLabel;
  }
  quickSearchInput.labels?.forEach((label) => {
    label.textContent = t("quickSearchPlaceholder");
  });
  updateQuickSearchModeUi();

  favoriteUrlInput.closest("label").querySelector("span").textContent = t("portalUrl");
  favoriteUrlInput.placeholder = t("portalUrlPlaceholder");
  cancelFavoriteButton.textContent = t("cancel");
  favoriteForm.querySelector('button[type="submit"]').textContent = t("add");
  applyOnboardingLocale();
  setButtonLabel(closeBookmarkPickerButton, t("back"));
  bookmarkPickerTitle.textContent = t("chooseBookmarkFolderPrompt");
}

function applyOnboardingLocale() {
  if (!onboardingGuide) {
    return;
  }
  const step = ONBOARDING_STEPS[onboardingStepIndex] || ONBOARDING_STEPS[0];
  onboardingKicker.textContent = `${t("onboardingKicker")} · ${onboardingStepIndex + 1} / ${ONBOARDING_STEPS.length}`;
  onboardingStepTitle.textContent = t(step.titleKey);
  onboardingStepBody.textContent = t(step.bodyKey);
  onboardingDoneButton.textContent = t(onboardingStepIndex === ONBOARDING_STEPS.length - 1 ? "onboardingDone" : "onboardingNext");
  setButtonLabel(onboardingCloseButton, t("closeOnboarding"));
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
  button.setAttribute("aria-label", label);
}

function setThemeModeButtonLabel(button, label) {
  setButtonLabel(button, label);
  button.title = label;
  const visibleLabel = button.querySelector(".theme-mode-label");
  if (visibleLabel) {
    visibleLabel.textContent = label;
  }
}

function setStaticButtonIcons() {
  portalSurfaceButton.querySelector(".button-icon").innerHTML = portalSurfaceIcon();
  surfaceBackButtons.forEach((button) => {
    button.querySelector(".button-icon").innerHTML = arrowLeftIcon();
  });
  document.querySelector(".bookmark-search-icon").innerHTML = searchEngineSearchIcon();
  refreshBookmarkFolderButton.querySelector(".button-icon").innerHTML = refreshIcon();
  bookmarkFavoriteAddButton.querySelector(".button-icon").innerHTML = plusIcon();
  closeBookmarkPickerButton.querySelector(".button-icon").innerHTML = arrowLeftIcon();
  const recentViewToggleIcon = recentViewToggleButton?.querySelector(".button-icon");
  if (recentViewToggleIcon) {
    recentViewToggleIcon.innerHTML = swapIcon();
  }
  const recentFoldersPreviousIcon = recentFoldersPreviousButton?.querySelector(".button-icon");
  const recentFoldersNextIcon = recentFoldersNextButton?.querySelector(".button-icon");
  if (recentFoldersPreviousIcon && !recentFoldersPreviousIcon.innerHTML) {
    recentFoldersPreviousIcon.innerHTML = chevronLeftIcon();
  }
  if (recentFoldersNextIcon && !recentFoldersNextIcon.innerHTML) {
    recentFoldersNextIcon.innerHTML = chevronRightIcon();
  }
  settingsButton.querySelector(".theme-toggle-icon").innerHTML = settingsToggleIcon();
  updateSettingsTabIcons();
  document.querySelectorAll("[data-theme-mode]").forEach((button) => {
    button.querySelector(".button-icon").innerHTML = themeModeIcon(button.dataset.themeMode);
  });
  const closeSettingsIcon = closeSettingsButton?.querySelector(".button-icon");
  if (closeSettingsIcon) {
    closeSettingsIcon.innerHTML = arrowLeftIcon();
  }
  document.querySelector(".settings-page-help .button-icon").innerHTML = githubIcon();
  favoriteAddButton.querySelector(".button-icon").innerHTML = plusIcon();
}

function applySettingsLocale() {
  document.querySelector("#settingsTitle").textContent = t("settingsTitle");
  document.querySelector("#settingsSubtitle").textContent = t("settingsSubtitle");
  document.querySelector(".settings-tabs")?.setAttribute("aria-label", t("settingsTabsLabel"));
  const settingsBasicTab = document.querySelector("#settingsBasicTab");
  const settingsSearchTab = document.querySelector("#settingsSearchTab");
  const settingsLaboratoryTab = document.querySelector("#settingsLaboratoryTab");
  settingsBasicTab.querySelector(".settings-tab-label").textContent = t("settingsBasicTab");
  settingsSearchTab.querySelector(".settings-tab-label").textContent = t("settingsSearchTab");
  settingsLaboratoryTab.querySelector(".settings-tab-label").textContent = t("settingsLaboratoryTab");
  settingsBasicTab.setAttribute("aria-label", t("settingsBasicTab"));
  settingsSearchTab.setAttribute("aria-label", t("settingsSearchTab"));
  settingsLaboratoryTab.setAttribute("aria-label", t("settingsLaboratoryTab"));
  settingsBasicTab.title = t("settingsBasicTab");
  settingsSearchTab.title = t("settingsSearchTab");
  settingsLaboratoryTab.title = t("settingsLaboratoryTab");
  document.querySelector("#languageSettingsTitle").textContent = t("languageSettingsTitle");
  renderLanguageOptions();
  document.querySelector("#themeModeControl")?.setAttribute("aria-label", t("appearanceModeTitle"));
  document.querySelector("#appearanceModeTitle").textContent = t("appearanceModeTitle");
  document.querySelector("#presetPaletteTitle").textContent = t("presetPaletteTitle");
  document.querySelector("#syncSettingsTitle").textContent = t("syncSettingsTitle");
  document.querySelector("#searchSettingsDefaultTitle").textContent = t("searchSettingsDefaultTitle");
  document.querySelector('[aria-labelledby="searchSettingsDefaultTitle"] .settings-group-heading p').textContent = t("searchSettingsDefaultDescription");
  document.querySelector('[aria-labelledby="searchSettingsDefaultTitle"] .settings-group-note').textContent = t("searchSettingsDefaultHint");
  document.querySelector("#searchSettingsAiTitle").textContent = t("searchSettingsAiTitle");
  document.querySelector('[aria-labelledby="searchSettingsAiTitle"] .settings-group-heading p').textContent = t("searchSettingsAiDescription");
  document.querySelector('[aria-labelledby="searchSettingsAiTitle"] .settings-group-note').textContent = t("searchSettingsAiHint");
  document.querySelector("#searchSettingsPlatformTitle").textContent = t("searchSettingsPlatformTitle");
  document.querySelector('[aria-labelledby="searchSettingsPlatformTitle"] .settings-group-heading p').textContent = t("searchSettingsPlatformDescription");
  document.querySelector('[aria-labelledby="searchSettingsPlatformTitle"] .settings-group-note').textContent = t("searchSettingsPlatformHint");
  document.querySelector("#resetSearchSettingsButton").textContent = t("searchSettingsReset");
  document.querySelector("#searchSettingsForm button[type='submit']").textContent = t("searchSettingsSave");
  document.querySelector("#videoPipLabTitle").textContent = t("videoPipLabTitle");
  const videoPipLabDescription = document.querySelector("#videoPipLabDescription");
  const videoPipLabDescriptionText = t("videoPipLabDescription");
  videoPipLabDescription.textContent = videoPipLabDescriptionText;
  videoPipLabDescription.hidden = !videoPipLabDescriptionText.trim();
  document.querySelector("#videoPipLabel").textContent = t("videoPipLabel");
  document.querySelector("#videoPipHint").textContent = t("videoPipHint");
  updateVideoPipToggle();
  if (closeSettingsButton) {
    closeSettingsButton.title = t("settingsBackHome");
  }
  const settingsHelp = document.querySelector(".settings-page-help");
  const settingsHelpLabel = settingsHelp?.querySelector("span:last-child");
  if (settingsHelp) {
    setButtonLabel(settingsHelp, "GitHub");
    settingsHelp.title = "GitHub";
    settingsHelp.href = ISSUE_FEEDBACK_URL;
  }
  if (settingsHelpLabel) {
    settingsHelpLabel.textContent = "GitHub";
  }
  document.querySelectorAll("[data-theme-mode]").forEach((button) => {
    const mode = button.dataset.themeMode;
    if (mode === "system") {
      setThemeModeButtonLabel(button, t("themeModeSystem"));
    } else if (mode === "light") {
      setThemeModeButtonLabel(button, t("themeModeLight"));
    } else if (mode === "dark") {
      setThemeModeButtonLabel(button, t("themeModeDark"));
    }
  });
  setButtonLabel(syncSettingsNowButton, t("syncSettingsNow"));
  setButtonLabel(syncSettingsAutoButton, t("syncSettingsAuto"));
  syncSettingsAutoButton.title = t("syncSettingsAutoHint");
  document.querySelector(".sync-settings-actions")?.setAttribute("aria-label", t("syncSettingsActionsLabel"));
  updateSyncSettingsUi();
  renderSearchSettingsForm();
  updateSettingsActiveSummary(settingsTabButtons.find((button) => button.classList.contains("active"))?.dataset.settingsTab);
}

function updateVideoPipToggle() {
  if (!videoPipToggle) {
    return;
  }
  videoPipToggle.setAttribute("aria-checked", String(videoPipEnabled));
  setButtonLabel(videoPipToggle, t("videoPipLabel"));
}

async function initVideoPipSetting() {
  const stored = await getStoredValues({
    [VIDEO_PIP_ENABLED_STORAGE_KEY]: null,
    [LEGACY_VIDEO_PIP_GLOBAL_ENABLED_STORAGE_KEY]: false,
    [LEGACY_SOCIAL_VIDEO_EXTRACTOR_ENABLED_STORAGE_KEY]: true
  });
  videoPipEnabled = typeof stored[VIDEO_PIP_ENABLED_STORAGE_KEY] === "boolean"
    ? stored[VIDEO_PIP_ENABLED_STORAGE_KEY]
    : stored[LEGACY_VIDEO_PIP_GLOBAL_ENABLED_STORAGE_KEY] === true ||
      stored[LEGACY_SOCIAL_VIDEO_EXTRACTOR_ENABLED_STORAGE_KEY] !== false;
  const migration = {};
  if (typeof stored[VIDEO_PIP_ENABLED_STORAGE_KEY] !== "boolean") {
    migration[VIDEO_PIP_ENABLED_STORAGE_KEY] = videoPipEnabled;
  }
  if (stored[LEGACY_VIDEO_PIP_GLOBAL_ENABLED_STORAGE_KEY] !== false) {
    migration[LEGACY_VIDEO_PIP_GLOBAL_ENABLED_STORAGE_KEY] = false;
  }
  if (Object.keys(migration).length) {
    await setStoredValues(migration);
  }
  updateVideoPipToggle();
}

async function toggleVideoPipSetting() {
  videoPipEnabled = !videoPipEnabled;
  updateVideoPipToggle();
  try {
    await setStoredValues({ [VIDEO_PIP_ENABLED_STORAGE_KEY]: videoPipEnabled });
  } catch (error) {
    videoPipEnabled = !videoPipEnabled;
    updateVideoPipToggle();
    console.error("Failed to save video mini-player setting", error);
  }
}

function renderLanguageOptions() {
  if (!languageOptions) {
    return;
  }
  languageOptions.replaceChildren(...LANGUAGE_PREFERENCES.map((preference) => {
    const option = document.createElement("button");
    option.className = "theme-mode-button settings-language-option";
    option.type = "button";
    option.dataset.languagePreference = preference;
    option.id = `languageOption-${preference}`;
    option.setAttribute("role", "radio");
    const label = document.createElement("span");
    label.className = "theme-mode-label";
    label.textContent = languagePreferenceLabel(preference);
    option.append(label);
    return option;
  }));
  updateLanguageControl();
}

function languagePreferenceLabel(preference) {
  return preference === "system" ? t("themeModeSystem") : LANGUAGE_OPTION_LABELS[preference];
}

function updateLanguageControl() {
  if (!languageOptions) {
    return;
  }
  const options = [...languageOptions.querySelectorAll(".settings-language-option")];
  const activeIndex = Math.max(0, options.findIndex((option) => option.dataset.languagePreference === activeLanguagePreference));
  languageOptions.setAttribute("data-active-index", String(activeIndex));
  options.forEach((option) => {
    const isSelected = option.dataset.languagePreference === activeLanguagePreference;
    option.classList.toggle("active", isSelected);
    option.setAttribute("aria-checked", String(isSelected));
    option.tabIndex = isSelected ? 0 : -1;
  });
}

function handleLanguageOptionClick(event) {
  const option = event.target.closest?.(".settings-language-option");
  if (!option) {
    return;
  }
  void setLanguagePreference(option.dataset.languagePreference);
}

function handleLanguageOptionsKeydown(event) {
  const options = [...languageOptions.querySelectorAll(".settings-language-option")];
  const currentIndex = options.findIndex((option) => option === document.activeElement);
  if (event.key === "Escape") {
    document.activeElement?.blur();
    return;
  }
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    event.stopPropagation();
    const currentOption = options[currentIndex];
    if (currentOption) {
      void setLanguagePreference(currentOption.dataset.languagePreference);
    }
    return;
  }
  if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
    return;
  }
  event.preventDefault();
  const lastIndex = options.length - 1;
  const nextIndex = event.key === "Home"
    ? 0
    : event.key === "End"
      ? lastIndex
      : event.key === "ArrowUp" || event.key === "ArrowLeft"
        ? Math.max(0, currentIndex - 1)
        : Math.min(lastIndex, currentIndex + 1);
  options[nextIndex]?.focus({ preventScroll: true });
}

async function initLanguagePreference() {
  try {
    const result = await getStoredValues({ [LANGUAGE_STORAGE_KEY]: "system" });
    applyLanguagePreference(result[LANGUAGE_STORAGE_KEY]);
  } catch (error) {
    console.warn("Failed to load language preference", error);
    applyLanguagePreference("system");
  }
}

async function initRecentViewMode() {
  try {
    const result = await getStoredValues({ [RECENT_VIEW_MODE_STORAGE_KEY]: "recent" });
    recentViewMode = result[RECENT_VIEW_MODE_STORAGE_KEY] === "today" ? "today" : "recent";
  } catch (error) {
    console.warn("Failed to load recent view mode", error);
    recentViewMode = "recent";
  }
}

async function saveRecentViewMode() {
  try {
    await setStoredValues({ [RECENT_VIEW_MODE_STORAGE_KEY]: recentViewMode });
  } catch (error) {
    console.warn("Failed to save recent view mode", error);
  }
}

async function setLanguagePreference(preference) {
  applyLanguagePreference(preference);
  applyLocale();
  renderThemePalettePresets();
  updateThemeSettingsUi();
  void renderFavoriteSites();
  void renderSelectedBookmarkFolder();
  void refreshHistory();
  try {
    await setStoredValues({ [LANGUAGE_STORAGE_KEY]: activeLanguagePreference });
  } catch (error) {
    console.warn("Failed to save language preference", error);
  }
}

async function init() {
  hydrateThemeFromBootCache();
  await initLanguagePreference();
  await initRecentViewMode();
  try {
    applyLocale();
  } finally {
    document.documentElement.classList.remove("locale-hydrating");
  }
  renderFirstPaintCache();
  const siteIconIndexReady = WayleafIcon.initSiteIconIndex();
  siteIconIndexReady.then(() => {
    scheduleIconIdleTask(() => {
      WayleafIcon.verifyIconCodeHashAndHealStaleIcons().catch(() => {});
    });
  }).catch(() => {});
  const themeModeReady = initThemeMode();
  Promise.all([siteIconIndexReady, themeModeReady]).then(() => {
    WayleafIcon.refreshRenderedSiteIcons();
  }).catch(() => {});
  const searchSettingsReady = initSearchSettings();
  const videoPipSettingReady = initVideoPipSetting();
  await initQuickSearchEngine();
  renderFavoriteSites();
  renderSelectedBookmarkFolder();
  refreshHistory();
  void searchSettingsReady;
  void themeModeReady;
  void videoPipSettingReady;

  refreshBookmarkFolderButton.addEventListener("click", () => {
    clearBookmarkFolderViewCache();
    void renderSelectedBookmarkFolder();
  });
  bookmarkFavoriteAddButton?.addEventListener("click", toggleFavoriteForm);
  bookmarkSearchInput.addEventListener("input", () => void renderVisibleBookmarkSites());
  bookmarkSortSelect.addEventListener("change", () => void renderVisibleBookmarkSites());
  closeBookmarkPickerButton.addEventListener("click", closeBookmarkPicker);
  recentFoldersPreviousButton?.addEventListener("click", (event) => {
    showRecentFolderPage(recentFolderPageIndex - 1, "previous");
    if (event.detail > 0) {
      recentFoldersPreviousButton.blur();
    }
  });
  recentFoldersNextButton?.addEventListener("click", (event) => {
    showRecentFolderPage(recentFolderPageIndex + 1, "next");
    if (event.detail > 0) {
      recentFoldersNextButton.blur();
    }
  });
  recentViewToggleButton?.addEventListener("click", (event) => {
    setRecentViewMode(recentViewMode === "today" ? "recent" : "today");
    if (event.detail > 0) {
      recentViewToggleButton.blur();
    }
  });
  portalSurfaceButton.addEventListener("click", () => toggleSurfacePanel("portalPanel"));
  surfaceBackButtons.forEach((button) => {
    button.addEventListener("click", () => setActiveSurfacePanel(""));
  });
  surfaceBackdrop?.addEventListener("click", () => setActiveSurfacePanel(""));
  quickSearchForm.addEventListener("submit", handleQuickSearchSubmit);
  quickSearchLeadingIcon?.addEventListener("pointerdown", handleQuickSearchLeadingIconPointerDown);
  quickSearchLeadingIcon?.addEventListener("click", handleQuickSearchLeadingIconClick);
  quickSearchInput.addEventListener("keydown", handleQuickSearchInputKeydown);
  quickSearchInput.addEventListener("input", handleQuickSearchInput);
  quickSearchInput.addEventListener("focus", handleQuickSearchFocus);
  quickSearchInput.addEventListener("blur", handleQuickSearchBlur);
  googleImageSearchButton?.addEventListener("click", handleGoogleImageSearchButtonClick);
  googleImageSearchInput?.addEventListener("change", handleGoogleImageSearchInputChange);
  aiAttachmentButton?.addEventListener("click", handleAiAttachmentButtonClick);
  aiAttachmentInput?.addEventListener("change", handleAiAttachmentInputChange);
  aiAttachmentPill?.addEventListener("click", handleAiAttachmentPillClick);
  favoriteAddButton.addEventListener("click", toggleFavoriteForm);
  cancelFavoriteButton.addEventListener("click", hideFavoriteForm);
  favoriteForm.addEventListener("submit", handleFavoriteSubmit);
  onboardingCloseButton?.addEventListener("click", dismissOnboardingGuide);
  onboardingDoneButton?.addEventListener("click", advanceOnboardingGuide);
  settingsButton.addEventListener("click", toggleSettingsPanel);
  closeSettingsButton.addEventListener("click", closeSettingsPanel);
  settingsShell?.addEventListener("scroll", updateSettingsTabsStickyVisualState, { passive: true });
  window.addEventListener("resize", updateSettingsTabsStickyVisualState);
  window.addEventListener("resize", positionOnboardingStep);
  syncSettingsNowButton?.addEventListener("click", handleManualSyncSettings);
  exportSettingsButton?.addEventListener("click", handleExportSettings);
  importSettingsButton?.addEventListener("click", () => importSettingsInput?.click());
  importSettingsInput?.addEventListener("change", handleImportSettingsChange);
  videoPipToggle?.addEventListener("click", toggleVideoPipSetting);
  languageOptions?.addEventListener("click", handleLanguageOptionClick);
  languageOptions?.addEventListener("keydown", handleLanguageOptionsKeydown);
  settingsTabButtons.forEach((button) => {
    button.addEventListener("click", () => activateSettingsTab(button.dataset.settingsTab));
  });
  searchSettingsForm?.addEventListener("submit", handleSearchSettingsSubmit);
  resetSearchSettingsButton?.addEventListener("click", handleSearchSettingsReset);
  document.querySelectorAll("[data-theme-mode]").forEach((button) => {
    button.addEventListener("pointerdown", (event) => {
      if (searchWorkbench?.classList.contains("search-active")) {
        event.preventDefault();
      }
    });
    button.addEventListener("click", (event) => setThemeMode(button.dataset.themeMode, {
      persist: true,
      sourceEvent: event
    }));
  });
  mobileSectionTabs.forEach((tab) => {
    tab.addEventListener("click", () => activateMobilePanel(tab.dataset.panelTarget));
  });
  document.addEventListener("pointerdown", handleBookmarkDeleteDismiss, true);
  document.addEventListener("pointerdown", handleFavoriteDeleteDismiss, true);
  document.addEventListener("pointerdown", handleSurfacePanelDismiss, true);
  document.addEventListener("pointerdown", handlePortalCategoryPickerDismiss, true);
  document.addEventListener("pointerdown", handleSearchSuggestionDismiss, true);
  document.addEventListener("pointerdown", handleSettingsPanelDismiss, true);
  document.addEventListener("dragstart", preventNativeSiteIconDrag, true);
  document.addEventListener("keydown", handleBookmarkDeleteEscape);
  document.addEventListener("keydown", handleGlobalEscape);
  bindBookmarkChangeEvents();
  requestOnboardingGuide();
  requestAnimationFrame(animatePageRefreshEntry);
}

function activatePortalView(view) {
  const nextView = view === "bookmarks" ? "bookmarks" : "smart";
  activePortalView = nextView;
  document.querySelector(".portal-mode-tabs")?.setAttribute("data-active-view", nextView);
  portalModeTabs.forEach((tab) => {
    const isActive = tab.dataset.portalView === nextView;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });
  portalViews.forEach((viewNode) => {
    const isActive = viewNode.id === (nextView === "bookmarks" ? "bookmarkPortalView" : "smartPortalView");
    viewNode.classList.toggle("active", isActive);
    viewNode.hidden = !isActive;
  });
  togglePortalFormButton.hidden = nextView === "bookmarks" || !portalForm.hidden;
  clearBookmarkDeleteMode();
  if (nextView === "bookmarks" && bookmarkPicker.hidden) {
    renderSelectedBookmarkFolder();
  }
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
  setActiveSurfacePanel(panelId);
}

function toggleSurfacePanel(panelId) {
  setActiveSurfacePanel(activeSurfacePanelId === panelId ? "" : panelId);
}

function setActiveSurfacePanel(panelId) {
  const previousPanelId = activeSurfacePanelId;
  activeSurfacePanelId = panelId === "portalPanel" ? panelId : "";
  const hasActiveSurfacePanel = Boolean(activeSurfacePanelId);
  const isOpeningSurfacePanel = hasActiveSurfacePanel && !previousPanelId;
  if (surfaceBackdrop && isOpeningSurfacePanel) {
    surfaceBackdrop.hidden = false;
    surfaceBackdrop.removeAttribute("tabindex");
    // Flush hidden -> visible so the backdrop opacity transition starts from the closed state.
    surfaceBackdrop.getBoundingClientRect();
  }
  secondaryShell.dataset.activeSurface = activeSurfacePanelId;
  secondaryShell.dataset.previousSurface = previousPanelId || "";
  secondaryShell.classList.toggle("surface-open", hasActiveSurfacePanel);
  secondaryShell.classList.toggle("surface-closing", Boolean(!activeSurfacePanelId && previousPanelId));
  if (surfaceBackdrop) {
    if (!activeSurfacePanelId && surfaceBackdrop.contains(document.activeElement)) {
      surfaceBackdrop.blur();
    }
    surfaceBackdrop.hidden = !activeSurfacePanelId && !previousPanelId;
    if (!activeSurfacePanelId) {
      surfaceBackdrop.tabIndex = -1;
    }
  }
  syncSurfaceChromeState();
  document.querySelectorAll(".panel").forEach((panel) => {
    const isActive = panel.id === activeSurfacePanelId;
    const isClosing = !activeSurfacePanelId && panel.id === previousPanelId;
    panel.classList.toggle("surface-active", isActive);
    panel.classList.toggle("surface-closing", isClosing);
  });
  portalSurfaceButton.setAttribute("aria-expanded", String(activeSurfacePanelId === "portalPanel"));
  portalSurfaceButton.classList.toggle("active", activeSurfacePanelId === "portalPanel");
  if (activeSurfacePanelId === "portalPanel" && activePortalView === "bookmarks" && bookmarkPicker.hidden) {
    renderSelectedBookmarkFolder();
  }
  if (activeSurfacePanelId) {
    focusActiveSurfacePanel(activeSurfacePanelId);
  }
  if (!activeSurfacePanelId && previousPanelId) {
    window.setTimeout(() => {
      if (!activeSurfacePanelId) {
        if (surfaceBackdrop) {
          surfaceBackdrop.hidden = true;
        }
        setHomeSurfaceIsolation(false);
        secondaryShell.classList.remove("surface-closing");
        secondaryShell.dataset.previousSurface = "";
        document.querySelectorAll(".panel.surface-closing").forEach((panel) => {
          panel.classList.remove("surface-closing");
        });
        syncSurfaceChromeState();
      }
    }, prefersReducedMotion() ? 0 : 220);
  }
}

function setHomeSurfaceIsolation(isIsolated) {
  [homeStage, topbar].forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    if (isIsolated) {
      node.setAttribute("aria-hidden", "true");
      node.inert = true;
      return;
    }
    node.removeAttribute("aria-hidden");
    node.inert = false;
  });
}

function syncSurfaceChromeState() {
  const hasSurfacePanel = Boolean(activeSurfacePanelId);
  const hasSettingsPage = Boolean(settingsShell?.classList.contains("page-active") || settingsShell?.classList.contains("page-closing"));
  document.body.classList.toggle("surface-open", hasSurfacePanel);
  document.body.classList.toggle("settings-page-open", hasSettingsPage);
  setHomeSurfaceIsolation(Boolean(hasSurfacePanel || hasSettingsPage));
}

function focusActiveSurfacePanel(panelId) {
  window.requestAnimationFrame(() => {
    if (activeSurfacePanelId !== panelId) {
      return;
    }
    const panel = document.getElementById(panelId);
    const heading = panel?.querySelector("h1, h2");
    if (heading instanceof HTMLElement) {
      heading.focus({ preventScroll: true });
    }
  });
}

function handleSurfacePanelDismiss(event) {
  if (!activeSurfacePanelId) {
    return;
  }
  const target = event.target;
  if (target instanceof Element && (secondaryShell.contains(target) || portalSurfaceButton.contains(target))) {
    return;
  }
  setActiveSurfacePanel("");
}

async function initThemeMode() {
  renderThemePalettePresets();
  bindSystemThemeListener();
  try {
    const result = await getStoredValues({
      [THEME_STORAGE_KEY]: DEFAULT_THEME_MODE,
      [THEME_PALETTE_STORAGE_KEY]: defaultThemePaletteSettings()
    });
    const savedTheme = result[THEME_STORAGE_KEY];
    const savedPalette = normalizeThemePaletteSettings(result[THEME_PALETTE_STORAGE_KEY]);
    activeThemePalette = savedPalette.palette;
    applyThemePalette();
    applyThemeMode(savedTheme === "dark" || savedTheme === "light" || savedTheme === "system" ? savedTheme : DEFAULT_THEME_MODE);
  } catch (error) {
    console.warn("Failed to load theme mode", error);
    applyThemePalette();
    applyThemeMode(DEFAULT_THEME_MODE);
  } finally {
    releaseThemeHydration();
  }
}

async function initQuickSearchEngine() {
  await setQuickSearchEngine(DEFAULT_SEARCH_ENGINE);
}

async function initSearchSettings() {
  const settings = await loadSearchSettings();
  applySearchSettings(settings);
}

async function loadSearchSettings() {
  try {
    const result = await getStoredValues({ [SEARCH_SETTINGS_STORAGE_KEY]: defaultSearchSettings() });
    return normalizeSearchSettings(result[SEARCH_SETTINGS_STORAGE_KEY]);
  } catch (error) {
    console.warn("Failed to load search settings", error);
    return defaultSearchSettings();
  }
}

async function saveSearchSettings(settings) {
  await setStoredValues({ [SEARCH_SETTINGS_STORAGE_KEY]: normalizeSearchSettings(settings) });
}

function defaultSearchSettings() {
  return {
    defaultSearchEngine: DEFAULT_LOCAL_SEARCH_ENGINE,
    aiEngines: Object.fromEntries(defaultAiSearchEngines().map((engine) => [
      engine.id,
      {
        label: "",
        commands: aiEngineCommands(engine),
        searchUrl: engine.searchUrl || engine.directUrl || ""
      }
    ]))
  };
}

function normalizeSearchSettings(value) {
  const fallback = defaultSearchSettings();
  const defaultSearchEngine = editableLocalSearchEngineIds().includes(value?.defaultSearchEngine)
    ? value.defaultSearchEngine
    : fallback.defaultSearchEngine;
  const aiEngines = {};
  defaultAiSearchEngines().forEach((engine) => {
    const saved = value?.aiEngines?.[engine.id] || {};
    const fallbackCommands = fallback.aiEngines[engine.id]?.commands || aiEngineCommands(engine);
    const commands = normalizeAiCommandList(saved.commands, fallbackCommands);
    const label = normalizeSearchEngineCustomLabel(saved.label, engine);
    const searchUrl = normalizeSearchSettingsUrl(saved.searchUrl, engine.searchUrl || engine.directUrl || "");
    aiEngines[engine.id] = { label, commands, searchUrl };
  });
  return { defaultSearchEngine, aiEngines };
}

function applySearchSettings(settings, options = {}) {
  const normalized = normalizeSearchSettings(settings);
  selectedLocalSearchEngine = normalized.defaultSearchEngine;
  if (selectedLocalSearchEngine !== "google") {
    googleAiSearchModeActive = false;
  }
  searchEngines = DEFAULT_SEARCH_ENGINES.map((engine) => {
    const nextEngine = cloneSearchEngine(engine);
    const aiSettings = normalized.aiEngines[nextEngine.id];
    if (!aiSettings || !nextEngine.aiDirect) {
      return nextEngine;
    }
    nextEngine.customLabel = aiSettings.label;
    nextEngine.commands = aiSettings.commands;
    nextEngine.command = aiSettings.commands[0] || nextEngine.command;
    nextEngine.searchUrl = aiSettings.searchUrl;
    nextEngine.directUrl = aiSettings.searchUrl;
    return nextEngine;
  });
  if (!searchEngineById(activeSearchEngine, { strict: true })) {
    activeSearchEngine = DEFAULT_SEARCH_ENGINE;
  }
  if (options.render !== false) {
    updateQuickSearchModeUi();
    renderSearchSettingsForm();
    if (searchEngineById(activeSearchEngine).local && !searchSuggestions.hidden) {
      renderLocalSearchSuggestions(normalizeText(quickSearchInput.value));
    }
  }
  return normalized;
}

function cloneSearchEngine(engine) {
  return {
    ...engine,
    commands: Array.isArray(engine.commands) ? [...engine.commands] : undefined
  };
}

function clonePlatformSearchTarget(target) {
  return {
    ...target,
    prefixes: Array.isArray(target.prefixes) ? [...target.prefixes] : [],
    searchParams: target.searchParams ? { ...target.searchParams } : undefined
  };
}

function defaultAiSearchEngines() {
  return DEFAULT_SEARCH_ENGINES.filter((engine) => EDITABLE_AI_ENGINE_IDS.includes(engine.id));
}

function editableAiSearchEngines() {
  return searchEngines.filter((engine) => EDITABLE_AI_ENGINE_IDS.includes(engine.id));
}

function editableLocalSearchEngines() {
  return editableLocalSearchEngineIds()
    .map((engineId) => searchEngineById(engineId, { strict: true }))
    .filter(Boolean);
}

function editableLocalSearchEngineIds() {
  return EDITABLE_LOCAL_SEARCH_ENGINE_IDS.filter((engineId) => (
    Boolean(searchEngineById(engineId, { strict: true }))
  ));
}

function platformSearchTargets() {
  return PLATFORM_SEARCH_TARGETS.map(clonePlatformSearchTarget);
}

function normalizeSettingText(value, fallback, maxLength) {
  const normalized = normalizeText(value).slice(0, maxLength);
  return normalized || fallback;
}

function normalizeSearchEngineCustomLabel(value, engine) {
  const label = normalizeSettingText(value, "", 32);
  const builtInLabels = new Set([
    engine.label,
    ...SUPPORTED_LOCALES.map((locale) => MESSAGES[locale]?.[engine.labelKey])
  ].filter(Boolean));
  return builtInLabels.has(label) ? "" : label;
}

function normalizeAiCommandList(value, fallbackCommands) {
  const source = Array.isArray(value) ? value : String(value || "").split(/[\s,，]+/);
  const commands = source
    .map(normalizeAiCommandToken)
    .filter(Boolean);
  const uniqueCommands = [...new Set(commands)];
  return uniqueCommands.length ? uniqueCommands : [...fallbackCommands];
}

function normalizeAiCommandToken(value) {
  const token = String(value || "").trim().toLowerCase().replace(/^\/?/, "/");
  return /^\/[a-z][a-z0-9-]*$/.test(token) ? token : "";
}

function normalizeSearchSettingsUrl(value, fallback) {
  try {
    const url = new URL(normalizePortalUrl(value || fallback));
    return /^https?:$/.test(url.protocol) ? url.href : fallback;
  } catch {
    return fallback;
  }
}

function renderSearchSettingsForm() {
  if (!basicSearchEngineList || !aiEngineSettingsList) {
    return;
  }
  basicSearchEngineList.replaceChildren(...editableLocalSearchEngines().map(createBasicSearchEngineCard));
  aiEngineSettingsList.replaceChildren(...editableAiSearchEngines().map(createAiEngineSettingsCard));
  platformSearchSettingsList?.replaceChildren(...platformSearchTargets().map(createPlatformSearchSettingsCard));
  window.requestAnimationFrame(updateSettingsTabsStickyVisualState);
}

function createBasicSearchEngineCard(engine) {
  const card = createEngineSettingsCard({
    engine,
    meta: engineSearchConfigLabel(engine),
    actionLabel: engine.id === selectedLocalSearchEngine
      ? t("searchSettingsDefaultBadge")
      : t("searchSettingsSetDefault"),
    current: engine.id === selectedLocalSearchEngine
  });
  const action = card.querySelector(".engine-settings-card-action");
  action.addEventListener("click", () => {
    if (engine.id !== selectedLocalSearchEngine) {
      handleBasicSearchEngineSelect(engine.id);
    }
  });
  return card;
}

function createAiEngineSettingsCard(engine) {
  const commands = aiEngineCommands(engine).join(", ");
  const card = createEngineSettingsCard({
    engine,
    meta: `${commands} · ${engineDirectConfigLabel(engine)}`,
    actionLabel: t("searchSettingsEdit")
  });
  const panel = document.createElement("div");
  const panelId = `search-settings-${engine.id}-editor`;
  panel.className = "engine-settings-card-edit-panel";
  panel.id = panelId;
  panel.hidden = true;
  panel.append(
    createSearchSettingsInput({
      label: t("searchSettingsEngineName"),
      field: "label",
      name: `${engine.id}-label`,
      value: searchEngineLabel(engine)
    }),
    createSearchSettingsInput({
      label: t("searchSettingsEngineCommands"),
      field: "commands",
      name: `${engine.id}-commands`,
      value: commands,
      attributes: {
        spellcheck: "false"
      }
    }),
    createSearchSettingsInput({
      label: t("searchSettingsEngineUrl"),
      field: "searchUrl",
      name: `${engine.id}-searchUrl`,
      value: engine.searchUrl || engine.directUrl || "",
      wide: true,
      attributes: {
        inputmode: "url"
      }
    })
  );
  const editButton = card.querySelector(".engine-settings-card-action");
  editButton.setAttribute("aria-controls", panelId);
  editButton.setAttribute("aria-expanded", "false");
  editButton.addEventListener("click", () => {
    const expanded = !card.classList.contains("editing");
    card.classList.toggle("editing", expanded);
    panel.hidden = !expanded;
    editButton.textContent = expanded ? t("searchSettingsDoneEdit") : t("searchSettingsEdit");
    editButton.setAttribute("aria-expanded", String(expanded));
    updateSettingsTabsStickyVisualState();
    window.requestAnimationFrame(updateSettingsTabsStickyVisualState);
    if (expanded) {
      panel.querySelector("input")?.focus();
    }
  });
  card.append(panel);
  return card;
}

function createPlatformSearchSettingsCard(platform) {
  const prefixes = platform.prefixes.join(", ");
  const card = createEngineSettingsCard({
    engine: {
      id: platform.id,
      label: platform.label,
      labelKey: platform.labelKey,
      searchUrl: platform.iconUrl || platform.searchUrl
    },
    meta: `${t("searchSettingsPlatformPrefix")}: ${prefixes} · ${platformSearchBehaviorLabel(platform)}`,
    actionLabel: t("searchSettingsBuiltInBadge"),
    current: true
  });
  const action = card.querySelector(".engine-settings-card-action");
  action.disabled = true;
  action.setAttribute("aria-disabled", "true");
  return card;
}

function createEngineSettingsCard({ engine, meta, actionLabel, current = false }) {
  const card = document.createElement("article");
  card.className = "engine-settings-card";
  card.dataset.engineId = engine.id;
  const label = searchEngineLabel(engine);

  const summary = document.createElement("div");
  summary.className = "engine-settings-card-summary";

  const kind = document.createElement("span");
  kind.className = "engine-settings-card-kind";
  kind.append(createSettingsEngineIcon(engine));

  const main = document.createElement("span");
  main.className = "engine-settings-card-main";
  const title = document.createElement("strong");
  title.className = "engine-settings-card-title";
  title.textContent = label;
  const description = document.createElement("span");
  description.className = "engine-settings-card-meta";
  description.textContent = meta;
  main.append(title, description);

  const actions = document.createElement("span");
  actions.className = "engine-settings-card-actions";
  const action = document.createElement("button");
  action.className = "text-button engine-settings-card-action";
  action.type = "button";
  action.textContent = actionLabel;
  action.setAttribute("aria-pressed", String(current));
  action.classList.toggle("is-current", current);
  actions.append(action);

  summary.append(kind, main, actions);
  card.append(summary);
  return card;
}

function createSettingsEngineIcon(engine) {
  const engineUrl = engine.searchUrl || engine.directUrl || "";
  const explicitIcon = (engine.id === "kimi" || engine.id === "zhihu")
    ? `${WayleafIcon.siteIconDirectory}/${engine.id}.svg`
    : explicitAiIconUrl(engine);
  const iconSource = explicitIcon || WayleafIcon.localIconForUrl(engineUrl);
  const style = SETTINGS_ENGINE_ICON_STYLES[engine.id] || {};
  const label = searchEngineLabel(engine);
  const shell = document.createElement("span");
  shell.className = "settings-engine-icon";
  shell.dataset.engineIcon = engine.id;
  shell.dataset.siteUrl = engineUrl;
  shell.dataset.siteTitle = label;
  shell.dataset.iconSource = iconSource;
  shell.dataset.iconCandidate = iconSource;
  shell.style.setProperty("--settings-engine-icon-tile", style.tile || "#ffffff");
  shell.style.setProperty("--settings-engine-icon-glyph", style.glyph || "#1f2924");

  if (!iconSource) {
    return shell;
  }

  if (style.mode === "mask") {
    const glyph = document.createElement("span");
    glyph.className = "settings-engine-icon-mask";
    glyph.style.webkitMaskImage = `url("${iconSource}")`;
    glyph.style.maskImage = `url("${iconSource}")`;
    shell.append(glyph);
    return shell;
  }

  const icon = document.createElement("img");
  icon.className = "settings-engine-icon-image";
  icon.alt = "";
  icon.decoding = "async";
  icon.dataset.engineIcon = engine.id;
  icon.dataset.iconSource = iconSource;
  icon.dataset.iconCandidate = iconSource;
  if (explicitIcon) {
    icon.dataset.explicitAiIcon = "true";
  }
  icon.src = iconSource;
  icon.removeAttribute("srcset");
  shell.append(icon);
  return shell;
}

function createSearchSettingsInput({ label, field, name, value, wide = false, attributes = {} }) {
  const wrapper = document.createElement("label");
  wrapper.className = `settings-form-field${wide ? " wide" : ""}`;
  const labelNode = document.createElement("span");
  labelNode.textContent = label;
  const input = document.createElement("input");
  input.dataset.searchSettingField = field;
  input.name = name;
  input.autocomplete = "off";
  input.value = value;
  Object.entries(attributes).forEach(([key, attributeValue]) => {
    input.setAttribute(key, attributeValue);
  });
  wrapper.append(labelNode, input);
  return wrapper;
}

function engineSearchConfigLabel(engine) {
  const url = engine?.searchUrl || engine?.directUrl || "";
  if (!url) {
    return "";
  }
  return engine.queryParam ? `${url} · ${engine.queryParam}` : url;
}

function engineDirectConfigLabel(engine) {
  return engine?.searchUrl || engine?.directUrl || "";
}

function platformSearchBehaviorLabel(platform) {
  return t(platform?.behaviorKey || "platformSearchDirectBehavior");
}

async function handleBasicSearchEngineSelect(engineId) {
  selectedLocalSearchEngine = engineId;
  const settings = collectSearchSettingsFromForm();
  try {
    applySearchSettings(settings);
    await saveSearchSettings(settings);
    setSearchSettingsStatus(t("searchSettingsSaved"));
  } catch (error) {
    console.warn("Failed to save default search engine", error);
    setSearchSettingsStatus("");
  }
}

async function handleSearchSettingsSubmit(event) {
  event.preventDefault();
  const settings = collectSearchSettingsFromForm();
  try {
    applySearchSettings(settings);
    await saveSearchSettings(settings);
    setSearchSettingsStatus(t("searchSettingsSaved"));
  } catch (error) {
    console.warn("Failed to save search settings", error);
    setSearchSettingsStatus("");
  }
}

async function handleSearchSettingsReset() {
  const settings = defaultSearchSettings();
  try {
    applySearchSettings(settings);
    await saveSearchSettings(settings);
    setSearchSettingsStatus(t("searchSettingsResetDone"));
  } catch (error) {
    console.warn("Failed to reset search settings", error);
    setSearchSettingsStatus("");
  }
}

function collectSearchSettingsFromForm() {
  const aiEngines = {};
  aiEngineSettingsList?.querySelectorAll("[data-engine-id]").forEach((card) => {
    const engineId = card.dataset.engineId;
    aiEngines[engineId] = {
      label: card.querySelector('[data-search-setting-field="label"]')?.value,
      commands: card.querySelector('[data-search-setting-field="commands"]')?.value,
      searchUrl: card.querySelector('[data-search-setting-field="searchUrl"]')?.value
    };
  });
  return normalizeSearchSettings({
    defaultSearchEngine: selectedLocalSearchEngine,
    aiEngines
  });
}

function setSearchSettingsStatus(message) {
  if (!searchSettingsStatus) {
    return;
  }
  searchSettingsStatus.textContent = message;
  window.clearTimeout(setSearchSettingsStatus.timer);
  if (message) {
    setSearchSettingsStatus.timer = window.setTimeout(() => {
      searchSettingsStatus.textContent = "";
    }, 2400);
  }
}

function handleGlobalEscape(event) {
  if (event.key !== "Escape") {
    return;
  }
  if (googleAiSearchModeActive && document.activeElement === quickSearchInput) {
    event.preventDefault();
    event.stopPropagation();
    exitGoogleAiSearchMode();
    return;
  }
  if (portalCategoryPicker?.classList.contains("open")) {
    event.preventDefault();
    closePortalCategoryPicker({ restoreFocus: true });
    return;
  }
  if (onboardingGuide && !onboardingGuide.hidden) {
    event.preventDefault();
    dismissOnboardingGuide();
    return;
  }
  exitDirectQuickSearchMode();
  hideSearchSuggestions();
  clearFavoriteDeleteMode();
  hideFavoriteForm();
  setActiveSurfacePanel("");
  closeSettingsPanel();
}

async function setQuickSearchEngine(engineId, options = {}) {
  const nextEngine = searchEngineById(engineId);
  const wasGoogleAiSearchModeActive = googleAiSearchModeActive;
  googleAiSearchModeActive = false;
  if (!AI_DIRECT_ATTACHMENT_ENGINE_IDS.has(nextEngine.id)) {
    clearAiDirectAttachments();
  }
  if (wasGoogleAiSearchModeActive) {
    startGoogleAiModeExit();
  }
  if (!nextEngine.local) {
    activePlatformSearchTarget = "";
  }
  activeSearchEngine = nextEngine.id;
  updateQuickSearchModeUi();
  handleQuickSearchInput();
}

function updateQuickSearchModeUi() {
  const engine = searchEngineById(activeSearchEngine);
  const platform = engine.local ? platformSearchTargetById(activePlatformSearchTarget) : null;
  const modeTarget = platform || engine;
  const placeholder = platform
    ? t("quickSearchPlatformPlaceholder", { platform: searchEngineLabel(platform) })
    : googleAiSearchModeActive
      ? t("quickSearchAiPlaceholder", { engine: "Google AI" })
      : engine.local
        ? t("quickSearchPlaceholder")
        : t("quickSearchAiPlaceholder", { engine: searchEngineLabel(engine) });
  const previousThemeColor = quickSearchForm.style.getPropertyValue("--ai-theme-color");
  quickSearchForm.style.setProperty("--ai-theme-color", modeTarget.themeColor || "var(--accent)");
  quickSearchInput.placeholder = placeholder;
  quickSearchInput.setAttribute("aria-label", placeholder);
  updateQuickSearchLeadingIcon();
  updateGoogleImageSearchButton();
  updateAiAttachmentUi();
  renderAiEnginePill(engine, { previousThemeColor });
  renderPlatformActivationHint(quickSearchInput.value);
}

function updateQuickSearchLeadingIcon() {
  if (!quickSearchLeadingIcon) {
    return;
  }
  if (!quickSearchLeadingIcon.querySelector(".search-icon-layer")) {
    quickSearchLeadingIcon.innerHTML = `
      <span class="search-icon-layer search-icon-regular">${tdesignIcon("search")}</span>
      <span class="search-icon-layer search-icon-ai">${tdesignIcon("ai-search")}</span>
    `;
  }
  const available = canActivateGoogleAiSearchMode();
  const active = available && isQuickSearchActive();
  quickSearchLeadingIcon.disabled = !available;
  quickSearchLeadingIcon.tabIndex = active ? 0 : -1;
  quickSearchLeadingIcon.setAttribute("aria-disabled", String(!available));
  quickSearchLeadingIcon.setAttribute("aria-label", available && !googleAiSearchModeActive ? t("quickSearchWithGoogleAi") : t("quickSearch"));
  quickSearchLeadingIcon.title = available ? quickSearchLeadingIcon.getAttribute("aria-label") : "";
  searchWorkbench?.toggleAttribute("data-google-ai-active", googleAiSearchModeActive);
  if (googleAiSearchModeActive) {
    window.clearTimeout(googleAiModeExitTimer);
    searchWorkbench?.removeAttribute("data-google-ai-exiting");
    searchWorkbench?.style.removeProperty("--google-ai-exit-border-angle");
  }
}

function renderAiEnginePill(engine, options = {}) {
  if (!aiEnginePill) {
    return;
  }
  const platform = engine.local ? platformSearchTargetById(activePlatformSearchTarget) : null;
  if (engine.local && !platform) {
    if (!aiEnginePill.hidden) {
      const previousMode = searchWorkbench?.getAttribute("data-platform-active") ? "platform" : "ai";
      const previousThemeColor = options.previousThemeColor || quickSearchForm.style.getPropertyValue("--ai-theme-color");
      searchWorkbench?.setAttribute("data-ai-exiting", "");
      searchWorkbench?.removeAttribute("data-ai-active");
      searchWorkbench?.removeAttribute("data-platform-active");
      aiEnginePill.dataset.exiting = "true";
      aiEnginePill.dataset.exitMode = previousMode;
      if (previousThemeColor) {
        aiEnginePill.style.setProperty("--ai-exit-theme-color", previousThemeColor);
      }
      window.clearTimeout(aiModeExitTimer);
      aiModeExitTimer = window.setTimeout(() => {
        if (searchEngineById(activeSearchEngine).local && !activePlatformSearchTarget) {
          searchWorkbench?.removeAttribute("data-ai-exiting");
          aiEnginePill.hidden = true;
          aiEnginePill.replaceChildren();
          delete aiEnginePill.dataset.exiting;
          delete aiEnginePill.dataset.exitMode;
          aiEnginePill.style.removeProperty("--ai-exit-theme-color");
        }
      }, prefersReducedMotion() ? 0 : AI_MODE_EXIT_MS);
    } else {
      searchWorkbench?.removeAttribute("data-ai-active");
      searchWorkbench?.removeAttribute("data-platform-active");
      searchWorkbench?.removeAttribute("data-ai-exiting");
    }
    return;
  }
  window.clearTimeout(aiModeExitTimer);
  searchWorkbench?.removeAttribute("data-ai-exiting");
  delete aiEnginePill.dataset.exiting;
  delete aiEnginePill.dataset.exitMode;
  aiEnginePill.style.removeProperty("--ai-exit-theme-color");
  const target = platform || engine;
  const icon = document.createElement("img");
  icon.alt = "";
  icon.decoding = "async";
  icon.dataset.engineIcon = target.id;
  const explicitIcon = explicitAiIconUrl(target);
  const iconSite = {
    url: target.searchUrl || target.directUrl || "",
    title: searchEngineLabel(target)
  };
  if (explicitIcon) {
    WayleafIcon.applyExplicitSiteIcon(icon, iconSite, explicitIcon);
  } else {
    WayleafIcon.applySiteIcon(icon, iconSite);
  }
  aiEnginePill.replaceChildren(icon);
  aiEnginePill.hidden = false;
  if (platform) {
    searchWorkbench?.removeAttribute("data-ai-active");
    searchWorkbench?.setAttribute("data-platform-active", platform.id);
  } else {
    searchWorkbench?.removeAttribute("data-platform-active");
    searchWorkbench?.setAttribute("data-ai-active", engine.id);
  }
}

function searchEngineById(engineId, options = {}) {
  const engine = searchEngines.find((item) => item.id === engineId);
  if (options.strict) {
    return engine || null;
  }
  return engine || searchEngines[0];
}

function applyThemeMode(theme, options = {}) {
  const previousResolvedTheme = activeResolvedTheme;
  const previousThemeSnapshot = readThemeTransitionSnapshot();
  activeThemeMode = theme === "dark" || theme === "light" || theme === "system" ? theme : DEFAULT_THEME_MODE;
  const resolvedTheme = resolvedThemeMode();
  const shouldAnimateTheme = previousResolvedTheme && previousResolvedTheme !== resolvedTheme && !prefersReducedMotion();
  const commitThemeChange = () => {
    document.documentElement.dataset.theme = resolvedTheme;
    activeResolvedTheme = resolvedTheme;
    writeThemeBootCache(activeThemeMode, resolvedTheme);
    if (previousResolvedTheme && previousResolvedTheme !== resolvedTheme) {
      WayleafIcon.refreshAdaptiveSiteIcons();
    }
    updateThemeSettingsUi();
  };

  commitThemeChange();
  const nextThemeSnapshot = readThemeTransitionSnapshot();
  if (shouldAnimateTheme) {
    startThemeBackgroundTransition({
      toTheme: resolvedTheme,
      fromTheme: previousThemeSnapshot,
      sourceEvent: options.sourceEvent,
      toThemeSnapshot: nextThemeSnapshot
    });
  }
}

function readThemeBootCache() {
  try {
    return JSON.parse(localStorage.getItem(THEME_BOOT_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function hydrateThemeFromBootCache() {
  const cached = readThemeBootCache();
  const savedPalette = normalizeThemePaletteSettings({
    palette: cached.palette
  });
  activeThemeMode = cached.mode === "dark" || cached.mode === "light" || cached.mode === "system"
    ? cached.mode
    : DEFAULT_THEME_MODE;
  activeResolvedTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  activeThemePalette = savedPalette.palette;
}

function writeThemeBootCache(mode, resolvedTheme) {
  try {
    const variables = {};
    const rootStyle = document.documentElement.style;
    for (let index = 0; index < rootStyle.length; index += 1) {
      const name = rootStyle[index];
      if (/^--(?:light|dark)-/.test(name)) {
        variables[name] = rootStyle.getPropertyValue(name).trim();
      }
    }
    localStorage.setItem(THEME_BOOT_STORAGE_KEY, JSON.stringify({
      mode,
      resolved: resolvedTheme === "dark" ? "dark" : "light",
      palette: activeThemePalette,
      variables,
      updatedAt: Date.now()
    }));
  } catch (error) {
    console.warn("Failed to cache theme boot state", error);
  }
}

function releaseThemeHydration() {
  const root = document.documentElement;
  if (!root.classList.contains("theme-hydrating")) {
    return;
  }
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      root.classList.remove("theme-hydrating");
    });
  });
}

function readThemeTransitionSnapshot() {
  const rootStyle = getComputedStyle(document.documentElement);
  const read = (name, fallback) => resolveThemeColor(rootStyle.getPropertyValue(name).trim() || fallback, fallback);
  return {
    paper: read("--paper", "#f8f8f3"),
    inputBg: read("--input-bg", "#fffefa"),
    panel: read("--panel", "#fffefa"),
    panelSoft: read("--panel-soft", "#f1f4ef"),
    line: read("--line", "rgba(19, 25, 21, 0.12)"),
    lineStrong: read("--line-strong", "rgba(19, 25, 21, 0.23)"),
    accentWashSoft: read("--accent-wash-soft", "rgb(63 127 104 / 0.055)"),
    accentBorder: read("--accent-border", "rgb(63 127 104 / 0.34)")
  };
}

function resolveThemeColor(value, fallback) {
  if (!document.body) {
    return value || fallback;
  }
  const probe = document.createElement("span");
  probe.style.position = "fixed";
  probe.style.inset = "0 auto auto 0";
  probe.style.width = "0";
  probe.style.height = "0";
  probe.style.overflow = "hidden";
  probe.style.pointerEvents = "none";
  probe.style.backgroundColor = value;
  document.body.appendChild(probe);
  const resolved = getComputedStyle(probe).backgroundColor;
  probe.remove();
  return resolved && resolved !== "rgba(0, 0, 0, 0)" ? resolved : value || fallback;
}

function themeTransitionPoint(sourceEvent) {
  const width = Math.max(1, window.innerWidth || document.documentElement.clientWidth || 1);
  const height = Math.max(1, window.innerHeight || document.documentElement.clientHeight || 1);
  const hasPointerPoint = Number.isFinite(sourceEvent?.clientX) && Number.isFinite(sourceEvent?.clientY);
  return {
    x: hasPointerPoint ? Math.max(0, Math.min(width, sourceEvent.clientX)) : width,
    y: hasPointerPoint ? Math.max(0, Math.min(height, sourceEvent.clientY)) : 0
  };
}

function themeTransitionMaxRadius(point) {
  const width = Math.max(1, window.innerWidth || document.documentElement.clientWidth || 1);
  const height = Math.max(1, window.innerHeight || document.documentElement.clientHeight || 1);
  return Math.ceil(Math.hypot(
    Math.max(point.x, width - point.x),
    Math.max(point.y, height - point.y)
  )) + 2;
}

function startThemeBackgroundTransition({ toTheme, fromTheme, sourceEvent, toThemeSnapshot }) {
  if (!document.body) {
    return;
  }
  const root = document.documentElement;
  const direction = toTheme === "dark" ? "to-dark" : "to-light";
  const point = themeTransitionPoint(sourceEvent);
  themeBackgroundTransitionSequence += 1;
  const sequence = themeBackgroundTransitionSequence;
  window.clearTimeout(themeBackgroundTransitionTimer);
  document.querySelector(".theme-transition-backdrop")?.remove();
  root.classList.remove("theme-transitioning");
  root.classList.remove("theme-transition-committing");
  clearThemeTransitionVariables();
  setThemeTransitionVariables(fromTheme, toThemeSnapshot);
  root.classList.add("theme-transitioning");
  root.dataset.themeTransition = direction;

  const backdrop = document.createElement("div");
  backdrop.className = "theme-transition-backdrop";
  backdrop.dataset.direction = direction;
  backdrop.setAttribute("aria-hidden", "true");

  const overlay = createThemeTransitionLayer({
    direction,
    fromColor: fromTheme.paper,
    point,
    toColor: toThemeSnapshot.paper
  });
  backdrop.style.backgroundColor = overlay.baseColor;
  backdrop.appendChild(overlay.circle);
  document.body.prepend(backdrop);

  let cleanupQueued = false;
  const cleanup = () => {
    if (sequence !== themeBackgroundTransitionSequence || cleanupQueued) {
      return;
    }
    cleanupQueued = true;
    backdrop.classList.add("is-complete");
    root.classList.add("theme-transition-committing");
    overlay.circle.style.transform = overlay.endTransform;
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (sequence !== themeBackgroundTransitionSequence) {
          return;
        }
        backdrop.remove();
        root.classList.remove("theme-transitioning");
        root.classList.remove("theme-transition-committing");
        delete root.dataset.themeTransition;
        clearThemeTransitionVariables();
      });
    });
  };
  window.requestAnimationFrame(() => {
    if (sequence === themeBackgroundTransitionSequence) {
      backdrop.classList.add("is-animating");
    }
  });
  themeBackgroundTransitionTimer = window.setTimeout(cleanup, THEME_BACKGROUND_TRANSITION_MS + 80);
}

function createThemeTransitionLayer({ direction, fromColor, point, toColor }) {
  const maxRadius = themeTransitionMaxRadius(point);
  const diameter = Math.max(1, maxRadius * 2);
  const circle = document.createElement("div");
  circle.className = "theme-transition-circle";
  circle.style.width = `${diameter}px`;
  circle.style.height = `${diameter}px`;
  circle.style.left = `${point.x - maxRadius}px`;
  circle.style.top = `${point.y - maxRadius}px`;
  circle.style.backgroundColor = direction === "to-dark" ? toColor : fromColor;
  const startScale = direction === "to-dark" ? 0 : 1;
  const endScale = direction === "to-dark" ? 1 : 0;
  const startTransform = `translate3d(0, 0, 0) scale(${startScale})`;
  const endTransform = `translate3d(0, 0, 0) scale(${endScale})`;
  circle.style.setProperty("--theme-circle-start-scale", String(startScale));
  circle.style.setProperty("--theme-circle-end-scale", String(endScale));
  circle.style.transform = startTransform;
  return {
    baseColor: direction === "to-dark" ? fromColor : toColor,
    circle,
    endTransform,
    startTransform
  };
}

function setThemeTransitionVariables(fromTheme, toThemeSnapshot) {
  const rootStyle = document.documentElement.style;
  const pairs = [
    ["paper", fromTheme.paper, toThemeSnapshot.paper],
    ["input-bg", fromTheme.inputBg, toThemeSnapshot.inputBg],
    ["panel", fromTheme.panel, toThemeSnapshot.panel],
    ["panel-soft", fromTheme.panelSoft, toThemeSnapshot.panelSoft],
    ["line", fromTheme.line, toThemeSnapshot.line],
    ["line-strong", fromTheme.lineStrong, toThemeSnapshot.lineStrong],
    ["accent-wash-soft", fromTheme.accentWashSoft, toThemeSnapshot.accentWashSoft],
    ["accent-border", fromTheme.accentBorder, toThemeSnapshot.accentBorder]
  ];
  pairs.forEach(([name, fromValue, toValue]) => {
    rootStyle.setProperty(`--theme-transition-from-${name}`, fromValue);
    rootStyle.setProperty(`--theme-transition-to-${name}`, toValue);
  });
}

function clearThemeTransitionVariables() {
  const rootStyle = document.documentElement.style;
  [
    "paper",
    "input-bg",
    "panel",
    "panel-soft",
    "line",
    "line-strong",
    "accent-wash-soft",
    "accent-border"
  ].forEach((name) => {
    rootStyle.removeProperty(`--theme-transition-from-${name}`);
    rootStyle.removeProperty(`--theme-transition-to-${name}`);
  });
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
  applyThemeMode(mode, options);
  if (!options.persist) {
    return;
  }
  try {
    await setStoredValues({ [THEME_STORAGE_KEY]: activeThemeMode });
  } catch (error) {
    console.warn("Failed to save theme mode", error);
  }
}

function bindSystemThemeListener() {
  if (!window.matchMedia) {
    return;
  }
  systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  if (systemThemeQuery.addEventListener) {
    systemThemeQuery.addEventListener("change", handleSystemThemeChange);
  } else if (systemThemeQuery.addListener) {
    systemThemeQuery.addListener(handleSystemThemeChange);
  }
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
    palette: DEFAULT_THEME_PALETTE
  };
}

function normalizeThemePaletteSettings(value) {
  const fallback = defaultThemePaletteSettings();
  if (!value || typeof value !== "object") {
    return fallback;
  }
  const palette = VISIBLE_THEME_PALETTE_IDS.has(value.palette)
    ? value.palette
    : DEFAULT_THEME_PALETTE;
  return {
    palette
  };
}

function normalizeColor(...values) {
  for (const value of values) {
    if (/^#[\da-f]{6}$/i.test(String(value || ""))) {
      return String(value).toLowerCase();
    }
  }
  return "#000000";
}

function renderThemePalettePresets() {
  const displayPalettes = THEME_PALETTES.filter((palette) => VISIBLE_THEME_PALETTE_IDS.has(palette.id)).sort((first, second) => {
    const firstIndex = THEME_PALETTE_DISPLAY_ORDER.indexOf(first.id);
    const secondIndex = THEME_PALETTE_DISPLAY_ORDER.indexOf(second.id);
    return (firstIndex === -1 ? Number.MAX_SAFE_INTEGER : firstIndex)
      - (secondIndex === -1 ? Number.MAX_SAFE_INTEGER : secondIndex);
  });
  palettePresetGrid.replaceChildren(...displayPalettes.map((palette) => {
    const button = document.createElement("button");
    button.className = "palette-preset-button";
    button.type = "button";
    button.dataset.palette = palette.id;
    button.setAttribute("role", "radio");
    const label = themePaletteLabel(palette);
    button.setAttribute("aria-label", label);
    const lightMode = palette.modes.light;
    const darkMode = palette.modes.dark;
    const swatch = document.createElement("span");
    swatch.className = "palette-swatch-pair";
    swatch.setAttribute("aria-hidden", "true");
    swatch.style.setProperty("--palette-swatch-light", lightMode.accent);
    swatch.style.setProperty("--palette-swatch-dark", darkMode.accent);
    const name = document.createElement("span");
    name.className = "palette-preset-name";
    name.textContent = label;
    button.append(swatch, name);
    button.addEventListener("click", () => setThemePalette(palette.id, { persist: true }));
    return button;
  }));
}

async function setThemePalette(paletteId, options = {}) {
  activeThemePalette = VISIBLE_THEME_PALETTE_IDS.has(paletteId)
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
  document.documentElement.dataset.themePalette = activeThemePalette;
  setThemeVariables(themePaletteById(activeThemePalette));
  writeThemeBootCache(activeThemeMode, activeResolvedTheme || document.documentElement.dataset.theme);
}

function themePaletteById(paletteId) {
  return THEME_PALETTES.find((palette) => palette.id === paletteId) || THEME_PALETTES[0];
}

function setThemeVariables(palette) {
  const rootStyle = document.documentElement.style;
  setModeThemeVariables(rootStyle, "light", palette.modes.light);
  setModeThemeVariables(rootStyle, "dark", palette.modes.dark);
}

function setModeThemeVariables(rootStyle, mode, colors) {
  const prefix = `--${mode}`;
  setColorVariable(rootStyle, `${prefix}-accent`, colors.accent);
  setColorVariable(rootStyle, `${prefix}-focus`, colors.focus);
  rootStyle.setProperty(`${prefix}-accent-strong`, colors.accentStrong);
  rootStyle.setProperty(`${prefix}-on-accent`, colors.onAccent || readableTextColor(colors.accent));
  rootStyle.setProperty(`${prefix}-paper`, colors.paper);
  rootStyle.setProperty(`${prefix}-panel`, colors.panel);
  rootStyle.setProperty(`${prefix}-panel-soft`, colors.panelSoft);
  rootStyle.setProperty(`${prefix}-input-bg`, colors.inputBg);
  rootStyle.setProperty(`${prefix}-hover-bg`, colors.hoverBg);
  rootStyle.setProperty(`${prefix}-ink`, colors.ink);
  rootStyle.setProperty(`${prefix}-muted`, colors.muted);
  rootStyle.setProperty(`${prefix}-faint`, colors.faint);
  rootStyle.setProperty(`${prefix}-glass-panel`, colors.panel);
  rootStyle.setProperty(`${prefix}-glass-panel-soft`, colors.panelSoft);
  rootStyle.setProperty(`${prefix}-icon-tile`, mode === "dark" ? colors.panelSoft : "#ffffff");
  rootStyle.setProperty(`${prefix}-icon-line`, mode === "dark" ? "rgba(244, 250, 247, 0.1)" : "rgba(20, 27, 24, 0.08)");
  rootStyle.setProperty(`${prefix}-line`, mode === "dark" ? "rgba(239, 246, 243, 0.12)" : "rgba(19, 25, 21, 0.12)");
  rootStyle.setProperty(`${prefix}-line-strong`, mode === "dark" ? "rgba(239, 246, 243, 0.24)" : "rgba(19, 25, 21, 0.23)");
}

function setColorVariable(rootStyle, name, color) {
  rootStyle.setProperty(name, color);
  rootStyle.setProperty(`${name}-rgb`, hexToRgb(color).join(" "));
}

function readableTextColor(backgroundColor) {
  const darkText = "#102019";
  const lightText = "#ffffff";
  return contrastRatio(backgroundColor, darkText) >= contrastRatio(backgroundColor, lightText) ? darkText : lightText;
}

function contrastRatio(colorA, colorB) {
  const [lighter, darker] = [relativeLuminance(colorA), relativeLuminance(colorB)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

function relativeLuminance(color) {
  return hexToRgb(color)
    .map((channel) => {
      const normalized = channel / 255;
      return normalized <= 0.03928
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4;
    })
    .reduce((total, channel, index) => total + channel * [0.2126, 0.7152, 0.0722][index], 0);
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

async function saveThemePaletteSettings() {
  try {
    await setStoredValues({
      [THEME_PALETTE_STORAGE_KEY]: {
        palette: activeThemePalette
      }
    });
  } catch (error) {
    console.warn("Failed to save theme palette", error);
  }
}

function updateThemeSettingsUi() {
  const themeModeOptions = [...document.querySelectorAll("[data-theme-mode]")];
  const activeThemeModeIndex = Math.max(0, themeModeOptions.findIndex((button) => button.dataset.themeMode === activeThemeMode));
  document.querySelector("#themeModeControl")?.setAttribute("data-active-index", String(activeThemeModeIndex));
  themeModeOptions.forEach((button) => {
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

function updateSyncSettingsUi(status = storageSyncAvailable() ? "ready" : "unavailable") {
  if (!syncSettingsRow || !syncSettingsStatus || !syncSettingsDetail || !syncSettingsNowButton || !syncSettingsAutoButton) {
    return;
  }
  const localStatus = ["done", "exported", "imported", "importFailed"].includes(status) ? status : "";
  const syncUnavailable = !storageSyncAvailable();
  const normalizedStatus = localStatus || (syncUnavailable ? "unavailable" : "ready");
  syncSettingsRow.dataset.status = normalizedStatus;
  syncSettingsNowButton.disabled = syncUnavailable;
  syncSettingsNowButton.setAttribute("aria-disabled", String(syncSettingsNowButton.disabled));
  syncSettingsAutoButton.setAttribute("aria-disabled", "true");
  setButtonLabel(syncSettingsNowButton, t("syncSettingsNow"));
  setButtonLabel(syncSettingsAutoButton, t("syncSettingsAuto"));
  syncSettingsAutoButton.title = t("syncSettingsAutoHint");
  syncSettingsNowButton.querySelector(".button-icon").innerHTML = refreshIcon();
  syncSettingsNowButton.querySelector(".sync-settings-action-label").textContent = t("syncSettingsNow");
  syncSettingsAutoButton.querySelector(".sync-settings-auto-label").textContent = t("syncSettingsAuto");
  syncSettingsAutoButton.querySelector(".sync-settings-auto-hint").textContent = t("syncSettingsAutoHint");
  if (exportSettingsButton) {
    exportSettingsButton.disabled = false;
    exportSettingsButton.setAttribute("aria-disabled", "false");
    setButtonLabel(exportSettingsButton, t("syncSettingsExport"));
    exportSettingsButton.querySelector(".button-icon").innerHTML = fileExportIcon();
    exportSettingsButton.querySelector(".sync-settings-action-label").textContent = t("syncSettingsExport");
  }
  if (importSettingsButton) {
    importSettingsButton.disabled = false;
    importSettingsButton.setAttribute("aria-disabled", "false");
    setButtonLabel(importSettingsButton, t("syncSettingsImport"));
    importSettingsButton.querySelector(".button-icon").innerHTML = fileImportIcon();
    importSettingsButton.querySelector(".sync-settings-action-label").textContent = t("syncSettingsImport");
  }
  if (normalizedStatus === "done") {
    syncSettingsStatus.textContent = t("syncSettingsDone");
    setSyncSettingsDetail(t("syncSettingsDoneDetail"));
    return;
  }
  if (normalizedStatus === "exported") {
    syncSettingsStatus.textContent = t("syncSettingsExported");
    setSyncSettingsDetail(t("syncSettingsExportedDetail"));
    return;
  }
  if (normalizedStatus === "imported") {
    syncSettingsStatus.textContent = t("syncSettingsImported");
    setSyncSettingsDetail(t("syncSettingsImportedDetail"));
    return;
  }
  if (normalizedStatus === "importFailed") {
    syncSettingsStatus.textContent = t("syncSettingsImportFailed");
    setSyncSettingsDetail(t("syncSettingsImportFailedDetail"));
    return;
  }
  if (normalizedStatus === "unavailable") {
    syncSettingsStatus.textContent = t("syncSettingsUnavailable");
    setSyncSettingsDetail(t("syncSettingsUnavailableDetail"));
    return;
  }
  syncSettingsStatus.textContent = t("syncSettingsReady");
  setSyncSettingsDetail("");
}

function setSyncSettingsDetail(message) {
  syncSettingsDetail.textContent = message;
  syncSettingsDetail.hidden = !message;
}

function storageSyncAvailable() {
  return Boolean(chrome.storage?.sync);
}

function wayleafConfigKeys() {
  return [...SYNC_STORAGE_KEYS].filter((key) => key !== SYNC_META_STORAGE_KEY);
}

async function readWayleafConfigSettings() {
  const keys = wayleafConfigKeys();
  const defaults = Object.fromEntries(keys.map((key) => [key, undefined]));
  const values = await getStoredValues(defaults);
  return Object.fromEntries(keys
    .filter((key) => typeof values[key] !== "undefined")
    .map((key) => [key, values[key]]));
}

function parseWayleafConfigPackage(text) {
  const parsed = JSON.parse(text);
  const settings = parsed?.settings;
  if (!settings || typeof settings !== "object" || Array.isArray(settings)) {
    throw new Error("Invalid Wayleaf config package.");
  }
  return Object.fromEntries(wayleafConfigKeys()
    .filter((key) => Object.prototype.hasOwnProperty.call(settings, key) && typeof settings[key] !== "undefined")
    .map((key) => [key, settings[key]]));
}

function wayleafConfigFileName(now = new Date(), random = Math.random()) {
  const pad = (value, length = 2) => String(value).padStart(length, "0");
  const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  return `wayleaf-settings-${date}-${time}-${pad(Math.floor(random * 1000), 3)}.wy`;
}

function downloadWayleafConfig(settings) {
  const blob = new Blob([JSON.stringify({
    app: "Wayleaf",
    version: WAYLEAF_CONFIG_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    settings
  }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = wayleafConfigFileName();
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

async function handleExportSettings() {
  try {
    downloadWayleafConfig(await readWayleafConfigSettings());
    updateSyncSettingsUi("exported");
  } catch (error) {
    console.warn("Failed to export Wayleaf config", error);
    updateSyncSettingsUi("importFailed");
  }
}

async function handleImportSettingsFile(file) {
  if (!file || !String(file.name || "").toLowerCase().endsWith(".wy")) {
    throw new Error("Invalid Wayleaf config file.");
  }
  const settings = parseWayleafConfigPackage(await file.text());
  if (!Object.keys(settings).length) {
    throw new Error("Wayleaf config package has no settings.");
  }
  await setStoredValues(settings);
  if (storageSyncAvailable() && chrome.storage?.sync !== chrome.storage?.local) {
    await chrome.storage.sync.set(cloudSyncPayload(settings));
  }
}

async function handleImportSettingsChange(event) {
  const file = event.currentTarget?.files?.[0];
  if (event.currentTarget) {
    event.currentTarget.value = "";
  }
  try {
    await handleImportSettingsFile(file);
    updateSyncSettingsUi("imported");
    window.setTimeout(() => window.location.reload(), 450);
  } catch (error) {
    console.warn("Failed to import Wayleaf config", error);
    updateSyncSettingsUi("importFailed");
  }
}

async function handleManualSyncSettings() {
  if (!storageSyncAvailable()) {
    updateSyncSettingsUi("unavailable");
    return;
  }
  try {
    const keys = wayleafConfigKeys();
    const defaults = Object.fromEntries(keys.map((key) => [key, undefined]));
    const values = chrome.storage?.local
      ? await chrome.storage.local.get(defaults)
      : await getStoredValues(defaults);
    const payload = {};
    keys.forEach((key) => {
      if (typeof values[key] !== "undefined") {
        payload[key] = values[key];
      }
    });
    payload[SYNC_META_STORAGE_KEY] = {
      syncedAt: Date.now(),
      source: "manual"
    };
    await Promise.all([
      chrome.storage.sync.set(cloudSyncPayload(payload)),
      chrome.storage?.local ? chrome.storage.local.set({ [SYNC_META_STORAGE_KEY]: payload[SYNC_META_STORAGE_KEY] }) : Promise.resolve()
    ]);
    updateSyncSettingsUi("done");
  } catch (error) {
    console.warn("Failed to manually sync settings", error);
    updateSyncSettingsUi();
  }
}

function toggleSettingsPanel() {
  if (!isSettingsPanelVisible()) {
    openSettingsPanel();
    return;
  }
  closeSettingsPanel();
}

function isSettingsPanelVisible() {
  return Boolean(settingsShell && !settingsShell.hidden && settingsPanel.dataset.open === "true");
}

function updateSettingsActiveSummary(tabName = "basic") {
  const tab = settingsTabButtons.find((button) => button.dataset.settingsTab === tabName);
  const panel = settingsTabPanels.find((item) => item.dataset.settingsPanel === tabName);
  const title = normalizeText(tab?.textContent) || t("settingsTitle");
  const details = [...(panel?.querySelectorAll(".settings-group h3") || [])]
    .map((heading) => normalizeText(heading.textContent))
    .filter(Boolean)
    .join(" / ");
  document.querySelector("#settingsTitle").textContent = title;
  document.querySelector("#settingsSubtitle").textContent = details || t("settingsSubtitle");
}

function activateSettingsTab(tabName = "basic") {
  const targetTab = settingsTabButtons.some((button) => button.dataset.settingsTab === tabName)
    ? tabName
    : "basic";
  settingsTabButtons.forEach((button) => {
    const isActive = button.dataset.settingsTab === targetTab;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });
  updateSettingsTabIcons(targetTab);
  settingsTabPanels.forEach((panel) => {
    const isActive = panel.dataset.settingsPanel === targetTab;
    panel.classList.toggle("active", isActive);
    panel.hidden = !isActive;
  });
  updateSettingsActiveSummary(targetTab);
  updateSettingsTabsStickyVisualState();
  window.requestAnimationFrame(updateSettingsTabsStickyVisualState);
}

function updateSettingsTabIcons(activeTab = settingsTabButtons.find((button) => button.classList.contains("active"))?.dataset.settingsTab || "basic") {
  settingsTabButtons.forEach((button) => {
    const icon = SETTINGS_TAB_ICONS[button.dataset.settingsTab] || SETTINGS_TAB_ICONS.basic;
    button.querySelector(".settings-tab-icon").innerHTML = tdesignIcon(button.dataset.settingsTab === activeTab ? icon.active : icon.inactive);
  });
}

function focusSettingsPanel() {
  window.requestAnimationFrame(() => {
    if (!isSettingsPanelVisible()) {
      return;
    }
    settingsPanel.focus({ preventScroll: true });
  });
}

function updateSettingsTabsStickyVisualState() {
  if (!settingsTabsShell || !settingsShell) {
    return;
  }
  const activePanel = settingsTabPanels.find((panel) => panel.classList.contains("active"));
  const activeBody = activePanel?.querySelector(".settings-body") || activePanel;
  const lastContent = activeBody?.lastElementChild || activeBody;
  const contentBottom = lastContent
    ? Math.ceil(lastContent.getBoundingClientRect().bottom - settingsShell.getBoundingClientRect().top + settingsShell.scrollTop)
    : 0;
  const isScrollable = contentBottom > settingsShell.clientHeight + 2;
  if (!isScrollable && settingsShell.scrollTop) {
    settingsShell.scrollTop = 0;
  }
  const isStuck = Boolean(isScrollable && settingsShell.scrollTop > 0);
  settingsShell.setAttribute("data-scrollable", isScrollable ? "true" : "false");
  settingsTabsShell.setAttribute("data-stuck", isStuck ? "true" : "false");
  settingsTabsShell.setAttribute("data-faded", isStuck ? "true" : "false");
  settingsShell.setAttribute("data-stuck", isStuck ? "true" : "false");
}

function openSettingsPanel() {
  window.clearTimeout(settingsPanelCloseTimer);
  setActiveSurfacePanel("");
  hideSearchSuggestions();
  setQuickSearchActive(false);
  settingsShell.hidden = false;
  settingsShell.scrollTop = 0;
  updateSettingsTabsStickyVisualState();
  window.requestAnimationFrame(updateSettingsTabsStickyVisualState);
  settingsShell.getBoundingClientRect();
  settingsPanel.dataset.open = "true";
  settingsShell.classList.remove("page-closing");
  settingsShell.classList.add("page-active");
  settingsButton.classList.add("active");
  settingsButton.setAttribute("aria-expanded", "true");
  updateThemeSettingsUi();
  updateSyncSettingsUi();
  renderSearchSettingsForm();
  syncSurfaceChromeState();
  focusSettingsPanel();
}

function closeSettingsPanel() {
  if (!isSettingsPanelVisible() && !settingsShell.classList.contains("page-closing")) {
    return;
  }
  window.clearTimeout(settingsPanelCloseTimer);
  settingsPanel.dataset.open = "false";
  settingsShell.classList.remove("page-active");
  settingsShell.classList.add("page-closing");
  settingsButton.classList.remove("active");
  settingsButton.setAttribute("aria-expanded", "false");
  syncSurfaceChromeState();
  settingsPanelCloseTimer = window.setTimeout(() => {
    if (settingsPanel.dataset.open !== "true") {
      settingsShell.hidden = true;
      settingsShell.classList.remove("page-closing");
      settingsShell.setAttribute("data-stuck", "false");
      settingsShell.setAttribute("data-scrollable", "false");
      settingsTabsShell?.setAttribute("data-stuck", "false");
      settingsTabsShell?.setAttribute("data-faded", "false");
      syncSurfaceChromeState();
    }
  }, prefersReducedMotion() ? 0 : 220);
}

async function requestOnboardingGuide() {
  if (!onboardingGuide) {
    return;
  }
  try {
    const stored = await chrome.storage.local.get({ [ONBOARDING_GUIDE_STORAGE_KEY]: false });
    if (stored[ONBOARDING_GUIDE_STORAGE_KEY]) {
      return;
    }
    await openOnboardingGuide();
  } catch (error) {
    console.warn("Failed to read onboarding guide state", error);
  }
}

async function openOnboardingGuide() {
  if (!onboardingGuide) {
    return;
  }
  closeSettingsPanel();
  onboardingPreviewActive = true;
  await renderOnboardingPreview();
  onboardingCloseButton.querySelector(".button-icon").innerHTML = closeIcon();
  onboardingStepIndex = 0;
  onboardingGuide.hidden = false;
  showOnboardingStep();
  onboardingDoneButton.focus({ preventScroll: true });
}

async function renderOnboardingPreview() {
  await renderFavoriteSiteList(ONBOARDING_PREVIEW_FAVORITES);
}

function showOnboardingStep() {
  applyOnboardingLocale();
  requestAnimationFrame(positionOnboardingStep);
}

function positionOnboardingStep() {
  if (!onboardingGuide || onboardingGuide.hidden || !onboardingCard) {
    return;
  }
  const step = ONBOARDING_STEPS[onboardingStepIndex];
  const target = document.querySelector(step.target);
  if (!target) {
    return;
  }
  const viewportPadding = 12;
  const gap = 18;
  const targetRect = target.getBoundingClientRect();
  const cardRect = onboardingCard.getBoundingClientRect();
  const flip = onboardingCard.style.left && onboardingCard.style.top && !prefersReducedMotion()
    ? getGsapFlip()
    : null;
  const previousState = flip?.Flip.getState(onboardingCard);
  let placement = step.placement;
  if (placement === "bottom" && targetRect.bottom + gap + cardRect.height > window.innerHeight - viewportPadding) {
    placement = "top";
  } else if (placement === "top" && targetRect.top - gap - cardRect.height < viewportPadding) {
    placement = "bottom";
  } else if (placement === "right" && targetRect.right + gap + cardRect.width > window.innerWidth - viewportPadding) {
    placement = targetRect.left - gap - cardRect.width >= viewportPadding ? "left" : "bottom";
  } else if (placement === "left" && targetRect.left - gap - cardRect.width < viewportPadding) {
    placement = targetRect.right + gap + cardRect.width <= window.innerWidth - viewportPadding ? "right" : "bottom";
  }

  let left = targetRect.left + (targetRect.width - cardRect.width) / 2;
  let top = targetRect.bottom + gap;
  if (placement === "top") {
    top = targetRect.top - cardRect.height - gap;
  } else if (placement === "right") {
    left = targetRect.right + gap;
    top = targetRect.top + (targetRect.height - cardRect.height) / 2;
  } else if (placement === "left") {
    left = targetRect.left - cardRect.width - gap;
    top = targetRect.top + (targetRect.height - cardRect.height) / 2;
  }
  left = Math.min(Math.max(viewportPadding, left), window.innerWidth - cardRect.width - viewportPadding);
  top = Math.min(Math.max(viewportPadding, top), window.innerHeight - cardRect.height - viewportPadding);
  onboardingCard.style.left = `${left}px`;
  onboardingCard.style.top = `${top}px`;
  onboardingCard.dataset.placement = placement;
  const arrowPosition = placement === "top" || placement === "bottom"
    ? targetRect.left + targetRect.width / 2 - left - 7
    : targetRect.top + targetRect.height / 2 - top - 7;
  const arrowLimit = (placement === "top" || placement === "bottom" ? cardRect.width : cardRect.height) - 30;
  onboardingCard.style.setProperty("--onboarding-arrow-position", `${Math.min(Math.max(16, arrowPosition), arrowLimit)}px`);
  if (flip && previousState) {
    flip.Flip.from(previousState, {
      duration: gsapDuration(260),
      ease: "power3.out",
      simple: true,
      overwrite: true,
      onComplete() {
        flip.gsap.set(onboardingCard, { clearProps: "transform" });
      }
    });
  }
}

async function advanceOnboardingGuide() {
  if (onboardingStepIndex >= ONBOARDING_STEPS.length - 1) {
    await dismissOnboardingGuide();
    return;
  }
  onboardingStepIndex += 1;
  showOnboardingStep();
}

async function dismissOnboardingGuide() {
  if (!onboardingGuide || onboardingGuide.hidden) {
    return;
  }
  onboardingDoneButton.disabled = true;
  onboardingPreviewActive = false;
  await Promise.allSettled([renderFavoriteSites(), refreshHistory()]);
  onboardingGuide.hidden = true;
  onboardingDoneButton.disabled = false;
  try {
    await chrome.storage.local.set({ [ONBOARDING_GUIDE_STORAGE_KEY]: true });
  } catch (error) {
    console.warn("Failed to save onboarding guide state", error);
  }
}

function handleSettingsPanelDismiss(event) {
  if (!isSettingsPanelVisible()) {
    return;
  }
  const target = event.target;
  if (target instanceof Element && (settingsShell.contains(target) || settingsButton.contains(target))) {
    return;
  }
}

function handleQuickSearchSubmit(event) {
  event.preventDefault();
  submitQuickSearch();
}

function handleQuickSearchInputKeydown(event) {
  if (event.key === "Escape" && !event.isComposing && googleAiSearchModeActive) {
    event.preventDefault();
    event.stopPropagation();
    exitGoogleAiSearchMode();
    return;
  }
  if (event.key === "Escape" && !event.isComposing && !normalizeText(quickSearchInput.value)) {
    event.preventDefault();
    event.stopPropagation();
    exitDirectQuickSearchMode();
    hideSearchSuggestions();
    quickSearchInput.blur();
    return;
  }
  if (event.key === "Escape" && !event.isComposing && (!searchEngineById(activeSearchEngine).local || activePlatformSearchTarget)) {
    event.preventDefault();
    event.stopPropagation();
    exitDirectQuickSearchMode();
    return;
  }
  if (event.key === "Backspace" && !event.isComposing && googleAiSearchModeActive && quickSearchInput.value.length === 0) {
    event.preventDefault();
    event.stopPropagation();
    exitGoogleAiSearchMode();
    return;
  }
  if (event.key === "Backspace" && !event.isComposing && (!searchEngineById(activeSearchEngine).local || activePlatformSearchTarget) && quickSearchInput.value.length === 0) {
    event.preventDefault();
    event.stopPropagation();
    exitDirectQuickSearchMode();
    return;
  }
  if (event.key !== "Enter" || event.isComposing) {
    return;
  }
  const platformMatch = searchPlatformPrefix(quickSearchInput.value);
  if (platformMatch && searchEngineById(activeSearchEngine).local && !platformMatch.remainder) {
    event.preventDefault();
    activatePlatformSearchMatch(platformMatch);
    return;
  }
  event.preventDefault();
  submitQuickSearch();
}

function exitDirectQuickSearchMode() {
  if (googleAiSearchModeActive) {
    exitGoogleAiSearchMode();
    return;
  }
  if (activePlatformSearchTarget) {
    exitPlatformQuickSearchMode();
    return;
  }
  exitAiQuickSearchMode();
}

function exitAiQuickSearchMode() {
  if (searchEngineById(activeSearchEngine).local) {
    return;
  }
  activeSearchEngine = DEFAULT_SEARCH_ENGINE;
  updateQuickSearchModeUi();
  renderLocalSearchSuggestions(normalizeText(quickSearchInput.value));
}

function exitPlatformQuickSearchMode() {
  if (!activePlatformSearchTarget) {
    return;
  }
  activePlatformSearchTarget = "";
  updateQuickSearchModeUi();
  renderLocalSearchSuggestions(normalizeText(quickSearchInput.value));
}

function handleQuickSearchLeadingIconClick() {
  if (!canActivateGoogleAiSearchMode()) {
    return;
  }
  if (!isQuickSearchActive()) {
    quickSearchInput.focus({ preventScroll: true });
    return;
  }
  setQuickSearchActive(true);
  if (googleAiSearchModeActive) {
    exitGoogleAiSearchMode();
    quickSearchInput.focus({ preventScroll: true });
    return;
  }
  activeSearchEngine = DEFAULT_SEARCH_ENGINE;
  activePlatformSearchTarget = "";
  googleAiSearchModeActive = true;
  googleAiModeActiveStartedAt = performance.now();
  updateQuickSearchModeUi();
  renderLocalSearchSuggestions(normalizeText(quickSearchInput.value));
  quickSearchInput.focus({ preventScroll: true });
}

function handleQuickSearchLeadingIconPointerDown(event) {
  if (!canActivateGoogleAiSearchMode() || !isQuickSearchActive()) {
    return;
  }
  event.preventDefault();
  quickSearchInput.focus({ preventScroll: true });
}

function exitGoogleAiSearchMode() {
  if (!googleAiSearchModeActive) {
    return;
  }
  googleAiSearchModeActive = false;
  startGoogleAiModeExit();
  updateQuickSearchModeUi();
  renderLocalSearchSuggestions(normalizeText(quickSearchInput.value));
}

function startGoogleAiModeExit() {
  searchWorkbench?.style.setProperty("--google-ai-exit-border-angle", googleAiModeExitBorderAngle());
  searchWorkbench?.setAttribute("data-google-ai-exiting", "");
  window.clearTimeout(googleAiModeExitTimer);
  googleAiModeExitTimer = window.setTimeout(() => {
    searchWorkbench?.removeAttribute("data-google-ai-exiting");
    searchWorkbench?.style.removeProperty("--google-ai-exit-border-angle");
    updateGoogleImageSearchButton();
  }, prefersReducedMotion() ? GOOGLE_AI_MODE_REDUCED_EXIT_MS : GOOGLE_AI_MODE_EXIT_MS);
}

function googleAiModeExitBorderAngle() {
  if (!googleAiModeActiveStartedAt) {
    return "90deg";
  }
  const progress = ((performance.now() - googleAiModeActiveStartedAt) % 1800) / 1800;
  return `${90 + (progress * 360)}deg`;
}

function canActivateGoogleAiSearchMode() {
  return searchEngineById(activeSearchEngine).local
    && !activePlatformSearchTarget
    && selectedLocalSearchEngine === "google";
}

function isQuickSearchActive() {
  return Boolean(searchWorkbench?.classList.contains("search-active"))
    || document.activeElement === quickSearchInput;
}

function handleQuickSearchInput() {
  if (googleAiSearchModeActive) {
    renderLocalSearchSuggestions(normalizeText(quickSearchInput.value));
    return;
  }
  const commandMatch = searchAiCommand(quickSearchInput.value);
  if (commandMatch) {
    renderPlatformActivationHint("");
    quickSearchInput.value = commandMatch.remainder;
    setQuickSearchEngine(commandMatch.engine.id);
    return;
  }
  const platformInput = quickSearchInput.value;
  const platformMatch = searchPlatformPrefix(platformInput);
  if (platformMatch && searchEngineById(activeSearchEngine).local) {
    if (!platformMatch.remainder && !/\s$/.test(platformInput) && hasConflictingLongerPlatformActivator(platformMatch)) {
      renderPlatformActivationHint(platformInput);
      hideSearchSuggestions();
      return;
    }
    activatePlatformSearchMatch(platformMatch);
    return;
  }
  if (renderPlatformActivationHint(quickSearchInput.value)) {
    hideSearchSuggestions();
    return;
  }
  renderLocalSearchSuggestions(normalizeText(quickSearchInput.value));
}

function activatePlatformSearchMatch(match) {
  renderPlatformActivationHint("");
  quickSearchInput.value = match.remainder;
  setPlatformQuickSearchTarget(match.platform.id);
}

function setPlatformQuickSearchTarget(platformId) {
  googleAiSearchModeActive = false;
  activeSearchEngine = DEFAULT_SEARCH_ENGINE;
  activePlatformSearchTarget = platformSearchTargetById(platformId)?.id || "";
  updateQuickSearchModeUi();
  renderLocalSearchSuggestions(normalizeText(quickSearchInput.value));
}

function handleQuickSearchFocus() {
  setQuickSearchActive(true);
  handleQuickSearchInput();
}

function handleGoogleImageSearchButtonClick() {
  if (!googleImageSearchInput) {
    return;
  }
  quickSearchInput.focus({ preventScroll: true });
  googleImageSearchInput.value = "";
  googleImageSearchInput.click();
}

function handleGoogleImageSearchInputChange() {
  const file = googleImageSearchInput?.files?.[0];
  if (!file || (file.type && !file.type.startsWith("image/")) || !googleImageSearchForm) {
    return;
  }
  if (googleImageSearchFilename) {
    googleImageSearchFilename.value = file.name;
  }
  googleImageSearchForm.requestSubmit();
}

function handleAiAttachmentButtonClick() {
  if (!aiAttachmentInput || !supportsAiAttachmentsForActiveEngine()) {
    return;
  }
  quickSearchInput.focus({ preventScroll: true });
  aiAttachmentInput.value = "";
  aiAttachmentInput.click();
}

async function handleAiAttachmentInputChange(event) {
  const files = [...(event.currentTarget?.files || [])];
  if (event.currentTarget) {
    event.currentTarget.value = "";
  }
  if (!supportsAiAttachmentsForActiveEngine()) {
    clearAiDirectAttachments();
    return;
  }
  const accepted = [];
  for (const file of files.slice(0, AI_DIRECT_ATTACHMENT_MAX_COUNT)) {
    if (file.size > AI_DIRECT_ATTACHMENT_MAX_BYTES) {
      continue;
    }
    accepted.push({
      dataUrl: await fileToDataUrl(file),
      name: file.name || "attachment",
      size: file.size,
      type: file.type || "application/octet-stream"
    });
  }
  aiDirectAttachments = accepted;
  updateAiAttachmentUi();
}

function handleAiAttachmentPillClick() {
  clearAiDirectAttachments();
  quickSearchInput.focus({ preventScroll: true });
}

function clearAiDirectAttachments() {
  aiDirectAttachments = [];
  updateAiAttachmentUi();
}

function supportsAiAttachmentsForActiveEngine() {
  return AI_DIRECT_ATTACHMENT_ENGINE_IDS.has(activeSearchEngine)
    && !googleAiSearchModeActive
    && !activePlatformSearchTarget;
}

function aiAttachmentButtonLabel() {
  return t("aiAttachmentAdd", {
    engine: searchEngineLabel(searchEngineById(activeSearchEngine))
  });
}

function updateAiAttachmentUi() {
  const available = supportsAiAttachmentsForActiveEngine();
  const active = available && Boolean(searchWorkbench?.classList.contains("search-active"));
  if (aiAttachmentButton) {
    const label = aiAttachmentButtonLabel();
    aiAttachmentButton.hidden = !available;
    aiAttachmentButton.disabled = !active;
    aiAttachmentButton.tabIndex = active ? 0 : -1;
    aiAttachmentButton.dataset.hasAttachments = String(aiDirectAttachments.length > 0);
    aiAttachmentButton.setAttribute("aria-label", label);
    aiAttachmentButton.title = label;
    aiAttachmentButton.innerHTML = aiAttachmentIcon();
  }
  if (aiAttachmentPill && aiAttachmentPillText) {
    aiAttachmentPill.hidden = !available || aiDirectAttachments.length === 0;
    aiAttachmentPillText.textContent = aiAttachmentLabel(aiDirectAttachments);
    aiAttachmentPill.title = t("aiAttachmentClear");
  }
}

function aiAttachmentLabel(attachments) {
  if (!attachments.length) {
    return "";
  }
  return t("aiAttachmentCount", { count: attachments.length });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result || "")));
    reader.addEventListener("error", () => reject(reader.error || new Error("Failed to read attachment.")));
    reader.readAsDataURL(file);
  });
}

function updateGoogleImageSearchButton() {
  if (!googleImageSearchButton) {
    return;
  }
  const engine = searchEngineById(activeSearchEngine);
  const supported = engine.local
    && !activePlatformSearchTarget
    && selectedLocalSearchEngine === "google";
  const available = supported
    && !googleAiSearchModeActive
    && !searchWorkbench?.hasAttribute("data-google-ai-exiting");
  const active = available && isQuickSearchActive();
  googleImageSearchButton.hidden = !supported;
  googleImageSearchButton.toggleAttribute("data-mode-visible", available);
  googleImageSearchButton.disabled = !active;
  googleImageSearchButton.tabIndex = active ? 0 : -1;
}

function searchAiCommand(value) {
  const match = String(value || "").match(/^\/([a-z][a-z0-9-]*)(?:\s+|$)(.*)$/i);
  if (!match) {
    return null;
  }
  const command = `/${match[1].toLowerCase()}`;
  const engine = aiCommandEngines().find((item) => aiEngineCommands(item).includes(command));
  if (!engine) {
    return null;
  }
  return {
    engine,
    remainder: match[2] || ""
  };
}

function searchPlatformPrefix(value) {
  const match = String(value || "").match(/^(\*[a-z][a-z0-9-]*)(?:\s+|$)(.*)$/i);
  if (!match) {
    return null;
  }
  const prefix = match[1].toLowerCase();
  const remainder = match[2] || "";
  const platform = PLATFORM_SEARCH_TARGETS.find((target) => (
    target.prefixes.some((item) => item.toLowerCase() === prefix)
  ));
  if (!platform) {
    return null;
  }
  return {
    platform,
    prefix,
    remainder
  };
}

function platformSearchActivators() {
  return PLATFORM_SEARCH_TARGETS.flatMap((platform, platformIndex) => (
    platform.prefixes.map((prefix, prefixIndex) => ({
      platform,
      prefix: prefix.toLowerCase(),
      order: (platformIndex * 10) + prefixIndex
    }))
  ));
}

function hasConflictingLongerPlatformActivator(match) {
  return platformSearchActivators().some((item) => (
    item.platform.id !== match.platform.id && item.prefix.startsWith(match.prefix)
  ));
}

function platformSearchActivationHint(value) {
  const input = String(value || "").trim().toLowerCase();
  if (!/^\*[a-z][a-z0-9-]*$/.test(input)) {
    return null;
  }
  const matches = platformSearchActivators()
    .filter((item) => item.prefix.startsWith(input))
    .sort((left, right) => (
      left.prefix.length - right.prefix.length || left.order - right.order
    ));
  const match = matches[0];
  if (!match) {
    return null;
  }
  return {
    ...match,
    alternative: match.prefix === input
      ? matches.find((item) => item.platform.id !== match.platform.id) || null
      : null
  };
}

function renderPlatformActivationHint(value) {
  if (!platformActivationHint) {
    return false;
  }
  const match = searchEngineById(activeSearchEngine).local && !activePlatformSearchTarget
    ? platformSearchActivationHint(value)
    : null;
  if (!match) {
    platformActivationHint.hidden = true;
    platformActivationHint.textContent = "";
    platformActivationHint.removeAttribute("title");
    return false;
  }
  const label = match.alternative
    ? `${match.prefix}: ${searchEngineLabel(match.platform)} · ${match.alternative.prefix}: ${searchEngineLabel(match.alternative.platform)}`
    : t("quickSearchPlatformActivationHint", {
      prefix: match.prefix,
      platform: searchEngineLabel(match.platform)
    });
  platformActivationHint.textContent = label;
  platformActivationHint.title = label;
  platformActivationHint.hidden = false;
  return true;
}

function aiEngineCommands(engine) {
  return Array.from(new Set([engine.command, ...(engine.commands || [])]
    .filter(Boolean)
    .map((item) => String(item).toLowerCase())));
}

function aiCommandEngines() {
  return searchEngines.filter((engine) => engine.aiDirect && aiEngineCommands(engine).length);
}

function platformSearchTargetById(platformId) {
  return PLATFORM_SEARCH_TARGETS.find((target) => target.id === platformId) || null;
}

function handleQuickSearchBlur() {
  window.setTimeout(() => {
    const activeElement = document.activeElement;
    const themeModeControl = document.querySelector("#themeModeControl");
    const keepActive = activeElement instanceof Element
      && (
        quickSearchForm.contains(activeElement)
        || searchSuggestions.contains(activeElement)
        || themeModeControl?.contains(activeElement)
      );
    if (!keepActive) {
      setQuickSearchActive(false);
    }
  }, 0);
}

function setQuickSearchActive(isActive) {
  searchWorkbench?.classList.toggle("search-active", isActive);
  updateQuickSearchLeadingIcon();
  updateGoogleImageSearchButton();
  updateAiAttachmentUi();
  favoriteStrip?.setAttribute("aria-disabled", String(isActive));
  favoriteStrip?.querySelectorAll(".favorite-link, .favorite-remove").forEach((control) => {
    if (isActive) {
      control.tabIndex = -1;
    } else {
      control.removeAttribute("tabindex");
    }
  });
}

function submitQuickSearch() {
  const query = normalizeText(quickSearchInput.value);
  if (!query) {
    quickSearchInput.focus();
    return;
  }
  const engine = searchEngineById(activeSearchEngine);
  if (engine.local) {
    submitLocalQuickSearch(query);
    return;
  }
  if (engine.autoSubmit && !looksLikeUrl(query) && !localhostUrl(query)) {
    submitAiDirectSearch(engine, query);
    return;
  }
  window.location.assign(quickSearchDestination(query));
}

function submitLocalQuickSearch(query) {
  const platform = platformSearchTargetById(activePlatformSearchTarget);
  if (platform) {
    submitPlatformQuickSearch(platform, query);
    return;
  }
  if (googleAiSearchModeActive) {
    submitEngineQuickSearch(searchEngineById("google", { strict: true }) || selectedLocalSearchEngineConfig(), query);
    return;
  }
  const localUrl = localhostUrl(query);
  if (localUrl) {
    window.location.assign(localUrl);
    return;
  }
  const directUrl = looksLikeUrl(query) ? normalizePortalUrl(query) : "";
  if (directUrl) {
    window.location.assign(directUrl);
    return;
  }
  submitAggregateQuickSearch(query);
}

function submitAggregateQuickSearch(query) {
  submitEngineQuickSearch(selectedLocalSearchEngineConfig(), query);
}

function submitEngineQuickSearch(engine, query) {
  if (engine?.id === "google" && googleAiSearchModeActive) {
    window.location.assign(googleAiModeDestination(query));
    return;
  }
  const localUrl = localhostUrl(query);
  if (localUrl) {
    window.location.assign(localUrl);
    return;
  }
  const directUrl = looksLikeUrl(query) ? normalizePortalUrl(query) : "";
  if (directUrl) {
    window.location.assign(directUrl);
    return;
  }
  const fallbackEngine = searchEngineById("google", { strict: true });
  const targetEngine = engine?.searchUrl ? engine : fallbackEngine;
  window.location.assign(targetEngine ? engineSearchDestination(targetEngine, query) : aggregateSearchDestination(query));
}

function submitPlatformQuickSearch(platform, query) {
  window.location.assign(platformSearchDestination(platform, query));
}

function aggregateSearchDestination(query) {
  const engines = AGGREGATE_SEARCH_ENGINE_IDS
    .map((engineId) => searchEngineById(engineId, { strict: true }))
    .filter(Boolean);
  const searchUrls = engines.map((engine) => engineSearchDestination(engine, query));
  if (searchUrls.length > 1 && chrome.tabs?.create) {
    searchUrls.slice(1).forEach((url) => chrome.tabs.create({ url, active: false }));
  }
  const fallbackEngine = searchEngineById("google", { strict: true });
  return searchUrls[0] || (fallbackEngine ? engineSearchDestination(fallbackEngine, query) : `https://www.google.com/search?q=${encodeURIComponent(query)}`);
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
  return engineSearchDestination(engine, query);
}

function engineSearchDestination(engine, query) {
  const searchUrl = new URL(engine.searchUrl);
  searchUrl.searchParams.set(engine.queryParam, query);
  return searchUrl.href;
}

function googleAiModeDestination(query) {
  const searchUrl = new URL(GOOGLE_AI_MODE_SEARCH_URL);
  if (query) {
    searchUrl.searchParams.set("q", query);
  }
  return searchUrl.href;
}

function platformSearchDestination(platform, query) {
  const searchUrl = new URL(platform.searchUrl);
  Object.entries(platform.searchParams || {}).forEach(([key, value]) => {
    searchUrl.searchParams.set(key, value);
  });
  if (platform.pathQuery) {
    const basePath = searchUrl.pathname.replace(/\/?$/, "/");
    searchUrl.pathname = `${basePath}${encodeURIComponent(query)}`;
  } else {
    searchUrl.searchParams.set(platform.queryParam || "q", query);
  }
  return searchUrl.href;
}

async function submitAiDirectSearch(engine, query) {
  const targetUrl = engine.directUrl || engine.searchUrl;
  const token = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  let destination = engineSearchDestination(engine, query);
  try {
    await recordAiPromptHistory(engine, query);
  } catch (error) {
    console.warn("Failed to record AI prompt history", error);
  }
  try {
    await saveAiDirectPrompt(token, {
      attachments: AI_DIRECT_ATTACHMENT_ENGINE_IDS.has(engine.id) ? aiDirectAttachments : [],
      prompt: query,
      engineId: engine.id,
      createdAt: Date.now()
    });
    aiDirectAttachments = [];
    destination = aiDirectTargetUrl(targetUrl, token, engine.urlPromptFallback ? query : "");
  } catch (error) {
    console.warn("Failed to save AI direct prompt before navigation", error);
  }
  window.location.assign(destination);
}

async function saveAiDirectPrompt(token, payload) {
  const prompts = await loadAiDirectPrompts();
  prompts[token] = payload;
  await setStoredValues({ [AI_DIRECT_PROMPT_STORAGE_KEY]: pruneAiDirectPrompts(prompts) });
}

async function loadAiDirectPrompts() {
  try {
    const result = await getStoredValues({ [AI_DIRECT_PROMPT_STORAGE_KEY]: {} });
    const prompts = result[AI_DIRECT_PROMPT_STORAGE_KEY];
    return prompts && typeof prompts === "object" && !Array.isArray(prompts) ? prompts : {};
  } catch {
    return {};
  }
}

function pruneAiDirectPrompts(prompts) {
  const now = Date.now();
  return Object.fromEntries(Object.entries(prompts)
    .filter(([, item]) => now - Number(item?.createdAt || 0) < AI_DIRECT_PROMPT_TTL_MS));
}

function aiDirectTargetUrl(targetUrl, token, prompt = "") {
  try {
    const url = new URL(targetUrl);
    url.searchParams.set(AI_DIRECT_PROMPT_TOKEN_PARAM, token);
    if (prompt) {
      const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
      hashParams.set(AI_DIRECT_PROMPT_TEXT_PARAM, prompt);
      url.hash = hashParams.toString();
    }
    return url.href;
  } catch {
    return targetUrl;
  }
}

async function renderLocalSearchSuggestions(query, options = {}) {
  const requestId = ++localSearchRequestId;
  if (!query) {
    hideSearchSuggestions();
    return;
  }
  const results = await localSearchItems(query, { scope: activeSearchSuggestionScope() });
  if (requestId !== localSearchRequestId) {
    return;
  }
  localSearchResults = results;
  const fragment = document.createDocumentFragment();
  const engineSuggestion = createSearchEngineSuggestion(query);
  fragment.appendChild(createSearchSuggestionItem(engineSuggestion, query));
  results.forEach((item) => {
    fragment.appendChild(createSearchSuggestionItem(item, query));
  });
  if (!results.length && options.forceEmpty) {
    fragment.appendChild(createSearchEmptyState());
  }
  searchSuggestions.replaceChildren(fragment);
  showSearchSuggestions();
}

function showSearchSuggestions() {
  window.clearTimeout(searchSuggestionsHideTimer);
  cancelAnimationFrame(searchSuggestionsShowFrame);
  searchSuggestions.hidden = false;
  updateSearchSuggestionsHeight();
  searchSuggestionsShowFrame = requestAnimationFrame(() => {
    updateSearchSuggestionsHeight();
    searchWorkbench?.classList.remove("suggestions-closing");
    searchWorkbench?.classList.add("suggestions-open");
  });
}

function finishHideSearchSuggestions() {
  searchWorkbench?.classList.remove("suggestions-closing");
  searchSuggestions.hidden = true;
  searchSuggestions.replaceChildren();
  searchSuggestions.style.setProperty("--search-suggestions-height", "0px");
}

function updateSearchSuggestionsHeight() {
  const styles = window.getComputedStyle(searchSuggestions);
  const currentPaddingY = (Number.parseFloat(styles.paddingTop) || 0)
    + (Number.parseFloat(styles.paddingBottom) || 0);
  const contentHeight = searchSuggestionsNaturalContentHeight();
  const paddingY = searchWorkbench?.classList.contains("suggestions-open")
    ? currentPaddingY
    : SEARCH_SUGGESTIONS_OPEN_PADDING_Y;
  searchSuggestions.style.setProperty(
    "--search-suggestions-height",
    `${Math.ceil(contentHeight + paddingY)}px`
  );
}

function searchSuggestionsNaturalContentHeight() {
  const items = [...searchSuggestions.children].filter((item) => {
    return item instanceof HTMLElement && !item.hidden;
  });
  if (!items.length) {
    return 0;
  }
  const styles = window.getComputedStyle(searchSuggestions);
  const rowGap = Number.parseFloat(styles.rowGap || styles.gap) || 0;
  return items.reduce((total, item) => {
    return total + item.getBoundingClientRect().height;
  }, 0) + (items.length - 1) * rowGap;
}

function createSearchEngineSuggestion(query) {
  const platform = platformSearchTargetById(activePlatformSearchTarget);
  if (platform) {
    return {
      type: "engine-search",
      title: query,
      meta: "",
      hint: t("quickSearchWithPlatform", { platform: searchEngineLabel(platform) }),
      query,
      selectedPlatformId: platform.id
    };
  }
  const engine = searchEngineById(activeSearchEngine);
  if (!engine.local) {
    return {
      type: "engine-search",
      title: query,
      meta: "",
      hint: t("quickSearchWithAi", { engine: searchEngineLabel(engine) }),
      query,
      selectedAiEngineId: engine.id
    };
  }
  const selectedEngine = selectedLocalSearchEngineConfig();
  return {
    type: "engine-search",
    title: query,
    meta: "",
    hint: googleAiSearchModeActive
      ? t("quickSearchWithGoogleAi")
      : selectedEngine
        ? t("quickSearchWith", { engine: selectedEngine.label })
        : t("quickSearch"),
    query,
    selectedEngineId: selectedEngine?.id || AGGREGATE_SEARCH_ENGINE_IDS[0]
  };
}

async function localSearchItems(query, options = {}) {
  const scope = options.scope || null;
  const [historyItems, bookmarkItems, aiPromptHistoryItems] = await Promise.all([
    searchHistoryItems(query, scope),
    searchBookmarkItems(query, scope),
    searchAiPromptHistoryItems(query, scope)
  ]);
  const merged = [...aiPromptHistoryItems, ...historyItems, ...bookmarkItems];
  const byKey = new Map();
  const normalizedQuery = normalizeText(query).toLowerCase();
  merged.forEach((item) => {
    const key = item.dedupKey || localSearchDedupKey(item.url);
    if (!key) {
      return;
    }
    const scoredItem = {
      ...item,
      score: localSearchScore(item, normalizedQuery)
    };
    if (scoredItem.score <= 0) {
      return;
    }
    const existing = byKey.get(key);
    if (!existing || compareLocalSearchItems(scoredItem, existing) < 0) {
      byKey.set(key, scoredItem);
    }
  });
  return [...byKey.values()]
    .sort(compareLocalSearchItems)
    .slice(0, MAX_LOCAL_SEARCH_RESULTS);
}

function activeSearchSuggestionScope() {
  if (googleAiSearchModeActive) {
    return googleAiSearchSuggestionScope();
  }
  const platform = platformSearchTargetById(activePlatformSearchTarget);
  if (platform) {
    return searchTargetSuggestionScope(platform);
  }
  const engine = searchEngineById(activeSearchEngine);
  return engine.local ? null : searchTargetSuggestionScope(engine);
}

function searchTargetSuggestionScope(target) {
  const siteKeys = [target.searchUrl, target.directUrl, target.iconUrl]
    .map(searchSuggestionSiteKey)
    .filter(Boolean);
  const uniqueSiteKeys = [...new Set(siteKeys)];
  return uniqueSiteKeys.length || target.aiDirect
    ? { siteKeys: uniqueSiteKeys, aiEngineId: target.aiDirect ? target.id : "" }
    : null;
}

function googleAiSearchSuggestionScope() {
  return { siteKeys: ["google.com"], googleAiMode: true };
}

function searchSuggestionSiteKey(url) {
  const parsed = safeUrl(url);
  return parsed && isWebUrl(parsed.href) ? canonicalSiteHost(parsed.hostname) : "";
}

function localSearchMatchesScope(item, scope) {
  if (!scope?.siteKeys?.length) {
    return true;
  }
  const url = safeUrl(item?.url);
  const siteKey = url ? canonicalSiteHost(url.hostname) : "";
  return Boolean(siteKey && scope.siteKeys.includes(siteKey))
    && (!scope.googleAiMode || googleAiModeHistoryUrl(url));
}

function googleAiModeHistoryUrl(url) {
  const path = (url?.pathname || "").replace(/\/+$/, "") || "/";
  return path === "/ai" || (path === "/search" && url.searchParams.get("udm") === "50");
}

async function searchHistoryItems(query, scope = null) {
  if (!chrome.history?.search) {
    return [];
  }
  try {
    const items = await chrome.history.search({
      text: query,
      maxResults: scope ? 96 : 24,
      startTime: Date.now() - (BOOKMARK_HISTORY_LOOKBACK_DAYS * 24 * 60 * 60 * 1000)
    });
    const normalizedQuery = normalizeText(query).toLowerCase();
    return items
      .filter((item) => item.url && isWebUrl(item.url) && localSearchMatchesScope(item, scope) && fuzzyMatchesHistoryItem(item, normalizedQuery))
      .map((item) => ({
        type: "history",
        title: normalizeText(item.title) || historyFallbackTitle(safeUrl(item.url)),
        url: item.url,
        lastVisitTime: item.lastVisitTime || 0,
        visitCount: Number(item.visitCount || 0),
        typedCount: Number(item.typedCount || 0)
      }));
  } catch {
    return [];
  }
}

async function searchBookmarkItems(query, scope = null) {
  if (!chrome.bookmarks?.getTree) {
    return [];
  }
  try {
    const tree = await chrome.bookmarks.getTree();
    const normalizedQuery = normalizeText(query).toLowerCase();
    return flattenBookmarkSites(tree)
      .filter((entry) => entry.url && isWebUrl(entry.url) && localSearchMatchesScope(entry, scope) && fuzzyMatchesBookmarkEntry(entry, normalizedQuery))
      .slice(0, 24)
      .map((entry) => ({
        type: "bookmark",
        title: normalizeText(entry.title) || historyFallbackTitle(safeUrl(entry.url)),
        url: entry.url,
        lastVisitTime: Number(entry.dateLastUsed || entry.dateAdded || 0),
        dateAdded: Number(entry.dateAdded || 0),
        path: entry.path || ""
      }));
  } catch {
    return [];
  }
}

async function searchAiPromptHistoryItems(query, scope = null) {
  const aiEngine = searchEngineById(scope?.aiEngineId, { strict: true });
  if (!aiEngine || aiEngine.local) {
    return [];
  }
  const history = await loadAiPromptHistory();
  const normalizedQuery = normalizeText(query).toLowerCase();
  const providerUrl = aiEngine.directUrl || aiEngine.searchUrl;
  return history
    .filter((item) => item.engineId === aiEngine.id && fuzzyIncludes(item.prompt, normalizedQuery))
    .map((item) => ({
      type: "history",
      title: item.prompt,
      url: providerUrl,
      meta: `${formatHistoryTimestamp(item.updatedAt)} · ${compactSiteDomain(providerUrl)}`,
      lastVisitTime: Number(item.updatedAt || 0),
      visitCount: Number(item.count || 1),
      dedupKey: `ai-prompt:${aiEngine.id}:${normalizeText(item.prompt).toLowerCase()}`,
      query: item.prompt,
      selectedAiEngineId: aiEngine.id
    }));
}

function compareLocalSearchItems(a, b) {
  const scoreDiff = Number(b.score || 0) - Number(a.score || 0);
  if (scoreDiff !== 0) {
    return scoreDiff;
  }
  const sourceDiff = localSearchSourceRank(b) - localSearchSourceRank(a);
  if (sourceDiff !== 0) {
    return sourceDiff;
  }
  const visitDiff = Number(b.visitCount || 0) - Number(a.visitCount || 0);
  if (visitDiff !== 0) {
    return visitDiff;
  }
  return Number(b.lastVisitTime || 0) - Number(a.lastVisitTime || 0);
}

function localSearchSourceRank(item) {
  if (item?.selectedAiEngineId) {
    return 4;
  }
  if (item?.type === "bookmark") {
    return 3;
  }
  if (item?.type === "history") {
    return 2;
  }
  return 1;
}

function localSearchDedupKey(url) {
  try {
    const parsed = new URL(url);
    parsed.protocol = parsed.protocol.toLowerCase();
    parsed.hostname = canonicalSiteHost(parsed.hostname);
    parsed.hash = "";
    parsed.pathname = parsed.pathname === "/" ? "/" : parsed.pathname.replace(/\/+$/, "");
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "ref", "source", "from"].forEach((key) => {
      parsed.searchParams.delete(key);
    });
    return parsed.href.toLowerCase();
  } catch {
    return normalizeText(url).toLowerCase();
  }
}

async function recordAiPromptHistory(engine, query) {
  const engineId = String(engine?.id || "");
  const prompt = normalizeText(query).slice(0, AI_PROMPT_HISTORY_MAX_PROMPT_LENGTH);
  if (!engineId || !prompt) {
    return;
  }
  const history = await loadAiPromptHistory();
  const existingIndex = history.findIndex((item) => item.engineId === engineId && item.prompt === prompt);
  const existing = existingIndex >= 0 ? history[existingIndex] : null;
  const nextItem = {
    engineId,
    prompt,
    updatedAt: Date.now(),
    count: Number(existing?.count || 0) + 1
  };
  const nextHistory = [
    nextItem,
    ...history.filter((_, index) => index !== existingIndex)
  ].slice(0, MAX_AI_PROMPT_HISTORY_ITEMS);
  await setStoredValues({ [AI_PROMPT_HISTORY_STORAGE_KEY]: nextHistory });
}

async function loadAiPromptHistory() {
  try {
    const result = await getStoredValues({ [AI_PROMPT_HISTORY_STORAGE_KEY]: [] });
    return normalizeAiPromptHistory(result[AI_PROMPT_HISTORY_STORAGE_KEY]);
  } catch {
    return [];
  }
}

function normalizeAiPromptHistory(value) {
  return Array.isArray(value)
    ? value
      .map((item) => ({
        engineId: String(item?.engineId || ""),
        prompt: normalizeText(item?.prompt).slice(0, AI_PROMPT_HISTORY_MAX_PROMPT_LENGTH),
        updatedAt: Number(item?.updatedAt || 0),
        count: Math.max(1, Number(item?.count || 1))
      }))
      .filter((item) => item.engineId && item.prompt)
      .slice(0, MAX_AI_PROMPT_HISTORY_ITEMS)
    : [];
}

function localSearchScore(item, query) {
  if (!item?.url || !query) {
    return 0;
  }
  const url = safeUrl(item.url);
  const title = normalizeText(item.title).toLowerCase();
  const host = url ? canonicalSiteHost(url.hostname) : "";
  const hostLabels = host.split(".").filter(Boolean);
  const pathText = url ? decodeURIComponentSafe(url.pathname || "").toLowerCase() : "";
  const pathTokens = pathText.split(/[^a-z0-9\u4e00-\u9fff]+/i).filter(Boolean);
  const queryTerms = query.split(/[^a-z0-9\u4e00-\u9fff]+/i).filter(Boolean);
  let score = 0;

  if (title === query) {
    score += 120;
  } else if (title.startsWith(query)) {
    score += 72;
  } else if (title.includes(query)) {
    score += shouldAllowLooseLocalSearch(query) ? 30 : 14;
  }

  if (host === query || hostLabels.includes(query)) {
    score += 92;
  } else if (host.startsWith(query) || hostLabels.some((label) => label.startsWith(query))) {
    score += 58;
  } else if (shouldAllowLooseLocalSearch(query) && host.includes(query)) {
    score += 22;
  }

  queryTerms.forEach((term) => {
    if (!term) {
      return;
    }
    if (title.includes(term)) {
      score += 12;
    }
    if (hostLabels.includes(term)) {
      score += 20;
    } else if (hostLabels.some((label) => label.startsWith(term))) {
      score += 12;
    }
    if (pathTokens.includes(term)) {
      score += 16;
    } else if (pathTokens.some((token) => token.startsWith(term))) {
      score += 8;
    }
  });

  score += localSearchPageShapeScore(item, url, query);
  score += localSearchBehaviorScore(item);
  score += item.type === "bookmark" ? 18 : 8;

  return score;
}

function localSearchPageShapeScore(item, url, query) {
  if (!url) {
    return 0;
  }
  const path = url.pathname || "/";
  const depth = path.split("/").filter(Boolean).length;
  const title = normalizeText(item.title).toLowerCase();
  const wantsUtility = matchesAny(query, ["setting", "settings", "account", "profile", "dashboard", "设置", "账户", "账号"]);
  let score = 0;

  if (depth === 0 || path === "/") {
    score += 28;
  } else if (depth === 1) {
    score += 12;
  } else if (depth >= 3) {
    score -= Math.min(24, (depth - 2) * 8);
  }

  if (matchesAny(title, ["home", "homepage", "首页", "主页", "dashboard", "控制台"])) {
    score += 14;
  }

  if (!wantsUtility && matchesAny(path.toLowerCase(), ["/settings", "/setting", "/account", "/profile", "/login", "/admin"])) {
    score -= 48;
  }

  return score;
}

function localSearchBehaviorScore(item) {
  let score = 0;
  const visitCount = Number(item.visitCount || 0);
  const typedCount = Number(item.typedCount || 0);
  const lastVisitTime = Number(item.lastVisitTime || 0);

  if (visitCount > 0) {
    score += Math.min(20, Math.log2(visitCount + 1) * 5);
  }
  if (typedCount > 0) {
    score += Math.min(14, typedCount * 2);
  }
  if (lastVisitTime > 0) {
    const hoursSinceVisit = (Date.now() - lastVisitTime) / (1000 * 60 * 60);
    if (hoursSinceVisit < 2) {
      score += 18;
    } else if (hoursSinceVisit < 24) {
      score += 12;
    } else if (hoursSinceVisit < 72) {
      score += 7;
    }
  }
  return score;
}

function shouldAllowLooseLocalSearch(query) {
  return /[\u4e00-\u9fff]/.test(query) || query.length > 2;
}

function fuzzyMatchesHistoryItem(item, query) {
  return fuzzyIncludes(localSearchVisibleText(item), query);
}

function fuzzyMatchesBookmarkEntry(entry, query) {
  return fuzzyIncludes(localSearchVisibleText(entry), query);
}

function localSearchVisibleText(item) {
  return `${item?.title || ""} ${compactSiteDomain(item?.url || "")}`;
}

function fuzzyIncludes(value, query) {
  const text = normalizeText(value).toLowerCase();
  if (!query) {
    return false;
  }
  if (text.includes(query)) {
    return true;
  }
  let cursor = 0;
  for (const char of query) {
    cursor = text.indexOf(char, cursor);
    if (cursor === -1) {
      return false;
    }
    cursor += 1;
  }
  return true;
}

function createSearchSuggestionItem(item, query = "") {
  const actionableSuggestion = item.type === "engine-search" || Boolean(item?.selectedAiEngineId);
  const link = actionableSuggestion ? document.createElement("div") : document.createElement("a");
  const icon = item.type === "engine-search" ? document.createElement("span") : document.createElement("img");
  const copy = document.createElement("span");
  const title = document.createElement("strong");
  const meta = document.createElement("span");
  const trailing = document.createElement("span");
  link.className = "search-suggestion-item";
  if (actionableSuggestion) {
    link.tabIndex = 0;
    link.addEventListener("click", (event) => {
      event.preventDefault();
      submitSelectedSuggestionSearch(item);
    });
    link.addEventListener("keydown", (event) => {
      if ((event.key === "Enter" || event.key === " ") && !event.isComposing) {
        event.preventDefault();
        submitSelectedSuggestionSearch(item);
      }
    });
    if (item.type === "engine-search") {
      link.classList.add("search-suggestion-item-primary");
    }
  } else {
    link.href = item.url;
  }
  link.setAttribute("role", "option");
  icon.className = "search-suggestion-icon";
  if (item.type === "engine-search") {
    icon.classList.add("search-suggestion-icon-symbol");
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = searchEngineSearchIcon();
  } else {
    WayleafIcon.applyHistoryIcon(icon, item);
    icon.alt = "";
  }
  copy.className = "search-suggestion-copy";
  if (item.type === "engine-search") {
    title.textContent = item.title;
  } else {
    appendSearchSuggestionMarkedText(title, item.title, query);
  }
  const metaText = item.meta || (item.type === "history"
    ? `${formatHistoryTimestamp(item.lastVisitTime)} · ${compactSiteDomain(item.url)}`
    : item.type === "bookmark"
      ? compactSiteDomain(item.url)
      : "");
  meta.textContent = metaText;
  if (item.type === "engine-search") {
    trailing.className = "search-suggestion-engine-label";
    trailing.textContent = item.hint || "";
  } else {
    trailing.className = "search-suggestion-badge";
    trailing.textContent = item.type === "history" ? t("localSearchHistory") : t("localSearchBookmark");
  }
  copy.append(title);
  if (metaText) {
    copy.append(meta);
  }
  link.append(icon, copy, trailing);
  return link;
}

function appendSearchSuggestionMarkedText(node, text, query) {
  const value = String(text || "");
  const matches = searchSuggestionTextMatches(value, query);
  if (!matches.length) {
    node.textContent = value;
    return;
  }
  let cursor = 0;
  matches.forEach((match) => {
    if (match.index > cursor) {
      node.append(document.createTextNode(value.slice(cursor, match.index)));
    }
    node.append(searchSuggestionMatchNode(value.slice(match.index, match.index + match.length)));
    cursor = match.index + match.length;
  });
  if (cursor < value.length) {
    node.append(document.createTextNode(value.slice(cursor)));
  }
}

function searchSuggestionTextMatches(text, query) {
  const value = String(text || "");
  const normalizedValue = value.toLowerCase();
  const terms = normalizeText(query)
    .toLowerCase()
    .split(/[^a-z0-9\u4e00-\u9fff]+/i)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
  const matches = [];
  for (const term of terms) {
    let index = normalizedValue.indexOf(term);
    while (index >= 0) {
      const length = term.length;
      const overlaps = matches.some((match) => index < match.index + match.length && index + length > match.index);
      if (!overlaps) {
        matches.push({ index, length });
      }
      index = normalizedValue.indexOf(term, index + length);
    }
  }
  return matches.sort((a, b) => a.index - b.index);
}

function searchSuggestionMatchNode(text) {
  const mark = document.createElement("mark");
  mark.className = "search-suggestion-match";
  mark.textContent = text;
  return mark;
}

function submitSelectedSuggestionSearch(item) {
  const platform = platformSearchTargetById(item.selectedPlatformId);
  if (platform) {
    submitPlatformQuickSearch(platform, item.query);
    return;
  }
  const aiEngine = searchEngineById(item.selectedAiEngineId, { strict: true });
  if (aiEngine && !aiEngine.local) {
    if (aiEngine.autoSubmit && !looksLikeUrl(item.query) && !localhostUrl(item.query)) {
      submitAiDirectSearch(aiEngine, item.query);
    } else {
      submitEngineQuickSearch(aiEngine, item.query);
    }
    return;
  }
  const selectedEngine = searchEngineById(item.selectedEngineId || selectedLocalSearchEngine, { strict: true })
    || selectedLocalSearchEngineConfig();
  submitEngineQuickSearch(selectedEngine, item.query);
}

function selectedLocalSearchEngineConfig() {
  return searchEngineById(selectedLocalSearchEngine, { strict: true })
    || searchEngineById(AGGREGATE_SEARCH_ENGINE_IDS[0], { strict: true });
}

function createSearchEmptyState() {
  const node = document.createElement("div");
  node.className = "search-suggestion-empty";
  node.textContent = t("localSearchNoResults");
  return node;
}

function hideSearchSuggestions() {
  localSearchRequestId += 1;
  localSearchResults = [];
  window.clearTimeout(searchSuggestionsHideTimer);
  cancelAnimationFrame(searchSuggestionsShowFrame);
  if (searchSuggestions.hidden && !searchWorkbench?.classList.contains("suggestions-open")) {
    searchWorkbench?.classList.remove("suggestions-closing");
    searchSuggestions.replaceChildren();
    searchSuggestions.style.setProperty("--search-suggestions-height", "0px");
    return;
  }
  updateSearchSuggestionsHeight();
  searchWorkbench?.classList.remove("suggestions-open");
  searchWorkbench?.classList.add("suggestions-closing");
  searchSuggestionsHideTimer = window.setTimeout(finishHideSearchSuggestions, SEARCH_SUGGESTIONS_EXIT_MS);
}

function handleSearchSuggestionDismiss(event) {
  if (searchSuggestions.hidden) {
    return;
  }
  const target = event.target;
  if (target instanceof Element && (searchSuggestions.contains(target) || quickSearchForm.contains(target))) {
    return;
  }
  hideSearchSuggestions();
}

function looksLikeUrl(value) {
  const input = String(value || "").trim();
  // ponytail: bare dotted tokens are ambiguous with filenames; require an explicit URL signal instead of maintaining extension/TLD lists.
  return /^https?:\/\//i.test(input)
    || /^www\.[^\s/?#]+(?:[/?#]|$)/i.test(input)
    || /^localhost(?::\d+)?(?:[/?#]|$)/i.test(input);
}

function localhostUrl(value) {
  return /^localhost(?::\d+)?(?:[/?#]|$)/i.test(value)
    ? normalizePortalUrl(`http://${value}`)
    : "";
}

async function renderPortals() {
  const fragment = document.createDocumentFragment();
  const [recommendedSites, favoriteSites] = await Promise.all([
    loadRecommendedSites(),
    loadFavoriteSites()
  ]);
  const favoriteKeys = favoriteSiteKeySet(favoriteSites);
  const favoriteIconMap = favoriteSiteIconMap(favoriteSites);
  const iconRenders = readFirstPaintCache().iconRenders;
  const groups = groupPortalsByCategory(recommendedSites);
  portalCategoryState = await loadPortalCategoryState(groups);
  if (groups.length) {
    fragment.appendChild(createPortalClassificationModule(groups, {
      favoriteKeys,
      favoriteIconMap,
      iconRenders
    }));
  }
  portalGrid.replaceChildren(fragment);
}

async function loadRecommendedSites() {
  return (Array.isArray(window.WAYLEAF_RECOMMENDED_SITES) ? window.WAYLEAF_RECOMMENDED_SITES : PORTALS)
    .filter((site) => site?.url && isWebUrl(site.url))
    .map((site) => ({
      id: String(site.id || site.url),
      recommended: true,
      title: normalizeText(site.names?.[LOCALE] || site.name || site.title).slice(0, MAX_PORTAL_TITLE_LENGTH) || favoriteSiteTitleFromUrl(site.url),
      url: site.url,
      category: normalizePortalCategory(site.category),
      description: normalizeText(site.description),
      keywords: Array.isArray(site.keywords) ? site.keywords.map(normalizeText).filter(Boolean) : []
    }));
}

async function loadPortalCategoryState(groups) {
  try {
    const result = await getStoredValues({ [PORTAL_CATEGORY_STATE_STORAGE_KEY]: {} });
    const saved = result[PORTAL_CATEGORY_STATE_STORAGE_KEY];
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) {
      return defaultPortalCategoryState(groups);
    }
    return Object.fromEntries(groups.map((group) => [
      group.category,
      { expanded: saved[group.category]?.expanded !== false }
    ]));
  } catch {
    return defaultPortalCategoryState(groups);
  }
}

function defaultPortalCategoryState(groups) {
  return Object.fromEntries(groups.map((group) => [group.category, { expanded: true }]));
}

async function savePortalCategoryState() {
  await setStoredValues({ [PORTAL_CATEGORY_STATE_STORAGE_KEY]: portalCategoryState });
}

async function togglePortalCategoryExpanded(category) {
  const current = portalCategoryState[category]?.expanded !== false;
  portalCategoryState = {
    ...portalCategoryState,
    [category]: { expanded: !current }
  };
  applyPortalCategoryExpansionState(category, !current);
  await savePortalCategoryState();
}

function applyPortalCategoryExpansionState(category, expanded) {
  const section = portalGrid.querySelector(`.portal-category[data-category="${CSS.escape(category)}"]`);
  const toggleButton = section?.querySelector(".portal-category-toggle");
  if (!section || !toggleButton) {
    return;
  }
  const grid = section.querySelector(".portal-category-grid");
  const hiddenCount = Number(section.dataset.hiddenCount || 0);
  const isCollapsible = hiddenCount > 0;
  const resolvedExpanded = expanded || !isCollapsible;
  section.classList.toggle("expanded", resolvedExpanded);
  section.classList.toggle("collapsed", !resolvedExpanded);
  toggleButton.setAttribute("aria-expanded", String(resolvedExpanded));
  if (grid?.id) {
    toggleButton.setAttribute("aria-controls", grid.id);
  }
  toggleButton.querySelector(".portal-switcher-toggle-label").textContent = expanded
    ? t("portalCategoriesCollapse")
    : t("portalCategoriesExpand");
  toggleButton.querySelector(".portal-category-toggle-icon").innerHTML = expanded
    ? chevronUpIcon()
    : chevronDownIcon();
}

async function loadBookmarkDrivenPortals(customPortals) {
  const bookmarkData = await loadBookmarkPortalItems();
  const bookmarkItems = bookmarkData.items;
  const items = bookmarkItems.length
    ? mergePortalItems(customPortals, bookmarkItems)
    : mergePortalItems(customPortals, PORTALS);

  return {
    items,
    usingBookmarks: bookmarkItems.length > 0
  };
}

async function loadBookmarkPortalItems() {
  if (!chrome.bookmarks?.getTree) {
    return {
      items: []
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
      items: bookmarkEntriesToPortalItems(entries, historyStats)
    };
  } catch (error) {
    console.warn("Failed to load bookmark shortcuts", error);
    return {
      items: []
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

function createPortalClassificationModule(groups, options = {}) {
  const module = document.createElement("section");
  module.className = "portal-classification-module";
  groups.forEach((group) => {
    const isExpanded = portalCategoryState[group.category]?.expanded !== false;
    const section = createPortalCategorySection({
      ...group,
      collapsible: group.items.length > 0,
      classification: true,
      expanded: isExpanded,
      favoriteKeys: options.favoriteKeys,
      favoriteIconMap: options.favoriteIconMap,
      iconRenders: options.iconRenders
    });
    module.appendChild(section);
  });
  return module;
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
  const divider = document.createElement("span");
  const headingActions = document.createElement("span");
  const grid = document.createElement("div");
  const visibleItems = group.featured
    ? group.items.slice(0, MAX_PORTAL_FEATURED_ITEMS)
    : group.items;
  const hiddenCount = group.classification ? visibleItems.length : 0;
  const isExpanded = group.expanded !== false || hiddenCount === 0;

  section.className = "portal-category";
  section.classList.toggle("featured-category", Boolean(group.featured));
  section.classList.toggle("expanded", isExpanded);
  section.classList.toggle("collapsed", !isExpanded);
  section.classList.toggle("classification-category", Boolean(group.classification));
  section.dataset.hiddenCount = String(hiddenCount);
  section.dataset.category = group.category;
  header.className = "portal-category-header";
  title.className = "portal-category-title";
  title.textContent = portalCategoryLabel(group.category);
  divider.className = "portal-category-line";
  divider.setAttribute("aria-hidden", "true");
  grid.className = "portal-category-grid";
  if (group.featured) {
    grid.id = "featuredPortalGrid";
  } else {
    grid.id = `portalCategoryGrid-${group.category}`;
  }
  visibleItems.forEach((portal, index) => {
    const card = createSiteCard(portal, {
      favoriteKeys: group.favoriteKeys,
      favoriteIconMap: group.favoriteIconMap,
      iconRenders: group.iconRenders
    });
    grid.appendChild(card);
  });
  headingActions.className = "portal-category-actions";
  if (group.classification) {
    const toggleButton = document.createElement("button");
    const toggleLabel = document.createElement("span");
    const toggleIcon = document.createElement("span");
    const isClassificationExpanded = isExpanded;
    toggleButton.className = "portal-category-toggle";
    toggleButton.type = "button";
    toggleButton.hidden = !group.collapsible;
    toggleButton.setAttribute("aria-controls", grid.id);
    toggleButton.setAttribute("aria-expanded", String(isClassificationExpanded));
    toggleLabel.className = "portal-switcher-toggle-label";
    toggleLabel.textContent = isClassificationExpanded
      ? t("portalCategoriesCollapse")
      : t("portalCategoriesExpand");
    toggleIcon.className = "portal-category-toggle-icon";
    toggleIcon.setAttribute("aria-hidden", "true");
    toggleIcon.innerHTML = isClassificationExpanded ? chevronUpIcon() : chevronDownIcon();
    toggleButton.append(toggleLabel, toggleIcon);
    toggleButton.addEventListener("click", () => togglePortalCategoryExpanded(group.category));
    headingActions.appendChild(toggleButton);
  }
  header.append(title, divider, headingActions);
  section.append(header, grid);
  return section;
}

function portalCategoryLabel(category) {
  if (category === "featured") {
    return t("portalCategoryFeatured");
  }
  const messageKey = `portalCategory${category.charAt(0).toUpperCase()}${category.slice(1)}`;
  return t(messageKey);
}

function populatePortalCategoryOptions() {
  const categories = PORTAL_CATEGORY_ORDER.filter((category) => category !== "featured");
  const currentCategory = normalizePortalCategory(portalCategorySelect.value);
  portalCategorySelect.replaceChildren(...categories.map((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = portalCategoryLabel(category);
    return option;
  }));
  renderPortalCategoryPickerOptions(categories);
  setPortalCategory(categories.includes(currentCategory) ? currentCategory : "custom");
}

function renderPortalCategoryPickerOptions(categories) {
  if (!portalCategoryList) {
    return;
  }
  portalCategoryList.replaceChildren(...categories.map((category) => {
    const option = document.createElement("button");
    option.className = "portal-category-option";
    option.type = "button";
    option.setAttribute("role", "option");
    option.dataset.category = category;
    option.id = `portalCategoryOption-${category}`;
    option.textContent = portalCategoryLabel(category);
    option.addEventListener("pointerdown", (event) => {
      event.preventDefault();
    });
    return option;
  }));
}

function setPortalCategory(category, options = {}) {
  const nextCategory = normalizePortalCategory(category);
  portalCategorySelect.value = nextCategory;
  if (portalCategoryCurrent) {
    portalCategoryCurrent.textContent = portalCategoryLabel(nextCategory);
  }
  portalCategoryList?.querySelectorAll(".portal-category-option").forEach((option) => {
    const isSelected = option.dataset.category === nextCategory;
    option.setAttribute("aria-selected", String(isSelected));
    option.tabIndex = isSelected ? 0 : -1;
  });
  portalCategoryTrigger?.setAttribute("aria-activedescendant", `portalCategoryOption-${nextCategory}`);
  if (options.focus) {
    portalCategoryTrigger?.focus({ preventScroll: true });
  }
}

function togglePortalCategoryPicker() {
  if (portalCategoryPicker?.classList.contains("open")) {
    closePortalCategoryPicker({ restoreFocus: true });
  } else {
    openPortalCategoryPicker();
  }
}

function openPortalCategoryPicker() {
  if (!portalCategoryPicker || !portalCategoryTrigger || !portalCategoryList) {
    return;
  }
  portalCategoryPicker.classList.add("open");
  portalCategoryTrigger.setAttribute("aria-expanded", "true");
  portalCategoryList.hidden = false;
  const selectedOption = portalCategoryList.querySelector('[aria-selected="true"]');
  if (selectedOption instanceof HTMLElement) {
    selectedOption.focus({ preventScroll: true });
  }
}

function closePortalCategoryPicker(options = {}) {
  if (!portalCategoryPicker || !portalCategoryTrigger || !portalCategoryList) {
    return;
  }
  portalCategoryPicker.classList.remove("open");
  portalCategoryTrigger.setAttribute("aria-expanded", "false");
  portalCategoryList.hidden = true;
  if (options.restoreFocus) {
    portalCategoryTrigger.focus({ preventScroll: true });
  }
}

function handlePortalCategoryOptionClick(event) {
  const option = event.target.closest?.(".portal-category-option");
  if (!option) {
    return;
  }
  setPortalCategory(option.dataset.category, { focus: true });
  closePortalCategoryPicker();
}

function handlePortalCategoryListKeydown(event) {
  const options = [...portalCategoryList.querySelectorAll(".portal-category-option")];
  const currentIndex = options.findIndex((option) => option === document.activeElement);
  if (event.key === "Escape") {
    event.preventDefault();
    event.stopPropagation();
    closePortalCategoryPicker({ restoreFocus: true });
    return;
  }
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    event.stopPropagation();
    const currentOption = options[currentIndex];
    if (currentOption) {
      setPortalCategory(currentOption.dataset.category, { focus: true });
      closePortalCategoryPicker();
    }
    return;
  }
  if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
    return;
  }
  event.preventDefault();
  const lastIndex = options.length - 1;
  const nextIndex = event.key === "Home"
    ? 0
    : event.key === "End"
      ? lastIndex
      : event.key === "ArrowUp"
        ? Math.max(0, currentIndex - 1)
        : Math.min(lastIndex, currentIndex + 1);
  options[nextIndex]?.focus({ preventScroll: true });
}

function handlePortalCategoryPickerDismiss(event) {
  if (!portalCategoryPicker?.classList.contains("open")) {
    return;
  }
  const target = event.target;
  if (target instanceof Element && portalCategoryPicker.contains(target)) {
    return;
  }
  closePortalCategoryPicker();
}

function favoriteSiteIconMap(sites = []) {
  const iconMap = new Map();
  for (const site of sites) {
    const key = firstPaintIconCacheKey(site);
    const icon = normalizeStoredSiteIcon(site?.icon || "");
    if (key && icon && !iconMap.has(key)) {
      iconMap.set(key, icon);
    }
  }
  return iconMap;
}

function siteWithFavoriteIcon(site, favoriteIconMap = new Map()) {
  const icon = normalizeStoredSiteIcon(site?.icon || "");
  if (icon) {
    return site;
  }
  const favoriteIcon = favoriteIconMap.get(firstPaintIconCacheKey(site));
  return favoriteIcon ? { ...site, icon: favoriteIcon } : site;
}

function renderSharedSiteIcon(icon, site, options = {}) {
  const iconSite = site?.recommended ? site : siteWithFavoriteIcon(site, options.favoriteIconMap);
  const cachedIconRender = site?.recommended ? null : WayleafIcon.cachedFirstPaintIconRender(options.iconRenders, iconSite);
  if (cachedIconRender) {
    WayleafIcon.restoreFirstPaintIconRender(icon, iconSite, cachedIconRender);
    return;
  }
  WayleafIcon.applySiteIcon(icon, iconSite);
}

function renderHistorySiteIcon(icon, site, options = {}) {
  renderSharedSiteIcon(icon, site, options);
  WayleafIcon.cacheRenderedSiteIconOnLoad(icon, site);
}

function renderBookmarkSiteIcon(icon, site, options = {}) {
  const iconSite = siteWithFavoriteIcon(site, options.favoriteIconMap);
  const cachedIconRender = WayleafIcon.cachedFirstPaintIconRender(options.iconRenders, iconSite);
  if (cachedIconRender) {
    WayleafIcon.restoreFirstPaintIconRender(icon, iconSite, cachedIconRender);
  } else {
    WayleafIcon.applyBookmarkSiteIcon(icon, iconSite);
  }
  WayleafIcon.cacheRenderedSiteIconOnLoad(icon, iconSite);
}

function createSiteCard(site, options = {}, renderIcon = renderSharedSiteIcon) {
  const node = siteCardTemplate.content.firstElementChild.cloneNode(true);
  const link = node.querySelector(".site-link");
  const icon = node.querySelector(".site-icon");
  const domain = node.querySelector(".site-domain");
  const removeButton = node.querySelector(".site-remove");
  link.href = site.url;
  renderIcon(icon, site, options);
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
  if (options.allowFavorite !== false) {
    appendFavoriteTargetButton(node, site, options.favoriteKeys);
  }
  return node;
}

function appendFavoriteTargetButton(node, site, favoriteKeys = new Set()) {
  if (!canAddBookmarkSiteToFavorites(site, favoriteKeys)) {
    return;
  }
  const favoriteButton = document.createElement("button");
  favoriteButton.className = "site-favorite-button";
  favoriteButton.type = "button";
  favoriteButton.innerHTML = plusIcon();
  setButtonLabel(favoriteButton, t("addBookmarkToFavorites", { title: site.title }));
  favoriteButton.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await addBookmarkSiteToFavorites(site);
  });
  node.classList.add("favorite-target-available");
  node.appendChild(favoriteButton);
}

async function renderFavoriteSites() {
  clearFavoriteDeleteMode();
  const favorites = await loadFavoriteSites();
  if (onboardingPreviewActive) {
    return;
  }
  writeFirstPaintCache({ favoriteSites: favorites });
  await renderFavoriteSiteList(favorites, { iconRenders: readFirstPaintCache().iconRenders });
}

async function renderFavoriteSiteList(favorites, options = {}) {
  const previousState = captureFavoriteReorderState();
  const shouldAnimateReorder = favoriteSitesHydrated;
  const fragment = document.createDocumentFragment();
  const favoriteNodes = await Promise.all(favorites.map((site, index) => createFavoriteSite(site, index, {
    awaitDisplayIcon: false,
    cachedIconRender: WayleafIcon.cachedFirstPaintIconRender(options.iconRenders, site)
  })));
  favoriteNodes.forEach((node) => fragment.appendChild(node));
  favoriteStrip.replaceChildren(fragment);
  updateFavoriteAddButtonState(favorites.length);
  if (!favoriteSitesHydrated) {
    favoriteSitesHydrated = true;
    requestAnimationFrame(() => {
      favoriteStrip.dataset.hydrating = "false";
      favoriteAddButton.dataset.hydrating = "false";
    });
  }
  if (shouldAnimateReorder) {
    animateFavoriteReorder(previousState);
  }
}

async function renderFavoriteDependentSurfaces(options = {}) {
  await renderFavoriteSites();
  clearBookmarkFolderViewCache();
  if (bookmarkPicker?.hidden) {
    if (options.preserveBookmarkScroll) {
      await rerenderBookmarkGridPreservingScroll();
    } else if (activePortalView === "bookmarks" || activeSurfacePanelId === "portalPanel") {
      await renderSelectedBookmarkFolder();
    }
  }
}

function updateFavoriteAddButtonState(favoriteCount) {
  const isFull = favoriteCount >= MAX_FAVORITE_SITES;
  favoriteAddButton.disabled = isFull;
  favoriteAddButton.setAttribute("aria-hidden", String(isFull));
  favoriteAddButton.tabIndex = isFull ? -1 : 0;
  favoriteAddButton.dataset.state = isFull ? "hidden" : "visible";
  favoriteAddButton.hidden = isFull;
  if (bookmarkFavoriteAddButton) {
    bookmarkFavoriteAddButton.hidden = true;
    bookmarkFavoriteAddButton.disabled = true;
    bookmarkFavoriteAddButton.setAttribute("aria-hidden", "true");
    bookmarkFavoriteAddButton.tabIndex = -1;
  }
  if (isFull && !favoriteForm.hidden) {
    hideFavoriteForm();
  }
}

async function createFavoriteSite(site, index, options = {}) {
  const node = favoriteSiteTemplate.content.firstElementChild.cloneNode(true);
  const link = node.querySelector(".favorite-link");
  const icon = node.querySelector(".favorite-icon");
  const removeButton = node.querySelector(".favorite-remove");
  node.dataset.favoriteId = site.id;
  node.dataset.flipId = `favorite-${site.id}`;
  link.href = site.url;
  link.setAttribute("aria-label", site.title || compactSiteDomain(site.url));
  if (options.cachedIconRender) {
    WayleafIcon.restoreFirstPaintIconRender(icon, site, options.cachedIconRender);
  } else if (options.awaitDisplayIcon) {
    await WayleafIcon.applySiteIcon(icon, site, { awaitDisplayIcon: true });
  } else {
    WayleafIcon.applySiteIcon(icon, site);
  }
  WayleafIcon.cacheRenderedSiteIconOnLoad(icon, site);
  icon.alt = "";
  setButtonLabel(removeButton, t("deleteFavoriteSite"));
  removeButton.innerHTML = closeIcon();
  removeButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    removeFavoriteSite(site.id, node);
  });
  installFavoriteLongPress(node);
  node.style.setProperty("--favorite-index", String(index));
  return node;
}

function captureFavoriteReorderState() {
  const flip = getGsapFlip();
  if (flip && favoriteStrip.querySelector(".favorite-site")) {
    return {
      type: "flip",
      state: flip.Flip.getState([...favoriteStrip.querySelectorAll(".favorite-site")])
    };
  }
  return new Map([...favoriteStrip.querySelectorAll(".favorite-site")].map((node) => [
    node.dataset.favoriteId,
    node.getBoundingClientRect()
  ]));
}

function animateFavoriteReorder(previousState) {
  if (!previousState || (!previousState.state && !previousState.size)) {
    return;
  }
  const flip = getGsapFlip();
  if (flip && previousState.type === "flip") {
    flip.Flip.from(previousState.state, {
      duration: gsapDuration(FAVORITE_REORDER_MS),
      ease: "power3.out",
      absolute: true,
      simple: true,
      stagger: 0.018,
      onComplete() {
        flip.gsap.set(".favorite-site", { clearProps: "transform" });
      }
    });
    return;
  }
  favoriteStrip.querySelectorAll(".favorite-site").forEach((node) => {
    const previous = previousState.get(node.dataset.favoriteId);
    if (!previous) {
      return;
    }
    const next = node.getBoundingClientRect();
    const deltaX = previous.left - next.left;
    const deltaY = previous.top - next.top;
    if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5) {
      return;
    }
    node.animate([
      { transform: `translate(${deltaX}px, ${deltaY}px)` },
      { transform: "translate(0, 0)" }
    ], {
      duration: FAVORITE_REORDER_MS,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)"
    });
  });
}

function installFavoriteLongPress(node) {
  let holdTimer = 0;
  let suppressNextClick = false;
  const clearHold = () => {
    window.clearTimeout(holdTimer);
    holdTimer = 0;
    node.classList.remove("pressing");
  };
  node.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.target.closest(".favorite-remove")) {
      return;
    }
    clearFavoriteDeleteMode();
    node.classList.add("pressing");
    holdTimer = window.setTimeout(() => {
      node.classList.remove("pressing");
      node.classList.add("delete-ready");
      suppressNextClick = true;
      activeFavoriteDeleteCard = node;
    }, 650);
  });
  node.addEventListener("pointerup", clearHold);
  node.addEventListener("pointercancel", clearHold);
  node.addEventListener("pointerleave", clearHold);
  node.querySelector(".favorite-link")?.addEventListener("click", (event) => {
    if (!node.classList.contains("delete-ready") && !suppressNextClick) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    suppressNextClick = false;
  });
}

function handleFavoriteDeleteDismiss(event) {
  if (!activeFavoriteDeleteCard) {
    return;
  }
  const target = event.target;
  if (target instanceof Element && activeFavoriteDeleteCard.contains(target)) {
    return;
  }
  clearFavoriteDeleteMode();
}

function clearFavoriteDeleteMode() {
  if (!activeFavoriteDeleteCard) {
    return;
  }
  const node = activeFavoriteDeleteCard;
  activeFavoriteDeleteCard = null;
  node.classList.remove("pressing");
  if (node.classList.contains("delete-ready") && !node.classList.contains("removing")) {
    node.classList.add("clearing");
    window.setTimeout(() => node.classList.remove("clearing"), FAVORITE_DELETE_CANCEL_MS);
  }
  node.classList.remove("delete-ready");
}

function toggleFavoriteForm() {
  if (favoriteForm.hidden) {
    showFavoriteForm();
  } else {
    hideFavoriteForm();
  }
}

function showFavoriteForm() {
  if (favoriteAddButton.disabled) {
    return;
  }
  favoriteForm.hidden = false;
  favoriteAddButton.setAttribute("aria-expanded", "true");
  favoriteFormError.textContent = "";
  favoriteUrlInput.focus();
}

function hideFavoriteForm() {
  favoriteForm.hidden = true;
  favoriteAddButton.setAttribute("aria-expanded", "false");
  favoriteForm.reset();
  favoriteFormError.textContent = "";
}

async function handleFavoriteSubmit(event) {
  event.preventDefault();
  favoriteFormError.textContent = "";
  const url = normalizePortalUrl(favoriteUrlInput.value);
  if (!url) {
    favoriteFormError.textContent = t("portalUrlRequired");
    favoriteUrlInput.focus();
    return;
  }
  const favorites = await loadFavoriteSites();
  const favoriteKey = favoriteSiteKey(url);
  if (!favoriteKey) {
    favoriteFormError.textContent = t("portalUrlRequired");
    favoriteUrlInput.focus();
    return;
  }
  if (favoriteSiteKeySet(favorites).has(favoriteKey)) {
    favoriteFormError.textContent = t("favoriteSiteExists", { title: favoriteSiteTitleFromUrl(url) });
    favoriteUrlInput.focus();
    return;
  }
  if (favorites.length >= MAX_FAVORITE_SITES) {
    favoriteFormError.textContent = t("favoriteSiteLimit", { count: MAX_FAVORITE_SITES });
    return;
  }
  favorites.push({
    id: String(Date.now()),
    title: favoriteSiteTitleFromUrl(url),
    url: favoriteKey,
    icon: await WayleafIcon.discoverFavoriteSiteIcon(favoriteKey)
  });
  await saveFavoriteSites(favorites);
  hideFavoriteForm();
  await renderFavoriteDependentSurfaces();
}

async function loadFavoriteSites() {
  try {
    const result = await getStoredValues({ [FAVORITE_SITES_STORAGE_KEY]: [] });
    const parsed = result[FAVORITE_SITES_STORAGE_KEY];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .filter((site) => site?.url && isWebUrl(site.url))
      .slice(0, MAX_FAVORITE_SITES)
      .map((site) => ({
        id: String(site.id || site.url),
        title: normalizeText(site.title) || compactSiteDomain(site.url),
        url: site.url,
        icon: normalizeStoredSiteIcon(site.icon)
      }));
  } catch {
    return [];
  }
}

async function saveFavoriteSites(sites) {
  await setStoredValues({ [FAVORITE_SITES_STORAGE_KEY]: sites.slice(0, MAX_FAVORITE_SITES) });
}


function showPortalForm() {
  portalForm.hidden = false;
  togglePortalFormButton.hidden = true;
  togglePortalFormButton.setAttribute("aria-expanded", "true");
  portalFormError.textContent = "";
  portalTitleInput.focus();
}

function hidePortalForm() {
  portalForm.hidden = true;
  togglePortalFormButton.hidden = activePortalView === "bookmarks";
  togglePortalFormButton.setAttribute("aria-expanded", "false");
  portalForm.reset();
  setPortalCategory("custom");
  closePortalCategoryPicker();
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
    const result = await getStoredValues({ [CUSTOM_PORTALS_STORAGE_KEY]: [] });
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
  await setStoredValues({ [CUSTOM_PORTALS_STORAGE_KEY]: portals });
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

async function renderSelectedBookmarkFolder(selectedFolderId) {
  const renderRequestId = ++bookmarkRenderRequestId;
  try {
    clearBookmarkDeleteMode();
    clearRecentBookmarkExpiryTimer();
    const folderId = typeof selectedFolderId === "undefined"
      ? await loadSelectedBookmarkFolderId()
      : selectedFolderId;
    if (renderRequestId !== bookmarkRenderRequestId) {
      return;
    }
    activateCachedBookmarkFolderView(folderId);
    await renderBookmarkFolderLane(folderId, renderRequestId);
    if (renderRequestId !== bookmarkRenderRequestId) {
      return;
    }
    if (!folderId) {
      latestBookmarkFolder = null;
      latestBookmarkSites = [];
      latestBookmarkRenderContext = null;
      bookmarkSearchInput.disabled = true;
      renderBookmarkEmptyState(t("bookmarkNoFolder"));
      return;
    }

    const folder = await loadBookmarkFolder(folderId);
    if (renderRequestId !== bookmarkRenderRequestId) {
      return;
    }
    if (!folder) {
      await saveSelectedBookmarkFolderId("");
      latestBookmarkFolder = null;
      latestBookmarkSites = [];
      latestBookmarkRenderContext = null;
      bookmarkSearchInput.disabled = true;
      await renderBookmarkFolderLane("", renderRequestId);
      renderBookmarkEmptyState(t("bookmarkFolderMissing"));
      return;
    }

    const children = await chrome.bookmarks.getChildren(folder.id);
    if (renderRequestId !== bookmarkRenderRequestId) {
      return;
    }
    const sites = children
      .filter((item) => item.url && isWebUrl(item.url))
      .map((item) => ({
        bookmarkId: item.id,
        title: siteDisplayName(safeUrl(item.url), item.title),
        url: item.url,
        dateAdded: Number(item.dateAdded || 0)
      }));
    const favoriteSites = await loadFavoriteSites();
    if (renderRequestId !== bookmarkRenderRequestId) {
      return;
    }
    const favoriteKeys = favoriteSiteKeySet(favoriteSites);
    const favoriteIconMap = favoriteSiteIconMap(favoriteSites);
    const iconRenders = readFirstPaintCache().iconRenders;

    latestBookmarkFolder = folder;
    latestBookmarkSites = sites;
    latestBookmarkRenderContext = { favoriteKeys, favoriteIconMap, iconRenders };
    bookmarkSearchInput.disabled = false;
    await renderVisibleBookmarkSites(renderRequestId);
  } catch (error) {
    if (renderRequestId !== bookmarkRenderRequestId) {
      return;
    }
    console.warn("Failed to load bookmarks", error);
    renderBookmarkEmptyState(t("bookmarkReadFailed"));
  }
}

async function renderBookmarkFolderLane(selectedId, renderRequestId = 0) {
  try {
    const folders = flattenBookmarkFolders(await chrome.bookmarks.getTree())
      .filter((folder) => folder.bookmarkCount > 0)
      .slice(0, MAX_BOOKMARK_FOLDER_OPTIONS);
    if (renderRequestId && renderRequestId !== bookmarkRenderRequestId) {
      return;
    }
    const fragment = document.createDocumentFragment();
    let activeButton = null;
    folders.forEach((folder) => {
      const button = document.createElement("button");
      button.className = "bookmark-folder-chip";
      button.classList.toggle("active", folder.id === selectedId);
      button.type = "button";
      button.setAttribute("aria-pressed", String(folder.id === selectedId));
      button.title = `${folder.path} · ${t("bookmarkCount", { count: folder.bookmarkCount })}`;
      button.textContent = folder.title || t("unnamedFolder");
      button.addEventListener("click", () => selectBookmarkFolder(folder.id));
      if (folder.id === selectedId) {
        activeButton = button;
      }
      fragment.appendChild(button);
    });
    bookmarkFolderLane.replaceChildren(fragment);
    activeButton?.scrollIntoView({ block: "nearest", inline: "nearest" });
  } catch (error) {
    if (renderRequestId && renderRequestId !== bookmarkRenderRequestId) {
      return;
    }
    console.warn("Failed to load bookmark folder lane", error);
    bookmarkFolderLane.replaceChildren();
  }
}

async function renderVisibleBookmarkSites(renderRequestId = ++bookmarkRenderRequestId) {
  const folder = latestBookmarkFolder;
  const context = latestBookmarkRenderContext;
  if (!folder || !context) {
    return;
  }
  clearBookmarkDeleteMode();
  clearRecentBookmarkExpiryTimer();
  const query = normalizeText(bookmarkSearchInput.value).toLocaleLowerCase(LOCALE);
  const filteredSites = latestBookmarkSites.filter((site) => {
    if (!query) {
      return true;
    }
    return `${site.title} ${compactSiteDomain(site.url)}`.toLocaleLowerCase(LOCALE).includes(query);
  });
  bookmarkFolderMeta.textContent = t("bookmarkMeta", {
    folder: folder.title || t("unnamedFolder"),
    count: filteredSites.length
  });
  if (!filteredSites.length) {
    const view = createBookmarkFolderView(emptyState(query ? t("bookmarkSearchEmpty") : t("bookmarkEmpty")));
    activateBookmarkFolderView(view);
    return;
  }

  const viewCacheKey = bookmarkFolderViewCacheKey(folder, query);
  const cachedView = bookmarkFolderViewCache.get(viewCacheKey);
  if (cachedView) {
    bookmarkFolderViewCache.delete(viewCacheKey);
    bookmarkFolderViewCache.set(viewCacheKey, cachedView);
    bookmarkFolderMeta.textContent = cachedView.meta;
    latestBookmarkRenderContext = { ...context, iconRenders: readFirstPaintCache().iconRenders };
    activateBookmarkFolderView(cachedView.node);
    return;
  }

  const visibleSites = filteredSites.slice().sort(bookmarkSortSelect.value === "title"
    ? compareBookmarkSites
    : compareRecentBookmarkSites);
  const { recentSites } = partitionRecentBookmarkSites(filteredSites);
  const fragment = document.createDocumentFragment();
  if (!query && recentSites.length) {
    fragment.appendChild(createRecentBookmarkSection(recentSites.slice(0, 3), context));
    scheduleRecentBookmarkExpiry(recentSites);
  }
  fragment.appendChild(createBookmarkSection({
    className: "bookmark-main-section",
    title: folder.title || t("unnamedFolder"),
    meta: t("bookmarkCount", { count: filteredSites.length }),
    items: visibleSites,
    ...context
  }));
  const prepared = await prepareBookmarkRouteFragment(fragment);
  if (renderRequestId === bookmarkRenderRequestId) {
    latestBookmarkRenderContext = { ...context, iconRenders: readFirstPaintCache().iconRenders };
    const view = createBookmarkFolderView(prepared, viewCacheKey);
    activateBookmarkFolderView(view);
    rememberBookmarkFolderView(viewCacheKey, view);
  }
}

function bookmarkFolderViewCacheKey(folder, query) {
  return query ? "" : `${folder.id || ""}:${bookmarkSortSelect.value}:${LOCALE}`;
}

function activateCachedBookmarkFolderView(folderId) {
  if (!folderId || normalizeText(bookmarkSearchInput.value)) {
    return false;
  }
  const key = `${folderId}:${bookmarkSortSelect.value}:${LOCALE}`;
  const cachedView = bookmarkFolderViewCache.get(key);
  if (!cachedView) {
    return false;
  }
  bookmarkFolderViewCache.delete(key);
  bookmarkFolderViewCache.set(key, cachedView);
  bookmarkFolderMeta.textContent = cachedView.meta;
  activateBookmarkFolderView(cachedView.node);
  return true;
}

function createBookmarkFolderView(content, key = "") {
  const view = document.createElement("div");
  view.className = "bookmark-folder-view";
  view.dataset.bookmarkFolderView = key || "transient";
  if (typeof content === "string") {
    view.innerHTML = content;
  } else {
    view.appendChild(content);
  }
  return view;
}

function activateBookmarkFolderView(view) {
  bookmarkGrid.querySelectorAll(":scope > .bookmark-folder-view").forEach((cachedView) => {
    if (cachedView === view) {
      return;
    }
    if (cachedView.dataset.bookmarkFolderView === "transient") {
      cachedView.remove();
      return;
    }
    cachedView.hidden = true;
  });
  if (view.parentElement !== bookmarkGrid) {
    bookmarkGrid.appendChild(view);
  }
  view.hidden = false;
}

function rememberBookmarkFolderView(key, view) {
  if (!key) {
    return;
  }
  bookmarkFolderViewCache.delete(key);
  bookmarkFolderViewCache.set(key, {
    meta: bookmarkFolderMeta.textContent,
    node: view
  });
  while (bookmarkFolderViewCache.size > BOOKMARK_FOLDER_VIEW_CACHE_LIMIT) {
    const oldestKey = bookmarkFolderViewCache.keys().next().value;
    bookmarkFolderViewCache.get(oldestKey)?.node.remove();
    bookmarkFolderViewCache.delete(oldestKey);
  }
}

function clearBookmarkFolderViewCache() {
  bookmarkFolderViewCache.forEach((view) => view.node.remove());
  bookmarkFolderViewCache.clear();
}

async function prepareBookmarkRouteFragment(fragment, iconSelector = ".bookmark-site-card img.site-icon") {
  const staging = document.createElement("div");
  staging.style.position = "fixed";
  staging.style.inset = "0 auto auto -10000px";
  staging.style.width = "1px";
  staging.style.height = "1px";
  staging.style.overflow = "hidden";
  staging.style.opacity = "0";
  staging.style.pointerEvents = "none";
  staging.setAttribute("aria-hidden", "true");
  staging.appendChild(fragment);
  document.body.appendChild(staging);
  try {
    trackBookmarkRouteIconCache(staging, iconSelector);
    const ready = document.createDocumentFragment();
    ready.append(...staging.childNodes);
    return ready;
  } finally {
    staging.remove();
  }
}

function trackBookmarkRouteIconCache(root, iconSelector) {
  root.querySelectorAll(iconSelector).forEach((icon) => {
    cacheBookmarkRouteIconWhenSettled(icon);
  });
}

function bookmarkRouteIconSettled(icon) {
  if (!icon.isConnected) {
    return false;
  }
  if (icon.dataset.iconDefaultProbe === "pending" || icon.dataset.iconDefaultRescue === "pending") {
    return false;
  }
  if (["primary_pending", "primary_miss", "secondary_pending"].includes(icon.dataset.iconRouteState || "")) {
    return false;
  }
  return Boolean(icon.getAttribute("src")) && (icon.complete || icon.dataset.iconMissing === "true");
}

function cacheBookmarkRouteIconWhenSettled(icon) {
  let observer = null;
  let quietTimer = 0;
  let timeoutTimer = 0;
  let finished = false;
  const cleanup = () => {
    window.clearTimeout(quietTimer);
    window.clearTimeout(timeoutTimer);
    observer?.disconnect();
    icon.removeEventListener("load", check);
    icon.removeEventListener("error", check);
  };
  const cache = () => {
    if (finished) {
      return;
    }
    finished = true;
    cleanup();
    WayleafIcon.cacheRenderedSiteIcon(icon, {
      title: icon.dataset.siteTitle || icon.alt || "",
      url: icon.dataset.siteUrl || ""
    });
    if (latestBookmarkRenderContext) {
      latestBookmarkRenderContext = { ...latestBookmarkRenderContext, iconRenders: readFirstPaintCache().iconRenders };
    }
  };
  const check = () => {
    window.clearTimeout(quietTimer);
    if (bookmarkRouteIconSettled(icon)) {
      quietTimer = window.setTimeout(cache, BOOKMARK_ICON_RENDER_QUIET_MS);
    }
  };
  observer = new MutationObserver(check);
  observer.observe(icon, {
    attributes: true,
    attributeFilter: [
      "src",
      "class",
      "style",
      "data-icon-candidate",
      "data-icon-source",
      "data-icon-tile",
      "data-icon-route-state",
      "data-icon-default-probe",
      "data-icon-default-rescue",
      "data-icon-fused-tile",
      "data-icon-missing",
      "data-remote-brand-icon-request"
    ]
  });
  icon.addEventListener("load", check);
  icon.addEventListener("error", check);
  timeoutTimer = window.setTimeout(cleanup, BOOKMARK_ICON_RENDER_SETTLE_TIMEOUT_MS);
  check();
}

function renderBookmarkEmptyState(message) {
  clearRecentBookmarkExpiryTimer();
  bookmarkFolderMeta.textContent = "";
  const view = createBookmarkFolderView(emptyState(message));
  activateBookmarkFolderView(view);
}

function partitionRecentBookmarkSites(sites) {
  const recentCutoff = Date.now() - RECENT_BOOKMARK_LOOKBACK_MS;
  return sites.reduce((groups, site) => {
    if (isRecentBookmarkSite(site, recentCutoff)) {
      groups.recentSites.push(site);
    } else {
      groups.groupedSites.push(site);
    }
    return groups;
  }, { recentSites: [], groupedSites: [] });
}

function isRecentBookmarkSite(site, recentCutoff) {
  return Number.isFinite(site.dateAdded)
    && site.dateAdded > recentCutoff
    && site.dateAdded <= Date.now();
}

function createRecentBookmarkSection(sites, options = {}) {
  return createBookmarkSection({
    className: "bookmark-recent-section",
    title: t("bookmarkRecentTitle"),
    meta: t("bookmarkRecentMeta"),
    items: sites.slice().sort(compareRecentBookmarkSites),
    ...options
  });
}

function compareRecentBookmarkSites(siteA, siteB) {
  return Number(siteB.dateAdded || 0) - Number(siteA.dateAdded || 0)
    || compareBookmarkSites(siteA, siteB);
}

function scheduleRecentBookmarkExpiry(recentSites) {
  clearRecentBookmarkExpiryTimer();
  const nextExpiry = recentSites.reduce((earliest, site) => {
    const expiresAt = Number(site.dateAdded || 0) + RECENT_BOOKMARK_LOOKBACK_MS;
    if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
      return earliest;
    }
    return Math.min(earliest, expiresAt);
  }, Number.POSITIVE_INFINITY);
  if (!Number.isFinite(nextExpiry)) {
    return;
  }
  recentBookmarkExpiryTimer = window.setTimeout(() => {
    renderSelectedBookmarkFolder();
  }, Math.max(1000, nextExpiry - Date.now() + 250));
}

function clearRecentBookmarkExpiryTimer() {
  if (!recentBookmarkExpiryTimer) {
    return;
  }
  clearTimeout(recentBookmarkExpiryTimer);
  recentBookmarkExpiryTimer = 0;
}

function groupBookmarkSitesByInitial(sites) {
  const groups = new Map();
  sites.forEach((site) => {
    const initial = bookmarkInitialForSite(site);
    if (!groups.has(initial)) {
      groups.set(initial, []);
    }
    groups.get(initial).push(site);
  });

  return [...groups.entries()]
    .sort(([initialA], [initialB]) => bookmarkInitialSortValue(initialA) - bookmarkInitialSortValue(initialB))
    .map(([initial, items]) => ({
      initial,
      items: items.sort(compareBookmarkSites)
    }));
}

function bookmarkInitialForSite(site) {
  return firstBookmarkTitleInitial(site.title) || "#";
}

function firstBookmarkTitleInitial(value) {
  for (const character of normalizeText(value)) {
    if (isAsciiLetter(character)) {
      return character.toUpperCase();
    }
    if (isHanCharacter(character)) {
      return chinesePinyinInitial(character);
    }
  }
  return "";
}

function isAsciiLetter(character) {
  return /^[a-z]$/i.test(character);
}

function isHanCharacter(character) {
  return /[\u3400-\u9FFF\uF900-\uFAFF]/u.test(character);
}

const CHINESE_PINYIN_INITIAL_BOUNDARIES = Object.freeze([
  ["A", "阿"],
  ["B", "八"],
  ["C", "嚓"],
  ["D", "搭"],
  ["E", "讹"],
  ["F", "发"],
  ["G", "噶"],
  ["H", "哈"],
  ["J", "击"],
  ["K", "喀"],
  ["L", "垃"],
  ["M", "妈"],
  ["N", "拿"],
  ["O", "哦"],
  ["P", "啪"],
  ["Q", "期"],
  ["R", "然"],
  ["S", "撒"],
  ["T", "他"],
  ["W", "挖"],
  ["X", "昔"],
  ["Y", "压"],
  ["Z", "匝"]
]);
const CHINESE_PINYIN_COLLATOR = new Intl.Collator("zh-Hans-u-co-pinyin", { sensitivity: "base" });

function chinesePinyinInitial(character) {
  let initial = "#";
  for (const [letter, boundary] of CHINESE_PINYIN_INITIAL_BOUNDARIES) {
    if (CHINESE_PINYIN_COLLATOR.compare(character, boundary) < 0) {
      break;
    }
    initial = letter;
  }
  return initial;
}

function bookmarkInitialSortValue(initial) {
  if (/^[A-Z]$/.test(initial)) {
    return initial.charCodeAt(0) - 65;
  }
  return 26;
}

function compareBookmarkSites(siteA, siteB) {
  return siteA.title.localeCompare(siteB.title, navigator.language || "en", { sensitivity: "base" })
    || compactSiteDomain(siteA.url).localeCompare(compactSiteDomain(siteB.url), "en", { sensitivity: "base" });
}

function createBookmarkInitialSection(group, options = {}) {
  return createBookmarkSection({
    className: "bookmark-letter-section",
    initial: group.initial,
    title: group.initial,
    items: group.items,
    ...options
  });
}

function createBookmarkSection({
  className,
  initial = "",
  title,
  meta = "",
  items,
  favoriteKeys = new Set(),
  favoriteIconMap,
  iconRenders
}) {
  const section = document.createElement("section");
  const header = document.createElement("header");
  const heading = document.createElement("h3");
  const divider = document.createElement("span");
  const grid = document.createElement("div");

  section.className = className;
  if (initial) {
    section.dataset.initial = initial;
  }
  header.className = "bookmark-letter-header";
  heading.className = "bookmark-letter-title";
  heading.textContent = title;
  divider.className = "bookmark-letter-line";
  divider.setAttribute("aria-hidden", "true");
  grid.className = "bookmark-letter-grid";
  items.forEach((site) => {
    grid.appendChild(createBookmarkSiteCard(site, { favoriteKeys, favoriteIconMap, iconRenders }));
  });
  header.append(heading, divider);
  if (meta) {
    const metaNode = document.createElement("span");
    metaNode.className = "bookmark-section-meta";
    metaNode.textContent = meta;
    header.appendChild(metaNode);
  }
  section.append(header, grid);
  return section;
}

function createBookmarkSiteCard(site, options = {}) {
  const node = createSiteCard(site, { ...options, allowFavorite: false }, renderBookmarkSiteIcon);
  const deleteButton = document.createElement("button");

  node.classList.add("bookmark-site-card");
  deleteButton.className = "bookmark-delete-button";
  deleteButton.type = "button";
  deleteButton.innerHTML = trashIcon();
  deleteButton.setAttribute("aria-label", t("deleteBookmark", { title: site.title }));
  deleteButton.addEventListener("pointerenter", () => setBookmarkDeleteButtonFilled(deleteButton, true));
  deleteButton.addEventListener("pointerleave", () => setBookmarkDeleteButtonFilled(deleteButton, false));
  deleteButton.addEventListener("focus", () => setBookmarkDeleteButtonFilled(deleteButton, true));
  deleteButton.addEventListener("blur", () => setBookmarkDeleteButtonFilled(deleteButton, false));
  deleteButton.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await removeBookmarkSite(site);
  });
  node.appendChild(deleteButton);
  bindBookmarkLongPress(node, site);
  return node;
}

function setBookmarkDeleteButtonFilled(button, isFilled) {
  button.classList.toggle("is-filled", isFilled);
  button.innerHTML = isFilled ? trashFilledIcon() : trashIcon();
}

function canAddBookmarkSiteToFavorites(site, favoriteKeys = new Set()) {
  const favoriteKey = favoriteSiteKey(site?.url);
  if (site?.recommended) {
    return Boolean(
      favoriteKey
        && favoriteKeys.size < MAX_FAVORITE_SITES
        && !favoriteKeys.has(favoriteKey)
    );
  }
  return Boolean(
    site?.bookmarkId
      && favoriteKey
      && favoriteKeys.size < MAX_FAVORITE_SITES
      && !favoriteKeys.has(favoriteKey)
  );
}

async function addBookmarkSiteToFavorites(site) {
  const favoriteKey = favoriteSiteKey(site?.url);
  if (!favoriteKey) {
    return;
  }

  const favorites = await loadFavoriteSites();
  const favoriteKeys = favoriteSiteKeySet(favorites);
  if (favoriteKeys.has(favoriteKey)) {
    if (site?.recommended) {
      portalFormError.textContent = t("favoriteSiteExists", { title: normalizeText(site?.title) || favoriteSiteTitleFromUrl(favoriteKey) });
    }
    await renderFavoriteDependentSurfaces({ preserveBookmarkScroll: true });
    return;
  }
  if (favorites.length >= MAX_FAVORITE_SITES) {
    if (site?.recommended) {
      portalFormError.textContent = t("favoriteSiteLimit", { count: MAX_FAVORITE_SITES });
    }
    await renderFavoriteDependentSurfaces({ preserveBookmarkScroll: true });
    return;
  }

  favorites.push({
    id: String(Date.now()),
    title: normalizeText(site?.title).slice(0, MAX_PORTAL_TITLE_LENGTH) || favoriteSiteTitleFromUrl(favoriteKey),
    url: favoriteKey,
    icon: await WayleafIcon.discoverFavoriteSiteIcon(favoriteKey)
  });
  await saveFavoriteSites(favorites);
  if (site?.recommended) {
    portalFormError.textContent = "";
  }
  await renderFavoriteDependentSurfaces({ preserveBookmarkScroll: true });
}

async function rerenderBookmarkGridPreservingScroll() {
  const scrollTop = bookmarkGrid?.scrollTop || 0;
  await renderSelectedBookmarkFolder();
  if (bookmarkGrid) {
    bookmarkGrid.scrollTop = scrollTop;
  }
}

function bindBookmarkLongPress(node, site) {
  const link = node.querySelector(".site-link");
  let feedbackTimer = 0;
  let holdTimer = 0;
  let suppressNextClick = false;

  const clearPressTimer = () => {
    if (feedbackTimer) {
      clearTimeout(feedbackTimer);
      feedbackTimer = 0;
    }
    if (holdTimer) {
      clearTimeout(holdTimer);
      holdTimer = 0;
    }
  };

  const startPress = () => {
    if (node.classList.contains("delete-ready")) {
      return;
    }
    clearPressTimer();
    feedbackTimer = window.setTimeout(() => {
      node.classList.add("pressing");
      feedbackTimer = 0;
    }, BOOKMARK_LONG_PRESS_FEEDBACK_DELAY_MS);
    holdTimer = window.setTimeout(() => {
      node.classList.remove("pressing");
      holdTimer = 0;
      suppressNextClick = true;
      showBookmarkDeleteMode(node);
    }, BOOKMARK_LONG_PRESS_MS);
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
    clearBookmarkFolderViewCache();
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
  clearBookmarkFolderViewCache();
  clearTimeout(bookmarkRefreshTimer);
  bookmarkRefreshTimer = window.setTimeout(() => {
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
  setBookmarkPickerMode(true);
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

async function closeBookmarkPicker(requestedFolderId) {
  bookmarkPicker.hidden = true;
  bookmarkMainView.hidden = false;
  setBookmarkPickerMode(false);
  const folderId = typeof requestedFolderId === "string" ? requestedFolderId : undefined;
  await renderSelectedBookmarkFolder(folderId);
}

function setBookmarkPickerMode(isPicking) {
  bookmarkPickerToolbar.hidden = !isPicking;
  bookmarkMainToolbar.hidden = isPicking;
  bookmarkSearch.hidden = isPicking;
  bookmarkFolderLane.hidden = isPicking;
  closeBookmarkPickerButton.hidden = !isPicking;
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
    option.append(title, path, count);
    option.addEventListener("click", () => selectBookmarkFolder(folder.id));
    fragment.appendChild(option);
  });

  bookmarkFolderList.replaceChildren(fragment);
}

async function selectBookmarkFolder(folderId) {
  bookmarkSearchInput.value = "";
  const saveSelection = saveSelectedBookmarkFolderId(folderId);
  await closeBookmarkPicker(folderId);
  await saveSelection;
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
  const result = await getStoredValues({ [BOOKMARK_FOLDER_STORAGE_KEY]: "" });
  return String(result[BOOKMARK_FOLDER_STORAGE_KEY] || "");
}

async function saveSelectedBookmarkFolderId(folderId) {
  await setStoredValues({ [BOOKMARK_FOLDER_STORAGE_KEY]: folderId });
}

function withTimeout(promise, duration, message) {
  return new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => reject(new Error(message)), duration);
    promise.then(
      (value) => {
        window.clearTimeout(timeoutId);
        resolve(value);
      },
      (error) => {
        window.clearTimeout(timeoutId);
        reject(error);
      }
    );
  });
}

async function refreshHistory() {
  try {
    const [stored, favoriteSites] = await Promise.all([
      getStoredValues({ [RECENT_HISTORY_STARTED_AT_STORAGE_KEY]: 0 }),
      loadFavoriteSites()
    ]);
    const favoriteIconMap = favoriteSiteIconMap(favoriteSites);
    const recentHistoryStartedAt = Number(stored[RECENT_HISTORY_STARTED_AT_STORAGE_KEY] || 0);
    const frequentStartTime = Number.isFinite(recentHistoryStartedAt) && recentHistoryStartedAt > 0
      ? recentHistoryStartedAt
      : Date.now() - MOST_VISITED_HISTORY_FALLBACK_LOOKBACK_MS;
    const todayStartTime = startOfTodayTime();
    const todayHistoryReady = chrome.history.search({
        text: "",
        startTime: todayStartTime,
        maxResults: 240
      })
      .then((todayItems) => {
        if (onboardingPreviewActive) {
          return;
        }
        latestTodayHistoryItems = todayHistoryItems(todayItems);
        todayHistoryHydrated = true;
        if (recentViewMode === "today") {
          renderTodayHistory({ favoriteIconMap });
        } else {
          updateRecentFolderSwitchControls();
        }
      })
      .catch((error) => {
        latestTodayHistoryItems = [];
        todayHistoryHydrated = true;
        if (recentViewMode === "today") {
          renderTodayHistory({ favoriteIconMap });
        }
      });
    const items = await chrome.history.search({
      text: "",
      startTime: frequentStartTime,
      maxResults: MOST_VISITED_HISTORY_MAX_RESULTS
    });
    const mostVisitedItems = await mostVisitedHistoryItems(items, frequentStartTime);
    const recentGroups = groupHistoryBySite(mostVisitedItems, {
      maxPagesPerSite: MAX_HISTORY_PAGES_PER_SITE
    });
    if (onboardingPreviewActive) {
      return;
    }
    void todayHistoryReady;
    writeFirstPaintCache({ recentGroups: serializeRecentGroupsForFirstPaint(recentGroups) });
    renderRecentSurface(recentGroups, { favoriteIconMap });
  } catch (error) {
    latestTodayHistoryItems = [];
    todayHistoryHydrated = true;
    renderRecentSurface([]);
  }
}

function startOfTodayTime() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.getTime();
}

function todayHistoryItems(items) {
  return dedupeHistory(items)
    .map((item) => ({
      title: normalizeText(item.title),
      url: item.url,
      lastVisitTime: Number(item.lastVisitTime || 0)
    }))
    .filter((item) => item.title)
    .sort(compareHistoryItemsByRecentVisit);
}

function dedupeHistory(items) {
  const seen = new Set();
  const filtered = [];

  for (const item of items) {
    const url = safeUrl(item.url);
    const key = normalizeHistoryKey(item.url);
    if (!isDisplayableHistoryUrl(url) || !key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    filtered.push(item);
  }

  return filtered;
}

async function mostVisitedHistoryItems(items, startTime) {
  const displayableItems = dedupeHistory(items);
  const itemsWithVisits = await Promise.all(displayableItems.map(async (item) => {
    const visits = await historyVisitsSince(item.url, startTime);
    return {
      ...item,
      lastVisitTime: Number(item.lastVisitTime || 0),
      visitCount: visits,
      typedCount: Number(item.typedCount || 0)
    };
  }));

  return itemsWithVisits
    .filter((item) => Number(item.visitCount || 0) >= MIN_MOST_VISITED_HISTORY_VISITS)
    .sort(compareHistoryItemsByFrequentVisit);
}

async function historyVisitsSince(url, startTime) {
  if (!chrome.history?.getVisits) {
    return 1;
  }

  try {
    const visits = await chrome.history.getVisits({ url });
    const recentVisits = visits.filter((visit) => Number(visit.visitTime || 0) >= startTime);
    return recentVisits.length || 1;
  } catch {
    return 1;
  }
}

function renderRecentFolders(groups, options = {}) {
  latestRecentFolderGroups = orderedRecentHistoryGroups(groups);
  if (recentViewMode === "today") {
    renderTodayHistory(options);
    return;
  }
  clearRecentFolderPageSwitchAnimation();
  recentHistoryFolders.closest(".recent-folders").hidden = !latestRecentFolderGroups.length;
  if (!latestRecentFolderGroups.length) {
    recentHistoryFolders.replaceChildren();
    pendingRecentPreviousKeys = null;
    recentFolderPageIndex = 0;
    updateRecentFolderSwitchControls();
    return;
  }

  const direction = options.direction || "";
  const pageCount = recentFolderPageCount();
  if (Number.isFinite(Number(options.pageIndex))) {
    recentFolderPageIndex = Number(options.pageIndex);
  } else if (!direction) {
    recentFolderPageIndex = 0;
  }
  recentFolderPageIndex = Math.min(Math.max(0, recentFolderPageIndex), pageCount - 1);
  const previousKeys = options.previousKeys || pendingRecentPreviousKeys;
  const outgoingLayer = captureRecentFolderPageSwitchSnapshot(previousKeys, direction);
  pendingRecentPreviousKeys = null;
  const firstPaintCache = readFirstPaintCache();
  const iconRenders = options.iconRenders || firstPaintCache.iconRenders;
  const favoriteIconMap = options.favoriteIconMap || favoriteSiteIconMap(normalizeCachedFavoriteSites(firstPaintCache.favoriteSites));
  const startIndex = recentFolderPageIndex * MAX_RECENT_FOLDER_ITEMS;
  const fragment = document.createDocumentFragment();
  latestRecentFolderGroups.slice(startIndex, startIndex + MAX_RECENT_FOLDER_ITEMS).forEach((group) => {
    const card = createRecentFolderItem(group, { iconRenders, favoriteIconMap });
    fragment.appendChild(card);
  });
  recentHistoryFolders.replaceChildren(fragment);
  if (outgoingLayer) {
    recentHistoryFolders.append(outgoingLayer);
  }
  updateRecentFolderSwitchControls();
  if (previousKeys) {
    const nextKeys = recentFolderVisibleKeys();
    if (direction) {
      animateRecentFolderPageSwitch(outgoingLayer, nextKeys, previousKeys, direction);
    } else {
      animateRecentFolderEntries(new Set([...nextKeys].filter((key) => !previousKeys.has(key))));
    }
  }
}

function recentFolderPageCount(groups = latestRecentFolderGroups) {
  return Math.max(1, Math.ceil((groups?.length || 0) / MAX_RECENT_FOLDER_ITEMS));
}

function renderRecentSurface(groups, options = {}) {
  latestRecentFolderGroups = orderedRecentHistoryGroups(groups);
  if (!latestRecentFolderGroups.length && latestTodayHistoryItems.length && options.allowAutoToday === true) {
    recentViewMode = "today";
  }
  if (recentViewMode === "today") {
    renderTodayHistory(options);
    return;
  }
  renderRecentFolders(latestRecentFolderGroups, options);
}

function setRecentViewMode(mode) {
  const nextMode = mode === "today" ? "today" : "recent";
  if (nextMode === recentViewMode) {
    updateRecentFolderSwitchControls();
    return;
  }
  recentViewMode = nextMode;
  void saveRecentViewMode();
  animateRecentViewSurfaceSwap(() => {
    if (recentViewMode === "today") {
      todayHistoryPageIndex = 0;
      renderTodayHistory({ skipSurfaceAnimation: true });
      return;
    }
    renderRecentFolders(latestRecentFolderGroups, { skipSurfaceAnimation: true });
  }, { axis: "center", direction: recentViewMode === "today" ? "next" : "previous" });
}

function updateRecentHeaderState() {
  const recentSection = recentHistoryFolders?.closest(".recent-folders");
  if (!recentSection) {
    return;
  }
  recentSection.dataset.recentView = recentViewMode;
  document.querySelector("#recent-folders-title").textContent = t(
    recentViewMode === "today" ? "todayHistoryTitle" : "historyTitle"
  );
  setButtonLabel(recentViewToggleButton, t(
    recentViewMode === "today" ? "recentViewToggleToRecent" : "recentViewToggleToToday"
  ));
  if (recentViewToggleButton) {
    const canToggle = latestRecentFolderGroups.length || latestTodayHistoryItems.length || recentViewMode === "today";
    recentViewToggleButton.disabled = !canToggle;
    recentViewToggleButton.setAttribute("aria-pressed", String(recentViewMode === "today"));
  }
  const previousIcon = recentFoldersPreviousButton?.querySelector(".button-icon");
  const nextIcon = recentFoldersNextButton?.querySelector(".button-icon");
  if (previousIcon) {
    previousIcon.innerHTML = recentViewMode === "today" ? chevronUpIcon() : chevronLeftIcon();
  }
  if (nextIcon) {
    nextIcon.innerHTML = recentViewMode === "today" ? chevronDownIcon() : chevronRightIcon();
  }
  setButtonLabel(recentFoldersPreviousButton, t(
    recentViewMode === "today" ? "todayHistoryPrevious" : "recentFoldersPrevious"
  ));
  setButtonLabel(recentFoldersNextButton, t(
    recentViewMode === "today" ? "todayHistoryNext" : "recentFoldersNext"
  ));
}

function renderTodayHistory(options = {}) {
  clearRecentFolderPageSwitchAnimation();
  if (!todayHistoryHydrated && !latestTodayHistoryItems.length) {
    updateRecentFolderSwitchControls();
    return;
  }
  const recentSection = recentHistoryFolders.closest(".recent-folders");
  const canRenderEmpty = todayHistoryHydrated || latestTodayHistoryItems.length;
  recentSection.hidden = !(latestRecentFolderGroups.length || latestTodayHistoryItems.length || (recentViewMode === "today" && canRenderEmpty));
  if (recentSection.hidden) {
    return;
  }
  todayHistoryPageIndex = Math.min(Math.max(0, todayHistoryPageIndex), todayHistoryPageCount() - 1);
  const startIndex = todayHistoryPageIndex * MAX_TODAY_HISTORY_ITEMS_PER_PAGE;
  const visibleItems = latestTodayHistoryItems.slice(startIndex, startIndex + MAX_TODAY_HISTORY_ITEMS_PER_PAGE);
  const firstPaintCache = readFirstPaintCache();
  const iconRenders = options.iconRenders || firstPaintCache.iconRenders;
  const favoriteIconMap = options.favoriteIconMap || favoriteSiteIconMap(normalizeCachedFavoriteSites(firstPaintCache.favoriteSites));
  const fragment = document.createDocumentFragment();
  visibleItems.forEach((item) => fragment.append(createTodayHistoryItem(item, { ...options, iconRenders, favoriteIconMap })));
  if (!fragment.childNodes.length) {
    fragment.append(createRecentEmptyState(t("todayHistoryEmpty")));
  }
  pendingRecentPreviousKeys = null;
  const replaceTodayHistory = () => {
    recentHistoryFolders.replaceChildren(fragment);
    updateRecentFolderSwitchControls();
  };
  if (options.pageTransition && !options.skipSurfaceAnimation) {
    animateRecentViewSurfaceSwap(replaceTodayHistory, { axis: "vertical", direction: options.direction || "next" });
    return;
  }
  replaceTodayHistory();
}

function createTodayHistoryItem(item, options = {}) {
  const card = document.createElement("article");
  const link = document.createElement("a");
  const icon = document.createElement("img");
  const title = document.createElement("strong");
  card.className = "today-history-item";
  card.dataset.siteKey = normalizeHistoryDeleteUrl(item.url) || normalizeHistoryKey(item.url) || "";
  link.className = "today-history-link";
  link.href = item.url;
  link.setAttribute("aria-label", t("openPage", { title: item.title }));
  icon.className = "recent-folder-logo today-history-logo";
  icon.alt = "";
  const iconSite = { title: item.title, url: item.url, icon: historyItemIcon(item) };
  renderHistorySiteIcon(icon, iconSite, options);
  title.className = "today-history-title";
  title.textContent = item.title;
  link.append(icon, title);
  card.append(link);
  return card;
}

function createRecentEmptyState(message) {
  const item = document.createElement("div");
  const inner = document.createElement("div");
  const copy = document.createElement("p");
  item.className = "empty-state";
  copy.textContent = message;
  inner.append(copy);
  item.append(inner);
  return item;
}

function todayHistoryPageCount(items = latestTodayHistoryItems) {
  return Math.max(1, Math.ceil((items?.length || 0) / MAX_TODAY_HISTORY_ITEMS_PER_PAGE));
}

function updateRecentFolderSwitchControls() {
  updateRecentHeaderState();
  if (recentViewMode === "today") {
    const pageCount = todayHistoryPageCount();
    const hasMultiplePages = latestTodayHistoryItems.length > MAX_TODAY_HISTORY_ITEMS_PER_PAGE && pageCount > 1;
    const previousDisabled = !hasMultiplePages || todayHistoryPageIndex <= 0;
    const nextDisabled = !hasMultiplePages || todayHistoryPageIndex >= pageCount - 1;
    recentHistoryFolders.dataset.pageIndex = String(todayHistoryPageIndex);
    recentHistoryFolders.dataset.pageCount = String(pageCount);
    [
      [recentFoldersPreviousButton, previousDisabled],
      [recentFoldersNextButton, nextDisabled]
    ].forEach(([button, isDisabled]) => {
      if (!button) return;
      button.disabled = isDisabled;
      button.setAttribute("aria-disabled", String(isDisabled));
    });
    return;
  }
  const pageCount = recentFolderPageCount();
  const hasMultiplePages = latestRecentFolderGroups.length > MAX_RECENT_FOLDER_ITEMS && pageCount > 1;
  const previousDisabled = !hasMultiplePages || recentFolderPageIndex <= 0;
  const nextDisabled = !hasMultiplePages || recentFolderPageIndex >= pageCount - 1;
  recentHistoryFolders.dataset.pageIndex = String(recentFolderPageIndex);
  recentHistoryFolders.dataset.pageCount = String(pageCount);
  [
    [recentFoldersPreviousButton, previousDisabled],
    [recentFoldersNextButton, nextDisabled]
  ].forEach(([button, isDisabled]) => {
    if (!button) {
      return;
    }
    button.disabled = isDisabled;
    button.setAttribute("aria-disabled", String(isDisabled));
  });
}

function showRecentFolderPage(nextPageIndex, direction = "") {
  if (recentViewMode === "today") {
    showTodayHistoryPage(todayHistoryPageIndex + (direction === "previous" ? -1 : 1));
    return;
  }
  const pageCount = recentFolderPageCount();
  if (pageCount <= 1) {
    updateRecentFolderSwitchControls();
    return;
  }

  const targetPageIndex = Math.min(Math.max(0, Number(nextPageIndex)), pageCount - 1);
  if (targetPageIndex === recentFolderPageIndex) {
    updateRecentFolderSwitchControls();
    return;
  }

  const previousKeys = recentFolderVisibleKeys();
  recentFolderPageIndex = targetPageIndex;
  renderRecentFolders(latestRecentFolderGroups, { previousKeys, direction });
}

function showTodayHistoryPage(nextPageIndex) {
  const pageCount = todayHistoryPageCount();
  if (pageCount <= 1) {
    updateRecentFolderSwitchControls();
    return;
  }
  const targetPageIndex = Math.min(Math.max(0, Number(nextPageIndex)), pageCount - 1);
  if (targetPageIndex === todayHistoryPageIndex) {
    updateRecentFolderSwitchControls();
    return;
  }
  const direction = targetPageIndex < todayHistoryPageIndex ? "previous" : "next";
  todayHistoryPageIndex = targetPageIndex;
  renderTodayHistory({ direction, pageTransition: true });
}

function animateRecentViewSurfaceSwap(renderNext, { axis = "center", direction = "next" } = {}) {
  if (activeRecentViewSurfaceAnimation) {
    activeRecentViewSurfaceAnimation.cancel();
    activeRecentViewSurfaceAnimation = null;
  }
  clearRecentFolderPageSwitchAnimation();
  if (prefersReducedMotion() || !recentHistoryFolders.animate) {
    renderNext();
    return;
  }

  const vector = direction === "previous" ? -1 : 1;
  const exitTransform = axis === "vertical"
    ? `translate3d(0, ${-vector * 8}px, 0) scale(0.996)`
    : "translate3d(0, 0, 0) scale(0.982)";
  const enterTransform = axis === "vertical"
    ? `translate3d(0, ${vector * 8}px, 0) scale(0.996)`
    : "translate3d(0, 0, 0) scale(0.982)";
  let cancelled = false;
  recentHistoryFolders.classList.add("recent-view-surface-animating");
  recentHistoryFolders.style.willChange = "opacity, transform";
  const exitAnimation = recentHistoryFolders.animate([
    { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
    { opacity: 0, transform: exitTransform }
  ], {
    duration: axis === "vertical" ? 120 : 150,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    fill: "forwards"
  });

  const cleanup = () => {
    recentHistoryFolders.classList.remove("recent-view-surface-animating");
    recentHistoryFolders.style.opacity = "";
    recentHistoryFolders.style.transform = "";
    recentHistoryFolders.style.willChange = "";
    if (activeRecentViewSurfaceAnimation === animationHandle) {
      activeRecentViewSurfaceAnimation = null;
    }
  };
  const animationHandle = {
    cancel() {
      cancelled = true;
      exitAnimation.cancel();
      cleanup();
    }
  };
  activeRecentViewSurfaceAnimation = animationHandle;

  exitAnimation.finished
    .then(() => {
      if (cancelled) {
        return Promise.resolve();
      }
      renderNext();
      const enterAnimation = recentHistoryFolders.animate([
        { opacity: 0, transform: enterTransform },
        { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" }
      ], {
        duration: axis === "vertical" ? 150 : 190,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "both"
      });
      animationHandle.cancel = () => {
        cancelled = true;
        enterAnimation.cancel();
        cleanup();
      };
      return enterAnimation.finished.catch(() => {});
    })
    .then(cleanup)
    .catch(cleanup);
}

function animateRecentFolderExit(card) {
  if (!card?.animate) {
    return;
  }
  card.style.willChange = "opacity, transform";
  card.animate(
    [
      { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
      { opacity: 0.84, transform: "translate3d(0, -2px, 0) scale(0.992)", offset: 0.42 },
      { opacity: 0, transform: "translate3d(0, -10px, 0) scale(0.965)" }
    ],
    {
      duration: RECENT_CARD_DELETE_EXIT_MS,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "forwards"
    }
  );
}

function clearRecentFolderPageSwitchAnimation() {
  if (activeRecentFolderPageSwitchAnimation) {
    activeRecentFolderPageSwitchAnimation.cancel();
    activeRecentFolderPageSwitchAnimation = null;
  }
  recentHistoryFolders.querySelectorAll(".recent-folder-switch-layer").forEach((layer) => {
    layer.remove();
  });
  recentHistoryFolders.querySelectorAll(":scope > .recent-folder-item").forEach((card) => {
    card.style.opacity = "";
    card.style.transform = "";
    card.style.willChange = "";
  });
}

function captureRecentFolderPageSwitchSnapshot(previousKeys, direction = "") {
  if (!direction || prefersReducedMotion() || !previousKeys?.size || !recentHistoryFolders.children.length) {
    return null;
  }

  const layer = document.createElement("div");
  const cards = [...recentHistoryFolders.querySelectorAll(":scope > .recent-folder-item")]
    .filter((card) => previousKeys.has(card.dataset.siteKey || ""));
  if (!cards.length) {
    return null;
  }

  layer.className = "recent-folder-switch-layer";
  layer.setAttribute("aria-hidden", "true");
  cards.forEach((card, index) => {
    const snapshot = card.cloneNode(true);
    snapshot.classList.add("recent-folder-switch-snapshot");
    snapshot.querySelectorAll("a, button").forEach((node) => {
      node.tabIndex = -1;
    });
    layer.append(snapshot);
  });
  return layer;
}

function recentFolderVisibleKeys(excludedKey = "") {
  return new Set(
    [...recentHistoryFolders.querySelectorAll(":scope > .recent-folder-item")]
      .map((node) => node.dataset.siteKey)
      .filter((key) => key && key !== excludedKey)
  );
}

function animateRecentFolderEntries(enterKeys) {
  if (!enterKeys.size) {
    return;
  }

  const cards = [...recentHistoryFolders.querySelectorAll(":scope > .recent-folder-item")];
  for (const card of cards) {
    const key = card.dataset.siteKey || "";
    if (!key || !enterKeys.has(key) || !card.animate) {
      continue;
    }

    card.style.willChange = "opacity, transform";
    const animation = card.animate(
      [
        { opacity: 0, transform: "translate3d(0, 6px, 0) scale(0.995)" },
        { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" }
      ],
      {
        duration: RECENT_CARD_ENTER_MS,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)"
      }
    );
    animation.addEventListener("finish", () => {
      card.style.willChange = "";
    }, { once: true });
  }
}

function animateRecentFolderPageSwitch(outgoingLayer, nextKeys, previousKeys, direction = "") {
  if (!direction || prefersReducedMotion()) {
    outgoingLayer?.remove();
    return;
  }

  const enterCards = [...recentHistoryFolders.querySelectorAll(":scope > .recent-folder-item")]
    .filter((card) => {
      const key = card.dataset.siteKey || "";
      return key && (!previousKeys?.has(key) || nextKeys?.has(key));
    });
  if (!outgoingLayer && !enterCards.length) {
    return;
  }

  const vector = direction === "previous" ? -1 : 1;
  const incomingOffset = 54;
  const outgoingOffset = 62;
  const gsap = getGsap();
  const outgoingCards = outgoingLayer
    ? [...outgoingLayer.querySelectorAll(".recent-folder-switch-snapshot")]
    : [];
  const animationHandle = {
    cancel() {}
  };
  let cleanedUp = false;
  const cleanUp = () => {
    if (cleanedUp) {
      return;
    }
    cleanedUp = true;
    outgoingLayer?.remove();
    enterCards.forEach((card) => {
      card.style.opacity = "";
      card.style.transform = "";
      card.style.visibility = "";
      card.style.willChange = "";
    });
    if (activeRecentFolderPageSwitchAnimation === animationHandle) {
      activeRecentFolderPageSwitchAnimation = null;
    }
  };
  animationHandle.cancel = cleanUp;
  activeRecentFolderPageSwitchAnimation = animationHandle;

  if (gsap) {
    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: cleanUp
    });
    animationHandle.cancel = () => {
      timeline.kill();
      cleanUp();
    };
    if (outgoingCards.length) {
      gsap.set(outgoingCards, { willChange: "transform,opacity" });
      timeline.to(outgoingCards, {
        autoAlpha: 0,
        x: -vector * outgoingOffset,
        scale: 0.985,
        duration: gsapDuration(RECENT_FOLDER_PAGE_SWITCH_EXIT_MS),
        ease: "power2.out",
        stagger: gsapDuration(RECENT_FOLDER_PAGE_SWITCH_STAGGER_MS * 0.44)
      }, 0);
    }
    if (enterCards.length) {
      gsap.set(enterCards, {
        autoAlpha: 0,
        x: vector * incomingOffset,
        scale: 0.988,
        willChange: "transform,opacity"
      });
      timeline.to(enterCards, {
        autoAlpha: 1,
        x: 0,
        scale: 1,
        duration: gsapDuration(RECENT_FOLDER_PAGE_SWITCH_MS),
        ease: "power3.out",
        stagger: gsapDuration(RECENT_FOLDER_PAGE_SWITCH_STAGGER_MS)
      }, gsapDuration(46));
    }
    return;
  }

  const enterTiming = {
    duration: RECENT_FOLDER_PAGE_SWITCH_MS,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    fill: "both"
  };
  const exitTiming = {
    duration: RECENT_FOLDER_PAGE_SWITCH_EXIT_MS,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    fill: "forwards"
  };
  const animations = [];
  outgoingCards.forEach((card, index) => {
    card.style.willChange = "opacity, transform";
    animations.push(card.animate([
      { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
      { opacity: 0, transform: `translate3d(${-vector * outgoingOffset}px, 0, 0) scale(0.985)` }
    ], {
      ...exitTiming,
      delay: index * RECENT_FOLDER_PAGE_SWITCH_STAGGER_MS * 0.44
    }));
  });
  enterCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.willChange = "opacity, transform";
    const animation = card.animate([
      { opacity: 0, transform: `translate3d(${vector * incomingOffset}px, 0, 0) scale(0.988)` },
      { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" }
    ], {
      ...enterTiming,
      delay: 46 + index * RECENT_FOLDER_PAGE_SWITCH_STAGGER_MS
    });
    animations.push(animation);
    animation.addEventListener("finish", () => {
      card.style.opacity = "";
      card.style.willChange = "";
    }, { once: true });
  });
  Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
    cleanUp();
  });
}

function createRecentFolderItem(group, options = {}) {
  const homeUrl = group.homeUrl || siteHomeUrl(group.key, group.url);
  const title = normalizeText(group.name) || historyFallbackTitle(safeUrl(homeUrl || group.url));
  const card = document.createElement("article");
  const inner = document.createElement("div");
  const face = document.createElement("a");
  const icon = document.createElement("img");
  const copy = document.createElement("span");
  const name = document.createElement("strong");
  const domain = document.createElement("span");
  const deleteButton = document.createElement("button");

  card.className = "recent-folder-item recent-card";
  card.dataset.siteKey = group.key || "";
  inner.className = "recent-card-inner";
  face.className = "recent-folder-face";
  face.href = homeUrl || group.url;
  face.setAttribute("aria-label", t("openPage", { title }));
  icon.className = "recent-folder-logo";
  const iconSite = {
    title,
    url: homeUrl || group.url,
    icon: historyItemIcon(group)
  };
  renderHistorySiteIcon(icon, iconSite, options);
  icon.alt = "";
  copy.className = "recent-folder-copy";
  name.className = "recent-folder-name";
  name.textContent = title;
  domain.className = "recent-folder-domain";
  domain.textContent = compactHistoryUrl(safeUrl(homeUrl || group.url));
  deleteButton.className = "recent-card-delete";
  deleteButton.type = "button";
  deleteButton.innerHTML = trashIcon();
  deleteButton.setAttribute("aria-label", t("deleteHistory", { title }));

  deleteButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (card.classList.contains("is-deleting")) {
      return;
    }
    deleteButton.disabled = true;
    const previousKeys = recentFolderVisibleKeys(group.key || "");
    card.classList.add("is-deleting");
    pendingRecentPreviousKeys = previousKeys;
    animateRecentFolderExit(card);
    window.setTimeout(() => deleteHistoryGroup(group), RECENT_CARD_DELETE_EXIT_MS);
  });

  copy.append(name, domain);
  face.append(icon, copy);
  inner.append(face, deleteButton);
  card.append(inner);
  return card;
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
        visitCount: 0,
        typedCount: 0,
        lastVisitTime: 0,
        pages: [],
        pageKeys: new Set(),
        deleteUrls: [],
        deleteUrlKeys: new Set()
      });
    }
    const group = groups.get(key);
    group.visitCount += Number(item.visitCount || 0);
    group.typedCount += Number(item.typedCount || 0);
    group.lastVisitTime = Math.max(group.lastVisitTime, Number(item.lastVisitTime || 0));
    const deleteUrl = normalizeHistoryDeleteUrl(item.url);
    const deleteKey = deleteUrl;
    if (deleteKey && !group.deleteUrlKeys.has(deleteKey)) {
      group.deleteUrlKeys.add(deleteKey);
      group.deleteUrls.push(deleteUrl);
    }
    const pageKey = historyPageKey(item, url, key);
    if (!group.pageKeys.has(pageKey)) {
      group.pageKeys.add(pageKey);
      group.pages.push(item);
    }
  }

  return orderedRecentHistoryGroups(
    [...groups.values()].map(({ pageKeys, deleteUrlKeys, ...group }) => group),
    maxPagesPerSite
  )
    .slice(0, maxGroups);
}

function orderedRecentHistoryGroups(groups, maxPagesPerSite = MAX_HISTORY_PAGES_PER_SITE) {
  return (Array.isArray(groups) ? groups : [])
    .map((group) => ({
      ...group,
      pages: Array.isArray(group.pages)
        ? [...group.pages].sort(compareHistoryItemsByFrequentVisit).slice(0, maxPagesPerSite)
        : []
    }))
    .sort(compareHistoryGroupsByFrequentVisit);
}

function compareHistoryItemsByRecentVisit(a, b) {
  return Number(b.lastVisitTime || 0) - Number(a.lastVisitTime || 0);
}

function compareHistoryItemsByFrequentVisit(a, b) {
  const visitDiff = Number(b.visitCount || 0) - Number(a.visitCount || 0);
  if (visitDiff !== 0) {
    return visitDiff;
  }
  const typedDiff = Number(b.typedCount || 0) - Number(a.typedCount || 0);
  if (typedDiff !== 0) {
    return typedDiff;
  }
  return compareHistoryItemsByRecentVisit(a, b);
}

function compareHistoryGroupsByFrequentVisit(a, b) {
  const visitDiff = historyGroupVisitCount(b) - historyGroupVisitCount(a);
  if (visitDiff !== 0) {
    return visitDiff;
  }
  const typedDiff = Number(b.typedCount || 0) - Number(a.typedCount || 0);
  if (typedDiff !== 0) {
    return typedDiff;
  }
  return historyGroupRecentVisitTime(b) - historyGroupRecentVisitTime(a);
}

function historyGroupVisitCount(group) {
  const explicitCount = Number(group.visitCount || 0);
  if (explicitCount > 0) {
    return explicitCount;
  }
  return (group.pages || []).reduce((total, item) => (
    total + Number(item.visitCount || 0)
  ), 0);
}

function historyGroupRecentVisitTime(group) {
  return (group.pages || []).reduce((latest, item) => (
    Math.max(latest, Number(item.lastVisitTime || 0))
  ), 0);
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

function formatHistoryTimestamp(timestamp) {
  return formatHistoryFullTime(timestamp);
}

async function deleteHistoryGroup(group) {
  const urls = Array.isArray(group.deleteUrls) && group.deleteUrls.length
    ? group.deleteUrls
    : group.pages.map((item) => normalizeHistoryDeleteUrl(item.url)).filter(Boolean);
  await deleteHistoryUrls(urls);
}

async function deleteHistoryUrls(urls) {
  const uniqueUrls = [...new Set(urls.map(normalizeHistoryDeleteUrl).filter(Boolean))];
  if (!uniqueUrls.length) {
    return;
  }
  try {
    await Promise.all(uniqueUrls.map((url) => chrome.history.deleteUrl({ url })));
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
  const recentSection = recentHistoryFolders?.closest(".recent-folders");
  if (!recentSection) {
    return;
  }
  const messageNode = document.createElement("p");
  messageNode.className = "history-transient-message";
  messageNode.textContent = message;
  recentSection.prepend(messageNode);
  window.setTimeout(() => {
    messageNode.remove();
  }, 2400);
}

const TDESIGN_ICON_MARKUP = Object.freeze({
  add: '<path fill="none" stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M12 5v14m7-7H5"/>',
  app: '<g fill="none"><path d="M3 3h7v7H3zm11 11h7v7h-7zM3 14h7v7H3zm18.5-7.5a4 4 0 1 1-8 0a4 4 0 0 1 8 0"/><path stroke="currentColor" stroke-width="2" d="M3 3h7v7H3zm11 11h7v7h-7zM3 14h7v7H3zm18.5-7.5a4 4 0 1 1-8 0a4 4 0 0 1 8 0Z"/></g>',
  "arrow-left": '<path fill="none" stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M11 6.5L5.5 12l5.5 5.5M6.75 12h13"/>',
  "bookmark-double-filled": '<path fill="currentColor" d="M23.003 18.419L23 0L10.001.002v2H21v14.413z"/><path fill="currentColor" d="M19 4H3v19.943l8-5.714l8 5.714z"/>',
  "ai-search": '<g fill="none" stroke="currentColor" stroke-width="2"><path d="m16.75 2.5l.52 1.23l1.23.52l-1.23.52L16.75 6l-.52-1.23L15 4.25l1.23-.52z"/><path stroke-linecap="square" d="m15.803 15.804l5.303 5.303m-5.303-5.303A7.5 7.5 0 1 1 10 3.017m5.803 12.787A7.47 7.47 0 0 0 17.983 11"/></g>',
  "ai-search-filled": '<path fill="currentColor" d="M10.648 2.072a6.5 6.5 0 0 0 8.348 8.348a8.56 8.56 0 0 1-1.822 5.41l5.346 5.346l-1.414 1.414l-5.346-5.347a8.48 8.48 0 0 1-5.26 1.826c-4.635 0-8.5-3.87-8.5-8.5c0-4.238 3.335-7.993 7.584-8.45a8 8 0 0 1 1.064-.047"/><path fill="currentColor" d="M18.032 3.036L21.07 4.32l-3.037 1.283l-1.282 3.037l-1.283-3.037l-3.036-1.283l3.036-1.283L16.75 0z"/>',
  calendar: '<path fill="none" stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M7 2v4m10-4v4M3.5 9.5h17M5 4.5h14a1.5 1.5 0 0 1 1.5 1.5v14A1.5 1.5 0 0 1 19 21.5H5A1.5 1.5 0 0 1 3.5 20V6A1.5 1.5 0 0 1 5 4.5Z"/>',
  check: '<path fill="none" stroke="currentColor" stroke-linecap="square" stroke-width="2" d="m5 12.5l4 4l10-10"/>',
  "chevron-down": '<path fill="none" stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M17.5 9.5L12 15L6.5 9.5"/>',
  "chevron-left": '<path fill="none" stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M14.5 17.5L9 12l5.5-5.5"/>',
  "chevron-right": '<path fill="none" stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M9.5 17.5L15 12L9.5 6.5"/>',
  "chevron-up": '<path fill="none" stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M17.5 14.5L12 9l-5.5 5.5"/>',
  cloud: '<path fill="none" stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M7.5 18.5H18a4 4 0 0 0 .6-7.956A6.5 6.5 0 0 0 6.39 8.109A5.25 5.25 0 0 0 7.5 18.5Z"/>',
  close: '<path fill="none" stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M16.95 7.05L12 12m0 0l-4.95 4.95M12 12l4.95 4.95M12 12L7.05 7.05"/>',
  delete: '<g fill="none"><path d="M5 5h14l-.5 17h-13z"/><path stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M21 5H3m2 0h14l-.5 17h-13zm3.5-3h7v3h-7zM12 9v9"/></g>',
  "delete-filled": '<path fill="currentColor" d="M7.5 3h9V1h-9zM22 6V4H2v2h2.029l.5 17h14.942l.5-17zM11 19V8h2v11z"/>',
  "file-attachment": '<g fill="none" stroke="currentColor" stroke-linecap="square" stroke-width="2"><path d="M20 11V7l-5-5H4v20h8m2-20v6h6"/><path d="M19 19v-3.5a1.5 1.5 0 0 0-3 0V20a3 3 0 1 0 6 0v-3.5"/></g>',
  "file-attachment-filled": '<path fill="currentColor" d="M3 1h12.414L21 6.586v6.085a4.5 4.5 0 0 0-8 2.829v6c0 .526.09 1.03.256 1.5H3zm11.5 2v4.5H19z"/><path fill="currentColor" d="M17.5 13a2.5 2.5 0 0 0-2.5 2.5V20a4 4 0 0 0 8 0v-4.5h-2V20a2 2 0 1 1-4 0v-4.5a.5.5 0 0 1 1 0V20h2v-4.5a2.5 2.5 0 0 0-2.5-2.5"/>',
  "file-export": '<g fill="none" stroke="currentColor" stroke-linecap="square" stroke-width="2"><path d="M14 2H6.5A1.5 1.5 0 0 0 5 3.5v17A1.5 1.5 0 0 0 6.5 22h11a1.5 1.5 0 0 0 1.5-1.5V7z"/><path d="M14 2v5h5M9 14h8m0 0l-3-3m3 3l-3 3"/></g>',
  "file-import": '<g fill="none" stroke="currentColor" stroke-linecap="square" stroke-width="2"><path d="M14 2H6.5A1.5 1.5 0 0 0 5 3.5v17A1.5 1.5 0 0 0 6.5 22h11a1.5 1.5 0 0 0 1.5-1.5V7z"/><path d="M14 2v5h5M16 14H8m0 0l3-3m-3 3l3 3"/></g>',
  "filter-2": '<g fill="none"><path d="m3.563 18.491l3.735 3.735L17.554 11.97L13.82 8.235z"/><path d="m20.973 8.55l-3.735-3.734l-3.418 3.42l3.734 3.734z"/><path stroke="currentColor" stroke-linecap="square" stroke-width="2" d="m17.238 4.816l3.735 3.735m-3.735-3.735L3.563 18.491l3.735 3.735L20.973 8.55m-3.735-3.735l-3.418 3.42l3.734 3.734l3.419-3.42"/><path stroke="currentColor" stroke-width="2" d="m7.75 3.5l.415.835L9 4.75l-.835.415L7.75 6l-.415-.835L6.5 4.75l.835-.415zM21.625 3l.041.083l.084.042l-.084.042l-.041.083l-.041-.083l-.084-.042l.084-.042z"/></g>',
  "filter-2-filled": '<g transform="translate(-.5 0)"><path fill="currentColor" d="m19.318 3.05l1.568-.78l.781-1.569l.781 1.569l1.569.78l-1.569.782l-.78 1.569l-.782-1.57zm-10.263.669L7.958 1.515L6.86 3.719L4.657 4.816L6.86 5.913l1.097 2.204l1.097-2.204l2.204-1.097zm8.499 9.664l-5.148-5.15L2.148 18.492l5.149 5.149zm4.832-4.833l-5.149-5.148L13.82 6.819l5.149 5.149z"/></g>',
  "folder-add": '<path fill="none" stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M22 11V6H11L9 3.5H2V20h11m7-5v3m0 0v3m0-3h-3m3 0h3"/>',
  "format-vertical-align-left": '<path fill="none" stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M3 5h18M3 12h12M3 19h18"/>',
  desktop: '<g fill="none"><path d="M2 4h20v13H2z"/><path stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M12 17v4m-4 0h8M2 4h20v13H2z"/></g>',
  "sunny-filled": '<path fill="currentColor" d="M13 1v3h-2V1zm7.485 3.928L18.364 7.05L16.95 5.636l2.121-2.122zM4.93 3.514l2.12 2.122L5.636 7.05L3.515 4.929zM6 12a6 6 0 1 1 12 0a6 6 0 0 1-12 0m-5-1h3v2H1zm19 0h3v2h-3zM7.05 18.363l-2.12 2.123l-1.415-1.416l2.121-2.122zm11.314-1.414l2.121 2.122l-1.414 1.414l-2.121-2.121zM13 20v3h-2v-3z"/>',
  "moon-filled": '<path fill="currentColor" d="M2 12C2 6.477 6.477 2 12 2h1.734l-.868 1.5C12.287 4.5 12 5.689 12 7a7 7 0 0 0 8.348 6.87l1.682-.327l-.543 1.626C20.162 19.137 16.417 22 12 22C6.477 22 2 17.523 2 12"/>',
  "page-tab-filled": '<path fill="currentColor" d="m9.48 2.5l.301.375l2.9 3.625H23V21H1V2.5z"/><path fill="currentColor" d="M23 2.5v2H13v-2z"/>',
  refresh: '<path fill="none" stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M21.448 13c-.5 4.777-4.539 8.5-9.448 8.5A9.5 9.5 0 0 1 3.38 16m-.88 4.5v-5h3M2.552 11C3.052 6.223 7.09 2.5 12 2.5A9.5 9.5 0 0 1 20.62 8m.88-4.5v5h-3"/>',
  search: '<g fill="none"><path d="M15.803 15.803A7.5 7.5 0 1 1 5.197 5.197a7.5 7.5 0 0 1 10.606 10.606"/><path stroke="currentColor" stroke-linecap="square" stroke-width="2" d="m15.803 15.804l5.303 5.303m-5.303-5.304A7.5 7.5 0 1 1 5.197 5.197a7.5 7.5 0 0 1 10.606 10.606Z"/></g>',
  setting: '<g fill="none"><path d="M20.66 7L12 2L3.34 7v10L12 22l8.66-5zM12 16a4 4 0 1 0 0-8a4 4 0 0 0 0 8" clip-rule="evenodd"/><path d="M16 12a4 4 0 1 1-8 0a4 4 0 0 1 8 0"/><path stroke="currentColor" stroke-linecap="square" stroke-width="2" d="m12 2l8.66 5v10L12 22l-8.66-5V7z"/><path stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M16 12a4 4 0 1 1-8 0a4 4 0 0 1 8 0Z"/></g>',
  "setting-filled": '<path fill="currentColor" d="M21.66 6.423L12 .845L2.34 6.423v11.154L12 23.155l9.66-5.578zM12 16a4 4 0 1 1 0-8a4 4 0 0 1 0 8"/>',
  swap: '<path fill="none" stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M21 14.5H4l5 5m-6-10h17l-5-5"/>',
  "system-setting": '<g fill="none"><path d="M21.5 17.5a3 3 0 1 1-6 0a3 3 0 0 1 6 0"/><path stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M22 9.5V3H2v14h8.5M4 21h6.5m8-6.5v-1.25m0 1.25a3 3 0 0 0 0 6m0-6a3 3 0 1 1 0 6m0 0v1.25M15.902 16l-1.083-.625M21.098 19l1.083.625M21.098 16l1.083-.625M15.9 19l-1.082.625"/></g>',
  "system-setting-filled": '<path fill="currentColor" d="M23 2H1v16h10.768a6.7 6.7 0 0 1 .96-4.002H3v-10h18v7.23a6.8 6.8 0 0 1 2 1.24zM3 20h9.228a6.8 6.8 0 0 0 1.24 2H3z"/><path fill="currentColor" d="M19.5 13.376V12h-2v1.376a4 4 0 0 0-1.854 1.072l-1.193-.689l-1 1.732l1.192.688a4 4 0 0 0 0 2.142l-1.192.688l1 1.732l1.193-.689a4 4 0 0 0 1.854 1.072V22.5h2v-1.376a4 4 0 0 0 1.854-1.072l1.192.689l1-1.732l-1.191-.688a4 4 0 0 0 0-2.142l1.191-.688l-1-1.732l-1.192.688a4 4 0 0 0-1.854-1.071m-2.715 2.844a2 2 0 0 1 3.43 0l.036.063c.159.287.249.616.249.967c0 .35-.09.68-.249.967l-.037.063a2 2 0 0 1-3.429 0l-.037-.063a2 2 0 0 1-.248-.967a2 2 0 0 1 .248-.967z"/>'
});

function tdesignIcon(name) {
  const body = TDESIGN_ICON_MARKUP[name];
  if (!body) {
    return "";
  }
  return `<svg class="tdesign-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${body}</svg>`;
}

function themeModeIcon(mode) {
  return tdesignIcon(THEME_MODE_ICON_BY_MODE[mode] || THEME_MODE_ICON_BY_MODE.system);
}

function searchEngineSearchIcon() {
  return tdesignIcon(googleAiSearchModeActive ? "ai-search" : "search");
}

function plusIcon() {
  return tdesignIcon("add");
}

function refreshIcon() {
  return tdesignIcon("refresh");
}

function fileExportIcon() {
  return tdesignIcon("file-export");
}

function fileImportIcon() {
  return tdesignIcon("file-import");
}

function aiAttachmentIcon() {
  return `<span class="ai-attachment-icon-outline">${tdesignIcon("file-attachment")}</span><span class="ai-attachment-icon-filled">${tdesignIcon("file-attachment-filled")}</span>`;
}

function githubIcon() {
  return '<svg class="brand-icon github-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61c-.546-1.385-1.335-1.755-1.335-1.755c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12Z"/></svg>';
}

function arrowLeftIcon() {
  return tdesignIcon("arrow-left");
}

function chevronLeftIcon() {
  return tdesignIcon("chevron-left");
}

function chevronRightIcon() {
  return tdesignIcon("chevron-right");
}

function settingsIcon() {
  return tdesignIcon("setting");
}

function portalSurfaceIcon() {
  const icon = tdesignIcon("format-vertical-align-left");
  return `<span class="portal-surface-icon-base">${icon}</span><span class="portal-surface-icon-fill">${icon}</span>`;
}

function settingsToggleIcon() {
  return `<span class="settings-toggle-icon-base">${settingsIcon()}</span><span class="settings-toggle-icon-fill">${tdesignIcon("setting-filled")}</span>`;
}

function closeIcon() {
  return tdesignIcon("close");
}

function trashIcon() {
  return tdesignIcon("delete");
}

function trashFilledIcon() {
  return tdesignIcon("delete-filled");
}

function emptyStateIcon() {
  return tdesignIcon("folder-add");
}

function chevronDownIcon() {
  return tdesignIcon("chevron-down");
}

function chevronUpIcon() {
  return tdesignIcon("chevron-up");
}

function swapIcon() {
  return tdesignIcon("swap");
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
  if (GOOGLE_REGIONAL_HOST_PATTERN.test(bareHost)) {
    return "google.com";
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

function isDisplayableHistoryUrl(url) {
  return Boolean(url
    && /^https?:$/.test(url.protocol)
    && !url.username
    && !url.password
    && !isLocalHistoryUrl(url)
    && !isAuthRelatedHistoryUrl(url));
}

function isLocalHistoryUrl(url) {
  const host = normalizeHostname(url?.hostname).replace(/^\[|\]$/g, "");
  if (!host) {
    return true;
  }
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local")) {
    return true;
  }
  if (!host.includes(".") && !host.includes(":")) {
    return true;
  }
  if (isPrivateIpv4Host(host) || isPrivateIpv6Host(host)) {
    return true;
  }
  return false;
}

function isPrivateIpv4Host(host) {
  if (!/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) {
    return false;
  }
  const parts = host.split(".").map((part) => Number(part));
  if (parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return false;
  }
  const [first, second] = parts;
  return first === 0
    || first === 10
    || first === 127
    || (first === 169 && second === 254)
    || (first === 172 && second >= 16 && second <= 31)
    || (first === 192 && second === 168);
}

function isPrivateIpv6Host(host) {
  const normalized = host.toLowerCase();
  return normalized === "::1"
    || normalized.startsWith("fc")
    || normalized.startsWith("fd")
    || normalized.startsWith("fe80:");
}

function isAuthRelatedHistoryUrl(url) {
  const host = normalizeHostname(url?.hostname);
  const pathSegments = url.pathname
    .split("/")
    .map((segment) => normalizeText(decodeURIComponentSafe(segment)).toLowerCase())
    .filter(Boolean);
  const authPathScore = pathSegments.filter((segment) => AUTH_HISTORY_PATH_SEGMENTS.has(segment)).length;
  const hasStrongAuthPath = pathSegments.some((segment) => STRONG_AUTH_HISTORY_PATH_SEGMENTS.has(segment));
  const queryScore = [...url.searchParams.keys()]
    .filter((key) => AUTH_HISTORY_QUERY_PARAMS.has(key.toLowerCase()))
    .length;
  const hasAuthHost = AUTH_RELATED_HISTORY_HOSTS.has(host)
    || AUTH_RELATED_HISTORY_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix));
  const hasAuthHostHint = hasAuthHost || host
    .split(/[.-]/)
    .some((part) => AUTH_RELATED_HISTORY_HOST_PARTS.has(part));

  return hasAuthHost
    || (hasAuthHostHint && (url.pathname === "/" || authPathScore > 0 || queryScore > 0))
    || (hasStrongAuthPath && queryScore > 0)
    || (authPathScore > 0 && (hasAuthHostHint || queryScore > 0))
    || (queryScore >= 2 && hasAuthHostHint);
}

function decodeURIComponentSafe(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
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
