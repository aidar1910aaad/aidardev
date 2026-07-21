# Техническое задание: API для хранения и просмотра чатов

## Обзор

Необходимо создать REST API для хранения всех чатов с AI-ботом в базе данных Neon (PostgreSQL) и предоставления доступа к ним через админ-панель.

**Важно:** Отдельный сервер НЕ нужен. API будет использоваться из Next.js API routes (`app/api/*/route.ts`).

---

## 1. Структура базы данных

### Таблица: `chats`

```sql
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Извлеченные данные из диалога
  phone VARCHAR(20),
  name VARCHAR(100),
  project_type VARCHAR(100),
  
  -- Метрики диалога
  message_count INTEGER DEFAULT 0,
  has_price_objection BOOLEAN DEFAULT FALSE,
  has_negative_response BOOLEAN DEFAULT FALSE,
  has_name BOOLEAN DEFAULT FALSE,
  asked_for_contact BOOLEAN DEFAULT FALSE,
  has_uncertainty BOOLEAN DEFAULT FALSE,
  uncertainty_count INTEGER DEFAULT 0,
  
  -- Статус обработки (для админки)
  status VARCHAR(20) DEFAULT 'new', -- 'new', 'contacted', 'in_progress', 'completed', 'archived'
  notes TEXT, -- Заметки админа
  
  -- Дополнительная информация
  user_agent TEXT,
  ip_address VARCHAR(45),
  language VARCHAR(10) DEFAULT 'ru' -- 'ru', 'en', 'kz'
);
```

### Таблица: `chat_messages`

```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender VARCHAR(10) NOT NULL CHECK (sender IN ('bot', 'user')),
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Индекс для быстрого поиска
  INDEX idx_chat_messages_chat_id (chat_id),
  INDEX idx_chat_messages_created_at (created_at)
);
```

### Индексы для оптимизации

```sql
CREATE INDEX idx_chats_created_at ON chats(created_at DESC);
CREATE INDEX idx_chats_status ON chats(status);
CREATE INDEX idx_chats_phone ON chats(phone) WHERE phone IS NOT NULL;
CREATE INDEX idx_chats_project_type ON chats(project_type) WHERE project_type IS NOT NULL;
```

---

## 2. API Endpoints

### Базовый URL
```
https://your-backend-url.com/api
```

Или если используете Next.js API routes:
```
/api/chats
```

---

### 2.1. Сохранение чата

**POST** `/api/chats`

**Описание:** Сохраняет новый чат со всеми сообщениями.

**Request Body:**
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "phone": "77066703696",
  "name": "Иван",
  "projectType": "Лендинг",
  "messages": [
    {
      "sender": "bot",
      "text": "Привет! Я помогу рассчитать стоимость вашего проекта.",
      "time": "2024-01-15T10:30:00.000Z"
    },
    {
      "sender": "user",
      "text": "Нужен лендинг",
      "time": "2024-01-15T10:30:15.000Z"
    },
    {
      "sender": "bot",
      "text": "Отлично! Лендинг — отличный выбор...",
      "time": "2024-01-15T10:30:20.000Z"
    }
  ],
  "metrics": {
    "messageCount": 6,
    "hasPriceObjection": false,
    "hasNegativeResponse": false,
    "hasName": true,
    "askedForContact": true,
    "hasUncertainty": false,
    "uncertaintyCount": 0
  },
  "userAgent": "Mozilla/5.0...",
  "ipAddress": "192.168.1.1",
  "language": "ru"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "chatId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Chat saved successfully"
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Validation error",
  "details": "messages array is required"
}
```

**Response (500 Internal Server Error):**
```json
{
  "success": false,
 error": "Internal server error"
}
```

**Валидация:**
- `messages` - обязательное поле, массив, минимум 1 элемент
- `timestamp` - обязательное поле, валидная ISO дата
- `sender` в сообщениях должен быть 'bot' или 'user'
- `text` в сообщениях не должен быть пустым

---

### 2.2. Получение списка чатов (для админки)

**GET** `/api/chats`

**Описание:** Возвращает список всех чатов с пагинацией и фильтрацией.

**Query Parameters:**
- `page` (number, default: 1) - номер страницы
- `limit` (number, default: 20) - количество на странице (макс 100)
- `status` (string, optional) - фильтр по статусу: 'new', 'contacted', 'in_progress', 'completed', 'archived'
- `search` (string, optional) - поиск по имени, телефону, типу проекта
- `sortBy` (string, default: 'created_at') - сортировка: 'created_at', 'updated_at', 'message_count'
- `sortOrder` (string, default: 'desc') - порядок: 'asc', 'desc'
- `dateFrom` (string, optional) - фильтр с даты (ISO format)
- `dateTo` (string, optional) - фильтр до даты (ISO format)

**Пример запроса:**
```
GET /api/chats?page=1&limit=20&status=new&search=Иван&sortBy=created_at&sortOrder=desc
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "chats": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:35:00.000Z",
        "phone": "77066703696",
        "name": "Иван",
        "projectType": "Лендинг",
        "messageCount": 6,
        "status": "new",
        "hasPriceObjection": false,
        "hasNegativeResponse": false,
        "hasName": true,
        "askedForContact": true,
        "language": "ru",
        "lastMessage": {
          "text": "Мой номер +7 706 670 36 96",
          "sender": "user",
          "time": "2024-01-15T10:35:00.000Z"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Invalid query parameters"
}
```

---

### 2.3. Получение деталей чата

**GET** `/api/chats/:chatId`

**Описание:** Возвращает полную информацию о чате со всеми сообщениями.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z",
    "phone": "77066703696",
    "name": "Иван",
    "projectType": "Лендинг",
    "status": "new",
    "notes": null,
    "metrics": {
      "messageCount": 6,
      "hasPriceObjection": false,
      "hasNegativeResponse": false,
      "hasName": true,
      "askedForContact": true,
      "hasUncertainty": false,
      "uncertaintyCount": 0
    },
    "language": "ru",
    "messages": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "sender": "bot",
        "text": "Привет! Я помогу рассчитать стоимость вашего проекта.",
        "createdAt": "2024-01-15T10:30:00.000Z"
      },
      {
        "id": "660e8400-e29b-41d4-a716-446655440002",
        "sender": "user",
        "text": "Нужен лендинг",
        "createdAt": "2024-01-15T10:30:15.000Z"
      },
      {
        "id": "660e8400-e29b-41d4-a716-446655440003",
        "sender": "bot",
        "text": "Отлично! Лендинг — отличный выбор...",
        "createdAt": "2024-01-15T10:30:20.000Z"
      }
    ]
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Chat not found"
}
```

