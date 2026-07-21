'use client';

import { useLanguage } from '../../contexts/LanguageContext';
import { analyticsEvents } from '../../lib/analytics';
import { buildWhatsAppUrl, PRIMARY_WHATSAPP_NUMBER } from '../../lib/whatsapp';
import type { ServiceKey } from '../../data/services-config';

interface ServiceStickyWhatsAppProps {
  serviceKey: ServiceKey;
}

export default function ServiceStickyWhatsApp({ serviceKey }: ServiceStickyWhatsAppProps) {
  const { t } = useLanguage();
  const messageKey = `services.whatsapp.${serviceKey}`;
  const message = t(messageKey);

  return (
    <a
      href={buildWhatsAppUrl(message === messageKey ? t('services.cta.whatsappFallback') : message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, `service_${serviceKey}_sticky`)}
      className="fixed inset-x-4 bottom-4 z-50 flex min-h-13 items-center justify-center bg-[#2446e8] px-5 py-3 text-center text-sm font-bold text-white shadow-[0_10px_35px_rgba(0,0,0,0.28)] sm:hidden"
    >
      {t('services.cta.whatsapp')} <span className="ml-3" aria-hidden>↗</span>
    </a>
  );
}
