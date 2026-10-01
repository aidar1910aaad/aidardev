import { getCityServiceContent, resolveCityService } from '@/app/data/city-services';
import { ogLang, renderOgImage } from '@/app/lib/og-image';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'aidardev';

export default async function Image({ params }: { params: Promise<{ lang: string; city: string; service: string }> }) {
  const { lang: rawLang, city: citySlug, service } = await params;
  const lang = ogLang(rawLang);
  const resolved = resolveCityService(citySlug, service);
  const content = resolved ? getCityServiceContent(resolved.city, resolved.combo.service, lang) : null;
  return renderOgImage({
    eyebrow: resolved?.city.name[lang] || 'aidardev',
    title: content?.h1 || 'aidardev',
    lang,
    path: `aidardev.kz/${lang}/cities/${citySlug}/${service}`,
  });
}
