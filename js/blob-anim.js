(function() {
  'use strict';

  const SELECTORS = '.package-card, .chip-group--dark .chip, .category-tab';
  const NUM_BLOBS = 4;

  function addBlobs(btn) {
    if (btn.dataset.blobInit === '1') return;
    btn.dataset.blobInit = '1';
    btn.classList.add('blob-btn');

    const inner = document.createElement('span');
    inner.className = 'blob-btn__inner';
    inner.setAttribute('aria-hidden', 'true');

    const blobs = document.createElement('span');
    blobs.className = 'blob-btn__blobs';

    for (let i = 0; i < NUM_BLOBS; i++) {
      const b = document.createElement('span');
      b.className = 'blob-btn__blob';
      blobs.appendChild(b);
    }

    inner.appendChild(blobs);
    btn.appendChild(inner);
  }

  function initAll() {
    document.querySelectorAll(SELECTORS).forEach(addBlobs);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  const observer = new MutationObserver(() => initAll());
  observer.observe(document.body, { childList: true, subtree: true });
})();
