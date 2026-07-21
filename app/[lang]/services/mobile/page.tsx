import Header from "../../../components/landing/EditorialHeader";
import Footer from "../../../components/landing/Footer";
import Contact from "../../../components/landing/ConversionContact";
import ServicePageTemplate from "../../../components/services/ServicePageTemplate";
import { LanguageProvider } from "../../../contexts/LanguageContext";
import { Metadata } from "next";
import { servicesConfig } from "../../../data/services-config";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';
const serviceKey = 'mobile';
const config = servicesConfig[serviceKey];

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = langParam || 'ru';
  
  const titles = {
    en: 'Mobile App Development Kazakhstan | iOS and Android Apps Almaty, Astana',
    ru: 'Разработка мобильных приложений в Астане и Алматы | iOS, Android',
    kz: 'Мобильді қосымша әзірлеу Астана, Алматы | iOS, Android',
  };
  
  const descriptions = {
    en: 'Professional mobile app development for iOS and Android in Almaty, Astana, Shymkent and throughout Kazakhstan. Native and cross-platform apps. 6+ years experience, 47+ projects.',
    ru: 'Разработка мобильных приложений для iOS и Android в Астане, Алматы и по Казахстану. MVP, нативные и кроссплатформенные приложения. Оценка первой версии после брифа.',
    kz: 'Астана, Алматы және Қазақстан бойынша iOS/Android қосымшалар. MVP, нативті және кроссплатформалық әзірлеу.',
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

export default async function MobileServicePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params;
  const lang = langParam || 'ru';

  return (
    <LanguageProvider initialLanguage={lang as 'ru' | 'en' | 'kz'}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-orange-50/20 dark:from-gray-950 dark:via-blue-950/10 dark:to-orange-950/10">
        <Header />
        <main>
          <ServicePageTemplate
            serviceKey={serviceKey}
            h1Key="services.mobile.h1"
            introKey="services.mobile.intro"
            contentKey="services.mobile.content"
            processKey="services.mobile.process"
            examplesKey="services.mobile.examples"
            faqKey="services.mobile.faq"
          />
        </main>
        <Contact />
        <Footer />
      </div>
    </LanguageProvider>
  );
}





