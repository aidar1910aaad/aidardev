import { ogLang, ogTranslation, renderOgImage } from '@/app/lib/og-image';
import { localeParams } from '@/app/lib/i18n';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'aidardev';

// Картинка собирается при сборке для каждого языка и отдаётся из кэша (раньше рендерилась на каждый запрос).
export function generateStaticParams() {
  return localeParams();
}

const eyebrow = { ru: 'Сайты · боты · AI', kz: 'Сайттар · боттар · AI', en: 'Websites · bots · AI' };

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const lang = ogLang((await params).lang);
  // В KZ заголовок собран из трёх частей: «Назарды» + «өтінімге» + «айналдыратын …».
  const end = lang === 'kz' ? ogTranslation(lang, 'home.hero.titleEnd', '') : '';
  const title = [ogTranslation(lang, 'home.hero.title', 'aidardev'), ogTranslation(lang, 'home.hero.titleAccent', ''), end]
    .filter(Boolean)
    .join(' ');
  return renderOgImage({ eyebrow: eyebrow[lang], title, lang, path: `aidardev.kz/${lang}` });
}
