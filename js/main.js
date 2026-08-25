/* ============================================================
   OSHBOARD — landing interactions
   Loaded with `defer`, so the DOM is ready when this runs.
   Three.js (hero background) is loaded before this file.
   ============================================================ */

/* Theme toggle (initial theme is applied inline in <head> to avoid flash) */
(function () {
  var root = document.documentElement, key = 'oshboard-theme';
  var btn = document.getElementById('themeBtn');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem(key, next);
  });
})();

/* Mobile menu */
(function () {
  var burger = document.getElementById('burger'), links = document.getElementById('navLinks');
  if (!burger || !links) return;
  burger.addEventListener('click', function () { links.classList.toggle('open'); });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { links.classList.remove('open'); });
  });
})();

/* Scroll progress bar */
(function () {
  var bar = document.getElementById('progress');
  if (!bar) return;
  addEventListener('scroll', function () {
    var h = document.documentElement, s = h.scrollTop / (h.scrollHeight - h.clientHeight);
    bar.style.width = (s * 100) + '%';
  }, { passive: true });
})();

/* Marquee — duplicate content for a seamless loop */
(function () {
  var mq = document.getElementById('mq');
  if (mq) mq.innerHTML += mq.innerHTML;
})();

/* Floating Telegram button — reveal after scrolling */
(function () {
  var fab = document.getElementById('fab');
  if (!fab) return;
  addEventListener('scroll', function () {
    fab.classList.toggle('show', scrollY > 420);
  }, { passive: true });
})();

/* Lead form — validate and email the lead to the owner */
(function () {
  var f = document.getElementById('leadForm');
  if (!f) return;
  var MAIL = 'oshboard.application@mail.ru'; // запасной канал (mailto), если ничего не сработало
  var API = '/api/lead';                      // бэкенд: сохраняет заявку как резерв
  // Публичный ключ Web3Forms — на бесплатном плане отправка идёт из браузера (это нормально и безопасно).
  var WEB3FORMS_KEY = '029b18fb-4549-46cb-82a8-ef5626d6a85b';

  function field(name) { return f.elements[name]; }
  function showSuccess() {
    f.querySelectorAll('label, button, .lf-note').forEach(function (el) { el.style.display = 'none'; });
    f.querySelector('.lf-ok').hidden = false;
  }
  function mailFallback(subject, body) {
    location.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = field('name').value.trim(),
        phone = field('phone').value.trim(),
        place = field('place').value.trim(),
        type = field('type').value;

    var checks = [
      ['name', name.length > 1],
      ['phone', phone.replace(/\D/g, '').length >= 7],
      ['place', place.length > 1]
    ];
    var ok = true;
    checks.forEach(function (c) {
      var el = field(c[0]);
      if (c[1]) { el.classList.remove('err'); } else { el.classList.add('err'); ok = false; }
    });
    if (!ok) { var bad = f.querySelector('.err'); if (bad) bad.focus(); return; }

    // Когда пришла заявка — местное время (Ташкент/Самарканд, +5),
    // не по часам сервера или посетителя. Формат: 25.08.2026, 20:03
    var когда = new Date().toLocaleString('ru-RU', {
      timeZone: 'Asia/Tashkent',
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    var subject = 'Заявка на демо OSHBOARD';
    var body = 'Имя: ' + name + '\nТелефон: ' + phone + '\nЗаведение: ' + place + '\nТип: ' + type + '\nКогда: ' + когда;

    showSuccess();

    // 1) Письмо на почту через Web3Forms (их бесплатный план работает только из браузера).
    var emailed = fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: subject,
        from_name: 'Сайт OSHBOARD',
        'Имя': name, 'Телефон': phone, 'Заведение': place, 'Тип': type,
        'Когда': когда
      })
    }).then(function (r) { return r.json(); })
      .then(function (d) { if (!d.success) throw new Error(d.message || 'web3forms'); });

    // 2) Резервная копия заявки в бэкенде (не критично, если сервер не запущен).
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, phone: phone, place: place, type: type })
    }).catch(function () {});

    // 3) Если письмо не ушло — открываем почтовый клиент как последний запасной вариант.
    emailed.catch(function () { mailFallback(subject, body); });
  });
})();

