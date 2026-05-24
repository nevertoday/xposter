const STORAGE_LANGUAGE = "xposter_language";
const COPY_FEEDBACK_MS = 1000;
const i18n = window.xPosterI18n;

const els = {
  run: document.getElementById("run"),
  openSidePanel: document.getElementById("openSidePanel"),
  openArticles: document.getElementById("openArticles"),
  copyJson: document.getElementById("copyJson"),
  target: document.getElementById("target"),
  route: document.getElementById("route"),
  content: document.getElementById("content"),
  main: document.getElementById("main"),
  editor: document.getElementById("editor"),
  upload: document.getElementById("upload"),
  article: document.getElementById("article"),
  contentRisk: document.getElementById("contentRisk"),
  vault: document.getElementById("vault"),
  gateList: document.getElementById("gateList"),
  details: document.getElementById("details")
};

const TEXT = {
  en: {
    documentTitle: "xPoster Status",
    heading: "Status check",
    run: "Check this tab",
    checking: "Checking...",
    openArticles: "Open X Article",
    openSidePanel: "Open side panel",
    opening: "Opening...",
    copyDetails: "Copy details",
    copied: "Copied",
    unknown: "Unknown",
    unavailable: "Unavailable",
    summaryTarget: "Page",
    summaryRoute: "X Article",
    summaryContent: "xPoster link",
    summaryMain: "Page access",
    summaryEditor: "Editor",
    summaryUpload: "Images",
    summaryArticle: "Article",
    summaryDraft: "Draft text",
    summaryVault: "Local images",
    idle: "Open an X Article tab, then check whether xPoster can write into it.",
    extensionOnly: "Load xPoster as a Chrome extension to check the active X tab.",
    statusXOpen: "X is open",
    statusOpenX: "Open X",
    statusEditing: "Editing",
    statusArticleList: "Article list",
    statusNotArticle: "Not article",
    statusConnected: "Connected",
    statusNotConnected: "Not connected",
    statusReady: "Ready",
    statusRefresh: "Refresh tab",
    statusCanWrite: "Can write",
    statusDomOnly: "Limited",
    statusEditorMissing: "Not found",
    statusCanUpload: "Can upload",
    statusUploadMissing: "Not ready",
    statusMissingId: "No article id",
    statusNotEditing: "Not editing",
    statusEmpty: "Empty",
    statusNoEditor: "No editor",
    statusPermission: "Allow access",
    statusOptional: "Not needed",
    chars: "{count} chars",
    gatePage: "Current page",
    gateRoute: "X Articles",
    gateConnection: "xPoster connection",
    gateEditor: "Write target",
    gateExisting: "Article content",
    gateUpload: "Image upload",
    gateVault: "Local images",
    gatePageOk: "This tab is X/Twitter.",
    gatePageFix: "Open x.com, then check again.",
    gateRouteOk: "X Articles is open.",
    gateRouteFix: "Open the X Articles composer or article list.",
    gateConnectionOk: "xPoster can reach this page.",
    gateConnectionFix: "Reload the X tab, then check again.",
    gateEditorOk: "xPoster can write into the open editor.",
    gateEditorArticleList: "Open or create an article draft before writing.",
    gateEditorFix: "Open an X Article draft before writing.",
    gateExistingOk: "The editor is empty.",
    gateExistingFix: "The editor already has {count} characters. Review before writing.",
    gateExistingNoEditor: "No open editor content to overwrite.",
    gateUploadOk: "X image upload is available.",
    gateUploadFix: "Open an article editor before writing images.",
    gateVaultOk: "Local image folder is ready.",
    gateVaultOptional: "Only needed when Markdown uses relative image paths.",
    gateVaultFix: "{name}: allow folder access in the side panel.",
    errorPrefix: "Could not check this tab: {error}"
  },
  zh: {
    documentTitle: "xPoster 状态",
    heading: "状态检查",
    run: "检查当前页面",
    checking: "检查中...",
    openArticles: "打开 X 文章",
    openSidePanel: "打开侧边栏",
    opening: "正在打开...",
    copyDetails: "复制详情",
    copied: "已复制",
    unknown: "未知",
    unavailable: "不可用",
    summaryTarget: "页面",
    summaryRoute: "X 文章",
    summaryContent: "xPoster 连接",
    summaryMain: "页面权限",
    summaryEditor: "编辑器",
    summaryUpload: "图片",
    summaryArticle: "文章",
    summaryDraft: "草稿内容",
    summaryVault: "本地图片",
    idle: "打开 X 文章页面后，检查 xPoster 是否可以写入。",
    extensionOnly: "请先把 xPoster 作为 Chrome 扩展加载，才能检查当前 X 页面。",
    statusXOpen: "已打开 X",
    statusOpenX: "请打开 X",
    statusEditing: "正在编辑",
    statusArticleList: "文章列表",
    statusNotArticle: "不是文章页",
    statusConnected: "已连接",
    statusNotConnected: "未连接",
    statusReady: "可用",
    statusRefresh: "刷新页面",
    statusCanWrite: "可写入",
    statusDomOnly: "受限",
    statusEditorMissing: "未找到",
    statusCanUpload: "可上传",
    statusUploadMissing: "未就绪",
    statusMissingId: "无文章 ID",
    statusNotEditing: "未编辑",
    statusEmpty: "空白",
    statusNoEditor: "无编辑器",
    statusPermission: "需要授权",
    statusOptional: "不需要",
    chars: "{count} 字",
    gatePage: "当前页面",
    gateRoute: "X 文章",
    gateConnection: "xPoster 连接",
    gateEditor: "写入目标",
    gateExisting: "文章内容",
    gateUpload: "图片上传",
    gateVault: "本地图片",
    gatePageOk: "当前标签页是 X/Twitter。",
    gatePageFix: "先打开 x.com，然后再检查。",
    gateRouteOk: "X 文章页面已打开。",
    gateRouteFix: "打开 X 文章编辑器或文章列表。",
    gateConnectionOk: "xPoster 可以访问这个页面。",
    gateConnectionFix: "刷新 X 标签页后再检查。",
    gateEditorOk: "xPoster 可以写入当前编辑器。",
    gateEditorArticleList: "写入前请打开或新建一篇文章草稿。",
    gateEditorFix: "写入前请先打开 X 文章草稿。",
    gateExistingOk: "编辑器当前是空的。",
    gateExistingFix: "编辑器里已有 {count} 个字，写入前请先确认。",
    gateExistingNoEditor: "当前没有会被覆盖的编辑器内容。",
    gateUploadOk: "X 的图片上传能力可用。",
    gateUploadFix: "写入图片前，请先打开文章编辑器。",
    gateVaultOk: "本地图片文件夹可用。",
    gateVaultOptional: "只有 Markdown 使用相对图片路径时才需要。",
    gateVaultFix: "{name}：请在侧边栏允许文件夹访问。",
    errorPrefix: "无法检查当前页面：{error}"
  }
};

