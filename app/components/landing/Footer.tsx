'use client';

import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedSection from '../common/AnimatedSection';
import { analyticsEvents } from '../../lib/analytics';
import { cityEntries } from '../../data/cities';

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

  return (
    <footer className="border-t-8 border-blue-700 bg-slate-950 text-white">
      <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-16 grid grid-cols-1 gap-12 border-b border-slate-700 pb-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <AnimatedSection animationType="slide-up" delay={0} className="lg:col-span-2">
            <div>
            <div className="mb-6">
              <div className="mb-4 text-5xl font-black tracking-[-0.06em] text-white">
                aidar<span className="text-blue-400">.dev</span>
              </div>
              <p className="mb-6 max-w-md text-lg leading-7 text-slate-300">
                {t('footer.description')}
              </p>
              
              {/* Contacts */}
              <div className="space-y-3 mb-6">
                <a
                  href="tel:+77066703696"
                  onClick={() => analyticsEvents.phoneCall('+7 706 670 36 96', 'footer')}
                  className="block text-slate-400 transition-colors hover:text-blue-400"
                >
                  <span className="flex items-center">
                    <span className="mr-2 text-blue-400">—</span>
                    +7 706 670 36 96
                  </span>
                </a>
                <a
                  href="tel:+77029993696"
                  onClick={() => analyticsEvents.phoneCall('+7 702 999 36 96', 'footer')}
                  className="block text-slate-400 transition-colors hover:text-blue-400"
                >
                  <span className="flex items-center">
                    <span className="mr-2 text-blue-400">—</span>
                    +7 702 999 36 96
                  </span>
                </a>
                <a
                  href="https://t.me/opunksnoo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-slate-400 transition-colors hover:text-blue-400"
                >
                  <span className="flex items-center">
                    <span className="mr-2 text-blue-400">—</span>
                    @opunksnoo
                  </span>
                </a>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="https://github.com/aidardev"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-slate-600 p-3 text-slate-300 transition-colors hover:border-blue-400 hover:bg-blue-700 hover:text-white"
                aria-label="GitHub"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/in/aidardev"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-slate-600 p-3 text-slate-300 transition-colors hover:border-blue-400 hover:bg-blue-700 hover:text-white"
                aria-label="LinkedIn"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="mailto:aidar@example.com"
                className="border border-slate-600 p-3 text-slate-300 transition-colors hover:border-blue-400 hover:bg-blue-700 hover:text-white"
                aria-label="Email"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </a>
            </div>
            </div>
          </AnimatedSection>

          {/* Quick Links */}
          <AnimatedSection animationType="slide-up" delay={100}>
            <div>
            <h3 className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
              {t('footer.navigation')}
            </h3>
            <ul className="space-y-3">
              {[
                { id: 'about', label: t('nav.about'), href: `/${language}/services` },
                { id: 'testimonials', label: t('nav.testimonials') },
                { id: 'projects', label: t('nav.projects') },
                { id: 'pricing', label: t('nav.pricing'), href: '/pricing' },
                { id: 'blog', label: t('nav.blog'), href: `/${language}/blog` },
                { id: 'process', label: t('nav.process') },
                { id: 'faq', label: t('nav.faq') },
                { id: 'contact', label: t('nav.contact') },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id, link.href)}
                    className="block w-full text-left text-slate-400 transition-colors hover:text-white"
                  >
                    <span className="flex items-center">
                      <span className="mr-2 text-blue-400">→</span>
                      {link.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            </div>
          </AnimatedSection>

          {/* Services */}
          <AnimatedSection animationType="slide-up" delay={200}>
            <div>
            <h3 className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
              {t('footer.services')}
            </h3>
            <ul className="space-y-3">
              {[
                { key: 'websites', label: t('footer.websites') },
                { key: 'bots', label: t('footer.bots') },
                { key: 'ai', label: t('footer.ai') },
                { key: 'mobile', label: t('footer.mobile') },
                { key: 'design', label: t('footer.design') },
                { key: 'consulting', label: t('footer.consulting') },
              ].map((service) => (
                <li key={service.key}>
                  <a
                    href={`/${language}/services/${service.key}`}
                    className="block text-slate-400 transition-colors hover:text-white"
                  >
                    <span className="flex items-center">
                      <span className="mr-2 text-blue-400">→</span>
                      {service.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            </div>
          </AnimatedSection>

        </div>

        <AnimatedSection animationType="slide-up" delay={250}>
          <div className="mb-12 border border-slate-700 p-6 sm:p-8">
            <div className="mb-6">
              <h3 className="mb-3 text-xl font-bold text-white">
                {language === 'en'
                  ? 'Website Development by City'
                  : language === 'kz'
                    ? 'Қала бойынша сайт әзірлеу'
                    : 'Разработка сайтов по городам'}
              </h3>
              <p className="max-w-3xl leading-relaxed text-slate-400">
                {language === 'en'
                  ? 'Geo landing pages for commercial search demand. Each page has a dedicated URL, metadata and city-focused introductory content.'
                  : language === 'kz'
                    ? 'Коммерциялық геосұранысқа арналған жеке беттер. Әр қалаға жеке URL, metadata және бейімделген кіріспе мәтін берілген.'
                    : 'Отдельные гео-страницы под коммерческие запросы. Для каждого города есть свой URL, metadata и адаптированный вступительный контент.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {cityEntries.map((city) => (
                <a
                  key={city.slug}
                  href={`/${language}/cities/${city.slug}`}
                  className="border border-slate-600 px-4 py-2 text-sm text-slate-300 transition-colors hover:border-blue-400 hover:text-blue-400"
                >
                  {language === 'en' ? city.name.en : language === 'kz' ? city.name.kz : city.locative.ru}
                </a>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Bottom Bar */}
        <AnimatedSection animationType="fade-in" delay={300}>
          <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-center text-slate-400 md:text-left">
              © {currentYear} Aidar. {t('footer.rights')}
            </p>
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <span>{t('footer.madeWith')}</span>
              <svg className="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span>{t('footer.inKazakhstan')}</span>
            </div>
          </div>
          </div>
        </AnimatedSection>
      </div>
    </footer>
  );
}
