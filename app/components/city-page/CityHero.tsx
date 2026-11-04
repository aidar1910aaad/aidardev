import type { ReactNode } from 'react';
import type { Language } from '../../contexts/LanguageContext';
import type { ServiceKey } from '../../data/services-config';
import RatingRow from '../home/RatingRow';
import { container, Kicker } from '../home/shared';
import { type Crumb, HeroActions, HeroBreadcrumbs, ServiceOfferCard } from '../service-page/ServiceHero';

interface CityHeroProps {
  lang: Language;
  crumbs: Crumb[];
  kicker: string;
  h1: string;
  /** Подзаголовок под H1 (heroLead из data/cities.ts). */
  lead: string;
  body: string;
  /** Услуга в карточке справа: у страницы города — сайты, у «город + услуга» — эта услуга. */
  service: ServiceKey;
  whatsappUrl: string;
  /** Метка страницы для аналитики: city_astana, city_astana_mobile. */
  source: string;
  /** Своя карточка справа вместо карточки услуги (страницы «Астана × услуга» со своей ценой). */
  aside?: ReactNode;
}

/** Первый экран страницы города — как у страниц услуг, но с текстами города. */
export default function CityHero({ lang, crumbs, kicker, h1, lead, body, service, whatsappUrl, source, aside }: CityHeroProps) {
  return (
    <section className="hero-bg relative overflow-hidden">
      <div className={`${container} relative pb-14 pt-[calc(4rem+16px)] lg:pb-24 lg:pt-[calc(5rem+32px)]`}>
        <HeroBreadcrumbs crumbs={crumbs} />

        <div className="mt-6 grid gap-10 lg:mt-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
          <div className="flex flex-col gap-[18px] lg:gap-6">
            <Kicker>{kicker}</Kicker>
            <h1 className="text-[32px] leading-[1.08] tracking-[-0.035em] text-[#1b1f3b] sm:text-[42px] lg:text-[clamp(38px,3.6vw,54px)] lg:leading-[1.05]">
              {h1}
            </h1>
            <p className="max-w-[620px] font-display text-lg font-semibold leading-[1.45] tracking-[-0.01em] text-[#1b1f3b] lg:text-[21px]">{lead}</p>
            <p className="max-w-[620px] text-base leading-[1.6] text-[#464a66] lg:text-lg">{body}</p>
            <HeroActions lang={lang} whatsappUrl={whatsappUrl} source={`${source}_hero`} />
            <RatingRow lang={lang} source={`2gis_${source}`} />
          </div>

          {aside ?? <ServiceOfferCard lang={lang} service={service} />}
        </div>
      </div>
    </section>
  );
}
