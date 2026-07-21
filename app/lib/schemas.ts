// Утилитные функции для создания structured data схем
// Этот файл может использоваться как на сервере, так и на клиенте

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';

export function createPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'aidardev',
    jobTitle: 'Development Studio',
    url: siteUrl,
    sameAs: [
      'https://github.com/aidar1910aaad',
      'https://www.linkedin.com/in/aidar1910main',
    ],
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
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'KZ',
      addressLocality: 'Kazakhstan',
    },
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
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+7-706-670-36-96',
      contactType: 'Customer Service',
      areaServed: 'KZ',
      availableLanguage: ['Russian', 'English', 'Kazakh'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'KZ',
    },
    sameAs: [
      'https://github.com/aidar1910aaad',
      'https://www.linkedin.com/in/aidar1910main',
    ],
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

export function createServiceSchema(service: {
  name: string;
  description: string;
  provider: string;
  areaServed: string;
}) {
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
  };
}

export function createReviewSchema(reviews: Array<{
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Aidar - Full-Stack Developer',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
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

