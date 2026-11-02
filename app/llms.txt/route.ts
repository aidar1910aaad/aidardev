// /llms.txt: краткая справка о студии для ИИ-ассистентов (формат llmstxt.org). Собирается из тех же данных,
// что и сайт: решения из app/data/solutions.ts и цены из app/data/pricing.json, поэтому не расходится с ними.
import pricing from '../data/pricing.json';
import { INDUSTRY_HUB, SOLUTIONS, SOLUTIONS_HUB, isIndustrySolution } from '../data/solutions';

export const dynamic = 'force-static';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';

const SERVICE_PAGES: Array<{ key: keyof typeof pricing.services; title: string }> = [
  { key: 'websites', title: 'Сайты и интернет-магазины' },
  { key: 'bots', title: 'Telegram- и WhatsApp-боты' },
  { key: 'ai', title: 'ИИ-боты и автоматизация' },
  { key: 'mobile', title: 'Мобильные приложения' },
  { key: 'design', title: 'Дизайн' },
  { key: 'consulting', title: 'Консультации' },
];

const money = (value: number) => `${value.toLocaleString('ru-RU').replace(/ /g, ' ')} ₸`;

export function GET() {
  const lines = [
    '# aidardev',
    '',
    '> Студия разработки в Казахстане: Астана, Алматы и удалённо по всему Казахстану. Делаем сайты, WhatsApp- и Telegram-ботов, ИИ-решения, мобильные приложения и сложные системы на заказ: трекинг для карго, маркетплейсы, CRM, интеграции с Kaspi и 1С, ПО для заводов, производства и нефтегаза. 68+ проектов, 8+ лет в разработке.',
    '',
    'Контакты: WhatsApp и телефон +7 706 670 36 96, Telegram @opunksnoo, сайт ' + siteUrl + '. На связи 9:00–21:00, в рабочее время отвечаем в WhatsApp за 15 минут. Оценка и консультация бесплатно. Код, база и доступы остаются у клиента, систему можно поставить на сервер клиента. Работаем по договору с ТОО и ИП, оплата по этапам, гарантия 1-3 месяца.',
    '',
    '## Сложная разработка на заказ',
    '',
    `- [${SOLUTIONS_HUB.title}](${siteUrl}${SOLUTIONS_HUB.path}): все решения`,
    ...SOLUTIONS.filter((s) => !isIndustrySolution(s)).map((s) => `- [${s.title}](${siteUrl}/ru/solutions/${s.slug}): ${s.card}`),
    '',
    '## Промышленность и нефтегаз',
    '',
    `- [${INDUSTRY_HUB.title}](${siteUrl}${INDUSTRY_HUB.path}): все решения для производства`,
    ...SOLUTIONS.filter(isIndustrySolution).map((s) => `- [${s.title}](${siteUrl}/ru/solutions/${s.slug}): ${s.card}`),
    '',
    '## Услуги и цены',
    '',
    `- [Все цены](${siteUrl}/ru/pricing)`,
    ...SERVICE_PAGES.map(({ key, title }) => {
      const tiers = Object.values(pricing.services[key]).map((tier) => `${tier.name} от ${money(tier.price)}`);
      return `- [${title}](${siteUrl}/ru/services/${key}): ${tiers.join(', ')}`;
    }),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
