import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '../../../lib/backend-config';

export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const backendSecret = process.env.BLOG_API_SECRET;
  if (!cronSecret || request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!backendSecret) {
    return NextResponse.json({ error: 'BLOG_API_SECRET is not configured' }, { status: 503 });
  }

  const weekday = new Date().getUTCDay();
  const slotByWeekday: Record<number, number> = { 1: 1, 3: 2, 5: 3 };
  const slot = slotByWeekday[weekday];
  if (!slot) {
    return NextResponse.json({ error: 'Cron is only scheduled for Monday, Wednesday, and Friday' }, { status: 400 });
  }

  const path = process.env.BLOG_CRON_BACKEND_PATH || '/api/blog/cron/generate';
  const backendUrl = new URL(path, `${getBackendUrl()}/`);
  backendUrl.searchParams.set('slot', String(slot));
  const response = await fetch(backendUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${backendSecret}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
  const payload = await response.json().catch(() => ({ ok: response.ok }));
  return NextResponse.json(payload, { status: response.status });
}
