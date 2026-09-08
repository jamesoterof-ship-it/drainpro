/* ============================================================
   MOTORS — efectos premium (corre DESPUÉS de app.js)
   GSAP + SplitText (título), partículas de energía en el hero,
   tilt 3D en tarjetas, confetti al confirmar el pedido.
   Respeta prefers-reduced-motion.
   ============================================================ */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    if (reduce) return;

    /* ---- 1) Título del hero letra por letra (GSAP + SplitText) ---- */
    try {
      if (window.gsap && window.SplitText) {
        gsap.registerPlugin(SplitText);
        var h1 = document.getElementById('heroTitle');
        if (h1 && h1.textContent.trim()) {
          var sp = new SplitText(h1, { type: 'words,chars' });
          gsap.set(h1, { opacity: 1 });
          gsap.from(sp.chars, { yPercent: 130, opacity: 0, stagger: 0.014, duration: 0.6, ease: 'back.out(1.6)', delay: 0.15 });
        }
        gsap.from('.hero .kicker', { y: -16, opacity: 0, duration: .6, delay: .05 });
        var lead = document.querySelector('.hero .lead');
        if (lead) gsap.from(lead, { y: 22, opacity: 0, duration: .6, delay: .75, ease: 'power3.out' });
        var minis = document.querySelectorAll('.hero__mini .hm');
        if (minis.length) gsap.from(minis, { y: 18, opacity: 0, stagger: .1, duration: .5, delay: .9, ease: 'power3.out' });
      }
    } catch (e) {}

    /* ---- 2) Partículas de energía sobre el hero (canvas liviano) ---- */
    heroParticles();

    /* ---- 3) Tilt 3D en tarjetas de beneficios + galería ---- */
    try {
      if (window.VanillaTilt) {
        var els = document.querySelectorAll('.card, .gallery img, .statgrid .s');
        if (els.length) VanillaTilt.init(els, { max: 7, speed: 500, glare: true, 'max-glare': 0.18, scale: 1.02 });
      }
    } catch (e) {}

    /* ---- 4) Confetti cuando aparece el mensaje de pedido OK ---- */
    try {
      var ok = document.getElementById('okMsg');
      if (ok && window.confetti) {
        new MutationObserver(function () {
          var vis = getComputedStyle(ok).display !== 'none' && ok.offsetParent !== null;
          if (vis && !ok._party) { ok._party = true; burst(); }
        }).observe(ok, { attributes: true, attributeFilter: ['style', 'class'] });
      }
    } catch (e) {}
  }

  function burst() {
    var end = Date.now() + 900;
    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 60, origin: { x: 0 }, colors: ['#1565d8', '#22a7e6', '#00d6a8', '#ffffff'] });
      confetti({ particleCount: 5, angle: 120, spread: 60, origin: { x: 1 }, colors: ['#1565d8', '#22a7e6', '#00d6a8', '#ffffff'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }

  function heroParticles() {
    var cv = document.getElementById('heroFx'); if (!cv) return;
    var ctx = cv.getContext('2d'), W, H, dpr = Math.min(window.devicePixelRatio || 1, 2), P = [], on = true, raf = 0;
    function size() {
      var r = cv.getBoundingClientRect(); W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size(); window.addEventListener('resize', size);
    var N = Math.min(46, Math.round(W / 9));
    for (var i = 0; i < N; i++) P.push(mk());
    function mk() { return { x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.9 + .6, vy: -(Math.random() * .5 + .15), vx: (Math.random() - .5) * .25, a: Math.random() * .5 + .3, tw: Math.random() * 6.28, ts: Math.random() * .05 + .025, big: Math.random() < .18 }; }
    var fr = 0;
    function loop() {
      if (!on) return;
      fr++;
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      for (var a = 0; a < P.length; a++) for (var b = a + 1; b < P.length; b++) {
        var dx = P[a].x - P[b].x, dy = P[a].y - P[b].y, d = dx * dx + dy * dy;
        if (d < 5200) { ctx.strokeStyle = 'rgba(90,180,255,' + (0.1 * (1 - d / 5200)) + ')'; ctx.beginPath(); ctx.moveTo(P[a].x, P[a].y); ctx.lineTo(P[b].x, P[b].y); ctx.stroke(); }
      }
      for (var i = 0; i < P.length; i++) {
        var p = P[i]; p.y += p.vy; p.x += p.vx;
        if (p.y < -6) { p.y = H + 6; p.x = Math.random() * W; }
        var tw = 0.45 + 0.55 * Math.abs(Math.sin(fr * p.ts + p.tw));  // titileo (destello)
        var al = p.a * tw;
        ctx.shadowColor = 'rgba(120,205,255,.9)'; ctx.shadowBlur = (p.big ? 10 : 5) * tw;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (p.big ? 1.25 : 1), 0, 6.2832);
        ctx.fillStyle = 'rgba(180,225,255,' + al + ')'; ctx.fill();
        if (p.big && tw > .85) {  // glint en cruz cuando brilla fuerte
          ctx.strokeStyle = 'rgba(160,220,255,' + (al * .8) + ')'; ctx.beginPath();
          var g = p.r * 4 * tw;
          ctx.moveTo(p.x - g, p.y); ctx.lineTo(p.x + g, p.y); ctx.moveTo(p.x, p.y - g); ctx.lineTo(p.x, p.y + g); ctx.stroke();
        }
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(loop);
    }
    loop();
    // pausa cuando el hero sale de vista o la pestaña se oculta (ahorra batería)
    try {
      new IntersectionObserver(function (e) {
        var vis = e[0].isIntersecting;
        if (vis && !on) { on = true; loop(); }
        else if (!vis && on) { on = false; cancelAnimationFrame(raf); }
      }, { threshold: 0.02 }).observe(cv);
    } catch (e) {}
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { on = false; cancelAnimationFrame(raf); }
      else if (!on) { on = true; loop(); }
    });
  }

  /* arranca tras app.js (que llena los textos en DOMContentLoaded) */
  if (document.readyState === 'complete') setTimeout(init, 60);
  else window.addEventListener('load', function () { setTimeout(init, 60); });
})();
