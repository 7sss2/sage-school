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

  // decorative owl motifs — gentle parallax drift relative to viewport center
  const owlEls = document.querySelectorAll('.owl-deco');
  if (owlEls.length) {
    let owlTicking = false;
    const updateOwls = () => {
      const vh = window.innerHeight;
      owlEls.forEach(el => {
        const speed = parseFloat(el.dataset.speed) || 0.1;
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const delta = (vh / 2 - center) * speed;
        el.style.transform = `translateY(${delta.toFixed(1)}px)`;
      });
      owlTicking = false;
    };
    window.addEventListener('scroll', () => {
      if (!owlTicking) { requestAnimationFrame(updateOwls); owlTicking = true; }
    }, { passive: true });
    window.addEventListener('resize', updateOwls);
    updateOwls();
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
    { src: 'assets/img/img-jpg-5.jpg', cap: 'Знакомство с Sage School' },
    { src: 'assets/img/img-jpg-6.jpg', cap: 'Шахматы с талисманом школы' },
    { src: 'assets/img/img-jpg-7.jpg', cap: 'Тёплая атмосфера праздника' },
    { src: 'assets/img/img-jpg-8.jpg', cap: 'Активности на свежем воздухе' },
    { src: 'assets/img/img-jpg-9.jpg', cap: 'Национальный танец' },
    { src: 'assets/img/img-jpg-10.jpg', cap: 'Общий флешмоб с ребятами' },
    { src: 'assets/img/img-jpg-11.jpg', cap: 'Момент, который все ловят на телефон' },
    { src: 'assets/img/img-jpg-12.jpg', cap: 'Семейный турнир по шахматам' },
    { src: 'assets/img/img-jpg-13.jpg', cap: 'Гости праздника' },
  ];
  const track = document.getElementById('marqueeTrack');
  if (track) {
    const sequence = [...momentImages, ...momentImages];
    const full = [...sequence, ...sequence];
    track.innerHTML = full.map(m => `
      <div class="m-card"><img src="${m.src}" alt="" loading="lazy"><div class="cap">${m.cap}</div></div>
    `).join('');
  }
