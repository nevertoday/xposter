(() => {
  const shared = window.xPosterShared;
  const CHANNEL_TO_MAIN = "xposter";
  const CHANNEL_FROM_MAIN = "xposter-main";
  const STATUS_ID = "__xposter_status__";
  const IMPORT_BUTTON_ID = "__xposter_import_button__";
  const DROP_HINT_ID = "__xposter_drop_hint__";
  const ARTICLE_EXPORT_ID = "__xposter_article_export__";
  const ARTICLE_EXPORT_STYLE_ID = "__xposter_article_export_style__";
  const SIDEPANEL_DRAFT_STORAGE_KEY = "xposter_sidepanel_draft";
  const PENDING_ARTICLE_IMPORT_STORAGE_KEY = "xposter_pending_article_import";
  const ARTICLE_EXPORT_SETTINGS_STORAGE_KEY = "xposter_article_export_settings";
  const LANGUAGE_STORAGE_KEY = "xposter_language";
  const THEME_STORAGE_KEY = "xposter_theme";
  const SIDEPANEL_QUEUE_STORAGE_KEY = "xposter_publish_queue";
  const MAX_SIDEPANEL_QUEUE_ITEMS = 24;
  const MAX_SIDEPANEL_QUEUE_STORAGE_BYTES = 4 * 1024 * 1024;
  const MAX_SIDEPANEL_QUEUE_ITEM_BYTES = 512 * 1024;
  const PENDING_ARTICLE_IMPORT_TTL_MS = 10 * 60 * 1000;
  const ARTICLE_EXPORT_MIN_SCORE = 12;
  const CONTENT_ZH_TEXT = new Map(Object.entries({
    "xPoster page drop target": "xPoster 页面拖拽目标",
    "Markdown exported": "Markdown 已导出",
    "Markdown queued": "Markdown 已加入队列",
    "Article written": "文章已写入",
    "Image note": "图片提醒",
    "Could not write": "无法写入",
    "Writing article": "正在写入文章",
    "Preparing Markdown...": "正在准备 Markdown...",
    "Stop requested": "已请求停止",
    "Open X Articles first": "请先打开 X 文章",
    "X editor bridge is not ready": "X 编辑器桥接尚未就绪",
    "Writing into X editor...": "正在写入 X 编辑器...",
    "Could not open X Articles": "无法打开 X 文章",
    "Could not open X Article": "无法打开 X 文章",
    "Could not write dropped Markdown": "无法写入拖入的 Markdown",
    "Could not find the X Article create button": "未找到 X 文章新建按钮",
    "Choose a Markdown file": "请选择 Markdown 文件",
    "Drop a Markdown file or Markdown text.": "拖入 Markdown 文件或 Markdown 文本。",
    "Opening X Article...": "正在打开 X 文章...",
    "No Markdown content": "没有 Markdown 内容",
    "No readable article text found.": "未找到可读取的文章正文。",
    "Markdown saved.": "Markdown 已保存。",
    "Markdown copied.": "Markdown 已复制。",
    "Could not export Markdown": "无法导出 Markdown",
    "Copy Markdown": "复制 Markdown",
    "Download Markdown": "下载 Markdown",
    "MD": "MD",
    "Markdown export action": "Markdown 导出操作",
    "Drop Markdown files to add drafts to the side panel.": "拖入 Markdown 文件，将草稿加入侧边栏。",
    "Drop a Markdown file or Markdown text to open it in the side panel.": "拖入 Markdown 文件或 Markdown 文本，在侧边栏打开。",
    "Markdown draft sent to the side panel.": "Markdown 草稿已发送到侧边栏。",
    "Could not send Markdown to the side panel": "无法发送 Markdown 到侧边栏",
    "These Markdown files were already queued or too large to save together.": "这些 Markdown 文件已在队列中，或整体过大无法保存。",
    "Drop on the article body": "拖到文章正文区域",
    "Release inside the highlighted editor area to write into this article.": "在高亮编辑区域内松开，即可写入这篇文章。",
    "Queue Markdown drafts": "加入 Markdown 草稿队列",
    "Release to add them to the xPoster side panel.": "松开后加入 xPoster 侧边栏。",
    "Send Markdown to side panel": "发送 Markdown 到侧边栏",
    "Release to open it as an xPoster draft.": "松开后作为 xPoster 草稿打开。",
    "Release over this area to send them to the side panel.": "在这个区域松开后发送到侧边栏。",
    "Connect image folder": "连接图片文件夹",
    "Release here to link local images for this article.": "在这里松开，为这篇文章关联本地图片。",
    "Add image to article": "添加图片到文章",
    "Release over the editor to upload through X.": "在编辑器上松开，通过 X 上传。",
    "Write Markdown here": "在这里写入 Markdown",
    "Release over the editor to write into this article.": "在编辑器上松开，即可写入这篇文章。",
    "Adding drafts...": "正在添加草稿...",
    "Saving Markdown drafts to the side panel.": "正在把 Markdown 草稿保存到侧边栏。",
    "Opening side panel...": "正在打开侧边栏...",
    "Loading this Markdown as a draft.": "正在把这份 Markdown 载入为草稿。",
    "Saving Markdown drafts for the side panel.": "正在为侧边栏保存 Markdown 草稿。",
    "Connecting folder...": "正在连接文件夹...",
    "Checking local image access.": "正在检查本地图片访问权限。",
    "Adding image...": "正在添加图片...",
    "Handing the image to X's uploader.": "正在交给 X 上传图片。",
    "Reading Markdown...": "正在读取 Markdown...",
    "Preparing the article body.": "正在准备文章正文。",
    "Downloading dropped image...": "正在下载拖入的图片...",
    "Could not download the dropped image": "无法下载拖入的图片",
    "Adding image to the X article...": "正在把图片添加到 X 文章...",
    "No image data found": "未找到图片数据",
    "No image file found": "未找到图片文件",
    "No image link found": "未找到图片链接",
    "Import already running": "导入正在进行中",
    "Writing stopped by user.": "写入已停止。",
    "Stopping after the current upload step...": "当前上传步骤结束后停止...",
    "X editor bridge did not respond": "X 编辑器桥接没有响应",
    "X image upload failed": "X 图片上传失败",
    "X media upload took too long. X may be throttling this draft, especially with many images. Wait a moment, then write again or split the article.": "X 上传图片等待太久。图片较多时 X 可能会限速。可以稍等后再次写入，或把文章拆成多篇。",
    "Local image folder cleared": "本地图片文件夹已清除",
    "Could not set local image folder": "无法设置本地图片文件夹"
  }));
  const CONTENT_EN_TEXT = new Map(Array.from(CONTENT_ZH_TEXT.entries()).map(([en, zh]) => [zh, en]));
  const ORIGINAL_IMPORTER_MARKERS = [
    { label: "original import button", selector: "#__xmp_import_btn__, [id*='__xmp_import_btn__']" },
    { label: "original vault prompt", selector: "#__xmp_vault_prompt__" },
    { label: "original drop hint", selector: "#__xmp_drop_hint__" },
    { label: "original drop hint style", selector: "#__xmp_drop_hint_anim__" },
    { label: "original import style", selector: "#__xmp_import_btn_style__" },
    { label: "original status banner", selector: "#__x_md_paste_banner__" },
    { label: "original page offset style", selector: "#__x_md_paste_offset_style__" }
  ];
  const CONTENT_SCRIPT_VERSION =
    typeof chrome !== "undefined" && chrome.runtime?.getManifest
      ? chrome.runtime.getManifest().version
      : "dev";

  const DEFAULT_LIMITS = {
    maxImagesPerImport: Number.POSITIVE_INFINITY,
    maxTablesPerImport: Number.POSITIVE_INFINITY,
    maxTweetsPerImport: Number.POSITIVE_INFINITY,
    appendSignature: false
  };

  const state = {
    busy: false,
    lastSummary: null,
    mainReady: false,
    runtimeInvalidated: false,
    currentMarkdown: "",
    cancelRequested: false,
    activeRun: null,
    language: "en",
    articleExport: {
      enabled: true,
      mode: "copy",
      root: null,
      documentListenersInstalled: false,
      syncTimer: 0,
      feedbackTimer: 0
    }
  };

  function runtimeErrorMessage(error) {
    return String(error?.message || error || "");
  }

  function isExtensionContextInvalidatedError(error) {
    return /extension context invalidated|context invalidated/i.test(runtimeErrorMessage(error));
  }

  async function safeRuntimeSendMessage(message) {
    if (state.runtimeInvalidated || typeof chrome === "undefined") {
      return { ok: false, contextInvalidated: state.runtimeInvalidated, error: "Extension context unavailable" };
    }
    try {
      const sendMessage = chrome.runtime?.sendMessage?.bind(chrome.runtime);
      if (!sendMessage) return { ok: false, error: "Extension runtime messaging unavailable" };
      return await sendMessage(message);
    } catch (error) {
      if (isExtensionContextInvalidatedError(error)) {
        state.runtimeInvalidated = true;
        return { ok: false, contextInvalidated: true, error: "Extension context invalidated. Reload the X Article tab after updating xPoster." };
      }
      throw error;
    }
  }

  function normalizeImportOptions(options = {}) {
    return {
      setTitle: options.setTitle !== false,
      setCover: options.setCover !== false
    };
  }

  function isArticleRoute() {
    return /^https:\/\/(?:x|twitter)\.com\/compose\/articles(?:$|[/?#])/.test(location.href);
  }

  function isEditorRoute() {
    return /^https:\/\/(?:x|twitter)\.com\/compose\/articles\/edit\//.test(location.href);
  }

  function articleIdFromUrl() {
    return location.pathname.match(/\/compose\/articles\/edit\/(\d+)/)?.[1] || null;
  }

  function statusIdFromUrl() {
    return location.pathname.match(/\/status\/(\d+)/)?.[1] || null;
  }

  function collectTargetContext() {
    const editor = findEditor();
    const editorText = normalizeText(editor?.innerText || editor?.textContent || "");
    return {
      url: location.href,
      pageTitle: document.title || "",
      route: isEditorRoute() ? "editor" : isArticleRoute() ? "articles" : "other",
      isArticleRoute: isArticleRoute(),
      isEditorRoute: isEditorRoute(),
      articleId: articleIdFromUrl(),
      hasEditor: Boolean(editor),
      editorTextLength: editorText.length,
      editorSample: editorText ? truncateText(editorText, 180) : "",
      originalImporterResidue: detectOriginalImporterResidue()
    };
  }

  function detectOriginalImporterResidue() {
    const markers = [];
    for (const marker of ORIGINAL_IMPORTER_MARKERS) {
      if (document.querySelector(marker.selector)) markers.push(marker.label);
    }
    if (document.body?.classList?.contains("__xmp_banner_visible")) {
      markers.push("original banner class");
    }
    const uniqueMarkers = Array.from(new Set(markers));
    return {
      detected: uniqueMarkers.length > 0,
      markers: uniqueMarkers,
      detail: uniqueMarkers.length
        ? `Old X Article Markdown Paste residue detected: ${uniqueMarkers.join(", ")}`
        : ""
    };
  }

  function normalizeText(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
  }

  function normalizeLanguage(language) {
    const value = String(language || "").toLowerCase().replace("_", "-");
    if (value.startsWith("zh")) return "zh";
    if (value.startsWith("en")) return "en";
    return "en";
  }

  function contentSourceText(text) {
    return CONTENT_EN_TEXT.get(String(text || "")) || String(text || "");
  }

  function translateContentText(text) {
    const source = contentSourceText(text);
    if (state.language !== "zh") return source;
    const direct = CONTENT_ZH_TEXT.get(source);
    if (direct) return direct;
    return translateContentPattern(source);
  }

  function translateContentPattern(source) {
    const patterns = [
      [/^Preparing (\d+) image\(s\)\.\.\.$/, "正在准备 $1 张图片..."],
      [/^Preparing image (\d+)\/(\d+)\.\.\.$/, "正在准备图片 $1/$2..."],
      [/^Prepared (\d+)\/(\d+) image\(s\)\.\.\.$/, "已准备 $1/$2 张图片..."],
      [/^Retrying image (.+)\.\.\.$/, "正在重试图片 $1..."],
      [/^Rendering (\d+) table\(s\)\.\.\.$/, "正在渲染 $1 个表格..."],
      [/^Article written(?: in (.+))?\.$/, (_, elapsed) => elapsed ? `文章已写入，用时 ${elapsed}。` : "文章已写入。"],
      [/^Article written(?: in (.+))?\. (.+) web image\(s\) stayed as Markdown links\.(?: Replace unreachable image URLs with public links, then write again if those images must upload\.)?$/, (_, elapsed, images) => elapsed ? `文章已写入，用时 ${elapsed}。${images} 张网页图片保留为 Markdown 链接。` : `文章已写入。${images} 张网页图片保留为 Markdown 链接。`],
      [/^Article written(?: in (.+))?\. (.+) image upload\(s\) timed out in X\. Wait a moment, then write again or split the article if it has many images\.$/, (_, elapsed, images) => elapsed ? `文章已写入，用时 ${elapsed}。${images} 张图片在 X 上传时等待过久。可以稍等后再次写入，或把多图文章拆成多篇。` : `文章已写入。${images} 张图片在 X 上传时等待过久。可以稍等后再次写入，或把多图文章拆成多篇。`],
      [/^Article written(?: in (.+))?\. (.+) table\(s\) kept as Markdown\.$/, (_, elapsed, tables) => elapsed ? `文章已写入，用时 ${elapsed}。${tables} 个表格保留为 Markdown。` : `文章已写入。${tables} 个表格保留为 Markdown。`],
      [/^Article written(?: in (.+))?\. (.+) web image\(s\) stayed as Markdown links; (.+) table\(s\) kept as Markdown\.(?: Replace unreachable image URLs with public links, then write again if those images must upload\.)?$/, (_, elapsed, images, tables) => elapsed ? `文章已写入，用时 ${elapsed}。${images} 张网页图片保留为 Markdown 链接；${tables} 个表格保留为 Markdown。` : `文章已写入。${images} 张网页图片保留为 Markdown 链接；${tables} 个表格保留为 Markdown。`],
      [/^(\d+) local image\(s\) skipped: directory picker is unavailable$/, "$1 张本地图片已跳过：当前浏览器无法选择文件夹"],
      [/^(\d+) local image\(s\) need a local image folder\.\.\.$/, "$1 张本地图片需要选择本地图片文件夹..."],
      [/^Local image folder set: (.+)$/, "本地图片文件夹已设置：$1"],
      [/^Adding (\d+) dropped image(?:s)?\.\.\.$/, "正在添加 $1 张拖入的图片..."],
      [/^Adding (\d+) image(?:s)?\.\.\.$/, "正在添加 $1 张图片..."],
      [/^(\d+) image\(s\) handed to X's uploader\.$/, "$1 张图片已交给 X 上传。"],
      [/^(\d+) image handed to X's uploader\.$/, "$1 张图片已交给 X 上传。"],
      [/^Added (\d+) Markdown draft(?:s)? to the side panel\.$/, "已添加 $1 篇 Markdown 草稿到侧边栏。"]
    ];
    for (const [pattern, replacement] of patterns) {
      const match = source.match(pattern);
      if (!match) continue;
      if (typeof replacement === "function") return replacement(...match);
      return source.replace(pattern, replacement);
    }
    return source;
  }

  function articleExportLabel(mode) {
    return translateContentText(mode === "download" ? "Download Markdown" : "Copy Markdown");
  }

  function truncateText(text, maxLength) {
    const cleaned = normalizeText(text);
    return cleaned.length > maxLength ? `${cleaned.slice(0, Math.max(0, maxLength - 3))}...` : cleaned;
  }

  function statusThemeFromPage() {
    for (const element of [document.body, document.documentElement]) {
      if (!element) continue;
      const match = getComputedStyle(element).backgroundColor.match(
        /^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:\s*[,/]\s*([\d.]+))?/i
      );
      if (!match || Number(match[4] ?? 1) === 0) continue;
      const luminance = Number(match[1]) * 0.299 + Number(match[2]) * 0.587 + Number(match[3]) * 0.114;
      return luminance < 128 ? "dark" : "light";
    }
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function syncStatusTheme(card) {
    card.dataset.theme = statusThemeFromPage();
    if (typeof chrome === "undefined" || !chrome.storage?.local) return;
    chrome.storage.local.get(THEME_STORAGE_KEY).then((stored) => {
      if (!card.isConnected) return;
      const selectedTheme = stored?.[THEME_STORAGE_KEY];
      card.dataset.theme = selectedTheme === "light" || selectedTheme === "dark"
        ? selectedTheme
        : statusThemeFromPage();
    }).catch(() => {});
  }

  function statusProgressForText(text, level) {
    if (level === "done" || level === "queue") return 100;
    const normalized = normalizeText(text).toLowerCase();
    const progressMatch = normalized.match(/(\d+)\s*\/\s*(\d+)/);
    const fraction = progressMatch && Number(progressMatch[2]) > 0
      ? Math.min(1, Number(progressMatch[1]) / Number(progressMatch[2]))
      : null;
    const progress = (start, span = 0) => Math.round(start + span * (fraction ?? 0));

    if (/preparing markdown/.test(normalized)) return 6;
    if (/stopping after/.test(normalized)) return 100;
    if (/preparing (?:\d+\s+)?image|prepared \d/.test(normalized)) return progress(10, 18);
    if (/rendering \d+ table/.test(normalized)) return 32;
    if (/writing into x editor|pasting structured/.test(normalized)) return 40;
    if (/inserting \d+ special/.test(normalized)) return 51;
    if (/uploading image/.test(normalized)) return progress(56, 24);
    if (/reordering uploaded/.test(normalized)) return 84;
    if (/setting (title|cover)/.test(normalized)) return 90;
    if (/cleaning up import markers/.test(normalized)) return 96;
    if (/downloading dropped image/.test(normalized)) return 28;
    if (/adding .*image/.test(normalized)) return 62;
    return null;
  }

  function updateStatusProgress(card, text, level, previousLevel) {
    let percent = statusProgressForText(text, level);
    if (percent == null && previousLevel === "work" && /^retrying\b/i.test(normalizeText(text))) {
      const retained = Number(card.dataset.progressValue);
      percent = Number.isFinite(retained) && retained > 0 ? retained : null;
    }
    const hasProgress = Number.isFinite(percent);
    card.dataset.progress = hasProgress ? "determinate" : level === "work" ? "indeterminate" : "none";
    if (hasProgress) {
      const boundedPercent = Math.max(0, Math.min(100, percent));
      card.dataset.progressValue = String(boundedPercent);
      card.style.setProperty("--__xposter-status-progress", `${boundedPercent}%`);
    } else {
      delete card.dataset.progressValue;
      card.style.removeProperty("--__xposter-status-progress");
    }
    card.setAttribute("aria-busy", String(level === "work"));
  }

  function refreshContentLanguageSoon() {
    if (!chrome.storage?.local) return;
    chrome.storage.local.get(LANGUAGE_STORAGE_KEY).then((stored) => {
      const nextLanguage = normalizeLanguage(stored[LANGUAGE_STORAGE_KEY] || state.language);
      if (nextLanguage === state.language) return;
      state.language = nextLanguage;
      syncVisibleLocalizedContent();
    }).catch(() => {});
  }

  function showStatus(text, level = "work", timeout = 0) {
    refreshContentLanguageSoon();
    let card = document.getElementById(STATUS_ID);
    if (!card) {
      card = document.createElement("section");
      card.id = STATUS_ID;
      card.setAttribute("role", "status");
      card.setAttribute("aria-live", "polite");
      card.innerHTML = `
        <div class="__xposter_status_head">
          <span>xPoster</span>
          <strong></strong>
        </div>
        <p></p>
      `;
      document.body.appendChild(card);
      injectStatusStyle();
    }
    const title = card.querySelector("strong");
    const detail = card.querySelector("p");
    const previousLevel = card.dataset.level;
    card.dataset.level = level;
    card.dataset.statusText = text;
    syncStatusTheme(card);
    updateStatusProgress(card, text, level, previousLevel);
    if (title) title.textContent = translateContentText(statusTitleForLevel(level));
    if (detail) detail.textContent = translateContentText(text);
    document.body.classList.add("__xposter_status_visible");
    broadcast({ type: "status", text, level });
    if (timeout) window.setTimeout(hideStatus, timeout);
  }

  function hideStatus() {
    document.getElementById(STATUS_ID)?.remove();
    document.body.classList.remove("__xposter_status_visible");
    broadcast({ type: "status", text: "", level: "idle" });
  }

  function transientStatus(text, level = "export", timeout = 3000) {
    showStatus(text, level, timeout);
  }

  function throwIfImportCancelled() {
    if (!state.cancelRequested) return;
    const error = new Error("Writing stopped by user.");
    error.cancelled = true;
    throw error;
  }

  function statusTitleForLevel(level) {
    if (level === "export") return "Markdown exported";
    if (level === "queue") return "Markdown queued";
    if (level === "done") return "Article written";
    if (level === "cancel") return "Stop requested";
    if (level === "warn") return "Image note";
    if (level === "error") return "Could not write";
    return "Writing article";
  }

  function syncVisibleLocalizedContent() {
    const status = document.getElementById(STATUS_ID);
    if (status) {
      const level = status.dataset.level || "work";
      const title = status.querySelector("strong");
      const detail = status.querySelector("p");
      if (title) title.textContent = translateContentText(statusTitleForLevel(level));
      if (detail) detail.textContent = translateContentText(status.dataset.statusText || contentSourceText(detail.textContent || ""));
    }
    updateArticleExportButtonMode();
    updateVisibleDropHintCopy();
  }

  async function restoreContentLanguage() {
    state.language = normalizeLanguage(navigator.language || "en");
    if (!chrome.storage?.local) return;
    const stored = await chrome.storage.local.get(LANGUAGE_STORAGE_KEY).catch(() => ({}));
    state.language = normalizeLanguage(stored[LANGUAGE_STORAGE_KEY] || state.language);
    syncVisibleLocalizedContent();
  }

  function installContentLanguageSync() {
    chrome.storage?.onChanged?.addListener((changes, areaName) => {
      if (areaName !== "local" || !changes[LANGUAGE_STORAGE_KEY]) return;
      state.language = normalizeLanguage(changes[LANGUAGE_STORAGE_KEY].newValue || navigator.language || "en");
      syncVisibleLocalizedContent();
    });
  }

  function injectStatusStyle() {
    if (document.getElementById("__xposter_status_style__")) return;
    const style = document.createElement("style");
    style.id = "__xposter_status_style__";
    style.textContent = `
      #${STATUS_ID} {
        --__xposter-status-paper: #ffffff;
        --__xposter-status-ink: #0f1419;
        --__xposter-status-muted: #536471;
        --__xposter-status-line: #cfd9de;
        --__xposter-status-signal: #1d9bf0;
        --__xposter-status-signal-text: #0f6cbf;
        --__xposter-status-ok: #00ba7c;
        --__xposter-status-warn: #b15c00;
        --__xposter-status-danger: #f4212e;
        --__xposter-status-tone: var(--__xposter-status-signal);
        --__xposter-status-tone-text: var(--__xposter-status-signal-text);
        --__xposter-status-progress: 0%;
        position: fixed;
        z-index: 2147483647;
        top: 76px;
        right: 18px;
        width: min(340px, calc(100vw - 36px));
        display: grid;
        gap: 6px;
        padding: 12px 14px 12px;
        border: 1px solid var(--__xposter-status-line);
        overflow: hidden;
        isolation: isolate;
        background: var(--__xposter-status-paper);
        color: var(--__xposter-status-ink);
        font: 13px/1.45 ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif;
        letter-spacing: 0;
        box-shadow: 0 16px 38px rgba(15, 20, 25, 0.10);
        pointer-events: none;
        animation: __xposter_status_in 220ms cubic-bezier(0.22, 1, 0.36, 1) both;
      }
      #${STATUS_ID}[data-theme="dark"] {
        --__xposter-status-paper: #121a22;
        --__xposter-status-ink: #d6dee6;
        --__xposter-status-muted: #8b99a6;
        --__xposter-status-line: #33414d;
        --__xposter-status-signal: #66a9d8;
        --__xposter-status-signal-text: #9ccbec;
        --__xposter-status-ok: #6fc8a4;
        --__xposter-status-warn: #d8b765;
        --__xposter-status-danger: #ef7d86;
        box-shadow: 0 18px 44px rgba(0, 0, 0, 0.30);
      }
      #${STATUS_ID}::before {
        content: "";
        position: absolute;
        inset: 0 auto 0 0;
        z-index: 0;
        width: var(--__xposter-status-progress);
        background: color-mix(in oklch, var(--__xposter-status-tone), transparent 91%);
        box-shadow: inset -1px 0 color-mix(in oklch, var(--__xposter-status-tone), transparent 70%);
        transition: width 180ms ease-out, background-color 180ms ease-out;
      }
      #${STATUS_ID}::after {
        content: "";
        position: absolute;
        inset: auto auto 0 0;
        z-index: 1;
        width: var(--__xposter-status-progress);
        height: 2px;
        background: var(--__xposter-status-tone);
        transition: width 180ms ease-out, background-color 180ms ease-out;
      }
      #${STATUS_ID}[data-progress="indeterminate"]::before {
        width: 44%;
        background: linear-gradient(90deg, transparent, color-mix(in oklch, var(--__xposter-status-tone), transparent 87%), transparent);
        box-shadow: none;
        transform: translateX(-110%);
        animation: __xposter_status_sweep 1.8s linear infinite;
      }
      #${STATUS_ID}[data-progress="indeterminate"]::after,
      #${STATUS_ID}[data-progress="none"]::before,
      #${STATUS_ID}[data-progress="none"]::after {
        display: none;
      }
      #${STATUS_ID}[data-level="warn"] {
        --__xposter-status-tone: var(--__xposter-status-warn);
        --__xposter-status-tone-text: var(--__xposter-status-warn);
        border-color: color-mix(in oklch, var(--__xposter-status-warn), var(--__xposter-status-line) 42%);
      }
      #${STATUS_ID}[data-level="cancel"] {
        --__xposter-status-tone: var(--__xposter-status-warn);
        --__xposter-status-tone-text: var(--__xposter-status-warn);
        border-color: color-mix(in oklch, var(--__xposter-status-warn), var(--__xposter-status-line) 42%);
      }
      #${STATUS_ID}[data-level="queue"] {
        --__xposter-status-tone: var(--__xposter-status-muted);
        --__xposter-status-tone-text: var(--__xposter-status-ink);
      }
      #${STATUS_ID}[data-level="export"] {
        --__xposter-status-tone: var(--__xposter-status-muted);
        --__xposter-status-tone-text: var(--__xposter-status-ink);
      }
      #${STATUS_ID}[data-level="done"] {
        --__xposter-status-tone: var(--__xposter-status-ok);
        --__xposter-status-tone-text: var(--__xposter-status-ok);
        border-color: color-mix(in oklch, var(--__xposter-status-ok), var(--__xposter-status-line) 36%);
      }
      #${STATUS_ID}[data-level="error"] {
        --__xposter-status-tone: var(--__xposter-status-danger);
        --__xposter-status-tone-text: var(--__xposter-status-danger);
        border-color: color-mix(in oklch, var(--__xposter-status-danger), var(--__xposter-status-line) 42%);
      }
      #${STATUS_ID} .__xposter_status_head {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      #${STATUS_ID} .__xposter_status_head span {
        color: var(--__xposter-status-muted);
        font-size: 10px;
        font-weight: 820;
        text-transform: uppercase;
      }
      #${STATUS_ID} .__xposter_status_head strong {
        color: var(--__xposter-status-tone-text);
        font-size: 12px;
        line-height: 1.2;
      }
      #${STATUS_ID} p {
        position: relative;
        z-index: 2;
        margin: 0;
        color: var(--__xposter-status-muted);
        overflow-wrap: anywhere;
      }
      @keyframes __xposter_status_in {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes __xposter_status_sweep {
        from { transform: translateX(-110%); }
        to { transform: translateX(330%); }
      }
      @media (prefers-reduced-motion: reduce) {
        #${STATUS_ID},
        #${STATUS_ID}[data-progress="indeterminate"]::before {
          animation: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function broadcast(payload) {
    safeRuntimeSendMessage({ type: "xposter:event", event: payload.type || "message", payload }).catch(() => {});
  }

  function normalizeArticleExportMode(mode) {
    return mode === "download" ? "download" : "copy";
  }

  function normalizeArticleExportSettings(settings = {}) {
    return {
      enabled: settings.enabled !== false,
      mode: normalizeArticleExportMode(settings.mode)
    };
  }

  function articleExportSettingsPayload() {
    return {
      enabled: state.articleExport.enabled !== false,
      mode: normalizeArticleExportMode(state.articleExport.mode)
    };
  }

  function applyArticleExportSettings(settings = {}) {
    const normalized = normalizeArticleExportSettings(settings);
    state.articleExport.enabled = normalized.enabled;
    state.articleExport.mode = normalized.mode;
    updateArticleExportButtonMode();
    scheduleArticleExportSync();
  }

  async function setArticleExportMode(mode) {
    state.articleExport.mode = normalizeArticleExportMode(mode);
    updateArticleExportButtonMode();
    if (chrome.storage?.local) {
      await chrome.storage.local.set({
        [ARTICLE_EXPORT_SETTINGS_STORAGE_KEY]: articleExportSettingsPayload()
      }).catch(() => {});
    }
  }

  async function restoreArticleExportSettings() {
    if (!chrome.storage?.local) {
      applyArticleExportSettings();
      return;
    }
    const stored = await chrome.storage.local.get(ARTICLE_EXPORT_SETTINGS_STORAGE_KEY).catch(() => ({}));
    applyArticleExportSettings(stored[ARTICLE_EXPORT_SETTINGS_STORAGE_KEY] || {});
  }

  function installArticleExportSettingsSync() {
    chrome.storage?.onChanged?.addListener((changes, areaName) => {
      if (areaName !== "local" || !changes[ARTICLE_EXPORT_SETTINGS_STORAGE_KEY]) return;
      applyArticleExportSettings(changes[ARTICLE_EXPORT_SETTINGS_STORAGE_KEY].newValue || {});
    });
  }

  function waitForMainReady(timeoutMs = 5000) {
    if (state.mainReady) return Promise.resolve(true);
    return new Promise((resolve) => {
      const deadline = Date.now() + timeoutMs;
      const listener = (event) => {
        if (event.source !== window || event.data?.source !== CHANNEL_FROM_MAIN) return;
        if (event.data.kind === "ready") {
          state.mainReady = true;
          window.removeEventListener("message", listener);
          resolve(true);
        }
      };
      window.addEventListener("message", listener);
      const tick = () => {
        window.postMessage({ source: CHANNEL_TO_MAIN, kind: "ready?" }, "*");
        if (state.mainReady) return;
        if (Date.now() > deadline) {
          window.removeEventListener("message", listener);
          resolve(false);
          return;
        }
        window.setTimeout(tick, 250);
      };
      tick();
    });
  }

  function cancelActiveImport() {
    state.cancelRequested = true;
    showStatus("Stopping after the current upload step...", "cancel");
    window.postMessage({ source: CHANNEL_TO_MAIN, kind: "cancel" }, "*");
    return { ok: true, cancelled: true };
  }

  function runMain(payload, filePayloads = new Map()) {
    return new Promise((resolve, reject) => {
      let timeout = null;
      state.activeRun = { reject };
      const refreshTimeout = () => {
        clearTimeout(timeout);
        timeout = window.setTimeout(() => {
          window.removeEventListener("message", listener);
          if (state.activeRun?.reject === reject) state.activeRun = null;
          reject(new Error("X editor bridge did not respond"));
        }, 60000);
      };
      const listener = (event) => {
        if (event.source !== window || event.data?.source !== CHANNEL_FROM_MAIN) return;
        const message = event.data;
        if (message.kind === "file-request") {
          const key = message.token || message.marker;
          const file = filePayloads.get(key);
          window.postMessage(
            {
              source: CHANNEL_TO_MAIN,
              kind: "file-response",
              requestId: message.requestId,
              ok: Boolean(file),
              file: file || null,
              error: file ? null : "Prepared image data was not found"
            },
            "*"
          );
          refreshTimeout();
          return;
        }
        if (message.kind === "progress") {
          showStatus(message.text || "...", message.level || "work");
          refreshTimeout();
          return;
        }
        if (message.kind === "done") {
          clearTimeout(timeout);
          window.removeEventListener("message", listener);
          if (state.activeRun?.reject === reject) state.activeRun = null;
          resolve(message.summary || {});
          return;
        }
        if (message.kind === "cancelled") {
          clearTimeout(timeout);
          window.removeEventListener("message", listener);
          if (state.activeRun?.reject === reject) state.activeRun = null;
          const error = new Error(message.reason || "Writing stopped by user.");
          error.cancelled = true;
          error.mainSummary = message.summary || null;
          reject(error);
          return;
        }
        if (message.kind === "error") {
          clearTimeout(timeout);
          window.removeEventListener("message", listener);
          if (state.activeRun?.reject === reject) state.activeRun = null;
          reject(new Error(message.error || "X editor bridge failed"));
        }
      };
      window.addEventListener("message", listener);
      refreshTimeout();
      window.postMessage({ source: CHANNEL_TO_MAIN, kind: "run", payload }, "*");
    });
  }

  async function importMarkdown(markdown, origin = "manual", options = {}) {
    if (state.busy) return { ok: false, error: "Import already running" };
    const importOptions = normalizeImportOptions(options);
    state.busy = true;
    state.cancelRequested = false;
    state.currentMarkdown = markdown;
    const startedAt = performance.now();
    showStatus("Preparing Markdown...", "work");
    try {
      throwIfImportCancelled();
      if (!isArticleRoute()) throw new Error("Open X Articles first");
      if (origin !== "paste" && !findEditor()) {
        await ensureEditorReadyForFileImport();
      }
      throwIfImportCancelled();
      const parsed = shared.parseMarkdown(markdown, importOptions);
      const { segments, dropped } = shared.applyLimits(parsed.segments, DEFAULT_LIMITS);
      const limitedParsed = { ...parsed, segments };
      const counts = shared.segmentCounts(segments);
      broadcast({ type: "parsed", parsed: { title: parsed.title, cover: parsed.cover, counts } });

      const localImages = segments.filter((segment) => segment.type === "image" && shared.isLocalImageSource(segment.source));
      const coverSource = limitedParsed.cover || "";
      const coverSegment = coverSource && !segments.some(
        (segment) => segment.type === "image" && shared.imageSourcesMatch(segment.source, coverSource)
      )
        ? { type: "image", source: coverSource, alt: "cover" }
        : null;

      if (!(await waitForMainReady())) throw new Error("X editor bridge is not ready");
      throwIfImportCancelled();

      const coverLocalImage = coverSegment && shared.isLocalImageSource(coverSegment.source) ? coverSegment : null;
      if (localImages.length || coverLocalImage) {
        await ensureVaultForLocalImages(localImages.length + (coverLocalImage ? 1 : 0));
      }
      throwIfImportCancelled();
      const imageMap = await prepareImages(segments);
      throwIfImportCancelled();
      const coverResult = coverSegment
        ? await loadImageWithRetry(coverSegment.source, "cover")
        : null;
      throwIfImportCancelled();
      const tableMap = await prepareTables(segments);
      throwIfImportCancelled();
      const mediaFailures = collectMediaFailures(imageMap, "image")
        .concat(coverResult && !coverResult.ok ? collectMediaFailures(new Map([[coverSegment, coverResult]]), "image") : [])
        .concat(collectMediaFailures(tableMap, "table"));
      const pastePlan = shared.buildPastePlan(segments, imageMap, tableMap, {
        coverSource,
        coverResult
      });
      const filePayloads = streamImageFilesForMain(pastePlan);
      pastePlan.title = limitedParsed.title || null;
      pastePlan.cover = limitedParsed.cover || null;
      pastePlan.origin = origin;

      throwIfImportCancelled();
      showStatus("Writing into X editor...", "work");
      const mainSummary = await runMain(pastePlan, filePayloads);
      const elapsedMs = Math.round(performance.now() - startedAt);
      const summary = {
        ok: true,
        title: limitedParsed.title,
        cover: limitedParsed.cover,
        importOptions,
        counts,
        dropped,
        images: summarizeMap(imageMap),
        tables: summarizeMap(tableMap),
        mediaWarnings: summarizeMediaWarnings(mediaFailures),
        mediaFailures,
        main: mainSummary,
        elapsedMs
      };
      state.lastSummary = summary;
      broadcast({ type: "complete", summary });
      showStatus(formatCompletionMessage(summary), "done", 7000);
      return { ok: true, summary };
    } catch (error) {
      const message = error?.message || String(error);
      if (error?.cancelled) {
        showStatus(message, "warn", 5000);
        broadcast({ type: "cancelled", reason: message, mainSummary: error?.mainSummary || null });
        return { ok: false, error: message, cancelled: true, mainSummary: error?.mainSummary || null };
      }
      showStatus(message, "error", 8000);
      broadcast({ type: "error", error: message, mediaFailures: error?.mediaFailures || null, mainSummary: error?.mainSummary || null });
      return { ok: false, error: message };
    } finally {
      state.busy = false;
      state.cancelRequested = false;
      state.activeRun = null;
      state.currentMarkdown = "";
    }
  }

  async function ensureVaultForLocalImages(count) {
    const existing = await shared.getVaultRecord().catch(() => null);
    if (existing?.handle && (await shared.queryReadPermission(existing.handle)) === "granted") return;
    if (typeof window.showDirectoryPicker !== "function") {
      showStatus(`${count} local image(s) skipped: directory picker is unavailable`, "warn", 3000);
      return;
    }
    showStatus(`${count} local image(s) need a local image folder...`, "warn");
    const result = await promptVaultSelection(count);
    if (!result.ok && !result.skipped) {
      throw new Error(result.error || "Local image folder was not selected");
    }
  }

  function isRemoteHttpImageSource(source) {
    return shared.isRemoteHttpImageSource(source);
  }

  async function openSidePanelForRemoteImages() {
    await saveDraftForSidePanel();
    await safeRuntimeSendMessage({ type: "xposter:open-side-panel" }).catch(() => {});
  }

  async function saveDraftForSidePanel(markdown = "") {
    const draft = String(markdown || state.currentMarkdown || "");
    if (!draft || !chrome.storage?.local) return;
    try {
      await chrome.storage.local.set({ [SIDEPANEL_DRAFT_STORAGE_KEY]: draft });
    } catch {}
  }

  async function savePendingArticleImport(markdown = "", { fileName = "", source = "drop" } = {}) {
    const text = String(markdown || "");
    if (!text.trim() || !chrome.storage?.local) return false;
    try {
      await chrome.storage.local.set({
        [PENDING_ARTICLE_IMPORT_STORAGE_KEY]: {
          markdown: text,
          fileName,
          source,
          createdAt: Date.now()
        }
      });
      return true;
    } catch {
      return false;
    }
  }

  async function readPendingArticleImport() {
    if (!chrome.storage?.local) return null;
    const stored = await chrome.storage.local.get(PENDING_ARTICLE_IMPORT_STORAGE_KEY).catch(() => ({}));
    const pending = stored[PENDING_ARTICLE_IMPORT_STORAGE_KEY] || null;
    if (!pending?.markdown) return null;
    const expired = Date.now() - Number(pending.createdAt || 0) > PENDING_ARTICLE_IMPORT_TTL_MS;
    if (expired) {
      await chrome.storage.local.remove(PENDING_ARTICLE_IMPORT_STORAGE_KEY).catch(() => {});
      return null;
    }
    return pending;
  }

  async function takePendingArticleImport() {
    const pending = await readPendingArticleImport();
    if (!pending) return null;
    await chrome.storage.local.remove(PENDING_ARTICLE_IMPORT_STORAGE_KEY).catch(() => {});
    return pending;
  }

  async function discardPendingArticleImport() {
    if (chrome.storage?.local) {
      await chrome.storage.local.remove(PENDING_ARTICLE_IMPORT_STORAGE_KEY).catch(() => {});
    }
  }

  function promptVaultSelection(count = 0) {
    return new Promise((resolve) => {
      document.getElementById("__xposter_vault_prompt__")?.remove();
      const overlay = document.createElement("div");
      overlay.id = "__xposter_vault_prompt__";
      overlay.style.cssText = [
        "position:fixed",
        "inset:0",
        "z-index:2147483646",
        "display:grid",
        "place-items:center",
        "background:rgba(32,31,27,.48)",
        "font:14px/1.55 ui-sans-serif,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif"
      ].join(";");

      const panel = document.createElement("div");
      panel.style.cssText = [
        "width:min(440px,calc(100vw - 40px))",
        "background:#fbfaf7",
        "color:#201f1b",
        "border:1px solid #d8d2c6",
        "box-shadow:0 22px 60px rgba(32,31,27,.28)",
        "padding:22px"
      ].join(";");
      panel.innerHTML = `
        <div style="font-size:17px;font-weight:760;margin-bottom:6px;">Local image folder</div>
        <div style="color:#6b665e;margin-bottom:14px;">${shared.escapeHtml(
          count ? `${count} local image(s) need a root folder.` : "Choose the folder that contains your Markdown images."
        )}</div>
        <div style="background:#f4f0e8;border:1px solid #d8d2c6;padding:10px 12px;color:#6b665e;font-size:12px;margin-bottom:16px;">
          If your Markdown says <code>![](./img/cover.png)</code>, choose the folder that contains the <code>img</code> directory.
        </div>
        <div style="display:flex;justify-content:flex-end;gap:8px;">
          <button id="xposter-vault-skip" style="height:36px;padding:0 13px;border:1px solid #d8d2c6;background:#fbfaf7;color:#201f1b;font:inherit;font-weight:700;cursor:pointer;">Skip</button>
          <button id="xposter-vault-pick" style="height:36px;padding:0 14px;border:0;background:#2f6f68;color:#fbfaf7;font:inherit;font-weight:760;cursor:pointer;">Choose folder</button>
        </div>
      `;
      overlay.appendChild(panel);
      document.body.appendChild(overlay);

      const finish = (value) => {
        overlay.remove();
        resolve(value);
      };
      panel.querySelector("#xposter-vault-skip").addEventListener("click", () => finish({ ok: false, skipped: true }));
      panel.querySelector("#xposter-vault-pick").addEventListener("click", async () => {
        try {
          const handle = await window.showDirectoryPicker({ id: "xposter_vault_root", mode: "read" });
          const permission = await shared.ensureReadPermission(handle);
          if (permission !== "granted") {
            finish({ ok: false, error: "Read permission was not granted" });
            return;
          }
          await shared.saveVaultHandle(handle);
          showStatus(`Local image folder set: ${handle.name}`, "done", 3500);
          finish({ ok: true, name: handle.name });
        } catch (error) {
          finish(
            error?.name === "AbortError"
              ? { ok: false, skipped: true }
              : { ok: false, error: error?.message || String(error) }
          );
        }
      });
    });
  }

  async function prepareImages(segments) {
    const images = segments.filter((segment) => segment.type === "image");
    const map = new Map();
    if (!images.length) return map;
    showStatus(`Preparing ${images.length} image(s)...`, "work");
    const concurrency = 3;
    let next = 0;
    let completed = 0;
    const worker = async () => {
      while (next < images.length) {
        throwIfImportCancelled();
        const index = next;
        next += 1;
        const segment = images[index];
        showStatus(`Preparing image ${index + 1}/${images.length}...`, "work");
        map.set(segment, await loadImageWithRetry(segment.source, `image-${index + 1}`));
        throwIfImportCancelled();
        completed += 1;
        showStatus(`Prepared ${completed}/${images.length} image(s)...`, "work");
        await sleep(120);
      }
    };
    const workers = [];
    for (let index = 0; index < Math.min(concurrency, images.length); index += 1) {
      workers.push(worker());
    }
    await Promise.all(workers);
    return new Map(images.map((segment) => [segment, map.get(segment)]));
  }

  function streamImageFilesForMain(pastePlan) {
    const filePayloads = new Map();
    for (const item of pastePlan.plan || []) {
      if (item?.op?.type !== "image" || !item.op.file?.base64) continue;
      const token = item.marker;
      filePayloads.set(token, item.op.file);
      item.op.file = {
        token,
        mime: item.op.file.mime,
        fileName: item.op.file.fileName,
        alt: item.op.file.alt || "",
        bytes: item.op.file.bytes || null
      };
    }
    return filePayloads;
  }

  async function loadImageWithRetry(source, fallbackName, attempts = 4) {
    let last = null;
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      throwIfImportCancelled();
      last = await loadImage(source, fallbackName);
      if (last?.ok) return last;
      if (attempt < attempts && isRetryableImageError(last?.error)) {
        showStatus(`Retrying image ${fallbackName.replace("image-", "")}...`, "warn");
        await sleep(800 * attempt * attempt);
        continue;
      }
      break;
    }
    return last || { ok: false, error: "Image fetch failed", source };
  }

  function isRetryableImageError(error) {
    return /fetch failed|timed out|timeout|network|HTTP 429|HTTP 500|HTTP 502|HTTP 503|HTTP 504/i.test(String(error || ""));
  }

  async function loadImage(source, fallbackName) {
    throwIfImportCancelled();
    if (source.startsWith("data:")) {
      const parsed = shared.parseDataUri(source);
      return parsed.ok
        ? { ok: true, ...parsed, fileName: `${fallbackName}.png`, source }
        : { ok: false, error: parsed.error, source };
    }
    if (shared.isLocalImageSource(source)) {
      return shared.resolveLocalImage(source);
    }
    if (!shared.isRemoteHttpImageSource(source)) {
      return {
        ok: false,
        error: "Private network image URLs are not downloaded by xPoster. Use a public image URL or a selected local image folder.",
        source,
        origin: imageOrigin(source)
      };
    }
    try {
      const result = await safeRuntimeSendMessage({ type: "xposter:fetch-image", url: source });
      throwIfImportCancelled();
      if (!result?.ok) {
        return {
          ok: false,
          error: result?.contextInvalidated ? "xPoster was reloaded. Refresh this X Article tab, then write again." : result?.error || "Image fetch failed",
          source,
          origin: result?.origin || imageOrigin(source)
        };
      }
      return {
        ok: true,
        base64: result.base64,
        mime: result.mime,
        fileName: normalizeImageFileName(result.fileName || shared.guessFileName(source, fallbackName), fallbackName, result.mime),
        bytes: result.bytes,
        source
      };
    } catch (error) {
      return { ok: false, error: error?.message || String(error), source };
    }
  }

  async function prepareTables(segments) {
    const tables = segments.filter((segment) => segment.type === "table");
    const map = new Map();
    if (!tables.length) return map;
    showStatus(`Rendering ${tables.length} table(s)...`, "work");
    await Promise.all(
      tables.map(async (segment, index) => {
        try {
          throwIfImportCancelled();
          map.set(segment, await shared.renderTableImage(segment, `table-${index + 1}.png`));
          throwIfImportCancelled();
        } catch (error) {
          if (error?.cancelled) throw error;
          map.set(segment, { ok: false, error: error?.message || String(error) });
        }
      })
    );
    return map;
  }

  function summarizeMap(map) {
    let ok = 0;
    let fail = 0;
    for (const value of map.values()) {
      if (value?.ok) ok += 1;
      else fail += 1;
    }
    return { ok, fail };
  }

  function collectMediaFailures(map, kind) {
    const failures = [];
    let index = 0;
    for (const [segment, value] of map.entries()) {
      index += 1;
      if (value?.ok) continue;
      failures.push({
        kind,
        index,
        source: segment?.source || null,
        origin: imageOrigin(segment?.source),
        fileName: shared.guessFileName(segment?.source || "", `${kind}-${index}`),
        error: value?.error || `${kind} preparation failed`
      });
    }
    return failures;
  }

  function summarizeMediaWarnings(failures = []) {
    const byKind = failures.reduce(
      (summary, failure) => {
        if (failure.kind === "table") summary.tables += 1;
        else summary.images += 1;
        return summary;
      },
      { images: 0, tables: 0 }
    );
    return {
      total: failures.length,
      ...byKind,
      first: failures[0] || null
    };
  }

  function formatCompletionMessage(summary) {
    const warnings = summary?.mediaWarnings || {};
    const uploadFailures = Number(summary?.main?.imgFail || 0);
    const uploadTimeouts = Number(summary?.main?.imageErrors?.filter((error) => /upload took too long|timed out|timeout/i.test(error?.error || "")).length || 0);
    const elapsed = summary?.elapsedMs ? ` in ${(summary.elapsedMs / 1000).toFixed(1)}s` : "";
    const skippedImages = Number(warnings.images || 0) + uploadFailures;
    const skippedTables = Number(warnings.tables || 0);
    if (uploadTimeouts) {
      return `Article written${elapsed}. ${uploadTimeouts} image upload(s) timed out in X. Wait a moment, then write again or split the article if it has many images.`;
    }
    if (skippedImages || skippedTables) {
      const parts = [];
      if (skippedImages) {
        parts.push(`${skippedImages} web image(s) stayed as Markdown links`);
      }
      if (skippedTables) parts.push(`${skippedTables} table(s) kept as Markdown`);
      const recovery = skippedImages
        ? " Replace unreachable image URLs with public links, then write again if those images must upload."
        : "";
      return `Article written${elapsed}. ${parts.join("; ")}.${recovery}`;
    }
    return `Article written${elapsed}.`;
  }

  function imageOrigin(source) {
    try {
      const url = new URL(String(source || ""));
      return url.protocol === "http:" || url.protocol === "https:" ? url.origin : null;
    } catch {
      return null;
    }
  }

  function hostLabel(origin) {
    try {
      return new URL(origin).host || origin;
    } catch {
      return String(origin || "image website");
    }
  }

  function normalizeImageFileName(fileName, fallbackName, mime = "image/png") {
    const extFromMime = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/webp": "webp",
      "image/svg+xml": "svg",
      "image/avif": "avif"
    }[String(mime || "").toLowerCase()];
    const raw = String(fileName || "").split(/[?#]/)[0].split(/[\\/]/).filter(Boolean).pop() || "";
    let decoded = raw;
    try {
      decoded = decodeURIComponent(raw);
    } catch {}
    const ext = (decoded.match(/\.([a-z0-9]{2,5})$/i)?.[1] || extFromMime || "png").toLowerCase();
    const base = decoded
      .replace(/\.[a-z0-9]{2,5}$/i, "")
      .normalize("NFKD")
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48);
    return `${base || fallbackName}.${ext}`;
  }

  async function onPaste(event) {
    if (!isArticleRoute()) return;
    const editor = event.target?.closest?.(".public-DraftEditor-content");
    if (!editor || editor.getBoundingClientRect().width < 200) return;
    const text = event.clipboardData?.getData("text/plain") || "";
    if (!shared.looksLikeMarkdown(text)) return;
    event.preventDefault();
    event.stopPropagation();
    await importMarkdown(text, "paste");
  }

  async function readMarkdownFile(file) {
    if (!/\.(md|markdown|mdown|mkd|txt)$/i.test(file.name)) {
      throw new Error("Choose a Markdown file");
    }
    return file.text();
  }

  async function importFile(file, origin = "file") {
    const text = await readMarkdownFile(file);
    await ensureEditorReadyForFileImport();
    return importMarkdown(text, origin);
  }

  async function openArticlePageForPendingImport(markdown = "", source = "drop") {
    const result = await safeRuntimeSendMessage({ type: "xposter:open-articles" }).catch((error) => ({
      ok: false,
      error: error?.message || String(error)
    }));
    if (!result?.ok) {
      throw new Error(result?.error || "Could not open X Articles");
    }
    if (!isArticleRoute()) {
      return { ok: true, pendingNavigation: true };
    }
    await ensureEditorReadyForFileImport();
    const pending = await takePendingArticleImport();
    return importMarkdown(pending?.markdown || markdown, pending?.source || source);
  }

  async function stageSingleMarkdownForArticle(markdown, { fileName = "", source = "drop" } = {}) {
    const text = String(markdown || "");
    if (!text.trim()) {
      showStatus("Drop a Markdown file or Markdown text.", "warn", 5000);
      return { ok: false, error: "No Markdown content" };
    }
    const stored = await savePendingArticleImport(text, { fileName, source });
    showStatus("Opening X Article...", "work");
    try {
      if (!stored) {
        await ensureEditorReadyForFileImport();
        return importMarkdown(text, source);
      }
      if (isArticleRoute()) {
        await ensureEditorReadyForFileImport();
        const pending = await takePendingArticleImport();
        return importMarkdown(pending?.markdown || text, source);
      }
      return openArticlePageForPendingImport(text, source);
    } catch (error) {
      if (isArticleRoute()) await discardPendingArticleImport();
      showStatus(error?.message || "Could not open X Article", "error", 7000);
      return { ok: false, error: error?.message || String(error) };
    }
  }

  async function importSingleMarkdownFileFromDrop(file) {
    const markdown = await readMarkdownFile(file);
    return stageSingleMarkdownForArticle(markdown, { fileName: file.name || "", source: "drop" });
  }

  async function resumePendingArticleImport() {
    if (!isArticleRoute()) return;
    const pending = await readPendingArticleImport();
    if (!pending?.markdown) return;
    showStatus("Opening X Article...", "work");
    try {
      await ensureEditorReadyForFileImport();
      const stored = await takePendingArticleImport();
      await importMarkdown(stored?.markdown || pending.markdown, pending.source || "drop");
    } catch (error) {
      showStatus(error?.message || "Could not write dropped Markdown", "error", 7000);
    }
  }

  function queueItemId(prefix = "queue") {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function markdownTitleForQueue(markdown, fallback = "Untitled Markdown") {
    try {
      const parsed = shared.parseMarkdown(markdown || "");
      if (parsed?.title) return parsed.title;
    } catch {}
    const heading = String(markdown || "").match(/^\s*#\s+(.+)$/m)?.[1]?.trim();
    return heading || fallback;
  }

  async function readMarkdownFilesForQueue(files) {
    const items = [];
    for (const file of files.filter(isMarkdownFile)) {
      const markdown = await readMarkdownFile(file);
      if (!markdown.trim()) continue;
      items.push({
        id: queueItemId("queue-drop"),
        fileName: file.name || "",
        title: markdownTitleForQueue(markdown, file.name || "Untitled Markdown"),
        markdown,
        characters: markdown.length,
        status: "queued",
        addedAt: new Date().toISOString(),
        loadedAt: null,
        writtenAt: null,
        source: "x-drop"
      });
    }
    return items;
  }

  function utf8Size(value) {
    return new Blob([String(value || "")]).size;
  }

  function queueItemStorageSize(item) {
    return utf8Size(JSON.stringify(item || {}));
  }

  function trimQueueForStorage(items, maxBytes = MAX_SIDEPANEL_QUEUE_STORAGE_BYTES) {
    const kept = [];
    let totalBytes = 2;
    for (let index = items.length - 1; index >= 0; index -= 1) {
      const item = items[index];
      const itemBytes = queueItemStorageSize(item);
      if (itemBytes > MAX_SIDEPANEL_QUEUE_ITEM_BYTES) continue;
      if (totalBytes + itemBytes > maxBytes) continue;
      kept.unshift(item);
      totalBytes += itemBytes;
    }
    return kept;
  }

  async function saveMarkdownQueueForSidePanel(items) {
    if (!items.length || !chrome.storage?.local) return [];
    const stored = await chrome.storage.local.get(SIDEPANEL_QUEUE_STORAGE_KEY).catch(() => ({}));
    const existing = Array.isArray(stored[SIDEPANEL_QUEUE_STORAGE_KEY])
      ? stored[SIDEPANEL_QUEUE_STORAGE_KEY].filter((item) => item?.markdown)
      : [];
    const known = new Set(existing.map((item) => `${item.fileName || ""}\n${item.markdown || ""}`));
    const nextItems = items
      .filter((item) => queueItemStorageSize(item) <= MAX_SIDEPANEL_QUEUE_ITEM_BYTES)
      .filter((item) => !known.has(`${item.fileName || ""}\n${item.markdown || ""}`));
    const nextQueue = trimQueueForStorage([...existing, ...nextItems].slice(-MAX_SIDEPANEL_QUEUE_ITEMS));
    const queuedIds = new Set(nextQueue.map((item) => item.id));
    const savedItems = nextItems.filter((item) => queuedIds.has(item.id));
    if (!savedItems.length) return [];
    try {
      await chrome.storage.local.set({ [SIDEPANEL_QUEUE_STORAGE_KEY]: nextQueue });
      return savedItems;
    } catch {
      const fallbackQueue = trimQueueForStorage(savedItems);
      if (!fallbackQueue.length) return [];
      await chrome.storage.local.set({ [SIDEPANEL_QUEUE_STORAGE_KEY]: fallbackQueue });
      return fallbackQueue;
    }
  }

  async function queueMarkdownFilesForSidePanel(markdownFiles, { openPanelPromise = null } = {}) {
    const panelPromise = openPanelPromise || safeRuntimeSendMessage({ type: "xposter:open-side-panel" }).catch(() => {});
    const added = await saveMarkdownQueueForSidePanel(await readMarkdownFilesForQueue(markdownFiles));
    await panelPromise;
    showStatus(
      added.length
        ? `Added ${added.length} Markdown draft${added.length === 1 ? "" : "s"} to the side panel.`
        : "These Markdown files were already queued or too large to save together.",
      added.length ? "queue" : "warn",
      6000
    );
    return added;
  }

  function isImageFile(file) {
    return Boolean(file && /^image\//i.test(file.type || ""));
  }

  function imageFilesFromTransfer(dataTransfer) {
    return Array.from(dataTransfer?.files || []).filter(isImageFile);
  }

  function safeTransferData(dataTransfer, type) {
    try {
      return dataTransfer?.getData?.(type) || "";
    } catch {
      return "";
    }
  }

  function cleanDroppedUrl(value) {
    return String(value || "")
      .trim()
      .replace(/^<|>$/g, "")
      .replace(/^['"]|['"]$/g, "");
  }

  function isSupportedDroppedImageUrl(value, explicitImage = false) {
    const source = cleanDroppedUrl(value);
    if (/^data:image\//i.test(source)) return true;
    if (!/^https?:\/\//i.test(source)) return false;
    if (explicitImage) return true;
    try {
      const url = new URL(source);
      const path = decodeURIComponent(url.pathname || "");
      const responseType = url.searchParams.get("response-content-type") || url.searchParams.get("content-type") || "";
      return /\.(png|jpe?g|gif|webp|avif|bmp|svg)(?:$|[?#])/i.test(path) || /^image\//i.test(responseType);
    } catch {
      return /\.(png|jpe?g|gif|webp|avif|bmp|svg)(?:$|[?#])/i.test(source);
    }
  }

  function imageUrlFromHtml(html) {
    const match = String(html || "").match(/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/i);
    return match && isSupportedDroppedImageUrl(match[1], true) ? cleanDroppedUrl(match[1]) : "";
  }

  function imageUrlFromText(text) {
    const raw = String(text || "").trim();
    if (!raw) return "";
    const markdownImage = raw.match(/!\[[^\]]*]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/);
    if (markdownImage && isSupportedDroppedImageUrl(markdownImage[1], true)) return cleanDroppedUrl(markdownImage[1]);
    const htmlImage = imageUrlFromHtml(raw);
    if (htmlImage) return htmlImage;
    const lines = raw
      .split(/\r?\n/)
      .map((line) => cleanDroppedUrl(line))
      .filter((line) => line && !line.startsWith("#"));
    return lines.find((line) => isSupportedDroppedImageUrl(line)) || "";
  }

  function imageUrlFromTransfer(dataTransfer) {
    const htmlImage = imageUrlFromHtml(safeTransferData(dataTransfer, "text/html"));
    if (htmlImage) return htmlImage;
    const uriImage = imageUrlFromText(safeTransferData(dataTransfer, "text/uri-list"));
    if (uriImage) return uriImage;
    return imageUrlFromText(safeTransferData(dataTransfer, "text/plain"));
  }

  function transferMayContainImageUrl(dataTransfer) {
    const types = Array.from(dataTransfer?.types || []);
    return types.includes("text/uri-list") || types.includes("text/html");
  }

  async function imageFilePayload(file) {
    const buffer = await file.arrayBuffer();
    return {
      base64: shared.arrayBufferToBase64(buffer),
      mime: file.type || shared.extensionMime(file.name || "image.png"),
      fileName: file.name || `image-${Date.now()}.png`,
      bytes: buffer.byteLength
    };
  }

  function runMainUploadFiles(files) {
    return new Promise((resolve, reject) => {
      const requestId = `upload_${Math.random().toString(36).slice(2, 10)}`;
      const timeout = window.setTimeout(() => {
        window.removeEventListener("message", listener);
        reject(new Error("X editor bridge did not respond"));
      }, 45000);
      const listener = (event) => {
        if (event.source !== window || event.data?.source !== CHANNEL_FROM_MAIN) return;
        const message = event.data;
        if (message.requestId !== requestId) return;
        if (message.kind === "upload-files-done") {
          clearTimeout(timeout);
          window.removeEventListener("message", listener);
          resolve(message.summary || {});
          return;
        }
        if (message.kind === "upload-files-error") {
          clearTimeout(timeout);
          window.removeEventListener("message", listener);
          reject(new Error(message.error || "X image upload failed"));
        }
      };
      window.addEventListener("message", listener);
      window.postMessage({ source: CHANNEL_TO_MAIN, kind: "upload-files", requestId, files }, "*");
    });
  }

  async function uploadPreparedImages(payloads, label = "dropped image") {
    if (!payloads.length) return { ok: false, error: "No image data found" };
    if (state.busy) return { ok: false, error: "Import already running" };
    state.busy = true;
    try {
      if (!isArticleRoute()) throw new Error("Open X Articles first");
      await ensureEditorReadyForFileImport();
      if (!(await waitForMainReady())) throw new Error("X editor bridge is not ready");
      showStatus(`Adding ${payloads.length} ${label}${payloads.length > 1 ? "s" : ""}...`, "work");
      const summary = await runMainUploadFiles(payloads);
      const message = `${summary.count || payloads.length} image(s) handed to X's uploader.`;
      showStatus(message, "done", 5000);
      broadcast({ type: "status", text: message, level: "done" });
      return { ok: true, summary };
    } catch (error) {
      const message = error?.message || String(error);
      showStatus(message, "error", 7000);
      broadcast({ type: "error", error: message });
      return { ok: false, error: message };
    } finally {
      state.busy = false;
    }
  }

  async function uploadDroppedImages(files) {
    if (!files.length) return { ok: false, error: "No image file found" };
    const payloads = await Promise.all(files.map(imageFilePayload));
    return uploadPreparedImages(payloads, "dropped image");
  }

  async function uploadDroppedImageUrl(url) {
    const source = cleanDroppedUrl(url);
    if (!source) return { ok: false, error: "No image link found" };
    if (state.busy) return { ok: false, error: "Import already running" };
    state.busy = true;
    try {
      if (!isArticleRoute()) throw new Error("Open X Articles first");
      await ensureEditorReadyForFileImport();
      if (!(await waitForMainReady())) throw new Error("X editor bridge is not ready");
      showStatus("Downloading dropped image...", "work");
      const result = await loadImageWithRetry(source, "dropped-image", 2);
      if (!result?.ok) {
        throw new Error(result?.error || "Could not download the dropped image");
      }
      showStatus("Adding image to the X article...", "work");
      const summary = await runMainUploadFiles([
        {
          base64: result.base64,
          mime: result.mime,
          fileName: normalizeImageFileName(result.fileName || shared.guessFileName(source, "dropped-image"), "dropped-image", result.mime),
          bytes: result.bytes,
          source
        }
      ]);
      const message = `${summary.count || 1} image handed to X's uploader.`;
      showStatus(message, "done", 5000);
      broadcast({ type: "status", text: message, level: "done" });
      return { ok: true, summary };
    } catch (error) {
      const message = error?.message || String(error);
      showStatus(message, "error", 8000);
      broadcast({ type: "error", error: message });
      return { ok: false, error: message };
    } finally {
      state.busy = false;
    }
  }

  async function ensureEditorReadyForFileImport() {
    if (isEditorRoute() && findEditor()) return;
    if (isEditorRoute()) await navigateToArticleList();
    if (!isArticleRoute()) {
      history.pushState(null, "", "/compose/articles");
      window.dispatchEvent(new PopStateEvent("popstate"));
      await waitForUrl(/\/compose\/articles(?:$|[/?#])/, 4000);
    }
    await clickCreateButton();
    const ready = await waitForEditor(20000);
    if (!ready) throw new Error("X Article editor did not appear");
  }

  async function navigateToArticleList() {
    const link = Array.from(document.querySelectorAll("a[href='/compose/articles'], a[href$='/compose/articles']")).find(
      (element) => element.offsetParent
    );
    if (link) {
      link.click();
      if (await waitForUrl(/\/compose\/articles(?:$|[/?#])/, 5000)) return;
    }
    history.pushState(null, "", "/compose/articles");
    window.dispatchEvent(new PopStateEvent("popstate"));
    await waitForUrl(/\/compose\/articles(?:$|[/?#])/, 4000);
  }

  async function clickCreateButton() {
    const labels = ["create", "compose", "撰写", "新建", "创建", "新規", "作成"];
    for (let attempt = 0; attempt < 30; attempt += 1) {
      const button = findCreateButton(labels);
      if (button) {
        button.click();
        return true;
      }
      await sleep(250);
    }
    throw new Error("Could not find the X Article create button");
  }

  function findCreateButton(labels) {
    const emptyStateButton = document.querySelector("a[data-testid='empty_state_button_text']");
    if (emptyStateButton) return emptyStateButton;
    const root = document.getElementById("root-header")?.closest("div")?.parentElement || document;
    for (const path of root.querySelectorAll("button svg path")) {
      if ((path.getAttribute("d") || "").startsWith("M14.543")) {
        const button = path.closest("button");
        if (button && button.id !== IMPORT_BUTTON_ID) return button;
      }
    }
    for (const button of document.querySelectorAll("button, a[role='button']")) {
      if (button.id === IMPORT_BUTTON_ID) continue;
      const aria = (button.getAttribute("aria-label") || "").toLowerCase().trim();
      if (labels.includes(aria)) return button;
    }
    return null;
  }

  function findEditor() {
    const editor = document.querySelector(".public-DraftEditor-content");
    return editor && editor.getBoundingClientRect().width > 200 ? editor : null;
  }

  function waitForEditor(timeoutMs) {
    return new Promise((resolve) => {
      const deadline = Date.now() + timeoutMs;
      const tick = () => {
        if (findEditor()) {
          resolve(true);
          return;
        }
        if (Date.now() > deadline) {
          resolve(false);
          return;
        }
        window.setTimeout(tick, 250);
      };
      tick();
    });
  }

  function waitForUrl(pattern, timeoutMs) {
    return new Promise((resolve) => {
      const deadline = Date.now() + timeoutMs;
      const tick = () => {
        if (pattern.test(location.href) && !isEditorRoute()) {
          resolve(true);
          return;
        }
        if (Date.now() > deadline) {
          resolve(false);
          return;
        }
        window.setTimeout(tick, 200);
      };
      tick();
    });
  }

  function sleep(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function isArticleExportRoute() {
    return /^https:\/\/(?:x|twitter)\.com\/[^/?#]+\/status\/\d+(?:$|[/?#])/.test(location.href) && !isArticleRoute();
  }

  function scheduleArticleExportSync(delay = 160) {
    window.clearTimeout(state.articleExport.syncTimer);
    state.articleExport.syncTimer = window.setTimeout(syncArticleExportButton, delay);
  }

  function installArticleExportButton() {
    injectArticleExportStyles();
    restoreArticleExportSettings().catch(() => applyArticleExportSettings());
    installArticleExportSettingsSync();
    const observer = new MutationObserver(() => scheduleArticleExportSync());
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("popstate", () => scheduleArticleExportSync(260));
    window.addEventListener("resize", () => scheduleArticleExportSync(260), { passive: true });
    scheduleArticleExportSync(500);
  }

  function syncArticleExportButton() {
    if (!state.articleExport.enabled || !isArticleExportRoute()) {
      removeArticleExportButton();
      return;
    }
    const article = extractReadableXArticle();
    if (!article) {
      removeArticleExportButton();
      return;
    }
    const root = ensureArticleExportRoot(article.container);
    if (!root) return;
    root.dataset.articleTitle = article.title || "";
    root.dataset.articleMarkdown = article.markdown;
    root.dataset.articleFileName = articleFileName(article.title);
    root.dataset.mode = normalizeArticleExportMode(state.articleExport.mode);
    updateArticleExportButtonMode();
  }

  function removeArticleExportButton() {
    document.querySelectorAll("[data-xposter-article-export-host]").forEach((node) => {
      node.removeAttribute("data-xposter-article-export-host");
    });
    state.articleExport.root = null;
    document.getElementById(ARTICLE_EXPORT_ID)?.remove();
  }

  function ensureArticleExportRoot(container) {
    if (!container?.isConnected) return null;
    let root = document.getElementById(ARTICLE_EXPORT_ID);
    if (!root) {
      root = document.createElement("div");
      root.id = ARTICLE_EXPORT_ID;
      root.dataset.motion = "entered";
      root.innerHTML = `
        <button class="__xposter_article_export_main" type="button"></button>
        <button class="__xposter_article_export_toggle" type="button" aria-haspopup="menu" aria-expanded="false">▾</button>
        <div class="__xposter_article_export_menu" role="menu" hidden>
          <button type="button" role="menuitem" data-export-mode="copy"></button>
          <button type="button" role="menuitem" data-export-mode="download"></button>
        </div>
      `;
      root.querySelector(".__xposter_article_export_main")?.addEventListener("click", handleArticleExportMainClick);
      root.querySelector(".__xposter_article_export_toggle")?.addEventListener("click", toggleArticleExportMenu);
      root.querySelector(".__xposter_article_export_menu")?.addEventListener("click", handleArticleExportMenuClick);
      if (!state.articleExport.documentListenersInstalled) {
        document.addEventListener("click", closeArticleExportMenuOnOutside, true);
        document.addEventListener("keydown", closeArticleExportMenuOnKeydown, true);
        state.articleExport.documentListenersInstalled = true;
      }
      window.setTimeout(() => {
        if (root.isConnected && root.dataset.motion === "entered") delete root.dataset.motion;
      }, 320);
    }
    if (root.parentElement !== container) root.parentElement?.removeAttribute("data-xposter-article-export-host");
    container.dataset.xposterArticleExportHost = "true";
    if (root.parentElement !== container) container.appendChild(root);
    state.articleExport.root = root;
    return root;
  }

  function updateArticleExportButtonMode() {
    const root = document.getElementById(ARTICLE_EXPORT_ID);
    if (!root) return;
    const mode = normalizeArticleExportMode(state.articleExport.mode);
    root.dataset.mode = mode;
    const main = root.querySelector(".__xposter_article_export_main");
    const title = articleExportLabel(mode);
    if (main) {
      main.textContent = translateContentText("MD");
      main.title = title;
      main.setAttribute("aria-label", title);
    }
    const toggle = root.querySelector(".__xposter_article_export_toggle");
    if (toggle) toggle.setAttribute("aria-label", translateContentText("Markdown export action"));
    root.querySelectorAll("[data-export-mode]").forEach((button) => {
      button.setAttribute("aria-checked", String(button.dataset.exportMode === mode));
      button.textContent = articleExportLabel(button.dataset.exportMode);
    });
  }

  async function handleArticleExportMainClick() {
    const root = document.getElementById(ARTICLE_EXPORT_ID);
    const article = articleExportPayload(root);
    if (!article.markdown) {
      signalArticleExportFeedback(root, "warn");
      transientStatus("No readable article text found.", "warn", 3500);
      return;
    }
    try {
      if (normalizeArticleExportMode(state.articleExport.mode) === "download") {
        downloadMarkdown(article.markdown, article.fileName);
        transientStatus("Markdown saved.", "export", 3000);
      } else {
        await copyText(article.markdown);
        transientStatus("Markdown copied.", "export", 3000);
      }
      signalArticleExportFeedback(root, "done");
    } catch (error) {
      signalArticleExportFeedback(root, "error");
      transientStatus(error?.message || "Could not export Markdown", "error", 5000);
    } finally {
      closeArticleExportMenu();
    }
  }

  function articleExportPayload(root) {
    return {
      markdown: String(root?.dataset.articleMarkdown || ""),
      fileName: root?.dataset.articleFileName || articleFileName(root?.dataset.articleTitle || "")
    };
  }

  async function copyText(text) {
    if (!navigator.clipboard?.writeText) throw new Error("Clipboard is not available.");
    await navigator.clipboard.writeText(text);
  }

  function downloadMarkdown(markdown, fileName) {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || articleFileName("");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1200);
  }

  function toggleArticleExportMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    const root = document.getElementById(ARTICLE_EXPORT_ID);
    const menu = root?.querySelector(".__xposter_article_export_menu");
    const toggle = root?.querySelector(".__xposter_article_export_toggle");
    if (!menu || !toggle) return;
    const open = menu.hidden;
    menu.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    if (open) menu.querySelector("[aria-checked='true'], button")?.focus?.();
  }

  async function handleArticleExportMenuClick(event) {
    const button = event.target.closest("[data-export-mode]");
    if (!button) return;
    event.preventDefault();
    await setArticleExportMode(button.dataset.exportMode);
    signalArticleExportFeedback(document.getElementById(ARTICLE_EXPORT_ID), "mode");
    closeArticleExportMenu();
  }

  function signalArticleExportFeedback(root, tone = "done") {
    if (!root) return;
    window.clearTimeout(state.articleExport.feedbackTimer);
    delete root.dataset.feedback;
    void root.offsetWidth;
    root.dataset.feedback = tone;
    state.articleExport.feedbackTimer = window.setTimeout(() => {
      if (root.isConnected && root.dataset.feedback === tone) delete root.dataset.feedback;
    }, 900);
  }

  function closeArticleExportMenu() {
    const root = document.getElementById(ARTICLE_EXPORT_ID);
    const menu = root?.querySelector(".__xposter_article_export_menu");
    const toggle = root?.querySelector(".__xposter_article_export_toggle");
    if (menu) menu.hidden = true;
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  function closeArticleExportMenuOnOutside(event) {
    const root = document.getElementById(ARTICLE_EXPORT_ID);
    if (!root || root.contains(event.target)) return;
    closeArticleExportMenu();
  }

  function closeArticleExportMenuOnKeydown(event) {
    if (event.key === "Escape") closeArticleExportMenu();
  }

  function extractReadableXArticle() {
    return Array.from(document.querySelectorAll("article, main [data-testid='tweetText'], main div[lang]"))
      .map(articleExportCandidate)
      .filter(Boolean)
      .reduce((best, candidate) => {
        const score = scoreArticleExportCandidate(candidate);
        if (score < ARTICLE_EXPORT_MIN_SCORE || score <= (best?.score || 0)) return best;
        return { score, article: candidate };
      }, null)?.article || null;
  }

  function articleExportCandidate(element) {
    const container = articleExportContainer(element);
    if (!container || container.closest(`#${ARTICLE_EXPORT_ID}`)) return null;
    const parts = articleMarkdownParts(container);
    const title = detectArticleExportTitle(container, parts);
    const markdown = normalizeMarkdownLines([
      title ? `# ${escapeMarkdownInline(title)}` : "",
      ...parts.filter((part) => normalizeText(part).toLowerCase() !== normalizeText(title).toLowerCase())
    ]);
    const textLength = normalizeText(markdown).length;
    if (textLength < 180 && parts.length < 3) return null;
    return {
      container,
      title,
      markdown,
      parts,
      textLength,
      imageCount: (markdown.match(/^!\[/gm) || []).length,
      linkCount: (markdown.match(/\]\(https?:\/\//g) || []).length
    };
  }

  function articleExportContainer(element) {
    let best = element.closest("article") || element;
    for (let node = element; node && node !== document.body; node = node.parentElement) {
      if (!node.matches?.("article, main article, [data-testid='cellInnerDiv'], section, div")) continue;
      const rect = node.getBoundingClientRect?.();
      if (!rect || rect.width < 320 || rect.height < 160) continue;
      const textLength = normalizeText(node.innerText || node.textContent || "").length;
      const currentLength = normalizeText(best.innerText || best.textContent || "").length;
      if (textLength >= currentLength && textLength <= 28000) best = node;
      if (node.matches?.("article")) break;
    }
    return best;
  }

  function scoreArticleExportCandidate(candidate) {
    return candidate.textLength / 80 +
      candidate.parts.length * 2 +
      candidate.imageCount * 2 +
      candidate.linkCount +
      (candidate.title ? 8 : 0);
  }

  function detectArticleExportTitle(container, parts = []) {
    const heading = Array.from(container.querySelectorAll("h1, h2, [role='heading']"))
      .map((node) => normalizeText(node.innerText || node.textContent || ""))
      .find((text) => text && !/^post$|^article$/i.test(text));
    if (heading) return heading;
    const first = normalizeText(parts.find((part) => part && !part.startsWith("![")) || "");
    if (first && first.length <= 140) return first.replace(/^#+\s*/, "");
    const title = normalizeText(document.title || "").replace(/\s*[\|/].*$/, "").replace(/\s+on X$/, "");
    return title && !/^x$/i.test(title) ? title : "";
  }

  function articleMarkdownParts(root) {
    const parts = [];
    const seen = new Set();
    const selector = "h1, h2, h3, h4, h5, h6, p, blockquote, pre, ul, ol, img, figcaption, [data-testid='tweetText'], div[lang]";
    const nodes = [
      ...(root.matches?.(selector) ? [root] : []),
      ...Array.from(root.querySelectorAll(selector))
    ];
    for (const node of nodes) {
      if (node.closest?.(`#${ARTICLE_EXPORT_ID}, [role='button'], button, nav, time, [aria-label*='analytics' i]`)) continue;
      if (nodes.some((other) => other !== node && other.contains(node) && markdownNodeConsumesChildren(other))) continue;
      const part = markdownForArticleNode(node);
      const key = normalizeText(part);
      if (!part || !key || seen.has(key)) continue;
      seen.add(key);
      parts.push(part);
    }
    return parts;
  }

  function markdownNodeConsumesChildren(node) {
    const tag = node.tagName?.toLowerCase() || "";
    return tag === "blockquote" || tag === "pre" || tag === "ul" || tag === "ol" || node.matches?.("[data-testid='tweetText'], div[lang]");
  }

  function markdownForArticleNode(node) {
    const tag = node.tagName?.toLowerCase() || "";
    if (/^h[1-6]$/.test(tag)) return `${"#".repeat(Number(tag[1]))} ${inlineMarkdown(node)}`;
    if (tag === "blockquote") return inlineMarkdown(node).split(/\n+/).map((line) => `> ${line}`).join("\n");
    if (tag === "pre") return fencedMarkdown(node.innerText || node.textContent || "");
    if (tag === "img") return imageMarkdown(node);
    if (tag === "ul" || tag === "ol") return listMarkdown(node, tag === "ol");
    if (tag === "p" || tag === "figcaption" || node.matches?.("[data-testid='tweetText'], div[lang]")) {
      return inlineMarkdown(node);
    }
    if (node.children?.length) return "";
    return "";
  }

  function listMarkdown(list, ordered = false) {
    return Array.from(list.children || [])
      .filter((child) => child.tagName?.toLowerCase() === "li")
      .map((child, index) => `${ordered ? `${index + 1}.` : "-"} ${inlineMarkdown(child)}`)
      .join("\n");
  }

  function fencedMarkdown(text) {
    const body = String(text || "").replace(/\n{3,}/g, "\n\n").trim();
    return body ? `\`\`\`\n${body}\n\`\`\`` : "";
  }

  function imageMarkdown(image) {
    const src = image.currentSrc || image.src || image.getAttribute("src") || "";
    if (!src || /^data:/i.test(src)) return "";
    if (/profile_images|emoji|avatar/i.test(src)) return "";
    const alt = normalizeText(image.alt || image.getAttribute("aria-label") || "image");
    return `![${escapeMarkdownAlt(alt || "image")}](${src})`;
  }

  function inlineMarkdown(root) {
    const output = [];
    const walk = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        output.push(escapeMarkdownInline(node.textContent || ""));
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      if (node.closest?.(`#${ARTICLE_EXPORT_ID}`)) return;
      const tag = node.tagName?.toLowerCase() || "";
      if (tag === "br") {
        output.push("\n");
        return;
      }
      if (tag === "img") {
        const markdown = imageMarkdown(node);
        if (markdown) output.push(markdown);
        return;
      }
      if (tag === "a") {
        const linkParts = [];
        const capture = (child) => {
          const before = output.length;
          walk(child);
          linkParts.push(output.splice(before).join(""));
        };
        node.childNodes.forEach(capture);
        const text = normalizeMarkdownWhitespace(linkParts.join("")) || escapeMarkdownInline(normalizeText(node.textContent || ""));
        const href = cleanArticleHref(node.getAttribute("href") || node.href || "");
        output.push(href ? `[${text || href}](${href})` : text);
        return;
      }
      if (tag === "strong" || tag === "b") {
        output.push("**");
        node.childNodes.forEach(walk);
        output.push("**");
        return;
      }
      if (tag === "em" || tag === "i") {
        output.push("*");
        node.childNodes.forEach(walk);
        output.push("*");
        return;
      }
      if (tag === "code") {
        output.push(`\`${normalizeText(node.textContent || "").replace(/`/g, "\\`")}\``);
        return;
      }
      node.childNodes.forEach(walk);
    };
    root.childNodes.forEach(walk);
    return normalizeMarkdownWhitespace(output.join(""));
  }

  function cleanArticleHref(href) {
    const raw = String(href || "").trim();
    if (!raw || raw === "#") return "";
    try {
      const url = new URL(raw, location.origin);
      if (url.hostname === location.hostname && url.pathname === location.pathname) return "";
      return url.href;
    } catch {
      return raw;
    }
  }

  function normalizeMarkdownWhitespace(value) {
    return String(value || "")
      .replace(/[ \t]*\n[ \t]*/g, "\n")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function normalizeMarkdownLines(lines) {
    return lines
      .map(normalizeMarkdownWhitespace)
      .filter(Boolean)
      .join("\n\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
      .concat("\n");
  }

  function escapeMarkdownInline(text) {
    return String(text || "")
      .replace(/\\/g, "\\\\")
      .replace(/([`*_\[\]])/g, "\\$1")
      .replace(/\s+/g, " ");
  }

  function escapeMarkdownAlt(text) {
    return String(text || "").replace(/\\/g, "\\\\").replace(/]/g, "\\]").trim();
  }

  function articleFileName(title) {
    const fallback = statusIdFromUrl() ? `x-article-${statusIdFromUrl()}` : "x-article";
    const base = String(title || fallback)
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[\\/:*?"<>|]+/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 96);
    return `${base || fallback}.md`;
  }

  function injectArticleExportStyles() {
    if (document.getElementById(ARTICLE_EXPORT_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = ARTICLE_EXPORT_STYLE_ID;
    style.textContent = `
      #${ARTICLE_EXPORT_ID} {
        position: absolute;
        right: 8px;
        bottom: 8px;
        z-index: 20;
        display: inline-flex;
        align-items: center;
        border: 1px solid rgba(83, 100, 113, 0.12);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.62);
        color: #0f1419;
        box-shadow: 0 4px 12px rgba(15, 20, 25, 0.06);
        opacity: 0.22;
        transform: translateZ(0);
        transform-origin: 100% 100%;
        transition:
          opacity 160ms cubic-bezier(0.25, 1, 0.5, 1),
          border-color 160ms cubic-bezier(0.25, 1, 0.5, 1),
          background 160ms cubic-bezier(0.25, 1, 0.5, 1),
          box-shadow 180ms cubic-bezier(0.25, 1, 0.5, 1),
          transform 160ms cubic-bezier(0.25, 1, 0.5, 1);
        font: 10.5px/1 ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif;
        letter-spacing: 0;
        backdrop-filter: blur(8px);
      }
      #${ARTICLE_EXPORT_ID}[data-motion="entered"] {
        animation: __xposter_article_export_in 260ms cubic-bezier(0.22, 1, 0.36, 1);
      }
      [data-xposter-article-export-host="true"] {
        position: relative !important;
      }
      #${ARTICLE_EXPORT_ID}:hover,
      #${ARTICLE_EXPORT_ID}:focus-within {
        opacity: 0.92;
        border-color: rgba(83, 100, 113, 0.38);
        box-shadow: 0 9px 22px rgba(15, 20, 25, 0.11);
        transform: translate3d(0, -1px, 0);
      }
      #${ARTICLE_EXPORT_ID}[data-feedback="done"],
      #${ARTICLE_EXPORT_ID}[data-feedback="mode"] {
        border-color: rgba(29, 155, 240, 0.42);
        animation: __xposter_article_export_confirm 420ms cubic-bezier(0.22, 1, 0.36, 1);
      }
      #${ARTICLE_EXPORT_ID}[data-feedback="warn"],
      #${ARTICLE_EXPORT_ID}[data-feedback="error"] {
        border-color: rgba(244, 33, 46, 0.42);
        animation: __xposter_article_export_confirm 420ms cubic-bezier(0.22, 1, 0.36, 1);
      }
      #${ARTICLE_EXPORT_ID} button {
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        cursor: pointer;
        transition:
          background-color 140ms cubic-bezier(0.25, 1, 0.5, 1),
          color 140ms cubic-bezier(0.25, 1, 0.5, 1),
          transform 140ms cubic-bezier(0.25, 1, 0.5, 1);
      }
      #${ARTICLE_EXPORT_ID} button:active {
        transform: translateY(1px) scale(0.985);
      }
      #${ARTICLE_EXPORT_ID} .__xposter_article_export_main {
        width: 32px;
        min-height: 26px;
        padding: 0;
        font-weight: 720;
      }
      #${ARTICLE_EXPORT_ID} .__xposter_article_export_toggle {
        width: 22px;
        min-height: 26px;
        border-left: 1px solid rgba(83, 100, 113, 0.18);
        border-radius: 0 999px 999px 0;
        transform-origin: 50% 50%;
        font-size: 10px;
      }
      #${ARTICLE_EXPORT_ID} .__xposter_article_export_toggle[aria-expanded="true"] {
        transform: rotate(180deg);
      }
      #${ARTICLE_EXPORT_ID} .__xposter_article_export_menu {
        position: absolute;
        right: 0;
        bottom: calc(100% + 8px);
        min-width: 168px;
        display: grid;
        gap: 2px;
        padding: 6px;
        border: 1px solid rgba(83, 100, 113, 0.22);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 14px 36px rgba(15, 20, 25, 0.16);
        transform-origin: 100% 100%;
        animation: __xposter_article_export_menu_in 160ms cubic-bezier(0.22, 1, 0.36, 1);
      }
      #${ARTICLE_EXPORT_ID} .__xposter_article_export_menu[hidden] {
        display: none;
      }
      #${ARTICLE_EXPORT_ID} .__xposter_article_export_menu button {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        padding: 8px 9px;
        border-radius: 6px;
        text-align: left;
      }
      #${ARTICLE_EXPORT_ID} .__xposter_article_export_menu button:hover,
      #${ARTICLE_EXPORT_ID} .__xposter_article_export_menu button:focus-visible {
        outline: none;
        background: rgba(15, 20, 25, 0.06);
        transform: translateX(1px);
      }
      #${ARTICLE_EXPORT_ID} .__xposter_article_export_menu button[aria-checked="true"]::after {
        content: "✓";
        color: #536471;
      }
      @keyframes __xposter_article_export_in {
        from {
          opacity: 0;
          transform: translate3d(0, 5px, 0) scale(0.985);
        }
        to {
          opacity: 0.22;
          transform: translate3d(0, 0, 0) scale(1);
        }
      }
      @keyframes __xposter_article_export_menu_in {
        from {
          opacity: 0;
          transform: translate3d(0, 4px, 0) scale(0.985);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1);
        }
      }
      @keyframes __xposter_article_export_confirm {
        0% {
          transform: translate3d(0, -1px, 0) scale(1);
        }
        45% {
          transform: translate3d(0, -1px, 0) scale(1.025);
        }
        100% {
          transform: translate3d(0, -1px, 0) scale(1);
        }
      }
      @media (prefers-color-scheme: dark) {
        #${ARTICLE_EXPORT_ID} {
          background: rgba(22, 24, 28, 0.62);
          border-color: rgba(231, 233, 234, 0.12);
          color: #e7e9ea;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.22);
        }
        #${ARTICLE_EXPORT_ID} .__xposter_article_export_toggle {
          border-left-color: rgba(231, 233, 234, 0.16);
        }
        #${ARTICLE_EXPORT_ID} .__xposter_article_export_menu {
          background: rgba(22, 24, 28, 0.98);
          border-color: rgba(231, 233, 234, 0.18);
          box-shadow: 0 14px 36px rgba(0, 0, 0, 0.34);
        }
        #${ARTICLE_EXPORT_ID} .__xposter_article_export_menu button:hover,
        #${ARTICLE_EXPORT_ID} .__xposter_article_export_menu button:focus-visible {
          background: rgba(231, 233, 234, 0.08);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        #${ARTICLE_EXPORT_ID},
        #${ARTICLE_EXPORT_ID}[data-feedback],
        #${ARTICLE_EXPORT_ID} button,
        #${ARTICLE_EXPORT_ID} .__xposter_article_export_menu {
          animation: none;
          transition-duration: 0.01ms;
        }
        #${ARTICLE_EXPORT_ID}:hover,
        #${ARTICLE_EXPORT_ID}:focus-within,
        #${ARTICLE_EXPORT_ID} button,
        #${ARTICLE_EXPORT_ID} .__xposter_article_export_menu button:hover,
        #${ARTICLE_EXPORT_ID} .__xposter_article_export_menu button:focus-visible {
          transform: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function installImportButton() {
    injectImportButtonStyles();
    const mount = () => {
      if (!isArticleRoute() || isEditorRoute()) {
        document.getElementById(`${IMPORT_BUTTON_ID}_wrap`)?.remove();
        return;
      }
      if (document.getElementById(IMPORT_BUTTON_ID)) return;
      const anchor = findCreateButton(["create", "compose", "撰写", "新建", "创建", "新規", "作成"]);
      if (!anchor?.parentElement?.parentElement) return;
      const button = document.createElement("button");
      button.id = IMPORT_BUTTON_ID;
      button.type = "button";
      button.title = "Import Markdown with xPoster";
      button.setAttribute("aria-label", "Import Markdown with xPoster");
      button.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 3.5A2.5 2.5 0 0 1 7.5 1H14l5 5v12.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 18.5v-15Zm8 1V2.8H7.5a.7.7 0 0 0-.7.7v15a.7.7 0 0 0 .7.7h9a.7.7 0 0 0 .7-.7V7h-3.2A1.9 1.9 0 0 1 13 5.1V4.5ZM9 11h2v3.4l-1.2-1.2-1.4 1.4 2.6 2.6 2.6-2.6-1.4-1.4-1.2 1.2V11h2V9H9v2Z"/>
        </svg>
      `;
      button.addEventListener("click", () => chooseMarkdownFile("button"));
      const wrap = document.createElement("div");
      wrap.id = `${IMPORT_BUTTON_ID}_wrap`;
      wrap.appendChild(button);
      anchor.parentElement.parentElement.insertBefore(wrap, anchor.parentElement);
    };

    mount();
    new MutationObserver(mount).observe(document.body, { childList: true, subtree: true });
    const originalPush = history.pushState;
    history.pushState = function (...args) {
      const result = originalPush.apply(this, args);
      window.setTimeout(mount, 100);
      return result;
    };
    const originalReplace = history.replaceState;
    history.replaceState = function (...args) {
      const result = originalReplace.apply(this, args);
      window.setTimeout(mount, 100);
      return result;
    };
    window.addEventListener("popstate", () => window.setTimeout(mount, 100));
  }

  function injectImportButtonStyles() {
    if (document.getElementById("__xposter_import_style__")) return;
    const style = document.createElement("style");
    style.id = "__xposter_import_style__";
    style.textContent = `
      #${IMPORT_BUTTON_ID}_wrap { display: inline-flex; align-items: center; margin-right: 4px; }
      #${IMPORT_BUTTON_ID} {
        width: 38px;
        height: 38px;
        border: 0;
        border-radius: 999px;
        display: grid;
        place-items: center;
        background: transparent;
        color: currentColor;
        cursor: pointer;
      }
      #${IMPORT_BUTTON_ID}:hover { background: rgba(127, 127, 127, 0.14); }
      #${IMPORT_BUTTON_ID} svg { width: 21px; height: 21px; fill: currentColor; }
    `;
    document.head.appendChild(style);
  }

  function chooseMarkdownFile(origin) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".md,.markdown,.mdown,.mkd,.txt,text/markdown,text/plain";
    input.style.display = "none";
    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      input.remove();
      if (file) await importFile(file, origin);
    });
    document.body.appendChild(input);
    input.click();
  }

  function installDragDrop() {
    document.addEventListener("dragenter", (event) => {
      const intent = dropIntentForEvent(event);
      if (intent !== "none") showDropHint(event.dataTransfer, event, intent);
    }, true);
    document.addEventListener("dragover", (event) => {
      const intent = dropIntentForEvent(event);
      if (intent === "none") return;
      event.preventDefault();
      showDropHint(event.dataTransfer, event, intent);
      event.dataTransfer.dropEffect = intent === "article-outside" ? "none" : "copy";
    }, true);
    document.addEventListener("dragleave", (event) => {
      if (isLeavingDocument(event)) hideDropHint();
    }, true);
    document.addEventListener("drop", async (event) => {
      const intent = dropIntentForEvent(event);
      if (intent === "none") return;
      if (intent === "article-outside") {
        event.preventDefault();
        event.stopPropagation();
        hideDropHint();
        return;
      }
      const files = Array.from(event.dataTransfer.files || []);
      const markdownFiles = files.filter(isMarkdownFile);
      const imageFiles = markdownFiles.length ? [] : imageFilesFromTransfer(event.dataTransfer);
      const markdownText = markdownFiles.length ? "" : markdownTextFromTransfer(event.dataTransfer);
      const imageUrl = markdownFiles.length || imageFiles.length || markdownText ? "" : imageUrlFromTransfer(event.dataTransfer);
      const directoryItem = markdownFiles.length || imageFiles.length || imageUrl ? null : findDirectoryTransferItem(event.dataTransfer);
      if (!markdownFiles.length && !imageFiles.length && !markdownText && !imageUrl && !directoryItem) {
        hideDropHint();
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      showDropHint(event.dataTransfer, event, intent);
      setDropHintProcessing(event.dataTransfer, intent);
      window.setTimeout(hideDropHint, 260);
      if (intent === "sidepanel-queue") {
        const panelPromise = safeRuntimeSendMessage({ type: "xposter:open-side-panel" }).catch(() => {});
        await handleSidePanelMarkdownDrop(event.dataTransfer, intent, { openPanelPromise: panelPromise });
        return;
      }
      if (intent === "sidepanel-draft") {
        await handleSidePanelMarkdownDrop(event.dataTransfer, intent);
        return;
      }
      if (markdownFiles.length > 1) {
        const panelPromise = safeRuntimeSendMessage({ type: "xposter:open-side-panel" }).catch(() => {});
        await queueMarkdownFilesForSidePanel(markdownFiles, { openPanelPromise: panelPromise });
        return;
      }
      if (markdownFiles[0]) {
        await importSingleMarkdownFileFromDrop(markdownFiles[0]);
        return;
      }
      if (imageFiles.length) {
        await uploadDroppedImages(imageFiles);
        return;
      }
      if (markdownText) {
        await stageSingleMarkdownForArticle(markdownText, { source: "drop" });
        return;
      }
      if (imageUrl) {
        await uploadDroppedImageUrl(imageUrl);
        return;
      }
      try {
        const handle = await getDirectoryHandle(directoryItem);
        if (handle?.kind === "directory") {
          const permission = await shared.ensureReadPermission(handle);
          if (permission === "granted") {
            await shared.saveVaultHandle(handle);
            showStatus(`Local image folder set: ${handle.name}`, "done", 4000);
          }
        }
      } catch (error) {
        showStatus(error?.message || "Could not set local image folder", "error", 5000);
      }
    }, true);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") hideDropHint();
    });
    window.addEventListener("resize", updateVisibleDropHintSurface, { passive: true });
    window.addEventListener("scroll", updateVisibleDropHintSurface, { passive: true, capture: true });
  }

  function dropIntentForEvent(event) {
    return dropIntentForTransfer(event?.dataTransfer, event);
  }

  function dropIntentForTransfer(dataTransfer, event = null) {
    if (!dataTransfer) return "none";
    const sidePanelIntent = sidePanelMarkdownDropIntent(dataTransfer);
    if (sidePanelIntent === "sidepanel-queue") return sidePanelIntent;
    if (isSingleMarkdownDrop(dataTransfer)) return "article";
    if (canDropIntoCurrentArticle(event) && isXposterDropCandidate(dataTransfer)) return "article";
    if (sidePanelIntent) return sidePanelIntent;
    if (isEditorRoute() && findEditor() && isXposterDropCandidate(dataTransfer)) return "article-outside";
    return "none";
  }

  function canDropIntoCurrentArticle(event) {
    return Boolean(isEditorRoute() && findEditor() && (!event || isDropEventOverSurface(event, "article")));
  }

  function sidePanelMarkdownDropIntent(dataTransfer) {
    const files = markdownFilesFromTransfer(dataTransfer);
    if (files.length > 1) return "sidepanel-queue";
    if (files.length === 1) return "";
    if (markdownTextFromTransfer(dataTransfer)) return "";
    const types = Array.from(dataTransfer?.types || []);
    if (types.includes("text/markdown")) return "";
    const items = Array.from(dataTransfer?.items || []);
    const markdownItems = items.filter(isLikelyMarkdownTransferItem);
    if (markdownItems.length > 1) return "sidepanel-queue";
    if (markdownItems.length === 1) return "";
    if (hasFiles(dataTransfer) && items.length > 1 && !items.some(isLikelyImageTransferItem)) return "sidepanel-queue";
    return "";
  }

  function isSingleMarkdownDrop(dataTransfer) {
    const files = markdownFilesFromTransfer(dataTransfer);
    if (files.length === 1) return true;
    if (files.length > 1) return false;
    if (Array.from(dataTransfer?.files || []).length) return false;
    if (markdownTextFromTransfer(dataTransfer)) return true;
    const items = Array.from(dataTransfer?.items || []);
    if (items.filter(isLikelyMarkdownTransferItem).length === 1) return true;
    return hasSingleUnknownFileItem(dataTransfer);
  }

  function isLeavingDocument(event) {
    const next = event.relatedTarget;
    return !next || next === document.documentElement || next === document.body;
  }

  function hasFiles(dataTransfer) {
    return Boolean(dataTransfer && Array.from(dataTransfer.types || []).includes("Files"));
  }

  function hasMarkdownText(dataTransfer) {
    const types = Array.from(dataTransfer?.types || []);
    if (!types.includes("text/plain")) return false;
    return shared.looksLikeMarkdown(dataTransfer.getData("text/plain") || "");
  }

  function markdownTextFromTransfer(dataTransfer) {
    const text = dataTransfer?.getData?.("text/plain") || "";
    return shared.looksLikeMarkdown(text) ? text : "";
  }

  function markdownFilesFromTransfer(dataTransfer) {
    return Array.from(dataTransfer?.files || []).filter(isMarkdownFile);
  }

  function isMarkdownFile(file) {
    return Boolean(file?.name && /\.(md|markdown|mdown|mkd|txt)$/i.test(file.name));
  }

  function isXposterDropCandidate(dataTransfer) {
    if (hasMarkdownText(dataTransfer)) return true;
    const types = Array.from(dataTransfer?.types || []);
    if (types.includes("text/plain") || types.includes("text/markdown")) return true;
    if (transferMayContainImageUrl(dataTransfer)) return true;
    if (!hasFiles(dataTransfer)) return false;
    const files = Array.from(dataTransfer.files || []);
    if (files.some(isMarkdownFile)) return true;
    if (files.some(isImageFile)) return true;
    const items = Array.from(dataTransfer.items || []);
    return items.some(isLikelyMarkdownTransferItem) || items.some(isLikelyImageTransferItem) || items.some(isDirectoryTransferItem);
  }

  function isLikelyMarkdownTransferItem(item) {
    return item?.kind === "file" && /^(text\/markdown|text\/plain)$/i.test(item.type || "");
  }

  function hasSingleUnknownFileItem(dataTransfer) {
    const items = Array.from(dataTransfer?.items || []);
    if (items.length !== 1 || items[0]?.kind !== "file") return false;
    return !items[0].type && !isDirectoryTransferItem(items[0]);
  }

  function isLikelyImageTransferItem(item) {
    return /^image\//i.test(item?.type || "");
  }

  function findDirectoryTransferItem(dataTransfer) {
    const items = Array.from(dataTransfer.items || []);
    return items.find(isDirectoryTransferItem) || null;
  }

  function isDirectoryTransferItem(item) {
    if (item?.kind !== "file" || isLikelyImageTransferItem(item)) return false;
    const entry = typeof item.webkitGetAsEntry === "function" ? item.webkitGetAsEntry() : null;
    return Boolean(entry?.isDirectory);
  }

  async function getDirectoryHandle(item) {
    if (typeof item?.getAsFileSystemHandle !== "function") return null;
    try {
      const handle = await item.getAsFileSystemHandle();
      return handle?.kind === "directory" ? handle : null;
    } catch {
      return null;
    }
  }

  async function handleSidePanelMarkdownDrop(dataTransfer, intent = "sidepanel-draft", { openPanelPromise = null } = {}) {
    const files = markdownFilesFromTransfer(dataTransfer);
    try {
      if (files.length > 1 || intent === "sidepanel-queue") {
        if (files.length > 1) await queueMarkdownFilesForSidePanel(files, { openPanelPromise });
        else {
          await (openPanelPromise || safeRuntimeSendMessage({ type: "xposter:open-side-panel" }).catch(() => {}));
          showStatus("Drop Markdown files to add drafts to the side panel.", "warn", 6000);
        }
        return;
      }
      const markdown = files[0]
        ? await readMarkdownFile(files[0])
        : markdownTextFromTransfer(dataTransfer);
      if (!String(markdown || "").trim()) {
        showStatus("Drop a Markdown file or Markdown text to open it in the side panel.", "warn", 5000);
        return;
      }
      await saveDraftForSidePanel(markdown);
      await safeRuntimeSendMessage({ type: "xposter:open-side-panel" }).catch(() => {});
      showStatus("Markdown draft sent to the side panel.", "queue", 5000);
    } catch (error) {
      showStatus(error?.message || "Could not send Markdown to the side panel", "error", 7000);
    }
  }

  function showDropHint(dataTransfer = null, event = null, intent = dropIntentForTransfer(dataTransfer, event)) {
    const mode = dropHintMode(dataTransfer, intent);
    let hint = document.getElementById(DROP_HINT_ID);
    if (!hint) {
      hint = document.createElement("section");
      hint.id = DROP_HINT_ID;
      hint.setAttribute("aria-label", translateContentText("xPoster page drop target"));
      hint.innerHTML = `
        <div class="__xposter_drop_frame">
          <span class="__xposter_drop_mark" aria-hidden="true"></span>
          <div class="__xposter_drop_copy">
            <strong></strong>
            <p></p>
          </div>
        </div>
        <span class="__xposter_drop_mode" data-slot="markdown" aria-hidden="true"></span>
        <span class="__xposter_drop_mode" data-slot="image" aria-hidden="true"></span>
        <span class="__xposter_drop_mode" data-slot="folder" aria-hidden="true"></span>
      `;
      injectDropHintStyle();
      document.body.appendChild(hint);
    }
    hint.dataset.intent = intent;
    updateDropHintSurface(hint, intent);
    hint.dataset.mode = mode;
    hint.dataset.state = "ready";
    hint.dataset.target = intent === "article-outside" ? "outside" : "inside";
    const title = hint.querySelector("strong");
    const detail = hint.querySelector("p");
    const copy = dropHintCopy(mode, intent);
    if (title) title.textContent = translateContentText(copy.title);
    if (detail) detail.textContent = translateContentText(copy.detail);
  }

  function dropHintCopy(mode, intent = "") {
    if (intent === "article-outside") {
      return { title: "Drop on the article body", detail: "Release inside the highlighted editor area to write into this article." };
    }
    switch (mode) {
      case "sidepanel-queue":
        return { title: "Queue Markdown drafts", detail: "Release to add them to the xPoster side panel." };
      case "sidepanel":
        return { title: "Send Markdown to side panel", detail: "Release to open it as an xPoster draft." };
      case "queue":
        return { title: "Queue Markdown drafts", detail: "Release over this area to send them to the side panel." };
      case "folder":
        return { title: "Connect image folder", detail: "Release here to link local images for this article." };
      case "image":
        return { title: "Add image to article", detail: "Release over the editor to upload through X." };
      default:
        return { title: "Write Markdown here", detail: "Release over the editor to write into this article." };
    }
  }

  function processingDropHintCopy(mode, intent = "") {
    if (intent === "sidepanel-queue") {
      return { title: "Adding drafts...", detail: "Saving Markdown drafts to the side panel." };
    }
    if (intent === "sidepanel-draft") {
      return { title: "Opening side panel...", detail: "Loading this Markdown as a draft." };
    }
    switch (mode) {
      case "queue":
        return { title: "Adding drafts...", detail: "Saving Markdown drafts for the side panel." };
      case "folder":
        return { title: "Connecting folder...", detail: "Checking local image access." };
      case "image":
        return { title: "Adding image...", detail: "Handing the image to X's uploader." };
      default:
        return { title: "Reading Markdown...", detail: "Preparing the article body." };
    }
  }

  function setDropHintProcessing(dataTransfer = null, intent = dropIntentForTransfer(dataTransfer)) {
    const hint = document.getElementById(DROP_HINT_ID);
    if (!hint) return;
    const mode = dropHintMode(dataTransfer, intent);
    const copy = processingDropHintCopy(mode, intent);
    hint.dataset.intent = intent;
    hint.dataset.mode = mode;
    hint.dataset.state = "processing";
    const title = hint.querySelector("strong");
    const detail = hint.querySelector("p");
    if (title) title.textContent = translateContentText(copy.title);
    if (detail) detail.textContent = translateContentText(copy.detail);
    updateDropHintSurface(hint, intent);
  }

  function hideDropHint() {
    document.getElementById(DROP_HINT_ID)?.remove();
  }

  function updateVisibleDropHintCopy() {
    const hint = document.getElementById(DROP_HINT_ID);
    if (!hint) return;
    hint.setAttribute("aria-label", translateContentText("xPoster page drop target"));
    const mode = hint.dataset.mode || "article";
    const intent = hint.dataset.intent || "article";
    const copy = hint.dataset.state === "processing"
      ? processingDropHintCopy(mode, intent)
      : dropHintCopy(mode, intent);
    const title = hint.querySelector("strong");
    const detail = hint.querySelector("p");
    if (title) title.textContent = translateContentText(copy.title);
    if (detail) detail.textContent = translateContentText(copy.detail);
  }

  function updateVisibleDropHintSurface() {
    const hint = document.getElementById(DROP_HINT_ID);
    if (hint) updateDropHintSurface(hint, hint.dataset.intent || "article");
  }

  function updateDropHintSurface(hint, intent = "article") {
    const rect = dropSurfaceRect(intent);
    hint.style.setProperty("--xposter-drop-surface-left", `${Math.round(rect.left)}px`);
    hint.style.setProperty("--xposter-drop-surface-top", `${Math.round(rect.top)}px`);
    hint.style.setProperty("--xposter-drop-surface-width", `${Math.round(rect.width)}px`);
    hint.style.setProperty("--xposter-drop-surface-height", `${Math.round(rect.height)}px`);
  }

  function isDropEventOverSurface(event, intent = "article") {
    if (!event) return true;
    const rect = dropSurfaceRect(intent);
    return event.clientX >= rect.left &&
      event.clientX <= rect.left + rect.width &&
      event.clientY >= rect.top &&
      event.clientY <= rect.top + rect.height;
  }

  function dropSurfaceRect(intent = "article") {
    if (intent === "sidepanel-draft" || intent === "sidepanel-queue") return pageDropSurfaceRect();
    const editor = findEditor();
    const editorRect = visibleElementRect(editor);
    if (editorRect) {
      return normalizeDropSurfaceRect(editorSurfaceRect(editor, editorRect) || editorRect);
    }
    return pageDropSurfaceRect();
  }

  function pageDropSurfaceRect() {
    const column = document.querySelector("[data-testid='primaryColumn'], main[role='main'], main");
    const columnRect = visibleElementRect(column);
    if (columnRect) {
      const top = Math.max(columnRect.top + 72, 82);
      return normalizeDropSurfaceRect({
        left: columnRect.left + 16,
        top,
        width: Math.max(0, columnRect.width - 32),
        height: Math.min(360, Math.max(180, window.innerHeight - top - 24))
      });
    }
    return normalizeDropSurfaceRect({
      left: 18,
      top: 82,
      width: window.innerWidth - 36,
      height: Math.min(360, window.innerHeight - 112)
    });
  }

  function editorSurfaceRect(editor, editorRect) {
    let best = null;
    for (let element = editor?.parentElement; element && element !== document.body; element = element.parentElement) {
      const rect = visibleElementRect(element);
      if (!rect) continue;
      const closeToEditor = rect.width >= editorRect.width && rect.width <= Math.max(editorRect.width + 160, window.innerWidth - 24);
      const usefulHeight = rect.height >= Math.max(150, Math.min(editorRect.height + 96, 260));
      if (closeToEditor && usefulHeight) best = rect;
      if (element.matches?.("main, [role='main']") || rect.height > window.innerHeight * 0.72) break;
    }
    return best;
  }

  function visibleElementRect(element) {
    if (!element?.getBoundingClientRect) return null;
    const rect = element.getBoundingClientRect();
    if (rect.width < 24 || rect.height < 24) return null;
    if (rect.bottom <= 0 || rect.right <= 0 || rect.top >= window.innerHeight || rect.left >= window.innerWidth) return null;
    return {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height
    };
  }

  function normalizeDropSurfaceRect(rect) {
    const margin = 14;
    const viewportWidth = Math.max(1, window.innerWidth);
    const viewportHeight = Math.max(1, window.innerHeight);
    const maxWidth = Math.max(1, viewportWidth - margin * 2);
    const maxHeight = Math.max(1, viewportHeight - margin * 2);
    const minWidth = Math.min(420, maxWidth);
    const minHeight = Math.min(190, maxHeight);
    const sourceWidth = Math.min(Math.max(rect.width, minWidth), maxWidth);
    const sourceHeight = Math.min(Math.max(rect.height, minHeight), maxHeight);
    const sourceCenterX = rect.left + rect.width / 2;
    const sourceCenterY = rect.top + rect.height / 2;
    const left = Math.min(Math.max(margin, sourceCenterX - sourceWidth / 2), viewportWidth - margin - sourceWidth);
    const top = Math.min(Math.max(margin, sourceCenterY - sourceHeight / 2), viewportHeight - margin - sourceHeight);
    return {
      left,
      top,
      width: sourceWidth,
      height: sourceHeight
    };
  }

  function dropHintMode(dataTransfer, intent = "") {
    if (intent === "sidepanel-queue") return "sidepanel-queue";
    if (intent === "sidepanel-draft") return "sidepanel";
    if (!dataTransfer) return "markdown";
    if (hasMarkdownText(dataTransfer)) return "markdown";
    const files = Array.from(dataTransfer.files || []);
    if (files.filter(isMarkdownFile).length > 1) return "queue";
    if (files.some(isMarkdownFile)) return "markdown";
    if (files.some(isImageFile)) return "image";
    const items = Array.from(dataTransfer.items || []);
    if (items.some(isLikelyImageTransferItem)) return "image";
    if (transferMayContainImageUrl(dataTransfer) || imageUrlFromTransfer(dataTransfer)) return "image";
    return findDirectoryTransferItem(dataTransfer) ? "folder" : "markdown";
  }

  function injectDropHintStyle() {
    if (document.getElementById("__xposter_drop_hint_style__")) return;
    const style = document.createElement("style");
    style.id = "__xposter_drop_hint_style__";
    style.textContent = `
      #${DROP_HINT_ID} {
        position: fixed;
        z-index: 2147483646;
        left: var(--xposter-drop-surface-left, 18px);
        top: var(--xposter-drop-surface-top, 82px);
        width: var(--xposter-drop-surface-width, calc(100vw - 36px));
        height: var(--xposter-drop-surface-height, min(360px, calc(100vh - 112px)));
        min-height: 150px;
        box-sizing: border-box;
        display: grid;
        place-items: center;
        padding: 18px;
        --xposter-drop-paper: rgba(255, 255, 255, 0.82);
        --xposter-drop-line: rgba(15, 20, 25, 0.16);
        --xposter-drop-dash: rgba(15, 20, 25, 0.22);
        --xposter-drop-ink: #0f1419;
        --xposter-drop-muted: #536471;
        --xposter-drop-accent: #536471;
        color: #0f1419;
        font: 14px/1.45 ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif;
        letter-spacing: 0;
        pointer-events: none;
        isolation: isolate;
        animation: __xposter_drop_mask_in 180ms cubic-bezier(0.22, 1, 0.36, 1) both;
      }
      #${DROP_HINT_ID}::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 0;
        border: 1px solid var(--xposter-drop-line);
        border-radius: 14px;
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.72), var(--xposter-drop-paper));
        box-shadow:
          0 18px 44px rgba(15, 20, 25, 0.10),
          inset 0 0 0 1px rgba(255, 255, 255, 0.58);
        backdrop-filter: blur(2px);
      }
      #${DROP_HINT_ID}::after {
        content: "";
        position: absolute;
        inset: 9px;
        z-index: 1;
        border: 1px dashed var(--xposter-drop-dash);
        border-radius: 10px;
        opacity: 0.72;
      }
      #${DROP_HINT_ID} .__xposter_drop_frame {
        position: relative;
        z-index: 2;
        width: min(360px, 100%);
        display: grid;
        justify-items: center;
        gap: 9px;
        text-align: center;
        color: var(--xposter-drop-ink);
        transform: translateY(0);
        animation: __xposter_drop_copy_in 220ms cubic-bezier(0.22, 1, 0.36, 1) both;
      }
      #${DROP_HINT_ID} .__xposter_drop_mark {
        position: relative;
        width: 36px;
        height: 36px;
        border: 1px solid color-mix(in srgb, var(--xposter-drop-accent), transparent 52%);
        border-radius: 999px;
        background: color-mix(in srgb, var(--xposter-drop-accent), transparent 92%);
        box-shadow: inset 0 0 0 5px rgba(255, 255, 255, 0.62);
      }
      #${DROP_HINT_ID} .__xposter_drop_mark::before,
      #${DROP_HINT_ID} .__xposter_drop_mark::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        background: var(--xposter-drop-accent);
        transform: translate(-50%, -50%);
      }
      #${DROP_HINT_ID} .__xposter_drop_mark::before {
        width: 13px;
        height: 2px;
        border-radius: 999px;
      }
      #${DROP_HINT_ID} .__xposter_drop_mark::after {
        width: 2px;
        height: 13px;
        border-radius: 999px;
      }
      #${DROP_HINT_ID} strong {
        position: relative;
        display: block;
        font-size: 15px;
        font-weight: 760;
        line-height: 1.2;
      }
      #${DROP_HINT_ID} p {
        position: relative;
        max-width: 26rem;
        margin: 4px 0 0;
        color: var(--xposter-drop-muted);
        font-size: 12px;
        line-height: 1.35;
      }
      #${DROP_HINT_ID} .__xposter_drop_mode {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        clip-path: inset(50%);
        white-space: nowrap;
      }
      #${DROP_HINT_ID}[data-mode="queue"] {
        --xposter-drop-accent: #8a6f3d;
      }
      #${DROP_HINT_ID}[data-mode="image"] {
        --xposter-drop-accent: #2f6f68;
      }
      #${DROP_HINT_ID}[data-mode="folder"] {
        --xposter-drop-accent: #6b665e;
      }
      #${DROP_HINT_ID}[data-target="outside"] {
        opacity: 0.78;
      }
      #${DROP_HINT_ID}[data-target="outside"]::after {
        opacity: 0.38;
      }
      #${DROP_HINT_ID}[data-state="processing"] {
        --xposter-drop-accent: #2f6f68;
      }
      #${DROP_HINT_ID}[data-state="processing"] .__xposter_drop_mark {
        animation: __xposter_drop_processing 780ms ease-in-out infinite;
      }
      #${DROP_HINT_ID}[data-state="processing"] .__xposter_drop_mark::after {
        display: none;
      }
      @keyframes __xposter_drop_mask_in {
        from { opacity: 0; transform: scale(0.992); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes __xposter_drop_copy_in {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes __xposter_drop_processing {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(0.94); opacity: 0.72; }
      }
      @media (prefers-reduced-motion: reduce) {
        #${DROP_HINT_ID},
        #${DROP_HINT_ID} .__xposter_drop_frame,
        #${DROP_HINT_ID}[data-state="processing"] .__xposter_drop_mark {
          animation: none;
        }
      }
      @media (prefers-color-scheme: dark) {
        #${DROP_HINT_ID} {
          --xposter-drop-paper: rgba(22, 24, 28, 0.82);
          --xposter-drop-line: rgba(231, 233, 234, 0.18);
          --xposter-drop-dash: rgba(231, 233, 234, 0.22);
          --xposter-drop-ink: #e7e9ea;
          --xposter-drop-muted: #aeb4b9;
        }
        #${DROP_HINT_ID}::before {
          background:
            linear-gradient(180deg, rgba(22, 24, 28, 0.74), var(--xposter-drop-paper));
          box-shadow:
            0 18px 48px rgba(0, 0, 0, 0.32),
            inset 0 0 0 1px rgba(231, 233, 234, 0.06);
        }
      }
      @media (max-width: 360px) {
        #${DROP_HINT_ID} {
          min-height: 136px;
          padding: 14px;
        }
        #${DROP_HINT_ID} .__xposter_drop_mark {
          width: 32px;
          height: 32px;
        }
        #${DROP_HINT_ID} strong {
          font-size: 13px;
        }
        #${DROP_HINT_ID} p {
          font-size: 11.5px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type === "xposter:import-markdown") {
      importMarkdown(message.markdown || "", "sidepanel", message.options || {}).then(sendResponse);
      return true;
    }
    if (message?.type === "xposter:cancel-import") {
      sendResponse(cancelActiveImport());
      return false;
    }
    if (message?.type === "xposter:analyze-markdown") {
      try {
        const parsed = shared.parseMarkdown(message.markdown || "", normalizeImportOptions(message.options || {}));
        sendResponse({ ok: true, parsed: { title: parsed.title, cover: parsed.cover, counts: shared.segmentCounts(parsed.segments) } });
      } catch (error) {
        sendResponse({ ok: false, error: error?.message || String(error) });
      }
      return false;
    }
    if (message?.type === "xposter:page-status") {
      getVaultStatus().then((vault) =>
        sendResponse({
          ok: true,
          contentScriptVersion: CONTENT_SCRIPT_VERSION,
          url: location.href,
          isArticleRoute: isArticleRoute(),
          isEditorRoute: isEditorRoute(),
          hasEditor: Boolean(findEditor()),
          busy: state.busy,
          lastSummary: state.lastSummary,
          targetContext: collectTargetContext(),
          originalImporterResidue: detectOriginalImporterResidue(),
          vault
        })
      );
      return true;
    }
    if (message?.type === "xposter:diagnostics") {
      collectDiagnostics().then(sendResponse);
      return true;
    }
    if (message?.type === "xposter:choose-file") {
      chooseMarkdownFile("sidepanel");
      sendResponse({
        ok: true
      });
      return false;
    }
    if (message?.type === "xposter:choose-vault") {
      promptVaultSelection(0).then(sendResponse);
      return true;
    }
    if (message?.type === "xposter:clear-vault") {
      clearVault().then(sendResponse);
      return true;
    }
    return false;
  });

  async function getVaultStatus() {
    try {
      const record = await shared.getVaultRecord();
      if (!record?.handle) return { configured: false };
      return {
        configured: true,
        name: record.name || record.handle.name || "Selected folder",
        permission: await shared.queryReadPermission(record.handle),
        savedAt: record.savedAt || null
      };
    } catch {
      return { configured: false };
    }
  }

  async function clearVault() {
    try {
      await shared.clearVaultHandle();
      showStatus("Local image folder cleared", "done", 3000);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error?.message || String(error) };
    }
  }

  async function collectDiagnostics() {
    const vault = await getVaultStatus();
    const main = await diagnoseMainWorld();
    return {
      ok: true,
      contentScript: true,
      contentScriptVersion: CONTENT_SCRIPT_VERSION,
      url: location.href,
      isArticleRoute: isArticleRoute(),
      isEditorRoute: isEditorRoute(),
      hasEditorElement: Boolean(findEditor()),
      importButtonMounted: Boolean(document.getElementById(IMPORT_BUTTON_ID)),
      originalImporterResidue: detectOriginalImporterResidue(),
      busy: state.busy,
      mainReady: state.mainReady,
      targetContext: collectTargetContext(),
      vault,
      main
    };
  }

  function diagnoseMainWorld() {
    return new Promise((resolve) => {
      let done = false;
      const finish = (value) => {
        if (done) return;
        done = true;
        window.removeEventListener("message", listener);
        resolve(value);
      };
      const listener = (event) => {
        if (event.source !== window || event.data?.source !== CHANNEL_FROM_MAIN) return;
        if (event.data.kind !== "diagnostics") return;
        state.mainReady = true;
        finish(event.data.payload || { ok: true });
      };
      window.addEventListener("message", listener);
      window.postMessage({ source: CHANNEL_TO_MAIN, kind: "diagnostics" }, "*");
      window.setTimeout(() => finish({ ok: false, error: "MAIN world bridge timeout" }), 2500);
    });
  }

  restoreContentLanguage().catch(() => {});
  installContentLanguageSync();
  document.addEventListener("paste", onPaste, { capture: true });
  installImportButton();
  installArticleExportButton();
  installDragDrop();
  resumePendingArticleImport().catch(() => {});
  waitForMainReady(2000).catch(() => {});
  console.log("[xPoster] content script ready");
})();
