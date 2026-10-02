import type { Metadata } from 'next';
import Header from '../../components/landing/EditorialHeader';
import Footer from '../../components/landing/Footer';
import StickyWhatsApp from '../../components/landing/StickyWhatsApp';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { cityEntries, type SupportedLanguage } from '../../data/cities';

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

  return (
    <LanguageProvider initialLanguage={lang}>
      <div className="page-with-action-bar min-h-screen bg-[#fff7ef] text-slate-950">
        <Header />
        <main id="main-content" className="pb-20 pt-32">
          <section className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <div className="mb-12 grid gap-8 border-y border-slate-300 py-10 md:grid-cols-12 md:py-14">
                <div className="md:col-span-7">
                  <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">{labels.kicker}</p>
                  <h1 className="text-4xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-6xl">
                    {labels.title}
                  </h1>
                </div>
                <p className="self-end text-lg leading-8 text-slate-600 md:col-span-5">
                  {labels.description}
                </p>
              </div>

              <div className="grid border-l border-t border-slate-300 sm:grid-cols-2 lg:grid-cols-3">
                {cityEntries.map((city, index) => (
                  <a
                    key={city.slug}
                    href={`/${lang}/cities/${city.slug}`}
                    className="group flex min-h-36 flex-col justify-between border-b border-r border-slate-300 bg-white p-6 transition-colors hover:bg-blue-50/50"
                  >
                    <span className="font-mono text-xs text-slate-400">{String(index + 1).padStart(2, '0')}</span>
                    <span className="flex items-center justify-between text-xl font-semibold tracking-[-0.02em] group-hover:text-blue-700">
                      {lang === 'en' ? city.name.en : lang === 'kz' ? city.name.kz : city.locative.ru}
                      <span aria-hidden="true">↗</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
        <StickyWhatsApp source="cities" />
      </div>
    </LanguageProvider>
  );
}
