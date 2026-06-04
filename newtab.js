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
  { title: "Claude", url: "https://claude.ai", icon: "icons/sites/claude.svg", category: "ai" },
  { title: "Gemini", url: "https://gemini.google.com", icon: "icons/sites/googlegemini.svg", category: "ai" },
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
const FAVORITE_SITES_STORAGE_KEY = "favoriteSites";
const SITE_ICON_CACHE_STORAGE_KEY = "siteIconCache";
const PINNED_HISTORY_STORAGE_KEY = "pinnedHistory";
const OPEN_TAB_ACTIVITY_STORAGE_KEY = "openTabActivity";
const BOOKMARK_FOLDER_STORAGE_KEY = "bookmarkFolderId";
const BOOKMARK_LAYOUT_STORAGE_KEY = "bookmarkLayout";
const PORTAL_CATEGORY_STATE_STORAGE_KEY = "portalCategoryState";
const THEME_STORAGE_KEY = "themeMode";
const THEME_PALETTE_STORAGE_KEY = "themePalette";
const AI_DIRECT_PROMPT_STORAGE_KEY = "aiDirectPrompts";
const SYNC_META_STORAGE_KEY = "syncMeta";
const ONBOARDING_GUIDE_STORAGE_KEY = "onboardingGuideDismissed";
const AI_DIRECT_PROMPT_TOKEN_PARAM = "_wayleaf_prompt";
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
const SITE_ICON_FETCH_TIMEOUT_MS = 4500;
const SITE_ICON_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const FAVORITE_REORDER_MS = 260;
const FAVORITE_DELETE_EXIT_MS = 360;
const FAVORITE_DELETE_CANCEL_MS = 280;
const SEARCH_SUGGESTIONS_EXIT_MS = 220;
const MAX_BOOKMARK_FOLDER_OPTIONS = 160;
const MAX_PORTAL_FEATURED_ITEMS = 6;
const MAX_BOOKMARK_PORTAL_ITEMS = 120;
const MAX_BOOKMARK_HISTORY_ITEMS = 180;
const BOOKMARK_HISTORY_LOOKBACK_DAYS = 45;
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
  BOOKMARK_LAYOUT_STORAGE_KEY,
  PORTAL_CATEGORY_STATE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  THEME_PALETTE_STORAGE_KEY,
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
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
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
const CUSTOM_THEME_PALETTE_ID = "custom";
const DEFAULT_CUSTOM_THEME_COLORS = Object.freeze({ light: "#3f7f68", dark: "#86b9a4" });
const THEME_PALETTES = [
  {
    id: "sage",
    label: "鼠尾草",
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
    id: "sky",
    label: "雾蓝",
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
    label: "杏桃",
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
        faint: "#847970"
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
        onAccent: "#2a160f"
      }
    }
  }
];
const SEARCH_ENGINES = [
  { id: "local", label: "聚合搜索", local: true },
  { id: "google", label: "Google", icon: "icons/sites/google.svg", searchUrl: "https://www.google.com/search", queryParam: "q", aggregateDefault: true },
  { id: "baidu", label: "百度", icon: "icons/sites/baidu.ico", searchUrl: "https://www.baidu.com/s", queryParam: "wd" },
  { id: "bing", label: "Bing", icon: "icons/sites/bing.ico", searchUrl: "https://www.bing.com/search", queryParam: "q", aggregateDefault: true },
  { id: "chatgpt", command: "/gpt", commands: ["/gpt", "/chatgpt"], label: "ChatGPT", icon: "icons/sites/chatgpt.svg", searchUrl: "https://chatgpt.com/", queryParam: "q", aiDirect: true, autoSubmit: true, directUrl: "https://chatgpt.com/", themeColor: "#10a37f" },
  { id: "claude", command: "/claude", label: "Claude", icon: "icons/sites/claude.svg", searchUrl: "https://claude.ai/new", queryParam: "q", aiDirect: true, autoSubmit: true, directUrl: "https://claude.ai/new", themeColor: "#d97757" },
  { id: "gemini", command: "/gemini", label: "Gemini", icon: "icons/sites/googlegemini.svg", searchUrl: "https://gemini.google.com/app", queryParam: "q", aiDirect: true, autoSubmit: true, directUrl: "https://gemini.google.com/app", themeColor: "#4285f4" },
  { id: "grok", command: "/grok", label: "Grok", icon: "icons/sites/grok.svg", searchUrl: "https://grok.com/", queryParam: "q", aiDirect: true, autoSubmit: true, directUrl: "https://grok.com/", themeColor: "#777f86" }
];
const AGGREGATE_SEARCH_ENGINE_IDS = ["google", "bing"];
const AI_COMMAND_ENGINES = SEARCH_ENGINES.filter((engine) => engine.aiDirect && engine.command);
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
  "drive.google.com": "drive.google.com",
  "maps.google.com": "maps.google.com",
  "meet.google.com": "meet.google.com",
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
  "microsoft.com",
  "linkedin.com",
  "npmjs.com",
  "notion.so",
  "pinterest.com",
  "stackoverflow.com",
  "taobao.com",
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
const PORTAL_ICON_BY_SITE_KEY = Object.freeze(Object.fromEntries(PORTALS
  .filter((portal) => portal.icon)
  .map((portal) => {
    const url = new URL(portal.url);
    return [canonicalSiteHost(url.hostname), portal.icon];
  })));
