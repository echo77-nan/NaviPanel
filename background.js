function enableSidePanelClick() {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch(() => {});
}

chrome.runtime.onInstalled.addListener(enableSidePanelClick);
chrome.runtime.onStartup.addListener(enableSidePanelClick);
enableSidePanelClick();
