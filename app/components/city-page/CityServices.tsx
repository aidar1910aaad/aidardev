import type { Language } from '../../contexts/LanguageContext';
import type { ServiceKey } from '../../data/services-config';
import { ArrowRight } from '../brand/icons';
import { container, getT, Kicker, sectionY, SectionTitle } from '../home/shared';
import { ServiceLinkCard } from '../service-page/ServiceCards';

interface CityServicesProps {
  lang: Language;
  title: string;
  services: ServiceKey[];
  /** Отдельные страницы этого города («Разработка мобильных приложений в Астане»). */
  local?: Array<{ href: string; label: string }>;
}

/** Карточки услуг с ценой «от» и сроком — ссылки на страницы услуг. */
export default function CityServices({ lang, title, services, local = [] }: CityServicesProps) {
  const t = getT(lang);
  return (
    <section className="bg-white">
      <div className={`${container} ${sectionY}`}>
        <div className="flex flex-col gap-3 lg:gap-4">
          <Kicker>{t('city.services.kicker')}</Kicker>
          <SectionTitle className="text-[#1b1f3b]">{title}</SectionTitle>
        </div>
        <div className="mt-6 grid gap-3.5 md:grid-cols-3 lg:mt-12 lg:gap-5">
          {services.map((key) => (
            <ServiceLinkCard key={key} lang={lang} service={key} />
          ))}
        </div>
        {local.length > 0 && (
          <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px] font-semibold text-[#464a66] lg:mt-8">
            <span>{t('city.services.local')}</span>
            {local.map((link) => (
              <a key={link.href} href={link.href} className="inline-flex items-center gap-1.5 font-bold text-[#b4232c] hover:text-[#8f1b23]">
                {link.label}
                <ArrowRight className="h-4 w-4" />
              </a>
            ))}
          </p>
        )}
      </div>
    </section>
  );
}
