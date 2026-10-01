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
          'Проектируем, разрабатываем и запускаем мобильные приложения для компаний в Астане и по Казахстану. Помогаем определить первую версию, выбрать стек и зафиксировать сроки и бюджет до старта разработки.',
        primaryCta: 'Обсудить в WhatsApp',
        secondaryCta: 'Смотреть кейсы',
        sectionTitle: 'Что входит в разработку приложения в Астане',
        sectionIntro:
          'Берём на себя путь от идеи до публикации в App Store и Google Play. Вы получаете понятный процесс, ориентиры по стоимости и следующий шаг без лишней бюрократии.',
        highlights: [
          'MVP за 4-8 недель: авторизация, ключевые экраны, базовая аналитика и backend.',
          'Нативная или кроссплатформенная разработка — подбираем формат под бюджет и срок.',
          'Помогаем с публикацией в App Store и Google Play и дальнейшими обновлениями.',
        ],
        faq: [
          {
            question: 'Сколько стоит приложение в Астане?',
            answer: 'Ориентиры такие: MVP — от 800 000 ₸, приложение под Android или iOS — от 1 200 000 ₸, полноценное приложение — от 1 500 000 ₸, сложный продукт с backend — от 2 500 000 ₸. Точная оценка зависит от количества экранов, ролей, API и сценариев первой версии.',
          },
          {
            question: 'Сколько времени занимает разработка?',
            answer: 'MVP обычно занимает 1-2 месяца. Сложные приложения с backend, кабинетами и интеграциями — 3-6 месяцев. Срок фиксируем после оценки и согласования состава первой версии.',
          },
          {
            question: 'Работаете удалённо с клиентами из Астаны?',
            answer: 'Да. Встречи онлайн, демо каждую неделю, передача исходников и документации после запуска.',
          },
          {
            question: 'Что входит в первую версию приложения?',
            answer: 'Обычно в MVP входят ключевые экраны, авторизация, базовая логика, аналитика, backend API и подготовка к публикации. Не раздуваем первую версию лишними функциями, чтобы быстрее выйти в релиз.',
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
          'Создаём ботов для бизнеса в Алматы: сценарии записи, статусов заказов, FAQ и передачи заявки менеджеру. При необходимости связываем с CRM, сайтом, рекламой и Google Таблицами.',
        primaryCta: 'Обсудить в WhatsApp',
        secondaryCta: 'Смотреть кейсы',
        sectionTitle: 'Какие боты делаем для бизнеса в Алматы',
        sectionIntro:
          'Делаем ботов под задачу: от простого бота-визитки до системы с базой данных, CRM и админ-панелью.',
        highlights: [
          'Telegram-бот за 1-2 недели, WhatsApp Business — от 3 недель.',
          'Сценарии: заявка, запись, статус заказа, FAQ, уведомления и автоответы.',
          'Подключение Bitrix24, AmoCRM, Google Sheets и других систем по задаче.',
        ],
        faq: [
          {
            question: 'Сколько стоит бот в Алматы?',
            answer: 'Простой Telegram-бот — от 250 000 ₸, бизнес-бот с CRM и базой данных — от 350 000 ₸, WhatsApp-бот — от 350 000 ₸.',
          },
          {
            question: 'Можно ли принимать заявки в WhatsApp автоматически?',
            answer: 'Да. Бот отвечает на частые вопросы, собирает контакт и передаёт заявку нужному сотруднику или в CRM.',
          },
          {
            question: 'Нужен ли уже работающий сайт?',
            answer: 'Нет. Бот можно запустить отдельно. При необходимости свяжем с сайтом и рекламой.',
          },
          {
            question: 'Что может делать бот для бизнеса?',
            answer: 'Собирать заявки, отвечать на частые вопросы, записывать клиента, показывать статусы, уведомлять менеджера, отправлять данные в CRM или таблицу и помогать не терять обращения ночью и в выходные.',
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

  // EN/KZ-версии закрыты noindex (уникальный текст писали под RU), но читаются клиентами —
  // поэтому это обычный клиентский текст, а не SEO-заглушка.
  if (language === 'en') {
    if (service === 'mobile') {
      return {
        title: `Mobile app development ${cityLocative} | iOS and Android`,
        description: `Mobile app development ${cityLocative}: MVP, iOS and Android, store publishing and backend integration. Timeline and budget are estimated after a brief.`,
        h1: `Mobile app development ${cityLocative}`,
        heroLead: `iOS and Android apps for businesses ${cityLocative} — from MVP to a full product`,
        heroBody: `We design, build and launch mobile apps for companies ${cityLocative} and across Kazakhstan. We help define the first version, choose the stack and agree on the timeline and budget before development starts.`,
        primaryCta: 'Discuss on WhatsApp',
        secondaryCta: 'All mobile app services',
        sectionTitle: `What app development ${cityLocative} includes`,
        sectionIntro: 'From idea to publishing in the App Store and Google Play: a clear process, price guidance and a concrete next step.',
        highlights: [
          'MVP in 4-8 weeks: sign-in, key screens, basic analytics and backend.',
          'Native or cross-platform development — we choose the format to fit your budget and timeline.',
          'Help with App Store and Google Play publishing and further updates.',
        ],
        faq: [
          {
            question: `How much does an app cost ${cityLocative}?`,
            answer: 'As a guide: an MVP starts from 800 000 ₸, an Android or iOS app from 1 200 000 ₸, a full-featured app from 1 500 000 ₸, and a complex product with a backend from 2 500 000 ₸.',
          },
          {
            question: `Do you work remotely with clients ${cityLocative}?`,
            answer: 'Yes. Online meetings, weekly demos, and source code with documentation handed over after launch.',
          },
        ],
        keywords: [`mobile app development ${cityName.toLowerCase()}`],
        servicePath: '/en/services/mobile',
        breadcrumbs: { home: 'Home', cities: 'Cities', service: 'Mobile apps' },
      };
    }

    return {
      title: `Bot development ${cityLocative} | Telegram and WhatsApp`,
      description: `Telegram and WhatsApp bot development ${cityLocative}: enquiries, auto-replies, CRM and notifications.`,
      h1: `Bot development ${cityLocative}`,
      heroLead: 'Telegram and WhatsApp bots that take enquiries and don’t lose clients',
      heroBody: `We build bots for businesses ${cityLocative}: bookings, order statuses, FAQ and passing enquiries to a manager. Where needed, we connect them to your CRM, website, ads and Google Sheets.`,
      primaryCta: 'Discuss on WhatsApp',
      secondaryCta: 'All bot services',
      sectionTitle: `Bots we build for businesses ${cityLocative}`,
      sectionIntro: 'From a simple business-card bot to a system with a database, CRM and admin panel.',
      highlights: [
        'Telegram bot in 1-2 weeks, WhatsApp Business from 3 weeks.',
        'Scenarios: enquiries, bookings, order status, FAQ, notifications and auto-replies.',
        'Bitrix24, AmoCRM, Google Sheets and other systems connected as needed.',
      ],
      faq: [
        {
          question: `How much does a bot cost ${cityLocative}?`,
          answer: 'A simple Telegram bot starts from 250 000 ₸, a business bot with CRM and a database from 350 000 ₸, and a WhatsApp bot from 350 000 ₸.',
        },
        {
          question: 'Can WhatsApp enquiries be handled automatically?',
          answer: 'Yes. The bot answers common questions, collects contact details and passes the enquiry to the right employee or your CRM.',
        },
      ],
      keywords: [`bot development ${cityName.toLowerCase()}`],
      servicePath: '/en/services/bots',
      breadcrumbs: { home: 'Home', cities: 'Cities', service: 'Bots' },
    };
  }

  if (service === 'mobile') {
    return {
      title: `${cityLocative} мобильді қосымшалар әзірлеу | iOS және Android`,
      description: `${cityLocative} бизнеске iOS және Android қосымшаларын әзірлейміз: MVP, дүкендерге жариялау, backend интеграциясы. Мерзім мен бюджетті брифтен кейін бағалаймыз.`,
      h1: `${cityLocative} мобильді қосымшалар әзірлеу`,
      heroLead: `${cityName} қаласындағы бизнеске iOS және Android қосымшалары — MVP-ден толыққанды өнімге дейін`,
      heroBody: `${cityName} және бүкіл Қазақстан бойынша компанияларға мобильді қосымшаларды жобалап, әзірлеп, іске қосамыз. Алғашқы нұсқаны анықтауға, стекті таңдауға және әзірлеу басталғанға дейін мерзім мен бюджетті бекітуге көмектесеміз.`,
      primaryCta: 'WhatsApp-та талқылау',
      secondaryCta: 'Мобильді қосымша қызметтері',
      sectionTitle: `${cityLocative} қосымша әзірлеуге не кіреді`,
      sectionIntro: 'Идеядан App Store мен Google Play-ге жариялауға дейін: түсінікті процесс, баға бағдары және нақты келесі қадам.',
      highlights: [
        'MVP 4-8 аптада: авторизация, негізгі экрандар, базалық аналитика және backend.',
        'Нативті немесе кроссплатформалық әзірлеу — форматты бюджет пен мерзімге қарай таңдаймыз.',
        'App Store мен Google Play-ге жариялауға және кейінгі жаңартуларға көмектесеміз.',
      ],
      faq: [
        {
          question: `${cityLocative} қосымша қанша тұрады?`,
          answer: 'Бағдар ретінде: MVP — 800 000 ₸-ден, Android немесе iOS қосымшасы — 1 200 000 ₸-ден, толыққанды қосымша — 1 500 000 ₸-ден, backend-і бар күрделі өнім — 2 500 000 ₸-ден бастап.',
        },
        {
          question: `${cityLocative} клиенттермен қашықтан жұмыс істейсіз бе?`,
          answer: 'Иә. Кездесулер онлайн өтеді, демоны апта сайын көрсетеміз, іске қосқаннан кейін бастапқы код пен құжаттаманы тапсырамыз.',
        },
      ],
      keywords: [`мобильді қосымша әзірлеу ${cityName.toLowerCase()}`],
      servicePath: '/kz/services/mobile',
      breadcrumbs: { home: 'Басты бет', cities: 'Қалалар', service: 'Мобильді қосымшалар' },
    };
  }

  return {
    title: `${cityLocative} бот әзірлеу | Telegram және WhatsApp`,
    description: `${cityLocative} бизнеске Telegram және WhatsApp боттарын әзірлейміз: өтінімдер, автожауаптар, CRM, хабарландырулар.`,
    h1: `${cityLocative} бот әзірлеу`,
    heroLead: 'Өтінім қабылдайтын және клиентті жоғалтпайтын Telegram және WhatsApp боттары',
    heroBody: `${cityName} қаласындағы бизнеске боттар жасаймыз: жазылу, тапсырыс мәртебесі, жиі қойылатын сұрақтар және өтінімді менеджерге беру сценарийлері. Қажет болса, CRM-мен, сайтпен, жарнамамен және Google Кестелермен байланыстырамыз.`,
    primaryCta: 'WhatsApp-та талқылау',
    secondaryCta: 'Бот қызметтері',
    sectionTitle: `${cityLocative} бизнеске қандай боттар жасаймыз`,
    sectionIntro: 'Қарапайым визитка-боттан дерекқоры, CRM-і және админ-панелі бар жүйеге дейін.',
    highlights: [
      'Telegram-бот 1-2 аптада, WhatsApp Business — 3 аптадан бастап.',
      'Сценарийлер: өтінім, жазылу, тапсырыс мәртебесі, жиі қойылатын сұрақтар, хабарландырулар және автожауаптар.',
      'Bitrix24, AmoCRM, Google Кестелер және басқа жүйелерді міндетке қарай қосамыз.',
    ],
    faq: [
      {
        question: `${cityLocative} бот қанша тұрады?`,
        answer: 'Қарапайым Telegram-бот — 250 000 ₸-ден, CRM мен дерекқоры бар бизнес-бот — 350 000 ₸-ден, WhatsApp-бот — 350 000 ₸-ден бастап.',
      },
      {
        question: 'WhatsApp-тағы өтінімдерді автоматты түрде қабылдауға бола ма?',
        answer: 'Иә. Бот жиі қойылатын сұрақтарға жауап береді, байланыс деректерін жинайды және өтінімді тиісті қызметкерге немесе CRM-ге жібереді.',
      },
    ],
    keywords: [`бот әзірлеу ${cityName.toLowerCase()}`],
    servicePath: '/kz/services/bots',
    breadcrumbs: { home: 'Басты бет', cities: 'Қалалар', service: 'Боттар' },
  };
}

export function resolveCityService(citySlug: string, service: string) {
  const city = getCityBySlug(citySlug);
  const combo = getCityServiceCombo(citySlug, service);
  if (!city || !combo) return null;
  return { city, combo };
}
