'use client';

import { useCallback, useState } from 'react';
import Header from "../../components/landing/EditorialHeader";
import Footer from "../../components/landing/Footer";
import AnimatedSection from "../../components/common/AnimatedSection";
import Link from "next/link";
import type { BlogPost } from "../../data/blog-posts";
import BlogFilters from "../../components/blog/BlogFilters";

interface BlogPageClientProps {
  posts: BlogPost[];
  lang: 'ru' | 'en' | 'kz';
}

export default function BlogPageClient({ posts, lang }: BlogPageClientProps) {
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(posts);
  const [visibleCount, setVisibleCount] = useState(6);
  
  const handleFilteredPostsChange = useCallback((nextPosts: BlogPost[]) => {
    setFilteredPosts(nextPosts);
    setVisibleCount(6);
  }, []);
  
  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = filteredPosts.length > visibleCount;

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-slate-950">
      <Header />
      
      <main id="main-content">
      <section className="pb-20 pt-24 lg:pt-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection animationType="slide-up" delay={0}>
              <div className="grid gap-8 border-b-4 border-slate-950 py-10 md:grid-cols-12 md:items-end md:py-14">
                <div className="md:col-span-8">
                  <p className="mb-5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                    {lang === 'en' ? 'Journal / 2026' : lang === 'kz' ? 'Журнал / 2026' : 'Журнал / 2026'}
                  </p>
                  <h1 className="text-[clamp(4rem,10vw,8rem)] font-semibold leading-[0.78] tracking-[-0.07em]">
                    {lang === 'en' ? 'Blog' : lang === 'kz' ? 'Блог' : 'Блог'}
                  </h1>
                </div>
                <div className="md:col-span-4 md:border-l md:border-slate-300 md:pl-8">
                  <p className="max-w-sm text-base leading-7 text-slate-600">
                    {lang === 'en'
                    ? 'Practical notes on product development, AI, websites, and business growth.'
                    : lang === 'kz'
                    ? 'Өнім әзірлеу, AI және цифрлық сервистерді дамыту туралы практикалық жазбалар.'
                    : 'Практические материалы о разработке продуктов, AI и развитии цифровых сервисов.'}
                  </p>
                  <p className="mt-6 font-mono text-xs uppercase tracking-wider text-slate-500">
                    {String(posts.length).padStart(2, '0')} {lang === 'en' ? 'articles' : lang === 'kz' ? 'мақала' : 'материалов'}
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animationType="fade-in" delay={50}>
              <BlogFilters posts={posts} lang={lang} onFilteredPostsChange={handleFilteredPostsChange} />
            </AnimatedSection>

            {/* Blog Posts Grid */}
            {visiblePosts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 border-l border-t border-slate-300 md:grid-cols-2 lg:grid-cols-3">
                  {visiblePosts.map((post: BlogPost, index: number) => (
                  <AnimatedSection key={post.id} animationType="slide-up" delay={index * 50}>
                    <Link href={`/${lang}/blog/${post.slug}`}>
                      <article className="group flex h-full min-h-80 cursor-pointer flex-col border-b border-r border-slate-300 bg-white p-7 transition-colors hover:bg-blue-50/50">
                        <div className="mb-4">
                          <span className="inline-block border border-blue-700 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
                            {post.category[lang]}
                          </span>
                        </div>
                        <h2 className="mb-3 text-2xl font-semibold tracking-[-0.025em] text-slate-950 transition-colors group-hover:text-blue-700">
                          {post.title[lang]}
                        </h2>
                        <p className="mb-6 flex-grow text-sm leading-6 text-slate-600">
                          {post.excerpt[lang]}
                        </p>
                        <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-slate-500">
                          <span>{new Date(post.date).toLocaleDateString(lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-US' : 'kk-KZ', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                          <span>{post.readingTime} {lang === 'ru' ? 'мин' : lang === 'en' ? 'min' : 'мин'} {lang === 'ru' ? 'чтения' : lang === 'en' ? 'read' : 'оқу'}</span>
                        </div>
                      </article>
                    </Link>
                  </AnimatedSection>
                ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <AnimatedSection animationType="fade-in" delay={100}>
                    <div className="text-center mt-12">
                      <button
                        onClick={() => setVisibleCount(prev => prev + 6)}
                        className="border border-blue-700 bg-blue-700 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-800"
                      >
                        {lang === 'ru' 
                          ? 'Загрузить больше'
                          : lang === 'en'
                          ? 'Load more'
                          : 'Көбірек жүктеу'}
                      </button>
                    </div>
                  </AnimatedSection>
                )}
              </>
            ) : (
              <AnimatedSection animationType="fade-in" delay={100}>
                <div className="text-center py-20">
                  <div className="max-w-2xl mx-auto">
                    {posts.length === 0 ? (
                      <p className="text-xl text-gray-600 dark:text-gray-400 font-light mb-8">
                        {lang === 'en'
                          ? 'Blog posts are coming soon. Stay tuned!'
                          : lang === 'kz'
                          ? 'Блог мақалалары жақында шығады. Күте тұрыңыз!'
                          : 'Статьи блога скоро появятся. Следите за обновлениями!'}
                      </p>
                    ) : (
                      <>
                        <p className="text-xl text-gray-600 dark:text-gray-400 font-light mb-4">
                          {lang === 'en'
                            ? 'No articles found'
                            : lang === 'kz'
                            ? 'Мақалалар табылмады'
                            : 'Статьи не найдены'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 font-light">
                          {lang === 'en'
                            ? 'Try changing your search query or select another category'
                            : lang === 'kz'
                            ? 'Іздеу сұрауын өзгертіп немесе басқа категорияны таңдап көріңіз'
                            : 'Попробуйте изменить поисковый запрос или выбрать другую категорию'}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            )}
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}

