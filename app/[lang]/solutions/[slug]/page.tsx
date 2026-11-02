import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fitTitle } from '../../../lib/seo/title';
import Contact from '../../../components/landing/ConversionContact';
import Header from '../../../components/landing/EditorialHeader';
import Footer from '../../../components/landing/Footer';
import StickyWhatsApp from '../../../components/landing/StickyWhatsApp';
import StructuredDataServer from '../../../components/SEO/StructuredDataServer';
import { FaqBlock } from '../../../components/service-page/ServiceFaqSection';
import {
  SolutionAI,
  SolutionCases,
  SolutionCompare,
  SolutionFeatures,
  SolutionGlossary,
  SolutionHero,
  SolutionPilot,
  SolutionPrices,
  SolutionRelated,
  SolutionRoi,
  SolutionScenarios,
  SolutionSteps,
  SolutionTech,
} from '../../../components/solutions/SolutionBlocks';
import { LanguageProvider } from '../../../contexts/LanguageContext';
import { INDUSTRY_HUB, SOLUTIONS, SOLUTIONS_HUB, isIndustrySolution, solutionBySlug } from '../../../data/solutions';
import { createBreadcrumbSchema, createDefinedTermSetSchema, createFAQSchema, createHowToSchema, createSolutionSchema } from '../../../lib/schemas';
import { buildWhatsAppUrl } from '../../../lib/whatsapp';

// Раздел только на русском: страницы есть лишь у пар ru × решение, остальное 404 без рендера.
export const dynamicParams = false;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';

export function generateStaticParams() {
  return SOLUTIONS.map((solution) => ({ lang: 'ru', slug: solution.slug }));
}

async function resolve(params: Promise<{ lang: string; slug: string }>) {
  const { lang, slug } = await params;
  const solution = solutionBySlug(slug);
  if (lang !== 'ru' || !solution) notFound();
  return solution;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const solution = await resolve(params);
  const url = `${siteUrl}/ru/solutions/${solution.slug}`;
  return {
    title: fitTitle(solution.metaTitle),
    description: solution.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      url,
      siteName: 'aidardev',
      title: solution.metaTitle,
      description: solution.metaDescription,
    },
  };
}

/** Страница решения: ответ на запрос «кто сделает систему X и сколько стоит». */
export default async function SolutionPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const solution = await resolve(params);
  const path = `/ru/solutions/${solution.slug}`;
  const url = `${siteUrl}${path}`;
  const whatsappMessage = `Здравствуйте! Пишу со страницы «${solution.short}». Хочу обсудить задачу.`;
  const whatsappUrl = buildWhatsAppUrl(whatsappMessage, { sourcePath: path });
  const faq = solution.faq.map((item) => ({ question: item.q, answer: item.a }));

  const crumbs = [
    { name: 'Главная', href: '/ru' },
    { name: SOLUTIONS_HUB.crumb, href: SOLUTIONS_HUB.path },
    ...(isIndustrySolution(solution) ? [{ name: INDUSTRY_HUB.crumb, href: INDUSTRY_HUB.path }] : []),
    { name: solution.short },
  ];

  return (
    <LanguageProvider initialLanguage="ru">
      <StructuredDataServer
        id={`solution-${solution.slug}`}
        data={createSolutionSchema({
          name: solution.title,
          category: solution.short,
          description: solution.metaDescription,
          url,
          priceFrom: solution.priceFrom,
        })}
      />
      <StructuredDataServer id={`solution-faq-${solution.slug}`} data={createFAQSchema(faq)} />
      {solution.steps && (
        <StructuredDataServer
          id={`solution-howto-${solution.slug}`}
          data={createHowToSchema({ name: `Как работает: ${solution.short}`, description: solution.metaDescription, url, steps: solution.steps })}
        />
      )}
      {solution.glossary && (
        <StructuredDataServer
          id={`solution-terms-${solution.slug}`}
          data={createDefinedTermSetSchema({ name: `Термины: ${solution.short}`, url, terms: solution.glossary })}
        />
      )}
      <StructuredDataServer
        id={`solution-bc-${solution.slug}`}
        data={createBreadcrumbSchema(
          crumbs.map((crumb) => ({ name: crumb.name, url: `${siteUrl}${'href' in crumb && crumb.href ? crumb.href : path}` })),
        )}
      />

      <div className="page-with-action-bar min-h-screen bg-white text-[#1b1f3b]">
        <Header />
        <main id="main-content">
          <SolutionHero solution={solution} crumbs={crumbs} whatsappUrl={whatsappUrl} />
          <SolutionSteps solution={solution} />
          <SolutionScenarios solution={solution} />
          <SolutionFeatures solution={solution} />
          <SolutionTech solution={solution} />
          <SolutionAI solution={solution} />
          <SolutionPilot solution={solution} />
          <SolutionCompare solution={solution} />
          <SolutionRoi solution={solution} />
          <SolutionPrices solution={solution} />
          <SolutionCases solution={solution} />
          <SolutionGlossary solution={solution} />
          <FaqBlock lang="ru" items={faq} whatsappUrl={whatsappUrl} source={`solution_${solution.slug}_faq`} />
          <SolutionRelated solution={solution} />
        </main>
        <Contact />
        <Footer />
        <StickyWhatsApp source={`solution_${solution.slug}`} message={whatsappMessage} />
      </div>
    </LanguageProvider>
  );
}