i18n?.registerMessages(TEXT);

const SUMMARY_LABELS = [
  ["target", "summaryTarget"],
  ["route", "summaryRoute"],
  ["content", "summaryContent"],
  ["main", "summaryMain"],
  ["editor", "summaryEditor"],
  ["upload", "summaryUpload"],
  ["article", "summaryArticle"],
  ["contentRisk", "summaryDraft"],
  ["vault", "summaryVault"]
];

let latestResult = null;
let currentLanguage = i18n?.preferredLanguage?.() || preferredLanguage();

function hasChromeRuntime() {
  return typeof chrome !== "undefined" && Boolean(chrome.runtime?.sendMessage);
}

function hasChromeStorage() {
  return typeof chrome !== "undefined" && Boolean(chrome.storage?.local);
}

function preferredLanguage() {
  return i18n?.preferredLanguage?.() || (/^zh\b/i.test(navigator.language || "") ? "zh" : "en");
}

function language() {
  return i18n?.language?.() || (currentLanguage === "zh" ? "zh" : "en");
}

function t(key, values = {}) {
  if (i18n) return i18n.t(key, values);
  const source = TEXT[language()][key] || TEXT.en[key] || key;
  return source.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ""));
}

function setText(element, key, values = {}) {
  if (i18n) i18n.setText(element, key, values);
  else if (element) element.textContent = t(key, values);
}

