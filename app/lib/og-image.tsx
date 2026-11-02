import { ImageResponse } from 'next/og';
import { notFound } from 'next/navigation';
import { translations } from '../contexts/translations';
import { isLocale } from './i18n';

/**
 * Карточка-превью для ссылок в WhatsApp, Telegram и соцсетях: заголовок страницы + бренд.
 * Шрифт с кириллицей и казахскими буквами грузится явно (Golos Text, только нужные глифы),
 * иначе генератор картинок падает на русском тексте.
 */

export type OgLang = 'ru' | 'en' | 'kz';
export const OG_SIZE = { width: 1200, height: 630 };

const tagline: Record<OgLang, string> = {
  ru: 'Студия разработки · Астана · Казахстан',
  kz: 'Әзірлеу студиясы · Астана · Қазақстан',
  en: 'Development studio · Astana · Kazakhstan',
};

/**
 * Язык из URL картинки. OG-картинки собираются при сборке по generateStaticParams, но
 * `dynamicParams` в opengraph-image Next.js не применяет, поэтому чужой первый сегмент
 * (/wp-login.php/opengraph-image) отсекаем здесь: 404 без рендера и без записи картинки в кэш.
 */
export function ogLang(value: string): OgLang {
  if (!isLocale(value)) notFound();
  return value;
}

/** Текст перевода без «| …»-хвоста, который используется в старых H1. */
export function ogTranslation(lang: OgLang, key: string, fallback: string): string {
  const value = translations[lang]?.[key] || translations.ru[key] || fallback;
  return value.split('|')[0].trim();
}

/**
 * Картинки собираются при сборке (generateStaticParams в каждом opengraph-image), поэтому шрифт
 * кэшируется без срока (force-cache): `revalidate` у fetch заставлял бы перегенерировать каждую
 * картинку раз в сутки. Пара повторов — чтобы разовый сбой Google Fonts не ронял сборку.
 */
async function loadFont(weight: 400 | 600, text: string, attempts = 3): Promise<ArrayBuffer | null> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Golos+Text:wght@${weight}&text=${encodeURIComponent(text)}`;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const cssResponse = await fetch(cssUrl, { cache: 'force-cache' });
      if (!cssResponse.ok) throw new Error(`Google Fonts CSS: ${cssResponse.status}`);
      const css = await cssResponse.text();
      const fontUrl = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
      if (!fontUrl) return null;
      const response = await fetch(fontUrl, { cache: 'force-cache' });
      if (!response.ok) throw new Error(`Google Fonts file: ${response.status}`);
      return await response.arrayBuffer();
    } catch (error) {
      if (attempt === attempts) {
        console.error('❌ [OG] Шрифт Golos Text не загрузился:', error);
        return null;
      }
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }
  return null;
}

export async function renderOgImage({
  eyebrow,
  title,
  lang,
  path,
}: {
  eyebrow: string;
  title: string;
  lang: OgLang;
  path: string;
}) {
  const bottom = tagline[lang];
  const glyphs = `aidar.dev ${eyebrow} ${title} ${bottom} ${path} …·—`;
  const [regular, semibold] = await Promise.all([loadFont(400, glyphs), loadFont(600, glyphs)]);
  const fonts = [
    ...(regular ? [{ name: 'Golos', data: regular, weight: 400 as const, style: 'normal' as const }] : []),
    ...(semibold ? [{ name: 'Golos', data: semibold, weight: 600 as const, style: 'normal' as const }] : []),
  ];
  const fontSize = title.length > 90 ? 50 : title.length > 60 ? 58 : 68;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#f4f2ec',
          color: '#11110f',
          padding: '60px 72px',
          fontFamily: fonts.length ? 'Golos' : 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', fontSize: 34, fontWeight: 600, letterSpacing: -1 }}>
            <span>aidar</span>
            <span style={{ color: '#2446e8' }}>.dev</span>
          </div>
          <div style={{ display: 'flex', fontSize: 22, color: '#68675f', letterSpacing: 2, textTransform: 'uppercase' }}>
            {eyebrow}
          </div>
        </div>
        <div style={{ display: 'flex', fontSize, fontWeight: 600, lineHeight: 1.08, letterSpacing: -1.5, maxWidth: 1040 }}>
          {title}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 24,
            color: '#68675f',
            borderTop: '2px solid #11110f',
            paddingTop: 22,
          }}
        >
          <span>{bottom}</span>
          <span style={{ color: '#2446e8' }}>{path}</span>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}

const serviceEyebrow: Record<OgLang, string> = { ru: 'Услуги', kz: 'Қызметтер', en: 'Services' };

export function serviceOgImage(service: string, langParam: string) {
  const lang = ogLang(langParam);
  return renderOgImage({
    eyebrow: serviceEyebrow[lang],
    title: ogTranslation(lang, `services.${service}.h1`, 'aidardev'),
    lang,
    path: `aidardev.kz/${lang}/services/${service}`,
  });
}
