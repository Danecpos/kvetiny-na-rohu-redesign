// register GSAP plugins (loaded via CDN before this file)
if (window.gsap) {
  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if (window.DrawSVGPlugin) gsap.registerPlugin(DrawSVGPlugin);
}

const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

// rose-feature — line-drawing rose showcase (homepage only), powered by GSAP DrawSVGPlugin
(function () {
  const svg = document.getElementById('rf-svg');
  if (!svg || !window.gsap || !window.DrawSVGPlugin) return;

  const signature = document.getElementById('rf-signature');
  const section = document.querySelector('.rose-feature');

  const stem  = svg.querySelectorAll('[data-group="stem"]');
  const leaf  = svg.querySelectorAll('[data-group="leaf"]');
  const outer = svg.querySelectorAll('[data-group="outer"]');
  const mid   = svg.querySelectorAll('[data-group="mid"]');
  const inner = svg.querySelectorAll('[data-group="inner"]');
  const bud   = svg.querySelectorAll('[data-group="bud"]');
  const allPaths = svg.querySelectorAll('path');
  const EASE = 'power2.inOut';

  if (reduceMotion) {
    gsap.set(allPaths, { drawSVG: '100%' });
    signature.classList.add('show');
    return;
  }

  gsap.set(allPaths, { drawSVG: '0%' });

  function runCycle() {
    gsap.set(allPaths, { drawSVG: '0%' });
    gsap.set(svg, { opacity: 1 });
    signature.classList.remove('show');

    const tl = gsap.timeline({
      onComplete() {
        signature.classList.add('show');
        gsap.delayedCall(2, () => {
          gsap.to(svg, {
            opacity: 0,
            duration: 1.3,
            ease: 'power1.inOut',
            onComplete() {
              gsap.delayedCall(0.9, runCycle);
            }
          });
        });
      }
    });

    tl.to(stem,  { drawSVG: '100%', duration: 1.5,  ease: EASE })
      .to(leaf,  { drawSVG: '100%', duration: 0.72, ease: EASE, stagger: 0.17 }, '+=0.06')
      .to(outer, { drawSVG: '100%', duration: 0.92, ease: EASE, stagger: 0.19 }, '+=0.04')
      .to(mid,   { drawSVG: '100%', duration: 0.76, ease: EASE, stagger: 0.15 }, '+=0.06')
      .to(inner, { drawSVG: '100%', duration: 0.62, ease: EASE, stagger: 0.13 }, '+=0.04')
      .to(bud,   { drawSVG: '100%', duration: 0.95, ease: EASE }, '+=0.02');
  }

  if (window.ScrollTrigger && section) {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 65%',
      once: true,
      onEnter: runCycle
    });
  } else {
    runCycle();
  }
})();

// scroll reveal — fade + rise for section content, staggered per group
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

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

// star pop-in — rating stars bounce in one by one on scroll, powered by GSAP
(function () {
  const starsEls = document.querySelectorAll('.stars');
  if (!starsEls.length) return;

  starsEls.forEach(el => {
    const chars = el.textContent.split('');
    el.textContent = '';
    chars.forEach(ch => {
      const span = document.createElement('span');
      span.textContent = ch;
      el.appendChild(span);
    });
  });

  if (!window.gsap) return;

  if (reduceMotion) return; // spans already show at full opacity/scale by default

  starsEls.forEach(el => {
    const spans = el.querySelectorAll('span');
    gsap.set(spans, { opacity: 0, scale: 0.3, rotate: -15, transformOrigin: '50% 50%' });

    const play = () => {
      gsap.to(spans, {
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration: 0.5,
        ease: 'back.out(2.4)',
        stagger: 0.09
      });
    };

    if (window.ScrollTrigger) {
      ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: play });
    } else if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { play(); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.6 });
      io.observe(el);
    } else {
      play();
    }
  });
})();

// mini flower divider — small line-drawing sprig between reviews and contact, GSAP DrawSVGPlugin
(function () {
  const svg = document.getElementById('md-svg');
  if (!svg || !window.gsap || !window.DrawSVGPlugin) return;

  const stem = svg.querySelector('[data-group="stem"]');
  const leaf = svg.querySelector('[data-group="leaf"]');

  if (reduceMotion) {
    gsap.set([stem, leaf], { drawSVG: '100%' });
    return;
  }

  gsap.set([stem, leaf], { drawSVG: '0%' });

  function play() {
    gsap.timeline()
      .to(stem, { drawSVG: '100%', duration: 0.9, ease: 'power2.inOut' })
      .to(leaf, { drawSVG: '100%', duration: 0.5, ease: 'power2.inOut' }, '-=0.35');
  }

  if (window.ScrollTrigger) {
    ScrollTrigger.create({ trigger: svg, start: 'top 90%', once: true, onEnter: play });
  } else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { play(); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    io.observe(svg);
  } else {
    play();
  }
})();
