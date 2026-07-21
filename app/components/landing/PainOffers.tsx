'use client';

import { useLanguage } from '../../contexts/LanguageContext';
import { analyticsEvents } from '../../lib/analytics';
import { buildWhatsAppUrl, PRIMARY_WHATSAPP_NUMBER } from '../../lib/whatsapp';
import AnimatedSection from '../common/AnimatedSection';

const offerKeys = ['leads', 'messages', 'routine', 'launch'] as const;

export default function PainOffers() {
  const { t } = useLanguage();

  return (
    <section id="solutions" className="border-b border-[#cfcdc5] bg-[#f4f2ec] py-16 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-16">
        <AnimatedSection animationType="slide-up">
          <div className="grid gap-6 border-b-2 border-[#11110f] pb-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="editorial-kicker">{t('home.offers.kicker')}</p>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
                {t('home.offers.title')}
              </h2>
            </div>
            <p className="text-base leading-7 text-[#55544e] lg:col-span-4">
              {t('home.offers.subtitle')}
            </p>
          </div>
        </AnimatedSection>

        <div className="grid border-l border-t border-[#cfcdc5] md:grid-cols-2">
          {offerKeys.map((key, index) => (
            <AnimatedSection key={key} animationType="slide-up" delay={index * 70}>
              <article className="flex h-full flex-col border-b border-r border-[#cfcdc5] bg-white p-6 sm:p-8">
                <div className="mb-8 flex items-start justify-between">
                  <span className="font-mono text-xs text-[#68675f]">0{index + 1}</span>
                  <span className="h-3 w-3 bg-[#2446e8]" aria-hidden />
                </div>
                <h3 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl">
                  {t(`home.offers.${key}.title`)}
                </h3>
                <dl className="mt-7 space-y-5 text-sm leading-6">
                  <div>
                    <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#2446e8]">
                      {t('home.offers.resultLabel')}
                    </dt>
                    <dd className="mt-1 text-[#33332f]">{t(`home.offers.${key}.result`)}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#68675f]">
                      {t('home.offers.includesLabel')}
                    </dt>
                    <dd className="mt-1 text-[#55544e]">{t(`home.offers.${key}.includes`)}</dd>
                  </div>
                </dl>
                <a
                  href={buildWhatsAppUrl(t(`home.offers.${key}.message`))}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, `home_offer_${key}`)}
                  className="mt-8 inline-flex min-h-12 items-center justify-between border-t border-[#11110f] pt-4 text-sm font-bold hover:text-[#2446e8]"
                  aria-label={`${t('home.offers.cta')}: ${t(`home.offers.${key}.title`)}`}
                >
                  {t('home.offers.cta')} <span aria-hidden>↗</span>
                </a>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
