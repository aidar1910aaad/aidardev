import type { Language } from '../../contexts/LanguageContext';
import type { ServiceKey } from '../../data/services-config';
import { buildWhatsAppUrl } from '../../lib/whatsapp';
import { ArrowRight, Check, WhatsAppGlyph } from '../brand/icons';
import RatingRow from '../home/RatingRow';
import TrackedLink from '../home/TrackedLink';
import { container, getT, Kicker } from '../home/shared';
import { minPrice, priceFrom, ServiceIcon, serviceTint } from './meta';

export function serviceWhatsAppMessage(service: ServiceKey, t: (key: string) => string) {
  const key = `services.whatsapp.${service}`;
  const message = t(key);
  return message === key ? t('services.cta.whatsappFallback') : message;
}

interface ServiceHeroProps {
  lang: Language;
  service: ServiceKey;
  h1Key: string;
  introKey: string;
  crumbs: Array<{ name: string; href?: string }>;
}

export default function ServiceHero({ lang, service, h1Key, introKey, crumbs }: ServiceHeroProps) {
  const t = getT(lang);
  const tint = serviceTint[service];
  const whatsappUrl = buildWhatsAppUrl(serviceWhatsAppMessage(service, t), { sourcePath: `/${lang}/services/${service}` });
  const included = [1, 2, 3, 4].map((n) => t(`landing.included.${n}`));

  return (
    <section className="hero-bg relative overflow-hidden">
      <div className={`${container} relative pb-14 pt-[calc(4rem+16px)] lg:pb-24 lg:pt-[calc(5rem+32px)]`}>
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-medium text-[#62667f]">
            {crumbs.map((crumb, index) => (
              <li key={crumb.name} className="flex items-center gap-2">
                {index > 0 && <span aria-hidden>/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-[#b4232c]">{crumb.name}</a>
                ) : (
                  <span aria-current="page" className="text-[#1b1f3b]">{crumb.name}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-6 grid gap-10 lg:mt-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
          <div className="flex flex-col gap-[18px] lg:gap-6">
            <Kicker>{t('svc.kicker')}</Kicker>
            <h1 className="text-[32px] leading-[1.08] tracking-[-0.035em] text-[#1b1f3b] sm:text-[42px] lg:text-[clamp(38px,3.6vw,54px)] lg:leading-[1.05]">
              {t(h1Key)}
            </h1>
            <p className="max-w-[620px] text-base leading-[1.6] text-[#464a66] lg:text-lg">{t(introKey)}</p>
            <div className="mt-1 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <TrackedLink
                href={whatsappUrl}
                external
                event={{ type: 'whatsapp', source: `service_${service}_hero` }}
                className="flex h-14 items-center justify-center gap-2.5 rounded-[14px] bg-[#25d366] px-6 text-[17px] font-bold text-[#0b3d1f] shadow-[0_12px_26px_rgba(37,211,102,0.3)] transition-colors hover:bg-[#1fb356] lg:h-[60px]"
              >
                <WhatsAppGlyph className="h-[22px] w-[22px]" />
                {t('home.bar.cta')}
              </TrackedLink>
              <TrackedLink
                href="#contact"
                event={{ type: 'calculate', source: `service_${service}_hero` }}
                className="flex h-14 items-center justify-center gap-2.5 rounded-[14px] bg-[#b4232c] px-6 text-[17px] font-bold text-white transition-colors hover:bg-[#8f1b23] lg:h-[60px]"
              >
                {t('landing.hero.estimate')}
                <ArrowRight className="h-5 w-5" />
              </TrackedLink>
            </div>
            <RatingRow lang={lang} source={`2gis_service_${service}`} />
          </div>

          <div className="relative">
            <div className="absolute -right-6 -top-7 hidden h-28 w-28 rounded-full bg-[#ffd166] md:block" aria-hidden="true" />
            <div
              className="absolute -bottom-6 -left-6 hidden h-[120px] w-[150px] md:block"
              style={{ backgroundImage: 'radial-gradient(#ebc3a4 1.6px, transparent 1.6px)', backgroundSize: '20px 20px' }}
              aria-hidden="true"
            />
            <div className="relative rounded-3xl bg-white p-6 shadow-[0_36px_80px_rgba(27,31,59,0.16)] sm:p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px]" style={{ background: tint.bg, color: tint.ink }}>
                  <ServiceIcon service={service} />
                </span>
                <span className="font-display text-lg font-bold tracking-[-0.015em] text-[#1b1f3b]">{t(`footer.${service}`)}</span>
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-4 border-b border-[#efe3d5] pb-5">
                <div>
                  <dt className="text-[13px] font-semibold text-[#62667f]">{t('svc.offer.price')}</dt>
                  <dd className="mt-1 font-display text-[22px] font-bold leading-tight tracking-[-0.03em] text-[#1b1f3b] sm:text-[26px]">
                    {priceFrom(minPrice(service), lang, t, service === 'consulting')}
                  </dd>
                </div>
                <div>
                  <dt className="text-[13px] font-semibold text-[#62667f]">{t('svc.offer.time')}</dt>
                  <dd className="mt-1 font-display text-[18px] font-bold leading-tight tracking-[-0.02em] text-[#1b1f3b] sm:text-[20px]">
                    {t(`svc.time.${service}`)}
                  </dd>
                </div>
              </dl>
              <ul className="mt-5 flex flex-col gap-3">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] font-medium text-[#1b1f3b]">
                    <span className="mt-px grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-[#b4232c] text-white">
                      <Check className="h-[13px] w-[13px]" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 flex items-center gap-2 rounded-2xl bg-[#e8faef] px-4 py-3 text-sm font-semibold text-[#0b3d1f]">
                <Check className="h-4 w-4 shrink-0" />
                {t('home.contact.reassure.free')}
              </p>
              <a href="#packages" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#b4232c] hover:text-[#8f1b23]">
                {t('svc.offer.allPrices')} <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
