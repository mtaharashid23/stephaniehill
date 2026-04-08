window.addEventListener('DOMContentLoaded', function () {

  // Hero entrance
  gsap.from('.ph-inner h1', { y: 70, opacity: 0, duration: 1.1, ease: 'power3.out', delay: .45 });
  gsap.from('.ph-inner .s-label', { y: 30, opacity: 0, duration: .85, ease: 'power3.out', delay: .2 });

  // Scroll reveals — set first, then animate on enter
  gsap.utils.toArray('[data-reveal]').forEach(function (el) {
    gsap.set(el, { y: 40, opacity: 0 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: function () {
        gsap.to(el, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' });
      }
    });
  });

  // Pullquote border glow on scroll
  var pq = document.querySelector('.blog-pullquote');
  if (pq) {
    ScrollTrigger.create({
      trigger: pq, start: 'top 80%', once: true,
      onEnter: function () {
        gsap.to(pq, { borderLeftColor: 'rgba(201,168,76,1)', duration: .7, ease: 'power2.out' });
      }
    });
  }

  // Safety fallback — show any remaining hidden elements after 2.5s
  setTimeout(function () {
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      if (parseFloat(getComputedStyle(el).opacity) < 0.1) {
        gsap.to(el, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
      }
    });
  }, 2500);

});