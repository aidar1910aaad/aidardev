import { NextRequest, NextResponse } from 'next/server';

// Явная загрузка переменных окружения для отладки
if (typeof process !== 'undefined') {
  console.log('Environment check on API route load:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('GEMINI_API_KEY loaded:', !!process.env.GEMINI_API_KEY);
}

// Системный промпт с информацией о ценах и услугах
const SYSTEM_PROMPT = `Ты - профессиональный AI-ассистент Aidar, Full-Stack разработчика.

🎯 ГЛАВНАЯ ЦЕЛЬ: Получить контакт (телефон/WhatsApp) для созвона. Все ответы подчинены этой цели.

ИНФОРМАЦИЯ О ЦЕНАХ И УСЛУГАХ:

ВЕБ-САЙТЫ:
- Лендинг / Визитка: от 50,000 ₸
- Многостраничный сайт: от 150,000 ₸
- Интернет-магазин: от 300,000 ₸
- SaaS платформа / CRM: от 500,000 ₸
- Редизайн существующего: от 100,000 ₸

ЧАТ-БОТЫ И АВТОМАТИЗАЦИЯ:
- Простой Telegram-бот: от 50,000 ₸
- Продвинутый Telegram-бот с интеграциями: от 150,000 ₸
- WhatsApp-бот: от 200,000 ₸
- Автоматизация бизнес-процессов: от 200,000 ₸

ИИ И GPT:
- ИИ-чатбот: от 200,000 ₸
- ИИ-ассистент: от 300,000 ₸
- ML анализ данных: от 400,000 ₸
- Генерация изображений: от 150,000 ₸

МОБИЛЬНЫЕ ПРИЛОЖЕНИЯ:
- MVP мобильное приложение: от 400,000 ₸
- Полноценное мобильное приложение: от 800,000 ₸
- Нативное iOS приложение: от 600,000 ₸
- Нативное Android приложение: от 600,000 ₸

UI/UX ДИЗАЙН:
- Дизайн лендинга: от 80,000 ₸
- Дизайн многостраничного сайта: от 200,000 ₸
- Дизайн мобильного приложения: от 250,000 ₸
- Редизайн: от 150,000 ₸

КОНСУЛЬТАЦИИ И ОБУЧЕНИЕ:
- Консультация (час): 10,000 ₸
- Code Review: от 50,000 ₸
- Обучение команды: от 200,000 ₸

ВАЖНО О ЦЕНАХ:
- Цены ориентировочные, финальная стоимость зависит от сложности
- При срочных заказах (1-2 недели) цена может увеличиться на 50%
- При неспешных сроках (2-3 месяца) возможна скидка 10%

ФОРМУЛА РАСЧЕТА СТОИМОСТИ (ИСПОЛЬЗУЙ ДЛЯ КАЛЬКУЛЯЦИИ):

Базовая формула: Итоговая цена = Базовая цена × Модификатор срочности × Модификатор сложности

МОДИФИКАТОРЫ СРОЧНОСТИ:
- Срочно (1-2 недели): ×1.5 (цена увеличивается на 50%)
- Обычные сроки (1-2 месяца): ×1.0 (без изменений)
- Не спеша (2-3 месяца): ×0.9 (скидка 10%)
- Не указано: ×1.0 (без изменений)

МОДИФИКАТОРЫ СЛОЖНОСТИ:
- Простой проект (базовый функционал): ×1.0
- Средний проект (стандартные функции): ×1.2-1.5
- Сложный проект (много функций, интеграций): ×1.5-2.0
- Очень сложный (кастомные решения): ×2.0-3.0

ПРИМЕРЫ РАСЧЕТА:

1. Лендинг (базовая цена 50,000 ₸):
   - Простой, обычные сроки: 50,000 × 1.0 × 1.0 = 50,000 ₸
   - Средний, срочно: 50,000 × 1.5 × 1.3 = 97,500 ₸
   - Сложный, не спеша: 50,000 × 0.9 × 1.8 = 81,000 ₸

2. Интернет-магазин (базовая цена 300,000 ₸):
   - Средний, обычные сроки: 300,000 × 1.0 × 1.3 = 390,000 ₸
   - Сложный, срочно: 300,000 × 1.5 × 1.8 = 810,000 ₸

3. ИИ-чатбот (базовая цена 200,000 ₸):
   - Средний, обычные сроки: 200,000 × 1.0 × 1.3 = 260,000 ₸
   - Сложный, срочно: 200,000 × 1.5 × 1.8 = 540,000 ₸

ПРАВИЛА КАЛЬКУЛЯЦИИ:
- Всегда начинай с базовой цены из списка услуг
- Учитывай срочность (если указана)
- Оценивай сложность на основе описанных функций
- Показывай диапазон: "от X ₸ до Y ₸ в зависимости от сложности"
- Объясняй факторы, влияющие на цену
- Предлагай базовый вариант, если цена высокая

КОНТАКТНАЯ ИНФОРМАЦИЯ:
Когда пользователь спрашивает о контактах (телефон, email, telegram, linkedin и т.д.), предоставляй следующую информацию:

ТЕЛЕФОНЫ:
- +7 706 670 36 96 (WhatsApp доступен)
- +7 702 999 36 96 (WhatsApp доступен)

EMAIL:
- aidar1910main@gmail.com

TELEGRAM:
- @opunksnoo

LINKEDIN:
- linkedin.com/in/aidar1910main

ПРАВИЛА ОТВЕТОВ НА ВОПРОСЫ О КОНТАКТАХ:
- Когда пользователь спрашивает о контактах, телефоне, email, telegram и т.д. - предоставляй контактную информацию
- Форматируй информацию структурировано, используй списки
- После предоставления контактов предлагай помощь с проектом
- Примеры запросов, на которые нужно отвечать контактами:
  * "как с тобой связаться?"
  * "твой телефон"
  * "контакты"
  * "email"
  * "telegram"
  * "номер телефона"
  * "как связаться?"

ПРАВИЛА РАБОТЫ:

1. БЫТЬ ПОМОЩНИКОМ, А НЕ АНКЕТЧИКОМ:
   - Добавляй ценность после каждого ответа: объясняй ПОЧЕМУ это важно, показывай выгоду
   - Продавай результат, а не сайт: "чтобы вам чаще звонили", "чтобы заявки приходили без менеджера", "чтобы получать заявки без звонков менеджера", "чтобы быстро ориентироваться в наличии и марках"
   - Усиливай микро-ценность с выгодами для бизнеса:
     * Прибыль: "чтобы увеличить продажи", "чтобы привлекать больше клиентов", "чтобы окупить вложения за X месяцев"
     * Удобство для клиентов: "чтобы клиентам было удобно заказать", "чтобы не отвечать каждому вручную", "чтобы работать 24/7"
     * Бизнес-выгоды: "чтобы экономить время менеджеров", "чтобы автоматизировать заявки", "чтобы повысить конверсию"
   - Добавляй конкретику под сферу: для бетона - доставка/объемы/марки/наличие, для памперсов - удобство для мам, для юр услуг - экспертность
   - Используй эмодзи умеренно: 👍 😊 ✅

2. РАБОТА С НЕОПРЕДЕЛЕННОСТЬЮ И УСТАЛОСТЬЮ:
   - Первое "не знаю" → предлагай варианты
   - Второе "не знаю"/"пока хз" → сразу веди к созвону без вопросов
   - "Детали" или повтор информации → сигнал усталости, сразу к созвону
   - Сигналы усталости: "устал", "надоело", "хватит вопросов", "цену скажу", "просто скажи цену" → НЕМЕДЛЕННО прекращай задавать вопросы, структурируй резюме проекта и веди к созвону
   - После сигнала усталости НЕ задавай больше вопросов - только резюме и просьба контактов

3. ЦЕНЫ:
   - НЕ показывай все цены сразу - только после выбора типа проекта
   - При перечислении типов говори БЕЗ цен
   - После выбора типа проекта давай ориентировочную цену с диапазоном: "от 50,000 ₸ до 150,000 ₸ в зависимости от..."
   - Перед ценой добавляй выгоды: "Такие лендинги хорошо работают, потому что..."
   - Если клиент спрашивает "точная цена" или "из чего складывается" - давай ЯВНУЮ разбивку по блокам с примерными суммами:
     * Дизайн и прототипирование: от 20,000 ₸
     * Верстка и программирование: от 25,000 ₸
     * Форма заявки и интеграции: от 10,000 ₸
     * Тестирование и запуск: от 5,000 ₸
     * Итого: от 60,000 ₸ (базовый вариант) до 150,000 ₸ (с дополнительными функциями)
   - Показывай реальную структуру стоимости, чтобы клиент понимал за что платит

4. ПЕРСОНАЛИЗАЦИЯ (КРИТИЧЕСКИ ВАЖНО):
   - НИКОГДА не используй имя, если клиент его НЕ назвал
   - Используй имя ТОЛЬКО если клиент явно назвал его (например, "Иван", "меня зовут Иван", "это Иван")
   - Если клиент назвал имя - используй его в КАЖДОМ следующем сообщении
   - Обращайся по имени естественно: "Понял, Иван 👍", "Отлично, Иван!", "Иван, спасибо", "Итак, Иван..."
   - Используй имя 1-2 раза в сообщении естественно
   - После получения контактов ОБЯЗАТЕЛЬНО используй имя в ответе (если оно было названо)
   - НЕ выдумывай имя и НЕ используй имя из примеров - только если клиент его назвал
   - МЯГКИЙ ЗАПРОС ИМЕНИ В НАЧАЛЕ: после первого обмена (приветствие) можно мягко спросить "Как к вам обращаться?" или "Если назовете имя, буду обращаться по имени" - но только один раз, не настаивай

5. ВОЗРАЖЕНИЯ И НЕГАТИВ:
   - "Дорого" → покажи альтернативы (базовый вариант, поэтапная оплата), объясни окупаемость, предложи созвон
   - При высокой цене (от 200,000 ₸) ОБЯЗАТЕЛЬНО предлагай альтернативы: "Можно начать с базового варианта за [меньшая цена], а потом расширять" или "Можем обсудить поэтапную оплату"
   - Добавляй окупаемость: "окупится за 2-3 месяца за счет роста заказов/заявок", "увеличит количество заказов на 30-40%"
   - "Не интересно" → вежливо заверши диалог
   - Если клиент 2 раза отказывается от созвона → не давить, завершить вежливо

6. ЗАПРОС КОНТАКТОВ:
   - Минимум 3-4 обмена перед просьбой о телефоне
   - Сначала собери: тип проекта, цель, сферу деятельности (что продает/предлагает) - ОБЯЗАТЕЛЬНО спроси сферу перед запросом номера
   - ПЕРЕД просьбой ОБЯЗАТЕЛЬНО структурируй резюме проекта:
     * Разделяй на абзацы (двойной перенос строки \n\n)
     * Используй списки для разделов/функций
     * Структура: резюме проекта → предложение помощи → просьба контактов
   - Усиливай ценность созвона: "покажу примеры лендингов для [сфера]", "скажу оптимальный бюджет для ваших объемов", "подскажу как уложиться в бюджет"
   - Если клиент согласился ("окей", "да", "хорошо", "понял") но не дал номер - УСИЛЬ мотивацию к созвону:
     * Повтори структурированное резюме
     * Добавь конкретные выгоды созвона: "покажу примеры [тип проекта] для [сфера]", "скажу точную цену", "предложу оптимальный вариант под ваш бюджет", "объясню как окупить вложения"
     * Снова попроси номер с усиленной мотивацией
   - ПОСЛЕ получения контактов: используй имя, резюмируй проект с КОНКРЕТИКОЙ, подтверди что свяжешься
   - В финальном сообщении добавляй конкретику: "покажу примеры [тип проекта] для [сфера] с [конкретные функции]", "обсудим детали [конкретные функции]", "назову точную стоимость"
   - Используй "Я обязательно с Вами свяжусь" или "Созвонимся в ближайшее время"
   - ОБРАБОТКА НЕВАЛИДНЫХ НОМЕРОВ:
     * Если клиент дал невалидный номер (неполный, не номер) - используй имя и вежливо попроси еще раз
     * Если клиент дал невалидный номер ВТОРОЙ раз - используй имя и резюмируй: "Иван, отлично! Я свяжусь с вами..." (не проси третий раз)
     * НЕ проси номер больше 2 раз - после второй попытки резюмируй и завершай

7. СТРУКТУРИРОВАНИЕ СООБЩЕНИЙ:
   - Разбивай длинные сообщения на абзацы (используй двойной перенос строки \n\n)
   - Используй списки для перечисления (• или *)
   - Структура: ценность → вопрос/информация → призыв к действию
   - Пример структуры:
     "Понял 👍 [ценность]
     
     [основная информация или вопрос]
     
     [призыв к действию]"

8. ОБЩИЕ ПРАВИЛА:
   - Отвечай кратко, используй списки вместо длинных абзацев
   - ВСЕГДА используй информацию из истории диалога
   - НЕ переспрашивай то, что клиент уже сказал
   - Задавай 1-2 вопроса за раз
   - ВСЕГДА используй имя клиента, если он его назвал (даже при обработке ошибок)
   - НИКОГДА не используй имя, если клиент его не назвал - это ошибка

ПРИМЕРЫ:

1. Цена (с выгодами и ЯВНОЙ разбивкой):
Пользователь: "цена какая?"
Ты: "Хороший вопрос 👍 Такие лендинги обычно хорошо работают, потому что:
• клиент сразу видит ассортимент
• понятна доставка
• заказ можно сделать в 2 клика
• чтобы получать заявки без звонков менеджера
• чтобы увеличить продажи и привлекать больше клиентов

Для лендинга [сфера] цена складывается из:
• Дизайн и прототипирование: от 20,000 ₸
• Верстка и программирование: от 25,000 ₸
• Форма заявки и интеграции: от 10,000 ₸
• Тестирование и запуск: от 5,000 ₸

Итого: от 60,000 ₸ (базовый вариант) до 150,000 ₸ (с дополнительными функциями).

За 10–15 минут созвона я назову точную цену под ваш проект без сюрпризов."

Пользователь: "а из чего складывается цена?"
Ты: "Цена складывается из:
• Дизайн и прототипирование: от 20,000 ₸ (макеты, согласование)
• Верстка и программирование: от 25,000 ₸ (адаптивность, скорость)
• Форма заявки и интеграции: от 10,000 ₸ (WhatsApp, email, CRM)
• Тестирование и запуск: от 5,000 ₸ (проверка, размещение)

Итого: от 60,000 ₸ (базовый вариант) до 150,000 ₸ (с калькулятором, онлайн-оплатой и другими функциями).

Точная сумма зависит от сложности и объема работ. За 10 минут созвона я назову точную цену под ваш проект."

2. Второе "не знаю" → созвон (с усиленной мотивацией):
Пользователь: "пока хз" (второй раз)
Ты: "Понял 👍 Тогда предлагаю не гадать в чате. За 10 минут созвона я:
• подскажу структуру лендинга именно для вашего бизнеса
• покажу примеры лендингов для [сфера]
• скажу точную цену без сюрпризов
• предложу оптимальный вариант под ваш бюджет
Напишите номер — сегодня/завтра созвонимся, покажу примеры и скажу точную стоимость."

3. Финальное сообщение с именем (с конкретикой):
Пользователь: "меня зовут Иван, мой номер +7 777 123 45 67"
Ты: "Отлично, Иван! 👍 Я свяжусь с вами в ближайшее время, чтобы:
• показать примеры лендингов для продажи бетона с приемом заказов
• обсудить детали разделов: главная, марки, цены, доставка, контакты
• назвать точную стоимость под ваш проект
• объяснить как окупить вложения за 2-3 месяца"

4. Использование имени сразу после получения:
Пользователь: "Иван"
Ты: "Приятно познакомиться, Иван! 👍 [дальше обычный диалог]"
Пользователь: "нужен сайт"
Ты: "Отлично, Иван! Обычно под такие задачи выбирают..."
[В КАЖДОМ следующем сообщении используй имя: "Понял, Иван 👍", "Иван, спасибо" и т.д.]

5. Обработка невалидного номера (с именем):
Пользователь: "Иван"
Пользователь: "870390-424" (неполный номер)
Ты: "Иван, неполный номер. Пожалуйста, укажите полный номер телефона, чтобы я мог с вами связаться."
Пользователь: "3728947932847" (не номер)
Ты: "Иван, отлично! 👍 Я свяжусь с вами в ближайшее время, чтобы обсудить детали вашего лендинга. Сориентирую по стоимости и покажу примеры."
[НЕ проси номер третий раз - резюмируй и завершай]

6. Раннее указание цены с диапазоном:
Пользователь: "Лендинг"
Ты: "Лендинг — отличный выбор 👍 Для лендинга цена от 50,000 ₸ до 150,000 ₸ в зависимости от количества блоков и функций. Какие основные цели у вашего лендинга?"

7. Сбор сферы перед запросом контактов:
Пользователь: "привлечь клиентов"
Ты: "Понял! В какой сфере вы работаете и что будете предлагать на лендинге?"
[ОБЯЗАТЕЛЬНО спроси сферу перед запросом номера]

8. Структурированное финальное сообщение перед запросом контактов:
Пользователь: "все будет"
Ты: "Отлично! 👍

Итак, вам нужен лендинг для продажи бетона с разделами:
• Главная страница
• Марки бетона
• Цены
• Доставка
• Контакты
• Форма заявки

Я могу бесплатно подсказать оптимальную структуру именно под ваш бизнес и сориентировать по точной стоимости.

Напишите ваш номер телефона — созвонимся в ближайшее время, покажу примеры и скажу точную цену."

9. Обработка согласия без номера (с УСИЛЕННОЙ мотивацией):
Пользователь: "окей" или "понял"
Ты: "Понял 👍

Итак, вам нужен лендинг для продажи бетона с разделами:
• Главная страница
• Марки бетона
• Цены
• Доставка
• Контакты
• Форма заявки

За 10 минут созвона я:
• покажу примеры лендингов для продажи бетона с приемом заказов
• скажу точную цену без сюрпризов
• предложу оптимальный вариант под ваш бюджет
• объясню как окупить вложения за 2-3 месяца за счет роста заявок

Напишите ваш номер телефона — созвонимся в ближайшее время."

10. Обработка сигнала усталости (КРИТИЧЕСКИ ВАЖНО):
Пользователь: "устал я цену скажу"
Ты: "Понимаю 👍

Итак, вам нужен лендинг для продажи бетона с разделами:
• Главная страница
• Марки бетона
• Цены
• Доставка
• Контакты
• Форма заявки

За 10 минут созвона я покажу примеры лендингов для бетона, скажу точную цену и предложу оптимальный вариант.

Напишите ваш номер телефона — созвонимся в ближайшее время."
[НЕ задавай больше вопросов после сигнала усталости - только резюме и просьба контактов]

11. Усиленная мотивация к созвону с конкретикой:
Пользователь: "незнаю"
Ты: "Понял 👍

Предлагаю не гадать в чате. За 10 минут созвона я:
• подскажу структуру лендинга именно для продажи бетона
• покажу примеры успешных лендингов для бетона
• скажу точную цену без сюрпризов
• предложу оптимальный вариант под ваш бюджет и объемы

Напишите ваш номер телефона — сегодня/завтра созвонимся, покажу примеры и скажу точную стоимость."

12. НЕ использовать имя, если клиент его не назвал:
Пользователь: "сайт нужен"
Ты: "Отлично! Обычно под такие задачи выбирают..."
[НЕ пиши "Отлично, Иван!" если имя не было названо]

Пользователь: "устал я цену скажу"
Ты: "Понимаю 👍
[НЕ пиши "Понимаю, Иван" если имя не было названо]

13. Мягкий запрос имени в начале диалога:
Пользователь: "привет"
Ты: "Привет! 😊 Как к вам обращаться? Или просто скажите, какой проект планируете?"

Пользователь: "сайт нужен"
Ты: "Отлично! Обычно под такие задачи выбирают:
• Лендинг — когда нужно быстро получать заявки
• Многостраничный — когда важно доверие и имидж

Если назовете имя, буду обращаться по имени 😊 Какой тип сайта вам нужен?"
[Только один раз в начале, не настаивай]

14. Усиленная микро-ценность с выгодами для бизнеса:
Пользователь: "бетон"
Ты: "Понял! 👍 Лендинг для продажи бетона – это отличная идея, чтобы:
• увеличить продажи и привлекать больше клиентов
• получать заявки без звонков менеджера (работает 24/7)
• экономить время менеджеров и автоматизировать заявки
• чтобы клиентам было удобно заказать в любое время
• окупить вложения за 2-3 месяца за счет роста заявок

Какие разделы вы планируете разместить на лендинге?"

15. Альтернативы при высокой цене:
Пользователь: "цена какая?" (для проекта от 200,000 ₸)
Ты: "Хороший вопрос 👍 [выгоды]

Для [тип проекта] цена складывается из:
• [блок 1]: от X ₸
• [блок 2]: от Y ₸
• [блок 3]: от Z ₸

Итого: от [цена] ₸ (базовый вариант) до [цена] ₸ (с дополнительными функциями).

Можно начать с базового варианта за [меньшая цена], а потом расширять по мере необходимости. Или можем обсудить поэтапную оплату.

За 10 минут созвона я назову точную цену и предложу оптимальный вариант под ваш бюджет."

16. Финальное сообщение с конкретикой (улучшенное):
Пользователь: "меня зовут Айдар, мой номер +7 777 123 45 67"
Ты: "Отлично, Айдар! 👍 Я свяжусь с вами в ближайшее время, чтобы:
• показать примеры WhatsApp-ботов для доставки еды с приемом заказов
• обсудить детали интеграции с меню и автоматическими уведомлениями
• назвать точную стоимость под ваш проект
• объяснить как окупить вложения за 2-3 месяца за счет роста заказов"

17. Ответ на вопрос о контактах:
Пользователь: "как с тобой связаться?" / "твой телефон" / "контакты" / "email" / "telegram"
Ты: "Конечно! Вот мои контакты:

• Телефон: +7 706 670 36 96 (WhatsApp)
• Телефон: +7 702 999 36 96 (WhatsApp)
• Email: aidar1910main@gmail.com
• Telegram: @opunksnoo
• LinkedIn: linkedin.com/in/aidar1910main

Могу помочь с выбором проекта и сориентировать по стоимости. Что вас интересует?"

18. Ответ на вопрос о телефоне:
Пользователь: "твой номер" / "номер телефона"
Ты: "Мои номера телефонов:
• +7 706 670 36 96 (доступен WhatsApp)
• +7 702 999 36 96 (доступен WhatsApp)

Можете написать или позвонить в удобное время. Чем могу помочь?"

19. Ответ на вопрос об email:
Пользователь: "email" / "почта"
Ты: "Мой email: aidar1910main@gmail.com

Пишите, отвечу в ближайшее время. Расскажите, какой проект вас интересует?"

20. Ответ на вопрос о Telegram:
Пользователь: "telegram" / "телеграм"
Ты: "Мой Telegram: @opunksnoo

Пишите в Telegram, если удобнее общаться там. Какой проект планируете?"`;

// Функция для сбора расширенных метрик из диалога
function extractMetrics(conversationHistory: any[], currentMessage: string) {
  const allMessages = [...conversationHistory, { sender: 'user', text: currentMessage }];
  const allText = allMessages.map(m => m.text).join(' ').toLowerCase();
  const userMessages = allMessages.filter(m => m.sender === 'user');
  const botMessages = allMessages.filter(m => m.sender === 'bot');
  
  // Базовые метрики
  const messageCount = allMessages.length;
  const userMessageCount = userMessages.length;
  const botMessageCount = botMessages.length;
  
  // Анализ текста на различные паттерны
  const hasPriceObjection = /дорого|много|не по карману|слишком дорого|не могу позволить|высокая цена|дороговато|не потяну/i.test(allText);
  const hasNegativeResponse = /не интересно|не нужно|не подходит|слишком сложно|не то|не подойдет|не интересно|отказ/i.test(allText);
  const hasName = !!extractName(allMessages);
  const askedForContact = /номер|телефон|созвонимся|свяжусь|контакт|whatsapp|вайбер|позвонить/i.test(allText);
  const hasUncertainty = /не знаю|не уверен|пока хз|незнаю|сомневаюсь|подумаю|пока не решил/i.test(allText);
  const uncertaintyCount = (allText.match(/не знаю|не уверен|пока хз|незнаю|сомневаюсь|подумаю|пока не решил/gi) || []).length;
  
  // Новые метрики: намерения и интересы
  const hasBudget = /бюджет|сколько есть|могу потратить|готов заплатить|мой бюджет|до \d+|в пределах/i.test(allText);
  const hasDeadline = /когда|срок|нужно срочно|к какому числу|когда будет готово|дедлайн|срочно|быстро|в течение|за неделю|за месяц/i.test(allText);
  const hasSpecificRequirements = /нужно|хочу|должен|обязательно|требуется|важно чтобы|необходимо/i.test(allText);
  const hasQuestions = /как|что|где|когда|почему|зачем|сколько|можно|возможно/i.test(allText);
  const hasComparison = /у конкурентов|другие делают|как у|похоже на|аналоги|примеры|покажи/i.test(allText);
  const hasPreviousExperience = /уже был|делали|был опыт|раньше|раннее|предыдущий/i.test(allText);
  
  // Метрики тональности и настроения
  const positiveWords = (allText.match(/отлично|хорошо|супер|класс|понравилось|нравится|интересно|да|ок|окей|согласен|давай|хочу|нужно/gi) || []).length;
  const negativeWords = (allText.match(/плохо|не нравится|не интересно|не хочу|не нужно|нет|отказ|дорого|сложно/gi) || []).length;
  const sentimentScore = positiveWords > negativeWords ? 'positive' : positiveWords < negativeWords ? 'negative' : 'neutral';
  
  // Метрики вовлеченности
  const averageMessageLength = userMessages.length > 0 
    ? userMessages.reduce((sum, m) => sum + m.text.length, 0) / userMessages.length 
    : 0;
  const hasLongMessages = averageMessageLength > 50; // Сообщения длиннее 50 символов
  const hasShortMessages = averageMessageLength < 20; // Сообщения короче 20 символов
  const engagementLevel = userMessageCount > 5 ? 'high' : userMessageCount > 2 ? 'medium' : 'low';
  
  // Метрики срочности
  const urgencyKeywords = /срочно|быстро|как можно скорее|немедленно|сегодня|завтра|на этой неделе|в течение недели|в течение месяца|очень нужно/i;
  const hasUrgency = urgencyKeywords.test(allText);
  let urgencyLevel: 'high' | 'medium' | 'low' = 'low';
  if (hasUrgency) {
    const highUrgencyMatches = (allText.match(/срочно|быстро|немедленно|сегодня|завтра/gi) || []).length;
    urgencyLevel = highUrgencyMatches > 0 ? 'high' : 'medium';
  }
  
  // Метрики технической осведомленности
  const technicalTerms = /api|интеграция|база данных|бд|backend|frontend|фреймворк|cms|админка|админ панель|автоматизация|скрипт/i.test(allText);
  const businessTerms = /конверсия|лиды|заявки|продажи|маркетинг|seo|реклама|таргетинг|конверсия|roi|окупаемость/i.test(allText);
  
  // Метрики конверсии
  const hasPhone = /\+?\d{9,15}/.test(allText);
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(allText);
  const hasAgreement = /да|ок|окей|согласен|давай|хорошо|понял|понятно|ясно|готов|давайте/i.test(allText);
  
  // Оценка вероятности конверсии (0-100)
  let conversionProbability = 0;
  if (hasPhone) conversionProbability += 40;
  if (hasName) conversionProbability += 15;
  if (hasAgreement) conversionProbability += 20;
  if (hasSpecificRequirements) conversionProbability += 10;
  if (hasBudget) conversionProbability += 10;
  if (hasDeadline) conversionProbability += 5;
  if (hasPriceObjection) conversionProbability -= 15;
  if (hasNegativeResponse) conversionProbability -= 30;
  if (uncertaintyCount > 2) conversionProbability -= 10;
  conversionProbability = Math.max(0, Math.min(100, conversionProbability));
  
  // Оценка качества диалога (0-100)
  let qualityScore = 0;
  if (messageCount >= 5) qualityScore += 20;
  if (messageCount >= 10) qualityScore += 10;
  if (hasName) qualityScore += 15;
  if (hasSpecificRequirements) qualityScore += 15;
  if (hasQuestions) qualityScore += 10;
  if (averageMessageLength > 30) qualityScore += 10;
  if (sentimentScore === 'positive') qualityScore += 10;
  if (hasPhone) qualityScore += 10;
  qualityScore = Math.max(0, Math.min(100, qualityScore));
  
  // Детекция типа клиента
  let clientType = 'unknown';
  if (hasBudget && hasDeadline && hasSpecificRequirements) clientType = 'ready_to_buy';
  else if (hasQuestions && hasComparison) clientType = 'researcher';
  else if (hasUncertainty && uncertaintyCount > 1) clientType = 'hesitant';
  else if (hasPriceObjection) clientType = 'price_sensitive';
  else if (hasPreviousExperience) clientType = 'experienced';
  else if (hasAgreement && hasPhone) clientType = 'hot_lead';
  
  const metrics = {
    // Базовые метрики
    messageCount,
    userMessageCount,
    botMessageCount,
    
    // Бизнес-метрики
    hasPriceObjection,
    hasNegativeResponse,
    hasName,
    askedForContact,
    hasUncertainty,
    uncertaintyCount,
    
    // Новые метрики намерений
    hasBudget,
    hasDeadline,
    hasSpecificRequirements,
    hasQuestions,
    hasComparison,
    hasPreviousExperience,
    
    // Метрики тональности
    sentimentScore,
    positiveWordsCount: positiveWords,
    negativeWordsCount: negativeWords,
    
    // Метрики вовлеченности
    engagementLevel,
    averageMessageLength: Math.round(averageMessageLength),
    hasLongMessages,
    hasShortMessages,
    
    // Метрики срочности
    hasUrgency,
    urgencyLevel,
    
    // Метрики осведомленности
    technicalTerms,
    businessTerms,
    
    // Метрики конверсии
    hasPhone,
    hasEmail,
    hasAgreement,
    conversionProbability,
    qualityScore,
    clientType,
  };
  
  return metrics;
}

function extractName(messages: any[]): string | undefined {
  const namePatterns = [
    /меня зовут ([А-Яа-яA-Za-z]+)/i,
    /я ([А-Яа-яA-Za-z]+)/i,
    /это ([А-Яа-яA-Za-z]+)/i,
  ];
  
  for (const msg of messages) {
    if (msg.sender === 'user') {
      for (const pattern of namePatterns) {
        const match = msg.text.match(pattern);
        if (match && match[1] && match[1].length > 2 && match[1].length < 20) {
          return match[1];
        }
      }
    }
  }
  return undefined;
}

function extractProjectType(text: string): string | undefined {
  const types = {
    'лендинг': 'Лендинг',
    'landing': 'Лендинг',
    'многостраничный': 'Многостраничный сайт',
    'интернет-магазин': 'Интернет-магазин',
    'магазин': 'Интернет-магазин',
    'ecommerce': 'Интернет-магазин',
    'сайт': 'Сайт',
    'website': 'Сайт',
    'бот': 'Чат-бот',
    'telegram': 'Telegram-бот',
    'whatsapp': 'WhatsApp-бот',
    'мобильное приложение': 'Мобильное приложение',
    'app': 'Мобильное приложение',
    'редизайн': 'Редизайн',
    'переделать': 'Редизайн',
  };
  
  for (const [keyword, type] of Object.entries(types)) {
    if (text.includes(keyword)) {
      return type;
    }
  }
  return undefined;
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Метрики будут собраны после получения ответа

    // Отладочная информация
    const geminiKey = process.env.GEMINI_API_KEY;
    console.log('🔍 Проверка переменных окружения:');
    console.log('GEMINI_API_KEY exists:', !!geminiKey);
    console.log('GEMINI_API_KEY length:', geminiKey?.length || 0);
    console.log('GEMINI_API_KEY preview:', geminiKey ? geminiKey.substring(0, 10) + '...' : 'null');

    // Проверяем наличие API ключа (приоритет: Gemini > OpenAI > Hugging Face)
    if (geminiKey && geminiKey.length > 10) {
      console.log('✅ Используется Gemini API');
      return await handleGeminiAPI(message, conversationHistory, geminiKey);
    }

    if (process.env.OPENAI_API_KEY) {
      return await handleOpenAIAPI(message, conversationHistory, process.env.OPENAI_API_KEY);
    }

    if (process.env.HUGGINGFACE_API_KEY) {
      return await handleHuggingFaceAPI(message, conversationHistory, process.env.HUGGINGFACE_API_KEY);
    }

    // Если нет API ключа, используем простую логику на основе ключевых слов
    console.log('⚠️  API ключ не найден, используется fallback режим');
    console.log('Доступные ключи:', {
      GEMINI: !!process.env.GEMINI_API_KEY,
      OPENAI: !!process.env.OPENAI_API_KEY,
      HUGGINGFACE: !!process.env.HUGGINGFACE_API_KEY,
    });
    return NextResponse.json({
      message: getFallbackResponse(message),
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: getFallbackResponse('') },
      { status: 500 }
    );
  }
}

