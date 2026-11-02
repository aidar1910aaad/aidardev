import { ogLang, renderOgImage } from '@/app/lib/og-image';
import { localeParams } from '@/app/lib/i18n';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'aidardev';

// Картинка собирается при сборке для каждого языка и отдаётся из кэша (раньше рендерилась на каждый запрос).
export function generateStaticParams() {
  return localeParams();
}

const title = {
  ru: 'Цены на сайты, ботов, AI-автоматизацию и приложения',
  kz: 'Сайттар, боттар, AI-автоматтандыру және қосымшалар бағасы',
  en: 'Pricing for websites, bots, AI automation and apps',
};
const eyebrow = { ru: 'Цены', kz: 'Бағалар', en: 'Pricing' };

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const lang = ogLang((await params).lang);
  return renderOgImage({ eyebrow: eyebrow[lang], title: title[lang], lang, path: `aidardev.kz/${lang}/pricing` });
}
