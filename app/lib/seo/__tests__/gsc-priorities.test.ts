import {
  GSC_KPI_TARGETS,
  GSC_PRIORITY_CLUSTERS,
  getPriorityClusterForService,
  getUnderperformingServicePages,
} from '../gsc-priorities';

describe('gsc-priorities', () => {
  it('tracks priority clusters from Search Console', () => {
    expect(GSC_PRIORITY_CLUSTERS.length).toBeGreaterThanOrEqual(4);
    expect(GSC_PRIORITY_CLUSTERS.some((c) => c.id === 'ux-ui-design')).toBe(true);
    expect(GSC_PRIORITY_CLUSTERS.some((c) => c.id === 'mobile-astana')).toBe(true);
  });

  it('maps design service to ux cluster', () => {
    const cluster = getPriorityClusterForService('design');
    expect(cluster?.queries).toEqual(expect.arrayContaining(['заказать ux-дизайн сайта']));
  });

  it('lists underperforming money pages', () => {
    const pages = getUnderperformingServicePages();
    expect(pages.some((p) => p.path === '/ru/services/mobile')).toBe(true);
    expect(pages.some((p) => p.path === '/ru/services/design')).toBe(true);
  });

  it('defines realistic KPI targets', () => {
    expect(GSC_KPI_TARGETS.nonBrandedClicksPerMonth).toBeGreaterThan(50);
    expect(GSC_KPI_TARGETS.servicePagesCtrPercent).toBeGreaterThanOrEqual(3);
  });
});
