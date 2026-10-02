/* ============================================================
   OSHBOARD — landing interactions
   Loaded with `defer`, so the DOM is ready when this runs.
   Без внешних библиотек.
   ============================================================ */

/* Theme toggle (initial theme is applied inline in <head> to avoid flash) */
(function () {
  var root = document.documentElement, key = 'oshboard-theme';
  var btn = document.getElementById('themeBtn');
  if (!btn) return;
  function toggle() {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem(key, next); } catch (e) {}
  }
  btn.addEventListener('click', toggle);
  // на узком телефоне кнопка темы живёт в меню
  var mt = document.getElementById('menuTheme');
  if (mt) mt.addEventListener('click', toggle);
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

/* Виды дела — вкладки (ресторан / магазин / гостиница / клининг).
   Стрелками влево-вправо тоже переключаются, как положено вкладкам. */
(function () {
  var tabs = [].slice.call(document.querySelectorAll('.tabs [role="tab"]'));
  if (!tabs.length) return;
  function show(t, focus) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.classList.toggle('on', on);
      x.setAttribute('aria-selected', on ? 'true' : 'false');
      x.tabIndex = on ? 0 : -1;
      var p = document.getElementById(x.getAttribute('aria-controls'));
      if (p) {
        p.hidden = !on;
        // панели не исчезают, а прячутся (держат высоту) — анимацию появления запускаем заново сами
        p.classList.remove('play');
        if (on) { p.style.animation = 'none'; void p.offsetHeight; p.style.animation = ''; p.classList.add('play'); }
      }
    });
    if (focus) t.focus();
  }
  // «Новое: программа для гостиниц» сразу открывает нужную вкладку
  document.querySelectorAll('[data-open-tab]').forEach(function (a) {
    a.addEventListener('click', function () {
      var t = document.getElementById(a.getAttribute('data-open-tab'));
      if (t) show(t);
    });
  });
  // первая панель тоже собирается анимацией — когда до неё долистали
  var first = document.querySelector('.kind:not([hidden])');
  if (first && 'IntersectionObserver' in window) {
    var fo = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { first.classList.add('play'); fo.disconnect(); }
    }, { threshold: .2 });
    fo.observe(first);
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { show(t); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      show(tabs[(i + d + tabs.length) % tabs.length], true);
    });
  });
})();

/* «Выручка по часам» в окне программы — столбики слегка дышат, как живые */
(function () {
  var bars = document.querySelectorAll('.hm-bars span');
  if (!bars.length || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  var base = [].map.call(bars, function (b) { return parseFloat(b.style.height) || 50; });
  setInterval(function () {
    if (document.hidden) return;
    bars.forEach(function (b, i) {
      var h = Math.max(14, Math.min(100, base[i] + (Math.random() * 18 - 9)));
      b.style.height = h + '%';
    });
  }, 1500);
})();

/* Cursor-follow glow on feature cards (uses each card's own ::before) */
(function () {
  document.querySelectorAll('.fcard, .tile').forEach(function (c) {
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


/* ===== Движение ===== */
var REDUCE = matchMedia('(prefers-reduced-motion:reduce)').matches;
var FINE = matchMedia('(pointer:fine)').matches;

/* Окно программы на первом экране выпрямляется по мере прокрутки,
   фон отстаёт, плашки чуть следуют за мышью. */
(function () {
  var stage = document.querySelector('.hero-stage'), bg = document.querySelector('.hero-bg'), hero = document.querySelector('.hero');
  if (!stage) return;
  if (REDUCE) { stage.style.setProperty('--p', 1); return; }
  var ticking = false;
  function upd() {
    ticking = false;
    var vh = innerHeight, top = stage.getBoundingClientRect().top;
    var p = Math.max(0, Math.min(1, 1 - (top - vh * .2) / (vh * .55)));
    stage.style.setProperty('--p', p.toFixed(3));
    if (bg && scrollY < vh * 1.5) bg.style.setProperty('--hy', (scrollY * .35).toFixed(1) + 'px');
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
  addEventListener('resize', upd);
  upd();
  if (!FINE || !hero) return;
  var chips = stage.querySelectorAll('.chip');
  hero.addEventListener('pointermove', function (e) {
    var dx = e.clientX / innerWidth - .5, dy = e.clientY / innerHeight - .5;
    chips.forEach(function (c, i) {
      var k = i ? -1 : 1;
      c.style.setProperty('--cx', (dx * 26 * k).toFixed(1) + 'px');
      c.style.setProperty('--cy', (dy * 18 * k).toFixed(1) + 'px');
    });
  });
})();

/* Карточки слегка наклоняются за мышью — как настоящая карточка в руке. */
(function () {
  if (REDUCE || !FINE) return;
  document.querySelectorAll('.pcard, .acard, .plan-card, .tile, .tab').forEach(function (c) {
    var raf = 0;
    c.classList.add('tilt');
    c.addEventListener('pointermove', function (e) {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        var r = c.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        var max = r.width > 500 ? 3 : 7;   // широкие плитки качаются меньше
        c.classList.add('tilting');
        c.style.transform = 'perspective(900px) rotateX(' + (-y * max).toFixed(2) + 'deg) rotateY(' + (x * max).toFixed(2) + 'deg) translateY(-4px)';
      });
    });
    c.addEventListener('pointerleave', function () {
      cancelAnimationFrame(raf);
      c.classList.remove('tilting');
      c.style.transform = '';
    });
  });
})();

/* Главные кнопки «притягиваются» к курсору. */
(function () {
  if (REDUCE || !FINE) return;
  document.querySelectorAll('.btn-lg, .nav-cta').forEach(function (b) {
    b.classList.add('magnet');
    b.addEventListener('pointermove', function (e) {
      var r = b.getBoundingClientRect();
      b.style.setProperty('--bx', ((e.clientX - r.left - r.width / 2) * .22).toFixed(1) + 'px');
      b.style.setProperty('--by', ((e.clientY - r.top - r.height / 2) * .3).toFixed(1) + 'px');
    });
    b.addEventListener('pointerleave', function () { b.style.setProperty('--bx', '0px'); b.style.setProperty('--by', '0px'); });
  });
})();

/* Зал ресторана живёт: столы сами меняют состояние — пришли гости, попросили счёт, ушли. */
(function () {
  var hall = document.querySelector('.hall');
  if (!hall || REDUCE) return;
  var tbls = [].slice.call(hall.querySelectorAll('.tbl'));
  var next = { 's-free': 's-busy', 's-busy': 's-bill', 's-bill': 's-free', 's-res': 's-busy' };
  setInterval(function () {
    if (document.hidden || hall.closest('.kind').hidden) return;
    var r = hall.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    var t = tbls[Math.floor(Math.random() * tbls.length)];
    var cur = Object.keys(next).filter(function (k) { return t.classList.contains(k); })[0] || 's-free';
    t.classList.remove(cur, 'flash');
    t.classList.add(next[cur]);
    void t.offsetWidth; t.classList.add('flash');
  }, 2200);
})();
