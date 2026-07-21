'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { BlogPost } from '../../data/blog-posts';
import type { ServiceKey } from '../../data/services-config';
import { analyticsEvents } from '../../lib/analytics';
import { buildWhatsAppUrl, type BlogLang } from '../../lib/blog-utils';
import { PRIMARY_WHATSAPP_NUMBER } from '../../lib/whatsapp';

type Props = {
  slug: string;
  title: string;
  lang: BlogLang;
  placement: 'inline' | 'end';
  relatedPosts?: BlogPost[];
  relatedServices?: ServiceKey[];
};

const serviceNames: Record<ServiceKey, Record<BlogLang, string>> = {
  websites: { ru: 'Разработка сайтов', en: 'Website development', kz: 'Сайттарды әзірлеу' },
  bots: { ru: 'Telegram и WhatsApp боты', en: 'Telegram & WhatsApp bots', kz: 'Telegram және WhatsApp боттар' },
  ai: { ru: 'AI-интеграции', en: 'AI integrations', kz: 'AI интеграциялары' },
  mobile: { ru: 'Мобильные приложения', en: 'Mobile apps', kz: 'Мобильді қосымшалар' },
  design: { ru: 'UI/UX дизайн', en: 'UI/UX design', kz: 'UI/UX дизайн' },
  consulting: { ru: 'Консультация', en: 'Consulting', kz: 'Кеңес' },
};

export function BlogAnalytics({ slug, lang }: Pick<Props, 'slug' | 'lang'>) {
  const viewed = useRef(false);
  const sentDepths = useRef(new Set<number>());

  useEffect(() => {
    if (!viewed.current) {
      viewed.current = true;
      analyticsEvents.blogView(slug, lang);
    }
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const depth = Math.round((window.scrollY / total) * 100);
      [25, 50, 75, 100].forEach((threshold) => {
        if (depth >= threshold && !sentDepths.current.has(threshold)) {
          sentDepths.current.add(threshold);
          analyticsEvents.blogScrollDepth(slug, lang, threshold);
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [lang, slug]);

  return null;
}

export function BlogCta({ slug, title, lang, placement }: Props) {
  const [projectType, setProjectType] = useState('');
  const [budgetOrTask, setBudgetOrTask] = useState('');
  const url = useMemo(
    () => buildWhatsAppUrl({ slug, title, locale: lang, projectType, budgetOrTask }),
    [budgetOrTask, lang, projectType, slug, title],
  );
  const copy = lang === 'kz'
    ? { heading: 'Ұқсас жобаны талқылайық', text: 'Қысқаша толтырыңыз — WhatsApp-та дайын хабарлама ашылады. Бос қалдыруға болады.', project: 'Жоба түрі (қалауынша)', task: 'Міндет немесе бюджет (қалауынша)', button: 'WhatsApp-та жазу' }
    : lang === 'en'
      ? { heading: 'Let’s discuss a similar project', text: 'Optional details — WhatsApp opens with a ready message.', project: 'Project type (optional)', task: 'Budget or task (optional)', button: 'Message on WhatsApp' }
      : { heading: 'Обсудим похожий проект', text: 'Можно заполнить коротко или сразу написать — WhatsApp откроется с нормальным сообщением.', project: 'Тип проекта (необязательно)', task: 'Задача или бюджет (необязательно)', button: 'Написать в WhatsApp' };

  return (
    <aside className={`${placement === 'end' ? 'border-2 border-blue-700 bg-blue-50 p-7 sm:p-10' : 'my-10 border-y border-slate-300 bg-white p-6'} not-prose`} aria-label={copy.heading}>
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{copy.heading}</h2>
      <p className="mt-2 text-slate-600">{copy.text}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">
          {copy.project}
          <input value={projectType} onChange={(event) => setProjectType(event.target.value)} className="mt-1 w-full border border-slate-400 bg-white px-3 py-3 text-base" maxLength={100} />
        </label>
        <label className="text-sm font-medium text-slate-700">
          {copy.task}
          <input value={budgetOrTask} onChange={(event) => setBudgetOrTask(event.target.value)} className="mt-1 w-full border border-slate-400 bg-white px-3 py-3 text-base" maxLength={180} />
        </label>
      </div>
      <a href={url} target="_blank" rel="noopener noreferrer" onClick={() => analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, `blog_${placement}`)} className="mt-5 inline-flex min-h-12 items-center justify-center bg-green-700 px-6 py-3 font-semibold text-white outline-offset-4 hover:bg-green-800 focus-visible:outline-2 focus-visible:outline-blue-700">
        {copy.button}
      </a>
      <p className="mt-3 text-xs text-slate-500">{lang === 'kz' ? 'Деректер сайтта сақталмайды.' : lang === 'en' ? 'The details are not stored on this site.' : 'Данные не сохраняются на сайте.'}</p>
    </aside>
  );
}

export function BlogRelated({ slug, lang, relatedPosts = [], relatedServices = [] }: Props) {
  if (!relatedPosts.length && !relatedServices.length) return null;
  return (
    <section className="mt-14 border-t border-slate-300 pt-10" aria-labelledby="blog-related-heading">
      <h2 id="blog-related-heading" className="text-3xl font-semibold">{lang === 'kz' ? 'Тақырып бойынша' : lang === 'en' ? 'Related' : 'По теме'}</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {relatedPosts.map((post) => (
          <Link key={post.slug} href={`/${lang}/blog/${post.slug}`} onClick={() => analyticsEvents.blogRelatedClick(slug, post.slug, lang, 'post')} className="border border-slate-300 bg-white p-5 font-semibold hover:border-blue-700 hover:text-blue-700">
            {post.title[lang]}
          </Link>
        ))}
        {relatedServices.map((service) => (
          <Link key={service} href={`/${lang}/services/${service}`} onClick={() => analyticsEvents.blogRelatedClick(slug, service, lang, 'service')} className="border border-blue-200 bg-blue-50 p-5 font-semibold text-blue-800 hover:border-blue-700">
            {serviceNames[service][lang]}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function BlogStickyCta({ slug, title, lang }: Pick<Props, 'slug' | 'title' | 'lang'>) {
  const url = buildWhatsAppUrl({ slug, title, locale: lang });
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" onClick={() => analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, 'blog_sticky')} aria-label={lang === 'kz' ? 'WhatsApp-та жобаны талқылау' : 'Обсудить проект в WhatsApp'} className="fixed inset-x-4 bottom-4 z-40 flex min-h-12 items-center justify-center bg-green-700 px-5 py-3 font-semibold text-white shadow-xl outline-offset-4 focus-visible:outline-2 focus-visible:outline-blue-700 md:hidden">
      WhatsApp · {lang === 'kz' ? 'Жобаны талқылау' : lang === 'en' ? 'Discuss a project' : 'Обсудить проект'}
    </a>
  );
}
