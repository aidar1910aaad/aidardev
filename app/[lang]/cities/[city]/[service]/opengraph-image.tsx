import { notFound } from 'next/navigation';
import { cityServiceCombos, getCityServiceContent, resolveCityService } from '@/app/data/city-services';
import { ogLang, renderOgImage } from '@/app/lib/og-image';
import { locales } from '@/app/lib/i18n';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'aidardev';

// Картинки всех пар «город × услуга» на всех языках собираются при сборке и отдаются из кэша.
export function generateStaticParams() {
  return locales.flatMap((lang) =>
    cityServiceCombos.map((combo) => ({ lang, city: combo.citySlug, service: combo.service })),
  );
}

export default async function Image({ params }: { params: Promise<{ lang: string; city: string; service: string }> }) {
  const { lang: rawLang, city: citySlug, service } = await params;
  const lang = ogLang(rawLang);
  const resolved = resolveCityService(citySlug, service);
  // Неизвестная пара — 404 без рендера (страница для неё тоже 404).
  if (!resolved) notFound();
  const content = getCityServiceContent(resolved.city, resolved.combo.service, lang);
  return renderOgImage({
    eyebrow: resolved.city.name[lang] || 'aidardev',
    title: content?.h1 || 'aidardev',
    lang,
    path: `aidardev.kz/${lang}/cities/${citySlug}/${service}`,
  });
}
