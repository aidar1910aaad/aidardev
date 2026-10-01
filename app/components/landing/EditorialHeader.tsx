'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Language, useLanguage } from '../../contexts/LanguageContext';
import { analyticsEvents, captureFirstTouchUtm } from '../../lib/analytics';
import { buildWhatsAppUrl, installWhatsAppSourceTracking, PRIMARY_WHATSAPP_NUMBER } from '../../lib/whatsapp';

const services = ['websites', 'bots', 'ai', 'mobile', 'design', 'consulting'] as const;
const DISPLAY_PHONE = '+7 706 670 36 96';

function WhatsAppGlyph({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

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
                      {t(`footer.${service}`)} <span aria-hidden>↗</span>
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
            <a href={`tel:+${PRIMARY_WHATSAPP_NUMBER}`} onClick={() => analyticsEvents.phoneCall(DISPLAY_PHONE, 'header')} aria-label={`${t('leadForm.call')} ${DISPLAY_PHONE}`} className="ml-2 hidden min-h-11 items-center whitespace-nowrap px-2 text-sm font-semibold tabular-nums hover:text-[#2446e8] xl:flex">
              {DISPLAY_PHONE}
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, 'header')} aria-label={t('leadForm.whatsapp')} title={t('leadForm.whatsapp')} className="ml-2 flex min-h-11 min-w-11 items-center justify-center gap-2 bg-[#25D366] px-3 text-sm font-bold text-[#06231a] hover:bg-[#1fb356]">
              <WhatsAppGlyph className="h-5 w-5 shrink-0" />
              <span className="hidden xl:inline">WhatsApp</span>
            </a>
            <Link href={`${home}#contact`} className="ml-2 bg-[#11110f] px-5 py-3 text-sm font-bold text-white hover:bg-[#2446e8]">{t('nav.contact')}</Link>
          </div>
          <div className="ml-3 flex items-center border-l border-[#cfcdc5] pl-3">
            {switchLanguages.map((lang) => (
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
