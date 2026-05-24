# xPoster

xPoster is a free Chrome extension that moves a Markdown draft into X Articles.

It is built for people who write in Markdown first, then publish on X later. You paste or load a `.md` file, xPoster previews what it understands, checks the active X Article tab, fills the editor, and leaves the final Publish click to you.

[中文说明](README.zh-CN.md)

![xPoster side panel screenshot](docs/images/sidepanel-real.png)

## Why Use It

- Write long posts in any Markdown editor instead of drafting everything inside X.
- Keep a repeatable checklist before import: draft, X Article tab, editor bridge, images, and final review.
- Convert common Markdown pieces into X-friendly content: headings, paragraphs, lists, quotes, links, inline formatting, code blocks, dividers, images, tables, and tweet embeds.
- Use it without an account, subscription, license key, or trial gate.
- Stay in control: xPoster fills the draft editor, but it does not publish the article for you.

## Quick Install

![Chrome load unpacked steps](docs/images/install-steps.svg)

Recommended install path:

1. Open the Chrome Web Store listing: [xPoster on Chrome Web Store](https://chromewebstore.google.com/detail/xposter/iimkimodgdjnnmdopeolboakhjmhfbbj?authuser=0&hl=zh-CN).
2. Click **Add to Chrome**.
3. Open X Articles and start using xPoster. The store version is the recommended version and will keep receiving feature updates and improvements.

Developer install from source:

1. Download or clone this project.
2. Open Chrome and go to `chrome://extensions`.
3. Turn on **Developer mode**.
4. Click **Load unpacked**.
5. Select the xPoster project folder, the folder that contains `manifest.json`.

Use the source install only if you want to inspect or modify the extension yourself.

## Quick Use

![xPoster publishing flow](docs/images/publishing-flow.svg)

1. Open or create an X Article at `https://x.com/compose/articles`.
2. Open the xPoster side panel.
3. Click **Add draft** to paste Markdown, choose a Markdown file, or click **Example**.
   Every draft appears in the Pending list instead of opening inline.
4. Check the preview and the issue list.
5. Click **Check article** so xPoster can confirm the active X Article tab is reachable.
6. Select the draft you want, edit it in the popup if needed, then click **Write article / Import**.
7. Review the article inside X.
8. Click X's own Publish button only when the article looks right.

## Pending Drafts

Pending is one list. Use **Add draft**, choose one `.md` file, drop text, restore a record, or load many `.md` files; xPoster adds each draft as a row. The selected row is the draft that will be written next. Row actions let you edit in a popup, copy, or remove without expanding long Markdown inside the page.

## What Markdown Works

| Markdown input | What xPoster does |
| --- | --- |
| `--- title: My title ---` | Uses frontmatter as the X Article title when possible. |
| `# Heading` | Uses the first H1 as title if frontmatter has no title. |
| Paragraphs, lists, quotes | Converts them into rich text for the editor. |
| `**bold**`, `*italic*`, `` `code` ``, links | Keeps inline formatting where X accepts it. |
| `![alt](image.png)` | Uploads supported images when xPoster can read the file. |
| Markdown tables | Renders tables as images so X can show them cleanly. |
| X/Twitter status URLs | Inserts tweet embeds through X's editor model. |
| Code fences and dividers | Imports them as X Article atomic blocks where supported. |

A smoke-test draft is included at [fixtures/live-x-smoke.md](fixtures/live-x-smoke.md).

## Image Notes

For local images, keep the image files near your Markdown file and choose the local image folder when xPoster asks.

For web images, Chrome may ask for one-time permission to read the image website. xPoster needs that browser permission so it can download the image and upload the actual file into X. It does not grant xPoster permission to publish.

The public source build does not expose private image hosts. If you maintain your own fork and need remote image support for a specific host, declare only the host you trust in your own extension manifest.

## Safety And Privacy

- xPoster stores drafts in your browser's local extension storage.
- xPoster runs on `x.com` and `twitter.com` because it needs to fill the X Article editor.
- xPoster asks for `tabs` only to find and check the active X Article tab.
- xPoster does not include analytics, a backend service, a license server, or a payment gate.
- xPoster does not click Publish. You always review and publish manually in X.

Read the shorter privacy note in [docs/privacy.md](docs/privacy.md).

## Developer Checks

This project is dependency-light. Node is only used for local verification.

```bash
npm run check
npm test
npm run verify
```

`npm run check` verifies JavaScript syntax and `manifest.json`.

`npm test` verifies the included fixture, manifest references, icons, and Markdown parsing behavior.

## Project Layout

```text
manifest.json          Chrome extension manifest
sidepanel.html         Main side panel UI
sidepanel.css          Side panel styling
sidepanel.js           Side panel workflow and import controls
diagnostics.html       Toolbar popup for active-tab checks
diagnostics.js         Diagnostics UI logic
src/background.js      MV3 service worker and image fetch proxy
src/content.js         X page content script and import pipeline
src/main-world.js      MAIN-world Draft.js / X editor adapter
src/shared.js          Markdown parser, paste plan, local image helpers
fixtures/              Example Markdown used by checks and demos
docs/                  Beginner guide, images, privacy notes
scripts/               Local verification scripts
```

## Common Problems

**I cannot see xPoster in Chrome.**
Make sure Developer mode is on, click **Load unpacked**, and select the folder that contains `manifest.json`.

**Write article / Import is disabled.**
Load or edit a Markdown draft first, open an X Article tab, then click **Check article**.

**Images stay as text.**
xPoster could not read the image file. For local files, choose the folder that contains the image. For web images, allow the image website when Chrome asks.

**The article looks wrong after import.**
Do not publish yet. Edit directly in X or reset the draft and retry. xPoster intentionally leaves the final publish decision to you.

**X changed its editor and import stopped working.**
Open an issue with your Chrome version, xPoster version, and the diagnostics JSON from the toolbar popup.

## Contributing

Issues and pull requests are welcome. Start with [CONTRIBUTING.md](CONTRIBUTING.md).

## Support

xPoster is free and open source. If it saves you time and you want to support ongoing maintenance, you can scan the Buy Me a Coffee QR code below. This is completely optional; feedback, issues, and stars also help the project.

<img src="docs/images/buy-me-a-coffee-qr.png" alt="Buy Me a Coffee QR code" width="220">

## Contact

Contact the author on X: [@xiaoxiaodong01](https://x.com/xiaoxiaodong01).

## License

MIT. See [LICENSE](LICENSE).
