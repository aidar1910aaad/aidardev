import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fitTitle } from '../../../../lib/seo/title';
import CityFacts from '../../../../components/city-page/CityFacts';
import CityHero from '../../../../components/city-page/CityHero';
import CityServices from '../../../../components/city-page/CityServices';
import HomeReviews from '../../../../components/home/HomeReviews';
import { getT } from '../../../../components/home/shared';
import Contact from '../../../../components/landing/ConversionContact';
import Header from '../../../../components/landing/EditorialHeader';
import Footer from '../../../../components/landing/Footer';
import StickyWhatsApp from '../../../../components/landing/StickyWhatsApp';
import StructuredDataServer from '../../../../components/SEO/StructuredDataServer';
import { FaqBlock } from '../../../../components/service-page/ServiceFaqSection';
import ServicePackages from '../../../../components/service-page/ServicePackages';
import ServiceWork from '../../../../components/service-page/ServiceWork';
import { LanguageProvider } from '../../../../contexts/LanguageContext';
import { getCityLandingContent, type SupportedLanguage } from '../../../../data/cities';
import { cityServiceCombos, getCityServiceContent, resolveCityService } from '../../../../data/city-services';
import { servicesConfig } from '../../../../data/services-config';
import { createBreadcrumbSchema, createFAQSchema, createServiceSchema } from '../../../../lib/schemas';
import { buildWhatsAppUrl } from '../../../../lib/whatsapp';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';
const allowedLanguages = ['ru', 'en', 'kz'] as const;

function normalizeLanguage(lang: string): SupportedLanguage {
  return allowedLanguages.includes(lang as SupportedLanguage) ? (lang as SupportedLanguage) : 'ru';
}

export function generateStaticParams() {
  return allowedLanguages.flatMap((lang) =>
    cityServiceCombos.map((combo) => ({
      lang,
      city: combo.citySlug,
      service: combo.service,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; city: string; service: string }>;
}): Promise<Metadata> {
  const { lang: rawLang, city: citySlug, service } = await params;
  const lang = normalizeLanguage(rawLang);
  const resolved = resolveCityService(citySlug, service);
  if (!resolved) return {};

  const content = getCityServiceContent(resolved.city, resolved.combo.service, lang);
  if (!content) return {};

  return {
    title: fitTitle(content.title),
    description: content.description,
    keywords: content.keywords,
    // Уникальный текст есть только у RU-версии; EN/KZ — заглушки, в поиск их не пускаем.
    robots: lang === 'ru' ? undefined : { index: false, follow: true },
    alternates: {
      canonical: `${siteUrl}/${lang}/cities/${citySlug}/${service}`,
    },
    openGraph: {
      type: 'website',
      locale: lang === 'ru' ? 'ru_RU' : lang === 'en' ? 'en_US' : 'kk_KZ',
      url: `${siteUrl}/${lang}/cities/${citySlug}/${service}`,
      siteName: 'aidardev',
      title: content.title,
      description: content.description,
    },
  };
}

/** «Город + услуга» в новом дизайне: тексты — прежние из data/city-services.ts, плюс пакеты, работы и отзывы. */
export default async function CityServicePage({
  params,
}: {
  params: Promise<{ lang: string; city: string; service: string }>;
}) {
  const { lang: rawLang, city: citySlug, service } = await params;
  const lang = normalizeLanguage(rawLang);
  const resolved = resolveCityService(citySlug, service);
  if (!resolved) notFound();

  const content = getCityServiceContent(resolved.city, resolved.combo.service, lang);
  if (!content) notFound();

  const t = getT(lang);
  const serviceKey = resolved.combo.service;
  const cityName = resolved.city.name[lang];
  const cityPath = `/${lang}/cities/${citySlug}`;
  const whatsappMessage =
    lang === 'ru'
      ? `Здравствуйте! Интересует ${content.h1.toLowerCase()}. Хочу обсудить задачу.`
      : lang === 'kz'
        ? `Сәлеметсіз бе! ${content.h1} қызметін талқылағым келеді.`
        : `Hi! I'm interested in ${content.h1}. Let's discuss the project.`;
  const whatsappUrl = buildWhatsAppUrl(whatsappMessage, { sourcePath: `${cityPath}/${service}` });
  const source = `city_${citySlug}_${service}`;

  const faqSchema = createFAQSchema(content.faq);
  const serviceSchema = createServiceSchema({
    name: content.h1,
    description: content.description,
    provider: 'aidardev',
    areaServed: cityName,
    serviceKey,
  });
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: content.breadcrumbs.home, url: `${siteUrl}/${lang}` },
    { name: content.breadcrumbs.cities, url: `${siteUrl}/${lang}/cities` },
    { name: cityName, url: `${siteUrl}${cityPath}` },
    { name: content.breadcrumbs.service, url: `${siteUrl}${cityPath}/${service}` },
  ]);

  return (
    <LanguageProvider initialLanguage={lang}>
      <StructuredDataServer data={serviceSchema} id={`city-service-${citySlug}-${service}`} />
      <StructuredDataServer data={faqSchema} id={`city-service-faq-${citySlug}-${service}`} />
      <StructuredDataServer data={breadcrumbSchema} id={`city-service-bc-${citySlug}-${service}`} />

      <div className="page-with-action-bar min-h-screen bg-white text-[#1b1f3b]">
        <Header />
        <main id="main-content">
          <CityHero
            lang={lang}
            crumbs={[
              { name: content.breadcrumbs.home, href: `/${lang}` },
              { name: content.breadcrumbs.cities, href: `/${lang}/cities` },
              { name: cityName, href: cityPath },
              { name: content.breadcrumbs.service },
            ]}
            kicker={`${cityName} · ${content.breadcrumbs.service}`}
            h1={content.h1}
            lead={content.heroLead}
            body={content.heroBody}
            service={serviceKey}
            whatsappUrl={whatsappUrl}
            source={source}
          />
          <CityFacts lang={lang} title={content.sectionTitle} intro={content.sectionIntro} items={content.highlights} />
          <ServicePackages lang={lang} service={serviceKey} />
          <ServiceWork lang={lang} service={serviceKey} examplesKey={`services.${serviceKey}.examples`} />
          <HomeReviews lang={lang} />
          <FaqBlock lang={lang} items={content.faq} whatsappUrl={whatsappUrl} source={`${source}_faq`} />
          <CityServices
            lang={lang}
            title={t('svc.related.title')}
            services={[serviceKey, ...servicesConfig[serviceKey].relatedServices]}
            local={[{ href: cityPath, label: getCityLandingContent(resolved.city, lang).h1 }]}
          />
        </main>
        <Contact />
        <Footer />
        <StickyWhatsApp source="city_service" message={whatsappMessage} />
      </div>
    </LanguageProvider>
  );
}
