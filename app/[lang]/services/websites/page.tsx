import Header from "../../../components/landing/EditorialHeader";
import Footer from "../../../components/landing/Footer";
import Contact from "../../../components/landing/ConversionContact";
import ServicePageTemplate from "../../../components/services/ServicePageTemplate";
import { LanguageProvider } from "../../../contexts/LanguageContext";
import { Metadata } from "next";
import { servicesConfig } from "../../../data/services-config";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';
const serviceKey = 'websites';
const config = servicesConfig[serviceKey];

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = langParam || 'ru';
  
  const titles = {
    en: 'Website Development Kazakhstan | Create Website Almaty, Astana',
    ru: 'Разработка сайтов и интернет-магазинов в Казахстане | Алматы, Астана',
    kz: 'Сайт және интернет-дүкен әзірлеу | Қазақстан, Алматы, Астана',
  };
  
  const descriptions = {
    en: 'Professional website development in Almaty, Astana, Shymkent and throughout Kazakhstan. Landing pages, corporate sites, e-commerce platforms. 6+ years experience, 47+ projects.',
    ru: 'Разработка сайтов и интернет-магазинов в Алматы, Астане и по Казахстану. Лендинги, корпоративные сайты, Kaspi Pay, SEO. Оценка после брифа.',
    kz: 'Алматы, Астана және Қазақстан бойынша сайт пен интернет-дүкен әзірлеу. Лендинг, корпоративтік сайт, SEO.',
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

export default async function WebsitesServicePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params;
  const lang = langParam || 'ru';

  return (
    <LanguageProvider initialLanguage={lang as 'ru' | 'en' | 'kz'}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-orange-50/20 dark:from-gray-950 dark:via-blue-950/10 dark:to-orange-950/10">
        <Header />
        <main>
          <ServicePageTemplate
            serviceKey={serviceKey}
            h1Key="services.websites.h1"
            introKey="services.websites.intro"
            contentKey="services.websites.content"
            processKey="services.websites.process"
            examplesKey="services.websites.examples"
            faqKey="services.websites.faq"
          />
        </main>
        <Contact />
        <Footer />
      </div>
    </LanguageProvider>
  );
}





