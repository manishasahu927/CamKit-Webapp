(function() {
  'use strict';

  const STORAGE_KEY = 'camkit_cart';
  const DATES_KEY = 'camkit_dates';
  let cart = [];
  let currentCategory = 'all';
  let visibleProductsCount = 8;

  const elements = {
    header: document.getElementById('header'),
    nav: document.getElementById('nav'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    cartCount: document.getElementById('cartCount'),
    cartItems: document.getElementById('cartItems'),
    totalProducts: document.getElementById('totalProducts'),
    totalDays: document.getElementById('totalDays'),
    confirmBookingBtn: document.getElementById('confirmBookingBtn'),
    productsGrid: document.getElementById('productsGrid'),
    viewMoreBtn: document.getElementById('viewMoreBtn'),
    pickupDate: document.getElementById('pickupDate'),
    dropoffDate: document.getElementById('dropoffDate'),
    pickupDisplay: document.getElementById('pickupDateDisplay'),
    dropoffDisplay: document.getElementById('dropoffDateDisplay'),
    duration: document.getElementById('duration'),
    categoryTabs: document.querySelectorAll('.category-tab'),
    heroToggleBtns: document.querySelectorAll('.hero__toggle-btn')
  };

  function init() {
    loadCart();
    initDates();
    saveDates();
    renderProducts();
    bindEvents();
    updateCartUI();
    initHeroAccentAnimation();
    initTestimonialDragScroll();
    handleInitialHash();
    bindNavTabLinks();
    window.addEventListener('hashchange', handleInitialHash);
  }

  function handleInitialHash() {
    const hash = (window.location.hash || '').replace('#', '');
    const targetTab = hash === 'events' ? 'events' : 'rentals';
    const btn = document.querySelector(`.hero__toggle-btn[data-tab="${targetTab}"]`);
    if (btn && !btn.classList.contains('active')) {
      btn.click();
    } else if (btn && targetTab === 'events') {
      switchPanel('events');
    }
  }

  function bindNavTabLinks() {
    document.querySelectorAll('.nav__link[data-label="rentals"], .nav__link[data-label="events"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const label = link.dataset.label;
        const targetBtn = document.querySelector(`.hero__toggle-btn[data-tab="${label}"]`);
        if (!targetBtn) return;
        e.preventDefault();
        if (label === 'events') {
          history.replaceState(null, '', '#events');
        } else {
          history.replaceState(null, '', window.location.pathname);
        }
        if (!targetBtn.classList.contains('active')) targetBtn.click();
        document.querySelector('.hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function switchPanel(tab) {
    const rentalsPanel = document.getElementById('rentalsPanel');
    const eventsPanel = document.getElementById('eventsPanel');
    if (!rentalsPanel || !eventsPanel) return;
    if (tab === 'events') {
      rentalsPanel.classList.add('hidden');
      eventsPanel.classList.remove('hidden');
    } else {
      eventsPanel.classList.add('hidden');
      rentalsPanel.classList.remove('hidden');
    }
  }

  function initEventsPanel() {
    document.querySelectorAll('.chip-group').forEach(group => {
      const isMulti = group.dataset.multi === 'true';
      group.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
          if (isMulti) {
            chip.classList.toggle('chip--active');
          } else {
            group.querySelectorAll('.chip').forEach(c => c.classList.remove('chip--active'));
            chip.classList.add('chip--active');
          }
        });
      });
    });

    document.querySelectorAll('.package-grid').forEach(group => {
      group.querySelectorAll('.package-card').forEach(card => {
        card.addEventListener('click', (e) => {
          e.preventDefault();
          group.querySelectorAll('.package-card').forEach(c => c.classList.remove('package-card--active'));
          card.classList.add('package-card--active');
        });
      });
    });

    const slider = document.getElementById('durationSlider');
    const display = document.getElementById('durationDisplay');
    function fmtDur(v) {
      v = parseInt(v);
      if (v < 24) return `${v} hours`;
      const d = Math.floor(v / 24);
      const h = v % 24;
      return h ? `${d} day${d>1?'s':''} ${h} hours` : `${d} day${d>1?'s':''}`;
    }
    function updateSliderFill() {
      if (!slider) return;
      const min = parseFloat(slider.min) || 0;
      const max = parseFloat(slider.max) || 100;
      const v = parseFloat(slider.value);
      const pct = ((v - min) / (max - min)) * 100;
      slider.style.setProperty('--fill-pct', pct + '%');
    }
    if (slider && display) {
      slider.addEventListener('input', () => {
        display.textContent = fmtDur(slider.value);
        updateSliderFill();
      });
      updateSliderFill();
    }

    const consultBtn = document.getElementById('eventConsultBtn');
    const consultModal = document.getElementById('consultModal');
    const consultForm = document.getElementById('consultForm');

    function openConsultModal() {
      if (!consultModal) return;
      consultModal.hidden = false;
      document.body.style.overflow = 'hidden';
      setTimeout(() => document.getElementById('consultName')?.focus(), 100);
    }

    function closeConsultModal() {
      if (!consultModal) return;
      consultModal.hidden = true;
      document.body.style.overflow = '';
    }

    if (consultModal) {
      consultModal.querySelectorAll('[data-close]').forEach(el => {
        el.addEventListener('click', closeConsultModal);
      });
      document.addEventListener('keydown', (e) => {
        if (!consultModal.hidden && e.key === 'Escape') closeConsultModal();
      });
    }

    if (consultForm) {
      consultForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('consultName').value.trim();
        const phone = document.getElementById('consultPhone').value.trim();
        if (!name || !phone) return;
        const packageType = document.querySelector('.package-card--active .package-card__title')?.textContent.trim() || '';
        const duration = slider ? slider.value : '6';
        const addonsList = Array.from(document.querySelectorAll('[data-group="addons"] .chip--active'))
          .map((c, idx) => `${idx + 1}. ${c.textContent.trim().replace(/\b\w/g, ch => ch.toUpperCase())}`)
          .join('%0A');
        const location = (document.querySelector('[data-group="location"] .chip--active')?.textContent.trim() || '').replace(/\b\w/g, ch => ch.toUpperCase());

        let msg = `*New Event Booking — CamKit Events*%0A`;
        msg += `━━━━━━━━━━━━━━━%0A%0A`;
        msg += `🎬 *OPTION*%0A${packageType}%0A%0A`;
        msg += `⏱️ *EVENT DURATION*%0A${fmtDur(duration)}%0A%0A`;
        msg += `➕ *ADD-ONS*%0A${addonsList || 'none'}%0A%0A`;
        msg += `📍 *LOCATION*%0A${location || 'N/A'}%0A%0A`;
        msg += `🆔 *CUSTOMER DETAILS*%0A`;
        msg += `Name: ${name}%0A`;
        msg += `WhatsApp: +91 ${phone}%0A%0A`;
        msg += `_Sent via CamKit Events checkout._`;

        window.open(`https://wa.me/918296075277?text=${msg}`, '_blank');
        closeConsultModal();
      });
    }

    if (consultBtn) {
      consultBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openConsultModal();
        return;
      });
    }
  }

  function initTestimonialDragScroll() {
    const grid = document.querySelector('.testimonials__grid');
    if (!grid) return;

    let isDown = false, startX, scrollLeft;

    grid.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - grid.offsetLeft;
      scrollLeft = grid.scrollLeft;
    });
    grid.addEventListener('mouseleave', () => { isDown = false; });
    grid.addEventListener('mouseup', () => { isDown = false; });
    grid.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - grid.offsetLeft;
      const walk = (x - startX) * 1.5;
      grid.scrollLeft = scrollLeft - walk;
    });
  }

  function initHeroAccentAnimation() {
    const el = document.getElementById('heroAccent');
    if (!el) return;
    const words = (el.dataset.words || '').split(',').map(w => w.trim()).filter(Boolean);
    if (words.length < 2) return;

    let idx = 0;
    setInterval(() => {
      idx = (idx + 1) % words.length;
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
      setTimeout(() => {
        el.textContent = words[idx];
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 300);
    }, 2500);
  }

  function bindEvents() {
    window.addEventListener('scroll', handleScroll, { passive: true });

    if (elements.mobileMenuBtn) {
      elements.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    if (elements.nav) {
      elements.nav.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
      });
    }

    if (elements.pickupDate) {
      elements.pickupDate.addEventListener('change', handleDateChange);
    }
    if (elements.dropoffDate) {
      elements.dropoffDate.addEventListener('change', handleDateChange);
    }


    const cartModal = document.getElementById('cartModal');
    const cartToggle = document.getElementById('cartToggle');
    function openCartModal() {
      if (!cartModal) return;
      cartModal.hidden = false;
      document.body.style.overflow = 'hidden';
    }
    function closeCartModal() {
      if (!cartModal) return;
      cartModal.hidden = true;
      document.body.style.overflow = '';
    }
    if (cartToggle && cartModal) {
      cartToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const isDesktop = window.matchMedia('(min-width: 768px)').matches;
        const sidebar = document.getElementById('cartSidebar');
        const rentalsPanel = document.getElementById('rentalsPanel');
        const rentalsActive = rentalsPanel && !rentalsPanel.classList.contains('hidden');
        if (isDesktop && sidebar && rentalsActive) {
          const rentalsToggle = document.querySelector('.hero__toggle-btn[data-tab="rentals"]');
          if (rentalsToggle && !rentalsToggle.classList.contains('active')) rentalsToggle.click();
          sidebar.scrollIntoView({ behavior: 'smooth', block: 'center' });
          sidebar.classList.add('cart-sidebar--flash');
          setTimeout(() => sidebar.classList.remove('cart-sidebar--flash'), 1500);
        } else {
          openCartModal();
        }
      });
      cartModal.querySelectorAll('[data-close]').forEach(el => {
        el.addEventListener('click', closeCartModal);
      });
      document.addEventListener('keydown', (e) => {
        if (!cartModal.hidden && e.key === 'Escape') closeCartModal();
      });
    }
    const confirmBookingBtnModal = document.getElementById('confirmBookingBtnModal');
    if (confirmBookingBtnModal) {
      confirmBookingBtnModal.addEventListener('click', () => {
        if (cart.length === 0) return;
        saveDates();
        window.location.href = 'booking.html';
      });
    }

    elements.categoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        elements.categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentCategory = tab.dataset.category;
        visibleProductsCount = 8;
        renderProducts();
      });
    });

    function syncNavActive(tab) {
      document.querySelectorAll('.nav__link').forEach(link => {
        const label = link.dataset.label;
        if (label === 'rentals' || label === 'events') {
          link.classList.toggle('active', label === tab);
        }
      });
    }

    elements.heroToggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        elements.heroToggleBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const toggle = btn.closest('.hero__toggle');
        if (toggle) toggle.dataset.active = btn.dataset.tab;

        const tab = btn.dataset.tab;
        syncNavActive(tab);
        const rentalsPanel = document.getElementById('rentalsPanel');
        const eventsPanel = document.getElementById('eventsPanel');
        if (rentalsPanel && eventsPanel) {
          if (tab === 'events') {
            rentalsPanel.classList.add('hidden');
            eventsPanel.classList.remove('hidden');
          } else {
            eventsPanel.classList.add('hidden');
            rentalsPanel.classList.remove('hidden');
          }
        }
      });
    });

    initEventsPanel();


    if (elements.confirmBookingBtn) {
      elements.confirmBookingBtn.addEventListener('click', handleBooking);
    }
  }

  function handleScroll() {
    if (window.scrollY > 20) {
      elements.header.classList.add('scrolled');
    } else {
      elements.header.classList.remove('scrolled');
    }
  }

  function toggleMobileMenu() {
    const isOpen = elements.nav.classList.toggle('open');
    elements.mobileMenuBtn.classList.toggle('active');
    elements.mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMobileMenu() {
    elements.nav.classList.remove('open');
    elements.mobileMenuBtn.classList.remove('active');
    elements.mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function initDates() {
    if (!elements.pickupDate || !elements.dropoffDate) return;

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    elements.pickupDate.value = formatDateInput(today);
    elements.dropoffDate.value = formatDateInput(tomorrow);
    elements.pickupDate.min = formatDateInput(today);
    elements.dropoffDate.min = formatDateInput(tomorrow);

    updateDateDisplay();
  }

  function formatDateInput(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function formatDateDisplay(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  }

  function handleDateChange() {
    const pickup = new Date(elements.pickupDate.value);
    const dropoff = new Date(elements.dropoffDate.value);

    if (dropoff <= pickup) {
      const newDropoff = new Date(pickup);
      newDropoff.setDate(pickup.getDate() + 1);
      elements.dropoffDate.value = formatDateInput(newDropoff);
    }
    elements.dropoffDate.min = formatDateInput(new Date(pickup.getTime() + 86400000));

    saveDates();
    updateDateDisplay();
    updateCartUI();
  }

  function saveDates() {
    try {
      localStorage.setItem(DATES_KEY, JSON.stringify({
        pickup: elements.pickupDate.value,
        dropoff: elements.dropoffDate.value
      }));
    } catch (e) {}
  }

  function updateDateDisplay() {
    elements.pickupDisplay.textContent = formatDateDisplay(elements.pickupDate.value);
    elements.dropoffDisplay.textContent = formatDateDisplay(elements.dropoffDate.value);

    const days = calculateDays();
    elements.duration.textContent = days;
  }

  function calculateDays() {
    if (!elements.pickupDate || !elements.dropoffDate) return 1;
    const pickup = new Date(elements.pickupDate.value);
    const dropoff = new Date(elements.dropoffDate.value);
    const diff = Math.ceil((dropoff - pickup) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff);
  }

  function renderProducts() {
    if (!elements.productsGrid) return;

    const filtered = currentCategory === 'all'
      ? PRODUCTS
      : PRODUCTS.filter(p => p.category === currentCategory);

    const visible = filtered.slice(0, visibleProductsCount);

    elements.productsGrid.innerHTML = visible.map((product, index) => createProductCard(product, index === 0)).join('');

    elements.productsGrid.querySelectorAll('.product-card__add').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.dataset.id;
        addToCart(id);
      });
    });

    elements.productsGrid.querySelectorAll('.product-card__details').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openProductModal(link.dataset.id);
      });
    });
  }

  function openProductModal(id) {
    const product = PRODUCTS.find(p => p.id === id);
    const modal = document.getElementById('productModal');
    if (!product || !modal) return;
    document.getElementById('pmTitle').textContent = product.name;
    document.getElementById('pmCategory').textContent = product.category;
    document.getElementById('pmBadge').textContent = product.badge;
    document.getElementById('pmDesc').textContent = product.description || '';
    document.getElementById('pmPrice').textContent = product.price;
    const img = document.getElementById('pmImage');
    img.src = product.image;
    img.alt = product.name;
    const specsEl = document.getElementById('pmSpecs');
    specsEl.innerHTML = (product.specs || []).map(s => `<span>${s}</span>`).join('');
    const addBtn = document.getElementById('pmAddBtn');
    addBtn.onclick = () => { addToCart(id); closeProductModal(); };
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  (function bindProductModalClose() {
    const modal = document.getElementById('productModal');
    if (!modal) return;
    modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeProductModal));
    document.addEventListener('keydown', (e) => {
      if (!modal.hidden && e.key === 'Escape') closeProductModal();
    });
  })();

  function createProductCard(product, isFeatured) {
    const inCart = cart.some(item => item.id === product.id);
    return `
      <article class="product-card${isFeatured ? ' product-card--featured' : ''}">
        <span class="product-card__badge">${product.badge}</span>
        <div class="product-card__image-wrap">
          <img src="${product.image}" alt="${product.name}" class="product-card__image" loading="lazy" onerror="this.style.opacity='0.3'">
          <button class="product-card__add ${inCart ? 'added' : ''}" data-id="${product.id}" aria-label="${inCart ? 'Remove from cart' : 'Add to cart'}">
            <img src="assets/icons/${inCart ? 'Check mark.svg' : 'Add.svg'}" alt="">
          </button>
        </div>
        <div class="product-card__info">
          <div>
            <h3 class="product-card__name">${product.name}</h3>
            <p class="product-card__price">${product.price} / day</p>
          </div>
          <a href="#" class="product-card__details" data-id="${product.id}">details <img src="assets/icons/Arrow.svg" alt="" class="product-card__details-icon"></a>
        </div>
      </article>
    `;
  }

  function loadCart() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      cart = stored ? JSON.parse(stored) : [];
    } catch (e) {
      cart = [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {}
  }

  function addToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = cart.findIndex(item => item.id === productId);
    if (existingIndex !== -1) {
      cart.splice(existingIndex, 1);
    } else {
      cart.push({ id: product.id, name: product.name });
    }

    saveCart();
    updateCartUI();
    renderProducts();
  }

  function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    renderProducts();
  }

  function updateCartUI() {
    if (elements.cartCount) {
      elements.cartCount.textContent = cart.length;
    }

    const days = calculateDays();
    if (elements.totalProducts) {
      elements.totalProducts.textContent = cart.length;
    }
    if (elements.totalDays) {
      elements.totalDays.textContent = days;
    }
    const totalProductsModal = document.getElementById('totalProductsModal');
    const totalDaysModal = document.getElementById('totalDaysModal');
    if (totalProductsModal) totalProductsModal.textContent = cart.length;
    if (totalDaysModal) totalDaysModal.textContent = days;

    const cartItemsHtml = cart.length === 0
      ? '<div class="cart-empty">Your cart is empty</div>'
      : cart.map(item => `
          <div class="cart-item">
            <span class="cart-item__name">${item.name}</span>
            <span class="cart-item__days">${days} day${days > 1 ? 's' : ''}</span>
            <button class="cart-item__remove" data-id="${item.id}" aria-label="Remove">
              <img src="assets/icons/Cancel.svg" alt="">
            </button>
          </div>
        `).join('');

    [elements.cartItems, document.getElementById('cartItemsModal')].forEach(container => {
      if (!container) return;
      container.innerHTML = cartItemsHtml;
      container.querySelectorAll('.cart-item__remove').forEach(btn => {
        btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
      });
    });

    [elements.confirmBookingBtn, document.getElementById('confirmBookingBtnModal')].forEach(btn => {
      if (btn) btn.disabled = cart.length === 0;
    });
  }

  function handleBooking() {
    if (cart.length === 0) return;
    saveDates();
    window.location.href = 'booking.html';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
