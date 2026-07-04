import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");
const start = source.indexOf("function groupHistoryBySite(");
const end = source.indexOf("function formatHistoryFullTime(", start);
assert.ok(start >= 0 && end > start, "Recent history grouping functions should be extractable.");
assert.equal(source.includes("pinnedHistory"), false, "Recent browsing must not keep the removed pinned-history storage path.");
const testSource = `${source.slice(start, end)}
globalThis.groupHistoryBySite = groupHistoryBySite;`;

const sandbox = {
  URL,
  MAX_HISTORY_SITE_GROUPS: 9,
  MAX_HISTORY_PAGES_PER_SITE: 4,
  safeUrl(value) {
    try {
      return new URL(value);
    } catch {
      return null;
    }
  },
  siteGroupKey(url) {
    return url?.hostname || "";
  },
  siteDisplayName(url) {
    return url?.hostname || "";
  },
  siteHomeUrl(key) {
    return `https://${key}/`;
  },
  normalizeHistoryDeleteUrl(url) {
    return url;
  },
  historyPageKey(item) {
    return item.url;
  }
};
vm.runInNewContext(testSource, sandbox);

const groups = sandbox.groupHistoryBySite([
  { title: "Old story - Alpha", url: "https://alpha.test/old", lastVisitTime: 10 },
  { title: "Old story - Beta", url: "https://beta.test/old", lastVisitTime: 20 },
  { title: "New story - Alpha", url: "https://alpha.test/new", lastVisitTime: 100 }
]);

assert.deepEqual(
  Array.from(groups, (group) => group.key),
  ["alpha.test", "beta.test"],
  "Recent groups should render newest site first even when input starts with an older page."
);
assert.deepEqual(
  Array.from(groups[0].pages, (page) => page.title),
  ["New story - Alpha", "Old story - Alpha"],
  "Same-site pages should render newest page first."
);

const manyGroups = sandbox.groupHistoryBySite([
  { title: "Old A - Alpha", url: "https://alpha.test/a", lastVisitTime: 10 },
  { title: "Old B - Beta", url: "https://beta.test/b", lastVisitTime: 20 },
  { title: "Old C - Gamma", url: "https://gamma.test/c", lastVisitTime: 30 },
  { title: "Old D - Delta", url: "https://delta.test/d", lastVisitTime: 40 },
  { title: "New E - Epsilon", url: "https://epsilon.test/e", lastVisitTime: 100 },
  { title: "New F - Zeta", url: "https://zeta.test/f", lastVisitTime: 110 }
]);

assert.deepEqual(
  Array.from(manyGroups.slice(0, 4), (group) => group.key),
  ["zeta.test", "epsilon.test", "delta.test", "gamma.test"],
  "The first recent-card page should contain the newest groups, not older groups that arrived first."
);

const screenshotLikeGroups = sandbox.groupHistoryBySite([
  { title: "即梦AI - 一站式AI创作平台", url: "https://jimeng.jianying.com/ai-tool", lastVisitTime: 944 },
  { title: "Xiaomi MiMo Home", url: "https://platform.xiaomimimo.com/home", lastVisitTime: 944 },
  { title: "je44/wayleaf: Chrome new tab extension", url: "https://github.com/je44/wayleaf", lastVisitTime: 944 },
  { title: "用户注册", url: "https://ooofuuu.sdxuuuuuusdx.shop/index/index/reg.html", lastVisitTime: 944 },
  { title: "开发文档 - Example API", url: "https://docs.example.test/api", lastVisitTime: 1030 },
  { title: "账单概览 - Example Billing", url: "https://billing.example.test/overview", lastVisitTime: 1020 },
  { title: "112 - Google 搜索", url: "https://google.com.hk/search?q=112", lastVisitTime: 1020 },
  { title: "账户创建已被阻止", url: "https://signup.live.com/signup", lastVisitTime: 1018 }
]);

assert.deepEqual(
  Array.from(screenshotLikeGroups.slice(0, 4), (group) => group.key),
  ["docs.example.test", "billing.example.test", "google.com.hk", "signup.live.com"],
  "Screenshot-like recent cards should put the 10:30/10:20 history groups before the older 9:44 groups."
);

const frequentGroups = sandbox.groupHistoryBySite([
  { title: "New Low", url: "https://low.test/latest", lastVisitTime: 500, visitCount: 2 },
  { title: "Old High A", url: "https://high.test/a", lastVisitTime: 120, visitCount: 4 },
  { title: "Old High B", url: "https://high.test/b", lastVisitTime: 100, visitCount: 3 },
  { title: "Middle", url: "https://middle.test/home", lastVisitTime: 300, visitCount: 5 }
]);

assert.deepEqual(
  Array.from(frequentGroups, (group) => group.key),
  ["high.test", "middle.test", "low.test"],
  "Most-visited cards should rank sites by total visit count before recency."
);
assert.deepEqual(
  Array.from(frequentGroups[0].pages, (page) => page.title),
  ["Old High A", "Old High B"],
  "Same-site pages should rank by visit count before recency."
);
