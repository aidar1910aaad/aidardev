import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/app/lib/backend-config';
import { blogBackendAuthHeaders, isAuthorizedBlogAdmin } from '@/app/lib/blog-admin';

const BACKEND_API_URL = getBackendUrl();

// POST /api/blog/generate - Сгенерировать статью с помощью AI
export async function POST(request: NextRequest) {
  try {
    if (!isAuthorizedBlogAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = request.nextUrl;
    const topic = searchParams.get('topic');
    const language = searchParams.get('language') || 'ru';
    const autoSave = searchParams.get('autoSave') === 'true';

    const body: Record<string, string | boolean> = {};
    if (topic) {
      body.topic = topic;
    }
    if (language) {
      body.language = language;
    }
    if (autoSave !== undefined) {
      body.autoSave = autoSave;
    }

    const url = topic
      ? `${BACKEND_API_URL}/api/blog/generate?topic=${encodeURIComponent(topic)}&language=${language}&autoSave=${autoSave}`
      : `${BACKEND_API_URL}/api/blog/generate/auto?language=${language}&autoSave=${autoSave}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...blogBackendAuthHeaders(),
      },
      body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Ошибка генерации статьи' }));
      return NextResponse.json(
        { success: false, error: error.message || 'Ошибка генерации статьи' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Ошибка генерации статьи:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

