# Исправление сортировки для бэкенда API чатов

## Проблема

Фронтенд отправляет параметры сортировки, но бэкенд принимает только ограниченный набор значений:
- `created_at`
- `updated_at`
- `message_count`

Ошибка: `['sortBy must be one of the following values: created_at, updated_at, message_count']`

## Текущие запросы от фронтенда

Фронтенд отправляет следующие значения `sortBy`:
- `created_at` (для `createdAt`) ✅
- `name` ❌ (не поддерживается)
- `phone` ❌ (не поддерживается)
- `message_count` (для `messageCount`) ✅
- `status` ❌ (не поддерживается)

## Что нужно исправить в бэкенде

### 1. Добавить поддержку новых полей для сортировки

В валидации параметра `sortBy` нужно добавить следующие значения:

```javascript
// Пример для Express.js с валидацией (например, express-validator)
const allowedSortFields = [
  'created_at',
  'updated_at',
  'message_count',
  'name',        // ← ДОБАВИТЬ
  'phone',       // ← ДОБАВИТЬ
  'status'       // ← ДОБАВИТЬ
];
```

### 2. Обновить SQL запрос для сортировки

В SQL запросе нужно правильно маппить поля:

```sql
-- Пример SQL запроса
SELECT * FROM chats
ORDER BY 
  CASE 
    WHEN :sortBy = 'created_at' THEN created_at
    WHEN :sortBy = 'updated_at' THEN updated_at
    WHEN :sortBy = 'message_count' THEN message_count
    WHEN :sortBy = 'name' THEN name          -- ← ДОБАВИТЬ
    WHEN :sortBy = 'phone' THEN phone        -- ← ДОБАВИТЬ
    WHEN :sortBy = 'status' THEN status      -- ← ДОБАВИТЬ
    ELSE created_at
  END
  :sortOrder  -- ASC или DESC
```

### 3. Для ORM (например, Sequelize, TypeORM, Prisma)

#### Sequelize пример:
```javascript
const sortFieldMap = {
  'created_at': 'createdAt',
  'updated_at': 'updatedAt',
  'message_count': 'messageCount',
  'name': 'name',
  'phone': 'phone',
  'status': 'status'
};

const orderField = sortFieldMap[sortBy] || 'createdAt';
const orderDirection = sortOrder === 'asc' ? 'ASC' : 'DESC';

Chat.findAll({
  order: [[orderField, orderDirection]],
  // ... другие параметры
});
```

#### Prisma пример:
```javascript
const sortFieldMap = {
  'created_at': 'createdAt',
  'updated_at': 'updatedAt',
  'message_count': 'messageCount',
  'name': 'name',
  'phone': 'phone',
  'status': 'status'
};

const orderField = sortFieldMap[sortBy] || 'createdAt';
const orderDirection = sortOrder === 'asc' ? 'asc' : 'desc';

prisma.chat.findMany({
  orderBy: {
    [orderField]: orderDirection
  },
  // ... другие параметры
});
```

### 4. Проверка структуры таблицы

Убедитесь, что в таблице `chats` есть следующие колонки:
- `name` (VARCHAR/TEXT) - имя пользователя
- `phone` (VARCHAR) - телефон пользователя
- `status` (VARCHAR/ENUM) - статус чата
- `created_at` (TIMESTAMP/DATETIME) - дата создания
- `updated_at` (TIMESTAMP/DATETIME) - дата обновления
- `message_count` (INTEGER) - количество сообщений

### 5. Обработка NULL значений

При сортировке по `name` или `phone` могут быть NULL значения. Нужно решить, как их обрабатывать:

```sql
-- Вариант 1: NULL значения в конце
ORDER BY 
  CASE WHEN name IS NULL THEN 1 ELSE 0 END,
  name ASC

-- Вариант 2: NULL значения в начале
ORDER BY 
  CASE WHEN name IS NULL THEN 0 ELSE 1 END,
  name ASC
```

### 6. Полный пример endpoint (Express.js)

```javascript
// GET /api/chats
app.get('/api/chats', async (req, res) => {
  const {
    page = 1,
    limit = 20,
    sortBy = 'created_at',
    sortOrder = 'desc',
    status,
    search,
    hasPhone,
    hasName
  } = req.query;

  // Валидация sortBy
  const allowedSortFields = [
    'created_at',
    'updated_at',
    'message_count',
    'name',
    'phone',
    'status'
  ];

  if (!allowedSortFields.includes(sortBy)) {
    return res.status(400).json({
      success: false,
      message: `sortBy must be one of the following values: ${allowedSortFields.join(', ')}`
    });
  }

  // Маппинг полей для ORM
  const sortFieldMap = {
    'created_at': 'createdAt',
    'updated_at': 'updatedAt',
    'message_count': 'messageCount',
    'name': 'name',
    'phone': 'phone',
    'status': 'status'
  };

  const orderField = sortFieldMap[sortBy];
  const orderDirection = sortOrder === 'asc' ? 'ASC' : 'DESC';

  // Построение запроса
  const where = {};
  
  if (status) where.status = status;
  if (hasPhone === 'true') where.phone = { [Op.ne]: null };
  if (hasName === 'true') where.name = { [Op.ne]: null };
  
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { phone: { [Op.like]: `%${search}%` } },
      { projectType: { [Op.like]: `%${search}%` } }
    ];
  }

  const offset = (page - 1) * limit;

  try {
    const { count, rows: chats } = await Chat.findAndCountAll({
      where,
      order: [[orderField, orderDirection]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        chats,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages
        }
      }
    });
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});
```

## Резюме изменений

1. ✅ Добавить `name`, `phone`, `status` в список разрешенных значений для `sortBy`
2. ✅ Обновить SQL/ORM запросы для поддержки сортировки по этим полям
3. ✅ Убедиться, что все поля существуют в таблице БД
4. ✅ Обработать NULL значения при сортировке
5. ✅ Обновить валидацию параметров запроса

## Тестирование

После внесения изменений проверьте:

1. Сортировка по имени: `?sortBy=name&sortOrder=asc`
2. Сортировка по телефону: `?sortBy=phone&sortOrder=desc`
3. Сортировка по статусу: `?sortBy=status&sortOrder=asc`
4. Комбинация с фильтрами: `?sortBy=name&status=new&hasPhone=true`






