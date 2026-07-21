import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/app/lib/backend-config';

// Функция для сохранения диалога на сервер
async function saveToServer(dialogData: {
  chatId?: string; // Опциональное поле для обновления существующего чата
  timestamp: string;
  phone?: string;
  name?: string;
  projectType?: string;
  messages: Array<{ sender: string; text: string; time: string }>;
  metrics?: {
    // Базовые метрики
    messageCount?: number;
    userMessageCount?: number;
    botMessageCount?: number;
    
    // Бизнес-метрики
    hasPriceObjection?: boolean;
    hasNegativeResponse?: boolean;
    hasName?: boolean;
    askedForContact?: boolean;
    hasUncertainty?: boolean;
    uncertaintyCount?: number;
    
    // Метрики намерений
    hasBudget?: boolean;
    hasDeadline?: boolean;
    hasSpecificRequirements?: boolean;
    hasQuestions?: boolean;
    hasComparison?: boolean;
    hasPreviousExperience?: boolean;
    
    // Метрики тональности
    sentimentScore?: string;
    positiveWordsCount?: number;
    negativeWordsCount?: number;
    
    // Метрики вовлеченности
    engagementLevel?: string;
    averageMessageLength?: number;
    hasLongMessages?: boolean;
    hasShortMessages?: boolean;
    
    // Метрики срочности
    hasUrgency?: boolean;
    urgencyLevel?: string;
    
    // Метрики осведомленности
    technicalTerms?: boolean;
    businessTerms?: boolean;
    
    // Метрики конверсии
    hasPhone?: boolean;
    hasEmail?: boolean;
    hasAgreement?: boolean;
    conversionProbability?: number;
    qualityScore?: number;
    clientType?: string;
  };
  language?: string;
  userAgent?: string;
  ipAddress?: string;
}, request: NextRequest) {
  try {
    const backendUrl = getBackendUrl();
    
    // Получаем дополнительную информацию из запроса
    const userAgent = request.headers.get('user-agent') || undefined;
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      undefined;

    // Подготавливаем данные для отправки на сервер
    const payload = {
      ...dialogData,
      userAgent,
      ipAddress,
    };

    console.log('🌐 [Backend] Отправка на сервер:', {
      url: `${backendUrl}/api/chats`,
      messagesCount: payload.messages.length,
      timestamp: new Date().toLocaleTimeString('ru-RU'),
    });

    // Показываем полную структуру данных, которые будут отправлены на внешний сервер
    console.log('🌐 [Backend] Полные данные для отправки на внешний сервер:', {
      chatId: payload.chatId || 'нет (создание нового)',
      timestamp: payload.timestamp,
      phone: payload.phone,
      name: payload.name,
      projectType: payload.projectType,
      language: payload.language,
      userAgent: payload.userAgent,
      ipAddress: payload.ipAddress,
      metrics: payload.metrics,
      messages: payload.messages.map((msg: any, index: number) => ({
        index: index + 1,
        sender: msg.sender,
        text: msg.text?.substring(0, 50) + (msg.text?.length > 50 ? '...' : ''),
        time: msg.time,
      })),
      totalMessages: payload.messages.length,
    });

    // Показываем полный JSON для отладки
    const jsonString = JSON.stringify(payload, null, 2);
    console.log('📋 [Backend] Полный JSON данные для внешнего сервера:', jsonString);
    console.log('📋 [Backend] JSON данные (объект):', payload);

    const response = await fetch(`${backendUrl}/api/chats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ [Backend] Ошибка ответа сервера:', {
        status: response.status,
        error: errorData,
      });
      return { success: false, error: errorData.message || 'Failed to save chat' };
    }

    const data = await response.json();
    const isUpdated = data.updated === true;
    console.log(`✅ [Backend] Чат ${isUpdated ? 'обновлен' : 'создан'} на сервере:`, {
      chatId: data.chatId,
      updated: isUpdated,
      timestamp: new Date().toLocaleTimeString('ru-RU'),
    });
    return { 
      success: true, 
      chatId: data.chatId,
      updated: isUpdated,
    };
  } catch (error) {
    console.error('Ошибка сохранения на сервер:', error);
    return { success: false, error: 'Network error' };
  }
}

export async function POST(request: NextRequest) {
  try {
    // Обработка данных: может быть JSON (обычный запрос) или Blob (sendBeacon)
    let dialogData;
    const contentType = request.headers.get('content-type') || '';
    
    console.log('📥 [API Save] Content-Type:', contentType);
    
    try {
      if (contentType.includes('application/json')) {
        // Обычный JSON запрос
        dialogData = await request.json();
        console.log('📥 [API Save] Данные получены как JSON');
      } else {
        // sendBeacon отправляет Blob, читаем как текст и парсим JSON
        const text = await request.text();
        console.log('📥 [API Save] Получены данные через sendBeacon (Blob), размер:', text.length, 'символов');
        dialogData = JSON.parse(text);
        console.log('📥 [API Save] Данные успешно распарсены из Blob');
      }
    } catch (parseError) {
      console.error('❌ [API Save] Ошибка парсинга данных:', parseError);
      // Пробуем прочитать как JSON в любом случае
      try {
        const text = await request.text();
        dialogData = JSON.parse(text);
        console.log('✅ [API Save] Данные успешно распарсены после ошибки');
      } catch (finalError) {
        console.error('❌ [API Save] Критическая ошибка парсинга:', finalError);
        return NextResponse.json(
          { success: false, error: 'Invalid request data' },
          { status: 400 }
        );
      }
    }
    
    console.log('📥 [API Save] Получен запрос на сохранение чата:', {
      messagesCount: dialogData.messages?.length || 0,
      hasPhone: !!dialogData.phone,
      hasName: !!dialogData.name,
      projectType: dialogData.projectType || 'нет',
      language: dialogData.language,
      timestamp: new Date().toLocaleTimeString('ru-RU'),
    });

    // Показываем полную структуру данных, которые пришли на сервер
    console.log('📥 [API Save] Полные данные, полученные от клиента:', {
      timestamp: dialogData.timestamp,
      phone: dialogData.phone,
      name: dialogData.name,
      projectType: dialogData.projectType,
      language: dialogData.language,
      metrics: dialogData.metrics,
      messages: dialogData.messages?.map((msg: any, index: number) => ({
        index: index + 1,
        sender: msg.sender,
        text: msg.text?.substring(0, 50) + (msg.text?.length > 50 ? '...' : ''),
        time: msg.time,
      })),
      totalMessages: dialogData.messages?.length || 0,
    });

    // Показываем полный JSON для отладки
    const jsonString = JSON.stringify(dialogData, null, 2);
    console.log('📋 [API Save] Полный JSON данные:', jsonString);
    console.log('📋 [API Save] JSON данные (объект):', dialogData);
    
    // Валидация
    if (!dialogData.messages || !Array.isArray(dialogData.messages) || dialogData.messages.length < 2) {
      console.warn('⚠️ [API Save] Валидация не пройдена:', {
        hasMessages: !!dialogData.messages,
        isArray: Array.isArray(dialogData.messages),
        messagesLength: dialogData.messages?.length || 0,
      });
      return NextResponse.json(
        { success: false, message: 'Messages array is required and must have at least 2 items' },
        { status: 400 }
      );
    }

    console.log('✅ [API Save] Валидация пройдена, отправляю на сервер...');
    
    // Сохраняем диалог на сервер
    const result = await saveToServer(dialogData, request);
    
    if (result.success) {
      const isUpdated = result.updated === true;
      console.log(`✅ [API Save] Чат ${isUpdated ? 'обновлен' : 'создан'} на сервере:`, {
        chatId: result.chatId,
        updated: isUpdated,
        timestamp: new Date().toLocaleTimeString('ru-RU'),
      });
      return NextResponse.json({ 
        success: true,
        chatId: result.chatId,
        updated: isUpdated,
        message: isUpdated ? 'Chat updated successfully' : 'Chat saved successfully'
      });
    } else {
      console.error('❌ [API Save] Ошибка сохранения на сервер:', result.error);
      return NextResponse.json(
        { success: false, message: result.error || 'Не удалось сохранить диалог' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ [API Save] Критическая ошибка:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

