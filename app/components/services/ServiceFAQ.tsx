'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedSection from '../common/AnimatedSection';
import { analyticsEvents } from '../../lib/analytics';
import StructuredData from '../SEO/StructuredData';
import { createFAQSchema } from '../../lib/schemas';

interface ServiceFAQProps {
  faqKey: string;
}

export default function ServiceFAQ({ faqKey }: ServiceFAQProps) {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Получаем FAQ данные
  const faqs = useMemo(() => {
    const result = [];
    let faqIndex = 0;
    while (true) {
      const questionKey = `${faqKey}.${faqIndex}.question`;
      const answerKey = `${faqKey}.${faqIndex}.answer`;
      if (!t(questionKey) || t(questionKey) === questionKey) break;
      
      result.push({
        question: t(questionKey),
        answer: t(answerKey),
      });
      faqIndex++;
    }
    return result;
  }, [t, faqKey]);

  const faqSchema = useMemo(() => createFAQSchema(faqs), [faqs]);

  if (faqs.length === 0) return null;

  const displayedFaqs = showAll ? faqs : faqs.slice(0, 4);
  
  // Создаем массив с реальными индексами
  const faqsWithIndex = displayedFaqs.map((faq, localIndex) => ({
    faq,
    realIndex: showAll ? localIndex : localIndex,
    localIndex,
  }));

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <StructuredData data={faqSchema} />
      <AnimatedSection animationType="slide-up" delay={600}>
        <div className="mb-20">
        <div className="mb-10 border-b border-slate-300 pb-6">
          <h2 className="text-4xl font-semibold tracking-[-0.04em] text-slate-950 md:text-5xl">
              {t('services.faq.title')}
          </h2>
        </div>

        {/* FAQ Items */}
        <div id="service-faq-list" className="border-t border-slate-300">
            {faqsWithIndex.map(({ faq, realIndex }) => {
              const isFirstFour = realIndex < 4;
              const isOpen = openIndex === realIndex;
              const buttonId = `service-faq-button-${realIndex}`;
              const panelId = `service-faq-panel-${realIndex}`;
              
              const faqCard = (
                <div className="group overflow-hidden border-b border-slate-300 bg-white transition-colors">
                  {/* Question */}
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => {
                      toggleFAQ(realIndex);
                      if (openIndex !== realIndex) {
                        analyticsEvents.faqExpand(faq.question);
                      }
                    }}
                    className="flex w-full items-center justify-between px-6 py-6 text-left transition-colors hover:bg-blue-50/50"
                  >
                    <span className="pr-8 text-lg font-semibold text-slate-950">
                      {faq.question}
                    </span>
                    <svg
                      className={`h-6 w-6 flex-shrink-0 text-blue-700 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Answer */}
                  {isOpen && (
                    <div id={panelId} role="region" aria-labelledby={buttonId}>
                      <div className="px-8 pb-6">
                      <p className="leading-7 text-slate-600">
                        {faq.answer}
                      </p>
                      </div>
                    </div>
                  )}
                </div>
              );
              
              return (
                <div key={realIndex}>
                  {isFirstFour ? (
                    <AnimatedSection animationType="slide-up" delay={realIndex * 100}>
                      {faqCard}
                    </AnimatedSection>
                  ) : (
                    faqCard
                  )}
                </div>
              );
            })}
        </div>

        {/* Show All / Hide Button */}
        {faqs.length > 4 && (
          <div className="text-center mt-8">
            <button
              type="button"
              aria-expanded={showAll}
              aria-controls="service-faq-list"
              onClick={() => {
                setShowAll(!showAll);
                setOpenIndex(null);
              }}
              className="border border-blue-700 bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
            >
              <span className="inline-block transition-all duration-300">
                {showAll ? t('faq.hideAll') : t('faq.showAll')}
              </span>
            </button>
          </div>
        )}
      </div>
    </AnimatedSection>
    </>
  );
}

