(() => {
  const shared = window.xPosterShared;
  const i18n = window.xPosterI18n;
  const IMPORT_ICON_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v3H4V4Zm0 5h10v3H4V9Zm0 5h8v3H4v-3Zm13.5-.7V9h2v4.3l1.6-1.6 1.4 1.4-3.5 3.5-3.5-3.5 1.4-1.4 1.6 1.6ZM17 18h5v2h-5v-2Z"/></svg>';
  const els = {
    markdown: document.getElementById("markdown"),
    draftEditorToolbar: document.getElementById("draftEditorToolbar"),
    draftEditorStatus: document.getElementById("draftEditorStatus"),
    draftEditorModeToggle: document.getElementById("draftEditorModeToggle"),
    draftEditorStats: document.getElementById("draftEditorStats"),
    draftInlinePreview: document.getElementById("draftInlinePreview"),
    draftInlinePreviewHead: document.getElementById("draftInlinePreviewHead"),
    draftInlinePreviewTitle: document.getElementById("draftInlinePreviewTitle"),
    draftInlinePreviewMeta: document.getElementById("draftInlinePreviewMeta"),
    draftInlinePreviewBody: document.getElementById("draftInlinePreviewBody"),
    draftSyntaxHighlight: document.getElementById("draftSyntaxHighlight"),
    draftEditorInputWrap: document.querySelector(".draft-editor-input-wrap"),
    draftEditorShell: document.querySelector(".draft-editor-shell"),
    pageState: document.getElementById("pageState"),
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
    recordEditBody: document.getElementById("recordEditBody"),
    recordEditToolbar: document.getElementById("recordEditToolbar"),
    recordEditInputWrap: document.getElementById("recordEditInputWrap"),
    recordEditHighlight: document.getElementById("recordEditHighlight"),
    recordEditPreview: document.getElementById("recordEditPreview"),
    recordEditPreviewBody: document.getElementById("recordEditPreviewBody"),
    recordEditTextarea: document.getElementById("recordEditTextarea"),
    recordEditStats: document.getElementById("recordEditStats"),
    recordEditModeToggle: document.getElementById("recordEditModeToggle"),
    recordEditPrimaryLabel: document.getElementById("recordEditPrimaryLabel"),
    recordEditWriteButton: document.getElementById("recordEditWriteButton"),
    draftQueue: document.getElementById("draftQueue"),
    draftQueueMeta: document.getElementById("draftQueueMeta"),
    draftQueueList: document.getElementById("draftQueueList"),
    clearRecordHistory: document.getElementById("clearRecordHistory"),
    recordClearConfirm: document.getElementById("recordClearConfirm"),
    cancelRecordClear: document.getElementById("cancelRecordClear"),
    confirmRecordClear: document.getElementById("confirmRecordClear"),
    reviewMeta: document.getElementById("reviewMeta"),
    reviewList: document.getElementById("reviewList"),
    importDraft: document.getElementById("importDraft"),
    importHint: document.getElementById("importHint"),
    draftMediaAlert: document.getElementById("draftMediaAlert"),
    draftMediaAlertTitle: document.getElementById("draftMediaAlertTitle"),
    draftMediaAlertDetail: document.getElementById("draftMediaAlertDetail"),
    loadFile: document.getElementById("loadFile"),
    pickVault: document.getElementById("pickVault"),
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
  const X_ARTICLE_MEDIA_HEADROOM_THRESHOLD = 21;
  const X_ARTICLE_MEDIA_LIMIT_WARNING =
    "Images: {count}/{limit}. Remove {extra} image(s) before writing.";
  const X_ARTICLE_MEDIA_HEADROOM_NOTE =
    "Images: {count}/{limit}. Close to X Article's image limit.";
  const X_ARTICLE_MEDIA_CAPACITY_NOTE =
    "Images: {count}/{limit}.";
  const MARKDOWN_FILE_RE = /\.(md|markdown|mdown|mkd|txt)$/i;
  const MARKDOWN_FILE_ACCEPT = ".md,.markdown,.mdown,.mkd,.txt,text/markdown,text/plain";
  const MARKDOWN_TRANSFER_MIME_RE = /^(text\/markdown|text\/plain|application\/octet-stream)$/i;
  const MARKDOWN_LOAD_ERROR_TITLE = "Could not load Markdown";
  const MARKDOWN_LOAD_ERROR_DETAIL = "Try a .md, .markdown, .txt file, or plain Markdown text.";
  const NO_NEW_DRAFTS_DETAIL = "No new Markdown drafts were added.";
  const DRAFT_EDITOR_MODES = new Set(["edit", "read"]);
  const EDITOR_HISTORY_LIMIT = 40;
  const DRAFT_SAVE_DELAY_MS = 220;
  const DRAFT_ANALYZE_DELAY_MS = 140;
  const RECORD_SEARCH_DELAY_MS = 120;
  const STARTUP_DRAFT_ANALYZE_DELAY_MS = 260;
  const STARTUP_IDLE_TIMEOUT_MS = 650;
  const STARTUP_PAGE_STATE_TIMEOUT_MS = 900;
  const STARTUP_STORAGE_KEYS = [
    STORAGE_DRAFT,
    STORAGE_DRAFT_QUEUE,
    STORAGE_THEME,
    STORAGE_LANGUAGE,
    STORAGE_IMPORT_OPTIONS,
    STORAGE_ARTICLE_EXPORT_SETTINGS,
    STORAGE_SUCCESS_FEEDBACK,
    STORAGE_LIVE_RESULT
  ];
  const SYNTAX_HIGHLIGHT_DETAIL_LIMIT = 60000;
  const THEME_MODES = new Set(["system", "light", "dark"]);
  const SUCCESS_SOUND_VOLUME = 1;
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
  const SUCCESS_CELEBRATION_COLORS = ["#0f1419", "#536471", "#1d9bf0", "#00ba7c", "#cfd9de"];
  const EXTENSION_VERSION =
    typeof chrome !== "undefined" && chrome.runtime?.getManifest
      ? chrome.runtime.getManifest().version
      : "dev";
  const CONTENT_VERSION_UNKNOWN = "unknown";
  const EXTENSION_PATH = "the folder you cloned or downloaded";

  let latestParsed = null;
  let latestCounts = shared.segmentCounts([]);
  let latestPageStatus = null;
  let latestDiagnostics = null;
  let latestEvidence = null;
  let recordHistory = [];
  let draftQueue = [];
  let draftQueueMediaReady = true;
  let activeQueueItemId = null;
  let recordSearchQuery = "";
  let activeRecordEditorId = null;
  let activeDraftEditor = null;
  let liveResultChecks = {};
  let targetLock = null;
  let latestProgress = createLiveProgressState();
  let currentLanguage = preferredLanguage();
  let activeDraftRecordId = null;
  let activeDraftFingerprint = null;
  let activeDraftFinalized = false;
  let draftInputHistoryTimer = null;
  let draftSaveTimer = null;
  let draftAnalyzeTimer = null;
  let draftSyntaxIdleHandle = null;
  let draftQueueMediaIdleHandle = null;
  let recordSearchTimer = null;
  let recordHistoryRestored = false;
  let recordHistoryRestorePromise = null;
  let startupStoragePromise = null;
  let pendingRecordHistoryEntries = [];
  let suppressNextTypedHistory = false;
  let activeWriteQueueItemId = null;
  let queueMotionTimer = null;
  let animatedQueueItemIds = new Set();
  let batchWriting = false;
  let importCancelRequested = false;
  let importOptions = { setTitle: true, setCover: true };
  let successFeedbackOptions = { confetti: true, sound: true, soundStyle: "soft" };
  let articleExportOptions = { enabled: true, mode: "copy" };
  let successAudioContext = null;
  let lastSuccessFeedbackKey = "";
  let draftEditorMode = "edit";
  let recordEditMode = "edit";
  let draftEditorHistory = createEditorHistory();
  let recordEditorHistory = createEditorHistory();
  let miniGfmRenderer = null;
  let runSummaryCollapseTimer = null;
  let draftDropStatusTimer = null;
  let remoteImageAccessStatus = { origins: [], available: [], missing: [], checkedAt: null };
  let remoteImageProbeStatus = { state: "idle", total: 0, ok: 0, fail: 0, results: [], checkedAt: null };

  const sidepanelMessages = window.xPosterSidepanelMessages?.register?.(i18n, shared, {
    X_ARTICLE_MEDIA_LIMIT_WARNING,
    X_ARTICLE_MEDIA_HEADROOM_NOTE,
    X_ARTICLE_MEDIA_CAPACITY_NOTE
  }) || { ZH_TEXT: new Map(), EN_TEXT: new Map() };
  const { ZH_TEXT, EN_TEXT } = sidepanelMessages;
  const sidepanelPatterns = window.xPosterSidepanelPatterns || {
    translatePatternText: (source) => source,
    reversePatternText: () => null
  };

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

  function isChineseLanguage(language = currentLanguage) {
    return String(language || "").startsWith("zh");
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

  function startupStorage() {
    if (!hasChromeApi()) return Promise.resolve({});
    if (!startupStoragePromise) {
      startupStoragePromise = chrome.storage.local.get(STARTUP_STORAGE_KEYS).catch(() => ({}));
    }
    return startupStoragePromise;
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

  function draftText() {
    return els.markdown?.value || "";
  }

  function miniGfm() {
    if (miniGfmRenderer) return miniGfmRenderer;
    if (typeof window.MiniGFM !== "function") return null;
    miniGfmRenderer = new window.MiniGFM({ noMoreBr: true });
    return miniGfmRenderer;
  }

  function protectReadPreviewCodeBlocks(markdown = "") {
    const codeBlocks = [];
    const protectedMarkdown = String(markdown || "").replace(
      /(^|\n)(`{3,4})[ \t]*([^\n`]*)\n([\s\S]*?)\n\2(?=\n|$)/g,
      (match, prefix, fence, language, code) => {
        const token = `XPOSTERCODEBLOCK${codeBlocks.length}TOKEN`;
        const lang = language.trim();
        codeBlocks.push({
          token,
          html: `<pre><code${lang ? ` data-language="${shared.escapeHtml(lang)}"` : ""}>${shared.escapeHtml(code)}</code></pre>`
        });
        return `${prefix}<xposter-code-block>${token}</xposter-code-block>`;
      }
    );
    return { protectedMarkdown, codeBlocks };
  }

  function restoreReadPreviewCodeBlocks(html = "", codeBlocks = []) {
    return codeBlocks.reduce((output, block) => {
      const tokenPattern = new RegExp(`<xposter-code-block>\\s*${block.token}\\s*</xposter-code-block>|<p>\\s*${block.token}\\s*</p>|${block.token}`, "g");
      return output.replace(tokenPattern, block.html);
    }, String(html || ""));
  }

  function isWhitespacePreviewNode(node) {
    return node?.nodeType === Node.TEXT_NODE && !node.nodeValue.trim();
  }

  function isPreviewListItem(node) {
    return node?.nodeType === Node.ELEMENT_NODE && node.tagName === "LI";
  }

  function isOrderedPreviewListItem(item) {
    return /^\s*\d+[.)]\s+/.test(item?.textContent || "");
  }

  function stripOrderedPreviewListMarker(item) {
    const walker = document.createTreeWalker(item, NodeFilter.SHOW_TEXT);
    const textNode = walker.nextNode();
    if (!textNode) return;
    textNode.nodeValue = textNode.nodeValue.replace(/^(\s*)\d+[.)]\s+/, "$1");
  }

  function normalizePreviewLists(root) {
    const containers = [root, ...root.querySelectorAll("blockquote")];
    for (const container of containers) {
      let node = container.firstChild;
      while (node) {
        if (isWhitespacePreviewNode(node)) {
          node = node.nextSibling;
          continue;
        }
        if (!isPreviewListItem(node)) {
          node = node.nextSibling;
          continue;
        }

        const groups = [];
        let cursor = node;
        while (cursor) {
          if (isWhitespacePreviewNode(cursor)) {
            const whitespace = cursor;
            cursor = cursor.nextSibling;
            whitespace.remove();
            continue;
          }
          if (!isPreviewListItem(cursor)) break;
          const ordered = isOrderedPreviewListItem(cursor);
          const currentGroup = groups[groups.length - 1];
          if (currentGroup && currentGroup.ordered === ordered) {
            currentGroup.items.push(cursor);
          } else {
            groups.push({ ordered, items: [cursor] });
          }
          cursor = cursor.nextSibling;
        }

        for (const group of groups) {
          const list = document.createElement(group.ordered ? "ol" : "ul");
          container.insertBefore(list, cursor);
          for (const item of group.items) {
            if (group.ordered) stripOrderedPreviewListMarker(item);
            list.appendChild(item);
          }
        }
        node = cursor;
      }
    }
  }

  function safePreviewUrl(value = "") {
    const raw = String(value || "").trim();
    if (!raw) return "";
    if (/[\u0000-\u001f\u007f<>]/.test(raw)) return "";
    const schemeMatch = raw.match(/^([a-z][a-z0-9+.-]*):/i);
    if (schemeMatch) {
      return /^(https?|mailto|tel|ftp)$/i.test(schemeMatch[1]) ? raw : "";
    }
    return raw;
  }

  function sanitizePreviewHtml(html = "") {
    const template = document.createElement("template");
    template.innerHTML = String(html || "");
    template.content.querySelectorAll("script, iframe, object, embed, frame, link, meta, style, svg, math").forEach((node) => {
      node.replaceWith(document.createTextNode(node.textContent || ""));
    });
    template.content.querySelectorAll("*").forEach((node) => {
      for (const attr of Array.from(node.attributes)) {
        const name = attr.name.toLowerCase();
        const value = attr.value || "";
        if (name.startsWith("on") || name === "style" || name === "srcdoc") {
          node.removeAttribute(attr.name);
          continue;
        }
        if (name === "href" || name === "src") {
          const safeUrl = safePreviewUrl(value);
          if (!safeUrl) {
            node.removeAttribute(attr.name);
            continue;
          }
          node.setAttribute(attr.name, safeUrl);
        }
      }
      if (node.tagName === "A") {
        node.setAttribute("target", "_blank");
        node.setAttribute("rel", "noreferrer noopener");
      }
      if (node.tagName === "IMG") {
        node.setAttribute("loading", "lazy");
        node.setAttribute("decoding", "async");
      }
    });
    normalizePreviewLists(template.content);
    return template.innerHTML;
  }

  function markdownSegmentCounts(text, fallback = shared.segmentCounts([])) {
    if (!String(text || "").trim()) return shared.segmentCounts([]);
    try {
      return shared.segmentCounts(parseDraftMarkdown(text).segments);
    } catch {
      return fallback;
    }
  }

  function editorStatsText(text, counts = shared.segmentCounts([])) {
    const parts = [formatCompactUnit(String(text || "").length, "char", "chars", "字符")];
    if (counts.image) parts.push(formatCompactUnit(counts.image, "image", "images", "图"));
    if (counts.table) parts.push(formatCompactUnit(counts.table, "table", "tables", "表"));
    return parts.join(" · ");
  }

  function updateEditorModeToggle(button, mode) {
    if (!button) return;
    const isRead = mode === "read";
    const nextMode = isRead ? "edit" : "read";
    button.dataset.nextMode = nextMode;
    button.setAttribute("aria-pressed", isRead ? "true" : "false");
    button.setAttribute("aria-label", localizeText(nextMode === "read" ? "Read" : "Write"));
    button.title = localizeText(nextMode === "read" ? "Read" : "Write");
  }

  function updateDraftEditorStatus({ parse = true } = {}) {
    const text = draftText();
    const counts = parse ? markdownSegmentCounts(text, latestCounts || shared.segmentCounts([])) : shared.segmentCounts([]);
    if (els.draftEditorStats) setLocalizedText(els.draftEditorStats, editorStatsText(text, counts));
  }

  function updateDraftEditorDensity(text = draftText()) {
    if (!els.draftEditorShell) return;
    const value = String(text || "");
    const meaningfulLines = value.split(/\r\n?|\n/).filter((line) => line.trim()).length;
    const hasRichBlocks = /(^|\n)\s*(```|!\[|#{1,6}\s|\|.+\||[-*+]\s+|\d+\.\s+)/.test(value);
    const isCompact = !value.trim() || (value.length < 420 && meaningfulLines <= 8 && !hasRichBlocks);
    els.draftEditorShell.dataset.density = isCompact ? "compact" : "roomy";
  }

  function draftSyntaxSpan(className, text) {
    return `<span class="${className}">${shared.escapeHtml(text)}</span>`;
  }

  function plainDraftSyntaxText(text = "") {
    return String(text || "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }

  function highlightInlineMarkdownSyntax(text = "") {
    const tokens = [];
    const token = (className, value) => {
      const key = `\u0000${tokens.length}\u0000`;
      tokens.push(draftSyntaxSpan(className, value));
      return key;
    };
    const wrapToken = (open, className, value, close = open) =>
      `${token("draft-token-marker", open)}${token(className, plainDraftSyntaxText(value))}${token("draft-token-marker", close)}`;
    const escaped = shared
      .escapeHtml(String(text || ""))
      .replace(/!\[([^\]\n]*)\]\(([^)\n]+)\)/g, (_, alt, url) =>
        [
          token("draft-token-marker", "!["),
          token("draft-token-image", plainDraftSyntaxText(alt)),
          token("draft-token-marker", "]("),
          token("draft-token-url", plainDraftSyntaxText(url)),
          token("draft-token-marker", ")")
        ].join("")
      )
      .replace(/\[([^\]\n]+)\]\(([^)\n]+)\)/g, (_, label, url) =>
        [
          token("draft-token-marker", "["),
          token("draft-token-link", plainDraftSyntaxText(label)),
          token("draft-token-marker", "]("),
          token("draft-token-url", plainDraftSyntaxText(url)),
          token("draft-token-marker", ")")
        ].join("")
      )
      .replace(/(`+)([^`\n]+)(\1)/g, (_, open, code, close) =>
        wrapToken(open, "draft-token-code", code, close)
      )
      .replace(/(\*\*|__)(.+?)(\1)/g, (_, open, strong, close) =>
        wrapToken(open, "draft-token-strong", strong, close)
      )
      .replace(/(^|[^\w*_])([*_])([^*_]+?)(\2)(?=$|[^\w*_])/g, (_, prefix, open, emphasis, close) =>
        `${prefix}${wrapToken(open, "draft-token-emphasis", emphasis, close)}`
      );
    return tokens.reduce((html, value, index) => html.replace(`\u0000${index}\u0000`, value), escaped);
  }

  function highlightMarkdownLine(line = "", inCodeBlock = false) {
    const value = String(line || "");
    if (inCodeBlock) return draftSyntaxSpan("draft-token-code", value);
    const heading = value.match(/^(\s{0,3})(#{1,6})(\s+)(.*)$/);
    if (heading) {
      return [
        shared.escapeHtml(heading[1]),
        draftSyntaxSpan("draft-token-marker", heading[2]),
        shared.escapeHtml(heading[3]),
        draftSyntaxSpan("draft-token-heading", heading[4])
      ].join("");
    }
    const quote = value.match(/^(\s{0,3}>+\s?)(.*)$/);
    if (quote) {
      return `${draftSyntaxSpan("draft-token-blockquote", quote[1])}${highlightInlineMarkdownSyntax(quote[2])}`;
    }
    const list = value.match(/^(\s*(?:[-*+]|\d+[.)])\s+)(.*)$/);
    if (list) {
      return `${draftSyntaxSpan("draft-token-list", list[1])}${highlightInlineMarkdownSyntax(list[2])}`;
    }
    if (/^\s*\|.+\|\s*$/.test(value)) {
      return draftSyntaxSpan("draft-token-table", value);
    }
    return highlightInlineMarkdownSyntax(value);
  }

  function renderMarkdownSyntaxHighlight(target, text = "") {
    if (!target) return;
    const value = String(text || "");
    if (value.length > SYNTAX_HIGHLIGHT_DETAIL_LIMIT) {
      target.textContent = value;
      return;
    }
    const lines = value.replace(/\r\n?/g, "\n").split("\n");
    let inCodeBlock = false;
    const html = lines
      .map((line) => {
        const isFence = /^\s*```/.test(line);
        const rendered = highlightMarkdownLine(line, inCodeBlock || isFence);
        if (isFence) inCodeBlock = !inCodeBlock;
        return rendered || " ";
      })
      .join("\n");
    target.innerHTML = html;
  }

  function cancelDeferredDraftSyntaxHighlight() {
    if (!draftSyntaxIdleHandle) return;
    if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(draftSyntaxIdleHandle);
    else window.clearTimeout(draftSyntaxIdleHandle);
    draftSyntaxIdleHandle = null;
  }

  function renderDraftSyntaxHighlight(text = draftText()) {
    if (!els.draftSyntaxHighlight) return;
    cancelDeferredDraftSyntaxHighlight();
    renderMarkdownSyntaxHighlight(els.draftSyntaxHighlight, text);
    syncDraftSyntaxScroll();
  }

  function scheduleDraftSyntaxHighlight(text = draftText()) {
    if (!els.draftSyntaxHighlight) return;
    cancelDeferredDraftSyntaxHighlight();
    const value = String(text || "");
    els.draftSyntaxHighlight.textContent = value;
    draftSyntaxIdleHandle = runWhenIdle(() => {
      draftSyntaxIdleHandle = null;
      if (draftText() !== value || draftEditorMode !== "edit" || queueModeActive()) return;
      renderDraftSyntaxHighlight(value);
    }, 220);
  }

  function syncDraftSyntaxScroll() {
    if (!els.markdown || !els.draftSyntaxHighlight) return;
    els.draftSyntaxHighlight.scrollTop = els.markdown.scrollTop;
    els.draftSyntaxHighlight.scrollLeft = els.markdown.scrollLeft;
  }

  function setDraftText(markdown, { preview = true, parseStatus = true, syntax = "now" } = {}) {
    const text = String(markdown || "");
    if (els.markdown && els.markdown.value !== text) els.markdown.value = text;
    resetEditorHistory(els.markdown);
    if (syntax === "defer") scheduleDraftSyntaxHighlight(text);
    else if (syntax === "none") cancelDeferredDraftSyntaxHighlight();
    else renderDraftSyntaxHighlight(text);
    updateDraftEditorDensity(text);
    updateDraftEditorStatus({ parse: parseStatus });
    if (preview) updateInlinePreview();
  }

  function focusDraftTextEditor() {
    if (queueModeActive()) return;
    setDraftEditorMode("edit");
    els.markdown?.focus?.();
  }

  function handleDraftEditorInput({ pasted = false, event = null } = {}) {
    syncProgrammaticUndoFallback(event, els.markdown);
    clearProgrammaticHistoryOnTextInput(event, els.markdown);
    renderDraftSyntaxHighlight();
    updateDraftEditorDensity();
    updateDraftEditorStatus();
    updateInlinePreview();
    scheduleSaveDraft();
    scheduleAnalyzeDraft();
    syncActiveQueueWithDraft();
    if (pasted) {
      suppressNextTypedHistory = true;
      window.clearTimeout(draftInputHistoryTimer);
      window.setTimeout(() => {
        saveDraft();
        analyzeDraftNow();
        window.clearTimeout(draftInputHistoryTimer);
        rememberDraftHistory("paste", { forceNew: true });
        acknowledgeDraftInput();
      }, 0);
      return;
    }
    if (suppressNextTypedHistory) {
      suppressNextTypedHistory = false;
      return;
    }
    scheduleDraftHistory("typed");
  }

  function textareaSelection(textarea = els.markdown) {
    if (!textarea) return { start: 0, end: 0, selected: "" };
    const start = Math.max(0, textarea.selectionStart || 0);
    const end = Math.max(start, textarea.selectionEnd || start);
    return {
      start,
      end,
      selected: textarea.value.slice(start, end)
    };
  }

  function createEditorHistory() {
    return {
      undo: [],
      redo: [],
      pending: null,
      pendingTimer: null
    };
  }

  function editorHistoryForTextarea(textarea) {
    return textarea === els.recordEditTextarea ? recordEditorHistory : draftEditorHistory;
  }

  function resetEditorHistory(textarea) {
    const previous = editorHistoryForTextarea(textarea);
    if (previous?.pendingTimer) window.clearTimeout(previous.pendingTimer);
    if (textarea === els.recordEditTextarea) recordEditorHistory = createEditorHistory();
    else draftEditorHistory = createEditorHistory();
  }

  function editorSnapshot(textarea) {
    const selection = textareaSelection(textarea);
    return {
      value: textarea?.value || "",
      start: selection.start,
      end: selection.end
    };
  }

  function editorSnapshotsEqual(left, right) {
    return Boolean(left && right) &&
      left.value === right.value &&
      left.start === right.start &&
      left.end === right.end;
  }

  function pushEditorUndoSnapshot(textarea, snapshot = editorSnapshot(textarea)) {
    if (!textarea) return;
    const history = editorHistoryForTextarea(textarea);
    if (editorSnapshotsEqual(history.undo[history.undo.length - 1], snapshot)) return;
    history.undo.push(snapshot);
    if (history.undo.length > EDITOR_HISTORY_LIMIT) history.undo.shift();
    history.redo = [];
  }

  function restoreEditorSnapshot(textarea, snapshot, onChange) {
    if (!textarea || !snapshot) return false;
    textarea.value = snapshot.value;
    const end = textarea.value.length;
    textarea.setSelectionRange(Math.min(snapshot.start, end), Math.min(snapshot.end, end));
    textarea.focus();
    onChange?.();
    return true;
  }

  function handleTextareaUndoShortcut(event, { textarea = event.target, onChange = handleDraftEditorInput } = {}) {
    if (!textarea || event.defaultPrevented) return false;
    if (!(event.metaKey || event.ctrlKey) || event.altKey) return false;
    const key = String(event.key || "").toLowerCase();
    const wantsUndo = key === "z" && !event.shiftKey;
    const wantsRedo = key === "y" || (key === "z" && event.shiftKey);
    if (!wantsUndo && !wantsRedo) return false;
    const history = editorHistoryForTextarea(textarea);
    const action = wantsRedo ? "redo" : "undo";
    const stack = action === "redo" ? history.redo : history.undo;
    if (!stack.length) return false;
    const before = editorSnapshot(textarea);
    if (history.pendingTimer) window.clearTimeout(history.pendingTimer);
    history.pending = { action, before };
    history.pendingTimer = window.setTimeout(() => {
      history.pendingTimer = null;
      if (!history.pending || history.pending.action !== action) return;
      if (!editorSnapshotsEqual(editorSnapshot(textarea), before)) {
        history.pending = null;
        return;
      }
      const activeStack = action === "redo" ? history.redo : history.undo;
      const next = activeStack.pop();
      if (!next) return;
      if (action === "redo") history.undo.push(before);
      else history.redo.push(before);
      restoreEditorSnapshot(textarea, next, onChange);
      history.pending = null;
    }, 80);
    return false;
  }

  function syncProgrammaticUndoFallback(event, textarea) {
    const action = event?.inputType === "historyRedo" ? "redo" : event?.inputType === "historyUndo" ? "undo" : "";
    if (!textarea || !action) return;
    const history = editorHistoryForTextarea(textarea);
    const pending = history.pending?.action === action ? history.pending : null;
    const stack = action === "redo" ? history.redo : history.undo;
    const current = editorSnapshot(textarea);
    const expected = stack[stack.length - 1];
    if (expected?.value === current.value) {
      stack.pop();
      if (pending?.before && !editorSnapshotsEqual(pending.before, current)) {
        if (action === "redo") history.undo.push(pending.before);
        else history.redo.push(pending.before);
      }
    }
    if (pending) {
      if (history.pendingTimer) window.clearTimeout(history.pendingTimer);
      history.pendingTimer = null;
      history.pending = null;
    }
  }

  function clearProgrammaticHistoryOnTextInput(event, textarea) {
    if (!textarea || !event?.inputType || event.inputType === "historyUndo" || event.inputType === "historyRedo") return;
    const history = editorHistoryForTextarea(textarea);
    history.undo = [];
    history.redo = [];
    if (history.pendingTimer) window.clearTimeout(history.pendingTimer);
    history.pendingTimer = null;
    history.pending = null;
  }

  function replaceTextareaSelection(text, selectStart = 0, selectEnd = text.length, { textarea = els.markdown, onChange = handleDraftEditorInput } = {}) {
    if (!textarea) return;
    pushEditorUndoSnapshot(textarea);
    const { start, end } = textareaSelection(textarea);
    textarea.setRangeText(text, start, end, "end");
    textarea.focus();
    textarea.setSelectionRange(start + selectStart, start + selectEnd);
    onChange?.();
  }

  function surroundTextareaSelection(before, after = before, options = {}) {
    const { selected } = textareaSelection(options.textarea || els.markdown);
    replaceTextareaSelection(`${before}${selected}${after}`, before.length, before.length + selected.length, options);
  }

  function insertAtCurrentLine(prefix, { textarea = els.markdown, onChange = handleDraftEditorInput } = {}) {
    if (!textarea) return;
    pushEditorUndoSnapshot(textarea);
    const position = Math.max(0, textarea.selectionStart || 0);
    const lineStart = textarea.value.lastIndexOf("\n", position - 1) + 1;
    textarea.setRangeText(prefix, lineStart, lineStart, "end");
    textarea.focus();
    textarea.setSelectionRange(position + prefix.length, position + prefix.length);
    onChange?.();
  }

  function applyTextareaCommand(command, options = {}) {
    if (command === "bold") surroundTextareaSelection("**", "**", options);
    else if (command === "italic") surroundTextareaSelection("_", "_", options);
    else if (command === "heading") insertAtCurrentLine("## ", options);
    else if (command === "code") surroundTextareaSelection("`", "`", options);
    else if (command === "link") replaceTextareaSelection("[link text](https://)", 1, 10, options);
    else if (command === "image") replaceTextareaSelection("![alt text](https://)", 2, 10, options);
    else if (command === "table") replaceTextareaSelection("| Column | Value |\n| --- | --- |\n|  |  |\n", 34, 34, options);
  }

  function setDraftEditorMode(mode = "edit") {
    draftEditorMode = DRAFT_EDITOR_MODES.has(mode) ? mode : "edit";
    const isEdit = draftEditorMode === "edit";
    const isPreview = !isEdit;
    if (els.draftEditorShell) els.draftEditorShell.dataset.mode = draftEditorMode;
    if (els.draftEditorInputWrap) {
      els.draftEditorInputWrap.hidden = isPreview || queueModeActive();
      els.draftEditorInputWrap.setAttribute("aria-hidden", isPreview || queueModeActive() ? "true" : "false");
    }
    if (els.markdown) {
      els.markdown.setAttribute("aria-hidden", isPreview || queueModeActive() ? "true" : "false");
      els.markdown.tabIndex = isPreview || queueModeActive() ? -1 : 0;
    }
    if (els.draftInlinePreview) {
      els.draftInlinePreview.hidden = !isPreview || queueModeActive();
      els.draftInlinePreview.setAttribute("aria-hidden", isPreview && !queueModeActive() ? "false" : "true");
    }
    updateDraftEditorModeToggle();
    els.draftEditorToolbar?.querySelectorAll("[data-editor-command]").forEach((button) => {
      button.disabled = !isEdit || queueModeActive();
    });
    updateDraftEditorStatus();
    if (isEdit) renderDraftSyntaxHighlight();
    if (isPreview) updateInlinePreview();
  }

  function updateDraftEditorModeToggle() {
    updateEditorModeToggle(els.draftEditorModeToggle, draftEditorMode);
  }

  function updateInlinePreview(parsed = latestParsed, counts = latestCounts) {
    if (!els.draftInlinePreview) return;
    if (els.draftInlinePreview) els.draftInlinePreview.dataset.previewMode = "read";
    const text = draftText();
    if (!text.trim()) {
      if (els.draftInlinePreviewTitle) setLocalizedText(els.draftInlinePreviewTitle, "Reading preview");
      if (els.draftInlinePreviewMeta) setLocalizedText(els.draftInlinePreviewMeta, "Paste Markdown to read it here.");
      if (els.draftInlinePreviewBody) {
        els.draftInlinePreviewBody.innerHTML = emptyMarkdownPreviewHtml();
      }
      translateDynamicDom(els.draftInlinePreview);
      return;
    }
    if (els.draftInlinePreviewTitle) setLocalizedText(els.draftInlinePreviewTitle, "Reading preview");
    if (els.draftInlinePreviewMeta) setLocalizedText(els.draftInlinePreviewMeta, [
      formatCompactUnit(text.length, "char", "chars", "字符"),
      formatCompactUnit((text.match(/^!\[/gm) || []).length, "image", "images", "图")
    ].join(" · "));
    if (els.draftInlinePreviewBody) {
      els.draftInlinePreviewBody.innerHTML = markdownPreviewHtml(text);
    }
    translateDynamicDom(els.draftInlinePreview);
  }

  function markdownPreviewHtml(markdown = "") {
    const safe = shared.escapeHtml;
    const renderer = miniGfm();
    const { protectedMarkdown, codeBlocks } = protectReadPreviewCodeBlocks(markdown);
    return renderer
      ? sanitizePreviewHtml(restoreReadPreviewCodeBlocks(renderer.parse(protectedMarkdown), codeBlocks))
      : `<pre class="draft-read-fallback">${safe(markdown)}</pre>`;
  }

  function emptyMarkdownPreviewHtml() {
    return `<p class="empty">${shared.escapeHtml(localizeText("Reading preview appears here."))}</p>`;
  }

  function runDraftEditorCommand(command) {
    setDraftEditorMode("edit");
    applyTextareaCommand(command);
    focusDraftTextEditor();
  }

  function importOptionsPayload() {
    return normalizeImportOptions(importOptions);
  }

  function writeOptionsPayload({ forceNewArticle = false } = {}) {
    return {
      ...importOptionsPayload(),
      forceNewArticle: Boolean(forceNewArticle)
    };
  }

  function syncImportOptionsControls() {
    if (els.importTitleOption) els.importTitleOption.checked = importOptions.setTitle !== false;
    if (els.importCoverOption) els.importCoverOption.checked = importOptions.setCover !== false;
  }

  function applyImportOptions(options = importOptions, { refresh = true } = {}) {
    importOptions = normalizeImportOptions(options);
    syncImportOptionsControls();
    if (!refresh) return;
    if (latestParsed?.segments?.length) analyzeDraft();
    else if (draftText().trim()) scheduleAnalyzeDraft(STARTUP_DRAFT_ANALYZE_DELAY_MS);
    else {
      syncRemoteImageAccessStatusFromDraft(null);
      updatePreflight();
    }
  }

  async function setImportOptions(nextOptions, { persist = true, refresh = true } = {}) {
    applyImportOptions(nextOptions, { refresh });
    if (persist && hasChromeApi()) {
      await chrome.storage.local.set({ [STORAGE_IMPORT_OPTIONS]: importOptionsPayload() });
    }
  }

  async function restoreImportOptions() {
    if (hasChromeApi()) {
      const stored = await startupStorage();
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
      const stored = await startupStorage();
      applyArticleExportOptions(stored[STORAGE_ARTICLE_EXPORT_SETTINGS] || articleExportOptions);
      return;
    }
    applyArticleExportOptions(articleExportOptions);
  }

  function normalizeSuccessFeedbackOptions(options = {}) {
    return {
      confetti: options.confetti !== false,
      sound: options.sound !== false,
      soundStyle: SUCCESS_SOUND_STYLES.has(options.soundStyle) ? options.soundStyle : "soft"
    };
  }

  function successFeedbackPayload() {
    return normalizeSuccessFeedbackOptions(successFeedbackOptions);
  }

  function syncSuccessFeedbackControls() {
    if (els.confettiOption) els.confettiOption.checked = successFeedbackOptions.confetti !== false;
    if (els.successSoundOption) els.successSoundOption.checked = successFeedbackOptions.sound !== false;
    if (els.successSoundStyle) els.successSoundStyle.value = successFeedbackOptions.soundStyle || "soft";
    const soundEnabled = successFeedbackOptions.sound !== false;
    if (els.successSoundStyle) els.successSoundStyle.disabled = !soundEnabled;
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
      const stored = await startupStorage();
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
    const master = context.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(sound.master * SUCCESS_SOUND_VOLUME, now + 0.018);
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

  async function requestPageSuccessCelebration(summary = null) {
    if (!successFeedbackOptions.confetti) return;
    await sendToActiveTab({
      type: "xposter:success-celebration",
      summary: {
        elapsedMs: Number(summary?.elapsedMs || 0),
        warnings: Number(summary?.mediaWarnings?.total || 0) + Number(summary?.main?.imgFail || 0)
      },
      colors: SUCCESS_CELEBRATION_COLORS
    }).catch(() => null);
  }

  function triggerSuccessFeedback(summary = null) {
    const key = String(latestProgress?.startedAt || summary?.elapsedMs || Date.now());
    if (key && key === lastSuccessFeedbackKey) return;
    lastSuccessFeedbackKey = key;
    if (successFeedbackOptions.confetti) void requestPageSuccessCelebration(summary);
    if (successFeedbackOptions.sound) void playSuccessSound();
  }

  async function previewSuccessFeedback() {
    if (successFeedbackOptions.sound) await playSuccessSound();
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
      const stored = await startupStorage();
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
      if (translated !== source || !isChineseLanguage()) return translated;
    }
    if (!isChineseLanguage()) return source;
    const direct = ZH_TEXT.get(source);
    if (direct) return currentLanguage === "zh-TW" ? shared.toTraditionalChinese(direct) : direct;
    const pattern = translatePatternText(source);
    if (pattern !== source) return currentLanguage === "zh-TW" ? shared.toTraditionalChinese(pattern) : pattern;
    const compound = translateCompoundText(source);
    return currentLanguage === "zh-TW" ? shared.toTraditionalChinese(compound) : compound;
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
    return sidepanelPatterns.translatePatternText(source);
  }

  function reversePatternText(text) {
    return sidepanelPatterns.reversePatternText(text);
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
    document.documentElement.lang = i18n?.htmlLang?.(currentLanguage) || (currentLanguage === "zh" ? "zh-CN" : "en");
    document.body.dataset.language = currentLanguage;
    document.body.dataset.languagePreference = i18n?.preference?.() || currentLanguage;
  }

  function translateVisibleWorkspace() {
    translateDynamicDom(document.querySelector(".topbar") || document.body);
    translateDynamicDom(document.querySelector(".tabs") || document.body);
    document.querySelectorAll(".panel.active").forEach((panel) => translateDynamicDom(panel));
    document.documentElement.lang = i18n?.htmlLang?.(currentLanguage) || (currentLanguage === "zh" ? "zh-CN" : "en");
    document.body.dataset.language = currentLanguage;
    document.body.dataset.languagePreference = i18n?.preference?.() || currentLanguage;
  }

  function localizeText(text) {
    const source = String(text || "");
    if (!i18n) return translateText(source);
    const translated = i18n.t(source);
    return translated === source ? translateText(source) : translated;
  }

  function localizeInterpolated(key, values = {}) {
    if (i18n) return i18n.t(key, values);
    return translateText(String(key || "").replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? "")));
  }

  function runWhenIdle(callback, timeout = STARTUP_IDLE_TIMEOUT_MS) {
    if (typeof window.requestIdleCallback === "function") {
      return window.requestIdleCallback(callback, { timeout });
    }
    return window.setTimeout(callback, 0);
  }

  function populateLanguageSelect() {
    if (!els.languageSelect || !i18n?.languageOptions) return;
    els.languageSelect.innerHTML = i18n.languageOptions()
      .map((option) => {
        const label = option.code === "auto"
          ? localizeText("Automatic")
          : option.nativeName;
        return `<option value="${shared.escapeHtml(option.code)}">${shared.escapeHtml(label)}</option>`;
      })
      .join("");
    els.languageSelect.value = i18n.preference?.() || currentLanguage;
  }

  function setLocalizedText(node, source) {
    if (!node) return;
    delete node.dataset.i18n;
    node.__xposterSourceText = source;
    node.textContent = localizeText(source);
    if (node.firstChild?.nodeType === Node.TEXT_NODE) node.firstChild.__xposterSourceText = source;
  }

  function setLocalizedMessage(node, key, values = {}) {
    if (!node) return;
    delete node.dataset.i18n;
    node.__xposterSourceText = key;
    node.textContent = localizeInterpolated(key, values);
    if (node.firstChild?.nodeType === Node.TEXT_NODE) node.firstChild.__xposterSourceText = key;
  }

  function setEvidenceRecordMeta(kind, capturedAt = new Date()) {
    const date = capturedAt instanceof Date ? capturedAt : new Date(capturedAt);
    const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setLocalizedMessage(els.evidenceMeta, "{kind} record saved at {time}", {
      kind: localizeText(recordKindLabel(kind)),
      time
    });
  }

  function translateEvidencePlaceholder(root = document.body) {
    if (!root.contains?.(els.evidenceText) && root !== els.evidenceText) return;
    const source = "Run a publishing check or import to save a record.";
    const current = els.evidenceText.textContent.trim();
    if (current === source || current === ZH_TEXT.get(source) || current === shared.toTraditionalChinese(ZH_TEXT.get(source))) {
      els.evidenceText.textContent = translateText(source);
    }
  }

  async function setLanguage(language, { persist = true } = {}) {
    const preference = i18n?.normalizeLanguagePreference?.(language) || (language === "zh" ? "zh" : "en");
    if (i18n) {
      currentLanguage = await i18n.setLanguage(preference, { persist, render: false });
    } else {
      currentLanguage = preference === "zh" ? "zh" : "en";
    }
    translateVisibleWorkspace();
    populateLanguageSelect();
    updateDraftBrief();
    updateDraftEditorStatus();
    if (recordHistoryRestored || els.recordsPanel?.classList.contains("active")) renderRecordHistory();
    if (persist && hasChromeApi()) {
      chrome.storage.local.set({ [STORAGE_LANGUAGE]: i18n?.preference?.() || currentLanguage });
    }
  }

  async function restoreLanguage() {
    if (i18n) {
      let preference = null;
      if (hasChromeApi()) {
        const stored = await startupStorage();
        preference = stored[STORAGE_LANGUAGE] || null;
      }
      currentLanguage = preference
        ? await i18n.setLanguage(preference, { persist: false, render: false })
        : await i18n.restoreLanguage({ render: false });
      await setLanguage(i18n.preference?.() || currentLanguage, { persist: false });
      return;
    }
    if (hasChromeApi()) {
      const stored = await startupStorage();
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

  function localImageReferences(parsed = latestParsed) {
    const references = localImageSegments(parsed).map((segment) => ({
      role: "body",
      source: segment.source,
      segment
    }));
    const coverSource = importOptions.setCover === false ? "" : String(parsed?.cover || "").trim();
    if (
      coverSource &&
      shared.isLocalImageSource(coverSource) &&
      !references.some((item) => shared.imageSourcesMatch(item.source, coverSource))
    ) {
      references.push({
        role: "cover",
        source: coverSource,
        segment: { type: "image", source: coverSource, alt: "cover" }
      });
    }
    return references;
  }

  function localImageFolderStatus(parsed = latestParsed, vault = currentVault()) {
    const references = localImageReferences(parsed);
    const absoluteCount = references.filter((item) => shared.isAbsoluteLocalImageSource(item.source)).length;
    const folderReady = Boolean(vault?.configured && vault.permission === "granted");
    return {
      references,
      count: references.length,
      absoluteCount,
      needsFolder: Boolean(references.length && !absoluteCount && !folderReady),
      ready: !references.length || Boolean(!absoluteCount && folderReady),
      vault: vault || {}
    };
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
        nearSoftLimit: false,
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
      nearSoftLimit: total >= X_ARTICLE_MEDIA_HEADROOM_THRESHOLD && total <= X_ARTICLE_MEDIA_SOFT_LIMIT,
      overSoftLimit: total > X_ARTICLE_MEDIA_SOFT_LIMIT
    };
  }

  function mediaNoteValues(estimate = mediaUploadEstimate()) {
    const total = Number(estimate?.total || 0);
    return {
      count: String(total),
      limit: String(X_ARTICLE_MEDIA_SOFT_LIMIT),
      extra: String(Math.max(0, total - X_ARTICLE_MEDIA_SOFT_LIMIT))
    };
  }

  function mediaNoteText(template, estimate = mediaUploadEstimate()) {
    const values = mediaNoteValues(estimate);
    if (i18n) return i18n.t(template, values);
    return Object.entries(values).reduce(
      (text, [key, value]) => text.replaceAll(`{${key}}`, value),
      translateText(template)
    );
  }

  function mediaLimitWarningText(estimate = mediaUploadEstimate()) {
    return mediaNoteText(X_ARTICLE_MEDIA_LIMIT_WARNING, estimate);
  }

  function mediaHeadroomText(estimate = mediaUploadEstimate()) {
    return mediaNoteText(X_ARTICLE_MEDIA_HEADROOM_NOTE, estimate);
  }

  function mediaCapacityText(estimate = mediaUploadEstimate()) {
    return mediaNoteText(X_ARTICLE_MEDIA_CAPACITY_NOTE, estimate);
  }

  function syncDraftMediaAlert(estimate = mediaUploadEstimate()) {
    if (!els.draftMediaAlert) return;
    const show = Boolean(estimate?.overSoftLimit);
    els.draftMediaAlert.hidden = !show;
    if (!show) return;
    if (els.draftMediaAlertTitle) setLocalizedText(els.draftMediaAlertTitle, "Too many images");
    if (els.draftMediaAlertDetail) {
      const values = mediaNoteValues(estimate);
      delete els.draftMediaAlertDetail.dataset.i18n;
      els.draftMediaAlertDetail.__xposterSourceText = X_ARTICLE_MEDIA_LIMIT_WARNING;
      els.draftMediaAlertDetail.textContent = i18n
        ? i18n.t(X_ARTICLE_MEDIA_LIMIT_WARNING, values)
        : mediaLimitWarningText(estimate);
    }
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

  function formatCompactCount(value, { zhTenThousand = true } = {}) {
    const count = Number(value || 0);
    if (!Number.isFinite(count)) return "0";
    const abs = Math.abs(count);
    if (isChineseLanguage()) {
      const tenThousandUnit = currentLanguage === "zh-TW" ? "萬" : "万";
      if (zhTenThousand && abs >= 10000) return formatCompactNumber(count / 10000, tenThousandUnit);
      return new Intl.NumberFormat(currentLanguage === "zh-TW" ? "zh-Hant" : "zh-Hans").format(count);
    }
    const format = (divisor, unit) => {
      const value = count / divisor;
      const rounded = value >= 10 ? Math.round(value) : Math.round(value * 10) / 10;
      return `${String(rounded).replace(/\.0$/, "")}${unit}`;
    };
    if (abs >= 1000000) return format(1000000, "M");
    if (abs >= 1000) return format(1000, "K");
    return String(count);
  }

  function formatCompactNumber(value, unit) {
    const rounded = Math.abs(value) >= 10 ? Math.round(value) : Math.round(value * 10) / 10;
    return `${String(rounded).replace(/\.0$/, "")}${unit}`;
  }

  function formatCompactUnit(count, enSingular, enPlural, zhUnit, options = {}) {
    const formatted = formatCompactCount(count, options);
    if (isChineseLanguage()) return `${formatted} ${currentLanguage === "zh-TW" ? shared.toTraditionalChinese(zhUnit) : zhUnit}`;
    return `${formatted} ${Number(count || 0) === 1 ? enSingular : enPlural}`;
  }

  function updateDraftBrief() {
    const hasDraft = Boolean(latestParsed?.segments?.length);
    if (els.draftPanel) els.draftPanel.dataset.emptyDraft = hasDraft || queueModeActive() ? "false" : "true";
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
    const markdown = draftText();
    const snapshot = markdownSnapshot(markdown);
    const parsed = latestParsed || ensureLatestParsedFromDraft();
    const counts = latestCounts || shared.segmentCounts(parsed?.segments || []);
    const remoteImages = remoteHttpImageSegments(parsed);
    const localImages = localImageReferences(parsed).length;
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
    void ensureRecordHistoryRestored();
    const markdown = draftText();
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
    activeDraftFingerprint = draftFingerprint(draftText());
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
    const text = draftText();
    if (!text.trim()) return null;
    return createQueueItemFromMarkdown(text, {
      fileName: "",
      source: "typed",
      id: queueItemId("queue-current")
    });
  }

  function queueDraftTooLargeDetail() {
    return localizeText("One Markdown file was too large for the queue. Load that draft by itself.");
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
    const text = draftText();
    const activeItem = draftQueue.find((item) => item.id === activeQueueItemId);
    if (activeItem && activeItem.markdown === text) return;
    activeQueueItemId = null;
    draftQueue = draftQueue.map((item) => item.status === "loaded" ? { ...item, status: "queued" } : item);
    markDraftQueueMediaStale();
    persistDraftQueue();
    renderDraftQueue();
  }

  function markDraftQueueMediaStale() {
    draftQueueMediaReady = !draftQueue.length;
    if (!draftQueueMediaIdleHandle) return;
    if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(draftQueueMediaIdleHandle);
    else window.clearTimeout(draftQueueMediaIdleHandle);
    draftQueueMediaIdleHandle = null;
  }

  function persistDraftQueue() {
    if (!hasChromeApi()) return;
    const nextQueue = trimQueueForStorage(draftQueue);
    if (nextQueue.length !== draftQueue.length) {
      draftQueue = nextQueue;
      markDraftQueueMediaStale();
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
    return isChineseLanguage()
      ? `${formatCompactCount(total, { zhTenThousand: false })} 篇草稿`
      : `${formatCompactCount(total, { zhTenThousand: false })} draft${total === 1 ? "" : "s"}`;
  }

  function queuedDraftAddedDetail(count = 1) {
    const total = draftQueue.length;
    return localizeInterpolated("{count} new draft(s) added. {total} total in queue.", { count, total });
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

  function queueItemMediaSummary(item) {
    if (!draftQueueMediaReady) return {
      tone: "ok",
      text: "",
      title: "",
      estimate: null
    };
    const estimate = mediaUploadEstimate(parseDraftMarkdown(item?.markdown || ""));
    const values = mediaNoteValues(estimate);
    if (estimate.overSoftLimit) {
      return {
        tone: "danger",
        text: localizeInterpolated("Too many images: remove {extra}", { extra: values.extra }),
        title: mediaLimitWarningText(estimate),
        estimate
      };
    }
    return {
      tone: "ok",
      text: "",
      title: "",
      estimate
    };
  }

  function scheduleDraftQueueMediaRender() {
    if (!queueModeActive() || draftQueueMediaReady) return;
    if (draftQueueMediaIdleHandle) return;
    draftQueueMediaIdleHandle = runWhenIdle(() => {
      draftQueueMediaIdleHandle = null;
      if (!queueModeActive() || draftQueueMediaReady) return;
      draftQueueMediaReady = true;
      renderDraftQueue();
    }, STARTUP_DRAFT_ANALYZE_DELAY_MS);
  }

  function normalizeQueuePreviewText(text) {
    return String(text || "")
      .replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~，。！？、：；“”‘’（）《》【】]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function queueItemTitleText(item) {
    const title = String(item?.title || "").trim();
    const fileName = String(item?.fileName || "").trim();
    if (title && title !== "Untitled Markdown" && title !== fileName) return title;
    return markdownMeaningfulLines(item?.markdown || "")[0] || "";
  }

  function queueItemDisplayTitle(item) {
    return truncateText(queueItemTitleText(item), 72) || localizeText("Untitled Markdown");
  }

  function queueItemExcerpt(item) {
    const titleToken = normalizeQueuePreviewText(queueItemTitleText(item));
    const lines = markdownMeaningfulLines(item?.markdown || "")
      .filter((line) => normalizeQueuePreviewText(line) !== titleToken);
    return truncateText(lines.join(" "), 118);
  }

  function renderQueueItemMeta(item, media = queueItemMediaSummary(item)) {
    const safe = shared.escapeHtml;
    const excerpt = queueItemExcerpt(item);
    const facts = [
      { type: "chars", tone: "neutral", text: formatCompactUnit(item.characters || 0, "char", "chars", "字符") }
    ].concat(media.tone === "danger"
      ? [{ type: "media", tone: media.tone, text: media.text, title: media.title }]
      : []);
    const factHtml = facts.map((fact) => `
            <span class="draft-queue-fact" data-type="${safe(fact.type)}" data-tone="${safe(fact.tone)}" ${fact.title ? `title="${safe(fact.title)}"` : ""}>${safe(fact.text)}</span>`
    ).join("");
    const excerptHtml = excerpt ? `<span class="draft-queue-excerpt">${safe(excerpt)}</span>` : "";
    return `${excerptHtml}<span class="draft-queue-meta">${factHtml}</span>`;
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
    if (els.draftPanel) els.draftPanel.dataset.queueMode = hasQueue ? "true" : "false";
    if (els.draftQueue) els.draftQueue.hidden = !hasQueue;
    if (els.draftEditorShell) els.draftEditorShell.hidden = hasQueue;
    if (els.draftEditorToolbar) els.draftEditorToolbar.hidden = hasQueue;
    if (els.draftEditorStatus) els.draftEditorStatus.hidden = hasQueue;
    if (hasQueue) {
      if (els.draftEditorInputWrap) {
        els.draftEditorInputWrap.hidden = true;
        els.draftEditorInputWrap.setAttribute("aria-hidden", "true");
      }
      if (els.markdown) {
        els.markdown.setAttribute("aria-hidden", "true");
        els.markdown.tabIndex = -1;
      }
      if (els.draftInlinePreview) {
        els.draftInlinePreview.hidden = true;
        els.draftInlinePreview.setAttribute("aria-hidden", "true");
      }
    } else {
      setDraftEditorMode(draftEditorMode);
    }
    updateDraftEditorStatus({ parse: false });
    updateDraftBrief();
  }

  function applyStoredDraftQueue(stored = {}) {
    draftQueue = Array.isArray(stored[STORAGE_DRAFT_QUEUE])
      ? stored[STORAGE_DRAFT_QUEUE].map(normalizeQueueItem).filter(Boolean).slice(0, MAX_DRAFT_QUEUE)
      : [];
    draftQueueMediaReady = !draftQueue.length;
    activeQueueItemId = draftQueue.find((item) => item.status === "loaded")?.id || activeQueueItemId;
    renderDraftQueue();
  }

  function restoreDraftFromStoredValue(value, { analyze = true } = {}) {
    const restored = String(value || "");
    if (queueModeActive()) {
      const activeItem = draftQueue.find((item) => item.id === activeQueueItemId) || draftQueue[0];
      suppressNextTypedHistory = true;
      window.clearTimeout(draftInputHistoryTimer);
      setDraftText(activeItem?.markdown || "", { preview: false, parseStatus: false, syntax: "defer" });
      if (analyze) scheduleAnalyzeDraft(STARTUP_DRAFT_ANALYZE_DELAY_MS);
      renderDraftQueue();
      return;
    }
    if (restored.trim()) {
      restoreSingleDraftMarkdown(restored, { analyze });
      return;
    }
    setDraftText("", { parseStatus: false });
    if (analyze) analyzeDraft();
    else {
      latestParsed = null;
      latestCounts = shared.segmentCounts([]);
      syncRemoteImageAccessStatusFromDraft(null);
      updateWriteButton();
    }
    syncDraftSurface();
  }

  function applyStartupDraftState(stored = {}) {
    applyStoredDraftQueue(stored);
    restoreDraftFromStoredValue(stored[STORAGE_DRAFT], { analyze: false });
    runWhenIdle(() => {
      analyzeDraft();
    }, STARTUP_DRAFT_ANALYZE_DELAY_MS);
  }

  function restoreSingleDraftMarkdown(markdown, { analyze = true } = {}) {
    const text = String(markdown || "");
    activeQueueItemId = null;
    draftQueue = [];
    draftQueueMediaReady = true;
    setDraftText(text, { preview: false, parseStatus: false, syntax: "defer" });
    if (analyze) saveDraft();
    syncDraftSurface();
    updateWriteButton();
    if (text.trim()) {
      setDraftDropStatus("Markdown loaded", draftReadyDetail(text.length), "done");
      if (analyze) scheduleAnalyzeDraft(STARTUP_DRAFT_ANALYZE_DELAY_MS);
      return;
    }
    if (analyze) analyzeDraft();
  }

  function setSingleDraftMarkdown(markdown, { source = "typed", fileName = null, statusTitle = "Markdown loaded", logMessage = "", remember = true } = {}) {
    const text = String(markdown || "");
    activeQueueItemId = null;
    draftQueue = [];
    draftQueueMediaReady = true;
    persistDraftQueue();
    suppressNextTypedHistory = true;
    window.clearTimeout(draftInputHistoryTimer);
    setDraftText(text);
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
    markDraftQueueMediaStale();
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
    if (els.draftQueueMeta) setLocalizedText(els.draftQueueMeta, queueSummaryText());
    if (!hasQueue) {
      els.draftQueueList.innerHTML = "";
      updateWriteButton();
      return;
    }
    const safe = shared.escapeHtml;
    els.draftQueueList.innerHTML = draftQueue.map((item, index) => {
      const mediaSummary = queueItemMediaSummary(item);
      return `
      <li class="draft-queue-item" data-queue-id="${safe(item.id)}" data-status="${safe(item.status)}" data-media="${safe(mediaSummary.tone)}" ${animatedQueueItemIds.has(item.id) ? 'data-motion="entered"' : ""} ${item.id === activeQueueItemId ? 'data-active="true"' : ""}>
        <button class="draft-queue-main" type="button" data-queue-action="edit" data-queue-id="${safe(item.id)}" title="${safe(localizeText("Edit draft"))}" aria-label="${safe(localizeText("Edit draft"))}">
          <span class="draft-queue-index">${index + 1}</span>
          <strong>${safe(queueItemDisplayTitle(item))}</strong>
          ${renderQueueItemMeta(item, mediaSummary)}
        </button>
        <div class="draft-queue-actions" aria-label="${safe(localizeText("Draft actions"))}">
          <button class="record-icon-action draft-queue-copy" type="button" data-queue-action="copy" data-queue-id="${safe(item.id)}" title="${safe(localizeText("Copy text"))}" aria-label="${safe(localizeText("Copy text"))}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7h10v13H8V7Zm2 2v9h6V9h-6ZM5 4h10v2H7v10H5V4Z"/></svg>
          </button>
          <button class="record-icon-action draft-queue-remove" type="button" data-queue-action="remove" data-queue-id="${safe(item.id)}" title="${safe(localizeText("Remove draft"))}" aria-label="${safe(localizeText("Remove draft"))}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm-2 6h2v10h6V9h2v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V9Zm4 0h2v8h-2V9Z"/></svg>
          </button>
        </div>
      </li>
    `;
    }).join("");
    translateDynamicDom(els.draftQueue);
    updateWriteButton();
    scheduleDraftQueueMediaRender();
  }

  async function restoreDraftQueue() {
    if (!hasChromeApi()) {
      renderDraftQueue();
      return;
    }
    applyStoredDraftQueue(await startupStorage());
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
    markDraftQueueMediaStale();
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
    if (button.dataset.queueAction === "remove") {
      removeDraftQueueItem(id);
    }
  }

  function removeDraftQueueItem(id) {
    const index = draftQueue.findIndex((entry) => entry.id === id);
    if (index < 0) return false;
    if (activeWriteQueueItemId === id || draftQueue[index]?.status === "writing") {
      log("Stop writing before removing this draft.");
      return false;
    }
    const wasActive = activeQueueItemId === id;
    draftQueue = draftQueue.filter((entry) => entry.id !== id);
    markDraftQueueMediaStale();
    if (wasActive) activeQueueItemId = null;
    if (!draftQueue.length) {
      suppressNextTypedHistory = true;
      window.clearTimeout(draftInputHistoryTimer);
      setDraftText("");
      saveDraft();
      analyzeDraft();
      setDraftDropStatus("Draft removed", "No pending drafts remain.", "idle");
      persistDraftQueue();
      renderDraftQueue();
      updateWriteButton();
      log("Queued draft removed.");
      return true;
    }
    if (wasActive || !activeQueueItemId || !draftQueue.some((entry) => entry.id === activeQueueItemId)) {
      const nextItem = draftQueue[Math.min(index, draftQueue.length - 1)];
      loadQueueItem(nextItem.id, { persist: false, remember: false });
    } else {
      renderDraftQueue();
      updateWriteButton();
    }
    persistDraftQueue();
    setDraftDropStatus("Draft removed", queueSummaryText(), "done");
    log("Queued draft removed.");
    return true;
  }

  function loadQueueItem(id, { persist = true, remember = true } = {}) {
    const item = draftQueue.find((entry) => entry.id === id);
    if (!item) return false;
    activeQueueItemId = item.id;
    draftQueue = draftQueue.map((entry) => entry.id === item.id
      ? { ...entry, status: entry.status === "written" ? "written" : "loaded", loadedAt: new Date().toISOString() }
      : entry.status === "loaded" ? { ...entry, status: "queued" } : entry);
    markDraftQueueMediaStale();
    suppressNextTypedHistory = true;
    window.clearTimeout(draftInputHistoryTimer);
    setDraftText(item.markdown);
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
    markDraftQueueMediaStale();
    if (activeQueueItemId === completedId) activeQueueItemId = null;
    if (!draftQueue.length) {
      suppressNextTypedHistory = true;
      window.clearTimeout(draftInputHistoryTimer);
      setDraftText("");
      saveDraft();
      analyzeDraft();
      setDraftDropStatus("Markdown draft", "Paste Markdown here, choose a file, or drop .md files.", "idle");
    }
    persistDraftQueue();
    renderDraftQueue();
    updateWriteButton();
  }

  function resetQueueItemWritingState(queueItemId) {
    if (!queueItemId) return;
    draftQueue = draftQueue.map((item) =>
      item.id === queueItemId && item.status === "writing" ? { ...item, status: "queued" } : item
    );
    markDraftQueueMediaStale();
    persistDraftQueue();
    renderDraftQueue();
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
    markDraftQueueMediaStale();
    if (id === activeQueueItemId) {
      suppressNextTypedHistory = true;
      window.clearTimeout(draftInputHistoryTimer);
      setDraftText(text);
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

  function recordEditorText() {
    return els.recordEditTextarea?.value || "";
  }

  function updateRecordEditorStats() {
    if (!els.recordEditStats) return;
    const text = recordEditorText();
    setLocalizedText(els.recordEditStats, editorStatsText(text, markdownSegmentCounts(text)));
  }

  function syncRecordEditSyntaxScroll() {
    if (!els.recordEditTextarea || !els.recordEditHighlight) return;
    els.recordEditHighlight.scrollTop = els.recordEditTextarea.scrollTop;
    els.recordEditHighlight.scrollLeft = els.recordEditTextarea.scrollLeft;
  }

  function renderRecordEditHighlight() {
    renderMarkdownSyntaxHighlight(els.recordEditHighlight, recordEditorText());
    syncRecordEditSyntaxScroll();
  }

  function updateRecordEditPreview() {
    if (!els.recordEditPreviewBody) return;
    const text = recordEditorText();
    els.recordEditPreviewBody.innerHTML = text.trim()
      ? markdownPreviewHtml(text)
      : emptyMarkdownPreviewHtml();
    translateDynamicDom(els.recordEditPreview || els.recordEditSheet);
  }

  function updateRecordEditModeToggle() {
    updateEditorModeToggle(els.recordEditModeToggle, recordEditMode);
  }

  function updateRecordEditorMode(mode = recordEditMode) {
    recordEditMode = DRAFT_EDITOR_MODES.has(mode) ? mode : "edit";
    const isEdit = recordEditMode === "edit";
    if (els.recordEditBody) els.recordEditBody.dataset.mode = recordEditMode;
    if (els.recordEditInputWrap) {
      els.recordEditInputWrap.hidden = !isEdit;
      els.recordEditInputWrap.setAttribute("aria-hidden", isEdit ? "false" : "true");
    }
    if (els.recordEditTextarea) {
      els.recordEditTextarea.setAttribute("aria-hidden", isEdit ? "false" : "true");
      els.recordEditTextarea.tabIndex = isEdit ? 0 : -1;
    }
    if (els.recordEditToolbar) els.recordEditToolbar.hidden = !isEdit;
    if (els.recordEditPreview) {
      els.recordEditPreview.hidden = isEdit;
      els.recordEditPreview.dataset.previewMode = "read";
      els.recordEditPreview.setAttribute("aria-hidden", isEdit ? "true" : "false");
    }
    updateRecordEditModeToggle();
    els.recordEditToolbar?.querySelectorAll("[data-editor-command]").forEach((button) => {
      button.disabled = !isEdit;
    });
    if (isEdit) renderRecordEditHighlight();
    else updateRecordEditPreview();
  }

  function updateRecordEditorChrome() {
    updateRecordEditorStats();
    renderRecordEditHighlight();
    if (recordEditMode === "read") updateRecordEditPreview();
  }

  function handleRecordEditorInput(event = null) {
    syncProgrammaticUndoFallback(event, els.recordEditTextarea);
    clearProgrammaticHistoryOnTextInput(event, els.recordEditTextarea);
    updateRecordEditorChrome();
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
    resetEditorHistory(els.recordEditTextarea);
    if (els.recordEditWriteButton) els.recordEditWriteButton.hidden = mode !== "queue";
    updateRecordEditorMode("edit");
    updateRecordEditorChrome();
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
    const markdown = draftText();
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
      syncDraftMediaAlert(null);
      updateDraftEditorStatus();
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
      syncDraftMediaAlert(mediaUploadEstimate(parsed));
      updateDraftEditorStatus();
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

    if (mediaEstimate.overSoftLimit || mediaEstimate.nearSoftLimit) {
      rows.push({
        index: 0,
        indexLabel: "!",
        kind: "media-limit",
        label: "X Article media note",
        detail: mediaEstimate.overSoftLimit ? mediaLimitWarningText(mediaEstimate) : mediaHeadroomText(mediaEstimate),
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
    const localImages = localImageReferences(parsed);
    const remoteImages = imageSegments.filter((segment) => isRemoteHttpImageSource(segment.source));
    const absoluteLocalImages = localImages.filter((item) => shared.isAbsoluteLocalImageSource(item.source));
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
        detail: counts.text ? "Will write the body after title and cover setup starts." : "No text blocks detected.",
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
    const localImages = localImageReferences(parsed);
    const remoteImages = imageSegments.filter((segment) => isRemoteHttpImageSource(segment.source));
    const absoluteLocalImages = localImages.filter((item) => shared.isAbsoluteLocalImageSource(item.source));
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
    } else if (mediaEstimate.nearSoftLimit) {
      notes.push({ tone: "warn", kind: "media-limit", text: mediaHeadroomText(mediaEstimate) });
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
      let text = previewSegmentText(segment);
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

  function previewSegmentText(segment) {
    if (!segment) return "";
    if (segment.type === "text") return segment.text;
    if (segment.type === "image") return segment.source;
    if (segment.type === "table") return `${segment.headers.length} columns, ${segment.rows.length} rows`;
    if (segment.type === "tweet") return `Tweet ${segment.tweetId}`;
    if (segment.type === "code") return `${segment.language || "code"} · ${(segment.code || "").split("\n").length} lines`;
    if (segment.type === "divider") return "Horizontal divider";
    return "";
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
    const local = localImageReferences(parsed).length;
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
          const label = item.op.coverOnly ? "Cover image" : item.marker.includes("_TABLE_") ? "Table image" : "Image";
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
      const actionButton = item.querySelector("button[data-preflight-action]");
      if (actionButton) {
        actionButton.hidden = !check.action;
        actionButton.dataset.preflightAction = check.action || "";
        setLocalizedText(actionButton, check.button || "Choose");
      }
    }
    const gate = getImportGate(checks);
    if (els.importDraft?.closest(".actions")) {
      els.importDraft.closest(".actions").dataset.empty = latestParsed?.segments?.length ? "false" : "true";
    }
    updateWriteButton();
    updateLiveRunbook(checks, gate);
    updateProofDeck(checks, gate);
    updateCompletionAudit(checks, gate);
    updateRecoveryPanel(checks, gate);
    updateTargetContextPanel();
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
    scrollTargetIntoView(queueModeActive() ? els.draftQueue : els.draftEditorShell || els.markdown, "center");
    if (!queueModeActive()) window.setTimeout(focusDraftTextEditor, 0);
    log("Focus the Markdown editor below.");
  }

  async function runImportButtonAction() {
    await primeSuccessAudio();
    const checks = buildPreflightChecks();
    const gate = getImportGate(checks);
    const localAssetBlocker = localAssetWriteBlocker(checks);
    if (localAssetBlocker) {
      return handleLocalAssetWriteBlocker(localAssetBlocker, { chooseWhenAvailable: true });
    }
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
      applyImportHint(hint);
    }
    translateDynamicDom(actions || button);
  }

  function compactWriteHint({ hasDraft, hasQueue = false, busy = false } = {}) {
    if (busy) return { tone: "ready", text: hasQueue ? "Writing queued drafts one by one." : "Writing into the X draft. You can watch the final result in the X Article tab." };
    if (hasQueue || !hasDraft) return quietImportHint();
    const remoteCount = remoteHttpImageSegments(latestParsed).length;
    if (remoteCount) return remoteImageWriteHint(remoteCount);
    const mediaEstimate = mediaUploadEstimate(latestParsed);
    if (mediaEstimate.overSoftLimit) {
      return {
        tone: "warn",
        text: "Fix the image count in the editor."
      };
    }
    if (mediaEstimate.nearSoftLimit) {
      return {
        tone: "warn",
        text: "Close to the image limit."
      };
    }
    return quietImportHint();
  }

  function quietImportHint() {
    return { hidden: true, tone: "ready", text: "" };
  }

  function applyImportHint(hint = quietImportHint()) {
    const hidden = Boolean(hint.hidden);
    els.importHint.hidden = hidden;
    els.importHint.setAttribute("aria-hidden", hidden ? "true" : "false");
    els.importHint.dataset.tone = hint.tone || "ready";
    delete els.importHint.dataset.i18n;
    if (hidden) {
      delete els.importHint.__xposterSourceText;
      els.importHint.textContent = "";
      return;
    }
    setLocalizedText(els.importHint, hint.text || "");
  }

  function remoteImageWriteHint(remoteCount) {
    const mediaEstimate = mediaUploadEstimate(latestParsed);
    if (mediaEstimate.overSoftLimit) {
      return {
        tone: "warn",
        text: "Fix the image count in the editor."
      };
    }
    if (mediaEstimate.nearSoftLimit) {
      return {
        tone: "warn",
        text: "Close to the image limit."
      };
    }
    if (remoteImageProbeStatus.state === "checking") {
      return { tone: "ready", text: mediaEstimate.total ? mediaCapacityText(mediaEstimate) : `Web images: ${remoteCount}` };
    }
    if (remoteImageProbeStatus.state === "checked" && remoteImageProbeStatus.fail) {
      return {
        tone: "warn",
        text: `Web images: ${remoteImageProbeStatus.fail} may stay as links`
      };
    }
    return quietImportHint();
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
    const command = check.action
      ? { action: check.action, button: check.button || actions[check.id]?.button || "Fix" }
      : check.id === "assets"
        ? {}
        : actions[check.id] || {};
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
    const metadataDetail =
      metadataParts.length === 2
        ? "Title is set first; body images keep Markdown order, and the cover is matched after upload."
        : metadataParts[0] === "title"
          ? "Title will be applied when X allows it."
          : "Cover will be applied when X allows it.";
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
        id: "metadata",
        label: "Set title and cover",
        tone: importSucceeded ? "ok" : hasMetadata ? (resolvedGate.ok ? "ready" : "warn") : latestParsed ? "idle" : "idle",
        detail: hasMetadata
          ? metadataDetail
          : latestParsed
            ? "No title or cover is available to apply."
            : "Title and cover will be prepared first when available.",
        status: importSucceeded ? "Done" : hasMetadata ? (resolvedGate.ok ? "Ready" : "Waiting") : latestParsed ? "Skipped" : "Idle"
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
          ? `${plan.htmlLength} character(s) will be written after title and cover setup starts.`
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
            : "Add a draft before checking X."
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
    const localImages = localImageFolderStatus(parsed, vault);
    const localImageDetail = localImages.absoluteCount
      ? `${localImages.absoluteCount} absolute local image path(s) found. Use paths relative to the selected folder.`
      : localImages.count
        ? localImages.ready
          ? `${localImages.count} local image(s) can resolve through ${vault.name || "selected folder"}.`
          : `${localImages.count} local image(s) need a readable folder. Choose the folder that contains their relative paths.`
        : "No local image paths detected.";

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
        tone: localImages.absoluteCount ? "error" : localImages.needsFolder ? "warn" : "ok",
        detail: localImageDetail,
        action: localImages.needsFolder ? "chooseVault" : "",
        button: "Choose"
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
        localImages: localImageReferences(parsed).length
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
          localImages: localImageReferences(latestParsed)
            .map((item) => ({
              source: item.source,
              role: item.role,
              absolute: shared.isAbsoluteLocalImageSource(item.source)
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

  function localAssetWriteBlocker(checks = buildPreflightChecks()) {
    const assets = checks.find((check) => check.id === "assets");
    if (!assets || assets.tone === "ok") return null;
    const localImages = localImageFolderStatus();
    if (!localImages.count) return null;
    return {
      tone: assets.tone,
      title: localImages.absoluteCount ? "Local image path blocked" : "Local image folder needed",
      detail: assets.detail,
      action: assets.action || ""
    };
  }

  async function handleLocalAssetWriteBlocker(blocker, { chooseWhenAvailable = false, queueItemId = null } = {}) {
    log(blocker.detail || "Choose the local image folder before writing.");
    setDraftDropStatus(blocker.title, blocker.detail || "Choose the local image folder before writing.", "error");
    openDetailsFor(els.preflightPanel);
    scrollTargetIntoView(els.preflightPanel, "center");
    updateWriteButton();
    activeWriteQueueItemId = null;
    if (queueItemId) resetQueueItemWritingState(queueItemId);
    if (chooseWhenAvailable && blocker.action === "chooseVault") {
      await chooseVault();
    }
    return { ok: false, error: blocker.detail, localAssets: true };
  }

  function getImportGate(checks) {
    const byId = new Map(checks.map((check) => [check.id, check]));
    const requiresBridge = (latestCounts.code || 0) + (latestCounts.divider || 0) + (latestCounts.tweet || 0) > 0;
    const requiresUploads = (latestCounts.image || 0) + (latestCounts.table || 0) > 0;
    const requiresAssets = Boolean(localImageFolderStatus().count);
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
      byId.get("assets")?.tone === "error" ||
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
    window.clearTimeout(draftDropStatusTimer);
    draftDropStatusTimer = null;
    if (tone !== "error") {
      dismissDraftDropStatus();
      return;
    }
    els.draftDropStatus.dataset.tone = tone;
    els.draftDropStatus.hidden = false;
    els.draftDropStatus.setAttribute("role", "alert");
    if (els.draftDropDismiss) els.draftDropDismiss.hidden = false;
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
    if (els.importHint) applyImportHint({ tone: "done", text: "Written. Review in X." });
  }

  function dismissDraftDropStatus() {
    if (!els.draftDropStatus) return;
    window.clearTimeout(draftDropStatusTimer);
    draftDropStatusTimer = null;
    els.draftDropStatus.hidden = true;
    els.draftDropStatus.dataset.tone = "idle";
    if (els.draftDropDismiss) els.draftDropDismiss.hidden = true;
  }

  function acknowledgeDraftInput() {
    const target = els.draftEditorShell || els.markdown;
    if (!target) return;
    target.classList.remove("draft-ack");
    void target.offsetWidth;
    target.classList.add("draft-ack");
    window.setTimeout(() => target.classList.remove("draft-ack"), 520);
  }

  function draftReadyDetail(length, counts = latestCounts) {
    const resolvedCounts = counts || shared.segmentCounts([]);
    return [
      formatCompactUnit(length, "char", "chars", "字符"),
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
    } else if (eventName === "preflight-blocked") {
      latestProgress.state = "error";
      latestProgress.level = "warn";
      latestProgress.error = payload.error || payload.text || "Check the draft before writing.";
      latestProgress.text = payload.text || latestProgress.error;
      latestProgress.detail = payload.error || payload.text || "Check the draft before writing.";
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
    if (eventName === "preflight-blocked") return "warn";
    if (eventName === "parsed") return "work";
    return "work";
  }

  function progressTextForEvent(eventName, payload) {
    if (eventName === "status") return localizeText(payload.text || "Status update");
    if (eventName === "parsed") return "Markdown parsed";
    if (eventName === "complete") return "Writing complete";
    if (eventName === "cancelled") return payload.reason || "Writing stopped by user.";
    if (eventName === "preflight-blocked") return payload.text || payload.error || "Check the draft before writing.";
    if (eventName === "error") return payload.error || "Writing failed";
    return localizeText(payload.text || eventName);
  }

  function progressDetailForStatus(text) {
    if (/prepar|准备/i.test(text)) return localizeText("Preparing Markdown, images, and the X editor.");
    if (/title|cover|标题|封面/i.test(text)) return localizeText("Setting article title and matching cover after ordered uploads.");
    if (/writing|paste|structured|写入/i.test(text)) return localizeText("Writing the article body into X.");
    if (/upload|上传/i.test(text)) return localizeText("Uploading prepared images and rendered tables through X.");
    if (/reorder|marker|special|insert|放置|清理/i.test(text)) return localizeText("Placing images, tweets, code, and dividers into the article.");
    if (/imported|written|complete|完成|已写入/i.test(text)) return localizeText("Writing finished.");
    return text ? localizeText(text) : localizeText("Live status received from the active X tab.");
  }

  function progressPercentForStatus(text, level) {
    if (level === "done") return 100;
    if (level === "error") return 100;
    if (/prepar/i.test(text)) return 14;
    if (/title/i.test(text)) return 24;
    if (/writing|paste/i.test(text)) return 46;
    if (/special|insert|marker/i.test(text)) return 58;
    if (/upload/i.test(text)) return 70;
    if (/reorder/i.test(text)) return 82;
    if (/cover/i.test(text)) return 74;
    if (/cleanup/i.test(text)) return 94;
    return 18;
  }

  function summarizeProgressCompletion(summary) {
    if (!summary) return localizeText("Writing finished.");
    const images = summary.images || {};
    const warnings = summary.mediaWarnings || {};
    const main = summary.main || {};
    const uploadFailures = mediaUploadFailureCounts(main);
    const coverFailures = coverApplicationFailureCount(summary, uploadFailures);
    const imageTotal = (images.ok || 0) + (images.fail || 0);
    const atomicTotal = (main.atomicOk || 0) + (main.atomicFail || 0);
    const elapsed = summary.elapsedMs ? `${(summary.elapsedMs / 1000).toFixed(1)}s` : "elapsed time unknown";
    if (uploadFailures.timeout) {
      return `${uploadFailures.timeout} image upload(s) timed out in X; ${images.ok || 0}/${imageTotal} media item(s), ${elapsed}.`;
    }
    if (warnings.total || main.imgFail || coverFailures) {
      const bodyImages = Number(warnings.images || 0) + uploadFailures.image;
      const tableImages = Number(warnings.tables || 0) + uploadFailures.table;
      const coverImages = Number(warnings.covers || 0) + uploadFailures.cover + coverFailures;
      const parts = [];
      if (bodyImages) parts.push(`${bodyImages} body image(s) kept as Markdown links`);
      if (tableImages) parts.push(`${tableImages} table image(s) kept as Markdown tables`);
      if (coverImages) parts.push(`${coverImages} cover image(s) not applied`);
      return `${parts.join("; ")}; ${main.atomicOk || 0}/${atomicTotal} embed/code item(s), ${elapsed}.`;
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
      coverApplicationFailureCount(summary) ||
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

  function syncRecordPanel({ translate = els.recordsPanel?.classList.contains("active") } = {}) {
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
    if (translate) translateDynamicDom(els.recordsPanel);
  }

  function syncPanelLayout() {
    syncRecordPanel({ translate: false });
  }

  function paintStartupShell() {
    applyTheme(currentThemeMode);
    populateLanguageSelect();
    setDraftEditorMode("edit");
    syncPanelLayout();
    restoreVaultState();
    updateLiveProgress();
    syncDraftSurface();
    updateWriteButton();
  }

  async function restoreStartupState() {
    if (!hasChromeApi()) {
      applyTheme(currentThemeMode);
      applyImportOptions(importOptions, { refresh: false });
      applyArticleExportOptions(articleExportOptions);
      applySuccessFeedbackOptions(successFeedbackOptions);
      await restoreLanguage();
      analyzeDraft();
      return;
    }
    const stored = await startupStorage();
    applyTheme(stored[STORAGE_THEME] || currentThemeMode);
    applyImportOptions(stored[STORAGE_IMPORT_OPTIONS] || importOptions, { refresh: false });
    applyArticleExportOptions(stored[STORAGE_ARTICLE_EXPORT_SETTINGS] || articleExportOptions);
    applySuccessFeedbackOptions(stored[STORAGE_SUCCESS_FEEDBACK] || successFeedbackOptions);
    applyStartupDraftState(stored);
    await restoreLanguage();
    for (const input of getLiveResultItems()) {
      input.checked = Boolean((stored[STORAGE_LIVE_RESULT] || {})[input.dataset.liveCheck]);
    }
    liveResultChecks = stored[STORAGE_LIVE_RESULT] || {};
    updateLiveResultMeta();
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
    const localAssetsPending = byId.get("assets")?.tone === "warn" && byId.get("assets")?.action;
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
            : byId.get("assets")?.action
              ? byId.get("assets").action
              : "check",
        button:
          byId.get("draft")?.tone !== "ok"
            ? "Add Markdown"
            : byId.get("target")?.tone !== "ok"
              ? "Open"
            : byId.get("page-script")?.tone !== "ok"
              ? "Refresh X"
            : byId.get("assets")?.action
              ? byId.get("assets").button || "Choose"
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
    document.querySelectorAll(`.panel[data-panel="${CSS.escape(target)}"]`).forEach((panel) => translateDynamicDom(panel));
    if (target === "records") {
      void ensureRecordHistoryRestored({ render: true }).then(() => {
        syncRecordPanel({ translate: true });
      });
    }
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
      markDraftQueueMediaStale();
      renderDraftQueue();
    }
    const parsed = ensureLatestParsedFromDraft();
    updatePreflight();
    const localAssetBlocker = localAssetWriteBlocker(buildPreflightChecks());
    if (localAssetBlocker) {
      return handleLocalAssetWriteBlocker(localAssetBlocker, { queueItemId });
    }
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
    if (mediaEstimate.overSoftLimit) {
      const message = mediaLimitWarningText(mediaEstimate);
      log(message);
      recordLiveProgressEvent("preflight-blocked", { text: message, error: message, level: "warn", mediaLimit: true });
      updateWriteButton();
      activeWriteQueueItemId = null;
      resetQueueItemWritingState(queueItemId);
      return { ok: false, error: message, mediaLimit: true };
    }
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
      resetQueueItemWritingState(queueItemId);
      return { ok: false, error: target.reason || "Could not prepare X Article." };
    }
    if (importCancelRequested) {
      importCancelRequested = false;
      log("Writing stopped by user.");
      recordLiveProgressEvent("cancelled", { reason: "Writing stopped by user." });
      updateWriteButton();
      updateLiveProgress();
      activeWriteQueueItemId = null;
      resetQueueItemWritingState(queueItemId);
      return { ok: false, error: "Writing stopped by user.", cancelled: true };
    }
    if (queueItemId) {
      draftQueue = draftQueue.map((item) => item.id === queueItemId ? { ...item, status: "writing" } : item);
      markDraftQueueMediaStale();
      persistDraftQueue();
      renderDraftQueue();
    }
    const response = await sendToActiveTab({
      type: "xposter:import-markdown",
      markdown,
      options: writeOptionsPayload({ forceNewArticle: batch })
    });
    importCancelRequested = false;
    if (response?.ok) {
      const seconds = ((response.summary?.elapsedMs || 0) / 1000).toFixed(1);
      const warnings =
        Number(response.summary?.mediaWarnings?.total || 0) +
        Number(response.summary?.main?.imgFail || 0) +
        coverApplicationFailureCount(response.summary);
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
      resetQueueItemWritingState(queueItemId);
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
    return importMarkdownDraft(draftText());
  }

  async function importQueueItem(id) {
    const item = draftQueue.find((entry) => entry.id === id);
    if (!item) return { ok: false, error: "Queued draft not found" };
    activeQueueItemId = item.id;
    suppressNextTypedHistory = true;
    window.clearTimeout(draftInputHistoryTimer);
    setDraftText(item.markdown);
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
    const uploadFailures = mediaUploadFailureCounts(summary.main);
    const coverFailures = coverApplicationFailureCount(summary, uploadFailures);
    const bodyImageWarnings = Number(summary.mediaWarnings?.images || 0) + uploadFailures.image;
    const tableImageWarnings = Number(summary.mediaWarnings?.tables || 0) + uploadFailures.table;
    const coverImageWarnings = Number(summary.mediaWarnings?.covers || 0) + uploadFailures.cover + coverFailures;
    const hasWarnings = hasRunSummaryWarnings(summary);
    els.runSummary.dataset.tone = hasWarnings ? "warn" : "done";
    if (els.summaryMessage) {
      els.summaryMessage.dataset.tone = hasWarnings ? "warn" : "done";
      els.summaryMessage.textContent = summarizeRunMessage(summary);
    }
    els.summaryImages.textContent = bodyImageWarnings || tableImageWarnings || coverImageWarnings
      ? [
          imageOk ? `${imageOk} uploaded` : "",
          bodyImageWarnings ? `${bodyImageWarnings} body kept` : "",
          tableImageWarnings ? `${tableImageWarnings} table kept` : "",
          coverImageWarnings ? `${coverImageWarnings} cover missed` : ""
        ].filter(Boolean).join(", ")
      : imageOk
        ? `Uploaded ${imageOk}`
        : `${imageOk} / ${imageOk + imageFail}`;
    const main = summary.main || {};
    els.summaryBlocks.textContent = `${main.atomicOk || 0} / ${(main.atomicOk || 0) + (main.atomicFail || 0)}`;
    els.summaryTitle.textContent = summarizeTitleResult(main.title);
    els.summaryCover.textContent = summarizeCoverResult(main.cover);
    els.summaryElapsed.textContent = `${((summary.elapsedMs || 0) / 1000).toFixed(1)}s`;
    translateDynamicDom(els.runSummary);
    scheduleRunSummaryCollapse(summary);
  }

  function mediaUploadFailureCounts(main = {}) {
    const counts = { image: 0, table: 0, cover: 0, timeout: 0 };
    const errors = Array.isArray(main?.imageErrors) ? main.imageErrors : [];
    for (const error of errors) {
      if (/upload took too long|timed out|timeout/i.test(error?.error || "")) {
        counts.timeout += 1;
        continue;
      }
      const kind = error?.kind === "table" || error?.kind === "cover" ? error.kind : "image";
      counts[kind] += 1;
    }
    const unclassified = Math.max(0, Number(main?.imgFail || 0) - errors.length);
    counts.image += unclassified;
    return counts;
  }

  function coverApplicationFailureCount(summary = {}, uploadFailures = null) {
    const cover = summary?.main?.cover || {};
    if (!cover.requested || cover.graphql?.ok) return 0;
    const counts = uploadFailures || mediaUploadFailureCounts(summary?.main);
    const explicitCoverFailures = Number(summary?.mediaWarnings?.covers || 0) + Number(counts.cover || 0);
    return explicitCoverFailures ? 0 : 1;
  }

  function summarizeRunMessage(summary) {
    const elapsed = summary.elapsedMs ? `${(summary.elapsedMs / 1000).toFixed(1)}s` : "";
    const images = summary.images || {};
    const uploaded = Number(images.ok || 0);
    const uploadFailures = mediaUploadFailureCounts(summary.main);
    const coverFailures = coverApplicationFailureCount(summary, uploadFailures);
    const keptImages = Number(summary.mediaWarnings?.images || 0) + uploadFailures.image;
    const keptTables = Number(summary.mediaWarnings?.tables || 0) + uploadFailures.table;
    const missedCovers = Number(summary.mediaWarnings?.covers || 0) + uploadFailures.cover + coverFailures;
    if (uploadFailures.timeout) {
      return `Article written${elapsed ? ` in ${elapsed}` : ""}. ${uploadFailures.timeout} image upload(s) timed out in X. Wait a moment, then write again or split the article if it has many images.`;
    }
    if (keptImages || keptTables || missedCovers) {
      const parts = [];
      if (keptImages) parts.push(`${keptImages} body image(s) stayed as Markdown links`);
      if (keptTables) parts.push(`${keptTables} table image(s) stayed as Markdown tables`);
      if (missedCovers) parts.push(`${missedCovers} cover image(s) could not be applied`);
      const recovery = keptImages
        ? " Replace private or expired URLs with public links if they must upload."
        : "";
      return `Article written${elapsed ? ` in ${elapsed}` : ""}. ${parts.join("; ")}.${recovery}`;
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
    updateLiveRunbook();
    updateProofDeck();
    updateCompletionAudit();
    updateRecoveryPanel();
    updateProgressiveSections();
  }

  function saveLiveResultChecks() {
    liveResultChecks = Object.fromEntries(getLiveResultItems().map((input) => [input.dataset.liveCheck, Boolean(input.checked)]));
    updateLiveResultMeta();
    if (hasChromeApi()) chrome.storage.local.set({ [STORAGE_LIVE_RESULT]: liveResultChecks });
  }

  async function restoreLiveResultChecks() {
    if (hasChromeApi()) {
      const stored = await startupStorage();
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
          ? draftReadyDetail(draftText().length)
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

  async function chooseVault() {
    const response = await sendToActiveTab({ type: "xposter:choose-vault" });
    if (response?.ok) {
      log(localizeInterpolated("Local image folder set: {name}.", { name: response.name }));
      await refreshPageState();
      updatePreflight();
      return;
    }
    if (response?.skipped) log("Local image folder selection skipped.");
    else log(localizeInterpolated("Local image folder setup failed: {error}", {
      error: localizeText(response?.error || "open an X page first")
    }));
  }

  async function clearVault() {
    const response = await sendToActiveTab({ type: "xposter:clear-vault" });
    if (response?.ok) {
      log("Local image folder cleared.");
      await refreshPageState();
      return;
    }
    log(localizeInterpolated("Could not clear local image folder: {error}", {
      error: localizeText(response?.error || "open an X page first")
    }));
  }

  function saveDraft() {
    if (!hasChromeApi()) return;
    window.clearTimeout(draftSaveTimer);
    draftSaveTimer = null;
    chrome.storage.local.set({ [STORAGE_DRAFT]: draftText() });
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
    const stored = await startupStorage();
    restoreDraftFromStoredValue(stored[STORAGE_DRAFT], { analyze: true });
  }

  function installDraftStorageSync() {
    if (!hasChromeApi() || !chrome.storage?.onChanged) return;
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== "local") return;
      if (changes[STORAGE_DRAFT]) {
        const nextDraft = String(changes[STORAGE_DRAFT].newValue || "");
        if (!queueModeActive() && nextDraft !== draftText()) {
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
      markDraftQueueMediaStale();
      if (activeQueueItemId && !draftQueue.some((item) => item.id === activeQueueItemId)) activeQueueItemId = null;
        if (draftQueue.length > previousLength) {
          markQueueItemsEntered(draftQueue.filter((item) => !previousIds.has(item.id)));
        }
        renderDraftQueue();
        if (draftQueue.length > previousLength) {
          showWorkspacePanel("draft");
          showQueuedDraftAdded(draftQueue.length - previousLength);
        }
      }
    });
  }

  async function restoreVaultState() {
    setLocalizedText(els.vaultState, "Choose from an active X page");
    setLocalizedText(els.vaultDetail, "Choose from an active X page when Markdown uses relative image paths.");
    setLocalizedText(els.vaultSettingsText, "xPoster will ask when a Markdown draft uses local image paths.");
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
      els.vaultDetail.textContent = "When a draft uses relative image paths, choose the folder that contains them.";
      els.vaultSettingsText.textContent = "No folder connected. xPoster will ask when a draft needs local images.";
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
    if (els.clearVault) els.clearVault.disabled = !enabled;
    if (els.clearVaultSettings) els.clearVaultSettings.disabled = !enabled;
  }

  async function runPreflight() {
    els.runPreflight.disabled = true;
    setLocalizedText(els.runPreflight, "Checking...");
    log("Publishing check started.");
    await refreshPageState();
    const response = await sendToActiveTab({ type: "xposter:diagnostics" });
    latestDiagnostics = response?.ok ? response : { ok: false, error: response?.error || "Diagnostics unavailable" };
    await refreshRemoteImageAccessStatus(latestParsed);
    const locked = response?.ok ? lockTargetContext("preflight") : null;
    if (locked) {
      log(localizeInterpolated("Article confirmed: {target}.", {
        target: locked.context.articleId
          ? `${localizeText("Article")} ${locked.context.articleId}`
          : localizeText("the open X Article")
      }));
    }
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
    setLocalizedText(els.runPreflight, "Check");
  }

  function captureEvidence(kind, payload) {
    const checks = buildPreflightChecks();
    const gate = getImportGate(checks);
    const targetContext = payload?.targetContext || buildTargetContextEvidence();
    const markdown = draftText();
    const snapshot = markdownSnapshot(markdown);
    latestEvidence = {
      id: newRecordId(kind.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "record"),
      kind,
      capturedAt: new Date().toISOString(),
      draftRecordId: activeDraftRecordId || null,
      draftFingerprint: activeDraftFingerprint || draftFingerprint(markdown),
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
    setEvidenceRecordMeta(kind);
    els.evidenceText.textContent = JSON.stringify(latestEvidence, jsonSafeReplacer, 2);
    els.copyEvidence.disabled = false;
    updateProgressiveSections();
    updateLiveRunbook(checks, gate);
    updateProofDeck(checks, gate);
    updateCompletionAudit(checks, gate);
    updateRecoveryPanel(checks, gate);
    updateTargetContextPanel();
    translateDynamicDom();
  }

  function addRecordHistoryEntry(evidence) {
    if (!evidence) return;
    const previous = currentRecord(evidence.id) || (evidence.kind === "draft-loaded" ? currentDraftRecord(evidence.draftRecordId) : null);
    const entry = normalizeRecordHistoryEntry(evidence, previous);
    if (!recordHistoryRestored) {
      pendingRecordHistoryEntries = [entry, ...pendingRecordHistoryEntries.filter((item) => item.id !== entry.id)].slice(0, MAX_RECORD_HISTORY);
      recordHistory = [entry, ...recordHistory.filter((item) => item.id !== entry.id)].slice(0, MAX_RECORD_HISTORY);
      void ensureRecordHistoryRestored({ render: false }).then(() => {
        persistRecordHistory();
        if (els.recordsPanel?.classList.contains("active")) renderRecordHistory();
      });
      renderRecordHistory();
      return;
    }
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
    const warnings = Number(summary?.mediaWarnings?.total || 0) + uploadFail + coverApplicationFailureCount(summary);
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
    if (record.articleId) return localizeInterpolated("Article {id}", { id: record.articleId });
    if (record.route === "editor") return localizeText("Article editor open");
    if (record.route === "articles") return localizeText("X Articles list");
    if (record.route && record.route !== "none") return localizeInterpolated("X page: {route}", { route: record.route });
    return localizeText("No X Article linked yet");
  }

  function formatRecordDraftStats(record) {
    const parts = [];
    if (record.blocks) parts.push(formatCompactUnit(record.blocks, "block", "blocks", "个内容块", { zhTenThousand: false }));
    if (record.characters) parts.push(formatCompactUnit(record.characters, "char", "chars", "字符"));
    if (record.remoteImages?.count) {
      parts.push(formatCompactUnit(record.remoteImages.count, "remote image", "remote images", "张网页图片", { zhTenThousand: false }));
    }
    return parts.join(", ") || localizeText("No draft stats");
  }

  function formatRecordImageText(record) {
    if (record.images.warnings) {
      return localizeInterpolated("{uploaded} image(s) uploaded, {kept} kept as links", {
        uploaded: record.images.ok,
        kept: record.images.warnings
      });
    }
    if (record.images.ok || record.images.fail) {
      return localizeInterpolated("{count} image(s) uploaded", { count: record.images.ok });
    }
    return localizeText("No image upload result");
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
    if (dayDiff === 0) return localizeInterpolated("Today {time}", { time });
    if (dayDiff === 1) return localizeInterpolated("Yesterday {time}", { time });
    return date.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  function recordRecoveryStats(record) {
    const items = [];
    if (record.characters) items.push(formatCompactUnit(record.characters, "char", "chars", "字"));
    if (record.blocks) items.push(formatCompactUnit(record.blocks, "block", "blocks", "块", { zhTenThousand: false }));
    if (record.remoteImages?.count) items.push(formatCompactUnit(record.remoteImages.count, "image", "images", "图", { zhTenThousand: false }));
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

  function normalizeRecordTitleToken(value) {
    return String(value || "")
      .replace(/\.[a-z0-9]{1,10}$/i, "")
      .replace(/…$/u, "")
      .replace(/[\s_.\-—–·•|｜:：/\\()[\]{}【】（）《》"'“”‘’.,，。]+/gu, "")
      .toLowerCase();
  }

  function shouldShowRecordFileName(displayTitle, fileName) {
    const fileText = String(fileName || "").trim();
    if (!fileText) return false;
    const titleKey = normalizeRecordTitleToken(displayTitle);
    const fileKey = normalizeRecordTitleToken(fileText);
    if (!titleKey || !fileKey) return true;
    if (titleKey === fileKey) return false;
    return !(Math.min(titleKey.length, fileKey.length) >= 16 && (titleKey.startsWith(fileKey) || fileKey.startsWith(titleKey)));
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

  function syncLatestEvidenceRecord() {
    if (!latestEvidence) return;
    setEvidenceRecordMeta(latestEvidence.kind, latestEvidence.capturedAt);
    els.evidenceText.textContent = JSON.stringify(latestEvidence, jsonSafeReplacer, 2);
    els.copyEvidence.disabled = false;
  }

  async function restoreRecordHistory({ render = true } = {}) {
    if (!hasChromeApi()) {
      if (render) renderRecordHistory();
      recordHistoryRestored = true;
      return recordHistory;
    }
    const stored = await chrome.storage.local.get(STORAGE_RECORD_HISTORY).catch(() => ({}));
    const storedHistory = Array.isArray(stored[STORAGE_RECORD_HISTORY])
      ? stored[STORAGE_RECORD_HISTORY].slice(0, MAX_RECORD_HISTORY).map(normalizeStoredRecordHistoryEntry)
      : [];
    const pending = pendingRecordHistoryEntries;
    pendingRecordHistoryEntries = [];
    recordHistory = [...pending, ...storedHistory.filter((item) => !pending.some((pendingItem) => pendingItem.id === item.id))]
      .slice(0, MAX_RECORD_HISTORY);
    latestEvidence = recordHistory[0]?.evidence || latestEvidence;
    recordHistoryRestored = true;
    if (render) {
      syncLatestEvidenceRecord();
      renderRecordHistory();
      updateProgressiveSections();
    }
    if (pending.length) persistRecordHistory();
    return recordHistory;
  }

  function ensureRecordHistoryRestored({ render = false } = {}) {
    if (recordHistoryRestored) {
      if (render) {
        syncLatestEvidenceRecord();
        renderRecordHistory();
      }
      return Promise.resolve(recordHistory);
    }
    if (!recordHistoryRestorePromise) {
      recordHistoryRestorePromise = restoreRecordHistory({ render }).catch(() => {
        recordHistoryRestored = true;
      });
    }
    return recordHistoryRestorePromise.then(() => {
      if (render) renderRecordHistory();
      return recordHistory;
    });
  }

  function scheduleRecordHistoryRestore() {
    runWhenIdle(() => {
      void ensureRecordHistoryRestored({ render: false });
    }, STARTUP_IDLE_TIMEOUT_MS);
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
        ? isSearching
          ? localizeInterpolated("{count} found", { count: visibleTotal })
          : localizeInterpolated("{count} draft(s)", { count: total })
        : localizeText("No drafts");
    }
    if (els.recordSearchInput && els.recordSearchInput.value !== recordSearchQuery) {
      els.recordSearchInput.value = recordSearchQuery;
    }
    if (els.recordSearchSummary) {
      const searchSummary = total
      ? isSearching
        ? localizeInterpolated("{count} found", { count: visibleTotal })
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
    const fileNameHtml = shouldShowRecordFileName(displayTitle, fileName) ? `<span class="record-file-name">${safe(fileName)}</span>` : "";
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
            ${summaryHtml}
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
    setLocalizedText(els.evidenceMeta, "No technical record saved yet.");
    setLocalizedText(els.evidenceText, "Run Check article or Write article to save a technical record.");
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

  function openNewDraftEditor() {
    focusMarkdownInput();
  }

  function openQueueEditor(queueId) {
    const item = draftQueue.find((entry) => entry.id === queueId);
    if (!item) return;
    configureMarkdownEditor({
      title: queueItemDisplayTitle(item) || localizeText("Queued Markdown"),
      meta: formatCompactUnit(item.characters || 0, "char", "chars", "字符"),
      value: item.markdown,
      primaryLabel: "Save",
      mode: "queue",
      id: item.id
    });
  }

  function closeMarkdownEditor() {
    activeRecordEditorId = null;
    activeDraftEditor = null;
    resetEditorHistory(els.recordEditTextarea);
    if (els.recordEditTextarea) {
      els.recordEditTextarea.value = "";
      els.recordEditTextarea.dataset.editorMode = "";
      els.recordEditTextarea.dataset.recordId = "";
      els.recordEditTextarea.dataset.queueId = "";
    }
    updateRecordEditorMode("edit");
    if (els.recordEditWriteButton) els.recordEditWriteButton.hidden = true;
    setMarkdownEditorOpen(false);
  }

  async function copyEditedMarkdown() {
    const edited = recordEditorText();
    await copyMarkdownText(edited, {
      fallbackRecordId: activeDraftEditor?.mode === "record" ? activeDraftEditor.id : null,
      success: "Edited Markdown copied.",
      fallback: "Markdown is open in the editor."
    });
  }

  function saveEditedMarkdown() {
    const edited = recordEditorText();
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
    const edited = recordEditorText();
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
    } else if (action === "copy-markdown") {
      await copyRecordMarkdown(recordId);
    } else {
      await handleMarkdownEditorAction(action);
    }
  }

  async function handleMarkdownEditorAction(action) {
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

  async function handleMarkdownEditorClick(event) {
    const button = event.target.closest("button[data-record-action]");
    if (!button) return;
    const action = button.dataset.recordAction;
    if (action === "cancel-edit") {
      closeMarkdownEditor();
    } else if (action === "editor-command") {
      updateRecordEditorMode("edit");
      applyTextareaCommand(button.dataset.editorCommand, {
        textarea: els.recordEditTextarea,
        onChange: handleRecordEditorInput
      });
      els.recordEditTextarea?.focus?.();
    } else if (action === "toggle-preview") {
      updateRecordEditorMode(recordEditMode === "read" ? "edit" : "read");
    } else {
      await handleMarkdownEditorAction(action);
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
          : "Add a draft before checking X."
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
    setLocalizedText(els.evidenceMeta, "Record package generated");
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
      setLocalizedText(els.evidenceMeta, "Publish summary generated");
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

  async function runRunbookAction(action) {
    switch (action) {
      case "addDraft":
        openNewDraftEditor();
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
        await importDraft();
        break;
      case "liveResult":
        scrollTargetIntoView(els.liveResultList, "center");
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

  els.markdown.addEventListener("keydown", (event) => {
    handleTextareaUndoShortcut(event, { textarea: els.markdown, onChange: handleDraftEditorInput });
  });
  els.markdown.addEventListener("input", (event) => handleDraftEditorInput({ event }));
  els.markdown.addEventListener("paste", () => handleDraftEditorInput({ pasted: true }));
  els.markdown.addEventListener("scroll", syncDraftSyntaxScroll);
  els.draftEditorToolbar?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-editor-command]");
    if (!button) return;
    runDraftEditorCommand(button.dataset.editorCommand);
  });
  els.draftEditorModeToggle?.addEventListener("click", () => {
    setDraftEditorMode(draftEditorMode === "read" ? "edit" : "read");
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
  els.runPreflight.addEventListener("click", runPreflight);
  els.loadFile.addEventListener("click", loadFile);
  els.draftDropDismiss?.addEventListener("click", dismissDraftDropStatus);
  els.pickVault.addEventListener("click", chooseVault);
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
  els.draftQueueList?.addEventListener("click", handleDraftQueueClick);
  els.recordEditSheet?.addEventListener("click", (event) => {
    if (event.target === els.recordEditSheet) closeMarkdownEditor();
  });
  els.recordEditSheet?.addEventListener("click", handleMarkdownEditorClick);
  els.recordEditTextarea?.addEventListener("keydown", (event) => {
    handleTextareaUndoShortcut(event, { textarea: els.recordEditTextarea, onChange: handleRecordEditorInput });
  });
  els.recordEditTextarea?.addEventListener("input", handleRecordEditorInput);
  els.recordEditTextarea?.addEventListener("scroll", syncRecordEditSyntaxScroll);
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
      soundStyle: els.successSoundStyle?.value || "soft"
    });
  });
  els.successSoundStyle?.addEventListener("change", () => {
    void setSuccessFeedbackOptions({
      ...successFeedbackOptions,
      soundStyle: els.successSoundStyle.value || "soft"
    });
    void previewSuccessFeedback();
  });
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
  els.preflightList?.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-preflight-action]");
    if (!button) return;
    await runRunbookAction(button.dataset.preflightAction);
  });
  els.recoveryList?.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-recovery-action]");
    if (!button) return;
    await runRunbookAction(button.dataset.recoveryAction);
  });
  getLiveResultItems().forEach((input) => input.addEventListener("change", saveLiveResultChecks));
  paintStartupShell();
  installDraftStorageSync();
  installDraftDropTray();
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      showWorkspacePanel(tab.dataset.tab);
    });
  });

  restoreStartupState().catch(() => analyzeDraft());
  installSystemThemeSync();
  scheduleRecordHistoryRestore();
  runWhenIdle(() => {
    void refreshPageState();
  }, STARTUP_PAGE_STATE_TIMEOUT_MS);
  window.setInterval(refreshPageState, 2500);
})();
