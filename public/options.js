const checkbox = document.querySelector('#openinnewtab');

/* eslint-disable */
chrome.storage.sync.get(['replaceNewTab'], (items) => {
  checkbox.checked = items.replaceNewTab;
});

checkbox.addEventListener('change', (event) => {
  chrome.storage.sync.set({ replaceNewTab: event.target.checked });
});
