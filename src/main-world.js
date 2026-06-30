(() => {
  const LOG = "[xPoster MAIN]";
  const CHANNEL_TO_MAIN = "xposter";
  const CHANNEL_FROM_MAIN = "xposter-main";
  const EDITOR_SELECTOR =
    "[data-contents='true'] [contenteditable='true'], [contenteditable='true'][role='textbox'], [contenteditable='true'].public-DraftEditor-content, [contenteditable='true']";
  const MEDIA_UPLOAD_BASE_TIMEOUT_MS = 90000;
  const MEDIA_UPLOAD_PER_ITEM_TIMEOUT_MS = 2500;
  const MEDIA_UPLOAD_MAX_TIMEOUT_MS = 150000;
  const MEDIA_UPLOAD_PROGRESS_HEARTBEAT_MS = 15000;
  const MEDIA_UPLOAD_NO_ENTITY_TIMEOUT_MS = 45000;
  const MEDIA_UPLOAD_PENDING_READY_MS = 20000;
  const MEDIA_UPLOAD_PENDING_STABLE_MS = 5000;
  const MEDIA_UPLOAD_PENDING_MAX_WAIT_MS = 32000;
  const MEDIA_UPLOAD_USER_RETRY_AFTER_MS = 15000;
  const MEDIA_UPLOAD_MAX_ATTEMPTS = 3;
  const MEDIA_UPLOAD_RETRY_MIN_REMAINING_MS = 10000;
  const MEDIA_UPLOAD_TIMEOUT_ERROR =
    "X media upload took too long. X may be throttling this draft, especially with many images. Wait a moment, then write again or split the article.";

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  let cancelRequested = false;
  let activeUploadRetry = null;

  function post(kind, payload = {}) {
    window.postMessage({ source: CHANNEL_FROM_MAIN, kind, ...payload }, "*");
  }

  function progress(text, level = "work", extra = {}) {
    post("progress", { text, level, ...extra });
  }

  function throwIfCancelled() {
    if (!cancelRequested) return;
    const error = new Error("Writing stopped by user.");
    error.cancelled = true;
    throw error;
  }

  function requestPreparedFile(operation, timeoutMs = 30000) {
    const token = operation?.op?.file?.token || operation?.marker || "";
    if (operation?.op?.file?.base64) return Promise.resolve(operation.op.file);
    if (!token) return Promise.reject(new Error("Prepared image token is missing"));
    const requestId = `file_${Math.random().toString(36).slice(2, 10)}`;
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        window.removeEventListener("message", listener);
        reject(new Error("Prepared image data did not arrive"));
      }, timeoutMs);
      const listener = (event) => {
        if (event.source !== window || event.data?.source !== CHANNEL_TO_MAIN) return;
        const message = event.data;
        if (message.kind !== "file-response" || message.requestId !== requestId) return;
        clearTimeout(timeout);
        window.removeEventListener("message", listener);
        if (message.ok && message.file?.base64) resolve(message.file);
        else reject(new Error(message.error || "Prepared image data was not available"));
      };
      window.addEventListener("message", listener);
      post("file-request", { requestId, token, marker: operation.marker });
    });
  }

  function imageSourcesMatch(left, right) {
    const leftRaw = String(left || "").trim();
    const rightRaw = String(right || "").trim();
    if (!leftRaw || !rightRaw) return false;
    if (leftRaw === rightRaw) return true;
    try {
      const leftUrl = new URL(leftRaw, location.href);
      const rightUrl = new URL(rightRaw, location.href);
      leftUrl.hash = "";
      rightUrl.hash = "";
      return decodeURIComponent(leftUrl.href) === decodeURIComponent(rightUrl.href);
    } catch {
      return leftRaw.split("#")[0] === rightRaw.split("#")[0];
    }
  }

  function findEditorElement() {
    for (const element of document.querySelectorAll(EDITOR_SELECTOR)) {
      const rect = element.getBoundingClientRect();
      if (rect.width > 200 && rect.height > 80) return element;
    }
    return null;
  }

  function findDraftStateNode() {
    const editor = findEditorElement();
    if (!editor) return null;
    const fiberKey = Object.keys(editor).find(
      (key) => key.startsWith("__reactFiber$") || key.startsWith("__reactInternalInstance$")
    );
    if (!fiberKey) return null;
    let fiber = editor[fiberKey];
    for (let depth = 0; depth < 80 && fiber; depth += 1) {
      const stateNode = fiber.stateNode;
      if (stateNode?.props?.editorState && typeof stateNode.props.onChange === "function") {
        return stateNode;
      }
      fiber = fiber.return;
    }
    return null;
  }

  function findOnFilesAdded() {
    const editor = findEditorElement();
    if (!editor) return null;
    const fiberKey = Object.keys(editor).find(
      (key) => key.startsWith("__reactFiber$") || key.startsWith("__reactInternalInstance$")
    );
    if (!fiberKey) return null;
    let fiber = editor[fiberKey];
    for (let depth = 0; depth < 160 && fiber; depth += 1) {
      const props = fiber.memoizedProps || fiber.stateNode?.props;
      if (typeof props?.onFilesAdded === "function") return props.onFilesAdded;
      const nested = findOnFilesAddedInFiberChildren(fiber.child, 0);
      if (nested) return nested;
      fiber = fiber.return;
    }
    return null;
  }

  function findOnFilesAddedInFiberChildren(fiber, depth) {
    if (!fiber || depth > 8) return null;
    const props = fiber.memoizedProps || fiber.stateNode?.props;
    if (typeof props?.onFilesAdded === "function") return props.onFilesAdded;
    return findOnFilesAddedInFiberChildren(fiber.child, depth + 1) || findOnFilesAddedInFiberChildren(fiber.sibling, depth);
  }

  function pasteHtml(html, plain) {
    const editor = findEditorElement();
    if (!editor) return false;
    editor.focus();
    const data = new DataTransfer();
    data.setData("text/html", html);
    data.setData("text/plain", plain || html.replace(/<[^>]*>/g, ""));
    const event = new ClipboardEvent("paste", {
      bubbles: true,
      cancelable: true,
      clipboardData: data
    });
    if (event.clipboardData !== data) {
      Object.defineProperty(event, "clipboardData", { value: data });
    }
    return editor.dispatchEvent(event);
  }

  function isDraftCharacterMetadata(character, requireStyle = true) {
    return Boolean(character?.set && (!requireStyle || character.getStyle));
  }

  function firstCharacterMetadata(block, requireStyle = true) {
    const characterList = block?.getCharacterList?.();
    if (!characterList) return null;
    if (typeof characterList.find === "function") {
      const found = characterList.find((character) => isDraftCharacterMetadata(character, requireStyle));
      if (found) return found;
    }
    const size =
      typeof characterList.size === "number"
        ? characterList.size
        : typeof characterList.count === "function"
          ? characterList.count()
          : 0;
    for (let index = 0; index < size; index += 1) {
      const character = characterList.get?.(index);
      if (isDraftCharacterMetadata(character, requireStyle)) return character;
    }
    const first = characterList.first?.() || characterList.get?.(0);
    return isDraftCharacterMetadata(first, requireStyle) ? first : null;
  }

  function findDraftCharacterSample(draftNode) {
    const blockMap = draftNode?.props?.editorState?.getCurrentContent?.()?.getBlockMap?.();
    if (!blockMap?.find) return null;
    const block = blockMap.find((candidate) => Boolean(firstCharacterMetadata(candidate))) || null;
    return block ? { block, character: firstCharacterMetadata(block) } : null;
  }

  function findDraftSampleBlock(draftNode) {
    return findDraftCharacterSample(draftNode)?.block || null;
  }

  async function ensureDraftCharacterSample(draftNode) {
    if (findDraftSampleBlock(draftNode)) return draftNode;
    const editor = findEditorElement();
    if (!editor) return draftNode;

    editor.focus();
    document.execCommand("insertText", false, "x");

    const deadline = Date.now() + 1600;
    while (Date.now() < deadline) {
      await sleep(80);
      const latestNode = findDraftStateNode() || draftNode;
      if (findDraftSampleBlock(latestNode)) return latestNode;
    }
    return findDraftStateNode() || draftNode;
  }

  function writeDraftBlocks(draftNode, blocks) {
    if (!Array.isArray(blocks) || !blocks.length) return { ok: false, error: "No structured blocks" };

    const editorState = draftNode.props.editorState;
    const EditorState = editorState.constructor;
    const SelectionState = editorState.getSelection().constructor;
    const contentState = editorState.getCurrentContent();
    const blockMap = contentState.getBlockMap();
    const sample = findDraftCharacterSample(draftNode);
    const sampleBlock = sample?.block || null;
    const sampleCharacter = sample?.character || null;
    if (!sampleBlock || !sampleCharacter) return { ok: false, error: "No Draft.js character sample for structured write" };

    const BlockMap = blockMap.constructor;
    const CharacterList = sampleBlock.getCharacterList().constructor;
    if (!sampleCharacter?.set || !sampleCharacter.getStyle) return { ok: false, error: "No Draft.js character metadata sample for structured write" };

    let nextContent = contentState;
    let nextBlockMap = BlockMap();
    const createdKeys = [];

    for (let index = 0; index < blocks.length; index += 1) {
      const block = blocks[index] || {};
      const text = String(block.text || "");
      const key = `${Math.random().toString(36).slice(2, 7)}${index.toString(36)}`;
      let characterList = CharacterList();
      const entityRanges = new Map();

      for (const link of block.links || []) {
        const offset = Number(link.offset) || 0;
        const length = Math.max(0, Number(link.length) || 0);
        if (!length || !link.url) continue;
        nextContent = nextContent.createEntity("LINK", "MUTABLE", { url: String(link.url) });
        entityRanges.set(`${offset}:${offset + length}`, nextContent.getLastCreatedEntityKey());
      }

      for (let charIndex = 0; charIndex < text.length; charIndex += 1) {
        const styleNames = (block.inlineStyleRanges || [])
          .filter((range) => charIndex >= range.offset && charIndex < range.offset + range.length)
          .map((range) => draftInlineStyleName(range.style))
          .filter(Boolean);
        let entity = null;
        for (const [range, entityKey] of entityRanges.entries()) {
          const [start, end] = range.split(":").map(Number);
          if (charIndex >= start && charIndex < end) {
            entity = entityKey;
            break;
          }
        }
        let style = sampleCharacter.getStyle().clear();
        for (const styleName of styleNames) style = style.add(styleName);
        characterList = characterList.push(sampleCharacter.set("style", style).set("entity", entity));
      }

      const nextBlock = sampleBlock.merge({
        key,
        type: block.type || "unstyled",
        text,
        characterList,
        depth: block.type === "unordered-list-item" || block.type === "ordered-list-item" ? 0 : 0,
        data: sampleBlock.getData?.()?.clear?.() || sampleBlock.getData?.()
      });
      nextBlockMap = nextBlockMap.set(key, nextBlock);
      createdKeys.push(key);
    }

    if (!createdKeys.length) return { ok: false, error: "No Draft.js blocks created" };
    const lastKey = createdKeys[createdKeys.length - 1];
    const selection = SelectionState.createEmpty(lastKey);
    const nextState = nextContent
      .set("blockMap", nextBlockMap)
      .set("selectionBefore", selection)
      .set("selectionAfter", selection);
    let nextEditorState = EditorState.push(editorState, nextState, "insert-fragment");
    nextEditorState = EditorState.moveSelectionToEnd(nextEditorState);
    draftNode.props.onChange(nextEditorState);
    return { ok: true, blocks: createdKeys.length };
  }

  function draftInlineStyleName(style) {
    return (
      {
        Bold: "BOLD",
        Italic: "ITALIC",
        Strikethrough: "STRIKETHROUGH",
        Code: "CODE"
      }[style] || style
    );
  }

  function findMarkerLocation(contentState, marker, options = {}) {
    const needle = String(marker || "");
    if (!needle) return null;
    let exact = null;
    let partial = null;
    contentState.getBlockMap().forEach((block, key) => {
      if (block.getType() === "atomic") return;
      const text = block.getText() || "";
      const offset = text.indexOf(needle);
      if (offset < 0) return;
      const candidate = {
        blockKey: key,
        offset,
        length: needle.length,
        exact: text.trim() === needle
      };
      if (candidate.exact && !exact) exact = candidate;
      else if (!partial) partial = candidate;
    });
    if (exact) return exact;
    return options.exactOnly ? null : partial;
  }

  function findMarkerBlock(contentState, marker, options = {}) {
    return findMarkerLocation(contentState, marker, options)?.blockKey || null;
  }

  function countMarkerTokens(draftNode, prefix) {
    if (!draftNode || !prefix) return 0;
    let count = 0;
    const markerPattern = markerTokenPattern(prefix);
    draftNode.props.editorState
      .getCurrentContent()
      .getBlockMap()
      .forEach((block) => {
        const matches = (block.getText() || "").match(markerPattern);
        if (matches?.length) count += matches.length;
      });
    return count;
  }

  function countAnyMarkerTokens(draftNode) {
    if (!draftNode) return 0;
    let count = 0;
    const markerPattern = allMarkerTokenPattern();
    draftNode.props.editorState
      .getCurrentContent()
      .getBlockMap()
      .forEach((block) => {
        const matches = (block.getText() || "").match(markerPattern);
        if (matches?.length) count += matches.length;
      });
    return count;
  }

  async function waitForDraftMarkers(markerPrefix, expectedCount, timeoutMs = 4000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const latestNode = findDraftStateNode();
      if (latestNode && countMarkerTokens(latestNode, markerPrefix) >= expectedCount) {
        return latestNode;
      }
      await sleep(100);
    }
    return findDraftStateNode();
  }

  function replaceMarkerWithAtomic(contentState, marker, entityType, data, mutability, sampleBlock) {
    const blockKey = findMarkerBlock(contentState, marker, { exactOnly: true });
    if (!blockKey) return { ok: false, error: `Marker not found: ${marker}`, contentState };

    const markerBlock = contentState.getBlockMap().get(blockKey);
    const blockTemplate = markerBlock || sampleBlock;
    const characterList = markerBlock.getCharacterList();
    const markerCharacter = firstCharacterMetadata(markerBlock, false);
    const fallbackCharacter = firstCharacterMetadata(sampleBlock, false);
    const sampleCharacter = markerCharacter?.set ? markerCharacter : fallbackCharacter;
    if (!sampleCharacter?.set) return { ok: false, error: `No Draft.js character sample for marker: ${marker}`, contentState };
    const CharacterList = characterList.constructor;

    const withEntity = contentState.createEntity(entityType, mutability || "IMMUTABLE", data || {});
    const entityKey = withEntity.getLastCreatedEntityKey();
    const character = sampleCharacter.set("entity", entityKey);
    const atomicBlock = blockTemplate.merge({
      key: blockKey,
      type: "atomic",
      text: " ",
      characterList: CharacterList([character]),
      depth: 0
    });
    const blockMap = withEntity.getBlockMap().set(blockKey, atomicBlock);
    return { ok: true, entityKey, contentState: withEntity.set("blockMap", blockMap) };
  }

  function insertAtomicBatch(draftNode, operations) {
    if (!operations.length) return { okCount: 0, failCount: 0, errors: [] };
    const editorState = draftNode.props.editorState;
    const EditorState = editorState.constructor;
    const SelectionState = editorState.getSelection().constructor;
    let contentState = editorState.getCurrentContent();
    const sampleBlock = findDraftSampleBlock(draftNode);
    let okCount = 0;
    const errors = [];

    for (const item of operations) {
      const result = replaceMarkerWithAtomic(
        contentState,
        item.marker,
        item.op.entityType,
        item.op.data || {},
        item.op.mutability || "IMMUTABLE",
        sampleBlock
      );
      if (result.ok) {
        contentState = result.contentState;
        okCount += 1;
      } else {
        errors.push(result.error);
      }
    }

    if (okCount > 0) {
      const lastKey = contentState.getBlockMap().last().getKey();
      const selection = SelectionState.createEmpty(lastKey);
      const nextContent = contentState.set("selectionBefore", selection).set("selectionAfter", selection);
      let nextEditorState = EditorState.push(editorState, nextContent, "insert-fragment");
      nextEditorState = EditorState.moveSelectionToEnd(nextEditorState);
      draftNode.props.onChange(nextEditorState);
    }

    return { okCount, failCount: errors.length, errors };
  }

  function base64ToFile(base64, fileName, mime) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return new File([bytes], fileName, { type: mime });
  }

  function uploadFilesToEditor(filePayloads = []) {
    const onFilesAdded = findOnFilesAdded();
    if (!onFilesAdded) return { ok: false, error: "X upload handler was not reachable" };
    const files = [];
    const failures = [];
    filePayloads.forEach((file, index) => {
      const fileName = file?.fileName || `image-${index + 1}.png`;
      if (!file?.base64) {
        failures.push({ index: index + 1, fileName, error: "No image file data was provided" });
        return;
      }
      try {
        files.push(base64ToFile(file.base64, fileName, file.mime || "image/png"));
      } catch (error) {
        failures.push({ index: index + 1, fileName, error: error?.message || "Invalid image file data" });
      }
    });
    if (!files.length) return { ok: false, error: "No image file data was provided", failures };
    const editor = findEditorElement();
    editor?.focus?.();
    try {
      onFilesAdded(files);
    } catch (error) {
      return { ok: false, error: error?.message || "X upload handler failed", failures };
    }
    return {
      ok: true,
      count: files.length,
      failed: failures.length,
      failures,
      files: files.map((file) => ({ name: file.name, type: file.type, size: file.size }))
    };
  }

  function existingMediaEntities(contentState) {
    const entities = new Set();
    contentState.getBlockMap().forEach((block) => {
      if (block.getType() !== "atomic") return;
      block.findEntityRanges(
        (character) => Boolean(character.getEntity()),
        (start) => {
          const entityKey = block.getCharacterList().get(start)?.getEntity?.();
          if (!entityKey) return;
          try {
            if (contentState.getEntity(entityKey).getType() === "MEDIA") entities.add(entityKey);
          } catch {}
        }
      );
    });
    return entities;
  }

  function normalizeMediaIdValue(value) {
    if (value == null || value === "") return null;
    const text = String(value).trim();
    if (!text) return null;
    if (/^\d+$/.test(text)) return text;
    const mediaKey = text.match(/^\d+_(\d+)$/);
    if (mediaKey) return mediaKey[1];
    const trailingDigits = text.match(/(?:^|[_:])(\d{8,})$/);
    return trailingDigits ? trailingDigits[1] : null;
  }

  function mediaIdFromEntityData(data = {}, depth = 0) {
    if (data == null || depth > 5) return null;
    const primitive = normalizeMediaIdValue(data);
    if (primitive) return primitive;
    if (typeof data !== "object") return null;

    if (Array.isArray(data)) {
      for (const item of data) {
        const mediaId = mediaIdFromEntityData(item, depth + 1);
        if (mediaId) return mediaId;
      }
      return null;
    }

    const directKeys = [
      "mediaId",
      "mediaID",
      "media_id",
      "media_id_string",
      "mediaIdString",
      "mediaKey",
      "media_key",
      "id_str",
      "id",
      "rest_id"
    ];
    for (const key of directKeys) {
      if (!Object.prototype.hasOwnProperty.call(data, key)) continue;
      const mediaId = normalizeMediaIdValue(data[key]);
      if (mediaId) return mediaId;
    }

    const containerKeys = [
      "mediaItems",
      "media_items",
      "mediaItem",
      "media_item",
      "media",
      "upload",
      "uploadResult",
      "result"
    ];
    for (const key of containerKeys) {
      if (!Object.prototype.hasOwnProperty.call(data, key)) continue;
      const mediaId = mediaIdFromEntityData(data[key], depth + 1);
      if (mediaId) return mediaId;
    }

    for (const value of Object.values(data)) {
      const mediaId = mediaIdFromEntityData(value, depth + 1);
      if (mediaId) return mediaId;
    }
    return null;
  }

  function mediaEntityDataSignature(data) {
    const seen = new WeakSet();
    try {
      return JSON.stringify(data, (key, value) => {
        if (typeof value === "function") return `[function:${value.name || "anonymous"}]`;
        if (typeof value === "string") return value.length > 160 ? `${value.slice(0, 160)}...` : value;
        if (value && typeof value === "object") {
          if (seen.has(value)) return "[circular]";
          seen.add(value);
        }
        return value;
      }).slice(0, 1200);
    } catch {
      if (!data || typeof data !== "object") return String(data || "");
      try {
        return Object.keys(data).sort().join("|");
      } catch {
        return "";
      }
    }
  }

  function findNewMediaUpload(contentState, existingEntities, ignoredBlocks = new Set()) {
    let pending = null;
    let complete = null;
    contentState.getBlockMap().forEach((block, blockKey) => {
      if (complete || block.getType() !== "atomic") return;
      if (ignoredBlocks.has(blockKey)) return;
      block.findEntityRanges(
        (character) => Boolean(character.getEntity()),
        (start) => {
          if (complete) return;
          const entityKey = block.getCharacterList().get(start)?.getEntity?.();
          if (!entityKey || existingEntities.has(entityKey)) return;
          try {
            const entity = contentState.getEntity(entityKey);
            if (entity.getType() !== "MEDIA") return;
            const data = entity.getData();
            const candidate = {
              entityKey,
              blockKey,
              mediaId: mediaIdFromEntityData(data),
              dataSignature: mediaEntityDataSignature(data)
            };
            if (candidate.mediaId) complete = candidate;
            else pending ||= candidate;
          } catch {}
        }
      );
    });
    return complete || pending;
  }

  function mediaUploadInfoFromBlock(contentState, blockKey) {
    const block = contentState.getBlockMap().get(blockKey);
    if (!block || block.getType() !== "atomic") return null;
    let info = null;
    block.findEntityRanges(
      (character) => Boolean(character.getEntity()),
      (start) => {
        if (info?.mediaId) return;
        const entityKey = block.getCharacterList().get(start)?.getEntity?.();
        if (!entityKey) return;
        try {
          const entity = contentState.getEntity(entityKey);
          if (entity.getType() !== "MEDIA") return;
          const data = entity.getData();
          info = {
            entityKey,
            blockKey,
            mediaId: mediaIdFromEntityData(data),
            dataSignature: mediaEntityDataSignature(data)
          };
        } catch {}
      }
    );
    return info;
  }

  function refreshUploadMediaId(draftNode, upload) {
    if (!upload) return null;
    if (upload.mediaId) return upload.mediaId;
    const contentState = draftNode?.props?.editorState?.getCurrentContent?.();
    if (!contentState) return null;
    const blockMap = contentState.getBlockMap();
    let info = upload.blockKey && blockMap.has(upload.blockKey)
      ? mediaUploadInfoFromBlock(contentState, upload.blockKey)
      : null;
    if (!info && upload.entityKey) {
      try {
        const entity = contentState.getEntity(upload.entityKey);
        if (entity.getType() === "MEDIA") {
          const data = entity.getData();
          info = {
            entityKey: upload.entityKey,
            blockKey: upload.blockKey || null,
            mediaId: mediaIdFromEntityData(data),
            dataSignature: mediaEntityDataSignature(data)
          };
        }
      } catch {}
    }
    if (!info) return null;
    if (info.entityKey) upload.entityKey = info.entityKey;
    if (info.blockKey) upload.blockKey = info.blockKey;
    if (info.dataSignature) upload.dataSignature = info.dataSignature;
    if (info.mediaId) upload.mediaId = info.mediaId;
    return upload.mediaId || null;
  }

  async function waitForUploadMediaId(draftNode, upload, timeoutMs = 8000) {
    const deadline = Date.now() + timeoutMs;
    let latestNode = draftNode;
    while (Date.now() < deadline) {
      throwIfCancelled();
      latestNode = findDraftStateNode() || latestNode;
      if (refreshUploadMediaId(latestNode, upload)) return { draftNode: latestNode, mediaId: upload.mediaId };
      await sleep(400);
    }
    latestNode = findDraftStateNode() || latestNode;
    refreshUploadMediaId(latestNode, upload);
    return { draftNode: latestNode, mediaId: upload?.mediaId || null };
  }

  function placeSelectionAtMarker(draftNode, marker) {
    const editorState = draftNode.props.editorState;
    const SelectionState = editorState.getSelection().constructor;
    const EditorState = editorState.constructor;
    const contentState = editorState.getCurrentContent();
    const location = findMarkerLocation(contentState, marker);
    if (!location) return null;
    const selection = SelectionState.createEmpty(location.blockKey).merge({
      anchorOffset: location.offset,
      focusOffset: location.offset
    });
    draftNode.props.onChange(EditorState.forceSelection(editorState, selection));
    return location;
  }

  function uploadProgressMeta(context, retryable = false) {
    const index = Number(context?.index || 0);
    const total = Number(context?.total || 0);
    return {
      uploadActive: true,
      uploadRetryable: Boolean(retryable),
      uploadIndex: index || null,
      uploadTotal: total || null
    };
  }

  function uploadProgressLabel(context, fallback = "image") {
    const index = Number(context?.index || 0);
    const total = Number(context?.total || 0);
    return index && total ? `image ${index}/${total}` : fallback;
  }

  function requestActiveUploadRetry() {
    if (!activeUploadRetry) {
      progress("No image upload is active right now.", "warn");
      return false;
    }
    if (!activeUploadRetry.retryable) {
      progress("Retry is not available for the current image yet.", "warn", uploadProgressMeta(activeUploadRetry.context, false));
      return false;
    }
    activeUploadRetry.requested = true;
    activeUploadRetry.retryable = false;
    progress(`Retry requested for ${uploadProgressLabel(activeUploadRetry.context)}.`, "warn", uploadProgressMeta(activeUploadRetry.context, false));
    return true;
  }

  async function uploadImageAtMarker(draftNode, imageOperation, existingAtomicBlocks, context = {}) {
    throwIfCancelled();
    const onFilesAdded = findOnFilesAdded();
    if (!onFilesAdded) return { ok: false, error: "X upload handler was not reachable" };

    let markerLocation = placeSelectionAtMarker(draftNode, imageOperation.marker);
    if (!markerLocation) {
      return { ok: false, error: "Image placeholder was not found in the X editor" };
    }
    await sleep(80);

    const before = existingMediaEntities(draftNode.props.editorState.getCurrentContent());
    let preparedFile;
    try {
      preparedFile = await requestPreparedFile(imageOperation);
    } catch (error) {
      throwIfCancelled();
      return { ok: false, error: error?.message || "Prepared image data was not available", recoverable: true };
    }
    throwIfCancelled();
    let file;
    try {
      file = base64ToFile(preparedFile.base64, preparedFile.fileName, preparedFile.mime);
    } catch (error) {
      return { ok: false, error: error?.message || "Prepared image data was invalid", recoverable: true };
    }

    const timeoutMs = Math.min(
      MEDIA_UPLOAD_MAX_TIMEOUT_MS,
      MEDIA_UPLOAD_BASE_TIMEOUT_MS + Math.max(0, Number(context.total || 0) - 1) * MEDIA_UPLOAD_PER_ITEM_TIMEOUT_MS
    );
    const startedAt = Date.now();
    const deadline = startedAt + timeoutMs;
    const retryState = { requested: false, retryable: false, context };
    const canAttemptRetry = () => Date.now() + MEDIA_UPLOAD_RETRY_MIN_REMAINING_MS < deadline;
    const startUploadAttempt = async (reason = "initial") => {
      throwIfCancelled();
      draftNode = findDraftStateNode() || draftNode;
      const nextMarkerLocation = placeSelectionAtMarker(draftNode, imageOperation.marker);
      if (!nextMarkerLocation) {
        return { ok: false, error: "Image placeholder was not found in the X editor" };
      }
      markerLocation = nextMarkerLocation;
      await sleep(80);
      const handler = findOnFilesAdded() || onFilesAdded;
      try {
        handler([file]);
      } catch (error) {
        return { ok: false, error: error?.message || "X upload handler failed", recoverable: true };
      }
      return { ok: true, startedAt: Date.now(), reason };
    };
    const initialAttempt = await startUploadAttempt();
    if (!initialAttempt.ok) return initialAttempt;
    let attempt = 1;
    let attemptStartedAt = initialAttempt.startedAt;
    let nextProgressAt = Date.now() + MEDIA_UPLOAD_PROGRESS_HEARTBEAT_MS;
    let retryPromptShown = false;
    let pendingUpload = null;
    let pendingIdentitySignature = "";
    let pendingDataSignature = "";
    let pendingFirstSeenAt = 0;
    let pendingStableSince = 0;
    const completeUploadResult = (found, extra = {}) => {
      existingAtomicBlocks.add(found.blockKey);
      return {
        ok: true,
        ...found,
        ...extra,
        markerBlock: markerLocation.blockKey,
        markerOffset: markerLocation.offset,
        markerLength: markerLocation.length,
        markerExact: markerLocation.exact
      };
    };
    const rememberPendingUpload = (found, now) => {
      const identitySignature = `${found.entityKey}:${found.blockKey}`;
      if (identitySignature !== pendingIdentitySignature) {
        pendingIdentitySignature = identitySignature;
        pendingDataSignature = found.dataSignature || "";
        pendingFirstSeenAt = now;
        pendingStableSince = now;
      } else if ((found.dataSignature || "") !== pendingDataSignature) {
        pendingDataSignature = found.dataSignature || "";
        pendingStableSince = now;
      }
      pendingUpload = found;
    };
    activeUploadRetry = retryState;
    try {
      while (Date.now() < deadline) {
        throwIfCancelled();
        await sleep(350);
        const now = Date.now();
        const retryable = !pendingUpload && attempt < MEDIA_UPLOAD_MAX_ATTEMPTS && canAttemptRetry();
        const userRetryable = retryable && now - attemptStartedAt >= MEDIA_UPLOAD_USER_RETRY_AFTER_MS;
        retryState.retryable = userRetryable;
        if (!retryPromptShown && userRetryable) {
          const label = uploadProgressLabel(context);
          progress(`${label[0].toUpperCase()}${label.slice(1)} is taking longer than usual. Retry is available.`, "warn", uploadProgressMeta(context, true));
          retryPromptShown = true;
          nextProgressAt = Date.now() + MEDIA_UPLOAD_PROGRESS_HEARTBEAT_MS;
        } else if (now >= nextProgressAt) {
          const index = Number(context.index || 0);
          const total = Number(context.total || 0);
          if (index && total) {
            progress(
              pendingUpload
                ? `Uploading image ${index}/${total}... waiting for X to finish.`
                : `Uploading image ${index}/${total}...`,
              pendingUpload ? "work" : "work",
              uploadProgressMeta(context, userRetryable)
            );
          }
          nextProgressAt = Date.now() + MEDIA_UPLOAD_PROGRESS_HEARTBEAT_MS;
        }
        draftNode = findDraftStateNode() || draftNode;
        const contentState = draftNode.props.editorState.getCurrentContent();
        const found = findNewMediaUpload(contentState, before, existingAtomicBlocks);
        if (found?.mediaId) {
          retryState.retryable = false;
          return completeUploadResult(found);
        }
        if (found) {
          retryState.retryable = false;
          rememberPendingUpload(found, now);
          if (retryState.requested) {
            retryState.requested = false;
            progress(`${uploadProgressLabel(context, "This image")} reached X already; waiting to avoid a duplicate upload.`, "warn", uploadProgressMeta(context, false));
          }
          const pendingReady =
            canUsePendingMediaUpload(imageOperation) &&
            (now - pendingFirstSeenAt >= MEDIA_UPLOAD_PENDING_MAX_WAIT_MS ||
              (now - pendingFirstSeenAt >= MEDIA_UPLOAD_PENDING_READY_MS &&
                now - pendingStableSince >= MEDIA_UPLOAD_PENDING_STABLE_MS));
          if (pendingReady) {
            const index = Number(context.index || 0);
            const total = Number(context.total || 0);
            if (index && total) progress(`Image ${index}/${total} is in the editor; continuing...`, "work", uploadProgressMeta(context, false));
            return completeUploadResult(found, { mediaPending: true });
          }
        } else {
          pendingUpload = null;
          pendingIdentitySignature = "";
          pendingDataSignature = "";
          pendingFirstSeenAt = 0;
          pendingStableSince = 0;
          const shouldManualRetry = retryState.requested && retryable;
          const shouldAutoRetry = now - attemptStartedAt >= MEDIA_UPLOAD_NO_ENTITY_TIMEOUT_MS && retryable;
          if (shouldManualRetry || shouldAutoRetry) {
            retryState.requested = false;
            retryState.retryable = false;
            const label = uploadProgressLabel(context);
            progress(
              shouldManualRetry
                ? `Retrying ${label} now...`
                : `${label[0].toUpperCase()}${label.slice(1)} did not start in X. Retrying...`,
              "warn",
              uploadProgressMeta(context, false)
            );
            await sleep(MEDIA_UPLOAD_RETRY_MIN_REMAINING_MS > 0 ? Math.min(1200, MEDIA_UPLOAD_RETRY_MIN_REMAINING_MS) : 0);
            draftNode = findDraftStateNode() || draftNode;
            const retryContentState = draftNode.props.editorState.getCurrentContent();
            const retryFound = findNewMediaUpload(retryContentState, before, existingAtomicBlocks);
            if (retryFound?.mediaId) return completeUploadResult(retryFound);
            if (retryFound) {
              retryState.retryable = false;
              rememberPendingUpload(retryFound, Date.now());
              progress(`${uploadProgressLabel(context, "This image")} reached X already; waiting to avoid a duplicate upload.`, "warn", uploadProgressMeta(context, false));
              nextProgressAt = Date.now() + MEDIA_UPLOAD_PROGRESS_HEARTBEAT_MS;
              retryPromptShown = true;
              continue;
            }
            attempt += 1;
            const nextAttempt = await startUploadAttempt(shouldManualRetry ? "manual" : "auto");
            if (!nextAttempt.ok) return nextAttempt;
            attemptStartedAt = nextAttempt.startedAt;
            nextProgressAt = Date.now() + MEDIA_UPLOAD_PROGRESS_HEARTBEAT_MS;
            retryPromptShown = false;
            continue;
          }
          retryState.requested = false;
          if (now - attemptStartedAt >= MEDIA_UPLOAD_NO_ENTITY_TIMEOUT_MS) {
            return {
              ok: false,
              error: MEDIA_UPLOAD_TIMEOUT_ERROR,
              timeout: true,
              timeoutMs: MEDIA_UPLOAD_NO_ENTITY_TIMEOUT_MS,
              pendingEntity: false,
              noEntity: true,
              attempts: attempt
            };
          }
        }
      }

      return { ok: false, error: MEDIA_UPLOAD_TIMEOUT_ERROR, timeout: true, timeoutMs, pendingEntity: Boolean(pendingUpload), attempts: attempt };
    } finally {
      if (activeUploadRetry === retryState) activeUploadRetry = null;
    }
  }

  function replaceMarkerText(draftNode, marker, text) {
    const editorState = draftNode.props.editorState;
    const EditorState = editorState.constructor;
    const SelectionState = editorState.getSelection().constructor;
    const contentState = editorState.getCurrentContent();
    const blockMap = contentState.getBlockMap();
    const location = findMarkerLocation(contentState, marker);
    if (!location) return false;
    const blockKey = location.blockKey;
    const block = blockMap.get(blockKey);
    const replacement = String(text || "");
    const currentText = block.getText() || "";
    const nextText = location.exact
      ? replacement
      : `${currentText.slice(0, location.offset)}${replacement}${currentText.slice(location.offset + location.length)}`;
    if (!nextText.trim()) return deleteBlockByKey(draftNode, blockKey).ok;
    const characterFactory = block.getCharacterList().get(0)?.constructor;
    const character = characterFactory ? characterFactory.create({}) : null;
    const characterList = block.getCharacterList().clear().concat(Array.from({ length: nextText.length }, () => character));
    const nextBlock = block.merge({ text: nextText, characterList });
    const selection = SelectionState.createEmpty(blockKey);
    const nextContent = contentState
      .set("blockMap", blockMap.set(blockKey, nextBlock))
      .set("selectionBefore", selection)
      .set("selectionAfter", selection);
    draftNode.props.onChange(EditorState.push(editorState, nextContent, "change-block-data"));
    return true;
  }

  function markerTokenPattern(markerPrefix) {
    const prefix = String(markerPrefix || "__XPOSTER_").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`${prefix}[A-Z]+_\\d+__`, "g");
  }

  function allMarkerTokenPattern() {
    return /__XPOSTER_[A-Za-z0-9]+_[A-Z]+_\d+__/g;
  }

  function relocateImages(draftNode, uploads, protectedAtomicBlocks) {
    if (!uploads.length) return { moved: 0, missing: 0 };
    const editorState = draftNode.props.editorState;
    const EditorState = editorState.constructor;
    const SelectionState = editorState.getSelection().constructor;
    const contentState = editorState.getCurrentContent();
    const blockMap = contentState.getBlockMap();
    const entityToBlock = new Map();
    const mediaBlocks = [];

    for (const upload of uploads) {
      if (upload.markerBlock && blockMap.has(upload.markerBlock)) continue;
      const location = findMarkerLocation(contentState, upload.marker);
      if (location) {
        upload.markerBlock = location.blockKey;
        upload.markerOffset = location.offset;
        upload.markerLength = location.length;
        upload.markerExact = location.exact;
      }
    }

    blockMap.forEach((block, blockKey) => {
      if (block.getType() === "atomic") {
        let firstEntity = null;
        block.findEntityRanges(
          (character) => Boolean(character.getEntity()),
          (start) => {
            const entityKey = block.getCharacterList().get(start)?.getEntity?.();
            if (entityKey) {
              firstEntity ||= entityKey;
              entityToBlock.set(entityKey, blockKey);
            }
          }
        );
        if (!protectedAtomicBlocks.has(blockKey) && firstEntity) {
          try {
            if (contentState.getEntity(firstEntity).getType() === "MEDIA") {
              mediaBlocks.push({ blockKey, entityKey: firstEntity });
            }
          } catch {}
        }
      }
    });

    const moves = new Map();
    let missing = 0;
    let fallbackIndex = 0;

    for (const upload of uploads) {
      if (!upload.markerBlock || !blockMap.has(upload.markerBlock)) {
        missing += 1;
        continue;
      }
      let imageBlock = upload.blockKey && blockMap.has(upload.blockKey) ? upload.blockKey : null;
      if (!imageBlock && upload.entityKey) imageBlock = entityToBlock.get(upload.entityKey) || null;
      if (!imageBlock) {
        while (fallbackIndex < mediaBlocks.length && moves.has(mediaBlocks[fallbackIndex].blockKey)) {
          fallbackIndex += 1;
        }
        imageBlock = mediaBlocks[fallbackIndex]?.blockKey || null;
        fallbackIndex += 1;
      }
      if (!imageBlock) {
        missing += 1;
        continue;
      }
      if (imageBlock !== upload.markerBlock) {
        moves.set(upload.markerBlock, {
          imageBlock,
          markerExact: upload.markerExact !== false
        });
      }
    }

    if (!moves.size) return { moved: 0, missing };
    const destinationBlocks = new Set(Array.from(moves.values()).map((move) => move.imageBlock));
    const orderedKeys = [];
    blockMap.forEach((block, key) => {
      if (moves.has(key)) {
        const move = moves.get(key);
        if (move.markerExact) orderedKeys.push(move.imageBlock);
        else {
          orderedKeys.push(move.imageBlock);
          orderedKeys.push(key);
        }
      } else if (!destinationBlocks.has(key)) orderedKeys.push(key);
    });

    let nextBlockMap = blockMap.constructor();
    for (const key of orderedKeys) nextBlockMap = nextBlockMap.set(key, blockMap.get(key));
    const selection = SelectionState.createEmpty(orderedKeys[orderedKeys.length - 1]);
    const nextContent = contentState
      .set("blockMap", nextBlockMap)
      .set("selectionBefore", selection)
      .set("selectionAfter", selection);
    let nextEditorState = EditorState.push(editorState, nextContent, "remove-range");
    nextEditorState = EditorState.moveSelectionToEnd(nextEditorState);
    draftNode.props.onChange(nextEditorState);
    return { moved: moves.size, missing };
  }

  function cleanupMarkers(draftNode, markerPrefix) {
    const resolvedPrefix = String(markerPrefix || "__XPOSTER_");
    const editorState = draftNode.props.editorState;
    const EditorState = editorState.constructor;
    const SelectionState = editorState.getSelection().constructor;
    const contentState = editorState.getCurrentContent();
    let blockMap = contentState.getBlockMap();
    const toDelete = [];
    const replacements = [];
    const markerPattern = markerTokenPattern(resolvedPrefix);
    blockMap.forEach((block, key) => {
      if (block.getType() === "atomic") return;
      const text = block.getText() || "";
      if (!text.includes(resolvedPrefix) && !text.includes("__XPOSTER_")) return;
      const cleaned = text
        .replace(markerPattern, "")
        .replace(allMarkerTokenPattern(), "")
        .replace(/\s{2,}/g, " ")
        .trim();
      if (!cleaned) {
        toDelete.push(key);
      } else if (cleaned !== text) {
        replacements.push({ key, text: cleaned });
      }
    });
    if (!toDelete.length && !replacements.length) return 0;
    for (const replacement of replacements) {
      const block = blockMap.get(replacement.key);
      if (!block) continue;
      const characterFactory = block.getCharacterList().get(0)?.constructor;
      const character = characterFactory ? characterFactory.create({}) : null;
      const characterList = block.getCharacterList().clear().concat(
        Array.from({ length: replacement.text.length }, () => character)
      );
      blockMap = blockMap.set(replacement.key, block.merge({ text: replacement.text, characterList }));
    }
    for (const key of toDelete) blockMap = blockMap.delete(key);
    const lastKey = blockMap.last()?.getKey?.();
    const selection = lastKey ? SelectionState.createEmpty(lastKey) : editorState.getSelection();
    const nextContent = contentState
      .set("blockMap", blockMap)
      .set("selectionBefore", selection)
      .set("selectionAfter", selection);
    let nextEditorState = EditorState.push(editorState, nextContent, "remove-range");
    nextEditorState = EditorState.moveSelectionToEnd(nextEditorState);
    draftNode.props.onChange(nextEditorState);
    return toDelete.length + replacements.length;
  }

  async function cleanupMarkersUntilGone(draftNode, markerPrefix, timeoutMs = 8000, stableMs = 1200) {
    const deadline = Date.now() + timeoutMs;
    let cleaned = 0;
    let remaining = Number.POSITIVE_INFINITY;
    let latestNode = draftNode;
    let zeroSince = 0;

    while (Date.now() < deadline) {
      latestNode = findDraftStateNode() || latestNode;
      cleaned += cleanupMarkers(latestNode, markerPrefix);
      await sleep(120);
      latestNode = findDraftStateNode() || latestNode;
      remaining = countAnyMarkerTokens(latestNode);
      if (!remaining) {
        if (!zeroSince) zeroSince = Date.now();
        if (Date.now() - zeroSince >= stableMs) return { draftNode: latestNode, cleaned, remaining: 0 };
      } else {
        zeroSince = 0;
      }
      await sleep(180);
    }

    latestNode = findDraftStateNode() || latestNode;
    cleaned += cleanupMarkers(latestNode, markerPrefix);
    await sleep(120);
    latestNode = findDraftStateNode() || latestNode;
    remaining = countAnyMarkerTokens(latestNode);
    return { draftNode: latestNode, cleaned, remaining };
  }

  async function settleUploadedImageAtMarker(draftNode, upload, protectedAtomicBlocks) {
    if (!upload || upload.coverOnly) {
      return { draftNode, moved: 0, missing: 0, markerCleaned: 0 };
    }
    const relocateResult = relocateImages(draftNode, [upload], protectedAtomicBlocks);
    if (relocateResult.moved || relocateResult.missing) {
      await sleep(180);
      draftNode = findDraftStateNode() || draftNode;
    }
    const markerCleaned = relocateResult.missing ? 0 : Number(replaceMarkerText(draftNode, upload.marker, ""));
    if (markerCleaned) {
      await sleep(120);
      draftNode = findDraftStateNode() || draftNode;
    }
    return {
      draftNode,
      moved: relocateResult.moved,
      missing: relocateResult.missing,
      markerCleaned
    };
  }

  function kickRender(draftNode) {
    try {
      const EditorState = draftNode.props.editorState.constructor;
      draftNode.props.onChange(EditorState.moveSelectionToEnd(draftNode.props.editorState));
    } catch (error) {
      console.warn(LOG, "render kick failed", error);
    }
  }

  const GRAPHQL_FEATURES = {
    profile_label_improvements_pcf_label_in_post_enabled: true,
    responsive_web_profile_redirect_enabled: false,
    rweb_tipjar_consumption_enabled: false,
    verified_phone_label_enabled: false,
    responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
    responsive_web_graphql_timeline_navigation_enabled: true
  };

  const X_BEARER_TOKEN =
    "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA";

  function articleIdFromUrl() {
    return location.href.match(/\/articles\/edit\/(\d+)/)?.[1] || null;
  }

  function csrfToken() {
    return document.cookie.match(/(?:^|;\s*)ct0=([^;]+)/)?.[1] || "";
  }

  async function xGraphql(queryId, operationName, body) {
    const response = await fetch(`https://x.com/i/api/graphql/${queryId}/${operationName}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${X_BEARER_TOKEN}`,
        "x-csrf-token": csrfToken(),
        "x-twitter-active-user": "yes",
        "x-twitter-auth-type": "OAuth2Session"
      },
      body: JSON.stringify(body)
    });
    let text = "";
    try {
      text = await response.text();
    } catch {}
    return { ok: response.ok, status: response.status, body: text.slice(0, 240) };
  }

  function updateTitleGraphql(articleId, title) {
    return xGraphql("x75E2ABzm8_mGTg1bz8hcA", "ArticleEntityUpdateTitle", {
      variables: { articleEntityId: articleId, title: String(title) },
      features: GRAPHQL_FEATURES,
      queryId: "x75E2ABzm8_mGTg1bz8hcA"
    });
  }

  function updateCoverGraphql(articleId, mediaId, category = "DraftTweetImage") {
    return xGraphql("Es8InPh7mEkK9PxclxFAVQ", "ArticleEntityUpdateCoverMedia", {
      variables: {
        articleEntityId: articleId,
        coverMedia: { media_id: String(mediaId), media_category: category }
      },
      features: GRAPHQL_FEATURES,
      queryId: "Es8InPh7mEkK9PxclxFAVQ"
    });
  }

  function deleteBlockByKey(draftNode, blockKey) {
    if (!blockKey) return { ok: false, error: "Missing block key" };
    const editorState = draftNode.props.editorState;
    const EditorState = editorState.constructor;
    const SelectionState = editorState.getSelection().constructor;
    const contentState = editorState.getCurrentContent();
    const blockMap = contentState.getBlockMap();
    if (!blockMap.has(blockKey)) return { ok: false, error: "Block not found" };
    const nextBlockMap = blockMap.delete(blockKey);
    const lastKey = nextBlockMap.last()?.getKey?.();
    const selection = lastKey ? SelectionState.createEmpty(lastKey) : editorState.getSelection();
    const nextContent = contentState
      .set("blockMap", nextBlockMap)
      .set("selectionBefore", selection)
      .set("selectionAfter", selection);
    let nextEditorState = EditorState.push(editorState, nextContent, "remove-range");
    nextEditorState = EditorState.moveSelectionToEnd(nextEditorState);
    draftNode.props.onChange(nextEditorState);
    return { ok: true };
  }

  async function setTitleViaUi(title) {
    if (!title) return { ok: true, skipped: true };
    const editor = findEditorElement();
    const candidates = Array.from(document.querySelectorAll("input[type='text'], textarea, [contenteditable='true']")).filter(
      (element) => element !== editor && isVisible(element)
    );
    const titleWords = ["title", "标题", "add title", "输入标题"];
    let best = null;
    let score = -1;
    for (const element of candidates) {
      const haystack = [
        element.getAttribute("aria-label"),
        element.getAttribute("placeholder"),
        element.getAttribute("data-testid")
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const rect = element.getBoundingClientRect();
      let current = 0;
      if (titleWords.some((word) => haystack.includes(word))) current += 10;
      if (rect.top < 420) current += 3;
      if (rect.width > 240) current += 2;
      if (current > score) {
        score = current;
        best = element;
      }
    }
    if (!best || score <= 0) return { ok: false, error: "Title field not found" };
    if (best instanceof HTMLInputElement || best instanceof HTMLTextAreaElement) {
      const proto = best instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(best, String(title));
      best.dispatchEvent(new Event("input", { bubbles: true }));
      best.dispatchEvent(new Event("change", { bubbles: true }));
    } else {
      best.focus();
      await sleep(80);
      document.execCommand("selectAll", false);
      document.execCommand("insertText", false, String(title));
      best.dispatchEvent(new Event("input", { bubbles: true }));
      best.dispatchEvent(new Event("change", { bubbles: true }));
    }
    return { ok: true };
  }

  async function applyTitleMetadata(title, articleId, summary) {
    if (!title) return false;
    throwIfCancelled();
    progress("Setting title...");
    summary.title.articleId = articleId || summary.title.articleId || null;
    const result = await setTitleViaUi(title);
    summary.title.ui = result;
    if (!result.ok) console.warn(LOG, "title failed", result.error);
    if (articleId && !summary.title.graphql?.ok) {
      const graphResult = await updateTitleGraphql(articleId, title).catch((error) => ({
        ok: false,
        error: error?.message || String(error)
      }));
      summary.title.graphql = graphResult;
      if (!graphResult.ok) console.warn(LOG, "title GraphQL failed", graphResult);
    } else if (!articleId) {
      summary.title.graphql = { ok: false, skipped: true, reason: "No article id in URL" };
    }
    return Boolean(result.ok || summary.title.graphql?.ok);
  }

  async function applyTitleGraphqlMetadata(title, articleId, summary) {
    if (!title || !articleId || summary.title.graphql?.ok) return false;
    throwIfCancelled();
    summary.title.articleId = articleId;
    const graphResult = await updateTitleGraphql(articleId, title).catch((error) => ({
      ok: false,
      error: error?.message || String(error)
    }));
    summary.title.graphql = graphResult;
    if (!graphResult.ok) console.warn(LOG, "title GraphQL failed", graphResult);
    return Boolean(graphResult.ok);
  }

  function uploadMatchesCover(upload, coverSource) {
    return Boolean(upload?.mediaId && coverSource && imageSourcesMatch(upload.source, coverSource));
  }

  function imageOperationKind(operation) {
    if (operation?.op?.coverOnly) return "cover";
    if (String(operation?.marker || "").includes("_TABLE_")) return "table";
    return "image";
  }

  function canUsePendingMediaUpload(operation) {
    return !operation?.op?.coverOnly;
  }

  async function applyCoverMetadata(coverSource, articleId, upload, summary) {
    if (!uploadMatchesCover(upload, coverSource) || summary.cover.graphql || summary.cover.skippedReason) return false;
    summary.cover.matchedUpload = true;
    summary.cover.mediaIdSuffix = upload.mediaId ? upload.mediaId.slice(-8) : null;
    if (!articleId) {
      summary.cover.skippedReason = "No article id in URL";
      console.warn(LOG, "cover update skipped: no article id");
      return false;
    }
    throwIfCancelled();
    progress("Setting cover...");
    const result = await updateCoverGraphql(articleId, upload.mediaId).catch((error) => ({
      ok: false,
      error: error?.message || String(error)
    }));
    summary.cover.graphql = result;
    if (!result.ok) console.warn(LOG, "cover update failed", result);
    return Boolean(result.ok);
  }

  function isVisible(element) {
    const rect = element.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) return false;
    const style = getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0";
  }

  async function runFlow(payload) {
    cancelRequested = false;
    let draftNode = findDraftStateNode();
    if (!draftNode) throw new Error("X Draft.js editor was not reachable");
    let articleId = articleIdFromUrl();
    let markersWritten = false;
    const summary = {
      atomicOk: 0,
      atomicFail: 0,
      imgOk: 0,
      imgFail: 0,
      imgPending: 0,
      imageErrors: [],
      markersCleaned: 0,
      markersRemaining: 0,
      relocatedImages: 0,
      title: {
        requested: Boolean(payload.title),
        value: payload.title || null,
        articleId: articleId || null,
        ui: null,
        graphql: null
      },
      cover: {
        requested: Boolean(payload.cover),
        source: payload.cover || null,
        matchedUpload: false,
        mediaIdSuffix: null,
        graphql: null,
        bodyBlockDeleted: null,
        skippedReason: null
      }
    };

    try {
      await applyTitleMetadata(payload.title, articleId, summary);
      draftNode = findDraftStateNode() || draftNode;

      throwIfCancelled();
      progress("Pasting structured Markdown...");
      draftNode = await ensureDraftCharacterSample(draftNode);
      throwIfCancelled();
      const writeResult = writeDraftBlocks(draftNode, payload.blocks);
      if (!writeResult.ok) {
        console.warn(LOG, "structured block write failed; falling back to paste", writeResult.error);
        pasteHtml(payload.html, payload.plain);
      }
      draftNode = await waitForDraftMarkers(payload.markerPrefix, (payload.plan || []).length);
      if (!draftNode) throw new Error("X Draft.js editor was not reachable after writing Markdown");
      markersWritten = true;
      await sleep(150);
      throwIfCancelled();
      articleId ||= articleIdFromUrl();
      if (articleId) {
        await applyTitleGraphqlMetadata(payload.title, articleId, summary);
      }
      if (payload.title && !summary.title.ui?.ok) {
        await applyTitleMetadata(payload.title, articleId, summary);
        draftNode = findDraftStateNode() || draftNode;
      }

      const atomicOps = (payload.plan || []).filter((item) => item.op.type === "atomic");
      const imageOps = (payload.plan || []).filter((item) => item.op.type === "image");

      if (atomicOps.length) {
        throwIfCancelled();
        progress(`Inserting ${atomicOps.length} special block(s)...`);
        draftNode = findDraftStateNode() || draftNode;
        const result = insertAtomicBatch(draftNode, atomicOps);
        summary.atomicOk = result.okCount;
        summary.atomicFail = result.failCount;
        if (result.errors?.length) console.warn(LOG, "atomic failures", result.errors);
        await sleep(350);
      }

      draftNode = findDraftStateNode() || draftNode;
      const protectedAtomicBlocks = new Set();
      draftNode.props.editorState
        .getCurrentContent()
        .getBlockMap()
        .forEach((block, key) => {
          if (block.getType() === "atomic") protectedAtomicBlocks.add(key);
        });

      const uploads = [];
      let coverUpload = null;
      for (let index = 0; index < imageOps.length; index += 1) {
        throwIfCancelled();
        draftNode = findDraftStateNode() || draftNode;
        const op = imageOps[index];
        progress(`Uploading image ${index + 1}/${imageOps.length}...`);
        const result = await uploadImageAtMarker(draftNode, op, protectedAtomicBlocks, {
          index: index + 1,
          total: imageOps.length
        });
        if (result.ok) {
          summary.imgOk += 1;
          if (result.mediaPending) summary.imgPending += 1;
          uploads.push({
            marker: op.marker,
            blockKey: result.blockKey,
            entityKey: result.entityKey,
            markerBlock: result.markerBlock,
            markerOffset: result.markerOffset,
            markerLength: result.markerLength,
            markerExact: result.markerExact,
            mediaId: result.mediaId,
            source: op.op.source,
            coverOnly: Boolean(op.op.coverOnly),
            settled: Boolean(op.op.coverOnly)
          });
          const upload = uploads[uploads.length - 1];
          if (!upload.coverOnly) {
            progress(`Image ${index + 1}/${imageOps.length} is in the editor; continuing...`);
            const settleResult = await settleUploadedImageAtMarker(draftNode, upload, protectedAtomicBlocks);
            draftNode = settleResult.draftNode;
            summary.relocatedImages += settleResult.moved;
            summary.markersCleaned += settleResult.markerCleaned;
            upload.settled = !settleResult.missing;
          }
          if (payload.cover && imageSourcesMatch(upload.source, payload.cover) && !upload.mediaId && !summary.cover.graphql && !summary.cover.skippedReason) {
            const refreshed = await waitForUploadMediaId(draftNode, upload);
            draftNode = refreshed.draftNode;
          }
          if (upload.coverOnly && !coverUpload) coverUpload = upload;
          if (uploadMatchesCover(upload, payload.cover) && !summary.cover.graphql && !summary.cover.skippedReason) {
            coverUpload = upload;
            await applyCoverMetadata(payload.cover, articleId, upload, summary);
          }
        } else {
          summary.imgFail += 1;
          summary.imageErrors.push({
            kind: imageOperationKind(op),
            index: index + 1,
            marker: op.marker,
            source: op.op.source || null,
            fileName: op.op.file?.fileName || null,
            error: result.error || "Image upload failed"
          });
          replaceMarkerText(draftNode, op.marker, op.op.fallbackText || (op.op.coverOnly ? "" : "[image upload failed]"));
          console.warn(LOG, "image failed", result.error);
        }
        draftNode = findDraftStateNode() || draftNode;
      }

      const unsettledUploads = uploads.filter((upload) => !upload.coverOnly && !upload.settled);
      if (unsettledUploads.length) {
        throwIfCancelled();
        progress("Reordering uploaded media...");
        await sleep(900);
        const result = relocateImages(draftNode, unsettledUploads, protectedAtomicBlocks);
        summary.relocatedImages += result.moved;
        await sleep(400);
      }

      if (payload.cover) {
        throwIfCancelled();
        if (!summary.cover.graphql && !summary.cover.skippedReason && !articleId) {
          summary.cover.skippedReason = "No article id in URL";
          console.warn(LOG, "cover update skipped: no article id");
        } else if (!summary.cover.graphql && !summary.cover.skippedReason) {
          summary.cover.skippedReason = "Cover source was not uploaded; it may have stayed as a Markdown link";
          console.info(LOG, "cover skipped because the source was not uploaded", payload.cover);
        }
        if (coverUpload?.coverOnly && coverUpload.blockKey) {
          await sleep(600);
          draftNode = findDraftStateNode() || draftNode;
          const deleteResult = deleteBlockByKey(draftNode, coverUpload.blockKey);
          summary.cover.bodyBlockDeleted = deleteResult;
          if (!deleteResult.ok) console.warn(LOG, "cover block cleanup failed", deleteResult);
        }
      }

      const pendingMediaUploads = uploads.filter((upload) => !upload.coverOnly && !upload.mediaId);
      if (pendingMediaUploads.length) {
        throwIfCancelled();
        progress(`Waiting for ${pendingMediaUploads.length} media upload(s) to settle...`);
        for (const upload of pendingMediaUploads) {
          const refreshed = await waitForUploadMediaId(draftNode, upload, 12000);
          draftNode = refreshed.draftNode;
        }
      }

      progress("Cleaning up import markers...");
      draftNode = findDraftStateNode() || draftNode;
      const cleanupResult = await cleanupMarkersUntilGone(draftNode, payload.markerPrefix);
      draftNode = cleanupResult.draftNode;
      summary.markersCleaned += cleanupResult.cleaned;
      summary.markersRemaining = cleanupResult.remaining;
      if (cleanupResult.remaining) {
        throw new Error(`${cleanupResult.remaining} xPoster marker token(s) remain in the X editor. Do not publish; run the import cleanup again or remove them manually.`);
      }
      kickRender(draftNode);
      await sleep(250);
      post("done", { summary });
    } catch (error) {
      if (markersWritten) {
        try {
          progress("Cleaning up import markers...", error?.cancelled ? "warn" : "work");
          draftNode = findDraftStateNode() || draftNode;
          const cleanupResult = await cleanupMarkersUntilGone(draftNode, payload.markerPrefix);
          draftNode = cleanupResult.draftNode;
          summary.markersCleaned += cleanupResult.cleaned;
          summary.markersRemaining = cleanupResult.remaining;
          kickRender(draftNode);
        } catch (cleanupError) {
          console.warn(LOG, "marker cleanup after interrupted import failed", cleanupError);
        }
      }
      error.summary = summary;
      throw error;
    }
  }

  window.addEventListener("message", (event) => {
    if (event.source !== window || event.data?.source !== CHANNEL_TO_MAIN) return;
    if (event.data.kind === "ready?") {
      post("ready");
      return;
    }
    if (event.data.kind === "run") {
      runFlow(event.data.payload).catch((error) => {
        console.error(LOG, error);
        if (error?.cancelled) {
          post("cancelled", { reason: error.message || "Writing stopped by user.", summary: error?.summary || null });
          return;
        }
        post("error", { error: error?.message || String(error), stack: error?.stack || null, summary: error?.summary || null });
      });
      return;
    }
    if (event.data.kind === "cancel") {
      cancelRequested = true;
      progress("Writing stopped by user.", "warn");
      return;
    }
    if (event.data.kind === "retry-upload") {
      requestActiveUploadRetry();
      return;
    }
    if (event.data.kind === "upload-files") {
      try {
        const result = uploadFilesToEditor(event.data.files || []);
        if (result.ok) post("upload-files-done", { requestId: event.data.requestId, summary: result });
        else post("upload-files-error", { requestId: event.data.requestId, error: result.error, failures: result.failures || [], summary: result });
      } catch (error) {
        console.error(LOG, error);
        post("upload-files-error", {
          requestId: event.data.requestId,
          error: error?.message || String(error),
          stack: error?.stack || null
        });
      }
      return;
    }
    if (event.data.kind === "diagnostics") {
      const editorElement = findEditorElement();
      const draftNode = findDraftStateNode();
      const onFilesAdded = findOnFilesAdded();
      post("diagnostics", {
        payload: {
          ok: true,
          mainWorld: true,
          hasEditorElement: Boolean(editorElement),
          hasDraftStateNode: Boolean(draftNode),
          hasOnFilesAdded: Boolean(onFilesAdded),
          articleId: articleIdFromUrl(),
          editorBounds: editorElement
            ? {
                width: Math.round(editorElement.getBoundingClientRect().width),
                height: Math.round(editorElement.getBoundingClientRect().height)
              }
            : null
        }
      });
    }
  });

  console.log(LOG, "ready");
  post("ready");
})();
