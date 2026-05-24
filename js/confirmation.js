(function() {
  'use strict';

  const STORAGE_KEY = 'camkit_cart';
  const BOOKING_KEY = 'camkit_booking';
  const DATES_KEY = 'camkit_dates';

  function loadCart() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (e) { return []; }
  }
  function loadBooking() {
    try { return JSON.parse(localStorage.getItem(BOOKING_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function loadDates() {
    try { return JSON.parse(localStorage.getItem(DATES_KEY)) || {}; }
    catch (e) { return {}; }
  }

  function formatDateDisplay(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date)) return '';
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun',
                    'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  }

  function formatDateLong(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date)) return '';
    const months = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  function calculateDays(dates) {
    if (!dates.pickup || !dates.dropoff) return 1;
    const p = new Date(dates.pickup);
    const d = new Date(dates.dropoff);
    return Math.max(1, Math.ceil((d - p) / 86400000));
  }

  function generateBookingId() {
    const date = new Date();
    const y = date.getFullYear();
    const rand = Math.floor(Math.random() * 90000) + 10000;
    return `CK-${y}-${rand}`;
  }

  function init() {
    const cart = loadCart();
    const booking = loadBooking();
    const dates = loadDates();
    const days = calculateDays(dates);

    document.getElementById('cartCount').textContent = cart.length;

    const firstName = (booking.fullName || '').split(' ')[0] || 'there';
    document.getElementById('customerName').textContent = firstName.toLowerCase();

    document.getElementById('totalProducts').textContent = cart.length;
    document.getElementById('totalDays').textContent = days;
    document.getElementById('summaryDays').textContent = days;

    const summaryPickup = document.getElementById('summaryPickup');
    const summaryDropoff = document.getElementById('summaryDropoff');
    if (summaryPickup) summaryPickup.textContent = formatDateDisplay(dates.pickup) || '21 apr';
    if (summaryDropoff) summaryDropoff.textContent = formatDateDisplay(dates.dropoff) || '22 apr';

    const summaryDelivery = document.getElementById('summaryDelivery');
    if (summaryDelivery) {
      summaryDelivery.textContent = booking.delivery === 'delivery' ? 'home delivery' : 'self-pickup';
    }

    document.getElementById('bookingId').textContent = generateBookingId();

    const cartList = document.getElementById('bookingCartItems');
    if (cart.length === 0) {
      cartList.innerHTML = '<div class="cart-empty">no items</div>';
    } else {
      cartList.innerHTML = cart.map(item => `
        <div class="cart-item">
          <span class="cart-item__name">${item.name}</span>
          <span class="cart-item__days">${days} day${days > 1 ? 's' : ''}</span>
        </div>
      `).join('');
    }

    const sendBtn = document.getElementById('sendWhatsappBtn');
    if (sendBtn) {
      sendBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sendWhatsApp(cart, booking, dates, days);
      });
    }

    const firstItem = document.querySelector('.next-list__item:first-child');
    if (firstItem) {
      firstItem.style.cursor = 'pointer';
      firstItem.addEventListener('click', (e) => {
        e.preventDefault();
        sendWhatsApp(cart, booking, dates, days);
      });
    }

    setupHeader();
  }

  function sendWhatsApp(cart, booking, dates, days) {
    const items = cart.map((i, idx) => `${idx + 1}. ${i.name} × ${days} day${days > 1 ? 's' : ''}`).join('%0A');
    const pickup = formatDateLong(dates.pickup) || '21 April 2026';
    const dropoff = formatDateLong(dates.dropoff) || '22 April 2026';
    const paymentLabel = booking.payment === 'cash' ? 'Cash on Delivery' : 'UPI on Delivery';
    const bookingId = document.getElementById('bookingId')?.textContent || '';
    const isDelivery = booking.delivery === 'local-delivery';
    const fulfilmentText = isDelivery
      ? 'Local Delivery (we will coordinate the address)'
      : 'Self-Pickup (Studio collection)';

    let msg = `*New Rental Booking — CamKit Rentals*%0A`;
    msg += `━━━━━━━━━━━━━━━%0A%0A`;
    msg += `🎬 *GEAR REQUESTED*%0A${items}%0A%0A`;
    msg += `📅 *RENTAL PERIOD*%0A`;
    msg += `Pick-up: ${pickup}%0A`;
    msg += `Return: ${dropoff}%0A`;
    msg += `Duration: ${days} day${days > 1 ? 's' : ''}%0A%0A`;
    msg += `🚚 *FULFILMENT*%0A${fulfilmentText}%0A%0A`;
    msg += `💳 *PAYMENT METHOD*%0A${paymentLabel}%0A%0A`;
    msg += `🆔 *CUSTOMER DETAILS*%0A`;
    msg += `Name: ${booking.fullName || 'N/A'}%0A`;
    msg += `WhatsApp: +91 ${booking.phone || 'N/A'}%0A`;
    msg += `ID Proof: Will bring 2 original Govt. IDs at handover%0A`;
    if (bookingId) msg += `Booking ID: ${bookingId}%0A`;
    msg += `%0A_Sent via CamKit Rentals checkout._`;

    window.open(`https://wa.me/918296075277?text=${msg}`, '_blank');
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
