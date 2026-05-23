const REMOTE_IMAGE_TIMEOUT_MS = 15000;
const MAX_IMAGE_BYTES = 16 * 1024 * 1024;
const REMOTE_IMAGE_RETRY_DELAYS_MS = [0, 500, 1400, 3000, 6000, 10000];
const REMOTE_IMAGE_CACHE_TTL_MS = 10 * 60 * 1000;
const MAX_REMOTE_IMAGE_CACHE_BYTES = 96 * 1024 * 1024;

const remoteImageCache = new Map();
let remoteImageCacheBytes = 0;

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
    openArticles()
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
  if (!tabId) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    tabId = tab?.id || null;
  }
  if (tabId) {
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

async function diagnoseActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return { ok: false, error: "No active tab" };
  const url = tab.url || "";
  const isX = /^https:\/\/(?:x|twitter)\.com\//.test(url);
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

async function openArticles() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    if (/^https:\/\/(?:x|twitter)\.com\/compose\/articles(?:$|[/?#])/.test(tab.url || "")) {
      return { ok: true, tabId: tab.id };
    }
    await chrome.tabs.update(tab.id, { url: "https://x.com/compose/articles" });
    return { ok: true, tabId: tab.id };
  }
  const created = await chrome.tabs.create({ url: "https://x.com/compose/articles" });
  return { ok: true, tabId: created.id || null };
}

async function fetchImage(url) {
  if (!url || typeof url !== "string") return { ok: false, error: "Invalid image URL" };
  if (url.startsWith("data:")) return parseDataUri(url);
  if (!/^https?:\/\//i.test(url)) return { ok: false, error: "Unsupported image scheme" };
  return readRemoteImagePayload(url);
}

async function probeImage(url) {
  if (!url || typeof url !== "string") return { ok: false, error: "Invalid image URL" };
  if (url.startsWith("data:")) {
    const parsed = parseDataUri(url);
    return parsed.ok
      ? { ok: true, mime: parsed.mime, bytes: parsed.bytes || 0, fileName: "image.png" }
      : parsed;
  }
  if (!/^https?:\/\//i.test(url)) return { ok: false, error: "Unsupported image scheme" };

  const payload = await readRemoteImagePayload(url);
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
    const buffer = await response.arrayBuffer();
    if (buffer.byteLength > MAX_IMAGE_BYTES) {
      return { ok: false, error: `Image is too large (${buffer.byteLength} bytes)` };
    }
    const mime = (response.headers.get("content-type") || "").split(";")[0].trim() || guessMime(finalUrl || url);
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
        return {
          ok: true,
          response,
          finalUrl: candidate.url,
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
  if (match[2]) return { ok: true, mime, base64: match[3].replace(/\s+/g, ""), bytes: Math.floor(match[3].length * 0.75) };
  try {
    const base64 = btoa(unescape(encodeURIComponent(decodeURIComponent(match[3]))));
    return { ok: true, mime, base64, bytes: Math.floor(base64.length * 0.75) };
  } catch {
    return { ok: false, error: "Could not decode data URI" };
  }
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
