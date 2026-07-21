'use client';

import { useState, useMemo, useEffect } from 'react';
import type { BlogPost } from '../../data/blog-posts';

interface BlogFiltersProps {
  posts: BlogPost[];
  lang: 'ru' | 'en' | 'kz';
  onFilteredPostsChange: (filteredPosts: BlogPost[]) => void;
}

export default function BlogFilters({ posts, lang, onFilteredPostsChange }: BlogFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Получаем все уникальные категории
  const categories = useMemo(() => {
    const cats = new Set<string>();
    posts.forEach(post => {
      const cat = post.category[lang];
      if (cat) cats.add(cat);
    });
    return Array.from(cats).sort();
  }, [posts, lang]);

  // Фильтруем посты
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Фильтр по категории
    if (selectedCategory) {
      filtered = filtered.filter(post => post.category[lang] === selectedCategory);
    }

    // Фильтр по поисковому запросу
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(post => {
        const title = post.title[lang]?.toLowerCase() || '';
        const excerpt = post.excerpt[lang]?.toLowerCase() || '';
        const category = post.category[lang]?.toLowerCase() || '';
        return title.includes(query) || excerpt.includes(query) || category.includes(query);
      });
    }

    return filtered;
  }, [posts, selectedCategory, searchQuery, lang]);

  // Обновляем родительский компонент при изменении фильтров
  useEffect(() => {
    onFilteredPostsChange(filteredPosts);
  }, [filteredPosts, onFilteredPostsChange]);

  const categoryLabels = {
    ru: {
      all: 'Все статьи',
      search: 'Поиск статей...',
      noResults: 'Статьи не найдены',
      tryAnother: 'Попробуйте изменить поисковый запрос или выбрать другую категорию',
    },
    en: {
      all: 'All articles',
      search: 'Search articles...',
      noResults: 'No articles found',
      tryAnother: 'Try changing your search query or select another category',
    },
    kz: {
      all: 'Барлық мақалалар',
      search: 'Мақалаларды іздеу...',
      noResults: 'Мақалалар табылмады',
      tryAnother: 'Іздеу сұрауын өзгертіп немесе басқа категорияны таңдап көріңіз',
    },
  };

  const labels = categoryLabels[lang];

  return (
    <div className="mb-14 border-b border-slate-300 py-7 sm:py-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(18rem,0.8fr)_1.2fr] lg:items-end">
        <label className="block">
          <span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            {lang === 'en' ? 'Search the journal' : lang === 'kz' ? 'Журналдан іздеу' : 'Поиск по журналу'}
          </span>
          <span className="relative block">
            <svg className="pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-5.2-5.2m2.2-5.3a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" />
            </svg>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={labels.search}
              className="h-12 w-full border-b-2 border-slate-950 bg-transparent pl-8 pr-10 text-base font-medium outline-none transition-colors placeholder:text-slate-400 focus:border-blue-700"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-0 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center text-slate-500 hover:text-slate-950"
                aria-label={lang === 'en' ? 'Clear search' : lang === 'kz' ? 'Іздеуді тазарту' : 'Очистить поиск'}
              >
                <span aria-hidden="true" className="text-xl">×</span>
              </button>
            )}
          </span>
        </label>

        <div>
          <div className="mb-2 flex items-center justify-between gap-4">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              {lang === 'en' ? 'Topics' : lang === 'kz' ? 'Тақырыптар' : 'Темы'}
            </span>
            <span className="font-mono text-[10px] text-slate-500" aria-live="polite">
              {filteredPosts.length} / {posts.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[null, ...categories].map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category ?? 'all'}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedCategory(category)}
                  className={`min-h-10 border px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'border-slate-950 bg-slate-950 text-white'
                      : 'border-slate-300 bg-transparent text-slate-700 hover:border-blue-700 hover:text-blue-700'
                  }`}
                >
                  {category ?? labels.all}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {(searchQuery || selectedCategory) && (
        <div className="mt-5 flex items-center gap-3 border-l-2 border-blue-700 pl-3 text-sm text-slate-600">
          <span>
            {lang === 'ru'
              ? `Найдено: ${filteredPosts.length}`
              : lang === 'en'
              ? `Found: ${filteredPosts.length}`
              : `Табылды: ${filteredPosts.length}`}
          </span>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory(null);
            }}
            className="font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4 hover:decoration-blue-700"
          >
            {lang === 'en' ? 'Reset' : lang === 'kz' ? 'Қалпына келтіру' : 'Сбросить'}
          </button>
        </div>
      )}
    </div>
  );
}

