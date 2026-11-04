/**
 * Калькулятор «Сколько стоит сайт в Астане» (/ru/cities/astana/stoimost-sajta).
 * Вилка: нижняя граница = цена «Старт» с сайта (pricing.json), верхняя = полный пакет из sales-kit.
 * Надбавки за размер и опции предложены 04.11.2026, Айдар проверяет перед выкладкой.
 */

export type CalcTypeKey = 'vizitka' | 'corp' | 'shop' | 'tg' | 'wa' | 'ai' | 'app';
export type CalcOptionKey = 'kaz' | 'texts' | 'kaspi' | 'onec' | 'crm' | 'bot';

export interface CalcRange {
  min: number;
  max: number;
}

export interface CalcType {
  key: CalcTypeKey;
  name: string;
  hint: string;
  base: CalcRange;
  time: string;
  /** Вопрос о размере: страницы сайта или товары магазина. */
  size?: { question: string; steps: Array<{ label: string; add: CalcRange }> };
  options: CalcOptionKey[];
  /** Опции, которые уже входят в цену (показываем галочкой без надбавки). */
  included?: CalcOptionKey[];
}

export interface CalcOption {
  key: CalcOptionKey;
  name: string;
  add: CalcRange;
}

const zero: CalcRange = { min: 0, max: 0 };

export const CALC_TYPES: CalcType[] = [
  {
    key: 'vizitka',
    name: 'Сайт-визитка или лендинг',
    hint: 'Одна страница: услуги, цены, контакты, заявки',
    base: { min: 45000, max: 150000 },
    time: '5-7 дней, с дизайном под вас 1-2 недели',
    options: ['kaz', 'texts', 'kaspi', 'crm', 'bot'],
  },
  {
    key: 'corp',
    name: 'Корпоративный сайт',
    hint: 'Несколько страниц: услуги, каталог, проекты, о компании',
    base: { min: 90000, max: 300000 },
    time: '1-2 недели, полный пакет 3-4 недели',
    size: {
      question: 'Сколько страниц',
      steps: [
        { label: 'До 5', add: zero },
        { label: '6-10', add: { min: 40000, max: 100000 } },
        { label: '11-20', add: { min: 100000, max: 200000 } },
      ],
    },
    options: ['kaz', 'texts', 'kaspi', 'onec', 'crm', 'bot'],
  },
  {
    key: 'shop',
    name: 'Интернет-магазин',
    hint: 'Каталог, корзина, оплата, заказы',
    base: { min: 120000, max: 450000 },
    time: '2-3 недели, полный пакет 1-3 месяца',
    size: {
      question: 'Сколько товаров',
      steps: [
        { label: 'До 50', add: zero },
        { label: '51-500', add: { min: 60000, max: 150000 } },
        { label: 'Больше 500', add: { min: 150000, max: 300000 } },
      ],
    },
    options: ['kaz', 'texts', 'kaspi', 'onec', 'crm', 'bot'],
    included: ['kaspi'],
  },
  {
    key: 'tg',
    name: 'Telegram-бот',
    hint: 'Меню, ответы, заявки, уведомления',
    base: { min: 40000, max: 150000 },
    time: '1-3 недели',
    options: ['kaz', 'crm'],
  },
  {
    key: 'wa',
    name: 'WhatsApp-бот',
    hint: 'Автоответы, заявки и запись в WhatsApp',
    base: { min: 60000, max: 250000 },
    time: '1-3 недели',
    options: ['kaz', 'crm'],
  },
  {
    key: 'ai',
    name: 'ИИ-бот',
    hint: 'Отвечает по вашему прайсу живым языком',
    base: { min: 70000, max: 450000 },
    time: '1-4 недели',
    options: ['crm'],
  },
  {
    key: 'app',
    name: 'Мобильное приложение',
    hint: 'iOS и Android, от первой версии до продукта',
    base: { min: 400000, max: 1500000 },
    time: '1-3 месяца',
    options: ['kaz', 'crm'],
  },
];

export const CALC_OPTIONS: CalcOption[] = [
  { key: 'kaz', name: 'Казахская версия', add: { min: 20000, max: 60000 } },
  { key: 'texts', name: 'Тексты пишем мы', add: { min: 15000, max: 50000 } },
  { key: 'kaspi', name: 'Онлайн-оплата Kaspi Pay', add: { min: 20000, max: 40000 } },
  { key: 'onec', name: 'Обмен с 1С или МойСклад', add: { min: 100000, max: 250000 } },
  { key: 'crm', name: 'Заявки в CRM (Bitrix24, amoCRM)', add: { min: 30000, max: 100000 } },
  { key: 'bot', name: 'WhatsApp-бот к сайту', add: { min: 60000, max: 250000 } },
];

/** Срочный запуск за 1-2 недели: ×1,5, как в priceModifiers из pricing.json. */
export const URGENT_FACTOR = 1.5;

const round = (value: number) => Math.round(value / 5000) * 5000;

export function calcEstimate(
  typeKey: CalcTypeKey,
  sizeIndex: number,
  optionKeys: CalcOptionKey[],
  urgent: boolean,
): CalcRange {
  const type = CALC_TYPES.find((t) => t.key === typeKey) ?? CALC_TYPES[0];
  const size = type.size?.steps[sizeIndex]?.add ?? zero;
  let min = type.base.min + size.min;
  let max = type.base.max + size.max;
  for (const key of optionKeys) {
    if (!type.options.includes(key) || type.included?.includes(key)) continue;
    const option = CALC_OPTIONS.find((o) => o.key === key);
    if (option) {
      min += option.add.min;
      max += option.add.max;
    }
  }
  const factor = urgent ? URGENT_FACTOR : 1;
  return { min: round(min * factor), max: round(max * factor) };
}

