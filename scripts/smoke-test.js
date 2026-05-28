const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const readText = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const readJson = (relativePath) =>
  JSON.parse(readText(relativePath));

const manifest = readJson("manifest.json");
const pkg = readJson("package.json");
const defaultMessages = readJson("_locales/en/messages.json");
const manifestMessage = (value) => {
  const match = String(value || "").match(/^__MSG_([A-Za-z0-9_]+)__$/);
  if (!match) return value;
  return defaultMessages[match[1]]?.message || value;
};
const includesAll = (text, snippets) => snippets.every((snippet) => text.includes(snippet));
const excludesAll = (text, snippets) => snippets.every((snippet) => !text.includes(snippet));

assert.equal(manifest.manifest_version, 3, "manifest must be MV3");
assert.equal(manifest.default_locale, "en", "manifest must declare a default locale");
assert.equal(manifestMessage(manifest.name), "xPoster", "manifest name must resolve to xPoster");
assert.equal(pkg.version.replace(/\.0$/, ""), manifest.version, "package and manifest versions must match");
for (const locale of ["zh_TW", "ja", "fr", "ru", "de", "es", "pt_BR", "ko"]) {
  assert.ok(
    fs.existsSync(path.join(root, "_locales", locale, "messages.json")),
    `${locale} Chrome locale messages should be present`
  );
}
assert.ok(!manifest.host_permissions, "remote image hosts must not be granted at install time");
assert.deepEqual(
  manifest.optional_host_permissions,
  ["http://*/*", "https://*/*"],
  "remote image hosts should be optional runtime permissions"
);

const requiredFiles = [
  "sidepanel.html",
  "sidepanel.css",
  "sidepanel.js",
  "diagnostics.html",
  "diagnostics.css",
  "diagnostics.js",
  "src/background.js",
  "src/content.js",
  "src/main-world.js",
  "src/shared.js",
  "src/sidepanel-messages.js",
  "src/sidepanel-patterns.js",
  "fixtures/live-x-smoke.md",
  "README.zh-CN.md",
  "docs/usage.md",
  "docs/usage.zh-CN.md",
  "docs/privacy.md",
  "docs/privacy.zh-CN.md",
  "docs/images/buy-me-a-coffee-qr.png",
  "assets/icon-16.png",
  "assets/icon-32.png",
  "assets/icon-48.png",
  "assets/icon-128.png"
];

for (const file of requiredFiles) {
  assert.ok(fs.existsSync(path.join(root, file)), `${file} is missing`);
}

for (const contentScript of manifest.content_scripts || []) {
  for (const file of contentScript.js || []) {
    assert.ok(fs.existsSync(path.join(root, file)), `content script ${file} is missing`);
  }
}

for (const resourceGroup of manifest.web_accessible_resources || []) {
  for (const file of resourceGroup.resources || []) {
    assert.ok(fs.existsSync(path.join(root, file)), `web resource ${file} is missing`);
  }
}

const shared = require(path.join(root, "src/shared.js"));
const fixture = readText("fixtures/live-x-smoke.md");
const parsed = shared.parseMarkdown(fixture);
const counts = shared.segmentCounts(parsed.segments);
const plan = shared.buildPastePlan(parsed.segments);
const remoteImageDraft = "Before\n\n![remote cover](https://images.example.test/path/cover.png)\n\nAfter";
const remoteImageParsed = shared.parseMarkdown(remoteImageDraft);
const failedRemoteImageMap = new Map(
  remoteImageParsed.segments
    .filter((segment) => segment.type === "image")
    .map((segment) => [segment, { ok: false, permissionRequired: true, error: "Chrome permission required" }])
);
const remoteFallbackPlan = shared.buildPastePlan(remoteImageParsed.segments, failedRemoteImageMap);
const mediaLimitDraft = (count) =>
  Array.from({ length: count }, (_, index) => `![image ${index + 1}](https://images.example.test/${index + 1}.png)`).join("\n\n");
const mediaNearLimitParsed = shared.parseMarkdown(mediaLimitDraft(21));
const mediaAtLimitParsed = shared.parseMarkdown(mediaLimitDraft(25));
const mediaOverLimitParsed = shared.parseMarkdown(mediaLimitDraft(26));
const frontmatterOnlyCoverDraft = [
  "---",
  "title: Cover only",
  "cover: https://images.example.test/path/cover.png",
  "---",
  "",
  "Body without a repeated image."
].join("\n");
const frontmatterOnlyCoverParsed = shared.parseMarkdown(frontmatterOnlyCoverDraft);
const h1TitleDisabledParsed = shared.parseMarkdown("# Keep this heading\n\nBody text.", { setTitle: false });
const coverDisabledParsed = shared.parseMarkdown("![cover](https://images.example.test/path/cover.png)\n\nBody text.", {
  setCover: false
});
const coverOnlyPlan = shared.buildPastePlan(
  frontmatterOnlyCoverParsed.segments,
  new Map(),
  new Map(),
  {
    coverSource: frontmatterOnlyCoverParsed.cover,
    coverResult: {
      ok: true,
      base64: "AA==",
      mime: "image/png",
      fileName: "cover.png"
    }
  }
);
const contentScriptText = readText("src/content.js");
const backgroundText = readText("src/background.js");
const mainWorldText = readText("src/main-world.js");
const sidepanelText = readText("sidepanel.js");
const sidepanelMessagesText = readText("src/sidepanel-messages.js");
const sidepanelPatternsText = readText("src/sidepanel-patterns.js");
const sidepanelHtml = readText("sidepanel.html");
const diagnosticsHtml = readText("diagnostics.html");
const sidepanelCss = readText("sidepanel.css");
const sharedText = readText("src/shared.js");
const diagnosticsHtmlIncludesSharedFirst = () =>
  /src="src\/shared\.js"[\s\S]*src="src\/i18n\.js"[\s\S]*src="diagnostics\.js"/.test(diagnosticsHtml);
const statusHelperStart = contentScriptText.indexOf("  function normalizeText");
const statusHelperEnd = contentScriptText.indexOf("  function showStatus");
const contentMediaHelperStart = contentScriptText.indexOf("  function articleMediaUploadEstimate");
const contentMediaHelperEnd = contentScriptText.indexOf("  function mediaLimitText");
const sidepanelMediaHelperStart = sidepanelText.indexOf("  function mediaUploadEstimate");
const sidepanelMediaHelperEnd = sidepanelText.indexOf("  function mediaNoteText");
const statusSandbox = {
  document: { body: {}, documentElement: {} },
  getComputedStyle: () => ({ backgroundColor: "rgb(18, 26, 34)" }),
  window: { matchMedia: () => ({ matches: false }) },
  shared: { toTraditionalChinese: shared.toTraditionalChinese }
};
const mediaSandbox = {
  shared: { imageSourcesMatch: shared.imageSourcesMatch },
  nearParsed: mediaNearLimitParsed,
  atParsed: mediaAtLimitParsed,
  overParsed: mediaOverLimitParsed
};

assert.ok(statusHelperStart >= 0 && statusHelperEnd > statusHelperStart, "status helper functions should be present");
assert.ok(
  contentMediaHelperStart >= 0 &&
    contentMediaHelperEnd > contentMediaHelperStart &&
    sidepanelMediaHelperStart >= 0 &&
    sidepanelMediaHelperEnd > sidepanelMediaHelperStart,
  "media estimate helper functions should be present"
);
vm.runInNewContext(
  `const state = { language: "zh" };
   const CONTENT_ZH_TEXT = new Map(Object.entries({
     "Writing article": "正在写入文章",
     "Preparing Markdown...": "正在准备 Markdown...",
     "Copy Markdown": "复制 Markdown",
     "Queue Markdown drafts": "加入 Markdown 草稿队列",
     "Release to add them to the xPoster side panel.": "松开后加入 xPoster 侧边栏。"
   }));
   const CONTENT_EN_TEXT = new Map(Array.from(CONTENT_ZH_TEXT.entries()).map(([en, zh]) => [zh, en]));
   ${contentScriptText.slice(statusHelperStart, statusHelperEnd)}
   this.state = state;
   this.statusHelpers = { statusThemeFromPage, statusProgressForText, translateContentText, articleExportLabel };`,
  statusSandbox
);
vm.runInNewContext(
  `const X_ARTICLE_MEDIA_SOFT_LIMIT = 25;
   const X_ARTICLE_MEDIA_HEADROOM_THRESHOLD = 21;
   const importOptions = {};
   ${contentScriptText.slice(contentMediaHelperStart, contentMediaHelperEnd)}
   const contentNear = articleMediaUploadEstimate(nearParsed);
   const contentAt = articleMediaUploadEstimate(atParsed);
   const contentOver = articleMediaUploadEstimate(overParsed);
   ${sidepanelText.slice(sidepanelMediaHelperStart, sidepanelMediaHelperEnd)}
   const sidepanelNear = mediaUploadEstimate(nearParsed);
   const sidepanelAt = mediaUploadEstimate(atParsed);
   const sidepanelOver = mediaUploadEstimate(overParsed);
   this.mediaEstimates = { contentNear, contentAt, contentOver, sidepanelNear, sidepanelAt, sidepanelOver };`,
  mediaSandbox
);

