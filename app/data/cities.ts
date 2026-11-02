import { cityIndustryProfiles, resolveCityFaq } from './city-industries';

export type SupportedLanguage = 'ru' | 'en' | 'kz';

export interface CityEntry {
  slug: string;
  name: {
    ru: string;
    en: string;
    kz: string;
  };
  locative: {
    ru: string;
    en: string;
    kz: string;
  };
}

export interface CityLandingContent {
  title: string;
  description: string;
  h1: string;
  heroLead: string;
  heroBody: string;
  primaryCta: string;
  secondaryCta: string;
  breadcrumbs: {
    home: string;
    cities: string;
  };
  sectionTitle: string;
  sectionIntro: string;
  highlights: string[];
  // Отдельная (не "01/02/03") панель отраслевой экспертизы региона — заполнена
  // только там, где есть реальный отраслевой профиль в city-industries.ts.
  industryPanel?: {
    eyebrow: string;
    services: Array<{ name: string; description: string }>;
  };
  faq: Array<{
    question: string;
    answer: string;
  }>;
  keywords: string[];
}

export const cityEntries: CityEntry[] = [
  { slug: 'almaty', name: { ru: 'Алматы', en: 'Almaty', kz: 'Алматы' }, locative: { ru: 'в Алматы', en: 'in Almaty', kz: 'Алматыда' } },
  { slug: 'astana', name: { ru: 'Астана', en: 'Astana', kz: 'Астана' }, locative: { ru: 'в Астане', en: 'in Astana', kz: 'Астанада' } },
  { slug: 'shymkent', name: { ru: 'Шымкент', en: 'Shymkent', kz: 'Шымкент' }, locative: { ru: 'в Шымкенте', en: 'in Shymkent', kz: 'Шымкентте' } },
  { slug: 'aktobe', name: { ru: 'Актобе', en: 'Aktobe', kz: 'Актобе' }, locative: { ru: 'в Актобе', en: 'in Aktobe', kz: 'Актөбеде' } },
  { slug: 'karaganda', name: { ru: 'Караганда', en: 'Karaganda', kz: 'Қарағанды' }, locative: { ru: 'в Караганде', en: 'in Karaganda', kz: 'Қарағандыда' } },
  { slug: 'taraz', name: { ru: 'Тараз', en: 'Taraz', kz: 'Тараз' }, locative: { ru: 'в Таразе', en: 'in Taraz', kz: 'Таразда' } },
  { slug: 'semey', name: { ru: 'Семей', en: 'Semey', kz: 'Семей' }, locative: { ru: 'в Семее', en: 'in Semey', kz: 'Семейде' } },
  { slug: 'ust-kamenogorsk', name: { ru: 'Усть-Каменогорск', en: 'Ust-Kamenogorsk', kz: 'Оскемен' }, locative: { ru: 'в Усть-Каменогорске', en: 'in Ust-Kamenogorsk', kz: 'Оскеменде' } },
  { slug: 'kyzylorda', name: { ru: 'Кызылорда', en: 'Kyzylorda', kz: 'Қызылорда' }, locative: { ru: 'в Кызылорде', en: 'in Kyzylorda', kz: 'Қызылордада' } },
  { slug: 'uralsk', name: { ru: 'Уральск', en: 'Uralsk', kz: 'Орал' }, locative: { ru: 'в Уральске', en: 'in Uralsk', kz: 'Оралда' } },
  { slug: 'kostanay', name: { ru: 'Костанай', en: 'Kostanay', kz: 'Қостанай' }, locative: { ru: 'в Костанае', en: 'in Kostanay', kz: 'Қостанайда' } },
  { slug: 'atyrau', name: { ru: 'Атырау', en: 'Atyrau', kz: 'Атырау' }, locative: { ru: 'в Атырау', en: 'in Atyrau', kz: 'Атырауда' } },
  { slug: 'petropavlovsk', name: { ru: 'Петропавловск', en: 'Petropavlovsk', kz: 'Петропавл' }, locative: { ru: 'в Петропавловске', en: 'in Petropavlovsk', kz: 'Петропавлда' } },
  { slug: 'aktau', name: { ru: 'Актау', en: 'Aktau', kz: 'Ақтау' }, locative: { ru: 'в Актау', en: 'in Aktau', kz: 'Ақтауда' } },
  { slug: 'temirtau', name: { ru: 'Темиртау', en: 'Temirtau', kz: 'Теміртау' }, locative: { ru: 'в Темиртау', en: 'in Temirtau', kz: 'Теміртауда' } },
  { slug: 'kokshetau', name: { ru: 'Кокшетау', en: 'Kokshetau', kz: 'Көкшетау' }, locative: { ru: 'в Кокшетау', en: 'in Kokshetau', kz: 'Көкшетауда' } },
  { slug: 'turkistan', name: { ru: 'Туркестан', en: 'Turkistan', kz: 'Түркістан' }, locative: { ru: 'в Туркестане', en: 'in Turkistan', kz: 'Түркістанда' } },
  { slug: 'taldykorgan', name: { ru: 'Талдыкорган', en: 'Taldykorgan', kz: 'Талдықорған' }, locative: { ru: 'в Талдыкоргане', en: 'in Taldykorgan', kz: 'Талдықорғанда' } },
  { slug: 'pavlodar', name: { ru: 'Павлодар', en: 'Pavlodar', kz: 'Павлодар' }, locative: { ru: 'в Павлодаре', en: 'in Pavlodar', kz: 'Павлодарда' } },
  { slug: 'ekibastuz', name: { ru: 'Экибастуз', en: 'Ekibastuz', kz: 'Екібастұз' }, locative: { ru: 'в Экибастузе', en: 'in Ekibastuz', kz: 'Екібастұзда' } },
  { slug: 'rudny', name: { ru: 'Рудный', en: 'Rudny', kz: 'Рудный' }, locative: { ru: 'в Рудном', en: 'in Rudny', kz: 'Рудныйда' } },
  { slug: 'zhanaozen', name: { ru: 'Жанаозен', en: 'Zhanaozen', kz: 'Жанаозен' }, locative: { ru: 'в Жанаозене', en: 'in Zhanaozen', kz: 'Жанаөзенде' } },
  { slug: 'zhezkazgan', name: { ru: 'Жезказган', en: 'Zhezkazgan', kz: 'Жезқазған' }, locative: { ru: 'в Жезказгане', en: 'in Zhezkazgan', kz: 'Жезқазғанда' } },
  { slug: 'kentau', name: { ru: 'Кентау', en: 'Kentau', kz: 'Кентау' }, locative: { ru: 'в Кентау', en: 'in Kentau', kz: 'Кентауда' } },
  { slug: 'satpayev', name: { ru: 'Сатпаев', en: 'Satpayev', kz: 'Сәтбаев' }, locative: { ru: 'в Сатпаеве', en: 'in Satpayev', kz: 'Сәтбаевта' } },
  { slug: 'konaev', name: { ru: 'Конаев', en: 'Konaev', kz: 'Қонаев' }, locative: { ru: 'в Конаеве (Капчагае)', en: 'in Konaev', kz: 'Қонаевта' } },
  { slug: 'talgar', name: { ru: 'Талгар', en: 'Talgar', kz: 'Талғар' }, locative: { ru: 'в Талгаре', en: 'in Talgar', kz: 'Талғарда' } },
  { slug: 'baikonur', name: { ru: 'Байконур', en: 'Baikonur', kz: 'Байқоңыр' }, locative: { ru: 'в Байконуре', en: 'in Baikonur', kz: 'Байқоңырда' } },
];

