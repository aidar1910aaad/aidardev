# Настройка Google Analytics 4 - Инструкция

## ✅ Ваш Measurement ID:
```
G-7K87D6NR9E
```

## 📝 Шаг 1: Добавьте в .env.local

Откройте файл `.env.local` в корне проекта и добавьте (или обновите) строку:

```env
NEXT_PUBLIC_GA_ID=G-7K87D6NR9E
```

**Полный пример .env.local:**
```env
# Сайт
NEXT_PUBLIC_SITE_URL=https://www.aidardev.kz

# Google Analytics 4
NEXT_PUBLIC_GA_ID=G-7K87D6NR9E

# Google Search Console Verification (если есть)
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-verification-code

# Яндекс.Метрика (если настроена)
NEXT_PUBLIC_YANDEX_METRIKA_ID=your-metrika-id

# Яндекс.Вебмастер Verification (если есть)
NEXT_PUBLIC_YANDEX_VERIFICATION=your-verification-code

# Microsoft Clarity (опционально)
NEXT_PUBLIC_CLARITY_ID=your-clarity-id
```

## 📝 Шаг 2: Добавьте в Vercel

1. Откройте проект в [Vercel Dashboard](https://vercel.com/dashboard)
2. Перейдите в **Settings** → **Environment Variables**
3. Добавьте переменную:
   - **Name:** `NEXT_PUBLIC_GA_ID`
   - **Value:** `G-7K87D6NR9E`
   - **Environment:** Production, Preview, Development (выберите все)
4. Нажмите **Save**

## 📝 Шаг 3: Перезапустите проект

### Локально:
```bash
# Остановите dev сервер (Ctrl+C)
# Запустите снова
npm run dev
```

### На Vercel:
После добавления переменной окружения Vercel автоматически перезапустит деплой, или:
1. Перейдите в **Deployments**
2. Нажмите **Redeploy** на последнем деплое

## ✅ Шаг 4: Проверка работы

### Способ 1: Real-time отчет в GA4
1. Откройте [Google Analytics](https://analytics.google.com)
2. Перейдите в ваш ресурс
3. Откройте **Reports** → **Real-time**
4. Откройте сайт https://www.aidardev.kz в новой вкладке
5. Через 30-60 секунд вы должны увидеть себя в Real-time отчете

### Способ 2: Проверка в браузере
1. Откройте сайт https://www.aidardev.kz
2. Откройте DevTools (F12)
3. Перейдите в **Network** tab
4. Отфильтруйте по `gtag` или `collect`
5. Вы должны увидеть запросы к `google-analytics.com`

### Способ 3: Расширение браузера
Установите расширение [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) для Chrome

## 🔍 Детали вашего потока:

- **Название:** aidardev.kz - Веб-сайт
- **URL:** https://www.aidardev.kz
- **Stream ID:** 13219244106
- **Measurement ID:** G-7K87D6NR9E
- **Расширенное измерение:** ✅ Включено

## ⚠️ Важно:

1. **Данные появятся через 24-48 часов** после первого визита
2. **Real-time отчет** покажет данные сразу (через 30-60 секунд)
3. **Убедитесь**, что переменная добавлена и в `.env.local`, и в Vercel
4. **Проверьте**, что компонент `GoogleAnalytics` уже добавлен в `app/layout.tsx` (✅ уже есть)

## 🎯 Что будет отслеживаться:

После настройки автоматически будут отслеживаться:
- ✅ Просмотры страниц
- ✅ Прокрутки (scrolls)
- ✅ Исходящие клики (outbound clicks)
- ✅ Поиск на сайте
- ✅ Взаимодействие с видео
- ✅ Скачивание файлов

## 📊 Следующие шаги:

1. ✅ Добавить Measurement ID в `.env.local`
2. ✅ Добавить в Vercel Environment Variables
3. ✅ Перезапустить проект
4. ✅ Проверить работу через Real-time отчет
5. ⏭️ Настроить события для лидов (contact_form_submit, chatbot_open и т.д.)
6. ⏭️ Настроить конверсии
7. ⏭️ Подключить Google Search Console

---

**После выполнения всех шагов аналитика начнет работать автоматически!** 🚀