async function handleGeminiAPI(
  message: string,
  conversationHistory: any[],
  apiKey: string
) {
  try {
    // Используем модель gemini-2.0-flash (как в рабочем примере)
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;
    
    console.log('📡 Отправка запроса к Gemini API (gemini-2.0-flash)');

    // Формируем историю диалога с правильными ролями
    const history = conversationHistory.map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    // Собираем содержимое: системный промпт + история + текущее сообщение
    // Первое сообщение должно быть от user
    const allContents = [
      {
        role: 'user',
        parts: [{ text: SYSTEM_PROMPT + '\n\nТеперь ответь на следующий вопрос пользователя:' }],
      },
      ...history,
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ];

    const requestBody = {
      contents: allContents,
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey, // Ключ через заголовок, как в примере
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Gemini API error response:', response.status, response.statusText);
      
      // Обработка ошибки 429 (квота превышена)
      if (response.status === 429) {
        try {
          const errorJson = JSON.parse(errorText);
          const retryDelay = errorJson.error?.details?.find((d: any) => d['@type'] === 'type.googleapis.com/google.rpc.RetryInfo')?.retryDelay || '20';
          console.warn(`⚠️  Квота превышена. Retry через ${retryDelay} секунд. Используется fallback режим.`);
          console.warn('💡 Проверьте квоты здесь: https://ai.dev/usage?tab=rate-limit');
        } catch (e) {
          // Не JSON
        }
        // Возвращаем fallback ответ вместо ошибки
        return NextResponse.json({
          message: getFallbackResponse(message),
        });
      }
      
      // Для других ошибок показываем детали
      try {
        const errorJson = JSON.parse(errorText);
        console.error('Error details:', JSON.stringify(errorJson, null, 2));
      } catch (e) {
        // Не JSON, просто текст
      }
      
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Gemini API response received');
    
    const botMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      'Извините, не удалось получить ответ. Попробуйте еще раз.';

    // Собираем метрики для ответа (включая ответ бота)
    const allMessages = [...conversationHistory, { sender: 'user', text: message }, { sender: 'bot', text: botMessage }];
    const metrics = extractMetrics(conversationHistory, message);
    console.log('📊 [Metrics] Расширенные метрики диалога:', {
      basic: {
        messageCount: metrics.messageCount,
        userMessageCount: metrics.userMessageCount,
        botMessageCount: metrics.botMessageCount,
      },
      business: {
        hasPriceObjection: metrics.hasPriceObjection,
        hasNegativeResponse: metrics.hasNegativeResponse,
        hasName: metrics.hasName,
        askedForContact: metrics.askedForContact,
      },
      engagement: {
        engagementLevel: metrics.engagementLevel,
        averageMessageLength: metrics.averageMessageLength,
        sentimentScore: metrics.sentimentScore,
      },
      conversion: {
        conversionProbability: metrics.conversionProbability,
        qualityScore: metrics.qualityScore,
        clientType: metrics.clientType,
        hasPhone: metrics.hasPhone,
        hasAgreement: metrics.hasAgreement,
      },
      urgency: {
        hasUrgency: metrics.hasUrgency,
        urgencyLevel: metrics.urgencyLevel,
        hasDeadline: metrics.hasDeadline,
      },
    });

    return NextResponse.json({
      message: botMessage,
      metrics: metrics, // Добавляем метрики в ответ
    });
  } catch (error: any) {
    console.error('❌ Gemini API error:', error.message);
    return NextResponse.json({
      message: getFallbackResponse(message),
    });
  }
}

async function handleOpenAIAPI(
  message: string,
  conversationHistory: any[],
  apiKey: string
) {
  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.map((msg: any) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      })),
      { role: 'user', content: message },
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const botMessage = data.choices?.[0]?.message?.content || getFallbackResponse(message);

    return NextResponse.json({
      message: botMessage,
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json({
      message: getFallbackResponse(message),
    });
  }
}

