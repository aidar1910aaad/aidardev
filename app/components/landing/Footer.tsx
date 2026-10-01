'use client';

import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedSection from '../common/AnimatedSection';
import { analyticsEvents } from '../../lib/analytics';
import { cityEntries } from '../../data/cities';
import { buildWhatsAppUrl, PRIMARY_WHATSAPP_NUMBER } from '../../lib/whatsapp';

export default function Footer() {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string, href?: string) => {
    if (href) {
      window.location.assign(href);
      return;
    }

    if (typeof window === 'undefined') return;

    const pathname = window.location.pathname;
    // Проверяем, находимся ли мы на главной странице (с учетом языковых префиксов)
    const isCityLanding = /^\/(ru|en|kz)\/cities\/[^/]+\/?$/.test(pathname);
    const isHomePage = pathname === '/' || pathname === '/ru' || pathname === '/en' || pathname === '/kz' || isCityLanding;
    const isPricingPage = pathname.includes('/pricing');

    // Если мы на странице /pricing и ищем contact, скроллим на той же странице
    if (isPricingPage && id === 'contact') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'auto' });
        analyticsEvents.footerLinkClick(id);
      }
      return;
    }

    // Если мы на главной странице (любой языковой версии), делаем плавный скролл
    if (isHomePage) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'auto' });
        analyticsEvents.footerLinkClick(id);
        // Обновляем URL без перезагрузки страницы
        const lang = pathname === '/' ? 'ru' : pathname.substring(1, 3);
        const newUrl = `/${lang}#${id}`;
        window.history.pushState({}, '', newUrl);
      }
      return;
    }

    // Если мы не на главной странице, переходим на главную с якорем
    const lang = pathname.startsWith('/en') ? 'en' : pathname.startsWith('/kz') ? 'kz' : 'ru';
    window.location.assign(`/${lang}#${id}`);
    analyticsEvents.footerLinkClick(id);
  };

  const navLinks = [
    { id: 'about', label: t('nav.about'), href: `/${language}/services` },
    { id: 'testimonials', label: t('nav.testimonials') },
    { id: 'projects', label: t('nav.projects') },
    { id: 'pricing', label: t('nav.pricing'), href: `/${language}/pricing` },
    { id: 'blog', label: t('nav.blog'), href: `/${language}/blog` },
    { id: 'process', label: t('nav.process') },
    { id: 'faq', label: t('nav.faq') },
    { id: 'contact', label: t('nav.contact') },
  ];

  const serviceLinks = [
    { key: 'websites', label: t('footer.websites') },
    { key: 'bots', label: t('footer.bots') },
    { key: 'ai', label: t('footer.ai') },
    { key: 'mobile', label: t('footer.mobile') },
    { key: 'design', label: t('footer.design') },
    { key: 'consulting', label: t('footer.consulting') },
  ];

  return (
    <footer className="border-t-4 border-[#2446e8] bg-[#11110f] text-white">
      <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 xl:px-16">
        <AnimatedSection animationType="slide-up">
          <div className="flex flex-col gap-5 border-b border-[#3a3a35] pb-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="min-w-0">
              <div className="font-[family-name:var(--font-outfit)] text-3xl font-bold tracking-[-0.055em] sm:text-4xl">
                aidar<span className="text-[#7f96ff]">.dev</span>
              </div>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#b7b6af] sm:text-base sm:leading-7">
                {t('footer.description')}
              </p>
            </div>
            <a
              href={buildWhatsAppUrl(t('home.contact.baseMessage'))}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, 'footer')}
              className="cta-band__primary w-full shrink-0 sm:w-auto"
            >
              {t('home.bar.cta')} <span aria-hidden>↗</span>
            </a>
          </div>
        </AnimatedSection>

        <div className="grid gap-10 border-b border-[#3a3a35] py-10 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatedSection animationType="slide-up">
            <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#7f96ff]">
              {t('nav.contact')}
            </h3>
            <ul className="mt-5 space-y-1">
              <li>
                <a
                  href="tel:+77066703696"
                  onClick={() => analyticsEvents.phoneCall('+7 706 670 36 96', 'footer')}
                  className="flex min-h-11 items-center text-sm text-[#b7b6af] transition-colors hover:text-white"
                >
                  <span className="mr-2 text-[#7f96ff]" aria-hidden>—</span>
                  +7 706 670 36 96
                </a>
              </li>
              <li>
                <a
                  href="tel:+77029993696"
                  onClick={() => analyticsEvents.phoneCall('+7 702 999 36 96', 'footer')}
                  className="flex min-h-11 items-center text-sm text-[#b7b6af] transition-colors hover:text-white"
                >
                  <span className="mr-2 text-[#7f96ff]" aria-hidden>—</span>
                  +7 702 999 36 96
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/opunksnoo"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => analyticsEvents.telegramClick()}
                  className="flex min-h-11 items-center text-sm text-[#b7b6af] transition-colors hover:text-white"
                >
                  <span className="mr-2 text-[#7f96ff]" aria-hidden>—</span>
                  @opunksnoo
                </a>
              </li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a
                href="https://github.com/aidar1910aaad"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-11 w-11 place-items-center border border-[#565650] text-[#b7b6af] transition-colors hover:border-[#7f96ff] hover:bg-[#2446e8] hover:text-white"
                aria-label="GitHub"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/aidar1910main/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analyticsEvents.linkedinClick()}
                className="grid h-11 w-11 place-items-center border border-[#565650] text-[#b7b6af] transition-colors hover:border-[#7f96ff] hover:bg-[#2446e8] hover:text-white"
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </AnimatedSection>

          <AnimatedSection animationType="slide-up" delay={70}>
            <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#7f96ff]">
              {t('footer.navigation')}
            </h3>
            <ul className="mt-5">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(link.id, link.href)}
                    className="flex min-h-11 w-full items-center text-left text-sm text-[#b7b6af] transition-colors hover:text-white"
                  >
                    <span className="mr-2 text-[#7f96ff]" aria-hidden>→</span>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </AnimatedSection>

          <AnimatedSection animationType="slide-up" delay={140}>
            <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#7f96ff]">
              {t('footer.services')}
            </h3>
            <ul className="mt-5">
              {serviceLinks.map((service) => (
                <li key={service.key}>
                  <a
                    href={`/${language}/services/${service.key}`}
                    className="flex min-h-11 items-center text-sm text-[#b7b6af] transition-colors hover:text-white"
                  >
                    <span className="mr-2 text-[#7f96ff]" aria-hidden>→</span>
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
          </AnimatedSection>

          <AnimatedSection animationType="slide-up" delay={210}>
            <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#7f96ff]">
              {t('footer.cities')}
            </h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {cityEntries.map((city) => (
                <a
                  key={city.slug}
                  href={`/${language}/cities/${city.slug}`}
                  className="border border-[#565650] px-3 py-2 text-xs text-[#b7b6af] transition-colors hover:border-[#7f96ff] hover:text-white"
                >
                  {language === 'en' ? city.name.en : language === 'kz' ? city.name.kz : city.locative.ru}
                </a>
              ))}
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection animationType="fade-in" delay={260}>
          {/* Реквизиты студии (без банковских данных) */}
          <p className="border-b border-[#3a3a35] py-6 text-xs leading-6 text-[#8d8c85] sm:text-sm">
            <span className="font-semibold text-[#b7b6af]">{t('footer.legal')}:</span>{' '}
            {t('footer.legal.entity')}
            <span aria-hidden> · </span>
            {t('footer.legal.id')}
            <span aria-hidden> · </span>
            {t('footer.legal.address')}
            <span aria-hidden> · </span>
            <a
              href="mailto:aidar1910main@gmail.com"
              onClick={() => analyticsEvents.emailClick()}
              className="transition-colors hover:text-white"
            >
              aidar1910main@gmail.com
            </a>
            <span aria-hidden> · </span>
            <a
              href="tel:+77029993696"
              onClick={() => analyticsEvents.phoneCall('+7 702 999 36 96', 'footer_legal')}
              className="whitespace-nowrap transition-colors hover:text-white"
            >
              +7 702 999 3696
            </a>
          </p>
          <div className="flex flex-col items-center justify-between gap-3 pt-6 md:flex-row">
            <p className="text-center text-sm text-[#8d8c85] md:text-left">
              © {currentYear} aidardev. {t('footer.rights')}
            </p>
            <a
              href={`/${language}/privacy`}
              className="text-sm text-[#b7b6af] underline decoration-[#565650] underline-offset-4 transition-colors hover:text-white hover:decoration-[#7f96ff]"
            >
              {t('footer.privacy')}
            </a>
            <div className="flex items-center gap-2 text-sm text-[#8d8c85]">
              <span>{t('footer.madeWith')}</span>
              <svg className="h-4 w-4 text-[#ef4444]" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span>{t('footer.inKazakhstan')}</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </footer>
  );
}
