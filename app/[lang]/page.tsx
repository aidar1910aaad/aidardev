import dynamic from "next/dynamic";
import Header from "../components/landing/EditorialHeader";
import Hero from "../components/landing/EditorialHero";
import StructuredDataServer from "../components/SEO/StructuredDataServer";
import {
  createPersonSchema,
  createOrganizationSchema,
  createWebSiteSchema,
} from "../lib/schemas";
import { LanguageProvider } from "../contexts/LanguageContext";
import { Metadata } from "next";

// Lazy load секций ниже fold для улучшения LCP
const PainOffers = dynamic(() => import("../components/landing/PainOffers"), {
  ssr: true,
  loading: () => <div className="min-h-[320px]" />,
});

const Projects = dynamic(() => import("../components/landing/Projects"), {
  ssr: true,
  loading: () => <div className="min-h-[400px]" />,
});

const Skills = dynamic(() => import("../components/landing/Skills"), {
  ssr: true,
  loading: () => <div className="min-h-[400px]" />,
});

const Process = dynamic(() => import("../components/landing/Process"), {
  ssr: true,
  loading: () => <div className="min-h-[400px]" />,
});

const PricingPreview = dynamic(() => import("../components/landing/PricingPreview"), {
  ssr: true,
  loading: () => <div className="min-h-[400px]" />,
});

const FAQ = dynamic(() => import("../components/landing/FAQ"), {
  ssr: true,
  loading: () => <div className="min-h-[400px]" />,
});

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
    ru: 'Разработка, маркетинг и AI для заявок | aidardev',
    en: 'Development, marketing and AI for enquiries | aidardev',
    kz: 'Өтінімдерге арналған әзірлеу, маркетинг және AI | aidardev',
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
      siteName: 'aidardev — Development Studio',
      title: titles[lang as keyof typeof titles] || titles.ru,
      description: seoDescriptions[lang as keyof typeof seoDescriptions] || seoDescriptions.ru,
      images: [
        {
          url: '/og-image.svg',
          width: 1200,
          height: 630,
          alt: 'aidardev — development, marketing and AI studio',
        },
      ],
    },
  };
}

export default async function LangHomePage({ params }: { params: Promise<{ lang: string }> }) {
  // Нормализуем язык из params
  const { lang: langParam } = await params;
  let lang = langParam || 'ru';
  // Убеждаемся, что язык валидный
  if (lang !== 'en' && lang !== 'kz' && lang !== 'ru') {
    lang = 'ru';
  }
  
  // Создаем все structured data схемы на сервере
  const personSchema = createPersonSchema();
  const organizationSchema = createOrganizationSchema();
  const websiteSchema = createWebSiteSchema();

  return (
    <LanguageProvider initialLanguage={lang as 'ru' | 'en' | 'kz'}>
      {/* Structured Data для SEO - серверные компоненты */}
      <StructuredDataServer data={personSchema} id="person-schema" />
      <StructuredDataServer data={organizationSchema} id="organization-schema" />
      <StructuredDataServer data={websiteSchema} id="website-schema" />
      
      <div className="min-h-screen bg-[#f4f2ec] text-[#11110f]">
        <Header />
        <main id="main-content">
          <Hero />
          <PainOffers />
          <Projects />
          <Skills />
          <Process />
          <PricingPreview />
          <FAQ />
          <Contact />
        </main>
        <Footer />
        <StickyWhatsApp />
      </div>
    </LanguageProvider>
  );
}