---

### 2.4. Обновление статуса чата

**PATCH** `/api/chats/:chatId`

**Описание:** Обновляет статус чата и заметки (для админки).

**Request Body:**
```json
{
  "status": "contacted",
  "notes": "Связался по телефону, договорились о встрече"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Chat updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "contacted",
    "notes": "Связался по телефону, договорились о встрече",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Валидация:**
- `status` должен быть одним из: 'new', 'contacted', 'in_progress', 'completed', 'archived'
- `notes` - опциональное поле, строка до 5000 символов

---

### 2.5. Статистика чатов

**GET** `/api/chats/stats`

**Описание:** Возвращает общую статистику по чатам (для дашборда админки).

**Query Parameters:**
- `dateFrom` (string, optional) - период с даты (ISO format)
- `dateTo` (string, optional) - период до даты (ISO format)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "byStatus": {
      "new": 45,
      "contacted": 30,
      "in_progress": 20,
      "completed": 40,
      "archived": 15
    },
    "byProjectType": {
      "Лендинг": 50,
      "Интернет-магазин": 30,
      "Telegram-бот": 25,
      "Мобильное приложение": 20,
      "Другое": 25
    },
    "withContact": {
      "withPhone": 120,
      "withName": 100,
      "withBoth": 95
    },
    "metrics": {
      "avgMessageCount": 8.5,
      "priceObjections": 15,
      "negativeResponses": 5
    },
    "recentActivity": {
      "last24h": 12,
      "last7days": 45,
      "last30days": 120
    }
  }
}
```

---

### 2.6. Удаление чата (опционально)

**DELETE** `/api/chats/:chatId`

