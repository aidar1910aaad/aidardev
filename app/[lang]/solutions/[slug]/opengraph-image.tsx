import { notFound } from 'next/navigation';
import { SOLUTIONS, solutionBySlug } from '@/app/data/solutions';
import { renderOgImage } from '@/app/lib/og-image';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'aidardev';

// Раздел только на русском: картинки собираются при сборке для каждого решения.
export function generateStaticParams() {
  return SOLUTIONS.map((solution) => ({ lang: 'ru', slug: solution.slug }));
}

export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { slug } = await params;
  const solution = solutionBySlug(slug);
  if (!solution) notFound();
  return renderOgImage({ eyebrow: 'Сложная разработка', title: solution.title, lang: 'ru', path: `aidardev.kz/ru/solutions/${slug}` });
}
