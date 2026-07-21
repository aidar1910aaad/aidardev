export interface BlogPost {
  id: string;
  slug: string;
  title: {
    ru: string;
    en: string;
    kz: string;
  };
  description: {
    ru: string;
    en: string;
    kz: string;
  };
  excerpt: {
    ru: string;
    en: string;
    kz: string;
  };
  category: {
    ru: string;
    en: string;
    kz: string;
  };
  date: string;
  updatedAt?: string;
  keywords: {
    ru: string[];
    en: string[];
    kz: string[];
  };
  readingTime: number;
  published: boolean;
  content?: Partial<Record<'ru' | 'en' | 'kz', string>>;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'kak-uvelichit-konversiyu-sajta-2024',
    title: {
      ru: 'Как увеличить конверсию сайта в 2024: практические советы',
      en: 'How to Increase Website Conversion in 2024: Practical Tips',
      kz: '2024 жылы сайт конверсиясын қалай арттыруға болады: практикалық кеңестер',
    },
    description: {
      ru: 'Узнайте, как увеличить конверсию вашего сайта с помощью проверенных методов: оптимизация UX, A/B тестирование, улучшение загрузки и многое другое. Практические советы от эксперта.',
      en: 'Learn how to increase your website conversion with proven methods: UX optimization, A/B testing, load improvement and more. Practical tips from an expert.',
      kz: 'Дәлелденген әдістермен сайт конверсиясын қалай арттыруға болатынын біліңіз: UX оңтайландыру, A/B тестілеу, жүктемені жақсарту және т.б. Эксперттен практикалық кеңестер.',
    },
    excerpt: {
      ru: 'Конверсия сайта — один из ключевых показателей успеха бизнеса в интернете. В этой статье мы разберем проверенные методы увеличения конверсии...',
      en: 'Website conversion is one of the key indicators of business success online. In this article, we will discuss proven methods to increase conversion...',
      kz: 'Сайт конверсиясы — интернеттегі бизнес табысының негізгі көрсеткіштерінің бірі. Бұл мақалада конверсияны арттырудың дәлелденген әдістерін талқылаймыз...',
    },
    category: {
      ru: 'Маркетинг и SEO',
      en: 'Marketing & SEO',
      kz: 'Маркетинг және SEO',
    },
    date: '2024-01-15',
    keywords: {
      ru: ['конверсия сайта', 'увеличение продаж', 'оптимизация сайта', 'UX дизайн', 'A/B тестирование', 'конверсия в заявки', 'веб-разработка Казахстан'],
      en: ['website conversion', 'increase sales', 'website optimization', 'UX design', 'A/B testing', 'lead conversion', 'web development Kazakhstan'],
      kz: ['сайт конверсиясы', 'сатуды арттыру', 'сайт оңтайландыру', 'UX дизайн', 'A/B тестілеу', 'заявка конверсиясы', 'веб-дамыту Қазақстан'],
    },
    readingTime: 8,
    published: true,
  },
  {
    id: '2',
    slug: 'seo-optimizatsiya-internet-magazinov-kazakhstan',
    title: {
      ru: 'SEO оптимизация для интернет-магазинов в Казахстане',
      en: 'SEO Optimization for E-commerce in Kazakhstan',
      kz: 'Қазақстандағы интернет-дүкендер үшін SEO оңтайландыру',
    },
    description: {
      ru: 'Полное руководство по SEO оптимизации интернет-магазинов в Казахстане. Техническое SEO, оптимизация карточек товаров, структурированные данные, внутренняя перелинковка и другие важные аспекты.',
      en: 'Complete guide to SEO optimization for e-commerce in Kazakhstan. Technical SEO, product card optimization, structured data, internal linking and other important aspects.',
      kz: 'Қазақстандағы интернет-дүкендер үшін SEO оңтайландыру туралы толық нұсқаулық. Техникалық SEO, тауар карталарын оңтайландыру, құрылымдық деректер, ішкі сілтемелер және басқа маңызды аспектілер.',
    },
    excerpt: {
      ru: 'Правильная SEO оптимизация интернет-магазина способна увеличить органический трафик в несколько раз. В этой статье мы разберем все ключевые моменты...',
      en: 'Proper SEO optimization of an online store can increase organic traffic several times. In this article, we will discuss all the key points...',
      kz: 'Интернет-дүкенді дұрыс SEO оңтайландыру органикалық трафикті бірнеше есе арттыра алады. Бұл мақалада біз барлық негізгі нүктелерді талқылаймыз...',
    },
    category: {
      ru: 'Маркетинг и SEO',
      en: 'Marketing & SEO',
      kz: 'Маркетинг және SEO',
    },
    date: '2024-01-10',
    keywords: {
      ru: ['SEO интернет-магазина', 'оптимизация товаров', 'структурированные данные', 'техническое SEO', 'интернет-магазин Казахстан', 'SEO Алматы'],
      en: ['e-commerce SEO', 'product optimization', 'structured data', 'technical SEO', 'online store Kazakhstan', 'SEO Almaty'],
      kz: ['интернет-дүкен SEO', 'тауар оңтайландыру', 'құрылымдық деректер', 'техникалық SEO', 'интернет-дүкен Қазақстан', 'SEO Алматы'],
    },
    readingTime: 12,
    published: true,
  },
  {
    id: '3',
    slug: 'mobilnyj-adaptivnyj-dizajn-2024',
    title: {
      ru: 'Зачем нужен мобильный адаптивный дизайн в 2024 году',
      en: 'Why Mobile Responsive Design is Essential in 2024',
      kz: '2024 жылы мобильді адаптивті дизайн не үшін қажет',
    },
    description: {
      ru: 'Мобильный адаптивный дизайн стал обязательным требованием в 2024. Узнайте, почему это критически важно для вашего бизнеса, как Google ранжирует мобильные сайты и какие преимущества дает адаптивный дизайн.',
      en: 'Mobile responsive design has become a mandatory requirement in 2024. Learn why it is critically important for your business, how Google ranks mobile sites and what advantages responsive design provides.',
      kz: 'Мобильді адаптивті дизайн 2024 жылы міндетті талапқа айналды. Оның бизнесіңіз үшін неге критикалық маңызды екенін, Google мобильді сайттарды қалай реттелетінін және адаптивті дизайн қандай артықшылықтар беретінін біліңіз.',
    },
    excerpt: {
      ru: 'Более 60% пользователей интернета заходят на сайты с мобильных устройств. Если ваш сайт не адаптирован под мобильные устройства, вы теряете большую часть аудитории...',
      en: 'More than 60% of internet users visit websites from mobile devices. If your site is not adapted for mobile devices, you are losing a large part of your audience...',
      kz: 'Интернет пайдаланушыларының 60%-тан астамы сайттарға мобильді құрылғылардан кіреді. Егер сайтыңыз мобильді құрылғыларға бейімделмеген болса, аудиторияның көп бөлігін жоғалтасыз...',
    },
    category: {
      ru: 'Дизайн и UX',
      en: 'Design & UX',
      kz: 'Дизайн және UX',
    },
    date: '2024-01-05',
    keywords: {
      ru: ['адаптивный дизайн', 'мобильная версия сайта', 'responsive design', 'мобильная оптимизация', 'веб-дизайн 2024', 'мобильный сайт Казахстан'],
      en: ['responsive design', 'mobile website', 'mobile optimization', 'web design 2024', 'mobile site Kazakhstan'],
      kz: ['адаптивті дизайн', 'мобильді сайт нұсқасы', 'мобильді оңтайландыру', 'веб-дизайн 2024', 'мобильді сайт Қазақстан'],
    },
    readingTime: 7,
    published: true,
  },
  {
    id: '4',
    slug: 'telegram-boty-dlya-uvelicheniya-prodazh',
    title: {
      ru: 'Как Telegram-боты помогают бизнесу увеличить продажи',
      en: 'How Telegram Bots Help Businesses Increase Sales',
      kz: 'Telegram-боттар бизнестің сатуды арттыруға қалай көмектеседі',
    },
    description: {
      ru: 'Telegram-боты — мощный инструмент для автоматизации бизнеса и увеличения продаж. Разбираем реальные кейсы, как боты помогают принимать заказы, обрабатывать запросы клиентов и увеличивать конверсию.',
      en: 'Telegram bots are a powerful tool for business automation and increasing sales. We analyze real cases of how bots help accept orders, process customer requests and increase conversion.',
      kz: 'Telegram-боттар — бизнесті автоматтандыру және сатуды арттыру үшін күшті құрал. Боттардың тапсырыстарды қабылдауға, тұтынушы сұрауларын өңдеуге және конверсияны арттыруға қалай көмектесетінінің нақты кейстерін талдаймыз.',
    },
    excerpt: {
      ru: 'Telegram-боты стали неотъемлемой частью современного бизнеса. Они работают 24/7, не требуют оплаты труда сотрудников и могут обрабатывать тысячи запросов одновременно...',
      en: 'Telegram bots have become an integral part of modern business. They work 24/7, do not require employee salaries and can process thousands of requests simultaneously...',
      kz: 'Telegram-боттар заманауи бизнестің ажырамас бөлігіне айналды. Олар 24/7 жұмыс істейді, қызметкерлердің жалақысын талап етпейді және бір уақытта мыңдаған сұрауларды өңдей алады...',
    },
    category: {
      ru: 'Автоматизация',
      en: 'Automation',
      kz: 'Автоматтандыру',
    },
    date: '2024-01-01',
    keywords: {
      ru: ['Telegram бот', 'автоматизация бизнеса', 'боты для продаж', 'чат-боты', 'Telegram бот Казахстан', 'разработка ботов'],
      en: ['Telegram bot', 'business automation', 'sales bots', 'chatbots', 'Telegram bot Kazakhstan', 'bot development'],
      kz: ['Telegram бот', 'бизнес автоматтандыру', 'сату боттары', 'чат-боттар', 'Telegram бот Қазақстан', 'боттарды әзірлеу'],
    },
    readingTime: 10,
    published: true,
  },
  {
    id: '5',
    slug: 'ai-chatboty-dlya-avtomatizatsii-servisa',
    title: {
      ru: 'AI-чатботы для автоматизации клиентского сервиса в 2024',
      en: 'AI Chatbots for Customer Service Automation in 2024',
      kz: '2024 жылы тұтынушыларға қызмет көрсетуді автоматтандыру үшін AI-чатботтар',
    },
    description: {
      ru: 'AI-чатботы на базе GPT и других моделей машинного обучения революционизируют клиентский сервис. Узнайте, как внедрить AI-чатбот, какие преимущества он дает и сколько это стоит.',
      en: 'AI chatbots based on GPT and other machine learning models are revolutionizing customer service. Learn how to implement an AI chatbot, what benefits it provides and how much it costs.',
      kz: 'GPT және басқа машиналық оқыту модельдеріне негізделген AI-чатботтар тұтынушыларға қызмет көрсетуді түбегейлі өзгертуде. AI-чатботты қалай енгізуге болатынын, ол қандай артықшылықтар беретінін және қанша тұратынын біліңіз.',
    },
    excerpt: {
      ru: 'Современные AI-чатботы способны понимать контекст разговора, отвечать на сложные вопросы и даже давать персональные рекомендации. Это уже не просто автоответчики...',
      en: 'Modern AI chatbots can understand conversation context, answer complex questions and even give personal recommendations. These are no longer just autoresponders...',
      kz: 'Заманауи AI-чатботтар әңгіме контекстін түсіне алады, күрделі сұрақтарға жауап бере алады және тіпті жеке ұсыныстар бере алады. Бұл енді жай автоответчительдер емес...',
    },
    category: {
      ru: 'AI и машинное обучение',
      en: 'AI & Machine Learning',
      kz: 'AI және машиналық оқыту',
    },
    date: '2023-12-28',
    keywords: {
      ru: ['AI чатбот', 'GPT чатбот', 'искусственный интеллект', 'клиентский сервис', 'автоматизация сервиса', 'AI Казахстан', 'чат-бот с ИИ'],
      en: ['AI chatbot', 'GPT chatbot', 'artificial intelligence', 'customer service', 'service automation', 'AI Kazakhstan', 'AI chat bot'],
      kz: ['AI чатбот', 'GPT чатбот', 'жасампаз интеллект', 'тұтынушыларға қызмет көрсету', 'қызмет автоматтандыру', 'AI Қазақстан', 'AI чат-бот'],
    },
    readingTime: 9,
    published: true,
  },
  {
    id: '6',
    slug: 'vybor-steka-tehnologij-dlya-proekta',
    title: {
      ru: 'Как выбрать правильный стек технологий для вашего проекта',
      en: 'How to Choose the Right Tech Stack for Your Project',
      kz: 'Жобаңызға дұрыс технологиялар стекін қалай таңдауға болады',
    },
    description: {
      ru: 'Правильный выбор технологий определяет успех проекта. Разбираем, как выбрать стек технологий для веб-приложения, мобильного приложения или сложной платформы. React, Next.js, Node.js и другие популярные технологии.',
      en: 'The right technology choice determines project success. We analyze how to choose a tech stack for a web application, mobile app or complex platform. React, Next.js, Node.js and other popular technologies.',
      kz: 'Технологияларды дұрыс таңдау жоба табысын анықтайды. Веб-қосымша, мобильді қосымша немесе күрделі платформа үшін технологиялар стекін қалай таңдауға болатынын талдаймыз. React, Next.js, Node.js және басқа танымал технологиялар.',
    },
    excerpt: {
      ru: 'Выбор технологий — один из самых важных решений на старте проекта. От него зависит скорость разработки, масштабируемость, производительность и стоимость поддержки...',
      en: 'Technology choice is one of the most important decisions at project start. It determines development speed, scalability, performance and maintenance cost...',
      kz: 'Технологияларды таңдау — жоба басталуындағы ең маңызды шешімдердің бірі. Ол әзірлеу жылдамдығын, масштабталуды, өнімділікті және қолдау құнын анықтайды...',
    },
    category: {
      ru: 'Разработка',
      en: 'Development',
      kz: 'Әзірлеу',
    },
    date: '2023-12-25',
    keywords: {
      ru: ['стек технологий', 'React', 'Next.js', 'Node.js', 'выбор технологий', 'веб-разработка', 'технологии для проекта'],
      en: ['tech stack', 'React', 'Next.js', 'Node.js', 'technology choice', 'web development', 'project technologies'],
      kz: ['технологиялар стекі', 'React', 'Next.js', 'Node.js', 'технологияларды таңдау', 'веб-дамыту', 'жоба технологиялары'],
    },
    readingTime: 11,
    published: true,
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug && post.published);
}

export function getAllBlogPosts(): BlogPost[] {
  return blogPosts.filter(post => post.published);
}

// Функции для работы с API (будут использоваться когда API будет готов)
// См. app/lib/blog-api.ts для реализации

