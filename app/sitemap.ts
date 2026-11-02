import { MetadataRoute } from 'next';
import { cityEntries, isCityIndexable } from './data/cities';
import { cityServiceCombos } from './data/city-services';
import { INDUSTRY_HUB, SOLUTIONS, SOLUTIONS_HUB } from './data/solutions';
import { getAvailableBlogLangs, shouldIndexBlogPost } from './lib/seo/blog-indexing';
import { BLOG_FEED_REVALIDATE_SECONDS, fetchPublishedBlogPosts } from './lib/blog-cache';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';

// Новые статьи добавляет вебхук бэкенда (тег blog-posts и revalidatePath('/sitemap.xml')); срок — страховка на сутки.
export const revalidate = 86400;

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

  // Только города, которые остаются в поиске (RU, с показами в Google) — см. INDEXED_CITY_SLUGS.
  const cityLandingRoutes = cityEntries
    .filter((city) => isCityIndexable(city.slug, 'ru'))
    .map((city) => ({
      url: `${siteUrl}/ru/cities/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }));

  // Уникальный текст есть только у RU-версий страниц «город × услуга».
  const cityServiceRoutes = cityServiceCombos.map((combo) => ({
    url: `${siteUrl}/ru/cities/${combo.citySlug}/${combo.service}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // «Сложная разработка»: раздел только на русском, без языковых версий.
  const solutionsRoutes = [SOLUTIONS_HUB.path, INDUSTRY_HUB.path, ...SOLUTIONS.map((s) => `/ru/solutions/${s.slug}`)].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date('2026-11-02'),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  // Blog posts для всех языков - динамически загружаем из БД
  const blogPosts = await fetchPublishedBlogPosts(BLOG_FEED_REVALIDATE_SECONDS);
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

  // Политика конфиденциальности — служебная страница: только RU и KZ, низкий приоритет.
  const privacyRoutes = ['ru', 'kz'].map((lang) => ({
    url: `${siteUrl}/${lang}/privacy`,
    lastModified: new Date('2026-10-01'),
    changeFrequency: 'yearly' as const,
    priority: 0.3,
    alternates: {
      languages: {
        'ru': `${siteUrl}/ru/privacy`,
        'kk': `${siteUrl}/kz/privacy`,
      },
    },
  }));

  // Проекты отображаются на главной странице в секции Projects
  // Отдельных страниц проектов нет, поэтому не добавляем их в sitemap
  // Если в будущем создадите страницы /projects/[id], добавьте их сюда

  return [...baseRoutes, ...pricingRoutes, ...servicesIndexRoutes, ...citiesIndexRoutes, ...serviceRoutes, ...solutionsRoutes, ...cityLandingRoutes, ...cityServiceRoutes, ...blogRoutes, ...blogPostRoutes, ...privacyRoutes];
}