/* Subtle cursor-follow background glow (lagged, low-opacity) */
(function () {
  var g = document.getElementById('cursorGlow');
  if (!g || matchMedia('(pointer:coarse)').matches || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  var tx = innerWidth / 2, ty = innerHeight / 2, x = tx, y = ty, on = false;
  addEventListener('pointermove', function (e) {
    tx = e.clientX; ty = e.clientY;
    if (!on) { on = true; g.style.opacity = '1'; }
  }, { passive: true });
  addEventListener('pointerleave', function () { on = false; g.style.opacity = '0'; });
  (function loop() {
    x += (tx - x) * .08; y += (ty - y) * .08;
    g.style.transform = 'translate3d(' + (x - 260) + 'px,' + (y - 260) + 'px,0)';
    requestAnimationFrame(loop);
  })();
})();

/* Animated count-up for stat numbers */
function countUp(el) {
  var end = +el.dataset.count, suf = el.dataset.suffix || '', dur = 1200, t0 = null;
  function step(t) {
    if (!t0) t0 = t;
    var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(end * e) + suf;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* 3D tilt on hero visual — restrained, professional depth */
(function () {
  var v = document.querySelector('.hero-visual');
  if (!v || matchMedia('(pointer:coarse)').matches) return;
  var raf;
  v.addEventListener('pointermove', function (e) {
    var r = v.getBoundingClientRect();
    var px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(function () {
      v.style.transform = 'perspective(1100px) rotateY(' + (px * 6) + 'deg) rotateX(' + (-py * 6) + 'deg)';
    });
  });
  v.addEventListener('pointerleave', function () { v.style.transform = ''; });
})();

/* Live mini-chart in the revenue card — gentle, data-like fluctuation */
(function () {
  var bars = document.querySelectorAll('.fc-1 .mini-bars span');
  if (!bars.length || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  var base = [40, 60, 48, 80, 100, 72];
  setInterval(function () {
    if (document.hidden) return;
    bars.forEach(function (b, i) {
      var h = Math.max(28, Math.min(100, base[i] + (Math.random() * 22 - 11)));
      b.style.height = h + '%';
    });
  }, 1300);
})();

/* Cursor-follow glow on feature cards (uses each card's own ::before) */
(function () {
  document.querySelectorAll('.fcard').forEach(function (c) {
    c.addEventListener('pointermove', function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
})();

/* Universal cursor-follow glow for the other cards (injected overlay) */
(function () {
  var sel = '.pcard, .acard, .step, .plan-card, .gcard, .wcard';
  document.querySelectorAll(sel).forEach(function (c) {
    c.classList.add('glowable');
    var g = document.createElement('span');
    g.className = 'c-glow';
    c.insertBefore(g, c.firstChild);
    c.addEventListener('pointermove', function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
})();

/* FAQ accordion — smooth open/close, one item at a time */
(function () {
  var faqs = [].slice.call(document.querySelectorAll('.faq details'));
  if (!faqs.length) return;
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var EASE = 'cubic-bezier(.22,.61,.36,1)';

  function expand(d) {
    var c = d.querySelector('.a');
    d.dataset.anim = '1';
    d.open = true;
    if (reduce) { d.dataset.anim = ''; return; }
    c.animate([{ height: '0px', opacity: 0 }, { height: c.scrollHeight + 'px', opacity: 1 }], { duration: 340, easing: EASE })
      .onfinish = function () { d.dataset.anim = ''; };
  }
  function collapse(d) {
    var c = d.querySelector('.a');
    if (!d.open) return;
    d.dataset.anim = '1';
    if (reduce) { d.open = false; d.dataset.anim = ''; return; }
    var a = c.animate([{ height: c.scrollHeight + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 280, easing: EASE });
    a.onfinish = function () { d.open = false; d.dataset.anim = ''; };
  }
  faqs.forEach(function (d) {
    d.querySelector('summary').addEventListener('click', function (e) {
      e.preventDefault();
      if (d.dataset.anim === '1') return;
      if (d.open) { collapse(d); }
      else { faqs.forEach(function (o) { if (o !== d && o.open) collapse(o); }); expand(d); }
    });
  });
})();

/* Subtle parallax on the hero aurora */
(function () {
  var a = document.querySelector('.aurora');
  if (!a || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  addEventListener('scroll', function () {
    var y = scrollY;
    if (y < 900) a.style.transform = 'translateY(' + (y * .18) + 'px)';
  }, { passive: true });
})();

/* Reveal / stagger on scroll + trigger counters */
(function () {
  var targets = document.querySelectorAll('.reveal, .stagger');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (e) { e.classList.add('in'); });
    document.querySelectorAll('[data-count]').forEach(countUp);
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (x) {
      if (!x.isIntersecting) return;
      x.target.classList.add('in');
      if (x.target.querySelectorAll) x.target.querySelectorAll('[data-count]').forEach(countUp);
      if (x.target.matches('[data-count]')) countUp(x.target);
      io.unobserve(x.target);
    });
  }, { threshold: .15 });
  targets.forEach(function (e) { io.observe(e); });
})();

/* Count this visit for the admin stats (fire-and-forget; ignored without a server) */
(function () {
  try { fetch('/api/track', { method: 'POST' }).catch(function () {}); } catch (e) {}
})();

/* Editable content from the backend: news + contact settings.
   Gracefully does nothing if the API isn't available (opened without server). */
(function () {
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  fetch('/api/content').then(function (r) { return r.json(); }).then(function (d) {
    if (!d || !d.ok) return;

    // --- contact settings → footer + floating button ---
    var s = d.settings || {};

    /*
      ИЗВЕСТНЫЕ ЗАГЛУШКИ НЕ ПОКАЗЫВАЕМ.

      В настройках сайта могли остаться выдуманные контакты — их сеяли при
      создании: +998 90 000-00-00, hello@oshboard.uz, t.me/oshboard, «#».
      Показать клиенту фальшивый номер хуже, чем не показать ничего: по нему
      позвонят в никуда. Пока владелец не вписал настоящие, гасим заглушки,
      чтобы они не всплыли ни из старых настроек, ни откуда-то ещё.
    */
    var ЗАГЛУШКИ = ['+998 90 000-00-00', '+998900000000', 'hello@oshboard.uz',
                    'https://t.me/oshboard', 't.me/oshboard', '#', ''];
    ['phone', 'email', 'telegram', 'instagram'].forEach(function (k) {
      if (ЗАГЛУШКИ.indexOf((s[k] || '').trim()) !== -1) s[k] = '';
    });

    // logo (text + optional image) in nav and footer
    if (s.logoText) {
      document.querySelectorAll('.logo').forEach(function (logo) {
        var textNode = null;
        logo.childNodes.forEach(function (n) { if (n.nodeType === 3 && n.textContent.trim()) textNode = n; });
        if (textNode) textNode.textContent = s.logoText;
      });
    }
    if (s.logoImage) {
      document.querySelectorAll('.logo .mark').forEach(function (m) {
        m.innerHTML = '<img src="' + esc(s.logoImage) + '" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">';
      });
    }
    if (s.phone) {
      var ph = document.querySelector('.foot-col a[href^="tel:"]');
      if (ph) { ph.textContent = s.phone; ph.href = 'tel:' + s.phone.replace(/[^\d+]/g, ''); }
    }
    if (s.email) {
      var em = document.querySelector('.foot-col a[href^="mailto:"]');
      if (em) { em.textContent = s.email; em.href = 'mailto:' + s.email; }
    }
    if (s.telegram) {
      var fab = document.getElementById('fab'); if (fab) fab.href = s.telegram;
    }
    document.querySelectorAll('.foot-col a').forEach(function (a) {
      var t = a.textContent.trim();
      if (t === 'Telegram' && s.telegram) a.href = s.telegram;
      if (t === 'Instagram' && s.instagram) a.href = s.instagram;
    });

    // --- news ---
    var news = d.news || [];
    var sec = document.getElementById('news'), grid = document.getElementById('newsGrid');
    if (news.length && sec && grid) {
      grid.innerHTML = '';
      news.forEach(function (n) {
        var card = document.createElement('article');
        card.className = 'news-card reveal';
        card.innerHTML =
          (n.image ? '<div class="ph"><img src="' + esc(n.image) + '" alt="" loading="lazy"></div>' : '') +
          '<div class="nbody"><span class="ndate">' + esc(n.date) + '</span>' +
          '<h3>' + esc(n.title) + '</h3>' +
          (n.body ? '<p>' + esc(n.body) + '</p>' : '') + '</div>';
        grid.appendChild(card);
      });
      sec.hidden = false;
      // проявляем карточки со сдвигом (observer их не видит — добавлены динамически)
      requestAnimationFrame(function () {
        grid.querySelectorAll('.reveal').forEach(function (c, i) {
          setTimeout(function () { c.classList.add('in'); }, i * 90);
        });
      });
    }
  }).catch(function () { /* сервер не запущен — не критично */ });
})();

/* ------------------------------------------------------------
   Hero 3D — a rotating crystal inside a drifting data-particle
   network. Requires Three.js (loaded before this file).
   ------------------------------------------------------------ */
(function () {
  var cv = document.getElementById('hero3d');
  if (!cv || typeof THREE === 'undefined') return;
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var host = cv.parentElement;
  var W = host.clientWidth, H = host.clientHeight;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
  camera.position.z = 15;

  var renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(W, H, false);

  function accent() {
    return getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#F97316';
  }
  var col = new THREE.Color(accent());

  // central crystal (the "model")
  var group = new THREE.Group(); scene.add(group);
  var geo = new THREE.IcosahedronGeometry(3.1, 0);
  var solid = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
    color: col, metalness: .55, roughness: .25, flatShading: true, transparent: true, opacity: .28
  }));
  var wire = new THREE.LineSegments(new THREE.EdgesGeometry(geo),
    new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: .55 }));
  group.add(solid); group.add(wire);
  scene.add(new THREE.AmbientLight(0xffffff, .6));
  var key = new THREE.PointLight(col.getHex(), 1.4, 60); key.position.set(8, 6, 12); scene.add(key);
  var rim = new THREE.DirectionalLight(0xffffff, .4); rim.position.set(-6, 4, 3); scene.add(rim);

  // particle data-network
  var N = window.innerWidth < 760 ? 60 : 110, pos = new Float32Array(N * 3), vel = [];
  for (var i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() - .5) * 26;
    pos[i * 3 + 1] = (Math.random() - .5) * 16;
    pos[i * 3 + 2] = (Math.random() - .5) * 14;
    vel.push({ x: (Math.random() - .5) * .006, y: (Math.random() - .5) * .006, z: (Math.random() - .5) * .006 });
  }
  var pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  var points = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: col, size: .13, transparent: true, opacity: .9, sizeAttenuation: true
  }));
  scene.add(points);
  var lineGeo = new THREE.BufferGeometry();
  var lineMat = new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: .16 });
  var lines = new THREE.LineSegments(lineGeo, lineMat); scene.add(lines);
  var linePos = new Float32Array(N * N * 3);
  var lineAttr = new THREE.BufferAttribute(linePos, 3); lineAttr.setUsage(THREE.DynamicDrawUsage);
  lineGeo.setAttribute('position', lineAttr);

  // pointer parallax
  var mx = 0, my = 0, tmx = 0, tmy = 0;
  host.addEventListener('pointermove', function (e) {
    var r = host.getBoundingClientRect();
    tmx = (e.clientX - r.left) / r.width - .5;
    tmy = (e.clientY - r.top) / r.height - .5;
  }, { passive: true });

  function rebuildLines() {
    var p = pGeo.attributes.position.array, k = 0, MAX = 4.6;
    for (var a = 0; a < N; a++) for (var b = a + 1; b < N; b++) {
      var dx = p[a * 3] - p[b * 3], dy = p[a * 3 + 1] - p[b * 3 + 1], dz = p[a * 3 + 2] - p[b * 3 + 2];
      if (dx * dx + dy * dy + dz * dz < MAX * MAX) {
        linePos[k++] = p[a * 3]; linePos[k++] = p[a * 3 + 1]; linePos[k++] = p[a * 3 + 2];
        linePos[k++] = p[b * 3]; linePos[k++] = p[b * 3 + 1]; linePos[k++] = p[b * 3 + 2];
      }
    }
    lineAttr.needsUpdate = true;
    lineGeo.setDrawRange(0, k / 3);
  }

  function resize() {
    W = host.clientWidth; H = host.clientHeight;
    camera.aspect = W / H; camera.updateProjectionMatrix();
    renderer.setSize(W, H, false);
  }
  addEventListener('resize', resize, { passive: true });

  // keep colours in sync with the theme toggle
  new MutationObserver(function () {
    var c = new THREE.Color(accent());
    solid.material.color = c; wire.material.color = c; points.material.color = c;
    lineMat.color = c; key.color = c;
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  function frame() {
    mx += (tmx - mx) * .05; my += (tmy - my) * .05;
    group.rotation.y += .0026; group.rotation.x += .0011;
    group.rotation.y += mx * .02; group.rotation.x += my * .02;
    points.rotation.y += .0004;
    var p = pGeo.attributes.position.array;
    for (var i = 0; i < N; i++) {
      p[i * 3] += vel[i].x; p[i * 3 + 1] += vel[i].y; p[i * 3 + 2] += vel[i].z;
      if (Math.abs(p[i * 3]) > 13) vel[i].x *= -1;
      if (Math.abs(p[i * 3 + 1]) > 8) vel[i].y *= -1;
      if (Math.abs(p[i * 3 + 2]) > 7) vel[i].z *= -1;
    }
    pGeo.attributes.position.needsUpdate = true;
    rebuildLines();
    camera.position.x += (mx * 4 - camera.position.x) * .05;
    camera.position.y += (-my * 3 - camera.position.y) * .05;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    if (!reduce) requestAnimationFrame(frame);
  }
  rebuildLines();
  frame();
  if (reduce) renderer.render(scene, camera);
})();
