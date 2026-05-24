(function() {
  'use strict';

  const STORAGE_KEY = 'camkit_cart';
  const BOOKING_KEY = 'camkit_booking';
  const DATES_KEY = 'camkit_dates';

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

  function init() {
    const cart = loadCart();
    const dates = loadDates();
    const days = calculateDays(dates);

    document.getElementById('cartCount').textContent = cart.length;
    document.getElementById('totalProducts').textContent = cart.length;
    document.getElementById('totalDays').textContent = days;

    const cartList = document.getElementById('bookingCartItems');
    if (cart.length === 0) {
      cartList.innerHTML = '<div class="cart-empty">no items in cart. <a href="index.html" style="color:var(--color-orange);">add some gear</a></div>';
    } else {
      cartList.innerHTML = cart.map(item => `
        <div class="cart-item">
          <span class="cart-item__name">${item.name}</span>
          <span class="cart-item__days">${days} day${days > 1 ? 's' : ''}</span>
        </div>
      `).join('');
    }

    bindEvents(cart);
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

  function bindEvents(cart) {
    const form = document.getElementById('bookingForm');

    document.querySelectorAll('input[name="fulfilment"]').forEach(input => {
      input.addEventListener('change', () => {
        document.querySelectorAll('.fulfilment-option').forEach(opt => opt.classList.remove('fulfilment-option--active'));
        input.closest('.fulfilment-option')?.classList.add('fulfilment-option--active');
        updateStepper();
      });
    });

    ['fullName', 'phone'].forEach(id => {
      const el = document.getElementById(id);
      el?.addEventListener('input', updateStepper);
    });
    document.getElementById('govtIdCheck')?.addEventListener('change', updateStepper);
    document.querySelectorAll('input[name="payment"]').forEach(input => {
      input.addEventListener('change', updateStepper);
    });

    updateStepper();

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (cart.length === 0) {
        alert('your cart is empty. please add some gear first.');
        window.location.href = 'index.html';
        return;
      }

      if (!document.getElementById('govtIdCheck').checked) {
        alert('please confirm the government id requirement.');
        return;
      }

      const fulfilmentInput = form.querySelector('input[name="fulfilment"]:checked');
      const data = {
        fullName: form.fullName.value.trim(),
        phone: form.phone.value.trim(),
        payment: form.payment.value,
        delivery: fulfilmentInput ? (fulfilmentInput.value === 'pickup' ? 'self-pickup' : 'local-delivery') : 'self-pickup'
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
