'use client';

import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedSection from '../common/AnimatedSection';

export default function Process() {
  const { t, language } = useLanguage();

  const steps = [
    {
      number: '01',
      title: t('process.step1.title'),
      description: t('process.step1.description'),
      duration: t('process.step1.duration'),
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      number: '02',
      title: t('process.step2.title'),
      description: t('process.step2.description'),
      duration: t('process.step2.duration'),
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      number: '03',
      title: t('process.step3.title'),
      description: t('process.step3.description'),
      duration: t('process.step3.duration'),
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      number: '04',
      title: t('process.step4.title'),
      description: t('process.step4.description'),
      duration: t('process.step4.duration'),
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      number: '05',
      title: t('process.step5.title'),
      description: t('process.step5.description'),
      duration: t('process.step5.duration'),
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      number: '', // Без номера для дополнительного блока
      title: t('process.nda.title'),
      description: t('process.nda.description'),
      duration: t('process.nda.duration'),
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="process" className="bg-stone-100 py-24 dark:bg-slate-950 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection animationType="slide-up" delay={0}>
            <div className="mb-16 grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-blue-700 dark:text-blue-400">
                  04 / {language === 'en' ? 'Workflow' : language === 'kz' ? 'Жұмыс барысы' : 'Как работаем'}
                </p>
                <h2 className="text-5xl font-black tracking-[-0.05em] text-slate-950 dark:text-white sm:text-7xl">{t('process.title')}</h2>
              </div>
              <p className="self-end border-l-4 border-blue-700 pl-5 text-lg leading-8 text-slate-600 dark:border-blue-400 dark:text-slate-300 lg:col-span-4">{t('process.subtitle')}</p>
            </div>
          </AnimatedSection>

          <div className="border-t-2 border-slate-950 dark:border-white">
              {steps.map((step, index) => (
                <AnimatedSection key={index} animationType="slide-up" delay={index * 80}>
                  <article className="group grid gap-5 border-b border-slate-300 py-8 dark:border-slate-700 md:grid-cols-12 md:items-center">
                    <div className="font-mono text-4xl font-bold text-blue-700 dark:text-blue-400 md:col-span-2">{step.number || '—'}</div>
                    <div className="flex items-center gap-4 md:col-span-3">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-slate-400 text-slate-700 group-hover:border-blue-700 group-hover:text-blue-700 dark:border-slate-600 dark:text-slate-200">{step.icon}</span>
                      <h3 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">{step.title}</h3>
                    </div>
                    <p className="leading-7 text-slate-600 dark:text-slate-300 md:col-span-5">{step.description}</p>
                    <div className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-500 md:col-span-2 md:text-right">{step.duration}</div>
                  </article>
                </AnimatedSection>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

