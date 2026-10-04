import Header from "../../../components/landing/EditorialHeader";
import Footer from "../../../components/landing/Footer";
import Contact from "../../../components/landing/ConversionContact";
import ServicePage from "../../../components/service-page/ServicePage";
import { LanguageProvider } from "../../../contexts/LanguageContext";
import { Metadata } from "next";
import { servicesConfig } from "../../../data/services-config";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';
const serviceKey = 'design';
const config = servicesConfig[serviceKey];

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = langParam || 'ru';
  
  const titles = {
    en: 'UI/UX Design Kazakhstan | Web Design Almaty, Astana | Website Redesign',
    // GSC: «дизайн сайтов заказать» поз. 1.5, «заказать дизайн сайта» поз. 2 — главное и цена в первых 60 символах
    ru: 'Заказать дизайн сайта — UX/UI от 150 000 ₸, Астана и Алматы',
    kz: 'UX/UI дизайнға тапсырыс беру | Қазақстан, Алматы, Астана',
  };
  
  const descriptions = {
    en: 'Professional UI/UX design services in Almaty, Astana, Shymkent and throughout Kazakhstan. Web design, mobile app design, website redesign. Modern interfaces, user experience optimization. 6+ years experience, 38+ projects.',
    ru: 'Дизайн сайта под ключ: лендинг — от 150 000 ₸, многостраничный сайт — от 300 000 ₸, приложение — от 400 000 ₸. Прототип, UX/UI, адаптив. Смета после брифа.',
    kz: 'Алматы, Астана және бүкіл Қазақстан бойынша UX/UI дизайн. Лендинг, редизайн, прототип. Брифтан кейін мерзім мен бағаны бағалаймыз.',
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
      siteName: 'aidardev',
      title: titles[lang as keyof typeof titles] || titles.ru,
      description: descriptions[lang as keyof typeof descriptions] || descriptions.ru,
    },
  };
}

export default async function DesignServicePage({ params }: { params: Promise<{ lang: string }> }) {
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
            h1Key="services.design.h1"
            introKey="services.design.intro"
            processKey="services.design.process"
            examplesKey="services.design.examples"
            faqKey="services.design.faq"
          />
        </main>
        <Contact />
        <Footer />
      </div>
    </LanguageProvider>
  );
}





