import type { Metadata } from 'next';
import { fitTitle } from '../../lib/seo/title';
import CityFacts from './CityFacts';
import CityHero from './CityHero';
import CityServices from './CityServices';
import PriceCalculator from './PriceCalculator';
import { AstanaCases, AstanaLinks, AstanaOfferCard, AstanaSteps, AstanaTiers } from './AstanaBlocks';
import HomeReviews from '../home/HomeReviews';
import { container, Kicker, sectionY, SectionTitle } from '../home/shared';
import Contact from '../landing/ConversionContact';
import Header from '../landing/EditorialHeader';
import Footer from '../landing/Footer';
import StickyWhatsApp from '../landing/StickyWhatsApp';
import StructuredDataServer from '../SEO/StructuredDataServer';
import { FaqBlock } from '../service-page/ServiceFaqSection';
import { HeroBreadcrumbs } from '../service-page/ServiceHero';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { ASTANA_PRICE_SLUG, astanaPagePath, type AstanaPage } from '../../data/astana-pages';
import { PRICE_PAGE, PRICE_TABLE } from '../../data/price-calculator';
import { servicesConfig } from '../../data/services-config';
import { createBreadcrumbSchema, createFAQSchema, createServiceSchema } from '../../lib/schemas';
import { buildWhatsAppUrl } from '../../lib/whatsapp';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';

function crumbsFor(label: string) {
  return [
    { name: 'Главная', href: '/ru' },
    { name: 'Города', href: '/ru/cities' },
    { name: 'Астана', href: '/ru/cities/astana' },
    { name: label },
  ];
}

function breadcrumbSchema(label: string, path: string) {
  return createBreadcrumbSchema([
    { name: 'Главная', url: `${siteUrl}/ru` },
    { name: 'Города', url: `${siteUrl}/ru/cities` },
    { name: 'Астана', url: `${siteUrl}/ru/cities/astana` },
    { name: label, url: `${siteUrl}${path}` },
  ]);
}

function metadataFor({ title, description, keywords, path }: { title: string; description: string; keywords: string[]; path: string }): Metadata {
  return {
    title: fitTitle(title),
    description,
    keywords,
    alternates: { canonical: `${siteUrl}${path}` },
    openGraph: { type: 'website', locale: 'ru_RU', url: `${siteUrl}${path}`, siteName: 'aidardev', title, description },
  };
}

export function astanaPageMetadata(page: AstanaPage): Metadata {
  return metadataFor({ title: page.title, description: page.description, keywords: page.keywords, path: astanaPagePath(page.slug) });
}

export function astanaPriceMetadata(): Metadata {
  return metadataFor({
    title: PRICE_PAGE.title,
    description: PRICE_PAGE.description,
    keywords: PRICE_PAGE.keywords,
    path: astanaPagePath(ASTANA_PRICE_SLUG),
  });
}

/** «Астана × услуга»: свои цены, этапы, кейсы и вопросы под запросы с показами в Google. */
export function AstanaServicePage({ page }: { page: AstanaPage }) {
  const path = astanaPagePath(page.slug);
  const message = `Здравствуйте! Интересует ${page.label.toLowerCase()} в Астане. Хочу обсудить задачу.`;
  const whatsappUrl = buildWhatsAppUrl(message, { sourcePath: path });
  const source = `city_astana_${page.slug}`;

  return (
    <LanguageProvider initialLanguage="ru">
      <StructuredDataServer
        data={createServiceSchema({ name: page.h1, description: page.description, provider: 'aidardev', areaServed: 'Астана' })}
        id={`astana-${page.slug}-service`}
      />
      <StructuredDataServer data={createFAQSchema(page.faq)} id={`astana-${page.slug}-faq`} />
      <StructuredDataServer data={breadcrumbSchema(page.label, path)} id={`astana-${page.slug}-bc`} />

      <div className="page-with-action-bar min-h-screen bg-white text-[#1b1f3b]">
        <Header />
        <main id="main-content">
          <CityHero
            lang="ru"
            crumbs={crumbsFor(page.label)}
            kicker={`Астана · ${page.label}`}
            h1={page.h1}
            lead={page.lead}
            body={page.body}
            service={page.service}
            whatsappUrl={whatsappUrl}
            source={source}
            aside={<AstanaOfferCard label={page.label} tier={page.tiers[0]} included={page.tiers[0].items.slice(0, 4)} />}
          />
          <CityFacts
            lang="ru"
            title={page.factsTitle}
            intro={page.factsIntro}
            items={page.facts.map((fact) => fact.text)}
            labels={page.facts.map((fact) => fact.label)}
          />
          <AstanaTiers title={page.tiersTitle} intro={page.tiersIntro} tiers={page.tiers} source={`${source}_tiers`} />
          <AstanaSteps title={page.stepsTitle} steps={page.steps} />
          <AstanaCases title={page.casesTitle} ids={page.cases} />
          <HomeReviews lang="ru" />
          <FaqBlock lang="ru" items={page.faq} whatsappUrl={whatsappUrl} source={`${source}_faq`} />
          <AstanaLinks current={page.slug} />
          <CityServices
            lang="ru"
            title="Другие услуги студии"
            services={[page.service, ...servicesConfig[page.service].relatedServices].slice(0, 3)}
          />
        </main>
        <Contact />
        <Footer />
        <StickyWhatsApp source="city_service" message={message} />
      </div>
    </LanguageProvider>
  );
}

