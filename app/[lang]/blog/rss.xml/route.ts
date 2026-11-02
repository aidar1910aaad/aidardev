import { hasBlogContentForLang } from '@/app/lib/seo/blog-indexing';
import { BLOG_FEED_REVALIDATE_SECONDS, fetchPublishedBlogPosts } from '@/app/lib/blog-cache';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';
const escapeXml = (value: string) => value.replace(/[<>&'"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char] || char);

// Лента собирается при сборке и обновляется вебхуком бэкенда (тег blog-posts); срок — страховка на сутки.
export const revalidate = 86400;
// RSS есть только у RU и KZ: остальное — 404 без вызова функции.
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: 'ru' }, { lang: 'kz' }];
}

export async function GET(_request: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== 'ru' && lang !== 'kz') return new Response('Not found', { status: 404 });

  const posts = (await fetchPublishedBlogPosts(BLOG_FEED_REVALIDATE_SECONDS)).filter((post) => hasBlogContentForLang(post, lang));

  const items = posts.map((post) => {
    const url = `${siteUrl}/${lang}/blog/${post.slug}`;
    return `<item><title>${escapeXml(post.title[lang])}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><description>${escapeXml(post.description[lang])}</description><pubDate>${new Date(post.date).toUTCString()}</pubDate></item>`;
  }).join('');
  const title = lang === 'kz' ? 'AidarDev блогы' : 'Блог AidarDev';
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${title}</title><link>${siteUrl}/${lang}/blog</link><description>${title}</description><language>${lang === 'kz' ? 'kk-KZ' : 'ru-KZ'}</language>${items}</channel></rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
