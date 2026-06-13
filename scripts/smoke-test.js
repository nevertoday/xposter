const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const readText = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const readJson = (relativePath) =>
  JSON.parse(readText(relativePath));

const manifest = readJson("manifest.json");
const pkg = readJson("package.json");
const defaultMessages = readJson("_locales/en/messages.json");
const manifestMessage = (value) => {
  const match = String(value || "").match(/^__MSG_([A-Za-z0-9_]+)__$/);
  if (!match) return value;
  return defaultMessages[match[1]]?.message || value;
};
const includesAll = (text, snippets) => snippets.every((snippet) => text.includes(snippet));
const excludesAll = (text, snippets) => snippets.every((snippet) => !text.includes(snippet));

assert.equal(manifest.manifest_version, 3, "manifest must be MV3");
assert.equal(manifest.default_locale, "en", "manifest must declare a default locale");
assert.equal(manifestMessage(manifest.name), "xPoster", "manifest name must resolve to xPoster");
assert.equal(pkg.version.replace(/\.0$/, ""), manifest.version, "package and manifest versions must match");
for (const locale of ["zh_TW", "ja", "fr", "ru", "de", "es", "pt_BR", "ko"]) {
  assert.ok(
    fs.existsSync(path.join(root, "_locales", locale, "messages.json")),
    `${locale} Chrome locale messages should be present`
  );
}
assert.ok(!manifest.host_permissions, "AI image API hosts must not be granted at install time");
assert.deepEqual(
  manifest.optional_host_permissions,
  ["http://*/*", "https://*/*"],
  "remote image and optional AI API hosts should be optional runtime permissions"
);

const requiredFiles = [
  "sidepanel.html",
  "sidepanel.css",
  "sidepanel.js",
  "diagnostics.html",
  "diagnostics.css",
  "diagnostics.js",
  "src/background.js",
  "src/content.js",
  "src/main-world.js",
  "src/shared.js",
  "src/sidepanel-config.js",
  "src/sidepanel-elements.js",
  "src/sidepanel-editor.js",
  "src/sidepanel-messages.js",
  "src/sidepanel-patterns.js",
  "fixtures/live-x-smoke.md",
  "README.zh-CN.md",
  "docs/usage.md",
  "docs/usage.zh-CN.md",
  "docs/privacy.md",
  "docs/privacy.zh-CN.md",
  "docs/images/buy-me-a-coffee-qr.png",
  "assets/icon-16.png",
  "assets/icon-32.png",
  "assets/icon-48.png",
  "assets/icon-128.png"
];

for (const file of requiredFiles) {
  assert.ok(fs.existsSync(path.join(root, file)), `${file} is missing`);
}

for (const contentScript of manifest.content_scripts || []) {
  for (const file of contentScript.js || []) {
    assert.ok(fs.existsSync(path.join(root, file)), `content script ${file} is missing`);
  }
}

for (const resourceGroup of manifest.web_accessible_resources || []) {
  for (const file of resourceGroup.resources || []) {
    assert.ok(fs.existsSync(path.join(root, file)), `web resource ${file} is missing`);
  }
}

const shared = require(path.join(root, "src/shared.js"));
const localImageCandidatePaths = (source, rootNames) =>
  shared.localImagePathCandidates(source, rootNames).map((candidate) => candidate.join("/"));
const fixture = readText("fixtures/live-x-smoke.md");
const parsed = shared.parseMarkdown(fixture);
const counts = shared.segmentCounts(parsed.segments);
const plan = shared.buildPastePlan(parsed.segments);
const remoteImageDraft = "Before\n\n![remote cover](https://images.example.test/path/cover.png)\n\nAfter";
const remoteImageParsed = shared.parseMarkdown(remoteImageDraft);
const failedRemoteImageMap = new Map(
  remoteImageParsed.segments
    .filter((segment) => segment.type === "image")
    .map((segment) => [segment, { ok: false, permissionRequired: true, error: "Chrome permission required" }])
);
const remoteFallbackPlan = shared.buildPastePlan(remoteImageParsed.segments, failedRemoteImageMap);
const mediaLimitDraft = (count) =>
  Array.from({ length: count }, (_, index) => `![image ${index + 1}](https://images.example.test/${index + 1}.png)`).join("\n\n");
const mediaNearLimitParsed = shared.parseMarkdown(mediaLimitDraft(21));
const mediaAtLimitParsed = shared.parseMarkdown(mediaLimitDraft(25));
const mediaOverLimitParsed = shared.parseMarkdown(mediaLimitDraft(26));
const frontmatterOnlyCoverDraft = [
  "---",
  "title: Cover only",
  "cover: https://images.example.test/path/cover.png",
  "---",
  "",
  "Body without a repeated image."
].join("\n");
const frontmatterOnlyCoverParsed = shared.parseMarkdown(frontmatterOnlyCoverDraft);
const metadataOnlyDraft = "---\ntags: \ncreate: 2026-06-01\nupdate: 2026-06-06\n---";
const metadataOnlyParsed = shared.parseMarkdown(metadataOnlyDraft);
const spacedFrontmatterDraft = "\uFEFF\n---   \ntitle: Spaced Meta\n---   \n\nBody after metadata.";
const spacedFrontmatterParsed = shared.parseMarkdown(spacedFrontmatterDraft);
const h1TitleDisabledParsed = shared.parseMarkdown("# Keep this heading\n\nBody text.", { setTitle: false });
const fileTitleParsed = shared.parseMarkdown("Body text only", { sourceFileName: "Campaign Notes.md" });
const fileTitlePathParsed = shared.parseMarkdown("Body text only", { sourceFileName: "/tmp/nested/Product Plan.markdown?download=1" });
const explicitTitleCandidateParsed = shared.parseMarkdown("Body text only", {
  sourceFileName: "file-name.md",
  titleCandidate: "Manual Candidate"
});
const frontmatterTitleBeatsFileParsed = shared.parseMarkdown("---\ntitle: Meta Title\n---\n\nBody text.", { sourceFileName: "File Title.md" });
const headingTitleBeatsFileParsed = shared.parseMarkdown("# Heading Title\n\nBody text.", { sourceFileName: "File Title.md" });
const disabledFileTitleParsed = shared.parseMarkdown("Body text only", { setTitle: false, sourceFileName: "Campaign Notes.md" });
const coverDisabledParsed = shared.parseMarkdown("![cover](https://images.example.test/path/cover.png)\n\nBody text.", {
  setCover: false
});
const smartPunctuationInput = [
  "# 标题,好吗?",
  "",
  "他说\"对\". 产品,渠道,服务 -- 继续... Node.js 3.14 12:30 1,000",
  "",
  "[链接,测试](https://example.test/a,b?q=1,2)",
  "",
  "![图,测试](https://images.example.test/a,b.png)",
  "",
  "| 列 | 值 |",
  "| --- | --- |",
  "| 单元格,好吗? | Node.js |",
  "",
  "```js",
  "const 文案 = \"这是测试,对吧.\";",
  "fn(a, b);",
  "```",
  "",
  "行内 `const 文案 = \"这是测试,对吧.\"; fn(a, b)` 结束,好吗?"
].join("\n");
const smartPunctuationOffParsed = shared.parseMarkdown("这是测试,对吧.", { smartPunctuation: false });
const smartPunctuationParsed = shared.parseMarkdown(smartPunctuationInput, { smartPunctuation: true });
const smartPunctuationBodyOptions = { smartPunctuation: true, setTitle: false };
const smartPunctuationMixedParsed = shared.parseMarkdown(
  "版本 React 18.2, 比例 16:9. 英文句子, with Chinese 中文, maybe risky. 函数 fn(a, b) 的返回值是 true, 对吗?",
  smartPunctuationBodyOptions
);
const smartPunctuationTableInlineCodeParsed = shared.parseMarkdown(
  "| 列 |\n| --- |\n| `文案,对吗?` |",
  smartPunctuationBodyOptions
);
const smartPunctuationTildeCodeParsed = shared.parseMarkdown(
  "~~~js\nconst 文案 = \"这是测试,对吧.\";\nfn(a, b);\n~~~",
  smartPunctuationBodyOptions
);
const smartPunctuationIndentedCodeParsed = shared.parseMarkdown(
  "说明\n\n    const 文案 = \"这是测试,对吧.\";\n    fn(a, b);\n\n结束,好吗?",
  smartPunctuationBodyOptions
);
const smartPunctuationInlineBoundaryParsed = shared.parseMarkdown(
  "中文,**好吗?**\n\n[中文](https://example.test),好吗?\n\n产品,**渠道**,服务",
  smartPunctuationBodyOptions
);
const smartPunctuationParagraph = smartPunctuationParsed.segments.find(
  (segment) => segment.type === "text" && segment.text.startsWith("他说")
);
const smartPunctuationLink = smartPunctuationParsed.segments.find(
  (segment) => segment.type === "text" && segment.links?.length
);
const smartPunctuationImage = smartPunctuationParsed.segments.find((segment) => segment.type === "image");
const smartPunctuationTable = smartPunctuationParsed.segments.find((segment) => segment.type === "table");
const smartPunctuationCode = smartPunctuationParsed.segments.find((segment) => segment.type === "code");
const smartPunctuationInline = smartPunctuationParsed.segments.find(
  (segment) => segment.type === "text" && segment.text.startsWith("行内")
);
const smartPunctuationBoundaryBold = smartPunctuationInlineBoundaryParsed.segments[0];
const smartPunctuationBoundaryLink = smartPunctuationInlineBoundaryParsed.segments[1];
const smartPunctuationBoundaryList = smartPunctuationInlineBoundaryParsed.segments[2];
const coverOnlyPlan = shared.buildPastePlan(
  frontmatterOnlyCoverParsed.segments,
  new Map(),
  new Map(),
  {
    coverSource: frontmatterOnlyCoverParsed.cover,
    coverResult: {
      ok: true,
      base64: "AA==",
      mime: "image/png",
      fileName: "cover.png"
    }
  }
);
const aiCoverSettings = shared.normalizeAiCoverSettings({
  apiKey: "sk-test",
  keys: [
    { id: "primary", name: "Primary", apiKey: "sk-primary", baseUrl: "https://api.openai.com/v1", enabled: false },
    { id: "backup", name: "Backup", apiKey: "sk-backup", provider: "smartcoder", baseUrl: "https://gcli.smartcoder.ai/v1/", enabled: true }
  ],
  activeKeyId: "backup",
  model: "",
  defaultPrompt: "Muted editorial cover, elegant typography mood.",
  rounds: 8,
  imagesPerRound: 9
});
const migratedAiCoverPromptSettings = shared.normalizeAiCoverSettings({
  defaultPrompt: "Legacy editorial style."
});
const aiCoverPromptProfileSettings = shared.normalizeAiCoverSettings({
  promptProfiles: [
    { id: "editorial", name: "Editorial calm", prompt: "Quiet editorial cover with generous whitespace." },
    { id: "product", name: "Product explainers", prompt: "Structured product-system cover with refined diagrams." }
  ],
  activePromptProfileId: "product"
});
const aiCoverLastUsedPromptProfileSettings = shared.normalizeAiCoverSettings({
  promptProfiles: [
    { id: "older", name: "Older style", prompt: "Older prompt.", lastUsedAt: 100 },
    { id: "newer", name: "Newer style", prompt: "Newer prompt.", lastUsedAt: 200 }
  ]
});
const removedAiCoverSettings = shared.normalizeAiCoverSettings({
  apiKey: "sk-legacy",
  keys: [],
  activeKeyId: ""
});
const aiCoverPrompt = shared.buildAiCoverPrompt({
  defaultPrompt: aiCoverSettings.defaultPrompt,
  preset: "minimal-editorial",
  sourceText: "A long article about durable creator workflows."
});
const contentScriptText = readText("src/content.js");
const backgroundText = readText("src/background.js");
const mainWorldText = readText("src/main-world.js");
const sidepanelText = readText("sidepanel.js");
const sidepanelConfigText = readText("src/sidepanel-config.js");
const sidepanelElementsText = readText("src/sidepanel-elements.js");
const sidepanelEditorText = readText("src/sidepanel-editor.js");
const sidepanelRuntimeText = [sidepanelConfigText, sidepanelElementsText, sidepanelEditorText, sidepanelText].join("\n");
const sidepanelMessagesText = readText("src/sidepanel-messages.js");
const sidepanelPatternsText = readText("src/sidepanel-patterns.js");
const sidepanelHtml = readText("sidepanel.html");
const diagnosticsHtml = readText("diagnostics.html");
const sidepanelCss = readText("sidepanel.css");
const sharedText = readText("src/shared.js");
const booleanHelperNonBooleanUse = /setBooleanPropertyIfChanged\([^;\n]+,\s*"(?:value|tabIndex)"/;
assert.ok(!booleanHelperNonBooleanUse.test(sidepanelText), "boolean property helper should not write value or tabIndex");
assert.equal(aiCoverSettings.model, "gpt-image-2", "AI cover settings should default to GPT Image 2");
assert.equal(aiCoverSettings.keys.length, 2, "AI cover settings should preserve multiple image API keys");
assert.equal(aiCoverSettings.activeKeyId, "backup", "AI cover settings should preserve the active key");
assert.equal(shared.activeAiCoverApiKey(aiCoverSettings), "sk-backup", "AI cover generation should use the active key");
assert.equal(shared.activeAiCoverKey(aiCoverSettings)?.baseUrl, "https://gcli.smartcoder.ai/v1", "AI cover generation should use the active key API base URL");
assert.equal(shared.activeAiCoverKey(aiCoverSettings)?.provider, "custom", "Legacy SmartCoder keys should migrate to the custom compatible API platform");
assert.equal(shared.activeAiCoverKey(aiCoverSettings)?.providerName, "OpenAI-compatible API", "Legacy SmartCoder keys should use a readable compatible API name");
assert.equal(
  shared.normalizeAiCoverSettings({ keys: [{ id: "plain", apiKey: "sk-plain", baseUrl: "http://api.example.test/v1" }] }).keys.length,
  0,
  "AI cover API keys with plaintext HTTP endpoints should be rejected instead of silently retargeted"
);
assert.equal(removedAiCoverSettings.keys.length, 0, "AI cover settings should not resurrect legacy keys after keys are explicitly cleared");
assert.equal(migratedAiCoverPromptSettings.promptProfiles.length, 1, "legacy AI cover default prompts should migrate into a named prompt profile");
assert.equal(migratedAiCoverPromptSettings.promptProfiles[0]?.name, "Default style", "migrated AI cover prompts should receive a readable default name");
assert.equal(migratedAiCoverPromptSettings.defaultPrompt, "Legacy editorial style.", "legacy AI cover default prompts should remain available to prompt generation");
assert.equal(aiCoverPromptProfileSettings.promptProfiles.length, 2, "AI cover settings should preserve multiple named prompt profiles");
assert.equal(aiCoverPromptProfileSettings.activePromptProfileId, "product", "AI cover settings should preserve the active prompt profile");
assert.equal(shared.activeAiCoverPromptProfile(aiCoverPromptProfileSettings)?.prompt, "Structured product-system cover with refined diagrams.", "AI cover generation should use the active prompt profile");
assert.equal(aiCoverPromptProfileSettings.defaultPrompt, "Structured product-system cover with refined diagrams.", "active prompt profiles should backfill the legacy defaultPrompt field");
assert.equal(aiCoverLastUsedPromptProfileSettings.activePromptProfileId, "newer", "AI cover settings should default to the last-used prompt profile");
assert.equal(aiCoverSettings.rounds, 6, "AI cover rounds should be capped");
assert.equal(aiCoverSettings.imagesPerRound, 4, "AI cover images per round should be capped");
assert.ok(aiCoverPrompt.includes("5:2"), "AI cover prompts should force a 5:2 cover composition");
assert.ok(aiCoverPrompt.includes(aiCoverSettings.defaultPrompt), "AI cover prompts should include the user's default style prompt");
assert.ok(aiCoverPrompt.includes("durable creator workflows"), "AI cover prompts should include the selected or inferred source text");
assert.ok(
  sidepanelRuntimeText.includes('STORAGE_AI_COVER_SETTINGS = "xposter_ai_cover_settings"') &&
    sidepanelRuntimeText.includes("AI_COVER_DEFAULT_MODEL: \"gpt-image-2\"") &&
    sidepanelRuntimeText.includes("AI_COVER_OUTPUT_WIDTH: 1500") &&
    sidepanelRuntimeText.includes("AI_COVER_OUTPUT_HEIGHT: 600"),
  "AI cover generator constants should be exposed through sidepanel config"
);
assert.ok(
  includesAll(sidepanelHtml, [
    'id="aiCoverSettings"',
    'id="aiCoverOpenKeys"',
    'id="aiCoverOpenGenerator"',
    'id="aiCoverKeySummary"',
    'id="aiCoverPromptProfileSummary"',
    'id="aiCoverGenerationSummary"',
    'id="aiCoverCandidateSummary"',
    'id="aiCoverApiDialog"',
    'id="aiCoverGeneratorDialog"',
    'id="aiCoverPromptProfileDialog"',
    'id="aiCoverKeyName"',
    'id="aiCoverApiProvider"',
    'id="aiCoverApiKey"',
    'id="aiCoverApiBaseUrl"',
    'id="aiCoverAddKey"',
    'id="aiCoverKeyList"',
    'id="aiCoverPromptProfileList"',
    'id="aiCoverPromptProfileSelect"',
    'id="aiCoverPromptProfileName"',
    'id="aiCoverPromptProfilePrompt"',
    'id="aiCoverSavePromptProfile"',
    'id="aiCoverReadiness"',
    'id="aiCoverModel"',
    'id="aiCoverRounds"',
    'id="aiCoverImagesPerRound"',
    'id="aiCoverAdvancedOptions"',
    'id="aiCoverPromptInput"',
    'id="aiCoverGenerate"',
    'id="aiCoverCandidates"',
    'id="draftCoverTool"',
    'id="draftCoverToolMeta"',
    'data-ai-cover-open-generator',
    'Generate cover'
  ]),
  "settings should expose image API cover generation configuration and candidates"
);
assert.ok(
  sidepanelText.includes("function normalizeAiCoverSettingsForStorage") &&
    sidepanelText.includes("function renderAiCoverKeyList") &&
    sidepanelText.includes("function renderAiCoverPromptProfileList") &&
    sidepanelText.includes("function aiCoverApiUrl") &&
    sidepanelText.includes("async function ensureAiCoverApiPermission") &&
    sidepanelText.includes("function aiCoverReadinessState") &&
    sidepanelText.includes("function updateAiCoverReadiness") &&
    sidepanelText.includes("function addAiCoverKeyFromControls") &&
    sidepanelText.includes("function saveAiCoverPromptProfile") &&
    sidepanelText.includes("function activateAiCoverPromptProfile") &&
    sidepanelText.includes("function removeAiCoverPromptProfile") &&
    sidepanelText.includes("async function testAiCoverKey") &&
    sidepanelText.includes("async function generateAiCoverCandidates") &&
    sidepanelText.includes("function revealAiCoverCandidates") &&
    sidepanelText.includes("renderAiCoverCandidates({ reveal: true })") &&
    sidepanelText.includes("async function requestOpenAiCoverImages") &&
    sidepanelText.includes("async function cropAiCoverToFiveTwo") &&
    sidepanelText.includes("async function setAiCoverCandidateAsArticleCover") &&
    sidepanelText.includes('type: "xposter:set-generated-cover"'),
  "sidepanel should generate AI cover candidates and send selected images to the X cover setter"
);
assert.ok(
    sidepanelHtml.includes("AI article cover") &&
    sidepanelHtml.includes("Generate article cover") &&
    sidepanelHtml.includes("draft-cover-tool") &&
    sidepanelHtml.includes("Load Markdown or write a cover idea when ready.") &&
    sidepanelHtml.includes("ai-cover-summary-list") &&
    sidepanelHtml.includes("aiCoverApiDialog") &&
    sidepanelHtml.includes("aiCoverGeneratorDialog") &&
    sidepanelHtml.includes("aiCoverPromptProfileDialog") &&
    sidepanelHtml.includes("Image API keys") &&
    sidepanelHtml.includes('data-i18n="Platform"') &&
    sidepanelHtml.includes("Platform") &&
    !sidepanelHtml.includes("SmartCoder") &&
    sidepanelHtml.includes("Gemini") &&
    sidepanelHtml.includes("OpenAI-compatible API") &&
    sidepanelHtml.includes("OpenAI-compatible API Base URL") &&
    sidepanelHtml.includes("Cover styles") &&
    sidepanelHtml.includes("Cover idea") &&
    sidepanelHtml.includes("Cover style") &&
    sidepanelHtml.includes("Style and generation options") &&
    sidepanelHtml.includes("Only this visible text is sent as the cover idea.") &&
    sidepanelHtml.includes("data-ai-cover-open-keys") &&
    sidepanelHtml.includes("data-ai-cover-open-prompt-profiles") &&
    sidepanelHtml.includes("data-ai-cover-open-generator") &&
    sidepanelHtml.includes("ai-cover-main-actions") &&
    sidepanelHtml.includes("<details class=\"ai-cover-advanced ai-cover-field-wide\" id=\"aiCoverAdvancedOptions\">") &&
    sidepanelText.includes("setLocalizedMessageIfChanged(els.aiCoverGenerate, readiness.buttonKey, readiness.values)") &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.aiCoverGenerate, "disabled", !readiness.ready)') &&
    sidepanelText.includes('return { ready: false, state: "key", tone: "warn", messageKey: "Add an API key to start.", buttonKey: "Add key first", values: {} };') &&
    sidepanelText.includes('return { ready: false, state: "source", tone: "warn", messageKey: "Add a cover idea or selected text.", buttonKey: "Add cover idea", values: {} };') &&
    sidepanelText.includes('setDatasetValueIfChanged(els.aiCoverGeneratorDialog, "readiness", readiness.state || "idle")') &&
    sidepanelText.includes('const profile = activeAiCoverPromptProfile();') &&
    sidepanelText.includes('buttonKey: total === 1 ? "Generate {count} cover" : "Generate {count} covers"'),
  "AI cover UI should present a simple task flow, keep key management actionable, keep advanced generation settings collapsed, and disable generation until ready"
);
{
  const openGeneratorStart = sidepanelText.indexOf("  function openAiCoverGeneratorDialog()");
  const openGeneratorEnd = sidepanelText.indexOf("  function activeAiCoverPromptProfile", openGeneratorStart);
  const openGeneratorBody = sidepanelText.slice(openGeneratorStart, openGeneratorEnd);
  assert.ok(
    openGeneratorBody.includes("renderAiCoverCandidates()") &&
      !openGeneratorBody.includes("syncAiCoverPromptInputFromSelection") &&
      sidepanelText.includes('els.draftCoverTool?.addEventListener("click", handleAiCoverGeneratorOpenClick)') &&
      sidepanelText.includes('els.conversionMapList?.addEventListener("click"') &&
      sidepanelText.includes("[data-ai-cover-open-generator]"),
    "Cover row should open the generation drawer without auto-filling prompt text from the full draft"
  );
}
assert.ok(!sidepanelHtml.includes("OpenAI Key"), "AI cover UI should not label generic provider credentials as OpenAI-only keys");
assert.ok(
  sidepanelHtml.indexOf('id="aiCoverApiProvider"') < sidepanelHtml.indexOf('id="aiCoverApiBaseUrl"'),
  "AI cover key setup should ask users to choose the API platform before editing a base URL"
);
assert.ok(
  sidepanelText.includes('for (const path of [`/models/${encodeURIComponent(model)}`, "/models"])') &&
    sidepanelText.includes("response = await fetch(aiCoverApiUrl(key.baseUrl, path)") &&
    sidepanelText.includes("if (reachable) return { ok: true, verified: false") &&
    sidepanelText.includes('fetch(aiCoverApiUrl(activeKey.baseUrl, "/images/generations")') &&
    sidepanelText.includes("if (!isAllowedAiCoverApiUrl(provider.baseUrl))") &&
    sidepanelText.includes('if (!isAllowedAiCoverApiUrl(key.baseUrl || ""))') &&
    sidepanelText.includes("function isAiCoverLoopbackHost") &&
    sidepanelText.includes("function aiCoverProviderPreset") &&
    sidepanelText.includes("AI_COVER_GEMINI_DEFAULT_MODEL") &&
    sidepanelText.includes('if (activeKey.provider === "gemini") requestBody.response_format = "b64_json";') &&
    sidepanelText.includes("function syncAiCoverProviderControls") &&
    sidepanelText.includes('els.aiCoverApiProvider?.addEventListener("change"') &&
    sidepanelText.includes("Enter a compatible API Base URL.") &&
    sidepanelCss.includes(".ai-cover-credential-control") &&
    sidepanelMessagesText.includes("Choose a platform first. Custom platforms need an OpenAI-compatible /v1 endpoint.") &&
    sidepanelText.includes('data-ai-key-action="activate"') &&
    sidepanelText.includes('data-ai-key-action="test"') &&
    sidepanelText.includes('data-ai-key-action="remove"') &&
    sidepanelText.includes('return { ...normalizeAiCoverSettingsForStorage(aiCoverSettings), apiKey: "" };'),
  "AI cover settings should let users activate, test, and remove individual image API keys"
);
assert.ok(
  includesAll(sidepanelCss, [
    ".ai-cover-api-base-url[data-motion=\"provider-sync\"]",
    "animation: xposter-ai-cover-provider-sync var(--motion-medium) var(--ease-out-quint) both;",
    ".ai-cover-status[data-motion=\"status\"]",
    ".draft-cover-tool",
    "#aiCoverGeneratorDialog .ai-cover-generator-dialog",
    ".ai-cover-card",
    "animation: xposter-ai-cover-card-in var(--motion-medium) var(--ease-out-quint) both;",
    "@keyframes xposter-ai-cover-drawer-in",
    "@keyframes xposter-ai-cover-provider-sync",
    "@keyframes xposter-ai-cover-card-in",
    "prefers-reduced-motion: reduce"
  ]) &&
    includesAll(sidepanelText, [
      "function markAiCoverMotion",
      'markAiCoverMotion(els.aiCoverApiBaseUrl, "provider-sync")',
      'markAiCoverMotion(els.aiCoverStatus, "status")',
      'markAiCoverMotion(els.aiCoverApiStatus, "status")',
      'markAiCoverMotion(els.aiCoverPromptProfileStatus, "status")'
    ]),
  "AI cover motion should clarify platform URL syncing, status feedback, and generated cover arrival while respecting reduced motion"
);
assert.ok(
  contentScriptText.includes('message?.type === "xposter:set-generated-cover"') &&
    contentScriptText.includes("async function setGeneratedCover") &&
    contentScriptText.includes('runMain(payload, filePayloads, "set-cover")') &&
    contentScriptText.includes("MAIN_BRIDGE_TOKEN") &&
    contentScriptText.includes("shared.validateImagePayload(mime, bytes)") &&
    mainWorldText.includes("let bridgeToken = \"\"") &&
    mainWorldText.includes("isAuthorizedMainMessage(event.data)") &&
    mainWorldText.includes('kind === "set-cover"') &&
    mainWorldText.includes("async function runCoverOnly") &&
    mainWorldText.includes("async function uploadCoverImageForMetadata"),
  "content script should expose a validated direct generated-cover setter that uses an authorized dedicated main-world cover path"
);
{
  const promptSourceStart = sidepanelText.indexOf("  function aiCoverPromptSourceText()");
  const promptSourceEnd = sidepanelText.indexOf("  async function requestOpenAiCoverImages", promptSourceStart);
  const promptSourceBody = sidepanelText.slice(promptSourceStart, promptSourceEnd);
  const selectedSourceStart = sidepanelText.indexOf("  function selectedAiCoverSourceText()");
  const selectedSourceEnd = sidepanelText.indexOf("  function syncAiCoverPromptInputFromSelection", selectedSourceStart);
  const selectedSourceBody = sidepanelText.slice(selectedSourceStart, selectedSourceEnd);
  const runCoverOnlyStart = mainWorldText.indexOf("  async function runCoverOnly");
  const runCoverOnlyEnd = mainWorldText.indexOf("  function isVisible", runCoverOnlyStart);
  const runCoverOnlyBody = mainWorldText.slice(runCoverOnlyStart, runCoverOnlyEnd);
  assert.ok(
    promptSourceBody.includes("els.aiCoverPromptInput") &&
      !promptSourceBody.includes("inferredAiCoverSourceText") &&
      selectedSourceBody.includes("selectedDraftText()") &&
      !selectedSourceBody.includes("draftText()") &&
      runCoverOnlyBody.includes("uploadCoverImageForMetadata") &&
      !runCoverOnlyBody.includes("writeDraftBlocks"),
    "AI cover generation should use only visible source text and cover-only replacement should not write article body blocks"
  );
}
assert.ok(
  sidepanelText.includes("function validateAiCoverDataUrl") &&
    sidepanelText.includes("function validateGeneratedImageResponse") &&
    sidepanelText.includes("function fetchGeneratedImageAsDataUrl") &&
    sidepanelText.includes("shared.isRemoteHttpImageSource(url)") &&
    sidepanelText.includes("shared.validateImagePayload(mime, bytes)") &&
    sidepanelText.includes("AbortController"),
  "AI cover generation should validate provider-returned images before decoding and cropping"
);
const diagnosticsHtmlIncludesSharedFirst = () =>
  /src="src\/shared\.js"[\s\S]*src="src\/i18n\.js"[\s\S]*src="diagnostics\.js"/.test(diagnosticsHtml);
const statusHelperStart = contentScriptText.indexOf("  function normalizeText");
const statusHelperEnd = contentScriptText.indexOf("  function showStatus");
const contentMediaHelperStart = contentScriptText.indexOf("  function articleMediaUploadEstimate");
const contentMediaHelperEnd = contentScriptText.indexOf("  function mediaLimitText");
const sidepanelMediaHelperStart = sidepanelText.indexOf("  function mediaUploadEstimate");
const sidepanelMediaHelperEnd = sidepanelText.indexOf("  function mediaNoteText");
const mainMediaHelperStart = mainWorldText.indexOf("  function normalizeMediaIdValue");
const mainMediaHelperEnd = mainWorldText.indexOf("  function placeSelectionAtMarker");
const mainMarkerHelperStart = mainWorldText.indexOf("  function findMarkerLocation");
const mainMarkerHelperEnd = mainWorldText.indexOf("  function kickRender");
const originalImporterHelperStart = contentScriptText.indexOf("  function detectOriginalImporterResidue");
const originalImporterHelperEnd = contentScriptText.indexOf("  function normalizeText");
const articleRouteHelperStart = contentScriptText.indexOf("  function isArticleRoute");
const articleRouteHelperEnd = contentScriptText.indexOf("  async function collectTargetContext");
const articleExportRouteHelperStart = contentScriptText.indexOf("  function isArticleExportRoute");
const articleExportRouteHelperEnd = contentScriptText.indexOf("  function scheduleArticleExportSync");
const articleExportContainerHelperStart = contentScriptText.indexOf("  function articleExportContainer");
const articleExportContainerHelperEnd = contentScriptText.indexOf("  function articleDockInlineEnd");
const articleExportTitleHelperStart = contentScriptText.indexOf("  function detectArticleExportTitleNode");
const articleExportTitleHelperEnd = contentScriptText.indexOf("  function detectArticleExportTitle", articleExportTitleHelperStart + 1);
const editorTopActionHelperStart = contentScriptText.indexOf("  function findEditorTopActionButton");
const editorTopActionHelperEnd = contentScriptText.indexOf("  function findImportButtonAdjacentAnchor");
const statusSandbox = {
  document: { body: {}, documentElement: {} },
  getComputedStyle: () => ({ backgroundColor: "rgb(18, 26, 34)" }),
  window: { matchMedia: () => ({ matches: false }) },
  shared: {
    toTraditionalChinese: shared.toTraditionalChinese,
    importProgressForStatus: shared.importProgressForStatus
  }
};
const mediaSandbox = {
  shared: { imageSourcesMatch: shared.imageSourcesMatch },
  nearParsed: mediaNearLimitParsed,
  atParsed: mediaAtLimitParsed,
  overParsed: mediaOverLimitParsed
};
const mainMediaSandbox = {};
const mainMarkerSandbox = {};
const originalImporterSandbox = {};
const editorTopActionSandbox = {};