/** «Сколько стоит сайт в Астане»: калькулятор вилки, таблица цен, что влияет на цену и вопросы. */
export function AstanaPricePage() {
  const path = astanaPagePath(ASTANA_PRICE_SLUG);
  const message = 'Здравствуйте! Хочу узнать стоимость сайта.';
  const whatsappUrl = buildWhatsAppUrl(message, { sourcePath: path });
  const label = 'Стоимость сайта';

  return (
    <LanguageProvider initialLanguage="ru">
      <StructuredDataServer data={createFAQSchema(PRICE_PAGE.faq)} id="astana-price-faq" />
      <StructuredDataServer data={breadcrumbSchema(label, path)} id="astana-price-bc" />

      <div className="page-with-action-bar min-h-screen bg-white text-[#1b1f3b]">
        <Header />
        <main id="main-content">
          <section className="hero-bg relative overflow-hidden">
            <div className={`${container} relative pb-14 pt-[calc(4rem+16px)] lg:pb-20 lg:pt-[calc(5rem+32px)]`}>
              <HeroBreadcrumbs crumbs={crumbsFor(label)} />
              <div className="mt-6 flex max-w-[820px] flex-col gap-[18px] lg:mt-8 lg:gap-6">
                <Kicker>Астана · калькулятор цены</Kicker>
                <h1 className="text-[32px] leading-[1.08] tracking-[-0.035em] text-[#1b1f3b] sm:text-[42px] lg:text-[clamp(38px,3.6vw,54px)] lg:leading-[1.05]">
                  {PRICE_PAGE.h1}
                </h1>
                <p className="font-display text-lg font-semibold leading-[1.45] tracking-[-0.01em] text-[#1b1f3b] lg:text-[21px]">{PRICE_PAGE.lead}</p>
                <p className="text-base leading-[1.6] text-[#464a66] lg:text-lg">{PRICE_PAGE.body}</p>
              </div>
              <div className="mt-8 lg:mt-12">
                <PriceCalculator sourcePath={path} />
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className={`${container} ${sectionY}`}>
              <div className="flex flex-col gap-3 lg:gap-4">
                <Kicker>Цены 2026</Kicker>
                <SectionTitle className="text-[#1b1f3b]">Цены на сайты и ботов в Астане</SectionTitle>
              </div>
              <div className="mt-6 overflow-x-auto rounded-[22px] border border-[#efe3d5] lg:mt-10 lg:rounded-3xl">
                <table className="w-full min-w-[560px] border-collapse text-left text-[15px]">
                  <caption className="sr-only">Цены студии aidardev: пакет «Старт» и полный пакет</caption>
                  <thead className="bg-[#fff7ef] text-[13px] uppercase tracking-[0.06em] text-[#62667f]">
                    <tr>
                      <th scope="col" className="px-5 py-3.5 font-bold">Что делаем</th>
                      <th scope="col" className="px-5 py-3.5 font-bold">«Старт»</th>
                      <th scope="col" className="px-5 py-3.5 font-bold">Полный пакет</th>
                      <th scope="col" className="px-5 py-3.5 font-bold">Срок</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRICE_TABLE.map((row) => (
                      <tr key={row.name} className="border-t border-[#efe3d5]">
                        <th scope="row" className="px-5 py-3.5 font-semibold text-[#1b1f3b]">{row.name}</th>
                        <td className="whitespace-nowrap px-5 py-3.5 text-[#1b1f3b]">{row.start}</td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-[#1b1f3b]">{row.full}</td>
                        <td className="px-5 py-3.5 text-[#464a66]">{row.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <CityFacts
            lang="ru"
            title="Что влияет на цену сайта"
            intro="Пять вещей, из которых складывается смета. Калькулятор учитывает каждую."
            items={PRICE_PAGE.factors.map((f) => f.text)}
            labels={PRICE_PAGE.factors.map((f) => f.label)}
          />
          <HomeReviews lang="ru" />
          <FaqBlock lang="ru" items={PRICE_PAGE.faq} whatsappUrl={whatsappUrl} source="astana_price_faq" />
          <AstanaLinks current={ASTANA_PRICE_SLUG} />
        </main>
        <Contact />
        <Footer />
        <StickyWhatsApp source="city_service" message={message} />
      </div>
    </LanguageProvider>
  );
}
