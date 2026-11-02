import { getAllBlogPosts, getBlogPostBySlug, type BlogPost } from '../data/blog-posts';
import { fetchBackend, getBackendUrl } from './backend-config';

/**
 * Кэш блога. Страницы блога, RSS, sitemap и OG-картинки статей обновляются по вебхуку бэкенда
 * (app/api/blog/revalidate) через теги ниже; срок ревалидации — лишь страховка на случай,
 * если вебхук не дошёл. Каждая перегенерация — это запись в ISR-кэш Vercel, поэтому срок длинный.
 */

/** Страховочный срок для страниц блога и OG-картинок статей: неделя. */
export const BLOG_REVALIDATE_SECONDS = 604800;
/** RSS и sitemap: сутки. */
export const BLOG_FEED_REVALIDATE_SECONDS = 86400;

/** Список статей (индекс блога, RSS, sitemap). */
export const BLOG_POSTS_TAG = 'blog-posts';

/**
 * Список для блока «По теме» в статьях. Вебхук этот тег не сбрасывает: иначе каждая правка одной
 * статьи (ночной крон бэкенда правит до 5 статей за ночь) перестраивала бы все ~90 статей.
 * Новая статья попадёт в «По теме» других статей в пределах недели (срок ревалидации).
 */
export const BLOG_RELATED_TAG = 'blog-related';

/** Одна статья (страница статьи и её OG-картинка). */
export function blogPostTag(slug: string): string {
  return `blog-post:${slug}`;
}

/** Формат slug, который создаёт бэкенд; тот же, что принимает вебхук ревалидации. */
const BLOG_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const BLOG_SLUG_MAX_LENGTH = 200;

/** Отсекает мусорные URL (/ru/blog/wp-login.php и т.п.) до запроса к бэкенду. */
export function isValidBlogSlug(slug: string): boolean {
  return slug.length <= BLOG_SLUG_MAX_LENGTH && BLOG_SLUG_PATTERN.test(slug);
}

/**
 * Сбой бэкенда во время перегенерации на проде: бросаем ошибку, чтобы Next.js оставил в кэше
 * прежнюю версию страницы, а не записал пустой блог или 404 на неделю. При сборке и в dev —
 * прежнее поведение (пустой список / 404 / локальные данные), чтобы разовый сбой не ломал сборку.
 */
export function shouldKeepStaleOnBackendError(): boolean {
  return process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE !== 'phase-production-build';
}

/**
 * Опубликованные статьи со всеми языками и HTML. Только для сервера: в клиентские компоненты
 * передавайте карточки (toBlogPostCard / toBlogRelatedPost из blog-utils).
 */
export async function fetchPublishedBlogPosts(
  revalidate: number = BLOG_REVALIDATE_SECONDS,
  tag: string = BLOG_POSTS_TAG,
): Promise<BlogPost[]> {
  try {
    // Тег не входит в ключ кэша fetch, поэтому у каждого тега свой URL (бэкенд игнорирует query),
    // иначе список «По теме» делил бы запись в кэше со списком blog-posts.
    const response = await fetchBackend(`${getBackendUrl()}/api/blog/posts?published=true&cache=${tag}`, {
      next: { revalidate, tags: [tag] },
    });
    if (!response.ok) throw new Error(`Бэкенд ответил ${response.status}`);
    const result = await response.json();
    const posts: BlogPost[] = result.posts || result || [];
    return posts.filter((post) => post.published !== false);
  } catch (error) {
    if (shouldKeepStaleOnBackendError()) throw error;
    console.error('❌ [Blog] Ошибка загрузки списка статей:', error);
    return process.env.NODE_ENV === 'development' ? getAllBlogPosts() : [];
  }
}

/** Статья по slug; null — статьи нет (или slug не похож на настоящий). */
export async function fetchBlogPost(slug: string): Promise<BlogPost | null> {
  if (!isValidBlogSlug(slug)) return null;
  try {
    const response = await fetchBackend(`${getBackendUrl()}/api/blog/posts/${slug}`, {
      next: { revalidate: BLOG_REVALIDATE_SECONDS, tags: [blogPostTag(slug)] },
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Бэкенд ответил ${response.status}`);
    const result = await response.json();
    return result.post || null;
  } catch (error) {
    if (shouldKeepStaleOnBackendError()) throw error;
    console.error(`❌ [Blog] Ошибка загрузки статьи ${slug}:`, error);
    return process.env.NODE_ENV === 'development' ? getBlogPostBySlug(slug) ?? null : null;
  }
}
