# SEO Setup Guide для aidar.dev

## ✅ Что уже сделано:

1. **Полные мета-теги в layout.tsx**
   - Open Graph теги
   - Twitter Cards
   - Keywords
   - Canonical URLs
   - Hreflang для многоязычности
   - Verification теги для Google/Yandex

2. **Structured Data (JSON-LD)**
   - Person schema
   - Organization schema
   - WebSite schema
   - FAQ schema
   - Review schema
   - Breadcrumb schema (готов к использованию)

3. **Sitemap.xml**
   - Автоматическая генерация через `app/sitemap.ts`
   - Поддержка многоязычности
   - Приоритеты и частота обновления

4. **Robots.txt**
   - Правила для всех поисковых систем
   - Указание на sitemap
   - Блокировка админ-панели и API

5. **Оптимизация изображений**
   - Alt-тексты добавлены
   - Lazy loading
   - Оптимизация через Next.js Image

6. **Next.js конфигурация**
   - Оптимизация изображений (AVIF, WebP)
   - Security headers
   - Compression

## 🔧 Что нужно сделать вручную:

### 1. Создать OG изображение

Создайте файл `public/og-image.jpg` размером 1200x630px с вашим брендингом.

**Рекомендации:**
- Размер: 1200x630px
- Формат: JPG или PNG
- Содержание: Ваше имя, профессия, контакты
- Используйте градиенты из вашего дизайна (синий-оранжевый)

### 2. Настроить переменные окружения

Создайте файл `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=https://aidar.dev
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-google-verification-code
NEXT_PUBLIC_YANDEX_VERIFICATION=your-yandex-verification-code
```

### 3. Добавить в Google Search Console

1. Перейдите в [Google Search Console](https://search.google.com/search-console)
2. Добавьте свой сайт
3. Используйте verification код из `.env.local`
4. Отправьте sitemap: `https://aidar.dev/sitemap.xml`

### 4. Добавить в Яндекс.Вебмастер

1. Перейдите в [Яндекс.Вебмастер](https://webmaster.yandex.ru)
2. Добавьте свой сайт
3. Используйте verification код из `.env.local`
4. Отправьте sitemap: `https://aidar.dev/sitemap.xml`

### 5. Проверить SEO

Используйте инструменты:
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

## 🚀 Секретные фичи для максимального SEO:

### 1. Preconnect к внешним ресурсам

Добавьте в `app/layout.tsx` в `<head>`:

```tsx
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
```

### 2. DNS Prefetch

```tsx
<link rel="dns-prefetch" href="https://www.google-analytics.com" />
<link rel="dns-prefetch" href="https://mc.yandex.ru" />
```

### 3. Manifest для PWA (опционально)

Создайте `public/manifest.json`:

```json
{
  "name": "Aidar - Full-Stack Developer",
  "short_name": "Aidar",
  "description": "Professional Full-Stack Developer Portfolio",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 4. Добавить в layout.tsx:

```tsx
<link rel="manifest" href="/manifest.json" />
```

### 5. Оптимизация для Core Web Vitals

- Уже настроено: lazy loading изображений
- Уже настроено: оптимизация шрифтов (display: swap)
- Рекомендуется: добавить loading="lazy" для всех изображений

### 6. Микроразметка для статей (если будет блог)

```tsx
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Заголовок статьи",
  "author": {
    "@type": "Person",
    "name": "Aidar"
  },
  "datePublished": "2025-01-XX",
  "dateModified": "2025-01-XX"
}
```

## 📊 Мониторинг SEO:

1. **Google Analytics 4** - для отслеживания трафика
2. **Google Search Console** - для мониторинга индексации
3. **Яндекс.Метрика** - для российского рынка
4. **Ahrefs/SEMrush** - для анализа конкурентов (опционально)

## ✅ Чеклист перед запуском:

- [ ] Создан og-image.jpg (1200x630px)
- [ ] Настроены переменные окружения
- [ ] Добавлен сайт в Google Search Console
- [ ] Добавлен сайт в Яндекс.Вебмастер
- [ ] Проверены все structured data через валидаторы
- [ ] Проверен sitemap.xml
- [ ] Проверен robots.txt
- [ ] Все изображения имеют alt-тексты
- [ ] Проверена скорость загрузки (PageSpeed Insights)
- [ ] Проверены Core Web Vitals

## 🎯 Ожидаемый результат:

После всех настроек ваш сайт должен получить:
- ✅ 100% по SEO в PageSpeed Insights
- ✅ Rich snippets в поисковой выдаче
- ✅ Красивые превью при шаринге в соцсетях
- ✅ Быстрая индексация новых страниц
- ✅ Высокий рейтинг в поисковых системах

