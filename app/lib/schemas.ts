// Утилитные функции для создания structured data схем
// Этот файл может использоваться как на сервере, так и на клиенте
import pricingData from '../data/pricing.json';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';

// Единый список профилей бренда — используется во всех схемах (Person, Organization),
// чтобы AI/поисковые системы видели одну и ту же сущность, а не несколько разных.
// Исследования GEO 2026 показывают, что согласованность упоминаний бренда (entity consistency)
// коррелирует с цитированием в AI сильнее (0.664), чем классические бэклинки (0.218).
const BRAND_SAME_AS = [
  'https://github.com/aidar1910aaad',
  'https://www.linkedin.com/in/aidar1910main/',
  'https://2gis.kz/almaty/firm/70000001110666699',
  'https://t.me/opunksnoo',
];

// Адрес, координаты и часы — дословно как в карточке 2ГИС (ссылка в BRAND_SAME_AS):
// поисковики сверяют название, адрес и телефон сайта с картами и справочниками.
// Юридический адрес ИП (Астана) — только в реквизитах в подвале.
const BRAND_ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: 'ул. Каныша Сатпаева, 105а',
  addressLocality: 'Алматы',
  postalCode: '050046',
  addressCountry: 'KZ',
};

const BRAND_GEO = {
  '@type': 'GeoCoordinates',
  latitude: 43.234936,
  longitude: 76.884541,
};

const BRAND_OPENING_HOURS = [
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '09:00',
    closes: '21:00',
  },
];

export function createPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'aidardev',
    jobTitle: 'Development Studio',
    url: siteUrl,
    email: 'aidar1910main@gmail.com',
    telephone: '+7-706-670-36-96',
    sameAs: BRAND_SAME_AS,
    knowsAbout: [
      'Web Development',
      'React',
      'Next.js',
      'TypeScript',
      'Node.js',
      'Python',
      'AI Integration',
      'Mobile Development',
      'Chat Bots',
    ],
    address: BRAND_ADDRESS,
    offers: {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        serviceType: 'Web Development',
        areaServed: {
          '@type': 'Country',
          name: 'Kazakhstan',
        },
        provider: {
          '@type': 'Person',
          name: 'aidardev',
        },
      },
    },
  };
}

export function createOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'aidardev — Development Studio',
    description: 'Development studio for websites, AI integrations, and mobile app development services',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    email: 'aidar1910main@gmail.com',
    priceRange: '₸₸',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+7-706-670-36-96',
      contactType: 'Customer Service',
      areaServed: 'KZ',
      availableLanguage: ['Russian', 'English', 'Kazakh'],
    },
    telephone: '+7-706-670-36-96',
    address: BRAND_ADDRESS,
    geo: BRAND_GEO,
    hasMap: 'https://2gis.kz/almaty/firm/70000001110666699',
    openingHoursSpecification: BRAND_OPENING_HOURS,
    areaServed: {
      '@type': 'Country',
      name: 'Kazakhstan',
    },
    sameAs: BRAND_SAME_AS,
  };
}

export function createWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'aidardev — Development Studio',
    url: siteUrl,
    description: 'Development studio portfolio specializing in websites, AI integrations, and mobile apps',
    inLanguage: ['ru', 'en', 'kz'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function createBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function createFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

type PricingTier = {
  name: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
};

type PricingCategory = Record<string, PricingTier>;

const pricingCategories = (pricingData as { services: Record<string, PricingCategory> }).services;

export function createServiceSchema(service: {
  name: string;
  description: string;
  provider: string;
  areaServed: string;
  // Ключ категории из app/data/pricing.json (websites, bots, ai, mobile, design, consulting).
  // Если передан — в схему добавляется реальный диапазон цен, чтобы AI-движки могли
  // процитировать точную стоимость услуги, а не только описание.
  serviceKey?: keyof typeof pricingCategories;
}) {
  const tiers = service.serviceKey ? pricingCategories[service.serviceKey] : undefined;
  const tierList = tiers ? Object.values(tiers) : [];
  const prices = tierList.map((tier) => tier.price);

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.name,
    description: service.description,
    provider: {
      '@type': 'Person',
      name: service.provider,
    },
    areaServed: {
      '@type': 'Country',
      name: service.areaServed,
    },
    ...(prices.length > 0
      ? {
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: tierList[0].currency,
            lowPrice: Math.min(...prices),
            highPrice: Math.max(...prices),
            offerCount: prices.length,
            offers: tierList.map((tier) => ({
              '@type': 'Offer',
              name: tier.name,
              description: tier.description,
              price: tier.price,
              priceCurrency: tier.currency,
              availability: 'https://schema.org/InStock',
            })),
          },
        }
      : {}),
  };
}

// Полный прайс-лист как машиночитаемая схема — для страницы /pricing.
// Это самый прямой источник фактов для GEO: конкретные цифры, которые
// AI-движок может процитировать дословно вместо общей фразы "цены индивидуальны".
export function createPricingCatalogSchema() {
  const itemListElement = Object.values(pricingCategories).flatMap((category) =>
    Object.values(category).map((tier) => ({
      '@type': 'Offer',
      name: tier.name,
      description: tier.description,
      price: tier.price,
      priceCurrency: tier.currency,
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/ru/pricing`,
      seller: {
        '@type': 'ProfessionalService',
        name: 'aidardev',
      },
    })),
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'aidardev — прайс-лист на разработку сайтов, ботов, AI-решений и мобильных приложений',
    url: `${siteUrl}/ru/pricing`,
    numberOfItems: itemListElement.length,
    itemListElement,
  };
}

export function createReviewSchema(reviews: Array<{
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
}>) {
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'aidardev — Development Studio',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: Number(averageRating.toFixed(1)),
      reviewCount: reviews.length,
    },
    review: reviews.map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
      },
      reviewBody: review.reviewBody,
      datePublished: review.datePublished,
    })),
  };
}

