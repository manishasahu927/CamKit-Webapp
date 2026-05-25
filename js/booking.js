(function() {
  'use strict';

  const STORAGE_KEY = 'camkit_cart';
  const BOOKING_KEY = 'camkit_booking';
  const DATES_KEY = 'camkit_dates';

  let toastContainer = null;
  function ensureToastContainer() {
    if (toastContainer && document.body.contains(toastContainer)) return toastContainer;
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
    return toastContainer;
  }

  function showToast(message, type) {
    const container = ensureToastContainer();
    const toast = document.createElement('div');
    toast.className = 'toast' + (type ? ' toast--' + type : '');
    const iconSvg = type === 'success'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 12 10 17 19 7"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="7" x2="12" y2="13"/><circle cx="12" cy="17" r="0.6" fill="currentColor"/></svg>';
    toast.innerHTML = '<span class="toast__icon">' + iconSvg + '</span><span class="toast__message"></span>';
    toast.querySelector('.toast__message').textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  function setInvalid(input, invalid) {
    if (!input) return;
    input.classList.toggle('is-invalid', !!invalid);
  }

  function loadCart() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (e) { return []; }
  }

  function loadDates() {
    try { return JSON.parse(localStorage.getItem(DATES_KEY)) || {}; }
    catch (e) { return {}; }
  }

  function calculateDays(dates) {
    if (!dates.pickup || !dates.dropoff) return 1;
    const p = new Date(dates.pickup);
    const d = new Date(dates.dropoff);
    return Math.max(1, Math.ceil((d - p) / 86400000));
  }

  let cartState = [];

  function saveCart() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cartState)); } catch (e) {}
  }

  function renderBookingCart() {
    const dates = loadDates();
    const days = calculateDays(dates);
    const cartList = document.getElementById('bookingCartItems');
    const cartCountEl = document.getElementById('cartCount');
    const totalProductsEl = document.getElementById('totalProducts');
    const totalDaysEl = document.getElementById('totalDays');

    if (cartCountEl) cartCountEl.textContent = cartState.length;
    if (totalProductsEl) totalProductsEl.textContent = cartState.length;
    if (totalDaysEl) totalDaysEl.textContent = days;

    if (!cartList) return;

    if (cartState.length === 0) {
      cartList.innerHTML = '<div class="cart-empty">no items in cart. <a href="index.html" style="color:var(--color-orange);">add some gear</a></div>';
      return;
    }

    const isLastOne = cartState.length === 1;
    cartList.innerHTML = cartState.map((item, idx) => `
      <div class="cart-item">
        <span class="cart-item__name">${item.name}</span>
        <span class="cart-item__days">${days} day${days > 1 ? 's' : ''}</span>
        <button class="cart-item__remove" data-idx="${idx}" aria-label="Remove ${item.name}"${isLastOne ? ' disabled title="at least 1 item is required for booking"' : ''}>
          <img src="assets/icons/Cancel.svg" alt="">
        </button>
      </div>
    `).join('');

    cartList.querySelectorAll('.cart-item__remove').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        const idx = parseInt(btn.dataset.idx, 10);
        if (Number.isNaN(idx)) return;
        cartState.splice(idx, 1);
        saveCart();
        renderBookingCart();
      });
    });
  }

  function init() {
    cartState = loadCart();
    renderBookingCart();
    bindEvents();
  }

  function updateStepper() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    const step1 = !!form.querySelector('input[name="fulfilment"]:checked');
    const nameValid = form.fullName && form.fullName.value.trim().length > 0;
    const phoneValid = form.phone && form.phone.value.trim().length > 0;
    const govtIdChecked = document.getElementById('govtIdCheck')?.checked;
    const step2 = step1 && nameValid && phoneValid && govtIdChecked;
    const step3 = step2 && !!form.querySelector('input[name="payment"]:checked');

    const stepDone = [step1, step2, step3];

    const steps = document.querySelectorAll('.stepper-v2__step');
    const lines = document.querySelectorAll('.stepper-v2__line');
    let firstIncomplete = -1;

    steps.forEach((s, i) => {
      s.classList.remove('stepper-v2__step--done', 'stepper-v2__step--active');
      if (stepDone[i]) {
        s.classList.add('stepper-v2__step--done');
      } else if (firstIncomplete === -1) {
        firstIncomplete = i;
        s.classList.add('stepper-v2__step--active');
      }
    });

    lines.forEach((l, i) => {
      l.classList.toggle('stepper-v2__line--done', stepDone[i]);
    });
  }

  function bindEvents() {
    const form = document.getElementById('bookingForm');

    document.querySelectorAll('input[name="fulfilment"]').forEach(input => {
      input.addEventListener('change', () => {
        document.querySelectorAll('.fulfilment-option').forEach(opt => opt.classList.remove('fulfilment-option--active'));
        input.closest('.fulfilment-option')?.classList.add('fulfilment-option--active');
        updateStepper();
      });
    });

    const nameEl = document.getElementById('fullName');
    const phoneEl = document.getElementById('phone');

    nameEl?.addEventListener('input', () => {
      setInvalid(nameEl, false);
      updateStepper();
    });

    phoneEl?.addEventListener('input', () => {
      const digitsOnly = phoneEl.value.replace(/\D/g, '').slice(0, 10);
      if (phoneEl.value !== digitsOnly) phoneEl.value = digitsOnly;
      setInvalid(phoneEl, false);
      updateStepper();
    });

    phoneEl?.setAttribute('inputmode', 'numeric');
    phoneEl?.setAttribute('maxlength', '10');
    phoneEl?.setAttribute('pattern', '[0-9]{10}');

    form.setAttribute('novalidate', 'novalidate');

    document.getElementById('govtIdCheck')?.addEventListener('change', updateStepper);
    document.querySelectorAll('input[name="payment"]').forEach(input => {
      input.addEventListener('change', updateStepper);
    });

    updateStepper();

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (cartState.length === 0) {
        showToast('your cart is empty. add some gear first.', 'error');
        setTimeout(() => { window.location.href = 'index.html'; }, 1400);
        return;
      }

      const fulfilmentInput = form.querySelector('input[name="fulfilment"]:checked');
      if (!fulfilmentInput) {
        showToast('please choose a fulfilment option.', 'error');
        return;
      }

      const nameVal = nameEl ? nameEl.value.trim() : '';
      const phoneVal = phoneEl ? phoneEl.value.trim() : '';

      if (!nameVal) {
        setInvalid(nameEl, true);
        nameEl?.focus();
        showToast('please enter your full name.', 'error');
        return;
      }

      const letterCount = (nameVal.match(/[A-Za-z]/g) || []).length;
      if (letterCount < 3) {
        setInvalid(nameEl, true);
        nameEl?.focus();
        showToast('name must contain at least 3 letters.', 'error');
        return;
      }

      if (!phoneVal) {
        setInvalid(phoneEl, true);
        phoneEl?.focus();
        showToast('please enter your whatsapp number.', 'error');
        return;
      }

      if (!/^\d{10}$/.test(phoneVal)) {
        setInvalid(phoneEl, true);
        phoneEl?.focus();
        showToast('whatsapp number must be exactly 10 digits, numbers only.', 'error');
        return;
      }

      const govtIdEl = document.getElementById('govtIdCheck');
      if (!govtIdEl || !govtIdEl.checked) {
        showToast('please confirm the government id requirement.', 'error');
        return;
      }

      const paymentInput = form.querySelector('input[name="payment"]:checked');
      if (!paymentInput) {
        showToast('please choose a payment method.', 'error');
        return;
      }

      const data = {
        fullName: nameVal,
        phone: phoneVal,
        payment: paymentInput.value,
        delivery: fulfilmentInput.value === 'pickup' ? 'self-pickup' : 'local-delivery'
      };

      try {
        localStorage.setItem(BOOKING_KEY, JSON.stringify(data));
      } catch (e) {}

      window.location.href = 'confirmation.html';
    });

    setupHeader();
  }

  function setupHeader() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('nav');

    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        mobileMenuBtn.classList.toggle('active');
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });
    }

    window.addEventListener('scroll', () => {
      const header = document.getElementById('header');
      if (window.scrollY > 20) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
