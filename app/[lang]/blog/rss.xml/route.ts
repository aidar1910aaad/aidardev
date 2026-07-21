import { getBackendUrl } from '@/app/lib/backend-config';
import type { BlogPost } from '@/app/data/blog-posts';
import { hasBlogContentForLang } from '@/app/lib/seo/blog-indexing';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';
const escapeXml = (value: string) => value.replace(/[<>&'"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char] || char);

export async function GET(_request: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== 'ru' && lang !== 'kz') return new Response('Not found', { status: 404 });

  let posts: BlogPost[] = [];
  try {
    const response = await fetch(`${getBackendUrl()}/api/blog/posts?published=true`, { next: { revalidate: 300 } });
    if (response.ok) {
      const data = await response.json();
      posts = (data.posts || data || []).filter((post: BlogPost) => hasBlogContentForLang(post, lang));
    }
  } catch {
    posts = [];
  }

  const items = posts.map((post) => {
    const url = `${siteUrl}/${lang}/blog/${post.slug}`;
    return `<item><title>${escapeXml(post.title[lang])}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><description>${escapeXml(post.description[lang])}</description><pubDate>${new Date(post.date).toUTCString()}</pubDate></item>`;
  }).join('');
  const title = lang === 'kz' ? 'AidarDev блогы' : 'Блог AidarDev';
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${title}</title><link>${siteUrl}/${lang}/blog</link><description>${title}</description><language>${lang === 'kz' ? 'kk-KZ' : 'ru-KZ'}</language>${items}</channel></rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
    },
  });
}
