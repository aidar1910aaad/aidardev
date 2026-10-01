/**
 * @jest-environment ./app/api/leads/__tests__/node-environment.mjs
 */
import { POST } from '../route';

const BACKEND_URL = 'https://api.test';
const SECRET = 'test-secret';

const validLead = {
  name: '  Айгерим  ',
  phone: '8 (707) 123-45-67',
  task: 'Нужен сайт для салона',
  service: 'websites',
  source: 'contact_form',
  page: '/ru/cities/almaty',
  lang: 'ru',
  utm: { utm_source: 'google', utm_campaign: 'brand', gclid: 'not-utm' },
  website: '',
};

function leadRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request('http://localhost/api/leads', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': '203.0.113.7, 10.0.0.1',
      'user-agent': 'jest-agent/1.0',
      ...headers,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('POST /api/leads', () => {
  const originalEnv = process.env;
  const mockFetch = jest.fn();

  const sentBody = (call = 0) => JSON.parse(mockFetch.mock.calls[call][1].body as string);

  beforeEach(() => {
    process.env = { ...originalEnv, BLOG_API_SECRET: SECRET, BACKEND_API_URL: BACKEND_URL };
    mockFetch.mockReset();
    global.fetch = mockFetch as unknown as typeof fetch;
    // No real pauses between fetchBackend retries.
    jest.spyOn(global, 'setTimeout').mockImplementation(((fn: () => void) => {
      fn();
      return 0;
    }) as unknown as typeof setTimeout);
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  it('forwards a valid lead to the backend with the secret and answers 201', async () => {
    mockFetch.mockResolvedValue(new Response(JSON.stringify({ id: 42 }), { status: 201 }));

    const response = await POST(leadRequest(validLead));

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ ok: true });
    expect(mockFetch).toHaveBeenCalledTimes(1);

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe(`${BACKEND_URL}/api/leads`);
    expect(init.method).toBe('POST');
    expect(init.headers).toMatchObject({
      Authorization: `Bearer ${SECRET}`,
      'Content-Type': 'application/json',
    });
    expect(sentBody()).toEqual({
      name: 'Айгерим',
      phone: '+77071234567',
      task: 'Нужен сайт для салона',
      service: 'websites',
      source: 'contact_form',
      page: '/ru/cities/almaty',
      lang: 'ru',
      utm: { utm_source: 'google', utm_campaign: 'brand' },
      website: '',
      ip: '203.0.113.7',
      userAgent: 'jest-agent/1.0',
    });
  });

  it('passes the honeypot through and lets the backend decide', async () => {
    mockFetch.mockResolvedValue(new Response(null, { status: 201 }));

    const response = await POST(leadRequest({ ...validLead, website: 'https://spam.example' }));

    expect(response.status).toBe(201);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(sentBody().website).toBe('https://spam.example');
  });

  it('answers 502 when the backend keeps failing', async () => {
    mockFetch.mockResolvedValue(new Response('boom', { status: 500 }));

    const response = await POST(leadRequest(validLead));

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ ok: false, error: 'backend_error' });
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('answers 502 when the backend is unreachable', async () => {
    mockFetch.mockRejectedValue(new TypeError('fetch failed'));

    const response = await POST(leadRequest(validLead));

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ ok: false, error: 'backend_unavailable' });
  });

  it('treats a backend 4xx as a failure so the form falls back to WhatsApp', async () => {
    mockFetch.mockResolvedValue(new Response('{"message":"bad"}', { status: 400 }));

    const response = await POST(leadRequest(validLead));

    expect(response.status).toBe(502);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('passes a backend 429 through with Retry-After', async () => {
    mockFetch.mockResolvedValue(new Response(null, { status: 429, headers: { 'Retry-After': '60' } }));

    const response = await POST(leadRequest(validLead));

    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('60');
    expect(await response.json()).toEqual({ ok: false, error: 'rate_limited' });
  });

  it('answers 502 without calling the backend when the secret is missing', async () => {
    delete process.env.BLOG_API_SECRET;

    const response = await POST(leadRequest(validLead));

    expect(response.status).toBe(502);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('rejects a missing name and an invalid phone with 400', async () => {
    const response = await POST(leadRequest({ ...validLead, name: '   ', phone: '12345' }));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      ok: false,
      error: 'validation_error',
      fields: { name: 'required', phone: 'invalid' },
    });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('rejects overlong fields with 400', async () => {
    const response = await POST(leadRequest({ ...validLead, name: 'a'.repeat(101), task: 'b'.repeat(2001) }));

    expect(response.status).toBe(400);
    expect((await response.json()).fields).toEqual({ name: 'too_long', task: 'too_long' });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('rejects a body that is not a JSON object with 400', async () => {
    expect((await POST(leadRequest('not json'))).status).toBe(400);
    expect((await POST(leadRequest([validLead]))).status).toBe(400);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('normalizes unknown values instead of failing the lead', async () => {
    mockFetch.mockResolvedValue(new Response(null, { status: 201 }));

    const response = await POST(
      leadRequest(
        { name: 'Aidar', phone: '+7 707 123 45 67', service: 'hacking', lang: 'de', utm: 'utm_source=x', source: '<script>' },
        { 'x-forwarded-for': '', 'x-real-ip': '198.51.100.4', referer: 'https://www.aidardev.kz/kz/services/bots?utm_source=x' },
      ),
    );

    expect(response.status).toBe(201);
    expect(sentBody()).toMatchObject({
      task: null,
      service: 'other',
      source: 'script',
      page: '/kz/services/bots',
      lang: 'kz',
      utm: {},
      website: '',
      ip: '198.51.100.4',
    });
  });
});
