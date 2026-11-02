import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { BLOG_POSTS_TAG, blogPostTag, isValidBlogSlug } from '../../../lib/blog-cache';
import { locales } from '../../../lib/i18n';

/**
 * Вебхук бэкенда после публикации/правки/удаления статьи: { slug?, languages?, published? }.
 * Обновляем блог на всех языках сайта (в т.ч. /en), не полагаясь на `languages` из тела:
 * страницы блога кэшируются на неделю и без вебхука сами не обновятся.
 */
export async function POST(request: NextRequest) {
  const expected = process.env.BLOG_REVALIDATE_SECRET;
  const authorization = request.headers.get('authorization');
  const body = await request.json().catch(() => ({})) as { secret?: string; slug?: string };
  const supplied = authorization?.replace(/^Bearer\s+/i, '') || body.secret;

  if (!expected || supplied !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (body.slug && !isValidBlogSlug(body.slug)) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
  }

  const paths = new Set(['/sitemap.xml']);
  locales.forEach((lang) => {
    paths.add(`/${lang}/blog`);
    paths.add(`/${lang}/blog/rss.xml`);
    if (body.slug) paths.add(`/${lang}/blog/${body.slug}`);
  });
  paths.forEach((path) => revalidatePath(path));

  // Теги: список статей (индекс, RSS, sitemap) и сама статья с её OG-картинкой. «По теме» (blog-related) не трогаем,
  // чтобы правка одной статьи не перестраивала все остальные.
  // { expire: 0 } — данные устаревают сразу, следующий запрос строит страницу заново (а не отдаёт старую).
  const tags = [BLOG_POSTS_TAG, ...(body.slug ? [blogPostTag(body.slug)] : [])];
  tags.forEach((tag) => revalidateTag(tag, { expire: 0 }));

  return NextResponse.json({ revalidated: true, paths: [...paths], tags, now: new Date().toISOString() });
}