function setLanguage(nextLanguage) {
  currentLanguage = i18n?.normalizeLanguage?.(nextLanguage) || (nextLanguage === "zh" ? "zh" : "en");
  if (i18n && i18n.language() !== currentLanguage) {
    i18n.setLanguage(currentLanguage, { persist: false, render: false });
  }
  renderLanguage();
}

async function restoreLanguage() {
  if (i18n) {
    currentLanguage = await i18n.restoreLanguage({ render: false });
    renderLanguage();
    return;
  }
  if (!hasChromeStorage()) {
    renderLanguage();
    return;
  }

  try {
    const stored = await chrome.storage.local.get(STORAGE_LANGUAGE);
    setLanguage(stored[STORAGE_LANGUAGE] || currentLanguage);
  } catch {
    renderLanguage();
  }
}

function renderLanguage() {
  document.documentElement.lang = language() === "zh" ? "zh-CN" : "en";
  document.body.dataset.language = language();
  document.title = t("documentTitle");
  setText(document.querySelector("h1"), "heading");
  setText(els.run, "run");
  setText(els.openArticles, "openArticles");
  setText(els.openSidePanel, "openSidePanel");
  setText(els.copyJson, "copyDetails");
  for (const [id, key] of SUMMARY_LABELS) {
    setText(els[id]?.closest("div")?.querySelector("span"), key);
  }

  if (latestResult) {
    setSummary(latestResult);
  } else {
    renderIdle();
  }
}

function renderIdle() {
  SUMMARY_LABELS.forEach(([id]) => {
    setText(els[id], "unknown");
  });
  els.gateList.innerHTML = `<li data-tone="idle">${escapeHtml(t("idle"))}</li>`;
  setText(els.details, "idle");
}

function formatChars(count) {
  return t("chars", { count });
}

function setSummary(result) {
  const content = result?.content;
  const main = content?.main;
  const vault = content?.vault;
  const targetContext = content?.targetContext;
  const editorLength = Number(targetContext?.editorTextLength || 0);

  setText(els.target, result?.tab?.isX ? "statusXOpen" : "statusOpenX");
  setText(
    els.route,
    content?.isEditorRoute ? "statusEditing" : content?.isArticleRoute ? "statusArticleList" : "statusNotArticle"
  );
  setText(els.content, content?.ok ? "statusConnected" : "statusNotConnected");
  setText(els.main, main?.ok && main.mainWorld ? "statusReady" : "statusRefresh");
  setText(
    els.editor,
    main?.hasDraftStateNode ? "statusCanWrite" : content?.hasEditorElement ? "statusDomOnly" : "statusEditorMissing"
  );
  setText(els.upload, main?.hasOnFilesAdded ? "statusCanUpload" : "statusUploadMissing");
  els.article.textContent = main?.articleId
    ? main.articleId
    : content?.isEditorRoute
      ? t("statusMissingId")
      : t("statusNotEditing");
  els.contentRisk.textContent = editorLength
    ? formatChars(editorLength)
    : targetContext?.hasEditor
      ? t("statusEmpty")
      : t("statusNoEditor");
  setText(els.vault, vault?.configured ? (vault.permission === "granted" ? "statusReady" : "statusPermission") : "statusOptional");
  renderGate(result);
}

function buildGate(result) {
  const content = result?.content;
  const main = content?.main;
  const vault = content?.vault;
  const targetContext = content?.targetContext;
  const editorLength = Number(targetContext?.editorTextLength || 0);
  const selectedFolder = vault?.name || (language() === "zh" ? "已选择的文件夹" : "Selected folder");

  return [
    {
      label: t("gatePage"),
      ok: Boolean(result?.tab?.isX),
      detail: result?.tab?.isX ? t("gatePageOk") : t("gatePageFix")
    },
    {
      label: t("gateRoute"),
      ok: Boolean(content?.isArticleRoute),
      detail: content?.isArticleRoute ? t("gateRouteOk") : t("gateRouteFix")
    },
    {
      label: t("gateConnection"),
      ok: Boolean(content?.ok && main?.ok && main.mainWorld),
      detail: content?.ok && main?.ok && main.mainWorld ? t("gateConnectionOk") : t("gateConnectionFix")
    },
    {
      label: t("gateEditor"),
      ok: Boolean(main?.hasDraftStateNode),
      detail: main?.hasDraftStateNode
        ? t("gateEditorOk")
        : content?.isArticleRoute
          ? t("gateEditorArticleList")
          : t("gateEditorFix")
    },
    {
      label: t("gateExisting"),
      ok: editorLength === 0,
      detail: editorLength
        ? t("gateExistingFix", { count: editorLength })
        : targetContext?.hasEditor
          ? t("gateExistingOk")
          : t("gateExistingNoEditor")
    },
    {
      label: t("gateUpload"),
      ok: Boolean(main?.hasOnFilesAdded),
      detail: main?.hasOnFilesAdded ? t("gateUploadOk") : t("gateUploadFix")
    },
    {
      label: t("gateVault"),
      ok: !vault?.configured || vault.permission === "granted",
      detail: vault?.configured
        ? vault.permission === "granted"
          ? t("gateVaultOk")
          : t("gateVaultFix", { name: selectedFolder })
        : t("gateVaultOptional")
    }
  ];
}

