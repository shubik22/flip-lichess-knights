const FLIP_TRANSFORM = 'scale(-1, 1)';

const isKnight = (node) => {
  return node.tagName == 'PIECE' && node.classList.contains('knight');
};

const maybeFlipKnight = (knight) => {
  if (knight.style.transform.includes(FLIP_TRANSFORM)) {
    return;
  }
  knight.style.transform += ` ${FLIP_TRANSFORM}`;
};

const maybeUnflipKnight = (knight) => {
  if (!knight.style.transform.includes(FLIP_TRANSFORM)) {
    return;
  }
  const oldTransform = knight.style.transform;
  const newTransform = oldTransform.replace(FLIP_TRANSFORM, '');
  knight.style.transform = newTransform;
};

const handleAddedNodes = (nodeList) => {
  for (const node of nodeList) {
    if (!isKnight(node)) {
      continue;
    }
    maybeFlipKnight(node);
  }
};

const handleAttributeChange = (node) => {
  if (!isKnight(node)) {
    return;
  }
  maybeFlipKnight(node);
};

let mutationObserver;


const listenForKnights = (mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      handleAddedNodes(mutation.addedNodes);
    } else if (mutation.type === 'attributes') {
      handleAttributeChange(mutation.target);
    }
  }
};

const setUpMutationObserver = () => {
  const config = { attributes: true, childList: true, subtree: true };
  mutationObserver = new MutationObserver(listenForKnights);
  mutationObserver.observe(document.body, config); 
};

const destroyMutationObserver = () => {
  if (!mutationObserver) {
    return;
  }
  mutationObserver.disconnect();
  mutationObserver = null;
}

const flipKnightsFn = () => {
  const knights = document.querySelectorAll('piece.knight');
  for (const knight of knights) {
    maybeFlipKnight(knight);
  }
};

const unflipKnights = () => {
  const knights = document.querySelectorAll('piece.knight');
  for (const knight of knights) {
    maybeUnflipKnight(knight);
  }
};

chrome.storage.onChanged.addListener((changes) => {
  for (const key in changes) {
    if (key != 'flipKnights') {
      return;
    }
    const newFlipKnights = changes[key].newValue;
    if (newFlipKnights) {
      flipKnightsFn();
      setUpMutationObserver();
    } else {
      unflipKnights();
      destroyMutationObserver();
    }
  }
});


chrome.storage.sync.get("flipKnights", ({ flipKnights }) => {
  if (flipKnights) {
    flipKnightsFn();
    setUpMutationObserver();
  }
});