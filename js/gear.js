(function() {
  'use strict';

  const STORAGE_KEY = 'camkit_cart';
  const DATES_KEY = 'camkit_dates';
  let cart = [];
  let currentCategory = 'all';

  function loadCart() {
    try { cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (e) { cart = []; }
  }

  function saveCart() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (e) {}
  }

  function getDays() {
    try {
      const dates = JSON.parse(localStorage.getItem(DATES_KEY));
      if (!dates || !dates.pickup || !dates.dropoff) return 1;
      const pickup = new Date(dates.pickup);
      const dropoff = new Date(dates.dropoff);
      const diff = Math.ceil((dropoff - pickup) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 1;
    } catch (e) { return 1; }
  }

  function init() {
    loadCart();
    document.getElementById('cartCount').textContent = cart.length;
    renderProducts();
    renderCart();

    document.querySelectorAll('.category-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentCategory = tab.dataset.category;
        renderProducts();
      });
    });

    setupHeader();
    bindProductModalClose();

    const confirmBtn = document.getElementById('confirmBookingBtn');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        if (cart.length === 0) return;
        window.location.href = 'booking.html';
      });
    }
  }

  function renderCart() {
    const days = getDays();
    const cartItems = document.getElementById('cartItems');
    const totalProductsEl = document.getElementById('totalProducts');
    const totalDaysEl = document.getElementById('totalDays');
    const confirmBtn = document.getElementById('confirmBookingBtn');

    if (totalProductsEl) totalProductsEl.textContent = cart.length;
    if (totalDaysEl) totalDaysEl.textContent = days;

    if (cartItems) {
      cartItems.innerHTML = cart.length === 0
        ? '<div class="cart-empty">Your cart is empty</div>'
        : cart.map(item => `
            <div class="cart-item">
              <span class="cart-item__name">${item.name}</span>
              <span class="cart-item__days">${days} day${days > 1 ? 's' : ''}</span>
              <button class="cart-item__remove" data-id="${item.id}" aria-label="Remove">
                <img src="assets/icons/Close.svg" alt="">
              </button>
            </div>
          `).join('');
      cartItems.querySelectorAll('.cart-item__remove').forEach(btn => {
        btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
      });
    }

    if (confirmBtn) confirmBtn.disabled = cart.length === 0;
  }

  function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    document.getElementById('cartCount').textContent = cart.length;
    renderProducts();
    renderCart();
  }

  function renderProducts() {
    const grid = document.getElementById('productsGrid');
    const filtered = currentCategory === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === currentCategory);

    grid.innerHTML = filtered.map(p => createProductCard(p)).join('');
    grid.querySelectorAll('.product-card__add').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        addToCart(btn.dataset.id);
      });
    });
    grid.querySelectorAll('.product-card__details').forEach(link => {
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

  function bindProductModalClose() {
    const modal = document.getElementById('productModal');
    if (!modal) return;
    modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeProductModal));
    document.addEventListener('keydown', (e) => {
      if (!modal.hidden && e.key === 'Escape') closeProductModal();
    });
  }

  function createProductCard(product) {
    const inCart = cart.some(item => item.id === product.id);
    return `
      <article class="product-card">
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
            <p class="product-card__price">ask for price / day</p>
          </div>
          <a href="#" class="product-card__details" data-id="${product.id}">details <img src="assets/icons/Arrow.svg" alt="" class="product-card__details-icon"></a>
        </div>
      </article>
    `;
  }

  function addToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    const existingIndex = cart.findIndex(item => item.id === productId);
    if (existingIndex !== -1) cart.splice(existingIndex, 1);
    else cart.push({ id: product.id, name: product.name });
    saveCart();
    document.getElementById('cartCount').textContent = cart.length;
    renderProducts();
    renderCart();
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
