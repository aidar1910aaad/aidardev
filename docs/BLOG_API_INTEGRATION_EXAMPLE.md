# Пример интеграции блога с API

## Быстрый старт

### 1. Бэкендер создает API endpoints:

```javascript
// Пример на Express.js (бэкендер может использовать любую технологию)

// GET /api/blog/posts - получить все статьи
app.get('/api/blog/posts', async (req, res) => {
  const posts = await db.getPosts({ published: true });
  
  res.json({
    posts: posts.map(post => ({
      id: post.id,
      slug: post.slug,
      title: {
        ru: post.title_ru,
        en: post.title_en,
        kz: post.title_kz,
      },
      description: {
        ru: post.description_ru,
        en: post.description_en,
        kz: post.description_kz,
      },
      // ... остальные поля
    }))
  });
});

// GET /api/blog/posts/:slug - получить одну статью
app.get('/api/blog/posts/:slug', async (req, res) => {
  const post = await db.getPostBySlug(req.params.slug);
  
  if (!post || !post.published) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  res.json({
    post: {
      id: post.id,
      slug: post.slug,
      // ... все поля
    }
  });
});
```

### 2. Добавить переменную окружения

В `.env.local`:
```env
NEXT_PUBLIC_BLOG_API_URL=https://your-backend-api.com/api/blog
```

### 3. Переключить код на API (когда API готов)

В файле `app/[lang]/blog/[slug]/page.tsx` изменить:

**Было:**
```typescript
import { getBlogPostBySlug } from "../../../data/blog-posts";

const post = getBlogPostBySlug(slug);
```

**Стало:**
```typescript
import { fetchPostBySlugFromAPI, isAPIEnabled } from "../../../lib/blog-api";
import { getBlogPostBySlug } from "../../../data/blog-posts";

// Используем API если включен, иначе локальные данные
const post = isAPIEnabled() 
  ? await fetchPostBySlugFromAPI(slug)
  : getBlogPostBySlug(slug);
```

Аналогично для `app/[lang]/blog/page.tsx`:

```typescript
import { fetchAllPostsFromAPI, isAPIEnabled } from "../../lib/blog-api";
import { getAllBlogPosts } from "../../data/blog-posts";

const blogPosts = isAPIEnabled()
  ? await fetchAllPostsFromAPI()
  : getAllBlogPosts();
```

---

## Структура данных (что должен вернуть API)

```typescript
{
  posts: [
    {
      id: "1",                          // Уникальный ID
      slug: "kak-uvelichit-konversiyu", // URL-friendly идентификатор
      title: {
        ru: "Заголовок на русском",
        en: "Title in English", 
        kz: "Қазақ тіліндегі тақырып"
      },
      description: {
        ru: "Мета-описание для SEO",
        en: "Meta description for SEO",
        kz: "SEO үшін мета-сипаттама"
      },
      excerpt: {
        ru: "Краткое описание для карточки",
        en: "Short description for card",
        kz: "Карточка үшін қысқаша сипаттама"
      },
      category: {
        ru: "Маркетинг и SEO",
        en: "Marketing & SEO",
        kz: "Маркетинг және SEO"
      },
      date: "2024-01-15",              // Формат YYYY-MM-DD
      keywords: {
        ru: ["ключевое", "слово"],
        en: ["keyword", "word"],
        kz: ["кілт", "сөз"]
      },
      readingTime: 8,                   // Минуты чтения
      published: true,                   // Только опубликованные
      content: {                         // Опционально: полный контент
        ru: "<p>HTML контент...</p>",
        en: "<p>HTML content...</p>",
        kz: "<p>HTML мазмұны...</p>"
      }
    }
  ]
}
```

---

## Важные моменты для бэкендера

1. **CORS** - разрешить запросы с домена сайта
2. **Только published** - возвращать только статьи где `published: true`
3. **Сортировка** - по дате (новые первые)
4. **Кодировка** - UTF-8
5. **Скорость** - ответ < 500ms
6. **Обработка ошибок** - 404 для несуществующих статей

---

## Тестирование API

Бэкендер может протестировать так:

```bash
# Получить все статьи
curl https://your-api.com/api/blog/posts

# Получить одну статью
curl https://your-api.com/api/blog/posts/kak-uvelichit-konversiyu
```

После того как API готов - просто скажите URL, и мы подключим! 🚀





