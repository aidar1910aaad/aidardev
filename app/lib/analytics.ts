// Утилиты для отправки событий в Google Analytics 4 и Яндекс.Метрику

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
    ym?: (
      counterId: number | string,
      method: string,
      ...args: unknown[]
    ) => void;
  }
}

// Функция для отправки событий в GA4
export const trackEvent = (
  eventName: string,
  eventParams?: {
    event_category?: string;
    event_label?: string;
    value?: number;
    [key: string]: unknown;
  }
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      window.gtag('event', eventName, eventParams);
    } catch (error) {
      // Игнорируем ошибки GA (блокировщики рекламы, сетевые проблемы)
      // Это не критично для работы сайта
      if (process.env.NODE_ENV === 'development') {
        console.debug('GA4 event blocked:', eventName, error);
      }
    }
  }
};

// Функция для отправки событий в Яндекс.Метрику
export const trackYandexEvent = (
  goalName: string,
  params?: {
    [key: string]: unknown;
  }
) => {
  if (typeof window !== 'undefined' && window.ym) {
    try {
      const metrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
      if (metrikaId) {
        // Отправляем как цель (goal)
        window.ym(Number(metrikaId), 'reachGoal', goalName, params || {});
      }
    } catch (error) {
      // Игнорируем ошибки Яндекс.Метрики
      if (process.env.NODE_ENV === 'development') {
        console.debug('Yandex Metrika event blocked:', goalName, error);
      }
    }
  }
};

// Универсальная функция для отправки событий в обе системы
export const trackUniversalEvent = (
  eventName: string,
  eventParams?: {
    event_category?: string;
    event_label?: string;
    value?: number;
    [key: string]: unknown;
  }
) => {
  // Отправляем в GA4
  trackEvent(eventName, eventParams);
  
  // Отправляем в Яндекс.Метрику
  trackYandexEvent(eventName, {
    category: eventParams?.event_category || 'General',
    label: eventParams?.event_label || '',
    value: eventParams?.value || 1,
    ...eventParams,
  });
};

// ---------------------------------------------------------------------------
// Заявки: общая модель для формы, /api/leads и события generate_lead
// ---------------------------------------------------------------------------

export const LEAD_SERVICES = ['websites', 'bots', 'ai', 'mobile', 'design', 'consulting', 'other'] as const;
export type LeadService = (typeof LEAD_SERVICES)[number];

export function isLeadService(value: unknown): value is LeadService {
  return typeof value === 'string' && (LEAD_SERVICES as readonly string[]).includes(value);
}

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>>;

const UTM_STORAGE_KEY = 'aidardev:first-touch-utm';
const UTM_VALUE_MAX_LENGTH = 200;

/** utm_* из query-строки или объекта; прочие ключи и пустые значения отбрасываются */
export function pickUtmParams(source: URLSearchParams | Record<string, unknown>): UtmParams {
  const utm: UtmParams = {};
  for (const key of UTM_KEYS) {
    const raw = source instanceof URLSearchParams ? source.get(key) : source[key];
    if (typeof raw !== 'string') continue;
    const value = raw.trim().slice(0, UTM_VALUE_MAX_LENGTH);
    if (value) utm[key] = value;
  }
  return utm;
}

/**
 * First-touch UTM: utm_* посадочного URL один раз сохраняются в sessionStorage и побеждают
 * метки следующих страниц визита. Вызывается на каждой загрузке страницы (из шапки)
 * и при отправке заявки; возвращает сохранённые метки или метки текущего URL.
 */
export function captureFirstTouchUtm(): UtmParams {
  if (typeof window === 'undefined') return {};
  const current = pickUtmParams(new URLSearchParams(window.location.search));
  try {
    const stored = window.sessionStorage.getItem(UTM_STORAGE_KEY);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (parsed && typeof parsed === 'object') {
        const firstTouch = pickUtmParams(parsed as Record<string, unknown>);
        if (Object.keys(firstTouch).length) return firstTouch;
      }
    }
    if (Object.keys(current).length) {
      window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(current));
    }
  } catch {
    // sessionStorage может быть недоступен (приватный режим Safari, запрет cookies) — берём текущий URL
  }
  return current;
}

