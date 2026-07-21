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

const PRIORITY_CITY_SLUGS = new Set(['almaty', 'astana', 'shymkent', 'karaganda', 'atyrau']);

const PRIORITY_CITY_KEYWORDS_RU: Record<string, string[]> = {
  almaty: ['разработка сайтов алматы', 'создание сайта алматы', 'заказать сайт алматы'],
  astana: ['разработка сайтов астана', 'создание сайта астана', 'сайт для бизнеса астана'],
  shymkent: ['разработка сайтов шымкент', 'лендинг шымкент', 'создание сайта шымкент'],
  karaganda: ['разработка сайтов караганда', 'сайт для бизнеса караганда', 'заказать сайт караганда'],
  atyrau: ['разработка сайтов атырау', 'сайт для бизнеса атырау', 'создание сайта атырау'],
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
      heroBody: `We build fast, modern and conversion-oriented websites for businesses ${cityLocative}: landing pages, company websites, e-commerce and custom platforms. The page is adapted for regional search demand and keeps the full strength of the main site content.`,
      primaryCta: 'Discuss the project',
      secondaryCta: 'See portfolio',
      breadcrumbs: {
        home: 'Home',
        cities: 'Cities',
      },
      sectionTitle: `How We work with clients ${cityLocative}`,
      sectionIntro: `This city page is not a thin copy. It is a geo-focused landing page that keeps the strongest site sections while adapting the main intent, headings and explanatory copy for ${cityName}.`,
      highlights: [
        `Local search intent coverage for queries like "website development ${cityName}" and "create a website ${cityName}".`,
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
        {
          question: `Why create a dedicated city page for ${cityName}?`,
          answer: `A dedicated city page helps match geo-specific search intent, strengthens internal linking and gives search engines a clearer signal that the service is relevant for users searching in ${cityName}.`,
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
      heroBody: `${cityLocative} бизнеске жылдам, заманауи және конверсияға бағытталған сайттар жасаймыз: лендингтер, корпоративтік сайттар, интернет-дүкендер және жеке платформалар. Бұл бет аймақтық сұранысқа бейімделген және негізгі сайттың күшті контентін сақтайды.`,
      primaryCta: 'Жобаны талқылау',
      secondaryCta: 'Портфолионы көру',
      breadcrumbs: {
        home: 'Басты',
        cities: 'Қалалар',
      },
      sectionTitle: `${cityLocative} клиенттермен қалай жұмыс істейміз`,
      sectionIntro: `Бұл жай көшірме бет емес. Мұнда негізгі сұраныс, тақырыптар және түсіндірме мәтіндер ${cityName} қаласына бейімделіп, басты сайттың мықты бөлімдері сақталған.`,
      highlights: [
        `"${cityName} сайт әзірлеу" сияқты аймақтық іздеу сұраныстарын жабады.`,
        `Лендинг, корпоративтік сайт, интернет-дүкен, ішкі жүйе және редизайн жобаларына сай келеді.`,
        `Қашықтан толық циклмен жұмыс істейміз: талдау, прототип, әзірлеу, тестілеу, іске қосу және қолдау.`,
      ],
      faq: [
        {
          question: `${cityLocative} клиенттермен жұмыс істейсіз бе?`,
          answer: `Иә. ${cityLocative} компаниялармен қашықтан жұмыс істейміз және талдаудан бастап іске қосу мен кейінгі қолдауға дейінгі толық циклді жабамын.`,
        },
        {
          question: `${cityLocative} қандай сайттар жасай аласыз?`,
          answer: `Лендингтер, корпоративтік сайттар, каталогтар, интернет-дүкендер, әкімшілік панельдер және бизнес міндетіне сай жеке веб-платформалар жасаймыз.`,
        },
        {
          question: `Неге ${cityName} үшін бөлек бет қажет?`,
          answer: `Жеке қалалық бет геосұранысты жақсы жабады, ішкі сілтемелеуді күшейтеді және іздеу жүйесіне қызметтің ${cityName} қаласындағы пайдаланушыларға да өзекті екенін нақты көрсетеді.`,
        },
      ],
      keywords: [
        `${cityName.toLowerCase()} сайт әзірлеу`,
        `${cityName.toLowerCase()} сайт жасау`,
        `${cityName.toLowerCase()} веб әзірлеуші`,
      ],
    };
  }

  return {
    title: `Создание сайтов ${cityLocative} | Разработка сайтов ${cityName}`,
    description: `Профессиональная разработка сайтов ${cityLocative}. Лендинги, корпоративные сайты, интернет-магазины и сложные веб-системы для бизнеса ${cityLocative} и по всему Казахстану.`,
    h1: `Разработка сайтов ${cityLocative}`,
    heroLead: PRIORITY_CITY_SLUGS.has(city.slug)
      ? `Сайты ${cityLocative}, которые помогают получать заявки — не просто «красивая визитка»`
      : `Создаём сайты ${cityLocative}, которые помогают бизнесу получать заявки`,
    heroBody: `Делаем современные, быстрые и SEO-готовые сайты для компаний ${cityLocative}: лендинги, корпоративные сайты, интернет-магазины и внутренние веб-системы. Страница собрана как полноценная гео-посадочная, а не как пустой дубль, поэтому усиливает релевантность под региональные запросы.`,
    primaryCta: 'Обсудить проект',
    secondaryCta: 'Посмотреть проекты',
    breadcrumbs: {
      home: 'Главная',
      cities: 'Города',
    },
    sectionTitle: `Как студия aidardev ведёт разработку сайтов ${cityLocative}`,
    sectionIntro: `Эта страница адаптирована под городский спрос и закрывает запросы вроде "создание сайтов ${cityLocative}" и "разработка сайтов ${cityName}". При этом она не дублирует главную дословно: заголовки, интро, FAQ и перелинковка специально собраны под геозапрос.`,
    highlights: [
      `Подходит для продвижения по коммерческим запросам: "создание сайтов ${cityLocative}", "разработка сайта ${cityName}", "заказать сайт ${cityLocative}".`,
      `Используется для лендингов, корпоративных сайтов, интернет-магазинов, личных кабинетов и кастомных веб-платформ.`,
      `Работаем удаленно по полному циклу: анализ, структура, дизайн, разработка, тестирование, запуск и поддержка.`,
    ],
    faq: [
      {
        question: `Работаете ли вы с клиентами ${cityLocative}?`,
        answer: `Да, работаю с бизнесом ${cityLocative} удаленно и беру на себя полный цикл: от брифа и прототипа до запуска, аналитики и дальнейших доработок.`,
      },
      {
        question: `Какие сайты можно заказать ${cityLocative}?`,
        answer: `Можно заказать лендинг, корпоративный сайт, каталог, интернет-магазин, админ-панель или сложную веб-систему под процессы компании. Формат зависит от вашей воронки продаж и задач бизнеса.`,
      },
      {
        question: `Зачем нужна отдельная страница под ${cityName}?`,
        answer: `Отдельная городская страница лучше отвечает на геозапросы, усиливает внутреннюю перелинковку и помогает поисковику понять, что услуга релевантна пользователям, которые ищут разработку сайтов именно ${cityLocative}.`,
      },
    ],
    keywords: [
      `разработка сайтов ${cityName.toLowerCase()}`,
      `создание сайтов ${cityName.toLowerCase()}`,
      `заказать сайт ${cityName.toLowerCase()}`,
      `веб разработка ${cityName.toLowerCase()}`,
      ...(PRIORITY_CITY_KEYWORDS_RU[city.slug] || []),
    ],
  };
}