assert.ok(statusHelperStart >= 0 && statusHelperEnd > statusHelperStart, "status helper functions should be present");
assert.ok(
  contentMediaHelperStart >= 0 &&
    contentMediaHelperEnd > contentMediaHelperStart &&
    sidepanelMediaHelperStart >= 0 &&
    sidepanelMediaHelperEnd > sidepanelMediaHelperStart,
  "media estimate helper functions should be present"
);
assert.ok(
  mainMediaHelperStart >= 0 && mainMediaHelperEnd > mainMediaHelperStart,
  "main-world media upload helper functions should be present"
);
assert.ok(
  mainMarkerHelperStart >= 0 && mainMarkerHelperEnd > mainMarkerHelperStart,
  "main-world marker cleanup and relocation helper functions should be present"
);
assert.ok(
  originalImporterHelperStart >= 0 && originalImporterHelperEnd > originalImporterHelperStart,
  "original importer cleanup helpers should be present"
);
assert.ok(
  articleRouteHelperStart >= 0 &&
    articleRouteHelperEnd > articleRouteHelperStart &&
    articleExportRouteHelperStart >= 0 &&
    articleExportRouteHelperEnd > articleExportRouteHelperStart &&
    articleExportContainerHelperStart >= 0 &&
    articleExportContainerHelperEnd > articleExportContainerHelperStart &&
    articleExportTitleHelperStart >= 0 &&
    articleExportTitleHelperEnd > articleExportTitleHelperStart,
  "article export route helpers should be present"
);
assert.ok(
  editorTopActionHelperStart >= 0 && editorTopActionHelperEnd > editorTopActionHelperStart,
  "editor import action button helpers should be present"
);
vm.runInNewContext(
  `const state = { language: "zh" };
   const CONTENT_ZH_TEXT = new Map(Object.entries({
     "Writing article": "正在写入文章",
     "Preparing Markdown...": "正在准备 Markdown...",
     "Copy Markdown": "复制 Markdown",
     "Download Markdown": "下载 Markdown",
     "Copy MD": "复制 MD",
     "Download MD": "下载 MD",
     "Export Markdown": "导出 Markdown",
     "Article title Markdown tools": "文章标题区 Markdown 工具",
     "MD": "MD",
     "Queue Markdown drafts": "加入 Markdown 草稿队列",
     "Release to add them to the xPoster side panel.": "松开后加入 xPoster 侧边栏。"
   }));
   const CONTENT_EN_TEXT = new Map(Array.from(CONTENT_ZH_TEXT.entries()).map(([en, zh]) => [zh, en]));
   ${contentScriptText.slice(statusHelperStart, statusHelperEnd)}
   this.state = state;
   this.statusHelpers = { statusThemeFromPage, statusProgressForText, translateContentText, articleExportLabel, articleExportShortLabel };`,
  statusSandbox
);
vm.runInNewContext(
  `const ORIGINAL_IMPORTER_MARKERS = [
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
   function makeClassList(values = []) {
     const classes = new Set(values);
     return {
       contains: (className) => classes.has(className),
       remove: (className) => classes.delete(className),
       values: () => Array.from(classes)
     };
   }
   function makeNode(id) {
     return { id, removed: false, remove() { this.removed = true; } };
   }
   const legacyNodes = [
     makeNode("__xmp_import_btn__"),
     makeNode("prefix__xmp_import_btn__suffix"),
     makeNode("__xmp_vault_prompt__"),
     makeNode("__xmp_drop_hint__"),
     makeNode("__xmp_drop_hint_anim__"),
     makeNode("__xmp_import_btn_style__"),
     makeNode("__x_md_paste_banner__"),
     makeNode("__x_md_paste_offset_style__")
   ];
   const xposterNode = makeNode("__xposter_import_button__");
   const allNodes = [...legacyNodes, xposterNode];
   function matchesSelector(node, selector) {
     return selector.split(",").map((part) => part.trim()).some((part) => {
       if (/^#/.test(part)) return node.id === part.slice(1);
       if (part === "[id*='__xmp_import_btn__']") return node.id.includes("__xmp_import_btn__");
       return false;
     });
   }
   const document = {
     body: { classList: makeClassList(["__xmp_banner_visible", "__xposter_status_visible"]) },
     querySelector: (selector) => allNodes.find((node) => !node.removed && matchesSelector(node, selector)) || null,
     querySelectorAll: (selector) => allNodes.filter((node) => !node.removed && matchesSelector(node, selector))
   };
   const window = { setTimeout: (fn) => { fn(); return 1; } };
   ${contentScriptText.slice(originalImporterHelperStart, originalImporterHelperEnd)}
   this.beforeCleanup = detectOriginalImporterResidue();
   this.cleanedMarkers = cleanupOriginalImporterResidue();
   this.afterCleanup = detectOriginalImporterResidue();
   this.remainingLegacy = legacyNodes.filter((node) => !node.removed).map((node) => node.id);
   this.xposterStillPresent = !xposterNode.removed;
  this.bodyClasses = document.body.classList.values();`,
  originalImporterSandbox
);
vm.runInNewContext(
  `const IMPORT_BUTTON_ID = "__xposter_import_button__";
   const IMPORT_BUTTON_WRAP_ID = IMPORT_BUTTON_ID + "_wrap";
   const window = { innerWidth: 1280 };
   let activeButtons = [];
   function normalizeText(value) {
     return String(value || "").replace(/\\s+/g, " ").trim();
   }
   function isElementVisible(element) {
     const rect = element?.getBoundingClientRect?.() || {};
     return !element?.hidden && rect.width >= 4 && rect.height >= 4;
   }
   function makeButton({
     id = "",
     text = "",
     aria = "",
     title = "",
     rect = { top: 34, right: 1180, width: 92, height: 36 },
     background = "rgba(0, 0, 0, 0)",
     color = "rgb(15, 20, 25)"
   } = {}) {
     return {
       id,
       textContent: text,
       _style: { backgroundColor: background, color },
       getAttribute(name) {
         if (name === "aria-label") return aria;
         if (name === "title") return title;
         return "";
       },
       closest() { return null; },
       getBoundingClientRect() { return rect; }
     };
   }
   const root = {
     hidden: false,
     querySelectorAll() { return activeButtons; },
     getBoundingClientRect() { return { top: 0, right: 1280, width: 1280, height: 120 }; }
   };
   const document = {
     getElementById() { return null; },
     querySelector(selector) {
       return selector === "header[role='banner']" || selector === "header" || selector === "[role='main']" ? root : null;
     }
   };
   function getComputedStyle(element) {
     return element?._style || { backgroundColor: "rgba(0, 0, 0, 0)", color: "rgb(15, 20, 25)" };
   }
   ${contentScriptText.slice(editorTopActionHelperStart, editorTopActionHelperEnd)}
   const ambiguous = makeButton({ id: "tools", text: "Tools" });
   const publish = makeButton({ id: "publish", aria: "Publish article", rect: { top: 34, right: 1120, width: 132, height: 36 } });
   const primary = makeButton({ id: "primary", rect: { top: 34, right: 1180, width: 92, height: 36 }, background: "rgb(29, 155, 240)", color: "rgb(255, 255, 255)" });
   activeButtons = [ambiguous];
   const ambiguousOnly = findEditorTopActionButton();
   activeButtons = [ambiguous, publish];
   const preferred = findEditorTopActionButton();
   activeButtons = [primary];
   const primaryOnly = findEditorTopActionButton();
   this.editorTopActionResults = {
     ambiguousOnlyId: ambiguousOnly?.id || null,
     preferredId: preferred?.id || null,
     primaryOnlyId: primaryOnly?.id || null
   };`,
  editorTopActionSandbox
);
const articleRouteSandbox = { URL };
vm.runInNewContext(
  `const ARTICLE_EXPORT_LONGFORM_SELECTOR = "[data-testid='twitterArticleReadView']";
   let longformPresent = false;
   let location = { href: "https://x.com/home", origin: "https://x.com", pathname: "/home" };
   const document = { querySelector: () => longformPresent ? {} : null };
   function setLocation(href) {
     const parsed = new URL(href);
     location = { href, origin: parsed.origin, pathname: parsed.pathname };
   }
   ${contentScriptText.slice(articleRouteHelperStart, articleRouteHelperEnd)}
   ${contentScriptText.slice(articleExportRouteHelperStart, articleExportRouteHelperEnd)}
   setLocation("https://x.com/i/article/2061085830580785152");
   const iArticle = { id: articleExportIdFromUrl(), route: isArticleExportRoute() };
   setLocation("https://x.com/alice/status/111/article/222?ref=profile");
   const nestedArticle = { id: articleExportIdFromUrl(), route: isArticleExportRoute() };
   setLocation("https://twitter.com/alice/articles/333");
   const pluralArticle = { id: articleExportIdFromUrl(), route: isArticleExportRoute() };
   setLocation("https://x.com/alice/status/444");
   const statusArticle = { id: articleExportIdFromUrl(), route: isArticleExportRoute() };
   setLocation("https://x.com/compose/articles/edit/555");
   const composeEdit = { id: articleExportIdFromUrl(), route: isArticleExportRoute() };
   setLocation("https://x.com/compose/articles");
   const composeList = { id: articleExportIdFromUrl(), route: isArticleExportRoute() };
   setLocation("https://example.com/i/article/666");
   const nonX = articleExportPathInfo();
   setLocation("https://x.com/new-article-route/777");
   longformPresent = true;
   const longformFallback = isArticleExportRoute();
   this.articleExportRouteResults = {
     iArticle,
     nestedArticle,
     pluralArticle,
     statusArticle,
     composeEdit,
     composeList,
     nonX,
     longformFallback
   };`,
  articleRouteSandbox
);
const articleExportDomSandbox = { Node: { TEXT_NODE: 3, ELEMENT_NODE: 1 } };
vm.runInNewContext(
  `const ARTICLE_EXPORT_ID = "__xposter_article_export__";
   const ARTICLE_EXPORT_LONGFORM_SELECTOR = "[data-testid='twitterArticleReadView'],[data-testid='twitter-article-title'],[data-testid='twitterArticleRichTextView'],[data-testid='longformRichTextComponent']";
   const document = { body: { name: "body", children: [], parentElement: null } };
   function normalizeText(value) {
     return String(value || "").replace(/\\s+/g, " ").trim();
   }
   function nodeMatches(node, selector) {
     return selector.split(",").map((part) => part.trim()).some((part) => {
       if (!part) return false;
       if (part === "article" || part === "main article" || part === "section" || part === "div") return node.tagName === part.split(" ").pop().toUpperCase();
       if (part === "[data-testid='cellInnerDiv']") return node.testid === "cellInnerDiv";
       if (part === "[data-testid='twitterArticleReadView']") return node.testid === "twitterArticleReadView";
       if (part === "[data-testid='twitter-article-title']") return node.testid === "twitter-article-title";
       if (part === "[data-testid='twitterArticleRichTextView']") return node.testid === "twitterArticleRichTextView";
       if (part === "[data-testid='longformRichTextComponent']") return node.testid === "longformRichTextComponent";
       if (part === "h1" || part === "h2") return node.tagName === part.toUpperCase();
       if (part === "[role='heading']") return node.role === "heading";
       return false;
     });
   }
   function makeNode({ tag = "div", text = "", testid = "", role = "", rect = { width: 560, height: 180 }, parent = null } = {}) {
     const node = {
       tagName: tag.toUpperCase(),
       textContent: text,
       innerText: text,
       testid,
       role,
       parentElement: parent,
       children: [],
       id: "",
       matches(selector) { return nodeMatches(node, selector); },
       closest(selector) {
         for (let current = node; current; current = current.parentElement) {
           if (nodeMatches(current, selector)) return current;
         }
         return null;
       },
       querySelector(selector) {
         return node.querySelectorAll(selector)[0] || null;
       },
       querySelectorAll(selector) {
         const found = [];
         const walk = (current) => {
           for (const child of current.children) {
             if (nodeMatches(child, selector)) found.push(child);
             walk(child);
           }
         };
         walk(node);
         return found;
       },
       getBoundingClientRect() { return rect; }
     };
     if (parent) parent.children.push(node);
     return node;
   }
   function articleNodeReadableText(node) {
     return node?.innerText || node?.textContent || "";
   }
   ${contentScriptText.slice(articleExportContainerHelperStart, articleExportContainerHelperEnd)}
   ${contentScriptText.slice(articleExportTitleHelperStart, articleExportTitleHelperEnd)}
   const pageRoot = makeNode({ tag: "div", text: "Page chrome and hidden shortcuts", parent: document.body, rect: { width: 1200, height: 800 } });
   const isolatedArticleLink = makeNode({ tag: "a", text: "", parent: pageRoot, rect: { width: 36, height: 36 } });
   const hiddenHeading = makeNode({ tag: "h2", text: "To view keyboard shortcuts, press question mark", parent: pageRoot, role: "heading", rect: { width: 1, height: 1 } });
   const tweet = makeNode({ tag: "article", text: "Real article text with all longform children and metadata", parent: pageRoot, testid: "tweet", rect: { width: 598, height: 1200 } });
   const readView = makeNode({ tag: "div", text: "Readable longform body", parent: tweet, testid: "twitterArticleReadView", rect: { width: 566, height: 1000 } });
   const title = makeNode({ tag: "div", text: "Real X Article Title", parent: readView, testid: "twitter-article-title", rect: { width: 566, height: 132 } });
   const bodyHeading = makeNode({ tag: "h2", text: "Body Section", parent: readView, rect: { width: 566, height: 36 } });
   this.articleExportDomResults = {
     isolatedContainer: articleExportContainer(isolatedArticleLink),
     longformContainerIsNotPageRoot: articleExportContainer(readView) !== pageRoot,
     titleText: detectArticleExportTitleNode(tweet)?.innerText || "",
     hiddenRejected: isReadableArticleTitleNode(hiddenHeading)
   };`,
  articleExportDomSandbox
);
vm.runInNewContext(
  `const X_ARTICLE_MEDIA_SOFT_LIMIT = 25;
   const X_ARTICLE_MEDIA_HEADROOM_THRESHOLD = 21;
   const importOptions = {};
   ${contentScriptText.slice(contentMediaHelperStart, contentMediaHelperEnd)}
   const contentNear = articleMediaUploadEstimate(nearParsed);
   const contentAt = articleMediaUploadEstimate(atParsed);
   const contentOver = articleMediaUploadEstimate(overParsed);
   ${sidepanelText.slice(sidepanelMediaHelperStart, sidepanelMediaHelperEnd)}
   const sidepanelNear = mediaUploadEstimate(nearParsed);
   const sidepanelAt = mediaUploadEstimate(atParsed);
   const sidepanelOver = mediaUploadEstimate(overParsed);
   this.mediaEstimates = { contentNear, contentAt, contentOver, sidepanelNear, sidepanelAt, sidepanelOver };`,
  mediaSandbox
);
vm.runInNewContext(
  `${mainWorldText.slice(mainMediaHelperStart, mainMediaHelperEnd)}
   function fakeBlock(entityKey) {
     return {
       getType: () => "atomic",
       findEntityRanges: (filter, callback) => callback(0),
       getCharacterList: () => ({ get: () => ({ getEntity: () => entityKey }) })
     };
   }
   function fakeContentState(data, entityKey = "entity-1") {
     return {
       getBlockMap: () => new Map([["block-1", fakeBlock(entityKey)]]),
       getEntity: () => ({ getType: () => "MEDIA", getData: () => data })
     };
   }
   function fakeContentStateFromEntities(entries) {
     const entityData = new Map(entries.map((entry) => [entry.entityKey, entry.data]));
     return {
       getBlockMap: () => new Map(entries.map((entry) => [entry.blockKey, fakeBlock(entry.entityKey)])),
       getEntity: (entityKey) => ({ getType: () => "MEDIA", getData: () => entityData.get(entityKey) })
     };
   }
   this.pendingUpload = findNewMediaUpload(fakeContentState({ mediaItems: [{}] }), new Set());
   this.completeUpload = findNewMediaUpload(fakeContentState({ mediaItems: [{ mediaId: "1234567890" }] }), new Set());
   this.snakeCaseUpload = findNewMediaUpload(fakeContentState({ media_items: [{ media_id: "0987654321" }] }), new Set());
   this.nestedMediaKeyUpload = findNewMediaUpload(fakeContentState({ uploadResult: { media_key: "3_1122334455" } }), new Set());
   this.restIdUpload = findNewMediaUpload(fakeContentState({ result: { rest_id: "9988776655" } }), new Set());
   this.existingUpload = findNewMediaUpload(fakeContentState({ mediaItems: [{ mediaId: "1234567890" }] }), new Set(["entity-1"]));
   this.ignoredCompleteUpload = findNewMediaUpload(fakeContentStateFromEntities([
     { blockKey: "old-block", entityKey: "old-entity", data: { mediaId: "1111111111" } },
     { blockKey: "new-block", entityKey: "new-entity", data: { mediaItems: [{}] } }
   ]), new Set(), new Set(["old-block"]));
   this.ignoredOnlyUpload = findNewMediaUpload(fakeContentStateFromEntities([
     { blockKey: "old-block", entityKey: "old-entity", data: { mediaId: "1111111111" } }
   ]), new Set(), new Set(["old-block"]));
   const cyclic = { state: "pending" };
   cyclic.self = cyclic;
   this.pendingSignature = mediaEntityDataSignature({ mediaItems: [{}], phase: "pending" });
   this.readySignature = mediaEntityDataSignature({ mediaItems: [{ processing: "ready" }], phase: "ready" });
   this.cyclicSignature = mediaEntityDataSignature(cyclic);
   const refreshUpload = { blockKey: "pending-block", entityKey: "pending-entity", mediaId: null };
   refreshUploadMediaId({
     props: {
       editorState: {
         getCurrentContent: () => fakeContentStateFromEntities([
           { blockKey: "pending-block", entityKey: "pending-entity", data: { uploadResult: { media_key: "3_2233445566" } } }
         ])
       }
     }
   }, refreshUpload);
   this.refreshedUpload = refreshUpload;`,
  mainMediaSandbox
);
vm.runInNewContext(
  `${mainWorldText.slice(mainMarkerHelperStart, mainMarkerHelperEnd)}
   class FakeCharacter {
     set() { return this; }
     getEntity() { return this.entity || null; }
     static create() { return new FakeCharacter(); }
   }
   function fakeCharacterList(entityKey = null) {
     const character = new FakeCharacter();
     character.entity = entityKey;
     return {
       get: () => character,
       clear: () => ({ concat: (items) => items }),
       first: () => character
     };
   }
   function fakeBlock(key, type, text, entityKey = null) {
     return {
       key,
       type,
       text,
       entityKey,
       getKey: () => key,
       getType: () => type,
       getText: () => text,
       getCharacterList: () => fakeCharacterList(entityKey),
       findEntityRanges: (filter, callback) => {
         const character = fakeCharacterList(entityKey).get(0);
         if (entityKey && filter(character)) callback(0);
       },
       merge: (data) => fakeBlock(data.key || key, data.type || type, Object.hasOwn(data, "text") ? data.text : text, entityKey)
     };
   }
   function fakeBlockMap(entries) {
     const pairs = entries.slice();
     return {
       constructor: () => fakeBlockMap([]),
       forEach: (callback) => pairs.forEach(([key, block]) => callback(block, key)),
       get: (key) => pairs.find(([candidate]) => candidate === key)?.[1] || null,
       has: (key) => pairs.some(([candidate]) => candidate === key),
       set: (key, block) => {
         const foundIndex = pairs.findIndex(([candidate]) => candidate === key);
         const next = pairs.slice();
         if (foundIndex >= 0) next[foundIndex] = [key, block];
         else next.push([key, block]);
         return fakeBlockMap(next);
       },
       delete: (key) => fakeBlockMap(pairs.filter(([candidate]) => candidate !== key)),
       last: () => pairs[pairs.length - 1]?.[1] || null,
       keys: () => pairs.map(([key]) => key),
       texts: () => Object.fromEntries(pairs.map(([key, block]) => [key, block.getText()]))
     };
   }
   class FakeSelectionState {
     static createEmpty(key) { return { key }; }
   }
   class FakeEditorState {
     constructor(content) {
       this.content = content;
       this.selection = new FakeSelectionState();
     }
     getCurrentContent() { return this.content; }
     getSelection() { return this.selection; }
     static push(editorState, content) { return new FakeEditorState(content); }
     static moveSelectionToEnd(editorState) { return editorState; }
     static forceSelection(editorState) { return editorState; }
   }
   function fakeContentState(blockMap) {
     return {
       blockMap,
       getBlockMap: () => blockMap,
       getEntity: () => ({ getType: () => "MEDIA", getData: () => ({ mediaItems: [{ mediaId: "123" }] }) }),
       set: (key, value) => key === "blockMap" ? fakeContentState(value) : fakeContentState(blockMap)
     };
   }
   function fakeDraft(entries) {
     const draft = {
       props: {
         editorState: new FakeEditorState(fakeContentState(fakeBlockMap(entries))),
         onChange: (editorState) => {
           draft.props.editorState = editorState;
         }
       }
     };
     return draft;
   }
   const embeddedMarker = "__XPOSTER_newaa_IMAGE_1__";
   const markerContent = fakeContentState(fakeBlockMap([
     ["a", fakeBlock("a", "unstyled", "Intro " + embeddedMarker + " outro")]
   ]));
   this.embeddedLocation = findMarkerLocation(markerContent, embeddedMarker);
   const cleanupDraft = fakeDraft([
     ["a", fakeBlock("a", "unstyled", "Before __XPOSTER_crnnj_IMAGE_1__ after")],
     ["b", fakeBlock("b", "unstyled", "__XPOSTER_crnnj_IMAGE_2__")],
     ["c", fakeBlock("c", "unstyled", "Keep")]
   ]);
   this.cleanedCount = cleanupMarkers(cleanupDraft, "__XPOSTER_newaa_");
   const cleanedMap = cleanupDraft.props.editorState.getCurrentContent().getBlockMap();
   this.cleanedKeys = cleanedMap.keys();
   this.cleanedTexts = cleanedMap.texts();
   const exactRelocateDraft = fakeDraft([
     ["p1", fakeBlock("p1", "unstyled", "Intro")],
     ["marker", fakeBlock("marker", "unstyled", embeddedMarker)],
     ["p2", fakeBlock("p2", "unstyled", "Outro")],
     ["img", fakeBlock("img", "atomic", " ", "entity-img")]
   ]);
   this.exactRelocateResult = relocateImages(exactRelocateDraft, [{
     marker: embeddedMarker,
     markerBlock: "marker",
     markerExact: true,
     entityKey: "entity-img"
   }], new Set());
   this.exactRelocateKeys = exactRelocateDraft.props.editorState.getCurrentContent().getBlockMap().keys();
   const embeddedRelocateDraft = fakeDraft([
     ["p1", fakeBlock("p1", "unstyled", "Intro")],
     ["marker", fakeBlock("marker", "unstyled", "Text before " + embeddedMarker + " text after")],
     ["p2", fakeBlock("p2", "unstyled", "Outro")],
     ["img", fakeBlock("img", "atomic", " ", "entity-img")]
   ]);
   this.embeddedRelocateResult = relocateImages(embeddedRelocateDraft, [{
     marker: embeddedMarker,
     markerBlock: "marker",
     markerExact: false,
     entityKey: "entity-img"
   }], new Set());
   const embeddedRelocateMap = embeddedRelocateDraft.props.editorState.getCurrentContent().getBlockMap();
   this.embeddedRelocateKeys = embeddedRelocateMap.keys();
   this.embeddedRelocateTexts = embeddedRelocateMap.texts();
   const pendingRelocateDraft = fakeDraft([
     ["p1", fakeBlock("p1", "unstyled", "Intro")],
     ["marker", fakeBlock("marker", "unstyled", embeddedMarker)],
     ["p2", fakeBlock("p2", "unstyled", "Outro")],
     ["pending-img", fakeBlock("pending-img", "atomic", " ", "pending-entity")],
     ["other-img", fakeBlock("other-img", "atomic", " ", "other-entity")]
   ]);
   this.pendingRelocateResult = relocateImages(pendingRelocateDraft, [{
     marker: embeddedMarker,
     blockKey: "pending-img",
     markerBlock: "marker",
     markerExact: true,
     entityKey: null
   }], new Set());
   this.pendingRelocateKeys = pendingRelocateDraft.props.editorState.getCurrentContent().getBlockMap().keys();`,
  mainMarkerSandbox
);

