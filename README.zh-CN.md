# xPoster

xPoster 是一个把 Markdown 草稿导入 X Articles 的 Chrome 扩展。

它适合先用 Markdown 写长文、最后再发布到 X 的人。你把 `.md` 草稿粘贴或导入 xPoster，xPoster 会先预览能识别的内容，检查当前 X 文章标签页，帮你把内容填进 X 编辑器。最后是否发布，仍然由你自己在 X 里决定。

[English README](README.md)

![xPoster 侧边栏截图](docs/images/sidepanel-real.png)

## 推荐安装方式

普通用户建议直接从 Chrome 应用商店安装：

[打开 xPoster Chrome Web Store 页面](https://chromewebstore.google.com/detail/xposter/iimkimodgdjnnmdopeolboakhjmhfbbj?authuser=0&hl=zh-CN)

1. 点击上面的链接。
2. 点击 **添加至 Chrome**。
3. 打开 X Articles，就可以开始使用。

应用商店版本是推荐版本。我会持续更新功能、修复问题、完善体验。

## 这个项目有什么用

- 你可以在 Obsidian、Typora、VS Code、Notion 导出的 Markdown 或任何本地编辑器里先写好长文。
- 不用在 X 的网页编辑器里一点点复制粘贴和重新排版。
- xPoster 会先告诉你“现在缺什么”，比如没有打开 X 文章、图片没授权、编辑器没检查。
- 常见 Markdown 内容可以自动处理：标题、段落、列表、引用、链接、加粗、斜体、代码、分割线、图片、表格、X 推文链接。
- 它不会替你点发布。导入后你仍然要自己检查，然后在 X 里手动发布。

## 快速使用

![xPoster 发布流程](docs/images/publishing-flow.svg)

1. 安装 Chrome 应用商店版本。
2. 在 Chrome 中登录 X。
3. 打开或新建一篇 X Article：`https://x.com/compose/articles`。
4. 打开 xPoster 侧边栏。
5. 点击 **添加草稿** 粘贴 Markdown，或者选择 `.md` 文件。
   每篇草稿都会进入待发布列表，不会把正文直接铺在页面里。
6. 看预览和问题列表。
7. 点击 **Check article / 检查文章**。
8. 选中要写入的草稿，需要修改时在弹出框里编辑，然后点击 **Write article / Import / 写入文章 / 导入**。
9. 回到 X 文章编辑器里仔细检查。
10. 确认没问题后，再手动点击 X 自己的发布按钮。

## 待发布草稿

待发布页现在只有一个列表。点击 **添加草稿**、选择单个 `.md`、拖入文本、从记录恢复，或一次加载多篇 `.md`，都会把草稿加入这个列表。被选中的那一行就是下一篇将要写入 X 的草稿；每一行都可以在弹出框里编辑、复制或移除，长篇 Markdown 不会直接展开在页面里。

## 源码安装

如果你是开发者，想查看或修改源码，可以用解包扩展方式安装：

1. 下载或 clone 这个仓库。
2. 打开 Chrome 的 `chrome://extensions`。
3. 打开右上角 **开发者模式**。
4. 点击 **加载已解压的扩展程序**。
5. 选择包含 `manifest.json` 的 xPoster 项目文件夹。

普通用户不需要这样做，直接用 Chrome 应用商店版本即可。

## 支持哪些 Markdown

| Markdown 内容 | xPoster 会做什么 |
| --- | --- |
| `--- title: 标题 ---` | 尽量用 frontmatter 设置 X 文章标题。 |
| `# 一级标题` | 没有 frontmatter 标题时，尽量用第一个 H1 当标题。 |
| 段落、列表、引用 | 转成 X 编辑器能接受的正文。 |
| `**加粗**`、`*斜体*`、`` `代码` ``、链接 | 尽量保留行内格式。 |
| `![alt](image.png)` | 在能读取图片文件时上传图片。 |
| Markdown 表格 | 渲染成图片，避免 X 里表格变形。 |
| X/Twitter 推文链接 | 尽量插入为 X 的推文嵌入块。 |
| 代码块、分割线 | 尽量转成 X Article 支持的特殊内容块。 |

测试草稿在这里：[fixtures/live-x-smoke.md](fixtures/live-x-smoke.md)。

## 图片说明

本地图片：把图片文件和 Markdown 放在容易找到的位置。xPoster 需要你选择本地图片所在文件夹，才能读取相对路径图片。

网页图片：Chrome 可能会弹出一次授权，询问是否允许 xPoster 读取图片所在网站。xPoster 需要读取图片文件本身，才能把它上传进 X。这个权限不会让 xPoster 自动发布文章。

公开源码版本不会暴露私人图床域名。如果你维护自己的 fork，并且需要支持某个固定图片网站，请只在你自己的 manifest 中声明你信任的图片域名。

## 隐私与安全

- 草稿保存在你自己的浏览器扩展本地存储里。
- xPoster 运行在 `x.com` 和 `twitter.com`，因为它需要填写 X 文章编辑器。
- xPoster 使用 `tabs` 权限，是为了找到并检查当前 X 文章标签页。
- xPoster 没有分析统计、后台服务器、付费墙、许可证验证或订阅限制。
- xPoster 不会点击发布。最终发布永远由你自己在 X 中确认。

更多隐私说明见：[docs/privacy.zh-CN.md](docs/privacy.zh-CN.md)。

## 常见问题

**我应该装哪个版本？**  
普通用户请装 Chrome 应用商店版本。源码版本适合开发、审计和自定义。

**写入文章 / 导入按钮不能点。**
先载入或编辑 Markdown 草稿，再打开 X Article 标签页，然后点击检查文章。

**图片没有变成 X 里的图片。**  
本地图片需要选择图片文件夹。网页图片需要允许 Chrome 的图片网站权限。

**导入后看起来不对。**  
先不要发布。可以在 X 里手动修改，或者清空草稿后重新导入。

**X 改版导致失效。**  
欢迎在 GitHub 提 issue，并附上 Chrome 版本、xPoster 版本和诊断 JSON。

## 联系作者

可以通过作者 X 主页联系：[@xiaoxiaodong01](https://x.com/xiaoxiaodong01)。

## 支持作者

xPoster 会继续保持免费开源。如果它帮你节省了整理和发布长文的时间，也愿意支持后续维护，可以扫描下面的 Buy Me a Coffee 二维码请作者喝杯咖啡。完全自愿；反馈、Star 和 issue 同样很有帮助。

<img src="docs/images/buy-me-a-coffee-qr.png" alt="Buy Me a Coffee 支持二维码" width="220">

## 开源协议

MIT。见 [LICENSE](LICENSE)。
