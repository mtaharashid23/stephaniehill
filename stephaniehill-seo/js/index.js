(function(){
  const c=document.getElementById('particles-canvas');
  const ctx=c.getContext('2d');
  let W,H,pts=[],shooters=[];
  function resize(){W=c.width=window.innerWidth;H=c.height=window.innerHeight;}
  window.addEventListener('resize',resize);resize();
  function rnd(a,b){return Math.random()*(b-a)+a;}
  for(let i=0;i<130;i++)pts.push({x:rnd(0,W),y:rnd(0,H),vx:rnd(-.18,.18),vy:rnd(-.28,-.06),sz:rnd(.4,2.2),a:rnd(.1,.7),da:rnd(.003,.007),col:Math.random()>.55?'201,168,76':'245,230,180',pulse:rnd(0,Math.PI*2),ps:rnd(.008,.022)});
  function spawnShooter(){shooters.push({x:rnd(0,W*.6),y:rnd(0,H*.35),vx:rnd(3.5,7),vy:rnd(1.5,3),life:1,tail:[]});setTimeout(spawnShooter,rnd(4500,11000));}
  setTimeout(spawnShooter,2800);
  function draw(){ctx.clearRect(0,0,W,H);pts.forEach(p=>{p.pulse+=p.ps;p.a+=p.da;if(p.a>.75||p.a<.06)p.da*=-1;p.x+=p.vx;p.y+=p.vy;if(p.y<-4)p.y=H+4;if(p.x<-4)p.x=W+4;if(p.x>W+4)p.x=-4;const aa=p.a*(.7+.3*Math.sin(p.pulse));ctx.beginPath();ctx.arc(p.x,p.y,p.sz,0,Math.PI*2);ctx.fillStyle=`rgba(${p.col},${aa})`;ctx.fill();if(p.sz>1.4){ctx.beginPath();ctx.arc(p.x,p.y,p.sz*3.2,0,Math.PI*2);ctx.fillStyle=`rgba(${p.col},${aa*.1})`;ctx.fill();}});shooters=shooters.filter(s=>s.life>0);shooters.forEach(s=>{s.tail.push({x:s.x,y:s.y});if(s.tail.length>20)s.tail.shift();s.x+=s.vx;s.y+=s.vy;s.life-=.017;s.tail.forEach((pt,i)=>{const pr=i/s.tail.length;ctx.beginPath();ctx.arc(pt.x,pt.y,pr*.9,0,Math.PI*2);ctx.fillStyle=`rgba(201,168,76,${pr*s.life*.85})`;ctx.fill();});ctx.beginPath();ctx.arc(s.x,s.y,2,0,Math.PI*2);ctx.fillStyle=`rgba(232,201,122,${s.life})`;ctx.fill();});requestAnimationFrame(draw);}
  draw();
})();
const tl=gsap.timeline({defaults:{ease:'power3.out'},delay:.15});
tl.to('#hrule',{opacity:1,duration:.6})
  .to('#tw1 span',{y:'0%',duration:.9,ease:'power4.out'},'-=.2')
  .to('#tw2 span',{y:'0%',duration:.9,ease:'power4.out'},'-=.65')
  .to('.eline',{scaleX:1,duration:.7},'-=.3')
  .to('#eyebrow',{opacity:1,y:0,duration:.5},'-=.3')
  .to('#hsub',{opacity:1,y:0,duration:.6},'-=.3')
  .to('#hdesc',{opacity:1,y:0,duration:.7},'-=.3')
  .to('#hacts',{opacity:1,y:0,duration:.6},'-=.3')
  .to('#bwrap',{opacity:1,y:0,duration:1.1,ease:'power2.out',onComplete(){document.getElementById('bwrap').style.animation='bookFloat 6s ease-in-out infinite';}},'-=.8')
  .to('#bpurchase',{opacity:1,y:0,duration:.6},'-=.3')
  .to('#scrollInd',{opacity:1,duration:.5},'-=.3');