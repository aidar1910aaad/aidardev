/** Языки сайта: первый сегмент URL (/ru, /en, /kz). Единый список для маршрутов, proxy и ревалидации. */
export const locales = ['ru', 'en', 'kz'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ru';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Для generateStaticParams страниц и OG-картинок с одним параметром [lang]. */
export function localeParams(): Array<{ lang: Locale }> {
  return locales.map((lang) => ({ lang }));
}
