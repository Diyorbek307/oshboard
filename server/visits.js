'use strict';

/**
 * Простой счётчик посещаемости сайта.
 * Хранит суммарные просмотры/уники и разбивку по дням.
 */

const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'data');
const FILE = path.join(DIR, 'visits.json');
const DEFAULT = { totalViews: 0, totalUniques: 0, days: {} };

function ensure() {
  if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify(DEFAULT, null, 2), 'utf8');
}

function read() {
  ensure();
  try {
    const d = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    d.days = d.days || {};
    d.totalViews = d.totalViews || 0;
    d.totalUniques = d.totalUniques || 0;
    return d;
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT));
  }
}

function write(d) {
  ensure();
  // храним не больше 120 последних дней
  const keys = Object.keys(d.days).sort();
  if (keys.length > 120) keys.slice(0, keys.length - 120).forEach((k) => delete d.days[k]);
  fs.writeFileSync(FILE, JSON.stringify(d, null, 2), 'utf8');
  return d;
}

module.exports = { read, write };
