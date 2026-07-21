'use client';

import React, { useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedSection from '../common/AnimatedSection';
import StructuredData from '../SEO/StructuredData';
import { createReviewSchema } from '../../lib/schemas';

export default function Testimonials() {
  const { t, language } = useLanguage();

  const companyTestimonials = [
    {
      company: t('testimonials.company1.name'),
      quote: t('testimonials.company1.quote'),
      author: t('testimonials.company1.author'),
      role: t('testimonials.company1.role'),
      avatar: 'S',
    },
    {
      company: t('testimonials.company2.name'),
      quote: t('testimonials.company2.quote'),
      author: t('testimonials.company2.author'),
      role: t('testimonials.company2.role'),
      avatar: 'E',
    },
    {
      company: t('testimonials.company3.name'),
      quote: t('testimonials.company3.quote'),
      author: t('testimonials.company3.author'),
      role: t('testimonials.company3.role'),
      avatar: 'A',
    },
    {
      company: t('testimonials.company4.name'),
      quote: t('testimonials.company4.quote'),
      author: t('testimonials.company4.author'),
      role: t('testimonials.company4.role'),
      avatar: 'A',
    },
  ];

  const developerTestimonials = [
    {
      name: t('testimonials.dev1.name'),
      handle: t('testimonials.dev1.handle'),
      quote: t('testimonials.dev1.quote'),
      avatar: 'M',
    },
    {
      name: t('testimonials.dev2.name'),
      handle: t('testimonials.dev2.handle'),
      quote: t('testimonials.dev2.quote'),
      avatar: 'A',
    },
    {
      name: t('testimonials.dev3.name'),
      handle: t('testimonials.dev3.handle'),
      quote: t('testimonials.dev3.quote'),
      avatar: 'D',
    },
    {
      name: t('testimonials.dev4.name'),
      handle: t('testimonials.dev4.handle'),
      quote: t('testimonials.dev4.quote'),
      avatar: 'A',
    },
    {
      name: t('testimonials.dev5.name'),
      handle: t('testimonials.dev5.handle'),
      quote: t('testimonials.dev5.quote'),
      avatar: 'R',
    },
  ];

  // Structured Data для Reviews
  const reviewsForSchema = useMemo(() => {
    const allReviews = [
      ...companyTestimonials.map((t) => ({
        author: t.author,
        rating: 5,
        reviewBody: t.quote,
        datePublished: new Date().toISOString(),
      })),
      ...developerTestimonials.map((t) => ({
        author: t.name,
        rating: 5,
        reviewBody: t.quote,
        datePublished: new Date().toISOString(),
      })),
    ];
    return createReviewSchema(allReviews);
  }, [companyTestimonials, developerTestimonials]);

  return (
    <>
      <StructuredData data={reviewsForSchema} />
      <section id="testimonials" className="overflow-hidden bg-white py-24 dark:bg-slate-900 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Trusted by the best */}
        <AnimatedSection animationType="slide-up" delay={0}>
          <div className="mb-16 grid gap-8 border-b border-slate-300 pb-10 dark:border-slate-700 lg:grid-cols-12">
            <div className="lg:col-span-8">
            <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-blue-700 dark:text-blue-400">
              05 / {language === 'en' ? 'Client notes' : language === 'kz' ? 'Клиент пікірлері' : 'Отзывы клиентов'}
            </p>
            <h2 className="text-5xl font-black tracking-[-0.05em] text-slate-950 dark:text-white sm:text-7xl">
              {t('testimonials.trusted.title')}
            </h2>
            </div>
            <div className="flex flex-col items-start justify-end lg:col-span-4">
            <p className="mb-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
              {t('testimonials.trusted.subtitle')}
            </p>
            <button className="border-2 border-blue-700 bg-blue-700 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-transparent hover:text-blue-700">
              {t('testimonials.trusted.cta')} →
            </button>
            </div>
          </div>
        </AnimatedSection>

        {/* Company Testimonials Grid */}
        <div className="mb-28 grid grid-cols-1 border-l border-t border-slate-300 dark:border-slate-700 md:grid-cols-2">
          {companyTestimonials.map((testimonial, index) => (
            <AnimatedSection
              key={index}
              animationType="slide-up"
              delay={index * 100}
            >
              <article className="h-full border-b border-r border-slate-300 p-8 dark:border-slate-700 sm:p-10">
              <div>
                {/* Company */}
                <div className="flex items-center mb-6">
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-400">
                    {testimonial.company}
                  </span>
                </div>

                {/* Quote */}
                <p className="mb-8 text-xl font-semibold leading-8 text-slate-900 dark:text-slate-100">
                  “{testimonial.quote}”
                </p>

                {/* Author */}
                <div className="flex items-center">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center bg-blue-700 font-bold text-white">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-slate-950 dark:text-white">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
              </article>
            </AnimatedSection>
          ))}
        </div>

        {/* Bottom Section: Client Reviews */}
        <AnimatedSection animationType="fade-in" delay={400}>
          <div className="mb-12 max-w-4xl">
          <h3 className="mb-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            {t('testimonials.developers.title')}
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            {t('testimonials.developers.subtitle')}
          </p>
          </div>
        </AnimatedSection>

        {/* Developer Testimonials - Horizontal Scroll */}
        <div className="overflow-x-hidden pb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 scrollbar-hide">
          <div className="flex gap-6 animate-scroll-slow" style={{ width: 'max-content' }}>
            {/* Duplicate for infinite scroll - triple for smoother animation */}
            {[...developerTestimonials, ...developerTestimonials, ...developerTestimonials].map((testimonial, index) => (
              <div
                key={index}
                className="w-80 flex-shrink-0 border border-slate-300 bg-stone-50 p-6 dark:border-slate-700 dark:bg-slate-950"
              >
                {/* Author Info */}
                <div className="flex items-center mb-4">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center bg-blue-700 text-sm font-bold text-white">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-950 dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
                      {testimonial.handle}
                    </p>
                  </div>
                </div>

                {/* Quote */}
                <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
                  {testimonial.quote}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
