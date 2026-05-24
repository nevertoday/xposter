# xPoster 使用说明

这份说明写给第一次使用 Chrome 扩展的人。

## 1. 安装 xPoster

推荐安装方式：

1. 打开 [xPoster Chrome Web Store 页面](https://chromewebstore.google.com/detail/xposter/iimkimodgdjnnmdopeolboakhjmhfbbj?authuser=0&hl=zh-CN)。
2. 点击 **添加至 Chrome**。
3. 使用应用商店版本，它会持续获得功能更新和体验完善。

开发者源码安装：

1. 下载或 clone xPoster。
2. 打开 Chrome。
3. 在地址栏输入 `chrome://extensions`。
4. 打开右上角 **开发者模式**。
5. 点击 **加载已解压的扩展程序**。
6. 选择 xPoster 文件夹，也就是包含 `manifest.json` 的文件夹。

普通用户建议走应用商店安装，不需要理解源码安装。

## 2. 准备 Markdown 草稿

可以用任何 Markdown 编辑器。一个最小示例：

```markdown
---
title: 我的第一篇 X 文章
---

# 如果上面有 title，这个标题会进入正文

这里是一段正文，带有 **加粗** 和 [链接](https://example.com)。

- 第一点
- 第二点

![图片说明](image.png)
```

仓库里也带了一个测试草稿：

```text
fixtures/live-x-smoke.md
```

## 3. 打开 X 文章编辑器

1. 在 Chrome 里登录 X。
2. 打开 `https://x.com/compose/articles`。
3. 新建文章，或打开你想填充的文章草稿。

xPoster 需要一个已经打开的 X Article 页面，因为它会填充当前页面里的编辑器。

## 4. 打开 xPoster

从 Chrome 工具栏或侧边栏打开 xPoster。

你会看到：

- 带有 **添加草稿** 按钮的待发布草稿列表。
- 预览页。
- **Check article / 检查文章** 按钮。
- **Write article / Import / 写入文章 / 导入** 按钮。
- 一个告诉你“哪些已就绪、哪些还缺”的检查列表。

## 5. 放入草稿

任选一种方式：

- 点击 **添加草稿**，在弹出框里粘贴 Markdown。
- 点击文件按钮，选择 `.md` 文件。
- 点击 **Example / 样例**，先试内置示例。

草稿放入后，xPoster 会预览文章结构，并提示哪些内容需要处理。

如果一次选择或拖入多篇 Markdown，xPoster 会把它们加入同一个待发布草稿列表。点击某一行就是选中下一篇要写入的草稿，也可以点击这一行的编辑按钮，在弹出框里修改 Markdown。弹出框打开时，后面的列表不会继续滚动。

## 6. 导入前检查

点击 **Check article / 检查文章**。

xPoster 会检查：

- 当前标签页是不是 X/Twitter。
- 当前页面是不是 X Articles。
- 内容脚本是否能连接页面。
- 是否能找到 X 的 Draft.js 编辑器。
- 是否能找到 X 的媒体上传处理器。
- 编辑器里是否已有内容。
- 本地图片文件夹权限是否准备好。

如果缺东西，侧边栏顶部会告诉你下一步该做什么。

## 7. 导入

检查通过后点击 **Write article / Import / 写入文章 / 导入**。

xPoster 会：

1. 解析 Markdown。
2. 准备图片和表格图片。
3. 把支持的文字粘贴到 X 编辑器。
4. 把占位标记替换成图片、表格、推文、代码块或分割线。
5. 在侧边栏保存本次操作记录。

## 8. 在 X 里检查

发布前请检查：

- 标题是否正确。
- 文本格式是否正确。
- 图片是否出现。
- 表格是否清晰。
- 推文嵌入是否正确。
- 代码块和分割线是否能接受。
- 没有残留 `__XPOSTER_` 之类的占位文字。

xPoster 不会替你点击发布。你必须自己确认后，在 X 里手动发布。

## 常见问题

### Chrome 说这是解包扩展

源码安装时这是正常的。普通用户建议安装 Chrome 应用商店版本。

### 检查文章时说找不到编辑器

请打开或新建一篇真正的 X Article 草稿。只停留在文章列表页不够。

### Chrome 询问图片网站权限

如果你信任这个图片来源，可以选择允许。xPoster 需要读取图片文件，才能上传到 X。

### 本地图片没有导入

请选择包含这些图片的本地文件夹。相对路径如 `./images/photo.png` 只有在 xPoster 能读取对应文件夹后才可用。

### 导入只成功了一部分

先不要发布。查看保存记录和诊断信息，找到失败步骤，然后用干净的 X Article 草稿重试。
