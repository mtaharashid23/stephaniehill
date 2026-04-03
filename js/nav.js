// ── Lenis smooth scroll — properly synced with GSAP ScrollTrigger ──
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  smoothTouch: false,
  touchMultiplier: 2,
});

// CRITICAL: sync Lenis with GSAP ticker — this fixes the "jerky sections" issue
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// Tell ScrollTrigger to use Lenis scroll values
lenis.on('scroll', ScrollTrigger.update);

// ── Cursor ──
const dot  = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mx = window.innerWidth / 2, my = window.innerHeight / 2;
let rx = mx, ry = my;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function cursorLoop() {
  rx += (mx - rx) * .1;
  ry += (my - ry) * .1;
  if (dot)  { dot.style.left  = mx + 'px'; dot.style.top  = my + 'px'; }
  if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
  requestAnimationFrame(cursorLoop);
})();
// Scale ring on hover
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => { if(ring) { ring.style.width='54px'; ring.style.height='54px'; }});
  el.addEventListener('mouseleave', () => { if(ring) { ring.style.width='36px'; ring.style.height='36px'; }});
});

// ── Nav scroll ──
const navbar = document.getElementById('navbar');
function checkScroll() { navbar && navbar.classList.toggle('scrolled', window.scrollY > 60); }
window.addEventListener('scroll', checkScroll, { passive: true });
checkScroll();

// ── Active nav link ──
const currentPath = location.pathname;

document.querySelectorAll('.nav-links a').forEach(a => {
  const linkPath = new URL(a.href).pathname;

  if (
    linkPath === currentPath ||
    (linkPath.includes('index') && (currentPath === '/' || currentPath === '/index.html'))
  ) {
    a.classList.add('active');
  }
});

// ── Hamburger ──
const ham = document.getElementById('ham');
const mob = document.getElementById('mobileMenu');
if (ham && mob) {
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    mob.classList.toggle('open');
    document.body.style.overflow = mob.classList.contains('open') ? 'hidden' : '';
  });
  mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    ham.classList.remove('open'); mob.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

// ── Page transitions ──
document.querySelectorAll('a[href]').forEach(a => {
  const href = a.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
  a.addEventListener('click', e => {
    e.preventDefault();
    const ov = document.querySelector('.page-transition');
    if (!ov) { location.href = href; return; }
    gsap.to(ov, {
      scaleY: 1, transformOrigin: 'bottom', duration: .55, ease: 'power2.inOut',
      onComplete: () => { location.href = href; }
    });
  });
});

// ── Page-in ──
window.addEventListener('DOMContentLoaded', () => {
  const ov = document.querySelector('.page-transition');
  if (ov) {
    gsap.set(ov, { scaleY: 1, transformOrigin: 'top' });
    gsap.to(ov, { scaleY: 0, duration: .7, ease: 'power2.inOut', delay: .05 });
  }
});

// ── Scroll reveals (data-reveal) ──
gsap.utils.toArray('[data-reveal]').forEach(el => {
  const dir = el.dataset.reveal;
  const from = dir === 'left'  ? { x: -60, opacity: 0 }
             : dir === 'right' ? { x:  60, opacity: 0 }
             :                   { y:  50, opacity: 0 };
  gsap.from(el, {
    ...from, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
  });
});

// ── Stagger groups (data-stagger) ──
gsap.utils.toArray('[data-stagger]').forEach(parent => {
  gsap.from(Array.from(parent.children), {
    y: 40, opacity: 0, duration: .85, stagger: .14, ease: 'power3.out',
    scrollTrigger: { trigger: parent, start: 'top 86%', toggleActions: 'play none none none' }
  });
});
