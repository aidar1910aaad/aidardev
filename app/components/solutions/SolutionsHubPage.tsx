// Общая страница раздела (/ru/solutions) и страница производства (/ru/solutions/industry): один шаблон,
// разные тексты и набор групп.
import Contact from '../landing/ConversionContact';
import Header from '../landing/EditorialHeader';
import Footer from '../landing/Footer';
import StickyWhatsApp from '../landing/StickyWhatsApp';
import StructuredDataServer from '../SEO/StructuredDataServer';
import { FaqBlock } from '../service-page/ServiceFaqSection';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { SOLUTIONS, WORK_TERMS, type SolutionGroup, type SolutionsHubText } from '../../data/solutions';
import { createBreadcrumbSchema, createFAQSchema, createItemListSchema } from '../../lib/schemas';
import { buildWhatsAppUrl } from '../../lib/whatsapp';
import { Check } from '../brand/icons';
import { container, Kicker, sectionY, SectionTitle } from '../home/shared';
import { HubHero, SolutionGroups, solutionPath } from './SolutionBlocks';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';

export default function SolutionsHubPage({
  hub,
  groups,
  parent,
  source,
}: {
  hub: SolutionsHubText;
  /** Какие группы решений показать; у страницы производства одна группа с «что болит» на карточках */
  groups: SolutionGroup[];
  /** Родительская страница в крошках (у производства это общая страница) */
  parent?: SolutionsHubText;
  source: string;
}) {
  const whatsappMessage = `Здравствуйте! Пишу со страницы «${hub.crumb}». Хочу обсудить задачу.`;
  const whatsappUrl = buildWhatsAppUrl(whatsappMessage, { sourcePath: hub.path });
  const faq = hub.faq.map((item) => ({ question: item.q, answer: item.a }));
  const listed = SOLUTIONS.filter((s) => groups.includes(s.group));
  // На странице производства у карточек сверху строка «что болит»
  const industryOnly = groups.every((group) => group === 'industry' || group === 'sectors');

  const crumbs = [
    { name: 'Главная', href: '/ru' },
    ...(parent ? [{ name: parent.crumb, href: parent.path }] : []),
    { name: hub.crumb },
  ];

  return (
    <LanguageProvider initialLanguage="ru">
      <StructuredDataServer
        id={`${source}-list`}
        data={createItemListSchema(listed.map((s) => ({ name: s.title, url: `${siteUrl}${solutionPath(s.slug)}` })))}
      />
      <StructuredDataServer id={`${source}-faq`} data={createFAQSchema(faq)} />
      <StructuredDataServer
        id={`${source}-bc`}
        data={createBreadcrumbSchema(crumbs.map((crumb) => ({ name: crumb.name, url: `${siteUrl}${crumb.href ?? hub.path}` })))}
      />

      <div className="page-with-action-bar min-h-screen bg-white text-[#1b1f3b]">
        <Header />
        <main id="main-content">
          <HubHero hub={hub} crumbs={crumbs} whatsappUrl={whatsappUrl} source={source} />

          <section className="bg-white">
            <div className={`${container} ${sectionY}`}>
              <div className="flex max-w-[780px] flex-col gap-3 lg:gap-4">
                <Kicker>{industryOnly ? 'Что болит и как решаем' : 'Решения'}</Kicker>
                <SectionTitle className="text-[#1b1f3b]">
                  {industryOnly ? 'Решения по отраслям и задачам' : 'Что мы делаем на заказ'}
                </SectionTitle>
              </div>
              <div className="mt-6 lg:mt-12">
                <SolutionGroups groups={groups} showPain={industryOnly} linkToIndustry={!industryOnly} />
              </div>
            </div>
          </section>

          <section className="bg-[#fff7ef]">
            <div className={`${container} py-14 lg:py-20`}>
              <SectionTitle className="text-[#1b1f3b]">Как работаем</SectionTitle>
              <ul className="mt-6 grid gap-3 md:grid-cols-2 md:gap-x-8 md:gap-y-3.5 lg:mt-10">
                {WORK_TERMS.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[15px] font-medium text-[#1b1f3b] md:gap-3 md:text-base">
                    <span className="mt-px grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-[#b4232c] text-white">
                      <Check className="h-[13px] w-[13px]" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <FaqBlock lang="ru" items={faq} whatsappUrl={whatsappUrl} source={`${source}_faq`} />
        </main>
        <Contact />
        <Footer />
        <StickyWhatsApp source={source} message={whatsappMessage} />
      </div>
    </LanguageProvider>
  );
}
