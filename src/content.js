(() => {
  const shared = window.xPosterShared;
  const CHANNEL_TO_MAIN = "xposter";
  const CHANNEL_FROM_MAIN = "xposter-main";
  const STATUS_ID = "__xposter_status__";
  const IMPORT_BUTTON_ID = "__xposter_import_button__";
  const DROP_HINT_ID = "__xposter_drop_hint__";
  const SIDEPANEL_DRAFT_STORAGE_KEY = "xposter_sidepanel_draft";
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
    currentMarkdown: ""
  };

  function isArticleRoute() {
    return /^https:\/\/(?:x|twitter)\.com\/compose\/articles(?:$|[/?#])/.test(location.href);
  }

  function isEditorRoute() {
    return /^https:\/\/(?:x|twitter)\.com\/compose\/articles\/edit\//.test(location.href);
  }

  function articleIdFromUrl() {
    return location.pathname.match(/\/compose\/articles\/edit\/(\d+)/)?.[1] || null;
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

  function truncateText(text, maxLength) {
    const cleaned = normalizeText(text);
    return cleaned.length > maxLength ? `${cleaned.slice(0, Math.max(0, maxLength - 3))}...` : cleaned;
  }

  function showStatus(text, level = "work", timeout = 0) {
    let card = document.getElementById(STATUS_ID);
    if (!card) {
      card = document.createElement("section");
      card.id = STATUS_ID;
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
    card.dataset.level = level;
    if (title) title.textContent = statusTitleForLevel(level);
    if (detail) detail.textContent = text;
    document.body.classList.add("__xposter_status_visible");
    broadcast({ type: "status", text, level });
    if (timeout) window.setTimeout(hideStatus, timeout);
  }

  function hideStatus() {
    document.getElementById(STATUS_ID)?.remove();
    document.body.classList.remove("__xposter_status_visible");
    broadcast({ type: "status", text: "", level: "idle" });
  }

  function statusTitleForLevel(level) {
    if (level === "done") return "Article written";
    if (level === "warn") return "Image note";
    if (level === "error") return "Could not write";
    return "Writing article";
  }

  function injectStatusStyle() {
    if (document.getElementById("__xposter_status_style__")) return;
    const style = document.createElement("style");
    style.id = "__xposter_status_style__";
    style.textContent = `
      #${STATUS_ID} {
        position: fixed;
        z-index: 2147483647;
        top: 76px;
        right: 18px;
        width: min(340px, calc(100vw - 36px));
        display: grid;
        gap: 7px;
        padding: 13px 14px 12px;
        border: 1px solid #d8d2c6;
        overflow: hidden;
        isolation: isolate;
        background:
          linear-gradient(110deg, transparent 0 22%, rgba(47, 111, 104, 0.12) 42%, transparent 62%),
          radial-gradient(circle at 18px 18px, rgba(32, 31, 27, 0.08) 1px, transparent 1.5px),
          #fbfaf7;
        background-size: 190% 100%, 22px 22px, auto;
        color: #201f1b;
        font: 13px/1.45 ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif;
        letter-spacing: 0;
        box-shadow: 0 18px 46px rgba(32, 31, 27, 0.2);
        pointer-events: none;
        animation: __xposter_status_in 220ms cubic-bezier(0.22, 1, 0.36, 1) both, __xposter_status_sweep 3s linear infinite;
      }
      #${STATUS_ID}::before {
        content: "";
        position: absolute;
        inset: 0 auto 0 0;
        width: 4px;
        background: #2f6f68;
      }
      #${STATUS_ID}[data-level="warn"]::before { background: #a7552b; }
      #${STATUS_ID}[data-level="done"]::before { background: #3f6f42; }
      #${STATUS_ID}[data-level="error"]::before { background: #9d2f2f; }
      #${STATUS_ID}[data-level="warn"] {
        background-image:
          linear-gradient(110deg, transparent 0 22%, rgba(167, 85, 43, 0.13) 42%, transparent 62%),
          radial-gradient(circle at 18px 18px, rgba(32, 31, 27, 0.08) 1px, transparent 1.5px);
      }
      #${STATUS_ID}[data-level="done"] {
        background-image:
          linear-gradient(110deg, rgba(63, 111, 66, 0.12), transparent 58%),
          radial-gradient(circle at 18px 18px, rgba(32, 31, 27, 0.08) 1px, transparent 1.5px);
        animation: __xposter_status_in 220ms cubic-bezier(0.22, 1, 0.36, 1) both;
      }
      #${STATUS_ID}[data-level="error"] {
        background-image:
          linear-gradient(110deg, rgba(157, 47, 47, 0.13), transparent 58%),
          radial-gradient(circle at 18px 18px, rgba(32, 31, 27, 0.08) 1px, transparent 1.5px);
        animation: __xposter_status_in 220ms cubic-bezier(0.22, 1, 0.36, 1) both;
      }
      #${STATUS_ID} .__xposter_status_head {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      #${STATUS_ID} .__xposter_status_head span {
        color: #6b665e;
        font-size: 10px;
        font-weight: 820;
        text-transform: uppercase;
      }
      #${STATUS_ID} .__xposter_status_head strong {
        color: #2f6f68;
        font-size: 12px;
        line-height: 1.2;
      }
      #${STATUS_ID}[data-level="warn"] .__xposter_status_head strong { color: #a7552b; }
      #${STATUS_ID}[data-level="done"] .__xposter_status_head strong { color: #3f6f42; }
      #${STATUS_ID}[data-level="error"] .__xposter_status_head strong { color: #9d2f2f; }
      #${STATUS_ID} p {
        position: relative;
        z-index: 1;
        margin: 0;
        color: #4c4840;
        overflow-wrap: anywhere;
      }
      @keyframes __xposter_status_in {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes __xposter_status_sweep {
        from { background-position: 160% 0, 0 0, 0 0; }
        to { background-position: -60% 0, 0 0, 0 0; }
      }
      @media (prefers-reduced-motion: reduce) {
        #${STATUS_ID} {
          animation: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function broadcast(payload) {
    chrome.runtime
      .sendMessage({ type: "xposter:event", event: payload.type || "message", payload })
      .catch(() => {});
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

  function runMain(payload, filePayloads = new Map()) {
    return new Promise((resolve, reject) => {
      let timeout = null;
      const refreshTimeout = () => {
        clearTimeout(timeout);
        timeout = window.setTimeout(() => {
          window.removeEventListener("message", listener);
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
          resolve(message.summary || {});
          return;
        }
        if (message.kind === "error") {
          clearTimeout(timeout);
          window.removeEventListener("message", listener);
          reject(new Error(message.error || "X editor bridge failed"));
        }
      };
      window.addEventListener("message", listener);
      refreshTimeout();
      window.postMessage({ source: CHANNEL_TO_MAIN, kind: "run", payload }, "*");
    });
  }

  async function importMarkdown(markdown, origin = "manual") {
    if (state.busy) return { ok: false, error: "Import already running" };
    state.busy = true;
    state.currentMarkdown = markdown;
    const startedAt = performance.now();
    showStatus("Preparing Markdown...", "work");
    try {
      if (!isArticleRoute()) throw new Error("Open X Articles first");
      if (origin !== "paste" && !findEditor()) {
        await ensureEditorReadyForFileImport();
      }
      const parsed = shared.parseMarkdown(markdown);
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

      const coverLocalImage = coverSegment && shared.isLocalImageSource(coverSegment.source) ? coverSegment : null;
      if (localImages.length || coverLocalImage) {
        await ensureVaultForLocalImages(localImages.length + (coverLocalImage ? 1 : 0));
      }
      const imageMap = await prepareImages(segments);
      const coverResult = coverSegment
        ? await loadImageWithRetry(coverSegment.source, "cover")
        : null;
      const tableMap = await prepareTables(segments);
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

      showStatus("Writing into X editor...", "work");
      const mainSummary = await runMain(pastePlan, filePayloads);
      const elapsedMs = Math.round(performance.now() - startedAt);
      const summary = {
        ok: true,
        title: limitedParsed.title,
        cover: limitedParsed.cover,
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
      showStatus(message, "error", 8000);
      broadcast({ type: "error", error: message, mediaFailures: error?.mediaFailures || null, mainSummary: error?.mainSummary || null });
      return { ok: false, error: message };
    } finally {
      state.busy = false;
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
    return /^https?:\/\//i.test(String(source || "").trim());
  }

  async function openSidePanelForRemoteImages() {
    await saveDraftForSidePanel();
    try {
      await chrome.runtime.sendMessage({ type: "xposter:open-side-panel" });
    } catch {}
  }

  async function saveDraftForSidePanel(markdown = "") {
    const draft = String(markdown || state.currentMarkdown || "");
    if (!draft || !chrome.storage?.local) return;
    try {
      await chrome.storage.local.set({ [SIDEPANEL_DRAFT_STORAGE_KEY]: draft });
    } catch {}
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
        const index = next;
        next += 1;
        const segment = images[index];
        showStatus(`Preparing image ${index + 1}/${images.length}...`, "work");
        map.set(segment, await loadImageWithRetry(segment.source, `image-${index + 1}`));
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
    if (source.startsWith("data:")) {
      const parsed = shared.parseDataUri(source);
      return parsed.ok
        ? { ok: true, ...parsed, fileName: `${fallbackName}.png`, source }
        : { ok: false, error: parsed.error, source };
    }
    if (shared.isLocalImageSource(source)) {
      return shared.resolveLocalImage(source);
    }
    try {
      const result = await chrome.runtime.sendMessage({ type: "xposter:fetch-image", url: source });
      if (!result?.ok) {
        return {
          ok: false,
          error: result?.error || "Image fetch failed",
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
          map.set(segment, await shared.renderTableImage(segment, `table-${index + 1}.png`));
        } catch (error) {
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
    const elapsed = summary?.elapsedMs ? ` in ${(summary.elapsedMs / 1000).toFixed(1)}s` : "";
    const skippedImages = Number(warnings.images || 0) + uploadFailures;
    const skippedTables = Number(warnings.tables || 0);
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
      if (isXposterDropCandidate(event.dataTransfer) && isArticleRoute()) showDropHint(event.dataTransfer, event);
    }, true);
    document.addEventListener("dragover", (event) => {
      if (!isXposterDropCandidate(event.dataTransfer) || !isArticleRoute()) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
      showDropHint(event.dataTransfer, event);
    }, true);
    document.addEventListener("dragleave", (event) => {
      if (hasFiles(event.dataTransfer) && isLeavingDocument(event)) hideDropHint();
    }, true);
    document.addEventListener("drop", async (event) => {
      if (!isXposterDropCandidate(event.dataTransfer) || !isArticleRoute()) return;
      const files = Array.from(event.dataTransfer.files || []);
      const markdown = files.find(isMarkdownFile);
      const imageFiles = markdown ? [] : imageFilesFromTransfer(event.dataTransfer);
      const markdownText = markdown ? "" : markdownTextFromTransfer(event.dataTransfer);
      const imageUrl = markdown || imageFiles.length || markdownText ? "" : imageUrlFromTransfer(event.dataTransfer);
      const directoryItem = markdown || imageFiles.length || imageUrl ? null : findDirectoryTransferItem(event.dataTransfer);
      if (!markdown && !imageFiles.length && !markdownText && !imageUrl && !directoryItem) {
        hideDropHint();
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      hideDropHint();
      if (markdown) {
        await importFile(markdown, "drop");
        return;
      }
      if (imageFiles.length) {
        await uploadDroppedImages(imageFiles);
        return;
      }
      if (markdownText) {
        await ensureEditorReadyForFileImport();
        await importMarkdown(markdownText, "drop");
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

  function showDropHint(dataTransfer = null, event = null) {
    const mode = dropHintMode(dataTransfer);
    let hint = document.getElementById(DROP_HINT_ID);
    if (!hint) {
      hint = document.createElement("section");
      hint.id = DROP_HINT_ID;
      hint.setAttribute("aria-label", "xPoster drop tray");
      hint.innerHTML = `
        <div class="__xposter_drop_kicker">Drop into xPoster</div>
        <strong></strong>
        <p></p>
        <div class="__xposter_drop_slots">
          <span data-slot="markdown">Markdown</span>
          <span data-slot="image">Image</span>
          <span data-slot="folder">Image folder</span>
        </div>
      `;
      injectDropHintStyle();
      document.body.appendChild(hint);
    }
    if (event) positionDropHint(hint, event);
    hint.dataset.mode = mode;
    const title = hint.querySelector("strong");
    const detail = hint.querySelector("p");
    if (title) {
      title.textContent =
        mode === "folder" ? "Drop image folder here" : mode === "image" ? "Drop image into article" : "Drop Markdown here";
    }
    if (detail) {
      detail.textContent =
        mode === "folder"
          ? "xPoster will remember this folder for local image paths. It will not import the article yet."
          : mode === "image"
            ? "xPoster will hand the image file to X's own uploader and insert it into the open article."
          : "xPoster will create or use the open X Article and write the Markdown draft.";
    }
  }

  function hideDropHint() {
    document.getElementById(DROP_HINT_ID)?.remove();
  }

  function positionDropHint(hint, event) {
    const width = Math.min(420, Math.max(280, window.innerWidth - 44));
    const height = 164;
    const margin = 14;
    const minLeft = margin;
    const maxLeft = Math.max(minLeft, window.innerWidth - width - margin);
    const minTop = margin;
    const maxTop = Math.max(minTop, window.innerHeight - height - margin);
    const left = Math.min(maxLeft, Math.max(minLeft, event.clientX - width / 2));
    const preferredTop = event.clientY + 24;
    const fallbackTop = event.clientY - height - 24;
    const top = preferredTop <= maxTop
      ? Math.max(minTop, preferredTop)
      : Math.min(maxTop, Math.max(minTop, fallbackTop));
    hint.style.setProperty("--xposter-drop-left", `${left}px`);
    hint.style.setProperty("--xposter-drop-top", `${top}px`);
  }

  function dropHintMode(dataTransfer) {
    if (!dataTransfer) return "markdown";
    if (hasMarkdownText(dataTransfer)) return "markdown";
    const files = Array.from(dataTransfer.files || []);
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
        left: var(--xposter-drop-left, 22px);
        top: var(--xposter-drop-top, 96px);
        width: min(400px, calc(100vw - 44px));
        min-height: 164px;
        transform: translateY(0);
        display: grid;
        align-content: center;
        gap: 10px;
        padding: 18px;
        border: 2px solid #2f6f68;
        background:
          linear-gradient(110deg, transparent 0 24%, rgba(47, 111, 104, 0.15) 42%, transparent 62%),
          linear-gradient(135deg, rgba(47, 111, 104, 0.11), rgba(251, 250, 247, 0.96) 42%),
          #fbfaf7;
        background-size: 190% 100%, auto, auto;
        color: #201f1b;
        box-shadow: 0 24px 66px rgba(32, 31, 27, 0.26);
        font: 14px/1.45 ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif;
        letter-spacing: 0;
        pointer-events: none;
        animation: __xposter_drop_in 220ms cubic-bezier(0.22, 1, 0.36, 1) both, __xposter_drop_sweep 2.8s linear infinite;
      }
      #${DROP_HINT_ID}::before {
        content: "";
        position: absolute;
        inset: 10px;
        border: 1px dashed rgba(47, 111, 104, 0.46);
      }
      #${DROP_HINT_ID} .__xposter_drop_kicker {
        position: relative;
        color: #2f6f68;
        font-size: 11px;
        font-weight: 840;
        text-transform: uppercase;
      }
      #${DROP_HINT_ID} strong {
        position: relative;
        max-width: 18rem;
        font-size: 20px;
        line-height: 1.08;
      }
      #${DROP_HINT_ID} p {
        position: relative;
        max-width: 26rem;
        margin: 0;
        color: #5d584f;
        font-size: 13px;
      }
      #${DROP_HINT_ID} .__xposter_drop_slots {
        position: relative;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
        margin-top: 4px;
      }
      #${DROP_HINT_ID} .__xposter_drop_slots span {
        min-height: 34px;
        display: grid;
        place-items: center;
        border: 1px solid #d8d2c6;
        background: rgba(255, 255, 255, 0.38);
        color: #6b665e;
        font-size: 11px;
        font-weight: 820;
        text-transform: uppercase;
      }
      #${DROP_HINT_ID}[data-mode="markdown"] [data-slot="markdown"],
      #${DROP_HINT_ID}[data-mode="image"] [data-slot="image"],
      #${DROP_HINT_ID}[data-mode="folder"] [data-slot="folder"] {
        border-color: #2f6f68;
        background: #2f6f68;
        color: #f8fbf8;
      }
      @keyframes __xposter_drop_in {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes __xposter_drop_sweep {
        from { background-position: 160% 0, 0 0, 0 0; }
        to { background-position: -60% 0, 0 0, 0 0; }
      }
      @media (prefers-reduced-motion: reduce) {
        #${DROP_HINT_ID} {
          animation: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type === "xposter:import-markdown") {
      importMarkdown(message.markdown || "", "sidepanel").then(sendResponse);
      return true;
    }
    if (message?.type === "xposter:analyze-markdown") {
      try {
        const parsed = shared.parseMarkdown(message.markdown || "");
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

  document.addEventListener("paste", onPaste, { capture: true });
  installImportButton();
  installDragDrop();
  waitForMainReady(2000).catch(() => {});
  console.log("[xPoster] content script ready");
})();
