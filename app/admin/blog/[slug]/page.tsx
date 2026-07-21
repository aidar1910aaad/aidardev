'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import Breadcrumbs from '@/app/components/dashboard/Breadcrumbs';
import BlogAdminPreview from '@/app/components/blog/BlogAdminPreview';

interface BlogPost {
  id: string;
  slug: string;
  title: { ru: string; en: string; kz: string };
  description: { ru: string; en: string; kz: string };
  excerpt: { ru: string; en: string; kz: string };
  category: { ru: string; en: string; kz: string };
  date: string;
  keywords: { ru: string[]; en: string[]; kz: string[] };
  readingTime: number;
  published: boolean;
  content: { ru: string; en: string; kz: string };
}

type Lang = 'ru' | 'en' | 'kz';
type ViewMode = 'edit' | 'split' | 'preview';

function wrapSelection(
  value: string,
  start: number,
  end: number,
  open: string,
  close: string,
) {
  return {
    next: value.slice(0, start) + open + value.slice(start, end) + close + value.slice(end),
    selectionStart: start + open.length,
    selectionEnd: end + open.length,
  };
}

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<Lang>('ru');
  const [viewMode, setViewMode] = useState<ViewMode>('edit');

  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: { ru: '', en: '', kz: '' },
    description: { ru: '', en: '', kz: '' },
    excerpt: { ru: '', en: '', kz: '' },
    category: { ru: '', en: '', kz: '' },
    keywords: { ru: [], en: [], kz: [] },
    content: { ru: '', en: '', kz: '' },
    date: new Date().toISOString().split('T')[0],
    readingTime: 5,
    published: false,
  });

  useEffect(() => {
    if (!slug) return;
    void fetchPost();
  }, [slug]);

  useEffect(() => {
    if (window.matchMedia('(min-width: 1024px)').matches) {
      setViewMode('split');
    }
  }, []);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/blog/posts/${slug}`);
      if (!response.ok) {
        throw new Error(response.status === 404 ? 'Статья не найдена' : 'Ошибка загрузки статьи');
      }
      const result = await response.json();
      if (result.post) {
        setPost(result.post);
        setFormData({
          title: result.post.title,
          description: result.post.description,
          excerpt: result.post.excerpt,
          category: result.post.category,
          keywords: result.post.keywords,
          content: result.post.content || { ru: '', en: '', kz: '' },
          date: result.post.date,
          readingTime: result.post.readingTime,
          published: result.post.published,
        });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить статью');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const title = formData.title || { ru: '', en: '', kz: '' };
      const description = formData.description || { ru: '', en: '', kz: '' };
      const excerpt = formData.excerpt || { ru: '', en: '', kz: '' };
      const category = formData.category || { ru: '', en: '', kz: '' };
      const content = formData.content || { ru: '', en: '', kz: '' };
      const keywords = formData.keywords || { ru: [], en: [], kz: [] };

      // Backend historically required non-empty EN; RU/KZ posts leave EN blank.
      const payload = {
        ...formData,
        slug: formData.slug || slug,
        title: { ...title, en: title.en?.trim() || title.ru || 'Untitled' },
        description: { ...description, en: description.en?.trim() || description.ru || title.ru || 'Description' },
        excerpt: { ...excerpt, en: excerpt.en?.trim() || excerpt.ru || description.ru || title.ru || 'Excerpt' },
        category: { ...category, en: category.en?.trim() || category.ru || 'General' },
        content: { ...content, en: content.en?.trim() || content.ru || '<p></p>' },
        keywords: {
          ru: keywords.ru || [],
          kz: keywords.kz || [],
          en: keywords.en?.length ? keywords.en : keywords.ru?.length ? keywords.ru : ['blog'],
        },
      };

      const response = await fetch(`/api/blog/posts/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || result.message || 'Ошибка сохранения статьи');
      }
      if (result.post) {
        setPost(result.post);
        setFormData({
          title: result.post.title,
          description: result.post.description,
          excerpt: result.post.excerpt,
          category: result.post.category,
          keywords: result.post.keywords,
          content: result.post.content || { ru: '', en: '', kz: '' },
          date: result.post.date,
          readingTime: result.post.readingTime,
          published: result.post.published,
        });
        setSavedAt(new Date().toLocaleTimeString('ru-RU'));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Не удалось сохранить статью');
    } finally {
      setSaving(false);
    }
  };

  const updateLocalized = (
    field: 'title' | 'description' | 'excerpt' | 'category' | 'content',
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...(prev[field] as Record<Lang, string>), [activeLanguage]: value },
    }));
  };

  const applyTag = (open: string, close: string) => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement | null;
    if (!textarea) return;
    const current = formData.content?.[activeLanguage] || '';
    const { next, selectionStart, selectionEnd } = wrapSelection(
      current,
      textarea.selectionStart,
      textarea.selectionEnd,
      open,
      close,
    );
    updateLocalized('content', next);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(selectionStart, selectionEnd);
    });
  };

  const previewLang = activeLanguage === 'en' ? 'ru' : activeLanguage;
  const siteUrl =
    activeLanguage === 'en'
      ? `/${previewLang}/blog/${slug}`
      : `/${activeLanguage}/blog/${slug}`;

  if (loading) {
    return (
      <DashboardLayout userRole="admin" userName="Aidar" userEmail="aidar1910main@gmail.com">
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="font-light text-gray-600 dark:text-gray-400">Загрузка статьи...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !post) {
    return (
      <DashboardLayout userRole="admin" userName="Aidar" userEmail="aidar1910main@gmail.com">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
          <p className="mb-4 font-light text-red-800 dark:text-red-300">{error}</p>
          <button onClick={() => router.push('/admin/blog')} className="rounded-lg bg-blue-600 px-4 py-2 text-white">
            К списку
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const showEditor = viewMode === 'edit' || viewMode === 'split';
  const showPreview = viewMode === 'preview' || viewMode === 'split';

  return (
    <DashboardLayout userRole="admin" userName="Aidar" userEmail="aidar1910main@gmail.com">
      <Breadcrumbs
        items={[
          { label: 'Главная', path: '/' },
          { label: 'Панель управления', path: '/admin/dashboard' },
          { label: 'Блог', path: '/admin/blog' },
          { label: post?.title.ru || 'Редактирование' },
        ]}
      />

      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-2xl font-light tracking-wide text-gray-900 dark:text-gray-100 sm:text-3xl">
            Редактирование статьи
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Slug: <span className="font-mono">{slug}</span>
            {savedAt ? <span className="ml-3 text-green-700">Сохранено в {savedAt}</span> : null}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-light text-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Открыть на сайте
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-light text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex rounded-xl border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-gray-900">
          {([
            ['edit', 'Редактор'],
            ['split', 'Редактор + сайт'],
            ['preview', 'Как на сайте'],
          ] as const).map(([mode, label]) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`rounded-lg px-3 py-2 text-sm font-light transition-all ${
                viewMode === mode
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex rounded-xl border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-gray-900">
          {(['ru', 'kz', 'en'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLanguage(lang)}
              className={`rounded-lg px-3 py-2 text-sm font-light transition-all ${
                activeLanguage === lang
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
        <label className="ml-auto flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={Boolean(formData.published)}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          Опубликовано
        </label>
      </div>

      <div className={`gap-5 ${showEditor && showPreview ? 'lg:grid lg:grid-cols-2' : 'grid grid-cols-1'}`}>
        {showEditor ? (
          <div className="space-y-4">
            <section className="rounded-xl border border-gray-200/50 bg-white/70 p-5 shadow-sm dark:border-gray-800/50 dark:bg-gray-900/70">
              <h3 className="mb-4 text-lg font-light text-gray-900 dark:text-gray-100">
                Мета · {activeLanguage.toUpperCase()}
              </h3>
              <div className="space-y-3">
                <label className="block text-sm">
                  <span className="mb-1 block text-gray-600 dark:text-gray-400">Заголовок</span>
                  <input
                    value={formData.title?.[activeLanguage] || ''}
                    onChange={(e) => updateLocalized('title', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-gray-600 dark:text-gray-400">
                    SEO-описание · {formData.description?.[activeLanguage]?.length || 0} симв.
                  </span>
                  <textarea
                    value={formData.description?.[activeLanguage] || ''}
                    onChange={(e) => updateLocalized('description', e.target.value)}
                    rows={2}
                    className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-gray-600 dark:text-gray-400">Краткое описание (лид)</span>
                  <textarea
                    value={formData.excerpt?.[activeLanguage] || ''}
                    onChange={(e) => updateLocalized('excerpt', e.target.value)}
                    rows={2}
                    className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800"
                  />
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <label className="block text-sm">
                    <span className="mb-1 block text-gray-600 dark:text-gray-400">Категория</span>
                    <input
                      value={formData.category?.[activeLanguage] || ''}
                      onChange={(e) => updateLocalized('category', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-gray-600 dark:text-gray-400">Дата</span>
                    <input
                      type="date"
                      value={formData.date || ''}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-gray-600 dark:text-gray-400">Минут</span>
                    <input
                      type="number"
                      min={1}
                      value={formData.readingTime || 5}
                      onChange={(e) => setFormData({ ...formData, readingTime: parseInt(e.target.value, 10) || 5 })}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </label>
                </div>
                <label className="block text-sm">
                  <span className="mb-1 block text-gray-600 dark:text-gray-400">Ключевые слова через запятую</span>
                  <input
                    value={formData.keywords?.[activeLanguage]?.join(', ') || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        keywords: {
                          ...formData.keywords!,
                          [activeLanguage]: e.target.value.split(',').map((k) => k.trim()).filter(Boolean),
                        },
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-xl border border-gray-200/50 bg-white/70 p-5 shadow-sm dark:border-gray-800/50 dark:bg-gray-900/70">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-light text-gray-900 dark:text-gray-100">
                  HTML · {activeLanguage.toUpperCase()}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    ['p', '<p>', '</p>'],
                    ['h2', '<h2>', '</h2>'],
                    ['h3', '<h3>', '</h3>'],
                    ['strong', '<strong>', '</strong>'],
                    ['ul', '<ul><li>', '</li></ul>'],
                    ['a', '<a href="/ru/services/design">', '</a>'],
                  ].map(([label, open, close]) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => applyTag(open, close)}
                      className="rounded bg-gray-100 px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                id="content-editor"
                value={formData.content?.[activeLanguage] || ''}
                onChange={(e) => updateLocalized('content', e.target.value)}
                rows={viewMode === 'split' ? 28 : 22}
                className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-3 font-mono text-sm leading-6 dark:border-gray-700 dark:bg-gray-800"
                placeholder="HTML контент статьи..."
              />
              <p className="mt-2 text-xs text-gray-500">
                Меняйте текст слева — справа сразу видно, как статья выглядит на сайте.
              </p>
            </section>
          </div>
        ) : null}

        {showPreview ? (
          <div className={`${viewMode === 'split' ? 'lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto' : ''}`}>
            <BlogAdminPreview
              slug={slug}
              lang={previewLang}
              title={formData.title}
              excerpt={formData.excerpt}
              category={formData.category}
              content={formData.content}
              date={formData.date}
              readingTime={formData.readingTime}
              compact={viewMode === 'split'}
            />
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
