import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/app/lib/backend-config';

const BACKEND_URL = getBackendUrl();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // В Next.js 15 params может быть Promise
    const resolvedParams = await Promise.resolve(params);
    const chatId = resolvedParams.id;

    if (!chatId) {
      console.error('❌ [API Admin Chat Details] Отсутствует chatId в параметрах');
      return NextResponse.json(
        { success: false, error: 'Chat ID is required' },
        { status: 400 }
      );
    }

    console.log('🌐 [API Admin Chat Details] Запрос к серверу:', {
      url: `${BACKEND_URL}/api/chats/${chatId}`,
      chatId: chatId,
    });

    const response = await fetch(`${BACKEND_URL}/api/chats/${chatId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    console.log('📥 [API Admin Chat Details] Ответ от сервера:', {
      status: response.status,
      ok: response.ok,
      hasData: !!data.data,
      success: data.success,
      message: data.message,
    });

    if (!response.ok) {
      console.error('❌ [API Admin Chat Details] Ошибка сервера:', data);
      return NextResponse.json(
        { 
          success: false, 
          error: data.message || 'Chat not found',
          data: data, // Для отладки
        },
        { status: response.status }
      );
    }

    // Обеспечиваем правильную структуру ответа
    return NextResponse.json({
      success: true,
      data: data.data || data,
    });
  } catch (error) {
    console.error('❌ [API Admin Chat Details] Критическая ошибка:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // В Next.js 15 params может быть Promise
    const resolvedParams = await Promise.resolve(params);
    const chatId = resolvedParams.id;

    if (!chatId) {
      console.error('❌ [API Admin Chat Update] Отсутствует chatId в параметрах');
      return NextResponse.json(
        { success: false, error: 'Chat ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    console.log('🌐 [API Admin Chat Update] Запрос к серверу:', {
      url: `${BACKEND_URL}/api/chats/${chatId}`,
      chatId: chatId,
      body,
    });

    const response = await fetch(`${BACKEND_URL}/api/chats/${chatId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    console.log('📥 [API Admin Chat Update] Ответ от сервера:', {
      status: response.status,
      ok: response.ok,
      hasData: !!data.data,
      success: data.success,
      message: data.message,
    });

    if (!response.ok) {
      console.error('❌ [API Admin Chat Update] Ошибка сервера:', data);
      return NextResponse.json(
        { 
          success: false, 
          error: data.message || 'Failed to update chat',
          data: data, // Для отладки
        },
        { status: response.status }
      );
    }

    // Обеспечиваем правильную структуру ответа
    return NextResponse.json({
      success: true,
      data: data.data || data,
    });
  } catch (error) {
    console.error('❌ [API Admin Chat Update] Критическая ошибка:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

