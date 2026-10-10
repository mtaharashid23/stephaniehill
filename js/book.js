/**
 * book.js — Home page preloader: a true 3D book (front, back, spine, page edges).
 *
 * Choreography (GSAP):
 *   1. the book spins in showing its back cover
 *   2. it turns past the spine to the front cover
 *   3. it floats (and tilts toward the pointer) until the page has loaded
 *   4. desktop: it flies into the hero's book position and hands off to it
 *      tablet/mobile (hero book hidden): it rises and the curtain wipes away
 * Fires `preloaderDone` exactly like the previous preloader, so the hero
 * timeline in index.html keeps working. Sets window.__plHandoff when the
 * book has landed in the hero, so the hero skips its own book entrance.
 */
(function () {
  'use strict';

  var reduced = false;
  try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  /* ------------------------------------------------------------------ CSS */
  var style = document.createElement('style');
  style.id = 'book-preloader-css';
  style.textContent = [
    '#book-preloader{position:fixed;inset:0;z-index:99999;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:none;}',
    '#book-preloader .pl-bg{position:absolute;inset:0;background:',
    '  radial-gradient(ellipse 70% 55% at 50% 45%,#14244a 0%,transparent 62%),',
    '  radial-gradient(ellipse 60% 70% at 20% 70%,#1a0e2a 0%,transparent 55%),#050d18;}',
    '#book-preloader .pl-bg::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.45;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.85\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'200\' height=\'200\' filter=\'url(%23n)\' opacity=\'.035\'/%3E%3C/svg%3E");}',
    '#book-preloader .pl-ambient{position:absolute;left:50%;top:50%;width:min(900px,130vw);aspect-ratio:1;border-radius:50%;transform:translate(-50%,-50%);background:radial-gradient(closest-side,rgba(201,168,76,.16),rgba(201,168,76,.05) 55%,transparent 75%);pointer-events:none;}',
    '#book-preloader .pl-rings{position:absolute;inset:0;margin:auto;width:min(640px,96vw);height:min(640px,96vw);pointer-events:none;}',
    '#book-preloader .pl-rings i{position:absolute;inset:0;border-radius:50%;border:1px solid rgba(201,168,76,.13);}',
    '#book-preloader .pl-rings i:nth-child(2){inset:9%;border-color:rgba(201,168,76,.09);}',
    '#book-preloader .pl-rings i:nth-child(3){inset:-12%;border-style:dashed;border-color:rgba(201,168,76,.07);}',
    '#book-preloader .pl-particles{position:absolute;inset:0;pointer-events:none;}',
    '#book-preloader .pl-particles canvas{width:100%;height:100%;display:block;}',

    /* 3D book */
    '#book-preloader .pl-scene{position:relative;z-index:2;perspective:1700px;perspective-origin:50% 40%;}',
    '#book-preloader .pl-book-wrap{position:relative;will-change:transform;}',
    '#book-preloader .pl-tilt{transform-style:preserve-3d;}',
    '#book-preloader .pl-book{--w:clamp(190px,21vw,290px);--h:calc(var(--w)*1.5776);--d:calc(var(--w)*.156);position:relative;width:var(--w);height:var(--h);transform-style:preserve-3d;will-change:transform;}',
    '#book-preloader .pl-face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden;}',
    '#book-preloader .pl-face img{width:100%;height:100%;object-fit:cover;display:block;user-select:none;-webkit-user-drag:none;}',
    '#book-preloader .pl-front{transform:translateZ(calc(var(--d)/2));border-radius:1px 3px 3px 1px;box-shadow:inset 4px 0 8px rgba(0,0,0,.35);}',
    '#book-preloader .pl-front::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(105deg,rgba(255,255,255,0) 28%,rgba(255,236,200,.16) 47%,rgba(255,255,255,0) 62%);background-size:260% 100%;background-position:var(--sheen,100%) 0;}',
    '#book-preloader .pl-front::before{content:"";position:absolute;left:0;top:0;bottom:0;width:6%;z-index:1;pointer-events:none;background:linear-gradient(90deg,rgba(0,0,0,.35),rgba(255,255,255,.06) 40%,rgba(0,0,0,0));}',
    '#book-preloader .pl-back{transform:rotateY(180deg) translateZ(calc(var(--d)/2));border-radius:3px 1px 1px 3px;}',
    '#book-preloader .pl-spine{width:var(--d);left:calc(50% - var(--d)/2);transform:rotateY(-90deg) translateZ(calc(var(--w)/2));}',
    '#book-preloader .pl-pages{width:var(--d);left:calc(50% - var(--d)/2);top:1.2%;bottom:1.2%;transform:rotateY(90deg) translateZ(calc(var(--w)/2 - 3px));background:repeating-linear-gradient(90deg,#f1ebdf 0 1px,#d9cfbd 1px 2px);box-shadow:inset 0 0 12px rgba(60,40,10,.25);}',
    '#book-preloader .pl-top,#book-preloader .pl-bottom{height:var(--d);top:calc(50% - var(--d)/2);left:0;width:calc(100% - 3px);background:repeating-linear-gradient(0deg,#f1ebdf 0 1px,#d9cfbd 1px 2px);}',
    '#book-preloader .pl-top{transform:rotateX(90deg) translateZ(calc(var(--h)/2 - 2px));}',
    '#book-preloader .pl-bottom{transform:rotateX(-90deg) translateZ(calc(var(--h)/2 - 2px));}',
    '#book-preloader .pl-shadow{position:absolute;left:50%;bottom:-40px;width:120%;height:46px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.75),transparent);filter:blur(8px);pointer-events:none;}',
    '#book-preloader .pl-glow{position:absolute;left:50%;bottom:-54px;width:150%;height:80px;transform:translateX(-50%);background:radial-gradient(closest-side,rgba(201,168,76,.32),transparent);filter:blur(20px);pointer-events:none;}',

    /* label */
    '#book-preloader .pl-label{position:relative;z-index:2;margin-top:clamp(40px,6.5vh,64px);display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center;}',
    '#book-preloader .pl-title{font-family:"Cormorant Garamond",Georgia,serif;font-weight:300;font-size:clamp(1.3rem,2.2vw,1.8rem);letter-spacing:.32em;text-transform:uppercase;color:#e8c97a;line-height:1;padding-left:.32em;}',
    '#book-preloader .pl-title span{display:inline-block;}',
    '#book-preloader .pl-sub{font-family:"Cormorant Garamond",Georgia,serif;font-style:italic;font-weight:300;font-size:1rem;letter-spacing:.06em;color:rgba(245,242,236,.66);}',
    '#book-preloader .pl-meter{display:flex;align-items:center;gap:14px;margin-top:8px;}',
    '#book-preloader .pl-track{position:relative;width:180px;height:1px;background:rgba(201,168,76,.18);}',
    '#book-preloader .pl-fill{position:absolute;inset:0;transform-origin:left;transform:scaleX(0);background:linear-gradient(to right,#c9a84c,#e8c97a);}',
    '#book-preloader .pl-pct{font-family:"Montserrat",sans-serif;font-size:.6rem;letter-spacing:.24em;color:rgba(201,168,76,.85);min-width:3.4em;text-align:left;font-variant-numeric:tabular-nums;}',
    '@media (hover:hover) and (pointer:fine){body.pl-active .cursor-dot,body.pl-active .cursor-ring{z-index:100000!important;}}',
    '@media (max-width:600px){#book-preloader .pl-book{--w:min(52vw,210px);}#book-preloader .pl-title{letter-spacing:.24em;}}',
    '@media (max-height:620px){#book-preloader .pl-book{--w:clamp(150px,16vh,200px);}#book-preloader .pl-label{margin-top:28px;}}'
  ].join('\n');
  document.head.appendChild(style);

  /* ----------------------------------------------------------------- HTML */
  var title = 'Healing Tears';
  var titleHTML = title.split('').map(function (c) { return c === ' ' ? '<span>&nbsp;</span>' : '<span>' + c + '</span>'; }).join('');
  var el = document.createElement('div');
  el.id = 'book-preloader';
  el.setAttribute('role', 'status');
  el.setAttribute('aria-label', 'Loading Healing Tears by Stephanie Hill');
  el.innerHTML =
    '<div class="pl-bg"><div class="pl-ambient"></div><div class="pl-rings"><i></i><i></i><i></i></div>' +
    '<div class="pl-particles"><canvas id="pl-canvas"></canvas></div></div>' +
    '<div class="pl-scene" aria-hidden="true"><div class="pl-book-wrap"><div class="pl-glow"></div><div class="pl-shadow"></div><div class="pl-tilt"><div class="pl-book">' +
      '<div class="pl-face pl-front"><img src="images/preloader/front.webp" alt="" decoding="async"></div>' +
      '<div class="pl-face pl-back"><img src="images/preloader/back.webp" alt="" decoding="async"></div>' +
      '<div class="pl-face pl-spine"><img src="images/preloader/spine.webp" alt="" decoding="async"></div>' +
      '<div class="pl-face pl-pages"></div><div class="pl-face pl-top"></div><div class="pl-face pl-bottom"></div>' +
    '</div></div></div></div>' +
    '<div class="pl-label" aria-hidden="true"><div class="pl-title">' + titleHTML + '</div>' +
    '<div class="pl-sub">A Memoir of Survival &middot; Stephanie Hill</div>' +
    '<div class="pl-meter"><div class="pl-track"><div class="pl-fill"></div></div><div class="pl-pct">0%</div></div></div>';
  document.body.insertBefore(el, document.body.firstChild);
  document.body.style.overflow = 'hidden';
  document.body.classList.add('pl-active');

  /* ------------------------------------------------------------ particles */
  var canvas = el.querySelector('#pl-canvas');
  var ctx = canvas.getContext('2d');
  var W = 0, H = 0, pts = [], raf = 0, running = true;
  function resizeCanvas() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  function rnd(a, b) { return Math.random() * (b - a) + a; }
  for (var i = 0; i < 80; i++) pts.push({ x: rnd(0, W), y: rnd(0, H), vx: rnd(-.15, .15), vy: rnd(-.25, -.05), sz: rnd(.4, 1.9), a: rnd(.1, .6), da: rnd(.003, .007), col: Math.random() > .5 ? '201,168,76' : '245,230,180', pulse: rnd(0, 6.28), ps: rnd(.008, .022) });
  function drawParticles() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    for (var k = 0; k < pts.length; k++) {
      var p = pts[k];
      p.pulse += p.ps; p.a += p.da;
      if (p.a > .72 || p.a < .05) p.da *= -1;
      p.x += p.vx; p.y += p.vy;
      if (p.y < -4) p.y = H + 4;
      if (p.x < -4) p.x = W + 4;
      if (p.x > W + 4) p.x = -4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.sz, 0, 6.2832);
      ctx.fillStyle = 'rgba(' + p.col + ',' + (p.a * (.7 + .3 * Math.sin(p.pulse))) + ')';
      ctx.fill();
    }
    raf = requestAnimationFrame(drawParticles);
  }
  if (!reduced) drawParticles();

  /* -------------------------------------------------------- load progress */
  var progress = 0; // 0..1, real loading progress
  function trackLoading() {
    var imgs = Array.prototype.slice.call(document.images);
    var total = imgs.length + 2, done = 0;
    function tick() { done++; progress = Math.min(1, done / total); }
    imgs.forEach(function (img) {
      if (img.complete) tick();
      else { img.addEventListener('load', tick, { once: true }); img.addEventListener('error', tick, { once: true }); }
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(tick, tick); else tick();
    if (document.readyState === 'complete') tick(); else window.addEventListener('load', tick, { once: true });
  }

  /* ------------------------------------------------------------- finish */
  var finished = false;
  function cleanup() {
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resizeCanvas);
    if (el.parentNode) el.parentNode.removeChild(el);
    document.body.classList.remove('pl-active');
    document.body.style.overflow = '';
  }
  function done() {
    if (finished) return;
    finished = true;
    cleanup();
    window.dispatchEvent(new Event('preloaderDone'));
  }

  /* ---------------------------------------------- fallback without GSAP */
  function fallback() {
    var book = el.querySelector('.pl-book');
    book.style.transform = 'rotateY(-28deg) rotateX(6deg)';
    el.querySelector('.pl-fill').style.transform = 'scaleX(1)';
    el.querySelector('.pl-pct').textContent = '100%';
    setTimeout(function () {
      el.style.transition = 'opacity .8s';
      el.style.opacity = '0';
      setTimeout(done, 820);
    }, reduced ? 900 : 2600);
  }

  /* --------------------------------------------------------- choreography */
  function run() {
    var gsap = window.gsap;
    if (!gsap) { fallback(); return; }
    trackLoading();

    var wrap = el.querySelector('.pl-book-wrap');
    var tilt = el.querySelector('.pl-tilt');
    var book = el.querySelector('.pl-book');
    var front = el.querySelector('.pl-front');
    var bg = el.querySelector('.pl-bg');
    var rings = el.querySelector('.pl-rings');
    var label = el.querySelector('.pl-label');
    var chars = el.querySelectorAll('.pl-title span');
    var sub = el.querySelector('.pl-sub');
    var meter = el.querySelector('.pl-meter');
    var fill = el.querySelector('.pl-fill');
    var pct = el.querySelector('.pl-pct');
    var REST_Y = -28, REST_X = 6;

    if (reduced) {
      gsap.set(book, { rotationY: REST_Y, rotationX: REST_X });
      gsap.set(fill, { scaleX: 1 }); pct.textContent = '100%';
      gsap.to(el, { opacity: 0, duration: .6, delay: .8, onComplete: done });
      return;
    }

    /* the visible meter eases toward real progress, never past what has loaded */
    var shown = { v: 0 }, introDone = false;
    gsap.ticker.add(meterTick);
    function meterTick() {
      var cap = introDone ? progress : Math.min(progress, .85);
      shown.v += (cap - shown.v) * (introDone ? .22 : .08);
      if (cap - shown.v < .004) shown.v = cap;
      fill.style.transform = 'scaleX(' + shown.v.toFixed(4) + ')';
      pct.textContent = Math.round(shown.v * 100) + '%';
    }

    /* pointer tilt */
    var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var rx = gsap.quickTo(tilt, 'rotationX', { duration: .9, ease: 'power3.out' });
    var ry = gsap.quickTo(tilt, 'rotationY', { duration: .9, ease: 'power3.out' });
    function onMove(e) {
      ry(((e.clientX / window.innerWidth) - .5) * 18);
      rx(-((e.clientY / window.innerHeight) - .5) * 12);
    }
    if (fine) window.addEventListener('pointermove', onMove);

    gsap.set(book, { rotationY: 152 + 120, rotationX: 10 });
    gsap.set(wrap, { y: 60, scale: .78, opacity: 0 });
    gsap.set(chars, { yPercent: 110, opacity: 0 });
    gsap.set([sub, meter], { opacity: 0, y: 12 });
    gsap.set(rings, { scale: .7, opacity: 0 });

    var floatTw = null;
    var intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
    intro
      .to(rings, { scale: 1, opacity: 1, duration: 2.4 }, 0)
      /* 1. spin in on the back cover */
      .to(wrap, { y: 0, scale: 1, opacity: 1, duration: 1.4 }, .1)
      .to(book, { rotationY: 152, rotationX: REST_X, duration: 1.6 }, .1)
      .to(chars, { yPercent: 0, opacity: 1, duration: 1.1, stagger: .045 }, .5)
      .to(sub, { opacity: 1, y: 0, duration: 1 }, .9)
      .to(meter, { opacity: 1, y: 0, duration: 1 }, 1.05)
      /* 2. turn past the spine to the front */
      .to(book, { rotationY: REST_Y, duration: 2, ease: 'power3.inOut' }, 2)
      .fromTo(front, { '--sheen': '100%' }, { '--sheen': '-60%', duration: 1.6, ease: 'power2.inOut' }, 3.3)
      .add(function () {
        introDone = true;
        floatTw = gsap.to(wrap, { y: -12, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      }, 4);
    var ringSpin = gsap.to(rings, { rotation: 360, duration: 90, ease: 'none', repeat: -1 });

    /* 3. leave once the intro has played AND the page has loaded (max 7s) */
    var started = performance.now();
    function waitThenExit() {
      var loaded = progress >= 1 && shown.v > .985;
      var timedOut = performance.now() - started > 7000;
      if (introDone && (loaded || timedOut)) { progress = 1; shown.v = 1; meterTick(); exit(); }
      else setTimeout(waitThenExit, 60);
    }
    waitThenExit();

    function heroTarget() {
      var side = document.querySelector('.hero-book-side');
      var img = document.querySelector('#bwrap img');
      if (!side || !img || getComputedStyle(side).display === 'none') return null;
      var prevX = gsap.getProperty(side, 'x');
      gsap.set(side, { x: 0 });
      var r = img.getBoundingClientRect();
      gsap.set(side, { x: prevX });
      if (!r.width || !r.height || r.bottom < 0 || r.top > window.innerHeight) return null;
      return r;
    }

    /* 4. exit */
    function exit() {
      if (fine) window.removeEventListener('pointermove', onMove);
      if (floatTw) floatTw.kill();
      ringSpin.kill();
      document.body.style.overflow = '';
      var target = heroTarget();
      var tl = gsap.timeline({ defaults: { ease: 'expo.inOut' } });
      tl.to(label, { opacity: 0, y: 24, duration: .7, ease: 'power3.in' }, 0)
        .to(tilt, { rotationX: 0, rotationY: 0, duration: 1.2 }, 0);

      if (target) {
        /* fly into the hero's book and hand off */
        var scene = el.querySelector('.pl-scene').getBoundingClientRect();
        var sc = { x: scene.left + scene.width / 2, y: scene.top + scene.height / 2 };
        var tc = { x: target.left + target.width / 2, y: target.top + target.height / 2 };
        var s = target.height / scene.height;
        tl.to(book, { rotationY: 0, rotationX: 0, duration: 1.3 }, 0)
          .to(wrap, { x: tc.x - sc.x, y: tc.y - sc.y, scale: s, duration: 1.3 }, .05)
          .to(el.querySelectorAll('.pl-glow, .pl-shadow'), { opacity: 0, duration: .6 }, .1)
          .to(bg, { opacity: 0, duration: 1.1, ease: 'power2.inOut' }, .35)
          .add(function () {
            window.__plHandoff = true;
            gsap.set('.hero-book-side', { x: '0%', opacity: 1 });
          }, 1.3)
          .to(wrap, { opacity: 0, duration: .35, ease: 'power1.out' }, 1.32)
          .add(function () { gsap.ticker.remove(meterTick); done(); }, 1.68);
      } else {
        /* no hero book on this screen size: rise and wipe the curtain */
        tl.to(book, { rotationY: -8, rotationX: 0, duration: 1.1 }, 0)
          .to(wrap, { y: -40, scale: 1.08, duration: 1.1 }, 0)
          .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.05 }, .45)
          .add(function () { gsap.ticker.remove(meterTick); done(); }, 1.5);
      }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();

  /* never trap the visitor behind the loader */
  setTimeout(function () { if (!finished) done(); }, 12000);
})();
