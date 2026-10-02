'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Language, useLanguage } from '../../contexts/LanguageContext';
import { analyticsEvents, captureFirstTouchUtm } from '../../lib/analytics';
import { buildWhatsAppUrl, installWhatsAppSourceTracking, PRIMARY_WHATSAPP_NUMBER } from '../../lib/whatsapp';
import Wordmark from '../brand/Wordmark';
import { ArrowRight, WhatsAppGlyph } from '../brand/icons';

const services = ['websites', 'bots', 'ai', 'mobile', 'design', 'consulting'] as const;
const DISPLAY_PHONE = '+7 706 670 36 96';

const copy = {
  skip: { ru: 'К содержанию', kz: 'Мазмұнға өту', en: 'Skip to content' },
  home: { ru: 'aidardev — на главную', kz: 'aidardev — басты бет', en: 'aidardev — home' },
  allServices: { ru: 'Все услуги', kz: 'Барлық қызметтер', en: 'All services' },
  language: { ru: 'Язык сайта', kz: 'Сайт тілі', en: 'Site language' },
  openMenu: { ru: 'Открыть меню', kz: 'Мәзірді ашу', en: 'Open menu' },
  closeMenu: { ru: 'Закрыть меню', kz: 'Мәзірді жабу', en: 'Close menu' },
} as const;

