'use strict';

/**
 * Простое файловое хранилище заявок (JSON).
 * Без внешних зависимостей — для лендинга этого достаточно.
 * При росте нагрузки легко заменить на SQLite/Postgres, не меняя server.js.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const FILE = path.join(DATA_DIR, 'leads.json');

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, '[]', 'utf8');
}

function all() {
  ensure();
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch {
    return [];
  }
}

function add(lead) {
  const list = all();
  list.push(lead);
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2), 'utf8');
  return lead;
}

module.exports = { all, add };
