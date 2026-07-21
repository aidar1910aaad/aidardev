import Header from "../../components/landing/EditorialHeader";
import Footer from "../../components/landing/Footer";
import Contact from "../../components/landing/ConversionContact";
import { LanguageProvider } from "../../contexts/LanguageContext";
import { Metadata } from "next";
import { ServiceKey } from "../../data/services-config";
import AnimatedSection from "../../components/common/AnimatedSection";
import ServiceCardClient from "./ServiceCardClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = langParam || 'ru';
  
  const titles = {
    en: 'Services | Website Development, Bots, AI, Design, Consulting in Kazakhstan',
    ru: 'Услуги | Разработка сайтов, боты, AI, дизайн, консультации в Казахстане',
    kz: 'Қызметтер | Сайттарды әзірлеу, боттар, AI, дизайн, кеңес Қазақстанда',
  };
  
  const descriptions = {
    en: 'Professional development services in Kazakhstan: website development, Telegram and WhatsApp bots, AI chatbots, UI/UX design, mobile apps, consulting and training. 6+ years experience, 47+ projects.',
    ru: 'Профессиональные услуги разработки в Казахстане: разработка сайтов, Telegram и WhatsApp боты, AI-чатботы, UI/UX дизайн, мобильные приложения, консультации и обучение. 6+ лет опыта, 47+ проектов.',
    kz: 'Қазақстанда кәсіби әзірлеу қызметтері: сайттарды әзірлеу, Telegram және WhatsApp боттар, AI-чатботтар, UI/UX дизайн, мобильді қосымшалар, кеңес және оқыту. 6+ жыл тәжірибе, 47+ жоба.',
  };

  return {
    title: titles[lang as keyof typeof titles] || titles.ru,
    description: descriptions[lang as keyof typeof descriptions] || descriptions.ru,
    alternates: {
      canonical: `${siteUrl}/${lang}/services`,
      languages: {
        'ru': `${siteUrl}/ru/services`,
        'en': `${siteUrl}/en/services`,
        'kk': `${siteUrl}/kz/services`,
      },
    },
    openGraph: {
      type: 'website',
      locale: lang === 'ru' ? 'ru_RU' : lang === 'en' ? 'en_US' : 'kk_KZ',
      alternateLocale: ['ru_RU', 'en_US', 'kk_KZ'],
      url: `${siteUrl}/${lang}/services`,
      siteName: 'Aidar - Full-Stack Developer',
      title: titles[lang as keyof typeof titles] || titles.ru,
      description: descriptions[lang as keyof typeof descriptions] || descriptions.ru,
    },
  };
}


export default async function ServicesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params;
  const lang = langParam || 'ru';

  // Получаем все услуги
  const availableServices: ServiceKey[] = ['websites', 'bots', 'ai', 'mobile', 'design', 'consulting'];

  return (
    <LanguageProvider initialLanguage={lang as 'ru' | 'en' | 'kz'}>
      <div className="min-h-screen bg-[#f7f7f5] text-[#111827]">
        <Header />
        <main>
          <section className="border-b border-slate-300 pt-32 pb-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-7xl">
                <AnimatedSection animationType="slide-up" delay={0}>
                  <div className="grid gap-8 border-y border-slate-300 py-10 md:grid-cols-12 md:py-14">
                    <div className="md:col-span-7">
                      <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">Aidar / 01—06</p>
                      <h1 className="text-5xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-6xl md:text-7xl">
                        {lang === 'en' ? 'Services' : lang === 'kz' ? 'Қызметтер' : 'Услуги'}
                      </h1>
                    </div>
                    <p className="self-end text-lg leading-8 text-slate-600 md:col-span-5">
                      {lang === 'en' 
                        ? 'Professional development services in Kazakhstan. From website development to AI integration, I help businesses grow with modern technology solutions.'
                        : lang === 'kz'
                        ? 'Қазақстанда кәсіби әзірлеу қызметтері. Сайттарды әзірлеуден AI интеграциясына дейін, мен бизнестің заманауи технологиялық шешімдермен өсуіне көмектесемін.'
                        : 'Профессиональные услуги разработки в Казахстане. От разработки сайтов до интеграции AI, я помогаю бизнесу расти с помощью современных технологических решений.'}
                    </p>
                  </div>
                </AnimatedSection>

                <div className="mt-10 grid grid-cols-1 border-l border-t border-slate-300 md:grid-cols-2 lg:grid-cols-3">
                  {availableServices.map((serviceKey, index) => (
                    <AnimatedSection
                      key={serviceKey}
                      animationType="slide-up"
                      delay={index * 75}
                      className="h-full"
                    >
                      <ServiceCardClient serviceKey={serviceKey} lang={lang} />
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
        <Contact />
        <Footer />
      </div>
    </LanguageProvider>
  );
}

