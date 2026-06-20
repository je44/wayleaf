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
const PINNED_HISTORY_STORAGE_KEY = "pinnedHistory";
const OPEN_TAB_ACTIVITY_STORAGE_KEY = "openTabActivity";
const BOOKMARK_FOLDER_STORAGE_KEY = "bookmarkFolderId";
const PORTAL_CATEGORY_STATE_STORAGE_KEY = "portalCategoryState";
const THEME_STORAGE_KEY = "themeMode";
const THEME_PALETTE_STORAGE_KEY = "themePalette";
const LANGUAGE_STORAGE_KEY = "languagePreference";
const THEME_BOOT_STORAGE_KEY = "__wayleaf_theme_boot__";
const SEARCH_SETTINGS_STORAGE_KEY = "searchSettings";
const FIRST_PAINT_CACHE_STORAGE_KEY = "__wayleaf_first_paint_cache__";
const FIRST_PAINT_CACHE_VERSION = 4;
const AI_DIRECT_PROMPT_STORAGE_KEY = "aiDirectPrompts";
const SYNC_META_STORAGE_KEY = "syncMeta";
const ONBOARDING_GUIDE_STORAGE_KEY = "onboardingGuideDismissed";
const AI_DIRECT_PROMPT_TOKEN_PARAM = "_wayleaf_prompt";
const AI_DIRECT_PROMPT_TEXT_PARAM = "_wayleaf_text";
const AI_DIRECT_PROMPT_TTL_MS = 2 * 60 * 1000;
const MAX_HISTORY_SITE_GROUPS = 9;
const MAX_HISTORY_PAGES_PER_SITE = 4;
const MAX_RECENT_FOLDER_ITEMS = 4;
const MAX_PINNED_HISTORY_ITEMS = 6;
const RECENT_HISTORY_LOOKBACK_MS = 24 * 60 * 60 * 1000;
const MIN_RECENT_DOMAIN_VISITS = 2;
const RECENT_OPEN_TAB_MIN_OPEN_MS = 2 * 60 * 60 * 1000;
const MAX_CUSTOM_PORTALS = 48;
const MAX_FAVORITE_SITES = 5;
const MAX_PORTAL_TITLE_LENGTH = 32;
const MAX_PORTAL_URL_LENGTH = 512;
const MAX_LOCAL_SEARCH_RESULTS = 8;
const MAX_CACHED_SITE_ICONS = 80;
const MAX_CACHED_SITE_ICON_BYTES = 96 * 1024;
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
const FAVORITE_REORDER_MS = 260;
const FAVORITE_DELETE_EXIT_MS = 360;
const FAVORITE_DELETE_CANCEL_MS = 280;
const SEARCH_SUGGESTIONS_EXIT_MS = 260;
const SEARCH_SUGGESTIONS_OPEN_PADDING_Y = 18;
const AI_MODE_EXIT_MS = 300;
const MAX_BOOKMARK_FOLDER_OPTIONS = 160;
const MAX_PORTAL_FEATURED_ITEMS = 6;
const MAX_BOOKMARK_PORTAL_ITEMS = 120;
const MAX_BOOKMARK_HISTORY_ITEMS = 180;
const BOOKMARK_HISTORY_LOOKBACK_DAYS = 45;
const RECENT_BOOKMARK_LOOKBACK_MS = 3 * 24 * 60 * 60 * 1000;
const ISSUE_FEEDBACK_URL = "https://github.com/je44/wayleaf/issues";
const MEDIA_FEED_SOURCES = [
  { id: "infoq-cn", title: "InfoQ 中文", language: "zh", url: "https://www.infoq.cn/feed" },
  { id: "solidot", title: "Solidot", language: "zh", url: "https://www.solidot.org/index.rss" },
  { id: "qbitai", title: "量子位", language: "zh", url: "https://www.qbitai.com/feed" },
  { id: "oschina", title: "OSCHINA", language: "zh", url: "https://www.oschina.net/news/rss" },
  { id: "ruanyifeng", title: "科技爱好者周刊", language: "zh", url: "https://feeds.feedburner.com/ruanyifeng" },
  { id: "openai-news", title: "OpenAI News", language: "en", url: "https://openai.com/news/rss.xml" },
  { id: "huggingface-blog", title: "Hugging Face Blog", language: "en", url: "https://huggingface.co/blog/feed.xml" },
  { id: "latent-space", title: "Latent Space", language: "en", url: "https://www.latent.space/feed" },
  { id: "pragmatic-engineer", title: "The Pragmatic Engineer", language: "en", url: "https://newsletter.pragmaticengineer.com/feed" },
  { id: "github-engineering", title: "GitHub Engineering", language: "en", url: "https://github.blog/engineering/feed/" },
  { id: "cloudflare-blog", title: "Cloudflare Blog", language: "en", url: "https://blog.cloudflare.com/rss/" },
  { id: "netflix-techblog", title: "Netflix TechBlog", language: "en", url: "https://netflixtechblog.com/feed" },
  { id: "dan-luu", title: "Dan Luu", language: "en", url: "https://danluu.com/atom.xml" },
  { id: "lethain", title: "Irrational Exuberance", language: "en", url: "https://lethain.com/feeds.xml" },
  { id: "mit-tech-review", title: "MIT Technology Review", language: "en", url: "https://www.technologyreview.com/feed/" },
  { id: "ieee-spectrum", title: "IEEE Spectrum", language: "en", url: "https://spectrum.ieee.org/rss/fulltext" }
];
const MEDIA_FEED_SOURCE_PROFILES = {
  "infoq-cn": { topic: "engineering", score: 9 },
  solidot: { topic: "science", score: 8 },
  qbitai: { topic: "ai", score: 9 },
  oschina: { topic: "engineering", score: 8 },
  ruanyifeng: { topic: "engineering", score: 9 },
  "openai-news": { topic: "ai", score: 11 },
  "huggingface-blog": { topic: "ai", score: 10 },
  "latent-space": { topic: "ai", score: 10 },
  "pragmatic-engineer": { topic: "engineering", score: 10 },
  "github-engineering": { topic: "engineering", score: 10 },
  "cloudflare-blog": { topic: "engineering", score: 10 },
  "netflix-techblog": { topic: "engineering", score: 9 },
  "dan-luu": { topic: "engineering", score: 10 },
  lethain: { topic: "engineering", score: 9 },
  "mit-tech-review": { topic: "ai", score: 9 },
  "ieee-spectrum": { topic: "science", score: 9 }
};
const MEDIA_FEED_TOPIC_RULES = [
  {
    id: "ai",
    labelKey: "mediaFeedTopicAi",
    reasonKey: "mediaFeedReasonAi",
    keywords: ["ai", "agent", "agents", "llm", "model", "openai", "google ai", "anthropic", "deepseek", "gemini", "gpt", "机器学习", "模型", "智能体", "大模型", "人工智能", "生成式"]
  },
  {
    id: "engineering",
    labelKey: "mediaFeedTopicEngineering",
    reasonKey: "mediaFeedReasonEngineering",
    keywords: ["developer", "github", "open source", "api", "kubernetes", "database", "security", "cloud", "linux", "javascript", "python", "rust", "go ", "工程", "开源", "开发者", "数据库", "云原生", "安全", "漏洞", "代码"]
  },
  {
    id: "business",
    labelKey: "mediaFeedTopicBusiness",
    reasonKey: "mediaFeedReasonBusiness",
    keywords: ["startup", "funding", "ipo", "acquisition", "market", "business", "revenue", "company", "founder", "融资", "上市", "收购", "商业", "创业", "公司", "市场"]
  },
  {
    id: "product",
    labelKey: "mediaFeedTopicProduct",
    reasonKey: "mediaFeedReasonProduct",
    keywords: ["product", "launch", "app", "workflow", "design", "tool", "productivity", "发布", "产品", "工具", "效率", "设计", "体验", "应用"]
  },
  {
    id: "science",
    labelKey: "mediaFeedTopicScience",
    reasonKey: "mediaFeedReasonScience",
    keywords: ["research", "science", "chip", "robot", "quantum", "energy", "space", "ieee", "研究", "科学", "芯片", "机器人", "量子", "航天", "能源"]
  },
  {
    id: "consumer",
    labelKey: "mediaFeedTopicConsumer",
    reasonKey: "mediaFeedReasonConsumer",
    keywords: ["apple", "android", "iphone", "tesla", "ev", "device", "hardware", "gadget", "小米", "苹果", "手机", "硬件", "汽车", "设备", "消费"]
  }
];
const MEDIA_FEED_TYPE_FILTERS = new Set(["all", ...MEDIA_FEED_TOPIC_RULES.map((rule) => rule.id)]);
const MEDIA_FEED_DISCOVERY_SOURCES = [
  { id: "v2ex-hot", sourceTitle: "V2EX 热门", language: "zh", topic: "engineering", type: "v2ex", url: "https://www.v2ex.com/api/topics/hot.json", score: 9 },
  { id: "hackernews-top", sourceTitle: "Hacker News Top", language: "en", topic: "engineering", type: "hn", listUrl: "https://hacker-news.firebaseio.com/v0/topstories.json", score: 10 },
  { id: "hackernews-best", sourceTitle: "Hacker News Best", language: "en", topic: "engineering", type: "hn", listUrl: "https://hacker-news.firebaseio.com/v0/beststories.json", score: 11 },
  { id: "hackernews-show", sourceTitle: "Show HN", language: "en", topic: "product", type: "hn", listUrl: "https://hacker-news.firebaseio.com/v0/showstories.json", score: 9 },
  { id: "lobsters-hot", sourceTitle: "Lobsters", language: "en", topic: "engineering", type: "lobsters", url: "https://lobste.rs/hottest.json", score: 9 },
  { id: "arxiv-ai", sourceTitle: "arXiv AI", language: "en", topic: "ai", type: "arxiv", category: "cs.AI", score: 10 },
  { id: "devto-ai", sourceTitle: "DEV.to AI", language: "en", topic: "engineering", type: "devto", tag: "ai", score: 7 },
  { id: "devto-webdev", sourceTitle: "DEV.to Web Dev", language: "en", topic: "engineering", type: "devto", tag: "webdev", score: 7 }
];
const CUSTOM_MEDIA_FEEDS_STORAGE_KEY = "customMediaFeeds";
const MEDIA_FEED_FEEDBACK_STORAGE_KEY = "mediaFeedFeedback";
const SYNC_STORAGE_KEYS = new Set([
  CUSTOM_PORTALS_STORAGE_KEY,
  FAVORITE_SITES_STORAGE_KEY,
  PINNED_HISTORY_STORAGE_KEY,
  BOOKMARK_FOLDER_STORAGE_KEY,
  PORTAL_CATEGORY_STATE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  THEME_PALETTE_STORAGE_KEY,
  LANGUAGE_STORAGE_KEY,
  SEARCH_SETTINGS_STORAGE_KEY,
  CUSTOM_MEDIA_FEEDS_STORAGE_KEY,
  SYNC_META_STORAGE_KEY
]);
const MEDIA_FEED_ITEM_LIMIT = 48;
const MEDIA_FEED_SOURCE_ITEM_LIMIT = 8;
const MEDIA_FEED_DISCOVERY_ITEM_LIMIT = 8;
const MEDIA_FEED_INITIAL_ITEMS = 12;
const MEDIA_FEED_PAGE_SIZE = 8;
const MEDIA_FEED_TIMEOUT_MS = 5500;
const MEDIA_FEED_TOTAL_TIMEOUT_MS = 9000;
const MEDIA_FEED_CONCURRENCY = 3;
const MAX_CUSTOM_MEDIA_FEEDS = 12;
const MAX_MEDIA_FEED_FEEDBACK_KEYS = 120;
const MEDIA_FEED_LARGE_CARD_INTERVAL = 5;
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
const FAVICON_EDGE_CARRIER_CONFIDENCE_MIN = 0.48;
const FAVICON_EMBEDDED_TILE_EDGE_CONFIDENCE_MAX = 0.24;
const FAVICON_EMBEDDED_TILE_INNER_CONFIDENCE_MIN = 0.34;
const FAVICON_EMBEDDED_TILE_CONTRAST_MIN = 1.35;
const FAVICON_EMBEDDED_TILE_CONTRAST_MAX_MIX = 0.42;
const FAVICON_EMBEDDED_TILE_FUSION_CLEAR_DISTANCE = 48;
const FAVICON_EMBEDDED_TILE_FUSION_FEATHER_DISTANCE = 24;
const FAVICON_READABLE_CARRIER_CONTRAST_MIN = 3;
const FAVICON_READABLE_CARRIER_MAX_MIX = 0.72;
const LOCAL_BRAND_CARRIER_CONTRAST_MIN = 2.75;
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

