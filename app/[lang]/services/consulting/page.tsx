import Header from "../../../components/landing/EditorialHeader";
import Footer from "../../../components/landing/Footer";
import Contact from "../../../components/landing/ConversionContact";
import ServicePage from "../../../components/service-page/ServicePage";
import { LanguageProvider } from "../../../contexts/LanguageContext";
import { Metadata } from "next";
import { fitTitle } from "../../../lib/seo/title";
import { servicesConfig } from "../../../data/services-config";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';
const serviceKey = 'consulting';
const config = servicesConfig[serviceKey];

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = langParam || 'ru';
  
  const titles = {
    en: 'Development Consulting Kazakhstan | Programming Training',
    ru: 'Помощь и консультации по программированию | Алматы, Астана',
    kz: 'Әзірлеу бойынша кеңес | Бағдарламалауды оқыту Алматы, Астана',
  };
  
  const descriptions = {
    en: 'Professional development consulting and programming training in Almaty, Astana, Shymkent and throughout Kazakhstan. Technology consultations, code review, team training. 8+ years in development, 68+ projects.',
    ru: 'Консультации по разработке и обучение программированию в Алматы, Астане, Шымкенте и по всему Казахстану. Разбор задач, code review и менторинг команды. Стоимость согласуем после брифа.',
    kz: 'Алматы, Астана, Шымкент және бүкіл Қазақстан бойынша кәсіби әзірлеу бойынша кеңес беру және бағдарламалауды оқыту. Технологиялар бойынша кеңес, code review, команданы оқыту. 8+ жыл тәжірибе, 68+ жоба.',
  };

  return {
    title: fitTitle(titles[lang as keyof typeof titles] || titles.ru),
    description: descriptions[lang as keyof typeof descriptions] || descriptions.ru,
    keywords: config.targetQueries[lang as keyof typeof config.targetQueries] || config.targetQueries.ru,
    alternates: {
      canonical: `${siteUrl}/${lang}/services/${serviceKey}`,
      languages: {
        'ru': `${siteUrl}/ru/services/${serviceKey}`,
        'en': `${siteUrl}/en/services/${serviceKey}`,
        'kk': `${siteUrl}/kz/services/${serviceKey}`,
      },
    },
    openGraph: {
      type: 'website',
      locale: lang === 'ru' ? 'ru_RU' : lang === 'en' ? 'en_US' : 'kk_KZ',
      alternateLocale: ['ru_RU', 'en_US', 'kk_KZ'],
      url: `${siteUrl}/${lang}/services/${serviceKey}`,
      siteName: 'aidardev',
      title: titles[lang as keyof typeof titles] || titles.ru,
      description: descriptions[lang as keyof typeof descriptions] || descriptions.ru,
    },
  };
}

export default async function ConsultingServicePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params;
  const lang = langParam || 'ru';

  return (
    <LanguageProvider initialLanguage={lang as 'ru' | 'en' | 'kz'}>
      <div className="page-with-action-bar min-h-screen bg-white text-[#1b1f3b]">
        <Header />
        <main id="main-content">
          <ServicePage
            lang={lang as 'ru' | 'en' | 'kz'}
            serviceKey={serviceKey}
            h1Key="services.consulting.h1"
            introKey="services.consulting.intro"
            processKey="services.consulting.process"
            examplesKey="services.consulting.examples"
            faqKey="services.consulting.faq"
          />
        </main>
        <Contact />
        <Footer />
      </div>
    </LanguageProvider>
  );
}





