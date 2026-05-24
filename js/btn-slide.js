(function() {
  'use strict';

  const SELECTORS = [
    '.confirm-booking-btn',
    '.view-more-btn',
    '.portfolio__view-more',
    '.cta-v4__btn',
    '.events-card__cta',
    '.add-to-cart-btn',
    '.add-to-cart',
    '.product-card__view-details',
    '.product-card__details',
    '.btn-primary',
    '.btn-secondary',
    '.book-now-btn',
    '.cta-btn',
    '.gear-cta',
    '.testimonial-cta',
    '.legal-cta',
    '.confirmation-btn',
    '.booking-step__btn',
    '.payment-method__btn',
    '.fulfilment-btn',
    '.hero__toggle-btn'
  ].join(',');

  function applySlide(btn) {
    if (btn.dataset.slideInit === '1') return;
    if (btn.tagName !== 'A' && btn.tagName !== 'BUTTON') return;

    const ghost = document.createElement('span');
    ghost.className = 'btn-slide-ghost';
    ghost.setAttribute('aria-hidden', 'true');
    while (btn.firstChild) ghost.appendChild(btn.firstChild);

    const original = ghost.cloneNode(true);
    original.className = 'btn-slide-original';
    original.removeAttribute('aria-hidden');

    const clone = ghost.cloneNode(true);
    clone.className = 'btn-slide-clone';

    btn.appendChild(ghost);
    btn.appendChild(original);
    btn.appendChild(clone);

    btn.classList.add('btn-text-slide');
    btn.dataset.slideInit = '1';
  }

  function initAll() {
    document.querySelectorAll(SELECTORS).forEach(applySlide);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  const observer = new MutationObserver(() => initAll());
  observer.observe(document.body, { childList: true, subtree: true });

  window.applyBtnSlide = initAll;
})();
