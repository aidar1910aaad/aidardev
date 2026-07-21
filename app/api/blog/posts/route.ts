import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/app/lib/backend-config';
import { blogBackendAuthHeaders, isAuthorizedBlogAdmin } from '@/app/lib/blog-admin';

const BACKEND_API_URL = getBackendUrl();

// GET /api/blog/posts - Получить все посты
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const published = searchParams.get('published');
    const isPublicRequest = published === 'true';
    if (!isPublicRequest && !isAuthorizedBlogAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = new URLSearchParams();
    if (published !== null) {
      params.append('published', published);
    }

    const backendUrl = `${BACKEND_API_URL}/api/blog/posts?${params.toString()}`;
    console.log('🌐 [API Blog Posts] Запрос к бэкенду:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(!isPublicRequest ? blogBackendAuthHeaders() : {}),
      },
    });

    console.log('📥 [API Blog Posts] Ответ от бэкенда:', {
      status: response.status,
      ok: response.ok,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Ошибка загрузки статей' }));
      return NextResponse.json(
        { success: false, error: error.message || 'Ошибка загрузки статей' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Ошибка получения статей:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// POST /api/blog/posts - Создать новый пост
export async function POST(request: NextRequest) {
  try {
    if (!isAuthorizedBlogAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();

    const response = await fetch(`${BACKEND_API_URL}/api/blog/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...blogBackendAuthHeaders(),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Ошибка создания статьи' }));
      return NextResponse.json(
        { success: false, error: error.message || 'Ошибка создания статьи' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    console.error('Ошибка создания статьи:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

