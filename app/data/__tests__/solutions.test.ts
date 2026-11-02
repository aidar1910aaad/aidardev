import { projects } from '../projects';
import { INDUSTRY_HUB, SOLUTIONS, SOLUTIONS_HUB, WORK_TERMS } from '../solutions';

// Все строки раздела «Сложная разработка»: тексты идут на сайт и в ответы ИИ-ассистентов.
function allTexts(): string[] {
  const out: string[] = [...WORK_TERMS];
  const walk = (value: unknown) => {
    if (typeof value === 'string') out.push(value);
    else if (Array.isArray(value)) value.forEach(walk);
    else if (value && typeof value === 'object') Object.values(value).forEach(walk);
  };
  walk(SOLUTIONS);
  walk(SOLUTIONS_HUB);
  walk(INDUSTRY_HUB);
  return out;
}

describe('solutions content', () => {
  it('has unique slugs', () => {
    const slugs = SOLUTIONS.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs).not.toContain('industry');
  });

  it('uses no long dash and no client we do not show', () => {
    for (const text of allTexts()) {
      expect(text).not.toContain('—');
      expect(text).not.toMatch(/АЭТЗ|электротехническ/i);
    }
  });

  it('links only to existing solutions and portfolio projects', () => {
    const slugs = new Set(SOLUTIONS.map((s) => s.slug));
    const projectIds = new Set(projects.map((p) => p.id));
    for (const solution of SOLUTIONS) {
      for (const related of solution.related) expect(slugs.has(related)).toBe(true);
      for (const item of solution.cases) {
        if (item.projectId) expect(projectIds.has(item.projectId)).toBe(true);
      }
    }
  });

  it('keeps meta descriptions short enough for the snippet', () => {
    for (const page of [...SOLUTIONS, SOLUTIONS_HUB, INDUSTRY_HUB]) {
      expect(page.metaDescription.length).toBeLessThanOrEqual(170);
    }
  });

  it('gives every solution a price, tiers and questions', () => {
    for (const solution of SOLUTIONS) {
      expect(solution.priceFrom).toBeGreaterThan(0);
      expect(solution.tiers.length).toBeGreaterThan(0);
      expect(solution.faq.length).toBeGreaterThanOrEqual(3);
      expect(solution.lead).toContain('₸');
    }
  });

  it('gives every industry page a pain line and AI ideas', () => {
    const industry = SOLUTIONS.filter((s) => s.group === 'industry' || s.group === 'sectors');
    expect(industry.length).toBeGreaterThanOrEqual(19);
    for (const solution of industry) {
      expect(solution.pain).toBeTruthy();
      if (solution.slug !== 'industrial-ai') expect(solution.ai?.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('keeps detailed pages honest: our row last, western numbers marked as vendor claims', () => {
    const detailed = SOLUTIONS.filter((s) => s.steps);
    expect(detailed.map((s) => s.slug)).toEqual(
      expect.arrayContaining([
        'whatsapp-email-orders-1c',
        'voice-shift-reports',
        'ai-assistant-mechanic',
        'documents-1c-ai',
        'qr-instructions-training',
        'machine-energy-monitoring',
        'concrete-plants',
        'metal-structures',
        'quote-calculation',
        'production-accounting',
        'equipment-maintenance',
        'labor-safety',
        'oilfield-services',
        'mining',
        'energy-solar',
        'grain-elevators',
        'fuel-fleet',
        'timesheets-shifts',
        'lab-quality',
      ]),
    );
    for (const solution of detailed) {
      expect(solution.steps!.length).toBeGreaterThanOrEqual(3);
      expect(solution.faq.length).toBeGreaterThanOrEqual(8);
      if (solution.compare) {
        expect(solution.compare.rows[solution.compare.rows.length - 1].name).toBe('aidardev');
        expect(solution.compare.note).toMatch(/вендор/);
      }
    }
  });

  it('shows the cargo price Aidar chose', () => {
    const cargo = SOLUTIONS.find((s) => s.slug === 'cargo-tracking');
    expect(cargo?.priceFrom).toBe(600000);
    expect(cargo?.tiers[0].price).toBe('от 600 000 ₸');
  });
});
