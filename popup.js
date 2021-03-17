let toggleFlip = document.getElementById("toggleFlip");

chrome.storage.sync.get("flipKnights", ({ flipKnights }) => {
  setButtonText(flipKnights);
});

const setButtonText = (flipKnights) => {
  toggleFlip.textContent = flipKnights ? 'Disable' : 'Enable';
};

toggleFlip.addEventListener('click', () => {
  chrome.storage.sync.get("flipKnights", ({ flipKnights }) => {
    let newFlipKnights = !flipKnights;
    chrome.storage.sync.set({ flipKnights: newFlipKnights });
    setButtonText(newFlipKnights);
  });
});
