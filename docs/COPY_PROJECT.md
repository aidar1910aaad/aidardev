# Как создать чистую копию проекта

Это руководство поможет вам создать чистую копию проекта, готовую для нового использования.

## Что будет скопировано

- Все исходные файлы кода
- Конфигурационные файлы (package.json, tsconfig.json, etc.)
- Документация
- Публичные ресурсы (public/)
- Тесты

## Что НЕ будет скопировано (будет исключено)

- `node_modules/` - зависимости (нужно будет установить заново)
- `.next/` - build артефакты Next.js
- `.git/` - история git (если хотите начать с чистого репозитория)
- `.vercel/` - конфигурация Vercel
- `coverage/` - отчеты о покрытии тестами
- `out/`, `build/` - build директории
- `.env*` файлы - переменные окружения (кроме .env.example)
- `*.log` - log файлы
- `*.tsbuildinfo` - TypeScript build info

## Способы создания копии

### Вариант 1: Использование скрипта (Windows PowerShell)

```powershell
.\scripts\copy-project-clean.ps1 -DestinationPath "C:\path\to\new-project-name"
```

### Вариант 2: Использование скрипта (Linux/Mac)

```bash
chmod +x scripts/copy-project-clean.sh
./scripts/copy-project-clean.sh /path/to/new-project-name
```

### Вариант 3: Ручное копирование

1. Скопируйте всю папку проекта в новое место
2. Удалите следующие директории и файлы:
   - `node_modules/`
   - `.next/`
   - `.git/` (если хотите начать с чистого git)
   - `.vercel/`
   - `coverage/`
   - `out/`
   - `build/`
   - Все `.env*` файлы (кроме `.env.example`)
   - Все `*.log` файлы
   - `*.tsbuildinfo`
   - `next-env.d.ts`

### Вариант 4: Использование Git (если проект в git)

```bash
# Создайте новый репозиторий
git clone <url-вашего-репозитория> new-project-name
cd new-project-name

# Удалите историю git (опционально)
rm -rf .git
git init

# Удалите build артефакты
rm -rf node_modules .next coverage out build
```

## После копирования

1. **Перейдите в новую директорию:**
   ```bash
   cd path/to/new-project-name
   ```

2. **Установите зависимости:**
   ```bash
   npm install
   ```

3. **Инициализируйте git (если нужно):**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

4. **Создайте файлы окружения (если нужно):**
   ```bash
   # Скопируйте .env.example в .env.local и заполните значения
   cp .env.example .env.local
   ```

5. **Запустите проект:**
   ```bash
   npm run dev
   ```

## Примечания

- Скрипты автоматически исключают все временные файлы и build артефакты
- `package-lock.json` будет скопирован, что гарантирует установку тех же версий зависимостей
- Если у вас есть специфичные файлы, которые нужно исключить, добавьте их в скрипт

