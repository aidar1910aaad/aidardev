import { ImageResponse } from 'next/og';
import { getBackendUrl } from '@/app/lib/backend-config';
import type { BlogPost } from '@/app/data/blog-posts';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const locale = (lang === 'kz' ? 'kz' : lang === 'en' ? 'en' : 'ru') as 'ru' | 'en' | 'kz';
  let post: BlogPost | null = null;
  try {
    const response = await fetch(`${getBackendUrl()}/api/blog/posts/${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 },
    });
    if (response.ok) post = (await response.json()).post || null;
  } catch {
    post = null;
  }
  const title = post?.title[locale] || 'AidarDev Blog';
  const category = post?.category[locale] || 'Product · Development · AI';

  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#f7f7f5', color: '#0f172a', padding: 72, borderTop: '18px solid #1d4ed8' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 28, color: '#1d4ed8' }}>
        <span>AIDARDEV</span><span>{locale.toUpperCase()}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 24, color: '#475569', marginBottom: 24 }}>{category}</div>
        <div style={{ fontSize: title.length > 80 ? 50 : 64, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>{title}</div>
      </div>
      <div style={{ fontSize: 24, color: '#475569' }}>aidardev.kz/{locale}/blog/{slug}</div>
    </div>,
    size,
  );
}
