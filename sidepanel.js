(() => {
  const shared = window.xPosterShared;
  const i18n = window.xPosterI18n;
  const IMPORT_ICON_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v3H4V4Zm0 5h10v3H4V9Zm0 5h8v3H4v-3Zm13.5-.7V9h2v4.3l1.6-1.6 1.4 1.4-3.5 3.5-3.5-3.5 1.4-1.4 1.6 1.6ZM17 18h5v2h-5v-2Z"/></svg>';
  const els = {
    markdown: document.getElementById("markdown"),
    pageState: document.getElementById("pageState"),
    quickSteps: document.getElementById("quickSteps"),
    workflowRail: document.getElementById("workflowRail"),
    liveGate: document.getElementById("liveGate"),
    liveGatePrimary: document.getElementById("liveGatePrimary"),
    liveGateDetail: document.getElementById("liveGateDetail"),
    liveGateScore: document.getElementById("liveGateScore"),
    liveGateMeterBar: document.getElementById("liveGateMeterBar"),
    liveGateChips: document.getElementById("liveGateChips"),
    nextAction: document.getElementById("nextAction"),
    nextActionTitle: document.getElementById("nextActionTitle"),
    nextActionDetail: document.getElementById("nextActionDetail"),
    nextActionButton: document.getElementById("nextActionButton"),
    commandDock: document.querySelector(".command-dock"),
    dockGate: document.getElementById("dockGate"),
    dockDetail: document.getElementById("dockDetail"),
    dockMeterBar: document.getElementById("dockMeterBar"),
    dockCheck: document.getElementById("dockCheck"),
    dockImport: document.getElementById("dockImport"),
    dockEvidence: document.getElementById("dockEvidence"),
    dockJumps: document.getElementById("dockJumps"),
    advancedDiagnostics: document.getElementById("advancedDiagnostics"),
    evidenceDetails: document.getElementById("evidenceDetails"),
    titleMetric: document.getElementById("titleMetric"),
    imageMetric: document.getElementById("imageMetric"),
    tableMetric: document.getElementById("tableMetric"),
    tweetMetric: document.getElementById("tweetMetric"),
    targetReady: document.getElementById("targetReady"),
    editorReady: document.getElementById("editorReady"),
    vaultReady: document.getElementById("vaultReady"),
    inspector: document.querySelector(".inspector"),
    targetContextPanel: document.getElementById("targetContextPanel"),
    targetContextMeta: document.getElementById("targetContextMeta"),
    targetContextState: document.getElementById("targetContextState"),
    targetContextRoute: document.getElementById("targetContextRoute"),
    targetContextArticle: document.getElementById("targetContextArticle"),
    targetContextTitle: document.getElementById("targetContextTitle"),
    targetContextSample: document.getElementById("targetContextSample"),
    issueQueueMeta: document.getElementById("issueQueueMeta"),
    issueQueueList: document.getElementById("issueQueueList"),
    conversionMapMeta: document.getElementById("conversionMapMeta"),
    conversionMapList: document.getElementById("conversionMapList"),
    importLedgerMeta: document.getElementById("importLedgerMeta"),
    importLedgerList: document.getElementById("importLedgerList"),
    recordsPanel: document.getElementById("recordsPanel"),
    recordsEmpty: document.getElementById("recordsEmpty"),
    recordHistory: document.getElementById("recordHistory"),
    recordHistoryMeta: document.getElementById("recordHistoryMeta"),
    recordSearchInput: document.getElementById("recordSearchInput"),
    recordSearchSummary: document.getElementById("recordSearchSummary"),
    recordHistoryList: document.getElementById("recordHistoryList"),
    recordEditSheet: document.getElementById("recordEditSheet"),
    recordEditTitle: document.getElementById("recordEditTitle"),
    recordEditMeta: document.getElementById("recordEditMeta"),
    recordEditTextarea: document.getElementById("recordEditTextarea"),
    recordEditPrimaryLabel: document.getElementById("recordEditPrimaryLabel"),
    recordEditWriteButton: document.getElementById("recordEditWriteButton"),
    draftQueue: document.getElementById("draftQueue"),
    draftQueueMeta: document.getElementById("draftQueueMeta"),
    draftQueueList: document.getElementById("draftQueueList"),
    addDraft: document.getElementById("addDraft"),
    clearRecordHistory: document.getElementById("clearRecordHistory"),
    recordClearConfirm: document.getElementById("recordClearConfirm"),
    cancelRecordClear: document.getElementById("cancelRecordClear"),
    confirmRecordClear: document.getElementById("confirmRecordClear"),
    reviewMeta: document.getElementById("reviewMeta"),
    reviewList: document.getElementById("reviewList"),
    importDraft: document.getElementById("importDraft"),
    importHint: document.getElementById("importHint"),
    draftBrief: document.getElementById("draftBrief"),
    draftRecognized: document.getElementById("draftRecognized"),
    openArticles: document.getElementById("openArticles"),
    loadFile: document.getElementById("loadFile"),
    loadSmoke: document.getElementById("loadSmoke"),
    pickVault: document.getElementById("pickVault"),
    pickVaultSettings: document.getElementById("pickVaultSettings"),
    clearVault: document.getElementById("clearVault"),
    clearVaultSettings: document.getElementById("clearVaultSettings"),
    vaultState: document.getElementById("vaultState"),
    vaultDetail: document.getElementById("vaultDetail"),
    vaultSettingsText: document.getElementById("vaultSettingsText"),
    activityLog: document.getElementById("activityLog"),
    previewTitle: document.getElementById("previewTitle"),
    previewMeta: document.getElementById("previewMeta"),
    previewBody: document.getElementById("previewBody"),
    planReadiness: document.getElementById("planReadiness"),
    planBreakdown: document.getElementById("planBreakdown"),
    planSteps: document.getElementById("planSteps"),
    preflightMeta: document.getElementById("preflightMeta"),
    preflightList: document.getElementById("preflightList"),
    runPreflight: document.getElementById("runPreflight"),
    timelineMeta: document.getElementById("timelineMeta"),
    timelineList: document.getElementById("timelineList"),
    liveProgress: document.getElementById("liveProgress"),
    liveProgressState: document.getElementById("liveProgressState"),
    liveProgressBar: document.getElementById("liveProgressBar"),
    liveProgressTitle: document.getElementById("liveProgressTitle"),
    liveProgressDetail: document.getElementById("liveProgressDetail"),
    cancelImport: document.getElementById("cancelImport"),
    recoveryPanel: document.getElementById("recoveryPanel"),
    recoveryMeta: document.getElementById("recoveryMeta"),
    recoveryState: document.getElementById("recoveryState"),
    recoveryList: document.getElementById("recoveryList"),
    runSummary: document.getElementById("runSummary"),
    summaryMessage: document.getElementById("summaryMessage"),
    summaryImages: document.getElementById("summaryImages"),
    summaryBlocks: document.getElementById("summaryBlocks"),
    summaryTitle: document.getElementById("summaryTitle"),
    summaryCover: document.getElementById("summaryCover"),
    summaryElapsed: document.getElementById("summaryElapsed"),
    liveResultMeta: document.getElementById("liveResultMeta"),
    liveResultList: document.getElementById("liveResultList"),
    resetLiveResult: document.getElementById("resetLiveResult"),
    liveRunbookMeta: document.getElementById("liveRunbookMeta"),
    liveRunbookList: document.getElementById("liveRunbookList"),
    focusRunbook: document.getElementById("focusRunbook"),
    draftDropStatus: document.getElementById("draftDropStatus"),
    draftDropTarget: document.getElementById("draftDropTarget"),
    draftDropDismiss: document.getElementById("draftDropDismiss"),
    proofDeckMeta: document.getElementById("proofDeckMeta"),
    proofDeckList: document.getElementById("proofDeckList"),
    completionAuditMeta: document.getElementById("completionAuditMeta"),
    completionAuditList: document.getElementById("completionAuditList"),
    draftPanel: document.getElementById("draftPanel"),
    previewPanel: document.getElementById("previewPanel"),
    preflightPanel: document.getElementById("preflightPanel"),
    verificationPanel: document.getElementById("verificationPanel"),
    localImagesPanel: document.getElementById("localImagesPanel"),
    liveResultPanel: document.getElementById("liveResultPanel"),
    extensionPath: document.getElementById("extensionPath"),
    copyExtensionPath: document.getElementById("copyExtensionPath"),
    copyProofDeck: document.getElementById("copyProofDeck"),
    evidencePanel: document.getElementById("evidencePanel"),
    evidenceMeta: document.getElementById("evidenceMeta"),
    evidenceText: document.getElementById("evidenceText"),
    copyEvidence: document.getElementById("copyEvidence"),
    copyEvidencePackage: document.getElementById("copyEvidencePackage"),
    downloadEvidencePackage: document.getElementById("downloadEvidencePackage"),
    languageSelect: document.getElementById("languageSelect"),
    themeChoice: document.getElementById("themeChoice"),
    metadataOptions: document.getElementById("metadataOptions"),
    importTitleOption: document.getElementById("importTitleOption"),
    importCoverOption: document.getElementById("importCoverOption"),
    articleExportOptions: document.getElementById("articleExportOptions"),
    articleExportOption: document.getElementById("articleExportOption"),
    successFeedbackOptions: document.getElementById("successFeedbackOptions"),
    confettiOption: document.getElementById("confettiOption"),
    successSoundOption: document.getElementById("successSoundOption"),
    successSoundStyle: document.getElementById("successSoundStyle"),
    successSoundVolume: document.getElementById("successSoundVolume"),
    testSuccessFeedback: document.getElementById("testSuccessFeedback"),
    extensionVersion: document.getElementById("extensionVersion"),
    activityPanel: document.getElementById("activityPanel")
  };

  const STORAGE_DRAFT = "xposter_sidepanel_draft";
  const STORAGE_LIVE_RESULT = "xposter_live_result_checks";
  const STORAGE_LANGUAGE = "xposter_language";
  const STORAGE_THEME = "xposter_theme";
  const STORAGE_IMPORT_OPTIONS = "xposter_import_options";
  const STORAGE_ARTICLE_EXPORT_SETTINGS = "xposter_article_export_settings";
  const STORAGE_SUCCESS_FEEDBACK = "xposter_success_feedback";
  const STORAGE_RECORD_HISTORY = "xposter_publish_record_history";
  const STORAGE_DRAFT_QUEUE = "xposter_publish_queue";
  const MAX_RECORD_HISTORY = 30;
  const MAX_DRAFT_QUEUE = 24;
  const MAX_DRAFT_QUEUE_STORAGE_BYTES = 4 * 1024 * 1024;
  const MAX_DRAFT_QUEUE_ITEM_BYTES = 512 * 1024;
  const MAX_RECORD_MARKDOWN_CHARS = 120000;
  const X_ARTICLE_MEDIA_SOFT_LIMIT = 25;
  const X_ARTICLE_MEDIA_LIMIT_WARNING =
    "X Articles media note: xPoster has verified X Articles can accept up to 25 image uploads in one article. This draft has {count} media upload items; extra images may be rejected by X.";
  const MARKDOWN_FILE_RE = /\.(md|markdown|mdown|mkd|txt)$/i;
  const MARKDOWN_FILE_ACCEPT = ".md,.markdown,.mdown,.mkd,.txt,text/markdown,text/plain";
  const MARKDOWN_TRANSFER_MIME_RE = /^(text\/markdown|text\/plain|application\/octet-stream)$/i;
  const MARKDOWN_LOAD_ERROR_TITLE = "Could not load Markdown";
  const MARKDOWN_LOAD_ERROR_DETAIL = "Try a .md, .markdown, .txt file, or plain Markdown text.";
  const NO_NEW_DRAFTS_DETAIL = "No new Markdown drafts were added.";
  const DRAFT_SAVE_DELAY_MS = 220;
  const DRAFT_ANALYZE_DELAY_MS = 140;
  const RECORD_SEARCH_DELAY_MS = 120;
  const THEME_MODES = new Set(["system", "light", "dark"]);
  const SUCCESS_SOUND_DEFAULT_VOLUME = 0.75;
  const SUCCESS_SOUND_PRESETS = {
    soft: {
      master: 0.18,
      notes: [
        { frequency: 523.25, start: 0, duration: 0.18, type: "sine", gain: 0.48 },
        { frequency: 659.25, start: 0.09, duration: 0.22, type: "sine", gain: 0.46 },
        { frequency: 783.99, start: 0.18, duration: 0.26, type: "sine", gain: 0.4 }
      ]
    },
    bell: {
      master: 0.17,
      notes: [
        { frequency: 587.33, start: 0, duration: 0.34, type: "sine", gain: 0.42 },
        { frequency: 880, start: 0.055, duration: 0.46, type: "triangle", gain: 0.3 }
      ]
    },
    pop: {
      master: 0.16,
      notes: [
        { frequency: 698.46, start: 0, duration: 0.1, type: "triangle", gain: 0.5 },
        { frequency: 1046.5, start: 0.08, duration: 0.14, type: "sine", gain: 0.38 }
      ]
    }
  };
  const SUCCESS_SOUND_STYLES = new Set(Object.keys(SUCCESS_SOUND_PRESETS));
  const SUCCESS_CONFETTI_COLORS = ["#0f1419", "#536471", "#1d9bf0", "#00ba7c", "#cfd9de"];
  const EXTENSION_VERSION =
    typeof chrome !== "undefined" && chrome.runtime?.getManifest
      ? chrome.runtime.getManifest().version
      : "dev";
  const CONTENT_VERSION_UNKNOWN = "unknown";
  const EXTENSION_PATH = "the folder you cloned or downloaded";

  if (els.extensionVersion) els.extensionVersion.textContent = `v${EXTENSION_VERSION}`;
  const LIVE_SMOKE_FIXTURE = `---
title: xPoster live smoke test
cover: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAACqUlEQVR4nO3ZMXLUQBRF0dmHA7wDb4uMXXoBRN4JVRBAOXBiPFhC6n6/9Y+qbt6td2YS3W4ez8jn188fv3Ws9IabnvRL6lh6c6MXyvCaAyF9QYUQpC+lIIT0RRREkL6AggjSB1cQQfrACiNIH1ZBAOmDKoggfUCFEaQPpyCA9MEURpA+lABQCkD6QAojSB9GAAgAXR7A45eH+MU1GcDr6PdKv4TOxceHIN9QAFvGhwAAAAAA4HIA9owPAQAAAAAAAAVeSLcAaB4AzSsF4OX7c8sAaA4gCQGAYgHQPAAEQOf8AzQPgMbNHh+AIiWGLwkg+SK6BkDzAGgeAM0DoHkANA+A5gHQPACaB0DzAGgeAM0DoHmlAKS/yq32JQ+AQqWHBKBA6TEBAACAdOlBATA+AAAAYHwADL8cgPTL6BgAk3v69jV+BgACo98rfTYAQsNXgQBAgfGTCAAAAIAK46cQAAAAAAAAUGL8BAIAAAAAAAAAqAAg/WXvjK97ACwOYA+Ej8YaAWAkCgB2IvhsuLMAzPqHAGAjgDOGPTsAJiFIDz0SAQAb/gHSIwPg1z8MAQAL//oBGDg8AAEAI85xpPSwMxAAcAEER+4HAAAAAADAsgiO3g0AAABYFcEZ9wJgUQRn3QmABRGceR8AFkNw9l0AWAjBiHsAsAiCUXcAYAEEI88PQHEEo88+DMBeBOkRKyKYcW4AiiKYdWYACiKYed6hALYiSI9WCcHss97enhSC9FiVEMTGHw3gPYb0OBURJM4XAdCxasMDEMaQPgMAAkDvAEDQq7/GB6BXADTvQwAQ9Oju+AD06J8AILh2n44PwXXbPD4A12wXAAiu1e7xIbhO/z0+BOt3eHwI1u208UFYqyHDQ7BGw8cHoWZTh4ehRunNNz3pl3SFRu7zB/oxkFuyiUIVAAAAAElFTkSuQmCC
---

# This heading should become body content only if title parsing fails

This paragraph checks **bold**, *italic*, ~~strikethrough~~, inline \`code\`, and [a link](https://example.com).

> This quote checks blockquote import.

- First unordered item
- Second unordered item

1. First ordered item
2. Second ordered item

![cover pixel](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAACqUlEQVR4nO3ZMXLUQBRF0dmHA7wDb4uMXXoBRN4JVRBAOXBiPFhC6n6/9Y+qbt6td2YS3W4ez8jn188fv3Ws9IabnvRL6lh6c6MXyvCaAyF9QYUQpC+lIIT0RRREkL6AggjSB1cQQfrACiNIH1ZBAOmDKoggfUCFEaQPpyCA9MEURpA+lABQCkD6QAojSB9GAAgAXR7A45eH+MU1GcDr6PdKv4TOxceHIN9QAFvGhwAAAAAA4HIA9owPAQAAAAAAAAVeSLcAaB4AzSsF4OX7c8sAaA4gCQGAYgHQPAAEQOf8AzQPgMbNHh+AIiWGLwkg+SK6BkDzAGgeAM0DoHkANA+A5gHQPACaB0DzAGgeAM0DoHmlAKS/yq32JQ+AQqWHBKBA6TEBAACAdOlBATA+AAAAYHwADL8cgPTL6BgAk3v69jV+BgACo98rfTYAQsNXgQBAgfGTCAAAAIAK46cQAAAAAAAAUGL8BAIAAAAAAAAAqAAg/WXvjK97ACwOYA+Ej8YaAWAkCgB2IvhsuLMAzPqHAGAjgDOGPTsAJiFIDz0SAQAb/gHSIwPg1z8MAQAL//oBGDg8AAEAI85xpPSwMxAAcAEER+4HAAAAAADAsgiO3g0AAABYFcEZ9wJgUQRn3QmABRGceR8AFkNw9l0AWAjBiHsAsAiCUXcAYAEEI88PQHEEo88+DMBeBOkRKyKYcW4AiiKYdWYACiKYed6hALYiSI9WCcHss97enhSC9FiVEMTGHw3gPYb0OBURJM4XAdCxasMDEMaQPgMAAkDvAEDQq7/GB6BXADTvQwAQ9Oju+AD06J8AILh2n44PwXXbPD4A12wXAAiu1e7xIbhO/z0+BOt3eHwI1u208UFYqyHDQ7BGw8cHoWZTh4ehRunNNz3pl3SFRu7zB/oxkFuyiUIVAAAAAElFTkSuQmCC)

| Capability | Expected result |
| :--- | :--- |
| Markdown table | Rendered as an uploaded image |
| Marker cleanup | No \`__XPOSTER_\` text remains |

https://x.com/Interior/status/463440424141459456

\`\`\`js
console.log("xPoster live smoke");
\`\`\`

---

Final paragraph after the divider.`;
const EXAMPLE_DRAFT = `---
title: Example X Article
---

# How I draft with Markdown

I write the article first, then use xPoster to move it into X Articles.

## What this draft includes

- Headings
- Lists
- Links
- Tables

| Step | Result |
| :--- | :--- |
| Paste Markdown | xPoster previews the structure |
| Open X Articles | xPoster checks the editor |
| Import | The article is filled in X |

https://x.com/Interior/status/463440424141459456

\`\`\`js
console.log("Example code block");
\`\`\``;
  const EXAMPLE_DRAFT_ZH = `---
title: 示例 X 文章
---

# 我如何用 Markdown 写长文

我先在熟悉的编辑器里写完整篇文章，再用 xPoster 导入到 X Articles。

## 这份草稿包含

- 标题
- 列表
- 链接
- 表格

| 步骤 | 结果 |
| :--- | :--- |
| 粘贴 Markdown | xPoster 会先预览文章结构 |
| 打开 X 文章 | xPoster 检查当前编辑器 |
| 导入 | 内容会填入 X 文章草稿 |

https://x.com/Interior/status/463440424141459456

\`\`\`js
console.log("示例代码块");
\`\`\``;
  let latestParsed = null;
  let latestCounts = shared.segmentCounts([]);
  let latestPageStatus = null;
  let latestDiagnostics = null;
  let latestEvidence = null;
  let recordHistory = [];
  let draftQueue = [];
  let activeQueueItemId = null;
  let recordSearchQuery = "";
  let activeRecordEditorId = null;
  let activeDraftEditor = null;
  let liveResultChecks = {};
  let currentNextAction = null;
  let targetLock = null;
  let latestProgress = createLiveProgressState();
  let currentLanguage = preferredLanguage();
  let activeDraftRecordId = null;
  let activeDraftFingerprint = null;
  let activeDraftFinalized = false;
  let draftInputHistoryTimer = null;
  let draftSaveTimer = null;
  let draftAnalyzeTimer = null;
  let recordSearchTimer = null;
  let suppressNextTypedHistory = false;
  let activeWriteQueueItemId = null;
  let queueMotionTimer = null;
  let animatedQueueItemIds = new Set();
  let batchWriting = false;
  let importCancelRequested = false;
  let importOptions = { setTitle: true, setCover: true };
  let successFeedbackOptions = { confetti: true, sound: true, soundStyle: "soft", volume: SUCCESS_SOUND_DEFAULT_VOLUME };
  let articleExportOptions = { enabled: true, mode: "copy" };
  let successAudioContext = null;
  let successConfetti = null;
  let lastSuccessFeedbackKey = "";
  let runSummaryCollapseTimer = null;
  let remoteImageAccessStatus = { origins: [], available: [], missing: [], checkedAt: null };
  let remoteImageProbeStatus = { state: "idle", total: 0, ok: 0, fail: 0, results: [], checkedAt: null };

  const ZH_TEXT = new Map(
    Object.entries({
      "Markdown to X Articles": "Markdown 导入 X 文章",
      "Import Markdown to X Articles": "把 Markdown 草稿导入 X 文章",
      "Write Markdown to X Article": "把 Markdown 写入 X 文章",
      "Paste Markdown, then write it into the current or new X Article.": "粘贴 Markdown，然后写入当前或新建的 X 文章。",
      "Write workflow": "写入流程",
      "Writing progress meter": "写入进度",
      "Put your draft here first. xPoster shows the next step and never publishes for you.": "先把草稿放进来。xPoster 会告诉你下一步，不会替你发布。",
      "v...": "v...",
      "Installed version": "当前版本",
      "Use this number to confirm Chrome has reloaded the newest xPoster build.": "用这个版本号确认 Chrome 是否已重载最新的 xPoster 构建。",
      "Move Markdown into X Articles": "把 Markdown 放进 X 文章",
      "Paste Markdown into X Articles": "把 Markdown 粘贴进 X 文章",
      "Paste a draft, open the article, then import. xPoster never publishes for you.": "粘贴草稿，打开文章，然后导入。xPoster 不会替你发布。",
      Checking: "检查中",
      "Checking X": "正在识别 X",
      "Open X Articles entry": "打开 X 文章入口",
      "Not on X": "未在 X 页面",
      "Refresh X": "刷新 X 页面",
      "Old importer active": "旧脚本仍在运行",
      "Editor ready": "编辑器就绪",
      "X Articles ready": "X 文章页就绪",
      "Not an article page": "不是文章页",
      "Not open": "未打开",
      Language: "语言",
      "Choose the side panel language.": "选择侧边栏语言。",
      "Start here": "从这里开始",
      "Move a Markdown draft into X Article": "把 Markdown 草稿导入 X 文章",
      "Paste, check, import": "粘贴、检查、导入",
      "Paste or load a draft. xPoster shows the next safe step and keeps the technical checks out of your way unless something needs attention.": "粘贴或加载草稿。xPoster 会显示下一步，只有需要处理时才展示技术检查。",
      "Current Markdown draft": "当前 Markdown 草稿",
      "No draft selected": "未选择草稿",
      "Paste, choose, or drop Markdown to prepare an article.": "粘贴、选择或拖入 Markdown 来准备文章。",
      "Add or drop Markdown": "添加或拖入 Markdown",
      "Use Add draft, choose a file, or drop .md files here.": "粘贴 Markdown、选择文件，或把 .md 文件拖到这里。",
      "Paste Markdown here, choose a file, or drop .md files.": "在这里粘贴 Markdown、选择文件，或拖入 .md 文件。",
      "Release to load it.": "松开后载入草稿。",
      "Reading dropped Markdown.": "正在读取拖入的 Markdown。",
      "Reading file...": "正在读取文件...",
      "Pending drafts": "待发布草稿",
      "One list: select a draft, then write it.": "一个列表：选中草稿，然后写入。",
      "Click a draft to edit.": "点击草稿即可编辑。",
      "No pending drafts": "暂无待发布草稿",
      "Add one draft or drop Markdown files here.": "粘贴一篇草稿，或把 Markdown 文件拖到这里。",
      "Create draft": "新建草稿",
      "Edit draft": "编辑草稿",
      "Draft actions": "草稿操作",
      "Save draft": "保存草稿",
      "Save only": "仅保存",
      "Write this draft": "写入这篇",
      "Write to X draft": "写入到 X 草稿",
      "Writing to X draft...": "正在写入 X 草稿...",
      "Write all drafts": "批量写入",
      "Writing all...": "正在批量写入...",
      "Writing queued drafts one by one.": "正在逐篇写入队列草稿。",
      "Queued drafts are written one by one. Each successful draft leaves the list.": "队列草稿会逐篇写入。成功写入后会从列表移除。",
      "Stop": "停止",
      "Stopping...": "正在停止...",
      "Stop requested. xPoster will stop before the next upload step.": "已请求停止。xPoster 会在下一个上传步骤前停下。",
      "Writing stopped by user.": "写入已停止。",
      Stopped: "已停止",
      "Stop request failed: active X tab did not respond": "停止请求失败：当前 X 标签页没有响应",
      [X_ARTICLE_MEDIA_LIMIT_WARNING]: "X 文章媒体提醒：xPoster 实测 X 文章单篇最多可接收 25 个图片上传项。这篇草稿有 {count} 个媒体上传项；超出的图片可能会被 X 拒绝。",
      "X Article media note": "X 文章媒体提醒",
      "Review before writing": "写入前确认",
      "Focus the Markdown editor below.": "光标已放到下面的 Markdown 编辑框。",
      "Review queue": "检查队列",
      "Write queue": "写入队列",
      "Write all drafts or edit one.": "批量写入，或打开某一篇单独编辑。",
      "Write queued drafts": "写入队列草稿",
      "Ready to write queued drafts one by one.": "可以逐篇写入队列草稿。",
      "Batch draft writing started.": "开始批量写入草稿。",
      "Queued draft not found": "未找到队列草稿",
      "Markdown updated": "Markdown 已更新",
      "Markdown draft updated.": "Markdown 草稿已更新。",
      "Queued Markdown copied.": "已复制队列中的 Markdown。",
      "Queued Markdown updated.": "队列中的 Markdown 已更新。",
      "Put your draft in the box below. xPoster shows the next step and will not write to X until you click Import.": "把草稿放进下面的输入框。xPoster 会显示下一步；只有你点击导入时才会写入 X。",
      "Import in three steps": "三步完成导入",
      "Three-step import": "三步导入",
      "Paste Markdown, then import": "先粘贴 Markdown，再导入",
      "Paste a Markdown draft, open an X Article, then let xPoster move the content for you.": "粘贴 Markdown 草稿，打开一篇 X 文章，然后让 xPoster 帮你搬过去。",
      "Add your draft, check the X editor, then import and review the article.": "放入草稿，检查 X 编辑器，然后导入并检查文章。",
      "Put your draft here first. xPoster will guide the X Article check and import after that.": "先把草稿放进来。之后 xPoster 会引导你检查 X 文章并导入。",
      "Add draft": "添加 Markdown",
      "Add your Markdown": "放入 Markdown",
      "Add your draft": "放入草稿",
      "Paste Markdown": "粘贴 Markdown",
      "Add a draft, choose a .md file, or use Example to try the workflow first.": "粘贴 Markdown、选择 .md 文件，或用样例先试一遍流程。",
      "Paste here or choose a .md file.": "在这里粘贴，或选择 .md 文件。",
      "Paste text or choose a Markdown file.": "粘贴文字或选择 Markdown 文件。",
      "Paste text or choose a .md file.": "粘贴文字或选择 .md 文件。",
      "Paste a draft or load a Markdown file.": "粘贴草稿或加载 Markdown 文件。",
      "Paste a draft, choose a Markdown file, or load the example.": "粘贴草稿、选择 Markdown 文件，或加载样例。",
      "Choose .md file": "选择 .md 文件",
      "Step 1: paste Markdown, or choose a .md file.": "第一步：粘贴 Markdown，或选择 .md 文件。",
      "Recognized: nothing yet": "已识别：暂无内容",
      "Recognized: title, body": "已识别：标题、正文",
      "Recognized: body": "已识别：正文",
      "No X Article page detected yet. Write will open or create a draft.": "还没有检测到 X 文章页，点击写入时会打开/创建草稿。",
      "Will write to the currently open X Article draft.": "将写入当前打开的 X 文章草稿。",
      "X Articles is open; Write will open or create a draft.": "X 文章页已打开，点击写入时会打开或创建草稿。",
      "Input Markdown": "输入 Markdown",
      "Paste or drop your draft.": "粘贴或拖入草稿。",
      "Add or drop your draft.": "添加或拖入草稿。",
      "Paste Markdown or drop a file here": "粘贴 Markdown 或把文件拖到这里",
      "Write in MacDown, Obsidian, Typora, or any Markdown editor. xPoster writes this draft into the current or new X Article.": "在 MacDown、Obsidian、Typora 或任何 Markdown 编辑器里写完，再让 xPoster 写入当前或新建的 X 文章。",
      "Write article": "写入文章",
      "Use the current X Article or create one.": "使用当前 X 文章，或新建一篇。",
      "Open article": "打开文章",
      "Open X Article": "打开 X 文章",
      "Open X Articles": "打开 X 文章",
      "Check editor": "检查编辑器",
      "Check X page": "检查文章",
      "Check article": "检查文章",
      "Check article": "检查文章",
      "What happens": "会发生什么",
      "What happens:": "会发生什么：",
      "How web images are handled": "网页图片如何处理",
      "xPoster downloads public web images in the extension background, then lets X upload them.": "xPoster 会在扩展后台下载公开网页图片，然后交给 X 上传。",
      "private, expired, blocked, or unreachable images stay as Markdown links in the article.": "私有、过期、受阻或无法访问的图片会在文章中保留为 Markdown 链接。",
      "Paste Markdown here, fill the open X Article there": "在这里粘贴 Markdown，填入当前 X 文章",
      "xPoster previews your draft first. When you click Import, it fills the active X Article editor, uploads images it can read, and then stops for your review.": "xPoster 会先预览草稿。点击导入后，它会填入当前 X 文章编辑器、上传能读取的图片，然后停下来让你检查。",
      Cost: "费用",
      "Free to use. No xPoster account, subscription, trial limit, or feature lock.": "免费使用。不需要 xPoster 账号、订阅，没有试用限制或功能锁。",
      "Free. No xPoster account, subscription, trial limit, or feature lock.": "免费。不需要 xPoster 账号、订阅，没有试用限制或功能锁。",
      "Draft privacy": "草稿隐私",
      "Your Markdown stays in this browser. xPoster has no server and no analytics.": "Markdown 留在这个浏览器里。xPoster 没有服务器，也没有分析统计。",
      "Your draft stays in this browser. xPoster has no server or analytics.": "草稿留在这个浏览器里。xPoster 没有服务器，也没有分析统计。",
      "Privacy and control": "隐私和控制权",
      "Your draft stays in this browser. Import fills the editor only; you still review and publish in X.": "草稿留在这个浏览器里。xPoster 只填入编辑器；仍由你在 X 中检查并发布。",
      "Your draft stays in this browser. xPoster fills the editor only; you still review and publish in X.": "草稿留在这个浏览器里。xPoster 只填入编辑器；仍由你在 X 中检查并发布。",
      Local: "本地",
      "Publishing control": "发布控制",
      "xPoster fills the editor only after Import. You still review and publish in X.": "只有点击导入后 xPoster 才会填入编辑器。仍由你在 X 中检查并发布。",
      "Import fills the editor. You still review and publish in X.": "导入只会填入编辑器。仍由你在 X 中检查并发布。",
      "Image permission": "图片处理",
      "Web images may need one Chrome approval for their image site before upload.": "网页图片会在写入时自动尝试处理；失败时保留为 Markdown 链接。",
      "Web image links may ask once for Chrome approval before upload.": "网页图片会在写入时自动尝试处理；失败时保留为 Markdown 链接。",
      "Web image permission": "网页图片处理",
      "Web image handling": "网页图片处理",
      "xPoster tries public image downloads in the background; failed downloads stay as Markdown links.": "xPoster 会在后台尝试下载公开图片；下载失败的图片会保留为 Markdown 链接。",
      "Remote image links may ask once for Chrome approval before xPoster can upload them into X.": "网页图片会在写入时自动尝试处理；失败时保留为 Markdown 链接。",
      "Ask first": "自动处理",
      "What xPoster does": "xPoster 做什么",
      "Turns your Markdown draft into an X Article": "把 Markdown 草稿变成 X 文章",
      "Paste your draft, open the X Article you want to fill, then let xPoster upload images and place the content. It never publishes for you.": "粘贴草稿，打开要填入内容的 X 文章，然后让 xPoster 上传图片并放置内容。它不会替你发布。",
      "Cost: no xPoster account, subscription, trial limit, or feature lock.": "费用：不需要 xPoster 账号、订阅，没有试用限制或功能锁。",
      "Free: no xPoster account, subscription, trial limit, or feature lock.": "免费：不需要 xPoster 账号、订阅，没有试用限制或功能锁。",
      "Local: your draft stays in this browser; xPoster has no server.": "本地处理：草稿留在这个浏览器里；xPoster 没有服务器。",
      "You publish: xPoster only fills the editor after you click Import.": "你来发布：只有点击导入后，xPoster 才会填入编辑器。",
      "Image permission: web images may ask once for Chrome approval.": "图片处理：写入时自动尝试处理网页图片。",
      Connection: "连接状态",
      "X page": "X 页面",
      "Control: xPoster fills the editor only after you click Import; you still review and publish in X.": "控制权：只有点击导入后 xPoster 才会填入编辑器；仍由你在 X 中检查并发布。",
      "Images: web image links may ask once for Chrome permission to read that image website.": "图片：写入时自动尝试处理网页图片；失败时保留链接。",
      "Next step": "下一步",
      "Remote images need one Chrome approval": "网页图片自动处理",
      "Web images can upload after one Chrome approval": "网页图片可下载时自动上传",
      "Allow site": "网页图片",
      "Do this next": "下一步操作",
      "Main action": "主要操作",
      "Create or open the X Article to fill.": "创建或打开要填入内容的 X 文章。",
      "Create or open the article draft in X.": "在 X 中创建或打开文章草稿。",
      "Create or open the article you want to fill.": "创建或打开你要填入内容的文章。",
      "Open x.com/compose/articles before importing.": "导入前先打开 x.com/compose/articles。",
      "Import, then review": "导入后检查",
      "Import and review": "导入并检查",
      "X tab": "X 标签页",
      "Final check": "最后检查",
      "xPoster fills the draft; you publish in X.": "xPoster 填入草稿；由你在 X 中发布。",
      "Click Import, then review in X before publishing.": "点击导入，然后在 X 中检查无误后再发布。",
      "Let xPoster fill the article, then check it in X.": "让 xPoster 填入文章，然后在 X 中检查。",
      "Run the check, import, then confirm the article.": "先检查，再导入，最后确认文章结果。",
      "Run Check, then import when the button is available.": "先点检查，导入按钮可用后再导入。",
      "Run Check X page, then import when the button is available.": "先点击检查文章，导入按钮可用后再导入。",
      "Run Check article, then import when the button is available.": "先点击检查文章，导入按钮可用后再导入。",
      "No xPoster account or subscription.": "不需要 xPoster 账号或订阅。",
      "No account or subscription.": "不需要账号或订阅。",
      "Free: no xPoster account.": "免费：不需要 xPoster 账号。",
      "Free, no xPoster account": "免费，无需 xPoster 账号",
      "Free, no account or subscription": "免费，无需账号或订阅",
      "Free to use.": "免费使用。",
      Free: "免费",
      "Local: draft stays here.": "本地：草稿留在这里。",
      "Local draft": "本地草稿",
      "Draft stays in this browser": "草稿留在这个浏览器里",
      "No account.": "不需要账号。",
      "Draft stays here.": "草稿留在这里。",
      "You publish in X.": "由你在 X 中发布。",
      "You publish": "你来发布",
      "You review and publish in X": "你在 X 中检查并发布",
      "Cost: no xPoster account, subscription, or trial limit.": "费用：不需要 xPoster 账号、订阅，也没有试用限制。",
      "Draft stays in your browser; publishing uses your signed-in X tab.": "草稿保留在浏览器内；发布使用你已登录的 X 标签页。",
      "Draft stays in this browser.": "草稿留在这个浏览器里。",
      "You review and publish in X.": "由你在 X 中检查并发布。",
      "Raw Markdown stays here": "这里保留 Markdown 原文",
      "This box always keeps the original Markdown text. Use Preview to see recognized images and links; images appear in X only after approval, download check, and Import.": "这个输入框始终保留 Markdown 原文。请到预览里看识别到的图片和链接；写入时可下载的图片会上传到 X。",
      "Use Preview to see what xPoster found. Imported images appear in X after Allow image website, Check downloads, and Import.": "在预览里查看 xPoster 识别到的内容。写入时，能下载的网页图片会上传到 X；失败的图片会保留链接。",
      "If image links still look like Markdown here, that is normal. xPoster converts them during Import, not inside this text box.": "如果图片链接在这里仍然像 Markdown 语法，这是正常的。xPoster 会在导入时转换它们，不会在这个输入框里转换。",
      "Drop Markdown here": "拖拽上传",
      "Release anywhere in this panel to load or queue the draft.": "在这个区域任意位置松开，即可载入或加入待发布队列。",
      "Release to load it into the article draft": "松开后加入待发布草稿",
      "Release to load Markdown": "松开即可载入 Markdown",
      "Release to load": "松开载入",
      "Drop cancelled": "已取消拖拽",
      "Reading Markdown...": "正在读取 Markdown...",
      "Markdown loaded": "草稿就绪",
      "Could not load Markdown": "无法载入 Markdown",
      "Ready for Markdown": "等待 Markdown",
      "Draft added": "草稿已添加",
      "No new Markdown drafts were added.": "没有新增 Markdown 草稿。",
      "No Markdown content": "没有 Markdown 内容",
      "Unknown": "未知",
      "Optional": "可选",
      "Can create": "可新建",
      "Not ready": "未就绪",
      "Markdown parsed": "Markdown 已解析",
      "Status update": "状态更新",
      "Live progress reset.": "实时进度已重置。",
      "Received an import progress update from the active X tab.": "已收到当前 X 标签页的导入进度更新。",
      "Preparing Markdown, images, and the X editor.": "正在准备 Markdown、图片和 X 编辑器。",
      "Writing the article body into X.": "正在把文章正文写入 X。",
      "Placing images, tweets, code, and dividers into the article.": "正在放置图片、推文、代码和分隔线。",
      "Setting the title and cover after the body import.": "正文导入后正在设置标题和封面。",
      "Live status received from the active X tab.": "已收到当前 X 标签页的实时状态。",
      "Writing finished.": "写入完成。",
      "Writing failed": "写入失败",
      "Paste or drop Markdown": "添加或拖入 Markdown",
      "MacDown, Obsidian, Typora, or any .md file.": "支持 MacDown、Obsidian、Typora 或 .md 文件。",
      "Drop a .md file or paste text into the editor below.": "拖入 .md 文件，或把文本粘贴到下面的编辑框。",
      "Paste text or choose a .md file.": "粘贴文本，或选择 .md 文件。",
      "Release the file here. xPoster will load it into the draft box, not publish it.": "在这里松开文件。xPoster 会把它载入草稿框，不会发布。",
      "Release to add it to Pending.": "松开后载入草稿。",
      "Release to load it here.": "松开后载入这里。",
      "Loaded": "已载入",
      "Loading the dropped content into the draft box.": "正在读取拖入的 Markdown。",
      "Adding the dropped content to Pending.": "正在读取拖入的 Markdown。",
      "characters. Review it, then click Write to X draft.": "个字符。检查后点击写入到 X 草稿。",
      "That drop did not include Markdown text or a .md file.": "这次拖入没有包含 Markdown 文本或 .md 文件。",
      "Try a .md, .markdown, .txt file, or plain Markdown text.": "请拖入 .md、.markdown、.txt 文件，或普通 Markdown 文本。",
      "Web images stayed as links?": "网页图片保留成链接？",
      "Try upload": "尝试上传",
      "Try image upload": "尝试图片上传",
      "Write again": "再次写入",
      "Allow this image website now?": "网页图片保留为链接？",
      "Click Allow image website. Chrome will ask once; choose Allow, then write again.": "把失败图片换成公开可访问链接，然后再次写入。",
      "The article can still be written now; those web images will stay as Markdown links.": "现在也可以继续写入文章；这些网页图片会保留为 Markdown 链接。",
      "Image website allowed. Write again to upload those images into X.": "图片可下载。再次写入即可把这些图片上传到 X。",
      "Some web images are still links. Try image upload again, or replace unreachable image URLs with public links.": "有些网页图片仍是链接。可以再次尝试图片上传，或把不可访问的图片 URL 换成公开链接。",
      "All web images are ready. Write again to upload them.": "所有网页图片已就绪。再次写入即可上传。",
      "All web images uploaded.": "所有网页图片已上传。",
      "No import has run yet.": "还没有写入记录。",
      "Article written.": "文章已写入。",
      "Web images stayed as Markdown links. Allow the image website, then write again to upload them.": "网页图片保留为 Markdown 链接。替换为公开可下载链接后再次写入即可上传。",
      "Uploaded": "已上传",
      "kept as links": "保留为链接",
      "Option:": "可选：",
      "allow that image website, then write again so xPoster can upload them.": "替换为公开可下载链接，然后再次写入，xPoster 就可以上传这些图片。",
      "Fallback:": "备选：",
      "if Chrome still cannot read them, xPoster keeps the Markdown links in the article.": "如果 Chrome 仍然无法读取，xPoster 会把 Markdown 图片链接保留在文章里。",
      "1. Input Markdown": "1. 输入 Markdown",
      "Paste Markdown or drop a file": "粘贴 Markdown 或拖入文件",
      "Write in MacDown, Obsidian, Typora, or any Markdown editor. xPoster keeps this text here.": "可以从 MacDown、Obsidian、Typora 或任何 Markdown 编辑器复制。xPoster 会把原文保存在这里。",
      "# Article title\n\nPaste your Markdown here.": "# 文章标题\n\n把 Markdown 粘贴到这里。",
      "Markdown image links stay as text here. They become uploaded images when xPoster writes the article.": "Markdown 图片链接会先保留为文字；写入文章时会变成上传图片。",
      "Privacy: your draft is processed in this browser; xPoster has no server.": "隐私：草稿只在这个浏览器里处理；xPoster 没有服务器。",
      "xPoster fills the draft; you still review and publish in X.": "xPoster 只填入草稿；仍由你在 X 中检查并发布。",
      "Control: xPoster fills the editor; you still review and publish in X.": "控制权：xPoster 负责填入编辑器；仍由你在 X 中检查并发布。",
      "Remote image links may ask once for Chrome site access.": "网页图片会在写入时自动尝试处理。",
      "Images: remote image links need a one-time Chrome allow step.": "图片：网页图片能下载就上传，失败就保留链接。",
      "No review yet.": "尚未检查文章。",
      "Ready to import": "导入准备",
      "Current step": "当前步骤",
      "Start by pasting a complete draft. xPoster previews it here first; nothing is written to X until the main button says Import.": "先粘贴完整草稿。xPoster 会先在这里预览；只有主按钮显示导入时，才会写入 X。",
      "Paste the full draft here. xPoster previews first and writes to X only after you click Import.": "把完整草稿粘贴到这里。xPoster 会先预览，只有点击导入后才写入 X。",
      "Save record": "保存记录",
      "Save details": "保存详情",
      Draft: "草稿",
      Target: "X 文章",
      "X Article": "X 文章",
      Bridge: "X 编辑器",
      "Editor check": "编辑器检查",
      Media: "媒体",
      Evidence: "记录",
      Review: "检查",
      "No Markdown loaded.": "未加载 Markdown。",
      "Open X Articles.": "打开 X 文章。",
      "Run a check.": "运行检查。",
      "No uploads yet.": "还没有上传。",
      "No uploads required.": "无需上传。",
      "No live result.": "没有文章检查结果。",
      "Import readiness": "导入准备",
      "Not ready yet": "还没准备好",
      "Live gate": "导入状态",
      "Completion unproven": "还不能确认完成",
      "Load a draft and open X Articles before importing.": "导入前先加载草稿并打开 X 文章。",
      "X target": "X 文章",
      "X Article": "X 文章",
      Import: "导入",
      "Next action": "下一步",
      "Load a Markdown draft": "加载 Markdown 草稿",
      "Add a Markdown draft": "放入 Markdown 草稿",
      "Choose file": "选择文件",
      "Paste Markdown into the draft editor, choose a file, or load the smoke fixture.": "将 Markdown 粘贴到草稿编辑器、选择文件，或加载烟测草稿。",
      "Paste Markdown into the draft box, choose a file, or load an example.": "粘贴 Markdown、选择文件，或加载样例。",
      "Add a draft, choose a file, or load an example.": "粘贴 Markdown、选择文件，或加载样例。",
      "Paste a Markdown draft or choose a file. xPoster will preview it before anything is written to X.": "粘贴 Markdown 草稿或选择文件。xPoster 会先预览，不会立刻写入 X。",
      "Paste a draft or choose a .md file. xPoster previews it first and does not write to X yet.": "粘贴草稿或选择 .md 文件。xPoster 会先预览，此时不会写入 X。",
      "Paste your Markdown or choose a .md file. xPoster will preview the draft before touching X.": "粘贴 Markdown 或选择 .md 文件。xPoster 会先预览草稿，不会立刻操作 X。",
      "Paste your Markdown in the box, or choose a .md file. Use Example only if you want to try the workflow first.": "把 Markdown 粘贴到草稿框，或选择 .md 文件。只想先试用流程时，再点样例。",
      "Paste your Markdown in the box, choose a .md file, or use Example to try the workflow first.": "把 Markdown 粘贴到草稿框、选择 .md 文件，或用样例先试一遍流程。",
      "Paste your Markdown in the draft box, choose a .md file, or use Example to try the workflow first.": "把 Markdown 粘贴到草稿框、选择 .md 文件，或用样例先试一遍流程。",
      "# Article title\n\nPaste your Markdown here. xPoster will preview text and images, then show the next step.": "# 文章标题\n\n把 Markdown 粘贴到这里。xPoster 会预览文字和图片，然后显示下一步。",
      "Paste Markdown, choose a file, or load the example draft.": "粘贴 Markdown、选择文件，或加载样例草稿。",
      "Load Smoke": "加载烟测",
      "Load example": "加载样例",
      Gate: "状态",
      Status: "状态",
      Progress: "进度",
      "Load draft": "加载草稿",
      "Paste or load Markdown before importing.": "导入前请粘贴或加载 Markdown。",
      "Load a Markdown draft. Open an X Articles tab.": "加载 Markdown 草稿。打开 X 文章 标签页。",
      "Open x.com/compose/articles in the active tab.": "在当前标签页打开 X 文章编辑页。",
      "Use the open X Article tab.": "使用当前打开的 X 文章标签页。",
      "Open the X Article tab you want xPoster to fill.": "打开你要让 xPoster 填写的 X 文章标签页。",
      Check: "检查",
      Open: "打开",
      Preview: "预览",
      Pending: "待发布",
      "Publish records": "记录",
      "Publish history": "记录",
      Verify: "验证",
      Records: "记录",
      Settings: "设置",
      "Search records": "搜索记录",
      "Clear all": "全部清空",
      "Clear": "清空",
      "Clear all saved draft records?": "清空所有草稿记录？",
      Cancel: "取消",
      "Draft recovery": "找回草稿",
      "Find previous text": "找回上次输入",
      "Find the Markdown you used before, copy it, or edit it before writing.": "找回之前输入的 Markdown，复制或编辑后再写入。",
      "Search title, file, URL, or Markdown text": "搜索标题、文件、网址或 Markdown 内容",
      "Search Markdown text, title, file, or URL": "搜索 Markdown 原文、标题、文件或网址",
      "Search past drafts, links, and write results.": "搜索过去的草稿、链接和写入结果。",
      "Search can find saved Markdown text, file names, and URLs.": "可以搜索已保存的 Markdown 原文、文件名和网址。",
      "Paste or load Markdown to save the first recoverable draft.": "粘贴或载入 Markdown 后，会保存第一条可找回的草稿。",
      "Record actions": "记录操作",
      "recoverable Markdown draft(s). Newest first.": "条 Markdown 草稿可找回，最新在前。",
      "No recoverable Markdown drafts yet.": "还没有可找回的 Markdown 草稿。",
      "Use draft": "使用这份草稿",
      "Copy text": "复制原文",
      "Edit first": "编辑再用",
      "使用这份草稿": "使用这份草稿",
      "复制原文": "复制原文",
      "编辑再用": "编辑再用",
      Language: "语言",
      "Choose the side panel language.": "选择侧边栏语言。",
      Appearance: "外观",
      "Choose how xPoster looks in the side panel.": "选择侧边栏的显示外观。",
      System: "跟随系统",
      Light: "浅色",
      Dark: "暗色",
      "Everything is included": "功能全部包含",
      "No account, subscription, trial limit, or feature lock.": "无需账号、订阅、试用限制或功能锁。",
      On: "开启",
      "Privacy and control": "隐私和控制",
      "Your draft stays in this browser. xPoster fills the editor only; you still review and publish in X.": "你的草稿留在这个浏览器里。xPoster 只填写编辑器，你仍然在 X 中检查并发布。",
      Local: "本地",
      "Web image handling": "网页图片处理",
      "xPoster tries public image downloads in the background; failed downloads stay as Markdown links.": "xPoster 会在后台尝试下载公开图片；失败的图片会保留为 Markdown 链接。",
      Auto: "自动",
      "Choose the folder that contains relative image paths in your Markdown.": "选择包含 Markdown 相对图片路径的文件夹。",
      "Title and cover": "标题和封面",
      "xPoster sets them automatically when the X Article editor allows it.": "当 X 文章编辑器允许时，xPoster 会自动设置它们。",
      "Choose what xPoster writes into X Article metadata.": "选择 xPoster 要写入 X 文章元信息的内容。",
      "Set article title": "设置文章标题",
      "Use frontmatter title or the first H1.": "使用 frontmatter title 或第一个一级标题。",
      "Set article cover": "设置文章封面",
      "Use frontmatter cover or the first image.": "使用 frontmatter cover 或第一张图片。",
      "Success feedback": "成功反馈",
      "Choose the small celebration shown after a successful write.": "选择写入成功后显示的小反馈。",
      "Celebration animation": "庆祝动画",
      "Show a brief confetti burst when X reports a completed write.": "当 X 返回写入完成时，显示一次短暂彩纸动画。",
      "Completion sound": "完成音效",
      "Play a short local chime after a successful write.": "写入成功后播放一声本地短提示音。",
      "Sound style": "音效风格",
      "Soft chime": "轻柔提示",
      "Warm bell": "温和铃声",
      "Light pop": "轻快弹响",
      "Volume": "音量",
      "Test feedback": "测试反馈",
      "Feedback test": "反馈测试",
      "Use this to confirm animation and sound work in this Chrome profile.": "用它确认当前 Chrome 配置里的动画和音效是否可用。",
      "Sound blocked": "音效被拦截",
      "Chrome did not unlock audio for this panel. Click Test feedback again after interacting with the panel.": "Chrome 还没有允许这个面板播放音效。和面板交互后，再点一次测试反馈。",
      "Project and author": "项目与作者",
      "Open the project page or follow updates from the author.": "打开项目页面，或关注作者更新。",
      "Open GitHub project": "打开 GitHub 项目",
      "GitHub project": "GitHub 项目",
      "Follow author on X": "在 X 关注作者",
      "Embeds and code": "嵌入和代码",
      "X TARGET": "X 文章",
      "Workspace sections": "工作区",
      "Cost, privacy, and control": "成本、隐私和控制",
      "Publishing workflow": "发布流程",
      "Advanced command dock": "高级命令栏",
      "Readiness meter": "准备进度",
      "Jump to section": "跳转到区域",
      "Other actions": "其他操作",
      "Article xPoster will fill": "xPoster 将写入的文章",
      "No active X Article selected.": "尚未选择 X 文章。",
      "Current editor text": "当前编辑器文本",
      "Article review checklist": "文章检查清单",
      "Article check": "文章检查",
      "Saved result checklist": "最近发布记录",
      "Recent publish record": "最近发布记录",
      "Load Markdown, check X, or write an article to create a record.": "载入 Markdown、检查 X 或写入文章后，这里会生成记录。",
      "Copy summary": "复制摘要",
      "Draft saved": "草稿已保存",
      "No Markdown record saved yet.": "还没有保存 Markdown 记录。",
      "No linked article yet.": "还没有关联文章。",
      "Write result": "写入结果",
      "No write result saved yet.": "还没有写入结果。",
      "Technical details": "技术详情",
      "Only needed for troubleshooting or support.": "仅在排查问题或需要支持时查看。",
      "Technical record": "技术记录",
      "Copy details": "复制详情",
      "Copy full record": "复制完整记录",
      "Save file": "保存文件",
      "Before you finish": "完成前",
      "Draft preview": "草稿预览",
      "Draft editor note": "草稿编辑器说明",
      "Preview explanation": "预览说明",
      "Markdown inspector": "Markdown 检查器",
      "X Article readiness": "X 文章准备状态",
      "How xPoster will place the draft": "xPoster 如何放置草稿",
      "What is in your draft": "草稿内容",
      "Draft contents": "草稿内容",
      "Fix problems": "修复问题",
      "Save result": "保存结果",
      "Copy all": "复制全部",
      "Copy path": "复制路径",
      "the folder you cloned or downloaded": "你克隆或下载的文件夹",
      "X page script": "X 页面脚本",
      "X file import works": "X 文件导入可用",
      "xPoster placeholders removed": "xPoster 占位文本已移除",
      "xPoster loaded": "xPoster 已加载",
      "Web images": "网页图片",
      "No web image links in this draft.": "这篇草稿没有网页图片链接。",
      "X editor": "X 编辑器",
      "Next": "下一步",
      "Fix this before importing": "写入前先处理这里",
      "X Article blocker": "X 文章阻塞项",
      "Add a Markdown draft first. Open or create an X Article draft.": "先添加 Markdown 草稿，再打开或新建 X 文章草稿。",
      "Open X Articles so xPoster can load the page script.": "打开 X 文章，让 xPoster 加载页面脚本。",
      "No X Article is open yet.": "尚未打开 X 文章。",
      "Load the example or paste Markdown before checking X.": "检查 X 前先加载样例或粘贴 Markdown。",
      "Load the example or paste a Markdown draft before checking X.": "检查 X 前先加载样例或粘贴 Markdown 草稿。",
      "Add a draft or load the example before checking X.": "检查 X 前先粘贴 Markdown 或加载样例。",
      "Load xPoster as an unpacked extension in Chrome.": "在 Chrome 中加载 xPoster 解包扩展。",
      "Load xPoster as an unpacked extension in signed-in Chrome.": "在已登录的 Chrome 中加载 xPoster 解包扩展。",
      "Confirm this xPoster copy is loaded in the signed-in Chrome profile.": "确认这个 xPoster 已加载到已登录的 Chrome 配置中。",
      "Open X Articles in the active tab.": "在当前标签页打开 X 文章。",
      "Paste Markdown, choose a file, or use the example to try the workflow.": "粘贴 Markdown、选择文件，或使用样例体验流程。",
      "Add Markdown, choose a file, or use the example to try the workflow.": "粘贴 Markdown、选择文件，或使用样例体验流程。",
      "Add a draft, choose a file, or load the example.": "粘贴 Markdown、选择文件，或加载样例。",
      "X can still open a Markdown file when needed.": "需要时，X 仍可打开 Markdown 文件。",
      "The article body is not ready yet.": "文章正文尚未准备好。",
      "This is a recognition preview. Image links stay as text in the draft box; xPoster downloads public images during Write and keeps failed downloads as links.": "这是识别预览。图片链接会作为 Markdown 保留；写入时 xPoster 会下载公开图片，失败的图片保留为链接。",
      "Each part of the draft will show whether it becomes text, an image, the title, the cover, or an embed.": "草稿的每一部分都会显示将变成正文、图片、标题、封面还是嵌入内容。",
      "Finish the X Article review before calling this import done.": "完成 X 文章检查后，再确认本次写入完成。",
      "Post-import review": "导入后检查",
      "Readiness progress": "准备进度",
      "Import readiness status": "导入准备状态",
      "No records match this search.": "没有匹配的记录。",
      "Clear the search or try a title, file name, URL, or Markdown phrase.": "清空搜索，或换一个标题、文件名、网址、Markdown 片段试试。",
      "Showing all records. Search can find saved Markdown text.": "正在显示全部记录。搜索可找到已保存的 Markdown 原文。",
      "Showing matching records.": "正在显示匹配记录。",
      "saved draft(s). Newest first.": "条可找回草稿，最新在前。",
      "saved draft(s) found.": "条草稿匹配。",
      "No recoverable drafts yet.": "还没有可找回的草稿。",
      "No saved Markdown in this record.": "这条记录没有可找回的 Markdown。",
      "Untitled Markdown": "未命名 Markdown",
      "Saved Markdown": "已保存 Markdown",
      "Draft text": "草稿原文",
      "Markdown preview": "Markdown 预览",
      "Last saved": "保存于",
      "Use": "使用",
      "Edit": "编辑",
      "Open": "打开",
      "Clear records": "清空记录",
      "Clear all": "全部清空",
      "Clear saved record history from this browser.": "清空保存在这个浏览器里的记录历史。",
      "Close": "关闭",
      "Edit saved Markdown": "编辑已保存的 Markdown",
      "Saved Markdown": "已保存 Markdown",
      "No link saved": "没有保存链接",
      "Open linked page": "打开关联页面",
      "Written to X": "已写入 X",
      "Loaded only": "仅载入",
      "Search can find the saved Markdown text.": "可以搜索已保存的 Markdown 原文。",
      "Use edited draft": "使用编辑后的草稿",
      "Copy edited draft": "复制编辑内容",
      "Use draft": "使用草稿",
      "Copy text": "复制文本",
      "Cancel edit": "取消编辑",
      "Edit this saved Markdown before using it": "使用前可以编辑这份已保存的 Markdown",
      "Edited Markdown restored to Pending.": "编辑后的 Markdown 已放回编辑器。",
      "Edited Markdown copied.": "编辑后的 Markdown 已复制。",
      "Use this saved Markdown in Pending.": "把这份 Markdown 放回编辑器。",
      "Copy this saved Markdown.": "复制这份 Markdown。",
      "Edit this saved Markdown.": "编辑这份 Markdown。",
      "Page URL saved": "已保存网页地址",
      "Linked page": "关联网页",
      "Markdown snapshot saved": "已保存 Markdown 快照",
      "Markdown snapshot not available": "没有可恢复的 Markdown",
      "Markdown restored": "Markdown 已恢复",
      "Restore Markdown": "恢复 Markdown",
      "Copy Markdown": "复制 Markdown",
      "Markdown restored to Pending.": "Markdown 已恢复到编辑器。",
      "Markdown copied.": "Markdown 已复制。",
      "No publish record yet": "还没有记录",
      "No records yet": "还没有记录",
      "Write a Markdown draft into X Article. The latest result and activity will appear here.": "载入 Markdown、检查 X 或写入文章后，这里会显示每一步记录。",
      "Load Markdown, check X, or write an article. Each step will appear here.": "载入 Markdown、检查 X 或写入文章后，每一步都会显示在这里。",
      "No saved records yet.": "还没有记录。",
      "No records yet.": "还没有记录。",
      "Write or check an article to create the first record.": "载入 Markdown、检查或写入文章后会生成第一条记录。",
      "Load Markdown, run Check, or Write article to create the first record.": "载入 Markdown、运行检查或写入文章后会生成第一条记录。",
      "All saved drafts cleared.": "已清空所有保存的草稿。",
      "Loaded example Markdown draft.": "已载入 Markdown 样例草稿。",
      "record(s), newest first.": "条记录，最新在前。",
      "local record(s), newest first.": "条记录，最新在前。",
      "Draft loaded": "草稿已载入",
      "Draft ready": "草稿待发布",
      "Draft updated": "草稿已更新",
      "Loaded draft": "已载入草稿",
      "Markdown loaded": "草稿就绪",
      "Article URL": "文章地址",
      "Page URL": "网页地址",
      "Open article": "打开文章",
      "No article URL yet": "还没有文章地址",
      "No page URL yet": "还没有网页地址",
      Source: "来源",
      File: "文件",
      "Dropped file": "拖入文件",
      "Dropped text": "拖入文本",
      "Pasted text": "粘贴文本",
      "Example draft": "示例草稿",
      "Restored draft": "已恢复草稿",
      "Typed draft": "手写草稿",
      "Queued draft": "待发布草稿",
      "Pending queue": "待发布队列",
      "Pending drafts": "待发布草稿",
      "Pending Markdown queue": "待发布 Markdown 队列",
      "Drop multiple Markdown files to queue them here.": "拖入多篇 Markdown 后会先放在这里。",
      "One list: select a draft, then write it.": "一个列表：选中草稿，然后写入。",
      "Click a draft to edit.": "点击草稿即可编辑。",
      "No pending drafts": "暂无待发布草稿",
      "Add one draft or drop Markdown files here.": "添加一篇草稿，或把 Markdown 文件拖到这里。",
      "Create draft": "新建草稿",
      "Load this draft": "载入这篇草稿",
      Current: "当前",
      Queued: "待处理",
      Writing: "正在写入",
      "Write all drafts": "批量写入",
      "Writing all...": "正在批量写入...",
      "Write this draft": "写入这篇",
      "Save only": "仅保存",
      "Writing queued drafts one by one.": "正在逐篇写入队列草稿。",
      "Queued drafts are written one by one. Each successful draft leaves the list.": "队列草稿会逐篇写入。成功写入后会从列表移除。",
      "Stop": "停止",
      "Stopping...": "正在停止...",
      "Stop requested. xPoster will stop before the next upload step.": "已请求停止。xPoster 会在下一个上传步骤前停下。",
      "Writing stopped by user.": "写入已停止。",
      Stopped: "已停止",
      "Stop request failed: active X tab did not respond": "停止请求失败：当前 X 标签页没有响应",
      [X_ARTICLE_MEDIA_LIMIT_WARNING]: "X 文章媒体提醒：xPoster 实测 X 文章单篇最多可接收 25 个图片上传项。这篇草稿有 {count} 个媒体上传项；超出的图片可能会被 X 拒绝。",
      "X Article media note": "X 文章媒体提醒",
      "Review before writing": "写入前确认",
      "Focus the Markdown editor below.": "光标已放到下面的 Markdown 编辑框。",
      "Review queue": "检查队列",
      "Write queue": "写入队列",
      "Write all drafts or edit one.": "批量写入，或打开某一篇单独编辑。",
      "Write queued drafts": "写入队列草稿",
      "Ready to write queued drafts one by one.": "可以逐篇写入队列草稿。",
      "Batch draft writing started.": "开始批量写入草稿。",
      "Queued draft not found": "未找到队列草稿",
      "Draft added": "已新增草稿",
      "Markdown queued": "Markdown 已加入队列",
      "Queued Markdown": "已加入待发布队列",
      "Queued Markdown loaded.": "已载入队列中的 Markdown。",
      "No new Markdown drafts were added.": "没有新的 Markdown 草稿需要加入。",
      "Drop multiple Markdown files to queue them here. Open one draft when you are ready to write.": "拖入多篇 Markdown 后会先放在这里。准备写入时再打开其中一篇。",
      Blocks: "块",
      Step: "阶段",
      Result: "结果",
      "Technical details": "技术详情",
      "Loaded Markdown": "已载入 Markdown",
      "Import completed": "写入完成",
      "Import failed": "写入失败",
      "Check result": "检查结果",
      "Check blocked": "检查阻断",
      "Image handling": "图片处理",
      "Remote images": "网页图片",
      "Last update": "最后更新",
      Written: "已写入",
      Failed: "失败",
      Blocked: "已阻断",
      "Check found blockers": "检查发现阻断项",
      Saved: "已保存",
      "Ready to write": "可写入",
      "Checked": "已检查",
      "Image check": "图片检查",
      Kind: "类型",
      Target: "目标",
      Images: "图片",
      Title: "标题",
      Cover: "封面",
      "Not run": "未运行",
      "Target not locked": "未锁定目标",
      "No image upload result": "没有图片上传结果",
      "Publish records cleared.": "记录已清空。",
      "Records cleared.": "记录已清空。",
      "Markdown draft": "Markdown 草稿",
      "Paste Markdown here, then save it to Pending.": "在这里粘贴 Markdown，然后保存到待发布草稿。",
      "Choose Markdown file": "选择 Markdown 文件",
      "Load live smoke fixture": "加载实时烟测草稿",
      "Load the live verification fixture": "加载实时验证草稿",
      "Load example Markdown draft": "加载 Markdown 样例草稿",
      "Load an example Markdown draft": "加载 Markdown 样例草稿",
      "Supports headings, lists, links, images, tables, tweet links, code blocks, and dividers. Web image links need a one-time Chrome approval; local image paths need a folder in Settings.": "支持标题、列表、链接、图片、表格、推文链接、代码块和分割线。网页图片写入时自动尝试处理；本地图片路径需要在设置里选择文件夹。",
      "Supports headings, lists, links, images, tables, tweet links, code blocks, and dividers. Nothing is written to X until you click Import.": "支持标题、列表、链接、图片、表格、推文链接、代码块和分割线。点击导入前，不会写入 X。",
      "Supports headings, links, images, tables, tweet links, code blocks, and dividers. Remote images may ask for permission to read that image site.": "支持标题、链接、图片、表格、推文链接、代码块和分割线。网页图片会在写入时自动尝试处理。",
      "Supports common Markdown blocks, images, tables, tweet links, code blocks, and dividers. If your draft uses remote image links, Chrome may ask once before xPoster can fetch those images for upload.": "支持常见 Markdown 块、图片、表格、推文链接、代码块和分割线。网页图片可下载时会上传，失败时保留链接。",
      "Remote image access": "网页图片",
      "Remote images need one-time site access": "网页图片自动处理",
      "Allow the image website once": "网页图片",
      "Allow web images before import": "网页图片",
      "Web images need one permission": "网页图片自动处理",
      "Allow web images": "网页图片",
      "Allow image website": "网页图片",
      "No remote image URLs detected.": "这篇草稿没有网页图片链接。",
      "No remote images": "没有网页图片",
      "No web images": "没有网页图片",
      "Detect links": "识别链接",
      "Check images": "图片结果",
      "Check downloads": "图片结果",
      "Checking downloads...": "正在处理图片...",
      "Checking images...": "正在处理图片...",
      "Images checked": "图片结果",
      "Image check failed": "图片处理失败",
      "Image check": "图片结果",
      "Web image source": "网页图片来源",
      "Some downloads failed": "部分图片下载失败",
      "All web images ready": "所有网页图片已就绪",
      "The saved record includes the full image check result.": "保存的记录会包含完整图片检查结果。",
      "xPoster will try to download these images while writing. Failed downloads stay as Markdown links.": "写入时会尝试下载这些图片。下载失败的图片会保留为 Markdown 链接。",
      "Write can continue. Failed images stay as Markdown links; replace private, expired, or anti-hotlink URLs with public links if they must upload.": "可以继续写入。失败图片会保留为 Markdown 链接；如果必须上传，请把私有、过期或防盗链 URL 换成公开链接。",
      "Not checked": "写入时处理",
      "Download failed": "下载失败",
      "Download ready": "可下载",
      "Allow image site": "网页图片",
      "Allow image website": "网页图片",
      "Allowed": "可下载",
      "Needs permission": "写入时处理",
      "Needs Chrome permission": "写入时处理",
      "Needs Chrome approval": "写入时处理",
      "Chrome asks because these images live on another website. Without this approval, xPoster cannot turn Markdown image links into uploaded images in X.": "这些图片在网页上。写入时 xPoster 会尝试下载，可下载时交给 X 上传；失败时保留链接。",
      "Chrome asks because these images live on another website. After approval, xPoster checks that each image can be downloaded before it writes anything to X.": "这些图片在网页上。写入时 xPoster 会尝试下载，可下载时交给 X 上传；失败时保留链接。",
      "Why Chrome asks:": "图片处理：",
      "these Markdown images live on another website.": "这些 Markdown 图片在另一个网站上。",
      "Why:": "原因：",
      "Chrome asks before xPoster reads an image website.": "xPoster 会后台读取图片文件，不读取站点 cookie。",
      "your Markdown points to images on another website, so Chrome asks before xPoster reads that website.": "你的 Markdown 指向另一个网站上的图片，所以 xPoster 会尝试后台下载图片文件。",
      "the image is on another website.": "图片在另一个网站上。",
      "What to do next:": "下一步：",
      "click Allow image website, then Check downloads.": "直接写入；失败图片会保留为链接。",
      "What xPoster does:": "xPoster 会做什么：",
      "What xPoster does not do:": "xPoster 不会做什么：",
      "it checks every image first. If one image link is temporarily unreachable, import stops and names the failed image.": "它会先检查每张图片。如果某个图片链接暂时不可访问，导入会停止并标出失败图片。",
      "it does not read unrelated websites or publish your article.": "它不会读取无关网站，也不会替你发布文章。",
      "Markdown images live on another website.": "Markdown 图片在另一个网站上。",
      "xPoster uses it for:": "xPoster 用它来：",
      "Use:": "用途：",
      "downloading image files so X can upload them.": "下载图片文件，让 X 可以上传。",
      "downloading those image files so X can upload them.": "下载这些图片文件，让 X 可以上传。",
      "xPoster will not:": "xPoster 不会：",
      "Limit:": "限制：",
      "no unrelated sites, no auto-publishing, no xPoster server.": "不读无关网站、不自动发布、不经过 xPoster 服务器。",
      "xPoster only reads this image site and never publishes for you.": "xPoster 只读取这个图片网站，也不会替你发布。",
      "read unrelated sites, publish for you, or send images to an xPoster server.": "读取无关网站、替你发布，或把图片发送到 xPoster 服务器。",
      "What to do next": "下一步",
      "No Chrome prompt?": "图片没有上传？",
      "Click the button below. When Chrome asks, choose Allow. If Chrome does not show a prompt, reload xPoster in chrome://extensions and reopen the X Article tab.": "直接写入即可。失败时，请把图片换成公开、未过期、可直接打开的链接。",
      "Click Allow image website first. After Chrome allows the site, click Check images if every Markdown image must upload.": "直接写入即可；如果某张网页图片必须上传，请把失败链接换成公开可访问链接。",
      "Click Allow image website. When Chrome asks for the image site, choose Allow.": "直接写入即可；xPoster 会自动尝试处理网页图片。",
      "If Chrome does not show a permission prompt, reload xPoster from chrome://extensions and reopen the side panel so the service worker uses the latest permission state.": "如果图片没有上传，请把失败链接换成公开可访问链接后再次写入。",
      "If Chrome does not show a permission prompt, open chrome://extensions, reload xPoster, reopen the X Article tab and the side panel, then click Allow image website again.": "如果图片没有上传，请把失败链接换成公开可访问链接后再次写入。",
      "Click Check images for a multi-image draft when every web image must upload. xPoster will list the exact image if an image URL is temporarily unreachable.": "写入时会尝试处理网页图片；某个图片 URL 暂时不可访问时，会保留为链接。",
      "Check images if this remote image must become an upload.": "写入时会尝试处理这张网页图片；不可访问时保留链接。",
      "Permission declined": "下载失败",
      "Remote image access not available in this context.": "当前环境无法处理网页图片。",
      "All remote image sites are allowed.": "网页图片会在写入时自动尝试处理。",
      "Image websites are not allowed yet. Write can continue; allow the website when you want xPoster to upload those images.": "写入可以继续；不可下载的图片会保留为 Markdown 链接。",
      "Chrome will ask once for the image site before xPoster reads these images.": "写入时 xPoster 会尝试处理这些图片。",
      "Chrome needs your approval before xPoster can fetch these remote image links for upload.": "写入时 xPoster 会尝试下载这些网页图片，用于交给 X 上传。",
      "Chrome is asking for image access:": "正在处理图片：",
      "Click Import or Allow image website. Chrome will ask once for this image website.": "点击写入。可下载的图片会交给 X 上传。",
      "Chrome asks once before xPoster can download Markdown images from this website for X upload.": "写入时 xPoster 会尝试下载网页图片，然后交给 X 上传。",
      "The image website is allowed. Check every image link if every web image must upload.": "可继续写入。如果某张网页图片必须上传，请替换失败链接。",
      "Allow the image site first.": "直接写入即可。",
      "Allow image site first.": "直接写入即可。",
      "Remote images are allowed.": "网页图片会自动处理。",
      "Remote images need permission.": "网页图片会自动尝试处理。",
      "Remote images are not required.": "这篇草稿没有网页图片。",
      "Request optional access only for these image URLs.": "只处理这些图片 URL。",
      "Remote image sites are not allowed yet. Click Allow image site if you want xPoster to upload those images.": "这些网页图片会在写入时尝试下载；失败时保留为链接。",
      "Remote image access can only be granted from the installed xPoster extension side panel.": "网页图片会在已安装的 xPoster 侧边栏中自动处理。",
      "Open the installed xPoster side panel to allow this image website.": "请打开 xPoster 侧边栏后再次写入。",
      "Click Allow image site so Chrome can ask for image-site access.": "再次写入即可尝试处理网页图片。",
      "Remote image permission was declined.": "网页图片下载失败。",
      "Remote image permission granted.": "网页图片可下载。",
      "Remote image permission already granted.": "网页图片已可下载。",
      "Remote image site is not supported in this low-permission build.": "当前版本无法下载这张网页图片。",
      "Image website allowed.": "图片可下载。",
      "Image website allowed": "图片可下载",
      "Image website already allowed.": "图片已可下载。",
      "Image website needs approval": "网页图片待处理",
      "Remote image permission pending": "网页图片待处理",
      "Allow the remote image site to upload remote URLs.": "网页图片会在写入时自动尝试处理。",
      "Remote image sites are allowed.": "网页图片会在写入时自动尝试处理。",
      "Remote image URLs are allowed, but image download has not been checked yet.": "网页图片会在写入时自动尝试处理。",
      "Remote image URLs are allowed and every image was downloaded successfully.": "网页图片已可下载。",
      "Every web image is allowed and downloadable.": "每张网页图片都可下载。",
      "web image(s). Allow this image website once, then check downloads.": "张网页图片。写入时会自动尝试处理。",
      "Needs approval": "写入时处理",
      "xPoster asks only for this image website.": "xPoster 只处理这个图片来源。",
      "xPoster only asks for this image website.": "xPoster 只处理这个图片来源。",
      "Click Allow image website, then choose Allow in Chrome.": "写入时会自动尝试处理网页图片。",
      "Reload xPoster in chrome://extensions, reopen the X Article tab and side panel, then try again.": "在 chrome://extensions 重新加载 xPoster，重新打开 X 文章标签页和侧边栏，然后再试。",
      "Remote image URLs are allowed, but some images could not be downloaded.": "有部分网页图片无法下载。",
      "Remote image URLs are allowed, but image upload has not been tried yet.": "网页图片会在写入时尝试上传。",
      "Old Markdown importer is still active in this X tab.": "旧的 Markdown 导入插件仍然在这个 X 标签页中运行。",
      "Refresh or reopen the X Article tab so only xPoster handles this import.": "请刷新或重新打开 X 文章标签页，确保只有 xPoster 处理这次导入。",
      "Old importer detected": "检测到旧导入插件",
      "Refresh X Article tab": "刷新 X 文章标签页",
      "Refresh X": "刷新 X",
      "Old Markdown importer detected": "检测到旧 Markdown 导入插件",
      "The original X Article Markdown Paste script is still active in this tab. Refresh or reopen the X Article tab before importing so image markers are handled only by xPoster.": "原来的 X Article Markdown Paste 脚本仍然在这个标签页中运行。导入前请刷新或重新打开 X 文章标签页，确保图片标记只由 xPoster 处理。",
      "Images recognized, files blocked": "已识别图片，但文件不可下载",
      "xPoster recognized these Markdown images, but it cannot upload them until Chrome can download each image file. If a COS signed URL fails, open it in a normal tab; if it does not load there, regenerate a public image link and check downloads again.": "xPoster 已识别这些 Markdown 图片；写入时会尝试下载并交给 X 上传。如果某个 COS 签名链接打不开，请换成公开可访问链接后再次写入。",
      "Checking remote images...": "正在处理网页图片...",
      "Check remote images before expecting uploads.": "网页图片会在写入时自动尝试处理。",
      "Image website allowed. Check downloads if every image must upload.": "可继续写入。如果某张图片必须上传，请替换失败链接。",
      "Click Check downloads if every web image must become an uploaded X image.": "如果每张网页图片都必须上传，请把失败链接换成公开可访问链接。",
      "Download blocked": "下载受阻",
      "Some web images could not be downloaded.": "有些网页图片无法下载。",
      Allow: "继续",
      Smoke: "烟测",
      Example: "样例",
      "No title yet": "暂无标题",
      "Article body": "文章正文",
      "Write Markdown to inspect the article structure.": "输入 Markdown 以检查文章结构。",
      "The preview focuses on publishing structure: headings, media, tables, code, tweet embeds, and the final import plan.": "预览聚焦发布结构：标题、媒体、表格、代码、推文嵌入和最终导入计划。",
      "This preview shows what xPoster found and what it will move into X.": "这里会显示 xPoster 识别到什么，以及会把什么搬进 X。",
      "Preview is the conversion check": "预览是转换检查",
      "The draft box stays as text. This section shows what xPoster recognized before it fills X.": "草稿仍以 Markdown 保存。这里显示 xPoster 在填入 X 前识别到了什么。",
      "The selected draft stays as Markdown. This section shows what xPoster recognized before it fills X.": "选中的草稿仍以 Markdown 保存。这里显示 xPoster 在填入 X 前识别到了什么。",
      "This is a recognition preview. Image links are still text in the draft box, but xPoster will upload them into X after the image website is allowed and downloads pass.": "这是识别预览。图片链接仍以 Markdown 保存；写入时可下载的图片会上传进 X。",
      "image links convert during Import": "图片链接会在导入时转换",
      "Import plan": "导入计划",
      "What xPoster will do": "xPoster 会做什么",
      "Load Markdown to see the plain-language import steps.": "加载 Markdown 后查看容易理解的导入步骤。",
      "Load Markdown to see paste, upload, and marker replacement steps.": "加载 Markdown 后查看写入正文、上传媒体和放置特殊内容的步骤。",
      "Load Markdown to see how xPoster will write text, upload media, and place special content.": "加载 Markdown 后查看 xPoster 如何写入文本、上传媒体并放置特殊内容。",
      "No plan generated.": "尚未生成计划。",
      "Text blocks": "文本块",
      "Special blocks": "特殊块",
      "Local images": "本地图片",
      "Start": "开始",
      "Paste a draft or choose a Markdown file.": "粘贴草稿或选择 Markdown 文件。",
      "Paste Markdown to see what xPoster will move into X.": "粘贴 Markdown 后查看 xPoster 会搬进 X 的内容。",
      "This preview shows headings, paragraphs, images, tables, tweet links, code, and dividers before anything is written to X.": "在写入 X 之前，这里会显示标题、段落、图片、表格、推文链接、代码和分割线。",
      "Write text": "写入正文",
      "Upload image": "上传图片",
      "Place block": "放置内容",
      Title: "标题",
      None: "无",
      Images: "图片",
      Tables: "表格",
      Tweets: "推文",
      Editor: "编辑器",
      "Open X": "打开 X",
      "X Article tab": "X 文章标签页",
      Unknown: "未知",
      Vault: "素材库",
      Optional: "可选",
      "Advanced diagnostics": "高级诊断",
      "Troubleshooting details": "排查详情",
      "Open only if something fails": "出问题时再打开",
      "Details and troubleshooting": "详情和排查",
      "More details": "更多详情",
      "Open this when you want the checks, import plan, or exact problem.": "想看检查项、导入计划或具体问题时打开这里。",
      "Open this when the check or import needs technical details.": "检查或导入需要技术细节时再打开这里。",
      "xPoster will point you here when it needs more details.": "需要更多细节时，xPoster 会提示你打开这里。",
      "Details for troubleshooting": "排查详情",
      "Open this only when a check or import fails.": "只有检查或导入失败时再打开这里。",
      "More details if something fails": "出错时查看更多细节",
      "Open this when xPoster asks you to fix something.": "当 xPoster 提示需要处理时再打开这里。",
      "Open this if a check or import asks you to fix something.": "当检查或导入提示需要处理时再打开这里。",
      "Open this only when xPoster asks you to fix something.": "只有 xPoster 要求你修复问题时再打开这里。",
      "Page context, conversion details, import ledger, and recovery trail.": "页面状态、转换明细、导入记录和修复线索。",
      "Target context": "当前 X 页面",
      "Current X Article": "当前 X 文章",
      "No active X Article target.": "没有活动的 X 文章目标。",
      Idle: "空闲",
      Route: "页面",
      "X page": "X 页面",
      "No X tab": "没有 X 标签页",
      "Article ID": "文章 ID",
      "Page path": "页面路径",
      "Article identifier": "文章标识",
      Page: "页面",
      "Editor sample": "编辑器片段",
      "Open or create an X Article draft before import.": "导入前请打开或创建 X 文章草稿。",
      "Open or create an X Article draft before importing.": "导入前请打开或创建 X 文章草稿。",
      "Issue queue": "待处理问题",
      "Current issues": "当前问题",
      "What needs attention": "需要处理什么",
      "Load Markdown to see the active blockers.": "加载 Markdown 后查看当前阻塞项。",
      "Paste Markdown, choose a file, or load the smoke fixture.": "粘贴 Markdown、选择文件，或加载烟测草稿。",
      "Paste Markdown, choose a file, or load the example draft.": "粘贴 Markdown、选择文件，或加载样例草稿。",
      "Conversion map": "转换说明",
      "What will be imported": "将导入的内容",
      "Content xPoster found": "xPoster 识别到的内容",
      "What xPoster found in your draft": "xPoster 在草稿中识别到什么",
      "Load Markdown to see how every supported block will import.": "加载 Markdown 后查看每种支持块的导入方式。",
      "Load Markdown to see text, images, tables, tweets, code, and dividers.": "加载 Markdown 后查看文本、图片、表格、推文、代码和分隔线。",
      Cover: "封面",
      Text: "文本",
      Code: "代码",
      Dividers: "分隔线",
      "Local vault": "本地图片文件夹",
      "Waiting for frontmatter or first H1.": "等待 frontmatter 或第一个 H1。",
      "Waiting for frontmatter cover or first image.": "等待 frontmatter cover 或第一张图片。",
      "Headings, paragraphs, lists, quotes, links, and inline styles.": "标题、段落、列表、引用、链接和行内样式。",
      "Prepared as files, then uploaded through X.": "准备为文件，然后通过 X 上传。",
      "Rendered as images before upload.": "上传前渲染为图片。",
      "Inserted as X tweet atomic blocks.": "作为 X 推文嵌入插入。",
      "Inserted as X Markdown/code atomic blocks.": "作为 X 代码块插入。",
      "Inserted as X divider atomic blocks.": "作为 X 分隔线插入。",
      "Inserted as embedded tweets in X.": "作为 X 推文嵌入插入。",
      "Inserted as code blocks in X.": "作为 X 代码块插入。",
      "Inserted as dividers in X.": "作为 X 分隔线插入。",
      "Relative image paths need a readable folder.": "相对图片路径需要可读取文件夹。",
      "Import ledger": "导入明细",
      "Block-by-block plan": "逐块导入计划",
      "Detailed import plan": "详细导入计划",
      "What xPoster will do": "xPoster 将执行什么",
      "How the draft will be placed": "草稿会怎样放入 X",
      "Load Markdown to see each block's import path.": "加载 Markdown 后查看每个内容块会如何导入。",
      "Load Markdown to see what each block will become.": "加载 Markdown 后查看每个内容块会变成什么。",
      "Load Markdown to see how each part will be handled.": "加载 Markdown 后查看每一部分会如何处理。",
      "No draft loaded": "未加载草稿",
      "No draft loaded.": "未加载草稿。",
      "Each Markdown block will be mapped to HTML paste, media upload, atomic replacement, or metadata.": "每个 Markdown 块会显示为文本、媒体、特殊内容、标题或封面。",
      "Each Markdown block will show whether it becomes text, media, special content, title, or cover.": "每个 Markdown 块会显示为文本、媒体、特殊内容、标题或封面。",
      "Each Markdown block will show whether it becomes text, media, title, cover, or another X content block.": "每个 Markdown 块会显示为文本、媒体、标题、封面或其他 X 内容块。",
      "Each part of the draft will show whether it becomes text, media, title, cover, or another article item.": "草稿里的每一部分会显示为文本、媒体、标题、封面或其他文章内容。",
      "Draft review": "草稿提示",
      "Draft notes": "草稿提示",
      "Write Markdown to get publishing notes.": "输入 Markdown 获取发布提示。",
      "Publishing check": "发布前检查",
      "Ready check": "准备检查",
      "Before importing": "导入前检查",
      "Check before import": "导入前检查",
      "Draft, target, editor bridge, uploads, and local assets.": "检查草稿、X 文章、编辑器连接、上传能力和本地图片。",
      "Draft, X Article, editor connection, uploads, and local images.": "检查草稿、X 文章、编辑器连接、上传能力和本地图片。",
      "Checks the draft, X Article tab, editor, images, and import plan.": "检查草稿、X 文章编辑页、编辑器、图片和导入计划。",
      "Paste Markdown to begin.": "粘贴 Markdown 开始。",
      "Open an X Articles tab.": "打开 X 文章 标签页。",
      "Target lock": "文章匹配",
      "Article match": "文章匹配",
      "Current article": "当前文章",
      "Run Check to lock the current article context.": "运行检查以锁定当前文章上下文。",
      "Run Check so xPoster confirms it will use this article.": "点击检查，确认 xPoster 会使用这篇文章。",
      "Click Check X page so xPoster confirms it will use this article.": "点击检查文章，确认 xPoster 会使用这篇文章。",
      "Click Check article so xPoster confirms it will use this article.": "点击检查文章，确认 xPoster 会使用这篇文章。",
      "Waiting for route status.": "等待 X 页面状态。",
      "Waiting for X page status.": "等待 X 页面状态。",
      "Editor content": "已有内容",
      "Existing content": "已有内容",
      "Run Check to see whether the target draft already has content.": "运行检查以确认目标草稿是否已有内容。",
      "Click Check X page to see whether the target draft already has content.": "点击检查文章，确认目标草稿是否已有内容。",
      "Click Check article to see whether the target draft already has content.": "点击检查文章，确认目标草稿是否已有内容。",
      "Run a check with the X tab active.": "在 X 标签页活动时运行检查。",
      "X editor access": "X 编辑器访问",
      "Can write to X": "可写入 X",
      "Open X Articles before locking the target.": "锁定目标前请先打开 X 文章。",
      "No X Article editor detected.": "未检测到 X 文章编辑器。",
      "No existing editor content detected.": "未检测到现有编辑器内容。",
      Uploads: "上传",
      "Image uploads": "图片上传",
      "No image upload requirement detected yet.": "尚未检测到图片上传需求。",
      "No image or table uploads required.": "无需上传图片或表格。",
      Assets: "素材",
      "Local image folder is optional.": "本地图片文件夹是可选项。",
      "No local image paths detected.": "未检测到本地图片路径。",
      "Remote images": "网页图片",
      "Remote image URLs are already allowed.": "网页图片会在写入时自动尝试处理。",
      "Remote image URLs need permission before upload.": "网页图片写入时会自动尝试处理。",
      "Web image links need approval before upload.": "网页图片链接会在写入时自动尝试处理。",
      "Web image links need approval": "网页图片链接会自动处理",
      "Web images can upload after one Chrome approval": "网页图片可下载时即可上传",
      "Allow image website first.": "直接写入即可。",
      "Allow the image website.": "直接写入即可。",
      "Allow site": "网页图片",
      "Check X": "检查 X",
      "Check images": "图片结果",
      Plan: "计划",
      "No import plan generated yet.": "尚未生成导入计划。",
      "No import plan available yet.": "尚无可用导入计划。",
      "Execution timeline": "导入步骤",
      "Import steps": "导入步骤",
      "Load Markdown to see how xPoster will move through X.": "加载 Markdown 后查看 xPoster 在 X 中的执行流程。",
      "Load Markdown to see the steps xPoster will run.": "加载 Markdown 后查看 xPoster 会执行哪些步骤。",
      "Parse Markdown": "解析 Markdown",
      "Waiting for a draft.": "等待草稿。",
      "Prepare media": "准备媒体",
      "Images and tables will be prepared after parsing.": "图片和表格会在解析后准备。",
      "Paste HTML": "写入正文",
      "Write article body": "写入正文",
      "The generated HTML body is not ready yet.": "生成的 HTML 正文尚未准备好。",
      "Replace markers": "放置特殊内容",
      "Place special content": "放置特殊内容",
      "Place embeds and code": "放置嵌入和代码",
      "Draft.js bridge status is unknown.": "X 编辑器状态未知。",
      "Editor connection status is unknown.": "X 编辑器状态未知。",
      "X editor status is unknown.": "X 编辑器状态未知。",
      "Set title and cover": "设置标题和封面",
      "Metadata will be attempted when available.": "可用时会尝试设置标题和封面。",
      "Title and cover will be added when available.": "有标题和封面时会自动设置。",
      "Title will be applied when X allows it.": "X 允许时会设置标题。",
      "Cover will be applied when X allows it.": "X 允许时会设置封面。",
      "Title and cover will be applied when X allows it.": "X 允许时会设置标题和封面。",
      "No title or cover is available to apply.": "没有可设置的标题或封面。",
      "Capture evidence": "保存记录",
      "Save import record": "保存导入记录",
      "Save a run record": "保存运行记录",
      "No diagnostics or import evidence captured yet.": "尚未保存检查或导入记录。",
      "No check or import record saved yet.": "尚未保存检查或导入记录。",
      "Nothing saved yet.": "尚未保存任何记录。",
      "Paste or load Markdown before any import work can start.": "开始任何导入工作前，请先粘贴或加载 Markdown。",
      "Live import progress": "导入进度",
      "Import progress": "导入进度",
      "Import status": "导入状态",
      "Writing status": "写入进度",
      "No import event received yet.": "尚未收到导入事件。",
      "Waiting for a draft or import action.": "等待草稿或导入操作。",
      "Waiting for Markdown or Write.": "等待 Markdown 或写入操作。",
      "Waiting for import": "等待导入",
      "Nothing is running": "当前没有运行任务",
      "Drop or paste a draft, then click Write to X draft.": "拖入或粘贴草稿后，点击写入到 X 草稿。",
      "Article writing progress": "文章写入进度",
      "No writing updates yet": "暂无写入更新",
      "Write progress appears here while xPoster fills X.": "xPoster 写入 X 时，这里会显示进度。",
      "Run Import to stream parser, media, bridge, and completion events from the active X tab.": "运行导入后，侧边栏会显示当前 X 标签页中的导入进度。",
      "Run Import to see what xPoster is doing in the active X tab.": "运行导入后查看 xPoster 在当前 X 标签页里的进度。",
      "Run Import to see each step while xPoster fills the active X Article.": "运行导入后查看 xPoster 填写当前 X 文章 的每一步。",
      "No live events": "暂无导入更新",
      "No import updates yet": "暂无导入更新",
      "The side panel will record status, parse, completion, and error events during import.": "导入时侧边栏会显示进度和错误。",
      "The side panel will show progress and errors while importing.": "导入时侧边栏会显示进度和错误。",
      Recovery: "下一步修复",
      "If something goes wrong": "如果出错",
      "No failure captured yet.": "尚未捕获失败。",
      "No problem found yet.": "尚未发现问题。",
      "Current blocker and recovery action.": "当前需要先处理的问题。",
      "Resolve import gate": "处理导入前问题",
      "Keep diagnostics close": "保留恢复记录",
      "Keep a recovery record": "保留恢复记录",
      "Save what happened": "保存发生了什么",
      "Run Check or Import to create a recovery trail if X changes.": "运行检查或导入，记录发生了什么，方便 X 变化时排查。",
      "Run Check or Import to record what happened if X changes.": "运行检查或导入，记录发生了什么，方便 X 变化时排查。",
      "Run Check or Import so xPoster can show the exact problem if X changes.": "运行检查或导入，这样 X 变化时 xPoster 能显示具体问题。",
      "Use Check X page or Import so xPoster can show the exact problem if X changes.": "使用检查文章或导入，这样 X 变化时 xPoster 能显示具体问题。",
      "Use Check article or Import so xPoster can show the exact problem if X changes.": "使用检查文章或导入，这样 X 变化时 xPoster 能显示具体问题。",
      "Import to X Article": "导入到 X 文章",
      "Open X Articles": "打开 X 文章",
      "Import to X": "导入到 X",
      "Import draft": "导入",
      "Write Article": "写入文章",
      "2. Write Article": "2. 写入文章",
      "Write to X Article": "写入 X 文章",
      "Write to X draft": "写入到 X 草稿",
      "Write article": "写入文章",
      "Write all drafts": "批量写入",
      "Writing all...": "正在批量写入...",
      "Write this draft": "写入这篇",
      "Save only": "仅保存",
      "Add Markdown first": "先放入 Markdown",
      "Article written": "文章已写入",
      "Writing article": "正在写入文章",
      "Ready to write. Web images that Chrome cannot read will stay as Markdown links.": "可以写入。Chrome 暂时无法读取的网页图片会保留为 Markdown 图片链接。",
      "Uses the current X Article if one is open. Otherwise xPoster creates a new one.": "如果当前已经打开 X 文章，就写入当前文章；否则 xPoster 会新建一篇。",
      "Uses current X Article, or creates one.": "使用当前 X 文章，或新建一篇。",
      "Paste Markdown first.": "请先粘贴 Markdown。",
      "Add Markdown first": "先放入 Markdown",
      "Paste or drop Markdown into the editor above.": "先添加或拖入 Markdown 草稿。",
      "Add a Markdown draft first.": "请先添加 Markdown 草稿。",
      "Writing queued drafts one by one.": "正在逐篇写入队列草稿。",
      "Queued drafts are written one by one. Each successful draft leaves the list.": "队列草稿会逐篇写入。成功写入后会从列表移除。",
      "Stop": "停止",
      "Stopping...": "正在停止...",
      "Stop requested. xPoster will stop before the next upload step.": "已请求停止。xPoster 会在下一个上传步骤前停下。",
      "Writing stopped by user.": "写入已停止。",
      Stopped: "已停止",
      "Stop request failed: active X tab did not respond": "停止请求失败：当前 X 标签页没有响应",
      [X_ARTICLE_MEDIA_LIMIT_WARNING]: "X 文章媒体提醒：xPoster 实测 X 文章单篇最多可接收 25 个图片上传项。这篇草稿有 {count} 个媒体上传项；超出的图片可能会被 X 拒绝。",
      "X Article media note": "X 文章媒体提醒",
      "Review before writing": "写入前确认",
      "Focus the Markdown editor below.": "光标已放到下面的 Markdown 编辑框。",
      "Review queue": "检查队列",
      "Write queue": "写入队列",
      "Write all drafts or edit one.": "批量写入，或打开某一篇单独编辑。",
      "Write queued drafts": "写入队列草稿",
      "Ready to write queued drafts one by one.": "可以逐篇写入队列草稿。",
      "Batch draft writing started.": "开始批量写入草稿。",
      "Queued draft not found": "未找到队列草稿",
      "Writing into X. You can watch the final result in the X Article tab.": "正在写入 X。可以在 X 文章标签页查看结果。",
      "Writing into the X draft. You can watch the final result in the X Article tab.": "正在写入 X 草稿。可以在 X 文章标签页查看结果。",
      "Writing...": "正在写入...",
      "Writing to X draft...": "正在写入 X 草稿...",
      "Writing article started.": "开始写入文章。",
      "Writing queued": "写入已排队",
      "Writing started from side panel.": "已从侧边栏开始写入。",
      "Writing complete in": "写入完成，用时",
      "media warning(s).": "个媒体提醒。",
      "Writing complete": "写入完成",
      "Writing failed": "写入失败",
      "Writing finished.": "写入完成。",
      "Writing": "正在写入",
      "Article is written.": "文章已写入。",
      "Written. Review and publish in X.": "已写入。请在 X 中检查并发布。",
      "Written. Review in X.": "已写入，请在 X 中检查。",
      "Markdown ready.": "Markdown 已准备好。",
      "Ready. xPoster will fill the open X Article, then you review it before publishing.": "准备好了。xPoster 会填入打开的 X 文章草稿，然后由你检查并发布。",
      "Local images": "本地图片",
      "Local image folder": "本地图片文件夹",
      "Not configured": "未配置",
      "Choose from an active X page": "从活动 X 页面选择",
      "Choose from an active X page when Markdown uses relative image paths.": "当 Markdown 使用相对图片路径时，请从活动 X 页面选择文件夹。",
      Choose: "选择",
      Clear: "清除",
      "Last import": "上次导入",
      "Special blocks": "特殊块",
      Elapsed: "耗时",
      "Live verification": "最终验证",
      "Review after import": "导入后检查",
      "Finish after import": "导入后收尾",
      "After import": "导入后",
      "Follow the X Articles smoke path from fixture to evidence package.": "从测试草稿开始，完成导入、检查文章结果，并保存记录。",
      "Confirm the X Article looks right before you finish.": "完成前确认 X 文章看起来正确。",
      Focus: "聚焦",
      "Load example": "加载样例",
      "Load fixture": "加载样例",
      "Load the example draft or keep the current Markdown draft.": "加载样例草稿，或保留当前 Markdown 草稿。",
      "Load the smoke fixture or keep the current Markdown draft.": "加载烟测草稿，或保留当前 Markdown 草稿。",
      "Open target": "打开目标",
      "Open article": "打开文章",
      "Use an active X Articles tab.": "使用当前 X 文章编辑页。",
      "Check bridge": "检查编辑器连接",
      "Check editor": "检查编辑器",
      "Check X editor": "检查 X 编辑器",
      "Make sure xPoster can reach the X editor and upload media.": "确认 xPoster 能连接 X 编辑器并上传媒体。",
      "Make sure xPoster can reach the article editor and upload images.": "确认 xPoster 能连接文章编辑器并上传图片。",
      "Verify Draft.js and upload handler readiness.": "检查 X 编辑器和图片上传是否可用。",
      "Import draft": "导入",
      "Import only after the gate is ready.": "发布前检查通过后再导入。",
      "Import only after the check passes.": "发布前检查通过后再导入。",
      "Inspect result": "检查结果",
      "Review in X": "在 X 中检查",
      "Check the imported title, formatting, images, tables, embeds, code, and dividers.": "检查导入后的标题、格式、图片、表格、嵌入、代码和分隔线。",
      "Record title, formatting, media, embeds, atomic blocks, markers, and diagnostics.": "检查标题、格式、图片、表格、推文、代码和分隔线。",
      Review: "复查",
      "Package evidence": "保存记录",
      "Save records": "保存记录",
      "Save a local record": "保存本地记录",
      "Copy or save a local record of the import.": "复制或保存本次导入的本地记录。",
      "Copy or save the final evidence package.": "复制或保存最终证据包。",
      Package: "打包",
      "Article review": "文章检查",
      "Review in X": "在 X 中检查",
      "Tick what you confirmed in the X Article after import.": "导入后，把你已在 X 文章中确认的项目勾上。",
      "Proof deck": "完成记录",
      "Completion records": "完成记录",
      "Saved run checklist": "保存的运行清单",
      "Saved import checklist": "保存导入清单",
      "This import is complete only after you review the X Article.": "你检查完 X 文章后，这次导入才算完成。",
      "Live completion is unproven until the X pass is recorded.": "记录 X 文章结果后，才能确认本次运行完成。",
      "This run is complete only after the X Article result is recorded.": "记录 X 文章结果后，才能确认本次运行完成。",
      Path: "路径",
      Copy: "复制",
      "Loaded unpacked": "已加载解包扩展",
      "Loaded example Markdown draft.": "已加载样例 Markdown 草稿。",
      "Extension loaded": "扩展已加载",
      "Confirm this folder is loaded in the signed-in Chrome profile.": "确认此文件夹已加载到已登录的 Chrome 配置中。",
      "Confirm xPoster is loaded in the signed-in Chrome profile.": "确认 xPoster 已加载到已登录的 Chrome 配置中。",
      "Load this folder as an unpacked extension in Chrome.": "在 Chrome 中将此文件夹作为解包扩展加载。",
      "Editor bridge": "编辑器连接",
      "Editor connection": "编辑器连接",
      "Run diagnostics after an article editor opens.": "文章编辑器打开后运行检查。",
      "Run Check after an article editor opens.": "文章编辑器打开后运行检查。",
      "Click Check article after an article editor opens.": "文章编辑器打开后点击检查文章。",
      "Run Check after the X Article editor is visible.": "X 文章编辑器可见后运行检查。",
      "Click Check article after the X Article editor is visible.": "X 文章编辑器可见后点击检查文章。",
      "Import run": "导入运行",
      "Import completed": "导入已完成",
      "No import evidence captured.": "未捕获导入证据。",
      "No import record saved yet.": "尚未保存导入记录。",
      "Article result": "文章结果",
      "Article reviewed": "文章已检查",
      "0/9 final result checks recorded.": "已记录 0/9 项最终结果检查。",
      "Evidence package": "记录包",
      "Saved record package": "记录包",
      "Saved records": "已保存记录",
      "Save or copy results": "保存或复制结果",
      "Copy or save after the final result is complete.": "最终结果完成后复制或保存。",
      "Needs import evidence plus a complete live result checklist.": "需要导入证据和完整实时结果清单。",
      "Needs an import record and a complete article review.": "需要导入记录和完整文章检查。",
      "Completion audit": "最终检查",
      "Final checklist": "最终检查",
      "Final completion requires live X evidence.": "最终完成需要 X 实测证据。",
      "Finish the X Article review before treating this run as done.": "完成 X 文章检查后，才算本次运行完成。",
      "Final completion requires a real X Article review.": "最终完成需要真实 X 文章检查。",
      "Unpacked extension": "解包扩展",
      "Load xPoster in the signed-in Chrome profile.": "在已登录的 Chrome 配置中加载 xPoster。",
      "Load this folder in the signed-in Chrome profile.": "在已登录的 Chrome 配置中加载此文件夹。",
      "Load the xPoster folder as an unpacked extension in signed-in Chrome.": "在已登录 Chrome 中将 xPoster 文件夹加载为解包扩展。",
      "Smoke draft": "样例草稿",
      "Example draft": "样例草稿",
      "Markdown draft": "Markdown 草稿",
      "Load the smoke fixture or a real Markdown draft.": "加载样例，或使用真实 Markdown 草稿。",
      "Load the example or use a real Markdown draft.": "加载样例，或使用真实 Markdown 草稿。",
      "Load the smoke fixture or paste Markdown before live verification.": "检查前请加载样例或粘贴 Markdown。",
      "Bridge and upload": "编辑器和上传",
      "Editor and upload": "编辑器和上传",
      "Editor and media": "编辑器和媒体",
      "Editor and images": "编辑器和图片",
      "Run diagnostics in the live X editor.": "在实时 X 编辑器中运行检查。",
      "Run Check in the live X editor.": "在实时 X 编辑器中运行检查。",
      "Click Check X page in the live X editor.": "在实时 X 编辑器中点击检查文章。",
      "Click Check article in the live X editor.": "在实时 X 编辑器中点击检查文章。",
      "Click Check article in the live X editor.": "在实时 X 编辑器中点击检查文章。",
      "Import evidence": "导入记录",
      "Import record": "导入记录",
      "No import run captured yet.": "尚未记录导入运行。",
      "No import run recorded yet.": "尚未记录导入运行。",
      "Record final article checks after import.": "导入后记录最终文章检查。",
      "Page import path": "页面导入路径",
      "X page import button": "X 页面导入按钮",
      "Markdown file import": "Markdown 文件导入",
      "Verify the X-page import button and file picker.": "验证 X 页面导入按钮和文件选择器。",
      "Verify the file picker can import a Markdown draft.": "验证文件选择器可以导入 Markdown 草稿。",
      "Verify the X Articles page import button/file picker path.": "验证 X 文章页面导入按钮/文件选择器路径。",
      "Needs import evidence and a complete live result checklist.": "需要导入证据和完整实时结果清单。",
      "Evidence and audit details": "记录和最终检查",
      "Records and audit details": "记录和最终检查",
      "Saved records and final checks": "保存记录和最终检查",
      "Local import records, final audit, and raw diagnostic package.": "本地导入记录、最终检查和原始诊断包。",
      "Open this only when you need a copy of the run details.": "只有需要复制运行详情时再打开。",
      "Import records": "导入记录",
      "Saved import records": "已保存的导入记录",
      "Open this when you need to copy or save what happened.": "需要复制或保存本次发生了什么时再打开。",
      "Open this when you need to copy or save the import result.": "需要复制或保存导入结果时打开这里。",
      "Open this after Check or Import when you need a local record.": "检查或导入后，需要本地记录时再打开这里。",
      "Completion proof, final audit, and raw evidence package.": "完成记录、最终检查和原始记录包。",
      "Live result": "实时结果",
      "Record the final X Article result after import.": "导入后记录最终 X 文章结果。",
      Reset: "重置",
      "Title set": "标题已设置",
      "xPoster live smoke test or the selected draft title.": "xPoster 实时烟测标题或选中草稿标题。",
      "The title from your selected draft.": "选中草稿里的标题。",
      "Text formatting": "文本格式",
      "Heading 1": "一级标题",
      "Heading 2": "二级标题",
      "Heading 3": "三级标题",
      "Heading 4": "四级标题",
      "Heading 5": "五级标题",
      "Heading 6": "六级标题",
      Quote: "引用",
      Bullet: "项目符号",
      Numbered: "编号列表",
      Paragraph: "段落",
      Table: "表格",
      Tweet: "推文",
      Image: "图片",
      Code: "代码",
      Divider: "分割线",
      Content: "内容",
      Upload: "上传",
      "Special content": "特殊内容",
      "Paragraph, quote, lists, inline styles, and link are preserved.": "段落、引用、列表、行内样式和链接均保留。",
      "Image uploaded": "图片已上传",
      "Body image is present after X upload completes.": "X 上传完成后正文图片存在。",
      "Images appear in the article after X upload completes.": "X 上传完成后图片显示在文章里。",
      "Table image": "表格图片",
      "Markdown table is rendered and uploaded as an image.": "Markdown 表格会渲染并作为图片上传。",
      "Tweet embed": "推文嵌入",
      "Tweet URL becomes an embedded tweet block.": "推文 URL 会变成嵌入推文块。",
      "Code and divider": "代码和分隔线",
      "Fenced code and horizontal rule become X atomic blocks.": "代码块和分隔线显示正确。",
      "Code blocks and dividers appear correctly.": "代码块和分隔线显示正确。",
      "Markers cleaned": "临时文本已移除",
      "Temporary text removed": "临时文本已移除",
      "No __XPOSTER_ text remains in the article.": "文章中没有残留 xPoster 占位文本。",
      "No xPoster placeholder text remains in the article.": "文章中没有残留 xPoster 占位文本。",
      "Diagnostics healthy": "编辑器检查通过",
      "Editor check passed": "编辑器检查通过",
      "Check passed": "检查通过",
      "Popup still reports MAIN bridge and upload handler readiness.": "xPoster 仍能连接编辑器并上传媒体。",
      "xPoster can still reach the editor and media upload.": "xPoster 仍能连接编辑器并上传媒体。",
      "Page import button": "页面导入按钮",
      "File import works": "文件导入可用",
      "X Articles import button opens the file picker and imports a .md draft.": "X 文章导入按钮会打开文件选择器并导入 .md 草稿。",
      "The X Articles page import button can open a Markdown file.": "X 文章页面的导入按钮可以打开 Markdown 文件。",
      "No run captured yet.": "尚未捕获运行。",
      Save: "保存",
      "Copy or save the final record.": "复制或保存最终记录。",
      "Run a publishing check or import to capture diagnostics.": "运行发布前检查或导入以保存记录。",
      "Run a publishing check or import to save a record.": "运行检查或导入以保存记录。",
      "Run Check X page or Import to save a record.": "运行检查文章或导入以保存记录。",
      "Run Check article or Import to save a record.": "运行检查文章或导入以保存记录。",
      "Run Check article or Import to save a record.": "运行检查文章或导入以保存记录。",
      "No check or import saved yet.": "尚未保存检查或导入记录。",
      "No local record saved yet.": "还没有本地记录。",
      "Open this when you need a local record.": "需要本地记录时再打开。",
      "Write an article to save a local record.": "检查或写入文章后会保存详细记录。",
      "Run Check or Write article to save a detailed record.": "运行检查或写入文章后会保存详细记录。",
      "Import behavior": "导入行为",
      "Settings": "设置",
      "Full capability mode": "完整能力模式",
      ["No license gates, no Free/" + "Pro limits, no footer signature."]: "没有许可证门禁、免费/专业版限制或页脚签名。",
      "No trial limits": "没有试用限制",
      "All import features are available.": "所有导入功能都可用。",
      "Everything is included": "功能全部可用",
      "No account, subscription, trial limit, or feature lock.": "不需要账号、订阅，没有试用限制或功能锁。",
      On: "开启",
      "Choose from an active X tab so browser permissions are attached to the page.": "请从活动 X 标签页选择，以便浏览器权限绑定到页面。",
      "Choose the folder that contains relative image paths in your Markdown.": "选择 Markdown 相对图片路径所在的文件夹。",
      "Title and cover": "标题和封面",
      "Uses page UI first, then X Article GraphQL when an article id is available.": "优先使用页面 UI；有文章 ID 时再使用 X 文章接口。",
      "xPoster sets them automatically when the X Article editor allows it.": "当 X 文章编辑器允许时，xPoster 会自动设置。",
      "Choose what xPoster writes into X Article metadata.": "选择 xPoster 要写入 X 文章元信息的内容。",
      "Set article title": "设置文章标题",
      "Use frontmatter title or the first H1.": "使用 frontmatter title 或第一个一级标题。",
      "Set article cover": "设置文章封面",
      "Use frontmatter cover or the first image.": "使用 frontmatter cover 或第一张图片。",
      "Success feedback": "成功反馈",
      "Choose the small celebration shown after a successful write.": "选择写入成功后显示的小反馈。",
      "Celebration animation": "庆祝动画",
      "Show a brief confetti burst when X reports a completed write.": "当 X 返回写入完成时，显示一次短暂彩纸动画。",
      "Completion sound": "完成音效",
      "Play a short local chime after a successful write.": "写入成功后播放一声本地短提示音。",
      "Sound style": "音效风格",
      "Soft chime": "轻柔提示",
      "Warm bell": "温和铃声",
      "Light pop": "轻快弹响",
      "Volume": "音量",
      "Test feedback": "测试反馈",
      "Feedback test": "反馈测试",
      "Use this to confirm animation and sound work in this Chrome profile.": "用它确认当前 Chrome 配置里的动画和音效是否可用。",
      "Project and author": "项目与作者",
      "Open the project page or follow updates from the author.": "打开项目页面，或关注作者更新。",
      "Open GitHub project": "打开 GitHub 项目",
      "GitHub project": "GitHub 项目",
      "Follow author on X": "在 X 关注作者",
      Auto: "自动",
      Activity: "活动",
      "Recent activity": "最近活动",
      "Ready.": "就绪。",
      "Ready": "就绪",
      "Draft blocker": "草稿阻塞",
      "Target blocker": "目标阻塞",
      "Import record ready": "导入记录已准备好",
      "Draft needs attention": "草稿需要处理",
      "X Article needs attention": "X 文章需要处理",
      "X Article lock needs attention": "当前文章需要确认",
      "Current article needs attention": "当前文章需要确认",
      "Editor check needs attention": "编辑器检查需要处理",
      "Existing content needs attention": "已有内容需要处理",
      "Local images needs attention": "本地图片需要处理",
      "Import plan needs attention": "导入计划需要处理",
      "Import gate ready": "可以开始导入",
      "Ready for live import": "可以导入到 X",
      "Inspect imported article": "检查导入后的文章",
      "Completion evidence ready": "完成证据已准备好",
      "Import ready": "可以导入",
      Imported: "已导入",
      "Package ready": "证据包就绪",
      "Final records ready": "最终记录已准备好",
      "Records ready": "记录已准备好",
      "Review done": "检查完成",
      "Result done": "结果完成",
      "Load the smoke fixture or paste Markdown before checking X.": "先加载测试草稿或粘贴 Markdown，然后再检查 X 页面。",
      "Complete the live result checklist first.": "请先完成文章结果检查清单。",
      "Complete the article review checklist first.": "请先完成文章检查清单。",
      "Finish the article review first.": "请先完成文章检查。",
      "The evidence package includes the full import ledger.": "证据包会包含完整导入明细。",
      "Load this folder as an unpacked extension in Chrome.": "请先在 Chrome 中加载这个解包扩展文件夹。",
      "Load the xPoster folder as an unpacked extension in signed-in Chrome.": "请在已登录的 Chrome 中加载 xPoster 这个扩展文件夹。",
      "Side panel is running inside the extension context.": "侧边栏正在扩展环境中运行。",
      "Side panel is running from the extension context.": "侧边栏正在扩展环境中运行。",
      "The active tab must be on x.com/compose/articles before xPoster can import.": "活动标签页必须打开 x.com/compose/articles，xPoster 才能导入。",
      "Open or create an X Article draft in the active tab.": "在当前标签页打开或创建一篇 X 文章草稿。",
      "Open or create the X Article you want to fill. xPoster only writes after you click Import.": "打开或创建要填入内容的 X 文章。只有点击导入后，xPoster 才会写入。",
      "Open or create the X Article you want to fill. Keep that tab active while importing.": "打开或创建要填入内容的 X 文章。导入时保持该标签页处于活动状态。",
      "Open Articles": "打开文章",
      "Open an article editor": "打开文章编辑器",
      "Create or open an X Article draft, then run Check so the Draft.js bridge and upload handler can be verified.": "创建或打开一篇 X 文章草稿，然后运行检查来确认编辑器连接和上传能力。",
      "Create or open an X Article draft, then run Check so xPoster can confirm editor access and media upload.": "创建或打开一篇 X 文章草稿，然后运行检查，确认 xPoster 能访问编辑器并上传媒体。",
      "Create or open an X Article draft, then run Check X page so xPoster can confirm text and image access.": "创建或打开一篇 X 文章草稿，然后点击检查文章，确认 xPoster 能写入文字并上传图片。",
      "Create or open an X Article draft, then click Check article so xPoster can confirm text and image access.": "创建或打开一篇 X 文章草稿，然后点击检查文章，确认 xPoster 能写入文字并上传图片。",
      "Create or open an X Article draft, then click Check article so xPoster can confirm text and image access.": "创建或打开一篇 X 文章草稿，然后点击检查文章，确认 xPoster 能写入文字并上传图片。",
      "Allow the image website": "检查图片下载",
      "Chrome needs one approval before xPoster can read web images from your Markdown and upload them into X.": "xPoster 会在写入时尝试处理 Markdown 里的网页图片，可下载时交给 X 上传。",
      "Run publishing check": "运行发布前检查",
      "Check the X editor": "检查 X 编辑器",
      "Verify the MAIN-world bridge and X upload handler against the active article editor.": "检查当前文章编辑器的连接和上传能力。",
      "Confirm xPoster can write into the active article editor and upload media.": "确认 xPoster 能写入当前文章编辑器并上传媒体。",
      "Confirm xPoster can write into this article and upload media.": "确认 xPoster 能写入这篇文章并上传媒体。",
      "Check that the open X Article can accept text and media before importing.": "导入前检查当前 X 文章 是否能接收文字和媒体。",
      "Check that the open X Article can accept text and upload images before importing.": "导入前检查当前 X 文章是否能接收文字并上传图片。",
      "Check that this X Article can accept text and images before importing.": "导入前检查这篇 X 文章是否能接收文字和图片。",
      "Open the X editor and run Check so images and tables can upload.": "打开 X 编辑器并运行检查，这样图片和表格才能上传。",
      "Check editor": "检查编辑器",
      "Choose local image folder": "选择本地图片文件夹",
      "Relative image paths need a readable folder selected from the active X tab.": "相对图片路径需要从当前 X 标签页选择一个可读取文件夹。",
      "Import into X Article": "导入到 X 文章",
      "The draft, target, bridge, uploads, assets, and import plan are ready.": "草稿、X 页面、编辑器连接、上传、本地图片和导入计划都已准备好。",
      "The draft, X Article, editor access, media upload, local images, and import plan are ready.": "草稿、X 文章、编辑器访问、媒体上传、本地图片和导入计划都已准备好。",
      "Everything needed for this draft is ready. Import, then review the article in X.": "这份草稿需要的准备都完成了。导入后请在 X 里检查文章。",
      "Ready. xPoster will fill the open X Article, then you review it before publishing.": "已准备好。xPoster 会填入当前 X 文章，然后你在发布前检查。",
      "Record live result": "记录文章结果",
      "Review imported article": "检查导入后的文章",
      "Export final evidence": "导出最终证据",
      "Save final records": "保存最终记录",
      "The live result checklist is complete. Copy the evidence package for the completion record.": "文章结果检查清单已完成。复制证据包作为完成记录。",
      "The article review is complete. Copy or save the final records.": "文章检查已完成。复制或保存最终记录。",
      "Import gate is clear; evidence can be exported.": "导入前检查已通过，可以导出证据。",
      "Import checks are clear; records can be exported.": "导入检查已通过，可以导出记录。",
      "Import gate is clear; record the live result after import.": "导入前检查已通过，导入后请记录文章结果。",
      "Import checks are clear; review the article after import.": "导入检查已通过，导入后请检查文章。",
      "Run Import, then inspect the live X Article result.": "运行导入，然后检查 X 文章里的实际结果。",
      "Copy or save the final package with diagnostics, plan, import evidence, and live result checks.": "复制或保存最终证据包，里面包含诊断、导入计划、导入证据和文章结果检查。",
      "Copy or save the final package with checks, import plan, import record, and article review.": "复制或保存最终记录包，里面包含检查、导入计划、导入记录和文章检查。",
      "No active issues": "当前没有问题",
      "The local gate is clean. Continue with the live X smoke path before treating the extension as complete.": "本地检查已通过。确认完成前，请继续完成真实 X 导入验证。",
      "The local checks are clear. Continue with a real X import before treating this run as complete.": "本地检查已通过。确认完成前，请继续完成一次真实 X 导入。",
      "Copy or save the evidence package before treating this run as complete.": "确认本次运行完成前，请先复制或保存证据包。",
      "Copy or save the final records before treating this run as complete.": "确认本次运行完成前，请先复制或保存最终记录。",
      "Add a Markdown draft first.": "请先添加 Markdown 草稿。",
      "Open or create an X Article draft.": "请打开或创建一篇 X 文章草稿。",
      "Click Check so xPoster uses the correct X Article.": "点击检查，确认 xPoster 使用的是正确的 X 文章。",
      "Click Check X page so xPoster confirms the open article.": "点击检查文章，确认 xPoster 会使用当前打开的文章。",
      "Click Check article so xPoster confirms the open article.": "点击检查文章，确认 xPoster 会使用当前打开的文章。",
      "Click Check X page so xPoster confirms this is the article to fill.": "点击检查文章，确认这就是要填入内容的文章。",
      "Click Check article so xPoster confirms this is the article to fill.": "点击检查文章，确认这就是要填入内容的文章。",
      "The open X Article changed after Check. Run Check X page again before importing.": "当前打开的 X 文章在检查后发生了变化。导入前请再次点击检查文章。",
      "The open X Article changed after Check. Run Check article again before importing.": "当前打开的 X 文章在检查后发生了变化。导入前请再次点击检查文章。",
      "Click Check X page before importing.": "导入前请点击检查文章。",
      "Click Check article before importing.": "导入前请点击检查文章。",
      "Click Check article so xPoster confirms the open article.": "点击检查文章，确认 xPoster 会使用当前打开的文章。",
      "Click Check article so xPoster confirms this is the article to fill.": "点击检查文章，确认这就是要填入内容的文章。",
      "The open X Article changed after Check. Run Check article again before importing.": "当前打开的 X 文章在检查后发生了变化。导入前请再次点击检查文章。",
      "Click Check article before importing.": "导入前请点击检查文章。",
      "Refresh the X Article tab so the latest xPoster page script handles images.": "请刷新 X 文章标签页，让最新版 xPoster 页面脚本处理图片。",
      "The draft does not have anything xPoster can import yet.": "这份草稿里还没有 xPoster 可导入的内容。",
      "Click Check after the X editor opens.": "X 编辑器打开后点击检查。",
      "Click Check with the X editor open so images can upload.": "X 编辑器打开后点击检查，这样图片才能上传。",
      "Choose the local image folder.": "请选择本地图片文件夹。",
      "Allow the remote image site.": "网页图片会在写入时处理。",
      "Approve the image website so xPoster can upload Markdown images.": "网页图片会在写入时自动尝试处理。",
      "Click Allow image website if you want xPoster to upload web images, then approve Chrome's prompt.": "如果希望网页图片都上传，请把失败链接换成公开可访问链接。",
      "Click Check downloads if every web image must become an uploaded X image.": "如果每张网页图片都必须上传，请把失败链接换成公开可访问链接。",
      "Ready to import into the active X Article.": "可以导入到当前 X 文章。",
      "Parse Markdown": "解析 Markdown",
      "Prepare media": "准备图片和表格",
      "Replace markers": "替换占位标记",
      "Set title and cover": "设置标题和封面",
      "Capture evidence": "记录证据",
      "Editor visible.": "编辑器已显示。",
      "Draft can be created.": "可以创建草稿。",
      "Final result captured.": "最终结果已记录。",
      "No active import is running.": "当前没有正在运行的导入。",
      "Status update": "状态更新",
      "Markdown parsed": "Markdown 已解析",
      "Import complete": "导入完成",
      "Import failed": "导入失败",
      "Import running": "导入中",
      "Received a live import event from the active X tab.": "已收到当前 X 标签页发来的导入事件。",
      "Preparing Markdown, assets, and the X editor bridge.": "正在准备 Markdown、图片和 X 编辑器。",
      "Writing generated HTML and marker placeholders into X.": "正在把正文写入 X。",
      "Uploading prepared images and rendered tables through X.": "正在通过 X 上传准备好的图片和渲染后的表格。",
      "Replacing marker paragraphs with media and atomic blocks.": "正在把图片、推文和代码放到正确位置。",
      "Applying article metadata after the body import.": "正文导入后正在设置标题和封面。",
      "The import run reported completion.": "导入流程已报告完成。",
      "Live status received from the active X tab.": "已收到当前 X 标签页发来的实时状态。",
      "The active X tab reported a completed import.": "当前 X 标签页报告导入已完成。",
      "elapsed time unknown": "耗时未知",
      "Classify the failed import": "查看失败原因",
      "Open Evidence to inspect the import error payload.": "打开记录，查看导入错误详情。",
      "Rerun the bridge check": "重新检查 X 页面",
      "Confirm Draft.js, upload handler, route, article id, and vault state before retrying.": "重试前请确认当前 X 文章、图片上传和本地图片文件夹状态。",
      "Editor bridge is not clean": "X 编辑器还不能写入",
      "X may have changed its Draft.js or upload internals. Capture diagnostics before retrying.": "X 页面可能变化了。重试前请先保存检查记录。",
      "Run the live import": "运行真实导入",
      "Gate is ready. Import once, then inspect the X Article before packaging evidence.": "检查已通过。导入一次，然后检查 X 文章，再保存记录。",
      "Inspect partial import": "检查部分导入结果",
      "Complete result review": "完成结果检查",
      "Package final evidence": "打包最终证据",
      "Result review is complete. Copy or save the evidence package.": "结果检查已完成。请复制或保存证据包。",
      "Local image folder pending": "本地图片文件夹待处理",
      "Choose a readable local image folder before importing local paths.": "导入本地路径图片前，请选择一个可读取的本地图片文件夹。",
      "Diagnostics evidence captured": "已捕获诊断证据",
      "Keep this JSON with any failed live run so parser, gate, and bridge state can be compared.": "请保留这份记录，方便失败后对比草稿、检查项和 X 页面状态。",
      "Failure captured; preserve evidence before retrying.": "已记录失败信息；重试前请保留证据。",
      "Diagnostics found a live editor blocker.": "诊断发现当前编辑器有阻塞问题。",
      "Import evidence exists; finish result review and package.": "已有导入证据；请完成结果检查并打包。",
      "Gate ready; run one live import.": "导入前检查已通过；请运行一次真实导入。",
      "No active tab": "没有活动标签页",
      "No publishable blocks detected yet.": "尚未检测到可发布内容块。",
      "Untitled article": "未命名文章",
      "Horizontal divider": "水平分隔线",
      Paste: "粘贴",
      Upload: "上传",
      "Table image": "表格图片",
      Image: "图片",
      "prepared media": "已准备的媒体",
      "code block": "代码块",
      divider: "分隔线",
      "HTML paste": "HTML 粘贴",
      Metadata: "标题和封面",
      "Media upload": "媒体上传",
      "Atomic block": "特殊内容",
      Fallback: "备用方案",
      "Article title": "文章标题",
      "Article cover": "文章封面",
      "Heading 1": "一级标题",
      "Heading 2": "二级标题",
      "Heading 3": "三级标题",
      "Heading 4": "四级标题",
      "Heading 5": "五级标题",
      "Heading 6": "六级标题",
      Quote: "引用",
      "Bullet item": "项目符号",
      "Numbered item": "编号项目",
      Paragraph: "段落",
      "Empty text block": "空文本块",
      "Absolute local paths are blocked; use a path relative to the vault.": "已阻止绝对本地路径；请使用相对于所选文件夹的路径。",
      "Image marker": "图片位置",
      "Markdown table": "Markdown 表格",
      "table image": "表格图片",
      "Tweet marker": "推文位置",
      "Code block": "代码块",
      "Code marker": "代码位置",
      "Divider marker": "分隔线位置",
      "Unknown block": "未知内容块",
      "This block will be preserved as plain text if xPoster cannot map it.": "如果 xPoster 无法转换这个块，会按纯文本保留。",
      "No blockers found": "未发现阻塞项",
      "Title setting is off; headings stay in the article body.": "标题设置已关闭；标题会留在正文中。",
      "No title detected. Add frontmatter title or a first-level heading.": "未检测到标题。请添加 frontmatter title 或一级标题。",
      "Cover setting is off; images stay in the article body.": "封面设置已关闭；图片会留在正文中。",
      "Cover source matches an image in the article body.": "封面来源与正文中的图片匹配。",
      "Cover source is not also present as a body image; X cover assignment may be skipped.": "封面来源没有出现在正文图片中，X 可能跳过封面设置。",
      "No cover candidate detected. Add frontmatter cover or a first image.": "未检测到封面候选项。请添加 frontmatter cover 或第一张图片。",
      "No media uploads required.": "无需上传媒体。",
      "Images or rendered tables need X upload handler.": "图片或渲染后的表格需要 X 上传能力。",
      "Run Check to lock the active X Article target.": "运行检查，确认当前 X 文章就是要导入的文章。",
      "Will set article title through UI and GraphQL when available.": "导入时会尽量设置文章标题。",
      "Add frontmatter title or a first H1.": "请添加 frontmatter title 或第一个一级标题。",
      "Will match the uploaded image and assign it as cover when article id is available.": "导入时会尽量把匹配的图片设为封面。",
      "Cover source has no matching body image; cover assignment may be skipped.": "封面来源没有匹配的正文图片，可能会跳过封面设置。",
      "Add frontmatter cover or a first image.": "请添加 frontmatter cover 或第一张图片。",
      "Will paste as structured HTML before marker replacement.": "会先写入正文，再放置图片、推文和代码。",
      "No text blocks detected.": "未检测到文本块。",
      "Prepared images can use X upload handler.": "准备好的图片可使用 X 上传能力。",
      "Needs X upload handler from a live article editor.": "需要打开真实文章编辑器后才能上传。",
      "No image uploads detected.": "未检测到需要上传的图片。",
      "Tables render to PNG and upload through X.": "表格会渲染为 PNG 并通过 X 上传。",
      "Tables render locally but still need X upload handler.": "表格可在本地渲染，但仍需要 X 上传能力。",
      "No tables detected.": "未检测到表格。",
      "Tweet embeds can be inserted through Draft.js atomic blocks.": "推文链接可以作为嵌入内容放入文章。",
      "Needs MAIN-world Draft.js bridge.": "需要 X 编辑器可写入。",
      "No tweet URLs detected.": "未检测到推文 URL。",
      "Fenced code can be inserted as Markdown atomic blocks.": "代码块可以放入文章。",
      "No fenced code blocks detected.": "未检测到围栏代码块。",
      "Horizontal rules can be inserted as divider atomic blocks.": "分隔线可以放入文章。",
      "No dividers detected.": "未检测到分隔线。",
      "Remote image URLs will be fetched after you allow their source site.": "写入时会尝试处理网页图片 URL。",
      "Remote image URLs need source-site permission before upload.": "网页图片 URL 写入时会尝试处理。",
      "Remote HTTP images": "网页图片",
      "Remote image URL": "网页图片 URL",
      "Allow the image site to upload this image.": "图片可下载后即可上传这张图片。",
      "Absolute local paths are blocked; use paths relative to the selected folder.": "已阻止绝对本地路径；请使用相对于所选文件夹的路径。",
      "Relative local images can resolve through the selected folder.": "相对路径本地图片可通过所选文件夹读取。",
      "Choose a readable folder from the active X page.": "请从当前 X 页面选择一个可读取文件夹。",
      "No local image paths require folder access.": "没有本地图片路径需要文件夹权限。",
      "Article export": "文章导出",
      "Show a quiet Markdown copy/download button on readable X Articles.": "在可读取的 X 文章页显示低调的 Markdown 复制/下载按钮。",
      "Show Markdown export button": "显示 Markdown 导出按钮",
      "Copy or download article pages as standard Markdown.": "将文章页面复制或下载为标准 Markdown。",
      Done: "完成",
      Blocked: "阻塞",
      Running: "运行中",
      Idle: "空闲",
      Skipped: "跳过",
      Partial: "部分完成",
      Failed: "失败",
      Waiting: "等待",
      Hidden: "隐藏",
      More: "更多"
    })
  );
  const EN_TEXT = new Map(Array.from(ZH_TEXT.entries()).map(([en, zh]) => [zh, en]));
  i18n?.registerMessages({
    en: Object.fromEntries(Array.from(ZH_TEXT.keys()).map((key) => [key, key])),
    zh: Object.fromEntries(ZH_TEXT)
  });

  const hasChromeApi = () =>
    typeof chrome !== "undefined" && Boolean(chrome.storage?.local && chrome.tabs);

  const themeMediaQuery =
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-color-scheme: dark)")
      : null;
  let currentThemeMode = "light";

  function preferredLanguage() {
    return i18n?.preferredLanguage?.() || (/^zh\b/i.test(navigator.language || "") ? "zh" : "en");
  }

  function normalizeThemeMode(mode) {
    return THEME_MODES.has(mode) ? mode : "light";
  }

  function resolveTheme(mode = currentThemeMode) {
    if (mode === "system") return themeMediaQuery?.matches ? "dark" : "light";
    return normalizeThemeMode(mode);
  }

  function syncThemeChoice() {
    if (!els.themeChoice) return;
    els.themeChoice.querySelectorAll('input[name="themeMode"]').forEach((input) => {
      input.checked = input.value === currentThemeMode;
    });
  }

  function normalizeImportOptions(options = {}) {
    return {
      setTitle: options.setTitle !== false,
      setCover: options.setCover !== false
    };
  }

  function parseDraftMarkdown(markdown, options = importOptions) {
    return shared.parseMarkdown(markdown, normalizeImportOptions(options));
  }

  function importOptionsPayload() {
    return normalizeImportOptions(importOptions);
  }

  function syncImportOptionsControls() {
    if (els.importTitleOption) els.importTitleOption.checked = importOptions.setTitle !== false;
    if (els.importCoverOption) els.importCoverOption.checked = importOptions.setCover !== false;
  }

  function applyImportOptions(options = importOptions) {
    importOptions = normalizeImportOptions(options);
    syncImportOptionsControls();
    if (latestParsed?.segments?.length || els.markdown?.value?.trim()) analyzeDraft();
    else {
      syncRemoteImageAccessStatusFromDraft(null);
      updatePreflight();
    }
  }

  async function setImportOptions(nextOptions, { persist = true } = {}) {
    applyImportOptions(nextOptions);
    if (persist && hasChromeApi()) {
      await chrome.storage.local.set({ [STORAGE_IMPORT_OPTIONS]: importOptionsPayload() });
    }
  }

  async function restoreImportOptions() {
    if (hasChromeApi()) {
      const stored = await chrome.storage.local.get(STORAGE_IMPORT_OPTIONS).catch(() => ({}));
      applyImportOptions(stored[STORAGE_IMPORT_OPTIONS] || importOptions);
      return;
    }
    applyImportOptions(importOptions);
  }

  function normalizeArticleExportOptions(options = {}) {
    return {
      enabled: options.enabled !== false,
      mode: options.mode === "download" ? "download" : "copy"
    };
  }

  function syncArticleExportControls() {
    if (els.articleExportOption) els.articleExportOption.checked = articleExportOptions.enabled !== false;
  }

  function applyArticleExportOptions(options = articleExportOptions) {
    articleExportOptions = normalizeArticleExportOptions(options);
    syncArticleExportControls();
  }

  async function setArticleExportOptions(nextOptions, { persist = true } = {}) {
    applyArticleExportOptions(nextOptions);
    if (persist && hasChromeApi()) {
      await chrome.storage.local.set({ [STORAGE_ARTICLE_EXPORT_SETTINGS]: normalizeArticleExportOptions(articleExportOptions) });
    }
  }

  async function restoreArticleExportOptions() {
    if (hasChromeApi()) {
      const stored = await chrome.storage.local.get(STORAGE_ARTICLE_EXPORT_SETTINGS).catch(() => ({}));
      applyArticleExportOptions(stored[STORAGE_ARTICLE_EXPORT_SETTINGS] || articleExportOptions);
      return;
    }
    applyArticleExportOptions(articleExportOptions);
  }

  function normalizeSuccessFeedbackOptions(options = {}) {
    const volume = Number(options.volume);
    return {
      confetti: options.confetti !== false,
      sound: options.sound !== false,
      soundStyle: SUCCESS_SOUND_STYLES.has(options.soundStyle) ? options.soundStyle : "soft",
      volume: Number.isFinite(volume) ? Math.min(1, Math.max(0.2, volume)) : SUCCESS_SOUND_DEFAULT_VOLUME
    };
  }

  function successFeedbackPayload() {
    return normalizeSuccessFeedbackOptions(successFeedbackOptions);
  }

  function syncSuccessFeedbackControls() {
    if (els.confettiOption) els.confettiOption.checked = successFeedbackOptions.confetti !== false;
    if (els.successSoundOption) els.successSoundOption.checked = successFeedbackOptions.sound !== false;
    if (els.successSoundStyle) els.successSoundStyle.value = successFeedbackOptions.soundStyle || "soft";
    if (els.successSoundVolume) els.successSoundVolume.value = String(Math.round((successFeedbackOptions.volume || SUCCESS_SOUND_DEFAULT_VOLUME) * 100));
  }

  function applySuccessFeedbackOptions(options = successFeedbackOptions) {
    successFeedbackOptions = normalizeSuccessFeedbackOptions(options);
    syncSuccessFeedbackControls();
  }

  async function setSuccessFeedbackOptions(nextOptions, { persist = true } = {}) {
    applySuccessFeedbackOptions(nextOptions);
    if (persist && hasChromeApi()) {
      await chrome.storage.local.set({ [STORAGE_SUCCESS_FEEDBACK]: successFeedbackPayload() });
    }
  }

  async function restoreSuccessFeedbackOptions() {
    if (hasChromeApi()) {
      const stored = await chrome.storage.local.get(STORAGE_SUCCESS_FEEDBACK).catch(() => ({}));
      applySuccessFeedbackOptions(stored[STORAGE_SUCCESS_FEEDBACK] || successFeedbackOptions);
      return;
    }
    applySuccessFeedbackOptions(successFeedbackOptions);
  }

  function ensureSuccessAudioContext({ force = false } = {}) {
    if (!successFeedbackOptions.sound) return null;
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) return null;
    if (!successAudioContext || successAudioContext.state === "closed" || force) successAudioContext = new AudioContextCtor();
    return successAudioContext;
  }

  async function primeSuccessAudio() {
    const context = ensureSuccessAudioContext();
    if (!context) return false;
    if (context.state === "suspended") {
      try {
        await context.resume();
      } catch {
        return false;
      }
    }
    return context.state === "running";
  }

  function successSoundNotes(style = successFeedbackOptions.soundStyle) {
    return SUCCESS_SOUND_PRESETS[style] || SUCCESS_SOUND_PRESETS.soft;
  }

  async function playSuccessSound({ force = false } = {}) {
    const context = ensureSuccessAudioContext({ force });
    if (!context) return;
    if (context.state === "suspended") {
      try {
        await context.resume();
      } catch {
        return;
      }
    }
    if (context.state === "closed" || context.state === "suspended") return;
    const now = context.currentTime + 0.01;
    const sound = successSoundNotes();
    const volume = Math.min(1, Math.max(0.2, Number(successFeedbackOptions.volume) || SUCCESS_SOUND_DEFAULT_VOLUME));
    const master = context.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(sound.master * volume, now + 0.018);
    const releaseAt = now + Math.max(0.48, ...sound.notes.map((note) => note.start + note.duration + 0.06));
    master.gain.exponentialRampToValueAtTime(0.0001, releaseAt);
    master.connect(context.destination);

    sound.notes.forEach((note) => {
      const osc = context.createOscillator();
      const gain = context.createGain();
      const start = now + note.start;
      const end = start + note.duration;
      osc.type = note.type || "sine";
      osc.frequency.setValueAtTime(note.frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(note.gain || 0.3, start + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, end);
      osc.connect(gain).connect(master);
      osc.start(start);
      osc.stop(end + 0.03);
    });
  }

  function fireSuccessConfetti() {
    if (!successFeedbackOptions.confetti || typeof window.confetti !== "function") return;
    if (!successConfetti) {
      const canvas = document.createElement("canvas");
      canvas.className = "success-confetti-canvas";
      canvas.setAttribute("aria-hidden", "true");
      document.body.appendChild(canvas);
      successConfetti = window.confetti.create(canvas, {
        resize: true,
        useWorker: false
      });
    }
    const base = {
      particleCount: 28,
      spread: 54,
      startVelocity: 28,
      ticks: 120,
      gravity: 0.86,
      scalar: 0.74,
      zIndex: 120,
      disableForReducedMotion: true,
      colors: SUCCESS_CONFETTI_COLORS
    };
    successConfetti({ ...base, angle: 64, origin: { x: 0.22, y: 0.18 } });
    successConfetti({ ...base, angle: 116, origin: { x: 0.78, y: 0.18 } });
  }

  function triggerSuccessFeedback(summary = null) {
    const key = String(latestProgress?.startedAt || summary?.elapsedMs || Date.now());
    if (key && key === lastSuccessFeedbackKey) return;
    lastSuccessFeedbackKey = key;
    if (successFeedbackOptions.confetti) fireSuccessConfetti();
    if (successFeedbackOptions.sound) void playSuccessSound();
  }

  function testSuccessFeedback() {
    const key = `test-${Date.now()}`;
    lastSuccessFeedbackKey = key;
    if (successFeedbackOptions.confetti) fireSuccessConfetti();
    if (successFeedbackOptions.sound) {
      void primeSuccessAudio().then((ready) => {
        if (ready) {
          void playSuccessSound({ force: true });
        } else {
          setDraftDropStatus("Sound blocked", "Chrome did not unlock audio for this panel. Click Test feedback again after interacting with the panel.", "error");
        }
      });
    }
    setDraftDropStatus("Feedback test", "Use this to confirm animation and sound work in this Chrome profile.", "done");
  }

  function applyTheme(mode = currentThemeMode) {
    currentThemeMode = normalizeThemeMode(mode);
    const resolvedTheme = resolveTheme(currentThemeMode);
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.dataset.themeMode = currentThemeMode;
    document.documentElement.style.colorScheme = resolvedTheme;
    document.body.dataset.theme = resolvedTheme;
    document.body.dataset.themeMode = currentThemeMode;
    syncThemeChoice();
  }

  async function setTheme(mode, { persist = true } = {}) {
    applyTheme(mode);
    if (persist && hasChromeApi()) {
      await chrome.storage.local.set({ [STORAGE_THEME]: currentThemeMode });
    }
  }

  async function restoreTheme() {
    let storedTheme = null;
    if (hasChromeApi()) {
      const stored = await chrome.storage.local.get(STORAGE_THEME);
      storedTheme = stored[STORAGE_THEME] || null;
    }
    await setTheme(storedTheme || currentThemeMode, { persist: false });
  }

  function installSystemThemeSync() {
    if (!themeMediaQuery) return;
    const sync = () => {
      if (currentThemeMode === "system") applyTheme("system");
    };
    if (typeof themeMediaQuery.addEventListener === "function") {
      themeMediaQuery.addEventListener("change", sync);
      return;
    }
    themeMediaQuery.addListener?.(sync);
  }

  function translateText(text) {
    const source = sourceText(text);
    if (i18n) {
      const translated = i18n.t(source);
      if (translated !== source || currentLanguage !== "zh") return translated;
    }
    if (currentLanguage !== "zh") return source;
    const direct = ZH_TEXT.get(source);
    if (direct) return direct;
    const pattern = translatePatternText(source);
    if (pattern !== source) return pattern;
    return translateCompoundText(source);
  }

  function sourceText(text) {
    return EN_TEXT.get(text) || reversePatternText(text) || reverseCompoundText(text) || text;
  }

  function translateCompoundText(source) {
    if (!/[.!?]\s+/.test(source)) return source;
    const parts = source.match(/[^.!?]+[.!?]|[^.!?]+$/g) || [source];
    let changed = false;
    const translated = parts.map((part) => {
      const leading = part.match(/^\s*/)?.[0] || "";
      const trailing = part.match(/\s*$/)?.[0] || "";
      const body = part.trim();
      const translatedBody = ZH_TEXT.get(body) || translatePatternText(body);
      if (translatedBody !== body) changed = true;
      return `${leading}${translatedBody}${trailing}`;
    });
    return changed ? translated.join(" ") : source;
  }

  function reverseCompoundText(text) {
    if (!/。\s*/.test(text)) return null;
    const parts = text.match(/[^。]+。|[^。]+$/g) || [text];
    let changed = false;
    const reversed = parts.map((part) => {
      const leading = part.match(/^\s*/)?.[0] || "";
      const trailing = part.match(/\s*$/)?.[0] || "";
      const body = part.trim();
      const sourceBody = EN_TEXT.get(body) || reversePatternText(body) || body;
      if (sourceBody !== body) changed = true;
      return `${leading}${sourceBody}${trailing}`;
    });
    return changed ? reversed.join(" ") : null;
  }

  function translatePatternText(source) {
    const patterns = [
      [/^(\d+)\/(\d+) ready$/, "$1/$2 就绪"],
      [/^(\d+)\/(\d+) record items ready\.$/, "$1/$2 条记录项就绪。"],
      [/^(\d+) draft(?:s)?, (\d+) written$/, "$1 篇待处理，$2 篇已写入"],
      [/^(\d+)\/(\d+) checks ready$/, "$1/$2 项检查就绪"],
      [/^(\d+)\/(\d+) live verification steps ready\.$/, "$1/$2 个导入后检查步骤就绪。"],
      [/^(\d+)\/(\d+) after-import steps ready\.$/, "$1/$2 个导入后步骤就绪。"],
      [/^(\d{1,2}:\d{2}) Loaded example Markdown draft\.$/, "$1 已加载样例 Markdown 草稿。"],
      [/^(\d+)\/(\d+) proof items ready\.$/, "$1/$2 个完成记录项就绪。"],
      [/^(\d+)\/(\d+) live result checks recorded(?:, including the page import button path)?\.$/, "已记录 $1/$2 项文章检查。"],
      [/^(\d+)\/(\d+) article review checks recorded(?:, including the page import button path)?\.$/, "已记录 $1/$2 项文章检查。"],
      [/^(\d+)\/(\d+) final article checks are recorded\.$/, "已记录 $1/$2 项文章检查。"],
      [/^(\d+)\/(\d+) final result checks recorded\.$/, "已记录 $1/$2 项文章检查。"],
      [/^(\d+) blocker\(s\), (\d+) warning\(s\)$/, "$1 个阻塞项，$2 个警告"],
      [/^(\d+) warning\(s\), no blockers$/, "$1 个警告，无阻塞项"],
      [/^(\d+) thing\(s\) to fix, (\d+) warning\(s\)$/, "$1 个待修复项，$2 个警告"],
      [/^(\d+) thing\(s\) to fix, (\d+)\/(\d+) ready$/, "$1 个待修复项，$2/$3 已就绪"],
      [/^(\d+) item\(s\) waiting, (\d+)\/(\d+) ready$/, "$1 个待处理项，$2/$3 已就绪"],
      [/^No active blockers; continue with live verification\.$/, "当前没有阻塞项；继续完成导入后检查。"],
      [/^(\d+) blocked stage\(s\), (\d+) complete$/, "$1 个阶段阻塞，$2 个完成"],
      [/^(\d+) stage\(s\) ready, (\d+) complete$/, "$1 个阶段就绪，$2 个完成"],
      [/^(\d+)\/(\d+) stage\(s\) complete$/, "$1/$2 个阶段完成"],
      [/^(\d+)\/(\d+)$/, "$1/$2"],
      [/^(.+) blocks (\d+)$/, "$1 $2"],
      [/^Text blocks (\d+)$/, "文本块 $1"],
      [/^Special blocks (\d+)$/, "特殊块 $1"],
      [/^Images (\d+)$/, "图片 $1"],
      [/^Local images (\d+)$/, "本地图片 $1"],
      [/^(\d+) blocker\(s\), (\d+)\/(\d+) proven$/, "$1 个阻塞项，$2/$3 已证明"],
      [/^(\d+) pending item\(s\), (\d+)\/(\d+) proven$/, "$1 个待处理项，$2/$3 已证明"],
      [/^(\d+) of (\d+) record\(s\) match this search\.$/, "$2 条记录中有 $1 条匹配。"],
      [/^(\d+) local record\(s\), newest first\.$/, "$1 条记录，最新在前。"],
      [/^(\d+) record\(s\), newest first\.$/, "$1 条记录，最新在前。"],
      [/^(\d+) live event\(s\); import complete\.$/, "$1 个实时事件；导入完成。"],
      [/^(\d+) live event\(s\); import failed\.$/, "$1 个实时事件；导入失败。"],
      [/^(\d+) live event\(s\); import in progress\.$/, "$1 个实时事件；导入中。"],
      [/^(\d+) update\(s\); writing complete\.$/, "$1 个更新；写入完成。"],
      [/^(\d+) update\(s\); writing failed\.$/, "$1 个更新；写入失败。"],
      [/^(\d+) update\(s\); writing in progress\.$/, "$1 个更新；正在写入。"],
      [/^(\d+) live event\(s\) recorded\.$/, "已记录 $1 个实时事件。"],
      [/^(\d+) blocks, titled$/, "$1 个块，已检测标题"],
      [/^(\d+) blocks$/, "$1 个块"],
      [/^(\d+) blocks loaded; title detected\.$/, "已加载 $1 个块；已检测标题。"],
      [/^(\d+) blocks loaded; title missing\.$/, "已加载 $1 个块；未检测标题。"],
      [/^(\d+) block\(s\), (\d+) character\(s\), ready to write\.$/, "$1 个块，$2 个字符，可以写入。"],
      [/^Title found · (\d+) images? · (\d+) code blocks?$/, "标题已检测 · $1 张图片 · $2 个代码块"],
      [/^No title · (\d+) images? · (\d+) code blocks?$/, "未检测标题 · $1 张图片 · $2 个代码块"],
      [/^Loaded (\d+) characters\. Review it, then click Write to X draft\.$/, "已载入 $1 个字符。检查后点击写入到 X 草稿。"],
      [/^(\d+) characters\. Review it, then click Write to X draft\.$/, "$1 个字符。检查后点击写入到 X 草稿。"],
      [/^(\d+(?:,\d+)*) chars · (\d+) images? · (\d+) code blocks?$/, "$1 字 · 图片 $2 · 代码块 $3"],
      [/^(\d+) characters, ready to write\.$/, "$1 字符，可以写入。"],
      [/^(\d+(?:,\d+)*) chars$/, "$1 字"],
      [/^Queued (\d+) Markdown draft(?:s)?\.$/, "已加入 $1 篇 Markdown 草稿。"],
      [/^(\d+) queued draft(?:s)?$/, "$1 篇草稿在队列中"],
      [/^(\d+) queued draft(?:s)? ready\.$/, "$1 篇队列草稿已就绪。"],
      [/^(\d+) draft\(s\) queued\.$/, "$1 篇草稿在队列中。"],
      [/^(\d+) publishable block\(s\), title detected$/, "$1 个可发布块，已检测标题"],
      [/^(\d+) publishable block\(s\), no title detected$/, "$1 个可发布块，未检测标题"],
      [/^(\d+) publishable block\(s\) loaded\.$/, "已加载 $1 个可发布块。"],
      [/^(\d+) upload items need X handler\.$/, "$1 个上传项需要 X 处理器。"],
      [/^(\d+) upload item need X handler\.$/, "$1 个上传项需要 X 处理器。"],
      [/^(\d+) upload items ready\.$/, "$1 个上传项就绪。"],
      [/^(\d+) upload item ready\.$/, "$1 个上传项就绪。"],
      [/^(\d+) image\(s\) uploaded, (\d+) kept as links$/, "$1 张图片已上传，$2 张保留为链接"],
      [/^(\d+) image\(s\) ready, (\d+) need attention$/, "$1 张图片已就绪，$2 张保留为链接"],
      [/^(\d+) image\(s\) uploaded$/, "$1 张图片已上传"],
      [/^(\d+) web image\(s\) will be tried during Write\.$/, "$1 张网页图片会在写入时尝试处理。"],
      [/^(\d+) web image\(s\) will be downloaded in the background; failed downloads stay as Markdown links\.$/, "$1 张网页图片会在写入时尝试下载；失败图片会保留为 Markdown 链接。"],
      [/^(\d+) web image\(s\) will be tried while writing to X draft\.$/, "$1 张网页图片会在写入时尝试上传。"],
      [/^(\d+) web image\(s\) may stay as links unless replaced\.$/, "$1 张网页图片可能保留为链接，除非替换为可下载图片。"],
      [/^(\d+) web image\(s\) may stay as links unless the URLs are replaced\.$/, "$1 张网页图片可能保留为链接，除非替换为可访问 URL。"],
      [/^(\d+) web image\(s\) will upload through X when reachable\.$/, "$1 张网页图片可访问时会通过 X 上传。"],
      [/^(\d+) web image\(s\) will upload through X when reachable while writing to X draft\.$/, "$1 张网页图片可访问时会通过 X 上传。"],
      [/^Images: (\d+)$/, "图片：$1"],
      [/^Web images: (\d+)$/, "网页图片：$1"],
      [/^Web images: (\d+) ready$/, "网页图片：$1 已就绪"],
      [/^Web images: (\d+) may stay as links$/, "网页图片：$1 张可能保留为链接"],
      [/^(\d+) web image\(s\) will be handled during Write\. Unreachable images stay as links\.$/, "$1 张网页图片会在写入时尝试上传；无法访问时会保留为链接。"],
      [/^(\d+) web image\(s\) will be tried while writing to X draft\. Unreachable images stay as links\.$/, "$1 张网页图片会在写入时尝试上传；无法访问时会保留为链接。"],
      [/^(\d+) image\(s\) will upload through X when possible\.$/, "$1 张图片会尽量通过 X 上传。"],
      [/^(\d+) image\(s\) will upload through X when possible while writing to X draft\.$/, "$1 张图片会在写入 X 草稿时尽量通过 X 上传。"],
      [/^(\d+) upload items need the X editor\.$/, "$1 个上传项需要 X 编辑器。"],
      [/^(\d+) upload item need the X editor\.$/, "$1 个上传项需要 X 编辑器。"],
      [/^(\d+) media upload item\(s\) can use X upload handler\.$/, "$1 个媒体上传项可使用 X 上传能力。"],
      [/^(\d+) media upload item\(s\) can upload through X\.$/, "$1 个媒体上传项可通过 X 上传。"],
      [/^(\d+) media item\(s\) will be uploaded through X \((\d+) image, (\d+) rendered table\)\.$/, "$1 个媒体项会通过 X 上传（$2 张图片，$3 个表格图片）。"],
      [/^(\d+) special content block\(s\) will be placed in X\.$/, "$1 个特殊内容块会放入 X。"],
      [/^(\d+) local image\(s\) can resolve through (.+)\.$/, "$1 张本地图片可通过 $2 读取。"],
      [/^(\d+) local image\(s\) need a readable folder\.$/, "$1 张本地图片需要选择可读取文件夹。"],
      [/^(\d+) remote image\(s\) need source-site permission before upload\.$/, "$1 张网页图片会在写入时尝试处理。"],
      [/^(\d+) remote image\(s\) need Chrome site access before upload\.$/, "$1 张网页图片会在写入时尝试处理。"],
      [/^(\d+) remote image\(s\) from (\d+) site\(s\) need permission before upload\.$/, "$1 张网页图片来自 $2 个站点，写入时会尝试处理。"],
      [/^(\d+) remote image\(s\) from (\d+) site\(s\) need Chrome site access before upload\.$/, "$1 张网页图片来自 $2 个站点，写入时会尝试处理。"],
      [/^(\d+) remote image\(s\) from (\d+) site\(s\) need Chrome site access before upload\. This is a browser permission step, not an X upload failure\.$/, "$1 张网页图片来自 $2 个站点，写入时会尝试处理。"],
      [/^(\d+) web image\(s\) from (\d+) image website\(s\) need your approval before upload\. This is a Chrome permission step, not an X upload failure\.$/, "$1 张网页图片来自 $2 个图片网站，写入时会尝试处理。"],
      [/^(\d+) web image\(s\) need one Chrome approval before upload\.$/, "$1 张网页图片会在写入时尝试处理。"],
      [/^(\d+) web image\(s\) need one Chrome permission before xPoster can upload them\.$/, "$1 张网页图片会在写入时尝试处理，成功后交给 X 上传。"],
      [/^(\d+) remote image\(s\) from (\d+) site\(s\) can be fetched\.$/, "$1 张网页图片来自 $2 个站点，已可抓取。"],
      [/^(\d+) web image\(s\) from (\d+) image website\(s\) are allowed\.$/, "$1 张网页图片来自 $2 个图片网站，已允许。"],
      [/^(\d+) web image\(s\) checked: (\d+) ready, (\d+) failed\.$/, "已检查 $1 张网页图片：$2 张可用，$3 张失败。"],
      [/^Image (\d+) ready: (.+) \((.+)\)\.$/, "图片 $1 可用：$2（$3）。"],
      [/^Image (\d+) failed \((.+)\) from (.+): (.+)\. xPoster recognized the Markdown image, but it will not write image links into X as real uploads until this file can be downloaded\.$/, "图片 $1 失败（$2），来源 $3：$4。xPoster 已识别这张 Markdown 图片，但在下载到图片文件之前，不会把图片链接写进 X 当作真实上传图片。"],
      [/^Image (\d+) failed \((.+)\) from (.+): (.+)$/, "图片 $1 失败（$2），来源 $3：$4"],
      [/^Image (\d+) failed: (.+)\.$/, "图片 $1 失败：$2。"],
      [/^Image (\d+) not checked yet\.$/, "图片 $1 尚未检查。"],
      [/^Image (\d+) will be tried during Write\.$/, "写入时会尝试处理图片 $1。"],
      [/^Download failed: (.+)\.$/, "下载失败：$1。"],
      [/^Remote image check failed before import: (.+)\.$/, "网页图片处理失败：$1。"],
      [/^Remote image check passed for (\d+) image\(s\)\.$/, "$1 张网页图片可处理。"],
      [/^Chrome is asking for image access: (.+)$/, "正在处理图片：$1"],
      [/^Remote image check requires image website approval first\.$/, "网页图片会在写入时尝试处理。"],
      [/^Allow this image website now\? (.+) web image\(s\) from (.+) stayed as Markdown links\.$/, "$1 张网页图片来自 $2，当前保留为 Markdown 链接。"],
      [/^Allow this image website now\? (.+) web image from (.+) stayed as a Markdown link\.$/, "$1 张网页图片来自 $2，当前保留为 Markdown 链接。"],
      [/^(.+) web image\(s\) are ready\. Write again to upload them into X\.$/, "$1 张网页图片已就绪。再次写入即可上传到 X。"],
      [/^(.+) web image is ready\. Write again to upload it into X\.$/, "$1 张网页图片已就绪。再次写入即可上传到 X。"],
      [/^(.+) web image\(s\) are allowed, but (.+) could not be downloaded\.$/, "$1 张网页图片已检查，但 $2 张无法下载。"],
      [/^(.+) web image\(s\) stayed as Markdown links\.$/, "$1 张网页图片保留为 Markdown 链接。"],
      [/^Article written in (.+)\.$/, "文章已写入，用时 $1。"],
      [/^Article written in (.+)\. (.+) web image\(s\) stayed as Markdown links\. Open xPoster, allow the image website, then write again to upload them\.$/, "文章已写入，用时 $1。$2 张网页图片保留为 Markdown 链接。替换为公开可下载链接后再次写入即可上传。"],
      [/^Article written in (.+)\. (.+) web image\(s\) stayed as Markdown links\. Allow the image website in xPoster, then write again to upload them\.$/, "文章已写入，用时 $1。$2 张网页图片保留为 Markdown 链接。替换为公开可下载链接后再次写入即可上传。"],
      [/^Article written in (.+)\. (.+) table\(s\) stayed as Markdown\.$/, "文章已写入，用时 $1。$2 个表格保留为 Markdown。"],
      [/^Article written in (.+)\. (.+) web image\(s\) stayed as Markdown links; (.+) table\(s\) stayed as Markdown\. Allow the image website in xPoster, then write again to upload them\.$/, "文章已写入，用时 $1。$2 张网页图片保留为 Markdown 链接；$3 个表格保留为 Markdown。替换为公开可下载图片链接后再次写入即可上传。"],
      [/^Uploaded (\d+), kept (\d+) as links$/, "已上传 $1，$2 个保留为链接"],
      [/^Uploaded (\d+)$/, "已上传 $1"],
      [/^(\d+) uploaded, (\d+) kept$/, "已上传 $1，$2 个保留"],
      [/^(\d+) web image\. Allow this image website once, then check downloads\.$/, "$1 张网页图片。写入时会自动尝试处理。"],
      [/^(\d+) web image\(s\)\. Allow this image website once, then check downloads\.$/, "$1 张网页图片。写入时会自动尝试处理。"],
      [/^(\d+) images?\. xPoster asks only for this image website\.$/, "$1 张图片。xPoster 只会检查这个图片来源。"],
      [/^(.+) - (\d+) images?\. xPoster asks only for this image website\.$/, "$1 - $2 张图片。xPoster 只会检查这个图片来源。"],
      [/^(\d+) image\(s\)\. xPoster asks only for this image website\.$/, "$1 张图片。xPoster 只会检查这个图片来源。"],
      [/^(.+): Needs approval$/, "$1：写入时处理"],
      [/^(.+): Allowed$/, "$1：可下载"],
      [/^Click Allow image website, choose Allow in Chrome, then check downloads before Import\.$/, "写入时会自动尝试处理网页图片。"],
      [/^Click Allow image website, choose Allow in Chrome, then click Check downloads before Import\.$/, "写入时会自动尝试处理网页图片。"],
      [/^Click Allow image website\. When Chrome asks for (.+), choose Allow\. Then click Check downloads before Import\.$/, "写入时会自动尝试处理 $1 的图片。"],
      [/^Reload xPoster in chrome:\/\/extensions, reopen the X Article tab and side panel, then try again\.$/, "在 chrome://extensions 重新加载 xPoster，重新打开 X 文章标签页和侧边栏，然后再试。"],
      [/^(\d+) remote image\(s\) from (.+) need permission\.$/, "$1 张网页图片来自 $2，写入时会尝试处理。"],
      [/^(\d+) remote image\(s\) from (.+) allowed\.$/, "$1 张网页图片来自 $2，可尝试下载。"],
      [/^(\d+) image\(s\) from this site\.$/, "该站点 $1 张图片。"],
      [/^(\d+) image\(s\) from this website\. xPoster only requests this image source\.$/, "这个网站有 $1 张图片。xPoster 只请求这个图片来源。"],
      [/^(\d+) image\(s\) from this website\. xPoster asks only for this image site\.$/, "这个网站有 $1 张图片。xPoster 只检查这个图片来源。"],
      [/^(.+) - (\d+) image\. xPoster fetches without site cookies and then lets X upload the file\.$/, "$1 - $2 张图片。xPoster 不带站点 cookie 下载，然后交给 X 上传。"],
      [/^(.+) - (\d+) images\. xPoster fetches without site cookies and then lets X upload the file\.$/, "$1 - $2 张图片。xPoster 不带站点 cookie 下载，然后交给 X 上传。"],
      [/^(\d+) web image\(s\) detected\. xPoster will try to download public images while writing; failed downloads stay as Markdown links\.$/, "检测到 $1 张网页图片。写入时会尝试下载公开图片；失败图片会保留为 Markdown 链接。"],
      [/^(\d+) web image\(s\) checked: (\d+) ready, (\d+) will stay as Markdown links unless the URLs are replaced\.$/, "已检查 $1 张网页图片：$2 张可用，$3 张会保留为 Markdown 链接，除非替换 URL。"],
      [/^(\d+) web image is downloadable\. Write article to upload it into X\.$/, "$1 张网页图片可下载。写入文章时会上传到 X。"],
      [/^(\d+) web image\(s\) are downloadable\. Write article to upload them into X\.$/, "$1 张网页图片可下载。写入文章时会上传到 X。"],
      [/^(\d+) more image\(s\)$/, "还有 $1 张图片"],
      [/^(.+) - Needs Chrome approval$/, "$1 - 写入时处理"],
      [/^(.+) - Allowed$/, "$1 - 可下载"],
      [/^(\d+) remote image\(s\) across (\d+) image site\(s\)\.$/, "$1 张网页图片，来自 $2 个图片站点。"],
      [/^Allow (.+) before importing this image\.$/, "如果这张图片必须上传，请确认 $1 可公开访问。"],
      [/^Chrome has not granted image-site access for (.+)\. Click Allow image site in xPoster, approve Chrome's prompt, then retry Import\. If this site already looks allowed, reload xPoster and reopen the side panel\.$/, "$1 的图片无法下载。请替换为公开可访问链接后重试。"],
      [/^Chrome has not granted image-site access for (.+)\. Click Allow image site in xPoster, choose Allow in Chrome's prompt, then retry Import\. xPoster cannot convert remote Markdown image URLs into uploaded files until this site access is granted\.$/, "$1 的图片无法下载。xPoster 会保留 Markdown 图片链接；替换为公开可访问链接后可再次写入。"],
      [/^Chrome has not granted image-site access for (.+)\. Click Allow image site in xPoster, choose Allow in Chrome's prompt, then retry Import\. Until this permission is allowed, xPoster cannot fetch the remote image files, so Markdown image links cannot become uploaded images in X\.$/, "$1 的图片无法下载。下载成功前，Markdown 图片链接会保留为链接。"],
      [/^Chrome has not allowed xPoster to read images from (.+)\. Click Allow image website in xPoster, choose Allow in Chrome's prompt, then retry Import\. Until this is allowed, xPoster cannot fetch the remote image files, so Markdown image links cannot become uploaded images in X\.$/, "$1 的图片无法下载。下载成功前，Markdown 图片链接会保留为链接。"],
      [/^Chrome did not grant image website access for (.+)\. Click Import again or click Allow image website, then choose Allow in Chrome's prompt\. Until Chrome allows this website, xPoster cannot fetch the image files, so Markdown image links will stay as text instead of becoming uploaded images in X\.$/, "$1 的图片无法下载。再次写入会继续尝试，失败时 Markdown 图片链接会保留为链接。"],
      [/^Chrome did not grant image website access for (.+)\. Click Allow image website, choose Allow in Chrome's prompt, then retry Import\. If Chrome already shows this website as allowed, reload the xPoster extension and reopen the side panel\. Until Chrome allows this website, xPoster cannot fetch the image files, so Markdown image links will stay as text instead of becoming uploaded images in X\.$/, "$1 的图片无法下载。请替换为公开可访问链接后重试；失败时 Markdown 图片链接会保留为链接。"],
      [/^Chrome has not allowed xPoster v(.+) to read images from (.+)\. Click Allow image website in xPoster, choose Allow in Chrome's prompt, then click Check downloads and Import again\. This is a browser permission step, not an X upload failure\. Until Chrome allows this website, xPoster cannot fetch the image files, so Markdown image links will stay as text instead of becoming uploaded images in X\. If Chrome does not show a prompt, reload xPoster from chrome:\/\/extensions and reopen the side panel so the service worker uses the latest permission state\.$/, "xPoster v$1 无法下载 $2 的图片。请替换为公开可访问链接；失败时 Markdown 图片链接会保留为链接。"],
      [/^Chrome has not allowed xPoster v(.+) to read images from (.+)\. Chrome reported: (.+)\. Click Allow image website in xPoster, choose Allow in Chrome's prompt, then click Check downloads and Import again\. This is a browser permission step, not an X upload failure\. Until Chrome allows this website, xPoster cannot fetch the image files, so Markdown image links will stay as text instead of becoming uploaded images in X\. If Chrome does not show a prompt, reload xPoster from chrome:\/\/extensions and reopen the side panel so the service worker uses the latest permission state\.$/, "xPoster v$1 无法下载 $2 的图片。Chrome 返回：$3。请替换为公开可访问链接；失败时 Markdown 图片链接会保留为链接。"],
      [/^Chrome has not allowed xPoster v(.+) to read images from (.+)\. Click Allow image website in xPoster, choose Allow in Chrome's prompt, then click Check downloads and Import again\. This is a browser permission step, not an X upload failure\. Until Chrome allows this website, xPoster cannot fetch the image files, so Markdown image links will stay as text instead of becoming uploaded images in X\. If Chrome already shows this website as allowed, reload xPoster from chrome:\/\/extensions and reopen the side panel so the service worker uses the latest permission state\.$/, "xPoster v$1 无法下载 $2 的图片。请替换为公开可访问链接；失败时 Markdown 图片链接会保留为链接。"],
      [/^Chrome has not allowed xPoster v(.+) to read images from (.+)\. Click Allow image website in xPoster, choose Allow in Chrome's prompt, then click Check downloads and Import again\. This is a browser permission step, not an X upload failure\. Until Chrome allows this website, xPoster cannot fetch the image files, so Markdown image links will stay as text instead of becoming uploaded images in X\. If Chrome did not show a prompt, open chrome:\/\/extensions, reload xPoster, reopen the X Article tab and the side panel, then click Allow image website again\.$/, "xPoster v$1 无法下载 $2 的图片。请替换为公开可访问链接；失败时 Markdown 图片链接会保留为链接。"],
      [/^Chrome has not allowed xPoster v(.+) to read images from (.+)\. Chrome reported: (.+)\. Click Allow image website in xPoster, choose Allow in Chrome's prompt, then click Check downloads and Import again\. This is a browser permission step, not an X upload failure\. Until Chrome allows this website, xPoster cannot fetch the image files, so Markdown image links will stay as text instead of becoming uploaded images in X\. If Chrome did not show a prompt, open chrome:\/\/extensions, reload xPoster, reopen the X Article tab and the side panel, then click Allow image website again\.$/, "xPoster v$1 无法下载 $2 的图片。Chrome 返回：$3。请替换为公开可访问链接；失败时 Markdown 图片链接会保留为链接。"],
      [/^Chrome has not granted image-site access for (.+)\. Click Allow image website in the xPoster side panel, choose Allow in Chrome's prompt, then click Check downloads and Import again\. This is a Chrome permission step, not an X upload failure; until it is allowed, Markdown image links cannot become uploaded images in X\.$/, "$1 的图片无法下载。请替换为公开可访问链接；失败时 Markdown 图片链接会保留为链接。"],
      [/^Chrome has not granted image-site access for (.+)\. Open the xPoster side panel, click Allow image website, choose Allow in Chrome's prompt, then click Check downloads and Import again\. This is a browser permission step, not an X upload failure; until it is allowed, Markdown image links cannot become uploaded images in X\.$/, "$1 的图片无法下载。请替换为公开可访问链接；失败时 Markdown 图片链接会保留为链接。"],
      [/^Chrome has not allowed xPoster v(.+) to read images from (.+)\. Chrome reported: (.+)\. Click Allow image website in xPoster, choose Allow in Chrome's prompt, then click Check downloads and Import again\. This is a browser permission step, not an X upload failure\. Until Chrome allows this website, xPoster cannot fetch the image files, so Markdown image links will stay as text instead of becoming uploaded images in X\. If Chrome did not show a prompt, open chrome:\/\/extensions, reload xPoster, reopen the X Article tab and the side panel, then click Allow image website again\.$/, "xPoster v$1 无法下载 $2 的图片。Chrome 返回：$3。请替换为公开可访问链接；失败时 Markdown 图片链接会保留为链接。"],
      [/^Chrome has not allowed xPoster v(.+) to read images from (.+)\. Click Allow image website in xPoster, choose Allow in Chrome's prompt, then click Check downloads and Import again\. This is a browser permission step, not an X upload failure\. Until Chrome allows this website, xPoster cannot fetch the image files, so Markdown image links will stay as text instead of becoming uploaded images in X\. If Chrome did not show a prompt, open chrome:\/\/extensions, reload xPoster, reopen the X Article tab and the side panel, then click Allow image website again\.$/, "xPoster v$1 无法下载 $2 的图片。请替换为公开可访问链接；失败时 Markdown 图片链接会保留为链接。"],
      [/^xPoster v(.+) can only request remote image access for image websites declared in manifest\.json\. This draft uses (.+), which is not declared in this build\. Add that image host to optional_host_permissions, reload xPoster, then retry Import\.$/, "xPoster v$1 无法下载 $2 的图片。请替换为公开可访问链接后重试。"],
      [/^Chrome has not granted image-site access for (.+)\. Open the xPoster side panel, click Allow image website, choose Allow in Chrome's prompt, then retry Import\. If Chrome already shows this website as allowed, reload the xPoster extension and reopen the side panel\.$/, "$1 的图片无法下载。请替换为公开可访问链接后重试。"],
      [/^(\d+) special block\(s\), (\d+) image\(s\), (\d+) table image\(s\), (\d+) tweet embed\(s\)\.$/, "$1 个特殊块，$2 张图片，$3 张表格图片，$4 个推文嵌入。"],
      [/^(\d+) more ledger item\(s\)$/, "还有 $1 个导入项"],
      [/^(\d+) more import item\(s\)$/, "还有 $1 个导入项"],
      [/^(\d+) additional marker operation\(s\) hidden\.$/, "另有 $1 个特殊内容步骤已隐藏。"],
      [/^(\d+) additional special-content step\(s\) hidden\.$/, "另有 $1 个特殊内容步骤已隐藏。"],
      [/^(\d+) ledger item\(s\) mapped; (\d+) waiting, (\d+) direct HTML paste\.$/, "已规划 $1 个导入项；$2 个等待处理，$3 个会直接写入正文。"],
      [/^(\d+) import item\(s\) planned; (\d+) waiting, (\d+) direct text write\.$/, "已规划 $1 个导入项；$2 个等待处理，$3 个会直接写入正文。"],
      [/^(\d+) item\(s\) planned; (\d+) waiting; (\d+) text item\(s\) ready\.$/, "已规划 $1 个导入项；$2 个等待处理；$3 个文本项就绪。"],
      [/^(\d+) item\(s\) need attention; (\d+) waiting; (\d+) text item\(s\) ready\.$/, "$1 个导入项需要处理；$2 个等待处理；$3 个文本项就绪。"],
      [/^(\d+) blocked ledger item\(s\), (\d+) waiting, (\d+) direct HTML paste\.$/, "$1 个导入项受阻，$2 个等待处理，$3 个会直接写入正文。"],
      [/^(\d+) blocked import item\(s\), (\d+) waiting, (\d+) direct text write\.$/, "$1 个导入项受阻，$2 个等待处理，$3 个会直接写入正文。"],
      [/^(\d+) text blocks$/, "$1 个文本块"],
      [/^(\d+) images$/, "$1 张图片"],
      [/^(\d+) tables$/, "$1 个表格"],
      [/^(\d+) tweets$/, "$1 个推文"],
      [/^(\d+) code blocks$/, "$1 个代码块"],
      [/^(\d+) columns, (\d+) rows$/, "$1 列，$2 行"],
      [/^Tweet (\d+)$/, "推文 $1"],
      [/^(.+) · (\d+) lines$/, "$1，$2 行"],
      [/^(\d+) more block\(s\) hidden in preview\.$/, "预览中隐藏了另外 $1 个块。"],
      [/^(\d+) text part\(s\)$/, "$1 个文本部分"],
      [/^(\d+) image\(s\)$/, "$1 张图片"],
      [/^(\d+) table\(s\)$/, "$1 个表格"],
      [/^(\d+) special block\(s\)$/, "$1 个特殊内容"],
      [/^Recognized: (.+)$/, "已识别：$1"],
      [/^Title detected: (.+)$/, "已检测标题：$1"],
      [/^(\d+) web image\(s\)$/, "$1 张网页图片"],
      [/^(\d+) text part\(s\) · (\d+) image\(s\) · (\d+) table\(s\) · (\d+) special block\(s\) · image links convert during Import$/, "$1 个文本部分 · $2 张图片 · $3 个表格 · $4 个特殊内容 · 图片链接会在导入时转换"],
      [/^Text blocks (\d+)$/, "文本块 $1"],
      [/^Special blocks (\d+)$/, "特殊块 $1"],
      [/^Images (\d+)$/, "图片 $1"],
      [/^Local images (\d+)$/, "本地图片 $1"],
      [/^(\d+) text part\(s\), (\d+) image\/table upload\(s\), (\d+) special block\(s\)\.$/, "$1 个文本部分，$2 个图片/表格上传，$3 个特殊内容。"],
      [/^Write (\d+) text part\(s\) into the X Article body\.$/, "把 $1 个文本部分写入 X 文章正文。"],
      [/^No article text was found yet\.$/, "尚未找到文章正文。"],
      [/^(.+) will upload as (.+)\.$/, "$1 会以 $2 上传。"],
      [/^(.+) will be placed where it appears in your draft\.$/, "$1 会放在草稿中的对应位置。"],
      [/^(\d+) more step\(s\) are hidden here but included during import\.$/, "这里隐藏了 $1 个步骤，但导入时会包含。"],
      [/^(\d+) marker operation\(s\), (\d+) media upload\(s\), (\d+) atomic replacement\(s\)\.$/, "$1 个特殊内容步骤，$2 个媒体上传，$3 个特殊内容放置。"],
      [/^(\d+) special-content step\(s\), (\d+) media upload\(s\), (\d+) special block\(s\)\.$/, "$1 个特殊内容步骤，$2 个媒体上传，$3 个特殊内容放置。"],
      [/^(\d+) article-body character\(s\) will be written first; (\d+) plain-text character\(s\) are kept as fallback\.$/, "会先写入 $1 个正文字符；另保留 $2 个纯文本字符作为备用。"],
      [/^(\d+) article-body character\(s\) will be written first, with (\d+) plain-text fallback character\(s\)\.$/, "会先写入 $1 个正文字符；另保留 $2 个纯文本字符作为备用。"],
      [/^(\d+) HTML character\(s\) will be pasted first; (\d+) plain-text character\(s\) are kept as fallback\.$/, "会先写入 $1 个正文字符；另保留 $2 个纯文本字符作为备用。"],
      [/^(\d+) special block\(s\) and (\d+) media item\(s\) need editor access\.$/, "$1 个特殊内容块和 $2 个媒体项需要编辑器访问。"],
      [/^(.+) marker (.+) uploads (.+), then relocates the X media block\.$/, "$1 会上传 $3，并放到正确位置。"],
      [/^(.+) uploads (.+) and moves it into place\.$/, "$1 会上传 $2，并放到正确位置。"],
      [/^Marker (.+) becomes an X (.+) atomic block\.$/, "$2 会作为 X 的特殊内容插入。"],
      [/^(.+) becomes an X (.+)\.$/, "$1 会作为 X 的 $2 插入。"],
      [/^Text (\d+)$/, "文本 $1"],
      [/^HTML (\d+)$/, "文本 $1"],
      [/^Atomic (\d+)$/, "特殊内容 $1"],
      [/^Special (\d+)$/, "特殊内容 $1"],
      [/^Images (\d+)$/, "图片 $1"],
      [/^Local (\d+)$/, "本地 $1"],
      [/^(.+) captured (.+)$/, "已捕获 $1，时间 $2"],
      [/^(.+) record saved at (.+)$/, "$1 记录已保存，时间 $2"],
      [/^Import complete in (.+)\.$/, "导入完成，用时 $1。"],
      [/^Writing complete in (.+)\.$/, "写入完成，用时 $1。"],
      [/^Writing complete in (.+) with (\d+) media warning\(s\)\.$/, "写入完成，用时 $1；有 $2 个媒体提醒。"],
      [/^Uploading image (\d+)\/(\d+)\.\.\.$/, "正在上传图片 $1/$2..."],
      [/^Stop request failed: (.+)$/, "停止请求失败：$1"],
      [/^First H1 was promoted to article title: (.+)$/, "第一个 H1 会作为文章标题：$1"],
      [/^Cover candidate: (.+)$/, "封面候选：$1"],
      [/^Import failed: (.+)$/, "导入失败：$1"],
      [/^Target locked: (.+)\.$/, "目标已锁定：$1。"],
      [/^Publishing check found (\d+) blocker\(s\)\.$/, "发布前检查发现 $1 个阻塞项。"],
      [/^Selected: (.+)$/, "已选择：$1"],
      [/^(.+) - read access granted\.$/, "$1 - 已获得读取权限。"],
      [/^(.+) - permission needed\.$/, "$1 - 需要选择文件夹。"]
    ];
    for (const [pattern, replacement] of patterns) {
      if (pattern.test(source)) return source.replace(pattern, replacement);
    }
    return source;
  }

  function reversePatternText(text) {
    const patterns = [
      [/^(\d+)\/(\d+) 就绪$/, "$1/$2 ready"],
      [/^(\d+)\/(\d+) 项检查就绪$/, "$1/$2 checks ready"],
      [/^(\d+)\/(\d+) 个导入后检查步骤就绪。$/, "$1/$2 live verification steps ready."],
      [/^(\d+)\/(\d+) 个实时验证步骤就绪。$/, "$1/$2 live verification steps ready."],
      [/^(\d+)\/(\d+) 个完成记录项就绪。$/, "$1/$2 proof items ready."],
      [/^(\d+)\/(\d+) 个证明项就绪。$/, "$1/$2 proof items ready."],
      [/^(\d+) 篇待处理，(\d+) 篇已写入$/, "$1 drafts, $2 written"],
      [/^已记录 (\d+)\/(\d+) 项文章检查。$/, "$1/$2 live result checks recorded, including the page import button path."],
      [/^已记录 (\d+)\/(\d+) 项实时结果检查。$/, "$1/$2 live result checks recorded, including the page import button path."],
      [/^已记录 (\d+)\/(\d+) 项最终结果检查。$/, "$1/$2 final result checks recorded."],
      [/^(\d+) 个阻塞项，(\d+) 个警告$/, "$1 blocker(s), $2 warning(s)"],
      [/^(\d+) 个待修复项，(\d+) 个警告$/, "$1 thing(s) to fix, $2 warning(s)"],
      [/^(\d+) 个待修复项，(\d+)\/(\d+) 已就绪$/, "$1 thing(s) to fix, $2/$3 ready"],
      [/^(\d+) 个待处理项，(\d+)\/(\d+) 已就绪$/, "$1 item(s) waiting, $2/$3 ready"],
      [/^(\d+) 个阶段阻塞，(\d+) 个完成$/, "$1 blocked stage(s), $2 complete"],
      [/^(\d+) 个阻塞项，(\d+)\/(\d+) 已证明$/, "$1 blocker(s), $2/$3 proven"],
      [/^(\d+) 个待处理项，(\d+)\/(\d+) 已证明$/, "$1 pending item(s), $2/$3 proven"],
      [/^(\d+) 条记录中有 (\d+) 条匹配。$/, "$2 of $1 record(s) match this search."],
      [/^(\d+) 条本地记录，最新在前。$/, "$1 record(s), newest first."],
      [/^(\d+) 条记录，最新在前。$/, "$1 record(s), newest first."],
      [/^(\d+) 个实时事件；导入完成。$/, "$1 live event(s); import complete."],
      [/^(\d+) 个实时事件；导入失败。$/, "$1 live event(s); import failed."],
      [/^(\d+) 个实时事件；导入中。$/, "$1 live event(s); import in progress."],
      [/^已记录 (\d+) 个实时事件。$/, "$1 live event(s) recorded."],
      [/^(\d+) 个块，已检测标题$/, "$1 blocks, titled"],
      [/^(\d+) 个块，(\d+) 个字符，可以写入。$/, "$1 block(s), $2 character(s), ready to write."],
      [/^标题已检测 · (\d+) 张图片 · (\d+) 个代码块$/, "Title found · $1 images · $2 code blocks"],
      [/^未检测标题 · (\d+) 张图片 · (\d+) 个代码块$/, "No title · $1 images · $2 code blocks"],
      [/^(\d+(?:,\d+)*) 字 · 图片 (\d+) · 代码块 (\d+)$/, "$1 chars · $2 images · $3 code blocks"],
      [/^(\d+(?:,\d+)*) 字$/, "$1 chars"],
      [/^已加入 (\d+) 篇 Markdown 草稿。$/, "Queued $1 Markdown drafts."],
      [/^(\d+) 篇草稿在队列中$/, "$1 queued drafts"],
      [/^(\d+) 篇队列草稿已就绪。$/, "$1 queued drafts ready."],
      [/^(\d+) 篇草稿在队列中。$/, "$1 draft(s) queued."],
      [/^(\d+) 个上传项需要 X 处理器。$/, "$1 upload items need X handler."],
      [/^(\d+) 个上传项就绪。$/, "$1 upload items ready."],
      [/^(\d+) 张图片已上传，(\d+) 张保留为链接$/, "$1 image(s) uploaded, $2 kept as links"],
      [/^(\d+) 张图片已就绪，(\d+) 张需要处理$/, "$1 image(s) ready, $2 kept as links"],
      [/^(\d+) 张图片已上传$/, "$1 image(s) uploaded"],
      [/^图片：(\d+)$/, "Images: $1"],
      [/^网页图片：(\d+)$/, "Web images: $1"],
      [/^网页图片：(\d+) 已就绪$/, "Web images: $1 ready"],
      [/^网页图片：(\d+) 张可能保留为链接$/, "Web images: $1 may stay as links"],
      [/^还有 (\d+) 个导入项$/, "$1 more import item(s)"],
      [/^还有 (\d+) 个账本项$/, "$1 more ledger item(s)"],
      [/^另有 (\d+) 个特殊内容步骤已隐藏。$/, "$1 additional special-content step(s) hidden."],
      [/^另有 (\d+) 个标记操作已隐藏。$/, "$1 additional marker operation(s) hidden."],
      [/^特殊内容 (\d+)$/, "Special $1"],
      [/^原子块 (\d+)$/, "Atomic $1"],
      [/^图片 (\d+)$/, "Images $1"],
      [/^本地 (\d+)$/, "Local $1"]
    ];
    for (const [pattern, replacement] of patterns) {
      if (pattern.test(text)) return text.replace(pattern, replacement);
    }
    return null;
  }

  function translateNodeText(root = document.body) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent || ["SCRIPT", "STYLE", "TEXTAREA", "PRE", "CODE", "OPTION"].includes(parent.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const currentTrimmed = node.nodeValue.trim();
      const sourceTrimmed = node.__xposterSourceText?.trim() || sourceText(currentTrimmed);
      const source = node.__xposterSourceText || node.nodeValue.replace(currentTrimmed, sourceTrimmed);
      node.__xposterSourceText = source;
      const translated = translateText(source.trim());
      node.nodeValue = source.replace(source.trim(), translated);
    }
  }

  function translateAttributes(root = document.body) {
    root.querySelectorAll("[title], [aria-label], [placeholder]").forEach((element) => {
      for (const attr of ["title", "aria-label", "placeholder"]) {
        if (!element.hasAttribute(attr)) continue;
        const key = `xposterSource${attr.replace(/(^|-)([a-z])/g, (_, __, char) => char.toUpperCase())}`;
        const current = element.getAttribute(attr);
        const source = element.dataset[key] || sourceText(current) || current;
        element.dataset[key] = source;
        element.setAttribute(attr, translateText(source));
      }
    });
  }

  function translateDynamicDom(root = document.body) {
    i18n?.renderDom(root);
    translateNodeText(root);
    translateAttributes(root);
    translateEvidencePlaceholder(root);
    document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : "en";
    document.body.dataset.language = currentLanguage;
  }

  function localizeText(text) {
    const source = String(text || "");
    if (!i18n) return translateText(source);
    const translated = i18n.t(source);
    return translated === source ? translateText(source) : translated;
  }

  function setLocalizedText(node, source) {
    if (!node) return;
    delete node.dataset.i18n;
    node.__xposterSourceText = source;
    node.textContent = localizeText(source);
    if (node.firstChild?.nodeType === Node.TEXT_NODE) node.firstChild.__xposterSourceText = source;
  }

  function translateEvidencePlaceholder(root = document.body) {
    if (!root.contains?.(els.evidenceText) && root !== els.evidenceText) return;
    const source = "Run a publishing check or import to save a record.";
    const current = els.evidenceText.textContent.trim();
    if (current === source || current === ZH_TEXT.get(source)) {
      els.evidenceText.textContent = translateText(source);
    }
  }

  async function setLanguage(language, { persist = true } = {}) {
    currentLanguage = i18n?.normalizeLanguage?.(language) || (language === "zh" ? "zh" : "en");
    if (els.languageSelect) els.languageSelect.value = currentLanguage;
    if (i18n) {
      await i18n.setLanguage(currentLanguage, { persist, render: false });
    }
    translateDynamicDom();
    updateDraftBrief();
    renderRecordHistory();
    if (persist && hasChromeApi()) {
      chrome.storage.local.set({ [STORAGE_LANGUAGE]: currentLanguage });
    }
  }

  async function restoreLanguage() {
    if (i18n) {
      currentLanguage = await i18n.restoreLanguage({ render: false });
      await setLanguage(currentLanguage, { persist: false });
      return;
    }
    if (hasChromeApi()) {
      const stored = await chrome.storage.local.get(STORAGE_LANGUAGE);
      if (stored[STORAGE_LANGUAGE]) {
        await setLanguage(stored[STORAGE_LANGUAGE], { persist: false });
        return;
      }
    }
    await setLanguage(currentLanguage, { persist: false });
  }

  async function activeTab() {
    if (!hasChromeApi()) return null;
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab || null;
  }

  async function sendToActiveTab(message) {
    const tab = await activeTab();
    if (!tab?.id) return { ok: false, error: "No active tab" };
    try {
      return await chrome.tabs.sendMessage(tab.id, message);
    } catch (error) {
      return { ok: false, error: error?.message || String(error) };
    }
  }

  async function cancelImport() {
    if (importCancelRequested) return;
    importCancelRequested = true;
    updateLiveProgress();
    log("Stop requested. xPoster will stop before the next upload step.");
    const response = await sendToActiveTab({ type: "xposter:cancel-import" });
    if (!response?.ok) {
      importCancelRequested = false;
      log(response?.error ? `Stop request failed: ${localizeText(response.error)}` : "Stop request failed: active X tab did not respond");
      updateLiveProgress();
    }
  }

  function isRemoteHttpImageSource(source) {
    return shared.isRemoteHttpImageSource(source);
  }

  function localImageSegments(parsed = latestParsed) {
    return (parsed?.segments || []).filter((segment) => segment.type === "image" && shared.isLocalImageSource(segment.source));
  }

  function remoteHttpImageSegments(parsed = latestParsed) {
    const seen = new Set();
    return remoteHttpImageSegmentsIncludingCover(parsed).filter((segment) => {
      const source = String(segment.source || "");
      if (!source || seen.has(source)) return false;
      seen.add(source);
      return true;
    });
  }

  function remoteHttpImageSegmentsIncludingCover(parsed = latestParsed) {
    const segments = (parsed?.segments || []).filter((segment) => segment.type === "image" && isRemoteHttpImageSource(segment.source));
    const cover = String(parsed?.cover || "").trim();
    if (cover && isRemoteHttpImageSource(cover) && !segments.some((segment) => shared.imageSourcesMatch(segment.source, cover))) {
      segments.push({ type: "image", source: cover, alt: "cover" });
    }
    return segments;
  }

  function remoteImageOriginCounts(parsed = latestParsed) {
    const counts = new Map();
    for (const segment of remoteHttpImageSegments(parsed)) {
      try {
        const origin = new URL(segment.source).origin;
        counts.set(origin, (counts.get(origin) || 0) + 1);
      } catch {}
    }
    return counts;
  }

  function remoteImageOrigins(parsed = latestParsed) {
    return Array.from(remoteImageOriginCounts(parsed).keys());
  }

  function mediaUploadEstimate(parsed = latestParsed) {
    if (!parsed?.segments?.length) {
      return {
        bodyImages: 0,
        tables: 0,
        coverOnly: 0,
        total: 0,
        overSoftLimit: false
      };
    }
    const bodyImages = parsed.segments.filter((segment) => segment.type === "image").length;
    const tables = parsed.segments.filter((segment) => segment.type === "table").length;
    const coverSource = importOptions.setCover === false ? "" : String(parsed.cover || "").trim();
    const coverOnly = coverSource && !parsed.segments.some(
      (segment) => segment.type === "image" && shared.imageSourcesMatch(segment.source, coverSource)
    )
      ? 1
      : 0;
    const total = bodyImages + tables + coverOnly;
    return {
      bodyImages,
      tables,
      coverOnly,
      total,
      overSoftLimit: total > X_ARTICLE_MEDIA_SOFT_LIMIT
    };
  }

  function mediaLimitWarningText(estimate = mediaUploadEstimate()) {
    const count = String(estimate.total || 0);
    if (i18n) return i18n.t(X_ARTICLE_MEDIA_LIMIT_WARNING, { count });
    return translateText(X_ARTICLE_MEDIA_LIMIT_WARNING).replace("{count}", count);
  }

  function remoteImagePermissionPattern(origin) {
    try {
      const url = new URL(origin);
      if (url.protocol !== "http:" && url.protocol !== "https:") return "";
      return `${url.origin}/*`;
    } catch {
      return "";
    }
  }

  async function remoteImagePermissionStatus(origins) {
    const available = [];
    const missing = [];
    const uniqueOrigins = Array.from(new Set((origins || []).filter(Boolean)));
    if (!hasChromeApi() || !chrome.permissions?.contains) {
      return { available, missing: uniqueOrigins };
    }
    await Promise.all(uniqueOrigins.map(async (origin) => {
      const permission = remoteImagePermissionPattern(origin);
      if (!permission) return;
      try {
        if (await chrome.permissions.contains({ origins: [permission] })) available.push(origin);
        else missing.push(origin);
      } catch {
        missing.push(origin);
      }
    }));
    return { available, missing };
  }

  function remoteImageOriginsForMarkdowns(markdowns = [], options = importOptions) {
    const origins = new Set();
    for (const markdown of markdowns) {
      try {
        for (const origin of remoteImageOrigins(parseDraftMarkdown(markdown || "", options))) {
          origins.add(origin);
        }
      } catch {}
    }
    return Array.from(origins);
  }

  function pluralizeUnit(count, singular, plural = `${singular}s`) {
    return `${count} ${count === 1 ? singular : plural}`;
  }

  function formatRecognizedItem(count, enSingular, enPlural, zhUnit) {
    if (currentLanguage === "zh") return `${count} ${zhUnit}`;
    return pluralizeUnit(count, enSingular, enPlural);
  }

  function draftRecognitionText(parsed = latestParsed, counts = latestCounts) {
    if (!parsed?.segments?.length) return "Step 1: paste Markdown, or choose a .md file.";
    const resolvedCounts = counts || shared.segmentCounts(parsed.segments);
    const parts = [];
    parts.push(parsed.title ? "Title found" : "No title");
    parts.push(pluralizeUnit(resolvedCounts.image || 0, "image"));
    parts.push(pluralizeUnit(resolvedCounts.code || 0, "code block"));
    return parts.join(" · ");
  }

  function updateDraftBrief() {
    const hasDraft = Boolean(latestParsed?.segments?.length);
    if (els.draftPanel) els.draftPanel.dataset.emptyDraft = hasDraft || queueModeActive() ? "false" : "true";
    if (!els.draftBrief) return;
    els.draftBrief.dataset.tone = hasDraft ? "ready" : "idle";
    els.draftBrief.hidden = !hasDraft;
    setLocalizedText(els.draftRecognized, draftRecognitionText());
  }

  function remoteImageProbeKey(segment) {
    return String(segment?.source || "");
  }

  function resetRemoteImageProbeStatus(parsed = latestParsed) {
    const images = remoteHttpImageSegments(parsed);
    const existing = new Map((remoteImageProbeStatus.results || []).map((item) => [item.source, item]));
    const results = images.map((segment, index) => {
      const source = remoteImageProbeKey(segment);
      const previous = existing.get(source);
      return previous
        ? { ...previous, index: index + 1 }
        : {
            index: index + 1,
            source,
            fileName: shared.guessFileName(source, `image-${index + 1}`),
            ok: null,
            error: "",
            bytes: null,
            mime: ""
          };
    });
    const allCurrentImagesHaveResults =
      images.length > 0 &&
      results.length === images.length &&
      results.every((item) => item.ok === true || item.ok === false);
    const checkedAt = images.length ? remoteImageProbeStatus.checkedAt : null;
    remoteImageProbeStatus = {
      state: allCurrentImagesHaveResults ? "checked" : "idle",
      total: images.length,
      ok: results.filter((item) => item.ok === true).length,
      fail: results.filter((item) => item.ok === false).length,
      results,
      checkedAt
    };
  }

  function ensureLatestParsedFromDraft() {
    analyzeDraftNow();
    return latestParsed;
  }

  function draftFingerprint(markdown) {
    const value = String(markdown || "");
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return `${value.length}-${(hash >>> 0).toString(36)}`;
  }

  function draftSourceLabel(source = "typed") {
    const labels = {
      file: "File",
      "drop-file": "Dropped file",
      drop: "Dropped text",
      paste: "Pasted text",
      example: "Example draft",
      restored: "Restored draft",
      queue: "Queued draft",
      typed: "Typed draft"
    };
    return labels[source] || "Draft";
  }

  function newRecordId(prefix = "record") {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function markdownSnapshot(markdown) {
    const text = String(markdown || "");
    if (!text) {
      return {
        text: "",
        characters: 0,
        truncated: false
      };
    }
    return {
      text: text.slice(0, MAX_RECORD_MARKDOWN_CHARS),
      characters: text.length,
      truncated: text.length > MAX_RECORD_MARKDOWN_CHARS
    };
  }

  function buildDraftHistoryEvidence(source = "typed", extra = {}) {
    const markdown = els.markdown.value || "";
    const snapshot = markdownSnapshot(markdown);
    const parsed = latestParsed || ensureLatestParsedFromDraft();
    const counts = latestCounts || shared.segmentCounts(parsed?.segments || []);
    const remoteImages = remoteHttpImageSegments(parsed);
    const localImages = parsed?.segments?.filter((segment) => segment.type === "image" && shared.isLocalImageSource(segment.source)).length || 0;
    const fingerprint = draftFingerprint(markdown);
    const now = new Date().toISOString();
    return {
      id: extra.recordId || newRecordId("draft-record"),
      kind: "draft-loaded",
      capturedAt: now,
      updatedAt: now,
      draftRecordId: extra.draftRecordId || activeDraftRecordId,
      draftFingerprint: fingerprint,
      source: {
        type: source,
        label: draftSourceLabel(source),
        fileName: extra.fileName || null,
        size: extra.size || markdown.length
      },
      draft: {
        title: parsed?.title || null,
        cover: parsed?.cover || null,
        markdown: snapshot.text,
        markdownTruncated: snapshot.truncated,
        counts,
        blocks: parsed?.segments?.length || 0,
        characters: markdown.length,
        remoteImages: {
          count: remoteImages.length,
          origins: remoteImageOrigins(parsed),
          access: remoteImageAccessStatus,
          probe: remoteImageProbeStatus
        },
        localImages
      },
      importPlan: buildPreviewPlan(parsed),
      importLedger: buildImportLedger(parsed, counts),
      targetContext: buildTargetContextEvidence(),
      ...extra
    };
  }

  function rememberDraftHistory(source = "typed", extra = {}) {
    const markdown = els.markdown.value || "";
    if (!markdown.trim() || !latestParsed?.segments?.length) return null;
    const { forceNew = false, ...details } = extra || {};
    const fingerprint = draftFingerprint(markdown);
    const shouldCreateDraft = forceNew || activeDraftFinalized || !activeDraftRecordId;
    if (shouldCreateDraft) {
      activeDraftRecordId = newRecordId("draft");
      activeDraftFinalized = false;
    }
    activeDraftFingerprint = fingerprint;
    const previous = currentDraftRecord(activeDraftRecordId);
    const recordId = forceNew || !previous ? newRecordId("draft-record") : previous.id;
    const evidence = buildDraftHistoryEvidence(source, {
      ...details,
      recordId,
      draftRecordId: activeDraftRecordId,
      draftFingerprint: fingerprint
    });
    addRecordHistoryEntry(evidence);
    return evidence;
  }

  function ensureActiveDraftRecordId() {
    if (activeDraftRecordId) return activeDraftRecordId;
    activeDraftRecordId = newRecordId("draft");
    activeDraftFingerprint = draftFingerprint(els.markdown.value || "");
    activeDraftFinalized = false;
    return activeDraftRecordId;
  }

  function scheduleDraftHistory(source = "typed", extra = {}) {
    window.clearTimeout(draftInputHistoryTimer);
    draftInputHistoryTimer = window.setTimeout(() => {
      rememberDraftHistory(source, extra);
    }, 700);
  }

  function queueItemId(prefix = "queue") {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function markdownQueueTitle(markdown, fallback = "Untitled Markdown") {
    try {
      const parsed = parseDraftMarkdown(markdown || "");
      if (parsed.title) return parsed.title;
      const heading = String(markdown || "").match(/^\s*#\s+(.+)$/m)?.[1]?.trim();
      return heading || fallback;
    } catch {
      return fallback;
    }
  }

  function normalizeQueueItem(item) {
    if (!item || typeof item !== "object") return null;
    const markdown = String(item.markdown || "");
    if (!markdown.trim()) return null;
    const fileName = String(item.fileName || "").trim();
    const title = String(item.title || markdownQueueTitle(markdown, fileName || "Untitled Markdown")).trim();
    return {
      id: String(item.id || queueItemId()),
      fileName,
      title,
      markdown,
      characters: Number(item.characters || markdown.length),
      status: ["loaded", "writing", "written"].includes(item.status) ? item.status : "queued",
      addedAt: item.addedAt || new Date().toISOString(),
      loadedAt: item.loadedAt || null,
      writtenAt: item.writtenAt || null,
      source: item.source || "drop"
    };
  }

  function queueModeActive() {
    return draftQueue.length > 0;
  }

  function queueStorageEntry(item) {
    return {
      id: item.id,
      fileName: item.fileName,
      title: item.title,
      markdown: item.markdown,
      characters: item.characters,
      status: item.status,
      addedAt: item.addedAt,
      loadedAt: item.loadedAt,
      writtenAt: item.writtenAt,
      source: item.source
    };
  }

  function currentDraftQueueItem() {
    const text = els.markdown.value || "";
    if (!text.trim()) return null;
    return createQueueItemFromMarkdown(text, {
      fileName: "",
      source: "typed",
      id: queueItemId("queue-current")
    });
  }

  function queueDraftTooLargeDetail() {
    return currentLanguage === "zh"
      ? "单篇 Markdown 超过队列保存上限。请单独载入这篇草稿。"
      : "One Markdown file was too large for the queue. Load that draft by itself.";
  }

  function utf8Size(value) {
    return new Blob([String(value || "")]).size;
  }

  function queueItemStorageSize(item) {
    return utf8Size(JSON.stringify(queueStorageEntry(item)));
  }

  function trimQueueForStorage(items, maxBytes = MAX_DRAFT_QUEUE_STORAGE_BYTES) {
    const kept = [];
    let totalBytes = 2;
    for (let index = items.length - 1; index >= 0; index -= 1) {
      const item = items[index];
      const itemBytes = queueItemStorageSize(item);
      if (itemBytes > MAX_DRAFT_QUEUE_ITEM_BYTES) continue;
      if (totalBytes + itemBytes > maxBytes) continue;
      kept.unshift(item);
      totalBytes += itemBytes;
    }
    return kept;
  }

  function syncActiveQueueWithDraft() {
    if (!activeQueueItemId) return;
    const activeItem = draftQueue.find((item) => item.id === activeQueueItemId);
    if (activeItem && activeItem.markdown === els.markdown.value) return;
    activeQueueItemId = null;
    draftQueue = draftQueue.map((item) => item.status === "loaded" ? { ...item, status: "queued" } : item);
    persistDraftQueue();
    renderDraftQueue();
  }

  function persistDraftQueue() {
    if (!hasChromeApi()) return;
    const nextQueue = trimQueueForStorage(draftQueue);
    if (nextQueue.length !== draftQueue.length) {
      draftQueue = nextQueue;
      if (activeQueueItemId && !draftQueue.some((item) => item.id === activeQueueItemId)) activeQueueItemId = null;
      renderDraftQueue();
      log("Queue was trimmed to fit browser storage.");
    }
    Promise.resolve(chrome.storage.local.set({ [STORAGE_DRAFT_QUEUE]: draftQueue.map(queueStorageEntry) })).catch(() => {
      log("Could not save the Markdown queue in browser storage.");
    });
  }

  function queueSummaryText() {
    const total = draftQueue.length;
    if (!total) return "Paste Markdown here, choose a file, or drop .md files.";
    return `${total} draft${total === 1 ? "" : "s"} queued`;
  }

  function queuedDraftAddedDetail(count = 1) {
    const total = draftQueue.length;
    if (currentLanguage === "zh") {
      return `新增 ${count} 篇草稿，队列现在有 ${total} 篇。`;
    }
    return `${count} new draft${count === 1 ? "" : "s"} added. ${total} total in queue.`;
  }

  function showQueuedDraftAdded(count = 1) {
    setDraftDropStatus("Draft added", queuedDraftAddedDetail(count), "done");
  }

  function markQueueItemsEntered(items = []) {
    for (const item of items) {
      if (item?.id) animatedQueueItemIds.add(item.id);
    }
    if (!animatedQueueItemIds.size) return;
    window.clearTimeout(queueMotionTimer);
    queueMotionTimer = window.setTimeout(() => {
      if (!animatedQueueItemIds.size) return;
      animatedQueueItemIds = new Set();
      renderDraftQueue();
    }, 780);
  }

  function isMarkdownFile(file) {
    return MARKDOWN_FILE_RE.test(file?.name || "");
  }

  function markdownFilesFrom(files) {
    return Array.from(files || []).filter(isMarkdownFile);
  }

  function showMarkdownLoadError(detail = MARKDOWN_LOAD_ERROR_DETAIL) {
    setDraftDropStatus(MARKDOWN_LOAD_ERROR_TITLE, detail, "error");
  }

  function queueStatusLabel(item) {
    if (item.status === "writing" || item.id === activeWriteQueueItemId) return "Writing";
    return "Queued";
  }

  function createQueueItemFromMarkdown(markdown, { fileName = "", source = "typed", id = queueItemId("queue-draft") } = {}) {
    const text = String(markdown || "");
    return normalizeQueueItem({
      id,
      fileName,
      title: markdownQueueTitle(text, fileName || "Untitled Markdown"),
      markdown: text,
      characters: text.length,
      addedAt: new Date().toISOString(),
      source
    });
  }

  function syncDraftSurface() {
    const hasQueue = queueModeActive();
    if (els.draftQueue) els.draftQueue.hidden = !hasQueue;
    if (els.markdown) {
      els.markdown.hidden = hasQueue;
      els.markdown.setAttribute("aria-hidden", hasQueue ? "true" : "false");
      els.markdown.tabIndex = hasQueue ? -1 : 0;
    }
    updateDraftBrief();
  }

  function setSingleDraftMarkdown(markdown, { source = "typed", fileName = null, statusTitle = "Markdown loaded", logMessage = "", remember = true } = {}) {
    const text = String(markdown || "");
    activeQueueItemId = null;
    draftQueue = [];
    persistDraftQueue();
    suppressNextTypedHistory = true;
    window.clearTimeout(draftInputHistoryTimer);
    els.markdown.value = text;
    saveDraft();
    analyzeDraft();
    renderDraftQueue();
    if (text.trim()) {
      if (remember) {
        rememberDraftHistory(source, {
          forceNew: true,
          fileName,
          size: text.length
        });
      }
      setDraftDropStatus(statusTitle, draftReadyDetail(text.length), "done");
      acknowledgeDraftInput();
    }
    updateWriteButton();
    if (logMessage) log(logMessage);
  }

  function addDraftToQueue(markdown, { fileName = "", source = "typed", activate = true, statusTitle = "Markdown loaded", logMessage = "", remember = true } = {}) {
    const item = createQueueItemFromMarkdown(markdown, { fileName, source });
    if (!item) {
      showMarkdownLoadError();
      return null;
    }
    if (queueItemStorageSize(item) > MAX_DRAFT_QUEUE_ITEM_BYTES) {
      showMarkdownLoadError(queueDraftTooLargeDetail());
      log(queueDraftTooLargeDetail());
      return null;
    }
    const existingSingle = !draftQueue.length ? currentDraftQueueItem() : null;
    if (!draftQueue.length && !existingSingle) {
      setSingleDraftMarkdown(item.markdown, { source, fileName, statusTitle, logMessage, remember });
      return item;
    }
    const baseQueue = existingSingle ? [existingSingle] : draftQueue;
    draftQueue = [...baseQueue.filter((entry) => `${entry.fileName}\n${entry.markdown}` !== `${item.fileName}\n${item.markdown}`), item].slice(-MAX_DRAFT_QUEUE);
    persistDraftQueue();
    if (draftQueue.length === 1 && activate) {
      loadQueueItem(item.id, { remember });
    } else {
      if (activate) activeQueueItemId = item.id;
      markQueueItemsEntered([item]);
      renderDraftQueue();
      showQueuedDraftAdded(1);
    }
    if (statusTitle && draftQueue.length === 1) setDraftDropStatus(statusTitle, draftReadyDetail(item.markdown.length), "done");
    if (logMessage) log(logMessage);
    return item;
  }

  function renderDraftQueue() {
    if (!els.draftQueue || !els.draftQueueList) return;
    syncDraftSurface();
    const hasQueue = queueModeActive();
    if (els.draftQueueMeta) els.draftQueueMeta.textContent = queueSummaryText();
    if (!hasQueue) {
      els.draftQueueList.innerHTML = "";
      updateWriteButton();
      return;
    }
    const safe = shared.escapeHtml;
    els.draftQueueList.innerHTML = draftQueue.map((item, index) => `
      <li class="draft-queue-item" data-queue-id="${safe(item.id)}" data-status="${safe(item.status)}" ${animatedQueueItemIds.has(item.id) ? 'data-motion="entered"' : ""} ${item.id === activeQueueItemId ? 'data-active="true"' : ""}>
        <button class="draft-queue-main" type="button" data-queue-action="edit" data-queue-id="${safe(item.id)}" title="${safe(localizeText("Edit draft"))}" aria-label="${safe(localizeText("Edit draft"))}">
          <span>${index + 1}</span>
          <strong>${safe(item.title || item.fileName || "Untitled Markdown")}</strong>
          <em>${safe([item.fileName, localizeText(`${Number(item.characters || 0).toLocaleString()} chars`)].filter(Boolean).join(" · "))}</em>
        </button>
        <span class="draft-queue-state">${safe(localizeText(queueStatusLabel(item)))}</span>
        <div class="draft-queue-actions" aria-label="${safe(localizeText("Draft actions"))}">
          <button class="record-icon-action draft-queue-edit" type="button" data-queue-action="edit" data-queue-id="${safe(item.id)}" title="${safe(localizeText("Edit draft"))}" aria-label="${safe(localizeText("Edit draft"))}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.8 4.2a2.9 2.9 0 0 1 4.1 4.1L9.7 18.5 5 19l.5-4.7L15.8 4.2Zm1.4 1.4L7.4 15.4l-.2 1.4 1.4-.2 9.8-9.8a.9.9 0 0 0-1.2-1.2Z"/></svg>
          </button>
          <button class="record-icon-action draft-queue-copy" type="button" data-queue-action="copy" data-queue-id="${safe(item.id)}" title="${safe(localizeText("Copy text"))}" aria-label="${safe(localizeText("Copy text"))}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7h10v13H8V7Zm2 2v9h6V9h-6ZM5 4h10v2H7v10H5V4Z"/></svg>
          </button>
        </div>
      </li>
    `).join("");
    translateDynamicDom(els.draftQueue);
    updateWriteButton();
  }

  async function restoreDraftQueue() {
    if (!hasChromeApi()) {
      renderDraftQueue();
      return;
    }
    const stored = await chrome.storage.local.get(STORAGE_DRAFT_QUEUE).catch(() => ({}));
    draftQueue = Array.isArray(stored[STORAGE_DRAFT_QUEUE])
      ? stored[STORAGE_DRAFT_QUEUE].map(normalizeQueueItem).filter(Boolean).slice(0, MAX_DRAFT_QUEUE)
      : [];
    activeQueueItemId = draftQueue.find((item) => item.status === "loaded")?.id || activeQueueItemId;
    renderDraftQueue();
  }

  function addDraftQueueItems(items, { activateFirst = false, source = "drop" } = {}) {
    const allNormalized = items
      .map((item) => normalizeQueueItem({ ...item, source: item.source || source }))
      .filter(Boolean);
    const normalized = allNormalized.filter((item) => queueItemStorageSize(item) <= MAX_DRAFT_QUEUE_ITEM_BYTES);
    if (allNormalized.length && !normalized.length) {
      showMarkdownLoadError(queueDraftTooLargeDetail());
      log(queueDraftTooLargeDetail());
    }
    if (!normalized.length) return [];
    const existingSingle = !draftQueue.length ? currentDraftQueueItem() : null;
    const baseQueue = existingSingle ? [existingSingle] : draftQueue;
    const known = new Set(baseQueue.map((item) => `${item.fileName}\n${item.markdown}`));
    const nextItems = normalized.filter((item) => !known.has(`${item.fileName}\n${item.markdown}`));
    if (!nextItems.length) return [];
    draftQueue = [...baseQueue, ...nextItems].slice(-MAX_DRAFT_QUEUE);
    if (activateFirst) activeQueueItemId = nextItems[0].id;
    persistDraftQueue();
    markQueueItemsEntered(nextItems);
    renderDraftQueue();
    showQueuedDraftAdded(nextItems.length);
    return nextItems;
  }

  async function handleDraftQueueClick(event) {
    const button = event.target.closest("[data-queue-action]");
    if (!button) return;
    if (button.dataset.queueAction === "new") {
      openNewDraftEditor();
      return;
    }
    const id = button.dataset.queueId || button.closest("[data-queue-id]")?.dataset.queueId;
    if (!id) return;
    if (button.dataset.queueAction === "edit") {
      openQueueEditor(id);
      return;
    }
    if (button.dataset.queueAction === "copy") {
      const item = draftQueue.find((entry) => entry.id === id);
      await copyMarkdownText(item?.markdown || "", { success: "Queued Markdown copied." });
      return;
    }
  }

  function loadQueueItem(id, { persist = true, remember = true } = {}) {
    const item = draftQueue.find((entry) => entry.id === id);
    if (!item) return false;
    activeQueueItemId = item.id;
    draftQueue = draftQueue.map((entry) => entry.id === item.id
      ? { ...entry, status: entry.status === "written" ? "written" : "loaded", loadedAt: new Date().toISOString() }
      : entry.status === "loaded" ? { ...entry, status: "queued" } : entry);
    suppressNextTypedHistory = true;
    window.clearTimeout(draftInputHistoryTimer);
    els.markdown.value = item.markdown;
    saveDraft();
    analyzeDraft();
    if (remember) {
      rememberDraftHistory(item.source || "queue", {
        forceNew: true,
        fileName: item.fileName,
        size: item.characters,
        queueItemId: item.id
      });
    }
    setDraftDropStatus("Markdown loaded", draftReadyDetail(item.markdown.length), "done");
    acknowledgeDraftInput();
    if (persist) persistDraftQueue();
    renderDraftQueue();
    updateWriteButton();
    return true;
  }

  function markActiveQueueItemWritten() {
    const completedId = activeWriteQueueItemId || activeQueueItemId;
    if (!completedId) return;
    activeWriteQueueItemId = null;
    draftQueue = draftQueue.filter((item) => item.id !== completedId);
    if (activeQueueItemId === completedId) activeQueueItemId = null;
    if (!draftQueue.length) {
      suppressNextTypedHistory = true;
      window.clearTimeout(draftInputHistoryTimer);
      els.markdown.value = "";
      saveDraft();
      analyzeDraft();
      setDraftDropStatus("Markdown draft", "Paste Markdown here, choose a file, or drop .md files.", "idle");
    }
    persistDraftQueue();
    renderDraftQueue();
    updateWriteButton();
  }

  function updateQueueItemMarkdown(id, markdown) {
    const item = draftQueue.find((entry) => entry.id === id);
    const text = String(markdown || "");
    if (!item || !text.trim()) return false;
    const updated = {
      ...item,
      title: markdownQueueTitle(text, item.fileName || item.title || "Untitled Markdown"),
      markdown: text,
      characters: text.length,
      status: item.status === "written" ? "queued" : item.status,
      updatedAt: new Date().toISOString()
    };
    draftQueue = draftQueue.map((entry) => entry.id === id ? updated : entry);
    if (id === activeQueueItemId) {
      suppressNextTypedHistory = true;
      window.clearTimeout(draftInputHistoryTimer);
      els.markdown.value = text;
      saveDraft();
      analyzeDraft();
      rememberDraftHistory(updated.source || "queue", {
        forceNew: true,
        fileName: updated.fileName,
        size: updated.characters,
        queueItemId: updated.id
      });
      setDraftDropStatus("Markdown updated", draftReadyDetail(text.length), "done");
      acknowledgeDraftInput();
    }
    persistDraftQueue();
    renderDraftQueue();
    updateWriteButton();
    return true;
  }

  function setMarkdownEditorOpen(open) {
    if (!els.recordEditSheet) return;
    els.recordEditSheet.hidden = !open;
    document.body.dataset.modalOpen = open ? "true" : "false";
    document.documentElement.dataset.modalOpen = open ? "true" : "false";
  }

  function configureMarkdownEditor({ title, meta, value, primaryLabel, mode, id }) {
    if (!els.recordEditSheet || !els.recordEditTextarea) return;
    activeDraftEditor = { mode, id };
    if (els.recordEditTitle) els.recordEditTitle.textContent = title;
    if (els.recordEditMeta) els.recordEditMeta.textContent = meta;
    if (els.recordEditPrimaryLabel) {
      els.recordEditPrimaryLabel.dataset.i18n = primaryLabel;
      els.recordEditPrimaryLabel.textContent = primaryLabel;
    }
    els.recordEditTextarea.dataset.editorMode = mode;
    els.recordEditTextarea.dataset.recordId = mode === "record" ? id : "";
    els.recordEditTextarea.dataset.queueId = mode === "queue" || mode === "new" ? id : "";
    els.recordEditTextarea.value = value;
    if (els.recordEditWriteButton) els.recordEditWriteButton.hidden = mode !== "queue";
    setMarkdownEditorOpen(true);
    translateDynamicDom(els.recordEditSheet);
    window.setTimeout(() => els.recordEditTextarea?.focus?.(), 0);
  }

  async function filesToQueueItems(files) {
    const markdownFiles = markdownFilesFrom(files);
    const items = [];
    for (const file of markdownFiles) {
      const markdown = await file.text();
      if (!markdown.trim()) continue;
      items.push({
        id: queueItemId("queue-file"),
        fileName: file.name || "",
        title: markdownQueueTitle(markdown, file.name || "Untitled Markdown"),
        markdown,
        characters: markdown.length,
        addedAt: new Date().toISOString(),
        source: "drop"
      });
    }
    return items;
  }

  function syncRemoteImageAccessStatusFromDraft(parsed = latestParsed) {
    const origins = remoteImageOrigins(parsed);
    remoteImageAccessStatus = {
      origins,
      available: [],
      missing: origins,
      checkedAt: null
    };
    resetRemoteImageProbeStatus(parsed);
  }

  async function refreshRemoteImageAccessStatus(parsed = latestParsed) {
    const origins = remoteImageOrigins(parsed);
    const { available, missing } = await remoteImagePermissionStatus(origins);
    remoteImageAccessStatus = {
      origins,
      available,
      missing,
      checkedAt: new Date().toISOString()
    };
    updatePreflight();
    return remoteImageAccessStatus;
  }

  async function requestRemoteImageAccessForOrigins(origins, parsedForStatus = latestParsed) {
    const permissions = Array.from(new Set((origins || [])
      .map(remoteImagePermissionPattern)
      .filter(Boolean)));
    if (!permissions.length) return { ok: true, requested: [], granted: true };
    if (!hasChromeApi() || !chrome.permissions?.request) {
      return { ok: false, requested: permissions, error: "Remote image access is not available in this context." };
    }
    try {
      const granted = await chrome.permissions.request({ origins: permissions });
      await refreshRemoteImageAccessStatus(parsedForStatus);
      return { ok: granted, requested: permissions, granted };
    } catch (error) {
      await refreshRemoteImageAccessStatus(parsedForStatus).catch(() => {});
      return { ok: false, requested: permissions, error: error?.message || String(error) };
    }
  }

  async function requestRemoteImageAccess(parsed = latestParsed) {
    return requestRemoteImageAccessForOrigins(remoteImageOrigins(parsed), parsed);
  }

  function originalImporterResidueStatus() {
    const candidates = [
      latestPageStatus?.originalImporterResidue,
      latestPageStatus?.targetContext?.originalImporterResidue,
      latestDiagnostics?.originalImporterResidue,
      latestDiagnostics?.targetContext?.originalImporterResidue
    ].filter(Boolean);
    const markers = Array.from(new Set(candidates.flatMap((item) => item.markers || [])));
    const detected = candidates.some((item) => item.detected) || markers.length > 0;
    return {
      detected,
      markers,
      detail: detected
        ? `Old Markdown importer detected${markers.length ? `: ${markers.join(", ")}` : "."}`
        : ""
    };
  }

  function delay(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function currentVault() {
    return latestPageStatus?.vault || latestDiagnostics?.vault || null;
  }

  function updateProgressiveSections() {
    const localImages = localImageSegments();
    const vault = currentVault();
    const showLocalImages = Boolean(localImages.length || vault?.configured);
    if (els.localImagesPanel) els.localImagesPanel.hidden = !showLocalImages;
    syncProgressiveSectionVisibility();
  }

  function scheduleAnalyzeDraft(delay = DRAFT_ANALYZE_DELAY_MS) {
    window.clearTimeout(draftAnalyzeTimer);
    draftAnalyzeTimer = window.setTimeout(() => {
      draftAnalyzeTimer = null;
      analyzeDraft();
    }, delay);
  }

  function analyzeDraftNow() {
    window.clearTimeout(draftAnalyzeTimer);
    draftAnalyzeTimer = null;
    analyzeDraft();
  }

  function analyzeDraft() {
    renderDraftAnalysis();
  }

  function renderDraftAnalysis() {
    const markdown = els.markdown.value;
    if (!markdown.trim()) {
      latestParsed = null;
      latestCounts = shared.segmentCounts([]);
      els.inspector?.setAttribute("data-has-draft", "false");
      syncRemoteImageAccessStatusFromDraft(null);
      updateDraftBrief();
      els.titleMetric.textContent = "None";
      els.imageMetric.textContent = "0";
      els.tableMetric.textContent = "0";
      els.tweetMetric.textContent = "0";
      renderPreview(null);
      updateConversionMap(null);
      updateImportLedger(null);
      renderDraftReview(null);
      updatePreflight();
      updateWriteButton();
      updateProgressiveSections();
      if (!queueModeActive()) {
        setDraftDropStatus("Markdown draft", "Paste Markdown here, choose a file, or drop .md files.", "idle");
      }
      return;
    }
    try {
      const parsed = parseDraftMarkdown(markdown);
      const counts = shared.segmentCounts(parsed.segments);
      latestParsed = parsed;
      latestCounts = counts;
      els.inspector?.setAttribute("data-has-draft", "true");
      syncRemoteImageAccessStatusFromDraft(parsed);
      updateDraftBrief();
      const remoteImages = remoteHttpImageSegments(parsed);
      if (hasChromeApi() && remoteImages.length) {
        refreshRemoteImageAccessStatus(parsed).catch(() => {});
      }
      if (!remoteImages.length) resetRemoteImageProbeStatus(parsed);
      els.titleMetric.textContent = parsed.title || "None";
      els.imageMetric.textContent = String(counts.image || 0);
      els.tableMetric.textContent = String(counts.table || 0);
      els.tweetMetric.textContent = String(counts.tweet || 0);
      renderPreview(parsed, counts);
      updateConversionMap(parsed, counts);
      updateImportLedger(parsed, counts);
      renderDraftReview(parsed, counts);
      updatePreflight();
      updateWriteButton();
      updateProgressiveSections();
      setDraftDropStatus("Markdown loaded", draftReadyDetail(markdown.length, counts), "done");
    } catch (error) {
      log(`Could not analyze draft: ${error?.message || error}`);
      showMarkdownLoadError(error?.message || MARKDOWN_LOAD_ERROR_DETAIL);
    }
  }

  function updateConversionMap(parsed, counts = null) {
    if (!els.conversionMapList) return;
    const rows = buildConversionMap(parsed, counts || (parsed ? shared.segmentCounts(parsed.segments) : shared.segmentCounts([])));
    const ready = rows.filter((row) => row.tone === "ok" || row.tone === "ready").length;
    const active = rows.filter((row) => row.count > 0).length;
    els.conversionMapMeta.textContent = parsed
      ? `${active} content type(s) found; ${ready}/${rows.length} ready to import.`
      : "Load Markdown to see text, images, tables, tweets, code, and dividers.";
    for (const row of rows) {
      const item = els.conversionMapList.querySelector(`[data-map="${row.id}"]`);
      if (!item) continue;
      item.dataset.tone = row.tone;
      item.querySelector("strong").textContent = row.label;
      item.querySelector("span").textContent = row.detail;
      item.querySelector("em").textContent = row.countLabel || String(row.count);
    }
    translateDynamicDom(els.conversionMapList.closest("section"));
  }

  function updateImportLedger(parsed = latestParsed, counts = null) {
    if (!els.importLedgerList) return;
    const rows = buildImportLedger(parsed, counts || (parsed ? shared.segmentCounts(parsed.segments) : shared.segmentCounts([])));
    if (!parsed?.segments?.length) {
      els.importLedgerMeta.textContent = "Load Markdown to see what each block will become.";
    } else {
      const blocked = rows.filter((row) => row.tone === "error").length;
      const waiting = rows.filter((row) => row.tone === "warn").length;
      const direct = rows.filter((row) => row.path === "Write text").length;
      const plannedRows = Math.max(0, rows.length - rows.filter((row) => row.kind === "media-limit").length);
      els.importLedgerMeta.textContent = blocked
        ? `${blocked} item(s) need attention; ${waiting} waiting; ${direct} text item(s) ready.`
        : `${plannedRows} item(s) planned; ${waiting} waiting; ${direct} text item(s) ready.`;
    }
    els.importLedgerList.innerHTML = rows
      .slice(0, 18)
      .map((row) => {
        const safe = shared.escapeHtml;
        return `
          <li data-tone="${row.tone}" data-ledger-kind="${safe(row.kind)}">
            <span class="ledger-index">${safe(row.indexLabel)}</span>
            <div>
              <strong>${safe(row.label)}</strong>
              <span>${safe(row.detail)}</span>
            </div>
            <em>${safe(row.path)}</em>
          </li>
        `;
      })
      .join("");
    if (rows.length > 18) {
      els.importLedgerList.innerHTML += `
        <li data-tone="idle" data-ledger-kind="more">
          <span class="ledger-index">+</span>
          <div>
            <strong>${rows.length - 18} more import item(s)</strong>
            <span>The saved record includes the full block-by-block plan.</span>
          </div>
          <em>Hidden</em>
        </li>
      `;
    }
    translateDynamicDom(els.importLedgerList.closest("section"));
  }

  function buildImportLedger(parsed = latestParsed, counts = latestCounts) {
    const main = latestDiagnostics?.main || {};
    const status = latestPageStatus || {};
    const vault = status.vault || latestDiagnostics?.vault || {};
    const bridgeReady = Boolean(main.hasDraftStateNode);
    const uploadReady = Boolean(main.hasOnFilesAdded);
    const mediaEstimate = mediaUploadEstimate(parsed);
    const localVaultReady = Boolean(vault.configured && vault.permission === "granted");
    const remoteProbeBySource = new Map((remoteImageProbeStatus.results || []).map((item) => [item.source, item]));
    const metadataOptions = importOptionsPayload();
    const previewPlan = buildPreviewPlan(parsed);

    if (!parsed?.segments?.length) {
      return [
        {
          index: 0,
          indexLabel: "-",
          kind: "empty",
          label: "No draft loaded",
          detail: "Each part of the draft will show whether it becomes text, an image, the title, the cover, or an embed.",
          path: "Idle",
          tone: "idle"
        }
      ];
    }

    let operationIndex = 0;
    const rows = [];

    if (mediaEstimate.overSoftLimit) {
      rows.push({
        index: 0,
        indexLabel: "!",
        kind: "media-limit",
        label: "X Article media note",
        detail: mediaLimitWarningText(mediaEstimate),
        path: "Review before writing",
        tone: "warn"
      });
    }

    if (metadataOptions.setTitle && parsed.title) {
      rows.push({
        index: 0,
        indexLabel: "T",
        kind: "title",
        label: "Article title",
        detail: parsed.titleFromMeta
          ? `Frontmatter title will be applied: ${parsed.title}`
          : `First H1 was promoted to article title: ${parsed.title}`,
        path: "Title and cover",
        tone: bridgeReady ? "ok" : "warn"
      });
    }

    if (metadataOptions.setCover && parsed.cover) {
      rows.push({
        index: 0,
        indexLabel: "C",
        kind: "cover",
        label: "Article cover",
        detail: `Cover candidate: ${parsed.cover}`,
        path: "Title and cover",
        tone: uploadReady ? "ok" : "warn"
      });
    }

    parsed.segments.forEach((segment, segmentIndex) => {
      const op = previewPlan.operations[operationIndex];
      if (segment.type === "divider" || segment.type === "code" || segment.type === "tweet" || segment.type === "image" || segment.type === "table") {
        operationIndex += 1;
      }
      rows.push(ledgerRowForSegment(segment, segmentIndex + 1, op, {
        bridgeReady,
        uploadReady,
        localVaultReady,
        remoteProbeBySource,
        counts
      }));
    });

    return rows;
  }

  function ledgerRowForSegment(segment, index, operation, state) {
    const textKinds = {
      "header-one": "Heading 1",
      "header-two": "Heading 2",
      "header-three": "Heading 3",
      "header-four": "Heading 4",
      "header-five": "Heading 5",
      "header-six": "Heading 6",
      blockquote: "Quote",
      "unordered-list-item": "Bullet item",
      "ordered-list-item": "Numbered item",
      unstyled: "Paragraph"
    };
    if (segment.type === "text") {
      return {
        index,
        indexLabel: String(index),
        kind: segment.kind || "text",
        label: textKinds[segment.kind] || "Text",
        detail: truncateLedgerText(segment.text || "Empty text block"),
        path: "Write text",
        tone: "ok"
      };
    }
    if (segment.type === "image") {
      const local = shared.isLocalImageSource(segment.source);
      const remote = isRemoteHttpImageSource(segment.source);
      const absolute = shared.isAbsoluteLocalImageSource(segment.source);
      let origin = "";
      if (remote) {
        try {
          origin = new URL(segment.source).origin;
        } catch {}
      }
      const remoteProbe = remote ? state.remoteProbeBySource?.get(segment.source) : null;
      const remoteChecked = !remote || remoteProbe?.ok !== false;
      const tone = absolute
        ? "error"
        : local && !state.localVaultReady
          ? "warn"
          : remote && remoteProbe?.ok === false
            ? "error"
            : remote && !remoteChecked
              ? "warn"
              : state.uploadReady
                ? "ok"
                : "warn";
      const detail = absolute
          ? "Absolute local paths are blocked; use a path relative to the selected folder."
        : local && !state.localVaultReady
          ? `Choose a readable local image folder before uploading ${segment.source}.`
        : remote && remoteProbe?.ok === false
          ? `Download failed: ${remoteProbe.error}.`
        : remote && !remoteChecked
          ? "xPoster tries this web image during Write; unreachable images stay as links."
          : `Uploads ${operation?.op?.file?.fileName || shared.guessFileName(segment.source, "image")}.`;
      return {
        index,
        indexLabel: String(index),
        kind: "image",
        label: segment.alt ? `Image: ${segment.alt}` : "Image",
        detail,
        path: "Upload media",
        tone
      };
    }
    if (segment.type === "table") {
      return {
        index,
        indexLabel: String(index),
        kind: "table",
        label: "Markdown table",
        detail: `${segment.headers.length} column(s), ${segment.rows.length} row(s); rendered to ${operation?.op?.file?.fileName || "table image"}.`,
        path: "Upload media",
        tone: state.uploadReady ? "ok" : "warn"
      };
    }
    if (segment.type === "tweet") {
      return {
        index,
        indexLabel: String(index),
        kind: "tweet",
        label: "Tweet embed",
        detail: `Tweet ${segment.tweetId} becomes an embedded tweet.`,
        path: "Embed",
        tone: state.bridgeReady ? "ok" : "warn"
      };
    }
    if (segment.type === "code") {
      return {
        index,
        indexLabel: String(index),
        kind: "code",
        label: "Code block",
        detail: "Code block is placed in the article.",
        path: "Code",
        tone: state.bridgeReady ? "ok" : "warn"
      };
    }
    if (segment.type === "divider") {
      return {
        index,
        indexLabel: String(index),
        kind: "divider",
        label: "Divider",
        detail: "Divider is placed in the article.",
        path: "Divider",
        tone: state.bridgeReady ? "ok" : "warn"
      };
    }
    return {
      index,
      indexLabel: String(index),
      kind: segment.type || "unknown",
      label: "Unknown block",
        detail: "This block will stay as plain text if xPoster cannot map it.",
      path: "Fallback",
      tone: "warn"
    };
  }

  function truncateLedgerText(text) {
    const cleaned = String(text || "").replace(/\s+/g, " ").trim();
    return cleaned.length > 110 ? `${cleaned.slice(0, 107)}...` : cleaned;
  }

  function buildConversionMap(parsed, counts) {
    const empty = !parsed?.segments?.length;
    const metadataOptions = importOptionsPayload();
    const imageSegments = parsed?.segments?.filter((segment) => segment.type === "image") || [];
    const localImages = imageSegments.filter((segment) => shared.isLocalImageSource(segment.source));
    const remoteImages = imageSegments.filter((segment) => isRemoteHttpImageSource(segment.source));
    const absoluteLocalImages = localImages.filter((segment) => shared.isAbsoluteLocalImageSource(segment.source));
    const coverInBody = Boolean(parsed?.cover && imageSegments.some((segment) => segment.source === parsed.cover));
    const status = latestPageStatus || {};
    const main = latestDiagnostics?.main || {};
    const vault = status.vault || latestDiagnostics?.vault || {};
    const needsUploads = (counts.image || 0) + (counts.table || 0) > 0;
    const uploadReady = !needsUploads || Boolean(main.hasOnFilesAdded);
    const bridgeReady = Boolean(main.hasDraftStateNode);
    const localReady = !localImages.length || (vault.configured && vault.permission === "granted");

    if (empty) {
      return [
        ["title", "Title", "idle", "Waiting for frontmatter or first H1.", 0],
        ["cover", "Cover", "idle", "Waiting for frontmatter cover or first image.", 0],
        ["text", "Text", "idle", "Headings, paragraphs, lists, quotes, links, and inline styles.", 0],
        ["image", "Images", "idle", "Prepared as files, then uploaded through X.", 0],
        ["table", "Tables", "idle", "Rendered as images before upload.", 0],
        ["tweet", "Tweets", "idle", "Inserted as embedded tweets in X.", 0],
        ["code", "Code", "idle", "Inserted as code blocks in X.", 0],
        ["divider", "Dividers", "idle", "Inserted as dividers in X.", 0],
        ["local", "Local images", "idle", "Relative image paths need a readable folder.", 0]
      ].map(([id, label, tone, detail, count]) => ({ id, label, tone, detail, count }));
    }

    return [
      {
        id: "title",
        label: "Title",
        tone: metadataOptions.setTitle ? (parsed.title ? "ok" : "warn") : "idle",
        detail: metadataOptions.setTitle
          ? parsed.title
            ? "Will set the X Article title when possible."
            : "Add frontmatter title or a first H1."
          : "Title setting is off; headings stay in the article body.",
        count: metadataOptions.setTitle && parsed.title ? 1 : 0
      },
      {
        id: "cover",
        label: "Cover",
        tone: metadataOptions.setCover
          ? parsed.cover
            ? (coverInBody || parsed.cover.startsWith("data:") ? "ok" : "warn")
            : "warn"
          : "idle",
        detail: metadataOptions.setCover
          ? parsed.cover
            ? coverInBody || parsed.cover.startsWith("data:")
              ? "Will use the matching uploaded image as the cover when possible."
              : "Cover source has no matching body image; cover assignment may be skipped."
            : "Add frontmatter cover or a first image."
          : "Cover setting is off; images stay in the article body.",
        count: metadataOptions.setCover && parsed.cover ? 1 : 0
      },
      {
        id: "text",
        label: "Text",
        tone: counts.text ? "ok" : "idle",
        detail: counts.text ? "Will write the article body first." : "No text blocks detected.",
        count: counts.text || 0
      },
      {
        id: "image",
        label: "Images",
        tone: counts.image ? (uploadReady ? "ok" : "warn") : "idle",
        detail: counts.image
          ? uploadReady
            ? "Prepared images can be uploaded through X."
            : "Open the X editor and run Check so images can upload."
          : "No image uploads detected.",
        count: counts.image || 0
      },
      {
        id: "table",
        label: "Tables",
        tone: counts.table ? (uploadReady ? "ok" : "warn") : "idle",
        detail: counts.table
          ? uploadReady
            ? "Tables render to PNG and upload through X."
            : "Open the X editor and run Check so table images can upload."
          : "No tables detected.",
        count: counts.table || 0
      },
      {
        id: "tweet",
        label: "Tweets",
        tone: counts.tweet ? (bridgeReady ? "ok" : "warn") : "idle",
        detail: counts.tweet
          ? bridgeReady
            ? "Tweet embeds can be inserted in X."
            : "Open the X editor and run Check for embedded tweets."
          : "No tweet URLs detected.",
        count: counts.tweet || 0
      },
      {
        id: "code",
        label: "Code",
        tone: counts.code ? (bridgeReady ? "ok" : "warn") : "idle",
        detail: counts.code
          ? bridgeReady
            ? "Fenced code can be inserted as a code block."
            : "Open the X editor and run Check for code blocks."
          : "No fenced code blocks detected.",
        count: counts.code || 0
      },
      {
        id: "divider",
        label: "Dividers",
        tone: counts.divider ? (bridgeReady ? "ok" : "warn") : "idle",
        detail: counts.divider
          ? bridgeReady
            ? "Horizontal rules can be inserted as dividers."
            : "Open the X editor and run Check for dividers."
          : "No dividers detected.",
        count: counts.divider || 0
      },
      {
        id: "local",
        label: "Local images",
        tone: absoluteLocalImages.length ? "error" : localReady ? "ok" : "warn",
        detail: absoluteLocalImages.length
          ? "Absolute local paths are blocked; use paths relative to the selected folder."
          : localImages.length
            ? localReady
              ? "Relative local images can resolve through the selected folder."
              : "Choose a readable folder from the active X page."
            : "No local image paths require folder access.",
        count: localImages.length
      },
      {
        id: "remote",
        label: "Web images",
        tone: remoteImages.length ? "ok" : "idle",
        detail: remoteImages.length
          ? "xPoster will try these image URLs while writing; unreachable images stay as links."
          : "No web image links in this draft.",
        count: remoteImages.length
      }
    ];
  }

  function renderDraftReview(parsed, counts = null) {
    if (!parsed) {
      els.reviewMeta.textContent = "Write Markdown to get publishing notes.";
      els.reviewList.innerHTML = `<li>No draft loaded.</li>`;
      translateDynamicDom(els.reviewList.closest("section"));
      return;
    }
    const notes = buildDraftReview(parsed, counts || shared.segmentCounts(parsed.segments));
    const blockers = notes.filter((note) => note.tone === "error").length;
    const warnings = notes.filter((note) => note.tone === "warn").length;
    els.reviewMeta.textContent = blockers
      ? `${blockers} blocker(s), ${warnings} warning(s)`
      : warnings
        ? `${warnings} warning(s), no blockers`
        : "No blockers found";
    els.reviewList.innerHTML = notes
      .map((note) => `<li data-tone="${note.tone}" ${note.kind ? `data-note="${shared.escapeHtml(note.kind)}"` : ""}>${shared.escapeHtml(note.text)}</li>`)
      .join("");
    translateDynamicDom(els.reviewList.closest("section"));
  }

  function buildDraftReview(parsed, counts) {
    const notes = [];
    const metadataOptions = importOptionsPayload();
    const imageSegments = parsed.segments.filter((segment) => segment.type === "image");
    const localImages = imageSegments.filter((segment) => shared.isLocalImageSource(segment.source));
    const remoteImages = imageSegments.filter((segment) => isRemoteHttpImageSource(segment.source));
    const absoluteLocalImages = localImages.filter((segment) => shared.isAbsoluteLocalImageSource(segment.source));
    const uploadCount = (counts.image || 0) + (counts.table || 0);

    if (!metadataOptions.setTitle) notes.push({ tone: "idle", text: "Title setting is off; headings stay in the article body." });
    else if (parsed.title) notes.push({ tone: "ok", text: `Title detected: ${parsed.title}` });
    else notes.push({ tone: "warn", text: "No title detected. Add frontmatter title or a first-level heading." });

    if (!metadataOptions.setCover) {
      notes.push({ tone: "idle", text: "Cover setting is off; images stay in the article body." });
    } else if (parsed.cover) {
      const coverInBody = imageSegments.some((segment) => segment.source === parsed.cover);
      notes.push({
        tone: coverInBody || parsed.cover.startsWith("data:") ? "ok" : "warn",
        text: coverInBody
          ? "Cover source matches an image in the article body."
          : "Cover source is not also present as a body image; X cover assignment may be skipped."
      });
    } else {
      notes.push({ tone: "warn", text: "No cover candidate detected. Add frontmatter cover or a first image." });
    }

    if (absoluteLocalImages.length) {
      notes.push({
        tone: "error",
        text: `${absoluteLocalImages.length} absolute local image path(s) found. Use paths relative to the selected folder.`
      });
    } else if (localImages.length) {
      notes.push({
        tone: "warn",
        text: `${localImages.length} local image path(s) require a readable folder.`
      });
    } else {
      notes.push({ tone: "ok", text: "No local image paths require folder access." });
    }

    if (remoteImages.length) notes.push({ tone: "ok", text: `${remoteImages.length} web image(s) will be downloaded in the background; failed downloads stay as Markdown links.` });

    const mediaEstimate = mediaUploadEstimate(parsed);
    if (mediaEstimate.overSoftLimit) {
      notes.push({ tone: "warn", kind: "media-limit", text: mediaLimitWarningText(mediaEstimate) });
    }

    if (uploadCount) {
      notes.push({
        tone: "warn",
        text: `${uploadCount} media item(s) will be uploaded through X (${counts.image || 0} image, ${counts.table || 0} rendered table).`
      });
    } else {
      notes.push({ tone: "ok", text: "No media uploads required." });
    }

    if (counts.tweet || counts.code || counts.divider) {
      notes.push({
        tone: "ok",
        text: `${(counts.tweet || 0) + (counts.code || 0) + (counts.divider || 0)} special content block(s) will be placed in X.`
      });
    }

    return notes;
  }

  function renderPreview(parsed, counts = null) {
    if (!parsed) {
      els.previewTitle.textContent = "No title yet";
      els.previewMeta.textContent = "Paste Markdown to see what xPoster will move into X.";
      els.previewBody.innerHTML = `<p class="empty">This is a recognition preview. Image links stay as text in the draft box; xPoster downloads public images during Write and keeps failed downloads as links.</p>`;
      els.planReadiness.innerHTML = `<span>Text blocks 0</span><span>Special blocks 0</span><span>Images 0</span><span>Local images 0</span>`;
      els.planBreakdown.querySelector("p").textContent = "Load Markdown to see the plain-language import steps.";
      els.planSteps.innerHTML = `<li><span class="plan-step-kind">Start</span><span class="plan-step-text">Paste a draft or choose a Markdown file.</span></li>`;
      translateDynamicDom(els.previewPanel);
      return;
    }
    const safe = shared.escapeHtml;
    const derivedCounts = counts || shared.segmentCounts(parsed.segments);
    const specialCount = (derivedCounts.tweet || 0) + (derivedCounts.code || 0) + (derivedCounts.divider || 0);
    els.previewTitle.textContent = importOptions.setTitle === false ? "Article body" : parsed.title || "Untitled article";
    els.previewMeta.textContent = [
      `${derivedCounts.text || 0} text part(s)`,
      `${derivedCounts.image || 0} image(s)`,
      `${derivedCounts.table || 0} table(s)`,
      `${specialCount} special block(s)`
    ].join(" · ");
    if (derivedCounts.image) {
      els.previewMeta.textContent += " · image links convert during Import";
    }
    const rows = parsed.segments.slice(0, 18).map((segment) => {
      let kind = previewKindLabel(segment);
      let text = "";
      if (segment.type === "text") {
        text = segment.text;
      } else if (segment.type === "image") {
        text = segment.source;
      } else if (segment.type === "table") {
        text = `${segment.headers.length} columns, ${segment.rows.length} rows`;
      } else if (segment.type === "tweet") {
        text = `Tweet ${segment.tweetId}`;
      } else if (segment.type === "code") {
        text = `${segment.language || "code"} · ${(segment.code || "").split("\n").length} lines`;
      } else if (segment.type === "divider") {
        text = "Horizontal divider";
      }
      return `<div class="preview-item"><span class="preview-kind">${safe(kind)}</span><span class="preview-text">${safe(text)}</span></div>`;
    });
    if (parsed.segments.length > 18) {
      rows.push(`<p class="empty">${parsed.segments.length - 18} more block(s) hidden in preview.</p>`);
    }
    els.previewBody.innerHTML = rows.join("") || `<p class="empty">No publishable blocks detected yet.</p>`;
    renderPlanReadiness(parsed);
    translateDynamicDom(els.previewPanel);
  }

  function previewKindLabel(segment) {
    if (!segment) return "Content";
    if (segment.type === "text") {
      return (
        {
          "header-one": "Heading 1",
          "header-two": "Heading 2",
          "header-three": "Heading 3",
          "header-four": "Heading 4",
          "header-five": "Heading 5",
          "header-six": "Heading 6",
          blockquote: "Quote",
          "unordered-list-item": "Bullet",
          "ordered-list-item": "Numbered",
          unstyled: "Paragraph"
        }[segment.kind] || "Text"
      );
    }
    return (
      {
        image: "Image",
        table: "Table",
        tweet: "Tweet",
        code: "Code",
        divider: "Divider"
      }[segment.type] || "Content"
    );
  }

  function renderPlanReadiness(parsed) {
    const imageMap = new Map();
    const tableMap = new Map();
    parsed.segments.forEach((segment, index) => {
      if (segment.type === "image") {
        imageMap.set(segment, {
          ok: true,
          base64: "preview",
          mime: "image/png",
          fileName: `image-${index + 1}.png`
        });
      }
      if (segment.type === "table") {
        tableMap.set(segment, {
          ok: true,
          base64: "preview",
          mime: "image/png",
          fileName: `table-${index + 1}.png`
        });
      }
    });
    const coverSource = importOptions.setCover === false ? "" : String(parsed.cover || "");
    const coverSegment = coverSource && !parsed.segments.some(
      (segment) => segment.type === "image" && shared.imageSourcesMatch(segment.source, coverSource)
    )
      ? { type: "image", source: coverSource, alt: "cover" }
      : null;
    if (coverSegment) {
      imageMap.set(coverSegment, {
        ok: true,
        base64: "preview",
        mime: "image/png",
        fileName: "cover.png"
      });
    }
    const plan = shared.buildPastePlan(parsed.segments, imageMap, tableMap, {
      coverSource,
      coverResult: coverSegment ? imageMap.get(coverSegment) : null
    });
    const atomic = plan.plan.filter((item) => item.op.type === "atomic").length;
    const images = plan.plan.filter((item) => item.op.type === "image").length;
    const textBlocks = parsed.segments.filter((segment) => segment.type === "text").length;
    const local = parsed.segments.filter((segment) => segment.type === "image" && shared.isLocalImageSource(segment.source)).length;
    els.planReadiness.innerHTML = [
      `<span>Text blocks ${textBlocks}</span>`,
      `<span>Special blocks ${atomic}</span>`,
      `<span>Images ${images}</span>`,
      `<span>Local images ${local}</span>`
    ].join("");
    renderPlanBreakdown(plan, { atomic, images, local, textBlocks });
  }

  function renderPlanBreakdown(plan, summary) {
    els.planBreakdown.querySelector("p").textContent = `${summary.textBlocks} text part(s), ${summary.images} image/table upload(s), ${summary.atomic} special block(s).`;
    const safe = shared.escapeHtml;
    const steps = [
      {
        kind: "Write text",
        text: summary.textBlocks
          ? `Write ${summary.textBlocks} text part(s) into the X Article body.`
          : "No article text was found yet."
      },
      ...plan.plan.map((item) => {
        if (item.op.type === "image") {
          const label = item.marker.includes("_TABLE_") ? "Table image" : "Image";
          const fileName = item.op.file?.fileName || "prepared media";
          return { kind: "Upload image", text: `${label} will upload as ${fileName}.` };
        }
        const entity = item.op.entityType === "MARKDOWN" ? "code block" : item.op.entityType === "TWEET" ? "tweet link" : "divider";
        return { kind: "Place block", text: `${entity} will be placed where it appears in your draft.` };
      })
    ];
    els.planSteps.innerHTML = steps
      .slice(0, 8)
      .map((step) => `<li><span class="plan-step-kind">${safe(step.kind)}</span><span class="plan-step-text">${safe(step.text)}</span></li>`)
      .join("");
    if (steps.length > 8) {
      els.planSteps.innerHTML += `<li><span class="plan-step-kind">More</span><span class="plan-step-text">${steps.length - 8} more step(s) are hidden here but included during import.</span></li>`;
    }
    translateDynamicDom(els.previewPanel);
  }

  function updatePreflight() {
    const checks = buildPreflightChecks();
    const readyCount = checks.filter((check) => check.tone === "ok").length;
    els.preflightMeta.textContent = `${readyCount}/${checks.length} checks ready`;
    for (const check of checks) {
      const item = els.preflightList.querySelector(`[data-check="${check.id}"]`);
      if (!item) continue;
      item.dataset.tone = check.tone;
      item.querySelector("strong").textContent = check.label;
      item.querySelector("div > span").textContent = check.detail;
    }
    const gate = getImportGate(checks);
    const nextAction = buildNextAction(checks, gate);
    currentNextAction = nextAction;
    if (els.importDraft?.closest(".actions")) {
      els.importDraft.closest(".actions").dataset.empty = latestParsed?.segments?.length ? "false" : "true";
    }
    applyPrimaryActionToImportButton(nextAction);
    updateSecondaryActions(nextAction);
    updateWorkflowRail(checks);
    updateLiveRunbook(checks, gate);
    updateNextAction(checks, gate);
    updateProofDeck(checks, gate);
    updateCompletionAudit(checks, gate);
    updateQuickSteps(checks, gate);
    updateLiveGate(checks, gate);
    updateRecoveryPanel(checks, gate);
    updateTargetContextPanel();
    updateCommandDock(checks, gate);
    updateIssueQueue(checks, gate);
    updateExecutionTimeline(checks, gate);
    syncRecordPanel();
    translateDynamicDom();
  }

  function primaryImportAction(gate) {
    if (queueModeActive()) return { action: "batch", label: "Write all drafts", enabled: !batchWriting };
    if (latestParsed?.segments?.length) return { action: "import", label: "Write to X draft", enabled: !batchWriting };
    return { action: "blocked", label: "Write to X draft", enabled: false };
  }

  function focusMarkdownInput() {
    showWorkspacePanel("draft");
    setActiveJump("draft");
    scrollTargetIntoView(queueModeActive() ? els.draftQueue : els.markdown, "center");
    if (!queueModeActive()) window.setTimeout(() => els.markdown?.focus?.(), 0);
    log("Focus the Markdown editor below.");
  }

  async function runImportButtonAction() {
    await primeSuccessAudio();
    const checks = buildPreflightChecks();
    const gate = getImportGate(checks);
    const action = primaryImportAction(gate);
    if (action.action === "import") return importDraft();
    if (action.action === "batch") return importDraftQueue();
    focusMarkdownInput();
    setDraftDropStatus("Markdown draft", "Paste Markdown here, choose a file, or drop .md files.", "idle");
    return null;
  }

  function setImportButtonLabel(label) {
    const svg = els.importDraft.querySelector("svg")?.outerHTML || IMPORT_ICON_SVG;
    els.importDraft.innerHTML = `${svg}<span></span>`;
    const labelNode = els.importDraft.querySelector("span");
    if (labelNode) setLocalizedText(labelNode, label);
    translateDynamicDom(els.importDraft);
  }

  function applyPrimaryActionToImportButton(action) {
    if (!action) return;
    updateWriteButton();
  }

  function updateSecondaryActions(primaryAction = currentNextAction) {
    const primary = primaryAction?.action || "";
    const focusOnly = new Set(["loadFile"]);
    if (els.openArticles) {
      els.openArticles.hidden = true;
    }
    if (els.dockCheck) {
      els.dockCheck.hidden = true;
    }
  }

  function applyImportActionToButton(button, action) {
    if (!button || !action) return;
    button.disabled = !action.enabled;
    setLocalizedText(button, action.label);
  }

  function updateWriteButton({ busy = false } = {}) {
    const hasDraft = Boolean(latestParsed?.segments?.length);
    const hasQueue = queueModeActive();
    const button = els.importDraft;
    if (!button) return;
    const actions = button.closest(".actions");
    if (actions) actions.dataset.empty = hasDraft || hasQueue || busy || batchWriting ? "false" : "true";
    button.disabled = busy || batchWriting;
    button.setAttribute("aria-disabled", busy || batchWriting ? "true" : "false");
    setImportButtonLabel(
      batchWriting
        ? "Writing all..."
        : busy
          ? "Writing to X draft..."
          : hasQueue
            ? "Write all drafts"
            : hasDraft
              ? "Write to X draft"
              : "Add Markdown first"
    );
    if (els.importHint) {
      const hint = compactWriteHint({ hasDraft, hasQueue, busy: busy || batchWriting });
      els.importHint.dataset.tone = hint.tone;
      delete els.importHint.dataset.i18n;
      setLocalizedText(els.importHint, hint.text);
    }
    translateDynamicDom(actions || button);
  }

  function compactWriteHint({ hasDraft, hasQueue = false, busy = false } = {}) {
    if (busy) return { tone: "ready", text: hasQueue ? "Writing queued drafts one by one." : "Writing into the X draft. You can watch the final result in the X Article tab." };
    if (hasQueue) return { tone: "ready", text: "Queued drafts are written one by one. Each successful draft leaves the list." };
    if (!hasDraft) return { tone: "idle", text: "Add a Markdown draft first." };
    const remoteCount = remoteHttpImageSegments(latestParsed).length;
    if (remoteCount) return remoteImageWriteHint(remoteCount);
    const imageCount = latestCounts?.image || 0;
    const mediaEstimate = mediaUploadEstimate(latestParsed);
    if (mediaEstimate.overSoftLimit) {
      return {
        tone: "warn",
        text: mediaLimitWarningText(mediaEstimate)
      };
    }
    return {
      tone: "ready",
      text: imageCount
        ? `Images: ${imageCount}`
        : "Ready to write."
    };
  }

  function remoteImageWriteHint(remoteCount) {
    const mediaEstimate = mediaUploadEstimate(latestParsed);
    if (mediaEstimate.overSoftLimit) {
      return {
        tone: "warn",
        text: mediaLimitWarningText(mediaEstimate)
      };
    }
    if (remoteImageProbeStatus.state === "checking") {
      return { tone: "ready", text: `Web images: ${remoteCount}` };
    }
    if (remoteImageProbeStatus.state === "checked" && remoteImageProbeStatus.fail) {
      return {
        tone: "warn",
        text: `Web images: ${remoteImageProbeStatus.fail} may stay as links`
      };
    }
    if (remoteImageProbeStatus.state === "checked") {
      return { tone: "ready", text: `Web images: ${remoteCount} ready` };
    }
    return { tone: "ready", text: `Web images: ${remoteCount}` };
  }

  function updateNextAction(checks = null, gate = null) {
    const action = buildNextAction(checks || buildPreflightChecks(), gate);
    currentNextAction = action;
    const actionsVisible = els.importDraft?.closest(".actions")?.dataset.empty === "false";
    els.nextAction.dataset.tone = action.tone;
    els.nextActionTitle.textContent = action.title;
    els.nextActionDetail.textContent = action.detail;
    if (els.nextActionButton) {
      els.nextActionButton.textContent = action.button;
      els.nextActionButton.disabled = Boolean(action.disabled);
      els.nextActionButton.hidden = actionsVisible || !action.action || action.action === "blocked";
    }
  }

  function buildNextAction(checks, gate = null) {
    const byId = new Map(checks.map((check) => [check.id, check]));
    const resolvedGate = gate || getImportGate(checks);
    const hasQueue = queueModeActive();
    const counts = latestCounts || shared.segmentCounts([]);
    const needsBridge = (counts.code || 0) + (counts.divider || 0) + (counts.tweet || 0) > 0;
    const needsUploads = (counts.image || 0) + (counts.table || 0) > 0;
    const needsAssets = latestParsed
      ? latestParsed.segments.some((segment) => segment.type === "image" && shared.isLocalImageSource(segment.source))
      : false;
    const liveResult = buildLiveResultEvidence();

    if (byId.get("draft")?.tone !== "ok") {
      return {
        tone: "warn",
        title: "Add a Markdown draft",
        detail: "Paste Markdown in the editor, choose a .md file, or use Example to try the workflow first.",
        button: "Add Markdown",
        action: "addDraft"
      };
    }
    if (hasQueue && resolvedGate.ok && !latestEvidence?.kind?.startsWith("import")) {
      return {
        tone: "ready",
        title: "Write queued drafts",
        detail: "Ready. xPoster will write queued drafts one by one and remove each successful item.",
        button: "Write all drafts",
        action: "import"
      };
    }
    if (byId.get("target")?.tone !== "ok") {
      return {
        tone: "warn",
        title: "Open article",
        detail: "Open or create the X Article you want to fill. Keep that tab active while importing.",
        button: "Open article",
        action: "openArticles"
      };
    }
    if (byId.get("page-script")?.tone === "error") {
      const oldImporter = originalImporterResidueStatus();
      return {
        tone: "error",
        title: oldImporter.detected ? "Old Markdown importer detected" : "Refresh X Article tab",
        detail: oldImporter.detected
          ? "The original X Article Markdown Paste script is still active in this tab. Refresh or reopen the X Article tab before importing so image markers are handled only by xPoster."
          : "Refresh the X Article tab so the latest xPoster page script handles images.",
        button: "Refresh X",
        action: "refreshXTab"
      };
    }
    if ((needsBridge || needsUploads) && !latestPageStatus?.hasEditor) {
      return {
        tone: "warn",
        title: "Open an article editor",
        detail: "Create or open an X Article draft, then click Check article so xPoster can confirm text and image access.",
        button: "Open article",
        action: "openArticles"
      };
    }
    if ((needsBridge && byId.get("bridge")?.tone !== "ok") || (needsUploads && byId.get("uploads")?.tone !== "ok")) {
      return {
        tone: "warn",
        title: "Check the article",
        detail: "Check that this X Article can accept text and upload images before importing.",
        button: "Check article",
        action: "check"
      };
    }
    if (needsAssets && byId.get("assets")?.tone !== "ok") {
      return {
        tone: "warn",
        title: "Choose local image folder",
        detail: "Relative image paths need a readable folder selected from the active X tab.",
        button: "Choose",
        action: "chooseVault"
      };
    }
    if (!latestEvidence?.kind?.startsWith("import")) {
      return {
        tone: "ready",
        title: "Write to X draft",
        detail: "Ready. xPoster will fill the open X Article, then you review it before publishing.",
        button: "Write to X draft",
        action: "import"
      };
    }
    if (!liveResult.complete) {
      return {
        tone: latestEvidence ? "warn" : "ready",
        title: "Review imported article",
        detail: `${liveResult.checked}/${liveResult.total} final article checks are recorded. Finish the article review before saving final records.`,
        button: "Review",
        action: "liveResult"
      };
    }
    return {
      tone: "ready",
      title: "Save final records",
      detail: "The article review is complete. Copy or save the final records.",
      button: "Records",
      action: "package"
    };
  }

  function updateCommandDock(checks = null, gate = null) {
    if (!els.commandDock) return;
    const resolvedChecks = checks || buildPreflightChecks();
    const resolvedGate = gate || getImportGate(resolvedChecks);
    const readyCount = resolvedChecks.filter((check) => check.tone === "ok").length;
    const readiness = resolvedChecks.length ? Math.round((readyCount / resolvedChecks.length) * 100) : 0;
    const liveResult = buildLiveResultEvidence();
    const title = resolvedGate.ok
      ? "Ready"
      : friendlyCheckLabel(resolvedChecks.find((check) => check.tone !== "ok")?.label || "Check");
    const detail = resolvedGate.ok
      ? liveResult.complete
        ? "Import checks are clear; records can be exported."
        : "Import checks are clear; review the article after import."
      : resolvedGate.message;
    els.commandDock.dataset.tone = resolvedGate.tone;
    els.dockGate.textContent = title;
    els.dockDetail.textContent = detail;
    els.dockMeterBar.style.width = `${readiness}%`;
    els.dockCheck.textContent = "Check article";
    applyImportActionToButton(els.dockImport, primaryImportAction(resolvedGate));
    els.dockEvidence.dataset.ready = liveResult.complete ? "true" : "false";
    translateDynamicDom(els.commandDock);
  }

  function updateQuickSteps(checks = null, gate = null) {
    if (!els.quickSteps) return;
    const resolvedChecks = checks || buildPreflightChecks();
    const resolvedGate = gate || getImportGate(resolvedChecks);
    const byId = new Map(resolvedChecks.map((check) => [check.id, check]));
    const hasDraft = byId.get("draft")?.tone === "ok";
    const hasQueue = queueModeActive();
    const hasImportEvidence = Boolean(latestEvidence?.kind?.startsWith("import"));
    const liveResult = buildLiveResultEvidence();
    const stepState = [
      {
        id: "draft",
        tone: hasDraft || hasQueue ? "ok" : "warn",
        title: hasQueue ? "Review queue" : "Input Markdown",
        detail: hasQueue
          ? `${draftQueue.length} draft(s) queued.`
          : hasDraft
            ? "Markdown ready."
            : "Add or drop your draft."
      },
      {
        id: "import",
        tone: liveResult.complete ? "ok" : hasImportEvidence ? "ok" : hasDraft || hasQueue ? "ready" : "idle",
        title: hasQueue ? "Write queue" : "Write to X draft",
        detail: liveResult.complete
          ? "Article is written."
          : hasImportEvidence
            ? "Written. Review and publish in X."
            : hasQueue
              ? "Write all drafts or edit one."
              : hasDraft
                ? "Use the current X Article or create one."
                : "Add Markdown first."
      }
    ];

    for (const step of stepState) {
      const item = els.quickSteps.querySelector(`[data-step="${step.id}"]`);
      if (!item) continue;
      item.dataset.tone = step.tone;
      item.querySelector("strong").textContent = step.title;
      item.querySelector("div > span").textContent = step.detail;
    }
    translateDynamicDom(els.quickSteps.closest("section"));
  }

  function updateIssueQueue(checks = null, gate = null) {
    if (!els.issueQueueList) return;
    const resolvedChecks = checks || buildPreflightChecks();
    const resolvedGate = gate || getImportGate(resolvedChecks);
    const issues = buildIssueQueue(resolvedChecks, resolvedGate);
    const blockers = issues.filter((issue) => issue.tone === "error").length;
    const warnings = issues.filter((issue) => issue.tone === "warn").length;
    els.issueQueueMeta.textContent = blockers
      ? `${blockers} thing(s) to fix, ${warnings} warning(s)`
      : warnings
        ? `${warnings} warning(s), no blockers`
        : "No active issues; continue with a real X import.";
    els.issueQueueList.innerHTML = issues
      .map((issue) => {
        const action = issue.action
          ? `<button class="secondary compact" type="button" data-issue-action="${shared.escapeHtml(issue.action)}">${shared.escapeHtml(issue.button)}</button>`
          : `<span class="issue-state">${shared.escapeHtml(issue.state || "Ready")}</span>`;
        return `
          <li data-tone="${shared.escapeHtml(issue.tone)}">
            <span class="issue-source">${shared.escapeHtml(issue.source)}</span>
            <div>
              <strong>${shared.escapeHtml(issue.title)}</strong>
              <span>${shared.escapeHtml(issue.detail)}</span>
            </div>
            ${action}
          </li>
        `;
      })
      .join("");
    translateDynamicDom(els.issueQueueList.closest("section"));
  }

  function buildIssueQueue(checks, gate) {
    const byId = new Map(checks.map((check) => [check.id, check]));
    const draftOk = byId.get("draft")?.tone === "ok";
    const targetOk = byId.get("target")?.tone === "ok";
    const editorOk = byId.get("editor")?.tone === "ok";
    const issues = checks
      .filter((check) => {
        if (check.tone !== "error" && check.tone !== "warn") return false;
        if (check.id === "draft" || check.id === "target") return true;
        if (check.id === "page-script") return targetOk;
        if (check.id === "target-lock") return draftOk && targetOk;
        if (check.id === "plan") return draftOk;
        if (check.id === "assets") return draftOk && targetOk;
        if (check.id === "editor") return targetOk;
        if (check.id === "editor-content") return draftOk && targetOk && editorOk;
        if (check.id === "bridge" || check.id === "uploads") return targetOk && (editorOk || Boolean(latestDiagnostics));
        return true;
      })
      .map((check) => issueFromCheck(check));
    const liveResult = buildLiveResultEvidence();
    const hasImportEvidence = Boolean(latestEvidence?.kind?.startsWith("import"));

    if (gate.ok && !hasImportEvidence) {
      issues.push({
        tone: "ready",
        source: "Import",
        title: "Ready to import",
        detail: "Run Import, then review the X Article before publishing.",
        action: "import",
        button: "Import"
      });
    }

    if (hasImportEvidence && !liveResult.complete) {
      issues.push({
        tone: "warn",
        source: "Review",
        title: "Review imported article",
        detail: `${liveResult.checked}/${liveResult.total} final article checks recorded.`,
        action: "liveResult",
        button: "Review"
      });
    }

    if (hasImportEvidence && liveResult.complete) {
      issues.push({
        tone: "ready",
        source: "Records",
        title: "Final records ready",
        detail: "Copy or save the final local record with checks, import plan, import result, and article review.",
        action: "package",
        button: "Records"
      });
    }

    if (!issues.length) {
      issues.push({
        tone: "ok",
        source: "Queue",
        title: "No active issues",
        detail: "The checks are clear. Import once, then review the article in X.",
        state: "Clear"
      });
    }

    return issues;
  }

  function friendlyCheckLabel(label) {
    return (
      {
        Target: "X Article",
        Bridge: "X editor",
        "Target lock": "Current article",
        "Editor content": "Existing content",
        Assets: "Local images",
        Plan: "Draft contents"
      }[label] || label
    );
  }

  function updateLiveGate(checks = null, gate = null) {
    if (!els.liveGate) return;
    const resolvedChecks = checks || buildPreflightChecks();
    const resolvedGate = gate || getImportGate(resolvedChecks);
    const audit = buildCompletionAuditEvidence(resolvedChecks, resolvedGate);
    const proof = buildProofDeckEvidence(resolvedChecks, resolvedGate);
    const liveResult = buildLiveResultEvidence();
    const hasImportEvidence = Boolean(latestEvidence?.kind?.startsWith("import"));
    const importedOk = latestEvidence?.kind === "import";
    const firstGateBlocker = resolvedChecks.find(
      (check) => check.tone !== "ok" && (check.id !== "remote-images" || check.tone !== "ok")
    );
    const hasHardBlocker = audit.items.some((item) => item.tone === "error");
    const mainTone = audit.complete
      ? "ready"
      : resolvedGate.tone === "error" || hasHardBlocker
        ? "error"
        : hasImportEvidence || liveResult.checked
          ? "warn"
          : resolvedGate.ok
            ? "ready"
            : "warn";
    const firstOpen = audit.items.find((item) => item.tone !== "ok" && item.tone !== "ready");
    const percent = audit.total ? Math.round((audit.proven / audit.total) * 100) : 0;

    els.liveGate.dataset.tone = mainTone;
    els.liveGatePrimary.textContent = audit.complete
      ? "Final record ready"
      : !resolvedGate.ok && firstGateBlocker
        ? `${friendlyCheckLabel(firstGateBlocker.label)} needs attention`
      : resolvedGate.ok && !hasImportEvidence
        ? "Ready to import"
        : hasImportEvidence && !liveResult.complete
          ? "Review imported article"
          : firstOpen?.label || "More checks needed";
    els.liveGateDetail.textContent = audit.complete
      ? "Copy or save the final local record before treating this import as complete."
      : !resolvedGate.ok
        ? resolvedGate.message
        : firstOpen?.detail || resolvedGate.message;
    els.liveGateScore.textContent = `${audit.proven}/${audit.total}`;
    els.liveGateMeterBar.style.width = `${percent}%`;

    const chips = [
      {
        label: "Draft",
        tone: audit.items.find((item) => item.id === "draft")?.tone || "idle"
      },
      {
        label: "X Article",
        tone: audit.items.find((item) => item.id === "target")?.tone || "idle"
      },
      {
        label: importedOk ? "Imported" : resolvedGate.ok ? "Import ready" : "Import",
        tone: audit.items.find((item) => item.id === "import")?.tone || "idle"
      },
      {
        label: proof.complete ? "Records ready" : liveResult.complete ? "Review done" : "Review",
        tone: audit.items.find((item) => item.id === "package")?.tone || "idle"
      }
    ];
    els.liveGateChips.innerHTML = chips
      .map((chip) => `<span data-tone="${shared.escapeHtml(chip.tone)}">${shared.escapeHtml(chip.label)}</span>`)
      .join("");
    translateDynamicDom(els.liveGate);
  }

  function issueFromCheck(check) {
    const actions = {
      draft: { action: "addDraft", button: "Add Markdown" },
      target: { action: "openArticles", button: "Open" },
      "page-script": { action: "refreshXTab", button: "Refresh X" },
      "target-lock": { action: "check", button: "Check article" },
      editor: { action: "openArticles", button: "Open" },
      "editor-content": { action: "check", button: "Check article" },
      bridge: { action: "check", button: "Check article" },
      uploads: { action: "check", button: "Check article" },
      assets: { action: "chooseVault", button: "Choose" },
      plan: { action: "preview", button: "Preview" }
    };
    const command = actions[check.id] || {};
    return {
      tone: check.tone,
      source: check.label,
      title: check.tone === "error" ? `${check.label} blocker` : `${check.label} needs attention`,
      detail: check.detail,
      action: command.action,
      button: command.button
    };
  }

  function updateExecutionTimeline(checks = null, gate = null) {
    if (!els.timelineList) return;
    const timeline = buildExecutionTimeline(checks || buildPreflightChecks(), gate);
    const done = timeline.filter((step) => step.tone === "ok").length;
    const blocked = timeline.filter((step) => step.tone === "error").length;
    const ready = timeline.filter((step) => step.tone === "ready").length;
    els.timelineMeta.textContent = blocked
      ? `${blocked} blocked stage(s), ${done} complete`
      : ready
        ? `${ready} stage(s) ready, ${done} complete`
        : done
          ? `${done}/${timeline.length} stage(s) complete`
        : "Load Markdown to see the steps xPoster will run.";
    for (const step of timeline) {
      const item = els.timelineList.querySelector(`[data-timeline-step="${step.id}"]`);
      if (!item) continue;
      item.dataset.tone = step.tone;
      item.querySelector("strong").textContent = step.label;
      item.querySelector("div > span").textContent = step.detail;
      item.querySelector("em").textContent = step.status;
    }
    translateDynamicDom(els.timelineList.closest("section"));
  }

  function buildExecutionTimeline(checks, gate = null) {
    const byId = new Map(checks.map((check) => [check.id, check]));
    const counts = latestCounts || shared.segmentCounts([]);
    const plan = buildPreviewPlan();
    const resolvedGate = gate || getImportGate(checks);
    const hasImportEvidence = Boolean(latestEvidence?.kind?.startsWith("import"));
    const importSucceeded = latestEvidence?.kind === "import";
    const importFailed = latestEvidence?.kind === "import-error";
    const needsMedia = (counts.image || 0) + (counts.table || 0) > 0;
    const needsBridge = (counts.tweet || 0) + (counts.code || 0) + (counts.divider || 0) > 0 || plan.summary.markers > 0;
    const metadataOptions = importOptionsPayload();
    const metadataParts = [];
    if (metadataOptions.setTitle && latestParsed?.title) metadataParts.push("title");
    if (metadataOptions.setCover && latestParsed?.cover) metadataParts.push("cover");
    const hasMetadata = metadataParts.length > 0;
    const metadataLabel =
      metadataParts.length === 2 ? "Title and cover" : metadataParts[0] === "title" ? "Title" : "Cover";
    const metadataDetail = `${metadataLabel} will be applied when X allows it.`;
    const mediaTone = byId.get("uploads")?.tone || "warn";
    const mediaStatus = toneLabel(byId.get("uploads")?.tone);
    const pasteBlocked = Boolean(
      latestParsed?.segments?.length &&
        (byId.get("target")?.tone === "error" || byId.get("plan")?.tone === "error")
    );

    return [
      {
        id: "parse",
        label: "Parse Markdown",
        tone: latestParsed?.segments?.length ? "ok" : "error",
        detail: latestParsed?.segments?.length
          ? `${latestParsed.segments.length} part(s), ${latestParsed.title ? "title detected" : "no title"}, ${plan.summary.markers} item(s) will be placed after the main text.`
          : "Paste or load Markdown before any import work can start.",
        status: latestParsed?.segments?.length ? "Done" : "Blocked"
      },
      {
        id: "media",
        label: "Prepare media",
        tone: needsMedia ? mediaTone : latestParsed ? "ok" : "idle",
        detail: needsMedia
          ? `${counts.image || 0} image(s) and ${counts.table || 0} table(s) will be uploaded into X when reachable.`
          : latestParsed
            ? "No image or table upload is needed for this draft."
            : "Images and tables will be prepared after parsing.",
        status: needsMedia ? mediaStatus : latestParsed ? "Skipped" : "Idle"
      },
      {
        id: "paste",
        label: "Write article body",
        tone: importSucceeded ? "ok" : pasteBlocked ? "error" : resolvedGate.ok ? "ready" : byId.get("plan")?.tone === "ok" ? "warn" : "idle",
        detail: plan.htmlLength
          ? `${plan.htmlLength} character(s) will be written into the article body first.`
          : "The article body is not ready yet.",
        status: importSucceeded ? "Done" : resolvedGate.ok ? "Ready" : plan.htmlLength ? "Waiting" : "Idle"
      },
      {
        id: "replace",
        label: "Place embeds and code",
        tone: importSucceeded
          ? "ok"
          : needsBridge
            ? byId.get("bridge")?.tone || "warn"
            : latestParsed
              ? "ok"
              : "idle",
        detail: needsBridge
          ? `${plan.summary.atomic} embed/code/divider item(s) and ${plan.summary.images} image/table item(s) need the X editor.`
          : latestParsed
            ? "No embeds, code blocks, dividers, images, or tables need extra placement."
            : "X editor status is unknown.",
        status: importSucceeded ? "Done" : needsBridge ? toneLabel(byId.get("bridge")?.tone) : latestParsed ? "Skipped" : "Idle"
      },
      {
        id: "metadata",
        label: "Set title and cover",
        tone: importSucceeded ? "ok" : hasMetadata ? (resolvedGate.ok ? "ready" : "warn") : latestParsed ? "idle" : "idle",
        detail: hasMetadata
          ? metadataDetail
          : latestParsed
            ? "No title or cover is available to apply."
            : "Title and cover will be added when available.",
        status: importSucceeded ? "Done" : hasMetadata ? (resolvedGate.ok ? "Ready" : "Waiting") : latestParsed ? "Skipped" : "Idle"
      },
      {
        id: "evidence",
        label: "Save what happened",
        tone: importFailed ? "error" : hasImportEvidence ? "ok" : latestEvidence ? "warn" : "idle",
        detail: hasImportEvidence
          ? `${latestEvidence.kind} record saved at ${new Date(latestEvidence.capturedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`
          : latestEvidence
            ? "A check record is saved; import has not run yet."
            : "Nothing saved yet.",
        status: importFailed ? "Failed" : hasImportEvidence ? "Done" : latestEvidence ? "Partial" : "Idle"
      }
    ];
  }

  function toneLabel(tone) {
    if (tone === "ok") return "Ready";
    if (tone === "ready") return "Ready";
    if (tone === "done") return "Done";
    if (tone === "work") return "Running";
    if (tone === "error") return "Blocked";
    if (tone === "warn") return "Waiting";
    return "Idle";
  }

  function updateWorkflowRail(checks = null) {
    const byId = new Map((checks || buildPreflightChecks()).map((check) => [check.id, check]));
    const liveResult = buildLiveResultEvidence();
    const counts = latestCounts || shared.segmentCounts([]);
    const uploadCount = (counts.image || 0) + (counts.table || 0);
    const specialCount = (counts.code || 0) + (counts.divider || 0) + (counts.tweet || 0);
    const stages = [
      {
        id: "draft",
        tone: byId.get("draft")?.tone || "idle",
        detail: latestParsed?.segments?.length
          ? `${latestParsed.segments.length} block${latestParsed.segments.length === 1 ? "" : "s"} loaded${latestParsed.title ? "; title found" : ""}.`
          : "No Markdown loaded."
      },
      {
        id: "target",
        tone: byId.get("target")?.tone || "idle",
        detail: latestPageStatus?.hasEditor ? "Editor visible." : latestPageStatus?.isArticleRoute ? "Draft can be created." : "Open X Articles."
      },
      {
        id: "bridge",
        tone: byId.get("bridge")?.tone || "idle",
        detail: latestDiagnostics?.main?.hasDraftStateNode
          ? `${specialCount} embed/code item${specialCount === 1 ? "" : "s"} ready.`
          : "Run a check."
      },
      {
        id: "media",
        tone: byId.get("uploads")?.tone || "idle",
        detail: uploadCount
          ? latestDiagnostics?.main?.hasOnFilesAdded
            ? `${uploadCount} upload item${uploadCount === 1 ? "" : "s"} ready.`
            : `${uploadCount} upload item${uploadCount === 1 ? "" : "s"} need the X editor.`
          : "No uploads required."
      },
      {
        id: "evidence",
        tone: liveResult.complete ? "ok" : latestEvidence ? "warn" : "idle",
        detail: liveResult.complete
          ? "Final result captured."
          : latestEvidence
            ? `${liveResult.checked}/${liveResult.total} article review checks.`
            : "No review yet."
      }
    ];

    for (const stage of stages) {
      const item = els.workflowRail?.querySelector(`[data-stage="${stage.id}"]`);
      if (!item) continue;
      item.dataset.tone = stage.tone;
      item.querySelector("span").textContent = stage.detail;
    }
    translateDynamicDom(els.workflowRail);
  }

  function updateLiveRunbook(checks = null, gate = null) {
    if (!els.liveRunbookList) return;
    const resolvedChecks = checks || buildPreflightChecks();
    const byId = new Map(resolvedChecks.map((check) => [check.id, check]));
    const resolvedGate = gate || getImportGate(resolvedChecks);
    const liveResult = buildLiveResultEvidence();
    const hasDraft = byId.get("draft")?.tone === "ok";
    const hasQueue = queueModeActive();
    const targetReady = byId.get("target")?.tone === "ok";
    const bridgeReady = byId.get("bridge")?.tone === "ok";
    const uploadsReady = byId.get("uploads")?.tone === "ok";
    const hasImportEvidence = Boolean(latestEvidence?.kind?.startsWith("import"));
    const packaged = liveResult.complete && Boolean(latestEvidence);
    const runbook = [
      {
        id: "draft",
        tone: hasDraft || hasQueue ? "ok" : "warn",
        detail: hasQueue
          ? `${draftQueue.length} queued draft${draftQueue.length === 1 ? "" : "s"} ready.`
          : hasDraft
            ? `${latestParsed.segments.length} parts loaded; ${latestParsed.title ? "title detected" : "title missing"}.`
            : "Add a draft or load the example before checking X."
      },
      {
        id: "target",
        tone: targetReady ? "ok" : hasDraft || hasQueue ? "warn" : "error",
        detail: targetReady
          ? latestPageStatus?.hasEditor
            ? "Active X tab is already in an article editor."
            : "Active X tab is on Articles; create or open a draft next."
          : "Open x.com/compose/articles in the active tab."
      },
      {
        id: "diagnostics",
        tone: bridgeReady && uploadsReady ? "ok" : latestDiagnostics ? "error" : "warn",
        detail:
          bridgeReady && uploadsReady
            ? "xPoster can reach the editor and upload media."
            : latestDiagnostics
              ? "The check found a writing or image-upload problem."
              : "Click Check article after the X Article editor is visible."
      },
      {
        id: "import",
        tone: hasImportEvidence ? "ok" : resolvedGate.ok ? "ready" : "warn",
        detail: hasImportEvidence
          ? latestEvidence.kind === "import" ? "Last import completed; inspect the article." : "Last import produced a record with an error."
          : resolvedGate.ok
            ? hasQueue
              ? "Ready to write queued drafts one by one."
              : "Ready to import into the active X Article tab."
            : resolvedGate.message
      },
      {
        id: "result",
        tone: liveResult.complete ? "ok" : hasImportEvidence ? "warn" : "idle",
        detail: liveResult.complete
          ? "All article review checks are recorded."
          : `${liveResult.checked}/${liveResult.total} article review checks recorded.`
      },
      {
        id: "evidence",
        tone: packaged ? "ok" : liveResult.complete ? "ready" : "idle",
        detail: packaged
          ? "Final records can be copied or saved."
          : liveResult.complete
            ? "Copy or save the final records."
            : "Finish the article review first."
      }
    ];

    for (const step of runbook) {
      const item = els.liveRunbookList.querySelector(`[data-runbook-step="${step.id}"]`);
      if (!item) continue;
      item.dataset.tone = step.tone;
      item.querySelector("div > span").textContent = step.detail;
      const button = item.querySelector("button[data-runbook-action]");
      if (button) {
        button.disabled =
          (step.id === "diagnostics" && !targetReady) ||
          (step.id === "import" && !resolvedGate.ok) ||
          (step.id === "result" && !hasImportEvidence) ||
          (step.id === "evidence" && !liveResult.complete);
      }
    }
    const ready = runbook.filter((step) => step.tone === "ok" || step.tone === "ready").length;
    els.liveRunbookMeta.textContent = `${ready}/${runbook.length} after-import steps ready.`;
    translateDynamicDom(els.liveRunbookList.closest("section"));
  }

  function buildPreflightChecks() {
    const parsed = latestParsed;
    const counts = latestCounts || shared.segmentCounts([]);
    const status = latestPageStatus || {};
    const main = latestDiagnostics?.main || {};
    const vault = status.vault || latestDiagnostics?.vault || {};
    const specialBlocks = (counts.code || 0) + (counts.divider || 0) + (counts.tweet || 0);
    const images = counts.image || 0;
    const tables = counts.table || 0;
    const localImages = parsed
      ? parsed.segments.filter((segment) => segment.type === "image" && shared.isLocalImageSource(segment.source)).length
      : 0;
    const remoteImageList = parsed ? remoteHttpImageSegments(parsed) : [];
    const remoteImages = remoteImageList.length;
    const remoteOrigins = remoteImageOrigins(parsed);
    const hasQueue = queueModeActive();
    const hasDraft = hasQueue || Boolean(parsed?.segments?.length);
    const targetMissingTone = hasDraft ? "warn" : "error";
    const hasParsedDraft = Boolean(parsed?.segments?.length);
    const hasPlan = hasQueue || (hasParsedDraft && Boolean(shared.buildPastePlan(parsed.segments, previewImageMap(parsed), previewTableMap(parsed)).plan.length || parsed.segments.length));
    const targetContext = buildTargetContextEvidence();
    const lockStatus = targetLockStatus(targetContext);
    const contentStatus = editorContentStatus(targetContext);
    const contentVersion = latestDiagnostics?.contentScriptVersion || status.contentScriptVersion || CONTENT_VERSION_UNKNOWN;
    const contentVersionReady = !status.isArticleRoute || contentVersion === EXTENSION_VERSION;
    const originalImporter = originalImporterResidueStatus();

    return [
      {
        id: "draft",
        label: "Draft",
        tone: hasDraft ? "ok" : "error",
        detail: hasQueue
          ? `${draftQueue.length} queued draft${draftQueue.length === 1 ? "" : "s"}`
          : hasParsedDraft
          ? `${parsed.segments.length} publishable block(s), ${parsed.title ? "title detected" : "no title detected"}`
          : "Paste or load Markdown before importing."
      },
      {
        id: "target",
        label: "X Article",
        tone: status.isArticleRoute ? "ok" : targetMissingTone,
        detail: status.isArticleRoute ? "Active tab is on X Articles." : "Open x.com/compose/articles in the active tab."
      },
      {
        id: "page-script",
        label: "X page script",
        tone: status.isArticleRoute ? (contentVersionReady && !originalImporter.detected ? "ok" : "error") : targetMissingTone,
        detail: status.isArticleRoute
          ? originalImporter.detected
            ? "The original X Article Markdown Paste script is still active in this tab. Refresh or reopen the X Article tab before importing so image markers are handled only by xPoster."
            : contentVersionReady
              ? `X tab is running xPoster v${contentVersion}.`
              : `X tab is still running xPoster ${contentVersion}; refresh the X Article tab so images are imported by v${EXTENSION_VERSION}.`
          : "Open X Articles so xPoster can load the page script."
      },
      {
        id: "target-lock",
        label: "Current article",
        tone: status.isArticleRoute ? lockStatus.tone : targetMissingTone,
        detail: status.isArticleRoute ? lockStatus.detail : "Open X Articles before locking the target."
      },
      {
        id: "editor",
        label: "Editor",
        tone: status.hasEditor ? "ok" : status.isArticleRoute ? "warn" : targetMissingTone,
        detail: status.hasEditor
          ? "Draft editor is visible."
          : status.isArticleRoute
            ? "xPoster can try to create a draft before importing."
            : "No X Article editor detected."
      },
      {
        id: "editor-content",
        label: "Existing content",
        tone: contentStatus.tone,
        detail: contentStatus.detail
      },
      {
        id: "bridge",
        label: "Editor check",
        tone: main.hasDraftStateNode ? "ok" : latestDiagnostics ? "error" : "warn",
        detail: main.hasDraftStateNode
          ? "xPoster can write text, embeds, and code into the X editor."
          : latestDiagnostics
            ? "xPoster could not write into the X editor yet."
            : "Run a check with the X tab active."
      },
      {
        id: "uploads",
        label: "Uploads",
        tone: images || tables
          ? (main.hasOnFilesAdded ? "ok" : latestDiagnostics ? "error" : "warn")
          : "ok",
        detail:
          images || tables
            ? main.hasOnFilesAdded
              ? `${images + tables} media upload item(s) can upload through X.`
              : "Open the X editor and run Check so images and tables can upload."
            : "No image or table uploads required."
      },
      {
        id: "assets",
        label: "Local images",
        tone: localImages ? (vault.configured && vault.permission === "granted" ? "ok" : "warn") : "ok",
        detail: localImages
          ? vault.configured && vault.permission === "granted"
            ? `${localImages} local image(s) can resolve through ${vault.name || "selected folder"}.`
            : `${localImages} local image(s) need a readable folder.`
          : "No local image paths detected."
      },
      {
        id: "remote-images",
        label: "Web images",
        tone: "ok",
        detail: remoteImages
          ? `${remoteImages} web image(s) from ${remoteOrigins.length} site(s) will be tried during Write.`
          : "No web image links in this draft."
      },
      {
        id: "plan",
        label: "Import plan",
        tone: hasPlan ? "ok" : "error",
        detail: hasPlan
          ? `${specialBlocks} embed/code/divider item(s), ${images} image(s), ${tables} table image(s), ${counts.tweet || 0} tweet embed(s).`
          : "No import plan available yet."
      }
    ];
  }

  function previewImageMap(parsed) {
    const map = new Map();
    if (!parsed) return map;
    parsed.segments.forEach((segment, index) => {
      if (segment.type !== "image") return;
      map.set(segment, {
        ok: true,
        base64: "preview",
        mime: "image/png",
        fileName: `image-${index + 1}.png`
      });
    });
    return map;
  }

  function previewTableMap(parsed) {
    const map = new Map();
    if (!parsed) return map;
    parsed.segments.forEach((segment, index) => {
      if (segment.type !== "table") return;
      map.set(segment, {
        ok: true,
        base64: "preview",
        mime: "image/png",
        fileName: `table-${index + 1}.png`
      });
    });
    return map;
  }

  function buildPreviewPlan(parsed = latestParsed) {
    if (!parsed?.segments?.length) {
      return {
        htmlLength: 0,
        plainLength: 0,
        markerPrefix: null,
        operations: [],
        summary: {
          markers: 0,
          atomic: 0,
          images: 0,
          localImages: 0
        }
      };
    }

    const imageMap = previewImageMap(parsed);
    const coverSource = importOptions.setCover === false ? "" : String(parsed.cover || "");
    const coverSegment = coverSource && !parsed.segments.some(
      (segment) => segment.type === "image" && shared.imageSourcesMatch(segment.source, coverSource)
    )
      ? { type: "image", source: coverSource, alt: "cover" }
      : null;
    const coverResult = coverSegment
      ? {
          ok: true,
          base64: "preview",
          mime: "image/png",
          fileName: "cover.png"
        }
      : null;
    const plan = shared.buildPastePlan(parsed.segments, imageMap, previewTableMap(parsed), {
      coverSource,
      coverResult
    });
    const operations = plan.plan.map((item) => ({
      op: item.op,
      marker: item.marker,
      type: item.op.type,
      entityType: item.op.entityType || null,
      source: item.op.source || null,
      fileName: item.op.file?.fileName || null,
      fallbackText: item.op.fallbackText || null
    }));
    return {
      htmlLength: plan.html.length,
      plainLength: plan.plain.length,
      markerPrefix: plan.markerPrefix,
      operations,
      summary: {
        markers: operations.length,
        atomic: operations.filter((item) => item.type === "atomic").length,
        images: operations.filter((item) => item.type === "image").length,
        localImages: parsed.segments.filter((segment) => segment.type === "image" && shared.isLocalImageSource(segment.source)).length
      }
    };
  }

  function buildEvidencePackage(reason = "manual") {
    const checks = buildPreflightChecks();
    const gate = getImportGate(checks);
    const draft = latestParsed
      ? {
          title: latestParsed.title || null,
          cover: latestParsed.cover || null,
          titleFromMeta: Boolean(latestParsed.titleFromMeta),
          counts: latestCounts,
          blocks: latestParsed.segments.length,
          localImages: latestParsed.segments
            .filter((segment) => segment.type === "image" && shared.isLocalImageSource(segment.source))
            .map((segment) => ({
              source: segment.source,
              absolute: shared.isAbsoluteLocalImageSource(segment.source)
            })),
          remoteImages: {
            count: remoteHttpImageSegments(latestParsed).length,
            origins: remoteImageOrigins(latestParsed),
            access: remoteImageAccessStatus,
            probe: remoteImageProbeStatus
          },
          mediaUploadEstimate: mediaUploadEstimate(latestParsed)
        }
      : {
          title: null,
          cover: null,
          titleFromMeta: false,
          counts: shared.segmentCounts([]),
          blocks: 0,
          localImages: [],
          remoteImages: {
            count: 0,
            origins: [],
            access: remoteImageAccessStatus,
            probe: remoteImageProbeStatus
          },
          mediaUploadEstimate: mediaUploadEstimate(null)
        };

    return {
      schema: "xposter.evidence-package.v1",
      reason,
      capturedAt: new Date().toISOString(),
      draft,
      importPlan: buildPreviewPlan(),
      gate,
      checks,
      liveResult: buildLiveResultEvidence(),
      proofDeck: buildProofDeckEvidence(checks, gate),
      completionAudit: buildCompletionAuditEvidence(checks, gate),
      recovery: buildRecoveryState(checks, gate),
      targetContext: buildTargetContextEvidence(),
      importLedger: buildImportLedger(latestParsed, latestCounts),
      liveProgress: buildLiveProgressEvidence(),
      pageStatus: latestPageStatus,
      diagnostics: latestDiagnostics,
      lastEvidence: latestEvidence
    };
  }

  function canClickImport(gate) {
    return Boolean(primaryImportAction(gate).enabled);
  }

  function canImport(checks) {
    const gate = getImportGate(checks);
    return ["import", "batch"].includes(primaryImportAction(gate).action);
  }

  function getImportGate(checks) {
    const byId = new Map(checks.map((check) => [check.id, check]));
    const requiresBridge = (latestCounts.code || 0) + (latestCounts.divider || 0) + (latestCounts.tweet || 0) > 0;
    const requiresUploads = (latestCounts.image || 0) + (latestCounts.table || 0) > 0;
    const requiresAssets = latestParsed
      ? latestParsed.segments.some((segment) => segment.type === "image" && shared.isLocalImageSource(segment.source))
      : false;
    const blockers = [
      byId.get("draft")?.tone !== "ok" && "Add a Markdown draft first.",
      byId.get("target")?.tone !== "ok" && "Open or create an X Article draft.",
      byId.get("page-script")?.tone !== "ok" && (originalImporterResidueStatus().detected
        ? "Refresh the X Article tab so the old Markdown importer is removed before xPoster handles images."
        : "Refresh the X Article tab so the latest xPoster page script handles images."),
      byId.get("target-lock")?.tone !== "ok" && "Click Check article so xPoster confirms the open article.",
      byId.get("plan")?.tone !== "ok" && "The draft does not have anything xPoster can import yet.",
      requiresBridge && byId.get("bridge")?.tone !== "ok" && "Click Check after the X editor opens.",
      requiresUploads && byId.get("uploads")?.tone !== "ok" && "Click Check with the X editor open so images can upload.",
      requiresAssets && byId.get("assets")?.tone !== "ok" && "Choose the local image folder."
    ].filter(Boolean);
    if (!blockers.length) return { ok: true, tone: "ready", message: "Ready to import into the active X Article." };
    const tone =
      byId.get("draft")?.tone !== "ok" ||
      byId.get("page-script")?.tone === "error" ||
      byId.get("target-lock")?.tone === "error" ||
      byId.get("plan")?.tone !== "ok"
        ? "error"
        : "warn";
    return {
      ok: false,
      tone,
      message: blockers.slice(0, 2).join(" "),
      blockers,
      canHandleRemoteImages: false
    };
  }

  function log(message) {
    const item = document.createElement("li");
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const timeNode = document.createElement("time");
    timeNode.textContent = time;
    const messageNode = document.createElement("span");
    messageNode.textContent = message;
    item.append(timeNode, " ", messageNode);
    if (els.activityPanel) els.activityPanel.hidden = false;
    els.activityLog.prepend(item);
    while (els.activityLog.children.length > 8) els.activityLog.lastElementChild.remove();
    syncRecordPanel();
    translateDynamicDom(els.activityLog);
  }

  function setDraftDropStatus(title, detail, tone = "idle") {
    if (!els.draftDropStatus) return;
    els.draftDropStatus.dataset.tone = tone;
    els.draftDropStatus.hidden = false;
    els.draftDropStatus.setAttribute("role", tone === "error" ? "alert" : "status");
    if (els.draftDropDismiss) els.draftDropDismiss.hidden = tone !== "error";
    const titleNode = els.draftDropStatus.querySelector("strong");
    const detailNode = els.draftDropStatus.querySelector("span");
    if (titleNode) {
      titleNode.dataset.i18n = title;
      titleNode.textContent = title;
    }
    if (detailNode) {
      detailNode.dataset.i18n = detail;
      detailNode.textContent = detail;
    }
    translateDynamicDom(els.draftDropStatus);
  }

  function setCompactImportStatus(summary = null) {
    if (els.importHint) {
      els.importHint.dataset.tone = "done";
      delete els.importHint.dataset.i18n;
      setLocalizedText(els.importHint, "Written. Review in X.");
    }
  }

  function dismissDraftDropStatus() {
    if (!els.draftDropStatus) return;
    els.draftDropStatus.hidden = true;
    els.draftDropStatus.dataset.tone = "idle";
    if (els.draftDropDismiss) els.draftDropDismiss.hidden = true;
  }

  function acknowledgeDraftInput() {
    if (!els.markdown) return;
    els.markdown.classList.remove("draft-ack");
    void els.markdown.offsetWidth;
    els.markdown.classList.add("draft-ack");
    window.setTimeout(() => els.markdown?.classList.remove("draft-ack"), 520);
  }

  function draftReadyDetail(length, counts = latestCounts) {
    const formattedLength = Number(length || 0).toLocaleString();
    const resolvedCounts = counts || shared.segmentCounts([]);
    return [
      `${formattedLength} chars`,
      pluralizeUnit(resolvedCounts.image || 0, "image"),
      pluralizeUnit(resolvedCounts.code || 0, "code block")
    ].join(" · ");
  }

  function createLiveProgressState() {
    const now = new Date().toISOString();
    return {
      state: "idle",
      level: "idle",
      text: "Nothing is running",
      detail: "Drop or paste a draft, then click Write to X draft.",
      percent: 0,
      startedAt: null,
      updatedAt: now,
      counts: null,
      summary: null,
      error: null,
      events: []
    };
  }

  function resetLiveProgress(reason = "manual") {
    latestProgress = createLiveProgressState();
    if (reason === "import") lastSuccessFeedbackKey = "";
    if (reason === "import") {
      window.clearTimeout(runSummaryCollapseTimer);
      runSummaryCollapseTimer = null;
      if (els.runSummary) els.runSummary.hidden = true;
      latestProgress.state = "running";
      latestProgress.level = "work";
      latestProgress.text = "Writing queued";
      latestProgress.detail = "Waiting for the active X tab to parse and prepare the draft.";
      latestProgress.percent = 6;
      latestProgress.startedAt = new Date().toISOString();
    }
    latestProgress.events = [
      {
        at: new Date().toISOString(),
        event: reason === "import" ? "import" : "reset",
        level: reason === "import" ? "work" : "idle",
        text: reason === "import" ? "Writing started from side panel." : "Live progress reset."
      }
    ];
    updateLiveProgress();
    updateRecoveryPanel();
    updateProgressiveSections();
  }

  function getTargetContext() {
    return latestDiagnostics?.targetContext || latestPageStatus?.targetContext || null;
  }

  function targetLockKey(context = buildTargetContextEvidence()) {
    if (!context?.available) return "none";
    if (context.articleId) return `article:${context.articleId}`;
    return `page:${context.route}:${context.url || ""}`;
  }

  function lockTargetContext(reason = "check") {
    const context = buildTargetContextEvidence();
    if (!context.available || context.route === "other") {
      targetLock = null;
      return null;
    }
    targetLock = {
      key: targetLockKey(context),
      reason,
      lockedAt: new Date().toISOString(),
      context
    };
    return targetLock;
  }

  function targetLockStatus(context = buildTargetContextEvidence()) {
    if (!context.available) return { tone: "error", locked: false, drifted: false, detail: "No X Article is open yet." };
    if (!targetLock) {
      return context.route === "editor" && context.hasEditor
        ? { tone: "warn", locked: false, drifted: false, detail: "Click Check article so xPoster confirms this is the article to fill." }
        : { tone: "ok", locked: false, drifted: false, detail: "No open draft is selected yet; xPoster can create one." };
    }
    const currentKey = targetLockKey(context);
    const drifted = currentKey !== targetLock.key;
    if (drifted) {
      return {
        tone: "error",
        locked: true,
        drifted: true,
        detail: "The open X Article changed after Check. Run Check article again before importing."
      };
    }
    return {
      tone: "ok",
      locked: true,
      drifted: false,
      detail: targetLock.context.articleId
        ? `Using article ${targetLock.context.articleId}.`
        : "Using the X Article checked most recently."
    };
  }

  function editorContentStatus(context = buildTargetContextEvidence()) {
    if (!context.available || !context.hasEditor) {
      return { tone: "ok", hasContent: false, detail: "No existing editor content detected." };
    }
    const length = Number(context.editorTextLength || 0);
    if (!length) return { tone: "ok", hasContent: false, detail: "Target editor is empty." };
    return {
      tone: "warn",
      hasContent: true,
      detail: `Target editor already has ${length} character(s). Confirm this draft before importing.`
    };
  }

  function buildTargetContextEvidence() {
    const context = getTargetContext();
    if (!context) {
      return {
        available: false,
        route: "none",
        articleId: null,
        hasEditor: false,
        pageTitle: null,
        editorTextLength: 0,
        editorSample: ""
      };
    }
    return {
      available: true,
      url: context.url || latestPageStatus?.url || latestDiagnostics?.url || null,
      route: context.route || (context.isEditorRoute ? "editor" : context.isArticleRoute ? "articles" : "other"),
      articleId: context.articleId || latestDiagnostics?.main?.articleId || null,
      hasEditor: Boolean(context.hasEditor || latestPageStatus?.hasEditor || latestDiagnostics?.hasEditorElement),
      pageTitle: context.pageTitle || null,
      editorTextLength: Number(context.editorTextLength || 0),
      editorSample: context.editorSample || "",
      contentRisk: editorContentStatus({
        available: true,
        hasEditor: Boolean(context.hasEditor || latestPageStatus?.hasEditor || latestDiagnostics?.hasEditorElement),
        editorTextLength: Number(context.editorTextLength || 0)
      }),
      lock: targetLock
        ? {
            key: targetLock.key,
            lockedAt: targetLock.lockedAt,
            reason: targetLock.reason,
            drifted: targetLock.key !== targetLockKey({
              ...context,
              available: true,
              route: context.route || (context.isEditorRoute ? "editor" : context.isArticleRoute ? "articles" : "other"),
              articleId: context.articleId || latestDiagnostics?.main?.articleId || null,
              url: context.url || latestPageStatus?.url || latestDiagnostics?.url || null
            })
          }
        : null
    };
  }

  function updateTargetContextPanel() {
    if (!els.targetContextPanel) return;
    const target = buildTargetContextEvidence();
    const status = latestPageStatus || {};
    const diagnosticsArticleId = latestDiagnostics?.main?.articleId || null;
    const articleId = target.articleId || diagnosticsArticleId;
    const lock = targetLockStatus(target);
    const tone = !target.available
      ? "idle"
      : lock.drifted
        ? "error"
      : target.route === "editor" && target.hasEditor
        ? "ok"
        : target.route === "articles"
          ? "warn"
          : "error";
    els.targetContextPanel.dataset.tone = tone;
    els.targetContextState.textContent = toneLabel(tone);
    els.targetContextMeta.textContent = !target.available
      ? "No X Article is open yet."
      : lock.drifted
        ? lock.detail
      : target.route === "editor"
        ? `${articleId ? `Article ${articleId} is open.` : "Article editor is open."} ${lock.locked ? "This article is confirmed." : "Click Check article before importing."}`
        : target.route === "articles"
          ? "X Articles is open; create or open a draft before importing."
          : "Active X tab is not on the Articles composer.";
    els.targetContextRoute.textContent = target.available
      ? `${target.route === "editor" ? "Article editor" : target.route === "articles" ? "Articles home" : "Other X page"}${target.hasEditor ? " / editor visible" : ""}`
      : "No X tab";
    els.targetContextArticle.textContent = articleId || (status.isArticleRoute ? "New draft" : "None");
    els.targetContextTitle.textContent = target.pageTitle || (target.available ? "Untitled X page" : "Unknown");
    els.targetContextSample.textContent = target.editorSample || (target.hasEditor ? "Editor is empty." : "Open or create an X Article draft before import.");
    translateDynamicDom(els.targetContextPanel);
  }

  function handleExtensionEvent(message) {
    if (message?.type !== "xposter:event") return;
    const payload = message.payload || {};
    const eventName = message.event || payload.type || "message";
    if (payload.text && shouldLogProgressEvent(eventName, payload)) log(progressTextForEvent("status", payload));
    if (eventName === "error" && payload.error) log(`Writing failed: ${payload.error}`);
    recordLiveProgressEvent(eventName, payload);
  }

  function shouldLogProgressEvent(eventName, payload = {}) {
    const level = payload.level || progressLevelForEvent(eventName);
    return eventName === "error" || level === "error" || level === "warn";
  }

  function recordLiveProgressEvent(eventName, payload = {}) {
    const now = new Date().toISOString();
    if (!latestProgress || (eventName === "parsed" && (latestProgress.state === "complete" || latestProgress.state === "error"))) {
      latestProgress = {
        ...createLiveProgressState(),
        startedAt: latestProgress?.startedAt || now
      };
    }
    if (!latestProgress.startedAt && eventName !== "status") latestProgress.startedAt = now;

    const entry = {
      at: now,
      event: eventName,
      level: payload.level || progressLevelForEvent(eventName),
      text: progressTextForEvent(eventName, payload)
    };
    latestProgress.events = [entry, ...(latestProgress.events || [])].slice(0, 10);
    latestProgress.updatedAt = now;

    if (eventName === "parsed") {
      const counts = payload.parsed?.counts || {};
      latestProgress.state = "parsed";
      latestProgress.level = "work";
      latestProgress.counts = counts;
      latestProgress.text = "Markdown parsed";
      latestProgress.detail = [
        `${Object.values(counts).reduce((sum, value) => sum + Number(value || 0), 0)} part(s) found`,
        payload.parsed?.title ? `title: ${payload.parsed.title}` : "no title",
        payload.parsed?.cover ? "cover candidate" : "no cover"
      ].join("; ");
      latestProgress.percent = Math.max(latestProgress.percent || 0, 28);
    } else if (eventName === "status") {
      const text = String(payload.text || "").trim();
      if (!text && payload.level === "idle") {
        if (latestProgress.state !== "complete" && latestProgress.state !== "error") {
          latestProgress.state = "idle";
          latestProgress.level = "idle";
          latestProgress.text = "Nothing is running";
          latestProgress.detail = "Drop or paste a draft, then click Write to X draft.";
          latestProgress.percent = 0;
        }
      } else {
        latestProgress.state = payload.level === "done" ? "complete" : "running";
        latestProgress.level = payload.level || "work";
        latestProgress.text = text || "Writing";
        latestProgress.detail = progressDetailForStatus(text);
        latestProgress.percent = Math.max(latestProgress.percent || 0, progressPercentForStatus(text, payload.level));
      }
    } else if (eventName === "complete") {
      latestProgress.state = "complete";
      latestProgress.level = "done";
      latestProgress.summary = payload.summary || null;
      latestProgress.text = "Writing complete";
      latestProgress.detail = summarizeProgressCompletion(payload.summary);
      latestProgress.percent = 100;
    } else if (eventName === "error") {
      latestProgress.state = "error";
      latestProgress.level = "error";
      latestProgress.error = payload.error || "Unknown writing error";
      latestProgress.text = "Writing failed";
      latestProgress.detail = latestProgress.error;
      latestProgress.percent = Math.max(latestProgress.percent || 0, 100);
    } else if (eventName === "cancelled") {
      latestProgress.state = "cancelled";
      latestProgress.level = "warn";
      latestProgress.error = payload.reason || "Writing stopped by user.";
      latestProgress.text = "Writing stopped by user.";
      latestProgress.detail = payload.reason || "Writing stopped by user.";
      latestProgress.percent = Math.max(latestProgress.percent || 0, 100);
    } else {
      latestProgress.state = "running";
      latestProgress.level = payload.level || "work";
      latestProgress.text = entry.text;
      latestProgress.detail = localizeText("Received an import progress update from the active X tab.");
      latestProgress.percent = Math.max(latestProgress.percent || 0, 12);
    }

    updateLiveProgress();
    updateRecoveryPanel();
  }

  function progressLevelForEvent(eventName) {
    if (eventName === "complete") return "done";
    if (eventName === "error") return "error";
    if (eventName === "cancelled") return "warn";
    if (eventName === "parsed") return "work";
    return "work";
  }

  function progressTextForEvent(eventName, payload) {
    if (eventName === "status") return localizeText(payload.text || "Status update");
    if (eventName === "parsed") return "Markdown parsed";
    if (eventName === "complete") return "Writing complete";
    if (eventName === "cancelled") return payload.reason || "Writing stopped by user.";
    if (eventName === "error") return payload.error || "Writing failed";
    return localizeText(payload.text || eventName);
  }

  function progressDetailForStatus(text) {
    if (/prepar|准备/i.test(text)) return localizeText("Preparing Markdown, images, and the X editor.");
    if (/writing|paste|structured|写入/i.test(text)) return localizeText("Writing the article body into X.");
    if (/upload|上传/i.test(text)) return localizeText("Uploading prepared images and rendered tables through X.");
    if (/reorder|marker|special|insert|放置|清理/i.test(text)) return localizeText("Placing images, tweets, code, and dividers into the article.");
    if (/title|cover|标题|封面/i.test(text)) return localizeText("Setting the title and cover after the body import.");
    if (/imported|written|complete|完成|已写入/i.test(text)) return localizeText("Writing finished.");
    return text ? localizeText(text) : localizeText("Live status received from the active X tab.");
  }

  function progressPercentForStatus(text, level) {
    if (level === "done") return 100;
    if (level === "error") return 100;
    if (/prepar/i.test(text)) return 14;
    if (/writing|paste/i.test(text)) return 46;
    if (/special|insert|marker/i.test(text)) return 58;
    if (/upload/i.test(text)) return 70;
    if (/reorder/i.test(text)) return 82;
    if (/title|cover/i.test(text)) return 90;
    if (/cleanup/i.test(text)) return 94;
    return 18;
  }

  function summarizeProgressCompletion(summary) {
    if (!summary) return localizeText("Writing finished.");
    const images = summary.images || {};
    const warnings = summary.mediaWarnings || {};
    const main = summary.main || {};
    const imageTotal = (images.ok || 0) + (images.fail || 0);
    const atomicTotal = (main.atomicOk || 0) + (main.atomicFail || 0);
    const elapsed = summary.elapsedMs ? `${(summary.elapsedMs / 1000).toFixed(1)}s` : "elapsed time unknown";
    if (warnings.total || main.imgFail) {
      const skipped = Number(warnings.images || 0) + Number(main.imgFail || 0);
      return `${skipped}/${imageTotal} image(s) kept as Markdown links; ${main.atomicOk || 0}/${atomicTotal} embed/code item(s), ${elapsed}.`;
    }
    return `${images.ok || 0}/${imageTotal} media item(s), ${main.atomicOk || 0}/${atomicTotal} embed/code item(s), ${elapsed}.`;
  }

  function updateLiveProgress() {
    if (!els.liveProgress) return;
    const state = latestProgress || createLiveProgressState();
    const tone = state.level === "done" ? "done" : state.level || state.state || "idle";
    els.liveProgress.dataset.tone = tone;
    els.liveProgressState.textContent = state.state === "running"
      ? "Running"
      : state.state === "cancelled"
        ? "Stopped"
        : toneLabel(tone);
    els.liveProgressBar.style.width = `${Math.max(0, Math.min(100, Number(state.percent || 0)))}%`;
    els.liveProgressTitle.textContent = state.text || "Nothing is running";
    els.liveProgressDetail.textContent = state.detail || "Write progress appears here while xPoster fills X.";
    if (els.cancelImport) {
      const cancellable = state.state === "running" || state.state === "parsed";
      els.cancelImport.hidden = !cancellable;
      els.cancelImport.disabled = importCancelRequested || !cancellable;
      setLocalizedText(els.cancelImport, importCancelRequested ? "Stopping..." : "Stop");
    }
    const events = state.events?.length ? state.events : [];
    if (!events.length) {
      translateDynamicDom(els.liveProgress);
      syncProgressiveSectionVisibility();
      return;
    }
    translateDynamicDom(els.liveProgress);
    syncProgressiveSectionVisibility();
  }

  function isLiveProgressVisible(progress = latestProgress) {
    return ["running", "parsed", "error"].includes(progress?.state);
  }

  function hasRunSummaryWarnings(summary) {
    if (!summary) return false;
    const main = summary.main || {};
    const warnings = summary.mediaWarnings || {};
    return Boolean(
      Number(warnings.total || 0) ||
      Number(main.imgFail || 0) ||
      Number(main.atomicFail || 0) ||
      (main.title?.requested && !summarizeTitleResult(main.title).includes("Set")) ||
      (main.cover?.requested && !summarizeCoverResult(main.cover).startsWith("Set"))
    );
  }

  function scheduleRunSummaryCollapse(summary) {
    window.clearTimeout(runSummaryCollapseTimer);
    runSummaryCollapseTimer = null;
    if (!els.runSummary || hasRunSummaryWarnings(summary)) return;
    runSummaryCollapseTimer = window.setTimeout(() => {
      runSummaryCollapseTimer = null;
      if (!hasRunSummaryWarnings(latestProgress?.summary)) {
        els.runSummary.hidden = true;
        syncRecordPanel();
      }
    }, 3600);
  }

  function syncProgressiveSectionVisibility() {
    const liveResult = buildLiveResultEvidence();
    const progressVisible = isLiveProgressVisible();
    const hasAnyRecord = Boolean(latestEvidence || liveResult.checked > 0 || progressVisible);
    if (els.liveProgress) els.liveProgress.hidden = !progressVisible;
    if (els.verificationPanel) els.verificationPanel.hidden = true;
    if (els.liveResultPanel) els.liveResultPanel.hidden = true;
    if (els.evidenceDetails) els.evidenceDetails.hidden = !hasAnyRecord;
    syncRecordPanel();
  }

  function syncRecordPanel() {
    if (!els.recordsPanel) return;
    const nodes = [els.recordHistory, els.runSummary, els.evidenceDetails, els.activityPanel].filter(Boolean);
    for (const node of nodes) {
      if (node.parentElement !== els.recordsPanel) els.recordsPanel.appendChild(node);
    }
    for (const node of [els.verificationPanel, els.liveResultPanel]) {
      if (node) node.hidden = true;
    }
    const hasRecord = recordHistory.length || nodes.some((node) => !node.hidden);
    if (els.recordsEmpty) els.recordsEmpty.hidden = hasRecord;
    translateDynamicDom(els.recordsPanel);
  }

  function syncPanelLayout() {
    syncRecordPanel();
  }

  function updateRecoveryPanel(checks = null, gate = null) {
    if (!els.recoveryPanel) return;
    const resolvedChecks = checks || buildPreflightChecks();
    const resolvedGate = gate || getImportGate(resolvedChecks);
    const recovery = buildRecoveryState(resolvedChecks, resolvedGate);
    els.recoveryPanel.dataset.tone = recovery.tone;
    els.recoveryMeta.textContent = recovery.meta;
    els.recoveryState.textContent = toneLabel(recovery.tone);
    els.recoveryList.innerHTML = recovery.items
      .map((item, index) => {
        const button = item.action
          ? `<button class="secondary compact" type="button" data-recovery-action="${shared.escapeHtml(item.action)}">${shared.escapeHtml(item.button)}</button>`
          : `<span class="issue-state">${shared.escapeHtml(item.state || toneLabel(item.tone))}</span>`;
        return `
          <li data-tone="${shared.escapeHtml(item.tone)}">
            <span class="recovery-index">${index + 1}</span>
            <div>
              <strong>${shared.escapeHtml(item.title)}</strong>
              <span>${shared.escapeHtml(item.detail)}</span>
            </div>
            ${button}
          </li>
        `;
      })
      .join("");
    translateDynamicDom(els.recoveryPanel);
  }

  function buildRecoveryState(checks, gate) {
    const byId = new Map(checks.map((check) => [check.id, check]));
    const items = [];
    const importFailed = latestEvidence?.kind === "import-error" || latestProgress?.state === "error";
    const hasImportEvidence = Boolean(latestEvidence?.kind?.startsWith("import"));
    const liveResult = buildLiveResultEvidence();
    const targetOk = byId.get("target")?.tone === "ok";
    const diagnosticsFailed = targetOk && ["bridge", "uploads", "editor"].some((id) => byId.get(id)?.tone === "error");
    const mediaFailed = latestEvidence?.result?.summary?.images?.fail || latestProgress?.summary?.images?.fail || 0;
    const atomicFailed = latestEvidence?.result?.summary?.main?.atomicFail || latestProgress?.summary?.main?.atomicFail || 0;
    const localAssetsPending = byId.get("assets")?.tone === "warn";
    if (importFailed) {
      items.push({
        tone: "error",
        title: "Check why import failed",
        detail: latestProgress?.error || latestEvidence?.result?.error || "Open saved records to inspect the import error details.",
        action: "evidence",
        button: "Records"
      });
      items.push({
        tone: "warn",
        title: "Run Check again",
        detail: "Confirm xPoster can still write to this article and upload images before retrying.",
        action: "check",
        button: "Check"
      });
    } else if (diagnosticsFailed) {
      items.push({
        tone: "error",
        title: "xPoster cannot write to X yet",
        detail: "X may have changed its editor or upload flow. Save a record before retrying.",
        action: "check",
        button: "Check"
      });
    } else if (!gate.ok) {
      items.push({
        tone: gate.tone,
        title: "Fix this before importing",
        detail: gate.message,
        action:
          byId.get("draft")?.tone !== "ok"
            ? "addDraft"
          : byId.get("target")?.tone !== "ok"
            ? "openArticles"
            : byId.get("page-script")?.tone !== "ok"
              ? "refreshXTab"
            : "check",
        button:
          byId.get("draft")?.tone !== "ok"
            ? "Add Markdown"
            : byId.get("target")?.tone !== "ok"
              ? "Open"
            : byId.get("page-script")?.tone !== "ok"
              ? "Refresh X"
            : "Check X"
      });
    } else if (!hasImportEvidence) {
      items.push({
        tone: "ready",
        title: "Run Import",
        detail: "Checks are ready. Import once, then inspect the X Article before saving records.",
        action: "import",
        button: "Import"
      });
    } else if (mediaFailed || atomicFailed) {
      items.push({
        tone: "warn",
        title: "Review partial import",
        detail: `${mediaFailed} media failure(s), ${atomicFailed} embed/code failure(s). Save the record and check the article before retrying.`,
        action: "evidence",
        button: "Records"
      });
    } else if (!liveResult.complete) {
      items.push({
        tone: "warn",
        title: "Finish article review",
        detail: `${liveResult.checked}/${liveResult.total} final article checks recorded.`,
        action: "liveResult",
        button: "Review"
      });
    } else {
      items.push({
        tone: "ready",
        title: "Save final record",
        detail: "Article review is complete. Copy or save the final records.",
        action: "package",
        button: "Records"
      });
    }

    if (localAssetsPending) {
      items.push({
        tone: "warn",
        title: "Local image folder pending",
        detail: byId.get("assets")?.detail || "Choose a readable local image folder before importing local paths.",
        action: "chooseVault",
        button: "Choose"
      });
    }

    if (latestEvidence && !hasImportEvidence) {
      items.push({
        tone: "ok",
        title: "Check record saved",
        detail: "Keep this record with any failed run so the draft, checks, and editor state can be compared.",
        action: "evidence",
        button: "Records"
      });
    }

    const tone = items.some((item) => item.tone === "error")
      ? "error"
      : items.some((item) => item.tone === "warn")
        ? "warn"
        : items.some((item) => item.tone === "ready")
          ? "ready"
          : "idle";
    const meta = importFailed
      ? "Failure recorded; save the record before retrying."
      : diagnosticsFailed
        ? "The editor check found a problem in the current X editor."
        : gate.ok
          ? hasImportEvidence
            ? "Import record exists; finish article review and save records."
            : "Checks are ready; run one live import."
          : "Current blocker and recovery action.";
    return { tone, meta, items: items.slice(0, 4) };
  }

  function buildLiveProgressEvidence() {
    const state = latestProgress || createLiveProgressState();
    return {
      state: state.state,
      level: state.level,
      text: state.text,
      detail: state.detail,
      percent: state.percent,
      startedAt: state.startedAt,
      updatedAt: state.updatedAt,
      counts: state.counts,
      summary: state.summary,
      error: state.error,
      events: (state.events || []).slice(0, 10)
    };
  }

  function showWorkspacePanel(target) {
    const tabs = [...document.querySelectorAll(".tab")];
    const activeTabIndex = tabs.findIndex((tab) => tab.dataset.tab === target);
    const tabsContainer = document.querySelector(".tabs");
    if (tabsContainer) {
      tabsContainer.style.setProperty("--tab-count", String(Math.max(tabs.length, 1)));
      tabsContainer.style.setProperty("--tab-index", String(Math.max(activeTabIndex, 0)));
      tabsContainer.dataset.activeTab = activeTabIndex >= 0 ? "true" : "false";
    }
    tabs.forEach((tab, index) => {
      tab.classList.toggle("active", index === activeTabIndex);
    });
    document.querySelectorAll(".panel").forEach((panel) => {
      const isActive = panel.dataset.panel === target;
      if (isActive && !panel.classList.contains("active")) {
        panel.style.animation = "none";
        void panel.offsetWidth;
        panel.style.animation = "";
      }
      panel.classList.toggle("active", isActive);
    });
  }

  function setActiveJump(target) {
    els.dockJumps?.querySelectorAll("[data-jump-target]").forEach((button) => {
      button.setAttribute("aria-current", button.dataset.jumpTarget === target ? "true" : "false");
    });
  }

  function prefersReducedMotion() {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || false;
  }

  function scrollTargetIntoView(element, block = "start") {
    if (!element) return;
    element.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block });
  }

  function openDetailsFor(element) {
    if (!element) return;
    const details = element.closest?.("details");
    if (details) details.open = true;
  }

  function jumpToSection(target) {
    const sections = {
      draft: () => {
        showWorkspacePanel("draft");
        scrollTargetIntoView(els.draftPanel);
      },
      preview: () => {
        showWorkspacePanel("preview");
        scrollTargetIntoView(els.previewPanel);
      },
      check: () => {
        openDetailsFor(els.preflightPanel);
        scrollTargetIntoView(els.preflightPanel);
      },
      verify: () => scrollTargetIntoView(els.verificationPanel),
      evidence: () => {
        openDetailsFor(els.evidencePanel);
        scrollTargetIntoView(els.evidencePanel);
      }
    };
    const jump = sections[target];
    if (!jump) return;
    jump();
    setActiveJump(target);
  }

  async function refreshPageState() {
    const tab = await activeTab();
    const url = tab?.url || "";
    if (!/^https:\/\/(?:x|twitter)\.com\//.test(url)) {
      latestPageStatus = null;
      latestDiagnostics = null;
      setPageState("Open X Articles entry", "action", "openArticles");
      setReadiness({ target: "Open X", editor: "Unknown", vault: "Optional" });
      updateDraftBrief();
      updatePreflight();
      updateProgressiveSections();
      return;
    }
    const response = await sendToActiveTab({ type: "xposter:page-status" });
    if (!response?.ok) {
      latestPageStatus = null;
      latestDiagnostics = null;
      setPageState("Refresh X", "warn");
      setReadiness({ target: "X tab", editor: "Reload", vault: "Optional" });
      updateDraftBrief();
      updatePreflight();
      updateProgressiveSections();
      return;
    }
    const previousUrl = latestPageStatus?.url || "";
    latestPageStatus = response;
    if (previousUrl && previousUrl !== response.url) latestDiagnostics = null;
    const oldImporter = originalImporterResidueStatus();
    if (oldImporter.detected) setPageState("Old importer active", "warn");
    else if (response.hasEditor) setPageState("Editor ready", "ready");
    else if (response.isArticleRoute) setPageState("X Articles ready", "ready");
    else setPageState("Open X Articles entry", "action", "openArticles");
    updateVaultState(response.vault);
    setReadiness({
      target: response.isArticleRoute ? "Articles" : "Go Articles",
      editor: response.hasEditor ? "Ready" : response.isArticleRoute ? "Can create" : "Not ready",
      vault: response.vault?.configured
        ? response.vault.permission === "granted"
          ? "Ready"
          : "Permission"
        : "Optional"
    });
    updateDraftBrief();
    updatePreflight();
    updateProgressiveSections();
  }

  function setPageState(text, tone, action = "") {
    const label = els.pageState.querySelector("span") || els.pageState;
    setLocalizedText(label, text);
    els.pageState.dataset.xposterSourceText = text;
    els.pageState.dataset.pageAction = action;
    els.pageState.className = `page-state ${tone || ""}`;
    els.pageState.disabled = !action;
    const title = action === "openArticles" ? "Open X Articles entry" : text;
    els.pageState.title = localizeText(title);
    els.pageState.setAttribute("aria-label", localizeText(title));
  }

  function setReadiness({ target, editor, vault }) {
    els.targetReady.textContent = localizeText(target);
    els.editorReady.textContent = localizeText(editor);
    els.vaultReady.textContent = localizeText(vault);
  }

  async function prepareImportTarget() {
    await refreshPageState();
    const checks = buildPreflightChecks();
    const gate = getImportGate(checks);
    const targetContext = buildTargetContextEvidence();
    if (!gate.ok) {
      return { ok: false, checks, gate, targetContext };
    }
    if (targetContext.available) {
      const label = targetContext.articleId ? `article ${targetContext.articleId}` : "the open X Article";
      log(`Import will use ${label}.`);
    }
    return { ok: true, checks, gate, targetContext };
  }

  async function prepareSimpleWriteTarget(parsed) {
    const remoteImages = remoteHttpImageSegments(parsed);
    if (remoteImages.length) {
      log(`Preparing ${remoteImages.length} web image(s) for upload. Failed downloads will stay as Markdown links.`);
      await refreshRemoteImageAccessStatus(parsed);
    } else if (remoteImageAccessStatus.origins.length) {
      syncRemoteImageAccessStatusFromDraft(parsed);
    }
    updatePreflight();
    let checks = buildPreflightChecks();
    const pageScriptCheck = checks.find((check) => check.id === "page-script");
    if (pageScriptCheck?.tone === "error") {
      return { ok: false, reason: pageScriptCheck.detail, checks, targetContext: buildTargetContextEvidence() };
    }

    const active = await activeTab();
    if (!isArticlesUrl(active?.url)) {
      await openArticles();
    }
    for (let attempt = 0; attempt < 14; attempt += 1) {
      await delay(attempt < 2 ? 350 : 700);
      await refreshPageState();
      checks = buildPreflightChecks();
      const status = latestPageStatus || {};
      const needsDiagnostics = Boolean(status.isArticleRoute && status.hasEditor);
      if (needsDiagnostics) {
        const response = await sendToActiveTab({ type: "xposter:diagnostics" });
        latestDiagnostics = response?.ok ? response : { ok: false, error: response?.error || "Diagnostics unavailable" };
        if (response?.ok) lockTargetContext("write");
        updatePreflight();
        checks = buildPreflightChecks();
      }
      const gate = getImportGate(checks);
      if (gate.ok || status.isArticleRoute) {
        return { ok: true, checks, gate, targetContext: buildTargetContextEvidence() };
      }
    }
    checks = buildPreflightChecks();
    return {
      ok: false,
      reason: getImportGate(checks).message || "Open or create an X Article, then try Write again.",
      checks,
      targetContext: buildTargetContextEvidence()
    };
  }

  async function importMarkdownDraft(markdownInput, { queueItemId = null, batch = false } = {}) {
    const markdown = String(markdownInput || "").trim();
    if (!markdown) {
      log("Paste or load Markdown first.");
      return { ok: false, error: "empty" };
    }
    activeWriteQueueItemId = queueItemId;
    if (queueItemId) {
      draftQueue = draftQueue.map((item) => item.id === queueItemId ? { ...item, status: "writing" } : item);
      renderDraftQueue();
    }
    const parsed = ensureLatestParsedFromDraft();
    const remoteImages = remoteHttpImageSegments(parsed);
    if (remoteImages.length) {
      const permission = await requestRemoteImageAccess(parsed);
      if (!permission.ok) {
        log(
          permission.error
            ? `Web image permission unavailable: ${permission.error}. Failed downloads will stay as Markdown links.`
            : "Web image permission was not granted. Failed downloads will stay as Markdown links."
        );
      }
    }
    window.clearTimeout(draftInputHistoryTimer);
    ensureActiveDraftRecordId();
    if (!currentDraftRecord()) rememberDraftHistory("typed");
    updatePreflight();
    updateWriteButton({ busy: true });
    resetLiveProgress("import");
    importCancelRequested = false;
    const mediaEstimate = mediaUploadEstimate(parsed);
    if (mediaEstimate.overSoftLimit) log(mediaLimitWarningText(mediaEstimate));
    const target = await prepareSimpleWriteTarget(parsed);
    if (!target.ok) {
      log(target.reason || "Could not prepare X Article.");
      captureEvidence("preflight-blocked", {
        reason: target.reason,
        targetContext: target.targetContext,
        pageStatus: latestPageStatus,
        diagnostics: latestDiagnostics
      });
      recordLiveProgressEvent("error", { error: target.reason || "Could not prepare X Article." });
      updateWriteButton();
      activeWriteQueueItemId = null;
      if (queueItemId) {
        draftQueue = draftQueue.map((item) => item.id === queueItemId && item.status === "writing" ? { ...item, status: "queued" } : item);
        persistDraftQueue();
        renderDraftQueue();
      }
      return { ok: false, error: target.reason || "Could not prepare X Article." };
    }
    if (importCancelRequested) {
      importCancelRequested = false;
      log("Writing stopped by user.");
      recordLiveProgressEvent("cancelled", { reason: "Writing stopped by user." });
      updateWriteButton();
      updateLiveProgress();
      activeWriteQueueItemId = null;
      if (queueItemId) {
        draftQueue = draftQueue.map((item) => item.id === queueItemId && item.status === "writing" ? { ...item, status: "queued" } : item);
        persistDraftQueue();
        renderDraftQueue();
      }
      return { ok: false, error: "Writing stopped by user.", cancelled: true };
    }
    if (queueItemId) {
      draftQueue = draftQueue.map((item) => item.id === queueItemId ? { ...item, status: "writing" } : item);
      persistDraftQueue();
      renderDraftQueue();
    }
    const response = await sendToActiveTab({ type: "xposter:import-markdown", markdown, options: importOptionsPayload() });
    importCancelRequested = false;
    if (response?.ok) {
      const seconds = ((response.summary?.elapsedMs || 0) / 1000).toFixed(1);
      const warnings = response.summary?.mediaWarnings?.total || response.summary?.main?.imgFail || 0;
      if (warnings) log(`Writing complete in ${seconds}s with ${warnings} media warning(s).`);
      if (latestProgress.state !== "complete") recordLiveProgressEvent("complete", { summary: response.summary });
      renderRunSummary(response.summary);
      captureEvidence("import", { result: response, targetContext: target.targetContext, pageStatus: latestPageStatus, diagnostics: latestDiagnostics });
      markActiveQueueItemWritten();
      triggerSuccessFeedback(response.summary);
    } else {
      log(`Import failed: ${response?.error || "unknown error"}`);
      if (response?.cancelled) {
        recordLiveProgressEvent("cancelled", { reason: response?.error || "Writing stopped by user." });
      } else if (latestProgress.state !== "error") {
        recordLiveProgressEvent("error", { error: response?.error || "unknown error" });
      }
      captureEvidence("import-error", { result: response, targetContext: target.targetContext, pageStatus: latestPageStatus, diagnostics: latestDiagnostics });
      activeWriteQueueItemId = null;
      if (queueItemId) {
        draftQueue = draftQueue.map((item) => item.id === queueItemId && item.status === "writing" ? { ...item, status: "queued" } : item);
        persistDraftQueue();
        renderDraftQueue();
      }
    }
    updatePreflight();
    updateWriteButton();
    updateLiveProgress();
    const pageStateRefresh = refreshPageState().catch(() => null);
    if (response?.ok) {
      setCompactImportStatus(response.summary);
      void pageStateRefresh.then(() => setCompactImportStatus(response.summary));
    }
    return response?.ok
      ? { ok: true, response }
      : { ok: false, error: response?.error || "unknown error", cancelled: Boolean(response?.cancelled), response };
  }

  async function importDraft() {
    return importMarkdownDraft(els.markdown.value);
  }

  async function importQueueItem(id) {
    const item = draftQueue.find((entry) => entry.id === id);
    if (!item) return { ok: false, error: "Queued draft not found" };
    activeQueueItemId = item.id;
    suppressNextTypedHistory = true;
    window.clearTimeout(draftInputHistoryTimer);
    els.markdown.value = item.markdown;
    saveDraft();
    analyzeDraft();
    renderDraftQueue();
    return importMarkdownDraft(item.markdown, { queueItemId: item.id, batch: batchWriting });
  }

  async function importDraftQueue() {
    if (batchWriting || !queueModeActive()) return null;
    batchWriting = true;
    updateWriteButton();
    try {
      const origins = remoteImageOriginsForMarkdowns(draftQueue.map((item) => item.markdown), importOptions);
      if (origins.length) {
        const permission = await requestRemoteImageAccessForOrigins(origins, latestParsed);
        if (!permission.ok) {
          log(
            permission.error
              ? `Web image permission unavailable: ${permission.error}. Failed downloads will stay as Markdown links.`
              : "Web image permission was not granted. Failed downloads will stay as Markdown links."
          );
        }
      }
      while (draftQueue.length > 0) {
        const item = draftQueue[0];
        const result = await importQueueItem(item.id);
        if (!result?.ok || result?.cancelled) break;
        await delay(300);
      }
    } finally {
      batchWriting = false;
      activeWriteQueueItemId = null;
      updateWriteButton();
      renderDraftQueue();
    }
    return null;
  }

  function renderRunSummary(summary) {
    if (!summary) return;
    window.clearTimeout(runSummaryCollapseTimer);
    runSummaryCollapseTimer = null;
    els.runSummary.hidden = false;
    const imageOk = summary.images?.ok || 0;
    const imageFail = summary.images?.fail || 0;
    const uploadFail = summary.main?.imgFail || 0;
    const imageWarnings = (summary.mediaWarnings?.images || 0) + uploadFail;
    const hasWarnings = hasRunSummaryWarnings(summary);
    els.runSummary.dataset.tone = hasWarnings ? "warn" : "done";
    if (els.summaryMessage) {
      els.summaryMessage.dataset.tone = hasWarnings ? "warn" : "done";
      els.summaryMessage.textContent = summarizeRunMessage(summary);
    }
    els.summaryImages.textContent = imageWarnings
      ? `${imageOk} uploaded, ${imageWarnings} kept`
      : imageOk
        ? `Uploaded ${imageOk}`
        : `${imageOk} / ${imageOk + imageFail}`;
    const main = summary.main || {};
    els.summaryBlocks.textContent = `${main.atomicOk || 0} / ${(main.atomicOk || 0) + (main.atomicFail || 0)}`;
    els.summaryTitle.textContent = summarizeTitleResult(main.title);
    els.summaryCover.textContent = summarizeCoverResult(main.cover);
    els.summaryElapsed.textContent = `${((summary.elapsedMs || 0) / 1000).toFixed(1)}s`;
    updateWorkflowRail();
    translateDynamicDom(els.runSummary);
    scheduleRunSummaryCollapse(summary);
  }

  function summarizeRunMessage(summary) {
    const elapsed = summary.elapsedMs ? `${(summary.elapsedMs / 1000).toFixed(1)}s` : "";
    const images = summary.images || {};
    const uploaded = Number(images.ok || 0);
    const keptImages = Number(summary.mediaWarnings?.images || 0) + Number(summary.main?.imgFail || 0);
    const keptTables = Number(summary.mediaWarnings?.tables || 0);
    if (keptImages) {
      return `Article written${elapsed ? ` in ${elapsed}` : ""}. ${keptImages} web image(s) stayed as Markdown links. Replace private or expired URLs with public links if they must upload.`;
    }
    if (keptTables) {
      return `Article written${elapsed ? ` in ${elapsed}` : ""}. ${keptTables} table(s) stayed as Markdown.`;
    }
    if (uploaded) return "All web images uploaded.";
    return elapsed ? `Article written in ${elapsed}.` : "Article written.";
  }

  function summarizeTitleResult(title) {
    if (!title?.requested) return "Skipped";
    if (title.ui?.ok && (title.graphql?.ok || title.graphql?.skipped)) return "Set";
    if (title.ui?.ok) return "UI only";
    return "Failed";
  }

  function mergeSummaryResult(current, previous, fallback = "Not run") {
    return current && current !== "Skipped" ? current : previous || fallback;
  }

  function summarizeCoverResult(cover) {
    if (!cover?.requested) return "Skipped";
    if (cover.graphql?.ok) return cover.bodyBlockDeleted?.ok ? "Set, body removed" : "Set";
    if (cover.skippedReason) return "Skipped";
    return cover.matchedUpload ? "GraphQL failed" : "No match";
  }

  function getLiveResultItems() {
    return Array.from(els.liveResultList.querySelectorAll("input[data-live-check]"));
  }

  function buildLiveResultEvidence() {
    const items = getLiveResultItems().map((input) => {
      const item = input.closest("li");
      return {
        id: input.dataset.liveCheck,
        checked: Boolean(input.checked),
        label: item?.querySelector("label")?.textContent?.trim() || input.dataset.liveCheck,
        detail: item?.querySelector("span")?.textContent?.trim() || ""
      };
    });
    return {
      checked: items.filter((item) => item.checked).length,
      total: items.length,
      complete: items.length > 0 && items.every((item) => item.checked),
      items
    };
  }

  function updateLiveResultMeta() {
    const result = buildLiveResultEvidence();
    els.liveResultMeta.textContent = result.complete
      ? "Article review complete; save the final records."
      : `${result.checked}/${result.total} article review checks recorded.`;
    updateWorkflowRail();
    updateLiveRunbook();
    updateNextAction();
    updateProofDeck();
    updateCompletionAudit();
    updateLiveGate();
    updateRecoveryPanel();
    updateCommandDock();
    updateProgressiveSections();
  }

  function saveLiveResultChecks() {
    liveResultChecks = Object.fromEntries(getLiveResultItems().map((input) => [input.dataset.liveCheck, Boolean(input.checked)]));
    updateLiveResultMeta();
    if (hasChromeApi()) chrome.storage.local.set({ [STORAGE_LIVE_RESULT]: liveResultChecks });
  }

  async function restoreLiveResultChecks() {
    if (hasChromeApi()) {
      const stored = await chrome.storage.local.get(STORAGE_LIVE_RESULT);
      liveResultChecks = stored[STORAGE_LIVE_RESULT] || {};
    }
    for (const input of getLiveResultItems()) input.checked = Boolean(liveResultChecks[input.dataset.liveCheck]);
    updateLiveResultMeta();
  }

  function resetLiveResultChecks() {
    liveResultChecks = {};
    for (const input of getLiveResultItems()) input.checked = false;
    updateLiveResultMeta();
    if (hasChromeApi()) chrome.storage.local.remove(STORAGE_LIVE_RESULT);
    log("Live result checklist reset.");
  }

  function isArticlesUrl(url) {
    return /^https:\/\/(?:x|twitter)\.com\/compose\/articles(?:$|[/?#])/.test(String(url || ""));
  }

  async function openArticles() {
    if (!hasChromeApi()) {
      window.open("https://x.com/compose/articles", "_blank", "noopener");
      return;
    }
    const tab = await activeTab();
    if (tab?.id) {
      if (isArticlesUrl(tab.url)) return;
      await chrome.tabs.update(tab.id, { url: "https://x.com/compose/articles" });
    } else {
      await chrome.tabs.create({ url: "https://x.com/compose/articles" });
    }
  }

  async function refreshActiveXTab() {
    if (!hasChromeApi()) {
      window.open("https://x.com/compose/articles", "_blank", "noopener");
      return;
    }
    const tab = await activeTab();
    if (tab?.id && /^https:\/\/(?:x|twitter)\.com\//.test(tab.url || "")) {
      await chrome.tabs.reload(tab.id);
      log("X Article tab refreshed.");
      await delay(900);
      await refreshPageState();
      return;
    }
    await openArticles();
  }

  function loadFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = MARKDOWN_FILE_ACCEPT;
    input.addEventListener("change", async () => {
      const files = Array.from(input.files || []);
      input.remove();
      if (!files.length) return;
      await loadMarkdownFiles(markdownFilesFrom(files), "file");
      showWorkspacePanel("draft");
    });
    input.click();
  }

  async function loadMarkdownFiles(markdownFiles, source) {
    if (markdownFiles.length > 1) {
      await queueMarkdownFiles(markdownFiles, source);
      return;
    }
    if (markdownFiles[0]) {
      await loadMarkdownFileIntoDraft(markdownFiles[0], source);
      return;
    }
    showMarkdownLoadError();
  }

  async function queueMarkdownFiles(markdownFiles, source) {
    const added = addDraftQueueItems(await filesToQueueItems(markdownFiles), {
      activateFirst: true,
      source
    });
    if (added.length) {
      log(`Queued ${added.length} Markdown draft${added.length === 1 ? "" : "s"}.`);
      return added;
    }
    setDraftDropStatus("Markdown queued", NO_NEW_DRAFTS_DETAIL, "idle");
    log(NO_NEW_DRAFTS_DETAIL);
    return added;
  }

  async function loadMarkdownFileIntoDraft(file, source = "file") {
    if (!isMarkdownFile(file)) {
      log("Choose a Markdown file.");
      showMarkdownLoadError();
      return;
    }
    try {
      setDraftDropStatus("Reading file...", file.name, "ready");
      const text = await file.text();
      if (queueModeActive()) {
        const item = addDraftToQueue(text, {
          fileName: file.name,
          source,
          statusTitle: "Markdown queued"
        });
        if (item) log(`Queued ${file.name}.`);
      } else {
        setSingleDraftMarkdown(text, {
          fileName: file.name,
          source,
          statusTitle: "Markdown loaded",
          logMessage: `Loaded ${file.name}.`
        });
      }
    } catch (error) {
      const detail = error?.message || MARKDOWN_LOAD_ERROR_DETAIL;
      showMarkdownLoadError(detail);
      log(`Could not load ${file.name}: ${detail}`);
    }
  }

  function hasMarkdownTransfer(dataTransfer) {
    if (!dataTransfer) return false;
    const types = Array.from(dataTransfer.types || []);
    if (markdownTextFromTransfer(dataTransfer)) return true;
    if (types.includes("text/markdown")) return true;
    const files = Array.from(dataTransfer.files || []);
    if (files.length) return files.some(isMarkdownFile);
    const items = Array.from(dataTransfer.items || []);
    if (items.some(isLikelyMarkdownTransferItem)) return true;
    if (items.some(isLikelyImageTransferItem)) return false;
    if (types.includes("text/plain")) return false;
    return hasMarkdownFile(dataTransfer);
  }

  function markdownTextFromTransfer(dataTransfer) {
    const text = dataTransfer?.getData?.("text/plain") || dataTransfer?.getData?.("text/markdown") || "";
    return shared.looksLikeMarkdown(text) ? text : "";
  }

  function hasMarkdownFile(dataTransfer) {
    const files = Array.from(dataTransfer?.files || []);
    if (files.some(isMarkdownFile)) return true;
    const items = Array.from(dataTransfer?.items || []);
    return items.some(isLikelyMarkdownTransferItem);
  }

  function isLikelyMarkdownTransferItem(item) {
    if (item?.kind !== "file") return false;
    if (!item.type) return true;
    return MARKDOWN_TRANSFER_MIME_RE.test(item.type);
  }

  function isLikelyImageTransferItem(item) {
    return item?.kind === "file" && /^image\//i.test(item.type || "");
  }

  function installDraftDropTray() {
    if (!els.draftPanel) return;
    let dragActive = false;
    let dragCancelled = false;
    const activateDropzone = () => {
      if (dragCancelled) return;
      showWorkspacePanel("draft");
      setActiveJump("draft");
      dragActive = true;
      els.draftPanel.classList.add("drag-active");
      setDraftDropStatus("Drop Markdown here", "Release to load it.", "ready");
    };
    const deactivateDropzone = () => {
      dragActive = false;
      els.draftPanel.classList.remove("drag-active");
    };
    const restoreDropStatus = () => {
      setDraftDropStatus(
        latestParsed?.segments?.length ? "Markdown loaded" : "Ready for Markdown",
        latestParsed?.segments?.length
          ? draftReadyDetail(els.markdown.value.length)
          : "Paste text or choose a .md file.",
        latestParsed?.segments?.length ? "done" : "idle"
      );
    };
    const cancelDropzone = () => {
      if (!dragActive && !els.draftPanel.classList.contains("drag-active")) return;
      dragCancelled = true;
      deactivateDropzone();
      setDraftDropStatus("Drop cancelled", "Paste text or choose a .md file.", "idle");
    };
    const leftWindow = (event) =>
      event.clientX <= 0 ||
      event.clientY <= 0 ||
      event.clientX >= window.innerWidth ||
      event.clientY >= window.innerHeight;
    document.addEventListener("dragenter", (event) => {
      if (!hasMarkdownTransfer(event.dataTransfer)) return;
      if (!els.draftPanel.classList.contains("drag-active")) dragCancelled = false;
      event.preventDefault();
      activateDropzone();
    }, true);
    document.addEventListener("dragover", (event) => {
      if (!hasMarkdownTransfer(event.dataTransfer)) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = dragCancelled ? "none" : "copy";
      activateDropzone();
    }, true);
    document.addEventListener("dragleave", (event) => {
      if (leftWindow(event)) {
        dragCancelled = false;
        deactivateDropzone();
        restoreDropStatus();
      }
    }, true);
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      cancelDropzone();
    }, true);
    document.addEventListener("drop", async (event) => {
      if (!hasMarkdownTransfer(event.dataTransfer)) return;
      event.preventDefault();
      event.stopPropagation();
      if (dragCancelled) {
        dragCancelled = false;
        deactivateDropzone();
        restoreDropStatus();
        return;
      }
      dragCancelled = false;
      deactivateDropzone();
      setDraftDropStatus("Reading Markdown...", "Reading dropped Markdown.", "ready");
      const markdownFiles = markdownFilesFrom(event.dataTransfer.files);
      if (markdownFiles.length > 1) {
        await queueMarkdownFiles(markdownFiles, "drop-file");
      } else if (markdownFiles[0]) {
        await loadMarkdownFileIntoDraft(markdownFiles[0], "drop-file");
      } else {
        const text = markdownTextFromTransfer(event.dataTransfer);
        if (text) {
          if (queueModeActive()) {
            addDraftToQueue(text, {
              source: "drop",
              statusTitle: "Markdown queued",
              logMessage: "Loaded dragged Markdown."
            });
          } else {
            setSingleDraftMarkdown(text, {
              source: "drop",
              statusTitle: "Markdown loaded",
              logMessage: "Loaded dragged Markdown."
            });
          }
        } else {
          setDraftDropStatus("Could not load Markdown", "That drop did not include Markdown text or a .md file.", "error");
        }
      }
      showWorkspacePanel("draft");
    }, true);
  }

  async function loadSmokeFixture() {
    setSingleDraftMarkdown(currentLanguage === "zh" ? EXAMPLE_DRAFT_ZH : EXAMPLE_DRAFT, {
      fileName: "example.md",
      source: "example",
      statusTitle: "Markdown loaded",
      logMessage: "Loaded example Markdown draft."
    });
  }

  async function chooseVault() {
    const response = await sendToActiveTab({ type: "xposter:choose-vault" });
    if (response?.ok) {
      log(`Local image folder set: ${response.name}.`);
      await refreshPageState();
      return;
    }
    if (response?.skipped) log("Local image folder selection skipped.");
    else log(`Local image folder setup failed: ${response?.error || "open an X page first"}`);
  }

  async function clearVault() {
    const response = await sendToActiveTab({ type: "xposter:clear-vault" });
    if (response?.ok) {
      log("Local image folder cleared.");
      await refreshPageState();
      return;
    }
    log(`Could not clear local image folder: ${response?.error || "open an X page first"}`);
  }

  function saveDraft() {
    if (!hasChromeApi()) return;
    window.clearTimeout(draftSaveTimer);
    draftSaveTimer = null;
    chrome.storage.local.set({ [STORAGE_DRAFT]: els.markdown.value });
  }

  function scheduleSaveDraft() {
    if (!hasChromeApi()) return;
    window.clearTimeout(draftSaveTimer);
    draftSaveTimer = window.setTimeout(() => {
      draftSaveTimer = null;
      saveDraft();
    }, DRAFT_SAVE_DELAY_MS);
  }

  function flushDraftSave() {
    if (!draftSaveTimer) return;
    window.clearTimeout(draftSaveTimer);
    draftSaveTimer = null;
    saveDraft();
  }

  function scheduleRecordHistoryRender() {
    window.clearTimeout(recordSearchTimer);
    recordSearchTimer = window.setTimeout(() => {
      recordSearchTimer = null;
      renderRecordHistory();
    }, RECORD_SEARCH_DELAY_MS);
  }

  async function restoreDraft() {
    if (!hasChromeApi()) {
      analyzeDraft();
      return;
    }
    const stored = await chrome.storage.local.get(STORAGE_DRAFT);
    const restored = String(stored[STORAGE_DRAFT] || "");
    if (queueModeActive()) {
      const activeItem = draftQueue.find((item) => item.id === activeQueueItemId) || draftQueue[0];
      suppressNextTypedHistory = true;
      window.clearTimeout(draftInputHistoryTimer);
      els.markdown.value = activeItem?.markdown || "";
      analyzeDraft();
      renderDraftQueue();
      return;
    }
    if (restored.trim()) {
      setSingleDraftMarkdown(restored, {
        source: "restored",
        statusTitle: "Markdown loaded",
        logMessage: "",
        remember: false
      });
      return;
    }
    els.markdown.value = "";
    analyzeDraft();
    syncDraftSurface();
  }

  function installDraftStorageSync() {
    if (!hasChromeApi() || !chrome.storage?.onChanged) return;
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== "local") return;
      if (changes[STORAGE_DRAFT]) {
        const nextDraft = String(changes[STORAGE_DRAFT].newValue || "");
        if (!queueModeActive() && nextDraft !== els.markdown.value) {
          setSingleDraftMarkdown(nextDraft, {
            source: "restored",
            statusTitle: "Markdown loaded",
            logMessage: "",
            remember: false
          });
          showWorkspacePanel("draft");
          setDraftDropStatus("Markdown loaded", draftReadyDetail(nextDraft.length), "done");
          log("Markdown draft loaded from the X Article tab.");
        }
      }
      if (changes[STORAGE_DRAFT_QUEUE]) {
        const previousLength = draftQueue.length;
        const previousIds = new Set(draftQueue.map((item) => item.id));
        draftQueue = Array.isArray(changes[STORAGE_DRAFT_QUEUE].newValue)
          ? changes[STORAGE_DRAFT_QUEUE].newValue.map(normalizeQueueItem).filter(Boolean).slice(0, MAX_DRAFT_QUEUE)
          : [];
        if (activeQueueItemId && !draftQueue.some((item) => item.id === activeQueueItemId)) activeQueueItemId = null;
        if (draftQueue.length > previousLength) {
          markQueueItemsEntered(draftQueue.filter((item) => !previousIds.has(item.id)));
        }
        renderDraftQueue();
        if (draftQueue.length > previousLength) {
          showWorkspacePanel("draft");
          setActiveJump("draft");
          showQueuedDraftAdded(draftQueue.length - previousLength);
        }
      }
    });
  }

  async function restoreVaultState() {
    els.vaultState.textContent = "Choose from an active X page";
    els.vaultDetail.textContent = "Choose from an active X page when Markdown uses relative image paths.";
    els.vaultSettingsText.textContent = "Choose from an active X tab so browser permissions are attached to the page.";
    setVaultClearEnabled(false);
  }

  function updateVaultState(vault) {
    if (!vault) {
      setVaultClearEnabled(false);
      translateDynamicDom(document.querySelector(".vault"));
      return;
    }
    if (!vault.configured) {
      els.vaultState.textContent = "Not configured";
      els.vaultDetail.textContent = "Relative image paths will be skipped until a local image folder is selected.";
      els.vaultSettingsText.textContent = "No local image folder is configured.";
      setVaultClearEnabled(false);
      translateDynamicDom(document.querySelector(".vault"));
      return;
    }
    const permissionText = vault.permission === "granted" ? "Read access granted" : "Permission needed";
    const savedText = vault.savedAt ? `Saved ${new Date(vault.savedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}` : "Saved in this browser";
    els.vaultState.textContent = `Selected: ${vault.name}`;
    els.vaultDetail.textContent = `${permissionText}. ${savedText}.`;
    els.vaultSettingsText.textContent = `${vault.name} - ${permissionText.toLowerCase()}.`;
    setVaultClearEnabled(true);
    translateDynamicDom(document.querySelector(".vault"));
  }

  function setVaultClearEnabled(enabled) {
    els.clearVault.disabled = !enabled;
    els.clearVaultSettings.disabled = !enabled;
  }

  async function runPreflight() {
    els.runPreflight.disabled = true;
    els.runPreflight.textContent = "Checking...";
    log("Publishing check started.");
    await refreshPageState();
    const response = await sendToActiveTab({ type: "xposter:diagnostics" });
    latestDiagnostics = response?.ok ? response : { ok: false, error: response?.error || "Diagnostics unavailable" };
    await refreshRemoteImageAccessStatus(latestParsed);
    const locked = response?.ok ? lockTargetContext("preflight") : null;
    if (locked) log(`Article confirmed: ${locked.context.articleId ? `article ${locked.context.articleId}` : "the open X Article"}.`);
    updatePreflight();
    captureEvidence("preflight", {
      checks: buildPreflightChecks(),
      targetLock,
      pageStatus: latestPageStatus,
      diagnostics: latestDiagnostics
    });
    const failing = buildPreflightChecks().filter((check) => check.tone === "error");
    if (failing.length) log(`Publishing check found ${failing.length} blocker(s).`);
    else log("Publishing check passed without blockers.");
    els.runPreflight.disabled = false;
    els.runPreflight.textContent = "Check";
  }

  function captureEvidence(kind, payload) {
    const checks = buildPreflightChecks();
    const gate = getImportGate(checks);
    const targetContext = payload?.targetContext || buildTargetContextEvidence();
    const snapshot = markdownSnapshot(els.markdown.value || "");
    latestEvidence = {
      id: newRecordId(kind.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "record"),
      kind,
      capturedAt: new Date().toISOString(),
      draftRecordId: activeDraftRecordId || null,
      draftFingerprint: activeDraftFingerprint || draftFingerprint(els.markdown.value || ""),
      source: currentDraftRecord()?.source || null,
      draft: {
        title: latestParsed?.title || null,
        cover: latestParsed?.cover || null,
        markdown: snapshot.text,
        markdownTruncated: snapshot.truncated,
        characters: snapshot.characters,
        counts: latestCounts,
        blocks: latestParsed?.segments?.length || 0,
        remoteImages: {
          count: remoteHttpImageSegments(latestParsed).length,
          origins: remoteImageOrigins(latestParsed),
          access: remoteImageAccessStatus,
          probe: remoteImageProbeStatus
        }
      },
      importPlan: buildPreviewPlan(),
      gate,
      checks,
      liveResult: buildLiveResultEvidence(),
      proofDeck: buildProofDeckEvidence(checks, gate),
      completionAudit: buildCompletionAuditEvidence(checks, gate),
      recovery: buildRecoveryState(checks, gate),
      targetContext,
      importLedger: buildImportLedger(latestParsed, latestCounts),
      liveProgress: buildLiveProgressEvidence(),
      ...payload
    };
    addRecordHistoryEntry(latestEvidence);
    if (kind === "import" || kind === "import-error") activeDraftFinalized = true;
    els.evidenceMeta.textContent = `${kind} record saved at ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    els.evidenceText.textContent = JSON.stringify(latestEvidence, jsonSafeReplacer, 2);
    els.copyEvidence.disabled = false;
    updateProgressiveSections();
    updateWorkflowRail(checks);
    updateLiveRunbook(checks, gate);
    updateNextAction(checks, gate);
    updateProofDeck(checks, gate);
    updateCompletionAudit(checks, gate);
    updateLiveGate(checks, gate);
    updateRecoveryPanel(checks, gate);
    updateTargetContextPanel();
    translateDynamicDom();
  }

  function addRecordHistoryEntry(evidence) {
    if (!evidence) return;
    const previous = currentRecord(evidence.id) || (evidence.kind === "draft-loaded" ? currentDraftRecord(evidence.draftRecordId) : null);
    const entry = normalizeRecordHistoryEntry(evidence, previous);
    recordHistory = [entry, ...recordHistory.filter((item) => item.id !== entry.id)].slice(0, MAX_RECORD_HISTORY);
    persistRecordHistory();
    renderRecordHistory();
  }

  function recordStorageEntry(record) {
    if (!record || typeof record !== "object") return record;
    const evidence = record.evidence && typeof record.evidence === "object"
      ? {
          ...record.evidence,
          draft: {
            ...(record.evidence.draft || {}),
            markdown: undefined,
            markdownTruncated: undefined
          }
        }
      : record.evidence;
    return {
      ...record,
      evidence
    };
  }

  function currentRecord(id) {
    if (!id) return null;
    return recordHistory.find((item) => item.id === id) || null;
  }

  function currentDraftRecord(id = activeDraftRecordId) {
    if (!id) return null;
    return recordHistory.find((item) => item.kind === "draft-loaded" && item.draftRecordId === id) || null;
  }

  function normalizeRecordHistoryEntry(evidence, previous = null) {
    const summary = evidence.result?.summary || evidence.liveProgress?.summary || null;
    const main = summary?.main || evidence.result?.summary?.main || {};
    const title = evidence.draft?.title || summary?.title || "Untitled draft";
    const kind = String(evidence.kind || "record");
    const capturedAt = evidence.capturedAt || new Date().toISOString();
    const imageOk = Number(summary?.images?.ok || 0);
    const imageFail = Number(summary?.images?.fail || 0);
    const uploadFail = Number(main?.imgFail || 0);
    const warnings = Number(summary?.mediaWarnings?.total || 0) + uploadFail;
    const target = evidence.targetContext || {};
    const pageStatus = evidence.pageStatus || {};
    const articleId = target.articleId || main?.title?.articleId || main?.cover?.articleId || previous?.articleId || null;
    const url = articleUrlForRecord({ target, pageStatus, articleId, previousUrl: previous?.url });
    const source = evidence.source || previous?.source || null;
    const draftRecordId = evidence.draftRecordId || previous?.draftRecordId || null;
    const draftFingerprint = evidence.draftFingerprint || previous?.draftFingerprint || null;
    const blocks = evidence.draft?.blocks || previous?.blocks || 0;
    const characters = evidence.draft?.characters || previous?.characters || 0;
    const markdown = typeof evidence.draft?.markdown === "string" ? evidence.draft.markdown : previous?.markdown || "";
    const markdownTruncated = Boolean(evidence.draft?.markdownTruncated || previous?.markdownTruncated);
    return {
      id: evidence.id || previous?.id || newRecordId(kind.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "record"),
      draftRecordId,
      draftFingerprint,
      kind,
      capturedAt: previous?.capturedAt || capturedAt,
      updatedAt: evidence.updatedAt || capturedAt,
      title,
      status: recordStatusForEvidence(evidence),
      tone: recordToneForEvidence(evidence),
      action: recordActionText(evidence),
      result: recordResultText(evidence, { imageOk, imageFail, warnings, blocks, characters }),
      articleId,
      route: target.route || previous?.route || null,
      url,
      source,
      markdown,
      markdownTruncated,
      blocks,
      characters,
      images: {
        ok: imageOk || previous?.images?.ok || 0,
        fail: imageFail || previous?.images?.fail || 0,
        warnings
      },
      titleResult: mergeSummaryResult(summarizeTitleResult(main?.title), previous?.titleResult),
      coverResult: mergeSummaryResult(summarizeCoverResult(main?.cover), previous?.coverResult),
      elapsedMs: summary?.elapsedMs || previous?.elapsedMs || null,
      blockers: Array.isArray(evidence.checks) ? evidence.checks.filter((check) => check.tone === "error").length : 0,
      remoteImages: evidence.draft?.remoteImages || previous?.remoteImages || null,
      evidence
    };
  }

  function articleUrlForRecord({ target = {}, pageStatus = {}, articleId = null, previousUrl = null } = {}) {
    const candidates = [target.url, pageStatus.url, previousUrl].filter(Boolean);
    const editUrl = candidates.find((url) => /\/compose\/articles\/edit\//.test(String(url)));
    if (editUrl) return editUrl;
    if (articleId) return `https://x.com/compose/articles/edit/${encodeURIComponent(articleId)}`;
    return candidates.find((url) => /^https:\/\/(?:x|twitter)\.com\/compose\/articles/.test(String(url))) || null;
  }

  function formatRecordTarget(record) {
    if (record.articleId) return currentLanguage === "zh" ? `文章 ${record.articleId}` : `Article ${record.articleId}`;
    if (record.route === "editor") return currentLanguage === "zh" ? "已打开文章编辑器" : "Article editor open";
    if (record.route === "articles") return currentLanguage === "zh" ? "X 文章列表" : "X Articles list";
    if (record.route && record.route !== "none") return currentLanguage === "zh" ? `X 页面：${record.route}` : `X page: ${record.route}`;
    return currentLanguage === "zh" ? "还没有关联 X 文章" : "No X Article linked yet";
  }

  function formatRecordDraftStats(record) {
    const parts = [];
    if (record.blocks) parts.push(currentLanguage === "zh" ? `${record.blocks} 个内容块` : `${record.blocks} block(s)`);
    if (record.characters) parts.push(currentLanguage === "zh" ? `${record.characters} 字符` : `${record.characters} chars`);
    if (record.remoteImages?.count) {
      parts.push(currentLanguage === "zh" ? `${record.remoteImages.count} 张网页图片` : `${record.remoteImages.count} remote image(s)`);
    }
    return parts.join(", ") || (currentLanguage === "zh" ? "没有草稿统计" : "No draft stats");
  }

  function formatRecordImageText(record) {
    if (record.images.warnings) {
      return currentLanguage === "zh"
        ? `${record.images.ok} 张图片已上传，${record.images.warnings} 张保留为链接`
        : `${record.images.ok} image(s) uploaded, ${record.images.warnings} kept as links`;
    }
    if (record.images.ok || record.images.fail) {
      return currentLanguage === "zh"
        ? `${record.images.ok} 张图片已上传`
        : `${record.images.ok} image(s) uploaded`;
    }
    return currentLanguage === "zh" ? "还没有图片上传结果" : "No image upload result";
  }

  function recordHasMarkdown(record) {
    return Boolean(String(record?.markdown || record?.evidence?.draft?.markdown || "").trim());
  }

  function recordMarkdownText(record) {
    return String(record?.markdown || record?.evidence?.draft?.markdown || "");
  }

  function markdownMeaningfulLines(markdown) {
    const lines = String(markdown || "").replace(/\r\n?/g, "\n").split("\n");
    const filtered = [];
    let frontmatter = false;
    for (let index = 0; index < lines.length; index += 1) {
      const rawLine = lines[index];
      const line = rawLine.trim();
      if (frontmatter) {
        if (line === "---") frontmatter = false;
        continue;
      }
      if (line === "---" && index === 0) {
        frontmatter = true;
        continue;
      }
      if (!line || /^!\[[^\]]*]\([^)]+\)\s*$/.test(line)) continue;
      filtered.push(line.replace(/^#{1,6}\s+/, "").replace(/\s+/g, " "));
      if (filtered.length >= 4) break;
    }
    return filtered;
  }

  function truncateText(text, max = 160) {
    const normalized = String(text || "").replace(/\s+/g, " ").trim();
    if (normalized.length <= max) return normalized;
    return `${normalized.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
  }

  function recordDisplayTitle(record) {
    const title = String(record?.title || "").trim();
    if (title && title !== "Untitled draft") return title;
    const heading = markdownMeaningfulLines(recordMarkdownText(record))[0];
    if (heading) return truncateText(heading, 76);
    if (record?.source?.fileName) return record.source.fileName;
    return "Untitled Markdown";
  }

  function recordMarkdownPreview(record) {
    const markdown = recordMarkdownText(record);
    const preview = markdownMeaningfulLines(markdown).join(" ") || markdown.replace(/\r\n?/g, "\n").split("\n").find((line) => line.trim());
    return truncateText(preview, 180) || "No saved Markdown in this record.";
  }

  function formatRecordTime(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value || "";
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const dayDiff = Math.round((startOfToday - startOfDate) / 86400000);
    const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (dayDiff === 0) return currentLanguage === "zh" ? `今天 ${time}` : `Today ${time}`;
    if (dayDiff === 1) return currentLanguage === "zh" ? `昨天 ${time}` : `Yesterday ${time}`;
    return date.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  function recordRecoveryStats(record) {
    const items = [];
    if (record.characters) items.push(currentLanguage === "zh" ? `${record.characters} 字` : `${record.characters} chars`);
    if (record.blocks) items.push(currentLanguage === "zh" ? `${record.blocks} 块` : `${record.blocks} blocks`);
    if (record.remoteImages?.count) items.push(currentLanguage === "zh" ? `${record.remoteImages.count} 图` : `${record.remoteImages.count} images`);
    return items.slice(0, 3);
  }

  function recordSourceMeta(record, updatedTime) {
    const parts = [];
    const source = translateText(record?.source?.label || "Draft");
    if (source) parts.push(source);
    if (updatedTime) parts.push(updatedTime);
    if (record.url) parts.push(translateText("Linked page"));
    return parts.join(" · ");
  }

  function recordFileName(record) {
    return String(record?.source?.fileName || "").trim();
  }

  function recordHumanStatus(record) {
    if (record.kind === "import") return "Written to X";
    if (record.kind === "import-error") return "Import failed";
    if (record.kind === "draft-loaded") return "Loaded only";
    return record.status || recordKindLabel(record.kind);
  }

  function recordSearchText(record) {
    return [
      record.title,
      record.status,
      record.action,
      record.result,
      record.kind,
      record.articleId,
      record.route,
      record.url,
      record.source?.label,
      record.source?.fileName,
      formatRecordTarget(record),
      formatRecordDraftStats(record),
      formatRecordImageText(record),
      recordMarkdownText(record)
    ]
      .filter(Boolean)
      .join("\n")
      .toLowerCase();
  }

  function filteredRecordHistory() {
    const query = recordSearchQuery.trim().toLowerCase();
    if (!query) return recordHistory;
    const terms = query.split(/\s+/).filter(Boolean);
    return recordHistory.filter((record) => {
      const haystack = recordSearchText(record);
      return terms.every((term) => haystack.includes(term));
    });
  }

  function recordActionText(evidence) {
    const kind = String(evidence.kind || "");
    if (kind === "draft-loaded") return "Loaded Markdown";
    if (kind === "import") return "Wrote article";
    if (kind === "import-error") return "Tried to write article";
    if (kind === "preflight") return "Checked X article";
    if (kind === "preflight-blocked" || kind.includes("blocked")) return "Checked X article";
    if (kind.includes("remote-image")) return "Checked web images";
    return recordKindLabel(kind);
  }

  function recordResultText(evidence, stats = {}) {
    const kind = String(evidence.kind || "");
    if (kind === "draft-loaded") {
      const blocks = stats.blocks || evidence.draft?.blocks || 0;
      const characters = stats.characters || evidence.draft?.characters || 0;
      return blocks
        ? `${blocks} block(s), ${characters} character(s), ready to write.`
        : `${characters} character(s), ready to write.`;
    }
    if (kind === "import") {
      const warnings = Number(stats.warnings || 0);
      if (warnings) return `Written into X; ${warnings} image/media item(s) stayed as links.`;
      return "Written into X. Review it there before publishing.";
    }
    if (kind === "import-error") {
      return evidence.result?.error || "Write failed. Open details before retrying.";
    }
    if (kind === "preflight") {
      const blockers = Array.isArray(evidence.checks) ? evidence.checks.filter((check) => check.tone === "error").length : 0;
      return blockers ? `${blockers} blocker(s) found before writing.` : "X article is ready for writing.";
    }
    if (kind === "preflight-blocked" || kind.includes("blocked")) {
      return evidence.reason || "Blocked before writing. Open details for the fix.";
    }
    if (kind.includes("remote-image")) {
      const probe = evidence.draft?.remoteImages?.probe || remoteImageProbeStatus;
      return `${probe.ok || 0} ready, ${probe.fail || 0} will stay as Markdown links.`;
    }
    return "Saved.";
  }

  function recordSummaryItems(record) {
    const items = [];
    if (record.action) items.push(record.action);
    if (record.blocks) items.push(currentLanguage === "zh" ? `${record.blocks} 个块` : `${record.blocks} blocks`);
    if (record.remoteImages?.count) items.push(currentLanguage === "zh" ? `${record.remoteImages.count} 张网页图片` : `${record.remoteImages.count} web images`);
    if (record.articleId) items.push(currentLanguage === "zh" ? `文章 ${record.articleId}` : `Article ${record.articleId}`);
    else if (record.url) items.push(currentLanguage === "zh" ? "已记录网页地址" : "Page URL saved");
    return items.slice(0, 4);
  }

  function recordKindLabel(kind) {
    if (kind === "draft-loaded") return "Markdown loaded";
    if (kind === "import") return "Import completed";
    if (kind === "import-error") return "Import failed";
    if (kind === "preflight") return "Check result";
    if (kind === "preflight-blocked" || String(kind || "").includes("blocked")) return "Check blocked";
    if (String(kind || "").includes("remote-image")) return "Image handling";
    return kind || "Saved";
  }

  function recordStatusForEvidence(evidence) {
    if (evidence.kind === "draft-loaded") return "Ready to write";
    if (evidence.kind === "import") return "Written";
    if (evidence.kind === "import-error") return "Failed";
    if (evidence.kind === "preflight-blocked" || evidence.kind?.includes("blocked")) return "Blocked";
    if (evidence.kind === "preflight") {
      const blockers = Array.isArray(evidence.checks) ? evidence.checks.filter((check) => check.tone === "error").length : 0;
      return blockers ? "Check found blockers" : "Checked";
    }
    if (evidence.kind?.includes("remote-image")) return "Image check";
    return "Saved";
  }

  function recordToneForEvidence(evidence) {
    if (evidence.kind === "draft-loaded") return "ready";
    if (evidence.kind === "import") return "ok";
    if (evidence.kind === "import-error" || evidence.kind === "preflight-blocked" || evidence.kind?.includes("blocked")) return "error";
    if (evidence.kind?.includes("remote-image")) return evidence.kind.includes("check") && !evidence.kind.includes("blocked") ? "ok" : "warn";
    const blockers = Array.isArray(evidence.checks) ? evidence.checks.filter((check) => check.tone === "error").length : 0;
    return blockers ? "warn" : "ok";
  }

  function persistRecordHistory() {
    if (!hasChromeApi()) return;
    Promise.resolve(chrome.storage.local.set({ [STORAGE_RECORD_HISTORY]: recordHistory.map(recordStorageEntry) })).catch(() => {});
  }

  async function restoreRecordHistory() {
    if (!hasChromeApi()) {
      renderRecordHistory();
      return;
    }
    const stored = await chrome.storage.local.get(STORAGE_RECORD_HISTORY).catch(() => ({}));
    recordHistory = Array.isArray(stored[STORAGE_RECORD_HISTORY])
      ? stored[STORAGE_RECORD_HISTORY].slice(0, MAX_RECORD_HISTORY).map(normalizeStoredRecordHistoryEntry)
      : [];
    latestEvidence = recordHistory[0]?.evidence || latestEvidence;
    if (latestEvidence) {
      els.evidenceMeta.textContent = `${latestEvidence.kind} record saved at ${new Date(latestEvidence.capturedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
      els.evidenceText.textContent = JSON.stringify(latestEvidence, jsonSafeReplacer, 2);
      els.copyEvidence.disabled = false;
    }
    renderRecordHistory();
    updateProgressiveSections();
  }

  function normalizeStoredRecordHistoryEntry(record) {
    if (!record || typeof record !== "object") return record;
    const evidence = record.evidence || {};
    const normalizedEvidence = {
      ...evidence,
      id: evidence.id || record.id,
      draftRecordId: evidence.draftRecordId || record.draftRecordId || record.id,
      kind: evidence.kind || record.kind,
      capturedAt: evidence.capturedAt || record.capturedAt,
      updatedAt: evidence.updatedAt || record.updatedAt || record.capturedAt,
      source: evidence.source || record.source || null,
      draft: {
        ...(evidence.draft || {}),
        blocks: evidence.draft?.blocks || record.blocks || 0,
        characters: evidence.draft?.characters || record.characters || 0,
        markdown: evidence.draft?.markdown || record.markdown || "",
        markdownTruncated: Boolean(evidence.draft?.markdownTruncated || record.markdownTruncated),
        remoteImages: evidence.draft?.remoteImages || record.remoteImages || null
      },
      targetContext: evidence.targetContext || {}
    };
    const normalized = normalizeRecordHistoryEntry(normalizedEvidence, record);
    return {
      ...normalized,
      ...record,
      draftRecordId: record.draftRecordId || normalized.draftRecordId || evidence.draftRecordId || record.id,
      draftFingerprint: record.draftFingerprint || normalized.draftFingerprint || evidence.draftFingerprint || null,
      updatedAt: record.updatedAt || normalized.updatedAt,
      action: record.action || normalized.action,
      result: record.result || normalized.result,
      source: record.source || normalized.source,
      markdown: record.markdown || normalized.markdown || "",
      markdownTruncated: Boolean(record.markdownTruncated || normalized.markdownTruncated),
      blocks: record.blocks || normalized.blocks,
      characters: record.characters || normalized.characters,
      url: record.url || normalized.url,
      titleResult: record.titleResult || normalized.titleResult || "Not run",
      coverResult: record.coverResult || normalized.coverResult || "Not run",
      evidence: normalizedEvidence
    };
  }

  function renderRecordHistory() {
    if (!els.recordHistoryList) return;
    const recoverableRecords = recordHistory.filter(recordHasMarkdown);
    const total = recoverableRecords.length;
    const visibleRecords = filteredRecordHistory().filter(recordHasMarkdown);
    const visibleTotal = visibleRecords.length;
    const isSearching = Boolean(recordSearchQuery.trim());
    if (els.recordHistory) els.recordHistory.hidden = false;
    if (els.recordHistoryMeta) {
      els.recordHistoryMeta.textContent = total
        ? currentLanguage === "zh"
          ? isSearching
            ? `找到 ${visibleTotal} 条`
            : `${total} 条草稿`
          : isSearching
            ? `${visibleTotal} found`
            : `${total} draft(s)`
        : currentLanguage === "zh"
          ? "还没有草稿"
          : "No drafts";
    }
    if (els.recordSearchInput && els.recordSearchInput.value !== recordSearchQuery) {
      els.recordSearchInput.value = recordSearchQuery;
    }
    if (els.recordSearchSummary) {
      const searchSummary = total
      ? isSearching
        ? currentLanguage === "zh"
          ? `找到 ${visibleTotal} 条`
          : `${visibleTotal} found`
        : ""
      : "Paste or load Markdown to save the first recoverable draft.";
      els.recordSearchSummary.dataset.i18n = searchSummary;
      els.recordSearchSummary.textContent = searchSummary;
    }
    if (els.clearRecordHistory) els.clearRecordHistory.disabled = recordHistory.length === 0;
    if (!recordHistory.length) closeRecordClearConfirm();
    if (!total) {
      syncRecordEditSheet();
      els.recordHistoryList.innerHTML = `<li class="record-history-empty">Paste or load Markdown to save the first recoverable draft.</li>`;
      syncRecordPanel();
      return;
    }
    if (!visibleTotal) {
      syncRecordEditSheet();
      els.recordHistoryList.innerHTML = `
        <li class="record-history-empty">
          <strong>No records match this search.</strong>
          <span>Clear the search or try a title, file name, URL, or Markdown phrase.</span>
        </li>
      `;
      syncRecordPanel();
      return;
    }
    els.recordHistoryList.innerHTML = visibleRecords.map(renderRecordHistoryItem).join("");
    translateDynamicDom(els.recordHistory);
    syncRecordEditSheet();
    syncRecordPanel();
  }

  function renderRecordHistoryItem(record) {
    const safe = shared.escapeHtml;
    const updatedTime = formatRecordTime(record.updatedAt || record.capturedAt);
    const summaryItems = recordRecoveryStats(record);
    const summaryHtml = summaryItems.length
      ? `<span class="record-summary">${summaryItems.map((item) => `<span>${safe(item)}</span>`).join("")}</span>`
      : "";
    const displayTitle = recordDisplayTitle(record);
    const preview = recordMarkdownPreview(record);
    const articleUrl = record.url || "";
    const recordState = recordHumanStatus(record);
    const metaText = recordSourceMeta(record, updatedTime);
    const fileName = recordFileName(record);
    const fileNameHtml = fileName ? `<span class="record-file-name">${safe(fileName)}</span>` : "";
    const linkAction = articleUrl
      ? `<a class="record-icon-action" href="${safe(articleUrl)}" target="_blank" rel="noopener noreferrer" title="${safe("Open linked page")}" aria-label="${safe("Open linked page")}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6h-2V7.4l-7.3 7.3-1.4-1.4L16.6 6H14V4ZM5 6h7v2H7v9h9v-5h2v7H5V6Z"/></svg>
        </a>`
      : "";
    return `
      <li class="record-history-item" data-tone="${safe(record.tone)}" data-record-id="${safe(record.id)}" tabindex="0" aria-label="${safe("Edit this saved Markdown.")}">
        <article class="record-draft-card">
          <header class="record-draft-head">
            <div class="record-title">
              <strong>${safe(displayTitle)}</strong>
              ${fileNameHtml}
              <em>${safe(metaText || "Saved Markdown")}</em>
            </div>
            <span class="record-status">${safe(recordState)}</span>
          </header>
          <p class="record-draft-preview">${safe(preview)}</p>
          <div class="record-actions">
            <div class="record-action-main">
              <button class="record-use-button" type="button" data-record-action="restore" data-record-id="${safe(record.id)}" title="${safe("Use this saved Markdown in Pending.")}">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v2H5V4Zm0 4h8v2H5V8Zm0 4h7v2H5v-2Zm11 1V8h2v5h3l-4 4-4-4h3Zm-3 6h8v2h-8v-2Z"/></svg>
                <span>${safe("Use")}</span>
              </button>
              ${summaryHtml}
            </div>
            <div class="record-action-icons" aria-label="${safe("Record actions")}">
              <button class="record-icon-action" type="button" data-record-action="copy-markdown" data-record-id="${safe(record.id)}" title="${safe("Copy this saved Markdown.")}" aria-label="${safe("Copy this saved Markdown.")}">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7h10v13H8V7Zm2 2v9h6V9h-6ZM5 4h10v2H7v10H5V4Z"/></svg>
              </button>
              <button class="record-icon-action" type="button" data-record-action="edit" data-record-id="${safe(record.id)}" title="${safe("Edit this saved Markdown.")}" aria-label="${safe("Edit this saved Markdown.")}">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.8 4.2a2.9 2.9 0 0 1 4.1 4.1L9.7 18.5 5 19l.5-4.7L15.8 4.2Zm1.4 1.4L7.4 15.4l-.2 1.4 1.4-.2 9.8-9.8a.9.9 0 0 0-1.2-1.2Z"/></svg>
              </button>
              ${linkAction}
            </div>
          </div>
        </article>
      </li>
    `;
  }

  async function clearRecordHistory() {
    closeRecordClearConfirm();
    recordHistory = [];
    latestEvidence = null;
    activeDraftRecordId = null;
    activeDraftFingerprint = null;
    activeDraftFinalized = false;
    activeRecordEditorId = null;
    window.clearTimeout(draftInputHistoryTimer);
    if (hasChromeApi()) await chrome.storage.local.remove(STORAGE_RECORD_HISTORY).catch(() => {});
    els.evidenceMeta.textContent = "No technical record saved yet.";
    els.evidenceText.textContent = "Run Check article or Write article to save a technical record.";
    els.copyEvidence.disabled = true;
    renderRecordHistory();
    updateProgressiveSections();
    log("Records cleared.");
  }

  function openRecordClearConfirm() {
    if (!els.recordClearConfirm || !els.clearRecordHistory || els.clearRecordHistory.disabled) return;
    els.recordClearConfirm.hidden = false;
    els.clearRecordHistory.setAttribute("aria-expanded", "true");
    translateDynamicDom(els.recordClearConfirm);
    window.setTimeout(() => els.confirmRecordClear?.focus?.(), 0);
  }

  function closeRecordClearConfirm() {
    if (els.recordClearConfirm) els.recordClearConfirm.hidden = true;
    if (els.clearRecordHistory) els.clearRecordHistory.setAttribute("aria-expanded", "false");
  }

  function toggleRecordClearConfirm() {
    if (!els.recordClearConfirm || els.recordClearConfirm.hidden) openRecordClearConfirm();
    else closeRecordClearConfirm();
  }

  function handleRecordClearDismiss(event) {
    if (els.recordClearConfirm?.hidden) return;
    if (event.key && event.key !== "Escape") return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeRecordClearConfirm();
      els.clearRecordHistory?.focus?.();
      return;
    }
    const target = event.target;
    if (target === els.clearRecordHistory || els.recordClearConfirm?.contains(target)) return;
    closeRecordClearConfirm();
  }

  function restoreRecordMarkdown(recordId) {
    const record = currentRecord(recordId);
    const markdown = recordMarkdownText(record);
    if (!markdown.trim()) {
      log("Markdown snapshot not available.");
      return;
    }
    restoreRecordMarkdownText(record, markdown, "Markdown restored to Pending.");
  }

  function restoreRecordMarkdownText(record, markdown, message = "Markdown restored to Pending.") {
    if (!markdown.trim()) {
      log("Markdown snapshot not available.");
      return;
    }
    const fileName = record?.source?.fileName || null;
    if (queueModeActive()) {
      const item = addDraftToQueue(markdown, {
        source: "restored",
        fileName,
        statusTitle: "Markdown restored",
        logMessage: "",
        remember: false
      });
      if (!item) return;
      rememberDraftHistory("restored", {
        forceNew: true,
        sourceRecordId: record?.id || null,
        fileName,
        queueItemId: item.id,
        size: markdown.length
      });
    } else {
      setSingleDraftMarkdown(markdown, {
        source: "restored",
        fileName,
        statusTitle: "Markdown restored",
        remember: false
      });
      rememberDraftHistory("restored", {
        forceNew: true,
        sourceRecordId: record?.id || null,
        fileName,
        size: markdown.length
      });
    }
    showWorkspacePanel("draft");
    setActiveJump("draft");
    log(message);
  }

  async function copyMarkdownText(markdown, { fallbackRecordId = null, success = "Markdown copied.", fallback = "Markdown is open in the editor." } = {}) {
    if (!markdown.trim()) {
      log("Markdown snapshot not available.");
      return;
    }
    try {
      await navigator.clipboard.writeText(markdown);
      log(success);
    } catch {
      if (fallbackRecordId) openRecordEditor(fallbackRecordId);
      log(fallback);
    }
  }

  async function copyRecordMarkdown(recordId) {
    const record = currentRecord(recordId);
    await copyMarkdownText(recordMarkdownText(record), { fallbackRecordId: recordId });
  }

  function syncRecordEditSheet() {
    if (!els.recordEditSheet) return;
    if (activeDraftEditor?.mode && activeDraftEditor.mode !== "record") return;
    const record = currentRecord(activeRecordEditorId);
    if (!record) {
      setMarkdownEditorOpen(false);
      if (els.recordEditTextarea) els.recordEditTextarea.value = "";
      activeDraftEditor = null;
      return;
    }
    const updatedTime = formatRecordTime(record.updatedAt || record.capturedAt);
    configureMarkdownEditor({
      title: recordDisplayTitle(record),
      meta: recordSourceMeta(record, updatedTime) || "Saved Markdown",
      value: recordMarkdownText(record),
      primaryLabel: "Use draft",
      mode: "record",
      id: record.id
    });
  }

  function openRecordEditor(recordId) {
    activeRecordEditorId = recordId;
    syncRecordEditSheet();
  }

  function closeRecordEditor() {
    activeRecordEditorId = null;
    activeDraftEditor = null;
    syncRecordEditSheet();
  }

  function openNewDraftEditor() {
    focusMarkdownInput();
  }

  function openQueueEditor(queueId) {
    const item = draftQueue.find((entry) => entry.id === queueId);
    if (!item) return;
    configureMarkdownEditor({
      title: item.title || item.fileName || "Queued Markdown",
      meta: [item.fileName, `${Number(item.characters || 0).toLocaleString()} chars`, queueStatusLabel(item)].filter(Boolean).join(" · "),
      value: item.markdown,
      primaryLabel: "Save only",
      mode: "queue",
      id: item.id
    });
  }

  function closeMarkdownEditor() {
    activeRecordEditorId = null;
    activeDraftEditor = null;
    if (els.recordEditTextarea) {
      els.recordEditTextarea.value = "";
      els.recordEditTextarea.dataset.editorMode = "";
      els.recordEditTextarea.dataset.recordId = "";
      els.recordEditTextarea.dataset.queueId = "";
    }
    if (els.recordEditWriteButton) els.recordEditWriteButton.hidden = true;
    setMarkdownEditorOpen(false);
  }

  async function copyEditedMarkdown() {
    const edited = recordEditorTextarea()?.value || "";
    await copyMarkdownText(edited, {
      fallbackRecordId: activeDraftEditor?.mode === "record" ? activeDraftEditor.id : null,
      success: "Edited Markdown copied.",
      fallback: "Markdown is open in the editor."
    });
  }

  function saveEditedMarkdown() {
    const edited = recordEditorTextarea()?.value || "";
    if (!edited.trim()) {
      log("Markdown snapshot not available.");
      return;
    }
    const fallbackMode = els.recordEditTextarea?.dataset.editorMode || "";
    const fallbackId = fallbackMode === "queue"
      ? els.recordEditTextarea?.dataset.queueId
      : els.recordEditTextarea?.dataset.recordId;
    const editor = activeDraftEditor || { mode: fallbackMode, id: fallbackId };
    if (editor.mode === "record") {
      const record = currentRecord(editor.id || activeRecordEditorId);
      restoreRecordMarkdownText(record, edited, "Edited Markdown restored to Pending.");
    } else if (editor.mode === "queue") {
      updateQueueItemMarkdown(editor.id, edited);
      log("Queued Markdown updated.");
    } else {
      setSingleDraftMarkdown(edited, {
        source: "typed",
        statusTitle: "Markdown updated",
        logMessage: "Markdown draft updated."
      });
    }
    closeMarkdownEditor();
  }

  async function writeEditedMarkdown() {
    const edited = recordEditorTextarea()?.value || "";
    if (!edited.trim()) {
      log("Markdown snapshot not available.");
      return;
    }
    const editor = activeDraftEditor || {
      mode: els.recordEditTextarea?.dataset.editorMode || "",
      id: els.recordEditTextarea?.dataset.queueId || ""
    };
    if (editor.mode !== "queue" || !editor.id) return;
    if (!updateQueueItemMarkdown(editor.id, edited)) return;
    closeMarkdownEditor();
    await importQueueItem(editor.id);
  }

  function recordEditorTextarea() {
    return els.recordEditTextarea || null;
  }

  async function handleRecordHistoryClick(event) {
    const button = event.target.closest("button[data-record-action]");
    if (!button) {
      const recordItem = editableRecordItemFromEvent(event);
      if (recordItem) openRecordEditor(recordItem.dataset.recordId);
      return;
    }
    const action = button.dataset.recordAction;
    const recordId = button.dataset.recordId || activeRecordEditorId;
    if (action === "restore") {
      restoreRecordMarkdown(recordId);
    } else if (action === "edit") {
      openRecordEditor(recordId);
    } else if (action === "cancel-edit") {
      closeMarkdownEditor();
    } else if (action === "use-edited") {
      saveEditedMarkdown();
    } else if (action === "write-edited") {
      await writeEditedMarkdown();
    } else if (action === "copy-edited") {
      await copyEditedMarkdown();
    } else if (action === "copy-markdown") {
      await copyRecordMarkdown(recordId);
    }
  }

  async function handleMarkdownEditorClick(event) {
    const button = event.target.closest("button[data-record-action]");
    if (!button) return;
    const action = button.dataset.recordAction;
    if (action === "cancel-edit") {
      closeMarkdownEditor();
    } else if (action === "use-edited") {
      saveEditedMarkdown();
    } else if (action === "write-edited") {
      await writeEditedMarkdown();
    } else if (action === "copy-edited") {
      await copyEditedMarkdown();
    }
  }

  function editableRecordItemFromEvent(event) {
    const item = event.target.closest(".record-history-item[data-record-id]");
    if (!item || !els.recordHistory?.contains(item)) return null;
    if (event.target.closest("button, a, input, textarea, select, summary, details")) return null;
    return item;
  }

  function handleRecordHistoryDblClick(event) {
    const recordItem = editableRecordItemFromEvent(event);
    if (recordItem) openRecordEditor(recordItem.dataset.recordId);
  }

  function handleRecordHistoryKeydown(event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    const item = event.target.closest(".record-history-item[data-record-id]");
    if (!item || event.target !== item) return;
    event.preventDefault();
    openRecordEditor(item.dataset.recordId);
  }

  function buildProofDeckEvidence(checks = null, gate = null) {
    const resolvedChecks = checks || buildPreflightChecks();
    const byId = new Map(resolvedChecks.map((check) => [check.id, check]));
    const resolvedGate = gate || getImportGate(resolvedChecks);
    const liveResult = buildLiveResultEvidence();
    const hasImportEvidence = Boolean(latestEvidence?.kind?.startsWith("import"));
    const targetReady = byId.get("target")?.tone === "ok";
    const needsRemote = remoteHttpImageSegments(latestParsed).length > 0;
    const hasDraftRecord = Boolean(recordHistory.find(recordHasMarkdown) || recordHasMarkdown(latestEvidence));
    const importSucceeded = latestEvidence?.kind === "import";
    const importFailed = latestEvidence?.kind === "import-error";
    const recordTitle = recordDisplayTitle(recordHistory.find(recordHasMarkdown) || normalizeRecordHistoryEntry(latestEvidence || {}, {}));
    const linkedArticle = latestEvidence?.targetContext?.articleId || latestPageStatus?.targetContext?.articleId || latestPageStatus?.articleId || "";
    const items = [
      {
        id: "draft",
        label: "Draft saved",
        tone: hasDraftRecord || byId.get("draft")?.tone === "ok" ? "ok" : "idle",
        detail: hasDraftRecord
          ? `${recordTitle || "Markdown draft"} is recoverable from Records.`
          : byId.get("draft")?.tone === "ok"
            ? `${latestParsed?.segments?.length || 0} draft part(s) loaded.`
            : "Load Markdown to create a recoverable draft record."
      },
      {
        id: "article",
        label: "X Article",
        tone: targetReady || linkedArticle ? "ok" : byId.get("draft")?.tone === "ok" ? "warn" : "idle",
        detail: linkedArticle
          ? `Linked to article ${linkedArticle}.`
          : targetReady
            ? "Current X Article is ready for this draft."
            : "Open or create the X Article you want to fill."
      },
      {
        id: "result",
        label: "Write result",
        tone: importSucceeded ? "ok" : importFailed ? "error" : resolvedGate.ok ? "ready" : "idle",
        detail: importSucceeded
          ? needsRemote
            ? "Article was written. Web image links that could not download stayed as links."
            : "Article was written into X. Review it there before publishing."
          : importFailed
            ? latestEvidence?.result?.error || "Last write failed. Open technical details if you need the exact error."
            : resolvedGate.ok
              ? "Ready to write into X."
              : resolvedGate.message
      },
      {
        id: "next",
        label: "Next step",
        tone: liveResult.complete ? "ok" : hasImportEvidence ? "warn" : resolvedGate.ok ? "ready" : "idle",
        detail: liveResult.complete
          ? "Review is recorded. You can copy this summary or save the full record."
          : hasImportEvidence
            ? `${liveResult.checked}/${liveResult.total} article review checks recorded. Finish reviewing in X.`
            : resolvedGate.ok
              ? "Click Write article when the target article is correct."
              : "Fix the current blocker, then run Check article again."
      }
    ];
    return {
      extensionPath: EXTENSION_PATH,
      loadedUnpacked: hasChromeApi(),
      complete: importSucceeded && liveResult.complete,
      items
    };
  }

  function updateProofDeck(checks = null, gate = null) {
    if (!els.proofDeckList) return;
    const proof = buildProofDeckEvidence(checks, gate);
    const ready = proof.items.filter((item) => item.tone === "ok" || item.tone === "ready").length;
    els.proofDeckMeta.textContent = proof.complete
      ? "Article review is recorded. Keep this summary or save the full record."
      : `${ready}/${proof.items.length} publish steps ready.`;
    if (els.extensionPath) els.extensionPath.textContent = proof.extensionPath;
    for (const item of proof.items) {
      const row = els.proofDeckList.querySelector(`[data-proof="${item.id}"]`);
      if (!row) continue;
      row.dataset.tone = item.tone;
      row.querySelector("strong").textContent = item.label;
      row.querySelector("span").textContent = item.detail;
    }
    translateDynamicDom(els.proofDeckList.closest("section"));
  }

  function buildCompletionAuditEvidence(checks = null, gate = null) {
    const resolvedChecks = checks || buildPreflightChecks();
    const byId = new Map(resolvedChecks.map((check) => [check.id, check]));
    const resolvedGate = gate || getImportGate(resolvedChecks);
    const liveResult = buildLiveResultEvidence();
    const proof = buildProofDeckEvidence(resolvedChecks, resolvedGate);
    const hasImportEvidence = Boolean(latestEvidence?.kind?.startsWith("import"));
    const importSucceeded = latestEvidence?.kind === "import";
    const importFailed = latestEvidence?.kind === "import-error";
    const pageImport = liveResult.items.find((item) => item.id === "page-import");
    const bridgeReady = byId.get("bridge")?.tone === "ok";
    const uploadsReady = byId.get("uploads")?.tone === "ok";
    const targetReady = byId.get("target")?.tone === "ok";
    const draftReady = byId.get("draft")?.tone === "ok";
    const needsRemote = remoteHttpImageSegments(latestParsed).length > 0;
    const packageReady = proof.complete || (liveResult.complete && hasImportEvidence);

    const items = [
      {
        id: "extension",
        label: "Extension loaded",
        tone: proof.loadedUnpacked ? "ok" : "warn",
        detail: proof.loadedUnpacked
          ? "Side panel is running from the extension context."
          : "Load xPoster as an unpacked extension in signed-in Chrome."
      },
      {
        id: "draft",
        label: "Markdown draft",
        tone: draftReady ? "ok" : "error",
        detail: draftReady
          ? `${latestParsed?.segments?.length || 0} publishable block(s) loaded.`
          : "Add a draft or load the example before checking X."
      },
      {
        id: "target",
        label: "X Article",
        tone: targetReady ? "ok" : draftReady ? "warn" : "error",
        detail: targetReady
          ? latestPageStatus?.hasEditor
            ? "Active tab is an X Article editor."
            : "Active tab is X Articles; create or open a draft."
          : "Open x.com/compose/articles in the active tab."
      },
      {
        id: "bridge-upload",
        label: "Editor and images",
        tone: bridgeReady && uploadsReady ? "ok" : latestDiagnostics ? "error" : "warn",
        detail: bridgeReady && uploadsReady
          ? "xPoster can reach the editor and upload media."
          : latestDiagnostics
            ? "The check found an editor or upload blocker."
            : "Click Check article after the X Article editor is visible."
      },
      {
        id: "remote-images",
        label: "Web images",
        tone: "ok",
        detail: needsRemote
          ? "xPoster tries web images during Write; unreachable images stay as links."
          : "No web image links in this draft."
      },
      {
        id: "import",
        label: "Import completed",
        tone: importSucceeded ? "ok" : importFailed ? "error" : resolvedGate.ok ? "ready" : "idle",
        detail: importSucceeded
          ? "Successful import record is saved."
          : importFailed
            ? "Last import produced a failure record."
            : resolvedGate.ok
              ? "Ready to import; run Import."
              : resolvedGate.message
      },
      {
        id: "result",
        label: "Article reviewed",
        tone: liveResult.complete ? "ok" : hasImportEvidence ? "warn" : "idle",
        detail: liveResult.complete
          ? "All final X Article checks are recorded."
          : `${liveResult.checked}/${liveResult.total} article review checks recorded.`
      },
      {
        id: "page-import",
        label: "Markdown file import",
        tone: pageImport?.checked ? "ok" : hasImportEvidence ? "warn" : "idle",
        detail: pageImport?.checked
          ? "Markdown file picker path verified."
          : "Verify the file picker can import a Markdown draft."
      },
      {
        id: "package",
        label: "Saved records",
        tone: packageReady ? "ready" : "idle",
        detail: packageReady
          ? "Copy or save the final records."
          : "Needs an import record and a complete article review."
      }
    ];

    const proven = items.filter((item) => item.tone === "ok" || item.tone === "ready").length;
    const blocked = items.filter((item) => item.tone === "error").length;
    const pending = items.length - proven - blocked;
    return {
      complete: proven === items.length,
      proven,
      blocked,
      pending,
      total: items.length,
      items
    };
  }

  function updateCompletionAudit(checks = null, gate = null) {
    if (!els.completionAuditList) return;
    const audit = buildCompletionAuditEvidence(checks, gate);
    els.completionAuditMeta.textContent = audit.complete
      ? "All completion records are ready."
      : audit.blocked
        ? `${audit.blocked} thing(s) to fix, ${audit.proven}/${audit.total} ready`
        : `${audit.pending} item(s) waiting, ${audit.proven}/${audit.total} ready`;
    for (const item of audit.items) {
      const row = els.completionAuditList.querySelector(`[data-audit="${item.id}"]`);
      if (!row) continue;
      row.dataset.tone = item.tone;
      row.querySelector("strong").textContent = item.label;
      row.querySelector("span").textContent = item.detail;
    }
    translateDynamicDom(els.completionAuditList.closest("section"));
  }

  function jsonSafeReplacer(key, value) {
    if (key === "handle") return "[FileSystemHandle]";
    if (typeof value === "function") return "[Function]";
    return value;
  }

  async function copyEvidence() {
    if (!latestEvidence) return;
    const text = JSON.stringify(latestEvidence, jsonSafeReplacer, 2);
    try {
      await navigator.clipboard.writeText(text);
      log("Record copied.");
    } catch {
      els.evidenceText.focus?.();
      log("Record is ready in the panel.");
    }
  }

  async function copyEvidencePackage() {
    const pack = buildEvidencePackage("copy");
    const text = JSON.stringify(pack, jsonSafeReplacer, 2);
    els.evidenceMeta.textContent = "Record package generated";
    els.evidenceText.textContent = text;
    try {
      await navigator.clipboard.writeText(text);
      log("Record package copied.");
    } catch {
      log("Record package is ready in the panel.");
    }
  }

  async function copyExtensionPath() {
    try {
      await navigator.clipboard.writeText(EXTENSION_PATH);
      log("Extension path copied.");
    } catch {
      log(`Extension path: ${EXTENSION_PATH}`);
    }
  }

  function buildPublishRecordSummary() {
    const proof = buildProofDeckEvidence();
    const lines = [
      "xPoster publish record",
      `Captured: ${new Date().toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}`,
      ""
    ];
    for (const item of proof.items) {
      lines.push(`${item.label}: ${item.detail}`);
    }
    if (latestEvidence?.targetContext?.url || latestPageStatus?.url) {
      lines.push("", `X page: ${latestEvidence?.targetContext?.url || latestPageStatus.url}`);
    }
    return lines.join("\n");
  }

  async function copyProofDeck() {
    const text = buildPublishRecordSummary();
    try {
      await navigator.clipboard.writeText(text);
      log("Publish summary copied.");
    } catch {
      els.evidenceMeta.textContent = "Publish summary generated";
      els.evidenceText.textContent = text;
      log("Publish summary is ready in the panel.");
    }
  }

  function downloadEvidencePackage() {
    const pack = buildEvidencePackage("download");
    const text = JSON.stringify(pack, jsonSafeReplacer, 2);
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const link = document.createElement("a");
    link.href = url;
    link.download = `xposter-evidence-${stamp}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    log("Record package saved.");
  }

  async function runNextAction() {
    switch (currentNextAction?.action) {
      case "addDraft":
        openNewDraftEditor();
        break;
      case "loadSmoke":
        await loadSmokeFixture();
        break;
      case "loadFile":
        loadFile();
        break;
      case "openArticles":
        await openArticles();
        break;
      case "refreshXTab":
        await refreshActiveXTab();
        break;
      case "check":
        await runPreflight();
        break;
      case "chooseVault":
        await chooseVault();
        break;
      case "import":
        await primeSuccessAudio();
        await importDraft();
        break;
      case "liveResult":
        scrollTargetIntoView(els.liveResultList, "center");
        setActiveJump("verify");
        log("Review the article checklist.");
        break;
      case "package":
        await copyEvidencePackage();
        jumpToSection("evidence");
        break;
      case "preview":
        jumpToSection("preview");
        break;
      default:
        log("No next action available.");
    }
  }

  async function runRunbookAction(action) {
    switch (action) {
      case "addDraft":
        openNewDraftEditor();
        break;
      case "loadSmoke":
        await loadSmokeFixture();
        break;
      case "loadFile":
        loadFile();
        break;
      case "openArticles":
        await openArticles();
        break;
      case "refreshXTab":
        await refreshActiveXTab();
        break;
      case "check":
        await runPreflight();
        break;
      case "import":
        await importDraft();
        break;
      case "liveResult":
        scrollTargetIntoView(els.liveResultList, "center");
        setActiveJump("verify");
        log("Review the article checklist.");
        break;
      case "package":
        await copyEvidencePackage();
        jumpToSection("evidence");
        break;
      case "preview":
        jumpToSection("preview");
        break;
      case "evidence":
        jumpToSection("evidence");
        break;
      default:
        log("No runbook action available.");
    }
  }

  if (typeof chrome !== "undefined" && chrome.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((message) => {
      handleExtensionEvent(message);
    });
  }
  window.addEventListener("xposter:sidepanel-event", (event) => {
    handleExtensionEvent({ type: "xposter:event", event: event.detail?.event, payload: event.detail?.payload || {} });
  });

  els.markdown.addEventListener("input", () => {
    scheduleSaveDraft();
    scheduleAnalyzeDraft();
    syncActiveQueueWithDraft();
    if (suppressNextTypedHistory) {
      suppressNextTypedHistory = false;
      return;
    }
    scheduleDraftHistory("typed");
  });
  els.markdown.addEventListener("paste", () => {
    suppressNextTypedHistory = true;
    window.clearTimeout(draftInputHistoryTimer);
    window.setTimeout(() => {
      saveDraft();
      analyzeDraftNow();
      window.clearTimeout(draftInputHistoryTimer);
      rememberDraftHistory("paste", { forceNew: true });
      acknowledgeDraftInput();
    }, 0);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushDraftSave();
  });
  window.addEventListener("pagehide", flushDraftSave);
  els.importDraft.addEventListener("click", runImportButtonAction);
  els.cancelImport?.addEventListener("click", cancelImport);
  els.pageState?.addEventListener("click", async () => {
    if (els.pageState.dataset.pageAction === "openArticles") await openArticles();
  });
  els.nextActionButton?.addEventListener("click", runNextAction);
  els.dockCheck.addEventListener("click", runPreflight);
  els.dockImport.addEventListener("click", runImportButtonAction);
  els.dockEvidence.addEventListener("click", () => jumpToSection("evidence"));
  els.openArticles.addEventListener("click", openArticles);
  els.runPreflight.addEventListener("click", runPreflight);
  els.loadFile.addEventListener("click", loadFile);
  els.draftDropDismiss?.addEventListener("click", dismissDraftDropStatus);
  els.loadSmoke?.addEventListener("click", loadSmokeFixture);
  els.pickVault.addEventListener("click", chooseVault);
  els.pickVaultSettings.addEventListener("click", chooseVault);
  els.clearVault.addEventListener("click", clearVault);
  els.clearVaultSettings.addEventListener("click", clearVault);
  els.copyEvidence.addEventListener("click", copyEvidence);
  els.copyEvidencePackage.addEventListener("click", copyEvidencePackage);
  els.downloadEvidencePackage.addEventListener("click", downloadEvidencePackage);
  els.copyExtensionPath.addEventListener("click", copyExtensionPath);
  els.copyProofDeck.addEventListener("click", copyProofDeck);
  els.resetLiveResult.addEventListener("click", resetLiveResultChecks);
  els.clearRecordHistory?.addEventListener("click", toggleRecordClearConfirm);
  els.cancelRecordClear?.addEventListener("click", closeRecordClearConfirm);
  els.confirmRecordClear?.addEventListener("click", clearRecordHistory);
  document.addEventListener("click", handleRecordClearDismiss, true);
  document.addEventListener("keydown", handleRecordClearDismiss, true);
  els.recordSearchInput?.addEventListener("input", () => {
    recordSearchQuery = els.recordSearchInput.value || "";
    closeRecordClearConfirm();
    scheduleRecordHistoryRender();
  });
  els.recordHistory?.addEventListener("click", handleRecordHistoryClick);
  els.recordHistory?.addEventListener("dblclick", handleRecordHistoryDblClick);
  els.recordHistory?.addEventListener("keydown", handleRecordHistoryKeydown);
  els.addDraft?.addEventListener("click", openNewDraftEditor);
  els.draftQueueList?.addEventListener("click", handleDraftQueueClick);
  els.recordEditSheet?.addEventListener("click", (event) => {
    if (event.target === els.recordEditSheet) closeMarkdownEditor();
  });
  els.recordEditSheet?.addEventListener("click", handleMarkdownEditorClick);
  els.recordEditSheet?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMarkdownEditor();
    }
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      saveEditedMarkdown();
    }
  });
  els.focusRunbook.addEventListener("click", () => {
    jumpToSection("verify");
    log("Live verification runbook focused.");
  });
  els.languageSelect?.addEventListener("change", () => {
    setLanguage(els.languageSelect.value);
  });
  els.themeChoice?.addEventListener("change", (event) => {
    const input = event.target.closest('input[name="themeMode"]');
    if (input) setTheme(input.value);
  });
  els.metadataOptions?.addEventListener("change", () => {
    setImportOptions({
      setTitle: els.importTitleOption?.checked !== false,
      setCover: els.importCoverOption?.checked !== false
    });
  });
  els.articleExportOptions?.addEventListener("change", () => {
    setArticleExportOptions({
      ...articleExportOptions,
      enabled: els.articleExportOption?.checked !== false
    });
  });
  els.successFeedbackOptions?.addEventListener("change", () => {
    setSuccessFeedbackOptions({
      confetti: els.confettiOption?.checked !== false,
      sound: els.successSoundOption?.checked !== false,
      soundStyle: els.successSoundStyle?.value || "soft",
      volume: Number(els.successSoundVolume?.value || Math.round(SUCCESS_SOUND_DEFAULT_VOLUME * 100)) / 100
    });
  });
  els.successSoundStyle?.addEventListener("change", () => {
    setSuccessFeedbackOptions({
      ...successFeedbackOptions,
      soundStyle: els.successSoundStyle.value || "soft"
    });
  });
  els.successSoundVolume?.addEventListener("input", () => {
    setSuccessFeedbackOptions({
      ...successFeedbackOptions,
      volume: Number(els.successSoundVolume.value || Math.round(SUCCESS_SOUND_DEFAULT_VOLUME * 100)) / 100
    });
  });
  els.testSuccessFeedback?.addEventListener("click", testSuccessFeedback);
  els.liveRunbookList.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-runbook-action]");
    if (!button) return;
    await runRunbookAction(button.dataset.runbookAction);
  });
  els.issueQueueList?.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-issue-action]");
    if (!button) return;
    await runRunbookAction(button.dataset.issueAction);
  });
  els.recoveryList?.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-recovery-action]");
    if (!button) return;
    await runRunbookAction(button.dataset.recoveryAction);
  });
  els.dockJumps?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-jump-target]");
    if (!button) return;
    jumpToSection(button.dataset.jumpTarget);
  });
  getLiveResultItems().forEach((input) => input.addEventListener("change", saveLiveResultChecks));
  syncPanelLayout();
  installDraftStorageSync();
  installDraftDropTray();
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      showWorkspacePanel(tab.dataset.tab);
      setActiveJump(tab.dataset.tab);
    });
  });

  restoreDraftQueue().then(() => restoreDraft());
  restoreVaultState();
  restoreRecordHistory();
  restoreLiveResultChecks();
  restoreTheme();
  restoreImportOptions();
  restoreArticleExportOptions();
  restoreSuccessFeedbackOptions();
  installSystemThemeSync();
  updateLiveProgress();
  refreshPageState();
  restoreLanguage();
  window.setInterval(refreshPageState, 2500);
})();
