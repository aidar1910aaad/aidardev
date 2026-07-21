'use client';

import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedSection from '../common/AnimatedSection';
import { analyticsEvents } from '../../lib/analytics';
import { buildWhatsAppUrl, PRIMARY_WHATSAPP_NUMBER } from '../../lib/whatsapp';
import type { ServiceKey } from '../../data/services-config';

interface ServiceCTAProps {
  serviceKey: ServiceKey;
}

export default function ServiceCTA({ serviceKey }: ServiceCTAProps) {
  const { t, language } = useLanguage();
  const messageKey = `services.whatsapp.${serviceKey}`;
  const whatsappMessage = t(messageKey);
  const whatsappHref = buildWhatsAppUrl(
    whatsappMessage === messageKey ? t('services.cta.whatsappFallback') : whatsappMessage,
  );

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'auto' });
      analyticsEvents.scrollToSection('contact');
    }
  };

  const scrollToPricing = () => {
    if (typeof window !== 'undefined') {
      window.location.href = `/${language}/pricing`;
      analyticsEvents.calculatePriceClick(`Service Page: ${serviceKey}`);
    }
  };

  return (
    <AnimatedSection animationType="slide-up" delay={700}>
      <div className="mb-16 grid gap-8 border-y border-slate-300 bg-white p-8 md:grid-cols-2 md:p-12">
        <div>
          <h3 className="mb-4 text-3xl font-semibold tracking-[-0.035em] text-slate-950 md:text-4xl">
            {t('services.cta.title')}
          </h3>
          <p className="text-lg leading-8 text-slate-600">{t('services.cta.description')}</p>
        </div>
        <div className="flex flex-col justify-center gap-3">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, `service_${serviceKey}_footer`)}
            className="bg-blue-700 px-8 py-4 text-center font-semibold text-white transition-colors hover:bg-blue-800"
          >
            {t('services.cta.whatsapp')}
          </a>
          <button
            onClick={scrollToPricing}
            className="border border-slate-400 bg-white px-8 py-4 font-semibold text-slate-950 transition-colors hover:border-blue-700 hover:text-blue-700"
          >
            {t('services.cta.pricing')}
          </button>
          <button
            onClick={scrollToContact}
            className="border border-slate-300 bg-[#f7f7f5] px-8 py-4 font-semibold text-slate-700 transition-colors hover:border-blue-700 hover:text-blue-700"
          >
            {t('services.cta.contact')}
          </button>
        </div>
      </div>
    </AnimatedSection>
  );
}
