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
├── frontend/   — React-приложение
└── backend/    — REST API
```

---

## Быстрый старт (локально)

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
```

Создать файл `.env` на основе примера:

```bash
cp .env.example .env
```

Открыть `.env` и заполнить переменные:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/aspect_db"
PORT=3000
CLIENT_URL=http://localhost:5173

SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_USER=no-reply@example.com
SMTP_PASS=secret
SMTP_FROM="Галерея Аспект <no-reply@example.com>"
GALLERY_EMAIL=info@aspect-gallery.ru

UPLOADS_DIR=./uploads
```

Установить зависимости и применить миграции:

```bash
npm install
npx prisma migrate dev
```

Запустить бэкенд:

```bash
npm run dev
```

Сервер запустится на `http://localhost:3000`

---

### 3. Настроить фронтенд

В новом терминале:

```bash
cd frontend
npm install
npm run dev
```

Приложение откроется на `http://localhost:5173`

> Все запросы на `/api` автоматически проксируются на `http://localhost:3000`

---

## Запуск через Docker

### Требования

- Docker
- Docker Compose

### Запуск

В корне репозитория создать файл `docker-compose.yml`:

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: aspect
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: aspect_db
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    env_file: ./backend/.env
    environment:
      DATABASE_URL: postgresql://aspect:secret@db:5432/aspect_db
    ports:
      - "3000:3000"
    depends_on:
      - db
    volumes:
      - uploads:/app/uploads

  frontend:
    build: ./frontend
    environment:
      BACKEND_URL: http://backend:3000
    ports:
      - "5173:5173"
    depends_on:
      - backend

volumes:
  pgdata:
  uploads:
```

Запустить:

```bash
docker compose up --build
```

Приложение будет доступно на `http://localhost:5173`

---

## Переменные окружения (бэкенд)

| Переменная | Описание | Пример |
|-----------|----------|--------|
| `DATABASE_URL` | Строка подключения к PostgreSQL | `postgresql://user:pass@localhost:5432/db` |
| `PORT` | Порт бэкенда | `3000` |
| `CLIENT_URL` | URL фронтенда (для CORS) | `http://localhost:5173` |
| `SMTP_HOST` | SMTP-сервер для почты | `smtp.gmail.com` |
| `SMTP_PORT` | Порт SMTP | `465` |
| `SMTP_USER` | Логин почты | `no-reply@example.com` |
| `SMTP_PASS` | Пароль почты | `secret` |
| `SMTP_FROM` | Имя отправителя | `"Галерея Аспект <no-reply@example.com>"` |
| `GALLERY_EMAIL` | Email галереи для входящих | `info@aspect-gallery.ru` |
| `UPLOADS_DIR` | Путь для загружаемых файлов | `./uploads` |

---

## Полезные команды

### Бэкенд

```bash
# Запуск в режиме разработки (с hot-reload)
npm run dev

# Запуск в production
npm start

# Применить миграции БД
npx prisma migrate dev

# Открыть визуальный редактор БД
npx prisma studio

# Заполнить БД тестовыми данными
npx prisma db seed
```

### Фронтенд

```bash
# Запуск в режиме разработки
npm run dev

# Сборка для production
npm run build

# Предпросмотр production-сборки
npm run preview
```
