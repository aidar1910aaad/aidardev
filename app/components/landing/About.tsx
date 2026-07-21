'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedSection from '../common/AnimatedSection';
import { analyticsEvents } from '../../lib/analytics';
import StructuredData from '../SEO/StructuredData';
import { createServiceSchema } from '../../lib/schemas';
import Link from 'next/link';

export default function About() {
  const { t, language } = useLanguage();
  const [expandedServices, setExpandedServices] = useState<Record<number, boolean>>({});

  const serviceKeys = ['websites', 'bots', 'ai', 'mobile', 'design', 'consulting'];

  const services = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label={t('about.services.websites.title')}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: t('about.services.websites.title'),
      description: t('about.services.websites.description'),
      details: t('about.services.websites.details'),
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label={t('about.services.bots.title')}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      title: t('about.services.bots.title'),
      description: t('about.services.bots.description'),
      details: t('about.services.bots.details'),
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label={t('about.services.ai.title')}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: t('about.services.ai.title'),
      description: t('about.services.ai.description'),
      details: t('about.services.ai.details'),
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label={t('about.services.mobile.title')}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: t('about.services.mobile.title'),
      description: t('about.services.mobile.description'),
      details: t('about.services.mobile.details'),
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label={t('about.services.design.title')}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      title: t('about.services.design.title'),
      description: t('about.services.design.description'),
      details: t('about.services.design.details'),
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label={t('about.services.consulting.title')}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: t('about.services.consulting.title'),
      description: t('about.services.consulting.description'),
      details: t('about.services.consulting.details'),
    },
  ];

  const toggleService = (index: number) => {
    setExpandedServices(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Структурированные данные для услуг
  const servicesSchema = useMemo(() => {
    return services.map(service => createServiceSchema({
      name: service.title,
      description: service.description,
      provider: 'Aidar',
      areaServed: 'Kazakhstan',
    }));
  }, [services]);

  return (
    <>
      {/* Структурированные данные для каждой услуги */}
      {servicesSchema.map((schema, index) => (
        <StructuredData key={`service-${index}`} data={schema} />
      ))}
      
    <section id="about" className="border-y border-slate-200 bg-stone-50 py-24 dark:border-slate-800 dark:bg-slate-950 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection animationType="slide-up" delay={0}>
            <div className="mb-16 grid gap-8 border-b border-slate-300 pb-10 dark:border-slate-700 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-blue-700 dark:text-blue-400">
                  01 / {language === 'en' ? 'Studio' : language === 'kz' ? 'Студия' : 'Студия'}
                </p>
                <h2 className="max-w-4xl text-4xl font-black tracking-[-0.045em] text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
                  {t('about.title')}
                </h2>
              </div>
              <div className="flex flex-col items-start justify-end lg:col-span-4">
                <p className="mb-6 text-base leading-7 text-slate-600 dark:text-slate-300">
                  {t('about.subtitle')}
                </p>
                <Link href={`/${language}/services`} className="inline-flex items-center gap-3 border-b-2 border-blue-700 pb-1 text-sm font-bold text-slate-950 transition-colors hover:text-blue-700 dark:border-blue-400 dark:text-white dark:hover:text-blue-400">
                  <span>{language === 'en' ? 'View all services' : language === 'kz' ? 'Барлық қызметтерді көру' : 'Все услуги'}</span>
                  <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 border-l border-t border-slate-300 dark:border-slate-700 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const isExpanded = expandedServices[index] || false;
              const serviceKey = serviceKeys[index];
              const detailsId = `service-details-${serviceKey}`;

              return (
                <AnimatedSection key={serviceKey} animationType="slide-up" delay={index * 80} className="h-full">
                  <article className="flex h-full flex-col border-b border-r border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex flex-1 flex-col p-6 sm:p-8">
                      <div className="mb-10 flex items-start justify-between">
                        <span className="font-mono text-xs text-slate-400">0{index + 1}</span>
                        <span className="flex h-11 w-11 items-center justify-center border border-blue-700 text-blue-700 dark:border-blue-400 dark:text-blue-400">
                          {service.icon}
                        </span>
                      </div>
                      <h3 className="mb-3 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">{service.title}</h3>
                      <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{service.description}</p>
                      {isExpanded && (
                        <div id={detailsId} className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-700">
                          <p className="whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-300">{service.details}</p>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 border-t border-slate-200 dark:border-slate-700">
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        aria-controls={detailsId}
                        onClick={() => {
                          toggleService(index);
                          if (!isExpanded) analyticsEvents.serviceExpand(service.title);
                        }}
                        className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-blue-700 hover:text-white dark:text-slate-200"
                      >
                        {isExpanded ? t('about.services.hide') : t('about.services.more')}
                      </button>
                      <Link href={`/${language}/services/${serviceKey}`} className="border-l border-slate-200 px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-blue-700 hover:bg-blue-50 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-slate-800">
                        {t('about.services.goToPage')} →
                      </Link>
                    </div>
                  </article>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
