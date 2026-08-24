'use strict';

/**
 * OSHBOARD — сервер лендинга + админ-панель (CMS).
 *
 *  ПУБЛИЧНОЕ:
 *   • Статика сайта (index.html, css, js, assets)
 *   • POST /api/lead            — приём заявки на демо
 *   • GET  /api/content         — контент сайта (новости + настройки)
 *   • GET  /api/health          — проверка живости
 *
 *  АДМИНКА (вход по логину/паролю, /admin):
 *   • POST /api/admin/login | logout        — сессия
 *   • GET  /api/admin/me                    — проверка входа
 *   • GET  /api/admin/content               — весь контент
 *   • POST /api/admin/settings              — сохранить настройки
 *   • POST/PUT/DELETE /api/admin/news[/:id] — новости
 *   • POST /api/admin/upload                — загрузка картинки
 *   • GET  /api/admin/leads                 — заявки
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const fs = require('fs');
const express = require('express');
const session = require('express-session');
const multer = require('multer');
const store = require('./store');
const content = require('./content');
const visits = require('./visits');
const mailer = require('./mailer');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, '..');
const UPLOAD_DIR = path.join(ROOT, 'assets', 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

app.set('trust proxy', true);
app.disable('x-powered-by'); // не сообщаем, чем написан сервер

/*
  ЗАЩИТНЫЕ ЗАГОЛОВКИ.

  Ставим руками, без сторонней библиотеки — сайту хватает четырёх строк:

  • X-Content-Type-Options — браузер не будет «угадывать» тип файла и
    выполнять картинку как скрипт;
  • X-Frame-Options — сайт нельзя открыть внутри рамки на чужой странице и
    обманом заставить нажать (кликджекинг);
  • Referrer-Policy — при переходе наружу не отдаём полный адрес страницы;
  • HSTS (только на боевом, только по https) — браузер запоминает, что сюда
    ходят по https, и в следующий раз не пробует открытый канал.
*/
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
  }
  next();
});

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(session({
  name: 'oshboard.sid',
  secret: process.env.SESSION_SECRET || 'please-change-this-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 8 }, // 8 часов
}));

/* ==================== Заявки на демо ==================== */
const WINDOW_MS = 60 * 1000, MAX_HITS = 5, hits = new Map();
function rateLimit(req, res, next) {
  const now = Date.now();
  const rec = hits.get(req.ip) || { count: 0, ts: now };
  if (now - rec.ts > WINDOW_MS) { rec.count = 0; rec.ts = now; }
  rec.count += 1; hits.set(req.ip, rec);
  if (rec.count > MAX_HITS) return res.status(429).json({ ok: false, error: 'Слишком много заявок. Попробуйте через минуту.' });
  next();
}

/*
  ВИДЫ ДЕЛА В ЗАЯВКЕ.

  Список закрытый: всё, чего в нём нет, сервер записывает как «Другое».
  Пока здесь стоял один общепит, владелец магазина выбирал на сайте
  «Продуктовый магазин», а в заявку попадало «Другое» — и мы не знали, кому
  перезваниваем и какой тариф считать.

  Список идёт на трёх языках: человек выбирает на своём, а приходит то,
  что он видел на экране.

  Меняете список на сайте — поменяйте и здесь, иначе новый вид молча
  превратится в «Другое».
*/
const TYPES = [
  // ресторан и кафе
  'Ресторан', 'Кофейня', 'Чайхана', 'Фастфуд',
  'Restoran', 'Qahvaxona', 'Choyxona', 'Fastfud',
  'Restaurant', 'Coffee shop', 'Teahouse', 'Fast food',
  // магазин, аптека, одежда, стройматериалы
  'Продуктовый магазин', 'Аптека', 'Магазин одежды', 'Стройматериалы',
  'Oziq-ovqat doʻkoni', 'Dorixona', 'Kiyim doʻkoni', 'Qurilish mollari',
  'Grocery shop', 'Pharmacy', 'Clothing shop', 'Hardware store',
  // клининг
  'Клининговая компания', 'Klining kompaniyasi', 'Cleaning company',
  // остальное
  'Другое', 'Boshqa', 'Other',
];
function validateLead(body) {
  const name = String(body.name || '').trim();
  const phone = String(body.phone || '').trim();
  const place = String(body.place || '').trim();
  let type = String(body.type || '').trim();
  if (name.length < 2) return { error: 'Укажите имя' };
  if (phone.replace(/\D/g, '').length < 7) return { error: 'Укажите корректный телефон' };
  if (place.length < 2) return { error: 'Укажите название заведения' };
  if (!TYPES.includes(type)) type = 'Другое';
  return { data: { name, phone, place, type } };
}

app.post('/api/lead', rateLimit, async (req, res) => {
  const { error, data } = validateLead(req.body || {});
  if (error) return res.status(400).json({ ok: false, error });
  const lead = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    ...data, createdAt: new Date().toISOString(), ip: req.ip,
  };
  store.add(lead);
  let mailed = false;
  try { mailed = (await mailer.sendLead(lead)).sent; }
  catch (e) { console.error('[mail]', e.message); }
  console.log(`[lead] ${lead.name} · ${lead.phone} · ${lead.place} (mailed=${mailed})`);
  res.json({ ok: true, mailed });
});

