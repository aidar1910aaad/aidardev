import Header from "../../components/landing/EditorialHeader";
import Footer from "../../components/landing/Footer";
import StickyWhatsApp from '../../components/landing/StickyWhatsApp';
import Contact from "../../components/landing/ConversionContact";
import { LanguageProvider, type Language } from "../../contexts/LanguageContext";
import { Metadata } from "next";
import { Check } from "../../components/brand/icons";
import HomeProcess from "../../components/home/HomeProcess";
import HomeReviews from "../../components/home/HomeReviews";
import RatingRow from "../../components/home/RatingRow";
import { container, getT, Kicker, sectionY } from "../../components/home/shared";
import { ServiceLinkCard } from "../../components/service-page/ServiceCards";
import { SERVICE_KEYS } from "../../components/service-page/meta";
import StructuredDataServer from "../../components/SEO/StructuredDataServer";
import { createBreadcrumbSchema } from "../../lib/schemas";

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
    en: 'Professional development services in Kazakhstan: website development, Telegram and WhatsApp bots, AI chatbots, UI/UX design, mobile apps, consulting and training. 8+ years in development, 68+ projects.',
    ru: 'Профессиональные услуги разработки в Казахстане: разработка сайтов, Telegram и WhatsApp боты, AI-чатботы, UI/UX дизайн, мобильные приложения, консультации и обучение. 8+ лет в разработке, 68+ проектов.',
    kz: 'Қазақстанда кәсіби әзірлеу қызметтері: сайттарды әзірлеу, Telegram және WhatsApp боттар, AI-чатботтар, UI/UX дизайн, мобильді қосымшалар, кеңес және оқыту. 8+ жыл тәжірибе, 68+ жоба.',
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
      siteName: 'aidardev',
      title: titles[lang as keyof typeof titles] || titles.ru,
      description: descriptions[lang as keyof typeof descriptions] || descriptions.ru,
    },
  };
}


export default async function ServicesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params;
  const lang: Language = langParam === 'en' || langParam === 'kz' ? langParam : 'ru';
  const t = getT(lang);
  const included = [1, 2, 3, 4, 5, 6].map((n) => t(`landing.included.${n}`));

  return (
    <LanguageProvider initialLanguage={lang}>
      <StructuredDataServer
        id="services-breadcrumb-schema"
        data={createBreadcrumbSchema([
          { name: t('svc.crumb.home'), url: `${siteUrl}/${lang}` },
          { name: t('svc.crumb.services'), url: `${siteUrl}/${lang}/services` },
        ])}
      />
      <div className="page-with-action-bar min-h-screen bg-white text-[#1b1f3b]">
        <Header />
        <main id="main-content">
          <section className="hero-bg relative overflow-hidden">
            <div className={`${container} pb-14 pt-[calc(4rem+16px)] lg:pb-20 lg:pt-[calc(5rem+32px)]`}>
              <nav aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-x-2 text-[13px] font-medium text-[#62667f]">
                  <li><a href={`/${lang}`} className="hover:text-[#b4232c]">{t('svc.crumb.home')}</a></li>
                  <li aria-hidden>/</li>
                  <li aria-current="page" className="text-[#1b1f3b]">{t('svc.crumb.services')}</li>
                </ol>
              </nav>
              <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:items-end lg:gap-14">
                <div className="flex flex-col gap-[18px] lg:gap-6">
                  <Kicker>{t('svc.catalog.kicker')}</Kicker>
                  <h1 className="text-[40px] leading-[1.05] tracking-[-0.035em] text-[#1b1f3b] lg:text-[64px]">{t('svc.catalog.title')}</h1>
                  <RatingRow lang={lang} source="2gis_services" />
                </div>
                <p className="text-base leading-[1.6] text-[#464a66] lg:text-lg">{t('svc.catalog.text')}</p>
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className={`${container} ${sectionY}`}>
              <div className="grid gap-3.5 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                {SERVICE_KEYS.map((key) => (
                  <ServiceLinkCard key={key} lang={lang} service={key} />
                ))}
              </div>
              <div className="mt-3.5 rounded-[22px] bg-[#fff7ef] p-5 md:mt-5 md:rounded-3xl md:p-8">
                <h2 className="text-lg tracking-[-0.015em] text-[#1b1f3b] md:text-[22px]">{t('landing.included.title')}</h2>
                <ul className="mt-4 grid gap-3 md:mt-[22px] md:grid-cols-2 md:gap-x-8 md:gap-y-3.5">
                  {included.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[15px] font-medium text-[#1b1f3b] md:gap-3 md:text-base">
                      <span className="mt-px grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-[#b4232c] text-white md:h-6 md:w-6">
                        <Check className="h-[13px] w-[13px] md:h-3.5 md:w-3.5" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <HomeProcess lang={lang} />
          <HomeReviews lang={lang} />
        </main>
        <Contact />
        <Footer />
        <StickyWhatsApp source="services" />
      </div>
    </LanguageProvider>
  );
}
