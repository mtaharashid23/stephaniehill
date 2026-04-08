gsap.from('.ph-inner h1',{y:60,opacity:0,duration:1,ease:'power3.out',delay:.4});
gsap.from('.ph-inner .s-label',{y:30,opacity:0,duration:.8,ease:'power3.out',delay:.2});
document.querySelectorAll('.bc,.blog-featured').forEach(card=>{
  card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect();card.style.background=`radial-gradient(circle 300px at ${e.clientX-r.left}px ${e.clientY-r.top}px,rgba(201,168,76,.05),rgba(10,22,40,.85) 70%)`;});
  card.addEventListener('mouseleave',()=>{card.style.background='';});
});