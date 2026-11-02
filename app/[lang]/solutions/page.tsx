import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import SolutionsHubPage from '../../components/solutions/SolutionsHubPage';
import { SOLUTIONS_HUB } from '../../data/solutions';
import { fitTitle } from '../../lib/seo/title';

// Раздел только на русском: /en/solutions и /kz/solutions отдают 404.
export const dynamicParams = false;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  if ((await params).lang !== 'ru') notFound();
  const url = `${siteUrl}${SOLUTIONS_HUB.path}`;
  return {
    title: fitTitle(SOLUTIONS_HUB.metaTitle),
    description: SOLUTIONS_HUB.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      url,
      siteName: 'aidardev',
      title: SOLUTIONS_HUB.metaTitle,
      description: SOLUTIONS_HUB.metaDescription,
    },
  };
}

export default async function SolutionsPage({ params }: { params: Promise<{ lang: string }> }) {
  if ((await params).lang !== 'ru') notFound();
  return (
    <SolutionsHubPage hub={SOLUTIONS_HUB} groups={['sectors', 'industry', 'logistics', 'sales', 'public']} source="solutions" />
  );
}