**Описание:** Удаляет чат и все его сообщения (только для админки, с авторизацией).

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Chat deleted successfully"
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Chat not found"
}
```

---

## 3. Обработка ошибок

Все ошибки должны возвращаться в едином формате:

```json
{
  "success": false,
  "error": "Error message",
  "details": "Optional detailed error information"
}
```

**HTTP Status Codes:**
- `200` - Успешный запрос
- `201` - Ресурс создан
- `400` - Ошибка валидации
- `404` - Ресурс не найден
- `500` - Внутренняя ошибка сервера

---

## 4. Интеграция с Next.js

### Пример использования в Next.js API route:

**`app/api/chats/route.ts`** (для сохранения):
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const chatData = await request.json();
    
    // Валидация
    if (!chatData.messages || !Array.isArray(chatData.messages) || chatData.messages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Messages array is required' },
        { status: 400 }
      );
    }
    
    // Отправка на ваш бэкенд
    const response = await fetch(`${process.env.BACKEND_API_URL}/api/chats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BACKEND_API_KEY}`, // если нужна авторизация
      },
      body: JSON.stringify(chatData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || 'Failed to save chat' },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error saving chat:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**`app/api/chats/[id]/route.ts`** (для получения деталей):
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${process.env.BACKEND_API_URL}/api/chats/${params.id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.BACKEND_API_KEY}`,
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
```

---

## 5. Переменные окружения

Добавьте в `.env.local`:
```env
BACKEND_API_URL=https://your-backend-url.com
BACKEND_API_KEY=your-api-key-if-needed
DATABASE_URL=postgresql://user:password@host:port/database
```

---

## 6. Безопасность

1. **Авторизация для админки:**
   - Все GET/PATCH/DELETE запросы должны требовать авторизацию
   - POST для сохранения чатов может быть публичным (но можно добавить rate limiting)

2. **Валидация данных:**
   - Проверка всех входящих данных
   - Санитизация текста сообщений
   - Валидация телефонов и email

3. **Rate Limiting:**
   - Ограничение количества запросов на сохранение чатов (например, 10 в минуту с одного IP)

4. **CORS:**
   - Настроить CORS для разрешенных доменов

---

## 7. Дополнительные требования

1. **Логирование:**
   - Логировать все операции с чатами
   - Логировать ошибки с деталями

2. **Производительность:**
   - Использовать индексы для быстрого поиска
   - Кэшировать статистику (обновлять раз в минуту)

3. **Резервное копирование:**
   - Регулярные бэкапы БД
   - Хранение бэкапов минимум 30 дней

---

## 8. Примеры использования в админке

### Получение списка новых чатов:
```typescript
const response = await fetch('/api/chats?status=new&limit=10&sortBy=created_at&sortOrder=desc');
const { data } = await response.json();
```

### Обновление статуса:
```typescript
await fetch(`/api/chats/${chatId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'contacted', notes: 'Связался' }),
});
```

### Получение статистики:
```typescript
const response = await fetch('/api/chats/stats?dateFrom=2024-01-01&dateTo=2024-01-31');
const { data } = await response.json();
```

---

## 9. Чеклист для бэкендера

- [ ] Создать таблицы в БД Neon
- [ ] Реализовать POST `/api/chats` (сохранение)
- [ ] Реализовать GET `/api/chats` (список с фильтрами)
- [ ] Реализовать GET `/api/chats/:id` (детали)
- [ ] Реализовать PATCH `/api/chats/:id` (обновление статуса)
- [ ] Реализовать GET `/api/chats/stats` (статистика)
- [ ] Добавить валидацию всех запросов
- [ ] Настроить авторизацию для админки
- [ ] Добавить rate limiting
- [ ] Настроить CORS
- [ ] Добавить логирование
- [ ] Протестировать все endpoints
- [ ] Настроить бэкапы БД

---

## 10. Маркетинг-план: прогресс задач

> **Фронт:** `app/api/admin/marketing-plan` — парсит `docs/MARKETING_ACTION_PLAN.md`, прогресс хранит на бэкенде.  
> **Логика:** `app/lib/marketing-plan-storage.ts` (как чаты — прокси на `BACKEND_API_URL`).

### Таблица: `marketing_plan_progress`

```sql
CREATE TABLE marketing_plan_progress (
  id VARCHAR(64) PRIMARY KEY DEFAULT 'default',
  progress JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- progress: { "abc123taskid": true, "def456taskid": false, ... }
-- id всегда 'default' (один пользователь / один аккаунт)
```

### GET `/api/marketing-plan/progress`

**Response:**
```json
{
  "success": true,
  "progress": {
    "a1b2c3d4e5f6g7h8": true,
    "b2c3d4e5f6g7h8i9": false
  }
}
```

### POST `/api/marketing-plan/progress`

**Вариант A — одна задача:**
```json
{
  "taskId": "a1b2c3d4e5f6g7h8",
  "checked": true
}
```

**Вариант B — весь объект:**
```json
{
  "progress": { "a1b2c3d4e5f6g7h8": true }
}
```

**Response:**
```json
{
  "success": true,
  "progress": { ... }
}
```

### DELETE `/api/marketing-plan/progress`

Сброс всех отметок → `{}`.

**Response:**
```json
{
  "success": true,
  "progress": {}
}
```

> **Dev fallback:** если бэкенд недоступен, фронт пишет в `app/data/marketing-plan-progress.json` (только локально). На Vercel нужен рабочий бэкенд.

---

## 11. Контакты для вопросов

Если у бэкендера возникнут вопросы по спецификации, он может обратиться к этому документу или уточнить детали у фронтенд-разработчика.






