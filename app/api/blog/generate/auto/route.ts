import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/app/lib/backend-config';
import { blogBackendAuthHeaders, isAuthorizedBlogAdmin } from '@/app/lib/blog-admin';

export const maxDuration = 300;

const BACKEND_API_URL = getBackendUrl();

// POST /api/blog/generate/auto - Автоматически сгенерировать статью (тема генерируется AI)
export async function POST(request: NextRequest) {
  try {
    if (!isAuthorizedBlogAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Войдите в админку заново' },
        { status: 401 },
      );
    }
    const { searchParams } = request.nextUrl;
    const autoSave = searchParams.get('autoSave') !== 'false';

    const response = await fetch(
      `${BACKEND_API_URL}/api/blog/generate/auto?autoSave=${autoSave}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...blogBackendAuthHeaders(),
        },
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Ошибка генерации статьи' }));
      const nested = typeof error.message === 'object' && error.message ? error.message : error;
      const message =
        (typeof nested.message === 'string' && nested.message) ||
        (typeof error.message === 'string' && error.message) ||
        error.error ||
        'Ошибка генерации статьи';
      const details = nested.errors || error.errors || error.details || [];
      return NextResponse.json(
        {
          success: false,
          error: message,
          details,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Ошибка генерации статьи:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Внутренняя ошибка сервера' },
      { status: 500 },
    );
  }
}

