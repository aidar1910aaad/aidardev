export interface Project {
  id: string;
  title: {
    en: string;
    ru: string;
    kz: string;
  };
  description: {
    en: string;
    ru: string;
    kz: string;
  };
  tech: string[];
  image: string;
  github?: string;
  live?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: 'global-solar',
    title: {
      en: 'Global Solar',
      ru: 'Global Solar',
      kz: 'Global Solar',
    },
    description: {
      en: 'Corporate website for a solar energy company: 4-step ROI calculator, project showcase, blog, RU/KZ localization and lead generation for B2B and B2C clients across Kazakhstan',
      ru: 'Корпоративный сайт компании по солнечной энергетике: калькулятор окупаемости СЭС в 4 шага, каталог проектов, блог, RU/KZ и заявки для B2B и частных клиентов по Казахстану',
      kz: 'Күн энергетикасы компаниясының корпоративтік сайты: 4 қадамдық окупаемость калькуляторы, жобалар каталогы, блог, RU/KZ және B2B клиенттерге арналған өтінімдер',
    },
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'ROI Calculator'],
    image: '/portfolio/global-solar.webp',
    live: 'https://www.globalsolar.kz/',
    featured: true,
  },
  {
    id: 'chatbot-realty',
    title: {
      en: 'Realty WhatsApp Bot',
      ru: 'WhatsApp-бот для ЖК',
      kz: 'ЖК WhatsApp-боты',
    },
    description: {
      en: 'WhatsApp chatbot for a construction company: apartment price calculation by payment plan (30%/100%), viewing booking and automatic handoff to a sales manager',
      ru: 'WhatsApp-бот для строительной компании: расчёт стоимости квартиры по типу оплаты (30%/100%), запись на просмотр и автоматическая передача заявки менеджеру',
      kz: 'Құрылыс компаниясы үшін WhatsApp-бот: төлем түрі бойынша пәтер бағасын есептеу, қарауға жазылу және өтінімді менеджерге жіберу',
    },
    tech: ['WhatsApp', 'Chatbot', 'Lead Gen', 'Automation'],
    image: '/portfolio/chatbot-realty.webp',
    featured: true,
  },
  {
    id: 'inpro-engineering',
    title: {
      en: 'INPRO Engineering',
      ru: 'INPRO Engineering',
      kz: 'INPRO Engineering',
    },
    description: {
      en: 'Premium B2B website for oil & gas engineering: reference projects with metrics on the hero, photo gallery, competencies, FAQ and lead forms for Kashagan, Kozhasai and Tengiz projects',
      ru: 'Premium B2B-сайт для нефтегазового инжиниринга: референс-проекты с метриками на hero, фотогалерея объектов, компетенции, FAQ и заявки — Кашаган, Кожасай, Тенгиз',
      kz: 'Мұнай-газ инжинирингіне арналған premium B2B сайт: hero-да метрикалары бар референс-жобалар, фотогалерея, компетенциялар, FAQ және өтінім формалары',
    },
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Corporate B2B'],
    image: '/portfolio/inpro.webp',
    live: 'https://www.inpro.kz/',
    featured: true,
  },
  {
    id: 'aetz',
    title: {
      en: 'AETZ',
      ru: 'АЭТЗ',
      kz: 'АЭТЗ',
    },
    description: {
      en: 'Corporate website for Astana Electrical Engineering Plant: full-screen industrial hero, product catalog, projects by industry with client logos (Kazakhmys, BI Group), news and careers',
      ru: 'Корпоративный сайт Астанинского электротехнического завода: full-screen hero с цехом, каталог оборудования, проекты по отраслям с логотипами клиентов (Казахмыс, BI Group), новости и карьера',
      kz: 'Астана электротехникалық зауытының корпоративтік сайты: зауыт hero, өнім каталогы, клиент логотиптерімен отрасль бойынша жобалар, жаңалықтар және мансап',
    },
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Catalog'],
    image: '/portfolio/aetz.webp',
    live: 'https://aetz.kz/',
    featured: true,
  },
  {
    id: 'atoms-industrial',
    title: {
      en: 'Atoms Industrial',
      ru: 'Atoms Industrial',
      kz: 'Atoms Industrial',
    },
    description: {
      en: 'Corporate website for industrial valves and piping systems supplier: product catalog (gate valves, ball valves, fittings, pumps), advantages, WhatsApp leads and contacts — Atyrau, Kazakhstan & CIS',
      ru: 'Корпоративный сайт поставщика запорной арматуры и трубопроводных систем: каталог (задвижки, шаровые краны, детали, насосы), преимущества, WhatsApp-заявки и контакты — Атырау, Казахстан и СНГ',
      kz: 'Өнеркәсіптік арматура және құбыр жүйелері жеткізушісінің корпоративтік сайты: каталог, артықшылықтар, WhatsApp өтінімдері — Атырау, Қазақстан және ТМД',
    },
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Catalog'],
    image: '/portfolio/atoms.webp',
    live: 'https://atoms-industrial.com/',
    featured: true,
  },
  {
    id: 'karshyga',
    title: {
      en: 'Karshyga.ai',
      ru: 'Karshyga.ai',
      kz: 'Karshyga.ai',
    },
    description: {
      en: 'Digital marketplace for oversized and heavy cargo in Kazakhstan: cargo listings with filters, carrier offers, ratings, personal accounts, equipment rental and RU/KZ/CN/EN localization',
      ru: 'Цифровая биржа негабаритных перевозок в Казахстане: каталог грузов с фильтрами, отклики перевозчиков, рейтинги, личные кабинеты, аренда техники и локализация RU/KZ/CN/EN',
      kz: 'Қазақстандағы габариттен тыс тасымалдау цифрлық биржасы: жük каталогы, сүзгілер, тасымалдаушы ұсыныстары, рейтингтер, жеке кабинеттер және RU/KZ/CN/EN локализация',
    },
    tech: ['Next.js', 'TypeScript', 'Marketplace', 'RU/KZ/CN/EN'],
    image: '/portfolio/karshyga.webp',
    live: 'https://karshyga.ai/',
    featured: true,
  },
  {
    id: 'fida-concrete',
    title: {
      en: 'FIDA Concrete',
      ru: 'FIDA Concrete',
      kz: 'FIDA Concrete',
    },
    description: {
      en: 'Corporate website for a concrete plant in Astana: product catalog (M100–M700), volume calculator, projects gallery, price list leads, WhatsApp and KZ/RU localization — 2 plants, 214,000+ m³ produced',
      ru: 'Корпоративный сайт бетонного завода в Астане: каталог марок (М100–М700), калькулятор объёма, проекты, прайс-лист, WhatsApp и локализация KZ/RU — 2 завода, 214 000+ м³',
      kz: 'Астанадағы бетон зауытының корпоративтік сайты: маркалар каталогы (М100–М700), көлем калькуляторы, жобалар, прайс-лист, WhatsApp және KZ/RU локализация',
    },
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Calculator'],
    image: '/portfolio/fida.webp',
    live: 'https://fida.kz/',
    featured: true,
  },
  {
    id: 'arlift',
    title: {
      en: 'ARLIFT',
      ru: 'ARLIFT',
      kz: 'ARLIFT',
    },
    description: {
      en: 'E-commerce catalog for lift equipment rental and sales in Astana: scissor/articulated/telescopic lifts, vacuum grippers, mini-cranes, cases, service requests and RU/EN localization',
      ru: 'Каталог аренды и продажи спецтехники в Астане: ножничные, коленчатые и телескопические подъёмники, вакуумные захваты, мини-краны, кейсы, сервисные заявки и локализация RU/EN',
      kz: 'Астанадағы арнайы техниканы жалға алу және сату каталогы: қайшылы/телескопиялық көтергіштер, вакуумдық ұстағыштар, мини-крандар, кейстер және RU/EN локализация',
    },
    tech: ['Next.js', 'TypeScript', 'Catalog', 'E-commerce'],
    image: '/portfolio/arlift.webp',
    live: 'https://arlift.kz/',
    featured: true,
  },
  {
    id: 'habipark',
    title: {
      en: 'HABI PARK',
      ru: 'HABI PARK',
      kz: 'HABI PARK',
    },
    description: {
      en: 'Residential complex landing in Almaty: layouts catalog, amenities, mortgage/installment CTAs, presentation download, lead forms and RU/KZ localization — from 590,000 ₸/m²',
      ru: 'Лендинг ЖК в Алматы: планировки, благоустройство, ипотека и рассрочка, скачивание презентации, заявки и локализация RU/KZ — от 590 000 ₸/м²',
      kz: 'Алматыдағы тұрғын үй кешенінің лендингі: жоспарлау, абаттандыру, ипотека/бөліп төлеу, презентация, өтінімдер және RU/KZ локализация',
    },
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Real Estate'],
    image: '/portfolio/habipark.webp',
    live: 'https://habipark.kz/',
    featured: true,
  },
  {
    id: 'helix-lab',
    title: {
      en: 'HELIX Lab',
      ru: 'HELIX Lab',
      kz: 'HELIX Lab',
    },
    description: {
      en: 'Medical laboratory website for Kazakhstan: test catalog and check-ups, home visit booking, promotions, doctor/ultrasound pages, personal account and RU/KZ localization',
      ru: 'Сайт медицинской лаборатории в Казахстане: каталог анализов и чек-апы, выезд на дом, акции, врачи/УЗИ, личный кабинет и локализация RU/KZ',
      kz: 'Қазақстандағы медициналық зертхана сайты: талдаулар каталогы, үйге шығу, акциялар, дәрігерлер/УДЗ, жеке кабинет және RU/KZ локализация',
    },
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Healthcare'],
    image: '/portfolio/helix.webp',
    live: 'https://helix-lab.kz/ru',
    featured: true,
  },
  {
    id: 'smart-shipping',
    title: {
      en: 'Smart Shipping',
      ru: 'Smart Shipping',
      kz: 'Smart Shipping',
    },
    description: {
      en: 'E-commerce platform for IKEA delivery to Kazakhstan: product catalog and curated collections, transparent pricing by weight, order tracking, reviews, blog and lead forms for Almaty, Astana and other cities',
      ru: 'E-commerce платформа доставки IKEA в Казахстан: каталог и подборки товаров, прозрачные цены по весу, отслеживание заказа, отзывы, блог и заявки — Алматы, Астана и другие города',
      kz: 'IKEA жеткізуге арналған e-commerce платформа: тауарлар каталогы, салмақ бойынша бағалар, тапсырыс бақылауы, пікірлер, блог және өтінім формалары',
    },
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'E-commerce'],
    image: '/portfolio/smart-shipping.webp',
    live: 'https://www.smartshipping.kz/',
    featured: true,
  },
  {
    id: 'qinvesting',
    title: {
      en: 'QInvesting',
      ru: 'QInvesting',
      kz: 'QInvesting',
    },
    description: {
      en: 'Fintech platform Quantum (QInvesting): live open portfolio vs S&P 500, weekly performance charts, transparent gains and losses, subscription pricing and real-time analytics dashboard',
      ru: 'Fintech-платформа Quantum (QInvesting): открытый портфель в реальном времени vs S&P 500, графики недельной доходности, прозрачные плюсы и минусы, подписка и аналитика',
      kz: 'Quantum (QInvesting) fintech платформасы: S&P 500-ге қарсы ашық портфель, апталық кірістілік графиктері, ашық аналитика және подписка',
    },
    tech: ['Next.js', 'TypeScript', 'Data Visualization', 'Fintech'],
    image: '/portfolio/qinvesting.webp',
    live: 'https://qinvesting.ai/',
    featured: true,
  },
  {
    id: 'terricon-valley',
    title: {
      en: 'Terricon Valley',
      ru: 'Terricon Valley',
      kz: 'Terricon Valley',
    },
    description: {
      en: 'IT hub website for Terricon Valley (Karaganda): events calendar, speaker applications, coworking rental, partner offers, news and KZ/RU localization',
      ru: 'Сайт IT-хаба Terricon Valley (Караганда): календарь мероприятий, заявки спикеров, аренда коворкинга, предложения партнёров, новости и локализация KZ/RU',
      kz: 'Terricon Valley IT-хаб сайты (Қарағанды): іс-шаралар күнтізбесі, спикер өтінімдері, коворкинг жалға алу, серіктес ұсыныстары және KZ/RU локализация',
    },
    tech: ['React', 'Node.js', 'Event Platform', 'KZ/RU'],
    image: '/portfolio/valley.webp',
    live: 'https://terricon.kz/ru/',
    featured: true,
  },
  {
    id: 'bambino',
    title: {
      en: 'Bambino Gelato',
      ru: 'Bambino Gelato',
      kz: 'Bambino Gelato',
    },
    description: {
      en: 'Corporate website for Italian gelato brand Bambino: franchise, delivery, dealership and product catalog, catering, lead forms and WhatsApp — Kazakhstan, Russia, Kyrgyzstan',
      ru: 'Корпоративный сайт итальянского джелато Bambino: франшиза, доставка, дилерство и каталог продукции, кейтеринг, заявки и WhatsApp — Казахстан, Россия, Кыргызстан',
      kz: 'Итальяндық джелато Bambino корпоративтік сайты: франшиза, жеткізу, дилерлік, өнім каталогы, кейтеринг және WhatsApp өтінімдері',
    },
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Franchise'],
    image: '/portfolio/bambino.webp',
    live: 'https://bambinogelato.com/',
    featured: true,
  },
  {
    id: 'rauan-complex',
    title: {
      en: 'RAUAN COMPLEX',
      ru: 'RAUAN COMPLEX',
      kz: 'RAUAN COMPLEX',
    },
    description: {
      en: 'Corporate website for personnel accommodation in Atyrau: Comfort and Economy packages (170 spots), photo galleries, maps, video tours, WhatsApp leads for construction and industrial companies',
      ru: 'Корпоративный сайт комплексного размещения персонала в Атырау: пакеты Комфорт и Эконом (170 мест), галереи, карты, видео-туры, заявки через WhatsApp для строительных и промышленных компаний',
      kz: 'Атырауда персоналды орналастыру корпоративтік сайты: Комфорт және Эконом пакеттері (170 орын), галерея, карталар, WhatsApp арқылы өтінімдер',
    },
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Corporate B2B'],
    image: '/portfolio/rauan.webp',
    live: 'https://www.rauancomplex.kz/',
    featured: true,
  },
  {
    id: 'asem-makeup',
    title: {
      en: 'ASEM Makeup Artist',
      ru: 'ASEM Makeup Artist',
      kz: 'ASEM Makeup Artist',
    },
    description: {
      en: 'Minimalist portfolio for professional makeup artist Assem Baidauletova: horizontal photo gallery, categories (fashion, weddings, red carpet), bio and contact — Los Angeles',
      ru: 'Минималистичное портфолио профессионального визажиста Assem Baidauletova: горизонтальная галерея, категории (fashion, weddings, red carpet), bio и контакты — Los Angeles',
      kz: 'Кәсіби визажист Assem Baidauletova минималистік портфолиосы: горизонтальды галерея, санаттар (fashion, weddings, red carpet), bio және байланыс',
    },
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Portfolio'],
    image: '/portfolio/assem.webp',
    live: 'https://www.makeupbyasem.com/',
    featured: true,
  },
];

export function getFeaturedProjects(): Project[] {
  return projects.filter(p => p.featured);
}

export function getProjectById(id: string): Project | undefined {
  return projects.find(p => p.id === id);
}

