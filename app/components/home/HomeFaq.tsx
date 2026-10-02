import type { Language } from '../../contexts/LanguageContext';
import { buildWhatsAppUrl } from '../../lib/whatsapp';
import { WhatsAppGlyph } from '../brand/icons';
import FaqAccordion from './FaqAccordion';
import TrackedLink from './TrackedLink';
import { container, getT, Kicker, sectionY, SectionTitle } from './shared';

/** Порядок вопросов на главной: сначала цена, сроки, договор и гарантии. Тексты — в faq.ts и landing.ts. */
const HOME_FAQ_KEYS = ['price', '1', '9', 'warranty', '8', '5', '3', '4', '2', '6', '7', '10'];

/** Вопросы главной — для страницы и для разметки FAQPage (одни и те же тексты). */
export function homeFaqItems(lang: Language) {
  const t = getT(lang);
  return HOME_FAQ_KEYS.map((key) => ({ question: t(`faq.${key}.question`), answer: t(`faq.${key}.answer`) }));
}

export default function HomeFaq({ lang }: { lang: Language }) {
  const t = getT(lang);

  return (
    <section id="faq" className="bg-[#fff7ef]">
      <div className={`${container} ${sectionY} flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16`}>
        <div className="flex flex-col gap-3 lg:sticky lg:top-28 lg:flex-[1_1_340px] lg:gap-[18px]">
          <Kicker>{t('landing.faq.kicker')}</Kicker>
          <SectionTitle className="text-[#1b1f3b]">{t('landing.faq.title')}</SectionTitle>
          <p className="text-base leading-[1.6] text-[#464a66] lg:text-[17px]">{t('landing.faq.text')}</p>
          <TrackedLink
            href={buildWhatsAppUrl(t('home.faq.ctaMessage'), { sourcePath: `/${lang}` })}
            external
            event={{ type: 'whatsapp', source: 'home_faq' }}
            className="mt-1.5 flex h-[52px] items-center justify-center gap-2.5 self-start rounded-[14px] bg-[#25d366] px-[22px] text-base font-bold text-[#0b3d1f] transition-colors hover:bg-[#1fb356]"
          >
            <WhatsAppGlyph className="h-5 w-5" />
            {t('landing.faq.cta')}
          </TrackedLink>
        </div>
        <div className="lg:flex-[1.6_1_520px]">
          <FaqAccordion items={homeFaqItems(lang)} initialCount={6} showAllLabel={t('faq.showAll')} hideAllLabel={t('faq.hideAll')} />
        </div>
      </div>
    </section>
  );
}
