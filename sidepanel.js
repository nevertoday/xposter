(() => {
  const shared = window.xPosterShared;
  const i18n = window.xPosterI18n;
  const sidepanelConfig = window.xPosterSidepanelConfig;
  const sidepanelElements = window.xPosterSidepanelElements;
  const sidepanelEditor = window.xPosterSidepanelEditor;
  const els = sidepanelElements.collectSidepanelElements();
  const {
    IMPORT_ICON_SVG,
    STORAGE_DRAFT,
    STORAGE_LIVE_RESULT,
    STORAGE_LANGUAGE,
    STORAGE_THEME,
    STORAGE_IMPORT_OPTIONS,
    STORAGE_ARTICLE_EXPORT_SETTINGS,
    STORAGE_SUCCESS_FEEDBACK,
    STORAGE_AI_COVER_SETTINGS,
    STORAGE_RECORD_HISTORY,
    STORAGE_DRAFT_QUEUE,
    STORAGE_TARGET_TAB,
    MAX_RECORD_HISTORY,
    MAX_DRAFT_QUEUE,
    MAX_DRAFT_QUEUE_STORAGE_BYTES,
    MAX_DRAFT_QUEUE_ITEM_BYTES,
    MAX_RECORD_MARKDOWN_CHARS,
    X_ARTICLE_MEDIA_SOFT_LIMIT,
    X_ARTICLE_MEDIA_HEADROOM_THRESHOLD,
    X_ARTICLE_MEDIA_LIMIT_WARNING,
    X_ARTICLE_MEDIA_HEADROOM_NOTE,
    X_ARTICLE_MEDIA_CAPACITY_NOTE,
    MARKDOWN_FILE_RE,
    MARKDOWN_FILE_ACCEPT,
    MARKDOWN_TRANSFER_MIME_RE,
    MARKDOWN_LOAD_ERROR_TITLE,
    MARKDOWN_LOAD_ERROR_DETAIL,
    NO_NEW_DRAFTS_DETAIL,
    DRAFT_EDITOR_MODES,
    EDITOR_HISTORY_LIMIT,
    DRAFT_SAVE_DELAY_MS,
    DRAFT_ANALYZE_DELAY_MS,
    RECORD_SEARCH_DELAY_MS,
    STARTUP_DRAFT_ANALYZE_DELAY_MS,
    STARTUP_IDLE_TIMEOUT_MS,
    STARTUP_PAGE_STATE_TIMEOUT_MS,
    STARTUP_STORAGE_KEYS,
    SYNTAX_HIGHLIGHT_DETAIL_LIMIT,
    THEME_MODES,
    SUCCESS_SOUND_VOLUME,
    SUCCESS_SOUND_PRESETS,
    SUCCESS_SOUND_STYLES,
    SUCCESS_CELEBRATION_COLORS,
    AI_COVER_DEFAULT_BASE_URL,
    AI_COVER_DEFAULT_MODEL,
    AI_COVER_REQUEST_SIZE,
    AI_COVER_OUTPUT_WIDTH,
    AI_COVER_OUTPUT_HEIGHT,
    AI_COVER_MAX_ROUNDS,
    AI_COVER_MAX_IMAGES_PER_ROUND,
    CONTENT_VERSION_UNKNOWN,
    EXTENSION_PATH
  } = sidepanelConfig;
  const EXTENSION_VERSION =
    typeof chrome !== "undefined" && chrome.runtime?.getManifest
      ? chrome.runtime.getManifest().version
      : "dev";
  const AI_COVER_MAX_CANDIDATES = 12;
  const AI_COVER_IMAGE_FETCH_TIMEOUT_MS = 30000;
  const AI_COVER_GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai";
  const AI_COVER_GEMINI_DEFAULT_MODEL = "gemini-2.5-flash-image";
  const AI_COVER_API_PROVIDER_PRESETS = [
    { id: "openai", label: "OpenAI", baseUrl: AI_COVER_DEFAULT_BASE_URL, defaultModel: AI_COVER_DEFAULT_MODEL },
    { id: "gemini", label: "Gemini", baseUrl: AI_COVER_GEMINI_BASE_URL, defaultModel: AI_COVER_GEMINI_DEFAULT_MODEL },
    { id: "custom", label: "OpenAI-compatible API", baseUrl: "", defaultModel: "" }
  ];
  const SUPPORT_METHOD_COPY = {
    coffee: {
      title: "Buy Me a Coffee",
      subtitle: "Open the Buy Me a Coffee code only for this support method."
    },
    wechat: {
      title: "WeChat",
      subtitle: "Open the WeChat appreciation code only for this support method."
    }
  };
  const workspaceTabs = [...document.querySelectorAll(".tab")];
  const workspacePanels = [...document.querySelectorAll(".panel")];
  const workspaceTopbar = document.querySelector(".topbar");
  const workspaceTabsContainer = document.querySelector(".tabs");
  const themeModeInputs = els.themeChoice ? [...els.themeChoice.querySelectorAll('input[name="themeMode"]')] : [];
  const draftEditorCommandButtons = collectEditorCommandButtons(els.draftEditorToolbar);
  const recordEditCommandButtons = collectEditorCommandButtons(els.recordEditToolbar);
  const conversionMapItems = indexElementsByData(els.conversionMapList, "data-map");
  const preflightItems = indexElementsByData(els.preflightList, "data-check");
  const preflightActionButtons = indexChildElementByData(preflightItems, "button[data-preflight-action]");
  const timelineItems = indexElementsByData(els.timelineList, "data-timeline-step");
  const liveRunbookItems = indexElementsByData(els.liveRunbookList, "data-runbook-step");
  const liveRunbookActionButtons = indexChildElementByData(liveRunbookItems, "button[data-runbook-action]");
  const proofDeckItems = indexElementsByData(els.proofDeckList, "data-proof");
  const completionAuditItems = indexElementsByData(els.completionAuditList, "data-audit");
  const liveResultInputItems = collectLiveResultInputItems();
  const importDraftNodes = collectImportDraftNodes();
  const draftDropStatusNodes = collectDraftDropStatusNodes();
  const planBreakdownDetail = els.planBreakdown?.querySelector("p") || null;
  const pageStateLabel = els.pageState?.querySelector("span") || els.pageState || null;
  const publishNextTitle = els.publishRail?.querySelector("[data-publish-next-title]") || null;
  const publishNextDetail = els.publishRail?.querySelector("[data-publish-next-detail]") || null;
  const conversionMapSection = els.conversionMapList?.closest("section") || null;
  const importLedgerSection = els.importLedgerList?.closest("section") || null;
  const reviewSection = els.reviewList?.closest("section") || null;
  const issueQueueSection = els.issueQueueList?.closest("section") || null;
  const timelineSection = els.timelineList?.closest("section") || null;
  const liveRunbookSection = els.liveRunbookList?.closest("section") || null;
  const proofDeckSection = els.proofDeckList?.closest("section") || null;
  const completionAuditSection = els.completionAuditList?.closest("section") || null;
  const recordClearWrap = els.clearRecordHistory?.closest(".record-clear-wrap") || null;
  const rowQueryCache = new WeakMap();
  const recordSearchTextCache = new WeakMap();

  let latestParsed = null;
  let latestParsedMarkdown = "";
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
  let targetTabId = null;
  let latestProgress = createLiveProgressState();
  let currentLanguage = preferredLanguage();
  let activeDraftRecordId = null;
  let activeDraftFingerprint = null;
  let activeDraftFinalized = false;
  let activeDraftSourceFileName = "";
  let draftInputHistoryTimer = null;
  let draftSaveTimer = null;
  let draftAnalyzeTimer = null;
  let draftSyntaxIdleHandle = null;
  let draftDetailRenderIdleHandle = null;
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
  let batchWriteProgress = null;
  let batchWriteProgressTimer = null;
  let lastWriteButtonContentReady = false;
  let writeButtonRevealTimer = null;
  let importCancelRequested = false;
  let uploadRetryRequested = false;
  let importOptions = { setTitle: true, setCover: false, allowGraphqlMetadata: false, smartPunctuation: false };
  let successFeedbackOptions = { confetti: true, sound: true, soundStyle: "soft" };
  let articleExportOptions = { enabled: true, mode: "copy" };
  let aiCoverSettings = shared.normalizeAiCoverSettings({
    model: AI_COVER_DEFAULT_MODEL,
    requestSize: AI_COVER_REQUEST_SIZE
  });
  let aiCoverCandidates = [];
  let aiCoverGenerationAbort = null;
  let aiCoverDialogOpener = null;
  let aiCoverReturnToGeneratorAfterKey = false;
  let supportDialogOpener = null;
  let editingAiCoverPromptProfileId = "";
  let aiCoverCustomBaseUrlDraft = "";
  const aiCoverMotionTimers = new WeakMap();
  let successAudioContext = null;
  let lastSuccessFeedbackKey = "";
  let draftEditorMode = "edit";
  let recordEditMode = "edit";
  let draftEditorHistory = sidepanelEditor.createEditorHistory();
  let recordEditorHistory = sidepanelEditor.createEditorHistory();
  let miniGfmRenderer = null;
  let runSummaryCollapseTimer = null;
  let draftDropStatusTimer = null;
  let draftDropActionStatus = null;
  let remoteImageAccessStatus = { origins: [], available: [], missing: [], checkedAt: null };
  let remoteImageProbeStatus = { state: "idle", total: 0, ok: 0, fail: 0, results: [], checkedAt: null };
  let languageOptionButtons = [];

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
  const textareaEditor = sidepanelEditor.createTextareaEditor({
    historyLimit: EDITOR_HISTORY_LIMIT,
    getDefaultTextarea: () => els.markdown,
    getHistory: (textarea) => textarea === els.recordEditTextarea ? recordEditorHistory : draftEditorHistory,
    setHistory: (textarea, history) => {
      if (textarea === els.recordEditTextarea) recordEditorHistory = history;
      else draftEditorHistory = history;
    }
  });
  const {
    resetEditorHistory,
    handleTextareaUndoShortcut,
    syncProgrammaticUndoFallback,
    clearProgrammaticHistoryOnTextInput,
    applyTextareaCommand
  } = textareaEditor;

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
    themeModeInputs.forEach((input) => {
      setBooleanPropertyIfChanged(input, "checked", input.value === currentThemeMode);
    });
  }

  function indexElementsByData(root, attribute) {
    const items = new Map();
    if (!root || !attribute) return items;
    root.querySelectorAll(`[${attribute}]`).forEach((item) => {
      const value = item.getAttribute(attribute);
      if (value) items.set(value, item);
    });
    return items;
  }

  function indexChildElementByData(items, selector) {
    const children = new Map();
    if (!items || !selector) return children;
    for (const [key, item] of items) {
      const child = item.querySelector(selector);
      if (child) children.set(key, child);
    }
    return children;
  }

  function collectEditorCommandButtons(toolbar) {
    return toolbar ? Array.from(toolbar.querySelectorAll("[data-editor-command]")) : [];
  }

  function collectLanguageOptionButtons() {
    return els.languageOptionsList ? Array.from(els.languageOptionsList.querySelectorAll("[data-language-option]")) : [];
  }

  function collectLiveResultInputItems() {
    if (!els.liveResultList) return [];
    return Array.from(els.liveResultList.querySelectorAll("input[data-live-check]")).map((input) => {
      const item = input.closest("li");
      return {
        input,
        item,
        label: item?.querySelector("label") || null,
        detail: item?.querySelector("span") || null
      };
    });
  }

  function collectImportDraftNodes() {
    const button = els.importDraft;
    if (!button) return { label: null, iconMarkup: IMPORT_ICON_SVG };
    return {
      label: button.querySelector("span"),
      iconMarkup: button.querySelector("svg")?.outerHTML || IMPORT_ICON_SVG
    };
  }

  function collectDraftDropStatusNodes() {
    return {
      title: els.draftDropStatus?.querySelector("strong") || null,
      detail: els.draftDropStatus?.querySelector("span") || null,
      action: els.draftDropAction || null
    };
  }

  function startupStorage() {
    if (!hasChromeApi()) return Promise.resolve({});
    if (!startupStoragePromise) {
      startupStoragePromise = chrome.storage.local.get(STARTUP_STORAGE_KEYS).catch(() => ({}));
    }
    return startupStoragePromise;
  }

  function normalizeSourceFileName(value) {
    return String(value || "").trim();
  }

  function titleCandidateOptions(options = {}) {
    const titleCandidate = shared.markdownTitleCandidate?.(
      options.titleCandidate || options.fallbackTitle || options.sourceTitle || ""
    ) || "";
    const sourceFileName = normalizeSourceFileName(options.sourceFileName || options.fileName);
    const normalized = {};
    if (titleCandidate) normalized.titleCandidate = titleCandidate;
    if (sourceFileName) normalized.sourceFileName = sourceFileName;
    return normalized;
  }

  function normalizeImportOptions(options = {}) {
    const allowGraphqlMetadata = options.allowGraphqlMetadata === true;
    return {
      setTitle: options.setTitle !== false,
      setCover: allowGraphqlMetadata && options.setCover === true,
      allowGraphqlMetadata,
      smartPunctuation: options.smartPunctuation === true,
      ...titleCandidateOptions(options)
    };
  }

  function activeDraftParseOptions(options = importOptions) {
    return normalizeImportOptions({
      ...options,
      sourceFileName: options.sourceFileName || options.fileName || activeDraftSourceFileName
    });
  }

  function parseDraftMarkdown(markdown, options = null) {
    return shared.parseMarkdown(markdown, options == null ? activeDraftParseOptions() : normalizeImportOptions(options));
  }

  function queueItemSourceFileName(id) {
    if (!id) return "";
    return normalizeSourceFileName(queueItemById(id)?.fileName);
  }

  function queueItemById(id) {
    return id ? draftQueue.find((item) => item.id === id) || null : null;
  }

  function activeQueueItem() {
    return queueItemById(activeQueueItemId);
  }

  function clearMissingActiveQueueItem() {
    if (!activeQueueItemId) return null;
    const item = activeQueueItem();
    if (!item) activeQueueItemId = null;
    return item;
  }

  function activeWriteSourceFileName(fallback = "") {
    return (
      queueItemSourceFileName(activeWriteQueueItemId) ||
      queueItemSourceFileName(activeQueueItemId) ||
      normalizeSourceFileName(fallback) ||
      normalizeSourceFileName(activeDraftSourceFileName)
    );
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

  function protectReadPreviewImages(markdown = "") {
    const images = [];
    const source = String(markdown || "");
    let protectedMarkdown = "";
    let cursor = 0;

    while (cursor < source.length) {
      const start = source.indexOf("![", cursor);
      if (start < 0) {
        protectedMarkdown += source.slice(cursor);
        break;
      }

      protectedMarkdown += source.slice(cursor, start);
      const altEnd = findReadPreviewClosingBracket(source, start + 2);
      if (altEnd < 0 || source[altEnd + 1] !== "(") {
        protectedMarkdown += source.slice(start, start + 2);
        cursor = start + 2;
        continue;
      }

      const sourceStart = altEnd + 2;
      const sourceEnd = findReadPreviewClosingParen(source, sourceStart);
      if (sourceEnd < 0) {
        protectedMarkdown += source.slice(start, altEnd + 1);
        cursor = altEnd + 1;
        continue;
      }

      const token = `XPOSTERREADIMAGE${images.length}TOKEN`;
      const alt = source.slice(start + 2, altEnd);
      const imageSource = source.slice(sourceStart, sourceEnd).trim();
      const safe = shared.escapeHtml;
      images.push({
        token,
        html: imageSource
          ? `<img src="${safe(imageSource)}" alt="${safe(alt)}">`
          : `<img alt="${safe(alt)}">`
      });
      protectedMarkdown += token;
      cursor = sourceEnd + 1;
    }

    return { protectedMarkdown, images };
  }

  function restoreReadPreviewImages(html = "", images = []) {
    return images.reduce((output, image) => output.replace(new RegExp(image.token, "g"), image.html), String(html || ""));
  }

  function findReadPreviewClosingBracket(markdown, start) {
    for (let index = start; index < markdown.length; index += 1) {
      if (markdown[index] === "]" && !isReadPreviewEscaped(markdown, index)) return index;
    }
    return -1;
  }

  function findReadPreviewClosingParen(markdown, start) {
    let depth = 0;
    for (let index = start; index < markdown.length; index += 1) {
      const char = markdown[index];
      if (isReadPreviewEscaped(markdown, index)) continue;
      if (char === "(") {
        depth += 1;
        continue;
      }
      if (char !== ")") continue;
      if (depth === 0) return index;
      depth -= 1;
    }
    return -1;
  }

  function isReadPreviewEscaped(text, index) {
    let count = 0;
    for (let cursor = index - 1; cursor >= 0 && text[cursor] === "\\"; cursor -= 1) count += 1;
    return count % 2 === 1;
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
    wrapPreviewImages(template.content);
    normalizePreviewLists(template.content);
    return template.innerHTML;
  }

  function wrapPreviewImages(root) {
    root.querySelectorAll("img").forEach((img) => {
      if (img.closest(".draft-preview-image")) return;
      const source = img.getAttribute("src") || "";
      const alt = img.getAttribute("alt") || "";
      const figure = document.createElement("figure");
      figure.className = "draft-preview-image";
      figure.dataset.previewState = source ? "loading" : "error";
      if (source) figure.dataset.previewSource = source;
      if (alt) figure.dataset.previewAlt = alt;

      const fallback = document.createElement("figcaption");
      fallback.className = "draft-preview-image-fallback";
      fallback.setAttribute("aria-live", "polite");

      const mark = document.createElement("span");
      mark.className = "draft-preview-image-mark";
      mark.setAttribute("aria-hidden", "true");
      mark.textContent = "IMG";

      const title = document.createElement("strong");
      title.dataset.i18n = "Image preview unavailable";
      title.textContent = localizeText("Image preview unavailable");

      const detail = document.createElement("span");
      detail.className = "draft-preview-image-source";
      detail.textContent = source || alt || localizeText("Image source is missing.");

      fallback.append(mark, title, detail);
      img.replaceWith(figure);
      figure.append(img, fallback);
    });
  }

  function markPreviewImageUnavailable(img) {
    const figure = img?.closest?.(".draft-preview-image");
    if (!figure) return;
    setDatasetValueIfChanged(figure, "previewState", "error");
    const detail = figure.querySelector(".draft-preview-image-source");
    const source = img.currentSrc || img.getAttribute("src") || figure.dataset.previewSource || "";
    const alt = img.getAttribute("alt") || figure.dataset.previewAlt || "";
    setTextContentIfChanged(detail, source || alt || localizeText("Image source is missing."));
  }

  function markPreviewImageLoaded(img) {
    const figure = img?.closest?.(".draft-preview-image");
    if (!figure) return;
    setDatasetValueIfChanged(figure, "previewState", "loaded");
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
    const length = String(text || "").length;
    if (!length) return localizeText("Draft empty");
    const parts = [];
    if (length) parts.push(formatCompactUnit(length, "char", "chars", "字符"));
    if (counts.image) parts.push(formatCompactUnit(counts.image, "image", "images", "图"));
    if (counts.table) parts.push(formatCompactUnit(counts.table, "table", "tables", "表"));
    return parts.join(" · ");
  }

  function updateEditorModeToggle(button, mode) {
    if (!button) return;
    const isRead = mode === "read";
    const nextMode = isRead ? "edit" : "read";
    const nextLabel = nextMode === "read" ? "Preview" : "Edit";
    setDatasetValueIfChanged(button, "nextMode", nextMode);
    setAttributeValueIfChanged(button, "aria-pressed", isRead ? "true" : "false");
    setAttributeValueIfChanged(button, "aria-label", localizeText(nextLabel));
    setAttributeValueIfChanged(button, "title", localizeText(nextLabel));
  }

  function updateDraftEditorStatus() {
    if (!els.draftEditorStats) return;
    const text = draftText();
    const counts = latestParsedMarkdown === text ? latestCounts : shared.segmentCounts([]);
    setLocalizedTextIfChanged(els.draftEditorStats, editorStatsText(text, counts));
  }

  function countMeaningfulMarkdownLines(text) {
    let count = 0;
    let hasContent = false;
    const value = String(text || "");
    for (let index = 0; index < value.length; index += 1) {
      const char = value[index];
      if (char === "\n" || char === "\r") {
        if (hasContent) count += 1;
        hasContent = false;
        if (char === "\r" && value[index + 1] === "\n") index += 1;
      } else if (!/\s/.test(char)) {
        hasContent = true;
      }
    }
    return hasContent ? count + 1 : count;
  }

  function countItemsByTone(items, tone) {
    if (!Array.isArray(items)) return 0;
    let count = 0;
    for (const item of items) {
      if (item?.tone === tone) count += 1;
    }
    return count;
  }

  function indexPreflightChecks(checks) {
    return new Map((checks || []).map((check) => [check.id, check]));
  }

  function preflightEvidenceContext(checks, context = {}) {
    const { includePreviewPlan = true, ...baseContext } = context;
    const evidenceContext = {
      ...baseContext,
      byId: baseContext.byId || indexPreflightChecks(checks),
      liveResult: baseContext.liveResult || buildLiveResultEvidence(),
      needsRemote: typeof baseContext.needsRemote === "boolean" ? baseContext.needsRemote : remoteHttpImageSegments(latestParsed).length > 0
    };
    if (includePreviewPlan) evidenceContext.previewPlan = baseContext.previewPlan || buildPreviewPlan();
    return evidenceContext;
  }

  function updateDraftEditorDensity(text = draftText()) {
    if (!els.draftEditorShell) return;
    const value = String(text || "");
    const meaningfulLines = countMeaningfulMarkdownLines(value);
    const hasRichBlocks = /(^|\n)\s*(```|!\[|#{1,6}\s|\|.+\||[-*+]\s+|\d+\.\s+)/.test(value);
    const isCompact = !value.trim() || (value.length < 420 && meaningfulLines <= 8 && !hasRichBlocks);
    setDatasetValueIfChanged(els.draftEditorShell, "density", isCompact ? "compact" : "roomy");
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
      setTextContentIfChanged(target, value);
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
    setSourceHtmlIfChanged(target, html);
  }

  function cancelDeferredDraftSyntaxHighlight() {
    if (!draftSyntaxIdleHandle) return;
    if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(draftSyntaxIdleHandle);
    else window.clearTimeout(draftSyntaxIdleHandle);
    draftSyntaxIdleHandle = null;
  }

  function cancelDeferredDraftDetailRender() {
    if (!draftDetailRenderIdleHandle) return;
    if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(draftDetailRenderIdleHandle);
    else window.clearTimeout(draftDetailRenderIdleHandle);
    draftDetailRenderIdleHandle = null;
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
    setTextContentIfChanged(els.draftSyntaxHighlight, value);
    draftSyntaxIdleHandle = runWhenIdle(() => {
      draftSyntaxIdleHandle = null;
      if (draftText() !== value || draftEditorMode !== "edit" || queueModeActive()) return;
      renderDraftSyntaxHighlight(value);
    }, 220);
  }

  function syncDraftSyntaxScroll() {
    syncScrollPositionIfChanged(els.draftSyntaxHighlight, els.markdown);
  }

  function setDraftText(markdown, { preview = true, syntax = "now" } = {}) {
    const text = String(markdown || "");
    setPropertyValueIfChanged(els.markdown, "value", text);
    resetEditorHistory(els.markdown);
    if (syntax === "defer") scheduleDraftSyntaxHighlight(text);
    else if (syntax === "none") cancelDeferredDraftSyntaxHighlight();
    else renderDraftSyntaxHighlight(text);
    updateDraftEditorDensity(text);
    updateDraftEditorStatus();
    if (preview) updateInlinePreview();
  }

  function focusDraftTextEditor() {
    if (queueModeActive()) return;
    setDraftEditorMode("edit", { syntax: "none" });
    els.markdown?.focus?.();
  }

  function handleDraftEditorInput({ pasted = false, event = null } = {}) {
    activeDraftSourceFileName = "";
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

  function setDraftEditorMode(mode = "edit", { syntax = "now" } = {}) {
    draftEditorMode = DRAFT_EDITOR_MODES.has(mode) ? mode : "edit";
    const isEdit = draftEditorMode === "edit";
    const isPreview = !isEdit;
    const hasQueue = queueModeActive();
    setDatasetValueIfChanged(els.draftPanel, "editorMode", draftEditorMode);
    setDatasetValueIfChanged(els.draftEditorShell, "mode", draftEditorMode);
    syncVisibilityState(els.draftEditorInputWrap, isPreview || hasQueue);
    if (els.markdown) {
      setAttributeValueIfChanged(els.markdown, "aria-hidden", isPreview || hasQueue ? "true" : "false");
      setNumericPropertyIfChanged(els.markdown, "tabIndex", isPreview || hasQueue ? -1 : 0);
    }
    syncVisibilityState(els.draftInlinePreview, !isPreview || hasQueue);
    updateDraftEditorModeToggle();
    draftEditorCommandButtons.forEach((button) => {
      setBooleanPropertyIfChanged(button, "disabled", !isEdit || hasQueue);
    });
    updateDraftEditorStatus();
    if (isEdit) {
      if (syntax === "defer") scheduleDraftSyntaxHighlight();
      else if (syntax === "none") cancelDeferredDraftSyntaxHighlight();
      else renderDraftSyntaxHighlight();
    }
    if (isPreview) updateInlinePreview();
  }

  function updateDraftEditorModeToggle() {
    updateEditorModeToggle(els.draftEditorModeToggle, draftEditorMode);
  }

  function updateInlinePreview(parsed = latestParsed, counts = latestCounts) {
    if (!els.draftInlinePreview) return;
    setDatasetValueIfChanged(els.draftInlinePreview, "previewMode", "read");
    const text = draftText();
    if (!text.trim()) {
      setLocalizedTextIfChanged(els.draftInlinePreviewTitle, "Reading preview");
      setLocalizedTextIfChanged(els.draftInlinePreviewMeta, "Paste Markdown to read it here.");
      if (setSourceHtmlIfChanged(els.draftInlinePreviewBody, emptyMarkdownPreviewHtml())) {
        translateDynamicDom(els.draftInlinePreview);
      }
      return;
    }
    setLocalizedTextIfChanged(els.draftInlinePreviewTitle, "Reading preview");
    setLocalizedTextIfChanged(els.draftInlinePreviewMeta, [
      formatCompactUnit(text.length, "char", "chars", "字符"),
      formatCompactUnit((text.match(/^!\[/gm) || []).length, "image", "images", "图")
    ].join(" · "));
    if (setSourceHtmlIfChanged(els.draftInlinePreviewBody, markdownPreviewHtml(text))) {
      translateDynamicDom(els.draftInlinePreview);
    }
  }

  function markdownPreviewHtml(markdown = "") {
    const safe = shared.escapeHtml;
    const renderer = miniGfm();
    const visibleMarkdown = shared.stripMarkdownFrontmatter(markdown);
    if (!visibleMarkdown.trim() && String(markdown || "").trim()) {
      return `<p class="empty">${safe(localizeText("Only frontmatter metadata is present. It will not be written as article body."))}</p>`;
    }
    const { protectedMarkdown: codeProtectedMarkdown, codeBlocks } = protectReadPreviewCodeBlocks(visibleMarkdown);
    const { protectedMarkdown, images } = protectReadPreviewImages(codeProtectedMarkdown);
    return renderer
      ? sanitizePreviewHtml(restoreReadPreviewCodeBlocks(restoreReadPreviewImages(renderer.parse(protectedMarkdown), images), codeBlocks))
      : `<pre class="draft-read-fallback">${safe(visibleMarkdown)}</pre>`;
  }

  function emptyMarkdownPreviewHtml() {
    return `<p class="empty">${shared.escapeHtml(localizeText("Reading preview appears here."))}</p>`;
  }

  function runDraftEditorCommand(command) {
    setDraftEditorMode("edit");
    applyTextareaCommand(command, { onChange: handleDraftEditorInput });
    focusDraftTextEditor();
  }

  function importOptionsPayload() {
    return normalizeImportOptions(importOptions);
  }

  function writeOptionsPayload({ forceNewArticle = false, sourceFileName = "", celebrateOnComplete = true } = {}) {
    return {
      ...normalizeImportOptions({
        ...importOptions,
        sourceFileName
      }),
      forceNewArticle: Boolean(forceNewArticle),
      celebrateOnComplete: celebrateOnComplete !== false
    };
  }

  function syncImportOptionsControls() {
    setBooleanPropertyIfChanged(els.importTitleOption, "checked", importOptions.setTitle !== false);
    setBooleanPropertyIfChanged(els.importCoverOption, "checked", importOptions.setCover === true);
    setBooleanPropertyIfChanged(els.smartPunctuationOption, "checked", importOptions.smartPunctuation === true);
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
    setBooleanPropertyIfChanged(els.articleExportOption, "checked", articleExportOptions.enabled !== false);
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

  function normalizeAiCoverSettingsForStorage(options = aiCoverSettings) {
    return shared.normalizeAiCoverSettings({
      ...options,
      model: options.model || AI_COVER_DEFAULT_MODEL,
      requestSize: options.requestSize || AI_COVER_REQUEST_SIZE
    });
  }

  function aiCoverSettingsPayload() {
    return { ...normalizeAiCoverSettingsForStorage(aiCoverSettings), apiKey: "" };
  }

  function maskedAiCoverKey(apiKey = "") {
    const text = String(apiKey || "").trim();
    if (text.length <= 8) return text ? "sk-..." : "";
    return `${text.slice(0, 7)}...${text.slice(-4)}`;
  }

  function aiCoverKeyStatusText(key = {}) {
    const test = key.lastTest || null;
    if (!test) return key.enabled ? "Active" : "Stored";
    const stamp = test.checkedAt ? new Date(test.checkedAt).toLocaleString() : "";
    const status = !test.ok ? "Test failed" : test.verified === false ? "Stored" : "Test passed";
    return stamp ? `${status} · ${stamp}` : status;
  }

  function aiCoverDialogElements() {
    return [
      els.aiCoverApiDialog,
      els.aiCoverPromptProfileDialog,
      els.aiCoverGeneratorDialog
    ].filter(Boolean);
  }

  function updateModalOpenState() {
    const openDialogs = [els.recordEditSheet, els.supportDialog, ...aiCoverDialogElements()];
    const open = openDialogs.some((dialog) => dialog && !dialog.hidden);
    setDatasetValueIfChanged(document.body, "modalOpen", open ? "true" : "false");
    setDatasetValueIfChanged(document.documentElement, "modalOpen", open ? "true" : "false");
  }

  function supportMethodCopy(method = "") {
    return SUPPORT_METHOD_COPY[method] || SUPPORT_METHOD_COPY.wechat;
  }

  function setSupportDialogOpen(open, method = "wechat") {
    if (!els.supportDialog) return;
    setBooleanPropertyIfChanged(els.supportDialog, "hidden", !open);
    if (open) {
      const copy = supportMethodCopy(method);
      supportDialogOpener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setDatasetValueIfChanged(els.supportDialog, "method", method === "coffee" ? "coffee" : "wechat");
      setLocalizedTextIfChanged(els.supportDialogTitle, copy.title);
      setLocalizedTextIfChanged(els.supportDialogSubtitle, copy.subtitle);
      translateDynamicDom(els.supportDialog);
      window.setTimeout(() => els.supportClose?.focus?.(), 0);
    } else if (supportDialogOpener?.isConnected) {
      window.setTimeout(() => supportDialogOpener?.focus?.(), 0);
      supportDialogOpener = null;
    }
    updateModalOpenState();
  }

  function setAiCoverDialogOpen(dialog, open) {
    if (!dialog) return;
    setBooleanPropertyIfChanged(dialog, "hidden", !open);
    updateModalOpenState();
    if (open) {
      aiCoverDialogOpener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      translateDynamicDom(dialog);
      window.setTimeout(() => {
        const focusTarget =
          dialog === els.aiCoverGeneratorDialog
            ? els.aiCoverPromptInput
            : dialog === els.aiCoverApiDialog
              ? els.aiCoverApiProvider
              : dialog.querySelector("input, textarea, select, button:not([disabled])");
        focusTarget?.focus?.();
      }, 0);
    }
  }

  function abortAiCoverGeneration() {
    aiCoverGenerationAbort?.abort?.();
    aiCoverGenerationAbort = null;
  }

  function closeAiCoverDialogs({ abortGeneration = true, restoreFocus = true } = {}) {
    if (abortGeneration) abortAiCoverGeneration();
    aiCoverReturnToGeneratorAfterKey = false;
    for (const dialog of aiCoverDialogElements()) {
      setBooleanPropertyIfChanged(dialog, "hidden", true);
    }
    updateModalOpenState();
    if (restoreFocus && aiCoverDialogOpener?.isConnected) {
      window.setTimeout(() => aiCoverDialogOpener?.focus?.(), 0);
    }
    aiCoverDialogOpener = null;
  }

  function openAiCoverApiDialog(options = {}) {
    aiCoverReturnToGeneratorAfterKey = Boolean(options?.returnToGenerator);
    closeAiCoverDialogs({ abortGeneration: false, restoreFocus: false });
    aiCoverReturnToGeneratorAfterKey = Boolean(options?.returnToGenerator);
    resetAiCoverKeyTestResult();
    setAiCoverDialogOpen(els.aiCoverApiDialog, true);
  }

  function openAiCoverPromptProfileDialog() {
    closeAiCoverDialogs({ abortGeneration: false, restoreFocus: false });
    editingAiCoverPromptProfileId = "";
    resetAiCoverPromptProfileEditor();
    renderAiCoverPromptProfileList();
    setAiCoverDialogOpen(els.aiCoverPromptProfileDialog, true);
  }

  function openAiCoverGeneratorDialog() {
    closeAiCoverDialogs({ abortGeneration: false, restoreFocus: false });
    syncAiCoverPromptProfileSelect();
    renderAiCoverCandidates();
    updateAiCoverReadiness();
    setAiCoverDialogOpen(els.aiCoverGeneratorDialog, true);
  }

  function returnToAiCoverGeneratorFromKeyDialog() {
    if (!aiCoverReturnToGeneratorAfterKey) return false;
    aiCoverReturnToGeneratorAfterKey = false;
    openAiCoverGeneratorDialog();
    return true;
  }

  function activeAiCoverPromptProfile(settings = aiCoverSettings) {
    return shared.activeAiCoverPromptProfile(settings);
  }

  function aiCoverKeys() {
    return aiCoverSettings.keys || [];
  }

  function aiCoverPromptProfiles() {
    return aiCoverSettings.promptProfiles || [];
  }

  function aiCoverCountLabel(count, singular, plural = `${singular}s`) {
    return `${count} ${count === 1 ? singular : plural}`;
  }

  function aiCoverEmptyHtml(message) {
    return `<p class="empty">${shared.escapeHtml(localizeText(message))}</p>`;
  }

  function aiCoverDialogWasClosed(event, dialog) {
    return event.target === dialog || Boolean(event.target?.closest?.("[data-ai-cover-dialog-close]"));
  }

  function closeAiCoverDialogOnEscape(event) {
    if (event.key !== "Escape") return;
    event.preventDefault();
    closeAiCoverDialogs();
  }

  function handleAiCoverPromptProfileAction(event) {
    const button = event.target?.closest?.("button[data-ai-prompt-action]");
    if (!button) return;
    const id = button.dataset.aiPromptId || "";
    const action = button.dataset.aiPromptAction || "";
    if (action === "new") {
      resetAiCoverPromptProfileEditor();
      setAiCoverStatus("New cover style.", "idle");
      els.aiCoverPromptProfileName?.focus?.();
      return;
    }
    if (action === "activate") void activateAiCoverPromptProfile(id);
    if (action === "edit") editAiCoverPromptProfile(id);
    if (action === "remove") void removeAiCoverPromptProfile(id);
  }

  function handleAiCoverKeyAction(event) {
    const button = event.target?.closest?.("button[data-ai-key-action]");
    if (!button) return;
    const id = button.dataset.aiKeyId || "";
    const action = button.dataset.aiKeyAction || "";
    if (action === "activate") void activateAiCoverKey(id);
    if (action === "test") void testAiCoverKey(id);
    if (action === "remove") void removeAiCoverKey(id);
  }

  function handleAiCoverGeneratorOpenClick(event) {
    const button = event.target?.closest?.("[data-ai-cover-open-generator]");
    if (!button) return false;
    event.preventDefault();
    openAiCoverGeneratorDialog();
    return true;
  }

  function aiCoverProviderPreset(provider = "openai") {
    const providerId = String(provider || "").trim().toLowerCase();
    const normalizedProvider = providerId === "smartcoder" ? "custom" : providerId;
    return (
      AI_COVER_API_PROVIDER_PRESETS.find((preset) => preset.id === normalizedProvider) ||
      AI_COVER_API_PROVIDER_PRESETS.find((preset) => preset.id === "custom") ||
      AI_COVER_API_PROVIDER_PRESETS[0]
    );
  }

  function aiCoverProviderLabel(key = {}) {
    return key.providerName || aiCoverProviderPreset(key.provider).label || "Custom compatible API";
  }

  function aiCoverProfileName(profile = null) {
    return localizeText(profile?.name || "Default style");
  }

  function aiCoverKnownDefaultModels() {
    return AI_COVER_API_PROVIDER_PRESETS
      .map((preset) => preset.defaultModel)
      .filter(Boolean);
  }

  function aiCoverModelForProvider(model = "", provider = "") {
    const preset = aiCoverProviderPreset(provider);
    const requestedModel = String(model || "").trim();
    if (!preset.defaultModel) return requestedModel || AI_COVER_DEFAULT_MODEL;
    if (!requestedModel) return preset.defaultModel;
    if (preset.id !== "openai" && requestedModel === AI_COVER_DEFAULT_MODEL) return preset.defaultModel;
    return requestedModel;
  }

  function isAiCoverLoopbackHost(hostname = "") {
    const host = String(hostname || "").toLowerCase().replace(/^\[|\]$/g, "");
    if (host === "localhost" || host.endsWith(".localhost")) return true;
    if (host === "::1") return true;
    return /^127(?:\.\d{1,3}){3}$/.test(host);
  }

  function isAllowedAiCoverApiUrl(value = "") {
    try {
      const url = new URL(value);
      if (url.protocol === "https:") return true;
      return url.protocol === "http:" && isAiCoverLoopbackHost(url.hostname);
    } catch {
      return false;
    }
  }

  function normalizeAiCoverControlBaseUrl(value = "") {
    const raw = String(value || "").trim();
    if (!raw) return "";
    try {
      const url = new URL(raw);
      if (!isAllowedAiCoverApiUrl(url.toString())) return "";
      // Forgive pasted endpoint paths ("/v1/images/generations") and bare hosts
      // ("http://127.0.0.1:8317") so the saved base URL is the /v1 root either way.
      let pathname = url.pathname
        .replace(/\/(?:images\/generations|chat\/completions|completions|embeddings|models)\/?$/i, "")
        .replace(/\/+$/g, "");
      if (!pathname) pathname = "/v1";
      url.pathname = pathname;
      url.search = "";
      url.hash = "";
      return url.toString().replace(/\/$/g, "");
    } catch {
      return "";
    }
  }

  function aiCoverProviderFromControls() {
    const preset = aiCoverProviderPreset(els.aiCoverApiProvider?.value || "openai");
    const customBaseUrl = normalizeAiCoverControlBaseUrl(els.aiCoverApiBaseUrl?.value || "");
    return {
      id: preset.id,
      label: preset.label,
      baseUrl: preset.baseUrl || customBaseUrl
    };
  }

  function findAiCoverPromptProfile(id) {
    return aiCoverPromptProfiles().find((profile) => profile.id === id) || null;
  }

  function updateAiCoverKeySummary() {
    const keys = aiCoverKeys();
    if (!keys.length) {
      setLocalizedTextIfChanged(els.aiCoverKeySummary, "No API keys added yet.");
      return;
    }
    const active = keys.find((key) => key.enabled) || keys[0];
    const label = [
      aiCoverProviderLabel(active),
      active.name || "API key",
      maskedAiCoverKey(active.apiKey),
      aiCoverCountLabel(keys.length, "key")
    ].join(" · ");
    setTextContentIfChanged(els.aiCoverKeySummary, label);
  }

  function updateAiCoverPromptProfileSummary() {
    const profiles = aiCoverPromptProfiles();
    const active = activeAiCoverPromptProfile();
    if (!active) {
      setLocalizedTextIfChanged(els.aiCoverPromptProfileSummary, "Default style");
      return;
    }
    const label = `${aiCoverProfileName(active)} · ${aiCoverCountLabel(profiles.length, "style")}`;
    setTextContentIfChanged(els.aiCoverPromptProfileSummary, label);
  }

  function updateAiCoverCandidateSummary() {
    const count = aiCoverCandidates.length;
    if (!count) {
      setLocalizedTextIfChanged(els.aiCoverCandidateSummary, "No generated covers yet.");
      return;
    }
    setTextContentIfChanged(els.aiCoverCandidateSummary, `${aiCoverCountLabel(count, "cover")} in this session`);
  }

  function renderAiCoverKeyRow(key) {
    const id = shared.escapeHtml(key.id);
    const actionControl = key.enabled
      ? `<b class="ai-cover-row-state" data-i18n="Active">${shared.escapeHtml(localizeText("Active"))}</b>`
      : `<button class="secondary compact" type="button" data-ai-key-action="activate" data-ai-key-id="${id}" data-i18n="Activate">${shared.escapeHtml(localizeText("Activate"))}</button>`;
    const keyMeta = [
      aiCoverProviderLabel(key),
      maskedAiCoverKey(key.apiKey),
      key.baseUrl || AI_COVER_DEFAULT_BASE_URL,
      aiCoverKeyStatusText(key)
    ].map((value) => shared.escapeHtml(value)).join(" · ");
    return `
      <div class="ai-cover-key-row" data-ai-key-id="${id}" data-active="${key.enabled ? "true" : "false"}">
        <div class="ai-cover-key-main">
          <strong>${shared.escapeHtml(key.name || "API key")}</strong>
          <span>${keyMeta}</span>
        </div>
        ${actionControl}
        <button class="secondary compact" type="button" data-ai-key-action="test" data-ai-key-id="${id}" data-i18n="Test">Test</button>
        <button class="secondary compact danger" type="button" data-ai-key-action="remove" data-ai-key-id="${id}" data-i18n="Remove">Remove</button>
      </div>
    `;
  }

  function renderAiCoverKeyList() {
    const keys = aiCoverKeys();
    const html = keys.length
      ? keys.map(renderAiCoverKeyRow).join("")
      : aiCoverEmptyHtml("No API keys added yet.");
    if (setSourceHtmlIfChanged(els.aiCoverKeyList, html)) translateDynamicDom(els.aiCoverKeyList);
    updateAiCoverKeySummary();
  }

  function syncAiCoverPromptProfileSelect() {
    const profiles = aiCoverPromptProfiles();
    const active = activeAiCoverPromptProfile();
    const html = profiles
      .map((profile) => `<option value="${shared.escapeHtml(profile.id)}">${shared.escapeHtml(aiCoverProfileName(profile))}</option>`)
      .join("");
    if (setSourceHtmlIfChanged(els.aiCoverPromptProfileSelect, html)) translateDynamicDom(els.aiCoverPromptProfileSelect);
    setPropertyValueIfChanged(els.aiCoverPromptProfileSelect, "value", active?.id || profiles[0]?.id || "");
    updateAiCoverPromptProfileSummary();
  }

  function renderAiCoverPromptProfileRow(profile, activeId, canRemove) {
    const id = shared.escapeHtml(profile.id);
    const isActive = profile.id === activeId;
    const actionControl = isActive
      ? `<b class="ai-cover-row-state" data-i18n="In use">${shared.escapeHtml(localizeText("In use"))}</b>`
      : `<button class="secondary compact" type="button" data-ai-prompt-action="activate" data-ai-prompt-id="${id}" data-i18n="Use">${shared.escapeHtml(localizeText("Use"))}</button>`;
    return `
      <div class="ai-cover-prompt-profile-row" data-ai-prompt-id="${id}" data-active="${isActive ? "true" : "false"}">
        <button class="ai-cover-prompt-profile-main" type="button" data-ai-prompt-action="edit" data-ai-prompt-id="${id}">
          <strong>${shared.escapeHtml(aiCoverProfileName(profile))}</strong>
          <span>${shared.escapeHtml(profile.prompt || localizeText("No style description yet."))}</span>
        </button>
        <div class="ai-cover-prompt-profile-actions">
          ${actionControl}
          <button class="secondary compact" type="button" data-ai-prompt-action="edit" data-ai-prompt-id="${id}" data-i18n="Edit">Edit</button>
          <button class="secondary compact danger" type="button" data-ai-prompt-action="remove" data-ai-prompt-id="${id}" ${canRemove ? "" : "disabled"} data-i18n="Delete">Delete</button>
        </div>
      </div>
    `;
  }

  function renderAiCoverPromptProfileList() {
    const profiles = aiCoverPromptProfiles();
    const active = activeAiCoverPromptProfile();
    const html = profiles.length
      ? profiles.map((profile) => renderAiCoverPromptProfileRow(profile, active?.id || "", profiles.length > 1)).join("")
      : aiCoverEmptyHtml("No cover styles yet.");
    if (setSourceHtmlIfChanged(els.aiCoverPromptProfileList, html)) translateDynamicDom(els.aiCoverPromptProfileList);
    syncAiCoverPromptProfileSelect();
  }

  function resetAiCoverPromptProfileEditor(profile = null) {
    editingAiCoverPromptProfileId = profile?.id || "";
    setPropertyValueIfChanged(els.aiCoverPromptProfileName, "value", profile?.name || "");
    setPropertyValueIfChanged(els.aiCoverPromptProfilePrompt, "value", profile?.prompt || "");
    setLocalizedTextIfChanged(els.aiCoverSavePromptProfile, profile ? "Save changes" : "Save style");
  }

  function syncAiCoverControls() {
    setPropertyValueIfChanged(els.aiCoverApiKey, "value", "");
    setPropertyValueIfChanged(els.aiCoverKeyName, "value", "");
    setPropertyValueIfChanged(els.aiCoverApiProvider, "value", "openai");
    aiCoverCustomBaseUrlDraft = "";
    syncAiCoverProviderControls();
    setPropertyValueIfChanged(els.aiCoverModel, "value", aiCoverSettings.model || AI_COVER_DEFAULT_MODEL);
    setPropertyValueIfChanged(els.aiCoverRounds, "value", String(aiCoverSettings.rounds || 1));
    setPropertyValueIfChanged(els.aiCoverImagesPerRound, "value", String(aiCoverSettings.imagesPerRound || 2));
    renderAiCoverKeyList();
    renderAiCoverPromptProfileList();
    updateAiCoverReadiness();
    updateAiCoverCandidateSummary();
  }

  function readAiCoverControls() {
    return normalizeAiCoverSettingsForStorage({
      ...aiCoverSettings,
      activePromptProfileId: els.aiCoverPromptProfileSelect?.value || aiCoverSettings.activePromptProfileId || "",
      model: els.aiCoverModel?.value || AI_COVER_DEFAULT_MODEL,
      rounds: els.aiCoverRounds?.value || 1,
      imagesPerRound: els.aiCoverImagesPerRound?.value || 2
    });
  }

  function applyAiCoverSettings(options = aiCoverSettings) {
    aiCoverSettings = normalizeAiCoverSettingsForStorage(options);
    syncAiCoverControls();
  }

  async function setAiCoverSettings(nextOptions, { persist = true } = {}) {
    applyAiCoverSettings(nextOptions);
    if (persist && hasChromeApi()) {
      await chrome.storage.local.set({ [STORAGE_AI_COVER_SETTINGS]: aiCoverSettingsPayload() });
    }
  }

  async function restoreAiCoverSettings() {
    if (hasChromeApi()) {
      const stored = await startupStorage();
      applyAiCoverSettings(stored[STORAGE_AI_COVER_SETTINGS] || aiCoverSettings);
      return;
    }
    applyAiCoverSettings(aiCoverSettings);
  }

  function nextAiCoverKeyId() {
    return `key_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  }

  function nextAiCoverPromptProfileId() {
    return `prompt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  }

  function syncAiCoverProviderControls({ motion = false } = {}) {
    if (!els.aiCoverApiBaseUrl) return;
    const preset = aiCoverProviderPreset(els.aiCoverApiProvider?.value || "openai");
    const previousProvider = els.aiCoverApiBaseUrl.dataset.provider || "";
    const previousPreset = aiCoverProviderPreset(previousProvider || "openai");
    if (previousProvider === "custom") aiCoverCustomBaseUrlDraft = String(els.aiCoverApiBaseUrl.value || "").trim();
    if (preset.baseUrl) {
      setPropertyValueIfChanged(els.aiCoverApiBaseUrl, "value", preset.baseUrl);
      setAttributeValueIfChanged(els.aiCoverApiBaseUrl, "placeholder", preset.baseUrl);
    } else {
      const knownPresetUrl = AI_COVER_API_PROVIDER_PRESETS.some((item) => item.baseUrl && item.baseUrl === aiCoverCustomBaseUrlDraft);
      setPropertyValueIfChanged(els.aiCoverApiBaseUrl, "value", knownPresetUrl ? "" : aiCoverCustomBaseUrlDraft);
      setAttributeValueIfChanged(els.aiCoverApiBaseUrl, "placeholder", "https://api.example.com/v1");
    }
    setBooleanPropertyIfChanged(els.aiCoverApiBaseUrl, "readOnly", Boolean(preset.baseUrl));
    setDatasetValueIfChanged(els.aiCoverApiBaseUrl, "provider", preset.id);
    if (preset.defaultModel && els.aiCoverModel) {
      const currentModel = String(els.aiCoverModel.value || "").trim();
      const knownDefaultModels = aiCoverKnownDefaultModels();
      if (!currentModel || currentModel === previousPreset.defaultModel || knownDefaultModels.includes(currentModel)) {
        setPropertyValueIfChanged(els.aiCoverModel, "value", preset.defaultModel);
      }
    }
    if (motion) markAiCoverMotion(els.aiCoverApiBaseUrl, "provider-sync");
  }

  function aiCoverApiErrorMessage(body, fallback) {
    const error = body?.error;
    const message = typeof error === "string" ? error : error?.message || body?.message;
    return String(message || "").trim() || fallback;
  }

  function aiCoverApiUrl(baseUrl = AI_COVER_DEFAULT_BASE_URL, path = "") {
    const url = new URL(baseUrl || AI_COVER_DEFAULT_BASE_URL);
    const rootPath = url.pathname.replace(/\/+$/g, "");
    const nextPath = String(path || "").replace(/^\/+/g, "");
    url.pathname = `${rootPath}/${nextPath}`.replace(/\/{2,}/g, "/");
    url.search = "";
    url.hash = "";
    return url.toString();
  }

  function aiCoverApiPermissionPattern(baseUrl = AI_COVER_DEFAULT_BASE_URL) {
    try {
      const url = new URL(baseUrl || AI_COVER_DEFAULT_BASE_URL);
      if (url.protocol === "https:") return `${url.origin}/*`;
      if (url.protocol === "http:" && isAiCoverLoopbackHost(url.hostname)) return `${url.origin}/*`;
      return "";
    } catch {
      return "";
    }
  }

  async function ensureAiCoverApiPermission(baseUrl = AI_COVER_DEFAULT_BASE_URL) {
    const permission = aiCoverApiPermissionPattern(baseUrl);
    if (!permission || !hasChromeApi() || !chrome.permissions?.contains) {
      return { ok: true, requested: permission ? [permission] : [], granted: true };
    }
    try {
      if (await chrome.permissions.contains({ origins: [permission] })) {
        return { ok: true, requested: [permission], granted: true };
      }
      if (!chrome.permissions?.request) {
        return { ok: false, requested: [permission], error: "API host permission is not available in this browser context." };
      }
      const granted = await chrome.permissions.request({ origins: [permission] });
      return { ok: granted, requested: [permission], granted };
    } catch (error) {
      return { ok: false, requested: [permission], error: error?.message || String(error) };
    }
  }

  async function verifyAiCoverKeyConnection({ key = null, apiKey = "", baseUrl = "", provider = "", model: requestedModel = "" } = {}) {
    key = key || { apiKey, baseUrl, provider };
    if (!isAllowedAiCoverApiUrl(key.baseUrl || "")) {
      throw new Error("Use an HTTPS URL, or http:// for a local address.");
    }
    const model = aiCoverModelForProvider(requestedModel || aiCoverSettings.model, key.provider);
    const permission = await ensureAiCoverApiPermission(key.baseUrl);
    if (!permission.ok) throw new Error(permission.error || "API host permission was not granted.");
    const authHeaders = { Authorization: `Bearer ${key.apiKey}` };
    // Confirm the key by retrieving the model, then by listing models. Many
    // OpenAI-compatible servers implement neither route even though
    // images/generations works, so a missing probe must never block a usable
    // key: only a clear auth rejection (401/403) or an unreachable host is
    // fatal. Everything else is saved and confirmed on the first generation.
    let reachable = false;
    for (const path of [`/models/${encodeURIComponent(model)}`, "/models"]) {
      let response;
      try {
        response = await fetch(aiCoverApiUrl(key.baseUrl, path), { headers: authHeaders });
      } catch {
        continue;
      }
      reachable = true;
      if (response.ok) return { ok: true, verified: true, status: response.status, checkedAt: Date.now(), model };
      if (response.status === 401 || response.status === 403) {
        const body = await response.json().catch(() => null);
        throw new Error(aiCoverApiErrorMessage(body, `HTTP ${response.status}`));
      }
    }
    if (reachable) return { ok: true, verified: false, status: 0, checkedAt: Date.now(), model };
    throw new Error("Could not reach the API. Check the Base URL and your connection.");
  }

  async function addAiCoverKeyFromControls() {
    const apiKey = String(els.aiCoverApiKey?.value || "").trim();
    if (!apiKey) {
      setAiCoverStatus("Paste an API key before adding it.", "error");
      setAiCoverKeyTestResult({
        tone: "error",
        title: "Connection not tested",
        detail: "Paste an API key first."
      });
      return;
    }
    const keys = aiCoverKeys();
    const provider = aiCoverProviderFromControls();
    if (!provider.baseUrl) {
      setAiCoverStatus("Enter a compatible API Base URL.", "error");
      setAiCoverKeyTestResult({
        tone: "error",
        title: "Connection not tested",
        detail: "Enter a compatible API Base URL."
      });
      els.aiCoverApiBaseUrl?.focus?.();
      return;
    }
    if (!isAllowedAiCoverApiUrl(provider.baseUrl)) {
      setAiCoverStatus("Use an HTTPS URL, or http:// for a local address.", "error");
      setAiCoverKeyTestResult({
        tone: "error",
        title: "Connection not tested",
        detail: "Use an HTTPS URL, or http:// for a local address."
      });
      els.aiCoverApiBaseUrl?.focus?.();
      return;
    }
    setBooleanPropertyIfChanged(els.aiCoverAddKey, "disabled", true);
    setLocalizedTextIfChanged(els.aiCoverAddKey, "Testing...");
    setAiCoverStatus("Testing API connection...", "work");
    setAiCoverKeyTestResult({
      tone: "work",
      title: "Testing connection",
      detail: "Checking {provider} with {model}...",
      values: { provider: provider.label, model: aiCoverModelForProvider(readAiCoverControls().model, provider.id) }
    });
    let lastTest;
    try {
      lastTest = await verifyAiCoverKeyConnection({
        apiKey,
        baseUrl: provider.baseUrl,
        provider: provider.id,
        model: readAiCoverControls().model
      });
    } catch (error) {
      const message = error?.message || String(error);
      setAiCoverStatus("API key test failed: {error}", "error", { error: message });
      setAiCoverKeyTestResult({
        tone: "error",
        title: "Connection failed",
        detail: "{error}",
        values: { error: message }
      });
      setBooleanPropertyIfChanged(els.aiCoverAddKey, "disabled", false);
      setLocalizedTextIfChanged(els.aiCoverAddKey, "Add key");
      return;
    }
    const name = String(els.aiCoverKeyName?.value || "").trim() || `${provider.label} key ${keys.length + 1}`;
    await setAiCoverSettings({
      ...readAiCoverControls(),
      keys: [
        ...keys.map((key) => ({ ...key, enabled: false })),
        {
          id: nextAiCoverKeyId(),
          name,
          apiKey,
          provider: provider.id,
          providerName: provider.label,
          baseUrl: provider.baseUrl,
          enabled: true,
          createdAt: Date.now(),
          lastTest
        }
      ]
    });
    setPropertyValueIfChanged(els.aiCoverApiKey, "value", "");
    if (els.aiCoverApiBaseUrl && !els.aiCoverApiBaseUrl.readOnly) {
      setPropertyValueIfChanged(els.aiCoverApiBaseUrl, "value", provider.baseUrl);
    }
    if (lastTest.verified === false) {
      setAiCoverStatus("API key added and activated.", "ok");
      setAiCoverKeyTestResult({
        tone: "ok",
        title: "Key saved",
        detail: "{provider} accepted the key. {model} is checked on the first cover.",
        values: { provider: provider.label, model: lastTest.model }
      });
    } else {
      setAiCoverStatus("API key verified, added, and activated.", "ok");
      setAiCoverKeyTestResult({
        tone: "ok",
        title: "Connection verified",
        detail: "{provider} responded with {model}. This key is now active.",
        values: { provider: provider.label, model: lastTest.model }
      });
    }
    updateAiCoverReadiness();
    setBooleanPropertyIfChanged(els.aiCoverAddKey, "disabled", false);
    setLocalizedTextIfChanged(els.aiCoverAddKey, "Add key");
  }

  async function activateAiCoverKey(id) {
    await setAiCoverSettings({
      ...readAiCoverControls(),
      activeKeyId: id,
      keys: aiCoverKeys().map((key) => ({ ...key, enabled: key.id === id }))
    });
    setAiCoverStatus("API key activated.", "ok");
    updateAiCoverReadiness();
  }

  async function removeAiCoverKey(id) {
    const remaining = aiCoverKeys().filter((key) => key.id !== id);
    await setAiCoverSettings({
      ...readAiCoverControls(),
      apiKey: "",
      keys: remaining,
      activeKeyId: remaining.find((key) => key.enabled)?.id || remaining[0]?.id || ""
    });
    setAiCoverStatus("API key removed.", "idle");
    updateAiCoverReadiness();
  }

  async function saveAiCoverPromptProfile() {
    const profiles = aiCoverPromptProfiles();
    const existing = findAiCoverPromptProfile(editingAiCoverPromptProfileId);
    const name = String(els.aiCoverPromptProfileName?.value || "").trim() || existing?.name || `Style ${profiles.length + 1}`;
    const prompt = String(els.aiCoverPromptProfilePrompt?.value || "").trim();
    if (!prompt) {
      setAiCoverStatus("Add a style prompt before saving.", "error");
      return;
    }
    const now = Date.now();
    const id = existing?.id || nextAiCoverPromptProfileId();
    const nextProfile = {
      id,
      name,
      prompt,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
      lastUsedAt: existing?.lastUsedAt || 0
    };
    const nextProfiles = existing
      ? profiles.map((profile) => profile.id === id ? nextProfile : profile)
      : [...profiles, nextProfile];
    await setAiCoverSettings({
      ...readAiCoverControls(),
      promptProfiles: nextProfiles,
      activePromptProfileId: id
    });
    resetAiCoverPromptProfileEditor();
    setAiCoverStatus("Cover style saved.", "ok");
  }

  async function activateAiCoverPromptProfile(id) {
    const profile = findAiCoverPromptProfile(id);
    if (!profile) return;
    await setAiCoverSettings({
      ...readAiCoverControls(),
      activePromptProfileId: id
    });
    setAiCoverStatus("Cover style selected.", "ok");
  }

  function editAiCoverPromptProfile(id) {
    const profile = findAiCoverPromptProfile(id);
    if (!profile) return;
    resetAiCoverPromptProfileEditor(profile);
    setAiCoverStatus("Editing cover style.", "idle");
    els.aiCoverPromptProfilePrompt?.focus?.();
  }

  async function removeAiCoverPromptProfile(id) {
    const profiles = aiCoverPromptProfiles();
    if (profiles.length <= 1) {
      setAiCoverStatus("Keep at least one cover style.", "error");
      return;
    }
    const remaining = profiles.filter((profile) => profile.id !== id);
    await setAiCoverSettings({
      ...readAiCoverControls(),
      promptProfiles: remaining,
      activePromptProfileId: remaining.find((profile) => profile.id === aiCoverSettings.activePromptProfileId)?.id || remaining[0]?.id || ""
    });
    if (editingAiCoverPromptProfileId === id) resetAiCoverPromptProfileEditor();
    setAiCoverStatus("Cover style removed.", "idle");
  }

  async function markAiCoverPromptProfileUsed(profileId) {
    if (!profileId) return;
    const lastUsedAt = Date.now();
    await setAiCoverSettings({
      ...readAiCoverControls(),
      activePromptProfileId: profileId,
      promptProfiles: aiCoverPromptProfiles().map((profile) =>
        profile.id === profileId ? { ...profile, lastUsedAt } : profile
      )
    });
  }

  async function testAiCoverKey(id) {
    const key = aiCoverKeys().find((item) => item.id === id);
    if (!key?.apiKey) return;
    const model = aiCoverModelForProvider(aiCoverSettings.model, key.provider);
    setAiCoverStatus(`Testing ${key.name || "API key"}...`, "work");
    setAiCoverKeyTestResult({
      tone: "work",
      title: "Testing connection",
      detail: "Checking {provider} with {model}...",
      values: { provider: aiCoverProviderLabel(key), model }
    });
    let lastTest;
    try {
      lastTest = await verifyAiCoverKeyConnection({
        apiKey: key.apiKey,
        baseUrl: key.baseUrl,
        provider: key.provider,
        model: aiCoverSettings.model
      });
      if (lastTest.verified === false) {
        setAiCoverStatus("Key saved. It is checked on the first cover.", "ok");
        setAiCoverKeyTestResult({
          tone: "ok",
          title: "Key saved",
          detail: "{provider} accepted the key. {model} is checked on the first cover.",
          values: { provider: aiCoverProviderLabel(key), model: lastTest.model }
        });
      } else {
        setAiCoverStatus("API key test passed.", "ok");
        setAiCoverKeyTestResult({
          tone: "ok",
          title: "Connection verified",
          detail: "{provider} responded with {model}.",
          values: { provider: aiCoverProviderLabel(key), model: lastTest.model }
        });
      }
    } catch (error) {
      lastTest = { ok: false, error: error?.message || String(error), checkedAt: Date.now(), model };
      setAiCoverStatus("API key test failed: {error}", "error", { error: lastTest.error });
      setAiCoverKeyTestResult({
        tone: "error",
        title: "Connection failed",
        detail: "{error}",
        values: { error: lastTest.error }
      });
    }
    await setAiCoverSettings({
      ...readAiCoverControls(),
      keys: aiCoverKeys().map((item) => item.id === id ? { ...item, lastTest } : item)
    });
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
    setBooleanPropertyIfChanged(els.confettiOption, "checked", successFeedbackOptions.confetti !== false);
    setBooleanPropertyIfChanged(els.successSoundOption, "checked", successFeedbackOptions.sound !== false);
    setPropertyValueIfChanged(els.successSoundStyle, "value", successFeedbackOptions.soundStyle || "soft");
    const soundEnabled = successFeedbackOptions.sound !== false;
    setBooleanPropertyIfChanged(els.successSoundStyle, "disabled", !soundEnabled);
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
    await sendToTargetTab({
      type: "xposter:success-celebration",
      summary: {
        elapsedMs: Number(summary?.elapsedMs || 0),
        warnings: Number(summary?.mediaWarnings?.total || 0) + Number(summary?.main?.imgFail || 0)
      },
      colors: SUCCESS_CELEBRATION_COLORS
    }).catch(() => null);
  }

  function schedulePageSuccessCelebrationFallback(summary = null) {
    if (!successFeedbackOptions.confetti) return;
    window.setTimeout(() => {
      void requestPageSuccessCelebration(summary);
    }, 450);
  }

  function triggerSuccessFeedback(summary = null) {
    const key = String(latestProgress?.startedAt || summary?.elapsedMs || Date.now());
    if (key && key === lastSuccessFeedbackKey) return;
    lastSuccessFeedbackKey = key;
    schedulePageSuccessCelebrationFallback(summary);
    if (successFeedbackOptions.sound) void playSuccessSound();
  }

  async function previewSuccessFeedback() {
    if (successFeedbackOptions.sound) await playSuccessSound();
  }

  function applyTheme(mode = currentThemeMode) {
    currentThemeMode = normalizeThemeMode(mode);
    const resolvedTheme = resolveTheme(currentThemeMode);
    setDatasetValueIfChanged(document.documentElement, "theme", resolvedTheme);
    setDatasetValueIfChanged(document.documentElement, "themeMode", currentThemeMode);
    setStyleValueIfChanged(document.documentElement, "colorScheme", resolvedTheme);
    setDatasetValueIfChanged(document.body, "theme", resolvedTheme);
    setDatasetValueIfChanged(document.body, "themeMode", currentThemeMode);
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
      const nextValue = source.replace(source.trim(), translated);
      if (node.nodeValue !== nextValue) node.nodeValue = nextValue;
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
        const translated = translateText(source);
        if (current !== translated) element.setAttribute(attr, translated);
      }
    });
  }

  function syncLanguageEnvironment() {
    document.documentElement.lang = i18n?.htmlLang?.(currentLanguage) || (currentLanguage === "zh" ? "zh-CN" : "en");
    setDatasetValueIfChanged(document.body, "language", currentLanguage);
    setDatasetValueIfChanged(document.body, "languagePreference", i18n?.preference?.() || currentLanguage);
  }

  function translateDynamicDom(root = document.body, { syncEnvironment = true } = {}) {
    i18n?.renderDom(root);
    translateNodeText(root);
    translateAttributes(root);
    translateEvidencePlaceholder(root);
    if (syncEnvironment) syncLanguageEnvironment();
  }

  function translateVisibleWorkspace() {
    translateDynamicDom(workspaceTopbar || document.body, { syncEnvironment: false });
    translateDynamicDom(workspaceTabsContainer || document.body, { syncEnvironment: false });
    workspacePanels.forEach((panel) => {
      if (panel.classList.contains("active")) translateDynamicDom(panel, { syncEnvironment: false });
    });
    syncLanguageEnvironment();
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

  function runAfterFirstPaint(callback) {
    if (typeof window.requestAnimationFrame !== "function") {
      window.setTimeout(callback, 0);
      return;
    }
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(callback);
    });
  }

  function languageOptionLabel(option) {
    if (!option) return "";
    return option.code === "auto" ? localizeText("Automatic") : option.nativeName;
  }

  function closeLanguageMenu({ focusButton = false } = {}) {
    if (!els.languageOptionsList || !els.languageSelectButton) return;
    setBooleanPropertyIfChanged(els.languageOptionsList, "hidden", true);
    setAttributeValueIfChanged(els.languageSelectButton, "aria-expanded", "false");
    if (focusButton) els.languageSelectButton.focus();
  }

  function syncLanguageButton() {
    if (!els.languageSelect || !els.languageSelectValue || !els.languageOptionsList) return;
    const value = els.languageSelect.value;
    const selectedOption = els.languageSelect.selectedOptions?.[0];
    const selectedLabel = selectedOption?.textContent || languageOptionLabel(i18n?.languageOptions?.().find((option) => option.code === value)) || value;
    setTextContentIfChanged(els.languageSelectValue, selectedLabel);
    languageOptionButtons.forEach((button) => {
      const selected = button.dataset.languageOption === value;
      setAttributeValueIfChanged(button, "aria-selected", selected ? "true" : "false");
      setNumericPropertyIfChanged(button, "tabIndex", selected ? 0 : -1);
    });
  }

  function openLanguageMenu() {
    if (!els.languageOptionsList || !els.languageSelectButton) return;
    setBooleanPropertyIfChanged(els.languageOptionsList, "hidden", false);
    setAttributeValueIfChanged(els.languageSelectButton, "aria-expanded", "true");
    syncLanguageButton();
    const selected = languageOptionButtons.find((button) => button.getAttribute("aria-selected") === "true");
    selected?.focus?.();
  }

  function toggleLanguageMenu() {
    if (!els.languageOptionsList) return;
    if (els.languageOptionsList.hidden) openLanguageMenu();
    else closeLanguageMenu({ focusButton: true });
  }

  function focusLanguageOption(delta) {
    if (!els.languageOptionsList || els.languageOptionsList.hidden) return;
    const options = languageOptionButtons;
    if (!options.length) return;
    const currentIndex = Math.max(0, options.indexOf(document.activeElement));
    const nextIndex = (currentIndex + delta + options.length) % options.length;
    options.forEach((option, index) => {
      setNumericPropertyIfChanged(option, "tabIndex", index === nextIndex ? 0 : -1);
    });
    options[nextIndex].focus();
  }

  function handleLanguageButtonKeydown(event) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openLanguageMenu();
    if (event.key === "ArrowUp") focusLanguageOption(-1);
  }

  function handleLanguageOptionsKeydown(event) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      focusLanguageOption(event.key === "ArrowDown" ? 1 : -1);
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      closeLanguageMenu({ focusButton: true });
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      const option = event.target.closest?.("[data-language-option]");
      if (!option) return;
      event.preventDefault();
      setLanguage(option.dataset.languageOption);
      closeLanguageMenu({ focusButton: true });
    }
  }

  function populateLanguageSelect() {
    if (!els.languageSelect || !i18n?.languageOptions) return;
    const options = i18n.languageOptions();
    const selectHtml = options
      .map((option) => {
        const label = languageOptionLabel(option);
        return `<option value="${shared.escapeHtml(option.code)}">${shared.escapeHtml(label)}</option>`;
      })
      .join("");
    setSourceHtmlIfChanged(els.languageSelect, selectHtml);
    setPropertyValueIfChanged(els.languageSelect, "value", i18n.preference?.() || currentLanguage);
    if (els.languageOptionsList) {
      const optionsHtml = options
        .map((option) => {
          const label = shared.escapeHtml(languageOptionLabel(option));
          const value = shared.escapeHtml(option.code);
          return `<button class="language-option" type="button" role="option" data-language-option="${value}" aria-selected="false" tabindex="-1">${label}</button>`;
        })
        .join("");
      setSourceHtmlIfChanged(els.languageOptionsList, optionsHtml);
      languageOptionButtons = collectLanguageOptionButtons();
    } else {
      languageOptionButtons = [];
    }
    syncLanguageButton();
  }

  function setLocalizedText(node, source) {
    setLocalizedTextIfChanged(node, source);
  }

  function setLocalizedMessage(node, key, values = {}) {
    setLocalizedMessageIfChanged(node, key, values);
  }

  function setDatasetValueIfChanged(node, key, value) {
    if (!node || !key || node.dataset[key] === value) return;
    node.dataset[key] = value;
  }

  function removeDatasetValueIfChanged(node, key) {
    if (!node || !key || !(key in node.dataset)) return;
    delete node.dataset[key];
  }

  function setStyleValueIfChanged(node, property, value) {
    if (!node || !property || node.style[property] === value) return;
    node.style[property] = value;
  }

  function setStylePropertyIfChanged(node, property, value) {
    if (!node || !property) return;
    const text = String(value ?? "");
    if (node.style.getPropertyValue(property) === text) return;
    node.style.setProperty(property, text);
  }

  function removeStylePropertyIfChanged(node, property) {
    if (!node || !property || !node.style.getPropertyValue(property)) return;
    node.style.removeProperty(property);
  }

  function setClassNameIfChanged(node, value) {
    if (!node || node.className === value) return;
    node.className = value;
  }

  function setClassPresenceIfChanged(node, className, present) {
    if (!node || !className || node.classList.contains(className) === present) return;
    node.classList.toggle(className, present);
  }

  function setAttributeValueIfChanged(node, attribute, value) {
    if (!node || !attribute || node.getAttribute(attribute) === value) return;
    node.setAttribute(attribute, value);
  }

  function setBooleanPropertyIfChanged(node, property, value) {
    if (!node || !property || node[property] === value) return;
    node[property] = value;
  }

  function setPropertyValueIfChanged(node, property, value) {
    if (!node || !property || node[property] === value) return;
    node[property] = value;
  }

  function setNumericPropertyIfChanged(node, property, value) {
    if (!node || !property) return;
    const next = Number(value || 0);
    if (node[property] === next) return;
    node[property] = next;
  }

  function syncScrollPositionIfChanged(target, source) {
    if (!target || !source) return;
    setNumericPropertyIfChanged(target, "scrollTop", source.scrollTop);
    setNumericPropertyIfChanged(target, "scrollLeft", source.scrollLeft);
  }

  function setTextContentIfChanged(node, value) {
    if (!node) return;
    const text = String(value ?? "");
    if (node.textContent !== text) node.textContent = text;
  }

  function setSourceHtmlIfChanged(node, html) {
    if (!node) return false;
    const source = String(html ?? "");
    if (node.__xposterSourceHtml === source) return false;
    node.__xposterSourceHtml = source;
    if (node.innerHTML !== source) node.innerHTML = source;
    return true;
  }

  function setLocalizedTextIfChanged(node, source) {
    if (!node) return;
    const text = localizeText(source);
    if (node.dataset.i18n) delete node.dataset.i18n;
    if (node.__xposterSourceText !== source) node.__xposterSourceText = source;
    if (node.textContent !== text) node.textContent = text;
    if (node.firstChild?.nodeType === Node.TEXT_NODE) node.firstChild.__xposterSourceText = source;
  }

  function setLocalizedMessageIfChanged(node, key, values = {}) {
    if (!node) return;
    const text = localizeInterpolated(key, values);
    if (node.dataset.i18n) delete node.dataset.i18n;
    if (node.__xposterSourceText !== key) node.__xposterSourceText = key;
    if (node.textContent !== text) node.textContent = text;
    if (node.firstChild?.nodeType === Node.TEXT_NODE) node.firstChild.__xposterSourceText = key;
  }

  function statusRowNodes(item) {
    if (!item) return {};
    const cached = rowQueryCache.get(item);
    if (
      cached &&
      (!cached.label || item.contains(cached.label)) &&
      (!cached.detail || item.contains(cached.detail)) &&
      (!cached.status || item.contains(cached.status))
    ) {
      return cached;
    }
    const nodes = {
      label: item.querySelector("strong"),
      detail: item.querySelector(":scope > div > span") || item.querySelector(":scope > span"),
      status: item.querySelector("em")
    };
    rowQueryCache.set(item, nodes);
    return nodes;
  }

  function syncStatusRow(item, { tone, label, detail, status } = {}) {
    if (!item) return;
    const nodes = statusRowNodes(item);
    if (tone !== undefined) setDatasetValueIfChanged(item, "tone", tone);
    if (label !== undefined) setLocalizedTextIfChanged(nodes.label, label);
    if (detail !== undefined) setLocalizedTextIfChanged(nodes.detail, detail);
    if (status !== undefined) setLocalizedTextIfChanged(nodes.status, status);
  }

  function syncVisibilityState(node, hidden) {
    setBooleanPropertyIfChanged(node, "hidden", hidden);
    setAttributeValueIfChanged(node, "aria-hidden", hidden ? "true" : "false");
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
      setLocalizedTextIfChanged(els.evidenceText, source);
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
    updatePublishRail();
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

  function isXUrl(url) {
    return /^https:\/\/(?:x|twitter)\.com\//.test(String(url || ""));
  }

  function isXTab(tab) {
    return Boolean(tab?.id && isXUrl(tab.url || ""));
  }

  function rememberTargetTab(tab) {
    if (!isXTab(tab)) return null;
    targetTabId = tab.id;
    if (hasChromeApi() && STORAGE_TARGET_TAB) {
      chrome.storage.local.set({
        [STORAGE_TARGET_TAB]: {
          id: tab.id,
          url: tab.url || "",
          windowId: tab.windowId || null,
          savedAt: Date.now()
        }
      }).catch(() => {});
    }
    return tab;
  }

  async function tabById(tabId) {
    if (!hasChromeApi() || !tabId) return null;
    try {
      return await chrome.tabs.get(tabId);
    } catch {
      return null;
    }
  }

  async function targetTab({ requireArticles = false, preferStored = true } = {}) {
    if (!hasChromeApi()) return null;
    if (preferStored && targetTabId) {
      const storedTab = await tabById(targetTabId);
      if (isXTab(storedTab) && (!requireArticles || isArticlesUrl(storedTab.url))) return rememberTargetTab(storedTab);
      targetTabId = null;
    }
    const active = await activeTab();
    if (isXTab(active) && (!requireArticles || isArticlesUrl(active.url))) return rememberTargetTab(active);
    const tabs = await chrome.tabs.query({ currentWindow: true, url: ["https://x.com/*", "https://twitter.com/*"] });
    const xTab = requireArticles
      ? tabs.find((tab) => isXTab(tab) && isArticlesUrl(tab.url))
      : tabs.find(isXTab);
    if (xTab) return rememberTargetTab(xTab);
    return null;
  }

  async function restoreTargetTab(stored = null) {
    if (!hasChromeApi()) return null;
    const record = stored?.[STORAGE_TARGET_TAB] || null;
    if (record?.id) {
      const tab = await tabById(record.id);
      if (isXTab(tab)) return rememberTargetTab(tab);
    }
    return targetTab({ preferStored: false });
  }

  async function sendToTargetTab(message, options = {}) {
    const tab = await targetTab(options);
    if (!tab?.id) return { ok: false, error: "No X tab" };
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
    const response = await sendToTargetTab({ type: "xposter:cancel-import" });
    if (!response?.ok) {
      importCancelRequested = false;
      log(response?.error ? `Stop request failed: ${localizeText(response.error)}` : "Stop request failed: active X tab did not respond");
      updateLiveProgress();
    }
  }

  async function retryUpload() {
    if (uploadRetryRequested) return;
    uploadRetryRequested = true;
    updateLiveProgress();
    const response = await sendToTargetTab({ type: "xposter:retry-upload" });
    if (!response?.ok) {
      uploadRetryRequested = false;
      log(response?.error ? `Retry request failed: ${localizeText(response.error)}` : "Retry request failed: active X tab did not respond");
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
    const coverSource = importOptions.setCover === false ? "" : String(parsed?.cover || "").trim();
    const coverIsLocal = Boolean(coverSource && shared.isLocalImageSource(coverSource));
    const references = [];
    let coverInBody = false;
    for (const segment of parsed?.segments || []) {
      if (segment.type !== "image" || !shared.isLocalImageSource(segment.source)) continue;
      if (coverIsLocal && !coverInBody && shared.imageSourcesMatch(segment.source, coverSource)) coverInBody = true;
      references.push({
        role: "body",
        source: segment.source,
        segment
      });
    }
    if (coverIsLocal && !coverInBody) {
      references.push({
        role: "cover",
        source: coverSource,
        segment: { type: "image", source: coverSource, alt: "cover" }
      });
    }
    return references;
  }

  function localImageFolderStatusForReferences(references = [], vault = currentVault()) {
    let absoluteCount = 0;
    for (const item of references) {
      if (shared.isAbsoluteLocalImageSource(item.source)) absoluteCount += 1;
    }
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

  function localImageFolderStatus(parsed = latestParsed, vault = currentVault()) {
    return localImageFolderStatusForReferences(localImageReferences(parsed), vault);
  }

  function localImageReferencesForMarkdowns(markdowns = [], options = importOptions) {
    return localImageReferencesForParsedDrafts(parsedDraftsForMarkdowns(markdowns, options));
  }

  function localImageReferencesForParsedDrafts(parsedDrafts = []) {
    const references = [];
    for (const item of parsedDrafts || []) {
      try {
        for (const reference of localImageReferences(item.parsed)) {
          references.push({ ...reference, draftIndex: item.index });
        }
      } catch {}
    }
    return references;
  }

  function firstLocalImageFolderHint(status = activeLocalImageFolderStatus()) {
    const reference = status.references?.find?.((item) => !shared.isAbsoluteLocalImageSource(item.source));
    const source = String(reference?.source || "").trim();
    const candidates = source ? shared.localImagePathCandidates(source) : [];
    const parts = candidates[0] || [];
    if (parts.length > 1) return parts[0];
    return "";
  }

  function localImageFolderActionDetail(status = activeLocalImageFolderStatus()) {
    const count = Number(status.count || 0);
    const hint = firstLocalImageFolderHint(status);
    return hint
      ? `${count} local image(s) use relative paths. Open the X Article page; xPoster will ask there for the folder that contains ${hint}.`
      : `${count} local image(s) use relative paths. Open the X Article page; xPoster will ask there for the Markdown image folder.`;
  }

  function parsedDraftsForMarkdowns(markdowns = [], options = importOptions) {
    const parsedDrafts = [];
    markdowns.forEach((markdown, index) => {
      try {
        parsedDrafts.push({ index, parsed: parseDraftMarkdown(markdown || "", options) });
      } catch {}
    });
    return parsedDrafts;
  }

  function localImageFolderStatusForMarkdowns(markdowns = [], options = importOptions, vault = currentVault()) {
    return localImageFolderStatusForReferences(localImageReferencesForMarkdowns(markdowns, options), vault);
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
    const cover = String(parsed?.cover || "").trim();
    const coverIsRemote = Boolean(cover && isRemoteHttpImageSource(cover));
    const segments = [];
    let coverInBody = false;
    for (const segment of parsed?.segments || []) {
      if (segment.type !== "image" || !isRemoteHttpImageSource(segment.source)) continue;
      if (coverIsRemote && !coverInBody && shared.imageSourcesMatch(segment.source, cover)) coverInBody = true;
      segments.push(segment);
    }
    if (coverIsRemote && !coverInBody) {
      segments.push({ type: "image", source: cover, alt: "cover" });
    }
    return segments;
  }

  function remoteImageOriginCountsFromSegments(segments = []) {
    const counts = new Map();
    for (const segment of segments || []) {
      try {
        const origin = new URL(segment.source).origin;
        counts.set(origin, (counts.get(origin) || 0) + 1);
      } catch {}
    }
    return counts;
  }

  function remoteImageOriginsFromSegments(segments = []) {
    return Array.from(remoteImageOriginCountsFromSegments(segments).keys());
  }

  function remoteImageEvidenceFromSegments(segments = []) {
    const imageSegments = segments || [];
    return {
      count: imageSegments.length,
      origins: remoteImageOriginsFromSegments(imageSegments),
      access: remoteImageAccessStatus,
      probe: remoteImageProbeStatus
    };
  }

  function remoteImageOriginCounts(parsed = latestParsed) {
    return remoteImageOriginCountsFromSegments(remoteHttpImageSegments(parsed));
  }

  function remoteImageOrigins(parsed = latestParsed) {
    return remoteImageOriginsFromSegments(remoteHttpImageSegments(parsed));
  }

  function addSegmentCounts(target, source) {
    for (const [type, count] of Object.entries(source || {})) {
      target[type] = (target[type] || 0) + Number(count || 0);
    }
    return target;
  }

  function markdownsSegmentCounts(markdowns = [], options = importOptions) {
    return segmentCountsForParsedDrafts(parsedDraftsForMarkdowns(markdowns, options));
  }

  function segmentCountsForParsedDrafts(parsedDrafts = []) {
    const counts = shared.segmentCounts([]);
    for (const item of parsedDrafts || []) {
      try {
        addSegmentCounts(counts, shared.segmentCounts(item.parsed?.segments || []));
      } catch {}
    }
    return counts;
  }

  function draftQueueMarkdowns() {
    return draftQueue.map((item) => item.markdown || "");
  }

  function activePreflightCounts() {
    return queueModeActive()
      ? markdownsSegmentCounts(draftQueueMarkdowns(), importOptions)
      : latestCounts || shared.segmentCounts([]);
  }

  function contextHasOwn(context, key) {
    return Object.prototype.hasOwnProperty.call(context || {}, key);
  }

  function preflightMarkdowns(context = {}) {
    if (Array.isArray(context.markdowns)) return context.markdowns;
    if (contextHasOwn(context, "parsed")) return null;
    return queueModeActive() ? draftQueueMarkdowns() : null;
  }

  function preflightParsed(context = {}) {
    if (contextHasOwn(context, "parsed")) return context.parsed;
    return preflightMarkdowns(context) ? null : latestParsed;
  }

  function preflightSegmentCounts(context = {}) {
    if (context.counts) return context.counts;
    if (Array.isArray(context.parsedDrafts)) return segmentCountsForParsedDrafts(context.parsedDrafts);
    const markdowns = preflightMarkdowns(context);
    if (markdowns) return markdownsSegmentCounts(markdowns, importOptions);
    const parsed = preflightParsed(context);
    return parsed ? shared.segmentCounts(parsed.segments) : latestCounts || shared.segmentCounts([]);
  }

  function preflightLocalImageFolderStatus(context = {}, vault = currentVault()) {
    if (Array.isArray(context.parsedDrafts)) {
      return localImageFolderStatusForReferences(localImageReferencesForParsedDrafts(context.parsedDrafts), vault);
    }
    const markdowns = preflightMarkdowns(context);
    if (markdowns) return localImageFolderStatusForMarkdowns(markdowns, importOptions, vault);
    return localImageFolderStatus(preflightParsed(context), vault);
  }

  function activeLocalImageFolderStatus(vault = currentVault()) {
    return preflightLocalImageFolderStatus({}, vault);
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
    const coverSource = importOptions.setCover === false ? "" : String(parsed.cover || "").trim();
    let bodyImages = 0;
    let tables = 0;
    let coverInBody = false;
    for (const segment of parsed.segments) {
      if (segment.type === "image") {
        bodyImages += 1;
        if (coverSource && !coverInBody && shared.imageSourcesMatch(segment.source, coverSource)) {
          coverInBody = true;
        }
      } else if (segment.type === "table") {
        tables += 1;
      }
    }
    const coverOnly = coverSource && !coverInBody ? 1 : 0;
    const total = bodyImages + coverOnly;
    return {
      bodyImages,
      tables,
      coverOnly,
      total,
      nearSoftLimit: total >= X_ARTICLE_MEDIA_HEADROOM_THRESHOLD && total <= X_ARTICLE_MEDIA_SOFT_LIMIT,
      overSoftLimit: total > X_ARTICLE_MEDIA_SOFT_LIMIT
    };
  }

  function mediaUploadEstimateForMarkdowns(markdowns = [], options = importOptions) {
    return mediaUploadEstimateForParsedDrafts(parsedDraftsForMarkdowns(markdowns, options));
  }

  function mediaUploadEstimateForParsedDrafts(parsedDrafts = []) {
    const totals = {
      bodyImages: 0,
      tables: 0,
      coverOnly: 0,
      total: 0,
      nearSoftLimit: false,
      overSoftLimit: false,
      overItems: []
    };
    for (const item of parsedDrafts || []) {
      try {
        const estimate = mediaUploadEstimate(item.parsed);
        totals.bodyImages += estimate.bodyImages || 0;
        totals.tables += estimate.tables || 0;
        totals.coverOnly += estimate.coverOnly || 0;
        totals.total += estimate.total || 0;
        totals.nearSoftLimit = totals.nearSoftLimit || Boolean(estimate.nearSoftLimit);
        totals.overSoftLimit = totals.overSoftLimit || Boolean(estimate.overSoftLimit);
        if (estimate.overSoftLimit) totals.overItems.push({ index: item.index, estimate });
      } catch {}
    }
    return totals;
  }

  function activePreflightMediaEstimate() {
    return queueModeActive()
      ? mediaUploadEstimateForMarkdowns(draftQueueMarkdowns(), importOptions)
      : mediaUploadEstimate(latestParsed);
  }

  function firstQueueMediaLimitBlocker(estimate = activePreflightMediaEstimate()) {
    const first = estimate?.overItems?.[0];
    if (!first) return null;
    const item = draftQueue[first.index] || null;
    const index = Number(first.index || 0) + 1;
    const title = queueItemDisplayTitle(item);
    const detail = `${localizeInterpolated("Draft {index}: {title}", { index, title })}. ${mediaLimitWarningText(first.estimate)}`;
    return {
      item,
      index,
      estimate: first.estimate,
      title: "Too many images",
      detail
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

  function batchWriteProgressValues(progress = batchWriteProgress) {
    const total = Math.max(0, Number(progress?.total || 0));
    const done = Math.min(total, Math.max(0, Number(progress?.done || 0)));
    return {
      done: String(done),
      total: String(total)
    };
  }

  function batchWriteProgressTitle(progress = batchWriteProgress) {
    if (progress?.state === "complete") return "Batch complete";
    if (progress?.state === "stopped") return "Batch stopped";
    return "Batch writing";
  }

  function batchWriteProgressTone(progress = batchWriteProgress) {
    return progress?.state === "complete" ? "done" : "batch";
  }

  function clearBatchWriteProgress({ hide = true } = {}) {
    window.clearTimeout(batchWriteProgressTimer);
    batchWriteProgressTimer = null;
    batchWriteProgress = null;
    if (hide) syncDraftMediaAlert();
  }

  function scheduleBatchWriteProgressClear() {
    window.clearTimeout(batchWriteProgressTimer);
    batchWriteProgressTimer = window.setTimeout(() => {
      clearBatchWriteProgress();
    }, 4800);
  }

  function setBatchWriteProgress(nextProgress) {
    window.clearTimeout(batchWriteProgressTimer);
    batchWriteProgressTimer = null;
    batchWriteProgress = nextProgress;
    syncDraftMediaAlert();
  }

  function setDraftMediaAlertState({ hidden, tone = "", role = "alert", live = "assertive" }) {
    setBooleanPropertyIfChanged(els.draftMediaAlert, "hidden", hidden);
    if (tone) setDatasetValueIfChanged(els.draftMediaAlert, "tone", tone);
    else removeDatasetValueIfChanged(els.draftMediaAlert, "tone");
    setAttributeValueIfChanged(els.draftMediaAlert, "role", role);
    setAttributeValueIfChanged(els.draftMediaAlert, "aria-live", live);
  }

  function setMediaLimitAlertDetail(estimate = mediaUploadEstimate()) {
    if (!els.draftMediaAlertDetail) return;
    const values = mediaNoteValues(estimate);
    const text = i18n
      ? i18n.t(X_ARTICLE_MEDIA_LIMIT_WARNING, values)
      : mediaLimitWarningText(estimate);
    removeDatasetValueIfChanged(els.draftMediaAlertDetail, "i18n");
    els.draftMediaAlertDetail.__xposterSourceText = X_ARTICLE_MEDIA_LIMIT_WARNING;
    setTextContentIfChanged(els.draftMediaAlertDetail, text);
    if (els.draftMediaAlertDetail.firstChild?.nodeType === Node.TEXT_NODE) {
      els.draftMediaAlertDetail.firstChild.__xposterSourceText = X_ARTICLE_MEDIA_LIMIT_WARNING;
    }
  }

  function syncDraftMediaAlert(estimate = mediaUploadEstimate()) {
    if (!els.draftMediaAlert) return;
    if (estimate?.overSoftLimit) {
      setDraftMediaAlertState({ hidden: false, tone: "danger" });
      setLocalizedTextIfChanged(els.draftMediaAlertTitle, "Too many images");
      setMediaLimitAlertDetail(estimate);
      return;
    }
    if (batchWriteProgress?.total > 1) {
      setDraftMediaAlertState({ hidden: false, tone: batchWriteProgressTone(), role: "status", live: "polite" });
      setLocalizedTextIfChanged(els.draftMediaAlertTitle, batchWriteProgressTitle());
      setLocalizedMessageIfChanged(els.draftMediaAlertDetail, "Success {done}/{total} drafts", batchWriteProgressValues());
      return;
    }
    setDraftMediaAlertState({ hidden: true });
    setLocalizedTextIfChanged(els.draftMediaAlertTitle, "Too many images");
    setMediaLimitAlertDetail(estimate);
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

  function remoteHttpImageSegmentsForMarkdowns(markdowns = [], options = importOptions) {
    return remoteHttpImageSegmentsForParsedDrafts(parsedDraftsForMarkdowns(markdowns, options));
  }

  function remoteHttpImageSegmentsForParsedDrafts(parsedDrafts = []) {
    const seen = new Set();
    const segments = [];
    for (const item of parsedDrafts || []) {
      try {
        for (const segment of remoteHttpImageSegments(item.parsed)) {
          const source = String(segment.source || "");
          if (!source || seen.has(source)) continue;
          seen.add(source);
          segments.push(segment);
        }
      } catch {}
    }
    return segments;
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
    const hasDraft = Boolean(latestParsed?.segments?.length || draftText().trim());
    setDatasetValueIfChanged(els.draftPanel, "emptyDraft", hasDraft || queueModeActive() ? "false" : "true");
  }

  function remoteImageProbeKey(segment) {
    return String(segment?.source || "");
  }

  function resetRemoteImageProbeStatus(parsed = latestParsed) {
    const images = remoteHttpImageSegments(parsed);
    const existing = new Map((remoteImageProbeStatus.results || []).map((item) => [item.source, item]));
    const results = [];
    let ok = 0;
    let fail = 0;
    let pending = 0;
    images.forEach((segment, index) => {
      const source = remoteImageProbeKey(segment);
      const previous = existing.get(source);
      const result = previous
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
      if (result.ok === true) ok += 1;
      else if (result.ok === false) fail += 1;
      else pending += 1;
      results.push(result);
    });
    const allCurrentImagesHaveResults = images.length > 0 && pending === 0;
    const checkedAt = images.length ? remoteImageProbeStatus.checkedAt : null;
    remoteImageProbeStatus = {
      state: allCurrentImagesHaveResults ? "checked" : "idle",
      total: images.length,
      ok,
      fail,
      results,
      checkedAt
    };
  }

  function ensureLatestParsedFromDraft() {
    analyzeDraftNow();
    return latestParsed;
  }

  function parseMarkdownForWrite(markdown) {
    const parsed = parseDraftMarkdown(markdown, {
      ...importOptions,
      sourceFileName: activeWriteSourceFileName()
    });
    const counts = shared.segmentCounts(parsed.segments);
    latestParsed = parsed;
    latestCounts = counts;
    syncRemoteImageAccessStatusFromDraft(parsed);
    updateDraftBrief();
    syncDraftMediaAlert(mediaUploadEstimate(parsed));
    return { parsed, counts };
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
        remoteImages: remoteImageEvidenceFromSegments(remoteImages),
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
      const parsed = parseDraftMarkdown(markdown || "", { sourceFileName: fallback });
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
      fileName: activeDraftSourceFileName,
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
    const activeItem = activeQueueItem();
    if (activeItem && activeItem.markdown === text) return;
    activeQueueItemId = null;
    activeDraftSourceFileName = "";
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
      clearMissingActiveQueueItem();
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

  function summarizeMarkdownTransferFiles(files) {
    const markdownFiles = [];
    let hasFiles = false;
    for (const file of Array.from(files || [])) {
      hasFiles = true;
      if (isMarkdownFile(file)) markdownFiles.push(file);
    }
    return { markdownFiles, hasFiles };
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
    const estimate = mediaUploadEstimate(parseDraftMarkdown(item?.markdown || "", { ...importOptions, sourceFileName: item?.fileName || "" }));
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

  function syncDraftSurface({ syntax = null } = {}) {
    const hasQueue = queueModeActive();
    setDatasetValueIfChanged(els.draftPanel, "queueMode", hasQueue ? "true" : "false");
    setBooleanPropertyIfChanged(els.draftQueue, "hidden", !hasQueue);
    setBooleanPropertyIfChanged(els.draftEditorShell, "hidden", hasQueue);
    setBooleanPropertyIfChanged(els.draftEditorToolbar, "hidden", hasQueue);
    setBooleanPropertyIfChanged(els.draftEditorStatus, "hidden", hasQueue);
    if (hasQueue) {
      syncVisibilityState(els.draftEditorInputWrap, true);
      if (els.markdown) {
        setAttributeValueIfChanged(els.markdown, "aria-hidden", "true");
        setNumericPropertyIfChanged(els.markdown, "tabIndex", -1);
      }
      syncVisibilityState(els.draftInlinePreview, true);
    } else {
      setDraftEditorMode(draftEditorMode, { syntax: syntax || (draftSyntaxIdleHandle ? "defer" : "now") });
    }
    updateDraftEditorStatus();
    updateDraftBrief();
  }

  function applyStoredDraftQueue(stored = {}) {
    draftQueue = Array.isArray(stored[STORAGE_DRAFT_QUEUE])
      ? stored[STORAGE_DRAFT_QUEUE].map(normalizeQueueItem).filter(Boolean).slice(0, MAX_DRAFT_QUEUE)
      : [];
    draftQueueMediaReady = !draftQueue.length;
    activeQueueItemId = draftQueue.find((item) => item.status === "loaded")?.id || activeQueueItemId;
    clearMissingActiveQueueItem();
    activeDraftSourceFileName = queueItemSourceFileName(activeQueueItemId);
    renderDraftQueue();
  }

  function restoreDraftFromStoredValue(value, { analyze = true } = {}) {
    const restored = String(value || "");
    if (queueModeActive()) {
      const activeItem = activeQueueItem() || draftQueue[0];
      activeDraftSourceFileName = normalizeSourceFileName(activeItem?.fileName);
      suppressNextTypedHistory = true;
      window.clearTimeout(draftInputHistoryTimer);
      setDraftText(activeItem?.markdown || "", { preview: false, syntax: "defer" });
      if (analyze) scheduleAnalyzeDraft(STARTUP_DRAFT_ANALYZE_DELAY_MS);
      renderDraftQueue();
      return;
    }
    if (restored.trim()) {
      restoreSingleDraftMarkdown(restored, { analyze });
      return;
    }
    activeDraftSourceFileName = "";
    setDraftText("");
    if (analyze) analyzeDraft();
    else {
      latestParsed = null;
      latestCounts = shared.segmentCounts([]);
      syncRemoteImageAccessStatusFromDraft(null);
      updateWriteButton();
    }
    syncDraftSurface({ syntax: "none" });
  }

  function applyStartupDraftState(stored = {}) {
    applyStoredDraftQueue(stored);
    restoreDraftFromStoredValue(stored[STORAGE_DRAFT], { analyze: false });
    runWhenIdle(() => {
      analyzeDraft({ deferDetails: true });
    }, STARTUP_DRAFT_ANALYZE_DELAY_MS);
  }

  function restoreSingleDraftMarkdown(markdown, { analyze = true } = {}) {
    const text = String(markdown || "");
    activeQueueItemId = null;
    draftQueue = [];
    draftQueueMediaReady = true;
    activeDraftSourceFileName = "";
    setDraftText(text, { preview: false, syntax: "defer" });
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
    activeDraftSourceFileName = normalizeSourceFileName(fileName);
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
    if (els.draftQueueMeta) setLocalizedTextIfChanged(els.draftQueueMeta, queueSummaryText());
    if (!hasQueue) {
      setSourceHtmlIfChanged(els.draftQueueList, "");
      updateWriteButton();
      return;
    }
    const safe = shared.escapeHtml;
    const queueHtml = draftQueue.map((item, index) => {
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
    if (setSourceHtmlIfChanged(els.draftQueueList, queueHtml)) translateDynamicDom(els.draftQueue);
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
      const item = queueItemById(id);
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
    if (wasActive) {
      activeQueueItemId = null;
      activeDraftSourceFileName = "";
    }
    if (!draftQueue.length) {
      suppressNextTypedHistory = true;
      window.clearTimeout(draftInputHistoryTimer);
      activeDraftSourceFileName = "";
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
    if (wasActive || !activeQueueItemId || !clearMissingActiveQueueItem()) {
      const nextItem = draftQueue[Math.min(index, draftQueue.length - 1)];
      loadQueueItem(nextItem.id, { persist: false, remember: false });
    } else {
      activeDraftSourceFileName = queueItemSourceFileName(activeQueueItemId);
      renderDraftQueue();
      updateWriteButton();
    }
    persistDraftQueue();
    setDraftDropStatus("Draft removed", queueSummaryText(), "done");
    log("Queued draft removed.");
    return true;
  }

  function loadQueueItem(id, { persist = true, remember = true } = {}) {
    const item = queueItemById(id);
    if (!item) return false;
    activeQueueItemId = item.id;
    activeDraftSourceFileName = normalizeSourceFileName(item.fileName);
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
      activeDraftSourceFileName = "";
      setDraftText("");
      saveDraft();
      analyzeDraft();
      setDraftDropStatus("Markdown draft", "Paste Markdown here, choose a file, or drop .md files.", "idle");
    } else {
      activeDraftSourceFileName = queueItemSourceFileName(activeQueueItemId);
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
    const item = queueItemById(id);
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
      activeDraftSourceFileName = normalizeSourceFileName(updated.fileName);
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
    setBooleanPropertyIfChanged(els.recordEditSheet, "hidden", !open);
    updateModalOpenState();
  }

  function recordEditorText() {
    return els.recordEditTextarea?.value || "";
  }

  function updateRecordEditorStats() {
    if (!els.recordEditStats) return;
    const text = recordEditorText();
    const stats = editorStatsText(text, markdownSegmentCounts(text));
    setBooleanPropertyIfChanged(els.recordEditStats, "hidden", !stats);
    setLocalizedTextIfChanged(els.recordEditStats, stats);
  }

  function syncRecordEditSyntaxScroll() {
    syncScrollPositionIfChanged(els.recordEditHighlight, els.recordEditTextarea);
  }

  function renderRecordEditHighlight() {
    renderMarkdownSyntaxHighlight(els.recordEditHighlight, recordEditorText());
    syncRecordEditSyntaxScroll();
  }

  function updateRecordEditPreview() {
    if (!els.recordEditPreviewBody) return;
    const text = recordEditorText();
    const previewHtml = text.trim()
      ? markdownPreviewHtml(text)
      : emptyMarkdownPreviewHtml();
    if (setSourceHtmlIfChanged(els.recordEditPreviewBody, previewHtml)) {
      translateDynamicDom(els.recordEditPreview || els.recordEditSheet);
    }
  }

  function updateRecordEditModeToggle() {
    updateEditorModeToggle(els.recordEditModeToggle, recordEditMode);
  }

  function updateRecordEditorMode(mode = recordEditMode) {
    recordEditMode = DRAFT_EDITOR_MODES.has(mode) ? mode : "edit";
    const isEdit = recordEditMode === "edit";
    setDatasetValueIfChanged(els.recordEditBody, "mode", recordEditMode);
    syncVisibilityState(els.recordEditInputWrap, !isEdit);
    if (els.recordEditTextarea) {
      setAttributeValueIfChanged(els.recordEditTextarea, "aria-hidden", isEdit ? "false" : "true");
      setNumericPropertyIfChanged(els.recordEditTextarea, "tabIndex", isEdit ? 0 : -1);
    }
    setBooleanPropertyIfChanged(els.recordEditToolbar, "hidden", !isEdit);
    syncVisibilityState(els.recordEditPreview, isEdit);
    setDatasetValueIfChanged(els.recordEditPreview, "previewMode", "read");
    updateRecordEditModeToggle();
    recordEditCommandButtons.forEach((button) => {
      setBooleanPropertyIfChanged(button, "disabled", !isEdit);
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
    setLocalizedTextIfChanged(els.recordEditTitle, title);
    setLocalizedTextIfChanged(els.recordEditMeta, meta);
    setLocalizedTextIfChanged(els.recordEditPrimaryLabel, primaryLabel);
    setDatasetValueIfChanged(els.recordEditTextarea, "editorMode", mode);
    setDatasetValueIfChanged(els.recordEditTextarea, "recordId", mode === "record" ? id : "");
    setDatasetValueIfChanged(els.recordEditTextarea, "queueId", mode === "queue" || mode === "new" ? id : "");
    setPropertyValueIfChanged(els.recordEditTextarea, "value", value);
    resetEditorHistory(els.recordEditTextarea);
    setBooleanPropertyIfChanged(els.recordEditWriteButton, "hidden", mode !== "queue");
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
    const cleanedMarkers = Array.from(new Set(candidates.flatMap((item) => item.cleanedMarkers || [])));
    const cleanupAttempted = candidates.some((item) => item.cleanupAttempted);
    return {
      detected,
      markers,
      cleanupAttempted,
      cleanedMarkers,
      detail: detected
        ? `Old Markdown importer detected${markers.length ? `: ${markers.join(", ")}` : "."}`
        : cleanedMarkers.length
          ? `Old Markdown importer residue was removed${cleanedMarkers.length ? `: ${cleanedMarkers.join(", ")}` : "."}`
        : ""
    };
  }

  function delay(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function currentVault() {
    return latestPageStatus?.vault || latestDiagnostics?.vault || null;
  }

  function updateProgressiveSections(context = {}) {
    syncProgressiveSectionVisibility(context);
  }

  function scheduleAnalyzeDraft(delay = DRAFT_ANALYZE_DELAY_MS, options = {}) {
    window.clearTimeout(draftAnalyzeTimer);
    draftAnalyzeTimer = window.setTimeout(() => {
      draftAnalyzeTimer = null;
      analyzeDraft(options);
    }, delay);
  }

  function analyzeDraftNow(options = {}) {
    window.clearTimeout(draftAnalyzeTimer);
    draftAnalyzeTimer = null;
    analyzeDraft(options);
  }

  function analyzeDraft(options = {}) {
    renderDraftAnalysis(options);
  }

  function syncDraftInspectorMetrics(parsed = null, counts = shared.segmentCounts([])) {
    setAttributeValueIfChanged(els.inspector, "data-has-draft", parsed ? "true" : "false");
    setTextContentIfChanged(els.titleMetric, parsed?.title || "None");
    setTextContentIfChanged(els.imageMetric, String(counts.image || 0));
    setTextContentIfChanged(els.tableMetric, String(counts.table || 0));
    setTextContentIfChanged(els.tweetMetric, String(counts.tweet || 0));
    const metadataOptions = importOptionsPayload();
    const coverMeta = !parsed
      ? "Load Markdown or write a cover idea when ready."
      : metadataOptions.setCover === false
        ? "Cover import is off; direct cover generation still works."
        : parsed.cover
          ? "Draft already has a cover source; generate only if you want a replacement."
          : "No cover source found; generate one when ready.";
    setLocalizedTextIfChanged(els.draftCoverToolMeta, coverMeta);
  }

  function renderDraftDetails(markdown, parsed, counts, context = {}) {
    if (markdown !== draftText() || parsed !== latestParsed) return;
    const imageSummary = context.imageSummary || draftImageSummary(parsed);
    renderPreview(parsed, counts);
    updateConversionMap(parsed, counts, { imageSummary });
    updateImportLedger(parsed, counts);
    renderDraftReview(parsed, counts, { imageSummary });
    updatePreflight();
  }

  function scheduleDraftDetailRender(markdown, parsed, counts, context = {}) {
    cancelDeferredDraftDetailRender();
    const imageSummary = context.imageSummary || draftImageSummary(parsed);
    const tasks = [
      () => renderPreview(parsed, counts),
      () => updateConversionMap(parsed, counts, { imageSummary }),
      () => updateImportLedger(parsed, counts),
      () => renderDraftReview(parsed, counts, { imageSummary }),
      () => updatePreflight()
    ];
    let index = 0;
    const runNext = () => {
      draftDetailRenderIdleHandle = null;
      if (markdown !== draftText() || parsed !== latestParsed) return;
      const task = tasks[index];
      index += 1;
      task?.();
      if (index < tasks.length) {
        draftDetailRenderIdleHandle = runWhenIdle(runNext, STARTUP_IDLE_TIMEOUT_MS);
      }
    };
    draftDetailRenderIdleHandle = runWhenIdle(runNext, STARTUP_IDLE_TIMEOUT_MS);
  }

  function renderDraftAnalysis({ deferDetails = false } = {}) {
    cancelDeferredDraftDetailRender();
    const markdown = draftText();
    if (!markdown.trim()) {
      latestParsed = null;
      latestParsedMarkdown = "";
      latestCounts = shared.segmentCounts([]);
      syncDraftInspectorMetrics(null, latestCounts);
      syncRemoteImageAccessStatusFromDraft(null);
      updateDraftBrief();
      renderPreview(null);
      updateConversionMap(null);
      updateImportLedger(null);
      renderDraftReview(null);
      updatePreflight();
      updateWriteButton();
      updateProgressiveSections();
      updateAiCoverReadiness();
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
      latestParsedMarkdown = markdown;
      latestCounts = counts;
      syncDraftInspectorMetrics(parsed, counts);
      syncRemoteImageAccessStatusFromDraft(parsed);
      updateDraftBrief();
      const remoteImages = remoteHttpImageSegments(parsed);
      if (hasChromeApi() && remoteImages.length) {
        refreshRemoteImageAccessStatus(parsed).catch(() => {});
      }
      if (!remoteImages.length) resetRemoteImageProbeStatus(parsed);
      const imageSummary = draftImageSummary(parsed);
      updateWriteButton();
      updateProgressiveSections();
      updateAiCoverReadiness();
      syncDraftMediaAlert(mediaUploadEstimate(parsed));
      updateDraftEditorStatus();
      setDraftDropStatus("Markdown loaded", draftReadyDetail(markdown.length, counts), "done");
      if (deferDetails) scheduleDraftDetailRender(markdown, parsed, counts, { imageSummary });
      else renderDraftDetails(markdown, parsed, counts, { imageSummary });
    } catch (error) {
      cancelDeferredDraftDetailRender();
      latestParsed = null;
      latestParsedMarkdown = "";
      latestCounts = shared.segmentCounts([]);
      log(`Could not analyze draft: ${error?.message || error}`);
      showMarkdownLoadError(error?.message || MARKDOWN_LOAD_ERROR_DETAIL);
      updateAiCoverReadiness();
    }
  }

  function updateConversionMap(parsed, counts = null, context = {}) {
    if (!els.conversionMapList) return;
    const rows = buildConversionMap(parsed, counts || (parsed ? shared.segmentCounts(parsed.segments) : shared.segmentCounts([])), context);
    let ready = 0;
    let active = 0;
    for (const row of rows) {
      if (row.tone === "ok" || row.tone === "ready") ready += 1;
      if (row.count > 0) active += 1;
    }
    setLocalizedTextIfChanged(
      els.conversionMapMeta,
      parsed
        ? `${active} content type(s) found; ${ready}/${rows.length} ready to import.`
        : "Load Markdown to see text, images, tables, tweets, code, and dividers."
    );
    for (const row of rows) {
      const item = conversionMapItems.get(row.id);
      if (!item) continue;
      syncStatusRow(item, {
        tone: row.tone,
        label: row.label,
        detail: row.detail,
        status: row.countLabel || String(row.count)
      });
    }
    translateDynamicDom(conversionMapSection);
  }

  function updateImportLedger(parsed = latestParsed, counts = null) {
    if (!els.importLedgerList) return;
    const rows = buildImportLedger(parsed, counts || (parsed ? shared.segmentCounts(parsed.segments) : shared.segmentCounts([])));
    if (!parsed?.segments?.length) {
      setLocalizedTextIfChanged(els.importLedgerMeta, "Load Markdown to see what each block will become.");
    } else {
      let blocked = 0;
      let waiting = 0;
      let direct = 0;
      let mediaLimit = 0;
      for (const row of rows) {
        if (row.tone === "error") blocked += 1;
        if (row.tone === "warn") waiting += 1;
        if (row.path === "Write text") direct += 1;
        if (row.kind === "media-limit") mediaLimit += 1;
      }
      const plannedRows = Math.max(0, rows.length - mediaLimit);
      setLocalizedTextIfChanged(
        els.importLedgerMeta,
        blocked
          ? `${blocked} item(s) need attention; ${waiting} waiting; ${direct} text item(s) ready.`
          : `${plannedRows} item(s) planned; ${waiting} waiting; ${direct} text item(s) ready.`
      );
    }
    let importLedgerHtml = rows
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
      importLedgerHtml += `
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
    if (setSourceHtmlIfChanged(els.importLedgerList, importLedgerHtml)) {
      translateDynamicDom(importLedgerSection);
    }
  }

  function buildPublishRailTargetRow(byId) {
    const target = byId.get("target") || {};
    const pageScript = byId.get("page-script") || {};
    const targetLock = byId.get("target-lock") || {};
    const editor = byId.get("editor") || {};
    if (target.tone !== "ok") {
      return {
        id: "target",
        tone: latestParsed?.segments?.length || queueModeActive() ? "warn" : "idle",
        label: "X",
        detail: "Connect the target page.",
        status: "Open"
      };
    }
    if (pageScript.tone === "error") {
      return {
        id: "target",
        tone: "error",
        label: "X",
        detail: "Refresh the X Article tab so the latest xPoster page script handles images.",
        status: "Refresh"
      };
    }
    if (targetLock.tone === "error") {
      return {
        id: "target",
        tone: "error",
        label: "X",
        detail: targetLock.detail || "Run Check article again before importing.",
        status: "Check"
      };
    }
    if (targetLock.tone !== "ok") {
      return {
        id: "target",
        tone: "warn",
        label: "X",
        detail: "Run Check to confirm target.",
        status: "Check"
      };
    }
    if (editor.tone === "ok") {
      return {
        id: "target",
        tone: "ok",
        label: "X",
        detail: "Editor ready.",
        status: "Ready"
      };
    }
    return {
      id: "target",
      tone: "ready",
      label: "X",
      detail: "Can create a draft.",
      status: "Can create"
    };
  }

  function buildPublishRailDraftRow() {
    if (queueModeActive()) {
      return {
        id: "draft",
        tone: "ok",
        label: "Draft",
        detail: localizeInterpolated("{count} queued draft(s).", { count: draftQueue.length }),
        status: "Queue"
      };
    }
    if (latestParsed?.segments?.length) {
      const titleState = localizeText(latestParsed.title ? "title ready" : "no title");
      return {
        id: "draft",
        tone: "ok",
        label: "Draft",
        detail: localizeInterpolated("{count} publishable block(s), {titleState}.", {
          count: latestParsed.segments.length,
          titleState
        }),
        status: "Loaded"
      };
    }
    if (draftText().trim()) {
      return {
        id: "draft",
        tone: "warn",
        label: "Draft",
        detail: "No publishable blocks detected yet.",
        status: "Review"
      };
    }
    return {
      id: "draft",
      tone: "idle",
      label: "Draft",
      detail: "Paste or choose Markdown.",
      status: "Idle"
    };
  }

  function publishRailAssetDetail(counts = activePreflightCounts()) {
    const parts = [];
    if (counts.image) parts.push(formatCompactUnit(counts.image, "image", "images", "张图片"));
    if (counts.table) parts.push(formatCompactUnit(counts.table, "table", "tables", "个表格"));
    if (counts.tweet) parts.push(formatCompactUnit(counts.tweet, "tweet", "tweets", "条推文"));
    return parts.join(", ");
  }

  function buildPublishRailAssetsRow(byId, context = {}) {
    const hasDraft = queueModeActive() || Boolean(latestParsed?.segments?.length);
    if (!hasDraft) {
      return {
        id: "assets",
        tone: "idle",
        label: "Assets",
        detail: "Waiting for draft.",
        status: "Idle"
      };
    }
    const counts = preflightSegmentCounts(context);
    const estimate = activePreflightMediaEstimate();
    const assets = byId.get("assets") || {};
    const uploads = byId.get("uploads") || {};
    if (estimate.overSoftLimit) {
      return {
        id: "assets",
        tone: "error",
        label: "Assets",
        detail: mediaLimitWarningText(estimate),
        status: "Limit"
      };
    }
    if (assets.tone === "error") {
      return {
        id: "assets",
        tone: "error",
        label: "Assets",
        detail: assets.detail || "Local image path blocked.",
        status: "Blocked"
      };
    }
    if (assets.tone === "warn") {
      return {
        id: "assets",
        tone: "warn",
        label: "Assets",
        detail: assets.detail || "Choose the local image folder.",
        status: "Folder"
      };
    }
    if ((counts.image || 0) > 0 && uploads.tone !== "ok") {
      return {
        id: "assets",
        tone: "warn",
        label: "Assets",
        detail: "Open the X editor and run Check so images can upload.",
        status: "Check"
      };
    }
    if (estimate.nearSoftLimit) {
      return {
        id: "assets",
        tone: "warn",
        label: "Assets",
        detail: mediaHeadroomText(estimate),
        status: "Limit"
      };
    }
    const detail = publishRailAssetDetail(counts);
    if (detail) {
      return {
        id: "assets",
        tone: "ok",
        label: "Assets",
        detail,
        status: "Ready"
      };
    }
    return {
      id: "assets",
      tone: "ok",
      label: "Assets",
      detail: "No image or table uploads required.",
      status: "Text only"
    };
  }

  function buildPublishRailCoverRow() {
    const generated = aiCoverCandidates.length;
    const hasDraft = Boolean(latestParsed?.segments?.length || draftText().trim());
    if (generated) {
      return {
        id: "cover",
        tone: "ready",
        label: "Cover",
        detail: localizeInterpolated("{count} generated cover candidate(s) ready.", { count: generated }),
        status: "Generated"
      };
    }
    if (!hasDraft) {
      return {
        id: "cover",
        tone: "idle",
        label: "Cover",
        detail: "Optional until needed.",
        status: "Optional"
      };
    }
    if (importOptions.setCover === false) {
      return {
        id: "cover",
        tone: "idle",
        label: "Cover",
        detail: "Cover import is off; generation still works.",
        status: "Off"
      };
    }
    if (latestParsed?.cover) {
      return {
        id: "cover",
        tone: "ok",
        label: "Cover",
        detail: "Draft cover source is ready.",
        status: "Detected"
      };
    }
    return {
      id: "cover",
      tone: "warn",
      label: "Cover",
      detail: "Generate one or add frontmatter cover.",
      status: "Missing"
    };
  }

  function publishNextStepFromRows(rows, gate = null) {
    const byId = new Map(rows.map((row) => [row.id, row]));
    const draft = byId.get("draft") || {};
    const target = byId.get("target") || {};
    const assets = byId.get("assets") || {};

    if (draft.tone !== "ok") {
      return {
        step: "draft",
        tone: draft.tone || "idle",
        title: "Add Markdown",
        detail: draft.detail || "Paste or choose Markdown."
      };
    }
    if (target.tone === "error") {
      return {
        step: "check",
        tone: "error",
        title: target.status === "Refresh" ? "Refresh X Article" : "Check X Article",
        detail: target.detail || "Run Check before writing."
      };
    }
    if (target.tone === "warn" || target.tone === "idle") {
      return {
        step: target.status === "Open" ? "target" : "check",
        tone: "warn",
        title: target.status === "Open" ? "Open X Articles" : "Check X Article",
        detail: target.detail || "Open X Articles before writing."
      };
    }
    if (assets.tone === "error") {
      return {
        step: "assets",
        tone: "error",
        title: assets.status === "Limit" ? "Reduce images" : "Fix image paths",
        detail: assets.detail || "Open details to fix image handling."
      };
    }
    if (assets.tone === "warn") {
      return {
        step: "assets",
        tone: "warn",
        title: assets.status === "Folder" ? "Choose image folder" : "Check image upload",
        detail: assets.detail || "Open details to finish image handling."
      };
    }
    if (gate?.ok) {
      return {
        step: "import",
        tone: "ready",
        title: "Ready to write",
        detail: "Click the Write button below when you are ready."
      };
    }
    if (gate?.message) {
      return {
        step: "check",
        tone: gate.tone || "warn",
        title: "Needs attention",
        detail: gate.message
      };
    }
    return {
      step: "import",
      tone: "ready",
      title: "Ready to write",
      detail: "Click the Write button below when you are ready."
    };
  }

  function updatePublishRail(checks = buildPreflightChecks(), gate = null, context = {}) {
    if (!els.publishRail) return;
    const byId = context.byId || indexPreflightChecks(checks);
    const rows = [
      buildPublishRailTargetRow(byId),
      buildPublishRailDraftRow(),
      buildPublishRailAssetsRow(byId, { ...context, byId }),
      buildPublishRailCoverRow()
    ];
    const next = publishNextStepFromRows(rows, gate);
    setDatasetValueIfChanged(els.publishRail, "tone", next.tone || "idle");
    setDatasetValueIfChanged(els.publishRail, "publishStep", next.step || "");
    setLocalizedTextIfChanged(publishNextTitle, next.title || "Next step");
    setLocalizedTextIfChanged(publishNextDetail, next.detail || "");
    const label = `${localizeText("Next step")}: ${localizeText(next.title || "")}. ${localizeText(next.detail || "")}`;
    setAttributeValueIfChanged(els.publishRail, "aria-label", label);
    setAttributeValueIfChanged(els.publishRail, "title", label);
    translateDynamicDom(els.publishRail, { syncEnvironment: false });
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
        detail: titleLedgerDetail(parsed),
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
        detail: `${segment.headers.length} column(s), ${segment.rows.length} row(s); inserted as an X Markdown table block.`,
        path: "Markdown table",
        tone: state.bridgeReady ? "ok" : "warn"
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

  function titleLedgerDetail(parsed = latestParsed) {
    const title = truncateLedgerText(parsed?.title || "");
    if (!title) return "No article title will be applied.";
    if (parsed?.titleFromMeta) return `Frontmatter title will be applied: ${title}`;
    if (parsed?.titleFromCandidate) return `File name will be used as article title: ${title}`;
    return `First H1 was promoted to article title: ${title}`;
  }

  function draftImageSummary(parsed = latestParsed) {
    const imageSegments = [];
    const remoteImages = [];
    const localImages = localImageReferences(parsed);
    const absoluteLocalImages = [];
    const coverSource = String(parsed?.cover || "");
    let coverInBody = false;
    for (const segment of parsed?.segments || []) {
      if (segment.type !== "image") continue;
      imageSegments.push(segment);
      if (isRemoteHttpImageSource(segment.source)) remoteImages.push(segment);
      if (!coverInBody && coverSource && segment.source === coverSource) coverInBody = true;
    }
    for (const item of localImages) {
      if (shared.isAbsoluteLocalImageSource(item.source)) absoluteLocalImages.push(item);
    }
    return {
      imageSegments,
      localImages,
      remoteImages,
      absoluteLocalImages,
      coverInBody
    };
  }

  function buildConversionMap(parsed, counts, context = {}) {
    const empty = !parsed?.segments?.length;
    const metadataOptions = importOptionsPayload();
    const { localImages, remoteImages, absoluteLocalImages, coverInBody } = context.imageSummary || draftImageSummary(parsed);
    const status = latestPageStatus || {};
    const main = latestDiagnostics?.main || {};
    const vault = status.vault || latestDiagnostics?.vault || {};
    const needsUploads = (counts.image || 0) > 0;
    const uploadReady = !needsUploads || Boolean(main.hasOnFilesAdded);
    const bridgeReady = Boolean(main.hasDraftStateNode);
    const localReady = !localImages.length || (vault.configured && vault.permission === "granted");

    if (empty) {
      return [
        ["title", "Title", "idle", "Waiting for frontmatter or first H1.", 0],
        ["cover", "Cover", "idle", "Waiting for frontmatter cover or first image.", 0],
        ["text", "Text", "idle", "Headings, paragraphs, lists, quotes, links, and inline styles.", 0],
        ["image", "Images", "idle", "Prepared as files, then uploaded through X.", 0],
        ["table", "Tables", "idle", "Inserted as X Markdown table blocks.", 0],
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
            ? parsed.titleFromCandidate
              ? "Will use the source file name as the X Article title when possible."
              : "Will set the X Article title when possible."
            : "Add frontmatter title, a first H1, or load from a named file."
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
        tone: counts.table ? (bridgeReady ? "ok" : "warn") : "idle",
        detail: counts.table
          ? bridgeReady
            ? "Tables use X's native Markdown table rendering."
            : "Open the X editor and run Check so tables can be inserted."
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

  function renderDraftReview(parsed, counts = null, context = {}) {
    if (!parsed) {
      setLocalizedTextIfChanged(els.reviewMeta, "Write Markdown to get publishing notes.");
      if (setSourceHtmlIfChanged(els.reviewList, `<li>No draft loaded.</li>`)) {
        translateDynamicDom(reviewSection);
      }
      return;
    }
    const notes = buildDraftReview(parsed, counts || shared.segmentCounts(parsed.segments), context);
    let blockers = 0;
    let warnings = 0;
    let reviewHtml = "";
    for (const note of notes) {
      if (note.tone === "error") blockers += 1;
      if (note.tone === "warn") warnings += 1;
      reviewHtml += `<li data-tone="${note.tone}" ${note.kind ? `data-note="${shared.escapeHtml(note.kind)}"` : ""}>${shared.escapeHtml(note.text)}</li>`;
    }
    setLocalizedTextIfChanged(
      els.reviewMeta,
      blockers
        ? `${blockers} blocker(s), ${warnings} warning(s)`
        : warnings
          ? `${warnings} warning(s), no blockers`
          : "No blockers found"
    );
    if (setSourceHtmlIfChanged(els.reviewList, reviewHtml)) {
      translateDynamicDom(reviewSection);
    }
  }

  function buildDraftReview(parsed, counts, context = {}) {
    const notes = [];
    const metadataOptions = importOptionsPayload();
    const { localImages, remoteImages, absoluteLocalImages, coverInBody } = context.imageSummary || draftImageSummary(parsed);
    const uploadCount = counts.image || 0;

    if (!metadataOptions.setTitle) notes.push({ tone: "idle", text: "Title setting is off; headings stay in the article body." });
    else if (parsed.titleFromCandidate) notes.push({ tone: "ok", text: `Title will use file name: ${parsed.title}` });
    else if (parsed.title) notes.push({ tone: "ok", text: `Title detected: ${parsed.title}` });
    else notes.push({ tone: "warn", text: "No title detected. Add frontmatter title, a first-level heading, or load the draft from a named file." });

    if (!metadataOptions.setCover) {
      notes.push({ tone: "idle", text: "Cover setting is off; images stay in the article body." });
    } else if (parsed.cover) {
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
        text: `${uploadCount} image item(s) will be uploaded through X. Tables stay editable through X Markdown.`
      });
    } else {
      notes.push({ tone: "ok", text: "No media uploads required." });
    }

    if (counts.tweet || counts.code || counts.divider || counts.table) {
      notes.push({
        tone: "ok",
        text: `${(counts.tweet || 0) + (counts.code || 0) + (counts.divider || 0) + (counts.table || 0)} special content block(s) will be placed in X.`
      });
    }

    return notes;
  }

  function renderPreview(parsed, counts = null) {
    if (!parsed) {
      setLocalizedTextIfChanged(els.previewTitle, "No title yet");
      setLocalizedTextIfChanged(els.previewMeta, "Paste Markdown to see what xPoster will move into X.");
      const previewChanged = setSourceHtmlIfChanged(
        els.previewBody,
        `<p class="empty">This is a recognition preview. Image links stay as text in the draft box; xPoster downloads public images during Write and keeps failed downloads as links.</p>`
      );
      const readinessChanged = setSourceHtmlIfChanged(
        els.planReadiness,
        `<span>Text blocks 0</span><span>Special blocks 0</span><span>Images 0</span><span>Local images 0</span>`
      );
      setLocalizedTextIfChanged(planBreakdownDetail, "Load Markdown to see the plain-language import steps.");
      const stepsChanged = setSourceHtmlIfChanged(
        els.planSteps,
        `<li><span class="plan-step-kind">Start</span><span class="plan-step-text">Paste a draft or choose a Markdown file.</span></li>`
      );
      if (previewChanged || readinessChanged || stepsChanged) translateDynamicDom(els.previewPanel);
      return;
    }
    const safe = shared.escapeHtml;
    const derivedCounts = counts || shared.segmentCounts(parsed.segments);
    const specialCount = (derivedCounts.tweet || 0) + (derivedCounts.code || 0) + (derivedCounts.divider || 0);
    setLocalizedTextIfChanged(els.previewTitle, importOptions.setTitle === false ? "Article body" : parsed.title || "Untitled article");
    let previewMeta = [
      `${derivedCounts.text || 0} text part(s)`,
      `${derivedCounts.image || 0} image(s)`,
      `${derivedCounts.table || 0} table(s)`,
      `${specialCount} special block(s)`
    ].join(" · ");
    if (derivedCounts.image) {
      previewMeta += " · image links convert during Import";
    }
    setLocalizedTextIfChanged(els.previewMeta, previewMeta);
    const visiblePreviewLimit = 18;
    const rows = [];
    for (let index = 0; index < parsed.segments.length && index < visiblePreviewLimit; index += 1) {
      const segment = parsed.segments[index];
      const kind = previewKindLabel(segment);
      const text = previewSegmentText(segment);
      rows.push(`<div class="preview-item"><span class="preview-kind">${safe(kind)}</span><span class="preview-text">${safe(text)}</span></div>`);
    }
    if (parsed.segments.length > visiblePreviewLimit) {
      rows.push(`<p class="empty">${parsed.segments.length - visiblePreviewLimit} more block(s) hidden in preview.</p>`);
    }
    const previewBodyChanged = setSourceHtmlIfChanged(
      els.previewBody,
      rows.join("") || `<p class="empty">No publishable blocks detected yet.</p>`
    );
    const planChanged = renderPlanReadiness(parsed);
    if (previewBodyChanged || planChanged) translateDynamicDom(els.previewPanel);
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
    let textBlocks = 0;
    parsed.segments.forEach((segment, index) => {
      if (segment.type === "text") {
        textBlocks += 1;
      }
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
    let atomic = 0;
    let images = 0;
    for (const item of plan.plan) {
      if (item.op.type === "atomic") atomic += 1;
      if (item.op.type === "image") images += 1;
    }
    const local = localImageReferences(parsed).length;
    const readinessHtml = [
      `<span>Text blocks ${textBlocks}</span>`,
      `<span>Special blocks ${atomic}</span>`,
      `<span>Images ${images}</span>`,
      `<span>Local images ${local}</span>`
    ].join("");
    const readinessChanged = setSourceHtmlIfChanged(els.planReadiness, readinessHtml);
    return renderPlanBreakdown(plan, { atomic, images, local, textBlocks, readinessChanged });
  }

  function renderPlanBreakdown(plan, summary) {
    setLocalizedTextIfChanged(
      planBreakdownDetail,
      `${summary.textBlocks} text part(s), ${summary.images} image upload(s), ${summary.atomic} special block(s).`
    );
    const safe = shared.escapeHtml;
    const visibleStepLimit = 8;
    const totalSteps = 1 + plan.plan.length;
    let renderedSteps = 0;
    const stepItemHtml = (kind, text) => `<li><span class="plan-step-kind">${safe(kind)}</span><span class="plan-step-text">${safe(text)}</span></li>`;
    let stepsHtml = stepItemHtml(
      "Write text",
      summary.textBlocks
        ? `Write ${summary.textBlocks} text part(s) into the X Article body.`
        : "No article text was found yet."
    );
    renderedSteps += 1;
    for (const item of plan.plan) {
      if (renderedSteps >= visibleStepLimit) break;
      if (item.op.type === "image") {
        const label = item.op.coverOnly ? "Cover image" : "Image";
        const fileName = item.op.file?.fileName || "prepared media";
        stepsHtml += stepItemHtml("Upload image", `${label} will upload as ${fileName}.`);
      } else {
        const entity = item.op.table ? "Markdown table" : item.op.entityType === "MARKDOWN" ? "code block" : item.op.entityType === "TWEET" ? "tweet link" : "divider";
        stepsHtml += stepItemHtml("Place block", `${entity} will be placed where it appears in your draft.`);
      }
      renderedSteps += 1;
    }
    if (totalSteps > visibleStepLimit) {
      stepsHtml += stepItemHtml("More", `${totalSteps - visibleStepLimit} more step(s) are hidden here but included during import.`);
    }
    return Boolean(summary.readinessChanged || setSourceHtmlIfChanged(els.planSteps, stepsHtml));
  }

  function updatePreflight(checks = buildPreflightChecks()) {
    const byId = indexPreflightChecks(checks);
    const preflightContext = preflightEvidenceContext(checks, { byId });
    let readyCount = 0;
    for (const check of checks) {
      if (check.tone === "ok") readyCount += 1;
      const item = preflightItems.get(check.id);
      if (!item) continue;
      syncStatusRow(item, { tone: check.tone, label: check.label, detail: check.detail });
      const actionButton = preflightActionButtons.get(check.id);
      if (actionButton) {
        setBooleanPropertyIfChanged(actionButton, "hidden", !check.action);
        setDatasetValueIfChanged(actionButton, "preflightAction", check.action || "");
        setLocalizedTextIfChanged(actionButton, check.button || "Choose");
      }
    }
    setLocalizedTextIfChanged(els.preflightMeta, `${readyCount}/${checks.length} checks ready`);
    const gate = getImportGate(checks, preflightContext);
    const actions = els.importDraft?.closest(".actions");
    if (actions) setDatasetValueIfChanged(actions, "empty", latestParsed?.segments?.length ? "false" : "true");
    updatePublishRail(checks, gate, preflightContext);
    updateWriteButton();
    updateLiveRunbook(checks, gate, preflightContext);
    updateProofDeck(checks, gate, preflightContext);
    updateCompletionAudit(checks, gate, preflightContext);
    updateRecoveryPanel(checks, gate, preflightContext);
    updateTargetContextPanel();
    updateIssueQueue(checks, gate, preflightContext);
    updateExecutionTimeline(checks, gate, preflightContext);
    syncRecordPanel();
    translateDynamicDom(els.preflightPanel);
  }

  function primaryImportAction(gate) {
    if (queueModeActive()) return { action: "batch", label: "Write all drafts", enabled: !batchWriting };
    if (latestParsed?.segments?.length) return { action: "import", label: "Write to X draft", enabled: !batchWriting };
    return { action: "blocked", label: "No Markdown yet", enabled: false };
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
    const byId = indexPreflightChecks(checks);
    const gate = getImportGate(checks, { byId });
    const localAssetBlocker = localAssetWriteBlocker(checks, { byId });
    if (localAssetBlocker) {
      return handleLocalAssetWriteBlocker(localAssetBlocker, {
        chooseWhenAvailable: true,
        retryAfterChoose: () => (queueModeActive() ? importDraftQueue() : importDraft())
      });
    }
    const action = primaryImportAction(gate);
    if (action.action === "import") return importDraft();
    if (action.action === "batch") return importDraftQueue();
    focusMarkdownInput();
    setDraftDropStatus("Markdown draft", "Paste Markdown here, choose a file, or drop .md files.", "idle");
    return null;
  }

  function importButtonLabelNode() {
    const button = els.importDraft;
    if (!button) return null;
    if (importDraftNodes.label?.isConnected) return importDraftNodes.label;
    setSourceHtmlIfChanged(button, `${importDraftNodes.iconMarkup}<span></span>`);
    importDraftNodes.label = button.lastElementChild?.tagName === "SPAN" ? button.lastElementChild : null;
    return importDraftNodes.label;
  }

  function setImportButtonLabel(label) {
    const labelNode = importButtonLabelNode();
    if (labelNode) setLocalizedTextIfChanged(labelNode, label);
  }

  function updateWriteButton({ busy = false } = {}) {
    const hasDraft = Boolean(latestParsed?.segments?.length);
    const hasQueue = queueModeActive();
    const button = els.importDraft;
    if (!button) return;
    const actions = button.closest(".actions");
    setDatasetValueIfChanged(actions, "empty", hasDraft || hasQueue || busy || batchWriting ? "false" : "true");
    const needsMarkdown = !hasDraft && !hasQueue;
    const disabled = busy || batchWriting || needsMarkdown;
    const hasWriteableContent = hasDraft || hasQueue;
    const shouldRevealReadyButton =
      hasDraft &&
      !hasQueue &&
      !busy &&
      !batchWriting &&
      !lastWriteButtonContentReady &&
      !prefersReducedMotion();
    const label = batchWriting
      ? "Writing all..."
      : busy
        ? "Writing to X draft..."
        : hasQueue
          ? "Write all drafts"
          : hasDraft
            ? "Write to X draft"
            : "No Markdown yet";
    setBooleanPropertyIfChanged(button, "disabled", disabled);
    setAttributeValueIfChanged(button, "aria-disabled", disabled ? "true" : "false");
    setImportButtonLabel(label);
    if (shouldRevealReadyButton) {
      window.clearTimeout(writeButtonRevealTimer);
      setDatasetValueIfChanged(button, "reveal", "write-ready");
      writeButtonRevealTimer = window.setTimeout(() => {
        if (button.dataset.reveal === "write-ready") removeDatasetValueIfChanged(button, "reveal");
      }, 520);
    } else if (!hasWriteableContent || busy || batchWriting) {
      window.clearTimeout(writeButtonRevealTimer);
      removeDatasetValueIfChanged(button, "reveal");
    }
    lastWriteButtonContentReady = hasWriteableContent;
    if (els.importHint) {
      const hint = needsMarkdown
        ? { tone: "ready", text: "Paste in the editor above, or choose a .md file." }
        : compactWriteHint({ hasDraft, hasQueue, busy: busy || batchWriting });
      applyImportHint(hint);
    }
  }

  function compactWriteHint({ hasDraft, hasQueue = false, busy = false } = {}) {
    if (busy) return { tone: "ready", text: hasQueue ? "Writing queued drafts one by one." : "Writing into the X draft. You can watch the final result in the X Article tab." };
    if (hasQueue || !hasDraft) return quietImportHint();
    const remoteCount = remoteHttpImageSegments(latestParsed).length;
    const mediaEstimate = mediaUploadEstimate(latestParsed);
    if (remoteCount) return remoteImageWriteHint(remoteCount, mediaEstimate);
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
    if (!els.importHint) return;
    const hidden = Boolean(hint.hidden);
    setBooleanPropertyIfChanged(els.importHint, "hidden", hidden);
    setAttributeValueIfChanged(els.importHint, "aria-hidden", hidden ? "true" : "false");
    setDatasetValueIfChanged(els.importHint, "tone", hint.tone || "ready");
    removeDatasetValueIfChanged(els.importHint, "i18n");
    if (hidden) {
      delete els.importHint.__xposterSourceText;
      setTextContentIfChanged(els.importHint, "");
      return;
    }
    setLocalizedTextIfChanged(els.importHint, hint.text || "");
  }

  function remoteImageWriteHint(remoteCount, mediaEstimate = mediaUploadEstimate(latestParsed)) {
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

  function updateIssueQueue(checks = null, gate = null, context = {}) {
    if (!els.issueQueueList) return;
    const resolvedChecks = checks || buildPreflightChecks();
    const byId = context.byId || indexPreflightChecks(resolvedChecks);
    const resolvedGate = gate || getImportGate(resolvedChecks, { ...context, byId });
    const issues = buildIssueQueue(resolvedChecks, resolvedGate, { ...context, byId });
    let blockers = 0;
    let warnings = 0;
    let issueQueueHtml = "";
    for (const issue of issues) {
      if (issue.tone === "error") blockers += 1;
      if (issue.tone === "warn") warnings += 1;
      const action = issue.action
        ? `<button class="secondary compact" type="button" data-issue-action="${shared.escapeHtml(issue.action)}">${shared.escapeHtml(issue.button)}</button>`
        : `<span class="issue-state">${shared.escapeHtml(issue.state || "Ready")}</span>`;
      issueQueueHtml += `
          <li data-tone="${shared.escapeHtml(issue.tone)}">
            <span class="issue-source">${shared.escapeHtml(issue.source)}</span>
            <div>
              <strong>${shared.escapeHtml(issue.title)}</strong>
              <span>${shared.escapeHtml(issue.detail)}</span>
            </div>
            ${action}
          </li>
        `;
    }
    setLocalizedTextIfChanged(
      els.issueQueueMeta,
      blockers
        ? `${blockers} thing(s) to fix, ${warnings} warning(s)`
        : warnings
          ? `${warnings} warning(s), no blockers`
          : "No active issues; continue with a real X import."
    );
    if (setSourceHtmlIfChanged(els.issueQueueList, issueQueueHtml)) {
      translateDynamicDom(issueQueueSection);
    }
  }

  function buildIssueQueue(checks, gate, context = {}) {
    const byId = context.byId || indexPreflightChecks(checks);
    const draftOk = byId.get("draft")?.tone === "ok";
    const targetOk = byId.get("target")?.tone === "ok";
    const editorOk = byId.get("editor")?.tone === "ok";
    const issues = [];
    for (const check of checks) {
      if (check.tone !== "error" && check.tone !== "warn") continue;
      if (check.id === "page-script" && !targetOk) continue;
      if (check.id === "target-lock" && !(draftOk && targetOk)) continue;
      if (check.id === "plan" && !draftOk) continue;
      if (check.id === "assets" && !(draftOk && targetOk)) continue;
      if (check.id === "editor" && !targetOk) continue;
      if (check.id === "editor-content" && !(draftOk && targetOk && editorOk)) continue;
      if ((check.id === "bridge" || check.id === "uploads") && !(targetOk && (editorOk || Boolean(latestDiagnostics)))) continue;
      issues.push(issueFromCheck(check));
    }
    const liveResult = context.liveResult || buildLiveResultEvidence();
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
      assets: { action: "chooseVault", button: "Choose folder" },
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

  function updateExecutionTimeline(checks = null, gate = null, context = {}) {
    if (!els.timelineList) return;
    const resolvedChecks = checks || buildPreflightChecks();
    const byId = context.byId || indexPreflightChecks(resolvedChecks);
    const timeline = buildExecutionTimeline(resolvedChecks, gate, { ...context, byId });
    let done = 0;
    let blocked = 0;
    let ready = 0;
    for (const step of timeline) {
      if (step.tone === "ok") done += 1;
      if (step.tone === "error") blocked += 1;
      if (step.tone === "ready") ready += 1;
    }
    setLocalizedTextIfChanged(els.timelineMeta, blocked
      ? `${blocked} blocked stage(s), ${done} complete`
      : ready
        ? `${ready} stage(s) ready, ${done} complete`
        : done
          ? `${done}/${timeline.length} stage(s) complete`
        : "Load Markdown to see the steps xPoster will run.");
    for (const step of timeline) {
      const item = timelineItems.get(step.id);
      if (!item) continue;
      syncStatusRow(item, {
        tone: step.tone,
        label: step.label,
        detail: step.detail,
        status: step.status
      });
    }
    translateDynamicDom(timelineSection);
  }

  function buildExecutionTimeline(checks, gate = null, context = {}) {
    const byId = context.byId || indexPreflightChecks(checks);
    const counts = latestCounts || shared.segmentCounts([]);
    const plan = context.previewPlan || buildPreviewPlan();
    const resolvedGate = gate || getImportGate(checks, { ...context, byId });
    const hasImportEvidence = Boolean(latestEvidence?.kind?.startsWith("import"));
    const importSucceeded = latestEvidence?.kind === "import";
    const importFailed = latestEvidence?.kind === "import-error";
    const needsMedia = (counts.image || 0) > 0;
    const needsBridge = (counts.tweet || 0) + (counts.code || 0) + (counts.divider || 0) + (counts.table || 0) > 0 || plan.summary.markers > 0;
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
          ? `${counts.image || 0} image(s) will be uploaded into X when reachable. Tables use X Markdown blocks.`
          : latestParsed
            ? "No image upload is needed for this draft."
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
        label: "Place blocks",
        tone: importSucceeded
          ? "ok"
          : needsBridge
            ? byId.get("bridge")?.tone || "warn"
            : latestParsed
              ? "ok"
              : "idle",
        detail: needsBridge
          ? `${plan.summary.atomic} table/embed/code/divider item(s) and ${plan.summary.images} image item(s) need the X editor.`
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

  function updateLiveRunbook(checks = null, gate = null, context = {}) {
    if (!els.liveRunbookList) return;
    const resolvedChecks = checks || buildPreflightChecks();
    const byId = context.byId || indexPreflightChecks(resolvedChecks);
    const resolvedGate = gate || getImportGate(resolvedChecks, { ...context, byId });
    const liveResult = context.liveResult || buildLiveResultEvidence();
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

    let ready = 0;
    for (const step of runbook) {
      if (step.tone === "ok" || step.tone === "ready") ready += 1;
      const item = liveRunbookItems.get(step.id);
      if (!item) continue;
      syncStatusRow(item, { tone: step.tone, detail: step.detail });
      const button = liveRunbookActionButtons.get(step.id);
      if (button) {
        setBooleanPropertyIfChanged(button, "disabled",
          (step.id === "diagnostics" && !targetReady) ||
            (step.id === "import" && !resolvedGate.ok) ||
            (step.id === "result" && !hasImportEvidence) ||
            (step.id === "evidence" && !liveResult.complete));
      }
    }
    setLocalizedTextIfChanged(els.liveRunbookMeta, `${ready}/${runbook.length} after-import steps ready.`);
    translateDynamicDom(liveRunbookSection);
  }

  function buildPreflightChecks(context = {}) {
    const markdowns = preflightMarkdowns(context);
    const parsed = preflightParsed(context);
    const counts = preflightSegmentCounts(context);
    const status = latestPageStatus || {};
    const main = latestDiagnostics?.main || {};
    const vault = status.vault || latestDiagnostics?.vault || {};
    const specialBlocks = (counts.code || 0) + (counts.divider || 0) + (counts.tweet || 0);
    const images = counts.image || 0;
    const tables = counts.table || 0;
    const remoteImageList = Array.isArray(context.parsedDrafts)
      ? remoteHttpImageSegmentsForParsedDrafts(context.parsedDrafts)
      : markdowns
        ? remoteHttpImageSegmentsForMarkdowns(markdowns, importOptions)
        : parsed
          ? remoteHttpImageSegments(parsed)
          : [];
    const remoteImages = remoteImageList.length;
    const remoteOrigins = remoteImageOriginsFromSegments(remoteImageList);
    const hasQueue = Boolean(markdowns);
    const hasDraft = hasQueue || Boolean(parsed?.segments?.length);
    const targetMissingTone = hasDraft ? "warn" : "error";
    const hasParsedDraft = Boolean(parsed?.segments?.length);
    const hasPlan = hasQueue || hasParsedDraft;
    const targetContext = buildTargetContextEvidence();
    const lockStatus = targetLockStatus(targetContext);
    const contentStatus = editorContentStatus(targetContext);
    const contentVersion = latestDiagnostics?.contentScriptVersion || status.contentScriptVersion || CONTENT_VERSION_UNKNOWN;
    const contentVersionReady = !status.isArticleRoute || contentVersion === EXTENSION_VERSION;
    const originalImporter = originalImporterResidueStatus();
    const localImages = preflightLocalImageFolderStatus({ markdowns, parsed }, vault);
    const localImageDetail = localImages.absoluteCount
      ? `${localImages.absoluteCount} absolute local image path(s) found. Use paths relative to the selected folder.`
      : localImages.count
        ? localImages.ready
          ? `${localImages.count} local image(s) can resolve through ${vault.name || "selected folder"}.`
          : localImageFolderActionDetail(localImages)
        : "No local image paths detected.";

    return [
      {
        id: "draft",
        label: "Draft",
        tone: hasDraft ? "ok" : "error",
        detail: hasQueue
          ? `${markdowns.length} queued draft${markdowns.length === 1 ? "" : "s"}`
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
        tone: images
          ? (main.hasOnFilesAdded ? "ok" : latestDiagnostics ? "error" : "warn")
          : "ok",
        detail:
          images
            ? main.hasOnFilesAdded
              ? `${images} image upload item(s) can upload through X.`
              : "Open the X editor and run Check so images can upload."
            : "No image uploads required."
      },
      {
        id: "assets",
        label: "Local images",
        tone: localImages.absoluteCount ? "error" : localImages.needsFolder ? "warn" : "ok",
        detail: localImageDetail,
        action: "",
        button: ""
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
          ? `${(counts.code || 0) + (counts.divider || 0) + tables} table/code/divider item(s), ${images} image(s), ${counts.tweet || 0} tweet embed(s).`
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
        native: true
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
    const operationCounts = { atomic: 0, images: 0 };
    for (const item of operations) {
      if (item.type === "atomic") operationCounts.atomic += 1;
      if (item.type === "image") operationCounts.images += 1;
    }
    return {
      htmlLength: plan.html.length,
      plainLength: plan.plain.length,
      markerPrefix: plan.markerPrefix,
      operations,
      summary: {
        markers: operations.length,
        atomic: operationCounts.atomic,
        images: operationCounts.images,
        localImages: localImageReferences(parsed).length
      }
    };
  }

  function selectedDraftText() {
    const textarea = els.markdown;
    if (!textarea) return "";
    const start = Math.max(0, Number(textarea.selectionStart || 0));
    const end = Math.max(start, Number(textarea.selectionEnd || start));
    return textarea.value.slice(start, end).trim();
  }

  function selectedAiCoverSourceText() {
    const selected = selectedDraftText();
    return selected ? selected.slice(0, 5000) : "";
  }

  function syncAiCoverPromptInputFromSelection() {
    const sourceText = selectedAiCoverSourceText();
    if (sourceText) setPropertyValueIfChanged(els.aiCoverPromptInput, "value", sourceText);
    return sourceText;
  }

  function markAiCoverMotion(node, name, duration = 280) {
    if (!node || !name || prefersReducedMotion()) return;
    const previousTimer = aiCoverMotionTimers.get(node);
    if (previousTimer) window.clearTimeout(previousTimer);
    removeDatasetValueIfChanged(node, "motion");
    const animate = () => {
      setDatasetValueIfChanged(node, "motion", name);
      const timer = window.setTimeout(() => {
        removeDatasetValueIfChanged(node, "motion");
        aiCoverMotionTimers.delete(node);
      }, duration);
      aiCoverMotionTimers.set(node, timer);
    };
    if (window.requestAnimationFrame) window.requestAnimationFrame(animate);
    else animate();
  }

  function setAiCoverStatus(text, tone = "idle", values = null) {
    const writeStatus = values
      ? (node) => setLocalizedMessageIfChanged(node, text, values)
      : (node) => setLocalizedTextIfChanged(node, text);
    writeStatus(els.aiCoverStatus);
    setDatasetValueIfChanged(els.aiCoverStatus, "tone", tone);
    markAiCoverMotion(els.aiCoverStatus, "status");
    writeStatus(els.aiCoverApiStatus);
    setDatasetValueIfChanged(els.aiCoverApiStatus, "tone", tone);
    markAiCoverMotion(els.aiCoverApiStatus, "status");
    writeStatus(els.aiCoverPromptProfileStatus);
    setDatasetValueIfChanged(els.aiCoverPromptProfileStatus, "tone", tone);
    markAiCoverMotion(els.aiCoverPromptProfileStatus, "status");
  }

  function setAiCoverKeyTestResult({ tone = "idle", title = "Connection check", detail = "The key is tested before it is saved.", values = {} } = {}) {
    if (!els.aiCoverKeyTest) return;
    setBooleanPropertyIfChanged(els.aiCoverKeyTest, "hidden", false);
    setDatasetValueIfChanged(els.aiCoverKeyTest, "tone", tone);
    setLocalizedMessageIfChanged(els.aiCoverKeyTestTitle, title, values);
    setLocalizedMessageIfChanged(els.aiCoverKeyTestDetail, detail, values);
    markAiCoverMotion(els.aiCoverKeyTest, "status");
  }

  function resetAiCoverKeyTestResult() {
    if (!els.aiCoverKeyTest) return;
    setBooleanPropertyIfChanged(els.aiCoverKeyTest, "hidden", true);
    setDatasetValueIfChanged(els.aiCoverKeyTest, "tone", "idle");
    setLocalizedTextIfChanged(els.aiCoverKeyTestTitle, "Connection check");
    setLocalizedTextIfChanged(els.aiCoverKeyTestDetail, "The key is tested before it is saved.");
  }

  function aiCoverReadinessState() {
    if (!shared.activeAiCoverApiKey(aiCoverSettings)) {
      return { ready: false, state: "key", tone: "warn", messageKey: "Add an API key to start.", buttonKey: "Add key first", values: {} };
    }
    if (!aiCoverPromptSourceText()) {
      return { ready: false, state: "source", tone: "warn", messageKey: "Add a cover idea or selected text.", buttonKey: "Add cover idea", values: {} };
    }
    const total = Math.max(1, Number(aiCoverSettings.rounds || 1) * Number(aiCoverSettings.imagesPerRound || 1));
    return {
      ready: true,
      state: "ready",
      tone: "ok",
      messageKey: total === 1 ? "Ready to generate {count} cover." : "Ready to generate {count} covers.",
      buttonKey: total === 1 ? "Generate {count} cover" : "Generate {count} covers",
      values: { count: total }
    };
  }

  function updateAiCoverReadiness() {
    const readiness = aiCoverReadinessState();
    const hasKey = Boolean(shared.activeAiCoverApiKey(aiCoverSettings));
    setLocalizedMessageIfChanged(els.aiCoverReadiness, readiness.messageKey, readiness.values);
    setDatasetValueIfChanged(els.aiCoverReadiness, "tone", readiness.tone);
    setLocalizedTextIfChanged(els.aiCoverManageKey, hasKey ? "Manage key" : "Add key");
    if (aiCoverGenerationAbort) {
      setLocalizedTextIfChanged(els.aiCoverGenerate, "Stop generation");
      setBooleanPropertyIfChanged(els.aiCoverGenerate, "disabled", false);
    } else {
      setLocalizedMessageIfChanged(els.aiCoverGenerate, readiness.buttonKey, readiness.values);
      setBooleanPropertyIfChanged(els.aiCoverGenerate, "disabled", !readiness.ready);
    }
    setLocalizedMessageIfChanged(els.aiCoverGenerationSummary, readiness.messageKey, readiness.values);
    setDatasetValueIfChanged(els.aiCoverGeneratorDialog, "readiness", readiness.state || "idle");
    return readiness;
  }

  function aiCoverPreset() {
    return els.aiCoverPreset?.value || "minimal-editorial";
  }

  function aiCoverPromptSourceText() {
    return String(els.aiCoverPromptInput?.value || "").trim();
  }

  function throwIfAiCoverGenerationStopped(signal) {
    if (!signal?.aborted) return;
    throw new DOMException("Cover generation stopped.", "AbortError");
  }

  async function requestOpenAiCoverImages({ prompt, settings, signal } = {}) {
    const requestSettings = settings || aiCoverSettings;
    const activeKey = shared.activeAiCoverKey(requestSettings);
    if (!activeKey?.apiKey) throw new Error("Add your API key in Settings first.");
    const model = aiCoverModelForProvider(requestSettings.model, activeKey.provider);
    const requestBody = {
      model,
      prompt,
      size: requestSettings.requestSize || AI_COVER_REQUEST_SIZE,
      n: requestSettings.imagesPerRound || 1
    };
    if (activeKey.provider === "gemini") requestBody.response_format = "b64_json";
    const permission = await ensureAiCoverApiPermission(activeKey.baseUrl);
    if (!permission.ok) throw new Error(permission.error || "API host permission was not granted.");
    const response = await fetch(aiCoverApiUrl(activeKey.baseUrl, "/images/generations"), {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${activeKey.apiKey}`
      },
      body: JSON.stringify(requestBody)
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) {
      const message = aiCoverApiErrorMessage(body, `Image generation failed with HTTP ${response.status}`);
      const error = new Error(message);
      error.status = response.status;
      throw error;
    }
    const images = Array.isArray(body?.data) ? body.data : [];
    if (!images.length) throw new Error("The image API returned no image candidates.");
    return images;
  }

  function validateAiCoverDataUrl(dataUrl) {
    const parsed = shared.parseDataUri(dataUrl);
    if (!parsed.ok) throw new Error(parsed.error || "Generated image data was invalid.");
    const valid = shared.validateImagePayload(parsed.mime, parsed.bytes);
    if (!valid.ok) throw new Error(valid.error || "Generated image data was invalid.");
    return dataUrl;
  }

  function validateGeneratedImageResponse({ url = "", mime = "", bytes = 0 } = {}) {
    if (url && !shared.isRemoteHttpImageSource(url)) {
      throw new Error("Generated image URL must be a public HTTP(S) image URL.");
    }
    mime = String(mime || "").split(";")[0].trim().toLowerCase();
    bytes = Number(bytes || 0);
    if (mime || bytes) {
      if (!mime) throw new Error("Generated image response did not include an image content type.");
      const valid = shared.validateImagePayload(mime, bytes);
      if (!valid.ok) throw new Error(valid.error || "Generated image response was invalid.");
    }
  }

  async function fetchGeneratedImageAsDataUrl(url, signal) {
    validateGeneratedImageResponse({ url });
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), AI_COVER_IMAGE_FETCH_TIMEOUT_MS);
    const abortFromParent = () => controller.abort();
    signal?.addEventListener?.("abort", abortFromParent, { once: true });
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error(`Could not download generated image: HTTP ${response.status}`);
      const mime = (response.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
      const contentLength = Number(response.headers.get("content-length") || 0);
      validateGeneratedImageResponse({ url, mime, bytes: contentLength });
      const blob = await response.blob();
      validateGeneratedImageResponse({ url, mime: blob.type || mime, bytes: blob.size });
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            resolve(validateAiCoverDataUrl(String(reader.result || "")));
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = () => reject(new Error("Could not read generated image"));
        reader.readAsDataURL(blob);
      });
    } finally {
      window.clearTimeout(timeout);
      signal?.removeEventListener?.("abort", abortFromParent);
    }
  }

  async function imageItemToDataUrl(item, signal) {
    const base64 = item?.b64_json || item?.image_base64 || item?.base64_json || "";
    if (base64) return validateAiCoverDataUrl(`data:image/png;base64,${base64}`);
    const url = item?.url || item?.image_url || "";
    if (!url) throw new Error("The image API response did not include image data.");
    return fetchGeneratedImageAsDataUrl(url, signal);
  }

  function loadImageElement(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Could not decode generated image"));
      image.src = src;
    });
  }

  async function cropAiCoverToFiveTwo(dataUrl) {
    const image = await loadImageElement(dataUrl);
    const targetRatio = AI_COVER_OUTPUT_WIDTH / AI_COVER_OUTPUT_HEIGHT;
    const sourceRatio = image.naturalWidth / image.naturalHeight;
    let sx = 0;
    let sy = 0;
    let sw = image.naturalWidth;
    let sh = image.naturalHeight;
    if (sourceRatio > targetRatio) {
      sw = Math.round(sh * targetRatio);
      sx = Math.round((image.naturalWidth - sw) / 2);
    } else if (sourceRatio < targetRatio) {
      sh = Math.round(sw / targetRatio);
      sy = Math.round((image.naturalHeight - sh) / 2);
    }
    const canvas = document.createElement("canvas");
    canvas.width = AI_COVER_OUTPUT_WIDTH;
    canvas.height = AI_COVER_OUTPUT_HEIGHT;
    const context = canvas.getContext("2d");
    context.drawImage(image, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((value) => (value ? resolve(value) : reject(new Error("Could not export cover image"))), "image/png");
    });
    const buffer = await blob.arrayBuffer();
    return {
      base64: shared.arrayBufferToBase64(buffer),
      mime: "image/png",
      fileName: `xposter-cover-${Date.now()}.png`,
      bytes: buffer.byteLength,
      width: canvas.width,
      height: canvas.height
    };
  }

  function revealAiCoverCandidates() {
    if (els.aiCoverGeneratorDialog?.hidden) return;
    const firstCard = els.aiCoverCandidates?.querySelector?.(".ai-cover-card");
    if (!firstCard) return;
    window.setTimeout(() => {
      firstCard.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "center",
        inline: "nearest"
      });
    }, 0);
  }

  function renderAiCoverCandidates({ reveal = false } = {}) {
    const candidates = aiCoverCandidates;
    const html = candidates.length
      ? candidates.map((candidate) => `
          <article class="ai-cover-card" data-ai-cover-id="${shared.escapeHtml(candidate.id)}">
            <img src="data:${shared.escapeHtml(candidate.mime || "image/png")};base64,${shared.escapeHtml(candidate.base64)}" alt="${shared.escapeHtml(candidate.alt || "Generated cover")}" width="${Number(candidate.width) || AI_COVER_OUTPUT_WIDTH}" height="${Number(candidate.height) || AI_COVER_OUTPUT_HEIGHT}" loading="lazy" decoding="async" />
            <p class="ai-cover-card-meta">${shared.escapeHtml(candidate.meta)}</p>
            <button class="secondary compact" type="button" data-ai-cover-action="set-cover" data-ai-cover-id="${shared.escapeHtml(candidate.id)}" data-i18n="Set as cover">Set as cover</button>
          </article>
        `).join("")
      : aiCoverEmptyHtml("No generated covers yet.");
    if (setSourceHtmlIfChanged(els.aiCoverCandidates, html)) translateDynamicDom(els.aiCoverCandidates);
    if (reveal && candidates.length) revealAiCoverCandidates();
    updateAiCoverCandidateSummary();
    updatePublishRail();
  }

  async function generateAiCoverCandidates() {
    const settings = readAiCoverControls();
    await setAiCoverSettings(settings);
    const readiness = updateAiCoverReadiness();
    if (!readiness.ready) {
      setAiCoverStatus(readiness.messageKey, readiness.tone, readiness.values);
      return;
    }
    const sourceText = aiCoverPromptSourceText();
    if (!sourceText) {
      setAiCoverStatus("Add source text or select part of the draft first.", "error");
      return;
    }
    const profile = activeAiCoverPromptProfile();
    const prompt = shared.buildAiCoverPrompt({
      defaultPrompt: profile?.prompt || settings.defaultPrompt,
      preset: aiCoverPreset(),
      sourceText
    });
    aiCoverGenerationAbort?.abort?.();
    const generationAbort = new AbortController();
    aiCoverGenerationAbort = generationAbort;
    setLocalizedTextIfChanged(els.aiCoverGenerate, "Stop generation");
    setBooleanPropertyIfChanged(els.aiCoverGenerate, "disabled", false);
    setAiCoverStatus("Generating cover candidates...", "work");
    let created = 0;
    const previousCandidates = aiCoverCandidates;
    const runCandidates = [];
    try {
      for (let round = 1; round <= settings.rounds; round += 1) {
        throwIfAiCoverGenerationStopped(generationAbort.signal);
        setAiCoverStatus("Generating round {round}/{total}...", "work", { round, total: settings.rounds });
        const items = await requestOpenAiCoverImages({ prompt, settings, signal: generationAbort.signal });
        for (let index = 0; index < items.length; index += 1) {
          throwIfAiCoverGenerationStopped(generationAbort.signal);
          const dataUrl = await imageItemToDataUrl(items[index], generationAbort.signal);
          throwIfAiCoverGenerationStopped(generationAbort.signal);
          const cropped = await cropAiCoverToFiveTwo(dataUrl);
          created += 1;
          const candidateLabel = localizeInterpolated("Candidate {count}", { count: created });
          runCandidates.push({
            id: `cover_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            ...cropped,
            prompt,
            profileId: profile?.id || "",
            preset: aiCoverPreset(),
            sourceText: sourceText.slice(0, 240),
            alt: "Generated article cover",
            meta: `${candidateLabel} · ${AI_COVER_OUTPUT_WIDTH}x${AI_COVER_OUTPUT_HEIGHT}`
          });
          aiCoverCandidates = [...runCandidates, ...previousCandidates].slice(0, AI_COVER_MAX_CANDIDATES);
          renderAiCoverCandidates({ reveal: true });
        }
      }
      if (created) await markAiCoverPromptProfileUsed(profile?.id || "");
      setAiCoverStatus(created === 1 ? "Generated {count} cover candidate." : "Generated {count} cover candidates.", "ok", { count: created });
    } catch (error) {
      if (error?.name === "AbortError") setAiCoverStatus("Cover generation stopped.", "idle");
      else setAiCoverStatus(error?.message || "Cover generation failed.", "error");
    } finally {
      if (aiCoverGenerationAbort === generationAbort) aiCoverGenerationAbort = null;
      updateAiCoverReadiness();
    }
  }

  async function setAiCoverCandidateAsArticleCover(id) {
    const candidate = aiCoverCandidates.find((item) => item.id === id);
    if (!candidate) return;
    setAiCoverStatus("Setting selected cover on the current X Article...", "work");
    const parsed = latestParsed || shared.parseMarkdown(draftText() || "Cover");
    const target = await prepareSimpleWriteTarget(parsed, {
      parsed,
      counts: latestCounts
    });
    if (!target.ok) {
      setAiCoverStatus(target.reason || "Open an X Article and run Check before setting a cover.", "error");
      return;
    }
    const response = await sendToTargetTab({
      type: "xposter:set-generated-cover",
      file: {
        base64: candidate.base64,
        mime: candidate.mime,
        fileName: candidate.fileName,
        alt: "generated cover",
        bytes: candidate.bytes
      }
    }, { requireArticles: true });
    if (response?.ok) {
      setAiCoverStatus("Selected cover applied to the current X Article.", "ok");
      await refreshPageState().catch(() => {});
      return;
    }
    setAiCoverStatus(response?.error || "Could not set the selected cover.", "error");
  }

  function buildEvidencePackage(reason = "manual") {
    const checks = buildPreflightChecks();
    const byId = indexPreflightChecks(checks);
    const evidenceContext = preflightEvidenceContext(checks, { byId });
    const gate = getImportGate(checks, evidenceContext);
    const draftLocalImages = latestParsed ? localImageReferences(latestParsed) : [];
    const draftRemoteImages = latestParsed ? remoteHttpImageSegments(latestParsed) : [];
    const draft = latestParsed
      ? {
          title: latestParsed.title || null,
          cover: latestParsed.cover || null,
          titleFromMeta: Boolean(latestParsed.titleFromMeta),
          titleFromCandidate: Boolean(latestParsed.titleFromCandidate),
          titleSource: latestParsed.titleSource || null,
          counts: latestCounts,
          blocks: latestParsed.segments.length,
          localImages: draftLocalImages
            .map((item) => ({
              source: item.source,
              role: item.role,
              absolute: shared.isAbsoluteLocalImageSource(item.source)
            })),
          remoteImages: remoteImageEvidenceFromSegments(draftRemoteImages),
          mediaUploadEstimate: mediaUploadEstimate(latestParsed)
        }
      : {
          title: null,
          cover: null,
          titleFromMeta: false,
          titleFromCandidate: false,
          titleSource: null,
          counts: shared.segmentCounts([]),
          blocks: 0,
          localImages: [],
          remoteImages: remoteImageEvidenceFromSegments(draftRemoteImages),
          mediaUploadEstimate: mediaUploadEstimate(null)
        };

    return {
      schema: "xposter.evidence-package.v1",
      reason,
      capturedAt: new Date().toISOString(),
      draft,
      importPlan: evidenceContext.previewPlan,
      gate,
      checks,
      liveResult: evidenceContext.liveResult,
      proofDeck: buildProofDeckEvidence(checks, gate, evidenceContext),
      completionAudit: buildCompletionAuditEvidence(checks, gate, evidenceContext),
      recovery: buildRecoveryState(checks, gate, evidenceContext),
      targetContext: buildTargetContextEvidence(),
      importLedger: buildImportLedger(latestParsed, latestCounts),
      liveProgress: buildLiveProgressEvidence(),
      pageStatus: latestPageStatus,
      diagnostics: latestDiagnostics,
      lastEvidence: latestEvidence
    };
  }

  function localAssetWriteBlocker(checks = buildPreflightChecks(), context = {}) {
    const byId = context.byId || indexPreflightChecks(checks);
    const assets = byId.get("assets");
    if (!assets || assets.tone === "ok") return null;
    const localImages = preflightLocalImageFolderStatus(context);
    if (!localImages.count) return null;
    const firstReference = localImages.absoluteCount
      ? localImages.references.find((item) => shared.isAbsoluteLocalImageSource(item.source))
      : localImages.references[0];
    const draftIndex = Number.isInteger(firstReference?.draftIndex) ? firstReference.draftIndex : -1;
    const queueItem = draftIndex >= 0 ? draftQueue[draftIndex] : null;
    const detail = queueItem
      ? `${localizeInterpolated("Draft {index}: {title}", { index: draftIndex + 1, title: queueItemDisplayTitle(queueItem) })}. ${assets.detail}`
      : assets.detail;
    return {
      tone: assets.tone,
      title: localImages.absoluteCount ? "Local image path blocked" : "Local image folder needed",
      detail,
      action: localImages.needsFolder ? "chooseVault" : assets.action || "",
      button: assets.button || "",
      localImages
    };
  }

  async function ensureXPageForVaultPrompt() {
    const currentTarget = await targetTab();
    if (!isArticlesUrl(currentTarget?.url)) {
      log("Opening X Articles so the page can ask for the local image folder.");
      await openArticles();
    }
    for (let attempt = 0; attempt < 12; attempt += 1) {
      await delay(attempt < 2 ? 300 : 650);
      const response = await sendToTargetTab({ type: "xposter:page-status" }, { requireArticles: true });
      if (response?.ok && response.isArticleRoute) {
        await refreshPageState().catch(() => {});
        return { ok: true };
      }
    }
    return { ok: false, error: "open an X page first" };
  }

  async function handleLocalAssetWriteBlocker(
    blocker,
    { chooseWhenAvailable = false, queueItemId = null, retryAfterChoose = null } = {}
  ) {
    if (chooseWhenAvailable && blocker.action === "chooseVault") {
      log(blocker.detail || "Local images need a folder. xPoster will ask inside the X page.");
      updateWriteButton();
      activeWriteQueueItemId = null;
      if (queueItemId) resetQueueItemWritingState(queueItemId);
      const selected = await chooseVault({
        status: blocker.localImages || activeLocalImageFolderStatus(),
        ensureXPage: true,
        showSidepanelFallback: false
      });
      if (selected?.ok && typeof retryAfterChoose === "function") {
        log("Local image folder selected. Continuing import.");
        return retryAfterChoose();
      }
      setDraftDropStatus("Local image folder needed", localImageFolderActionDetail(blocker.localImages), "error", {
        action: "openArticles",
        button: "Open X",
        status: blocker.localImages || null
      });
      return { ok: false, error: selected?.error || blocker.detail, localAssets: true };
    }
    log(blocker.detail || "Choose the local image folder before writing.");
    setDraftDropStatus(blocker.title, blocker.detail || "Choose the local image folder before writing.", "error", {
      action: blocker.action,
      button: blocker.button || "Open X",
      status: blocker.localImages || null
    });
    openDetailsFor(els.preflightPanel);
    scrollTargetIntoView(els.preflightPanel, "center");
    updateWriteButton();
    activeWriteQueueItemId = null;
    if (queueItemId) resetQueueItemWritingState(queueItemId);
    return { ok: false, error: blocker.detail, localAssets: true };
  }

  function getImportGate(checks, context = {}) {
    const byId = context.byId || indexPreflightChecks(checks);
    const counts = preflightSegmentCounts(context);
    const requiresBridge = (counts.code || 0) + (counts.divider || 0) + (counts.tweet || 0) + (counts.table || 0) > 0;
    const requiresUploads = (counts.image || 0) > 0;
    const requiresAssets = Boolean(preflightLocalImageFolderStatus(context).count);
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
      requiresAssets && byId.get("assets")?.tone !== "ok" && "Open X Articles; xPoster will ask for the local image folder there."
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
    setTextContentIfChanged(timeNode, time);
    const messageNode = document.createElement("span");
    setTextContentIfChanged(messageNode, message);
    item.append(timeNode, " ", messageNode);
    setBooleanPropertyIfChanged(els.activityPanel, "hidden", false);
    els.activityLog.prepend(item);
    while (els.activityLog.children.length > 8) els.activityLog.lastElementChild.remove();
    syncRecordPanel();
    translateDynamicDom(els.activityLog);
  }

  function setDraftDropStatus(title, detail, tone = "idle", action = {}) {
    if (!els.draftDropStatus) return;
    window.clearTimeout(draftDropStatusTimer);
    draftDropStatusTimer = null;
    if (tone !== "error") {
      dismissDraftDropStatus();
      return;
    }
    setDatasetValueIfChanged(els.draftDropStatus, "tone", tone);
    setBooleanPropertyIfChanged(els.draftDropStatus, "hidden", false);
    setAttributeValueIfChanged(els.draftDropStatus, "role", "alert");
    setBooleanPropertyIfChanged(els.draftDropDismiss, "hidden", false);
    setLocalizedTextIfChanged(draftDropStatusNodes.title, title);
    setLocalizedTextIfChanged(draftDropStatusNodes.detail, detail);
    const actionName = action?.action || "";
    draftDropActionStatus = actionName ? action.status || null : null;
    setBooleanPropertyIfChanged(draftDropStatusNodes.action, "hidden", !actionName);
    setDatasetValueIfChanged(draftDropStatusNodes.action, "draftDropAction", actionName);
    if (actionName) setLocalizedTextIfChanged(draftDropStatusNodes.action, action.button || "Choose folder");
  }

  function setCompactImportStatus(summary = null) {
    if (els.importHint) applyImportHint({ tone: "done", text: "Written. Review in X." });
  }

  function dismissDraftDropStatus() {
    if (!els.draftDropStatus) return;
    window.clearTimeout(draftDropStatusTimer);
    draftDropStatusTimer = null;
    setBooleanPropertyIfChanged(els.draftDropStatus, "hidden", true);
    setDatasetValueIfChanged(els.draftDropStatus, "tone", "idle");
    setBooleanPropertyIfChanged(els.draftDropDismiss, "hidden", true);
    draftDropActionStatus = null;
    setBooleanPropertyIfChanged(draftDropStatusNodes.action, "hidden", true);
    setDatasetValueIfChanged(draftDropStatusNodes.action, "draftDropAction", "");
  }

  function acknowledgeDraftInput() {
    const target = els.draftEditorShell || els.markdown;
    if (!target) return;
    setClassPresenceIfChanged(target, "draft-ack", false);
    void target.offsetWidth;
    setClassPresenceIfChanged(target, "draft-ack", true);
    window.setTimeout(() => setClassPresenceIfChanged(target, "draft-ack", false), 520);
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
      setBooleanPropertyIfChanged(els.runSummary, "hidden", true);
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
    setDatasetValueIfChanged(els.targetContextPanel, "tone", tone);
    setLocalizedTextIfChanged(els.targetContextState, toneLabel(tone));
    setLocalizedTextIfChanged(els.targetContextMeta, !target.available
      ? "No X Article is open yet."
      : lock.drifted
        ? lock.detail
      : target.route === "editor"
        ? `${articleId ? `Article ${articleId} is open.` : "Article editor is open."} ${lock.locked ? "This article is confirmed." : "Click Check article before importing."}`
        : target.route === "articles"
          ? "X Articles is open; create or open a draft before importing."
          : "Active X tab is not on the Articles composer.");
    setLocalizedTextIfChanged(els.targetContextRoute, target.available
      ? `${target.route === "editor" ? "Article editor" : target.route === "articles" ? "Articles home" : "Other X page"}${target.hasEditor ? " / editor visible" : ""}`
      : "No X tab");
    setLocalizedTextIfChanged(els.targetContextArticle, articleId || (status.isArticleRoute ? "New draft" : "None"));
    setLocalizedTextIfChanged(els.targetContextTitle, target.pageTitle || (target.available ? "Untitled X page" : "Unknown"));
    setLocalizedTextIfChanged(els.targetContextSample, target.editorSample || (target.hasEditor ? "Editor is empty." : "Open or create an X Article draft before import."));
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
      uploadRetryRequested = false;
      const text = String(payload.text || "").trim();
      if (!text && payload.level === "idle") {
        if (latestProgress.state !== "complete" && latestProgress.state !== "error" && latestProgress.state !== "cancelled") {
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
        latestProgress.uploadActive = Boolean(payload.uploadActive);
        latestProgress.uploadRetryable = Boolean(payload.uploadRetryable);
      }
    } else if (eventName === "complete") {
      uploadRetryRequested = false;
      latestProgress.state = "complete";
      latestProgress.level = "done";
      latestProgress.uploadActive = false;
      latestProgress.uploadRetryable = false;
      latestProgress.summary = payload.summary || null;
      latestProgress.text = "Writing complete";
      latestProgress.detail = summarizeProgressCompletion(payload.summary);
      latestProgress.percent = 100;
    } else if (eventName === "error") {
      uploadRetryRequested = false;
      latestProgress.state = "error";
      latestProgress.level = "error";
      latestProgress.uploadActive = false;
      latestProgress.uploadRetryable = false;
      latestProgress.error = payload.error || "Unknown writing error";
      const mainSummary = payload.summary || payload.mainSummary || null;
      latestProgress.summary = mainSummary ? { main: mainSummary } : latestProgress.summary || null;
      latestProgress.text = "Writing failed";
      latestProgress.detail = mainSummary
        ? `${latestProgress.error}; ${summarizeProgressCompletion(latestProgress.summary)}`
        : latestProgress.error;
      latestProgress.percent = Math.max(latestProgress.percent || 0, 100);
    } else if (eventName === "cancelled") {
      uploadRetryRequested = false;
      latestProgress.state = "cancelled";
      latestProgress.level = "warn";
      latestProgress.uploadActive = false;
      latestProgress.uploadRetryable = false;
      latestProgress.error = payload.reason || "Writing stopped by user.";
      const mainSummary = payload.summary || payload.mainSummary || null;
      latestProgress.summary = mainSummary ? { main: mainSummary } : latestProgress.summary || null;
      latestProgress.text = "Writing stopped by user.";
      latestProgress.detail = mainSummary
        ? `${latestProgress.error}; ${summarizeProgressCompletion(latestProgress.summary)}`
        : latestProgress.error;
      latestProgress.percent = Math.max(latestProgress.percent || 0, 100);
    } else if (eventName === "preflight-blocked") {
      uploadRetryRequested = false;
      latestProgress.state = "error";
      latestProgress.level = "warn";
      latestProgress.uploadActive = false;
      latestProgress.uploadRetryable = false;
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
    if (/checking .*image file|checked .*image file|检查.*图片文件/i.test(text)) return localizeText("Checking image files before upload.");
    if (/prepar|准备/i.test(text)) return localizeText("Preparing the article and X editor.");
    if (/title|cover|标题|封面/i.test(text)) return localizeText("Setting article title and matching cover after ordered uploads.");
    if (/writing|paste|structured|写入/i.test(text)) return localizeText("Writing the article body into X.");
    if (/upload|上传/i.test(text)) return localizeText("Uploading prepared images through X.");
    if (/reorder|marker|special|insert|放置|清理/i.test(text)) return localizeText("Placing images, tweets, code, and dividers into the article.");
    if (/imported|written|complete|完成|已写入/i.test(text)) return localizeText("Writing finished.");
    return text ? localizeText(text) : localizeText("Live status received from the active X tab.");
  }

  function progressPercentForStatus(text, level) {
    const progress = shared.importProgressForStatus(text, level);
    return Number.isFinite(progress.percent) ? progress.percent : 18;
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
    const pendingUploads = Number(main.imgPending || 0);
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
      if (pendingUploads) parts.push(`${pendingUploads} image(s) are in the editor while X finishes media IDs`);
      return `${parts.join("; ")}; ${main.atomicOk || 0}/${atomicTotal} embed/code item(s), ${elapsed}.`;
    }
    if (pendingUploads) {
      return `${pendingUploads} image(s) are in the editor while X finishes media IDs; ${main.atomicOk || 0}/${atomicTotal} embed/code item(s), ${elapsed}.`;
    }
    return `${images.ok || 0}/${imageTotal} media item(s), ${main.atomicOk || 0}/${atomicTotal} embed/code item(s), ${elapsed}.`;
  }

  function updateLiveProgress() {
    if (!els.liveProgress) return;
    const state = latestProgress || createLiveProgressState();
    const tone = state.level === "done" ? "done" : state.level || state.state || "idle";
    setDatasetValueIfChanged(els.liveProgress, "tone", tone);
    setLocalizedTextIfChanged(els.liveProgressState, state.state === "running"
      ? "Running"
      : state.state === "cancelled"
        ? "Stopped"
        : toneLabel(tone));
    const percent = Math.max(0, Math.min(100, Number(state.percent || 0)));
    setStyleValueIfChanged(els.liveProgressBar, "transform", `scaleX(${percent / 100})`);
    setLocalizedTextIfChanged(els.liveProgressTitle, state.text || "Nothing is running");
    setLocalizedTextIfChanged(els.liveProgressDetail, state.detail || "Write progress appears here while xPoster fills X.");
    if (els.cancelImport) {
      const cancellable = state.state === "running" || state.state === "parsed";
      setBooleanPropertyIfChanged(els.cancelImport, "hidden", !cancellable);
      setBooleanPropertyIfChanged(els.cancelImport, "disabled", importCancelRequested || !cancellable);
      setLocalizedTextIfChanged(els.cancelImport, importCancelRequested ? "Stopping..." : "Stop");
    }
    if (els.retryUpload) {
      const retryable = state.state === "running" && Boolean(state.uploadRetryable);
      setBooleanPropertyIfChanged(els.retryUpload, "hidden", !(retryable || uploadRetryRequested));
      setBooleanPropertyIfChanged(els.retryUpload, "disabled", uploadRetryRequested || !retryable);
      setLocalizedTextIfChanged(els.retryUpload, uploadRetryRequested ? "Retrying..." : "Retry now");
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
        setBooleanPropertyIfChanged(els.runSummary, "hidden", true);
        syncRecordPanel();
      }
    }, 3600);
  }

  function syncProgressiveSectionVisibility(context = {}) {
    const liveResult = context.liveResult || buildLiveResultEvidence();
    const progressVisible = isLiveProgressVisible();
    const hasAnyRecord = Boolean(latestEvidence || liveResult.checked > 0 || progressVisible);
    setBooleanPropertyIfChanged(els.liveProgress, "hidden", !progressVisible);
    setBooleanPropertyIfChanged(els.verificationPanel, "hidden", true);
    setBooleanPropertyIfChanged(els.liveResultPanel, "hidden", true);
    setBooleanPropertyIfChanged(els.evidenceDetails, "hidden", !hasAnyRecord);
    syncRecordPanel();
  }

  function syncRecordPanel({ translate = els.recordsPanel?.classList.contains("active") } = {}) {
    if (!els.recordsPanel) return;
    const nodes = [els.recordHistory, els.runSummary, els.evidenceDetails, els.activityPanel].filter(Boolean);
    for (const node of nodes) {
      if (node.parentElement !== els.recordsPanel) els.recordsPanel.appendChild(node);
    }
    for (const node of [els.verificationPanel, els.liveResultPanel]) {
      setBooleanPropertyIfChanged(node, "hidden", true);
    }
    const hasRecord = recordHistory.length || nodes.some((node) => !node.hidden);
    setBooleanPropertyIfChanged(els.recordsEmpty, "hidden", hasRecord);
    if (translate) translateDynamicDom(els.recordsPanel);
  }

  function syncPanelLayout() {
    syncRecordPanel({ translate: false });
  }

  function paintStartupShell() {
    applyTheme(currentThemeMode);
    populateLanguageSelect();
    setDraftEditorMode("edit", { syntax: "none" });
    syncPanelLayout();
    restoreVaultState();
    updateLiveProgress();
    syncDraftSurface({ syntax: "none" });
    updateWriteButton();
    updatePublishRail();
    showWorkspacePanel("draft");
  }

  async function restoreStartupState() {
    if (!hasChromeApi()) {
      applyTheme(currentThemeMode);
      applyImportOptions(importOptions, { refresh: false });
      applyArticleExportOptions(articleExportOptions);
      applyAiCoverSettings(aiCoverSettings);
      applySuccessFeedbackOptions(successFeedbackOptions);
      await restoreLanguage();
      analyzeDraft();
      return;
    }
    const stored = await startupStorage();
    await restoreTargetTab(stored);
    applyTheme(stored[STORAGE_THEME] || currentThemeMode);
    applyImportOptions(stored[STORAGE_IMPORT_OPTIONS] || importOptions, { refresh: false });
    applyArticleExportOptions(stored[STORAGE_ARTICLE_EXPORT_SETTINGS] || articleExportOptions);
    applyAiCoverSettings(stored[STORAGE_AI_COVER_SETTINGS] || aiCoverSettings);
    applySuccessFeedbackOptions(stored[STORAGE_SUCCESS_FEEDBACK] || successFeedbackOptions);
    applyStartupDraftState(stored);
    await restoreLanguage();
    for (const { input } of getLiveResultItems()) {
      setBooleanPropertyIfChanged(input, "checked", Boolean((stored[STORAGE_LIVE_RESULT] || {})[input.dataset.liveCheck]));
    }
    liveResultChecks = stored[STORAGE_LIVE_RESULT] || {};
    updateLiveResultMeta();
  }

  function updateRecoveryPanel(checks = null, gate = null, context = {}) {
    if (!els.recoveryPanel) return;
    const resolvedChecks = checks || buildPreflightChecks();
    const byId = context.byId || indexPreflightChecks(resolvedChecks);
    const resolvedGate = gate || getImportGate(resolvedChecks, { ...context, byId });
    const recovery = buildRecoveryState(resolvedChecks, resolvedGate, { ...context, byId });
    setDatasetValueIfChanged(els.recoveryPanel, "tone", recovery.tone);
    setLocalizedTextIfChanged(els.recoveryMeta, recovery.meta);
    setLocalizedTextIfChanged(els.recoveryState, toneLabel(recovery.tone));
    const recoveryHtml = recovery.items
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
    if (setSourceHtmlIfChanged(els.recoveryList, recoveryHtml)) translateDynamicDom(els.recoveryPanel);
  }

  function recoveryToneForItems(items = []) {
    let hasWarn = false;
    let hasReady = false;
    for (const item of items) {
      if (item.tone === "error") return "error";
      if (item.tone === "warn") hasWarn = true;
      else if (item.tone === "ready") hasReady = true;
    }
    if (hasWarn) return "warn";
    if (hasReady) return "ready";
    return "idle";
  }

  function buildRecoveryState(checks, gate, context = {}) {
    const byId = context.byId || indexPreflightChecks(checks);
    const items = [];
    const importFailed = latestEvidence?.kind === "import-error" || latestProgress?.state === "error";
    const hasImportEvidence = Boolean(latestEvidence?.kind?.startsWith("import"));
    const liveResult = context.liveResult || buildLiveResultEvidence();
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
            : byId.get("assets")?.tone === "warn"
              ? "openArticles"
              : "check",
        button:
          byId.get("draft")?.tone !== "ok"
            ? "Add Markdown"
            : byId.get("target")?.tone !== "ok"
              ? "Open"
            : byId.get("page-script")?.tone !== "ok"
              ? "Refresh X"
            : byId.get("assets")?.tone === "warn"
              ? "Open X"
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
        action: "openArticles",
        button: "Open X"
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

    const tone = recoveryToneForItems(items);
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

  function activeWorkspaceTarget(target = "draft") {
    return workspacePanels.some((panel) => panel.dataset.panel === target) ? target : "draft";
  }

  function workspaceTargetIndex(target) {
    return workspaceTabs.findIndex((tab) => tab.dataset.tab === target);
  }

  function syncWorkspaceTabs(target) {
    const activeTabIndex = workspaceTargetIndex(target);
    workspaceTabs.forEach((tab) => {
      setClassPresenceIfChanged(tab, "active", tab.dataset.tab === target);
    });
    if (workspaceTabsContainer) {
      setStylePropertyIfChanged(workspaceTabsContainer, "--tab-count", Math.max(workspaceTabs.length, 1));
      setStylePropertyIfChanged(workspaceTabsContainer, "--tab-index", Math.max(activeTabIndex, 0));
      setDatasetValueIfChanged(workspaceTabsContainer, "activeTab", activeTabIndex >= 0 ? "true" : "false");
    }
    return activeTabIndex;
  }

  function syncPanelItemMotion(panel) {
    if (!panel) return;
    Array.from(panel.children || []).forEach((child, index) => {
      if (child.hidden) removeStylePropertyIfChanged(child, "--panel-item-index");
      else setStylePropertyIfChanged(child, "--panel-item-index", index);
    });
  }

  function restartPanelMotion(panel) {
    if (!panel || prefersReducedMotion()) return;
    setStyleValueIfChanged(panel, "animation", "none");
    void panel.offsetWidth;
    setStyleValueIfChanged(panel, "animation", "");
  }

  function syncWorkspacePanels(target) {
    const targetPanels = [];
    workspacePanels.forEach((panel) => {
      const isActive = panel.dataset.panel === target;
      if (isActive) targetPanels.push(panel);
      if (isActive) {
        syncPanelItemMotion(panel);
        if (!panel.classList.contains("active")) restartPanelMotion(panel);
      }
      setClassPresenceIfChanged(panel, "active", isActive);
    });
    return targetPanels;
  }

  function hydrateWorkspacePanel(target) {
    if (target === "records") {
      void ensureRecordHistoryRestored({ render: true }).then(() => {
        syncRecordPanel({ translate: true });
      });
    }
  }

  function showWorkspacePanel(target) {
    const nextTarget = activeWorkspaceTarget(target);
    syncWorkspaceTabs(nextTarget);
    const targetPanels = syncWorkspacePanels(nextTarget);
    targetPanels.forEach((panel) => translateDynamicDom(panel, { syncEnvironment: false }));
    syncLanguageEnvironment();
    hydrateWorkspacePanel(nextTarget);
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
    setBooleanPropertyIfChanged(details, "open", true);
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

  async function handlePublishRailClick(event) {
    const item = event.target?.closest?.("[data-publish-step]");
    if (!item || !els.publishRail?.contains(item)) return;
    const step = item.dataset.publishStep || "";
    if (step === "target") {
      if (!latestPageStatus?.isArticleRoute) {
        await openArticles();
        return;
      }
      await runPreflight();
      return;
    }
    if (step === "check") {
      await runPreflight();
      return;
    }
    if (step === "draft") {
      focusMarkdownInput();
      return;
    }
    if (step === "assets") {
      openDetailsFor(els.preflightPanel);
      scrollTargetIntoView(els.preflightPanel, "center");
      return;
    }
    if (step === "cover") {
      openAiCoverGeneratorDialog();
      return;
    }
    if (step === "import") {
      els.importDraft?.focus?.();
    }
  }

  async function refreshPageState() {
    const tab = await targetTab();
    const url = tab?.url || "";
    if (!isXUrl(url)) {
      latestPageStatus = null;
      latestDiagnostics = null;
      setPageState("Open X Articles entry", "action", "openArticles");
      setReadiness({ target: "Open X", editor: "Unknown", vault: "Optional" });
      updateDraftBrief();
      updatePreflight();
      updateProgressiveSections();
      return;
    }
    const response = await sendToTargetTab({ type: "xposter:page-status" });
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

  function shouldPollPageState() {
    return document.visibilityState !== "hidden";
  }

  function pollPageState() {
    if (!shouldPollPageState()) return;
    void refreshPageState().catch(() => {});
  }

  function setPageState(text, tone, action = "") {
    setLocalizedTextIfChanged(pageStateLabel, text);
    setDatasetValueIfChanged(els.pageState, "xposterSourceText", text);
    setDatasetValueIfChanged(els.pageState, "pageAction", action);
    setClassNameIfChanged(els.pageState, `page-state ${tone || ""}`);
    setBooleanPropertyIfChanged(els.pageState, "disabled", !action);
    const title = action === "openArticles" ? "Open X Articles entry" : text;
    const localizedTitle = localizeText(title);
    setAttributeValueIfChanged(els.pageState, "title", localizedTitle);
    setAttributeValueIfChanged(els.pageState, "aria-label", localizedTitle);
  }

  function setReadiness({ target, editor, vault }) {
    setLocalizedTextIfChanged(els.targetReady, target);
    setLocalizedTextIfChanged(els.editorReady, editor);
    setLocalizedTextIfChanged(els.vaultReady, vault);
  }

  async function prepareSimpleWriteTarget(parsed, preflightContext = { parsed }) {
    const remoteImages = remoteHttpImageSegments(parsed);
    if (remoteImages.length) {
      log(`Preparing ${remoteImages.length} web image(s) for upload. Failed downloads will stay as Markdown links.`);
      await refreshRemoteImageAccessStatus(parsed);
    } else if (remoteImageAccessStatus.origins.length) {
      syncRemoteImageAccessStatusFromDraft(parsed);
    }
    updatePreflight();
    let checks = buildPreflightChecks(preflightContext);
    const pageScriptCheck = checks.find((check) => check.id === "page-script");
    if (pageScriptCheck?.tone === "error") {
      await refreshPageState();
      checks = buildPreflightChecks(preflightContext);
      const refreshedPageScriptCheck = checks.find((check) => check.id === "page-script");
      if (refreshedPageScriptCheck?.tone === "error") {
        return { ok: false, reason: refreshedPageScriptCheck.detail, checks, targetContext: buildTargetContextEvidence() };
      }
    }

    const active = await targetTab();
    if (!isArticlesUrl(active?.url)) {
      await openArticles();
    }
    for (let attempt = 0; attempt < 14; attempt += 1) {
      await delay(attempt < 2 ? 350 : 700);
      await refreshPageState();
      checks = buildPreflightChecks(preflightContext);
      const status = latestPageStatus || {};
      const needsDiagnostics = Boolean(status.isArticleRoute && status.hasEditor);
      if (needsDiagnostics) {
        const response = await sendToTargetTab({ type: "xposter:diagnostics" }, { requireArticles: true });
        latestDiagnostics = response?.ok ? response : { ok: false, error: response?.error || "Diagnostics unavailable" };
        if (response?.ok) lockTargetContext("write");
        updatePreflight();
        checks = buildPreflightChecks(preflightContext);
      }
      const gate = getImportGate(checks, preflightContext);
      if (gate.ok || status.isArticleRoute) {
        return { ok: true, checks, gate, targetContext: buildTargetContextEvidence() };
      }
    }
    checks = buildPreflightChecks(preflightContext);
    return {
      ok: false,
      reason: getImportGate(checks, preflightContext).message || "Open or create an X Article, then try Write again.",
      checks,
      targetContext: buildTargetContextEvidence()
    };
  }

  async function importMarkdownDraft(markdownInput, { queueItemId = null, batch = false, sourceFileName = "" } = {}) {
    const markdown = String(markdownInput || "").trim();
    if (!markdown) {
      log("Paste or load Markdown first.");
      return { ok: false, error: "empty" };
    }
    const writeSourceFileName = activeWriteSourceFileName(sourceFileName);
    activeWriteQueueItemId = queueItemId;
    if (queueItemId) {
      draftQueue = draftQueue.map((item) => item.id === queueItemId ? { ...item, status: "writing" } : item);
      markDraftQueueMediaStale();
      renderDraftQueue();
    }
    let parsed;
    let counts;
    try {
      ({ parsed, counts } = parseMarkdownForWrite(markdown));
    } catch (error) {
      const message = error?.message || MARKDOWN_LOAD_ERROR_DETAIL;
      log(`Could not analyze draft: ${message}`);
      showMarkdownLoadError(message);
      updateWriteButton();
      activeWriteQueueItemId = null;
      resetQueueItemWritingState(queueItemId);
      return { ok: false, error: message, parse: true };
    }
    const preflightContext = { parsed, counts };
    updatePreflight();
    const checks = buildPreflightChecks(preflightContext);
    const byId = indexPreflightChecks(checks);
    const localAssetBlocker = localAssetWriteBlocker(checks, { ...preflightContext, byId });
    if (localAssetBlocker) {
      return handleLocalAssetWriteBlocker(localAssetBlocker, {
        chooseWhenAvailable: true,
        queueItemId,
        retryAfterChoose: () => importMarkdownDraft(markdownInput, { queueItemId, batch, sourceFileName })
      });
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
    uploadRetryRequested = false;
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
    const target = await prepareSimpleWriteTarget(parsed, preflightContext);
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
    const celebrateOnComplete = !batch || draftQueue.length <= 1;
    const response = await sendToTargetTab({
      type: "xposter:import-markdown",
      markdown,
      options: writeOptionsPayload({ forceNewArticle: batch, sourceFileName: writeSourceFileName, celebrateOnComplete })
    }, { requireArticles: true });
    importCancelRequested = false;
    uploadRetryRequested = false;
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
      if (!batch || draftQueue.length === 0) {
        triggerSuccessFeedback(response.summary);
      }
    } else {
      log(`Import failed: ${response?.error || "unknown error"}`);
      if (response?.cancelled) {
        recordLiveProgressEvent("cancelled", { reason: response?.error || "Writing stopped by user.", summary: response?.mainSummary || null });
      } else if (latestProgress.state !== "error") {
        recordLiveProgressEvent("error", { error: response?.error || "unknown error", summary: response?.mainSummary || null });
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
    return importMarkdownDraft(draftText(), { sourceFileName: activeDraftSourceFileName });
  }

  async function importQueueItem(id) {
    const item = queueItemById(id);
    if (!item) return { ok: false, error: "Queued draft not found" };
    activeQueueItemId = item.id;
    activeDraftSourceFileName = normalizeSourceFileName(item.fileName);
    suppressNextTypedHistory = true;
    window.clearTimeout(draftInputHistoryTimer);
    setDraftText(item.markdown);
    saveDraft();
    analyzeDraft();
    renderDraftQueue();
    return importMarkdownDraft(item.markdown, { queueItemId: item.id, batch: batchWriting, sourceFileName: item.fileName });
  }

  async function importDraftQueue() {
    if (batchWriting || !queueModeActive()) return null;
    const batchTotal = draftQueue.length;
    let batchDone = 0;
    batchWriting = true;
    setBatchWriteProgress({ total: batchTotal, done: batchDone, state: "writing" });
    updateWriteButton();
    try {
      const markdowns = draftQueueMarkdowns();
      const parsedDrafts = parsedDraftsForMarkdowns(markdowns, importOptions);
      const preflightContext = { markdowns, parsedDrafts };
      const checks = buildPreflightChecks(preflightContext);
      updatePreflight(checks);
      const byId = indexPreflightChecks(checks);
      const localAssetBlocker = localAssetWriteBlocker(checks, { ...preflightContext, byId });
      if (localAssetBlocker) {
        clearBatchWriteProgress();
        batchWriting = false;
        return await handleLocalAssetWriteBlocker(localAssetBlocker, {
          chooseWhenAvailable: true,
          retryAfterChoose: () => importDraftQueue()
        });
      }
      const mediaBlocker = firstQueueMediaLimitBlocker(mediaUploadEstimateForParsedDrafts(parsedDrafts));
      if (mediaBlocker) {
        const message = mediaBlocker.detail;
        log(message);
        if (mediaBlocker.item?.id) loadQueueItem(mediaBlocker.item.id, { persist: false, remember: false });
        setDraftDropStatus(mediaBlocker.title, message, "error");
        recordLiveProgressEvent("preflight-blocked", { text: message, error: message, level: "warn", mediaLimit: true });
        clearBatchWriteProgress();
        return { ok: false, error: message, mediaLimit: true };
      }
      const origins = remoteImageOriginsFromSegments(remoteHttpImageSegmentsForParsedDrafts(parsedDrafts));
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
        batchDone += 1;
        setBatchWriteProgress({ total: batchTotal, done: batchDone, state: batchDone === batchTotal ? "complete" : "writing" });
        await delay(300);
      }
    } finally {
      batchWriting = false;
      activeWriteQueueItemId = null;
      updateWriteButton();
      renderDraftQueue();
      if (batchWriteProgress?.total > 1) {
        batchWriteProgress = {
          ...batchWriteProgress,
          state: batchWriteProgress.done >= batchWriteProgress.total ? "complete" : "stopped"
        };
        syncDraftMediaAlert();
        scheduleBatchWriteProgressClear();
      } else {
        clearBatchWriteProgress();
      }
    }
    return null;
  }

  function renderRunSummary(summary) {
    if (!summary) return;
    window.clearTimeout(runSummaryCollapseTimer);
    runSummaryCollapseTimer = null;
    setBooleanPropertyIfChanged(els.runSummary, "hidden", false);
    const imageOk = summary.images?.ok || 0;
    const imageFail = summary.images?.fail || 0;
    const uploadFailures = mediaUploadFailureCounts(summary.main);
    const coverFailures = coverApplicationFailureCount(summary, uploadFailures);
    const main = summary.main || {};
    const pendingUploads = Number(main.imgPending || 0);
    const bodyImageWarnings = Number(summary.mediaWarnings?.images || 0) + uploadFailures.image;
    const tableImageWarnings = Number(summary.mediaWarnings?.tables || 0) + uploadFailures.table;
    const coverImageWarnings = Number(summary.mediaWarnings?.covers || 0) + uploadFailures.cover + coverFailures;
    const hasWarnings = hasRunSummaryWarnings(summary);
    setDatasetValueIfChanged(els.runSummary, "tone", hasWarnings ? "warn" : "done");
    if (els.summaryMessage) {
      setDatasetValueIfChanged(els.summaryMessage, "tone", hasWarnings ? "warn" : "done");
      setTextContentIfChanged(els.summaryMessage, summarizeRunMessage(summary));
    }
    setTextContentIfChanged(els.summaryImages, bodyImageWarnings || tableImageWarnings || coverImageWarnings
      ? [
          imageOk ? `${imageOk} uploaded` : "",
          pendingUploads ? `${pendingUploads} pending in X` : "",
          bodyImageWarnings ? `${bodyImageWarnings} body kept` : "",
          tableImageWarnings ? `${tableImageWarnings} table kept` : "",
          coverImageWarnings ? `${coverImageWarnings} cover missed` : ""
        ].filter(Boolean).join(", ")
      : imageOk
        ? pendingUploads
          ? `Uploaded ${imageOk}, ${pendingUploads} pending in X`
          : `Uploaded ${imageOk}`
        : `${imageOk} / ${imageOk + imageFail}`);
    setTextContentIfChanged(els.summaryBlocks, `${main.atomicOk || 0} / ${(main.atomicOk || 0) + (main.atomicFail || 0)}`);
    setTextContentIfChanged(els.summaryTitle, summarizeTitleResult(main.title));
    setTextContentIfChanged(els.summaryCover, summarizeCoverResult(main.cover));
    setTextContentIfChanged(els.summaryElapsed, `${((summary.elapsedMs || 0) / 1000).toFixed(1)}s`);
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
    const pendingUploads = Number(summary.main?.imgPending || 0);
    if (uploadFailures.timeout) {
      return `Article written${elapsed ? ` in ${elapsed}` : ""}. ${uploadFailures.timeout} image upload(s) timed out in X. Wait a moment, then write again or split the article if it has many images.`;
    }
    if (keptImages || keptTables || missedCovers) {
      const parts = [];
      if (keptImages) parts.push(`${keptImages} body image(s) stayed as Markdown links`);
      if (keptTables) parts.push(`${keptTables} table image(s) stayed as Markdown tables`);
      if (missedCovers) parts.push(`${missedCovers} cover image(s) could not be applied`);
      if (pendingUploads) parts.push(`${pendingUploads} image(s) are in the editor while X finishes media IDs`);
      const recovery = keptImages
        ? " Replace unreachable image URLs with public links, then write again if those images must upload."
        : "";
      return `Article written${elapsed ? ` in ${elapsed}` : ""}. ${parts.join("; ")}.${recovery}`;
    }
    if (pendingUploads) {
      return `Article written${elapsed ? ` in ${elapsed}` : ""}. ${pendingUploads} image(s) are in the editor while X finishes media IDs.`;
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
    return liveResultInputItems;
  }

  function buildLiveResultEvidence() {
    const items = [];
    let checked = 0;
    for (const { input, label, detail } of getLiveResultItems()) {
      const item = {
        id: input.dataset.liveCheck,
        checked: Boolean(input.checked),
        label: label?.textContent?.trim() || input.dataset.liveCheck,
        detail: detail?.textContent?.trim() || ""
      };
      if (item.checked) checked += 1;
      items.push(item);
    }
    return {
      checked,
      total: items.length,
      complete: items.length > 0 && checked === items.length,
      items
    };
  }

  function liveResultStorageState(liveResult) {
    return Object.fromEntries((liveResult?.items || []).map((item) => [item.id, Boolean(item.checked)]));
  }

  function updateLiveResultMeta(liveResult = buildLiveResultEvidence()) {
    setTextContentIfChanged(
      els.liveResultMeta,
      liveResult.complete ? "Article review complete; save the final records." : `${liveResult.checked}/${liveResult.total} article review checks recorded.`
    );
    const checks = buildPreflightChecks();
    const byId = indexPreflightChecks(checks);
    const liveResultContext = preflightEvidenceContext(checks, { byId, liveResult, includePreviewPlan: false });
    const gate = getImportGate(checks, liveResultContext);
    updateLiveRunbook(checks, gate, liveResultContext);
    updateProofDeck(checks, gate, liveResultContext);
    updateCompletionAudit(checks, gate, liveResultContext);
    updateRecoveryPanel(checks, gate, liveResultContext);
    updateProgressiveSections(liveResultContext);
  }

  function saveLiveResultChecks() {
    const liveResult = buildLiveResultEvidence();
    liveResultChecks = liveResultStorageState(liveResult);
    updateLiveResultMeta(liveResult);
    if (hasChromeApi()) chrome.storage.local.set({ [STORAGE_LIVE_RESULT]: liveResultChecks });
  }

  async function restoreLiveResultChecks() {
    if (hasChromeApi()) {
      const stored = await startupStorage();
      liveResultChecks = stored[STORAGE_LIVE_RESULT] || {};
    }
    for (const { input } of getLiveResultItems()) {
      setBooleanPropertyIfChanged(input, "checked", Boolean(liveResultChecks[input.dataset.liveCheck]));
    }
    updateLiveResultMeta();
  }

  function resetLiveResultChecks() {
    liveResultChecks = {};
    for (const { input } of getLiveResultItems()) setBooleanPropertyIfChanged(input, "checked", false);
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
    const tab = await targetTab();
    if (tab?.id) {
      if (isArticlesUrl(tab.url)) {
        rememberTargetTab(tab);
        return;
      }
      const updated = await chrome.tabs.update(tab.id, { active: true, url: "https://x.com/compose/articles" });
      rememberTargetTab(updated || { ...tab, url: "https://x.com/compose/articles" });
    } else {
      const created = await chrome.tabs.create({ url: "https://x.com/compose/articles" });
      rememberTargetTab(created);
    }
  }

  async function refreshActiveXTab() {
    if (!hasChromeApi()) {
      window.open("https://x.com/compose/articles", "_blank", "noopener");
      return;
    }
    const tab = await targetTab();
    if (isXTab(tab)) {
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
    const fileSummary = summarizeMarkdownTransferFiles(dataTransfer.files);
    if (fileSummary.hasFiles) return Boolean(fileSummary.markdownFiles.length);
    const itemSummary = summarizeMarkdownTransferItems(dataTransfer.items);
    if (itemSummary.hasLikelyMarkdown) return true;
    if (itemSummary.hasLikelyImage) return false;
    if (types.includes("text/plain")) return false;
    return itemSummary.hasLikelyMarkdown;
  }

  function markdownTextFromTransfer(dataTransfer) {
    const text = dataTransfer?.getData?.("text/plain") || dataTransfer?.getData?.("text/markdown") || "";
    return shared.looksLikeMarkdown(text) ? text : "";
  }

  function hasMarkdownFile(dataTransfer) {
    const fileSummary = summarizeMarkdownTransferFiles(dataTransfer?.files);
    if (fileSummary.markdownFiles.length) return true;
    return summarizeMarkdownTransferItems(dataTransfer?.items).hasLikelyMarkdown;
  }

  function summarizeMarkdownTransferItems(items) {
    let hasLikelyMarkdown = false;
    let hasLikelyImage = false;
    for (const item of Array.from(items || [])) {
      if (isLikelyMarkdownTransferItem(item)) hasLikelyMarkdown = true;
      if (isLikelyImageTransferItem(item)) hasLikelyImage = true;
    }
    return { hasLikelyMarkdown, hasLikelyImage };
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
    const dropPayloadFromTransfer = (dataTransfer) => {
      const { markdownFiles } = summarizeMarkdownTransferFiles(dataTransfer?.files);
      return {
        markdownFiles,
        text: markdownFiles.length ? "" : markdownTextFromTransfer(dataTransfer)
      };
    };
    const activateDropzone = () => {
      if (dragCancelled) return;
      showWorkspacePanel("draft");
      dragActive = true;
      setClassPresenceIfChanged(els.draftPanel, "drag-active", true);
      setDraftDropStatus("Drop Markdown here", "Release to load it.", "ready");
    };
    const deactivateDropzone = () => {
      dragActive = false;
      setClassPresenceIfChanged(els.draftPanel, "drag-active", false);
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
      const { markdownFiles, text } = dropPayloadFromTransfer(event.dataTransfer);
      if (!markdownFiles.length && !text) return;
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
      if (markdownFiles.length > 1) {
        await queueMarkdownFiles(markdownFiles, "drop-file");
      } else if (markdownFiles[0]) {
        await loadMarkdownFileIntoDraft(markdownFiles[0], "drop-file");
      } else {
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

  async function chooseVault(options = {}) {
    const status = options.status || activeLocalImageFolderStatus();
    if (options.ensureXPage) {
      const ready = await ensureXPageForVaultPrompt();
      if (!ready.ok) {
        log(localizeInterpolated("Local image folder setup failed: {error}", {
          error: localizeText(ready.error || "open an X page first")
        }));
        if (status.count && options.showSidepanelFallback !== false) {
          setDraftDropStatus("Local image folder needed", localImageFolderActionDetail(status), "error", {
            action: "openArticles",
            button: "Open X",
            status
          });
        }
        return { ok: false, error: ready.error || "open an X page first" };
      }
    }
    const response = await sendToTargetTab({
      type: "xposter:choose-vault",
      count: status.count || 0,
      hint: firstLocalImageFolderHint(status)
    }, { requireArticles: true });
    if (response?.ok) {
      log(localizeInterpolated("Local image folder set: {name}.", { name: response.name }));
      await refreshPageState();
      updatePreflight();
      return response;
    }
    if (response?.skipped) {
      const error = "Local image folder was not selected";
      log(localizeText(error));
      return { ok: false, error };
    }
    const error = response?.error || "open an X page first";
    log(localizeInterpolated("Local image folder setup failed: {error}", {
      error: localizeText(error)
    }));
    if (status.count && options.showSidepanelFallback !== false) {
      setDraftDropStatus("Local image folder needed", localImageFolderActionDetail(status), "error", {
        action: "openArticles",
        button: "Open X",
        status
      });
    }
    return { ok: false, error };
  }

  async function clearVault() {
    const response = await sendToTargetTab({ type: "xposter:clear-vault" });
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
        clearMissingActiveQueueItem();
        activeDraftSourceFileName = queueItemSourceFileName(activeQueueItemId);
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
    setLocalizedTextIfChanged(els.vaultSettingsText, "xPoster will ask when a Markdown draft uses local image paths.");
    setVaultClearEnabled(false);
  }

  function updateVaultState(vault) {
    if (!vault) {
      setVaultClearEnabled(false);
      return;
    }
    if (!vault.configured) {
      setLocalizedTextIfChanged(els.vaultSettingsText, "No folder connected. xPoster will ask when a draft needs local images.");
      setVaultClearEnabled(false);
      return;
    }
    const permissionText = vault.permission === "granted" ? "Read access granted" : "Permission needed";
    setLocalizedTextIfChanged(els.vaultSettingsText, `${vault.name} - ${permissionText.toLowerCase()}.`);
    setVaultClearEnabled(true);
  }

  function setVaultClearEnabled(enabled) {
    setBooleanPropertyIfChanged(els.clearVaultSettings, "disabled", !enabled);
  }

  async function runPreflight() {
    setBooleanPropertyIfChanged(els.runPreflight, "disabled", true);
    setLocalizedTextIfChanged(els.runPreflight, "Checking...");
    try {
      log("Publishing check started.");
      await refreshPageState();
      const response = await sendToTargetTab({ type: "xposter:diagnostics" }, { requireArticles: true });
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
      const checks = buildPreflightChecks();
      updatePreflight(checks);
      captureEvidence("preflight", {
        checks,
        targetLock,
        pageStatus: latestPageStatus,
        diagnostics: latestDiagnostics
      });
      const blockerCount = countItemsByTone(checks, "error");
      if (blockerCount) log(`Publishing check found ${blockerCount} blocker(s).`);
      else log("Publishing check passed without blockers.");
    } catch (error) {
      const message = error?.message || String(error);
      latestDiagnostics = { ok: false, error: message };
      log(localizeInterpolated("Publishing check failed: {error}", { error: localizeText(message) }));
      updatePreflight();
    } finally {
      setBooleanPropertyIfChanged(els.runPreflight, "disabled", false);
      setLocalizedTextIfChanged(els.runPreflight, "Check");
    }
  }

  function captureEvidence(kind, payload) {
    const checks = buildPreflightChecks();
    const byId = indexPreflightChecks(checks);
    const evidenceContext = preflightEvidenceContext(checks, { byId });
    const gate = getImportGate(checks, evidenceContext);
    const targetContext = payload?.targetContext || buildTargetContextEvidence();
    const markdown = draftText();
    const snapshot = markdownSnapshot(markdown);
    const evidenceRemoteImages = latestParsed ? remoteHttpImageSegments(latestParsed) : [];
    latestEvidence = {
      id: newRecordId(kind.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "record"),
      kind,
      capturedAt: new Date().toISOString(),
      draftRecordId: activeDraftRecordId || null,
      draftFingerprint: draftFingerprint(markdown),
      source: currentDraftRecord()?.source || null,
      draft: {
        title: latestParsed?.title || null,
        cover: latestParsed?.cover || null,
        markdown: snapshot.text,
        markdownTruncated: snapshot.truncated,
        characters: snapshot.characters,
        counts: latestCounts,
        blocks: latestParsed?.segments?.length || 0,
        remoteImages: remoteImageEvidenceFromSegments(evidenceRemoteImages)
      },
      importPlan: evidenceContext.previewPlan,
      gate,
      checks,
      liveResult: evidenceContext.liveResult,
      proofDeck: buildProofDeckEvidence(checks, gate, evidenceContext),
      completionAudit: buildCompletionAuditEvidence(checks, gate, evidenceContext),
      recovery: buildRecoveryState(checks, gate, evidenceContext),
      targetContext,
      importLedger: buildImportLedger(latestParsed, latestCounts),
      liveProgress: buildLiveProgressEvidence(),
      ...payload
    };
    addRecordHistoryEntry(latestEvidence);
    if (kind === "import" || kind === "import-error") activeDraftFinalized = true;
    syncEvidenceRecordOutput(kind, latestEvidence);
    updateProgressiveSections();
    updateLiveRunbook(checks, gate, evidenceContext);
    updateProofDeck(checks, gate, evidenceContext);
    updateCompletionAudit(checks, gate, evidenceContext);
    updateRecoveryPanel(checks, gate, evidenceContext);
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
      blockers: countItemsByTone(evidence.checks, "error"),
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

  function cachedRecordSearchText(record) {
    const cached = recordSearchTextCache.get(record);
    if (cached?.language === currentLanguage) return cached.text;
    const text = recordSearchText(record);
    recordSearchTextCache.set(record, { language: currentLanguage, text });
    return text;
  }

  function recordHistoryView() {
    const query = recordSearchQuery.trim().toLowerCase();
    const terms = query.split(/\s+/).filter(Boolean);
    const visibleRecords = [];
    let total = 0;
    for (const record of recordHistory) {
      if (!recordHasMarkdown(record)) continue;
      total += 1;
      if (terms.length) {
        const haystack = cachedRecordSearchText(record);
        if (!terms.every((term) => haystack.includes(term))) continue;
      }
      visibleRecords.push(record);
    }
    return { total, visibleRecords, isSearching: terms.length > 0 };
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
      const blockers = countItemsByTone(evidence.checks, "error");
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
      const blockers = countItemsByTone(evidence.checks, "error");
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
    const blockers = countItemsByTone(evidence.checks, "error");
    return blockers ? "warn" : "ok";
  }

  function persistRecordHistory() {
    if (!hasChromeApi()) return;
    Promise.resolve(chrome.storage.local.set({ [STORAGE_RECORD_HISTORY]: recordHistory.map(recordStorageEntry) })).catch(() => {});
  }

  function syncLatestEvidenceRecord() {
    if (!latestEvidence) return;
    syncEvidenceRecordOutput(latestEvidence.kind, latestEvidence);
  }

  function syncEvidenceRecordOutput(kind, evidence) {
    setEvidenceRecordMeta(kind, evidence?.capturedAt);
    setTextContentIfChanged(els.evidenceText, JSON.stringify(evidence, jsonSafeReplacer, 2));
    setBooleanPropertyIfChanged(els.copyEvidence, "disabled", false);
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
    const pendingIds = new Set(pending.map((item) => item.id));
    recordHistory = [...pending, ...storedHistory.filter((item) => !pendingIds.has(item.id))]
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

  function setRecordClearActionState(total) {
    const hasRecoverableRecords = total > 0;
    if (els.clearRecordHistory) {
      setBooleanPropertyIfChanged(els.clearRecordHistory, "disabled", !hasRecoverableRecords);
      setBooleanPropertyIfChanged(recordClearWrap, "hidden", !hasRecoverableRecords);
    }
    if (!hasRecoverableRecords) closeRecordClearConfirm();
  }

  function recordHistoryMetaText({ total, visibleTotal, isSearching }) {
    if (!total) return localizeText("No drafts");
    if (isSearching) return localizeInterpolated("{count} found", { count: visibleTotal });
    return localizeInterpolated("{count} draft(s)", { count: total });
  }

  function recordSearchSummaryText({ total, visibleTotal, isSearching }) {
    if (!total) return "Paste or load Markdown to save the first recoverable draft.";
    if (isSearching) return localizeInterpolated("{count} found", { count: visibleTotal });
    return "";
  }

  function renderRecordHistory() {
    if (!els.recordHistoryList) return;
    const { total, visibleRecords, isSearching } = recordHistoryView();
    const visibleTotal = visibleRecords.length;
    setBooleanPropertyIfChanged(els.recordHistory, "hidden", false);
    const recordCounts = { total, visibleTotal, isSearching };
    setTextContentIfChanged(els.recordHistoryMeta, recordHistoryMetaText(recordCounts));
    setPropertyValueIfChanged(els.recordSearchInput, "value", recordSearchQuery);
    if (els.recordSearchSummary) {
      const searchSummary = recordSearchSummaryText(recordCounts);
      setDatasetValueIfChanged(els.recordSearchSummary, "i18n", searchSummary);
      setTextContentIfChanged(els.recordSearchSummary, searchSummary);
    }
    setRecordClearActionState(total);
    let recordHistoryHtml = "";
    let translateRecordHistory = false;
    if (!total) {
      recordHistoryHtml = `
        <li class="record-history-empty">
          <strong>No saved drafts yet</strong>
          <span>Write or check a draft once. It will appear here so you can copy, edit, or write it again.</span>
        </li>
      `;
      translateRecordHistory = true;
    } else if (!visibleTotal) {
      recordHistoryHtml = `
        <li class="record-history-empty">
          <strong>No records match this search.</strong>
          <span>Clear the search or try a title, file name, URL, or Markdown phrase.</span>
        </li>
      `;
    } else {
      recordHistoryHtml = visibleRecords.map(renderRecordHistoryItem).join("");
      translateRecordHistory = true;
    }
    if (setSourceHtmlIfChanged(els.recordHistoryList, recordHistoryHtml) && translateRecordHistory) {
      translateDynamicDom(els.recordHistory);
    }
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
              <button class="record-text-action" type="button" data-record-action="edit" data-record-id="${safe(record.id)}" title="${safe("Edit this saved Markdown.")}" aria-label="${safe("Edit this saved Markdown.")}">${safe("Edit")}</button>
              <button class="record-text-action" type="button" data-record-action="copy-markdown" data-record-id="${safe(record.id)}" title="${safe("Copy this saved Markdown.")}" aria-label="${safe("Copy this saved Markdown.")}">${safe("Copy Markdown")}</button>
              <button class="record-icon-action record-delete-action" type="button" data-record-action="delete-record" data-record-id="${safe(record.id)}" title="${safe("Clear this record.")}" aria-label="${safe("Clear this record.")}">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.8 7h14.4"/><path d="M9.2 7V5.4c0-.6.4-1 1-1h3.6c.6 0 1 .4 1 1V7"/><path d="M7.4 10.2 8.1 19c.1.6.5 1 1.1 1h5.6c.6 0 1-.4 1.1-1l.7-8.8"/><path d="M10.4 11.6v5.4"/><path d="M13.6 11.6v5.4"/></svg>
              </button>
              ${linkAction}
            </div>
          </div>
        </article>
      </li>
    `;
  }

  function setEmptyEvidenceRecord() {
    latestEvidence = null;
    setLocalizedTextIfChanged(els.evidenceMeta, "No technical record saved yet.");
    setLocalizedTextIfChanged(els.evidenceText, "Run Check article or Write article to save a technical record.");
    setBooleanPropertyIfChanged(els.copyEvidence, "disabled", true);
  }

  function refreshLatestEvidenceFromRecordHistory() {
    latestEvidence = recordHistory[0]?.evidence || null;
    if (latestEvidence) syncLatestEvidenceRecord();
    else setEmptyEvidenceRecord();
  }

  function removeRecordHistoryItem(recordId) {
    const index = recordHistory.findIndex((record) => record.id === recordId);
    if (index < 0) return false;
    const [removed] = recordHistory.splice(index, 1);
    pendingRecordHistoryEntries = pendingRecordHistoryEntries.filter((record) => record.id !== recordId);
    if (activeRecordEditorId === recordId) activeRecordEditorId = null;
    const latestId = latestEvidence?.id || "";
    const removedLatest = latestId && (latestId === removed?.id || latestId === removed?.evidence?.id);
    if (removedLatest || !recordHistory.length) refreshLatestEvidenceFromRecordHistory();
    persistRecordHistory();
    renderRecordHistory();
    updateProgressiveSections();
    log("Record deleted.");
    return true;
  }

  async function clearRecordHistory() {
    closeRecordClearConfirm();
    recordHistory = [];
    activeDraftRecordId = null;
    activeDraftFingerprint = null;
    activeDraftFinalized = false;
    activeRecordEditorId = null;
    window.clearTimeout(draftInputHistoryTimer);
    if (hasChromeApi()) await chrome.storage.local.remove(STORAGE_RECORD_HISTORY).catch(() => {});
    setEmptyEvidenceRecord();
    renderRecordHistory();
    updateProgressiveSections();
    log("Records cleared.");
  }

  function openRecordClearConfirm() {
    if (!els.recordClearConfirm || !els.clearRecordHistory || els.clearRecordHistory.disabled) return;
    setBooleanPropertyIfChanged(els.recordClearConfirm, "hidden", false);
    setAttributeValueIfChanged(els.clearRecordHistory, "aria-expanded", "true");
    translateDynamicDom(els.recordClearConfirm);
    window.setTimeout(() => els.confirmRecordClear?.focus?.(), 0);
  }

  function closeRecordClearConfirm() {
    setBooleanPropertyIfChanged(els.recordClearConfirm, "hidden", true);
    setAttributeValueIfChanged(els.clearRecordHistory, "aria-expanded", "false");
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
      setPropertyValueIfChanged(els.recordEditTextarea, "value", "");
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
    const item = queueItemById(queueId);
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
      setPropertyValueIfChanged(els.recordEditTextarea, "value", "");
      setDatasetValueIfChanged(els.recordEditTextarea, "editorMode", "");
      setDatasetValueIfChanged(els.recordEditTextarea, "recordId", "");
      setDatasetValueIfChanged(els.recordEditTextarea, "queueId", "");
    }
    updateRecordEditorMode("edit");
    setBooleanPropertyIfChanged(els.recordEditWriteButton, "hidden", true);
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
    if (action === "delete-record") {
      event.preventDefault();
      event.stopPropagation();
      removeRecordHistoryItem(recordId);
    } else if (action === "restore") {
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

  function buildProofDeckEvidence(checks = null, gate = null, context = {}) {
    const resolvedChecks = checks || buildPreflightChecks();
    const byId = context.byId || indexPreflightChecks(resolvedChecks);
    const resolvedGate = gate || getImportGate(resolvedChecks, { ...context, byId });
    const liveResult = context.liveResult || buildLiveResultEvidence();
    const hasImportEvidence = Boolean(latestEvidence?.kind?.startsWith("import"));
    const targetReady = byId.get("target")?.tone === "ok";
    const needsRemote = typeof context.needsRemote === "boolean" ? context.needsRemote : remoteHttpImageSegments(latestParsed).length > 0;
    const historyDraftRecord = recordHistory.find(recordHasMarkdown) || null;
    const evidenceDraftRecord = !historyDraftRecord && recordHasMarkdown(latestEvidence)
      ? normalizeRecordHistoryEntry(latestEvidence || {}, {})
      : null;
    const draftRecord = historyDraftRecord || evidenceDraftRecord;
    const hasDraftRecord = Boolean(draftRecord);
    const importSucceeded = latestEvidence?.kind === "import";
    const importFailed = latestEvidence?.kind === "import-error";
    const recordTitle = draftRecord ? recordDisplayTitle(draftRecord) : "";
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
    let ready = 0;
    for (const item of items) {
      if (item.tone === "ok" || item.tone === "ready") ready += 1;
    }
    return {
      extensionPath: EXTENSION_PATH,
      loadedUnpacked: hasChromeApi(),
      complete: importSucceeded && liveResult.complete,
      ready,
      items
    };
  }

  function updateProofDeck(checks = null, gate = null, context = {}) {
    if (!els.proofDeckList) return;
    const proof = buildProofDeckEvidence(checks, gate, context);
    setLocalizedTextIfChanged(els.proofDeckMeta, proof.complete
      ? "Article review is recorded. Keep this summary or save the full record."
      : `${proof.ready}/${proof.items.length} publish steps ready.`);
    setTextContentIfChanged(els.extensionPath, proof.extensionPath);
    for (const item of proof.items) {
      const row = proofDeckItems.get(item.id);
      if (!row) continue;
      syncStatusRow(row, { tone: item.tone, label: item.label, detail: item.detail });
    }
    translateDynamicDom(proofDeckSection);
  }

  function buildCompletionAuditEvidence(checks = null, gate = null, context = {}) {
    const resolvedChecks = checks || buildPreflightChecks();
    const byId = context.byId || indexPreflightChecks(resolvedChecks);
    const resolvedGate = gate || getImportGate(resolvedChecks, { ...context, byId });
    const liveResult = context.liveResult || buildLiveResultEvidence();
    const needsRemote = typeof context.needsRemote === "boolean" ? context.needsRemote : remoteHttpImageSegments(latestParsed).length > 0;
    const proof = buildProofDeckEvidence(resolvedChecks, resolvedGate, { ...context, byId, liveResult, needsRemote });
    const hasImportEvidence = Boolean(latestEvidence?.kind?.startsWith("import"));
    const importSucceeded = latestEvidence?.kind === "import";
    const importFailed = latestEvidence?.kind === "import-error";
    const pageImport = liveResult.items.find((item) => item.id === "page-import");
    const bridgeReady = byId.get("bridge")?.tone === "ok";
    const uploadsReady = byId.get("uploads")?.tone === "ok";
    const targetReady = byId.get("target")?.tone === "ok";
    const draftReady = byId.get("draft")?.tone === "ok";
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

    let proven = 0;
    let blocked = 0;
    for (const item of items) {
      if (item.tone === "ok" || item.tone === "ready") proven += 1;
      if (item.tone === "error") blocked += 1;
    }
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

  function updateCompletionAudit(checks = null, gate = null, context = {}) {
    if (!els.completionAuditList) return;
    const audit = buildCompletionAuditEvidence(checks, gate, context);
    setLocalizedTextIfChanged(els.completionAuditMeta, audit.complete
      ? "All completion records are ready."
      : audit.blocked
        ? `${audit.blocked} thing(s) to fix, ${audit.proven}/${audit.total} ready`
        : `${audit.pending} item(s) waiting, ${audit.proven}/${audit.total} ready`);
    for (const item of audit.items) {
      const row = completionAuditItems.get(item.id);
      if (!row) continue;
      syncStatusRow(row, { tone: item.tone, label: item.label, detail: item.detail });
    }
    translateDynamicDom(completionAuditSection);
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
    setLocalizedTextIfChanged(els.evidenceMeta, "Record package generated");
    setTextContentIfChanged(els.evidenceText, text);
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
      setLocalizedTextIfChanged(els.evidenceMeta, "Publish summary generated");
      setTextContentIfChanged(els.evidenceText, text);
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

  async function runRunbookAction(action, options = {}) {
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
        await chooseVault({
          status: options.status || activeLocalImageFolderStatus(),
          ensureXPage: true,
          showSidepanelFallback: false
        });
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
  els.draftInlinePreview?.addEventListener("error", (event) => {
    if (event.target instanceof HTMLImageElement) markPreviewImageUnavailable(event.target);
  }, true);
  els.draftInlinePreview?.addEventListener("load", (event) => {
    if (event.target instanceof HTMLImageElement) markPreviewImageLoaded(event.target);
  }, true);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushDraftSave();
    else pollPageState();
  });
  window.addEventListener("pagehide", flushDraftSave);
  els.importDraft.addEventListener("click", runImportButtonAction);
  els.publishRail?.addEventListener("click", (event) => {
    void handlePublishRailClick(event);
  });
  els.retryUpload?.addEventListener("click", retryUpload);
  els.cancelImport?.addEventListener("click", cancelImport);
  els.pageState?.addEventListener("click", async () => {
    if (els.pageState.dataset.pageAction === "openArticles") await openArticles();
  });
  els.runPreflight.addEventListener("click", runPreflight);
  els.loadFile.addEventListener("click", loadFile);
  els.draftDropDismiss?.addEventListener("click", dismissDraftDropStatus);
  els.draftDropAction?.addEventListener("click", async () => {
    const action = els.draftDropAction?.dataset.draftDropAction || "";
    if (!action) return;
    await runRunbookAction(action, { status: draftDropActionStatus });
  });
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
  els.languageSelectButton?.addEventListener("click", toggleLanguageMenu);
  els.languageSelectButton?.addEventListener("keydown", handleLanguageButtonKeydown);
  els.languageOptionsList?.addEventListener("click", (event) => {
    const option = event.target.closest("[data-language-option]");
    if (!option) return;
    setLanguage(option.dataset.languageOption);
    closeLanguageMenu({ focusButton: true });
  });
  els.languageOptionsList?.addEventListener("keydown", handleLanguageOptionsKeydown);
  document.addEventListener("click", (event) => {
    if (els.languageControl?.contains(event.target)) return;
    closeLanguageMenu();
  });
  els.themeChoice?.addEventListener("change", (event) => {
    const input = event.target.closest('input[name="themeMode"]');
    if (input) setTheme(input.value);
  });
  els.metadataOptions?.addEventListener("change", () => {
    const coverEnabled = els.importCoverOption?.checked === true;
    setImportOptions({
      ...importOptions,
      setTitle: els.importTitleOption?.checked !== false,
      setCover: coverEnabled,
      allowGraphqlMetadata: coverEnabled
    });
  });
  els.draftProcessingOptions?.addEventListener("change", () => {
    setImportOptions({
      ...importOptions,
      smartPunctuation: els.smartPunctuationOption?.checked === true
    });
  });
  els.articleExportOptions?.addEventListener("change", () => {
    setArticleExportOptions({
      ...articleExportOptions,
      enabled: els.articleExportOption?.checked !== false
    });
  });
  els.aiCoverOpenKeys?.addEventListener("click", () => openAiCoverApiDialog());
  els.aiCoverOpenPromptProfiles?.addEventListener("click", openAiCoverPromptProfileDialog);
  els.aiCoverOpenGenerator?.addEventListener("click", openAiCoverGeneratorDialog);
  els.draftCoverTool?.addEventListener("click", handleAiCoverGeneratorOpenClick);
  els.conversionMapList?.addEventListener("click", handleAiCoverGeneratorOpenClick);
  els.aiCoverApiDialog?.addEventListener("click", (event) => {
    if (aiCoverDialogWasClosed(event, els.aiCoverApiDialog)) {
      if (!returnToAiCoverGeneratorFromKeyDialog()) closeAiCoverDialogs();
    }
  });
  els.aiCoverPromptProfileDialog?.addEventListener("click", (event) => {
    if (aiCoverDialogWasClosed(event, els.aiCoverPromptProfileDialog)) {
      closeAiCoverDialogs();
      return;
    }
    handleAiCoverPromptProfileAction(event);
  });
  els.aiCoverGeneratorDialog?.addEventListener("click", (event) => {
    if (event.target?.closest?.("[data-ai-cover-open-keys]")) {
      openAiCoverApiDialog({ returnToGenerator: true });
      return;
    }
    if (event.target?.closest?.("[data-ai-cover-open-prompt-profiles]")) {
      openAiCoverPromptProfileDialog();
      return;
    }
    if (aiCoverDialogWasClosed(event, els.aiCoverGeneratorDialog)) {
      closeAiCoverDialogs();
    }
  });
  for (const dialog of aiCoverDialogElements()) {
    dialog.addEventListener("keydown", closeAiCoverDialogOnEscape);
  }
  els.aiCoverGeneratorDialog?.addEventListener("change", (event) => {
    if (event.target === els.aiCoverApiKey || event.target === els.aiCoverKeyName) return;
    if (event.target === els.aiCoverPromptProfileSelect) {
      void activateAiCoverPromptProfile(els.aiCoverPromptProfileSelect.value || "");
      return;
    }
    void setAiCoverSettings(readAiCoverControls());
  });
  els.aiCoverGeneratorDialog?.addEventListener("input", (event) => {
    if (event.target === els.aiCoverPromptInput) {
      updateAiCoverReadiness();
      return;
    }
    if (event.target === els.aiCoverApiKey || event.target === els.aiCoverKeyName) return;
    void setAiCoverSettings(readAiCoverControls());
  });
  els.aiCoverAddKey?.addEventListener("click", () => {
    void addAiCoverKeyFromControls();
  });
  els.aiCoverApiProvider?.addEventListener("change", () => {
    resetAiCoverKeyTestResult();
    syncAiCoverProviderControls({ motion: true });
  });
  els.aiCoverApiBaseUrl?.addEventListener("input", () => {
    resetAiCoverKeyTestResult();
    if (els.aiCoverApiProvider?.value === "custom") aiCoverCustomBaseUrlDraft = String(els.aiCoverApiBaseUrl.value || "").trim();
  });
  els.aiCoverApiKey?.addEventListener("input", resetAiCoverKeyTestResult);
  els.aiCoverSavePromptProfile?.addEventListener("click", () => {
    void saveAiCoverPromptProfile();
  });
  els.aiCoverKeyList?.addEventListener("click", handleAiCoverKeyAction);
  els.aiCoverUseSelection?.addEventListener("click", () => {
    const sourceText = syncAiCoverPromptInputFromSelection();
    updateAiCoverReadiness();
    setAiCoverStatus(sourceText ? "Cover source text updated." : "Select text in the draft first, or write a cover idea.", sourceText ? "ok" : "error");
  });
  els.aiCoverGenerate?.addEventListener("click", () => {
    if (aiCoverGenerationAbort) {
      abortAiCoverGeneration();
      setAiCoverStatus("Cover generation stopped.", "idle");
      updateAiCoverReadiness();
      return;
    }
    void generateAiCoverCandidates();
  });
  els.aiCoverCandidates?.addEventListener("click", (event) => {
    const button = event.target.closest('button[data-ai-cover-action="set-cover"]');
    if (!button) return;
    void setAiCoverCandidateAsArticleCover(button.dataset.aiCoverId || "");
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
  els.supportWechat?.addEventListener("click", () => setSupportDialogOpen(true, "wechat"));
  els.supportCoffee?.addEventListener("click", () => setSupportDialogOpen(true, "coffee"));
  els.supportClose?.addEventListener("click", () => setSupportDialogOpen(false));
  els.supportDone?.addEventListener("click", () => setSupportDialogOpen(false));
  els.supportDialog?.addEventListener("click", (event) => {
    if (event.target === els.supportDialog) setSupportDialogOpen(false);
  });
  els.supportDialog?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setSupportDialogOpen(false);
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
  getLiveResultItems().forEach(({ input }) => input.addEventListener("change", saveLiveResultChecks));
  paintStartupShell();
  installDraftStorageSync();
  installDraftDropTray();
  workspaceTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      showWorkspacePanel(tab.dataset.tab);
    });
  });

  runAfterFirstPaint(() => {
    runWhenIdle(() => {
      restoreStartupState().catch(() => analyzeDraft());
    }, STARTUP_IDLE_TIMEOUT_MS);
  });
  installSystemThemeSync();
  scheduleRecordHistoryRestore();
  runWhenIdle(() => {
    void refreshPageState();
  }, STARTUP_PAGE_STATE_TIMEOUT_MS);
  window.setInterval(pollPageState, 2500);
})();
