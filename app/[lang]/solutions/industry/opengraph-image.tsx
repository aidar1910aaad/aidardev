import { INDUSTRY_HUB } from '@/app/data/solutions';
import { renderOgImage } from '@/app/lib/og-image';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'aidardev';

// Раздел только на русском.
export function generateStaticParams() {
  return [{ lang: 'ru' }];
}

export default async function Image() {
  return renderOgImage({ eyebrow: INDUSTRY_HUB.kicker, title: INDUSTRY_HUB.title, lang: 'ru', path: 'aidardev.kz/ru/solutions/industry' });
}
