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

// Предустановленные события для лидов (отправляются в GA4 и Яндекс.Метрику)
export const analyticsEvents = {
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