const DEFAULT_SITE_ICON_BY_SITE_KEY = Object.freeze({
  "airbnb.com": "icons/sites/airbnb.svg",
  "airtable.com": "icons/sites/airtable.svg",
  "alibabacloud.com": "icons/sites/alibabacloud.svg",
  "aliexpress.com": "icons/sites/aliexpress.svg",
  "alipay.com": "icons/sites/alipay.svg",
  "amd.com": "icons/sites/amd.svg",
  "angular.dev": "icons/sites/angular.svg",
  "anthropic.com": "icons/sites/anthropic.svg",
  "apple.com": "icons/sites/apple.svg",
  "arxiv.org": "icons/sites/arxiv.svg",
  "asana.com": "icons/sites/asana.svg",
  "atlassian.com": "icons/sites/atlassian.svg",
  "behance.net": "icons/sites/behance.svg",
  "bitbucket.org": "icons/sites/bitbucket.svg",
  "booking.com": "icons/sites/bookingdotcom.svg",
  "box.com": "icons/sites/box.svg",
  "bsky.app": "icons/sites/bluesky.svg",
  "bytedance.com": "icons/sites/bytedance.svg",
  "codesandbox.io": "icons/sites/codesandbox.svg",
  "coursera.org": "icons/sites/coursera.svg",
  "deepseek.com": "icons/sites/deepseek.svg",
  "digitalocean.com": "icons/sites/digitalocean.svg",
  "docker.com": "icons/sites/docker.svg",
  "douban.com": "icons/sites/douban.svg",
  "dribbble.com": "icons/sites/dribbble.svg",
  "dropbox.com": "icons/sites/dropbox.svg",
  "duolingo.com": "icons/sites/duolingo.svg",
  "ebay.com": "icons/sites/ebay.svg",
  "epicgames.com": "icons/sites/epicgames.svg",
  "expedia.com": "icons/sites/expedia.svg",
  "facebook.com": "icons/sites/facebook.svg",
  "firebase.google.com": "icons/sites/firebase.svg",
  "gitbook.io": "icons/sites/gitbook.svg",
  "gitlab.com": "icons/sites/gitlab.svg",
  "huggingface.co": "icons/sites/huggingface.svg",
  "icloud.com": "icons/sites/icloud.svg",
  "ieee.org": "icons/sites/ieee.svg",
  "instagram.com": "icons/sites/instagram.svg",
  "intel.com": "icons/sites/intel.svg",
  "itch.io": "icons/sites/itchdotio.svg",
  "khanacademy.org": "icons/sites/khanacademy.svg",
  "kuaishou.com": "icons/sites/kuaishou.svg",
  "kubernetes.io": "icons/sites/kubernetes.svg",
  "leetcode.com": "icons/sites/leetcode.svg",
  "line.me": "icons/sites/line.svg",
  "linear.app": "icons/sites/linear.svg",
  "mastodon.social": "icons/sites/mastodon.svg",
  "medium.com": "icons/sites/medium.svg",
  "messenger.com": "icons/sites/messenger.svg",
  "music.163.com": "icons/sites/neteasecloudmusic.svg",
  "netflix.com": "icons/sites/netflix.svg",
  "netlify.com": "icons/sites/netlify.svg",
  "nodejs.org": "icons/sites/nodedotjs.svg",
  "npmjs.com": "icons/sites/npm.svg",
  "nvidia.com": "icons/sites/nvidia.svg",
  "obsidian.md": "icons/sites/obsidian.svg",
  "paypal.com": "icons/sites/paypal.svg",
  "pinterest.com": "icons/sites/pinterest.svg",
  "producthunt.com": "icons/sites/producthunt.svg",
  "proton.me": "icons/sites/protonmail.svg",
  "pypi.org": "icons/sites/pypi.svg",
  "python.org": "icons/sites/python.svg",
  "quora.com": "icons/sites/quora.svg",
  "react.dev": "icons/sites/react.svg",
  "reddit.com": "icons/sites/reddit.svg",
  "replit.com": "icons/sites/replit.svg",
  "roblox.com": "icons/sites/roblox.svg",
  "shopify.com": "icons/sites/shopify.svg",
  "soundcloud.com": "icons/sites/soundcloud.svg",
  "spotify.com": "icons/sites/spotify.svg",
  "stackoverflow.com": "icons/sites/stackoverflow.svg",
  "steamcommunity.com": "icons/sites/steam.svg",
  "steampowered.com": "icons/sites/steam.svg",
  "stripe.com": "icons/sites/stripe.svg",
  "substack.com": "icons/sites/substack.svg",
  "supabase.com": "icons/sites/supabase.svg",
  "svelte.dev": "icons/sites/svelte.svg",
  "telegram.org": "icons/sites/telegram.svg",
  "threads.net": "icons/sites/threads.svg",
  "tiktok.com": "icons/sites/tiktok.svg",
  "trello.com": "icons/sites/trello.svg",
  "tripadvisor.com": "icons/sites/tripadvisor.svg",
  "tumblr.com": "icons/sites/tumblr.svg",
  "twitch.tv": "icons/sites/twitch.svg",
  "udemy.com": "icons/sites/udemy.svg",
  "vimeo.com": "icons/sites/vimeo.svg",
  "vuejs.org": "icons/sites/vuedotjs.svg",
  "wechat.com": "icons/sites/wechat.svg",
  "whatsapp.com": "icons/sites/whatsapp.svg",
  "wikipedia.org": "icons/sites/wikipedia.svg",
  "wolfram.com": "icons/sites/wolfram.svg",
  "wordpress.com": "icons/sites/wordpress.svg",
  "x.com": "icons/sites/x.svg",
  "yelp.com": "icons/sites/yelp.svg",
  "zoom.us": "icons/sites/zoom.svg"
});
const EXTENDED_SITE_ICON_BY_SITE_KEY = Object.freeze({
  "1688.com": "icons/sites/1688.ico",
  "adobe.com": "icons/sites/adobe.svg",
  "alibaba.com": "icons/sites/alibabadotcom.svg",
  "amazon.com": "icons/sites/amazon.svg",
  "apache.org": "icons/sites/apache.svg",
  "audible.com": "icons/sites/audible.svg",
  "aws.amazon.com": "icons/sites/aws.svg",
  "azure.microsoft.com": "icons/sites/azure.svg",
  "b.ai": "icons/sites/bai.png",
  "baidu.com": "icons/sites/baidu.ico",
  "bbc.com": "icons/sites/bbc.svg",
  "bing.com": "icons/sites/bing.ico",
  "canva.com": "icons/sites/canva.svg",
  "chatgpt.com": "icons/sites/chatgpt.svg",
  "chrome.google.com": "icons/sites/chrome.svg",
  "codepen.io": "icons/sites/codepen.svg",
  "claude.ai": "icons/sites/claude.svg",
  "cursor.com": "icons/sites/cursor.svg",
  "dailymotion.com": "icons/sites/dailymotion.svg",
  "datadoghq.com": "icons/sites/datadog.svg",
  "discord.com": "icons/sites/discord.svg",
  "docs.b.ai": "icons/sites/baidocs.svg",
  "docs.google.com": "icons/sites/googledocs.svg",
  "douyin.com": "icons/sites/douyin.ico",
  "duckduckgo.com": "icons/sites/duckduckgo.svg",
  "figma.com": "icons/sites/figma.svg",
  "framer.com": "icons/sites/framer.svg",
  "calendar.google.com": "icons/sites/googlecalendar.svg",
  "gemini.google.com": "icons/sites/googlegemini.svg",
  "google.com": "icons/sites/google.svg",
  "grok.com": "icons/sites/grok.svg",
  "freecodecamp.org": "icons/sites/freecodecamp.svg",
  "github.com": "icons/sites/github.svg",
  "gmail.com": "icons/sites/gmail.svg",
  "googleads.google.com": "icons/sites/googleads.svg",
  "analytics.google.com": "icons/sites/googleanalytics.svg",
  "drive.google.com": "icons/sites/googledrive.svg",
  "maps.google.com": "icons/sites/googlemaps.svg",
  "meet.google.com": "icons/sites/googlemeet.svg",
  "heroku.com": "icons/sites/heroku.svg",
  "iconfont.cn": "icons/sites/iconfont.svg",
  "imdb.com": "icons/sites/imdb.svg",
  "atlassian.net": "icons/sites/jira.svg",
  "kaggle.com": "icons/sites/kaggle.svg",
  "kagi.com": "icons/sites/kagi.svg",
  "lastpass.com": "icons/sites/lastpass.svg",
  "larksuite.com": "icons/sites/larksuite.ico",
  "linkedin.com": "icons/sites/linkedin.svg",
  "mailchimp.com": "icons/sites/mailchimp.svg",
  "matrix.org": "icons/sites/matrix.svg",
  "microsoft.com": "icons/sites/microsoft.svg",
  "midjourney.com": "icons/sites/midjourney.svg",
  "office.com": "icons/sites/microsoftoffice.svg",
  "miro.com": "icons/sites/miro.svg",
  "mongodb.com": "icons/sites/mongodb.svg",
  "mysql.com": "icons/sites/mysql.svg",
  "nextjs.org": "icons/sites/nextdotjs.svg",
  "notion.so": "icons/sites/notion.svg",
  "openai.com": "icons/sites/openai.svg",
  "oracle.com": "icons/sites/oracle.svg",
  "playstation.com": "icons/sites/playstation.svg",
  "pinduoduo.com": "icons/sites/pinduoduo.jpg",
  "poe.com": "icons/sites/poe.svg",
  "postgresql.org": "icons/sites/postgresql.svg",
  "replicate.com": "icons/sites/replicate.svg",
  "slack.com": "icons/sites/slack.svg",
  "snapchat.com": "icons/sites/snapchat.svg",
  "sony.com": "icons/sites/sony.svg",
  "sogou.com": "icons/sites/sogou.svg",
  "tailwindcss.com": "icons/sites/tailwindcss.svg",
  "teams.microsoft.com": "icons/sites/microsoftteams.ico",
  "tmall.com": "icons/sites/tmall.png",
  "trip.com": "icons/sites/tripdotcom.svg",
  "twitter.com": "icons/sites/twitter.svg",
  "ubuntu.com": "icons/sites/ubuntu.svg",
  "unity.com": "icons/sites/unity.svg",
  "unsplash.com": "icons/sites/unsplash.svg",
  "uizard.io": "icons/sites/uizard.ico",
  "code.visualstudio.com": "icons/sites/visualstudiocode.svg",
  "w3schools.com": "icons/sites/w3schools.svg",
  "webflow.com": "icons/sites/webflow.svg",
  "xbox.com": "icons/sites/xbox.svg",
  "yahoo.com": "icons/sites/yahoo.svg",
  "yandex.com": "icons/sites/yandex.ico",
  "ycombinator.com": "icons/sites/ycombinator.svg",
  "zendesk.com": "icons/sites/zendesk.svg",
  "zotero.org": "icons/sites/zotero.svg"
});
const SITE_ICON_BY_SITE_KEY = Object.freeze({
  ...PORTAL_ICON_BY_SITE_KEY,
  ...DEFAULT_SITE_ICON_BY_SITE_KEY,
  ...EXTENDED_SITE_ICON_BY_SITE_KEY
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
  "discord.com": "#5865f2",
  "docs.b.ai": "#111827",
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
  "iconfont.cn": "#0c6066",
  "kagi.com": "#ffb319",
  "larksuite.com": "#00d6b9",
  "linkedin.com": "#0a66c2",
  "microsoft.com": "#5e5e5e",
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
  "taobao.com": "#e94f20",
  "teams.microsoft.com": "#6264a7",
  "tmall.com": "#ff0036",
  "uizard.io": "#00f9e5",
  "vercel.com": "#000000",
  "weibo.com": "#e6162d",
  "x.com": "#000000",
  "xiaohongshu.com": "#ff2442",
  "yandex.com": "#ffcc00",
  "youtube.com": "#ff0000",
  "zhihu.com": "#0084ff"
});
const MULTICOLOR_BRAND_ICON_SITE_KEYS = new Set([
  "calendar.google.com",
  "docs.google.com",
  "drive.google.com",
  "figma.com",
  "gemini.google.com",
  "gmail.com",
  "google.com",
  "maps.google.com",
  "meet.google.com",
  "microsoft.com",
  "slack.com"
]);
const NATIVE_ROUNDED_BRAND_ICON_SITE_KEYS = new Set([
  "grok.com"
]);
const PORTAL_CATEGORY_BY_SITE_KEY = Object.freeze(Object.fromEntries(PORTALS.map((portal) => {
  const url = new URL(portal.url);
  return [canonicalSiteHost(url.hostname), portal.category];
})));
const DEFAULT_LOCALE = "zh-CN";
const SUPPORTED_LOCALES = ["zh-CN", "zh-TW", "en", "ja", "ko", "es", "fr", "de"];
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
    switchBookmarkLayoutToList: "切换为列表显示",
    switchBookmarkLayoutToGrid: "切换为一行 4 个显示",
    chooseBookmarkFolder: "选择书签文件夹",
    back: "返回",
    chooseBookmarkFolderPrompt: "选择一个书签文件夹",
    historyTitle: "最近浏览",
    openPortalSurface: "打开导航中枢",
    openHistorySurface: "打开最近浏览",
    historyPreviousPage: "上一条最近浏览",
    historyNextPage: "下一条最近浏览",
    refreshHistory: "刷新历史记录",
    pinnedTitle: "置顶",
    recentTitle: "最近 · 时间流",
    quickSearchPlaceholder: "搜索或输入网址",
    quickSearch: "搜索",
    quickSearchLocal: "打开",
    quickSearchAggregate: "聚合搜索",
    quickSearchAiCommandHint: "输入 /gpt 或 /chatgpt 切换 ChatGPT，输入 /claude /gemini /grok 切换 AI",
    quickSearchAiSelected: "当前选择",
    quickSearchEngine: "搜索模式",
    quickSearchWith: "使用 {engine} 搜索",
    quickSearchWithAi: "发送到 {engine}",
    localSearchHistory: "历史",
    localSearchBookmark: "书签",
    localSearchNoResults: "没有匹配的历史或书签。",
    addFavoriteSite: "添加常用网站",
    deleteFavoriteSite: "删除常用网站",
    favoriteSiteLimit: "常用网站最多 {count} 个。",
    portalCategoryItems: "{count} 个入口",
    deleteCustomPortal: "删除自定义入口",
    openSettings: "设置中心",
    closeSettings: "关闭设置中心",
    settingsTitle: "设置中心",
    appearanceModeTitle: "外观模式",
    themeModeSystem: "跟随",
    themeModeLight: "日间",
    themeModeDark: "夜间",
    presetPaletteTitle: "主题配色",
    syncSettingsTitle: "云端同步",
    syncSettingsReady: "配置会跟随 Chrome 账号同步",
    syncSettingsReadyDetail: "同一 Google 账号安装后会自动恢复。",
    syncSettingsUnavailable: "当前浏览器不支持同步",
    syncSettingsUnavailableDetail: "仍会保存在这台设备。",
    syncSettingsDone: "刚刚写入同步区",
    syncSettingsDoneDetail: "Chrome 会自动分发到同账号设备。",
    syncSettingsNow: "手动同步",
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
    onboardingAiBody: "输入 /gpt、/claude、/gemini 或 /grok 可跳转并尝试填入问题；若对方网站要求登录或改版，请手动粘贴暂存问题。",
    onboardingStartTitle: "从两个动作开始",
    onboardingStartBody: "添加一个常用网站，再到导航中枢选择一个书签文件夹。你可以随时在设置中心调整主题和同步。",
    onboardingFeedbackTitle: "遇到问题直接反馈",
    onboardingFeedbackBody: "反馈时带上浏览器、Wayleaf 版本和失败场景，最容易定位。",
    onboardingFeedback: "反馈问题",
    onboardingDone: "开始使用",
    closeOnboarding: "关闭指引",
    customPaletteTitle: "自定义强调色",
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
    portalTitle: "導航中樞",
    mobilePortalTab: "快捷",
    mobileMediaTab: "資訊",
    smartPortalTab: "智能常用",
    bookmarkPortalTab: "自選書籤",
    mobileHistoryTab: "歷史",
    quickSearchPlaceholder: "搜尋或輸入網址",
    quickSearch: "搜尋",
    quickSearchLocal: "打開",
    quickSearchAggregate: "聚合搜尋",
    quickSearchAiCommandHint: "輸入 /gpt 或 /chatgpt 切換 ChatGPT，輸入 /claude /gemini /grok 切換 AI",
    quickSearchAiSelected: "目前選擇",
    quickSearchEngine: "搜尋模式",
    quickSearchWith: "使用 {engine} 搜尋",
    quickSearchWithAi: "送到 {engine}",
    portalCategoryItems: "{count} 個入口",
    portalCategories: "智能分類",
    portalCategoriesExpand: "展開",
    portalCategoriesCollapse: "收起",
    portalCategoryFeatured: "常用入口",
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
    back: "返回",
    chooseBookmarkFolderPrompt: "選擇一個書籤資料夾",
    historyTitle: "最近瀏覽",
    openPortalSurface: "打開導航中樞",
    openHistorySurface: "打開最近瀏覽",
    pinnedTitle: "釘選",
    recentTitle: "最近",
    unnamedFolder: "未命名資料夾",
    bookmarkRoot: "書籤",
    bookmarkMeta: "{folder} · {count} 個網站",
    bookmarkCount: "{count} 個網站",
    quickSearchLocal: "打開",
    localSearchHistory: "歷史",
    localSearchBookmark: "書籤",
    localSearchNoResults: "沒有匹配的歷史或書籤。",
    addFavoriteSite: "新增常用網站",
    deleteFavoriteSite: "刪除常用網站",
    favoriteSiteLimit: "常用網站最多 {count} 個。",
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
    switchBookmarkLayoutToList: "Switch to list view",
    switchBookmarkLayoutToGrid: "Switch to 4-column grid view",
    chooseBookmarkFolder: "Choose bookmark folder",
    back: "Back",
    chooseBookmarkFolderPrompt: "Choose a bookmark folder",
    historyTitle: "Recent browsing",
    openPortalSurface: "Open navigation hub",
    openHistorySurface: "Open recent browsing",
    historyPreviousPage: "Previous recent page",
    historyNextPage: "Next recent page",
    refreshHistory: "Refresh history",
    pinnedTitle: "Pinned",
    recentTitle: "Recent timeline",
    quickSearchPlaceholder: "Search or enter URL",
    quickSearch: "Search",
    quickSearchLocal: "Open",
    quickSearchAggregate: "Aggregate search",
    quickSearchAiCommandHint: "Type /gpt or /chatgpt for ChatGPT, or /claude /gemini /grok to switch AI",
    quickSearchAiSelected: "Selected",
    quickSearchEngine: "Search mode",
    quickSearchWith: "Search with {engine}",
    quickSearchWithAi: "Send to {engine}",
    localSearchHistory: "History",
    localSearchBookmark: "Bookmark",
    localSearchNoResults: "No matching history or bookmarks.",
    addFavoriteSite: "Add favorite site",
    deleteFavoriteSite: "Remove favorite site",
    favoriteSiteLimit: "Up to {count} favorite sites.",
    portalCategoryItems: "{count} shortcuts",
    deleteCustomPortal: "Remove custom portal",
    openSettings: "Settings",
    closeSettings: "Close settings",
    settingsTitle: "Settings",
    appearanceModeTitle: "Appearance",
    themeModeSystem: "Follow",
    themeModeLight: "Light",
    themeModeDark: "Dark",
    presetPaletteTitle: "Theme palettes",
    syncSettingsTitle: "Cloud sync",
    syncSettingsReady: "Settings sync with your Chrome account",
    syncSettingsReadyDetail: "Install with the same Google account to restore.",
    syncSettingsUnavailable: "Sync is unavailable in this browser",
    syncSettingsUnavailableDetail: "Settings still stay on this device.",
    syncSettingsDone: "Written to sync storage",
    syncSettingsDoneDetail: "Chrome will distribute it to signed-in devices.",
    syncSettingsNow: "Sync now",
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
    onboardingAiBody: "Type /gpt, /claude, /gemini, or /grok to open and try filling a prompt. If the AI site needs login or changes, paste the saved prompt manually.",
    onboardingStartTitle: "Start with two actions",
    onboardingStartBody: "Add one favorite site, then choose a bookmark folder from the navigation hub. Theme and sync stay in Settings.",
    onboardingFeedbackTitle: "Report issues directly",
    onboardingFeedbackBody: "Include your browser, Wayleaf version, and the failed scenario so the issue is easy to reproduce.",
    onboardingFeedback: "Report issue",
    onboardingDone: "Start using",
    closeOnboarding: "Close guide",
    customPaletteTitle: "Custom accents",
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
    bookmarkCount: "{count} 件のサイト",
    unnamedPage: "名称未設定のページ",
    website: "Website"
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
    bookmarkCount: "사이트 {count}개",
    unnamedPage: "제목 없는 페이지",
    website: "Website"
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
    bookmarkCount: "{count} sitios",
    unnamedPage: "Página sin título",
    website: "Website"
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
    bookmarkCount: "{count} sites",
    unnamedPage: "Page sans titre",
    website: "Website"
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
    bookmarkCount: "{count} Websites",
    unnamedPage: "Unbenannte Seite",
    website: "Website"
  }
};
const LOCALE = resolveLocale();
const MEDIA_FEED_LOCALE_LANGUAGE = mediaFeedLanguageForLocale(LOCALE);

