import type { ServiceKey } from '../../data/services-config';

/** Confirmed Search Console query clusters — update monthly from GSC export. */
export const GSC_PRIORITY_CLUSTERS = [
  {
    id: 'ux-ui-design',
    service: 'design' as ServiceKey,
    queries: ['заказать ux-дизайн сайта', 'ux ui дизайн заказать', 'ux-дизайн заказать'],
    impressions: 106,
    avgPosition: 56.8,
  },
  {
    id: 'mobile-astana',
    service: 'mobile' as ServiceKey,
    queries: ['создание мобильных приложений астана', 'разработка приложений астана'],
    impressions: 84,
    avgPosition: 50.2,
  },
  {
    id: 'ecommerce-kz',
    service: 'websites' as ServiceKey,
    queries: ['как открыть интернет магазин в казахстане', 'открыть интернет магазин в казахстане'],
    impressions: 19,
    avgPosition: 17.3,
  },
  {
    id: 'bots-almaty',
    service: 'bots' as ServiceKey,
    queries: ['разработка ботов алматы', 'разработка чат ботов алматы'],
    impressions: 18,
    avgPosition: 35.7,
  },
  {
    id: 'websites-kz',
    service: 'websites' as ServiceKey,
    queries: ['разработка сайтов в казахстане', 'разработка сайтов казахстан'],
    impressions: 29,
    avgPosition: 70,
  },
] as const;

export const GSC_KPI_TARGETS = {
  nonBrandedClicksPerMonth: 80,
  servicePagesCtrPercent: 3,
  top10Queries: 25,
  seoLeadsPerMonth: 5,
} as const;

export const GSC_SERVICE_PAGE_BASELINES = {
  '/ru/services/mobile': { impressions: 266, clicks: 1, ctr: 0.4, position: 47 },
  '/ru/services/design': { impressions: 154, clicks: 1, ctr: 0.6, position: 38.4 },
  '/ru/services/websites': { impressions: 81, clicks: 0, ctr: 0, position: 50.8 },
  '/ru/services/bots': { impressions: 68, clicks: 0, ctr: 0, position: 17.6 },
  '/ru/services/ai': { impressions: 68, clicks: 4, ctr: 5.9, position: 8.9 },
} as const;

export function getPriorityClusterForService(service: ServiceKey) {
  return GSC_PRIORITY_CLUSTERS.find((cluster) => cluster.service === service);
}

export function getUnderperformingServicePages() {
  return Object.entries(GSC_SERVICE_PAGE_BASELINES)
    .filter(([, stats]) => stats.impressions >= 50 && stats.ctr < 2)
    .map(([path, stats]) => ({ path, ...stats }));
}
