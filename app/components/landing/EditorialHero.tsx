'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';
import { projects } from '../../data/projects';
import { analyticsEvents } from '../../lib/analytics';
import { buildWhatsAppUrl, PRIMARY_WHATSAPP_NUMBER } from '../../lib/whatsapp';
import AnimatedSection from '../common/AnimatedSection';
import ReplyBadge from './ReplyBadge';

const previewProjects = projects.filter((project) => project.featured).slice(0, 4);
const quickIntents = ['site', 'bot', 'ads', 'ai', 'other'] as const;

export default function EditorialHero() {
  const { language, t } = useLanguage();
  const trustSignals = [
    t('home.hero.trust.contract'),
    t('home.hero.trust.support'),
    t('home.hero.trust.team'),
  ];
  const whatsappUrl = buildWhatsAppUrl(t('home.hero.message'));
  const titleEndRaw = t('home.hero.titleEnd');
  const titleEnd = titleEndRaw.startsWith('home.hero.') ? '' : titleEndRaw;

  return (
    <section className="editorial-grid relative border-b border-[#11110f] pt-16 lg:overflow-hidden lg:pt-20">
      <div className="mx-auto w-full max-w-[1440px] bg-[#f4f2ec]/92 lg:border-x lg:border-[#cfcdc5]">
        <div className="grid min-w-0 lg:grid-cols-[minmax(0,1fr)_19rem]">
          <div className="min-w-0 px-4 py-8 sm:px-8 sm:py-12 lg:border-r lg:border-[#cfcdc5] lg:px-12 lg:py-20 xl:px-16">
            <AnimatedSection animationType="fade-in" className="min-w-0">
              <span className="lg:hidden">
                <ReplyBadge />
              </span>
              <h1 className="mt-4 max-w-full break-words text-[1.75rem] font-semibold leading-[1.12] tracking-[-0.035em] sm:mt-5 sm:text-[2.35rem] sm:leading-[1.08] lg:mt-8 lg:text-[clamp(3rem,7vw,7rem)] lg:leading-[0.9] lg:tracking-[-0.065em]">
                {t('home.hero.title')}{' '}
                <span className="text-[#2446e8]">{t('home.hero.titleAccent')}</span>
                {titleEnd ? ` ${titleEnd}` : ''}
              </h1>
            </AnimatedSection>

            <AnimatedSection className="mt-4 min-w-0 sm:mt-6 lg:mt-10" delay={80}>
              <p className="max-w-full break-words text-[0.9375rem] leading-[1.65] text-[#55544e] sm:text-xl sm:leading-8">
                {t('home.hero.subtitle')}
              </p>
              <ul className="hero-trust-list mt-4 lg:hidden" aria-label={t('home.hero.trust.contract')}>
                {trustSignals.map((signal) => (
                  <li key={signal} className="hero-trust-list__item">
                    <span className="hero-trust-list__mark" aria-hidden>
                      ✓
                    </span>
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
              <ul className="hero-metrics mt-4 lg:hidden" aria-label={t('home.hero.metrics.projects')}>
                <li className="hero-metrics__item">
                  <span className="hero-metrics__value">38+</span>
                  <span className="hero-metrics__label">{t('home.hero.metrics.projects')}</span>
                </li>
                <li className="hero-metrics__item">
                  <span className="hero-metrics__value">{t('home.hero.metrics.priceValue')}</span>
                  <span className="hero-metrics__label">{t('home.hero.metrics.price')}</span>
                </li>
                <li className="hero-metrics__item">
                  <span className="hero-metrics__value">6+</span>
                  <span className="hero-metrics__label">{t('home.hero.metrics.experience')}</span>
                </li>
              </ul>
            </AnimatedSection>

            <AnimatedSection className="mt-5 min-w-0 sm:mt-7" delay={120}>
              <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, 'home_hero')}
                  className="inline-flex min-h-14 w-full items-center justify-between bg-[#2446e8] px-5 py-3.5 text-base font-bold text-white hover:bg-[#1836c7] sm:w-auto sm:min-h-13 sm:px-7 sm:py-4 sm:text-sm"
                >
                  {t('home.hero.primary')} <span className="ml-4" aria-hidden>↗</span>
                </a>
                <div className="grid grid-cols-2 gap-2.5 sm:contents">
                  <Link
                    href={`/${language}#projects`}
                    onClick={() => analyticsEvents.scrollToSection('projects')}
                    className="inline-flex min-h-12 items-center justify-center border border-[#11110f] px-3 py-3.5 text-center text-sm font-bold hover:bg-[#11110f] hover:text-white sm:min-h-13 sm:justify-between sm:px-7 sm:py-4"
                  >
                    {t('home.hero.secondary')} <span className="ml-3 hidden sm:inline" aria-hidden>↓</span>
                  </Link>
                  <Link
                    href={`/${language}/pricing`}
                    onClick={() => analyticsEvents.calculatePriceClick('home_hero')}
                    className="inline-flex min-h-12 items-center justify-center border border-[#cfcdc5] bg-white px-3 py-3.5 text-center text-sm font-bold hover:border-[#11110f] sm:min-h-13 sm:border-transparent sm:bg-transparent sm:px-2 sm:py-4 sm:underline sm:decoration-2 sm:underline-offset-8 sm:hover:text-[#2446e8]"
                  >
                    {t('home.hero.pricing')} <span className="ml-2 hidden sm:inline" aria-hidden>→</span>
                  </Link>
                </div>
              </div>
              <p className="mt-3 text-xs leading-5 text-[#68675f] sm:text-sm">{t('home.hero.ctaHint')}</p>
            </AnimatedSection>

            <AnimatedSection className="mt-6 min-w-0" delay={140}>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#68675f]">
                {t('home.hero.quickLabel')}
              </p>
              <div className="hero-preview-scroll -mx-4 mt-2.5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
                {quickIntents.map((intent) => (
                  <a
                    key={intent}
                    href={buildWhatsAppUrl(t(`home.quick.${intent}.message`))}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, `home_hero_quick_${intent}`)}
                    className="quick-chip shrink-0"
                  >
                    {t(`home.quick.${intent}`)} <span aria-hidden>↗</span>
                  </a>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection className="mt-8 min-w-0 lg:hidden" delay={180}>
              <div className="flex items-end justify-between gap-3 border-t border-[#cfcdc5] pt-5">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#68675f]">
                  {t('home.hero.preview')}
                </p>
                <Link
                  href={`/${language}#projects`}
                  onClick={() => analyticsEvents.scrollToSection('projects')}
                  className="shrink-0 text-xs font-bold text-[#2446e8]"
                >
                  {t('home.hero.previewAll')} →
                </Link>
              </div>
              <div className="hero-preview-scroll -mx-4 mt-3 flex gap-2.5 overflow-x-auto px-4 pb-1">
                {previewProjects.map((project, index) => (
                  <Link
                    key={project.id}
                    href={`/${language}#projects`}
                    onClick={() => analyticsEvents.scrollToSection('projects')}
                    className="hero-preview-card group shrink-0"
                  >
                    <div className="hero-preview-card__media">
                      <Image
                        src={project.image}
                        alt={project.title[language]}
                        width={280}
                        height={168}
                        sizes="140px"
                        priority={index === 0}
                        className="hero-preview-card__image"
                      />
                    </div>
                    <p className="hero-preview-card__title">{project.title[language]}</p>
                  </Link>
                ))}
              </div>
            </AnimatedSection>
          </div>

          <aside className="hidden min-w-0 border-t border-[#cfcdc5] lg:grid lg:grid-cols-1 lg:content-start lg:border-t-0" aria-label={t('home.hero.trust.contract')}>
            <div className="border-b border-[#cfcdc5] p-7">
              <ReplyBadge />
            </div>
            {trustSignals.map((signal, index) => (
              <div
                key={signal}
                className={`flex min-h-28 flex-col justify-between p-5 lg:min-h-0 lg:p-7 ${index > 0 ? 'border-t border-[#cfcdc5]' : ''}`}
              >
                <span className="font-mono text-xs text-[#68675f]">0{index + 1}</span>
                <p className="mt-6 text-sm font-semibold leading-5">{signal}</p>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}
