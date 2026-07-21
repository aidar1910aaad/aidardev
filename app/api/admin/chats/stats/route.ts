import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/app/lib/backend-config';

const BACKEND_URL = getBackendUrl();

// Кеш для статистики (в продакшене лучше использовать Redis)
let statsCache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 30000; // 30 секунд

export async function GET(request: NextRequest) {
  try {
    // Проверяем кеш
    const now = Date.now();
    if (statsCache && (now - statsCache.timestamp) < CACHE_TTL) {
      console.log('📦 [API Stats] Используем кеш');
      return NextResponse.json({
        success: true,
        data: statsCache.data,
      });
    }

    // Добавляем таймаут для запроса (3 секунды)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${BACKEND_URL}/api/chats/stats`, {
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      // Если есть кеш, возвращаем его даже при ошибке
      if (statsCache) {
        console.log('⚠️ [API Stats] Ошибка, но возвращаем кеш');
        return NextResponse.json({
          success: true,
          data: statsCache.data,
        });
      }
      
      return NextResponse.json(
        { success: false, error: data.message || 'Failed to fetch stats' },
        { status: response.status }
      );
    }

    // Сохраняем в кеш
    statsCache = {
      data: data.data || data,
      timestamp: now,
    };

    return NextResponse.json({
      success: true,
      data: data.data || data,
    });
  } catch (error: any) {
    console.error('❌ [API Stats] Ошибка:', error);
    
    // Если есть кеш, возвращаем его даже при ошибке
    if (statsCache) {
      console.log('⚠️ [API Stats] Ошибка запроса, но возвращаем кеш');
      return NextResponse.json({
        success: true,
        data: statsCache.data,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

