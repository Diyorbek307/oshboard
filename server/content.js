'use strict';

/**
 * Хранилище редактируемого контента сайта (новости + настройки).
 * Управляется из админ-панели, отдаётся сайту через GET /api/content.
 */

const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'data');
const FILE = path.join(DIR, 'content.json');

const DEFAULT = {
  settings: {
    logoText: 'OSHBOARD',
    logoImage: '',
    phone: '+998 90 000-00-00',
    telegram: 'https://t.me/oshboard',
    instagram: '#',
    email: 'hello@oshboard.uz',
  },
  texts: {}, // правки текстов: { "<оригинал RU>": { ru, uz, en } }
  news: [],
};

function ensure() {
  if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify(DEFAULT, null, 2), 'utf8');
}

function read() {
  ensure();
  try {
    const c = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    return {
      settings: Object.assign({}, DEFAULT.settings, c.settings),
      texts: c.texts || {},
      news: c.news || [],
    };
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT));
  }
}

function write(content) {
  ensure();
  fs.writeFileSync(FILE, JSON.stringify(content, null, 2), 'utf8');
  return content;
}

module.exports = { read, write, DEFAULT };
