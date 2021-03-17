const flipKnights = false;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ flipKnights });
});
