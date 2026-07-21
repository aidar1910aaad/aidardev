'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Language, useLanguage } from '../../contexts/LanguageContext';
import { analyticsEvents } from '../../lib/analytics';

const services = ['websites', 'bots', 'ai', 'mobile', 'design', 'consulting'] as const;

export default function EditorialHeader() {
  const { language, t } = useLanguage();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const home = `/${language}`;
  const navItems = [
    { key: 'nav.projects', href: `${home}#projects` },
    { key: 'nav.process', href: `${home}#process` },
    { key: 'nav.pricing', href: `${home}/pricing` },
    { key: 'nav.blog', href: `${home}/blog` },
  ];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        setServicesOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const languageHref = (lang: Language) =>
    `/${lang}${pathname.replace(/^\/(ru|en|kz)(?=\/|$)/, '') || ''}`;

  return (
    <>
      <a href="#main-content" className="fixed left-3 top-3 z-[70] -translate-y-24 bg-[#11110f] px-4 py-3 text-sm font-bold text-white focus:translate-y-0">
        {language === 'en' ? 'Skip to content' : language === 'kz' ? 'Мазмұнға өту' : 'К содержанию'}
      </a>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#cfcdc5] bg-[#f4f2ec]/95 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-[1440px] items-center px-4 sm:px-6 lg:h-20 lg:px-10" aria-label="Primary">
          <Link href={home} aria-label="aidardev — home" className="mr-auto font-[family-name:var(--font-outfit)] text-xl font-bold tracking-[-0.05em]">
            aidar<span className="text-[#2446e8]">.dev</span>
          </Link>
          <div className="hidden items-center gap-1 lg:flex">
            <div className="relative">
              <button type="button" className="flex min-h-11 items-center gap-2 px-4 text-sm font-semibold hover:text-[#2446e8]" aria-expanded={servicesOpen} aria-controls="services-menu" onClick={() => setServicesOpen((open) => !open)}>
                {t('nav.about')} <span aria-hidden className={servicesOpen ? 'rotate-180' : ''}>↓</span>
              </button>
              {servicesOpen && (
                <div id="services-menu" className="absolute left-0 top-full w-72 border border-[#11110f] bg-[#f4f2ec] p-2 shadow-[8px_8px_0_#11110f]">
                  <Link href={`${home}/services`} className="block border-b border-[#cfcdc5] px-3 py-3 text-sm font-bold hover:bg-white">
                    {language === 'en' ? 'All services' : language === 'kz' ? 'Барлық қызметтер' : 'Все услуги'}
                  </Link>
                  {services.map((service) => (
                    <Link key={service} href={`${home}/services/${service}`} className="flex items-center justify-between px-3 py-2.5 text-sm hover:bg-white hover:text-[#2446e8]">
                      {t(`services.${service}.h1`).split('|')[0].trim()} <span aria-hidden>↗</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {navItems.map((item) => (
              <Link key={item.key} href={item.href} onClick={() => analyticsEvents.navigationClick(item.key)} className="flex min-h-11 items-center px-4 text-sm font-semibold hover:text-[#2446e8]">
                {t(item.key)}
              </Link>
            ))}
            <Link href={`${home}#contact`} className="ml-2 bg-[#11110f] px-5 py-3 text-sm font-bold text-white hover:bg-[#2446e8]">{t('nav.contact')}</Link>
          </div>
          <div className="ml-3 flex items-center border-l border-[#cfcdc5] pl-3">
            {(['ru', 'en', 'kz'] as Language[]).map((lang) => (
              <Link key={lang} href={languageHref(lang)} hrefLang={lang === 'kz' ? 'kk' : lang} aria-current={language === lang ? 'page' : undefined} className={`px-2 py-2 text-[11px] font-bold ${language === lang ? 'text-[#2446e8]' : 'text-[#68675f]'}`}>
                {lang.toUpperCase()}
              </Link>
            ))}
          </div>
          <button type="button" className="ml-2 grid h-11 w-11 place-items-center border border-[#11110f] lg:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen((open) => !open)}>
            <span aria-hidden className="text-xl">{menuOpen ? '×' : '≡'}</span>
          </button>
        </nav>
        {menuOpen && (
          <div id="mobile-menu" className="border-t border-[#cfcdc5] bg-[#f4f2ec] px-4 py-5 lg:hidden">
            <div className="mx-auto grid max-w-[1440px]">
              <Link href={`${home}/services`} className="border-b border-[#cfcdc5] py-4 text-lg font-bold">{t('nav.about')}</Link>
              {navItems.map((item) => <Link key={item.key} href={item.href} className="border-b border-[#cfcdc5] py-4 text-lg font-bold">{t(item.key)}</Link>)}
              <Link href={`${home}#contact`} className="mt-5 bg-[#2446e8] px-5 py-4 text-center font-bold text-white">{t('hero.contact')}</Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
