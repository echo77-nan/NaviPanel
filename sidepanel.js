const root = document.getElementById("root");
const refreshBtn = document.getElementById("refresh");
const statusEl = document.getElementById("status");

function t(key, substitutions) {
  return chrome.i18n.getMessage(key, substitutions);
}

function applyStaticI18n() {
  const ui = chrome.i18n.getUILanguage?.() || navigator.language || "en";
  document.documentElement.lang = ui.toLowerCase().startsWith("zh")
    ? "zh-CN"
    : "en";
  document.title = t("pageTitle");
  const brandTitle = document.getElementById("brand-title");
  const brandSub = document.getElementById("brand-sub");
  if (brandTitle) brandTitle.textContent = t("brandTitle");
  if (brandSub) brandSub.textContent = t("brandSubtitle");
  refreshBtn.textContent = t("refresh");
}

applyStaticI18n();

function showStatus(text) {
  statusEl.textContent = text;
  statusEl.hidden = !text;
}

function tabUrlAllowed(url) {
  if (!url) return false;
  return /^https?:\/\//i.test(url);
}

async function fetchSnippet(tab) {
  if (tab.discarded || !tabUrlAllowed(tab.url)) return null;
  try {
    const [injection] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const rootEl =
          document.querySelector("article") ||
          document.querySelector("main") ||
          document.body;
        const text = (rootEl?.innerText || "")
          .replace(/\s+/g, " ")
          .trim();
        return text.slice(0, 220);
      },
    });
    const text = injection?.result;
    return typeof text === "string" && text.length ? text : null;
  } catch {
    return null;
  }
}

async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;

  async function worker() {
    while (true) {
      const i = next++;
      if (i >= items.length) break;
      results[i] = await fn(items[i], i);
    }
  }

  const n = Math.min(Math.max(limit, 1), items.length || 1);
  await Promise.all(Array.from({ length: n }, () => worker()));
  return results;
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderTabs(tabs, snippets) {
  const byWindow = new Map();
  for (let i = 0; i < tabs.length; i++) {
    const tab = tabs[i];
    if (!byWindow.has(tab.windowId)) byWindow.set(tab.windowId, []);
    byWindow.get(tab.windowId).push({ tab, snippet: snippets[i] });
  }

  const windows = [...byWindow.entries()];
  if (!windows.length) {
    root.innerHTML = `<div class="empty">${escapeHtml(t("emptyNoTabs"))}</div>`;
    return;
  }

  root.innerHTML = windows
    .map(([windowId, rows], wi) => {
      const label =
        windows.length > 1
          ? t("windowN", [String(wi + 1)])
          : t("windowCurrent");
      const cards = rows
        .map(({ tab, snippet }) => {
          const fav = tab.favIconUrl
            ? `<img src="${escapeHtml(tab.favIconUrl)}" alt="" />`
            : '<span class="thumb-fallback">🌐</span>';
          const active = tab.active
            ? `<span class="pill">${escapeHtml(t("badgeCurrent"))}</span>`
            : "";
          const sn = snippet
            ? `<div class="snippet">${escapeHtml(snippet)}</div>`
            : `<div class="snippet muted">${escapeHtml(
                tab.discarded
                  ? t("snippetDiscarded")
                  : tabUrlAllowed(tab.url)
                    ? t("snippetRestricted")
                    : t("snippetUnsupported"),
              )}</div>`;
          const safeTitle = escapeHtml(tab.title || t("untitled"));
          const safeUrl = escapeHtml(tab.url || "");
          return `
            <button type="button" class="card${tab.active ? " active" : ""}" data-tab-id="${tab.id}" data-window-id="${tab.windowId}">
              <div class="thumb-wrap">${fav}</div>
              <div class="card-body">
                <div class="title-row">
                  <span class="title">${safeTitle}</span>
                  ${active}
                </div>
                <div class="url" title="${safeUrl}">${safeUrl}</div>
                ${sn}
              </div>
            </button>`;
        })
        .join("");

      return `
        <section class="window-block" data-window-id="${windowId}">
          <div class="window-label">${escapeHtml(label)}</div>
          <div class="grid">${cards}</div>
        </section>`;
    })
    .join("");

  root.querySelectorAll(".card").forEach((el) => {
    el.addEventListener("click", async () => {
      const tabId = Number(el.dataset.tabId);
      const windowId = Number(el.dataset.windowId);
      try {
        await chrome.tabs.update(tabId, { active: true });
        await chrome.windows.update(windowId, { focused: true });
      } catch (e) {
        showStatus(t("statusSwitchFailed"));
        setTimeout(() => showStatus(""), 2500);
      }
    });
  });
}

async function loadAll() {
  showStatus(t("statusLoadingSnippets"));
  refreshBtn.disabled = true;
  root.innerHTML = `<div class="empty skeleton">${escapeHtml(
    t("emptyLoading"),
  )}</div>`;

  const tabs = await chrome.tabs.query({});

  const snippets = await mapWithConcurrency(tabs, 4, (tab) => fetchSnippet(tab));

  showStatus("");
  refreshBtn.disabled = false;
  renderTabs(tabs, snippets);
}

refreshBtn.addEventListener("click", () => loadAll());

let debounceTimer;
function scheduleReload() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => loadAll(), 400);
}

chrome.tabs.onCreated.addListener(() => loadAll());
chrome.tabs.onRemoved.addListener(() => loadAll());
chrome.tabs.onUpdated.addListener((tabId, info) => {
  if (
    info.status === "complete" ||
    info.title ||
    info.favIconUrl ||
    info.url
  ) {
    scheduleReload();
  }
});

loadAll();
