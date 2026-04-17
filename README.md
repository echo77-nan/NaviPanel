# 标签页总览面板 · Tab Overview Panel

**中文**：一款 Chrome 浏览器扩展：在**侧边栏**里集中展示当前已打开的所有标签页，用**站点图标 + 标题 + 链接 + 页面正文摘要**帮你快速分辨「哪一页是干什么的」，**点击卡片即可切换到对应网页**。

**English**: A Chrome extension that lists all open tabs in the **side panel** with **favicon, title, URL, and a short text snippet** so you can tell pages apart quickly; **click a card to switch to that tab**.

界面与扩展名称/说明会随 **Chrome 界面语言**（与浏览器首选语言一致）自动显示为**简体中文**或**英文**；未匹配到中文包时使用英文作为默认语言。

The UI and store strings follow **Chrome’s UI language** (aligned with the browser’s display language), showing **Simplified Chinese** or **English**; **English** is the fallback (`default_locale`).

**可复制的一句话 / 商店简介 / 中英段落**：见 [extension-description.md](extension-description.md)。

---

## 简体中文

### 功能概览

- **一屏总览**：按窗口分组列出当前浏览器中的标签页（多窗口时更易区分）。
- **内容摘要**：对普通 `http/https` 网页尝试读取可见正文片段（优先 `article` / `main` / body），便于回忆页面主题。
- **一键跳转**：点击某张卡片 → 激活该标签页并聚焦其所在窗口。
- **自动刷新**：新建/关闭标签页会刷新列表；标题或地址变化时会在短暂延迟后自动刷新，减少卡顿。
- **手动刷新**：面板顶部提供「刷新」按钮，可随时重新拉取列表与摘要。

### 安装方式

#### 从源码加载（开发者模式）

1. 打开 Chrome，地址栏输入 `chrome://extensions/` 并回车。
2. 打开右上角 **「开发者模式」**。
3. 点击 **「加载已解压的扩展程序」**。
4. 选择本仓库根目录（内含 `manifest.json` 的文件夹）。
5. 若浏览器提示 **「读取和更改所有网站上的数据」** 等权限，请按提示允许（摘要功能需要对网页执行脚本，详见下文「权限说明」）。

#### 从 GitHub 使用

克隆或下载本仓库后，按上一节「加载已解压的扩展程序」指向本地文件夹即可。

### 使用指南（摘要）

- 点击工具栏扩展图标打开**侧边栏**；卡片含图标、标题、链接与摘要；**当前**标签有高亮。
- 多窗口时按「窗口 1 / 2 …」分组；点整张卡片即可切换并聚焦对应窗口。
- 顶部 **刷新** 可立即重拉列表与摘要；日常也会随标签变化自动更新。

### 权限说明

| 权限 | 用途 |
|------|------|
| `tabs` | 读取标签页列表（标题、URL、图标、窗口等），并在点击卡片时激活指定标签。 |
| `sidePanel` | 在浏览器侧边栏展示本扩展的面板界面。 |
| `scripting` | 在符合条件的网页中执行脚本，用于提取可见文字作为摘要。 |
| `host_permissions: <all_urls>` | 对普通网页注入摘要脚本；无法读取的网站会显示说明文字而非报错崩溃。 |

本扩展**不会**将页面内容上传到任何服务器；所有逻辑均在本地浏览器内完成。

### 项目结构

| 文件 | 说明 |
|------|------|
| `manifest.json` | 扩展清单（Manifest V3），含 `default_locale` 与 `__MSG_*__` 文案键 |
| `_locales/en/`、`/_locales/zh_CN/` | 英文与简体中文翻译（随 Chrome 界面语言选用） |
| `background.js` | 后台脚本：配置点击图标打开侧边栏 |
| `sidepanel.html` / `sidepanel.css` / `sidepanel.js` | 侧边栏面板 UI 与业务逻辑（文案来自 `chrome.i18n`） |

### 浏览器与限制

- 需支持 **Chrome Side Panel（侧边栏）** 的较新版本 Chrome（或同类 Chromium 内核浏览器若兼容相同 API）。
- **整页实时截图缩略图**：标准扩展 API 无法对「所有未聚焦后台标签」稳定生成完整页面截图；本扩展以 **大图标 + 文字摘要** 表达页面内容，更符合多标签管理类扩展的常见实现。

### 开源协议

若仓库根目录包含 `LICENSE` 文件，以该文件为准；否则由仓库所有者自行补充。

### 反馈与改进

欢迎通过 Issues 反馈：无法摘要的站点类型、希望增加「仅当前窗口」「按域名折叠」等需求，便于后续迭代。

---

## English

### Features

- **All tabs in one view**, grouped by window when you use multiple windows.
- **Snippets** from visible page text (`article` / `main` / `body`) for normal `http/https` pages.
- **One click** on a card activates that tab and focuses its window.
- **Auto refresh** on tab create/close and after title/URL changes (debounced); **Refresh** button for a manual reload.

### Install (developer / unpacked)

1. Open `chrome://extensions/`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this repo root (folder with `manifest.json`).
4. Approve permissions as prompted (`host_permissions` are required for snippet injection on web pages).

### Permissions (summary)

| Permission | Purpose |
|------------|---------|
| `tabs` | Read tab metadata and activate a tab when you click a card. |
| `sidePanel` | Show this UI in Chrome’s side panel. |
| `scripting` | Run a small script on eligible pages to read visible text for snippets. |
| `host_permissions: <all_urls>` | Inject on normal sites; restricted pages show a short explanation instead of breaking. |

No page content is uploaded to a remote server; everything runs locally.

### Project layout

| Path | Role |
|------|------|
| `manifest.json` | Manifest V3, `default_locale`, localized `name` / `description` / action title |
| `_locales/en/`, `_locales/zh_CN/` | English and Simplified Chinese strings (chosen from Chrome’s UI language) |
| `background.js` | Opens side panel on extension icon click |
| `sidepanel.*` | Side panel UI and logic (`chrome.i18n` for copy) |

### Browser support & limits

- Requires a Chromium build with **Side Panel** APIs.
- Full-page thumbnails for every background tab are not reliably available via standard APIs; this extension uses **large favicons + text snippets** instead.

### License & feedback

If a `LICENSE` file exists at the repo root, it governs; otherwise add one as needed. Issues welcome for sites where snippets fail or for feature ideas (e.g. current window only, group by domain).
