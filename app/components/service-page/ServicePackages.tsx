import pricingData from '../../data/pricing.json';
import type { Language } from '../../contexts/LanguageContext';
import type { ServiceKey } from '../../data/services-config';
import { ArrowRight, Check } from '../brand/icons';
import TrackedLink from '../home/TrackedLink';
import { container, getT, Kicker, sectionY, SectionTitle } from '../home/shared';
import { priceFrom } from './meta';

type Tier = { name: string; price: number; description: string; features: string[] };
const tiers = (pricingData as { services: Record<string, Record<string, Tier>> }).services;

export default function ServicePackages({ lang, service }: { lang: Language; service: ServiceKey }) {
  const t = getT(lang);
  const packages = Object.entries(tiers[service] || {}).map(([key, tier]) => {
    const base = `pricing.packages.${service}.${key}`;
    const name = t(`${base}.name`);
    const description = t(`${base}.description`);
    return {
      key,
      name: name === `${base}.name` ? tier.name : name,
      description: description === `${base}.description` ? tier.description : description,
      price: tier.price,
      features: tier.features.map((feature, index) => {
        const translated = t(`${base}.features.${index}`);
        return translated === `${base}.features.${index}` ? feature : translated;
      }),
    };
  });
  if (packages.length === 0) return null;

  // Как и раньше: «популярный» — средний пакет, если пакетов три и больше.
  const popularIndex = packages.length >= 3 ? Math.floor(packages.length / 2) : -1;
  const titleKey = `services.${service}.pricingTitle`;
  const title = t(titleKey) === titleKey ? t('services.pricing.title') : t(titleKey);
  const columns = packages.length === 4 ? 'lg:grid-cols-2 xl:grid-cols-4' : packages.length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3';

  return (
    <section id="packages" className="bg-[#fff7ef]">
      <div className={`${container} ${sectionY}`}>
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div className="flex flex-col gap-3 lg:gap-4">
            <Kicker>{t('svc.packages.kicker')}</Kicker>
            <SectionTitle className="max-w-[720px] text-[#1b1f3b]">{title}</SectionTitle>
          </div>
          <p className="max-w-[400px] text-base leading-[1.6] text-[#464a66] lg:text-[17px]">{t('landing.services.text')}</p>
        </div>

        <div className={`mt-6 grid gap-3.5 md:grid-cols-2 lg:mt-12 lg:gap-5 ${columns}`}>
          {packages.map((pkg, index) => {
            const popular = index === popularIndex;
            return (
              <article
                key={pkg.key}
                className={`relative flex flex-col rounded-[22px] p-6 lg:rounded-3xl lg:p-7 ${
                  popular ? 'bg-[#1b1f3b] text-white shadow-[0_18px_44px_rgba(27,31,59,0.25)]' : 'bg-white text-[#1b1f3b] shadow-[0_4px_14px_rgba(27,31,59,0.06)]'
                }`}
              >
                {popular && (
                  <span className="mb-3 self-start rounded-full bg-[#ffd166] px-3 py-1 text-xs font-bold text-[#1b1f3b]">{t('pricing.popular')}</span>
                )}
                <h3 className="text-xl tracking-[-0.015em] lg:text-[22px]">{pkg.name}</h3>
                <p className={`mt-2 text-sm leading-[1.55] ${popular ? 'text-[#c3c6dd]' : 'text-[#464a66]'}`}>{pkg.description}</p>
                <p className="mt-5 whitespace-nowrap font-display text-[28px] font-bold tracking-[-0.03em] lg:text-[32px]">
                  {priceFrom(pkg.price, lang, t, service === 'consulting' && pkg.key === 'hourly')}
                </p>
                <ul className={`mt-5 flex flex-col gap-2.5 border-t pt-5 ${popular ? 'border-[#2e3358]' : 'border-[#efe3d5]'}`}>
                  {pkg.features.map((feature) => (
                    <li key={feature} className={`flex items-start gap-2.5 text-[15px] ${popular ? 'text-white' : 'text-[#1b1f3b]'}`}>
                      <Check className={`mt-1 h-3.5 w-3.5 shrink-0 ${popular ? 'text-[#ffd166]' : 'text-[#b4232c]'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
                  <a
                    href="#contact"
                    className={`flex h-12 items-center justify-center gap-2 rounded-[14px] text-[15px] font-bold transition-colors ${
                      popular ? 'bg-[#ffd166] text-[#1b1f3b] hover:bg-[#ffc845]' : 'border-2 border-[#1b1f3b] text-[#1b1f3b] hover:bg-[#1b1f3b] hover:text-white'
                    }`}
                  >
                    {t('pricing.contactButton')} <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <TrackedLink
          href={`/${lang}/pricing`}
          event={{ type: 'calculate', source: `service_${service}_packages` }}
          className="mt-6 inline-flex items-center gap-2 text-[15px] font-bold text-[#b4232c] hover:text-[#8f1b23]"
        >
          {t('svc.packages.compare')} <ArrowRight className="h-4 w-4" />
        </TrackedLink>
      </div>
    </section>
  );
}
