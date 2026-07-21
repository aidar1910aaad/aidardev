'use client';

import { useLanguage } from '../../contexts/LanguageContext';
import Link from 'next/link';
import { ServiceKey } from '../../data/services-config';

// Иконки для разных услуг
const getServiceIcon = (serviceKey: ServiceKey) => {
  switch (serviceKey) {
    case 'websites':
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      );
    case 'bots':
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      );
    case 'ai':
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      );
    case 'mobile':
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5A2.25 2.25 0 008.25 22.5h7.5A2.25 2.25 0 0018 20.25V3.75A2.25 2.25 0 0015.75 1.5H13.5m-3 0V3h3V1.5m-3 18.75h3" />
        </svg>
      );
    case 'design':
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      );
    case 'consulting':
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    default:
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
  }
};

export default function ServiceCardClient({ serviceKey, lang }: { serviceKey: ServiceKey; lang: string }) {
  const { t } = useLanguage();
  
  const h1Key = `services.${serviceKey}.h1`;
  const introKey = `services.${serviceKey}.intro`;
  
  const title = t(h1Key);
  const intro = t(introKey);
  
  // Извлекаем короткое название из H1 (до первого |)
  const shortTitle = title.split('|')[0].trim();
  
  return (
    <Link 
      href={`/${lang}/services/${serviceKey}`}
      className="group block h-full border-b border-r border-slate-300 bg-white transition-colors hover:bg-blue-50/50"
    >
      <article className="flex h-full min-h-72 flex-col p-7 sm:p-8">
        <div className="mb-12 flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center border border-blue-700 text-blue-700">
              {getServiceIcon(serviceKey)}
            </div>
            <span className="font-mono text-xs text-slate-400">0{Object.keys({websites:1,bots:1,ai:1,mobile:1,design:1,consulting:1}).indexOf(serviceKey) + 1}</span>
        </div>
        <div className="flex flex-1 flex-col">
              <h2 className="mb-3 text-2xl font-semibold tracking-[-0.025em] text-slate-950 transition-colors group-hover:text-blue-700">
                {shortTitle}
              </h2>
              <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                {intro}
              </p>
              <span className="mt-auto flex items-center gap-2 pt-8 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
                {t('about.services.learnMore')}
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
        </div>
      </article>
    </Link>
  );
}

