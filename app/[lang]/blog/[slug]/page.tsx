import Header from "../../../components/landing/EditorialHeader";
import Footer from "../../../components/landing/Footer";
import { LanguageProvider } from "../../../contexts/LanguageContext";
import { Metadata } from "next";
import AnimatedSection from "../../../components/common/AnimatedSection";
import Link from "next/link";
import { getBlogPostBySlug, type BlogPost } from "../../../data/blog-posts";
import { notFound } from "next/navigation";
import StructuredData from "../../../components/SEO/StructuredData";
import { getAvailableBlogLangs, getBlogContentForLang, shouldIndexBlogPost } from "../../../lib/seo/blog-indexing";
import { getRelatedPosts, getRelatedServices, splitArticleHtml } from "../../../lib/blog-utils";
import { BlogAnalytics, BlogCta, BlogRelated, BlogStickyCta } from "../../../components/blog/BlogArticleExperience";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';

import { getBackendUrl } from '../../../lib/backend-config';

const BACKEND_API_URL = getBackendUrl();

async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const url = `${BACKEND_API_URL}/api/blog/posts/${slug}`;
    console.log('🌐 [Blog Post Page] Запрос к бэкенду:', url);
    
    const response = await fetch(url, {
      next: { revalidate: 60 }, // Кэшируем на 60 секунд
    });

    console.log('📥 [Blog Post Page] Ответ от бэкенда:', {
      status: response.status,
      ok: response.ok,
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      console.error('❌ [Blog Post Page] Ошибка загрузки статьи:', response.status);
      return null;
    }

    const result = await response.json();
    return result.post || null;
  } catch (error) {
    console.error('❌ [Blog Post Page] Ошибка загрузки статьи:', error);
    return process.env.NODE_ENV === 'development' ? getBlogPostBySlug(slug) ?? null : null;
  }
}

async function fetchPublishedPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/blog/posts?published=true`, { next: { revalidate: 300 } });
    if (!response.ok) return [];
    const result = await response.json();
    return (result.posts || result || []).filter((post: BlogPost) => post.published !== false);
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  try {
    // Пытаемся загрузить посты с бэкенда
    const response = await fetch(`${BACKEND_API_URL}/api/blog/posts?published=true`, {
      next: { revalidate: 3600 }, // Кэшируем на 1 час для статической генерации
    });

    let posts: BlogPost[] = [];
    if (response.ok) {
      const result = await response.json();
      posts = result.posts || [];
    }

    const params: Array<{ slug: string; lang: string }> = [];
    ['ru', 'kz'].forEach((lang) => {
      posts.forEach((post) => {
        if (shouldIndexBlogPost(post, lang)) params.push({ slug: post.slug, lang });
      });
    });
    
    return params;
  } catch (error) {
    console.error('Ошибка генерации статических параметров:', error);
    return [];
  }
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string; slug: string }> 
}): Promise<Metadata> {
  const { lang: langParam, slug } = await params;
  const lang = langParam || 'ru';
  
  const post = await fetchBlogPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Статья не найдена',
      description: 'Запрашиваемая статья не найдена',
      robots: { index: false, follow: false },
    };
  }

  const blogLang = (['ru', 'en', 'kz'].includes(lang) ? lang : 'ru') as 'ru' | 'en' | 'kz';
  const title = post.title[blogLang];
  const description = post.description[blogLang];
  const keywords = post.keywords[blogLang];
  const indexable = shouldIndexBlogPost(post, lang);
  const availableLangs = getAvailableBlogLangs(post);
  const languages = Object.fromEntries(availableLangs.map((available) => [
    available === 'kz' ? 'kk' : available,
    `${siteUrl}/${available}/blog/${slug}`,
  ]));

  return {
    title: `${title} | Aidar - Full-Stack Developer`,
    description,
    keywords,
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: true },
    alternates: {
      canonical: `${siteUrl}/${blogLang}/blog/${slug}`,
      languages,
    },
    openGraph: {
      type: 'article',
      locale: lang === 'ru' ? 'ru_RU' : lang === 'en' ? 'en_US' : 'kk_KZ',
      alternateLocale: availableLangs
        .filter((available) => available !== blogLang)
        .map((available) => available === 'ru' ? 'ru_RU' : 'kk_KZ'),
      url: `${siteUrl}/${lang}/blog/${slug}`,
      siteName: 'Aidar - Full-Stack Developer',
      title,
      description,
      publishedTime: post.date,
      authors: ['Aidar'],
      modifiedTime: post.updatedAt || post.date,
      images: [`${siteUrl}/${blogLang}/blog/${slug}/opengraph-image`],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/${blogLang}/blog/${slug}/opengraph-image`],
    },
  };
}

