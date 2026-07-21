'use client';

import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedSection from '../common/AnimatedSection';
import { analyticsEvents } from '../../lib/analytics';
import { buildWhatsAppUrl, PRIMARY_WHATSAPP_NUMBER } from '../../lib/whatsapp';
import type { ServiceKey } from '../../data/services-config';

interface ServiceHeaderProps {
  h1Key: string;
  introKey: string;
  introContent?: string;
  serviceKey: ServiceKey;
}

export default function ServiceHeader({ h1Key, introKey, introContent, serviceKey }: ServiceHeaderProps) {
  const { t, language } = useLanguage();
  const messageKey = `services.whatsapp.${serviceKey}`;
  const whatsappMessage = t(messageKey);
  const whatsappHref = buildWhatsAppUrl(
    whatsappMessage === messageKey ? t('services.cta.whatsappFallback') : whatsappMessage,
  );

  return (
    <>
      <AnimatedSection animationType="slide-up" delay={0}>
        <div className="mb-12 grid gap-8 border-b border-slate-300 pb-12 md:grid-cols-12">
          <div className="md:col-span-9">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
              {language === 'ru' ? 'Услуги · Казахстан' : language === 'kz' ? 'Қызметтер · Қазақстан' : 'Services · Kazakhstan'}
            </p>
            <h1 className="text-4xl font-semibold leading-[1.04] tracking-[-0.05em] text-slate-950 sm:text-6xl md:text-7xl">
              {t(h1Key)}
            </h1>
          </div>
          <div className="flex flex-col justify-end gap-3 md:col-span-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, `service_${serviceKey}_hero`)}
              className="bg-blue-700 px-6 py-4 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-800"
            >
              {t('services.cta.whatsapp')}
            </a>
            <a
              href={`/${language}/pricing`}
              className="border border-slate-400 bg-white px-6 py-4 text-center text-sm font-semibold text-slate-950 transition-colors hover:border-blue-700 hover:text-blue-700"
            >
              {t('services.cta.pricing')}
            </a>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection animationType="slide-up" delay={100}>
        <div className="mb-16 grid md:grid-cols-12">
          <p className="border-l-2 border-blue-700 pl-6 text-xl leading-8 text-slate-700 md:col-span-8 md:col-start-5">
            {t(introKey)}
          </p>
        </div>
      </AnimatedSection>

      {introContent && (
        <AnimatedSection animationType="slide-up" delay={150}>
          <div className="mb-12 max-w-4xl">
            <p className="text-lg leading-8 text-slate-600">{introContent}</p>
          </div>
        </AnimatedSection>
      )}
    </>
  );
}
