export const PRIMARY_WHATSAPP_NUMBER = '77066703696';

export type SiteLang = 'ru' | 'kz' | 'en';

// ---------------------------------------------------------------------------
// Source marker: "…\n\n(с сайта: /ru/services/bots)" at the end of a prefilled text,
// so a WhatsApp chat shows which page the visitor wrote from.
// ---------------------------------------------------------------------------

const SOURCE_LABELS: Record<SiteLang, string> = {
  ru: 'с сайта',
  kz: 'сайттан',
  en: 'from site',
};

/** A trailing marker in any language, together with the blank line before it. */
const TRAILING_SOURCE_MARKER = /\s*\((?:с сайта|сайттан|from site): [^()\n]*\)\s*$/;

/** /kz/… → kz, /en/… → en, anything else → ru (the default locale). */
export function langFromPath(path: string): SiteLang {
  const match = /^\/(ru|kz|en)(?=\/|$)/.exec(path);
  return match ? (match[1] as SiteLang) : 'ru';
}

/** Path only: drops origin, query and hash, so UTM tags and click ids never reach the chat. */
export function toSourcePath(pathOrUrl: string): string {
  const raw = pathOrUrl.trim();
  if (!raw) return '';

  let path = raw;
  if (/^[a-z][a-z\d+.-]*:/i.test(raw)) {
    try {
      path = new URL(raw).pathname;
    } catch {
      return '';
    }
  }
  path = path.split(/[?#]/, 1)[0];
  try {
    path = decodeURI(path);
  } catch {
    // Keep the encoded form if it is not valid percent-encoding.
  }
  if (!path.startsWith('/')) path = `/${path}`;
  return path.slice(0, 200);
}

export function formatSourceMarker(path: string, lang: SiteLang = langFromPath(path)): string {
  return `(${SOURCE_LABELS[lang]}: ${path})`;
}

/**
 * Appends the source marker for `sourcePath` (language taken from the path).
 * An existing marker is replaced, so decorating the same text twice never stacks markers.
 * Without a path (e.g. during SSR) or for an empty message the text is returned trimmed.
 */
export function withSourceMarker(message: string, sourcePath?: string | null): string {
  const text = message.trim();
  const path = sourcePath ? toSourcePath(sourcePath) : '';
  if (!text || !path) return text;

  const base = text.replace(TRAILING_SOURCE_MARKER, '').trim();
  if (!base) return text;
  return `${base}\n\n${formatSourceMarker(path)}`;
}

export interface WhatsAppUrlOptions {
  /** Defaults to PRIMARY_WHATSAPP_NUMBER. */
  phone?: string;
  /** Current page path; when set, the prefilled text gets the "(с сайта: /path)" marker. */
  sourcePath?: string | null;
}

/**
 * wa.me link with a prefilled text.
 * Second argument: a phone number (legacy form) or options with `sourcePath`.
 */
export function buildWhatsAppUrl(
  message: string,
  phoneOrOptions: string | WhatsAppUrlOptions = {},
): string {
  const options = typeof phoneOrOptions === 'string' ? { phone: phoneOrOptions } : phoneOrOptions;
  const normalizedPhone = (options.phone ?? PRIMARY_WHATSAPP_NUMBER).replace(/\D/g, '');
  const normalizedMessage = withSourceMarker(message, options.sourcePath);
  const baseUrl = `https://wa.me/${normalizedPhone}`;

  return normalizedMessage
    ? `${baseUrl}?text=${encodeURIComponent(normalizedMessage)}`
    : baseUrl;
}

const WHATSAPP_HOSTS = new Set(['wa.me', 'api.whatsapp.com']);

/**
 * Adds the source marker to the prefilled text of an existing WhatsApp link.
 * Other links, and WhatsApp links without a text, are returned unchanged.
 */
export function withWhatsAppSource(href: string, sourcePath: string): string {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return href;
  }
  if (!WHATSAPP_HOSTS.has(url.hostname.replace(/^www\./, ''))) return href;

  const text = url.searchParams.get('text');
  if (!text || !text.trim()) return href;

  const decorated = withSourceMarker(text, sourcePath);
  if (decorated === text) return href;

  const query = Array.from(url.searchParams.entries())
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(key === 'text' ? decorated : value)}`)
    .join('&');
  return `${url.origin}${url.pathname}?${query}${url.hash}`;
}

const SOURCE_TRACKING_EVENTS = ['click', 'auxclick', 'contextmenu'] as const;
let sourceTrackingUsers = 0;
let sourceTrackingListener: ((event: Event) => void) | null = null;

/**
 * Links rendered on the server cannot know the page path at build time (and adding it on the
 * client would break hydration), so right before any WhatsApp link opens — click, middle click
 * or "copy link" — its text is stamped with the current path. Idempotent with links that were
 * already built with `sourcePath`. Returns a cleanup function; safe to call from several components.
 */
export function installWhatsAppSourceTracking(): () => void {
  if (typeof document === 'undefined') return () => {};

  if (sourceTrackingUsers === 0) {
    const listener = (event: Event) => {
      const target = event.target;
      const anchor = target instanceof Element ? target.closest('a[href]') : null;
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const href = anchor.getAttribute('href') || '';
      const decorated = withWhatsAppSource(href, window.location.pathname);
      if (decorated !== href) anchor.setAttribute('href', decorated);
    };
    SOURCE_TRACKING_EVENTS.forEach((type) => document.addEventListener(type, listener, true));
    sourceTrackingListener = listener;
  }
  sourceTrackingUsers += 1;

  let released = false;
  return () => {
    if (released) return;
    released = true;
    sourceTrackingUsers -= 1;
    if (sourceTrackingUsers === 0 && sourceTrackingListener) {
      const listener = sourceTrackingListener;
      SOURCE_TRACKING_EVENTS.forEach((type) => document.removeEventListener(type, listener, true));
      sourceTrackingListener = null;
    }
  };
}

// ---------------------------------------------------------------------------
// Visitor phone numbers (lead form + /api/leads)
// ---------------------------------------------------------------------------

/** National part of a +7 number: area codes start with 3, 4, 8, 9 (RU) or 6, 7 (KZ). */
const PLUS7_NATIONAL = /^[346789]\d{9}$/;

/** Keeps what people type into a phone field: digits, "+", spaces, brackets and dashes. */
export function sanitizePhoneInput(value: string): string {
  return value.replace(/[^\d+()\-\s]/g, '').replace(/\s{2,}/g, ' ').slice(0, 24);
}

/**
 * Normalizes a visitor's phone number to E.164 ("+77071234567") or returns null.
 * Kazakhstan-friendly: "+7 707 …", "8 707 …", "8 (707) 123-45-67", "77071234567" and a bare
 * 10-digit "707 123 45 67" all become +7. Other countries are accepted in international
 * form ("+998 …" or "00998 …", 8–15 digits).
 */
export function normalizePhone(value: string): string | null {
  const trimmed = value.trim();
  let digits = trimmed.replace(/\D/g, '');
  let international = trimmed.startsWith('+');
  if (!international && digits.startsWith('00')) {
    digits = digits.slice(2);
    international = true;
  }
  if (!digits) return null;

  // +7 / 7 / 8 (trunk prefix) + 10 digits. "+8…" stays international: +81, +82, +84 numbers can be 11 digits too.
  if (digits.length === 11 && (digits[0] === '7' || (digits[0] === '8' && !international))) {
    const national = digits.slice(1);
    return PLUS7_NATIONAL.test(national) ? `+7${national}` : null;
  }
  // "707 123 45 67" without a prefix. A leading 8 here is most likely a trunk prefix with a digit missing.
  if (!international && digits.length === 10) {
    return /^[34679]\d{9}$/.test(digits) ? `+7${digits}` : null;
  }
  // +7 numbers have exactly 10 national digits; an 8… without "+" is a local number with a typo.
  if (digits[0] === '7' || digits[0] === '0' || (!international && digits[0] === '8')) return null;

  // Other countries: E.164 allows up to 15 digits; without "+" only clearly international lengths.
  const minLength = international ? 8 : 12;
  return digits.length >= minLength && digits.length <= 15 ? `+${digits}` : null;
}

export function isValidPhone(value: string): boolean {
  return normalizePhone(value) !== null;
}

/** "+77071234567" → "+7 707 123 45 67"; other valid numbers in E.164; invalid input as typed. */
export function formatPhone(value: string): string {
  const normalized = normalizePhone(value);
  if (!normalized) return value.trim();
  const plus7 = /^\+7(\d{3})(\d{3})(\d{2})(\d{2})$/.exec(normalized);
  return plus7 ? `+7 ${plus7[1]} ${plus7[2]} ${plus7[3]} ${plus7[4]}` : normalized;
}
