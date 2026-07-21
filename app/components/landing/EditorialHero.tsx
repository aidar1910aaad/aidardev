'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';
import { projects } from '../../data/projects';
import { analyticsEvents } from '../../lib/analytics';
import { buildWhatsAppUrl, PRIMARY_WHATSAPP_NUMBER } from '../../lib/whatsapp';
import AnimatedSection from '../common/AnimatedSection';

const previewProjects = projects.filter((project) => project.featured).slice(0, 4);

export default function EditorialHero() {
  const { language, t } = useLanguage();
  const trustSignals = [
    t('home.hero.trust.contract'),
    t('home.hero.trust.languages'),
    t('home.hero.trust.team'),
  ];
  const whatsappUrl = buildWhatsAppUrl(t('home.hero.message'));
  const projectCount = projects.length;
  const titleEndRaw = t('home.hero.titleEnd');
  const titleEnd = titleEndRaw.startsWith('home.hero.') ? '' : titleEndRaw;

  return (
    <section className="editorial-grid relative overflow-hidden border-b border-[#11110f] pt-14 lg:pt-20">
      <div className="mx-auto max-w-[1440px] border-x border-[#cfcdc5] bg-[#f4f2ec]/92">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_19rem]">
          <div className="px-4 py-8 sm:px-8 sm:py-12 lg:border-r lg:border-[#cfcdc5] lg:px-12 lg:py-20 xl:px-16">
            <AnimatedSection animationType="fade-in">
              <p className="editorial-kicker editorial-kicker--badge">{t('home.hero.badge')}</p>
              <h1 className="mt-4 max-w-5xl text-[1.875rem] font-semibold leading-[1.08] tracking-[-0.04em] sm:mt-6 sm:text-[2.5rem] sm:leading-[1.05] lg:mt-8 lg:text-[clamp(3rem,7vw,7rem)] lg:leading-[0.9] lg:tracking-[-0.065em]">
                {t('home.hero.title')}{' '}
                <span className="text-[#2446e8]">{t('home.hero.titleAccent')}</span>
                {titleEnd ? ` ${titleEnd}` : ''}
              </h1>
              <ul className="hero-metrics mt-5 lg:hidden" aria-label={t('home.hero.badge')}>
                <li className="hero-metrics__item">
                  <span className="hero-metrics__value">{projectCount}+</span>
                  <span className="hero-metrics__label">{t('home.hero.metrics.projects')}</span>
                </li>
                <li className="hero-metrics__item">
                  <span className="hero-metrics__value">80k</span>
                  <span className="hero-metrics__label">{t('home.hero.metrics.price')}</span>
                </li>
                <li className="hero-metrics__item">
                  <span className="hero-metrics__value">6+</span>
                  <span className="hero-metrics__label">{t('home.hero.metrics.experience')}</span>
                </li>
              </ul>
            </AnimatedSection>
            <AnimatedSection className="mt-5 max-w-3xl sm:mt-8 lg:mt-10" delay={100}>
              <p className="text-[0.9375rem] leading-6 text-[#55544e] sm:text-xl sm:leading-8">
                {t('home.hero.subtitle')}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2 lg:hidden" aria-label={t('home.hero.badge')}>
                {trustSignals.map((signal) => (
                  <li key={signal} className="hero-trust-pill">
                    {signal}
                  </li>
                ))}
              </ul>
              <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-8 sm:flex sm:flex-row sm:flex-wrap sm:gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, 'home_hero')}
                  className="col-span-2 inline-flex min-h-12 items-center justify-between bg-[#2446e8] px-5 py-3.5 text-sm font-bold text-white hover:bg-[#1836c7] sm:col-span-1 sm:min-h-13 sm:px-7 sm:py-4"
                >
                  {t('home.hero.primary')} <span className="ml-4" aria-hidden>↗</span>
                </a>
                <Link
                  href={`/${language}#projects`}
                  onClick={() => analyticsEvents.scrollToSection('projects')}
                  className="inline-flex min-h-12 items-center justify-center border border-[#11110f] px-4 py-3.5 text-sm font-bold hover:bg-[#11110f] hover:text-white sm:min-h-13 sm:justify-between sm:px-7 sm:py-4"
                >
                  {t('home.hero.secondary')} <span className="ml-3 hidden sm:inline" aria-hidden>↓</span>
                </Link>
                <Link
                  href={`/${language}/pricing`}
                  onClick={() => analyticsEvents.calculatePriceClick('home_hero')}
                  className="inline-flex min-h-12 items-center justify-center border border-[#cfcdc5] bg-white px-4 py-3.5 text-sm font-bold hover:border-[#11110f] sm:min-h-13 sm:border-transparent sm:bg-transparent sm:px-2 sm:py-4 sm:underline sm:decoration-2 sm:underline-offset-8 sm:hover:text-[#2446e8]"
                >
                  {t('home.hero.pricing')} <span className="ml-2 hidden sm:inline" aria-hidden>→</span>
                </Link>
              </div>
            </AnimatedSection>
            <AnimatedSection className="mt-8 lg:hidden" delay={180}>
              <div className="flex items-end justify-between gap-3 border-t border-[#cfcdc5] pt-5">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#68675f]">
                  {t('home.hero.preview')}
                </p>
                <Link
                  href={`/${language}#projects`}
                  onClick={() => analyticsEvents.scrollToSection('projects')}
                  className="text-xs font-bold text-[#2446e8]"
                >
                  {t('home.hero.previewAll')} →
                </Link>
              </div>
              <div className="hero-preview-scroll mt-3 flex gap-2.5 overflow-x-auto pb-1">
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
          <aside className="hidden border-t border-[#cfcdc5] lg:grid lg:grid-cols-1 lg:border-t-0" aria-label={t('home.hero.badge')}>
            {trustSignals.map((signal, index) => (
              <div key={signal} className={`flex min-h-28 flex-col justify-between p-5 sm:min-h-36 lg:min-h-0 lg:p-7 ${index > 0 ? 'border-t border-[#cfcdc5]' : ''}`}>
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
