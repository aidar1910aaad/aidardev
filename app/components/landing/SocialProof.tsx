'use client';

import { useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { analyticsEvents } from '../../lib/analytics';
import { createReviewSchema } from '../../lib/schemas';
import { buildWhatsAppUrl, PRIMARY_WHATSAPP_NUMBER } from '../../lib/whatsapp';
import AnimatedSection from '../common/AnimatedSection';
import StructuredData from '../SEO/StructuredData';
import ReplyBadge from './ReplyBadge';

const companyKeys = ['company1', 'company2', 'company3', 'company4'] as const;

export default function SocialProof() {
  const { t, language } = useLanguage();

  const reviews = companyKeys.map((key) => ({
    company: t(`testimonials.${key}.name`),
    quote: t(`testimonials.${key}.quote`),
    author: t(`testimonials.${key}.author`),
    role: t(`testimonials.${key}.role`),
  }));

  const stats = [
    { value: '38+', label: t('home.proof.stats.projects') },
    { value: '6+', label: t('home.proof.stats.experience') },
    { value: '+60%', label: t('home.proof.stats.enquiries') },
    { value: '+40%', label: t('home.proof.stats.efficiency') },
  ];

  const sectionLabel =
    language === 'en' ? 'Client feedback' : language === 'kz' ? 'Клиент пікірлері' : 'Отзывы клиентов';

  const reviewSchema = useMemo(
    () =>
      createReviewSchema(
        reviews.map((review) => ({
          author: review.author,
          rating: 5,
          reviewBody: review.quote,
          datePublished: new Date().toISOString(),
        })),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language],
  );

  return (
    <>
      <StructuredData data={reviewSchema} id="reviews-schema" />
      <section id="testimonials" className="border-b border-[#cfcdc5] bg-[#f4f2ec] py-16 sm:py-20">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-16">
          <AnimatedSection animationType="slide-up">
            <div className="grid gap-5 border-b-2 border-[#11110f] pb-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <p className="editorial-kicker">03 / {sectionLabel}</p>
                <h2 className="mt-5 text-3xl font-semibold tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                  {t('home.proof.title')}
                </h2>
              </div>
              <p className="text-sm leading-6 text-[#55544e] sm:text-base sm:leading-7 lg:col-span-4">
                {t('home.proof.subtitle')}
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animationType="slide-up" delay={60}>
            <ul className="grid grid-cols-2 border-l border-t border-[#cfcdc5] bg-white lg:grid-cols-4">
              {stats.map((stat) => (
                <li key={stat.label} className="stat-tile">
                  <span className="stat-tile__value">{stat.value}</span>
                  <span className="stat-tile__label">{stat.label}</span>
                </li>
              ))}
            </ul>
          </AnimatedSection>

          <AnimatedSection animationType="slide-up" delay={100}>
            <div className="snap-row -mx-5 mt-8 px-5 md:mx-0 md:grid md:grid-cols-2 md:border-l md:border-t md:border-[#cfcdc5] md:px-0">
              {reviews.map((review) => (
                <article key={review.company} className="proof-card">
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#2446e8]">
                    {review.company}
                  </p>
                  <p className="proof-card__quote">“{review.quote}”</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-[#cfcdc5] pt-4">
                    <span className="proof-card__avatar" aria-hidden>
                      {review.author.charAt(0)}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold">{review.author}</span>
                      <span className="block text-xs leading-5 text-[#68675f]">{review.role}</span>
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection animationType="slide-up" delay={140}>
            <div className="mt-8 flex flex-col gap-4 border border-[#11110f] bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div className="min-w-0">
                <ReplyBadge />
                <p className="mt-3 text-sm leading-6 text-[#55544e] sm:text-base">{t('home.proof.ctaNote')}</p>
              </div>
              <a
                href={buildWhatsAppUrl(t('home.proof.message'))}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, 'home_proof')}
                className="cta-band__primary w-full shrink-0 sm:w-auto"
              >
                {t('home.proof.cta')} <span aria-hidden>↗</span>
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
