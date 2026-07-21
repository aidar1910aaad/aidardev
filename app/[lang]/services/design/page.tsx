import Header from "../../../components/landing/EditorialHeader";
import Footer from "../../../components/landing/Footer";
import Contact from "../../../components/landing/ConversionContact";
import ServicePageTemplate from "../../../components/services/ServicePageTemplate";
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
    ru: 'Заказать UX/UI-дизайн сайта в Казахстане | Алматы, Астана',
    kz: 'UX/UI дизайн заказать | Қазақстан, Алматы, Астана',
  };
  
  const descriptions = {
    en: 'Professional UI/UX design services in Almaty, Astana, Shymkent and throughout Kazakhstan. Web design, mobile app design, website redesign. Modern interfaces, user experience optimization. 6+ years experience, 47+ projects.',
    ru: 'UX/UI-дизайн сайтов и приложений в Алматы, Астане и по Казахстану. Лендинги, редизайн, прототипы. Оценка сроков и стоимости после брифа. Договор, поддержка после запуска.',
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
      siteName: 'Aidar - Full-Stack Developer',
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-orange-50/20 dark:from-gray-950 dark:via-blue-950/10 dark:to-orange-950/10">
        <Header />
        <main>
          <ServicePageTemplate
            serviceKey={serviceKey}
            h1Key="services.design.h1"
            introKey="services.design.intro"
            contentKey="services.design.content"
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





