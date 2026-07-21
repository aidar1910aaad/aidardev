import { getAvailableBlogLangs, getBlogContentForLang, shouldIndexBlogPost } from '../seo/blog-indexing';
import type { BlogPost } from '../../data/blog-posts';

const longContent = `<p>${'Нақты мазмұн '.repeat(30)}</p>`;
const post: BlogPost = {
  id: '1',
  slug: 'localized',
  title: { ru: 'RU', en: 'EN', kz: 'KZ' },
  description: { ru: '', en: '', kz: '' },
  excerpt: { ru: '', en: '', kz: '' },
  category: { ru: '', en: '', kz: '' },
  date: '2026-07-20',
  keywords: { ru: [], en: [], kz: [] },
  readingTime: 5,
  published: true,
  content: { ru: longContent, kz: longContent },
};

describe('blog indexing', () => {
  it('never falls back to Russian content', () => {
    expect(getBlogContentForLang(post, 'en')).toBe('');
    expect(shouldIndexBlogPost(post, 'en')).toBe(false);
  });

  it('indexes only complete RU/KZ translations', () => {
    expect(getAvailableBlogLangs(post)).toEqual(['ru', 'kz']);
    expect(shouldIndexBlogPost({ ...post, published: false }, 'ru')).toBe(false);
  });
});
