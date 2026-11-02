// Общие данные страниц услуг: цвета, иконки, кейсы, цена «от» из прайса.
// Без хуков — используется в серверных компонентах.
import pricingData from '../../data/pricing.json';
import type { ServiceKey } from '../../data/services-config';
import type { Language } from '../../contexts/LanguageContext';
import type { T } from '../home/shared';

export const SERVICE_KEYS: ServiceKey[] = ['websites', 'bots', 'ai', 'mobile', 'design', 'consulting'];

/** Фон карточки, линия-разделитель и цвет иконки — как у карточек услуг на главной. */
export const serviceTint: Record<ServiceKey, { bg: string; line: string; ink: string }> = {
  websites: { bg: '#ffefe3', line: '#f3d6c1', ink: '#b4232c' },
  bots: { bg: '#e8faef', line: '#c6edd5', ink: '#0e7a3a' },
  ai: { bg: '#f0edff', line: '#dcd5fa', ink: '#6d5bd0' },
  mobile: { bg: '#fff6dc', line: '#f3e0a6', ink: '#a16207' },
  design: { bg: '#ffeaf0', line: '#f8cfdc', ink: '#c0396b' },
  consulting: { bg: '#e7f5f3', line: '#c4e6e0', ink: '#0f766e' },
};

/**
 * Проекты на странице услуги. «own» — работы именно по этой услуге (сверено с описаниями в projects.ts).
 * У приложений и консультаций своих кейсов в портфолио нет — честно показываем «Работы студии».
 * С 31.10 у ИИ свои кейсы: ИИ-администратор, «Астана в 3D», «Голосовые в текст», ИИ-аналитик EvOil.
 */
export const serviceCases: Record<ServiceKey, { kind: 'own' | 'studio'; ids: string[] }> = {
  websites: { kind: 'own', ids: ['albakov-stroy', 'sana-aroma', 'boberbuild', '4car', 'inpro-engineering', 'global-solar'] },
  bots: { kind: 'own', ids: ['ai-admin-whatsapp', 'cargo-tracking', 'cyberpol-bot', 'saqtan', 'chatbot-realty'] },
  design: { kind: 'own', ids: ['habipark', 'inpro-engineering', 'bambino', 'asem-makeup', 'global-solar', 'helix-lab'] },
  ai: { kind: 'own', ids: ['ai-admin-whatsapp', 'ai-video-astana', 'wa-voice-text', 'evoil'] },
  mobile: { kind: 'studio', ids: ['karshyga', 'evoil', 'helix-lab'] },
  consulting: { kind: 'studio', ids: ['karshyga', 'qinvesting', 'terricon-valley'] },
};

type Tier = { price: number };
const tiers = (pricingData as { services: Record<string, Record<string, Tier>> }).services;

export function minPrice(service: ServiceKey): number {
  return Math.min(...Object.values(tiers[service] || {}).map((tier) => tier.price));
}

export function formatPrice(price: number, lang: Language): string {
  return lang === 'en' ? price.toLocaleString('en-US') : price.toLocaleString('ru-RU').replace(/\s/g, ' ');
}

/** «от 150 000 ₸» / «from 150,000 ₸» / «150 000 ₸-ден»; у консультаций — за час. */
export function priceFrom(price: number, lang: Language, t: T, perHour = false): string {
  return t(perHour ? 'svc.priceFromHour' : 'svc.priceFrom').replace('{price}', formatPrice(price, lang));
}

const strokeProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

const SERVICE_ICON: Record<ServiceKey, string> = {
  websites: 'M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm0 3h18M7 13h6M7 16h4',
  bots: 'M21 12a8 8 0 01-11.6 7.1L4 20l1-4.4A8 8 0 1121 12zM9 11h6M9 14h4',
  ai: 'M11 3l1.8 4.2L17 9l-4.2 1.8L11 15l-1.8-4.2L5 9l4.2-1.8L11 3zm7.5 11.5l.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8.8-1.7z',
  mobile: 'M8 2h8a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2V4a2 2 0 012-2zm3 17h2',
  design: 'M12 3a9 9 0 100 18c1 0 1.6-.8 1.6-1.7 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.7-1.6 1.6-1.6H16a5 5 0 005-5C21 6.6 17 3 12 3zM7.5 12a1 1 0 110-2 1 1 0 010 2zm3-4a1 1 0 110-2 1 1 0 010 2zm4 0a1 1 0 110-2 1 1 0 010 2z',
  consulting: 'M12 6.25v13m0-13C10.8 5.5 9.2 5 7.5 5S4.2 5.5 3 6.25v13C4.2 18.5 5.8 18 7.5 18s3.3.5 4.5 1.25m0-13C13.2 5.5 14.8 5 16.5 5s3.3.5 4.5 1.25v13C19.8 18.5 18.2 18 16.5 18s-3.3.5-4.5 1.25',
};

export function ServiceIcon({ service, className = 'h-[22px] w-[22px]' }: { service: ServiceKey; className?: string }) {
  return (
    <svg {...strokeProps} className={className}>
      <path d={SERVICE_ICON[service]} />
    </svg>
  );
}

