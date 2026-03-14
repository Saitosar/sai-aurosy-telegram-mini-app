# Backend Deployment Guide

## VPS

- **IP:** `91.98.72.220`
- **User:** `root`
- **Project path:** `/opt/sai-aurosy`

## Подключение к VPS

```bash
ssh root@91.98.72.220
```

## Структура backend на сервере

Backend запущен в **Docker-контейнере**.

| Параметр | Значение |
|---|---|
| Контейнер | `sai-aurosy-api` |
| Порт внутри контейнера | `3001` (не проброшен наружу напрямую) |
| docker-compose файл | `docker-compose.prod.yml` |
| ENV-файл | `.env.prod` (не хранится в git, только на сервере) |
| Сеть | `aurosy-network` (bridge) + `talaix-network` (external, shared с hrtech-talaix) |

### Dockerfile (multi-stage build)

1. **Stage builder** — `node:20-alpine`:
   - Копирует `shared/` и `backend/`
   - Запускает `npm install`
   - Билдит `shared` и `backend` через TypeScript (`nest build`)
   - Удаляет devDependencies
2. **Stage production** — `node:20-alpine`:
   - Копирует только `dist/`, `node_modules`, `shared/`
   - Запускает `node dist/main` на порту `3001`

### NestJS модули backend

```
backend/src/
├── app.module.ts
├── main.ts
├── audit/
├── auth/
├── mall-guide/        ← MallGuideModule, CalibrationController, CalibrationService
├── platform/
├── robots/
├── scenarios/
├── store/
└── telemetry/
```

## Деплой вручную (когда нет GitHub Actions)

```bash
ssh root@91.98.72.220

cd /opt/sai-aurosy
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build
```

## Автоматический деплой (GitHub Actions)

Настроен workflow `.github/workflows/deploy.yml`.
**Триггер:** merge/push в ветку `main`.

Workflow подключается к VPS по SSH (ключ хранится в GitHub Secret `VPS_SSH_KEY`) и выполняет:
```bash
cd /opt/sai-aurosy
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build
```

Статус деплоя: `https://github.com/Saitosar/sai-aurosy-telegram-mini-app/actions`

## Первый деплой на чистый сервер

Если директории `/opt/sai-aurosy` нет или это не git-репозиторий:

```bash
# 1. Сохранить .env.prod если он существует
cp /opt/sai-aurosy/.env.prod /root/.env.prod.backup

# 2. Клонировать репозиторий
rm -rf /opt/sai-aurosy
git clone -b main https://github.com/Saitosar/sai-aurosy-telegram-mini-app /opt/sai-aurosy

# 3. Восстановить .env.prod
cp /root/.env.prod.backup /opt/sai-aurosy/.env.prod

# 4. Запустить
cd /opt/sai-aurosy
docker compose -f docker-compose.prod.yml up -d --build
```

## Полезные команды

```bash
# Статус контейнера
docker ps | grep aurosy

# Логи backend
docker logs sai-aurosy-api

# Логи в реальном времени
docker logs -f sai-aurosy-api

# Перезапустить без ребилда
docker compose -f docker-compose.prod.yml restart

# Зайти внутрь контейнера
docker exec -it sai-aurosy-api sh
```