// Предустановленные события для лидов (отправляются в GA4 и Яндекс.Метрику)
export const analyticsEvents = {
  /** Подтверждённая заявка из формы (бэкенд ответил 201): рекомендуемое событие GA4 + цель Метрики */
  generateLead: ({ source, service }: { source: string; service: LeadService }) => {
    trackUniversalEvent('generate_lead', {
      event_category: 'Lead',
      event_label: source,
      lead_source: source,
      service,
    });
  },

  blogView: (slug: string, locale: string) => {
    trackUniversalEvent('blog_view', {
      event_category: 'Blog',
      event_label: slug,
      locale,
    });
  },

  blogScrollDepth: (slug: string, locale: string, depth: number) => {
    trackUniversalEvent('blog_scroll_depth', {
      event_category: 'Blog',
      event_label: slug,
      locale,
      depth,
      value: depth,
    });
  },

  blogCtaClick: (slug: string, locale: string, placement: string) => {
    trackUniversalEvent('blog_cta_click', {
      event_category: 'Lead',
      event_label: slug,
      locale,
      placement,
    });
  },

  blogRelatedClick: (slug: string, target: string, locale: string, kind: 'post' | 'service') => {
    trackUniversalEvent('blog_related_click', {
      event_category: 'Blog',
      event_label: slug,
      locale,
      target,
      kind,
    });
  },

  /** @deprecated Используйте whatsappClick — форма открывает WhatsApp, это одна конверсия */
  contactFormSubmit: (source?: string) => {
    analyticsEvents.whatsappClick('77066703696', source || 'contact_form');
  },

  chatbotOpen: () => {
    trackUniversalEvent('chatbot_open', {
      event_category: 'Engagement',
      event_label: 'AI Chat',
      value: 1,
    });
  },

  calculatePriceClick: (source?: string) => {
    trackUniversalEvent('calculate_price_click', {
      event_category: 'Lead',
      event_label: source || 'Price Calculator',
      value: 1,
    });
  },

  /** Скролл к контактам — не заявка, только навигация */
  contactButtonClick: (source?: string) => {
    trackUniversalEvent('contact_button_click', {
      event_category: 'Navigation',
      event_label: source || 'Contact Button',
      value: 1,
    });
  },

  projectView: (projectName: string) => {
    trackUniversalEvent('project_view', {
      event_category: 'Engagement',
      event_label: projectName,
      value: 1,
    });
  },

  projectLinkClick: (projectName: string, url: string) => {
    trackUniversalEvent('project_link_click', {
      event_category: 'Engagement',
      event_label: projectName,
      link_url: url,
      value: 1,
    });
  },

  // Реальные заявки: только переход в WhatsApp или звонок
  phoneCall: (phone: string, source?: string) => {
    trackUniversalEvent('phone_call', {
      event_category: 'Lead',
      event_label: phone,
      ...(source ? { source } : {}),
      value: 1,
    });
  },

  whatsappClick: (phone: string, source?: string) => {
    trackUniversalEvent('whatsapp_click', {
      event_category: 'Lead',
      event_label: phone,
      ...(source ? { source } : {}),
      value: 1,
    });
  },

  emailClick: () => {
    trackUniversalEvent('email_click', {
      event_category: 'Contact',
      event_label: 'Email',
      value: 1,
    });
  },

  telegramClick: () => {
    trackUniversalEvent('telegram_click', {
      event_category: 'Contact',
      event_label: 'Telegram',
      value: 1,
    });
  },

  linkedinClick: () => {
    trackUniversalEvent('linkedin_click', {
      event_category: 'Contact',
      event_label: 'LinkedIn',
      value: 1,
    });
  },

  createProjectClick: () => {
    trackUniversalEvent('create_project_click', {
      event_category: 'Lead',
      event_label: 'Create Project',
      value: 1,
    });
  },

  // Навигация
  scrollToSection: (section: string) => {
    trackUniversalEvent('scroll_to_section', {
      event_category: 'Navigation',
      event_label: section,
      value: 1,
    });
  },

  // Вовлеченность
  serviceExpand: (serviceName: string) => {
    trackUniversalEvent('service_expand', {
      event_category: 'Engagement',
      event_label: serviceName,
      value: 1,
    });
  },

  faqExpand: (question: string) => {
    trackUniversalEvent('faq_expand', {
      event_category: 'Engagement',
      event_label: question,
      value: 1,
    });
  },

  // Дополнительные события
  projectsShowAllToggle: (action: 'show' | 'hide') => {
    trackUniversalEvent('projects_show_all_toggle', {
      event_category: 'Engagement',
      event_label: action === 'show' ? 'Show All Projects' : 'Hide Projects',
      value: 1,
    });
  },

  projectCardView: (projectName: string) => {
    trackUniversalEvent('project_card_view', {
      event_category: 'Engagement',
      event_label: projectName,
      value: 1,
    });
  },

  // Навигация
  navigationClick: (section: string) => {
    trackUniversalEvent('navigation_click', {
      event_category: 'Navigation',
      event_label: section,
      value: 1,
    });
  },

  languageChange: (language: string) => {
    trackUniversalEvent('language_change', {
      event_category: 'Settings',
      event_label: language,
      value: 1,
    });
  },

  themeToggle: (theme: 'light' | 'dark') => {
    trackUniversalEvent('theme_toggle', {
      event_category: 'Settings',
      event_label: theme,
      value: 1,
    });
  },

  // Skills
  skillCategoryToggle: (category: string, action: 'open' | 'close') => {
    trackUniversalEvent('skill_category_toggle', {
      event_category: 'Engagement',
      event_label: category,
      action: action,
      value: 1,
    });
  },

  // Chat
  chatMessageSend: (messageLength: number) => {
    trackUniversalEvent('chat_message_send', {
      event_category: 'Engagement',
      event_label: 'AI Chat',
      message_length: messageLength,
      value: 1,
    });
  },

  chatStartOver: () => {
    trackUniversalEvent('chat_start_over', {
      event_category: 'Engagement',
      event_label: 'AI Chat',
      value: 1,
    });
  },

  // Footer
  footerLinkClick: (linkName: string) => {
    trackUniversalEvent('footer_link_click', {
      event_category: 'Navigation',
      event_label: linkName,
      value: 1,
    });
  },
};

export const generateLead = analyticsEvents.generateLead;

