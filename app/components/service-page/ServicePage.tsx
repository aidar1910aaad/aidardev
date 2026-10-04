import type { Language } from '../../contexts/LanguageContext';
import { servicesConfig, type ServiceKey } from '../../data/services-config';
import { createBreadcrumbSchema, createFAQSchema, createServiceSchema } from '../../lib/schemas';
import HomeReviews from '../home/HomeReviews';
import { container, getT, Kicker, sectionY, SectionTitle } from '../home/shared';
import StructuredDataServer from '../SEO/StructuredDataServer';
import ServiceStickyWhatsApp from '../services/ServiceStickyWhatsApp';
import { ServiceLinkCard } from './ServiceCards';
import ServiceFaqSection, { serviceFaqItems } from './ServiceFaqSection';
import ServiceHero from './ServiceHero';
import ServicePackages from './ServicePackages';
import ServiceSteps from './ServiceSteps';
import ServiceTypes from './ServiceTypes';
import ServiceWork from './ServiceWork';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';

export interface ServicePageProps {
  lang: Language;
  serviceKey: ServiceKey;
  h1Key: string;
  introKey: string;
  processKey?: string;
  examplesKey?: string;
  faqKey: string;
}

/**
 * Страница услуги в новом дизайне. Тексты (H1, вступление, карточки, процесс, примеры, FAQ) — прежние из services.ts;
 * разметка Service, BreadcrumbList и FAQPage — на сервере, из тех же текстов, что на странице.
 */
export default function ServicePage({ lang, serviceKey, h1Key, introKey, processKey, examplesKey, faqKey }: ServicePageProps) {
  const t = getT(lang);
  const h1 = t(h1Key);
  const crumbs = [
    { name: t('svc.crumb.home'), href: `/${lang}` },
    { name: t('svc.crumb.services'), href: `/${lang}/services` },
    { name: h1 },
  ];
  const faqItems = serviceFaqItems(lang, faqKey);
  const related = servicesConfig[serviceKey].relatedServices;

  return (
    <>
      <StructuredDataServer
        id={`service-schema-${serviceKey}`}
        data={createServiceSchema({ name: h1, description: t(introKey), provider: 'aidardev', areaServed: 'Kazakhstan', serviceKey })}
      />
      <StructuredDataServer
        id={`service-breadcrumb-schema-${serviceKey}`}
        data={createBreadcrumbSchema([
          { name: crumbs[0].name, url: `${siteUrl}/${lang}` },
          { name: crumbs[1].name, url: `${siteUrl}/${lang}/services` },
          { name: h1, url: `${siteUrl}/${lang}/services/${serviceKey}` },
        ])}
      />
      {faqItems.length > 0 && <StructuredDataServer id={`service-faq-schema-${serviceKey}`} data={createFAQSchema(faqItems)} />}

      <ServiceHero lang={lang} service={serviceKey} h1Key={h1Key} introKey={introKey} crumbs={crumbs} />
      <ServiceTypes lang={lang} service={serviceKey} />
      <ServicePackages lang={lang} service={serviceKey} />
      <ServiceSteps lang={lang} processKey={processKey} />
      <ServiceWork lang={lang} service={serviceKey} examplesKey={examplesKey} />
      <HomeReviews lang={lang} />
      <ServiceFaqSection lang={lang} service={serviceKey} faqKey={faqKey} />

      {related.length > 0 && (
        <section className="bg-white">
          <div className={`${container} ${sectionY}`}>
            <div className="flex flex-col gap-3 lg:gap-4">
              <Kicker>{t('svc.related.text')}</Kicker>
              <SectionTitle className="text-[#1b1f3b]">{t('svc.related.title')}</SectionTitle>
            </div>
            <div className="mt-6 grid gap-3.5 md:grid-cols-3 lg:mt-12 lg:gap-5">
              {related.map((key) => (
                <ServiceLinkCard key={key} lang={lang} service={key} />
              ))}
            </div>
          </div>
        </section>
      )}

      <ServiceStickyWhatsApp serviceKey={serviceKey} />
    </>
  );
}
