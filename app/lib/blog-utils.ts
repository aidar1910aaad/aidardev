import type { BlogPost } from '../data/blog-posts';
import type { ServiceKey } from '../data/services-config';

export type BlogLang = 'ru' | 'en' | 'kz';

const WHATSAPP_NUMBER = '77066703696';

export function buildWhatsAppUrl(input: {
  slug: string;
  title: string;
  locale: BlogLang;
  projectType?: string;
  budgetOrTask?: string;
}): string {
  const title = input.title.trim();
  const projectType = input.projectType?.trim();
  const budgetOrTask = input.budgetOrTask?.trim();

  let message = '';
  if (input.locale === 'kz') {
    message = `Сәлеметсіз бе! «${title}» мақаласын оқыдым және ұқсас жобаны талқылағым келеді.`;
    if (projectType) message += `\nЖоба түрі: ${projectType}`;
    if (budgetOrTask) message += `\nМіндет/бюджет: ${budgetOrTask}`;
  } else if (input.locale === 'en') {
    message = `Hi! I read “${title}” and would like to discuss a similar project.`;
    if (projectType) message += `\nProject type: ${projectType}`;
    if (budgetOrTask) message += `\nBudget/task: ${budgetOrTask}`;
  } else {
    message = `Здравствуйте! Прочитал(а) статью «${title}» и хочу обсудить похожий проект.`;
    if (projectType) message += `\nТип проекта: ${projectType}`;
    if (budgetOrTask) message += `\nЗадача/бюджет: ${budgetOrTask}`;
  }

  // Keep slug only as a quiet tracking marker at the end for you, not as a form dump.
  message += `\n\n(со страницы /${input.locale}/blog/${input.slug})`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function terms(post: BlogPost, lang: BlogLang): Set<string> {
  return new Set([
    post.category[lang],
    ...(post.keywords[lang] || []),
  ].flatMap((value) => value.toLocaleLowerCase().split(/[^\p{L}\p{N}]+/u)).filter((value) => value.length > 2));
}

export function getRelatedPosts(posts: BlogPost[], current: BlogPost, lang: BlogLang, limit = 3): BlogPost[] {
  const currentTerms = terms(current, lang);
  return posts
    .filter((post) => post.slug !== current.slug && post.published !== false && Boolean(post.content?.[lang]))
    .map((post) => ({
      post,
      score: [...terms(post, lang)].filter((term) => currentTerms.has(term)).length
        + (post.category[lang] === current.category[lang] ? 5 : 0),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || Date.parse(b.post.date) - Date.parse(a.post.date))
    .slice(0, limit)
    .map(({ post }) => post);
}

const serviceMatchers: Array<[ServiceKey, RegExp]> = [
  ['ai', /\b(ai|gpt|искусствен|жасанды|chatbot|чатбот)/i],
  ['bots', /(telegram|whatsapp|бот)/i],
  ['mobile', /(mobile|мобиль|қосымша|android|ios)/i],
  ['design', /(design|дизайн|ux|ui)/i],
  ['consulting', /(consult|консульт|кеңес|обуч)/i],
  ['websites', /(web|сайт|seo|интернет-магазин|conversion|конвер)/i],
];

export function getRelatedServices(post: BlogPost, lang: BlogLang, limit = 3): ServiceKey[] {
  const haystack = [post.category[lang], ...(post.keywords[lang] || [])].join(' ');
  const matched = serviceMatchers.filter(([, pattern]) => pattern.test(haystack)).map(([key]) => key);
  return [...new Set([...matched, 'websites' as ServiceKey])].slice(0, limit);
}

export function splitArticleHtml(html: string): [string, string] {
  const breaks = [...html.matchAll(/<\/(?:p|h2|h3|ul|ol|blockquote)>/gi)];
  if (breaks.length < 2) return [html, ''];
  const target = html.length / 2;
  const split = breaks.reduce((best, match) => {
    const index = (match.index || 0) + match[0].length;
    return Math.abs(index - target) < Math.abs(best - target) ? index : best;
  }, (breaks[0].index || 0) + breaks[0][0].length);
  return [html.slice(0, split), html.slice(split)];
}
