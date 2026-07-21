import type { Metadata } from 'next';
import Header from '../../components/landing/EditorialHeader';
import Footer from '../../components/landing/Footer';
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
      description: 'Городские SEO-страницы по разработке сайтов: Алматы, Астана, Шымкент и другие города Казахстана.',
    },
    en: {
      title: 'Website Development by City in Kazakhstan',
      description: 'City-focused website development pages for Almaty, Astana, Shymkent and other cities in Kazakhstan.',
    },
    kz: {
      title: 'Қазақстан қалалары бойынша сайт әзірлеу',
      description: 'Алматы, Астана, Шымкент және Қазақстанның басқа қалалары бойынша сайт әзірлеу беттері.',
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
      title: 'Городские страницы по разработке сайтов',
      description: 'Выберите город и перейдите на отдельную SEO-страницу с адаптированным заголовком, интро и гео-контентом.',
    },
    en: {
      title: 'City pages for website development',
      description: 'Choose a city and open a dedicated landing page with geo-focused title, intro and supporting content.',
    },
    kz: {
      title: 'Сайт әзірлеудің қалалық беттері',
      description: 'Қаланы таңдап, жеке SEO-бетке өтіңіз: бейімделген тақырып, кіріспе және гео-контент.',
    },
  }[lang];

  return (
    <LanguageProvider initialLanguage={lang}>
      <div className="min-h-screen bg-[#f7f7f5] text-slate-950">
        <Header />
        <main className="pb-20 pt-32">
          <section className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <div className="mb-12 grid gap-8 border-y border-slate-300 py-10 md:grid-cols-12 md:py-14">
                <div className="md:col-span-7">
                  <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">Kazakhstan / Cities</p>
                  <h1 className="text-4xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-6xl">
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
      </div>
    </LanguageProvider>
  );
}
