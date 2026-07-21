'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import Breadcrumbs from '@/app/components/dashboard/Breadcrumbs';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  createdAt: string;
}

interface ChatDetails {
  id: string;
  createdAt: string;
  updatedAt: string;
  phone?: string;
  name?: string;
  projectType?: string;
  status: string;
  notes?: string;
  metrics: {
    messageCount: number;
    hasPriceObjection: boolean;
    hasNegativeResponse: boolean;
    hasName: boolean;
    askedForContact: boolean;
    hasUncertainty: boolean;
    uncertaintyCount: number;
  };
  language: string;
  messages: Message[];
}

export default function ChatDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const chatId = params.id as string;
  const [chat, setChat] = useState<ChatDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Нормализация данных с сервера (snake_case -> camelCase)
  const normalizeChatData = (data: any): ChatDetails => {
    if (!data) {
      throw new Error('No data provided for normalization');
    }

    // Нормализация метрик - проверяем разные варианты названий
    const metrics = data.metrics || {};
    const messages = data.messages || [];
    const normalizedMetrics = {
      messageCount: metrics.messageCount || metrics.message_count || messages.length || 0,
      hasPriceObjection: metrics.hasPriceObjection !== undefined 
        ? metrics.hasPriceObjection 
        : (metrics.has_price_objection !== undefined ? metrics.has_price_objection : false),
      hasNegativeResponse: metrics.hasNegativeResponse !== undefined
        ? metrics.hasNegativeResponse
        : (metrics.has_negative_response !== undefined ? metrics.has_negative_response : false),
      hasName: metrics.hasName !== undefined
        ? metrics.hasName
        : (metrics.has_name !== undefined ? metrics.has_name : !!data.name),
      askedForContact: metrics.askedForContact !== undefined
        ? metrics.askedForContact
        : (metrics.asked_for_contact !== undefined ? metrics.asked_for_contact : false),
      hasUncertainty: metrics.hasUncertainty !== undefined
        ? metrics.hasUncertainty
        : (metrics.has_uncertainty !== undefined ? metrics.has_uncertainty : false),
      uncertaintyCount: metrics.uncertaintyCount || metrics.uncertainty_count || 0,
    };

    return {
      id: data.id || data.chatId || chatId || 'unknown',
      phone: data.phone || undefined,
      name: data.name || undefined,
      projectType: data.projectType || data.project_type || undefined,
      status: data.status || 'new',
      notes: data.notes || undefined,
      metrics: normalizedMetrics,
      language: data.language || 'ru',
      createdAt: data.createdAt || data.created_at || new Date().toISOString(),
      updatedAt: data.updatedAt || data.updated_at || new Date().toISOString(),
      messages: (data.messages || []).map((msg: any, index: number) => ({
        id: msg.id || `msg-${index}`,
        sender: msg.sender || 'bot',
        text: msg.text || '',
        createdAt: msg.createdAt || msg.created_at || msg.time || new Date().toISOString(),
      })),
    };
  };

  useEffect(() => {
    if (chatId) {
      fetchChat();
    }
  }, [chatId]);

  useEffect(() => {
    // Прокрутка к последнему сообщению
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);

  const fetchChat = async () => {
    try {
      setLoading(true);
      console.log('📥 [Chat Details] Загрузка чата:', chatId);
      
      const response = await fetch(`/api/admin/chats/${chatId}`);
      const result = await response.json();

      console.log('📥 [Chat Details] Ответ от API:', {
        success: result.success,
        hasData: !!result.data,
        error: result.error,
        fullResponse: result,
      });

      if (!response.ok) {
        const errorMsg = result.error || result.message || 'Чат не найден';
        console.error('❌ [Chat Details] Ошибка:', errorMsg);
        setChat(null);
        return;
      }

      if (result.success && result.data) {
        try {
          const normalizedChat = normalizeChatData(result.data);
          setChat(normalizedChat);
          setStatus(normalizedChat.status);
          setNotes(normalizedChat.notes || '');
          console.log('✅ [Chat Details] Чат загружен:', normalizedChat.id);
        } catch (error) {
          console.error('❌ [Chat Details] Ошибка нормализации данных:', error);
          setChat(null);
        }
      } else if (result.data) {
        try {
          const normalizedChat = normalizeChatData(result.data);
          setChat(normalizedChat);
          setStatus(normalizedChat.status);
          setNotes(normalizedChat.notes || '');
        } catch (error) {
          console.error('❌ [Chat Details] Ошибка нормализации данных:', error);
          setChat(null);
        }
      } else if (result.chat || result.id) {
        try {
          const normalizedChat = normalizeChatData(result.chat || result);
          setChat(normalizedChat);
          setStatus(normalizedChat.status);
          setNotes(normalizedChat.notes || '');
        } catch (error) {
          console.error('❌ [Chat Details] Ошибка нормализации данных:', error);
          setChat(null);
        }
      } else {
        console.warn('⚠️ [Chat Details] Неожиданная структура ответа:', result);
        setChat(null);
      }
    } catch (error) {
      console.error('❌ [Chat Details] Критическая ошибка:', error);
      setChat(null);
    } finally {
      setLoading(false);
    }
  };

  const updateChat = async () => {
    try {
      setUpdating(true);
      console.log('💾 [Chat Details] Обновление чата:', { chatId, status, notes });
      
      const response = await fetch(`/api/admin/chats/${chatId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notes }),
      });

      const result = await response.json();
      console.log('📥 [Chat Details] Ответ на обновление:', result);

      if (result.success && result.data) {
        const normalizedChat = normalizeChatData(result.data);
        setChat(normalizedChat);
        // Показываем уведомление вместо alert
        showNotification('Чат успешно обновлен', 'success');
      } else if (result.data) {
        const normalizedChat = normalizeChatData(result.data);
        setChat(normalizedChat);
        showNotification('Чат успешно обновлен', 'success');
      } else if (response.ok) {
        setChat({ ...chat!, status, notes });
        showNotification('Чат успешно обновлен', 'success');
      } else {
        throw new Error(result.error || 'Ошибка при обновлении');
      }
    } catch (error) {
      console.error('❌ [Chat Details] Ошибка обновления:', error);
      showNotification('Ошибка при обновлении чата', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    // Простое уведомление - можно заменить на toast библиотеку
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
      type === 'success' 
        ? 'bg-green-500 text-white' 
        : 'bg-red-500 text-white'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'contacted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'in_progress':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'archived':
        return 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      new: 'Новый',
      contacted: 'Связались',
      in_progress: 'В работе',
      completed: 'Завершен',
      archived: 'Архив',
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <DashboardLayout userRole="admin" userName="Aidar">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 font-light">Загрузка чата...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!chat) {
    return (
      <DashboardLayout userRole="admin" userName="Aidar">
        <div className="text-center py-12">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 dark:text-gray-400 font-light text-lg mb-2">Чат не найден</p>
          <button
            onClick={() => router.push('/admin/chats')}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Вернуться к списку чатов
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="admin" userName="Aidar">
      <Breadcrumbs items={[
        { label: 'Главная', path: '/' },
        { label: 'Панель управления', path: '/admin/dashboard' },
        { label: 'Чаты', path: '/admin/chats' },
        { label: chat.name || chat.phone || chat.id.slice(0, 8) || 'Детали чата' }
      ]} />

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-light tracking-wide text-gray-900 dark:text-gray-100">
              Чат {chat.name || chat.phone || chat.id.slice(0, 8)}
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(chat.status)}`}>
              {getStatusText(chat.status)}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-light">
            {formatDate(chat.createdAt)}
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/chats')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-light hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Назад к списку
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages */}
        <div className="lg:col-span-2">
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-light text-gray-900 dark:text-gray-100">
                Сообщения
              </h3>
              <span className="px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                {chat.messages?.length || 0}
              </span>
            </div>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {chat.messages && chat.messages.length > 0 ? (
                chat.messages.map((message, index) => (
                  <div
                    key={message.id || `msg-${index}`}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div className="flex items-start gap-3 max-w-[80%]">
                      {message.sender === 'bot' && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                          🤖
                        </div>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-3 shadow-sm ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        <p className="font-light whitespace-pre-wrap leading-relaxed">{message.text || ''}</p>
                        {message.createdAt && (
                          <p className={`text-xs mt-2 ${
                            message.sender === 'user'
                              ? 'text-blue-100'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {formatDateShort(message.createdAt)}
                          </p>
                        )}
                      </div>
                      {message.sender === 'user' && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-sm font-medium">
                          👤
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400">Сообщений нет</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info */}
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
            <h3 className="text-xl font-light text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Информация
            </h3>
            <div className="space-y-4">
              {chat.name && (
                <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mb-1">Имя</p>
                  <p className="text-base font-light text-gray-900 dark:text-gray-100">{chat.name}</p>
                </div>
              )}
              {chat.phone && (
                <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mb-1">Телефон</p>
                  <a
                    href={`tel:${chat.phone}`}
                    className="text-base font-light text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {chat.phone}
                  </a>
                </div>
              )}
              {chat.projectType && (
                <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mb-1">Тип проекта</p>
                  <p className="text-base font-light text-gray-900 dark:text-gray-100">{chat.projectType}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mb-1">Язык</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  {chat.language.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
            <h3 className="text-xl font-light text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Метрики
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-sm font-light text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Сообщений
                </span>
                <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                  {chat.metrics?.messageCount || chat.messages?.length || 0}
                </span>
              </div>
              
              {chat.metrics?.hasPriceObjection && (
                <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/50">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">Возражение по цене</span>
                </div>
              )}
              
              {chat.metrics?.hasNegativeResponse && (
                <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/50">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">Негативный ответ</span>
                </div>
              )}
              
              {chat.metrics?.hasUncertainty && (
                <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800/50">
                  <svg className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                    Неопределенность
                    {chat.metrics.uncertaintyCount > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-orange-200 dark:bg-orange-800 rounded-full text-xs">
                        {chat.metrics.uncertaintyCount}
                      </span>
                    )}
                  </span>
                </div>
              )}
              
              {chat.metrics?.askedForContact && (
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/50">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Запрошен контакт</span>
                </div>
              )}

              {!chat.metrics?.hasPriceObjection && 
               !chat.metrics?.hasNegativeResponse && 
               !chat.metrics?.hasUncertainty && 
               !chat.metrics?.askedForContact && (
                <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                  Нет дополнительных метрик
                </div>
              )}
            </div>
          </div>

          {/* Update Form */}
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
            <h3 className="text-xl font-light text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Обновить статус
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Статус
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-light focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="new">Новый</option>
                  <option value="contacted">Связались</option>
                  <option value="in_progress">В работе</option>
                  <option value="completed">Завершен</option>
                  <option value="archived">Архив</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Заметки
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-light focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Добавьте заметки..."
                />
              </div>
              <button
                onClick={updateChat}
                disabled={updating}
                className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
              >
                {updating ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Сохранение...
                  </span>
                ) : (
                  'Сохранить'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
