'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedSection from '../common/AnimatedSection';
import StructuredData from '../SEO/StructuredData';
import { createFAQSchema } from '../../lib/schemas';
import { analyticsEvents } from '../../lib/analytics';

export default function FAQ() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const faqs = [
    {
      question: t('faq.1.question'),
      answer: t('faq.1.answer'),
    },
    {
      question: t('faq.2.question'),
      answer: t('faq.2.answer'),
    },
    {
      question: t('faq.3.question'),
      answer: t('faq.3.answer'),
    },
    {
      question: t('faq.4.question'),
      answer: t('faq.4.answer'),
    },
    {
      question: t('faq.5.question'),
      answer: t('faq.5.answer'),
    },
    {
      question: t('faq.6.question'),
      answer: t('faq.6.answer'),
    },
    {
      question: t('faq.7.question'),
      answer: t('faq.7.answer'),
    },
    {
      question: t('faq.8.question'),
      answer: t('faq.8.answer'),
    },
    {
      question: t('faq.9.question'),
      answer: t('faq.9.answer'),
    },
    {
      question: t('faq.10.question'),
      answer: t('faq.10.answer'),
    },
  ];

  const displayedFaqs = showAll ? faqs : faqs.slice(0, 4);
  
  // Structured Data для FAQ
  const faqSchema = useMemo(() => createFAQSchema(faqs), [faqs]);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <StructuredData data={faqSchema} />
      <section id="faq" className="bg-stone-50 py-24 dark:bg-slate-950 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection animationType="slide-up" delay={0}>
            <div className="mb-16 grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-blue-700 dark:text-blue-400">06 / FAQ</p>
                <h2 className="text-5xl font-black tracking-[-0.05em] text-slate-950 dark:text-white sm:text-7xl">{t('faq.title')}</h2>
              </div>
              <p className="self-end text-lg leading-8 text-slate-600 dark:text-slate-300 lg:col-span-5">
                {t('faq.subtitle')}
              </p>
            </div>
          </AnimatedSection>

          <div id="faq-list" className="border-t-2 border-slate-950 dark:border-white">
              {displayedFaqs.map((faq, realIndex) => {
                const buttonId = `faq-question-${realIndex}`;
                const panelId = `faq-answer-${realIndex}`;
                const isOpen = openIndex === realIndex;
                const faqItem = (
                  <article className="border-b border-slate-300 dark:border-slate-700">
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => {
                        toggleFAQ(realIndex);
                        if (!isOpen) analyticsEvents.faqExpand(faq.question);
                      }}
                      className="grid w-full grid-cols-[3rem_1fr_auto] items-center gap-4 py-6 text-left hover:text-blue-700 dark:hover:text-blue-400 sm:grid-cols-[5rem_1fr_auto]"
                    >
                      <span className="font-mono text-xs text-blue-700 dark:text-blue-400">{String(realIndex + 1).padStart(2, '0')}</span>
                      <span className="text-lg font-bold text-slate-950 dark:text-white sm:text-xl">{faq.question}</span>
                      <span aria-hidden="true" className="text-2xl font-light">{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                      <div id={panelId} role="region" aria-labelledby={buttonId} className="grid grid-cols-[3rem_1fr] gap-4 pb-8 sm:grid-cols-[5rem_1fr]">
                        <span aria-hidden="true" />
                        <p className="max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">{faq.answer}</p>
                      </div>
                    )}
                  </article>
                );
                return realIndex < 4 ? (
                  <AnimatedSection key={realIndex} animationType="slide-up" delay={realIndex * 80}>{faqItem}</AnimatedSection>
                ) : <React.Fragment key={realIndex}>{faqItem}</React.Fragment>;
              })}
          </div>

          {faqs.length > 4 && (
            <div className="mt-10">
              <button
                type="button"
                aria-expanded={showAll}
                aria-controls="faq-list"
                onClick={() => {
                  setShowAll(!showAll);
                  setOpenIndex(null);
                }}
                className="border-2 border-blue-700 bg-blue-700 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-transparent hover:text-blue-700"
              >
                {showAll ? t('faq.hideAll') : t('faq.showAll')}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
    </>
  );
}

