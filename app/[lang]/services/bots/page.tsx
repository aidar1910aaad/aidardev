import Header from "../../../components/landing/EditorialHeader";
import Footer from "../../../components/landing/Footer";
import Contact from "../../../components/landing/ConversionContact";
import ServicePage from "../../../components/service-page/ServicePage";
import { LanguageProvider } from "../../../contexts/LanguageContext";
import { Metadata } from "next";
import { fitTitle } from "../../../lib/seo/title";
import { servicesConfig } from "../../../data/services-config";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';
const serviceKey = 'bots';
const config = servicesConfig[serviceKey];

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = langParam || 'ru';
  
  const titles = {
    en: 'Telegram and WhatsApp Bot Development in Kazakhstan',
    ru: 'Разработка Telegram и WhatsApp ботов под ключ — цены в Алматы',
    kz: 'Бот әзірлеу Алматы | Telegram, WhatsApp',
  };
  
  const descriptions = {
    en: 'Professional Telegram and WhatsApp bot development in Almaty, Astana, Shymkent and throughout Kazakhstan. Business automation, CRM integration, chatbots. 8+ years in development, 68+ projects.',
    ru: 'Разработка Telegram и WhatsApp ботов под ключ в Алматы и по Казахстану: заявки, автоответы, CRM. Сроки и стоимость после брифа.',
    kz: 'Алматы және Қазақстан бойынша Telegram/WhatsApp боттары. Өтінімдер, CRM интеграциясы.',
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

export default async function BotsServicePage({ params }: { params: Promise<{ lang: string }> }) {
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
            h1Key="services.bots.h1"
            introKey="services.bots.intro"
            processKey="services.bots.process"
            examplesKey="services.bots.examples"
            faqKey="services.bots.faq"
          />
        </main>
        <Contact />
        <Footer />
      </div>
    </LanguageProvider>
  );
}





