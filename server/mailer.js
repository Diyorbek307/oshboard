'use strict';

/**
 * Отправка заявки на почту с сервера — через SMTP (необязательно).
 *
 * Основной канал писем в этом проекте — Web3Forms НА СТОРОНЕ БРАУЗЕРА
 * (см. js/main.js), потому что их бесплатный план не разрешает серверные
 * запросы. Здесь остаётся только SMTP — для тех, у кого он есть.
 * Если SMTP не настроен, заявка всё равно сохраняется в store.
 */

const nodemailer = require('nodemailer');

let transporter = null;
if (process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE) === 'true',
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
}

function channel() {
  return transporter ? 'smtp' : 'none';
}

function isConfigured() {
  return Boolean(transporter);
}

async function sendLead(lead) {
  if (!transporter) return { sent: false, reason: 'SMTP не настроен' };

  const to = process.env.LEAD_TO || 'diyorbekmustafaev7@gmail.com';
  const from = process.env.LEAD_FROM || process.env.SMTP_USER || 'no-reply@oshboard.uz';

  await transporter.sendMail({
    from,
    to,
    subject: 'Новая заявка на демо OSHBOARD',
    text:
      `Имя: ${lead.name}\n` +
      `Телефон: ${lead.phone}\n` +
      `Заведение: ${lead.place}\n` +
      `Тип: ${lead.type}\n` +
      `Время: ${lead.createdAt}\n` +
      `IP: ${lead.ip}`,
  });

  return { sent: true, via: 'smtp' };
}

module.exports = { sendLead, isConfigured, channel };
