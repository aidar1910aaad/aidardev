'use client';

import type { BlogLang } from '../../lib/blog-utils';
import { BlogCta } from './BlogArticleExperience';

type Localized = { ru?: string; en?: string; kz?: string };

type Props = {
  slug: string;
  lang: BlogLang;
  title?: Localized;
  excerpt?: Localized;
  category?: Localized;
  content?: Localized;
  date?: string;
  readingTime?: number;
  compact?: boolean;
};

function formatDate(date: string | undefined, lang: BlogLang) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString(
    lang === 'ru' ? 'ru-RU' : lang === 'kz' ? 'kk-KZ' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' },
  );
}

export default function BlogAdminPreview({
  slug,
  lang,
  title,
  excerpt,
  category,
  content,
  date,
  readingTime = 5,
  compact = false,
}: Props) {
  const heading = title?.[lang]?.trim() || 'Без заголовка';
  const categoryLabel = category?.[lang]?.trim() || 'Без категории';
  const excerptText = excerpt?.[lang]?.trim() || '';
  const html = content?.[lang] || '';
  const paragraphs = html.match(/<\/p>/gi)?.length || 0;
  const mid = Math.max(1, Math.floor(paragraphs / 2));
  let seen = 0;
  const parts = html.split(/(<\/p>)/i);
  let before = '';
  let after = '';
  for (let i = 0; i < parts.length; i += 1) {
    const chunk = parts[i];
    if (seen < mid) before += chunk;
    else after += chunk;
    if (/<\/p>/i.test(chunk)) seen += 1;
  }
  if (!before && html) {
    before = html;
    after = '';
  }

  return (
    <div className={`bg-[#f7f7f5] text-slate-950 ${compact ? 'rounded-xl border border-slate-300' : ''}`}>
      <div className={`${compact ? 'p-4 sm:p-6' : 'p-6 sm:p-10'} mx-auto max-w-4xl`}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-300 pb-3 text-[10px] uppercase tracking-[0.14em] text-slate-500">
          <span>Предпросмотр как на сайте · /{lang}/blog/{slug || 'slug'}</span>
          <span className="rounded border border-slate-400 px-2 py-0.5">Live</span>
        </div>

        <header className="mb-8 border-b border-slate-300 pb-8">
          <span className="mb-4 inline-block border border-blue-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
            {categoryLabel}
          </span>
          <h1 className={`font-semibold leading-[1.05] tracking-[-0.045em] text-slate-950 ${compact ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-5xl'}`}>
            {heading}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-wider text-slate-500">
            <time dateTime={date}>{formatDate(date, lang)}</time>
            <span>•</span>
            <span>
              {readingTime} {lang === 'kz' ? 'мин оқу' : lang === 'en' ? 'min read' : 'мин чтения'}
            </span>
          </div>
        </header>

        {excerptText ? (
          <div className="mb-8 border-l-2 border-blue-700 pl-5 text-lg leading-7 text-slate-700 sm:text-xl sm:leading-8">
            {excerptText}
          </div>
        ) : null}

        {html ? (
          <>
            <div
              className="blog-content w-full max-w-full overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: before }}
            />
            <BlogCta slug={slug || 'preview'} title={heading} lang={lang} placement="inline" />
            {after ? (
              <div
                className="blog-content w-full max-w-full overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: after }}
              />
            ) : null}
            <BlogCta slug={slug || 'preview'} title={heading} lang={lang} placement="end" />
          </>
        ) : (
          <p className="rounded-lg border border-dashed border-slate-400 bg-white px-4 py-8 text-center text-slate-500">
            Контент для этого языка пока пустой
          </p>
        )}
      </div>
    </div>
  );
}
