import type { ReactNode } from 'react';
import type { Language } from '../../contexts/LanguageContext';
import { ArrowRight, Check } from '../brand/icons';
import TrackedLink from './TrackedLink';
import { container, getT, Kicker, plain, rich, sectionY, SectionTitle, type T } from './shared';

type CardKey = 'site' | 'bots' | 'ai' | 'shop';

const cards: Array<{ key: CardKey; service: string; bg: string; line: string; iconColor: string }> = [
  { key: 'site', service: 'websites', bg: '#ffefe3', line: '#f3d6c1', iconColor: '#b4232c' },
  { key: 'bots', service: 'bots', bg: '#e8faef', line: '#c6edd5', iconColor: '#0e7a3a' },
  { key: 'ai', service: 'ai', bg: '#f0edff', line: '#dcd5fa', iconColor: '#6d5bd0' },
  { key: 'shop', service: 'websites', bg: '#fff6dc', line: '#f3e0a6', iconColor: '#a16207' },
];

const iconProps = {
  viewBox: '0 0 24 24',
  className: 'h-[22px] w-[22px]',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

const icons: Record<CardKey, ReactNode> = {
  site: (
    <svg {...iconProps}>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M3 9h18M7 13h6M7 16h4" />
    </svg>
  ),
  bots: (
    <svg {...iconProps}>
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12z" />
      <path d="M9 11h6M9 14h4" />
    </svg>
  ),
  ai: (
    <svg {...iconProps}>
      <path d="M11 3l1.8 4.2L17 9l-4.2 1.8L11 15l-1.8-4.2L5 9l4.2-1.8L11 3z" />
      <path d="M18.5 14.5l.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8.8-1.7z" />
    </svg>
  ),
  shop: (
    <svg {...iconProps}>
      <path d="M5 8h14l-1.2 12H6.2L5 8z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  ),
};

/** Мини-иллюстрации над карточками (с планшета и шире). */
function Illustration({ card, t }: { card: CardKey; t: T }) {
  const box = 'box-border hidden h-[190px] md:flex';
  if (card === 'site') {
    return (
      <div className={`${box} items-end px-6 pt-6`} aria-hidden="true">
        <div className="box-border flex h-[154px] w-full flex-col gap-[9px] rounded-t-[14px] bg-white p-3 shadow-[0_4px_14px_rgba(27,31,59,0.08)]">
          <div className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff8a6b]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#ffd166]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#7cdb9e]" />
          </div>
          <div className="h-2.5 w-[72%] rounded-[5px] bg-[#1b1f3b]" />
          <div className="h-2 w-[92%] rounded bg-[#f1e6da]" />
          <div className="h-2 w-[60%] rounded bg-[#f1e6da]" />
          <div className="mt-1.5 h-6 w-24 self-start rounded-[7px] bg-[#b4232c]" />
        </div>
      </div>
    );
  }
  if (card === 'bots') {
    return (
      <div className={`${box} flex-col justify-end gap-2 p-6 text-xs font-medium text-[#1b1f3b]`} aria-hidden="true">
        <div className="max-w-[80%] self-end rounded-[14px_14px_4px_14px] bg-[#d9fdd3] px-[11px] py-[9px] shadow-[0_4px_14px_rgba(14,122,58,0.1)]">
          {t('landing.services.chat.question')}
        </div>
        <div className="max-w-[86%] self-start rounded-[14px_14px_14px_4px] bg-white px-[11px] py-[9px] shadow-[0_4px_14px_rgba(14,122,58,0.1)]">
          {t('landing.services.chat.answer')}
        </div>
      </div>
    );
  }
  if (card === 'ai') {
    return (
      <div className={`${box} flex-col justify-end gap-2.5 p-6`} aria-hidden="true">
        <div className="flex items-center gap-2 self-start rounded-xl bg-white px-3 py-2.5 shadow-[0_4px_14px_rgba(42,31,122,0.1)]">
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="#6d5bd0" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z" />
          </svg>
          <span className="text-xs font-semibold text-[#1b1f3b]">{t('landing.services.ai.hint')}</span>
        </div>
        <div className="flex gap-[5px] self-start rounded-xl bg-white px-3.5 py-3 shadow-[0_4px_14px_rgba(42,31,122,0.1)]">
          <span className="h-[7px] w-[7px] rounded-full bg-[#6d5bd0]" />
          <span className="h-[7px] w-[7px] rounded-full bg-[#a99df0]" />
          <span className="h-[7px] w-[7px] rounded-full bg-[#d4cef8]" />
        </div>
      </div>
    );
  }
  return (
    <div className={`${box} flex-col justify-end gap-2.5 p-6`} aria-hidden="true">
      <div className="grid grid-cols-3 gap-2">
        {['#ffe7a3', '#ffd2bd', '#cff3dd'].map((color, index) => (
          <div key={color} className="flex h-16 flex-col justify-end gap-1 rounded-[10px] bg-white p-1.5 shadow-[0_4px_14px_rgba(92,66,0,0.1)]">
            <span className="h-6 rounded-md" style={{ background: color }} />
            <span className="h-[5px] rounded-[3px] bg-[#1b1f3b]" style={{ width: ['70%', '60%', '75%'][index] }} />
          </div>
        ))}
      </div>
      <div className="self-start rounded-full bg-[#f14635] px-3 py-1.5 text-xs font-bold text-white">{t('landing.services.shop.badge')}</div>
    </div>
  );
}

export default function HomeServices({ lang }: { lang: Language }) {
  const t = getT(lang);
  const included = [1, 2, 3, 4, 5, 6].map((n) => t(`landing.included.${n}`));
  const pricingHref = `/${lang}/pricing`;
  const pricingButton =
    'items-center justify-center gap-2 rounded-[14px] border-2 border-[#1b1f3b] px-5 text-[15px] font-bold text-[#1b1f3b] transition-colors hover:bg-[#1b1f3b] hover:text-white';

  return (
    <section id="services" className="bg-white">
      <div className={`${container} ${sectionY}`}>
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div className="flex flex-col gap-3 lg:gap-4">
            <Kicker>{t('landing.services.kicker')}</Kicker>
            <SectionTitle className="max-w-[640px] text-[#1b1f3b]">{t('landing.services.title')}</SectionTitle>
          </div>
          <p className="hidden max-w-[400px] text-[17px] leading-[1.6] text-[#464a66] md:block">{t('landing.services.text')}</p>
        </div>

        <div className="mt-6 grid gap-3.5 md:grid-cols-2 md:gap-5 lg:mt-12 xl:grid-cols-4">
          {cards.map((card) => {
            const title = t(`landing.services.${card.key}.title`);
            return (
              <article key={card.key} className="relative flex flex-col overflow-hidden rounded-[22px] md:rounded-3xl" style={{ background: card.bg }}>
                <Illustration card={card.key} t={t} />
                <div className="flex grow flex-col gap-2.5 p-[18px] md:p-6">
                  <div className="flex items-center gap-3">
                    <span
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-white shadow-[0_4px_14px_rgba(27,31,59,0.08)] md:hidden"
                      style={{ color: card.iconColor }}
                    >
                      {icons[card.key]}
                    </span>
                    <h3 className="text-lg leading-[1.25] tracking-[-0.015em] text-[#1b1f3b] md:text-[21px]">{rich(title)}</h3>
                  </div>
                  <p className="grow text-[15px] leading-[1.55] text-[#464a66]">{t(`landing.services.${card.key}.text`)}</p>
                  <div className="flex items-center justify-between gap-2 border-t pt-3 md:pt-3.5" style={{ borderColor: card.line }}>
                    <span className="flex flex-col gap-px md:gap-0.5">
                      <span className="whitespace-nowrap font-display text-lg font-bold text-[#1b1f3b] md:text-xl">
                        {t(`landing.services.${card.key}.price`)}
                      </span>
                      <span className="text-xs font-semibold text-[#62667f] md:text-[13px]">{t(`landing.services.${card.key}.time`)}</span>
                    </span>
                    <a
                      href={`/${lang}/services/${card.service}`}
                      aria-label={`${t('landing.services.more')}: ${plain(title)}`}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-[#1b1f3b] shadow-[0_4px_14px_rgba(27,31,59,0.08)] transition-transform after:absolute after:inset-0 after:content-[''] hover:translate-x-0.5"
                    >
                      <ArrowRight />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-3.5 rounded-[22px] bg-[#fff7ef] p-5 md:mt-5 md:rounded-3xl md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg tracking-[-0.015em] text-[#1b1f3b] md:text-[22px]">{t('landing.included.title')}</h3>
            <TrackedLink href={pricingHref} event={{ type: 'calculate', source: 'home_included' }} className={`hidden h-12 md:flex ${pricingButton}`}>
              {t('landing.included.cta')} <ArrowRight />
            </TrackedLink>
          </div>
          <ul className="mt-4 grid gap-3 md:mt-[22px] md:grid-cols-2 md:gap-x-8 md:gap-y-3.5">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[15px] font-medium text-[#1b1f3b] md:gap-3 md:text-base">
                <span className="mt-px grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-[#b4232c] text-white md:h-6 md:w-6">
                  <Check className="h-[13px] w-[13px] md:h-3.5 md:w-3.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <TrackedLink href={pricingHref} event={{ type: 'calculate', source: 'home_included' }} className={`mt-3.5 flex h-[52px] md:hidden ${pricingButton}`}>
          {t('landing.included.cta')} <ArrowRight />
        </TrackedLink>
      </div>
    </section>
  );
}
