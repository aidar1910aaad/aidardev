# Настройка сохранения диалогов в Google Sheets

## Шаг 1: Создайте Google Таблицу

1. Откройте [Google Sheets](https://sheets.google.com)
2. Создайте новую таблицу
3. Назовите её, например, "Диалоги чат-бота"
4. Создайте заголовки в первой строке:
   - A1: `Дата и время`
   - B1: `Номер телефона`
   - C1: `Тип проекта`
   - D1: `Краткое резюме`
   - E1: `Полный диалог`

## Шаг 2: Создайте Google Apps Script

1. В Google Таблице нажмите **Расширения** → **Apps Script**
2. Удалите весь код по умолчанию
3. Вставьте следующий код:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Проверяем, не дублируется ли запись (по номеру телефона и времени)
    const phone = data.phone || '';
    const timestamp = new Date(data.timestamp);
    const dateTime = Utilities.formatDate(timestamp, Session.getScriptTimeZone(), 'dd.MM.yyyy HH:mm:ss');
    
    // Проверяем последние 10 строк на дубликаты
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const checkRange = sheet.getRange(Math.max(2, lastRow - 9), 1, Math.min(10, lastRow - 1), 4);
      const values = checkRange.getValues();
      
      for (let i = values.length - 1; i >= 0; i--) {
        const rowPhone = values[i][1] || '';
        const rowTime = values[i][0] || '';
        // Если номер и время совпадают (в пределах 2 минут) - пропускаем
        if (rowPhone === phone && phone !== '') {
          const rowDate = new Date(rowTime);
          const timeDiff = Math.abs(timestamp - rowDate) / 1000 / 60; // разница в минутах
          if (timeDiff < 2) {
            return ContentService.createTextOutput(JSON.stringify({ success: true, skipped: true }))
              .setMimeType(ContentService.MimeType.JSON);
          }
        }
      }
    }
    
    // Извлекаем тип проекта
    const projectType = data.projectType || '';
    
    // Форматируем диалог более читабельно
    const dialogParts = [];
    let clientMessages = [];
    let botMessages = [];
    
    data.messages.forEach(msg => {
      if (msg.sender === 'user') {
        clientMessages.push(msg.text);
      } else {
        botMessages.push(msg.text);
      }
    });
    
    // Создаем краткое резюме
    const summary = clientMessages.length > 0 
      ? clientMessages.join(' | ') 
      : 'Диалог без ответов клиента';
    
    // Полный диалог в компактном формате
    const fullDialog = data.messages.map((msg, index) => {
      const sender = msg.sender === 'user' ? '👤 Клиент' : '🤖 Бот';
      const time = new Date(msg.time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
      return `${index + 1}. [${time}] ${sender}\n   ${msg.text}`;
    }).join('\n\n');
    
    // Добавляем строку в таблицу
    sheet.appendRow([
      dateTime,
      phone || 'Не указан',
      projectType || 'Не указан',
      summary,
      fullDialog
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.toString() 
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Нажмите **Сохранить** (Ctrl+S)
5. Дайте проекту имя, например "ChatBot Logger"

## Шаг 3: Разверните как веб-приложение

1. Нажмите **Развернуть** → **Новое развертывание**
2. Выберите тип: **Веб-приложение**
3. Настройки:
   - **Описание**: "ChatBot Logger"
   - **Запускать от имени**: "Меня"
   - **У кого есть доступ**: "Все"
4. Нажмите **Развернуть**
5. Скопируйте **URL веб-приложения** (это ваш API endpoint)

## Шаг 4: Добавьте URL в .env.local

1. Откройте файл `.env.local` в корне проекта
2. Добавьте строку:
   ```
   GOOGLE_APPS_SCRIPT_URL=ваш_url_здесь
   ```
3. Замените `ваш_url_здесь` на URL из шага 3
4. Перезапустите сервер разработки

## Готово!

Теперь все диалоги будут автоматически сохраняться в Google Таблицу:
- При каждом обмене сообщениями
- При закрытии чата
- При получении номера телефона

## Формат данных в таблице

- **Дата и время**: Когда произошел диалог
- **Номер телефона**: Если клиент оставил номер (или "Не указан")
- **Тип проекта**: Автоматически определяется из диалога (или "Не указан")
- **Краткое резюме**: Все сообщения клиента в одной строке
- **Полный диалог**: Все сообщения с нумерацией и временными метками

## Защита от дубликатов

Скрипт автоматически проверяет дубликаты:
- Если номер телефона совпадает с недавней записью (в пределах 2 минут) - запись пропускается
- Это предотвращает множественные сохранения одного диалога

## Безопасность

⚠️ **Важно**: 
- Не делитесь URL веб-приложения публично
- Храните его только в `.env.local` (который в `.gitignore`)
- Регулярно проверяйте доступ к таблице

