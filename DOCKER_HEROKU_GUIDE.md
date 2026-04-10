# Heroku Docker Deployment Guide

## 1. Dockerfile для NestJS сервера

```dockerfile
# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
```

**Сохранить в корень проекту як `Dockerfile`**

---

## 2. .dockerignore

```
node_modules
npm-debug.log
dist
.git
.gitignore
.env
.env.local
README.md
coverage
```

**Сохранить як `.dockerignore`**

---

## 3. Docker Compose для локального розвитку

```yaml
version: '3.8'

services:
  # NestJS сервер
  server:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      DB_HOST: db
      DB_PORT: 3306
      DB_USER: admin
      DB_PASSWORD: password123
      DB_NAME: green_anonymization
      NODE_ENV: development
    depends_on:
      - db
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run start:dev

  # MySQL Database
  db:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: password123
      MYSQL_DATABASE: green_anonymization
      MYSQL_USER: admin
      MYSQL_PASSWORD: password123
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10

  # Anonymizer (якщо окремий сервіс)
  # anonymizer:
  #   build:
  #     context: ../green_anonymization_service
  #   ports:
  #     - "5000:5000"
  #   depends_on:
  #     - db

volumes:
  mysql_data:
```

**Сохранить як `docker-compose.yml`**

---

## 4. Heroku Deployment Steps

### A. Підготовка до деплою

1. **Встановити Heroku CLI:**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Створити Heroku приложение:**
   ```bash
   heroku create green-anonymization-be
   ```

3. **Встановити stack на контейнери:**
   ```bash
   heroku stack:set container -a green-anonymization-be
   ```

4. **Додати MySQL базу (Heroku ClearDB):**
   ```bash
   heroku addons:create cleardb:ignite -a green-anonymization-be
   ```
   Отримати URL:
   ```bash
   heroku config:get CLEARDB_DATABASE_URL -a green-anonymization-be
   ```

### B. Heroku.yml

Створити файл `heroku.yml` в корені:

```yaml
build:
  docker:
    web: Dockerfile
release:
  command: npm run migration:run
run:
  web: node dist/main
```

**Сохранить як `heroku.yml`**

### C. Встановити env змінні на Heroku

```bash
heroku config:set \
  NODE_ENV=production \
  DB_HOST=your-db-host \
  DB_PORT=3306 \
  DB_USER=your-user \
  DB_PASSWORD=your-password \
  DB_NAME=your-db-name \
  -a green-anonymization-be
```

### D. Деплоїти

```bash
git add .
git commit -m "chore: add Docker and Heroku configuration"
git push heroku main
```

Перевірити логи:
```bash
heroku logs --tail -a green-anonymization-be
```

---

## 5. Локальне тестування Docker контейнера

```bash
# Збудувати образ
docker build -t green-anonymization-be:latest .

# Запустити локально (з DB в docker-compose)
docker-compose up

# Або окремий контейнер
docker run -p 3000:3000 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=3306 \
  -e DB_USER=admin \
  -e DB_PASSWORD=password123 \
  -e DB_NAME=green_anonymization \
  green-anonymization-be:latest
```

---

## 6. Структура проекту

```
green_anonymization_be/
├── src/
├── dist/
├── Dockerfile                 # ← НОВИЙ
├── .dockerignore             # ← НОВИЙ
├── docker-compose.yml        # ← НОВИЙ
├── heroku.yml               # ← НОВИЙ
├── package.json
├── tsconfig.json
└── ...
```

---

## 7. Environment Variables (.env)

**Локально (.env):**
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=password123
DB_NAME=green_anonymization
NODE_ENV=development
PORT=3000
```

**На Heroku:** встановити через `heroku config:set` або в Dashboard

---

## 8. Команди для різних сценаріїв

```bash
# Локально
docker-compose up              # Запустити все
docker-compose down            # Зупинити
docker-compose logs -f server  # Логи сервера

# На Heroku
heroku logs --tail             # Живі логи
heroku ps                       # Статус процесів
heroku restart                  # Перезагрузити
heroku run bash                 # Shell в контейнері
heroku run npm run migration:run  # Запустити міграції
```

---

## 9. Troubleshooting

**Port уже в використанні:**
```bash
# Знайти процес на порту 3000
lsof -i :3000
# Вбити (на Unix)
kill -9 <PID>
```

**Контейнер краєшится після деплою:**
```bash
# Перевірити логи
heroku logs --tail -a green-anonymization-be

# Може потребувати env змінні
heroku config -a green-anonymization-be
```

**DB не доступна:**
- Перевірити, що БД додана: `heroku addons -a green-anonymization-be`
- Перевірити URL: `heroku config:get DATABASE_URL -a green-anonymization-be`

---

## 10. Алтернатива: GitHub Actions для CI/CD

Можна додати `.github/workflows/deploy.yml` для автоматичного деплою при пушу на main:

```yaml
name: Deploy to Heroku

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: green-anonymization-be
          heroku_email: your-email@example.com
```

Потрібно додати `HEROKU_API_KEY` в GitHub Secrets.

---

## Quick Start

```bash
# 1. Додати файли
cp Dockerfile .
cp docker-compose.yml .
cp heroku.yml .

# 2. Локально протестувати
docker-compose up

# 3. Залогуватися в Heroku
heroku login

# 4. Створити app та встановити container stack
heroku create green-anonymization-be
heroku stack:set container

# 5. Додати БД
heroku addons:create cleardb:ignite

# 6. Встановити env vars
heroku config:set NODE_ENV=production DB_HOST=... DB_USER=... DB_PASSWORD=...

# 7. Деплоїти
git push heroku main

# 8. Перевірити
heroku logs --tail
```
