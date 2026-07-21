'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { analyticsEvents } from '../lib/analytics';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

export default function ChatBot() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isDialogSavedRef = useRef(false);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Начальное приветствие
      setTimeout(() => {
        addBotMessage(t('chatbot.greeting'));
      }, 500);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  // Функция для сохранения диалога в Google Sheets
  const saveDialog = React.useCallback(async () => {
    try {
      // Пропускаем, если диалог уже сохранен или слишком короткий
      if (isDialogSavedRef.current || messages.length <= 1) {
        return;
      }

      // Отмечаем, что диалог сохранен
      isDialogSavedRef.current = true;

      const dialogData = {
        timestamp: new Date().toISOString(),
        phone: extractPhoneFromMessages(),
        projectType: extractProjectTypeFromMessages(),
        messages: messages.map(msg => ({
          sender: msg.sender,
          text: msg.text,
          time: msg.timestamp.toISOString(),
        })),
      };

      await fetch('/api/save-dialog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dialogData),
      });
    } catch (error) {
      console.error('Ошибка сохранения диалога:', error);
      // Сбрасываем флаг при ошибке, чтобы можно было попробовать снова
      isDialogSavedRef.current = false;
    }
  }, [messages]);

  // Планируем сохранение через 2 минуты после последнего сообщения
  const scheduleSave = React.useCallback(() => {
    // Очищаем предыдущий таймер
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Планируем сохранение через 2 минуты после последнего сообщения
    saveTimeoutRef.current = setTimeout(() => {
      if (!isDialogSavedRef.current && messages.length > 1) {
        saveDialog();
      }
    }, 2 * 60 * 1000); // 2 минуты
  }, [messages, saveDialog]);

  // Извлекаем номер телефона из сообщений
  const extractPhoneFromMessages = (): string | undefined => {
    const phoneRegex = /(\+?7|8)?[\s\-]?\(?(\d{3})\)?[\s\-]?(\d{3})[\s\-]?(\d{2})[\s\-]?(\d{2})/;
    for (const msg of messages) {
      if (msg.sender === 'user') {
        const match = msg.text.match(phoneRegex);
        if (match) {
          return match[0].replace(/\D/g, '');
        }
      }
    }
    return undefined;
  };

  // Извлекаем тип проекта из сообщений
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

  const sendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    addUserMessage(userMessage);
    setIsTyping(true);

    try {
      // Отправляем сообщение на API
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
      addBotMessage(data.message || 'Извините, произошла ошибка. Попробуйте еще раз.');

      // Проверяем, получен ли номер телефона - если да, сохраняем сразу
      const phoneRegex = /(\+?7|8)?[\s\-]?\(?(\d{3})\)?[\s\-]?(\d{3})[\s\-]?(\d{2})[\s\-]?(\d{2})/;
      if (phoneRegex.test(userMessage)) {
        // Сохраняем сразу при получении номера
        setTimeout(() => {
          saveDialog();
        }, 1000);
      } else {
        // Иначе планируем сохранение через 2 минуты после последнего сообщения
        scheduleSave();
      }
    } catch (error) {
      console.error('Chat error:', error);
      addBotMessage('Извините, не удалось отправить сообщение. Проверьте подключение к интернету и попробуйте еще раз.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Сохранение диалога при закрытии чата
  useEffect(() => {
    if (!isOpen && messages.length > 1 && !isDialogSavedRef.current) {
      // Сохраняем диалог при закрытии, если он еще не сохранен
      saveDialog();
    }
    
    // Очищаем таймер при закрытии
    if (!isOpen && saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
  }, [isOpen, messages.length, saveDialog]);

  const handleStartOver = () => {
    // Сохраняем текущий диалог перед очисткой, если он еще не сохранен
    if (messages.length > 1 && !isDialogSavedRef.current) {
      saveDialog();
    }
    
    // Очищаем таймер
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    
    // Сбрасываем флаг сохранения для нового диалога
    isDialogSavedRef.current = false;
    
    setMessages([]);
    setInputValue('');
    setTimeout(() => {
      addBotMessage(t('chatbot.greeting'));
    }, 500);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setIsOpen(true);
          analyticsEvents.chatbotOpen();
        }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-blue-600 to-orange-600 rounded-full shadow-2xl hover:shadow-blue-500/50 dark:hover:shadow-orange-500/50 flex items-center justify-center text-white hover:scale-110 transition-all duration-300 z-50 group"
        aria-label={t('chatbot.open')}
      >
        <svg className="w-8 h-8 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs animate-pulse">
          AI
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 w-96 h-[600px] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-orange-600 p-6 flex items-center justify-between">
        <div>
          <h3 className="text-white text-xl font-light tracking-wide">{t('chatbot.title')}</h3>
          <p className="text-white/80 text-sm font-light">AI Assistant</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleStartOver}
            className="text-white/80 hover:text-white transition-colors text-xs font-light"
            title={t('chatbot.startOver')}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={() => {
              // Сохраняем диалог перед закрытием, если он еще не сохранен
              if (messages.length > 1 && !isDialogSavedRef.current) {
                saveDialog();
              }
              setIsOpen(false);
            }}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label={t('chatbot.close')}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-950">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.sender === 'user'
                  ? 'bg-gradient-to-br from-blue-600 to-orange-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <p className="text-sm font-light whitespace-pre-wrap leading-relaxed">{message.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-end gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('chatbot.placeholder')}
            disabled={isTyping}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 font-light text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="px-5 py-3 bg-gradient-to-r from-blue-600 to-orange-600 text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity font-light text-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center font-light">
          Powered by AI • {process.env.NEXT_PUBLIC_AI_PROVIDER || 'Gemini'}
        </p>
      </div>
    </div>
  );
}
