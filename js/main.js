/* ── Caesarstone Argentina — main.js ── */

/* ── Fallbacks: si data/cs.json no carga, el sitio sigue funcionando con esto ── */
let DEFAULT_CHARS = [
  'Resistente a golpes y rayones',
  'Resistente al calor extremo',
  'No poroso, higiénico y resistente a manchas',
  'Para interior / exterior (resiste rayos UV)',
];

let PRODUCTS = [
  {
    id: 'opal-taj',
    code: '584',
    name: 'Opal Taj',
    collection: 'Supernatural',
    procedencia: 'Importado\n(Caesarstone)',
    finish: 'Honed Finish (mate)\nLuster Effect (brillo)',
    size: '3200 × 1600 mm',
    thickness: '12 mm',
    desc: 'Una base neutra terrosa con vetas en tonos taupé y beige, con remolinos color crema de apariencia plumosa que aportan fluidez y movimiento.',
    img: 'assets/products/opal-taj.webp',
    heroImg: 'assets/products/hero/opal-taj.jpg',
    labelImg: 'assets/products/opal-taj-pdf.jpg',
    caesarUrl: 'https://www.caesarstone.com/design/stones/584-opal-taj/',
    isNew: true,
    tone: 'blanco',
  },
  {
    id: 'fossillia',
    code: '545',
    name: 'Fossillia',
    collection: 'Supernatural',
    procedencia: 'Importado\n(Caesarstone)',
    finish: 'Honed Finish (mate)\nSculpted Effect (Efecto Esculpido)',
    size: '3200 × 1600 mm',
    thickness: '12 mm',
    desc: 'Una suave base de espuma de mar con capas de intrincados remolinos blancos, finas vetas color liquen y sutiles motas granulares.',
    img: 'assets/products/fossillia.jpg',
    heroImg: 'assets/products/hero/fossillia.jpg',
    labelImg: 'assets/products/fossillia-pdf.jpg',
    caesarUrl: 'https://www.caesarstone.com/design/stones/545-fossillia/',
    tone: 'blanco',
  },
  {
    id: 'striata',
    code: '513',
    name: 'Striata',
    collection: 'Supernatural Ultra',
    procedencia: 'Importado\n(Caesarstone)',
    finish: 'Ultra Rough Finish\n(acabado ultra rugoso)',
    size: '3200 × 1600 mm',
    thickness: '12 mm',
    desc: 'Base gris ahumado con una estructura compleja de finas vetas oscuras, manchas de pátina, limo oxidado y rayas blancas calcáreas.',
    img: 'assets/products/striata.jpg',
    heroImg: 'assets/products/hero/striata.jpg',
    labelImg: 'assets/products/striata-pdf.jpg',
    caesarUrl: 'https://www.caesarstone.com/design/stones/513-striata/',
    tone: 'gris',
  },
  {
    id: 'thalassa',
    code: '546',
    name: 'Thalassa',
    collection: 'Supernatural',
    procedencia: 'Importado\n(Caesarstone)',
    finish: 'Stone Finish (acabado piedra)\nSculpted Effect (efecto esculpido)',
    size: '3200 × 1600 mm',
    thickness: '12 mm',
    desc: 'Una cálida base de piedra caliza arenosa con sinuosos remolinos de líneas blancas que evocan antiguos fósiles de conchas marinas, enriquecida con granos minerales en beige oscuro.',
    img: 'assets/products/thalassa.webp',
    heroImg: 'assets/products/hero/thalassa.webp',
    labelImg: 'assets/products/thalassa-pdf.jpg',
    caesarUrl: 'https://www.caesarstone.com/design/stones/546-thalassa/',
    tone: 'color',
  },
  {
    id: 'mosstone',
    code: '542',
    name: 'Mosstone',
    collection: 'Premium',
    procedencia: 'Importado\n(Caesarstone)',
    finish: 'Stone Finish\n(acabado piedra)',
    size: '3200 × 1600 mm',
    thickness: '12 mm',
    desc: 'Una base lechosa moteada con infusiones de color salvia tenue y musgo oscuro. Las zonas más claras se ven realzadas por grandes y animados agregados. Impurezas yodadas y vetas de óxido.',
    img: 'assets/products/mosstone.jpg',
    heroImg: 'assets/products/hero/mosstone.jpg',
    labelImg: 'assets/products/mosstone-pdf.jpg',
    caesarUrl: 'https://www.caesarstone.com/design/stones/542-mosstone/',
    tone: 'color',
  },
  {
    id: 'carrara-ice',
    code: '914',
    name: 'Carrara Ice',
    collection: 'Supernatural',
    procedencia: 'Importado\n(Caesarstone)',
    finish: 'Silk Finish\n(acabado seda)',
    size: '3200 × 1600 mm',
    thickness: '12 mm',
    desc: 'Una superficie blanca con delicadas vetas grises inspirada en el clásico mármol de Carrara.',
    img: 'assets/products/carrara-ice.webp',
    heroImg: 'assets/products/hero/carrara-ice.webp',
    labelImg: 'assets/products/carrara-ice-pdf.jpg',
    caesarUrl: 'https://www.caesarstone.com/design/stones/914-carrara-ice/',
    tone: 'blanco',
  },
  {
    id: 'isobellia',
    code: '508',
    name: 'Isobellia',
    collection: 'Supernatural',
    procedencia: 'Importado\n(Lioli Porcelain\nby Caesarstone)',
    finish: 'Silk Finish\n(acabado seda)',
    size: '3200 × 1600 mm',
    thickness: '12 mm',
    desc: 'Base neutra de color blanquecino, repleta de un animado entrecruzamiento de vetas de gran tamaño y finas líneas craqueladas que presentan una superposición de cobre antiguo.',
    img: 'assets/products/isobellia.jpg',
    heroImg: 'assets/products/hero/isobellia.jpg',
    labelImg: 'assets/products/isobellia-pdf.jpg',
    caesarUrl: 'https://www.caesarstone.com/design/stones/508-isobellia/',
    tone: 'blanco',
  },
  {
    id: 'lithic-coin',
    code: null,
    name: 'Lithic Coin',
    collection: 'Concrete Series',
    procedencia: 'Importado\n(Lioli Porcelain\nby Caesarstone)',
    finish: 'Structure Matt\n(estructura mate)',
    size: '3200 × 1600 mm',
    thickness: '12 mm',
    desc: 'Su tono gris neutro de gran formato. Su estética de cemento con acabado mate rústico ofrece sobriedad y resistencia, ideal para superficies continuas modernas.',
    img: 'assets/products/lithic-coin.jpg',
    labelImg: 'assets/products/lithic-coin-pdf.jpg',
    caesarUrl: 'https://www.caesarstone.com/design/stones/lithic-coin/',
    tone: 'gris',
  },
  {
    id: 'lithic-latte',
    code: null,
    name: 'Lithic Latte',
    collection: 'Premium',
    procedencia: 'Importado\n(Lioli Porcelain\nby Caesarstone)',
    finish: 'Structure Matt\n(estructura mate)',
    size: '3200 × 1600 mm',
    thickness: '12 mm',
    desc: 'Superficie cementicia beige de gran formato. Su tono cálido y acabado mate rústico aportan naturalidad, logrando ambientes contemporáneos con una máxima continuidad visual.',
    img: 'assets/products/lithic-latte.jpg',
    labelImg: 'assets/products/lithic-latte-pdf.jpg',
    caesarUrl: 'https://www.caesarstone.com/design/stones/lithic-latte/',
    tone: 'gris',
  },
  {
    id: 'beige-ciment',
    code: '412',
    name: 'Beige Ciment',
    collection: 'Premium',
    procedencia: 'Importado\n(Caesarstone)',
    finish: 'Ultra Rough Finish\n(acabado ultra rugoso)',
    size: '3200 × 1600 mm',
    thickness: '12 mm',
    desc: 'Un fondo de color beige cremoso que equilibra la presencia textural de las piedras desgastadas.',
    img: 'assets/products/beige-ciment.jpg',
    heroImg: 'assets/products/hero/beige-ciment.jpg',
    labelImg: 'assets/products/beige-ciment-pdf.jpg',
    caesarUrl: 'https://www.caesarstone.com/design/stones/412-beige-ciment/',
    tone: 'gris',
  },
  {
    id: 'calcutta-borghini',
    code: null,
    name: 'Calcutta Borghini',
    collection: 'Bookmatch',
    procedencia: 'Importado\n(Lioli porcelain\nby Caesarstone)',
    finish: 'Rustic Matt\n(mate rústico)',
    size: '3200 × 1600 mm',
    thickness: '12 mm',
    desc: 'Base blanca pura con vetas fluidas en gris y dorado. Diseño clásico de mármol cuyo acabado lustroso realza la profundidad de vetas naturales.',
    img: 'assets/products/calcutta-borghini.jpg',
    labelImg: 'assets/products/calcutta-borghini-pdf.jpg',
    caesarUrl: 'https://www.caesarstone.com/design/stones/calcutta-borghini/',
    chars: ['Resistente a arañazos', 'Resistente al calor extremo', 'No poroso, higiénico y resistente a manchas', 'Para interior / exterior (resiste rayos UV)'],
    tone: 'blanco',
  },
];

