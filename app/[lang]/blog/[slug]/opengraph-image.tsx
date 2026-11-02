import { notFound } from 'next/navigation';
import { ogLang, renderOgImage } from '@/app/lib/og-image';
import { fetchBlogPost, fetchPublishedBlogPosts, isValidBlogSlug } from '@/app/lib/blog-cache';
import { shouldIndexBlogPost } from '@/app/lib/seo/blog-indexing';
import type { BlogPost } from '@/app/data/blog-posts';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'aidardev';

// Как у страницы статьи: обновляется вебхуком бэкенда (тег blog-post:<slug>), срок — страховка на неделю.
export const revalidate = 604800;

// Картинки опубликованных статей (те же пары язык × slug, что у страниц) собираются при сборке;
// новые статьи рендерятся при первом запросе и попадают в кэш.
export async function generateStaticParams() {
  try {
    const posts = await fetchPublishedBlogPosts();
    return ['ru', 'kz'].flatMap((lang) =>
      posts.filter((post) => shouldIndexBlogPost(post, lang)).map((post) => ({ lang, slug: post.slug })),
    );
  } catch (error) {
    console.error('Ошибка генерации статических параметров OG-картинок блога:', error);
    return [];
  }
}

export default async function OpenGraphImage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang: rawLang, slug } = await params;
  const lang = ogLang(rawLang);
  // Мусорный slug (/ru/blog/wp-login.php/opengraph-image) — 404 без запроса к бэкенду и рендера.
  if (!isValidBlogSlug(slug)) notFound();
  const post: BlogPost | null = await fetchBlogPost(slug);

  return renderOgImage({
    eyebrow: post?.category?.[lang] || post?.category?.ru || (lang === 'en' ? 'Blog' : 'Блог'),
    title: post?.title?.[lang] || post?.title?.ru || 'Блог aidardev',
    lang,
    path: `aidardev.kz/${lang}/blog`,
  });
}
