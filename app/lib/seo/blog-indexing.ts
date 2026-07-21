import type { BlogPost } from '../../data/blog-posts';

type BlogLang = 'ru' | 'en' | 'kz';

type BlogPostWithContent = BlogPost & {
  content?: Partial<Record<BlogLang, string>>;
};

const MIN_CONTENT_LENGTH = 200;
export const INDEXABLE_BLOG_LANGS: BlogLang[] = ['ru', 'kz'];

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function getBlogContentForLang(post: BlogPostWithContent, lang: BlogLang): string {
  return post.content?.[lang] || '';
}

export function hasBlogContentForLang(post: BlogPostWithContent, lang: BlogLang): boolean {
  const content = getBlogContentForLang(post, lang);
  return stripHtml(content).length >= MIN_CONTENT_LENGTH;
}

export function shouldIndexBlogPost(post: BlogPostWithContent, lang: string): boolean {
  if (!INDEXABLE_BLOG_LANGS.includes(lang as BlogLang)) {
    return false;
  }
  return post.published !== false && hasBlogContentForLang(post, lang as BlogLang);
}

export function getAvailableBlogLangs(post: BlogPostWithContent): BlogLang[] {
  return INDEXABLE_BLOG_LANGS.filter((lang) => shouldIndexBlogPost(post, lang));
}
