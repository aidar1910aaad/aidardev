'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedSection from '../common/AnimatedSection';
import { analyticsEvents } from '../../lib/analytics';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

interface ChatMetrics {
  messageCount: number;
  hasPriceObjection: boolean;
  hasNegativeResponse: boolean;
  hasName: boolean;
  askedForContact: boolean;
  hasUncertainty: boolean;
  uncertaintyCount: number;
}

interface DialogData {
  timestamp: string;
  phone: string | undefined;
  name: string | undefined;
  projectType: string | undefined;
  messages: Array<{ sender: Message['sender']; text: string; time: string }>;
  metrics: ChatMetrics;
  language: string;
  chatId?: string;
}

export default function ChatSection() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isDialogSavedRef = useRef(false);
  const greetingAddedRef = useRef(false);
  const metricsRef = useRef<Partial<ChatMetrics> | null>(null);
  const chatIdRef = useRef<string | undefined>(undefined); // Храним ID чата для обновления
  const isSavingOnUnloadRef = useRef(false); // Флаг для предотвращения двойного сохранения при закрытии

  useEffect(() => {
    if (messages.length === 0 && !greetingAddedRef.current) {
      // Начальное приветствие
      greetingAddedRef.current = true;
      setTimeout(() => {
        addBotMessage(t('chatbot.greeting'));
        // Отслеживаем открытие чата
        analyticsEvents.chatbotOpen();
      }, 500);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const addBotMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date(),
    }]);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    }]);
  };

  // Функция для сохранения диалога на сервер
  const saveDialog = React.useCallback(async (detectedPhone?: string, additionalMessages?: Array<{ sender: 'bot' | 'user', text: string, timestamp: Date }>) => {
    try {
      // Если чат уже сохранен И нет chatId для обновления, пропускаем
      // Если есть chatId, разрешаем обновление даже если флаг установлен
      if (isDialogSavedRef.current && !chatIdRef.current) {
        console.log('💾 [Chat Save] Пропуск: чат уже сохранен и нет chatId для обновления');
        return;
      }
      
      // Если есть chatId, разрешаем обновление
      if (isDialogSavedRef.current && chatIdRef.current) {
        console.log('🔄 [Chat Save] Обновление существующего чата:', chatIdRef.current);
      }

      // Формируем полный список сообщений, включая дополнительные (если есть)
      // При обновлении чата убираем дубликаты по тексту и времени
      let allMessages: Message[] = messages;
      
      // Добавляем дополнительные сообщения, если есть
      if (additionalMessages && additionalMessages.length > 0) {
        // Конвертируем дополнительные сообщения в формат Message
        const additionalAsMessages: Message[] = additionalMessages.map((msg, index) => ({
          id: `additional-${Date.now()}-${index}`,
          sender: msg.sender,
          text: msg.text,
          timestamp: msg.timestamp,
        }));
        allMessages = [...messages, ...additionalAsMessages];
      }
      
      // Убираем дубликаты сообщений при обновлении (если есть chatId)
      // Дубликаты могут появиться, если бэкенд не удаляет старые сообщения
      if (chatIdRef.current && allMessages.length > 0) {
        const uniqueMessages: Message[] = [];
        const seenMessages = new Set<string>();
        
        for (const msg of allMessages) {
          // Создаем уникальный ключ: отправитель + текст + время (округленное до секунды)
          const timeKey = new Date(msg.timestamp).toISOString().slice(0, 19); // YYYY-MM-DDTHH:mm:ss
          const messageKey = `${msg.sender}:${msg.text.trim()}:${timeKey}`;
          
          if (!seenMessages.has(messageKey)) {
            seenMessages.add(messageKey);
            uniqueMessages.push(msg);
          }
        }
        
        if (uniqueMessages.length < allMessages.length) {
          console.log('🔄 [Chat Save] Удалены дубликаты сообщений при обновлении:', {
            было: allMessages.length,
            стало: uniqueMessages.length,
            удалено: allMessages.length - uniqueMessages.length,
          });
        }
        
        allMessages = uniqueMessages;
      }

      if (allMessages.length <= 1) {
        console.log('💾 [Chat Save] Пропуск: слишком мало сообщений', allMessages.length);
        return;
      }

      // Используем переданный номер или ищем в сообщениях
      const phone = detectedPhone || extractPhoneFromMessages();
      
      // Извлекаем имя из всех сообщений (включая дополнительное)
      const name = (() => {
        for (const msg of allMessages) {
          if (msg.sender === 'user') {
            const text = msg.text.trim();
            const namePatterns = [
              /меня зовут ([А-Яа-яA-Za-z]+)/i,
              /я ([А-Яа-яA-Za-z]+)/i,
              /это ([А-Яа-яA-Za-z]+)/i,
              /зовут ([А-Яа-яA-Za-z]+)/i,
              /имя ([А-Яа-яA-Za-z]+)/i,
            ];
            
            for (const pattern of namePatterns) {
              const match = text.match(pattern);
              if (match && match[1] && match[1].length > 2 && match[1].length < 20) {
                return match[1];
              }
            }
            
            // Если паттерны не сработали, проверяем, не является ли само сообщение именем
            if (/^[А-Яа-яA-Za-z]{2,20}$/.test(text)) {
              const excludedWords = ['привет', 'здравствуй', 'да', 'нет', 'ок', 'окей', 'хорошо', 'понял', 'сайт', 'бот', 'лендинг', 'магазин', 'приложение'];
              if (!excludedWords.includes(text.toLowerCase())) {
                return text;
              }
            }
          }
        }
        return undefined;
      })();

      console.log('💾 [Chat Save] Начинаю сохранение чата...', {
        messageCount: allMessages.length,
        hasPhone: !!phone,
        phone: phone || 'нет',
        hasName: !!name,
        name: name || 'нет',
        projectType: extractProjectTypeFromMessages(),
        detectedPhone: detectedPhone || 'не передан',
        additionalMessages: additionalMessages ? `${additionalMessages.length} сообщений` : 'нет',
      });

      isDialogSavedRef.current = true;

      // Очищаем metrics - отправляем только те метрики, которые принимает бэкенд
      // Бэкенд принимает только: messageCount, hasPriceObjection, hasNegativeResponse, 
      // hasName, askedForContact, hasUncertainty, uncertaintyCount
      const cleanMetrics = metricsRef.current ? {
        messageCount: metricsRef.current.messageCount || allMessages.length,
        hasPriceObjection: Boolean(metricsRef.current.hasPriceObjection),
        hasNegativeResponse: Boolean(metricsRef.current.hasNegativeResponse),
        hasName: Boolean(metricsRef.current.hasName),
        askedForContact: Boolean(metricsRef.current.askedForContact),
        hasUncertainty: Boolean(metricsRef.current.hasUncertainty),
        uncertaintyCount: Number(metricsRef.current.uncertaintyCount) || 0,
      } : {
        // Дефолтные значения если метрики не были собраны
        messageCount: allMessages.length,
        hasPriceObjection: false,
        hasNegativeResponse: false,
        hasName: false,
        askedForContact: false,
        hasUncertainty: false,
        uncertaintyCount: 0,
      };

      const dialogData: DialogData = {
        timestamp: new Date().toISOString(),
        phone: phone,
        name: name,
        projectType: extractProjectTypeFromMessages(),
        messages: allMessages.map(msg => ({
          sender: msg.sender,
          text: msg.text,
          time: msg.timestamp.toISOString(),
        })),
        metrics: cleanMetrics,
        language: language,
      };

      // Если есть сохраненный chatId, добавляем его для обновления существующего чата
      if (chatIdRef.current) {
        dialogData.chatId = chatIdRef.current;
        console.log('🔄 [Chat Save] Обновление существующего чата:', chatIdRef.current);
      } else {
        console.log('✨ [Chat Save] Создание нового чата');
      }

      console.log('💾 [Chat Save] Отправка данных на сервер...', {
        messagesCount: dialogData.messages.length,
        phone: dialogData.phone || 'нет',
        name: dialogData.name || 'нет',
        projectType: dialogData.projectType || 'нет',
        language: dialogData.language,
      });

      // Показываем полную структуру данных, которые будут отправлены на сервер
      console.log('📤 [Chat Save] Полные данные для отправки на сервер:', {
        timestamp: dialogData.timestamp,
        phone: dialogData.phone,
        name: dialogData.name,
        projectType: dialogData.projectType,
        language: dialogData.language,
        metrics: dialogData.metrics,
        messages: dialogData.messages.map((msg, index) => ({
          index: index + 1,
          sender: msg.sender,
          text: msg.text.substring(0, 50) + (msg.text.length > 50 ? '...' : ''),
          time: msg.time,
        })),
        totalMessages: dialogData.messages.length,
      });

      // Показываем полный JSON для отладки
      const jsonString = JSON.stringify(dialogData, null, 2);
      console.log('📋 [Chat Save] Полный JSON данные:', jsonString);
      console.log('📋 [Chat Save] JSON данные (объект):', dialogData);

      const response = await fetch('/api/save-dialog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dialogData),
      });

      const result = await response.json();

      if (result.success) {
        // Сохраняем chatId для будущих обновлений
        if (result.chatId) {
          chatIdRef.current = result.chatId;
        }

        const isUpdated = result.updated === true;
        console.log(`✅ [Chat Save] Чат ${isUpdated ? 'обновлен' : 'создан'}!`, {
          chatId: result.chatId,
          updated: isUpdated,
          timestamp: new Date().toLocaleTimeString('ru-RU'),
        });

        // Если чат был создан (не обновлен), устанавливаем флаг сохранения
        // Если чат был обновлен, оставляем флаг как есть, чтобы можно было обновлять дальше
        if (!isUpdated) {
          isDialogSavedRef.current = true;
        } else {
          // При обновлении сбрасываем флаг, чтобы можно было обновлять чат снова при новых сообщениях
          isDialogSavedRef.current = false;
        }
      } else {
        console.error('❌ [Chat Save] Ошибка сохранения:', result.message || result.error);
        isDialogSavedRef.current = false;
      }
    } catch (error) {
      console.error('❌ [Chat Save] Критическая ошибка сохранения диалога:', error);
      isDialogSavedRef.current = false;
    }
  }, [messages, language]);

  const scheduleSave = React.useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      console.log('⏰ [Chat Save] Отменен предыдущий таймер сохранения');
    }

    console.log('⏰ [Chat Save] Запланировано сохранение через 2 минуты...', {
      messageCount: messages.length,
      timestamp: new Date().toLocaleTimeString('ru-RU'),
    });

    saveTimeoutRef.current = setTimeout(() => {
      console.log('⏰ [Chat Save] Таймер сработал, проверяю необходимость сохранения...');
      if (!isDialogSavedRef.current && messages.length > 1) {
        console.log('⏰ [Chat Save] Запускаю сохранение по таймеру');
        saveDialog();
      } else {
        console.log('⏰ [Chat Save] Пропуск сохранения по таймеру:', {
          alreadySaved: isDialogSavedRef.current,
          messageCount: messages.length,
        });
      }
    }, 2 * 60 * 1000);
  }, [messages, saveDialog]);

  const extractPhoneFromMessages = (): string | undefined => {
    // Универсальная функция для распознавания номеров телефонов в любых форматах
    // Поддерживает: международные форматы, разные префиксы, с форматированием и без
    
    for (const msg of messages) {
      if (msg.sender === 'user') {
        const text = msg.text.trim();
        
        // Универсальный паттерн: ищем последовательности цифр с возможными разделителями
        // Поддерживает: +7, +1, +44, 8, 7, и другие префиксы
        // Форматы: +7 702 999 36 96, 8-702-999-36-96, (702) 999-36-96, 87029993696, +1234567890 и т.д.
        
        // Паттерн 1: Международный формат с + (например, +7 702 999 36 96, +1 234 567 8900)
        let match = text.match(/\+\d{1,4}[\s\-\(\)]?\d{1,4}[\s\-\(\)]?\d{1,4}[\s\-\(\)]?\d{1,4}[\s\-\(\)]?\d{1,4}[\s\-\(\)]?\d{1,4}[\s\-\(\)]?\d{1,4}/);
        
        // Паттерн 2: Номер с префиксом без + (8 702 999 36 96, 7 702 999 36 96)
        if (!match) {
          match = text.match(/(?:^|\s)([78]\d{0,2})[\s\-\(\)]?(\d{3,4})[\s\-\(\)]?(\d{3,4})[\s\-\(\)]?(\d{2,4})[\s\-\(\)]?(\d{2,4})/);
        }
        
        // Паттерн 3: Номер в скобках (702) 999-36-96, (123) 456-7890
        if (!match) {
          match = text.match(/\((\d{3,4})\)[\s\-]?(\d{3,4})[\s\-]?(\d{2,4})[\s\-]?(\d{2,4})/);
        }
        
        // Паттерн 4: 9-15 цифр подряд (гибкая валидация - собираем все похожие)
        if (!match) {
          match = text.match(/(\d{9,15})/);
        }
        
        // Паттерн 5: Номер с дефисами или точками (702-999-36-96, 123.456.7890)
        if (!match) {
          match = text.match(/(\d{2,5}[\-\.]\d{2,5}[\-\.]\d{2,5}[\-\.]\d{2,5})/);
        }
        
        // Паттерн 6: Номер с пробелами (702 999 36 96, 123 456 7890)
        if (!match) {
          match = text.match(/(\d{2,5}[\s]\d{2,5}[\s]\d{2,5}[\s]\d{2,5})/);
        }
        
        // Паттерн 7: Смешанный формат (цифры с разными разделителями)
        if (!match) {
          match = text.match(/(\d{2,4}[\s\-\(\)\.]\d{2,4}[\s\-\(\)\.]\d{2,4}[\s\-\(\)\.]\d{2,4})/);
        }
        
        if (match) {
          // Извлекаем все цифры из найденного совпадения
          let phoneDigits = match[0].replace(/\D/g, '');
          
          // Гибкая валидация: принимаем номера от 9 до 15 цифр (собираем все похожие)
          if (phoneDigits.length >= 9 && phoneDigits.length <= 15) {
            // Нормализация для казахстанских номеров
            if (phoneDigits.length === 11 && phoneDigits.startsWith('8')) {
              phoneDigits = '7' + phoneDigits.substring(1);
            }
            
            // Если номер имеет 9-10 цифр, пробуем добавить префикс для казахстанских
            if (phoneDigits.length >= 9 && phoneDigits.length <= 10) {
              // Если начинается с кода оператора Казахстана (7xx, 4xx, 5xx, 6xx), добавляем 7
              if (/^[4567]\d{2}/.test(phoneDigits)) {
                phoneDigits = '7' + phoneDigits;
              }
            }
            
            // Минимальная нормализация: если номер начинается с 8, заменяем на 7 (для казахстанских)
            if (phoneDigits.startsWith('8')) {
              phoneDigits = '7' + phoneDigits.substring(1);
            }
            
            // Финальная проверка: номер должен быть от 9 до 15 цифр (гибкая валидация)
            // Возвращаем как есть, без строгой нормализации - сервер сам решит
            if (phoneDigits.length >= 9 && phoneDigits.length <= 15) {
              console.log('📞 [Extract Phone] Найден номер (гибкая валидация):', {
                original: match[0],
                normalized: phoneDigits,
                length: phoneDigits.length,
              });
              return phoneDigits;
            }
          }
        }
      }
    }
    return undefined;
  };

  const extractProjectTypeFromMessages = (): string | undefined => {
    const projectKeywords = {
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

    for (const msg of messages) {
      const lowerText = msg.text.toLowerCase();
      for (const [keyword, type] of Object.entries(projectKeywords)) {
        if (lowerText.includes(keyword)) {
          return type;
        }
      }
    }
    return undefined;
  };

  // Извлекаем имя из сообщений
  const extractNameFromMessages = (): string | undefined => {
    const namePatterns = [
      /меня зовут ([А-Яа-яA-Za-z]+)/i,
      /я ([А-Яа-яA-Za-z]+)/i,
      /это ([А-Яа-яA-Za-z]+)/i,
      /зовут ([А-Яа-яA-Za-z]+)/i,
      /имя ([А-Яа-яA-Za-z]+)/i,
    ];
    
    for (const msg of messages) {
      if (msg.sender === 'user') {
        const text = msg.text.trim();
        
        // Сначала пробуем паттерны с контекстом
        for (const pattern of namePatterns) {
          const match = text.match(pattern);
          if (match && match[1] && match[1].length > 2 && match[1].length < 20) {
            return match[1];
          }
        }
        
        // Если паттерны не сработали, проверяем, не является ли само сообщение именем
        // Имя должно быть: только буквы, от 2 до 20 символов, не содержит цифр
        if (/^[А-Яа-яA-Za-z]{2,20}$/.test(text)) {
          // Исключаем общие слова, которые не являются именами
          const excludedWords = ['привет', 'здравствуй', 'да', 'нет', 'ок', 'окей', 'хорошо', 'понял', 'сайт', 'бот', 'лендинг', 'магазин', 'приложение'];
          if (!excludedWords.includes(text.toLowerCase())) {
            return text;
          }
        }
      }
    }
    return undefined;
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    addUserMessage(userMessage);
    setIsTyping(true);
    analyticsEvents.chatMessageSend(userMessage.length);
    
    console.log('💬 [Chat] Пользователь отправил сообщение:', {
      message: userMessage.substring(0, 50) + (userMessage.length > 50 ? '...' : ''),
      totalMessages: messages.length + 1,
      timestamp: new Date().toLocaleTimeString('ru-RU'),
    });
    
    // Возвращаем фокус на поле ввода сразу после отправки
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    try {
      const conversationHistory = messages.map(msg => ({
        sender: msg.sender,
        text: msg.text,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const botResponseText = data.message || 'Извините, произошла ошибка. Попробуйте еще раз.';
      addBotMessage(botResponseText);
      
      // Сохраняем метрики из ответа
      if (data.metrics) {
        metricsRef.current = data.metrics;
      }

      // Универсальное распознавание номеров (гибкая валидация - собираем все похожие)
      const text = userMessage.trim();
      
      // Паттерн 1: Международный формат с + (любые комбинации)
      let phoneMatch = text.match(/\+\d{1,4}[\s\-\(\)\.]?\d{1,4}[\s\-\(\)\.]?\d{1,4}[\s\-\(\)\.]?\d{1,4}[\s\-\(\)\.]?\d{1,4}[\s\-\(\)\.]?\d{1,4}[\s\-\(\)\.]?\d{1,4}/);
      
      // Паттерн 2: Номер с префиксом без + (8, 7, и другие)
      if (!phoneMatch) {
        phoneMatch = text.match(/(?:^|\s)([78]\d{0,3})[\s\-\(\)\.]?(\d{2,4})[\s\-\(\)\.]?(\d{2,4})[\s\-\(\)\.]?(\d{2,4})[\s\-\(\)\.]?(\d{2,4})/);
      }
      
      // Паттерн 3: Номер в скобках
      if (!phoneMatch) {
        phoneMatch = text.match(/\((\d{2,4})\)[\s\-\.]?(\d{2,4})[\s\-\.]?(\d{2,4})[\s\-\.]?(\d{2,4})/);
      }
      
      // Паттерн 4: 9-15 цифр подряд (гибкая валидация - собираем все похожие)
      if (!phoneMatch) {
        phoneMatch = text.match(/(\d{9,15})/);
      }
      
      // Паттерн 5: Номер с дефисами или точками
      if (!phoneMatch) {
        phoneMatch = text.match(/(\d{2,5}[\-\.]\d{2,5}[\-\.]\d{2,5}[\-\.]\d{2,5})/);
      }
      
      // Паттерн 6: Номер с пробелами
      if (!phoneMatch) {
        phoneMatch = text.match(/(\d{2,5}[\s]\d{2,5}[\s]\d{2,5}[\s]\d{2,5})/);
      }
      
      // Паттерн 7: Смешанный формат (цифры с разными разделителями)
      if (!phoneMatch) {
        phoneMatch = text.match(/(\d{2,4}[\s\-\(\)\.]\d{2,4}[\s\-\(\)\.]\d{2,4}[\s\-\(\)\.]\d{2,4})/);
      }
      
      if (phoneMatch) {
        let phoneDigits = phoneMatch[0].replace(/\D/g, '');
        
        // Гибкая валидация: принимаем номера от 9 до 15 цифр (собираем все похожие)
        if (phoneDigits.length >= 9 && phoneDigits.length <= 15) {
          // Нормализация: если номер начинается с 8, заменяем на 7
          if (phoneDigits.startsWith('8')) {
            phoneDigits = '7' + phoneDigits.substring(1);
          }
          
          // Если номер имеет 9-10 цифр, пробуем добавить префикс для казахстанских
          if (phoneDigits.length >= 9 && phoneDigits.length <= 10) {
            // Если начинается с кода оператора Казахстана, добавляем 7
            if (/^[4567]\d{2}/.test(phoneDigits)) {
              phoneDigits = '7' + phoneDigits;
            }
          }
          
          // Финальная проверка: номер должен быть от 9 до 15 цифр (гибкая валидация)
          // Отправляем как есть, без строгой нормализации - сервер сам решит
          if (phoneDigits.length >= 9 && phoneDigits.length <= 15) {
            console.log('📞 [Chat Save] Обнаружен номер телефона (гибкая валидация)!', {
              original: phoneMatch[0],
              normalized: phoneDigits,
              length: phoneDigits.length,
            });
            console.log('📞 [Chat Save] Сохранение через 1 секунду...');
            setTimeout(() => {
              console.log('📞 [Chat Save] Запускаю немедленное сохранение (найден телефон)');
              // Передаем найденный номер, сообщение пользователя с номером И ответ бота
              // Это гарантирует, что все сообщения попадут в сохранение
              const userMessageWithPhone = {
                sender: 'user' as const,
                text: userMessage,
                timestamp: new Date(),
              };
              const botResponseMessage = {
                sender: 'bot' as const,
                text: botResponseText,
                timestamp: new Date(),
              };
              saveDialog(phoneDigits, [userMessageWithPhone, botResponseMessage]);
            }, 1000);
          } else {
            console.log('💬 [Chat Save] Найдены цифры, но не валидный номер (после нормализации):', {
              digits: phoneDigits,
              length: phoneDigits.length,
            });
            scheduleSave();
          }
        } else {
          console.log('💬 [Chat Save] Найдены цифры, но не номер телефона (неправильная длина):', {
            original: phoneMatch[0],
            digits: phoneDigits,
            length: phoneDigits.length,
            expected: '9-15 цифр (гибкая валидация)',
          });
          scheduleSave();
        }
      } else {
        console.log('💬 [Chat Save] Номер не найден, планирую сохранение через 2 минуты');
        scheduleSave();
      }
    } catch (error) {
      console.error('Chat error:', error);
      addBotMessage('Извините, не удалось отправить сообщение. Проверьте подключение к интернету и попробуйте еще раз.');
    } finally {
      setIsTyping(false);
    }
  };

  // Если пользователь продолжает писать после того, как чат был сохранен (после номера),
  // сбрасываем флаг сохранения, чтобы можно было сохранить обновленный чат
  const previousMessagesLengthRef = React.useRef(messages.length);
  React.useEffect(() => {
    // Проверяем, увеличилось ли количество сообщений (новое сообщение)
    if (messages.length > previousMessagesLengthRef.current) {
      // Если чат был сохранен, но пользователь отправил новое сообщение, сбрасываем флаг
      if (isDialogSavedRef.current && messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        // Если последнее сообщение от пользователя и чат был сохранен, сбрасываем флаг
        // Это позволит сохранить обновленный чат, если пользователь продолжает диалог
        if (lastMessage.sender === 'user') {
          if (chatIdRef.current) {
            console.log('🔄 [Chat Save] Пользователь продолжает диалог, будет обновлен существующий чат:', chatIdRef.current);
          } else {
            console.log('💬 [Chat Save] Пользователь продолжает диалог после сохранения, сбрасываю флаг сохранения');
          }
          isDialogSavedRef.current = false;
          // Планируем новое сохранение через 2 минуты
          scheduleSave();
        }
      }
      // Обновляем предыдущую длину
      previousMessagesLengthRef.current = messages.length;
    }
  }, [messages.length, scheduleSave]); // Срабатывает при изменении количества сообщений

  // Сохранение чата при закрытии страницы или переходе на другую вкладку
  React.useEffect(() => {
    const handleBeforeUnload = () => {
      // Предотвращаем двойное сохранение - если уже сохраняем, пропускаем
      if (isSavingOnUnloadRef.current) {
        console.log('⏭️ [Chat Save] beforeunload: сохранение уже инициировано, пропускаем');
        return;
      }
      
      // Сохраняем чат перед закрытием страницы если:
      // 1. Есть сообщения (>1)
      // 2. И (чат еще не сохранен ИЛИ есть chatId для обновления)
      const hasMessages = messages.length > 1;
      const needsSave = !isDialogSavedRef.current || chatIdRef.current;
      const shouldSave = hasMessages && needsSave;
      
      console.log('🚨 [Chat Save] beforeunload сработал:', {
        messageCount: messages.length,
        hasMessages,
        isDialogSaved: isDialogSavedRef.current,
        hasChatId: !!chatIdRef.current,
        chatId: chatIdRef.current,
        needsSave,
        shouldSave,
      });
      
      if (shouldSave) {
        // Устанавливаем флаг, чтобы предотвратить двойное сохранение
        isSavingOnUnloadRef.current = true;
        console.log('💾 [Chat Save] Сохранение чата перед закрытием страницы...', {
          hasChatId: !!chatIdRef.current,
          chatId: chatIdRef.current,
          messageCount: messages.length,
        });
        
        // Формируем данные для сохранения (аналогично saveDialog)
        let allMessages: Message[] = messages;
        
        // Убираем дубликаты сообщений при обновлении (если есть chatId)
        if (chatIdRef.current && allMessages.length > 0) {
          const uniqueMessages: Message[] = [];
          const seenMessages = new Set<string>();
          
          for (const msg of allMessages) {
            // Создаем уникальный ключ: отправитель + текст + время (округленное до секунды)
            const timeKey = new Date(msg.timestamp).toISOString().slice(0, 19); // YYYY-MM-DDTHH:mm:ss
            const messageKey = `${msg.sender}:${msg.text.trim()}:${timeKey}`;
            
            if (!seenMessages.has(messageKey)) {
              seenMessages.add(messageKey);
              uniqueMessages.push(msg);
            }
          }
          
          if (uniqueMessages.length < allMessages.length) {
            console.log('🔄 [Chat Save] Удалены дубликаты сообщений при закрытии:', {
              было: allMessages.length,
              стало: uniqueMessages.length,
              удалено: allMessages.length - uniqueMessages.length,
            });
          }
          
          allMessages = uniqueMessages;
        }
        
        const phone = extractPhoneFromMessages();
        const name = extractNameFromMessages();
        
        // Очищаем metrics - отправляем только те метрики, которые принимает бэкенд
        // Бэкенд принимает только: messageCount, hasPriceObjection, hasNegativeResponse, 
        // hasName, askedForContact, hasUncertainty, uncertaintyCount
        const cleanMetrics = metricsRef.current ? {
          messageCount: metricsRef.current.messageCount || allMessages.length,
          hasPriceObjection: Boolean(metricsRef.current.hasPriceObjection),
          hasNegativeResponse: Boolean(metricsRef.current.hasNegativeResponse),
          hasName: Boolean(metricsRef.current.hasName),
          askedForContact: Boolean(metricsRef.current.askedForContact),
          hasUncertainty: Boolean(metricsRef.current.hasUncertainty),
          uncertaintyCount: Number(metricsRef.current.uncertaintyCount) || 0,
        } : {
          // Дефолтные значения если метрики не были собраны
          messageCount: allMessages.length,
          hasPriceObjection: false,
          hasNegativeResponse: false,
          hasName: false,
          askedForContact: false,
          hasUncertainty: false,
          uncertaintyCount: 0,
        };

        const dialogData: DialogData = {
          timestamp: new Date().toISOString(),
          phone: phone,
          name: name,
          projectType: extractProjectTypeFromMessages(),
          messages: allMessages.map(msg => ({
            sender: msg.sender,
            text: msg.text,
            time: msg.timestamp.toISOString(),
          })),
          metrics: cleanMetrics,
          language: language,
        };

        // Если есть сохраненный chatId, добавляем его для обновления существующего чата
        if (chatIdRef.current) {
          dialogData.chatId = chatIdRef.current;
          console.log('🔄 [Chat Save] Обновление существующего чата при закрытии:', chatIdRef.current);
        }

        // Используем navigator.sendBeacon для максимально надежной отправки при закрытии страницы
        // sendBeacon гарантирует отправку даже после закрытия страницы и работает лучше чем fetch с keepalive
        try {
          const jsonString = JSON.stringify(dialogData);
          const blob = new Blob([jsonString], { type: 'application/json' });
          
          // Проверяем размер данных (sendBeacon ограничен ~64KB)
          const dataSize = new Blob([jsonString]).size;
          console.log('📦 [Chat Save] Размер данных для отправки:', dataSize, 'байт');
          
          if (dataSize > 64000) {
            console.warn('⚠️ [Chat Save] Данные слишком большие для sendBeacon, используем fetch с keepalive');
            // Для больших данных используем fetch с keepalive
            fetch('/api/save-dialog', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: jsonString,
              keepalive: true,
            }).catch(error => {
              console.error('❌ [Chat Save] Ошибка сохранения при закрытии (fetch):', error);
            });
          } else {
            // Используем sendBeacon для небольших данных
            const sent = navigator.sendBeacon('/api/save-dialog', blob);
            
            if (sent) {
              console.log('✅ [Chat Save] Чат отправлен через sendBeacon перед закрытием');
            } else {
              // Fallback на fetch с keepalive, если sendBeacon не поддерживается или не отправился
              console.warn('⚠️ [Chat Save] sendBeacon вернул false, используем fetch с keepalive');
              fetch('/api/save-dialog', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: jsonString,
                keepalive: true,
              }).catch(error => {
                console.error('❌ [Chat Save] Ошибка сохранения при закрытии (fetch fallback):', error);
              });
            }
          }
        } catch (error) {
          console.error('❌ [Chat Save] Критическая ошибка при подготовке данных для отправки:', error);
          // Последняя попытка через fetch
          try {
            fetch('/api/save-dialog', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(dialogData),
              keepalive: true,
            }).catch(err => {
              console.error('❌ [Chat Save] Ошибка в последней попытке сохранения:', err);
            });
          } catch (finalError) {
            console.error('❌ [Chat Save] Невозможно отправить данные:', finalError);
          }
        }
      }
    };

    const handleVisibilityChange = () => {
      // Если страница скрыта (переход на другую вкладку или минимизация), сохраняем чат
      const hasMessages = messages.length > 1;
      const needsSave = !isDialogSavedRef.current || chatIdRef.current;
      const shouldSave = document.hidden && hasMessages && needsSave;
      
      console.log('👁️ [Chat Save] visibilitychange сработал:', {
        hidden: document.hidden,
        messageCount: messages.length,
        hasMessages,
        isDialogSaved: isDialogSavedRef.current,
        hasChatId: !!chatIdRef.current,
        needsSave,
        shouldSave,
      });
      
      if (shouldSave) {
        console.log('💾 [Chat Save] Сохранение чата при скрытии страницы...');
        saveDialog();
      }
    };

    // Обработчик pagehide - более надежный чем beforeunload
    const handlePageHide = (e: PageTransitionEvent) => {
      // Предотвращаем двойное сохранение - если уже сохраняем, пропускаем
      if (isSavingOnUnloadRef.current) {
        console.log('⏭️ [Chat Save] pagehide: сохранение уже инициировано, пропускаем');
        return;
      }
      
      // pagehide срабатывает раньше и более надежно
      const hasMessages = messages.length > 1;
      const needsSave = !isDialogSavedRef.current || chatIdRef.current;
      const shouldSave = hasMessages && needsSave;
      
      console.log('📄 [Chat Save] pagehide сработал:', {
        persisted: e.persisted, // true если страница кэшируется (например, в мобильных браузерах)
        messageCount: messages.length,
        hasMessages,
        isDialogSaved: isDialogSavedRef.current,
        hasChatId: !!chatIdRef.current,
        needsSave,
        shouldSave,
      });
      
      if (shouldSave) {
        // Устанавливаем флаг, чтобы предотвратить двойное сохранение
        isSavingOnUnloadRef.current = true;
        // Используем ту же логику что и в beforeunload
        handleBeforeUnload();
      }
    };

    // Добавляем обработчики событий
    // pagehide более надежен, чем beforeunload
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Очистка при размонтировании
    return () => {
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [messages, language, saveDialog]); // Зависимости для актуальных данных

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      sendMessage();
    }
  };

  // Тестовая функция для проверки сохранения при закрытии (только для разработки)
  const testSaveOnClose = React.useCallback(() => {
    console.log('🧪 [Test] Тестирование сохранения при закрытии страницы...');
    const hasMessages = messages.length > 1;
    const needsSave = !isDialogSavedRef.current || chatIdRef.current;
    const shouldSave = hasMessages && needsSave;
    
    console.log('🧪 [Test] Условия сохранения:', {
      messageCount: messages.length,
      hasMessages,
      isDialogSaved: isDialogSavedRef.current,
      hasChatId: !!chatIdRef.current,
      chatId: chatIdRef.current,
      needsSave,
      shouldSave,
    });
    
    if (shouldSave) {
      // Вызываем saveDialog напрямую для тестирования
      console.log('🧪 [Test] Запускаю сохранение через saveDialog...');
      saveDialog();
      console.log('🧪 [Test] Сохранение запущено! Проверьте Network tab и консоль.');
    } else {
      console.warn('🧪 [Test] Сохранение не требуется:', {
        reason: !hasMessages ? 'Мало сообщений' : 'Чат уже сохранен и нет chatId',
      });
    }
  }, [messages, isDialogSavedRef, chatIdRef, saveDialog]);

  const handleStartOver = () => {
    console.log('🔄 [Chat] Начало нового чата (Start Over)', {
      previousMessagesCount: messages.length,
      wasSaved: isDialogSavedRef.current,
    });

    if (messages.length > 1 && !isDialogSavedRef.current) {
      console.log('💾 [Chat Save] Сохранение перед началом нового чата...');
      saveDialog();
    }
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
      console.log('⏰ [Chat Save] Отменен таймер сохранения (новый чат)');
    }
    
    isDialogSavedRef.current = false;
    chatIdRef.current = undefined; // Сбрасываем chatId при начале нового чата
    isSavingOnUnloadRef.current = false; // Сбрасываем флаг сохранения при закрытии
    greetingAddedRef.current = false;
    setMessages([]);
    setInputValue('');
    analyticsEvents.chatStartOver();
    console.log('🔄 [Chat] Новый чат начат (chatId сброшен)');
    setTimeout(() => {
      greetingAddedRef.current = true;
      addBotMessage(t('chatbot.greeting'));
    }, 500);
  };

  const editorialCopy = {
    en: {
      eyebrow: 'Project intake · 3–5 minutes',
      intro: 'Describe the task in a few lines. The assistant will clarify the scope and prepare a quick project brief.',
      assistant: 'Brief assistant',
      online: 'Ready to help',
      suggestions: 'Start with a prompt',
      inputLabel: 'Describe your project',
      inputHint: 'Enter to send · Shift + Enter for a new line',
      transcriptLabel: 'Chat transcript',
      userLabel: 'You',
      assistantLabel: 'Assistant',
      prompts: ['I need a landing page', 'Estimate my project', 'I want to redesign a website'],
    },
    ru: {
      eyebrow: 'Бриф проекта · 3–5 минут',
      intro: 'Опишите задачу в нескольких строках. Ассистент уточнит детали и поможет собрать быстрый бриф.',
      assistant: 'Ассистент по брифу',
      online: 'Готов помочь',
      suggestions: 'Начните с подсказки',
      inputLabel: 'Опишите ваш проект',
      inputHint: 'Enter — отправить · Shift + Enter — новая строка',
      transcriptLabel: 'Диалог с ассистентом',
      userLabel: 'Вы',
      assistantLabel: 'Ассистент',
      prompts: ['Мне нужен лендинг', 'Оценить стоимость проекта', 'Хочу обновить существующий сайт'],
    },
    kz: {
      eyebrow: 'Жоба брифі · 3–5 минут',
      intro: 'Тапсырманы бірнеше сөйлеммен сипаттаңыз. Ассистент мәліметтерді нақтылап, қысқа бриф құруға көмектеседі.',
      assistant: 'Бриф ассистенті',
      online: 'Көмектесуге дайын',
      suggestions: 'Ұсыныстан бастаңыз',
      inputLabel: 'Жобаңызды сипаттаңыз',
      inputHint: 'Enter — жіберу · Shift + Enter — жаңа жол',
      transcriptLabel: 'Ассистентпен диалог',
      userLabel: 'Сіз',
      assistantLabel: 'Ассистент',
      prompts: ['Маған лендинг керек', 'Жоба құнын бағалау', 'Сайтты жаңартқым келеді'],
    },
  }[language];

  return (
    <section id="chat" className="border-y border-gray-200 bg-white py-14 dark:border-gray-800 dark:bg-gray-950 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <AnimatedSection animationType="slide-up" delay={0}>
            <header className="mb-8 grid gap-4 border-t-4 border-gray-950 pt-5 dark:border-white sm:mb-10 sm:grid-cols-[minmax(0,1fr)_minmax(16rem,28rem)] sm:items-end">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-400">
                  {editorialCopy.eyebrow}
                </p>
                <h2 className="max-w-3xl font-serif text-4xl leading-[0.98] tracking-tight text-gray-950 dark:text-white sm:text-5xl lg:text-6xl">
                  {t('chatbot.title')}
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-gray-600 dark:text-gray-300 sm:text-base">
                {editorialCopy.intro}
              </p>
            </header>
          </AnimatedSection>

          <AnimatedSection animationType="fade-in" delay={200}>
            <div className="border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-950">
              <div className="flex items-center justify-between gap-4 border-b border-gray-300 px-4 py-3 dark:border-gray-700 sm:px-5">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-gray-950 dark:text-white">
                    {editorialCopy.assistant}
                  </h3>
                  <p className="mt-0.5 flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400" aria-hidden="true" />
                    {isTyping ? t('chatbot.typing') : editorialCopy.online}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {process.env.NODE_ENV === 'development' && (
                    <button
                      type="button"
                      onClick={testSaveOnClose}
                      className="p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white dark:focus-visible:ring-offset-gray-950"
                      title="Тест сохранения при закрытии (только dev)"
                      aria-label="Тест сохранения при закрытии"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleStartOver}
                    className="p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white dark:focus-visible:ring-offset-gray-950"
                    title={t('chatbot.startOver')}
                    aria-label={t('chatbot.startOver')}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>

              <div
                ref={messagesContainerRef}
                role="log"
                aria-live="polite"
                aria-relevant="additions text"
                aria-busy={isTyping}
                aria-label={editorialCopy.transcriptLabel}
                className="h-[22rem] overflow-y-auto bg-gray-50 px-4 py-5 dark:bg-gray-900 sm:h-[28rem] sm:px-6"
              >
                <div className="mx-auto max-w-3xl space-y-4">
                  {messages.map((message) => (
                    <article
                      key={message.id}
                      aria-label={message.sender === 'user' ? editorialCopy.userLabel : editorialCopy.assistantLabel}
                      className={`grid gap-1.5 ${
                        message.sender === 'user'
                          ? 'ml-auto max-w-[88%] justify-items-end sm:max-w-[72%]'
                          : 'max-w-[92%] justify-items-start sm:max-w-[76%]'
                      }`}
                    >
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        {message.sender === 'user' ? editorialCopy.userLabel : editorialCopy.assistantLabel}
                      </span>
                      <div
                        className={`border px-4 py-3 ${
                          message.sender === 'user'
                            ? 'border-gray-950 bg-gray-950 text-white dark:border-white dark:bg-white dark:text-gray-950'
                            : 'border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100'
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm leading-6">{message.text}</p>
                        {message.sender === 'bot' && messages.indexOf(message) === 0 && (
                          <Link
                            href="/pricing"
                            onClick={() => {
                              if (typeof window !== 'undefined' && window.location.pathname === '/pricing') {
                                window.scrollTo({ top: 0, behavior: 'auto' });
                              }
                              analyticsEvents.calculatePriceClick('Chat Bot - View All Prices');
                            }}
                            className="mt-3 inline-flex border-b border-current pb-0.5 text-sm font-semibold text-blue-700 transition-colors hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:text-blue-400 dark:hover:text-blue-300 dark:focus-visible:ring-offset-gray-950"
                          >
                            Посмотреть все цены →
                          </Link>
                        )}
                      </div>
                    </article>
                  ))}

                  {isTyping && (
                    <div className="max-w-[92%]" aria-label={t('chatbot.typing')}>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        {editorialCopy.assistantLabel}
                      </span>
                      <div className="mt-1.5 inline-flex items-center gap-2 border border-gray-300 bg-white px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" aria-hidden="true" />
                        {t('chatbot.typing')}
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="border-t border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-950 sm:p-5">
                <div className="mx-auto max-w-3xl">
                  <div className="mb-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {editorialCopy.suggestions}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {editorialCopy.prompts.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => {
                            setInputValue(prompt);
                            inputRef.current?.focus();
                          }}
                          className="border border-gray-300 bg-white px-3 py-2 text-left text-xs font-medium text-gray-700 transition-colors hover:border-gray-950 hover:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:hover:border-white dark:hover:text-white dark:focus-visible:ring-offset-gray-950 sm:text-sm"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label htmlFor="chat-project-brief" className="mb-2 block text-sm font-semibold text-gray-950 dark:text-white">
                    {editorialCopy.inputLabel}
                  </label>
                  <div className="grid grid-cols-[minmax(0,1fr)_3.25rem] items-end gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                    <textarea
                      id="chat-project-brief"
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={t('chatbot.placeholder')}
                      rows={1}
                      className="max-h-32 min-h-[52px] w-full resize-none overflow-y-auto border border-gray-400 bg-white px-3 py-3 text-base text-gray-950 placeholder:text-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-400 dark:focus-visible:ring-offset-gray-950"
                      style={{ fontSize: '16px' }}
                    />
                    <button
                      type="button"
                      onClick={sendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      aria-label={t('chatbot.send')}
                      className="inline-flex min-h-[52px] items-center justify-center gap-2 bg-blue-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 dark:bg-blue-600 dark:hover:bg-blue-500 dark:focus-visible:ring-offset-gray-950 dark:disabled:bg-gray-700 dark:disabled:text-gray-400 sm:px-6"
                    >
                      <span className="hidden sm:inline">{t('chatbot.send')}</span>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
                    {editorialCopy.inputHint} · Powered by {process.env.NEXT_PUBLIC_AI_PROVIDER || 'Gemini'}
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