assert.equal(parsed.title, "xPoster live smoke test", "frontmatter title should parse");
assert.ok(parsed.cover, "cover should parse");
assert.equal(h1TitleDisabledParsed.title, null, "title setting can disable title extraction");
assert.equal(
  h1TitleDisabledParsed.segments[0]?.kind,
  "header-one",
  "disabled title extraction should keep the first H1 in the body"
);
assert.equal(fileTitleParsed.title, "Campaign Notes", "named Markdown files should provide a fallback article title");
assert.equal(fileTitleParsed.titleFromCandidate, true, "filename fallback titles should be marked as candidates");
assert.equal(fileTitleParsed.titleSource, "candidate", "filename fallback titles should expose their source");
assert.equal(fileTitlePathParsed.title, "Product Plan", "filename title fallback should strip paths, queries, and Markdown extensions");
assert.equal(explicitTitleCandidateParsed.title, "Manual Candidate", "explicit title candidates should beat filename candidates");
assert.equal(frontmatterTitleBeatsFileParsed.title, "Meta Title", "frontmatter titles should beat filename candidates");
assert.equal(frontmatterTitleBeatsFileParsed.titleFromMeta, true, "frontmatter title source should be preserved");
assert.equal(metadataOnlyParsed.segments.length, 0, "metadata-only frontmatter should not become visible article body");
assert.deepEqual(
  metadataOnlyParsed.meta,
  { tags: "", create: "2026-06-01", update: "2026-06-06" },
  "empty and date-like frontmatter fields should be preserved as metadata"
);
assert.equal(shared.stripMarkdownFrontmatter(metadataOnlyDraft), "", "frontmatter-only Markdown should strip to an empty body");
assert.equal(spacedFrontmatterParsed.title, "Spaced Meta", "frontmatter parsing should tolerate BOM, leading blank lines, and spaced fences");
assert.equal(spacedFrontmatterParsed.segments[0]?.text, "Body after metadata.", "spaced frontmatter should be removed before body parsing");
assert.equal(headingTitleBeatsFileParsed.title, "Heading Title", "first H1 should beat filename candidates");
assert.equal(headingTitleBeatsFileParsed.titleSource, "heading", "heading title source should be preserved");
assert.equal(disabledFileTitleParsed.title, null, "disabled title extraction should not use filename candidates");
assert.equal(coverDisabledParsed.cover, null, "cover setting can disable cover extraction");
assert.equal(
  coverDisabledParsed.segments.filter((segment) => segment.type === "image").length,
  1,
  "disabled cover extraction should keep image blocks in the body"
);
assert.equal(smartPunctuationOffParsed.segments[0]?.text, "这是测试,对吧.", "smart punctuation should be off by default when disabled");
assert.equal(smartPunctuationParsed.title, "标题，好吗？", "smart punctuation should normalize H1-derived titles");
assert.equal(
  smartPunctuationParagraph?.text,
  "他说“对”。 产品、渠道、服务 —— 继续…… Node.js 3.14 12:30 1,000",
  "smart punctuation should normalize Chinese-context prose while preserving version, decimal, time, and thousands punctuation"
);
assert.equal(smartPunctuationLink?.text, "链接，测试", "smart punctuation should normalize Markdown link display text");
assert.deepEqual(
  smartPunctuationLink?.links?.[0],
  { offset: 0, length: "链接，测试".length, url: "https://example.test/a,b?q=1,2" },
  "smart punctuation should preserve Markdown link URLs and link offsets"
);
assert.equal(smartPunctuationImage?.source, "https://images.example.test/a,b.png", "smart punctuation should not alter image sources");
assert.equal(smartPunctuationTable?.rows?.[0]?.[0], "单元格，好吗？", "smart punctuation should normalize visible table cells");
assert.equal(
  smartPunctuationCode?.code,
  "const 文案 = \"这是测试,对吧.\";\nfn(a, b);",
  "smart punctuation should not alter fenced code blocks"
);
assert.ok(
  smartPunctuationInline?.text.includes('const 文案 = "这是测试,对吧."; fn(a, b)'),
  "smart punctuation should not alter inline code text"
);
assert.ok(
  smartPunctuationInline?.text.endsWith("结束，好吗？"),
  "smart punctuation should still normalize prose around inline code"
);
assert.equal(
  smartPunctuationMixedParsed.segments[0]?.text,
  "版本 React 18.2, 比例 16:9. 英文句子, with Chinese 中文, maybe risky. 函数 fn(a, b) 的返回值是 true, 对吗？",
  "smart punctuation should preserve mixed English technical punctuation while still normalizing Chinese sentence endings"
);
assert.equal(
  smartPunctuationTableInlineCodeParsed.segments[0]?.rows?.[0]?.[0],
  "`文案,对吗?`",
  "smart punctuation should not alter inline code inside Markdown table cells"
);
assert.deepEqual(
  smartPunctuationTildeCodeParsed.segments[0],
  { type: "code", language: "js", code: "const 文案 = \"这是测试,对吧.\";\nfn(a, b);" },
  "smart punctuation should not alter tilde fenced code blocks"
);
assert.deepEqual(
  smartPunctuationIndentedCodeParsed.segments.find((segment) => segment.type === "code"),
  { type: "code", language: "", code: "const 文案 = \"这是测试,对吧.\";\nfn(a, b);" },
  "smart punctuation should not alter indented Markdown code blocks"
);
assert.equal(smartPunctuationBoundaryBold?.text, "中文，好吗？", "smart punctuation should normalize punctuation across bold boundaries");
assert.equal(smartPunctuationBoundaryBold?.inlineStyleRanges?.[0]?.offset, 3, "bold offset should follow normalized punctuation");
assert.equal(smartPunctuationBoundaryLink?.text, "中文，好吗？", "smart punctuation should normalize punctuation after link labels");
assert.deepEqual(
  smartPunctuationBoundaryLink?.links?.[0],
  { offset: 0, length: 2, url: "https://example.test" },
  "link offsets should survive full-line smart punctuation"
);
assert.equal(smartPunctuationBoundaryList?.text, "产品、渠道、服务", "smart punctuation should normalize list punctuation across styled text");
assert.ok(counts.image >= 1, "fixture should include an image");
assert.ok(counts.table >= 1, "fixture should include a table");
assert.ok(counts.tweet >= 1, "fixture should include a tweet");
assert.ok(counts.code >= 1, "fixture should include a code block");
assert.ok(counts.divider >= 1, "fixture should include a divider");
assert.ok(plan.html.includes("__XPOSTER_"), "paste plan should include replacement markers");
{
  const tableOperation = plan.plan.find((item) => item.marker.includes("_TABLE_"));
  assert.equal(tableOperation?.op?.type, "atomic", "Markdown tables should use X Markdown atomic blocks by default");
  assert.equal(tableOperation?.op?.entityType, "MARKDOWN", "Markdown tables should use X's MARKDOWN entity");
  assert.equal(tableOperation?.op?.table, true, "table operations should be marked for table-specific UI copy");
  assert.ok(tableOperation?.op?.fallbackText?.includes("|"), "table operations should keep Markdown fallback text");
  assert.equal(
    plan.plan.some((item) => item.marker.includes("_TABLE_") && item.op.type === "image"),
    false,
    "Markdown tables should not be rendered as uploaded table images by default"
  );
}
assert.ok(
  remoteFallbackPlan.plain.includes("![remote cover](https://images.example.test/path/cover.png)"),
  "failed remote images should remain as Markdown image links"
);
assert.ok(
  !remoteFallbackPlan.plain.includes("Chrome permission required"),
  "failed remote image fallback should not write internal permission errors into the article"
);
assert.equal(shared.isRemoteHttpImageSource("https://images.example.test/a.png"), true, "public web images should be treated as remote images");
assert.equal(shared.isRemoteHttpImageSource("http://127.0.0.1/a.png"), false, "loopback image URLs should not be downloaded");
assert.equal(shared.isRemoteHttpImageSource("http://192.168.1.8/a.png"), false, "private network image URLs should not be downloaded");
assert.equal(shared.isRemoteHttpImageSource("http://169.254.169.254/meta.png"), false, "link-local metadata URLs should not be downloaded");
assert.equal(shared.isRemoteHttpImageSource("http://224.0.0.1/a.png"), false, "multicast or reserved image URLs should not be downloaded");
assert.equal(shared.isRemoteHttpImageSource("http://[::ffff:127.0.0.1]/a.png"), false, "IPv4-mapped loopback image URLs should not be downloaded");
assert.equal(shared.isRemoteHttpImageSource("http://[::ffff:8.8.8.8]/a.png"), true, "public IPv4-mapped image URLs should remain valid");
assert.deepEqual(
  localImageCandidatePaths("./images/photo.png", "images"),
  ["images/photo.png", "photo.png"],
  "local image lookup should also try paths relative to a selected folder with the same name as the Markdown directory"
);
assert.deepEqual(
  localImageCandidatePaths("./assets/images/photo.png", "images"),
  ["assets/images/photo.png", "photo.png"],
  "local image lookup should also handle dragging a nested image folder named in the Markdown path"
);
assert.deepEqual(
  localImageCandidatePaths("./images/photo.png?size=large#cover", "assets"),
  ["images/photo.png"],
  "local image lookup should keep the original relative path when the selected folder name does not match"
);
assert.deepEqual(
  localImageCandidatePaths("../photo.png", "images"),
  [],
  "local image lookup should not allow paths that escape the selected folder"
);
assert.equal(shared.parseDataUri("data:text/html;base64,PGgxPk5vdCBhbiBpbWFnZTwvaDE+").ok, false, "data URI images should reject non-image MIME types");
assert.equal(shared.parseDataUri(`data:image/png;base64,${"A".repeat(24 * 1024 * 1024)}`).ok, false, "oversized data URI images should be rejected");
assert.ok(
  contentScriptText.includes('showStatus(formatCompletionMessage(summary), "done", 7000)'),
  "successful Markdown writes should finish with a done status even when images stay as links"
);
assert.ok(
    contentScriptText.includes("statusTimer: 0") &&
    contentScriptText.includes("window.clearTimeout(state.statusTimer);") &&
    contentScriptText.includes("if (state.statusTimer !== timer) return;") &&
    contentScriptText.includes("state.statusTimer = timer;") &&
    sidepanelText.includes('latestProgress.state !== "complete" && latestProgress.state !== "error" && latestProgress.state !== "cancelled"'),
  "content-script status timers and sidepanel idle events should not hide active or terminal import progress"
);
assert.ok(
  contentScriptText.includes('collectMediaFailures(new Map([[coverSegment, coverResult]]), "cover")') &&
    contentScriptText.includes("function mediaUploadFailureCounts") &&
    contentScriptText.includes('parts.push(`${skippedImages} body image(s) stayed as Markdown links`)') &&
    contentScriptText.includes('parts.push(`${skippedTables} table image(s) stayed as Markdown tables`)') &&
    contentScriptText.includes('parts.push(`${skippedCovers} cover image(s) could not be applied`)') &&
    contentScriptText.includes("function coverApplicationFailureCount") &&
    contentScriptText.includes("counts.image += unclassified;") &&
    mainWorldText.includes("function imageOperationKind") &&
    mainWorldText.includes("kind: imageOperationKind(op)") &&
    sidepanelText.includes("function mediaUploadFailureCounts") &&
    sidepanelText.includes("function coverApplicationFailureCount") &&
    sidepanelText.includes('parts.push(`${keptImages} body image(s) stayed as Markdown links`)') &&
    sidepanelText.includes('parts.push(`${keptTables} table image(s) stayed as Markdown tables`)') &&
    sidepanelText.includes('parts.push(`${missedCovers} cover image(s) could not be applied`)') &&
    sidepanelText.includes('bodyImageWarnings ? `${bodyImageWarnings} body kept`') &&
    sidepanelText.includes('tableImageWarnings ? `${tableImageWarnings} table kept`') &&
    sidepanelText.includes('coverImageWarnings ? `${coverImageWarnings} cover missed`') &&
    sidepanelText.includes('const label = item.op.coverOnly ? "Cover image" : "Image";') &&
    sidepanelText.includes('const entity = item.op.table ? "Markdown table"') &&
    sidepanelText.includes('body image(s) kept as Markdown links') &&
    sidepanelText.includes('cover image(s) not applied'),
  "image failure summaries should distinguish body images, legacy rendered table fallbacks, cover image application, and legacy unclassified upload failures"
);
assert.ok(
  contentScriptText.includes('"Local image folder": "本地图片文件夹"') &&
    contentScriptText.includes('"Choose folder": "选择文件夹"') &&
    contentScriptText.includes("function firstLocalImageFolderHintForSegments") &&
    contentScriptText.includes("promptVaultSelection({ count, hint: firstLocalImageFolderHintForSegments(segments) })") &&
    contentScriptText.includes("[/^(\\d+) local image\\(s\\) use relative paths\\. Select the folder that contains (.+)\\.$/, \"$1 张本地图片使用相对路径。请选择包含 $2 的文件夹。\"]") &&
    contentScriptText.includes("[/^(\\d+) local image\\(s\\) need a root folder\\.$/, \"$1 张本地图片需要选择根文件夹。\"]") &&
    contentScriptText.includes("const title = translateContentText(\"Local image folder\")") &&
    contentScriptText.includes('const helpPath = hint || "img"') &&
    contentScriptText.includes("const chooseLabel = translateContentText(\"Choose folder\")"),
  "X-page local image folder prompt should not leak English in Chinese mode"
);
assert.ok(
  contentScriptText.includes("safeRuntimeSendMessage") &&
    contentScriptText.includes("Extension context invalidated. Reload the X Article tab after updating xPoster.") &&
    contentScriptText.includes("const sendMessage = chrome.runtime?.sendMessage?.bind(chrome.runtime);") &&
    !contentScriptText.includes("chrome.runtime\n      .sendMessage"),
  "content script runtime messages should not throw uncaught errors after extension reloads"
);
assert.ok(
  includesAll(contentScriptText, [
    "function titleCandidateOptions",
    "smartPunctuation: options.smartPunctuation === true",
    "options.titleCandidate || options.fallbackTitle || options.sourceTitle",
    "sourceFileName: pending?.fileName || sourceFileName",
    "sourceFileName: stored?.fileName || sourceFileName",
    "preflightArticleMediaLimit(text, importOptions)",
    "preflightArticleMediaLimit(pending.markdown, importOptions)",
    "const IMPORT_OPTIONS_STORAGE_KEY = \"xposter_import_options\";",
    "async function pageImportOptions",
    "return importMarkdown(text, origin, await pageImportOptions({ sourceFileName: file.name || \"\" }))",
    "await pageImportOptions({ sourceFileName: pendingSourceFileName })",
    "const parsed = shared.parseMarkdown(markdown || \"\", { sourceFileName: fallback });"
  ]),
  "content script should preserve source filenames through direct Markdown file imports, pending navigation, preflight, and side-panel queue titles"
);
assert.ok(
  includesAll(contentScriptText, [
    "function syncImportButton",
    "function findImportButtonAnchor",
    "function findEditorImportButtonActionAnchor",
    "function findEditorTopActionButton",
    "function isPrimaryActionLike",
    "function findImportButtonAdjacentAnchor",
    "function importButtonAdjacentPosition",
    "function isEmptyStateCreateButton",
    "function confirmArticleImportOverwrite",
    "function showImportOverwriteConfirm",
    "function positionImportConfirmPanel",
    "function articleDraftHasMeaningfulContent",
    "function syncImportButtonCopy",
    "function shouldScheduleImportButtonSync",
    "new MutationObserver((mutations) => {",
    "if (shouldScheduleImportButtonSync(mutations)) mount();",
    "setDatasetValueIfChanged(wrap, \"route\", isEditorRoute() ? \"editor\" : \"list\")",
    "button.addEventListener(\"click\", () => chooseMarkdownFile(\"button\"));",
    "const IMPORT_CONFIRM_ID = \"__xposter_import_confirm__\";",
    "Replace current draft?",
    "Continue import",
    "\"Import Markdown\": \"导入 Markdown\"",
    "\"Import Markdown with xPoster\": \"用 xPoster 导入 Markdown\"",
    "placement: \"editor-action\"",
    "\"publish article\"",
    "data-placement=\"button-adjacent\"",
    "--__xposter-import-anchor-left",
    "--__xposter-import-anchor-top",
    "const IMPORT_BUTTON_ADJACENT_HEIGHT_PX = 52;",
    "min-height: 52px;",
    "background: color-mix(in oklch, var(--__xposter-import-button-signal), transparent 90%);",
    "color: var(--__xposter-import-button-signal-text);",
    "__xposter_import_fallback",
    "#${IMPORT_CONFIRM_ID}",
    "window.addEventListener(\"resize\", mount, { passive: true });",
    "window.addEventListener(\"scroll\", () => {",
    "const confirmPanel = document.getElementById(IMPORT_CONFIRM_ID);",
    "positionImportConfirmPanel(confirmPanel);",
    "document.getElementById(IMPORT_BUTTON_WRAP_ID)?.dataset.placement === \"button-adjacent\"",
    "if (!preferred && !primaryScore) continue;",
    "@media (max-width: 520px)",
    "input.accept = \".md,.markdown,.mdown,.mkd,.txt,text/markdown,text/plain\";"
  ]) &&
    excludesAll(contentScriptText, [
      "if (!isArticleRoute() || isEditorRoute())",
      "if (document.getElementById(IMPORT_BUTTON_ID)) return;",
      "new MutationObserver(mount).observe(document.body",
      "window.confirm("
    ]),
  "X Articles import button should sit beside the empty-state Write action when available, with localized copy, fallback placement, and overwrite confirmation"
);
assert.equal(
  editorTopActionSandbox.editorTopActionResults.ambiguousOnlyId,
  null,
  "editor import button anchor should ignore arbitrary top-right controls"
);
assert.equal(
  editorTopActionSandbox.editorTopActionResults.preferredId,
  "publish",
  "editor import button anchor should accept preferred publish labels"
);
assert.equal(
  editorTopActionSandbox.editorTopActionResults.primaryOnlyId,
  "primary",
  "editor import button anchor should accept primary action styling"
);
assert.ok(
  includesAll(sidepanelText, [
    "let activeDraftSourceFileName = \"\";",
    "function activeWriteSourceFileName",
    "activeDraftSourceFileName = normalizeSourceFileName(fileName);",
    "activeDraftSourceFileName = normalizeSourceFileName(item.fileName);",
    "sourceFileName: activeWriteSourceFileName()",
    "sourceFileName: writeSourceFileName",
    "return importMarkdownDraft(draftText(), { sourceFileName: activeDraftSourceFileName });",
    "sourceFileName: item.fileName",
    "smartPunctuation: options.smartPunctuation === true",
    "smartPunctuation: els.smartPunctuationOption?.checked === true",
    "function titleLedgerDetail",
    "parsed?.titleFromCandidate",
    "File name will be used as article title",
    "Title will use file name"
  ]),
  "side panel should preserve source filenames through draft analysis, queue writes, actual write options, and title review copy"
);
assert.ok(
  contentScriptText.includes("uploadDroppedImageUrl"),
  "content script should keep the explicit image insertion path available"
);
assert.ok(
  contentScriptText.includes('data-slot="image"'),
  "drop hint should expose an image drop mode"
);
assert.ok(
  includesAll(contentScriptText, [
    "function dropSurfaceRect(intent",
    "function updateDropHintSurface(hint, intent",
    "--xposter-drop-surface-left",
    "--xposter-drop-surface-width",
    'data-surface="page-dock"',
    "function pageDropDockSurfaceRect",
    "function articleBodyDropDockRect",
    "width: window.innerWidth",
    "height = Math.min(112, Math.max(84, Math.round(window.innerHeight * 0.11)))",
    "height = Math.min(76, Math.max(54, Math.round(window.innerHeight * 0.07)))",
    "function dropHintSurfaceKind",
    'if (intent === "article") return "page-dock";',
    'if (intent === "folder") return "page-dock";',
    "Drop image folder here",
    "Release to connect this folder for local images.",
    "Drop the folder into the highlighted folder area.",
    "Connecting image folder...",
    "Preparing local image access.",
    "directoryItem && !isDropEventOverSurface(event, \"folder\")",
    "findDirectoryTransferItem(dataTransfer) && isEditorRoute() && findEditor()",
    "function xPosterDropColorVariables",
    "${xPosterDropColorVariables(\"light\")}",
    "height: var(--xposter-drop-surface-height, 96px)",
    "border: 1px solid color-mix(in oklch, var(--xposter-drop-signal), transparent 68%)",
    "border: 1px dashed color-mix(in oklch, var(--xposter-drop-signal), transparent 60%)",
    "--xposter-drop-paper-solid",
    "--xposter-drop-tint",
    "linear-gradient(180deg, var(--xposter-drop-paper), var(--xposter-drop-tint))",
    '[data-mode="markdown"][data-surface="page-dock"]::before',
    '[data-mode="folder"][data-surface="page-dock"]::before',
    '[data-mode="folder"][data-surface="page-dock"]::after',
    '[data-mode="folder"][data-surface="page-dock"] .__xposter_drop_frame',
    '[data-mode="folder"][data-surface="page-dock"] strong',
    '[data-mode="folder"][data-surface="page-dock"] p',
    '[data-mode="folder"][data-surface="page-dock"] .__xposter_drop_mark',
    "__xposter_folder_drop_hint",
    "__xposter_drop_dock_receive",
    "__xposter_drop_dock_breathe",
    '[data-surface="page-dock"][data-state="ready"]::before',
    '[data-surface="page-dock"][data-state="ready"]::after',
    "transform-origin: 50% 50%",
    "transform-box: border-box",
    "will-change: transform, box-shadow, opacity",
    "__xposter_drop_dock_breathe 2.2s ease-in-out infinite",
    "__xposter_drop_dock_receive 2.2s ease-in-out infinite",
    "transform: scale(1.001, 1.006)",
    "transform: scale(1.002, 1.008)",
    "transform: translateY(-1px) scale(1.08)",
    "color: color-mix(in oklch, var(--xposter-drop-signal), var(--xposter-drop-ink) 66%);",
    ".__xposter_drop_status",
    "function dropHintStatusLabel",
    "grid-template-columns: 30px minmax(0, 1fr) auto;",
    '[data-mode="markdown"][data-surface="page-dock"] strong',
    '[data-mode="markdown"][data-surface="page-dock"] p',
    "__xposter_drop_mark_hint",
    '[data-mode="markdown"][data-state="ready"] .__xposter_drop_mark',
    "Open X Article draft",
    "Write to this X Article",
    "Release in the bottom bar to write this Markdown here.",
    "xPoster page drop target",
    "function requestContentFrame",
    "function scheduleDropHint",
    "scheduleDropHint(event.dataTransfer, intent, dropHintMode(event.dataTransfer, intent))",
    "showDropHint(state.dropHintDataTransfer, null, state.dropHintIntent, state.dropHintMode)",
    "function cancelScheduledDropHint",
    "cancelScheduledDropHint();",
    "function scheduleVisibleDropHintSurfaceUpdate",
    "window.addEventListener(\"resize\", scheduleVisibleDropHintSurfaceUpdate",
    "window.addEventListener(\"scroll\", scheduleVisibleDropHintSurfaceUpdate",
    "function setDropHintProcessing",
    "setDatasetValueIfChanged(hint, \"intent\", intent)",
    "setDatasetValueIfChanged(hint, \"state\", \"ready\")",
    "setDatasetValueIfChanged(hint, \"state\", \"processing\")",
    "setAttributeValueIfChanged(hint, \"aria-label\", translateContentText(\"xPoster page drop target\"))",
    "setTextContentIfChanged(title, translateContentText(copy.title))",
    "setTextContentIfChanged(detail, translateContentText(copy.detail))",
    "setTextContentIfChanged(status, translateContentText(dropHintStatusLabel(mode, intent)))",
    "setStylePropertyIfChanged(hint, \"--xposter-drop-surface-left\"",
    "updateVisibleDropHintCopy",
    'translateContentText("xPoster page drop target")',
    "function isDropEventOverSurface(event, intent",
    "function dropIntentForTransfer",
    "function sidePanelMarkdownDropIntent",
    "function isExplicitImageInsertDrop",
    "function hasImageDropPayload",
    "function articleBodyHasFocus",
    'event.dataTransfer.dropEffect = "copy"'
  ]) &&
    excludesAll(contentScriptText, [
      "__xposter_drop_text_focus",
      "__xposter_drop_rail",
      "color: #ffffff;",
      "Drop the folder into the blue folder area.",
      "linear-gradient(180deg, rgba(248, 252, 255, 0.96), rgba(232, 246, 255, 0.93))",
      "linear-gradient(90deg, var(--xposter-drop-signal-text), var(--xposter-drop-signal) 52%, #0f7acb)",
      "hint.dataset.intent = intent",
      "hint.dataset.mode = mode",
      "hint.dataset.state = \"ready\"",
      "hint.dataset.state = \"processing\"",
      "hint.dataset.surface =",
      "title.textContent = translateContentText(copy.title)",
      "detail.textContent = translateContentText(copy.detail)",
      "status.textContent = translateContentText(dropHintStatusLabel(mode, intent))",
      "hint.style.setProperty(\"--xposter-drop-surface-left\"",
      "const title = hint.querySelector(\"strong\");",
      "const detail = hint.querySelector(\"p\");",
      "const status = hint.querySelector(\".__xposter_drop_status\");",
      "window.addEventListener(\"scroll\", updateVisibleDropHintSurface"
    ]),
  "X page drag feedback should use a compact light-blue bottom dock with blue outline, explicit folder drop copy, and reduced motion coverage"
);
assert.ok(
  contentScriptText.includes("if (!event?.altKey) return false;") &&
    contentScriptText.includes('if (isExplicitImageInsertDrop(dataTransfer, event)) return "image";') &&
    contentScriptText.includes('if (isDirectoryDrop(dataTransfer, event)) return "folder";') &&
    contentScriptText.includes('if (isSingleMarkdownDrop(dataTransfer)) return "article";') &&
    contentScriptText.includes("if (!articleBodyHasFocus()) return false;") &&
    !contentScriptText.includes('if (types.includes("text/plain") || types.includes("text/markdown")) return true;') &&
    !contentScriptText.includes("function isXposterDropCandidate") &&
    !contentScriptText.includes("function isXposterDefaultDropCandidate") &&
    !contentScriptText.includes('"article-outside"') &&
    !contentScriptText.includes("if (files.some(isImageFile)) return true;") &&
    !contentScriptText.includes("return items.some(isLikelyMarkdownTransferItem) || items.some(isLikelyImageTransferItem) || items.some(isDirectoryTransferItem);") &&
    contentScriptText.includes("Place the cursor in the article body before dropping an image."),
  "plain image drops should pass through to X native cover/media areas; xPoster image insertion must be explicit and cursor-based"
);
assert.ok(
  contentScriptText.includes('if (sidePanelIntent === "sidepanel-queue") return sidePanelIntent;') &&
    contentScriptText.includes('if (isSingleMarkdownDrop(dataTransfer)) return "article";') &&
    contentScriptText.includes("const PENDING_ARTICLE_IMPORT_STORAGE_KEY") &&
    contentScriptText.includes("async function stageSingleMarkdownForArticle") &&
    contentScriptText.includes("async function importSingleMarkdownFileFromDrop") &&
    contentScriptText.includes("async function resumePendingArticleImport") &&
    contentScriptText.includes('safeRuntimeSendMessage({ type: "xposter:open-articles" })') &&
    !contentScriptText.includes("function hasSingleUnknownFileItem") &&
    contentScriptText.includes("function transferFilesFromDataTransfer") &&
    contentScriptText.includes("typeof item.getAsFile !== \"function\"") &&
    contentScriptText.includes("function partitionTransferFiles") &&
    contentScriptText.includes("function summarizeTransferItems") &&
    contentScriptText.includes("function markdownTransferFileCount") &&
    contentScriptText.includes('if (intent === "sidepanel-queue" && markdownFiles.length === 1) intent = "article";') &&
    contentScriptText.includes("const markdownFileCount = markdownTransferFileCount(dataTransfer, files, fileGroups.markdownFiles.length, itemSummary);") &&
    contentScriptText.includes("if (markdownFileCount > 1) return \"sidepanel-queue\";") &&
    contentScriptText.includes("if (markdownFileCount === 1) return \"\";") &&
    contentScriptText.includes("function hasUnmaterializedFileDrop") &&
    contentScriptText.includes("hasUnmaterializedFileDrop(dataTransfer, files)") &&
    contentScriptText.includes("isDropEventOverSurface(event, \"sidepanel-queue\")") &&
    contentScriptText.includes("intent !== \"sidepanel-queue\"") &&
    contentScriptText.includes("const panelPromise = safeRuntimeSendMessage({ type: \"xposter:open-side-panel\" }).catch(() => {})") &&
    contentScriptText.includes("if (markdownFiles.length > 1) await queueMarkdownFilesForSidePanel(markdownFiles, { openPanelPromise: panelPromise });") &&
    contentScriptText.includes("await queueMarkdownFilesForSidePanel(markdownFiles, { openPanelPromise: panelPromise })") &&
    contentScriptText.includes("handleSidePanelMarkdownDrop(event.dataTransfer, intent, { openPanelPromise: panelPromise, markdownFiles })") &&
    contentScriptText.includes("handleSidePanelMarkdownDrop(event.dataTransfer, intent, { markdownFiles })") &&
    contentScriptText.includes("const files = markdownFiles || markdownFilesFromTransfer(dataTransfer);") &&
    !contentScriptText.includes("files.filter(isMarkdownFile).length > 1 || markdownTransferFileCount(dataTransfer) > 1") &&
    !contentScriptText.includes("files.some(isMarkdownFile) || markdownTransferFileCount(dataTransfer) === 1") &&
    !contentScriptText.includes("files.some(isImageFile)") &&
    !contentScriptText.includes("items.filter(isLikelyMarkdownTransferItem)") &&
    !contentScriptText.includes("items.some(isLikelyImageTransferItem)) return items.length"),
  "X page drops should open single Markdown files in X Articles and robustly queue multiple Markdown files in the side panel"
);
assert.ok(
  /document\.addEventListener\("drop", async \(event\) => \{\s+let intent = dropIntentForEvent\(event\);\s+if \(intent === "none"\) return;\s+event\.preventDefault\(\);\s+event\.stopPropagation\(\);\s+let files = transferFilesFromDataTransfer\(event\.dataTransfer\);/.test(contentScriptText) &&
    contentScriptText.includes("function transferHasFileSystemHandleItems(dataTransfer)") &&
    contentScriptText.includes("async function resolveTransferFilesFromDataTransfer(dataTransfer, files = transferFilesFromDataTransfer(dataTransfer))") &&
    contentScriptText.includes("files = await resolveTransferFilesFromDataTransfer(event.dataTransfer, files);") &&
    contentScriptText.includes("const file = await handle.getFile();") &&
    contentScriptText.includes("return uniqueTransferFiles(resolved);") &&
    contentScriptText.includes("Could not read the dropped Markdown file. Try the import button or drop a real .md file."),
  "X page bottom dock drops should recover File System Access handles and warn instead of silently swallowing unreadable Markdown"
);
assert.ok(
  includesAll(contentScriptText, [
    'const ARTICLE_EXPORT_ID = "__xposter_article_export__"',
    'const ARTICLE_EXPORT_SETTINGS_STORAGE_KEY = "xposter_article_export_settings"',
    'enabled: settings.enabled !== false',
    'function installArticleExportButton',
    'function scheduleArticleExportSyncFromMutations',
    'function shouldScheduleArticleExportSync',
    'function mutationTouchesArticleExportSignal',
    'function nodeHasArticleExportSignal',
    'new MutationObserver(scheduleArticleExportSyncFromMutations)',
    'function extractReadableXArticle',
    'function articleExportPathInfo',
    'function articleExportAnchorSelector',
    'function articleExportPathMatches',
    'articleExportPathInfo().readable',
    'segment) => /^(?:article|articles)$/.test(segment)',
    'const ARTICLE_EXPORT_LONGFORM_SELECTOR',
    'function hasReadableArticleSignal',
    'function containerHasReadableArticleSignal',
    'function articleExportMediaLinks',
    'if (!hasReadableArticleSignal()) return null;',
    'longformRoots',
    'articleRoots',
    'if (!containerHasReadableArticleSignal(container)) return null;',
    'const article = element?.closest?.("article") || null;',
    'const longform = element?.closest?.(ARTICLE_EXPORT_LONGFORM_SELECTOR) || null;',
    'if (!article && !longform) return null;',
    'if (node === boundary || node.matches?.("article")) break;',
    'function isReadableArticleTitleNode',
    'const xTitle = container?.querySelector?.("[data-testid=\'twitter-article-title\']");',
    'return !rect || (rect.width >= 32 && rect.height >= 12);',
    'function markdownForArticleNode',
    'function detectArticleExportTitleNode',
    'function removeDuplicateArticleTitleParts',
    'function markdownCharacterCount',
    'function markdownImageCount',
    'navigator.clipboard.writeText(text)',
    'link.download = fileName || articleFileName("")',
    'root.setAttribute("role", "group")',
    'root = document.createElement("span")',
    'root.setAttribute("aria-label", translateContentText("Article title Markdown tools"))',
    '__xposter_article_export_mark',
    '${translateContentText("MD")}',
    'data-export-action="copy"',
    'data-export-action="download"',
    'data-export-icon="copy"',
    'data-export-icon="download"',
    '__xposter_article_export_feedback',
    'root.addEventListener("click", handleArticleExportActionClick)',
    'await handleArticleExportAction(button.dataset.exportAction)',
    'await setArticleExportMode(mode)',
    'downloadMarkdown(article.markdown, article.fileName)',
    'notifyArticleExportSuccess(root, "download", article)',
    'notifyArticleExportSuccess(root, "copy", article)',
    'setDatasetValueIfChanged(root, "articleFileName", article.fileName || articleFileName(article.title))',
    'setDatasetValueIfChanged(root, "articleCharacterCount", article.characterCount || 0)',
    'setDatasetValueIfChanged(root, "articleImageCount", article.imageCount || 0)',
    'placeArticleExportRoot(root, article)',
    'if (root.parentElement !== anchor) anchor.appendChild(root)',
    'setDatasetValueIfChanged(root, "placement", "inline")',
    'setDatasetValueIfChanged(root, "placement", "fixed")',
    'function articleNodeReadableText',
    'const heading = normalizeText(articleNodeReadableText(titleNode))',
    'clone?.querySelector?.(`#${ARTICLE_EXPORT_ID}`)?.remove()',
    '个字符，${images} 张图片',
    '${characters} characters, ${images} images',
    'position: fixed',
    'right: var(--__xposter-article-export-inline-end, 24px)',
    'function articleDockInlineEnd',
    'width: fit-content',
    'function articleExportNodes(root)',
    'const { mark, buttons } = articleExportNodes(root)',
    'const { feedback } = articleExportNodes(root)',
    'setSourceHtmlIfChanged(button, articleExportIconMarkup(buttonMode))',
    'removeDatasetValueIfChanged(button, "active")',
    'function articleExportIconMarkup',
    '.__xposter_article_export_actions',
    'opacity: 0',
    'data-placement="fixed"] .__xposter_article_export_actions',
    'xPosterColorVariables("export", "light", XP_EXPORT_COLOR_KEYS)',
    'border-radius: 999px',
    'background: var(--__xposter-export-paper)',
    'const LANGUAGE_STORAGE_KEY = "xposter_language"',
    'function restoreContentLanguage',
    'function translateContentText',
    'prefers-reduced-motion: reduce',
    'installArticleExportButton();'
  ]) &&
    excludesAll(contentScriptText, [
      '__xposter_article_export_menu',
      '__xposter_article_export_main',
      '__xposter_article_export_toggle',
      'data-export-mode',
      'documentListenersInstalled',
      'toggleArticleExportMenu',
      'closeArticleExportMenuOnOutside',
      'backdrop-filter: blur',
      'button[data-active="true"]',
      'button.textContent = articleExportShortLabel',
      'new MutationObserver(() => scheduleArticleExportSync())',
      '[data-xposter-article-export-host="true"]',
      'root.dataset.articleFileName = article.fileName || articleFileName(article.title)',
      'root.dataset.articleCharacterCount = String(article.characterCount || 0)',
      'root.dataset.articleImageCount = String(article.imageCount || 0)',
      'root.dataset.placement = "inline"',
      'root.dataset.placement = "fixed"',
      'button.innerHTML = articleExportIconMarkup(buttonMode)',
      'button.removeAttribute("data-active")',
      '__xposterArticleExportNodes',
      'root.querySelectorAll("[data-export-action]").forEach',
      'const feedback = root.querySelector(".__xposter_article_export_feedback");'
    ]),
  "readable X article pages should expose localized title-integrated Markdown copy/download tools with remembered action, title de-duplication, and file/count feedback"
);
assert.ok(
  !contentScriptText.includes("function positionDropHint") &&
    !contentScriptText.includes("--xposter-drop-left") &&
    !contentScriptText.includes("--xposter-drop-top") &&
    !contentScriptText.includes("event.clientX - width / 2"),
  "X page drop feedback should not follow the cursor as a small floating tray"
);
assert.equal(statusSandbox.statusHelpers.statusThemeFromPage(), "dark", "status overlay should detect a dark host surface");
assert.equal(
  statusSandbox.statusHelpers.statusProgressForText("Preparing Markdown...", "work"),
  8,
  "status background progress should begin during preparation"
);
assert.equal(
  statusSandbox.statusHelpers.statusProgressForText("Checking image file 1/2...", "work"),
  28,
  "image file checks should be shown before the X upload phase"
);
assert.equal(
  statusSandbox.statusHelpers.statusProgressForText("Uploading image 1/1...", "work"),
  88,
  "the final image upload should leave room for final writing steps"
);
assert.equal(
  statusSandbox.statusHelpers.statusProgressForText("Uploading image 1/1... waiting for X to finish.", "work"),
  88,
  "pending X image uploads should keep the visible progress alive"
);
assert.equal(
  statusSandbox.statusHelpers.statusProgressForText("Setting cover...", "work"),
  76,
  "cover setup should stay in the late import phase after image upload"
);
assert.equal(
  statusSandbox.statusHelpers.statusProgressForText("Cleaning up import markers...", "work"),
  96,
  "cleanup should display near-complete progress"
);
assert.equal(
  statusSandbox.statusHelpers.statusProgressForText("Article written.", "done"),
  100,
  "completed status should fill the status background"
);
assert.equal(originalImporterSandbox.beforeCleanup.detected, true, "old Markdown importer residue should be detectable before cleanup");
assert.equal(originalImporterSandbox.afterCleanup.detected, false, "stale old Markdown importer residue should be removable before preflight blocking");
assert.deepEqual(
  Array.from(originalImporterSandbox.remainingLegacy),
  [],
  "cleanup should remove known old Markdown importer DOM and styles"
);
assert.ok(
  originalImporterSandbox.cleanedMarkers.includes("original import button") &&
    originalImporterSandbox.cleanedMarkers.includes("original banner class") &&
    contentScriptText.includes("currentOriginalImporterResidue({ cleanup: true })"),
  "page-status and diagnostics should attempt stale old-importer cleanup before reporting blockers"
);
assert.equal(originalImporterSandbox.xposterStillPresent, true, "cleanup should not remove current xPoster UI");
assert.deepEqual(
  Array.from(originalImporterSandbox.bodyClasses),
  ["__xposter_status_visible"],
  "cleanup should remove only old importer body classes"
);
assert.equal(statusSandbox.statusHelpers.translateContentText("Preparing Markdown..."), "正在准备 Markdown...", "X page status details should follow the selected language");
assert.equal(
  statusSandbox.statusHelpers.translateContentText("Checking image file 2/3..."),
  "正在检查图片文件 2/3...",
  "X page status should distinguish image file checks from X uploads"
);
assert.equal(
  statusSandbox.statusHelpers.translateContentText("Uploading image 4/5... waiting for X to finish."),
  "正在上传图片 4/5，等待 X 完成处理...",
  "X page status should explain when an inserted image is waiting on X media processing"
);
assert.equal(
  statusSandbox.statusHelpers.translateContentText("Image 4/5 is in the editor; continuing..."),
  "图片 4/5 已进入编辑器，继续处理...",
  "X page status should explain when xPoster continues after a stable pending media block"
);
assert.equal(
  statusSandbox.statusHelpers.translateContentText("Article written in 12.3s. 1 image(s) are in the editor while X finishes media IDs."),
  "文章已写入，用时 12.3s。1 张图片已进入编辑器，X 仍在完成媒体编号。",
  "X page completion should distinguish pending X media IDs from failed image uploads"
);
assert.equal(
  statusSandbox.statusHelpers.translateContentText("Article written in 12.3s. 1 body image(s) stayed as Markdown links; 2 image(s) are in the editor while X finishes media IDs. Replace unreachable image URLs with public links, then write again if those images must upload."),
  "文章已写入，用时 12.3s。1 张正文图片保留为 Markdown 链接；2 张图片已进入编辑器，X 仍在完成媒体编号。",
  "X page completion should keep pending X media IDs visible alongside skipped image warnings"
);
assert.equal(statusSandbox.statusHelpers.translateContentText("Writing article"), "正在写入文章", "X page status titles should be localized");
assert.equal(statusSandbox.statusHelpers.translateContentText("Article title Markdown tools"), "文章标题区 Markdown 工具", "X article export group should describe its title placement");
assert.equal(statusSandbox.statusHelpers.articleExportLabel("copy"), "复制 Markdown", "X article export controls should localize action labels");
assert.equal(statusSandbox.statusHelpers.articleExportShortLabel("download"), "下载 MD", "X article export title labels should use compact localized text");
assert.deepEqual(
  JSON.parse(JSON.stringify(articleRouteSandbox.articleExportRouteResults)),
  {
    iArticle: { id: "2061085830580785152", route: true },
    nestedArticle: { id: "222", route: true },
    pluralArticle: { id: "333", route: true },
    statusArticle: { id: "444", route: true },
    composeEdit: { id: null, route: false },
    composeList: { id: null, route: false },
    nonX: { id: null, readable: false },
    longformFallback: true
  },
  "article export tools should mount on modern readable X Article URLs while staying out of compose routes"
);
assert.deepEqual(
  {
    isolatedContainer: articleExportDomSandbox.articleExportDomResults.isolatedContainer,
    longformContainerIsNotPageRoot: articleExportDomSandbox.articleExportDomResults.longformContainerIsNotPageRoot,
    titleText: articleExportDomSandbox.articleExportDomResults.titleText,
    hiddenRejected: articleExportDomSandbox.articleExportDomResults.hiddenRejected
  },
  {
    isolatedContainer: null,
    longformContainerIsNotPageRoot: true,
    titleText: "Real X Article Title",
    hiddenRejected: false
  },
  "article export should ignore page chrome links, prefer the real X article title, and reject hidden shortcut headings"
);
statusSandbox.state.language = "zh-TW";
assert.equal(statusSandbox.statusHelpers.translateContentText("Preparing Markdown..."), "正在準備 Markdown...", "X page status details should support Traditional Chinese");
assert.equal(statusSandbox.statusHelpers.translateContentText("Queue Markdown drafts"), "加入 Markdown 草稿佇列", "X page drop hints should support Traditional Chinese");
statusSandbox.state.language = "ja";
assert.equal(
  statusSandbox.statusHelpers.translateContentText("Preparing Markdown..."),
  "Preparing Markdown...",
  "partially supported languages should fall back to English instead of mixing Chinese"
);
assert.ok(
  mainWorldText.includes("uploadFilesToEditor"),
  "main-world bridge should hand dropped image files to X's own uploader"
);
assert.ok(
  mainWorldText.includes("function markerTokenPattern") &&
    mainWorldText.includes("function allMarkerTokenPattern") &&
    mainWorldText.includes(".replace(markerPattern, \"\")") &&
    mainWorldText.includes(".replace(allMarkerTokenPattern(), \"\")") &&
    mainWorldText.includes("summary.markersCleaned += cleanupMarkers(draftNode, payload.markerPrefix)") &&
    mainWorldText.includes("draftNode = findDraftStateNode() || draftNode;"),
  "main-world cleanup should remove current and stale xPoster marker tokens from the latest Draft.js state"
);
assert.equal(mainMarkerSandbox.embeddedLocation?.blockKey, "a", "main-world marker lookup should find embedded marker block");
assert.equal(mainMarkerSandbox.embeddedLocation?.offset, 6, "main-world marker lookup should report embedded marker offset");
assert.equal(
  mainMarkerSandbox.embeddedLocation?.length,
  "__XPOSTER_newaa_IMAGE_1__".length,
  "main-world marker lookup should report embedded marker length"
);
assert.equal(mainMarkerSandbox.embeddedLocation?.exact, false, "embedded marker lookup should not be treated as exact");
assert.equal(mainMarkerSandbox.cleanedCount, 2, "main-world marker cleanup should remove stale random-prefix markers");
assert.equal(
  JSON.stringify(mainMarkerSandbox.cleanedKeys),
  JSON.stringify(["a", "c"]),
  "standalone stale marker blocks should be deleted"
);
assert.equal(mainMarkerSandbox.cleanedTexts.a, "Before after", "embedded stale marker tokens should be removed without deleting text");
assert.equal(
  JSON.stringify(mainMarkerSandbox.exactRelocateKeys),
  JSON.stringify(["p1", "img", "p2"]),
  "exact marker blocks should be replaced by the uploaded image block during relocation"
);
assert.equal(mainMarkerSandbox.exactRelocateResult.moved, 1, "exact marker relocation should count the moved image");
assert.equal(
  JSON.stringify(mainMarkerSandbox.embeddedRelocateKeys),
  JSON.stringify(["p1", "img", "marker", "p2"]),
  "embedded marker blocks should keep their text block while moving the image before it"
);
assert.equal(
  mainMarkerSandbox.embeddedRelocateTexts.marker,
  "Text before __XPOSTER_newaa_IMAGE_1__ text after",
  "embedded marker relocation should not drop surrounding article text"
);
assert.equal(mainMarkerSandbox.pendingRelocateResult.moved, 1, "pending media uploads should relocate by their observed block key");
assert.equal(
  JSON.stringify(mainMarkerSandbox.pendingRelocateKeys),
  JSON.stringify(["p1", "pending-img", "p2", "other-img"]),
  "pending media relocation should not fall back to the wrong media block when no mediaId exists yet"
);
assert.ok(
    mainWorldText.includes("const MEDIA_UPLOAD_BASE_TIMEOUT_MS = 90000") &&
    mainWorldText.includes("const MEDIA_UPLOAD_MAX_TIMEOUT_MS = 150000") &&
    mainWorldText.includes("const MEDIA_UPLOAD_PROGRESS_HEARTBEAT_MS = 15000") &&
    mainWorldText.includes("const MEDIA_UPLOAD_NO_ENTITY_TIMEOUT_MS = 45000") &&
    mainWorldText.includes("const MEDIA_UPLOAD_PENDING_READY_MS = 20000") &&
    mainWorldText.includes("const MEDIA_UPLOAD_PENDING_STABLE_MS = 5000") &&
    mainWorldText.includes("const MEDIA_UPLOAD_PENDING_MAX_WAIT_MS = 32000") &&
    mainWorldText.includes("const MEDIA_UPLOAD_USER_RETRY_AFTER_MS = 15000") &&
    mainWorldText.includes("const MEDIA_UPLOAD_MAX_ATTEMPTS = 3") &&
    mainWorldText.includes("const MEDIA_UPLOAD_RETRY_MIN_REMAINING_MS = 10000") &&
    mainWorldText.includes("let activeUploadRetry = null;") &&
    mainWorldText.includes("function canUsePendingMediaUpload(operation)") &&
    mainWorldText.includes("return !operation?.op?.coverOnly;") &&
    mainWorldText.includes("Uploading image ${index}/${total}... waiting for X to finish.") &&
    mainWorldText.includes("Image ${index}/${total} is in the editor; continuing...") &&
    mainWorldText.includes("function uploadProgressMeta(context, retryable = false)") &&
    mainWorldText.includes("uploadRetryable: Boolean(retryable)") &&
    mainWorldText.includes("function requestActiveUploadRetry()") &&
    mainWorldText.includes("Retry is not available for the current image yet.") &&
    mainWorldText.includes("activeUploadRetry.requested = true;") &&
    mainWorldText.includes("activeUploadRetry.retryable = false;") &&
    mainWorldText.includes("function mediaEntityDataSignature(data)") &&
    mainWorldText.includes("function findNewMediaUpload") &&
    mainWorldText.includes("function mediaUploadInfoFromBlock(contentState, blockKey)") &&
    mainWorldText.includes("function refreshUploadMediaId(draftNode, upload)") &&
    mainWorldText.includes("async function waitForUploadMediaId(draftNode, upload, timeoutMs = 8000)") &&
    mainWorldText.includes("while (Date.now() < deadline) {\n      throwIfCancelled();") &&
    mainWorldText.includes("ignoredBlocks = new Set()") &&
    mainWorldText.includes("if (ignoredBlocks.has(blockKey)) return;") &&
    mainWorldText.includes("const found = findNewMediaUpload(contentState, before, existingAtomicBlocks);") &&
    mainWorldText.includes("try {\n      preparedFile = await requestPreparedFile(imageOperation);") &&
    mainWorldText.includes("throwIfCancelled();\n      return { ok: false, error: error?.message || \"Prepared image data was not available\", recoverable: true };") &&
    mainWorldText.includes("return { ok: false, error: error?.message || \"Prepared image data was invalid\", recoverable: true };") &&
    mainWorldText.includes("return { ok: false, error: error?.message || \"X upload handler failed\", recoverable: true };") &&
    mainWorldText.includes("const failures = [];") &&
    mainWorldText.includes("failures.push({ index: index + 1, fileName, error: error?.message || \"Invalid image file data\" });") &&
    mainWorldText.includes("if (!files.length) return { ok: false, error: \"No image file data was provided\", failures };") &&
    mainWorldText.includes("return { ok: false, error: error?.message || \"X upload handler failed\", failures };") &&
    mainWorldText.includes('post("upload-files-error", { requestId: event.data.requestId, error: result.error, failures: result.failures || [], summary: result })') &&
    contentScriptText.includes("error.failures = message.failures || message.summary?.failures || null;") &&
    contentScriptText.includes("function uploadFilesFailureCount(summary = {})") &&
    contentScriptText.includes("function formatUploadFilesMessage(summary = {}, requestedCount = 0)") &&
    contentScriptText.includes("const skipped = uploadFilesFailureCount(summary);") &&
    contentScriptText.includes("showStatus(message, skipped ? \"warn\" : \"done\", skipped ? 8000 : 5000);") &&
    mainWorldText.includes("dataSignature: mediaEntityDataSignature(data)") &&
    mainWorldText.includes("if (info.mediaId) upload.mediaId = info.mediaId;") &&
    mainWorldText.includes("if (payload.cover && imageSourcesMatch(upload.source, payload.cover) && !upload.mediaId") &&
    mainWorldText.includes("const refreshed = await waitForUploadMediaId(draftNode, upload);") &&
    mainWorldText.includes("if (candidate.mediaId) complete = candidate;") &&
    mainWorldText.includes("else pending ||= candidate;") &&
    mainWorldText.includes("const retryState = { requested: false, retryable: false, context };") &&
    mainWorldText.includes("const canAttemptRetry = () => Date.now() + MEDIA_UPLOAD_RETRY_MIN_REMAINING_MS < deadline;") &&
    mainWorldText.includes('const startUploadAttempt = async (reason = "initial") => {') &&
    mainWorldText.includes("const initialAttempt = await startUploadAttempt();") &&
    mainWorldText.includes("const retryable = !pendingUpload && attempt < MEDIA_UPLOAD_MAX_ATTEMPTS && canAttemptRetry();") &&
    mainWorldText.includes("const userRetryable = retryable && now - attemptStartedAt >= MEDIA_UPLOAD_USER_RETRY_AFTER_MS;") &&
    mainWorldText.includes("retryState.retryable = userRetryable;") &&
    mainWorldText.includes("if (found?.mediaId)") &&
    mainWorldText.includes("canUsePendingMediaUpload(imageOperation)") &&
    mainWorldText.includes('const identitySignature = `${found.entityKey}:${found.blockKey}`;') &&
    mainWorldText.includes("if (identitySignature !== pendingIdentitySignature)") &&
    mainWorldText.includes('} else if ((found.dataSignature || "") !== pendingDataSignature) {') &&
    mainWorldText.includes("retryState.requested = false;") &&
    mainWorldText.includes("reached X already; waiting to avoid a duplicate upload.") &&
    mainWorldText.includes("now - pendingFirstSeenAt >= MEDIA_UPLOAD_PENDING_READY_MS") &&
    mainWorldText.includes("now - pendingStableSince >= MEDIA_UPLOAD_PENDING_STABLE_MS") &&
    mainWorldText.includes("now - pendingFirstSeenAt >= MEDIA_UPLOAD_PENDING_MAX_WAIT_MS") &&
    mainWorldText.includes("mediaPending: true") &&
    mainWorldText.includes("if (result.mediaPending) summary.imgPending += 1") &&
    mainWorldText.includes("let imageBlock = upload.blockKey && blockMap.has(upload.blockKey) ? upload.blockKey : null;") &&
    mainWorldText.includes("if (!imageBlock && upload.entityKey) imageBlock = entityToBlock.get(upload.entityKey) || null;") &&
    mainWorldText.includes("const shouldManualRetry = retryState.requested && retryable;") &&
    mainWorldText.includes("const shouldAutoRetry = now - attemptStartedAt >= MEDIA_UPLOAD_NO_ENTITY_TIMEOUT_MS && retryable;") &&
    mainWorldText.includes("Retrying ${label} now...") &&
    mainWorldText.includes("${label[0].toUpperCase()}${label.slice(1)} did not start in X. Retrying...") &&
    mainWorldText.includes("const nextAttempt = await startUploadAttempt(shouldManualRetry ? \"manual\" : \"auto\");") &&
    mainWorldText.includes("now - attemptStartedAt >= MEDIA_UPLOAD_NO_ENTITY_TIMEOUT_MS") &&
    mainWorldText.includes("noEntity: true") &&
    mainWorldText.includes("attempts: attempt") &&
    mainWorldText.includes('if (event.data.kind === "retry-upload")') &&
    mainWorldText.includes("requestActiveUploadRetry();") &&
    contentScriptText.includes("const MAIN_WORLD_SILENCE_TIMEOUT_MS = 180000") &&
    contentScriptText.includes('"Retry is not available for the current image yet.": "当前图片暂时还不能重试。"') &&
    contentScriptText.includes("try {\n        last = await loadImage(source, fallbackName);") &&
    contentScriptText.includes("if (error?.cancelled) throw error;") &&
    contentScriptText.includes("last = { ok: false, error: error?.message || \"Image fetch failed\", source };") &&
    contentScriptText.includes("}, MAIN_WORLD_SILENCE_TIMEOUT_MS);") &&
    contentScriptText.includes("function retryActiveUpload()") &&
    contentScriptText.includes('window.postMessage({ source: CHANNEL_TO_MAIN, kind: "retry-upload", authToken: MAIN_BRIDGE_TOKEN }, "*");') &&
    contentScriptText.includes('message?.type === "xposter:retry-upload"') &&
    sidepanelHtml.includes('id="retryUpload"') &&
    sidepanelElementsText.includes('"retryUpload"') &&
    sidepanelText.includes("async function retryUpload()") &&
    sidepanelText.includes('{ type: "xposter:retry-upload" }') &&
    sidepanelText.includes("latestProgress.uploadRetryable = Boolean(payload.uploadRetryable);") &&
    sidepanelText.includes('setLocalizedTextIfChanged(els.retryUpload, uploadRetryRequested ? "Retrying..." : "Retry now");') &&
    mainWorldText.includes("X media upload took too long. X may be throttling this draft") &&
    mainWorldText.includes("timeoutMs") &&
    !mainWorldText.includes("Timed out waiting for X media upload") &&
    !mainWorldText.includes("Retrying image ${index + 1}"),
  "main-world image uploads should wait longer for X and return a recoverable timeout message"
);
assert.ok(
  mainWorldText.includes("async function settleUploadedImageAtMarker") &&
    mainWorldText.includes("const settleResult = await settleUploadedImageAtMarker(draftNode, upload, protectedAtomicBlocks);") &&
    mainWorldText.includes("summary.relocatedImages += settleResult.moved;") &&
    mainWorldText.includes("summary.markersCleaned += settleResult.markerCleaned;") &&
    mainWorldText.includes("upload.settled = !settleResult.missing;") &&
    mainWorldText.includes("const unsettledUploads = uploads.filter((upload) => !upload.coverOnly && !upload.settled);"),
  "main-world image uploads should relocate and clean each marker as soon as that image reaches the editor"
);
assert.ok(
  mainWorldText.includes("let markersWritten = false") &&
    mainWorldText.includes("markersWritten = true") &&
    mainWorldText.includes("if (markersWritten)") &&
    mainWorldText.includes('progress("Cleaning up import markers...", error?.cancelled ? "warn" : "work")') &&
    mainWorldText.includes('console.warn(LOG, "marker cleanup after interrupted import failed", cleanupError)') &&
    mainWorldText.includes("error.summary = summary") &&
    mainWorldText.includes('post("cancelled", { reason: error.message || "Writing stopped by user.", summary: error?.summary || null })') &&
    mainWorldText.includes('post("error", { error: error?.message || String(error), stack: error?.stack || null, summary: error?.summary || null })') &&
    contentScriptText.includes("error.mainSummary = message.summary || null;") &&
    contentScriptText.includes("return { ok: false, error: message, mainSummary: error?.mainSummary || null };") &&
    sidepanelText.includes("const mainSummary = payload.summary || payload.mainSummary || null;") &&
    sidepanelText.includes("latestProgress.summary = mainSummary ? { main: mainSummary } : latestProgress.summary || null;") &&
    sidepanelText.includes('recordLiveProgressEvent("cancelled", { reason: response?.error || "Writing stopped by user.", summary: response?.mainSummary || null });') &&
    sidepanelText.includes('recordLiveProgressEvent("error", { error: response?.error || "unknown error", summary: response?.mainSummary || null });'),
  "interrupted main-world imports should clean temporary xPoster markers and carry the cleanup summary back to sidepanel progress"
);
assert.equal(mainMediaSandbox.pendingUpload?.entityKey, "entity-1", "main-world should observe a pending X media placeholder entity");
assert.equal(mainMediaSandbox.pendingUpload?.blockKey, "block-1", "main-world should observe a pending X media placeholder block");
assert.equal(mainMediaSandbox.pendingUpload?.mediaId, null, "main-world should not treat X media placeholders as completed uploads");
assert.equal(mainMediaSandbox.completeUpload?.entityKey, "entity-1", "main-world should report the completed X media entity");
assert.equal(mainMediaSandbox.completeUpload?.blockKey, "block-1", "main-world should report the completed X media block");
assert.equal(
  mainMediaSandbox.completeUpload?.mediaId,
  "1234567890",
  "main-world should wait for a new media entity to receive mediaId before starting the next Markdown image"
);
assert.equal(
  mainMediaSandbox.snakeCaseUpload?.mediaId,
  "0987654321",
  "main-world should recognize X media ids from snake_case entity data"
);
assert.equal(
  mainMediaSandbox.nestedMediaKeyUpload?.mediaId,
  "1122334455",
  "main-world should normalize nested X media keys into media ids"
);
assert.equal(
  mainMediaSandbox.restIdUpload?.mediaId,
  "9988776655",
  "main-world should recognize rest_id media identifiers from nested entity data"
);
assert.equal(mainMediaSandbox.existingUpload, null, "main-world should ignore media entities that existed before the current upload step");
assert.equal(
  mainMediaSandbox.ignoredCompleteUpload?.blockKey,
  "new-block",
  "main-world should not match an already processed media block as a later upload"
);
assert.equal(
  mainMediaSandbox.ignoredOnlyUpload,
  null,
  "main-world should keep waiting instead of reusing an ignored media block"
);
assert.notEqual(
  mainMediaSandbox.pendingSignature,
  mainMediaSandbox.readySignature,
  "main-world should reset only the pending media data-stability timer when X updates media entity data"
);
assert.ok(
  mainMediaSandbox.cyclicSignature.includes("[circular]"),
  "main-world media entity signatures should tolerate cyclic X entity data"
);
assert.equal(
  mainMediaSandbox.refreshedUpload.mediaId,
  "2233445566",
  "main-world should refresh pending upload records when X later attaches a media id"
);
assert.equal(
  mainMediaSandbox.refreshedUpload.entityKey,
  "pending-entity",
  "main-world media id refresh should preserve the observed entity key"
);
assert.ok(
  contentScriptText.includes("image upload(s) timed out in X") &&
    sidepanelText.includes("image upload(s) timed out in X") &&
    sidepanelMessagesText.includes("X 上传图片等待太久"),
  "upload timeout summaries should explain the X-side delay in the selected language"
);
assert.ok(
  sidepanelText.includes("chrome.permissions.request"),
  "side panel should request remote image host access only when a draft needs it"
);
assert.ok(
  sidepanelText.includes("chrome.permissions.contains"),
  "side panel should report remote image host access from runtime permissions"
);
assert.ok(
  sidepanelText.includes("function remoteImageOriginCountsFromSegments(segments = [])") &&
    sidepanelText.includes("function remoteImageOriginsFromSegments(segments = [])") &&
    sidepanelText.includes("function remoteImageEvidenceFromSegments(segments = [])") &&
    sidepanelText.includes("const imageSegments = segments || [];") &&
    sidepanelText.includes("count: imageSegments.length") &&
    sidepanelText.includes("origins: remoteImageOriginsFromSegments(imageSegments)") &&
    sidepanelText.includes("return remoteImageOriginCountsFromSegments(remoteHttpImageSegments(parsed));") &&
    sidepanelText.includes("return remoteImageOriginsFromSegments(remoteHttpImageSegments(parsed));") &&
    sidepanelText.includes("const remoteImages = remoteHttpImageSegments(parsed);") &&
    sidepanelText.includes("remoteImages: remoteImageEvidenceFromSegments(remoteImages)") &&
    sidepanelText.includes("const draftRemoteImages = latestParsed ? remoteHttpImageSegments(latestParsed) : [];") &&
    sidepanelText.includes("remoteImages: remoteImageEvidenceFromSegments(draftRemoteImages)") &&
    sidepanelText.includes("const evidenceRemoteImages = latestParsed ? remoteHttpImageSegments(latestParsed) : [];") &&
    sidepanelText.includes("remoteImages: remoteImageEvidenceFromSegments(evidenceRemoteImages)") &&
    !sidepanelText.includes("origins: remoteImageOrigins(parsed),"),
  "draft and technical evidence should reuse collected remote image lists when deriving remote image metadata"
);
assert.ok(
  sidepanelText.includes("function preflightMarkdowns") &&
    sidepanelText.includes("function preflightSegmentCounts") &&
    sidepanelText.includes("function localImageFolderStatusForMarkdowns") &&
    sidepanelText.includes("function remoteHttpImageSegmentsForMarkdowns") &&
    sidepanelText.includes("function mediaUploadEstimateForMarkdowns") &&
    sidepanelText.includes("function parsedDraftsForMarkdowns(markdowns = [], options = importOptions)") &&
    sidepanelText.includes("function segmentCountsForParsedDrafts(parsedDrafts = [])") &&
    sidepanelText.includes("function localImageReferencesForParsedDrafts(parsedDrafts = [])") &&
    sidepanelText.includes("function mediaUploadEstimateForParsedDrafts(parsedDrafts = [])") &&
    sidepanelText.includes("function remoteHttpImageSegmentsForParsedDrafts(parsedDrafts = [])") &&
    sidepanelText.includes("const parsedDrafts = parsedDraftsForMarkdowns(markdowns, importOptions);") &&
    sidepanelText.includes("const preflightContext = { markdowns, parsedDrafts }") &&
    sidepanelText.includes("const checks = buildPreflightChecks(preflightContext);") &&
    sidepanelText.includes("updatePreflight(checks);") &&
    sidepanelText.includes("localAssetWriteBlocker(checks, { ...preflightContext, byId })") &&
    sidepanelText.includes("firstQueueMediaLimitBlocker(mediaUploadEstimateForParsedDrafts(parsedDrafts))") &&
    sidepanelText.includes("remoteImageOriginsFromSegments(remoteHttpImageSegmentsForParsedDrafts(parsedDrafts))") &&
    !sidepanelText.includes("remoteImageOriginsForMarkdowns(draftQueue.map((item) => item.markdown), importOptions)") &&
    !sidepanelText.includes("firstQueueMediaLimitBlocker(mediaUploadEstimateForMarkdowns(markdowns, importOptions))") &&
    contentScriptText.includes("function articleMediaUploadEstimate") &&
    contentScriptText.includes("let bodyImages = 0;") &&
    contentScriptText.includes("let tables = 0;") &&
    contentScriptText.includes("let coverInBody = false;") &&
    contentScriptText.includes("for (const segment of segments) {") &&
    contentScriptText.includes("shared.imageSourcesMatch(segment.source, coverSource)") &&
    !contentScriptText.includes('const bodyImages = segments.filter((segment) => segment.type === "image").length') &&
    !contentScriptText.includes('const tables = segments.filter((segment) => segment.type === "table").length') &&
    !contentScriptText.includes('const coverOnly = coverSource && !segments.some(') &&
    sidepanelText.includes("const results = [];") &&
    sidepanelText.includes("let ok = 0;") &&
    sidepanelText.includes("let fail = 0;") &&
    sidepanelText.includes("let pending = 0;") &&
    sidepanelText.includes("images.forEach((segment, index) => {") &&
    sidepanelText.includes("if (result.ok === true) ok += 1;") &&
    sidepanelText.includes("else if (result.ok === false) fail += 1;") &&
    sidepanelText.includes("else pending += 1;") &&
    sidepanelText.includes("const allCurrentImagesHaveResults = images.length > 0 && pending === 0;") &&
    !sidepanelText.includes("const results = images.map((segment, index) =>") &&
    !sidepanelText.includes("results.every((item) => item.ok === true || item.ok === false)") &&
    !sidepanelText.includes("results.filter((item) => item.ok === true).length") &&
    !sidepanelText.includes("results.filter((item) => item.ok === false).length") &&
    sidepanelText.includes('localizeInterpolated("Draft {index}: {title}"') &&
    sidepanelMessagesText.includes('"Draft {index}: {title}"'),
  "batch queue writes should aggregate queued Markdown preflight, request all remote image origins, and block local/media problems before the first write"
);
assert.ok(
  sidepanelText.includes("function hasMarkdownTransfer") &&
    sidepanelText.includes("function summarizeMarkdownTransferFiles") &&
    sidepanelText.includes("function summarizeMarkdownTransferItems") &&
    sidepanelText.includes("if (fileSummary.hasFiles) return Boolean(fileSummary.markdownFiles.length);") &&
    sidepanelText.includes("if (itemSummary.hasLikelyMarkdown) return true;") &&
    sidepanelText.includes("if (itemSummary.hasLikelyImage) return false;") &&
    sidepanelText.includes("const { markdownFiles } = summarizeMarkdownTransferFiles(dataTransfer?.files);") &&
    !sidepanelText.includes("if (files.length) return files.some(isMarkdownFile);") &&
    !sidepanelText.includes("if (items.some(isLikelyMarkdownTransferItem)) return true;") &&
    !sidepanelText.includes("if (items.some(isLikelyImageTransferItem)) return false;") &&
    !sidepanelText.includes("if (files.some(isMarkdownFile)) return true;") &&
    !sidepanelText.includes('if (types.includes("Files")) return true;'),
  "side panel page-level drop tray should ignore image files and only respond to Markdown/text drafts"
);
assert.ok(
  sidepanelHtml.includes('id="cancelImport"') &&
    sidepanelText.includes('sendToTargetTab({ type: "xposter:cancel-import" })') &&
    contentScriptText.includes('message?.type === "xposter:cancel-import"') &&
    contentScriptText.includes('class="__xposter_status_stop"') &&
    contentScriptText.includes('cancelActiveImport();') &&
    contentScriptText.includes("function setDatasetValueIfChanged(node, key, value)") &&
    contentScriptText.includes("function setTextContentIfChanged(node, value)") &&
    contentScriptText.includes("function setSourceHtmlIfChanged(node, html)") &&
    contentScriptText.includes("function setClassPresenceIfChanged(node, className, present)") &&
    contentScriptText.includes("const nodeCache = new WeakMap();") &&
    contentScriptText.includes("function cachedElementNodes(root, key, collect, isValid)") &&
    contentScriptText.includes('setDatasetValueIfChanged(card, "level", level)') &&
    contentScriptText.includes('setDatasetValueIfChanged(card, "statusText", text)') &&
    contentScriptText.includes("function statusCardNodes(card)") &&
    contentScriptText.includes("const { title, detail } = statusCardNodes(card);") &&
    contentScriptText.includes('statusCardNodes(card).stopButton?.addEventListener("click"') &&
    contentScriptText.includes("const button = statusCardNodes(card).stopButton;") &&
    contentScriptText.includes('setClassPresenceIfChanged(document.body, "__xposter_status_visible", true)') &&
    contentScriptText.includes('setClassPresenceIfChanged(document.body, "__xposter_status_visible", false)') &&
    contentScriptText.includes('setDatasetValueIfChanged(card, "progress", hasProgress ? "determinate" : level === "work" ? "indeterminate" : "none")') &&
    contentScriptText.includes('setStylePropertyIfChanged(card, "--__xposter-status-progress", `${boundedPercent}%`)') &&
    contentScriptText.includes('removeStylePropertyIfChanged(card, "--__xposter-status-progress")') &&
    contentScriptText.includes('setBooleanPropertyIfChanged(button, "hidden", !visible)') &&
    contentScriptText.includes('setTextContentIfChanged(button, translateContentText(stopping ? "Stopping..." : "Stop"))') &&
    !contentScriptText.includes("card.dataset.level = level") &&
    !contentScriptText.includes("card.dataset.statusText = text") &&
    !contentScriptText.includes('card.style.setProperty("--__xposter-status-progress"') &&
    !contentScriptText.includes('card.style.removeProperty("--__xposter-status-progress"') &&
    !contentScriptText.includes('document.body.classList.add("__xposter_status_visible")') &&
    !contentScriptText.includes('document.body.classList.remove("__xposter_status_visible")') &&
    !contentScriptText.includes("button.hidden = !visible") &&
    !contentScriptText.includes('button.textContent = translateContentText(stopping ? "Stopping..." : "Stop")') &&
    !contentScriptText.includes("__xposterStatusNodes") &&
    !contentScriptText.includes('card.querySelector(".__xposter_status_stop")?.addEventListener') &&
    !contentScriptText.includes('const title = card.querySelector("strong");') &&
    !contentScriptText.includes('const detail = card.querySelector("p");') &&
    !contentScriptText.includes('const button = card?.querySelector?.(".__xposter_status_stop");') &&
    contentScriptText.includes("function syncStatusStopButton") &&
    contentScriptText.includes("function cancelActiveImport") &&
    contentScriptText.includes("function throwIfImportCancelled") &&
    mainWorldText.includes("throwIfCancelled") &&
    mainWorldText.includes('event.data.kind === "cancel"'),
  "article writes should expose a stop control that cancels the page upload loop"
);
assert.ok(
  sidepanelRuntimeText.includes("X_ARTICLE_MEDIA_SOFT_LIMIT: 25") &&
    contentScriptText.includes("const X_ARTICLE_MEDIA_SOFT_LIMIT = 25") &&
    contentScriptText.includes("function preflightArticleMediaLimit") &&
    contentScriptText.includes("function articleMediaUploadEstimate") &&
    contentScriptText.includes('type: "preflight-blocked"') &&
    contentScriptText.includes("mediaLimitWarningText") &&
    contentScriptText.includes("mediaHeadroomText") &&
    sidepanelRuntimeText.includes("X_ARTICLE_MEDIA_HEADROOM_THRESHOLD: 21") &&
    sidepanelText.includes("X_ARTICLE_MEDIA_LIMIT_WARNING") &&
    sidepanelText.includes("X_ARTICLE_MEDIA_HEADROOM_NOTE") &&
    sidepanelText.includes("X_ARTICLE_MEDIA_CAPACITY_NOTE") &&
    sidepanelHtml.includes('id="draftMediaAlert"') &&
    sidepanelCss.includes(".draft-media-alert") &&
    sidepanelText.includes("function syncDraftMediaAlert") &&
    sidepanelText.includes("function setDraftMediaAlertState") &&
    sidepanelText.includes("function setMediaLimitAlertDetail") &&
    sidepanelText.includes("function setLocalizedMessageIfChanged(node, key, values = {})") &&
    sidepanelText.includes("function setLocalizedText(node, source)") &&
    sidepanelText.includes("setLocalizedTextIfChanged(node, source)") &&
    sidepanelText.includes("function setLocalizedMessage(node, key, values = {})") &&
    sidepanelText.includes("setLocalizedMessageIfChanged(node, key, values)") &&
    sidepanelText.includes('setDraftMediaAlertState({ hidden: false, tone: "danger" })') &&
    sidepanelText.includes('setDraftMediaAlertState({ hidden: false, tone: batchWriteProgressTone(), role: "status", live: "polite" })') &&
    sidepanelText.includes("setMediaLimitAlertDetail(estimate)") &&
    sidepanelText.includes('setLocalizedMessageIfChanged(els.draftMediaAlertDetail, "Success {done}/{total} drafts", batchWriteProgressValues())') &&
    sidepanelText.includes('removeDatasetValueIfChanged(els.draftMediaAlert, "tone")') &&
    sidepanelText.includes('removeDatasetValueIfChanged(els.draftMediaAlertDetail, "i18n")') &&
    sidepanelText.includes("setTextContentIfChanged(els.draftMediaAlertDetail, text)") &&
    sidepanelText.includes("els.draftMediaAlertDetail.__xposterSourceText = X_ARTICLE_MEDIA_LIMIT_WARNING") &&
    sidepanelText.includes('text: "Fix the image count in the editor."') &&
    sidepanelText.includes('if (mediaEstimate.nearSoftLimit)') &&
    sidepanelText.includes('text: "Close to the image limit."') &&
    sidepanelText.includes("function quietImportHint") &&
    sidepanelText.includes("function compactWriteHint({ hasDraft, hasQueue = false, busy = false } = {})") &&
    sidepanelText.includes("const remoteCount = remoteHttpImageSegments(latestParsed).length;") &&
    sidepanelText.includes("const mediaEstimate = mediaUploadEstimate(latestParsed);") &&
    sidepanelText.includes("if (remoteCount) return remoteImageWriteHint(remoteCount, mediaEstimate);") &&
    sidepanelText.includes("function remoteImageWriteHint(remoteCount, mediaEstimate = mediaUploadEstimate(latestParsed))") &&
    !sidepanelText.includes("if (remoteCount) return remoteImageWriteHint(remoteCount);\n    const mediaEstimate = mediaUploadEstimate(latestParsed);") &&
    sidepanelText.includes("function mediaUploadEstimate") &&
    sidepanelText.includes("let bodyImages = 0;") &&
    sidepanelText.includes("let tables = 0;") &&
    sidepanelText.includes("let coverInBody = false;") &&
    sidepanelText.includes("function localImageReferences") &&
    sidepanelText.includes("const coverIsLocal = Boolean(coverSource && shared.isLocalImageSource(coverSource));") &&
    sidepanelText.includes("for (const segment of parsed?.segments || []) {") &&
    sidepanelText.includes('if (segment.type !== "image" || !shared.isLocalImageSource(segment.source)) continue;') &&
    sidepanelText.includes("if (coverIsLocal && !coverInBody && shared.imageSourcesMatch(segment.source, coverSource)) coverInBody = true;") &&
    sidepanelText.includes("function localImageFolderStatusForReferences") &&
    sidepanelText.includes("let absoluteCount = 0;") &&
    sidepanelText.includes("for (const item of references) {") &&
    sidepanelText.includes("if (shared.isAbsoluteLocalImageSource(item.source)) absoluteCount += 1;") &&
    sidepanelText.includes("function remoteHttpImageSegmentsIncludingCover") &&
    sidepanelText.includes("const coverIsRemote = Boolean(cover && isRemoteHttpImageSource(cover));") &&
    sidepanelText.includes("if (coverIsRemote && !coverInBody && shared.imageSourcesMatch(segment.source, cover)) coverInBody = true;") &&
    sidepanelText.includes("for (const segment of parsed.segments) {") &&
    sidepanelText.includes('if (segment.type === "image") {') &&
    sidepanelText.includes("bodyImages += 1;") &&
    sidepanelText.includes("shared.imageSourcesMatch(segment.source, coverSource)") &&
    sidepanelText.includes('} else if (segment.type === "table") {') &&
    sidepanelText.includes("tables += 1;") &&
    sidepanelText.includes("mediaLimitWarningText") &&
    sidepanelText.includes("mediaHeadroomText") &&
    sidepanelText.includes("mediaCapacityText") &&
    sidepanelText.includes("nearSoftLimit") &&
    sidepanelText.includes('recordLiveProgressEvent("preflight-blocked"') &&
    sidepanelMessagesText.includes("X Article media note") &&
    sidepanelMessagesText.includes("Images: {count}/{limit}") &&
    sidepanelMessagesText.includes("Remove {extra} image(s)") &&
    !sidepanelText.includes('const bodyImages = parsed.segments.filter((segment) => segment.type === "image").length') &&
    !sidepanelText.includes('const tables = parsed.segments.filter((segment) => segment.type === "table").length') &&
    !sidepanelText.includes('const coverOnly = coverSource && !parsed.segments.some(') &&
    !sidepanelText.includes("const references = localImageSegments(parsed).map((segment) => ({") &&
    !sidepanelText.includes("!references.some((item) => shared.imageSourcesMatch(item.source, coverSource))") &&
    !sidepanelText.includes("const absoluteCount = references.filter((item) => shared.isAbsoluteLocalImageSource(item.source)).length") &&
    !sidepanelText.includes("const segments = (parsed?.segments || []).filter((segment) => segment.type === \"image\" && isRemoteHttpImageSource(segment.source))") &&
    !sidepanelText.includes("!segments.some((segment) => shared.imageSourcesMatch(segment.source, cover))") &&
    !sidepanelText.includes("Image plan: {count}/20") &&
    !contentScriptText.includes("Image plan: {count}/20"),
  "draft preflight should allow up to 25 media uploads and show a centered editor warning only above that limit"
);
assert.deepEqual(
  {
    contentNear: {
      total: mediaSandbox.mediaEstimates.contentNear.total,
      nearSoftLimit: mediaSandbox.mediaEstimates.contentNear.nearSoftLimit,
      overSoftLimit: mediaSandbox.mediaEstimates.contentNear.overSoftLimit
    },
    contentAt: {
      total: mediaSandbox.mediaEstimates.contentAt.total,
      nearSoftLimit: mediaSandbox.mediaEstimates.contentAt.nearSoftLimit,
      overSoftLimit: mediaSandbox.mediaEstimates.contentAt.overSoftLimit
    },
    contentOver: {
      total: mediaSandbox.mediaEstimates.contentOver.total,
      nearSoftLimit: mediaSandbox.mediaEstimates.contentOver.nearSoftLimit,
      overSoftLimit: mediaSandbox.mediaEstimates.contentOver.overSoftLimit
    },
    sidepanelNear: {
      total: mediaSandbox.mediaEstimates.sidepanelNear.total,
      nearSoftLimit: mediaSandbox.mediaEstimates.sidepanelNear.nearSoftLimit,
      overSoftLimit: mediaSandbox.mediaEstimates.sidepanelNear.overSoftLimit
    },
    sidepanelAt: {
      total: mediaSandbox.mediaEstimates.sidepanelAt.total,
      nearSoftLimit: mediaSandbox.mediaEstimates.sidepanelAt.nearSoftLimit,
      overSoftLimit: mediaSandbox.mediaEstimates.sidepanelAt.overSoftLimit
    },
    sidepanelOver: {
      total: mediaSandbox.mediaEstimates.sidepanelOver.total,
      nearSoftLimit: mediaSandbox.mediaEstimates.sidepanelOver.nearSoftLimit,
      overSoftLimit: mediaSandbox.mediaEstimates.sidepanelOver.overSoftLimit
    }
  },
  {
    contentNear: { total: 21, nearSoftLimit: true, overSoftLimit: false },
    contentAt: { total: 25, nearSoftLimit: true, overSoftLimit: false },
    contentOver: { total: 26, nearSoftLimit: false, overSoftLimit: true },
    sidepanelNear: { total: 21, nearSoftLimit: true, overSoftLimit: false },
    sidepanelAt: { total: 25, nearSoftLimit: true, overSoftLimit: false },
    sidepanelOver: { total: 26, nearSoftLimit: false, overSoftLimit: true }
  },
  "25 planned media uploads should be allowed; 26 should block before writing"
);
assert.ok(
  sidepanelHtml.includes('class="secondary compact preflight-action"') &&
    sidepanelHtml.includes('data-preflight-action="chooseVault"') &&
    sidepanelHtml.includes('id="draftDropAction"') &&
    !sidepanelHtml.includes('id="pickVaultSettings"') &&
    !sidepanelHtml.includes('id="localImagesPanel"') &&
    !sidepanelHtml.includes('id="pickVault"') &&
    !sidepanelHtml.includes('id="clearVault"') &&
    !sidepanelHtml.includes('id="vaultState"') &&
    !sidepanelHtml.includes('id="vaultDetail"') &&
    sidepanelHtml.includes("xPoster will ask when a Markdown draft uses local image paths.") &&
    sidepanelElementsText.includes('"draftDropAction"') &&
    !sidepanelElementsText.includes('"localImagesPanel"') &&
    !sidepanelElementsText.includes('"pickVault"') &&
    !sidepanelElementsText.includes('"clearVault"') &&
    !sidepanelElementsText.includes('"vaultState"') &&
    !sidepanelElementsText.includes('"vaultDetail"') &&
    sidepanelText.includes("function localImageReferences") &&
    sidepanelText.includes("function localImageFolderStatus") &&
    sidepanelText.includes("function activeLocalImageFolderStatus") &&
    sidepanelText.includes("function localImageFolderActionDetail") &&
    sidepanelText.includes('if (parts.length > 1) return parts[0];\n    return "";') &&
    !sidepanelText.includes("if (source) return truncateText(source, 44);") &&
    sidepanelText.includes("let draftDropActionStatus = null") &&
    sidepanelText.includes("function localAssetWriteBlocker") &&
    sidepanelText.includes("handleLocalAssetWriteBlocker(localAssetBlocker") &&
    sidepanelText.includes("retryAfterChoose = null") &&
    !sidepanelText.includes("if (!selected?.skipped)") &&
    sidepanelText.includes("function ensureXPageForVaultPrompt") &&
    sidepanelText.includes("Opening X Articles so the page can ask for the local image folder.") &&
    sidepanelText.includes("chooseVault({\n        status: blocker.localImages || activeLocalImageFolderStatus(),\n        ensureXPage: true,\n        showSidepanelFallback: false\n      })") &&
    sidepanelText.includes("status: blocker.localImages || null") &&
    sidepanelText.includes('const error = "Local image folder was not selected";') &&
    sidepanelText.includes("return { ok: false, error };") &&
    sidepanelText.includes("draftDropActionStatus = actionName ? action.status || null : null") &&
    sidepanelText.includes("async function runRunbookAction(action, options = {})") &&
    sidepanelText.includes("chooseVault({\n          status: options.status || activeLocalImageFolderStatus(),\n          ensureXPage: true,\n          showSidepanelFallback: false\n        })") &&
    sidepanelText.includes("runRunbookAction(action, { status: draftDropActionStatus })") &&
    sidepanelText.includes('setDraftDropStatus("Local image folder needed", localImageFolderActionDetail(blocker.localImages), "error", {\n        action: "openArticles",\n        button: "Open X",\n        status: blocker.localImages || null\n      });') &&
    sidepanelText.includes('action: "openArticles",\n        button: "Open X"') &&
    sidepanelText.includes("Local image folder selected. Continuing import.") &&
    sidepanelText.includes("retryAfterChoose: () => importMarkdownDraft(markdownInput, { queueItemId, batch, sourceFileName })") &&
    sidepanelText.includes("retryAfterChoose: () => (queueModeActive() ? importDraftQueue() : importDraft())") &&
    sidepanelText.includes("retryAfterChoose: () => importDraftQueue()") &&
    sidepanelText.includes('sendToTargetTab({\n      type: "xposter:choose-vault",\n      count: status.count || 0,\n      hint: firstLocalImageFolderHint(status)\n    }, { requireArticles: true })') &&
    sidepanelText.includes('button[data-preflight-action]') &&
    !sidepanelText.includes("els.pickVault.addEventListener") &&
    !sidepanelText.includes("els.clearVault.addEventListener") &&
    !sidepanelText.includes("setBooleanPropertyIfChanged(els.localImagesPanel") &&
    !sidepanelText.includes("setLocalizedTextIfChanged(els.vaultState") &&
    !sidepanelText.includes("setLocalizedTextIfChanged(els.vaultDetail") &&
    contentScriptText.includes('panel.addEventListener("click", async (event) =>') &&
    contentScriptText.includes('const button = event.target.closest?.("button");') &&
    contentScriptText.includes('"Cancel write": "取消写入"') &&
    contentScriptText.includes("Local image folder picker is unavailable in this tab.") &&
    contentScriptText.includes('throw new Error("Local image folder picker is unavailable in this tab.') &&
    contentScriptText.includes('if (!result.ok) throw new Error(result.error || "Local image folder was not selected");') &&
    contentScriptText.includes('const skipLabel = translateContentText("Cancel write");') &&
    contentScriptText.includes('if (button?.id === "xposter-vault-skip")') &&
    contentScriptText.includes('finish({ ok: false, error: "Local image folder was not selected" });') &&
    contentScriptText.includes('if (button?.id !== "xposter-vault-pick") return;') &&
    contentScriptText.includes("promptVaultSelection(message).then(sendResponse)") &&
    !contentScriptText.includes('panel.querySelector("#xposter-vault-skip").addEventListener') &&
    !contentScriptText.includes('panel.querySelector("#xposter-vault-pick").addEventListener') &&
    !contentScriptText.includes("local image(s) skipped: directory picker is unavailable") &&
    !contentScriptText.includes("finish({ ok: false, skipped: true })") &&
    !contentScriptText.includes("!result.ok && !result.skipped") &&
    sidepanelText.includes("Open the X Article page; xPoster will ask there for the folder that contains") &&
    !sidepanelText.includes("Click Choose folder, then select the folder that contains") &&
    sidepanelPatternsText.includes("打开 X 文章页后，xPoster 会在页面内询问包含 $2 的文件夹。") &&
    !sidepanelPatternsText.includes("点击“选择文件夹”，然后选择包含 $2 的文件夹。") &&
    sidepanelMessagesText.includes("Local image path blocked") &&
    sidepanelMessagesText.includes('"Open X": "打开 X"') &&
    sidepanelMessagesText.includes('"Choose folder": "选择文件夹"') &&
    sidepanelMessagesText.includes("打开 X 文章页，xPoster 会在那里询问本地图片文件夹。") &&
    sidepanelMessagesText.includes("正在打开 X 文章页，稍后会在页面内询问本地图片文件夹。") &&
    sidepanelMessagesText.includes("本地图片路径会在 X 页面内询问文件夹。") &&
    sidepanelMessagesText.includes("写入时，xPoster 会在 X 页面内询问本地图片文件夹。") &&
    sidepanelMessagesText.includes('"Choose local image folder": "在 X 页面选择本地图片文件夹"') &&
    sidepanelMessagesText.includes("相对图片路径会在写入时从 X 页面选择一个可读取文件夹。") &&
    !sidepanelMessagesText.includes("本地图片路径需要在设置里选择文件夹。") &&
    !sidepanelMessagesText.includes("选择 Markdown 相对图片路径所在的文件夹。") &&
    !sidepanelMessagesText.includes("选择包含 Markdown 相对图片路径的文件夹。") &&
    sidepanelMessagesText.includes("No folder connected. xPoster will ask when a draft needs local images.") &&
    sidepanelCss.includes("grid-template-columns: 18px minmax(0, 1fr) auto;") &&
    !sidepanelCss.includes(".vault") &&
    sidepanelCss.includes(".drop-status-action") &&
    sidepanelCss.includes(".preflight-action[hidden]"),
  "local image folder access should stay contextual: settings only shows status, preflight shows the action, and writes block before unresolved local assets start"
);
assert.ok(
  sidepanelText.includes("function parseMarkdownForWrite") &&
    sidepanelText.includes("({ parsed, counts } = parseMarkdownForWrite(markdown))") &&
    sidepanelText.includes("const preflightContext = { parsed, counts }") &&
    sidepanelText.includes("buildPreflightChecks(preflightContext)") &&
    sidepanelText.includes("prepareSimpleWriteTarget(parsed, preflightContext)") &&
    !sidepanelText.includes("const parsed = ensureLatestParsedFromDraft();"),
  "writes should parse the Markdown argument being written instead of relying on stale global editor analysis"
);
assert.ok(
  contentScriptText.includes("[/^Uploading image (\\d+)\\/(\\d+)\\.\\.\\.$/, \"正在上传图片 $1/$2...\"]") &&
    contentScriptText.includes("waiting for X to finish") &&
    contentScriptText.includes("X 仍在完成媒体编号") &&
    contentScriptText.includes("正在设置封面") &&
    contentScriptText.includes("正在清理写入标记") &&
    contentScriptText.includes("\"Stop\": \"停止\"") &&
    contentScriptText.includes("\"Stopping...\": \"正在停止...\""),
  "X page upload progress and stop controls should stay localized in Chinese"
);
assert.ok(
  sidepanelText.includes("Replace unreachable image URLs with public links, then write again if those images must upload.") &&
    sidepanelPatternsText.includes("body image\\(s\\) stayed as Markdown links; (.+) image\\(s\\) are in the editor while X finishes media IDs") &&
    sidepanelPatternsText.indexOf("body image\\(s\\) kept as Markdown links; (.+) image\\(s\\) are in the editor while X finishes media IDs") <
      sidepanelPatternsText.indexOf("body image\\(s\\) kept as Markdown links; (.+)\\/"),
  "completion summaries should keep pending X media IDs visible alongside media warning text"
);
assert.ok(
    sidepanelText.includes("function writeOptionsPayload") &&
    sidepanelText.includes("let importOptions = { setTitle: true, setCover: false, allowGraphqlMetadata: false, smartPunctuation: false }") &&
    !sidepanelHtml.includes('id="importCoverOption" checked') &&
    sidepanelText.includes("sourceFileName = \"\"") &&
    sidepanelText.includes("celebrateOnComplete = true") &&
    sidepanelText.includes("const allowGraphqlMetadata = options.allowGraphqlMetadata === true") &&
    sidepanelText.includes("setCover: allowGraphqlMetadata && options.setCover === true") &&
    sidepanelText.includes("allowGraphqlMetadata,") &&
    sidepanelText.includes("...normalizeImportOptions({") &&
    sidepanelText.includes("sourceFileName") &&
    sidepanelText.includes("forceNewArticle: Boolean(forceNewArticle)") &&
    sidepanelText.includes("celebrateOnComplete: celebrateOnComplete !== false") &&
    sidepanelText.includes("options: writeOptionsPayload({ forceNewArticle: batch, sourceFileName: writeSourceFileName, celebrateOnComplete })") &&
    sidepanelText.includes("const coverEnabled = els.importCoverOption?.checked === true") &&
    sidepanelText.includes("allowGraphqlMetadata: coverEnabled") &&
    contentScriptText.includes("const allowGraphqlMetadata = options.allowGraphqlMetadata === true") &&
    contentScriptText.includes("setCover: allowGraphqlMetadata && options.setCover === true") &&
    contentScriptText.includes("allowGraphqlMetadata,") &&
    contentScriptText.includes("const forceNewArticle = Boolean(options.forceNewArticle)") &&
    contentScriptText.includes("pastePlan.allowGraphqlMetadata = importOptions.allowGraphqlMetadata === true") &&
    contentScriptText.includes("const coverSource = importOptions.allowGraphqlMetadata === true ? limitedParsed.cover || \"\" : \"\"") &&
    contentScriptText.includes('if (origin !== "paste" && (forceNewArticle || !findEditor()))') &&
    contentScriptText.includes("await ensureEditorReadyForFileImport({ forceNew: forceNewArticle })") &&
    contentScriptText.includes("async function ensureEditorReadyForFileImport({ forceNew = false } = {})") &&
    contentScriptText.includes("if (!forceNew && isEditorRoute() && findEditor()) return;") &&
    mainWorldText.includes("const allowGraphqlMetadata = payload.allowGraphqlMetadata === true") &&
    mainWorldText.includes("if (articleId && allowGraphqlMetadata && !summary.title.graphql?.ok)") &&
    mainWorldText.includes("if (!allowGraphqlMetadata || !title || !articleId || summary.title.graphql?.ok) return false;") &&
    mainWorldText.includes("if (!allowGraphqlMetadata) return false;"),
  "side panel writes should default to UI-only metadata, and cover metadata should require explicit opt-in"
);
assert.ok(
  sidepanelHtml.includes('id="articleExportOptions"') &&
    sidepanelHtml.includes('id="articleExportOption" checked') &&
    sidepanelHtml.includes("Published article Markdown tools") &&
    sidepanelHtml.includes("Copy or download a readable X Article as Markdown from its title area.") &&
    sidepanelRuntimeText.includes('const STORAGE_ARTICLE_EXPORT_SETTINGS = "xposter_article_export_settings"') &&
    sidepanelText.includes("let articleExportOptions = { enabled: true, mode: \"copy\" }") &&
    sidepanelText.includes("function restoreArticleExportOptions") &&
    sidepanelText.includes("function restoreStartupState") &&
    sidepanelText.includes("setArticleExportOptions({") &&
    sidepanelText.includes("applyArticleExportOptions(stored[STORAGE_ARTICLE_EXPORT_SETTINGS] || articleExportOptions)"),
  "settings should expose default-on title-integrated article Markdown tools"
);
assert.ok(
  !sidepanelText.includes('record-icon-action is-disabled'),
  "record history should not render a disabled open-link action when no URL is saved"
);
assert.ok(
  sidepanelCss.includes(".record-history-item:hover .record-title strong") &&
    sidepanelCss.includes(".record-history-item:focus-visible .record-title strong") &&
    sidepanelCss.includes("color: var(--signal-text);") &&
    sidepanelCss.includes(':root[data-theme="dark"] .record-history-item:hover .record-title strong') &&
    sidepanelCss.includes("color: var(--signal);"),
  "record titles should turn blue on hover and keyboard focus for clearer item affordance"
);
assert.ok(
  sidepanelText.includes('class="record-file-name"'),
  "record history should render source file names in their own metadata line"
);
assert.ok(
  !sidepanelText.includes('class="record-use-button"') &&
    !sidepanelText.includes('data-record-action="restore"') &&
    !sidepanelCss.includes(".record-use-button") &&
    sidepanelText.includes('primaryLabel: "Use draft"') &&
    sidepanelText.includes("function restoreRecordMarkdownText"),
  "record cards should not show a prominent Use button; restore should stay inside the edit sheet"
);
assert.ok(
  sidepanelHtml.includes('class="record-search-meta"') &&
    sidepanelHtml.includes('id="recordClearConfirm"') &&
    sidepanelHtml.includes('id="confirmRecordClear"') &&
    sidepanelHtml.includes('id="cancelRecordClear"') &&
    sidepanelHtml.includes('class="record-clear-wrap" hidden') &&
    sidepanelHtml.includes('class="record-clear-button"') &&
    !sidepanelHtml.includes('class="secondary compact danger record-clear-button"') &&
    sidepanelHtml.indexOf('id="recordHistoryMeta"') < sidepanelHtml.indexOf('id="clearRecordHistory"') &&
    sidepanelHtml.indexOf('id="clearRecordHistory"') < sidepanelHtml.indexOf('id="recordHistoryList"'),
  "record history should expose clear-all inside the metadata toolbar with inline confirmation beside the draft count"
);
assert.ok(
  sidepanelCss.includes(".record-search-meta") &&
    sidepanelCss.includes("grid-template-columns: minmax(0, 1fr) auto;") &&
    sidepanelCss.includes("#recordHistoryMeta::before") &&
    sidepanelCss.includes(".record-clear-button") &&
    sidepanelCss.includes(".record-clear-wrap[hidden]") &&
    sidepanelCss.includes("border-radius: 0;") &&
    sidepanelCss.includes("text-decoration: none;"),
  "record history metadata toolbar should keep balanced two-column alignment and avoid underlined clear-all text"
);
assert.ok(
  sidepanelText.includes("function openRecordClearConfirm") &&
    sidepanelText.includes("function closeRecordClearConfirm") &&
    sidepanelText.includes("function setRecordClearActionState") &&
    sidepanelText.includes("function recordHistoryMetaText") &&
    sidepanelText.includes("function recordSearchSummaryText") &&
    sidepanelText.includes("const recordSearchTextCache = new WeakMap();") &&
    sidepanelText.includes("function cachedRecordSearchText(record)") &&
    sidepanelText.includes("if (cached?.language === currentLanguage) return cached.text;") &&
    sidepanelText.includes("recordSearchTextCache.set(record, { language: currentLanguage, text });") &&
    sidepanelText.includes("function recordHistoryView()") &&
    sidepanelText.includes("const visibleRecords = [];") &&
    sidepanelText.includes("for (const record of recordHistory) {") &&
    sidepanelText.includes("if (!recordHasMarkdown(record)) continue;") &&
    sidepanelText.includes("const haystack = cachedRecordSearchText(record);") &&
    sidepanelText.includes("visibleRecords.push(record);") &&
    sidepanelText.includes("return { total, visibleRecords, isSearching: terms.length > 0 };") &&
    sidepanelText.includes("const pendingIds = new Set(pending.map((item) => item.id));") &&
    sidepanelText.includes("storedHistory.filter((item) => !pendingIds.has(item.id))") &&
    sidepanelText.includes("const { total, visibleRecords, isSearching } = recordHistoryView();") &&
    sidepanelText.includes('const recordClearWrap = els.clearRecordHistory?.closest(".record-clear-wrap") || null;') &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.recordClearConfirm, "hidden", false)') &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.recordClearConfirm, "hidden", true)') &&
    sidepanelText.includes('setAttributeValueIfChanged(els.clearRecordHistory, "aria-expanded", "true")') &&
    sidepanelText.includes('setAttributeValueIfChanged(els.clearRecordHistory, "aria-expanded", "false")') &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.clearRecordHistory, "disabled", !hasRecoverableRecords)') &&
    sidepanelText.includes('setBooleanPropertyIfChanged(recordClearWrap, "hidden", !hasRecoverableRecords)') &&
    sidepanelText.includes("setSourceHtmlIfChanged(els.recordHistoryList, recordHistoryHtml)") &&
    sidepanelText.includes("setTextContentIfChanged(els.recordHistoryMeta, recordHistoryMetaText(recordCounts))") &&
    sidepanelText.includes('setDatasetValueIfChanged(els.recordSearchSummary, "i18n", searchSummary)') &&
    !sidepanelText.includes("els.recordHistoryList.innerHTML = visibleRecords.map(renderRecordHistoryItem).join(\"\")") &&
    !sidepanelText.includes("els.recordHistoryMeta.textContent = recordHistoryMetaText(recordCounts)") &&
    !sidepanelText.includes("function filteredRecordHistory()") &&
    !sidepanelText.includes("const recoverableRecords = recordHistory.filter(recordHasMarkdown)") &&
    !sidepanelText.includes("storedHistory.filter((item) => !pending.some((pendingItem) => pendingItem.id === item.id))") &&
    !sidepanelText.includes("const visibleRecords = filteredRecordHistory().filter(recordHasMarkdown)") &&
    !sidepanelText.includes("const haystack = recordSearchText(record);") &&
    !sidepanelText.includes("recordClearWrap.hidden = !hasRecoverableRecords") &&
    !sidepanelText.includes("els.recordClearConfirm.hidden = false") &&
    !sidepanelText.includes("els.recordClearConfirm.hidden = true") &&
    !sidepanelText.includes('els.clearRecordHistory.setAttribute("aria-expanded", "true")') &&
    !sidepanelText.includes('els.clearRecordHistory.setAttribute("aria-expanded", "false")') &&
    sidepanelText.includes("handleRecordClearDismiss") &&
    sidepanelText.includes('els.confirmRecordClear?.addEventListener("click", clearRecordHistory)'),
  "record clear-all and record history refreshes should use changed-only DOM writes with a dismissible second confirmation"
);
assert.ok(
  /\.draft-editor-status\s*\{[\s\S]*?grid-row:\s*3;[\s\S]*?background:\s*var\(--paper\);/.test(sidepanelCss) &&
    /body\s*\{[\s\S]*?height:\s*100vh;[\s\S]*?height:\s*100dvh;[\s\S]*?overflow:\s*hidden;/.test(sidepanelCss) &&
    /\.shell\s*\{[\s\S]*?height:\s*100vh;[\s\S]*?height:\s*100dvh;[\s\S]*?min-height:\s*0;/.test(sidepanelCss) &&
    /\.panel\.active\s*\{[\s\S]*?overflow:\s*auto;/.test(sidepanelCss) &&
    /\.composer\.panel\.active\s*\{[\s\S]*?overflow:\s*hidden;/.test(sidepanelCss) &&
    sidepanelCss.includes("grid-template-rows: auto minmax(0, 1fr) auto;") &&
    sidepanelCss.includes("height: 100%;\n  max-height: 100%;\n  overflow: auto;") &&
    !sidepanelCss.includes("position: absolute;\n  inset-inline: 0;\n  bottom: 0;") &&
    !sidepanelCss.includes(':root[data-theme="dark"] .draft-editor-status'),
  "draft editor status bar should stay in the fixed bottom grid row while the preview body scrolls independently"
);
assert.ok(
  /\.progress-meter span\s*\{[\s\S]*?width:\s*100%;[\s\S]*?transform:\s*scaleX\(0\);[\s\S]*?transition:\s*transform 180ms ease-out, background-color 180ms ease-out;/.test(sidepanelCss) &&
    sidepanelText.includes('function setStyleValueIfChanged(node, property, value)') &&
    sidepanelText.includes('function setLocalizedTextIfChanged(node, source)') &&
    sidepanelText.includes('function syncStatusRow(item, { tone, label, detail, status } = {})') &&
    sidepanelText.includes('setStyleValueIfChanged(els.liveProgressBar, "transform", `scaleX(${percent / 100})`);') &&
    sidepanelText.includes('setLocalizedTextIfChanged(els.liveProgressTitle, state.text || "Nothing is running");') &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.cancelImport, "hidden", !cancellable);') &&
    !sidepanelCss.includes("transition: width 180ms ease-out") &&
    !sidepanelText.includes("els.liveProgressBar.style.width ="),
  "live progress meter should animate with transform and avoid redundant DOM writes on repeated progress updates"
);
assert.ok(
  sidepanelText.includes('data-record-action="delete-record"') &&
    sidepanelText.includes("function removeRecordHistoryItem") &&
    sidepanelText.includes('log("Record deleted.")') &&
    sidepanelMessagesText.includes('"Clear this record."') &&
    sidepanelMessagesText.includes('"Record deleted."') &&
    sidepanelCss.includes(".record-delete-action") &&
    sidepanelCss.includes(".record-delete-action svg") &&
    sidepanelCss.includes("fill: none;") &&
    sidepanelCss.includes("stroke-linejoin: round;") &&
    sidepanelCss.includes("transition-delay: 0s, 0s, 620ms, 620ms, 620ms;") &&
    sidepanelCss.includes(".record-history-item:focus-within .record-delete-action") &&
    sidepanelCss.includes(".record-delete-action:hover") &&
    sidepanelText.includes('M4.8 7h14.4'),
  "record cards should reveal a delayed per-record clear action that removes only that saved record"
);
assert.ok(
  !sidepanelHtml.includes('data-i18n="Clear saved record history from this browser."') &&
    !sidepanelHtml.includes('data-i18n="Clear records">Clear records</button>'),
  "settings should not duplicate the record clearing action"
);
assert.ok(
  sidepanelHtml.includes("Recent publish record") &&
    sidepanelHtml.includes("Copy summary") &&
    sidepanelHtml.includes("Technical details") &&
    sidepanelHtml.includes("No technical record saved yet.") &&
    sidepanelHtml.includes('id="copyExtensionPath" hidden') &&
    sidepanelHtml.includes('id="extensionPath" hidden') &&
    !sidepanelHtml.includes("<h2>Saved result checklist</h2>"),
  "saved results should read as a user-facing publish record, with technical details hidden by default"
);
assert.ok(
    sidepanelHtml.includes('<option value="auto">Automatic</option>') &&
    sidepanelHtml.includes('<option value="zh-TW">繁體中文</option>') &&
    sidepanelHtml.includes('<option value="ja">日本語</option>') &&
    sidepanelHtml.includes('<option value="fr">Français</option>') &&
    sidepanelHtml.includes('<option value="ru">Русский</option>') &&
    sidepanelHtml.includes('id="languageSelectButton"') &&
    sidepanelHtml.includes('id="languageOptionsList"') &&
    sidepanelText.includes("let languageOptionButtons = [];") &&
    sidepanelText.includes("function populateLanguageSelect") &&
    sidepanelText.includes("function languageOptionLabel") &&
    sidepanelText.includes("function collectLanguageOptionButtons()") &&
    sidepanelText.includes("function handleLanguageOptionsKeydown") &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.languageOptionsList, "hidden", true)') &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.languageOptionsList, "hidden", false)') &&
    sidepanelText.includes('setAttributeValueIfChanged(els.languageSelectButton, "aria-expanded", "false")') &&
    sidepanelText.includes('setAttributeValueIfChanged(els.languageSelectButton, "aria-expanded", "true")') &&
    sidepanelText.includes("setTextContentIfChanged(els.languageSelectValue, selectedLabel)") &&
    sidepanelText.includes("languageOptionButtons.forEach((button) =>") &&
    sidepanelText.includes('const selected = languageOptionButtons.find((button) => button.getAttribute("aria-selected") === "true");') &&
    sidepanelText.includes("const options = languageOptionButtons;") &&
    sidepanelText.includes('setAttributeValueIfChanged(button, "aria-selected", selected ? "true" : "false")') &&
    sidepanelText.includes('setNumericPropertyIfChanged(button, "tabIndex", selected ? 0 : -1)') &&
    sidepanelText.includes('setNumericPropertyIfChanged(option, "tabIndex", index === nextIndex ? 0 : -1)') &&
    sidepanelText.includes("setSourceHtmlIfChanged(els.languageSelect, selectHtml)") &&
    sidepanelText.includes("setSourceHtmlIfChanged(els.languageOptionsList, optionsHtml)") &&
    sidepanelText.includes("languageOptionButtons = collectLanguageOptionButtons();") &&
    !sidepanelText.includes("els.languageOptionsList.hidden = true") &&
    !sidepanelText.includes("els.languageOptionsList.hidden = false") &&
    !sidepanelText.includes('els.languageSelectButton.setAttribute("aria-expanded", "false")') &&
    !sidepanelText.includes('els.languageSelectButton.setAttribute("aria-expanded", "true")') &&
    !sidepanelText.includes("els.languageSelectValue.textContent = selectedLabel") &&
    !sidepanelText.includes('els.languageOptionsList.querySelectorAll("[data-language-option]").forEach') &&
    !sidepanelText.includes('const selected = els.languageOptionsList.querySelector(\'[aria-selected="true"]\')') &&
    !sidepanelText.includes('const options = Array.from(els.languageOptionsList.querySelectorAll("[data-language-option]"))') &&
    !sidepanelText.includes('button.setAttribute("aria-selected", selected ? "true" : "false")') &&
    !sidepanelText.includes("button.tabIndex = selected ? 0 : -1") &&
    !sidepanelText.includes("option.tabIndex = index === nextIndex ? 0 : -1") &&
    !sidepanelText.includes("els.languageSelect.innerHTML = options") &&
    !sidepanelText.includes("els.languageOptionsList.innerHTML = options") &&
    sidepanelText.includes("i18n.languageOptions()") &&
    sidepanelCss.includes(".language-option") &&
    sidepanelCss.includes("text-align: center;") &&
    sidepanelText.includes("window.xPosterSidepanelMessages?.register?.(i18n, shared") &&
    sidepanelMessagesText.includes("window.xPosterSidepanelMessages = { register }") &&
    sidepanelText.includes("const sidepanelPatterns = window.xPosterSidepanelPatterns") &&
    sidepanelPatternsText.includes("window.xPosterSidepanelPatterns") &&
    sidepanelMessagesText.includes('"zh-TW": Object.fromEntries') &&
    sidepanelText.includes("function isChineseLanguage") &&
    sidepanelText.includes("shared.toTraditionalChinese") &&
    sharedText.includes("function toTraditionalChinese") &&
    diagnosticsHtmlIncludesSharedFirst() &&
    sidepanelText.includes('setLocalizedTextIfChanged(els.runPreflight, "Checking...")') &&
    sidepanelText.includes('setLocalizedTextIfChanged(els.evidenceMeta, "No technical record saved yet.")') &&
    sidepanelText.includes("localizeInterpolated(\"Local image folder setup failed: {error}\""),
  "side panel language selection should support auto and global languages while keeping dynamic status text localized"
);
assert.ok(
  sidepanelText.includes("function buildPublishRecordSummary") &&
    sidepanelText.includes("xPoster publish record") &&
    sidepanelMessagesText.includes("Publish summary copied.") &&
    sidepanelMessagesText.includes("Draft saved") &&
    sidepanelMessagesText.includes("Write result"),
  "copying the saved result should produce a readable publish summary instead of internal proof JSON"
);
assert.ok(
  sidepanelText.includes("function showQueuedDraftAdded") &&
    sidepanelMessagesText.includes("new draft") &&
    sidepanelMessagesText.includes("total in queue"),
  "queue feedback should explicitly tell users when drafts are added"
);
assert.ok(
  sidepanelText.includes("function formatCompactCount") &&
    sidepanelText.includes("function formatCompactUnit") &&
    sidepanelText.includes('formatCompactUnit(record.characters, "char", "chars", "字")') &&
    sidepanelText.includes('formatCompactUnit(item.characters || 0, "char", "chars", "字符")') &&
    sidepanelText.includes("function queueItemMediaSummary") &&
    sidepanelText.includes("function queueItemExcerpt") &&
    sidepanelText.includes("function queueItemDisplayTitle") &&
    sidepanelText.includes("function queueItemById(id)") &&
    sidepanelText.includes("function activeQueueItem()") &&
    sidepanelText.includes("function clearMissingActiveQueueItem()") &&
    sidepanelText.includes("return id ? draftQueue.find((item) => item.id === id) || null : null;") &&
    sidepanelText.includes("const activeItem = activeQueueItem();") &&
    sidepanelText.includes("clearMissingActiveQueueItem();") &&
    sidepanelText.includes("function renderQueueItemMeta") &&
    sidepanelText.includes('data-media="${safe(mediaSummary.tone)}"') &&
    sidepanelText.includes('class="draft-queue-excerpt"') &&
    sidepanelText.includes('class="draft-queue-fact"') &&
    sidepanelMessagesText.includes('"Too many images: remove {extra}"') &&
    sidepanelText.includes("media.tone === \"danger\"") &&
    sidepanelText.includes("formatCompactCount(total, { zhTenThousand: false })") &&
    sidepanelText.includes("setLocalizedTextIfChanged(els.draftQueueMeta, queueSummaryText())") &&
    sidepanelText.includes("setSourceHtmlIfChanged(els.draftQueueList, \"\")") &&
    sidepanelText.includes("const queueHtml = draftQueue.map((item, index) =>") &&
    sidepanelText.includes("if (setSourceHtmlIfChanged(els.draftQueueList, queueHtml)) translateDynamicDom(els.draftQueue);") &&
    sidepanelText.includes("draft-queue-copy") &&
    sidepanelText.includes("draft-queue-remove") &&
    sidepanelText.includes("function removeDraftQueueItem") &&
    sidepanelText.includes('data-queue-action="remove"') &&
    sidepanelMessagesText.includes('"Remove draft"') &&
    sidepanelMessagesText.includes('"Queued draft removed."') &&
    !sidepanelText.includes("els.draftQueueList.innerHTML = \"\"") &&
    !sidepanelText.includes("els.draftQueueList.innerHTML = draftQueue.map") &&
    !sidepanelText.includes("els.draftQueueMeta) setLocalizedText(els.draftQueueMeta") &&
    !sidepanelText.includes("!draftQueue.some((item) => item.id === activeQueueItemId)") &&
    !sidepanelText.includes("!draftQueue.some((entry) => entry.id === activeQueueItemId)") &&
    !sidepanelText.includes('class="record-icon-action draft-queue-edit"') &&
    !sidepanelText.includes('class="draft-queue-source"') &&
    !sidepanelText.includes('"Source: {name}"') &&
    !sidepanelText.includes('"No images":') &&
    !sidepanelText.includes('"Near image limit"') &&
    sidepanelCss.includes(".draft-queue-excerpt") &&
    sidepanelCss.includes(".draft-queue-remove") &&
    sidepanelCss.includes("grid-template-rows: auto auto auto;") &&
    sidepanelCss.includes("min-height: 72px;") &&
    !sidepanelCss.includes(".draft-queue-source") &&
    !sidepanelCss.includes(".draft-queue-actions {\n    grid-column: 1 / -1;") &&
    sidepanelCss.includes(".draft-queue-item:hover") &&
    sidepanelCss.includes(".draft-queue-item:focus-within") &&
    sidepanelCss.includes('.draft-queue-item[data-media="danger"]') &&
    !sidepanelCss.includes('.draft-queue-fact[data-tone="warn"]') &&
    sidepanelCss.includes(".draft-queue-index"),
  "record and queue stats should use compact counts, queue items should warn only for over-limit media, and hover/focus should show clear item affordance"
);
assert.ok(
    sidepanelText.includes('if (counts.image) parts.push(formatCompactUnit(counts.image, "image", "images", "图"))') &&
    sidepanelText.includes('if (counts.table) parts.push(formatCompactUnit(counts.table, "table", "tables", "表"))') &&
    sidepanelText.includes('formatCompactUnit(length, "char", "chars", "字符")') &&
    sidepanelText.includes("Web images: ${remoteCount}") &&
    !sidepanelText.includes("Images: ${imageCount}") &&
    !sidepanelText.includes("Unreachable images stay as links.") &&
    !sidepanelText.includes("draftTargetStateText") &&
    !sidepanelText.includes("function draftEditorModeLabel") &&
    !sidepanelHtml.includes('id="draftTargetState"') &&
    !sidepanelHtml.includes('id="draftBrief"') &&
    sidepanelHtml.includes('id="draftEditorModeToggle"') &&
    sidepanelHtml.includes("data-editor-mode-toggle") &&
    !sidepanelHtml.includes('id="draftEditorModeLabel"') &&
    !sidepanelHtml.includes('data-editor-mode="edit"') &&
    !sidepanelHtml.includes('data-editor-mode="read"') &&
    !sidepanelHtml.includes('data-editor-mode="check"') &&
    !sidepanelCss.includes(".draft-brief") &&
    sidepanelCss.includes(".draft-editor-status"),
  "draft editor should keep one status Write/Read toggle and avoid duplicate recognized-summary or Check rows"
);
assert.ok(
  contentScriptText.includes("message.options || {}"),
  "content script should apply title and cover options sent by the side panel"
);
{
  const titleBeforeBody =
    mainWorldText.indexOf("await applyTitleMetadata(payload.title, articleId, summary, { allowGraphqlMetadata });") <
    mainWorldText.indexOf('progress("Pasting structured Markdown...")');
  const orderedImageOps =
    mainWorldText.includes('const imageOps = (payload.plan || []).filter((item) => item.op.type === "image");') &&
    !mainWorldText.includes("function orderImageOperationsForMetadata") &&
    !mainWorldText.includes("coverPriorityForImageOperation");
  const coverAfterUpload =
    mainWorldText.indexOf("await applyCoverMetadata(payload.cover, articleId, upload, summary, { allowGraphqlMetadata });") >
    mainWorldText.indexOf("const result = await uploadImageAtMarker");
  const timelineMetadataFirst =
    sidepanelHtml.indexOf('data-timeline-step="metadata"') < sidepanelHtml.indexOf('data-timeline-step="media"') &&
    sidepanelHtml.indexOf('data-timeline-step="metadata"') < sidepanelHtml.indexOf('data-timeline-step="paste"');
  assert.ok(
    titleBeforeBody &&
      orderedImageOps &&
      coverAfterUpload &&
      timelineMetadataFirst &&
      mainWorldText.includes("upload.coverOnly && !coverUpload") &&
      mainWorldText.includes("coverUpload?.coverOnly && coverUpload.blockKey") &&
      !mainWorldText.includes("coverUpload?.blockKey && (coverUpload.coverOnly || summary.cover.graphql?.ok)") &&
      mainWorldText.includes("if (!nextText.trim()) return deleteBlockByKey(draftNode, blockKey).ok;") &&
      sidepanelText.includes("Title is set first; body images keep Markdown order, and the cover is matched after upload.") &&
      sidepanelText.includes("Setting article title and matching cover after ordered uploads.") &&
      !sidepanelText.includes("Setting the title and cover after the body import."),
    "article import should set title first while preserving Markdown image order and cleaning temporary cover blocks"
  );
}
assert.ok(
  sidepanelHtml.includes("https://github.com/nevertoday/xposter"),
  "settings should link to the GitHub project page"
);
assert.ok(
  sidepanelHtml.includes("https://x.com/xiaoxiaodong01"),
  "settings should link to the author X profile"
);
assert.ok(
  includesAll(sidepanelHtml, [
    "vendor/minigfm.min.js",
    "src/sidepanel-config.js",
    "src/sidepanel-elements.js",
    "src/sidepanel-editor.js",
    "src/sidepanel-messages.js",
    "src/sidepanel-patterns.js",
    'id="draftEditorToolbar"',
    'id="draftEditorStatus"',
    'id="draftEditorModeToggle"',
    'id="draftEditorStats"',
    "data-editor-mode-toggle",
    'class="editor-command-icon"',
    'id="draftInlinePreview"',
    'class="draft-editor-input-wrap"',
    'id="draftSyntaxHighlight"',
    '<textarea id="markdown"'
  ]) &&
    excludesAll(sidepanelHtml, [
      ">Link</button>",
      ">Image</button>",
      ">Table</button>",
      "vendor/codemirror-editor.bundle.js",
      'id="draftEditorModeLabel"',
      'data-editor-mode="edit"',
      'data-editor-mode="read"',
      'data-editor-mode="check"',
      'id="draftBrief"'
    ]) &&
    includesAll(sidepanelRuntimeText, [
      'DRAFT_EDITOR_MODES:',
      'new Set(["edit", "read"])',
      "function draftText()",
      "function miniGfm()",
      "function protectReadPreviewCodeBlocks",
      "function restoreReadPreviewCodeBlocks",
      "function protectReadPreviewImages",
      "function restoreReadPreviewImages",
      "function findReadPreviewClosingParen",
      "function sanitizePreviewHtml",
      "function wrapPreviewImages",
      "function markPreviewImageUnavailable",
      "function markPreviewImageLoaded",
      "shared.stripMarkdownFrontmatter(markdown)",
      "const { protectedMarkdown: codeProtectedMarkdown, codeBlocks } = protectReadPreviewCodeBlocks(visibleMarkdown);",
      "const { protectedMarkdown, images } = protectReadPreviewImages(codeProtectedMarkdown);",
      "restoreReadPreviewImages(renderer.parse(protectedMarkdown), images)",
      "Only frontmatter metadata is present. It will not be written as article body.",
      "Image preview unavailable",
      "const schemeMatch = raw.match",
      "return /^(https?|mailto|tel|ftp)$/i.test(schemeMatch[1]) ? raw : \"\";",
      "function markdownSegmentCounts",
      "function editorStatsText",
      "function updateDraftEditorStatus",
      "function updateEditorModeToggle",
      "function collectEditorCommandButtons(toolbar)",
      "const draftEditorCommandButtons = collectEditorCommandButtons(els.draftEditorToolbar);",
      "const recordEditCommandButtons = collectEditorCommandButtons(els.recordEditToolbar);",
      'setDatasetValueIfChanged(button, "nextMode", nextMode)',
      'setAttributeValueIfChanged(button, "aria-pressed", isRead ? "true" : "false")',
      'setAttributeValueIfChanged(button, "title", localizeText(nextLabel))',
      "let latestParsedMarkdown = \"\"",
      "const counts = latestParsedMarkdown === text ? latestCounts : shared.segmentCounts([]);",
      "setLocalizedTextIfChanged(els.draftEditorStats, editorStatsText(text, counts))",
      "syncVisibilityState(els.draftEditorInputWrap, isPreview || hasQueue)",
      "draftEditorCommandButtons.forEach((button) =>",
      "setBooleanPropertyIfChanged(button, \"disabled\", !isEdit || hasQueue)",
      "function setDraftText(markdown",
      'setPropertyValueIfChanged(els.markdown, "value", text)',
      "else if (draftText().trim()) scheduleAnalyzeDraft(STARTUP_DRAFT_ANALYZE_DELAY_MS);",
      "function handleDraftEditorInput",
      "function setDraftEditorMode(mode = \"edit\", { syntax = \"now\" } = {})",
      "function updateDraftEditorModeToggle",
      "function updateDraftEditorDensity",
      "function countMeaningfulMarkdownLines(text)",
      "const meaningfulLines = countMeaningfulMarkdownLines(value);",
      "function plainDraftSyntaxText",
      "function renderMarkdownSyntaxHighlight",
      "function renderDraftSyntaxHighlight",
      "SYNTAX_HIGHLIGHT_DETAIL_LIMIT",
      "setTextContentIfChanged(target, value);",
      "setSourceHtmlIfChanged(target, html);",
      "setTextContentIfChanged(els.draftSyntaxHighlight, value);",
      "function highlightInlineMarkdownSyntax",
      "function syncDraftSyntaxScroll",
      "function syncScrollPositionIfChanged(target, source)",
      'syncScrollPositionIfChanged(els.draftSyntaxHighlight, els.markdown)',
      'els.markdown.addEventListener("scroll", syncDraftSyntaxScroll)',
      "if (length) parts.push(formatCompactUnit(length, \"char\", \"chars\", \"字符\"));",
      "function translateVisibleWorkspace()",
      "translateVisibleWorkspace();",
      "translateDynamicDom(panel, { syncEnvironment: false })",
      "function setClassPresenceIfChanged(node, className, present)",
      "function acknowledgeDraftInput()",
      'setClassPresenceIfChanged(target, "draft-ack", false)',
      'setClassPresenceIfChanged(target, "draft-ack", true)',
      'const workspaceTabs = [...document.querySelectorAll(".tab")]',
      'const workspacePanels = [...document.querySelectorAll(".panel")]',
      'const workspaceTopbar = document.querySelector(".topbar")',
      'const workspaceTabsContainer = document.querySelector(".tabs")',
      "translateDynamicDom(workspaceTopbar || document.body, { syncEnvironment: false })",
      "translateDynamicDom(workspaceTabsContainer || document.body, { syncEnvironment: false })",
      'if (panel.classList.contains("active")) translateDynamicDom(panel, { syncEnvironment: false });',
      "function removeStylePropertyIfChanged(node, property)",
      "function runAfterFirstPaint(callback)",
      "function shouldPollPageState",
      "function pollPageState",
      "if (!shouldPollPageState()) return;",
      "else pollPageState();",
      "window.setInterval(pollPageState, 2500);",
      "function activeWorkspaceTarget(target = \"draft\")",
      "function workspaceTargetIndex(target)",
      "function syncWorkspaceTabs(target)",
      "function syncPanelItemMotion(panel)",
      "removeStylePropertyIfChanged(child, \"--panel-item-index\")",
      "setStylePropertyIfChanged(child, \"--panel-item-index\", index)",
      "function restartPanelMotion(panel)",
      "if (!panel || prefersReducedMotion()) return;",
      "function syncWorkspacePanels(target)",
      "function hydrateWorkspacePanel(target)",
      "const nextTarget = activeWorkspaceTarget(target);",
      "syncWorkspaceTabs(nextTarget);",
      "const targetPanels = syncWorkspacePanels(nextTarget);",
      "hydrateWorkspacePanel(nextTarget);",
      'setStylePropertyIfChanged(workspaceTabsContainer, "--tab-count", Math.max(workspaceTabs.length, 1))',
      'setClassPresenceIfChanged(tab, "active", tab.dataset.tab === target)',
      'setClassPresenceIfChanged(panel, "active", isActive)',
      'setClassPresenceIfChanged(els.draftPanel, "drag-active", true)',
      'setClassPresenceIfChanged(els.draftPanel, "drag-active", false)',
      "workspaceTabs.forEach((tab) =>",
      "function formatCompactNumber",
      'const tenThousandUnit = currentLanguage === "zh-TW" ? "萬" : "万";',
      'setDatasetValueIfChanged(els.draftPanel, "queueMode", hasQueue ? "true" : "false")',
      'setBooleanPropertyIfChanged(els.draftEditorShell, "hidden", hasQueue)',
      'setDatasetValueIfChanged(els.draftEditorShell, "density", isCompact ? "compact" : "roomy")',
      "function runWhenIdle(callback, timeout = STARTUP_IDLE_TIMEOUT_MS)",
      "function restoreSingleDraftMarkdown(markdown, { analyze = true } = {})",
      "setDraftText(text, { preview: false, syntax: \"defer\" });",
      "setDraftEditorMode(\"edit\", { syntax: \"none\" });",
      "function syncDraftSurface({ syntax = null } = {})",
      "syncDraftSurface({ syntax: \"none\" });",
      "setDraftEditorMode(draftEditorMode, { syntax: syntax || (draftSyntaxIdleHandle ? \"defer\" : \"now\") });",
      "if (syntax === \"defer\") scheduleDraftSyntaxHighlight();",
      "else if (syntax === \"none\") cancelDeferredDraftSyntaxHighlight();",
      "function scheduleDraftSyntaxHighlight",
      'setDatasetValueIfChanged(els.draftInlinePreview, "previewMode", "read")',
      'setLocalizedTextIfChanged(els.draftInlinePreviewTitle, "Reading preview")',
      'setLocalizedTextIfChanged(els.draftInlinePreviewMeta, "Paste Markdown to read it here.")',
      "setSourceHtmlIfChanged(els.draftInlinePreviewBody, emptyMarkdownPreviewHtml())",
      "setSourceHtmlIfChanged(els.draftInlinePreviewBody, markdownPreviewHtml(text))",
      'els.draftInlinePreview?.addEventListener("error"',
      'els.draftInlinePreview?.addEventListener("load"',
      "function paintStartupShell",
      "runAfterFirstPaint(() =>",
      "restoreStartupState().catch(() => analyzeDraft());",
      "function restoreStartupState",
      "function startupStorage",
      "STARTUP_STORAGE_KEYS",
      "scheduleAnalyzeDraft(STARTUP_DRAFT_ANALYZE_DELAY_MS);",
      "function ensureRecordHistoryRestored({ render = false } = {})",
      "function scheduleRecordHistoryRestore()",
      "pendingRecordHistoryEntries",
      "function syncLatestEvidenceRecord()",
      "function syncRecordPanel({ translate = els.recordsPanel?.classList.contains(\"active\") } = {})",
      "syncRecordPanel({ translate: false });",
      "restoreRecordHistory({ render })",
      "ensureRecordHistoryRestored({ render: false }).then(() =>",
      'if (target === "records") {',
      "void ensureRecordHistoryRestored({ render: true }).then(() =>",
      "syncRecordPanel({ translate: true });",
      'setBooleanPropertyIfChanged(details, "open", true)',
      "function updateInlinePreview",
      "function updateRecordEditorMode",
      "function updateRecordEditPreview",
      "function handleRecordEditorInput",
      "function handleTextareaUndoShortcut",
      "function syncProgrammaticUndoFallback",
      "function clearProgrammaticHistoryOnTextInput",
      "EDITOR_HISTORY_LIMIT: 40",
      "function applyTextareaCommand",
      "return importMarkdownDraft(draftText(), { sourceFileName: activeDraftSourceFileName });",
      "els.draftEditorModeToggle?.addEventListener"
    ]) &&
    excludesAll(sidepanelText, [
      'isChineseLanguage() ? "k" : "K"',
      'isChineseLanguage() ? "m" : "M"',
      "window.xPosterCodeMirror",
      "lineNumbers",
      "if (els.markdown && els.markdown.value !== text) els.markdown.value = text",
      "return importMarkdownDraft(els.markdown.value)",
      'tab.classList.toggle("active", index === activeTabIndex)',
      'panel.classList.toggle("active", isActive)',
      'els.draftPanel.classList.add("drag-active")',
      'els.draftPanel.classList.remove("drag-active")',
      'target.classList.remove("draft-ack")',
      'target.classList.add("draft-ack")',
      "details.open = true",
      'const tabs = [...document.querySelectorAll(".tab")]',
      'document.querySelectorAll(".panel").forEach((panel) =>',
      'document.querySelectorAll(".tab").forEach((tab) =>',
      'translateDynamicDom(document.querySelector(".topbar") || document.body)',
      'translateDynamicDom(document.querySelector(".tabs") || document.body)',
      'document.querySelectorAll(".panel.active").forEach((panel) => translateDynamicDom(panel))',
      "window.setInterval(refreshPageState, 2500)",
      ".forEach((panel) => translateDynamicDom(panel));",
      'els.draftEditorToolbar?.querySelectorAll("[data-editor-command]")',
      'els.recordEditToolbar?.querySelectorAll("[data-editor-command]")',
      "els.draftInlinePreviewBody.innerHTML = emptyMarkdownPreviewHtml()",
      "els.draftInlinePreviewBody.innerHTML = markdownPreviewHtml(text)",
      "value.split(/\\r\\n?|\\n/).filter((line) => line.trim()).length",
      "target.textContent = value;",
      "target.innerHTML = html;",
      "els.draftSyntaxHighlight.scrollTop = els.markdown.scrollTop",
      "els.draftSyntaxHighlight.scrollLeft = els.markdown.scrollLeft",
      'els.draftInlinePreview.dataset.previewMode = "read"',
      'els.draftEditorShell.dataset.density = isCompact ? "compact" : "roomy";',
      "setLocalizedText(els.draftEditorStats, editorStatsText(text, markdownSegmentCounts(text)))",
      "setLocalizedTextIfChanged(els.draftEditorStats, editorStatsText(text, markdownSegmentCounts(text)))"
    ]) &&
    includesAll(sidepanelCss, [
      ".draft-editor-toolbar",
      "grid-row: 2;",
      "--draft-editor-roomy-block-size: clamp(260px, calc(100dvh - 292px), 430px);",
      "--draft-editor-compact-block-size: clamp(156px, calc(100dvh - 292px), 220px);",
      "--draft-editor-roomy-block-size: clamp(220px, calc(100dvh - 276px), 390px);",
      "--draft-editor-compact-block-size: clamp(148px, calc(100dvh - 276px), 208px);",
      ".draft-editor-shell[data-density=\"compact\"]",
      "--draft-editor-focus-line: transparent;",
      "--draft-editor-field:",
      "border: 0;",
      ".draft-editor-shell:focus-within",
      ".panel.active {\n  min-height: 0;\n  min-width: 0;\n  display: grid;",
      ".composer.panel.active",
      "align-content: stretch;",
      "grid-template-rows: auto auto minmax(0, 1fr) auto;",
      ".composer {\n  position: relative;\n  height: 100%;\n  min-height: 0;\n  min-width: 0;",
      ".composer[data-queue-mode=\"true\"]",
      ".composer[data-queue-mode=\"true\"] .draft-queue",
      "  .composer {\n    height: 100%;\n    min-height: 0;\n    align-content: stretch;\n    grid-template-rows: auto auto minmax(0, 1fr) auto;",
      "  .composer[data-queue-mode=\"true\"]",
      "box-shadow: 0 -8px 18px color-mix(in oklch, var(--ink), transparent 91%);",
      "box-shadow: 0 7px 16px color-mix(in oklch, var(--button-fill), transparent 88%);",
      "height: 100%;",
      "min-height: 0;",
      "max-height: 100%;",
      ".draft-editor-input-wrap {\n  grid-row: 2;\n  position: relative;",
      ".draft-syntax-highlight",
      "pointer-events: none;",
      "#markdown {\n  position: relative;\n  z-index: 1;",
      "color: var(--ink);",
      "caret-color: var(--ink);",
      "#markdown:focus",
      "caret-color: var(--signal-text);",
      ".draft-editor-input-wrap:focus-within",
      "textarea:not(#markdown):focus-visible",
      ".draft-syntax-highlight {\n  position: absolute;\n  inset: 0;\n  color:",
      "display: none;",
      ".draft-token-heading",
      ".draft-token-image",
      ".draft-token-code",
      '.draft-inline-preview[data-preview-mode="read"]',
      ".draft-inline-preview",
      "overscroll-behavior: contain;",
      "padding: 15px 17px 20px;",
      ".draft-preview-image-fallback",
      '.draft-preview-image[data-preview-state="error"]',
      "--draft-content-font:",
      '"PingFang SC"',
      "font-family: var(--draft-content-font);",
      ".draft-editor-mode-toggle",
      ".draft-editor-formatting button .editor-command-icon",
      ".draft-editor-status > span",
      "--motion-panel: 180ms;",
      ".panel.active > *",
      "animation: xposter-panel-item-enter var(--motion-panel) var(--ease-out-quint) both;",
      "animation-delay: calc(var(--panel-item-index, 0) * 24ms);",
      "@keyframes xposter-panel-item-enter",
      ".panel.active > [hidden]",
      ".panel.active > *,",
      "stroke-linecap: round;",
      "@media (max-width: 520px)",
      ".draft-editor-formatting {\n    overflow-x: auto;\n    flex-wrap: nowrap;",
      ".composer[data-empty-draft=\"true\"] #loadFile {\n    width: 30px;",
      ".composer[data-empty-draft=\"true\"] #loadFile span {\n    position: absolute;"
    ]) &&
    excludesAll(sidepanelCss, [
      "box-shadow: 0 -16px 30px rgba(15, 20, 25, 0.10);",
      "box-shadow: 0 10px 22px color-mix(in oklch, var(--button-fill), transparent 84%);",
      "min-height: min(720px, calc(100dvh - 104px));",
      "min-height: min(700px, calc(100dvh - 92px));",
      "height: var(--draft-editor-block-size);",
      "min-height: var(--draft-editor-block-size);",
      "max-height: var(--draft-editor-block-size);",
      "--draft-editor-focus-ring:",
      "--draft-editor-focus-field-line:",
      "--draft-editor-frame-line:",
      "--draft-editor-frame-hover-line:",
      "border: 1px solid var(--draft-editor-frame-line);",
      "box-shadow: inset 0 0 0 1px var(--draft-editor-focus-ring);",
      "box-shadow: inset 0 1px 0 var(--draft-editor-focus-field-line);",
      "textarea:focus-visible,\n.record-search input:focus-visible",
      ".panel.active {\n  min-height: 0;\n  display: grid;\n  align-self: start;",
      ".composer {\n  position: relative;\n  min-height: 0;",
      ".composer {\n  position: relative;\n  height: 100%;\n  min-height: 0;\n  align-self: stretch;\n  align-content: start;",
      "grid-template-rows: auto auto auto auto;",
      "#markdown {\n  position: relative;\n  z-index: 1;\n  color: transparent;",
      ".record-edit-dialog textarea {\n  position: relative;\n  z-index: 1;\n  color: transparent;"
    ]) &&
    excludesAll(sidepanelCss, [
      "font-family: ui-serif, Georgia, \"Times New Roman\", serif;"
    ]),
  "side panel should use a lightweight native textarea editor with MiniGFM read preview, one status-bar mode toggle, responsive controls, and adapter-based draft reads"
);
assert.ok(
  sidepanelText.includes("const isCompact = !value.trim() || (value.length < 420 && meaningfulLines <= 8 && !hasRichBlocks);") &&
    sidepanelHtml.includes('id="importHint" data-tone="ready" data-i18n="Paste in the editor above, or choose a .md file."') &&
    sidepanelCss.includes(".import-hint[hidden]") &&
    sidepanelText.includes('label: "No Markdown yet"') &&
    sidepanelText.includes('const needsMarkdown = !hasDraft && !hasQueue;') &&
    sidepanelText.includes("lastWriteButtonContentReady") &&
    sidepanelText.includes("function importButtonLabelNode()") &&
    sidepanelText.includes('setDatasetValueIfChanged(actions, "empty", hasDraft || hasQueue || busy || batchWriting ? "false" : "true")') &&
    sidepanelText.includes('setBooleanPropertyIfChanged(button, "disabled", disabled)') &&
    sidepanelText.includes('setAttributeValueIfChanged(button, "aria-disabled", disabled ? "true" : "false")') &&
    sidepanelText.includes("setImportButtonLabel(label)") &&
    sidepanelText.includes('setDatasetValueIfChanged(button, "reveal", "write-ready")') &&
    sidepanelText.includes('removeDatasetValueIfChanged(button, "reveal")') &&
    sidepanelText.includes('text: "Paste in the editor above, or choose a .md file."') &&
    sidepanelText.includes('return { hidden: true, tone: "ready", text: "" };') &&
    sidepanelText.includes("applyImportHint(hint)") &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.importHint, "hidden", hidden)') &&
    sidepanelText.includes('setAttributeValueIfChanged(els.importHint, "aria-hidden", hidden ? "true" : "false")') &&
    sidepanelText.includes('setDatasetValueIfChanged(els.importHint, "tone", hint.tone || "ready")') &&
    sidepanelText.includes("setLocalizedTextIfChanged(els.importHint, hint.text || \"\")") &&
    !sidepanelText.includes('button.dataset.reveal = "write-ready"') &&
    !sidepanelText.includes("els.importHint.hidden = hidden") &&
    !sidepanelText.includes('els.importHint.setAttribute("aria-hidden", hidden ? "true" : "false")') &&
    sidepanelText.includes("function collectImportDraftNodes()") &&
    sidepanelText.includes("const importDraftNodes = collectImportDraftNodes();") &&
    sidepanelText.includes("if (importDraftNodes.label?.isConnected) return importDraftNodes.label;") &&
    sidepanelText.includes("setSourceHtmlIfChanged(button, `${importDraftNodes.iconMarkup}<span></span>`)") &&
    sidepanelText.includes('importDraftNodes.label = button.lastElementChild?.tagName === "SPAN" ? button.lastElementChild : null;') &&
    !sidepanelText.includes("els.importDraft.innerHTML = `${svg}<span></span>`") &&
    !sidepanelText.includes('let labelNode = button.querySelector("span")') &&
    !sidepanelText.includes('importDraftNodes.label = button.querySelector("span")') &&
    !sidepanelText.includes('const svg = button.querySelector("svg")') &&
    !sidepanelText.includes("translateDynamicDom(actions || button)") &&
    sidepanelCss.includes(".actions:not([data-empty=\"true\"]) .primary[data-reveal=\"write-ready\"]") &&
    sidepanelCss.includes("@keyframes xposter-write-ready-reveal") &&
    sidepanelCss.includes("@keyframes xposter-write-ready-icon"),
  "short or empty drafts should stay compact while the write button gets a restrained ready reveal"
);
assert.ok(
  sidepanelHtml.includes('id="draftDropTarget"') &&
    sidepanelHtml.includes("Release anywhere in this panel to load or queue the draft."),
  "side panel should expose a stable content-area Markdown drop target"
);
assert.ok(
    sidepanelCss.includes(".draft-drop-target") &&
    sidepanelCss.includes(".composer.drag-active .draft-drop-target") &&
    sidepanelCss.includes(".composer.drag-active .actions") &&
    sidepanelCss.includes("background: color-mix(in oklch, var(--signal), var(--paper) 96%);") &&
    sidepanelCss.includes("xposter-drop-breathe 1.8s ease-in-out infinite") &&
    sidepanelCss.includes("0 0 0 6px color-mix(in oklch, var(--signal), transparent 92%)") &&
    sidepanelCss.includes("transform: scale(1.006)") &&
    sidepanelCss.includes(".composer.drag-active .actions {\n  border-color: color-mix(in oklch, var(--signal), var(--line) 52%);\n  background: color-mix(in oklch, var(--signal), var(--paper) 96%);") &&
    sidepanelCss.includes("xposter-queue-item-enter") &&
    sidepanelCss.includes(".draft-queue-item[data-status=\"writing\"] .draft-queue-index") &&
    sidepanelText.includes("function markQueueItemsEntered") &&
    sidepanelText.includes('setLocalizedTextIfChanged(els.targetReady, target)') &&
    sidepanelText.includes('setLocalizedTextIfChanged(els.editorReady, editor)') &&
    sidepanelText.includes('setLocalizedTextIfChanged(els.vaultReady, vault)') &&
    sidepanelMessagesText.includes("Preparing the article and X editor.") &&
    sidepanelMessagesText.includes("Checking image files before upload.") &&
    sidepanelPatternsText.includes("Article written(?: in (.+))?") &&
    !sidepanelCss.includes("linear-gradient(") &&
    !sidepanelCss.includes("radial-gradient(") &&
    !sidepanelCss.includes("conic-gradient(") &&
    !sidepanelCss.includes(".composer.drag-active::before") &&
    !sidepanelCss.includes(".composer.drag-active::after"),
  "drag, queue, and readiness feedback should use real elements with restrained localized motion instead of fragile pseudo-elements"
);
assert.ok(
  sidepanelText.includes('setDatasetValueIfChanged(els.draftDropStatus, "tone", tone)') &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.draftDropStatus, "hidden", false)') &&
    sidepanelText.includes('setAttributeValueIfChanged(els.draftDropStatus, "role", "alert")') &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.draftDropDismiss, "hidden", false)') &&
    sidepanelText.includes("const draftDropStatusNodes = collectDraftDropStatusNodes();") &&
    sidepanelText.includes("setLocalizedTextIfChanged(draftDropStatusNodes.title, title)") &&
    sidepanelText.includes("setLocalizedTextIfChanged(draftDropStatusNodes.detail, detail)") &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.draftDropStatus, "hidden", true)') &&
    sidepanelText.includes('setDatasetValueIfChanged(els.draftDropStatus, "tone", "idle")') &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.draftDropDismiss, "hidden", true)') &&
    !sidepanelText.includes("els.draftDropStatus.dataset.tone = tone") &&
    !sidepanelText.includes("els.draftDropStatus.hidden = false") &&
    !sidepanelText.includes('els.draftDropStatus.setAttribute("role", "alert")') &&
    !sidepanelText.includes("els.draftDropDismiss) els.draftDropDismiss.hidden = false") &&
    !sidepanelText.includes("titleNode.textContent = title") &&
    !sidepanelText.includes("detailNode.textContent = detail") &&
    !sidepanelText.includes("const titleNode = els.draftDropStatus.querySelector") &&
    !sidepanelText.includes("const detailNode = els.draftDropStatus.querySelector") &&
    !sidepanelText.includes("translateDynamicDom(els.draftDropStatus)") &&
    !sidepanelText.includes("els.draftDropStatus.hidden = true"),
  "draft drop error status should update only changed attributes, visibility, and localized text"
);
assert.ok(
  sidepanelText.includes("const leftWindow = (event)") &&
    !sidepanelText.includes("let dragDepth"),
  "drop activation should not depend on fragile child-element drag depth"
);
assert.ok(
  sidepanelText.includes("function setClassNameIfChanged(node, value)") &&
    sidepanelText.includes("function setAttributeValueIfChanged(node, attribute, value)") &&
    sidepanelText.includes("function syncVisibilityState(node, hidden)") &&
    sidepanelText.includes('setAttributeValueIfChanged(node, "aria-hidden", hidden ? "true" : "false")') &&
    sidepanelText.includes('setAttributeValueIfChanged(els.markdown, "aria-hidden", isPreview || hasQueue ? "true" : "false")') &&
    sidepanelText.includes('setNumericPropertyIfChanged(els.markdown, "tabIndex", isPreview || hasQueue ? -1 : 0)') &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.draftQueue, "hidden", !hasQueue)') &&
    sidepanelText.includes('const pageStateLabel = els.pageState?.querySelector("span") || els.pageState || null;') &&
    sidepanelText.includes("setLocalizedTextIfChanged(pageStateLabel, text)") &&
    !sidepanelText.includes("els.draftEditorInputWrap.hidden = isPreview || queueModeActive()") &&
    !sidepanelText.includes("els.draftEditorShell.hidden = hasQueue") &&
    !sidepanelText.includes("button.disabled = !isEdit || queueModeActive()") &&
    sidepanelText.includes('setDatasetValueIfChanged(els.pageState, "pageAction", action)') &&
    sidepanelText.includes("setClassNameIfChanged(els.pageState, `page-state ${tone || \"\"}`)") &&
    sidepanelText.includes('setAttributeValueIfChanged(els.pageState, "aria-label", localizedTitle)') &&
    sidepanelText.includes('setDatasetValueIfChanged(els.targetContextPanel, "tone", tone)') &&
    sidepanelText.includes('setLocalizedTextIfChanged(els.targetContextState, toneLabel(tone))') &&
    sidepanelText.includes("setLocalizedTextIfChanged(els.targetContextMeta, !target.available"),
  "polled page and target context status should avoid redundant DOM writes while preserving the same visible state"
);
assert.ok(
    sidepanelText.includes("const conversionMapItems = indexElementsByData(els.conversionMapList, \"data-map\");") &&
    sidepanelText.includes("const preflightItems = indexElementsByData(els.preflightList, \"data-check\");") &&
    sidepanelText.includes("function indexChildElementByData(items, selector)") &&
    sidepanelText.includes('const preflightActionButtons = indexChildElementByData(preflightItems, "button[data-preflight-action]");') &&
    sidepanelText.includes("const timelineItems = indexElementsByData(els.timelineList, \"data-timeline-step\");") &&
    sidepanelText.includes("const liveRunbookItems = indexElementsByData(els.liveRunbookList, \"data-runbook-step\");") &&
    sidepanelText.includes('const liveRunbookActionButtons = indexChildElementByData(liveRunbookItems, "button[data-runbook-action]");') &&
    sidepanelText.includes("const proofDeckItems = indexElementsByData(els.proofDeckList, \"data-proof\");") &&
    sidepanelText.includes("const completionAuditItems = indexElementsByData(els.completionAuditList, \"data-audit\");") &&
    sidepanelText.includes('const conversionMapSection = els.conversionMapList?.closest("section") || null;') &&
    sidepanelText.includes('const importLedgerSection = els.importLedgerList?.closest("section") || null;') &&
    sidepanelText.includes('const reviewSection = els.reviewList?.closest("section") || null;') &&
    sidepanelText.includes('const issueQueueSection = els.issueQueueList?.closest("section") || null;') &&
    sidepanelText.includes('const timelineSection = els.timelineList?.closest("section") || null;') &&
    sidepanelText.includes('const liveRunbookSection = els.liveRunbookList?.closest("section") || null;') &&
    sidepanelText.includes('const proofDeckSection = els.proofDeckList?.closest("section") || null;') &&
    sidepanelText.includes('const completionAuditSection = els.completionAuditList?.closest("section") || null;') &&
    sidepanelText.includes("const rowQueryCache = new WeakMap();") &&
    sidepanelText.includes("function statusRowNodes(item)") &&
    sidepanelText.includes("function countItemsByTone(items, tone)") &&
    sidepanelText.includes("for (const item of items) {") &&
    sidepanelText.includes("if (item?.tone === tone) count += 1;") &&
    sidepanelText.includes("const nodes = statusRowNodes(item);") &&
    sidepanelText.includes("const item = conversionMapItems.get(row.id);") &&
    sidepanelText.includes("let ready = 0;") &&
    sidepanelText.includes("let active = 0;") &&
    sidepanelText.includes("if (row.tone === \"ok\" || row.tone === \"ready\") ready += 1;") &&
    sidepanelText.includes("if (row.count > 0) active += 1;") &&
    sidepanelText.includes("const item = preflightItems.get(check.id);") &&
    sidepanelText.includes("const actionButton = preflightActionButtons.get(check.id);") &&
    sidepanelText.includes("syncStatusRow(item, { tone: check.tone, label: check.label, detail: check.detail })") &&
    sidepanelText.includes("setLocalizedTextIfChanged(\n      els.conversionMapMeta,") &&
    sidepanelText.includes("syncStatusRow(item, {\n        tone: row.tone,\n        label: row.label,\n        detail: row.detail,\n        status: row.countLabel || String(row.count)") &&
    sidepanelText.includes('setLocalizedTextIfChanged(els.importLedgerMeta, "Load Markdown to see what each block will become.")') &&
    sidepanelText.includes("let blocked = 0;") &&
    sidepanelText.includes("let waiting = 0;") &&
    sidepanelText.includes("let direct = 0;") &&
    sidepanelText.includes("let mediaLimit = 0;") &&
    sidepanelText.includes('if (row.tone === "error") blocked += 1;') &&
    sidepanelText.includes('if (row.tone === "warn") waiting += 1;') &&
    sidepanelText.includes('if (row.path === "Write text") direct += 1;') &&
    sidepanelText.includes('if (row.kind === "media-limit") mediaLimit += 1;') &&
    sidepanelText.includes("const plannedRows = Math.max(0, rows.length - mediaLimit);") &&
    sidepanelText.includes("if (setSourceHtmlIfChanged(els.importLedgerList, importLedgerHtml))") &&
    sidepanelText.includes('setLocalizedTextIfChanged(els.reviewMeta, "Write Markdown to get publishing notes.")') &&
    sidepanelText.includes("let reviewHtml = \"\";") &&
    sidepanelText.includes("for (const note of notes) {") &&
    sidepanelText.includes('if (note.tone === "error") blockers += 1;') &&
    sidepanelText.includes('if (note.tone === "warn") warnings += 1;') &&
    sidepanelText.includes("reviewHtml += `<li data-tone=") &&
    sidepanelText.includes("if (setSourceHtmlIfChanged(els.reviewList, reviewHtml))") &&
    sidepanelText.includes("const previewBodyChanged = setSourceHtmlIfChanged(") &&
    sidepanelText.includes("const planChanged = renderPlanReadiness(parsed);") &&
    sidepanelText.includes("if (previewBodyChanged || planChanged) translateDynamicDom(els.previewPanel);") &&
    sidepanelText.includes('const planBreakdownDetail = els.planBreakdown?.querySelector("p") || null;') &&
    sidepanelText.includes('setLocalizedTextIfChanged(planBreakdownDetail, "Load Markdown to see the plain-language import steps.")') &&
    sidepanelText.includes("let textBlocks = 0;") &&
    sidepanelText.includes('if (segment.type === "text") {\n        textBlocks += 1;\n      }') &&
    sidepanelText.includes("let atomic = 0;") &&
    sidepanelText.includes("let images = 0;") &&
    sidepanelText.includes("for (const item of plan.plan) {") &&
    sidepanelText.includes('if (item.op.type === "atomic") atomic += 1;') &&
    sidepanelText.includes('if (item.op.type === "image") images += 1;') &&
    sidepanelText.includes("const operationCounts = { atomic: 0, images: 0 };") &&
    sidepanelText.includes("for (const item of operations) {") &&
    sidepanelText.includes('if (item.type === "atomic") operationCounts.atomic += 1;') &&
    sidepanelText.includes('if (item.type === "image") operationCounts.images += 1;') &&
    sidepanelText.includes("atomic: operationCounts.atomic,") &&
    sidepanelText.includes("images: operationCounts.images,") &&
    sidepanelText.includes("return renderPlanBreakdown(plan, { atomic, images, local, textBlocks, readinessChanged });") &&
    sidepanelText.includes("setLocalizedTextIfChanged(\n      planBreakdownDetail,") &&
    sidepanelText.includes("const visibleStepLimit = 8;") &&
    sidepanelText.includes("const totalSteps = 1 + plan.plan.length;") &&
    sidepanelText.includes("const stepItemHtml = (kind, text) =>") &&
    sidepanelText.includes("for (const item of plan.plan) {") &&
    sidepanelText.includes("if (renderedSteps >= visibleStepLimit) break;") &&
    sidepanelText.includes('stepsHtml += stepItemHtml("More", `${totalSteps - visibleStepLimit} more step(s) are hidden here but included during import.`);') &&
    sidepanelText.includes("const visiblePreviewLimit = 18;") &&
    sidepanelText.includes("for (let index = 0; index < parsed.segments.length && index < visiblePreviewLimit; index += 1)") &&
    sidepanelText.includes("const segment = parsed.segments[index];") &&
    sidepanelText.includes("return Boolean(summary.readinessChanged || setSourceHtmlIfChanged(els.planSteps, stepsHtml));") &&
    !sidepanelText.includes("els.conversionMapMeta.textContent = parsed") &&
    !sidepanelText.includes("els.importLedgerMeta.textContent =") &&
    !sidepanelText.includes("els.importLedgerList.innerHTML = rows") &&
    !sidepanelText.includes("els.importLedgerList.innerHTML +=") &&
    !sidepanelText.includes("els.reviewMeta.textContent =") &&
    !sidepanelText.includes("els.reviewList.innerHTML = notes") &&
    !sidepanelText.includes('notes.filter((note) => note.tone === "error").length') &&
    !sidepanelText.includes('notes.filter((note) => note.tone === "warn").length') &&
    !sidepanelText.includes("const reviewHtml = notes\n      .map") &&
    !sidepanelText.includes("els.previewBody.innerHTML =") &&
    !sidepanelText.includes("els.planReadiness.innerHTML =") &&
    !sidepanelText.includes('els.planBreakdown.querySelector("p")') &&
    !sidepanelText.includes("els.planSteps.innerHTML =") &&
    !sidepanelText.includes("els.planSteps.innerHTML +=") &&
    !sidepanelText.includes("...plan.plan.map((item) =>") &&
    !sidepanelText.includes(".slice(0, 8)\n      .map((step)") &&
    !sidepanelText.includes("parsed.segments.slice(0, 18).map((segment)") &&
    !sidepanelText.includes('rows.filter((row) => row.tone === "ok" || row.tone === "ready").length') &&
    !sidepanelText.includes('rows.filter((row) => row.count > 0).length') &&
    !sidepanelText.includes('rows.filter((row) => row.tone === "error").length') &&
    !sidepanelText.includes('rows.filter((row) => row.tone === "warn").length') &&
    !sidepanelText.includes('rows.filter((row) => row.path === "Write text").length') &&
    !sidepanelText.includes('rows.filter((row) => row.kind === "media-limit").length') &&
    !sidepanelText.includes('plan.plan.filter((item) => item.op.type === "atomic").length') &&
    !sidepanelText.includes('plan.plan.filter((item) => item.op.type === "image").length') &&
    !sidepanelText.includes('operations.filter((item) => item.type === "atomic").length') &&
    !sidepanelText.includes('operations.filter((item) => item.type === "image").length') &&
    !sidepanelText.includes('parsed.segments.filter((segment) => segment.type === "text").length') &&
    !sidepanelText.includes("item.dataset.tone = row.tone") &&
    !sidepanelText.includes('item.querySelector("strong").textContent = row.label') &&
    !sidepanelText.includes('item.querySelector("span").textContent = row.detail') &&
    !sidepanelText.includes('item.querySelector("em").textContent = row.countLabel || String(row.count)') &&
    sidepanelText.includes('setBooleanPropertyIfChanged(actionButton, "hidden", !check.action)') &&
    sidepanelText.includes('setDatasetValueIfChanged(actionButton, "preflightAction", check.action || "")') &&
    sidepanelText.includes("function updatePreflight(checks = buildPreflightChecks())") &&
    sidepanelText.includes("const hasPlan = hasQueue || hasParsedDraft;") &&
    sidepanelText.includes('if (check.tone === "ok") readyCount += 1;') &&
    sidepanelText.includes('setLocalizedTextIfChanged(els.preflightMeta, `${readyCount}/${checks.length} checks ready`);') &&
    /const checks = buildPreflightChecks\(\);\s+updatePreflight\(checks\);/.test(sidepanelText) &&
    sidepanelText.includes("checks,") &&
    sidepanelText.includes('const blockerCount = countItemsByTone(checks, "error");') &&
    sidepanelText.includes('if (blockerCount) log(`Publishing check found ${blockerCount} blocker(s).`);') &&
    sidepanelText.includes('blockers: countItemsByTone(evidence.checks, "error")') &&
    sidepanelText.includes('const blockers = countItemsByTone(evidence.checks, "error");') &&
    sidepanelText.includes("setLocalizedTextIfChanged(\n      els.issueQueueMeta,") &&
    sidepanelText.includes("let issueQueueHtml = \"\";") &&
    sidepanelText.includes("for (const issue of issues) {") &&
    sidepanelText.includes('if (issue.tone === "error") blockers += 1;') &&
    sidepanelText.includes('if (issue.tone === "warn") warnings += 1;') &&
    sidepanelText.includes("const issues = [];") &&
    sidepanelText.includes("for (const check of checks) {") &&
    sidepanelText.includes('if (check.tone !== "error" && check.tone !== "warn") continue;') &&
    sidepanelText.includes("issues.push(issueFromCheck(check));") &&
    sidepanelText.includes("if (setSourceHtmlIfChanged(els.issueQueueList, issueQueueHtml))") &&
    !sidepanelText.includes("els.issueQueueMeta.textContent = blockers") &&
    !sidepanelText.includes("els.issueQueueList.innerHTML = issues") &&
    !sidepanelText.includes('issues.filter((issue) => issue.tone === "error").length') &&
    !sidepanelText.includes('issues.filter((issue) => issue.tone === "warn").length') &&
    !sidepanelText.includes("const issueQueueHtml = issues\n      .map") &&
    !sidepanelText.includes(".filter((check) => {\n        if (check.tone !== \"error\" && check.tone !== \"warn\") return false;") &&
    !sidepanelText.includes(".map((check) => issueFromCheck(check))") &&
    sidepanelText.includes("translateDynamicDom(els.preflightPanel)") &&
    !sidepanelText.includes("translateDynamicDom();\n  }\n\n  function primaryImportAction") &&
    sidepanelText.includes("const item = timelineItems.get(step.id);") &&
    sidepanelText.includes('if (step.tone === "ok") done += 1;') &&
    sidepanelText.includes('if (step.tone === "error") blocked += 1;') &&
    sidepanelText.includes('if (step.tone === "ready") ready += 1;') &&
    sidepanelText.includes("const item = liveRunbookItems.get(step.id);") &&
    sidepanelText.includes('if (step.tone === "ok" || step.tone === "ready") ready += 1;') &&
    sidepanelText.includes("const button = liveRunbookActionButtons.get(step.id);") &&
    sidepanelText.includes("syncStatusRow(item, {\n        tone: step.tone,") &&
    sidepanelText.includes('setBooleanPropertyIfChanged(button, "disabled",') &&
    sidepanelText.includes('setLocalizedTextIfChanged(els.liveRunbookMeta, `${ready}/${runbook.length} after-import steps ready.`);') &&
    sidepanelText.includes("translateDynamicDom(conversionMapSection)") &&
    sidepanelText.includes("translateDynamicDom(importLedgerSection)") &&
    sidepanelText.includes("translateDynamicDom(reviewSection)") &&
    sidepanelText.includes("translateDynamicDom(issueQueueSection)") &&
    sidepanelText.includes("translateDynamicDom(timelineSection)") &&
    sidepanelText.includes("translateDynamicDom(liveRunbookSection)") &&
    sidepanelText.includes("translateDynamicDom(proofDeckSection)") &&
    sidepanelText.includes("translateDynamicDom(completionAuditSection)") &&
    sidepanelText.includes("const row = proofDeckItems.get(item.id);") &&
    sidepanelText.includes("const row = completionAuditItems.get(item.id);") &&
    sidepanelText.includes("ready,") &&
    sidepanelText.includes('`${proof.ready}/${proof.items.length} publish steps ready.`') &&
    sidepanelText.includes("for (const item of items) {") &&
    sidepanelText.includes('if (item.tone === "ok" || item.tone === "ready") proven += 1;') &&
    sidepanelText.includes('if (item.tone === "error") blocked += 1;') &&
    sidepanelText.includes("syncStatusRow(row, { tone: item.tone, label: item.label, detail: item.detail })") &&
    !sidepanelText.includes("els.conversionMapList.querySelector(`[data-map=\"") &&
    !sidepanelText.includes("els.preflightList.querySelector(`[data-check=\"") &&
    !sidepanelText.includes('item.querySelector("button[data-preflight-action]")') &&
    !sidepanelText.includes('checks.filter((check) => check.tone === "ok").length') &&
    !sidepanelText.includes("Boolean(shared.buildPastePlan(parsed.segments, previewImageMap(parsed), previewTableMap(parsed)).plan.length || parsed.segments.length)") &&
    !sidepanelText.includes('buildPreflightChecks().filter((check) => check.tone === "error")') &&
    !sidepanelText.includes('checks: buildPreflightChecks()') &&
    !sidepanelText.includes('evidence.checks.filter((check) => check.tone === "error").length') &&
    !sidepanelText.includes("els.timelineList.querySelector(`[data-timeline-step=\"") &&
    !sidepanelText.includes('timeline.filter((step) => step.tone === "ok").length') &&
    !sidepanelText.includes('timeline.filter((step) => step.tone === "error").length') &&
    !sidepanelText.includes('timeline.filter((step) => step.tone === "ready").length') &&
    !sidepanelText.includes('runbook.filter((step) => step.tone === "ok" || step.tone === "ready").length') &&
    !sidepanelText.includes('proof.items.filter((item) => item.tone === "ok" || item.tone === "ready").length') &&
    !sidepanelText.includes('const proven = items.filter((item) => item.tone === "ok" || item.tone === "ready").length') &&
    !sidepanelText.includes('const blocked = items.filter((item) => item.tone === "error").length') &&
    !sidepanelText.includes("els.liveRunbookList.querySelector(`[data-runbook-step=\"") &&
    !sidepanelText.includes('item.querySelector("button[data-runbook-action]")') &&
    !sidepanelText.includes("els.proofDeckList.querySelector(`[data-proof=\"") &&
    !sidepanelText.includes("els.completionAuditList.querySelector(`[data-audit=\"") &&
    !sidepanelText.includes('translateDynamicDom(els.conversionMapList.closest("section"))') &&
    !sidepanelText.includes('translateDynamicDom(els.importLedgerList.closest("section"))') &&
    !sidepanelText.includes('translateDynamicDom(els.reviewList.closest("section"))') &&
    !sidepanelText.includes('translateDynamicDom(els.issueQueueList.closest("section"))') &&
    !sidepanelText.includes('translateDynamicDom(els.timelineList.closest("section"))') &&
    !sidepanelText.includes('translateDynamicDom(els.liveRunbookList.closest("section"))') &&
    !sidepanelText.includes('translateDynamicDom(els.proofDeckList.closest("section"))') &&
    !sidepanelText.includes('translateDynamicDom(els.completionAuditList.closest("section"))'),
  "conversion map issue queue preflight and runbook refreshes should reuse changed-only status row updates and avoid full-document translation"
);
assert.ok(
  sidepanelText.includes("function syncDraftInspectorMetrics(parsed = null, counts = shared.segmentCounts([]))") &&
    sidepanelText.includes('setAttributeValueIfChanged(els.inspector, "data-has-draft", parsed ? "true" : "false")') &&
    sidepanelText.includes('setTextContentIfChanged(els.titleMetric, parsed?.title || "None")') &&
    sidepanelText.includes('setTextContentIfChanged(els.imageMetric, String(counts.image || 0))') &&
    sidepanelText.includes('setTextContentIfChanged(els.tableMetric, String(counts.table || 0))') &&
    sidepanelText.includes('setTextContentIfChanged(els.tweetMetric, String(counts.tweet || 0))') &&
    sidepanelText.includes("syncDraftInspectorMetrics(null, latestCounts)") &&
    sidepanelText.includes("syncDraftInspectorMetrics(parsed, counts)") &&
    !sidepanelText.includes('els.inspector?.setAttribute("data-has-draft", "false")') &&
    !sidepanelText.includes('els.inspector?.setAttribute("data-has-draft", "true")') &&
    !sidepanelText.includes('els.titleMetric.textContent = "None"') &&
    !sidepanelText.includes("els.titleMetric.textContent = parsed.title") &&
    !sidepanelText.includes("els.imageMetric.textContent = String(counts.image || 0)") &&
    !sidepanelText.includes("els.tableMetric.textContent = String(counts.table || 0)") &&
    !sidepanelText.includes("els.tweetMetric.textContent = String(counts.tweet || 0)"),
  "draft analysis should sync inspector metrics through one changed-only helper"
);
assert.ok(
  sidepanelText.includes("function draftImageSummary(parsed = latestParsed)") &&
    sidepanelText.includes("const imageSegments = [];") &&
    sidepanelText.includes("const remoteImages = [];") &&
    sidepanelText.includes("const localImages = localImageReferences(parsed);") &&
    sidepanelText.includes("const absoluteLocalImages = [];") &&
    sidepanelText.includes("for (const segment of parsed?.segments || []) {") &&
    sidepanelText.includes('if (segment.type !== "image") continue;') &&
    sidepanelText.includes("if (isRemoteHttpImageSource(segment.source)) remoteImages.push(segment);") &&
    sidepanelText.includes("if (!coverInBody && coverSource && segment.source === coverSource) coverInBody = true;") &&
    sidepanelText.includes("for (const item of localImages) {") &&
    sidepanelText.includes("if (shared.isAbsoluteLocalImageSource(item.source)) absoluteLocalImages.push(item);") &&
    sidepanelText.includes("const imageSummary = draftImageSummary(parsed);") &&
    sidepanelText.includes("updateConversionMap(parsed, counts, { imageSummary });") &&
    sidepanelText.includes("renderDraftReview(parsed, counts, { imageSummary });") &&
    sidepanelText.includes("function updateConversionMap(parsed, counts = null, context = {})") &&
    sidepanelText.includes("const rows = buildConversionMap(parsed, counts || (parsed ? shared.segmentCounts(parsed.segments) : shared.segmentCounts([])), context);") &&
    sidepanelText.includes("function buildConversionMap(parsed, counts, context = {})") &&
    sidepanelText.includes("function renderDraftReview(parsed, counts = null, context = {})") &&
    sidepanelText.includes("const notes = buildDraftReview(parsed, counts || shared.segmentCounts(parsed.segments), context);") &&
    sidepanelText.includes("function buildDraftReview(parsed, counts, context = {})") &&
    sidepanelText.includes("const { localImages, remoteImages, absoluteLocalImages, coverInBody } = context.imageSummary || draftImageSummary(parsed);") &&
    !sidepanelText.includes("updateConversionMap(parsed, counts);\n      updateImportLedger(parsed, counts);\n      renderDraftReview(parsed, counts);") &&
    !sidepanelText.includes('const imageSegments = parsed?.segments?.filter((segment) => segment.type === "image") || []') &&
    !sidepanelText.includes('const imageSegments = parsed.segments.filter((segment) => segment.type === "image")') &&
    !sidepanelText.includes("const remoteImages = imageSegments.filter((segment) => isRemoteHttpImageSource(segment.source))") &&
    !sidepanelText.includes("const absoluteLocalImages = localImages.filter((item) => shared.isAbsoluteLocalImageSource(item.source))") &&
    !sidepanelText.includes("const coverInBody = Boolean(parsed?.cover && imageSegments.some((segment) => segment.source === parsed.cover))") &&
    !sidepanelText.includes("const coverInBody = imageSegments.some((segment) => segment.source === parsed.cover);"),
  "draft review and conversion map should share one image summary pass instead of repeating image filters"
);
assert.ok(
  sidepanelText.includes("const remoteImageList = Array.isArray(context.parsedDrafts)") &&
    sidepanelText.includes("? remoteHttpImageSegmentsForParsedDrafts(context.parsedDrafts)") &&
    sidepanelText.includes("? remoteHttpImageSegmentsForMarkdowns(markdowns, importOptions)") &&
    sidepanelText.includes("const remoteImages = remoteImageList.length;") &&
    sidepanelText.includes("const remoteOrigins = remoteImageOriginsFromSegments(remoteImageList);") &&
    !sidepanelText.includes("const remoteOrigins = markdowns ? remoteImageOriginsForMarkdowns(markdowns, importOptions) : remoteImageOrigins(parsed);"),
  "preflight checks should derive remote origins from the already-collected remote image list"
);
assert.ok(
  sidepanelText.includes("function indexPreflightChecks(checks)") &&
    sidepanelText.includes("return new Map((checks || []).map((check) => [check.id, check]));") &&
    sidepanelText.includes("function preflightEvidenceContext(checks, context = {})") &&
    sidepanelText.includes("const { includePreviewPlan = true, ...baseContext } = context;") &&
    sidepanelText.includes("liveResult: baseContext.liveResult || buildLiveResultEvidence()") &&
    sidepanelText.includes('needsRemote: typeof baseContext.needsRemote === "boolean" ? baseContext.needsRemote : remoteHttpImageSegments(latestParsed).length > 0') &&
    sidepanelText.includes("if (includePreviewPlan) evidenceContext.previewPlan = baseContext.previewPlan || buildPreviewPlan();") &&
    sidepanelText.includes("const preflightContext = preflightEvidenceContext(checks, { byId });") &&
    sidepanelText.includes("const gate = getImportGate(checks, preflightContext);") &&
    sidepanelText.includes("updateLiveRunbook(checks, gate, preflightContext)") &&
    sidepanelText.includes("updateProofDeck(checks, gate, preflightContext)") &&
    sidepanelText.includes("updateCompletionAudit(checks, gate, preflightContext)") &&
    sidepanelText.includes("updateRecoveryPanel(checks, gate, preflightContext)") &&
    sidepanelText.includes("updateIssueQueue(checks, gate, preflightContext)") &&
    sidepanelText.includes("updateExecutionTimeline(checks, gate, preflightContext)") &&
    sidepanelText.includes("const byId = context.byId || indexPreflightChecks(resolvedChecks);") &&
    sidepanelText.includes("const byId = context.byId || indexPreflightChecks(checks);") &&
    sidepanelText.includes("const liveResult = context.liveResult || buildLiveResultEvidence();") &&
    sidepanelText.includes("const plan = context.previewPlan || buildPreviewPlan();") &&
    sidepanelText.includes("const evidenceContext = preflightEvidenceContext(checks, { byId });") &&
    sidepanelText.includes("const gate = getImportGate(checks, evidenceContext);") &&
    sidepanelText.includes("importPlan: evidenceContext.previewPlan") &&
    sidepanelText.includes("liveResult: evidenceContext.liveResult") &&
    sidepanelText.includes("proofDeck: buildProofDeckEvidence(checks, gate, evidenceContext)") &&
    sidepanelText.includes("completionAudit: buildCompletionAuditEvidence(checks, gate, evidenceContext)") &&
    sidepanelText.includes("recovery: buildRecoveryState(checks, gate, evidenceContext)") &&
    sidepanelText.includes("updateLiveRunbook(checks, gate, evidenceContext)") &&
    sidepanelText.includes("updateProofDeck(checks, gate, evidenceContext)") &&
    sidepanelText.includes("updateCompletionAudit(checks, gate, evidenceContext)") &&
    sidepanelText.includes("updateRecoveryPanel(checks, gate, evidenceContext)") &&
    sidepanelText.includes("function syncProgressiveSectionVisibility(context = {})") &&
    sidepanelText.includes("function updateProgressiveSections(context = {})") &&
    sidepanelText.includes("syncProgressiveSectionVisibility(context)") &&
    sidepanelText.includes("const liveResultContext = preflightEvidenceContext(checks, { byId, liveResult, includePreviewPlan: false });") &&
    sidepanelText.includes("const gate = getImportGate(checks, liveResultContext);") &&
    sidepanelText.includes("updateLiveRunbook(checks, gate, liveResultContext)") &&
    sidepanelText.includes("updateProofDeck(checks, gate, liveResultContext)") &&
    sidepanelText.includes("updateCompletionAudit(checks, gate, liveResultContext)") &&
    sidepanelText.includes("updateRecoveryPanel(checks, gate, liveResultContext)") &&
    sidepanelText.includes("updateProgressiveSections(liveResultContext)") &&
    sidepanelText.includes("const localAssetBlocker = localAssetWriteBlocker(checks, { ...preflightContext, byId });") &&
    !sidepanelText.includes("proofDeck: buildProofDeckEvidence(checks, gate, { byId })") &&
    !sidepanelText.includes("completionAudit: buildCompletionAuditEvidence(checks, gate, { byId })") &&
    !sidepanelText.includes("recovery: buildRecoveryState(checks, gate, { byId })") &&
    !sidepanelText.includes("updateLiveRunbook(checks, gate, { byId })") &&
    !/new Map\([^;\n]*(?:checks|resolvedChecks)\.map\(\(check\) => \[check\.id, check\]\)/.test(sidepanelText) &&
    !sidepanelText.includes('checks.find((check) => check.id === "assets")'),
  "preflight refreshes should reuse one shared evidence context across gate, issue, runbook, proof, audit, timeline, and local-asset checks"
);
assert.ok(
  sidepanelText.includes('setLocalizedTextIfChanged(els.vaultSettingsText, "xPoster will ask when a Markdown draft uses local image paths.")') &&
    sidepanelText.includes('setLocalizedTextIfChanged(els.vaultSettingsText, "No folder connected. xPoster will ask when a draft needs local images.")') &&
    sidepanelText.includes('setLocalizedTextIfChanged(els.vaultSettingsText, `${vault.name} - ${permissionText.toLowerCase()}.`)') &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.clearVaultSettings, "disabled", !enabled)') &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.runPreflight, "disabled", true)') &&
    sidepanelText.includes('latestDiagnostics = { ok: false, error: message };') &&
    sidepanelText.includes('log(localizeInterpolated("Publishing check failed: {error}", { error: localizeText(message) }));') &&
    sidepanelText.includes('} finally {\n      setBooleanPropertyIfChanged(els.runPreflight, "disabled", false);') &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.runPreflight, "disabled", false)') &&
    sidepanelText.includes('setLocalizedTextIfChanged(els.runPreflight, "Check")') &&
    sidepanelMessagesText.includes('"Publishing check failed: {error}"') &&
    !sidepanelText.includes('setBooleanPropertyIfChanged(els.clearVault, "disabled", !enabled)') &&
    !sidepanelText.includes("translateDynamicDom(els.localImagesPanel)") &&
    !sidepanelText.includes('els.vaultState.textContent = "Not configured"') &&
    !sidepanelText.includes("els.vaultState.textContent = `Selected:") &&
    !sidepanelText.includes("els.vaultDetail.textContent =") &&
    !sidepanelText.includes("els.vaultSettingsText.textContent =") &&
    !sidepanelText.includes('translateDynamicDom(document.querySelector(".vault"))') &&
    !sidepanelText.includes("if (els.clearVault) els.clearVault.disabled = !enabled") &&
    !sidepanelText.includes("if (els.clearVaultSettings) els.clearVaultSettings.disabled = !enabled") &&
    !sidepanelText.includes("els.runPreflight.disabled = true") &&
    !sidepanelText.includes("els.runPreflight.disabled = false"),
  "vault and preflight status refreshes should use the settings status only and changed-only disabled writes"
);
assert.ok(
  sidepanelConfigText.includes('const STORAGE_TARGET_TAB = "xposter_sidepanel_target_tab"') &&
    sidepanelConfigText.includes("STORAGE_TARGET_TAB") &&
    backgroundText.includes('const SIDEPANEL_TARGET_TAB_STORAGE_KEY = "xposter_sidepanel_target_tab"') &&
    backgroundText.includes("await rememberSidePanelTargetTab(sourceTab || { id: tabId });") &&
    backgroundText.includes("openArticles(sender)") &&
    backgroundText.includes("let tab = sender?.tab || null;") &&
    backgroundText.includes('chrome.tabs.update(tab.id, { active: true, url: "https://x.com/compose/articles" })') &&
    backgroundText.includes("function rememberSidePanelTargetTab(tab)") &&
    backgroundText.includes("function isXUrl(url)") &&
    sidepanelText.includes("let targetTabId = null;") &&
    sidepanelText.includes("function rememberTargetTab(tab)") &&
    sidepanelText.includes("async function restoreTargetTab(stored = null)") &&
    sidepanelText.includes("async function sendToTargetTab(message, options = {})") &&
    sidepanelText.includes("const tabs = await chrome.tabs.query({ currentWindow: true, url: [\"https://x.com/*\", \"https://twitter.com/*\"] });") &&
    sidepanelText.includes("tabs.find((tab) => isXTab(tab) && isArticlesUrl(tab.url))") &&
    sidepanelText.includes("await restoreTargetTab(stored);") &&
    sidepanelText.includes('sendToTargetTab({ type: "xposter:page-status" })') &&
    sidepanelText.includes('sendToTargetTab({ type: "xposter:diagnostics" }, { requireArticles: true })') &&
    sidepanelText.includes('type: "xposter:import-markdown"') &&
    sidepanelText.includes('chrome.tabs.update(tab.id, { active: true, url: "https://x.com/compose/articles" })') &&
    sidepanelText.includes("await refreshPageState();\n      checks = buildPreflightChecks(preflightContext);") &&
    sidepanelText.includes("const refreshedPageScriptCheck = checks.find((check) => check.id === \"page-script\");") &&
    !sidepanelText.includes("async function sendToActiveTab") &&
    !sidepanelText.includes("sendToActiveTab("),
  "side panel should remember the originating X tab, send commands to that target, and refresh stale old-importer state before blocking writes"
);
assert.ok(
  sidepanelText.includes("function setTextContentIfChanged(node, value)") &&
    sidepanelText.includes("function setSourceHtmlIfChanged(node, html)") &&
    sidepanelText.includes("function setStylePropertyIfChanged(node, property, value)") &&
    sidepanelText.includes("function removeStylePropertyIfChanged(node, property)") &&
    sidepanelText.includes("if (node.nodeValue !== nextValue) node.nodeValue = nextValue;") &&
    sidepanelText.includes("if (current !== translated) element.setAttribute(attr, translated);") &&
    sidepanelText.includes("function syncWorkspaceTabs(target)") &&
    sidepanelText.includes("const activeTabIndex = workspaceTargetIndex(target);") &&
    sidepanelText.includes('setClassPresenceIfChanged(tab, "active", tab.dataset.tab === target)') &&
    sidepanelText.includes('setStylePropertyIfChanged(workspaceTabsContainer, "--tab-count", Math.max(workspaceTabs.length, 1))') &&
    sidepanelText.includes('setStylePropertyIfChanged(workspaceTabsContainer, "--tab-index", Math.max(activeTabIndex, 0))') &&
    sidepanelText.includes('setDatasetValueIfChanged(workspaceTabsContainer, "activeTab", activeTabIndex >= 0 ? "true" : "false")') &&
    sidepanelText.includes("function syncPanelItemMotion(panel)") &&
    sidepanelText.includes("function syncWorkspacePanels(target)") &&
    sidepanelText.includes("const targetPanels = [];") &&
    sidepanelText.includes("if (isActive) targetPanels.push(panel);") &&
    sidepanelText.includes("targetPanels.forEach((panel) => translateDynamicDom(panel, { syncEnvironment: false }));") &&
    sidepanelText.includes("function restartPanelMotion(panel)") &&
    sidepanelText.includes('setStyleValueIfChanged(panel, "animation", "none")') &&
    sidepanelText.includes('setStyleValueIfChanged(panel, "animation", "")') &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.liveProgress, "hidden", !progressVisible)') &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.evidenceDetails, "hidden", !hasAnyRecord)') &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.recordsEmpty, "hidden", hasRecord)') &&
    sidepanelText.includes('setDatasetValueIfChanged(els.runSummary, "tone", hasWarnings ? "warn" : "done")') &&
    sidepanelText.includes("setTextContentIfChanged(els.summaryMessage, summarizeRunMessage(summary))") &&
    sidepanelText.includes("setTextContentIfChanged(els.summaryElapsed, `${((summary.elapsedMs || 0) / 1000).toFixed(1)}s`)") &&
    sidepanelText.includes("function log(message)") &&
    sidepanelText.includes("setTextContentIfChanged(timeNode, time)") &&
    sidepanelText.includes("setTextContentIfChanged(messageNode, message)") &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.activityPanel, "hidden", false)') &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.runSummary, "hidden", true)') &&
    sidepanelText.includes("const liveResultInputItems = collectLiveResultInputItems();") &&
    sidepanelText.includes("function collectLiveResultInputItems()") &&
    sidepanelText.includes("return liveResultInputItems;") &&
    sidepanelText.includes("let checked = 0;") &&
    sidepanelText.includes("for (const { input, label, detail } of getLiveResultItems()) {") &&
    sidepanelText.includes("if (item.checked) checked += 1;") &&
    sidepanelText.includes("complete: items.length > 0 && checked === items.length") &&
    sidepanelText.includes('for (const { input } of getLiveResultItems()) {\n      setBooleanPropertyIfChanged(input, "checked", Boolean((stored[STORAGE_LIVE_RESULT] || {})[input.dataset.liveCheck]));') &&
    sidepanelText.includes("setTextContentIfChanged(\n      els.liveResultMeta,") &&
    sidepanelText.includes("function liveResultStorageState(liveResult)") &&
    sidepanelText.includes("return Object.fromEntries((liveResult?.items || []).map((item) => [item.id, Boolean(item.checked)]));") &&
    sidepanelText.includes("function updateLiveResultMeta(liveResult = buildLiveResultEvidence())") &&
    sidepanelText.includes("liveResultChecks = liveResultStorageState(liveResult);") &&
    sidepanelText.includes("updateLiveResultMeta(liveResult);") &&
    !sidepanelText.includes("liveResultChecks = Object.fromEntries(getLiveResultItems().map(({ input }) => [input.dataset.liveCheck, Boolean(input.checked)]));") &&
    sidepanelText.includes('setBooleanPropertyIfChanged(input, "checked", Boolean(liveResultChecks[input.dataset.liveCheck]))') &&
    sidepanelText.includes('for (const { input } of getLiveResultItems()) setBooleanPropertyIfChanged(input, "checked", false)') &&
    !sidepanelText.includes('workspaceTabsContainer.style.setProperty("--tab-count"') &&
    !sidepanelText.includes('workspaceTabsContainer.style.setProperty("--tab-index"') &&
    !sidepanelText.includes('workspaceTabsContainer.dataset.activeTab = activeTabIndex >= 0 ? "true" : "false"') &&
    !sidepanelText.includes('setClassPresenceIfChanged(tab, "active", index === activeTabIndex)') &&
    !sidepanelText.includes("workspacePanels\n      .filter((panel) => panel.dataset.panel === target)") &&
    !sidepanelText.includes('panel.style.animation = "none"') &&
    !sidepanelText.includes('panel.style.animation = ""') &&
    !sidepanelText.includes("if (els.liveProgress) els.liveProgress.hidden = !progressVisible") &&
    !sidepanelText.includes("if (els.recordsEmpty) els.recordsEmpty.hidden = hasRecord") &&
    !sidepanelText.includes("els.summaryMessage.textContent = summarizeRunMessage(summary)") &&
    !sidepanelText.includes("if (els.runSummary) els.runSummary.hidden = true") &&
    !sidepanelText.includes("timeNode.textContent = time") &&
    !sidepanelText.includes("messageNode.textContent = message") &&
    !sidepanelText.includes("if (els.activityPanel) els.activityPanel.hidden = false") &&
    !sidepanelText.includes("els.liveResultMeta.textContent = result.complete") &&
    !sidepanelText.includes("input.checked = Boolean(liveResultChecks[input.dataset.liveCheck])") &&
    !sidepanelText.includes("checked: items.filter((item) => item.checked).length") &&
    !sidepanelText.includes("complete: items.length > 0 && items.every((item) => item.checked)") &&
    !sidepanelText.includes("for (const input of getLiveResultItems()) input.checked = false") &&
    !sidepanelText.includes('return Array.from(els.liveResultList.querySelectorAll("input[data-live-check]"));') &&
    !sidepanelText.includes("else if (els.draftMediaAlert?.dataset.tone) delete els.draftMediaAlert.dataset.tone") &&
    !sidepanelText.includes("if (els.draftMediaAlertDetail.textContent !== text) els.draftMediaAlertDetail.textContent = text"),
  "live progress records layout tabs and live result refreshes should avoid repeated hidden/text/style/checked writes"
);
assert.ok(
  sidepanelText.includes('setDatasetValueIfChanged(els.draftPanel, "emptyDraft", hasDraft || queueModeActive() ? "false" : "true")') &&
    sidepanelText.includes('setPropertyValueIfChanged(els.recordSearchInput, "value", recordSearchQuery)') &&
    sidepanelText.includes("function updateProgressiveSections(context = {})") &&
    sidepanelText.includes("syncProgressiveSectionVisibility(context)") &&
    !sidepanelText.includes("function currentDraftImportCompleted(markdown = draftText())") &&
    !sidepanelText.includes("const importCompleteForDraft = currentDraftImportCompleted(markdown);") &&
    !sidepanelText.includes("const needsLocalImageAction = localImages.count && !importCompleteForDraft;") &&
    !sidepanelText.includes("const showLocalImages = Boolean(needsLocalImageAction || vault?.configured);") &&
    sidepanelText.includes("draftFingerprint: draftFingerprint(markdown)") &&
    !sidepanelText.includes('setBooleanPropertyIfChanged(els.localImagesPanel, "hidden", !showLocalImages)') &&
    sidepanelText.includes("function syncEvidenceRecordOutput(kind, evidence)") &&
    sidepanelText.includes("syncEvidenceRecordOutput(kind, latestEvidence)") &&
    sidepanelText.includes("syncEvidenceRecordOutput(latestEvidence.kind, latestEvidence)") &&
    sidepanelText.includes('setLocalizedTextIfChanged(els.evidenceMeta, "No technical record saved yet.")') &&
    sidepanelText.includes('setLocalizedTextIfChanged(els.evidenceText, "Run Check article or Write article to save a technical record.")') &&
    sidepanelText.includes("setLocalizedTextIfChanged(els.evidenceText, source)") &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.copyEvidence, "disabled", true)') &&
    sidepanelText.includes("setTextContentIfChanged(els.evidenceText, JSON.stringify(evidence, jsonSafeReplacer, 2))") &&
    sidepanelText.includes('setLocalizedTextIfChanged(els.evidenceMeta, "Record package generated")') &&
    sidepanelText.includes('setLocalizedTextIfChanged(els.evidenceMeta, "Publish summary generated")') &&
    sidepanelText.includes("setTextContentIfChanged(els.evidenceText, text)") &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.copyEvidence, "disabled", false)') &&
    !sidepanelText.includes("if (els.draftPanel) els.draftPanel.dataset.emptyDraft =") &&
    !sidepanelText.includes("if (els.localImagesPanel) els.localImagesPanel.hidden = !showLocalImages") &&
    !sidepanelText.includes("const showLocalImages = Boolean(localImages.length || vault?.configured)") &&
    !sidepanelText.includes("draftFingerprint: activeDraftFingerprint || draftFingerprint(markdown)") &&
    !sidepanelText.includes("els.recordSearchInput.value = recordSearchQuery") &&
    !sidepanelText.includes('setLocalizedText(els.evidenceMeta, "No technical record saved yet.")') &&
    !sidepanelText.includes('setLocalizedText(els.evidenceText, "Run Check article or Write article to save a technical record.")') &&
    !sidepanelText.includes('setLocalizedText(els.evidenceMeta, "Record package generated")') &&
    !sidepanelText.includes('setLocalizedText(els.evidenceMeta, "Publish summary generated")') &&
    !sidepanelText.includes("els.evidenceText.textContent = translateText(source)") &&
    !sidepanelText.includes("els.evidenceText.textContent = JSON.stringify(latestEvidence, jsonSafeReplacer, 2)") &&
    !sidepanelText.includes("els.evidenceText.textContent = text") &&
    !sidepanelText.includes("els.copyEvidence.disabled = false") &&
    !sidepanelText.includes("if (els.copyEvidence) els.copyEvidence.disabled = true"),
  "draft brief progressive sections and evidence output should share changed-only state updates"
);
assert.ok(
  sidepanelText.includes("function buildProofDeckEvidence(checks = null, gate = null, context = {})") &&
    sidepanelText.includes("const byId = context.byId || indexPreflightChecks(resolvedChecks);") &&
    sidepanelText.includes("const liveResult = context.liveResult || buildLiveResultEvidence();") &&
    sidepanelText.includes('const needsRemote = typeof context.needsRemote === "boolean" ? context.needsRemote : remoteHttpImageSegments(latestParsed).length > 0;') &&
    sidepanelText.includes("const historyDraftRecord = recordHistory.find(recordHasMarkdown) || null;") &&
    sidepanelText.includes("const evidenceDraftRecord = !historyDraftRecord && recordHasMarkdown(latestEvidence)") &&
    sidepanelText.includes("const draftRecord = historyDraftRecord || evidenceDraftRecord;") &&
    sidepanelText.includes("const recordTitle = draftRecord ? recordDisplayTitle(draftRecord) : \"\";") &&
    sidepanelText.includes("function updateProofDeck(checks = null, gate = null, context = {})") &&
    sidepanelText.includes("setTextContentIfChanged(els.extensionPath, proof.extensionPath)") &&
    !sidepanelText.includes("if (els.extensionPath) els.extensionPath.textContent = proof.extensionPath") &&
    !sidepanelText.includes("const hasDraftRecord = Boolean(recordHistory.find(recordHasMarkdown) || recordHasMarkdown(latestEvidence))") &&
    !sidepanelText.includes("recordDisplayTitle(recordHistory.find(recordHasMarkdown)"),
  "proof deck refresh should avoid rewriting the extension path and reuse draft/remote evidence state"
);
assert.ok(
  sidepanelText.includes("function buildCompletionAuditEvidence(checks = null, gate = null, context = {})") &&
    sidepanelText.includes("const byId = context.byId || indexPreflightChecks(resolvedChecks);") &&
    sidepanelText.includes("const liveResult = context.liveResult || buildLiveResultEvidence();") &&
    sidepanelText.includes('const needsRemote = typeof context.needsRemote === "boolean" ? context.needsRemote : remoteHttpImageSegments(latestParsed).length > 0;') &&
    sidepanelText.includes("const proof = buildProofDeckEvidence(resolvedChecks, resolvedGate, { ...context, byId, liveResult, needsRemote });") &&
    !sidepanelText.includes("const proof = buildProofDeckEvidence(resolvedChecks, resolvedGate);\n    const hasImportEvidence") &&
    !sidepanelText.includes('const proof = buildProofDeckEvidence(resolvedChecks, resolvedGate);\n    const hasImportEvidence = Boolean(latestEvidence?.kind?.startsWith("import"));') &&
    !sidepanelText.includes("const needsRemote = remoteHttpImageSegments(latestParsed).length > 0;\n    const packageReady"),
  "completion audit should share proof-deck context instead of recomputing live and remote evidence"
);
assert.ok(
  sidepanelText.includes('setDatasetValueIfChanged(els.recoveryPanel, "tone", recovery.tone)') &&
    sidepanelText.includes("setLocalizedTextIfChanged(els.recoveryMeta, recovery.meta)") &&
    sidepanelText.includes("setLocalizedTextIfChanged(els.recoveryState, toneLabel(recovery.tone))") &&
    sidepanelText.includes("if (setSourceHtmlIfChanged(els.recoveryList, recoveryHtml)) translateDynamicDom(els.recoveryPanel);") &&
    sidepanelText.includes("function recoveryToneForItems(items = [])") &&
    sidepanelText.includes("let hasWarn = false;") &&
    sidepanelText.includes("let hasReady = false;") &&
    sidepanelText.includes('if (item.tone === "error") return "error";') &&
    sidepanelText.includes('if (item.tone === "warn") hasWarn = true;') &&
    sidepanelText.includes('else if (item.tone === "ready") hasReady = true;') &&
    sidepanelText.includes("const tone = recoveryToneForItems(items);") &&
    !sidepanelText.includes("els.recoveryPanel.dataset.tone = recovery.tone") &&
    !sidepanelText.includes("els.recoveryMeta.textContent = recovery.meta") &&
    !sidepanelText.includes("els.recoveryState.textContent = toneLabel(recovery.tone)") &&
    !sidepanelText.includes("els.recoveryList.innerHTML = recovery.items") &&
    !sidepanelText.includes('items.some((item) => item.tone === "error")') &&
    !sidepanelText.includes('items.some((item) => item.tone === "warn")') &&
    !sidepanelText.includes('items.some((item) => item.tone === "ready")'),
  "recovery refreshes should preserve dynamic translation while avoiding repeated panel and list DOM writes"
);
assert.ok(
  sidepanelCss.includes("padding-right: max(14px, env(safe-area-inset-right));") &&
    sidepanelCss.includes("padding-left: max(14px, env(safe-area-inset-left));") &&
    sidepanelCss.includes(".record-edit-dialog textarea") &&
    sidepanelCss.includes(".record-edit-toolbar") &&
    sidepanelCss.includes(".record-edit-highlight") &&
    sidepanelCss.includes(".record-edit-preview") &&
    sidepanelCss.includes("list-style-position: outside;") &&
    sidepanelCss.includes("padding-inline-start: 1.35em;") &&
    sidepanelCss.includes(".record-edit-actions") &&
    sidepanelCss.includes("grid-template-columns: minmax(0, 1fr) auto auto;") &&
    sidepanelCss.includes(".record-edit-action-group") &&
    sidepanelCss.includes("grid-template-columns: 36px minmax(0, 1fr) minmax(0, 1fr);") &&
    sidepanelHtml.includes('id="recordEditToolbar"') &&
    sidepanelHtml.includes('id="recordEditHighlight"') &&
    sidepanelHtml.includes('id="recordEditPreview"') &&
    sidepanelHtml.includes('id="recordEditModeToggle"') &&
    sidepanelHtml.includes('id="recordEditStats"') &&
    sidepanelHtml.includes('data-record-action="editor-command"') &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.recordEditSheet, "hidden", !open)') &&
    sidepanelText.includes('setDatasetValueIfChanged(document.body, "modalOpen", open ? "true" : "false")') &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.recordEditStats, "hidden", !stats)') &&
    sidepanelText.includes("setLocalizedTextIfChanged(els.recordEditStats, stats)") &&
    sidepanelText.includes("if (setSourceHtmlIfChanged(els.recordEditPreviewBody, previewHtml))") &&
    sidepanelText.includes('setDatasetValueIfChanged(els.recordEditBody, "mode", recordEditMode)') &&
    sidepanelText.includes("syncVisibilityState(els.recordEditInputWrap, !isEdit)") &&
    sidepanelText.includes('setAttributeValueIfChanged(els.recordEditTextarea, "aria-hidden", isEdit ? "false" : "true")') &&
    sidepanelText.includes('setNumericPropertyIfChanged(els.recordEditTextarea, "tabIndex", isEdit ? 0 : -1)') &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.recordEditToolbar, "hidden", !isEdit)') &&
    sidepanelText.includes("syncVisibilityState(els.recordEditPreview, isEdit)") &&
    sidepanelText.includes('setDatasetValueIfChanged(els.recordEditPreview, "previewMode", "read")') &&
    sidepanelText.includes("recordEditCommandButtons.forEach((button) =>") &&
    sidepanelText.includes('setBooleanPropertyIfChanged(button, "disabled", !isEdit)') &&
    sidepanelText.includes("setLocalizedTextIfChanged(els.recordEditTitle, title)") &&
    sidepanelText.includes("setLocalizedTextIfChanged(els.recordEditMeta, meta)") &&
    sidepanelText.includes("setLocalizedTextIfChanged(els.recordEditPrimaryLabel, primaryLabel)") &&
    sidepanelText.includes('setDatasetValueIfChanged(els.recordEditTextarea, "editorMode", mode)') &&
    sidepanelText.includes('setPropertyValueIfChanged(els.recordEditTextarea, "value", value)') &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.recordEditWriteButton, "hidden", mode !== "queue")') &&
    sidepanelText.includes('syncScrollPositionIfChanged(els.recordEditHighlight, els.recordEditTextarea)') &&
    sidepanelText.includes("els.recordEditTextarea?.addEventListener(\"input\", handleRecordEditorInput)") &&
    sidepanelText.includes("els.recordEditTextarea?.addEventListener(\"scroll\", syncRecordEditSyntaxScroll)") &&
    sidepanelText.includes("els.recordEditTextarea?.addEventListener(\"keydown\"") &&
    sidepanelText.includes("els.markdown.addEventListener(\"keydown\"") &&
    sidepanelText.includes("function normalizePreviewLists") &&
    sidepanelText.includes("stripOrderedPreviewListMarker(item)") &&
    sidepanelText.includes("applyTextareaCommand(button.dataset.editorCommand") &&
    !sidepanelText.includes("els.recordEditSheet.hidden = !open") &&
    !sidepanelText.includes("els.recordEditStats.hidden = !stats") &&
    !sidepanelText.includes("els.recordEditPreviewBody.innerHTML = text.trim()") &&
    !sidepanelText.includes("els.recordEditInputWrap.hidden = !isEdit") &&
    !sidepanelText.includes("els.recordEditToolbar.hidden = !isEdit") &&
    !sidepanelText.includes("els.recordEditPreview.hidden = isEdit") &&
    !sidepanelText.includes('els.recordEditPreview.dataset.previewMode = "read"') &&
    !sidepanelText.includes("button.disabled = !isEdit") &&
    !sidepanelText.includes("els.recordEditTitle.textContent = title") &&
    !sidepanelText.includes("els.recordEditMeta.textContent = meta") &&
    !sidepanelText.includes("els.recordEditPrimaryLabel.textContent = primaryLabel") &&
    !sidepanelText.includes("els.recordEditHighlight.scrollTop = els.recordEditTextarea.scrollTop") &&
    !sidepanelText.includes("els.recordEditHighlight.scrollLeft = els.recordEditTextarea.scrollLeft") &&
    !sidepanelText.includes("els.recordEditTextarea.dataset.editorMode = mode") &&
    !sidepanelText.includes("els.recordEditWriteButton.hidden = mode !== \"queue\"") &&
    !sidepanelCss.includes(".record-edit-sheet {\n    padding: 0;"),
  "record edit dialog should reuse Markdown syntax highlighting, formatting, preview, and a single stable action bar"
);
assert.ok(
  sidepanelHtml.includes('id="confettiOption"') &&
    sidepanelHtml.includes("Article import") &&
    sidepanelHtml.includes("Choose metadata and safe text cleanup before writing to X.") &&
    sidepanelHtml.includes('id="draftProcessingOptions"') &&
    sidepanelHtml.includes('id="smartPunctuationOption"') &&
    sidepanelHtml.includes("Smart punctuation") &&
    sidepanelHtml.includes("Text cleanup") &&
    sidepanelHtml.includes("Fix visible Chinese punctuation while leaving code, links, and URLs unchanged.") &&
    sidepanelElementsText.includes('"smartPunctuationOption"') &&
    sidepanelHtml.includes('id="successSoundOption"') &&
    sidepanelHtml.includes('id="successSoundStyle"') &&
    sidepanelHtml.includes("Show a brief celebration on the X page when X reports a completed write.") &&
    sidepanelText.includes("const themeModeInputs = els.themeChoice ? [...els.themeChoice.querySelectorAll('input[name=\"themeMode\"]')] : [];") &&
    sidepanelText.includes("themeModeInputs.forEach((input) => {") &&
    sidepanelText.includes('setBooleanPropertyIfChanged(input, "checked", input.value === currentThemeMode)') &&
    sidepanelText.includes('setDatasetValueIfChanged(document.documentElement, "theme", resolvedTheme)') &&
    sidepanelText.includes('setDatasetValueIfChanged(document.documentElement, "themeMode", currentThemeMode)') &&
    sidepanelText.includes('setStyleValueIfChanged(document.documentElement, "colorScheme", resolvedTheme)') &&
    sidepanelText.includes('setDatasetValueIfChanged(document.body, "theme", resolvedTheme)') &&
    sidepanelText.includes('setDatasetValueIfChanged(document.body, "themeMode", currentThemeMode)') &&
    sidepanelText.includes("function syncLanguageEnvironment()") &&
    sidepanelText.includes("function translateDynamicDom(root = document.body, { syncEnvironment = true } = {})") &&
    sidepanelText.includes("if (syncEnvironment) syncLanguageEnvironment();") &&
    sidepanelText.includes("translateDynamicDom(workspaceTopbar || document.body, { syncEnvironment: false });") &&
    sidepanelText.includes("translateDynamicDom(workspaceTabsContainer || document.body, { syncEnvironment: false });") &&
    sidepanelText.includes('if (panel.classList.contains("active")) translateDynamicDom(panel, { syncEnvironment: false });') &&
    sidepanelText.includes("targetPanels.forEach((panel) => translateDynamicDom(panel, { syncEnvironment: false }));") &&
    sidepanelText.includes("syncLanguageEnvironment();") &&
    sidepanelText.includes('setDatasetValueIfChanged(document.body, "language", currentLanguage)') &&
    sidepanelText.includes('setDatasetValueIfChanged(document.body, "languagePreference", i18n?.preference?.() || currentLanguage)') &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.importTitleOption, "checked", importOptions.setTitle !== false)') &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.importCoverOption, "checked", importOptions.setCover === true)') &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.smartPunctuationOption, "checked", importOptions.smartPunctuation === true)') &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.articleExportOption, "checked", articleExportOptions.enabled !== false)') &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.confettiOption, "checked", successFeedbackOptions.confetti !== false)') &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.successSoundOption, "checked", successFeedbackOptions.sound !== false)') &&
    sidepanelText.includes('setPropertyValueIfChanged(els.successSoundStyle, "value", successFeedbackOptions.soundStyle || "soft")') &&
    sidepanelText.includes('setBooleanPropertyIfChanged(els.successSoundStyle, "disabled", !soundEnabled)') &&
    !sidepanelText.includes("input.checked = input.value === currentThemeMode") &&
    !sidepanelText.includes("els.themeChoice.querySelectorAll('input[name=\"themeMode\"]').forEach") &&
    !sidepanelText.includes("els.importTitleOption.checked = importOptions.setTitle !== false") &&
    !sidepanelText.includes("els.importCoverOption.checked = importOptions.setCover !== false") &&
    !sidepanelText.includes("els.smartPunctuationOption.checked = importOptions.smartPunctuation === true") &&
    !sidepanelText.includes("els.articleExportOption.checked = articleExportOptions.enabled !== false") &&
    !sidepanelText.includes("els.confettiOption.checked = successFeedbackOptions.confetti !== false") &&
    !sidepanelText.includes("els.successSoundOption.checked = successFeedbackOptions.sound !== false") &&
    !sidepanelText.includes("els.successSoundStyle.value = successFeedbackOptions.soundStyle || \"soft\"") &&
    !sidepanelText.includes("els.successSoundStyle.disabled = !soundEnabled") &&
    !sidepanelText.includes("document.documentElement.dataset.theme = resolvedTheme") &&
    !sidepanelText.includes("document.documentElement.dataset.themeMode = currentThemeMode") &&
    !sidepanelText.includes("document.documentElement.style.colorScheme = resolvedTheme") &&
    !sidepanelText.includes("document.body.dataset.theme = resolvedTheme") &&
    !sidepanelText.includes("document.body.dataset.themeMode = currentThemeMode") &&
    !sidepanelText.includes("document.body.dataset.language = currentLanguage") &&
    !sidepanelText.includes("document.body.dataset.languagePreference = i18n?.preference?.() || currentLanguage") &&
    !/function translateVisibleWorkspace\(\) \{[\s\S]*?translateDynamicDom\([^;\n]+;\s*[\s\S]*?setDatasetValueIfChanged\(document\.body, "language"/.test(sidepanelText) &&
    !sidepanelHtml.includes('id="successSoundVolume"') &&
    !sidepanelHtml.includes('id="successSoundVolumeValue"') &&
    !sidepanelHtml.includes('data-i18n="Volume"') &&
    !sidepanelHtml.includes('id="testSuccessFeedback"'),
  "settings and theme controls should expose the same options while avoiding repeated checkbox dataset and style writes"
);
assert.ok(
  sidepanelText.includes("if (!batch || draftQueue.length === 0)") &&
    sidepanelText.includes("triggerSuccessFeedback(response.summary)") &&
    sidepanelText.includes("function schedulePageSuccessCelebrationFallback(summary = null)") &&
    sidepanelText.includes("requestPageSuccessCelebration(summary)") &&
    sidepanelText.includes('type: "xposter:success-celebration"') &&
    sidepanelText.includes("colors: SUCCESS_CELEBRATION_COLORS") &&
    sidepanelText.includes("lastSuccessFeedbackKey") &&
    sidepanelText.includes("celebrateOnComplete: celebrateOnComplete !== false") &&
    sidepanelText.includes("const celebrateOnComplete = !batch || draftQueue.length <= 1;") &&
    contentScriptText.includes('const SUCCESS_FEEDBACK_STORAGE_KEY = "xposter_success_feedback"') &&
    contentScriptText.includes("function installSuccessFeedbackSettingsSync()") &&
    contentScriptText.includes("const celebrateOnComplete = options.celebrateOnComplete !== false;") &&
    contentScriptText.includes("return state.successFeedback;") &&
    !contentScriptText.includes("chrome.storage.local.get(SUCCESS_FEEDBACK_STORAGE_KEY).catch(() => ({}))") &&
    contentScriptText.includes("await restoreSuccessFeedbackSettings().catch(() => {});") &&
    contentScriptText.includes("showSuccessCelebration();"),
  "successful imports should trigger the X-page celebration in the content script, keep a side-panel fallback, and wait until the final queued item"
);
assert.ok(
  sidepanelText.includes('return ["running", "parsed", "error"].includes(progress?.state);') &&
    !sidepanelText.includes('["running", "parsed", "complete", "error"].includes(latestProgress?.state)'),
  "completed progress should not keep the full live progress block visible"
);
assert.ok(
  sidepanelText.includes("scheduleRunSummaryCollapse(summary)") &&
    sidepanelText.includes('applyImportHint({ tone: "done", text: "Written. Review in X." })'),
  "clean successful imports should collapse bulky summary UI into a compact status hint"
);
assert.ok(
  sidepanelText.includes("shouldLogProgressEvent(eventName, payload)") &&
    sidepanelText.includes("return eventName === \"error\" || level === \"error\" || level === \"warn\";"),
  "routine progress and clean completion updates should not keep the activity panel open"
);
assert.ok(
  !sidepanelText.includes('log(batch ? "Batch draft writing started." : "Writing article started.")'),
  "starting a clean write should rely on the live progress strip instead of opening the activity panel"
);
assert.ok(
  !sidepanelHtml.includes("vendor/canvas-confetti.browser.min.js") &&
    !sidepanelText.includes("window.confetti.create") &&
    !sidepanelText.includes("fireSuccessConfetti") &&
    !sidepanelText.includes("successConfetti") &&
    !sidepanelCss.includes(".success-confetti-canvas") &&
    !sidepanelText.includes("testSuccessFeedback") &&
    includesAll(contentScriptText, [
      'const SUCCESS_CELEBRATION_ID = "__xposter_success_celebration__"',
      'const SUCCESS_CELEBRATION_STYLE_ID = "__xposter_success_celebration_style__"',
      "const SUCCESS_CELEBRATION_DURATION_MS = 2400",
      "const SUCCESS_CELEBRATION_PIECE_COUNT = 56",
      "const SUCCESS_CELEBRATION_DEDUP_MS = 2000",
      "function injectSuccessCelebrationStyle",
      "function showSuccessCelebration",
      "state.successFeedback.confetti === false",
      "state.lastSuccessCelebrationAt",
      "suppressedReason",
      "prefersReducedMotion()",
      "position: fixed;",
      "width: 100vw;",
      "height: 100dvh;",
      "animation: __xposter_success_piece 2100ms",
      "window.setTimeout(() => root.remove(), SUCCESS_CELEBRATION_DURATION_MS)",
      ".__xposter_success_mark",
      ".__xposter_success_piece",
      "prefers-reduced-motion: reduce",
      'message?.type === "xposter:success-celebration"',
      "sendResponse({ ok: true, ...result })"
    ]),
  "celebration should render on the X page through the content script, not side panel canvas confetti"
);
assert.ok(
  sidepanelText.includes("AudioContext") &&
    sidepanelText.includes("createOscillator") &&
    sidepanelText.includes("SUCCESS_SOUND_STYLES") &&
    sidepanelRuntimeText.includes("SUCCESS_SOUND_VOLUME: 1") &&
    sidepanelText.includes("successSoundNotes") &&
    sidepanelText.includes("async function primeSuccessAudio()") &&
    sidepanelText.includes("async function previewSuccessFeedback()") &&
    sidepanelText.includes("await primeSuccessAudio();") &&
    sidepanelText.includes("previewSuccessFeedback()") &&
    !sidepanelText.includes("if (successFeedbackOptions.confetti) await requestPageSuccessCelebration();") &&
    !sidepanelText.includes("successSoundVolume") &&
    !sidepanelText.includes("successSoundVolumeValue") &&
    !sidepanelText.includes("Sound blocked"),
  "completion sound should use audible local Web Audio at fixed full volume, preview style changes without page celebration noise, unlock on write action, and keep settings free of test-only playback UI"
);
assert.ok(
  backgroundText.includes("REMOTE_IMAGE_RETRY_DELAYS_MS = [0, 700, 1800]") &&
    backgroundText.includes("isPrivateImageHost") &&
    backgroundText.includes("Unsupported image type"),
  "background image fetches should bound retries and reject private or non-image URLs"
);
assert.ok(
  sidepanelText.includes("scheduleAnalyzeDraft()") &&
    sidepanelText.includes("scheduleRecordHistoryRender()") &&
    sidepanelText.includes("scheduleSaveDraft()") &&
    sidepanelText.includes("DRAFT_ANALYZE_DELAY_MS"),
  "side panel should debounce expensive draft saves, analysis, and record search renders"
);
assert.ok(
  coverOnlyPlan.plan.some(
    (item) =>
      item.op.type === "image" &&
      item.op.coverOnly === true &&
      item.op.source === "https://images.example.test/path/cover.png"
  ),
  "frontmatter-only cover should create a temporary cover upload operation"
);
assert.ok(
  !coverOnlyPlan.plain.includes("![cover]"),
  "frontmatter-only cover placeholder should not add visible Markdown image text"
);

const readme = readText("README.md");
const readmeZh = readText("README.zh-CN.md");
const usageZh = readText("docs/usage.zh-CN.md");
const allPublicText = [
  "README.md",
  "README.zh-CN.md",
  "docs/usage.md",
  "docs/usage.zh-CN.md",
  "docs/privacy.md",
  "docs/privacy.zh-CN.md",
  "manifest.json",
  "sidepanel.js"
]
  .map(readText)
  .join("\n");

assert.ok(
  readme.includes("https://chromewebstore.google.com/detail/xposter/iimkimodgdjnnmdopeolboakhjmhfbbj"),
  "English README should recommend the Chrome Web Store listing"
);
assert.ok(readmeZh.includes("Chrome Web Store"), "Chinese README should mention Chrome Web Store");
assert.ok(usageZh.includes("添加至 Chrome"), "Chinese usage guide should explain store installation");
assert.ok(readmeZh.includes("https://x.com/xiaoxiaodong01"), "Chinese README should include author contact");
assert.ok(
  readme.includes("docs/images/buy-me-a-coffee-qr.png"),
  "English README should include the support QR code"
);
assert.ok(
  readmeZh.includes("docs/images/buy-me-a-coffee-qr.png"),
  "Chinese README should include the support QR code"
);
assert.ok(
  !/https:\/\/[^\s"']*cos\.ap-guangzhou\.myqcloud\.com/.test(allPublicText),
  "private image host must not be exposed"
);

console.log("xPoster smoke test passed");
