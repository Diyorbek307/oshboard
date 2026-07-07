# Публикация OSHBOARD в интернете

Сайт — это Node.js-приложение (сервер + админка), поэтому нужен хостинг, умеющий
запускать Node. Ниже — простой путь на **Render.com** (бесплатный старт + свой домен).

## Шаг 1. Залить код на GitHub
1. Зарегистрируйся на https://github.com
2. Создай новый репозиторий (New repository), например `oshboard`.
3. В терминале VS Code, в папке проекта:
   ```bash
   git init
   git add .
   git commit -m "OSHBOARD"
   git branch -M main
   git remote add origin https://github.com/ТВОЙ_ЛОГИН/oshboard.git
   git push -u origin main
   ```
   > Файлы `.env`, `node_modules`, `server/data/` и `assets/uploads/` в git не попадут — так и нужно (это секреты и данные).

## Шаг 2. Запустить на Render
1. Зарегистрируйся на https://render.com (через GitHub).
2. **New → Web Service** → выбери свой репозиторий `oshboard`.
3. Render сам увидит `render.yaml`. Проверь:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. В разделе **Environment** задай секреты:
   - `ADMIN_PASSWORD` — **твой новый пароль админки** (НЕ `oshboard2026`!)
   - `ADMIN_USER` — логин (по умолчанию `admin`)
   - `SESSION_SECRET` — Render сгенерирует сам
5. Нажми **Deploy**. Через пару минут получишь адрес вида
   `https://oshboard.onrender.com` — сайт уже в интернете, доступен всем.
   Админка: `https://oshboard.onrender.com/admin`

## Шаг 3. Подключить свой домен
1. Купи домен у регистратора (например, для `.uz` — ahost.uz / uzinfocom; для `.com` — Namecheap).
2. В Render: **Settings → Custom Domains → Add** → впиши свой домен.
3. Render покажет DNS-записи (CNAME/A). Добавь их в панели регистратора домена.
4. Через некоторое время домен заработает с бесплатным HTTPS.

## ⚠️ Важно про данные (заявки, статистика, новости)
На **бесплатном** плане Render файловая система временная — при перезапуске
`server/data/` и загруженные картинки **могут сброситься**.
Для постоянного хранения (реальный бизнес):
- добавь в Render платный **Disk** (~$1–7/мес), примонтируй к `server/data`, **или**
- перенеси хранилище на базу данных (могу помочь сделать позже).

## ✅ Чек-лист перед публикацией
- [ ] Сменить пароль админки (`ADMIN_PASSWORD` в переменных, не в коде)
- [ ] `SESSION_SECRET` — длинная случайная строка
- [ ] Проверить, что `.env` НЕ в GitHub (он в `.gitignore`)
- [ ] Заявки идут на почту (Web3Forms ключ уже в коде — работает с любого адреса)
