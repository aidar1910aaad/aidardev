'use client';

import React, { useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedSection from '../common/AnimatedSection';

interface ServiceContentProps {
  contentKey: string;
  serviceKey?: string;
}

// Иконки для разных преимуществ
const getFeatureIcon = (item: string) => {
  const itemLower = item.toLowerCase();
  
  if (itemLower.includes('адаптив') || itemLower.includes('mobile') || itemLower.includes('responsive')) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5A2.25 2.25 0 008.25 22.5h7.5A2.25 2.25 0 0018 20.25V3.75A2.25 2.25 0 0015.75 1.5H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    );
  } else if (itemLower.includes('скорост') || itemLower.includes('speed') || itemLower.includes('lighthouse') || itemLower.includes('загрузк') || itemLower.includes('loading')) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    );
  } else if (itemLower.includes('seo') || itemLower.includes('мета') || itemLower.includes('sitemap') || itemLower.includes('структурированн')) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    );
  } else if (itemLower.includes('аналитик') || itemLower.includes('analytics') || itemLower.includes('метрик') || itemLower.includes('google') || itemLower.includes('яндекс')) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    );
  } else if (itemLower.includes('безопасн') || itemLower.includes('security') || itemLower.includes('производительн') || itemLower.includes('performance') || itemLower.includes('оптимизац')) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    );
  } else if (itemLower.includes('ai') || itemLower.includes('ии') || itemLower.includes('искусственный интеллект') || itemLower.includes('машинное обучение') || itemLower.includes('machine learning') || itemLower.includes('gpt') || itemLower.includes('claude') || itemLower.includes('gemini')) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    );
  } else if (itemLower.includes('естественн') || itemLower.includes('natural') || itemLower.includes('язык') || itemLower.includes('language') || itemLower.includes('nlp')) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    );
  } else if (itemLower.includes('обучен') || itemLower.includes('training') || itemLower.includes('модел') || itemLower.includes('model') || itemLower.includes('tensorflow') || itemLower.includes('pytorch')) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    );
  } else if (itemLower.includes('непрерывн') || itemLower.includes('continuous') || itemLower.includes('оптимизац') || itemLower.includes('optimization')) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    );
  } else if (itemLower.includes('пользовател') || itemLower.includes('user') || itemLower.includes('центрирован') || itemLower.includes('centered')) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    );
  } else if (itemLower.includes('figma') || itemLower.includes('adobe') || itemLower.includes('sketch') || itemLower.includes('инструмент') || itemLower.includes('tool')) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    );
  } else if (itemLower.includes('доступн') || itemLower.includes('accessibility') || itemLower.includes('wcag')) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    );
  } else if (itemLower.includes('прототип') || itemLower.includes('prototype') || itemLower.includes('интерактивн') || itemLower.includes('interactive')) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
      </svg>
    );
  } else if (itemLower.includes('персонализирован') || itemLower.includes('personalized') || itemLower.includes('подход') || itemLower.includes('approach')) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    );
  } else if (itemLower.includes('практическ') || itemLower.includes('practical') || itemLower.includes('опыт') || itemLower.includes('experience') || itemLower.includes('пример') || itemLower.includes('example')) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    );
  } else if (itemLower.includes('документац') || itemLower.includes('documentation') || itemLower.includes('документ') || itemLower.includes('document')) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  } else if (itemLower.includes('гибк') || itemLower.includes('flexible') || itemLower.includes('график') || itemLower.includes('schedule') || itemLower.includes('удаленн') || itemLower.includes('remote')) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  } else if (itemLower.includes('практик') || itemLower.includes('practice') || itemLower.includes('рекомендац') || itemLower.includes('recommendation') || itemLower.includes('лучш') || itemLower.includes('best')) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  
  // Дефолтная иконка
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
};

export default function ServiceContent({ serviceKey = 'websites' }: ServiceContentProps) {
  const { t } = useLanguage();

  // Получаем данные из структурированных ключей
  const features = useMemo(() => {
    const title = t(`services.${serviceKey}.features.title`);
    
    // Если ключ не найден, возвращаем null
    if (title === `services.${serviceKey}.features.title`) return null;
    
    const items: Array<{ title: string; note: string | null }> = [];
    
    // Получаем элементы преимуществ (0-9)
    for (let i = 0; i < 10; i++) {
      const itemTitleKey = `services.${serviceKey}.features.${i}.title`;
      const itemTitle = t(itemTitleKey);
      
      // Если ключ не найден, значит элементов больше нет
      if (itemTitle === itemTitleKey) break;
      
      const noteKey = `services.${serviceKey}.features.${i}.note`;
      const note = t(noteKey);
      
      items.push({
        title: itemTitle,
        note: note === noteKey ? null : note,
      });
    }
    
    if (items.length === 0) return null;
    
    return { title, items };
  }, [t, serviceKey]);

  if (!features) return null;

  return (
    <AnimatedSection animationType="slide-up" delay={300}>
      <div className="mb-20">
        <div className="border-y border-slate-300 py-12">
          <div>
            <div className="mb-10 grid gap-6 md:grid-cols-2">
              <h3 className="text-3xl font-semibold tracking-[-0.035em] text-slate-950">
                {features.title}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 border-l border-t border-slate-300 md:grid-cols-2 lg:grid-cols-3">
              {features.items.map((item, index) => {
                const icon = getFeatureIcon(item.title);
                
                return (
                  <AnimatedSection
                    key={index}
                    animationType="slide-up"
                    delay={300 + index * 100}
                    className="group"
                  >
                    <div className="h-full border-b border-r border-slate-300 bg-white p-6 transition-colors hover:bg-blue-50/50">
                      <div>
                        <div className="flex items-start gap-4">
                          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center border border-blue-700 text-blue-700">
                            {icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-base leading-7 text-slate-800">
                              <span className="font-semibold">{item.title}</span>
                              {item.note && (
                                <span className="mt-1 block text-sm text-slate-500">
                                  {item.note}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