assert.equal(parsed.title, "xPoster live smoke test", "frontmatter title should parse");
assert.ok(parsed.cover, "cover should parse");
assert.equal(h1TitleDisabledParsed.title, null, "title setting can disable title extraction");
assert.equal(
  h1TitleDisabledParsed.segments[0]?.kind,
  "header-one",
  "disabled title extraction should keep the first H1 in the body"
);
assert.equal(coverDisabledParsed.cover, null, "cover setting can disable cover extraction");
assert.equal(
  coverDisabledParsed.segments.filter((segment) => segment.type === "image").length,
  1,
  "disabled cover extraction should keep image blocks in the body"
);
assert.ok(counts.image >= 1, "fixture should include an image");
assert.ok(counts.table >= 1, "fixture should include a table");
assert.ok(counts.tweet >= 1, "fixture should include a tweet");
assert.ok(counts.code >= 1, "fixture should include a code block");
assert.ok(counts.divider >= 1, "fixture should include a divider");
assert.ok(plan.html.includes("__XPOSTER_"), "paste plan should include replacement markers");
assert.ok(
  remoteFallbackPlan.plain.includes("![remote cover](https://images.example.test/path/cover.png)"),
  "failed remote images should remain as Markdown image links"
);
assert.ok(
  !remoteFallbackPlan.plain.includes("Chrome permission required"),
  "failed remote image fallback should not write internal permission errors into the article"
);
assert.equal(shared.isRemoteHttpImageSource("https://images.example.test/a.png"), true, "public web images should be treated as remote images");
assert.equal(shared.isRemoteHttpImageSource("http://127.0.0.1/a.png"), false, "loopback image URLs should not be downloaded");
assert.equal(shared.isRemoteHttpImageSource("http://192.168.1.8/a.png"), false, "private network image URLs should not be downloaded");
assert.equal(shared.isRemoteHttpImageSource("http://169.254.169.254/meta.png"), false, "link-local metadata URLs should not be downloaded");
assert.equal(shared.isRemoteHttpImageSource("http://224.0.0.1/a.png"), false, "multicast or reserved image URLs should not be downloaded");
assert.equal(shared.isRemoteHttpImageSource("http://[::ffff:127.0.0.1]/a.png"), false, "IPv4-mapped loopback image URLs should not be downloaded");
assert.equal(shared.isRemoteHttpImageSource("http://[::ffff:8.8.8.8]/a.png"), true, "public IPv4-mapped image URLs should remain valid");
assert.equal(shared.parseDataUri("data:text/html;base64,PGgxPk5vdCBhbiBpbWFnZTwvaDE+").ok, false, "data URI images should reject non-image MIME types");
assert.equal(shared.parseDataUri(`data:image/png;base64,${"A".repeat(24 * 1024 * 1024)}`).ok, false, "oversized data URI images should be rejected");
assert.ok(
  contentScriptText.includes('showStatus(formatCompletionMessage(summary), "done", 7000)'),
  "successful Markdown writes should finish with a done status even when images stay as links"
);
assert.ok(
  contentScriptText.includes('collectMediaFailures(new Map([[coverSegment, coverResult]]), "cover")') &&
    contentScriptText.includes("function mediaUploadFailureCounts") &&
    contentScriptText.includes('parts.push(`${skippedImages} body image(s) stayed as Markdown links`)') &&
    contentScriptText.includes('parts.push(`${skippedTables} table image(s) stayed as Markdown tables`)') &&
    contentScriptText.includes('parts.push(`${skippedCovers} cover image(s) could not be applied`)') &&
    contentScriptText.includes("function coverApplicationFailureCount") &&
    contentScriptText.includes("counts.image += unclassified;") &&
    mainWorldText.includes("function imageOperationKind") &&
    mainWorldText.includes("kind: imageOperationKind(op)") &&
    sidepanelText.includes("function mediaUploadFailureCounts") &&
    sidepanelText.includes("function coverApplicationFailureCount") &&
    sidepanelText.includes('parts.push(`${keptImages} body image(s) stayed as Markdown links`)') &&
    sidepanelText.includes('parts.push(`${keptTables} table image(s) stayed as Markdown tables`)') &&
    sidepanelText.includes('parts.push(`${missedCovers} cover image(s) could not be applied`)') &&
    sidepanelText.includes('bodyImageWarnings ? `${bodyImageWarnings} body kept`') &&
    sidepanelText.includes('tableImageWarnings ? `${tableImageWarnings} table kept`') &&
    sidepanelText.includes('coverImageWarnings ? `${coverImageWarnings} cover missed`') &&
    sidepanelText.includes('const label = item.op.coverOnly ? "Cover image" : item.marker.includes("_TABLE_") ? "Table image" : "Image";') &&
    sidepanelText.includes('body image(s) kept as Markdown links') &&
    sidepanelText.includes('cover image(s) not applied'),
  "image failure summaries should distinguish body images, rendered tables, cover image application, and legacy unclassified upload failures"
);
assert.ok(
  contentScriptText.includes('"Local image folder": "本地图片文件夹"') &&
    contentScriptText.includes('"Choose folder": "选择文件夹"') &&
    contentScriptText.includes("[/^(\\d+) local image\\(s\\) need a root folder\\.$/, \"$1 张本地图片需要选择根文件夹。\"]") &&
    contentScriptText.includes("const title = translateContentText(\"Local image folder\")") &&
    contentScriptText.includes("const chooseLabel = translateContentText(\"Choose folder\")"),
  "X-page local image folder prompt should not leak English in Chinese mode"
);
assert.ok(
  contentScriptText.includes("safeRuntimeSendMessage") &&
    contentScriptText.includes("Extension context invalidated. Reload the X Article tab after updating xPoster.") &&
    contentScriptText.includes("const sendMessage = chrome.runtime?.sendMessage?.bind(chrome.runtime);") &&
    !contentScriptText.includes("chrome.runtime\n      .sendMessage"),
  "content script runtime messages should not throw uncaught errors after extension reloads"
);
assert.ok(
  contentScriptText.includes("uploadDroppedImageUrl"),
  "content script should keep the explicit image insertion path available"
);
assert.ok(
  contentScriptText.includes('data-slot="image"'),
  "drop hint should expose an image drop mode"
);
assert.ok(
  contentScriptText.includes("function dropSurfaceRect(intent") &&
    contentScriptText.includes("function updateDropHintSurface(hint, intent") &&
    contentScriptText.includes("--xposter-drop-surface-left") &&
    contentScriptText.includes("--xposter-drop-surface-width") &&
    contentScriptText.includes('data-surface="page-dock"') &&
    contentScriptText.includes("function pageDropDockSurfaceRect") &&
    contentScriptText.includes("function articleBodyDropDockRect") &&
    contentScriptText.includes("width: window.innerWidth") &&
    contentScriptText.includes("height = Math.min(96") &&
    contentScriptText.includes("function dropHintSurfaceKind") &&
    contentScriptText.includes('if (intent === "article") return "page-dock";') &&
    contentScriptText.includes("--xposter-drop-signal: #1d9bf0") &&
    contentScriptText.includes("--xposter-drop-signal-text: #0f6cbf") &&
    contentScriptText.includes('[data-mode="markdown"][data-surface="page-dock"]::before') &&
    contentScriptText.includes("linear-gradient(90deg, var(--xposter-drop-signal-text), var(--xposter-drop-signal) 52%, #0f7acb)") &&
    contentScriptText.includes("color: #ffffff;") &&
    contentScriptText.includes("__xposter_drop_text_focus") &&
    contentScriptText.includes(".__xposter_drop_status") &&
    contentScriptText.includes("function dropHintStatusLabel") &&
    contentScriptText.includes("grid-template-columns: 34px minmax(0, 1fr) auto;") &&
    contentScriptText.includes('[data-mode="markdown"][data-surface="page-dock"] strong') &&
    contentScriptText.includes('[data-mode="markdown"][data-surface="page-dock"] p') &&
    contentScriptText.includes("__xposter_drop_rail") &&
    contentScriptText.includes("__xposter_drop_mark_hint") &&
    contentScriptText.includes('[data-mode="markdown"][data-state="ready"] .__xposter_drop_mark') &&
    contentScriptText.includes("--xposter-drop-progress") &&
    contentScriptText.includes("Open X Article draft") &&
    contentScriptText.includes("Write to this X Article") &&
    contentScriptText.includes("Release in the bottom bar to write this Markdown here.") &&
    contentScriptText.includes("xPoster page drop target") &&
    contentScriptText.includes("function setDropHintProcessing") &&
    contentScriptText.includes("updateVisibleDropHintCopy") &&
    contentScriptText.includes('translateContentText("xPoster page drop target")') &&
    contentScriptText.includes("function isDropEventOverSurface(event, intent") &&
    contentScriptText.includes("function dropIntentForTransfer") &&
    contentScriptText.includes("function sidePanelMarkdownDropIntent") &&
    contentScriptText.includes("function isExplicitImageInsertDrop") &&
    contentScriptText.includes("function hasImageDropPayload") &&
    contentScriptText.includes("function articleBodyHasFocus") &&
    contentScriptText.includes('event.dataTransfer.dropEffect = "copy"'),
  "X page Markdown drag feedback should use the same bottom full-width dock on home and Article editor pages while image/folder targets keep a short editor dock"
);
assert.ok(
  contentScriptText.includes("if (!event?.altKey) return false;") &&
    contentScriptText.includes('if (isExplicitImageInsertDrop(dataTransfer, event)) return "image";') &&
    contentScriptText.includes('if (isDirectoryDrop(dataTransfer, event)) return "folder";') &&
    contentScriptText.includes('if (isSingleMarkdownDrop(dataTransfer)) return "article";') &&
    contentScriptText.includes("if (!articleBodyHasFocus()) return false;") &&
    !contentScriptText.includes('if (types.includes("text/plain") || types.includes("text/markdown")) return true;') &&
    !contentScriptText.includes("function isXposterDropCandidate") &&
    !contentScriptText.includes("function isXposterDefaultDropCandidate") &&
    !contentScriptText.includes('"article-outside"') &&
    !contentScriptText.includes("if (files.some(isImageFile)) return true;") &&
    !contentScriptText.includes("return items.some(isLikelyMarkdownTransferItem) || items.some(isLikelyImageTransferItem) || items.some(isDirectoryTransferItem);") &&
    contentScriptText.includes("Place the cursor in the article body before dropping an image."),
  "plain image drops should pass through to X native cover/media areas; xPoster image insertion must be explicit and cursor-based"
);
assert.ok(
  contentScriptText.includes('if (sidePanelIntent === "sidepanel-queue") return sidePanelIntent;') &&
    contentScriptText.includes('if (isSingleMarkdownDrop(dataTransfer)) return "article";') &&
    contentScriptText.includes("const PENDING_ARTICLE_IMPORT_STORAGE_KEY") &&
    contentScriptText.includes("async function stageSingleMarkdownForArticle") &&
    contentScriptText.includes("async function importSingleMarkdownFileFromDrop") &&
    contentScriptText.includes("async function resumePendingArticleImport") &&
    contentScriptText.includes('safeRuntimeSendMessage({ type: "xposter:open-articles" })') &&
    !contentScriptText.includes("function hasSingleUnknownFileItem") &&
    contentScriptText.includes("if (files.length > 1) return \"sidepanel-queue\";") &&
    contentScriptText.includes("if (files.length === 1) return \"\";") &&
    contentScriptText.includes("const panelPromise = safeRuntimeSendMessage({ type: \"xposter:open-side-panel\" }).catch(() => {})") &&
    contentScriptText.includes("await queueMarkdownFilesForSidePanel(markdownFiles, { openPanelPromise: panelPromise })"),
  "X page drops should open single Markdown files in X Articles and queue multiple Markdown files in the side panel"
);
assert.ok(
  contentScriptText.includes('const ARTICLE_EXPORT_ID = "__xposter_article_export__"') &&
    contentScriptText.includes('const ARTICLE_EXPORT_SETTINGS_STORAGE_KEY = "xposter_article_export_settings"') &&
    contentScriptText.includes('enabled: settings.enabled !== false') &&
    contentScriptText.includes('function installArticleExportButton') &&
    contentScriptText.includes('function extractReadableXArticle') &&
    contentScriptText.includes("const ARTICLE_EXPORT_LONGFORM_SELECTOR") &&
    contentScriptText.includes("function hasReadableArticleSignal") &&
    contentScriptText.includes("function containerHasReadableArticleSignal") &&
    contentScriptText.includes("function articleExportMediaLinks") &&
    contentScriptText.includes("if (!hasReadableArticleSignal()) return null;") &&
    contentScriptText.includes("longformRoots") &&
    contentScriptText.includes("articleRoots") &&
    contentScriptText.includes("if (!containerHasReadableArticleSignal(container)) return null;") &&
    contentScriptText.includes('function markdownForArticleNode') &&
    contentScriptText.includes('navigator.clipboard.writeText(text)') &&
    contentScriptText.includes('link.download = fileName || articleFileName("")') &&
    contentScriptText.includes('await setArticleExportMode(button.dataset.exportMode)') &&
    contentScriptText.includes("signalArticleExportFeedback(root, \"done\")") &&
    contentScriptText.includes('main.textContent = translateContentText("Markdown")') &&
    contentScriptText.includes('main.title = title') &&
    contentScriptText.includes("position: fixed") &&
    contentScriptText.includes("right: var(--__xposter-article-export-inline-end, 24px)") &&
    contentScriptText.includes("function articleDockInlineEnd") &&
    contentScriptText.includes("min-width: 76px") &&
    contentScriptText.includes("--__xposter-export-paper: #ffffff") &&
    contentScriptText.includes("border: 1px solid var(--__xposter-export-line)") &&
    contentScriptText.includes("background: var(--__xposter-export-paper)") &&
    contentScriptText.includes("opacity: 0.86") &&
    !contentScriptText.includes("backdrop-filter: blur") &&
    !contentScriptText.includes('[data-xposter-article-export-host="true"]') &&
    contentScriptText.includes('const LANGUAGE_STORAGE_KEY = "xposter_language"') &&
    contentScriptText.includes("function restoreContentLanguage") &&
    contentScriptText.includes("function translateContentText") &&
    contentScriptText.includes('__xposter_article_export_menu_in') &&
    contentScriptText.includes('prefers-reduced-motion: reduce') &&
    contentScriptText.includes('installArticleExportButton();'),
  "readable X article pages should expose a localized default-on Markdown copy/download button with remembered mode and restrained feedback motion"
);
assert.ok(
  !contentScriptText.includes("function positionDropHint") &&
    !contentScriptText.includes("--xposter-drop-left") &&
    !contentScriptText.includes("--xposter-drop-top") &&
    !contentScriptText.includes("event.clientX - width / 2"),
  "X page drop feedback should not follow the cursor as a small floating tray"
);
assert.equal(statusSandbox.statusHelpers.statusThemeFromPage(), "dark", "status overlay should detect a dark host surface");
assert.equal(
  statusSandbox.statusHelpers.statusProgressForText("Preparing Markdown...", "work"),
  6,
  "status background progress should begin during preparation"
);
assert.equal(
  statusSandbox.statusHelpers.statusProgressForText("Uploading image 1/1...", "work"),
  80,
  "the final image upload should leave room for final writing steps"
);
assert.equal(
  statusSandbox.statusHelpers.statusProgressForText("Cleaning up import markers...", "work"),
  96,
  "cleanup should display near-complete progress"
);
assert.equal(
  statusSandbox.statusHelpers.statusProgressForText("Article written.", "done"),
  100,
  "completed status should fill the status background"
);
assert.equal(statusSandbox.statusHelpers.translateContentText("Preparing Markdown..."), "正在准备 Markdown...", "X page status details should follow the selected language");
assert.equal(statusSandbox.statusHelpers.translateContentText("Writing article"), "正在写入文章", "X page status titles should be localized");
assert.equal(statusSandbox.statusHelpers.articleExportLabel("copy"), "复制 Markdown", "X article export controls should localize action labels");
statusSandbox.state.language = "zh-TW";
assert.equal(statusSandbox.statusHelpers.translateContentText("Preparing Markdown..."), "正在準備 Markdown...", "X page status details should support Traditional Chinese");
assert.equal(statusSandbox.statusHelpers.translateContentText("Queue Markdown drafts"), "加入 Markdown 草稿佇列", "X page drop hints should support Traditional Chinese");
statusSandbox.state.language = "ja";
assert.equal(
  statusSandbox.statusHelpers.translateContentText("Preparing Markdown..."),
  "Preparing Markdown...",
  "partially supported languages should fall back to English instead of mixing Chinese"
);
assert.ok(
  mainWorldText.includes("uploadFilesToEditor"),
  "main-world bridge should hand dropped image files to X's own uploader"
);
assert.ok(
  mainWorldText.includes("function markerTokenPattern") &&
    mainWorldText.includes("text.replace(markerPattern, \"\")") &&
    mainWorldText.includes("summary.markersCleaned += cleanupMarkers(draftNode, payload.markerPrefix)") &&
    mainWorldText.includes("draftNode = findDraftStateNode() || draftNode;"),
  "main-world cleanup should remove leftover xPoster marker tokens from the latest Draft.js state"
);
assert.ok(
  mainWorldText.includes("const MEDIA_UPLOAD_BASE_TIMEOUT_MS = 90000") &&
    mainWorldText.includes("const MEDIA_UPLOAD_MAX_TIMEOUT_MS = 150000") &&
    mainWorldText.includes("const MEDIA_UPLOAD_PROGRESS_HEARTBEAT_MS = 15000") &&
    mainWorldText.includes("progress(`Uploading image ${index}/${total}...`)") &&
    contentScriptText.includes("const MAIN_WORLD_SILENCE_TIMEOUT_MS = 180000") &&
    contentScriptText.includes("}, MAIN_WORLD_SILENCE_TIMEOUT_MS);") &&
    mainWorldText.includes("X media upload took too long. X may be throttling this draft") &&
    mainWorldText.includes("timeoutMs") &&
    !mainWorldText.includes("Timed out waiting for X media upload") &&
    !mainWorldText.includes("Retrying image ${index + 1}"),
  "main-world image uploads should wait longer for X and return a recoverable timeout message"
);
assert.ok(
  contentScriptText.includes("image upload(s) timed out in X") &&
    sidepanelText.includes("image upload(s) timed out in X") &&
    sidepanelMessagesText.includes("X 上传图片等待太久"),
  "upload timeout summaries should explain the X-side delay in the selected language"
);
assert.ok(
  sidepanelText.includes("chrome.permissions.request"),
  "side panel should request remote image host access only when a draft needs it"
);
assert.ok(
  sidepanelText.includes("chrome.permissions.contains"),
  "side panel should report remote image host access from runtime permissions"
);
assert.ok(
  sidepanelText.includes("remoteImageOriginsForMarkdowns(draftQueue.map((item) => item.markdown), importOptions)"),
  "batch queue writes should request all remote image origins during the user action"
);
assert.ok(
  sidepanelText.includes("function hasMarkdownTransfer") &&
    sidepanelText.includes("if (files.length) return files.some(isMarkdownFile);") &&
    sidepanelText.includes("items.some(isLikelyImageTransferItem)") &&
    !sidepanelText.includes('if (types.includes("Files")) return true;'),
  "side panel page-level drop tray should ignore image files and only respond to Markdown/text drafts"
);
assert.ok(
  sidepanelHtml.includes('id="cancelImport"') &&
    sidepanelText.includes('sendToActiveTab({ type: "xposter:cancel-import" })') &&
    contentScriptText.includes('message?.type === "xposter:cancel-import"') &&
    contentScriptText.includes('class="__xposter_status_stop"') &&
    contentScriptText.includes('cancelActiveImport();') &&
    contentScriptText.includes("function syncStatusStopButton") &&
    contentScriptText.includes("function cancelActiveImport") &&
    contentScriptText.includes("function throwIfImportCancelled") &&
    mainWorldText.includes("throwIfCancelled") &&
    mainWorldText.includes('event.data.kind === "cancel"'),
  "article writes should expose a stop control that cancels the page upload loop"
);
assert.ok(
  sidepanelText.includes("const X_ARTICLE_MEDIA_SOFT_LIMIT = 25") &&
    contentScriptText.includes("const X_ARTICLE_MEDIA_SOFT_LIMIT = 25") &&
    contentScriptText.includes("function preflightArticleMediaLimit") &&
    contentScriptText.includes("function articleMediaUploadEstimate") &&
    contentScriptText.includes('type: "preflight-blocked"') &&
    contentScriptText.includes("mediaLimitWarningText") &&
    contentScriptText.includes("mediaHeadroomText") &&
    sidepanelText.includes("const X_ARTICLE_MEDIA_HEADROOM_THRESHOLD = 21") &&
    sidepanelText.includes("X_ARTICLE_MEDIA_LIMIT_WARNING") &&
    sidepanelText.includes("X_ARTICLE_MEDIA_HEADROOM_NOTE") &&
    sidepanelText.includes("X_ARTICLE_MEDIA_CAPACITY_NOTE") &&
    sidepanelHtml.includes('id="draftMediaAlert"') &&
    sidepanelCss.includes(".draft-media-alert") &&
    sidepanelText.includes("function syncDraftMediaAlert") &&
    sidepanelText.includes("els.draftMediaAlertDetail.__xposterSourceText = X_ARTICLE_MEDIA_LIMIT_WARNING") &&
    sidepanelText.includes('text: "Fix the image count in the editor."') &&
    sidepanelText.includes('if (mediaEstimate.nearSoftLimit)') &&
    sidepanelText.includes('text: "Close to the image limit."') &&
    sidepanelText.includes("function quietImportHint") &&
    sidepanelText.includes("function mediaUploadEstimate") &&
    sidepanelText.includes("mediaLimitWarningText") &&
    sidepanelText.includes("mediaHeadroomText") &&
    sidepanelText.includes("mediaCapacityText") &&
    sidepanelText.includes("nearSoftLimit") &&
    sidepanelText.includes('recordLiveProgressEvent("preflight-blocked"') &&
    sidepanelMessagesText.includes("X Article media note") &&
    sidepanelMessagesText.includes("Images: {count}/{limit}") &&
    sidepanelMessagesText.includes("Remove {extra} image(s)") &&
    !sidepanelText.includes("Image plan: {count}/20") &&
    !contentScriptText.includes("Image plan: {count}/20"),
  "draft preflight should allow up to 25 media uploads and show a centered editor warning only above that limit"
);
assert.deepEqual(
  {
    contentNear: {
      total: mediaSandbox.mediaEstimates.contentNear.total,
      nearSoftLimit: mediaSandbox.mediaEstimates.contentNear.nearSoftLimit,
      overSoftLimit: mediaSandbox.mediaEstimates.contentNear.overSoftLimit
    },
    contentAt: {
      total: mediaSandbox.mediaEstimates.contentAt.total,
      nearSoftLimit: mediaSandbox.mediaEstimates.contentAt.nearSoftLimit,
      overSoftLimit: mediaSandbox.mediaEstimates.contentAt.overSoftLimit
    },
    contentOver: {
      total: mediaSandbox.mediaEstimates.contentOver.total,
      nearSoftLimit: mediaSandbox.mediaEstimates.contentOver.nearSoftLimit,
      overSoftLimit: mediaSandbox.mediaEstimates.contentOver.overSoftLimit
    },
    sidepanelNear: {
      total: mediaSandbox.mediaEstimates.sidepanelNear.total,
      nearSoftLimit: mediaSandbox.mediaEstimates.sidepanelNear.nearSoftLimit,
      overSoftLimit: mediaSandbox.mediaEstimates.sidepanelNear.overSoftLimit
    },
    sidepanelAt: {
      total: mediaSandbox.mediaEstimates.sidepanelAt.total,
      nearSoftLimit: mediaSandbox.mediaEstimates.sidepanelAt.nearSoftLimit,
      overSoftLimit: mediaSandbox.mediaEstimates.sidepanelAt.overSoftLimit
    },
    sidepanelOver: {
      total: mediaSandbox.mediaEstimates.sidepanelOver.total,
      nearSoftLimit: mediaSandbox.mediaEstimates.sidepanelOver.nearSoftLimit,
      overSoftLimit: mediaSandbox.mediaEstimates.sidepanelOver.overSoftLimit
    }
  },
  {
    contentNear: { total: 21, nearSoftLimit: true, overSoftLimit: false },
    contentAt: { total: 25, nearSoftLimit: true, overSoftLimit: false },
    contentOver: { total: 26, nearSoftLimit: false, overSoftLimit: true },
    sidepanelNear: { total: 21, nearSoftLimit: true, overSoftLimit: false },
    sidepanelAt: { total: 25, nearSoftLimit: true, overSoftLimit: false },
    sidepanelOver: { total: 26, nearSoftLimit: false, overSoftLimit: true }
  },
  "25 planned media uploads should be allowed; 26 should block before writing"
);
assert.ok(
  sidepanelHtml.includes('class="secondary compact preflight-action"') &&
    sidepanelHtml.includes('data-preflight-action="chooseVault"') &&
    !sidepanelHtml.includes('id="pickVaultSettings"') &&
    sidepanelHtml.includes("xPoster will ask when a Markdown draft uses local image paths.") &&
    sidepanelText.includes("function localImageReferences") &&
    sidepanelText.includes("function localImageFolderStatus") &&
    sidepanelText.includes("function localAssetWriteBlocker") &&
    sidepanelText.includes("handleLocalAssetWriteBlocker(localAssetBlocker") &&
    sidepanelText.includes('button[data-preflight-action]') &&
    sidepanelText.includes("Choose the folder that contains their relative paths.") &&
    sidepanelMessagesText.includes("Local image path blocked") &&
    sidepanelMessagesText.includes("No folder connected. xPoster will ask when a draft needs local images.") &&
    sidepanelCss.includes("grid-template-columns: 18px minmax(0, 1fr) auto;") &&
    sidepanelCss.includes(".preflight-action[hidden]"),
  "local image folder access should stay contextual: settings only shows status, preflight shows the action, and writes block before unresolved local assets start"
);
assert.ok(
  contentScriptText.includes("[/^Uploading image (\\d+)\\/(\\d+)\\.\\.\\.$/, \"正在上传图片 $1/$2...\"]") &&
    contentScriptText.includes("正在设置封面") &&
    contentScriptText.includes("正在清理写入标记") &&
    contentScriptText.includes("\"Stop\": \"停止\"") &&
    contentScriptText.includes("\"Stopping...\": \"正在停止...\""),
  "X page upload progress and stop controls should stay localized in Chinese"
);
assert.ok(
  sidepanelText.includes("function writeOptionsPayload") &&
    sidepanelText.includes("...importOptionsPayload()") &&
    sidepanelText.includes("forceNewArticle: Boolean(forceNewArticle)") &&
    sidepanelText.includes("options: writeOptionsPayload({ forceNewArticle: batch })") &&
    contentScriptText.includes("const forceNewArticle = Boolean(options.forceNewArticle)") &&
    contentScriptText.includes('if (origin !== "paste" && (forceNewArticle || !findEditor()))') &&
    contentScriptText.includes("await ensureEditorReadyForFileImport({ forceNew: forceNewArticle })") &&
    contentScriptText.includes("async function ensureEditorReadyForFileImport({ forceNew = false } = {})") &&
    contentScriptText.includes("if (!forceNew && isEditorRoute() && findEditor()) return;"),
  "side panel writes should include saved title/cover options and batch queue writes should force each draft into a new X Article"
);
assert.ok(
  sidepanelHtml.includes('id="articleExportOptions"') &&
    sidepanelHtml.includes('id="articleExportOption" checked') &&
    sidepanelHtml.includes("Show Markdown export button") &&
    sidepanelText.includes('const STORAGE_ARTICLE_EXPORT_SETTINGS = "xposter_article_export_settings"') &&
    sidepanelText.includes("let articleExportOptions = { enabled: true, mode: \"copy\" }") &&
    sidepanelText.includes("function restoreArticleExportOptions") &&
    sidepanelText.includes("function restoreStartupState") &&
    sidepanelText.includes("setArticleExportOptions({") &&
    sidepanelText.includes("applyArticleExportOptions(stored[STORAGE_ARTICLE_EXPORT_SETTINGS] || articleExportOptions)"),
  "settings should expose a default-on article Markdown export toggle"
);
assert.ok(
  !sidepanelText.includes('record-icon-action is-disabled'),
  "record history should not render a disabled open-link action when no URL is saved"
);
assert.ok(
  sidepanelCss.includes(".record-history-item:hover .record-title strong") &&
    sidepanelCss.includes(".record-history-item:focus-visible .record-title strong") &&
    sidepanelCss.includes("color: var(--signal-text);") &&
    sidepanelCss.includes(':root[data-theme="dark"] .record-history-item:hover .record-title strong') &&
    sidepanelCss.includes("color: var(--signal);"),
  "record titles should turn blue on hover and keyboard focus for clearer item affordance"
);
assert.ok(
  sidepanelText.includes('class="record-file-name"'),
  "record history should render source file names in their own metadata line"
);
assert.ok(
  !sidepanelText.includes('class="record-use-button"') &&
    !sidepanelText.includes('data-record-action="restore"') &&
    !sidepanelCss.includes(".record-use-button") &&
    sidepanelText.includes('primaryLabel: "Use draft"') &&
    sidepanelText.includes("function restoreRecordMarkdownText"),
  "record cards should not show a prominent Use button; restore should stay inside the edit sheet"
);
assert.ok(
  sidepanelHtml.includes('class="record-search-meta"') &&
    sidepanelHtml.includes('id="recordClearConfirm"') &&
    sidepanelHtml.includes('id="confirmRecordClear"') &&
    sidepanelHtml.includes('id="cancelRecordClear"') &&
    sidepanelHtml.includes('class="record-clear-button"') &&
    !sidepanelHtml.includes('class="secondary compact danger record-clear-button"') &&
    sidepanelHtml.indexOf('id="recordHistoryMeta"') < sidepanelHtml.indexOf('id="clearRecordHistory"') &&
    sidepanelHtml.indexOf('id="clearRecordHistory"') < sidepanelHtml.indexOf('id="recordHistoryList"'),
  "record history should expose clear-all inside the metadata toolbar with inline confirmation beside the draft count"
);
assert.ok(
  sidepanelCss.includes(".record-search-meta") &&
    sidepanelCss.includes("grid-template-columns: minmax(0, 1fr) auto;") &&
    sidepanelCss.includes("#recordHistoryMeta::before") &&
    sidepanelCss.includes(".record-clear-button") &&
    sidepanelCss.includes("border-radius: 999px;") &&
    sidepanelCss.includes("text-decoration: none;"),
  "record history metadata toolbar should keep balanced two-column alignment and avoid underlined clear-all text"
);
assert.ok(
  sidepanelText.includes("function openRecordClearConfirm") &&
    sidepanelText.includes("function closeRecordClearConfirm") &&
    sidepanelText.includes("handleRecordClearDismiss") &&
    sidepanelText.includes('els.confirmRecordClear?.addEventListener("click", clearRecordHistory)'),
  "record clear-all should require a dismissible second confirmation"
);
assert.ok(
  !sidepanelHtml.includes('data-i18n="Clear saved record history from this browser."') &&
    !sidepanelHtml.includes('data-i18n="Clear records">Clear records</button>'),
  "settings should not duplicate the record clearing action"
);
assert.ok(
  sidepanelHtml.includes("Recent publish record") &&
    sidepanelHtml.includes("Copy summary") &&
    sidepanelHtml.includes("Technical details") &&
    sidepanelHtml.includes("No technical record saved yet.") &&
    sidepanelHtml.includes('id="copyExtensionPath" hidden') &&
    sidepanelHtml.includes('id="extensionPath" hidden') &&
    !sidepanelHtml.includes("<h2>Saved result checklist</h2>"),
  "saved results should read as a user-facing publish record, with technical details hidden by default"
);
assert.ok(
    sidepanelHtml.includes('<option value="auto">Automatic</option>') &&
    sidepanelHtml.includes('<option value="zh-TW">繁體中文</option>') &&
    sidepanelHtml.includes('<option value="ja">日本語</option>') &&
    sidepanelHtml.includes('<option value="fr">Français</option>') &&
    sidepanelHtml.includes('<option value="ru">Русский</option>') &&
    sidepanelHtml.includes('id="languageSelectButton"') &&
    sidepanelHtml.includes('id="languageOptionsList"') &&
    sidepanelText.includes("function populateLanguageSelect") &&
    sidepanelText.includes("function languageOptionLabel") &&
    sidepanelText.includes("function handleLanguageOptionsKeydown") &&
    sidepanelText.includes("i18n.languageOptions()") &&
    sidepanelCss.includes(".language-option") &&
    sidepanelCss.includes("text-align: center;") &&
    sidepanelText.includes("window.xPosterSidepanelMessages?.register?.(i18n, shared") &&
    sidepanelMessagesText.includes("window.xPosterSidepanelMessages = { register }") &&
    sidepanelText.includes("const sidepanelPatterns = window.xPosterSidepanelPatterns") &&
    sidepanelPatternsText.includes("window.xPosterSidepanelPatterns") &&
    sidepanelMessagesText.includes('"zh-TW": Object.fromEntries') &&
    sidepanelText.includes("function isChineseLanguage") &&
    sidepanelText.includes("shared.toTraditionalChinese") &&
    sharedText.includes("function toTraditionalChinese") &&
    diagnosticsHtmlIncludesSharedFirst() &&
    sidepanelText.includes('setLocalizedText(els.runPreflight, "Checking...")') &&
    sidepanelText.includes('setLocalizedText(els.evidenceMeta, "No technical record saved yet.")') &&
    sidepanelText.includes("localizeInterpolated(\"Local image folder setup failed: {error}\""),
  "side panel language selection should support auto and global languages while keeping dynamic status text localized"
);
assert.ok(
  sidepanelText.includes("function buildPublishRecordSummary") &&
    sidepanelText.includes("xPoster publish record") &&
    sidepanelMessagesText.includes("Publish summary copied.") &&
    sidepanelMessagesText.includes("Draft saved") &&
    sidepanelMessagesText.includes("Write result"),
  "copying the saved result should produce a readable publish summary instead of internal proof JSON"
);
assert.ok(
  sidepanelText.includes("function showQueuedDraftAdded") &&
    sidepanelMessagesText.includes("new draft") &&
    sidepanelMessagesText.includes("total in queue"),
  "queue feedback should explicitly tell users when drafts are added"
);
assert.ok(
  sidepanelText.includes("function formatCompactCount") &&
    sidepanelText.includes("function formatCompactUnit") &&
    sidepanelText.includes('formatCompactUnit(record.characters, "char", "chars", "字")') &&
    sidepanelText.includes('formatCompactUnit(item.characters || 0, "char", "chars", "字符")') &&
    sidepanelText.includes("function queueItemMediaSummary") &&
    sidepanelText.includes("function queueItemExcerpt") &&
    sidepanelText.includes("function queueItemDisplayTitle") &&
    sidepanelText.includes("function renderQueueItemMeta") &&
    sidepanelText.includes('data-media="${safe(mediaSummary.tone)}"') &&
    sidepanelText.includes('class="draft-queue-excerpt"') &&
    sidepanelText.includes('class="draft-queue-fact"') &&
    sidepanelMessagesText.includes('"Too many images: remove {extra}"') &&
    sidepanelText.includes("media.tone === \"danger\"") &&
    sidepanelText.includes("formatCompactCount(total, { zhTenThousand: false })") &&
    sidepanelText.includes("draft-queue-copy") &&
    sidepanelText.includes("draft-queue-remove") &&
    sidepanelText.includes("function removeDraftQueueItem") &&
    sidepanelText.includes('data-queue-action="remove"') &&
    sidepanelMessagesText.includes('"Remove draft"') &&
    sidepanelMessagesText.includes('"Queued draft removed."') &&
    !sidepanelText.includes('class="record-icon-action draft-queue-edit"') &&
    !sidepanelText.includes('class="draft-queue-source"') &&
    !sidepanelText.includes('"Source: {name}"') &&
    !sidepanelText.includes('"No images":') &&
    !sidepanelText.includes('"Near image limit"') &&
    sidepanelCss.includes(".draft-queue-excerpt") &&
    sidepanelCss.includes(".draft-queue-remove") &&
    sidepanelCss.includes("grid-template-rows: auto auto auto;") &&
    sidepanelCss.includes("min-height: 72px;") &&
    !sidepanelCss.includes(".draft-queue-source") &&
    !sidepanelCss.includes(".draft-queue-actions {\n    grid-column: 1 / -1;") &&
    sidepanelCss.includes(".draft-queue-item:hover") &&
    sidepanelCss.includes(".draft-queue-item:focus-within") &&
    sidepanelCss.includes('.draft-queue-item[data-media="danger"]') &&
    !sidepanelCss.includes('.draft-queue-fact[data-tone="warn"]') &&
    sidepanelCss.includes(".draft-queue-index"),
  "record and queue stats should use compact counts, queue items should warn only for over-limit media, and hover/focus should show clear item affordance"
);
assert.ok(
    sidepanelText.includes('if (counts.image) parts.push(formatCompactUnit(counts.image, "image", "images", "图"))') &&
    sidepanelText.includes('if (counts.table) parts.push(formatCompactUnit(counts.table, "table", "tables", "表"))') &&
    sidepanelText.includes('formatCompactUnit(length, "char", "chars", "字符")') &&
    sidepanelText.includes("Web images: ${remoteCount}") &&
    !sidepanelText.includes("Images: ${imageCount}") &&
    !sidepanelText.includes("Unreachable images stay as links.") &&
    !sidepanelText.includes("draftTargetStateText") &&
    !sidepanelText.includes("function draftEditorModeLabel") &&
    !sidepanelHtml.includes('id="draftTargetState"') &&
    !sidepanelHtml.includes('id="draftBrief"') &&
    sidepanelHtml.includes('id="draftEditorModeToggle"') &&
    sidepanelHtml.includes("data-editor-mode-toggle") &&
    !sidepanelHtml.includes('id="draftEditorModeLabel"') &&
    !sidepanelHtml.includes('data-editor-mode="edit"') &&
    !sidepanelHtml.includes('data-editor-mode="read"') &&
    !sidepanelHtml.includes('data-editor-mode="check"') &&
    !sidepanelCss.includes(".draft-brief") &&
    sidepanelCss.includes(".draft-editor-status"),
  "draft editor status should stay compact, host a single Write/Read toggle, and avoid duplicate recognized-summary or Check rows"
);
assert.ok(
  contentScriptText.includes("message.options || {}"),
  "content script should apply title and cover options sent by the side panel"
);
{
  const titleBeforeBody =
    mainWorldText.indexOf("await applyTitleMetadata(payload.title, articleId, summary);") <
    mainWorldText.indexOf('progress("Pasting structured Markdown...")');
  const orderedImageOps =
    mainWorldText.includes('const imageOps = (payload.plan || []).filter((item) => item.op.type === "image");') &&
    !mainWorldText.includes("function orderImageOperationsForMetadata") &&
    !mainWorldText.includes("coverPriorityForImageOperation");
  const coverAfterUpload =
    mainWorldText.indexOf("await applyCoverMetadata(payload.cover, articleId, upload, summary);") >
    mainWorldText.indexOf("const result = await uploadImageAtMarker");
  const timelineMetadataFirst =
    sidepanelHtml.indexOf('data-timeline-step="metadata"') < sidepanelHtml.indexOf('data-timeline-step="media"') &&
    sidepanelHtml.indexOf('data-timeline-step="metadata"') < sidepanelHtml.indexOf('data-timeline-step="paste"');
  assert.ok(
    titleBeforeBody &&
      orderedImageOps &&
      coverAfterUpload &&
      timelineMetadataFirst &&
      mainWorldText.includes("upload.coverOnly && !coverUpload") &&
      mainWorldText.includes("coverUpload?.coverOnly && coverUpload.blockKey") &&
      !mainWorldText.includes("coverUpload?.blockKey && (coverUpload.coverOnly || summary.cover.graphql?.ok)") &&
      mainWorldText.includes("if (!String(text || \"\")) return deleteBlockByKey(draftNode, blockKey).ok;") &&
      sidepanelText.includes("Title is set first; body images keep Markdown order, and the cover is matched after upload.") &&
      sidepanelText.includes("Setting article title and matching cover after ordered uploads.") &&
      !sidepanelText.includes("Setting the title and cover after the body import."),
    "article import should set title first while preserving Markdown image order and cleaning temporary cover blocks"
  );
}
assert.ok(
  sidepanelHtml.includes("https://github.com/nevertoday/xposter"),
  "settings should link to the GitHub project page"
);
assert.ok(
  sidepanelHtml.includes("https://x.com/xiaoxiaodong01"),
  "settings should link to the author X profile"
);
assert.ok(
  includesAll(sidepanelHtml, [
    "vendor/minigfm.min.js",
    "src/sidepanel-messages.js",
    "src/sidepanel-patterns.js",
    'id="draftEditorToolbar"',
    'id="draftEditorStatus"',
    'id="draftEditorModeToggle"',
    "data-editor-mode-toggle",
    'class="editor-command-icon"',
    'id="draftInlinePreview"',
    'class="draft-editor-input-wrap"',
    'id="draftSyntaxHighlight"',
    '<textarea id="markdown"'
  ]) &&
    excludesAll(sidepanelHtml, [
      ">Link</button>",
      ">Image</button>",
      ">Table</button>",
      "vendor/codemirror-editor.bundle.js",
      'id="draftEditorModeLabel"',
      'data-editor-mode="edit"',
      'data-editor-mode="read"',
      'data-editor-mode="check"',
      'id="draftBrief"'
    ]) &&
    includesAll(sidepanelText, [
      'const DRAFT_EDITOR_MODES = new Set(["edit", "read"])',
      "function draftText()",
      "function miniGfm()",
      "function protectReadPreviewCodeBlocks",
      "function restoreReadPreviewCodeBlocks",
      "function sanitizePreviewHtml",
      "const schemeMatch = raw.match",
      "return /^(https?|mailto|tel|ftp)$/i.test(schemeMatch[1]) ? raw : \"\";",
      "function markdownSegmentCounts",
      "function editorStatsText",
      "function updateEditorModeToggle",
      "button.disabled = !isEdit || queueModeActive()",
      "function setDraftText(markdown",
      "parseStatus = true",
      "updateDraftEditorStatus({ parse = true } = {})",
      "updateDraftEditorStatus({ parse: parseStatus });",
      "updateDraftEditorStatus({ parse: false });",
      "else if (draftText().trim()) scheduleAnalyzeDraft(STARTUP_DRAFT_ANALYZE_DELAY_MS);",
      "function handleDraftEditorInput",
      "function setDraftEditorMode",
      "function updateDraftEditorModeToggle",
      "function updateDraftEditorDensity",
      "function plainDraftSyntaxText",
      "function renderMarkdownSyntaxHighlight",
      "function renderDraftSyntaxHighlight",
      "SYNTAX_HIGHLIGHT_DETAIL_LIMIT",
      "target.textContent = value;",
      "function highlightInlineMarkdownSyntax",
      "function syncDraftSyntaxScroll",
      'els.markdown.addEventListener("scroll", syncDraftSyntaxScroll)',
      "const counts = parse ? markdownSegmentCounts(text, latestCounts || shared.segmentCounts([])) : shared.segmentCounts([]);",
      "editorStatsText(text, counts)",
      "editorStatsText(text, markdownSegmentCounts(text))",
      "function translateVisibleWorkspace()",
      "translateVisibleWorkspace();",
      "translateDynamicDom(panel)",
      "function formatCompactNumber",
      'const tenThousandUnit = currentLanguage === "zh-TW" ? "萬" : "万";',
      'els.draftPanel.dataset.queueMode = hasQueue ? "true" : "false";',
      "els.draftEditorShell.hidden = hasQueue",
      'els.draftEditorShell.dataset.density = isCompact ? "compact" : "roomy";',
      "function runWhenIdle(callback, timeout = STARTUP_IDLE_TIMEOUT_MS)",
      "function restoreSingleDraftMarkdown(markdown, { analyze = true } = {})",
      "setDraftText(text, { preview: false, parseStatus: false, syntax: \"defer\" });",
      "function scheduleDraftSyntaxHighlight",
      "function paintStartupShell",
      "function restoreStartupState",
      "function startupStorage",
      "STARTUP_STORAGE_KEYS",
      "scheduleAnalyzeDraft(STARTUP_DRAFT_ANALYZE_DELAY_MS);",
      "function ensureRecordHistoryRestored({ render = false } = {})",
      "function scheduleRecordHistoryRestore()",
      "pendingRecordHistoryEntries",
      "function syncLatestEvidenceRecord()",
      "function syncRecordPanel({ translate = els.recordsPanel?.classList.contains(\"active\") } = {})",
      "syncRecordPanel({ translate: false });",
      "restoreRecordHistory({ render })",
      "ensureRecordHistoryRestored({ render: false }).then(() =>",
      'if (target === "records") {',
      "void ensureRecordHistoryRestored({ render: true }).then(() =>",
      "syncRecordPanel({ translate: true });",
      "function updateInlinePreview",
      "function updateRecordEditorMode",
      "function updateRecordEditPreview",
      "function handleRecordEditorInput",
      "function handleTextareaUndoShortcut",
      "function syncProgrammaticUndoFallback",
      "function clearProgrammaticHistoryOnTextInput",
      "const EDITOR_HISTORY_LIMIT = 40",
      "function applyTextareaCommand",
      "return importMarkdownDraft(draftText())",
      "els.draftEditorModeToggle?.addEventListener"
    ]) &&
    excludesAll(sidepanelText, [
      'isChineseLanguage() ? "k" : "K"',
      'isChineseLanguage() ? "m" : "M"',
      "window.xPosterCodeMirror",
      "lineNumbers",
      "return importMarkdownDraft(els.markdown.value)"
    ]) &&
    includesAll(sidepanelCss, [
      ".draft-editor-toolbar",
      "grid-row: 2;",
      "--draft-editor-roomy-block-size: clamp(260px, calc(100dvh - 292px), 430px);",
      "--draft-editor-compact-block-size: clamp(156px, calc(100dvh - 292px), 220px);",
      "--draft-editor-roomy-block-size: clamp(220px, calc(100dvh - 276px), 390px);",
      "--draft-editor-compact-block-size: clamp(148px, calc(100dvh - 276px), 208px);",
      ".draft-editor-shell[data-density=\"compact\"]",
      ".panel.active {\n  min-height: 0;\n  display: grid;\n  align-self: stretch;",
      "align-content: stretch;",
      "grid-template-rows: auto auto minmax(0, 1fr) auto;",
      ".composer {\n  position: relative;\n  height: 100%;\n  min-height: 0;",
      ".composer[data-queue-mode=\"true\"]",
      ".composer[data-queue-mode=\"true\"] .draft-queue",
      "  .composer {\n    height: 100%;\n    min-height: 0;\n    align-content: stretch;\n    grid-template-rows: auto auto minmax(0, 1fr) auto;",
      "  .composer[data-queue-mode=\"true\"]",
      "box-shadow: 0 -8px 18px color-mix(in oklch, var(--ink), transparent 91%);",
      "box-shadow: 0 7px 16px color-mix(in oklch, var(--button-fill), transparent 88%);",
      "height: 100%;",
      "min-height: 0;",
      "max-height: 100%;",
      ".draft-editor-input-wrap {\n  grid-row: 2;\n  position: relative;",
      ".draft-syntax-highlight",
      "pointer-events: none;",
      "#markdown {\n  position: relative;\n  z-index: 1;",
      "color: var(--ink);",
      "caret-color: var(--ink);",
      ".draft-syntax-highlight {\n  position: absolute;\n  inset: 0;\n  color:",
      "display: none;",
      ".draft-token-heading",
      ".draft-token-image",
      ".draft-token-code",
      '.draft-inline-preview[data-preview-mode="read"]',
      ".draft-inline-preview",
      ".draft-editor-status",
      ".draft-editor-status > span",
      "--draft-content-font:",
      '"PingFang SC"',
      "font-family: var(--draft-content-font);",
      ".draft-editor-mode-toggle",
      ".draft-editor-toolbar button .editor-command-icon",
      "stroke-linecap: round;",
      "@media (max-width: 520px)",
      ".draft-editor-formatting {\n    overflow-x: visible;\n    flex-wrap: wrap;"
    ]) &&
    excludesAll(sidepanelCss, [
      "box-shadow: 0 -16px 30px rgba(15, 20, 25, 0.10);",
      "box-shadow: 0 10px 22px color-mix(in oklch, var(--button-fill), transparent 84%);",
      "min-height: min(720px, calc(100dvh - 104px));",
      "min-height: min(700px, calc(100dvh - 92px));",
      "height: var(--draft-editor-block-size);",
      "min-height: var(--draft-editor-block-size);",
      "max-height: var(--draft-editor-block-size);",
      ".panel.active {\n  min-height: 0;\n  display: grid;\n  align-self: start;",
      ".composer {\n  position: relative;\n  min-height: 0;",
      ".composer {\n  position: relative;\n  height: 100%;\n  min-height: 0;\n  align-self: stretch;\n  align-content: start;",
      "grid-template-rows: auto auto auto auto;",
      ".draft-editor-status span {\n",
      "#markdown {\n  position: relative;\n  z-index: 1;\n  color: transparent;",
      ".record-edit-dialog textarea {\n  position: relative;\n  z-index: 1;\n  color: transparent;"
    ]) &&
    excludesAll(sidepanelCss, [
      "font-family: ui-serif, Georgia, \"Times New Roman\", serif;"
    ]),
  "side panel should use a lightweight native textarea editor with MiniGFM read preview, one status-bar mode toggle, responsive controls, and adapter-based draft reads"
);
assert.ok(
  sidepanelText.includes("const isCompact = !value.trim() || (value.length < 420 && meaningfulLines <= 8 && !hasRichBlocks);") &&
    sidepanelHtml.includes('id="importHint" data-tone="ready" aria-hidden="true" hidden') &&
    sidepanelCss.includes(".import-hint[hidden]") &&
    sidepanelText.includes('return { hidden: true, tone: "ready", text: "" };') &&
    sidepanelText.includes("applyImportHint(hint)") &&
    sidepanelText.includes("els.importHint.hidden = hidden") &&
    sidepanelText.includes('els.importHint.setAttribute("aria-hidden", hidden ? "true" : "false")'),
  "short or empty drafts should stay compact and routine write readiness should not add a redundant button hint"
);
assert.ok(
  sidepanelHtml.includes('id="draftDropTarget"') &&
    sidepanelHtml.includes("Release anywhere in this panel to load or queue the draft."),
  "side panel should expose a stable content-area Markdown drop target"
);
assert.ok(
    sidepanelCss.includes(".draft-drop-target") &&
    sidepanelCss.includes(".composer.drag-active .draft-drop-target") &&
    sidepanelCss.includes(".composer.drag-active .actions") &&
    sidepanelCss.includes("color-mix(in oklch, var(--signal), var(--paper) 94%)") &&
    sidepanelCss.includes(".composer.drag-active .actions {\n  border-color: color-mix(in oklch, var(--line), var(--ink) 16%);\n  background: var(--paper);") &&
    sidepanelCss.includes("xposter-queue-item-enter") &&
    sidepanelCss.includes(".draft-queue-item[data-status=\"writing\"] .draft-queue-index") &&
    sidepanelText.includes("function markQueueItemsEntered") &&
    sidepanelText.includes('els.targetReady.textContent = localizeText(target)') &&
    sidepanelMessagesText.includes("Preparing Markdown, images, and the X editor.") &&
    sidepanelPatternsText.includes("Article written(?: in (.+))?") &&
    !sidepanelCss.includes(".composer.drag-active::before") &&
    !sidepanelCss.includes(".composer.drag-active::after"),
  "drag, queue, and readiness feedback should use real elements with restrained localized motion instead of fragile pseudo-elements"
);
assert.ok(
  sidepanelText.includes("const leftWindow = (event)") &&
    !sidepanelText.includes("let dragDepth"),
  "drop activation should not depend on fragile child-element drag depth"
);
assert.ok(
  sidepanelCss.includes("padding-right: max(14px, env(safe-area-inset-right));") &&
    sidepanelCss.includes("padding-left: max(14px, env(safe-area-inset-left));") &&
    sidepanelCss.includes(".record-edit-dialog textarea") &&
    sidepanelCss.includes(".record-edit-toolbar") &&
    sidepanelCss.includes(".record-edit-highlight") &&
    sidepanelCss.includes(".record-edit-preview") &&
    sidepanelCss.includes("list-style-position: outside;") &&
    sidepanelCss.includes("padding-inline-start: 1.35em;") &&
    sidepanelCss.includes(".record-edit-actions") &&
    sidepanelCss.includes("grid-template-columns: minmax(0, 1fr) auto auto;") &&
    sidepanelCss.includes(".record-edit-action-group") &&
    sidepanelCss.includes("grid-template-columns: 36px minmax(0, 1fr) minmax(0, 1fr);") &&
    sidepanelHtml.includes('id="recordEditToolbar"') &&
    sidepanelHtml.includes('id="recordEditHighlight"') &&
    sidepanelHtml.includes('id="recordEditPreview"') &&
    sidepanelHtml.includes('id="recordEditModeToggle"') &&
    sidepanelHtml.includes('id="recordEditStats"') &&
    sidepanelHtml.includes('data-record-action="editor-command"') &&
    sidepanelText.includes("els.recordEditTextarea?.addEventListener(\"input\", handleRecordEditorInput)") &&
    sidepanelText.includes("els.recordEditTextarea?.addEventListener(\"scroll\", syncRecordEditSyntaxScroll)") &&
    sidepanelText.includes("els.recordEditTextarea?.addEventListener(\"keydown\"") &&
    sidepanelText.includes("els.markdown.addEventListener(\"keydown\"") &&
    sidepanelText.includes("function normalizePreviewLists") &&
    sidepanelText.includes("stripOrderedPreviewListMarker(item)") &&
    sidepanelText.includes("applyTextareaCommand(button.dataset.editorCommand") &&
    !sidepanelCss.includes(".record-edit-sheet {\n    padding: 0;"),
  "record edit dialog should reuse Markdown syntax highlighting, formatting, preview, and a single stable action bar"
);
assert.ok(
  sidepanelHtml.includes('id="confettiOption"') &&
    sidepanelHtml.includes('id="successSoundOption"') &&
    sidepanelHtml.includes('id="successSoundStyle"') &&
    sidepanelHtml.includes("Show a brief celebration on the X page when X reports a completed write.") &&
    !sidepanelHtml.includes('id="successSoundVolume"') &&
    !sidepanelHtml.includes('id="successSoundVolumeValue"') &&
    !sidepanelHtml.includes('data-i18n="Volume"') &&
    !sidepanelHtml.includes('id="testSuccessFeedback"'),
  "settings should expose page celebration, sound, and sound style without volume or a feedback test control"
);
assert.ok(
  sidepanelText.includes("triggerSuccessFeedback(response.summary)") &&
    sidepanelText.includes("requestPageSuccessCelebration(summary)") &&
    sidepanelText.includes('type: "xposter:success-celebration"') &&
    sidepanelText.includes("colors: SUCCESS_CELEBRATION_COLORS") &&
    sidepanelText.includes("lastSuccessFeedbackKey"),
  "successful imports should request one celebration on the active X page"
);
assert.ok(
  sidepanelText.includes('return ["running", "parsed", "error"].includes(progress?.state);') &&
    !sidepanelText.includes('["running", "parsed", "complete", "error"].includes(latestProgress?.state)'),
  "completed progress should not keep the full live progress block visible"
);
assert.ok(
  sidepanelText.includes("scheduleRunSummaryCollapse(summary)") &&
    sidepanelText.includes('applyImportHint({ tone: "done", text: "Written. Review in X." })'),
  "clean successful imports should collapse bulky summary UI into a compact status hint"
);
assert.ok(
  sidepanelText.includes("shouldLogProgressEvent(eventName, payload)") &&
    sidepanelText.includes("return eventName === \"error\" || level === \"error\" || level === \"warn\";"),
  "routine progress and clean completion updates should not keep the activity panel open"
);
assert.ok(
  !sidepanelText.includes('log(batch ? "Batch draft writing started." : "Writing article started.")'),
  "starting a clean write should rely on the live progress strip instead of opening the activity panel"
);
assert.ok(
  !sidepanelHtml.includes("vendor/canvas-confetti.browser.min.js") &&
    !sidepanelText.includes("window.confetti.create") &&
    !sidepanelText.includes("fireSuccessConfetti") &&
    !sidepanelText.includes("successConfetti") &&
    !sidepanelCss.includes(".success-confetti-canvas") &&
    !sidepanelText.includes("testSuccessFeedback") &&
    includesAll(contentScriptText, [
      'const SUCCESS_CELEBRATION_ID = "__xposter_success_celebration__"',
      'const SUCCESS_CELEBRATION_STYLE_ID = "__xposter_success_celebration_style__"',
      "const SUCCESS_CELEBRATION_DURATION_MS = 3200",
      "const SUCCESS_CELEBRATION_PIECE_COUNT = 72",
      "function injectSuccessCelebrationStyle",
      "function showSuccessCelebration",
      "prefersReducedMotion()",
      "position: fixed;",
      "width: 100vw;",
      "height: 100dvh;",
      "animation: __xposter_success_piece 2600ms",
      "window.setTimeout(() => root.remove(), SUCCESS_CELEBRATION_DURATION_MS)",
      ".__xposter_success_mark",
      ".__xposter_success_piece",
      "prefers-reduced-motion: reduce",
      'message?.type === "xposter:success-celebration"'
    ]),
  "celebration should render on the X page through the content script, not side panel canvas confetti"
);
assert.ok(
  sidepanelText.includes("AudioContext") &&
    sidepanelText.includes("createOscillator") &&
    sidepanelText.includes("SUCCESS_SOUND_STYLES") &&
    sidepanelText.includes("SUCCESS_SOUND_VOLUME = 1") &&
    sidepanelText.includes("successSoundNotes") &&
    sidepanelText.includes("async function primeSuccessAudio()") &&
    sidepanelText.includes("async function previewSuccessFeedback()") &&
    sidepanelText.includes("await primeSuccessAudio();") &&
    sidepanelText.includes("previewSuccessFeedback()") &&
    !sidepanelText.includes("if (successFeedbackOptions.confetti) await requestPageSuccessCelebration();") &&
    !sidepanelText.includes("successSoundVolume") &&
    !sidepanelText.includes("successSoundVolumeValue") &&
    !sidepanelText.includes("Sound blocked"),
  "completion sound should use audible local Web Audio at fixed full volume, preview style changes without page celebration noise, unlock on write action, and keep settings free of test-only playback UI"
);
assert.ok(
  backgroundText.includes("REMOTE_IMAGE_RETRY_DELAYS_MS = [0, 700, 1800]") &&
    backgroundText.includes("isPrivateImageHost") &&
    backgroundText.includes("Unsupported image type"),
  "background image fetches should bound retries and reject private or non-image URLs"
);
assert.ok(
  sidepanelText.includes("scheduleAnalyzeDraft()") &&
    sidepanelText.includes("scheduleRecordHistoryRender()") &&
    sidepanelText.includes("scheduleSaveDraft()") &&
    sidepanelText.includes("DRAFT_ANALYZE_DELAY_MS"),
  "side panel should debounce expensive draft saves, analysis, and record search renders"
);
assert.ok(
  coverOnlyPlan.plan.some(
    (item) =>
      item.op.type === "image" &&
      item.op.coverOnly === true &&
      item.op.source === "https://images.example.test/path/cover.png"
  ),
  "frontmatter-only cover should create a temporary cover upload operation"
);
assert.ok(
  !coverOnlyPlan.plain.includes("![cover]"),
  "frontmatter-only cover placeholder should not add visible Markdown image text"
);

