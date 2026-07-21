'use client';

import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';
import pricingData from '../../data/pricing.json';
import { analyticsEvents } from '../../lib/analytics';
import { buildWhatsAppUrl, PRIMARY_WHATSAPP_NUMBER } from '../../lib/whatsapp';
import AnimatedSection from '../common/AnimatedSection';

export default function PricingPreview() {
  const { language, t } = useLanguage();
  const items = [
    { key: 'website', package: pricingData.services.websites.base },
    { key: 'bot', package: pricingData.services.bots.telegram_simple },
    { key: 'ai', package: pricingData.services.ai.chatbot },
    { key: 'app', package: pricingData.services.mobile.mvp },
  ] as const;
  const locale = language === 'kz' ? 'kk-KZ' : language === 'en' ? 'en-US' : 'ru-RU';

  return (
    <section id="pricing-preview" className="border-y border-[#11110f] bg-[#11110f] py-20 text-white">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-16">
        <AnimatedSection animationType="slide-up">
          <div className="grid gap-7 border-b border-[#565650] pb-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#7f96ff]">
                {t('home.pricing.kicker')}
              </p>
              <h2 className="mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
                {t('home.pricing.title')}
              </h2>
            </div>
            <p className="text-base leading-7 text-[#b7b6af] lg:col-span-4">
              {t('home.pricing.subtitle')}
            </p>
          </div>
        </AnimatedSection>

        <div className="grid border-l border-t border-[#565650] sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <AnimatedSection key={item.key} animationType="slide-up" delay={index * 70}>
              <article className="flex h-full min-h-64 flex-col border-b border-r border-[#565650] p-6">
                <span className="font-mono text-xs text-[#8d8c85]">0{index + 1}</span>
                <h3 className="mt-8 text-xl font-bold">{t(`home.pricing.${item.key}`)}</h3>
                <p className="mt-5 text-sm text-[#b7b6af]">{t('home.pricing.from')}</p>
                <p className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-[#7f96ff]">
                  {new Intl.NumberFormat(locale).format(item.package.price)} {item.package.currency}
                </p>
                <div className="mt-auto flex justify-between border-t border-[#565650] pt-5 text-xs">
                  <span className="text-[#8d8c85]">{t('home.pricing.timeline')}</span>
                  <span className="font-semibold">{t('home.pricing.afterAssessment')}</span>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={buildWhatsAppUrl(t('home.pricing.message'))}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, 'home_pricing')}
            className="inline-flex min-h-13 items-center justify-between bg-[#2446e8] px-7 py-4 text-sm font-bold hover:bg-[#3656ef]"
          >
            {t('home.pricing.cta')} <span className="ml-8" aria-hidden>↗</span>
          </a>
          <Link
            href={`/${language}/pricing`}
            onClick={() => analyticsEvents.calculatePriceClick('home_pricing')}
            className="inline-flex min-h-13 items-center justify-between border border-[#8d8c85] px-7 py-4 text-sm font-bold hover:border-white"
          >
            {t('home.pricing.all')} <span className="ml-8" aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
