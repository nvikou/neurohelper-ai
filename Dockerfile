<<<<<<< HEAD
# ===== Стадия 1: сборка фронта =====
FROM node:20-alpine AS webbuild
WORKDIR /app

# Копируем манифесты (lock-файл попадёт, если есть)
COPY frontend/package*.json ./

# Если lock отсутствует — сгенерировать, затем чистая установка по lock:
RUN if [ ! -f package-lock.json ]; then \
      npm install --package-lock-only --no-audit --no-fund; \
    fi && \
    npm ci --no-audit --no-fund

# Дальше — остальной код фронта и сборка
COPY frontend/ ./
RUN npm run build  # результат: /app/dist

# ===== Стадия 2: бэкенд + статика =====
FROM python:3.11-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app

# зависимости бэкенда
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# код бэкенда
COPY backend/ ./

# собранный фронт как статика для SPA
COPY --from=webbuild /app/dist /app/frontend_dist

EXPOSE 8000
CMD ["uvicorn","app:app","--host","0.0.0.0","--port","8000"]
=======
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package.json ./
RUN npm install --no-audit --no-fund
COPY frontend/ ./
RUN npm run build

FROM python:3.11-slim AS runtime
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

COPY backend/ /app/backend/
COPY --from=frontend-builder /app/frontend/dist /app/frontend_dist

EXPOSE 8000

CMD ["uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "8000"]
>>>>>>> 2e92c2f (NeuroHelper)