/* ── Product filter logic ─────────────────────────────────────────────────── */
function filterProducts(filter) {
  if (filter === 'all')    return PRODUCTS;
  if (filter === 'blanco') return PRODUCTS.filter(p => p.tone === 'blanco');
  if (filter === 'gris')   return PRODUCTS.filter(p => p.tone === 'gris');
  if (filter === 'color')  return PRODUCTS.filter(p => p.tone === 'color');
  return PRODUCTS;
}

/* ── Build stone slides for Swiper ──────────────────────────────────────────── */
let productSwiperInstance = null;

function buildProductSwiper(filter = 'all') {
  const wrapper = document.getElementById('product-swiper-wrapper');
  if (!wrapper) return;

  const items = filterProducts(filter);

  if (!items.length) {
    wrapper.innerHTML = `
      <div class="swiper-slide stone-empty">
        <div class="stone-empty-inner">
          <div class="stone-empty-icon">✦</div>
          <p class="stone-empty-text">No hay modelos con ese filtro.</p>
          <button type="button" class="stone-empty-reset" data-filter="all">Ver todos los modelos</button>
        </div>
      </div>`;
    if (productSwiperInstance) { productSwiperInstance.destroy(true, true); productSwiperInstance = null; }
    wrapper.querySelector('.stone-empty-reset')?.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.toggle('active', t.dataset.filter === 'all'));
      buildProductSwiper('all');
    });
    return;
  }

  wrapper.innerHTML = items.map((p, i) => {
    const lazyAttr = i < 4 ? '' : 'loading="lazy"';
    const badges = [];
    if (p.isNew) badges.push('<span class="badge badge-new">Nuevo</span>');
    badges.push('<span class="badge badge-stock">Stock AR</span>');

    return `
      <div class="swiper-slide stone" data-id="${p.id}" role="button" tabindex="0"
           aria-label="Ver detalles de ${p.name}">
        <div class="stone-top">${badges.join('')}</div>
        <div class="thumb-wrap ratio ratio-stone-vertical">
          <img src="${p.img}" alt="${p.name}" ${lazyAttr}>
          <button type="button" class="stone-zoom" data-id="${p.id}" aria-label="Ampliar imagen de ${p.name}">
            <svg width="16" height="16" aria-hidden="true"><use href="#maximize"/></svg>
          </button>
        </div>
        <div class="stone-bottom">
          ${p.code ? `<span class="stone-code">${p.code}</span>` : ''}
          <button class="stone-title" type="button" data-id="${p.id}">${p.name}</button>
          <div class="stone-terms">
            <div class="material-name">${p.collection}</div>
          </div>
        </div>
      </div>`;
  }).join('');

  /* Destroy previous instance if exists */
  if (productSwiperInstance) {
    productSwiperInstance.destroy(true, true);
    productSwiperInstance = null;
  }

  productSwiperInstance = new Swiper('#product-swiper-container', {
    slidesPerView: 2,
    spaceBetween: 16,
    navigation: {
      nextEl: '#product-swiper-container .swiper-button-next',
      prevEl: '#product-swiper-container .swiper-button-prev',
    },
    breakpoints: {
      480:  { slidesPerView: 2, spaceBetween: 16 },
      640:  { slidesPerView: 3, spaceBetween: 20 },
      900:  { slidesPerView: 4, spaceBetween: 24 },
      1200: { slidesPerView: 5, spaceBetween: 24 },
    },
    grabCursor: true,
    a11y: {
      prevSlideMessage: 'Producto anterior',
      nextSlideMessage: 'Producto siguiente',
    },
  });

  /* Click to open modal */
  wrapper.querySelectorAll('.stone').forEach(slide => {
    slide.addEventListener('click', () => openModal(slide.dataset.id));
    slide.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') openModal(slide.dataset.id);
    });
  });

  /* Zoom button → lightbox (intercept click so modal doesn't open) */
  wrapper.querySelectorAll('.stone-zoom').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openLightbox(btn.dataset.id);
    });
  });

  /* Remove shimmer once each image loads */
  wrapper.querySelectorAll('.thumb-wrap').forEach(wrap => {
    const img = wrap.querySelector('img');
    if (!img) return;
    if (img.complete && img.naturalWidth) {
      wrap.classList.add('is-loaded');
    } else {
      img.addEventListener('load', () => wrap.classList.add('is-loaded'), { once: true });
      img.addEventListener('error', () => wrap.classList.add('is-loaded'), { once: true });
    }
  });
}

