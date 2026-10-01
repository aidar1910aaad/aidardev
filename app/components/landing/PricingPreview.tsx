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
  // Единый формат цен на всём сайте: «150 000 ₸» (как в прайсе и на страницах услуг).
  const formatPrice = (price: number) => new Intl.NumberFormat('ru-RU').format(price);
  const currencySign = (currency: string) => (currency === 'KZT' ? '₸' : currency);

  return (
    <section id="pricing-preview" className="border-y border-[#11110f] bg-[#11110f] py-16 text-white sm:py-20">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-16">
        <AnimatedSection animationType="slide-up">
          <div className="grid gap-5 border-b border-[#565650] pb-8 lg:grid-cols-12 lg:items-end lg:pb-10">
            <div className="lg:col-span-8">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#7f96ff]">
                06 / {t('home.pricing.kicker')}
              </p>
              <h2 className="mt-5 max-w-4xl text-3xl font-semibold tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                {t('home.pricing.title')}
              </h2>
            </div>
            <p className="text-sm leading-6 text-[#b7b6af] sm:text-base sm:leading-7 lg:col-span-4">
              {t('home.pricing.subtitle')}
            </p>
          </div>
        </AnimatedSection>

        <div className="grid border-l border-t border-[#565650] grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <AnimatedSection key={item.key} animationType="slide-up" delay={index * 70}>
              <article className="flex h-full flex-col border-b border-r border-[#565650] p-4 sm:min-h-64 sm:p-6">
                <span className="font-mono text-xs text-[#8d8c85]">0{index + 1}</span>
                <h3 className="mt-4 text-sm font-bold leading-5 sm:mt-8 sm:text-xl sm:leading-6">
                  {t(`home.pricing.${item.key}`)}
                </h3>
                <p className="mt-4 text-xs text-[#b7b6af] sm:mt-5 sm:text-sm">{t('home.pricing.from')}</p>
                <p className="mt-1 text-xl font-semibold tracking-[-0.04em] text-[#7f96ff] sm:text-3xl">
                  {formatPrice(item.package.price)} {currencySign(item.package.currency)}
                </p>
                <div className="mt-auto flex flex-col gap-0.5 border-t border-[#565650] pt-4 text-[11px] sm:flex-row sm:justify-between sm:pt-5 sm:text-xs">
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
            className="cta-band__primary"
          >
            {t('home.pricing.cta')} <span aria-hidden>↗</span>
          </a>
          <Link
            href={`/${language}/pricing`}
            onClick={() => analyticsEvents.calculatePriceClick('home_pricing')}
            className="cta-band__secondary cta-band__secondary--light"
          >
            {t('home.pricing.all')} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
