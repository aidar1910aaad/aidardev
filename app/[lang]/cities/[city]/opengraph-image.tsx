import { getCityBySlug, getCityLandingContent } from '@/app/data/cities';
import { ogLang, renderOgImage } from '@/app/lib/og-image';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'aidardev';

export default async function Image({ params }: { params: Promise<{ lang: string; city: string }> }) {
  const { lang: rawLang, city: slug } = await params;
  const lang = ogLang(rawLang);
  const city = getCityBySlug(slug);
  const title = city ? getCityLandingContent(city, lang).h1 : 'aidardev';
  return renderOgImage({ eyebrow: city?.name[lang] || 'aidardev', title, lang, path: `aidardev.kz/${lang}/cities/${slug}` });
}
