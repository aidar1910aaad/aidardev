import { LanguageProvider } from "../../contexts/LanguageContext";
import { Metadata } from "next";
import BlogPageClient from "./BlogPageClient";
import { hasBlogContentForLang } from "../../lib/seo/blog-indexing";
import { fetchPublishedBlogPosts } from "../../lib/blog-cache";
import { toBlogPostCard } from "../../lib/blog-utils";

// Список обновляется вебхуком бэкенда (тег blog-posts); срок — страховка на неделю.
export const revalidate = 604800;
// Язык — только ru/en/kz из generateStaticParams в [lang]/layout: прочее сразу 404 без рендера.
export const dynamicParams = false;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = langParam || 'ru';
  
  const titles = {
    en: 'Blog | Web Development Articles, Tips and Guides',
    ru: 'Блог | Статьи о веб-разработке, советы и гайды',
    kz: 'Блог | Веб-дамыту туралы мақалалар, кеңестер және нұсқаулар',
  };
  
  const descriptions = {
    en: 'Articles from the aidardev studio about web development, AI, mobile apps and best practices for businesses in Kazakhstan.',
    ru: 'Статьи студии aidardev о веб-разработке, AI, мобильных приложениях и лучших практиках — советы для бизнеса в Казахстане.',
    kz: 'aidardev студиясының веб-әзірлеу, AI, мобильді қосымшалар және үздік тәжірибелер туралы мақалалары — Қазақстандағы бизнеске кеңестер.',
  };

  return {
    title: titles[lang as keyof typeof titles] || titles.ru,
    description: descriptions[lang as keyof typeof descriptions] || descriptions.ru,
    robots: lang === 'en' ? { index: false, follow: true } : { index: true, follow: true },
    alternates: {
      canonical: `${siteUrl}/${lang}/blog`,
      languages: lang === 'en' ? undefined : {
        'ru': `${siteUrl}/ru/blog`,
        'kk': `${siteUrl}/kz/blog`,
      },
      types: lang === 'ru' || lang === 'kz'
        ? { 'application/rss+xml': `${siteUrl}/${lang}/blog/rss.xml` }
        : undefined,
    },
    openGraph: {
      type: 'website',
      locale: lang === 'ru' ? 'ru_RU' : lang === 'en' ? 'en_US' : 'kk_KZ',
      alternateLocale: ['ru_RU', 'en_US', 'kk_KZ'],
      url: `${siteUrl}/${lang}/blog`,
      siteName: 'aidardev',
      title: titles[lang as keyof typeof titles] || titles.ru,
      description: descriptions[lang as keyof typeof descriptions] || descriptions.ru,
    },
  };
}

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params;
  const lang = (langParam || 'ru') as 'ru' | 'en' | 'kz';

  // В клиент уходят только карточки текущего языка: без HTML статей и других языков.
  const blogPosts = (await fetchPublishedBlogPosts())
    .filter((post) => hasBlogContentForLang(post, lang))
    .map((post) => toBlogPostCard(post, lang));

  return (
    <LanguageProvider initialLanguage={lang as 'ru' | 'en' | 'kz'}>
      <BlogPageClient posts={blogPosts} lang={lang} />
    </LanguageProvider>
  );
}
