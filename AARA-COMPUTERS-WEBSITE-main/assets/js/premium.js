/* AARA Computers – premium layer: 3D skill-globe, scroll progress, card glow. No external libraries. */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll progress bar
  var bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.appendChild(bar);
  var ticking = false;
  addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var h = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
      ticking = false;
    });
  }, { passive: true });

  // Cursor-follow glow on cards
  document.addEventListener('pointermove', function (e) {
    var c = e.target.closest && e.target.closest('.course-card,.service-card,.feature-card,.stat-premium-card,.award-card,.a3d-podium-wrap,.w3d-card');
    if (!c) return;
    var r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  // 3D skill-network globe (home hero only)
  var hero = document.querySelector('.hero-section');
  var inner = hero && !hero.classList.contains('hero-section');
  if (!hero) return;
  var cv = document.createElement('canvas');
  cv.id = 'hero3d';
  cv.setAttribute('aria-hidden', 'true');
  hero.insertBefore(cv, hero.firstChild);
  var ctx = cv.getContext('2d');
  if (!ctx) return;
  if (!inner) document.body.classList.add('has-3d');

  var small = innerWidth < 700, N = small ? 64 : 130, pts = [], i;
  var ga = Math.PI * (3 - Math.sqrt(5));
  for (i = 0; i < N; i++) {                       // Fibonacci sphere
    var y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), t = ga * i;
    pts.push({ x: Math.cos(t) * r, y: y, z: Math.sin(t) * r, hot: i % 13 === 0 });
  }
  var W, H, dpr, cx, cy, R, rotY = 0, tx = 0, ty = 0, mx = 0, my = 0, running = true;
  var D = 3.2; // Camera distance for natural 3D depth without extreme front distortion
  var s_max = D / (D - 1); // 1.4545

  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = hero.clientWidth; H = hero.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var wide = W >= 993;
    cx = wide ? W * (inner ? 0.82 : 0.73) : W / 2;
    cy = wide ? Math.max(H * 0.53, 310) : H * 0.62;

    // Anchor to orbit center if available for exact alignment
    var oc = hero.querySelector('.course-orbit-container') || hero.querySelector('.orbit-center');
    if (oc && wide) {
      var hb = hero.getBoundingClientRect();
      var ob = oc.getBoundingClientRect();
      if (ob.width > 0 && ob.height > 0) {
        var orbitCy = (ob.top + ob.height / 2) - hb.top;
        if (orbitCy > 200) cy = orbitCy;
        var orbitCx = (ob.left + ob.width / 2) - hb.left;
        if (orbitCx > 300) cx = orbitCx;
      }
    }

    // Keep globe full and majestic like the original while strictly ensuring the top never overlaps (at least 28px clearance)
    var maxSafeR = (cy - 28) / s_max;
    R = Math.min(W * (wide ? (inner ? 0.13 : 0.22) : 0.42), H * (inner ? 0.46 : 0.4), maxSafeR);
  }
  size();
  addEventListener('resize', size);
  hero.addEventListener('pointermove', function (e) {
    var b = hero.getBoundingClientRect();
    mx = (e.clientX - b.left) / b.width - 0.5;
    my = (e.clientY - b.top) / b.height - 0.5;
  }, { passive: true });

  function frame() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    tx += (my * 0.6 - tx) * 0.05; ty += (mx * 0.9 - ty) * 0.05;
    if (!reduce) rotY += 0.0034;
    var a = rotY + ty, cosA = Math.cos(a), sinA = Math.sin(a), cosB = Math.cos(tx), sinB = Math.sin(tx);
    var P = pts.map(function (p) {
      var x = p.x * cosA + p.z * sinA, z = -p.x * sinA + p.z * cosA;
      var y2 = p.y * cosB - z * sinB, z2 = p.y * sinB + z * cosB, s = D / (D - z2);
      return { x: cx + x * R * s, y: cy + y2 * R * s, z: z2, s: s, hot: p.hot, ox: x, oy: y2 };
    });
    ctx.lineWidth = 0.8;
    for (var m = 0; m < N; m++) for (var n = m + 1; n < N; n++) {
      var dx = P[m].ox - P[n].ox, dy = P[m].oy - P[n].oy, dz = P[m].z - P[n].z, d = dx * dx + dy * dy + dz * dz;
      if (d < (small ? 0.62 : 0.34)) {
        var al = (1 - d / 0.62) * 0.35 * ((P[m].z + P[n].z) / 2 + 1.3) / 2.3;
        ctx.strokeStyle = 'rgba(77,163,255,' + Math.max(al, 0.02) + ')';
        ctx.beginPath(); ctx.moveTo(P[m].x, P[m].y); ctx.lineTo(P[n].x, P[n].y); ctx.stroke();
      }
    }
    P.sort(function (p, q) { return p.z - q.z; }).forEach(function (p) {
      var depth = (p.z + 1) / 2, rad = (p.hot ? 3.6 : 1.7) * p.s;
      ctx.beginPath(); ctx.arc(p.x, p.y, rad, 0, 6.2832);
      ctx.fillStyle = p.hot ? 'rgba(255,176,32,' + (0.45 + depth * 0.55) + ')' : 'rgba(150,205,255,' + (0.25 + depth * 0.6) + ')';
      if (p.hot) { ctx.shadowColor = '#FFB020'; ctx.shadowBlur = 14; } else ctx.shadowBlur = 0;
      ctx.fill();
    });
    ctx.shadowBlur = 0;
    // tilt the course orbit with the pointer for depth
    var oc = hero.querySelector('.course-orbit-container');
    if (oc && W >= 993) { oc.style.setProperty('--rx', (-my * 8).toFixed(2) + 'deg'); oc.style.setProperty('--ry', (mx * 10).toFixed(2) + 'deg'); }
    requestAnimationFrame(frame);
  }
  function setRun(v) { if (v && !running) { running = true; frame(); } else running = v; }
  new IntersectionObserver(function (e) { setRun(e[0].isIntersecting && !document.hidden); }).observe(hero);
  document.addEventListener('visibilitychange', function () { setRun(!document.hidden); });
  frame();
})();

// ===== v2: floating 3D shapes, tilt, ticker, 3D photo ring =====
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover:hover)').matches;
  function mk(h) { var d = document.createElement('div'); d.innerHTML = h; return d.firstElementChild; }

  // 3D pointer tilt on more elements
  if (fine && !reduce) {
    document.querySelectorAll('.gallery-item,.gp-item,.award-card,.mini-stat,.testimonial-card-premium,.faq-item,.stat-premium-card,.success-img-main,.intro-image-wrap,.w3d-card').forEach(function (el) {
      el.classList.add('tilt-me');
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = 'perspective(900px) rotateY(' + x * 9 + 'deg) rotateX(' + -y * 9 + 'deg) translateZ(6px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  // course ticker before the CTA / footer
  var items = ['Office Automation', 'Tally Prime with GST', 'Digital Marketing', 'Web Development', 'Python', 'Java', 'C & C++', 'DTP Designing', 'CCTV Installation', 'Hardware & Networking', 'AMC Services', 'Laptop & Desktop Sales', 'Placement Guidance'];
  var tk = mk('<div class="ticker" aria-label="Courses and services"><div class="track">' + items.concat(items).map(function (t) { return '<span>' + t.replace(/&/g, '&amp;') + '</span>'; }).join('') + '</div></div>');
  var anchor = document.querySelector('.contact-cta') || document.querySelector('footer');
  if (anchor) anchor.parentNode.insertBefore(tk, anchor);

  // 3D photo ring statically defined in HTML
})();