/** Иконка карточки по её названию — та же логика, что была у старых карточек услуг. */
const TYPE_ICONS: Array<[string[], string]> = [
  [['лендинг', 'landing', 'визитк', 'business card'], 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.6a1 1 0 01.7.3l5.4 5.4a1 1 0 01.3.7V19a2 2 0 01-2 2z'],
  [['корпоратив', 'corporate', 'корпоратив'], 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5'],
  [['магазин', 'commerce', 'ecommerce', 'дүкен', 'shop', 'store'], 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'],
  [['saas', 'crm', 'платформ', 'platform'], 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z'],
  [['редизайн', 'модернизац', 'redesign', 'modernization'], 'M4 4v5h.6m15.4 2A8 8 0 004.6 9m0 0H9m11 11v-5h-.6m0 0a8 8 0 01-15.4-2m15.4 2H15'],
  [['telegram', 'whatsapp', 'бот', 'bot'], 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.4-4 8-9 8a9.9 9.9 0 01-4.3-.9L3 20l1.4-3.7C3.5 15 3 13.6 3 12c0-4.4 4-8 9-8s9 3.6 9 8z'],
  [['автоматизац', 'automation', 'автоматтанд'], 'M13 10V3L4 14h7v7l9-11h-7z'],
  [['ai', 'ии', 'жи', 'gpt', 'чатбот', 'chatbot', 'машин', 'machine'], 'M9.7 17h4.6M12 3v1m6.4 1.6l-.7.7M21 12h-1M4 12H3m3.3-5.7l-.7-.7m2.8 9.9a5 5 0 117.1 0l-.5.5a3.4 3.4 0 00-1 2.4V19a2 2 0 11-4 0v-.5c0-.9-.4-1.8-1-2.4l-.5-.5z'],
  [['изображен', 'image', 'генерац', 'generation', 'сурет'], 'M4 16l4.6-4.6a2 2 0 012.8 0L16 16m-2-2l1.6-1.6a2 2 0 012.8 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'],
  [['дизайн', 'design', 'ui', 'ux', 'интерфейс', 'interface'], 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.3M11 7.3l1.7-1.6a2 2 0 012.8 0l2.8 2.8a2 2 0 010 2.8l-8.5 8.5M7 17h.01'],
  [['поддержк', 'обслуживан', 'support', 'техническ', 'technical', 'қолдау'], 'M18.4 5.6l-3.6 3.6m0 5.6l3.6 3.6M9.2 9.2L5.6 5.6m3.6 9.2l-3.6 3.6M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z'],
  [['консультац', 'обучен', 'training', 'consulting', 'менторинг', 'mentoring', 'code review', 'архитектур', 'architecture', 'кеңес', 'оқыт'], 'M12 6.25v13m0-13C10.8 5.5 9.2 5 7.5 5S4.2 5.5 3 6.25v13C4.2 18.5 5.8 18 7.5 18s3.3.5 4.5 1.25m0-13C13.2 5.5 14.8 5 16.5 5s3.3.5 4.5 1.25v13C19.8 18.5 18.2 18 16.5 18s-3.3.5-4.5 1.25'],
  [['мобил', 'mobile', 'ios', 'android', 'қосымша', 'app'], 'M8 2h8a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2V4a2 2 0 012-2zm3 17h2'],
];
const DEFAULT_TYPE_ICON = 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z';

export function TypeIcon({ title, className = 'h-[22px] w-[22px]' }: { title: string; className?: string }) {
  // Ключ должен начинать слово: иначе «бот» находится в «разработке», а «ai» — в «maintenance».
  const words = title.toLowerCase().split(/[^a-zа-яёәғқңөұүһі0-9]+/i).filter(Boolean);
  const phrase = words.join(' ');
  const hit = (key: string) => (key.includes(' ') ? phrase.includes(key) : words.some((word) => word.startsWith(key)));
  const path = TYPE_ICONS.find(([keys]) => keys.some(hit))?.[1] ?? DEFAULT_TYPE_ICON;
  return (
    <svg {...strokeProps} className={className}>
      <path d={path} />
    </svg>
  );
}

/** Нумерованные шаги из текста процесса («Как проходит…:\n\n1. …\n2. …»); если не разобралось — null. */
export function parseSteps(text: string): { title: string; steps: string[]; rest: string[] } | null {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) return null;
  const title = /^\d+[.)]\s/.test(lines[0]) ? '' : lines[0].replace(/:$/, '');
  const steps: string[] = [];
  const rest: string[] = [];
  for (const line of title ? lines.slice(1) : lines) {
    const m = line.match(/^\d+[.)]\s+(.*)$/);
    if (m) steps.push(m[1]);
    else rest.push(line);
  }
  return steps.length >= 2 ? { title, steps, rest } : null;
}

/** Список из текста примеров («Примеры…:\n\n- …\n- …»). */
export function parseBullets(text: string): { title: string; items: string[]; rest: string[] } {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  const title = lines[0] && !/^[-•–]\s/.test(lines[0]) ? lines[0].replace(/:$/, '') : '';
  const items: string[] = [];
  const rest: string[] = [];
  for (const line of title ? lines.slice(1) : lines) {
    const m = line.match(/^[-•–]\s+(.*)$/);
    if (m) items.push(m[1]);
    else rest.push(line);
  }
  return { title, items, rest };
}
