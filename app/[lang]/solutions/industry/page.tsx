import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import SolutionsHubPage from '../../../components/solutions/SolutionsHubPage';
import { INDUSTRY_HUB, SOLUTIONS_HUB } from '../../../data/solutions';
import { fitTitle } from '../../../lib/seo/title';

// Раздел только на русском: /en/solutions/industry и /kz/solutions/industry отдают 404.
export const dynamicParams = false;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  if ((await params).lang !== 'ru') notFound();
  const url = `${siteUrl}${INDUSTRY_HUB.path}`;
  return {
    title: fitTitle(INDUSTRY_HUB.metaTitle),
    description: INDUSTRY_HUB.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      url,
      siteName: 'aidardev',
      title: INDUSTRY_HUB.metaTitle,
      description: INDUSTRY_HUB.metaDescription,
    },
  };
}

/** Промышленность: заводы, производства и нефтегаз (Айдар, 02.11.2026: «ориентироваться под промышленность»). */
export default async function IndustrySolutionsPage({ params }: { params: Promise<{ lang: string }> }) {
  if ((await params).lang !== 'ru') notFound();
  return (
    <SolutionsHubPage hub={INDUSTRY_HUB} groups={['sectors', 'industry']} parent={SOLUTIONS_HUB} source="solutions_industry" />
  );
}