function Chevron({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function EditorialHeader() {
  const { language, t } = useLanguage();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const home = `/${language}`;
  const navItems = [
    { key: 'nav.projects', href: `${home}#projects` },
    { key: 'nav.testimonials', href: `${home}#testimonials` },
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

  // Меню услуг закрывается кликом мимо него.
  useEffect(() => {
    if (!servicesOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!servicesRef.current?.contains(event.target as Node)) setServicesOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [servicesOpen]);

  // Тень у шапки появляется, когда страницу прокрутили.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Шапка есть на всех страницах: запоминаем first-touch UTM для заявок и помечаем
  // текст любой ссылки WhatsApp страницей, с которой написали («с сайта: /ru/...»).
  useEffect(() => {
    captureFirstTouchUtm();
    return installWhatsAppSourceTracking();
  }, []);

  const whatsappUrl = buildWhatsAppUrl(t('home.contact.baseMessage'), { sourcePath: pathname });

  const languageHref = (lang: Language) =>
    `/${lang}${pathname.replace(/^\/(ru|en|kz)(?=\/|$)/, '') || ''}`;
  // Статьи блога выходят на RU и KZ (бэкенд следит, чтобы KZ-версия была у каждой), EN-версий нет.
  const isArticle = /^\/(ru|en|kz)\/blog\/[^/]+/.test(pathname);
  const switchLanguages: Language[] = isArticle ? ['ru', 'kz'] : ['ru', 'en', 'kz'];

  const languageSwitch = (extra: string) => (
    <div role="group" aria-label={copy.language[language]} className={`items-center rounded-full bg-white p-[3px] shadow-[0_4px_14px_rgba(27,31,59,0.08)] ${extra}`}>
      {switchLanguages.map((lang) => (
        <Link
          key={lang}
          href={languageHref(lang)}
          hrefLang={lang === 'kz' ? 'kk' : lang}
          aria-current={language === lang ? 'page' : undefined}
          className={`flex min-h-9 min-w-10 items-center justify-center rounded-full px-2.5 text-[13px] font-bold transition-colors ${
            language === lang ? 'bg-[#1b1f3b] text-white' : 'text-[#62667f] hover:text-[#1b1f3b]'
          }`}
        >
          {lang.toUpperCase()}
        </Link>
      ))}
    </div>
  );

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <a href="#main-content" className="fixed left-3 top-3 z-[70] -translate-y-24 rounded-xl bg-[#1b1f3b] px-4 py-3 text-sm font-bold text-white focus:translate-y-0">
        {copy.skip[language]}
      </a>
      <header
        className={`fixed inset-x-0 top-0 bg-[#fff7ef]/95 backdrop-blur-md transition-shadow duration-300 ${menuOpen ? 'z-[65]' : 'z-50'} ${
          scrolled || menuOpen ? 'shadow-[0_6px_24px_rgba(27,31,59,0.09)]' : ''
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-[1240px] items-center gap-2 px-4 sm:px-6 lg:h-20 lg:gap-6 lg:px-10" aria-label="Primary">
          <Link href={home} aria-label={copy.home[language]} className="mr-auto flex shrink-0 items-center py-2 text-[#1b1f3b] hover:text-[#1b1f3b]" onClick={closeMenu}>
            <Wordmark className="h-[22px] w-auto lg:h-[26px]" />
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            <div className="relative" ref={servicesRef}>
              <button
                type="button"
                className="flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-[15px] font-semibold text-[#1b1f3b] hover:text-[#b4232c]"
                aria-expanded={servicesOpen}
                aria-controls="services-menu"
                onClick={() => setServicesOpen((open) => !open)}
              >
                {t('nav.about')} <Chevron open={servicesOpen} />
              </button>
              {servicesOpen && (
                <div id="services-menu" className="absolute left-0 top-full mt-2 w-80 rounded-[20px] bg-white p-2 shadow-[0_18px_44px_rgba(27,31,59,0.16)] ring-1 ring-[#efe3d5]">
                  {services.map((service) => (
                    <Link
                      key={service}
                      href={`${home}/services/${service}`}
                      onClick={() => setServicesOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3.5 py-3 text-[15px] font-semibold text-[#1b1f3b] hover:bg-[#fff7ef] hover:text-[#b4232c]"
                    >
                      {t(`footer.${service}`)} <ArrowRight className="h-4 w-4 opacity-60" />
                    </Link>
                  ))}
                  <Link
                    href={`${home}/services`}
                    onClick={() => setServicesOpen(false)}
                    className="mt-1 flex items-center justify-between rounded-xl bg-[#fff7ef] px-3.5 py-3 text-[15px] font-bold text-[#b4232c] hover:bg-[#ffefe3]"
                  >
                    {copy.allServices[language]} <ArrowRight />
                  </Link>
                </div>
              )}
            </div>
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => analyticsEvents.navigationClick(item.key)}
                className="flex min-h-11 items-center rounded-xl px-3 text-[15px] font-semibold text-[#1b1f3b] hover:text-[#b4232c]"
              >
                {t(item.key)}
              </Link>
            ))}
          </div>

          {languageSwitch('hidden lg:flex')}

          <a
            href={`tel:+${PRIMARY_WHATSAPP_NUMBER}`}
            onClick={() => analyticsEvents.phoneCall(DISPLAY_PHONE, 'header')}
            aria-label={`${t('leadForm.call')} ${DISPLAY_PHONE}`}
            className="hidden min-h-11 items-center whitespace-nowrap px-1 text-[15px] font-bold tabular-nums text-[#1b1f3b] hover:text-[#b4232c] xl:flex"
          >
            {DISPLAY_PHONE}
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, 'header')}
            aria-label={t('leadForm.whatsapp')}
            title={t('leadForm.whatsapp')}
            className="flex h-11 w-11 shrink-0 items-center justify-center gap-2 rounded-[14px] bg-[#25d366] text-[15px] font-bold text-[#0b3d1f] transition-colors hover:bg-[#1fb356] hover:text-[#0b3d1f] lg:h-12 lg:w-auto lg:px-5"
          >
            <WhatsAppGlyph className="h-[22px] w-[22px] shrink-0 lg:h-5 lg:w-5" />
            <span className="hidden lg:inline">WhatsApp</span>
          </a>

          <button
            type="button"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-white text-[#1b1f3b] shadow-[0_4px_14px_rgba(27,31,59,0.08)] lg:hidden"
            aria-label={menuOpen ? copy.closeMenu[language] : copy.openMenu[language]}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </nav>

        {menuOpen && (
          <div id="mobile-menu" className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-[#efe3d5] bg-[#fff7ef] px-4 pb-6 pt-2 sm:px-6 lg:hidden">
            <div className="mx-auto grid max-w-[1240px]">
              <Link href={`${home}/services`} onClick={closeMenu} className="flex items-center justify-between border-b border-[#efe3d5] py-4 text-lg font-bold text-[#1b1f3b]">
                {t('nav.about')} <ArrowRight className="h-5 w-5 text-[#b4232c]" />
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => {
                    analyticsEvents.navigationClick(item.key);
                    closeMenu();
                  }}
                  className="flex items-center justify-between border-b border-[#efe3d5] py-4 text-lg font-bold text-[#1b1f3b]"
                >
                  {t(item.key)} <ArrowRight className="h-5 w-5 text-[#b4232c]" />
                </Link>
              ))}
              <div className="mt-5 flex items-center justify-between gap-3">
                {languageSwitch('flex')}
                <a
                  href={`tel:+${PRIMARY_WHATSAPP_NUMBER}`}
                  onClick={() => analyticsEvents.phoneCall(DISPLAY_PHONE, 'header')}
                  className="text-[15px] font-bold tabular-nums text-[#1b1f3b]"
                >
                  {DISPLAY_PHONE}
                </a>
              </div>
              <Link
                href={`${home}#contact`}
                onClick={closeMenu}
                className="mt-5 flex h-14 items-center justify-center gap-2 rounded-[14px] bg-[#b4232c] px-5 text-base font-bold text-white hover:bg-[#8f1b23] hover:text-white"
              >
                {t('hero.contact')} <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
