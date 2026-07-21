# Индексация блога на Next.js

## Как работает индексация блога с сервера

### 1. Server-Side Rendering (SSR)
Если блог использует SSR:
- **Каждый запрос** → сервер генерирует HTML
- Поисковики получают **полный HTML** с контентом
- ✅ **Отлично индексируется** - контент виден сразу

### 2. Static Site Generation (SSG)
Если блог использует SSG:
- HTML генерируется **на этапе сборки**
- Файлы сохраняются как статические
- ✅ **Идеально для индексации** - быстрая загрузка

### 3. Incremental Static Regeneration (ISR)
Гибридный подход:
- Статические страницы + обновление по расписанию
- ✅ **Отлично для блога** - баланс скорости и актуальности

## Рекомендации для блога

### Структура URL
```
/[lang]/blog                    - список статей
/[lang]/blog/[slug]             - отдельная статья
```

### Sitemap для блога
```typescript
// app/sitemap.ts
const blogPosts = await getBlogPosts(); // из БД или CMS
const blogRoutes = blogPosts.map((post) => ({
  url: `${siteUrl}/${post.lang}/blog/${post.slug}`,
  lastModified: post.updatedAt,
  changeFrequency: 'weekly',
  priority: 0.8,
  alternates: {
    languages: {
      'ru': `${siteUrl}/ru/blog/${post.slug}`,
      'en': `${siteUrl}/en/blog/${post.slug}`,
      'kk': `${siteUrl}/kz/blog/${post.slug}`,
    },
  },
}));
```

### Metadata для статей
```typescript
// app/[lang]/blog/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: 'article',
      publishedTime: post.publishedAt,
      authors: ['Aidar'],
      tags: post.tags,
    },
  };
}
```

### Structured Data для статей
```typescript
// Schema.org Article
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Заголовок",
  "author": {
    "@type": "Person",
    "name": "Aidar"
  },
  "datePublished": "2024-01-01",
  "dateModified": "2024-01-02"
}
```

## Важно для индексации

1. ✅ **Всегда рендерить на сервере** - не использовать только клиентский рендеринг
2. ✅ **Правильные URL** - `/blog/post-slug`, не `/blog?id=123`
3. ✅ **Sitemap** - добавлять все статьи
4. ✅ **RSS feed** - для подписок и индексации
5. ✅ **Canonical URLs** - избегать дублей
6. ✅ **Хлебные крошки** - для навигации и SEO

## Пример реализации

```typescript
// app/[lang]/blog/[slug]/page.tsx
export default async function BlogPost({ params }) {
  const post = await getPost(params.slug, params.lang);
  
  // SSG - генерируется на этапе сборки
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}

// Генерация статических страниц
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    lang: post.lang,
    slug: post.slug,
  }));
}
```

## Вывод

✅ **Блог с сервера индексируется отлично**, если:
- Используется SSR или SSG
- Правильные метаданные
- Sitemap обновляется
- Structured Data добавлен

❌ **Проблемы будут**, если:
- Контент загружается только через JavaScript (CSR)
- Нет метаданных
- Нет sitemap