const secondaryShell = document.querySelector("#secondaryShell");
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
const toggleBookmarkLayoutButton = document.querySelector("#toggleBookmarkLayoutButton");
const closeBookmarkPickerButton = document.querySelector("#closeBookmarkPickerButton");
const bookmarkPickerTitle = document.querySelector("#bookmarkPickerTitle");
const pinnedGrid = document.querySelector("#pinnedGrid");
const historyGrid = document.querySelector("#historyGrid");
const recentHistoryFolders = document.querySelector("#recentHistoryFolders");
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
const settingsPanel = document.querySelector("#settingsPanel");
const closeSettingsButton = document.querySelector("#closeSettingsButton");
const palettePresetGrid = document.querySelector("#palettePresetGrid");
const syncSettingsRow = document.querySelector("#syncSettingsRow");
const syncSettingsStatus = document.querySelector("#syncSettingsStatus");
const syncSettingsDetail = document.querySelector("#syncSettingsDetail");
const syncSettingsNowButton = document.querySelector("#syncSettingsNowButton");
const lightAccentInput = document.querySelector("#lightAccentInput");
const darkAccentInput = document.querySelector("#darkAccentInput");
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
const portalFormError = document.querySelector("#portalFormError");
const cancelPortalButton = document.querySelector("#cancelPortalButton");
const mobileSectionTabs = [...document.querySelectorAll(".mobile-section-tab")];
let bookmarkRefreshTimer = 0;
let activeBookmarkDeleteCard = null;
let activeFavoriteDeleteCard = null;
let localSearchRequestId = 0;
let localSearchResults = [];
let searchSuggestionsHideTimer = 0;
let searchSuggestionsShowFrame = 0;
let activeSurfacePanelId = "";
let bookmarkLayout = "grid";
let activeSearchEngine = DEFAULT_SEARCH_ENGINE;
let selectedLocalSearchEngine = AGGREGATE_SEARCH_ENGINE_IDS[0];
let aiModeExitTimer = 0;
let portalCategoryState = {};
let activePortalView = "smart";
let activeThemeMode = DEFAULT_THEME_MODE;
let activeThemePalette = DEFAULT_THEME_PALETTE;
let activeCustomThemeColors = { ...DEFAULT_CUSTOM_THEME_COLORS };
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
let favoriteSitesHydrated = false;
const whiteSvgIconDataUrlCache = new Map();
const mediaFeedLoadMoreSentinel = document.createElement("div");
mediaFeedLoadMoreSentinel.className = "media-feed-load-more";
mediaFeedLoadMoreSentinel.setAttribute("role", "status");

ensureChromeApiFallback();
document.addEventListener("DOMContentLoaded", initWithStorageMigration);

