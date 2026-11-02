import { serviceOgImage } from '@/app/lib/og-image';
import { localeParams } from '@/app/lib/i18n';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'aidardev';

// Картинка собирается при сборке для каждого языка и отдаётся из кэша (раньше рендерилась на каждый запрос).
export function generateStaticParams() {
  return localeParams();
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return serviceOgImage('mobile', lang);
}