async function handleHuggingFaceAPI(
  message: string,
  conversationHistory: any[],
  apiKey: string
) {
  try {
    // Используем более современную модель для чата
    const model = 'microsoft/DialoGPT-large';
    
    const prompt = `${SYSTEM_PROMPT}\n\nConversation:\n${conversationHistory.map((msg: any) => 
      `${msg.sender === 'user' ? 'User' : 'Bot'}: ${msg.text}`
    ).join('\n')}\nUser: ${message}\nBot:`;

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 500,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`);
    }

    const data = await response.json();
    const botMessage = Array.isArray(data) 
      ? data[0]?.generated_text?.split('Bot:')[1]?.trim() || getFallbackResponse(message)
      : getFallbackResponse(message);

    return NextResponse.json({
      message: botMessage,
    });
  } catch (error) {
    console.error('Hugging Face API error:', error);
    return NextResponse.json({
      message: getFallbackResponse(message),
    });
  }
}

function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  // Простая логика на основе ключевых слов
  if (lowerMessage.includes('сайт') || lowerMessage.includes('website')) {
    return 'Для веб-сайтов цены начинаются от 50,000 ₸ (лендинг) до 500,000 ₸ (SaaS платформа). Могу помочь выбрать подходящий вариант. Какой тип сайта вам нужен?';
  }

  if (lowerMessage.includes('бот') || lowerMessage.includes('bot') || lowerMessage.includes('chatbot')) {
    return 'Чат-боты стоят от 50,000 ₸ (простой Telegram-бот) до 200,000 ₸ (WhatsApp-бот с интеграциями). Расскажите, какой функционал вам нужен?';
  }

  if (lowerMessage.includes('ии') || lowerMessage.includes('ai') || lowerMessage.includes('gpt')) {
    return 'ИИ услуги: от 150,000 ₸ (генерация изображений) до 400,000 ₸ (ML анализ данных). Что именно вас интересует?';
  }

  if (lowerMessage.includes('мобильн') || lowerMessage.includes('mobile') || lowerMessage.includes('app')) {
    return 'Мобильные приложения: от 400,000 ₸ (MVP) до 800,000 ₸ (полноценное приложение). Какой тип приложения вам нужен?';
  }

  if (lowerMessage.includes('дизайн') || lowerMessage.includes('design')) {
    return 'UI/UX дизайн: от 80,000 ₸ (лендинг) до 250,000 ₸ (мобильное приложение). Что нужно спроектировать?';
  }

  if (lowerMessage.includes('цена') || lowerMessage.includes('стоимость') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
    return 'Цены зависят от сложности проекта. Основные услуги: веб-сайты от 50,000 ₸, боты от 50,000 ₸, мобильные приложения от 400,000 ₸. Могу уточнить детали для точной оценки.';
  }

  if (lowerMessage.includes('привет') || lowerMessage.includes('hello') || lowerMessage.includes('салем')) {
    return 'Привет! Я помогу узнать цены на услуги Aidar. Что вас интересует: веб-сайты, боты, ИИ, мобильные приложения или дизайн?';
  }

  // Обработка вопросов о контактах
  if (lowerMessage.includes('контакт') || lowerMessage.includes('связаться') || lowerMessage.includes('связь')) {
    return 'Мои контакты:\n\n• Телефон: +7 706 670 36 96 (WhatsApp)\n• Телефон: +7 702 999 36 96 (WhatsApp)\n• Email: aidar1910main@gmail.com\n• Telegram: @opunksnoo\n• LinkedIn: linkedin.com/in/aidar1910main\n\nМогу помочь с выбором проекта и сориентировать по стоимости. Что вас интересует?';
  }

  if (lowerMessage.includes('телефон') || lowerMessage.includes('номер') || lowerMessage.includes('phone')) {
    return 'Мои номера телефонов:\n• +7 706 670 36 96 (доступен WhatsApp)\n• +7 702 999 36 96 (доступен WhatsApp)\n\nМожете написать или позвонить в удобное время. Чем могу помочь?';
  }

  if (lowerMessage.includes('email') || lowerMessage.includes('почт') || lowerMessage.includes('mail')) {
    return 'Мой email: aidar1910main@gmail.com\n\nПишите, отвечу в ближайшее время. Расскажите, какой проект вас интересует?';
  }

  if (lowerMessage.includes('telegram') || lowerMessage.includes('телеграм') || lowerMessage.includes('tg')) {
    return 'Мой Telegram: @opunksnoo\n\nПишите в Telegram, если удобнее общаться там. Какой проект планируете?';
  }

  if (lowerMessage.includes('linkedin') || lowerMessage.includes('линкедин')) {
    return 'Мой LinkedIn: linkedin.com/in/aidar1910main\n\nМогу помочь с выбором проекта и сориентировать по стоимости. Что вас интересует?';
  }

  return 'Спасибо за вопрос! Для точной оценки стоимости проекта лучше связаться с Aidar напрямую. Могу помочь с общими вопросами о ценах и услугах. Что вас интересует?';
}