async function initWithStorageMigration() {
  await migrateSyncStorageFromLocal();
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
  if (SYNC_STORAGE_KEYS.has(key) && chrome.storage?.sync) {
    return chrome.storage.sync;
  }
  return chrome.storage?.local || chrome.storage?.sync;
}

async function getStoredValues(defaults = {}) {
  const localDefaults = {};
  const syncDefaults = {};
  Object.entries(defaults).forEach(([key, value]) => {
    if (storageAreaForKey(key) === chrome.storage?.sync) {
      syncDefaults[key] = value;
    } else {
      localDefaults[key] = value;
    }
  });

  const [localResult, syncResult] = await Promise.all([
    Object.keys(localDefaults).length ? storageAreaForKey("__local__").get(localDefaults) : Promise.resolve({}),
    Object.keys(syncDefaults).length ? chrome.storage.sync.get(syncDefaults) : Promise.resolve({})
  ]);
  return { ...localResult, ...syncResult };
}

async function setStoredValues(values = {}) {
  const localValues = {};
  const syncValues = {};
  Object.entries(values).forEach(([key, value]) => {
    if (storageAreaForKey(key) === chrome.storage?.sync) {
      syncValues[key] = value;
    } else {
      localValues[key] = value;
    }
  });

  await Promise.all([
    Object.keys(localValues).length ? storageAreaForKey("__local__").set(localValues) : Promise.resolve(),
    Object.keys(syncValues).length ? chrome.storage.sync.set(syncValues) : Promise.resolve()
  ]);
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
    const missingSyncValues = {};
    keys.forEach((key) => {
      if (typeof localValues[key] !== "undefined" && typeof syncValues[key] === "undefined") {
        missingSyncValues[key] = localValues[key];
      }
    });
    if (Object.keys(missingSyncValues).length > 0) {
      await chrome.storage.sync.set(missingSyncValues);
    }
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

function t(key, values = {}) {
  const template = messageTemplate(key);
  return template.replace(/\{(\w+)\}/g, (_, valueKey) => String(values[valueKey] ?? ""));
}

function mediaFeedLanguageForLocale(locale) {
  return String(locale || "").toLowerCase().startsWith("zh") ? "zh" : "en";
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
  setButtonLabel(portalSurfaceButton, t("openPortalSurface"));
  surfaceBackButtons.forEach((button) => setButtonLabel(button, t("back")));
  document.querySelector("#recent-folders-title").textContent = t("historyTitle");
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
  updateBookmarkLayoutButton();
  setButtonLabel(chooseBookmarkFolderButton, t("chooseBookmarkFolder"));
  setButtonLabel(refreshHistoryButton, t("refreshHistory"));
  setButtonLabel(settingsButton, t("openSettings"));
  setButtonLabel(closeSettingsButton, t("closeSettings"));
  setButtonLabel(favoriteAddButton, t("addFavoriteSite"));
  setStaticButtonIcons();
  applySettingsLocale();
  updateQuickSearchModeUi();
  quickSearchInput.placeholder = t("quickSearchPlaceholder");
  quickSearchInput.setAttribute("aria-label", t("quickSearchPlaceholder"));

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
  button.title = label;
  button.setAttribute("aria-label", label);
}

function setStaticButtonIcons() {
  portalSurfaceButton.querySelector(".button-icon").innerHTML = gridIcon();
  surfaceBackButtons.forEach((button) => {
    button.querySelector(".button-icon").innerHTML = arrowLeftIcon();
  });
  togglePortalFormButton.querySelector(".button-icon").innerHTML = plusIcon();
  refreshBookmarkFolderButton.querySelector(".button-icon").innerHTML = refreshIcon();
  chooseBookmarkFolderButton.querySelector(".button-icon").innerHTML = folderPlusIcon();
  closeBookmarkPickerButton.querySelector(".button-icon").innerHTML = arrowLeftIcon();
  refreshHistoryButton.querySelector(".button-icon").innerHTML = refreshIcon();
  settingsButton.querySelector(".theme-toggle-icon").innerHTML = settingsIcon();
  closeSettingsButton.querySelector(".button-icon").innerHTML = closeIcon();
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
  document.querySelector("#appearanceModeTitle").textContent = t("appearanceModeTitle");
  document.querySelector("#presetPaletteTitle").textContent = t("presetPaletteTitle");
  document.querySelector("#syncSettingsTitle").textContent = t("syncSettingsTitle");
  document.querySelector("#customPaletteTitle").textContent = t("customPaletteTitle");
  document.querySelector('[data-theme-mode="system"]').textContent = t("themeModeSystem");
  document.querySelector('[data-theme-mode="light"]').textContent = t("themeModeLight");
  document.querySelector('[data-theme-mode="dark"]').textContent = t("themeModeDark");
  setButtonLabel(syncSettingsNowButton, t("syncSettingsNow"));
  updateSyncSettingsUi();
  lightAccentInput.closest("label").querySelector("span").textContent = t("lightAccent");
  darkAccentInput.closest("label").querySelector("span").textContent = t("darkAccent");
}

async function init() {
  applyLocale();
  await initThemeMode();
  await initQuickSearchEngine();
  renderFavoriteSites();
  renderPortals();
  initBookmarkLayout();
  renderSelectedBookmarkFolder();
  refreshHistory();

  chooseBookmarkFolderButton.addEventListener("click", openBookmarkPicker);
  refreshBookmarkFolderButton.addEventListener("click", renderSelectedBookmarkFolder);
  toggleBookmarkLayoutButton.addEventListener("click", toggleBookmarkLayout);
  closeBookmarkPickerButton.addEventListener("click", closeBookmarkPicker);
  refreshHistoryButton.addEventListener("click", refreshHistory);
  portalSurfaceButton.addEventListener("click", () => toggleSurfacePanel("portalPanel"));
  surfaceBackButtons.forEach((button) => {
    button.addEventListener("click", () => setActiveSurfacePanel(""));
  });
  quickSearchForm.addEventListener("submit", handleQuickSearchSubmit);
  quickSearchInput.addEventListener("keydown", handleQuickSearchInputKeydown);
  quickSearchInput.addEventListener("input", handleQuickSearchInput);
  quickSearchInput.addEventListener("focus", handleQuickSearchFocus);
  quickSearchInput.addEventListener("blur", handleQuickSearchBlur);
  portalModeTabs.forEach((tab) => {
    tab.addEventListener("click", () => activatePortalView(tab.dataset.portalView));
  });
  togglePortalFormButton.addEventListener("click", showPortalForm);
  cancelPortalButton.addEventListener("click", hidePortalForm);
  portalForm.addEventListener("submit", handlePortalSubmit);
  favoriteAddButton.addEventListener("click", toggleFavoriteForm);
  cancelFavoriteButton.addEventListener("click", hideFavoriteForm);
  favoriteForm.addEventListener("submit", handleFavoriteSubmit);
  onboardingCloseButton?.addEventListener("click", dismissOnboardingGuide);
  onboardingDoneButton?.addEventListener("click", dismissOnboardingGuide);
  settingsButton.addEventListener("click", toggleSettingsPanel);
  closeSettingsButton.addEventListener("click", () => closeSettingsPanel({ restoreFocus: true }));
  syncSettingsNowButton?.addEventListener("click", handleManualSyncSettings);
  document.querySelectorAll("[data-theme-mode]").forEach((button) => {
    button.addEventListener("click", () => setThemeMode(button.dataset.themeMode, { persist: true }));
  });
  lightAccentInput.addEventListener("input", handleCustomThemeColorInput);
  darkAccentInput.addEventListener("input", handleCustomThemeColorInput);
  mobileSectionTabs.forEach((tab) => {
    tab.addEventListener("click", () => activateMobilePanel(tab.dataset.panelTarget));
  });
  document.addEventListener("pointerdown", handleBookmarkDeleteDismiss, true);
  document.addEventListener("pointerdown", handleFavoriteDeleteDismiss, true);
  document.addEventListener("pointerdown", handleSurfacePanelDismiss, true);
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
  togglePortalFormButton.hidden = nextView === "bookmarks";
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
  secondaryShell.dataset.activeSurface = activeSurfacePanelId;
  secondaryShell.dataset.previousSurface = previousPanelId || "";
  secondaryShell.classList.toggle("surface-open", Boolean(activeSurfacePanelId));
  secondaryShell.classList.toggle("surface-closing", Boolean(!activeSurfacePanelId && previousPanelId));
  document.body.classList.toggle("surface-open", Boolean(activeSurfacePanelId));
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
  if (!activeSurfacePanelId && previousPanelId) {
    window.setTimeout(() => {
      if (!activeSurfacePanelId) {
        secondaryShell.classList.remove("surface-closing");
        secondaryShell.dataset.previousSurface = "";
        document.querySelectorAll(".panel.surface-closing").forEach((panel) => {
          panel.classList.remove("surface-closing");
        });
      }
    }, 340);
  }
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
  }
}

async function initQuickSearchEngine() {
  await setQuickSearchEngine(DEFAULT_SEARCH_ENGINE);
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
  const iconSite = { url: engine.searchUrl || engine.directUrl || "", icon: engine.icon || "" };
  applySiteIcon(icon, iconSite);
  target.appendChild(icon);
}

function handleGlobalEscape(event) {
  if (event.key !== "Escape") {
    return;
  }
  if (onboardingGuide && !onboardingGuide.hidden) {
    event.preventDefault();
    dismissOnboardingGuide();
    return;
  }
  exitAiQuickSearchMode();
  hideSearchSuggestions();
  clearFavoriteDeleteMode();
  hideFavoriteForm();
  setActiveSurfacePanel("");
  closeSettingsPanel();
}

async function setQuickSearchEngine(engineId, options = {}) {
  const nextEngine = searchEngineById(engineId);
  activeSearchEngine = nextEngine.id;
  updateQuickSearchModeUi();
  handleQuickSearchInput();
}

