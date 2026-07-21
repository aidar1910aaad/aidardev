import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Header from '../../../components/landing/EditorialHeader';
import Footer from '../../../components/landing/Footer';
import StructuredDataServer from '../../../components/SEO/StructuredDataServer';
import CityLandingHero from '../../../components/landing/CityLandingHero';
import { LanguageProvider } from '../../../contexts/LanguageContext';
import { createBreadcrumbSchema, createFAQSchema, createServiceSchema } from '../../../lib/schemas';
import { cityEntries, getCityBySlug, getCityLandingContent, type SupportedLanguage } from '../../../data/cities';

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

  return {
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    alternates: {
      canonical: `${siteUrl}/${lang}/cities/${city.slug}`,
      languages: {
        ru: `${siteUrl}/ru/cities/${city.slug}`,
        en: `${siteUrl}/en/cities/${city.slug}`,
        kk: `${siteUrl}/kz/cities/${city.slug}`,
      },
    },
    openGraph: {
      type: 'website',
      locale: lang === 'ru' ? 'ru_RU' : lang === 'en' ? 'en_US' : 'kk_KZ',
      alternateLocale: ['ru_RU', 'en_US', 'kk_KZ'],
      url: `${siteUrl}/${lang}/cities/${city.slug}`,
      siteName: 'Aidar - Full-Stack Developer',
      title: content.title,
      description: content.description,
      images: [
        {
          url: '/og-image.svg',
          width: 1200,
          height: 630,
          alt: content.h1,
        },
      ],
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
    provider: 'Aidar',
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

      <div className="min-h-screen bg-[#f7f7f5] text-slate-950">
        <Header />
        <main>
          <CityLandingHero city={city} content={content} language={lang} />

          <section className="border-b border-slate-300 py-16 sm:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-6xl">
                <div className="grid gap-8 border-b border-slate-300 pb-10 md:grid-cols-12">
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl md:col-span-7">
                  {content.sectionTitle}
                </h2>
                <p className="text-lg leading-8 text-slate-600 md:col-span-5">
                  {content.sectionIntro}
                </p>
                </div>

                <div className="grid border-l border-slate-300 md:grid-cols-3">
                  {content.highlights.map((highlight, index) => (
                    <div
                      key={highlight}
                      className="border-b border-r border-slate-300 bg-white p-6"
                    >
                      <span className="mb-5 block font-mono text-xs text-blue-700">0{index + 1}</span>
                      <p className="leading-7 text-slate-700">{highlight}</p>
                    </div>
                  ))}
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
      </div>
    </LanguageProvider>
  );
}
