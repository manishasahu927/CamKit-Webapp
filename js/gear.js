(function() {
  'use strict';

  const STORAGE_KEY = 'camkit_cart';
  let cart = [];
  let currentCategory = 'all';

  function loadCart() {
    try { cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (e) { cart = []; }
  }

  function saveCart() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (e) {}
  }

  function init() {
    loadCart();
    document.getElementById('cartCount').textContent = cart.length;
    renderProducts();

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
