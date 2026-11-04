import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fitTitle } from '../../../lib/seo/title';
import CityFacts from '../../../components/city-page/CityFacts';
import CityHero from '../../../components/city-page/CityHero';
import CityServices from '../../../components/city-page/CityServices';
import HomeProcess from '../../../components/home/HomeProcess';
import HomeReviews from '../../../components/home/HomeReviews';
import HomeWork from '../../../components/home/HomeWork';
import { getT } from '../../../components/home/shared';
import Contact from '../../../components/landing/ConversionContact';
import Header from '../../../components/landing/EditorialHeader';
import Footer from '../../../components/landing/Footer';
import StickyWhatsApp from '../../../components/landing/StickyWhatsApp';
import StructuredDataServer from '../../../components/SEO/StructuredDataServer';
import { FaqBlock } from '../../../components/service-page/ServiceFaqSection';
import ServicePackages from '../../../components/service-page/ServicePackages';
import { LanguageProvider } from '../../../contexts/LanguageContext';
import { cityEntries, getCityBySlug, getCityLandingContent, isCityIndexable, type SupportedLanguage } from '../../../data/cities';
import { cityServiceCombos, getCityServiceContent } from '../../../data/city-services';
import { ASTANA_CITY_SLUG, ASTANA_PAGES, ASTANA_PRICE_SLUG, astanaPagePath, getAstanaPage } from '../../../data/astana-pages';
import { createBreadcrumbSchema, createFAQSchema, createServiceSchema } from '../../../lib/schemas';
import { buildWhatsAppUrl } from '../../../lib/whatsapp';

// Только языки и города из generateStaticParams: неизвестный город или язык — 404 без рендера.
export const dynamicParams = false;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';
const allowedLanguages: SupportedLanguage[] = ['ru', 'en', 'kz'];

function normalizeLanguage(lang: string): SupportedLanguage {
  return allowedLanguages.includes(lang as SupportedLanguage) ? (lang as SupportedLanguage) : 'ru';
}

export function generateStaticParams() {
  return allowedLanguages.flatMap((lang) =>
    cityEntries.map((city) => ({
      lang,
      city: city.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; city: string }>;
}): Promise<Metadata> {
  const { lang: rawLang, city: citySlug } = await params;
  const lang = normalizeLanguage(rawLang);
  const city = getCityBySlug(citySlug);

  if (!city) {
    return {};
  }

  const content = getCityLandingContent(city, lang);

  const indexable = isCityIndexable(city.slug, lang);

  return {
    title: fitTitle(content.title),
    description: content.description,
    keywords: content.keywords,
    // Шаблонные копии городов не участвуют в поиске, но открываются по ссылке.
    robots: indexable ? undefined : { index: false, follow: true },
    alternates: {
      canonical: `${siteUrl}/${lang}/cities/${city.slug}`,
    },
    openGraph: {
      type: 'website',
      locale: lang === 'ru' ? 'ru_RU' : lang === 'en' ? 'en_US' : 'kk_KZ',
      url: `${siteUrl}/${lang}/cities/${city.slug}`,
      siteName: 'aidardev',
      title: content.title,
      description: content.description,
    },
  };
}

/**
 * Страница города в новом дизайне. Тексты (H1, подзаголовок, факты, отрасли, вопросы) — прежние из data/cities.ts;
 * добавлены пакеты сайтов с ценами, работы, этапы, отзывы 2ГИС и остальные услуги.
 */
export default async function CityLandingPage({
  params,
}: {
  params: Promise<{ lang: string; city: string }>;
}) {
  const { lang: rawLang, city: citySlug } = await params;
  const lang = normalizeLanguage(rawLang);
  const city = getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  const t = getT(lang);
  const content = getCityLandingContent(city, lang);
  const cityName = city.name[lang];
  const path = `/${lang}/cities/${city.slug}`;
  const whatsappMessage = t('city.whatsapp').replace('{locative}', city.locative[lang]).replace('{city}', cityName);
  const whatsappUrl = buildWhatsAppUrl(whatsappMessage, { sourcePath: path });
  const source = `city_${city.slug}`;
  const local = cityServiceCombos
    .filter((combo) => combo.citySlug === city.slug)
    .flatMap((combo) => {
      const page = getCityServiceContent(city, combo.service, lang);
      return page ? [{ href: `${path}/${combo.service}`, label: page.h1 }] : [];
    })
    .concat(
      lang === 'ru' && city.slug === ASTANA_CITY_SLUG
        ? [ASTANA_PRICE_SLUG, ...ASTANA_PAGES.map((p) => p.slug)].map((slug) => ({
            href: astanaPagePath(slug),
            label: getAstanaPage(slug)?.h1 ?? 'Сколько стоит сайт: калькулятор',
          }))
        : [],
    );

  const faqSchema = createFAQSchema(content.faq);
  const serviceSchema = createServiceSchema({
    name: content.h1,
    description: content.description,
    provider: 'aidardev',
    areaServed: cityName,
  });
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: content.breadcrumbs.home, url: `${siteUrl}/${lang}` },
    { name: content.breadcrumbs.cities, url: `${siteUrl}/${lang}/cities` },
    { name: cityName, url: `${siteUrl}${path}` },
  ]);

  return (
    <LanguageProvider initialLanguage={lang}>
      <StructuredDataServer data={serviceSchema} id={`city-service-${city.slug}`} />
      <StructuredDataServer data={faqSchema} id={`city-faq-${city.slug}`} />
      <StructuredDataServer data={breadcrumbSchema} id={`city-breadcrumbs-${city.slug}`} />

      <div className="page-with-action-bar min-h-screen bg-white text-[#1b1f3b]">
        <Header />
        <main id="main-content">
          <CityHero
            lang={lang}
            crumbs={[
              { name: content.breadcrumbs.home, href: `/${lang}` },
              { name: content.breadcrumbs.cities, href: `/${lang}/cities` },
              { name: cityName },
            ]}
            kicker={`${cityName} · aidardev`}
            h1={content.h1}
            lead={content.heroLead}
            body={content.heroBody}
            service="websites"
            whatsappUrl={whatsappUrl}
            source={source}
          />
          <CityFacts
            lang={lang}
            title={content.sectionTitle}
            items={content.highlights}
            labels={[0, 1, 2].map((index) => t(`city.facts.label.${index}`))}
            industry={content.industryPanel}
          />
          <ServicePackages lang={lang} service="websites" />
          <HomeProcess lang={lang} />
          <HomeWork lang={lang} />
          <HomeReviews lang={lang} />
          <FaqBlock lang={lang} items={content.faq} intro={content.sectionIntro} whatsappUrl={whatsappUrl} source={`${source}_faq`} />
          <CityServices
            lang={lang}
            title={t('city.services.title')}
            services={['bots', 'ai', 'mobile', 'design', 'consulting']}
            local={local}
          />
        </main>
        <Contact />
        <Footer />
        <StickyWhatsApp source="city" message={whatsappMessage} />
      </div>
    </LanguageProvider>
  );
}
