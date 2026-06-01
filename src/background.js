const REMOTE_IMAGE_TIMEOUT_MS = 10000;
const MAX_IMAGE_BYTES = 16 * 1024 * 1024;
const REMOTE_IMAGE_RETRY_DELAYS_MS = [0, 700, 1800];
const REMOTE_IMAGE_CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_REMOTE_IMAGE_CACHE_BYTES = 32 * 1024 * 1024;
const PRIVATE_IMAGE_HOST_RE = /^(localhost|.+\.localhost)$/i;
const SUPPORTED_IMAGE_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/bmp",
  "image/avif"
]);

const remoteImageCache = new Map();
let remoteImageCacheBytes = 0;
const SIDEPANEL_TARGET_TAB_STORAGE_KEY = "xposter_sidepanel_target_tab";

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "xposter:fetch-image") {
    fetchImage(message.url)
      .then(sendResponse)
      .catch((error) => sendResponse({ ok: false, error: error?.message || String(error) }));
    return true;
  }

  if (message?.type === "xposter:probe-image") {
    probeImage(message.url)
      .then(sendResponse)
      .catch((error) => sendResponse({ ok: false, error: error?.message || String(error) }));
    return true;
  }

  if (message?.type === "xposter:open-side-panel") {
    openSidePanel(sender)
      .then(sendResponse)
      .catch((error) => sendResponse({ ok: false, error: error?.message || String(error) }));
    return true;
  }

  if (message?.type === "xposter:open-articles") {
    openArticles(sender)
      .then(sendResponse)
      .catch((error) => sendResponse({ ok: false, error: error?.message || String(error) }));
    return true;
  }

  if (message?.type === "xposter:diagnose-active-tab") {
    diagnoseActiveTab()
      .then(sendResponse)
      .catch((error) => sendResponse({ ok: false, error: error?.message || String(error) }));
    return true;
  }

  return false;
});

async function openSidePanel(sender) {
  let tabId = sender.tab?.id || null;
  let sourceTab = sender.tab || null;
  if (!tabId) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    tabId = tab?.id || null;
    sourceTab = tab || null;
  }
  if (tabId) {
    await rememberSidePanelTargetTab(sourceTab || { id: tabId });
    await chrome.sidePanel.open({ tabId });
    return { ok: true, tabId };
  }
  try {
    await chrome.sidePanel.open({});
  } catch (error) {
    return { ok: false, error: "No active tab for side panel" };
  }
  return { ok: true };
}

async function rememberSidePanelTargetTab(tab) {
  if (!tab?.id || !isXUrl(tab.url || "")) return;
  try {
    await chrome.storage.local.set({
      [SIDEPANEL_TARGET_TAB_STORAGE_KEY]: {
        id: tab.id,
        url: tab.url || "",
        windowId: tab.windowId || null,
        savedAt: Date.now()
      }
    });
  } catch {}
}

function isXUrl(url) {
  return /^https:\/\/(?:x|twitter)\.com\//.test(String(url || ""));
}

async function diagnoseActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return { ok: false, error: "No active tab" };
  const url = tab.url || "";
  const isX = isXUrl(url);
  let content = null;
  if (isX) {
    try {
      content = await chrome.tabs.sendMessage(tab.id, { type: "xposter:diagnostics" });
    } catch (error) {
      content = { ok: false, error: error?.message || String(error) };
    }
  }
  return {
    ok: true,
    tab: { id: tab.id, title: tab.title || "", url, isX },
    content
  };
}

