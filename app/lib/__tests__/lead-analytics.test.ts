import { analyticsEvents, captureFirstTouchUtm, generateLead, isLeadService, pickUtmParams } from '../analytics';

describe('generateLead', () => {
  const gtag = jest.fn();
  const ym = jest.fn();
  const originalMetrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;

  beforeEach(() => {
    gtag.mockReset();
    ym.mockReset();
    window.gtag = gtag;
    window.ym = ym;
    process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID = '12345';
  });

  afterEach(() => {
    delete window.gtag;
    delete window.ym;
    if (originalMetrikaId === undefined) delete process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
    else process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID = originalMetrikaId;
  });

  it('sends the GA4 recommended generate_lead event', () => {
    generateLead({ source: 'contact_form', service: 'bots' });
    expect(gtag).toHaveBeenCalledWith('event', 'generate_lead', {
      event_category: 'Lead',
      event_label: 'contact_form',
      lead_source: 'contact_form',
      service: 'bots',
    });
  });

  it('reaches the Yandex goal with the same name', () => {
    analyticsEvents.generateLead({ source: 'contact_form', service: 'other' });
    expect(ym).toHaveBeenCalledWith(
      12345,
      'reachGoal',
      'generate_lead',
      expect.objectContaining({ category: 'Lead', lead_source: 'contact_form', service: 'other' }),
    );
  });
});

describe('lead services', () => {
  it('accepts only the known services', () => {
    expect(isLeadService('websites')).toBe(true);
    expect(isLeadService('other')).toBe(true);
    expect(isLeadService('crypto')).toBe(false);
    expect(isLeadService(undefined)).toBe(false);
  });
});

describe('first-touch UTM', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    window.history.pushState({}, '', '/');
  });

  it('keeps only non-empty utm_* values', () => {
    expect(pickUtmParams(new URLSearchParams('utm_source=google&utm_medium=&gclid=1&utm_term=%20seo%20'))).toEqual({
      utm_source: 'google',
      utm_term: 'seo',
    });
    expect(pickUtmParams({ utm_campaign: 'brand', utm_content: 5, other: 'x' })).toEqual({ utm_campaign: 'brand' });
  });

  it('stores the landing utm_* once and keeps them on the next pages', () => {
    window.history.pushState({}, '', '/ru/services/bots?utm_source=google&utm_medium=cpc&utm_campaign=bots');
    expect(captureFirstTouchUtm()).toEqual({ utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'bots' });

    window.history.pushState({}, '', '/ru/pricing?utm_source=yandex');
    expect(captureFirstTouchUtm()).toEqual({ utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'bots' });

    window.history.pushState({}, '', '/ru');
    expect(captureFirstTouchUtm()).toEqual({ utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'bots' });
  });

  it('returns nothing for a visit without UTM', () => {
    window.history.pushState({}, '', '/ru');
    expect(captureFirstTouchUtm()).toEqual({});
    expect(window.sessionStorage.length).toBe(0);
  });

  it('falls back to the current URL when sessionStorage is blocked', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    window.history.pushState({}, '', '/kz?utm_source=instagram');
    expect(captureFirstTouchUtm()).toEqual({ utm_source: 'instagram' });
  });
});
