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
  ru: 'Блог о сайтах, ботах и AI для бизнеса в Казахстане',
  kz: 'Қазақстандағы бизнеске арналған сайттар, боттар және AI туралы блог',
  en: 'Blog about websites, bots and AI for business in Kazakhstan',
};
const eyebrow = { ru: 'Блог', kz: 'Блог', en: 'Blog' };

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const lang = ogLang((await params).lang);
  return renderOgImage({ eyebrow: eyebrow[lang], title: title[lang], lang, path: `aidardev.kz/${lang}/blog` });
}
