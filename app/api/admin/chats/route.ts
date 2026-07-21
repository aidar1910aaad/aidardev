import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/app/lib/backend-config';

const BACKEND_URL = getBackendUrl();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Проксируем все query параметры
    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
      params.append(key, value);
    });

    console.log('🌐 [API Admin Chats] Запрос к серверу:', {
      url: `${BACKEND_URL}/api/chats?${params.toString()}`,
      params: params.toString(),
    });

    const response = await fetch(`${BACKEND_URL}/api/chats?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    console.log('📥 [API Admin Chats] Ответ от сервера:', {
      status: response.status,
      ok: response.ok,
      hasData: !!data.data,
      chatsCount: data.data?.chats?.length || 0,
      success: data.success,
      serverMessage: data.message,
    });

    if (!response.ok) {
      console.error('❌ [API Admin Chats] Ошибка сервера:', data);
      return NextResponse.json(
        { 
          success: false, 
          error: data.message || 'Failed to fetch chats',
          data: data, // Передаем полный ответ для отладки
        },
        { status: response.status }
      );
    }

    // Проверяем, есть ли ошибка внутри успешного ответа
    if (data.success === false || data.message) {
      console.error('❌ [API Admin Chats] Ошибка в ответе:', data.message);
      return NextResponse.json({
        success: true, // API route успешен
        data: {
          success: false,
          message: data.message || 'Server error',
        },
      });
    }

    // Обеспечиваем правильную структуру ответа
    return NextResponse.json({
      success: true,
      data: data.data || data,
    });
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