function updateQuickSearchModeUi() {
  const engine = searchEngineById(activeSearchEngine);
  quickSearchForm.style.setProperty("--ai-theme-color", engine.themeColor || "var(--accent)");
  renderAiEnginePill(engine);
}

function renderAiEnginePill(engine) {
  if (!aiEnginePill) {
    return;
  }
  if (engine.local) {
    if (!aiEnginePill.hidden) {
      searchWorkbench?.setAttribute("data-ai-exiting", "");
      searchWorkbench?.removeAttribute("data-ai-active");
      aiEnginePill.dataset.exiting = "true";
      window.clearTimeout(aiModeExitTimer);
      aiModeExitTimer = window.setTimeout(() => {
        if (searchEngineById(activeSearchEngine).local) {
          searchWorkbench?.removeAttribute("data-ai-exiting");
          aiEnginePill.hidden = true;
          aiEnginePill.replaceChildren();
          delete aiEnginePill.dataset.exiting;
        }
      }, 300);
    } else {
      searchWorkbench?.removeAttribute("data-ai-active");
      searchWorkbench?.removeAttribute("data-ai-exiting");
    }
    return;
  }
  window.clearTimeout(aiModeExitTimer);
  searchWorkbench?.removeAttribute("data-ai-exiting");
  delete aiEnginePill.dataset.exiting;
  const icon = document.createElement("img");
  const label = document.createElement("strong");
  icon.alt = "";
  icon.decoding = "async";
  icon.dataset.engineIcon = engine.id;
  applySiteIcon(icon, {
    url: engine.searchUrl || engine.directUrl || "",
    title: engine.label,
    icon: engine.icon || ""
  });
  label.textContent = engine.label;
  aiEnginePill.replaceChildren(icon, label);
  aiEnginePill.hidden = false;
  searchWorkbench?.setAttribute("data-ai-active", engine.id);
}

function searchEngineById(engineId, options = {}) {
  const engine = SEARCH_ENGINES.find((item) => item.id === engineId);
  if (options.strict) {
    return engine || null;
  }
  return engine || SEARCH_ENGINES[0];
}

