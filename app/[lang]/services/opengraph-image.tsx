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
  ru: 'Сайты, WhatsApp-боты, AI-автоматизация и мобильные приложения',
  kz: 'Сайттар, WhatsApp-боттар, AI-автоматтандыру және мобильді қосымшалар',
  en: 'Websites, WhatsApp bots, AI automation and mobile apps',
};
const eyebrow = { ru: 'Услуги', kz: 'Қызметтер', en: 'Services' };

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const lang = ogLang((await params).lang);
  return renderOgImage({ eyebrow: eyebrow[lang], title: title[lang], lang, path: `aidardev.kz/${lang}/services` });
}
