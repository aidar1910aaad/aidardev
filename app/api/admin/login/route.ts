import { timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';

function equalSecrets(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  const password = process.env.ADMIN_BLOG_PASSWORD;
  const sessionToken = process.env.ADMIN_BLOG_SESSION_TOKEN;

  if (!password || !sessionToken) {
    return NextResponse.json(
      { error: 'Admin login is not configured' },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as { password?: string };
  if (!body.password || !equalSecrets(body.password, password)) {
    return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set('aidardev_admin_session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