export function getCityBySlug(slug: string) {
  return cityEntries.find((city) => city.slug === slug);
}

/**
 * Города, чьи RU-страницы остаются в поиске: у них были показы в Google
 * (Search Console, июль–сентябрь 2026). Остальные города и все EN/KZ-копии
 * (их тексты совпадают на 63–100%) открываются, но закрыты noindex и не попадают в sitemap.
 */
export const INDEXED_CITY_SLUGS = new Set([
  'astana',
  'almaty',
  'atyrau',
  'aktau',
  'semey',
  'pavlodar',
  'taraz',
  'shymkent',
  'kostanay',
  'karaganda',
]);

export function isCityIndexable(slug: string, lang: string): boolean {
  return lang === 'ru' && INDEXED_CITY_SLUGS.has(slug);
}

const PRIORITY_CITY_SLUGS = new Set(['almaty', 'astana', 'shymkent', 'karaganda', 'atyrau']);

const PRIORITY_CITY_KEYWORDS_RU: Record<string, string[]> = {
  almaty: ['разработка сайтов алматы', 'создание сайта алматы', 'заказать сайт алматы'],
  astana: ['разработка сайтов астана', 'создание сайта астана', 'сайт для бизнеса астана'],
  shymkent: ['разработка сайтов шымкент', 'лендинг шымкент', 'создание сайта шымкент'],
  karaganda: ['разработка сайтов караганда', 'сайт для бизнеса караганда', 'заказать сайт караганда'],
  atyrau: ['разработка сайтов атырау', 'сайт для бизнеса атырау', 'создание сайта атырау'],
};

