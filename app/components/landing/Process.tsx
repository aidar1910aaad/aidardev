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
    },
    {
      number: '02',
      title: t('process.step2.title'),
      description: t('process.step2.description'),
      duration: t('process.step2.duration'),
    },
    {
      number: '03',
      title: t('process.step3.title'),
      description: t('process.step3.description'),
      duration: t('process.step3.duration'),
    },
    {
      number: '04',
      title: t('process.step4.title'),
      description: t('process.step4.description'),
      duration: t('process.step4.duration'),
    },
    {
      number: '05',
      title: t('process.step5.title'),
      description: t('process.step5.description'),
      duration: t('process.step5.duration'),
    },
    {
      number: '—',
      title: t('process.nda.title'),
      description: t('process.nda.description'),
      duration: t('process.nda.duration'),
    },
  ];

  const sectionLabel =
    language === 'en' ? 'Workflow' : language === 'kz' ? 'Жұмыс барысы' : 'Как работаем';

  return (
    <section id="process" className="border-b border-[#cfcdc5] bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-16">
        <AnimatedSection animationType="slide-up">
          <div className="grid gap-5 border-b-2 border-[#11110f] pb-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="editorial-kicker">05 / {sectionLabel}</p>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                {t('process.title')}
              </h2>
            </div>
            <p className="text-sm leading-6 text-[#55544e] sm:text-base sm:leading-7 lg:col-span-4">
              {t('process.subtitle')}
            </p>
          </div>
        </AnimatedSection>

        <ol>
          {steps.map((step, index) => (
            <li key={step.title} className="editorial-row">
              <AnimatedSection
                animationType="slide-up"
                delay={index * 60}
                className="grid gap-2 py-6 sm:gap-3 lg:grid-cols-12 lg:items-baseline lg:gap-8 lg:py-7"
              >
                <div className="flex items-baseline justify-between gap-4 lg:col-span-4 lg:block">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-sm font-bold text-[#2446e8] sm:text-base">{step.number}</span>
                    <h3 className="text-lg font-bold tracking-[-0.03em] sm:text-xl lg:text-2xl">{step.title}</h3>
                  </div>
                  <span className="shrink-0 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#68675f] lg:hidden">
                    {step.duration}
                  </span>
                </div>
                <p className="text-sm leading-6 text-[#55544e] sm:text-base sm:leading-7 lg:col-span-6">
                  {step.description}
                </p>
                <span className="hidden font-mono text-xs font-bold uppercase tracking-[0.1em] text-[#68675f] lg:col-span-2 lg:block lg:text-right">
                  {step.duration}
                </span>
              </AnimatedSection>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