export function formatTenge(value: number): string {
  return `${value.toLocaleString('ru-RU').replace(/ /g, ' ')} ₸`;
}

/** Таблица цен на странице калькулятора: «Старт» и полный пакет. */
export const PRICE_TABLE: Array<{ name: string; start: string; full: string; time: string }> = [
  { name: 'Сайт-визитка', start: 'от 45 000 ₸', full: 'от 150 000 ₸', time: '5-7 дней' },
  { name: 'Лендинг', start: 'от 45 000 ₸', full: 'от 150 000 ₸', time: '5-7 дней' },
  { name: 'Корпоративный сайт', start: 'от 90 000 ₸', full: 'от 300 000 ₸', time: '1-4 недели' },
  { name: 'Интернет-магазин', start: 'от 120 000 ₸', full: 'от 450 000 ₸', time: '2 недели - 3 месяца' },
  { name: 'Telegram-бот', start: 'от 40 000 ₸', full: 'от 150 000 ₸', time: '1-3 недели' },
  { name: 'WhatsApp-бот', start: 'от 60 000 ₸', full: 'от 250 000 ₸', time: '1-3 недели' },
  { name: 'ИИ-бот', start: 'от 70 000 ₸', full: 'с CRM от 450 000 ₸', time: '1-4 недели' },
  { name: 'Мобильное приложение', start: 'от 400 000 ₸', full: 'от 1 500 000 ₸', time: '1-3 месяца' },
  { name: 'Поддержка сайта', start: 'от 15 000 ₸ за задачу', full: 'от 30 000 ₸ в месяц', time: 'по задаче' },
];

export const PRICE_PAGE = {
  title: 'Сколько стоит сайт в Астане в 2026 году | калькулятор цены',
  description:
    'Калькулятор стоимости сайта в Астане: визитка от 45 000 ₸, корпоративный сайт от 90 000 ₸, интернет-магазин от 120 000 ₸, боты от 40 000 ₸. Посчитайте вилку за минуту.',
  h1: 'Сколько стоит сайт в Астане в 2026 году',
  lead: 'Выберите, что нужно, и калькулятор покажет вилку цены и срок',
  body:
    'Нижняя граница это пакет «Старт»: сайт по готовой проверенной структуре. Верхняя это полный пакет с дизайном под ваш бренд, админ-панелью и интеграциями. Точную цену называем после короткого созвона, оценка бесплатная.',
  factors: [
    { label: 'Тип сайта', text: 'Визитка на одну страницу и магазин с каталогом отличаются по цене в разы.' },
    { label: 'Размер', text: 'Число страниц или товаров: каждый новый раздел это дизайн, вёрстка и наполнение.' },
    { label: 'Дизайн', text: 'Готовая структура быстрее и дешевле, дизайн под ваш бренд дольше и дороже.' },
    { label: 'Интеграции', text: 'Kaspi Pay, 1С, МойСклад, CRM и боты требуют настройки и проверки обмена данными.' },
    { label: 'Срочность', text: 'Запуск за 1-2 недели, когда обычно нужно больше, стоит примерно в 1,5 раза дороже.' },
  ],
  faq: [
    {
      question: 'Сколько стоит сайт в Астане в 2026 году?',
      answer:
        'У нас сайт-визитка или лендинг стоит от 45 000 ₸, корпоративный сайт от 90 000 ₸, интернет-магазин от 120 000 ₸. Это цены пакета «Старт» по готовой структуре. Полный пакет с дизайном под бренд: визитка от 150 000 ₸, корпоративный от 300 000 ₸, магазин от 450 000 ₸.',
    },
    {
      question: 'Почему у разных студий цены отличаются в разы?',
      answer:
        'Под словом «сайт» понимают разное: шаблон на конструкторе, сайт по готовой структуре или проект с дизайном, текстами, админ-панелью и интеграциями. Сравнивайте не цену, а состав работ, сроки, гарантию и примеры похожих проектов.',
    },
    {
      question: 'Что дешевле: конструктор или заказной сайт?',
      answer:
        'Конструктор вроде Tilda дешевле на старте, но это ежемесячная подписка, ограничения по скорости и функциям. Заказной сайт стоит дороже один раз, зато код ваш, нет подписки и можно подключить Kaspi Pay, 1С и CRM.',
    },
    {
      question: 'Сколько стоит домен и хостинг?',
      answer: 'Домен .kz около 10 000 ₸ в год, оформляется на вас. Хостинг для небольшого сайта обычно до нескольких тысяч тенге в месяц, точнее скажем под ваш проект.',
    },
    {
      question: 'Насколько точен калькулятор?',
      answer:
        'Он показывает вилку по нашим ценам. Точная сумма зависит от материалов, которые у вас уже есть, и от деталей интеграций. После созвона присылаем смету с составом работ.',
    },
    { question: 'Как проходит оплата?', answer: 'Оплата 50/50: половина на старте, вторая половина после запуска, когда вы приняли сайт.' },
    { question: 'Есть ли гарантия?', answer: 'Да, гарантия от 1 до 3 месяцев после запуска в зависимости от пакета: исправляем ошибки бесплатно.' },
    {
      question: 'Сколько стоит поддержка сайта после запуска?',
      answer: 'Поддержка от 30 000 ₸ в месяц, разовая доработка от 15 000 ₸ за задачу. Поддержка по желанию: сайт можно вести и самим.',
    },
  ],
  keywords: ['сколько стоит сайт астана', 'создание сайта астана цена', 'разработка сайта астана цена', 'стоимость сайта астана', 'калькулятор стоимости сайта'],
};
