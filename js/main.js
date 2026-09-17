// header background on scroll
const header = document.getElementById('site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// reveal-on-scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, {threshold: 0.15});
document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => io.observe(el));

// gallery filter tabs (present only on tvorba.html)
const tabs = document.querySelectorAll('.filter-tabs button');
if (tabs.length) {
  const figures = document.querySelectorAll('.grid figure');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      figures.forEach(fig => {
        const show = cat === 'vse' || fig.dataset.cat === cat;
        fig.classList.toggle('hide', !show);
      });
    });
  });
}

// floating petals canvas — subtle special touch
const canvas = document.getElementById('petals');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let w, h;
  function resize(){ w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['#e8b4b8', '#c98a90', '#8b93bf', '#f3ece3'];
  const petals = Array.from({length: 14}, () => spawn());
  function spawn(){
    return {
      x: Math.random()*w,
      y: -20 - Math.random()*h*0.6,
      r: 5 + Math.random()*6,
      speed: 0.4 + Math.random()*0.6,
      drift: Math.random()*1.2 - 0.6,
      swing: Math.random()*Math.PI*2,
      swingSpeed: 0.01 + Math.random()*0.015,
      color: COLORS[Math.floor(Math.random()*COLORS.length)],
      rot: Math.random()*Math.PI*2,
      rotSpeed: (Math.random()-0.5)*0.02
    };
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    petals.forEach(p => {
      p.y += p.speed;
      p.swing += p.swingSpeed;
      p.x += p.drift + Math.sin(p.swing)*0.6;
      p.rot += p.rotSpeed;
      if (p.y > h + 20){ Object.assign(p, spawn(), {y: -20}); }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.ellipse(0,0,p.r,p.r*0.6,0,0,Math.PI*2);
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(draw);
  }
  draw();
}
