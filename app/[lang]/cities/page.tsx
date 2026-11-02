import type { Metadata } from 'next';
import { ArrowRight } from '../../components/brand/icons';
import CityServices from '../../components/city-page/CityServices';
import HomeProcess from '../../components/home/HomeProcess';
import RatingRow from '../../components/home/RatingRow';
import { container, getT, Kicker, sectionY, SectionTitle } from '../../components/home/shared';
import Contact from '../../components/landing/ConversionContact';
import Header from '../../components/landing/EditorialHeader';
import Footer from '../../components/landing/Footer';
import StickyWhatsApp from '../../components/landing/StickyWhatsApp';
import StructuredDataServer from '../../components/SEO/StructuredDataServer';
import { HeroBreadcrumbs } from '../../components/service-page/ServiceHero';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { cityEntries, getCityLandingContent, type SupportedLanguage } from '../../data/cities';
import { createBreadcrumbSchema } from '../../lib/schemas';

// Только языки из generateStaticParams в [lang]/layout: чужой первый сегмент (/wp-login.php, /.env) — 404 без рендера.
export const dynamicParams = false;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';

function normalizeLanguage(lang: string): SupportedLanguage {
  return lang === 'en' || lang === 'kz' || lang === 'ru' ? lang : 'ru';
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = normalizeLanguage(rawLang);

  const metadataByLanguage = {
    ru: {
      title: 'Разработка сайтов по городам Казахстана',
      description: 'Разработка сайтов для бизнеса в Алматы, Астане, Шымкенте и других городах Казахстана: что делаем, сколько стоит и сколько времени занимает.',
    },
    en: {
      title: 'Website Development by City in Kazakhstan',
      description: 'Website development for businesses in Almaty, Astana, Shymkent and other cities of Kazakhstan.',
    },
    kz: {
      title: 'Қазақстан қалалары бойынша сайт әзірлеу',
      description: 'Алматы, Астана, Шымкент және Қазақстанның басқа қалаларындағы бизнеске сайт әзірлейміз.',
    },
  };

  const meta = metadataByLanguage[lang];

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${siteUrl}/${lang}/cities`,
      languages: {
        ru: `${siteUrl}/ru/cities`,
        en: `${siteUrl}/en/cities`,
        kk: `${siteUrl}/kz/cities`,
      },
    },
  };
}

export default async function CitiesIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = normalizeLanguage(rawLang);
  const t = getT(lang);

  const labels = {
    ru: {
      title: 'Разработка сайтов в городах Казахстана',
      description: 'Выберите свой город — расскажем, как работаем с местным бизнесом, сколько стоит сайт и сколько времени занимает разработка.',
      kicker: 'Казахстан / Города',
    },
    en: {
      title: 'Website development across Kazakhstan',
      description: 'Choose your city to see how we work with local businesses and what we can build for you.',
      kicker: 'Kazakhstan / Cities',
    },
    kz: {
      title: 'Қазақстан қалаларында сайт әзірлеу',
      description: 'Қалаңызды таңдаңыз — жергілікті бизнеспен қалай жұмыс істейтінімізді және не жасай алатынымызды айтамыз.',
      kicker: 'Қазақстан / Қалалар',
    },
  }[lang];

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: t('svc.crumb.home'), url: `${siteUrl}/${lang}` },
    { name: t('city.crumb.cities'), url: `${siteUrl}/${lang}/cities` },
  ]);

  return (
    <LanguageProvider initialLanguage={lang}>
      <StructuredDataServer data={breadcrumbSchema} id="cities-breadcrumbs" />

      <div className="page-with-action-bar min-h-screen bg-white text-[#1b1f3b]">
        <Header />
        <main id="main-content">
          <section className="hero-bg relative overflow-hidden">
            <div className={`${container} relative pb-14 pt-[calc(4rem+16px)] lg:pb-20 lg:pt-[calc(5rem+32px)]`}>
              <HeroBreadcrumbs crumbs={[{ name: t('svc.crumb.home'), href: `/${lang}` }, { name: t('city.crumb.cities') }]} />
              <div className="mt-6 flex max-w-[820px] flex-col gap-[18px] lg:mt-8 lg:gap-6">
                <Kicker>{labels.kicker}</Kicker>
                <h1 className="text-[32px] leading-[1.08] tracking-[-0.035em] text-[#1b1f3b] sm:text-[42px] lg:text-[clamp(38px,3.6vw,54px)] lg:leading-[1.05]">
                  {labels.title}
                </h1>
                <p className="max-w-[640px] text-base leading-[1.6] text-[#464a66] lg:text-lg">{labels.description}</p>
                <RatingRow lang={lang} source="2gis_cities" />
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className={`${container} ${sectionY}`}>
              <SectionTitle className="text-[#1b1f3b]">{t('city.index.grid')}</SectionTitle>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-4">
                {cityEntries.map((city) => (
                  <li key={city.slug}>
                    <a
                      href={`/${lang}/cities/${city.slug}`}
                      className="group flex h-full items-center justify-between gap-3 rounded-[18px] bg-[#fff7ef] px-5 py-4 transition-colors hover:bg-[#ffefe3]"
                    >
                      <span className="flex flex-col gap-0.5">
                        <span className="font-display text-lg font-bold tracking-[-0.015em] text-[#1b1f3b]">{city.name[lang]}</span>
                        <span className="text-[13px] font-medium text-[#62667f]">{getCityLandingContent(city, lang).h1}</span>
                      </span>
                      <ArrowRight className="h-5 w-5 shrink-0 text-[#b4232c] transition-transform group-hover:translate-x-0.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <CityServices
            lang={lang}
            title={t('city.index.services.title')}
            services={['websites', 'bots', 'ai', 'mobile', 'design', 'consulting']}
          />
          <HomeProcess lang={lang} />
        </main>
        <Contact />
        <Footer />
        <StickyWhatsApp source="cities" />
      </div>
    </LanguageProvider>
  );
}
