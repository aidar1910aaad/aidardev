import type { Language } from '../../contexts/LanguageContext';
import { container, getT, Kicker, sectionY, SectionTitle } from '../home/shared';

interface CityFactsProps {
  lang: Language;
  title: string;
  intro?: string;
  /** Три факта о работе (highlights из data/cities.ts или data/city-services.ts). */
  items: string[];
  /** Смысловые подписи фактов; без них — номера 01, 02, 03. */
  labels?: string[];
  /** Отрасли региона — только у городов с профилем в data/city-industries.ts. */
  industry?: { eyebrow: string; services: Array<{ name: string; description: string }> };
}

export default function CityFacts({ lang, title, intro, items, labels, industry }: CityFactsProps) {
  const t = getT(lang);
  return (
    <section className="bg-white">
      <div className={`${container} ${sectionY}`}>
        <div className="flex max-w-[780px] flex-col gap-3 lg:gap-4">
          <Kicker>{t('city.facts.kicker')}</Kicker>
          <SectionTitle className="text-[#1b1f3b]">{title}</SectionTitle>
          {intro && <p className="text-base leading-[1.6] text-[#464a66] lg:text-[17px]">{intro}</p>}
        </div>

        <div className="mt-6 grid gap-3.5 md:grid-cols-3 lg:mt-12 lg:gap-5">
          {items.map((item, index) => (
            <article key={item} className="flex flex-col gap-3 rounded-[22px] bg-[#fff7ef] p-5 lg:rounded-3xl lg:p-7">
              <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#b4232c]">
                {labels?.[index] ?? String(index + 1).padStart(2, '0')}
              </span>
              <p className="text-[15px] leading-[1.6] text-[#1b1f3b] lg:text-base">{item}</p>
            </article>
          ))}
        </div>

        {industry && (
          <div className="mt-4 rounded-[22px] bg-[#1b1f3b] p-6 text-white lg:mt-5 lg:rounded-3xl lg:p-10">
            <Kicker tone="sun">{industry.eyebrow}</Kicker>
            <div className="mt-5 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:mt-7 lg:grid-cols-3">
              {industry.services.map((service) => (
                <div key={service.name}>
                  <h3 className="text-lg leading-[1.3] text-white lg:text-xl">{service.name}</h3>
                  <p className="mt-1.5 text-sm leading-[1.6] text-[#c3c6dd] lg:text-[15px]">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
