'use strict';
(function () {
  const _LOG_ = localStorage.log;
  const UA = navigator.userAgent;
  const WebExtensions = UA.includes("Chrome") ? chrome : browser;
  const manifest = WebExtensions.runtime.getManifest();
  if (_LOG_) {
    console.log(...logGen(null, manifest.name, manifest.version + " start"));
  };
  WebExtensions.browserAction.onClicked.addListener((tab) => {
    if (_LOG_) {
      console.log(...logGen(tab.id, "browserAction.onClicked", ""));
    }
    WebExtensions.tabs.create({ url:"/index.html", active: true }, (newTab) => {
      if (!handleError("tabs.create")()) {
        console.log(...logGen(tab.id, "tabs.create", " ok"));
      } else {
        console.log(...logGen(tab.id, "tabs.create", " failed"));
      }
    });
  });
  function handleError(label) {
    return () => {
      if (WebExtensions.runtime.lastError) {
        if (_LOG_) {
          console.error(...logGen(label, "chrome.runtime.lastError", WebExtensions.runtime.lastError.message));
        }
        return true;
      }
      return false;
    };
  };
  function logColor(tabId) {
    const _r = tabId % 64;
    return "color:#" + ((_r >> 4 & 3) << 22 | (_r >> 2 & 3) << 14 | (_r & 3) << 6 | 1048576).toString(16);
  }
  function logGen(tabId, eventName, message) {
    if (tabId) {
      return ["tabId %c" + tabId + "%c [" + eventName + "]%c " + message, logColor(tabId), "color:#f60b91", ""];
    } else {
      return ["%c%c[" + eventName + "]%c " + message, logColor(tabId), "color:#f60b91", ""];
    }
  }
})();