const LOW_VALUE_MEDIA_FEED_PATTERNS = [
  /早报|晚报|日报|周报|一周|盘点|合集|汇总|速览|快讯|活动|直播|中奖|优惠|招聘|促销|广告|发布会邀请/,
  /newsletter|roundup|daily brief|weekly recap|sponsored|webinar|event|hiring|coupon|deal/i
];
const DEFAULT_PORTAL_CATEGORY = "developer";
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
  basic: { inactive: "setting", active: "setting-filled" },
  search: { inactive: "ai-search", active: "ai-search-filled" }
});
const CUSTOM_THEME_PALETTE_ID = "custom";
const DEFAULT_CUSTOM_THEME_COLORS = Object.freeze({
  light: "#0d6d59",
  lightStrong: "#074b3e",
  dark: "#82c8ae",
  darkStrong: "#a8dcc8"
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
        paper: "#121512",
        panel: "#191d19",
        panelSoft: "#222821",
        inputBg: "#191d19",
        hoverBg: "#273027",
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
        paper: "#15130f",
        panel: "#201c15",
        panelSoft: "#2b251b",
        inputBg: "#201c15",
        hoverBg: "#342c1f",
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
        paper: "#121519",
        panel: "#1a1e23",
        panelSoft: "#232a30",
        inputBg: "#1a1e23",
        hoverBg: "#2a333a",
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
        paper: "#151311",
        panel: "#201b17",
        panelSoft: "#2a241f",
        inputBg: "#201b17",
        hoverBg: "#322a24",
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
  kimi: { mode: "mask", tile: "#ffffff", glyph: "#111827" },
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
  { id: "doubao", command: "/doubao", commands: ["/doubao", "/db"], label: "豆包", searchUrl: "https://www.doubao.com/chat/", queryParam: "q", aiDirect: true, autoSubmit: true, directUrl: "https://www.doubao.com/chat/", themeColor: "#1e37fc" },
  { id: "kimi", command: "/kimi", label: "Kimi", searchUrl: "https://www.kimi.com/", queryParam: "q", aiDirect: true, autoSubmit: true, directUrl: "https://www.kimi.com/", themeColor: "#111827" },
  { id: "glm", command: "/glm", commands: ["/glm", "/chatglm", "/zhipu"], label: "GLM", searchUrl: "https://chatglm.cn/", queryParam: "q", aiDirect: true, autoSubmit: true, directUrl: "https://chatglm.cn/", themeColor: "#3859ff" },
  { id: "jimeng", command: "/jimeng", commands: ["/jimeng", "/jm"], label: "即梦", searchUrl: "https://jimeng.jianying.com/ai-tool/home", queryParam: "q", aiDirect: true, autoSubmit: true, directUrl: "https://jimeng.jianying.com/ai-tool/home", themeColor: "#1c6fff", urlPromptFallback: true }
];
const PLATFORM_SEARCH_TARGETS = Object.freeze([
  { id: "youtube", label: "YouTube", prefixes: ["yt", "youtube"], searchUrl: "https://www.youtube.com/results", queryParam: "search_query", iconUrl: "https://www.youtube.com/", themeColor: "#ff0000", behaviorKey: "platformSearchDirectBehavior" },
  { id: "x", label: "X", prefixes: ["x", "twitter"], searchUrl: "https://x.com/search", queryParam: "q", searchParams: { src: "typed_query" }, iconUrl: "https://x.com/", themeColor: "#000000", behaviorKey: "platformSearchLoginBehavior" },
  { id: "xiaohongshu", label: "小红书", prefixes: ["xhs", "rednote"], searchUrl: "https://www.xiaohongshu.com/search_result", queryParam: "keyword", searchParams: { source: "web_explore_feed" }, iconUrl: "https://www.xiaohongshu.com/", themeColor: "#ff2442", behaviorKey: "platformSearchLoginBehavior" },
  { id: "instagram", label: "Instagram", prefixes: ["ig", "instagram"], searchUrl: "https://www.instagram.com/explore/search/keyword/", queryParam: "q", iconUrl: "https://www.instagram.com/", fallback: true, themeColor: "#e4405f", behaviorKey: "platformSearchFallbackBehavior" },
  { id: "threads", label: "Threads", prefixes: ["threads", "th"], searchUrl: "https://www.threads.com/search", queryParam: "q", iconUrl: "https://www.threads.com/", fallback: true, themeColor: "#000000", behaviorKey: "platformSearchFallbackBehavior" },
  { id: "douyin", label: "抖音", prefixes: ["dy", "douyin"], searchUrl: "https://www.douyin.com/search/", pathQuery: true, searchParams: { type: "general" }, iconUrl: "https://www.douyin.com/", themeColor: "#000000", behaviorKey: "platformSearchLoginBehavior" },
  { id: "zhihu", label: "知乎", prefixes: ["zhihu", "zh"], searchUrl: "https://www.zhihu.com/search", queryParam: "q", searchParams: { type: "content" }, iconUrl: "https://www.zhihu.com/", themeColor: "#0084ff", behaviorKey: "platformSearchDirectBehavior" },
  { id: "bilibili", label: "Bilibili", prefixes: ["bili", "bilibili"], searchUrl: "https://search.bilibili.com/all", queryParam: "keyword", iconUrl: "https://www.bilibili.com/", themeColor: "#00a1d6", behaviorKey: "platformSearchDirectBehavior" },
  { id: "tiktok", label: "TikTok", prefixes: ["tt", "tiktok"], searchUrl: "https://www.tiktok.com/search", queryParam: "q", iconUrl: "https://www.tiktok.com/", themeColor: "#000000", behaviorKey: "platformSearchLoginBehavior" }
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
  "deepseek.com": "DeepSeek",
  "discord.com": "Discord",
  "docs.b.ai": "B.AI Docs",
  "doubao.com": "豆包",
  "drive.google.com": "Google Drive",
  "figma.com": "Figma",
  "github.com": "GitHub",
  "gmail.com": "Gmail",
  "google.com": "Google",
  "instagram.com": "Instagram",
  "kimi.com": "Kimi",
  "linkedin.com": "LinkedIn",
  "npmjs.com": "npm",
  "notion.so": "Notion",
  "react.dev": "React",
  "stackoverflow.com": "Stack Overflow",
  "taobao.com": "淘宝",
  "threads.com": "Threads",
  "trip.com": "Trip.com",
  "vercel.com": "Vercel",
  "x.com": "X",
  "xiaohongshu.com": "小红书",
  "youtube.com": "YouTube",
  "zhihu.com": "知乎"
};
const SITE_GROUP_OVERRIDES = {
  "docs.b.ai": "docs.b.ai",
  "calendar.google.com": "calendar.google.com",
  "drive.google.com": "drive.google.com",
  "docs.google.com": "docs.google.com",
  "console.firebase.google.com": "firebase.google.com",
  "firebase.google.com": "firebase.google.com",
  "mail.google.com": "gmail.com",
  "teams.microsoft.com": "teams.microsoft.com",
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
  "drive.google.com": "drive.google.com",
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
  "alibaba.com": "alibabadotcom.svg",
  "analytics.google.com": "googleanalytics.svg",
  "atlassian.net": "jira.svg",
  "b.ai": "bai.png",
  "booking.com": "bookingdotcom.svg",
  "bsky.app": "bluesky.svg",
  "calendar.google.com": "googlecalendar.svg",
  "code.visualstudio.com": "visualstudiocode.svg",
  "datadoghq.com": "datadog.svg",
  "developer.mozilla.org": "mdn.svg",
  "chatglm.cn": "glm.svg",
  "doubao.com": "doubao.svg",
  "docs.b.ai": "baidocs.svg",
  "docs.google.com": "googledocs.svg",
  "douyin.com": "douyin.svg",
  "drive.google.com": "googledrive.svg",
  "feishu.cn": "feishu.png",
  "gemini.google.com": "googlegemini.svg",
  "itch.io": "itchdotio.svg",
  "jd.com": "jd.svg",
  "jimeng.jianying.com": "jimeng.svg",
  "kimi.com": "kimi.svg",
  "larksuite.com": "larksuite.ico",
  "maps.google.com": "googlemaps.svg",
  "meet.google.com": "googlemeet.svg",
  "mimo.mi.com": "xiaomimimo.svg",
  "mimo.xiaomi.com": "xiaomimimo.svg",
  "music.163.com": "neteasecloudmusic.svg",
  "nextjs.org": "nextdotjs.svg",
  "nodejs.org": "nodedotjs.svg",
  "npmjs.com": "npm.svg",
  "office.com": "microsoftoffice.svg",
  "pinduoduo.com": "pinduoduo.svg",
  "proton.me": "protonmail.svg",
  "steamcommunity.com": "steam.svg",
  "steampowered.com": "steam.svg",
  "teams.microsoft.com": "microsoftteams.svg",
  "tmall.com": "tmall.png",
  "trip.com": "tripdotcom.svg",
  "uizard.io": "uizard.ico",
  "vuejs.org": "vuedotjs.svg",
  "yandex.com": "yandex.ico"
});
const REMOTE_BRAND_ICON_PROVIDERS = Object.freeze([
  {
    id: "simple-icons-cdn",
    urlForSlug: (slug) => `https://cdn.simpleicons.org/${encodeURIComponent(slug)}?viewbox=auto`
  },
  {
    id: "iconify",
    urlForSlug: (slug) => `https://api.iconify.design/simple-icons/${encodeURIComponent(slug)}.svg`
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
  "baidu.com": "#2932e1",
  "bilibili.com": "#00a1d6",
  "bing.com": "#258ffa",
  "canva.com": "#00c4cc",
  "chatgpt.com": "#ffffff",
  "claude.ai": "#d97757",
  "cloudflare.com": "#f38020",
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
  "jd.com": "#ff0000",
  "jimeng.jianying.com": "#1c6fff",
  "kagi.com": "#ffb319",
  "kimi.com": "#111827",
  "larksuite.com": "#00d6b9",
  "linkedin.com": "#0a66c2",
  "microsoft.com": "#5e5e5e",
  "mimo.mi.com": "#000000",
  "mimo.xiaomi.com": "#000000",
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
  "vercel.com": "#000000",
  "weibo.com": "#e6162d",
  "x.com": "#000000",
  "xiaohongshu.com": "#ff2442",
  "xiaomimimo.com": "#000000",
  "yandex.com": "#ffcc00",
  "youtube.com": "#ff0000",
  "zhihu.com": "#0084ff"
});
const MULTICOLOR_BRAND_ICON_SITE_KEYS = new Set([
  "bing.com",
  "calendar.google.com",
  "doubao.com",
  "douyin.com",
  "docs.google.com",
  "drive.google.com",
  "figma.com",
  "gemini.google.com",
  "gmail.com",
  "google.com",
  "huggingface.co",
  "instagram.com",
  "jimeng.jianying.com",
  "maps.google.com",
  "meet.google.com",
  "microsoft.com",
  "slack.com",
  "tiktok.com"
]);
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
    smartPortalTab: "智能常用",
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
    portalCategories: "智能分类",
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
    mediaTitle: "信息流",
    mediaFeedLoadingTitle: "正在读取信息流",
    mediaFeedLoadingBody: "稍后会显示最新资讯。",
    mediaFeedUpdated: "刚刚更新",
    mediaFeedFailedTitle: "暂时无法读取",
    mediaFeedFailedBody: "接口没有返回可显示内容，请稍后刷新。",
    mediaFeedEmptyTitle: "暂无资讯",
    mediaFeedEmptyBody: "接口暂时没有返回可显示内容。",
    mediaFeedRefresh: "刷新信息流",
    mediaFeedMore: "更多",
    mediaFeedNotInterested: "不感兴趣",
    mediaFeedNotInterestedDone: "已减少类似内容",
    mediaFeedAutoLoad: "继续滚动加载更多",
    mediaFeedAgentFocus: "Agent 重点",
    mediaFeedAgentStream: "继续跟踪",
    mediaFeedTopicAi: "AI",
    mediaFeedTopicEngineering: "工程",
    mediaFeedTopicBusiness: "商业",
    mediaFeedTopicProduct: "产品",
    mediaFeedTopicScience: "深科技",
    mediaFeedTopicConsumer: "消费科技",
    mediaFeedReasonAi: "模型、智能体或 AI 基础设施信号",
    mediaFeedReasonEngineering: "工程实践、开源或开发者生态信号",
    mediaFeedReasonBusiness: "公司、市场或商业模式变化",
    mediaFeedReasonProduct: "新产品、工具或效率工作流",
    mediaFeedReasonScience: "研究、硬件或前沿技术进展",
    mediaFeedReasonConsumer: "设备、平台或消费科技变化",
    mediaFeedReasonDefault: "来源多样化后的高价值条目",
    mediaFeedMetricHn: "{score} 分 · {comments} 条讨论",
    mediaFeedMetricReplies: "{count} 条回复",
    mediaFeedMetricReactions: "{reactions} 个反应 · {comments} 条讨论",
    mediaFeedAdd: "添加信息源",
    mediaFeedTypeTabs: "资讯流类型",
    mediaFeedTypeAll: "全部",
    mediaFeedUrl: "RSS 地址",
    mediaFeedLanguage: "语言",
    mediaFeedUrlPlaceholder: "https://example.com/feed.xml",
    mediaFeedDefaultSources: "默认源",
    mediaFeedInvalidUrl: "请输入 http 或 https 开头的 RSS 地址。",
    mediaFeedLimit: "自定义信息源最多 {count} 个。",
    mediaFeedSaveFailed: "保存信息源失败，请稍后重试。",
    mediaFeedLanguageZh: "中文",
    mediaFeedLanguageEn: "English",
    refreshBookmarkFolder: "刷新当前书签文件夹",
    chooseBookmarkFolder: "选择书签文件夹",
    collapseSurface: "收起面板",
    back: "返回",
    chooseBookmarkFolderPrompt: "选择一个书签文件夹",
    historyTitle: "最近浏览",
    openPortalSurface: "打开导航中枢",
    openHistorySurface: "打开最近浏览",
    recentFoldersSwitch: "切换最近浏览卡片",
    recentFoldersPrevious: "上一组最近浏览",
    recentFoldersNext: "下一组最近浏览",
    historyPreviousPage: "上一条最近浏览",
    historyNextPage: "下一条最近浏览",
    refreshHistory: "刷新历史记录",
    pinnedTitle: "置顶",
    recentTitle: "最近 · 时间流",
    quickSearchPlaceholder: "搜索或输入网址",
    quickSearch: "搜索",
    quickSearchLocal: "打开",
    quickSearchAggregate: "聚合搜索",
    quickSearchAiCommandHint: "输入 /gpt、/claude、/gemini、/grok、/deepseek、/doubao、/kimi 或 /glm 切换 AI",
    quickSearchAiSelected: "当前选择",
    quickSearchEngine: "搜索模式",
    quickSearchWith: "使用 {engine} 搜索",
    quickSearchWithAi: "发送到 {engine}",
    quickSearchWithPlatform: "在 {platform} 搜索",
    quickSearchPlatformPlaceholder: "在 {platform} 搜索",
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
    languageSettingsTitle: "语言",
    languageSettingsDescription: "选择 Wayleaf 的显示语言",
    appearanceModeTitle: "外观",
    appearanceModeDescription: "选择 Wayleaf 的外观",
    appearanceModeHint: "根据系统设置自动切换浅色或深色模式。",
    themeModeSystem: "跟随系统",
    themeModeLight: "浅色",
    themeModeDark: "深色",
    presetPaletteTitle: "色彩",
    presetPaletteDescription: "为浅色与深色模式选择一组默认强调色",
    presetPaletteHint: "用于按钮、链接、选中态与提示色。",
    themePaletteSage: "松叶",
    themePaletteForest: "墨绿",
    themePaletteAmber: "琥珀",
    themePaletteSky: "湖蓝",
    themePalettePeach: "珊瑚",
    themePaletteNeutral: "中性",
    syncSettingsTitle: "云端同步",
    syncSettingsDescription: "跨设备同步你的配置",
    syncSettingsReady: "配置会跟随 Chrome 账号同步",
    syncSettingsReadyDetail: "同一 Google 账号安装后会自动恢复；扩展启用时每天自动同步一次。",
    syncSettingsUnavailable: "当前浏览器不支持同步",
    syncSettingsUnavailableDetail: "仍会保存在这台设备。",
    syncSettingsDone: "刚刚写入同步区",
    syncSettingsDoneDetail: "Chrome 会自动分发到同账号设备。",
    syncSettingsNow: "手动同步",
    syncSettingsAuto: "自动同步",
    syncSettingsActionsLabel: "同步方式",
    searchSettingsDefaultTitle: "基本搜索",
    searchSettingsDefaultDescription: "设置普通关键词默认使用的搜索入口",
    searchSettingsDefaultHint: "输入普通关键词时，Wayleaf 会优先使用标记为默认的基本搜索。",
    searchSettingsAiTitle: "AI 搜索引擎",
    searchSettingsAiDescription: "修改内建 AI 引擎的名称、触发词和搜索链接",
    searchSettingsAiHint: "触发词用空格或逗号分隔，例如 /gpt /chatgpt。需要登录的平台请先完成首次登录再使用。",
    searchSettingsPlatformTitle: "平台搜索",
    searchSettingsPlatformDescription: "使用内置前缀直达常用平台搜索结果",
    searchSettingsPlatformHint: "输入 yt 内容、x 内容、xhs 内容、ig 内容、threads 内容、dy 内容或 zhihu 内容时，搜索框会切换到对应平台；需要登录的平台请先完成首次登录再使用。",
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
    onboardingPrivacyTitle: "本地优先",
    onboardingPrivacyBody: "历史、书签、入口和主题保存在浏览器扩展存储里，Wayleaf 没有后端账号。",
    onboardingPermissionTitle: "权限用来完成页面功能",
    onboardingPermissionBody: "history 用于最近浏览，bookmarks 用于自选书签，tabs 和 scripting 用于打开搜索结果和 AI 页面辅助。",
    onboardingSyncTitle: "配置会尽量跟随 Chrome 同步",
    onboardingSyncBody: "同一 Google 账号会自动恢复偏好；如果当前浏览器不支持同步，设置仍会保留在本机。",
    onboardingAiTitle: "AI 指令有兜底",
    onboardingAiBody: "输入 /gpt、/claude、/gemini、/grok、/deepseek、/doubao、/kimi 或 /glm 可跳转并尝试填入问题；若对方网站要求登录或改版，请手动粘贴暂存问题。",
    onboardingStartTitle: "从两个动作开始",
    onboardingStartBody: "添加一个常用网站，再到导航中枢选择一个书签文件夹。你可以随时在设置中心调整主题和同步。",
    onboardingFeedbackTitle: "遇到问题直接反馈",
    onboardingFeedbackBody: "反馈时带上浏览器、Wayleaf 版本和失败场景，最容易定位。",
    onboardingFeedback: "反馈问题",
    onboardingDone: "开始使用",
    closeOnboarding: "关闭指引",
    customPaletteTitle: "自定义主题",
    customPaletteDescription: "自定义 Wayleaf 的主题双色",
    customPaletteHint: "自定义颜色会在浅色与深色模式下自动适配。",
    lightAccent: "主色（按钮 / 链接 / 选中）",
    darkAccent: "辅助色（强调 / 提示）",
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
    topbarLabel: "頂部功能區",
    shellLabel: "Wayleaf 控制台",
    portalTitle: "導航中樞",
    mobilePortalTab: "快捷",
    mobileMediaTab: "資訊",
    smartPortalTab: "智能常用",
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
    quickSearchPlaceholder: "搜尋或輸入網址",
    quickSearch: "搜尋",
    quickSearchLocal: "打開",
    quickSearchAggregate: "聚合搜尋",
    quickSearchAiCommandHint: "輸入 /gpt、/claude、/gemini、/grok、/deepseek、/doubao、/kimi 或 /glm 切換 AI",
    quickSearchAiSelected: "目前選擇",
    quickSearchEngine: "搜尋模式",
    quickSearchWith: "使用 {engine} 搜尋",
    quickSearchWithAi: "送到 {engine}",
    quickSearchWithPlatform: "在 {platform} 搜尋",
    quickSearchPlatformPlaceholder: "在 {platform} 搜尋",
    portalCategoryItems: "{count} 個入口",
    portalCategories: "智能分類",
    portalCategoriesExpand: "展開",
    portalCategoriesCollapse: "收起",
    portalCategoryFeatured: "常用入口",
    portalCategory: "分類",
    portalNamePlaceholder: "例如：Notion",
    portalUrlPlaceholder: "https://www.notion.so",
    historyJustNow: "剛剛",
    historyMinutesAgo: "{count} 分鐘前",
    historyHoursAgo: "{count} 小時前",
    portalName: "名稱",
    portalUrl: "網址",
    cancel: "取消",
    add: "新增",
    addPortal: "新增入口",
    mediaTitle: "資訊流",
    mediaFeedLoadingTitle: "正在讀取資訊流",
    mediaFeedLoadingBody: "稍後會顯示最新資訊。",
    mediaFeedUpdated: "剛剛更新",
    mediaFeedFailedTitle: "暫時無法讀取",
    mediaFeedFailedBody: "介面沒有返回可顯示內容，請稍後刷新。",
    mediaFeedEmptyTitle: "暫無資訊",
    mediaFeedEmptyBody: "介面暫時沒有返回可顯示內容。",
    mediaFeedRefresh: "刷新資訊流",
    mediaFeedMore: "更多",
    mediaFeedNotInterested: "不感興趣",
    mediaFeedNotInterestedDone: "已減少類似內容",
    mediaFeedAutoLoad: "繼續滾動載入更多",
    mediaFeedAgentFocus: "Agent 重點",
    mediaFeedAgentStream: "繼續跟蹤",
    mediaFeedTopicAi: "AI",
    mediaFeedTopicEngineering: "工程",
    mediaFeedTopicBusiness: "商業",
    mediaFeedTopicProduct: "產品",
    mediaFeedTopicScience: "深科技",
    mediaFeedTopicConsumer: "消費科技",
    mediaFeedReasonAi: "模型、智能體或 AI 基礎設施信號",
    mediaFeedReasonEngineering: "工程實踐、開源或開發者生態信號",
    mediaFeedReasonBusiness: "公司、市場或商業模式變化",
    mediaFeedReasonProduct: "新產品、工具或效率工作流",
    mediaFeedReasonScience: "研究、硬體或前沿技術進展",
    mediaFeedReasonConsumer: "設備、平台或消費科技變化",
    mediaFeedReasonDefault: "來源多樣化後的高價值條目",
    mediaFeedMetricHn: "{score} 分 · {comments} 條討論",
    mediaFeedMetricReplies: "{count} 條回覆",
    mediaFeedMetricReactions: "{reactions} 個反應 · {comments} 條討論",
    mediaFeedAdd: "新增資訊源",
    mediaFeedTypeTabs: "資訊流類型",
    mediaFeedTypeAll: "全部",
    mediaFeedUrl: "RSS 地址",
    mediaFeedLanguage: "語言",
    mediaFeedUrlPlaceholder: "https://example.com/feed.xml",
    mediaFeedDefaultSources: "預設源",
    mediaFeedInvalidUrl: "請輸入 http 或 https 開頭的 RSS 地址。",
    mediaFeedLimit: "自訂資訊源最多 {count} 個。",
    mediaFeedSaveFailed: "儲存資訊源失敗，請稍後重試。",
    mediaFeedLanguageZh: "中文",
    mediaFeedLanguageEn: "English",
    refreshBookmarkFolder: "刷新目前書籤資料夾",
    chooseBookmarkFolder: "選擇書籤資料夾",
    collapseSurface: "收起面板",
    back: "返回",
    chooseBookmarkFolderPrompt: "選擇一個書籤資料夾",
    historyTitle: "最近瀏覽",
    openPortalSurface: "打開導航中樞",
    openHistorySurface: "打開最近瀏覽",
    recentFoldersSwitch: "切換最近瀏覽卡片",
    recentFoldersPrevious: "上一組最近瀏覽",
    recentFoldersNext: "下一組最近瀏覽",
    historyPreviousPage: "上一條最近瀏覽",
    historyNextPage: "下一條最近瀏覽",
    refreshHistory: "刷新歷史記錄",
    pinnedTitle: "釘選",
    recentTitle: "最近",
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
    historyExpandPages: "展開 {count} 個相關頁面",
    historyCollapsePages: "收起相關頁面",
    historyRelatedPages: "相關頁面",
    historyPrimaryPage: "最近頁面",
    openSettings: "設定",
    closeSettings: "返回首頁",
    settingsBackHome: "返回首頁",
    help: "說明",
    settingsTitle: "設定",
    settingsSubtitle: "個人化 Wayleaf，管理同步與主題偏好。",
    settingsTabsLabel: "設定分類",
    settingsBasicTab: "基本設定",
    settingsSearchTab: "搜尋設定",
    languageSettingsTitle: "語言",
    languageSettingsDescription: "選擇 Wayleaf 的顯示語言",
    appearanceModeTitle: "外觀",
    appearanceModeDescription: "選擇 Wayleaf 的外觀",
    appearanceModeHint: "根據系統設定自動切換淺色或深色模式。",
    themeModeSystem: "跟隨系統",
    themeModeLight: "淺色",
    themeModeDark: "深色",
    presetPaletteTitle: "色彩",
    presetPaletteDescription: "為淺色與深色模式選擇一組預設強調色",
    presetPaletteHint: "用於按鈕、連結、選取狀態與提示色。",
    themePaletteSage: "松葉",
    themePaletteForest: "墨綠",
    themePaletteAmber: "琥珀",
    themePaletteSky: "湖藍",
    themePalettePeach: "珊瑚",
    themePaletteNeutral: "中性",
    syncSettingsTitle: "雲端同步",
    syncSettingsDescription: "跨裝置同步你的設定",
    syncSettingsReady: "設定會跟隨 Chrome 帳號同步",
    syncSettingsReadyDetail: "同一 Google 帳號安裝後會自動恢復；擴充功能啟用時每天自動同步一次。",
    syncSettingsUnavailable: "目前瀏覽器不支援同步",
    syncSettingsUnavailableDetail: "仍會保存在這台裝置。",
    syncSettingsDone: "剛剛寫入同步區",
    syncSettingsDoneDetail: "Chrome 會自動分發到同帳號裝置。",
    syncSettingsNow: "手動同步",
    syncSettingsAuto: "自動同步",
    syncSettingsActionsLabel: "同步方式",
    searchSettingsDefaultTitle: "基本搜尋",
    searchSettingsDefaultDescription: "設定普通關鍵字預設使用的搜尋入口",
    searchSettingsDefaultHint: "輸入普通關鍵字時，Wayleaf 會優先使用標記為預設的基本搜尋。",
    searchSettingsAiTitle: "AI 搜尋引擎",
    searchSettingsAiDescription: "修改內建 AI 引擎的名稱、觸發詞和搜尋連結",
    searchSettingsAiHint: "觸發詞用空格或逗號分隔，例如 /gpt /chatgpt。需要登入的平台請先完成首次登入再使用。",
    searchSettingsPlatformTitle: "平台搜尋",
    searchSettingsPlatformDescription: "使用內建前綴直達常用平台搜尋結果",
    searchSettingsPlatformHint: "輸入 yt 內容、x 內容、xhs 內容、ig 內容、threads 內容、dy 內容或 zhihu 內容時，搜尋框會切換到對應平台；需要登入的平台請先完成首次登入再使用。",
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
    onboardingPrivacyTitle: "本機優先",
    onboardingPrivacyBody: "歷史、書籤、入口和主題設定會保存在瀏覽器擴充功能儲存空間中，Wayleaf 沒有後端帳號。",
    onboardingPermissionTitle: "權限用來完成頁面功能",
    onboardingPermissionBody: "history 用於最近瀏覽，bookmarks 用於自選書籤，tabs 和 scripting 用於打開搜尋結果並輔助 AI 頁面交接。",
    onboardingSyncTitle: "設定會盡量跟隨 Chrome 同步",
    onboardingSyncBody: "同一 Google 帳號會自動恢復偏好；如果目前瀏覽器不支援同步，設定仍會保留在本機。",
    onboardingAiTitle: "AI 指令有備援",
    onboardingAiBody: "輸入 /gpt、/claude、/gemini、/grok、/deepseek、/doubao、/kimi 或 /glm 可跳轉並嘗試填入問題；若對方網站要求登入或改版，請手動貼上暫存問題。",
    onboardingStartTitle: "從兩個動作開始",
    onboardingStartBody: "新增一個常用網站，再到導航中樞選擇一個書籤資料夾。你可以隨時在設定中調整主題和同步。",
    onboardingFeedbackTitle: "遇到問題直接回報",
    onboardingFeedbackBody: "回報時帶上瀏覽器、Wayleaf 版本和失敗場景，最容易定位。",
    onboardingFeedback: "回報問題",
    onboardingDone: "開始使用",
    closeOnboarding: "關閉指引",
    customPaletteTitle: "自訂主題",
    customPaletteDescription: "自訂 Wayleaf 的主題雙色",
    customPaletteHint: "自訂顏色會在淺色與深色模式下自動適配。",
    lightAccent: "主色（按鈕 / 連結 / 選取）",
    darkAccent: "輔助色（強調 / 提示）",
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
    historySitePageMeta: "{count} 個相關頁面",
    historyReadFailed: "無法讀取歷史記錄，請確認擴充功能已獲得 history 權限。",
    deleteHistory: "刪除 {title}",
    deleteHistoryFailed: "刪除失敗，可能已在其他位置變更。",
    noPinnedItems: "還沒有釘選項目。",
    noHistoryItems: "暫無最近瀏覽記錄。",
    openSiteHome: "打開 {name} 首頁",
    openPage: "打開 {title}",
    unpin: "取消釘選",
    pin: "釘選",
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
    smartPortalTab: "Smart",
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
    portalCategories: "Smart categories",
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
    mediaTitle: "Media feed",
    mediaFeedLoadingTitle: "Loading feed",
    mediaFeedLoadingBody: "Latest stories will appear here shortly.",
    mediaFeedUpdated: "Updated just now",
    mediaFeedFailedTitle: "Could not load feed",
    mediaFeedFailedBody: "The feed API did not return displayable items. Refresh later.",
    mediaFeedEmptyTitle: "No stories",
    mediaFeedEmptyBody: "The feed API has no displayable stories right now.",
    mediaFeedRefresh: "Refresh feed",
    mediaFeedMore: "More",
    mediaFeedAutoLoad: "Scroll for more",
    mediaFeedAgentFocus: "Agent focus",
    mediaFeedAgentStream: "Tracking next",
    mediaFeedTopicAi: "AI",
    mediaFeedTopicEngineering: "Engineering",
    mediaFeedTopicBusiness: "Business",
    mediaFeedTopicProduct: "Product",
    mediaFeedTopicScience: "Deep tech",
    mediaFeedTopicConsumer: "Consumer tech",
    mediaFeedReasonAi: "Model, agent, or AI infrastructure signal",
    mediaFeedReasonEngineering: "Engineering, open-source, or developer ecosystem signal",
    mediaFeedReasonBusiness: "Company, market, or business model shift",
    mediaFeedReasonProduct: "New product, tool, or productivity workflow",
    mediaFeedReasonScience: "Research, hardware, or frontier technology progress",
    mediaFeedReasonConsumer: "Device, platform, or consumer technology shift",
    mediaFeedReasonDefault: "High-value item after source diversification",
    mediaFeedMetricHn: "{score} points · {comments} comments",
    mediaFeedMetricReplies: "{count} replies",
    mediaFeedMetricReactions: "{reactions} reactions · {comments} comments",
    mediaFeedAdd: "Add feed",
    mediaFeedTypeTabs: "Feed type",
    mediaFeedTypeAll: "All",
    mediaFeedUrl: "RSS URL",
    mediaFeedLanguage: "Language",
    mediaFeedUrlPlaceholder: "https://example.com/feed.xml",
    mediaFeedDefaultSources: "Default feeds",
    mediaFeedInvalidUrl: "Enter an RSS URL that starts with http or https.",
    mediaFeedLimit: "You can add up to {count} custom feeds.",
    mediaFeedSaveFailed: "Could not save this feed. Try again later.",
    mediaFeedLanguageZh: "Chinese",
    mediaFeedLanguageEn: "English",
    refreshBookmarkFolder: "Refresh current bookmark folder",
    chooseBookmarkFolder: "Choose bookmark folder",
    collapseSurface: "Collapse panel",
    back: "Back",
    chooseBookmarkFolderPrompt: "Choose a bookmark folder",
    historyTitle: "Recent browsing",
    openPortalSurface: "Open navigation hub",
    openHistorySurface: "Open recent browsing",
    recentFoldersSwitch: "Switch recent cards",
    recentFoldersPrevious: "Previous recent cards",
    recentFoldersNext: "Next recent cards",
    historyPreviousPage: "Previous recent page",
    historyNextPage: "Next recent page",
    refreshHistory: "Refresh history",
    pinnedTitle: "Pinned",
    recentTitle: "Recent timeline",
    quickSearchPlaceholder: "Search or enter URL",
    quickSearch: "Search",
    quickSearchLocal: "Open",
    quickSearchAggregate: "Aggregate search",
    quickSearchAiCommandHint: "Type /gpt, /claude, /gemini, /grok, /deepseek, /doubao, /kimi, or /glm to switch AI",
    quickSearchAiSelected: "Selected",
    quickSearchEngine: "Search mode",
    quickSearchWith: "Search with {engine}",
    quickSearchWithAi: "Send to {engine}",
    quickSearchWithPlatform: "Search on {platform}",
    quickSearchPlatformPlaceholder: "Search on {platform}",
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
    languageSettingsTitle: "Language",
    languageSettingsDescription: "Choose Wayleaf's display language",
    appearanceModeTitle: "Appearance",
    appearanceModeDescription: "Choose Wayleaf's appearance mode",
    appearanceModeHint: "Automatically switches light or dark mode from system settings.",
    themeModeSystem: "System",
    themeModeLight: "Light",
    themeModeDark: "Dark",
    presetPaletteTitle: "Colors",
    presetPaletteDescription: "Choose the default accent pair for light and dark modes",
    presetPaletteHint: "Used for buttons, links, selected states, and hints.",
    themePaletteSage: "Sage",
    themePaletteForest: "Forest",
    themePaletteAmber: "Amber",
    themePaletteSky: "Sky",
    themePalettePeach: "Coral",
    themePaletteNeutral: "Neutral",
    syncSettingsTitle: "Cloud sync",
    syncSettingsDescription: "Sync your settings across devices",
    syncSettingsReady: "Settings sync with your Chrome account",
    syncSettingsReadyDetail: "Install with the same Google account to restore; auto sync runs once daily while the extension is enabled.",
    syncSettingsUnavailable: "Sync is unavailable in this browser",
    syncSettingsUnavailableDetail: "Settings still stay on this device.",
    syncSettingsDone: "Written to sync storage",
    syncSettingsDoneDetail: "Chrome will distribute it to signed-in devices.",
    syncSettingsNow: "Sync now",
    syncSettingsAuto: "Auto sync",
    syncSettingsActionsLabel: "Sync method",
    searchSettingsDefaultTitle: "Basic search",
    searchSettingsDefaultDescription: "Configure the search entry used for regular queries",
    searchSettingsDefaultHint: "Wayleaf uses the basic search marked as default for regular keywords.",
    searchSettingsAiTitle: "AI search engines",
    searchSettingsAiDescription: "Edit built-in AI engine names, triggers, and search links",
    searchSettingsAiHint: "Separate triggers with spaces or commas, for example /gpt /chatgpt. Sign in to platforms that require login before first use.",
    searchSettingsPlatformTitle: "Platform search",
    searchSettingsPlatformDescription: "Use built-in prefixes to jump to common platform search results",
    searchSettingsPlatformHint: "Type yt query, x query, xhs query, ig query, threads query, dy query, or zhihu query to switch the search box to that platform. Sign in first when a platform requires login.",
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
    onboardingPrivacyTitle: "Local-first",
    onboardingPrivacyBody: "History, bookmarks, shortcuts, and theme settings stay in Chrome extension storage. Wayleaf has no backend account.",
    onboardingPermissionTitle: "Permissions power the page",
    onboardingPermissionBody: "history drives recent browsing, bookmarks powers selected folders, tabs and scripting open results and assist AI page handoff.",
    onboardingSyncTitle: "Settings try to follow Chrome sync",
    onboardingSyncBody: "The same Google account can restore preferences. If sync is unavailable, settings still stay on this device.",
    onboardingAiTitle: "AI commands have a fallback",
    onboardingAiBody: "Type /gpt, /claude, /gemini, /grok, /deepseek, /doubao, /kimi, or /glm to open and try filling a prompt. If the AI site needs login or changes, paste the saved prompt manually.",
    onboardingStartTitle: "Start with two actions",
    onboardingStartBody: "Add one favorite site, then choose a bookmark folder from the navigation hub. Theme and sync stay in Settings.",
    onboardingFeedbackTitle: "Report issues directly",
    onboardingFeedbackBody: "Include your browser, Wayleaf version, and the failed scenario so the issue is easy to reproduce.",
    onboardingFeedback: "Report issue",
    onboardingDone: "Start using",
    closeOnboarding: "Close guide",
    customPaletteTitle: "Custom theme",
    customPaletteDescription: "Customize Wayleaf's theme color pair",
    customPaletteHint: "Custom colors adapt automatically in light and dark modes.",
    lightAccent: "Primary (buttons / links / selected)",
    darkAccent: "Secondary (emphasis / hints)",
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
    mediaFeedMore: "More",
    mediaFeedNotInterested: "Not interested",
    mediaFeedNotInterestedDone: "Showing fewer like this",
    unpin: "Unpin",
    pin: "Pin",
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
    pinnedTitle: "固定",
    recentTitle: "最近",
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
    languageSettingsTitle: "言語",
    languageSettingsDescription: "Wayleaf の表示言語を選択",
    appearanceModeTitle: "外観",
    appearanceModeDescription: "Wayleaf の外観モードを選択",
    appearanceModeHint: "システム設定に合わせてライトまたはダークモードを自動で切り替えます。",
    themeModeSystem: "システム",
    themeModeLight: "ライト",
    themeModeDark: "ダーク",
    presetPaletteTitle: "カラー",
    presetPaletteDescription: "ライト/ダークモードの既定アクセント色ペアを選択",
    presetPaletteHint: "ボタン、リンク、選択状態、ヒントに使用されます。",
    themePaletteSage: "セージ",
    themePaletteForest: "フォレスト",
    themePaletteAmber: "アンバー",
    themePaletteSky: "スカイ",
    themePalettePeach: "コーラル",
    themePaletteNeutral: "ニュートラル",
    syncSettingsTitle: "クラウド同期",
    syncSettingsDescription: "デバイス間で設定を同期",
    syncSettingsReady: "Chrome アカウントで設定を同期します",
    syncSettingsReadyDetail: "同じ Google アカウントでインストールすると復元されます。拡張機能が有効な間は1日1回自動同期します。",
    syncSettingsUnavailable: "このブラウザでは同期を利用できません",
    syncSettingsUnavailableDetail: "設定はこのデバイスに保存されます。",
    syncSettingsDone: "同期ストレージに書き込みました",
    syncSettingsDoneDetail: "Chrome が同じアカウントのデバイスへ配信します。",
    syncSettingsNow: "今すぐ同期",
    syncSettingsAuto: "自動同期",
    syncSettingsActionsLabel: "同期方法",
    searchSettingsDefaultTitle: "基本検索",
    searchSettingsDefaultDescription: "通常のキーワードで使う検索先を設定",
    searchSettingsDefaultHint: "通常のキーワードでは、既定に設定した基本検索を優先して使います。",
    searchSettingsAiTitle: "AI 検索エンジン",
    searchSettingsAiDescription: "内蔵 AI エンジンの名前、トリガー、検索リンクを編集",
    searchSettingsAiHint: "トリガーはスペースまたはカンマで区切ります。例: /gpt /chatgpt。ログインが必要なプラットフォームは初回利用前にログインしてください。",
    searchSettingsPlatformTitle: "プラットフォーム検索",
    searchSettingsPlatformDescription: "内蔵プレフィックスで主要プラットフォームの検索結果へ移動",
    searchSettingsPlatformHint: "yt query、x query、xhs query、ig query、threads query、dy query、zhihu query と入力すると、そのプラットフォーム検索に切り替わります。ログインが必要な場合は先にログインしてください。",
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
    searchSettingsResetDone: "既定の検索設定に戻しました。",
    customPaletteTitle: "カスタムテーマ",
    customPaletteDescription: "Wayleaf のテーマ色ペアをカスタマイズ",
    customPaletteHint: "カスタム色はライト/ダークモードに自動で適応します。",
    lightAccent: "メイン（ボタン / リンク / 選択）",
    darkAccent: "サブ（強調 / ヒント）"
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
    pinnedTitle: "고정",
    recentTitle: "최근",
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
    languageSettingsTitle: "언어",
    languageSettingsDescription: "Wayleaf 표시 언어를 선택하세요",
    appearanceModeTitle: "모양",
    appearanceModeDescription: "Wayleaf의 모양 모드를 선택하세요",
    appearanceModeHint: "시스템 설정에 따라 라이트/다크 모드를 자동 전환합니다.",
    themeModeSystem: "시스템",
    themeModeLight: "라이트",
    themeModeDark: "다크",
    presetPaletteTitle: "색상",
    presetPaletteDescription: "라이트/다크 모드의 기본 강조색 조합을 선택하세요",
    presetPaletteHint: "버튼, 링크, 선택 상태, 안내 색상에 사용됩니다.",
    themePaletteSage: "세이지",
    themePaletteForest: "포레스트",
    themePaletteAmber: "앰버",
    themePaletteSky: "스카이",
    themePalettePeach: "코럴",
    themePaletteNeutral: "중립",
    syncSettingsTitle: "클라우드 동기화",
    syncSettingsDescription: "기기 간 설정 동기화",
    syncSettingsReady: "Chrome 계정과 설정이 동기화됩니다",
    syncSettingsReadyDetail: "같은 Google 계정으로 설치하면 복원됩니다. 확장 프로그램이 활성화된 동안 하루에 한 번 자동 동기화됩니다.",
    syncSettingsUnavailable: "이 브라우저에서는 동기화를 사용할 수 없습니다",
    syncSettingsUnavailableDetail: "설정은 이 기기에 계속 저장됩니다.",
    syncSettingsDone: "동기화 저장소에 기록했습니다",
    syncSettingsDoneDetail: "Chrome이 같은 계정의 기기로 배포합니다.",
    syncSettingsNow: "지금 동기화",
    syncSettingsAuto: "자동 동기화",
    syncSettingsActionsLabel: "동기화 방식",
    searchSettingsDefaultTitle: "기본 검색",
    searchSettingsDefaultDescription: "일반 키워드에 사용할 기본 검색 항목 설정",
    searchSettingsDefaultHint: "일반 키워드에는 기본으로 표시된 기본 검색을 우선 사용합니다.",
    searchSettingsAiTitle: "AI 검색 엔진",
    searchSettingsAiDescription: "내장 AI 엔진의 이름, 트리거, 검색 링크 편집",
    searchSettingsAiHint: "트리거는 공백 또는 쉼표로 구분하세요. 예: /gpt /chatgpt. 로그인이 필요한 플랫폼은 먼저 로그인하세요.",
    searchSettingsPlatformTitle: "플랫폼 검색",
    searchSettingsPlatformDescription: "내장 접두어로 주요 플랫폼 검색 결과 열기",
    searchSettingsPlatformHint: "yt query, x query, xhs query, ig query, threads query, dy query, zhihu query 형식으로 입력하면 해당 플랫폼 검색으로 전환됩니다. 로그인이 필요한 경우 먼저 로그인하세요.",
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
    searchSettingsResetDone: "기본 검색 설정을 복원했습니다.",
    customPaletteTitle: "사용자 지정 테마",
    customPaletteDescription: "Wayleaf의 테마 색상 조합 사용자 지정",
    customPaletteHint: "사용자 지정 색상은 라이트/다크 모드에 자동으로 맞춰집니다.",
    lightAccent: "기본색(버튼 / 링크 / 선택)",
    darkAccent: "보조색(강조 / 힌트)"
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
    pinnedTitle: "Fijados",
    recentTitle: "Recientes",
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
    languageSettingsTitle: "Idioma",
    languageSettingsDescription: "Elige el idioma de visualización de Wayleaf",
    appearanceModeTitle: "Apariencia",
    appearanceModeDescription: "Elige el modo de apariencia de Wayleaf",
    appearanceModeHint: "Cambia automáticamente entre modo claro u oscuro según el sistema.",
    themeModeSystem: "Sistema",
    themeModeLight: "Claro",
    themeModeDark: "Oscuro",
    presetPaletteTitle: "Colores",
    presetPaletteDescription: "Elige el par de acentos predeterminado para los modos claro y oscuro",
    presetPaletteHint: "Se usa en botones, enlaces, estados seleccionados y ayudas.",
    themePaletteSage: "Salvia",
    themePaletteForest: "Bosque",
    themePaletteAmber: "Ámbar",
    themePaletteSky: "Cielo",
    themePalettePeach: "Coral",
    themePaletteNeutral: "Neutro",
    syncSettingsTitle: "Sincronización en la nube",
    syncSettingsDescription: "Sincroniza tus ajustes entre dispositivos",
    syncSettingsReady: "Los ajustes se sincronizan con tu cuenta de Chrome",
    syncSettingsReadyDetail: "Instala con la misma cuenta de Google para restaurarlos; la sincronización automática se ejecuta una vez al día mientras la extensión esté activa.",
    syncSettingsUnavailable: "La sincronización no está disponible en este navegador",
    syncSettingsUnavailableDetail: "Los ajustes seguirán en este dispositivo.",
    syncSettingsDone: "Escrito en el almacenamiento de sincronización",
    syncSettingsDoneDetail: "Chrome lo distribuirá a los dispositivos de la misma cuenta.",
    syncSettingsNow: "Sincronizar",
    syncSettingsAuto: "Sincronización automática",
    syncSettingsActionsLabel: "Método de sincronización",
    searchSettingsDefaultTitle: "Búsqueda básica",
    searchSettingsDefaultDescription: "Configura el buscador para consultas normales",
    searchSettingsDefaultHint: "Wayleaf usa el buscador básico marcado como predeterminado para palabras clave normales.",
    searchSettingsAiTitle: "Motores de búsqueda de IA",
    searchSettingsAiDescription: "Edita nombres, activadores y enlaces de búsqueda de los motores de IA integrados",
    searchSettingsAiHint: "Separa los activadores con espacios o comas, por ejemplo /gpt /chatgpt. Inicia sesión antes en las plataformas que lo requieran.",
    searchSettingsPlatformTitle: "Búsqueda de plataformas",
    searchSettingsPlatformDescription: "Usa prefijos integrados para abrir resultados en plataformas comunes",
    searchSettingsPlatformHint: "Escribe yt query, x query, xhs query, ig query, threads query, dy query o zhihu query para cambiar la búsqueda a esa plataforma. Inicia sesión primero si hace falta.",
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
    searchSettingsResetDone: "Ajustes de búsqueda predeterminados restaurados.",
    customPaletteTitle: "Tema personalizado",
    customPaletteDescription: "Personaliza el par de colores del tema de Wayleaf",
    customPaletteHint: "Los colores personalizados se adaptan automáticamente a los modos claro y oscuro.",
    lightAccent: "Principal (botones / enlaces / selección)",
    darkAccent: "Secundario (énfasis / ayudas)"
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
    pinnedTitle: "Épinglés",
    recentTitle: "Récents",
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
    languageSettingsTitle: "Langue",
    languageSettingsDescription: "Choisissez la langue d'affichage de Wayleaf",
    appearanceModeTitle: "Apparence",
    appearanceModeDescription: "Choisir le mode d'apparence de Wayleaf",
    appearanceModeHint: "Bascule automatiquement entre clair et sombre selon le système.",
    themeModeSystem: "Système",
    themeModeLight: "Clair",
    themeModeDark: "Sombre",
    presetPaletteTitle: "Couleurs",
    presetPaletteDescription: "Choisir la paire d'accents par défaut pour les modes clair et sombre",
    presetPaletteHint: "Utilisée pour les boutons, liens, états sélectionnés et indications.",
    themePaletteSage: "Sauge",
    themePaletteForest: "Forêt",
    themePaletteAmber: "Ambre",
    themePaletteSky: "Ciel",
    themePalettePeach: "Corail",
    themePaletteNeutral: "Neutre",
    syncSettingsTitle: "Synchronisation cloud",
    syncSettingsDescription: "Synchroniser vos paramètres entre appareils",
    syncSettingsReady: "Les paramètres se synchronisent avec votre compte Chrome",
    syncSettingsReadyDetail: "Installez avec le même compte Google pour les restaurer ; la synchronisation automatique s'exécute une fois par jour quand l'extension est activée.",
    syncSettingsUnavailable: "La synchronisation n'est pas disponible dans ce navigateur",
    syncSettingsUnavailableDetail: "Les paramètres restent sur cet appareil.",
    syncSettingsDone: "Écrit dans le stockage synchronisé",
    syncSettingsDoneDetail: "Chrome le diffusera aux appareils du même compte.",
    syncSettingsNow: "Synchroniser",
    syncSettingsAuto: "Synchro auto",
    syncSettingsActionsLabel: "Méthode de synchronisation",
    searchSettingsDefaultTitle: "Recherche de base",
    searchSettingsDefaultDescription: "Configurer le moteur utilisé pour les requêtes normales",
    searchSettingsDefaultHint: "Wayleaf utilise le moteur de base marqué par défaut pour les mots-clés normaux.",
    searchSettingsAiTitle: "Moteurs de recherche IA",
    searchSettingsAiDescription: "Modifier les noms, déclencheurs et liens de recherche des moteurs IA intégrés",
    searchSettingsAiHint: "Séparez les déclencheurs par des espaces ou des virgules, par exemple /gpt /chatgpt. Connectez-vous d'abord aux plateformes qui l'exigent.",
    searchSettingsPlatformTitle: "Recherche de plateformes",
    searchSettingsPlatformDescription: "Utiliser des préfixes intégrés pour ouvrir les résultats de plateformes courantes",
    searchSettingsPlatformHint: "Saisissez yt query, x query, xhs query, ig query, threads query, dy query ou zhihu query pour basculer vers cette plateforme. Connectez-vous d'abord si nécessaire.",
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
    searchSettingsResetDone: "Paramètres de recherche par défaut restaurés.",
    customPaletteTitle: "Thème personnalisé",
    customPaletteDescription: "Personnaliser la paire de couleurs du thème de Wayleaf",
    customPaletteHint: "Les couleurs personnalisées s'adaptent automatiquement aux modes clair et sombre.",
    lightAccent: "Principal (boutons / liens / sélection)",
    darkAccent: "Secondaire (accent / indications)"
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
    pinnedTitle: "Angeheftet",
    recentTitle: "Zuletzt",
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
    languageSettingsTitle: "Sprache",
    languageSettingsDescription: "Anzeigesprache von Wayleaf auswählen",
    appearanceModeTitle: "Darstellung",
    appearanceModeDescription: "Darstellungsmodus von Wayleaf auswählen",
    appearanceModeHint: "Wechselt anhand der Systemeinstellung automatisch zwischen Hell- und Dunkelmodus.",
    themeModeSystem: "System",
    themeModeLight: "Hell",
    themeModeDark: "Dunkel",
    presetPaletteTitle: "Farben",
    presetPaletteDescription: "Standard-Akzentpaar für hellen und dunklen Modus auswählen",
    presetPaletteHint: "Für Buttons, Links, ausgewählte Zustände und Hinweise.",
    themePaletteSage: "Salbei",
    themePaletteForest: "Wald",
    themePaletteAmber: "Bernstein",
    themePaletteSky: "Himmel",
    themePalettePeach: "Koralle",
    themePaletteNeutral: "Neutral",
    syncSettingsTitle: "Cloud-Synchronisierung",
    syncSettingsDescription: "Einstellungen geräteübergreifend synchronisieren",
    syncSettingsReady: "Einstellungen werden mit deinem Chrome-Konto synchronisiert",
    syncSettingsReadyDetail: "Mit demselben Google-Konto installieren, um sie wiederherzustellen; die automatische Synchronisierung läuft einmal täglich, solange die Erweiterung aktiv ist.",
    syncSettingsUnavailable: "Synchronisierung ist in diesem Browser nicht verfügbar",
    syncSettingsUnavailableDetail: "Einstellungen bleiben auf diesem Gerät.",
    syncSettingsDone: "In den Sync-Speicher geschrieben",
    syncSettingsDoneDetail: "Chrome verteilt sie an Geräte mit demselben Konto.",
    syncSettingsNow: "Jetzt synchronisieren",
    syncSettingsAuto: "Automatisch",
    syncSettingsActionsLabel: "Synchronisierungsart",
    searchSettingsDefaultTitle: "Basissuche",
    searchSettingsDefaultDescription: "Suchziel für normale Suchanfragen konfigurieren",
    searchSettingsDefaultHint: "Wayleaf verwendet für normale Suchbegriffe die als Standard markierte Basissuche.",
    searchSettingsAiTitle: "KI-Suchmaschinen",
    searchSettingsAiDescription: "Namen, Auslöser und Suchlinks der integrierten KI-Engines bearbeiten",
    searchSettingsAiHint: "Auslöser mit Leerzeichen oder Kommas trennen, z. B. /gpt /chatgpt. Melde dich bei Plattformen mit Loginpflicht vor der ersten Nutzung an.",
    searchSettingsPlatformTitle: "Plattformsuche",
    searchSettingsPlatformDescription: "Mit integrierten Präfixen Suchergebnisse auf häufigen Plattformen öffnen",
    searchSettingsPlatformHint: "Gib yt query, x query, xhs query, ig query, threads query, dy query oder zhihu query ein, um die Suche auf diese Plattform umzuschalten. Melde dich bei Bedarf zuerst an.",
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
    searchSettingsResetDone: "Standard-Sucheinstellungen wiederhergestellt.",
    customPaletteTitle: "Benutzerdefiniertes Design",
    customPaletteDescription: "Farbpaar des Wayleaf-Designs anpassen",
    customPaletteHint: "Benutzerdefinierte Farben passen sich automatisch an hellen und dunklen Modus an.",
    lightAccent: "Primär (Buttons / Links / Auswahl)",
    darkAccent: "Sekundär (Akzent / Hinweise)"
  }
};
const LOCALE_COMPLETIONS = {
  ja: {
    topbarLabel: "トップバー",
    shellLabel: "Wayleaf ダッシュボード",
    mobilePortalTab: "ショートカット",
    mobileMediaTab: "メディア",
    mobileHistoryTab: "履歴",
    smartPortalTab: "スマート",
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
    portalCategories: "スマート分類",
    portalCategoriesExpand: "展開",
    portalCategoriesCollapse: "折りたたむ",
    portalCategory: "カテゴリ",
    portalNamePlaceholder: "例: Notion",
    portalUrlPlaceholder: "https://www.notion.so",
    mediaTitle: "メディアフィード",
    mediaFeedLoadingTitle: "フィードを読み込み中",
    mediaFeedLoadingBody: "最新記事がまもなく表示されます。",
    mediaFeedUpdated: "たった今更新",
    mediaFeedFailedTitle: "フィードを読み込めません",
    mediaFeedFailedBody: "フィード API から表示可能な項目が返りませんでした。後で更新してください。",
    mediaFeedEmptyTitle: "記事はありません",
    mediaFeedEmptyBody: "現在、表示できる記事はありません。",
    mediaFeedRefresh: "フィードを更新",
    mediaFeedMore: "もっと見る",
    mediaFeedAutoLoad: "スクロールしてさらに読み込む",
    mediaFeedAgentFocus: "Agent 注目",
    mediaFeedAgentStream: "次を追跡",
    mediaFeedTopicAi: "AI",
    mediaFeedTopicEngineering: "エンジニアリング",
    mediaFeedTopicBusiness: "ビジネス",
    mediaFeedTopicProduct: "プロダクト",
    mediaFeedTopicScience: "ディープテック",
    mediaFeedTopicConsumer: "コンシューマーテック",
    mediaFeedReasonAi: "モデル、エージェント、AI インフラのシグナル",
    mediaFeedReasonEngineering: "エンジニアリング、OSS、開発者エコシステムのシグナル",
    mediaFeedReasonBusiness: "企業、市場、ビジネスモデルの変化",
    mediaFeedReasonProduct: "新製品、ツール、生産性ワークフロー",
    mediaFeedReasonScience: "研究、ハードウェア、先端技術の進展",
    mediaFeedReasonConsumer: "デバイス、プラットフォーム、消費者向け技術の変化",
    mediaFeedReasonDefault: "ソース分散後の高価値項目",
    mediaFeedMetricHn: "{score} 点 · {comments} 件のコメント",
    mediaFeedMetricReplies: "{count} 件の返信",
    mediaFeedMetricReactions: "{reactions} 件の反応 · {comments} 件のコメント",
    mediaFeedAdd: "フィードを追加",
    mediaFeedTypeTabs: "フィード種別",
    mediaFeedTypeAll: "すべて",
    mediaFeedUrl: "RSS URL",
    mediaFeedLanguage: "言語",
    mediaFeedUrlPlaceholder: "https://example.com/feed.xml",
    mediaFeedDefaultSources: "既定のフィード",
    mediaFeedInvalidUrl: "http または https で始まる RSS URL を入力してください。",
    mediaFeedLimit: "カスタムフィードは最大 {count} 件まで追加できます。",
    mediaFeedSaveFailed: "このフィードを保存できませんでした。後で再試行してください。",
    mediaFeedLanguageZh: "中国語",
    mediaFeedLanguageEn: "英語",
    refreshBookmarkFolder: "現在のブックマークフォルダを更新",
    chooseBookmarkFolder: "ブックマークフォルダを選択",
    collapseSurface: "パネルを閉じる",
    openPortalSurface: "ナビゲーションハブを開く",
    openHistorySurface: "最近の閲覧を開く",
    recentFoldersSwitch: "最近カードを切り替え",
    recentFoldersPrevious: "前の最近カード",
    recentFoldersNext: "次の最近カード",
    historyPreviousPage: "前の最近ページ",
    historyNextPage: "次の最近ページ",
    refreshHistory: "履歴を更新",
    quickSearchPlaceholder: "検索または URL を入力",
    quickSearch: "検索",
    quickSearchLocal: "開く",
    quickSearchAiCommandHint: "/gpt、/claude、/gemini、/grok、/deepseek、/doubao、/kimi、/glm で AI を切り替え",
    quickSearchAiSelected: "選択中",
    quickSearchEngine: "検索モード",
    quickSearchWith: "{engine} で検索",
    quickSearchWithAi: "{engine} に送信",
    quickSearchWithPlatform: "{platform} で検索",
    quickSearchPlatformPlaceholder: "{platform} で検索",
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
    onboardingPrivacyTitle: "ローカル優先",
    onboardingPrivacyBody: "履歴、ブックマーク、ショートカット、テーマ設定は Chrome 拡張機能ストレージに保存されます。Wayleaf にはバックエンドアカウントがありません。",
    onboardingPermissionTitle: "権限はページ機能に使われます",
    onboardingPermissionBody: "history は最近の閲覧、bookmarks は選択フォルダ、tabs と scripting は検索結果を開き AI ページへの受け渡しを補助します。",
    onboardingSyncTitle: "設定は Chrome 同期に従います",
    onboardingSyncBody: "同じ Google アカウントで設定を復元できます。同期できない場合も設定はこのデバイスに保存されます。",
    onboardingAiTitle: "AI コマンドにはフォールバックがあります",
    onboardingAiBody: "/gpt、/claude、/gemini、/grok、/deepseek、/doubao、/kimi、/glm で AI ページを開きプロンプト入力を試みます。ログインやサイト変更が必要な場合は保存されたプロンプトを手動で貼り付けてください。",
    onboardingStartTitle: "2 つの操作から開始",
    onboardingStartBody: "お気に入りサイトを 1 つ追加し、ナビゲーションハブでブックマークフォルダを選びます。テーマと同期は設定で変更できます。",
    onboardingFeedbackTitle: "問題を直接報告",
    onboardingFeedbackBody: "ブラウザ、Wayleaf バージョン、失敗した場面を含めると再現しやすくなります。",
    onboardingFeedback: "問題を報告",
    onboardingDone: "使い始める",
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
    historySitePageMeta: "{count} 件の関連ページ",
    historyExpandPages: "{count} 件の関連ページを表示",
    historyCollapsePages: "関連ページを隠す",
    historyRelatedPages: "関連ページ",
    historyPrimaryPage: "最新ページ",
    historyJustNow: "たった今",
    historyMinutesAgo: "{count} 分前",
    historyHoursAgo: "{count} 時間前",
    historyReadFailed: "履歴を読み込めません。拡張機能に history 権限があるか確認してください。",
    deleteHistory: "{title} を削除",
    deleteHistoryFailed: "削除できませんでした。別の場所で変更された可能性があります。",
    noPinnedItems: "固定項目はまだありません。",
    noHistoryItems: "最近の閲覧はまだありません。",
    openSiteHome: "{name} のホームページを開く",
    openPage: "{title} を開く",
    mediaFeedNotInterested: "興味なし",
    mediaFeedNotInterestedDone: "類似項目を減らします",
    unpin: "固定解除",
    pin: "固定"
  },
  ko: {
    topbarLabel: "상단 바",
    shellLabel: "Wayleaf 대시보드",
    mobilePortalTab: "바로가기",
    mobileMediaTab: "미디어",
    mobileHistoryTab: "기록",
    smartPortalTab: "스마트",
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
    portalCategories: "스마트 분류",
    portalCategoriesExpand: "펼치기",
    portalCategoriesCollapse: "접기",
    portalCategory: "분류",
    portalNamePlaceholder: "예: Notion",
    portalUrlPlaceholder: "https://www.notion.so",
    mediaTitle: "미디어 피드",
    mediaFeedLoadingTitle: "피드 불러오는 중",
    mediaFeedLoadingBody: "최신 항목이 곧 표시됩니다.",
    mediaFeedUpdated: "방금 업데이트됨",
    mediaFeedFailedTitle: "피드를 불러올 수 없음",
    mediaFeedFailedBody: "피드 API가 표시 가능한 항목을 반환하지 않았습니다. 나중에 새로고침하세요.",
    mediaFeedEmptyTitle: "항목 없음",
    mediaFeedEmptyBody: "현재 표시할 항목이 없습니다.",
    mediaFeedRefresh: "피드 새로고침",
    mediaFeedMore: "더보기",
    mediaFeedAutoLoad: "스크롤하여 더 보기",
    mediaFeedAgentFocus: "Agent 초점",
    mediaFeedAgentStream: "다음 추적",
    mediaFeedTopicAi: "AI",
    mediaFeedTopicEngineering: "엔지니어링",
    mediaFeedTopicBusiness: "비즈니스",
    mediaFeedTopicProduct: "제품",
    mediaFeedTopicScience: "딥테크",
    mediaFeedTopicConsumer: "소비자 기술",
    mediaFeedReasonAi: "모델, 에이전트 또는 AI 인프라 신호",
    mediaFeedReasonEngineering: "엔지니어링, 오픈소스 또는 개발자 생태계 신호",
    mediaFeedReasonBusiness: "회사, 시장 또는 비즈니스 모델 변화",
    mediaFeedReasonProduct: "새 제품, 도구 또는 생산성 워크플로",
    mediaFeedReasonScience: "연구, 하드웨어 또는 첨단 기술 진전",
    mediaFeedReasonConsumer: "기기, 플랫폼 또는 소비자 기술 변화",
    mediaFeedReasonDefault: "다양한 소스 중 높은 가치 항목",
    mediaFeedMetricHn: "{score}점 · 댓글 {comments}개",
    mediaFeedMetricReplies: "답글 {count}개",
    mediaFeedMetricReactions: "반응 {reactions}개 · 댓글 {comments}개",
    mediaFeedAdd: "피드 추가",
    mediaFeedTypeTabs: "피드 유형",
    mediaFeedTypeAll: "전체",
    mediaFeedUrl: "RSS URL",
    mediaFeedLanguage: "언어",
    mediaFeedUrlPlaceholder: "https://example.com/feed.xml",
    mediaFeedDefaultSources: "기본 피드",
    mediaFeedInvalidUrl: "http 또는 https로 시작하는 RSS URL을 입력하세요.",
    mediaFeedLimit: "사용자 지정 피드는 최대 {count}개까지 추가할 수 있습니다.",
    mediaFeedSaveFailed: "이 피드를 저장할 수 없습니다. 나중에 다시 시도하세요.",
    mediaFeedLanguageZh: "중국어",
    mediaFeedLanguageEn: "영어",
    refreshBookmarkFolder: "현재 북마크 폴더 새로고침",
    chooseBookmarkFolder: "북마크 폴더 선택",
    collapseSurface: "패널 접기",
    openPortalSurface: "탐색 허브 열기",
    openHistorySurface: "최근 방문 열기",
    recentFoldersSwitch: "최근 카드 전환",
    recentFoldersPrevious: "이전 최근 카드",
    recentFoldersNext: "다음 최근 카드",
    historyPreviousPage: "이전 최근 페이지",
    historyNextPage: "다음 최근 페이지",
    refreshHistory: "기록 새로고침",
    quickSearchPlaceholder: "검색 또는 URL 입력",
    quickSearch: "검색",
    quickSearchLocal: "열기",
    quickSearchAiCommandHint: "/gpt, /claude, /gemini, /grok, /deepseek, /doubao, /kimi, /glm으로 AI 전환",
    quickSearchAiSelected: "선택됨",
    quickSearchEngine: "검색 모드",
    quickSearchWith: "{engine}로 검색",
    quickSearchWithAi: "{engine}에 보내기",
    quickSearchWithPlatform: "{platform}에서 검색",
    quickSearchPlatformPlaceholder: "{platform}에서 검색",
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
    onboardingPrivacyTitle: "로컬 우선",
    onboardingPrivacyBody: "기록, 북마크, 바로가기, 테마 설정은 Chrome 확장 프로그램 저장소에 보관됩니다. Wayleaf에는 백엔드 계정이 없습니다.",
    onboardingPermissionTitle: "권한은 페이지 기능에 사용됩니다",
    onboardingPermissionBody: "history는 최근 방문, bookmarks는 선택한 폴더, tabs와 scripting은 검색 결과 열기와 AI 페이지 전달을 돕습니다.",
    onboardingSyncTitle: "설정은 Chrome 동기화를 따릅니다",
    onboardingSyncBody: "같은 Google 계정으로 환경설정을 복원할 수 있습니다. 동기화를 사용할 수 없어도 설정은 이 기기에 남습니다.",
    onboardingAiTitle: "AI 명령에는 대체 경로가 있습니다",
    onboardingAiBody: "/gpt, /claude, /gemini, /grok, /deepseek, /doubao, /kimi, /glm으로 AI 페이지를 열고 프롬프트 입력을 시도합니다. 로그인이 필요하거나 사이트가 바뀌면 저장된 프롬프트를 직접 붙여넣으세요.",
    onboardingStartTitle: "두 가지 작업으로 시작",
    onboardingStartBody: "즐겨찾기 사이트 하나를 추가하고 탐색 허브에서 북마크 폴더를 선택하세요. 테마와 동기화는 설정에서 관리합니다.",
    onboardingFeedbackTitle: "문제 직접 신고",
    onboardingFeedbackBody: "브라우저, Wayleaf 버전, 실패 상황을 포함하면 재현이 쉬워집니다.",
    onboardingFeedback: "문제 신고",
    onboardingDone: "시작하기",
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
    historySitePageMeta: "관련 페이지 {count}개",
    historyExpandPages: "관련 페이지 {count}개 보기",
    historyCollapsePages: "관련 페이지 숨기기",
    historyRelatedPages: "관련 페이지",
    historyPrimaryPage: "최신 페이지",
    historyJustNow: "방금",
    historyMinutesAgo: "{count}분 전",
    historyHoursAgo: "{count}시간 전",
    historyReadFailed: "기록을 읽을 수 없습니다. 확장 프로그램에 history 권한이 있는지 확인하세요.",
    deleteHistory: "{title} 삭제",
    deleteHistoryFailed: "삭제할 수 없습니다. 다른 곳에서 변경되었을 수 있습니다.",
    noPinnedItems: "아직 고정된 항목이 없습니다.",
    noHistoryItems: "최근 방문 기록이 없습니다.",
    openSiteHome: "{name} 홈페이지 열기",
    openPage: "{title} 열기",
    mediaFeedNotInterested: "관심 없음",
    mediaFeedNotInterestedDone: "비슷한 항목 줄이기",
    unpin: "고정 해제",
    pin: "고정"
  },
  es: {
    topbarLabel: "Barra superior",
    shellLabel: "Panel de Wayleaf",
    mobilePortalTab: "Accesos",
    mobileMediaTab: "Medios",
    mobileHistoryTab: "Historial",
    smartPortalTab: "Inteligente",
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
    portalCategories: "Categorías inteligentes",
    portalCategoriesExpand: "Expandir",
    portalCategoriesCollapse: "Contraer",
    portalCategory: "Categoría",
    portalNamePlaceholder: "Ejemplo: Notion",
    portalUrlPlaceholder: "https://www.notion.so",
    mediaTitle: "Feed de medios",
    mediaFeedLoadingTitle: "Cargando feed",
    mediaFeedLoadingBody: "Las últimas historias aparecerán pronto.",
    mediaFeedUpdated: "Actualizado ahora",
    mediaFeedFailedTitle: "No se pudo cargar el feed",
    mediaFeedFailedBody: "La API del feed no devolvió elementos visibles. Actualiza más tarde.",
    mediaFeedEmptyTitle: "Sin historias",
    mediaFeedEmptyBody: "No hay historias visibles por ahora.",
    mediaFeedRefresh: "Actualizar feed",
    mediaFeedMore: "Más",
    mediaFeedAutoLoad: "Desplázate para ver más",
    mediaFeedAgentFocus: "Foco de Agent",
    mediaFeedAgentStream: "Seguimiento",
    mediaFeedTopicAi: "IA",
    mediaFeedTopicEngineering: "Ingeniería",
    mediaFeedTopicBusiness: "Negocios",
    mediaFeedTopicProduct: "Producto",
    mediaFeedTopicScience: "Tecnología profunda",
    mediaFeedTopicConsumer: "Tecnología de consumo",
    mediaFeedReasonAi: "Señal de modelos, agentes o infraestructura de IA",
    mediaFeedReasonEngineering: "Señal de ingeniería, código abierto o ecosistema de desarrolladores",
    mediaFeedReasonBusiness: "Cambio de empresa, mercado o modelo de negocio",
    mediaFeedReasonProduct: "Nuevo producto, herramienta o flujo de productividad",
    mediaFeedReasonScience: "Avance en investigación, hardware o tecnología frontera",
    mediaFeedReasonConsumer: "Cambio de dispositivo, plataforma o tecnología de consumo",
    mediaFeedReasonDefault: "Elemento de alto valor tras diversificar fuentes",
    mediaFeedMetricHn: "{score} puntos · {comments} comentarios",
    mediaFeedMetricReplies: "{count} respuestas",
    mediaFeedMetricReactions: "{reactions} reacciones · {comments} comentarios",
    mediaFeedAdd: "Agregar feed",
    mediaFeedTypeTabs: "Tipo de feed",
    mediaFeedTypeAll: "Todos",
    mediaFeedUrl: "URL RSS",
    mediaFeedLanguage: "Idioma",
    mediaFeedUrlPlaceholder: "https://example.com/feed.xml",
    mediaFeedDefaultSources: "Feeds predeterminados",
    mediaFeedInvalidUrl: "Introduce una URL RSS que empiece con http o https.",
    mediaFeedLimit: "Puedes agregar hasta {count} feeds personalizados.",
    mediaFeedSaveFailed: "No se pudo guardar este feed. Intenta de nuevo más tarde.",
    mediaFeedLanguageZh: "Chino",
    mediaFeedLanguageEn: "Inglés",
    refreshBookmarkFolder: "Actualizar carpeta de marcadores actual",
    chooseBookmarkFolder: "Elegir carpeta de marcadores",
    collapseSurface: "Contraer panel",
    openPortalSurface: "Abrir centro de navegación",
    openHistorySurface: "Abrir recientes",
    recentFoldersSwitch: "Cambiar tarjetas recientes",
    recentFoldersPrevious: "Tarjetas recientes anteriores",
    recentFoldersNext: "Tarjetas recientes siguientes",
    historyPreviousPage: "Página reciente anterior",
    historyNextPage: "Página reciente siguiente",
    refreshHistory: "Actualizar historial",
    quickSearchPlaceholder: "Buscar o escribir URL",
    quickSearch: "Buscar",
    quickSearchLocal: "Abrir",
    quickSearchAiCommandHint: "Escribe /gpt, /claude, /gemini, /grok, /deepseek, /doubao, /kimi o /glm para cambiar de IA",
    quickSearchAiSelected: "Seleccionado",
    quickSearchEngine: "Modo de búsqueda",
    quickSearchWith: "Buscar con {engine}",
    quickSearchWithAi: "Enviar a {engine}",
    quickSearchWithPlatform: "Buscar en {platform}",
    quickSearchPlatformPlaceholder: "Buscar en {platform}",
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
    onboardingPrivacyTitle: "Local primero",
    onboardingPrivacyBody: "Historial, marcadores, accesos y ajustes de tema permanecen en el almacenamiento de la extensión de Chrome. Wayleaf no tiene cuenta backend.",
    onboardingPermissionTitle: "Los permisos activan la página",
    onboardingPermissionBody: "history impulsa recientes, bookmarks usa carpetas elegidas, y tabs más scripting abren resultados y ayudan a entregar prompts a páginas de IA.",
    onboardingSyncTitle: "Los ajustes siguen Chrome Sync",
    onboardingSyncBody: "La misma cuenta de Google puede restaurar preferencias. Si la sincronización no está disponible, los ajustes quedan en este dispositivo.",
    onboardingAiTitle: "Los comandos de IA tienen respaldo",
    onboardingAiBody: "Usa /gpt, /claude, /gemini, /grok, /deepseek, /doubao, /kimi o /glm para abrir la página de IA e intentar completar el prompt. Si requiere inicio de sesión o cambia, pega el prompt guardado manualmente.",
    onboardingStartTitle: "Empieza con dos acciones",
    onboardingStartBody: "Agrega un sitio favorito y luego elige una carpeta de marcadores desde el centro de navegación. Tema y sincronización están en Configuración.",
    onboardingFeedbackTitle: "Informa problemas directamente",
    onboardingFeedbackBody: "Incluye navegador, versión de Wayleaf y escenario fallido para facilitar la reproducción.",
    onboardingFeedback: "Informar problema",
    onboardingDone: "Empezar",
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
    historySitePageMeta: "{count} páginas relacionadas",
    historyExpandPages: "Mostrar {count} páginas relacionadas",
    historyCollapsePages: "Ocultar páginas relacionadas",
    historyRelatedPages: "Páginas relacionadas",
    historyPrimaryPage: "Página más reciente",
    historyJustNow: "Ahora mismo",
    historyMinutesAgo: "Hace {count} min",
    historyHoursAgo: "Hace {count} h",
    historyReadFailed: "No se pudo leer el historial. Comprueba el permiso history.",
    deleteHistory: "Eliminar {title}",
    deleteHistoryFailed: "No se pudo eliminar. Puede haber cambiado en otro lugar.",
    noPinnedItems: "Aún no hay elementos fijados.",
    noHistoryItems: "Aún no hay navegación reciente.",
    openSiteHome: "Abrir inicio de {name}",
    openPage: "Abrir {title}",
    mediaFeedNotInterested: "No me interesa",
    mediaFeedNotInterestedDone: "Mostrando menos como esto",
    unpin: "Desfijar",
    pin: "Fijar"
  },
  fr: {
    topbarLabel: "Barre supérieure",
    shellLabel: "Tableau de bord Wayleaf",
    mobilePortalTab: "Raccourcis",
    mobileMediaTab: "Médias",
    mobileHistoryTab: "Historique",
    smartPortalTab: "Intelligent",
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
    portalCategories: "Catégories intelligentes",
    portalCategoriesExpand: "Développer",
    portalCategoriesCollapse: "Réduire",
    portalCategory: "Catégorie",
    portalNamePlaceholder: "Exemple : Notion",
    portalUrlPlaceholder: "https://www.notion.so",
    mediaTitle: "Flux média",
    mediaFeedLoadingTitle: "Chargement du flux",
    mediaFeedLoadingBody: "Les derniers articles apparaîtront bientôt.",
    mediaFeedUpdated: "Mis à jour à l'instant",
    mediaFeedFailedTitle: "Impossible de charger le flux",
    mediaFeedFailedBody: "L'API du flux n'a retourné aucun élément affichable. Actualisez plus tard.",
    mediaFeedEmptyTitle: "Aucun article",
    mediaFeedEmptyBody: "Aucun article affichable pour le moment.",
    mediaFeedRefresh: "Actualiser le flux",
    mediaFeedMore: "Plus",
    mediaFeedAutoLoad: "Faire défiler pour plus",
    mediaFeedAgentFocus: "Focus Agent",
    mediaFeedAgentStream: "Suivi suivant",
    mediaFeedTopicAi: "IA",
    mediaFeedTopicEngineering: "Ingénierie",
    mediaFeedTopicBusiness: "Business",
    mediaFeedTopicProduct: "Produit",
    mediaFeedTopicScience: "Deep tech",
    mediaFeedTopicConsumer: "Tech grand public",
    mediaFeedReasonAi: "Signal de modèle, agent ou infrastructure IA",
    mediaFeedReasonEngineering: "Signal d'ingénierie, open source ou écosystème développeur",
    mediaFeedReasonBusiness: "Changement d'entreprise, de marché ou de modèle économique",
    mediaFeedReasonProduct: "Nouveau produit, outil ou flux de productivité",
    mediaFeedReasonScience: "Progrès de recherche, matériel ou technologie frontière",
    mediaFeedReasonConsumer: "Changement d'appareil, plateforme ou technologie grand public",
    mediaFeedReasonDefault: "Élément à forte valeur après diversification des sources",
    mediaFeedMetricHn: "{score} points · {comments} commentaires",
    mediaFeedMetricReplies: "{count} réponses",
    mediaFeedMetricReactions: "{reactions} réactions · {comments} commentaires",
    mediaFeedAdd: "Ajouter un flux",
    mediaFeedTypeTabs: "Type de flux",
    mediaFeedTypeAll: "Tous",
    mediaFeedUrl: "URL RSS",
    mediaFeedLanguage: "Langue",
    mediaFeedUrlPlaceholder: "https://example.com/feed.xml",
    mediaFeedDefaultSources: "Flux par défaut",
    mediaFeedInvalidUrl: "Saisissez une URL RSS commençant par http ou https.",
    mediaFeedLimit: "Vous pouvez ajouter jusqu'à {count} flux personnalisés.",
    mediaFeedSaveFailed: "Impossible d'enregistrer ce flux. Réessayez plus tard.",
    mediaFeedLanguageZh: "Chinois",
    mediaFeedLanguageEn: "Anglais",
    refreshBookmarkFolder: "Actualiser le dossier de favoris actuel",
    chooseBookmarkFolder: "Choisir un dossier de favoris",
    collapseSurface: "Réduire le panneau",
    openPortalSurface: "Ouvrir le centre de navigation",
    openHistorySurface: "Ouvrir la navigation récente",
    recentFoldersSwitch: "Changer les cartes récentes",
    recentFoldersPrevious: "Cartes récentes précédentes",
    recentFoldersNext: "Cartes récentes suivantes",
    historyPreviousPage: "Page récente précédente",
    historyNextPage: "Page récente suivante",
    refreshHistory: "Actualiser l'historique",
    quickSearchPlaceholder: "Rechercher ou saisir une URL",
    quickSearch: "Rechercher",
    quickSearchLocal: "Ouvrir",
    quickSearchAiCommandHint: "Tapez /gpt, /claude, /gemini, /grok, /deepseek, /doubao, /kimi ou /glm pour changer d'IA",
    quickSearchAiSelected: "Sélectionné",
    quickSearchEngine: "Mode de recherche",
    quickSearchWith: "Rechercher avec {engine}",
    quickSearchWithAi: "Envoyer à {engine}",
    quickSearchWithPlatform: "Rechercher sur {platform}",
    quickSearchPlatformPlaceholder: "Rechercher sur {platform}",
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
    onboardingPrivacyTitle: "Local d'abord",
    onboardingPrivacyBody: "Historique, favoris, raccourcis et thème restent dans le stockage de l'extension Chrome. Wayleaf n'a pas de compte backend.",
    onboardingPermissionTitle: "Les autorisations alimentent la page",
    onboardingPermissionBody: "history gère la navigation récente, bookmarks les dossiers choisis, tabs et scripting ouvrent les résultats et aident le passage vers les pages IA.",
    onboardingSyncTitle: "Les paramètres suivent Chrome Sync",
    onboardingSyncBody: "Le même compte Google peut restaurer les préférences. Si la synchronisation est indisponible, les paramètres restent sur cet appareil.",
    onboardingAiTitle: "Les commandes IA ont un repli",
    onboardingAiBody: "Utilisez /gpt, /claude, /gemini, /grok, /deepseek, /doubao, /kimi ou /glm pour ouvrir la page IA et tenter de remplir le prompt. Si une connexion est requise ou si le site change, collez le prompt enregistré manuellement.",
    onboardingStartTitle: "Commencer par deux actions",
    onboardingStartBody: "Ajoutez un site favori, puis choisissez un dossier de favoris dans le centre de navigation. Thème et synchronisation sont dans Paramètres.",
    onboardingFeedbackTitle: "Signaler les problèmes directement",
    onboardingFeedbackBody: "Incluez navigateur, version de Wayleaf et scénario en échec pour faciliter la reproduction.",
    onboardingFeedback: "Signaler un problème",
    onboardingDone: "Commencer",
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
    historySitePageMeta: "{count} pages associées",
    historyExpandPages: "Afficher {count} pages associées",
    historyCollapsePages: "Masquer les pages associées",
    historyRelatedPages: "Pages associées",
    historyPrimaryPage: "Dernière page",
    historyJustNow: "À l'instant",
    historyMinutesAgo: "Il y a {count} min",
    historyHoursAgo: "Il y a {count} h",
    historyReadFailed: "Impossible de lire l'historique. Vérifiez l'autorisation history.",
    deleteHistory: "Supprimer {title}",
    deleteHistoryFailed: "Impossible de supprimer. Il a peut-être changé ailleurs.",
    noPinnedItems: "Aucun élément épinglé pour l'instant.",
    noHistoryItems: "Aucune navigation récente.",
    openSiteHome: "Ouvrir l'accueil de {name}",
    openPage: "Ouvrir {title}",
    mediaFeedNotInterested: "Pas intéressé",
    mediaFeedNotInterestedDone: "Moins d'éléments similaires",
    unpin: "Désépingler",
    pin: "Épingler"
  },
  de: {
    topbarLabel: "Obere Leiste",
    shellLabel: "Wayleaf-Dashboard",
    mobilePortalTab: "Kurzbefehle",
    mobileMediaTab: "Medien",
    mobileHistoryTab: "Verlauf",
    smartPortalTab: "Smart",
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
    portalCategories: "Smarte Kategorien",
    portalCategoriesExpand: "Erweitern",
    portalCategoriesCollapse: "Reduzieren",
    portalCategory: "Kategorie",
    portalNamePlaceholder: "Beispiel: Notion",
    portalUrlPlaceholder: "https://www.notion.so",
    mediaTitle: "Medienfeed",
    mediaFeedLoadingTitle: "Feed wird geladen",
    mediaFeedLoadingBody: "Aktuelle Beiträge erscheinen gleich.",
    mediaFeedUpdated: "Gerade aktualisiert",
    mediaFeedFailedTitle: "Feed konnte nicht geladen werden",
    mediaFeedFailedBody: "Die Feed-API lieferte keine anzeigbaren Einträge. Später aktualisieren.",
    mediaFeedEmptyTitle: "Keine Beiträge",
    mediaFeedEmptyBody: "Derzeit gibt es keine anzeigbaren Beiträge.",
    mediaFeedRefresh: "Feed aktualisieren",
    mediaFeedMore: "Mehr",
    mediaFeedAutoLoad: "Scrollen für mehr",
    mediaFeedAgentFocus: "Agent-Fokus",
    mediaFeedAgentStream: "Weiter verfolgen",
    mediaFeedTopicAi: "KI",
    mediaFeedTopicEngineering: "Engineering",
    mediaFeedTopicBusiness: "Business",
    mediaFeedTopicProduct: "Produkt",
    mediaFeedTopicScience: "Deep Tech",
    mediaFeedTopicConsumer: "Consumer Tech",
    mediaFeedReasonAi: "Signal zu Modell, Agent oder KI-Infrastruktur",
    mediaFeedReasonEngineering: "Signal zu Engineering, Open Source oder Entwicklerökosystem",
    mediaFeedReasonBusiness: "Änderung bei Unternehmen, Markt oder Geschäftsmodell",
    mediaFeedReasonProduct: "Neues Produkt, Tool oder Produktivitäts-Workflow",
    mediaFeedReasonScience: "Fortschritt bei Forschung, Hardware oder Frontier-Technologie",
    mediaFeedReasonConsumer: "Änderung bei Gerät, Plattform oder Consumer-Technologie",
    mediaFeedReasonDefault: "Hochwertiger Eintrag nach Quellenstreuung",
    mediaFeedMetricHn: "{score} Punkte · {comments} Kommentare",
    mediaFeedMetricReplies: "{count} Antworten",
    mediaFeedMetricReactions: "{reactions} Reaktionen · {comments} Kommentare",
    mediaFeedAdd: "Feed hinzufügen",
    mediaFeedTypeTabs: "Feed-Typ",
    mediaFeedTypeAll: "Alle",
    mediaFeedUrl: "RSS-URL",
    mediaFeedLanguage: "Sprache",
    mediaFeedUrlPlaceholder: "https://example.com/feed.xml",
    mediaFeedDefaultSources: "Standard-Feeds",
    mediaFeedInvalidUrl: "Gib eine RSS-URL ein, die mit http oder https beginnt.",
    mediaFeedLimit: "Du kannst bis zu {count} eigene Feeds hinzufügen.",
    mediaFeedSaveFailed: "Dieser Feed konnte nicht gespeichert werden. Später erneut versuchen.",
    mediaFeedLanguageZh: "Chinesisch",
    mediaFeedLanguageEn: "Englisch",
    refreshBookmarkFolder: "Aktuellen Lesezeichenordner aktualisieren",
    chooseBookmarkFolder: "Lesezeichenordner auswählen",
    collapseSurface: "Panel einklappen",
    openPortalSurface: "Navigationszentrale öffnen",
    openHistorySurface: "Zuletzt besucht öffnen",
    recentFoldersSwitch: "Aktuelle Karten wechseln",
    recentFoldersPrevious: "Vorherige aktuelle Karten",
    recentFoldersNext: "Nächste aktuelle Karten",
    historyPreviousPage: "Vorherige aktuelle Seite",
    historyNextPage: "Nächste aktuelle Seite",
    refreshHistory: "Verlauf aktualisieren",
    quickSearchPlaceholder: "Suchen oder URL eingeben",
    quickSearch: "Suchen",
    quickSearchLocal: "Öffnen",
    quickSearchAiCommandHint: "Mit /gpt, /claude, /gemini, /grok, /deepseek, /doubao, /kimi oder /glm die KI wechseln",
    quickSearchAiSelected: "Ausgewählt",
    quickSearchEngine: "Suchmodus",
    quickSearchWith: "Mit {engine} suchen",
    quickSearchWithAi: "An {engine} senden",
    quickSearchWithPlatform: "Auf {platform} suchen",
    quickSearchPlatformPlaceholder: "Auf {platform} suchen",
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
    onboardingPrivacyTitle: "Lokal zuerst",
    onboardingPrivacyBody: "Verlauf, Lesezeichen, Kurzbefehle und Design bleiben im Speicher der Chrome-Erweiterung. Wayleaf hat kein Backend-Konto.",
    onboardingPermissionTitle: "Berechtigungen treiben die Seite an",
    onboardingPermissionBody: "history steuert zuletzt besuchte Seiten, bookmarks gewählte Ordner, tabs und scripting öffnen Ergebnisse und helfen bei der KI-Übergabe.",
    onboardingSyncTitle: "Einstellungen folgen Chrome Sync",
    onboardingSyncBody: "Dasselbe Google-Konto kann Einstellungen wiederherstellen. Wenn Sync nicht verfügbar ist, bleiben Einstellungen auf diesem Gerät.",
    onboardingAiTitle: "KI-Befehle haben einen Ausweichweg",
    onboardingAiBody: "Nutze /gpt, /claude, /gemini, /grok, /deepseek, /doubao, /kimi oder /glm, um die KI-Seite zu öffnen und den Prompt einzufügen. Wenn Login nötig ist oder sich die Seite ändert, füge den gespeicherten Prompt manuell ein.",
    onboardingStartTitle: "Mit zwei Aktionen starten",
    onboardingStartBody: "Füge eine Lieblingswebsite hinzu und wähle dann einen Lesezeichenordner in der Navigationszentrale. Design und Sync bleiben in den Einstellungen.",
    onboardingFeedbackTitle: "Probleme direkt melden",
    onboardingFeedbackBody: "Gib Browser, Wayleaf-Version und das fehlgeschlagene Szenario an, damit es leicht reproduzierbar ist.",
    onboardingFeedback: "Problem melden",
    onboardingDone: "Loslegen",
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
    historySitePageMeta: "{count} zugehörige Seiten",
    historyExpandPages: "{count} zugehörige Seiten anzeigen",
    historyCollapsePages: "Zugehörige Seiten ausblenden",
    historyRelatedPages: "Zugehörige Seiten",
    historyPrimaryPage: "Neueste Seite",
    historyJustNow: "Gerade eben",
    historyMinutesAgo: "Vor {count} Min.",
    historyHoursAgo: "Vor {count} Std.",
    historyReadFailed: "Verlauf konnte nicht gelesen werden. Prüfe die history-Berechtigung.",
    deleteHistory: "{title} entfernen",
    deleteHistoryFailed: "Konnte nicht entfernt werden. Es wurde möglicherweise anderswo geändert.",
    noPinnedItems: "Noch keine angehefteten Einträge.",
    noHistoryItems: "Noch keine zuletzt besuchten Seiten.",
    openSiteHome: "{name}-Startseite öffnen",
    openPage: "{title} öffnen",
    mediaFeedNotInterested: "Nicht interessiert",
    mediaFeedNotInterestedDone: "Weniger Ähnliches anzeigen",
    unpin: "Lösen",
    pin: "Anheften"
  }
};
for (const [locale, messages] of Object.entries(LOCALE_COMPLETIONS)) {
  Object.assign(MESSAGES[locale], messages);
}
let LOCALE = resolveLocale();
let MEDIA_FEED_LOCALE_LANGUAGE = mediaFeedLanguageForLocale(LOCALE);

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
const pinnedGrid = document.querySelector("#pinnedGrid");
const historyGrid = document.querySelector("#historyGrid");
const recentHistoryFolders = document.querySelector("#recentHistoryFolders");
const recentFoldersPreviousButton = document.querySelector("#recentFoldersPreviousButton");
const recentFoldersNextButton = document.querySelector("#recentFoldersNextButton");
const refreshHistoryButton = document.querySelector("#refreshHistoryButton");
const mediaFeedList = document.querySelector("#mediaFeedList");
const mediaFeedState = document.querySelector("#mediaFeedState");
const mediaFeedUpdated = document.querySelector("#mediaFeedUpdated");
const refreshMediaFeedButton = document.querySelector("#refreshMediaFeedButton");
const toggleMediaFeedFormButton = document.querySelector("#toggleMediaFeedFormButton");
const mediaFeedForm = document.querySelector("#mediaFeedForm");
const mediaFeedUrlInput = document.querySelector("#mediaFeedUrlInput");
const mediaFeedLanguageSelect = document.querySelector("#mediaFeedLanguageSelect");
const mediaFeedDefaultList = document.querySelector("#mediaFeedDefaultList");
const mediaFeedFormError = document.querySelector("#mediaFeedFormError");
const cancelMediaFeedButton = document.querySelector("#cancelMediaFeedButton");
const mediaFeedTypeTabs = document.querySelector("#mediaFeedTypeTabs");
const mediaFeedTypeButtons = [...document.querySelectorAll("[data-media-feed-type]")];
const siteCardTemplate = document.querySelector("#siteCardTemplate");
const settingsButton = document.querySelector("#settingsButton");
const settingsShell = document.querySelector("#settingsShell");
const settingsPanel = document.querySelector("#settingsPanel");
const closeSettingsButton = document.querySelector("#closeSettingsButton");
const settingsTabsShell = document.querySelector(".settings-tabs-shell");
const settingsTabButtons = [...document.querySelectorAll("[data-settings-tab]")];
const settingsTabPanels = [...document.querySelectorAll("[data-settings-panel]")];
const languagePicker = document.querySelector("#languagePicker");
const languageTrigger = document.querySelector("#languageTrigger");
const languageCurrent = document.querySelector("#languageCurrent");
const languageOptions = document.querySelector("#languageOptions");
const palettePresetGrid = document.querySelector("#palettePresetGrid");
const syncSettingsRow = document.querySelector("#syncSettingsRow");
const syncSettingsStatus = document.querySelector("#syncSettingsStatus");
const syncSettingsDetail = document.querySelector("#syncSettingsDetail");
const syncSettingsNowButton = document.querySelector("#syncSettingsNowButton");
const syncSettingsAutoButton = document.querySelector("#syncSettingsAutoButton");
const searchSettingsForm = document.querySelector("#searchSettingsForm");
const basicSearchEngineList = document.querySelector("#basicSearchEngineList");
const aiEngineSettingsList = document.querySelector("#aiEngineSettingsList");
const platformSearchSettingsList = document.querySelector("#platformSearchSettingsList");
const resetSearchSettingsButton = document.querySelector("#resetSearchSettingsButton");
const searchSettingsStatus = document.querySelector("#searchSettingsStatus");
const lightAccentInput = document.querySelector("#lightAccentInput");
const lightAccentStrongInput = document.querySelector("#lightAccentStrongInput");
const darkAccentInput = document.querySelector("#darkAccentInput");
const darkAccentStrongInput = document.querySelector("#darkAccentStrongInput");
const lightAccentValue = document.querySelector("#lightAccentValue");
const darkAccentValue = document.querySelector("#darkAccentValue");
const quickSearchForm = document.querySelector("#quickSearchForm");
const quickSearchInput = document.querySelector("#quickSearchInput");
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
const onboardingCloseButton = document.querySelector("#onboardingCloseButton");
const onboardingDoneButton = document.querySelector("#onboardingDoneButton");
const onboardingFeedbackLink = document.querySelector("#onboardingFeedbackLink");
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
let aiModeExitTimer = 0;
let portalCategoryState = {};
let activePortalView = "smart";
let activeThemeMode = DEFAULT_THEME_MODE;
let activeLanguagePreference = "system";
let activeResolvedTheme = "";
let activeThemePalette = DEFAULT_THEME_PALETTE;
let activeCustomThemeColors = { ...DEFAULT_CUSTOM_THEME_COLORS };
let themeBackgroundTransitionTimer = 0;
let themeBackgroundTransitionSequence = 0;
let systemThemeQuery = null;
let settingsPanelCloseTimer = 0;
let activeMediaFeedRequestId = 0;
let activeMediaFeedType = "all";
let latestMediaFeedItems = [];
let visibleMediaFeedItems = [];
let mediaFeedVisibleCount = MEDIA_FEED_INITIAL_ITEMS;
let mediaFeedObserver = null;
let mediaFeedRefreshSeed = 0;
let activeMediaFeedFeedback = normalizeMediaFeedFeedback();
let activeMediaFeedActionMenu = null;
let pendingRecentPreviousKeys = null;
let latestRecentFolderGroups = [];
let recentFolderPageIndex = 0;
let activeRecentFolderPageSwitchAnimation = null;
let favoriteSitesHydrated = false;
let availableSiteIconFiles = new Set();
let siteIconIndexLoaded = false;
const whiteSvgIconDataUrlCache = new Map();
const siteIconDiscoveryCache = new Map();
const mediaFeedLoadMoreSentinel = document.createElement("div");
mediaFeedLoadMoreSentinel.className = "media-feed-load-more";
mediaFeedLoadMoreSentinel.setAttribute("role", "status");

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
  const storage = storageAreaForKey();
  return storage ? storage.get(defaults) : { ...defaults };
}

