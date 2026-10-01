import { renderOgImage } from '@/app/lib/og-image';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'aidardev';

export default async function Image() {
  return renderOgImage({
    eyebrow: 'Сайты · боты · AI',
    title: 'Сайты, WhatsApp-боты и AI-автоматизация, которые приносят заявки',
    lang: 'ru',
    path: 'aidardev.kz',
  });
}
