import type { Language } from '../../contexts/LanguageContext';
import type { ServiceKey } from '../../data/services-config';
import { ArrowRight } from '../brand/icons';
import { getT, type T } from '../home/shared';
import { minPrice, priceFrom, ServiceIcon, serviceTint } from './meta';

/** Короткое название услуги из H1 (до «|»), как было в каталоге и «Связанных услугах». */
export function serviceTitle(t: T, service: ServiceKey) {
  return t(`services.${service}.h1`).split('|')[0].trim();
}

/** Карточка услуги в цветах главной: иконка, название, вступление, цена «от» и срок. Вся карточка — ссылка. */
export function ServiceLinkCard({ lang, service }: { lang: Language; service: ServiceKey }) {
  const t = getT(lang);
  const tint = serviceTint[service];
  const title = serviceTitle(t, service);
  return (
    <article className="relative flex flex-col gap-3 rounded-[22px] p-5 transition-transform hover:-translate-y-0.5 lg:rounded-3xl lg:p-7" style={{ background: tint.bg }}>
      <span className="grid h-11 w-11 place-items-center rounded-[14px] bg-white shadow-[0_4px_14px_rgba(27,31,59,0.08)]" style={{ color: tint.ink }}>
        <ServiceIcon service={service} />
      </span>
      <h3 className="text-lg leading-[1.25] tracking-[-0.015em] text-[#1b1f3b] lg:text-[21px]">{title}</h3>
      <p className="line-clamp-3 grow text-[15px] leading-[1.55] text-[#464a66]">{t(`services.${service}.intro`)}</p>
      <div className="flex items-center justify-between gap-2 border-t pt-3.5" style={{ borderColor: tint.line }}>
        <span className="flex flex-col gap-0.5">
          <span className="whitespace-nowrap font-display text-lg font-bold text-[#1b1f3b] lg:text-xl">
            {priceFrom(minPrice(service), lang, t, service === 'consulting')}
          </span>
          <span className="text-xs font-semibold text-[#62667f] lg:text-[13px]">{t(`svc.time.${service}`)}</span>
        </span>
        <a
          href={`/${lang}/services/${service}`}
          aria-label={`${t('landing.services.more')}: ${title}`}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-[#1b1f3b] shadow-[0_4px_14px_rgba(27,31,59,0.08)] after:absolute after:inset-0 after:content-['']"
        >
          <ArrowRight />
        </a>
      </div>
    </article>
  );
}