/* ── Hero Swiper ─────────────────────────────────────────────────────────────── */
function initHeroSwiper() {
  new Swiper('.hero-swiper', {
    loop: true,
    autoplay: { delay: 11000, disableOnInteraction: false, pauseOnMouseEnter: true },
    speed: 1000,
    effect: 'fade',
    fadeEffect: { crossFade: true },
    pagination: { el: '.hero-swiper .swiper-pagination', clickable: true },
    navigation: {
      nextEl: '.hero-swiper .swiper-button-next',
      prevEl: '.hero-swiper .swiper-button-prev',
    },
    a11y: { prevSlideMessage: 'Slide anterior', nextSlideMessage: 'Slide siguiente' },
  });
}

/* ── Headroom-style header ──────────────────────────────────────────────────── */
function initHeader() {
  const header = document.getElementById('header-wrapper');
  if (!header) return;

  /* Set initial state */
  header.classList.toggle('headroom--not-top', window.scrollY > 30);
  header.classList.add('headroom--pinned');

  let lastScroll = window.scrollY;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const current = window.scrollY;
      header.classList.toggle('headroom--not-top', current > 30);

      if (current > lastScroll && current > 150) {
        header.classList.add('headroom--unpinned');
        header.classList.remove('headroom--pinned');
      } else {
        header.classList.remove('headroom--unpinned');
        header.classList.add('headroom--pinned');
      }

      lastScroll = Math.max(0, current);
      ticking = false;
    });
  }, { passive: true });
}