async function initBookmarkLayout() {
  try {
    const result = await getStoredValues({ [BOOKMARK_LAYOUT_STORAGE_KEY]: "grid" });
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
    await setStoredValues({ [BOOKMARK_LAYOUT_STORAGE_KEY]: nextLayout });
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
  refreshAdaptiveSiteIcons();
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
    const lightMode = palette.modes.light;
    const darkMode = palette.modes.dark;
    button.innerHTML = `
      <span class="palette-swatch-pair" aria-hidden="true">
        <span style="background:${lightMode.accent}"></span>
        <span style="background:${darkMode.accent}"></span>
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
  if (activeThemePalette === CUSTOM_THEME_PALETTE_ID) {
    const basePalette = themePaletteById(DEFAULT_THEME_PALETTE);
    setThemeVariables({
      modes: {
        light: {
          ...basePalette.modes.light,
          accent: activeCustomThemeColors.light,
          accentStrong: mixHexColors(activeCustomThemeColors.light, "#000000", 0.32),
          focus: mixHexColors(activeCustomThemeColors.light, "#2f82c4", 0.48)
        },
        dark: {
          ...basePalette.modes.dark,
          accent: activeCustomThemeColors.dark,
          accentStrong: mixHexColors(activeCustomThemeColors.dark, "#ffffff", 0.28),
          focus: mixHexColors(activeCustomThemeColors.dark, "#68b7f2", 0.4),
          onAccent: readableTextColor(activeCustomThemeColors.dark)
        }
      }
    });
    return;
  }
  setThemeVariables(themePaletteById(activeThemePalette));
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
  if (!syncSettingsRow || !syncSettingsStatus || !syncSettingsDetail || !syncSettingsNowButton) {
    return;
  }
  const normalizedStatus = status === "done" ? "done" : (storageSyncAvailable() ? "ready" : "unavailable");
  syncSettingsRow.dataset.status = normalizedStatus;
  syncSettingsNowButton.disabled = normalizedStatus === "unavailable";
  syncSettingsNowButton.setAttribute("aria-disabled", String(syncSettingsNowButton.disabled));
  syncSettingsNowButton.querySelector(".button-icon").innerHTML = refreshIcon();
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
    const values = await getStoredValues(Object.fromEntries(keys.map((key) => [key, undefined])));
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
    await setStoredValues(payload);
    updateSyncSettingsUi("done");
  } catch (error) {
    console.warn("Failed to manually sync settings", error);
    updateSyncSettingsUi();
  }
}

function toggleSettingsPanel() {
  if (settingsPanel.hidden) {
    openSettingsPanel();
    return;
  }
  closeSettingsPanel({ restoreFocus: true });
}

function openSettingsPanel() {
  window.clearTimeout(settingsPanelCloseTimer);
  settingsPanel.hidden = false;
  settingsPanel.dataset.open = "true";
  settingsButton.setAttribute("aria-expanded", "true");
  updateThemeSettingsUi();
  updateSyncSettingsUi();
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
  if (event.key === "Escape" && !event.isComposing && !searchEngineById(activeSearchEngine).local) {
    event.preventDefault();
    event.stopPropagation();
    exitAiQuickSearchMode();
    return;
  }
  if (event.key === "Backspace" && !event.isComposing && !searchEngineById(activeSearchEngine).local && quickSearchInput.value.length === 0) {
    event.preventDefault();
    event.stopPropagation();
    exitAiQuickSearchMode();
    return;
  }
  if (event.key !== "Enter" || event.isComposing) {
    return;
  }
  event.preventDefault();
  submitQuickSearch();
}

function exitAiQuickSearchMode() {
  if (searchEngineById(activeSearchEngine).local) {
    return;
  }
  activeSearchEngine = DEFAULT_SEARCH_ENGINE;
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
  if (!searchEngineById(activeSearchEngine).local) {
    hideSearchSuggestions();
    return;
  }
  renderLocalSearchSuggestions(normalizeText(quickSearchInput.value));
}

function handleQuickSearchFocus() {
  setQuickSearchActive(true);
  handleQuickSearchInput();
}

function searchAiCommand(value) {
  const match = String(value || "").match(/^\/([a-z]+)(?:\s+|$)(.*)$/i);
  if (!match) {
    return null;
  }
  const command = `/${match[1].toLowerCase()}`;
  const engine = AI_COMMAND_ENGINES.find((item) => aiEngineCommands(item).includes(command));
  if (!engine) {
    return null;
  }
  return {
    engine,
    remainder: match[2] || ""
  };
}

function aiEngineCommands(engine) {
  return Array.from(new Set([engine.command, ...(engine.commands || [])]
    .filter(Boolean)
    .map((item) => String(item).toLowerCase())));
}

function handleQuickSearchBlur() {
  window.setTimeout(() => {
    const activeElement = document.activeElement;
    const keepActive = activeElement instanceof Element
      && (quickSearchForm.contains(activeElement) || searchSuggestions.contains(activeElement));
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

async function submitAiDirectSearch(engine, query) {
  const targetUrl = engine.directUrl || engine.searchUrl;
  const token = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  await saveAiDirectPrompt(token, {
    prompt: query,
    engineId: engine.id,
    createdAt: Date.now()
  });
  window.location.assign(aiDirectTargetUrl(targetUrl, token));
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

function aiDirectTargetUrl(targetUrl, token) {
  try {
    const url = new URL(targetUrl);
    url.searchParams.set(AI_DIRECT_PROMPT_TOKEN_PARAM, token);
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
  const results = await localSearchItems(query);
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
  searchWorkbench?.classList.remove("suggestions-closing");
  searchSuggestions.hidden = false;
  searchSuggestionsShowFrame = requestAnimationFrame(() => {
    searchWorkbench?.classList.add("suggestions-open");
  });
}

function finishHideSearchSuggestions() {
  searchWorkbench?.classList.remove("suggestions-closing");
  searchSuggestions.hidden = true;
  searchSuggestions.replaceChildren();
}

function createSearchEngineSuggestion(query) {
  const engines = AGGREGATE_SEARCH_ENGINE_IDS
    .map((engineId) => searchEngineById(engineId, { strict: true }))
    .filter(Boolean);
  const selectedEngine = selectedLocalSearchEngineConfig();
  return {
    type: "engine-search",
    title: selectedEngine ? t("quickSearchWith", { engine: selectedEngine.label }) : t("quickSearch"),
    meta: query,
    engines,
    query,
    selectedEngineId: selectedEngine?.id || AGGREGATE_SEARCH_ENGINE_IDS[0]
  };
}

async function localSearchItems(query) {
  const [historyItems, bookmarkItems] = await Promise.all([
    searchHistoryItems(query),
    searchBookmarkItems(query)
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

async function searchHistoryItems(query) {
  if (!chrome.history?.search) {
    return [];
  }
  try {
    const items = await chrome.history.search({
      text: query,
      maxResults: 24,
      startTime: Date.now() - (BOOKMARK_HISTORY_LOOKBACK_DAYS * 24 * 60 * 60 * 1000)
    });
    const normalizedQuery = normalizeText(query).toLowerCase();
    return items
      .filter((item) => item.url && isWebUrl(item.url) && fuzzyMatchesHistoryItem(item, normalizedQuery))
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

async function searchBookmarkItems(query) {
  if (!chrome.bookmarks?.getTree) {
    return [];
  }
  try {
    const tree = await chrome.bookmarks.getTree();
    const normalizedQuery = normalizeText(query).toLowerCase();
    return flattenBookmarkSites(tree)
      .filter((entry) => entry.url && isWebUrl(entry.url) && fuzzyMatchesBookmarkEntry(entry, normalizedQuery))
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
  const trailing = item.type === "engine-search" ? createSearchEngineChoices(item) : document.createElement("span");
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
  meta.textContent = item.meta || (item.type === "history"
    ? `${formatHistoryTimestamp(item.lastVisitTime)} · ${compactSiteDomain(item.url)}`
    : compactSiteDomain(item.url));
  if (item.type !== "engine-search") {
    trailing.className = "search-suggestion-badge";
    trailing.textContent = item.type === "history" ? t("localSearchHistory") : t("localSearchBookmark");
  }
  copy.append(title, meta);
  link.append(icon, copy, trailing);
  return link;
}

function createSearchEngineChoices(item) {
  const choices = document.createElement("span");
  choices.className = "search-engine-choices";
  const selectedEngineId = item.selectedEngineId || selectedLocalSearchEngine;
  item.engines.forEach((engine) => {
    const button = document.createElement("button");
    button.className = "search-engine-choice";
    button.type = "button";
    button.title = t("quickSearchWith", { engine: engine.label });
    button.setAttribute("aria-label", t("quickSearchWith", { engine: engine.label }));
    button.setAttribute("aria-pressed", String(engine.id === selectedEngineId));
    if (engine.icon) {
      const icon = document.createElement("img");
      icon.alt = "";
      applySiteIcon(icon, { url: engine.searchUrl || engine.directUrl || "", icon: engine.icon });
      button.append(icon);
    } else {
      button.textContent = engine.label.slice(0, 1);
    }
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      selectedLocalSearchEngine = engine.id;
      renderLocalSearchSuggestions(normalizeText(quickSearchInput.value));
      quickSearchInput.focus();
    });
    choices.append(button);
  });
  return choices;
}

function submitSelectedSuggestionSearch(item) {
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
    return;
  }
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
  const portalData = await loadBookmarkDrivenPortals(customPortals);
  const featuredPortals = featuredPortalItems(portalData.items);
  const groups = groupPortalsByCategory(portalData.items);
  portalCategoryState = await loadPortalCategoryState(groups);
  if (featuredPortals.length) {
    fragment.appendChild(createPortalCategorySection({
      category: "featured",
      items: featuredPortals,
      featured: true
    }));
  }
  if (groups.length) {
    fragment.appendChild(createPortalClassificationModule(groups));
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

function createPortalClassificationModule(groups) {
  const module = document.createElement("section");
  module.className = "portal-classification-module";
  groups.forEach((group) => {
    const isExpanded = portalCategoryState[group.category]?.expanded !== false;
    const section = createPortalCategorySection({
      ...group,
      collapsible: group.items.length > 0,
      classification: true,
      expanded: isExpanded
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
    const card = createSiteCard(portal);
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

async function renderFavoriteSites() {
  clearFavoriteDeleteMode();
  const favorites = await loadFavoriteSites();
  const previousState = captureFavoriteReorderState();
  const shouldAnimateReorder = favoriteSitesHydrated;
  const fragment = document.createDocumentFragment();
  const favoriteNodes = await Promise.all(favorites.map((site, index) => createFavoriteSite(site, index, {
    awaitDisplayIcon: !favoriteSitesHydrated
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

function updateFavoriteAddButtonState(favoriteCount) {
  const isFull = favoriteCount >= MAX_FAVORITE_SITES;
  favoriteAddButton.disabled = isFull;
  favoriteAddButton.setAttribute("aria-hidden", String(isFull));
  favoriteAddButton.tabIndex = isFull ? -1 : 0;
  favoriteAddButton.dataset.state = isFull ? "hidden" : "visible";
  favoriteAddButton.hidden = isFull;
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
  link.title = site.title || compactSiteDomain(site.url);
  link.setAttribute("aria-label", site.title || compactSiteDomain(site.url));
  if (options.awaitDisplayIcon) {
    await applySiteIcon(icon, site, { awaitDisplayIcon: true });
  } else {
    applySiteIcon(icon, site);
  }
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
  if (favorites.length >= MAX_FAVORITE_SITES) {
    favoriteFormError.textContent = t("favoriteSiteLimit", { count: MAX_FAVORITE_SITES });
    return;
  }
  favorites.push({
    id: String(Date.now()),
    title: favoriteSiteTitleFromUrl(url),
    url,
    icon: await discoverFavoriteSiteIcon(url)
  });
  await saveFavoriteSites(favorites);
  hideFavoriteForm();
  renderFavoriteSites();
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
  const siteKey = siteGroupKey(safeUrl(url));
  const localIcon = localIconForUrl(url);
  if (!siteKey || localIcon) {
    return "";
  }

  const cachedIcon = await loadCachedSiteIcon(siteKey);
  if (cachedIcon) {
    return cachedIcon;
  }

  const discoveredIcon = await fetchAppleTouchIcon(url);
  if (!discoveredIcon) {
    return "";
  }

  await cacheSiteIcon(siteKey, discoveredIcon);
  return discoveredIcon;
}

async function loadCachedSiteIcon(siteKey) {
  try {
    const cache = await loadSiteIconCache();
    const entry = cache[siteKey];
    if (!entry || Date.now() - Number(entry.updatedAt || 0) > SITE_ICON_CACHE_TTL_MS) {
      return "";
    }
    return normalizeStoredSiteIcon(entry.icon);
  } catch {
    return "";
  }
}

async function cacheSiteIcon(siteKey, icon) {
  const normalizedIcon = normalizeStoredSiteIcon(icon);
  if (!siteKey || !normalizedIcon) {
    return;
  }
  const cache = await loadSiteIconCache();
  cache[siteKey] = {
    icon: normalizedIcon,
    updatedAt: Date.now()
  };
  const entries = Object.entries(cache)
    .filter(([, entry]) => normalizeStoredSiteIcon(entry?.icon))
    .sort(([, a], [, b]) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0))
    .slice(0, MAX_CACHED_SITE_ICONS);
  await setStoredValues({ [SITE_ICON_CACHE_STORAGE_KEY]: Object.fromEntries(entries) });
}

async function loadSiteIconCache() {
  const result = await getStoredValues({ [SITE_ICON_CACHE_STORAGE_KEY]: {} });
  const cache = result[SITE_ICON_CACHE_STORAGE_KEY];
  return cache && typeof cache === "object" && !Array.isArray(cache) ? cache : {};
}

async function fetchAppleTouchIcon(url) {
  const parsedUrl = safeUrl(url);
  if (!parsedUrl) {
    return "";
  }
  try {
    const html = await fetchTextWithTimeout(parsedUrl.origin, SITE_ICON_DISCOVERY_TIMEOUT_MS);
    const iconUrl = bestAppleTouchIconUrl(html, parsedUrl.origin);
    if (!iconUrl) {
      return "";
    }
    return await fetchImageDataUrl(iconUrl);
  } catch (error) {
    console.info("Site icon discovery skipped", parsedUrl.hostname, error);
    return "";
  }
}

function bestAppleTouchIconUrl(html, baseUrl) {
  const candidates = [];
  const linkPattern = /<link\b[^>]*>/gi;
  const attrPattern = /([a-zA-Z:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;
  for (const [linkTag] of html.matchAll(linkPattern)) {
    const attrs = {};
    for (const match of linkTag.matchAll(attrPattern)) {
      attrs[match[1].toLowerCase()] = match[2] || match[3] || match[4] || "";
    }
    const rel = normalizeText(attrs.rel).toLowerCase();
    const href = normalizeText(attrs.href);
    if (!href || !/(^|\s)(apple-touch-icon|icon)(\s|$)/.test(rel)) {
      continue;
    }
    const sizes = parseIconSize(attrs.sizes);
    candidates.push({
      href,
      score: (rel.includes("apple-touch-icon") ? 1000 : 0) + Math.min(sizes, 512)
    });
  }
  return candidates
    .sort((a, b) => b.score - a.score)
    .map((candidate) => absoluteIconUrl(candidate.href, baseUrl))
    .find(Boolean) || "";
}

function parseIconSize(value) {
  const sizes = String(value || "").match(/\d+x\d+/gi) || [];
  return sizes.reduce((max, size) => {
    const [width, height] = size.toLowerCase().split("x").map(Number);
    return Math.max(max, Math.min(width || 0, height || 0));
  }, 0);
}

function absoluteIconUrl(value, baseUrl) {
  try {
    const iconUrl = new URL(value, baseUrl);
    return /^https?:$/.test(iconUrl.protocol) ? iconUrl.href : "";
  } catch {
    return "";
  }
}

async function fetchTextWithTimeout(url, timeoutMs) {
  const response = await withTimeout(fetch(url, {
    cache: "force-cache",
    credentials: "omit",
    redirect: "follow"
  }), timeoutMs, "Site icon discovery timed out.");
  if (!response.ok) {
    throw new Error(`Site icon page request failed: ${response.status}`);
  }
  return await response.text();
}

async function fetchImageDataUrl(url) {
  const response = await withTimeout(fetch(url, {
    cache: "force-cache",
    credentials: "omit",
    redirect: "follow"
  }), SITE_ICON_FETCH_TIMEOUT_MS, "Site icon image request timed out.");
  if (!response.ok) {
    throw new Error(`Site icon image request failed: ${response.status}`);
  }
  const contentType = response.headers.get("content-type") || "";
  if (!/^image\/(png|jpeg|jpg|webp|svg\+xml|x-icon|vnd\.microsoft\.icon)\b/i.test(contentType)) {
    return "";
  }
  const blob = await response.blob();
  if (!blob.size || blob.size > MAX_CACHED_SITE_ICON_BYTES) {
    return "";
  }
  return await blobToDataUrl(blob);
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
    ? value
    : "";
}

function favoriteSiteTitleFromUrl(url) {
  const parsedUrl = safeUrl(url);
  return siteDisplayName(parsedUrl, "").slice(0, MAX_PORTAL_TITLE_LENGTH) || compactSiteDomain(url);
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
  await renderFavoriteSites();
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
  storeIconSiteContext(icon, site);
  applySiteIconTile(icon, site, localIcon);
  if (iconSource) {
    const displayIcon = displayIconSource(icon, iconSource, options);
    const setIconSource = (source) => {
      icon.dataset.iconSource = iconSource;
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
    return undefined;
  }
}

function localIconForUrl(url) {
  const parsedUrl = safeUrl(url);
  const siteKey = siteGroupKey(parsedUrl);
  return siteKey ? SITE_ICON_BY_SITE_KEY[siteKey] || "" : "";
}

function normalizedSiteIconPath(site) {
  return localIconForUrl(site.url) || normalizeStoredSiteIcon(site.icon || "");
}

function applyHistoryIcon(icon, site) {
  applySiteIcon(icon, site);
}

function applyGeneratedSiteIcon(icon, site) {
  const parsedUrl = safeUrl(site.url);
  const label = siteDisplayName(parsedUrl, site.title).slice(0, 2).toUpperCase() || "?";
  icon.removeAttribute("srcset");
  icon.dataset.iconMissing = "false";
  const tileColors = genericIconTileColors(parsedUrl?.hostname || site.url || site.title);
  applyIconTile(icon, "generated", tileColors, false);
  icon.src = generatedSiteIconDataUrl(label, parsedUrl?.hostname || site.url);
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
  const tileColor = siteKey ? SITE_ICON_TILE_COLOR_BY_SITE_KEY[siteKey] || "" : "";
  const tileMode = iconPath ? "brand" : "plain";
  const tileColors = iconPath && tileColor
    ? brandIconTileColors(tileColor, siteKey, iconPath)
    : genericIconTileColors(parsedUrl?.hostname || site.url || site.title);
  applyIconTile(icon, tileMode, tileColors, Boolean(iconPath));
}

function brandIconTileColors(tileColor, siteKey = "", iconPath = "") {
  const color = normalizeHexColor(tileColor);
  if (!color) {
    return genericIconTileColors("");
  }
  if (nativeRoundedBrandIcon(siteKey)) {
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
  return !String(iconPath || "").endsWith(".svg") || MULTICOLOR_BRAND_ICON_SITE_KEYS.has(siteKey);
}

function nativeRoundedBrandIcon(siteKey) {
  return NATIVE_ROUNDED_BRAND_ICON_SITE_KEYS.has(siteKey);
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

function displayIconSource(icon, source, options = {}) {
  if (icon.dataset.iconTile !== "brand" || !source.endsWith(".svg")) {
    return source;
  }
  if (icon.dataset.iconTile === "brand" && !shouldInvertBrandSvg(source)) {
    return source;
  }
  if (icon.dataset.iconTile === "brand" && !iconTileNeedsWhiteGlyph(currentIconTileColor(icon))) {
    return source;
  }
  if (options.awaitDisplayIcon) {
    return whiteSvgIconSource(source);
  }
  whiteSvgIconSource(source).then((displaySource) => {
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

function shouldInvertBrandSvg(source) {
  const siteUrl = iconSourceSiteUrl(source);
  const siteKey = siteGroupKey(safeUrl(siteUrl));
  if (nativeRoundedBrandIcon(siteKey)) {
    return false;
  }
  if (keepsBrandIconOriginal(siteKey, source)) {
    return false;
  }
  const tileColor = siteKey ? normalizeHexColor(SITE_ICON_TILE_COLOR_BY_SITE_KEY[siteKey] || "") : "";
  return Boolean(tileColor);
}

function iconSourceSiteUrl(source) {
  for (const [siteKey, iconPath] of Object.entries(SITE_ICON_BY_SITE_KEY)) {
    if (iconPath === source) {
      return `https://${siteKey}`;
    }
  }
  return "";
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
  return !nearWhiteBrandColor(hex);
}

