'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedSection from '../common/AnimatedSection';
import { analyticsEvents } from '../../lib/analytics';

interface ServiceCard {
  title: string;
  description: string;
  extendedKey: string;
}

interface ServiceCardsProps {
  contentKey: string;
  serviceKey?: string;
}

// Иконки для разных типов услуг
const getServiceIcon = (title: string) => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('лендинг') || titleLower.includes('landing') || titleLower.includes('визитка') || titleLower.includes('business card')) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  } else if (titleLower.includes('корпоратив') || titleLower.includes('corporate')) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    );
  } else if (titleLower.includes('интернет-магазин') || titleLower.includes('e-commerce') || titleLower.includes('магазин') || titleLower.includes('ecommerce')) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    );
  } else if (titleLower.includes('saas') || titleLower.includes('crm') || titleLower.includes('платформ') || titleLower.includes('platform')) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    );
  } else if (titleLower.includes('редизайн') || titleLower.includes('модернизация') || titleLower.includes('redesign') || titleLower.includes('modernization')) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    );
  } else if (titleLower.includes('telegram') || titleLower.includes('whatsapp') || titleLower.includes('бот') || titleLower.includes('bot')) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    );
  } else if (titleLower.includes('автоматизация') || titleLower.includes('automation') || titleLower.includes('процесс') || titleLower.includes('process')) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    );
  } else if (titleLower.includes('ai') || titleLower.includes('ии') || titleLower.includes('искусственный интеллект') || titleLower.includes('машинное обучение') || titleLower.includes('machine learning') || titleLower.includes('gpt') || titleLower.includes('чатбот') || titleLower.includes('chatbot')) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    );
  } else if (titleLower.includes('изображен') || titleLower.includes('image') || titleLower.includes('генерац') || titleLower.includes('generation')) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
  } else if (titleLower.includes('дизайн') || titleLower.includes('design') || titleLower.includes('ui') || titleLower.includes('ux') || titleLower.includes('интерфейс') || titleLower.includes('interface')) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    );
  } else if (titleLower.includes('систем') || titleLower.includes('system') || titleLower.includes('гайдлайн') || titleLower.includes('guideline')) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  } else if (titleLower.includes('поддержка') || titleLower.includes('обслуживание') || titleLower.includes('support') || titleLower.includes('техническ') || titleLower.includes('technical')) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    );
  } else if (titleLower.includes('консультац') || titleLower.includes('обучение') || titleLower.includes('обучен') || titleLower.includes('training') || titleLower.includes('consulting') || titleLower.includes('менторинг') || titleLower.includes('mentoring') || titleLower.includes('code review') || titleLower.includes('архитектур') || titleLower.includes('architecture')) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    );
  }
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
};

export default function ServiceCards({ serviceKey = 'websites' }: ServiceCardsProps) {
  const { t } = useLanguage();
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});

  // Получаем карточки из структурированных данных
  const serviceCards = useMemo(() => {
    const cards: ServiceCard[] = [];
    
    // Пытаемся получить карточки по индексам (0-9)
    for (let i = 0; i < 10; i++) {
      const titleKey = `services.${serviceKey}.cards.${i}.title`;
      const title = t(titleKey);
      
      // Если ключ не найден (вернулся сам ключ), значит карточек больше нет
      if (title === titleKey) break;
      
      const description = t(`services.${serviceKey}.cards.${i}.description`);
      const extendedKey = `services.${serviceKey}.cards.${i}.extended`;
      
      cards.push({
        title,
        description,
        extendedKey,
      });
    }
    
    return cards;
  }, [t, serviceKey]);

  if (serviceCards.length === 0) return null;

  return (
    <AnimatedSection animationType="slide-up" delay={200}>
      <div className="mb-20">
        <div className="grid grid-cols-1 border-l border-t border-slate-300 md:grid-cols-2 lg:grid-cols-3">
          {serviceCards.map((card, index) => {
            const isExpanded = expandedCards[index] || false;
            const icon = getServiceIcon(card.title);
            
            return (
              <AnimatedSection 
                key={index}
                animationType="slide-up" 
                delay={index * 100}
                className="group relative overflow-hidden border-b border-r border-slate-300 bg-white transition-colors hover:bg-blue-50/50"
              >
                <div 
                  className="p-6 overflow-hidden transition-all duration-700 ease-in-out"
                  style={{
                    maxHeight: isExpanded ? '1000px' : '180px',
                  }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center border border-blue-700 text-blue-700">
                      {icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 text-xl font-semibold tracking-[-0.02em] text-slate-950">
                        {card.title}
                      </h3>
                      <p className="whitespace-pre-line text-sm leading-6 text-slate-600">
                        {card.description}
                      </p>
                      {isExpanded && (
                        <div className="mt-4 border-t border-slate-300 pt-4">
                          <p className="text-sm leading-6 text-slate-600">
                            {t(card.extendedKey)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Expand button */}
                <div className="border-t border-slate-300 px-6 pb-4">
                  <button
                    onClick={() => {
                      setExpandedCards(prev => ({
                        ...prev,
                        [index]: !prev[index],
                      }));
                      if (!isExpanded) {
                        analyticsEvents.serviceExpand(card.title);
                      }
                    }}
                    className="flex w-full items-center justify-center gap-2 py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 transition-colors hover:text-blue-700"
                  >
                    {isExpanded ? (
                      <>
                        <span>{t('about.services.hide')}</span>
                        <svg className="w-4 h-4 transition-transform duration-500 ease-in-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </>
                    ) : (
                      <>
                        <span>{t('about.services.more')}</span>
                        <svg className="w-4 h-4 transition-transform duration-500 ease-in-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
