/* ============================================================
   «ОДИН ДЕНЬ С OSHBOARD» — сцена, которая идёт вместе с прокруткой.

   Раздел в пять экранов высотой, а сама сцена «прилипает» и стоит на
   месте. По тому, сколько уже прокручено, считаем долю дня от 0 до 1:
   от неё зависят глава (утро → ночь), место солнца на небе, наклон окна
   с программой и сдвиг города.

   Тем, кто просил меньше движения, и старым браузерам ничего не включаем:
   раздел остаётся обычными пятью блоками текста — всё читается и так.
   ============================================================ */
(function () {
  'use strict';
  var s = document.getElementById('day');
  if (!s) return;
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  if (!window.CSS || !CSS.supports || !CSS.supports('position', 'sticky')) return;

  var steps = [].slice.call(s.querySelectorAll('.st-step'));
  var screens = [].slice.call(s.querySelectorAll('.st-screen'));
  var dots = [].slice.call(s.querySelectorAll('.story-dots li'));
  var N = steps.length;
  if (!N) return;

  s.classList.add('story-live');
  var cur = -1, ticking = false;

  function show(i) {
    if (i === cur) return;
    cur = i;
    s.setAttribute('data-step', String(i));
    steps.forEach(function (el, k) { el.classList.toggle('on', k === i); el.classList.toggle('was', k < i); });
    screens.forEach(function (el) { el.classList.toggle('on', Number(el.getAttribute('data-step')) === i); });
    dots.forEach(function (el, k) { el.classList.toggle('on', k === i); });
  }

  function frame() {
    ticking = false;
    var r = s.getBoundingClientRect();
    var total = r.height - window.innerHeight;
    var p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
    s.style.setProperty('--p', p.toFixed(4));
    // Солнце идёт по дуге слева направо: встаёт у горизонта, в зените к середине, садится справа
    s.style.setProperty('--sx', (8 + 84 * p).toFixed(2) + '%');
    s.style.setProperty('--sy', (76 - 54 * Math.sin(Math.PI * p)).toFixed(2) + '%');
    show(Math.min(N - 1, Math.floor(p * N * 0.9999)));
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  // Вкладку открыли не сверху (обновление посреди страницы) — сразу ставим нужную главу
  frame();

  // Точки справа: нажал — доехали до главы
  dots.forEach(function (el, k) {
    el.style.cursor = 'pointer';
    el.addEventListener('click', function () {
      var top = s.getBoundingClientRect().top + window.pageYOffset;
      var total = s.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + total * ((k + 0.5) / N), behavior: 'smooth' });
    });
  });
})();
