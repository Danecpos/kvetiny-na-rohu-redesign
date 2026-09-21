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

// close mobile nav dropdown after tapping a link
const mnavToggle = document.getElementById('mnav-toggle');
if (mnavToggle) {
  document.querySelectorAll('#mobile-drop a').forEach(a => {
    a.addEventListener('click', () => { mnavToggle.checked = false; });
  });
}
