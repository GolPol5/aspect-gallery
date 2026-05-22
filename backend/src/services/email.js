import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const from = process.env.SMTP_FROM;
const galleryEmail = process.env.GALLERY_EMAIL;

export async function sendInquiryNotification({ artwork, inquiry }) {
  await transporter.sendMail({
    from,
    to: galleryEmail,
    subject: `Новый запрос о работе «${artwork.title}»`,
    text: [
      `Имя: ${inquiry.name}`,
      `Email: ${inquiry.email}`,
      `Работа: ${artwork.title} (ID: ${artwork.id})`,
      '',
      inquiry.text,
    ].join('\n'),
  });
}

export async function sendInquiryReply({ inquiry, artwork, reply }) {
  await transporter.sendMail({
    from,
    to: inquiry.email,
    subject: `Ответ на ваш запрос — галерея «Аспект»`,
    text: [
      `Здравствуйте, ${inquiry.name}!`,
      '',
      `Вы обращались с вопросом о работе «${artwork.title}»:`,
      `"${inquiry.text}"`,
      '',
      'Наш ответ:',
      reply,
      '',
      '---',
      'Галерея современного искусства «Аспект», Санкт-Петербург',
    ].join('\n'),
  });
}

export async function sendContactNotification({ msg }) {
  await transporter.sendMail({
    from,
    to: galleryEmail,
    subject: msg.subject ? `Сообщение: ${msg.subject}` : 'Новое сообщение с сайта',
    text: [
      `Имя: ${msg.name}`,
      `Email: ${msg.email}`,
      msg.subject ? `Тема: ${msg.subject}` : '',
      '',
      msg.message,
    ]
      .filter(Boolean)
      .join('\n'),
  });
}