/**
 * Дополнительные вопросы для городов, чья страница уже на 3–11 месте по длинным запросам
 * (Search Console, сентябрь 2026: «разработка сайтов в астане с нуля / качество», «разработка и сопровождение
 * сайтов в астане», «создание адаптивного сайта астана», «разработка сайта астана дизайн»).
 * Ответы — только то, что уже обещано на сайте: этапы и карточки услуги «Сайты», landing.included, прайс.
 */
const EXTRA_CITY_FAQ_RU: Record<string, (cityLocative: string) => CityLandingContent['faq']> = {
  astana: (cityLocative) => [
    {
      question: `Можно заказать сайт ${cityLocative} с нуля или доработать существующий?`,
      answer: 'Да, оба варианта. С нуля — бриф, структура и прототип, дизайн, разработка, тестирование и запуск. Если сайт уже есть — делаем редизайн и модернизацию: новый дизайн, скорость, адаптивность, SEO. Редизайн — от 200 000 ₸.',
    },
    {
      question: 'Сайт будет адаптивным — удобным на телефоне?',
      answer: 'Да. Адаптивный дизайн входит в разработку: сайт одинаково удобен на телефоне, планшете и компьютере, а перед запуском мы его тестируем.',
    },
    {
      question: 'Дизайн сайта тоже делаете вы?',
      answer: 'Да, дизайн делаем сами: структура и прототип, дизайн и согласование ключевых экранов, адаптивная вёрстка. Если нужен только дизайн — это отдельная услуга.',
    },
    {
      question: 'Сопровождаете сайт после запуска?',
      answer: 'Да. В каждый проект входит гарантия 1–3 месяца после запуска. Дальше — техническая поддержка: обновления, исправление ошибок, резервные копии и доработки — от разовой помощи до полного сопровождения.',
    },
    {
      question: 'Как вы отвечаете за качество сайта?',
      answer: 'Работаем по договору с объёмом, сроками и графиком оплаты. Ключевые экраны согласуем до разработки, сайт тестируем перед запуском, код документируем и передаём вам, после запуска действует гарантия 1–3 месяца.',
    },
  ],
};