async function setStoredValues(values = {}) {
  const storage = storageAreaForKey();
  if (storage) {
    await storage.set(values);
  }
}

function readFirstPaintCache() {
  try {
    const cache = JSON.parse(localStorage.getItem(FIRST_PAINT_CACHE_STORAGE_KEY) || "{}");
    return cache?.version === FIRST_PAINT_CACHE_VERSION
      && cache.extensionVersion === firstPaintExtensionVersion()
      ? cache
      : {};
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
      extensionVersion: firstPaintExtensionVersion()
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
    generic: Boolean(value.generic)
  };
}

function restoreFirstPaintIconRender(icon, site, render) {
  storeIconSiteContext(icon, site);
  icon.dataset.siteKey = firstPaintIconCacheKey(site);
  if (render.source) {
    icon.dataset.iconSource = render.source;
  }
  icon.classList.toggle("site-icon-generic-fallback", render.generic);
  applyIconTile(icon, render.tile, { light: render.tileLight, dark: render.tileDark }, render.local);
  icon.dataset.iconCacheHydrated = "true";
  icon.addEventListener("error", () => {
    if (icon.dataset.iconCacheHydrated === "true") {
      delete icon.dataset.iconCacheHydrated;
      applySiteIcon(icon, site);
    }
  }, { once: true });
  icon.src = render.src;
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
  iconRenders[key] = {
    ...(iconRenders[key] || {}),
    source: icon.dataset.iconSource && icon.dataset.iconSource !== src
      ? icon.dataset.iconSource
      : (iconRenders[key]?.source || ""),
    [mode]: {
      src,
      tile: icon.dataset.iconTile || "plain",
      tileLight,
      tileDark,
      local: icon.classList.contains("site-icon-local"),
      generic: icon.classList.contains("site-icon-generic-fallback"),
      updatedAt: Date.now()
    }
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
      Object.keys(missingSyncValues).length ? chrome.storage.sync.set(missingSyncValues) : Promise.resolve()
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
  MEDIA_FEED_LOCALE_LANGUAGE = mediaFeedLanguageForLocale(LOCALE);
}

function t(key, values = {}) {
  const template = messageTemplate(key);
  return template.replace(/\{(\w+)\}/g, (_, valueKey) => String(values[valueKey] ?? ""));
}

function mediaFeedLanguageForLocale(locale) {
  return String(locale || "").toLowerCase().startsWith("zh") ? "zh" : "en";
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
  if (MESSAGES[LOCALE]?.[key]) {
    return MESSAGES[LOCALE][key];
  }
  return MESSAGES[DEFAULT_LOCALE][key] || MESSAGES.en[key] || key;
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
  applyMediaFeedTypeLocale();
  document.querySelector("#history-title").textContent = t("historyTitle");
  document.querySelector("#pinned-title").textContent = t("pinnedTitle");
  document.querySelector("#recent-title").textContent = t("recentTitle");
  setMobileTabLabel("portalPanel", t("mobilePortalTab"));

  setButtonLabel(togglePortalFormButton, t("addPortal"));
  setButtonLabel(refreshBookmarkFolderButton, t("refreshBookmarkFolder"));
  setButtonLabel(bookmarkFavoriteAddButton, t("addFavoriteSite"));
  setButtonLabel(chooseBookmarkFolderButton, t("chooseBookmarkFolder"));
  setButtonLabel(refreshHistoryButton, t("refreshHistory"));
  setButtonLabel(settingsButton, t("openSettings"));
  setButtonLabel(closeSettingsButton, t("settingsBackHome"));
  settingsShell?.setAttribute("aria-label", t("settingsTitle"));
  setButtonLabel(favoriteAddButton, t("addFavoriteSite"));
  setStaticButtonIcons();
  applySettingsLocale();
  quickSearchInput.placeholder = t("quickSearchPlaceholder");
  quickSearchInput.setAttribute("aria-label", t("quickSearchPlaceholder"));
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
  applyMediaFeedFormLocale();
  setButtonLabel(closeBookmarkPickerButton, t("back"));
  bookmarkPickerTitle.textContent = t("chooseBookmarkFolderPrompt");
}

function applyOnboardingLocale() {
  if (!onboardingGuide) {
    return;
  }
  document.querySelector("#onboardingKicker").textContent = t("onboardingKicker");
  document.querySelector("#onboardingTitle").textContent = t("onboardingTitle");
  document.querySelector("#onboardingIntro").textContent = t("onboardingIntro");
  document.querySelector("#onboardingPrivacyTitle").textContent = t("onboardingPrivacyTitle");
  document.querySelector("#onboardingPrivacyBody").textContent = t("onboardingPrivacyBody");
  document.querySelector("#onboardingPermissionTitle").textContent = t("onboardingPermissionTitle");
  document.querySelector("#onboardingPermissionBody").textContent = t("onboardingPermissionBody");
  document.querySelector("#onboardingSyncTitle").textContent = t("onboardingSyncTitle");
  document.querySelector("#onboardingSyncBody").textContent = t("onboardingSyncBody");
  document.querySelector("#onboardingAiTitle").textContent = t("onboardingAiTitle");
  document.querySelector("#onboardingAiBody").textContent = t("onboardingAiBody");
  document.querySelector("#onboardingStartTitle").textContent = t("onboardingStartTitle");
  document.querySelector("#onboardingStartBody").textContent = t("onboardingStartBody");
  document.querySelector("#onboardingFeedbackTitle").textContent = t("onboardingFeedbackTitle");
  document.querySelector("#onboardingFeedbackBody").textContent = t("onboardingFeedbackBody");
  onboardingFeedbackLink.textContent = t("onboardingFeedback");
  onboardingDoneButton.textContent = t("onboardingDone");
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
  document.querySelector(".settings-language-trigger-icon").innerHTML = chevronDownIcon();
  refreshBookmarkFolderButton.querySelector(".button-icon").innerHTML = refreshIcon();
  bookmarkFavoriteAddButton.querySelector(".button-icon").innerHTML = plusIcon();
  chooseBookmarkFolderButton.querySelector(".button-icon").innerHTML = pageTabFilledIcon();
  closeBookmarkPickerButton.querySelector(".button-icon").innerHTML = arrowLeftIcon();
  refreshHistoryButton.querySelector(".button-icon").innerHTML = refreshIcon();
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
  document.querySelector(".media-placeholder .empty-mark")?.replaceChildren();
}

function applyMediaFeedFormLocale() {
  if (!mediaFeedForm) {
    return;
  }
  mediaFeedUrlInput.closest("label").querySelector("span").textContent = t("mediaFeedUrl");
  mediaFeedLanguageSelect.closest("label").querySelector("span").textContent = t("mediaFeedLanguage");
  mediaFeedUrlInput.placeholder = t("mediaFeedUrlPlaceholder");
  mediaFeedLanguageSelect.querySelector('option[value="zh"]').textContent = t("mediaFeedLanguageZh");
  mediaFeedLanguageSelect.querySelector('option[value="en"]').textContent = t("mediaFeedLanguageEn");
  cancelMediaFeedButton.textContent = t("cancel");
  mediaFeedForm.querySelector('button[type="submit"]').textContent = t("add");
  renderMediaFeedDefaultList();
}

function applyMediaFeedTypeLocale() {
  mediaFeedTypeTabs?.setAttribute("aria-label", t("mediaFeedTypeTabs"));
  mediaFeedTypeButtons.forEach((button) => {
    const type = button.dataset.mediaFeedType;
    if (type === "all") {
      button.textContent = t("mediaFeedTypeAll");
    } else {
      const rule = MEDIA_FEED_TOPIC_RULES.find((topic) => topic.id === type);
      button.textContent = rule ? t(rule.labelKey) : type;
    }
  });
}

function applySettingsLocale() {
  document.querySelector("#settingsTitle").textContent = t("settingsTitle");
  document.querySelector("#settingsSubtitle").textContent = t("settingsSubtitle");
  document.querySelector(".settings-tabs")?.setAttribute("aria-label", t("settingsTabsLabel"));
  const settingsBasicTab = document.querySelector("#settingsBasicTab");
  const settingsSearchTab = document.querySelector("#settingsSearchTab");
  settingsBasicTab.querySelector(".settings-tab-label").textContent = t("settingsBasicTab");
  settingsSearchTab.querySelector(".settings-tab-label").textContent = t("settingsSearchTab");
  settingsBasicTab.setAttribute("aria-label", t("settingsBasicTab"));
  settingsSearchTab.setAttribute("aria-label", t("settingsSearchTab"));
  settingsBasicTab.title = t("settingsBasicTab");
  settingsSearchTab.title = t("settingsSearchTab");
  document.querySelector("#languageSettingsTitle").textContent = t("languageSettingsTitle");
  document.querySelector(".settings-language-group .settings-group-heading p").textContent = t("languageSettingsDescription");
  renderLanguageOptions();
  document.querySelector("#themeModeControl")?.setAttribute("aria-label", t("appearanceModeTitle"));
  document.querySelector("#appearanceModeTitle").textContent = t("appearanceModeTitle");
  document.querySelector(".settings-mode-group .settings-group-heading p").textContent = t("appearanceModeDescription");
  document.querySelector(".settings-mode-group .settings-group-note").textContent = t("appearanceModeHint");
  document.querySelector("#presetPaletteTitle").textContent = t("presetPaletteTitle");
  document.querySelector('[aria-labelledby="presetPaletteTitle"] .settings-group-heading p').textContent = t("presetPaletteDescription");
  document.querySelector('[aria-labelledby="presetPaletteTitle"] .settings-group-note').textContent = t("presetPaletteHint");
  document.querySelector("#syncSettingsTitle").textContent = t("syncSettingsTitle");
  document.querySelector('[aria-labelledby="syncSettingsTitle"] .settings-group-heading p').textContent = t("syncSettingsDescription");
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
  const customPaletteTitle = document.querySelector("#customPaletteTitle");
  if (customPaletteTitle) {
    customPaletteTitle.textContent = t("customPaletteTitle");
    document.querySelector('[aria-labelledby="customPaletteTitle"] .settings-group-heading p').textContent = t("customPaletteDescription");
    document.querySelector('[aria-labelledby="customPaletteTitle"] .settings-group-note').textContent = t("customPaletteHint");
  }
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
  document.querySelector(".sync-settings-actions")?.setAttribute("aria-label", t("syncSettingsActionsLabel"));
  updateSyncSettingsUi();
  renderSearchSettingsForm();
  lightAccentInput?.closest("label")?.querySelector("span")?.replaceChildren(document.createTextNode(t("lightAccent")));
  darkAccentInput?.closest("label")?.querySelector("span")?.replaceChildren(document.createTextNode(t("darkAccent")));
  updateSettingsActiveSummary(settingsTabButtons.find((button) => button.classList.contains("active"))?.dataset.settingsTab);
}

function renderLanguageOptions() {
  if (!languageOptions || !languageCurrent) {
    return;
  }
  languageOptions.replaceChildren(...LANGUAGE_PREFERENCES.map((preference) => {
    const option = document.createElement("button");
    option.className = "portal-category-option settings-language-option";
    option.type = "button";
    option.dataset.languagePreference = preference;
    option.id = `languageOption-${preference}`;
    option.setAttribute("role", "option");
    const label = document.createElement("span");
    label.textContent = languagePreferenceLabel(preference);
    const icon = document.createElement("span");
    icon.className = "button-icon settings-language-option-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = tdesignIcon("check");
    option.append(label, icon);
    option.addEventListener("pointerdown", (event) => event.preventDefault());
    return option;
  }));
  updateLanguagePicker();
}

function languagePreferenceLabel(preference) {
  return preference === "system" ? t("themeModeSystem") : LANGUAGE_OPTION_LABELS[preference];
}

function updateLanguagePicker() {
  if (languageCurrent) {
    languageCurrent.textContent = languagePreferenceLabel(activeLanguagePreference);
  }
  languageOptions?.querySelectorAll(".settings-language-option").forEach((option) => {
    const isSelected = option.dataset.languagePreference === activeLanguagePreference;
    option.setAttribute("aria-selected", String(isSelected));
    option.tabIndex = isSelected ? 0 : -1;
  });
  languageTrigger?.setAttribute("aria-activedescendant", `languageOption-${activeLanguagePreference}`);
}

function toggleLanguagePicker(event) {
  if (languagePicker?.classList.contains("open")) {
    closeLanguagePicker({ restoreFocus: true });
  } else {
    openLanguagePicker({ focusOption: event?.detail === 0 });
  }
}

function openLanguagePicker(options = {}) {
  if (!languagePicker || !languageTrigger || !languageOptions) {
    return;
  }
  languagePicker.classList.add("open");
  languageTrigger.setAttribute("aria-expanded", "true");
  languageOptions.hidden = false;
  if (options.focusOption) {
    languageOptions.querySelector('[aria-selected="true"]')?.focus({ preventScroll: true });
  }
}

function closeLanguagePicker(options = {}) {
  if (!languagePicker || !languageTrigger || !languageOptions) {
    return;
  }
  languagePicker.classList.remove("open");
  languageTrigger.setAttribute("aria-expanded", "false");
  languageOptions.hidden = true;
  if (options.restoreFocus) {
    languageTrigger.focus({ preventScroll: true });
  }
}

function handleLanguageOptionClick(event) {
  const option = event.target.closest?.(".settings-language-option");
  if (!option) {
    return;
  }
  void setLanguagePreference(option.dataset.languagePreference);
  closeLanguagePicker({ restoreFocus: true });
}

function handleLanguageOptionsKeydown(event) {
  const options = [...languageOptions.querySelectorAll(".settings-language-option")];
  const currentIndex = options.findIndex((option) => option === document.activeElement);
  if (event.key === "Escape") {
    event.preventDefault();
    event.stopPropagation();
    closeLanguagePicker({ restoreFocus: true });
    return;
  }
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    event.stopPropagation();
    const currentOption = options[currentIndex];
    if (currentOption) {
      void setLanguagePreference(currentOption.dataset.languagePreference);
      closeLanguagePicker({ restoreFocus: true });
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

function handleLanguagePickerDismiss(event) {
  if (!languagePicker?.classList.contains("open")) {
    return;
  }
  const target = event.target;
  if (target instanceof Element && languagePicker.contains(target)) {
    return;
  }
  closeLanguagePicker();
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
  renderMediaFeedForActiveType();
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
  await initQuickSearchEngine();
  renderFavoriteSites();
  renderPortals();
  renderSelectedBookmarkFolder();
  refreshHistory();
  void searchSettingsReady;
  void themeModeReady;

  chooseBookmarkFolderButton.addEventListener("click", openBookmarkPicker);
  refreshBookmarkFolderButton.addEventListener("click", renderSelectedBookmarkFolder);
  bookmarkFavoriteAddButton?.addEventListener("click", toggleFavoriteForm);
  closeBookmarkPickerButton.addEventListener("click", closeBookmarkPicker);
  refreshHistoryButton.addEventListener("click", refreshHistory);
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
  quickSearchInput.addEventListener("keydown", handleQuickSearchInputKeydown);
  quickSearchInput.addEventListener("input", handleQuickSearchInput);
  quickSearchInput.addEventListener("focus", handleQuickSearchFocus);
  quickSearchInput.addEventListener("blur", handleQuickSearchBlur);
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
  onboardingDoneButton?.addEventListener("click", dismissOnboardingGuide);
  settingsButton.addEventListener("click", toggleSettingsPanel);
  closeSettingsButton.addEventListener("click", closeSettingsPanel);
  settingsShell?.addEventListener("scroll", updateSettingsTabsStickyVisualState, { passive: true });
  window.addEventListener("resize", updateSettingsTabsStickyVisualState);
  syncSettingsNowButton?.addEventListener("click", handleManualSyncSettings);
  languageTrigger?.addEventListener("click", toggleLanguagePicker);
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
  lightAccentInput?.addEventListener("input", handleCustomThemeColorInput);
  lightAccentStrongInput?.addEventListener("input", handleCustomThemeColorInput);
  darkAccentInput?.addEventListener("input", handleCustomThemeColorInput);
  darkAccentStrongInput?.addEventListener("input", handleCustomThemeColorInput);
  mobileSectionTabs.forEach((tab) => {
    tab.addEventListener("click", () => activateMobilePanel(tab.dataset.panelTarget));
  });
  document.addEventListener("pointerdown", handleBookmarkDeleteDismiss, true);
  document.addEventListener("pointerdown", handleFavoriteDeleteDismiss, true);
  document.addEventListener("pointerdown", handleSurfacePanelDismiss, true);
  document.addEventListener("pointerdown", handlePortalCategoryPickerDismiss, true);
  document.addEventListener("pointerdown", handleLanguagePickerDismiss, true);
  document.addEventListener("pointerdown", handleSearchSuggestionDismiss, true);
  document.addEventListener("pointerdown", handleSettingsPanelDismiss, true);
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
  activeSurfacePanelId = panelId === "portalPanel" || panelId === "historyPanel" ? panelId : "";
  const hasActiveSurfacePanel = Boolean(activeSurfacePanelId);
  const isOpeningSurfacePanel = hasActiveSurfacePanel && !previousPanelId;
  if (surfaceBackdrop && isOpeningSurfacePanel) {
    surfaceBackdrop.hidden = false;
    surfaceBackdrop.setAttribute("aria-hidden", "false");
    // Flush hidden -> visible so the backdrop opacity transition starts from the closed state.
    surfaceBackdrop.getBoundingClientRect();
  }
  secondaryShell.dataset.activeSurface = activeSurfacePanelId;
  secondaryShell.dataset.previousSurface = previousPanelId || "";
  secondaryShell.classList.toggle("surface-open", hasActiveSurfacePanel);
  secondaryShell.classList.toggle("surface-closing", Boolean(!activeSurfacePanelId && previousPanelId));
  if (surfaceBackdrop) {
    surfaceBackdrop.hidden = !activeSurfacePanelId && !previousPanelId;
    surfaceBackdrop.setAttribute("aria-hidden", String(!activeSurfacePanelId));
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
  if (activeSurfacePanelId === "historyPanel") {
    refreshHistory();
  }
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
    activeCustomThemeColors = savedPalette.custom;
    updateCustomThemeInputs();
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
  const prefixes = platform.prefixes.map((prefix) => `${prefix} ${t("searchSettingsPlatformQuery")}`).join(", ");
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
  const localIcon = localIconForUrl(engineUrl) || GENERIC_SITE_FALLBACK_ICON;
  const style = SETTINGS_ENGINE_ICON_STYLES[engine.id] || {};
  const label = searchEngineLabel(engine);
  const shell = document.createElement("span");
  shell.className = "settings-engine-icon";
  shell.dataset.engineIcon = engine.id;
  shell.dataset.siteUrl = engineUrl;
  shell.dataset.siteTitle = label;
  shell.dataset.iconSource = localIcon;
  shell.dataset.iconCandidate = localIcon;
  shell.style.setProperty("--settings-engine-icon-tile", style.tile || "#ffffff");
  shell.style.setProperty("--settings-engine-icon-glyph", style.glyph || "#1f2924");

  if (style.mode === "mask") {
    const glyph = document.createElement("span");
    glyph.className = "settings-engine-icon-mask";
    glyph.style.webkitMaskImage = `url("${localIcon}")`;
    glyph.style.maskImage = `url("${localIcon}")`;
    shell.append(glyph);
    return shell;
  }

  const icon = document.createElement("img");
  icon.className = "settings-engine-icon-image";
  icon.alt = "";
  icon.decoding = "async";
  icon.dataset.engineIcon = engine.id;
  icon.dataset.iconSource = localIcon;
  icon.dataset.iconCandidate = localIcon;
  icon.src = localIcon;
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

function renderSearchEngineIcon(target, engine) {
  target.replaceChildren();
  if (engine.local) {
    target.innerHTML = searchEngineSearchIcon();
    return;
  }
  const icon = document.createElement("img");
  icon.alt = "";
  icon.decoding = "async";
  icon.dataset.engineIcon = engine.id;
  applySiteIcon(icon, { url: engine.searchUrl || engine.directUrl || "", title: searchEngineLabel(engine) });
  target.appendChild(icon);
}

function handleGlobalEscape(event) {
  if (event.key !== "Escape") {
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
    : t("quickSearchPlaceholder");
  const previousThemeColor = quickSearchForm.style.getPropertyValue("--ai-theme-color");
  quickSearchForm.style.setProperty("--ai-theme-color", modeTarget.themeColor || "var(--accent)");
  quickSearchInput.placeholder = placeholder;
  quickSearchInput.setAttribute("aria-label", placeholder);
  renderAiEnginePill(engine, { previousThemeColor });
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
  applySiteIcon(icon, {
    url: target.iconUrl || target.searchUrl || target.directUrl || "",
    title: target.label || searchEngineLabel(target)
  });
  if (target.id === "jimeng") {
    applyIconTile(icon, "brand", { light: "#000000", dark: "#000000" }, true);
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
    palette: cached.palette,
    custom: cached.custom
  });
  activeThemeMode = cached.mode === "dark" || cached.mode === "light" || cached.mode === "system"
    ? cached.mode
    : DEFAULT_THEME_MODE;
  activeResolvedTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  activeThemePalette = savedPalette.palette;
  activeCustomThemeColors = savedPalette.custom;
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
      custom: activeCustomThemeColors,
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
    palette: DEFAULT_THEME_PALETTE,
    custom: { ...DEFAULT_CUSTOM_THEME_COLORS }
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
  const light = normalizeColor(value.custom?.light, fallback.custom.light);
  const dark = normalizeColor(value.custom?.dark, fallback.custom.dark);
  return {
    palette,
    custom: {
      light,
      lightStrong: normalizeColor(
        value.custom?.lightStrong,
        value.custom?.lightAccentStrong,
        mixHexColors(light, "#000000", 0.32)
      ),
      dark,
      darkStrong: normalizeColor(
        value.custom?.darkStrong,
        value.custom?.darkAccentStrong,
        mixHexColors(dark, "#ffffff", 0.28)
      )
    }
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
  if (activeThemePalette === CUSTOM_THEME_PALETTE_ID) {
    const basePalette = themePaletteById(DEFAULT_THEME_PALETTE);
    setThemeVariables({
      modes: {
        light: {
          ...basePalette.modes.light,
          accent: activeCustomThemeColors.light,
          accentStrong: activeCustomThemeColors.lightStrong,
          focus: mixHexColors(activeCustomThemeColors.light, "#2f82c4", 0.48)
        },
        dark: {
          ...basePalette.modes.dark,
          accent: activeCustomThemeColors.dark,
          accentStrong: activeCustomThemeColors.darkStrong,
          focus: mixHexColors(activeCustomThemeColors.dark, "#68b7f2", 0.4),
          onAccent: readableTextColor(activeCustomThemeColors.dark)
        }
      }
    });
    writeThemeBootCache(activeThemeMode, activeResolvedTheme || document.documentElement.dataset.theme);
    return;
  }
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

async function handleCustomThemeColorInput() {
  if (!lightAccentInput || !lightAccentStrongInput || !darkAccentInput || !darkAccentStrongInput) {
    return;
  }
  activeThemePalette = CUSTOM_THEME_PALETTE_ID;
  activeCustomThemeColors = {
    light: normalizeColor(lightAccentInput.value, DEFAULT_CUSTOM_THEME_COLORS.light),
    lightStrong: normalizeColor(lightAccentStrongInput.value, DEFAULT_CUSTOM_THEME_COLORS.lightStrong),
    dark: normalizeColor(darkAccentInput.value, DEFAULT_CUSTOM_THEME_COLORS.dark),
    darkStrong: normalizeColor(darkAccentStrongInput.value, DEFAULT_CUSTOM_THEME_COLORS.darkStrong)
  };
  updateCustomThemeInputs();
  applyThemePalette();
  updateThemeSettingsUi();
  await saveThemePaletteSettings();
}

function updateCustomThemeInputs() {
  if (!lightAccentInput || !lightAccentStrongInput || !darkAccentInput || !darkAccentStrongInput || !lightAccentValue || !darkAccentValue) {
    return;
  }
  lightAccentInput.value = activeCustomThemeColors.light;
  lightAccentStrongInput.value = activeCustomThemeColors.lightStrong;
  darkAccentInput.value = activeCustomThemeColors.dark;
  darkAccentStrongInput.value = activeCustomThemeColors.darkStrong;
  lightAccentValue.value = `${activeCustomThemeColors.light} / ${activeCustomThemeColors.lightStrong}`;
  lightAccentValue.textContent = lightAccentValue.value;
  darkAccentValue.value = `${activeCustomThemeColors.dark} / ${activeCustomThemeColors.darkStrong}`;
  darkAccentValue.textContent = darkAccentValue.value;
  lightAccentInput.closest(".color-picker-row")?.style.setProperty("--color-picker-primary", activeCustomThemeColors.light);
  lightAccentInput.closest(".color-picker-row")?.style.setProperty("--color-picker-secondary", activeCustomThemeColors.lightStrong);
  darkAccentInput.closest(".color-picker-row")?.style.setProperty("--color-picker-primary", activeCustomThemeColors.dark);
  darkAccentInput.closest(".color-picker-row")?.style.setProperty("--color-picker-secondary", activeCustomThemeColors.darkStrong);
}

async function saveThemePaletteSettings() {
  try {
    await setStoredValues({
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
  const themeModeOptions = [...document.querySelectorAll("[data-theme-mode]")];
  const activeThemeModeIndex = Math.max(0, themeModeOptions.findIndex((button) => button.dataset.themeMode === activeThemeMode));
  document.querySelector(".theme-mode-control")?.setAttribute("data-active-index", String(activeThemeModeIndex));
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
  const normalizedStatus = status === "done" ? "done" : (storageSyncAvailable() ? "ready" : "unavailable");
  syncSettingsRow.dataset.status = normalizedStatus;
  syncSettingsNowButton.disabled = normalizedStatus === "unavailable";
  syncSettingsNowButton.setAttribute("aria-disabled", String(syncSettingsNowButton.disabled));
  syncSettingsAutoButton.disabled = true;
  syncSettingsAutoButton.setAttribute("aria-disabled", "true");
  syncSettingsNowButton.querySelector(".button-icon").innerHTML = refreshIcon();
  syncSettingsNowButton.querySelector(".sync-settings-action-label").textContent = t("syncSettingsNow");
  syncSettingsAutoButton.querySelector(".button-icon").innerHTML = backupFilledIcon();
  syncSettingsAutoButton.querySelector(".sync-settings-action-label").textContent = t("syncSettingsAuto");
  if (normalizedStatus === "done") {
    syncSettingsStatus.textContent = t("syncSettingsDone");
    syncSettingsDetail.textContent = t("syncSettingsDoneDetail");
    return;
  }
  if (normalizedStatus === "unavailable") {
    syncSettingsStatus.textContent = t("syncSettingsUnavailable");
    syncSettingsDetail.textContent = t("syncSettingsUnavailableDetail");
    return;
  }
  syncSettingsStatus.textContent = t("syncSettingsReady");
  syncSettingsDetail.textContent = t("syncSettingsReadyDetail");
}

function storageSyncAvailable() {
  return Boolean(chrome.storage?.sync);
}

async function handleManualSyncSettings() {
  if (!storageSyncAvailable()) {
    updateSyncSettingsUi("unavailable");
    return;
  }
  try {
    const keys = [...SYNC_STORAGE_KEYS].filter((key) => key !== SYNC_META_STORAGE_KEY);
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
      chrome.storage.sync.set(payload),
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
  closeLanguagePicker();
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
    openOnboardingGuide();
  } catch (error) {
    console.warn("Failed to read onboarding guide state", error);
  }
}

function openOnboardingGuide() {
  if (!onboardingGuide) {
    return;
  }
  closeSettingsPanel();
  onboardingFeedbackLink.href = ISSUE_FEEDBACK_URL;
  onboardingCloseButton.querySelector(".button-icon").innerHTML = closeIcon();
  onboardingGuide.hidden = false;
  onboardingDoneButton.focus({ preventScroll: true });
}

async function dismissOnboardingGuide() {
  if (!onboardingGuide || onboardingGuide.hidden) {
    return;
  }
  onboardingGuide.hidden = true;
  try {
    await chrome.storage.local.set({ [ONBOARDING_GUIDE_STORAGE_KEY]: true });
  } catch (error) {
    console.warn("Failed to save onboarding guide state", error);
  }
  quickSearchInput.focus({ preventScroll: true });
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
  if (event.key === "Backspace" && !event.isComposing && (!searchEngineById(activeSearchEngine).local || activePlatformSearchTarget) && quickSearchInput.value.length === 0) {
    event.preventDefault();
    event.stopPropagation();
    exitDirectQuickSearchMode();
    return;
  }
  if (event.key !== "Enter" || event.isComposing) {
    return;
  }
  event.preventDefault();
  submitQuickSearch();
}

function exitDirectQuickSearchMode() {
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

function handleQuickSearchInput() {
  const commandMatch = searchAiCommand(quickSearchInput.value);
  if (commandMatch) {
    quickSearchInput.value = commandMatch.remainder;
    setQuickSearchEngine(commandMatch.engine.id);
    return;
  }
  const platformMatch = searchPlatformPrefix(quickSearchInput.value);
  if (platformMatch && searchEngineById(activeSearchEngine).local) {
    quickSearchInput.value = platformMatch.remainder;
    setPlatformQuickSearchTarget(platformMatch.platform.id);
    return;
  }
  renderLocalSearchSuggestions(normalizeText(quickSearchInput.value));
}

function setPlatformQuickSearchTarget(platformId) {
  activeSearchEngine = DEFAULT_SEARCH_ENGINE;
  activePlatformSearchTarget = platformSearchTargetById(platformId)?.id || "";
  updateQuickSearchModeUi();
  renderLocalSearchSuggestions(normalizeText(quickSearchInput.value));
}

function handleQuickSearchFocus() {
  setQuickSearchActive(true);
  handleQuickSearchInput();
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
  const match = String(value || "").match(/^([a-z][a-z0-9-]*)\s+(\S.*)$/i);
  if (!match) {
    return null;
  }
  const prefix = match[1].toLowerCase();
  const remainder = match[2] || "";
  const platform = PLATFORM_SEARCH_TARGETS.find((target) => (
    target.prefixes.some((item) => item.toLowerCase() === prefix)
  ));
  const splitPrefixMatch = splitLongPlatformPrefix(prefix, remainder, platform);
  if (splitPrefixMatch) {
    return splitPrefixMatch;
  }
  if (isPartialSplitPlatformPrefix(prefix, remainder, platform)) {
    return null;
  }
  if (!platform) {
    return null;
  }
  return {
    platform,
    prefix,
    remainder
  };
}

function platformSearchPrefixes() {
  return PLATFORM_SEARCH_TARGETS.flatMap((target) => (
    target.prefixes.map((prefix) => ({
      platform: target,
      prefix: prefix.toLowerCase()
    }))
  ));
}

function splitLongPlatformPrefix(prefix, remainder, currentPlatform = null) {
  const firstTokenMatch = String(remainder || "").match(/^([a-z0-9-]+)(?:\s+(\S.*))?$/i);
  if (!firstTokenMatch) {
    return null;
  }
  const combinedPrefix = `${prefix}${firstTokenMatch[1].toLowerCase()}`;
  const match = platformSearchPrefixes().find((item) => (
    item.prefix.length > prefix.length
      && item.prefix === combinedPrefix
      && item.platform.id !== currentPlatform?.id
  ));
  if (!match || typeof firstTokenMatch[2] === "undefined") {
    return null;
  }
  return {
    platform: match.platform,
    prefix: match.prefix,
    remainder: firstTokenMatch[2] || ""
  };
}

function isPartialSplitPlatformPrefix(prefix, remainder, currentPlatform = null) {
  const firstTokenMatch = String(remainder || "").match(/^([a-z0-9-]+)$/i);
  if (!firstTokenMatch) {
    return false;
  }
  const combinedPrefix = `${prefix}${firstTokenMatch[1].toLowerCase()}`;
  return platformSearchPrefixes().some((item) => (
    item.prefix.length > prefix.length
    && item.platform.id !== currentPlatform?.id
    && item.prefix.startsWith(combinedPrefix)
  ));
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
    await saveAiDirectPrompt(token, {
      prompt: query,
      engineId: engine.id,
      createdAt: Date.now()
    });
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
    hint: selectedEngine ? t("quickSearchWith", { engine: selectedEngine.label }) : t("quickSearch"),
    query,
    selectedEngineId: selectedEngine?.id || AGGREGATE_SEARCH_ENGINE_IDS[0]
  };
}

async function localSearchItems(query, options = {}) {
  const scope = options.scope || null;
  const [historyItems, bookmarkItems] = await Promise.all([
    searchHistoryItems(query, scope),
    searchBookmarkItems(query, scope)
  ]);
  const merged = [...historyItems, ...bookmarkItems];
  const byKey = new Map();
  const normalizedQuery = normalizeText(query).toLowerCase();
  merged.forEach((item) => {
    const key = localSearchDedupKey(item.url);
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
  return uniqueSiteKeys.length ? { siteKeys: uniqueSiteKeys } : null;
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
  return Boolean(siteKey && scope.siteKeys.includes(siteKey));
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
  const link = item.type === "engine-search" ? document.createElement("div") : document.createElement("a");
  const icon = item.type === "engine-search" ? document.createElement("span") : document.createElement("img");
  const copy = document.createElement("span");
  const title = document.createElement("strong");
  const meta = document.createElement("span");
  const trailing = document.createElement("span");
  link.className = "search-suggestion-item";
  if (item.type === "engine-search") {
    link.classList.add("search-suggestion-item-primary");
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
  const [portalData, favoriteSites] = await Promise.all([
    loadBookmarkDrivenPortals(customPortals),
    loadFavoriteSites()
  ]);
  const favoriteKeys = favoriteSiteKeySet(favoriteSites);
  const favoriteIconMap = favoriteSiteIconMap(favoriteSites);
  const iconRenders = readFirstPaintCache().iconRenders;
  const featuredPortals = featuredPortalItems(portalData.items);
  const groups = groupPortalsByCategory(portalData.items);
  portalCategoryState = await loadPortalCategoryState(groups);
  if (featuredPortals.length) {
    fragment.appendChild(createPortalCategorySection({
      category: "featured",
      favoriteKeys,
      favoriteIconMap,
      featured: true,
      iconRenders,
      items: featuredPortals
    }));
  }
  if (groups.length) {
    fragment.appendChild(createPortalClassificationModule(groups, {
      favoriteKeys,
      favoriteIconMap,
      iconRenders
    }));
  }
  portalGrid.replaceChildren(fragment);
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
  const iconSite = siteWithFavoriteIcon(site, options.favoriteIconMap);
  const cachedIconRender = cachedFirstPaintIconRender(options.iconRenders, iconSite);
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
  if (!siteIconIndexLoaded || !siteGroupKey(safeUrl(url)) || localIconForUrl(url)) {
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
  if (!siteIconIndexLoaded || !siteKey || localIconForUrl(parsedUrl.href)) {
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
    tileLight: descriptor.tileLight,
    tileDark: descriptor.tileDark,
    glyphLight: descriptor.glyphLight,
    glyphDark: descriptor.glyphDark,
    qualityScore: descriptor.qualityScore
  };
}

async function fetchRemoteBrandIconDataUrl(parsedUrl) {
  const candidates = remoteBrandIconSlugCandidates(parsedUrl);
  const siteKey = siteGroupKey(parsedUrl);
  for (const candidate of candidates) {
    for (const provider of REMOTE_BRAND_ICON_PROVIDERS) {
      try {
        const iconDataUrl = await fetchRemoteBrandSvgDataUrl(provider.urlForSlug(candidate.slug), {
          candidate,
          providerId: provider.id,
          siteKey
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
  return /^(?:\s*<\?xml[^>]*>\s*)?(?:\s*<!doctype[^>]*>\s*)?<svg\b/i.test(String(svg || ""));
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
      .replace(/\sdata-wayleaf-quality=(["'])[^"']*\1/gi, "");
    const brandAttr = color ? ` data-wayleaf-brand-color="${color}"` : "";
    const metadataAttrs = [
      `data-wayleaf-remote-brand="true"`,
      `data-wayleaf-monochrome="${isMonochrome ? "true" : "false"}"`,
      `data-wayleaf-render-mode="${descriptor.renderMode}"`,
      `data-wayleaf-tile-light="${descriptor.tileLight}"`,
      `data-wayleaf-tile-dark="${descriptor.tileDark}"`,
      `data-wayleaf-glyph-light="${descriptor.glyphLight || "original"}"`,
      `data-wayleaf-glyph-dark="${descriptor.glyphDark || "original"}"`,
      `data-wayleaf-quality="${descriptor.qualityScore}"`
    ];
    return `<svg${cleanedAttrs} ${metadataAttrs.join(" ")}${brandAttr}>`;
  });
  return output;
}

function remoteBrandSvgDescriptor(svg, options = {}) {
  const brandColor = normalizeHexColor(options.brandColor || "") || "";
  const isMonochrome = remoteBrandSvgIsMonochrome(svg);
  const renderMode = isMonochrome ? "mask" : "original";
  const tileColors = remoteBrandDescriptorTileColors(brandColor, renderMode);
  return {
    brandColor,
    isMonochrome,
    renderMode,
    tileLight: tileColors.light,
    tileDark: tileColors.dark,
    glyphLight: renderMode === "mask" ? remoteBrandGlyphColorForTile(tileColors.light, brandColor) : "",
    glyphDark: renderMode === "mask" ? remoteBrandGlyphColorForTile(tileColors.dark, brandColor) : "",
    qualityScore: Math.max(0, Math.min(100, Math.round(Number(options.qualityScore || 0))))
  };
}

function remoteBrandDescriptorTileColors(brandColor, renderMode = "mask") {
  const color = normalizeHexColor(brandColor);
  if (renderMode === "original") {
    return {
      light: "#ffffff",
      dark: "#f8fafc"
    };
  }
  if (!color) {
    return {
      light: "#ffffff",
      dark: "#f8fafc"
    };
  }
  if (nearWhiteBrandColor(color)) {
    return {
      light: "#000000",
      dark: "#f8fafc"
    };
  }
  return {
    light: color,
    dark: "#f8fafc"
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
    tileLight: normalizeHexColor(attr("tile-light")),
    tileDark: normalizeHexColor(attr("tile-dark")),
    glyphLight: remoteBrandSvgGlyphAttribute(attr("glyph-light")),
    glyphDark: remoteBrandSvgGlyphAttribute(attr("glyph-dark")),
    qualityScore: Number(attr("quality") || 0)
  };
}

function remoteBrandSvgDataAttribute(svg, name) {
  const match = String(svg || "").match(new RegExp(`\\sdata-wayleaf-${name}=(["'])([^"']*)\\1`, "i"));
  return match?.[2] || "";
}

function remoteBrandSvgGlyphAttribute(value) {
  return value === "original" ? "" : normalizeHexColor(value);
}

function embeddedSvgBrandColor(value) {
  const svg = decodeSvgDataUrl(value) || String(value || "");
  const match = svg.match(/\sdata-wayleaf-brand-color=(["'])(#[0-9a-f]{6})\1/i);
  return normalizeHexColor(match?.[2] || "");
}

function extractSvgBrandColor(svg) {
  return extractSvgColorPalette(svg)[0] || "";
}

function remoteBrandSvgBrandColor(svg, options = {}) {
  const embeddedColor = embeddedSvgBrandColor(svg);
  if (embeddedColor) {
    return embeddedColor;
  }
  const palette = extractSvgColorPalette(svg);
  const localColor = normalizeHexColor(SITE_ICON_TILE_COLOR_BY_SITE_KEY[options.siteKey] || "");
  if (options.providerId === "simple-icons-cdn" && palette[0]) {
    return remoteBrandProviderColorLooksDrifted(palette[0], localColor) ? localColor : palette[0];
  }
  const expressiveColor = palette.find((color) => !remoteBrandColorLooksNeutral(color));
  return expressiveColor || localColor || "";
}

function remoteBrandProviderColorLooksDrifted(providerColor, localColor) {
  const provider = normalizeHexColor(providerColor);
  const local = normalizeHexColor(localColor);
  if (!provider || !local || remoteBrandColorLooksNeutral(provider)) {
    return false;
  }
  const [providerRed, providerGreen, providerBlue] = hexToRgb(provider);
  const [localRed, localGreen, localBlue] = hexToRgb(local);
  const distance = Math.hypot(providerRed - localRed, providerGreen - localGreen, providerBlue - localBlue);
  return distance > 96 && contrastRatio(provider, local) > 1.35;
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

function remoteBrandSvgIsMonochrome(svg) {
  if (remoteBrandSvgHasComplexPaint(svg)) {
    return false;
  }
  const palette = extractSvgColorPalette(svg);
  return palette.length <= 1;
}

function remoteBrandSvgHasComplexPaint(svg) {
  const text = String(svg || "");
  return /<(?:linearGradient|radialGradient|meshgradient|pattern|filter|mask)\b/i.test(text)
    || /\s(?:fill|stroke)\s*=\s*(["'])\s*url\(/i.test(text)
    || /(?:fill|stroke)\s*:\s*url\(/i.test(text);
}

function extractSvgColorPalette(svg) {
  const palette = [];
  const seen = new Set();
  const pushColor = (value) => {
    const color = normalizeSvgHexColor(value);
    if (!color || seen.has(color)) {
      return;
    }
    seen.add(color);
    palette.push(color);
  };
  const text = String(svg || "");
  const colorAttributeMatches = text.matchAll(/\s(?:fill|stroke|color)\s*=\s*(["'])(#[0-9a-f]{3,8})\1/gi);
  for (const match of colorAttributeMatches) {
    pushColor(match[2]);
  }
  const inlineStyleMatches = text.matchAll(/(?:^|["'{;\s])(?:fill|stroke|color)\s*:\s*(#[0-9a-f]{3,8})\b/gi);
  for (const match of inlineStyleMatches) {
    pushColor(match[1]);
  }
  return palette;
}

function normalizeSvgHexColor(value) {
  const color = String(value || "").trim().toLowerCase();
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

async function discoverSiteIconCandidateUrls(url) {
  const candidates = await discoverSiteIconCandidateEntries(url);
  return candidates.map((candidate) => candidate.url);
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
  const parsedCandidates = extractSiteIconParsedDocumentCandidates(html, baseUrl);
  const markupCandidates = extractSiteIconMarkupCandidates(html, baseUrl);
  return {
    icons: dedupeAndSortSiteIconCandidates([...parsedCandidates.icons, ...markupCandidates.icons]),
    manifests: dedupeAndSortSiteIconCandidates([...parsedCandidates.manifests, ...markupCandidates.manifests])
  };
}

function extractSiteIconParsedDocumentCandidates(html, baseUrl) {
  const parsedDocument = parseSiteIconHtmlDocument(html);
  if (!parsedDocument) {
    return {
      icons: [],
      manifests: []
    };
  }
  const icons = [];
  const manifests = [];
  [...parsedDocument.querySelectorAll("link[rel][href]")].forEach((link, index) => {
    const relTokens = siteIconRelTokens(link.getAttribute("rel"));
    const href = normalizeText(link.getAttribute("href"));
    if (!href) {
      return;
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
    if (!relScore) {
      return;
    }
    const iconUrl = absoluteIconUrl(href, baseUrl);
    if (!iconUrl) {
      return;
    }
    const sizes = parseIconSizes(link.getAttribute("sizes"));
    const type = normalizeText(link.getAttribute("type")).toLowerCase();
    icons.push({
      url: iconUrl,
      source: "document",
      score: relScore
        + siteIconSizeScore(sizes)
        + siteIconTypeScore(type, iconUrl)
        + index / 1000
    });
  });
  return {
    icons: dedupeAndSortSiteIconCandidates(icons),
    manifests: dedupeAndSortSiteIconCandidates(manifests)
  };
}

function extractSiteIconMarkupCandidates(html, baseUrl) {
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

function parseSiteIconHtmlDocument(html) {
  try {
    if (typeof DOMParser !== "undefined") {
      return new DOMParser().parseFromString(String(html || ""), "text/html");
    }
    if (document?.implementation?.createHTMLDocument) {
      const parsedDocument = document.implementation.createHTMLDocument("");
      parsedDocument.documentElement.innerHTML = String(html || "");
      return parsedDocument;
    }
  } catch {
    return null;
  }
  return null;
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
  const tileIconSource = localIcon || (remoteBrandSvgDescriptorFromSource(siteIcon) ? siteIcon : "");
  storeIconSiteContext(icon, site);
  applySiteIconTile(icon, site, tileIconSource);
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

function refreshRemoteBrandIcon(icon, site) {
  const parsedUrl = safeUrl(site.url);
  const siteKey = siteGroupKey(parsedUrl);
  if (!siteIconIndexLoaded || !parsedUrl || !siteKey || localIconForUrl(site.url)) {
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
    applyRemoteBrandIcon(icon, site, iconDataUrl);
  }).catch(() => {});
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

function normalizedSiteIconPath(site) {
  return localIconForUrl(site.url) || normalizeStoredSiteIcon(site.icon || "");
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

function generatedSiteIconDataUrl(label, seed) {
  const hue = Math.abs(hashText(seed || label)) % 360;
  const background = `hsl(${hue} 42% 92%)`;
  const foreground = `hsl(${hue} 44% 32%)`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="24" fill="${background}"/><text x="64" y="75" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="${foreground}">${escapeSvgText(label)}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function hashText(value) {
  let hash = 0;
  for (const character of String(value || "")) {
    hash = ((hash << 5) - hash + character.charCodeAt(0)) | 0;
  }
  return hash;
}

function escapeSvgText(value) {
  return String(value || "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;"
  }[character]));
}

function storeIconSiteContext(icon, site) {
  icon.dataset.siteUrl = site.url || "";
  icon.dataset.siteTitle = site.title || icon.alt || "";
}

function applySiteIconTile(icon, site, iconPath = "") {
  const parsedUrl = safeUrl(site.url);
  const siteKey = siteGroupKey(parsedUrl);
  icon.dataset.siteKey = siteKey || "";
  const tileColor = siteIconBrandColor(siteKey, iconPath);
  const tileMode = iconPath ? "brand" : "plain";
  const remoteDescriptor = remoteBrandSvgDescriptorFromSource(iconPath);
  const isLocalIconSource = String(iconPath || "").startsWith("icons/");
  let tileColors = genericIconTileColors(parsedUrl?.hostname || site.url || site.title);
  if (remoteDescriptor) {
    tileColors = remoteBrandDescriptorDisplayTileColors(remoteDescriptor);
  } else if (iconPath && tileColor) {
    tileColors = brandIconTileColors(tileColor, siteKey, iconPath);
  }
  applyIconTile(icon, tileMode, tileColors, isLocalIconSource);
}

function siteIconBrandColor(siteKey = "", iconPath = "") {
  const remoteDescriptor = remoteBrandSvgDescriptorFromSource(iconPath);
  if (remoteDescriptor) {
    return remoteDescriptor.brandColor;
  }
  return normalizeHexColor(siteKey ? SITE_ICON_TILE_COLOR_BY_SITE_KEY[siteKey] || "" : "")
    || embeddedSvgBrandColor(iconPath);
}

function remoteBrandDescriptorDisplayTileColors(descriptor) {
  const light = normalizeHexColor(descriptor?.tileLight || "");
  const dark = normalizeHexColor(descriptor?.tileDark || "");
  if (!light || !dark) {
    return remoteBrandDescriptorTileColors(descriptor?.brandColor || "", descriptor?.renderMode || "mask");
  }
  return { light, dark };
}

function brandIconTileColors(tileColor, siteKey = "", iconPath = "") {
  const color = normalizeHexColor(tileColor);
  if (!color) {
    return genericIconTileColors("");
  }
  if (keepsBrandIconOriginalOnBrandTile(siteKey, iconPath)) {
    return {
      light: color,
      dark: color
    };
  }
  if (keepsBrandIconOriginal(siteKey, iconPath)) {
    return {
      light: "#ffffff",
      dark: "#f8fafc"
    };
  }
  if (nearWhiteBrandColor(color)) {
    return {
      light: "#000000",
      dark: "#f8fafc"
    };
  }
  return {
    light: color,
    dark: "#f8fafc"
  };
}

function keepsBrandIconOriginal(siteKey, iconPath = "") {
  if (keepsBrandIconOriginalOnBrandTile(siteKey, iconPath)) {
    return true;
  }
  if (MULTICOLOR_BRAND_ICON_SITE_KEYS.has(siteKey)) {
    return true;
  }
  const remoteDescriptor = remoteBrandSvgDescriptorFromSource(iconPath);
  if (remoteDescriptor) {
    return remoteDescriptor.renderMode === "original";
  }
  if (!siteIconSourceLooksLikeSvg(iconPath)) {
    return true;
  }
  return isSvgDataUrl(iconPath) && !remoteBrandSvgSourceIsMaskable(iconPath);
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
  icon.classList.toggle("site-icon-local", Boolean(hasLocalIcon));
  applyIconTileToShell(icon, tileMode, tileColors);
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
  coloredSvgIconSource(source, glyphColor).then((displaySource) => {
    if (icon.dataset.iconCandidate === source || icon.src.endsWith(source) || icon.getAttribute("src") === source) {
      icon.src = displaySource;
    }
  });
  return source;
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
    const descriptorGlyph = remoteBrandDescriptorGlyphColorForCurrentTheme(icon, source);
    if (descriptorGlyph !== null) {
      return descriptorGlyph;
    }
    return remoteBrandGlyphColorForTile(tileColor, brandColor);
  }
  if (brandColor) {
    return localBrandGlyphColorForTile(tileColor, brandColor);
  }
  if (iconTileShouldUseOriginalGlyph(tileColor)) {
    return "";
  }
  return readableIconGlyphColor(tileColor);
}

function remoteBrandDescriptorGlyphColorForCurrentTheme(icon, source) {
  const descriptor = remoteBrandSvgDescriptorFromSource(source);
  if (!descriptor || descriptor.renderMode !== "mask") {
    return null;
  }
  return document.documentElement.dataset.theme === "dark"
    ? descriptor.glyphDark
    : descriptor.glyphLight;
}

function localBrandGlyphColor(tileColor) {
  const color = normalizeHexColor(tileColor);
  if (!color) {
    return "";
  }
  return nearWhiteBrandColor(color) ? readableIconGlyphColor(color) : "#ffffff";
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
  if (contrastRatio(tile, brand) >= LOCAL_BRAND_CARRIER_CONTRAST_MIN) {
    return brand;
  }
  return readableIconGlyphColor(tile);
}

function remoteBrandGlyphColorForTile(tileColor, brandColor = "") {
  const tile = normalizeHexColor(tileColor);
  const brand = normalizeHexColor(brandColor);
  if (!tile) {
    return "";
  }
  if (brand && tile !== brand && contrastRatio(tile, brand) >= 3) {
    return "";
  }
  return remoteBrandGlyphColor(tile);
}

function remoteBrandGlyphColor(tileColor) {
  const color = normalizeHexColor(tileColor);
  if (!color) {
    return "";
  }
  return remoteBrandTilePrefersDarkGlyph(color) ? "#102019" : "#ffffff";
}

function remoteBrandTilePrefersDarkGlyph(tileColor) {
  const stats = hexColorStats(tileColor);
  if (!stats) {
    return false;
  }
  if (nearWhiteBrandColor(tileColor)) {
    return true;
  }
  const whiteIsTooWeak = stats.lightContrast < 2.85 && stats.darkContrast >= 3;
  const warmBright = stats.hue >= 30 && stats.hue <= 95 && stats.luminance >= 0.38;
  const vividBright = stats.luminance >= 0.46 && stats.darkContrast >= stats.lightContrast + 2;
  return whiteIsTooWeak || warmBright || vividBright;
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

function iconTileNeedsWhiteGlyph(tileColor) {
  const hex = normalizeHexColor(tileColor);
  if (!hex) {
    return false;
  }
  return readableIconGlyphColor(hex) === "#ffffff";
}

function refreshAdaptiveSiteIcons() {
  const requestTheme = document.documentElement.dataset.theme;
  document.querySelectorAll('img[data-icon-tile="brand"][data-icon-source]').forEach((icon) => {
    const source = icon.dataset.iconSource || "";
    if (!source) {
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
    if (icon.dataset.iconCacheHydrated === "true") {
      return;
    }
    applySiteIcon(icon, {
      title: icon.dataset.siteTitle || icon.alt || "",
      url: icon.dataset.siteUrl || ""
    });
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
  const request = isSvgDataUrl(source)
    ? Promise.resolve(svgTextDataUrl(applySvgGlyphColor(decodeSvgDataUrl(source), color)))
    : fetch(source)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Icon request failed: ${response.status}`);
        }
        return response.text();
      })
      .then((svg) => svgTextDataUrl(applySvgGlyphColor(svg, color)))
      .catch(() => source);
  whiteSvgIconDataUrlCache.set(cacheKey, request);
  return request;
}

function normalizeSvgGlyphColor(svg) {
  return applySvgGlyphColor(svg, "#ffffff");
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
    applySiteIconTile(icon, {
      title: icon.dataset.siteTitle || icon.alt || "",
      url: icon.dataset.siteUrl || ""
    }, nextIcon);
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
  const sample = sampleFaviconImageData(icon);
  if (!sample) {
    probeUnreadableFaviconCandidate(icon, options);
    return;
  }
  applyFaviconSampleDecision(icon, sample, options);
}

function applyFaviconSampleDecision(icon, sample, options = {}) {
  if (faviconSampleLooksLikeBrowserDefault(sample)) {
    if (options.trustSiteIcon) {
      const color = dominantFaviconSampleBackgroundColor(sample);
      const tileColors = color?.confidence ? faviconMatchedTileColors(color) : null;
      if (tileColors) {
        applySampledFaviconTile(icon, sample, color, tileColors);
        cacheRenderedSiteIconFromContext(icon);
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
  const color = dominantFaviconSampleBackgroundColor(sample);
  if (!color || !color.confidence) {
    return;
  }
  const tileColors = faviconMatchedTileColors(color);
  if (!tileColors) {
    return;
  }
  applySampledFaviconTile(icon, sample, color, tileColors);
  cacheRenderedSiteIconFromContext(icon);
}

function applySampledFaviconTile(icon, sample, color, tileColors) {
  const tileMode = icon.dataset.iconTile === "brand" ? "brand" : "plain";
  const hasLocalIcon = icon.classList.contains("site-icon-local");
  applyIconTile(icon, tileMode, tileColors, hasLocalIcon);
  fuseEmbeddedFaviconTile(icon, sample, color, tileColors);
}

function fuseEmbeddedFaviconTile(icon, sample, color, tileColors) {
  const tileColor = document.documentElement.dataset.theme === "dark"
    ? tileColors.dark
    : tileColors.light;
  if (!faviconShouldFuseEmbeddedTile(color, tileColor)) {
    delete icon.dataset.iconFusedTile;
    return;
  }
  const fused = fusedEmbeddedFaviconPixelData(sample, tileColor);
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

function applyDiscoveredSiteFaviconCandidateUrls(icon, candidateUrls = [], seed = "", rescueCandidateToken = "") {
  applyDiscoveredSiteFaviconCandidates(
    icon,
    candidateUrls.filter(Boolean).map((candidateUrl) => ({ url: candidateUrl, source: "url" })),
    seed,
    rescueCandidateToken
  );
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

function dominantImageBackgroundColor(image) {
  const sample = sampleFaviconImageData(image);
  return sample ? dominantFaviconSampleBackgroundColor(sample) : null;
}

function dominantFaviconSampleBackgroundColor(sample) {
  return selectFaviconBackgroundCandidate(analyzeFaviconImageColors(sample.data, sample.size), sample.size);
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

function selectFaviconBackgroundCandidate(analysis, size) {
  if (!analysis.pixels.length || !analysis.buckets.size) {
    return null;
  }
  const baseBuckets = [...analysis.buckets.values()]
    .filter((bucket) => bucket.weight)
    .map(faviconAverageColorBucket)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 14);
  const candidates = baseBuckets
    .map((bucket) => faviconBackgroundCandidateFromBucket(bucket, analysis, size))
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || b.confidence - a.confidence);
  const candidate = (candidates[0]?.confidence || 0) >= FAVICON_BACKGROUND_CONFIDENCE_MIN
    ? candidates[0]
    : faviconTransparentGlyphCandidateFromBucket(baseBuckets[0], analysis);
  if (!candidate?.confidence) {
    return null;
  }
  const matchMode = faviconBackgroundMatchMode(candidate);
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
    matchMode,
    foreground: faviconForegroundStatsForCandidate(selectedColor, analysis, size)
  };
  return selected;
}

function faviconTransparentGlyphCandidateFromBucket(bucket, analysis) {
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
  if (
    opaqueCoverage < FAVICON_TRANSPARENT_GLYPH_COVERAGE_MIN
    || opaqueCoverage > FAVICON_TRANSPARENT_GLYPH_COVERAGE_MAX
    || coverage / opaqueCoverage < FAVICON_TRANSPARENT_GLYPH_CANDIDATE_RATIO_MIN
    || edgeConfidence > FAVICON_TRANSPARENT_GLYPH_EDGE_CONFIDENCE_MAX
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
      spansCenter: false,
      span: 0
    };
  }
  const bounds = { minX, minY, maxX, maxY };
  return {
    coverage: weight / Math.max(1, analysis.totalWeight),
    averageContrast: contrastWeight / weight,
    maxContrast,
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
    || (color.edgeConfidence || 0) > FAVICON_TRANSPARENT_GLYPH_EDGE_CONFIDENCE_MAX
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

function faviconCandidateNeedsReadableCarrier(color, tileColor) {
  return faviconCandidateLooksLikeTransparentGlyph(color, tileColor)
    || faviconCandidateLooksLikeNearWhiteGlyph(color, tileColor);
}

function faviconShouldFuseEmbeddedTile(color, tileColor) {
  const background = normalizeHexColor(tileColor);
  if (!background || color?.matchMode !== "embedded-tile" || !faviconCandidateHasEmbeddedForeground(color)) {
    return false;
  }
  return rgbChannelsToHex(color.red, color.green, color.blue) === background;
}

function fusedEmbeddedFaviconPixelData(sample, tileColor) {
  const background = normalizeHexColor(tileColor);
  if (!sample?.data || !sample.size || !background) {
    return null;
  }
  const [tileRed, tileGreen, tileBlue] = hexToRgb(background);
  const clearLimit = FAVICON_EMBEDDED_TILE_FUSION_CLEAR_DISTANCE;
  const featherLimit = clearLimit + FAVICON_EMBEDDED_TILE_FUSION_FEATHER_DISTANCE;
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

function faviconMatchedTileColors(color) {
  if (!faviconColorShouldUseOriginalTile(color)) {
    return null;
  }
  const tileColor = rgbChannelsToHex(color.red, color.green, color.blue);
  if (color.matchMode === "embedded-tile") {
    return faviconSeparatedTileColors(tileColor, color);
  }
  return faviconSurfaceTileColors(tileColor, color);
}

function faviconSurfaceTileColors(tileColor, color) {
  const preferReadableCarrier = faviconCandidateNeedsReadableCarrier(color, tileColor);
  const carrier = faviconCarrierTileColor(tileColor, "dark", { preferReadableCarrier });
  return {
    light: carrier,
    dark: carrier
  };
}

function faviconSeparatedTileColors(tileColor, color) {
  const preferReadableCarrier = faviconCandidateNeedsReadableCarrier(color, tileColor);
  const carrier = faviconCarrierTileColor(tileColor, "dark", {
    preferReadableCarrier,
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
    return faviconReadableCarrierTileColor(color, mode);
  }
  if (!options.separate) {
    return color;
  }
  const luminance = relativeLuminance(color);
  const target = luminance < (mode === "dark" ? 0.48 : 0.58) ? "#ffffff" : "#000000";
  const initialAmount = mode === "dark" ? 0.18 : 0.24;
  return mixColorUntilContrast(color, target, FAVICON_EMBEDDED_TILE_CONTRAST_MIN, initialAmount);
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

function faviconColorShouldUseOriginalTile(color) {
  return color.confidence >= FAVICON_BACKGROUND_CONFIDENCE_MIN;
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
    bookmarkGrid.replaceChildren(fragment);
  } catch (error) {
    console.warn("Failed to load bookmarks", error);
    renderBookmarkEmptyState(t("bookmarkReadFailed"));
  }
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
  if (favoriteKeys.has(favoriteKey) || favorites.length >= MAX_FAVORITE_SITES) {
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

function renderMediaFeedDefaultList() {
  if (!mediaFeedDefaultList) {
    return;
  }
  const fragment = document.createDocumentFragment();
  const heading = document.createElement("span");
  heading.className = "media-feed-default-heading";
  heading.textContent = t("mediaFeedDefaultSources");
  fragment.appendChild(heading);
  MEDIA_FEED_SOURCES
    .filter((source) => source.language === MEDIA_FEED_LOCALE_LANGUAGE)
    .forEach((source) => {
    const item = document.createElement("button");
    const title = document.createElement("strong");
    const url = document.createElement("span");
    item.className = "media-feed-default-item";
    item.type = "button";
    title.textContent = `${source.title} · ${t(source.language === "zh" ? "mediaFeedLanguageZh" : "mediaFeedLanguageEn")}`;
    url.textContent = source.url;
    item.append(title, url);
    item.addEventListener("click", () => {
      mediaFeedUrlInput.value = source.url;
      mediaFeedLanguageSelect.value = source.language;
      mediaFeedFormError.textContent = "";
      mediaFeedUrlInput.focus();
    });
    fragment.appendChild(item);
  });
  mediaFeedDefaultList.replaceChildren(fragment);
}

function activateMediaFeedType(type) {
  if (!mediaFeedTypeButtons.length) {
    return;
  }
  const nextType = MEDIA_FEED_TYPE_FILTERS.has(type) ? type : "all";
  activeMediaFeedType = nextType;
  mediaFeedTypeButtons.forEach((button) => {
    const isActive = button.dataset.mediaFeedType === nextType;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
  renderMediaFeedForActiveType();
}

function toggleMediaFeedForm() {
  if (!mediaFeedForm) {
    return;
  }
  if (mediaFeedForm.hidden) {
    showMediaFeedForm();
    return;
  }
  hideMediaFeedForm();
}

function showMediaFeedForm() {
  if (!mediaFeedForm) {
    return;
  }
  mediaFeedForm.hidden = false;
  toggleMediaFeedFormButton.setAttribute("aria-expanded", "true");
  mediaFeedFormError.textContent = "";
  mediaFeedUrlInput.focus();
}

function hideMediaFeedForm() {
  if (!mediaFeedForm) {
    return;
  }
  mediaFeedForm.hidden = true;
  toggleMediaFeedFormButton.setAttribute("aria-expanded", "false");
  mediaFeedForm.reset();
  mediaFeedLanguageSelect.value = "zh";
  mediaFeedFormError.textContent = "";
}

async function handleMediaFeedSubmit(event) {
  event.preventDefault();
  if (!mediaFeedForm) {
    return;
  }
  const url = normalizeMediaFeedUrl(mediaFeedUrlInput.value);
  if (!url) {
    mediaFeedFormError.textContent = t("mediaFeedInvalidUrl");
    mediaFeedUrlInput.focus();
    return;
  }

  try {
    const feeds = await loadCustomMediaFeeds();
    const nextFeeds = [
      {
        id: `custom-${Date.now()}`,
        title: readableHostName(new URL(url).hostname),
        language: mediaFeedLanguageSelect.value === "en" ? "en" : "zh",
        url
      },
      ...feeds.filter((feed) => feed.url !== url)
    ].slice(0, MAX_CUSTOM_MEDIA_FEEDS);
    if (feeds.length >= MAX_CUSTOM_MEDIA_FEEDS && !feeds.some((feed) => feed.url === url)) {
      mediaFeedFormError.textContent = t("mediaFeedLimit", { count: MAX_CUSTOM_MEDIA_FEEDS });
      return;
    }
    await saveCustomMediaFeeds(nextFeeds);
    hideMediaFeedForm();
    refreshMediaFeed();
  } catch (error) {
    console.warn("Failed to save custom media feed", error);
    mediaFeedFormError.textContent = t("mediaFeedSaveFailed");
  }
}

function normalizeMediaFeedUrl(value) {
  const text = normalizeText(value);
  if (!text || text.length > MAX_PORTAL_URL_LENGTH) {
    return "";
  }
  const url = safeUrl(text);
  if (!url || !["http:", "https:"].includes(url.protocol) || url.username || url.password) {
    return "";
  }
  return url.href;
}

async function loadMediaFeedSources() {
  const customFeeds = await loadCustomMediaFeeds();
  const seen = new Set();
  const localeSources = MEDIA_FEED_SOURCES.filter((source) => source.language === MEDIA_FEED_LOCALE_LANGUAGE);
  return [...customFeeds, ...localeSources].filter((source) => {
    if (!source.url || seen.has(source.url)) {
      return false;
    }
    seen.add(source.url);
    return true;
  });
}

async function loadCustomMediaFeeds() {
  const result = await getStoredValues({ [CUSTOM_MEDIA_FEEDS_STORAGE_KEY]: [] });
  return Array.isArray(result[CUSTOM_MEDIA_FEEDS_STORAGE_KEY])
    ? result[CUSTOM_MEDIA_FEEDS_STORAGE_KEY].map(normalizeStoredMediaFeed).filter(Boolean).slice(0, MAX_CUSTOM_MEDIA_FEEDS)
    : [];
}

function normalizeStoredMediaFeed(feed) {
  const url = normalizeMediaFeedUrl(feed?.url);
  if (!url) {
    return null;
  }
  return {
    id: normalizeText(feed?.id) || `custom-${url}`,
    title: normalizeText(feed?.title) || readableHostName(safeUrl(url)?.hostname),
    language: feed?.language === "en" ? "en" : "zh",
    url
  };
}

async function saveCustomMediaFeeds(feeds) {
  await setStoredValues({ [CUSTOM_MEDIA_FEEDS_STORAGE_KEY]: feeds });
}

async function initMediaFeedFeedback() {
  try {
    const result = await getStoredValues({ [MEDIA_FEED_FEEDBACK_STORAGE_KEY]: normalizeMediaFeedFeedback() });
    activeMediaFeedFeedback = normalizeMediaFeedFeedback(result[MEDIA_FEED_FEEDBACK_STORAGE_KEY]);
  } catch (error) {
    console.warn("Failed to load media feed feedback", error);
    activeMediaFeedFeedback = normalizeMediaFeedFeedback();
  }
}

async function saveMediaFeedFeedback() {
  await setStoredValues({
    [MEDIA_FEED_FEEDBACK_STORAGE_KEY]: normalizeMediaFeedFeedback(activeMediaFeedFeedback)
  });
}

function normalizeMediaFeedFeedback(feedback = {}) {
  return {
    version: 1,
    updatedAt: Number(feedback.updatedAt || 0),
    items: normalizeMediaFeedFeedbackBucket(feedback.items),
    topics: normalizeMediaFeedFeedbackBucket(feedback.topics),
    sources: normalizeMediaFeedFeedbackBucket(feedback.sources),
    signatures: normalizeMediaFeedFeedbackBucket(feedback.signatures),
    keywords: normalizeMediaFeedFeedbackBucket(feedback.keywords)
  };
}

function normalizeMediaFeedFeedbackBucket(bucket = {}) {
  return Object.fromEntries(Object.entries(bucket)
    .map(([key, value]) => [normalizeText(key), Math.max(0, Math.min(99, Number(value) || 0))])
    .filter(([key, value]) => key && value > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, MAX_MEDIA_FEED_FEEDBACK_KEYS));
}

function incrementMediaFeedFeedback(bucket, key, amount = 1) {
  const normalizedKey = normalizeText(key);
  if (!normalizedKey) {
    return;
  }
  bucket[normalizedKey] = Math.min(99, Number(bucket[normalizedKey] || 0) + amount);
}

async function refreshMediaFeed() {
  if (!mediaFeedList || !refreshMediaFeedButton) {
    return;
  }
  const requestId = activeMediaFeedRequestId + 1;
  activeMediaFeedRequestId = requestId;
  mediaFeedRefreshSeed += 1;
  mediaFeedList.replaceChildren();
  mediaFeedList.scrollTop = 0;
  setMediaFeedState("loading", t("mediaFeedLoadingTitle"), t("mediaFeedLoadingBody"));
  refreshMediaFeedButton.disabled = true;
  try {
    const items = await withTimeout(fetchMediaFeedItems(), MEDIA_FEED_TOTAL_TIMEOUT_MS, "Media feed refresh timed out.");
    if (requestId !== activeMediaFeedRequestId) {
      return;
    }
    latestMediaFeedItems = items;
    renderMediaFeedForActiveType();
    if (mediaFeedUpdated) {
      mediaFeedUpdated.textContent = "";
    }
    if (!latestMediaFeedItems.length) {
      setMediaFeedState("empty", t("mediaFeedEmptyTitle"), t("mediaFeedEmptyBody"));
    }
  } catch (error) {
    if (requestId !== activeMediaFeedRequestId) {
      return;
    }
    console.warn("Failed to load media feed", error);
    latestMediaFeedItems = [];
    mediaFeedList.replaceChildren();
    if (mediaFeedUpdated) {
      mediaFeedUpdated.textContent = "";
    }
    setMediaFeedState("error", t("mediaFeedFailedTitle"), t("mediaFeedFailedBody"));
  } finally {
    if (requestId === activeMediaFeedRequestId) {
      refreshMediaFeedButton.disabled = false;
    }
  }
}

async function fetchMediaFeedItems() {
  const sources = await loadMediaFeedSources();
  const [sourceResults, discoveryResults] = await Promise.allSettled([
    runLimited(sources, fetchMediaFeedSource, MEDIA_FEED_CONCURRENCY),
    runLimited(mediaFeedDiscoverySourcesForLocale(), fetchMediaFeedDiscoverySource, MEDIA_FEED_CONCURRENCY)
  ]);
  const allResults = [
    ...(sourceResults.status === "fulfilled" ? sourceResults.value : []),
    ...(discoveryResults.status === "fulfilled" ? discoveryResults.value : [])
  ];
  const seenUrls = new Set();
  let candidates = allResults
    .flatMap((result) => result.status === "fulfilled" ? result.value : [])
    .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0))
    .filter((item) => {
      if (seenUrls.has(item.url)) {
        return false;
      }
      seenUrls.add(item.url);
      return true;
    })
    .map(enrichMediaFeedItem)
    .sort(compareAgentMediaFeedItems);
  if (!candidates.length && isFilePreviewMode()) {
    candidates = await fetchMediaFeedPreviewFallback();
  }
  const displayCandidates = candidates.filter((item) => !isMediaFeedItemDismissed(item));
  const filteredItems = displayCandidates.filter(isHighValueMediaFeedItem);
  const items = (filteredItems.length ? filteredItems : displayCandidates).slice(0, MEDIA_FEED_ITEM_LIMIT);
  if (!items.length && allResults.some((result) => result.status === "rejected")) {
    throw new Error("All media feed sources failed or returned no displayable items.");
  }
  return items;
}

async function runLimited(items, task, limit) {
  const results = [];
  let cursor = 0;
  const workerCount = Math.min(limit, items.length);
  await Promise.all(Array.from({ length: workerCount }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      try {
        results[index] = { status: "fulfilled", value: await task(items[index]) };
      } catch (error) {
        results[index] = { status: "rejected", reason: error };
      }
    }
  }));
  return results.filter(Boolean);
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

function isFilePreviewMode() {
  return location.protocol === "file:";
}

async function fetchMediaFeedPreviewFallback() {
  const sources = (await loadMediaFeedSources()).slice(0, 4);
  const results = await Promise.allSettled(sources.map(fetchMediaFeedReaderSource));
  const seenUrls = new Set();
  return results
    .flatMap((result) => result.status === "fulfilled" ? result.value : [])
    .filter((item) => {
      if (seenUrls.has(item.url)) {
        return false;
      }
      seenUrls.add(item.url);
      return true;
    })
    .map(enrichMediaFeedItem)
    .sort(compareAgentMediaFeedItems)
    .slice(0, MEDIA_FEED_ITEM_LIMIT);
}

async function fetchMediaFeedReaderSource(source) {
  const readerUrl = `https://r.jina.ai/http://r.jina.ai/http://${source.url}`;
  const response = await fetch(readerUrl, { cache: "reload" });
  if (!response.ok) {
    return [];
  }
  const markdown = await response.text();
  return mediaFeedItemsFromReaderMarkdown(markdown, source);
}

function mediaFeedItemsFromReaderMarkdown(markdown, source) {
  const items = [];
  const headingPattern = /^#{2,3}\s+\[([^\]]+)\]\((https?:\/\/[^)]+)\)/gm;
  let match;
  while ((match = headingPattern.exec(markdown)) && items.length < MEDIA_FEED_SOURCE_ITEM_LIMIT) {
    const title = cleanFeedText(match[1]);
    const url = normalizeFeedUrl(match[2]);
    if (!title || !url) {
      continue;
    }
    const followingText = markdown.slice(headingPattern.lastIndex, headingPattern.lastIndex + 220);
    const dateMatch = followingText.match(/[A-Z][a-z]{2},\s+\d{1,2}\s+[A-Z][a-z]{2}\s+\d{4}[^\\n]*/);
    items.push({
      id: `${source.id}-${url}`,
      title,
      url,
      language: source.language,
      sourceId: source.id,
      sourceTitle: source.title,
      sourceIcon: extensionIconFallbackChain(source.url, 64)[0] || generatedSiteIconDataUrl(source.title.slice(0, 2).toUpperCase(), source.url),
      sourceIconCandidates: extensionIconFallbackChain(source.url, 64),
      image: "",
      imageCandidates: [],
      createdAt: dateMatch ? Date.parse(dateMatch[0]) : Date.now() - items.length * 60000,
      summary: ""
    });
  }
  return items;
}

async function fetchMediaFeedSource(source) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), MEDIA_FEED_TIMEOUT_MS);
  try {
    const response = await fetch(withMediaFeedRefreshParam(source.url), {
      cache: "reload",
      signal: controller.signal,
      headers: { "Cache-Control": "no-cache" }
    });
    if (!response.ok) {
      throw new Error(`Media feed request failed: ${response.status}`);
    }
    const xmlText = await response.text();
    const documentNode = new DOMParser().parseFromString(xmlText, "application/xml");
    if (documentNode.querySelector("parsererror")) {
      throw new Error("Media feed XML parse failed.");
    }
    const sourceMeta = mediaFeedSourceMeta(documentNode, source);
    return feedDescendants(documentNode)
      .filter((node) => ["item", "entry"].includes(node.localName?.toLowerCase()))
      .map((item) => normalizeMediaFeedItem(item, source, sourceMeta))
      .filter(Boolean)
      .slice(0, MEDIA_FEED_SOURCE_ITEM_LIMIT);
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function mediaFeedDiscoverySourcesForLocale() {
  return MEDIA_FEED_DISCOVERY_SOURCES.filter((source) => source.language === MEDIA_FEED_LOCALE_LANGUAGE);
}

async function fetchMediaFeedDiscoverySource(source) {
  if (source.type === "hn") {
    return fetchHackerNewsFeed(source);
  }
  if (source.type === "v2ex") {
    return fetchV2exFeed(source);
  }
  if (source.type === "lobsters") {
    return fetchLobstersFeed(source);
  }
  if (source.type === "arxiv") {
    return fetchArxivFeed(source);
  }
  if (source.type === "devto") {
    return fetchDevtoFeed(source);
  }
  return [];
}

async function fetchJsonWithTimeout(url) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), MEDIA_FEED_TIMEOUT_MS);
  try {
    const response = await fetch(withMediaFeedRefreshParam(url), {
      cache: "reload",
      signal: controller.signal,
      headers: { "Cache-Control": "no-cache" }
    });
    if (!response.ok) {
      throw new Error(`Media discovery request failed: ${response.status}`);
    }
    return response.json();
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function withMediaFeedRefreshParam(url) {
  const parsed = safeUrl(url);
  if (!parsed) {
    return url;
  }
  parsed.searchParams.set("_wayleaf_refresh", String(mediaFeedRefreshSeed));
  return parsed.href;
}

async function fetchHackerNewsFeed(source) {
  const ids = await fetchJsonWithTimeout(source.listUrl);
  if (!Array.isArray(ids)) {
    return [];
  }
  const offset = mediaFeedRefreshSeed % 3;
  const selectedIds = ids.slice(offset, offset + MEDIA_FEED_DISCOVERY_ITEM_LIMIT);
  const storyResults = await Promise.allSettled(selectedIds.map((id) => fetchJsonWithTimeout(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)));
  return storyResults
    .flatMap((result) => result.status === "fulfilled" ? [result.value] : [])
    .filter((story) => story?.title && !story.deleted && !story.dead)
    .map((story) => createDiscoveryMediaFeedItem(source, {
      id: story.id,
      title: story.title,
      url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
      summary: t("mediaFeedMetricHn", { score: Number(story.score || 0), comments: Number(story.descendants || 0) }),
      createdAt: Number(story.time || 0) * 1000,
      metrics: { score: Number(story.score || 0), comments: Number(story.descendants || 0) }
    }))
    .filter(Boolean);
}

async function fetchV2exFeed(source) {
  const items = await fetchJsonWithTimeout(source.url);
  return Array.isArray(items) ? items.slice(0, MEDIA_FEED_DISCOVERY_ITEM_LIMIT).map((item) => createDiscoveryMediaFeedItem(source, {
    id: item.id,
    title: item.title,
    url: item.url,
    summary: `${item.node?.title || "V2EX"} · ${t("mediaFeedMetricReplies", { count: Number(item.replies || 0) })}`,
    createdAt: Number(item.last_touched || item.created || 0) * 1000,
    metrics: { comments: Number(item.replies || 0) }
  })).filter(Boolean) : [];
}

async function fetchLobstersFeed(source) {
  const items = await fetchJsonWithTimeout(source.url);
  return Array.isArray(items) ? items.slice(0, MEDIA_FEED_DISCOVERY_ITEM_LIMIT).map((item) => createDiscoveryMediaFeedItem(source, {
    id: item.short_id,
    title: item.title,
    url: item.url || item.comments_url,
    summary: `${item.tags?.join(", ") || "Lobsters"} · ${t("mediaFeedMetricHn", { score: Number(item.score || 0), comments: Number(item.comment_count || 0) })}`,
    createdAt: Date.parse(item.created_at || ""),
    metrics: { score: Number(item.score || 0), comments: Number(item.comment_count || 0) }
  })).filter(Boolean) : [];
}

async function fetchArxivFeed(source) {
  const query = `https://export.arxiv.org/api/query?search_query=cat:${encodeURIComponent(source.category)}&max_results=${MEDIA_FEED_DISCOVERY_ITEM_LIMIT}&sortBy=submittedDate&sortOrder=descending`;
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), MEDIA_FEED_TIMEOUT_MS);
  try {
    const response = await fetch(withMediaFeedRefreshParam(query), { cache: "reload", signal: controller.signal });
    if (!response.ok) {
      throw new Error(`arXiv request failed: ${response.status}`);
    }
    const xmlText = await response.text();
    const documentNode = new DOMParser().parseFromString(xmlText, "application/xml");
    return feedDescendants(documentNode)
      .filter((node) => node.localName?.toLowerCase() === "entry")
      .map((entry) => createDiscoveryMediaFeedItem(source, {
        id: feedNodeText(entry, ["id"]),
        title: cleanFeedText(feedNodeText(entry, ["title"])),
        url: normalizeFeedUrl(feedNodeText(entry, ["id"])),
        summary: truncateText(cleanFeedText(feedNodeText(entry, ["summary"])), 140),
        createdAt: Date.parse(feedNodeText(entry, ["published", "updated"]) || ""),
        metrics: { score: 12 }
      }))
      .filter(Boolean);
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function fetchDevtoFeed(source) {
  const items = await fetchJsonWithTimeout(`https://dev.to/api/articles?tag=${encodeURIComponent(source.tag)}&per_page=${MEDIA_FEED_DISCOVERY_ITEM_LIMIT}`);
  return Array.isArray(items) ? items.map((item) => createDiscoveryMediaFeedItem(source, {
    id: item.id,
    title: item.title,
    url: item.url,
    summary: `${item.tag_list?.slice(0, 4).join(", ") || "DEV.to"} · ${t("mediaFeedMetricReactions", { reactions: Number(item.public_reactions_count || 0), comments: Number(item.comments_count || 0) })}`,
    createdAt: Date.parse(item.published_at || ""),
    metrics: { score: Number(item.public_reactions_count || 0), comments: Number(item.comments_count || 0) }
  })).filter(Boolean) : [];
}

function createDiscoveryMediaFeedItem(source, data) {
  const url = normalizeFeedUrl(data.url);
  const title = cleanFeedText(data.title);
  if (!url || !title) {
    return null;
  }
  return {
    id: `${source.id}-${data.id || url}`,
    title,
    url,
    language: /[\u4e00-\u9fff]/.test(title) ? "zh" : "en",
    sourceId: source.id,
    sourceTitle: source.sourceTitle,
    sourceIcon: extensionIconFallbackChain(url, 64)[0] || generatedSiteIconDataUrl(source.sourceTitle.slice(0, 2).toUpperCase(), url),
    sourceIconCandidates: extensionIconFallbackChain(url, 64),
    image: "",
    imageCandidates: [],
    createdAt: Number.isFinite(data.createdAt) ? data.createdAt : 0,
    summary: normalizeText(data.summary),
    discoveryTopic: source.topic,
    discoveryScore: source.score,
    discoveryMetrics: data.metrics || {}
  };
}

function normalizeMediaFeedItem(item, source, sourceMeta) {
  const title = cleanFeedText(feedNodeText(item, ["title"]));
  const url = normalizeFeedUrl(feedNodeText(item, ["link"]) || feedLinkHref(item));
  if (!title || !url) {
    return null;
  }

  const summary = mediaFeedSummary(item);
  const imageCandidates = mediaFeedImages(item);
  const createdAt = Date.parse(feedNodeText(item, ["pubDate", "published", "updated", "date"]) || "");
  const sourceTitle = sourceMeta.title;
  return {
    id: `${source.id}-${url}`,
    title,
    url,
    language: source.language,
    sourceId: source.id,
    sourceTitle,
    sourceIcon: sourceMeta.icon,
    sourceIconCandidates: sourceMeta.iconCandidates,
    image: imageCandidates[0] || "",
    imageCandidates,
    createdAt: Number.isFinite(createdAt) ? createdAt : 0,
    summary
  };
}

function mediaFeedSourceMeta(documentNode, source) {
  const root = feedDescendants(documentNode).find((node) => ["channel", "feed"].includes(node.localName?.toLowerCase())) || documentNode.documentElement;
  const title = cleanFeedText(feedNodeText(root, ["title"])) || normalizeText(source.title) || readableHostName(safeUrl(source.url)?.hostname);
  const siteUrl = normalizeFeedUrl(feedNodeText(root, ["link"]) || feedLinkHref(root)) || safeUrl(source.url)?.origin || source.url;
  const iconCandidates = [
    feedNodeText(root, ["icon"]),
    feedNodeText(root, ["logo"]),
    feedNodeText(root, ["image"]),
    ...mediaFeedImages(root),
    ...extensionIconFallbackChain(siteUrl, 64)
  ].map(normalizeIconCandidateUrl).filter(Boolean);
  return {
    title,
    siteUrl,
    icon: iconCandidates[0] || "",
    iconCandidates
  };
}

function normalizeIconCandidateUrl(value) {
  const text = normalizeText(value).replaceAll("&amp;", "&");
  if (!text) {
    return "";
  }
  if (text.startsWith("data:image/") || text.startsWith("icons/") || text.startsWith("chrome-extension://")) {
    return text;
  }
  return isWebUrl(text) ? text : "";
}

function normalizeFeedUrl(value) {
  const text = normalizeText(value).replaceAll("&amp;", "&");
  return isWebUrl(text) ? text : "";
}

function feedNodeText(root, selectors) {
  for (const selector of selectors) {
    const node = feedFirstElement(root, selector);
    if (node) {
      return normalizeText(node.textContent);
    }
  }
  return "";
}

function feedLinkHref(item) {
  const alternateLink = feedChildElements(item, "link")
    .find((link) => !link.getAttribute("rel") || link.getAttribute("rel") === "alternate");
  return normalizeText(alternateLink?.getAttribute("href"));
}

function mediaFeedSummary(item) {
  const body = cleanFeedText(feedNodeText(item, ["description", "summary", "encoded", "content"]));
  if (body) {
    return truncateText(body, 110);
  }
  return "";
}

function mediaFeedImages(item) {
  const candidates = [];
  const directImage = feedNodeText(item, ["image"]);
  if (directImage) {
    candidates.push(directImage);
  }
  feedDescendants(item).forEach((node) => {
    const name = node.localName?.toLowerCase();
    const type = node.getAttribute("type") || "";
    const url = node.getAttribute("url");
    if ((["thumbnail", "content"].includes(name) && url) || (name === "enclosure" && /^image\//i.test(type) && url)) {
      candidates.push(url);
    }
  });
  const html = feedNodeText(item, ["encoded", "content", "description", "summary"]);
  candidates.push(...imagesFromHtml(html));
  return [...new Set(candidates.map(normalizeFeedUrl).filter(Boolean))];
}

function feedFirstElement(root, localName) {
  return feedChildElements(root, localName)[0] || null;
}

function feedChildElements(root, localName) {
  const expected = String(localName || "").toLowerCase();
  return [...root.children].filter((node) => node.localName?.toLowerCase() === expected);
}

function feedDescendants(root) {
  return [...root.getElementsByTagName("*")];
}

function imagesFromHtml(html) {
  if (!html) {
    return [];
  }
  const element = document.createElement("div");
  element.innerHTML = html;
  return [...element.querySelectorAll("img")].flatMap((image) => [
    image.currentSrc,
    image.getAttribute("src"),
    ...srcsetUrls(image.getAttribute("srcset")),
    ...srcsetUrls(image.getAttribute("data-srcset")),
    image.getAttribute("data-src")
  ].filter(Boolean));
}

function srcsetUrls(value) {
  return normalizeText(value)
    .split(",")
    .map((candidate) => normalizeText(candidate).split(/\s+/)[0])
    .filter(Boolean);
}

function cleanFeedText(value) {
  const html = normalizeText(value);
  if (!html) {
    return "";
  }
  const element = document.createElement("div");
  element.innerHTML = html;
  return normalizeText(element.textContent || "");
}

function truncateText(value, maxLength) {
  const text = normalizeText(value);
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength - 1).trim()}…`;
}

function enrichMediaFeedItem(item) {
  const profile = MEDIA_FEED_SOURCE_PROFILES[item.sourceId] || {};
  const topic = detectMediaFeedTopic(item, item.discoveryTopic || profile.topic);
  const createdAt = Number(item.createdAt || 0);
  const hoursAgo = createdAt ? Math.max(0, (Date.now() - createdAt) / 3600000) : 72;
  const freshnessScore = Math.max(0, 18 - Math.min(18, hoursAgo));
  const titleBoost = mediaFeedSignalScore(item.title);
  const summaryBoost = mediaFeedSignalScore(item.summary) * 0.45;
  const metricBoost = mediaFeedMetricScore(item.discoveryMetrics);
  const refreshBoost = mediaFeedRefreshJitter(item.id) * 8;
  const baseScore = (item.discoveryScore || profile.score || 6) + freshnessScore + titleBoost + summaryBoost + metricBoost + refreshBoost;
  const agentSignature = mediaFeedSignature(`${item.title} ${item.summary}`);
  const feedbackPenalty = mediaFeedFeedbackPenalty({ ...item, agentTopic: topic.id, agentSignature });
  return {
    ...item,
    agentTopic: topic.id,
    agentTopicLabelKey: topic.labelKey,
    agentReasonKey: topic.reasonKey,
    agentBaseScore: Math.round(baseScore),
    agentFeedbackPenalty: feedbackPenalty,
    agentScore: Math.round(baseScore - feedbackPenalty),
    agentSignature
  };
}

function mediaFeedFeedbackPenalty(item) {
  const feedback = activeMediaFeedFeedback || normalizeMediaFeedFeedback();
  const sourceKey = mediaFeedFeedbackSourceKey(item);
  const keywordPenalty = mediaFeedFeedbackKeywords(item)
    .reduce((total, keyword) => total + Math.min(4, Number(feedback.keywords[keyword] || 0) * 1.4), 0);
  return Math.min(34,
    (Number(feedback.topics[item.agentTopic] || 0) * 5) +
    (Number(feedback.sources[sourceKey] || 0) * 7) +
    (Number(feedback.signatures[item.agentSignature] || 0) * 16) +
    Math.min(12, keywordPenalty)
  );
}

function isMediaFeedItemDismissed(item) {
  const feedback = activeMediaFeedFeedback || normalizeMediaFeedFeedback();
  return Boolean(feedback.items[item.id] || feedback.signatures[item.agentSignature]);
}

function mediaFeedFeedbackSourceKey(item) {
  return normalizeText(item.sourceId || item.sourceTitle).toLowerCase();
}

function mediaFeedFeedbackKeywords(item) {
  return normalizeText(`${item.title} ${item.summary}`)
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !["the", "and", "for", "with", "from", "this", "that"].includes(token))
    .slice(0, 8);
}

function detectMediaFeedTopic(item, fallbackTopic = "product") {
  const text = `${item.title} ${item.summary} ${item.sourceTitle}`.toLowerCase();
  let bestRule = MEDIA_FEED_TOPIC_RULES.find((rule) => rule.id === fallbackTopic) || MEDIA_FEED_TOPIC_RULES[0];
  let bestScore = 0;
  MEDIA_FEED_TOPIC_RULES.forEach((rule) => {
    const score = rule.keywords.reduce((total, keyword) => total + (text.includes(keyword.toLowerCase()) ? 1 : 0), 0);
    if (score > bestScore) {
      bestRule = rule;
      bestScore = score;
    }
  });
  return bestRule;
}

function mediaFeedSignalScore(value) {
  const text = normalizeText(value).toLowerCase();
  const signalWords = ["release", "launch", "open source", "research", "security", "funding", "ipo", "breakthrough", "agent", "api", "architecture", "benchmark", "postmortem", "deep dive", "发布", "开源", "研究", "漏洞", "融资", "上市", "突破", "模型", "智能体", "架构", "基准", "复盘", "深度"];
  return signalWords.reduce((total, word) => total + (text.includes(word) ? 2 : 0), 0);
}

function isHighValueMediaFeedItem(item) {
  const text = `${item.title} ${item.summary}`.trim();
  if (!text || LOW_VALUE_MEDIA_FEED_PATTERNS.some((pattern) => pattern.test(text))) {
    return false;
  }
  if (item.discoveryMetrics?.score || item.discoveryMetrics?.comments) {
    return true;
  }
  if (item.agentScore >= 18) {
    return true;
  }
  return mediaFeedSignalScore(text) >= 2;
}

function mediaFeedMetricScore(metrics = {}) {
  const score = Math.min(10, Math.log10(Math.max(1, Number(metrics.score || 0))) * 3);
  const comments = Math.min(8, Math.log10(Math.max(1, Number(metrics.comments || 0))) * 2.5);
  return score + comments;
}

function mediaFeedRefreshJitter(value) {
  const text = `${mediaFeedRefreshSeed}:${value}`;
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = ((hash << 5) - hash + text.charCodeAt(index)) | 0;
  }
  return (Math.abs(hash) % 1000) / 1000;
}

function mediaFeedSignature(value) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !["the", "and", "for", "with", "from", "this", "that"].includes(token))
    .slice(0, 8)
    .sort()
    .join("-");
}

function compareAgentMediaFeedItems(a, b) {
  if (b.agentScore !== a.agentScore) {
    return b.agentScore - a.agentScore;
  }
  return Number(b.createdAt || 0) - Number(a.createdAt || 0);
}

function organizeAgentMediaFeed(items) {
  const focusItems = selectDiverseMediaFeedItems(items, 5);
  const focusIds = new Set(focusItems.map((item) => item.id));
  const topicGroups = new Map();
  items
    .filter((item) => !focusIds.has(item.id))
    .sort(compareAgentMediaFeedItems)
    .forEach((item) => {
      const group = topicGroups.get(item.agentTopic) || [];
      group.push(item);
      topicGroups.set(item.agentTopic, group);
    });
  const ordered = focusItems.map((item) => ({ ...item, agentSection: "focus" }));
  [...topicGroups.entries()]
    .sort(([, aItems], [, bItems]) => (bItems[0]?.agentScore || 0) - (aItems[0]?.agentScore || 0))
    .forEach(([topic, groupItems]) => {
      selectDiverseMediaFeedItems(groupItems, groupItems.length).forEach((item) => {
        ordered.push({ ...item, agentSection: topic });
      });
    });
  return ordered;
}

function selectDiverseMediaFeedItems(items, limit) {
  const selected = [];
  const sourceCounts = new Map();
  const topicCounts = new Map();
  const signatureSeen = new Set();
  const candidates = [...items].sort(compareAgentMediaFeedItems);

  while (candidates.length && selected.length < limit) {
    let bestIndex = -1;
    let bestScore = -Infinity;
    candidates.forEach((item, index) => {
      const sourcePenalty = (sourceCounts.get(item.sourceTitle) || 0) * 7;
      const topicPenalty = (topicCounts.get(item.agentTopic) || 0) * 3;
      const duplicatePenalty = item.agentSignature && signatureSeen.has(item.agentSignature) ? 20 : 0;
      const score = item.agentScore - sourcePenalty - topicPenalty - duplicatePenalty;
      if (score > bestScore) {
        bestIndex = index;
        bestScore = score;
      }
    });
    if (bestIndex < 0) {
      break;
    }
    const [item] = candidates.splice(bestIndex, 1);
    selected.push(item);
    sourceCounts.set(item.sourceTitle, (sourceCounts.get(item.sourceTitle) || 0) + 1);
    topicCounts.set(item.agentTopic, (topicCounts.get(item.agentTopic) || 0) + 1);
    if (item.agentSignature) {
      signatureSeen.add(item.agentSignature);
    }
  }
  return selected;
}

function mediaFeedSectionTitle(section, item) {
  if (section === "focus") {
    return t("mediaFeedAgentFocus");
  }
  return item?.agentTopicLabelKey ? t(item.agentTopicLabelKey) : t("mediaFeedAgentStream");
}

function renderMediaFeedForActiveType() {
  if (!mediaFeedList || !mediaFeedState) {
    return;
  }
  const items = activeMediaFeedType === "all"
    ? latestMediaFeedItems
    : latestMediaFeedItems.filter((item) => item.agentTopic === activeMediaFeedType);
  visibleMediaFeedItems = organizeAgentMediaFeed(items);
  mediaFeedVisibleCount = Math.min(MEDIA_FEED_INITIAL_ITEMS, visibleMediaFeedItems.length);
  renderMediaFeed();
  if (items.length) {
    mediaFeedState.hidden = true;
    return;
  }
  setMediaFeedState("empty", t("mediaFeedEmptyTitle"), t("mediaFeedEmptyBody"));
}

function renderMediaFeed() {
  if (!mediaFeedList) {
    return;
  }
  mediaFeedObserver?.disconnect();
  const items = visibleMediaFeedItems.slice(0, mediaFeedVisibleCount);
  const hasMore = mediaFeedVisibleCount < visibleMediaFeedItems.length;
  const fragment = document.createDocumentFragment();
  let currentSection = "";
  items.forEach((item, index) => {
    if (item.agentSection !== currentSection) {
      currentSection = item.agentSection;
      fragment.appendChild(createMediaFeedSectionHeader(mediaFeedSectionTitle(currentSection, item)));
    }
    fragment.appendChild(createMediaFeedItem(item, index));
  });
  if (hasMore) {
    mediaFeedLoadMoreSentinel.textContent = t("mediaFeedAutoLoad");
    fragment.appendChild(mediaFeedLoadMoreSentinel);
  } else {
    mediaFeedLoadMoreSentinel.remove();
  }
  mediaFeedList.replaceChildren(fragment);
  if (hasMore) {
    observeMediaFeedLoadMore();
    loadMoreMediaFeedIfNeeded();
  }
}

function observeMediaFeedLoadMore() {
  if (!mediaFeedList || !("IntersectionObserver" in window)) {
    return;
  }
  mediaFeedObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      loadMoreMediaFeedPage();
    }
  }, {
    root: mediaFeedList,
    rootMargin: "180px 0px",
    threshold: 0.01
  });
  mediaFeedObserver.observe(mediaFeedLoadMoreSentinel);
}

function loadMoreMediaFeedIfNeeded() {
  if (!mediaFeedList) {
    return;
  }
  const distanceToEnd = mediaFeedList.scrollHeight - mediaFeedList.scrollTop - mediaFeedList.clientHeight;
  if (distanceToEnd <= 180) {
    loadMoreMediaFeedPage();
  }
}

function loadMoreMediaFeedPage() {
  if (mediaFeedVisibleCount >= visibleMediaFeedItems.length) {
    return;
  }
  mediaFeedVisibleCount = Math.min(mediaFeedVisibleCount + MEDIA_FEED_PAGE_SIZE, visibleMediaFeedItems.length);
  renderMediaFeed();
}

function createMediaFeedSectionHeader(title) {
  const header = document.createElement("div");
  header.className = "media-feed-section";
  header.textContent = title;
  return header;
}

function createMediaFeedItem(item, index = 0) {
  const featured = index % MEDIA_FEED_LARGE_CARD_INTERVAL === MEDIA_FEED_LARGE_CARD_INTERVAL - 1;
  const imageCandidates = Array.isArray(item.imageCandidates) ? item.imageCandidates.filter(Boolean) : [];
  const hasContentImage = Boolean(item.image || imageCandidates.length);
  const article = document.createElement("article");
  article.className = "media-feed-item";
  article.classList.toggle("featured", featured);
  article.classList.toggle("no-image", !hasContentImage);

  const link = document.createElement("a");
  link.className = "media-feed-link";
  link.href = item.url;
  link.setAttribute("aria-label", t("openPage", { title: item.title }));

  const meta = document.createElement("div");
  meta.className = "media-feed-item-meta";

  const sourceIcon = document.createElement("img");
  sourceIcon.className = "media-feed-source-icon";
  sourceIcon.alt = "";
  sourceIcon.loading = "lazy";
  sourceIcon.decoding = "async";
  sourceIcon.dataset.candidateIndex = "0";
  sourceIcon.src = item.sourceIcon || "";
  sourceIcon.addEventListener("error", () => {
    const candidates = Array.isArray(item.sourceIconCandidates) ? item.sourceIconCandidates : [];
    const nextIndex = Number(sourceIcon.dataset.candidateIndex || 0) + 1;
    if (candidates[nextIndex]) {
      sourceIcon.dataset.candidateIndex = String(nextIndex);
      sourceIcon.src = candidates[nextIndex];
      return;
    }
    sourceIcon.removeAttribute("src");
    sourceIcon.dataset.iconMissing = "true";
  });

  const sourceName = document.createElement("span");
  sourceName.className = "media-feed-source-name";
  sourceName.textContent = item.sourceTitle;
  meta.append(sourceIcon, sourceName);

  if (item.createdAt) {
    const time = document.createElement("time");
    time.dateTime = new Date(item.createdAt).toISOString();
    time.textContent = mediaFeedRelativeTime(item.createdAt);
    meta.append(time);
  }

  const moreButton = document.createElement("button");
  moreButton.className = "media-feed-more";
  moreButton.type = "button";
  moreButton.setAttribute("aria-haspopup", "menu");
  moreButton.setAttribute("aria-expanded", "false");
  moreButton.setAttribute("aria-label", t("mediaFeedMore"));
  moreButton.innerHTML = moreHorizontalIcon();
  moreButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleMediaFeedActionMenu(article, moreButton, item);
  });

  const title = document.createElement("h3");
  title.className = "media-feed-title";
  title.textContent = item.title;

  const agentMeta = document.createElement("span");
  agentMeta.className = "media-feed-agent-meta";
  const topicBadge = document.createElement("span");
  topicBadge.className = "media-feed-topic";
  topicBadge.textContent = item.agentTopicLabelKey ? t(item.agentTopicLabelKey) : t("mediaFeedAgentStream");
  const reason = document.createElement("span");
  reason.className = "media-feed-reason";
  reason.textContent = item.agentReasonKey ? t(item.agentReasonKey) : t("mediaFeedReasonDefault");
  agentMeta.append(topicBadge, reason);

  const summary = document.createElement("p");
  summary.className = "media-feed-summary";
  summary.textContent = item.summary;

  const copy = document.createElement("span");
  copy.className = "media-feed-copy";
  copy.append(meta, title, agentMeta);
  if (item.summary) {
    copy.append(summary);
  }

  if (hasContentImage) {
    const image = document.createElement("img");
    image.className = "media-feed-image";
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    image.referrerPolicy = "no-referrer";
    image.dataset.candidateIndex = "0";
    image.addEventListener("error", () => {
      const nextIndex = Number(image.dataset.candidateIndex || 0) + 1;
      if (imageCandidates[nextIndex]) {
        image.dataset.candidateIndex = String(nextIndex);
        image.src = imageCandidates[nextIndex];
        return;
      }
      image.remove();
      article.classList.add("no-image");
    });
    image.src = item.image || imageCandidates[0];
    if (featured) {
      link.append(image, copy);
    } else {
      link.append(copy, image);
    }
  } else {
    link.append(copy);
  }
  article.append(link, moreButton);
  return article;
}

function toggleMediaFeedActionMenu(article, button, item) {
  if (activeMediaFeedActionMenu?.button === button) {
    closeMediaFeedActionMenu();
    return;
  }
  closeMediaFeedActionMenu();

  const menu = document.createElement("div");
  menu.className = "media-feed-action-menu";
  menu.setAttribute("role", "menu");

  const notInterestedButton = document.createElement("button");
  notInterestedButton.type = "button";
  notInterestedButton.className = "media-feed-action";
  notInterestedButton.setAttribute("role", "menuitem");
  notInterestedButton.textContent = t("mediaFeedNotInterested");
  notInterestedButton.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await markMediaFeedNotInterested(item);
  });

  menu.append(notInterestedButton);
  article.append(menu);
  button.setAttribute("aria-expanded", "true");
  activeMediaFeedActionMenu = { element: menu, button };
}

function closeMediaFeedActionMenu() {
  if (!activeMediaFeedActionMenu) {
    return;
  }
  activeMediaFeedActionMenu.button?.setAttribute("aria-expanded", "false");
  activeMediaFeedActionMenu.element?.remove();
  activeMediaFeedActionMenu = null;
}

function handleDocumentClickForMediaFeedMenu(event) {
  if (!activeMediaFeedActionMenu) {
    return;
  }
  if (activeMediaFeedActionMenu.element.contains(event.target) || activeMediaFeedActionMenu.button.contains(event.target)) {
    return;
  }
  closeMediaFeedActionMenu();
}

async function markMediaFeedNotInterested(item) {
  closeMediaFeedActionMenu();
  const nextFeedback = normalizeMediaFeedFeedback(activeMediaFeedFeedback);
  incrementMediaFeedFeedback(nextFeedback.items, item.id, 1);
  incrementMediaFeedFeedback(nextFeedback.topics, item.agentTopic, 1);
  incrementMediaFeedFeedback(nextFeedback.sources, mediaFeedFeedbackSourceKey(item), 1);
  incrementMediaFeedFeedback(nextFeedback.signatures, item.agentSignature, 1);
  mediaFeedFeedbackKeywords(item).forEach((keyword) => incrementMediaFeedFeedback(nextFeedback.keywords, keyword, 1));
  nextFeedback.updatedAt = Date.now();
  activeMediaFeedFeedback = normalizeMediaFeedFeedback(nextFeedback);

  try {
    await saveMediaFeedFeedback();
  } catch (error) {
    console.warn("Failed to save media feed feedback", error);
  }

  latestMediaFeedItems = latestMediaFeedItems
    .map(enrichMediaFeedItem)
    .filter((feedItem) => !isMediaFeedItemDismissed(feedItem))
    .sort(compareAgentMediaFeedItems);
  renderMediaFeedForActiveType();
  if (mediaFeedUpdated) {
    mediaFeedUpdated.textContent = t("mediaFeedNotInterestedDone");
  }
}

function mediaFeedRelativeTime(timestamp) {
  const minutesAgo = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
  if (minutesAgo < 1) {
    return t("historyJustNow");
  }
  if (minutesAgo < 60) {
    return t("historyMinutesAgo", { count: minutesAgo });
  }
  if (minutesAgo < 24 * 60) {
    return t("historyHoursAgo", { count: Math.floor(minutesAgo / 60) });
  }
  return new Intl.DateTimeFormat(LOCALE, { month: "short", day: "numeric" }).format(new Date(timestamp));
}

function setMediaFeedState(state, title, body) {
  if (!mediaFeedState) {
    return;
  }
  mediaFeedState.dataset.state = state;
  mediaFeedState.hidden = false;
  mediaFeedState.querySelector("strong").textContent = title;
  mediaFeedState.querySelector("span:last-child").textContent = body;
}

async function refreshHistory() {
  try {
    const recentStartTime = Date.now() - RECENT_HISTORY_LOOKBACK_MS;
    const [items, pinnedItems, openTabItems] = await Promise.all([
      chrome.history.search({
        text: "",
        startTime: recentStartTime,
        maxResults: 80
      }),
      loadPinnedHistory(),
      openTabHistoryItems()
    ]);
    const pinnedKeys = new Set(pinnedItems.map((item) => normalizeHistoryKey(item.url)));
    const recentItems = mergeHistoryItems(
      await repeatDomainHistoryItems(items, recentStartTime),
      openTabItems
    )
      .filter((item) => !pinnedKeys.has(normalizeHistoryKey(item.url)));
    renderPinnedHistory(pinnedItems);
    const recentGroups = groupHistoryBySite(recentItems, {
      maxPagesPerSite: MAX_HISTORY_PAGES_PER_SITE
    });
    writeFirstPaintCache({ recentGroups: serializeRecentGroupsForFirstPaint(recentGroups) });
    renderRecentFolders(recentGroups);
    renderHistory(recentGroups);
  } catch (error) {
    pinnedGrid.innerHTML = "";
    historyGrid.innerHTML = emptyState(t("historyReadFailed"));
    recentHistoryFolders.innerHTML = emptyState(t("historyReadFailed"));
    latestRecentFolderGroups = [];
    recentFolderPageIndex = 0;
    pendingRecentPreviousKeys = null;
    updateRecentFolderSwitchControls();
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

function renderRecentFolders(groups, options = {}) {
  latestRecentFolderGroups = orderedRecentHistoryGroups(groups);
  clearRecentFolderPageSwitchAnimation();
  if (!latestRecentFolderGroups.length) {
    recentHistoryFolders.innerHTML = emptyState(t("noHistoryItems"));
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
  const pages = group.pages.slice(0, MAX_HISTORY_PAGES_PER_SITE);
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
  bottomBar.setAttribute("aria-hidden", "true");

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

function createHistorySiteGroup(group, options = {}) {
  const card = document.createElement("section");
  const header = document.createElement("div");
  const isPinned = Boolean(options.pinned);
  const homeLink = document.createElement(isPinned ? "span" : "a");
  const icon = document.createElement("img");
  const name = document.createElement("strong");
  const count = document.createElement("span");
  const list = document.createElement("div");
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
  if (!isPinned) {
    homeLink.href = homeHref;
    homeLink.setAttribute("aria-label", homeLabel);
  }
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
  const isPinned = Boolean(options.pinned);
  const showTimeline = Boolean(options.timeline);
  const link = document.createElement("a");
  const label = document.createElement("span");
  const actions = document.createElement("span");
  const pinButton = document.createElement("button");
  const deleteButton = document.createElement("button");

  row.className = "history-page-item";
  row.classList.toggle("timeline", showTimeline);
  if (showTimeline) {
    time.className = "history-page-time";
    time.dateTime = historyDateTimeAttribute(item.lastVisitTime);
    time.textContent = formatHistoryAnchorTime(item.lastVisitTime);
  }
  link.className = "history-page-link";
  link.href = item.url;
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
  expandButton.setAttribute("aria-label", t("historyExpandPages", { count: relatedPages.length }));
  expandButton.setAttribute("aria-expanded", "false");
  expandButton.setAttribute("aria-hidden", String(!isExpandable));
  expandButton.tabIndex = isExpandable ? 0 : -1;
  expandButton.disabled = !isExpandable;
  expandButton.addEventListener("click", () => toggleHistoryFeedGroup(row));

  pinButton.className = "history-page-pin";
  pinButton.type = "button";
  pinButton.innerHTML = historyPinIcon(false);
  pinButton.setAttribute("aria-label", `${t("pin")} ${title}`);
  pinButton.addEventListener("click", () => pinHistoryItem(item || {
    title,
    url: group.url
  }));

  deleteButton.className = "history-page-delete";
  deleteButton.type = "button";
  deleteButton.innerHTML = trashIcon();
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

function formatHistoryTimestamp(timestamp) {
  return formatHistoryFullTime(timestamp);
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
    const result = await getStoredValues({ [PINNED_HISTORY_STORAGE_KEY]: [] });
    const parsed = result[PINNED_HISTORY_STORAGE_KEY];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .filter((item) => item?.url && isDisplayableHistoryUrl(safeUrl(item.url)))
      .sort((a, b) => Number(b.pinnedAt || 0) - Number(a.pinnedAt || 0))
      .slice(0, MAX_PINNED_HISTORY_ITEMS);
  } catch (error) {
    console.warn("Failed to load pinned history", error);
    return [];
  }
}

async function savePinnedHistory(items) {
  await setStoredValues({ [PINNED_HISTORY_STORAGE_KEY]: items.slice(0, MAX_PINNED_HISTORY_ITEMS) });
}

async function pinHistoryItem(item) {
  try {
    if (!isDisplayableHistoryUrl(safeUrl(item?.url))) {
      return;
    }
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

const TDESIGN_ICON_MARKUP = Object.freeze({
  add: '<path fill="none" stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M12 5v14m7-7H5"/>',
  app: '<g fill="none"><path d="M3 3h7v7H3zm11 11h7v7h-7zM3 14h7v7H3zm18.5-7.5a4 4 0 1 1-8 0a4 4 0 0 1 8 0"/><path stroke="currentColor" stroke-width="2" d="M3 3h7v7H3zm11 11h7v7h-7zM3 14h7v7H3zm18.5-7.5a4 4 0 1 1-8 0a4 4 0 0 1 8 0Z"/></g>',
  "arrow-left": '<path fill="none" stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M11 6.5L5.5 12l5.5 5.5M6.75 12h13"/>',
  "bookmark-double-filled": '<path fill="currentColor" d="M23.003 18.419L23 0L10.001.002v2H21v14.413z"/><path fill="currentColor" d="M19 4H3v19.943l8-5.714l8 5.714z"/>',
  "backup-filled": '<path fill="currentColor" d="M12 2c3.728 0 6.82 2.72 7.402 6.283A6.502 6.502 0 0 1 17.5 21h-11A6.5 6.5 0 0 1 4.598 8.283A7.5 7.5 0 0 1 12 2m3 10.914l1.414-1.414L12 7.086L7.586 11.5L9 12.914l2-2V17h2v-6.086z"/>',
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
  "folder-add": '<path fill="none" stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M22 11V6H11L9 3.5H2V20h11m7-5v3m0 0v3m0-3h-3m3 0h3"/>',
  "format-vertical-align-left": '<path fill="none" stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M3 5h18M3 12h12M3 19h18"/>',
  "help-circle": '<g fill="none"><path d="M21.5 12a9.5 9.5 0 1 1-19 0a9.5 9.5 0 0 1 19 0"/><path stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M9.6 9.25a2.6 2.6 0 1 1 3.8 2.3c-.86.47-1.4 1.04-1.4 2.2m0 3.25h.01M21.5 12a9.5 9.5 0 1 1-19 0a9.5 9.5 0 0 1 19 0Z"/></g>',
  desktop: '<g fill="none"><path d="M2 4h20v13H2z"/><path stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M12 17v4m-4 0h8M2 4h20v13H2z"/></g>',
  "sunny-filled": '<path fill="currentColor" d="M13 1v3h-2V1zm7.485 3.928L18.364 7.05L16.95 5.636l2.121-2.122zM4.93 3.514l2.12 2.122L5.636 7.05L3.515 4.929zM6 12a6 6 0 1 1 12 0a6 6 0 0 1-12 0m-5-1h3v2H1zm19 0h3v2h-3zM7.05 18.363l-2.12 2.123l-1.415-1.416l2.121-2.122zm11.314-1.414l2.121 2.122l-1.414 1.414l-2.121-2.121zM13 20v3h-2v-3z"/>',
  "moon-filled": '<path fill="currentColor" d="M2 12C2 6.477 6.477 2 12 2h1.734l-.868 1.5C12.287 4.5 12 5.689 12 7a7 7 0 0 0 8.348 6.87l1.682-.327l-.543 1.626C20.162 19.137 16.417 22 12 22C6.477 22 2 17.523 2 12"/>',
  history: '<path fill="none" stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M2.552 13c.5 4.777 4.539 8.5 9.448 8.5a9.5 9.5 0 0 0 0-19c-1.628 0-3.16.41-4.5 1.131A9.54 9.54 0 0 0 3.38 8M12 7v5l2.5 2.5m-12-11v5h5"/>',
  more: '<path fill="none" stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M11.5 4h1v1h-1zm0 7.5h1v1h-1zm0 7.5h1v1h-1z"/>',
  "page-tab-filled": '<path fill="currentColor" d="m9.48 2.5l.301.375l2.9 3.625H23V21H1V2.5z"/><path fill="currentColor" d="M23 2.5v2H13v-2z"/>',
  pin: '<g fill="none"><path d="M21.962 6.282L17.72 2.04L9.94 8.399L7.82 6.277l-4.245 4.245l9.9 9.9l4.244-4.245l-2.12-2.121z"/><path stroke="currentColor" stroke-linecap="square" stroke-width="2" d="m2.16 21.836l6.364-6.364M17.72 2.04l4.242 4.242l-6.365 7.774l2.121 2.12l-4.244 4.246l-9.9-9.9L7.82 6.277L9.94 8.4z"/></g>',
  "pin-filled": '<path fill="currentColor" d="m18.076.981l4.949 4.95l-6.365 7.773l2.121 2.12l-5.305 5.306l-4.596-4.596l-6.718 6.718l-1.414-1.415l6.718-6.717l-4.597-4.596l5.306-5.306l2.121 2.122z"/>',
  refresh: '<path fill="none" stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M21.448 13c-.5 4.777-4.539 8.5-9.448 8.5A9.5 9.5 0 0 1 3.38 16m-.88 4.5v-5h3M2.552 11C3.052 6.223 7.09 2.5 12 2.5A9.5 9.5 0 0 1 20.62 8m.88-4.5v5h-3"/>',
  search: '<g fill="none"><path d="M15.803 15.803A7.5 7.5 0 1 1 5.197 5.197a7.5 7.5 0 0 1 10.606 10.606"/><path stroke="currentColor" stroke-linecap="square" stroke-width="2" d="m15.803 15.804l5.303 5.303m-5.303-5.304A7.5 7.5 0 1 1 5.197 5.197a7.5 7.5 0 0 1 10.606 10.606Z"/></g>',
  setting: '<g fill="none"><path d="M20.66 7L12 2L3.34 7v10L12 22l8.66-5zM12 16a4 4 0 1 0 0-8a4 4 0 0 0 0 8" clip-rule="evenodd"/><path d="M16 12a4 4 0 1 1-8 0a4 4 0 0 1 8 0"/><path stroke="currentColor" stroke-linecap="square" stroke-width="2" d="m12 2l8.66 5v10L12 22l-8.66-5V7z"/><path stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M16 12a4 4 0 1 1-8 0a4 4 0 0 1 8 0Z"/></g>',
  "setting-filled": '<path fill="currentColor" d="M21.66 6.423L12 .845L2.34 6.423v11.154L12 23.155l9.66-5.578zM12 16a4 4 0 1 1 0-8a4 4 0 0 1 0 8"/>',
  "view-list": '<path fill="none" stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M3 5h18M3 12h18M3 19h18"/>'
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
  return tdesignIcon("search");
}

function historyPinIcon(active) {
  return tdesignIcon(active ? "pin-filled" : "pin");
}

function plusIcon() {
  return tdesignIcon("add");
}

function refreshIcon() {
  return tdesignIcon("refresh");
}

function backupFilledIcon() {
  return tdesignIcon("backup-filled");
}

function helpCircleIcon() {
  return tdesignIcon("help-circle");
}

function githubIcon() {
  return '<svg class="brand-icon github-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61c-.546-1.385-1.335-1.755-1.335-1.755c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12Z"/></svg>';
}

function historyIcon() {
  return tdesignIcon("history");
}

function folderPlusIcon() {
  return tdesignIcon("folder-add");
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

function newspaperIcon() {
  return tdesignIcon("view-list");
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

function moreHorizontalIcon() {
  return tdesignIcon("more");
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