function refreshAdaptiveSiteIcons() {
  document.querySelectorAll('img[data-icon-tile="brand"][data-icon-source]').forEach((icon) => {
    const source = icon.dataset.iconSource || "";
    if (source) {
      icon.src = source;
      const displayIcon = displayIconSource(icon, source, { awaitDisplayIcon: true });
      if (displayIcon instanceof Promise) {
        displayIcon.then((nextSource) => {
          if (icon.dataset.iconSource === source) {
            icon.src = nextSource;
          }
        });
      } else {
        icon.src = displayIcon;
      }
    }
  });
}

function whiteSvgIconSource(source) {
  if (whiteSvgIconDataUrlCache.has(source)) {
    return whiteSvgIconDataUrlCache.get(source);
  }
  const request = fetch(source)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Icon request failed: ${response.status}`);
      }
      return response.text();
    })
    .then((svg) => `data:image/svg+xml,${encodeURIComponent(normalizeSvgGlyphColor(svg))}`)
    .catch(() => source);
  whiteSvgIconDataUrlCache.set(source, request);
  return request;
}

function normalizeSvgGlyphColor(svg) {
  let output = String(svg || "");
  output = output.replace(/\sfill=(["'])(?!none\1)[^"']*\1/gi, ' fill="#ffffff"');
  output = output.replace(/\sstroke=(["'])(?!none\1)[^"']*\1/gi, ' stroke="#ffffff"');
  output = output.replace(/<svg\b([^>]*)>/i, (match, attrs) => (
    /\sfill=/i.test(attrs) ? `<svg${attrs}>` : `<svg${attrs} fill="#ffffff">`
  ));
  return output;
}

function bindFaviconFallback(icon, site, size) {
  icon.addEventListener("error", () => {
    applyFaviconIcon(icon, site, size, { skipLocalIcon: true });
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
  const isLocalIcon = nextIcon.startsWith("icons/");
  if (isLocalIcon) {
    icon.dataset.iconSource = nextIcon;
  } else {
    delete icon.dataset.iconSource;
  }
  if (!isLocalIcon) {
    const tileColors = genericIconTileColors(icon.dataset.siteUrl || icon.dataset.siteTitle || "");
    applyIconTile(icon, "plain", tileColors, false);
    icon.addEventListener("load", () => applyFaviconMatchedTile(icon), { once: true });
  }
  icon.src = displayIconSource(icon, nextIcon);
  icon.addEventListener("error", () => {
    applyIconCandidate(icon, candidates, index + 1);
  }, { once: true });
}

function applyFaviconMatchedTile(icon) {
  if (icon.dataset.iconTile !== "plain" || icon.dataset.iconCandidate?.startsWith("icons/")) {
    return;
  }
  const color = dominantImageColor(icon);
  if (!color) {
    return;
  }
  const tileColors = faviconMatchedTileColors(color);
  applyIconTile(icon, "plain", tileColors, false);
}

function dominantImageColor(image) {
  if (!image.naturalWidth || !image.naturalHeight) {
    return null;
  }
  const canvas = document.createElement("canvas");
  const size = 24;
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    return null;
  }
  try {
    context.drawImage(image, 0, 0, size, size);
    const { data } = context.getImageData(0, 0, size, size);
    let red = 0;
    let green = 0;
    let blue = 0;
    let weight = 0;
    for (let index = 0; index < data.length; index += 4) {
      const alpha = data[index + 3] / 255;
      if (alpha < 0.35) {
        continue;
      }
      const pixelRed = data[index];
      const pixelGreen = data[index + 1];
      const pixelBlue = data[index + 2];
      const saturation = colorSaturation(pixelRed, pixelGreen, pixelBlue);
      const pixelWeight = alpha * (0.35 + saturation);
      red += pixelRed * pixelWeight;
      green += pixelGreen * pixelWeight;
      blue += pixelBlue * pixelWeight;
      weight += pixelWeight;
    }
    if (!weight) {
      return null;
    }
    return {
      red: Math.round(red / weight),
      green: Math.round(green / weight),
      blue: Math.round(blue / weight)
    };
  } catch {
    return null;
  }
}

function colorSaturation(red, green, blue) {
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  return max ? (max - min) / max : 0;
}

function faviconMatchedTileColors(color) {
  const hue = rgbHue(color.red, color.green, color.blue);
  const saturation = Math.max(24, Math.round(colorSaturation(color.red, color.green, color.blue) * 54));
  return {
    light: `hsl(${hue} ${saturation}% 92%)`,
    dark: `hsl(${hue} ${Math.max(22, saturation - 12)}% 24%)`
  };
}

function rgbHue(red, green, blue) {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (!delta) {
    return 160;
  }
  let hue;
  if (max === r) {
    hue = ((g - b) / delta) % 6;
  } else if (max === g) {
    hue = (b - r) / delta + 2;
  } else {
    hue = (r - g) / delta + 4;
  }
  return Math.round((hue * 60 + 360) % 360);
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
    groupBookmarkSitesByInitial(sites).forEach((group) => {
      fragment.appendChild(createBookmarkInitialSection(group));
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

function createBookmarkInitialSection(group) {
  const section = document.createElement("section");
  const header = document.createElement("header");
  const title = document.createElement("h3");
  const divider = document.createElement("span");
  const grid = document.createElement("div");

  section.className = "bookmark-letter-section";
  section.dataset.initial = group.initial;
  header.className = "bookmark-letter-header";
  title.className = "bookmark-letter-title";
  title.textContent = group.initial;
  divider.className = "bookmark-letter-line";
  divider.setAttribute("aria-hidden", "true");
  grid.className = "bookmark-letter-grid";
  group.items.forEach((site) => {
    grid.appendChild(createBookmarkSiteCard(site));
  });
  header.append(title, divider);
  section.append(header, grid);
  return section;
}

function createBookmarkSiteCard(site) {
  const node = createSiteCard(site);
  const deleteButton = document.createElement("button");

  node.classList.add("bookmark-site-card");
  deleteButton.className = "bookmark-delete-button";
  deleteButton.type = "button";
  deleteButton.innerHTML = trashIcon();
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
  moreButton.title = t("mediaFeedMore");
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
      maxPagesPerSite: MAX_HISTORY_PAGES_PER_SITE + 1
    });
    renderRecentFolders(recentGroups);
    renderHistory(recentGroups);
  } catch (error) {
    pinnedGrid.innerHTML = "";
    historyGrid.innerHTML = emptyState(t("historyReadFailed"));
    recentHistoryFolders.innerHTML = emptyState(t("historyReadFailed"));
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
        lastAccessed: Math.max(Number(tab.lastAccessed || 0), Number(next[key].lastAccessed || 0), now),
        tabCount: next[key].tabCount + 1
      };
      continue;
    }
    const seen = previous[key] || {};
    const firstSeenAt = Number.isFinite(Number(seen.firstSeenAt)) ? Number(seen.firstSeenAt) : now;
    const lastAccessed = Math.max(Number(tab.lastAccessed || 0), Number(seen.lastAccessed || 0), now);
    next[key] = {
      url: url.href,
      title: normalizeText(tab.title) || normalizeText(seen.title),
      firstSeenAt,
      lastAccessed,
      tabCount: 1
    };
  }

  await setStoredValues({ [OPEN_TAB_ACTIVITY_STORAGE_KEY]: next });
  return Object.values(next)
    .filter((entry) => now - Number(entry.firstSeenAt || 0) >= RECENT_OPEN_TAB_MIN_OPEN_MS)
    .map((entry) => ({
      title: normalizeText(entry.title) || historyFallbackTitle(safeUrl(entry.url)),
      url: entry.url,
      lastVisitTime: Math.max(Number(entry.lastAccessed || 0), Number(entry.firstSeenAt || 0)),
      visitCount: Math.max(MIN_RECENT_DOMAIN_VISITS, Number(entry.tabCount || 0)),
      typedCount: 0,
      fromOpenTab: true
    }));
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

function renderRecentFolders(groups) {
  if (!groups.length) {
    recentHistoryFolders.innerHTML = emptyState(t("noHistoryItems"));
    pendingRecentPreviousKeys = null;
    return;
  }

  const previousKeys = pendingRecentPreviousKeys;
  pendingRecentPreviousKeys = null;
  const fragment = document.createDocumentFragment();
  groups.slice(0, MAX_RECENT_FOLDER_ITEMS).forEach((group) => {
    const card = createRecentFolderItem(group);
    fragment.appendChild(card);
  });
  recentHistoryFolders.replaceChildren(fragment);
  if (previousKeys) {
    const nextKeys = recentFolderVisibleKeys();
    animateRecentFolderEntries(new Set([...nextKeys].filter((key) => !previousKeys.has(key))));
  }
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

function recentFolderVisibleKeys(excludedKey = "") {
  return new Set(
    [...recentHistoryFolders.querySelectorAll(".recent-folder-item")]
      .map((node) => node.dataset.siteKey)
      .filter((key) => key && key !== excludedKey)
  );
}

function animateRecentFolderEntries(enterKeys) {
  if (!enterKeys.size) {
    return;
  }

  const cards = [...recentHistoryFolders.querySelectorAll(".recent-folder-item")];
  for (const card of cards) {
    const key = card.dataset.siteKey || "";
    if (!key || !enterKeys.has(key) || !card.animate) {
      continue;
    }

    card.style.willChange = "opacity, transform";
    const animation = card.animate(
      [
        { opacity: 0, transform: "translate3d(6px, 0, 0) scale(0.995)" },
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

function createRecentFolderItem(group) {
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
  const bottomBar = document.createElement("span");
  const hasPageDrawer = pages.length > 1;

  card.className = "recent-folder-item recent-card";
  card.classList.toggle("has-page-drawer", hasPageDrawer);
  card.dataset.pageIndex = "0";
  card.dataset.siteKey = group.key || "";
  inner.className = "recent-card-inner";
  face.className = "recent-folder-face";
  face.href = item?.url || group.url;
  face.title = t("openPage", { title });
  face.setAttribute("aria-label", t("openPage", { title }));
  icon.className = "recent-folder-logo";
  applyHistoryIcon(icon, {
    title,
    url: group.homeUrl || group.url
  });
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
  deleteButton.title = t("deleteHistory", { title });
  deleteButton.setAttribute("aria-label", t("deleteHistory", { title }));
  controls.className = "recent-card-controls";
  previousButton.className = "recent-card-arrow previous";
  previousButton.type = "button";
  previousButton.innerHTML = chevronLeftIcon();
  previousButton.title = t("historyPreviousPage");
  previousButton.setAttribute("aria-label", t("historyPreviousPage"));
  nextButton.className = "recent-card-arrow next";
  nextButton.type = "button";
  nextButton.innerHTML = chevronRightIcon();
  nextButton.title = t("historyNextPage");
  nextButton.setAttribute("aria-label", t("historyNextPage"));
  bottomBar.className = "recent-card-bottom-bar";
  bottomBar.setAttribute("aria-hidden", "true");

  let activePageAnimation = null;

  const animatePageTurn = (direction) => {
    if (!direction || pages.length < 2) {
      return;
    }

    if (activePageAnimation) {
      if (typeof activePageAnimation.kill === "function") {
        activePageAnimation.kill();
      } else {
        activePageAnimation.cancel();
      }
      activePageAnimation = null;
    }
    inner.querySelectorAll(".recent-folder-face-snapshot").forEach((node) => node.remove());

    const snapshot = face.cloneNode(true);
    snapshot.removeAttribute("href");
    snapshot.removeAttribute("title");
    snapshot.removeAttribute("aria-label");
    snapshot.classList.add("recent-folder-face-snapshot");
    snapshot.setAttribute("aria-hidden", "true");
    inner.append(snapshot);

    const vector = direction === "next" ? 1 : -1;
    const easing = "cubic-bezier(0.22, 1, 0.36, 1)";
    const duration = 520;
    const gsap = getGsap();
    if (gsap) {
      const cleanUp = () => {
        snapshot.remove();
        gsap.set(face, { clearProps: "opacity,visibility,transform" });
        if (activePageAnimation === timeline) {
          activePageAnimation = null;
        }
      };
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: cleanUp
      });
      timeline
        .fromTo(face,
          { autoAlpha: 0.18, x: vector * 54, scale: 0.995 },
          { autoAlpha: 1, x: 0, scale: 1, duration: gsapDuration(duration) },
          0)
        .fromTo(snapshot,
          { autoAlpha: 1, x: 0, scale: 1 },
          { autoAlpha: 0, x: -vector * 46, scale: 0.995, duration: gsapDuration(440) },
          0);
      activePageAnimation = timeline;
      return;
    }
    const incoming = face.animate(
      [
        {
          opacity: 0.18,
          transform: `translateX(${vector * 54}px) scale(0.995)`,
          filter: "blur(0.4px)"
        },
        {
          opacity: 1,
          transform: "translateX(0) scale(1)",
          filter: "blur(0)"
        }
      ],
      { duration, easing, fill: "both" }
    );
    const outgoing = snapshot.animate(
      [
        {
          opacity: 1,
          transform: "translateX(0) scale(1)",
          filter: "blur(0)"
        },
        {
          opacity: 0,
          transform: `translateX(${-vector * 46}px) scale(0.995)`,
          filter: "blur(0.4px)"
        }
      ],
      { duration: 440, easing, fill: "both" }
    );

    const cleanUp = () => {
      incoming.cancel();
      outgoing.cancel();
      snapshot.remove();
      if (activePageAnimation === incoming) {
        activePageAnimation = null;
      }
    };
    activePageAnimation = incoming;
    incoming.addEventListener("finish", cleanUp, { once: true });
    window.setTimeout(cleanUp, duration + 80);
  };

  const setActivePage = (nextIndex, direction = "") => {
    const pageCount = pages.length || 1;
    const index = ((nextIndex % pageCount) + pageCount) % pageCount;
    const activePage = pages[index] || item;
    const activeTitle = normalizeText(activePage?.title) || historyFallbackTitle(safeUrl(activePage?.url || group.url));
    card.dataset.pageIndex = String(index);
    face.href = activePage?.url || group.url;
    face.title = t("openPage", { title: activeTitle });
    face.setAttribute("aria-label", t("openPage", { title: activeTitle }));
    pageTitle.textContent = activeTitle;
    previousButton.disabled = pageCount < 2;
    nextButton.disabled = pageCount < 2;
    animatePageTurn(direction);
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

  copy.append(name, pageTitle, domain);
  face.append(icon, copy);
  controls.append(previousButton, nextButton);
  inner.append(face, deleteButton);
  bottomBar.append(controls);
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
    homeLink.title = homeLabel;
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
    time.title = formatHistoryFullTime(item.lastVisitTime);
  }
  link.className = "history-page-link";
  link.href = item.url;
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

function inlineIcon(markup) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${markup.trim()}</svg>`;
}

