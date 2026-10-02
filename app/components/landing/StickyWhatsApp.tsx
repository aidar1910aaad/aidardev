'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';
import { analyticsEvents } from '../../lib/analytics';
import { buildWhatsAppUrl, PRIMARY_WHATSAPP_NUMBER } from '../../lib/whatsapp';
import { PhoneIcon, WhatsAppGlyph } from '../brand/icons';

const DISPLAY_PHONE = '+7 706 670 36 96';

interface StickyWhatsAppProps {
  /** Analytics prefix of the page: `${source}_mobile_bar`, `${source}_desktop_pill`. */
  source?: string;
  /** Prefilled WhatsApp text; defaults to the general home message. */
  message?: string;
}

export default function StickyWhatsApp({ source = 'home', message }: StickyWhatsAppProps) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [deskVisible, setDeskVisible] = useState(false);
  const whatsappUrl = buildWhatsAppUrl(message ?? t('home.hero.message'), { sourcePath: pathname });

  // The desktop pill waits until the hero CTA has scrolled away; the mobile bar
  // is always present so WhatsApp is one tap away at any point on the page.
  useEffect(() => {
    const onScroll = () => setDeskVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className="action-bar" role="region" aria-label={t('home.sticky')}>
        <div className="action-bar__row">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, `${source}_mobile_bar`)}
            className="action-bar__primary"
            aria-label={t('home.bar.cta')}
          >
            <WhatsAppGlyph className="h-5 w-5 shrink-0" />
            WhatsApp
          </a>
          <a
            href={`tel:+${PRIMARY_WHATSAPP_NUMBER}`}
            onClick={() => analyticsEvents.phoneCall(DISPLAY_PHONE, `${source}_mobile_bar`)}
            className="action-bar__secondary"
            aria-label={`${t('home.bar.call')} ${DISPLAY_PHONE}`}
          >
            <PhoneIcon className="h-[18px] w-[18px] shrink-0" />
            {t('home.bar.call')}
          </a>
        </div>
        <span className="action-bar__hint">{t('landing.bar.caption')}</span>
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, `${source}_desktop_pill`)}
        aria-hidden={!deskVisible}
        tabIndex={deskVisible ? 0 : -1}
        className={`desk-cta ${deskVisible ? '' : 'desk-cta--hidden'}`}
      >
        <WhatsAppGlyph className="h-5 w-5" />
        {t('home.bar.cta')}
      </a>
    </>
  );
}
