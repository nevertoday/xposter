const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const readJson = (relativePath) =>
  JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));

const manifest = readJson("manifest.json");
const pkg = readJson("package.json");
const defaultMessages = readJson("_locales/en/messages.json");
const manifestMessage = (value) => {
  const match = String(value || "").match(/^__MSG_([A-Za-z0-9_]+)__$/);
  if (!match) return value;
  return defaultMessages[match[1]]?.message || value;
};

assert.equal(manifest.manifest_version, 3, "manifest must be MV3");
assert.equal(manifest.default_locale, "en", "manifest must declare a default locale");
assert.equal(manifestMessage(manifest.name), "xPoster", "manifest name must resolve to xPoster");
assert.equal(pkg.version.replace(/\.0$/, ""), manifest.version, "package and manifest versions must match");
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
  "fixtures/live-x-smoke.md",
  "README.zh-CN.md",
  "docs/usage.md",
  "docs/usage.zh-CN.md",
  "docs/privacy.md",
  "docs/privacy.zh-CN.md",
  "docs/images/buy-me-a-coffee-qr.png",
  "vendor/canvas-confetti.browser.min.js",
  "vendor/canvas-confetti.LICENSE",
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
const fixture = fs.readFileSync(path.join(root, "fixtures/live-x-smoke.md"), "utf8");
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
const contentScriptText = fs.readFileSync(path.join(root, "src/content.js"), "utf8");
const backgroundText = fs.readFileSync(path.join(root, "src/background.js"), "utf8");
const mainWorldText = fs.readFileSync(path.join(root, "src/main-world.js"), "utf8");
const sidepanelText = fs.readFileSync(path.join(root, "sidepanel.js"), "utf8");
const sidepanelHtml = fs.readFileSync(path.join(root, "sidepanel.html"), "utf8");
const sidepanelCss = fs.readFileSync(path.join(root, "sidepanel.css"), "utf8");
const statusHelperStart = contentScriptText.indexOf("  function normalizeText");
const statusHelperEnd = contentScriptText.indexOf("  function showStatus");
const statusSandbox = {
  document: { body: {}, documentElement: {} },
  getComputedStyle: () => ({ backgroundColor: "rgb(18, 26, 34)" }),
  window: { matchMedia: () => ({ matches: false }) }
};

