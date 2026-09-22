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

// close mobile nav dropdown after tapping a link
const mnavToggle = document.getElementById('mnav-toggle');
if (mnavToggle) {
  document.querySelectorAll('#mobile-drop a').forEach(a => {
    a.addEventListener('click', () => { mnavToggle.checked = false; });
  });
}

// line-drawing flower animation — plays once, when scrolled into view
const drawFlowers = document.querySelectorAll('.draw-rose');
if (drawFlowers.length) {
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    drawFlowers.forEach(el => io.observe(el));
  } else {
    drawFlowers.forEach(el => el.classList.add('in-view'));
  }
}
