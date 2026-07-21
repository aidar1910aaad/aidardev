import dynamic from 'next/dynamic';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Header from '../../../../components/landing/EditorialHeader';
import Footer from '../../../../components/landing/Footer';
import StructuredDataServer from '../../../../components/SEO/StructuredDataServer';
import { LanguageProvider } from '../../../../contexts/LanguageContext';
import { createBreadcrumbSchema, createFAQSchema, createServiceSchema } from '../../../../lib/schemas';
import {
  cityServiceCombos,
  getCityServiceContent,
  resolveCityService,
} from '../../../../data/city-services';
import type { SupportedLanguage } from '../../../../data/cities';
import { buildWhatsAppUrl } from '../../../../lib/whatsapp';
import TrackedWhatsAppLink from '../../../../components/common/TrackedWhatsAppLink';

const Projects = dynamic(() => import('../../../../components/landing/Projects'), {
  ssr: true,
  loading: () => <div className="min-h-[400px]" />,
});

const Contact = dynamic(() => import('../../../../components/landing/ConversionContact'), {
  ssr: true,
  loading: () => <div className="min-h-[400px]" />,
});

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
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    alternates: {
      canonical: `${siteUrl}/${lang}/cities/${citySlug}/${service}`,
      languages: {
        ru: `${siteUrl}/ru/cities/${citySlug}/${service}`,
        en: `${siteUrl}/en/cities/${citySlug}/${service}`,
        kk: `${siteUrl}/kz/cities/${citySlug}/${service}`,
        'x-default': `${siteUrl}/ru/cities/${citySlug}/${service}`,
      },
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

  const cityName = resolved.city.name[lang];
  const whatsappMessage =
    lang === 'ru'
      ? `Здравствуйте! Интересует ${content.h1.toLowerCase()}. Хочу обсудить задачу.`
      : lang === 'kz'
        ? `Сәлеметсіз бе! ${content.h1} қызметін талқылағым келеді.`
        : `Hi! I'm interested in ${content.h1}. Let's discuss the project.`;

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
    { name: cityName, url: `${siteUrl}/${lang}/cities/${citySlug}` },
    { name: content.breadcrumbs.service, url: `${siteUrl}/${lang}/cities/${citySlug}/${service}` },
  ]);

  return (
    <LanguageProvider initialLanguage={lang}>
      <StructuredDataServer data={serviceSchema} id={`city-service-${citySlug}-${service}`} />
      <StructuredDataServer data={faqSchema} id={`city-service-faq-${citySlug}-${service}`} />
      <StructuredDataServer data={breadcrumbSchema} id={`city-service-bc-${citySlug}-${service}`} />

      <div className="min-h-screen bg-[#f7f7f5] text-slate-950">
        <Header />
        <main>
          <section className="border-b border-slate-300 bg-[#f7f7f5] pt-28">
            <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
              <div className="mx-auto max-w-6xl">
                <nav className="mb-10 flex flex-wrap items-center gap-2 border-b border-slate-300 pb-5 text-xs uppercase tracking-[0.14em] text-slate-500">
                  <Link href={`/${lang}`} className="hover:text-blue-700">{content.breadcrumbs.home}</Link>
                  <span>/</span>
                  <Link href={`/${lang}/cities`} className="hover:text-blue-700">{content.breadcrumbs.cities}</Link>
                  <span>/</span>
                  <Link href={`/${lang}/cities/${citySlug}`} className="hover:text-blue-700">{cityName}</Link>
                  <span>/</span>
                  <span className="text-slate-900">{content.breadcrumbs.service}</span>
                </nav>

                <div className="grid gap-10 md:grid-cols-12">
                  <div className="md:col-span-8">
                    <span className="mb-7 inline-flex border border-blue-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
                      {cityName} · {content.breadcrumbs.service}
                    </span>
                    <h1 className="mb-7 text-4xl font-semibold leading-[1.03] tracking-[-0.05em] sm:text-6xl">{content.h1}</h1>
                    <p className="mb-6 text-xl font-medium leading-8 text-blue-700">{content.heroLead}</p>
                    <p className="max-w-3xl text-lg leading-8 text-slate-600">{content.heroBody}</p>
                  </div>
                  <div className="flex flex-col justify-end gap-3 md:col-span-4">
                    <TrackedWhatsAppLink
                      href={buildWhatsAppUrl(whatsappMessage)}
                      source={`city_${citySlug}_${service}`}
                      className="w-full bg-blue-700 px-7 py-4 text-center font-semibold text-white hover:bg-blue-800"
                    >
                      {content.primaryCta}
                    </TrackedWhatsAppLink>
                    <Link
                      href={content.servicePath}
                      className="w-full border border-slate-400 bg-white px-7 py-4 text-center font-semibold hover:border-blue-700 hover:text-blue-700"
                    >
                      {lang === 'ru' ? 'Все услуги по направлению' : content.secondaryCta}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="border-b border-slate-300 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-6xl">
                <h2 className="mb-4 text-3xl font-semibold tracking-[-0.04em]">{content.sectionTitle}</h2>
                <p className="mb-10 max-w-3xl text-lg leading-8 text-slate-600">{content.sectionIntro}</p>
                <div className="grid border-l border-slate-300 md:grid-cols-3">
                  {content.highlights.map((item, index) => (
                    <div key={item} className="border-b border-r border-slate-300 bg-white p-6">
                      <span className="mb-5 block font-mono text-xs text-blue-700">0{index + 1}</span>
                      <p className="leading-7 text-slate-700">{item}</p>
                    </div>
                  ))}
                </div>
                <h2 className="mb-6 mt-16 border-b border-slate-300 pb-4 text-2xl font-semibold">FAQ</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {content.faq.map((item) => (
                    <article key={item.question} className="border border-slate-300 bg-white p-6">
                      <h3 className="mb-2 font-semibold">{item.question}</h3>
                      <p className="leading-7 text-slate-600">{item.answer}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
