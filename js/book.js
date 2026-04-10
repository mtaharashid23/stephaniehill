/**
 * book.js — Book Preloader (CSS 3D rotating book: back → front)
 * Spine removed. Uses CSS 3D perspective + rotateY animation.
 */
(function () {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    #book-preloader {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: #050d18;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      cursor: none;
    }
    #book-preloader::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='.035'/%3E%3C/svg%3E");
      pointer-events: none;
      opacity: .4;
    }

    /* AMBIENT GLOW */
    #book-preloader .pl-ambient {
      position: absolute;
      width: 700px; height: 700px;
      border-radius: 50%;
      background: radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%);
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      animation: plAmbient 4s ease-in-out infinite;
      pointer-events: none;
    }
    @keyframes plAmbient {
      0%,100%{ opacity:.5; transform:translate(-50%,-50%) scale(1);    }
      50%    { opacity:1;  transform:translate(-50%,-50%) scale(1.15); }
    }

    /* PARTICLES */
    #book-preloader .pl-particles { position:absolute; inset:0; pointer-events:none; }
    #book-preloader .pl-particles canvas { width:100%; height:100%; }

    /* 3D SCENE */
    #book-preloader .pl-scene {
      position: relative;
      z-index: 2;
      perspective: 1000px;
    }

    /* BOOK WRAPPER — floats and holds the 3D card */
    #book-preloader .pl-book-wrap {
      animation: plFloat 4s ease-in-out infinite;
      filter: drop-shadow(-18px 28px 80px rgba(0,0,0,.95));
    }
    @keyframes plFloat {
      0%,100%{ transform: translateY(0px);   }
      50%    { transform: translateY(-14px); }
    }

    /* 3D BOOK CARD */
    #book-preloader .pl-book {
      position: relative;
      width:  330px;
      height: 510px;
      transform-style: preserve-3d;
      transform: rotateY(0deg);
      transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* FRONT & BACK FACES */
    #book-preloader .pl-face {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      border-radius: 3px 6px 6px 3px;
      overflow: hidden;
    }
    #book-preloader .pl-face img {
      width: 100%; height: 100%;
      object-fit: cover;
      object-position: center;
      display: block;
    }

    /* Back face: rotated 180deg so it shows when card flips */
    #book-preloader .pl-back {
      transform: rotateY(180deg);
    }

    /* Spine edge — thin strip on left side for depth */
    #book-preloader .pl-spine-edge {
      position: absolute;
      top: 0; left: -14px;
      width: 14px;
      height: 100%;
      background: linear-gradient(to right, #1a1208, #2e2010, #1a1208);
      transform: rotateY(-90deg) translateX(-7px);
      transform-origin: right center;
      border-radius: 2px 0 0 2px;
    }

    /* BOOK GLOW */
    #book-preloader .pl-book-glow {
      position: absolute;
      bottom: -44px; left: 50%;
      transform: translateX(-50%);
      width: 280px; height: 70px;
      background: radial-gradient(ellipse, rgba(201,168,76,.32) 0%, transparent 70%);
      filter: blur(22px);
      animation: plGlow 3s ease-in-out infinite;
      z-index: -1;
    }
    @keyframes plGlow {
      0%,100%{ opacity:.4; transform:translateX(-50%) scaleX(1);    }
      50%    { opacity:.9; transform:translateX(-50%) scaleX(1.22); }
    }

    /* LABEL */
    #book-preloader .pl-label {
      position: relative; z-index: 2;
      margin-top: 56px;
      display: flex; flex-direction: column; align-items: center; gap: 14px;
    }
    #book-preloader .pl-stage-text {
      font-family:'Cormorant Garamond','Georgia',serif;
      font-size:1.1rem; font-style:italic; font-weight:300;
      color:rgba(245,242,236,.7); letter-spacing:.08em;
      transition:opacity .45s ease; min-height:1.6em; text-align:center;
    }
    #book-preloader .pl-progress-wrap {
      width:210px; height:1px;
      background:rgba(201,168,76,.15);
      position:relative; overflow:visible;
    }
    #book-preloader .pl-progress-fill {
      height:1px;
      background:linear-gradient(to right,#c9a84c,#e8c97a);
      width:0%; transition:width .85s ease; position:relative;
    }
    #book-preloader .pl-progress-fill::after {
      content:''; position:absolute; right:0; top:50%;
      transform:translateY(-50%);
      width:6px; height:6px; border-radius:50%;
      background:#e8c97a; box-shadow:0 0 10px rgba(201,168,76,.85);
    }
    #book-preloader .pl-dots { display:flex; gap:10px; margin-top:4px; }
    #book-preloader .pl-dot {
      width:6px; height:6px; border-radius:50%;
      border:1px solid rgba(201,168,76,.4);
      transition:background .4s,border-color .4s,transform .4s;
    }
    #book-preloader .pl-dot.active {
      background:#c9a84c; border-color:#c9a84c; transform:scale(1.35);
    }

    /* EXIT */
    #book-preloader.pl-exit { animation:plExit .9s cubic-bezier(.4,0,1,1) forwards; }
    @keyframes plExit { 0%{opacity:1;} 100%{opacity:0;pointer-events:none;} }

    /* RESPONSIVE */
    @media(max-width:600px){
      #book-preloader .pl-book { width:240px; height:372px; }
      #book-preloader .pl-book-glow { width:190px; }
      #book-preloader .pl-label { margin-top:38px; }
    }
  `;
  document.head.appendChild(style);

  /* HTML */
  const el = document.createElement('div');
  el.id = 'book-preloader';
  el.innerHTML = `
    <div class="pl-ambient"></div>
    <div class="pl-particles"><canvas id="pl-canvas"></canvas></div>
    <div class="pl-scene">
      <div class="pl-book-wrap">
        <div class="pl-book" id="pl-book">
          <!-- Front cover (default visible, rotateY 0) -->
          <div class="pl-face pl-front">
            <img src="images/book-front.jpg" alt="Front Cover" />
          </div>
          <!-- Back cover (flipped 180deg, shows after rotation) -->
          <div class="pl-face pl-back">
            <img src="images/book-back.jpg" alt="Back Cover" />
          </div>
          <!-- Spine depth edge -->
          <div class="pl-spine-edge"></div>
        </div>
        <div class="pl-book-glow"></div>
      </div>
    </div>
    <div class="pl-label">
      <div class="pl-stage-text" id="pl-stage-text">Back Cover</div>
      <div class="pl-progress-wrap">
        <div class="pl-progress-fill" id="pl-progress"></div>
      </div>
      <div class="pl-dots">
        <div class="pl-dot active"></div>
        <div class="pl-dot"></div>
      </div>
    </div>
  `;
  document.body.insertBefore(el, document.body.firstChild);
  document.body.style.overflow = 'hidden';

  /* PARTICLES */
  const canvas = document.getElementById('pl-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, pts = [];

  function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function rnd(a, b) {
    return Math.random() * (b - a) + a;
  }
  for (let i = 0; i < 90; i++) pts.push({
    x: rnd(0, W),
    y: rnd(0, H),
    vx: rnd(-.15, .15),
    vy: rnd(-.25, -.05),
    sz: rnd(.4, 1.9),
    a: rnd(.1, .6),
    da: rnd(.003, .007),
    col: Math.random() > .5 ? '201,168,76' : '245,230,180',
    pulse: rnd(0, Math.PI * 2),
    ps: rnd(.008, .022)
  });
  let raf;

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.pulse += p.ps;
      p.a += p.da;
      if (p.a > .72 || p.a < .05) p.da *= -1;
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -4) p.y = H + 4;
      if (p.x < -4) p.x = W + 4;
      if (p.x > W + 4) p.x = -4;
      const aa = p.a * (.7 + .3 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.col},${aa})`;
      ctx.fill();
    });
    raf = requestAnimationFrame(drawParticles);
  }
  drawParticles();

  /* SEQUENCE */
  const book = document.getElementById('pl-book');
  const stageText = document.getElementById('pl-stage-text');
  const progress = document.getElementById('pl-progress');
  const dots = document.querySelectorAll('#book-preloader .pl-dot');

  function setStage(label, pct, dotIdx, rotY) {
    /* update text */
    stageText.style.opacity = '0';
    setTimeout(() => {
      stageText.textContent = label;
      stageText.style.opacity = '1';
    }, 320);
    /* rotate book */
    book.style.transform = `rotateY(${rotY}deg)`;
    /* progress + dots */
    progress.style.width = pct;
    dots.forEach((d, i) => d.classList.toggle('active', i === dotIdx));
  }

  /*
   * Stage 1 — back cover shown first
   * Back face is rotated 180deg in CSS, so we start book at rotateY(180deg)
   * so the back face is forward.
   */
  book.style.transform = 'rotateY(180deg)';
  book.style.transition = 'none'; /* instant start — no transition */
  /* Force reflow then re-enable transition */
  requestAnimationFrame(() => {
    book.style.transition = '';
    setStage('Back Cover', '50%', 0, 180);
  });

  /* Stage 2 — flip to front after 2.4s */
  setTimeout(() => setStage('Front Cover', '100%', 1, 0), 2400);

  /* Exit after 4.4s */
  setTimeout(() => {
    el.classList.add('pl-exit');
    cancelAnimationFrame(raf);

    setTimeout(() => {
      el.remove();
      document.body.style.overflow = '';

      // ✅ IMPORTANT: trigger GSAP animation here
      window.dispatchEvent(new Event('preloaderDone'));

    }, 950);

  }, 4400);

})();