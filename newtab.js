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
const SITE_ICON_CACHE_STORAGE_KEY = "siteIconCache";
const OPEN_TAB_ACTIVITY_STORAGE_KEY = "openTabActivity";
const RECENT_HISTORY_STARTED_AT_STORAGE_KEY = "recentHistoryStartedAt";
const BOOKMARK_FOLDER_STORAGE_KEY = "bookmarkFolderId";
const PORTAL_CATEGORY_STATE_STORAGE_KEY = "portalCategoryState";
const THEME_STORAGE_KEY = "themeMode";
const THEME_PALETTE_STORAGE_KEY = "themePalette";
const LANGUAGE_STORAGE_KEY = "languagePreference";
const THEME_BOOT_STORAGE_KEY = "__wayleaf_theme_boot__";
const SEARCH_SETTINGS_STORAGE_KEY = "searchSettings";
const VIDEO_PIP_GLOBAL_ENABLED_STORAGE_KEY = "videoPipGlobalEnabled";
const SOCIAL_VIDEO_EXTRACTOR_ENABLED_STORAGE_KEY = "socialVideoExtractorEnabled";
const FIRST_PAINT_CACHE_STORAGE_KEY = "__wayleaf_first_paint_cache__";
const FIRST_PAINT_CACHE_VERSION = 8;
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
const RECENT_HISTORY_LOOKBACK_MS = 24 * 60 * 60 * 1000;
const MIN_RECENT_DOMAIN_VISITS = 2;
const RECENT_OPEN_TAB_MIN_OPEN_MS = 2 * 60 * 60 * 1000;
const MAX_CUSTOM_PORTALS = 48;
const MAX_FAVORITE_SITES = 5;
const MAX_PORTAL_TITLE_LENGTH = 32;
const MAX_PORTAL_URL_LENGTH = 512;
const MAX_LOCAL_SEARCH_RESULTS = 8;
const MAX_AI_PROMPT_HISTORY_ITEMS = 48;
const MAX_CACHED_SITE_ICONS = 80;
const MAX_CACHED_SITE_ICON_BYTES = 96 * 1024;
const SITE_ICON_RAW_SVG_CACHE_STORAGE_KEY = "__wayleaf_site_icon_svg__";
const MAX_CACHED_SITE_ICON_SVG_BYTES = 24 * 1024;
const MAX_CACHED_SITE_ICON_SVG_ENTRIES = MAX_FAVORITE_SITES + MAX_HISTORY_SITE_GROUPS + 16;
const SITE_ICON_DISCOVERY_TIMEOUT_MS = 3500;
const SITE_ICON_DOCUMENT_DISCOVERY_TIMEOUT_MS = 15000;
const SITE_ICON_FETCH_TIMEOUT_MS = 4500;
const SITE_ICON_DEFAULT_RESCUE_TIMEOUT_MS = 8000;
const SITE_ICON_DISCOVERY_HTML_MAX_BYTES = 256 * 1024;
const SITE_ICON_DISCOVERY_TARGET_SIZE = 128;
const SITE_ICON_DISCOVERY_CANDIDATE_LIMIT = 12;
const SITE_ICON_DISCOVERY_MEMORY_CACHE_LIMIT = 96;
const SITE_ICON_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const REMOTE_BRAND_ICON_MISSING_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const REMOTE_BRAND_ICON_INDEX_TTL_MS = 24 * 60 * 60 * 1000;
const REMOTE_BRAND_ICON_PROVIDER_VERSION = 2;
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
const RECENT_CARD_DRAWER_CLOSE_DELAY_MS = 180;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const FAVICON_BACKGROUND_SAMPLE_SIZE = 32;
const FAVICON_BACKGROUND_ALPHA_MIN = 0.35;
const FAVICON_BACKGROUND_COLOR_DISTANCE = 58;
const FAVICON_BACKGROUND_CONFIDENCE_MIN = 0.32;
const FAVICON_FOREGROUND_COLOR_DISTANCE = 12;
const FAVICON_LOW_CONTRAST_FOREGROUND_COVERAGE_MIN = 0.018;
const FAVICON_LOW_CONTRAST_AVERAGE_MAX = 1.32;
const FAVICON_LOW_CONTRAST_PEAK_MAX = 1.65;
const FAVICON_TRANSPARENT_GLYPH_COVERAGE_MAX = 0.48;
const FAVICON_TRANSPARENT_GLYPH_COVERAGE_MIN = 0.01;
const FAVICON_TRANSPARENT_GLYPH_EDGE_CONFIDENCE_MAX = 0.22;
const FAVICON_TRANSPARENT_GLYPH_CANDIDATE_RATIO_MIN = 0.58;
const FAVICON_NEAR_WHITE_GLYPH_LUMINANCE_MIN = 0.82;
const FAVICON_NEAR_WHITE_GLYPH_FOREGROUND_COVERAGE_MAX = 0.035;
const FAVICON_PAPER_SURFACE_COVERAGE_MIN = 0.12;
const FAVICON_PAPER_SURFACE_ARTWORK_COVERAGE_MIN = 0.012;
const FAVICON_PAPER_SURFACE_SPAN_MIN = 0.38;
const FAVICON_EDGE_CARRIER_CONFIDENCE_MIN = 0.48;
const FAVICON_EMBEDDED_TILE_EDGE_CONFIDENCE_MAX = 0.24;
const FAVICON_EMBEDDED_TILE_INNER_CONFIDENCE_MIN = 0.34;
const FAVICON_EMBEDDED_TILE_CONTRAST_MIN = 1.35;
const FAVICON_EMBEDDED_TILE_CONTRAST_MAX_MIX = 0.42;
const FAVICON_EMBEDDED_TILE_FUSION_CLEAR_DISTANCE = 48;
const FAVICON_EMBEDDED_TILE_FUSION_FEATHER_DISTANCE = 24;
const FAVICON_READABLE_CARRIER_CONTRAST_MIN = 3;
const FAVICON_READABLE_CARRIER_MAX_MIX = 0.72;
const FAVICON_ADAPTIVE_CARRIER_VERSION = 10;
const BRAND_ICON_VI_CONTRAST_MIN = 2.75;
const BRAND_ICON_DARK_MODE_CARRIER = "#f8fafc";
const BRAND_ICON_LIGHT_MODE_DARK_CARRIER = "#102019";
const BRAND_ICON_MULTICOLOR_PAPER_CARRIER = "#ffffff";
const BRAND_ICON_MULTICOLOR_DARK_CARRIER = "#111827";
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
    light: "#3f7f68",
    dark: "#86b9a4",
    modes: {
      light: {
        accent: "#3f7f68",
        accentStrong: "#2b5f4d",
        focus: "#527fa8",
        paper: "#f8f8f3",
        panel: "#fffefa",
        panelSoft: "#f1f4ef",
        inputBg: "#fffefa",
        hoverBg: "#edf2ec",
        ink: "#171b18",
        muted: "#5c665f",
        faint: "#7a827c"
      },
      dark: {
        accent: "#86b9a4",
        accentStrong: "#b3d7c8",
        focus: "#9bbfdf",
        paper: "#252d2b",
        panel: "#303936",
        panelSoft: "#3a4742",
        inputBg: "#303936",
        hoverBg: "#404d48",
        ink: "#f0f3ef",
        muted: "#bac4bc",
        faint: "#89938b",
        onAccent: "#102019"
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
    light: "#c78b1d",
    dark: "#e4b95a",
    modes: {
      light: {
        accent: "#c78b1d",
        accentStrong: "#91610d",
        focus: "#597e9f",
        paper: "#faf8f1",
        panel: "#fffefa",
        panelSoft: "#f5f0e3",
        inputBg: "#fffefa",
        hoverBg: "#f2eadb",
        ink: "#1b1812",
        muted: "#685f52",
        faint: "#83786a",
        onAccent: "#ffffff"
      },
      dark: {
        accent: "#e4b95a",
        accentStrong: "#f2d58e",
        focus: "#9ebfdb",
        paper: "#302b22",
        panel: "#3b3428",
        panelSoft: "#493f2f",
        inputBg: "#3b3428",
        hoverBg: "#544835",
        ink: "#f5f0e6",
        muted: "#c8bda8",
        faint: "#988d79",
        onAccent: "#ffffff"
      }
    }
  },
  {
    id: "sky",
    labelKey: "themePaletteSky",
    light: "#4f7ea8",
    dark: "#92b7dc",
    modes: {
      light: {
        accent: "#4f7ea8",
        accentStrong: "#365f82",
        focus: "#5b8b78",
        paper: "#f7f8f6",
        panel: "#ffffff",
        panelSoft: "#eef3f6",
        inputBg: "#ffffff",
        hoverBg: "#e9f0f4",
        ink: "#161a1d",
        muted: "#5b656d",
        faint: "#79838b"
      },
      dark: {
        accent: "#92b7dc",
        accentStrong: "#bed7ee",
        focus: "#9ed0bd",
        paper: "#232b34",
        panel: "#2d3742",
        panelSoft: "#384653",
        inputBg: "#2d3742",
        hoverBg: "#435461",
        ink: "#f0f3f5",
        muted: "#bcc6cf",
        faint: "#89939d",
        onAccent: "#0d1b2a"
      }
    }
  },
  {
    id: "peach",
    labelKey: "themePalettePeach",
    light: "#b06f55",
    dark: "#d8a28b",
    modes: {
      light: {
        accent: "#b06f55",
        accentStrong: "#854e39",
        focus: "#6d84a3",
        paper: "#faf8f4",
        panel: "#fffefa",
        panelSoft: "#f5f0e9",
        inputBg: "#fffefa",
        hoverBg: "#f2ebe3",
        ink: "#1d1916",
        muted: "#695f58",
        faint: "#847970",
        onAccent: "#ffffff"
      },
      dark: {
        accent: "#d8a28b",
        accentStrong: "#ecc4b4",
        focus: "#9fb7d5",
        paper: "#302724",
        panel: "#3b302c",
        panelSoft: "#493b35",
        inputBg: "#3b302c",
        hoverBg: "#55443d",
        ink: "#f5f1ed",
        muted: "#c8bcb4",
        faint: "#978b83",
        onAccent: "#ffffff"
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
const EDITABLE_AI_ENGINE_IDS = ["chatgpt", "claude", "gemini", "grok", "deepseek", "doubao", "kimi", "glm", "jimeng"];
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
  xiaohongshu: { mode: "mask", tile: "#ff2442", glyph: "#ffffff" },
  zhihu: { mode: "mask", tile: "#0084ff", glyph: "#ffffff" }
});
const DEFAULT_SEARCH_ENGINES = [
  { id: "local", label: "Aggregate search", labelKey: "quickSearchAggregate", local: true },
  { id: "google", label: "Google", searchUrl: "https://www.google.com/search", queryParam: "q", aggregateDefault: true },
  { id: "baidu", label: "百度", searchUrl: "https://www.baidu.com/s", queryParam: "wd" },
  { id: "bing", label: "Bing", searchUrl: "https://www.bing.com/search", queryParam: "q", aggregateDefault: true },
  { id: "chatgpt", command: "/gpt", commands: ["/gpt", "/chatgpt"], label: "ChatGPT", searchUrl: "https://chatgpt.com/", queryParam: "q", aiDirect: true, autoSubmit: true, directUrl: "https://chatgpt.com/", themeColor: "#10a37f" },
  { id: "claude", command: "/claude", label: "Claude", searchUrl: "https://claude.ai/new", queryParam: "q", aiDirect: true, autoSubmit: true, directUrl: "https://claude.ai/new", themeColor: "#d97757" },
  { id: "gemini", command: "/gemini", label: "Gemini", searchUrl: "https://gemini.google.com/app", queryParam: "q", aiDirect: true, autoSubmit: true, directUrl: "https://gemini.google.com/app", themeColor: "#4285f4" },
  { id: "grok", command: "/grok", label: "Grok", searchUrl: "https://grok.com/", queryParam: "q", aiDirect: true, autoSubmit: true, directUrl: "https://grok.com/", themeColor: "#777f86" },
  { id: "deepseek", command: "/deepseek", commands: ["/deepseek", "/ds"], label: "DeepSeek", searchUrl: "https://chat.deepseek.com/", queryParam: "q", aiDirect: true, autoSubmit: true, directUrl: "https://chat.deepseek.com/", themeColor: "#4d6bfe" },
  { id: "doubao", command: "/doubao", commands: ["/doubao", "/db"], label: "豆包", searchUrl: "https://www.doubao.com/chat/", queryParam: "q", aiDirect: true, autoSubmit: true, directUrl: "https://www.doubao.com/chat/", iconUrl: "icons/sites/doubao.png", themeColor: "#1e37fc" },
  { id: "kimi", command: "/kimi", label: "Kimi", searchUrl: "https://www.kimi.com/", queryParam: "q", aiDirect: true, autoSubmit: true, directUrl: "https://www.kimi.com/", themeColor: "#111827" },
  { id: "glm", command: "/glm", commands: ["/glm", "/chatglm", "/zhipu"], label: "GLM", searchUrl: "https://chatglm.cn/", queryParam: "q", aiDirect: true, autoSubmit: true, directUrl: "https://chatglm.cn/", themeColor: "#3859ff" },
  { id: "jimeng", command: "/jimeng", commands: ["/jimeng", "/jm"], label: "即梦", searchUrl: "https://jimeng.jianying.com/ai-tool/home", queryParam: "q", aiDirect: true, autoSubmit: true, directUrl: "https://jimeng.jianying.com/ai-tool/home", themeColor: "#1c6fff", urlPromptFallback: true }
];
const PLATFORM_SEARCH_TARGETS = Object.freeze([
  { id: "youtube", label: "YouTube", prefixes: ["*yt", "*youtube"], searchUrl: "https://www.youtube.com/results", queryParam: "search_query", iconUrl: "https://www.youtube.com/", themeColor: "#ff0000", behaviorKey: "platformSearchDirectBehavior" },
  { id: "x", label: "X", prefixes: ["*x", "*twitter"], searchUrl: "https://x.com/search", queryParam: "q", searchParams: { src: "typed_query" }, iconUrl: "https://x.com/", themeColor: "#000000", behaviorKey: "platformSearchLoginBehavior" },
  { id: "xiaohongshu", label: "小红书", prefixes: ["*xhs", "*rednote"], searchUrl: "https://www.xiaohongshu.com/search_result", queryParam: "keyword", searchParams: { source: "web_explore_feed" }, iconUrl: "https://www.xiaohongshu.com/", themeColor: "#ff2442", behaviorKey: "platformSearchLoginBehavior" },
  { id: "instagram", label: "Instagram", prefixes: ["*ig", "*instagram"], searchUrl: "https://www.instagram.com/explore/search/keyword/", queryParam: "q", iconUrl: "https://www.instagram.com/", fallback: true, themeColor: "#e4405f", behaviorKey: "platformSearchFallbackBehavior" },
  { id: "threads", label: "Threads", prefixes: ["*threads", "*th"], searchUrl: "https://www.threads.com/search", queryParam: "q", iconUrl: "https://www.threads.com/", fallback: true, themeColor: "#000000", behaviorKey: "platformSearchFallbackBehavior" },
  { id: "douyin", label: "抖音", prefixes: ["*dy", "*douyin"], searchUrl: "https://www.douyin.com/search/", pathQuery: true, searchParams: { type: "general" }, iconUrl: "https://www.douyin.com/", themeColor: "#000000", behaviorKey: "platformSearchLoginBehavior" },
  { id: "zhihu", label: "知乎", prefixes: ["*zhihu", "*zh"], searchUrl: "https://www.zhihu.com/search", queryParam: "q", searchParams: { type: "content" }, iconUrl: "https://www.zhihu.com/", themeColor: "#0084ff", behaviorKey: "platformSearchDirectBehavior" },
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
const SITE_ICON_DIRECTORY = "icons/sites";
const GENERIC_SITE_FALLBACK_ICON = `${SITE_ICON_DIRECTORY}/fallback.svg`;
const GENERIC_SITE_FALLBACK_TILE_COLOR = "#f04424";
const SITE_ICON_FILE_BY_SITE_KEY = Object.freeze({
  "1688.com": "1688.ico",
  "alipay.com": "alipay.svg",
  "alibaba.com": "alibabadotcom.svg",
  "analytics.google.com": "googleanalytics.svg",
  "aistudio.google.com": "aistudio.svg",
  "aws.amazon.com": "aws.svg",
  "atlassian.net": "jira.svg",
  "azure.microsoft.com": "azure.svg",
  "b.ai": "bai.png",
  "bitbucket.org": "bitbucket.svg",
  "booking.com": "bookingdotcom.svg",
  "bsky.app": "bluesky.svg",
  "calendar.google.com": "googlecalendar.svg",
  "chrome.google.com": "chrome.svg",
  "cloud.google.com": "googlecloud.svg",
  "code.visualstudio.com": "visualstudiocode.svg",
  "colab.research.google.com": "colab.svg",
  "datadoghq.com": "datadog.svg",
  "developer.mozilla.org": "mdn.svg",
  "chatglm.cn": "glm.svg",
  "doubao.com": "doubao.svg",
  "docs.b.ai": "baidocs.svg",
  "docs.google.com": "googledocs.svg",
  "douyin.com": "douyin.svg",
  "drive.google.com": "googledrive.svg",
  "store.epicgames.com": "epicgames.svg",
  "feishu.cn": "feishu.png",
  "firefly.adobe.com": "adobefirefly.svg",
  "firebase.google.com": "firebase.svg",
  "gemini.google.com": "googlegemini.svg",
  "itch.io": "itchdotio.svg",
  "jd.com": "jd.svg",
  "jimeng.jianying.com": "jimeng.svg",
  "iqiyi.com": "iqiyi.svg",
  "kimi.com": "kimi.svg",
  "larksuite.com": "larksuite.ico",
  "maps.google.com": "googlemaps.svg",
  "meet.google.com": "googlemeet.svg",
  "mimo.mi.com": "xiaomimimo.svg",
  "mimo.xiaomi.com": "xiaomimimo.svg",
  "mgtv.com": "mgtv.svg",
  "music.163.com": "neteasecloudmusic.svg",
  "nextjs.org": "nextdotjs.svg",
  "nodejs.org": "nodedotjs.svg",
  "npmjs.com": "npm.svg",
  "office.com": "microsoftoffice.svg",
  "pinduoduo.com": "pinduoduo.svg",
  "proton.me": "protonmail.svg",
  "teams.microsoft.com": "microsoftteams.svg",
  "tmall.com": "tmall.png",
  "trip.com": "tripdotcom.svg",
  "uizard.io": "uizard.ico",
  "v.qq.com": "vqq.svg",
  "vuejs.org": "vuedotjs.svg",
  "yandex.com": "yandex.ico"
});
const REMOTE_BRAND_ICON_PROVIDERS = Object.freeze([
  {
    id: "thesvg",
    index: "thesvg",
    urlForSlug: (slug) => `https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/${encodeURIComponent(slug)}/default.svg`
  },
  {
    id: "lobehub",
    index: "lobehub-static-svg",
    packageName: "@lobehub/icons-static-svg",
    urlForSlug: (slug) => `https://unpkg.com/@lobehub/icons-static-svg@latest/icons/${encodeURIComponent(slug)}.svg`
  }
]);
const REMOTE_BRAND_ICON_SLUGS_BY_SITE_KEY = Object.freeze({
  "atlassian.net": ["atlassian", "jira"],
  "calendar.google.com": ["googlecalendar", "google"],
  "code.visualstudio.com": ["visualstudiocode"],
  "developer.mozilla.org": ["mdnwebdocs", "mdn"],
  "docs.google.com": ["googledocs", "google"],
  "drive.google.com": ["googledrive", "google"],
  "gmail.com": ["gmail", "google"],
  "maps.google.com": ["googlemaps", "google"],
  "meet.google.com": ["googlemeet", "google"],
  "music.163.com": ["neteasecloudmusic"],
  "nextjs.org": ["nextdotjs", "nextjs"],
  "nodejs.org": ["nodedotjs", "nodejs"],
  "npmjs.com": ["npm"],
  "office.com": ["microsoftoffice", "microsoft"],
  "proton.me": ["protonmail", "proton"],
  "react.dev": ["react"],
  "steamcommunity.com": ["steam"],
  "steampowered.com": ["steam"],
  "stackoverflow.com": ["stackoverflow"],
  "teams.microsoft.com": ["microsoftteams", "microsoft"],
  "trip.com": ["tripdotcom"],
  "twitter.com": ["x", "twitter"],
  "vuejs.org": ["vuedotjs", "vue"],
  "x.com": ["x", "twitter"]
});
const SITE_ICON_TILE_COLOR_BY_SITE_KEY = Object.freeze({
  "1688.com": "#ff6000",
  "adobe.com": "#ff0000",
  "airbnb.com": "#ff5a5f",
  "alibaba.com": "#ff6a00",
  "alibabacloud.com": "#ff6a00",
  "aliexpress.com": "#e62e04",
  "alipay.com": "#1677ff",
  "amazon.com": "#ff9900",
  "anthropic.com": "#191919",
  "apple.com": "#000000",
  "atlassian.com": "#0052cc",
  "atlassian.net": "#0052cc",
  "aistudio.google.com": "#4285f4",
  "aws.amazon.com": "#ff9900",
  "azure.microsoft.com": "#0078d4",
  "baidu.com": "#2932e1",
  "bilibili.com": "#00a1d6",
  "bing.com": "#258ffa",
  "bitbucket.org": "#0052cc",
  "canva.com": "#00c4cc",
  "chatgpt.com": "#ffffff",
  "claude.ai": "#d97757",
  "cloudflare.com": "#f38020",
  "cloud.google.com": "#4285f4",
  "colab.research.google.com": "#f9ab00",
  "chrome.google.com": "#4285f4",
  "cursor.com": "#000000",
  "deepseek.com": "#4d6bfe",
  "discord.com": "#5865f2",
  "developer.mozilla.org": "#15141a",
  "docs.b.ai": "#111827",
  "chatglm.cn": "#3859ff",
  "doubao.com": "#1e37fc",
  "docs.google.com": "#4285f4",
  "douyin.com": "#000000",
  "duckduckgo.com": "#de5833",
  "figma.com": "#f24e1e",
  "firefly.adobe.com": "#ff0000",
  "firebase.google.com": "#dd2c00",
  "framer.com": "#000000",
  "calendar.google.com": "#4285f4",
  "gemini.google.com": "#4285f4",
  "github.com": "#181717",
  "gmail.com": "#ea4335",
  "google.com": "#4285f4",
  "grok.com": "#000000",
  "drive.google.com": "#4285f4",
  "huggingface.co": "#ffd21e",
  "iconfont.cn": "#0c6066",
  "instagram.com": "#e4405f",
  "iqiyi.com": "#689f38",
  "jd.com": "#ff0000",
  "jimeng.jianying.com": "#1c6fff",
  "kagi.com": "#ffb319",
  "kimi.com": "#111827",
  "larksuite.com": "#00d6b9",
  "linkedin.com": "#0a66c2",
  "microsoft.com": "#5e5e5e",
  "mimo.mi.com": "#000000",
  "mimo.xiaomi.com": "#000000",
  "mgtv.com": "#f86f11",
  "midjourney.com": "#0050c9",
  "notion.so": "#000000",
  "openai.com": "#412991",
  "perplexity.ai": "#1fb8cd",
  "pinterest.com": "#bd081c",
  "pinduoduo.com": "#e02e24",
  "poe.com": "#5d5cde",
  "reddit.com": "#ff4500",
  "replicate.com": "#000000",
  "slack.com": "#4a154b",
  "sogou.com": "#fb6022",
  "spotify.com": "#1ed760",
  "stackoverflow.com": "#f58025",
  "suno.com": "#000000",
  "taobao.com": "#e94f20",
  "teams.microsoft.com": "#6264a7",
  "threads.com": "#000000",
  "tiktok.com": "#000000",
  "tmall.com": "#ff0036",
  "uizard.io": "#00f9e5",
  "v.qq.com": "#30a3f9",
  "vercel.com": "#000000",
  "wechat.com": "#07c160",
  "weibo.com": "#e6162d",
  "x.com": "#000000",
  "xiaohongshu.com": "#ff2442",
  "xiaomimimo.com": "#000000",
  "yandex.com": "#ffcc00",
  "youtube.com": "#ff0000",
  "zhihu.com": "#0084ff"
});
const ORIGINAL_ARTWORK_BRAND_TILE_SITE_KEYS = new Set([
  "developer.mozilla.org",
  "jd.com"
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
    mobilePortalTab: "快捷",
    mobileMediaTab: "信息",
    mobileHistoryTab: "历史",
    smartPortalTab: "网站推荐",
    bookmarkPortalTab: "自选书签",
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
    historyTitle: "最近浏览",
    openPortalSurface: "打开导航中枢",
    recentFoldersSwitch: "切换最近浏览卡片",
    recentFoldersPrevious: "上一组最近浏览",
    recentFoldersNext: "下一组最近浏览",
    historyPreviousPage: "上一条最近浏览",
    historyNextPage: "下一条最近浏览",
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
    videoPipLabTitle: "视频自动画中画",
    videoPipLabDescription: "兼容 HTML5 视频可用。",
    videoPipGlobalLabel: "全局允许视频自动画中画",
    videoPipGlobalHint: "全局启用后，兼容视频页可自动画中画。",
    socialVideoExtractorTitle: "社交视频小窗",
    socialVideoExtractorDescription: "",
    socialVideoExtractorLabel: "启用社交视频小窗",
    socialVideoExtractorHint: "点击工具栏图标，选择页面中的可播放视频。",
    socialVideoExtractorSupport: "目前支持：小红书、X",
    languageSettingsTitle: "语言",
    appearanceModeTitle: "外观",
    themeModeSystem: "跟随系统",
    themeModeLight: "浅色",
    themeModeDark: "深色",
    presetPaletteTitle: "色彩",
    themePaletteSage: "松叶",
    themePaletteForest: "墨绿",
    themePaletteAmber: "琥珀",
    themePaletteSky: "湖蓝",
    themePalettePeach: "珊瑚",
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
    onboardingSyncTitle: "查看最近浏览",
    onboardingSyncBody: "下方会按网站整理最近访问内容，并保留同一网站的相关页面。",
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
    bookmarkNoFolder: "还没有选择书签文件夹。点击右上角 + 后选择一个文件夹。",
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
    mobilePortalTab: "快捷",
    mobileMediaTab: "資訊",
    smartPortalTab: "網站推薦",
    bookmarkPortalTab: "自選書籤",
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
    historyTitle: "最近瀏覽",
    openPortalSurface: "打開導航中樞",
    recentFoldersSwitch: "切換最近瀏覽卡片",
    recentFoldersPrevious: "上一組最近瀏覽",
    recentFoldersNext: "下一組最近瀏覽",
    historyPreviousPage: "上一條最近瀏覽",
    historyNextPage: "下一條最近瀏覽",
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
    videoPipLabTitle: "影片自動畫中畫",
    videoPipLabDescription: "",
    videoPipGlobalLabel: "全域影片自動畫中畫",
    videoPipGlobalHint: "全域啟用後，相容影片頁可自動畫中畫。",
    socialVideoExtractorTitle: "社交視頻小窗",
    socialVideoExtractorDescription: "",
    socialVideoExtractorLabel: "啟用社交視頻小窗",
    socialVideoExtractorHint: "點擊工具列圖標，選取頁面中的可播放影片。",
    socialVideoExtractorSupport: "目前支援：小紅書、X",
    languageSettingsTitle: "語言",
    appearanceModeTitle: "外觀",
    themeModeSystem: "跟隨系統",
    themeModeLight: "淺色",
    themeModeDark: "深色",
    presetPaletteTitle: "色彩",
    themePaletteSage: "松葉",
    themePaletteForest: "墨綠",
    themePaletteAmber: "琥珀",
    themePaletteSky: "湖藍",
    themePalettePeach: "珊瑚",
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
    onboardingSyncTitle: "查看最近瀏覽",
    onboardingSyncBody: "下方會依網站整理最近造訪內容，並保留同一網站的相關頁面。",
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
    bookmarkNoFolder: "尚未選擇書籤資料夾。點擊右上角 + 後選擇一個資料夾。",
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
    mobilePortalTab: "Shortcuts",
    mobileMediaTab: "Media",
    mobileHistoryTab: "History",
    smartPortalTab: "Recommended",
    bookmarkPortalTab: "Bookmarks",
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
    chooseBookmarkFolder: "Choose bookmark folder",
    collapseSurface: "Collapse panel",
    back: "Back",
    chooseBookmarkFolderPrompt: "Choose a bookmark folder",
    historyTitle: "Recent browsing",
    openPortalSurface: "Open navigation hub",
    recentFoldersSwitch: "Switch recent cards",
    recentFoldersPrevious: "Previous recent cards",
    recentFoldersNext: "Next recent cards",
    historyPreviousPage: "Previous recent page",
    historyNextPage: "Next recent page",
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
    videoPipLabTitle: "Automatic video Picture-in-Picture",
    videoPipLabDescription: "Picture-in-Picture for compatible HTML5 video.",
    videoPipGlobalLabel: "Allow automatic video Picture-in-Picture globally",
    videoPipGlobalHint: "When enabled globally, compatible video pages can enter Picture-in-Picture automatically.",
    socialVideoExtractorTitle: "Social video mini-player",
    socialVideoExtractorDescription: "",
    socialVideoExtractorLabel: "Enable social video mini-player",
    socialVideoExtractorHint: "Click the toolbar icon, then select a playable video on the page.",
    socialVideoExtractorSupport: "Currently supported: Xiaohongshu, X",
    languageSettingsTitle: "Language",
    appearanceModeTitle: "Appearance",
    themeModeSystem: "System",
    themeModeLight: "Light",
    themeModeDark: "Dark",
    presetPaletteTitle: "Colors",
    themePaletteSage: "Sage",
    themePaletteForest: "Forest",
    themePaletteAmber: "Amber",
    themePaletteSky: "Sky",
    themePalettePeach: "Coral",
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
    onboardingSyncTitle: "Review recent browsing",
    onboardingSyncBody: "Recent visits are grouped by website below, including related pages from the same site.",
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
    bookmarkNoFolder: "No bookmark folder selected. Use + in the top right to choose one.",
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
    historyTitle: "最近の閲覧",
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
    videoPipLabTitle: "動画の自動ピクチャーインピクチャー",
    videoPipLabDescription: "互換 HTML5 動画のピクチャーインピクチャー。",
    videoPipGlobalLabel: "動画の自動ピクチャーインピクチャーを全体で許可",
    videoPipGlobalHint: "全体で有効にすると、対応する動画ページは自動でピクチャーインピクチャーに入れます。",
    socialVideoExtractorTitle: "ソーシャル動画ミニプレーヤー",
    socialVideoExtractorDescription: "",
    socialVideoExtractorLabel: "ソーシャル動画ミニプレーヤーを有効化",
    socialVideoExtractorHint: "ツールバーアイコンをクリックし、ページ内の再生可能な動画を選択します。",
    socialVideoExtractorSupport: "現在対応：小紅書、X",
    languageSettingsTitle: "言語",
    appearanceModeTitle: "外観",
    themeModeSystem: "システム",
    themeModeLight: "ライト",
    themeModeDark: "ダーク",
    presetPaletteTitle: "カラー",
    themePaletteSage: "セージ",
    themePaletteForest: "フォレスト",
    themePaletteAmber: "アンバー",
    themePaletteSky: "スカイ",
    themePalettePeach: "コーラル",
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
    historyTitle: "최근 방문",
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
    videoPipLabTitle: "동영상 자동 화면 속 화면",
    videoPipLabDescription: "호환 HTML5 동영상 화면 속 화면.",
    videoPipGlobalLabel: "동영상 자동 화면 속 화면 전역 허용",
    videoPipGlobalHint: "전체 사용 시 호환 동영상 페이지가 자동으로 화면 속 화면에 들어갈 수 있습니다.",
    socialVideoExtractorTitle: "소셜 동영상 미니 플레이어",
    socialVideoExtractorDescription: "",
    socialVideoExtractorLabel: "소셜 동영상 미니 플레이어 사용",
    socialVideoExtractorHint: "도구 모음 아이콘을 클릭한 뒤 페이지의 재생 가능한 동영상을 선택하세요.",
    socialVideoExtractorSupport: "현재 지원: 샤오홍슈, X",
    languageSettingsTitle: "언어",
    appearanceModeTitle: "모양",
    themeModeSystem: "시스템",
    themeModeLight: "라이트",
    themeModeDark: "다크",
    presetPaletteTitle: "색상",
    themePaletteSage: "세이지",
    themePaletteForest: "포레스트",
    themePaletteAmber: "앰버",
    themePaletteSky: "스카이",
    themePalettePeach: "코럴",
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
    historyTitle: "Recientes",
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
    videoPipLabTitle: "Vídeo automático en imagen dentro de imagen",
    videoPipLabDescription: "Picture-in-Picture para vídeo HTML5 compatible.",
    videoPipGlobalLabel: "Permitir vídeo automático en imagen dentro de imagen globalmente",
    videoPipGlobalHint: "Al activarlo globalmente, las páginas de vídeo compatibles pueden entrar automáticamente en imagen dentro de imagen.",
    socialVideoExtractorTitle: "Mini reproductor de vídeo social",
    socialVideoExtractorDescription: "",
    socialVideoExtractorLabel: "Activar mini reproductor de vídeo social",
    socialVideoExtractorHint: "Haz clic en el icono de la barra y selecciona un vídeo reproducible en la página.",
    socialVideoExtractorSupport: "Compatible actualmente: Xiaohongshu, X",
    languageSettingsTitle: "Idioma",
    appearanceModeTitle: "Apariencia",
    themeModeSystem: "Sistema",
    themeModeLight: "Claro",
    themeModeDark: "Oscuro",
    presetPaletteTitle: "Colores",
    themePaletteSage: "Salvia",
    themePaletteForest: "Bosque",
    themePaletteAmber: "Ámbar",
    themePaletteSky: "Cielo",
    themePalettePeach: "Coral",
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
    historyTitle: "Navigation récente",
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
    videoPipLabTitle: "Vidéo automatique en mode image dans l’image",
    videoPipLabDescription: "Image dans l’image pour vidéo HTML5 compatible.",
    videoPipGlobalLabel: "Autoriser globalement la vidéo automatique en mode image dans l’image",
    videoPipGlobalHint: "Une fois activé globalement, les pages vidéo compatibles peuvent passer automatiquement en image dans l’image.",
    socialVideoExtractorTitle: "Mini-lecteur vidéo social",
    socialVideoExtractorDescription: "",
    socialVideoExtractorLabel: "Activer le mini-lecteur vidéo social",
    socialVideoExtractorHint: "Cliquez sur l’icône de la barre d’outils, puis sélectionnez une vidéo lisible sur la page.",
    socialVideoExtractorSupport: "Actuellement pris en charge : Xiaohongshu, X",
    languageSettingsTitle: "Langue",
    appearanceModeTitle: "Apparence",
    themeModeSystem: "Système",
    themeModeLight: "Clair",
    themeModeDark: "Sombre",
    presetPaletteTitle: "Couleurs",
    themePaletteSage: "Sauge",
    themePaletteForest: "Forêt",
    themePaletteAmber: "Ambre",
    themePaletteSky: "Ciel",
    themePalettePeach: "Corail",
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
    historyTitle: "Zuletzt besucht",
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
    videoPipLabTitle: "Automatisches Video-Bild-in-Bild",
    videoPipLabDescription: "Bild-in-Bild für kompatibles HTML5-Video.",
    videoPipGlobalLabel: "Automatisches Video-Bild-in-Bild global erlauben",
    videoPipGlobalHint: "Global aktiviert können kompatible Videoseiten automatisch in den Bild-in-Bild-Modus wechseln.",
    socialVideoExtractorTitle: "Social-Video-Miniplayer",
    socialVideoExtractorDescription: "",
    socialVideoExtractorLabel: "Social-Video-Miniplayer aktivieren",
    socialVideoExtractorHint: "Klicken Sie auf das Symbol in der Symbolleiste und wählen Sie ein abspielbares Video auf der Seite aus.",
    socialVideoExtractorSupport: "Derzeit unterstützt: Xiaohongshu, X",
    languageSettingsTitle: "Sprache",
    appearanceModeTitle: "Darstellung",
    themeModeSystem: "System",
    themeModeLight: "Hell",
    themeModeDark: "Dunkel",
    presetPaletteTitle: "Farben",
    themePaletteSage: "Salbei",
    themePaletteForest: "Wald",
    themePaletteAmber: "Bernstein",
    themePaletteSky: "Himmel",
    themePalettePeach: "Koralle",
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
    mobilePortalTab: "ショートカット",
    mobileMediaTab: "メディア",
    mobileHistoryTab: "履歴",
    smartPortalTab: "おすすめ",
    bookmarkPortalTab: "ブックマーク",
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
    recentFoldersSwitch: "最近カードを切り替え",
    recentFoldersPrevious: "前の最近カード",
    recentFoldersNext: "次の最近カード",
    historyPreviousPage: "前の最近ページ",
    historyNextPage: "次の最近ページ",
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
    onboardingSyncTitle: "最近の閲覧を確認",
    onboardingSyncBody: "最近の訪問はサイトごとに整理され、同じサイトの関連ページも表示されます。",
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
    bookmarkNoFolder: "ブックマークフォルダが選択されていません。右上の + から選択してください。",
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
    mobilePortalTab: "바로가기",
    mobileMediaTab: "미디어",
    mobileHistoryTab: "기록",
    smartPortalTab: "추천 사이트",
    bookmarkPortalTab: "북마크",
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
    recentFoldersSwitch: "최근 카드 전환",
    recentFoldersPrevious: "이전 최근 카드",
    recentFoldersNext: "다음 최근 카드",
    historyPreviousPage: "이전 최근 페이지",
    historyNextPage: "다음 최근 페이지",
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
    onboardingSyncTitle: "최근 방문 확인",
    onboardingSyncBody: "최근 방문은 사이트별로 정리되며 같은 사이트의 관련 페이지도 함께 표시됩니다.",
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
    bookmarkNoFolder: "선택된 북마크 폴더가 없습니다. 오른쪽 위 +로 선택하세요.",
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
    mobilePortalTab: "Accesos",
    mobileMediaTab: "Medios",
    mobileHistoryTab: "Historial",
    smartPortalTab: "Recomendados",
    bookmarkPortalTab: "Marcadores",
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
    recentFoldersSwitch: "Cambiar tarjetas recientes",
    recentFoldersPrevious: "Tarjetas recientes anteriores",
    recentFoldersNext: "Tarjetas recientes siguientes",
    historyPreviousPage: "Página reciente anterior",
    historyNextPage: "Página reciente siguiente",
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
    onboardingSyncTitle: "Revisa la navegación reciente",
    onboardingSyncBody: "Las visitas recientes se agrupan por sitio e incluyen páginas relacionadas del mismo dominio.",
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
    bookmarkNoFolder: "No hay carpeta de marcadores seleccionada. Usa + arriba a la derecha para elegir una.",
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
    mobilePortalTab: "Raccourcis",
    mobileMediaTab: "Médias",
    mobileHistoryTab: "Historique",
    smartPortalTab: "Recommandés",
    bookmarkPortalTab: "Favoris",
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
    recentFoldersSwitch: "Changer les cartes récentes",
    recentFoldersPrevious: "Cartes récentes précédentes",
    recentFoldersNext: "Cartes récentes suivantes",
    historyPreviousPage: "Page récente précédente",
    historyNextPage: "Page récente suivante",
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
    onboardingSyncTitle: "Consultez la navigation récente",
    onboardingSyncBody: "Les visites récentes sont regroupées par site avec les pages associées du même domaine.",
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
    bookmarkNoFolder: "Aucun dossier de favoris sélectionné. Utilisez + en haut à droite pour en choisir un.",
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
    mobilePortalTab: "Kurzbefehle",
    mobileMediaTab: "Medien",
    mobileHistoryTab: "Verlauf",
    smartPortalTab: "Empfohlen",
    bookmarkPortalTab: "Lesezeichen",
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
    recentFoldersSwitch: "Aktuelle Karten wechseln",
    recentFoldersPrevious: "Vorherige aktuelle Karten",
    recentFoldersNext: "Nächste aktuelle Karten",
    historyPreviousPage: "Vorherige aktuelle Seite",
    historyNextPage: "Nächste aktuelle Seite",
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
    onboardingSyncTitle: "Zuletzt besuchte Seiten ansehen",
    onboardingSyncBody: "Letzte Besuche werden nach Website gruppiert und zeigen auch zugehörige Seiten derselben Domain.",
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
    bookmarkNoFolder: "Kein Lesezeichenordner ausgewählt. Mit + oben rechts einen auswählen.",
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
const bookmarkFolderMeta = document.querySelector("#bookmarkFolderMeta");
const bookmarkPicker = document.querySelector("#bookmarkPicker");
const bookmarkPickerToolbar = document.querySelector("#bookmarkPickerToolbar");
const bookmarkFolderList = document.querySelector("#bookmarkFolderList");
const chooseBookmarkFolderButton = document.querySelector("#chooseBookmarkFolderButton");
const refreshBookmarkFolderButton = document.querySelector("#refreshBookmarkFolderButton");
const bookmarkFavoriteAddButton = document.querySelector("#bookmarkFavoriteAddButton");
const closeBookmarkPickerButton = document.querySelector("#closeBookmarkPickerButton");
const bookmarkPickerTitle = document.querySelector("#bookmarkPickerTitle");
const recentHistoryFolders = document.querySelector("#recentHistoryFolders");
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
const videoPipGlobalToggle = document.querySelector("#videoPipGlobalToggle");
const socialVideoExtractorToggle = document.querySelector("#socialVideoExtractorToggle");
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
let activePortalView = "smart";
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
let favoriteSitesHydrated = false;
let onboardingStepIndex = 0;
let onboardingPreviewActive = false;
let videoPipGlobalEnabled = false;
let socialVideoExtractorEnabled = true;
let aiDirectAttachments = [];
let availableSiteIconFiles = new Set();
let siteIconIndexLoaded = false;
const whiteSvgIconDataUrlCache = new Map();
const localSiteIconBrandColorCache = new Map();
const localSiteIconRenderModeCache = new Map();
const localSiteIconExplicitBrandColorCache = new Map();
const localSiteIconVisibleColorsCache = new Map();
const localSiteIconEmbeddedCarrierColorCache = new Map();
const localSiteIconBrandColorRequests = new Map();
const siteIconDiscoveryCache = new Map();
const remoteBrandIconIndexCache = new Map();
const siteIconRawSvgTextCache = new Map();
const siteIconRawSvgStalePaths = new Set();
const siteIconRawSvgRevalidatedPaths = new Set();

ensureChromeApiFallback();
document.addEventListener("DOMContentLoaded", initWithStorageMigration);

async function initWithStorageMigration() {
  void migrateSyncStorageFromLocal();
  await init();
}

async function initSiteIconIndex() {
  siteIconIndexLoaded = false;
  try {
    const response = await fetch(`${SITE_ICON_DIRECTORY}/index.json`);
    if (!response.ok) {
      throw new Error(`Site icon index request failed: ${response.status}`);
    }
    const files = await response.json();
    availableSiteIconFiles = new Set(Array.isArray(files)
      ? files.filter((file) => typeof file === "string")
      : []);
  } catch (error) {
    console.warn("Failed to load site icon index", error);
    availableSiteIconFiles = new Set();
  } finally {
    siteIconIndexLoaded = true;
  }
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
    if (cache.codeSignature !== iconRenderCodeSignature()) {
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
      codeSignature: iconRenderCodeSignature()
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

// Signature over the icon-rendering functions' source. Any edit to the layer 1/2/3
// rendering logic changes this string, so the first-paint render-output cache is
// treated as empty and icons recompute from the latest code. The raw-SVG text cache
// intentionally does NOT use this — raw text is algorithm input, not output.
let iconRenderCodeSignatureMemo = "";
function iconRenderCodeSignature() {
  if (iconRenderCodeSignatureMemo) {
    return iconRenderCodeSignatureMemo;
  }
  const fns = [
    applySiteIcon, applySiteIconTile, computeSiteIconTile, displayIconSource, coloredSvgIconSource,
    applySvgGlyphColor, iconGlyphColorForCurrentTile, shouldInvertBrandSvg, localBrandGlyphColorForTile,
    brandIconTileColors, gradientSvgIconTileColors, originalSvgIconTileColors,
    usesGradientIconCarrier, usesOriginalIconCarrier, svgEmbeddedCarrierColor, localSiteIconAnalysisFromSvg
  ];
  let hash = 0;
  let lenSum = 0;
  for (const fn of fns) {
    let src = "";
    try {
      src = typeof fn === "function" ? fn.toString() : "";
    } catch {
      src = "";
    }
    lenSum += src.length;
    for (let index = 0; index < src.length; index += 1) {
      hash = ((hash << 5) - hash + src.charCodeAt(index)) | 0;
    }
  }
  iconRenderCodeSignatureMemo = `${lenSum.toString(36)}.${(hash >>> 0).toString(36)}`;
  return iconRenderCodeSignatureMemo;
}

function readSiteIconRawSvgCache() {
  try {
    const cache = JSON.parse(localStorage.getItem(SITE_ICON_RAW_SVG_CACHE_STORAGE_KEY) || "{}");
    return cache && typeof cache === "object" && !Array.isArray(cache) ? cache : {};
  } catch {
    return {};
  }
}

function writeSiteIconRawSvgCacheEntry(path, svg) {
  const key = String(path || "");
  const text = String(svg || "");
  if (!key.startsWith(`${SITE_ICON_DIRECTORY}/`) || !text || text.length > MAX_CACHED_SITE_ICON_SVG_BYTES) {
    return;
  }
  const cache = readSiteIconRawSvgCache();
  cache[key] = { svg: text, updatedAt: Date.now(), version: firstPaintExtensionVersion() };
  const evictPast = (entries, keepCount) => {
    entries
      .sort(([, first], [, second]) => Number(second?.updatedAt || 0) - Number(first?.updatedAt || 0))
      .slice(keepCount)
      .forEach(([staleKey]) => delete cache[staleKey]);
  };
  evictPast(Object.entries(cache), MAX_CACHED_SITE_ICON_SVG_ENTRIES);
  try {
    localStorage.setItem(SITE_ICON_RAW_SVG_CACHE_STORAGE_KEY, JSON.stringify(cache));
  } catch {
    evictPast(Object.entries(cache), Math.floor(MAX_CACHED_SITE_ICON_SVG_ENTRIES / 2));
    try {
      localStorage.setItem(SITE_ICON_RAW_SVG_CACHE_STORAGE_KEY, JSON.stringify(cache));
    } catch {}
  }
}

function rememberSiteIconRawSvgText(path, svg) {
  const key = String(path || "");
  const text = String(svg || "");
  if (!key || !text) {
    return;
  }
  siteIconRawSvgTextCache.set(key, text);
  // Freshly fetched under the current version → no longer version-stale.
  siteIconRawSvgStalePaths.delete(key);
  writeSiteIconRawSvgCacheEntry(key, text);
}

function localSiteIconRawSvgText(path) {
  return siteIconRawSvgTextCache.get(String(path || "")) || "";
}

// Run the existing synchronous analysis pipeline over cached SVG text so tile/brand-color
// decisions are warm before first paint. Never overrides an analysis already present
// (e.g. remote-brand overrides set elsewhere).
function hydrateLocalSiteIconAnalysisFromText(path, svg) {
  const key = String(path || "");
  const text = String(svg || "");
  if (!key || !text || localSiteIconRenderModeCache.has(key)) {
    return;
  }
  cacheLocalSiteIconAnalysis(key, localSiteIconAnalysisFromSvg(text));
}

function primeSiteIconRawSvgCacheFromStorage() {
  const cache = readSiteIconRawSvgCache();
  const currentVersion = firstPaintExtensionVersion();
  Object.entries(cache).forEach(([path, entry]) => {
    const text = typeof entry?.svg === "string" ? entry.svg : "";
    if (!text) {
      return;
    }
    siteIconRawSvgTextCache.set(path, text);
    hydrateLocalSiteIconAnalysisFromText(path, text);
    // Cached under an older extension version: the bundled file may have changed in the
    // update, so mark it for a one-time background revalidation when it next displays.
    if (entry?.version !== currentVersion) {
      siteIconRawSvgStalePaths.add(path);
    }
  });
}

function invalidateLocalSiteIconRenderCaches(path) {
  const key = String(path || "");
  if (!key) {
    return;
  }
  localSiteIconBrandColorCache.delete(key);
  localSiteIconRenderModeCache.delete(key);
  localSiteIconExplicitBrandColorCache.delete(key);
  localSiteIconVisibleColorsCache.delete(key);
  localSiteIconEmbeddedCarrierColorCache.delete(key);
  localSiteIconBrandColorRequests.delete(key);
  for (const memoKey of [...whiteSvgIconDataUrlCache.keys()]) {
    if (memoKey.endsWith(`:${key}`)) {
      whiteSvgIconDataUrlCache.delete(memoKey);
    }
  }
}

function scheduleIconIdleTask(task) {
  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(task, { timeout: 2000 });
  } else {
    setTimeout(task, 200);
  }
}

// Background, version-gated self-heal for a displayed local icon: only runs for paths
// cached under an older extension version (a release may have swapped the bundled SVG).
// Re-renders only when the file actually changed — unchanged files just re-stamp silently,
// so the user never sees a reload for a fixed-style icon.
function revalidateDisplayedLocalSiteIcon(path) {
  const key = String(path || "");
  if (!siteIconRawSvgStalePaths.has(key) || siteIconRawSvgRevalidatedPaths.has(key)) {
    return;
  }
  siteIconRawSvgRevalidatedPaths.add(key);
  fetch(key)
    .then((response) => response.ok ? response.text() : "")
    .then((svg) => {
      if (!svg) {
        siteIconRawSvgStalePaths.delete(key);
        return;
      }
      const previous = siteIconRawSvgTextCache.get(key) || "";
      rememberSiteIconRawSvgText(key, svg);
      if (svg === previous) {
        return;
      }
      invalidateLocalSiteIconRenderCaches(key);
      hydrateLocalSiteIconAnalysisFromText(key, svg);
      document.querySelectorAll("img[data-site-url]").forEach((node) => {
        if (node.dataset.iconSource !== key) {
          return;
        }
        applySiteIcon(node, {
          title: node.dataset.siteTitle || node.alt || "",
          url: node.dataset.siteUrl || ""
        });
      });
    })
    .catch(() => {});
}

function renderFirstPaintCache() {
  primeSiteIconRawSvgCacheFromStorage();
  const cache = readFirstPaintCache();
  const favoriteSites = normalizeCachedFavoriteSites(cache.favoriteSites);
  const recentGroups = normalizeCachedRecentGroups(cache.recentGroups);
  if (favoriteSites.length) {
    renderFavoriteSiteList(favoriteSites, { iconRenders: cache.iconRenders });
  }
  if (recentGroups.length) {
    renderRecentFolders(recentGroups, { iconRenders: cache.iconRenders });
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
    deleteUrls: group.deleteUrls,
    pages: (group.pages || []).slice(0, MAX_HISTORY_PAGES_PER_SITE).map((item) => ({
      title: normalizeText(item.title),
      url: item.url,
      lastVisitTime: Number(item.lastVisitTime || 0),
      visitCount: Number(item.visitCount || 0),
      typedCount: Number(item.typedCount || 0)
    }))
  }));
}

function firstPaintIconCacheKey(site) {
  const url = safeUrl(site?.url);
  return siteGroupKey(url) || url?.hostname || "";
}

function cachedFirstPaintIconRender(iconRenders, site) {
  const mode = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  const entry = iconRenders?.[firstPaintIconCacheKey(site)];
  const value = entry?.[mode];
  const src = typeof value?.src === "string" && value.src.length <= MAX_CACHED_SITE_ICON_BYTES * 2 ? value.src : "";
  const tileLight = typeof value?.tileLight === "string" && value.tileLight.length <= 128 ? value.tileLight : "";
  const tileDark = typeof value?.tileDark === "string" && value.tileDark.length <= 128 ? value.tileDark : "";
  if (!src || !tileLight || !tileDark || Date.now() - Number(value.updatedAt || 0) > SITE_ICON_CACHE_TTL_MS) {
    return null;
  }
  return {
    src,
    source: typeof entry.source === "string" && entry.source.length <= MAX_CACHED_SITE_ICON_BYTES * 2 ? entry.source : "",
    tile: value.tile === "brand" || value.tile === "generated" ? value.tile : "plain",
    tileLight,
    tileDark,
    local: Boolean(value.local),
    generic: Boolean(value.generic),
    adaptiveCarrierVersion: Number(value.adaptiveCarrierVersion || 0)
  };
}

function restoreFirstPaintIconRender(icon, site, render) {
  storeIconSiteContext(icon, site);
  icon.dataset.siteKey = firstPaintIconCacheKey(site);
  const localIcon = localIconForUrl(site.url);
  const currentRender = firstPaintIconRenderWithCurrentTile(site, render);
  if (siteIconIndexLoaded && localIcon && firstPaintRenderStaleForLocalIcon(icon.dataset.siteKey, localIcon, render)) {
    applySiteIcon(icon, site);
    return;
  }
  if (firstPaintRenderStaleForAdaptiveFavicon(localIcon, currentRender)) {
    applySiteIcon(icon, site);
    return;
  }
  if (currentRender.source) {
    icon.dataset.iconSource = currentRender.source;
    icon.dataset.iconCandidate = currentRender.source;
  }
  icon.classList.toggle("site-icon-generic-fallback", currentRender.generic);
  applyIconTile(icon, currentRender.tile, { light: currentRender.tileLight, dark: currentRender.tileDark }, currentRender.local);
  icon.dataset.iconCacheHydrated = "true";
  icon.addEventListener("error", () => {
    if (icon.dataset.iconCacheHydrated === "true") {
      delete icon.dataset.iconCacheHydrated;
      applySiteIcon(icon, site);
    }
  }, { once: true });
  icon.src = currentRender.src;
}

function firstPaintIconRenderWithCurrentTile(site, render) {
  const source = render.source || render.src || "";
  const remoteDescriptor = remoteBrandSvgDescriptorFromSource(source);
  if (!siteIconSourceLooksLikeSvg(source) && !remoteDescriptor) {
    return render;
  }
  if (!remoteDescriptor && !localSiteIconRenderModeCache.has(source)) {
    return render;
  }
  const tileSource = remoteDescriptor ? source : localIconForUrl(site.url) || source;
  const siteKey = firstPaintIconCacheKey(site);
  const tileColor = siteIconBrandColor(siteKey, tileSource);
  const originalSvgColor = usesOriginalIconCarrier(tileSource) ? "#ffffff" : "";
  const gradientSvgColor = usesGradientIconCarrier(tileSource) ? "#ffffff" : "";
  if (!tileColor && !originalSvgColor && !gradientSvgColor) {
    return render;
  }
  const tileColors = brandIconTileColors(tileColor || originalSvgColor || gradientSvgColor, siteKey, tileSource);
  return {
    ...render,
    tile: tileSource ? "brand" : render.tile,
    tileLight: tileColors.light,
    tileDark: tileColors.dark,
    local: String(tileSource || "").startsWith("icons/") || render.local
  };
}

function firstPaintRenderStaleForLocalIcon(siteKey, localIcon, render) {
  if (!localIcon) {
    return false;
  }
  if (render.src !== localIcon && render.source !== localIcon) {
    return true;
  }
  return render.source === localIcon
    && render.src !== localIcon
    && keepsBrandIconOriginal(siteKey, localIcon);
}

function firstPaintRenderStaleForAdaptiveFavicon(localIcon, render) {
  return !localIcon
    && render.tile === "plain"
    && !render.local
    && !render.generic
    && render.adaptiveCarrierVersion !== FAVICON_ADAPTIVE_CARRIER_VERSION;
}

function adaptiveFaviconCarrierCacheVersion(icon) {
  return icon.dataset.iconTile === "plain"
    && !icon.classList.contains("site-icon-local")
    && !icon.classList.contains("site-icon-generic-fallback")
    ? FAVICON_ADAPTIVE_CARRIER_VERSION
    : 0;
}

function cacheRenderedSiteIcon(icon, site) {
  if (icon.dataset.iconDefaultProbe === "pending" || icon.dataset.iconDefaultRescue === "pending") {
    return;
  }
  const key = firstPaintIconCacheKey(site);
  const src = icon.getAttribute("src") || "";
  const tileLight = icon.style.getPropertyValue("--site-icon-tile-light").trim();
  const tileDark = icon.style.getPropertyValue("--site-icon-tile-dark").trim();
  if (!key || !src || src.length > MAX_CACHED_SITE_ICON_BYTES * 2 || !tileLight || !tileDark) {
    return;
  }
  const mode = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  const cache = readFirstPaintCache();
  const iconRenders = { ...(cache.iconRenders || {}) };
  const adaptiveCarrierVersion = adaptiveFaviconCarrierCacheVersion(icon);
  const render = {
    src,
    tile: icon.dataset.iconTile || "plain",
    tileLight,
    tileDark,
    local: icon.classList.contains("site-icon-local"),
    generic: icon.classList.contains("site-icon-generic-fallback"),
    adaptiveCarrierVersion,
    updatedAt: Date.now()
  };
  const themedRenders = adaptiveCarrierVersion
    ? { light: render, dark: render }
    : { [mode]: render };
  iconRenders[key] = {
    ...(iconRenders[key] || {}),
    source: icon.dataset.iconSource || iconRenders[key]?.source || "",
    ...themedRenders
  };
  Object.entries(iconRenders)
    .sort(([, first], [, second]) => Math.max(Number(second.light?.updatedAt || 0), Number(second.dark?.updatedAt || 0))
      - Math.max(Number(first.light?.updatedAt || 0), Number(first.dark?.updatedAt || 0)))
    .slice(MAX_FAVORITE_SITES + MAX_HISTORY_SITE_GROUPS)
    .forEach(([staleKey]) => delete iconRenders[staleKey]);
  writeFirstPaintCache({ iconRenders });
}

function cacheRenderedSiteIconFromContext(icon) {
  if (!icon.closest(".favorite-site, .recent-folder-item")) {
    return;
  }
  cacheRenderedSiteIcon(icon, {
    title: icon.dataset.siteTitle || icon.alt || "",
    url: icon.dataset.siteUrl || ""
  });
}

function cacheRenderedSiteIconOnLoad(icon, site) {
  icon.addEventListener("load", () => cacheRenderedSiteIcon(icon, site));
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
  return engine.labelKey ? t(engine.labelKey) : (engine.label || "");
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
  document.querySelector("#recent-folders-title").textContent = t("historyTitle");
  document.querySelector(".recent-folder-switch-controls")?.setAttribute("aria-label", t("recentFoldersSwitch"));
  setButtonLabel(recentFoldersPreviousButton, t("recentFoldersPrevious"));
  setButtonLabel(recentFoldersNextButton, t("recentFoldersNext"));
  document.querySelector("#portal-title").textContent = t("portalTitle");
  document.querySelector("#smartPortalTab").textContent = t("smartPortalTab");
  document.querySelector("#bookmarkPortalTab").textContent = t("bookmarkPortalTab");
  setMobileTabLabel("portalPanel", t("mobilePortalTab"));

  setButtonLabel(togglePortalFormButton, t("addPortal"));
  setButtonLabel(refreshBookmarkFolderButton, t("refreshBookmarkFolder"));
  setButtonLabel(bookmarkFavoriteAddButton, t("addFavoriteSite"));
  setButtonLabel(chooseBookmarkFolderButton, t("chooseBookmarkFolder"));
  setButtonLabel(settingsButton, t("openSettings"));
  setButtonLabel(closeSettingsButton, t("settingsBackHome"));
  settingsShell?.setAttribute("aria-label", t("settingsTitle"));
  setButtonLabel(favoriteAddButton, t("addFavoriteSite"));
  setStaticButtonIcons();
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

  const portalTitleLabel = portalTitleInput.closest("label")?.querySelector("span");
  const portalUrlLabel = portalUrlInput.closest("label")?.querySelector("span");
  const portalCategoryLabel = document.querySelector("#portalCategoryLabel");
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
  togglePortalFormButton.querySelector(".button-icon").innerHTML = plusIcon();
  document.querySelector(".portal-category-trigger-icon").innerHTML = chevronDownIcon();
  refreshBookmarkFolderButton.querySelector(".button-icon").innerHTML = refreshIcon();
  bookmarkFavoriteAddButton.querySelector(".button-icon").innerHTML = plusIcon();
  chooseBookmarkFolderButton.querySelector(".button-icon").innerHTML = pageTabFilledIcon();
  closeBookmarkPickerButton.querySelector(".button-icon").innerHTML = arrowLeftIcon();
  const recentFoldersPreviousIcon = recentFoldersPreviousButton?.querySelector(".button-icon");
  const recentFoldersNextIcon = recentFoldersNextButton?.querySelector(".button-icon");
  if (recentFoldersPreviousIcon) {
    recentFoldersPreviousIcon.innerHTML = chevronLeftIcon();
  }
  if (recentFoldersNextIcon) {
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
  document.querySelector("#videoPipGlobalLabel").textContent = t("videoPipGlobalLabel");
  document.querySelector("#videoPipGlobalHint").textContent = t("videoPipGlobalHint");
  document.querySelector("#socialVideoExtractorTitle").textContent = t("socialVideoExtractorTitle");
  const socialVideoExtractorDescription = document.querySelector("#socialVideoExtractorDescription");
  const socialVideoExtractorDescriptionText = t("socialVideoExtractorDescription");
  socialVideoExtractorDescription.textContent = socialVideoExtractorDescriptionText;
  socialVideoExtractorDescription.hidden = !socialVideoExtractorDescriptionText.trim();
  document.querySelector("#socialVideoExtractorLabel").textContent = t("socialVideoExtractorLabel");
  document.querySelector("#socialVideoExtractorHint").textContent = t("socialVideoExtractorHint");
  document.querySelector("#socialVideoExtractorSupport").textContent = t("socialVideoExtractorSupport");
  updateVideoPipGlobalToggle();
  updateSocialVideoExtractorToggle();
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

function updateVideoPipGlobalToggle() {
  if (!videoPipGlobalToggle) {
    return;
  }
  videoPipGlobalToggle.setAttribute("aria-checked", String(videoPipGlobalEnabled));
  setButtonLabel(videoPipGlobalToggle, t("videoPipGlobalLabel"));
}

function updateSocialVideoExtractorToggle() {
  if (!socialVideoExtractorToggle) {
    return;
  }
  socialVideoExtractorToggle.setAttribute("aria-checked", String(socialVideoExtractorEnabled));
  setButtonLabel(socialVideoExtractorToggle, t("socialVideoExtractorLabel"));
}

async function initVideoPipGlobalSetting() {
  const stored = await getStoredValues({
    [VIDEO_PIP_GLOBAL_ENABLED_STORAGE_KEY]: false,
    [SOCIAL_VIDEO_EXTRACTOR_ENABLED_STORAGE_KEY]: true
  });
  videoPipGlobalEnabled = stored[VIDEO_PIP_GLOBAL_ENABLED_STORAGE_KEY] === true;
  socialVideoExtractorEnabled = stored[SOCIAL_VIDEO_EXTRACTOR_ENABLED_STORAGE_KEY] !== false;
  updateVideoPipGlobalToggle();
  updateSocialVideoExtractorToggle();
}

async function toggleVideoPipGlobalSetting() {
  videoPipGlobalEnabled = !videoPipGlobalEnabled;
  updateVideoPipGlobalToggle();
  try {
    await setStoredValues({ [VIDEO_PIP_GLOBAL_ENABLED_STORAGE_KEY]: videoPipGlobalEnabled });
  } catch (error) {
    videoPipGlobalEnabled = !videoPipGlobalEnabled;
    updateVideoPipGlobalToggle();
    console.warn("Failed to save video Picture-in-Picture setting", error);
  }
}

async function toggleSocialVideoExtractorSetting() {
  socialVideoExtractorEnabled = !socialVideoExtractorEnabled;
  updateSocialVideoExtractorToggle();
  try {
    await setStoredValues({ [SOCIAL_VIDEO_EXTRACTOR_ENABLED_STORAGE_KEY]: socialVideoExtractorEnabled });
  } catch (error) {
    socialVideoExtractorEnabled = !socialVideoExtractorEnabled;
    updateSocialVideoExtractorToggle();
    console.warn("Failed to save social video extraction setting", error);
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

async function setLanguagePreference(preference) {
  applyLanguagePreference(preference);
  applyLocale();
  renderThemePalettePresets();
  updateThemeSettingsUi();
  void renderPortals();
  void renderFavoriteSites();
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
  try {
    applyLocale();
  } finally {
    document.documentElement.classList.remove("locale-hydrating");
  }
  renderFirstPaintCache();
  const siteIconIndexReady = initSiteIconIndex();
  siteIconIndexReady.then(refreshRenderedSiteIcons).catch(() => {});
  const themeModeReady = initThemeMode();
  const searchSettingsReady = initSearchSettings();
  const videoPipSettingReady = initVideoPipGlobalSetting();
  await initQuickSearchEngine();
  renderFavoriteSites();
  renderPortals();
  renderSelectedBookmarkFolder();
  refreshHistory();
  void searchSettingsReady;
  void themeModeReady;
  void videoPipSettingReady;

  chooseBookmarkFolderButton.addEventListener("click", openBookmarkPicker);
  refreshBookmarkFolderButton.addEventListener("click", renderSelectedBookmarkFolder);
  bookmarkFavoriteAddButton?.addEventListener("click", toggleFavoriteForm);
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
  portalModeTabs.forEach((tab) => {
    tab.addEventListener("click", () => activatePortalView(tab.dataset.portalView));
  });
  togglePortalFormButton.addEventListener("click", showPortalForm);
  portalCategoryTrigger?.addEventListener("click", togglePortalCategoryPicker);
  portalCategoryList?.addEventListener("click", handlePortalCategoryOptionClick);
  portalCategoryList?.addEventListener("keydown", handlePortalCategoryListKeydown);
  cancelPortalButton.addEventListener("click", hidePortalForm);
  portalForm.addEventListener("submit", handlePortalSubmit);
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
  videoPipGlobalToggle?.addEventListener("click", toggleVideoPipGlobalSetting);
  socialVideoExtractorToggle?.addEventListener("click", toggleSocialVideoExtractorSetting);
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
    }, 340);
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
        label: engine.label,
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
    const label = normalizeSettingText(saved.label, engine.label, 32);
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
    nextEngine.label = aiSettings.label;
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
      value: engine.label
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
  const explicitIcon = engine.id === "kimi" ? `${SITE_ICON_DIRECTORY}/kimi.svg` : doubaoAiIconUrl(engine);
  const iconSource = explicitIcon || localIconForUrl(engineUrl) || GENERIC_SITE_FALLBACK_ICON;
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
    ? t("quickSearchPlatformPlaceholder", { platform: platform.label })
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
  const explicitIcon = doubaoAiIconUrl(target);
  const iconSite = {
    url: target.searchUrl || target.directUrl || "",
    title: target.label || searchEngineLabel(target)
  };
  if (explicitIcon) {
    applyExplicitSiteIcon(icon, iconSite, explicitIcon);
  } else {
    applySiteIcon(icon, iconSite);
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
      refreshAdaptiveSiteIcons();
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
  }, 340);
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
    ? `${match.prefix}: ${match.platform.label} · ${match.alternative.prefix}: ${match.alternative.platform.label}`
    : t("quickSearchPlatformActivationHint", {
      prefix: match.prefix,
      platform: match.platform.label
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
  fragment.appendChild(createSearchSuggestionItem(engineSuggestion));
  results.forEach((item) => {
    fragment.appendChild(createSearchSuggestionItem(item));
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
      hint: t("quickSearchWithPlatform", { platform: platform.label }),
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
  return fuzzyIncludes(`${item.title || ""} ${item.url || ""}`, query);
}

function fuzzyMatchesBookmarkEntry(entry, query) {
  return fuzzyIncludes(`${entry.title || ""} ${entry.url || ""} ${entry.path || ""}`, query);
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

function createSearchSuggestionItem(item) {
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
    applyHistoryIcon(icon, item);
    icon.alt = "";
  }
  copy.className = "search-suggestion-copy";
  title.textContent = item.title;
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
      title: normalizeText(site.name || site.title).slice(0, MAX_PORTAL_TITLE_LENGTH) || favoriteSiteTitleFromUrl(site.url),
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
  const cachedIconRender = site?.recommended ? null : cachedFirstPaintIconRender(options.iconRenders, iconSite);
  if (cachedIconRender) {
    restoreFirstPaintIconRender(icon, iconSite, cachedIconRender);
    return;
  }
  applySiteIcon(icon, iconSite);
}

function createSiteCard(site, options = {}) {
  const node = siteCardTemplate.content.firstElementChild.cloneNode(true);
  const link = node.querySelector(".site-link");
  const icon = node.querySelector(".site-icon");
  const domain = node.querySelector(".site-domain");
  const removeButton = node.querySelector(".site-remove");
  link.href = site.url;
  renderSharedSiteIcon(icon, site, options);
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
  appendFavoriteTargetButton(node, site, options.favoriteKeys);
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
    cachedIconRender: cachedFirstPaintIconRender(options.iconRenders, site)
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
  await renderPortals();
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
    restoreFirstPaintIconRender(icon, site, options.cachedIconRender);
  } else if (options.awaitDisplayIcon) {
    await applySiteIcon(icon, site, { awaitDisplayIcon: true });
  } else {
    applySiteIcon(icon, site);
  }
  cacheRenderedSiteIconOnLoad(icon, site);
  icon.alt = "";
  setButtonLabel(removeButton, t("deleteFavoriteSite"));
  removeButton.innerHTML = closeIcon();
  removeButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    removeFavoriteSite(site.id, node);
  });
  installFavoriteLongPress(node);
  icon.addEventListener("load", () => {
    if (icon.src.startsWith("data:image/svg+xml")) {
      node.classList.add("generated-fallback");
    }
  });
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
    icon: await discoverFavoriteSiteIcon(favoriteKey)
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

async function discoverFavoriteSiteIcon(url) {
  const parsedUrl = safeUrl(url);
  const localIcon = localIconForUrl(url);
  if (!siteIconIndexLoaded || !siteGroupKey(parsedUrl) || (localIcon && !localIconNeedsRemoteBrandColor(siteGroupKey(parsedUrl), localIcon))) {
    return "";
  }
  return discoverSiteIconDataUrl(url);
}

async function loadCachedSiteIcon(siteKey) {
  try {
    const entry = await loadCachedSiteIconEntry(siteKey);
    if (!siteIconCacheEntryIsFresh(entry)) {
      return "";
    }
    return normalizeStoredSiteIcon(entry.icon);
  } catch {
    return "";
  }
}

async function loadCachedSiteIconEntry(siteKey) {
  if (!siteKey) {
    return null;
  }
  const cache = await loadSiteIconCache();
  const entry = cache[siteKey];
  return entry && typeof entry === "object" && !Array.isArray(entry) ? entry : null;
}

function siteIconCacheEntryIsFresh(entry, ttl = SITE_ICON_CACHE_TTL_MS) {
  return Boolean(entry && Date.now() - Number(entry.updatedAt || 0) <= ttl);
}

async function cacheSiteIcon(siteKey, icon, metadata = {}) {
  const normalizedIcon = normalizeStoredSiteIcon(icon);
  if (!siteKey || !normalizedIcon) {
    return;
  }
  const tileColor = embeddedSvgBrandColor(normalizedIcon) || "";
  const strategy = remoteBrandSvgCacheStrategy(normalizedIcon);
  const cache = await loadSiteIconCache();
  cache[siteKey] = {
    icon: normalizedIcon,
    tileColor,
    source: metadata.source || (tileColor ? "remote-brand" : "site-icon"),
    ...(strategy ? { strategy } : {}),
    missing: false,
    updatedAt: Date.now()
  };
  await saveSiteIconCache(cache);
}

async function cacheRemoteBrandIconMiss(siteKey) {
  if (!siteKey) {
    return;
  }
  const cache = await loadSiteIconCache();
  cache[siteKey] = {
    icon: "",
    missing: true,
    source: "remote-brand",
    providerVersion: REMOTE_BRAND_ICON_PROVIDER_VERSION,
    updatedAt: Date.now()
  };
  await saveSiteIconCache(cache);
}

async function saveSiteIconCache(cache) {
  const entries = Object.entries(cache)
    .filter(([, entry]) => normalizeStoredSiteIcon(entry?.icon) || entry?.missing)
    .sort(([, a], [, b]) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0))
    .slice(0, MAX_CACHED_SITE_ICONS);
  await setStoredValues({ [SITE_ICON_CACHE_STORAGE_KEY]: Object.fromEntries(entries) });
}

async function loadSiteIconCache() {
  const result = await getStoredValues({ [SITE_ICON_CACHE_STORAGE_KEY]: {} });
  const cache = result[SITE_ICON_CACHE_STORAGE_KEY];
  return cache && typeof cache === "object" && !Array.isArray(cache) ? cache : {};
}

async function discoverSiteIconDataUrl(url, options = {}) {
  const parsedUrl = safeUrl(url);
  if (!parsedUrl) {
    return "";
  }
  const siteKey = siteGroupKey(parsedUrl);
  if (siteKey && !options.skipStoredCache) {
    const cachedIcon = await loadCachedSiteIcon(siteKey);
    if (cachedIcon) {
      return cachedIcon;
    }
  }
  const cacheKey = siteIconDiscoveryCacheKey(parsedUrl);
  if (siteIconDiscoveryCache.has(cacheKey)) {
    return siteIconDiscoveryCache.get(cacheKey);
  }
  const request = fetchBestSiteIconDataUrl(parsedUrl)
    .then((iconDataUrl) => {
      if (iconDataUrl && siteKey) {
        cacheSiteIcon(siteKey, iconDataUrl).catch(() => {});
      }
      return iconDataUrl;
    })
    .catch(() => "");
  rememberSiteIconDiscoveryRequest(cacheKey, request);
  return request;
}

function siteIconDiscoveryCacheKey(parsedUrl) {
  return `${parsedUrl.protocol}//${parsedUrl.hostname}`.toLowerCase();
}

function rememberSiteIconDiscoveryRequest(cacheKey, request) {
  siteIconDiscoveryCache.set(cacheKey, request);
  if (siteIconDiscoveryCache.size <= SITE_ICON_DISCOVERY_MEMORY_CACHE_LIMIT) {
    return;
  }
  const oldestKey = siteIconDiscoveryCache.keys().next().value;
  if (oldestKey) {
    siteIconDiscoveryCache.delete(oldestKey);
  }
}

async function fetchBestSiteIconDataUrl(parsedUrl) {
  const remoteBrandIcon = await discoverRemoteBrandIconDataUrl(parsedUrl.href);
  if (remoteBrandIcon) {
    return remoteBrandIcon;
  }
  const candidates = await discoverSiteIconCandidates(parsedUrl);
  for (const candidate of candidates.slice(0, SITE_ICON_DISCOVERY_CANDIDATE_LIMIT)) {
    try {
      const iconDataUrl = await fetchImageDataUrl(candidate.url);
      if (iconDataUrl) {
        return iconDataUrl;
      }
    } catch {
      // Try the next declared icon when one candidate is missing or blocked.
    }
  }
  return "";
}

async function discoverRemoteBrandIconDataUrl(url) {
  const parsedUrl = safeUrl(url);
  const siteKey = siteGroupKey(parsedUrl);
  const localIcon = localIconForUrl(parsedUrl.href);
  if (!siteIconIndexLoaded || !siteKey || (localIcon && !localIconNeedsRemoteBrandColor(siteKey, localIcon))) {
    return "";
  }
  const cachedEntry = await loadCachedSiteIconEntry(siteKey);
  if (siteIconCacheEntryIsFresh(cachedEntry)) {
    const cachedIcon = normalizeStoredSiteIcon(cachedEntry.icon);
    if (cachedIcon && cachedSiteIconEntryIsRemoteBrand(cachedEntry)) {
      return cachedIcon;
    }
  }
  if (remoteBrandIconMissCacheIsFresh(cachedEntry)) {
    return "";
  }
  const cacheKey = `remote-brand:${siteKey}`;
  if (siteIconDiscoveryCache.has(cacheKey)) {
    return siteIconDiscoveryCache.get(cacheKey);
  }
  const request = fetchRemoteBrandIconDataUrl(parsedUrl)
    .then((iconDataUrl) => {
      if (iconDataUrl) {
        cacheSiteIcon(siteKey, iconDataUrl, { source: "remote-brand" }).catch(() => {});
      } else {
        cacheRemoteBrandIconMiss(siteKey).catch(() => {});
      }
      return iconDataUrl;
    })
    .catch(() => {
      cacheRemoteBrandIconMiss(siteKey).catch(() => {});
      return "";
    });
  rememberSiteIconDiscoveryRequest(cacheKey, request);
  return request;
}

function cachedSiteIconEntryIsRemoteBrand(entry) {
  return entry?.source === "remote-brand" || Boolean(embeddedSvgBrandColor(entry?.icon || ""));
}

function remoteBrandIconMissCacheIsFresh(entry) {
  return Boolean(entry?.missing
    && entry?.source === "remote-brand"
    && entry?.providerVersion === REMOTE_BRAND_ICON_PROVIDER_VERSION
    && siteIconCacheEntryIsFresh(entry, REMOTE_BRAND_ICON_MISSING_TTL_MS));
}

function remoteBrandSvgCacheStrategy(icon) {
  const descriptor = remoteBrandSvgDescriptorFromSource(icon);
  if (!descriptor) {
    return null;
  }
  return {
    kind: "remote-brand-svg",
    brandColor: descriptor.brandColor,
    renderMode: descriptor.renderMode,
    isMonochrome: descriptor.isMonochrome,
    visibleColors: descriptor.visibleColors || [],
    embeddedCarrierColor: descriptor.embeddedCarrierColor || "",
    qualityScore: descriptor.qualityScore
  };
}

async function fetchRemoteBrandIconDataUrl(parsedUrl) {
  const candidates = remoteBrandIconSlugCandidates(parsedUrl);
  const siteKey = siteGroupKey(parsedUrl);
  for (const candidate of candidates) {
    for (const provider of REMOTE_BRAND_ICON_PROVIDERS) {
      const canFetchDirectly = candidate.score >= REMOTE_BRAND_ICON_DIRECT_FETCH_SCORE_MIN;
      if (canFetchDirectly) {
        try {
          const directIconDataUrl = await fetchRemoteBrandSvgDataUrl(provider.urlForSlug(candidate.slug), {
            candidate,
            providerId: provider.id,
            siteKey,
            allowSiteKeyColorFallback: !localIconForUrl(parsedUrl.href)
          });
          if (directIconDataUrl) {
            return directIconDataUrl;
          }
        } catch {
          // Fall through to an indexed alias or the next provider.
        }
      }
      try {
        const providerSlug = await remoteBrandProviderSlugForCandidate(provider, candidate.slug);
        if (!providerSlug || (canFetchDirectly && providerSlug === candidate.slug)) {
          continue;
        }
        const iconDataUrl = await fetchRemoteBrandSvgDataUrl(provider.urlForSlug(providerSlug), {
          candidate,
          providerId: provider.id,
          siteKey,
          allowSiteKeyColorFallback: !localIconForUrl(parsedUrl.href)
        });
        if (iconDataUrl) {
          return iconDataUrl;
        }
      } catch {
        // Try the next remote brand source or slug.
      }
    }
  }
  return "";
}

async function remoteBrandProviderHasSlug(provider, slug) {
  return Boolean(await remoteBrandProviderSlugForCandidate(provider, slug));
}

async function remoteBrandProviderSlugForCandidate(provider, slug) {
  const normalizedSlug = remoteBrandIconSlug(slug);
  if (!normalizedSlug) {
    return "";
  }
  if (!provider.index) {
    return normalizedSlug;
  }
  const slugs = await remoteBrandProviderSlugs(provider);
  return slugs instanceof Map
    ? slugs.get(normalizedSlug) || ""
    : slugs.has(normalizedSlug) ? normalizedSlug : "";
}

async function remoteBrandProviderSlugs(provider) {
  const cachedEntry = remoteBrandIconIndexCache.get(provider.index);
  if (cachedEntry?.request) {
    return cachedEntry.request;
  }
  if (cachedEntry && Date.now() - cachedEntry.updatedAt < REMOTE_BRAND_ICON_INDEX_TTL_MS) {
    return cachedEntry.slugs;
  }
  const request = remoteBrandProviderSlugRequest(provider);
  remoteBrandIconIndexCache.set(provider.index, { request });
  let slugs;
  try {
    slugs = await request;
  } catch {
    remoteBrandIconIndexCache.delete(provider.index);
    return new Set();
  }
  remoteBrandIconIndexCache.set(provider.index, {
    slugs,
    updatedAt: Date.now()
  });
  return slugs;
}

async function remoteBrandProviderSlugRequest(provider) {
  if (provider.index === "lobehub-static-svg") {
    return fetchLobeHubStaticSvgSlugs(provider.packageName);
  }
  if (provider.index === "thesvg") {
    return fetchTheSvgSlugs();
  }
  return new Set();
}

async function fetchLobeHubStaticSvgSlugs(packageName) {
  const version = await fetchNpmPackageLatestVersion(packageName);
  if (!version) {
    return new Set();
  }
  const encodedPackageName = encodeURIComponent(packageName);
  const response = await fetchJsonWithTimeout(`https://data.jsdelivr.com/v1/package/npm/${encodedPackageName}@${encodeURIComponent(version)}/flat`);
  return remoteBrandSlugsFromFileList(response?.files, /^\/icons\/(.+)\.svg$/i);
}

async function fetchNpmPackageLatestVersion(packageName) {
  const encodedPackageName = encodeURIComponent(packageName).replace(/^%40/i, "@");
  const response = await fetchJsonWithTimeout(`https://registry.npmjs.org/${encodedPackageName}/latest`);
  return typeof response?.version === "string" ? response.version : "";
}

async function fetchTheSvgSlugs() {
  const response = await fetchJsonWithTimeout("https://data.jsdelivr.com/v1/package/gh/glincker/thesvg@main/flat");
  return remoteBrandSlugMapFromFileList(response?.files, /^\/public\/icons\/(.+)\/default\.svg$/i);
}

function remoteBrandSlugsFromFileList(files, pattern) {
  const slugs = new Set();
  if (!Array.isArray(files)) {
    return slugs;
  }
  for (const file of files) {
    const name = String(file?.name || "");
    const match = name.match(pattern);
    if (match?.[1]) {
      slugs.add(remoteBrandIconSlug(match[1]));
    }
  }
  return slugs;
}

function remoteBrandSlugMapFromFileList(files, pattern) {
  const slugs = new Map();
  if (!Array.isArray(files)) {
    return slugs;
  }
  for (const file of files) {
    const name = String(file?.name || "");
    const match = name.match(pattern);
    if (match?.[1]) {
      const slug = remoteBrandIconSlug(match[1]);
      if (slug && !slugs.has(slug)) {
        slugs.set(slug, match[1]);
      }
    }
  }
  return slugs;
}

async function fetchJsonWithTimeout(url) {
  const response = await withTimeout(fetch(url, {
    cache: "force-cache",
    credentials: "omit",
    redirect: "follow"
  }), SITE_ICON_FETCH_TIMEOUT_MS, "Remote brand index request timed out.");
  if (!response.ok) {
    throw new Error(`Remote brand index request failed: ${response.status}`);
  }
  return response.json();
}

async function fetchRemoteBrandSvgDataUrl(url, options = {}) {
  const siteKey = options.siteKey || "";
  const response = await withTimeout(fetch(url, {
    cache: "force-cache",
    credentials: "omit",
    redirect: "follow"
  }), SITE_ICON_FETCH_TIMEOUT_MS, "Remote brand icon request timed out.");
  if (!response.ok) {
    throw new Error(`Remote brand icon request failed: ${response.status}`);
  }
  const contentType = response.headers.get("content-type") || "";
  if (!remoteBrandSvgResponseMayContainSvg(contentType, response.url || url)) {
    return "";
  }
  const svg = await response.text();
  const quality = remoteBrandSvgQuality(svg, options);
  if (!quality.accepted) {
    return "";
  }
  const brandColor = remoteBrandSvgBrandColor(svg, options);
  return svgTextDataUrl(prepareRemoteBrandSvg(svg, {
    brandColor,
    qualityScore: quality.score,
    siteKey
  }));
}

function remoteBrandSvgQuality(svg, options = {}) {
  const text = String(svg || "").trim();
  const candidateScore = Number(options.candidate?.score || 0);
  if (!remoteBrandSvgLooksUsable(svg) || candidateScore < 50) {
    return { accepted: false, score: 0 };
  }
  if (/<(?:foreignObject|iframe|object|embed|image)\b/i.test(text)
    || /\son[a-z]+\s*=/i.test(text)
    || /\s(?:href|xlink:href)\s*=\s*(["'])https?:\/\//i.test(text)) {
    return { accepted: false, score: 0 };
  }
  const geometry = remoteBrandSvgGeometry(text);
  if (!geometry.valid) {
    return { accepted: false, score: 0 };
  }
  const shapeCount = remoteBrandSvgShapeCount(text);
  if (shapeCount <= 0 || shapeCount > 220) {
    return { accepted: false, score: 0 };
  }
  let score = 100;
  if (candidateScore < 70) {
    score -= 20;
  }
  if (shapeCount > 80) {
    score -= 18;
  }
  if (geometry.aspectRatio > 10 || geometry.aspectRatio < 0.1) {
    score -= 25;
  }
  if (remoteBrandSvgHasComplexPaint(text)) {
    score -= 8;
  }
  return {
    accepted: score >= 60,
    score
  };
}

function remoteBrandSvgResponseMayContainSvg(contentType, url = "") {
  const mime = normalizeSiteIconMime(contentType);
  if (mime === "image/svg+xml") {
    return true;
  }
  if (mime && !/^(?:application\/octet-stream|text\/plain)$/i.test(mime)) {
    return false;
  }
  return /\.svg(?:[?#].*)?$/i.test(String(url || ""));
}

function remoteBrandSvgLooksUsable(svg) {
  const text = String(svg || "").trim();
  return text.length > 0
    && text.length <= MAX_CACHED_SITE_ICON_BYTES
    && remoteBrandSvgHasRootElement(text)
    && !/<script\b/i.test(text);
}

function remoteBrandSvgHasRootElement(svg) {
  return /^(?:\s*<\?xml[^>]*>\s*)?(?:\s*<!doctype[^>]*>\s*)?(?:\s*<!--[\s\S]*?-->\s*)*<svg\b/i.test(String(svg || ""));
}

function remoteBrandSvgGeometry(svg) {
  const viewBoxMatch = String(svg || "").match(/\sviewBox=(["'])\s*([-+.\deE]+)[,\s]+([-+.\deE]+)[,\s]+([-+.\deE]+)[,\s]+([-+.\deE]+)\s*\1/i);
  if (viewBoxMatch) {
    const width = Number(viewBoxMatch[4]);
    const height = Number(viewBoxMatch[5]);
    return remoteBrandSvgGeometryResult(width, height);
  }
  const width = remoteBrandSvgLengthAttribute(svg, "width");
  const height = remoteBrandSvgLengthAttribute(svg, "height");
  return remoteBrandSvgGeometryResult(width, height);
}

function remoteBrandSvgLengthAttribute(svg, name) {
  const match = String(svg || "").match(new RegExp(`\\s${name}=(["'])\\s*([0-9.]+)(?:px)?\\s*\\1`, "i"));
  return match ? Number(match[2]) : 0;
}

function remoteBrandSvgGeometryResult(width, height) {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return { valid: false, aspectRatio: 1 };
  }
  const aspectRatio = width / height;
  return {
    valid: aspectRatio >= 0.05 && aspectRatio <= 20,
    aspectRatio
  };
}

function remoteBrandSvgShapeCount(svg) {
  return (String(svg || "").match(/<(?:path|circle|rect|polygon|polyline|line|ellipse)\b/gi) || []).length;
}

function prepareRemoteBrandSvg(svg, options = {}) {
  const descriptor = remoteBrandSvgDescriptor(svg, options);
  const color = descriptor.brandColor;
  const isMonochrome = descriptor.isMonochrome;
  const visibleColorAttr = svgPaletteDataAttribute(descriptor.visibleColors);
  const embeddedCarrierAttr = descriptor.embeddedCarrierColor || "";
  let output = String(svg || "").trim();
  output = output.replace(/<\?xml[^>]*>\s*/i, "");
  output = output.replace(/<!doctype[^>]*>\s*/i, "");
  if (color && isMonochrome) {
    output = applySvgGlyphColor(output, color, { onlyCurrentColor: true });
  }
  output = output.replace(/<svg\b([^>]*)>/i, (match, attrs) => {
    const cleanedAttrs = attrs
      .replace(/\sdata-wayleaf-brand-color=(["'])[^"']*\1/gi, "")
      .replace(/\sdata-wayleaf-monochrome=(["'])[^"']*\1/gi, "")
      .replace(/\sdata-wayleaf-remote-brand=(["'])[^"']*\1/gi, "")
      .replace(/\sdata-wayleaf-render-mode=(["'])[^"']*\1/gi, "")
      .replace(/\sdata-wayleaf-tile-light=(["'])[^"']*\1/gi, "")
      .replace(/\sdata-wayleaf-tile-dark=(["'])[^"']*\1/gi, "")
      .replace(/\sdata-wayleaf-glyph-light=(["'])[^"']*\1/gi, "")
      .replace(/\sdata-wayleaf-glyph-dark=(["'])[^"']*\1/gi, "")
      .replace(/\sdata-wayleaf-visible-colors=(["'])[^"']*\1/gi, "")
      .replace(/\sdata-wayleaf-embedded-carrier=(["'])[^"']*\1/gi, "")
      .replace(/\sdata-wayleaf-quality=(["'])[^"']*\1/gi, "");
    const brandAttr = color ? ` data-wayleaf-brand-color="${color}"` : "";
    const visibleColorsAttr = visibleColorAttr ? ` data-wayleaf-visible-colors="${visibleColorAttr}"` : "";
    const embeddedCarrierColorAttr = embeddedCarrierAttr ? ` data-wayleaf-embedded-carrier="${embeddedCarrierAttr}"` : "";
    const metadataAttrs = [
      `data-wayleaf-remote-brand="true"`,
      `data-wayleaf-monochrome="${isMonochrome ? "true" : "false"}"`,
      `data-wayleaf-render-mode="${descriptor.renderMode}"`,
      `data-wayleaf-quality="${descriptor.qualityScore}"`
    ];
    return `<svg${cleanedAttrs} ${metadataAttrs.join(" ")}${brandAttr}${visibleColorsAttr}${embeddedCarrierColorAttr}>`;
  });
  return output;
}

function remoteBrandSvgDescriptor(svg, options = {}) {
  const brandColor = normalizeHexColor(options.brandColor || "") || "";
  const analysis = svgPaintAnalysis(svg);
  const isMonochrome = !analysis.usesPaintServer && analysis.visibleColors.length <= 1;
  const renderMode = remoteBrandSvgHasComplexPaintAnalysis(analysis)
    ? "gradient"
    : isMonochrome ? "mask" : "original";
  return {
    brandColor,
    isMonochrome,
    renderMode,
    visibleColors: analysis.colors,
    embeddedCarrierColor: svgEmbeddedCarrierColor(svg, analysis),
    qualityScore: Math.max(0, Math.min(100, Math.round(Number(options.qualityScore || 0))))
  };
}

function svgTextDataUrl(svg) {
  return `data:image/svg+xml,${encodeURIComponent(String(svg || ""))}`;
}

function remoteBrandSvgDescriptorFromSource(source) {
  if (!isSvgDataUrl(source)) {
    return null;
  }
  const svg = decodeSvgDataUrl(source);
  if (!/\sdata-wayleaf-remote-brand=(["'])true\1/i.test(svg)) {
    return null;
  }
  const attr = (name) => remoteBrandSvgDataAttribute(svg, name);
  return {
    brandColor: normalizeHexColor(attr("brand-color")),
    isMonochrome: attr("monochrome") === "true",
    renderMode: attr("render-mode") || "mask",
    visibleColors: svgPaletteDataAttributeColors(attr("visible-colors")),
    embeddedCarrierColor: normalizeHexColor(attr("embedded-carrier")),
    qualityScore: Number(attr("quality") || 0)
  };
}

function remoteBrandSvgDataAttribute(svg, name) {
  const match = String(svg || "").match(new RegExp(`\\sdata-wayleaf-${name}=(["'])([^"']*)\\1`, "i"));
  return match?.[2] || "";
}

function embeddedSvgBrandColor(value) {
  const svg = decodeSvgDataUrl(value) || String(value || "");
  const match = svg.match(/\sdata-wayleaf-brand-color=(["'])(#[0-9a-f]{6})\1/i);
  return normalizeHexColor(match?.[2] || "");
}

function remoteBrandSvgBrandColor(svg, options = {}) {
  const embeddedColor = embeddedSvgBrandColor(svg);
  if (embeddedColor) {
    return embeddedColor;
  }
  const palette = extractSvgColorPalette(svg);
  const localColor = options.allowSiteKeyColorFallback === false
    ? ""
    : normalizeHexColor(SITE_ICON_TILE_COLOR_BY_SITE_KEY[options.siteKey] || "");
  const expressiveColor = palette.find((color) => !remoteBrandColorLooksNeutral(color));
  return expressiveColor || localColor || remoteBrandSvgMonochromeBrandColor(svg, palette) || "";
}

function remoteBrandColorLooksNeutral(color) {
  const normalized = normalizeHexColor(color);
  if (!normalized) {
    return true;
  }
  const [red, green, blue] = hexToRgb(normalized).map((channel) => channel / 255);
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const luminance = relativeLuminance(normalized);
  return max - min < 0.06 || luminance < 0.04 || luminance > 0.94;
}

function nearBlackBrandColor(color) {
  const normalized = normalizeHexColor(color);
  return Boolean(normalized && relativeLuminance(normalized) < 0.04);
}

function blackishCarrierColor(color) {
  const normalized = normalizeHexColor(color);
  if (!normalized) {
    return false;
  }
  const [red, green, blue] = hexToRgb(normalized).map((channel) => channel / 255);
  const chroma = Math.max(red, green, blue) - Math.min(red, green, blue);
  return relativeLuminance(normalized) < 0.045 && chroma < 0.12;
}

function remoteBrandSvgMonochromeBrandColor(svg, palette = extractSvgColorPalette(svg)) {
  if (!remoteBrandSvgIsMonochrome(svg)) {
    return "";
  }
  if (palette.length === 1) {
    const color = normalizeHexColor(palette[0]);
    return color && !nearWhiteBrandColor(color) ? color : "";
  }
  return remoteBrandSvgUsesImplicitBlack(svg) ? "#000000" : "";
}

function remoteBrandSvgIsMonochrome(svg) {
  const analysis = svgPaintAnalysis(svg);
  if (analysis.usesPaintServer) {
    return false;
  }
  return analysis.visibleColors.length <= 1;
}

function remoteBrandSvgUsesImplicitBlack(svg) {
  const text = String(svg || "");
  return remoteBrandSvgHasRootElement(text)
    && remoteBrandSvgShapeCount(text) > 0
    && !/\s(?:fill|stroke|color)\s*=/i.test(text)
    && !/(?:fill|stroke|color)\s*:/i.test(text);
}

function remoteBrandSvgHasComplexPaint(svg) {
  return remoteBrandSvgHasComplexPaintAnalysis(svgPaintAnalysis(svg));
}

function remoteBrandSvgHasComplexPaintAnalysis(analysis) {
  return analysis.paintServerColors.length > 1
    || (analysis.paintServerColors.length > 0 && analysis.visibleColors.length > 1)
    || (analysis.hasEffectPaintServer && analysis.visibleColors.length > 1);
}

function remoteBrandSvgUsesPaintServer(svg) {
  return svgPaintAnalysis(svg).usesPaintServer;
}

function extractSvgColorPalette(svg) {
  return svgPaintAnalysis(svg).colors;
}

function extractSvgPaintServerColors(svg) {
  return svgPaintAnalysis(svg).paintServerColors;
}

function svgEmbeddedCarrierColor(svg, analysis = svgPaintAnalysis(svg)) {
  if (uniqueNormalizedHexColors(analysis.visibleColors).length <= 1) {
    return "";
  }
  const viewBox = svgViewBox(String(svg || ""));
  if (!viewBox) {
    return "";
  }
  const shape = String(svg || "").match(/<(path|rect)\b([^>]*)>/i);
  if (!shape) {
    return "";
  }
  const attrs = svgAttributeMap(shape[2]);
  const color = normalizeSvgHexColor(attrs.fill || svgInlineStyleProperty(attrs.style || "", "fill"));
  if (!color || color === "none") {
    return "";
  }
  const rounded = shape[1].toLowerCase() === "rect"
    ? svgRectCoversViewBoxWithEqualRadius(attrs, viewBox)
    : svgPathCoversViewBoxWithEqualRadius(attrs.d || "", viewBox);
  return rounded ? color : "";
}

function svgViewBox(svg) {
  const match = String(svg || "").match(/<svg\b[^>]*\sviewBox=(["'])([^"']+)\1/i);
  if (!match) {
    return null;
  }
  const values = match[2].trim().split(/[\s,]+/).map(Number);
  if (values.length !== 4 || values.some((value) => !Number.isFinite(value))) {
    return null;
  }
  return { x: values[0], y: values[1], width: values[2], height: values[3] };
}

function svgAttributeMap(attrs) {
  const map = {};
  for (const match of String(attrs || "").matchAll(/([:\w.-]+)\s*=\s*(["'])(.*?)\2/g)) {
    map[match[1].toLowerCase()] = match[3];
  }
  return map;
}

function svgRectCoversViewBoxWithEqualRadius(attrs, viewBox) {
  const x = Number(attrs.x || 0);
  const y = Number(attrs.y || 0);
  const width = Number(attrs.width || viewBox.width);
  const height = Number(attrs.height || viewBox.height);
  const rx = Number(attrs.rx || attrs.ry || 0);
  const ry = Number(attrs.ry || attrs.rx || 0);
  return Math.abs(x - viewBox.x) <= 0.01
    && Math.abs(y - viewBox.y) <= 0.01
    && Math.abs(width - viewBox.width) <= 0.01
    && Math.abs(height - viewBox.height) <= 0.01
    && rx > 0
    && Math.abs(rx - ry) <= 0.01;
}

function svgPathCoversViewBoxWithEqualRadius(d, viewBox) {
  const segments = svgPathSegments(d);
  if (!segments.length) {
    return false;
  }
  const points = segments.flatMap((segment) => segment.points);
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const roundedCornerRadii = svgPathEqualCornerRadii(segments, viewBox);
  return Math.abs(minX - viewBox.x) <= 0.01
    && Math.abs(minY - viewBox.y) <= 0.01
    && Math.abs(maxX - (viewBox.x + viewBox.width)) <= 0.01
    && Math.abs(maxY - (viewBox.y + viewBox.height)) <= 0.01
    && roundedCornerRadii.length === 4;
}

function svgPathSegments(d) {
  const tokens = [...String(d || "").matchAll(/[AaCcHhLlMmQqSsTtVvZz]|[-+]?(?:\d*\.\d+|\d+\.?)(?:e[-+]?\d+)?/gi)].map((match) => match[0]);
  const segments = [];
  let index = 0;
  let command = "";
  let point = { x: 0, y: 0 };
  let startPoint = { x: 0, y: 0 };
  let lastControl = null;
  const isCommand = (value) => /^[AaCcHhLlMmQqSsTtVvZz]$/.test(value || "");
  const hasNumbers = (count) => tokens.slice(index, index + count).length === count
    && tokens.slice(index, index + count).every((token) => !isCommand(token));
  const read = () => Number(tokens[index++]);
  const skipInvalidPathToken = () => {
    if (index < tokens.length && !isCommand(tokens[index])) {
      index += 1;
    } else {
      command = "";
    }
  };
  const makePoint = (x, y, relative) => ({
    x: relative ? point.x + x : x,
    y: relative ? point.y + y : y
  });
  const push = (type, end, extraPoints = [], extra = {}) => {
    segments.push({ type, start: point, end, points: [point, ...extraPoints, end], ...extra });
    point = end;
  };
  while (index < tokens.length) {
    if (isCommand(tokens[index])) {
      command = tokens[index++];
    }
    if (!command) {
      break;
    }
    const relative = command === command.toLowerCase();
    switch (command.toUpperCase()) {
      case "M": {
        if (!hasNumbers(2)) {
          return segments;
        }
        point = makePoint(read(), read(), relative);
        startPoint = point;
        command = relative ? "l" : "L";
        lastControl = null;
        break;
      }
      case "L":
        if (!hasNumbers(2)) {
          skipInvalidPathToken();
          break;
        }
        while (hasNumbers(2)) {
          push("L", makePoint(read(), read(), relative));
          lastControl = null;
        }
        break;
      case "H":
        if (!hasNumbers(1)) {
          skipInvalidPathToken();
          break;
        }
        while (hasNumbers(1)) {
          const x = relative ? point.x + read() : read();
          push("L", { x, y: point.y });
          lastControl = null;
        }
        break;
      case "V":
        if (!hasNumbers(1)) {
          skipInvalidPathToken();
          break;
        }
        while (hasNumbers(1)) {
          const y = relative ? point.y + read() : read();
          push("L", { x: point.x, y });
          lastControl = null;
        }
        break;
      case "C":
        if (!hasNumbers(6)) {
          skipInvalidPathToken();
          break;
        }
        while (hasNumbers(6)) {
          const control1 = makePoint(read(), read(), relative);
          const control2 = makePoint(read(), read(), relative);
          push("C", makePoint(read(), read(), relative), [control1, control2]);
          lastControl = control2;
        }
        break;
      case "S":
        if (!hasNumbers(4)) {
          skipInvalidPathToken();
          break;
        }
        while (hasNumbers(4)) {
          const control1 = lastControl ? { x: point.x * 2 - lastControl.x, y: point.y * 2 - lastControl.y } : point;
          const control2 = makePoint(read(), read(), relative);
          push("S", makePoint(read(), read(), relative), [control1, control2]);
          lastControl = control2;
        }
        break;
      case "Q":
        if (!hasNumbers(4)) {
          skipInvalidPathToken();
          break;
        }
        while (hasNumbers(4)) {
          const control = makePoint(read(), read(), relative);
          push("Q", makePoint(read(), read(), relative), [control]);
          lastControl = control;
        }
        break;
      case "T":
        if (!hasNumbers(2)) {
          skipInvalidPathToken();
          break;
        }
        while (hasNumbers(2)) {
          const control = lastControl ? { x: point.x * 2 - lastControl.x, y: point.y * 2 - lastControl.y } : point;
          push("T", makePoint(read(), read(), relative), [control]);
          lastControl = control;
        }
        break;
      case "A":
        if (!hasNumbers(7)) {
          skipInvalidPathToken();
          break;
        }
        while (hasNumbers(7)) {
          const rx = Math.abs(read());
          const ry = Math.abs(read());
          read();
          read();
          read();
          push("A", makePoint(read(), read(), relative), [], { radius: { x: rx, y: ry } });
          lastControl = null;
        }
        break;
      case "Z":
        push("Z", startPoint);
        lastControl = null;
        command = "";
        break;
      default:
        index += 1;
    }
  }
  return segments;
}

function svgPathEqualCornerRadii(segments, viewBox) {
  const tolerance = Math.max(0.01, Math.max(viewBox.width, viewBox.height) * 0.015);
  const cornerSpecs = [
    { key: "topLeft", x: viewBox.x, y: viewBox.y },
    { key: "topRight", x: viewBox.x + viewBox.width, y: viewBox.y },
    { key: "bottomRight", x: viewBox.x + viewBox.width, y: viewBox.y + viewBox.height },
    { key: "bottomLeft", x: viewBox.x, y: viewBox.y + viewBox.height }
  ];
  const radii = new Map();
  const onX = (point, x) => Math.abs(point.x - x) <= tolerance;
  const onY = (point, y) => Math.abs(point.y - y) <= tolerance;
  const acceptRadius = (corner, rx, ry, segment) => {
    const radiusTolerance = Math.max(tolerance, Math.max(rx, ry) * 0.08);
    if (rx <= tolerance || ry <= tolerance || Math.abs(rx - ry) > radiusTolerance) {
      return;
    }
    if (segment.type === "A" && Math.abs(segment.radius.x - segment.radius.y) > radiusTolerance) {
      return;
    }
    radii.set(corner.key, (rx + ry) / 2);
  };
  segments.filter((segment) => /[CQSTA]/.test(segment.type)).forEach((segment) => {
    cornerSpecs.forEach((corner) => {
      const points = [segment.start, segment.end];
      const horizontal = points.find((candidate) => onY(candidate, corner.y));
      const vertical = points.find((candidate) => onX(candidate, corner.x));
      if (!horizontal || !vertical || horizontal === vertical) {
        return;
      }
      acceptRadius(corner, Math.abs(horizontal.x - corner.x), Math.abs(vertical.y - corner.y), segment);
    });
  });
  if (radii.size !== 4) {
    return [];
  }
  const values = [...radii.values()];
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const radiusTolerance = Math.max(tolerance, average * 0.08);
  return Math.max(...values) - Math.min(...values) <= radiusTolerance ? values : [];
}

function svgPaletteDataAttribute(colors) {
  const palette = uniqueNormalizedHexColors(colors);
  return palette.length ? palette.join(",") : "";
}

function svgPaletteDataAttributeColors(value) {
  return uniqueNormalizedHexColors(String(value || "").split(","));
}

function uniqueNormalizedHexColors(colors) {
  const output = [];
  const seen = new Set();
  (Array.isArray(colors) ? colors : []).forEach((color) => {
    const normalized = normalizeHexColor(color);
    if (!normalized || seen.has(normalized)) {
      return;
    }
    seen.add(normalized);
    output.push(normalized);
  });
  return output;
}

function svgPaintAnalysis(svg) {
  const text = String(svg || "");
  const domAnalysis = svgPaintAnalysisFromDom(text);
  return domAnalysis || svgPaintAnalysisFromText(text);
}

function svgPaintAnalysisFromDom(svg) {
  if (typeof DOMParser === "undefined" || !remoteBrandSvgHasRootElement(svg)) {
    return null;
  }
  let doc;
  try {
    doc = new DOMParser().parseFromString(svg, "image/svg+xml");
  } catch {
    return null;
  }
  if (!doc?.documentElement || doc.querySelector("parsererror")) {
    return null;
  }
  const colors = [];
  const visibleColors = [];
  const definitionColors = [];
  const paintServerColors = [];
  const seenColors = new Set();
  const seenVisibleColors = new Set();
  const seenDefinitionColors = new Set();
  const seenPaintServerColors = new Set();
  const paintServerTags = new Set(["lineargradient", "radialgradient", "meshgradient", "pattern", "filter", "mask"]);
  const effectPaintServerTags = new Set(["pattern", "filter", "mask"]);
  const styleRules = svgStyleRules(doc);
  const idMap = new Map([...doc.querySelectorAll("[id]")].map((element) => [element.id, element]));
  let usesPaintServer = false;
  let hasEffectPaintServer = false;
  const push = (target, seen, value, currentColor = "") => {
    const color = normalizeSvgHexColor(resolveSvgColorValue(value, currentColor));
    if (!color || seen.has(color)) {
      return;
    }
    seen.add(color);
    target.push(color);
  };
  const styleValue = (element, property) => {
    const attributeValue = element.hasAttribute(property) ? element.getAttribute(property) || "" : "";
    let value = attributeValue;
    for (const rule of styleRules) {
      if (rule.properties[property] && svgElementMatches(element, rule.selector)) {
        value = rule.properties[property];
      }
    }
    const inlineValue = svgInlineStyleProperty(element.getAttribute("style") || "", property);
    return {
      attributeValue,
      value: inlineValue || value
    };
  };
  const paintValue = (element, property) => styleValue(element, property).value;
  const isInsidePaintServerDefinition = (element) => {
    let current = element;
    while (current?.nodeType === 1) {
      if (paintServerTags.has(current.tagName.toLowerCase())) {
        return true;
      }
      current = current.parentElement;
    }
    return false;
  };
  const inheritedColor = (element) => {
    let current = element;
    while (current?.nodeType === 1) {
      const value = paintValue(current, "color");
      const color = normalizeSvgHexColor(resolveSvgColorValue(value));
      if (color) {
        return color;
      }
      current = current.parentElement;
    }
    return "";
  };
  const collectPaintServerColors = (paintServer, visited = new Set()) => {
    if (!paintServer || visited.has(paintServer)) {
      return;
    }
    visited.add(paintServer);
    [paintServer, ...paintServer.querySelectorAll("*")].forEach((element) => {
      const currentColor = inheritedColor(element);
      SVG_PAINT_COLOR_PROPERTIES.forEach((property) => {
        const value = paintValue(element, property);
        push(definitionColors, seenDefinitionColors, value, currentColor);
        push(paintServerColors, seenPaintServerColors, value, currentColor);
      });
      const href = element.getAttribute("href") || element.getAttribute("xlink:href") || "";
      const inheritedPaintServer = href.startsWith("#") ? idMap.get(href.slice(1)) : null;
      if (inheritedPaintServer) {
        collectPaintServerColors(inheritedPaintServer, visited);
      }
    });
  };
  const collectPaintServer = (value) => {
    const match = String(value || "").match(/url\(\s*#([^)\s]+)\s*\)/i);
    if (!match) {
      return;
    }
    const paintServer = idMap.get(match[1]);
    if (!paintServer) {
      return;
    }
    usesPaintServer = true;
    const tagName = paintServer.tagName.toLowerCase();
    if (effectPaintServerTags.has(tagName)) {
      hasEffectPaintServer = true;
    }
    collectPaintServerColors(paintServer);
  };

  doc.querySelectorAll("*").forEach((element) => {
    const currentColor = inheritedColor(element);
    SVG_PAINT_COLOR_PROPERTIES.forEach((property) => {
      const { attributeValue, value } = styleValue(element, property);
      if (!isInsidePaintServerDefinition(element)) {
        push(visibleColors, seenVisibleColors, value, currentColor);
        if (/^url\(/i.test(String(value || "").trim())) {
          push(visibleColors, seenVisibleColors, attributeValue, currentColor);
        }
      } else {
        push(definitionColors, seenDefinitionColors, value, currentColor);
      }
      collectPaintServer(value);
    });
    SVG_PAINT_SERVER_REFERENCE_PROPERTIES.forEach((property) => {
      collectPaintServer(paintValue(element, property));
    });
  });
  visibleColors.forEach((color) => push(colors, seenColors, color));
  definitionColors.forEach((color) => push(colors, seenColors, color));
  paintServerColors.forEach((color) => push(visibleColors, seenVisibleColors, color));
  paintServerColors.forEach((color) => push(colors, seenColors, color));
  return { colors, visibleColors, definitionColors, paintServerColors, usesPaintServer, hasEffectPaintServer };
}

const SVG_PAINT_COLOR_PROPERTIES = Object.freeze([
  "fill",
  "stroke",
  "color",
  "stop-color",
  "flood-color",
  "lighting-color"
]);
const SVG_PAINT_SERVER_REFERENCE_PROPERTIES = Object.freeze([
  "fill",
  "stroke",
  "filter",
  "mask"
]);
const SVG_PAINT_STYLE_PROPERTIES = Object.freeze([
  ...new Set([...SVG_PAINT_COLOR_PROPERTIES, ...SVG_PAINT_SERVER_REFERENCE_PROPERTIES])
]);

function svgPaintAnalysisFromText(svg) {
  const palette = [];
  const visibleColors = [];
  const definitionColors = [];
  const paintServerColors = [];
  const seen = new Set();
  const seenVisibleColors = new Set();
  const seenDefinitionColors = new Set();
  const seenPaintServerColors = new Set();
  const pushColor = (target, targetSeen, value) => {
    const color = normalizeSvgHexColor(resolveSvgColorValue(value));
    if (!color || targetSeen.has(color)) {
      return;
    }
    targetSeen.add(color);
    target.push(color);
  };
  const text = String(svg || "");
  const paintServerBlockPattern = /<(?:linearGradient|radialGradient|meshgradient|pattern|filter|mask)\b[\s\S]*?<\/(?:linearGradient|radialGradient|meshgradient|pattern|filter|mask)>/gi;
  const referencedPaintServer = /\s(?:fill|stroke|filter|mask)\s*=\s*(["'])\s*url\(/i.test(text)
    || /(?:fill|stroke|filter|mask)\s*:\s*url\(/i.test(text);
  const referencedEffectPaintServer = /\s(?:filter|mask)\s*=\s*(["'])\s*url\(/i.test(text)
    || /(?:filter|mask)\s*:\s*url\(/i.test(text);
  const directText = text.replace(paintServerBlockPattern, "");
  const colorAttributeMatches = directText.matchAll(/\s(?:fill|stroke|color|stop-color|flood-color|lighting-color)\s*=\s*(["'])([^"']+)\1/gi);
  for (const match of colorAttributeMatches) {
    pushColor(visibleColors, seenVisibleColors, match[2]);
  }
  const inlineStyleMatches = directText.matchAll(/(?:^|["'{;\s])(?:fill|stroke|color|stop-color|flood-color|lighting-color)\s*:\s*([^;"'}\s][^;"'}]*)/gi);
  for (const match of inlineStyleMatches) {
    pushColor(visibleColors, seenVisibleColors, match[1]);
  }
  const allPaintServerText = (String(svg || "").match(paintServerBlockPattern) || []).join("");
  const allPaintServerAttributeMatches = allPaintServerText.matchAll(/\s(?:fill|stroke|color|stop-color|flood-color|lighting-color)\s*=\s*(["'])([^"']+)\1/gi);
  for (const match of allPaintServerAttributeMatches) {
    pushColor(definitionColors, seenDefinitionColors, match[2]);
  }
  const allPaintServerStyleMatches = allPaintServerText.matchAll(/(?:^|["'{;\s])(?:fill|stroke|color|stop-color|flood-color|lighting-color)\s*:\s*([^;"'}\s][^;"'}]*)/gi);
  for (const match of allPaintServerStyleMatches) {
    pushColor(definitionColors, seenDefinitionColors, match[1]);
  }
  const referencedPaintServerText = referencedPaintServer ? allPaintServerText : "";
  const paintServerAttributeMatches = referencedPaintServerText.matchAll(/\s(?:fill|stroke|color|stop-color|flood-color|lighting-color)\s*=\s*(["'])([^"']+)\1/gi);
  for (const match of paintServerAttributeMatches) {
    pushColor(paintServerColors, seenPaintServerColors, match[2]);
  }
  const paintServerStyleMatches = referencedPaintServerText.matchAll(/(?:^|["'{;\s])(?:fill|stroke|color|stop-color|flood-color|lighting-color)\s*:\s*([^;"'}\s][^;"'}]*)/gi);
  for (const match of paintServerStyleMatches) {
    pushColor(paintServerColors, seenPaintServerColors, match[1]);
  }
  visibleColors.forEach((color) => pushColor(palette, seen, color));
  definitionColors.forEach((color) => pushColor(palette, seen, color));
  paintServerColors.forEach((color) => pushColor(visibleColors, seenVisibleColors, color));
  paintServerColors.forEach((color) => pushColor(palette, seen, color));
  return {
    colors: palette,
    visibleColors,
    definitionColors,
    paintServerColors,
    usesPaintServer: referencedPaintServer,
    hasEffectPaintServer: referencedEffectPaintServer
      || (referencedPaintServer && /<(?:pattern|filter|mask)\b/i.test(text))
  };
}

function svgStyleRules(doc) {
  const rules = [];
  doc.querySelectorAll("style").forEach((styleElement) => {
    const css = styleElement.textContent || "";
    for (const match of css.matchAll(/([^{}]+)\{([^{}]+)\}/g)) {
      const properties = svgStyleDeclarationProperties(match[2]);
      if (!Object.keys(properties).length) {
        continue;
      }
      match[1].split(",").map((selector) => selector.trim()).filter(Boolean).forEach((selector) => {
        rules.push({ selector, properties });
      });
    }
  });
  return rules;
}

function svgElementMatches(element, selector) {
  try {
    return element.matches(selector);
  } catch {
    return false;
  }
}

function svgStyleDeclarationProperties(styleText) {
  const properties = {};
  String(styleText || "").split(";").forEach((declaration) => {
    const separator = declaration.indexOf(":");
    if (separator <= 0) {
      return;
    }
    const property = declaration.slice(0, separator).trim().toLowerCase();
    if (!SVG_PAINT_STYLE_PROPERTIES.includes(property)) {
      return;
    }
    properties[property] = declaration.slice(separator + 1).trim();
  });
  return properties;
}

function svgInlineStyleProperty(styleText, property) {
  return svgStyleDeclarationProperties(styleText)[property] || "";
}

function resolveSvgColorValue(value, currentColor = "") {
  const raw = String(value || "").trim();
  if (/^currentColor$/i.test(raw)) {
    return currentColor;
  }
  const varMatch = raw.match(/^var\(\s*--[^,\s)]+(?:\s*,\s*([^)]+))?\)$/i);
  if (varMatch?.[1]) {
    return varMatch[1].trim();
  }
  return raw;
}

function normalizeSvgHexColor(value) {
  const color = String(value || "")
    .trim()
    .replace(/\s*!important\s*$/i, "")
    .toLowerCase();
  if (!color || /^(?:none|transparent|currentcolor|inherit|initial|unset)$/i.test(color) || /^url\(/i.test(color)) {
    return "";
  }
  if (/^#[0-9a-f]{6}$/i.test(color)) {
    return color;
  }
  if (/^#[0-9a-f]{8}$/i.test(color)) {
    return color.slice(7, 9) === "00" ? "" : color.slice(0, 7);
  }
  if (/^#[0-9a-f]{3}$/i.test(color)) {
    return `#${[...color.slice(1)].map((character) => character + character).join("")}`;
  }
  if (/^#[0-9a-f]{4}$/i.test(color)) {
    const [red, green, blue, alpha] = [...color.slice(1)];
    if (alpha === "0") {
      return "";
    }
    return `#${red}${red}${green}${green}${blue}${blue}`;
  }
  const rgbMatch = color.match(/^rgba?\(\s*([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)(?:\s*,\s*([+-]?\d*(?:\.\d+)?))?\s*\)$/i);
  if (rgbMatch) {
    if (rgbMatch[4] !== undefined && Number(rgbMatch[4]) <= 0) {
      return "";
    }
    return rgbToHex([rgbMatch[1], rgbMatch[2], rgbMatch[3]].map((channel) => {
      return Math.round(Math.max(0, Math.min(255, Number(channel))));
    }));
  }
  const namedColors = {
    black: "#000000",
    blue: "#0000ff",
    cyan: "#00ffff",
    gray: "#808080",
    green: "#008000",
    grey: "#808080",
    lime: "#00ff00",
    magenta: "#ff00ff",
    orange: "#ffa500",
    purple: "#800080",
    red: "#ff0000",
    white: "#ffffff",
    yellow: "#ffff00"
  };
  if (Object.hasOwn(namedColors, color)) {
    return namedColors[color];
  }
  return "";
}

function decodeSvgDataUrl(value) {
  const source = String(value || "");
  if (!/^data:image\/svg\+xml[,;]/i.test(source)) {
    return "";
  }
  const commaIndex = source.indexOf(",");
  if (commaIndex < 0) {
    return "";
  }
  const metadata = source.slice(0, commaIndex).toLowerCase();
  const payload = source.slice(commaIndex + 1);
  try {
    return metadata.includes(";base64")
      ? atob(payload)
      : decodeURIComponent(payload);
  } catch {
    return "";
  }
}

function remoteBrandIconSlugCandidates(parsedUrl) {
  const siteKey = siteGroupKey(parsedUrl);
  const candidates = [];
  const addCandidate = (value, score, source) => {
    const slug = remoteBrandIconSlug(value);
    if (!slug || (slug.length < 2 && slug !== "x")) {
      return;
    }
    candidates.push({ slug, score, source });
  };
  (REMOTE_BRAND_ICON_SLUGS_BY_SITE_KEY[siteKey] || []).forEach((slug, index) => {
    addCandidate(slug, index === 0 ? 100 : 88, "alias");
  });
  const host = normalizeHostname(siteKey);
  const labels = host.split(".").filter(Boolean);
  if (labels.length) {
    const registrableLabels = remoteBrandIconRegistrableLabels(labels);
    addCandidate(registrableLabels.join(""), 92, "registrable");
    addCandidate(labels.join(""), 74, "host");
    addCandidate(labels[0], 68, "host-label");
  }
  addCandidate(SITE_NAME_BY_KEY[siteKey] || "", 64, "site-name");
  return remoteBrandIconRankedCandidates(candidates).slice(0, 8);
}

function remoteBrandIconRankedCandidates(candidates) {
  const bestBySlug = new Map();
  for (const candidate of candidates) {
    const existing = bestBySlug.get(candidate.slug);
    if (!existing || candidate.score > existing.score) {
      bestBySlug.set(candidate.slug, candidate);
    }
  }
  return [...bestBySlug.values()].sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug));
}

function remoteBrandIconRegistrableLabels(labels) {
  if (labels.length <= 2) {
    return labels.slice(0, 1);
  }
  const suffix = labels.slice(-2).join(".");
  const labelCount = MULTIPART_PUBLIC_SUFFIXES.has(suffix) ? 3 : 2;
  return labels.slice(0, -labelCount + 1);
}

function remoteBrandIconSlug(value) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\+/g, "plus")
    .replace(/\./g, "dot")
    .replace(/[^a-z0-9]+/g, "");
}

async function discoverSiteIconCandidateEntries(url) {
  const parsedUrl = safeUrl(url);
  if (!parsedUrl) {
    return [];
  }
  const candidates = await discoverSiteIconCandidates(parsedUrl);
  const seenUrls = new Set();
  return candidates
    .slice(0, SITE_ICON_DISCOVERY_CANDIDATE_LIMIT)
    .filter((candidate) => {
      const key = String(candidate?.url || "").replace(/#.*$/, "");
      if (!key || seenUrls.has(key)) {
        return false;
      }
      seenUrls.add(key);
      return true;
    });
}

async function discoverSiteIconCandidates(parsedUrl) {
  const candidates = [...rootSiteIconCandidates(parsedUrl)];
  try {
    const document = await fetchSiteIconDocument(`${parsedUrl.origin}/`);
    const extracted = extractSiteIconDocumentCandidates(document.html, document.baseUrl);
    candidates.push(...extracted.icons);
    for (const manifest of extracted.manifests.slice(0, 3)) {
      const manifestIcons = await fetchManifestIconCandidates(manifest.url, manifest.score);
      candidates.push(...manifestIcons);
    }
  } catch {
    // Root favicon candidates still cover sites that block page HTML fetches.
  }
  return dedupeAndSortSiteIconCandidates(candidates);
}

async function fetchSiteIconDocument(url) {
  const response = await withTimeout(fetch(url, {
    cache: "force-cache",
    credentials: "omit",
    redirect: "follow"
  }), SITE_ICON_DOCUMENT_DISCOVERY_TIMEOUT_MS, "Site icon document discovery timed out.");
  if (!response.ok) {
    throw new Error(`Site icon page request failed: ${response.status}`);
  }
  const contentType = response.headers.get("content-type") || "";
  if (contentType && !/\b(?:text\/html|application\/xhtml\+xml|text\/plain)\b/i.test(contentType)) {
    throw new Error(`Site icon page is not HTML: ${contentType}`);
  }
  const html = (await response.text()).slice(0, SITE_ICON_DISCOVERY_HTML_MAX_BYTES);
  return {
    html,
    baseUrl: response.headers.get("x-wayleaf-final-url") || response.url || url
  };
}

function extractSiteIconDocumentCandidates(html, baseUrl) {
  const markup = String(html || "");
  const icons = [];
  const manifests = [];
  const linkPattern = /<link\b[^>]*>/gi;
  let linkMatch;
  let index = 0;
  while ((linkMatch = linkPattern.exec(markup))) {
    const attrs = parseHtmlTagAttributes(linkMatch[0]);
    const relTokens = siteIconRelTokens(attrs.rel);
    const href = normalizeText(attrs.href);
    if (!href) {
      index += 1;
      continue;
    }
    if (relTokens.has("manifest")) {
      const manifestUrl = absoluteIconUrl(href, baseUrl);
      if (manifestUrl) {
        manifests.push({
          url: manifestUrl,
          source: "document",
          score: 520 + index / 1000
        });
      }
    }
    const relScore = siteIconRelScore(relTokens);
    if (relScore) {
      const iconUrl = absoluteIconUrl(href, baseUrl);
      if (iconUrl) {
        const sizes = parseIconSizes(attrs.sizes);
        const type = normalizeText(attrs.type).toLowerCase();
        icons.push({
          url: iconUrl,
          source: "document",
          score: relScore
            + siteIconSizeScore(sizes)
            + siteIconTypeScore(type, iconUrl)
            + index / 1000
        });
      }
    }
    index += 1;
  }
  return {
    icons: dedupeAndSortSiteIconCandidates(icons),
    manifests: dedupeAndSortSiteIconCandidates(manifests)
  };
}

function parseHtmlTagAttributes(tag) {
  const attrs = {};
  const attrPattern = /([^\s"'<>/=]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;
  let attrMatch;
  while ((attrMatch = attrPattern.exec(String(tag || "")))) {
    const name = attrMatch[1]?.toLowerCase();
    if (!name) {
      continue;
    }
    attrs[name] = decodeHtmlAttribute(attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? "");
  }
  return attrs;
}

function decodeHtmlAttribute(value) {
  const text = String(value || "");
  if (!text.includes("&")) {
    return text;
  }
  if (typeof document !== "undefined" && document.createElement) {
    const element = document.createElement("textarea");
    element.innerHTML = text;
    return element.value;
  }
  return text.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function siteIconRelTokens(value) {
  return new Set(normalizeText(value).toLowerCase().split(/\s+/).filter(Boolean));
}

function siteIconRelScore(relTokens) {
  if (relTokens.has("icon")) {
    return 1100;
  }
  if (relTokens.has("apple-touch-icon") || relTokens.has("apple-touch-icon-precomposed")) {
    return 900;
  }
  if (relTokens.has("mask-icon")) {
    return 620;
  }
  return 0;
}

async function fetchManifestIconCandidates(manifestUrl, baseScore = 0) {
  try {
    const response = await withTimeout(fetch(manifestUrl, {
      cache: "force-cache",
      credentials: "omit",
      redirect: "follow"
    }), SITE_ICON_DISCOVERY_TIMEOUT_MS, "Site icon manifest request timed out.");
    if (!response.ok) {
      return [];
    }
    const manifest = await response.json();
    const icons = Array.isArray(manifest?.icons) ? manifest.icons : [];
    return dedupeAndSortSiteIconCandidates(icons.map((icon, index) => {
      const iconUrl = absoluteIconUrl(icon?.src || "", response.url || manifestUrl);
      if (!iconUrl) {
        return null;
      }
      const sizes = parseIconSizes(icon.sizes);
      const type = normalizeText(icon.type).toLowerCase();
      const purpose = normalizeText(icon.purpose).toLowerCase();
      return {
        url: iconUrl,
        source: "manifest",
        score: baseScore
          + 320
          + siteIconSizeScore(sizes)
          + siteIconTypeScore(type, iconUrl)
          + siteIconPurposeScore(purpose)
          + index / 1000
      };
    }).filter(Boolean));
  } catch {
    return [];
  }
}

function rootSiteIconCandidates(parsedUrl) {
  return [
    { href: "/favicon.ico", score: 470 },
    { href: "/favicon.png", score: 450 },
    { href: "/favicon.svg", score: 430 },
    { href: "/apple-touch-icon.png", score: 390 },
    { href: "/apple-touch-icon-precomposed.png", score: 370 }
  ].map((candidate) => ({
    url: absoluteIconUrl(candidate.href, parsedUrl.origin),
    source: "root",
    score: candidate.score + siteIconTypeScore("", candidate.href)
  })).filter((candidate) => candidate.url);
}

function parseIconSizes(value) {
  const text = normalizeText(value).toLowerCase();
  if (/\bany\b/.test(text)) {
    return [Infinity];
  }
  return (text.match(/\d+x\d+/gi) || [])
    .map((size) => {
      const [width, height] = size.toLowerCase().split("x").map(Number);
      return Math.min(width || 0, height || 0);
    })
    .filter((size) => Number.isFinite(size) && size > 0);
}

function siteIconSizeScore(sizes) {
  if (!sizes.length) {
    return 42;
  }
  if (sizes.some((size) => size === Infinity)) {
    return 180;
  }
  const target = SITE_ICON_DISCOVERY_TARGET_SIZE;
  const bestAtLeastTarget = sizes
    .filter((size) => size >= target)
    .sort((a, b) => a - b)[0];
  const bestSize = bestAtLeastTarget || Math.max(...sizes);
  if (bestSize >= target) {
    return 180 - Math.min(70, (bestSize - target) * 0.25);
  }
  return 42 + Math.min(100, bestSize * 0.75);
}

function siteIconTypeScore(type, url) {
  const mime = normalizeSiteIconMime(type) || siteIconMimeFromUrl(url);
  if (/^image\/(?:png|webp|svg\+xml)$/i.test(mime)) {
    return 82;
  }
  if (/^image\/(?:x-icon|vnd\.microsoft\.icon|jpeg|jpg)$/i.test(mime)) {
    return 70;
  }
  return siteIconUrlLooksLikeImage(url) ? 48 : 0;
}

function siteIconPurposeScore(purpose) {
  const tokens = new Set(normalizeText(purpose).toLowerCase().split(/\s+/).filter(Boolean));
  if (tokens.has("monochrome") && !tokens.has("any") && !tokens.has("maskable")) {
    return -180;
  }
  if (tokens.has("any")) {
    return 34;
  }
  if (tokens.has("maskable")) {
    return 20;
  }
  return 0;
}

function dedupeAndSortSiteIconCandidates(candidates) {
  const seen = new Set();
  return candidates
    .filter((candidate) => candidate?.url)
    .sort((a, b) => b.score - a.score)
    .filter((candidate) => {
      const key = candidate.url.replace(/#.*$/, "");
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
}

function absoluteIconUrl(value, baseUrl) {
  const dataUrl = normalizeStoredSiteIcon(value);
  if (dataUrl) {
    return dataUrl;
  }
  try {
    const iconUrl = new URL(value, baseUrl);
    return /^https?:$/.test(iconUrl.protocol) ? iconUrl.href : "";
  } catch {
    return "";
  }
}

async function fetchImageDataUrl(url) {
  const dataUrl = normalizeStoredSiteIcon(url);
  if (dataUrl) {
    return dataUrl;
  }
  const response = await withTimeout(fetch(url, {
    cache: "force-cache",
    credentials: "omit",
    redirect: "follow"
  }), SITE_ICON_FETCH_TIMEOUT_MS, "Site icon image request timed out.");
  if (!response.ok) {
    throw new Error(`Site icon image request failed: ${response.status}`);
  }
  const contentType = response.headers.get("content-type") || "";
  const responseUrl = response.url || url;
  if (!siteIconResponseLooksLikeImage(contentType, responseUrl)) {
    return "";
  }
  const blob = await response.blob();
  if (!blob.size || blob.size > MAX_CACHED_SITE_ICON_BYTES) {
    return "";
  }
  const mime = normalizeSiteIconMime(blob.type)
    || normalizeSiteIconMime(contentType)
    || siteIconMimeFromUrl(responseUrl);
  return await blobToDataUrl(mime ? new Blob([blob], { type: mime }) : blob);
}

function siteIconResponseLooksLikeImage(contentType, url) {
  const mime = normalizeSiteIconMime(contentType);
  if (supportedSiteIconMime(mime)) {
    return true;
  }
  return (!mime || /^application\/octet-stream$/i.test(mime)) && siteIconUrlLooksLikeImage(url);
}

function normalizeSiteIconMime(value) {
  return normalizeText(value).split(";")[0].trim().toLowerCase();
}

function supportedSiteIconMime(mime) {
  return /^image\/(?:png|jpe?g|webp|svg\+xml|x-icon|vnd\.microsoft\.icon)$/i.test(mime);
}

function siteIconUrlLooksLikeImage(url) {
  return /\.(?:ico|png|jpe?g|webp|svg)(?:[?#].*)?$/i.test(String(url || ""));
}

function siteIconMimeFromUrl(url) {
  const pathname = (() => {
    try {
      return new URL(url, "https://example.com").pathname.toLowerCase();
    } catch {
      return String(url || "").toLowerCase();
    }
  })();
  if (pathname.endsWith(".ico")) {
    return "image/x-icon";
  }
  if (pathname.endsWith(".png")) {
    return "image/png";
  }
  if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) {
    return "image/jpeg";
  }
  if (pathname.endsWith(".webp")) {
    return "image/webp";
  }
  if (pathname.endsWith(".svg")) {
    return "image/svg+xml";
  }
  return "";
}

function blobToDataUrl(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(normalizeStoredSiteIcon(reader.result)));
    reader.addEventListener("error", () => resolve(""));
    reader.readAsDataURL(blob);
  });
}

function normalizeStoredSiteIcon(icon) {
  const value = normalizeText(icon);
  if (!value || value.length > MAX_CACHED_SITE_ICON_BYTES * 2) {
    return "";
  }
  return /^data:image\/(?:png|jpe?g|webp|svg\+xml|x-icon|vnd\.microsoft\.icon);base64,/i.test(value)
    || /^data:image\/svg\+xml(?:;charset=[^,;]+)?(?:;utf8)?[,;]/i.test(value)
    ? value
    : "";
}

function favoriteSiteTitleFromUrl(url) {
  const parsedUrl = safeUrl(url);
  return siteDisplayName(parsedUrl, "").slice(0, MAX_PORTAL_TITLE_LENGTH) || compactSiteDomain(url);
}

function favoriteSiteKey(url) {
  return normalizePortalUrl(url);
}

function favoriteSiteKeySet(sites = []) {
  return new Set(
    sites
      .map((site) => favoriteSiteKey(site?.url))
      .filter(Boolean)
  );
}

async function removeFavoriteSite(id, node) {
  if (node?.classList.contains("removing")) {
    return;
  }
  if (node) {
    if (activeFavoriteDeleteCard === node) {
      activeFavoriteDeleteCard = null;
    }
    node.classList.remove("pressing", "clearing");
    node.classList.add("removing");
    await animateFavoriteTearAway(node);
  }
  const nextSites = (await loadFavoriteSites()).filter((site) => site.id !== id);
  await saveFavoriteSites(nextSites);
  await renderFavoriteDependentSurfaces({ preserveBookmarkScroll: true });
}

function wait(duration) {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

async function animateFavoriteTearAway(node) {
  const shell = node.querySelector(".favorite-icon-shell");
  if (!shell) {
    await wait(FAVORITE_DELETE_EXIT_MS);
    return;
  }
  const rect = shell.getBoundingClientRect();
  const layer = document.createElement("div");
  const topPiece = createFavoriteTearPiece(shell, rect, "top");
  const bottomPiece = createFavoriteTearPiece(shell, rect, "bottom");
  layer.className = "favorite-tear-layer";
  layer.append(topPiece, bottomPiece);
  document.body.appendChild(layer);
  shell.style.visibility = "hidden";
  const gsap = getGsap();
  if (gsap) {
    await new Promise((resolve) => {
      const midpointDuration = gsapDuration(FAVORITE_DELETE_EXIT_MS * 0.42);
      const exitDuration = gsapDuration(FAVORITE_DELETE_EXIT_MS * 0.58);
      gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: resolve
      })
        .set([topPiece, bottomPiece], { autoAlpha: 1, x: 0, y: 0, rotation: 0, scale: 0.82 })
        .to(topPiece, { x: -3, y: -7, rotation: -4, scale: 0.78, duration: midpointDuration }, 0)
        .to(bottomPiece, { x: 4, y: 8, rotation: 5, scale: 0.78, duration: midpointDuration }, 0)
        .to(topPiece, { autoAlpha: 0, x: -18, y: -34, rotation: -18, scale: 0.46, duration: exitDuration }, midpointDuration)
        .to(bottomPiece, { autoAlpha: 0, x: 22, y: 36, rotation: 20, scale: 0.44, duration: exitDuration }, midpointDuration);
    });
    layer.remove();
    return;
  }
  const timing = {
    duration: FAVORITE_DELETE_EXIT_MS,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    fill: "forwards"
  };
  const topAnimation = topPiece.animate([
    { opacity: 1, transform: "translate3d(0, 0, 0) rotate(0deg) scale(0.82)" },
    { opacity: 1, transform: "translate3d(-3px, -7px, 0) rotate(-4deg) scale(0.78)", offset: 0.42 },
    { opacity: 0, transform: "translate3d(-18px, -34px, 0) rotate(-18deg) scale(0.46)" }
  ], timing);
  const bottomAnimation = bottomPiece.animate([
    { opacity: 1, transform: "translate3d(0, 0, 0) rotate(0deg) scale(0.82)" },
    { opacity: 1, transform: "translate3d(4px, 8px, 0) rotate(5deg) scale(0.78)", offset: 0.42 },
    { opacity: 0, transform: "translate3d(22px, 36px, 0) rotate(20deg) scale(0.44)" }
  ], timing);
  await Promise.allSettled([topAnimation.finished, bottomAnimation.finished]);
  layer.remove();
}

function createFavoriteTearPiece(shell, rect, part) {
  const piece = document.createElement("div");
  const clone = shell.cloneNode(true);
  const topOffset = part === "top" ? 0 : rect.height / 2;
  piece.className = `favorite-tear-piece ${part}`;
  piece.style.left = `${rect.left}px`;
  piece.style.top = `${rect.top + topOffset}px`;
  piece.style.width = `${rect.width}px`;
  piece.style.height = `${rect.height / 2}px`;
  clone.style.top = `${-topOffset}px`;
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  piece.appendChild(clone);
  return piece;
}

function compactSiteDomain(url) {
  const parsedUrl = safeUrl(url);
  if (!parsedUrl) {
    return "";
  }
  return parsedUrl.hostname.replace(/^www\./, "");
}

function applySiteIcon(icon, site, options = {}) {
  const localIcon = localIconForUrl(site.url);
  const siteIcon = normalizeStoredSiteIcon(site.icon || "");
  const iconSource = localIcon || siteIcon;
  const siteIconIsRemoteBrand = Boolean(remoteBrandSvgDescriptorFromSource(siteIcon));
  const tileIconSource = localIcon || (siteIconIsRemoteBrand ? siteIcon : "");
  const shouldRefreshRemoteBrand = localIcon
    ? Boolean(localSiteIconRenderMode(localIcon) && localIconNeedsRemoteBrandColor(siteGroupKey(safeUrl(site.url)), localIcon))
    : siteIcon && !siteIconIsRemoteBrand;
  storeIconSiteContext(icon, site);
  delete icon.dataset.iconCacheHydrated;
  applySiteIconTile(icon, site, tileIconSource);
  hydrateLocalSiteIconBrandColor(icon, site, tileIconSource);
  if (localIcon) {
    delete icon.dataset.remoteBrandIconRequest;
  }
  if (iconSource) {
    const displayIcon = displayIconSource(icon, iconSource, options);
    const setIconSource = (source) => {
      icon.dataset.iconSource = iconSource;
      icon.dataset.iconCandidate = iconSource;
      delete icon.dataset.iconDefaultRescue;
      delete icon.dataset.iconDefaultProbe;
      icon.classList.remove("site-icon-generic-fallback");
      if (iconSourceCanUseBitmapTileFusion(iconSource)) {
        icon.addEventListener("load", () => {
          if (iconStillRenderingCandidate(icon, iconSource)) {
            applyFaviconMatchedTile(icon);
          }
        }, { once: true });
      }
      icon.src = source;
      icon.removeAttribute("srcset");
      bindFaviconFallback(icon, site, 128);
      if (shouldRefreshRemoteBrand) {
        refreshRemoteBrandIcon(icon, site);
      }
    };
    if (displayIcon instanceof Promise) {
      return displayIcon.then((source) => setIconSource(source));
    }
    setIconSource(displayIcon);
    return undefined;
  } else {
    applyFaviconIcon(icon, site, 128);
    refreshRemoteBrandIcon(icon, site);
    return undefined;
  }
}

function doubaoAiIconUrl(engine) {
  const value = String(engine?.iconUrl || "").trim();
  return engine?.id === "doubao" && value.startsWith(`${SITE_ICON_DIRECTORY}/`) ? value : "";
}

function applyExplicitSiteIcon(icon, site, iconSource) {
  storeIconSiteContext(icon, site);
  applySiteIconTile(icon, site, iconSource);
  hydrateLocalSiteIconBrandColor(icon, site, iconSource);
  icon.dataset.iconSource = iconSource;
  icon.dataset.iconCandidate = iconSource;
  icon.dataset.explicitAiIcon = "true";
  delete icon.dataset.iconDefaultRescue;
  delete icon.dataset.iconDefaultProbe;
  icon.classList.remove("site-icon-generic-fallback");
  icon.src = iconSource;
  icon.removeAttribute("srcset");
}

function refreshRemoteBrandIcon(icon, site) {
  const parsedUrl = safeUrl(site.url);
  const siteKey = siteGroupKey(parsedUrl);
  const localIcon = localIconForUrl(site.url);
  if (!siteIconIndexLoaded || !parsedUrl || !siteKey || (localIcon && !localIconNeedsRemoteBrandColor(siteKey, localIcon))) {
    return;
  }
  const requestToken = `${siteKey}:${parsedUrl.href}`;
  icon.dataset.remoteBrandIconRequest = requestToken;
  discoverRemoteBrandIconDataUrl(parsedUrl.href).then((iconDataUrl) => {
    if (
      !iconDataUrl
      || !icon.isConnected
      || icon.dataset.remoteBrandIconRequest !== requestToken
      || siteGroupKey(safeUrl(icon.dataset.siteUrl)) !== siteKey
    ) {
      return;
    }
    const activeLocalIcon = localIconForUrl(site.url);
    if (activeLocalIcon && localIconNeedsRemoteBrandColor(siteKey, activeLocalIcon)) {
      applyRemoteBrandColorToLocalIcon(icon, site, activeLocalIcon, iconDataUrl);
      return;
    }
    applyRemoteBrandIcon(icon, site, iconDataUrl);
  }).catch(() => {});
}

function applyRemoteBrandColorToLocalIcon(icon, site, localIcon, iconDataUrl) {
  const descriptor = remoteBrandSvgDescriptorFromSource(iconDataUrl);
  if (!descriptor?.brandColor) {
    return;
  }
  localSiteIconBrandColorCache.set(localIcon, descriptor.brandColor);
  localSiteIconRenderModeCache.set(localIcon, localSiteIconRenderMode(localIcon) || "mask");
  localSiteIconExplicitBrandColorCache.set(localIcon, true);
  localSiteIconVisibleColorsCache.set(localIcon, descriptor.visibleColors || []);
  localSiteIconEmbeddedCarrierColorCache.set(localIcon, localSiteIconEmbeddedCarrierColor(localIcon));
  applySiteIconTile(icon, site, localIcon);
  const displayIcon = displayIconSource(icon, localIcon);
  if (displayIcon instanceof Promise) {
    displayIcon.then((source) => {
      if (iconStillRenderingCandidate(icon, localIcon)) {
        icon.src = source;
      }
    });
    return;
  }
  icon.src = displayIcon;
}

function applyRemoteBrandIcon(icon, site, iconDataUrl) {
  icon.removeAttribute("srcset");
  storeIconSiteContext(icon, site);
  icon.dataset.iconMissing = "false";
  icon.dataset.iconCandidate = iconDataUrl;
  icon.dataset.iconSource = iconDataUrl;
  delete icon.dataset.iconDefaultRescue;
  delete icon.dataset.iconDefaultRescueCandidate;
  delete icon.dataset.iconDefaultProbe;
  icon.classList.remove("site-icon-generic-fallback");
  applySiteIconTile(icon, site, iconDataUrl);
  const displayIcon = displayIconSource(icon, iconDataUrl);
  if (displayIcon instanceof Promise) {
    icon.src = iconDataUrl;
    displayIcon.then((source) => {
      if (iconStillRenderingCandidate(icon, iconDataUrl)) {
        icon.src = source;
      }
    });
    return;
  }
  icon.src = displayIcon;
}

function localIconForUrl(url) {
  const parsedUrl = safeUrl(url);
  const siteKey = siteGroupKey(parsedUrl);
  return siteIconPathForSiteKey(siteKey);
}

function localIconNeedsRemoteBrandColor(siteKey, iconPath = "") {
  return Boolean(siteKey
    && iconPath
    && siteIconSourceLooksLikeSvg(iconPath)
    && !keepsBrandIconOriginal(siteKey, iconPath)
    && !embeddedSvgBrandColor(iconPath)
    && !localSiteIconHasExplicitBrandColor(iconPath));
}

function siteIconPathForSiteKey(siteKey) {
  if (!siteKey) {
    return "";
  }
  const fileName = SITE_ICON_FILE_BY_SITE_KEY[siteKey] || `${siteKey.split(".")[0]}.svg`;
  if (!availableSiteIconFiles.has(fileName)) {
    return "";
  }
  return `${SITE_ICON_DIRECTORY}/${fileName}`;
}

function applyHistoryIcon(icon, site) {
  applySiteIcon(icon, site);
}

function applyGeneratedSiteIcon(icon, site = {}) {
  const parsedUrl = safeUrl(site.url);
  const seed = parsedUrl?.hostname || site.url || site.title || "";
  storeIconSiteContext(icon, site);
  applyGenericFallbackSiteIcon(icon, seed);
}

function applyGenericFallbackSiteIcon(icon, seed = "") {
  icon.removeAttribute("srcset");
  icon.dataset.iconMissing = "false";
  icon.dataset.iconCandidate = GENERIC_SITE_FALLBACK_ICON;
  icon.dataset.iconSource = GENERIC_SITE_FALLBACK_ICON;
  delete icon.dataset.iconDefaultRescue;
  delete icon.dataset.iconDefaultRescueCandidate;
  delete icon.dataset.iconDefaultProbe;
  icon.classList.add("site-icon-generic-fallback");
  const tileColors = genericSiteFallbackTileColors();
  applyIconTile(icon, "generated", tileColors, false);
  icon.src = GENERIC_SITE_FALLBACK_ICON;
}

function genericSiteFallbackTileColors() {
  return {
    light: GENERIC_SITE_FALLBACK_TILE_COLOR,
    dark: GENERIC_SITE_FALLBACK_TILE_COLOR
  };
}

function hashText(value) {
  let hash = 0;
  for (const character of String(value || "")) {
    hash = ((hash << 5) - hash + character.charCodeAt(0)) | 0;
  }
  return hash;
}

function storeIconSiteContext(icon, site) {
  icon.draggable = false;
  icon.dataset.siteUrl = site.url || "";
  icon.dataset.siteTitle = site.title || icon.alt || "";
}

function preventNativeSiteIconDrag(event) {
  if (event.target?.closest?.(".favorite-link, .recent-folder-face, .site-link")) {
    event.preventDefault();
  }
}

function computeSiteIconTile(site, iconPath = "") {
  const parsedUrl = safeUrl(site.url);
  const siteKey = siteGroupKey(parsedUrl);
  const tileColor = siteIconBrandColor(siteKey, iconPath);
  const remoteDescriptor = remoteBrandSvgDescriptorFromSource(iconPath);
  const originalSvgColor = remoteDescriptor?.renderMode === "original" ? "#ffffff" : "";
  const gradientSvgColor = usesGradientIconCarrier(iconPath) ? "#ffffff" : "";
  const tileMode = iconPath ? "brand" : "plain";
  const isLocalIconSource = String(iconPath || "").startsWith("icons/");
  let tileColors = genericIconTileColors(parsedUrl?.hostname || site.url || site.title);
  if (iconPath && (tileColor || originalSvgColor || gradientSvgColor)) {
    tileColors = brandIconTileColors(tileColor || originalSvgColor || gradientSvgColor, siteKey, iconPath);
  }
  return { siteKey: siteKey || "", tileMode, tileColors, isLocalIconSource };
}

function applySiteIconTile(icon, site, iconPath = "") {
  const tile = computeSiteIconTile(site, iconPath);
  icon.dataset.siteKey = tile.siteKey;
  applyIconTile(icon, tile.tileMode, tile.tileColors, tile.isLocalIconSource);
}

function hydrateLocalSiteIconBrandColor(icon, site, iconPath = "") {
  if (!localSiteIconSourceCanLoadBrandColor(iconPath) || localSiteIconRenderMode(iconPath)) {
    return;
  }
  loadLocalSiteIconBrandColor(iconPath).then(() => {
    if (!icon.isConnected || !iconStillRenderingCandidate(icon, iconPath)) {
      return;
    }
    const hasIconStrategy = siteIconBrandColor(icon.dataset.siteKey || siteGroupKey(safeUrl(site.url)), iconPath)
      || ["gradient", "original"].includes(localSiteIconRenderMode(iconPath));
    if (hasIconStrategy) {
      applySiteIconTile(icon, site, iconPath);
      const displayIcon = displayIconSource(icon, iconPath);
      if (displayIcon instanceof Promise) {
        displayIcon.then((source) => {
          if (iconStillRenderingCandidate(icon, iconPath)) {
            icon.src = source;
          }
        });
      } else {
        icon.src = displayIcon;
      }
    }
    if (localIconNeedsRemoteBrandColor(icon.dataset.siteKey || siteGroupKey(safeUrl(site.url)), iconPath)) {
      refreshRemoteBrandIcon(icon, site);
    }
  });
}

function loadLocalSiteIconBrandColor(source) {
  const value = String(source || "");
  if (!localSiteIconSourceCanLoadBrandColor(value)) {
    return Promise.resolve("");
  }
  if (localSiteIconBrandColorCache.has(value)) {
    return Promise.resolve(localSiteIconBrandColorCache.get(value));
  }
  if (localSiteIconBrandColorRequests.has(value)) {
    return localSiteIconBrandColorRequests.get(value);
  }
  const request = fetch(value)
    .then((response) => response.ok ? response.text() : "")
    .then((svg) => {
      rememberSiteIconRawSvgText(value, svg);
      const analysis = localSiteIconAnalysisFromSvg(svg);
      cacheLocalSiteIconAnalysis(value, analysis);
      return analysis.brandColor;
    })
    .catch(() => {
      localSiteIconBrandColorCache.set(value, "");
      localSiteIconRenderModeCache.set(value, "");
      localSiteIconExplicitBrandColorCache.set(value, false);
      localSiteIconVisibleColorsCache.set(value, []);
      localSiteIconEmbeddedCarrierColorCache.set(value, "");
      return "";
    });
  localSiteIconBrandColorRequests.set(value, request);
  return request;
}

function siteIconBrandColor(siteKey = "", iconPath = "") {
  const remoteDescriptor = remoteBrandSvgDescriptorFromSource(iconPath);
  if (remoteDescriptor) {
    return remoteDescriptor.brandColor;
  }
  const localColor = localSiteIconBrandColor(iconPath);
  const embeddedColor = embeddedSvgBrandColor(iconPath);
  if (embeddedColor) {
    return embeddedColor;
  }
  if (localColor && !remoteBrandColorLooksNeutral(localColor) && !nearBlackBrandColor(localColor)) {
    return localColor;
  }
  if (localColor && !localSiteIconHasExplicitBrandColor(iconPath)) {
    return localColor;
  }
  return normalizeHexColor(siteKey ? SITE_ICON_TILE_COLOR_BY_SITE_KEY[siteKey] || "" : "")
    || localColor;
}

function localSiteIconBrandColor(source) {
  const value = String(source || "");
  if (localSiteIconBrandColorCache.has(value)) {
    return localSiteIconBrandColorCache.get(value);
  }
  if (isSvgDataUrl(value)) {
    const analysis = localSiteIconAnalysisFromSvg(decodeSvgDataUrl(value));
    cacheLocalSiteIconAnalysis(value, analysis);
    return analysis.brandColor;
  }
  return "";
}

function localSiteIconHasExplicitBrandColor(source) {
  const value = String(source || "");
  if (localSiteIconExplicitBrandColorCache.has(value)) {
    return localSiteIconExplicitBrandColorCache.get(value);
  }
  if (isSvgDataUrl(value)) {
    const analysis = localSiteIconAnalysisFromSvg(decodeSvgDataUrl(value));
    cacheLocalSiteIconAnalysis(value, analysis);
    return analysis.hasExplicitBrandColor;
  }
  return false;
}

function localSiteIconRenderMode(source) {
  const value = String(source || "");
  if (localSiteIconRenderModeCache.has(value)) {
    return localSiteIconRenderModeCache.get(value);
  }
  if (isSvgDataUrl(value)) {
    const analysis = localSiteIconAnalysisFromSvg(decodeSvgDataUrl(value));
    cacheLocalSiteIconAnalysis(value, analysis);
    return analysis.renderMode;
  }
  return "";
}

function localSiteIconVisibleColors(source) {
  const value = String(source || "");
  if (localSiteIconVisibleColorsCache.has(value)) {
    return localSiteIconVisibleColorsCache.get(value);
  }
  if (isSvgDataUrl(value)) {
    const analysis = localSiteIconAnalysisFromSvg(decodeSvgDataUrl(value));
    cacheLocalSiteIconAnalysis(value, analysis);
    return analysis.visibleColors;
  }
  return [];
}

function localSiteIconEmbeddedCarrierColor(source) {
  const value = String(source || "");
  if (localSiteIconEmbeddedCarrierColorCache.has(value)) {
    return localSiteIconEmbeddedCarrierColorCache.get(value);
  }
  if (isSvgDataUrl(value)) {
    const analysis = localSiteIconAnalysisFromSvg(decodeSvgDataUrl(value));
    cacheLocalSiteIconAnalysis(value, analysis);
    return analysis.embeddedCarrierColor;
  }
  return "";
}

function cacheLocalSiteIconAnalysis(source, analysis) {
  localSiteIconBrandColorCache.set(source, analysis.brandColor);
  localSiteIconRenderModeCache.set(source, analysis.renderMode);
  localSiteIconExplicitBrandColorCache.set(source, analysis.hasExplicitBrandColor);
  localSiteIconVisibleColorsCache.set(source, analysis.visibleColors);
  localSiteIconEmbeddedCarrierColorCache.set(source, analysis.embeddedCarrierColor || "");
}

function localSiteIconAnalysisFromSvg(svg) {
  if (!remoteBrandSvgHasRootElement(svg)) {
    return { brandColor: "", renderMode: "", hasExplicitBrandColor: false, visibleColors: [], embeddedCarrierColor: "" };
  }
  const analysis = svgPaintAnalysis(svg);
  const isMonochrome = !analysis.usesPaintServer && analysis.visibleColors.length <= 1;
  const palette = analysis.colors;
  const explicitBrandColor = isMonochrome && palette.length === 1
    ? remoteBrandSvgMonochromeBrandColor(svg, palette)
    : "";
  return {
    brandColor: explicitBrandColor || (isMonochrome && remoteBrandSvgUsesImplicitBlack(svg) ? "#000000" : ""),
    renderMode: remoteBrandSvgHasComplexPaintAnalysis(analysis) ? "gradient" : isMonochrome ? "mask" : "original",
    hasExplicitBrandColor: Boolean(explicitBrandColor),
    visibleColors: analysis.colors,
    embeddedCarrierColor: svgEmbeddedCarrierColor(svg)
  };
}

function localSiteIconSourceCanLoadBrandColor(source) {
  return String(source || "").startsWith(`${SITE_ICON_DIRECTORY}/`)
    && siteIconSourceLooksLikeSvg(source);
}

function brandIconTileColors(tileColor, siteKey = "", iconPath = "") {
  const color = normalizeHexColor(tileColor);
  if (usesGradientIconCarrier(iconPath)) {
    return gradientSvgIconTileColors(color, iconPath);
  }
  if (!color) {
    return genericIconTileColors("");
  }
  if (keepsBrandIconOriginalOnBrandTile(siteKey, iconPath)) {
    return {
      light: color,
      dark: color
    };
  }
  if (usesOriginalIconCarrier(iconPath)) {
    const paletteTileColors = originalSvgIconTileColors(color, iconPath);
    if (paletteTileColors) {
      return paletteTileColors;
    }
  }
  return {
    light: brandIconLightCarrierColor(color),
    dark: brandIconDarkCarrierColor(color)
  };
}

function gradientSvgIconTileColors(brandColor, iconPath = "") {
  const palette = originalSvgVisiblePalette(brandColor, iconPath);
  if (palette.length > 1) {
    const carrier = gradientPaletteCarrierColor(palette);
    return {
      light: carrier,
      dark: carrier
    };
  }
  const color = normalizeHexColor(brandColor);
  if (!color) {
    return genericIconTileColors("");
  }
  return {
    light: brandIconLightCarrierColor(color),
    dark: brandIconDarkCarrierColor(color)
  };
}

function gradientPaletteCarrierColor(palette) {
  return gradientPaletteNeedsDarkAppIconCarrier(palette)
    ? BRAND_ICON_MULTICOLOR_DARK_CARRIER
    : BRAND_ICON_MULTICOLOR_PAPER_CARRIER;
}

function gradientPaletteNeedsDarkAppIconCarrier(palette) {
  const colors = uniqueNormalizedHexColors(palette);
  if (colors.length <= 1) {
    return false;
  }
  const traits = paletteColorTraits(colors);
  const lowContrastOnPaperRatio = colors.filter((color) => contrastRatio(color, BRAND_ICON_MULTICOLOR_PAPER_CARRIER) < BRAND_ICON_VI_CONTRAST_MIN).length / colors.length;
  const hueSpan = paletteHueSpan(colors);
  if (hueSpan >= 120 && (traits.averageLuminance < 0.5 || (traits.saturatedMulticolor && lowContrastOnPaperRatio < 0.8))) {
    return false;
  }
  return !traits.hasDark
    && lowContrastOnPaperRatio >= 0.65
    && traits.averageLuminance >= 0.45;
}

function paletteHueSpan(palette) {
  const hues = uniqueNormalizedHexColors(palette)
    .map((color) => {
      const stats = hexColorStats(color);
      const [red, green, blue] = hexToRgb(color).map((channel) => channel / 255);
      const chroma = Math.max(red, green, blue) - Math.min(red, green, blue);
      return chroma >= 0.18 ? stats?.hue || 0 : null;
    })
    .filter((hue) => hue !== null);
  return hues.length ? Math.max(...hues) - Math.min(...hues) : 0;
}

function usesOriginalIconCarrier(iconPath = "") {
  const remoteDescriptor = remoteBrandSvgDescriptorFromSource(iconPath);
  if (remoteDescriptor) {
    return remoteDescriptor.renderMode === "original";
  }
  return localSiteIconRenderMode(iconPath) === "original";
}

function originalSvgIconTileColors(brandColor, iconPath = "") {
  const palette = originalSvgVisiblePalette(brandColor, iconPath);
  if (palette.length <= 1) {
    return null;
  }
  const embeddedCarrier = originalSvgEmbeddedCarrierColor(iconPath);
  if (embeddedCarrier) {
    return {
      light: embeddedCarrier,
      dark: embeddedCarrier
    };
  }
  return {
    light: paletteAwareBrandIconCarrierColor(brandColor, palette, "light"),
    dark: paletteAwareBrandIconCarrierColor(brandColor, palette, "dark")
  };
}

function originalSvgEmbeddedCarrierColor(iconPath = "") {
  const remoteDescriptor = remoteBrandSvgDescriptorFromSource(iconPath);
  return remoteDescriptor?.embeddedCarrierColor || localSiteIconEmbeddedCarrierColor(iconPath);
}

function originalSvgVisiblePalette(brandColor, iconPath = "") {
  const remoteDescriptor = remoteBrandSvgDescriptorFromSource(iconPath);
  const visibleColors = remoteDescriptor?.visibleColors || localSiteIconVisibleColors(iconPath);
  const palette = uniqueNormalizedHexColors(visibleColors);
  if (palette.length > 1) {
    return palette;
  }
  const brand = normalizeHexColor(brandColor);
  return uniqueNormalizedHexColors([...palette, ...(brand && !remoteBrandColorLooksNeutral(brand) ? [brand] : [])]);
}

function paletteAwareBrandIconCarrierColor(brandColor, palette, mode) {
  const colors = uniqueNormalizedHexColors(palette);
  const anchor = paletteCarrierAnchorColor(brandColor, colors);
  if (!anchor || colors.length <= 1) {
    return mode === "dark" ? brandIconDarkCarrierColor(anchor) : brandIconLightCarrierColor(anchor);
  }
  return paletteNeedsDarkAppIconCarrier(palette)
    ? BRAND_ICON_MULTICOLOR_DARK_CARRIER
    : BRAND_ICON_MULTICOLOR_PAPER_CARRIER;
}

function paletteColorTraits(palette) {
  const colors = uniqueNormalizedHexColors(palette);
  const samples = colors.map((color) => {
    const stats = hexColorStats(color);
    const [red, green, blue] = hexToRgb(color).map((channel) => channel / 255);
    const chroma = Math.max(red, green, blue) - Math.min(red, green, blue);
    return {
      color,
      chroma,
      hue: stats?.hue || 0,
      luminance: stats?.luminance ?? relativeLuminance(color),
      saturated: chroma >= 0.24
    };
  });
  const count = Math.max(1, samples.length);
  const lightRatio = samples.filter((sample) => sample.luminance >= 0.72).length / count;
  const darkRatio = samples.filter((sample) => sample.luminance <= 0.16).length / count;
  const saturatedSamples = samples.filter((sample) => sample.saturated);
  const coloredSamples = samples.filter((sample) => sample.chroma >= 0.18);
  return {
    hasDark: darkRatio > 0,
    hasLight: lightRatio > 0,
    lightDominant: lightRatio >= 0.5,
    darkDominant: darkRatio >= 0.6,
    saturatedMulticolor: saturatedSamples.length >= 2,
    coloredRatio: coloredSamples.length / count,
    averageLuminance: samples.reduce((sum, sample) => sum + sample.luminance, 0) / count
  };
}

function paletteNeedsDarkAppIconCarrier(palette) {
  const traits = paletteColorTraits(palette);
  return traits.lightDominant
    && !traits.hasDark
    && traits.averageLuminance >= 0.58
    && traits.coloredRatio <= 0.5;
}

function paletteCarrierAnchorColor(brandColor, palette) {
  const brand = normalizeHexColor(brandColor);
  if (brand && !remoteBrandColorLooksNeutral(brand)) {
    return brand;
  }
  return uniqueNormalizedHexColors(palette).find((color) => !remoteBrandColorLooksNeutral(color)) || brand || "";
}

function brandIconLightCarrierColor(brandColor) {
  const brand = normalizeHexColor(brandColor);
  if (!brand) {
    return "";
  }
  if (contrastRatio(brand, "#ffffff") >= BRAND_ICON_VI_CONTRAST_MIN) {
    return brand;
  }
  for (let amount = 0.04; amount < 1; amount += 0.04) {
    const mixed = mixHexColors(brand, BRAND_ICON_LIGHT_MODE_DARK_CARRIER, amount);
    if (contrastRatio(mixed, "#ffffff") >= BRAND_ICON_VI_CONTRAST_MIN) {
      return mixed;
    }
  }
  return BRAND_ICON_LIGHT_MODE_DARK_CARRIER;
}

function brandIconDarkCarrierColor(brandColor) {
  const brand = normalizeHexColor(brandColor);
  if (!brand) {
    return "";
  }
  return BRAND_ICON_DARK_MODE_CARRIER;
}

function keepsBrandIconOriginal(siteKey, iconPath = "") {
  if (keepsBrandIconOriginalOnBrandTile(siteKey, iconPath)) {
    return true;
  }
  const remoteDescriptor = remoteBrandSvgDescriptorFromSource(iconPath);
  if (remoteDescriptor) {
    return remoteDescriptor.renderMode === "original" || remoteDescriptor.renderMode === "gradient";
  }
  const localRenderMode = localSiteIconRenderMode(iconPath);
  if (localRenderMode === "gradient") {
    return true;
  }
  if (localRenderMode === "original") {
    return true;
  }
  if (localRenderMode === "mask") {
    return false;
  }
  if (!siteIconSourceLooksLikeSvg(iconPath)) {
    return true;
  }
  return isSvgDataUrl(iconPath) && !remoteBrandSvgSourceIsMaskable(iconPath);
}

function usesGradientIconCarrier(iconPath = "") {
  const remoteDescriptor = remoteBrandSvgDescriptorFromSource(iconPath);
  if (remoteDescriptor) {
    return remoteDescriptor.renderMode === "gradient";
  }
  return localSiteIconRenderMode(iconPath) === "gradient";
}

function svgUsesGradientIconCarrier(svg) {
  return remoteBrandSvgHasComplexPaint(svg);
}

function keepsBrandIconOriginalOnBrandTile(siteKey, iconPath = "") {
  return ORIGINAL_ARTWORK_BRAND_TILE_SITE_KEYS.has(siteKey)
    && String(iconPath || "").startsWith(`${SITE_ICON_DIRECTORY}/`)
    && siteIconSourceLooksLikeSvg(iconPath);
}

function siteIconSourceLooksLikeSvg(source) {
  const value = String(source || "");
  return value.endsWith(".svg") || isSvgDataUrl(value);
}

function isSvgDataUrl(source) {
  return /^data:image\/svg\+xml[,;]/i.test(String(source || ""));
}

function remoteBrandSvgSourceIsMaskable(source) {
  const descriptor = remoteBrandSvgDescriptorFromSource(source);
  if (descriptor) {
    return descriptor.renderMode === "mask";
  }
  const svg = decodeSvgDataUrl(source);
  if (!svg || !embeddedSvgBrandColor(source)) {
    return false;
  }
  const match = svg.match(/\sdata-wayleaf-monochrome=(["'])(true|false)\1/i);
  return match ? match[2] === "true" : remoteBrandSvgIsMonochrome(svg);
}

function genericIconTileColors(seed) {
  const hue = Math.abs(hashText(seed || "site")) % 360;
  return {
    light: `hsl(${hue} 42% 92%)`,
    dark: `hsl(${hue} 26% 24%)`
  };
}

function normalizeHexColor(tileColor) {
  const color = String(tileColor || "").trim();
  const match = color.match(/^#([0-9a-f]{6})$/i);
  if (!match) {
    return "";
  }
  return `#${match[1].toLowerCase()}`;
}

function applyIconTile(icon, tileMode, tileColors, hasLocalIcon) {
  icon.dataset.iconTile = tileMode;
  icon.style.setProperty("--site-icon-tile", tileColors.light);
  icon.style.setProperty("--site-icon-tile-light", tileColors.light);
  icon.style.setProperty("--site-icon-tile-dark", tileColors.dark);
  applyIconTileEdge(icon, tileColors);
  icon.classList.toggle("site-icon-local", Boolean(hasLocalIcon));
  applyIconTileToShell(icon, tileMode, tileColors);
}

function applyIconTileEdge(node, tileColors) {
  node.style.setProperty("--site-icon-edge-light", "var(--custom-site-icon-shadow)");
  node.style.setProperty(
    "--site-icon-edge-dark",
    blackishCarrierColor(tileColors.dark) ? "none" : "var(--custom-site-icon-shadow)"
  );
}

function applyIconTileToShell(icon, tileMode, tileColors) {
  const shell = icon.closest(".favorite-icon-shell");
  if (!shell) {
    return;
  }
  shell.dataset.iconTile = tileMode;
  shell.style.setProperty("--site-icon-tile", tileColors.light);
  shell.style.setProperty("--site-icon-tile-light", tileColors.light);
  shell.style.setProperty("--site-icon-tile-dark", tileColors.dark);
  applyIconTileEdge(shell, tileColors);
}

function iconSourceCanUseBitmapTileFusion(source) {
  return Boolean(source)
    && !siteIconSourceLooksLikeSvg(source)
    && !remoteBrandSvgDescriptorFromSource(source);
}

function displayIconSource(icon, source, options = {}) {
  if (icon.dataset.iconTile !== "brand" || !siteIconSourceLooksLikeSvg(source)) {
    return source;
  }
  if (icon.dataset.iconTile === "brand" && !shouldInvertBrandSvg(icon, source)) {
    return source;
  }
  const glyphColor = iconGlyphColorForCurrentTile(icon, source);
  if (!glyphColor) {
    return source;
  }
  if (options.awaitDisplayIcon) {
    return coloredSvgIconSource(source, glyphColor);
  }
  // Zero-delay: when the raw SVG text is already cached, recolor synchronously so the
  // caller sets the final (recolored) src in one tick — no raw-then-recolor swap, and no
  // visual change (same applySvgGlyphColor output as the async path).
  const syncText = isSvgDataUrl(source) ? "" : localSiteIconRawSvgText(source);
  if (syncText) {
    return svgTextDataUrl(applySvgGlyphColor(syncText, glyphColor));
  }
  const requestTheme = document.documentElement.dataset.theme;
  const requestToken = String(Number(icon.dataset.iconThemeRequest || 0) + 1);
  icon.dataset.iconThemeRequest = requestToken;
  coloredSvgIconSource(source, glyphColor).then((displaySource) => {
    const stillRenderingSource = icon.dataset.iconCandidate === source
      || icon.src.endsWith(source)
      || icon.getAttribute("src") === source;
    if (
      stillRenderingSource
      && icon.dataset.iconThemeRequest === requestToken
      && document.documentElement.dataset.theme === requestTheme
    ) {
      icon.src = displaySource;
    }
  });
  return source;
}

// Synchronous tile for a local SVG icon, used by the first-paint reconcile so the
// complete icon (tile + glyph) lands in one tick. Returns null when the analysis
// can't be warmed synchronously (no cached raw text) so callers fall back to async.
function syncLocalIconTile(site, iconPath) {
  const path = String(iconPath || "");
  if (!path.startsWith(`${SITE_ICON_DIRECTORY}/`) || !siteIconSourceLooksLikeSvg(path)) {
    return null;
  }
  if (!localSiteIconRenderModeCache.has(path)) {
    const text = localSiteIconRawSvgText(path);
    if (!text) {
      return null;
    }
    hydrateLocalSiteIconAnalysisFromText(path, text);
  }
  return computeSiteIconTile(site, path);
}

// Synchronous mirror of displayIconSource's decision, called AFTER the tile is applied
// (glyph color reads the just-applied tile var). Returns null when recolor would need a
// fetch (no cached raw text) so the caller can fall back to the async path.
function syncLocalIconFinalSrc(icon, iconPath) {
  const path = String(iconPath || "");
  if (icon.dataset.iconTile !== "brand" || !siteIconSourceLooksLikeSvg(path)) {
    return path;
  }
  if (!shouldInvertBrandSvg(icon, path)) {
    return path;
  }
  const glyphColor = iconGlyphColorForCurrentTile(icon, path);
  if (!glyphColor) {
    return path;
  }
  const text = localSiteIconRawSvgText(path);
  if (!text) {
    return null;
  }
  return svgTextDataUrl(applySvgGlyphColor(text, glyphColor));
}

function currentIconTileColor(icon) {
  if (document.documentElement.dataset.theme === "dark") {
    const darkColor = getComputedStyle(icon).getPropertyValue("--site-icon-tile-dark").trim()
      || icon.style.getPropertyValue("--site-icon-tile-dark").trim();
    if (darkColor) {
      return darkColor;
    }
  }
  const computedColor = getComputedStyle(icon).getPropertyValue("--site-icon-tile").trim();
  return computedColor || icon.style.getPropertyValue("--site-icon-tile").trim();
}

function shouldInvertBrandSvg(icon, source) {
  const siteKey = icon.dataset.siteKey || siteGroupKey(safeUrl(icon.dataset.siteUrl));
  if (keepsBrandIconOriginal(siteKey, source)) {
    return false;
  }
  if (localSiteIconSourceCanLoadBrandColor(source) && !localSiteIconRenderMode(source)) {
    return false;
  }
  const tileColor = siteIconBrandColor(siteKey, source);
  return Boolean(tileColor);
}

function iconGlyphColorForCurrentTile(icon, source = "") {
  const tileColor = normalizeHexColor(currentIconTileColor(icon));
  if (!tileColor) {
    return "";
  }
  const siteKey = icon.dataset.siteKey || siteGroupKey(safeUrl(icon.dataset.siteUrl));
  const brandColor = siteIconBrandColor(siteKey, source);
  if (isSvgDataUrl(source)) {
    return localBrandGlyphColorForTile(tileColor, brandColor);
  }
  if (brandColor) {
    return localBrandGlyphColorForTile(tileColor, brandColor);
  }
  if (iconTileShouldUseOriginalGlyph(tileColor)) {
    return "";
  }
  return readableIconGlyphColor(tileColor);
}

function localBrandGlyphColor(tileColor) {
  return normalizeHexColor(tileColor) ? "#ffffff" : "";
}

function localBrandGlyphColorForTile(tileColor, brandColor = "") {
  const tile = normalizeHexColor(tileColor);
  const brand = normalizeHexColor(brandColor);
  if (!tile) {
    return "";
  }
  if (!brand || tile === brand) {
    return localBrandGlyphColor(tile);
  }
  if (relativeLuminance(tile) < 0.5) {
    return "#ffffff";
  }
  if (contrastRatio(tile, brand) >= BRAND_ICON_VI_CONTRAST_MIN) {
    return brand;
  }
  for (let amount = 0.04; amount < 1; amount += 0.04) {
    const mixed = mixHexColors(brand, BRAND_ICON_LIGHT_MODE_DARK_CARRIER, amount);
    if (contrastRatio(tile, mixed) >= BRAND_ICON_VI_CONTRAST_MIN) {
      return mixed;
    }
  }
  return BRAND_ICON_LIGHT_MODE_DARK_CARRIER;
}

function hexColorStats(tileColor) {
  const color = normalizeHexColor(tileColor);
  if (!color) {
    return null;
  }
  const [red, green, blue] = hexToRgb(color).map((channel) => channel / 255);
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  let hue = 0;
  if (delta) {
    if (max === red) {
      hue = 60 * (((green - blue) / delta) % 6);
    } else if (max === green) {
      hue = 60 * ((blue - red) / delta + 2);
    } else {
      hue = 60 * ((red - green) / delta + 4);
    }
    if (hue < 0) {
      hue += 360;
    }
  }
  return {
    hue,
    luminance: relativeLuminance(color),
    lightContrast: contrastRatio(color, "#ffffff"),
    darkContrast: contrastRatio(color, "#102019")
  };
}

function iconTileShouldUseOriginalGlyph(tileColor) {
  const color = normalizeHexColor(tileColor);
  return !color || contrastRatio(color, "#102019") >= 8;
}

function readableIconGlyphColor(tileColor) {
  const color = normalizeHexColor(tileColor);
  if (!color) {
    return "";
  }
  const darkGlyph = "#102019";
  const lightGlyph = "#ffffff";
  const lightContrast = contrastRatio(color, lightGlyph);
  const darkContrast = contrastRatio(color, darkGlyph);
  return lightContrast >= 3 || lightContrast >= darkContrast ? lightGlyph : darkGlyph;
}

function nearWhiteBrandColor(tileColor) {
  const hex = normalizeHexColor(tileColor);
  if (!hex) {
    return false;
  }
  const red = parseInt(hex.slice(1, 3), 16);
  const green = parseInt(hex.slice(3, 5), 16);
  const blue = parseInt(hex.slice(5, 7), 16);
  const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722;
  const spread = Math.max(red, green, blue) - Math.min(red, green, blue);
  return luminance > 235 && spread < 28;
}

function refreshAdaptiveSiteIcons() {
  const requestTheme = document.documentElement.dataset.theme;
  document.querySelectorAll('img[data-icon-tile="brand"][data-site-url]').forEach((icon) => {
    const source = icon.dataset.iconSource || "";
    if (!source) {
      const site = {
        title: icon.dataset.siteTitle || icon.alt || "",
        url: icon.dataset.siteUrl || ""
      };
      applySiteIcon(icon, site);
      return;
    }
    const requestToken = String(Number(icon.dataset.iconThemeRequest || 0) + 1);
    icon.dataset.iconThemeRequest = requestToken;
    Promise.resolve(displayIconSource(icon, source, { awaitDisplayIcon: true })).then((nextSource) => {
      if (
        icon.isConnected
        && icon.dataset.iconSource === source
        && icon.dataset.iconThemeRequest === requestToken
        && document.documentElement.dataset.theme === requestTheme
      ) {
        icon.src = nextSource;
      }
    });
  });
}

function refreshRenderedSiteIcons() {
  document.querySelectorAll("img[data-site-url]").forEach((icon) => {
    const site = {
      title: icon.dataset.siteTitle || icon.alt || "",
      url: icon.dataset.siteUrl || ""
    };
    const localIcon = localIconForUrl(site.url);
    if (localIcon && siteIconRawSvgStalePaths.has(localIcon)) {
      scheduleIconIdleTask(() => revalidateDisplayedLocalSiteIcon(localIcon));
    }
    if (icon.dataset.iconCacheHydrated === "true") {
      if (!localIcon) {
        if (!remoteBrandSvgDescriptorFromSource(icon.dataset.iconSource || icon.currentSrc || icon.src || "")) {
          refreshRemoteBrandIcon(icon, site);
        }
        return;
      }
      const siteKey = icon.dataset.siteKey || siteGroupKey(safeUrl(site.url));
      icon.dataset.iconSource = localIcon;
      icon.dataset.iconCandidate = localIcon;
      // Fast path: recompute the full render (tile + glyph) synchronously from cached raw
      // SVG text and apply it atomically. Skip entirely when nothing changed (steady state).
      const syncTile = syncLocalIconTile(site, localIcon);
      if (syncTile) {
        const currentLight = icon.style.getPropertyValue("--site-icon-tile-light").trim();
        const currentDark = icon.style.getPropertyValue("--site-icon-tile-dark").trim();
        const tileUnchanged = icon.dataset.iconTile === syncTile.tileMode
          && currentLight === String(syncTile.tileColors.light)
          && currentDark === String(syncTile.tileColors.dark);
        if (!tileUnchanged) {
          icon.dataset.siteKey = syncTile.siteKey;
          applyIconTile(icon, syncTile.tileMode, syncTile.tileColors, syncTile.isLocalIconSource);
        }
        const nextSource = syncLocalIconFinalSrc(icon, localIcon);
        if (nextSource !== null) {
          if (tileUnchanged && icon.getAttribute("src") === nextSource) {
            return;
          }
          icon.src = nextSource;
          delete icon.dataset.iconCacheHydrated;
          cacheRenderedSiteIcon(icon, site);
          if (localIconNeedsRemoteBrandColor(siteKey, localIcon)) {
            refreshRemoteBrandIcon(icon, site);
          }
          return;
        }
      }
      // Fallback (raw text not cached yet): async render, which also warms the raw-text
      // cache so the next refresh is synchronous.
      loadLocalSiteIconBrandColor(localIcon).then(() => {
        if (
          !icon.isConnected
          || icon.dataset.iconSource !== localIcon
          || siteGroupKey(safeUrl(icon.dataset.siteUrl)) !== siteKey
        ) {
          return;
        }
        applySiteIconTile(icon, site, localIcon);
        const nextSource = displayIconSource(icon, localIcon, { awaitDisplayIcon: true });
        Promise.resolve(nextSource).then((source) => {
          if (!icon.isConnected || icon.dataset.iconSource !== localIcon) {
            return;
          }
          icon.src = source;
          delete icon.dataset.iconCacheHydrated;
          cacheRenderedSiteIcon(icon, site);
          if (localIconNeedsRemoteBrandColor(siteKey, localIcon)) {
            refreshRemoteBrandIcon(icon, site);
          }
        });
      });
      return;
    }
    if (localIcon) {
      delete icon.dataset.iconCacheHydrated;
    }
    applySiteIcon(icon, site);
  });
}

function coloredSvgIconSource(source, glyphColor) {
  const color = normalizeHexColor(glyphColor);
  if (!color) {
    return Promise.resolve(source);
  }
  const cacheKey = `${color}:${source}`;
  if (whiteSvgIconDataUrlCache.has(cacheKey)) {
    return whiteSvgIconDataUrlCache.get(cacheKey);
  }
  const cachedText = isSvgDataUrl(source) ? "" : localSiteIconRawSvgText(source);
  const request = isSvgDataUrl(source)
    ? Promise.resolve(svgTextDataUrl(applySvgGlyphColor(decodeSvgDataUrl(source), color)))
    : cachedText
      ? Promise.resolve(svgTextDataUrl(applySvgGlyphColor(cachedText, color)))
      : fetch(source)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Icon request failed: ${response.status}`);
          }
          return response.text();
        })
        .then((svg) => {
          rememberSiteIconRawSvgText(source, svg);
          return svgTextDataUrl(applySvgGlyphColor(svg, color));
        })
        .catch(() => source);
  whiteSvgIconDataUrlCache.set(cacheKey, request);
  return request;
}

function applySvgGlyphColor(svg, glyphColor, options = {}) {
  const color = normalizeHexColor(glyphColor);
  if (!color) {
    return String(svg || "");
  }
  let output = String(svg || "");
  const replaceColorAttribute = (attributeName, match, quote, value) => {
    if (/^(?:none|transparent)$/i.test(value) || (options.onlyCurrentColor && !/^currentColor$/i.test(value))) {
      return match;
    }
    return ` ${attributeName}=${quote}${color}${quote}`;
  };
  const replaceStyleColor = (match, quote, value) => {
    const nextValue = String(value).replace(/(^|;)(\s*)(fill|stroke|color)(\s*:\s*)([^;]+)/gi, (
      declaration,
      prefix,
      spacing,
      property,
      separator,
      rawValue
    ) => {
      const valueText = String(rawValue || "");
      const important = /\s!important\s*$/i.test(valueText) ? " !important" : "";
      const normalizedValue = valueText.replace(/\s!important\s*$/i, "").trim();
      if (
        /^(?:none|transparent)$/i.test(normalizedValue)
        || (options.onlyCurrentColor && !/^currentColor$/i.test(normalizedValue))
      ) {
        return declaration;
      }
      return `${prefix}${spacing}${property}${separator}${color}${important}`;
    });
    return ` style=${quote}${nextValue}${quote}`;
  };
  output = output.replace(/\sfill=(["'])([^"']*)\1/gi, (match, quote, value) => (
    replaceColorAttribute("fill", match, quote, value)
  ));
  output = output.replace(/\sstroke=(["'])([^"']*)\1/gi, (match, quote, value) => (
    replaceColorAttribute("stroke", match, quote, value)
  ));
  output = output.replace(/\scolor=(["'])([^"']*)\1/gi, (match, quote, value) => (
    replaceColorAttribute("color", match, quote, value)
  ));
  output = output.replace(/\sstyle=(["'])([^"']*)\1/gi, (match, quote, value) => (
    replaceStyleColor(match, quote, value)
  ));
  output = output.replace(/<svg\b([^>]*)>/i, (match, attrs) => (
    /\sfill=/i.test(attrs) ? `<svg${attrs}>` : `<svg${attrs} fill="${color}">`
  ));
  return output;
}

function bindFaviconFallback(icon, site, size) {
  const candidateToken = icon.dataset.iconCandidate || "";
  icon.addEventListener("error", () => {
    if (iconStillRenderingCandidate(icon, candidateToken)) {
      applyFaviconIcon(icon, site, size, { skipLocalIcon: true });
    }
  }, { once: true });
}

function applyFaviconIcon(icon, site, size, options = {}) {
  icon.removeAttribute("srcset");
  storeIconSiteContext(icon, site);
  const candidates = extensionIconFallbackChain(site.url, size, options);
  if (options.skipLocalIcon && !options.skipGeneratedFallback) {
    const siteKey = siteGroupKey(safeUrl(site.url));
    const tileColor = siteKey ? SITE_ICON_TILE_COLOR_BY_SITE_KEY[siteKey] || "" : "";
    if (tileColor) {
      applyGeneratedSiteIcon(icon, site);
      return;
    }
  }
  applyIconCandidate(icon, candidates, 0);
}

function extensionIconFallbackChain(url, size, options = {}) {
  const parsedUrl = safeUrl(url);
  const candidates = [];
  const localIcon = localIconForUrl(url);
  if (localIcon && !options.skipLocalIcon) {
    candidates.push(localIcon);
  }
  if (parsedUrl?.href) {
    candidates.push(faviconUrl(parsedUrl.href, size));
  }
  return candidates.filter(Boolean);
}

function applyIconCandidate(icon, candidates, index) {
  const nextIcon = candidates[index];
  if (!nextIcon) {
    applyGeneratedSiteIcon(icon, {
      title: icon.dataset.siteTitle || icon.alt || "",
      url: icon.dataset.siteUrl || ""
    });
    return;
  }
  icon.dataset.iconMissing = "false";
  icon.dataset.iconCandidate = nextIcon;
  delete icon.dataset.iconDefaultRescue;
  delete icon.dataset.iconDefaultProbe;
  icon.classList.remove("site-icon-generic-fallback");
  const isLocalIcon = nextIcon.startsWith("icons/");
  if (isLocalIcon) {
    icon.dataset.iconSource = nextIcon;
  } else {
    delete icon.dataset.iconSource;
  }
  if (isLocalIcon) {
    const site = {
      title: icon.dataset.siteTitle || icon.alt || "",
      url: icon.dataset.siteUrl || ""
    };
    applySiteIconTile(icon, site, nextIcon);
    hydrateLocalSiteIconBrandColor(icon, site, nextIcon);
  } else {
    const tileColors = genericIconTileColors(icon.dataset.siteUrl || icon.dataset.siteTitle || "");
    applyIconTile(icon, "plain", tileColors, false);
  }
  if (iconSourceCanUseBitmapTileFusion(nextIcon)) {
    icon.addEventListener("load", () => {
      if (iconStillRenderingCandidate(icon, nextIcon)) {
        applyFaviconMatchedTile(icon);
      }
    }, { once: true });
  }
  icon.src = displayIconSource(icon, nextIcon);
  icon.addEventListener("error", () => {
    if (iconStillRenderingCandidate(icon, nextIcon)) {
      applyIconCandidate(icon, candidates, index + 1);
    }
  }, { once: true });
}

function iconStillRenderingCandidate(icon, candidateToken) {
  return icon.isConnected && Boolean(candidateToken) && (icon.dataset.iconCandidate || "") === candidateToken;
}

function applyFaviconMatchedTile(icon, options = {}) {
  const candidateToken = icon.dataset.iconCandidate || "";
  if (!iconSourceCanUseBitmapTileFusion(candidateToken)
    || (icon.dataset.iconTile !== "plain" && icon.dataset.iconTile !== "brand")) {
    return;
  }
  const sampleOptions = {
    ...options,
    adaptiveFaviconCarrier: icon.dataset.iconTile === "plain" && !icon.classList.contains("site-icon-local")
  };
  const sample = sampleFaviconImageData(icon);
  if (!sample) {
    probeUnreadableFaviconCandidate(icon, sampleOptions);
    return;
  }
  applyFaviconSampleDecision(icon, sample, sampleOptions);
}

function applyFaviconSampleDecision(icon, sample, options = {}) {
  if (faviconSampleLooksLikeBrowserDefault(sample)) {
    if (options.trustSiteIcon) {
      const color = dominantFaviconSampleBackgroundColor(sample, options);
      const tileColors = color?.confidence ? faviconMatchedTileColors(color, options) : null;
      if (tileColors) {
        applySampledFaviconTile(icon, sample, color, tileColors, options);
        cacheRenderedSiteIconFromContext(icon);
      } else if (options.adaptiveFaviconCarrier) {
        applyGenericFallbackSiteIcon(icon);
      }
      return;
    }
    if (options.skipDefaultFaviconDiscovery) {
      applyGenericFallbackSiteIcon(icon);
    } else {
      rescueDefaultFaviconWithDeclaredIcon(icon);
    }
    return;
  }
  const color = dominantFaviconSampleBackgroundColor(sample, options);
  if (!color || !color.confidence) {
    return;
  }
  const tileColors = faviconMatchedTileColors(color, options);
  if (!tileColors) {
    if (options.adaptiveFaviconCarrier) {
      applyGenericFallbackSiteIcon(icon);
    }
    return;
  }
  applySampledFaviconTile(icon, sample, color, tileColors, options);
  cacheRenderedSiteIconFromContext(icon);
}

function applySampledFaviconTile(icon, sample, color, tileColors, options = {}) {
  const tileMode = icon.dataset.iconTile === "brand" ? "brand" : "plain";
  const hasLocalIcon = icon.classList.contains("site-icon-local");
  applyIconTile(icon, tileMode, tileColors, hasLocalIcon);
  fuseEmbeddedFaviconTile(icon, sample, color, tileColors, options);
}

function fuseEmbeddedFaviconTile(icon, sample, color, tileColors, options = {}) {
  const tileColor = document.documentElement.dataset.theme === "dark"
    ? tileColors.dark
    : tileColors.light;
  if (!faviconShouldFuseEmbeddedTile(color, tileColor, options)) {
    delete icon.dataset.iconFusedTile;
    return;
  }
  const fused = fusedEmbeddedFaviconPixelData(
    sample,
    tileColor,
    rgbChannelsToHex(color.red, color.green, color.blue),
    faviconFusionDistances(color, options)
  );
  if (!fused) {
    delete icon.dataset.iconFusedTile;
    return;
  }
  const canvas = document.createElement("canvas");
  canvas.width = fused.size;
  canvas.height = fused.size;
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }
  context.putImageData(new ImageData(fused.data, fused.size, fused.size), 0, 0);
  icon.dataset.iconFusedTile = "true";
  icon.src = canvas.toDataURL("image/png");
}

function probeUnreadableFaviconCandidate(icon, options = {}) {
  if (options.trustSiteIcon || !faviconCandidateIsChromeFavicon(icon.dataset.iconCandidate || icon.currentSrc || icon.src)) {
    return;
  }
  if (icon.dataset.iconDefaultProbe === "pending") {
    return;
  }
  const candidateToken = icon.dataset.iconCandidate || icon.currentSrc || icon.src || "";
  icon.dataset.iconDefaultProbe = "pending";
  sampleFaviconImageDataFromUrl(icon.currentSrc || icon.src || candidateToken).then((sample) => {
    if (!iconStillRenderingCandidate(icon, candidateToken)) {
      return;
    }
    icon.dataset.iconDefaultProbe = sample ? "sampled" : "unreadable";
    if (sample) {
      applyFaviconSampleDecision(icon, sample, options);
      return;
    }
    if (options.skipDefaultFaviconDiscovery) {
      applyGenericFallbackSiteIcon(icon);
      return;
    }
    rescueDefaultFaviconWithDeclaredIcon(icon);
  }).catch(() => {
    if (!iconStillRenderingCandidate(icon, candidateToken)) {
      return;
    }
    icon.dataset.iconDefaultProbe = "failed";
    if (options.skipDefaultFaviconDiscovery) {
      applyGenericFallbackSiteIcon(icon);
      return;
    }
    rescueDefaultFaviconWithDeclaredIcon(icon);
  });
}

function faviconCandidateIsChromeFavicon(value) {
  const text = String(value || "");
  return text.includes("/_favicon/") || text.includes("_favicon/?");
}

function rescueDefaultFaviconWithDeclaredIcon(icon) {
  const siteUrl = icon.dataset.siteUrl || "";
  const parsedUrl = safeUrl(siteUrl);
  if (!parsedUrl) {
    applyGenericFallbackSiteIcon(icon);
    return;
  }
  const candidateToken = icon.dataset.iconCandidate || icon.currentSrc || icon.src || "";
  if (icon.dataset.iconDefaultRescue === "pending") {
    return;
  }
  icon.dataset.iconDefaultRescue = "pending";
  const timeoutId = window.setTimeout(() => {
    if (!iconStillRenderingCandidate(icon, candidateToken)) {
      return;
    }
    applyGenericFallbackSiteIcon(icon, parsedUrl.hostname);
    icon.dataset.iconDefaultRescue = "timed-out";
    icon.dataset.iconDefaultRescueCandidate = candidateToken;
  }, SITE_ICON_DEFAULT_RESCUE_TIMEOUT_MS);
  discoverSiteIconCandidateEntries(parsedUrl.href).then((candidates) => {
    window.clearTimeout(timeoutId);
    if (!iconRescueCanStillApply(icon, candidateToken)) {
      return;
    }
    const usableCandidates = candidates.filter((candidate) => candidate?.url && candidate.url !== candidateToken);
    if (!usableCandidates.length) {
      applyGenericFallbackSiteIcon(icon, parsedUrl.hostname);
      return;
    }
    applyDiscoveredSiteFaviconCandidates(icon, usableCandidates, parsedUrl.hostname, candidateToken);
  }).catch(() => {
    window.clearTimeout(timeoutId);
    if (!iconRescueCanStillApply(icon, candidateToken)) {
      return;
    }
    applyGenericFallbackSiteIcon(icon, parsedUrl.hostname);
  });
}

function applyDiscoveredSiteFaviconCandidates(icon, candidates = [], seed = "", rescueCandidateToken = "") {
  const [candidate, ...remainingCandidates] = candidates.filter((entry) => entry?.url);
  const candidateUrl = candidate?.url || "";
  if (!candidateUrl) {
    applyGenericFallbackSiteIcon(icon, seed);
    return;
  }
  fetchImageDataUrl(candidateUrl).then((iconDataUrl) => {
    if (!iconRescueCanStillApply(icon, rescueCandidateToken)) {
      return;
    }
    if (!iconDataUrl || iconDataUrl === rescueCandidateToken) {
      applyDiscoveredSiteFaviconCandidates(icon, remainingCandidates, seed, rescueCandidateToken);
      return;
    }
    applyDiscoveredSiteFavicon(icon, iconDataUrl, seed, {
      candidateSource: candidate.source || "url",
      fallbackCandidates: remainingCandidates,
      rescueCandidateToken
    });
  }).catch(() => {
    if (iconRescueCanStillApply(icon, rescueCandidateToken)) {
      applyDiscoveredSiteFaviconCandidates(icon, remainingCandidates, seed, rescueCandidateToken);
    }
  });
}

function iconRescueCanStillApply(icon, candidateToken) {
  if (iconStillRenderingCandidate(icon, candidateToken)) {
    return true;
  }
  return icon.isConnected
    && (icon.dataset.iconCandidate || "") === GENERIC_SITE_FALLBACK_ICON
    && (icon.dataset.iconDefaultRescueCandidate || "") === candidateToken;
}

function applyDiscoveredSiteFavicon(icon, iconDataUrl, seed = "", options = {}) {
  icon.removeAttribute("srcset");
  icon.dataset.iconMissing = "false";
  icon.dataset.iconCandidate = iconDataUrl;
  icon.dataset.iconSource = iconDataUrl;
  icon.dataset.iconDefaultRescue = "resolved";
  delete icon.dataset.iconDefaultRescueCandidate;
  delete icon.dataset.iconDefaultProbe;
  icon.classList.remove("site-icon-generic-fallback");
  applyIconTile(icon, "plain", genericIconTileColors(seed), false);
  icon.addEventListener("load", () => {
    if (iconStillRenderingCandidate(icon, iconDataUrl)) {
      if (faviconElementLooksLikeBrowserDefault(icon) && !trustedDeclaredSiteIconSource(options.candidateSource)) {
        applyDiscoveredSiteFaviconCandidates(
          icon,
          options.fallbackCandidates,
          seed,
          options.rescueCandidateToken
        );
        return;
      }
      applyFaviconMatchedTile(icon, {
        skipDefaultFaviconDiscovery: true,
        trustSiteIcon: trustedDeclaredSiteIconSource(options.candidateSource)
      });
      cacheRenderedDiscoveredSiteIcon(icon, iconDataUrl);
    }
  }, { once: true });
  icon.addEventListener("error", () => {
    if (iconStillRenderingCandidate(icon, iconDataUrl)) {
      applyDiscoveredSiteFaviconCandidates(
        icon,
        options.fallbackCandidates,
        seed,
        options.rescueCandidateToken
      );
    }
  }, { once: true });
  icon.src = iconDataUrl;
}

function trustedDeclaredSiteIconSource(source) {
  return source === "document" || source === "manifest";
}

function faviconElementLooksLikeBrowserDefault(icon) {
  const sample = sampleFaviconImageData(icon);
  return Boolean(sample && faviconSampleLooksLikeBrowserDefault(sample));
}

function faviconSampleLooksLikeBrowserDefault(sample) {
  return faviconImageDataLooksLikeBrowserDefault(sample.data, sample.size)
    || faviconImageDataLooksLikeEmbeddedBrowserDefault(sample.data, sample.size)
    || faviconImageDataLooksLikeNeutralBrowserFallbackGlyph(sample.data, sample.size);
}

function cacheRenderedDiscoveredSiteIcon(icon, iconDataUrl) {
  const siteKey = icon.dataset.siteKey || siteGroupKey(safeUrl(icon.dataset.siteUrl));
  if (siteKey && normalizeStoredSiteIcon(iconDataUrl)) {
    cacheSiteIcon(siteKey, iconDataUrl).catch(() => {});
  }
}

function dominantFaviconSampleBackgroundColor(sample, options = {}) {
  return selectFaviconBackgroundCandidate(analyzeFaviconImageColors(sample.data, sample.size), sample.size, options);
}

function sampleFaviconImageData(image) {
  if (!image.naturalWidth || !image.naturalHeight) {
    return null;
  }
  const canvas = document.createElement("canvas");
  const size = FAVICON_BACKGROUND_SAMPLE_SIZE;
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    return null;
  }
  try {
    context.drawImage(image, 0, 0, size, size);
    const { data } = context.getImageData(0, 0, size, size);
    return { data, size };
  } catch {
    return null;
  }
}

async function sampleFaviconImageDataFromUrl(url) {
  const text = String(url || "");
  if (!text) {
    return null;
  }
  const response = await fetch(text, { cache: "force-cache" });
  if (!response.ok) {
    return null;
  }
  const blob = await response.blob();
  if (!blob || (blob.type && !String(blob.type).startsWith("image/"))) {
    return null;
  }
  const bitmap = await createImageBitmap(blob);
  try {
    const canvas = document.createElement("canvas");
    const size = FAVICON_BACKGROUND_SAMPLE_SIZE;
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {
      return null;
    }
    context.drawImage(bitmap, 0, 0, size, size);
    const { data } = context.getImageData(0, 0, size, size);
    return { data, size };
  } finally {
    bitmap.close?.();
  }
}

function faviconImageDataLooksLikeBrowserDefault(data, size) {
  let opaqueWeight = 0;
  let neutralWeight = 0;
  let colorWeight = 0;
  let edgeWeight = 0;
  let edgeSampleWeight = 0;
  let red = 0;
  let green = 0;
  let blue = 0;
  let minX = size;
  let minY = size;
  let maxX = -1;
  let maxY = -1;
  for (let index = 0; index < data.length; index += 4) {
    const pixelIndex = index / 4;
    const x = pixelIndex % size;
    const y = Math.floor(pixelIndex / size);
    const edgeSample = iconDefaultFaviconEdgeSampleWeight(x, y, size);
    edgeSampleWeight += edgeSample;
    const alpha = data[index + 3] / 255;
    if (alpha < FAVICON_BACKGROUND_ALPHA_MIN) {
      continue;
    }
    const pixelRed = data[index];
    const pixelGreen = data[index + 1];
    const pixelBlue = data[index + 2];
    const weight = alpha;
    const spread = colorChannelSpread(pixelRed, pixelGreen, pixelBlue);
    const saturation = spread / Math.max(1, pixelRed, pixelGreen, pixelBlue);
    opaqueWeight += weight;
    edgeWeight += edgeSample * weight;
    red += pixelRed * weight;
    green += pixelGreen * weight;
    blue += pixelBlue * weight;
    if (spread <= 28 || saturation <= 0.16) {
      neutralWeight += weight;
    }
    if (saturation >= 0.24 && spread >= 42) {
      colorWeight += weight;
    }
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  if (!opaqueWeight || maxX < minX || maxY < minY) {
    return false;
  }
  const coverage = opaqueWeight / (size * size);
  if (coverage < DEFAULT_FAVICON_MIN_COVERAGE || coverage > DEFAULT_FAVICON_MAX_COVERAGE) {
    return false;
  }
  const averageRed = red / opaqueWeight;
  const averageGreen = green / opaqueWeight;
  const averageBlue = blue / opaqueWeight;
  const luminance = averageRed * 0.2126 + averageGreen * 0.7152 + averageBlue * 0.0722;
  if (luminance < DEFAULT_FAVICON_MIN_LUMINANCE || luminance > DEFAULT_FAVICON_MAX_LUMINANCE) {
    return false;
  }
  const neutralRatio = neutralWeight / opaqueWeight;
  const colorRatio = colorWeight / opaqueWeight;
  if (neutralRatio < DEFAULT_FAVICON_MIN_NEUTRAL_RATIO || colorRatio > DEFAULT_FAVICON_MAX_COLOR_RATIO) {
    return false;
  }
  const bounds = { minX, minY, maxX, maxY };
  const width = maxX - minX + 1;
  const height = maxY - minY + 1;
  const minSpan = Math.min(width / size, height / size);
  const maxSpan = Math.max(width / size, height / size);
  if (minSpan < 0.42 || maxSpan > 0.9 || !faviconCandidateSpansCenter(bounds, size)) {
    return false;
  }
  const edgeOpacity = edgeWeight / Math.max(1, edgeSampleWeight);
  return edgeOpacity <= DEFAULT_FAVICON_MAX_EDGE_OPACITY;
}

function faviconImageDataLooksLikeEmbeddedBrowserDefault(data, size) {
  let opaqueWeight = 0;
  let coloredWeight = 0;
  let neutralWeight = 0;
  let edgeWeight = 0;
  let edgeSampleWeight = 0;
  let red = 0;
  let green = 0;
  let blue = 0;
  let minX = size;
  let minY = size;
  let maxX = -1;
  let maxY = -1;
  for (let index = 0; index < data.length; index += 4) {
    const pixelIndex = index / 4;
    const x = pixelIndex % size;
    const y = Math.floor(pixelIndex / size);
    const edgeSample = iconDefaultFaviconEdgeSampleWeight(x, y, size);
    edgeSampleWeight += edgeSample;
    const alpha = data[index + 3] / 255;
    if (alpha < FAVICON_BACKGROUND_ALPHA_MIN) {
      continue;
    }
    const pixelRed = data[index];
    const pixelGreen = data[index + 1];
    const pixelBlue = data[index + 2];
    const weight = alpha;
    const saturation = colorSaturation(pixelRed, pixelGreen, pixelBlue);
    const luminance = colorLuminance(pixelRed, pixelGreen, pixelBlue);
    opaqueWeight += weight;
    if (saturation >= 0.22 && colorChannelSpread(pixelRed, pixelGreen, pixelBlue) >= 36) {
      coloredWeight += weight;
    }
    if (
      saturation <= 0.18
      && luminance >= DEFAULT_FAVICON_MIN_LUMINANCE
      && luminance <= DEFAULT_FAVICON_MAX_LUMINANCE
    ) {
      neutralWeight += weight;
      edgeWeight += edgeSample * weight;
      red += pixelRed * weight;
      green += pixelGreen * weight;
      blue += pixelBlue * weight;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  if (!opaqueWeight || !neutralWeight || maxX < minX || maxY < minY) {
    return false;
  }
  const opaqueCoverage = opaqueWeight / (size * size);
  const neutralCoverage = neutralWeight / (size * size);
  if (
    opaqueCoverage < 0.58
    || neutralCoverage < DEFAULT_FAVICON_EMBEDDED_MIN_COVERAGE
    || neutralCoverage > DEFAULT_FAVICON_EMBEDDED_MAX_COVERAGE
  ) {
    return false;
  }
  if (coloredWeight / opaqueWeight < 0.18) {
    return false;
  }
  const averageRed = red / neutralWeight;
  const averageGreen = green / neutralWeight;
  const averageBlue = blue / neutralWeight;
  const averageSaturation = colorSaturation(averageRed, averageGreen, averageBlue);
  if (averageSaturation > 0.14) {
    return false;
  }
  const bounds = { minX, minY, maxX, maxY };
  const width = maxX - minX + 1;
  const height = maxY - minY + 1;
  const minSpan = Math.min(width / size, height / size);
  const maxSpan = Math.max(width / size, height / size);
  if (minSpan < 0.42 || maxSpan > 0.9 || !faviconCandidateSpansCenter(bounds, size)) {
    return false;
  }
  const edgeOpacity = edgeWeight / Math.max(1, edgeSampleWeight);
  return edgeOpacity <= DEFAULT_FAVICON_EMBEDDED_MAX_EDGE_OPACITY;
}

function faviconImageDataLooksLikeNeutralBrowserFallbackGlyph(data, size) {
  let opaqueWeight = 0;
  let neutralWeight = 0;
  let colorWeight = 0;
  let edgeWeight = 0;
  let edgeSampleWeight = 0;
  let red = 0;
  let green = 0;
  let blue = 0;
  let minX = size;
  let minY = size;
  let maxX = -1;
  let maxY = -1;
  for (let index = 0; index < data.length; index += 4) {
    const pixelIndex = index / 4;
    const x = pixelIndex % size;
    const y = Math.floor(pixelIndex / size);
    const edgeSample = iconDefaultFaviconEdgeSampleWeight(x, y, size);
    edgeSampleWeight += edgeSample;
    const alpha = data[index + 3] / 255;
    if (alpha < FAVICON_BACKGROUND_ALPHA_MIN) {
      continue;
    }
    const pixelRed = data[index];
    const pixelGreen = data[index + 1];
    const pixelBlue = data[index + 2];
    const weight = alpha;
    const spread = colorChannelSpread(pixelRed, pixelGreen, pixelBlue);
    const saturation = colorSaturation(pixelRed, pixelGreen, pixelBlue);
    const luminance = colorLuminance(pixelRed, pixelGreen, pixelBlue);
    opaqueWeight += weight;
    edgeWeight += edgeSample * weight;
    red += pixelRed * weight;
    green += pixelGreen * weight;
    blue += pixelBlue * weight;
    if (spread <= 34 || saturation <= 0.2) {
      neutralWeight += weight;
    }
    if (saturation >= 0.24 && spread >= 42) {
      colorWeight += weight;
    }
    if (luminance >= 24 && luminance <= 210) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  if (!opaqueWeight || maxX < minX || maxY < minY) {
    return false;
  }
  const coverage = opaqueWeight / (size * size);
  if (
    coverage < DEFAULT_FAVICON_NEUTRAL_GLYPH_MIN_COVERAGE
    || coverage > DEFAULT_FAVICON_NEUTRAL_GLYPH_MAX_COVERAGE
  ) {
    return false;
  }
  const averageRed = red / opaqueWeight;
  const averageGreen = green / opaqueWeight;
  const averageBlue = blue / opaqueWeight;
  const luminance = colorLuminance(averageRed, averageGreen, averageBlue);
  if (luminance < DEFAULT_FAVICON_MIN_LUMINANCE || luminance > DEFAULT_FAVICON_MAX_LUMINANCE) {
    return false;
  }
  const neutralRatio = neutralWeight / opaqueWeight;
  const colorRatio = colorWeight / opaqueWeight;
  if (
    neutralRatio < DEFAULT_FAVICON_NEUTRAL_GLYPH_MIN_NEUTRAL_RATIO
    || colorRatio > DEFAULT_FAVICON_NEUTRAL_GLYPH_MAX_COLOR_RATIO
  ) {
    return false;
  }
  const bounds = { minX, minY, maxX, maxY };
  const width = maxX - minX + 1;
  const height = maxY - minY + 1;
  const minSpan = Math.min(width / size, height / size);
  const maxSpan = Math.max(width / size, height / size);
  if (minSpan < 0.34 || maxSpan > 0.92 || !faviconCandidateSpansCenter(bounds, size)) {
    return false;
  }
  const edgeOpacity = edgeWeight / Math.max(1, edgeSampleWeight);
  return edgeOpacity <= DEFAULT_FAVICON_NEUTRAL_GLYPH_MAX_EDGE_OPACITY;
}

function iconDefaultFaviconEdgeSampleWeight(x, y, size) {
  const edgeDistance = Math.min(x, y, size - 1 - x, size - 1 - y);
  return edgeDistance <= 2 ? 1 : 0;
}

function colorChannelSpread(red, green, blue) {
  return Math.max(red, green, blue) - Math.min(red, green, blue);
}

function colorSaturation(red, green, blue) {
  return colorChannelSpread(red, green, blue) / Math.max(1, red, green, blue);
}

function colorLuminance(red, green, blue) {
  return red * 0.2126 + green * 0.7152 + blue * 0.0722;
}

function analyzeFaviconImageColors(data, size) {
  const pixels = [];
  const buckets = new Map();
  let edgeSampleWeight = 0;
  let opaqueWeight = 0;
  for (let index = 0; index < data.length; index += 4) {
    const pixelIndex = index / 4;
    const x = pixelIndex % size;
    const y = Math.floor(pixelIndex / size);
    const edgeWeight = iconBackgroundSampleWeight(x, y, size);
    edgeSampleWeight += edgeWeight;
    const alpha = data[index + 3] / 255;
    if (alpha < FAVICON_BACKGROUND_ALPHA_MIN) {
      continue;
    }
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    opaqueWeight += alpha;
    const pixel = {
      x,
      y,
      red,
      green,
      blue,
      weight: alpha,
      edgeWeight: alpha * edgeWeight
    };
    pixels.push(pixel);
    const bucketKey = faviconColorBucketKey(red, green, blue);
    const bucket = buckets.get(bucketKey) || {
      red: 0,
      green: 0,
      blue: 0,
      weight: 0
    };
    bucket.red += red * alpha;
    bucket.green += green * alpha;
    bucket.blue += blue * alpha;
    bucket.weight += alpha;
    buckets.set(bucketKey, bucket);
  }
  return {
    pixels,
    buckets,
    totalWeight: size * size,
    opaqueWeight,
    edgeSampleWeight
  };
}

function selectFaviconBackgroundCandidate(analysis, size, options = {}) {
  if (!analysis.pixels.length || !analysis.buckets.size) {
    return null;
  }
  const unframedGlyph = Boolean(
    options.adaptiveFaviconCarrier && faviconAnalysisLooksLikeUnframedGlyph(analysis, size)
  );
  const baseBuckets = [...analysis.buckets.values()]
    .filter((bucket) => bucket.weight)
    .map(faviconAverageColorBucket)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 14);
  const candidates = baseBuckets
    .map((bucket) => faviconBackgroundCandidateFromBucket(bucket, analysis, size))
    .filter(Boolean)
    .map((candidate) => ({
      ...candidate,
      unframedGlyph,
      compactEmblem: Boolean(
        options.adaptiveFaviconCarrier && faviconCandidateLooksLikeCompactEmblem(candidate, analysis, size)
      )
    }))
    .sort((a, b) => b.score - a.score || b.confidence - a.confidence);
  const candidate = (options.adaptiveFaviconCarrier ? faviconPreferredSelfContainedTileCandidate(candidates, analysis, size) : null)
    || ((candidates[0]?.confidence || 0) >= FAVICON_BACKGROUND_CONFIDENCE_MIN
    ? candidates[0]
    : faviconTransparentGlyphCandidateFromBucket(baseBuckets[0], analysis, size)
      || (options.adaptiveFaviconCarrier ? faviconTransparentGlyphCandidateFromAnalysis(analysis, size) : null));
  if (!candidate?.confidence) {
    return null;
  }
  const matchMode = candidate.compactEmblem
    ? "full-surface"
    : candidate.preferredSelfContainedTile ? "embedded-tile" : faviconBackgroundMatchMode(candidate);
  const selectedColor = matchMode === "embedded-tile"
    ? {
      red: Math.round(candidate.red),
      green: Math.round(candidate.green),
      blue: Math.round(candidate.blue)
    }
    : {
      red: Math.round(candidate.carrierRed ?? candidate.red),
      green: Math.round(candidate.carrierGreen ?? candidate.green),
      blue: Math.round(candidate.carrierBlue ?? candidate.blue)
    };
  const selected = {
    ...selectedColor,
    paletteRed: Math.round(candidate.red),
    paletteGreen: Math.round(candidate.green),
    paletteBlue: Math.round(candidate.blue),
    confidence: candidate.confidence,
    coverage: candidate.coverage,
    opaqueCoverage: analysis.opaqueWeight / analysis.totalWeight,
    edgeConfidence: candidate.edgeConfidence,
    innerTileConfidence: candidate.innerTileConfidence,
    ownTileShapeConfidence: candidate.ownTileShapeConfidence,
    ownTileCornerStyle: candidate.ownTileCornerStyle,
    unframedGlyph: Boolean(candidate.unframedGlyph),
    compactEmblem: Boolean(candidate.compactEmblem),
    preferredSelfContainedTile: Boolean(candidate.preferredSelfContainedTile),
    matchMode,
    foreground: faviconForegroundStatsForCandidate(selectedColor, analysis, size),
    paperSurface: faviconPaperSurfaceStats(analysis, size)
  };
  return selected;
}

function faviconPreferredSelfContainedTileCandidate(candidates, analysis, size) {
  const analysisTileShape = faviconAnalysisOwnTileShape(analysis, size);
  const opaqueCoverage = analysis.opaqueWeight / Math.max(1, analysis.totalWeight);
  const candidate = candidates.map((item) => {
    const candidateOpaqueRatio = (item.coverage || 0)
      / Math.max(0.001, opaqueCoverage);
    const tileShape = opaqueCoverage >= 0.42
      && analysisTileShape.confidence >= 0.42
      && candidateOpaqueRatio >= 0.28
      ? analysisTileShape
      : {
        confidence: item.ownTileShapeConfidence || 0,
        cornerStyle: item.ownTileCornerStyle || ""
      };
    return {
      ...item,
      ownTileShapeConfidence: tileShape.confidence,
      ownTileCornerStyle: tileShape.cornerStyle
    };
  }).find((item) => {
    const tileColor = rgbChannelsToHex(item.red, item.green, item.blue);
    const foreground = faviconForegroundStatsForCandidate({
      red: Math.round(item.red),
      green: Math.round(item.green),
      blue: Math.round(item.blue)
    }, analysis, size);
    return (item.ownTileShapeConfidence || 0) >= 0.42
      && !item.compactEmblem
      && !faviconCarrierLooksNeutralPaperLike(tileColor)
      && (!faviconAnalysisHasDominantPaperInset(analysis, size)
        || (item.edgeConfidence || 0) <= FAVICON_EMBEDDED_TILE_EDGE_CONFIDENCE_MAX)
      && (foreground.coverage || 0) >= FAVICON_LOW_CONTRAST_FOREGROUND_COVERAGE_MIN
      && (foreground.span || 0) >= 0.18
      && (foreground.maxContrast || 0) > FAVICON_LOW_CONTRAST_PEAK_MAX
      && !faviconCandidateLooksLikeSameHueFullSurfaceArtwork(item, foreground, tileColor, analysis, size);
  });
  return candidate
    ? {
      ...candidate,
      preferredSelfContainedTile: true,
      confidence: Math.max(candidate.confidence, FAVICON_BACKGROUND_CONFIDENCE_MIN)
    }
    : null;
}

function faviconAnalysisOwnTileShape(analysis, size) {
  if (!analysis?.pixels?.length) {
    return { confidence: 0, cornerStyle: "" };
  }
  const bounds = analysis.pixels.reduce((result, pixel) => ({
    minX: Math.min(result.minX, pixel.x),
    minY: Math.min(result.minY, pixel.y),
    maxX: Math.max(result.maxX, pixel.x),
    maxY: Math.max(result.maxY, pixel.y)
  }), { minX: size, minY: size, maxX: -1, maxY: -1 });
  return faviconOwnTileShapeSupport(
    analysis.pixels,
    bounds,
    size,
    analysis.opaqueWeight / Math.max(1, analysis.totalWeight)
  );
}

function faviconAnalysisLooksLikeUnframedGlyph(analysis, size) {
  const opaqueCoverage = analysis.opaqueWeight / Math.max(1, analysis.totalWeight);
  const bounds = analysis.pixels.reduce((result, pixel) => ({
    minX: Math.min(result.minX, pixel.x),
    minY: Math.min(result.minY, pixel.y),
    maxX: Math.max(result.maxX, pixel.x),
    maxY: Math.max(result.maxY, pixel.y)
  }), { minX: size, minY: size, maxX: -1, maxY: -1 });
  const width = Math.max(0, bounds.maxX - bounds.minX + 1);
  const height = Math.max(0, bounds.maxY - bounds.minY + 1);
  const density = analysis.opaqueWeight / Math.max(1, width * height);
  return opaqueCoverage >= FAVICON_TRANSPARENT_GLYPH_COVERAGE_MIN
    && opaqueCoverage <= FAVICON_TRANSPARENT_GLYPH_COVERAGE_MAX
    && (density < 0.78 || faviconAnalysisOwnTileShape(analysis, size).confidence < 0.42);
}

function faviconCandidateLooksLikeCompactEmblem(candidate, analysis, size) {
  const bounds = analysis.pixels.reduce((result, pixel) => ({
    minX: Math.min(result.minX, pixel.x),
    minY: Math.min(result.minY, pixel.y),
    maxX: Math.max(result.maxX, pixel.x),
    maxY: Math.max(result.maxY, pixel.y)
  }), { minX: size, minY: size, maxX: -1, maxY: -1 });
  if (bounds.maxX < bounds.minX || bounds.maxY < bounds.minY) {
    return false;
  }
  const width = bounds.maxX - bounds.minX + 1;
  const height = bounds.maxY - bounds.minY + 1;
  const minSpan = Math.min(width, height) / size;
  const aspectRatio = Math.min(width, height) / Math.max(width, height);
  const density = analysis.opaqueWeight / Math.max(1, width * height);
  const cornerStyle = candidate.ownTileCornerStyle || faviconAnalysisOwnTileShape(analysis, size).cornerStyle;
  if (cornerStyle !== "rounded" && cornerStyle !== "circle") {
    return false;
  }
  const emblemGeometry = minSpan >= 0.62
    && aspectRatio >= 0.85
    && density >= 0.5
    && density <= 0.86;
  if (cornerStyle === "circle") {
    // A saturated disc is its own colored tile and should fuse with a matching carrier;
    // only a neutral/low-saturation disc reads as a paper emblem needing a generated carrier.
    return emblemGeometry
      && colorSaturation(candidate.red, candidate.green, candidate.blue) <= 0.22;
  }
  return emblemGeometry;
}

function faviconCandidateLooksLikeSameHueFullSurfaceArtwork(candidate, foreground, tileColor, analysis, size) {
  const [red, green, blue] = hexToRgb(tileColor);
  return blue >= red + 24
    && (blue >= green || green >= red + 20)
    && candidate.ownTileCornerStyle === "straight"
    && ((analysis?.opaqueWeight || 0) / Math.max(1, analysis?.totalWeight || 1)) >= 0.82
    && (faviconPaperSurfaceStats(analysis, size).coverage || 0) < 0.08
    && faviconPaletteLooksLikeBlueGradientArtwork([
      tileColor,
      ...(foreground.colors || []),
      ...faviconAnalysisPaletteColors(analysis)
    ]);
}

function faviconAnalysisPaletteColors(analysis) {
  return [...(analysis?.buckets?.values?.() || [])]
    .filter((bucket) => bucket.weight)
    .map(faviconAverageColorBucket)
    .sort((first, second) => second.weight - first.weight)
    .slice(0, 8)
    .map((bucket) => rgbChannelsToHex(bucket.red, bucket.green, bucket.blue));
}

function faviconAnalysisHasDominantPaperInset(analysis, size) {
  const surface = faviconPaperSurfaceStats(analysis, size);
  if (
    (surface.coverage || 0) < 0.28
    || (surface.span || 0) < 0.5
    || !surface.spansCenter
  ) {
    return false;
  }
  const coreMin = Math.floor(size * 0.25);
  const coreMax = Math.ceil(size * 0.75) - 1;
  let paperWeight = 0;
  let totalWeight = 0;
  for (const pixel of analysis.pixels) {
    if (pixel.x < coreMin || pixel.x > coreMax || pixel.y < coreMin || pixel.y > coreMax) {
      continue;
    }
    totalWeight += pixel.weight;
    if (faviconCarrierLooksNeutralPaperLike(rgbChannelsToHex(pixel.red, pixel.green, pixel.blue))) {
      paperWeight += pixel.weight;
    }
  }
  return totalWeight > 0
    && paperWeight / totalWeight >= 0.52
    && (surface.coverage || 0) >= 0.28
    && (surface.span || 0) >= 0.5
    && surface.spansCenter;
}

function faviconTransparentGlyphCandidateFromBucket(bucket, analysis, size) {
  if (!bucket?.weight || !analysis.opaqueWeight || !analysis.totalWeight) {
    return null;
  }
  const colorDistanceLimit = FAVICON_BACKGROUND_COLOR_DISTANCE ** 2;
  let red = 0;
  let green = 0;
  let blue = 0;
  let weight = 0;
  let edgeWeight = 0;
  for (const pixel of analysis.pixels) {
    if (colorDistanceSquared(pixel, bucket) > colorDistanceLimit) {
      continue;
    }
    red += pixel.red * pixel.weight;
    green += pixel.green * pixel.weight;
    blue += pixel.blue * pixel.weight;
    weight += pixel.weight;
    edgeWeight += pixel.edgeWeight;
  }
  if (!weight) {
    return null;
  }
  const opaqueCoverage = analysis.opaqueWeight / analysis.totalWeight;
  const coverage = weight / analysis.totalWeight;
  const edgeConfidence = edgeWeight / Math.max(1, analysis.edgeSampleWeight);
  const unframedGlyph = faviconAnalysisLooksLikeUnframedGlyph(analysis, size);
  if (
    opaqueCoverage < FAVICON_TRANSPARENT_GLYPH_COVERAGE_MIN
    || opaqueCoverage > FAVICON_TRANSPARENT_GLYPH_COVERAGE_MAX
    || coverage / opaqueCoverage < FAVICON_TRANSPARENT_GLYPH_CANDIDATE_RATIO_MIN
    || (edgeConfidence > FAVICON_TRANSPARENT_GLYPH_EDGE_CONFIDENCE_MAX && !unframedGlyph)
  ) {
    return null;
  }
  return {
    red: red / weight,
    green: green / weight,
    blue: blue / weight,
    confidence: FAVICON_BACKGROUND_CONFIDENCE_MIN,
    coverage,
    edgeConfidence,
    innerTileConfidence: 0,
    unframedGlyph,
    score: FAVICON_BACKGROUND_CONFIDENCE_MIN
  };
}

function faviconTransparentGlyphCandidateFromAnalysis(analysis, size) {
  const opaqueCoverage = analysis.opaqueWeight / analysis.totalWeight;
  const edgeConfidence = analysis.pixels.reduce((sum, pixel) => sum + pixel.edgeWeight, 0)
    / Math.max(1, analysis.edgeSampleWeight);
  const unframedGlyph = faviconAnalysisLooksLikeUnframedGlyph(analysis, size);
  if (
    opaqueCoverage < FAVICON_TRANSPARENT_GLYPH_COVERAGE_MIN
    || opaqueCoverage > FAVICON_TRANSPARENT_GLYPH_COVERAGE_MAX
    || (edgeConfidence > FAVICON_TRANSPARENT_GLYPH_EDGE_CONFIDENCE_MAX && !unframedGlyph)
  ) {
    return null;
  }
  const totals = analysis.pixels.reduce((result, pixel) => {
    result.red += pixel.red * pixel.weight;
    result.green += pixel.green * pixel.weight;
    result.blue += pixel.blue * pixel.weight;
    return result;
  }, { red: 0, green: 0, blue: 0 });
  return {
    red: totals.red / analysis.opaqueWeight,
    green: totals.green / analysis.opaqueWeight,
    blue: totals.blue / analysis.opaqueWeight,
    confidence: FAVICON_BACKGROUND_CONFIDENCE_MIN,
    coverage: opaqueCoverage,
    edgeConfidence,
    innerTileConfidence: 0,
    unframedGlyph,
    score: FAVICON_BACKGROUND_CONFIDENCE_MIN
  };
}

function faviconForegroundStatsForCandidate(candidate, analysis, size) {
  const colorDistanceLimit = FAVICON_FOREGROUND_COLOR_DISTANCE ** 2;
  const background = {
    red: candidate.red,
    green: candidate.green,
    blue: candidate.blue
  };
  const backgroundHex = rgbChannelsToHex(candidate.red, candidate.green, candidate.blue);
  let weight = 0;
  let contrastWeight = 0;
  let maxContrast = 0;
  let red = 0;
  let green = 0;
  let blue = 0;
  const colorBuckets = new Map();
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -1;
  let maxY = -1;
  for (const pixel of analysis.pixels) {
    if (colorDistanceSquared(pixel, background) <= colorDistanceLimit) {
      continue;
    }
    const contrast = contrastRatio(backgroundHex, rgbChannelsToHex(pixel.red, pixel.green, pixel.blue));
    weight += pixel.weight;
    contrastWeight += contrast * pixel.weight;
    maxContrast = Math.max(maxContrast, contrast);
    red += pixel.red * pixel.weight;
    green += pixel.green * pixel.weight;
    blue += pixel.blue * pixel.weight;
    const bucketKey = faviconColorBucketKey(pixel.red, pixel.green, pixel.blue);
    const bucket = colorBuckets.get(bucketKey) || { red: 0, green: 0, blue: 0, weight: 0 };
    bucket.red += pixel.red * pixel.weight;
    bucket.green += pixel.green * pixel.weight;
    bucket.blue += pixel.blue * pixel.weight;
    bucket.weight += pixel.weight;
    colorBuckets.set(bucketKey, bucket);
    minX = Math.min(minX, pixel.x);
    minY = Math.min(minY, pixel.y);
    maxX = Math.max(maxX, pixel.x);
    maxY = Math.max(maxY, pixel.y);
  }
  if (!weight || maxX < minX || maxY < minY) {
    return {
      coverage: 0,
      averageContrast: 0,
      maxContrast: 0,
      red: 0,
      green: 0,
      blue: 0,
      colors: [],
      spansCenter: false,
      span: 0
    };
  }
  const bounds = { minX, minY, maxX, maxY };
  const colors = [...colorBuckets.values()]
    .map(faviconAverageColorBucket)
    .sort((first, second) => second.weight - first.weight)
    .slice(0, 6)
    .map((bucket) => rgbChannelsToHex(bucket.red, bucket.green, bucket.blue));
  return {
    coverage: weight / Math.max(1, analysis.totalWeight),
    averageContrast: contrastWeight / weight,
    maxContrast,
    red: red / weight,
    green: green / weight,
    blue: blue / weight,
    colors,
    spansCenter: faviconCandidateSpansCenter(bounds, size),
    span: Math.max(maxX - minX + 1, maxY - minY + 1) / size
  };
}

function faviconPaperSurfaceStats(analysis, size) {
  let paperWeight = 0;
  let artworkWeight = 0;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -1;
  let maxY = -1;
  for (const pixel of analysis.pixels) {
    const color = rgbChannelsToHex(pixel.red, pixel.green, pixel.blue);
    if (faviconCarrierLooksNeutralPaperLike(color)) {
      paperWeight += pixel.weight;
      minX = Math.min(minX, pixel.x);
      minY = Math.min(minY, pixel.y);
      maxX = Math.max(maxX, pixel.x);
      maxY = Math.max(maxY, pixel.y);
    } else if (contrastRatio(color, "#ffffff") >= 1.28) {
      artworkWeight += pixel.weight;
    }
  }
  if (!paperWeight || maxX < minX || maxY < minY) {
    return { coverage: 0, artworkCoverage: 0, spansCenter: false, span: 0 };
  }
  const bounds = { minX, minY, maxX, maxY };
  return {
    coverage: paperWeight / Math.max(1, analysis.totalWeight),
    artworkCoverage: artworkWeight / Math.max(1, analysis.totalWeight),
    spansCenter: faviconCandidateSpansCenter(bounds, size),
    span: Math.max(maxX - minX + 1, maxY - minY + 1) / size
  };
}

function faviconCandidateHasLowContrastForeground(color) {
  const foreground = color.foreground || {};
  return (foreground.coverage || 0) >= FAVICON_LOW_CONTRAST_FOREGROUND_COVERAGE_MIN
    && (foreground.averageContrast || 0) <= FAVICON_LOW_CONTRAST_AVERAGE_MAX
    && (foreground.maxContrast || 0) <= FAVICON_LOW_CONTRAST_PEAK_MAX;
}

function faviconCandidateHasUnreadableForeground(color, tileColor) {
  return faviconCandidateHasVisibleForeground(color)
    && contrastRatio(tileColor, faviconForegroundRepresentativeColor(color, tileColor)) < FAVICON_READABLE_CARRIER_CONTRAST_MIN;
}

function faviconCandidateHasVisibleForeground(color) {
  const foreground = color.foreground || {};
  return (foreground.coverage || 0) >= FAVICON_LOW_CONTRAST_FOREGROUND_COVERAGE_MIN
    && foreground.spansCenter
    && (foreground.span || 0) >= 0.18;
}

function faviconCandidateHasRecoverableForeground(color) {
  const foreground = color.foreground || {};
  return (foreground.coverage || 0) >= FAVICON_LOW_CONTRAST_FOREGROUND_COVERAGE_MIN
    && (foreground.span || 0) >= 0.14;
}

function faviconCandidateLooksLikeTransparentGlyph(color, tileColor) {
  const background = normalizeHexColor(tileColor);
  if (!background) {
    return false;
  }
  if (faviconCandidateHasEmbeddedForeground(color)) {
    return false;
  }
  const opaqueCoverage = color.opaqueCoverage || 0;
  if (
    opaqueCoverage <= 0
    || opaqueCoverage > FAVICON_TRANSPARENT_GLYPH_COVERAGE_MAX
    || (color.coverage || 0) / opaqueCoverage < FAVICON_TRANSPARENT_GLYPH_CANDIDATE_RATIO_MIN
    || ((color.edgeConfidence || 0) > FAVICON_TRANSPARENT_GLYPH_EDGE_CONFIDENCE_MAX && !color.unframedGlyph)
  ) {
    return false;
  }
  return true;
}

function faviconCandidateHasEmbeddedForeground(color) {
  if (color.matchMode !== "embedded-tile") {
    return false;
  }
  const foreground = color.foreground || {};
  return (foreground.coverage || 0) >= FAVICON_LOW_CONTRAST_FOREGROUND_COVERAGE_MIN
    && (foreground.maxContrast || 0) > FAVICON_LOW_CONTRAST_PEAK_MAX;
}

function faviconCandidateLooksLikeNearWhiteGlyph(color, tileColor) {
  const background = normalizeHexColor(tileColor);
  if (!background || relativeLuminance(background) < FAVICON_NEAR_WHITE_GLYPH_LUMINANCE_MIN) {
    return false;
  }
  const foreground = color.foreground || {};
  return (foreground.coverage || 0) <= FAVICON_NEAR_WHITE_GLYPH_FOREGROUND_COVERAGE_MAX
    || faviconCandidateHasLowContrastForeground(color);
}

function faviconCandidateNeedsReadableCarrier(color, tileColor, options = {}) {
  if (
    options.adaptiveFaviconCarrier
    && color?.preferredSelfContainedTile
  ) {
    return false;
  }
  const nearWhiteGlyph = faviconCandidateLooksLikeNearWhiteGlyph(color, tileColor);
  return (options.adaptiveFaviconCarrier
      && faviconCandidateHasRecoverableForeground(color)
      && (faviconCandidateHasLowContrastForeground(color) || faviconCandidateHasUnreadableForeground(color, tileColor)))
    || faviconCandidateLooksLikeTransparentGlyph(color, tileColor)
    || (nearWhiteGlyph
      && (!options.adaptiveFaviconCarrier || !faviconCandidateHasPaperSurfaceArtwork(color)));
}

function faviconShouldFuseEmbeddedTile(color, tileColor, options = {}) {
  if (!normalizeHexColor(tileColor)) {
    return false;
  }
  if (color?.compactEmblem) {
    return false;
  }
  if (color?.matchMode === "embedded-tile") {
    return Boolean(faviconCandidateHasEmbeddedForeground(color)
      || (options.adaptiveFaviconCarrier
        && faviconCandidateHasRecoverableForeground(color)
        && faviconCandidateHasLowContrastForeground(color)));
  }
  if (options.adaptiveFaviconCarrier && color?.matchMode === "full-surface") {
    return normalizeHexColor(tileColor) === rgbChannelsToHex(color.red, color.green, color.blue)
      && faviconCandidateHasVisibleForeground(color)
      && !faviconCandidateHasUnreadableForeground(color, tileColor);
  }
  return false;
}

function faviconFusionDistances(color, options = {}) {
  return options.adaptiveFaviconCarrier && faviconCandidateHasLowContrastForeground(color)
    ? { clear: FAVICON_FOREGROUND_COLOR_DISTANCE, feather: 4 }
    : { clear: FAVICON_EMBEDDED_TILE_FUSION_CLEAR_DISTANCE, feather: FAVICON_EMBEDDED_TILE_FUSION_FEATHER_DISTANCE };
}

function fusedEmbeddedFaviconPixelData(sample, tileColor, embeddedTileColor = "", distances = {}) {
  const clearColor = normalizeHexColor(embeddedTileColor) || normalizeHexColor(tileColor);
  if (!sample?.data || !sample.size || !clearColor) {
    return null;
  }
  const [tileRed, tileGreen, tileBlue] = hexToRgb(clearColor);
  const clearLimit = distances.clear ?? FAVICON_EMBEDDED_TILE_FUSION_CLEAR_DISTANCE;
  const featherLimit = clearLimit + (distances.feather ?? FAVICON_EMBEDDED_TILE_FUSION_FEATHER_DISTANCE);
  const clearLimitSquared = clearLimit ** 2;
  const featherLimitSquared = featherLimit ** 2;
  const output = new Uint8ClampedArray(sample.data);
  let adjusted = 0;
  for (let index = 0; index < output.length; index += 4) {
    const alpha = output[index + 3];
    if (!alpha) {
      continue;
    }
    const distanceSquared = (output[index] - tileRed) ** 2
      + (output[index + 1] - tileGreen) ** 2
      + (output[index + 2] - tileBlue) ** 2;
    if (distanceSquared <= clearLimitSquared) {
      output[index + 3] = 0;
      adjusted += 1;
      continue;
    }
    if (distanceSquared <= featherLimitSquared) {
      const distance = Math.sqrt(distanceSquared);
      const opacity = Math.max(0, Math.min(1, (distance - clearLimit) / Math.max(1, featherLimit - clearLimit)));
      const nextAlpha = Math.round(alpha * opacity);
      if (nextAlpha < alpha) {
        output[index + 3] = nextAlpha;
        adjusted += 1;
      }
    }
  }
  return adjusted ? { data: output, size: sample.size } : null;
}

function faviconBackgroundCandidateFromBucket(bucket, analysis, size) {
  const colorDistanceLimit = FAVICON_BACKGROUND_COLOR_DISTANCE ** 2;
  const samples = [];
  let red = 0;
  let green = 0;
  let blue = 0;
  let weight = 0;
  let edgeWeight = 0;
  let carrierEdgeWeight = 0;
  let edgeRed = 0;
  let edgeGreen = 0;
  let edgeBlue = 0;
  let minX = size;
  let minY = size;
  let maxX = -1;
  let maxY = -1;
  for (const pixel of analysis.pixels) {
    if (colorDistanceSquared(pixel, bucket) > colorDistanceLimit) {
      continue;
    }
    samples.push(pixel);
    red += pixel.red * pixel.weight;
    green += pixel.green * pixel.weight;
    blue += pixel.blue * pixel.weight;
    weight += pixel.weight;
    edgeWeight += pixel.edgeWeight;
    if (pixel.edgeWeight > 0.35) {
      carrierEdgeWeight += pixel.edgeWeight;
      edgeRed += pixel.red * pixel.edgeWeight;
      edgeGreen += pixel.green * pixel.edgeWeight;
      edgeBlue += pixel.blue * pixel.edgeWeight;
    }
    minX = Math.min(minX, pixel.x);
    minY = Math.min(minY, pixel.y);
    maxX = Math.max(maxX, pixel.x);
    maxY = Math.max(maxY, pixel.y);
  }
  if (!weight || maxX < minX || maxY < minY) {
    return null;
  }
  const bounds = { minX, minY, maxX, maxY };
  const coverage = weight / analysis.totalWeight;
  const edgeConfidence = edgeWeight / analysis.edgeSampleWeight;
  const innerTileConfidence = faviconInnerTileConfidence(samples, bounds, size, coverage);
  const ownTileShape = faviconOwnTileShapeSupport(samples, bounds, size, coverage);
  const confidence = Math.min(1, Math.max(edgeConfidence, innerTileConfidence));
  if (!confidence) {
    return null;
  }
  const edgeCarrierColor = edgeConfidence >= FAVICON_EDGE_CARRIER_CONFIDENCE_MIN && carrierEdgeWeight > 0
    ? {
      carrierRed: edgeRed / carrierEdgeWeight,
      carrierGreen: edgeGreen / carrierEdgeWeight,
      carrierBlue: edgeBlue / carrierEdgeWeight
    }
    : {};
  return {
    red: red / weight,
    green: green / weight,
    blue: blue / weight,
    ...edgeCarrierColor,
    confidence,
    coverage,
    edgeConfidence,
    innerTileConfidence,
    ownTileShapeConfidence: ownTileShape.confidence,
    ownTileCornerStyle: ownTileShape.cornerStyle,
    score: confidence + coverage * 0.18 + Math.min(0.12, edgeConfidence * 0.2)
  };
}

function faviconBackgroundMatchMode(candidate) {
  const innerTileConfidence = candidate.innerTileConfidence || 0;
  const edgeConfidence = candidate.edgeConfidence || 0;
  if (
    innerTileConfidence >= FAVICON_EMBEDDED_TILE_INNER_CONFIDENCE_MIN
    && edgeConfidence <= FAVICON_EMBEDDED_TILE_EDGE_CONFIDENCE_MAX
    && innerTileConfidence >= edgeConfidence * 1.25
  ) {
    return "embedded-tile";
  }
  return "full-surface";
}

function faviconInnerTileConfidence(samples, bounds, size, coverage) {
  const width = bounds.maxX - bounds.minX + 1;
  const height = bounds.maxY - bounds.minY + 1;
  const span = Math.min(width / size, height / size);
  if (coverage < 0.14 || span < 0.38 || !faviconCandidateSpansCenter(bounds, size)) {
    return 0;
  }
  const density = samples.reduce((sum, sample) => sum + sample.weight, 0) / (width * height);
  if (density < 0.42) {
    return 0;
  }
  const sideSupport = faviconCandidateSideSupport(samples, bounds);
  if (sideSupport.supportedSides < 3 && sideSupport.average < 0.34) {
    return 0;
  }
  const gridSupport = faviconCandidateGridSupport(samples, bounds);
  if (gridSupport.supportedCells < 10 || gridSupport.average < 0.28) {
    return 0;
  }
  const surfaceSupport = faviconCandidateSurfaceSupport(samples, bounds);
  if (surfaceSupport.rowRatio < 0.52 || surfaceSupport.columnRatio < 0.52) {
    return 0;
  }
  return Math.min(
    1,
    coverage * 1.1
      + density * 0.14
      + sideSupport.average * 0.14
      + gridSupport.average * 0.22
      + surfaceSupport.average * 0.28
  );
}

function faviconOwnTileShapeSupport(samples, bounds, size, coverage) {
  const width = bounds.maxX - bounds.minX + 1;
  const height = bounds.maxY - bounds.minY + 1;
  const minSpan = Math.min(width / size, height / size);
  const maxSpan = Math.max(width / size, height / size);
  if (coverage < 0.14 || minSpan < 0.38 || maxSpan > 1.01 || !faviconCandidateSpansCenter(bounds, size)) {
    return { confidence: 0, cornerStyle: "" };
  }
  const density = samples.reduce((sum, sample) => sum + sample.weight, 0) / Math.max(1, width * height);
  if (density < 0.42) {
    return { confidence: 0, cornerStyle: "" };
  }
  const cornerSupport = faviconCandidateCornerSupport(samples, bounds);
  const sideSupport = faviconCandidateSideSupport(samples, bounds);
  const surfaceSupport = faviconCandidateSurfaceSupport(samples, bounds);
  const aspectRatio = Math.min(width, height) / Math.max(width, height);
  const straightCornerConfidence = cornerSupport.extremeMinimum >= 0.5
    && cornerSupport.pointMinimum >= 0.5
    && cornerSupport.pointSpread <= 0.5
    ? Math.max(cornerSupport.pointAverage, cornerSupport.average * 0.72)
    : 0;
  const roundedCornerConfidence = cornerSupport.extremeMaximum <= 0.15
    && sideSupport.supportedSides === 4
    && surfaceSupport.rowRatio >= 0.5
    && surfaceSupport.columnRatio >= 0.5
    ? Math.max(1 - cornerSupport.extremeMaximum, 1 - cornerSupport.pointAverage, 1 - cornerSupport.average)
    : 0;
  // A full-bleed disc fills only ~pi/4 of its bounding box, so its density sits well
  // below a square/rounded-rect tile (~0.9+) while it still reaches all four edges at
  // the mid-arcs and leaves the corner bands empty. Recognising it as its own circular
  // tile keeps a circular favicon on the fusion path instead of being mistaken for a
  // padded compact emblem (which forces an opaque neutral carrier).
  const circleCornerConfidence = cornerSupport.extremeMaximum <= 0.15
    && cornerSupport.maximum <= 0.42
    && sideSupport.supportedSides === 4
    && surfaceSupport.rowRatio >= 0.45
    && surfaceSupport.columnRatio >= 0.45
    && aspectRatio >= 0.82
    && minSpan >= 0.6
    && density >= 0.45
    && density <= 0.88
    ? Math.max(1 - cornerSupport.maximum, 1 - cornerSupport.average)
    : 0;
  // The circle gate is a positive disc test (empty corners + round fill density + near
  // full-bleed), so when it fires it is authoritative: a disc also satisfies the rounded
  // gate because its corners are empty too, and rounded's score saturates at 1, so we must
  // not let it outrank the circle classification.
  const confidence = circleCornerConfidence > 0
    ? circleCornerConfidence
    : Math.max(straightCornerConfidence, roundedCornerConfidence);
  if (confidence < 0.42) {
    return { confidence: 0, cornerStyle: "" };
  }
  const cornerStyle = circleCornerConfidence > 0
    ? "circle"
    : roundedCornerConfidence > straightCornerConfidence ? "rounded" : "straight";
  return {
    confidence: Math.min(1, confidence * 0.72 + density * 0.16 + sideSupport.average * 0.12),
    cornerStyle
  };
}

function faviconCandidateSpansCenter(bounds, size) {
  const centerMin = Math.floor(size * 0.38);
  const centerMax = Math.ceil(size * 0.62);
  return bounds.minX <= centerMin
    && bounds.maxX >= centerMax
    && bounds.minY <= centerMin
    && bounds.maxY >= centerMax;
}

function faviconCandidateSideSupport(samples, bounds) {
  const bandSize = 2;
  const width = bounds.maxX - bounds.minX + 1;
  const height = bounds.maxY - bounds.minY + 1;
  const sideWeights = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
  for (const sample of samples) {
    if (sample.y <= bounds.minY + bandSize - 1) {
      sideWeights.top += sample.weight;
    }
    if (sample.y >= bounds.maxY - bandSize + 1) {
      sideWeights.bottom += sample.weight;
    }
    if (sample.x <= bounds.minX + bandSize - 1) {
      sideWeights.left += sample.weight;
    }
    if (sample.x >= bounds.maxX - bandSize + 1) {
      sideWeights.right += sample.weight;
    }
  }
  const top = Math.min(1, sideWeights.top / Math.max(1, width * bandSize));
  const bottom = Math.min(1, sideWeights.bottom / Math.max(1, width * bandSize));
  const left = Math.min(1, sideWeights.left / Math.max(1, height * bandSize));
  const right = Math.min(1, sideWeights.right / Math.max(1, height * bandSize));
  const values = [top, right, bottom, left];
  return {
    average: values.reduce((sum, value) => sum + value, 0) / values.length,
    supportedSides: values.filter((value) => value >= 0.24).length
  };
}

function faviconCandidateCornerSupport(samples, bounds) {
  const width = bounds.maxX - bounds.minX + 1;
  const height = bounds.maxY - bounds.minY + 1;
  const bandSize = Math.max(2, Math.round(Math.min(width, height) * 0.16));
  const cornerWeights = {
    topLeft: 0,
    topRight: 0,
    bottomRight: 0,
    bottomLeft: 0
  };
  for (const sample of samples) {
    const left = sample.x <= bounds.minX + bandSize - 1;
    const right = sample.x >= bounds.maxX - bandSize + 1;
    const top = sample.y <= bounds.minY + bandSize - 1;
    const bottom = sample.y >= bounds.maxY - bandSize + 1;
    if (top && left) {
      cornerWeights.topLeft += sample.weight;
    }
    if (top && right) {
      cornerWeights.topRight += sample.weight;
    }
    if (bottom && right) {
      cornerWeights.bottomRight += sample.weight;
    }
    if (bottom && left) {
      cornerWeights.bottomLeft += sample.weight;
    }
  }
  const cornerArea = bandSize * bandSize;
  const values = Object.values(cornerWeights).map((weight) => Math.min(1, weight / Math.max(1, cornerArea)));
  const pointBandSize = 2;
  const pointArea = pointBandSize * pointBandSize;
  const pointWeights = {
    topLeft: 0,
    topRight: 0,
    bottomRight: 0,
    bottomLeft: 0
  };
  const extremeWeights = {
    topLeft: 0,
    topRight: 0,
    bottomRight: 0,
    bottomLeft: 0
  };
  for (const sample of samples) {
    const left = sample.x <= bounds.minX + pointBandSize - 1;
    const right = sample.x >= bounds.maxX - pointBandSize + 1;
    const top = sample.y <= bounds.minY + pointBandSize - 1;
    const bottom = sample.y >= bounds.maxY - pointBandSize + 1;
    if (top && left) {
      pointWeights.topLeft += sample.weight;
    }
    if (top && right) {
      pointWeights.topRight += sample.weight;
    }
    if (bottom && right) {
      pointWeights.bottomRight += sample.weight;
    }
    if (bottom && left) {
      pointWeights.bottomLeft += sample.weight;
    }
    if (sample.x === bounds.minX && sample.y === bounds.minY) {
      extremeWeights.topLeft += sample.weight;
    }
    if (sample.x === bounds.maxX && sample.y === bounds.minY) {
      extremeWeights.topRight += sample.weight;
    }
    if (sample.x === bounds.maxX && sample.y === bounds.maxY) {
      extremeWeights.bottomRight += sample.weight;
    }
    if (sample.x === bounds.minX && sample.y === bounds.maxY) {
      extremeWeights.bottomLeft += sample.weight;
    }
  }
  const pointValues = Object.values(pointWeights).map((weight) => Math.min(1, weight / Math.max(1, pointArea)));
  const extremeValues = Object.values(extremeWeights).map((weight) => Math.min(1, weight));
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const pointMinimum = Math.min(...pointValues);
  const pointMaximum = Math.max(...pointValues);
  return {
    average: values.reduce((sum, value) => sum + value, 0) / values.length,
    minimum,
    maximum,
    spread: maximum - minimum,
    pointAverage: pointValues.reduce((sum, value) => sum + value, 0) / pointValues.length,
    pointMinimum,
    pointMaximum,
    pointSpread: pointMaximum - pointMinimum,
    extremeMinimum: Math.min(...extremeValues),
    extremeMaximum: Math.max(...extremeValues)
  };
}

function faviconCandidateGridSupport(samples, bounds) {
  const gridSize = 4;
  const width = bounds.maxX - bounds.minX + 1;
  const height = bounds.maxY - bounds.minY + 1;
  const cells = Array.from({ length: gridSize * gridSize }, () => 0);
  for (const sample of samples) {
    const column = Math.min(gridSize - 1, Math.floor(((sample.x - bounds.minX) / width) * gridSize));
    const row = Math.min(gridSize - 1, Math.floor(((sample.y - bounds.minY) / height) * gridSize));
    cells[row * gridSize + column] += sample.weight;
  }
  const cellArea = width * height / cells.length;
  const normalizedCells = cells.map((weight) => Math.min(1, weight / Math.max(1, cellArea)));
  return {
    average: normalizedCells.reduce((sum, value) => sum + value, 0) / normalizedCells.length,
    supportedCells: normalizedCells.filter((value) => value >= 0.18).length
  };
}

function faviconCandidateSurfaceSupport(samples, bounds) {
  const width = bounds.maxX - bounds.minX + 1;
  const height = bounds.maxY - bounds.minY + 1;
  const rowWeights = Array.from({ length: height }, () => 0);
  const columnWeights = Array.from({ length: width }, () => 0);
  for (const sample of samples) {
    rowWeights[sample.y - bounds.minY] += sample.weight;
    columnWeights[sample.x - bounds.minX] += sample.weight;
  }
  const rowFill = rowWeights.map((weight) => Math.min(1, weight / width));
  const columnFill = columnWeights.map((weight) => Math.min(1, weight / height));
  const rowRatio = rowFill.filter((fill) => fill >= 0.58).length / Math.max(1, rowFill.length);
  const columnRatio = columnFill.filter((fill) => fill >= 0.58).length / Math.max(1, columnFill.length);
  return {
    average: (rowRatio + columnRatio) / 2,
    rowRatio,
    columnRatio
  };
}

function iconBackgroundSampleWeight(x, y, size) {
  const edgeDistance = Math.min(x, y, size - 1 - x, size - 1 - y);
  if (edgeDistance <= 1) {
    return 3;
  }
  if (edgeDistance <= 3) {
    return 2;
  }
  if (edgeDistance <= 5) {
    return 1;
  }
  return 0.35;
}

function faviconColorBucketKey(red, green, blue) {
  return [
    Math.round(red / 16),
    Math.round(green / 16),
    Math.round(blue / 16)
  ].join(":");
}

function faviconAverageColorBucket(bucket) {
  return {
    red: bucket.red / bucket.weight,
    green: bucket.green / bucket.weight,
    blue: bucket.blue / bucket.weight,
    weight: bucket.weight
  };
}

function colorDistanceSquared(first, second) {
  return (first.red - second.red) ** 2
    + (first.green - second.green) ** 2
    + (first.blue - second.blue) ** 2;
}

function faviconMatchedTileColors(color, options = {}) {
  if (!faviconColorShouldUseOriginalTile(color, options)) {
    return null;
  }
  const tileColor = rgbChannelsToHex(color.red, color.green, color.blue);
  if (options.adaptiveFaviconCarrier && faviconCandidateLooksLikePaperTileArtwork(color, tileColor)) {
    return {
      light: "#ffffff",
      dark: "#ffffff"
    };
  }
  if (color.matchMode === "embedded-tile") {
    return faviconSeparatedTileColors(tileColor, color, options);
  }
  return faviconSurfaceTileColors(tileColor, color, options);
}

function faviconSurfaceTileColors(tileColor, color, options = {}) {
  const preferReadableCarrier = faviconCandidateNeedsReadableCarrier(color, tileColor, options);
  const foregroundColors = faviconForegroundPaletteColors(color, tileColor);
  if (
    options.adaptiveFaviconCarrier
    && faviconCandidateLooksLikeTransparentGlyph(color, tileColor)
    && faviconPaletteHasDistinctHueFamilies(foregroundColors)
  ) {
    return {
      light: "#ffffff",
      dark: "#ffffff"
    };
  }
  if (
    options.adaptiveFaviconCarrier
    && color.matchMode === "full-surface"
    && faviconFullSurfaceHasPaperOutlineArtwork(color, tileColor, foregroundColors)
  ) {
    return {
      light: "#ffffff",
      dark: "#ffffff"
    };
  }
  if (
    options.adaptiveFaviconCarrier
    && color.matchMode === "full-surface"
    && faviconFullSurfaceHasLowContrastMonochromeArtwork(color, tileColor)
  ) {
    return {
      light: "#ffffff",
      dark: "#ffffff"
    };
  }
  if (
    options.adaptiveFaviconCarrier
    && color.matchMode === "full-surface"
    && !faviconCandidateLooksLikeTransparentGlyph(color, tileColor)
    && faviconFullSurfacePrefersPaperCarrier(tileColor, foregroundColors)
  ) {
    return {
      light: "#ffffff",
      dark: "#ffffff"
    };
  }
  const carrier = faviconCarrierTileColor(tileColor, "dark", {
    preferReadableCarrier,
    foregroundColors,
    neutralReadableCarrier: options.adaptiveFaviconCarrier
  });
  return {
    light: carrier,
    dark: carrier
  };
}

function faviconSeparatedTileColors(tileColor, color, options = {}) {
  const preferReadableCarrier = faviconCandidateNeedsReadableCarrier(color, tileColor, options);
  const foregroundColors = faviconForegroundPaletteColors(color, tileColor);
  const carrier = faviconCarrierTileColor(tileColor, "dark", {
    preferReadableCarrier,
    foregroundColors,
    neutralReadableCarrier: options.adaptiveFaviconCarrier,
    separate: preferReadableCarrier
  });
  return {
    light: carrier,
    dark: carrier
  };
}

function faviconCarrierTileColor(tileColor, mode, options = {}) {
  const color = normalizeHexColor(tileColor);
  if (!color) {
    return tileColor;
  }
  if (options.preferReadableCarrier) {
    return options.neutralReadableCarrier
      ? faviconReadableNeutralCarrierTileColor(options.foregroundColors || [color])
      : faviconReadableCarrierTileColor(color, mode);
  }
  if (!options.separate) {
    return color;
  }
  const luminance = relativeLuminance(color);
  const target = luminance < (mode === "dark" ? 0.48 : 0.58) ? "#ffffff" : "#000000";
  const initialAmount = mode === "dark" ? 0.18 : 0.24;
  return mixColorUntilContrast(color, target, FAVICON_EMBEDDED_TILE_CONTRAST_MIN, initialAmount);
}

function faviconForegroundRepresentativeColor(color, fallbackColor) {
  const foreground = color.foreground || {};
  if (faviconCandidateHasVisibleForeground(color)) {
    return rgbChannelsToHex(foreground.red, foreground.green, foreground.blue);
  }
  return fallbackColor;
}

function faviconForegroundPaletteColors(color, fallbackColor) {
  if (color.compactEmblem) {
    return [fallbackColor];
  }
  const foregroundColors = (color.foreground?.colors || []).map(normalizeHexColor).filter(Boolean);
  if (faviconCandidateLooksLikeTransparentGlyph(color, fallbackColor)) {
    return [...new Set([fallbackColor, ...foregroundColors])];
  }
  return foregroundColors.length ? foregroundColors : [faviconForegroundRepresentativeColor(color, fallbackColor)];
}

function faviconCandidateLooksLikeTransparentPaperArtwork(color, tileColor) {
  return faviconCandidateLooksLikePaperTileArtwork(color, tileColor);
}

function faviconCandidateLooksLikePaperTileArtwork(color, tileColor) {
  const paperColor = normalizeHexColor(tileColor);
  if (color?.preferredSelfContainedTile && !faviconCarrierLooksNeutralPaperLike(paperColor)) {
    return false;
  }
  const foreground = color.foreground || {};
  const accents = (foreground.colors || []).map(normalizeHexColor).filter(Boolean);
  const transparentGlyph = faviconCandidateLooksLikeTransparentGlyph(color, tileColor);
  const ownNonPaperTile = faviconCandidateHasOwnTileShape(color) && !faviconCarrierLooksPaperLike(paperColor);
  const hasPaperSurface = faviconCarrierLooksPaperLike(paperColor)
    || (!ownNonPaperTile && faviconCandidateHasPaperSurfaceArtwork(color));
  const hasReadableArtwork = accents.some((accent) => (
    !faviconCarrierLooksPaperLike(accent) && contrastRatio(accent, "#ffffff") >= 1.28
  )) || ((foreground.maxContrast || 0) >= 1.28 && (foreground.span || 0) >= 0.18);
  const hasOwnPaperSurface = (((color.matchMode === "embedded-tile" || color.matchMode === "full-surface")
      && faviconCandidateHasOwnTileShape(color)
      && !ownNonPaperTile)
      || (!ownNonPaperTile && faviconCandidateHasPaperSurfaceArtwork(color)))
    || transparentGlyph;
  return hasOwnPaperSurface
    && (color.opaqueCoverage || 0) >= 0.08
    && (foreground.coverage || 0) >= 0.018
    && (foreground.span || 0) >= 0.2
    && hasPaperSurface
    && hasReadableArtwork;
}

function faviconCandidateHasPaperSurfaceArtwork(color) {
  const surface = color.paperSurface || {};
  return (surface.coverage || 0) >= FAVICON_PAPER_SURFACE_COVERAGE_MIN
    && (surface.artworkCoverage || 0) >= FAVICON_PAPER_SURFACE_ARTWORK_COVERAGE_MIN
    && (surface.span || 0) >= FAVICON_PAPER_SURFACE_SPAN_MIN
    && surface.spansCenter;
}

function faviconCandidateHasOwnTileShape(color) {
  return (color.ownTileShapeConfidence || 0) >= 0.42
    && (color.edgeConfidence || 0) <= FAVICON_EMBEDDED_TILE_EDGE_CONFIDENCE_MAX
    && (color.ownTileCornerStyle === "straight"
      || color.ownTileCornerStyle === "rounded"
      || color.ownTileCornerStyle === "circle");
}

function faviconReadableCarrierTileColor(color, mode) {
  const luminance = relativeLuminance(color);
  const target = luminance < 0.5 ? "#ffffff" : "#000000";
  const [red, green, blue] = hexToRgb(color);
  const neutral = colorChannelSpread(red, green, blue) <= 18;
  if (neutral && luminance >= 0.88) {
    return "#000000";
  }
  if (neutral && luminance <= 0.04) {
    return "#ffffff";
  }
  const initialAmount = mode === "dark" ? 0.34 : 0.42;
  const mixed = mixColorUntilContrast(
    color,
    target,
    FAVICON_READABLE_CARRIER_CONTRAST_MIN,
    initialAmount,
    FAVICON_READABLE_CARRIER_MAX_MIX
  );
  if (contrastRatio(color, mixed) >= FAVICON_READABLE_CARRIER_CONTRAST_MIN) {
    return mixed;
  }
  const inverted = invertHexColor(color);
  return contrastRatio(color, inverted) >= contrastRatio(color, mixed) ? inverted : mixed;
}

function faviconReadableNeutralCarrierTileColor(colors) {
  const palette = colors.map(normalizeHexColor).filter(Boolean);
  if (!palette.length) {
    return "#f8fafc";
  }
  const averageLuminance = palette.reduce((sum, color) => sum + relativeLuminance(color), 0) / Math.max(1, palette.length);
  const candidates = averageLuminance < 0.5
    ? ["#ffffff", "#f8fafc", "#e5e7eb", "#111827", "#000000", "#374151"]
    : ["#111827", "#000000", "#374151", "#ffffff", "#f8fafc", "#e5e7eb"];
  const minimumContrast = (candidate) => Math.min(...palette.map((color) => contrastRatio(color, candidate)));
  return candidates.find((candidate) => minimumContrast(candidate) >= FAVICON_READABLE_CARRIER_CONTRAST_MIN)
    || candidates.reduce((best, candidate) => (
      minimumContrast(candidate) > minimumContrast(best) ? candidate : best
    ));
}

function faviconFullSurfacePrefersPaperCarrier(tileColor, palette) {
  const carrier = normalizeHexColor(tileColor);
  if (!carrier || faviconCarrierLooksPaperLike(carrier)) {
    return false;
  }
  if (faviconCarrierLooksSoftTintCarrier(carrier)) {
    return false;
  }
  return faviconPalettePrefersPaperCarrier(palette)
    || faviconPaletteLooksLikeBlueGradientArtwork([carrier, ...palette]);
}

function faviconFullSurfaceHasPaperOutlineArtwork(color, tileColor, palette) {
  const carrier = normalizeHexColor(tileColor);
  if (!carrier) {
    return false;
  }
  const [red, green, blue] = hexToRgb(carrier);
  const foreground = color.foreground || {};
  return relativeLuminance(carrier) <= 0.18
    && colorSaturation(red, green, blue) <= 0.18
    && (foreground.coverage || 0) >= FAVICON_PAPER_SURFACE_ARTWORK_COVERAGE_MIN
    && (foreground.span || 0) >= 0.2
    && (foreground.maxContrast || 0) >= FAVICON_READABLE_CARRIER_CONTRAST_MIN
    && palette.some((foregroundColor) => faviconCarrierLooksPaperLike(foregroundColor));
}

function faviconFullSurfaceHasLowContrastMonochromeArtwork(color, tileColor) {
  const carrier = normalizeHexColor(tileColor);
  const foreground = color.foreground || {};
  return Boolean(carrier)
    && !faviconCarrierLooksPaperLike(carrier)
    && (color.opaqueCoverage || 0) >= 0.78
    && faviconCandidateHasVisibleForeground(color)
    && (foreground.averageContrast || 0) <= 1.18
    && contrastRatio(carrier, "#ffffff") >= FAVICON_READABLE_CARRIER_CONTRAST_MIN;
}

function faviconPalettePrefersPaperCarrier(palette) {
  return palette.some((color) => {
    const [red, green, blue] = hexToRgb(color);
    return colorSaturation(red, green, blue) >= 0.32
      && relativeLuminance(color) <= 0.68
      && contrastRatio(color, "#ffffff") >= 1.9;
  });
}

function faviconPaletteHasDistinctHueFamilies(palette) {
  const families = new Set();
  for (const color of palette.map(normalizeHexColor).filter(Boolean)) {
    const [red, green, blue] = hexToRgb(color);
    if (colorSaturation(red, green, blue) < 0.28) {
      continue;
    }
    const peak = Math.max(red, green, blue);
    families.add(peak === red ? "red" : peak === green ? "green" : "blue");
  }
  return families.size >= 2;
}

function faviconCarrierLooksPaperLike(color) {
  const normalized = normalizeHexColor(color);
  if (!normalized) {
    return false;
  }
  const [red, green, blue] = hexToRgb(normalized);
  return relativeLuminance(normalized) >= 0.82 && colorSaturation(red, green, blue) <= 0.22;
}

function faviconCarrierLooksNeutralPaperLike(color) {
  const normalized = normalizeHexColor(color);
  if (!normalized) {
    return false;
  }
  const [red, green, blue] = hexToRgb(normalized);
  return relativeLuminance(normalized) >= 0.88
    && colorChannelSpread(red, green, blue) <= 10
    && colorSaturation(red, green, blue) <= 0.08;
}

function faviconCarrierLooksSoftTintCarrier(color) {
  const normalized = normalizeHexColor(color);
  if (!normalized) {
    return false;
  }
  const [red, green, blue] = hexToRgb(normalized);
  return relativeLuminance(normalized) >= 0.86
    && colorSaturation(red, green, blue) <= 0.18
    && contrastRatio(normalized, "#ffffff") <= 1.18;
}

function faviconPaletteLooksLikeBlueGradientArtwork(palette) {
  const blues = [...new Set(palette.map(normalizeHexColor).filter(Boolean))]
    .map((color) => {
      const [red, green, blue] = hexToRgb(color);
      return { color, red, green, blue };
    })
    .filter(({ red, green, blue }) => blue >= red + 24 && (blue >= green || green >= red + 20));
  if (blues.length < 2) {
    return false;
  }
  const luminanceValues = blues.map(({ color }) => relativeLuminance(color));
  const luminanceSpread = Math.max(...luminanceValues) - Math.min(...luminanceValues);
  const saturationPeak = Math.max(...blues.map(({ red, green, blue }) => colorSaturation(red, green, blue)));
  return saturationPeak >= 0.32 && luminanceSpread >= 0.045;
}

function mixColorUntilContrast(
  color,
  target,
  minimumContrast,
  initialAmount,
  maxMix = FAVICON_EMBEDDED_TILE_CONTRAST_MAX_MIX
) {
  for (
    let amount = initialAmount;
    amount <= maxMix;
    amount += 0.04
  ) {
    const mixed = mixHexColors(color, target, amount);
    if (contrastRatio(color, mixed) >= minimumContrast) {
      return mixed;
    }
  }
  return mixHexColors(color, target, maxMix);
}

function faviconColorShouldUseOriginalTile(color, options = {}) {
  return color.confidence >= FAVICON_BACKGROUND_CONFIDENCE_MIN
    && !(options.adaptiveFaviconCarrier
      && color.matchMode === "full-surface"
      && color.opaqueCoverage >= 0.86
      && (color.foreground?.coverage || 0) < FAVICON_LOW_CONTRAST_FOREGROUND_COVERAGE_MIN);
}

function invertHexColor(color) {
  return rgbToHex(hexToRgb(color).map((channel) => 255 - channel));
}

function rgbChannelsToHex(red, green, blue) {
  return `#${[red, green, blue].map((channel) => Math.round(Math.max(0, Math.min(255, channel)))
    .toString(16)
    .padStart(2, "0")).join("")}`;
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

async function renderSelectedBookmarkFolder() {
  try {
    clearBookmarkDeleteMode();
    clearRecentBookmarkExpiryTimer();
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
        url: item.url,
        dateAdded: Number(item.dateAdded || 0)
      }));
    const favoriteSites = await loadFavoriteSites();
    const favoriteKeys = favoriteSiteKeySet(favoriteSites);
    const favoriteIconMap = favoriteSiteIconMap(favoriteSites);
    const iconRenders = readFirstPaintCache().iconRenders;

    bookmarkFolderMeta.textContent = t("bookmarkMeta", {
      folder: folder.title || t("unnamedFolder"),
      count: sites.length
    });
    if (!sites.length) {
      bookmarkGrid.innerHTML = emptyState(t("bookmarkEmpty"));
      return;
    }

    const { recentSites, groupedSites } = partitionRecentBookmarkSites(sites);
    const fragment = document.createDocumentFragment();
    if (recentSites.length) {
      fragment.appendChild(createRecentBookmarkSection(recentSites, { favoriteKeys, favoriteIconMap, iconRenders }));
      scheduleRecentBookmarkExpiry(recentSites);
    }
    groupBookmarkSitesByInitial(groupedSites).forEach((group) => {
      fragment.appendChild(createBookmarkInitialSection(group, { favoriteKeys, favoriteIconMap, iconRenders }));
    });
    bookmarkGrid.replaceChildren(await prepareBookmarkRouteFragment(fragment));
  } catch (error) {
    console.warn("Failed to load bookmarks", error);
    renderBookmarkEmptyState(t("bookmarkReadFailed"));
  }
}

async function prepareBookmarkRouteFragment(fragment) {
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
    await waitForBookmarkRouteIcons(staging);
    const ready = document.createDocumentFragment();
    ready.append(...staging.childNodes);
    return ready;
  } finally {
    staging.remove();
  }
}

async function waitForBookmarkRouteIcons(root) {
  await Promise.allSettled([...root.querySelectorAll(".bookmark-site-card img.site-icon")]
    .map(waitForBookmarkRouteIcon));
}

function waitForBookmarkRouteIcon(icon) {
  return new Promise((resolve) => {
    let observer = null;
    let quietTimer = 0;
    let timeoutTimer = 0;
    let finished = false;
    const done = () => {
      if (finished) {
        return;
      }
      finished = true;
      window.clearTimeout(quietTimer);
      window.clearTimeout(timeoutTimer);
      observer?.disconnect();
      icon.removeEventListener("load", check);
      icon.removeEventListener("error", check);
      resolve();
    };
    const ready = () => {
      if (!icon.isConnected) {
        return true;
      }
      if (icon.dataset.iconDefaultProbe === "pending" || icon.dataset.iconDefaultRescue === "pending") {
        return false;
      }
      return Boolean(icon.getAttribute("src")) && (icon.complete || icon.dataset.iconMissing === "true");
    };
    const check = () => {
      window.clearTimeout(quietTimer);
      if (ready()) {
        quietTimer = window.setTimeout(done, BOOKMARK_ICON_RENDER_QUIET_MS);
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
        "data-icon-default-probe",
        "data-icon-default-rescue",
        "data-icon-fused-tile",
        "data-icon-missing",
        "data-remote-brand-icon-request"
      ]
    });
    icon.addEventListener("load", check);
    icon.addEventListener("error", check);
    timeoutTimer = window.setTimeout(done, BOOKMARK_ICON_RENDER_SETTLE_TIMEOUT_MS);
    check();
  });
}

function renderBookmarkEmptyState(message) {
  clearRecentBookmarkExpiryTimer();
  bookmarkFolderMeta.textContent = "";
  bookmarkGrid.innerHTML = emptyState(message);
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
  const node = createSiteCard(site, options);
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
    icon: await discoverFavoriteSiteIcon(favoriteKey)
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

async function closeBookmarkPicker() {
  bookmarkPicker.hidden = true;
  bookmarkMainView.hidden = false;
  setBookmarkPickerMode(false);
  await renderSelectedBookmarkFolder();
}

function setBookmarkPickerMode(isPicking) {
  bookmarkPickerToolbar.hidden = !isPicking;
  bookmarkFolderMeta.closest(".bookmark-toolbar").hidden = isPicking;
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
    const stored = await getStoredValues({ [RECENT_HISTORY_STARTED_AT_STORAGE_KEY]: 0 });
    const recentHistoryStartedAt = Number(stored[RECENT_HISTORY_STARTED_AT_STORAGE_KEY] || 0);
    const recentStartTime = Math.max(
      Date.now() - RECENT_HISTORY_LOOKBACK_MS,
      Number.isFinite(recentHistoryStartedAt) ? recentHistoryStartedAt : 0
    );
    const [items, openTabItems] = await Promise.all([
      chrome.history.search({
        text: "",
        startTime: recentStartTime,
        maxResults: 80
      }),
      openTabHistoryItems()
    ]);
    const recentItems = mergeHistoryItems(
      await repeatDomainHistoryItems(items, recentStartTime),
      openTabItems
    );
    const recentGroups = groupHistoryBySite(recentItems, {
      maxPagesPerSite: MAX_HISTORY_PAGES_PER_SITE
    });
    if (onboardingPreviewActive) {
      return;
    }
    writeFirstPaintCache({ recentGroups: serializeRecentGroupsForFirstPaint(recentGroups) });
    renderRecentFolders(recentGroups);
  } catch (error) {
    renderRecentFolders([]);
  }
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

async function repeatDomainHistoryItems(items, startTime) {
  const displayableItems = dedupeHistory(items);
  const domainVisitCounts = new Map();

  await Promise.all(displayableItems.map(async (item) => {
    const siteKey = siteGroupKey(safeUrl(item.url));
    if (!siteKey) {
      return;
    }
    const visits = await historyVisitsSince(item.url, startTime);
    domainVisitCounts.set(siteKey, (domainVisitCounts.get(siteKey) || 0) + visits);
  }));

  return displayableItems.filter((item) => {
    const siteKey = siteGroupKey(safeUrl(item.url));
    return siteKey && (domainVisitCounts.get(siteKey) || 0) >= MIN_RECENT_DOMAIN_VISITS;
  });
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

async function openTabHistoryItems() {
  if (!chrome.tabs?.query) {
    return [];
  }

  try {
    const tabs = await chrome.tabs.query({});
    return updateOpenTabActivity(tabs);
  } catch (error) {
    console.warn("Failed to read open tabs", error);
    return [];
  }
}

async function updateOpenTabActivity(tabs) {
  const now = Date.now();
  const result = await getStoredValues({ [OPEN_TAB_ACTIVITY_STORAGE_KEY]: {} });
  const previous = normalizeOpenTabActivity(result[OPEN_TAB_ACTIVITY_STORAGE_KEY], now);
  const next = {};

  for (const tab of tabs || []) {
    const url = safeUrl(tab?.url);
    const key = normalizeHistoryKey(tab?.url);
    if (!key || !isDisplayableHistoryUrl(url)) {
      continue;
    }
    if (next[key]) {
      next[key] = {
        ...next[key],
        title: normalizeText(tab.title) || next[key].title,
        lastAccessed: Math.max(normalizedTabLastAccessed(tab), Number(next[key].lastAccessed || 0)),
        tabCount: next[key].tabCount + 1
      };
      continue;
    }
    const seen = previous[key] || {};
    const firstSeenAt = Number.isFinite(Number(seen.firstSeenAt)) ? Number(seen.firstSeenAt) : now;
    next[key] = {
      url: url.href,
      title: normalizeText(tab.title) || normalizeText(seen.title),
      firstSeenAt,
      lastAccessed: normalizedTabLastAccessed(tab) || Number(seen.lastAccessed || firstSeenAt),
      tabCount: 1
    };
  }

  await setStoredValues({ [OPEN_TAB_ACTIVITY_STORAGE_KEY]: next });
  return Object.values(next)
    .filter((entry) => now - Number(entry.firstSeenAt || 0) >= RECENT_OPEN_TAB_MIN_OPEN_MS)
    .map((entry) => ({
      title: normalizeText(entry.title) || historyFallbackTitle(safeUrl(entry.url)),
      url: entry.url,
      lastVisitTime: openTabHistoryTime(entry),
      visitCount: Math.max(MIN_RECENT_DOMAIN_VISITS, Number(entry.tabCount || 0)),
      typedCount: 0,
      fromOpenTab: true
    }));
}

function normalizedTabLastAccessed(tab) {
  const value = Number(tab?.lastAccessed || 0);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function openTabHistoryTime(entry) {
  return Number(entry?.firstSeenAt || 0);
}

function normalizeOpenTabActivity(value, now = Date.now()) {
  const entries = value && typeof value === "object" && !Array.isArray(value)
    ? Object.entries(value)
    : [];
  const normalized = {};

  for (const [key, entry] of entries) {
    const url = safeUrl(entry?.url || key);
    const normalizedKey = normalizeHistoryKey(url?.href || key);
    const firstSeenAt = Number(entry?.firstSeenAt || 0);
    if (!normalizedKey || !Number.isFinite(firstSeenAt) || firstSeenAt <= 0) {
      continue;
    }
    normalized[normalizedKey] = {
      url: url?.href || normalizedKey,
      title: normalizeText(entry?.title),
      firstSeenAt,
      lastAccessed: Number(entry?.lastAccessed || firstSeenAt),
      tabCount: Math.max(1, Number(entry?.tabCount || 1))
    };
  }

  return normalized;
}

function mergeHistoryItems(...itemGroups) {
  const merged = new Map();

  for (const items of itemGroups) {
    for (const item of items || []) {
      const key = normalizeHistoryKey(item?.url);
      if (!key) {
        continue;
      }
      const existing = merged.get(key);
      if (!existing) {
        merged.set(key, item);
        continue;
      }
      merged.set(key, {
        ...existing,
        ...item,
        title: normalizeText(item.title) || normalizeText(existing.title),
        lastVisitTime: Math.max(Number(existing.lastVisitTime || 0), Number(item.lastVisitTime || 0)),
        visitCount: Math.max(Number(existing.visitCount || 0), Number(item.visitCount || 0)),
        typedCount: Math.max(Number(existing.typedCount || 0), Number(item.typedCount || 0)),
        fromOpenTab: Boolean(existing.fromOpenTab || item.fromOpenTab)
      });
    }
  }

  return [...merged.values()]
    .sort((a, b) => Number(b.lastVisitTime || 0) - Number(a.lastVisitTime || 0));
}

function renderRecentFolders(groups, options = {}) {
  latestRecentFolderGroups = orderedRecentHistoryGroups(groups);
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
  const iconRenders = options.iconRenders || readFirstPaintCache().iconRenders;
  const startIndex = recentFolderPageIndex * MAX_RECENT_FOLDER_ITEMS;
  const fragment = document.createDocumentFragment();
  latestRecentFolderGroups.slice(startIndex, startIndex + MAX_RECENT_FOLDER_ITEMS).forEach((group) => {
    const card = createRecentFolderItem(group, { iconRenders });
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

function updateRecentFolderSwitchControls() {
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
  const homeKey = normalizeHistoryKey(homeUrl);
  const pages = [
    { title: compactHistoryUrl(safeUrl(homeUrl)) || group.name, url: homeUrl },
    ...group.pages.filter((page) => normalizeHistoryKey(page.url) !== homeKey)
  ].slice(0, MAX_HISTORY_PAGES_PER_SITE);
  const item = pages[0];
  const title = normalizeText(group.name) || historyFallbackTitle(safeUrl(item?.url || group.url));
  const card = document.createElement("article");
  const inner = document.createElement("div");
  const face = document.createElement("a");
  const icon = document.createElement("img");
  const copy = document.createElement("span");
  const name = document.createElement("strong");
  const pageTitle = document.createElement("span");
  const domain = document.createElement("span");
  const deleteButton = document.createElement("button");
  const controls = document.createElement("div");
  const previousButton = document.createElement("button");
  const nextButton = document.createElement("button");
  const pageIndicator = document.createElement("div");
  const bottomBar = document.createElement("span");
  const hasPageDrawer = pages.length > 1;

  card.className = "recent-folder-item recent-card";
  card.classList.toggle("has-page-drawer", hasPageDrawer);
  card.dataset.pageIndex = "0";
  card.dataset.siteKey = group.key || "";
  inner.className = "recent-card-inner";
  face.className = "recent-folder-face";
  face.href = item?.url || group.url;
  face.setAttribute("aria-label", t("openPage", { title }));
  icon.className = "recent-folder-logo";
  const iconSite = {
    title,
    url: group.homeUrl || group.url
  };
  const cachedIconRender = cachedFirstPaintIconRender(options.iconRenders, iconSite);
  if (cachedIconRender) {
    restoreFirstPaintIconRender(icon, iconSite, cachedIconRender);
  } else {
    applyHistoryIcon(icon, iconSite);
  }
  cacheRenderedSiteIconOnLoad(icon, iconSite);
  icon.alt = "";
  copy.className = "recent-folder-copy";
  name.className = "recent-folder-name";
  name.textContent = title;
  pageTitle.className = "recent-folder-page-title";
  domain.className = "recent-folder-domain";
  domain.textContent = compactHistoryUrl(safeUrl(group.homeUrl || group.url));
  deleteButton.className = "recent-card-delete";
  deleteButton.type = "button";
  deleteButton.innerHTML = trashIcon();
  deleteButton.setAttribute("aria-label", t("deleteHistory", { title }));
  controls.className = "recent-card-controls";
  previousButton.className = "recent-card-arrow previous";
  previousButton.type = "button";
  previousButton.innerHTML = chevronLeftIcon();
  previousButton.setAttribute("aria-label", t("historyPreviousPage"));
  nextButton.className = "recent-card-arrow next";
  nextButton.type = "button";
  nextButton.innerHTML = chevronRightIcon();
  nextButton.setAttribute("aria-label", t("historyNextPage"));
  pageIndicator.className = "recent-card-page-indicator";
  pageIndicator.setAttribute("aria-hidden", "true");
  bottomBar.className = "recent-card-bottom-bar";

  let activePageAnimation = null;
  let hoverCloseTimer = 0;

  const clearDrawerCloseTimer = () => {
    if (!hoverCloseTimer) {
      return;
    }
    window.clearTimeout(hoverCloseTimer);
    hoverCloseTimer = 0;
  };

  const openDrawerHoverState = () => {
    if (!hasPageDrawer) {
      return;
    }
    clearDrawerCloseTimer();
    card.classList.add("drawer-hover");
  };

  const scheduleDrawerClose = () => {
    if (!hasPageDrawer) {
      return;
    }
    clearDrawerCloseTimer();
    hoverCloseTimer = window.setTimeout(() => {
      card.classList.remove("drawer-hover");
      hoverCloseTimer = 0;
    }, RECENT_CARD_DRAWER_CLOSE_DELAY_MS);
  };

  const clearActivePageTurn = () => {
    if (activePageAnimation) {
      if (typeof activePageAnimation.kill === "function") {
        activePageAnimation.kill();
      } else {
        activePageAnimation.cancel();
      }
      activePageAnimation = null;
    }
    inner.querySelectorAll(".recent-folder-face-snapshot, .recent-folder-page-title-snapshot")
      .forEach((node) => node.remove());
    face.style.opacity = "";
    face.style.visibility = "";
    face.style.transform = "";
    face.style.filter = "";
    face.style.transition = "";
    pageTitle.style.opacity = "";
    pageTitle.style.visibility = "";
    pageTitle.style.transform = "";
    pageTitle.style.transition = "";
    pageTitle.classList.remove("is-turning");
  };

  const capturePageTurnSnapshot = (direction) => {
    if (!direction || pages.length < 2 || prefersReducedMotion()) {
      return null;
    }

    clearActivePageTurn();

    const snapshot = pageTitle.cloneNode(true);
    snapshot.removeAttribute("id");
    snapshot.classList.add("recent-folder-page-title-snapshot");
    snapshot.setAttribute("aria-hidden", "true");
    snapshot.style.transition = "none";
    pageTitle.style.transition = "none";
    pageTitle.classList.add("is-turning");
    face.append(snapshot);
    return snapshot;
  };

  const animatePageTurn = (direction, snapshot) => {
    if (!direction || pages.length < 2 || !snapshot) {
      snapshot?.remove();
      return;
    }

    const vector = direction === "next" ? 1 : -1;
    const incomingOffset = 34;
    const outgoingOffset = 38;
    const pageTurnDuration = 300;
    const easing = "cubic-bezier(0.16, 1, 0.3, 1)";
    const gsap = getGsap();
    if (gsap) {
      const cleanUp = () => {
        snapshot.remove();
        gsap.set(pageTitle, { clearProps: "opacity,visibility,transform" });
        pageTitle.style.transition = "";
        pageTitle.classList.remove("is-turning");
        if (activePageAnimation === timeline) {
          activePageAnimation = null;
        }
      };
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: cleanUp
      });
      timeline
        .fromTo(pageTitle,
          { autoAlpha: 0, x: vector * incomingOffset },
          { autoAlpha: 1, x: 0, duration: gsapDuration(pageTurnDuration) },
          0)
        .fromTo(snapshot,
          { autoAlpha: 1, x: 0 },
          { autoAlpha: 0, x: -vector * outgoingOffset, duration: gsapDuration(pageTurnDuration * 0.78) },
          0);
      activePageAnimation = timeline;
      return;
    }
    const incoming = pageTitle.animate(
      [
        {
          opacity: 0,
          transform: `translate3d(${vector * incomingOffset}px, 0, 0)`
        },
        {
          opacity: 1,
          transform: "translate3d(0, 0, 0)"
        }
      ],
      { duration: pageTurnDuration, easing, fill: "both" }
    );
    const outgoing = snapshot.animate(
      [
        {
          opacity: 1,
          transform: "translate3d(0, 0, 0)"
        },
        {
          opacity: 0,
          transform: `translate3d(${-vector * outgoingOffset}px, 0, 0)`
        }
      ],
      { duration: pageTurnDuration * 0.78, easing, fill: "both" }
    );

    let cleanupTimer = 0;
    let cleanedUp = false;
    let pageTurnAnimation = null;
    const cleanUp = () => {
      if (cleanedUp) {
        return;
      }
      cleanedUp = true;
      window.clearTimeout(cleanupTimer);
      incoming.cancel();
      outgoing.cancel();
      snapshot.remove();
      pageTitle.style.transition = "";
      pageTitle.classList.remove("is-turning");
      if (activePageAnimation === pageTurnAnimation) {
        activePageAnimation = null;
      }
    };
    pageTurnAnimation = { cancel: cleanUp };
    activePageAnimation = pageTurnAnimation;
    incoming.addEventListener("finish", cleanUp, { once: true });
    cleanupTimer = window.setTimeout(cleanUp, pageTurnDuration + 80);
  };

  const setActivePage = (nextIndex, direction = "") => {
    const pageCount = pages.length || 1;
    const index = ((nextIndex % pageCount) + pageCount) % pageCount;
    const activePage = pages[index] || item;
    const activeTitle = normalizeText(activePage?.title) || historyFallbackTitle(safeUrl(activePage?.url || group.url));
    const pageTurnSnapshot = capturePageTurnSnapshot(direction);
    card.dataset.pageIndex = String(index);
    face.href = activePage?.url || group.url;
    face.setAttribute("aria-label", t("openPage", { title: activeTitle }));
    pageTitle.textContent = activeTitle;
    previousButton.disabled = pageCount < 2;
    nextButton.disabled = pageCount < 2;
    pageIndicator.querySelectorAll(".recent-card-page-dot").forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === index);
    });
    animatePageTurn(direction, pageTurnSnapshot);
  };

  previousButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setActivePage(Number(card.dataset.pageIndex || 0) - 1, "previous");
    if (event.detail > 0) {
      previousButton.blur();
    }
  });
  nextButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setActivePage(Number(card.dataset.pageIndex || 0) + 1, "next");
    if (event.detail > 0) {
      nextButton.blur();
    }
  });
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

  if (hasPageDrawer) {
    card.addEventListener("pointerenter", openDrawerHoverState);
    card.addEventListener("pointerleave", scheduleDrawerClose);
    card.addEventListener("focusin", openDrawerHoverState);
    card.addEventListener("focusout", () => {
      window.setTimeout(() => {
        if (card.contains(document.activeElement)) {
          return;
        }
        scheduleDrawerClose();
      }, 0);
    });
  }

  copy.append(name, pageTitle, domain);
  face.append(icon, copy);
  pages.forEach((_, pageIndex) => {
    const dot = document.createElement("span");
    dot.className = "recent-card-page-dot";
    dot.dataset.pageIndex = String(pageIndex);
    pageIndicator.append(dot);
  });
  controls.append(previousButton, nextButton);
  inner.append(face, deleteButton);
  bottomBar.append(pageIndicator, controls);
  card.append(inner, bottomBar);
  setActivePage(0);
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
        ? [...group.pages].sort(compareHistoryItemsByRecentVisit).slice(0, maxPagesPerSite)
        : []
    }))
    .sort(compareHistoryGroupsByRecentVisit);
}

function compareHistoryItemsByRecentVisit(a, b) {
  return Number(b.lastVisitTime || 0) - Number(a.lastVisitTime || 0);
}

function compareHistoryGroupsByRecentVisit(a, b) {
  return historyGroupRecentVisitTime(b) - historyGroupRecentVisitTime(a);
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

function pageTabFilledIcon() {
  return tdesignIcon("page-tab-filled");
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

function faviconUrl(url, size) {
  let favicon;
  try {
    favicon = new URL(chrome.runtime.getURL("/_favicon/"));
  } catch {
    favicon = new URL("https://www.google.com/s2/favicons");
  }
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
