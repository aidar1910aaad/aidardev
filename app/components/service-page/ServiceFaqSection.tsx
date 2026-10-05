import type { Language } from '../../contexts/LanguageContext';
import type { ServiceKey } from '../../data/services-config';
import { buildWhatsAppUrl } from '../../lib/whatsapp';
import { WhatsAppGlyph } from '../brand/icons';
import FaqAccordion from '../home/FaqAccordion';
import TrackedLink from '../home/TrackedLink';
import { container, getT, Kicker, sectionY, SectionTitle } from '../home/shared';
import { serviceWhatsAppMessage } from './ServiceHero';

type FaqItem = { question: string; answer: string };

/** Вопросы услуги («services.X.faq.N») — для страницы и для разметки FAQPage. */
export function serviceFaqItems(lang: Language, faqKey: string) {
  const t = getT(lang);
  const items: FaqItem[] = [];
  for (let i = 0; i < 30; i++) {
    const questionKey = `${faqKey}.${i}.question`;
    const question = t(questionKey);
    if (question === questionKey) break;
    items.push({ question, answer: t(`${faqKey}.${i}.answer`) });
  }
  return items;
}

/**
 * Блок вопросов: слева заголовок, пояснение и WhatsApp, справа аккордеон (ответы в HTML).
 * Страницы услуг и городов отличаются только вопросами, пояснением и ссылкой WhatsApp.
 */
export function FaqBlock({
  lang,
  items,
  intro,
  whatsappUrl,
  source,
}: {
  lang: Language;
  items: FaqItem[];
  /** Пояснение под заголовком; по умолчанию — «Не нашли ответ? Спросите в WhatsApp…». */
  intro?: string;
  whatsappUrl: string;
  /** Метка для аналитики клика по WhatsApp. */
  source: string;
}) {
  const t = getT(lang);
  if (items.length === 0) return null;

  return (
    <section id="faq" className="bg-[#fff7ef]">
      <div className={`${container} ${sectionY} flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16`}>
        <div className="flex flex-col gap-3 lg:sticky lg:top-28 lg:flex-[1_1_340px] lg:gap-[18px]">
          <Kicker>{t('landing.faq.kicker')}</Kicker>
          <SectionTitle className="text-[#1b1f3b]">{t('services.faq.title')}</SectionTitle>
          <p className="text-base leading-[1.6] text-[#464a66] lg:text-[17px]">{intro ?? t('landing.faq.text')}</p>
          <TrackedLink
            href={whatsappUrl}
            external
            event={{ type: 'whatsapp', source }}
            className="mt-1.5 flex h-[52px] items-center justify-center gap-2.5 self-start rounded-[14px] bg-[#25d366] px-[22px] text-base font-bold text-[#0b3d1f] transition-colors hover:bg-[#1fb356]"
          >
            <WhatsAppGlyph className="h-5 w-5" />
            {t('landing.faq.cta')}
          </TrackedLink>
        </div>
        <div className="lg:flex-[1.6_1_520px]">
          <FaqAccordion items={items} initialCount={6} showAllLabel={t('faq.showAll')} hideAllLabel={t('faq.hideAll')} />
        </div>
      </div>
    </section>
  );
}

export default function ServiceFaqSection({ lang, service, faqKey }: { lang: Language; service: ServiceKey; faqKey: string }) {
  const t = getT(lang);
  return (
    <FaqBlock
      lang={lang}
      items={serviceFaqItems(lang, faqKey)}
      whatsappUrl={buildWhatsAppUrl(serviceWhatsAppMessage(service, t), { sourcePath: `/${lang}/services/${service}` })}
      source={`service_${service}_faq`}
    />
  );
}
