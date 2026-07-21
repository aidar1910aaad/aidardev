'use client';

import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { servicesConfig, ServiceKey } from '../../data/services-config';
import AnimatedSection from '../common/AnimatedSection';
import Link from 'next/link';

interface RelatedServicesProps {
  currentServiceKey: ServiceKey;
}

const serviceIcons: Record<ServiceKey, string> = {
  websites: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
  bots: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  ai: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  mobile: 'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5A2.25 2.25 0 008.25 22.5h7.5A2.25 2.25 0 0018 20.25V3.75A2.25 2.25 0 0015.75 1.5H13.5m-3 0V3h3V1.5m-3 18.75h3',
  design: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
  consulting: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
};

const serviceNames: Record<ServiceKey, { ru: string; en: string; kz: string }> = {
  websites: { ru: 'Разработка сайтов', en: 'Website Development', kz: 'Сайттарды әзірлеу' },
  bots: { ru: 'Telegram и WhatsApp боты', en: 'Telegram & WhatsApp Bots', kz: 'Telegram және WhatsApp боттар' },
  ai: { ru: 'AI и машинное обучение', en: 'AI & Machine Learning', kz: 'AI және машиналық оқыту' },
  mobile: { ru: 'Мобильные приложения', en: 'Mobile Apps', kz: 'Мобильді қосымшалар' },
  design: { ru: 'UI/UX Дизайн', en: 'UI/UX Design', kz: 'UI/UX Дизайн' },
  consulting: { ru: 'Консультации', en: 'Consulting', kz: 'Кеңес' },
};

export default function RelatedServices({ currentServiceKey }: RelatedServicesProps) {
  const { t, language } = useLanguage();
  const config = servicesConfig[currentServiceKey];
  const relatedServices = config.relatedServices;

  if (!relatedServices || relatedServices.length === 0) return null;

  return (
    <AnimatedSection animationType="slide-up" delay={600}>
      <div className="mb-16">
        <div className="mb-10 border-b border-slate-300 pb-6">
          <h3 className="mb-3 text-3xl font-semibold tracking-[-0.035em] text-slate-950">
            {language === 'en' 
              ? 'Related Services' 
              : language === 'kz' 
                ? 'Қатысты қызметтер' 
                : 'Связанные услуги'}
          </h3>
          <p className="max-w-2xl leading-7 text-slate-600">
            {language === 'en'
              ? 'You might also be interested in these services'
              : language === 'kz'
                ? 'Сізді мына қызметтер де қызықтыруы мүмкін'
                : 'Вас также могут заинтересовать эти услуги'}
          </p>
        </div>

        <div className="grid grid-cols-1 border-l border-t border-slate-300 md:grid-cols-2 lg:grid-cols-3">
          {relatedServices.map((serviceKey, index) => {
            const serviceName = serviceNames[serviceKey][language as 'ru' | 'en' | 'kz'] || serviceNames[serviceKey].ru;
            const h1Key = `services.${serviceKey}.h1`;
            const title = t(h1Key);
            const shortTitle = title.split('|')[0].trim() || serviceName;
            const iconPath = serviceIcons[serviceKey];

            return (
              <AnimatedSection
                key={serviceKey}
                animationType="slide-up"
                delay={600 + index * 100}
              >
                <Link
                  href={`/${language}/services/${serviceKey}`}
                  className="group relative flex h-full flex-col border-b border-r border-slate-300 bg-white p-6 transition-colors hover:bg-blue-50/50"
                >
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center border border-blue-700 text-blue-700">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-slate-950 transition-colors group-hover:text-blue-700">
                          {shortTitle}
                        </h4>
                      </div>
                    </div>
                    
                    <p className="mb-4 flex-grow text-sm leading-6 text-slate-600">
                      {t(`services.${serviceKey}.intro`)}
                    </p>
                    
                    <div className="mt-auto flex items-center text-sm font-semibold text-blue-700 transition-all group-hover:gap-2">
                      <span>
                        {language === 'en' 
                          ? 'Learn more' 
                          : language === 'kz' 
                            ? 'Толығырақ' 
                            : 'Узнать больше'}
                      </span>
                      <svg 
                        className="w-4 h-4 ml-1 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}

