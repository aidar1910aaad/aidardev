import Header from "../../components/landing/EditorialHeader";
import Pricing from "../../components/landing/Pricing";
import Footer from "../../components/landing/Footer";
import StructuredDataServer from "../../components/SEO/StructuredDataServer";
import { createWebSiteSchema } from "../../lib/schemas";
import { LanguageProvider } from "../../contexts/LanguageContext";
import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = langParam || 'ru';
  const titles = {
    en: 'Web Development Pricing Kazakhstan | Cost of Services',
    ru: 'Цены на разработку сайтов Казахстан | Стоимость услуг',
    kz: 'Веб-дамыту бағалары Қазақстан | Қызметтер құны',
  };
  const descriptions = {
    en: 'Transparent pricing for web development, bots, AI, mobile apps in Almaty, Astana, Shymkent and throughout Kazakhstan. 6+ years experience, 47+ projects.',
    ru: 'Прозрачные цены на разработку сайтов, ботов, AI-решений и мобильных приложений в Алматы, Астане, Шымкенте и по всему Казахстану. 6+ лет опыта, 47+ проектов.',
    kz: 'Алматы, Астана, Шымкент және бүкіл Қазақстан бойынша веб-дамыту, боттар, AI шешімдері және мобильді қосымшалар үшін ашық бағалар. 6+ жыл тәжірибе, 47+ жоба.',
  };

  return {
    title: titles[lang as keyof typeof titles] || titles.ru,
    description: descriptions[lang as keyof typeof descriptions] || descriptions.ru,
    keywords: lang === 'en' 
      ? ['pricing', 'cost', 'rates', 'web development pricing', 'website development cost', 'full-stack developer', 'Kazakhstan', 'Almaty', 'Astana', 'Shymkent', 'telegram bot pricing', 'mobile app development cost']
      : lang === 'kz'
      ? ['бағалар', 'құны', 'тарифтер', 'веб-дамыту бағалары', 'сайт әзірлеу құны', 'full-stack әзірлеуші', 'Қазақстан', 'Алматы', 'Астана', 'Шымкент', 'telegram бот бағалары', 'мобильді қосымша әзірлеу құны']
      : ['цены', 'стоимость', 'прайс', 'тарифы', 'цены на разработку сайтов', 'стоимость разработки сайта', 'веб-разработка', 'full-stack разработчик', 'Казахстан', 'Алматы', 'Астана', 'Шымкент', 'цены на telegram бота', 'стоимость мобильного приложения'],
    alternates: {
      canonical: `${siteUrl}/${lang}/pricing`,
      languages: {
        'ru': `${siteUrl}/ru/pricing`,
        'en': `${siteUrl}/en/pricing`,
        'kk': `${siteUrl}/kz/pricing`,
      },
    },
  };
}

export default async function LangPricingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params;
  const lang = langParam || 'ru';
  const websiteSchema = createWebSiteSchema();

  return (
    <LanguageProvider initialLanguage={lang as 'ru' | 'en' | 'kz'}>
      {/* Structured Data для SEO */}
      <StructuredDataServer data={websiteSchema} id="website-schema" />
      
      <div className="min-h-screen bg-[#f7f7f5] text-[#111827]">
        <Header />
        <main>
          <Pricing />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}

