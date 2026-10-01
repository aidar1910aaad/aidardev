import { serviceOgImage } from '@/app/lib/og-image';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'aidardev';

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return serviceOgImage('ai', lang);
}