async function openArticles(sender) {
  let tab = sender?.tab || null;
  if (!tab?.id) {
    [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  }
  if (tab?.id) {
    if (/^https:\/\/(?:x|twitter)\.com\/compose\/articles(?:$|[/?#])/.test(tab.url || "")) {
      await rememberSidePanelTargetTab(tab);
      return { ok: true, tabId: tab.id };
    }
    const updated = await chrome.tabs.update(tab.id, { active: true, url: "https://x.com/compose/articles" });
    await rememberSidePanelTargetTab(updated || { ...tab, url: "https://x.com/compose/articles" });
    return { ok: true, tabId: tab.id };
  }
  const created = await chrome.tabs.create({ url: "https://x.com/compose/articles" });
  await rememberSidePanelTargetTab(created);
  return { ok: true, tabId: created.id || null };
}

async function fetchImage(url) {
  const valid = validateImageUrl(url);
  if (!valid.ok) return valid;
  if (valid.dataUri) return parseDataUri(url);
  return readRemoteImagePayload(valid.url.href);
}

async function probeImage(url) {
  const valid = validateImageUrl(url);
  if (!valid.ok) return valid;
  if (valid.dataUri) {
    const parsed = parseDataUri(url);
    return parsed.ok
      ? { ok: true, mime: parsed.mime, bytes: parsed.bytes || 0, fileName: "image.png" }
      : parsed;
  }

  const payload = await readRemoteImagePayload(valid.url.href);
  if (!payload.ok) return payload;
  return {
    ok: true,
    mime: payload.mime,
    fileName: payload.fileName,
    bytes: payload.bytes,
    repairedSignedUrl: payload.repairedSignedUrl,
    cacheHit: payload.cacheHit
  };
}

function validateImageUrl(value) {
  if (!value || typeof value !== "string") return { ok: false, error: "Invalid image URL" };
  const raw = value.trim();
  if (raw.startsWith("data:")) return { ok: true, dataUri: true };
  let url = null;
  try {
    url = new URL(raw);
  } catch {
    return { ok: false, error: "Invalid image URL" };
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return { ok: false, error: "Unsupported image scheme" };
  }
  if (isPrivateImageHost(url.hostname)) {
    return {
      ok: false,
      origin: url.origin,
      error: "Private network image URLs are not downloaded by xPoster. Use a public image URL or a selected local image folder."
    };
  }
  return { ok: true, url };
}

function isPrivateImageHost(hostname) {
  const host = String(hostname || "").replace(/^\[|\]$/g, "").toLowerCase();
  if (!host || PRIVATE_IMAGE_HOST_RE.test(host)) return true;
  if (host === "::" || host === "::1" || host === "0:0:0:0:0:0:0:1") return true;
  if (/^f[cd][0-9a-f]{2}:/i.test(host) || /^fe80:/i.test(host)) return true;
  const parts = ipv4PartsFromHost(host);
  return parts ? isPrivateIpv4Parts(parts) : false;
}

function ipv4PartsFromHost(host) {
  const dotted = host.split(".").map((part) => Number(part));
  if (dotted.length === 4 && dotted.every((part) => Number.isInteger(part) && part >= 0 && part <= 255)) {
    return dotted;
  }
  const mapped = host.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i);
  if (!mapped) return null;
  const high = Number.parseInt(mapped[1], 16);
  const low = Number.parseInt(mapped[2], 16);
  if (!Number.isFinite(high) || !Number.isFinite(low)) return null;
  return [high >> 8, high & 255, low >> 8, low & 255];
}

function isPrivateIpv4Parts(parts) {
  const [a, b] = parts;
  return (
    a === 10 ||
    a === 127 ||
    a === 0 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 192 && b === 0) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function remoteImageCacheKey(url) {
  return String(url || "");
}

function forgetCachedRemoteImage(key) {
  const existing = remoteImageCache.get(key);
  if (!existing) return;
  remoteImageCacheBytes = Math.max(0, remoteImageCacheBytes - (existing.bytes || 0));
  remoteImageCache.delete(key);
}

function cachedRemoteImage(url) {
  const key = remoteImageCacheKey(url);
  const cached = remoteImageCache.get(key);
  if (!cached) return null;
  if (cached.expiresAt <= Date.now()) {
    forgetCachedRemoteImage(key);
    return null;
  }
  remoteImageCache.delete(key);
  remoteImageCache.set(key, cached);
  return { ok: true, ...cached.payload, cacheHit: true };
}

function rememberRemoteImage(url, payload) {
  if (!payload?.ok || !payload.base64) return;
  const key = remoteImageCacheKey(url);
  forgetCachedRemoteImage(key);
  const bytes = payload.bytes || Math.ceil(payload.base64.length * 0.75);
  if (bytes > MAX_REMOTE_IMAGE_CACHE_BYTES) return;
  remoteImageCache.set(key, {
    expiresAt: Date.now() + REMOTE_IMAGE_CACHE_TTL_MS,
    bytes,
    payload: {
      base64: payload.base64,
      mime: payload.mime,
      fileName: payload.fileName,
      bytes,
      repairedSignedUrl: payload.repairedSignedUrl
    }
  });
  remoteImageCacheBytes += bytes;
  while (remoteImageCacheBytes > MAX_REMOTE_IMAGE_CACHE_BYTES && remoteImageCache.size) {
    forgetCachedRemoteImage(remoteImageCache.keys().next().value);
  }
}

function isRetryableRemoteImageResult(result) {
  const status = Number(result?.status || 0);
  return (
    [429, 500, 502, 503, 504].includes(status) ||
    /fetch failed|network|SSL|timed out|timeout/i.test(String(result?.error || ""))
  );
}

async function readRemoteImagePayload(url) {
  const cached = cachedRemoteImage(url);
  if (cached) return cached;

  let latest = null;
  for (const waitMs of REMOTE_IMAGE_RETRY_DELAYS_MS) {
    if (waitMs) await sleep(waitMs);
    latest = await fetchRemoteImagePayload(url);
    if (latest?.ok) {
      rememberRemoteImage(url, latest);
      return latest;
    }
    if (!isRetryableRemoteImageResult(latest)) break;
  }
  return latest || { ok: false, error: "Image download failed" };
}

async function fetchRemoteImagePayload(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REMOTE_IMAGE_TIMEOUT_MS);
  try {
    const fetched = await fetchRemoteImageResponse(url, controller.signal);
    if (!fetched.ok) return fetched.error;
    const { response, finalUrl, repairedSignedUrl } = fetched;
    const mime = (response.headers.get("content-type") || "").split(";")[0].trim() || guessMime(finalUrl || url);
    if (!isSupportedImageMime(mime)) {
      return { ok: false, error: `Unsupported image type: ${mime || "unknown"}` };
    }
    const contentLength = Number(response.headers.get("content-length") || 0);
    if (contentLength > MAX_IMAGE_BYTES) {
      return { ok: false, error: `Image is too large (${contentLength} bytes)` };
    }
    const buffer = await response.arrayBuffer();
    if (buffer.byteLength > MAX_IMAGE_BYTES) {
      return { ok: false, error: `Image is too large (${buffer.byteLength} bytes)` };
    }
    return {
      ok: true,
      base64: arrayBufferToBase64(buffer),
      mime,
      fileName: guessFileName(finalUrl || url),
      bytes: buffer.byteLength,
      repairedSignedUrl
    };
  } catch (error) {
    return remoteImageFetchError(
      url,
      error?.name === "AbortError" ? "Image fetch timed out" : error?.message || String(error)
    );
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchRemoteImageResponse(url, signal) {
  const candidates = remoteImageUrlCandidates(url);
  let lastReason = "Image download failed";
  let lastStatus = null;
  let retriedSignedUrl = false;
  for (let index = 0; index < candidates.length; index += 1) {
    const candidate = candidates[index];
    try {
      const response = await fetch(candidate.url, {
        signal,
        redirect: "follow",
        credentials: "omit"
      });
      if (response.ok) {
        const finalUrl = response.url || candidate.url;
        try {
          if (isPrivateImageHost(new URL(finalUrl).hostname)) {
            lastReason = "Image redirect points to a private network address";
            lastStatus = null;
            break;
          }
        } catch {}
        return {
          ok: true,
          response,
          finalUrl,
          repairedSignedUrl: candidate.repairedSignedUrl
        };
      }
      lastReason = `HTTP ${response.status}`;
      lastStatus = response.status;
      if (!shouldTryNextRemoteImageUrl(response.status, index, candidates.length)) break;
      retriedSignedUrl = retriedSignedUrl || Boolean(candidates[index + 1]?.repairedSignedUrl);
    } catch (error) {
      lastReason = error?.name === "AbortError" ? "Image fetch timed out" : error?.message || String(error);
      lastStatus = null;
      if (index >= candidates.length - 1) break;
      retriedSignedUrl = retriedSignedUrl || Boolean(candidates[index + 1]?.repairedSignedUrl);
    }
  }
  return {
    ok: false,
    error: remoteImageFetchError(url, lastReason, lastStatus, { retriedSignedUrl })
  };
}

function shouldTryNextRemoteImageUrl(status, index, candidateCount) {
  return index < candidateCount - 1 && [400, 401, 403, 404].includes(status);
}

function remoteImageUrlCandidates(url) {
  const candidates = [{ url, repairedSignedUrl: false }];
  const repaired = removeUnsignedResponseOverrideParams(url);
  if (repaired && repaired !== url) {
    candidates.push({ url: repaired, repairedSignedUrl: true });
  }
  return candidates;
}

function removeUnsignedResponseOverrideParams(url) {
  let parsed = null;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (!parsed.searchParams.has("q-signature")) return null;
  const signedParams = new Set(
    (parsed.searchParams.get("q-url-param-list") || "")
      .split(";")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean)
  );
  const queryIndex = url.indexOf("?");
  if (queryIndex < 0) return null;
  const hashIndex = url.indexOf("#", queryIndex);
  const base = url.slice(0, queryIndex + 1);
  const query = url.slice(queryIndex + 1, hashIndex < 0 ? undefined : hashIndex);
  const hash = hashIndex < 0 ? "" : url.slice(hashIndex);
  const parts = query.split("&").filter(Boolean);
  const filtered = parts.filter((part) => {
    const rawName = part.split("=")[0] || "";
    let name = rawName.toLowerCase();
    try {
      name = decodeURIComponent(rawName).toLowerCase();
    } catch {}
    return !(name.startsWith("response-") && !signedParams.has(name));
  });
  if (filtered.length === parts.length) return null;
  return `${base}${filtered.join("&")}${hash}`;
}

function remoteImageFetchError(url, reason, status = null, details = {}) {
  let origin = "the image website";
  try {
    origin = new URL(url).origin;
  } catch {}
  const normalized = String(reason || "Image download failed");
  const unavailable =
    status === 401 ||
    status === 403 ||
    status === 404 ||
    /fetch failed|network|SSL|timed out|timeout/i.test(normalized);
  const hint = unavailable
    ? `Chrome could not download this image from ${origin}. The signed image URL may be private, expired, blocked, or temporarily unreachable.${details.retriedSignedUrl ? " xPoster also retried this COS-style signed URL without unsigned response-* query parameters." : ""} Open the image URL in a normal tab; if it does not load there, replace it with a fresh public link and write again.`
    : `${origin} did not return a usable image file.`;
  return {
    ok: false,
    status,
    origin,
    error: `${normalized}. ${hint}`
  };
}

function parseDataUri(uri) {
  const match = String(uri || "").match(/^data:([^;,]+)?(;base64)?,([\s\S]*)$/);
  if (!match) return { ok: false, error: "Invalid data URI" };
  const mime = (match[1] || "image/png").toLowerCase();
  if (match[2]) {
    const base64 = match[3].replace(/\s+/g, "");
    return imagePayloadFromBase64(mime, base64);
  }
  try {
    const base64 = btoa(unescape(encodeURIComponent(decodeURIComponent(match[3]))));
    return imagePayloadFromBase64(mime, base64);
  } catch {
    return { ok: false, error: "Could not decode data URI" };
  }
}

function imagePayloadFromBase64(mime, base64) {
  if (!isSupportedImageMime(mime)) return { ok: false, error: `Unsupported image type: ${mime || "unknown"}` };
  const bytes = base64ByteLength(base64);
  if (bytes > MAX_IMAGE_BYTES) return { ok: false, error: `Image is too large (${bytes} bytes)` };
  return { ok: true, mime, base64, bytes };
}

function base64ByteLength(base64) {
  const clean = String(base64 || "").replace(/\s+/g, "");
  const padding = clean.endsWith("==") ? 2 : clean.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((clean.length * 3) / 4) - padding);
}

function isSupportedImageMime(mime) {
  return SUPPORTED_IMAGE_MIME_TYPES.has(String(mime || "").split(";")[0].trim().toLowerCase());
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let output = "";
  const chunkSize = 32768;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    output += String.fromCharCode.apply(null, bytes.subarray(index, index + chunkSize));
  }
  return btoa(output);
}

function guessMime(url) {
  const ext = String(url).split(/[?#]/)[0].split(".").pop()?.toLowerCase();
  return (
    {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
      bmp: "image/bmp",
      avif: "image/avif"
    }[ext] || "image/png"
  );
}

function guessFileName(url) {
  try {
    const parsed = new URL(url);
    const name = parsed.pathname.split("/").filter(Boolean).pop();
    return name && /\.[a-z0-9]{2,5}$/i.test(name) ? name : `image-${Date.now()}.png`;
  } catch {
    return `image-${Date.now()}.png`;
  }
}
