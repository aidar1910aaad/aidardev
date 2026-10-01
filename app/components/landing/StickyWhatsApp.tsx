'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';
import { analyticsEvents } from '../../lib/analytics';
import { buildWhatsAppUrl, PRIMARY_WHATSAPP_NUMBER } from '../../lib/whatsapp';

const DISPLAY_PHONE = '+7 706 670 36 96';

function WhatsAppGlyph({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

interface StickyWhatsAppProps {
  /** Analytics prefix of the page: `${source}_mobile_bar`, `${source}_desktop_pill`. */
  source?: string;
}

export default function StickyWhatsApp({ source = 'home' }: StickyWhatsAppProps) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [deskVisible, setDeskVisible] = useState(false);
  const whatsappUrl = buildWhatsAppUrl(t('home.hero.message'), { sourcePath: pathname });

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
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, `${source}_mobile_bar`)}
          className="action-bar__primary"
        >
          <WhatsAppGlyph className="h-6 w-6 shrink-0" />
          <span className="min-w-0">
            <span className="action-bar__label">{t('home.bar.cta')}</span>
            <span className="action-bar__hint">{t('home.reply')}</span>
          </span>
        </a>
        <a
          href={`tel:+${PRIMARY_WHATSAPP_NUMBER}`}
          onClick={() => analyticsEvents.phoneCall(DISPLAY_PHONE, `${source}_mobile_bar`)}
          className="action-bar__secondary"
          aria-label={`${t('home.bar.call')} ${DISPLAY_PHONE}`}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.9} aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293a1.125 1.125 0 01-1.21.38 12.035 12.035 0 01-7.143-7.143 1.125 1.125 0 01.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
            />
          </svg>
        </a>
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
