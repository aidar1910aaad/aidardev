import { MetadataRoute } from 'next';
import { getAllBlogPosts, type BlogPost } from './data/blog-posts';
import { cityEntries } from './data/cities';
import { cityServiceCombos } from './data/city-services';
import { getAvailableBlogLangs, shouldIndexBlogPost } from './lib/seo/blog-indexing';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';

import { getBackendUrl } from './lib/backend-config';

const BACKEND_API_URL = getBackendUrl();

async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/blog/posts?published=true`, {
      next: { revalidate: 3600 }, // Кэшируем на 1 час
    });

    if (!response.ok) {
      return process.env.NODE_ENV === 'development' ? getAllBlogPosts() : [];
    }

    const result = await response.json();
    const posts = result.posts || result || [];
    return posts.filter((post: BlogPost) => post.published !== false);
  } catch (error) {
    console.error('Ошибка загрузки статей для sitemap:', error);
    return process.env.NODE_ENV === 'development' ? getAllBlogPosts() : [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const languages = ['ru', 'en', 'kz'];
  const baseRoutes = languages.map((lang) => {
    return {
      url: `${siteUrl}/${lang}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: lang === 'ru' ? 1 : 0.9,
      alternates: {
        languages: {
          'ru': `${siteUrl}/ru`,
          'en': `${siteUrl}/en`,
          'kk': `${siteUrl}/kz`,
          'x-default': `${siteUrl}/ru`,
        },
      },
    };
  });

  // Pricing для всех языков
  const pricingRoutes = languages.map((lang) => {
    return {
      url: `${siteUrl}/${lang}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
      alternates: {
        languages: {
          'ru': `${siteUrl}/ru/pricing`,
          'en': `${siteUrl}/en/pricing`,
          'kk': `${siteUrl}/kz/pricing`,
        },
      },
    };
  });

  // Services index page для всех языков
  const servicesIndexRoutes = languages.map((lang) => {
    return {
      url: `${siteUrl}/${lang}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
      alternates: {
        languages: {
          'ru': `${siteUrl}/ru/services`,
          'en': `${siteUrl}/en/services`,
          'kk': `${siteUrl}/kz/services`,
        },
      },
    };
  });

  const citiesIndexRoutes = languages.map((lang) => {
    return {
      url: `${siteUrl}/${lang}/cities`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: lang === 'ru' ? 0.8 : 0.7,
      alternates: {
        languages: {
          'ru': `${siteUrl}/ru/cities`,
          'en': `${siteUrl}/en/cities`,
          'kk': `${siteUrl}/kz/cities`,
        },
      },
    };
  });

  // Blog page для всех языков
  const blogRoutes = ['ru', 'kz'].map((lang) => {
    return {
      url: `${siteUrl}/${lang}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          'ru': `${siteUrl}/ru/blog`,
          'kk': `${siteUrl}/kz/blog`,
        },
      },
    };
  });

  // Страницы услуг для всех языков
  const services = ['websites', 'bots', 'ai', 'mobile', 'design', 'consulting'];
  const serviceRoutes = languages.flatMap((lang) => 
    services.map((service) => ({
      url: `${siteUrl}/${lang}/services/${service}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
      alternates: {
        languages: {
          'ru': `${siteUrl}/ru/services/${service}`,
          'en': `${siteUrl}/en/services/${service}`,
          'kk': `${siteUrl}/kz/services/${service}`,
        },
      },
    }))
  );

  const cityLandingRoutes = languages.flatMap((lang) =>
    cityEntries.map((city) => ({
      url: `${siteUrl}/${lang}/cities/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: lang === 'ru' ? 0.85 : 0.75,
      alternates: {
        languages: {
          ru: `${siteUrl}/ru/cities/${city.slug}`,
          en: `${siteUrl}/en/cities/${city.slug}`,
          kk: `${siteUrl}/kz/cities/${city.slug}`,
        },
      },
    }))
  );

  const cityServiceRoutes = ['ru', 'en', 'kz'].flatMap((lang) =>
    cityServiceCombos.map((combo) => ({
      url: `${siteUrl}/${lang}/cities/${combo.citySlug}/${combo.service}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: lang === 'ru' ? 0.9 : 0.75,
      alternates: {
        languages: {
          ru: `${siteUrl}/ru/cities/${combo.citySlug}/${combo.service}`,
          en: `${siteUrl}/en/cities/${combo.citySlug}/${combo.service}`,
          kk: `${siteUrl}/kz/cities/${combo.citySlug}/${combo.service}`,
          'x-default': `${siteUrl}/ru/cities/${combo.citySlug}/${combo.service}`,
        },
      },
    })),
  );

  // Blog posts для всех языков - динамически загружаем из БД
  const blogPosts = await fetchBlogPosts();
  const blogPostRoutes = ['ru', 'kz'].flatMap((lang) =>
    blogPosts
      .filter((post) => shouldIndexBlogPost(post, lang))
      .map((post) => ({
      url: `${siteUrl}/${lang}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.date),
      changeFrequency: 'monthly' as const,
      priority: lang === 'ru' ? 0.8 : 0.6,
      alternates: {
        languages: Object.fromEntries(getAvailableBlogLangs(post).map((available) => [
          available === 'kz' ? 'kk' : available,
          `${siteUrl}/${available}/blog/${post.slug}`,
        ])),
      },
    }))
  );

  // Проекты отображаются на главной странице в секции Projects
  // Отдельных страниц проектов нет, поэтому не добавляем их в sitemap
  // Если в будущем создадите страницы /projects/[id], добавьте их сюда

  return [...baseRoutes, ...pricingRoutes, ...servicesIndexRoutes, ...citiesIndexRoutes, ...serviceRoutes, ...cityLandingRoutes, ...cityServiceRoutes, ...blogRoutes, ...blogPostRoutes];
}

