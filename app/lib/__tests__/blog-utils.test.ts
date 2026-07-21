import { buildWhatsAppUrl, getRelatedPosts, getRelatedServices, splitArticleHtml } from '../blog-utils';
import type { BlogPost } from '../../data/blog-posts';

const post = (slug: string, category: string, keywords: string[], content = '<p>Valid content</p>'): BlogPost => ({
  id: slug,
  slug,
  title: { ru: slug, en: slug, kz: slug },
  description: { ru: slug, en: slug, kz: slug },
  excerpt: { ru: slug, en: slug, kz: slug },
  category: { ru: category, en: category, kz: category },
  date: '2026-07-20',
  keywords: { ru: keywords, en: keywords, kz: keywords },
  readingTime: 3,
  published: true,
  content: { ru: content, kz: content },
});

describe('blog utilities', () => {
  it('builds a natural WhatsApp message with optional details', () => {
    const url = buildWhatsAppUrl({
      slug: 'seo-guide',
      title: 'SEO guide',
      locale: 'ru',
      projectType: 'Сайт',
      budgetOrTask: 'Нужен лендинг',
    });
    const text = decodeURIComponent(url);
    expect(url).toContain('https://wa.me/77066703696?text=');
    expect(text).toContain('Прочитал(а) статью «SEO guide»');
    expect(text).toContain('Тип проекта: Сайт');
    expect(text).toContain('Задача/бюджет: Нужен лендинг');
    expect(text).toContain('/ru/blog/seo-guide');
    expect(text).not.toContain('Slug:');
    expect(text).not.toContain('Locale:');
  });

  it('omits empty optional fields from WhatsApp message', () => {
    const text = decodeURIComponent(buildWhatsAppUrl({
      slug: 'ai-bot',
      title: 'AI бот',
      locale: 'ru',
    }));
    expect(text).toContain('Прочитал(а) статью «AI бот»');
    expect(text).not.toContain('Тип проекта:');
    expect(text).not.toContain('Задача/бюджет:');
  });

  it('splits HTML on a complete block near the middle', () => {
    const [before, after] = splitArticleHtml('<p>One</p><p>Two</p><p>Three</p>');
    expect(before.endsWith('</p>')).toBe(true);
    expect(`${before}${after}`).toBe('<p>One</p><p>Two</p><p>Three</p>');
  });

  it('ranks related localized posts and services', () => {
    const current = post('current', 'SEO', ['сайт', 'конверсия']);
    const related = post('related', 'SEO', ['сайт']);
    const unrelated = post('other', 'Мобильные приложения', ['android']);
    expect(getRelatedPosts([current, unrelated, related], current, 'ru')).toEqual([related]);
    expect(getRelatedServices(current, 'ru')).toContain('websites');
  });
});