function searchEngineSearchIcon() {
  return inlineIcon(`
    <circle cx="10.75" cy="10.75" r="5.25"></circle>
    <path d="m14.75 14.75 4.5 4.5"></path>
  `);
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

function historyIcon() {
  return inlineIcon(`
    <path d="M3 12a9 9 0 1 0 3-6.7"></path>
    <path d="M3 4v5h5"></path>
    <path d="M12 7v5l3 2"></path>
  `);
}

function folderPlusIcon() {
  return inlineIcon(`
    <path d="M12 10v6"></path>
    <path d="M9 13h6"></path>
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
  `);
}

function arrowLeftIcon() {
  return inlineIcon(`
    <path d="m12 19-7-7 7-7"></path>
    <path d="M19 12H5"></path>
  `);
}

function chevronLeftIcon() {
  return inlineIcon(`
    <path d="M15 7 10 12l5 5"></path>
  `);
}

function chevronRightIcon() {
  return inlineIcon(`
    <path d="m9 7 5 5-5 5"></path>
  `);
}

function newspaperIcon() {
  return inlineIcon(`
    <path d="M4 6.5h16"></path>
    <path d="M4 12h11"></path>
    <path d="M4 17.5h8"></path>
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

function chevronUpIcon() {
  return inlineIcon(`
    <path d="m7 14.5 5-5 5 5"></path>
  `);
}

function moreHorizontalIcon() {
  return inlineIcon(`
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="19" cy="12" r="1"></circle>
    <circle cx="5" cy="12" r="1"></circle>
  `);
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
