import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const newtabSource = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");
const iconSource = readFileSync(new URL("../wayleaf-icon.js", import.meta.url), "utf8");
const source = `${iconSource}\n${newtabSource}`;
const styles = readFileSync(new URL("../newtab.css", import.meta.url), "utf8");
const html = readFileSync(new URL("../newtab.html", import.meta.url), "utf8");
const background = readFileSync(new URL("../background.js", import.meta.url), "utf8");

assert.match(source, /const MAX_HISTORY_PAGES_PER_SITE = 4;/, "Same-site recent cards must keep a strict four-page cap.");
assert.match(source, /const RECENT_FOLDER_PAGE_SWITCH_MS = 330;/, "Recent card body switches should be soft but not slow.");
assert.match(source, /const RECENT_FOLDER_PAGE_SWITCH_EXIT_MS = 240;/, "Recent card body exit should clear before the incoming group feels sluggish.");
assert.match(source, /const RECENT_FOLDER_PAGE_SWITCH_STAGGER_MS = 28;/, "Recent card body switches should stagger cards as one cohesive entrance.");
assert.doesNotMatch(source, /maxPagesPerSite:\s*MAX_HISTORY_PAGES_PER_SITE\s*\+\s*1/, "Recent card grouping must not request more than four same-site pages.");
assert.match(source, /maxPagesPerSite:\s*MAX_HISTORY_PAGES_PER_SITE/, "Recent refresh should pass the strict same-site page cap into grouping.");
assert.match(background, /onInstalled\?\.addListener\(\(details\) => \{[\s\S]*details\.reason === "install"[\s\S]*RECENT_HISTORY_STARTED_AT_STORAGE_KEY[\s\S]*Date\.now\(\)/, "A fresh install must record when Wayleaf may begin showing recent history.");
assert.match(source, /const frequentStartTime = Number\.isFinite\(recentHistoryStartedAt\) && recentHistoryStartedAt > 0[\s\S]*MOST_VISITED_HISTORY_FALLBACK_LOOKBACK_MS/, "Most-visited history must keep the install-time gate and only fall back to a bounded local window when the marker is missing.");
assert.match(source, /maxResults:\s*MOST_VISITED_HISTORY_MAX_RESULTS[\s\S]*const mostVisitedItems = await mostVisitedHistoryItems\(items, frequentStartTime\)/, "Most-visited cards must source from the frequent-history ranking path, not the old recent-history feed.");
assert.match(html, /<section class="recent-folders"[^>]*hidden>/, "The recent-browsing module must start hidden to avoid a first-install flash.");
assert.doesNotMatch(html, /id="historyPanel"/, "The unreachable legacy recent-browsing panel must stay removed.");
assert.doesNotMatch(source, /pinnedHistory|history-page-pin|pinHistoryItem|unpinHistoryItem/, "Recent browsing cards must not expose the removed pinning path.");
assert.match(styles, /\.recent-folders\[hidden\]\s*\{\s*display:\s*none;/, "The recent-browsing layout must respect its hidden state.");
assert.match(source, /recentHistoryFolders\.closest\("\.recent-folders"\)\.hidden = !latestRecentFolderGroups\.length;/, "The whole recent-browsing module must only be visible when it has real groups.");
assert.match(source, /const homeUrl = group\.homeUrl \|\| siteHomeUrl\(group\.key, group\.url\);[\s\S]*const pages = \[[\s\S]*url: homeUrl[\s\S]*group\.pages\.filter[\s\S]*\.slice\(0, MAX_HISTORY_PAGES_PER_SITE\);/, "Every recent card must keep its site home as page one while preserving the strict four-page cap.");
assert.match(source, /setActivePage\(0\);\s*return card;/, "Recent cards must open on their site-home page by default.");
assert.match(html, /class="recent-folder-switch-controls"[\s\S]*id="recentFoldersPreviousButton"[\s\S]*id="recentFoldersNextButton"/, "Recent browsing header needs previous/next buttons to switch the whole card body.");
assert.match(source, /const recentFoldersPreviousButton = document\.querySelector\("#recentFoldersPreviousButton"\);/, "Recent card body switch previous button must be wired.");
assert.match(source, /const recentFoldersNextButton = document\.querySelector\("#recentFoldersNextButton"\);/, "Recent card body switch next button must be wired.");
assert.match(source, /let latestRecentFolderGroups = \[\];\s*let recentFolderPageIndex = 0;\s*let activeRecentFolderPageSwitchAnimation = null;/, "Recent card body switching needs section-level group, page, and active animation state.");
assert.match(source, /const startIndex = recentFolderPageIndex \* MAX_RECENT_FOLDER_ITEMS;\s*const fragment = document\.createDocumentFragment\(\);[\s\S]*latestRecentFolderGroups\.slice\(startIndex, startIndex \+ MAX_RECENT_FOLDER_ITEMS\)/, "Recent folder rendering must page whole card groups instead of only slicing the first group forever.");
assert.match(source, /const hasMultiplePages = latestRecentFolderGroups\.length > MAX_RECENT_FOLDER_ITEMS && pageCount > 1;\s*const previousDisabled = !hasMultiplePages \|\| recentFolderPageIndex <= 0;\s*const nextDisabled = !hasMultiplePages \|\| recentFolderPageIndex >= pageCount - 1;/, "Recent card body controls must expose a real beginning and end instead of one shared looping state.");
assert.match(source, /\[\s*\[recentFoldersPreviousButton, previousDisabled\],\s*\[recentFoldersNextButton, nextDisabled\]\s*\]\.forEach\(\(\[button, isDisabled\]\) => \{[\s\S]*button\.disabled = isDisabled;[\s\S]*button\.setAttribute\("aria-disabled", String\(isDisabled\)\);/, "Recent card body previous and next buttons must be disabled independently at page boundaries.");
assert.match(source, /function showRecentFolderPage\(nextPageIndex, direction = ""\) \{[\s\S]*const targetPageIndex = Math\.min\(Math\.max\(0, Number\(nextPageIndex\)\), pageCount - 1\);[\s\S]*if \(targetPageIndex === recentFolderPageIndex\) \{[\s\S]*updateRecentFolderSwitchControls\(\);[\s\S]*return;[\s\S]*\}[\s\S]*const previousKeys = recentFolderVisibleKeys\(\);[\s\S]*recentFolderPageIndex = targetPageIndex;[\s\S]*renderRecentFolders\(latestRecentFolderGroups, \{ previousKeys, direction \}\);[\s\S]*\}/, "Header previous/next controls must clamp at the first and last recent card page instead of wrapping.");
assert.doesNotMatch(source, /recentFolderPageIndex = \(\(nextPageIndex % pageCount\) \+ pageCount\) % pageCount;/, "Recent card body switching must not loop around from the end back to the start.");
assert.match(source, /recentFoldersPreviousButton\?\.addEventListener\("click", \(event\) => \{[\s\S]*showRecentFolderPage\(recentFolderPageIndex - 1, "previous"\);/, "Previous header button must navigate to the previous recent card body.");
assert.match(source, /recentFoldersNextButton\?\.addEventListener\("click", \(event\) => \{[\s\S]*showRecentFolderPage\(recentFolderPageIndex \+ 1, "next"\);/, "Next header button must navigate to the next recent card body.");
assert.match(source, /const outgoingLayer = captureRecentFolderPageSwitchSnapshot\(previousKeys, direction\);[\s\S]*recentHistoryFolders\.replaceChildren\(fragment\);[\s\S]*recentHistoryFolders\.append\(outgoingLayer\);[\s\S]*animateRecentFolderPageSwitch\(outgoingLayer, nextKeys, previousKeys, direction\);/, "Recent card body switches must keep an outgoing snapshot layer while the new group enters.");
assert.match(source, /function clearRecentFolderPageSwitchAnimation\(\) \{[\s\S]*activeRecentFolderPageSwitchAnimation\.cancel\(\);[\s\S]*activeRecentFolderPageSwitchAnimation = null;[\s\S]*recentHistoryFolders\.querySelectorAll\("\.recent-folder-switch-layer"\)[\s\S]*recentHistoryFolders\.querySelectorAll\(":scope > \.recent-folder-item"\)/, "Recent card body switches must cancel prior animations, clean layers, and only reset live grid cards.");
assert.match(source, /function captureRecentFolderPageSwitchSnapshot\(previousKeys, direction = ""\) \{[\s\S]*prefersReducedMotion\(\)[\s\S]*layer\.className = "recent-folder-switch-layer";[\s\S]*snapshot\.classList\.add\("recent-folder-switch-snapshot"\);[\s\S]*snapshot\.querySelectorAll\("a, button"\)/, "Recent card body switches must capture inert outgoing card snapshots and skip complex motion for reduced-motion users.");
assert.doesNotMatch(source, /snapshot\.style\.gridColumn/, "Outgoing recent card snapshots must rely on the responsive grid instead of fixed desktop column positions.");
assert.match(source, /function animateRecentFolderPageSwitch\(outgoingLayer, nextKeys, previousKeys, direction = ""\) \{[\s\S]*const vector = direction === "previous" \? -1 : 1;[\s\S]*const incomingOffset = 54;[\s\S]*const outgoingOffset = 62;[\s\S]*getGsap\(\)/, "Recent card body switches must derive direction-aware whole-card offsets.");
assert.match(source, /gsap\.set\(enterCards,[\s\S]*x: vector \* incomingOffset[\s\S]*timeline\.to\(enterCards,[\s\S]*duration: gsapDuration\(RECENT_FOLDER_PAGE_SWITCH_MS\)/, "Recent card body switches must use GSAP for smooth incoming card motion when available.");
assert.match(source, /timeline\.to\(outgoingCards,[\s\S]*x: -vector \* outgoingOffset[\s\S]*duration: gsapDuration\(RECENT_FOLDER_PAGE_SWITCH_EXIT_MS\)/, "Recent card body switches must use GSAP for outgoing card snapshots when available.");
assert.match(source, /const animationHandle = \{[\s\S]*activeRecentFolderPageSwitchAnimation = animationHandle;[\s\S]*animationHandle\.cancel = \(\) => \{[\s\S]*timeline\.kill\(\);[\s\S]*cleanUp\(\);/, "Recent card body switches must be cancelable during fast repeated clicks.");
assert.match(source, /outgoingCards\.forEach\(\(card, index\) => \{[\s\S]*card\.animate\(\[[\s\S]*translate3d\(\$\{-vector \* outgoingOffset\}px/, "Recent card body switches must keep a directional WAAPI fallback for outgoing snapshots.");
assert.match(source, /enterCards\.forEach\(\(card, index\) => \{[\s\S]*card\.animate\(\[[\s\S]*translate3d\(\$\{vector \* incomingOffset\}px/, "Recent card body switches must keep a directional WAAPI fallback for incoming cards.");
assert.match(source, /pageIndicator\.className = "recent-card-page-indicator";/, "Recent card drawer needs a page indicator container.");
assert.doesNotMatch(source, /bottomBar\.setAttribute\("aria-hidden",\s*"true"\)/, "Recent card drawer controls must not live inside an aria-hidden container.");
assert.match(source, /pages\.forEach\(\(_, pageIndex\) => \{[\s\S]*dot\.className = "recent-card-page-dot";[\s\S]*pageIndicator\.append\(dot\);[\s\S]*\}\);/, "Recent card drawer must render one indicator dot per same-site page.");
assert.match(source, /pageIndicator\.querySelectorAll\("\.recent-card-page-dot"\)\.forEach\(\(dot, dotIndex\) => \{[\s\S]*dot\.classList\.toggle\("active", dotIndex === index\);[\s\S]*\}\);/, "Recent card switching must update the active page indicator.");
assert.match(source, /bottomBar\.append\(pageIndicator,\s*controls\);/, "Recent card drawer should place indicators before the existing right-side controls.");
assert.match(source, /const capturePageTurnSnapshot = \(direction\) => \{[\s\S]*prefersReducedMotion\(\)[\s\S]*const snapshot = pageTitle\.cloneNode\(true\);[\s\S]*face\.append\(snapshot\);[\s\S]*return snapshot;/, "Recent card page turns must capture the outgoing page title before content changes and skip complex motion for reduced-motion users.");
assert.match(source, /const pageTurnSnapshot = capturePageTurnSnapshot\(direction\);\s*card\.dataset\.pageIndex = String\(index\);[\s\S]*face\.href = activePage\?\.url \|\| group\.url;[\s\S]*animatePageTurn\(direction, pageTurnSnapshot\);/, "Recent card switching must update content only after capturing the outgoing page snapshot.");
assert.match(source, /pageTitle\.textContent = index === 0 \? "" : activeTitle;/, "Recent cards must hide the site-home domain title on their default first page.");
assert.match(source, /snapshot\.style\.transition = "none";\s*pageTitle\.style\.transition = "none";/, "Recent card page turns must temporarily disable CSS transform transitions while JS owns the title animation.");
assert.match(source, /const vector = direction === "next" \? 1 : -1;\s*const incomingOffset = 34;\s*const outgoingOffset = 38;\s*const pageTurnDuration = 300;[\s\S]*x: vector \* incomingOffset[\s\S]*x: -vector \* outgoingOffset[\s\S]*translate3d\(\$\{vector \* incomingOffset\}px[\s\S]*translate3d\(\$\{-vector \* outgoingOffset\}px/, "Recent card page turns must use short directional title offsets for a natural transition.");

assert.match(styles, /\.recent-card-page-indicator\s*\{[\s\S]*display:\s*flex;[\s\S]*align-items:\s*center;[\s\S]*min-height:\s*28px;/, "Indicator rail should horizontally align with the right-side switch buttons.");
assert.match(styles, /\.recent-folder-switch-controls\s*\{[\s\S]*display:\s*flex;[\s\S]*align-items:\s*center;/, "Recent browsing header switch controls should sit to the right of the title.");
assert.match(styles, /\.recent-folder-switch-button\s*\{[\s\S]*width:\s*28px;[\s\S]*height:\s*28px;/, "Recent browsing header switch buttons need stable icon-button dimensions.");
assert.match(styles, /\.recent-folder-grid\s*\{[\s\S]*position:\s*relative;[\s\S]*overflow-x:\s*clip;[\s\S]*contain:\s*layout style;/, "Recent card body switch motion should stay clipped to the carousel rail and limit layout work.");
assert.match(styles, /\.recent-folder-switch-layer\s*\{[\s\S]*position:\s*absolute;[\s\S]*grid-template-columns:\s*repeat\(4,\s*minmax\(232px,\s*1fr\)\);[\s\S]*pointer-events:\s*none;[\s\S]*contain:\s*layout paint style;/, "Outgoing recent card snapshots must overlay the same desktop grid without taking events or triggering page layout.");
assert.match(styles, /\.recent-folder-switch-snapshot\s*\{[\s\S]*pointer-events:\s*none;[\s\S]*will-change:\s*opacity,\s*transform;/, "Outgoing recent card snapshots should be compositor-friendly.");
assert.match(styles, /@media \(max-width: 900px\)[\s\S]*\.recent-folder-switch-layer\s*\{[\s\S]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/, "Outgoing recent card snapshots must match the mobile two-column card rail.");
assert.match(styles, /\.recent-card-page-dot\s*\{[\s\S]*background:\s*color-mix\(in srgb, var\(--muted\) 58%, transparent\);/, "Inactive indicators should use the existing muted gray tone.");
assert.match(styles, /\.recent-card-page-dot\.active\s*\{[\s\S]*background:\s*#f2c94c;/, "The active indicator must be yellow.");
assert.match(styles, /\.recent-card-bottom-bar\s*\{[\s\S]*align-items:\s*center;[\s\S]*justify-content:\s*space-between;/, "Drawer content should align indicators and switch controls on one horizontal row.");
assert.match(styles, /\.recent-folder-page-title-snapshot\s*\{[\s\S]*z-index:\s*3;[\s\S]*pointer-events:\s*none;/, "Outgoing recent page title snapshots need their own layer above the incoming title.");
assert.match(styles, /\.recent-folder-logo\.site-icon-generic-fallback,[\s\S]*padding:\s*0;[\s\S]*object-fit:\s*cover;/, "Recent generic fallback icons must render the complete fallback SVG without an extra padded tile.");
const adaptiveIconRefresh = source.match(/function refreshAdaptiveSiteIcons\(\) \{[\s\S]*?\n\}/)?.[0] || "";
assert.match(
  adaptiveIconRefresh,
  /img\[data-icon-tile="brand"\]\[data-site-url\][\s\S]*if \(!source\)[\s\S]*applySiteIcon\(icon, site\);/,
  "Theme switching must recover and refresh cached recent icons that predate source metadata."
);

// --- Recent browsing <-> Today history toggle ---------------------------------------------------
assert.match(html, /<button class="recent-view-toggle" id="recentViewToggleButton"[^>]*aria-controls="recentHistoryFolders"/, "The recent-browsing header must expose the today-history toggle button.");
assert.match(source, /const recentViewToggleButton = document\.querySelector\("#recentViewToggleButton"\);/, "The today-history toggle button must be wired.");
assert.match(source, /const RECENT_VIEW_MODE_STORAGE_KEY = "recentViewMode";/, "The chosen recent view must persist across sessions.");
assert.match(source, /const MAX_TODAY_HISTORY_ITEMS_PER_PAGE = 12;/, "Today history must page in bounded rows.");
assert.match(source, /let recentViewMode = "recent";[\s\S]*let latestTodayHistoryItems = \[\];[\s\S]*let todayHistoryPageIndex = 0;[\s\S]*let todayHistoryHydrated = false;/, "Today-history view needs its own mode, item, page, and hydration state.");
assert.match(source, /recentViewToggleButton\?\.addEventListener\("click", \(event\) => \{[\s\S]*setRecentViewMode\(recentViewMode === "today" \? "recent" : "today"\)/, "The toggle button must flip between recent browsing and today history.");

// The toggle only adds a surface; it must reuse the SAME icon pipeline as recent cards (cache hit ->
// restore captured render, cache miss -> the original applySiteIcon). No bespoke icon path.
assert.match(source, /function renderHistorySiteIcon\(icon, site, options = \{\}\) \{\s*renderSharedSiteIcon\(icon, site, options\);\s*WayleafIcon\.cacheRenderedSiteIconOnLoad\(icon, site\);\s*\}/, "History icons (recent + today) must go through the shared render + first-paint cache path, not a new algorithm.");
assert.match(iconSource, /function restoreFirstPaintIconRender\(icon, site, render\) \{[\s\S]*if \(render\.generic && \(localIcon \|\| normalizeStoredSiteIcon\(site\.icon \|\| ""\)\)\) \{[\s\S]*applySiteIcon\(icon, site\);[\s\S]*setIconRouteState\(icon, "fallback"\);/, "Generic fallback cache should replay only when no current local or stored site icon can supersede it.");
assert.match(source, /function renderFirstPaintCache\(\) \{[\s\S]*const favoriteIconMap = favoriteSiteIconMap\(favoriteSites\);[\s\S]*renderRecentFolders\(recentGroups, \{ iconRenders: cache\.iconRenders, favoriteIconMap \}\);/, "First-paint recent cards must reuse cached favorite site icons instead of forcing favicon loading.");
assert.match(source, /async function refreshHistory\(\) \{[\s\S]*const favoriteIconMap = favoriteSiteIconMap\(favoriteSites\);[\s\S]*renderRecentSurface\(recentGroups, \{ favoriteIconMap \}\);/, "Live recent cards must pass stored favorite icons into the shared history icon path.");
assert.match(source, /function historyItemIcon\(item\) \{[\s\S]*normalizeStoredSiteIcon\(item\?\.icon \|\| item\?\.favIconUrl \|\| ""\)/, "History item data icons must stay available to the secondary direct-display route.");
assert.match(source, /function createRecentFolderItem\(group, options = \{\}\) \{[\s\S]*const iconSite = \{\s*title,\s*url: group\.homeUrl \|\| group\.url,\s*icon: historyItemIcon\(group\)\s*\};[\s\S]*renderHistorySiteIcon\(icon, iconSite, options\);/, "Recent cards must pass any existing site-provided icon instead of rebuilding the favicon route.");
assert.match(source, /function createTodayHistoryItem\(item, options = \{\}\) \{[\s\S]*const iconSite = \{ title: item\.title, url: item\.url, icon: historyItemIcon\(item\) \};[\s\S]*renderHistorySiteIcon\(icon, iconSite, options\);/, "Today-history rows must pass any existing site-provided icon instead of rebuilding the favicon route.");
assert.match(source, /function createTodayHistoryItem\(item, options = \{\}\) \{[\s\S]*renderHistorySiteIcon\(icon, iconSite, options\);/, "Today-history rows must render their icon through the shared history icon path.");
assert.match(source, /function renderTodayHistory\(options = \{\}\) \{[\s\S]*todayHistoryPageCount\(\)[\s\S]*createTodayHistoryItem\(item, \{ \.\.\.options, iconRenders, favoriteIconMap \}\)/, "Today history must render bounded, paged rows with the shared icon render context.");
assert.match(source, /function renderRecentSurface\(groups, options = \{\}\) \{[\s\S]*if \(recentViewMode === "today"\) \{[\s\S]*renderTodayHistory\(options\);[\s\S]*renderRecentFolders\(latestRecentFolderGroups, options\)/, "The refresh entry point must route to whichever surface is active.");
assert.match(source, /const siteIconIndexReady = WayleafIcon\.initSiteIconIndex\(\);[\s\S]*const themeModeReady = initThemeMode\(\);[\s\S]*Promise\.all\(\[siteIconIndexReady, themeModeReady\]\)\.then\(\(\) => \{[\s\S]*WayleafIcon\.refreshRenderedSiteIcons\(\);[\s\S]*\}\)\.catch\(\(\) => \{\}\);/, "Recent/history first-paint icons must be refreshed after the real theme is applied, not only after the icon index loads.");

// Today history is sourced from today's real history, deduped and time-sorted; refresh must not block.
assert.match(source, /function todayHistoryItems\(items\) \{\s*return dedupeHistory\(items\)[\s\S]*compareHistoryItemsByRecentVisit\)/, "Today history must reuse the existing dedupe + recency ordering.");
assert.match(source, /function mostVisitedHistoryItems\(items, startTime\) \{[\s\S]*historyVisitsSince\(item\.url, startTime\)[\s\S]*MIN_MOST_VISITED_HISTORY_VISITS[\s\S]*compareHistoryItemsByFrequentVisit/, "Most-visited cards must count per-URL visits and sort by frequency before rendering.");
assert.match(source, /const todayHistoryReady = chrome\.history\.search\(\{[\s\S]*startTime: todayStartTime[\s\S]*latestTodayHistoryItems = todayHistoryItems\(todayItems\)/, "refreshHistory must load today's history alongside the recent groups.");

// Locale coverage for the new surface (checked on the primary shipping locales).
assert.match(source, /todayHistoryTitle: "今日历史记录"[\s\S]*recentViewToggleToToday: "切换到今日历史记录"/, "Simplified Chinese today-history strings must exist.");
assert.match(source, /todayHistoryTitle: "Today history"[\s\S]*recentViewToggleToToday: "Show today's history"/, "English today-history strings must exist.");

// Styling: today-history rows and toggle button must be styled.
assert.match(styles, /\.recent-view-toggle\s*\{[\s\S]*width:\s*28px;[\s\S]*height:\s*28px;/, "The today-history toggle needs a stable icon-button size.");
assert.match(styles, /\.recent-folders\[data-recent-view="today"\] \.recent-folder-grid\s*\{[\s\S]*grid-template-columns:\s*repeat\(4,/, "Today history must lay its rows out in the dedicated grid.");
assert.match(styles, /\.today-history-logo\s*\{[\s\S]*--site-icon-box-size:\s*24px;/, "Today-history logos must use the compact 24px icon box while sharing the recent-folder-logo tile pipeline.");

// Same-site favicon tiles must be consistent. Today history shows several pages of one site at
// once; each favicon sample is non-deterministic, so without a per-site memo the same site (e.g.
// CloudFox / Kedaya) would render different tile colours side by side. Resolve once per site+theme,
// reuse for every later same-site row.
assert.match(source, /const faviconSiteTileMemo = new Map\(\);/, "There must be a per-session per-site favicon tile memo so one site reads as one tile.");
assert.match(source, /function faviconSiteTileMemoKey\(icon\) \{[\s\S]*icon\.dataset\.siteKey \|\| siteGroupKey\(safeUrl\(icon\.dataset\.siteUrl\)\)[\s\S]*document\.documentElement\.dataset\.theme === "dark" \? "dark" : "light"/, "The favicon tile memo must key by site group + theme (the fused bitmap is theme-specific).");
assert.match(source, /function applyFaviconMatchedTile\(icon, options = \{\}\) \{[\s\S]*if \(restoreFaviconSiteTile\(icon\)\) \{[\s\S]*return;[\s\S]*\}[\s\S]*resolveFaviconTile\(icon, candidateToken, sampleOptions\);/, "applyFaviconMatchedTile must reuse the site's already-resolved tile, then hand off to the single deterministic resolver.");
// Determinism: the favicon must be DECODED before the canvas is read (a load event is not a decode),
// otherwise the same favicon samples to different pixels/tiles. And each site resolves at most once
// per session via an in-flight map, so parallel same-site rows never sample two competing bitmaps.
assert.match(source, /async function decodedFaviconSample\(icon\) \{[\s\S]*await icon\.decode\(\);[\s\S]*const sample = sampleFaviconImageData\(icon\);/, "decodedFaviconSample must decode the favicon before the (deterministic) canvas read.");
assert.match(source, /const faviconTileResolveInFlight = new Map\(\);/, "Tier-2 resolution must be de-duplicated per site so parallel same-site rows share one sample.");
assert.match(source, /function resolveFaviconTile\(icon, candidateToken, options = \{\}\) \{[\s\S]*faviconTileResolveInFlight\.get\(inFlightKey\)[\s\S]*decodedFaviconSample\(icon\)\.then\(\(sample\) => \{[\s\S]*applyFaviconSampleDecision\(icon, sample, options\)/, "resolveFaviconTile must await an in-flight same-site resolution, else decode+sample once and feed the unchanged colour decision.");
assert.match(source, /function applySampledFaviconTile\(icon, sample, color, tileColors, options = \{\}\) \{[\s\S]*fuseEmbeddedFaviconTile\(icon, sample, color, tileColors, options\);[\s\S]*rememberFaviconSiteTile\(icon, entry\);\s*broadcastFaviconSiteTile\(icon, entry\);/, "A freshly sampled favicon tile must be published to the per-site memo AND broadcast to same-site siblings already on screen.");
assert.match(source, /function broadcastFaviconSiteTile\(sourceIcon, entry\) \{[\s\S]*document\.querySelectorAll\("img\[data-site-url\]"\)[\s\S]*sibling\.classList\.contains\("site-icon-local"\)[\s\S]*siblingKey !== siteKey[\s\S]*applyIconTile\(sibling, entry\.tileMode, entry\.tileColors, false\)/, "The broadcast must converge every on-screen same-site tier-2 tile without ever touching a tier-1 local icon.");