assert.ok(statusHelperStart >= 0 && statusHelperEnd > statusHelperStart, "status helper functions should be present");
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
   this.statusHelpers = { statusThemeFromPage, statusProgressForText, translateContentText, articleExportLabel };`,
  statusSandbox
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
  contentScriptText.includes("safeRuntimeSendMessage") &&
    contentScriptText.includes("Extension context invalidated. Reload the X Article tab after updating xPoster.") &&
    contentScriptText.includes("const sendMessage = chrome.runtime?.sendMessage?.bind(chrome.runtime);") &&
    !contentScriptText.includes("chrome.runtime\n      .sendMessage"),
  "content script runtime messages should not throw uncaught errors after extension reloads"
);
assert.ok(
  contentScriptText.includes("uploadDroppedImageUrl"),
  "content script should upload dropped web image URLs instead of only showing a drop hint"
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
    contentScriptText.includes("xPoster page drop target") &&
    contentScriptText.includes("function setDropHintProcessing") &&
    contentScriptText.includes("updateVisibleDropHintCopy") &&
    contentScriptText.includes('translateContentText("xPoster page drop target")') &&
    contentScriptText.includes("function isDropEventOverSurface(event, intent") &&
    contentScriptText.includes("function dropIntentForTransfer") &&
    contentScriptText.includes("function sidePanelMarkdownDropIntent") &&
    contentScriptText.includes('event.dataTransfer.dropEffect = intent === "article-outside" ? "none" : "copy"'),
  "X page drag feedback should use a stable editor-area mask with processing feedback"
);
assert.ok(
  contentScriptText.includes('if (sidePanelIntent === "sidepanel-queue") return sidePanelIntent;') &&
    contentScriptText.includes('if (isSingleMarkdownDrop(dataTransfer)) return "article";') &&
    contentScriptText.includes("const PENDING_ARTICLE_IMPORT_STORAGE_KEY") &&
    contentScriptText.includes("async function stageSingleMarkdownForArticle") &&
    contentScriptText.includes("async function importSingleMarkdownFileFromDrop") &&
    contentScriptText.includes("async function resumePendingArticleImport") &&
    contentScriptText.includes('safeRuntimeSendMessage({ type: "xposter:open-articles" })') &&
    contentScriptText.includes("function hasSingleUnknownFileItem") &&
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
    contentScriptText.includes('function markdownForArticleNode') &&
    contentScriptText.includes('navigator.clipboard.writeText(text)') &&
    contentScriptText.includes('link.download = fileName || articleFileName("")') &&
    contentScriptText.includes('await setArticleExportMode(button.dataset.exportMode)') &&
    contentScriptText.includes("signalArticleExportFeedback(root, \"done\")") &&
    contentScriptText.includes('main.textContent = translateContentText("MD")') &&
    contentScriptText.includes('main.title = title') &&
    contentScriptText.includes("width: 32px") &&
    contentScriptText.includes("opacity: 0.22") &&
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
assert.ok(
  mainWorldText.includes("uploadFilesToEditor"),
  "main-world bridge should hand dropped image files to X's own uploader"
);
assert.ok(
  mainWorldText.includes("const MEDIA_UPLOAD_BASE_TIMEOUT_MS = 90000") &&
    mainWorldText.includes("const MEDIA_UPLOAD_MAX_TIMEOUT_MS = 150000") &&
    mainWorldText.includes("X media upload took too long. X may be throttling this draft") &&
    mainWorldText.includes("timeoutMs") &&
    !mainWorldText.includes("Timed out waiting for X media upload") &&
    !mainWorldText.includes("Retrying image ${index + 1}"),
  "main-world image uploads should wait longer for X and return a recoverable timeout message"
);
assert.ok(
  contentScriptText.includes("image upload(s) timed out in X") &&
    sidepanelText.includes("image upload(s) timed out in X") &&
    sidepanelText.includes("X 上传图片等待太久"),
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
    contentScriptText.includes("function cancelActiveImport") &&
    contentScriptText.includes("function throwIfImportCancelled") &&
    mainWorldText.includes("throwIfCancelled") &&
    mainWorldText.includes('event.data.kind === "cancel"'),
  "article writes should expose a stop control that cancels the page upload loop"
);
assert.ok(
  sidepanelText.includes("const X_ARTICLE_MEDIA_SOFT_LIMIT = 25") &&
    sidepanelText.includes("const X_ARTICLE_MEDIA_HEADROOM_THRESHOLD = 20") &&
    sidepanelText.includes("X_ARTICLE_MEDIA_LIMIT_WARNING") &&
    sidepanelText.includes("X_ARTICLE_MEDIA_HEADROOM_NOTE") &&
    sidepanelText.includes("X_ARTICLE_MEDIA_CAPACITY_NOTE") &&
    sidepanelText.includes("function mediaUploadEstimate") &&
    sidepanelText.includes("mediaLimitWarningText") &&
    sidepanelText.includes("mediaHeadroomText") &&
    sidepanelText.includes("mediaCapacityText") &&
    sidepanelText.includes("nearSoftLimit") &&
    sidepanelText.includes("X Article media note") &&
    sidepanelText.includes("Image plan: {count}/25") &&
    sidepanelText.includes("Split the draft") &&
    sidepanelText.includes("remove images"),
  "draft preflight should show gentle media capacity before X rejects Article media beyond the verified 25-image Article limit"
);
assert.ok(
  sidepanelText.includes('options: importOptionsPayload()'),
  "side panel import messages should include saved title and cover options"
);
assert.ok(
  sidepanelHtml.includes('id="articleExportOptions"') &&
    sidepanelHtml.includes('id="articleExportOption" checked') &&
    sidepanelHtml.includes("Show Markdown export button") &&
    sidepanelText.includes('const STORAGE_ARTICLE_EXPORT_SETTINGS = "xposter_article_export_settings"') &&
    sidepanelText.includes("let articleExportOptions = { enabled: true, mode: \"copy\" }") &&
    sidepanelText.includes("function restoreArticleExportOptions") &&
    sidepanelText.includes("setArticleExportOptions({") &&
    sidepanelText.includes("restoreArticleExportOptions();"),
  "settings should expose a default-on article Markdown export toggle"
);
assert.ok(
  !sidepanelText.includes('record-icon-action is-disabled'),
  "record history should not render a disabled open-link action when no URL is saved"
);
assert.ok(
  sidepanelText.includes('class="record-file-name"'),
  "record history should render source file names in their own metadata line"
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
  "record history should expose clear-all as quiet metadata action with inline confirmation beside the draft count"
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
  sidepanelText.includes("function buildPublishRecordSummary") &&
    sidepanelText.includes("xPoster publish record") &&
    sidepanelText.includes("Publish summary copied.") &&
    sidepanelText.includes("Draft saved") &&
    sidepanelText.includes("Write result"),
  "copying the saved result should produce a readable publish summary instead of internal proof JSON"
);
assert.ok(
  sidepanelText.includes("function showQueuedDraftAdded") &&
    sidepanelText.includes("new draft") &&
    sidepanelText.includes("total in queue"),
  "queue feedback should explicitly tell users when drafts are added"
);
assert.ok(
  sidepanelText.includes('parts.push(parsed.title ? "Title found" : "No title")') &&
    sidepanelText.includes('pluralizeUnit(resolvedCounts.image || 0, "image")') &&
    sidepanelText.includes('pluralizeUnit(resolvedCounts.code || 0, "code block")') &&
    sidepanelText.includes('`${formattedLength} chars`') &&
    sidepanelText.includes("Web images: ${remoteCount}") &&
    sidepanelText.includes("Images: ${imageCount}") &&
    !sidepanelText.includes("Unreachable images stay as links.") &&
    !sidepanelText.includes("draftTargetStateText") &&
    !sidepanelHtml.includes('id="draftTargetState"') &&
    sidepanelCss.includes("min-height: 28px;") &&
    sidepanelCss.includes("font-weight: 640;"),
  "recognized draft summary should stay compact and focused on title, images, and code blocks"
);
assert.ok(
  contentScriptText.includes("message.options || {}"),
  "content script should apply title and cover options sent by the side panel"
);
assert.ok(
  sidepanelHtml.includes("https://github.com/nevertoday/xposter"),
  "settings should link to the GitHub project page"
);
assert.ok(
  sidepanelHtml.includes("https://x.com/xiaoxiaodong01"),
  "settings should link to the author X profile"
);
assert.ok(
  sidepanelHtml.includes("vendor/canvas-confetti.browser.min.js"),
  "side panel should load packaged canvas-confetti locally"
);
assert.ok(
  sidepanelHtml.includes('id="draftDropTarget"') &&
    sidepanelHtml.includes("Release anywhere in this panel to load or queue the draft."),
  "side panel should expose a stable content-area Markdown drop target"
);
assert.ok(
  sidepanelCss.includes(".draft-drop-target") &&
    sidepanelCss.includes(".composer.drag-active .draft-drop-target") &&
    sidepanelCss.includes("xposter-queue-item-enter") &&
    sidepanelCss.includes(".draft-queue-item[data-status=\"writing\"] .draft-queue-state::before") &&
    sidepanelText.includes("function markQueueItemsEntered") &&
    sidepanelText.includes('els.targetReady.textContent = localizeText(target)') &&
    sidepanelText.includes('return localizeText("Preparing Markdown, images, and the X editor.")') &&
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
  sidepanelHtml.includes('id="confettiOption"') &&
    sidepanelHtml.includes('id="successSoundOption"') &&
    sidepanelHtml.includes('id="successSoundStyle"') &&
    sidepanelHtml.includes('id="successSoundVolume"') &&
    sidepanelHtml.includes('value="75"') &&
    sidepanelHtml.includes('id="testSuccessFeedback"'),
  "settings should expose confetti, sound, sound style, volume, and feedback test controls"
);
assert.ok(
  sidepanelText.includes("triggerSuccessFeedback(response.summary)") &&
    sidepanelText.includes("lastSuccessFeedbackKey"),
  "successful imports should trigger feedback once"
);
assert.ok(
  sidepanelText.includes('return ["running", "parsed", "error"].includes(progress?.state);') &&
    !sidepanelText.includes('["running", "parsed", "complete", "error"].includes(latestProgress?.state)'),
  "completed progress should not keep the full live progress block visible"
);
assert.ok(
  sidepanelText.includes("scheduleRunSummaryCollapse(summary)") &&
    sidepanelText.includes('setLocalizedText(els.importHint, "Written. Review in X.")'),
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
  sidepanelText.includes("window.confetti.create") &&
    sidepanelText.includes("useWorker: false") &&
    sidepanelText.includes("testSuccessFeedback"),
  "confetti should run from a packaged local canvas without blob workers"
);
assert.ok(
  sidepanelText.includes("AudioContext") &&
    sidepanelText.includes("createOscillator") &&
    sidepanelText.includes("SUCCESS_SOUND_STYLES") &&
    sidepanelText.includes("SUCCESS_SOUND_DEFAULT_VOLUME") &&
    sidepanelText.includes("successSoundNotes") &&
    sidepanelText.includes("async function primeSuccessAudio()") &&
    sidepanelText.includes("await primeSuccessAudio();") &&
    sidepanelText.includes("Sound blocked"),
  "completion sound should use audible local Web Audio, unlock on user action, and report blocked playback"
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

const readText = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
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
