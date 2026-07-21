#!/bin/bash
# Скрипт для создания чистой копии проекта (Linux/Mac)
# Использование: ./scripts/copy-project-clean.sh /path/to/new-project

if [ -z "$1" ]; then
    echo "Ошибка: Укажите путь назначения"
    echo "Использование: $0 /path/to/new-project"
    exit 1
fi

SOURCE_PATH="$(cd "$(dirname "$0")/.." && pwd)"
DEST_PATH="$1"

echo "Создание чистой копии проекта..."
echo "Источник: $SOURCE_PATH"
echo "Назначение: $DEST_PATH"

# Создаем директорию назначения
mkdir -p "$DEST_PATH"

# Используем rsync для копирования с исключениями
rsync -av --progress \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.git' \
    --exclude='.vercel' \
    --exclude='coverage' \
    --exclude='out' \
    --exclude='build' \
    --exclude='.pnp' \
    --exclude='.yarn' \
    --exclude='.DS_Store' \
    --exclude='*.log' \
    --exclude='*.pem' \
    --exclude='*.tsbuildinfo' \
    --exclude='next-env.d.ts' \
    --exclude='.env' \
    --exclude='.env.local' \
    --exclude='.env.development.local' \
    --exclude='.env.test.local' \
    --exclude='.env.production.local' \
    "$SOURCE_PATH/" "$DEST_PATH/"

echo ""
echo "Копирование завершено!"
echo ""
echo "Следующие шаги:"
echo "1. Перейдите в новую директорию: cd \"$DEST_PATH\""
echo "2. Установите зависимости: npm install"
echo "3. (Опционально) Инициализируйте git: git init"
echo "4. (Опционально) Создайте .env файлы при необходимости"

