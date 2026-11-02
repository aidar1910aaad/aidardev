import dynamic from "next/dynamic";
import Header from "../components/landing/EditorialHeader";
import HomeHero from "../components/home/HomeHero";
import HomeStats from "../components/home/HomeStats";
import HomeServices from "../components/home/HomeServices";
import HomeProcess from "../components/home/HomeProcess";
import HomeWork from "../components/home/HomeWork";
import HomeReviews from "../components/home/HomeReviews";
import HomeFaq, { homeFaqItems } from "../components/home/HomeFaq";
import StructuredDataServer from "../components/SEO/StructuredDataServer";
import {
  createPersonSchema,
  createOrganizationSchema,
  createWebSiteSchema,
  createFAQSchema,
} from "../lib/schemas";
import { LanguageProvider, type Language } from "../contexts/LanguageContext";
import { Metadata } from "next";

// Только языки из generateStaticParams в [lang]/layout: чужой первый сегмент (/wp-login.php, /.env) — 404 без рендера.
export const dynamicParams = false;

// Разделы главной — серверные компоненты (тексты из translations по языку страницы);
// клиентские только форма, подвал и нижняя панель.
const Contact = dynamic(() => import("../components/landing/ConversionContact"), {
  ssr: true,
  loading: () => <div className="min-h-[400px]" />,
});

const Footer = dynamic(() => import("../components/landing/Footer"), {
  ssr: true,
});

const StickyWhatsApp = dynamic(() => import("../components/landing/StickyWhatsApp"), {
  ssr: true,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = langParam || 'ru';
  // Уникальные title и description для каждой языковой версии
  const titles = {
    ru: 'Разработка, маркетинг и AI для заявок',
    en: 'Development, marketing and AI for enquiries',
    kz: 'Өтінімдерге арналған әзірлеу, маркетинг және AI',
  };

  const seoDescriptions = {
    ru: 'Сайты, боты, AI-автоматизация, SEO и интернет-реклама для привлечения и обработки заявок. Проектирование, разработка, запуск и аналитика.',
    en: 'Websites, bots, AI automation, SEO and online advertising for attracting and handling enquiries. Strategy, development, launch and analytics.',
    kz: 'Өтінімдерді тарту және өңдеуге арналған сайттар, боттар, AI автоматтандыру, SEO және интернет-жарнама. Жобалау, әзірлеу, іске қосу және аналитика.',
  };

  return {
    metadataBase: new URL(siteUrl),
    title: titles[lang as keyof typeof titles] || titles.ru,
    description: seoDescriptions[lang as keyof typeof seoDescriptions] || seoDescriptions.ru,
    alternates: {
      canonical: `${siteUrl}/${lang}`,
      languages: {
        'ru': `${siteUrl}/ru`,
        'en': `${siteUrl}/en`,
        'kk': `${siteUrl}/kz`,
      },
    },
    openGraph: {
      type: 'website',
      locale: lang === 'ru' ? 'ru_RU' : lang === 'en' ? 'en_US' : 'kk_KZ',
      alternateLocale: ['ru_RU', 'en_US', 'kk_KZ'],
      url: `${siteUrl}/${lang}`,
      siteName: 'aidardev',
      title: titles[lang as keyof typeof titles] || titles.ru,
      description: seoDescriptions[lang as keyof typeof seoDescriptions] || seoDescriptions.ru,
    },
  };
}

export default async function LangHomePage({ params }: { params: Promise<{ lang: string }> }) {
  // Нормализуем язык из params
  const { lang: langParam } = await params;
  const lang: Language = langParam === 'en' || langParam === 'kz' ? langParam : 'ru';

  // Structured data — на сервере. FAQPage строится из тех же вопросов, что показаны на странице.
  const personSchema = createPersonSchema();
  const organizationSchema = createOrganizationSchema();
  const websiteSchema = createWebSiteSchema();
  const faqSchema = createFAQSchema(homeFaqItems(lang));

  return (
    <LanguageProvider initialLanguage={lang}>
      <StructuredDataServer data={personSchema} id="person-schema" />
      <StructuredDataServer data={organizationSchema} id="organization-schema" />
      <StructuredDataServer data={websiteSchema} id="website-schema" />
      <StructuredDataServer data={faqSchema} id="faq-schema" />

      <div className="page-with-action-bar min-h-screen bg-white text-[#1b1f3b]">
        <Header />
        <main id="main-content">
          <HomeHero lang={lang} />
          <HomeStats lang={lang} />
          <HomeServices lang={lang} />
          <HomeProcess lang={lang} />
          <HomeWork lang={lang} />
          <HomeReviews lang={lang} />
          <HomeFaq lang={lang} />
          <Contact flushTop />
        </main>
        <Footer />
        <StickyWhatsApp />
      </div>
    </LanguageProvider>
  );
}
