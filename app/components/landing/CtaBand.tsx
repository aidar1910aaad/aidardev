'use client';

import { useLanguage } from '../../contexts/LanguageContext';
import { analyticsEvents } from '../../lib/analytics';
import { buildWhatsAppUrl, PRIMARY_WHATSAPP_NUMBER } from '../../lib/whatsapp';
import AnimatedSection from '../common/AnimatedSection';
import ReplyBadge from './ReplyBadge';

const DISPLAY_PHONE = '+7 706 670 36 96';

interface CtaBandProps {
  /** Translation namespace under `home.band.` — e.g. "stack" or "process" */
  variant: 'stack' | 'process';
  /** Analytics source label */
  source: string;
  tone?: 'paper' | 'ink';
}

export default function CtaBand({ variant, source, tone = 'paper' }: CtaBandProps) {
  const { t } = useLanguage();
  const isInk = tone === 'ink';

  return (
    <section
      className={`border-b py-10 sm:py-12 ${
        isInk ? 'border-[#565650] bg-[#11110f] text-white' : 'border-[#cfcdc5] bg-white'
      }`}
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-16">
        <AnimatedSection animationType="slide-up">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="min-w-0">
              <h2 className="text-2xl font-semibold tracking-[-0.04em] sm:text-3xl lg:text-4xl">
                {t(`home.band.${variant}.title`)}
              </h2>
              <p className={`mt-3 max-w-2xl text-sm leading-6 sm:text-base sm:leading-7 ${isInk ? 'text-[#b7b6af]' : 'text-[#55544e]'}`}>
                {t(`home.band.${variant}.text`)}
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={buildWhatsAppUrl(t(`home.band.${variant}.message`))}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, source)}
                className="cta-band__primary"
              >
                {t('home.band.cta')} <span aria-hidden>↗</span>
              </a>
              <a
                href={`tel:+${PRIMARY_WHATSAPP_NUMBER}`}
                onClick={() => analyticsEvents.phoneCall(DISPLAY_PHONE, source)}
                className={`cta-band__secondary ${isInk ? 'cta-band__secondary--light' : ''}`}
              >
                {t('home.band.call')} <span aria-hidden>→</span>
              </a>
            </div>
          </div>
          {!isInk && (
            <div className="mt-5">
              <ReplyBadge />
            </div>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
}