/* ── Mobile nav toggle ──────────────────────────────────────────────────────── */
function initMobileNav() {
  const toggle  = document.getElementById('mobile-toggle');
  const navWrap = document.getElementById('header-main');
  if (!toggle || !navWrap) return;

  toggle.addEventListener('click', () => {
    const open = navWrap.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    toggle.innerHTML = open
      ? `<svg width="22" height="22"><use href="#x"/></svg>`
      : `<svg width="22" height="22"><use href="#menu"/></svg>`;
  });

  /* Close on nav link click */
  navWrap.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navWrap.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = `<svg width="22" height="22"><use href="#menu"/></svg>`;
    });
  });
}

/* ── Filter tabs ─────────────────────────────────────────────────────────────── */
function initFilterTabs() {
  document.querySelectorAll('.filter-tab').forEach(tab => {
    const f = tab.dataset.filter;
    const n = f === 'all' ? PRODUCTS.length : PRODUCTS.filter(p => p.tone === f).length;
    tab.insertAdjacentHTML('beforeend', ` <span class="filter-tab-count">${n}</span>`);
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      buildProductSwiper(f);
    });
  });
}

/* ── Accordion panels ───────────────────────────────────────────────────────── */
function initAccordion() {
  const panels = document.querySelectorAll('.accordion-panel');
  if (!panels.length) return;

  const activate = (idx) => {
    panels.forEach((p, i) => {
      const active = i === idx;
      p.classList.toggle('active', active);
      p.setAttribute('aria-expanded', active);
      p.tabIndex = active ? 0 : -1;
    });
  };

  panels.forEach((panel, i) => {
    panel.setAttribute('role', 'button');
    panel.setAttribute('aria-expanded', panel.classList.contains('active'));
    panel.tabIndex = panel.classList.contains('active') ? 0 : -1;
    const label = panel.querySelector('.accordion-panel-label')?.textContent;
    if (label) panel.setAttribute('aria-label', label);

    panel.addEventListener('click', () => activate(i));
    panel.addEventListener('keydown', e => {
      let next;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % panels.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + panels.length) % panels.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = panels.length - 1;
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(i); return; }
      else return;
      e.preventDefault();
      activate(next);
      panels[next].focus();
    });
  });
}

