'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import Breadcrumbs from '@/app/components/dashboard/Breadcrumbs';
import { formatBlogAutoGenerateSchedule, getNextBlogAutoGenerateAt } from '@/app/lib/blog-cron-schedule';
import {
  GSC_KPI_TARGETS,
  GSC_PRIORITY_CLUSTERS,
  getUnderperformingServicePages,
} from '@/app/lib/seo/gsc-priorities';

interface BlogPost {
  id: string;
  slug: string;
  title: {
    ru: string;
    en: string;
    kz: string;
  };
  description: {
    ru: string;
    en: string;
    kz: string;
  };
  excerpt: {
    ru: string;
    en: string;
    kz: string;
  };
  category: {
    ru: string;
    en: string;
    kz: string;
  };
  date: string;
  keywords: {
    ru: string[];
    en: string[];
    kz: string[];
  };
  readingTime: number;
  published: boolean;
  content?: {
    ru: string;
    en: string;
    kz: string;
  };
}

export default function BlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterPublished, setFilterPublished] = useState<boolean | null>(null);
  const [generating, setGenerating] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    fetchPosts();
  }, [filterPublished]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const schedule = useMemo(() => {
    const nextAt = getNextBlogAutoGenerateAt(now);
    return formatBlogAutoGenerateSchedule(nextAt, now);
  }, [now]);

  const underperformingPages = useMemo(() => getUnderperformingServicePages(), []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filterPublished !== null) {
        params.append('published', filterPublished.toString());
      }

      const response = await fetch(`/api/blog/posts?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки статей');
      }

      const result = await response.json();
      
      if (result.posts) {
        setPosts(result.posts);
      } else {
        setPosts([]);
      }
    } catch (error: unknown) {
      console.error('Ошибка загрузки статей:', error);
      setError(error instanceof Error ? error.message : 'Не удалось загрузить статьи');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту статью?')) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/posts/${slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Ошибка удаления статьи');
      }

      // Обновляем список
      fetchPosts();
    } catch (error: unknown) {
      console.error('Ошибка удаления:', error);
      alert('Не удалось удалить статью: ' + (error instanceof Error ? error.message : 'неизвестная ошибка'));
    }
  };

  const handleGenerateAuto = async () => {
    if (!confirm('Сгенерировать новую статью автоматически? Тема будет выбрана AI. Это может занять 1–2 минуты.')) {
      return;
    }

    try {
      setGenerating(true);
      const response = await fetch('/api/blog/generate/auto?autoSave=true', {
        method: 'POST',
      });
      const result = await response.json().catch(() => ({}));

      if (response.status === 401) {
        alert('Сессия истекла. Войдите снова через /admin/login');
        router.push('/admin/login');
        return;
      }

      if (!response.ok) {
        const details = Array.isArray(result.details)
          ? `\n\n${result.details.join('\n')}`
          : Array.isArray(result.errors)
            ? `\n\n${result.errors.join('\n')}`
            : '';
        throw new Error((result.error || result.message || 'Ошибка генерации статьи') + details);
      }
      
      if (result.success && result.post) {
        alert('Статья успешно сгенерирована и опубликована!');
        fetchPosts();
        router.push(`/admin/blog/${result.post.slug}`);
      } else {
        throw new Error(result.message || 'Статья не была сохранена');
      }
    } catch (error: unknown) {
      console.error('Ошибка генерации:', error);
      alert('Не удалось сгенерировать статью: ' + (error instanceof Error ? error.message : 'неизвестная ошибка'));
    } finally {
      setGenerating(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        post.title.ru.toLowerCase().includes(searchLower) ||
        post.title.en.toLowerCase().includes(searchLower) ||
        post.title.kz.toLowerCase().includes(searchLower) ||
        post.slug.toLowerCase().includes(searchLower) ||
        post.category.ru.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <DashboardLayout
      userRole="admin"
      userName="Aidar"
      userEmail="aidar1910main@gmail.com"
    >
      <Breadcrumbs items={[
        { label: 'Главная', path: '/' },
        { label: 'Панель управления', path: '/admin/dashboard' },
        { label: 'Блог' }
      ]} />

      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-light tracking-wide text-gray-900 dark:text-gray-100 mb-2">
              Управление блогом
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-light">
              Создание, редактирование и управление статьями блога
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleGenerateAuto}
              disabled={generating}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all font-light disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {generating ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Генерация...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  AI Генерация
                </>
              )}
            </button>
            <button
              onClick={() => router.push('/admin/blog/new')}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-light flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Новая статья
            </button>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-violet-200/80 bg-gradient-to-r from-violet-50 to-blue-50 p-4 dark:border-violet-900/50 dark:from-violet-950/40 dark:to-blue-950/30">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-violet-700 dark:text-violet-300">
                Автогенерация
              </p>
              <p className="mt-1 text-base font-medium text-gray-900 dark:text-gray-100">
                Следующий запуск: {schedule.almatyLabel}
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {schedule.relative} · {schedule.utcLabel}
              </p>
            </div>
            <div className="rounded-lg border border-violet-200 bg-white/80 px-3 py-2 text-sm text-gray-700 dark:border-violet-800 dark:bg-gray-900/60 dark:text-gray-300">
              {schedule.weeklyNote}
              <div className="mt-1 text-xs text-gray-500">3 статьи в неделю · RU + KZ</div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-amber-200/80 bg-amber-50/80 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-amber-800 dark:text-amber-300">
            SEO приоритеты (Search Console)
          </p>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Цель: {GSC_KPI_TARGETS.nonBrandedClicksPerMonth}+ небрендовых кликов/мес · CTR услуг {GSC_KPI_TARGETS.servicePagesCtrPercent}%+
          </p>
          <ul className="mt-3 grid gap-2 text-sm text-gray-800 dark:text-gray-200 sm:grid-cols-2">
            {GSC_PRIORITY_CLUSTERS.map((cluster) => (
              <li key={cluster.id} className="rounded-lg border border-amber-200/60 bg-white/70 px-3 py-2 dark:border-amber-900/30 dark:bg-gray-900/40">
                <span className="font-medium">{cluster.queries[0]}</span>
                <span className="text-gray-500"> → /ru/services/{cluster.service}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">
            Слабые страницы: {underperformingPages.map((p) => p.path.replace('/ru/services/', '')).join(', ')}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl p-5 mb-6 border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Поиск
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск по заголовку, slug, категории..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-light focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Статус публикации
            </label>
            <select
              value={filterPublished === null ? '' : filterPublished ? 'true' : 'false'}
              onChange={(e) => {
                const value = e.target.value;
                setFilterPublished(value === '' ? null : value === 'true');
              }}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-light focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Все статьи</option>
              <option value="true">Опубликованные</option>
              <option value="false">Черновики</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
          <p className="text-red-800 dark:text-red-300 font-light">{error}</p>
        </div>
      )}

      {/* Posts List */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={`skeleton-${index}`} className="animate-pulse">
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 dark:text-gray-400 font-light mb-2 text-lg">Статьи не найдены</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 font-light mb-4">
              {search || filterPublished !== null
                ? 'Попробуйте изменить фильтры'
                : 'Создайте первую статью или сгенерируйте её с помощью AI'}
            </p>
            <button
              onClick={() => router.push('/admin/blog/new')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-light"
            >
              Создать статью
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <h3 className="text-lg font-light text-gray-900 dark:text-gray-100">
                        {post.title.ru}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        post.published
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                      }`}>
                        {post.published ? 'Опубликовано' : 'Черновик'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                      {post.excerpt.ru}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded">
                        {post.category.ru}
                      </span>
                      <span>Slug: {post.slug}</span>
                      <span>Дата: {formatDate(post.date)}</span>
                      <span>Время чтения: {post.readingTime} мин</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/admin/blog/${post.slug}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-light text-sm"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleDelete(post.slug)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-light text-sm"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