export function getCityLandingContent(city: CityEntry, language: SupportedLanguage): CityLandingContent {
  const cityName = city.name[language];
  const cityLocative = city.locative[language];

  if (language === 'en') {
    return {
      title: `Website Development ${cityName} | Create a Website ${cityName}`,
      description: `Website development ${cityLocative}. Landing pages, corporate websites, e-commerce and custom web systems for businesses in ${cityName} and across Kazakhstan.`,
      h1: `Website Development ${cityLocative}`,
      heroLead: `Create a website ${cityLocative} with a strong sales focus`,
      heroBody: `We build fast, modern and conversion-oriented websites for businesses ${cityLocative}: landing pages, company websites, e-commerce and custom platforms. We help you choose the right format, estimate the timeline and budget, and then launch the first version without unnecessary red tape.`,
      primaryCta: 'Discuss the project',
      secondaryCta: 'See portfolio',
      breadcrumbs: {
        home: 'Home',
        cities: 'Cities',
      },
      sectionTitle: `How we work with clients ${cityLocative}`,
      sectionIntro: `Straight answers for businesses ${cityLocative}: what we can build, how long it takes, and what drives the price.`,
      highlights: [
        `We work with businesses ${cityLocative} fully remotely: brief, prototype and progress updates, no in-person meetings required.`,
        `Suitable for landing pages, corporate websites, e-commerce, internal systems and redesign projects.`,
        `Remote workflow is fully covered: discovery, prototyping, development, QA, launch and support.`,
      ],
      faq: [
        {
          question: `Do you work with clients ${cityLocative}?`,
          answer: `Yes. We work with businesses ${cityLocative} remotely and cover the full delivery cycle: discovery, UX, development, testing, launch and further improvements.`,
        },
        {
          question: `What kind of websites can you build for companies ${cityLocative}?`,
          answer: `We build landing pages, corporate websites, catalogs, e-commerce stores, admin dashboards and custom web platforms depending on the business model and growth stage.`,
        },
      ],
      keywords: [
        `website development ${cityName.toLowerCase()}`,
        `create a website ${cityName.toLowerCase()}`,
        `web developer ${cityName.toLowerCase()}`,
      ],
    };
  }

  if (language === 'kz') {
    return {
      title: `${cityName} сайт әзірлеу | ${cityName} сайт жасау`,
      description: `${cityLocative} сайт әзірлеу. Лендингтер, корпоративтік сайттар, интернет-дүкендер және бизнеске арналған жеке веб-жүйелер.`,
      h1: `${cityLocative} сайт әзірлеу`,
      heroLead: `${cityLocative} бизнеске арналған заманауи сайттар`,
      heroBody: `${cityLocative} бизнеске жылдам, заманауи және конверсияға бағытталған сайттар жасаймыз: лендингтер, корпоративтік сайттар, интернет-дүкендер және жеке платформалар. Сайт форматын таңдауға, мерзім мен құнды бағалауға көмектесеміз, содан кейін алғашқы нұсқасын артық әуре-сарсаңсыз іске қосамыз.`,
      primaryCta: 'Жобаны талқылау',
      secondaryCta: 'Портфолионы көру',
      breadcrumbs: {
        home: 'Басты',
        cities: 'Қалалар',
      },
      sectionTitle: `${cityLocative} клиенттермен қалай жұмыс істейміз`,
      sectionIntro: `${cityLocative} бизнеске нақты жауаптар: не істей аламыз, қанша уақыт кетеді және баға неге байланысты.`,
      highlights: [
        `${cityLocative} бизнеспен толық қашықтан жұмыс істейміз: бриф, прототип және жоба барысы — жеке кездесусіз.`,
        `Лендинг, корпоративтік сайт, интернет-дүкен, ішкі жүйе және редизайн жобаларына сай келеді.`,
        `Қашықтан толық циклмен жұмыс істейміз: талдау, прототип, әзірлеу, тестілеу, іске қосу және қолдау.`,
      ],
      faq: [
        {
          question: `${cityLocative} клиенттермен жұмыс істейсіз бе?`,
          answer: `Иә. ${cityLocative} компаниялармен қашықтан жұмыс істейміз және талдаудан бастап іске қосу мен кейінгі қолдауға дейінгі толық циклді өзіміз атқарамыз.`,
        },
        {
          question: `${cityLocative} қандай сайттар жасай аласыз?`,
          answer: `Лендингтер, корпоративтік сайттар, каталогтар, интернет-дүкендер, әкімшілік панельдер және бизнес міндетіне сай жеке веб-платформалар жасаймыз.`,
        },
      ],
      keywords: [
        `${cityName.toLowerCase()} сайт әзірлеу`,
        `${cityName.toLowerCase()} сайт жасау`,
        `${cityName.toLowerCase()} веб әзірлеуші`,
      ],
    };
  }

  const priorityKeywords = PRIORITY_CITY_KEYWORDS_RU[city.slug] || [];
  const prefersOrder = priorityKeywords.some((k) => k.includes('заказать'));
  const prefersCreate = priorityKeywords.some((k) => k.includes('создание'));

  // Отраслевой профиль региона (нефтесервис на западе, зерно на севере, металлургия
  // в центре и т.д.) — делает страницу города содержательно уникальной, а не просто
  // шаблоном с подставленным названием. См. app/data/city-industries.ts.
  const industryProfile = cityIndustryProfiles[city.slug];
  const industryFaq = resolveCityFaq(city.slug, cityLocative);

  return {
    title: `Создание сайтов ${cityLocative} | Разработка сайтов ${cityName}`,
    description: `Профессиональная разработка сайтов ${cityLocative}. Лендинги, корпоративные сайты, интернет-магазины и сложные веб-системы для бизнеса ${cityLocative} и по всему Казахстану. Сроки и стоимость — после брифа.`,
    // Подстраиваем главный заголовок под наиболее коммерческие формулировки из GSC:
    // "заказать сайт ...", "создание сайтов ..." vs "разработка сайтов ...".
    h1: prefersOrder
      ? `Заказать сайт ${cityLocative}`
      : prefersCreate
        ? `Создание сайтов ${cityLocative}`
        : `Разработка сайтов ${cityLocative}`,
    heroLead: PRIORITY_CITY_SLUGS.has(city.slug)
      ? `Сайты ${cityLocative}, которые помогают получать заявки, а не просто закрывают пункт «нужен сайт»`
      : `Создаём сайты ${cityLocative}, которые помогают бизнесу получать заявки`,
    heroBody: `Делаем современные, быстрые и SEO-готовые сайты для компаний ${cityLocative}: лендинги, корпоративные сайты, интернет-магазины и внутренние веб-системы. Помогаем определить формат сайта, оценить сроки и стоимость, а затем собрать первую версию без лишней бюрократии.`,
    primaryCta: 'Обсудить проект',
    secondaryCta: 'Посмотреть проекты',
    breadcrumbs: {
      home: 'Главная',
      cities: 'Города',
    },
    sectionTitle: `Как студия aidardev ведёт разработку сайтов ${cityLocative}`,
    sectionIntro: `Ниже — конкретные ответы для бизнеса ${cityLocative}: что можно сделать, сколько это занимает и от чего зависит стоимость.`,
    highlights: [
      `Работаем с бизнесом ${cityLocative} полностью удалённо: бриф, прототип и статус проекта — без обязательных личных встреч, если так удобнее.`,
      `Делаем лендинги, корпоративные сайты, интернет-магазины, личные кабинеты и кастомные веб-платформы.`,
      `Ведём проект по полному циклу: анализ задачи, структура, дизайн, разработка, тестирование, запуск и поддержка после сдачи.`,
    ],
    ...(industryProfile
      ? {
          industryPanel: {
            eyebrow: 'Отрасли региона',
            services: industryProfile.services,
          },
        }
      : {}),
    faq: [
      {
        question: `Работаете ли вы с клиентами ${cityLocative}?`,
        answer: `Да, работаем с бизнесом ${cityLocative} удалённо и берём на себя полный цикл: от брифа и прототипа до запуска, аналитики и дальнейших доработок.`,
      },
      {
        question: `Какие сайты можно заказать ${cityLocative}?`,
        answer: `Можно заказать лендинг, корпоративный сайт, каталог, интернет-магазин, админ-панель или сложную веб-систему под процессы компании. Формат зависит от вашей воронки продаж и задач бизнеса.`,
      },
      {
        question: `Сколько времени занимает создание сайта ${cityLocative}?`,
        answer: `Обычно лендинг занимает 1-2 недели, многостраничный сайт — 3-4 недели, интернет-магазин — от 1 месяца. Если нужны личные кабинеты, CRM или нестандартная логика, срок увеличивается и фиксируется после оценки.`,
      },
      {
        question: `Сколько стоит создать сайт ${cityLocative}?`,
        answer: `Стоимость зависит от объёма работ и состава функций. Для ориентира: сайт-визитка от 45 000 ₸, корпоративный сайт от 90 000 ₸, интернет-магазин от 120 000 ₸. Точную смету уточняем после брифа.`,
      },
      ...(EXTRA_CITY_FAQ_RU[city.slug]?.(cityLocative) ?? []),
      ...(industryFaq ? [industryFaq] : []),
    ],
    keywords: [
      `разработка сайтов ${cityName.toLowerCase()}`,
      `создание сайтов ${cityName.toLowerCase()}`,
      `заказать сайт ${cityName.toLowerCase()}`,
      `веб разработка ${cityName.toLowerCase()}`,
      ...(PRIORITY_CITY_KEYWORDS_RU[city.slug] || []),
      ...(industryProfile?.keywords || []),
    ],
  };
}