/* ==================== Счётчик посещений ==================== */
function parseCookies(req) {
  const out = {};
  (req.headers.cookie || '').split(';').forEach((p) => {
    const i = p.indexOf('=');
    if (i > 0) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim());
  });
  return out;
}

app.post('/api/track', (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const c = parseCookies(req);
  const d = visits.read();
  d.totalViews += 1;
  d.days[today] = d.days[today] || { views: 0, uniques: 0 };
  d.days[today].views += 1;
  if (c.oshb_day !== today) {
    d.days[today].uniques += 1;
    res.cookie('oshb_day', today, { maxAge: 1000 * 60 * 60 * 36, sameSite: 'lax' });
  }
  if (!c.oshb_vid) {
    d.totalUniques += 1;
    res.cookie('oshb_vid', Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      { maxAge: 1000 * 60 * 60 * 24 * 365, sameSite: 'lax' });
  }
  visits.write(d);
  res.json({ ok: true });
});

/* ==================== Публичный контент ==================== */
app.get('/api/content', (req, res) => {
  const c = content.read();
  res.json({ ok: true, settings: c.settings, texts: c.texts, news: c.news });
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, uptime: Math.round(process.uptime()), mail: mailer.isConfigured() });
});

/* ==================== Аутентификация ==================== */
/*
  ВСТРОЕННОГО ПАРОЛЯ БОЛЬШЕ НЕТ.

  Здесь стояло `process.env.ADMIN_PASSWORD || 'oshboard2026'`. Задумано как
  удобство для первого запуска, но сайт стоит в интернете: пока пароль не
  задан на сервере, в админку заходил кто угодно — логин и пароль лежали
  прямо в открытом коде на GitHub.

  Предупреждение в README тут не помогает: оно объясняет, а не защищает.
  Теперь пароль не задан — вход просто не работает, и в журнал пишется
  почему. Пустой пароль в переменной тоже считается «не задан».
*/
const ADMIN_USER = (process.env.ADMIN_USER || '').trim();
const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || '').trim();
const ADMIN_READY = ADMIN_USER.length > 0 && ADMIN_PASSWORD.length >= 8;

if (!ADMIN_READY) {
  console.warn('[admin] Вход в админку ВЫКЛЮЧЕН: не заданы ADMIN_USER и ADMIN_PASSWORD '
    + '(пароль — не короче 8 знаков). Задайте их в server/.env или в панели Render.');
}

function requireAuth(req, res, next) {
  if (req.session && req.session.admin) return next();
  res.status(401).json({ ok: false, error: 'Требуется вход' });
}


/*
  ЗАЩИТА ОТ ПОДБОРА ПАРОЛЯ В АДМИНКУ.

  Вход был без ограничений: пароль можно было пробовать сколько угодно и как
  угодно быстро — за ночь машина перебирает миллионы вариантов. Теперь после
  пяти неудач подряд с одного адреса вход с него запирается на 15 минут.

  Память, не база: сайт небольшой, перезапуск сбрасывает счётчик — и это
  нестрашно, злоумышленник теряет накопленные попытки вместе с нами. Удачный
  вход обнуляет счётчик, чтобы свой человек, вспомнивший пароль с шестого
  раза, не ждал впустую.
*/
const ПОПЫТКИ = new Map(); // ip -> { счёт, до }
const МАКС = 5;
const ЗАПЕРТО_МС = 15 * 60 * 1000;

function ключИП(req) {
  return (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'неизвестно')
    .toString().split(',')[0].trim();
}
function заперто(req) {
  const з = ПОПЫТКИ.get(ключИП(req));
  return з && з.до > Date.now() && з.счёт >= МАКС;
}
function отметитьНеудачу(req) {
  const ip = ключИП(req);
  const з = ПОПЫТКИ.get(ip) || { счёт: 0, до: 0 };
  з.счёт += 1;
  з.до = Date.now() + ЗАПЕРТО_МС;
  ПОПЫТКИ.set(ip, з);
}
function сброс(req) {
  ПОПЫТКИ.delete(ключИП(req));
}
// Раз в полчаса убираем протухшие записи, чтобы карта не росла без предела
setInterval(() => {
  const t = Date.now();
  for (const [ip, з] of ПОПЫТКИ) if (з.до < t) ПОПЫТКИ.delete(ip);
}, 30 * 60 * 1000).unref();

app.post('/api/admin/login', (req, res) => {
  if (!ADMIN_READY) {
    return res.status(503).json({ ok: false, error: 'Вход в админку ещё не настроен' });
  }
  if (заперто(req)) {
    return res.status(429).json({
      ok: false,
      error: 'Слишком много попыток. Подождите 15 минут и попробуйте снова.',
    });
  }
  const { username, password } = req.body || {};
  if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
    сброс(req);
    req.session.admin = true;
    return res.json({ ok: true });
  }
  отметитьНеудачу(req);
  res.status(401).json({ ok: false, error: 'Неверный логин или пароль' });
});

