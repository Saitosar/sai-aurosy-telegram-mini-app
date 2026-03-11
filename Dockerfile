# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Копируем shared/ ДО npm install, потому что npm запускает prepare->tsc во время install
COPY package*.json ./
COPY shared/ ./shared/
COPY backend/package.json ./backend/

RUN npm install

# Копируем остальной исходный код
COPY backend/ ./backend/

# Пересобираем shared (на случай если prepare не всё сделал) и собираем backend
RUN npm run build -w shared && npm run build -w backend

# Удаляем devDependencies на месте
RUN npm prune --omit=dev

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app

COPY package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package.json ./backend/package.json

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

WORKDIR /app/backend
CMD ["node", "dist/main"]
