// gallery filter tabs (present only on tvorba.html)
const tabs = document.querySelectorAll('.filter-tabs button');
if (tabs.length) {
  const figures = document.querySelectorAll('.grid figure');
  const gallerySection = document.querySelector('.filter-tabs').closest('section');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      figures.forEach(fig => {
        const show = cat === 'vse' || fig.dataset.cat === cat;
        fig.classList.toggle('hide', !show);
      });
      if (gallerySection) gallerySection.classList.toggle('mood-dark', cat === 'smutecni');
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

// rose-feature — line-drawing rose showcase (homepage only)
(function () {
  const svg = document.getElementById('rf-svg');
  if (!svg) return;

  const signature = document.getElementById('rf-signature');
  const section = document.querySelector('.rose-feature');
  const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';

  const stem  = svg.querySelectorAll('[data-group="stem"]');
  const leaf  = svg.querySelectorAll('[data-group="leaf"]');
  const outer = svg.querySelectorAll('[data-group="outer"]');
  const mid   = svg.querySelectorAll('[data-group="mid"]');
  const inner = svg.querySelectorAll('[data-group="inner"]');
  const bud   = svg.querySelectorAll('[data-group="bud"]');
  const allPaths = svg.querySelectorAll('path');

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const jitter = (base, amt) => base + (Math.random() * 2 - 1) * amt;

  function draw(el, duration, delay) {
    return el.animate(
      [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }],
      { duration, delay, easing: EASE, fill: 'forwards' }
    ).finished.catch(() => {});
  }

  function stagger(group, duration, gap, startDelay) {
    const proms = [];
    group.forEach((el, i) => {
      proms.push(draw(el, jitter(duration, duration * 0.08), startDelay + i * gap));
    });
    return Promise.all(proms);
  }

  function resetInstant() {
    allPaths.forEach(el => {
      el.getAnimations().forEach(a => a.cancel());
      el.style.strokeDashoffset = '1';
    });
    signature.classList.remove('show');
    svg.style.transition = 'none';
    svg.style.opacity = '1';
    void svg.offsetHeight;
  }

  function fadeOut() {
    return new Promise(resolve => {
      svg.style.transition = `opacity 1300ms ${EASE}`;
      requestAnimationFrame(() => { svg.style.opacity = '0'; });
      setTimeout(resolve, 1300);
    });
  }

  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  let token = 0;

  async function runCycle(myToken) {
    resetInstant();

    await stagger(stem, 1500, 0, 0);
    if (myToken !== token) return;

    await stagger(leaf, 720, 170, 60);
    if (myToken !== token) return;

    await stagger(outer, 920, 190, 40);
    if (myToken !== token) return;

    await stagger(mid, 760, 150, 60);
    if (myToken !== token) return;

    await stagger(inner, 620, 130, 40);
    if (myToken !== token) return;

    await stagger(bud, 950, 0, 20);
    if (myToken !== token) return;

    signature.classList.add('show');

    await wait(2000);
    if (myToken !== token) return;

    await fadeOut();
    if (myToken !== token) return;

    await wait(900);
    if (myToken !== token) return;

    runCycle(myToken);
  }

  function startFresh() {
    token += 1;
    const myToken = token;
    runCycle(myToken);
  }

  if (reduceMotion) {
    allPaths.forEach(el => { el.style.strokeDashoffset = '0'; });
    signature.classList.add('show');
    return;
  }

  // start the loop only once the section is actually in view
  if ('IntersectionObserver' in window && section) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startFresh();
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    io.observe(section);
  } else {
    startFresh();
  }
})();

// scroll reveal — fade + rise for section content, staggered per group
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in-view'));
    return;
  }

  // stagger delay based on position among reveal siblings sharing the same parent
  const counts = new Map();
  items.forEach(el => {
    const parent = el.parentElement;
    const i = counts.get(parent) || 0;
    el.style.transitionDelay = (i * 100) + 'ms';
    counts.set(parent, i + 1);
  });

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => io.observe(el));
})();

// mini flower divider — small line-drawing sprig between reviews and contact
(function () {
  const svg = document.getElementById('md-svg');
  if (!svg) return;

  const stem = svg.querySelector('[data-group="stem"]');
  const leaf = svg.querySelector('[data-group="leaf"]');
  const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) return;

  function draw(el, duration, delay) {
    el.animate(
      [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }],
      { duration, delay, easing: EASE, fill: 'forwards' }
    );
  }

  function play() {
    draw(stem, 900, 0);
    draw(leaf, 500, 550);
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          play();
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    io.observe(svg);
  } else {
    play();
  }
})();
