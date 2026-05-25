(() => {
  const LOG = "[xPoster MAIN]";
  const CHANNEL_TO_MAIN = "xposter";
  const CHANNEL_FROM_MAIN = "xposter-main";
  const EDITOR_SELECTOR =
    "[data-contents='true'] [contenteditable='true'], [contenteditable='true'][role='textbox'], [contenteditable='true'].public-DraftEditor-content, [contenteditable='true']";
  const MEDIA_UPLOAD_BASE_TIMEOUT_MS = 90000;
  const MEDIA_UPLOAD_PER_ITEM_TIMEOUT_MS = 2500;
  const MEDIA_UPLOAD_MAX_TIMEOUT_MS = 150000;
  const MEDIA_UPLOAD_TIMEOUT_ERROR =
    "X media upload took too long. X may be throttling this draft, especially with many images. Wait a moment, then write again or split the article.";

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  let cancelRequested = false;

  function post(kind, payload = {}) {
    window.postMessage({ source: CHANNEL_FROM_MAIN, kind, ...payload }, "*");
  }

  function progress(text, level = "work") {
    post("progress", { text, level });
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

  function findMarkerBlock(contentState, marker) {
    let blockKey = null;
    contentState.getBlockMap().forEach((block, key) => {
      if (block.getType() !== "atomic" && (block.getText() || "").trim() === marker) {
        blockKey = key;
        return false;
      }
      return true;
    });
    return blockKey;
  }

  function countBlocksStartingWith(draftNode, prefix) {
    if (!draftNode || !prefix) return 0;
    let count = 0;
    draftNode.props.editorState
      .getCurrentContent()
      .getBlockMap()
      .forEach((block) => {
        if ((block.getText() || "").trim().startsWith(prefix)) count += 1;
      });
    return count;
  }

  async function waitForDraftMarkers(markerPrefix, expectedCount, timeoutMs = 4000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const latestNode = findDraftStateNode();
      if (latestNode && countBlocksStartingWith(latestNode, markerPrefix) >= expectedCount) {
        return latestNode;
      }
      await sleep(100);
    }
    return findDraftStateNode();
  }

  function replaceMarkerWithAtomic(contentState, marker, entityType, data, mutability, sampleBlock) {
    const blockKey = findMarkerBlock(contentState, marker);
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
    const files = filePayloads
      .filter((file) => file?.base64)
      .map((file, index) =>
        base64ToFile(
          file.base64,
          file.fileName || `image-${index + 1}.png`,
          file.mime || "image/png"
        )
      );
    if (!files.length) return { ok: false, error: "No image file data was provided" };
    const editor = findEditorElement();
    editor?.focus?.();
    onFilesAdded(files);
    return {
      ok: true,
      count: files.length,
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

  function placeSelectionAtMarker(draftNode, marker) {
    const editorState = draftNode.props.editorState;
    const SelectionState = editorState.getSelection().constructor;
    const EditorState = editorState.constructor;
    const contentState = editorState.getCurrentContent();
    const blockKey = findMarkerBlock(contentState, marker);
    if (!blockKey) return false;
    const selection = SelectionState.createEmpty(blockKey).merge({ anchorOffset: 0, focusOffset: 0 });
    draftNode.props.onChange(EditorState.forceSelection(editorState, selection));
    return true;
  }

  async function uploadImageAtMarker(draftNode, imageOperation, existingAtomicBlocks, context = {}) {
    throwIfCancelled();
    const onFilesAdded = findOnFilesAdded();
    if (!onFilesAdded) return { ok: false, error: "X upload handler was not reachable" };

    if (!placeSelectionAtMarker(draftNode, imageOperation.marker)) {
      return { ok: false, error: "Image placeholder was not found in the X editor" };
    }
    await sleep(80);

    const before = existingMediaEntities(draftNode.props.editorState.getCurrentContent());
    const preparedFile = await requestPreparedFile(imageOperation);
    throwIfCancelled();
    const file = base64ToFile(preparedFile.base64, preparedFile.fileName, preparedFile.mime);

    onFilesAdded([file]);
    const timeoutMs = Math.min(
      MEDIA_UPLOAD_MAX_TIMEOUT_MS,
      MEDIA_UPLOAD_BASE_TIMEOUT_MS + Math.max(0, Number(context.total || 0) - 1) * MEDIA_UPLOAD_PER_ITEM_TIMEOUT_MS
    );
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      throwIfCancelled();
      await sleep(350);
      draftNode = findDraftStateNode() || draftNode;
      const contentState = draftNode.props.editorState.getCurrentContent();
      let found = null;
      contentState.getBlockMap().forEach((block, blockKey) => {
        if (found || block.getType() !== "atomic") return;
        block.findEntityRanges(
          (character) => Boolean(character.getEntity()),
          (start) => {
            const entityKey = block.getCharacterList().get(start)?.getEntity?.();
            if (!entityKey || before.has(entityKey)) return;
            try {
              const entity = contentState.getEntity(entityKey);
              if (entity.getType() !== "MEDIA") return;
              const data = entity.getData();
              const item = data?.mediaItems?.[0] || data?.media_items?.[0];
              const mediaId = item?.mediaId || item?.media_id || null;
              found = { entityKey, blockKey, mediaId };
            } catch {}
          }
        );
      });
      if (found) {
        existingAtomicBlocks.add(found.blockKey);
        return { ok: true, ...found };
      }
    }

    return { ok: false, error: MEDIA_UPLOAD_TIMEOUT_ERROR, timeout: true, timeoutMs };
  }

  function replaceMarkerText(draftNode, marker, text) {
    const editorState = draftNode.props.editorState;
    const EditorState = editorState.constructor;
    const SelectionState = editorState.getSelection().constructor;
    const contentState = editorState.getCurrentContent();
    const blockMap = contentState.getBlockMap();
    const blockKey = findMarkerBlock(contentState, marker);
    if (!blockKey) return false;
    const block = blockMap.get(blockKey);
    const characterFactory = block.getCharacterList().get(0)?.constructor;
    const character = characterFactory ? characterFactory.create({}) : null;
    const characterList = block.getCharacterList().clear().concat(Array.from({ length: text.length }, () => character));
    const nextBlock = block.merge({ text, characterList });
    const selection = SelectionState.createEmpty(blockKey);
    const nextContent = contentState
      .set("blockMap", blockMap.set(blockKey, nextBlock))
      .set("selectionBefore", selection)
      .set("selectionAfter", selection);
    draftNode.props.onChange(EditorState.push(editorState, nextContent, "change-block-data"));
    return true;
  }

  function relocateImages(draftNode, uploads, protectedAtomicBlocks) {
    if (!uploads.length) return { moved: 0, missing: 0 };
    const editorState = draftNode.props.editorState;
    const EditorState = editorState.constructor;
    const SelectionState = editorState.getSelection().constructor;
    const contentState = editorState.getCurrentContent();
    const blockMap = contentState.getBlockMap();
    const markerEntries = new Map(uploads.map((upload) => [upload.marker, upload]));
    const entityToBlock = new Map();
    const mediaBlocks = [];

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
      } else {
        const marker = (block.getText() || "").trim();
        if (markerEntries.has(marker)) markerEntries.get(marker).markerBlock = blockKey;
      }
    });

    const moves = new Map();
    let missing = 0;
    let fallbackIndex = 0;

    for (const upload of uploads) {
      if (!upload.markerBlock) {
        missing += 1;
        continue;
      }
      let imageBlock = upload.entityKey ? entityToBlock.get(upload.entityKey) : null;
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
      if (imageBlock !== upload.markerBlock) moves.set(upload.markerBlock, imageBlock);
    }

    if (!moves.size) return { moved: 0, missing };
    const destinationBlocks = new Set(moves.values());
    const orderedKeys = [];
    blockMap.forEach((block, key) => {
      if (moves.has(key)) orderedKeys.push(moves.get(key));
      else if (!destinationBlocks.has(key)) orderedKeys.push(key);
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
    const editorState = draftNode.props.editorState;
    const EditorState = editorState.constructor;
    const SelectionState = editorState.getSelection().constructor;
    const contentState = editorState.getCurrentContent();
    let blockMap = contentState.getBlockMap();
    const toDelete = [];
    blockMap.forEach((block, key) => {
      if (block.getType() !== "atomic" && (block.getText() || "").trim().startsWith(markerPrefix)) {
        toDelete.push(key);
      }
    });
    if (!toDelete.length) return 0;
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
    return toDelete.length;
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
    const articleId = articleIdFromUrl();
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
    await sleep(150);
    throwIfCancelled();

    const summary = {
      atomicOk: 0,
      atomicFail: 0,
      imgOk: 0,
      imgFail: 0,
      imageErrors: [],
      markersCleaned: 0,
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
        uploads.push({
          marker: op.marker,
          blockKey: result.blockKey,
          entityKey: result.entityKey,
          mediaId: result.mediaId,
          source: op.op.source,
          coverOnly: Boolean(op.op.coverOnly)
        });
      } else {
        summary.imgFail += 1;
        summary.imageErrors.push({
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

    if (uploads.length) {
      throwIfCancelled();
      progress("Reordering uploaded media...");
      await sleep(900);
      const result = relocateImages(draftNode, uploads.filter((upload) => !upload.coverOnly), protectedAtomicBlocks);
      summary.relocatedImages = result.moved;
      await sleep(400);
    }

    if (payload.title) {
      throwIfCancelled();
      progress("Setting title...");
      const result = await setTitleViaUi(payload.title);
      summary.title.ui = result;
      if (!result.ok) console.warn(LOG, "title failed", result.error);
      if (articleId) {
        const graphResult = await updateTitleGraphql(articleId, payload.title).catch((error) => ({
          ok: false,
          error: error?.message || String(error)
        }));
        summary.title.graphql = graphResult;
        if (!graphResult.ok) console.warn(LOG, "title GraphQL failed", graphResult);
      } else {
        summary.title.graphql = { ok: false, skipped: true, reason: "No article id in URL" };
      }
    }

    if (payload.cover) {
      throwIfCancelled();
      if (!articleId) {
        summary.cover.skippedReason = "No article id in URL";
        console.warn(LOG, "cover update skipped: no article id");
      } else {
        const coverUpload = uploads.find((upload) => imageSourcesMatch(upload.source, payload.cover) && upload.mediaId);
        if (coverUpload) {
          summary.cover.matchedUpload = true;
          summary.cover.mediaIdSuffix = coverUpload.mediaId ? coverUpload.mediaId.slice(-8) : null;
          progress("Setting cover...");
          const result = await updateCoverGraphql(articleId, coverUpload.mediaId).catch((error) => ({
            ok: false,
            error: error?.message || String(error)
          }));
          summary.cover.graphql = result;
          if (result.ok) {
            await sleep(600);
            const deleteResult = deleteBlockByKey(draftNode, coverUpload.blockKey);
            summary.cover.bodyBlockDeleted = deleteResult;
            if (!deleteResult.ok) console.warn(LOG, "cover block cleanup failed", deleteResult);
          } else {
            console.warn(LOG, "cover update failed", result);
          }
        } else {
          summary.cover.skippedReason = "Cover source was not uploaded; it may have stayed as a Markdown link";
          console.info(LOG, "cover skipped because the source was not uploaded", payload.cover);
        }
      }
    }

    progress("Cleaning up import markers...");
    summary.markersCleaned += cleanupMarkers(draftNode, payload.markerPrefix);
    kickRender(draftNode);
    await sleep(250);
    throwIfCancelled();
    post("done", { summary });
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
          post("cancelled", { reason: error.message || "Writing stopped by user." });
          return;
        }
        post("error", { error: error?.message || String(error), stack: error?.stack || null });
      });
      return;
    }
    if (event.data.kind === "cancel") {
      cancelRequested = true;
      progress("Writing stopped by user.", "warn");
      return;
    }
    if (event.data.kind === "upload-files") {
      try {
        const result = uploadFilesToEditor(event.data.files || []);
        if (result.ok) post("upload-files-done", { requestId: event.data.requestId, summary: result });
        else post("upload-files-error", { requestId: event.data.requestId, error: result.error });
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
