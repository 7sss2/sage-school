// header shadow on scroll
  const header = document.getElementById('siteHeader');
  const heroPhoto = document.querySelector('.hero-photo');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
    if (heroPhoto) {
      const y = Math.min(window.scrollY * 0.18, 60);
      heroPhoto.style.backgroundPosition = `center calc(12% + ${y}px)`;
    }
  });

  // decorative owl motifs — gentle parallax drift relative to viewport center,
  // plus cursor-reactive drift for owls inside the hero
  const owlEls = document.querySelectorAll('.owl-deco');
  if (owlEls.length) {
    let owlTicking = false;
    const updateOwls = () => {
      const vh = window.innerHeight;
      owlEls.forEach(el => {
        const speed = parseFloat(el.dataset.speed) || 0.1;
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const scrollDelta = (vh / 2 - center) * speed;
        const mx = parseFloat(el.dataset.mx) || 0;
        const my = parseFloat(el.dataset.my) || 0;
        el.style.transform = `translate(${mx.toFixed(1)}px, ${(scrollDelta + my).toFixed(1)}px)`;
      });
      owlTicking = false;
    };
    window.addEventListener('scroll', () => {
      if (!owlTicking) { requestAnimationFrame(updateOwls); owlTicking = true; }
    }, { passive: true });
    window.addEventListener('resize', updateOwls);
    updateOwls();

    const heroSection = document.querySelector('.hero');
    const heroOwls = heroSection ? heroSection.querySelectorAll('.owl-deco') : [];
    if (heroSection && heroOwls.length) {
      let mouseTicking = false;
      const applyMouse = () => { updateOwls(); mouseTicking = false; };
      heroSection.addEventListener('mousemove', (e) => {
        const r = heroSection.getBoundingClientRect();
        const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
        heroOwls.forEach(el => {
          const speed = parseFloat(el.dataset.speed) || 0.1;
          el.dataset.mx = (nx * speed * 46).toFixed(1);
          el.dataset.my = (ny * speed * 26).toFixed(1);
        });
        if (!mouseTicking) { requestAnimationFrame(applyMouse); mouseTicking = true; }
      });
      heroSection.addEventListener('mouseleave', () => {
        heroOwls.forEach(el => { el.dataset.mx = 0; el.dataset.my = 0; });
        requestAnimationFrame(applyMouse);
      });
    }
  }

  // hero stat chips — count up when the hero is visible
  const heroStatNums = document.querySelectorAll('.hero-stats .num[data-count]');
  if (heroStatNums.length) {
    const animateCount = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const prefix = el.dataset.prefix || '';
      const duration = 1100;
      const start = performance.now();
      const tick = (t) => {
        const p = Math.min((t - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = `${prefix}${Math.round(target * eased)}`;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const statIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { animateCount(e.target); statIO.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    heroStatNums.forEach(el => statIO.observe(el));
  }

  // hero showcase carousel — autoplay, dots, swipe, pause on hover
  const showcase = document.getElementById('heroShowcase');
  if (showcase) {
    const slides = showcase.querySelectorAll('.showcase-slide');
    const dots = showcase.querySelectorAll('.showcase-dots .dot');
    let active = 0;
    let timer = null;
    const goTo = (idx) => {
      active = (idx + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('active', i === active));
      dots.forEach((d, i) => d.classList.toggle('active', i === active));
    };
    const start = () => { timer = setInterval(() => goTo(active + 1), 4500); };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    dots.forEach(d => d.addEventListener('click', (e) => {
      e.preventDefault();
      goTo(parseInt(d.dataset.goto, 10));
      stop(); start();
    }));
    slides.forEach(s => s.addEventListener('click', (e) => {
      if (!s.classList.contains('active')) { e.preventDefault(); goTo(parseInt(s.dataset.slide, 10)); stop(); start(); }
    }));
    showcase.addEventListener('mouseenter', stop);
    showcase.addEventListener('mouseleave', start);

    let touchStartX = 0;
    showcase.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    showcase.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { goTo(active + (dx < 0 ? 1 : -1)); stop(); start(); }
    }, { passive: true });

    start();
  }

  // reveal on scroll
  const revealEls = document.querySelectorAll('.reveal, .reveal-l, .reveal-r');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  // methodology tabs
  const methodBtns = document.querySelectorAll('.method-btn');
  const methodPanes = document.querySelectorAll('.method-pane');
  methodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.tab;
      methodBtns.forEach(b => b.classList.remove('active'));
      methodPanes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.querySelector(`.method-pane[data-pane="${idx}"]`).classList.add('active');
    });
  });

  // moments carousel — built from real event photos, referenced (not duplicated) by URL
  const momentImages = [
    { src: 'assets/img/img-jpg-5.webp', cap: 'Знакомство с Sage School' },
    { src: 'assets/img/img-jpg-6.webp', cap: 'Шахматы с талисманом школы' },
    { src: 'assets/img/img-jpg-7.webp', cap: 'Тёплая атмосфера праздника' },
    { src: 'assets/img/img-jpg-8.webp', cap: 'Активности на свежем воздухе' },
    { src: 'assets/img/img-jpg-9.webp', cap: 'Национальный танец' },
    { src: 'assets/img/img-jpg-10.webp', cap: 'Общий флешмоб с ребятами' },
    { src: 'assets/img/img-jpg-11.webp', cap: 'Момент, который все ловят на телефон' },
    { src: 'assets/img/img-jpg-12.webp', cap: 'Семейный турнир по шахматам' },
    { src: 'assets/img/img-jpg-13.webp', cap: 'Гости праздника' },
  ];
  const track = document.getElementById('marqueeTrack');
  if (track) {
    const sequence = [...momentImages, ...momentImages];
    const full = [...sequence, ...sequence];
    track.innerHTML = full.map(m => `
      <div class="m-card"><img src="${m.src}" alt="" loading="lazy"><div class="cap">${m.cap}</div></div>
    `).join('');
  }
