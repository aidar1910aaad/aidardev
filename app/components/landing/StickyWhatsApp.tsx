'use client';

import { useLanguage } from '../../contexts/LanguageContext';
import { analyticsEvents } from '../../lib/analytics';
import { buildWhatsAppUrl, PRIMARY_WHATSAPP_NUMBER } from '../../lib/whatsapp';

export default function StickyWhatsApp() {
  const { t } = useLanguage();

  return (
    <a
      href={buildWhatsAppUrl(t('home.hero.message'))}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, 'home_mobile_sticky')}
      className="fixed inset-x-4 bottom-4 z-50 flex min-h-13 items-center justify-center bg-[#2446e8] px-5 py-3 text-center text-sm font-bold text-white shadow-[0_10px_35px_rgba(0,0,0,0.28)] sm:hidden"
    >
      {t('home.sticky')} <span className="ml-3" aria-hidden>↗</span>
    </a>
  );
}
