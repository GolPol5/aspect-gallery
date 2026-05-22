# Aspect Gallery

Веб-платформа галереи современного искусства — каталог работ, выставки, корзина, личный кабинет и панель администратора.

## Стек

| Часть | Технологии |
|-------|-----------|
| Фронтенд | React 18, Vite 5, Vanilla CSS |
| Бэкенд | Node.js 20, Express, Prisma ORM |
| База данных | PostgreSQL |

---

## Структура репозитория

```
aspect-gallery/
├── frontend/          — React-приложение
├── backend/           — REST API
└── docker-compose.yml — запуск всего стека
```

---

## Запуск через Docker (рекомендуется)

### Требования

- Docker
- Docker Compose

### Запуск

```bash
git clone https://github.com/GolPol5/aspect-gallery.git
cd aspect-gallery
docker compose up --build
```

Приложение откроется на `http://localhost:5173`

> База данных, миграции и все зависимости применяются автоматически.

### Настройка почты (опционально)

Если нужна отправка email — создать файл `.env` в корне репозитория:

```bash
cp backend/.env.example .env
```

Заполнить SMTP-переменные и перезапустить:

```bash
docker compose up --build
```

---

## Локальный запуск (без Docker)

### Требования

- Node.js 20+
- PostgreSQL 14+

### 1. Клонировать репозиторий

```bash
git clone https://github.com/GolPol5/aspect-gallery.git
cd aspect-gallery
```

### 2. Настроить бэкенд

```bash
cd backend
cp .env.example .env
```

Открыть `.env` и указать свою строку подключения к PostgreSQL и остальные параметры.
Описание всех переменных — в разделе ниже.

```bash
npm install
npx prisma migrate dev
npm run dev
```

Сервер запустится на `http://localhost:3000`

### 3. Запустить фронтенд

В новом терминале:

```bash
cd frontend
npm install
npm run dev
```

Приложение откроется на `http://localhost:5173`

> Все запросы на `/api` автоматически проксируются на `http://localhost:3000`

---

## Переменные окружения

Все переменные описаны в `backend/.env.example`.

| Переменная | Описание |
|-----------|----------|
| `DATABASE_URL` | Строка подключения к PostgreSQL |
| `PORT` | Порт бэкенда (по умолчанию `3000`) |
| `CLIENT_URL` | URL фронтенда для CORS |
| `SMTP_HOST` | SMTP-сервер для отправки писем |
| `SMTP_PORT` | Порт SMTP |
| `SMTP_USER` | Логин почты |
| `SMTP_PASS` | Пароль почты |
| `SMTP_FROM` | Имя и адрес отправителя |
| `GALLERY_EMAIL` | Email галереи для входящих сообщений |
| `UPLOADS_DIR` | Путь для загружаемых файлов |

---

## Полезные команды

### Бэкенд

```bash
npm run dev          # запуск в режиме разработки
npm start            # запуск в production
npx prisma migrate dev   # применить миграции
npx prisma studio        # визуальный редактор БД
npx prisma db seed       # заполнить БД тестовыми данными
```

### Фронтенд

```bash
npm run dev      # запуск в режиме разработки
npm run build    # сборка для production
npm run preview  # предпросмотр production-сборки
```
