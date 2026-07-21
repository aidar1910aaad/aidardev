# Пример интеграции с бэкендом

## Текущая реализация

Сейчас чаты сохраняются в Google Sheets через `/api/save-dialog`.

## Новая реализация (после готовности бэкенда)

### 1. Обновить `app/api/save-dialog/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const dialogData = await request.json();
    
    // Валидация
    if (!dialogData.messages || !Array.isArray(dialogData.messages) || dialogData.messages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Messages array is required' },
        { status: 400 }
      );
    }
    
    // Получаем дополнительную информацию
    const userAgent = request.headers.get('user-agent') || '';
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    
    // Подготавливаем данные для бэкенда
    const chatPayload = {
      timestamp: dialogData.timestamp || new Date().toISOString(),
      phone: dialogData.phone,
      name: dialogData.name,
      projectType: dialogData.projectType,
      messages: dialogData.messages.map((msg: any) => ({
        sender: msg.sender,
        text: msg.text,
        time: msg.time || new Date().toISOString(),
      })),
      metrics: dialogData.metrics || {},
      userAgent,
      ipAddress,
      language: dialogData.language || 'ru',
    };
    
    // Отправка на бэкенд
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/chats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.BACKEND_API_KEY && {
          'Authorization': `Bearer ${process.env.BACKEND_API_KEY}`,
        }),
      },
      body: JSON.stringify(chatPayload),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Backend error:', data);
      // Fallback: можно сохранить в Google Sheets как резерв
      return NextResponse.json(
        { success: false, error: data.error || 'Failed to save chat' },
        { status: response.status }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      chatId: data.chatId,
      message: 'Chat saved successfully'
    });
  } catch (error) {
    console.error('Error saving dialog:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 2. Создать API routes для админки

**`app/api/admin/chats/route.ts`** (список чатов):
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // TODO: Добавить проверку авторизации админа
    
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    const params = new URLSearchParams({
      page,
      limit,
      sortBy,
      sortOrder,
    });
    
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/chats?${params.toString()}`, {
      headers: {
        ...(process.env.BACKEND_API_KEY && {
          'Authorization': `Bearer ${process.env.BACKEND_API_KEY}`,
        }),
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || 'Failed to fetch chats' },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**`app/api/admin/chats/[id]/route.ts`** (детали чата):
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Добавить проверку авторизации админа
    
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/chats/${params.id}`, {
      headers: {
        ...(process.env.BACKEND_API_KEY && {
          'Authorization': `Bearer ${process.env.BACKEND_API_KEY}`,
        }),
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || 'Chat not found' },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching chat:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Добавить проверку авторизации админа
    
    const body = await request.json();
    
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/chats/${params.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.BACKEND_API_KEY && {
          'Authorization': `Bearer ${process.env.BACKEND_API_KEY}`,
        }),
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || 'Failed to update chat' },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating chat:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**`app/api/admin/chats/stats/route.ts`** (статистика):
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // TODO: Добавить проверку авторизации админа
    
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    
    const params = new URLSearchParams();
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);
    
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/chats/stats?${params.toString()}`, {
      headers: {
        ...(process.env.BACKEND_API_KEY && {
          'Authorization': `Bearer ${process.env.BACKEND_API_KEY}`,
        }),
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || 'Failed to fetch stats' },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 3. Обновить `.env.local`

```env
# Backend API
BACKEND_API_URL=https://your-backend-url.com
BACKEND_API_KEY=your-api-key-if-needed

# Старое (можно оставить как fallback)
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/...
```

### 4. Обновить `ChatSection.tsx` (передать language)

В функции `saveDialog` добавить передачу языка:

```typescript
const { language } = useLanguage(); // уже есть

const dialogData = {
  timestamp: new Date().toISOString(),
  phone: extractPhoneFromMessages(),
  name: extractNameFromMessages(),
  projectType: extractProjectTypeFromMessages(),
  messages: messages.map(msg => ({
    sender: msg.sender,
    text: msg.text,
    time: msg.timestamp.toISOString(),
  })),
  metrics: metricsRef.current || {},
  language: language, // добавить
};
```

---

## Порядок внедрения

1. **Бэкендер создает API** согласно `BACKEND_API_SPEC.md`
2. **Тестируем endpoints** (Postman/curl)
3. **Обновляем Next.js API routes** (примеры выше)
4. **Обновляем фронтенд** (передаем language)
5. **Создаем страницу в админке** для просмотра чатов
6. **Тестируем полный цикл**
7. **Убираем Google Sheets** (или оставляем как fallback)

---

## Пример страницы админки для чатов

**`app/admin/chats/page.tsx`** (упрощенный пример):

```typescript
'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';

interface Chat {
  id: string;
  createdAt: string;
  phone?: string;
  name?: string;
  projectType?: string;
  messageCount: number;
  status: string;
  lastMessage?: {
    text: string;
    sender: string;
    time: string;
  };
}

export default function ChatsPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('new');

  useEffect(() => {
    fetchChats();
  }, [statusFilter]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/chats?status=${statusFilter}&limit=50`);
      const { data } = await response.json();
      if (data?.chats) {
        setChats(data.chats);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Чаты</h1>
        
        {/* Фильтры */}
        <div className="mb-4 flex gap-2">
          {['new', 'contacted', 'in_progress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Список чатов */}
        {loading ? (
          <div>Загрузка...</div>
        ) : (
          <div className="space-y-4">
            {chats.map((chat) => (
              <div key={chat.id} className="border p-4 rounded">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {chat.name || 'Без имени'} {chat.phone && `(${chat.phone})`}
                    </h3>
                    <p className="text-sm text-gray-600">{chat.projectType}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(chat.createdAt).toLocaleString('ru-RU')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm bg-blue-100 px-2 py-1 rounded">
                      {chat.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {chat.messageCount} сообщений
                    </p>
                  </div>
                </div>
                {chat.lastMessage && (
                  <p className="text-sm mt-2 text-gray-700">
                    {chat.lastMessage.sender === 'user' ? '👤' : '🤖'} {chat.lastMessage.text}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
```