export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ lang: string; slug: string }> 
}) {
  const { lang: langParam, slug } = await params;
  const lang = (langParam || 'ru') as 'ru' | 'en' | 'kz';
  
  const post = await fetchBlogPostBySlug(slug);
  
  if (!post) {
    notFound();
  }

  const title = post.title[lang];
  const description = post.description[lang];
  const excerpt = post.excerpt[lang];
  const category = post.category[lang];
  const keywords = post.keywords[lang];
  const content = getBlogContentForLang(post, lang);
  if (!content) notFound();
  const [contentBeforeCta, contentAfterCta] = splitArticleHtml(content);
  const relatedPosts = getRelatedPosts(await fetchPublishedPosts(), post, lang);
  const relatedServices = getRelatedServices(post, lang);

  // Structured Data для статьи
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: `${siteUrl}/${lang}/blog/${slug}/opengraph-image`,
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    author: {
      '@type': 'Person',
      name: 'Aidar',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Aidar - Full-Stack Developer',
      url: siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/${lang}/blog/${slug}`,
    },
    keywords: keywords.join(', '),
    articleSection: category,
    wordCount: post.readingTime * 150, // Примерная оценка
    timeRequired: `PT${post.readingTime}M`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: lang === 'en' ? 'Home' : lang === 'kz' ? 'Басты' : 'Главная',
        item: `${siteUrl}/${lang}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: lang === 'en' ? 'Blog' : 'Блог',
        item: `${siteUrl}/${lang}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: `${siteUrl}/${lang}/blog/${slug}`,
      },
    ],
  };

  return (
    <LanguageProvider initialLanguage={lang}>
      <StructuredData data={articleSchema} />
      <StructuredData data={breadcrumbSchema} />
      <BlogAnalytics slug={slug} lang={lang} />
      
      <div className="min-h-screen bg-[#f7f7f5] text-slate-950">
        <Header />
        
        <article className="border-b border-slate-300 pb-20 pt-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto w-full">
              {/* Breadcrumbs */}
              <AnimatedSection animationType="fade-in" delay={0}>
                <nav className="mb-8 border-b border-slate-300 pb-5 text-xs uppercase tracking-[0.12em]" aria-label="Breadcrumb">
                  <ol className="flex items-center gap-2">
                    <li>
                      <Link 
                        href={`/${lang}`}
                        className="text-slate-500 transition-colors hover:text-blue-700"
                      >
                        {lang === 'en' ? 'Home' : lang === 'kz' ? 'Басты' : 'Главная'}
                      </Link>
                    </li>
                    <li className="text-gray-400 dark:text-gray-500">/</li>
                    <li>
                      <Link 
                        href={`/${lang}/blog`}
                        className="text-slate-500 transition-colors hover:text-blue-700"
                      >
                        {lang === 'en' ? 'Blog' : 'Блог'}
                      </Link>
                    </li>
                    <li className="text-gray-400 dark:text-gray-500">/</li>
                    <li className="truncate font-semibold text-slate-900">
                      {title}
                    </li>
                  </ol>
                </nav>
              </AnimatedSection>

              {/* Article Header */}
              <AnimatedSection animationType="slide-up" delay={50}>
                <header className="mb-12 border-b border-slate-300 pb-10">
                  <div className="mb-6">
                    <span className="inline-block border border-blue-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
                      {category}
                    </span>
                  </div>
                  <h1 className="mb-8 text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-slate-950 sm:text-5xl md:text-6xl">
                    {title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 font-mono text-xs uppercase tracking-wider text-slate-500">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString(
                        lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-US' : 'kk-KZ',
                        { year: 'numeric', month: 'long', day: 'numeric' }
                      )}
                    </time>
                    <span>•</span>
                    <span>{post.readingTime} {lang === 'ru' ? 'мин чтения' : lang === 'en' ? 'min read' : 'мин оқу'}</span>
                  </div>
                </header>
              </AnimatedSection>

              {/* Article Content */}
              <AnimatedSection animationType="fade-in" delay={100}>
                <div className="mb-16">
                  <div className="mb-10 border-l-2 border-blue-700 pl-6 text-xl leading-8 text-slate-700">
                    {excerpt}
                  </div>
                  
                  {/* Article Content */}
                  {content ? (
                    <>
                    <div
                      className="blog-content w-full max-w-full overflow-x-auto"
                      dangerouslySetInnerHTML={{ __html: contentBeforeCta }}
                      style={{ 
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        color: 'inherit'
                      }}
                    />
                    <BlogCta slug={slug} title={title} lang={lang} placement="inline" />
                    {contentAfterCta && <div className="blog-content w-full max-w-full overflow-x-auto" dangerouslySetInnerHTML={{ __html: contentAfterCta }} />}
                    </>
                  ) : (
                    <div className="space-y-4 leading-relaxed text-slate-700">
                      <p>
                        {lang === 'ru' 
                          ? 'Содержание статьи будет добавлено позже. Эта статья посвящена важной теме и содержит практические советы и рекомендации.'
                          : lang === 'en'
                          ? 'Article content will be added later. This article covers an important topic and contains practical tips and recommendations.'
                          : 'Мақала мазмұны кейінірек қосылады. Бұл мақала маңызды тақырыпты қамтиды және практикалық кеңестер мен ұсыныстарды қамтиды.'}
                      </p>
                    </div>
                  )}
                </div>
              </AnimatedSection>

              <BlogCta slug={slug} title={title} lang={lang} placement="end" />
              <BlogRelated slug={slug} title={title} lang={lang} placement="end" relatedPosts={relatedPosts} relatedServices={relatedServices} />

              {/* Back to Blog */}
              <AnimatedSection animationType="fade-in" delay={150}>
                <div className="border-t border-slate-300 pt-8">
                  <Link 
                    href={`/${lang}/blog`}
                    className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.12em] text-blue-700 transition-colors hover:text-blue-900"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    {lang === 'ru' ? 'Вернуться к блогу' : lang === 'en' ? 'Back to blog' : 'Блогқа оралу'}
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </article>

        <Footer />
        <BlogStickyCta slug={slug} title={title} lang={lang} />
      </div>
    </LanguageProvider>
  );
}

