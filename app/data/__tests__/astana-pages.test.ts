import { projects } from '../projects';
import { ASTANA_PAGES, ASTANA_PRICE_SLUG } from '../astana-pages';
import { CALC_TYPES, CALC_OPTIONS, PRICE_PAGE, PRICE_TABLE, calcEstimate, formatTenge } from '../price-calculator';
import { cityServiceCombos } from '../city-services';

function texts(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => texts(item, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => texts(item, out));
  return out;
}

describe('astana pages', () => {
  it('has unique slugs that do not clash with city × service combos', () => {
    const slugs = [ASTANA_PRICE_SLUG, ...ASTANA_PAGES.map((page) => page.slug)];
    expect(new Set(slugs).size).toBe(slugs.length);
    const taken = cityServiceCombos.filter((combo) => combo.citySlug === 'astana').map((combo) => combo.service as string);
    for (const slug of slugs) expect(taken).not.toContain(slug);
  });

  it('uses no long dash and no client we do not show', () => {
    for (const text of [...texts(ASTANA_PAGES), ...texts(PRICE_PAGE), ...texts(PRICE_TABLE), ...texts(CALC_TYPES), ...texts(CALC_OPTIONS)]) {
      expect(text).not.toContain('—');
      expect(text).not.toMatch(/АЭТЗ|электротехническ|aetz/i);
    }
  });

  it('shows only portfolio projects', () => {
    const ids = new Set(projects.map((project) => project.id));
    for (const page of ASTANA_PAGES) {
      expect(page.cases.length).toBeGreaterThan(0);
      for (const id of page.cases) expect(ids.has(id)).toBe(true);
    }
  });

  it('keeps snippets short and pages substantial', () => {
    for (const page of [...ASTANA_PAGES, PRICE_PAGE]) {
      expect(page.description.length).toBeLessThanOrEqual(170);
      expect(page.title.length).toBeLessThanOrEqual(70);
      expect(page.faq.length).toBeGreaterThanOrEqual(6);
    }
    for (const page of ASTANA_PAGES) {
      expect(page.tiers.length).toBe(3);
      expect(page.steps.length).toBeGreaterThanOrEqual(4);
      expect(page.h1).toMatch(/Астан/);
    }
  });
});

describe('price calculator', () => {
  it('starts every type at the site price and never inverts the range', () => {
    expect(calcEstimate('vizitka', 0, [], false)).toEqual({ min: 45000, max: 150000 });
    expect(calcEstimate('shop', 0, [], false)).toEqual({ min: 120000, max: 450000 });
    for (const type of CALC_TYPES) {
      const all = calcEstimate(type.key, (type.size?.steps.length ?? 1) - 1, CALC_OPTIONS.map((o) => o.key), true);
      expect(all.min).toBeLessThanOrEqual(all.max);
      expect(all.min).toBeGreaterThanOrEqual(type.base.min);
    }
  });

  it('does not charge for included options or options of another type', () => {
    expect(calcEstimate('shop', 0, ['kaspi'], false)).toEqual(calcEstimate('shop', 0, [], false));
    expect(calcEstimate('tg', 0, ['onec', 'bot'], false)).toEqual(calcEstimate('tg', 0, [], false));
  });

  it('applies urgency and formats tenge', () => {
    expect(calcEstimate('corp', 0, [], true)).toEqual({ min: 135000, max: 450000 });
    expect(formatTenge(1500000)).toBe('1 500 000 ₸');
  });
});
