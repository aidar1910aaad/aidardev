import { NextResponse } from 'next/server';
import { fetchBackend, getBackendUrl } from '../../lib/backend-config';
import { isLeadService, pickUtmParams, type LeadService, type UtmParams } from '../../lib/analytics';
import { langFromPath, normalizePhone, type SiteLang } from '../../lib/whatsapp';

/**
 * Lead form → backend. Validates the minimum (name, phone, lengths), adds the client ip and
 * user agent and forwards the lead to `${BACKEND}/api/leads` with the server-only BLOG_API_SECRET.
 * 201 {ok:true} · 400 validation · 429 backend rate limit (passed through) · 502 backend failure.
 * The honeypot (`website`) is forwarded as is: the backend decides what to do with bots.
 */
export const runtime = 'nodejs';
export const maxDuration = 30;

const LIMITS = {
  body: 32_000,
  name: 100,
  phoneInput: 32,
  task: 2000,
  source: 64,
  page: 300,
  website: 200,
  ip: 64,
  userAgent: 500,
} as const;

// One budget for every attempt: the visitor is waiting on the button, the form falls back to WhatsApp.
const BACKEND_TIMEOUT_MS = 10_000;
const BACKEND_ATTEMPTS = 2;

const LANGS: readonly SiteLang[] = ['ru', 'kz', 'en'];

type FieldError = 'required' | 'invalid' | 'too_long';

/** Body sent to `${BACKEND}/api/leads` */
interface LeadPayload {
  name: string;
  phone: string;
  task: string | null;
  service: LeadService;
  source: string;
  page: string | null;
  lang: SiteLang;
  utm: UtmParams;
  website: string;
  ip: string | null;
  userAgent: string | null;
}

function reply(body: Record<string, unknown>, status: number, extraHeaders: Record<string, string> = {}) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store', ...extraHeaders } });
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function pagePath(value: unknown, referer: string | null): string | null {
  let page = asString(value);
  if (!page.startsWith('/') && referer) {
    try {
      page = new URL(referer).pathname;
    } catch {
      page = '';
    }
  }
  return page.startsWith('/') ? page.slice(0, LIMITS.page) : null;
}

function clientIp(headers: Headers): string | null {
  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const ip = forwarded || headers.get('x-real-ip')?.trim();
  return ip ? ip.slice(0, LIMITS.ip) : null;
}

export async function POST(request: Request) {
  let input: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > LIMITS.body) {
      return reply({ ok: false, error: 'validation_error', fields: { body: 'too_long' } }, 400);
    }
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not an object');
    input = parsed as Record<string, unknown>;
  } catch {
    return reply({ ok: false, error: 'invalid_json' }, 400);
  }

  const fields: Record<string, FieldError> = {};

  const name = asString(input.name).replace(/\s+/g, ' ');
  if (!name) fields.name = 'required';
  else if (name.length > LIMITS.name) fields.name = 'too_long';

  const phoneInput = asString(input.phone);
  const phone = phoneInput.length <= LIMITS.phoneInput ? normalizePhone(phoneInput) : null;
  if (!phoneInput) fields.phone = 'required';
  else if (!phone) fields.phone = 'invalid';

  const task = asString(input.task);
  if (task.length > LIMITS.task) fields.task = 'too_long';

  if (Object.keys(fields).length > 0 || !phone) {
    return reply({ ok: false, error: 'validation_error', fields }, 400);
  }

  const page = pagePath(input.page, request.headers.get('referer'));
  const lang = LANGS.find((code) => code === input.lang) ?? langFromPath(page ?? '');
  const utm = input.utm && typeof input.utm === 'object' && !Array.isArray(input.utm)
    ? pickUtmParams(input.utm as Record<string, unknown>)
    : {};

  const payload: LeadPayload = {
    name,
    phone,
    task: task || null,
    service: isLeadService(input.service) ? input.service : 'other',
    source: asString(input.source).replace(/[^\w.:-]/g, '').slice(0, LIMITS.source) || 'site',
    page,
    lang,
    utm,
    website: typeof input.website === 'string' ? input.website.slice(0, LIMITS.website) : '',
    ip: clientIp(request.headers),
    userAgent: request.headers.get('user-agent')?.slice(0, LIMITS.userAgent) || null,
  };

  const secret = process.env.BLOG_API_SECRET;
  let backendUrl: string;
  try {
    if (!secret) throw new Error('BLOG_API_SECRET is not configured');
    backendUrl = `${getBackendUrl().replace(/\/+$/, '')}/api/leads`;
  } catch (error) {
    console.error('[leads] lead not forwarded:', error instanceof Error ? error.message : error);
    return reply({ ok: false, error: 'backend_unavailable' }, 502);
  }

  let response: Response;
  try {
    response = await fetchBackend(
      backendUrl,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secret}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        cache: 'no-store',
        signal: AbortSignal.timeout(BACKEND_TIMEOUT_MS),
      },
      BACKEND_ATTEMPTS,
    );
  } catch (error) {
    console.error('[leads] backend unreachable:', error instanceof Error ? error.message : error);
    return reply({ ok: false, error: 'backend_unavailable' }, 502);
  }

  if (response.status === 429) {
    const retryAfter = response.headers.get('retry-after');
    return reply({ ok: false, error: 'rate_limited' }, 429, retryAfter ? { 'Retry-After': retryAfter } : {});
  }
  if (!response.ok) {
    console.error(`[leads] backend responded ${response.status}`);
    return reply({ ok: false, error: 'backend_error' }, 502);
  }
  return reply({ ok: true }, 201);
}
