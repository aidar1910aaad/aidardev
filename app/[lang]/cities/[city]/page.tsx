import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Header from '../../../components/landing/EditorialHeader';
import Footer from '../../../components/landing/Footer';
import StructuredDataServer from '../../../components/SEO/StructuredDataServer';
import CityLandingHero from '../../../components/landing/CityLandingHero';
import { LanguageProvider } from '../../../contexts/LanguageContext';
import { createBreadcrumbSchema, createFAQSchema, createServiceSchema } from '../../../lib/schemas';
import { cityEntries, getCityBySlug, getCityLandingContent, isCityIndexable, type SupportedLanguage } from '../../../data/cities';

const Projects = dynamic(() => import('../../../components/landing/Projects'), {
  ssr: true,
  loading: () => <div className="min-h-[400px]" />,
});

const Process = dynamic(() => import('../../../components/landing/Process'), {
  ssr: true,
  loading: () => <div className="min-h-[400px]" />,
});

const Contact = dynamic(() => import('../../../components/landing/ConversionContact'), {
  ssr: true,
  loading: () => <div className="min-h-[400px]" />,
});

const StickyWhatsApp = dynamic(() => import('../../../components/landing/StickyWhatsApp'), {
  ssr: true,
});

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
    title: content.title,
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

  const content = getCityLandingContent(city, lang);
  const faqSchema = createFAQSchema(content.faq);
  const serviceSchema = createServiceSchema({
    name: content.h1,
    description: content.description,
    provider: 'aidardev',
    areaServed: city.name[lang],
  });
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: content.breadcrumbs.home, url: `${siteUrl}/${lang}` },
    { name: content.breadcrumbs.cities, url: `${siteUrl}/${lang}/cities` },
    { name: city.name[lang], url: `${siteUrl}/${lang}/cities/${city.slug}` },
  ]);

  return (
    <LanguageProvider initialLanguage={lang}>
      <StructuredDataServer data={serviceSchema} id={`city-service-${city.slug}`} />
      <StructuredDataServer data={faqSchema} id={`city-faq-${city.slug}`} />
      <StructuredDataServer data={breadcrumbSchema} id={`city-breadcrumbs-${city.slug}`} />

      <div className="page-with-action-bar min-h-screen bg-[#fff7ef] text-slate-950">
        <Header />
        <main>
          <CityLandingHero city={city} content={content} language={lang} />

          <section className="border-b border-slate-300 py-16 sm:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-6xl">
                <div className="grid gap-8 border-b border-slate-300 pb-10 md:grid-cols-12">
                <h2 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl md:col-span-7">
                  {content.sectionTitle}
                </h2>
                <p className="text-lg leading-8 text-slate-600 md:col-span-5">
                  {content.sectionIntro}
                </p>
                </div>

                <h2 className="border-b border-slate-300 pb-6 pt-16 text-3xl font-semibold tracking-[-0.035em]">FAQ</h2>
                <div className="grid border-l border-slate-300 md:grid-cols-3">
                  {content.faq.map((item) => (
                    <article
                      key={item.question}
                      className="border-b border-r border-slate-300 bg-white p-6"
                    >
                      <h3 className="mb-3 text-lg font-semibold text-slate-950">{item.question}</h3>
                      <p className="leading-7 text-slate-600">{item.answer}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <Projects />
          <Process />
          <Contact />
        </main>
        <Footer />
        <StickyWhatsApp source="city" />
      </div>
    </LanguageProvider>
  );
}
