import { notFound } from 'next/navigation';
import { cityEntries, getCityBySlug, getCityLandingContent } from '@/app/data/cities';
import { ogLang, renderOgImage } from '@/app/lib/og-image';
import { locales } from '@/app/lib/i18n';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'aidardev';

// Картинки всех городов на всех языках собираются при сборке и отдаются из кэша.
export function generateStaticParams() {
  return locales.flatMap((lang) => cityEntries.map((city) => ({ lang, city: city.slug })));
}

export default async function Image({ params }: { params: Promise<{ lang: string; city: string }> }) {
  const { lang: rawLang, city: slug } = await params;
  const lang = ogLang(rawLang);
  const city = getCityBySlug(slug);
  // Неизвестный город — 404 без рендера (страница города для него тоже 404).
  if (!city) notFound();
  const title = getCityLandingContent(city, lang).h1;
  return renderOgImage({ eyebrow: city.name[lang] || 'aidardev', title, lang, path: `aidardev.kz/${lang}/cities/${slug}` });
}
