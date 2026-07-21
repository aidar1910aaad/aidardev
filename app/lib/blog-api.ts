// Утилиты для работы с API блога
// Переключается между локальными данными и API

const API_URL = process.env.NEXT_PUBLIC_BLOG_API_URL;

export interface BlogPostFromAPI {
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

// Получить все статьи из API
export async function fetchAllPostsFromAPI(): Promise<BlogPostFromAPI[]> {
  if (!API_URL) {
    throw new Error('NEXT_PUBLIC_BLOG_API_URL is not set');
  }

  try {
    const response = await fetch(`${API_URL}/posts`, {
      next: { revalidate: 3600 }, // ISR: обновлять раз в час
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.posts.filter((post: BlogPostFromAPI) => post.published);
  } catch (error) {
    console.error('Error fetching posts from API:', error);
    throw error;
  }
}

// Получить одну статью из API
export async function fetchPostBySlugFromAPI(slug: string): Promise<BlogPostFromAPI | null> {
  if (!API_URL) {
    throw new Error('NEXT_PUBLIC_BLOG_API_URL is not set');
  }

  try {
    const response = await fetch(`${API_URL}/posts/${slug}`, {
      next: { revalidate: 3600 }, // ISR: обновлять раз в час
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.post || null;
  } catch (error) {
    console.error(`Error fetching post ${slug} from API:`, error);
    return null;
  }
}

// Проверить, доступен ли API
export function isAPIEnabled(): boolean {
  return !!API_URL && API_URL.trim() !== '';
}





