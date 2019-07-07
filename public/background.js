/* eslint-disable */
chrome.tabs.onCreated.addListener(tab => {
  // If a new tab is opened (without any URL), check user's
  // replace Tab setting and act accordingly. Default is false.
  // Huge thanks to  Kushagra Gour for this code
  // https://kushagra.dev/blog/conditional-newtab-override-chrome-extension/
  // Slight adjustment as new tabs don't seem to have a URL attached in Chrome 74
  // if a tab URL is undefined, we're going to assume it's the new tab.

  // TODO: This doesn't work super reliably yet
  if (tab.url === undefined) {
    chrome.storage.sync.get(['replaceNewTab'], (items) => {
      if (items.replaceNewTab === true) {
        chrome.tabs.update( tab.id, { url: chrome.extension.getURL('index.html') });
      }
    });
  }
});

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
});