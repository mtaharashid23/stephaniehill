gsap.registerPlugin(ScrollTrigger);
  

    gsap.from('.ph-inner h1', {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: .4
    });
    gsap.from('.ph-inner .s-label', {
      y: 30,
      opacity: 0,
      duration: .8,
      ease: 'power3.out',
      delay: .2
    });
    gsap.from('.ph-bg-text', {
      y: 40,
      opacity: 0,
      duration: 1.2,
      ease: 'power2.out',
      delay: .1
    });