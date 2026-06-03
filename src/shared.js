(() => {
  const STYLE_TAGS = {
    Bold: "strong",
    Italic: "em",
    Strikethrough: "s",
    Code: "code"
  };

  const BLOCK_TAGS = {
    "header-one": "h1",
    "header-two": "h2",
    "header-three": "h3",
    "header-four": "h4",
    "header-five": "h5",
    "header-six": "h6",
    blockquote: "blockquote",
    unstyled: "p"
  };

  const LOCAL_DB = "xposter_local_assets";
  const LOCAL_STORE = "handles";
  const VAULT_KEY = "vault_root";
  const MAX_IMAGE_BYTES = 16 * 1024 * 1024;
  const MAX_TABLE_IMAGE_PIXELS = 16 * 1000 * 1000;
  const MAX_TABLE_IMAGE_CELLS = 1200;
  const SUPPORTED_IMAGE_MIME_TYPES = new Set([
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/webp",
    "image/bmp",
    "image/avif"
  ]);

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const ZH_TW_CHAR_MAP = new Map(Object.entries({
    "与": "與", "专": "專", "业": "業", "个": "個", "临": "臨", "为": "為", "么": "麼", "于": "於",
    "仅": "僅", "从": "從", "们": "們", "优": "優", "会": "會", "传": "傳", "体": "體", "侧": "側",
    "储": "儲", "关": "關", "内": "內", "写": "寫", "准": "準", "减": "減", "击": "擊", "划": "劃",
    "则": "則", "创": "創", "别": "別", "务": "務", "动": "動", "区": "區", "单": "單", "占": "佔",
    "历": "歷", "发": "發", "变": "變", "台": "臺", "号": "號", "后": "後", "启": "啟", "响": "響",
    "围": "圍", "图": "圖", "块": "塊", "声": "聲", "处": "處", "备": "備", "复": "復", "夹": "夾",
    "实": "實", "对": "對", "导": "導", "将": "將", "尝": "嘗", "尽": "盡", "带": "帶", "帮": "幫",
    "并": "並", "庆": "慶", "库": "庫", "应": "應", "开": "開", "张": "張", "弹": "彈", "当": "當",
    "录": "錄", "径": "徑", "态": "態", "执": "執", "扩": "擴", "报": "報", "拦": "攔", "择": "擇",
    "换": "換", "据": "據", "数": "數", "断": "斷", "无": "無", "旧": "舊", "时": "時", "显": "顯",
    "暂": "暫", "术": "術", "权": "權", "条": "條", "来": "來", "构": "構", "标": "標", "栏": "欄",
    "样": "樣", "桥": "橋", "检": "檢", "残": "殘", "没": "沒", "浅": "淺", "测": "測", "浏": "瀏",
    "温": "溫", "点": "點", "烟": "煙", "状": "狀", "独": "獨", "环": "環", "现": "現", "画": "畫",
    "盖": "蓋", "盗": "盜", "码": "碼", "确": "確", "种": "種", "签": "籤", "类": "類", "级": "級",
    "纯": "純", "纸": "紙", "线": "線", "细": "細", "终": "終", "经": "經", "绑": "綁", "结": "結",
    "给": "給", "绝": "絕", "统": "統", "继": "繼", "绪": "緒", "续": "續", "编": "編", "缩": "縮",
    "网": "網", "联": "聯", "脚": "腳", "节": "節", "获": "獲", "虑": "慮", "装": "裝", "见": "見",
    "观": "觀", "规": "規", "览": "覽", "计": "計", "订": "訂", "认": "認", "让": "讓", "议": "議",
    "记": "記", "许": "許", "设": "設", "访": "訪", "证": "證", "识": "識", "诉": "訴", "诊": "診",
    "试": "試", "该": "該", "详": "詳", "语": "語", "误": "誤", "说": "說", "请": "請", "读": "讀",
    "调": "調", "负": "負", "责": "責", "败": "敗", "账": "賬", "贴": "貼", "费": "費", "转": "轉",
    "轻": "輕", "载": "載", "较": "較", "辑": "輯", "输": "輸", "边": "邊", "过": "過", "运": "運",
    "还": "還", "这": "這", "进": "進", "连": "連", "适": "適", "选": "選", "里": "裡", "钮": "鈕",
    "铃": "鈴", "链": "鏈", "锁": "鎖", "错": "錯", "长": "長", "门": "門", "闭": "閉", "问": "問",
    "闲": "閒", "间": "間", "阅": "閱", "队": "隊", "阶": "階", "际": "際", "随": "隨", "隐": "隱",
    "页": "頁", "项": "項", "须": "須", "预": "預", "题": "題", "风": "風", "馈": "饋", "验": "驗",
    "骤": "驟"
  }));
  const ZH_TW_PHRASES = [
    ["文件夾", "資料夾"],
    ["文件", "檔案"],
    ["軟件", "軟體"],
    ["默認", "預設"],
    ["加載", "載入"],
    ["粘貼", "貼上"],
    ["隊列", "佇列"],
    ["賬號", "帳號"],
    ["後臺", "後台"],
    ["本地", "本機"]
  ];

  function toTraditionalChinese(value) {
    let text = String(value ?? "").replace(/[\u4e00-\u9fff]/g, (char) => ZH_TW_CHAR_MAP.get(char) || char);
    for (const [source, replacement] of ZH_TW_PHRASES) {
      text = text.replaceAll(source, replacement);
    }
    return text;
  }

  function looksLikeMarkdown(text) {
    if (!text || text.length < 3) return false;
    if (findMarkdownImageSpans(text).some((span) => isLikelyMarkdownImageSource(span.source))) return true;
    return [
      /^#{1,6}\s+\S/m,
      /^>\s+\S/m,
      /^[-*+]\s+\S/m,
      /^\d+\.\s+\S/m,
      /^\s*```/m,
      /^\s*(?:---|\*\*\*|___)\s*$/m,
      /\[[^\]]+\]\(https?:\/\/\S+\)/i,
      /^\s*\|.+\|\s*$\n^\s*\|[\s:|\-]+\|\s*$/m,
      /`[^`\n]+`/
    ].some((pattern) => pattern.test(text));
  }

  function parseFrontmatter(markdown) {
    const normalized = String(markdown ?? "").replace(/\r\n/g, "\n");
    const match = normalized.match(/^---\n([\s\S]*?)\n---\n*/);
    if (!match) return { body: normalized.trim(), meta: {} };
    const meta = {};
    for (const line of match[1].split("\n")) {
      const index = line.indexOf(":");
      if (index < 0) continue;
      const key = line.slice(0, index).trim();
      const value = line
        .slice(index + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
      if (key) meta[key] = value;
    }
    return { body: normalized.slice(match[0].length).trim(), meta };
  }

  function markdownTitleCandidate(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function markdownTitleCandidateFromFileName(fileName) {
    const raw = String(fileName || "").trim();
    if (!raw) return "";
    const name = raw.split(/[?#]/)[0].split(/[\\/]/).filter(Boolean).pop() || raw;
    const stem = name.replace(/\.(md|markdown|mdown|mkd|txt)$/i, "");
    return markdownTitleCandidate(stem);
  }

  function markdownTitleCandidateFromOptions(options = {}) {
    const explicit = markdownTitleCandidate(
      options.titleCandidate || options.fallbackTitle || options.sourceTitle || ""
    );
    if (explicit) return explicit;
    return markdownTitleCandidateFromFileName(options.sourceFileName || options.fileName || "");
  }

  const SMART_PUNCT_MASK_OPEN = "\uE000";
  const SMART_PUNCT_MASK_CLOSE = "\uE001";
  const SMART_PUNCT_PROTECTED_PATTERNS = [
    /https?:\/\/[^\s<>"')）]+/gi,
    /\bwww\.[^\s<>"')）]+/gi,
    /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g,
    /(?:\.{0,2}\/|~\/|[A-Za-z]:[\\/])?[A-Za-z0-9_.-]+(?:[\\/][A-Za-z0-9_.-]+)+/g
  ];
  const SMART_PUNCT_CONTEXT_RE = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uac00-\ud7af]/u;
  const SMART_PUNCT_CJK_RUN = "[\\u3040-\\u30ff\\u3400-\\u4dbf\\u4e00-\\u9fff\\uf900-\\ufaff\\uac00-\\ud7af]";
  const SMART_PUNCT_ENUM_RE = new RegExp(`${SMART_PUNCT_CJK_RUN}{1,6}(?:,${SMART_PUNCT_CJK_RUN}{1,6}){2,}`, "gu");
  const SMART_PUNCT_CLOSERS = "”’）」』》】〉〕｝";
  const SMART_PUNCT_PAIR_FULL = new Map([
    [",", "，"],
    [";", "；"],
    [":", "："],
    ["!", "！"],
    ["?", "？"]
  ]);
  const SMART_PUNCT_CLAUSE_STARTERS = [
    "因为", "所以", "但是", "可是", "不过", "然后", "因此", "于是",
    "虽然", "如果", "而且", "并且", "接着", "同时", "由于", "除非",
    "使得", "导致", "从而"
  ];

  function isSmartPunctuationContextChar(char) {
    if (!char) return false;
    const code = char.charCodeAt(0);
    return (
      (code >= 0x3040 && code <= 0x30ff) ||
      (code >= 0x3400 && code <= 0x4dbf) ||
      (code >= 0x4e00 && code <= 0x9fff) ||
      (code >= 0xac00 && code <= 0xd7af) ||
      (code >= 0xf900 && code <= 0xfaff) ||
      (code >= 0x3000 && code <= 0x303f) ||
      (code >= 0xff00 && code <= 0xffef)
    );
  }

  function smartPunctuationPrevNonspace(text, index) {
    let cursor = index - 1;
    while (cursor >= 0 && /[ \t]/.test(text[cursor])) cursor -= 1;
    return cursor >= 0 ? text[cursor] : "";
  }

  function smartPunctuationNextNonspace(text, index) {
    let cursor = index + 1;
    while (cursor < text.length && /[ \t]/.test(text[cursor])) cursor += 1;
    return cursor < text.length ? text[cursor] : "";
  }

  function smartPunctuationPrevContentChar(text, index) {
    let cursor = index - 1;
    while (cursor >= 0 && (/[ \t]/.test(text[cursor]) || SMART_PUNCT_CLOSERS.includes(text[cursor]))) {
      cursor -= 1;
    }
    return cursor >= 0 ? text[cursor] : "";
  }

  function isAsciiDigit(char) {
    return char >= "0" && char <= "9";
  }

  function isAsciiWordContextChar(char) {
    return Boolean(char && /[A-Za-z0-9_]/.test(char));
  }

  function shouldUseSmartPunctuationFullwidth(previousContent, nextContent, { terminal = false } = {}) {
    const previousIsCjk = isSmartPunctuationContextChar(previousContent);
    const nextIsCjk = isSmartPunctuationContextChar(nextContent);
    if (previousIsCjk && nextIsCjk) return true;
    if (terminal && previousIsCjk && !isAsciiWordContextChar(nextContent)) return true;
    return false;
  }

  function smartPunctuationHasAdjacentContext(text, start, end = start) {
    return (
      isSmartPunctuationContextChar(smartPunctuationPrevNonspace(text, start)) ||
      isSmartPunctuationContextChar(smartPunctuationNextNonspace(text, end))
    );
  }

  function smartPunctuationHasWrapperContext(text, offset, matchLength, inner) {
    const before = offset > 0 ? text[offset - 1] : "";
    const after = offset + matchLength < text.length ? text[offset + matchLength] : "";
    return (
      isSmartPunctuationContextChar(before) ||
      isSmartPunctuationContextChar(after) ||
      SMART_PUNCT_CONTEXT_RE.test(inner)
    );
  }

  function smartPunctuationHasClauseStarter(match) {
    return match
      .split(",")
      .some((item) => SMART_PUNCT_CLAUSE_STARTERS.some((starter) => item.startsWith(starter)));
  }

  function smartPunctuationNeighborChars(text, index) {
    return {
      previous: index > 0 ? text[index - 1] : "",
      next: index + 1 < text.length ? text[index + 1] : ""
    };
  }

  function shouldPreserveAsciiNumericPunctuation(previous, next) {
    return isAsciiDigit(previous) && isAsciiDigit(next);
  }

  function smartPunctuationPairReplacement(text, index, char) {
    const { previous, next } = smartPunctuationNeighborChars(text, index);
    if ((char === "," || char === ":") && shouldPreserveAsciiNumericPunctuation(previous, next)) {
      return char;
    }

    const previousContent = smartPunctuationPrevContentChar(text, index);
    const nextContent = smartPunctuationNextNonspace(text, index);
    if (char === ":") {
      return shouldUseSmartPunctuationFullwidth(previousContent, nextContent) ? "：" : char;
    }

    const terminal = char === "!" || char === "?";
    return shouldUseSmartPunctuationFullwidth(previousContent, nextContent, { terminal })
      ? SMART_PUNCT_PAIR_FULL.get(char)
      : char;
  }

  function smartPunctuationPeriodReplacement(text, index) {
    const { previous, next } = smartPunctuationNeighborChars(text, index);
    if (shouldPreserveAsciiNumericPunctuation(previous, next) || previous === "." || next === ".") {
      return ".";
    }
    return shouldUseSmartPunctuationFullwidth(
      smartPunctuationPrevContentChar(text, index),
      smartPunctuationNextNonspace(text, index),
      { terminal: true }
    ) ? "。" : ".";
  }

  function smartPunctuationCharReplacement(text, index) {
    const char = text[index];
    if (SMART_PUNCT_PAIR_FULL.has(char)) return smartPunctuationPairReplacement(text, index, char);
    if (char === ".") return smartPunctuationPeriodReplacement(text, index);
    return char;
  }

  function normalizeSmartPunctuationValue(value, enabled) {
    return value && enabled ? normalizeSmartPunctuationText(value) : value;
  }

  function maskSmartPunctuationProtectedText(text) {
    const store = [];
    const stash = (match) => {
      const index = store.length;
      store.push(match);
      return `${SMART_PUNCT_MASK_OPEN}${index}${SMART_PUNCT_MASK_CLOSE}`;
    };
    let masked = String(text ?? "");
    for (const pattern of SMART_PUNCT_PROTECTED_PATTERNS) {
      masked = masked.replace(pattern, stash);
    }
    return { masked, store };
  }

  function unmaskSmartPunctuationProtectedText(text, store) {
    const tokenPattern = new RegExp(`${SMART_PUNCT_MASK_OPEN}(\\d+)${SMART_PUNCT_MASK_CLOSE}`, "g");
    return String(text ?? "").replace(tokenPattern, (_, index) => store[Number(index)] || "");
  }

  function normalizeSmartPunctuationText(value) {
    const source = String(value ?? "");
    if (!source) return source;
    const { masked, store } = maskSmartPunctuationProtectedText(source);
    let text = masked.replace(/\u3000/g, " ");

    text = text.replace(/\.{3,}/g, (match, offset) =>
      smartPunctuationHasAdjacentContext(text, offset, offset + match.length - 1) ? "……" : match
    );

    text = text.replace(SMART_PUNCT_ENUM_RE, (match) => {
      if (smartPunctuationHasClauseStarter(match)) return match;
      return match.replace(/,/g, "、");
    });

    text = text.replace(/"([^"\n]*)"/g, (match, inner, offset) => {
      return smartPunctuationHasWrapperContext(text, offset, match.length, inner) ? `“${inner}”` : match;
    });

    text = text.replace(/'([^'\n]*)'/g, (match, inner) =>
      SMART_PUNCT_CONTEXT_RE.test(inner) ? `‘${inner}’` : match
    );

    text = text.replace(/\(([^()\n]*)\)/g, (match, inner, offset) => {
      return smartPunctuationHasWrapperContext(text, offset, match.length, inner) ? `（${inner}）` : match;
    });

    const output = [];
    for (let index = 0; index < text.length; index += 1) {
      output.push(smartPunctuationCharReplacement(text, index));
    }

    text = output.join("");
    text = text.replace(/-{2,}|—+/g, (match, offset) =>
      smartPunctuationHasAdjacentContext(text, offset, offset + match.length - 1) ? "——" : match
    );

    return unmaskSmartPunctuationProtectedText(text, store);
  }

  function parseMarkdown(markdown, options = {}) {
    const extractTitle = options.extractTitle !== false && options.setTitle !== false;
    const extractCover = options.extractCover !== false && options.setCover !== false;
    const smartPunctuation = options.smartPunctuation === true;
    const { body, meta } = parseFrontmatter(markdown);
    const titleFromMetaRaw = meta.title || meta.Title || meta["标题"] || null;
    const titleFromMeta = normalizeSmartPunctuationValue(titleFromMetaRaw, smartPunctuation);
    const titleCandidateRaw = extractTitle ? markdownTitleCandidateFromOptions(options) : "";
    const titleCandidate = normalizeSmartPunctuationValue(titleCandidateRaw, smartPunctuation);
    let cover = extractCover ? meta.cover || meta.Cover || meta["封面"] || null : null;
    if (cover) {
      cover = cover
        .replace(/^!\[\[|\]\]$/g, "")
        .replace(/^!\[[^\]]*\]\(([^)]+)\)$/u, "$1")
        .trim();
    }

    const spans = findSpecialBlocks(body, options);
    const segments = [];
    let cursor = 0;
    for (const span of spans) {
      if (span.start > cursor) {
        segments.push(...parseTextBlocks(body.slice(cursor, span.start), options));
      }
      segments.push(span.segment);
      cursor = span.end;
    }
    if (cursor < body.length) segments.push(...parseTextBlocks(body.slice(cursor), options));

    let title = extractTitle ? titleFromMeta : null;
    let titleSource = title ? "frontmatter" : "";
    if (extractTitle && !title) {
      const titleIndex = segments.findIndex(
        (segment) => segment.type === "text" && segment.kind === "header-one"
      );
      if (titleIndex >= 0) {
        title = segments[titleIndex].text || null;
        titleSource = title ? "heading" : "";
        segments.splice(titleIndex, 1);
      }
    }
    if (extractTitle && !title && titleCandidate) {
      title = titleCandidate;
      titleSource = "candidate";
    }

    if (extractCover && !cover) {
      cover = segments.find((segment) => segment.type === "image" && segment.source)?.source || null;
    }

    return {
      title,
      cover,
      segments,
      meta,
      titleFromMeta: Boolean(extractTitle && titleFromMeta),
      titleFromCandidate: Boolean(extractTitle && titleSource === "candidate"),
      titleSource
    };
  }

  function findSpecialBlocks(markdown, options = {}) {
    const spans = [];
    let match;

    const fencedCode = /```([^\n`]*)\n([\s\S]*?)```/g;
    while ((match = fencedCode.exec(markdown)) !== null) {
      spans.push({
        start: match.index,
        end: match.index + match[0].length,
        segment: {
          type: "code",
          language: (match[1] || "").trim(),
          code: (match[2] || "").replace(/\n$/, "")
        }
      });
    }

    const table = /^(?:[ \t]*\|.+\|[ \t]*\n)(?:[ \t]*\|[\s:|\-]+\|[ \t]*\n)((?:[ \t]*\|.+\|[ \t]*\n?)*)/gm;
    while ((match = table.exec(markdown)) !== null) {
      if (overlaps(spans, match.index)) continue;
      const parsed = parseTable(match[0], options);
      if (!parsed) continue;
      spans.push({
        start: match.index,
        end: match.index + match[0].length,
        segment: { type: "table", ...parsed }
      });
    }

    const divider = /^(?: {0,3})(?:-{3,}|\*{3,}|_{3,})(?:[ \t]*)$/gm;
    while ((match = divider.exec(markdown)) !== null) {
      if (overlaps(spans, match.index)) continue;
      spans.push({
        start: match.index,
        end: match.index + match[0].length,
        segment: { type: "divider" }
      });
    }

    const statusUrl = /^(?: {0,3})https?:\/\/(?:www\.)?(?:x\.com|twitter\.com)\/[A-Za-z0-9_]+\/status\/(\d+)(?:[?#][^\s]*)?\s*$/gm;
    while ((match = statusUrl.exec(markdown)) !== null) {
      if (overlaps(spans, match.index)) continue;
      spans.push({
        start: match.index,
        end: match.index + match[0].length,
        segment: { type: "tweet", tweetId: match[1] }
      });
    }

    for (const image of findMarkdownImageSpans(markdown)) {
      if (overlaps(spans, image.start)) continue;
      const source = image.source;
      const tweet = source.match(
        /^https?:\/\/(?:www\.)?(?:x\.com|twitter\.com)\/[A-Za-z0-9_]+\/status\/(\d+)/
      );
      spans.push({
        start: image.start,
        end: image.end,
        segment: tweet
          ? { type: "tweet", tweetId: tweet[1] }
          : { type: "image", source, alt: image.alt.trim() }
      });
    }

    const linkedTweet = /^[ \t]*\[([^\]]*)\]\(([^)]+)\)[ \t]*$/gm;
    while ((match = linkedTweet.exec(markdown)) !== null) {
      if (overlaps(spans, match.index)) continue;
      const tweet = match[2]
        .trim()
        .match(/^https?:\/\/(?:www\.)?(?:x\.com|twitter\.com)\/[A-Za-z0-9_]+\/status\/(\d+)/);
      if (!tweet) continue;
      spans.push({
        start: match.index,
        end: match.index + match[0].length,
        segment: { type: "tweet", tweetId: tweet[1] }
      });
    }

    const obsidianImage = /^[ \t]*!\[\[([^\]]+)\]\][ \t]*$/gm;
    while ((match = obsidianImage.exec(markdown)) !== null) {
      if (overlaps(spans, match.index)) continue;
      spans.push({
        start: match.index,
        end: match.index + match[0].length,
        segment: { type: "image", source: match[1].trim(), alt: "" }
      });
    }

    return spans.sort((left, right) => left.start - right.start);
  }

  function findMarkdownImageSpans(markdown) {
    const spans = [];
    let cursor = 0;
    while (cursor < markdown.length) {
      const start = markdown.indexOf("![", cursor);
      if (start < 0) break;
      const altEnd = findMarkdownClosingBracket(markdown, start + 2);
      if (altEnd < 0 || markdown[altEnd + 1] !== "(") {
        cursor = start + 2;
        continue;
      }
      const sourceStart = altEnd + 2;
      const sourceEnd = findMarkdownClosingParen(markdown, sourceStart);
      if (sourceEnd < 0) {
        cursor = altEnd + 1;
        continue;
      }
      spans.push({
        start,
        end: sourceEnd + 1,
        alt: markdown.slice(start + 2, altEnd),
        source: markdown.slice(sourceStart, sourceEnd).trim()
      });
      cursor = sourceEnd + 1;
    }
    return spans;
  }

  function findMarkdownClosingBracket(markdown, start) {
    for (let index = start; index < markdown.length; index += 1) {
      if (markdown[index] === "]" && !isEscaped(markdown, index)) return index;
    }
    return -1;
  }

  function findMarkdownClosingParen(markdown, start) {
    let depth = 0;
    for (let index = start; index < markdown.length; index += 1) {
      const char = markdown[index];
      if (isEscaped(markdown, index)) continue;
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

  function isEscaped(text, index) {
    let count = 0;
    for (let cursor = index - 1; cursor >= 0 && text[cursor] === "\\"; cursor -= 1) count += 1;
    return count % 2 === 1;
  }

  function isLikelyMarkdownImageSource(source) {
    const value = String(source || "").trim();
    return /^(?:https?:|data:|\.{0,2}\/)/i.test(value) || /\.(?:png|jpe?g|gif|webp|svg|bmp|avif)(?:[?#]|$)/i.test(value);
  }

  function overlaps(spans, index) {
    return spans.some((span) => index >= span.start && index < span.end);
  }

  function parseTable(block, options = {}) {
    const normalizeCell = options.smartPunctuation === true
      ? normalizeSmartPunctuationText
      : (value) => value;
    const splitRow = (line) => {
      let cells = line.replace(/\\\|/g, "\0").split("|");
      if (cells[0]?.trim() === "") cells = cells.slice(1);
      if (cells[cells.length - 1]?.trim() === "") cells = cells.slice(0, -1);
      return cells.map((cell) => normalizeCell(cell.replace(/\0/g, "|").trim()));
    };

    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines.length < 2) return null;

    const headers = splitRow(lines[0]);
    const alignmentRow = splitRow(lines[1]);
    if (!alignmentRow.every((cell) => /^:?-+:?$/.test(cell))) return null;

    const alignments = alignmentRow.map((cell) => {
      const left = cell.startsWith(":");
      const right = cell.endsWith(":");
      if (left && right) return "center";
      return right ? "right" : "left";
    });

    const rows = lines.slice(2).map((line) => {
      const cells = splitRow(line);
      while (cells.length < headers.length) cells.push("");
      return cells.slice(0, headers.length);
    });

    return { headers, alignments, rows };
  }

  function parseTextBlocks(text, options = {}) {
    const lines = text.split("\n");
    const segments = [];
    let paragraph = [];

    const flush = () => {
      const value = paragraph.join("\n").trim();
      if (value) segments.push(parseInline("unstyled", value, options));
      paragraph = [];
    };

    for (const line of lines) {
      const trimmed = line.trim();
      let match;
      if (!trimmed) {
        flush();
        continue;
      }
      if ((match = trimmed.match(/^(#{1,6})\s+(.+)$/))) {
        flush();
        const kind = [
          "",
          "header-one",
          "header-two",
          "header-three",
          "header-four",
          "header-five",
          "header-six"
        ][match[1].length];
        segments.push(parseInline(kind, match[2].trim(), options));
        continue;
      }
      if ((match = trimmed.match(/^>\s+(.+)$/))) {
        flush();
        segments.push(parseInline("blockquote", match[1].trim(), options));
        continue;
      }
      if ((match = trimmed.match(/^[-*+]\s+(.+)$/))) {
        flush();
        segments.push(parseInline("unordered-list-item", match[1].trim(), options));
        continue;
      }
      if ((match = trimmed.match(/^\d+\.\s+(.+)$/))) {
        flush();
        segments.push(parseInline("ordered-list-item", match[1].trim(), options));
        continue;
      }
      paragraph.push(trimmed);
    }

    flush();
    return segments;
  }

  function parseInline(kind, source, options = {}) {
    const result = { type: "text", kind, text: "", inlineStyleRanges: [], links: [] };
    let cursor = 0;
    let plain = "";

    const normalizeVisibleText = (text) =>
      options.smartPunctuation === true ? normalizeSmartPunctuationText(text) : String(text ?? "");
    const appendPlain = () => {
      if (!plain) return;
      result.text += normalizeVisibleText(plain);
      plain = "";
    };
    const appendStyled = (text, styles, { normalize = true } = {}) => {
      const value = normalize ? normalizeVisibleText(text) : String(text ?? "");
      const offset = result.text.length;
      result.text += value;
      for (const style of styles) {
        result.inlineStyleRanges.push({ offset, length: value.length, style });
      }
    };

    while (cursor < source.length) {
      const char = source[cursor];

      if (char === "[") {
        const link = source.slice(cursor).match(/^\[([^\]]+)\]\(([^)]+)\)/);
        if (link) {
          appendPlain();
          const label = normalizeVisibleText(link[1]);
          const offset = result.text.length;
          result.text += label;
          result.links.push({ offset, length: label.length, url: link[2] });
          cursor += link[0].length;
          continue;
        }
      }

      const inlineRules = [
        { marker: "***", styles: ["Bold", "Italic"] },
        { marker: "**", styles: ["Bold"] },
        { marker: "~~", styles: ["Strikethrough"] }
      ];
      let matched = false;
      for (const rule of inlineRules) {
        if (!source.startsWith(rule.marker, cursor)) continue;
        const end = source.indexOf(rule.marker, cursor + rule.marker.length);
        if (end <= cursor) continue;
        appendPlain();
        appendStyled(source.slice(cursor + rule.marker.length, end), rule.styles);
        cursor = end + rule.marker.length;
        matched = true;
        break;
      }
      if (matched) continue;

      if ((char === "*" || char === "_") && source[cursor + 1] !== char) {
        const end = source.indexOf(char, cursor + 1);
        if (end > cursor && source[end + 1] !== char) {
          appendPlain();
          appendStyled(source.slice(cursor + 1, end), ["Italic"]);
          cursor = end + 1;
          continue;
        }
      }

      if (char === "`") {
        const end = source.indexOf("`", cursor + 1);
        if (end > cursor) {
          appendPlain();
          appendStyled(source.slice(cursor + 1, end), ["Code"], { normalize: false });
          cursor = end + 1;
          continue;
        }
      }

      plain += char;
      cursor += 1;
    }

    appendPlain();
    return result;
  }

  function segmentCounts(segments) {
    return segments.reduce(
      (counts, segment) => {
        counts[segment.type] = (counts[segment.type] || 0) + 1;
        return counts;
      },
      { text: 0, image: 0, table: 0, tweet: 0, code: 0, divider: 0 }
    );
  }

  function applyLimits(segments, limits) {
    if (!limits) return { segments, dropped: null };

    const output = [];
    const counters = { image: 0, table: 0, tweet: 0 };
    const dropped = { images: 0, tables: 0, tweets: 0 };

    for (const segment of segments) {
      if (segment.type === "image") {
        counters.image += 1;
        if (counters.image > limits.maxImagesPerImport) {
          dropped.images += 1;
          output.push(textSegment(`![${segment.alt || ""}](${segment.source})`));
          continue;
        }
      }
      if (segment.type === "table") {
        counters.table += 1;
        if (counters.table > limits.maxTablesPerImport) {
          dropped.tables += 1;
          output.push(textSegment(tableToMarkdown(segment)));
          continue;
        }
      }
      if (segment.type === "tweet") {
        counters.tweet += 1;
        if (counters.tweet > limits.maxTweetsPerImport) {
          dropped.tweets += 1;
          output.push(textSegment(`https://twitter.com/i/web/status/${segment.tweetId}`));
          continue;
        }
      }
      output.push(segment);
    }

    if (limits.appendSignature) {
      output.push(textSegment("Published with xPoster"));
    }

    const hasDropped = dropped.images || dropped.tables || dropped.tweets;
    return { segments: output, dropped: hasDropped ? dropped : null };
  }

  function textSegment(text) {
    return {
      type: "text",
      kind: "unstyled",
      text,
      inlineStyleRanges: [],
      links: []
    };
  }

  function tableToMarkdown(table) {
    const lines = [];
    lines.push(`| ${table.headers.join(" | ")} |`);
    lines.push(
      `| ${table.alignments
        .map((alignment) => (alignment === "center" ? ":---:" : alignment === "right" ? "---:" : ":---"))
        .join(" | ")} |`
    );
    for (const row of table.rows) lines.push(`| ${row.join(" | ")} |`);
    return lines.join("\n");
  }

  function imageSourcesMatch(left, right) {
    const leftRaw = String(left || "").trim();
    const rightRaw = String(right || "").trim();
    if (!leftRaw || !rightRaw) return false;
    if (leftRaw === rightRaw) return true;
    try {
      const leftUrl = new URL(leftRaw, "https://xposter.local");
      const rightUrl = new URL(rightRaw, "https://xposter.local");
      leftUrl.hash = "";
      rightUrl.hash = "";
      return decodeURIComponent(leftUrl.href) === decodeURIComponent(rightUrl.href);
    } catch {
      return leftRaw.split("#")[0] === rightRaw.split("#")[0];
    }
  }

  function buildPastePlan(segments, imageResults = new Map(), tableResults = new Map(), options = {}) {
    const prefix = `__XPOSTER_${Math.random().toString(36).slice(2, 7)}_`;
    let index = 0;
    const html = [];
    const blocks = [];
    const plan = [];
    let listTag = null;
    let listItems = [];

    const marker = (type) => `${prefix}${type}_${index++}__`;
    const addBlock = (type, text, segment = null) => {
      blocks.push({
        type: type || "unstyled",
        text: String(text ?? "").replace(/\n+/g, " "),
        inlineStyleRanges: (segment?.inlineStyleRanges || []).map((range) => ({ ...range })),
        links: (segment?.links || []).map((link) => ({ ...link }))
      });
    };
    const flushList = () => {
      if (!listTag) return;
      html.push(`<${listTag}>${listItems.map((item) => `<li>${item}</li>`).join("")}</${listTag}>`);
      listTag = null;
      listItems = [];
    };
    const addImageOperation = (segment, result, { markerType = "IMAGE", coverOnly = false } = {}) => {
      const id = marker(markerType);
      html.push(`<p>${id}</p>`);
      addBlock("unstyled", id);
      plan.push({
        marker: id,
        op: {
          type: "image",
          file: {
            base64: result.base64,
            mime: result.mime,
            fileName: result.fileName,
            alt: segment.alt || ""
          },
          source: segment.source,
          fallbackText: coverOnly ? "" : imageFallbackMarkdown(segment),
          coverOnly
        }
      });
    };

    for (const segment of segments) {
      if (segment.type === "text") {
        const rendered = renderInlineHtml(segment) || "<br>";
        addBlock(segment.kind, segment.text || "", segment);
        if (segment.kind === "unordered-list-item" || segment.kind === "ordered-list-item") {
          const nextTag = segment.kind === "unordered-list-item" ? "ul" : "ol";
          if (listTag && listTag !== nextTag) flushList();
          listTag = nextTag;
          listItems.push(rendered);
          continue;
        }
        flushList();
        const tag = BLOCK_TAGS[segment.kind] || "p";
        html.push(`<${tag}>${rendered}</${tag}>`);
        continue;
      }

      flushList();

      if (segment.type === "divider") {
        const id = marker("DIVIDER");
        html.push(`<p>${id}</p>`);
        addBlock("unstyled", id);
        plan.push({
          marker: id,
          op: { type: "atomic", entityType: "DIVIDER", data: {}, mutability: "IMMUTABLE" }
        });
        continue;
      }

      if (segment.type === "code") {
        const id = marker("CODE");
        const markdown = `\`\`\`${segment.language || ""}\n${segment.code || ""}\n\`\`\``;
        html.push(`<p>${id}</p>`);
        addBlock("unstyled", id);
        plan.push({
          marker: id,
          op: { type: "atomic", entityType: "MARKDOWN", data: { markdown }, mutability: "MUTABLE" }
        });
        continue;
      }

      if (segment.type === "tweet") {
        const id = marker("TWEET");
        const url = `https://twitter.com/i/web/status/${segment.tweetId}`;
        html.push(`<p>${id}</p>`);
        addBlock("unstyled", id);
        plan.push({
          marker: id,
          op: {
            type: "atomic",
            entityType: "TWEET",
            data: { url, tweetId: segment.tweetId },
            mutability: "IMMUTABLE"
          }
        });
        continue;
      }

      if (segment.type === "image") {
        const result = imageResults.get(segment);
        if (result?.ok) {
          addImageOperation(segment, result);
        } else {
          const fallback = imageFallbackMarkdown(segment);
          html.push(`<p>${escapeHtml(fallback)}</p>`);
          addBlock("unstyled", fallback);
        }
        continue;
      }

      if (segment.type === "table") {
        const result = tableResults.get(segment);
        if (result?.ok) {
          const id = marker("TABLE");
          html.push(`<p>${id}</p>`);
          addBlock("unstyled", id);
          plan.push({
            marker: id,
            op: {
              type: "image",
              file: {
                base64: result.base64,
                mime: result.mime,
                fileName: result.fileName,
                alt: "table"
              },
              fallbackText: tableToMarkdown(segment)
            }
          });
        } else {
          const fallback = tableToMarkdown(segment);
          html.push(`<pre><code>${escapeHtml(fallback)}</code></pre>`);
          addBlock("code-block", fallback);
        }
      }
    }

    const coverSource = String(options.coverSource || "").trim();
    const coverResult = options.coverResult || null;
    const coverAlreadyInBody = coverSource && segments.some(
      (segment) => segment.type === "image" && imageSourcesMatch(segment.source, coverSource)
    );
    if (coverSource && coverResult?.ok && !coverAlreadyInBody) {
      addImageOperation(
        { type: "image", source: coverSource, alt: "cover" },
        coverResult,
        { markerType: "COVER", coverOnly: true }
      );
    }

    flushList();
    return { html: html.join(""), plain: blocksToPlainText(blocks), blocks, plan, markerPrefix: prefix };
  }

  function imageFallbackMarkdown(segment = {}) {
    const rawAlt = String(segment.alt || guessFileName(segment.source, "image") || "image")
      .replace(/[\]\r\n]+/g, " ")
      .trim();
    const alt = rawAlt || "image";
    const source = String(segment.source || "").trim();
    if (!source || source.startsWith("data:")) return `[image unavailable: ${alt}]`;
    return `![${alt}](${source})`;
  }

  function renderInlineHtml(segment) {
    const text = segment.text || "";
    const openAt = new Array(text.length + 1).fill(null).map(() => []);
    const closeAt = new Array(text.length + 1).fill(null).map(() => []);

    for (const range of segment.inlineStyleRanges || []) {
      const tag = STYLE_TAGS[range.style];
      if (!tag) continue;
      openAt[range.offset]?.push(`<${tag}>`);
      closeAt[range.offset + range.length]?.unshift(`</${tag}>`);
    }

    for (const link of segment.links || []) {
      const href = escapeHtml(link.url);
      openAt[link.offset]?.push(`<a href="${href}">`);
      closeAt[link.offset + link.length]?.unshift("</a>");
    }

    let output = "";
    for (let i = 0; i < text.length; i += 1) {
      output += closeAt[i].join("");
      output += openAt[i].join("");
      output += escapeHtml(text[i]);
    }
    output += closeAt[text.length].join("");
    return output;
  }

  function blocksToPlainText(blocks) {
    return blocks
      .map((block) => String(block?.text || "").trim())
      .filter(Boolean)
      .join("\n\n");
  }

  function isLocalImageSource(source) {
    return Boolean(
      source &&
        typeof source === "string" &&
        !/^https?:\/\//i.test(source) &&
        !source.startsWith("data:")
    );
  }

  function isAbsoluteLocalImageSource(source) {
    return /^(?:file:\/\/\/?|[a-zA-Z]:[\\/]|\/)/.test(String(source || ""));
  }

  function parseLocalImagePath(source) {
    if (isAbsoluteLocalImageSource(source)) {
      return { ok: false, error: "Absolute paths outside the selected folder are not supported", source };
    }

    const cleanPath = String(source || "")
      .replace(/\\/g, "/")
      .split(/[?#]/)[0]
      .replace(/^\.\/+/, "")
      .replace(/\/+/g, "/")
      .replace(/^\/+/, "");

    if (/^[a-zA-Z]:\//.test(cleanPath)) {
      return { ok: false, error: "Absolute paths outside the selected folder are not supported", source };
    }

    const parts = cleanPath
      .split("/")
      .map((part) => {
        try {
          return decodeURIComponent(part);
        } catch {
          return part;
        }
      })
      .filter((part) => part && part !== ".");

    if (!parts.length || parts[parts.length - 1] === "..") {
      return { ok: false, error: "Local image path is empty", source };
    }

    let depth = 0;
    for (const part of parts) {
      if (part === "..") depth -= 1;
      else depth += 1;
      if (depth < 0) return { ok: false, error: "Path escapes the selected folder", source };
    }

    return { ok: true, parts, source };
  }

  function localImageRootNames(rootNames) {
    const values = Array.isArray(rootNames) ? rootNames : [rootNames];
    return values
      .map((name) => String(name || "").trim())
      .filter(Boolean);
  }

  function localImagePathPartMatchesName(part, name) {
    return String(part || "").normalize("NFC").toLowerCase() === String(name || "").normalize("NFC").toLowerCase();
  }

  function localImagePathCandidatesFromParts(parts, rootNames = []) {
    const candidates = [];
    const seen = new Set();
    const add = (candidate) => {
      if (!candidate.length) return;
      const key = candidate.join("\0");
      if (seen.has(key)) return;
      seen.add(key);
      candidates.push(candidate);
    };

    add(parts);
    if (parts.length <= 1) return candidates;

    const names = localImageRootNames(rootNames);
    for (let index = 0; index < parts.length - 1; index += 1) {
      if (names.some((name) => localImagePathPartMatchesName(parts[index], name))) {
        add(parts.slice(index + 1));
      }
    }
    return candidates;
  }

  function localImagePathCandidates(source, rootNames = []) {
    const parsed = parseLocalImagePath(source);
    return parsed.ok ? localImagePathCandidatesFromParts(parsed.parts, rootNames) : [];
  }

  function guessFileName(source, fallback = "image") {
    if (typeof source !== "string") return `${fallback}.png`;
    if (source.startsWith("data:")) return `${fallback}.png`;
    try {
      const url = new URL(source, "https://xposter.local");
      const name = url.pathname.split("/").filter(Boolean).pop();
      return name && /\.[a-z0-9]{2,5}$/i.test(name) ? name : `${fallback}.png`;
    } catch {
      const name = source.split(/[?#]/)[0].split(/[\\/]/).filter(Boolean).pop();
      return name && /\.[a-z0-9]{2,5}$/i.test(name) ? name : `${fallback}.png`;
    }
  }

  function extensionMime(fileName, fallback = "image/png") {
    const ext = String(fileName || "").split(".").pop()?.toLowerCase();
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
      }[ext] || fallback
    );
  }

  function isSupportedImageMime(mime) {
    return SUPPORTED_IMAGE_MIME_TYPES.has(String(mime || "").split(";")[0].trim().toLowerCase());
  }

  function isPrivateImageHost(hostname) {
    const host = String(hostname || "").replace(/^\[|\]$/g, "").toLowerCase();
    if (!host || /^(localhost|.+\.localhost)$/i.test(host)) return true;
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

  function isRemoteHttpImageSource(source) {
    try {
      const url = new URL(String(source || "").trim());
      return (url.protocol === "https:" || url.protocol === "http:") && !isPrivateImageHost(url.hostname);
    } catch {
      return false;
    }
  }

  function base64ByteLength(base64) {
    const clean = String(base64 || "").replace(/\s+/g, "");
    const padding = clean.endsWith("==") ? 2 : clean.endsWith("=") ? 1 : 0;
    return Math.max(0, Math.floor((clean.length * 3) / 4) - padding);
  }

  function validateImagePayload(mime, bytes, maxBytes = MAX_IMAGE_BYTES) {
    if (!isSupportedImageMime(mime)) return { ok: false, error: `Unsupported image type: ${mime || "unknown"}` };
    if (bytes > maxBytes) return { ok: false, error: `Image is too large (${bytes} bytes)` };
    return { ok: true };
  }

  function parseDataUri(uri, options = {}) {
    const match = String(uri || "").match(/^data:([^;,]+)?(;base64)?,([\s\S]*)$/);
    if (!match) return { ok: false, error: "Invalid data URI" };
    const mime = (match[1] || "image/png").toLowerCase();
    const maxBytes = Number.isFinite(options.maxBytes) ? options.maxBytes : MAX_IMAGE_BYTES;
    if (match[2]) {
      const base64 = match[3].replace(/\s+/g, "");
      const bytes = base64ByteLength(base64);
      const valid = validateImagePayload(mime, bytes, maxBytes);
      return valid.ok ? { ok: true, mime, base64, bytes } : valid;
    }
    try {
      const base64 = btoa(unescape(encodeURIComponent(decodeURIComponent(match[3]))));
      const bytes = base64ByteLength(base64);
      const valid = validateImagePayload(mime, bytes, maxBytes);
      return valid.ok ? { ok: true, mime, base64, bytes } : valid;
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

  async function openLocalDb() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(LOCAL_DB, 1);
      request.onupgradeneeded = () => request.result.createObjectStore(LOCAL_STORE);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function requestToPromise(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function saveVaultHandle(handle) {
    const db = await openLocalDb();
    const store = db.transaction(LOCAL_STORE, "readwrite").objectStore(LOCAL_STORE);
    await requestToPromise(store.put({ handle, name: handle.name, savedAt: Date.now() }, VAULT_KEY));
  }

  async function getVaultRecord() {
    const db = await openLocalDb();
    const store = db.transaction(LOCAL_STORE, "readonly").objectStore(LOCAL_STORE);
    return (await requestToPromise(store.get(VAULT_KEY))) || null;
  }

  async function clearVaultHandle() {
    const db = await openLocalDb();
    const store = db.transaction(LOCAL_STORE, "readwrite").objectStore(LOCAL_STORE);
    await requestToPromise(store.delete(VAULT_KEY));
  }

  async function ensureReadPermission(handle) {
    const options = { mode: "read" };
    if (typeof handle?.queryPermission === "function" && (await handle.queryPermission(options)) === "granted") {
      return "granted";
    }
    if (typeof handle?.requestPermission === "function") return handle.requestPermission(options);
    return "denied";
  }

  async function queryReadPermission(handle) {
    if (typeof handle?.queryPermission !== "function") return "denied";
    return handle.queryPermission({ mode: "read" });
  }

  async function resolveLocalImage(source) {
    if (!isLocalImageSource(source)) return { ok: false, error: "Not a local image source" };
    const record = await getVaultRecord();
    if (!record?.handle) return { ok: false, error: "No local image folder selected" };
    if ((await queryReadPermission(record.handle)) !== "granted") {
      return { ok: false, error: "Local image folder permission expired" };
    }

    const parsedPath = parseLocalImagePath(source);
    if (!parsedPath.ok) return parsedPath;

    const candidates = localImagePathCandidatesFromParts(parsedPath.parts, [record.name, record.handle.name]);
    let lastError = null;

    for (const parts of candidates) {
      try {
        let directory = record.handle;
        for (const part of parts.slice(0, -1)) {
          if (part === "..") throw new Error("Cannot traverse above selected folder");
          directory = await directory.getDirectoryHandle(part, { create: false });
        }
        const file = await (await directory.getFileHandle(parts[parts.length - 1], { create: false })).getFile();
        const mime = file.type || extensionMime(file.name);
        const valid = validateImagePayload(mime, file.size || 0);
        if (!valid.ok) return { ...valid, source };
        const buffer = await file.arrayBuffer();
        return {
          ok: true,
          base64: arrayBufferToBase64(buffer),
          mime,
          fileName: file.name,
          bytes: buffer.byteLength,
          source
        };
      } catch (error) {
        lastError = error;
      }
    }

    return { ok: false, error: lastError?.message || "Local file not found", source };
  }

  async function renderTableImage(table, fileName = `table-${Date.now()}.png`) {
    const scale = Math.min(2, window.devicePixelRatio || 1);
    const paddingX = 24;
    const paddingY = 16;
    const rowHeight = 42;
    const minColumnWidth = 120;
    const maxColumnWidth = 260;
    const font = "14px ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";

    const measurer = document.createElement("canvas").getContext("2d");
    measurer.font = font;
    const columnCount = table.headers.length;
    const rowCount = table.rows.length + 1;
    if (columnCount * rowCount > MAX_TABLE_IMAGE_CELLS) {
      throw new Error("Table is too large to render as an image");
    }
    const widths = Array.from({ length: columnCount }, (_, index) => {
      const values = [table.headers[index], ...table.rows.map((row) => row[index] || "")];
      const measured = Math.max(...values.map((value) => measurer.measureText(String(value)).width + paddingX * 2));
      return Math.max(minColumnWidth, Math.min(maxColumnWidth, Math.ceil(measured)));
    });

    const width = widths.reduce((sum, value) => sum + value, 0);
    const height = rowHeight * rowCount;
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(width * scale);
    canvas.height = Math.ceil(height * scale);
    if (canvas.width * canvas.height > MAX_TABLE_IMAGE_PIXELS) {
      throw new Error("Table image would be too large to render");
    }
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    ctx.fillStyle = "#fbfaf7";
    ctx.fillRect(0, 0, width, height);
    ctx.font = font;
    ctx.textBaseline = "middle";

    let x = 0;
    const drawCell = (text, column, row, isHeader) => {
      const cellWidth = widths[column];
      const y = row * rowHeight;
      ctx.fillStyle = isHeader ? "#eeece6" : row % 2 ? "#fbfaf7" : "#f6f3ec";
      ctx.fillRect(x, y, cellWidth, rowHeight);
      ctx.strokeStyle = "#d8d2c6";
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, cellWidth, rowHeight);
      ctx.fillStyle = "#201f1b";
      ctx.font = isHeader
        ? "600 14px ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
        : font;
      const alignment = table.alignments[column] || "left";
      let textX = x + paddingX;
      ctx.textAlign = "left";
      if (alignment === "center") {
        textX = x + cellWidth / 2;
        ctx.textAlign = "center";
      } else if (alignment === "right") {
        textX = x + cellWidth - paddingX;
        ctx.textAlign = "right";
      }
      ctx.fillText(String(text), textX, y + rowHeight / 2, cellWidth - paddingX * 2);
      x += cellWidth;
    };

    x = 0;
    table.headers.forEach((header, column) => drawCell(header, column, 0, true));
    for (let rowIndex = 0; rowIndex < table.rows.length; rowIndex += 1) {
      x = 0;
      table.rows[rowIndex].forEach((cell, column) => drawCell(cell, column, rowIndex + 1, false));
    }

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((value) => (value ? resolve(value) : reject(new Error("Could not render table"))), "image/png");
    });
    const buffer = await blob.arrayBuffer();
    return {
      ok: true,
      base64: arrayBufferToBase64(buffer),
      mime: "image/png",
      fileName,
      bytes: buffer.byteLength
    };
  }

  const api = {
    looksLikeMarkdown,
    parseMarkdown,
    markdownTitleCandidate,
    markdownTitleCandidateFromFileName,
    segmentCounts,
    applyLimits,
    buildPastePlan,
    escapeHtml,
    imageSourcesMatch,
    isLocalImageSource,
    isAbsoluteLocalImageSource,
    localImagePathCandidates,
    guessFileName,
    extensionMime,
    isSupportedImageMime,
    isPrivateImageHost,
    isRemoteHttpImageSource,
    parseDataUri,
    arrayBufferToBase64,
    toTraditionalChinese,
    renderTableImage,
    saveVaultHandle,
    getVaultRecord,
    clearVaultHandle,
    ensureReadPermission,
    queryReadPermission,
    resolveLocalImage
  };

  if (typeof window !== "undefined") {
    window.xPosterShared = api;
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
