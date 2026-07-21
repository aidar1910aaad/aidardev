import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const allowedLanguages = new Set(['ru', 'kz']);

export async function POST(request: NextRequest) {
  const expected = process.env.BLOG_REVALIDATE_SECRET;
  const authorization = request.headers.get('authorization');
  const body = await request.json().catch(() => ({})) as { secret?: string; slug?: string; languages?: string[] };
  const supplied = authorization?.replace(/^Bearer\s+/i, '') || body.secret;

  if (!expected || supplied !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (body.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.slug)) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
  }

  const languages = (body.languages?.length ? body.languages : ['ru', 'kz']).filter((lang) => allowedLanguages.has(lang));
  if (!languages.length) return NextResponse.json({ error: 'No supported languages' }, { status: 400 });

  const paths = new Set(['/sitemap.xml']);
  languages.forEach((lang) => {
    paths.add(`/${lang}/blog`);
    paths.add(`/${lang}/blog/rss.xml`);
    if (body.slug) paths.add(`/${lang}/blog/${body.slug}`);
  });
  paths.forEach((path) => revalidatePath(path));

  return NextResponse.json({ revalidated: true, paths: [...paths], now: new Date().toISOString() });
}
