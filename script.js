(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     STARFIELD BACKGROUND
     ============================================================ */
  const starCanvas = document.getElementById('starfield');
  const starCtx = starCanvas.getContext('2d');
  let stars = [];
  let particles = [];
  let w, h;

  function sizeCanvas(){
    w = starCanvas.width = window.innerWidth;
    h = starCanvas.height = window.innerHeight;
  }

  function initStars(){
    sizeCanvas();
    const count = Math.min(160, Math.floor((w * h) / 9000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.3 + 0.2,
      baseAlpha: Math.random() * 0.6 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.005
    }));
    const pCount = Math.min(36, Math.floor(w / 40));
    particles = Array.from({ length: pCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.08,
      vy: (Math.random() - 0.5) * 0.08,
      r: Math.random() * 1.6 + 0.6
    }));
  }

  function drawStars(t){
    starCtx.clearRect(0, 0, w, h);
    starCtx.fillStyle = '#ffffff';
    for (const s of stars){
      const twinkle = s.baseAlpha + Math.sin(t * s.speed + s.phase) * 0.25;
      starCtx.globalAlpha = Math.max(0, Math.min(1, twinkle));
      starCtx.beginPath();
      starCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      starCtx.fill();
    }
    starCtx.globalAlpha = 0.5;
    starCtx.fillStyle = '#5C8DFF';
    for (const p of particles){
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
      starCtx.beginPath();
      starCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      starCtx.fill();
    }
    starCtx.globalAlpha = 1;
  }

  function starLoop(t){
    drawStars(t * 0.06);
    requestAnimationFrame(starLoop);
  }

  initStars();
  window.addEventListener('resize', initStars);
  requestAnimationFrame(starLoop);

  /* ============================================================
     CURSOR GLOW
     ============================================================ */
  const glow = document.getElementById('cursor-glow');
  if (!('ontouchstart' in window)){
    window.addEventListener('mousemove', (e) => {
      glow.style.opacity = '0.7';
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });
    window.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  }

  /* ============================================================
     LOADER SEQUENCE
     ============================================================ */
  const loaderLines = [
    'INITIALIZING...',
    'LOADING MEMORIES...',
    'LOADING FRIENDSHIP...',
    'LOADING BIRTHDAY EXPERIENCE...'
  ];
  const loaderLineEl = document.getElementById('loader-line');
  const loaderBar = document.getElementById('loader-bar');
  const loaderPct = document.getElementById('loader-pct');
  const loader = document.getElementById('loader');
  const main = document.getElementById('main');

  let pct = 0;
  let lineIdx = 0;
  loaderLineEl.textContent = loaderLines[0];

  const loaderInterval = setInterval(() => {
    pct += Math.random() * 9 + 4;
    if (pct > 100) pct = 100;
    loaderBar.style.width = pct + '%';
    loaderPct.textContent = Math.floor(pct) + '%';

    const nextLineAt = (loaderLines.length > 1) ? (100 / loaderLines.length) : 100;
    const targetIdx = Math.min(loaderLines.length - 1, Math.floor(pct / nextLineAt));
    if (targetIdx !== lineIdx){
      lineIdx = targetIdx;
      loaderLineEl.textContent = loaderLines[lineIdx];
    }

    if (pct >= 100){
      clearInterval(loaderInterval);
      setTimeout(() => {
        loader.classList.add('loader-out');
        main.classList.remove('hidden');
        playTone(660, 0.05, 0.08, 'sine');
        initRevealAnimation();
      }, 350);
    }
  }, 140);

  /* ============================================================
     REVEAL ON SCROLL (IntersectionObserver)
     ============================================================ */
  function initRevealAnimation(){
    const revealEls = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting){
          const el = entry.target;
          const delay = el.dataset.groupIndex ? el.dataset.groupIndex * 90 : 0;
          setTimeout(() => el.classList.add('in'), delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach((el) => io.observe(el));

    // stagger within groups (hud fields, achievements, timeline items)
    staggerGroup('.hud-field');
    staggerGroup('.achv-card');
    staggerGroup('.timeline-item');
    staggerGroup('.stat-row');
  }

  function staggerGroup(selector){
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      el.dataset.groupIndex = i;
    });
  }

  /* ============================================================
     STAT BARS ANIMATE ON VIEW
     ============================================================ */
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting){
        const row = entry.target;
        const val = row.dataset.value || 0;
        const fill = row.querySelector('.stat-fill');
        requestAnimationFrame(() => { fill.style.width = val + '%'; });
        statObserver.unobserve(row);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.stat-row').forEach((row) => statObserver.observe(row));

  /* ============================================================
     TYPEWRITER — PERSONAL MESSAGE
     ============================================================ */
  const messageText =
`Happy Birthday, Yuvraj.

Today isn't just another birthday—it's the start of a whole new chapter.

Turning 18 is a milestone, but what truly matters is the person you've become. Your loyalty, determination, and the memories we've created together are things I'll always value.

I hope this year brings you success, happiness, unforgettable adventures, and every opportunity you deserve.

Keep chasing your dreams, keep smiling, and never lose the person you are.

Happy 18th Birthday.

— Your Best Friend`;

  const twEl = document.getElementById('typewriter-text');
  const twCursor = document.getElementById('typewriter-cursor');
  let twStarted = false;

  function typeWriter(){
    if (twStarted) return;
    twStarted = true;
    if (reducedMotion){
      twEl.textContent = messageText;
      return;
    }
    let i = 0;
    const speed = 18;
    function step(){
      if (i <= messageText.length){
        twEl.textContent = messageText.slice(0, i);
        i++;
        setTimeout(step, speed);
      } else {
        twCursor.style.display = 'none';
      }
    }
    step();
  }

  const twObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) typeWriter(); });
  }, { threshold: 0.3 });
  twObserver.observe(document.getElementById('message'));

  /* ============================================================
     SCROLL PROGRESS BAR
     ============================================================ */
  const progressFill = document.getElementById('scroll-progress-fill');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pctScroll = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressFill.style.width = pctScroll + '%';
  }, { passive: true });

  /* ============================================================
     BEGIN BUTTON — smooth scroll
     ============================================================ */
  document.getElementById('begin-btn').addEventListener('click', () => {
    playClick();
    document.getElementById('profile').scrollIntoView({ behavior: 'smooth' });
  });

  /* ============================================================
     GRAND FINALE FIREWORKS
     ============================================================ */
  const fxCanvas = document.getElementById('fx-canvas');
  const fxCtx = fxCanvas.getContext('2d');
  let fxW, fxH, fireworks = [], fxActive = false;

  function sizeFx(){ fxW = fxCanvas.width = window.innerWidth; fxH = fxCanvas.height = window.innerHeight; }
  sizeFx();
  window.addEventListener('resize', sizeFx);

  function spawnFirework(){
    const x = Math.random() * fxW;
    const y = Math.random() * fxH * 0.55 + fxH * 0.1;
    const colors = ['#2E6BFF', '#5C8DFF', '#C9A227', '#E4C766', '#ffffff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const count = 34;
    for (let i = 0; i < count; i++){
      const angle = (Math.PI * 2 * i) / count;
      const speed = Math.random() * 2.4 + 1.2;
      fireworks.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color
      });
    }
  }

  function fxLoop(){
    if (!fxActive) return;
    fxCtx.clearRect(0, 0, fxW, fxH);
    fireworks.forEach((p) => {
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.012;
      p.life -= 0.012;
      fxCtx.globalAlpha = Math.max(0, p.life);
      fxCtx.fillStyle = p.color;
      fxCtx.beginPath();
      fxCtx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      fxCtx.fill();
    });
    fireworks = fireworks.filter((p) => p.life > 0);
    fxCtx.globalAlpha = 1;
    requestAnimationFrame(fxLoop);
  }

  let fxInterval;
  const finaleObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !fxActive && !reducedMotion){
        fxActive = true;
        requestAnimationFrame(fxLoop);
        spawnFirework();
        fxInterval = setInterval(spawnFirework, 900);
        playTone(880, 0.04, 0.4, 'sine');
      } else if (!entry.isIntersecting && fxActive){
        fxActive = false;
        clearInterval(fxInterval);
        setTimeout(() => fxCtx.clearRect(0, 0, fxW, fxH), 500);
      }
    });
  }, { threshold: 0.4 });
  finaleObserver.observe(document.getElementById('finale'));

  /* ============================================================
     AUDIO — procedural ambient music + click SFX (no external files)
     ============================================================ */
  let audioCtx = null;
  let musicNodes = null;
  let musicOn = false;

  function getCtx(){
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  function playTone(freq, gainLevel = 0.05, duration = 0.15, type = 'sine'){
    try{
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(gainLevel, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration + 0.05);
    } catch(e){ /* audio unavailable, fail silently */ }
  }

  function playClick(){ playTone(420, 0.04, 0.09, 'triangle'); }

  function startAmbientMusic(){
    const ctx = getCtx();
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2);

    const notes = [110, 146.83, 164.81, 220]; // A2, D3, E3, A3 — soft cinematic pad
    const oscs = notes.map((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = 0.5 / (i + 1);
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.05 + i * 0.02;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 4;
      lfo.connect(lfoGain).connect(osc.frequency);
      osc.connect(g).connect(master);
      osc.start(); lfo.start();
      return { osc, lfo, g };
    });

    musicNodes = { master, oscs };
  }

  function stopAmbientMusic(){
    if (!musicNodes) return;
    const ctx = getCtx();
    musicNodes.master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
    setTimeout(() => {
      musicNodes.oscs.forEach(({ osc, lfo }) => { try{ osc.stop(); lfo.stop(); } catch(e){} });
      musicNodes = null;
    }, 1100);
  }

  const musicBtn = document.getElementById('music-toggle');
  musicBtn.addEventListener('click', () => {
    musicOn = !musicOn;
    musicBtn.setAttribute('aria-pressed', String(musicOn));
    if (musicOn){
      getCtx().resume();
      startAmbientMusic();
      playClick();
    } else {
      stopAmbientMusic();
      playClick();
    }
  });

  // subtle click sfx on interactive elements
  document.querySelectorAll('.achv-card, .hud-btn').forEach((el) => {
    el.addEventListener('click', () => playClick());
  });

  /* ============================================================
     EASTER EGGS
     ============================================================ */
  // typing "legend" anywhere
  let typedBuffer = '';
  window.addEventListener('keydown', (e) => {
    if (e.key.length !== 1) return;
    typedBuffer = (typedBuffer + e.key.toLowerCase()).slice(-6);
    if (typedBuffer === 'legend'){
      triggerLegendMode();
      typedBuffer = '';
    }
  });

  function triggerLegendMode(){
    const overlay = document.getElementById('legend-overlay');
    overlay.classList.remove('show');
    void overlay.offsetWidth; // restart animation
    overlay.classList.add('show');
    playTone(220, 0.06, 0.6, 'sawtooth');
    playTone(440, 0.05, 0.8, 'sine');
  }

  // double-click hero title -> blue glow pulse
  const glowTarget = document.querySelector('[data-glow-target]');
  if (glowTarget){
    glowTarget.addEventListener('dblclick', () => {
      glowTarget.classList.remove('pulse-glow');
      void glowTarget.offsetWidth;
      glowTarget.classList.add('pulse-glow');
      playTone(300, 0.05, 0.5, 'sine');
    });
  }

  /* ============================================================
     GSAP HERO ENTRANCE (progressive enhancement, optional)
     ============================================================ */
  window.addEventListener('load', () => {
    if (typeof gsap === 'undefined') return;
    try{
      gsap.registerPlugin(ScrollTrigger);
    } catch(e){ /* ScrollTrigger not available, skip */ }
  });

})();
