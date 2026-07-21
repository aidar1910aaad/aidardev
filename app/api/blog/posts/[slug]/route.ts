import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/app/lib/backend-config';
import { blogBackendAuthHeaders, isAuthorizedBlogAdmin } from '@/app/lib/blog-admin';

const BACKEND_API_URL = getBackendUrl();

// GET /api/blog/posts/[slug] - Получить пост по slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    if (!isAuthorizedBlogAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { slug } = await params;

    const response = await fetch(`${BACKEND_API_URL}/api/blog/posts/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...blogBackendAuthHeaders(),
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, error: 'Статья не найдена' },
          { status: 404 }
        );
      }
      const error = await response.json().catch(() => ({ message: 'Ошибка загрузки статьи' }));
      return NextResponse.json(
        { success: false, error: error.message || 'Ошибка загрузки статьи' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Ошибка получения статьи:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// PATCH /api/blog/posts/[slug] - Обновить пост
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    if (!isAuthorizedBlogAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { slug } = await params;
    const body = await request.json();

    // Soft-fill empty EN for older backend validators that still require IsNotEmpty.
    const fillEn = <T extends { ru?: string; en?: string; kz?: string }>(value?: T, fallback = '—') => {
      if (!value || typeof value !== 'object') return value;
      return { ...value, en: value.en?.trim() ? value.en : value.ru || fallback };
    };
    const normalized = {
      ...body,
      title: fillEn(body.title, 'Untitled'),
      description: fillEn(body.description, 'Description'),
      excerpt: fillEn(body.excerpt, 'Excerpt'),
      category: fillEn(body.category, 'General'),
      content: fillEn(body.content, '<p></p>'),
      keywords: body.keywords
        ? {
            ...body.keywords,
            en: Array.isArray(body.keywords.en) && body.keywords.en.length
              ? body.keywords.en
              : body.keywords.ru || ['blog'],
          }
        : body.keywords,
    };

    const response = await fetch(`${BACKEND_API_URL}/api/blog/posts/${slug}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...blogBackendAuthHeaders(),
      },
      body: JSON.stringify(normalized),
    });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Ошибка обновления статьи' }));
        const details = Array.isArray(error.message) ? error.message.join('; ') : error.message;
        return NextResponse.json(
          { success: false, error: details || error.error || 'Ошибка обновления статьи' },
          { status: response.status },
        );
      }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Ошибка обновления статьи:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/posts/[slug] - Удалить пост
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    if (!isAuthorizedBlogAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { slug } = await params;

    const response = await fetch(`${BACKEND_API_URL}/api/blog/posts/${slug}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...blogBackendAuthHeaders(),
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, error: 'Статья не найдена' },
          { status: 404 }
        );
      }
      const error = await response.json().catch(() => ({ message: 'Ошибка удаления статьи' }));
      return NextResponse.json(
        { success: false, error: error.message || 'Ошибка удаления статьи' },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, message: 'Статья успешно удалена' });
  } catch (error: unknown) {
    console.error('Ошибка удаления статьи:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

