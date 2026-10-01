'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedSection from '../common/AnimatedSection';
import StructuredData from '../SEO/StructuredData';
import { createFAQSchema } from '../../lib/schemas';
import { analyticsEvents } from '../../lib/analytics';
import { buildWhatsAppUrl, PRIMARY_WHATSAPP_NUMBER } from '../../lib/whatsapp';
import ReplyBadge from './ReplyBadge';

const FAQ_COUNT = 10;
const PREVIEW_COUNT = 4;

export default function FAQ() {
  const { t, language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Keyed on language rather than `t`, which the provider recreates every render
  const faqs = useMemo(
    () =>
      Array.from({ length: FAQ_COUNT }, (_, index) => ({
        question: t(`faq.${index + 1}.question`),
        answer: t(`faq.${index + 1}.answer`),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language],
  );

  const displayedFaqs = showAll ? faqs : faqs.slice(0, PREVIEW_COUNT);

  const faqSchema = useMemo(() => createFAQSchema(faqs), [faqs]);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <StructuredData data={faqSchema} id="faq-schema" />
      <section id="faq" className="border-b border-[#cfcdc5] bg-[#f4f2ec] py-16 sm:py-20">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-16">
          <AnimatedSection animationType="slide-up">
            <div className="grid gap-5 border-b-2 border-[#11110f] pb-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <p className="editorial-kicker">07 / FAQ</p>
                <h2 className="mt-5 text-3xl font-semibold tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                  {t('faq.title')}
                </h2>
              </div>
              <p className="text-sm leading-6 text-[#55544e] sm:text-base sm:leading-7 lg:col-span-5">
                {t('faq.subtitle')}
              </p>
            </div>
          </AnimatedSection>

          <div id="faq-list">
            {displayedFaqs.map((faq, index) => {
              const buttonId = `faq-question-${index}`;
              const panelId = `faq-answer-${index}`;
              const isOpen = openIndex === index;
              const faqItem = (
                <article className="editorial-row">
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => {
                      toggleFAQ(index);
                      if (!isOpen) analyticsEvents.faqExpand(faq.question);
                    }}
                    className="grid w-full grid-cols-[1.75rem_1fr_1.5rem] items-start gap-3 py-5 text-left hover:text-[#2446e8] sm:grid-cols-[3rem_1fr_2rem] sm:gap-4 sm:py-6"
                  >
                    <span className="editorial-num pt-1">{String(index + 1).padStart(2, '0')}</span>
                    <span className="text-base font-bold leading-6 tracking-[-0.02em] sm:text-lg sm:leading-7 lg:text-xl">
                      {faq.question}
                    </span>
                    <span aria-hidden className="justify-self-end text-2xl font-light leading-6 text-[#2446e8]">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="grid grid-cols-[1.75rem_1fr] gap-3 pb-6 sm:grid-cols-[3rem_1fr] sm:gap-4"
                    >
                      <span aria-hidden />
                      <p className="max-w-3xl text-sm leading-6 text-[#55544e] sm:text-base sm:leading-7">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </article>
              );
              return index < PREVIEW_COUNT ? (
                <AnimatedSection key={index} animationType="slide-up" delay={index * 60}>
                  {faqItem}
                </AnimatedSection>
              ) : (
                <React.Fragment key={index}>{faqItem}</React.Fragment>
              );
            })}
          </div>

          <div className="mt-6">
            <button
              type="button"
              aria-expanded={showAll}
              aria-controls="faq-list"
              onClick={() => {
                setShowAll(!showAll);
                setOpenIndex(null);
              }}
              className="inline-flex min-h-12 w-full items-center justify-center border border-[#11110f] px-6 py-3.5 text-sm font-bold hover:bg-[#11110f] hover:text-white sm:w-auto sm:px-8"
            >
              {showAll ? t('faq.hideAll') : t('faq.showAll')}
            </button>
          </div>

          <AnimatedSection animationType="slide-up" delay={80}>
            <div className="mt-10 border border-[#11110f] bg-white p-5 sm:p-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
                <div className="min-w-0">
                  <h3 className="text-xl font-bold tracking-[-0.03em] sm:text-2xl lg:text-3xl">
                    {t('home.faq.ctaTitle')}
                  </h3>
                  <p className="mt-2.5 max-w-2xl text-sm leading-6 text-[#55544e] sm:text-base sm:leading-7">
                    {t('home.faq.ctaText')}
                  </p>
                  <div className="mt-4">
                    <ReplyBadge />
                  </div>
                </div>
                <a
                  href={buildWhatsAppUrl(t('home.faq.ctaMessage'))}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, 'home_faq')}
                  className="cta-band__primary w-full shrink-0 sm:w-auto"
                >
                  {t('home.faq.ctaButton')} <span aria-hidden>↗</span>
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
