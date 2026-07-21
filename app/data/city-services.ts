import { getCityBySlug, type CityEntry, type SupportedLanguage } from './cities';
import type { ServiceKey } from './services-config';

export type CityServiceKey = Extract<ServiceKey, 'mobile' | 'bots'>;

export interface CityServiceCombo {
  citySlug: string;
  service: CityServiceKey;
}

export interface CityServiceContent {
  title: string;
  description: string;
  h1: string;
  heroLead: string;
  heroBody: string;
  primaryCta: string;
  secondaryCta: string;
  sectionTitle: string;
  sectionIntro: string;
  highlights: string[];
  faq: Array<{ question: string; answer: string }>;
  keywords: string[];
  servicePath: string;
  breadcrumbs: {
    home: string;
    cities: string;
    service: string;
  };
}

export const cityServiceCombos: CityServiceCombo[] = [
  { citySlug: 'astana', service: 'mobile' },
  { citySlug: 'almaty', service: 'bots' },
];

export function getCityServiceCombo(citySlug: string, service: string) {
  return cityServiceCombos.find(
    (combo) => combo.citySlug === citySlug && combo.service === service,
  );
}

export function getCityServiceContent(
  city: CityEntry,
  service: CityServiceKey,
  language: SupportedLanguage,
): CityServiceContent | null {
  const combo = getCityServiceCombo(city.slug, service);
  if (!combo) return null;

  const cityName = city.name[language];
  const cityLocative = city.locative[language];

  if (service === 'mobile' && city.slug === 'astana') {
    if (language === 'ru') {
      return {
        title: 'Разработка мобильных приложений в Астане | iOS и Android под ключ',
        description:
          'Разработка мобильных приложений в Астане: MVP, iOS и Android, публикация в сторах, интеграция с backend. Оценка сроков и бюджета после брифа.',
        h1: 'Разработка мобильных приложений в Астане',
        heroLead: 'Создаём iOS и Android приложения для бизнеса в Астане — от MVP до полноценного продукта',
        heroBody:
          'Проектируем, разрабатываем и запускаем мобильные приложения для компаний в Астане и по Казахстану. Фиксируем объём первой версии, сроки и бюджет до старта разработки.',
        primaryCta: 'Обсудить в WhatsApp',
        secondaryCta: 'Смотреть кейсы',
        sectionTitle: 'Что входит в разработку приложения в Астане',
        sectionIntro:
          'Страница заточена под запросы вроде «разработка приложений астана» и «создание мобильных приложений астана». Вы получаете понятный процесс, цены и следующий шаг без лишней бюрократии.',
        highlights: [
          'MVP за 4–8 недель: авторизация, ключевые экраны, базовая аналитика.',
          'Нативная или кроссплатформенная разработка — выбираем под бюджет и срок.',
          'Помогаем с публикацией в App Store и Google Play.',
        ],
        faq: [
          {
            question: 'Сколько стоит приложение в Астане?',
            answer: 'Простое MVP — от 500 000 ₸, приложение средней сложности — от 1 000 000 ₸. Точная оценка после брифа и списка функций первой версии.',
          },
          {
            question: 'Сколько времени занимает разработка?',
            answer: 'MVP обычно 1–2 месяца. Сложные приложения с backend — 3–6 месяцев. Срок фиксируем в договоре после оценки.',
          },
          {
            question: 'Работаете удалённо с клиентами из Астаны?',
            answer: 'Да. Встречи онлайн, демо каждую неделю, передача исходников и документации после запуска.',
          },
        ],
        keywords: [
          'разработка мобильных приложений астана',
          'создание мобильных приложений астана',
          'разработка приложений астана',
          'mvp приложение астана',
        ],
        servicePath: '/ru/services/mobile',
        breadcrumbs: { home: 'Главная', cities: 'Города', service: 'Мобильные приложения' },
      };
    }
  }

  if (service === 'bots' && city.slug === 'almaty') {
    if (language === 'ru') {
      return {
        title: 'Разработка ботов в Алматы | Telegram и WhatsApp под ключ',
        description:
          'Разработка Telegram и WhatsApp ботов в Алматы: заявки, автоответы, CRM, уведомления. Автоматизация первой линии без потери обращений.',
        h1: 'Разработка ботов в Алматы',
        heroLead: 'Telegram и WhatsApp боты, которые принимают заявки и не теряют клиентов',
        heroBody:
          'Создаём ботов для бизнеса в Алматы: сценарии записи, статусов заказов, FAQ и передачи заявки менеджеру. Интеграция с CRM при необходимости.',
        primaryCta: 'Обсудить в WhatsApp',
        secondaryCta: 'Смотреть кейсы',
        sectionTitle: 'Какие боты делаем для бизнеса в Алматы',
        sectionIntro:
          'Закрываем запросы «разработка ботов алматы» и «чат-боты алматы»: от простого бота-визитки до системы с базой и админкой.',
        highlights: [
          'Telegram-бот за 1–2 недели, WhatsApp Business — от 3 недель.',
          'Сценарии: заявка, запись, статус заказа, FAQ, уведомления.',
          'Подключение Bitrix24, AmoCRM, Google Sheets по задаче.',
        ],
        faq: [
          {
            question: 'Сколько стоит бот в Алматы?',
            answer: 'Простой Telegram-бот — от 50 000 ₸, бот с CRM и базой — от 150 000 ₸, WhatsApp — от 200 000 ₸.',
          },
          {
            question: 'Можно ли принимать заявки в WhatsApp автоматически?',
            answer: 'Да. Бот отвечает на частые вопросы, собирает контакт и передаёт заявку нужному сотруднику или в CRM.',
          },
          {
            question: 'Нужен ли уже работающий сайт?',
            answer: 'Нет. Бот можно запустить отдельно. При необходимости свяжем с сайтом и рекламой.',
          },
        ],
        keywords: [
          'разработка ботов алматы',
          'разработка чат ботов алматы',
          'telegram бот алматы',
          'whatsapp бот алматы',
        ],
        servicePath: '/ru/services/bots',
        breadcrumbs: { home: 'Главная', cities: 'Города', service: 'Боты' },
      };
    }
  }

  if (language === 'en') {
    const serviceLabel = service === 'mobile' ? 'Mobile apps' : 'Bots';
    return {
      title: `${serviceLabel} ${cityLocative} | aidardev`,
      description: `${serviceLabel} for businesses ${cityLocative}. Discovery, development, launch and support.`,
      h1: `${serviceLabel} ${cityLocative}`,
      heroLead: `Local landing for ${cityName}`,
      heroBody: `Geo-focused page for ${service} requests in ${cityName}.`,
      primaryCta: 'Discuss on WhatsApp',
      secondaryCta: 'View projects',
      sectionTitle: `How we deliver ${service} ${cityLocative}`,
      sectionIntro: `Adapted for regional search demand in ${cityName}.`,
      highlights: ['Fixed scope for v1', 'Weekly demos', 'Launch support'],
      faq: [
        { question: `Do you work ${cityLocative}?`, answer: 'Yes, fully remote with online demos.' },
      ],
      keywords: [`${service} ${cityName.toLowerCase()}`],
      servicePath: `/en/services/${service}`,
      breadcrumbs: { home: 'Home', cities: 'Cities', service: serviceLabel },
    };
  }

  const serviceLabelKz = service === 'mobile' ? 'Мобильді қосымшалар' : 'Боттар';
  return {
    title: `${serviceLabelKz} ${cityLocative} | aidardev`,
    description: `${cityLocative} ${serviceLabelKz.toLowerCase()} әзірлеу.`,
    h1: `${cityLocative} ${serviceLabelKz.toLowerCase()} әзірлеу`,
    heroLead: `${cityName} қаласындағы бизнес үшін`,
    heroBody: `${cityName} үшін гео-ориентирленген посадка.`,
    primaryCta: 'WhatsApp-та талқылау',
    secondaryCta: 'Кейстер',
    sectionTitle: `${cityLocative} қалай жұмыс істейміз`,
    sectionIntro: `${cityName} бойынша аймақтық сұранысқа бейімделген.`,
    highlights: ['MVP', 'Интеграция', 'Қолдау'],
    faq: [{ question: `${cityLocative} жұмыс істейсіз бе?`, answer: 'Иә, толық дистанционно.' }],
    keywords: [`${city.slug} ${service}`],
    servicePath: `/kz/services/${service}`,
    breadcrumbs: { home: 'Басты', cities: 'Қалалар', service: serviceLabelKz },
  };
}

export function resolveCityService(citySlug: string, service: string) {
  const city = getCityBySlug(citySlug);
  const combo = getCityServiceCombo(citySlug, service);
  if (!city || !combo) return null;
  return { city, combo };
}
