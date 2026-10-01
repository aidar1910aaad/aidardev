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

const SocialProof = dynamic(() => import("../components/landing/SocialProof"), {
  ssr: true,
  loading: () => <div className="min-h-[400px]" />,
});

const Skills = dynamic(() => import("../components/landing/Skills"), {
  ssr: true,
  loading: () => <div className="min-h-[400px]" />,
});

const CtaBand = dynamic(() => import("../components/landing/CtaBand"), {
  ssr: true,
  loading: () => <div className="min-h-[200px]" />,
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
      
      <div className="page-with-action-bar min-h-screen bg-[#f4f2ec] text-[#11110f]">
        <Header />
        <main id="main-content">
          <Hero />
          <PainOffers />
          <Projects />
          <SocialProof />
          <Skills />
          <CtaBand variant="stack" source="home_band_stack" />
          <Process />
          <CtaBand variant="process" source="home_band_process" tone="ink" />
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