/* ── Product modal ───────────────────────────────────────────────────────────── */
function initModal() {
  const overlay = document.getElementById('product-modal');
  if (!overlay) return;

  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (document.getElementById('stone-lightbox')?.classList.contains('open')) return;
    closeModal();
  });
  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('modal-zoom')?.addEventListener('click', () => {
    const id = overlay.dataset.currentId;
    if (id) openLightbox(id);
  });
  overlay.querySelector('.modal-cta')?.addEventListener('click', () => {
    const name = document.getElementById('modal-name-el')?.textContent || '';
    const code = document.getElementById('modal-code-inline')?.textContent || '';
    const subject = document.getElementById('cf-subject');
    const msg = document.getElementById('cf-msg');
    if (subject) subject.value = 'Solicitar muestra';
    if (msg) msg.value = `Hola, me interesa solicitar una muestra de ${name}${code ? ' ' + code : ''}.`;
    closeModal();
  });
}

function openModal(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  const overlay = document.getElementById('product-modal');
  overlay.dataset.currentId = id;

  /* Stone hero — imagen HD landscape (fallback a thumb si no hay) */
  const img = document.getElementById('modal-stone-img');
  img.src = p.heroImg || p.img;
  img.alt = p.name;

  document.getElementById('modal-hero-collection').innerHTML =
    '<span class="modal-hero-collection-label">Colección</span>' +
    '<span class="modal-hero-collection-name">' + p.collection + '</span>';
  document.getElementById('modal-name-el').textContent = p.name;
  document.getElementById('modal-code-inline').textContent = p.code ? '#' + p.code : '';
  document.getElementById('modal-desc').textContent = p.desc;
  document.getElementById('modal-desc-mobile').textContent = p.desc;

  /* Specs panel */
  document.getElementById('modal-procedencia').innerHTML = p.procedencia.replace(/\n/g, '<br>');
  document.getElementById('modal-finish').innerHTML = p.finish.replace(/\n/g, '<br>');

  /* Espesor + dimensiones de plancha (per-producto) */
  const thicknessEl = document.getElementById('modal-thickness');
  if (thicknessEl) thicknessEl.textContent = p.thickness || '12 mm';
  const sizeWEl = document.getElementById('modal-size-w');
  const sizeHEl = document.getElementById('modal-size-h');
  if (sizeWEl) sizeWEl.textContent = p.sizeWidth || '1600mm';
  if (sizeHEl) sizeHEl.textContent = p.sizeHeight || '3200mm';

  /* Características */
  const chars = (Array.isArray(p.chars) && p.chars.length) ? p.chars : DEFAULT_CHARS;
  document.getElementById('modal-chars-list').innerHTML = chars
    .map(c => `<li>${c}</li>`)
    .join('');

  const catalogueUrl = 'https://emea.caesarstone.com/catalogue/?material=porcelain';
  const caesarLink = document.getElementById('modal-caesar-link');
  if (caesarLink) caesarLink.href = catalogueUrl;

  const qrImg = document.getElementById('modal-qr-img');
  if (qrImg) {
    const waText = `Hola Caesarstone Argentina, quiero más información sobre ${p.name}${p.code ? ' (' + p.code + ')' : ''}.`;
    const waUrl = `https://wa.me/5491159311038?text=${encodeURIComponent(waText)}`;
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&color=1a1917&bgcolor=ffffff&data=${encodeURIComponent(waUrl)}`;
    qrImg.alt = `QR para consultar ${p.name} por WhatsApp`;
  }

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('modal-close')?.focus();
}

function closeModal() {
  document.getElementById('product-modal')?.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Lightbox (zoom imagen sin descripción) ─────────────────────────────────── */
function initLightbox() {
  const lb = document.getElementById('stone-lightbox');
  if (!lb) return;
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  document.getElementById('stone-lightbox-close')?.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lb.classList.contains('open')) closeLightbox();
  });
}

function openLightbox(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const lb = document.getElementById('stone-lightbox');
  const img = document.getElementById('stone-lightbox-img');
  const cap = document.getElementById('stone-lightbox-caption');
  img.src = p.heroImg || p.img;
  img.alt = p.name;
  cap.textContent = p.code ? `${p.name} · #${p.code}` : p.name;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('stone-lightbox-close')?.focus();
}

function closeLightbox() {
  document.getElementById('stone-lightbox')?.classList.remove('open');
  const modalOpen = document.getElementById('product-modal')?.classList.contains('open');
  document.body.style.overflow = modalOpen ? 'hidden' : '';
}

/* ── Stat counters ───────────────────────────────────────────────────────────── */
function initStatCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const dur    = 1100;
      const start  = performance.now();

      const tick = now => {
        const t = Math.min((now - start) / dur, 1);
        const v = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(v * target) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ── Reveal animations (GSAP optional, fallback IntersectionObserver) ───────── */
function initReveal() {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    /* Pre-hide via JS (not CSS) so GSAP captures correct "to" values */
    gsap.set('[data-reveal] > *', { opacity: 0, y: 32, immediateRender: true });

    gsap.utils.toArray('[data-reveal]').forEach(group => {
      const children = Array.from(group.children);
      if (!children.length) return;
      gsap.to(children, {
        y: 0, opacity: 1,
        duration: 0.75,
        ease: 'expo.out',
        stagger: 0.07,
        scrollTrigger: {
          trigger: group,
          start: 'top 92%',
          invalidateOnRefresh: true,
        },
      });
    });

    /* Hero title animation */
    const heroTitle = document.querySelector('.title-text');
    if (heroTitle) {
      gsap.from(heroTitle, { y: 30, opacity: 0, duration: 1, ease: 'expo.out', delay: 0.1 });
    }
    gsap.from('.hero-eyebrow-label, .btn-framed', {
      y: 16, opacity: 0, duration: 0.7, ease: 'expo.out', stagger: 0.1, delay: 0.4,
    });

    /* Refresh trigger positions after all images load */
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });

  } else {
    /* Fallback: plain IntersectionObserver */
    document.querySelectorAll('[data-reveal] > *').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(32px)';
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        Array.from(entry.target.children).forEach((child, i) => {
          child.style.transition = `opacity 0.6s ease ${i * 70}ms, transform 0.6s ease ${i * 70}ms`;
          child.style.opacity = '1';
          child.style.transform = 'translateY(0)';
        });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
  }
}

