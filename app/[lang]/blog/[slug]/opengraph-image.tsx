import { fetchBackend, getBackendUrl } from '@/app/lib/backend-config';
import { ogLang, renderOgImage } from '@/app/lib/og-image';
import type { BlogPost } from '@/app/data/blog-posts';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'aidardev';

export default async function OpenGraphImage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang: rawLang, slug } = await params;
  const lang = ogLang(rawLang);
  let post: BlogPost | null = null;
  try {
    const response = await fetchBackend(`${getBackendUrl()}/api/blog/posts/${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 },
    });
    if (response.ok) post = (await response.json()).post || null;
  } catch {
    post = null;
  }

  return renderOgImage({
    eyebrow: post?.category?.[lang] || post?.category?.ru || (lang === 'en' ? 'Blog' : 'Блог'),
    title: post?.title?.[lang] || post?.title?.ru || 'Блог aidardev',
    lang,
    path: `aidardev.kz/${lang}/blog`,
  });
}
