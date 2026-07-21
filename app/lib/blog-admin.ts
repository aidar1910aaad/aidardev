import { timingSafeEqual } from 'node:crypto';
import type { NextRequest } from 'next/server';

function equalSecrets(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function isAuthorizedBlogAdmin(request: NextRequest): boolean {
  const expected = process.env.ADMIN_BLOG_SESSION_TOKEN;
  const supplied = request.cookies.get('aidardev_admin_session')?.value;
  return Boolean(expected && supplied && equalSecrets(expected, supplied));
}

export function blogBackendAuthHeaders(): Record<string, string> {
  const secret = process.env.BLOG_API_SECRET;
  if (!secret) throw new Error('BLOG_API_SECRET is not configured');
  return {
    Authorization: `Bearer ${secret}`,
    'x-api-key': secret,
  };
}
