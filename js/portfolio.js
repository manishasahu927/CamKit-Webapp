(function() {
  'use strict';

  const SHOOTS = [
    {
      id: 'box-1',
      box: 'BOX-1',
      title: 'Model Shoot',
      label: 'model shoot',
      images: [
        '662498777_18454678351128658_453336494202176049_n..jpg',
        '655499206_18081791675368163_960352428651247976_n..jpg',
        '650220951_17934911988037593_3342181569541373892_n..jpg',
        '650605335_17941741581148983_7571216080154770792_n..jpg',
        '627544485_18206855461319304_7710843968448175211_n..jpg',
        '628321535_18133836643448253_5308302712400279005_n..jpg',
        '623505998_18315311491301581_5177751244457562321_n..jpg',
        '624560206_17992738799747533_770816414781533885_n..jpg'
      ]
    },
    {
      id: 'box-2',
      box: 'BOX-2',
      title: 'Baby Photoshoot',
      label: 'baby photoshoot',
      images: [
        '540754226_17944301943020313_7883384222884340788_n..jpg',
        '540430852_17944490286020313_6433648317974331648_n..jpg',
        '541124555_17944301835020313_2522248832822107071_n..jpg',
        '542270248_17944395111020313_5146413645117982427_n..jpg',
        '542302386_17944394598020313_3360252565197884789_n..jpg',
        '542752600_17944490244020313_6626818895185901191_n..jpg'
      ]
    },
    {
      id: 'box-3',
      box: 'BOX-3',
      title: 'Studio Fashion',
      label: 'model shoot',
      images: [
        '625834542_18111597577639928_8435158021094618367_n..jpg',
        '623293830_18076321007367494_1123491731995571553_n..jpg',
        '621590197_17934390513018250_8790083107911968214_n..jpg'
      ]
    },
    {
      id: 'box-4',
      box: 'BOX-4',
      title: 'DJ Photoshoot',
      label: 'dj photoshoot',
      images: [
        '649225793_17897850102405505_2098036035425219976_n..jpg',
        '651149816_17917271388296378_4990654444341097869_n..jpg',
        '651587527_17965916358031639_8166736359068394730_n..jpg',
        '657178270_18076855421125034_5163752608158645280_n..jpg',
        '628345016_18404994052134766_9076635296754269030_n..jpg'
      ]
    },
    {
      id: 'box-5',
      box: 'BOX-5',
      title: 'Couple Shoot',
      label: 'couple shoot',
      images: [
        '544048982_17945371617020313_8305139332429585789_n..jpg',
        '543820404_17945371677020313_4977652254102163323_n..jpg',
        '542293560_17945371626020313_2752957835728830520_n..jpg',
        '542256844_17945371548020313_324131553605255094_n..jpg'
      ]
    },
    {
      id: 'box-6',
      box: 'BOX-6',
      title: 'Jewelery Shoot',
      label: 'jewelery shoot',
      images: [
        '580805550_17952093981020313_3529413482698183096_n..jpg',
        '576507758_17951942514020313_6682076816337405206_n..jpg',
        '580109252_17952092529020313_6312474144996008319_n..jpg',
        '580478447_17952093906020313_8019818176731872437_n..jpg',
        '580490698_17952093609020313_6076408210587854631_n..jpg',
        '580836828_17952093915020313_3676832241936089502_n..jpg',
        '581335892_17952093711020313_7064274980342480280_n..jpg',
        '581554848_17952093627020313_2126482088452674972_n..jpg',
        '582080430_17952094146020313_3591953710644109590_n..jpg'
      ]
    }
  ];

  let currentShoot = null;
  let currentIndex = 0;

  function imgUrl(box, filename) {
    return 'assets/portfolio/' + encodeURIComponent(box) + '/' + encodeURIComponent(filename);
  }

  function renderGrid() {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;
    grid.innerHTML = SHOOTS.map((shoot) => `
      <figure class="portfolio__item-wrap portfolio__shoot-card" data-shoot-id="${shoot.id}" tabindex="0" role="button" aria-label="View ${shoot.title} (${shoot.images.length} photos)">
        <img src="${imgUrl(shoot.box, shoot.images[0])}" alt="${shoot.title}" class="portfolio__item" loading="lazy">
        <figcaption class="portfolio__caption">${shoot.label}</figcaption>
      </figure>
    `).join('');

    grid.querySelectorAll('.portfolio__shoot-card').forEach(card => {
      card.addEventListener('click', () => openLightbox(card.dataset.shootId));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(card.dataset.shootId);
        }
      });
    });
  }

  function buildStrip() {
    if (!currentShoot) return;
    const strip = document.getElementById('lbStrip');
    if (!strip) return;
    strip.innerHTML = currentShoot.images.map((src, i) => `
      <div class="portfolio-lightbox__slide" data-index="${i}">
        <img src="${imgUrl(currentShoot.box, src)}" alt="${currentShoot.title} photo ${i + 1}" loading="lazy">
      </div>
    `).join('');
    strip.querySelectorAll('.portfolio-lightbox__slide').forEach(slide => {
      slide.addEventListener('click', () => {
        const idx = parseInt(slide.dataset.index, 10);
        if (idx === currentIndex) return;
        goTo(idx);
      });
    });
  }

  function updateStrip() {
    const strip = document.getElementById('lbStrip');
    if (!strip || !currentShoot) return;
    strip.querySelectorAll('.portfolio-lightbox__slide').forEach((slide, i) => {
      slide.classList.toggle('is-active', i === currentIndex);
      slide.classList.toggle('is-prev', i === currentIndex - 1);
      slide.classList.toggle('is-next', i === currentIndex + 1);
    });
    const slide = strip.querySelector('.portfolio-lightbox__slide.is-active');
    if (slide) {
      const stage = strip.parentElement;
      const stageCenter = stage.offsetWidth / 2;
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const offset = stageCenter - slideCenter;
      strip.style.transform = `translateX(${offset}px)`;
    }
    document.getElementById('lbShoot').textContent = currentShoot.label;
    document.getElementById('lbCounter').textContent = (currentIndex + 1) + ' / ' + currentShoot.images.length;
  }

  function openLightbox(shootId, startIndex) {
    const shoot = SHOOTS.find(s => s.id === shootId);
    if (!shoot) return;
    currentShoot = shoot;
    currentIndex = startIndex || 0;
    const lb = document.getElementById('portfolioLightbox');
    if (!lb) return;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    buildStrip();
    requestAnimationFrame(() => requestAnimationFrame(updateStrip));
  }

  function closeLightbox() {
    const lb = document.getElementById('portfolioLightbox');
    if (!lb) return;
    lb.hidden = true;
    document.body.style.overflow = '';
    currentShoot = null;
  }

  function goTo(idx) {
    if (!currentShoot) return;
    const total = currentShoot.images.length;
    currentIndex = ((idx % total) + total) % total;
    updateStrip();
  }

  function next() { if (currentShoot) goTo(currentIndex + 1); }
  function prev() { if (currentShoot) goTo(currentIndex - 1); }

  function bindLightbox() {
    const lb = document.getElementById('portfolioLightbox');
    if (!lb) return;
    lb.querySelectorAll('[data-lb-close]').forEach(el => el.addEventListener('click', closeLightbox));
    const prevBtn = lb.querySelector('[data-lb-prev]');
    const nextBtn = lb.querySelector('[data-lb-next]');
    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);

    document.addEventListener('keydown', (e) => {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    });

    let touchStartX = 0;
    let dragging = false;
    let dragStartX = 0;
    const stage = document.getElementById('lbStage');
    if (stage) {
      stage.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
      stage.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
      }, { passive: true });
      stage.addEventListener('mousedown', (e) => { dragging = true; dragStartX = e.clientX; });
      window.addEventListener('mouseup', (e) => {
        if (!dragging) return;
        const dx = e.clientX - dragStartX;
        if (Math.abs(dx) > 60) { dx < 0 ? next() : prev(); }
        dragging = false;
      });
      stage.addEventListener('wheel', (e) => {
        e.preventDefault();
        const dx = e.deltaX !== 0 ? e.deltaX : e.deltaY;
        if (dx > 8) next();
        else if (dx < -8) prev();
      }, { passive: false });
    }

    window.addEventListener('resize', () => {
      if (!lb.hidden) updateStrip();
    });
  }

  function init() {
    renderGrid();
    bindLightbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