const readme = readText("README.md");
const readmeZh = readText("README.zh-CN.md");
const usageZh = readText("docs/usage.zh-CN.md");
const allPublicText = [
  "README.md",
  "README.zh-CN.md",
  "docs/usage.md",
  "docs/usage.zh-CN.md",
  "docs/privacy.md",
  "docs/privacy.zh-CN.md",
  "manifest.json",
  "sidepanel.js"
]
  .map(readText)
  .join("\n");

assert.ok(
  readme.includes("https://chromewebstore.google.com/detail/xposter/iimkimodgdjnnmdopeolboakhjmhfbbj"),
  "English README should recommend the Chrome Web Store listing"
);
assert.ok(readmeZh.includes("Chrome Web Store"), "Chinese README should mention Chrome Web Store");
assert.ok(usageZh.includes("添加至 Chrome"), "Chinese usage guide should explain store installation");
assert.ok(readmeZh.includes("https://x.com/xiaoxiaodong01"), "Chinese README should include author contact");
assert.ok(
  readme.includes("docs/images/buy-me-a-coffee-qr.png"),
  "English README should include the support QR code"
);
assert.ok(
  readmeZh.includes("docs/images/buy-me-a-coffee-qr.png"),
  "Chinese README should include the support QR code"
);
assert.ok(
  !/https:\/\/[^\s"']*cos\.ap-guangzhou\.myqcloud\.com/.test(allPublicText),
  "private image host must not be exposed"
);

console.log("xPoster smoke test passed");