app.post('/api/admin/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get('/api/admin/me', (req, res) => {
  res.json({ ok: true, authed: !!(req.session && req.session.admin) });
});

/* ==================== Админ: контент ==================== */
app.get('/api/admin/content', requireAuth, (req, res) => {
  res.json({ ok: true, content: content.read() });
});

app.post('/api/admin/settings', requireAuth, (req, res) => {
  const c = content.read();
  const b = req.body || {};
  ['logoText', 'logoImage', 'phone', 'telegram', 'instagram', 'email'].forEach((k) => {
    if (typeof b[k] === 'string') c.settings[k] = b[k].trim();
  });
  content.write(c);
  res.json({ ok: true, settings: c.settings });
});

/* Тексты сайта (по языкам) */
app.post('/api/admin/texts', requireAuth, (req, res) => {
  const c = content.read();
  const incoming = req.body && req.body.texts;
  if (incoming && typeof incoming === 'object') {
    c.texts = c.texts || {};
    Object.keys(incoming).forEach((key) => {
      const v = incoming[key] || {};
      const entry = c.texts[key] || {};
      ['ru', 'uz', 'en'].forEach((l) => {
        if (typeof v[l] === 'string') {
          if (v[l].trim()) entry[l] = v[l];
          else delete entry[l]; // пусто → убрать правку (вернётся значение по умолчанию)
        }
      });
      if (Object.keys(entry).length) c.texts[key] = entry;
      else delete c.texts[key];
    });
  }
  content.write(c);
  res.json({ ok: true, texts: c.texts });
});

/* Новости — CRUD */
app.post('/api/admin/news', requireAuth, (req, res) => {
  const c = content.read();
  const b = req.body || {};
  const title = String(b.title || '').trim();
  if (!title) return res.status(400).json({ ok: false, error: 'Заголовок обязателен' });
  const item = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    title,
    body: String(b.body || '').trim(),
    image: String(b.image || '').trim(),
    date: String(b.date || '').trim() || new Date().toISOString().slice(0, 10),
    createdAt: new Date().toISOString(),
  };
  c.news.unshift(item);
  content.write(c);
  res.json({ ok: true, item });
});

app.put('/api/admin/news/:id', requireAuth, (req, res) => {
  const c = content.read();
  const i = c.news.findIndex((n) => n.id === req.params.id);
  if (i < 0) return res.status(404).json({ ok: false, error: 'Новость не найдена' });
  const b = req.body || {};
  ['title', 'body', 'image', 'date'].forEach((k) => {
    if (typeof b[k] === 'string') c.news[i][k] = b[k].trim();
  });
  content.write(c);
  res.json({ ok: true, item: c.news[i] });
});

app.delete('/api/admin/news/:id', requireAuth, (req, res) => {
  const c = content.read();
  const before = c.news.length;
  c.news = c.news.filter((n) => n.id !== req.params.id);
  content.write(c);
  res.json({ ok: true, removed: before - c.news.length });
});

/* Загрузка картинок */
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => {
      const ext = (path.extname(file.originalname).toLowerCase().match(/\.(png|jpe?g|webp|gif)/) || ['.jpg'])[0];
      cb(null, Date.now().toString(36) + Math.random().toString(36).slice(2, 6) + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 МБ
  fileFilter: (req, file, cb) => cb(null, /^image\/(png|jpe?g|webp|gif)$/.test(file.mimetype)),
});

app.post('/api/admin/upload', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ ok: false, error: 'Нужен файл-картинка (до 5 МБ)' });
  res.json({ ok: true, url: '/assets/uploads/' + req.file.filename });
});

/* Статистика посещений */
app.get('/api/admin/stats', requireAuth, (req, res) => {
  const d = visits.read();
  const today = new Date().toISOString().slice(0, 10);
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const dt = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    const rec = d.days[dt] || { views: 0, uniques: 0 };
    days.push({ date: dt, views: rec.views || 0, uniques: rec.uniques || 0 });
  }
  const t = d.days[today] || { views: 0, uniques: 0 };
  res.json({
    ok: true,
    totalViews: d.totalViews, totalUniques: d.totalUniques,
    todayViews: t.views || 0, todayUniques: t.uniques || 0, days,
  });
});

/* Заявки */
app.get('/api/admin/leads', requireAuth, (req, res) => {
  const leads = store.all().slice().reverse(); // новые сверху
  res.json({ ok: true, count: leads.length, leads });
});

/* ==================== Статика и страницы ==================== */
// express.static сам отдаёт /admin/ → admin/index.html и редиректит /admin → /admin/
app.use(express.static(ROOT, { extensions: ['html'] }));
// любой не-API и не-статический путь → главная страница сайта
app.get(/^(?!\/api\/).*/, (req, res) => res.sendFile(path.join(ROOT, 'index.html')));

app.listen(PORT, () => {
  console.log(`OSHBOARD server: http://localhost:${PORT}`);
  console.log(`  Админка:  http://localhost:${PORT}/admin   (логин: ${ADMIN_USER})`);
  console.log(`  Заявки → leads.json` + (mailer.isConfigured() ? ' + SMTP' : '') + '; письма также шлёт форма через Web3Forms');
});
