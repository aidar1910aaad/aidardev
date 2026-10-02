'use client';

import { useLanguage } from '../../contexts/LanguageContext';
import StickyWhatsApp from '../landing/StickyWhatsApp';
import type { ServiceKey } from '../../data/services-config';

interface ServiceStickyWhatsAppProps {
  serviceKey: ServiceKey;
}

/** Общая нижняя панель (WhatsApp + звонок) с сообщением про конкретную услугу. */
export default function ServiceStickyWhatsApp({ serviceKey }: ServiceStickyWhatsAppProps) {
  const { t } = useLanguage();
  const messageKey = `services.whatsapp.${serviceKey}`;
  const message = t(messageKey);

  return (
    <StickyWhatsApp
      source={`service_${serviceKey}`}
      message={message === messageKey ? t('services.cta.whatsappFallback') : message}
    />
  );
}
