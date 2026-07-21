import Header from "../../../components/landing/EditorialHeader";
import Footer from "../../../components/landing/Footer";
import Contact from "../../../components/landing/ConversionContact";
import ServicePageTemplate from "../../../components/services/ServicePageTemplate";
import { LanguageProvider } from "../../../contexts/LanguageContext";
import { Metadata } from "next";
import { servicesConfig } from "../../../data/services-config";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';
const serviceKey = 'bots';
const config = servicesConfig[serviceKey];

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = langParam || 'ru';
  
  const titles = {
    en: 'Telegram Bot Development Kazakhstan | WhatsApp Bot Creation Almaty, Astana',
    ru: 'Разработка ботов в Алматы и Казахстане | Telegram, WhatsApp',
    kz: 'Бот әзірлеу Алматы | Telegram, WhatsApp',
  };
  
  const descriptions = {
    en: 'Professional Telegram and WhatsApp bot development in Almaty, Astana, Shymkent and throughout Kazakhstan. Business automation, CRM integration, chatbots. 6+ years experience, 47+ projects.',
    ru: 'Разработка Telegram и WhatsApp ботов в Алматы, Астане и по Казахстану. Заявки, автоответы, CRM. Оценка сценария и сроков после брифа.',
    kz: 'Алматы және Қазақстан бойынша Telegram/WhatsApp боттары. Өтінімдер, CRM интеграциясы.',
  };

  return {
    title: titles[lang as keyof typeof titles] || titles.ru,
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
      siteName: 'Aidar - Full-Stack Developer',
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-orange-50/20 dark:from-gray-950 dark:via-blue-950/10 dark:to-orange-950/10">
        <Header />
        <main>
          <ServicePageTemplate
            serviceKey={serviceKey}
            h1Key="services.bots.h1"
            introKey="services.bots.intro"
            contentKey="services.bots.content"
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





