// Конфигурация для страниц услуг
// Переиспользуемая структура для всех страниц услуг

export type ServiceKey = 'websites' | 'bots' | 'ai' | 'mobile' | 'design' | 'consulting';

export interface ServiceConfig {
  key: ServiceKey;
  targetQueries: {
    ru: string[];
    en: string[];
    kz: string[];
  };
  relatedServices: ServiceKey[];
  projectExamples?: string[];
}

export const servicesConfig: Record<ServiceKey, ServiceConfig> = {
  websites: {
    key: 'websites',
    targetQueries: {
      ru: [
        'разработка сайтов казахстан',
        'разработка сайтов в казахстане',
        'разработка сайтов алматы',
        'создание сайтов астана',
        'интернет магазин казахстан',
        'как открыть интернет магазин в казахстане',
        'веб-разработка казахстан',
      ],
      en: ['web development kazakhstan', 'website development almaty', 'create website astana', 'ecommerce kazakhstan'],
      kz: ['веб-дамыту Қазақстан', 'сайт әзірлеу Алматы', 'вебсайт жасау Астана', 'интернет дүкен Қазақстан'],
    },
    relatedServices: ['bots', 'ai', 'mobile'],
    projectExamples: ['QInvesting', 'Terricon Valley', 'ASEM Makeup Artist'],
  },
  bots: {
    key: 'bots',
    targetQueries: {
      ru: [
        'telegram бот казахстан',
        'telegram бот алматы',
        'разработка ботов алматы',
        'разработка чат ботов алматы',
        'whatsapp бот алматы',
        'whatsapp бот астана',
        'создание ботов',
      ],
      en: ['telegram bot kazakhstan', 'telegram bot almaty', 'whatsapp bot astana', 'chatbot development almaty'],
      kz: ['telegram бот Қазақстан', 'telegram бот Алматы', 'whatsapp бот Астана', 'бот әзірлеу Алматы'],
    },
    relatedServices: ['websites', 'ai', 'mobile'],
    projectExamples: [],
  },
  ai: {
    key: 'ai',
    targetQueries: {
      ru: [
        'ai интеграция казахстан',
        'разработка решений на базе ai заказать',
        'gpt интеграция',
        'чатбот с искусственным интеллектом',
      ],
      en: ['ai integration kazakhstan', 'gpt integration', 'ai chatbot'],
      kz: ['ai интеграция Қазақстан', 'gpt интеграция', 'ai чатбот'],
    },
    relatedServices: ['websites', 'bots', 'mobile'],
    projectExamples: [],
  },
  mobile: {
    key: 'mobile',
    targetQueries: {
      ru: [
        'разработка мобильных приложений казахстан',
        'разработка мобильных приложений астана',
        'создание мобильных приложений астана',
        'разработка приложений астана',
        'разработка мобильных приложений алматы',
        'ios приложение алматы',
        'android приложение',
      ],
      en: ['mobile app development kazakhstan', 'mobile app astana', 'ios app almaty', 'android app'],
      kz: ['мобильді қосымша әзірлеу Қазақстан', 'мобильді қосымша Астана', 'ios қосымша Алматы', 'android қосымша'],
    },
    relatedServices: ['websites', 'ai', 'design'],
    projectExamples: ["Na'Vi Connect"],
  },
  design: {
    key: 'design',
    targetQueries: {
      ru: [
        'ui ux дизайн казахстан',
        'заказать ux дизайн сайта',
        'заказать ux-дизайн сайта',
        'ux ui дизайн заказать',
        'веб дизайн алматы',
        'редизайн сайта астана',
        'дизайн интерфейса',
      ],
      en: ['ui ux design kazakhstan', 'web design almaty', 'website redesign astana', 'ux design order'],
      kz: ['ui ux дизайн Қазақстан', 'веб дизайн Алматы', 'сайтты қайта дизайн Астана', 'ux дизайн заказать'],
    },
    relatedServices: ['websites', 'mobile', 'bots'],
    projectExamples: [],
  },
  consulting: {
    key: 'consulting',
    targetQueries: {
      ru: ['консультации по разработке казахстан', 'обучение программированию алматы', 'технические консультации астана'],
      en: ['development consulting kazakhstan', 'programming training almaty', 'technical consulting astana'],
      kz: ['әзірлеу бойынша кеңес Қазақстан', 'бағдарламалауды оқыту Алматы', 'техникалық кеңес Астана'],
    },
    relatedServices: ['websites', 'bots', 'ai'],
    projectExamples: [],
  },
};
