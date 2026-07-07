'use strict';
/* OSHBOARD admin panel */
(function () {
  var $ = function (s) { return document.querySelector(s); };
  var loginView = $('#loginView'), appView = $('#appView');

  function api(url, opts) {
    opts = opts || {};
    opts.credentials = 'same-origin';
    if (opts.body && !(opts.body instanceof FormData)) {
      opts.headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers);
      opts.body = JSON.stringify(opts.body);
    }
    return fetch(url, opts).then(function (r) {
      return r.json().catch(function () { return { ok: false, error: 'Ошибка сервера' }; })
        .then(function (d) { d._status = r.status; return d; });
    });
  }

  var toastEl = $('#toast'), toastT;
  function toast(msg, kind) {
    toastEl.textContent = msg;
    toastEl.className = 'toast ' + (kind || '');
    toastEl.hidden = false;
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.hidden = true; }, 2600);
  }

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }

  /* ---------- Auth ---------- */
  function showApp() { loginView.hidden = true; appView.hidden = false; loadNews(); loadSettings(); loadStats(); loadLeads(); }
  function showLogin() { appView.hidden = true; loginView.hidden = false; }

  api('/api/admin/me').then(function (d) { if (d.authed) showApp(); else showLogin(); });

  $('#loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var err = $('#loginErr'); err.hidden = true;
    var btn = this.querySelector('button[type=submit]');
    btn.disabled = true;
    api('/api/admin/login', { method: 'POST', body: { username: this.username.value, password: this.password.value } })
      .then(function (d) {
        if (d.ok) showApp();
        else { err.textContent = d.error || 'Ошибка входа'; err.hidden = false; }
      })
      .catch(function () {
        err.textContent = 'Сервер не отвечает. Запустите его командой npm start и обновите страницу (Ctrl+Shift+R).';
        err.hidden = false;
      })
      .then(function () { btn.disabled = false; });
  });

  $('#logoutBtn').addEventListener('click', function () {
    api('/api/admin/logout', { method: 'POST' }).then(showLogin);
  });

  /* ---------- Tabs ---------- */
  document.querySelectorAll('.tab').forEach(function (t) {
    t.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach(function (x) { x.classList.remove('on'); });
      document.querySelectorAll('.panel').forEach(function (x) { x.classList.remove('on'); });
      t.classList.add('on');
      $('#tab-' + t.dataset.tab).classList.add('on');
      if (t.dataset.tab === 'texts') ensureTexts();
    });
  });

  /* ---------- News ---------- */
  var editor = $('#newsEditor'), editingId = null;

  function openEditor(item) {
    editingId = item ? item.id : null;
    $('#ne-title').value = item ? item.title : '';
    $('#ne-body').value = item ? item.body : '';
    $('#ne-date').value = item ? item.date : new Date().toISOString().slice(0, 10);
    setPreview(item ? item.image : '');
    editor.hidden = false;
    $('#ne-title').focus();
  }
  function closeEditor() { editor.hidden = true; editingId = null; $('#ne-upstatus').textContent = ''; }
  function setPreview(url) {
    $('#ne-preview').dataset.url = url || '';
    if (url) { $('#ne-img').src = url; $('#ne-preview').hidden = false; }
    else { $('#ne-preview').hidden = true; }
  }

  $('#addNewsBtn').addEventListener('click', function () { openEditor(null); });
  $('#ne-cancel').addEventListener('click', closeEditor);
  $('#ne-upload').addEventListener('click', function () { $('#ne-file').click(); });

  $('#ne-file').addEventListener('change', function () {
    var f = this.files[0]; if (!f) return;
    var fd = new FormData(); fd.append('file', f);
    $('#ne-upstatus').textContent = 'Загрузка…';
    api('/api/admin/upload', { method: 'POST', body: fd }).then(function (d) {
      if (d.ok) { setPreview(d.url); $('#ne-upstatus').textContent = 'Готово'; }
      else { $('#ne-upstatus').textContent = ''; toast(d.error || 'Ошибка загрузки', 'err'); }
    });
  });

  $('#ne-save').addEventListener('click', function () {
    var payload = {
      title: $('#ne-title').value.trim(),
      body: $('#ne-body').value.trim(),
      date: $('#ne-date').value,
      image: $('#ne-preview').dataset.url || '',
    };
    if (!payload.title) { toast('Введите заголовок', 'err'); return; }
    var req = editingId
      ? api('/api/admin/news/' + editingId, { method: 'PUT', body: payload })
      : api('/api/admin/news', { method: 'POST', body: payload });
    req.then(function (d) {
      if (d.ok) { toast('Сохранено', 'ok'); closeEditor(); loadNews(); }
      else toast(d.error || 'Ошибка', 'err');
    });
  });

  function loadNews() {
    api('/api/admin/content').then(function (d) {
      if (!d.ok) return;
      var news = d.content.news || [];
      var list = $('#newsList'); list.innerHTML = '';
      $('#newsEmpty').hidden = news.length > 0;
      news.forEach(function (n) {
        var el = document.createElement('div');
        el.className = 'ncard';
        el.innerHTML =
          (n.image ? '<div class="ph"><img src="' + esc(n.image) + '" alt=""></div>' : '') +
          '<div class="body">' +
          '<span class="date">' + esc(n.date) + '</span>' +
          '<h3>' + esc(n.title) + '</h3>' +
          '<p>' + esc(n.body) + '</p>' +
          '<div class="row"><button class="btn btn-ghost edit">Изменить</button><button class="btn btn-danger del">Удалить</button></div>' +
          '</div>';
        el.querySelector('.edit').addEventListener('click', function () { openEditor(n); window.scrollTo({ top: 0, behavior: 'smooth' }); });
        el.querySelector('.del').addEventListener('click', function () {
          if (!confirm('Удалить новость «' + n.title + '»?')) return;
          api('/api/admin/news/' + n.id, { method: 'DELETE' }).then(function (r) {
            if (r.ok) { toast('Удалено', 'ok'); loadNews(); }
          });
        });
        list.appendChild(el);
      });
    });
  }

  /* ---------- Settings ---------- */
  function loadSettings() {
    api('/api/admin/content').then(function (d) {
      if (!d.ok) return;
      var s = d.content.settings || {};
      $('#set-logoText').value = s.logoText || '';
      $('#set-phone').value = s.phone || '';
      $('#set-telegram').value = s.telegram || '';
      $('#set-instagram').value = s.instagram || '';
      $('#set-email').value = s.email || '';
      setLogoPreview(s.logoImage || '');
    });
  }
  function setLogoPreview(url) {
    $('#set-logopreview').dataset.url = url || '';
    if (url) { $('#set-logoimg').src = url; $('#set-logopreview').hidden = false; }
    else { $('#set-logopreview').hidden = true; }
  }
  $('#set-logoupload').addEventListener('click', function () { $('#set-logofile').click(); });
  $('#set-logofile').addEventListener('change', function () {
    var f = this.files[0]; if (!f) return;
    var fd = new FormData(); fd.append('file', f);
    $('#set-logostatus').textContent = 'Загрузка…';
    api('/api/admin/upload', { method: 'POST', body: fd }).then(function (d) {
      if (d.ok) { setLogoPreview(d.url); $('#set-logostatus').textContent = 'Готово'; }
      else { $('#set-logostatus').textContent = ''; toast(d.error || 'Ошибка загрузки', 'err'); }
    });
  });
  $('#set-save').addEventListener('click', function () {
    api('/api/admin/settings', { method: 'POST', body: {
      logoText: $('#set-logoText').value, logoImage: $('#set-logopreview').dataset.url || '',
      phone: $('#set-phone').value, telegram: $('#set-telegram').value,
      instagram: $('#set-instagram').value, email: $('#set-email').value,
    }}).then(function (d) {
      if (d.ok) toast('Настройки сохранены', 'ok'); else toast(d.error || 'Ошибка', 'err');
    });
  });

  /* ---------- Тексты сайта (3 языка) ---------- */
  var textsLoaded = false, BASE = null;
  function ensureTexts() { if (!textsLoaded) { textsLoaded = true; loadTexts(); } }
  function loadTexts() {
    Promise.all([
      fetch('/assets/i18n-base.json').then(function (r) { return r.json(); }),
      api('/api/admin/content'),
    ]).then(function (res) {
      BASE = res[0] || {};
      var ov = (res[1].content && res[1].content.texts) || {};
      renderTexts(ov);
    }).catch(function () { $('#txt-loading').textContent = 'Не удалось загрузить тексты.'; });
  }
  function tfield(lang, val) {
    return '<label>' + lang.toUpperCase() + '<textarea data-lang="' + lang + '">' + esc(val) + '</textarea></label>';
  }
  function renderTexts(ov) {
    var list = $('#txt-list'); list.innerHTML = '';
    var keys = Object.keys(BASE);
    $('#txtCount').textContent = '(' + keys.length + ')';
    $('#txt-loading').hidden = true;
    keys.forEach(function (key) {
      var o = ov[key] || {}, def = BASE[key] || ['', ''];
      var row = document.createElement('div');
      row.className = 'txt-row'; row.dataset.key = key;
      row.innerHTML = '<div class="txt-orig">' + esc(key) + '</div><div class="txt-fields">' +
        tfield('ru', o.ru != null ? o.ru : key) +
        tfield('uz', o.uz != null ? o.uz : def[0]) +
        tfield('en', o.en != null ? o.en : def[1]) + '</div>';
      list.appendChild(row);
    });
  }
  $('#texts-save').addEventListener('click', function () {
    if (!BASE) return;
    var out = {};
    document.querySelectorAll('#txt-list .txt-row').forEach(function (row) {
      var key = row.dataset.key, def = BASE[key] || ['', ''], vals = {};
      row.querySelectorAll('textarea').forEach(function (t) { vals[t.dataset.lang] = t.value; });
      out[key] = {
        ru: vals.ru !== key ? vals.ru : '',
        uz: vals.uz !== def[0] ? vals.uz : '',
        en: vals.en !== def[1] ? vals.en : '',
      };
    });
    api('/api/admin/texts', { method: 'POST', body: { texts: out } }).then(function (d) {
      if (d.ok) toast('Тексты сохранены', 'ok'); else toast(d.error || 'Ошибка', 'err');
    });
  });
  $('#txt-search').addEventListener('input', function () {
    var q = this.value.toLowerCase();
    document.querySelectorAll('#txt-list .txt-row').forEach(function (row) {
      row.hidden = q && row.dataset.key.toLowerCase().indexOf(q) === -1;
    });
  });

  /* ---------- Статистика ---------- */
  function loadStats() {
    api('/api/admin/stats').then(function (d) {
      if (!d.ok) return;
      $('#st-total').textContent = d.totalViews;
      $('#st-uniq').textContent = d.totalUniques;
      $('#st-today').textContent = d.todayViews;
      $('#st-todayuniq').textContent = d.todayUniques;
      var max = d.days.reduce(function (m, x) { return Math.max(m, x.views); }, 1);
      var chart = $('#st-chart'); chart.innerHTML = '';
      d.days.forEach(function (x) {
        var h = Math.round((x.views / max) * 100);
        var dd = x.date.slice(8, 10) + '.' + x.date.slice(5, 7);
        var bar = document.createElement('div');
        bar.className = 'bar';
        bar.innerHTML = '<b>' + x.views + '</b><i style="height:' + h + '%" title="' + x.date + ': ' +
          x.views + ' просм., ' + x.uniques + ' уник."></i><span>' + dd + '</span>';
        chart.appendChild(bar);
      });
    });
  }

  /* ---------- Leads ---------- */
  function loadLeads() {
    api('/api/admin/leads').then(function (d) {
      if (!d.ok) return;
      var body = $('#leadsBody'); body.innerHTML = '';
      $('#leadsCount').textContent = d.count ? '(' + d.count + ')' : '';
      $('#leadsEmpty').hidden = d.count > 0;
      (d.leads || []).forEach(function (l) {
        var tr = document.createElement('tr');
        var dt = (l.createdAt || '').replace('T', ' ').slice(0, 16);
        tr.innerHTML = '<td>' + esc(dt) + '</td><td>' + esc(l.name) + '</td><td>' + esc(l.phone) +
          '</td><td>' + esc(l.place) + '</td><td>' + esc(l.type) + '</td>';
        body.appendChild(tr);
      });
    });
  }
})();
