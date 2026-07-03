(function () {
  'use strict';

  function safe(fn, name) {
    try { fn(); } catch (err) {
      console.error('[init failed] ' + name, err);
    }
  }

  var ICONS = {
    video: '🎬', anim: '✨', photo: '📷',
    character: '🧑‍🎨', sport: '🏆', branding: '🔖'
  };

  var LABELS = {
    video: 'Edición de Video', anim: 'Animación 2D/3D', photo: 'Fotografía',
    character: 'Diseño de Personajes', sport: 'Diseño Deportivo', branding: 'Branding'
  };

  // Para agregar un proyecto real: copia tu archivo dentro de assets/img/<categoria>/
  // y añade "media: 'assets/img/<categoria>/archivo.jpg'" (o .mp4/.webm/.gif) al objeto.
  // Si "media" no está presente, se muestra el placeholder de color + icono.
  window.__PORTFOLIO__ = window.__PORTFOLIO__ || [
    { cat: 'video', title: 'Intro Agenda Deportes', thumb: 'thumb-video', media: 'assets/img/video/intro-agenda-deportes.mp4', poster: 'assets/img/video/intro-agenda-deportes-poster.jpg' },
    { cat: 'video', title: 'Revelación Marlines', thumb: 'thumb-video', media: 'assets/img/video/revelacion-marlines.mp4', poster: 'assets/img/video/revelacion-marlines-poster.jpg' },
    { cat: 'anim', title: 'Final Pato Brown', thumb: 'thumb-anim', media: 'assets/img/anim/final-pato-brown.mp4' },
    { cat: 'anim', title: 'Examen Final', thumb: 'thumb-anim', media: 'assets/img/anim/examen-final.mp4' },
    { cat: 'character', title: 'Gula — Diseño de Personaje', thumb: 'thumb-character', media: 'assets/img/character/gula.png' },
    { cat: 'character', title: 'Robot — Diseño de Personaje', thumb: 'thumb-character', media: 'assets/img/character/robot.png' },
    { cat: 'sport', title: 'Barcelona vs Atlético', thumb: 'thumb-sport', media: 'assets/img/sport/BARCELONA-VS-ATLETICO.png' },
    { cat: 'sport', title: 'Messi — Composición Deportiva', thumb: 'thumb-sport', media: 'assets/img/sport/MESSI-ma.png' },
    { cat: 'sport', title: 'Chiefs vs Bills', thumb: 'thumb-sport', media: 'assets/img/sport/BILLSCHIEFS-ma.png' },
    { cat: 'sport', title: 'Jayson Tatum — Boston Celtics', thumb: 'thumb-sport', media: 'assets/img/sport/TATUM-ma.png' },
    { cat: 'sport', title: 'Alejandra Orozco — Clavados México', thumb: 'thumb-sport', media: 'assets/img/sport/aleorozco.png' },
    { cat: 'sport', title: 'Manchester City vs Salford', thumb: 'thumb-sport', media: 'assets/img/sport/haaland-vs-Salford.png' },
    { cat: 'branding', title: 'Yugen — Café · Taller · Vinilos', thumb: 'thumb-branding', media: 'assets/img/branding/Yugen.png' },
    { cat: 'branding', title: 'Pomada de la Campana', thumb: 'thumb-branding', media: 'assets/img/branding/pomada-de-la-campana.mp4', poster: 'assets/img/branding/pomada-de-la-campana-poster.jpg' }
  ];

  function isVideoFile(src) {
    return /\.(mp4|webm|mov)$/i.test(src);
  }

  // Los videos NO usan autoplay: algunos archivos pesan 50-135MB y reproducirlos
  // todos a la vez congelaría la página. Se activan solo con hover (ver initVideoHover).
  function mediaMarkup(item, extraClass) {
    if (!item.media) {
      return '<span class="thumb-icon">' + ICONS[item.cat] + '</span>';
    }
    if (isVideoFile(item.media)) {
      var posterAttr = item.poster ? ' poster="' + item.poster + '"' : '';
      var preload = item.poster ? 'none' : 'metadata';
      return '<video class="' + extraClass + '" src="' + item.media + '"' + posterAttr + ' muted loop playsinline preload="' + preload + '"></video>';
    }
    return '<img class="' + extraClass + '" src="' + item.media + '" alt="' + item.title + '" loading="lazy">';
  }

  function initVideoHover() {
    var grid = document.getElementById('portfolioGrid');
    if (!grid) return;

    grid.addEventListener('mouseenter', function (e) {
      var item = e.target.closest && e.target.closest('.portfolio-item');
      if (!item) return;
      var video = item.querySelector('video');
      if (video) video.play().catch(function () {});
    }, true);

    grid.addEventListener('mouseleave', function (e) {
      var item = e.target.closest && e.target.closest('.portfolio-item');
      if (!item) return;
      var video = item.querySelector('video');
      if (video) { video.pause(); video.currentTime = 0; }
    }, true);
  }

  function initSplash() {
    var splash = document.getElementById('splash');
    if (!splash) return;
    setTimeout(function () { splash.style.display = 'none'; }, 4600);
  }

  function initHeaderScroll() {
    var header = document.getElementById('site-header');
    if (!header) return;
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  function initNavToggle() {
    var toggle = document.getElementById('navToggle');
    var links = document.getElementById('navLinks');
    if (!toggle || !links) return;
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.classList.remove('open');
        links.classList.remove('open');
      });
    });
  }

  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -60px 0px' });

    items.forEach(function (el) { observer.observe(el); });

    // Safety net: force-reveal anything still hidden after 6s
    setTimeout(function () {
      items.forEach(function (el) { el.classList.add('is-visible'); });
    }, 6000);
  }

  function initPortfolioGrid() {
    var grid = document.getElementById('portfolioGrid');
    if (!grid) return;
    if (grid.children.length > 0) return; // idempotent mount

    var html = window.__PORTFOLIO__.map(function (item, i) {
      return (
        '<div class="portfolio-item" data-cat="' + item.cat + '" data-index="' + i + '">' +
          '<div class="thumb ' + item.thumb + '">' +
            mediaMarkup(item, 'thumb-media') +
          '</div>' +
          '<div class="view">↗</div>' +
          '<div class="overlay">' +
            '<span class="tag">' + LABELS[item.cat] + '</span>' +
            '<div class="title">' + item.title + '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    grid.innerHTML = html;
  }

  function initFilters() {
    var bar = document.getElementById('filterBar');
    var grid = document.getElementById('portfolioGrid');
    if (!bar || !grid) return;

    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-btn');
      if (!btn) return;

      bar.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.dataset.filter;
      grid.querySelectorAll('.portfolio-item').forEach(function (item) {
        var match = filter === 'all' || item.dataset.cat === filter;
        item.classList.toggle('hidden-item', !match);
      });
    });
  }

  function initLightbox() {
    var grid = document.getElementById('portfolioGrid');
    var lightbox = document.getElementById('lightbox');
    var media = document.getElementById('lightboxMedia');
    var tag = document.getElementById('lightboxTag');
    var title = document.getElementById('lightboxTitle');
    var closeBtn = document.getElementById('lightboxClose');
    if (!grid || !lightbox) return;

    grid.addEventListener('click', function (e) {
      var item = e.target.closest('.portfolio-item');
      if (!item) return;
      var data = window.__PORTFOLIO__[item.dataset.index];
      if (!data) return;

      media.className = 'lightbox-media ' + data.thumb;
      media.innerHTML = mediaMarkup(data, 'lightbox-media-el');
      if (data.media && isVideoFile(data.media)) {
        var vid = media.querySelector('video');
        vid.controls = true;
        vid.loop = false;
        vid.play().catch(function () {});
      }
      tag.textContent = LABELS[data.cat];
      title.textContent = data.title;
      lightbox.classList.add('open');
    });

    function close() {
      lightbox.classList.remove('open');
      var vid = media.querySelector('video');
      if (vid) vid.pause();
    }
    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('.submit-btn');
      var original = btn.textContent;
      btn.textContent = '¡Mensaje enviado!';
      form.reset();
      setTimeout(function () { btn.textContent = original; }, 3000);
    });
  }

  function initGsapHero() {
    if (typeof gsap === 'undefined') return;

    gsap.set('.hero-title .split-line span', { yPercent: 0 });
    var tl = gsap.timeline({ delay: 4.5 });
    tl.from('.hero-eyebrow', { opacity: 0, y: 20, duration: .7, ease: 'power3.out' })
      .from('.hero-title .split-line span', {
        yPercent: 120, duration: .9, ease: 'power4.out', stagger: 0.12
      }, '-=0.4')
      .from('.hero-subtitle', { opacity: 0, y: 20, duration: .7, ease: 'power3.out' }, '-=0.5')
      .from('.hero-cta', { opacity: 0, y: 20, duration: .7, ease: 'power3.out' }, '-=0.5');
  }

  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length <= 1) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    safe(initSplash, 'initSplash');
    safe(initHeaderScroll, 'initHeaderScroll');
    safe(initNavToggle, 'initNavToggle');
    safe(initPortfolioGrid, 'initPortfolioGrid');
    safe(initFilters, 'initFilters');
    safe(initVideoHover, 'initVideoHover');
    safe(initLightbox, 'initLightbox');
    safe(initContactForm, 'initContactForm');
    safe(initSmoothAnchors, 'initSmoothAnchors');
    safe(initReveal, 'initReveal');
    safe(initGsapHero, 'initGsapHero');
  });
})();
