# 插件描述文案（可复制）

以下文案可用于 **GitHub 仓库简介**、**Chrome 网上应用店**、**项目首页** 等场景。按需截取。

---

## 一句话简介（适合 GitHub 仓库 About / 短标签）

> 在 Chrome 侧边栏总览所有标签页，展示标题、链接与正文摘要，点击卡片即可切换页面，告别多标签难找。

**字数**：约 45 字（适合一句话介绍）

---

## 超短版（尽量控制在约 80 字内，便于部分平台字数限制）

Chrome 扩展：侧边栏列出全部标签页，含站点图标、标题、网址与页面正文摘要；单击卡片激活对应标签并聚焦窗口。支持自动/手动刷新。数据仅本地处理。

---

## Chrome 网上应用店「简短说明」参考（建议 ≤132 个字符；中英文混合时以平台实际计数为准）

```
在侧边栏查看所有标签页的标题与正文摘要，点一下即可切换到对应网页。多标签整理利器，数据仅本地处理。
```

（若平台限制更严，可改用下面更短版本）

```
侧边栏总览所有标签页：标题、摘要、一键切换。本地处理，不上传页面内容。
```

---

## 详细描述段落（适合商店「详细说明」或 README 摘要）

**标签页总览面板** 是一款面向「多标签工作者」的 Chrome 浏览器扩展。它利用浏览器自带的**侧边栏（Side Panel）**，把当前已打开的标签页以卡片形式集中展示：每张卡片包含站点图标、页面标题、完整链接，以及从页面正文中抽取的**短摘要**，帮助你快速回忆「这一页在做什么」。单击任意卡片，即可在对应窗口中**激活该标签页**，无需在拥挤的标签栏里逐个辨认。扩展在本地读取标签信息与页面可见文本，不向远程服务器上传你的网页内容。部分受限制的特殊页面可能无法显示摘要，属正常现象。

---

## 英文简介（可选，用于国际化仓库）

**Tab Overview Panel** is a Chrome extension that opens a **side panel** listing all your open tabs with favicon, title, URL, and a short **text snippet** extracted from the page. Click a card to **switch to that tab** and focus its window—handy when many tabs are open. List updates automatically; a manual refresh is available. Processing is local; page content is not uploaded to a developer server.

---

## 关键词 / 标签建议（用于 GitHub Topics 或商店分类）

`chrome-extension` `manifest-v3` `side-panel` `tabs` `productivity` `tab-manager` `中文` `浏览器扩展`

---

## `manifest.json` 中的 `description` 字段建议

扩展已使用 `_locales` 与 `__MSG_appDescription__` 做多语言；若需单行中文描述可参考：

```json
"description": "在侧边栏集中查看所有标签页的标题、链接与正文摘要，点击卡片即可切换到对应网页；多标签时快速找回目标页，数据仅本地处理。"
```

英文商店可用：

```json
"description": "Side panel: all tabs with titles and snippets; click to switch. Local only."
```
