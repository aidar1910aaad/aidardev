import { LanguageProvider } from "../../contexts/LanguageContext";
import { Metadata } from "next";
import { getAllBlogPosts, type BlogPost } from "../../data/blog-posts";
import BlogPageClient from "./BlogPageClient";
import { hasBlogContentForLang } from "../../lib/seo/blog-indexing";

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
    en: 'Read articles about web development, AI, mobile apps, best practices and tips from a professional Full-Stack developer in Kazakhstan.',
    ru: 'Читайте статьи о веб-разработке, AI, мобильных приложениях, лучших практиках и советах от профессионального Full-Stack разработчика в Казахстане.',
    kz: 'Веб-дамыту, AI, мобильді қосымшалар, ең жақсы тәжірибелер және Қазақстандағы кәсіби Full-Stack әзірлеушінің кеңестері туралы мақалаларды оқыңыз.',
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
      siteName: 'Aidar - Full-Stack Developer',
      title: titles[lang as keyof typeof titles] || titles.ru,
      description: descriptions[lang as keyof typeof descriptions] || descriptions.ru,
    },
  };
}

import { getBackendUrl } from '../../lib/backend-config';

const BACKEND_API_URL = getBackendUrl();

async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const url = `${BACKEND_API_URL}/api/blog/posts?published=true`;
    console.log('🌐 [Blog Page] Запрос к бэкенду:', url);
    
    const response = await fetch(url, {
      next: { revalidate: 60 }, // Кэшируем на 60 секунд
    });

    console.log('📥 [Blog Page] Ответ от бэкенда:', {
      status: response.status,
      ok: response.ok,
      url: response.url,
    });

    if (!response.ok) {
      console.error('❌ [Blog Page] Ошибка загрузки статей:', response.status, response.statusText);
      return process.env.NODE_ENV === 'development' ? getAllBlogPosts() : [];
    }

    const result = await response.json();
    const posts = result.posts || result || [];
    
    return posts.filter((post: BlogPost) => post.published !== false);
  } catch (error) {
    console.error('Ошибка загрузки статей:', error);
    return process.env.NODE_ENV === 'development' ? getAllBlogPosts() : [];
  }
}

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params;
  const lang = (langParam || 'ru') as 'ru' | 'en' | 'kz';

  const blogPosts = (await fetchBlogPosts()).filter((post) => hasBlogContentForLang(post, lang));

  return (
    <LanguageProvider initialLanguage={lang as 'ru' | 'en' | 'kz'}>
      <BlogPageClient posts={blogPosts} lang={lang} />
    </LanguageProvider>
  );
}
