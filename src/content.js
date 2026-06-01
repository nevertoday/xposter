(() => {
  const shared = window.xPosterShared;
  const CHANNEL_TO_MAIN = "xposter";
  const CHANNEL_FROM_MAIN = "xposter-main";
  const STATUS_ID = "__xposter_status__";
  const IMPORT_BUTTON_ID = "__xposter_import_button__";
  const DROP_HINT_ID = "__xposter_drop_hint__";
  const ARTICLE_EXPORT_ID = "__xposter_article_export__";
  const ARTICLE_EXPORT_STYLE_ID = "__xposter_article_export_style__";
  const SUCCESS_CELEBRATION_ID = "__xposter_success_celebration__";
  const SUCCESS_CELEBRATION_STYLE_ID = "__xposter_success_celebration_style__";
  const SUCCESS_CELEBRATION_DURATION_MS = 3200;
  const SUCCESS_CELEBRATION_PIECE_COUNT = 72;
  const nodeCache = new WeakMap();
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
  const X_ARTICLE_MEDIA_SOFT_LIMIT = 25;
  const X_ARTICLE_MEDIA_HEADROOM_THRESHOLD = 21;
  const MAIN_WORLD_SILENCE_TIMEOUT_MS = 180000;
  const X_ARTICLE_MEDIA_LIMIT_WARNING =
    "Images: {count}/{limit}. Remove {extra} image(s) before writing.";
  const X_ARTICLE_MEDIA_HEADROOM_NOTE =
    "Images: {count}/{limit}. Close to X Article's image limit.";
  const ARTICLE_EXPORT_MIN_SCORE = 12;
  const ARTICLE_EXPORT_LONGFORM_SELECTOR = [
    "[data-testid='twitterArticleReadView']",
    "[data-testid='twitter-article-title']",
    "[data-testid='twitterArticleRichTextView']",
    "[data-testid='longformRichTextComponent']"
  ].join(",");
  const CONTENT_ZH_TEXT = new Map(Object.entries({
    "xPoster page drop target": "xPoster 页面拖拽目标",
    "Markdown exported": "Markdown 已导出",
    "Markdown queued": "Markdown 已加入队列",
    "Article written": "文章已写入",
    "Image note": "图片提醒",
    "Could not write": "无法写入",
    "Writing article": "正在写入文章",
    "Preparing Markdown...": "正在准备 Markdown...",
    "Stop": "停止",
    "Stopping...": "正在停止...",
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
    "Could not read the dropped Markdown file. Try the import button or drop a real .md file.": "无法读取拖入的 Markdown 文件。请试试导入按钮，或拖入真正的 .md 文件。",
    "Opening X Article...": "正在打开 X 文章...",
    "No Markdown content": "没有 Markdown 内容",
    "No readable article text found.": "未找到可读取的文章正文。",
    "Markdown saved.": "Markdown 已保存。",
    "Markdown copied.": "Markdown 已复制。",
    "Could not export Markdown": "无法导出 Markdown",
    "Copy Markdown": "复制 Markdown",
    "Download Markdown": "下载 Markdown",
    "Copy MD": "复制 MD",
    "Download MD": "下载 MD",
    "Export Markdown": "导出 Markdown",
    "Article title Markdown tools": "文章标题区 Markdown 工具",
    "Markdown": "Markdown",
    "MD": "MD",
    "Markdown export action": "Markdown 导出操作",
    "Drop Markdown files to add drafts to the side panel.": "拖入 Markdown 文件，将草稿加入侧边栏。",
    "Drop a Markdown file or Markdown text to open it in the side panel.": "拖入 Markdown 文件或 Markdown 文本，在侧边栏打开。",
    "Markdown draft sent to the side panel.": "Markdown 草稿已发送到侧边栏。",
    "Could not send Markdown to the side panel": "无法发送 Markdown 到侧边栏",
    "These Markdown files were already queued or too large to save together.": "这些 Markdown 文件已在队列中，或整体过大无法保存。",
    "Open X Article draft": "打开 X 文章草稿",
    "Release to open X Articles and write this Markdown.": "松开后打开 X 文章并写入这份 Markdown。",
    "Write to this X Article": "写入当前 X 文章",
    "Release in the bottom bar to write this Markdown here.": "拖到底部承接区松开，即可写入这篇文章。",
    "Queue Markdown drafts": "加入 Markdown 草稿队列",
    "Release to add them to the xPoster side panel.": "松开后加入 xPoster 侧边栏。",
    "Send Markdown to side panel": "发送 Markdown 到侧边栏",
    "Release to open it as an xPoster draft.": "松开后作为 xPoster 草稿打开。",
    "Release over this area to send them to the side panel.": "在这个区域松开后发送到侧边栏。",
    "Connect image folder": "连接图片文件夹",
    "Release here to link local images for this article.": "在这里松开，为这篇文章关联本地图片。",
    "Drop image folder here": "把图片文件夹放到这里",
    "Release to connect this folder for local images.": "松开后连接这个文件夹，用于读取本地图片。",
    "Drop the folder into the blue folder area.": "请把文件夹拖到蓝色投放区。",
    "Add image to article": "添加图片到文章",
    "Release over the editor to upload through X.": "在编辑器上松开，通过 X 上传。",
    "Insert image at cursor": "在光标处插入图片",
    "Hold Option/Alt and release over the article body.": "按住 Option/Alt，并在正文区域松开。",
    "Write Markdown here": "在这里写入 Markdown",
    Article: "文章",
    Queue: "队列",
    "Side panel": "侧边栏",
    Folder: "文件夹",
    Image: "图片",
    "Release over the editor to write into this article.": "在编辑器上松开，即可写入这篇文章。",
    "Adding drafts...": "正在添加草稿...",
    "Saving Markdown drafts to the side panel.": "正在把 Markdown 草稿保存到侧边栏。",
    "Opening side panel...": "正在打开侧边栏...",
    "Loading this Markdown as a draft.": "正在把这份 Markdown 载入为草稿。",
    "Preparing this Markdown draft.": "正在准备这份 Markdown 草稿。",
    "Saving Markdown drafts for the side panel.": "正在为侧边栏保存 Markdown 草稿。",
    "Connecting folder...": "正在连接文件夹...",
    "Checking local image access.": "正在检查本地图片访问权限。",
    "Connecting image folder...": "正在连接图片文件夹...",
    "Preparing local image access.": "正在准备本地图片访问权限。",
    "Adding image...": "正在添加图片...",
    "Handing the image to X's uploader.": "正在交给 X 上传图片。",
    "Using the current article cursor.": "将使用当前正文光标位置。",
    "Place the cursor in the article body before dropping an image.": "先把光标放到正文中，再拖入图片。",
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
    [X_ARTICLE_MEDIA_LIMIT_WARNING]: "图片：{count}/{limit}。请先删掉 {extra} 张图再写入。",
    [X_ARTICLE_MEDIA_HEADROOM_NOTE]: "图片：{count}/{limit}。已接近 X 文章图片上限。",
    "Local image folder cleared": "本地图片文件夹已清除",
    "Local image folder": "本地图片文件夹",
    "Choose the folder that contains your Markdown images.": "请选择包含 Markdown 图片的文件夹。",
    "If your Markdown says": "如果 Markdown 里写的是",
    "choose the folder that contains the": "请选择包含",
    "directory.": "目录的文件夹。",
    "Cancel write": "取消写入",
    "Choose folder": "选择文件夹",
    "Read permission was not granted": "未获得读取权限",
    "Local image folder was not selected": "未选择本地图片文件夹",
    "Local image folder picker is unavailable in this tab. Open the X Article tab in Chrome, then choose the folder that contains your Markdown images.": "当前标签页无法选择本地图片文件夹。请在 Chrome 中打开 X 文章页，再选择包含 Markdown 图片的文件夹。",
    "Extension context unavailable": "扩展上下文不可用",
    "Extension runtime messaging unavailable": "扩展消息通道不可用",
    "Extension context invalidated. Reload the X Article tab after updating xPoster.": "扩展上下文已失效。更新 xPoster 后请重新加载 X 文章标签页。",
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
  const ORIGINAL_IMPORTER_BODY_CLASSES = [
    { label: "original banner class", className: "__xmp_banner_visible" }
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
    statusTimer: 0,
    language: "en",
    articleExport: {
      enabled: true,
      mode: "copy",
      root: null,
      syncTimer: 0,
      feedbackTimer: 0,
      inlineFeedbackTimer: 0
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
    return {
      setTitle: options.setTitle !== false,
      setCover: options.setCover !== false,
      ...titleCandidateOptions(options)
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

  function articleExportPathInfo(url = location.href) {
    try {
      const parsed = new URL(url, location.origin);
      if (!/^(?:x|twitter)\.com$/i.test(parsed.hostname)) return { id: null, readable: false };
      const segments = parsed.pathname.split("/").filter(Boolean);
      if (segments[0] === "compose" && segments[1] === "articles") return { id: null, readable: false };
      const articleIndex = segments.findIndex((segment) => /^(?:article|articles)$/.test(segment));
      const articleId = articleIndex >= 0 && /^\d+$/.test(segments[articleIndex + 1] || "")
        ? segments[articleIndex + 1]
        : null;
      const statusIndex = segments.findIndex((segment) => segment === "status");
      const statusId = statusIndex >= 0 && /^\d+$/.test(segments[statusIndex + 1] || "")
        ? segments[statusIndex + 1]
        : null;
      return { id: articleId || statusId || null, readable: Boolean(articleId || statusId) };
    } catch {
      return { id: null, readable: false };
    }
  }

  function articleExportIdFromUrl(url = location.href) {
    return articleExportPathInfo(url).id;
  }

  async function collectTargetContext(options = {}) {
    const editor = findEditor();
    const editorText = normalizeText(editor?.innerText || editor?.textContent || "");
    const originalImporterResidue = options.originalImporterResidue ||
      await currentOriginalImporterResidue({ cleanup: Boolean(options.cleanupOriginalImporter) });
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
      originalImporterResidue
    };
  }

  function detectOriginalImporterResidue() {
    const markers = [];
    for (const marker of ORIGINAL_IMPORTER_MARKERS) {
      if (document.querySelector(marker.selector)) markers.push(marker.label);
    }
    for (const marker of ORIGINAL_IMPORTER_BODY_CLASSES) {
      if (document.body?.classList?.contains(marker.className)) markers.push(marker.label);
    }
    return originalImporterResidueResult(markers);
  }

  function originalImporterResidueResult(markers = [], cleanup = {}) {
    const uniqueMarkers = Array.from(new Set(markers));
    const cleanedMarkers = Array.from(new Set(cleanup.cleanedMarkers || []));
    return {
      detected: uniqueMarkers.length > 0,
      markers: uniqueMarkers,
      cleanupAttempted: Boolean(cleanup.attempted),
      cleanedMarkers,
      detail: uniqueMarkers.length
        ? `Old X Article Markdown Paste residue detected: ${uniqueMarkers.join(", ")}`
        : cleanedMarkers.length
        ? `Old X Article Markdown Paste residue cleaned: ${cleanedMarkers.join(", ")}`
        : ""
    };
  }

  function cleanupOriginalImporterResidue() {
    const cleaned = [];
    for (const marker of ORIGINAL_IMPORTER_MARKERS) {
      const nodes = Array.from(document.querySelectorAll(marker.selector));
      if (!nodes.length) continue;
      for (const node of nodes) node.remove?.();
      cleaned.push(marker.label);
    }
    for (const marker of ORIGINAL_IMPORTER_BODY_CLASSES) {
      if (!document.body?.classList?.contains(marker.className)) continue;
      document.body.classList.remove(marker.className);
      cleaned.push(marker.label);
    }
    return Array.from(new Set(cleaned));
  }

  async function currentOriginalImporterResidue({ cleanup = false } = {}) {
    const before = detectOriginalImporterResidue();
    if (!cleanup || !before.detected) return before;
    const cleanedMarkers = cleanupOriginalImporterResidue();
    await sleep(120);
    const after = detectOriginalImporterResidue();
    return originalImporterResidueResult(after.markers, { attempted: true, cleanedMarkers });
  }

  function normalizeText(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
  }

  function normalizeLanguage(language) {
    const value = String(language || "").toLowerCase().replace("_", "-");
    if (value === "auto" || value === "system" || value === "browser") return preferredContentLanguage();
    if (value === "zh-tw" || value === "zh-hant" || value === "zh-hk") return "zh-TW";
    if (value.startsWith("zh")) return "zh";
    if (value.startsWith("en")) return "en";
    return "en";
  }

  function preferredContentLanguage() {
    const candidates = [navigator.language, ...(Array.isArray(navigator.languages) ? navigator.languages : [])];
    for (const language of candidates) {
      const value = String(language || "").toLowerCase().replace("_", "-");
      if (value === "zh-tw" || value === "zh-hant" || value === "zh-hk") return "zh-TW";
      if (value.startsWith("zh")) return "zh";
    }
    return "en";
  }

  function isChineseLanguage(language = state.language) {
    return String(language || "").startsWith("zh");
  }

  function contentSourceText(text) {
    return CONTENT_EN_TEXT.get(String(text || "")) || String(text || "");
  }

  function translateContentText(text) {
    const source = contentSourceText(text);
    if (!isChineseLanguage()) return source;
    const direct = CONTENT_ZH_TEXT.get(source);
    const translated = direct || translateContentPattern(source);
    return state.language === "zh-TW" ? shared.toTraditionalChinese(translated) : translated;
  }

  function translateContentPattern(source) {
    const patterns = [
      [/^Preparing (\d+) image\(s\)\.\.\.$/, "正在准备 $1 张图片..."],
      [/^Preparing image (\d+)\/(\d+)\.\.\.$/, "正在准备图片 $1/$2..."],
      [/^Prepared (\d+)\/(\d+) image\(s\)\.\.\.$/, "已准备 $1/$2 张图片..."],
      [/^Retrying image (.+)\.\.\.$/, "正在重试图片 $1..."],
      [/^Rendering (\d+) table\(s\)\.\.\.$/, "正在渲染 $1 个表格..."],
      [/^Uploading image (\d+)\/(\d+)\.\.\.$/, "正在上传图片 $1/$2..."],
      [/^Uploading image (\d+)\/(\d+)\.\.\. waiting for X to finish\.$/, "正在上传图片 $1/$2，等待 X 完成处理..."],
      [/^Image (\d+)\/(\d+) is in the editor; continuing\.\.\.$/, "图片 $1/$2 已进入编辑器，继续处理..."],
      [/^Pasting structured Markdown\.\.\.$/, "正在粘贴结构化 Markdown..."],
      [/^Inserting (\d+) special block\(s\)\.\.\.$/, "正在插入 $1 个特殊内容块..."],
      [/^Reordering uploaded media\.\.\.$/, "正在整理已上传图片..."],
      [/^Setting title\.\.\.$/, "正在设置标题..."],
      [/^Setting cover\.\.\.$/, "正在设置封面..."],
      [/^Cleaning up import markers\.\.\.$/, "正在清理写入标记..."],
      [/^Images: (\d+)\/25\. Remove (\d+) image\(s\) before writing\.$/, "图片：$1/25。请先删掉 $2 张图再写入。"],
      [/^Images: (\d+)\/25\. Close to X Article's image limit\.$/, "图片：$1/25。已接近 X 文章图片上限。"],
      [/^Article written(?: in ((?:\d+(?:\.\d+)?s)|elapsed time unknown))?\.$/, (_, elapsed) => elapsed ? `文章已写入，用时 ${elapsed}。` : "文章已写入。"],
      [/^Article written(?: in (.+))?\. (.+) web image\(s\) stayed as Markdown links\.(?: Replace unreachable image URLs with public links, then write again if those images must upload\.)?$/, (_, elapsed, images) => elapsed ? `文章已写入，用时 ${elapsed}。${images} 张网页图片保留为 Markdown 链接。` : `文章已写入。${images} 张网页图片保留为 Markdown 链接。`],
      [/^Article written(?: in (.+))?\. (.+) body image\(s\) stayed as Markdown links; (.+) table image\(s\) stayed as Markdown tables; (.+) cover image\(s\) could not be applied; (.+) image\(s\) are in the editor while X finishes media IDs\.(?: Replace unreachable image URLs with public links, then write again if those images must upload\.)?$/, (_, elapsed, images, tables, covers, pending) => elapsed ? `文章已写入，用时 ${elapsed}。${images} 张正文图片保留为 Markdown 链接；${tables} 个表格保留为 Markdown；${covers} 张封面图片未能设置；${pending} 张图片已进入编辑器，X 仍在完成媒体编号。` : `文章已写入。${images} 张正文图片保留为 Markdown 链接；${tables} 个表格保留为 Markdown；${covers} 张封面图片未能设置；${pending} 张图片已进入编辑器，X 仍在完成媒体编号。`],
      [/^Article written(?: in (.+))?\. (.+) body image\(s\) stayed as Markdown links; (.+) table image\(s\) stayed as Markdown tables; (.+) image\(s\) are in the editor while X finishes media IDs\.(?: Replace unreachable image URLs with public links, then write again if those images must upload\.)?$/, (_, elapsed, images, tables, pending) => elapsed ? `文章已写入，用时 ${elapsed}。${images} 张正文图片保留为 Markdown 链接；${tables} 个表格保留为 Markdown；${pending} 张图片已进入编辑器，X 仍在完成媒体编号。` : `文章已写入。${images} 张正文图片保留为 Markdown 链接；${tables} 个表格保留为 Markdown；${pending} 张图片已进入编辑器，X 仍在完成媒体编号。`],
      [/^Article written(?: in (.+))?\. (.+) body image\(s\) stayed as Markdown links; (.+) cover image\(s\) could not be applied; (.+) image\(s\) are in the editor while X finishes media IDs\.(?: Replace unreachable image URLs with public links, then write again if those images must upload\.)?$/, (_, elapsed, images, covers, pending) => elapsed ? `文章已写入，用时 ${elapsed}。${images} 张正文图片保留为 Markdown 链接；${covers} 张封面图片未能设置；${pending} 张图片已进入编辑器，X 仍在完成媒体编号。` : `文章已写入。${images} 张正文图片保留为 Markdown 链接；${covers} 张封面图片未能设置；${pending} 张图片已进入编辑器，X 仍在完成媒体编号。`],
      [/^Article written(?: in (.+))?\. (.+) body image\(s\) stayed as Markdown links; (.+) image\(s\) are in the editor while X finishes media IDs\.(?: Replace unreachable image URLs with public links, then write again if those images must upload\.)?$/, (_, elapsed, images, pending) => elapsed ? `文章已写入，用时 ${elapsed}。${images} 张正文图片保留为 Markdown 链接；${pending} 张图片已进入编辑器，X 仍在完成媒体编号。` : `文章已写入。${images} 张正文图片保留为 Markdown 链接；${pending} 张图片已进入编辑器，X 仍在完成媒体编号。`],
      [/^Article written(?: in (.+))?\. (.+) table image\(s\) stayed as Markdown tables; (.+) cover image\(s\) could not be applied; (.+) image\(s\) are in the editor while X finishes media IDs\.$/, (_, elapsed, tables, covers, pending) => elapsed ? `文章已写入，用时 ${elapsed}。${tables} 个表格保留为 Markdown；${covers} 张封面图片未能设置；${pending} 张图片已进入编辑器，X 仍在完成媒体编号。` : `文章已写入。${tables} 个表格保留为 Markdown；${covers} 张封面图片未能设置；${pending} 张图片已进入编辑器，X 仍在完成媒体编号。`],
      [/^Article written(?: in (.+))?\. (.+) table image\(s\) stayed as Markdown tables; (.+) image\(s\) are in the editor while X finishes media IDs\.$/, (_, elapsed, tables, pending) => elapsed ? `文章已写入，用时 ${elapsed}。${tables} 个表格保留为 Markdown；${pending} 张图片已进入编辑器，X 仍在完成媒体编号。` : `文章已写入。${tables} 个表格保留为 Markdown；${pending} 张图片已进入编辑器，X 仍在完成媒体编号。`],
      [/^Article written(?: in (.+))?\. (.+) cover image\(s\) could not be applied; (.+) image\(s\) are in the editor while X finishes media IDs\.$/, (_, elapsed, covers, pending) => elapsed ? `文章已写入，用时 ${elapsed}。${covers} 张封面图片未能设置；${pending} 张图片已进入编辑器，X 仍在完成媒体编号。` : `文章已写入。${covers} 张封面图片未能设置；${pending} 张图片已进入编辑器，X 仍在完成媒体编号。`],
      [/^Article written(?: in (.+))?\. (.+) body image\(s\) stayed as Markdown links; (.+) table image\(s\) stayed as Markdown tables; (.+) cover image\(s\) could not be applied\.(?: Replace unreachable image URLs with public links, then write again if those images must upload\.)?$/, (_, elapsed, images, tables, covers) => elapsed ? `文章已写入，用时 ${elapsed}。${images} 张正文图片保留为 Markdown 链接；${tables} 个表格保留为 Markdown；${covers} 张封面图片未能设置。` : `文章已写入。${images} 张正文图片保留为 Markdown 链接；${tables} 个表格保留为 Markdown；${covers} 张封面图片未能设置。`],
      [/^Article written(?: in (.+))?\. (.+) body image\(s\) stayed as Markdown links; (.+) table image\(s\) stayed as Markdown tables\.(?: Replace unreachable image URLs with public links, then write again if those images must upload\.)?$/, (_, elapsed, images, tables) => elapsed ? `文章已写入，用时 ${elapsed}。${images} 张正文图片保留为 Markdown 链接；${tables} 个表格保留为 Markdown。` : `文章已写入。${images} 张正文图片保留为 Markdown 链接；${tables} 个表格保留为 Markdown。`],
      [/^Article written(?: in (.+))?\. (.+) body image\(s\) stayed as Markdown links; (.+) cover image\(s\) could not be applied\.(?: Replace unreachable image URLs with public links, then write again if those images must upload\.)?$/, (_, elapsed, images, covers) => elapsed ? `文章已写入，用时 ${elapsed}。${images} 张正文图片保留为 Markdown 链接；${covers} 张封面图片未能设置。` : `文章已写入。${images} 张正文图片保留为 Markdown 链接；${covers} 张封面图片未能设置。`],
      [/^Article written(?: in (.+))?\. (.+) body image\(s\) stayed as Markdown links\.(?: Replace unreachable image URLs with public links, then write again if those images must upload\.)?$/, (_, elapsed, images) => elapsed ? `文章已写入，用时 ${elapsed}。${images} 张正文图片保留为 Markdown 链接。` : `文章已写入。${images} 张正文图片保留为 Markdown 链接。`],
      [/^Article written(?: in (.+))?\. (.+) cover image\(s\) could not be applied\.$/, (_, elapsed, images) => elapsed ? `文章已写入，用时 ${elapsed}。${images} 张封面图片未能设置。` : `文章已写入。${images} 张封面图片未能设置。`],
      [/^Article written(?: in (.+))?\. (.+) image upload\(s\) timed out in X\. Wait a moment, then write again or split the article if it has many images\.$/, (_, elapsed, images) => elapsed ? `文章已写入，用时 ${elapsed}。${images} 张图片在 X 上传时等待过久。可以稍等后再次写入，或把多图文章拆成多篇。` : `文章已写入。${images} 张图片在 X 上传时等待过久。可以稍等后再次写入，或把多图文章拆成多篇。`],
      [/^Article written(?: in (.+))?\. (.+) image\(s\) are in the editor while X finishes media IDs\.$/, (_, elapsed, images) => elapsed ? `文章已写入，用时 ${elapsed}。${images} 张图片已进入编辑器，X 仍在完成媒体编号。` : `文章已写入。${images} 张图片已进入编辑器，X 仍在完成媒体编号。`],
      [/^Article written(?: in (.+))?\. (.+) table\(s\) kept as Markdown\.$/, (_, elapsed, tables) => elapsed ? `文章已写入，用时 ${elapsed}。${tables} 个表格保留为 Markdown。` : `文章已写入。${tables} 个表格保留为 Markdown。`],
      [/^Article written(?: in (.+))?\. (.+) table image\(s\) stayed as Markdown tables; (.+) cover image\(s\) could not be applied\.$/, (_, elapsed, tables, covers) => elapsed ? `文章已写入，用时 ${elapsed}。${tables} 个表格保留为 Markdown；${covers} 张封面图片未能设置。` : `文章已写入。${tables} 个表格保留为 Markdown；${covers} 张封面图片未能设置。`],
      [/^Article written(?: in (.+))?\. (.+) table image\(s\) stayed as Markdown tables\.$/, (_, elapsed, tables) => elapsed ? `文章已写入，用时 ${elapsed}。${tables} 个表格保留为 Markdown。` : `文章已写入。${tables} 个表格保留为 Markdown。`],
      [/^Article written(?: in (.+))?\. (.+) web image\(s\) stayed as Markdown links; (.+) table\(s\) kept as Markdown\.(?: Replace unreachable image URLs with public links, then write again if those images must upload\.)?$/, (_, elapsed, images, tables) => elapsed ? `文章已写入，用时 ${elapsed}。${images} 张网页图片保留为 Markdown 链接；${tables} 个表格保留为 Markdown。` : `文章已写入。${images} 张网页图片保留为 Markdown 链接；${tables} 个表格保留为 Markdown。`],
      [/^(\d+) local image\(s\) need a local image folder\.\.\.$/, "$1 张本地图片需要选择本地图片文件夹..."],
      [/^(\d+) local image\(s\) need a root folder\.$/, "$1 张本地图片需要选择根文件夹。"],
      [/^(\d+) local image\(s\) use relative paths\. Select the folder that contains (.+)\.$/, "$1 张本地图片使用相对路径。请选择包含 $2 的文件夹。"],
      [/^(\d+) local image\(s\) use relative paths\. Select the folder that contains your Markdown images\.$/, "$1 张本地图片使用相对路径。请选择包含 Markdown 图片的文件夹。"],
      [/^Local image folder set: (.+)$/, "本地图片文件夹已设置：$1"],
      [/^Old X Article Markdown Paste residue detected: (.+)$/, "检测到旧版 X Article Markdown Paste 残留：$1"],
      [/^Adding (\d+) dropped image(?:s)?\.\.\.$/, "正在添加 $1 张拖入的图片..."],
      [/^Adding (\d+) image(?:s)?\.\.\.$/, "正在添加 $1 张图片..."],
      [/^(\d+) image\(s\) handed to X's uploader; (\d+) image\(s\) skipped\.$/, "$1 张图片已交给 X 上传；$2 张图片已跳过。"],
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

  function articleExportShortLabel(mode) {
    return translateContentText(mode === "download" ? "Download MD" : "Copy MD");
  }

  function articleExportIconMarkup(mode) {
    if (normalizeArticleExportMode(mode) === "download") {
      return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3v11"/><path d="m7 10 5 5 5-5"/><path d="M5 19h14"/></svg>';
    }
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="8" y="8" width="10" height="12" rx="2"/><path d="M6 16H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"/></svg>';
  }

  function truncateText(text, maxLength) {
    const cleaned = normalizeText(text);
    return cleaned.length > maxLength ? `${cleaned.slice(0, Math.max(0, maxLength - 3))}...` : cleaned;
  }

  function setDatasetValueIfChanged(node, key, value) {
    const next = String(value ?? "");
    if (!node || !key || node.dataset[key] === next) return;
    node.dataset[key] = next;
  }

  function removeDatasetValueIfChanged(node, key) {
    if (!node || !key || !(key in node.dataset)) return;
    delete node.dataset[key];
  }

  function setAttributeValueIfChanged(node, attribute, value) {
    const next = String(value ?? "");
    if (!node || !attribute || node.getAttribute(attribute) === next) return;
    node.setAttribute(attribute, next);
  }

  function setBooleanPropertyIfChanged(node, property, value) {
    if (!node || !property || node[property] === value) return;
    node[property] = value;
  }

  function setClassPresenceIfChanged(node, className, present) {
    if (!node || !className || node.classList.contains(className) === present) return;
    node.classList.toggle(className, present);
  }

  function setTextContentIfChanged(node, value) {
    const next = String(value ?? "");
    if (!node || node.textContent === next) return;
    node.textContent = next;
  }

  function setSourceHtmlIfChanged(node, html) {
    const source = String(html ?? "");
    if (!node || node.__xposterSourceHtml === source) return false;
    node.__xposterSourceHtml = source;
    if (node.innerHTML !== source) node.innerHTML = source;
    return true;
  }

  function cachedElementNodes(root, key, collect, isValid) {
    if (!root) return null;
    const cacheKey = String(key || "");
    const cached = nodeCache.get(root)?.[cacheKey];
    if (cached && (!isValid || isValid(cached))) return cached;
    const nodes = collect(root);
    nodeCache.set(root, { ...(nodeCache.get(root) || {}), [cacheKey]: nodes });
    return nodes;
  }

  function setStylePropertyIfChanged(node, property, value) {
    const next = String(value ?? "");
    if (!node || !property || node.style.getPropertyValue(property) === next) return;
    node.style.setProperty(property, next);
  }

  function removeStylePropertyIfChanged(node, property) {
    if (!node || !property || !node.style.getPropertyValue(property)) return;
    node.style.removeProperty(property);
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
    setDatasetValueIfChanged(card, "theme", statusThemeFromPage());
    if (typeof chrome === "undefined" || !chrome.storage?.local) return;
    chrome.storage.local.get(THEME_STORAGE_KEY).then((stored) => {
      if (!card.isConnected) return;
      const selectedTheme = stored?.[THEME_STORAGE_KEY];
      setDatasetValueIfChanged(card, "theme", selectedTheme === "light" || selectedTheme === "dark"
        ? selectedTheme
        : statusThemeFromPage());
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
    if (/setting title/.test(normalized)) return 22;
    if (/writing into x editor|pasting structured/.test(normalized)) return 40;
    if (/inserting \d+ special/.test(normalized)) return 51;
    if (/uploading image/.test(normalized)) return progress(56, 24);
    if (/reordering uploaded/.test(normalized)) return 84;
    if (/setting cover/.test(normalized)) return 76;
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
    setDatasetValueIfChanged(card, "progress", hasProgress ? "determinate" : level === "work" ? "indeterminate" : "none");
    if (hasProgress) {
      const boundedPercent = Math.max(0, Math.min(100, percent));
      setDatasetValueIfChanged(card, "progressValue", boundedPercent);
      setStylePropertyIfChanged(card, "--__xposter-status-progress", `${boundedPercent}%`);
    } else {
      removeDatasetValueIfChanged(card, "progressValue");
      removeStylePropertyIfChanged(card, "--__xposter-status-progress");
    }
    setAttributeValueIfChanged(card, "aria-busy", String(level === "work"));
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
          <div class="__xposter_status_actions">
            <strong></strong>
            <button class="__xposter_status_stop" type="button" hidden></button>
          </div>
        </div>
        <p></p>
      `;
      statusCardNodes(card).stopButton?.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        cancelActiveImport();
      });
      document.body.appendChild(card);
      injectStatusStyle();
    }
    const { title, detail } = statusCardNodes(card);
    const previousLevel = card.dataset.level;
    setDatasetValueIfChanged(card, "level", level);
    setDatasetValueIfChanged(card, "statusText", text);
    syncStatusTheme(card);
    updateStatusProgress(card, text, level, previousLevel);
    setTextContentIfChanged(title, translateContentText(statusTitleForLevel(level)));
    setTextContentIfChanged(detail, translateContentText(text));
    syncStatusStopButton(card, level);
    setClassPresenceIfChanged(document.body, "__xposter_status_visible", true);
    broadcast({ type: "status", text, level });
    if (state.statusTimer) {
      window.clearTimeout(state.statusTimer);
      state.statusTimer = 0;
    }
    if (timeout) {
      const timer = window.setTimeout(() => {
        if (state.statusTimer !== timer) return;
        state.statusTimer = 0;
        hideStatus();
      }, timeout);
      state.statusTimer = timer;
    }
  }

  function statusCardNodes(card) {
    if (!card) return {};
    return cachedElementNodes(
      card,
      "status",
      (root) => ({
        title: root.querySelector("strong"),
        detail: root.querySelector("p"),
        stopButton: root.querySelector(".__xposter_status_stop")
      }),
      (nodes) => nodes.title?.isConnected && nodes.detail?.isConnected && nodes.stopButton?.isConnected
    );
  }

  function syncStatusStopButton(card = document.getElementById(STATUS_ID), level = card?.dataset?.level || "work") {
    const button = statusCardNodes(card).stopButton;
    if (!card || !button) return;
    const stopping = state.busy && state.cancelRequested;
    const canStop = state.busy && !stopping && (level === "work" || level === "warn");
    const visible = canStop || stopping;
    setBooleanPropertyIfChanged(button, "hidden", !visible);
    setBooleanPropertyIfChanged(button, "disabled", stopping);
    setTextContentIfChanged(button, translateContentText(stopping ? "Stopping..." : "Stop"));
    setAttributeValueIfChanged(button, "aria-label", translateContentText(stopping ? "Stopping..." : "Stop"));
    setDatasetValueIfChanged(card, "cancelling", String(stopping));
    setDatasetValueIfChanged(card, "cancellable", String(visible));
  }

  function hideStatus() {
    if (state.statusTimer) {
      window.clearTimeout(state.statusTimer);
      state.statusTimer = 0;
    }
    document.getElementById(STATUS_ID)?.remove();
    setClassPresenceIfChanged(document.body, "__xposter_status_visible", false);
    broadcast({ type: "status", text: "", level: "idle" });
  }

  function transientStatus(text, level = "export", timeout = 3000) {
    showStatus(text, level, timeout);
  }

  function prefersReducedMotion() {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches || false;
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
      const { title, detail } = statusCardNodes(status);
      setTextContentIfChanged(title, translateContentText(statusTitleForLevel(level)));
      setTextContentIfChanged(detail, translateContentText(status.dataset.statusText || contentSourceText(detail.textContent || "")));
      syncStatusStopButton(status, level);
    }
    updateArticleExportButtonMode();
    updateVisibleDropHintCopy();
  }

  async function restoreContentLanguage() {
    state.language = preferredContentLanguage();
    if (!chrome.storage?.local) return;
    const stored = await chrome.storage.local.get(LANGUAGE_STORAGE_KEY).catch(() => ({}));
    state.language = normalizeLanguage(stored[LANGUAGE_STORAGE_KEY] || state.language);
    syncVisibleLocalizedContent();
  }

  function installContentLanguageSync() {
    chrome.storage?.onChanged?.addListener((changes, areaName) => {
      if (areaName !== "local" || !changes[LANGUAGE_STORAGE_KEY]) return;
      state.language = normalizeLanguage(changes[LANGUAGE_STORAGE_KEY].newValue || "auto");
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
        pointer-events: auto;
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
      #${STATUS_ID} .__xposter_status_actions {
        display: inline-flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        min-width: 0;
      }
      #${STATUS_ID} .__xposter_status_stop {
        appearance: none;
        border: 1px solid color-mix(in oklch, var(--__xposter-status-tone), var(--__xposter-status-line) 54%);
        border-radius: 999px;
        padding: 3px 8px;
        background: color-mix(in oklch, var(--__xposter-status-tone), transparent 94%);
        color: var(--__xposter-status-tone-text);
        font: inherit;
        font-size: 11px;
        font-weight: 720;
        line-height: 1.25;
        cursor: pointer;
        transition: transform 140ms cubic-bezier(0.22, 1, 0.36, 1), background-color 140ms ease-out, border-color 140ms ease-out, opacity 140ms ease-out;
      }
      #${STATUS_ID} .__xposter_status_stop[hidden] {
        display: none;
      }
      #${STATUS_ID} .__xposter_status_stop:hover {
        transform: translateY(-1px);
        background: color-mix(in oklch, var(--__xposter-status-tone), transparent 88%);
      }
      #${STATUS_ID} .__xposter_status_stop:active {
        transform: translateY(0) scale(0.97);
      }
      #${STATUS_ID} .__xposter_status_stop:disabled {
        cursor: default;
        opacity: 0.72;
        transform: none;
      }
      #${STATUS_ID}[data-cancelling="true"] .__xposter_status_stop {
        animation: __xposter_status_stop_pulse 1.2s ease-in-out infinite;
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
      @keyframes __xposter_status_stop_pulse {
        0%, 100% { opacity: 0.68; }
        50% { opacity: 1; }
      }
      @media (prefers-reduced-motion: reduce) {
        #${STATUS_ID},
        #${STATUS_ID}[data-cancelling="true"] .__xposter_status_stop,
        #${STATUS_ID}[data-progress="indeterminate"]::before {
          animation: none;
        }
        #${STATUS_ID} .__xposter_status_stop {
          transition: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function injectSuccessCelebrationStyle() {
    if (document.getElementById(SUCCESS_CELEBRATION_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = SUCCESS_CELEBRATION_STYLE_ID;
    style.textContent = `
      #${SUCCESS_CELEBRATION_ID} {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        height: 100dvh;
        z-index: 2147483646;
        pointer-events: none;
        overflow: hidden;
        contain: layout paint style;
      }
      #${SUCCESS_CELEBRATION_ID} .__xposter_success_mark {
        position: absolute;
        left: 50vw;
        top: 42vh;
        top: 42dvh;
        width: 88px;
        height: 88px;
        border: 1px solid rgba(29, 155, 240, 0.28);
        border-radius: 999px;
        display: grid;
        place-items: center;
        background: rgba(255, 255, 255, 0.92);
        color: #00ba7c;
        box-shadow: 0 18px 42px rgba(15, 20, 25, 0.16);
        transform: translate3d(-50%, -50%, 0) scale(0.92);
        animation: __xposter_success_mark 1800ms cubic-bezier(0.22, 1, 0.36, 1) both;
      }
      #${SUCCESS_CELEBRATION_ID} .__xposter_success_mark svg {
        width: 38px;
        height: 38px;
        fill: currentColor;
      }
      #${SUCCESS_CELEBRATION_ID} .__xposter_success_piece {
        position: absolute;
        left: var(--__xposter-success-start-x, 50vw);
        top: var(--__xposter-success-start-y, 50vh);
        width: var(--__xposter-success-width, 7px);
        height: var(--__xposter-success-height, 13px);
        border-radius: var(--__xposter-success-radius, 2px);
        background: var(--__xposter-success-piece, #1d9bf0);
        opacity: 0;
        transform: translate3d(-50%, -50%, 0) rotate(var(--__xposter-success-angle, 0deg));
        transform-origin: center;
        will-change: transform, opacity;
        animation: __xposter_success_piece 2600ms cubic-bezier(0.16, 1, 0.3, 1) both;
        animation-delay: var(--__xposter-success-delay, 0ms);
      }
      @keyframes __xposter_success_mark {
        0% { opacity: 0; transform: translate3d(-50%, -50%, 0) scale(0.92); }
        18% { opacity: 1; transform: translate3d(-50%, -50%, 0) scale(1); }
        72% { opacity: 1; transform: translate3d(-50%, -54%, 0) scale(1); }
        100% { opacity: 0; transform: translate3d(-50%, -72%, 0) scale(0.98); }
      }
      @keyframes __xposter_success_piece {
        0% {
          opacity: 0;
          transform: translate3d(-50%, -50%, 0) rotate(var(--__xposter-success-angle, 0deg)) scale(0.72);
        }
        10% { opacity: 1; }
        72% { opacity: 0.88; }
        100% {
          opacity: 0;
          transform:
            translate3d(
              calc(-50% + var(--__xposter-success-x, 0px)),
              calc(-50% + var(--__xposter-success-y, -120px)),
              0
            )
            rotate(calc(var(--__xposter-success-angle, 0deg) + 120deg))
            scale(var(--__xposter-success-scale, 0.92));
        }
      }
      @media (prefers-color-scheme: dark) {
        #${SUCCESS_CELEBRATION_ID} .__xposter_success_mark {
          background: rgba(22, 24, 28, 0.92);
          border-color: rgba(102, 169, 216, 0.34);
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.34);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        #${SUCCESS_CELEBRATION_ID} .__xposter_success_mark {
          opacity: 1;
          transform: translate3d(-50%, -50%, 0) scale(1);
          animation: none;
        }
        #${SUCCESS_CELEBRATION_ID} .__xposter_success_piece {
          display: none;
          animation: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function showSuccessCelebration({ colors = [] } = {}) {
    injectSuccessCelebrationStyle();
    document.getElementById(SUCCESS_CELEBRATION_ID)?.remove();
    const root = document.createElement("div");
    root.id = SUCCESS_CELEBRATION_ID;
    root.setAttribute("aria-hidden", "true");
    const mark = document.createElement("div");
    mark.className = "__xposter_success_mark";
    mark.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.4 16.6 4.8 12l-1.4 1.4 6 6L21 7.8 19.6 6.4 9.4 16.6Z"/></svg>';
    root.appendChild(mark);
    if (!prefersReducedMotion()) {
      const palette = colors.length ? colors : ["#0f1419", "#536471", "#1d9bf0", "#00ba7c", "#cfd9de"];
      for (let index = 0; index < SUCCESS_CELEBRATION_PIECE_COUNT; index += 1) {
        const piece = document.createElement("span");
        const startX = 6 + ((index * 17) % 89);
        const startY = 6 + ((index * 29) % 82);
        const driftX = ((index * 37) % 39) - 19;
        const driftY = ((index * 31) % 55) - 18;
        const width = 5 + (index % 4);
        const height = index % 5 === 0 ? width : 10 + (index % 5) * 2;
        piece.className = "__xposter_success_piece";
        piece.style.setProperty("--__xposter-success-piece", palette[index % palette.length]);
        piece.style.setProperty("--__xposter-success-start-x", `${startX}vw`);
        piece.style.setProperty("--__xposter-success-start-y", `${startY}vh`);
        piece.style.setProperty("--__xposter-success-x", `${driftX}vw`);
        piece.style.setProperty("--__xposter-success-y", `${driftY}vh`);
        piece.style.setProperty("--__xposter-success-width", `${width}px`);
        piece.style.setProperty("--__xposter-success-height", `${height}px`);
        piece.style.setProperty("--__xposter-success-radius", index % 5 === 0 ? "999px" : "2px");
        piece.style.setProperty("--__xposter-success-scale", `${0.72 + (index % 4) * 0.08}`);
        piece.style.setProperty("--__xposter-success-angle", `${index * 23}deg`);
        piece.style.setProperty("--__xposter-success-delay", `${(index % 18) * 22}ms`);
        root.appendChild(piece);
      }
    }
    document.body.appendChild(root);
    window.setTimeout(() => root.remove(), SUCCESS_CELEBRATION_DURATION_MS);
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
      mode: normalizeArticleExportMode(settings.mode),
      preferredAction: normalizeArticleExportMode(settings.preferredAction || settings.mode)
    };
  }

  function articleExportSettingsPayload() {
    return {
      enabled: state.articleExport.enabled !== false,
      mode: normalizeArticleExportMode(state.articleExport.mode),
      preferredAction: normalizeArticleExportMode(state.articleExport.mode)
    };
  }

  function applyArticleExportSettings(settings = {}) {
    const normalized = normalizeArticleExportSettings(settings);
    state.articleExport.enabled = normalized.enabled;
    state.articleExport.mode = normalized.preferredAction;
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

  function articleMediaUploadEstimate(parsed = null, options = {}) {
    const segments = Array.isArray(parsed?.segments) ? parsed.segments : [];
    const coverSource = options.setCover === false ? "" : String(parsed?.cover || "").trim();
    let bodyImages = 0;
    let tables = 0;
    let coverInBody = false;
    for (const segment of segments) {
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

  function mediaLimitText(template, estimate) {
    const total = Number(estimate?.total || 0);
    return String(template || "")
      .replace("{count}", String(total))
      .replace("{limit}", String(X_ARTICLE_MEDIA_SOFT_LIMIT))
      .replace("{extra}", String(Math.max(0, total - X_ARTICLE_MEDIA_SOFT_LIMIT)));
  }

  function mediaLimitWarningText(estimate) {
    return mediaLimitText(X_ARTICLE_MEDIA_LIMIT_WARNING, estimate);
  }

  function mediaHeadroomText(estimate) {
    return mediaLimitText(X_ARTICLE_MEDIA_HEADROOM_NOTE, estimate);
  }

  function preflightArticleMediaLimit(markdown, options = {}) {
    const importOptions = normalizeImportOptions(options);
    const parsed = shared.parseMarkdown(markdown || "", importOptions);
    const estimate = articleMediaUploadEstimate(parsed, importOptions);
    if (estimate.overSoftLimit) {
      return {
        ok: false,
        parsed,
        estimate,
        error: mediaLimitWarningText(estimate),
        mediaLimit: true
      };
    }
    return {
      ok: true,
      parsed,
      estimate,
      warning: estimate.nearSoftLimit ? mediaHeadroomText(estimate) : ""
    };
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
        }, MAIN_WORLD_SILENCE_TIMEOUT_MS);
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
          const error = new Error(message.error || "X editor bridge failed");
          error.mainSummary = message.summary || null;
          reject(error);
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
    const forceNewArticle = Boolean(options.forceNewArticle);
    state.busy = true;
    state.cancelRequested = false;
    state.currentMarkdown = markdown;
    const startedAt = performance.now();
    showStatus("Preparing Markdown...", "work");
    try {
      throwIfImportCancelled();
      if (!isArticleRoute()) throw new Error("Open X Articles first");
      if (origin !== "paste" && (forceNewArticle || !findEditor())) {
        await ensureEditorReadyForFileImport({ forceNew: forceNewArticle });
      }
      throwIfImportCancelled();
      const parsed = shared.parseMarkdown(markdown, importOptions);
      const { segments, dropped } = shared.applyLimits(parsed.segments, DEFAULT_LIMITS);
      const limitedParsed = { ...parsed, segments };
      const counts = shared.segmentCounts(segments);
      broadcast({ type: "parsed", parsed: { title: parsed.title, cover: parsed.cover, counts } });
      const mediaEstimate = articleMediaUploadEstimate(limitedParsed, importOptions);
      if (mediaEstimate.overSoftLimit) {
        const limitMessage = mediaLimitWarningText(mediaEstimate);
        showStatus(limitMessage, "warn", 9000);
        broadcast({ type: "preflight-blocked", level: "warn", text: limitMessage, mediaLimit: true, estimate: mediaEstimate });
        return { ok: false, error: limitMessage, mediaLimit: true, estimate: mediaEstimate };
      }

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
      const localImageReferences = coverLocalImage ? [...localImages, coverLocalImage] : localImages;
      if (localImageReferences.length) {
        await ensureVaultForLocalImages(localImageReferences.length, localImageReferences);
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
        .concat(coverResult && !coverResult.ok ? collectMediaFailures(new Map([[coverSegment, coverResult]]), "cover") : [])
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
      return { ok: false, error: message, mainSummary: error?.mainSummary || null };
    } finally {
      state.busy = false;
      state.cancelRequested = false;
      state.activeRun = null;
      state.currentMarkdown = "";
      syncStatusStopButton();
    }
  }

  function firstLocalImageFolderHintForSegments(segments = []) {
    const segment = segments.find((item) => shared.isLocalImageSource(item?.source));
    const source = String(segment?.source || "").trim();
    const candidates = source ? shared.localImagePathCandidates(source) : [];
    const parts = candidates[0] || [];
    return parts.length > 1 ? parts[0] : "";
  }

  async function ensureVaultForLocalImages(count, segments = []) {
    const existing = await shared.getVaultRecord().catch(() => null);
    if (existing?.handle && (await shared.queryReadPermission(existing.handle)) === "granted") return;
    if (typeof window.showDirectoryPicker !== "function") {
      throw new Error("Local image folder picker is unavailable in this tab. Open the X Article tab in Chrome, then choose the folder that contains your Markdown images.");
    }
    showStatus(`${count} local image(s) need a local image folder...`, "warn");
    const result = await promptVaultSelection({ count, hint: firstLocalImageFolderHintForSegments(segments) });
    if (!result.ok) throw new Error(result.error || "Local image folder was not selected");
  }

  function isRemoteHttpImageSource(source) {
    return shared.isRemoteHttpImageSource(source);
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

  function promptVaultSelection(options = {}) {
    const count = typeof options === "number" ? options : Number(options?.count || 0);
    const hint = typeof options === "number" ? "" : String(options?.hint || "").trim();
    return new Promise((resolve) => {
      document.getElementById("__xposter_vault_prompt__")?.remove();
      const overlay = document.createElement("div");
      overlay.id = "__xposter_vault_prompt__";
      overlay.dataset.theme = statusThemeFromPage();
      overlay.innerHTML = `
        <style>
          #__xposter_vault_prompt__ {
            --__xposter-vault-paper: #ffffff;
            --__xposter-vault-paper-2: #f7f9f9;
            --__xposter-vault-ink: #0f1419;
            --__xposter-vault-muted: #536471;
            --__xposter-vault-line: #cfd9de;
            --__xposter-vault-signal: #1d9bf0;
            --__xposter-vault-button: #0f1419;
            --__xposter-vault-button-ink: #ffffff;
            position: fixed;
            inset: 0;
            z-index: 2147483646;
            display: grid;
            place-items: center;
            padding: 20px;
            background: rgba(15, 20, 25, 0.44);
            color: var(--__xposter-vault-ink);
            font: 14px/1.55 ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif;
            letter-spacing: 0;
          }
          #__xposter_vault_prompt__[data-theme="dark"] {
            --__xposter-vault-paper: #121a22;
            --__xposter-vault-paper-2: #1a2630;
            --__xposter-vault-ink: #d6dee6;
            --__xposter-vault-muted: #8b99a6;
            --__xposter-vault-line: #33414d;
            --__xposter-vault-signal: #66a9d8;
            --__xposter-vault-button: #d7dee5;
            --__xposter-vault-button-ink: #111820;
            background: rgba(0, 0, 0, 0.58);
          }
          #__xposter_vault_prompt__ .__xposter_vault_panel {
            width: min(440px, calc(100vw - 40px));
            padding: 20px;
            border: 1px solid var(--__xposter-vault-line);
            background: var(--__xposter-vault-paper);
            box-shadow: 0 22px 60px rgba(15, 20, 25, 0.22);
          }
          #__xposter_vault_prompt__[data-theme="dark"] .__xposter_vault_panel {
            box-shadow: 0 24px 66px rgba(0, 0, 0, 0.38);
          }
          #__xposter_vault_prompt__ .__xposter_vault_title {
            margin: 0 0 5px;
            font-size: 17px;
            font-weight: 780;
            line-height: 1.25;
          }
          #__xposter_vault_prompt__ .__xposter_vault_detail {
            margin: 0 0 14px;
            color: var(--__xposter-vault-muted);
          }
          #__xposter_vault_prompt__ .__xposter_vault_note {
            margin-bottom: 16px;
            padding: 10px 12px;
            border: 1px solid color-mix(in oklch, var(--__xposter-vault-line), transparent 18%);
            background: color-mix(in oklch, var(--__xposter-vault-paper-2), var(--__xposter-vault-paper) 38%);
            color: var(--__xposter-vault-muted);
            font-size: 12px;
          }
          #__xposter_vault_prompt__ code {
            color: var(--__xposter-vault-ink);
            font: 11.5px/1.3 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          }
          #__xposter_vault_prompt__ .__xposter_vault_actions {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
          }
          #__xposter_vault_prompt__ button {
            min-height: 36px;
            border: 0;
            padding: 0 13px;
            font: inherit;
            font-size: 13px;
            font-weight: 760;
            cursor: pointer;
          }
          #__xposter_vault_prompt__ .__xposter_vault_skip {
            border: 1px solid var(--__xposter-vault-line);
            background: var(--__xposter-vault-paper);
            color: var(--__xposter-vault-ink);
          }
          #__xposter_vault_prompt__ .__xposter_vault_pick {
            background: var(--__xposter-vault-button);
            color: var(--__xposter-vault-button-ink);
          }
          #__xposter_vault_prompt__ button:hover {
            filter: brightness(0.98);
          }
          #__xposter_vault_prompt__ button:focus-visible {
            outline: 2px solid color-mix(in oklch, var(--__xposter-vault-signal), transparent 24%);
            outline-offset: 2px;
          }
          @media (prefers-reduced-motion: reduce) {
            #__xposter_vault_prompt__ button {
              transition: none;
            }
          }
        </style>
      `;

      const panel = document.createElement("div");
      panel.className = "__xposter_vault_panel";
      const title = translateContentText("Local image folder");
      const detail = translateContentText(
        count
          ? hint
            ? `${count} local image(s) use relative paths. Select the folder that contains ${hint}.`
            : `${count} local image(s) use relative paths. Select the folder that contains your Markdown images.`
          : "Choose the folder that contains your Markdown images."
      );
      const helpPath = hint || "img";
      const helpStart = translateContentText("If your Markdown says");
      const helpMiddle = translateContentText("choose the folder that contains the");
      const helpEnd = translateContentText("directory.");
      const helpJoiner = isChineseLanguage() ? "，" : ", ";
      const skipLabel = translateContentText("Cancel write");
      const chooseLabel = translateContentText("Choose folder");
      panel.innerHTML = `
        <div class="__xposter_vault_title">${shared.escapeHtml(title)}</div>
        <div class="__xposter_vault_detail">${shared.escapeHtml(detail)}</div>
        <div class="__xposter_vault_note">
          ${shared.escapeHtml(helpStart)} <code>![](./${shared.escapeHtml(helpPath)}/cover.png)</code>${helpJoiner}${shared.escapeHtml(helpMiddle)} <code>${shared.escapeHtml(helpPath)}</code> ${shared.escapeHtml(helpEnd)}
        </div>
        <div class="__xposter_vault_actions">
          <button id="xposter-vault-skip" class="__xposter_vault_skip" type="button">${shared.escapeHtml(skipLabel)}</button>
          <button id="xposter-vault-pick" class="__xposter_vault_pick" type="button">${shared.escapeHtml(chooseLabel)}</button>
        </div>
      `;
      overlay.appendChild(panel);
      document.body.appendChild(overlay);

      const finish = (value) => {
        overlay.remove();
        resolve(value);
      };
      panel.addEventListener("click", async (event) => {
        const button = event.target.closest?.("button");
        if (button?.id === "xposter-vault-skip") {
          finish({ ok: false, error: "Local image folder was not selected" });
          return;
        }
        if (button?.id !== "xposter-vault-pick") return;
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
              ? { ok: false, error: "Local image folder was not selected" }
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
      try {
        last = await loadImage(source, fallbackName);
      } catch (error) {
        if (error?.cancelled) throw error;
        last = { ok: false, error: error?.message || "Image fetch failed", source };
      }
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
        else if (failure.kind === "cover") summary.covers += 1;
        else summary.images += 1;
        return summary;
      },
      { images: 0, tables: 0, covers: 0 }
    );
    return {
      total: failures.length,
      ...byKind,
      first: failures[0] || null
    };
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

  function formatCompletionMessage(summary) {
    const warnings = summary?.mediaWarnings || {};
    const uploadFailures = mediaUploadFailureCounts(summary?.main);
    const elapsed = summary?.elapsedMs ? ` in ${(summary.elapsedMs / 1000).toFixed(1)}s` : "";
    const skippedImages = Number(warnings.images || 0) + uploadFailures.image;
    const skippedTables = Number(warnings.tables || 0) + uploadFailures.table;
    const skippedCovers = Number(warnings.covers || 0) + uploadFailures.cover + coverApplicationFailureCount(summary, uploadFailures);
    const pendingUploads = Number(summary?.main?.imgPending || 0);
    if (uploadFailures.timeout) {
      return `Article written${elapsed}. ${uploadFailures.timeout} image upload(s) timed out in X. Wait a moment, then write again or split the article if it has many images.`;
    }
    if (skippedImages || skippedTables || skippedCovers || pendingUploads) {
      const parts = [];
      if (skippedImages) {
        parts.push(`${skippedImages} body image(s) stayed as Markdown links`);
      }
      if (skippedTables) parts.push(`${skippedTables} table image(s) stayed as Markdown tables`);
      if (skippedCovers) parts.push(`${skippedCovers} cover image(s) could not be applied`);
      if (pendingUploads) parts.push(`${pendingUploads} image(s) are in the editor while X finishes media IDs`);
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
    return importMarkdown(text, origin, { sourceFileName: file.name || "" });
  }

  async function openArticlePageForPendingImport(markdown = "", source = "drop", options = {}) {
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
    const pendingSourceFileName = pending?.fileName || options.sourceFileName || options.fileName || "";
    return importMarkdown(pending?.markdown || markdown, pending?.source || source, { sourceFileName: pendingSourceFileName });
  }

  async function stageSingleMarkdownForArticle(markdown, { fileName = "", source = "drop" } = {}) {
    const text = String(markdown || "");
    if (!text.trim()) {
      showStatus("Drop a Markdown file or Markdown text.", "warn", 5000);
      return { ok: false, error: "No Markdown content" };
    }
    const sourceFileName = normalizeSourceFileName(fileName);
    const preflight = preflightArticleMediaLimit(text, { sourceFileName });
    if (!preflight.ok) {
      showStatus(preflight.error, "warn", 9000);
      broadcast({
        type: "preflight-blocked",
        level: "warn",
        text: preflight.error,
        mediaLimit: true,
        estimate: preflight.estimate,
        fileName,
        source
      });
      return { ok: false, error: preflight.error, mediaLimit: true, estimate: preflight.estimate };
    }
    if (preflight.warning) {
      showStatus(preflight.warning, "warn", 6500);
      await sleep(650);
    }
    const stored = await savePendingArticleImport(text, { fileName, source });
    showStatus("Opening X Article...", "work");
    try {
      if (!stored) {
        await ensureEditorReadyForFileImport();
        return importMarkdown(text, source, { sourceFileName });
      }
      if (isArticleRoute()) {
        await ensureEditorReadyForFileImport();
        const pending = await takePendingArticleImport();
        return importMarkdown(pending?.markdown || text, pending?.source || source, { sourceFileName: pending?.fileName || sourceFileName });
      }
      return openArticlePageForPendingImport(text, source, { sourceFileName });
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
      const sourceFileName = normalizeSourceFileName(pending.fileName);
      const preflight = preflightArticleMediaLimit(pending.markdown, { sourceFileName });
      if (!preflight.ok) {
        await discardPendingArticleImport();
        showStatus(preflight.error, "warn", 9000);
        broadcast({
          type: "preflight-blocked",
          level: "warn",
          text: preflight.error,
          mediaLimit: true,
          estimate: preflight.estimate,
          fileName: pending.fileName || "",
          source: pending.source || "drop"
        });
        return;
      }
      if (preflight.warning) {
        showStatus(preflight.warning, "warn", 6500);
        await sleep(650);
      }
      await ensureEditorReadyForFileImport();
      const stored = await takePendingArticleImport();
      await importMarkdown(stored?.markdown || pending.markdown, stored?.source || pending.source || "drop", {
        sourceFileName: stored?.fileName || sourceFileName
      });
    } catch (error) {
      showStatus(error?.message || "Could not write dropped Markdown", "error", 7000);
    }
  }

  function queueItemId(prefix = "queue") {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function markdownTitleForQueue(markdown, fallback = "Untitled Markdown") {
    try {
      const parsed = shared.parseMarkdown(markdown || "", { sourceFileName: fallback });
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
    return partitionTransferFiles(transferFilesFromDataTransfer(dataTransfer)).imageFiles;
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
          const error = new Error(message.error || "X image upload failed");
          error.failures = message.failures || message.summary?.failures || null;
          error.summary = message.summary || null;
          reject(error);
        }
      };
      window.addEventListener("message", listener);
      window.postMessage({ source: CHANNEL_TO_MAIN, kind: "upload-files", requestId, files }, "*");
    });
  }

  function uploadFilesFailureCount(summary = {}) {
    return Number(summary.failed || 0) || (Array.isArray(summary.failures) ? summary.failures.length : 0);
  }

  function formatUploadFilesMessage(summary = {}, requestedCount = 0) {
    const count = Number(summary.count || 0) || Number(requestedCount || 0);
    const failed = uploadFilesFailureCount(summary);
    return failed
      ? `${count} image(s) handed to X's uploader; ${failed} image(s) skipped.`
      : `${count} image(s) handed to X's uploader.`;
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
      const skipped = uploadFilesFailureCount(summary);
      const message = formatUploadFilesMessage(summary, payloads.length);
      showStatus(message, skipped ? "warn" : "done", skipped ? 8000 : 5000);
      broadcast({ type: "status", text: message, level: skipped ? "warn" : "done" });
      return { ok: true, summary };
    } catch (error) {
      const skipped = Array.isArray(error?.failures) ? error.failures.length : 0;
      const message = skipped ? `${error?.message || String(error)}; ${skipped} image(s) skipped.` : error?.message || String(error);
      showStatus(message, "error", 7000);
      broadcast({ type: "error", error: message });
      return { ok: false, error: message };
    } finally {
      state.busy = false;
    }
  }

  function articleBodyHasFocus() {
    const editor = findEditor();
    const active = document.activeElement;
    if (!editor || !active) return false;
    return active === editor || editor.contains(active);
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
      const skipped = uploadFilesFailureCount(summary);
      const message = formatUploadFilesMessage(summary, 1);
      showStatus(message, skipped ? "warn" : "done", skipped ? 8000 : 5000);
      broadcast({ type: "status", text: message, level: skipped ? "warn" : "done" });
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

  async function ensureEditorReadyForFileImport({ forceNew = false } = {}) {
    if (!forceNew && isEditorRoute() && findEditor()) return;
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
    return !isArticleRoute() && (
      articleExportPathInfo().readable ||
      Boolean(document.querySelector(ARTICLE_EXPORT_LONGFORM_SELECTOR))
    );
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
    const root = ensureArticleExportRoot();
    if (!root) return;
    setDatasetValueIfChanged(root, "articleTitle", article.title || "");
    setDatasetValueIfChanged(root, "articleMarkdown", article.markdown);
    setDatasetValueIfChanged(root, "articleFileName", article.fileName || articleFileName(article.title));
    setDatasetValueIfChanged(root, "articleCharacterCount", article.characterCount || 0);
    setDatasetValueIfChanged(root, "articleImageCount", article.imageCount || 0);
    setDatasetValueIfChanged(root, "mode", normalizeArticleExportMode(state.articleExport.mode));
    placeArticleExportRoot(root, article);
    updateArticleExportButtonMode();
  }

  function removeArticleExportButton() {
    state.articleExport.root = null;
    document.getElementById(ARTICLE_EXPORT_ID)?.remove();
  }

  function ensureArticleExportRoot() {
    if (!document.body) return null;
    let root = document.getElementById(ARTICLE_EXPORT_ID);
    if (!root) {
      root = document.createElement("span");
      root.id = ARTICLE_EXPORT_ID;
      root.dataset.motion = "entered";
      root.setAttribute("role", "group");
      root.setAttribute("aria-label", translateContentText("Article title Markdown tools"));
      root.innerHTML = `
        <span class="__xposter_article_export_mark" aria-hidden="true">${translateContentText("MD")}</span>
        <span class="__xposter_article_export_actions">
          <button class="__xposter_article_export_action" type="button" data-export-action="copy" data-export-icon="copy"></button>
          <button class="__xposter_article_export_action" type="button" data-export-action="download" data-export-icon="download"></button>
        </span>
        <span class="__xposter_article_export_feedback" aria-live="polite"></span>
      `;
      root.addEventListener("click", handleArticleExportActionClick);
      window.setTimeout(() => {
        if (root.isConnected && root.dataset.motion === "entered") delete root.dataset.motion;
      }, 320);
    }
    state.articleExport.root = root;
    return root;
  }

  function updateArticleExportButtonMode() {
    const root = document.getElementById(ARTICLE_EXPORT_ID);
    if (!root) return;
    setAttributeValueIfChanged(root, "aria-label", translateContentText("Article title Markdown tools"));
    const mode = normalizeArticleExportMode(state.articleExport.mode);
    setDatasetValueIfChanged(root, "mode", mode);
    const { mark, buttons } = articleExportNodes(root);
    setTextContentIfChanged(mark, translateContentText("MD"));
    buttons.forEach((button) => {
      const buttonMode = normalizeArticleExportMode(button.dataset.exportAction);
      const title = articleExportLabel(buttonMode);
      removeDatasetValueIfChanged(button, "active");
      setSourceHtmlIfChanged(button, articleExportIconMarkup(buttonMode));
      setAttributeValueIfChanged(button, "title", title);
      setAttributeValueIfChanged(button, "aria-label", title);
    });
  }

  function articleExportNodes(root) {
    if (!root) return { mark: null, buttons: [], feedback: null };
    return cachedElementNodes(
      root,
      "articleExport",
      (container) => ({
        mark: container.querySelector(".__xposter_article_export_mark"),
        buttons: Array.from(container.querySelectorAll("[data-export-action]")),
        feedback: container.querySelector(".__xposter_article_export_feedback")
      }),
      (nodes) => nodes.mark?.isConnected && nodes.feedback?.isConnected && nodes.buttons?.every((button) => button.isConnected)
    );
  }

  async function handleArticleExportActionClick(event) {
    const button = event.target.closest("[data-export-action]");
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    await handleArticleExportAction(button.dataset.exportAction);
  }

  async function handleArticleExportAction(action) {
    const root = document.getElementById(ARTICLE_EXPORT_ID);
    const article = articleExportPayload(root);
    const mode = normalizeArticleExportMode(action || state.articleExport.mode);
    await setArticleExportMode(mode);
    if (!article.markdown) {
      signalArticleExportFeedback(root, "warn");
      transientStatus("No readable article text found.", "warn", 3500);
      return;
    }
    try {
      if (mode === "download") {
        downloadMarkdown(article.markdown, article.fileName);
        notifyArticleExportSuccess(root, "download", article);
      } else {
        await copyText(article.markdown);
        notifyArticleExportSuccess(root, "copy", article);
      }
      signalArticleExportFeedback(root, "done");
    } catch (error) {
      signalArticleExportFeedback(root, "error");
      transientStatus(error?.message || "Could not export Markdown", "error", 5000);
    }
  }

  function articleExportPayload(root) {
    return {
      markdown: String(root?.dataset.articleMarkdown || ""),
      fileName: root?.dataset.articleFileName || articleFileName(root?.dataset.articleTitle || ""),
      characterCount: Number(root?.dataset.articleCharacterCount || 0) || markdownCharacterCount(root?.dataset.articleMarkdown || ""),
      imageCount: Number(root?.dataset.articleImageCount || 0) || markdownImageCount(root?.dataset.articleMarkdown || "")
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

  function notifyArticleExportSuccess(root, mode, article) {
    const message = articleExportSuccessText(mode, article);
    setArticleExportInlineFeedback(root, message, "done");
    transientStatus(message, "export", 4200);
  }

  function articleExportSuccessText(mode, article) {
    const fileName = article.fileName || articleFileName("");
    const characters = formatContentNumber(article.characterCount || markdownCharacterCount(article.markdown));
    const images = formatContentNumber(article.imageCount || markdownImageCount(article.markdown));
    if (isChineseLanguage()) {
      return `${mode === "download" ? "已下载" : "已复制"} ${fileName}，${characters} 个字符，${images} 张图片。`;
    }
    return `${mode === "download" ? "Downloaded" : "Copied"} ${fileName}, ${characters} characters, ${images} images.`;
  }

  function formatContentNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number.toLocaleString(isChineseLanguage() ? "zh-CN" : "en-US") : "0";
  }

  function setArticleExportInlineFeedback(root, message, tone = "done", timeout = 4200) {
    if (!root) return;
    const { feedback } = articleExportNodes(root);
    if (!feedback) return;
    window.clearTimeout(state.articleExport.inlineFeedbackTimer);
    setTextContentIfChanged(feedback, message);
    setBooleanPropertyIfChanged(feedback, "hidden", false);
    setDatasetValueIfChanged(root, "inlineFeedback", tone);
    state.articleExport.inlineFeedbackTimer = window.setTimeout(() => {
      if (!root.isConnected || root.dataset.inlineFeedback !== tone) return;
      setBooleanPropertyIfChanged(feedback, "hidden", true);
      setTextContentIfChanged(feedback, "");
      removeDatasetValueIfChanged(root, "inlineFeedback");
    }, timeout);
  }

  function markdownCharacterCount(markdown) {
    return normalizeText(String(markdown || "")
      .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
      .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/^>\s?/gm, "")
      .replace(/[`*_~\\]/g, "")
      .replace(/^-{3,}$/gm, " "))
      .length;
  }

  function markdownImageCount(markdown) {
    return (String(markdown || "").match(/!\[[^\]]*]\([^)]*\)/g) || []).length;
  }

  function placeArticleExportRoot(root, article) {
    const anchor = article?.titleNode || articleTitleAnchor(article?.container);
    if (anchor?.parentElement) {
      if (root.parentElement !== anchor) anchor.appendChild(root);
      setDatasetValueIfChanged(root, "placement", "inline");
      removeStylePropertyIfChanged(root, "--__xposter-article-export-inline-end");
      return;
    }
    if (root.parentElement !== document.body) document.body.appendChild(root);
    setDatasetValueIfChanged(root, "placement", "fixed");
    setStylePropertyIfChanged(root, "--__xposter-article-export-inline-end", `${articleDockInlineEnd(article?.container)}px`);
  }

  function articleTitleAnchor(container) {
    return detectArticleExportTitleNode(container) ||
      Array.from(container?.querySelectorAll?.("h1, h2, [role='heading'], [data-testid='twitter-article-title']") || [])
        .find((node) => normalizeText(node.innerText || node.textContent || ""));
  }

  function signalArticleExportFeedback(root, tone = "done") {
    if (!root) return;
    window.clearTimeout(state.articleExport.feedbackTimer);
    removeDatasetValueIfChanged(root, "feedback");
    void root.offsetWidth;
    setDatasetValueIfChanged(root, "feedback", tone);
    state.articleExport.feedbackTimer = window.setTimeout(() => {
      if (root.isConnected && root.dataset.feedback === tone) removeDatasetValueIfChanged(root, "feedback");
    }, 900);
  }

  function extractReadableXArticle() {
    if (!hasReadableArticleSignal()) return null;
    const longformRoots = Array.from(document.querySelectorAll(ARTICLE_EXPORT_LONGFORM_SELECTOR));
    const articleAnchorSelector = articleExportAnchorSelector();
    const articleRoots = articleAnchorSelector
      ? Array.from(document.querySelectorAll(articleAnchorSelector))
      : [];
    const candidates = Array.from(new Set(
      longformRoots
        .concat(articleRoots)
        .flatMap((node) => [node.closest("article"), node].filter(Boolean))
    ));
    return candidates
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
    if (!containerHasReadableArticleSignal(container)) return null;
    const titleNode = detectArticleExportTitleNode(container);
    const parts = removeDuplicateArticleTitleParts(
      articleMarkdownParts(container, { titleNode }),
      detectArticleExportTitle(container, [], titleNode)
    );
    const title = detectArticleExportTitle(container, parts, titleNode);
    const markdown = normalizeMarkdownLines([
      title ? `# ${escapeMarkdownInline(title)}` : "",
      ...removeDuplicateArticleTitleParts(parts, title)
    ]);
    const textLength = normalizeText(markdown).length;
    if (textLength < 180 && parts.length < 3) return null;
    return {
      container,
      titleNode,
      title,
      markdown,
      parts,
      textLength,
      fileName: articleFileName(title),
      characterCount: markdownCharacterCount(markdown),
      imageCount: markdownImageCount(markdown),
      linkCount: (markdown.match(/\]\(https?:\/\//g) || []).length
    };
  }

  function hasReadableArticleSignal() {
    return Boolean(document.querySelector(ARTICLE_EXPORT_LONGFORM_SELECTOR) || articleExportMediaLinks().length);
  }

  function containerHasReadableArticleSignal(container) {
    return Boolean(
      container?.matches?.(ARTICLE_EXPORT_LONGFORM_SELECTOR) ||
      container?.querySelector?.(ARTICLE_EXPORT_LONGFORM_SELECTOR) ||
      articleExportMediaLinks(container).length
    );
  }

  function articleExportMediaLinks(root = document) {
    const id = articleExportIdFromUrl();
    if (!id) return [];
    return Array.from(root.querySelectorAll(articleExportAnchorSelector(id)))
      .filter((link) => {
        try {
          const url = new URL(link.getAttribute("href") || link.href || "", location.origin);
          return articleExportPathMatches(url.pathname, id);
        } catch {
          return false;
        }
      });
  }

  function articleExportAnchorSelector(id = articleExportIdFromUrl()) {
    if (!id) return "";
    return [`a[href*="/article/${id}"]`, `a[href*="/articles/${id}"]`].join(",");
  }

  function articleExportPathMatches(pathname, id) {
    if (!id) return false;
    return [`/article/${id}`, `/articles/${id}`].some((path) =>
      pathname.includes(path) && (pathname.endsWith(path) || pathname.includes(`${path}/media/`))
    );
  }

  function articleExportContainer(element) {
    const article = element?.closest?.("article") || null;
    const longform = element?.closest?.(ARTICLE_EXPORT_LONGFORM_SELECTOR) || null;
    if (!article && !longform) return null;
    const boundary = article || longform;
    let best = boundary;
    for (let node = element; node && node !== document.body; node = node.parentElement) {
      if (!node.matches?.("article, main article, [data-testid='cellInnerDiv'], section, div")) continue;
      const rect = node.getBoundingClientRect?.();
      if (!rect || rect.width < 320 || rect.height < 160) continue;
      const textLength = normalizeText(node.innerText || node.textContent || "").length;
      const currentLength = normalizeText(best.innerText || best.textContent || "").length;
      if (textLength >= currentLength && textLength <= 28000) best = node;
      if (node === boundary || node.matches?.("article")) break;
    }
    return best;
  }

  function articleDockInlineEnd(container) {
    const fallback = 24;
    const rect = container?.getBoundingClientRect?.();
    if (!rect || rect.width < 320) return fallback;
    const space = Math.max(12, Math.round(window.innerWidth - Math.min(window.innerWidth - 12, rect.right)));
    return Math.min(Math.max(space, 16), 420);
  }

  function scoreArticleExportCandidate(candidate) {
    return candidate.textLength / 80 +
      candidate.parts.length * 2 +
      candidate.imageCount * 2 +
      candidate.linkCount +
      (candidate.title ? 8 : 0);
  }

  function detectArticleExportTitleNode(container) {
    const xTitle = container?.querySelector?.("[data-testid='twitter-article-title']");
    if (isReadableArticleTitleNode(xTitle)) return xTitle;
    return Array.from(container?.querySelectorAll?.("h1, h2, [role='heading']") || [])
      .find(isReadableArticleTitleNode) || null;
  }

  function isReadableArticleTitleNode(node) {
    if (!node) return false;
    if (node.closest?.(`#${ARTICLE_EXPORT_ID}, [role='button'], button, nav, time`)) return false;
    const text = normalizeText(articleNodeReadableText(node));
    if (!text || /^post$|^article$/i.test(text)) return false;
    const rect = node.getBoundingClientRect?.();
    return !rect || (rect.width >= 32 && rect.height >= 12);
  }

  function detectArticleExportTitle(container, parts = [], titleNode = null) {
    const heading = normalizeText(articleNodeReadableText(titleNode));
    if (heading && !/^post$|^article$/i.test(heading)) return heading;
    const first = normalizeText(parts.find((part) => part && !part.startsWith("![")) || "");
    if (first && first.length <= 140) return first.replace(/^#+\s*/, "");
    const title = normalizeText(document.title || "").replace(/\s*[\|/].*$/, "").replace(/\s+on X$/, "");
    return title && !/^x$/i.test(title) ? title : "";
  }

  function removeDuplicateArticleTitleParts(parts = [], title = "") {
    if (!title) return parts;
    return parts.filter((part) => !articleMarkdownPartMatchesTitle(part, title));
  }

  function articleMarkdownPartMatchesTitle(part, title) {
    return normalizedArticleTitleText(part) === normalizedArticleTitleText(title);
  }

  function normalizedArticleTitleText(value) {
    return normalizeText(String(value || "")
      .replace(/^#{1,6}\s+/, "")
      .replace(/^\[([^\]]+)]\([^)]+\)$/, "$1")
      .replace(/\\([\\`*_[\]])/g, "$1")
      .replace(/[`*_]/g, ""))
      .toLowerCase();
  }

  function articleMarkdownParts(root, { titleNode = null } = {}) {
    const parts = [];
    const seen = new Set();
    const selector = "h1, h2, h3, h4, h5, h6, p, blockquote, pre, ul, ol, img, figcaption, [data-testid='tweetText'], div[lang]";
    const nodes = [
      ...(root.matches?.(selector) ? [root] : []),
      ...Array.from(root.querySelectorAll(selector))
    ];
    for (const node of nodes) {
      if (node.closest?.(`#${ARTICLE_EXPORT_ID}, [role='button'], button, nav, time, [aria-label*='analytics' i]`)) continue;
      if (titleNode && (node === titleNode || titleNode.contains(node))) continue;
      if (nodes.some((other) => other !== node && other.contains(node) && markdownNodeConsumesChildren(other, titleNode))) continue;
      if (titleNode && node.contains?.(titleNode)) continue;
      const part = markdownForArticleNode(node);
      const key = normalizeText(part);
      if (!part || !key || seen.has(key)) continue;
      seen.add(key);
      parts.push(part);
    }
    return parts;
  }

  function markdownNodeConsumesChildren(node, skippedNode = null) {
    if (skippedNode && node.contains?.(skippedNode)) return false;
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
      if (node.id === ARTICLE_EXPORT_ID) return;
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

  function articleNodeReadableText(node) {
    if (!node) return "";
    const clone = node.cloneNode?.(true);
    clone?.querySelector?.(`#${ARTICLE_EXPORT_ID}`)?.remove();
    return clone?.innerText || clone?.textContent || node.innerText || node.textContent || "";
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
    const fallback = articleExportIdFromUrl() ? `x-article-${articleExportIdFromUrl()}` : "x-article";
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
        --__xposter-export-paper: #ffffff;
        --__xposter-export-paper-2: #f7f9f9;
        --__xposter-export-ink: #0f1419;
        --__xposter-export-muted: #536471;
        --__xposter-export-line: #cfd9de;
        --__xposter-export-signal: #1d9bf0;
        --__xposter-export-ok: #00ba7c;
        --__xposter-export-danger: #f4212e;
        position: static;
        z-index: auto;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        width: fit-content;
        max-width: min(100%, 540px);
        margin: 0 0 0 12px;
        vertical-align: middle;
        color: var(--__xposter-export-ink);
        transform: translateZ(0);
        font: 12px/1 ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif;
        letter-spacing: 0;
      }
      #${ARTICLE_EXPORT_ID}[data-placement="fixed"] {
        position: fixed;
        right: var(--__xposter-article-export-inline-end, 24px);
        bottom: 24px;
        z-index: 2147483645;
        max-width: min(320px, calc(100vw - 24px));
        margin: 0;
        opacity: 0.84;
        transform-origin: 100% 100%;
      }
      #${ARTICLE_EXPORT_ID}[data-motion="entered"] {
        animation: __xposter_article_export_in 260ms cubic-bezier(0.22, 1, 0.36, 1);
      }
      #${ARTICLE_EXPORT_ID}[data-feedback="done"],
      #${ARTICLE_EXPORT_ID}[data-feedback="mode"] {
        animation: __xposter_article_export_confirm 420ms cubic-bezier(0.22, 1, 0.36, 1);
      }
      #${ARTICLE_EXPORT_ID}[data-feedback="warn"],
      #${ARTICLE_EXPORT_ID}[data-feedback="error"] {
        animation: __xposter_article_export_confirm 420ms cubic-bezier(0.22, 1, 0.36, 1);
      }
      #${ARTICLE_EXPORT_ID} .__xposter_article_export_actions {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        min-height: 24px;
        max-width: 0;
        overflow: hidden;
        opacity: 0;
        transform: translate3d(-2px, 0, 0);
        transition:
          max-width 140ms cubic-bezier(0.25, 1, 0.5, 1),
          opacity 140ms cubic-bezier(0.25, 1, 0.5, 1),
          transform 140ms cubic-bezier(0.25, 1, 0.5, 1);
      }
      #${ARTICLE_EXPORT_ID}:hover .__xposter_article_export_actions,
      #${ARTICLE_EXPORT_ID}:focus-within .__xposter_article_export_actions,
      #${ARTICLE_EXPORT_ID}[data-inline-feedback] .__xposter_article_export_actions,
      #${ARTICLE_EXPORT_ID}[data-placement="fixed"] .__xposter_article_export_actions {
        max-width: 54px;
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
      #${ARTICLE_EXPORT_ID} .__xposter_article_export_mark {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 25px;
        height: 22px;
        padding: 0 7px;
        border: 1px solid transparent;
        border-radius: 999px;
        color: color-mix(in oklch, var(--__xposter-export-muted), var(--__xposter-export-ink) 18%);
        background: color-mix(in oklch, var(--__xposter-export-paper-2), transparent 30%);
        font-size: 11px;
        font-weight: 800;
        line-height: 1;
        font-variant-numeric: tabular-nums;
      }
      #${ARTICLE_EXPORT_ID} button {
        -webkit-appearance: none;
        appearance: none;
        display: inline-grid;
        place-items: center;
        width: 24px;
        height: 24px;
        min-height: 24px;
        padding: 0;
        border: 1px solid transparent;
        border-radius: 999px;
        background: transparent;
        color: var(--__xposter-export-muted);
        font: inherit;
        font-weight: 700;
        cursor: pointer;
        white-space: nowrap;
        transition:
          border-color 140ms cubic-bezier(0.25, 1, 0.5, 1),
          background-color 140ms cubic-bezier(0.25, 1, 0.5, 1),
          color 140ms cubic-bezier(0.25, 1, 0.5, 1),
          transform 140ms cubic-bezier(0.25, 1, 0.5, 1);
      }
      #${ARTICLE_EXPORT_ID} button svg {
        width: 14px;
        height: 14px;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
        pointer-events: none;
      }
      #${ARTICLE_EXPORT_ID} button:hover,
      #${ARTICLE_EXPORT_ID} button:focus-visible {
        outline: none;
        border-color: color-mix(in oklch, var(--__xposter-export-signal), var(--__xposter-export-line) 48%);
        background: color-mix(in oklch, var(--__xposter-export-signal), var(--__xposter-export-paper) 94%);
        color: var(--__xposter-export-ink);
        transform: translateY(-1px);
      }
      #${ARTICLE_EXPORT_ID} button:focus-visible {
        box-shadow: 0 0 0 3px color-mix(in oklch, var(--__xposter-export-signal), transparent 76%);
      }
      #${ARTICLE_EXPORT_ID} button:active {
        transform: translateY(0) scale(0.985);
      }
      #${ARTICLE_EXPORT_ID} .__xposter_article_export_feedback {
        max-width: min(100%, 460px);
        color: var(--__xposter-export-muted);
        font-size: 12px;
        line-height: 1.35;
      }
      #${ARTICLE_EXPORT_ID} .__xposter_article_export_feedback:empty,
      #${ARTICLE_EXPORT_ID} .__xposter_article_export_feedback[hidden] {
        display: none;
      }
      #${ARTICLE_EXPORT_ID}[data-inline-feedback="done"] .__xposter_article_export_feedback {
        color: color-mix(in oklch, var(--__xposter-export-ok), var(--__xposter-export-ink) 20%);
      }
      #${ARTICLE_EXPORT_ID}[data-inline-feedback="warn"] .__xposter_article_export_feedback,
      #${ARTICLE_EXPORT_ID}[data-inline-feedback="error"] .__xposter_article_export_feedback {
        color: var(--__xposter-export-danger);
      }
      #${ARTICLE_EXPORT_ID}[data-placement="fixed"] {
        gap: 4px;
        padding: 4px;
        border: 1px solid var(--__xposter-export-line);
        border-radius: 999px;
        background: var(--__xposter-export-paper);
        box-shadow: 0 8px 22px rgba(15, 20, 25, 0.10);
      }
      #${ARTICLE_EXPORT_ID}[data-placement="fixed"]:hover,
      #${ARTICLE_EXPORT_ID}[data-placement="fixed"]:focus-within {
        opacity: 1;
        border-color: color-mix(in oklch, var(--__xposter-export-line), var(--__xposter-export-ink) 28%);
        background: color-mix(in oklch, var(--__xposter-export-paper-2), var(--__xposter-export-paper) 54%);
        box-shadow: 0 12px 28px rgba(15, 20, 25, 0.13);
        transform: translate3d(0, -1px, 0);
      }
      #${ARTICLE_EXPORT_ID}[data-placement="fixed"] .__xposter_article_export_feedback {
        position: absolute;
        right: 0;
        bottom: calc(100% + 8px);
        width: max-content;
        max-width: min(320px, calc(100vw - 32px));
        padding: 8px 10px;
        border: 1px solid var(--__xposter-export-line);
        border-radius: 8px;
        background: var(--__xposter-export-paper);
        box-shadow: 0 8px 22px rgba(15, 20, 25, 0.10);
        color: var(--__xposter-export-muted);
        line-height: 1.35;
      }
      @keyframes __xposter_article_export_in {
        from {
          opacity: 0;
          transform: translate3d(0, 4px, 0);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }
      @keyframes __xposter_article_export_confirm {
        0% {
          transform: translate3d(0, 0, 0) scale(1);
        }
        45% {
          transform: translate3d(0, -1px, 0) scale(1.02);
        }
        100% {
          transform: translate3d(0, 0, 0) scale(1);
        }
      }
      @media (prefers-color-scheme: dark) {
        #${ARTICLE_EXPORT_ID} {
          --__xposter-export-paper: #121a22;
          --__xposter-export-paper-2: #1a2630;
          --__xposter-export-ink: #d6dee6;
          --__xposter-export-muted: #8b99a6;
          --__xposter-export-line: #33414d;
          --__xposter-export-signal: #66a9d8;
          --__xposter-export-ok: #6fc8a4;
          --__xposter-export-danger: #ef7d86;
        }
        #${ARTICLE_EXPORT_ID}[data-placement="fixed"] {
          box-shadow: 0 12px 34px rgba(0, 0, 0, 0.30);
        }
        #${ARTICLE_EXPORT_ID}[data-placement="fixed"]:hover,
        #${ARTICLE_EXPORT_ID}[data-placement="fixed"]:focus-within {
          background: var(--__xposter-export-paper-2);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        #${ARTICLE_EXPORT_ID},
        #${ARTICLE_EXPORT_ID}[data-feedback],
        #${ARTICLE_EXPORT_ID} .__xposter_article_export_actions,
        #${ARTICLE_EXPORT_ID} button {
          animation: none;
          transition-duration: 0.01ms;
        }
        #${ARTICLE_EXPORT_ID}[data-placement="fixed"]:hover,
        #${ARTICLE_EXPORT_ID}[data-placement="fixed"]:focus-within,
        #${ARTICLE_EXPORT_ID} button {
          transform: none;
        }
      }
      @media (max-width: 720px) {
        #${ARTICLE_EXPORT_ID}[data-placement="fixed"] {
          right: max(12px, env(safe-area-inset-right));
          bottom: max(14px, env(safe-area-inset-bottom));
        }
        #${ARTICLE_EXPORT_ID} {
          max-width: calc(100vw - 24px);
        }
        #${ARTICLE_EXPORT_ID} .__xposter_article_export_feedback {
          max-width: calc(100vw - 32px);
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
      event.dataTransfer.dropEffect = "copy";
    }, true);
    document.addEventListener("dragleave", (event) => {
      if (isLeavingDocument(event)) hideDropHint();
    }, true);
    document.addEventListener("drop", async (event) => {
      let intent = dropIntentForEvent(event);
      if (intent === "none") return;
      event.preventDefault();
      event.stopPropagation();
      let files = transferFilesFromDataTransfer(event.dataTransfer);
      if (hasFiles(event.dataTransfer) && transferHasFileSystemHandleItems(event.dataTransfer)) {
        files = await resolveTransferFilesFromDataTransfer(event.dataTransfer, files);
      }
      const fileGroups = partitionTransferFiles(files);
      const markdownFiles = fileGroups.markdownFiles;
      if (intent === "sidepanel-queue" && markdownFiles.length === 1) intent = "article";
      const imageFiles = markdownFiles.length ? [] : fileGroups.imageFiles;
      const markdownText = markdownFiles.length ? "" : markdownTextFromTransfer(event.dataTransfer);
      const imageUrl = markdownFiles.length || imageFiles.length || markdownText ? "" : imageUrlFromTransfer(event.dataTransfer);
      const directoryItem = markdownFiles.length || imageFiles.length || imageUrl ? null : findDirectoryTransferItem(event.dataTransfer);
      if (!markdownFiles.length && !imageFiles.length && !markdownText && !imageUrl && !directoryItem && intent !== "sidepanel-queue") {
        hideDropHint();
        if (intent === "article" || intent === "sidepanel-draft") {
          showStatus("Could not read the dropped Markdown file. Try the import button or drop a real .md file.", "warn", 7000);
        }
        return;
      }
      if (directoryItem && !isDropEventOverSurface(event, "folder")) {
        showDropHint(event.dataTransfer, event, intent);
        showStatus("Drop the folder into the blue folder area.", "warn", 3800);
        window.setTimeout(hideDropHint, 260);
        return;
      }
      showDropHint(event.dataTransfer, event, intent);
      setDropHintProcessing(event.dataTransfer, intent);
      window.setTimeout(hideDropHint, 260);
      if (intent === "sidepanel-queue") {
        const panelPromise = safeRuntimeSendMessage({ type: "xposter:open-side-panel" }).catch(() => {});
        if (markdownFiles.length > 1) await queueMarkdownFilesForSidePanel(markdownFiles, { openPanelPromise: panelPromise });
        else await handleSidePanelMarkdownDrop(event.dataTransfer, intent, { openPanelPromise: panelPromise, markdownFiles });
        return;
      }
      if (intent === "sidepanel-draft") {
        await handleSidePanelMarkdownDrop(event.dataTransfer, intent, { markdownFiles });
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
        if (!articleBodyHasFocus()) {
          showStatus("Place the cursor in the article body before dropping an image.", "warn", 5200);
          return;
        }
        await uploadDroppedImages(imageFiles);
        return;
      }
      if (markdownText) {
        await stageSingleMarkdownForArticle(markdownText, { source: "drop" });
        return;
      }
      if (imageUrl) {
        if (!articleBodyHasFocus()) {
          showStatus("Place the cursor in the article body before dropping an image.", "warn", 5200);
          return;
        }
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
    const sidePanelIntent = sidePanelMarkdownDropIntent(dataTransfer, event);
    if (sidePanelIntent === "sidepanel-queue") return sidePanelIntent;
    if (isExplicitImageInsertDrop(dataTransfer, event)) return "image";
    if (isDirectoryDrop(dataTransfer, event)) return "folder";
    if (findDirectoryTransferItem(dataTransfer) && isEditorRoute() && findEditor()) return "folder";
    if (isSingleMarkdownDrop(dataTransfer)) return "article";
    if (sidePanelIntent) return sidePanelIntent;
    return "none";
  }

  function sidePanelMarkdownDropIntent(dataTransfer, event = null) {
    const files = transferFilesFromDataTransfer(dataTransfer);
    const fileGroups = partitionTransferFiles(files);
    const itemSummary = fileGroups.markdownFiles.length ? null : summarizeTransferItems(dataTransfer);
    const markdownFileCount = markdownTransferFileCount(dataTransfer, files, fileGroups.markdownFiles.length, itemSummary);
    if (markdownFileCount > 1) return "sidepanel-queue";
    if (markdownFileCount === 1) return "";
    if (markdownTextFromTransfer(dataTransfer)) return "";
    const types = Array.from(dataTransfer?.types || []);
    if (types.includes("text/markdown")) return "";
    if (
      hasUnmaterializedFileDrop(dataTransfer, files) &&
      event &&
      isEditorRoute() &&
      isDropEventOverSurface(event, "sidepanel-queue") &&
      !(itemSummary || summarizeTransferItems(dataTransfer)).hasLikelyImage
    ) {
      return "sidepanel-queue";
    }
    return "";
  }

  function isSingleMarkdownDrop(dataTransfer) {
    const files = transferFilesFromDataTransfer(dataTransfer);
    const markdownFiles = partitionTransferFiles(files).markdownFiles;
    if (markdownFiles.length === 1) return true;
    if (markdownFiles.length > 1) return false;
    if (files.length) return false;
    if (markdownTextFromTransfer(dataTransfer)) return true;
    return summarizeTransferItems(dataTransfer).likelyMarkdownCount === 1;
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
    return shared.looksLikeMarkdown(safeTransferData(dataTransfer, "text/plain"));
  }

  function markdownTextFromTransfer(dataTransfer) {
    const text = safeTransferData(dataTransfer, "text/plain");
    return shared.looksLikeMarkdown(text) ? text : "";
  }

  function transferFilesFromDataTransfer(dataTransfer) {
    const files = Array.from(dataTransfer?.files || []);
    for (const item of Array.from(dataTransfer?.items || [])) {
      if (item?.kind !== "file" || typeof item.getAsFile !== "function") continue;
      try {
        const file = item.getAsFile();
        if (file) files.push(file);
      } catch {
        // Drag previews can block file materialization until drop.
      }
    }
    return uniqueTransferFiles(files);
  }

  function uniqueTransferFiles(files) {
    const seen = new Set();
    return Array.from(files || []).filter((file) => {
      const key = [file.name || "", file.size || 0, file.type || "", file.lastModified || 0].join(":");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function transferHasFileSystemHandleItems(dataTransfer) {
    return Array.from(dataTransfer?.items || []).some(
      (item) => item?.kind === "file" && !isDirectoryTransferItem(item) && typeof item.getAsFileSystemHandle === "function"
    );
  }

  async function resolveTransferFilesFromDataTransfer(dataTransfer, files = transferFilesFromDataTransfer(dataTransfer)) {
    const handleItems = Array.from(dataTransfer?.items || []).filter(
      (item) => item?.kind === "file" && !isDirectoryTransferItem(item) && typeof item.getAsFileSystemHandle === "function"
    );
    if (!handleItems.length) return files;
    const resolved = [...files];
    const handles = await Promise.all(handleItems.map((item) => item.getAsFileSystemHandle().catch(() => null)));
    for (const handle of handles) {
      if (handle?.kind !== "file" || typeof handle.getFile !== "function") continue;
      try {
        const file = await handle.getFile();
        if (file) resolved.push(file);
      } catch {
        // Some drag sources expose a handle but revoke file reads after drop.
      }
    }
    return uniqueTransferFiles(resolved);
  }

  function partitionTransferFiles(files) {
    const markdownFiles = [];
    const imageFiles = [];
    for (const file of files || []) {
      if (isMarkdownFile(file)) markdownFiles.push(file);
      if (isImageFile(file)) imageFiles.push(file);
    }
    return { markdownFiles, imageFiles };
  }

  function summarizeTransferItems(dataTransfer) {
    const items = Array.from(dataTransfer?.items || []);
    let likelyMarkdownCount = 0;
    let hasLikelyImage = false;
    for (const item of items) {
      if (isLikelyMarkdownTransferItem(item)) likelyMarkdownCount += 1;
      if (isLikelyImageTransferItem(item)) hasLikelyImage = true;
    }
    return { items, likelyMarkdownCount, hasLikelyImage };
  }

  function countMarkdownFiles(files) {
    let count = 0;
    for (const file of files || []) {
      if (isMarkdownFile(file)) count += 1;
    }
    return count;
  }

  function markdownFilesFromTransfer(dataTransfer) {
    return partitionTransferFiles(transferFilesFromDataTransfer(dataTransfer)).markdownFiles;
  }

  function markdownTransferFileCount(dataTransfer, files = transferFilesFromDataTransfer(dataTransfer), markdownFileCount = null, itemSummary = null) {
    const fileCount = markdownFileCount ?? countMarkdownFiles(files);
    if (fileCount) return fileCount;
    const summary = itemSummary || summarizeTransferItems(dataTransfer);
    if (summary.likelyMarkdownCount) return summary.likelyMarkdownCount;
    if (hasFiles(dataTransfer) && summary.items.length > 1 && !summary.hasLikelyImage) return summary.items.length;
    return 0;
  }

  function hasUnmaterializedFileDrop(dataTransfer, files = transferFilesFromDataTransfer(dataTransfer)) {
    return hasFiles(dataTransfer) && !files.length;
  }

  function isMarkdownFile(file) {
    if (!file?.name || !/\.(md|markdown|mdown|mkd|txt)$/i.test(file.name)) return false;
    if (!file.type) return true;
    return /^(text\/markdown|text\/plain|application\/octet-stream)$/i.test(file.type);
  }

  function isExplicitImageInsertDrop(dataTransfer, event = null) {
    if (!event?.altKey) return false;
    if (!isEditorRoute() || !findEditor()) return false;
    if (!isDropEventOverSurface(event, "image")) return false;
    if (!articleBodyHasFocus()) return false;
    return hasImageDropPayload(dataTransfer);
  }

  function isDirectoryDrop(dataTransfer, event = null) {
    if (!findDirectoryTransferItem(dataTransfer)) return false;
    if (!isEditorRoute() || !findEditor()) return false;
    return !event || isDropEventOverSurface(event, "folder");
  }

  function hasImageDropPayload(dataTransfer) {
    if (!dataTransfer) return false;
    if (imageFilesFromTransfer(dataTransfer).length) return true;
    const items = Array.from(dataTransfer.items || []);
    if (items.some(isLikelyImageTransferItem)) return true;
    return Boolean(imageUrlFromTransfer(dataTransfer));
  }

  function isLikelyMarkdownTransferItem(item) {
    if (item?.kind !== "file") return false;
    if (!item.type) return true;
    return /^(text\/markdown|text\/plain|application\/octet-stream)$/i.test(item.type || "");
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

  async function handleSidePanelMarkdownDrop(dataTransfer, intent = "sidepanel-draft", { openPanelPromise = null, markdownFiles = null } = {}) {
    const files = markdownFiles || markdownFilesFromTransfer(dataTransfer);
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
    const surface = dropHintSurfaceKind(intent);
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
          <span class="__xposter_drop_status"></span>
        </div>
        <span class="__xposter_drop_mode" data-slot="markdown" aria-hidden="true"></span>
        <span class="__xposter_drop_mode" data-slot="image" aria-hidden="true"></span>
        <span class="__xposter_drop_mode" data-slot="folder" aria-hidden="true"></span>
      `;
      injectDropHintStyle();
      document.body.appendChild(hint);
    }
    setDatasetValueIfChanged(hint, "intent", intent);
    updateDropHintSurface(hint, intent);
    setDatasetValueIfChanged(hint, "mode", mode);
    setDatasetValueIfChanged(hint, "state", "ready");
    setDatasetValueIfChanged(hint, "surface", surface);
    const copy = dropHintCopy(mode, intent);
    syncDropHintCopy(hint, copy, mode, intent);
  }

  function dropHintNodes(hint) {
    if (!hint) return {};
    return cachedElementNodes(
      hint,
      "dropHint",
      (root) => ({
        title: root.querySelector("strong"),
        detail: root.querySelector("p"),
        status: root.querySelector(".__xposter_drop_status")
      }),
      (nodes) => nodes.title?.isConnected && nodes.detail?.isConnected && nodes.status?.isConnected
    );
  }

  function syncDropHintCopy(hint, copy, mode, intent) {
    const { title, detail, status } = dropHintNodes(hint);
    setTextContentIfChanged(title, translateContentText(copy.title));
    setTextContentIfChanged(detail, translateContentText(copy.detail));
    setTextContentIfChanged(status, translateContentText(dropHintStatusLabel(mode, intent)));
  }

  function dropHintStatusLabel(mode, intent = "") {
    if (intent === "article") return "Article";
    if (intent === "sidepanel-queue" || mode === "sidepanel-queue" || mode === "queue") return "Queue";
    if (intent === "sidepanel-draft" || mode === "sidepanel") return "Side panel";
    if (mode === "folder") return "Folder";
    if (mode === "image") return "Image";
    return "Markdown";
  }

  function dropHintCopy(mode, intent = "") {
    if (intent === "article") {
      return isEditorRoute() && findEditor()
        ? { title: "Write to this X Article", detail: "Release in the bottom bar to write this Markdown here." }
        : { title: "Open X Article draft", detail: "Release to open X Articles and write this Markdown." };
    }
    switch (mode) {
      case "sidepanel-queue":
        return { title: "Queue Markdown drafts", detail: "Release to add them to the xPoster side panel." };
      case "sidepanel":
        return { title: "Send Markdown to side panel", detail: "Release to open it as an xPoster draft." };
      case "queue":
        return { title: "Queue Markdown drafts", detail: "Release over this area to send them to the side panel." };
      case "folder":
        return { title: "Drop image folder here", detail: "Release to connect this folder for local images." };
      case "image":
        return { title: "Insert image at cursor", detail: "Hold Option/Alt and release over the article body." };
      default:
        return { title: "Write Markdown here", detail: "Release over the editor to write into this article." };
    }
  }

  function processingDropHintCopy(mode, intent = "") {
    if (intent === "article") {
      return { title: "Opening X Article...", detail: "Preparing this Markdown draft." };
    }
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
        return { title: "Connecting image folder...", detail: "Preparing local image access." };
      case "image":
        return { title: "Adding image...", detail: "Using the current article cursor." };
      default:
        return { title: "Reading Markdown...", detail: "Preparing the article body." };
    }
  }

  function setDropHintProcessing(dataTransfer = null, intent = dropIntentForTransfer(dataTransfer)) {
    const hint = document.getElementById(DROP_HINT_ID);
    if (!hint) return;
    const mode = dropHintMode(dataTransfer, intent);
    const copy = processingDropHintCopy(mode, intent);
    setDatasetValueIfChanged(hint, "intent", intent);
    setDatasetValueIfChanged(hint, "mode", mode);
    setDatasetValueIfChanged(hint, "state", "processing");
    setDatasetValueIfChanged(hint, "surface", dropHintSurfaceKind(intent));
    syncDropHintCopy(hint, copy, mode, intent);
    updateDropHintSurface(hint, intent);
  }

  function hideDropHint() {
    document.getElementById(DROP_HINT_ID)?.remove();
  }

  function updateVisibleDropHintCopy() {
    const hint = document.getElementById(DROP_HINT_ID);
    if (!hint) return;
    setAttributeValueIfChanged(hint, "aria-label", translateContentText("xPoster page drop target"));
    const mode = hint.dataset.mode || "article";
    const intent = hint.dataset.intent || "article";
    const copy = hint.dataset.state === "processing"
      ? processingDropHintCopy(mode, intent)
      : dropHintCopy(mode, intent);
    syncDropHintCopy(hint, copy, mode, intent);
  }

  function updateVisibleDropHintSurface() {
    const hint = document.getElementById(DROP_HINT_ID);
    if (hint) updateDropHintSurface(hint, hint.dataset.intent || "article");
  }

  function updateDropHintSurface(hint, intent = "article") {
    const rect = dropSurfaceRect(intent);
    setStylePropertyIfChanged(hint, "--xposter-drop-surface-left", `${Math.round(rect.left)}px`);
    setStylePropertyIfChanged(hint, "--xposter-drop-surface-top", `${Math.round(rect.top)}px`);
    setStylePropertyIfChanged(hint, "--xposter-drop-surface-width", `${Math.round(rect.width)}px`);
    setStylePropertyIfChanged(hint, "--xposter-drop-surface-height", `${Math.round(rect.height)}px`);
  }

  function dropHintSurfaceKind(intent = "article") {
    if (intent === "sidepanel-draft" || intent === "sidepanel-queue") return "page-dock";
    if (intent === "article") return "page-dock";
    if (intent === "folder") return "page-dock";
    return "editor";
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
    const surface = dropHintSurfaceKind(intent);
    if (surface === "page-dock") return pageDropDockSurfaceRect();
    const editor = findEditor();
    const editorRect = visibleElementRect(editor);
    if (editorRect) {
      return articleBodyDropDockRect(editor, editorRect);
    }
    return pageDropSurfaceRect();
  }

  function pageDropDockSurfaceRect() {
    const margin = 0;
    const height = Math.min(168, Math.max(128, Math.round(window.innerHeight * 0.18)));
    return normalizeDropSurfaceRect({
      left: 0,
      top: window.innerHeight - height - margin,
      width: window.innerWidth,
      height
    }, {
      minWidth: window.innerWidth,
      minHeight: height,
      maxWidth: window.innerWidth,
      maxHeight: height,
      margin
    });
  }

  function articleBodyDropDockRect(editor, editorRect) {
    const containerRect = editorSurfaceRect(editor, editorRect) || editorRect;
    const margin = 10;
    const width = Math.max(280, containerRect.width);
    const height = Math.min(96, Math.max(66, Math.round(window.innerHeight * 0.09)));
    const top = Math.min(
      window.innerHeight - height - margin,
      Math.max(margin, containerRect.bottom - height - margin)
    );
    return normalizeDropSurfaceRect({
      left: containerRect.left,
      top,
      width,
      height
    }, {
      minWidth: Math.min(width, Math.max(1, window.innerWidth - margin * 2)),
      minHeight: height,
      maxWidth: Math.max(1, window.innerWidth - margin * 2),
      maxHeight: height,
      margin
    });
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

  function normalizeDropSurfaceRect(rect, options = {}) {
    const margin = options.margin ?? 14;
    const viewportWidth = Math.max(1, window.innerWidth);
    const viewportHeight = Math.max(1, window.innerHeight);
    const maxWidth = Math.min(options.maxWidth ?? Number.POSITIVE_INFINITY, Math.max(1, viewportWidth - margin * 2));
    const maxHeight = Math.min(options.maxHeight ?? Number.POSITIVE_INFINITY, Math.max(1, viewportHeight - margin * 2));
    const minWidth = Math.min(options.minWidth ?? 420, maxWidth);
    const minHeight = Math.min(options.minHeight ?? 190, maxHeight);
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
    if (intent === "image") return "image";
    if (intent === "folder") return "folder";
    if (!dataTransfer) return "markdown";
    if (hasMarkdownText(dataTransfer)) return "markdown";
    const files = transferFilesFromDataTransfer(dataTransfer);
    const fileGroups = partitionTransferFiles(files);
    const itemSummary = fileGroups.markdownFiles.length ? null : summarizeTransferItems(dataTransfer);
    const markdownFileCount = markdownTransferFileCount(dataTransfer, files, fileGroups.markdownFiles.length, itemSummary);
    if (markdownFileCount > 1) return "queue";
    if (fileGroups.markdownFiles.length || markdownFileCount === 1) return "markdown";
    if (fileGroups.imageFiles.length) return "image";
    if (itemSummary?.hasLikelyImage) return "image";
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
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        --xposter-drop-paper: rgba(255, 255, 255, 0.96);
        --xposter-drop-line: #cfd9de;
        --xposter-drop-dash: color-mix(in srgb, #536471, transparent 58%);
        --xposter-drop-ink: #0f1419;
        --xposter-drop-muted: #536471;
        --xposter-drop-accent: #536471;
        --xposter-drop-signal: #1d9bf0;
        --xposter-drop-signal-text: #0f6cbf;
        --xposter-drop-ok: #00ba7c;
        --xposter-drop-warn: #b15c00;
        --xposter-drop-progress: 0%;
        color: #0f1419;
        font: 14px/1.45 ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif;
        letter-spacing: 0;
        pointer-events: none;
        isolation: isolate;
        contain: layout style paint;
        animation: __xposter_drop_in 180ms cubic-bezier(0.22, 1, 0.36, 1) both;
      }
      #${DROP_HINT_ID}::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 0;
        border: 1px solid var(--xposter-drop-line);
        border-radius: 8px;
        background: var(--xposter-drop-paper);
        box-shadow:
          0 12px 30px rgba(15, 20, 25, 0.10),
          inset 0 0 0 1px rgba(255, 255, 255, 0.62);
      }
      #${DROP_HINT_ID}::after {
        content: "";
        position: absolute;
        inset: 7px;
        z-index: 1;
        border: 1px dashed var(--xposter-drop-dash);
        border-radius: 7px;
        opacity: 0.56;
      }
      #${DROP_HINT_ID} .__xposter_drop_frame {
        position: relative;
        z-index: 2;
        width: min(336px, 100%);
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 11px;
        text-align: left;
        color: var(--xposter-drop-ink);
        animation: __xposter_drop_copy_in 210ms cubic-bezier(0.22, 1, 0.36, 1) both;
      }
      #${DROP_HINT_ID} .__xposter_drop_mark {
        flex: 0 0 auto;
        position: relative;
        width: 30px;
        height: 30px;
        border: 1px solid color-mix(in srgb, var(--xposter-drop-accent), transparent 52%);
        border-radius: 999px;
        background: color-mix(in srgb, var(--xposter-drop-accent), transparent 92%);
        box-shadow: inset 0 0 0 4px rgba(255, 255, 255, 0.66);
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
        width: 11px;
        height: 2px;
        border-radius: 999px;
      }
      #${DROP_HINT_ID} .__xposter_drop_mark::after {
        width: 2px;
        height: 11px;
        border-radius: 999px;
      }
      #${DROP_HINT_ID} strong {
        position: relative;
        display: block;
        font-size: 13px;
        font-weight: 760;
        line-height: 1.25;
      }
      #${DROP_HINT_ID} p {
        position: relative;
        max-width: 16.8rem;
        margin: 3px 0 0;
        color: var(--xposter-drop-muted);
        font-size: 11.5px;
        line-height: 1.35;
      }
      #${DROP_HINT_ID}[data-surface="page-dock"] {
        height: var(--xposter-drop-surface-height, 132px);
        padding: 18px max(18px, calc((100vw - 980px) / 2));
      }
      #${DROP_HINT_ID}[data-surface="page-dock"]::before {
        border: 1px solid rgba(29, 155, 240, 0.42);
        border-bottom: 0;
        border-radius: 8px 8px 0 0;
        background:
          linear-gradient(180deg, rgba(232, 246, 255, 0.98), rgba(214, 238, 255, 0.96));
        box-shadow:
          0 -14px 34px rgba(29, 155, 240, 0.16),
          inset 0 1px 0 rgba(255, 255, 255, 0.86),
          inset 0 0 0 1px rgba(29, 155, 240, 0.08);
        transform-origin: 50% 50%;
        transform-box: border-box;
        will-change: transform, box-shadow, opacity;
      }
      #${DROP_HINT_ID}[data-surface="page-dock"]::after {
        content: "";
        position: absolute;
        left: max(18px, calc((100vw - 980px) / 2));
        right: max(18px, calc((100vw - 980px) / 2));
        top: 16px;
        bottom: 16px;
        height: auto;
        border: 1.5px dashed rgba(29, 155, 240, 0.48);
        border-radius: 8px;
        opacity: 1;
        background: rgba(255, 255, 255, 0.46);
        overflow: hidden;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.62);
        transform-origin: 50% 50%;
        transform-box: border-box;
        will-change: transform, box-shadow, opacity;
        transition:
          background 220ms cubic-bezier(0.22, 1, 0.36, 1),
          border-color 220ms cubic-bezier(0.22, 1, 0.36, 1);
      }
      #${DROP_HINT_ID}[data-surface="page-dock"][data-state="ready"]::before {
        animation: __xposter_drop_dock_breathe 2.2s ease-in-out infinite;
      }
      #${DROP_HINT_ID}[data-surface="page-dock"][data-state="ready"]::after {
        animation: __xposter_drop_dock_receive 2.2s ease-in-out infinite;
      }
      #${DROP_HINT_ID}[data-surface="page-dock"] .__xposter_drop_frame {
        width: min(720px, 100%);
        display: grid;
        grid-template-columns: 34px minmax(0, 1fr) auto;
        align-items: center;
        gap: 12px;
      }
      #${DROP_HINT_ID}[data-mode="markdown"] {
        --xposter-drop-accent: var(--xposter-drop-signal);
        --xposter-drop-paper: rgba(246, 251, 255, 0.96);
        --xposter-drop-line: rgba(29, 155, 240, 0.28);
        --xposter-drop-dash: rgba(29, 155, 240, 0.40);
      }
      #${DROP_HINT_ID}[data-mode="markdown"][data-surface="page-dock"]::before {
        background:
          linear-gradient(180deg, rgba(238, 249, 255, 0.98), rgba(217, 240, 255, 0.97));
        border-color: rgba(29, 155, 240, 0.52);
        box-shadow:
          0 -14px 36px rgba(29, 155, 240, 0.18),
          inset 0 1px 0 rgba(255, 255, 255, 0.92),
          inset 0 0 0 1px rgba(29, 155, 240, 0.10);
      }
      #${DROP_HINT_ID}[data-mode="markdown"][data-surface="page-dock"]::after {
        border-color: rgba(29, 155, 240, 0.58);
        background: rgba(255, 255, 255, 0.54);
      }
      #${DROP_HINT_ID}[data-mode="folder"][data-surface="page-dock"]::before {
        background:
          linear-gradient(180deg, rgba(238, 249, 255, 0.98), rgba(217, 240, 255, 0.97));
        border-color: rgba(29, 155, 240, 0.52);
        box-shadow:
          0 -14px 36px rgba(29, 155, 240, 0.18),
          inset 0 1px 0 rgba(255, 255, 255, 0.92),
          inset 0 0 0 1px rgba(29, 155, 240, 0.10);
      }
      #${DROP_HINT_ID}[data-mode="folder"][data-surface="page-dock"]::after {
        border-color: rgba(29, 155, 240, 0.58);
        background: rgba(255, 255, 255, 0.54);
      }
      #${DROP_HINT_ID}[data-mode="markdown"][data-surface="page-dock"] .__xposter_drop_frame {
        color: #0f3554;
        text-shadow: none;
      }
      #${DROP_HINT_ID}[data-mode="folder"][data-surface="page-dock"] .__xposter_drop_frame {
        color: #0f3554;
        text-shadow: none;
      }
      #${DROP_HINT_ID}[data-mode="markdown"][data-surface="page-dock"] .__xposter_drop_copy {
        display: grid;
        gap: 3px;
        min-width: 0;
      }
      #${DROP_HINT_ID}[data-mode="folder"][data-surface="page-dock"] .__xposter_drop_copy {
        display: grid;
        gap: 3px;
        min-width: 0;
      }
      #${DROP_HINT_ID}[data-mode="markdown"][data-surface="page-dock"] strong {
        color: #063b63;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      #${DROP_HINT_ID}[data-mode="folder"][data-surface="page-dock"] strong {
        color: #063b63;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      #${DROP_HINT_ID}[data-mode="markdown"][data-surface="page-dock"] p {
        max-width: 30rem;
        margin: 0;
        color: #35627f;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      #${DROP_HINT_ID}[data-mode="folder"][data-surface="page-dock"] p {
        max-width: 30rem;
        margin: 0;
        color: #35627f;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      #${DROP_HINT_ID} .__xposter_drop_status {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 24px;
        max-width: 112px;
        padding: 4px 9px;
        border: 1px solid color-mix(in srgb, var(--xposter-drop-accent), transparent 58%);
        border-radius: 999px;
        background: color-mix(in srgb, var(--xposter-drop-paper), transparent 14%);
        color: color-mix(in srgb, var(--xposter-drop-muted), var(--xposter-drop-ink) 24%);
        font-size: 10px;
        font-weight: 720;
        line-height: 1;
        text-transform: uppercase;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      #${DROP_HINT_ID}[data-mode="markdown"][data-surface="page-dock"] .__xposter_drop_status {
        border-color: rgba(29, 155, 240, 0.38);
        background: rgba(232, 246, 255, 0.82);
        color: #0f6cbf;
        text-shadow: none;
      }
      #${DROP_HINT_ID}[data-mode="folder"][data-surface="page-dock"] .__xposter_drop_status {
        border-color: rgba(29, 155, 240, 0.38);
        background: rgba(232, 246, 255, 0.82);
        color: #0f6cbf;
        text-shadow: none;
      }
      #${DROP_HINT_ID}[data-mode="markdown"][data-surface="page-dock"] .__xposter_drop_mark {
        border-color: rgba(29, 155, 240, 0.50);
        background: rgba(232, 246, 255, 0.92);
        box-shadow: inset 0 0 0 4px rgba(255, 255, 255, 0.76);
      }
      #${DROP_HINT_ID}[data-mode="markdown"][data-surface="page-dock"] .__xposter_drop_mark::before,
      #${DROP_HINT_ID}[data-mode="markdown"][data-surface="page-dock"] .__xposter_drop_mark::after {
        background: #1d9bf0;
      }
      #${DROP_HINT_ID}[data-mode="markdown"][data-state="ready"] .__xposter_drop_mark {
        animation: __xposter_drop_mark_hint 1.45s cubic-bezier(0.22, 1, 0.36, 1) infinite;
      }
      #${DROP_HINT_ID}[data-mode="folder"] {
        --xposter-drop-accent: var(--xposter-drop-signal);
        --xposter-drop-paper: rgba(246, 251, 255, 0.98);
        --xposter-drop-line: rgba(29, 155, 240, 0.32);
        --xposter-drop-dash: rgba(29, 155, 240, 0.40);
      }
      #${DROP_HINT_ID}[data-mode="folder"][data-surface="editor"]::before {
        background: rgba(246, 251, 255, 0.72);
      }
      #${DROP_HINT_ID}[data-mode="folder"][data-surface="editor"] .__xposter_drop_frame {
        border-color: rgba(29, 155, 240, 0.32);
        background: rgba(255, 255, 255, 0.92);
        box-shadow:
          0 14px 34px rgba(15, 20, 25, 0.10),
          0 0 0 1px rgba(29, 155, 240, 0.08);
      }
      #${DROP_HINT_ID}[data-mode="folder"] .__xposter_drop_mark {
        width: 34px;
        height: 28px;
        margin-top: 4px;
        border: 1.5px solid currentColor;
        border-radius: 5px;
        background: color-mix(in srgb, var(--xposter-drop-accent), white 84%);
        box-shadow: none;
        transform-origin: 50% 80%;
      }
      #${DROP_HINT_ID}[data-mode="folder"] .__xposter_drop_mark::before {
        left: 9px;
        top: -5px;
        width: 15px;
        height: 7px;
        border: 1.5px solid currentColor;
        border-bottom: 0;
        border-radius: 4px 4px 0 0;
        background: color-mix(in srgb, var(--xposter-drop-accent), white 80%);
        transform: none;
      }
      #${DROP_HINT_ID}[data-mode="folder"] .__xposter_drop_mark::after {
        left: 50%;
        top: 50%;
        width: 11px;
        height: 11px;
        border-right: 2px solid currentColor;
        border-bottom: 2px solid currentColor;
        background: transparent;
        transform: translate(-50%, -58%) rotate(45deg);
      }
      #${DROP_HINT_ID}[data-mode="folder"][data-surface="page-dock"] .__xposter_drop_mark {
        color: #1d9bf0;
        background: rgba(232, 246, 255, 0.92);
      }
      #${DROP_HINT_ID}[data-mode="folder"][data-surface="page-dock"] .__xposter_drop_mark::before {
        background: rgba(217, 240, 255, 0.96);
      }
      #${DROP_HINT_ID}[data-mode="folder"][data-state="ready"] .__xposter_drop_mark {
        animation: __xposter_folder_drop_hint 1.2s cubic-bezier(0.22, 1, 0.36, 1) infinite;
      }
      #${DROP_HINT_ID}[data-surface="editor"] {
        min-height: 64px;
        padding: 10px 14px;
      }
      #${DROP_HINT_ID}[data-surface="editor"]::before {
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.38);
        box-shadow:
          inset 0 0 0 1px color-mix(in srgb, var(--xposter-drop-accent), transparent 72%),
          0 10px 30px rgba(15, 20, 25, 0.08);
      }
      #${DROP_HINT_ID}[data-surface="editor"]::after {
        inset: 7px;
        border-color: color-mix(in srgb, var(--xposter-drop-accent), transparent 42%);
      }
      #${DROP_HINT_ID}[data-surface="editor"] .__xposter_drop_frame {
        width: min(520px, 100%);
        justify-content: center;
        text-align: left;
        display: flex;
        gap: 10px;
        padding: 8px 10px;
        border: 1px solid var(--xposter-drop-line);
        border-radius: 8px;
        background: color-mix(in srgb, var(--xposter-drop-paper), transparent 10%);
        box-shadow: 0 12px 30px rgba(15, 20, 25, 0.10);
      }
      #${DROP_HINT_ID}[data-surface="editor"] p {
        max-width: 24rem;
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
        --xposter-drop-accent: var(--xposter-drop-warn);
      }
      #${DROP_HINT_ID}[data-mode="sidepanel"],
      #${DROP_HINT_ID}[data-mode="sidepanel-queue"] {
        --xposter-drop-accent: var(--xposter-drop-signal);
      }
      #${DROP_HINT_ID}[data-mode="image"] {
        --xposter-drop-accent: var(--xposter-drop-ok);
      }
      #${DROP_HINT_ID}[data-state="processing"] {
        --xposter-drop-accent: var(--xposter-drop-signal);
        --xposter-drop-progress: 100%;
      }
      #${DROP_HINT_ID}[data-state="processing"] .__xposter_drop_mark {
        animation: __xposter_drop_processing 780ms ease-in-out infinite;
      }
      #${DROP_HINT_ID}[data-state="processing"] .__xposter_drop_mark::after {
        display: none;
      }
      @keyframes __xposter_drop_in {
        from { opacity: 0; transform: translateY(5px) scale(0.992); }
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
      @keyframes __xposter_drop_mark_hint {
        0%, 100% {
          transform: scale(1);
          box-shadow:
            inset 0 0 0 4px rgba(255, 255, 255, 0.76),
            0 0 0 0 rgba(29, 155, 240, 0.24);
        }
        50% {
          transform: translateY(-1px) scale(1.08);
          box-shadow:
            inset 0 0 0 4px rgba(255, 255, 255, 0.76),
            0 0 0 8px rgba(29, 155, 240, 0);
        }
      }
      @keyframes __xposter_drop_dock_breathe {
        0%, 100% {
          transform: scale(1);
          opacity: 1;
          box-shadow:
            0 -14px 36px rgba(29, 155, 240, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.92),
            inset 0 0 0 1px rgba(29, 155, 240, 0.10);
        }
        50% {
          transform: scale(1.002, 1.012);
          opacity: 0.99;
          box-shadow:
            0 -16px 38px rgba(29, 155, 240, 0.20),
            inset 0 1px 0 rgba(255, 255, 255, 0.96),
            inset 0 0 0 1px rgba(29, 155, 240, 0.14);
        }
      }
      @keyframes __xposter_drop_dock_receive {
        0%, 100% {
          transform: scale(1);
          opacity: 0.88;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.62);
        }
        50% {
          transform: scale(1.004, 1.016);
          opacity: 0.96;
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.72),
            0 0 0 3px rgba(29, 155, 240, 0.08);
        }
      }
      @keyframes __xposter_folder_drop_hint {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(3px) scale(1.04); }
      }
      @media (prefers-reduced-motion: reduce) {
        #${DROP_HINT_ID},
        #${DROP_HINT_ID} .__xposter_drop_frame,
        #${DROP_HINT_ID}[data-state="processing"] .__xposter_drop_mark,
        #${DROP_HINT_ID}[data-mode="markdown"][data-state="ready"] .__xposter_drop_mark,
        #${DROP_HINT_ID}[data-mode="folder"][data-state="ready"] .__xposter_drop_mark,
        #${DROP_HINT_ID}[data-surface="page-dock"]::before,
        #${DROP_HINT_ID}[data-surface="page-dock"][data-state="ready"]::before,
        #${DROP_HINT_ID}[data-surface="page-dock"]::after,
        #${DROP_HINT_ID}[data-surface="page-dock"][data-state="ready"]::after {
          animation: none;
        }
      }
      @media (prefers-color-scheme: dark) {
        #${DROP_HINT_ID} {
          --xposter-drop-paper: rgba(22, 24, 28, 0.94);
          --xposter-drop-line: #33414d;
          --xposter-drop-dash: rgba(231, 233, 234, 0.22);
          --xposter-drop-ink: #e7e9ea;
          --xposter-drop-muted: #aeb4b9;
          --xposter-drop-signal: #66a9d8;
          --xposter-drop-signal-text: #9ccbec;
          --xposter-drop-ok: #6fc8a4;
          --xposter-drop-warn: #d8b765;
        }
        #${DROP_HINT_ID}[data-mode="markdown"] {
          --xposter-drop-paper: rgba(15, 29, 43, 0.96);
          --xposter-drop-line: rgba(29, 155, 240, 0.34);
          --xposter-drop-dash: rgba(29, 155, 240, 0.42);
        }
        #${DROP_HINT_ID}[data-mode="markdown"][data-surface="page-dock"]::before {
          background:
            linear-gradient(180deg, rgba(15, 42, 61, 0.98), rgba(14, 54, 84, 0.96));
          border-color: rgba(102, 169, 216, 0.44);
        }
        #${DROP_HINT_ID}[data-mode="folder"][data-surface="page-dock"]::before {
          background:
            linear-gradient(180deg, rgba(15, 42, 61, 0.98), rgba(14, 54, 84, 0.96));
          border-color: rgba(102, 169, 216, 0.44);
        }
        #${DROP_HINT_ID}[data-mode="folder"] {
          --xposter-drop-paper: rgba(15, 29, 43, 0.96);
          --xposter-drop-line: rgba(102, 169, 216, 0.38);
        }
        #${DROP_HINT_ID}[data-mode="folder"] .__xposter_drop_mark {
          background: rgba(102, 169, 216, 0.22);
        }
        #${DROP_HINT_ID}[data-mode="folder"] .__xposter_drop_mark::before {
          background: rgba(102, 169, 216, 0.18);
        }
        #${DROP_HINT_ID}[data-mode="folder"][data-surface="editor"]::before {
          background: rgba(15, 29, 43, 0.44);
        }
        #${DROP_HINT_ID}[data-mode="folder"][data-surface="editor"] .__xposter_drop_frame {
          background: rgba(22, 24, 28, 0.84);
        }
        #${DROP_HINT_ID}::before {
          box-shadow:
            0 18px 48px rgba(0, 0, 0, 0.32),
            inset 0 0 0 1px rgba(231, 233, 234, 0.06);
        }
        #${DROP_HINT_ID}[data-surface="page-dock"]::after {
          border-color: rgba(102, 169, 216, 0.48);
          background: rgba(102, 169, 216, 0.10);
        }
        #${DROP_HINT_ID}[data-surface="editor"]::before {
          background: rgba(22, 24, 28, 0.34);
        }
      }
      @media (max-width: 520px) {
        #${DROP_HINT_ID} {
          left: 12px;
          right: 12px;
          width: auto;
        }
        #${DROP_HINT_ID}[data-surface="page-dock"] {
          left: 0;
          right: 0;
          width: 100vw;
          top: auto;
          bottom: 0;
          height: 132px;
        }
        #${DROP_HINT_ID}[data-surface="page-dock"] .__xposter_drop_frame {
          grid-template-columns: 30px minmax(0, 1fr);
          gap: 10px;
        }
        #${DROP_HINT_ID}[data-surface="page-dock"] .__xposter_drop_status {
          display: none;
        }
        #${DROP_HINT_ID} .__xposter_drop_mark {
          width: 28px;
          height: 28px;
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
    if (message?.type === "xposter:success-celebration") {
      showSuccessCelebration({ colors: Array.isArray(message.colors) ? message.colors : [] });
      sendResponse({ ok: true });
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
      Promise.all([
        getVaultStatus(),
        currentOriginalImporterResidue({ cleanup: true })
      ]).then(async ([vault, originalImporterResidue]) =>
        sendResponse({
          ok: true,
          contentScriptVersion: CONTENT_SCRIPT_VERSION,
          url: location.href,
          isArticleRoute: isArticleRoute(),
          isEditorRoute: isEditorRoute(),
          hasEditor: Boolean(findEditor()),
          busy: state.busy,
          lastSummary: state.lastSummary,
          targetContext: await collectTargetContext({ originalImporterResidue }),
          originalImporterResidue,
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
      promptVaultSelection(message).then(sendResponse);
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
    const originalImporterResidue = await currentOriginalImporterResidue({ cleanup: true });
    return {
      ok: true,
      contentScript: true,
      contentScriptVersion: CONTENT_SCRIPT_VERSION,
      url: location.href,
      isArticleRoute: isArticleRoute(),
      isEditorRoute: isEditorRoute(),
      hasEditorElement: Boolean(findEditor()),
      importButtonMounted: Boolean(document.getElementById(IMPORT_BUTTON_ID)),
      originalImporterResidue,
      busy: state.busy,
      mainReady: state.mainReady,
      targetContext: await collectTargetContext({ originalImporterResidue }),
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
