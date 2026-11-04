/**
 * СБОРКА СТАТИЧЕСКОЙ ВЕРСИИ САЙТА — для «Static Site» на Render.
 *
 * Зачем. Сайт стоял на бесплатном веб-сервисе Render, а он засыпает без
 * посетителей: первый человек с рекламы ждал ~22 секунды. Статический сайт
 * не засыпает, отдаётся мгновенно и не тратит бесплатные часы аккаунта.
 *
 * Что делает:
 *   1. копирует в dist/ ТОЛЬКО то, что нужно странице: index.html, css, js,
 *      assets. Папки server/ (там заявки клиентов с телефонами), admin/,
 *      node_modules/ сюда не попадают — иначе их было бы видно в интернете;
 *   2. забирает с живого сервера текущие контакты, новости и правки текстов
 *      (/api/content) и кладёт рядом со страницей — они видны сразу;
 *   3. подсказывает странице, что она статическая: заявки и счётчик визитов
 *      шлются на старый сервер (он примет их, когда проснётся, а письмо
 *      владельцу уходит через Web3Forms сразу).
 *
 * Запуск: node scripts/build-static.js  (Render делает это сам при выкладке)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const LIVE = process.env.LANDING_API || 'https://oshboard.onrender.com';

function copy(src, dst) {
  const st = fs.statSync(src);
  if (st.isDirectory()) {
    fs.mkdirSync(dst, { recursive: true });
    for (const f of fs.readdirSync(src)) copy(path.join(src, f), path.join(dst, f));
  } else {
    fs.copyFileSync(src, dst);
  }
}

async function liveContent() {
  // Сервер может спать — ждём до минуты; не дождались — сайт без правок, на базовых текстах
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 60000);
  try {
    const r = await fetch(`${LIVE}/api/content`, { signal: ctrl.signal });
    const j = await r.json();
    return j && j.ok ? j : null;
  } catch (e) {
    console.warn('Контент с сервера не получен:', e.message);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

(async () => {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
  for (const d of ['css', 'js', 'assets']) if (fs.existsSync(path.join(ROOT, d))) copy(path.join(ROOT, d), path.join(DIST, d));

  const content = await liveContent();
  fs.writeFileSync(path.join(DIST, 'assets', 'content.json'), JSON.stringify(content || { ok: false }));

  let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const flags = `<script>window.OSH_CONTENT='assets/content.json';window.OSH_API=${JSON.stringify(LIVE)};</script>`;
  html = html.replace('<script src="js/i18n.js"', `${flags}\n<script src="js/i18n.js"`);
  if (!html.includes('window.OSH_CONTENT')) throw new Error('Не нашёл, куда вставить настройки статической версии');
  fs.writeFileSync(path.join(DIST, 'index.html'), html);

  // Страховка: в сборку не должно попасть ничего служебного
  for (const bad of ['server', 'admin', 'node_modules', '.env']) {
    if (fs.existsSync(path.join(DIST, bad))) throw new Error(`В сборку попало лишнее: ${bad}`);
  }
  console.log('Статическая версия собрана в dist/', content ? '(контент с сервера взят)' : '(без контента с сервера)');
})().catch((e) => { console.error(e); process.exit(1); });
