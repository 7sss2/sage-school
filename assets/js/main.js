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

  // timeline items reveal
  const timeline = document.getElementById('timeline');
  const tItems = document.querySelectorAll('.t-item');
  const tItemIo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        tItemIo.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  tItems.forEach(el => tItemIo.observe(el));

  // draw connecting arcs between spheres — segmented, with arrowheads and alternating dash style (GetCourse-style chain)
  function drawTimelinePath(){
    const rectT = timeline.getBoundingClientRect();
    const svg = document.getElementById('timelinePath');
    const spheres = [...timeline.querySelectorAll('.sphere')];
    if (!spheres.length) return;
    svg.setAttribute('width', rectT.width);
    svg.setAttribute('height', rectT.height);
    svg.setAttribute('viewBox', `0 0 ${rectT.width} ${rectT.height}`);
    svg.querySelectorAll('path.seg').forEach(p => p.remove());

    const pts = spheres.map(s => {
      const r = s.getBoundingClientRect();
      return { x: r.left + r.width/2 - rectT.left, y: r.top + r.height/2 - rectT.top, radius: r.width/2 };
    });

    const svgNS = 'http://www.w3.org/2000/svg';

    function makeArc(p1, p2, bendSign, bendAmt, gapStart, gapEnd){
      const dx = p2.x - p1.x, dy = p2.y - p1.y;
      const dist = Math.hypot(dx, dy) || 1;
      const nx = -dy/dist, ny = dx/dist;
      const bend = bendSign * Math.min(bendAmt, dist * 0.24);
      const mx = (p1.x + p2.x)/2 + nx*bend;
      const my = (p1.y + p2.y)/2 + ny*bend;
      const sx = mx - p1.x, sy = my - p1.y, slen = Math.hypot(sx,sy) || 1;
      const stx = p1.x + (sx/slen)*gapStart;
      const sty = p1.y + (sy/slen)*gapStart;
      const ex0 = p2.x - mx, ey0 = p2.y - my, elen = Math.hypot(ex0,ey0) || 1;
      const ex = p2.x - (ex0/elen)*gapEnd;
      const ey = p2.y - (ey0/elen)*gapEnd;
      return `M ${stx.toFixed(1)} ${sty.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)}, ${ex.toFixed(1)} ${ey.toFixed(1)}`;
    }

    for (let i = 0; i < pts.length - 1; i++){
      const p1 = pts[i], p2 = pts[i+1];
      const bendSign = i % 2 === 0 ? 1 : -1;

      const dPrimary = makeArc(p1, p2, bendSign, 90, p1.radius + 14, p2.radius + 18);
      const primary = document.createElementNS(svgNS, 'path');
      primary.setAttribute('d', dPrimary);
      primary.setAttribute('class', 'seg seg-primary');
      primary.setAttribute('marker-end', 'url(#tArrowPrimary)');
      primary.style.transitionDelay = `${i * 0.2}s`;
      svg.appendChild(primary);
    }
  }

  const timelineIo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        drawTimelinePath();
        requestAnimationFrame(() => { timeline.classList.add('in'); });
        timelineIo.unobserve(e.target);
      }
    });
  }, { threshold: 0.05 });
  timelineIo.observe(timeline);

  window.addEventListener('load', drawTimelinePath);
  window.addEventListener('resize', () => { drawTimelinePath(); });
  document.fonts && document.fonts.ready.then(drawTimelinePath);

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
