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
    id: 'evoil',
    title: {
      en: 'EvOil',
      ru: 'EvOil',
      kz: 'EvOil',
    },
    description: {
      en: 'Multi-tenant well stock accounting platform for oil operators: daily reports, well passports, well tests at metering units with flow rate charts, workover and well intervention orders, a field map and reports. An AI analyst answers questions about the data, and field operators use a mobile app that works offline.',
      ru: 'Мультитенантная платформа учёта фонда скважин для нефтяных операторов: суточные рапорты, паспорт скважины, замеры АГЗУ с графиками дебита, наряды на ремонт и ГТМ, карта и отчёты. ИИ-аналитик отвечает на вопросы по данным, а операторы на промысле работают в мобильном приложении даже без связи.',
      kz: 'Мұнай операторлары үшін ұңғымалар қорын есепке алатын мультитенантты платформа: тәуліктік рапорттар, ұңғыма паспорты, АГЗУ өлшеулері мен дебит графиктері, жөндеу және ГТМ нарядтары, карта мен есептер. AI-талдаушы деректер бойынша сұрақтарға жауап береді, кәсіпшілік операторлары мобильді қосымшада офлайн жұмыс істейді.',
    },
    tech: ['FastAPI', 'PostgreSQL', 'React', 'TypeScript', 'React Native'],
    image: '/portfolio/evoil.webp',
    featured: true,
  },
  {
    id: 'boberbuild',
    title: {
      en: 'BoberBuild',
      ru: 'BoberBuild',
      kz: 'BoberBuild',
    },
    description: {
      en: 'Catalog of building materials plants and suppliers in Kazakhstan: a foreman picks a category and region, then sends a request to selected plants or to all of them at once. Plants reply with a quote from their account, notifications go out via WhatsApp, Telegram, SMS and email, and the admin panel has 19 sections.',
      ru: 'Каталог заводов и поставщиков стройматериалов Казахстана: прораб выбирает направление и регион, а заявку отправляет выбранным заводам или всем сразу. Заводы отвечают коммерческим предложением из личного кабинета, уведомления приходят через WhatsApp, Telegram, SMS и почту, админ-панель из 19 разделов.',
      kz: 'Қазақстандағы құрылыс материалдары зауыттары мен жеткізушілерінің каталогы: прораб бағыт пен өңірді таңдап, өтінімді қажетті зауыттарға не бәріне бірден жібереді. Зауыттар жеке кабинеттен коммерциялық ұсыныспен жауап береді, хабарламалар WhatsApp, Telegram, SMS және пошта арқылы келеді, админ-панельде 19 бөлім бар.',
    },
    tech: ['Laravel', 'Filament', 'MySQL', 'Meilisearch', 'Alpine.js'],
    image: '/portfolio/boberbuild.webp',
    live: 'https://boberbuild.kz/',
    featured: true,
  },
  {
    id: 'ai-admin-whatsapp',
    title: {
      en: 'AI Administrator for WhatsApp',
      ru: 'ИИ-администратор в WhatsApp',
      kz: 'WhatsApp-тағы AI-әкімші',
    },
    description: {
      en: 'AI administrator for salons, clinics, car services and cafes: answers clients 24/7 using the prices and terms from the company card, asks for the service, time and name, books a visit or takes an order and sends the request to the owner in Telegram. Understands voice messages, replies in Russian and Kazakh',
      ru: 'Бот-администратор для салонов, клиник, автосервисов и кафе: отвечает клиентам 24/7 по ценам и условиям из карточки компании, уточняет услугу, время и имя, записывает на приём или принимает заказ и сразу отправляет заявку владельцу в Telegram. Понимает голосовые, пишет по-русски и по-казахски',
      kz: 'Салондар, клиникалар, автосервистер мен кафелерге арналған AI-әкімші: клиенттерге тәулік бойы компания прайсы бойынша жауап береді, қызметті, уақытты және есімді нақтылап, қабылдауға жазады немесе тапсырыс қабылдайды, өтінімді иесіне Telegram-ға жібереді. Дауыстық хабарламаларды түсінеді, орысша және қазақша жазады',
    },
    tech: ['Node.js', 'Baileys', 'OpenAI', 'PostgreSQL', 'Telegram Bot API'],
    image: '/portfolio/ai-admin-whatsapp.webp',
    featured: true,
  },
  {
    id: 'yuristy',
    title: {
      en: 'Yuristy',
      ru: 'Yuristy',
      kz: 'Yuristy',
    },
    description: {
      en: 'Secure platform for receiving legal aid requests and managing cases: a public website in Russian and Kazakh, requests under a pseudonym, a form builder with versions and conditional logic, file quarantine and checks. Lawyers see only the cases assigned to them, and staff sign in with 2FA.',
      ru: 'Защищённая платформа приёма обращений за юридической помощью и ведения дел: публичный сайт на русском и казахском, подача обращения под псевдонимом, конструктор форм с версиями и условной логикой, карантин и проверка файлов. Юрист видит только назначенные ему дела, сотрудники входят с 2FA.',
      kz: 'Заң көмегі бойынша өтініштерді қабылдап, істерді жүргізетін қорғалған платформа: орыс және қазақ тілдеріндегі ашық сайт, бүркеншік атпен өтініш беру, нұсқалары мен шартты логикасы бар форма конструкторы, файлдарды карантинде тексеру. Заңгер өзіне тағайындалған істерді ғана көреді, қызметкерлер 2FA арқылы кіреді.',
    },
    tech: ['Laravel', 'Filament', 'Livewire', 'PostgreSQL', 'MinIO'],
    image: '/portfolio/yuristy.webp',
    featured: true,
  },
  {
    id: 'ai-video-astana',
    title: {
      en: 'Astana in 3D',
      ru: 'Астана в 3D',
      kz: 'Астана 3D форматында',
    },
    description: {
      en: 'AI video series for TikTok about Astana businesses: a 3D city map built from OpenStreetMap, online map data by niche (up to 12,766 companies in 50 categories per episode), numbers flow into the text and voiceover automatically, a neural voice with subtitles and automatic 1080×1920 rendering from a script',
      ru: 'Серия ИИ-видео для TikTok о бизнесе Астаны: 3D-карта города из OpenStreetMap, данные онлайн-карт по нишам (до 12 766 компаний 50 сфер в выпуске), цифры сами подставляются в текст и голос, озвучка нейроголосом с субтитрами и автоматический рендер ролика 1080×1920 из сценария',
      kz: 'Астана бизнесі туралы TikTok-қа арналған AI-бейнелер сериясы: OpenStreetMap негізіндегі 3D-карта, салалар бойынша онлайн-карталар деректері (бір шығарылымда 50 саладағы 12 766 компанияға дейін), сандар мәтін мен дауысқа өздігінен қойылады, нейрондық дауыс пен субтитрлер, ролик сценарийден автоматты рендерленеді',
    },
    tech: ['Three.js', 'OpenStreetMap', 'Puppeteer', 'FFmpeg', 'ElevenLabs'],
    image: '/portfolio/ai-video-astana.webp',
    live: 'https://www.tiktok.com/@aidardev',
    featured: true,
  },
  {
    id: 'cargo-tracking',
    title: {
      en: 'Cargo Parcel Tracking',
      ru: 'Трекинг посылок для карго',
      kz: 'Карго сәлемдемелерін бақылау',
    },
    description: {
      en: "Parcel tracking system for a cargo company: 5 statuses from the warehouse in China to the client's city, sync with the Chinese system, scanning at warehouses in Kazakhstan with a barcode scanner or phone camera, automatic Telegram notifications for clients in Russian and Kazakh",
      ru: 'Система отслеживания посылок для карго-компании: 5 статусов от склада в Китае до города клиента, синхронизация с китайской системой, сканирование на складах в Казахстане сканером или камерой телефона, автоматические уведомления клиентам в Telegram на русском и казахском',
      kz: 'Карго компаниясына арналған сәлемдемелерді бақылау жүйесі: Қытайдағы қоймадан клиенттің қаласына дейін 5 мәртебе, қытайлық жүйемен синхрондау, Қазақстандағы қоймаларда сканермен немесе телефон камерасымен сканерлеу, клиенттерге орыс және қазақ тілдерінде Telegram арқылы автоматты хабарламалар',
    },
    tech: ['Next.js', 'PostgreSQL', 'Redis', 'Telegram Bot API', 'Docker'],
    image: '/portfolio/cargo-tracking.webp',
    live: 'https://t.me/aidardev_cargo_demo_bot',
    featured: true,
  },
  {
    id: 'sana-aroma',
    title: {
      en: 'SANA&AROMA',
      ru: 'SANA&AROMA',
      kz: 'SANA&AROMA',
    },
    description: {
      en: 'Perfume decant catalog: 290 fragrances from 92 brands in Russian and Kazakh, search and filters by brand, accord and season, a notes pyramid, comparison of up to 3 fragrances, a fragrance finder quiz with a match percentage and ordering via WhatsApp',
      ru: 'Каталог парфюмерии на распив: 290 ароматов и 92 бренда на русском и казахском, поиск и фильтры по брендам, аккордам и сезону, пирамида нот, сравнение до 3 ароматов, тест «Подбор аромата» с процентом совпадения и заказ в WhatsApp',
      kz: 'Құйып сатылатын парфюмерия каталогы: орыс және қазақ тілдерінде 92 брендтің 290 хош иісі, бренд, аккорд және маусым бойынша іздеу мен сүзгілер, ноталар пирамидасы, 3 хош иіске дейін салыстыру, сәйкестікті пайызбен көрсететін «Хош иіс таңдау» тесті және WhatsApp арқылы тапсырыс',
    },
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Tailwind CSS'],
    image: '/portfolio/sana-aroma.webp',
    live: 'https://sanaaroma.kz/',
    featured: true,
  },
  {
    id: 'cyberpol-bot',
    title: {
      en: 'Zhambyl Region Cyberpolice Bot',
      ru: 'Бот Киберполиции Жамбылской области',
      kz: 'Жамбыл облысы Киберполициясының боты',
    },
    description: {
      en: 'Telegram bot for the Zhambyl Region Cyberpolice in Kazakh and Russian: scam prevention videos and brochures, an Instagram link, a "Send a link to cyber supervision" button that forwards reports to officers who reply right in the bot, and stats for admins',
      ru: 'Telegram-бот Киберполиции Жамбылской области на казахском и русском: профилактические ролики и брошюры о мошенниках, ссылка на Instagram, кнопка «Отправить ссылку в кибернадзор» с передачей обращения сотрудникам и ответом прямо в боте, статистика для админов',
      kz: 'Жамбыл облысы Киберполициясының қазақ және орыс тілдеріндегі Telegram-боты: алаяқтар туралы профилактикалық бейнероликтер мен брошюралар, Instagram сілтемесі, өтінішті қызметкерлерге жеткізетін «Кибербақылауға сілтеме жіберу» батырмасы, қызметкер жауабы тікелей ботқа келеді, әкімшілерге арналған статистика',
    },
    tech: ['Telegram Bot API', 'grammY', 'Node.js', 'TypeScript', 'Docker'],
    image: '/portfolio/cyberpol-bot.webp',
    featured: true,
  },
  {
    id: 'saqtan',
    title: {
      en: 'SAQTAN',
      ru: 'SAQTAN',
      kz: 'SAQTAN',
    },
    description: {
      en: "Telegram bot for anonymous citizen reports on illegal drug trafficking in Kazakh and Russian: photos, videos, links and text, follow-ups to a report, a copy of every report in the moderators' chat and an admin panel with stats and filters",
      ru: 'Telegram-бот для анонимных обращений граждан о незаконном обороте наркотиков на казахском и русском: фото, видео, ссылки и текст, дополнения к обращению, копия каждого обращения в чат модераторов и админ-панель со статистикой и фильтрами',
      kz: 'Есірткінің заңсыз айналымы туралы азаматтардың жасырын хабарламаларын қабылдайтын қазақ және орыс тілдеріндегі Telegram-бот: фото, видео, сілтеме және мәтін, хабарламаға толықтыру, әр хабарламаның көшірмесі модераторлар чатына түседі, статистикасы мен сүзгілері бар админ-панель',
    },
    tech: ['Next.js', 'Telegram Bot API', 'PostgreSQL', 'Vercel Blob', 'TypeScript'],
    image: '/portfolio/saqtan.webp',
    featured: true,
  },
  {
    id: 'wa-voice-text',
    title: {
      en: 'Voice Messages to Text',
      ru: 'Голосовые в текст',
      kz: 'Дауыстық хабарламалар мәтінге',
    },
    description: {
      en: 'Chrome extension for WhatsApp Web: the text of every voice message appears right under it, no need to listen. Transcribed by Whisper large-v3 on our own GPU (30 seconds of speech in 2.5-4.5 s), transcripts are cached, no “played” mark for the sender, audio is never stored',
      ru: 'Расширение Chrome для WhatsApp Web: под каждым голосовым сразу появляется его текст, слушать не нужно. Расшифровывает Whisper large-v3 на собственной видеокарте (30 секунд речи за 2,5-4,5 с), расшифровки кэшируются, отметка «прослушано» не ставится, аудио нигде не хранится',
      kz: 'WhatsApp Web-ке арналған Chrome кеңейтімі: әр дауыстық хабарламаның астында оның мәтіні шығады, тыңдаудың қажеті жоқ. Дауысты өз видеокартамызда Whisper large-v3 мәтінге айналдырады (30 секундтық сөйлеу 2,5-4,5 секундта), мәтіндер кэште сақталады, «тыңдалды» белгісі қойылмайды, аудио ешқайда сақталмайды',
    },
    tech: ['Chrome Extension', 'Whisper large-v3', 'faster-whisper', 'FastAPI', 'CUDA'],
    image: '/portfolio/wa-voice-text.webp',
    featured: true,
  },
  {
    id: 'albakov-stroy',
    title: {
      en: 'ALBAKOV STROY',
      ru: 'ALBAKOV STROY',
      kz: 'ALBAKOV STROY',
    },
    description: {
      en: 'B2B website for an industrial construction company in Almaty: gates, prefabricated warehouses and buildings, engineering systems. 56 service pages, a quick estimate quiz that sends requests to WhatsApp, an admin panel for edits without a developer and GA4 analytics',
      ru: 'B2B-сайт строительной компании в Алматы: ворота, быстровозводимые склады и здания, инженерные системы. 56 страниц услуг, квиз «Быстрый расчёт» с заявкой в WhatsApp, админ-панель для правок без программиста и аналитика GA4',
      kz: 'Алматыдағы құрылыс компаниясының B2B-сайты: қақпалар, жылдам тұрғызылатын қоймалар мен ғимараттар, инженерлік жүйелер. 56 қызмет беті, өтінімді WhatsApp-қа жіберетін «Жылдам есеп» квизі, бағдарламашысыз өзгертуге арналған админ-панель және GA4 аналитикасы',
    },
    tech: ['Next.js', 'TypeScript', 'Quiz calculator', 'Admin panel'],
    image: '/portfolio/albakov-stroy.webp',
    live: 'https://albakovstroy.kz/',
    featured: true,
  },
  {
    id: '4car',
    title: {
      en: '4Car Detailing Market',
      ru: '4Car Detailing Market',
      kz: '4Car Detailing Market',
    },
    description: {
      en: 'Online store for car care chemicals and detailing in Astana: 650+ products, a catalog synced with MoySklad, filters and search, orders by email and Telegram, an AI consultant on car chemicals, an admin panel with banners, RU, KZ and EN versions',
      ru: 'Интернет-магазин автохимии и детейлинга в Астане: 650+ товаров, каталог синхронизируется с МойСклад, фильтры и поиск, заказы на почту и в Telegram, ИИ-консультант по автохимии, админ-панель с баннерами, версии RU, KZ и EN',
      kz: 'Астанадағы автохимия және детейлинг интернет-дүкені: 650+ тауар, каталог МойСкладпен синхрондалады, сүзгілер мен іздеу, тапсырыстар поштаға және Telegram-ға келеді, автохимия бойынша AI-кеңесші, баннерлері бар админ-панель, RU, KZ және EN нұсқалары',
    },
    tech: ['Next.js', 'Prisma', 'PostgreSQL', 'MoySklad API', 'OpenAI'],
    image: '/portfolio/4car.webp',
    live: 'https://4carmarket.kz/',
    featured: true,
  },
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
      kz: 'Күн энергетикасы компаниясының корпоративтік сайты: 4 қадамды өтелу мерзімі калькуляторы, жобалар каталогы, блог, RU/KZ және B2B клиенттерге арналған өтінімдер',
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
      kz: 'Астана электротехникалық зауытының корпоративтік сайты: зауыт туралы бірінші экран, өнім каталогы, клиент логотиптері бар сала бойынша жобалар, жаңалықтар және мансап',
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
      kz: 'Қазақстандағы габариттен тыс тасымалдау цифрлық биржасы: жүк каталогы, сүзгілер, тасымалдаушы ұсыныстары, рейтингтер, жеке кабинеттер және RU/KZ/CN/EN локализация',
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
      kz: 'Quantum (QInvesting) fintech платформасы: S&P 500-ге қарсы ашық портфель, апталық кірістілік графиктері, ашық аналитика және жазылым',
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

