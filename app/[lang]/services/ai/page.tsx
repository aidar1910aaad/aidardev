import Header from "../../../components/landing/EditorialHeader";
import Footer from "../../../components/landing/Footer";
import Contact from "../../../components/landing/ConversionContact";
import ServicePageTemplate from "../../../components/services/ServicePageTemplate";
import { LanguageProvider } from "../../../contexts/LanguageContext";
import { Metadata } from "next";
import { servicesConfig } from "../../../data/services-config";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';
const serviceKey = 'ai';
const config = servicesConfig[serviceKey];

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = langParam || 'ru';
  
  const titles = {
    en: 'AI Chatbot Development Kazakhstan | AI Integration Almaty, Astana',
    ru: 'Разработка AI-чатботов Казахстан | ИИ интеграции Алматы, Астана',
    kz: 'AI чатботтарды әзірлеу Қазақстан | AI интеграциялар Алматы, Астана',
  };
  
  const descriptions = {
    en: 'Professional AI chatbot development and machine learning solutions in Almaty, Astana, Shymkent and throughout Kazakhstan. GPT integration, AI assistants, ML analytics. 6+ years experience, 47+ projects.',
    ru: 'Профессиональная разработка AI-чатботов и решений машинного обучения в Алматы, Астане, Шымкенте и по всему Казахстану. Интеграция GPT, AI-ассистенты, ML-аналитика. 6+ лет опыта, 47+ проектов.',
    kz: 'Алматы, Астана, Шымкент және бүкіл Қазақстан бойынша кәсіби AI-чатботтарды әзірлеу және машиналық оқыту шешімдері. GPT интеграциясы, AI-ассистенттер, ML-аналитика. 6+ жыл тәжірибе, 47+ жоба.',
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

export default async function AIServicePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params;
  const lang = langParam || 'ru';

  return (
    <LanguageProvider initialLanguage={lang as 'ru' | 'en' | 'kz'}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-orange-50/20 dark:from-gray-950 dark:via-blue-950/10 dark:to-orange-950/10">
        <Header />
        <main>
          <ServicePageTemplate
            serviceKey={serviceKey}
            h1Key="services.ai.h1"
            introKey="services.ai.intro"
            contentKey="services.ai.content"
            processKey="services.ai.process"
            examplesKey="services.ai.examples"
            faqKey="services.ai.faq"
          />
        </main>
        <Contact />
        <Footer />
      </div>
    </LanguageProvider>
  );
}