/* ── Contact form ─────────────────────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const btn      = document.getElementById('form-submit-btn');
  const status   = document.getElementById('form-status');
  const fallback = form.dataset.fallbackEmail || 'info@minerafame.com';

  /* Validación en vivo: limpiar error al tipear */
  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => el.classList.remove('is-invalid'));
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    /* Honeypot */
    if (form.elements._gotcha?.value) return;

    /* Validación HTML5 manual para poder mostrar estado visual */
    if (!form.checkValidity()) {
      form.querySelectorAll(':invalid').forEach(el => el.classList.add('is-invalid'));
      status.className = 'form-status error';
      status.innerHTML = `<svg width="16" height="16"><use href="#x"/></svg> Completá los campos obligatorios.`;
      form.querySelector(':invalid')?.focus();
      return;
    }

    const data = new FormData(form);

    btn.classList.add('is-loading');
    btn.disabled = true;
    btn.innerHTML = `<span class="btn-spinner" aria-hidden="true"></span> Enviando…`;
    status.className = 'form-status';
    status.innerHTML = '';

    /* Endpoint no configurado → fallback a mailto inmediato */
    if (form.action.includes('FORMSPREE_ID')) {
      const subject = encodeURIComponent('Consulta — Caesarstone Argentina');
      const body = encodeURIComponent(
        `Nombre: ${data.get('name') || ''}\nEmail: ${data.get('email') || ''}\n` +
        `Teléfono: ${data.get('phone') || ''}\n\nMensaje:\n${data.get('message') || ''}`
      );
      window.location.href = `mailto:${fallback}?subject=${subject}&body=${body}`;
      status.className = 'form-status success';
      status.innerHTML = `<svg width="16" height="16"><use href="#check"/></svg> Abrimos tu cliente de email para enviar el mensaje.`;
      btn.innerHTML = 'Enviar mensaje <svg width="15" height="15"><use href="#arrow-right"/></svg>';
      btn.disabled = false;
      btn.classList.remove('is-loading');
      return;
    }

    try {
      const resp = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (resp.ok) {
        form.reset();
        form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        status.className = 'form-status success';
        status.innerHTML = `<svg width="16" height="16"><use href="#check"/></svg> ¡Mensaje enviado! Te contactaremos a la brevedad.`;
      } else {
        throw new Error('server error');
      }
    } catch {
      status.className = 'form-status error';
      status.innerHTML =
        `<svg width="16" height="16"><use href="#x"/></svg> ` +
        `No pudimos enviar el mensaje. Escribinos a ` +
        `<a href="mailto:${fallback}">${fallback}</a>.`;
    } finally {
      btn.innerHTML = 'Enviar mensaje <svg width="15" height="15"><use href="#arrow-right"/></svg>';
      btn.disabled = false;
      btn.classList.remove('is-loading');
    }
  });
}

/* ── Active nav link on scroll ──────────────────────────────────────────────── */
function initActiveNav() {
  const links    = document.querySelectorAll('.header-nav a[href^="#"]');
  const ids      = Array.from(links).map(a => a.getAttribute('href').slice(1)).filter(Boolean);
  const sections = ids.map(id => document.getElementById(id)).filter(Boolean);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

/* ── Init ─────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  initHeader();
  initMobileNav();
  initAccordion();
  initModal();
  initLightbox();
  initStatCounters();
  initContactForm();
  initActiveNav();
  initReveal();

  /* CMS hydration: si data/cs.json carga, sobreescribe PRODUCTS/DEFAULT_CHARS y aplica al DOM */
  if (window.fetchSiteData && window.hydrate) {
    const data = await window.fetchSiteData('cs');
    if (data) {
      if (Array.isArray(data?.collection?.products)) PRODUCTS = data.collection.products;
      if (Array.isArray(data?.collection?.defaultChars)) DEFAULT_CHARS = data.collection.defaultChars;
      window.hydrate(data);
    }
  }

  /* Hero + catálogo dependen del data ya resuelto (o del fallback) */
  initHeroSwiper();
  initFilterTabs();
  buildProductSwiper('all');
});
