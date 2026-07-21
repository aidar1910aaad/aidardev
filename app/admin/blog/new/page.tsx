'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import Breadcrumbs from '@/app/components/dashboard/Breadcrumbs';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<'ru' | 'en' | 'kz'>('ru');
  const [previewMode, setPreviewMode] = useState(false);

  const [formData, setFormData] = useState({
    slug: '',
    title: { ru: '', en: '', kz: '' },
    description: { ru: '', en: '', kz: '' },
    excerpt: { ru: '', en: '', kz: '' },
    category: { ru: '', en: '', kz: '' },
    keywords: { ru: [] as string[], en: [] as string[], kz: [] as string[] },
    content: { ru: '', en: '', kz: '' },
    date: new Date().toISOString().split('T')[0],
    readingTime: 5,
    published: false,
  });

  const handleSave = async () => {
    if (!formData.slug) {
      setError('Slug обязателен для заполнения');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        ...formData,
      };

      const response = await fetch('/api/blog/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка создания статьи');
      }

      const result = await response.json();
      
      if (result.post) {
        alert('Статья успешно создана!');
        router.push(`/admin/blog/${result.post.slug}`);
      }
    } catch (error: unknown) {
      console.error('Ошибка создания:', error);
      setError(error instanceof Error ? error.message : 'Не удалось создать статью');
    } finally {
      setSaving(false);
    }
  };

  const handleKeywordChange = (lang: 'ru' | 'en' | 'kz', value: string) => {
    const keywords = value.split(',').map(k => k.trim()).filter(k => k);
    setFormData({
      ...formData,
      keywords: {
        ...formData.keywords,
        [lang]: keywords,
      },
    });
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  return (
    <DashboardLayout userRole="admin" userName="Aidar" userEmail="aidar1910main@gmail.com">
      <Breadcrumbs items={[
        { label: 'Главная', path: '/' },
        { label: 'Панель управления', path: '/admin/dashboard' },
        { label: 'Блог', path: '/admin/blog' },
        { label: 'Новая статья' }
      ]} />

      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-light tracking-wide text-gray-900 dark:text-gray-100 mb-2">
              Создание новой статьи
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-light">
              Заполните форму для создания новой статьи блога
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all font-light text-sm"
            >
              {previewMode ? 'Редактировать' : 'Предпросмотр'}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-light disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Создание...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Создать статью
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
          <p className="text-red-800 dark:text-red-300 font-light">{error}</p>
        </div>
      )}

      {/* Language Tabs */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl p-2 mb-6 border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div className="flex gap-2">
          {(['ru', 'en', 'kz'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLanguage(lang)}
              className={`px-4 py-2 rounded-lg font-light transition-all ${
                activeLanguage === lang
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {lang === 'ru' ? 'Русский' : lang === 'en' ? 'English' : 'Қазақша'}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
          <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-4">Основная информация</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Slug (URL-friendly идентификатор) *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-light focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="url-friendly-slug"
                />
                <button
                  onClick={() => {
                    const title = formData.title[activeLanguage];
                    if (title) {
                      setFormData({ ...formData, slug: generateSlug(title) });
                    }
                  }}
                  className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all font-light text-sm"
                  title="Сгенерировать из заголовка"
                >
                  Авто
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Только латиница, дефисы, без пробелов
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Заголовок ({activeLanguage.toUpperCase()})
              </label>
              <input
                type="text"
                value={formData.title[activeLanguage]}
                onChange={(e) => setFormData({
                  ...formData,
                  title: {
                    ...formData.title,
                    [activeLanguage]: e.target.value,
                  },
                })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-light focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Введите заголовок"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Описание ({activeLanguage.toUpperCase()})
              </label>
              <textarea
                value={formData.description[activeLanguage]}
                onChange={(e) => setFormData({
                  ...formData,
                  description: {
                    ...formData.description,
                    [activeLanguage]: e.target.value,
                  },
                })}
                rows={2}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-light focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Мета-описание для SEO (150-160 символов)"
              />
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {formData.description[activeLanguage].length} символов
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Краткое описание ({activeLanguage.toUpperCase()})
              </label>
              <textarea
                value={formData.excerpt[activeLanguage]}
                onChange={(e) => setFormData({
                  ...formData,
                  excerpt: {
                    ...formData.excerpt,
                    [activeLanguage]: e.target.value,
                  },
                })}
                rows={2}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-light focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Краткое описание для карточки статьи (200-250 символов)"
              />
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {formData.excerpt[activeLanguage].length} символов
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Категория ({activeLanguage.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={formData.category[activeLanguage]}
                  onChange={(e) => setFormData({
                    ...formData,
                    category: {
                      ...formData.category,
                      [activeLanguage]: e.target.value,
                    },
                  })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-light focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Маркетинг и SEO"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Дата публикации
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-light focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Время чтения (минуты)
                </label>
                <input
                  type="number"
                  value={formData.readingTime}
                  onChange={(e) => setFormData({ ...formData, readingTime: parseInt(e.target.value) || 5 })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-light focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ключевые слова ({activeLanguage.toUpperCase()}) - через запятую
              </label>
              <input
                type="text"
                value={formData.keywords[activeLanguage].join(', ')}
                onChange={(e) => handleKeywordChange(activeLanguage, e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-light focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="ключевое слово 1, ключевое слово 2, ключевое слово 3"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Опубликовано
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-light text-gray-900 dark:text-gray-100">
              Контент ({activeLanguage.toUpperCase()})
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
                  if (textarea) {
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const selectedText = textarea.value.substring(start, end);
                    const before = textarea.value.substring(0, start);
                    const after = textarea.value.substring(end);
                    const newText = before + '<p>' + selectedText + '</p>' + after;
                    setFormData({
                      ...formData,
                      content: {
                        ...formData.content,
                        [activeLanguage]: newText,
                      },
                    });
                    setTimeout(() => {
                      textarea.focus();
                      textarea.setSelectionRange(start + 3, end + 3);
                    }, 0);
                  }
                }}
                className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-all font-light"
                title="Вставить тег <p>"
              >
                &lt;p&gt;
              </button>
              <button
                onClick={() => {
                  const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
                  if (textarea) {
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const selectedText = textarea.value.substring(start, end);
                    const before = textarea.value.substring(0, start);
                    const after = textarea.value.substring(end);
                    const newText = before + '<h2>' + selectedText + '</h2>' + after;
                    setFormData({
                      ...formData,
                      content: {
                        ...formData.content,
                        [activeLanguage]: newText,
                      },
                    });
                    setTimeout(() => {
                      textarea.focus();
                      textarea.setSelectionRange(start + 4, end + 4);
                    }, 0);
                  }
                }}
                className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-all font-light"
                title="Вставить тег <h2>"
              >
                &lt;h2&gt;
              </button>
              <button
                onClick={() => {
                  const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
                  if (textarea) {
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const selectedText = textarea.value.substring(start, end);
                    const before = textarea.value.substring(0, start);
                    const after = textarea.value.substring(end);
                    const newText = before + '<strong>' + selectedText + '</strong>' + after;
                    setFormData({
                      ...formData,
                      content: {
                        ...formData.content,
                        [activeLanguage]: newText,
                      },
                    });
                    setTimeout(() => {
                      textarea.focus();
                      textarea.setSelectionRange(start + 8, end + 8);
                    }, 0);
                  }
                }}
                className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-all font-light"
                title="Вставить тег <strong>"
              >
                &lt;strong&gt;
              </button>
            </div>
          </div>

          {previewMode ? (
            <div className="prose dark:prose-invert max-w-none bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 min-h-[500px]">
              <div dangerouslySetInnerHTML={{ __html: formData.content[activeLanguage] }} />
            </div>
          ) : (
            <textarea
              id="content-editor"
              value={formData.content[activeLanguage]}
              onChange={(e) => setFormData({
                ...formData,
                content: {
                  ...formData.content,
                  [activeLanguage]: e.target.value,
                },
              })}
              rows={20}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y"
              placeholder="Введите HTML контент статьи..."
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