function renderGate(result) {
  const checks = buildGate(result);
  els.gateList.innerHTML = checks
    .map((check) => {
      const tone = check.ok ? "ok" : "error";
      return `<li data-tone="${tone}"><strong>${escapeHtml(check.label)}</strong><span>${escapeHtml(check.detail)}</span></li>`;
    })
    .join("");
}

function renderExtensionOnly() {
  els.run.disabled = true;
  els.openSidePanel.disabled = true;
  els.openArticles.disabled = true;
  els.copyJson.disabled = true;
  SUMMARY_LABELS.forEach(([id]) => {
    setText(els[id], "unavailable");
  });
  els.gateList.innerHTML = `<li data-tone="error">${escapeHtml(t("extensionOnly"))}</li>`;
  setText(els.details, "extensionOnly");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function runDiagnostics() {
  if (!hasChromeRuntime()) {
    renderExtensionOnly();
    return;
  }

  els.run.disabled = true;
  setText(els.run, "checking");
  try {
    const result = await chrome.runtime.sendMessage({ type: "xposter:diagnose-active-tab" });
    latestResult = result;
    setSummary(result);
    els.details.textContent = JSON.stringify(result, null, 2);
    els.copyJson.disabled = false;
  } catch (error) {
    els.details.textContent = t("errorPrefix", { error: error?.message || String(error) });
  } finally {
    els.run.disabled = false;
    setText(els.run, "run");
  }
}

async function openArticles() {
  if (!hasChromeRuntime()) return;
  try {
    await chrome.runtime.sendMessage({ type: "xposter:open-articles" });
    window.setTimeout(runDiagnostics, 500);
  } catch (error) {
    els.details.textContent = t("errorPrefix", { error: error?.message || String(error) });
  }
}

async function openSidePanel() {
  if (!hasChromeRuntime()) return;
  els.openSidePanel.disabled = true;
  setText(els.openSidePanel, "opening");
  try {
    await chrome.runtime.sendMessage({ type: "xposter:open-side-panel" });
  } catch (error) {
    els.details.textContent = t("errorPrefix", { error: error?.message || String(error) });
  } finally {
    els.openSidePanel.disabled = false;
    setText(els.openSidePanel, "openSidePanel");
  }
}

async function copyJson() {
  if (!latestResult) return;
  const text = JSON.stringify(latestResult, null, 2);
  try {
    await navigator.clipboard.writeText(text);
    setText(els.copyJson, "copied");
    window.setTimeout(() => {
      setText(els.copyJson, "copyDetails");
    }, COPY_FEEDBACK_MS);
  } catch {
    els.details.focus?.();
  }
}

function bindEvents() {
  els.run.addEventListener("click", runDiagnostics);
  els.openSidePanel.addEventListener("click", openSidePanel);
  els.openArticles.addEventListener("click", openArticles);
  els.copyJson.addEventListener("click", copyJson);

  if (hasChromeStorage() && chrome.storage.onChanged) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== "local" || !changes[STORAGE_LANGUAGE]) return;
      setLanguage(changes[STORAGE_LANGUAGE].newValue || preferredLanguage());
    });
  }
  window.addEventListener("xposter:i18n-language", (event) => {
    currentLanguage = event.detail?.language || preferredLanguage();
    renderLanguage();
  });
}

async function init() {
  bindEvents();
  await restoreLanguage();
  await runDiagnostics();
}

init();
