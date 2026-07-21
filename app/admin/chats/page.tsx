'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import Breadcrumbs from '@/app/components/dashboard/Breadcrumbs';

interface Chat {
  id: string;
  createdAt: string;
  updatedAt: string;
  phone?: string;
  name?: string;
  projectType?: string;
  messageCount: number;
  status: string;
  hasPriceObjection: boolean;
  hasNegativeResponse: boolean;
  hasName: boolean;
  askedForContact: boolean;
  language: string;
  lastMessage?: {
    text: string;
    sender: 'bot' | 'user';
    time: string;
  };
}

type SortField = 'createdAt' | 'updatedAt' | 'name' | 'phone' | 'messageCount' | 'status';
type SortOrder = 'asc' | 'desc';

export default function ChatsPage() {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    hasPhone: false,
    hasName: false,
  });
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [error, setError] = useState<string | null>(null);

  // Загружаем статистику только один раз при монтировании
  useEffect(() => {
    fetchStats();
  }, []); // Пустой массив зависимостей - загружается только один раз

  // Загружаем чаты при изменении фильтров, сортировки или страницы
  useEffect(() => {
    fetchChats();
  }, [page, filters, sortField, sortOrder]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.hasPhone) params.append('hasPhone', 'true');
      if (filters.hasName) params.append('hasName', 'true');
      
      // Добавляем параметры сортировки
      if (sortField) {
        // Маппинг полей фронтенда на поля бэкенда
        const sortFieldMap: Record<SortField, string> = {
          'createdAt': 'created_at',
          'updatedAt': 'updated_at',
          'messageCount': 'message_count',
          'name': 'name',
          'phone': 'phone',
          'status': 'status',
        };
        
        // Пока бэкенд поддерживает только created_at, updated_at, message_count
        // Используем только поддерживаемые поля
        const backendSortField = sortFieldMap[sortField];
        if (['created_at', 'updated_at', 'message_count'].includes(backendSortField)) {
          params.append('sortBy', backendSortField);
          params.append('sortOrder', sortOrder);
        }
      }

      const response = await fetch(`/api/admin/chats?${params.toString()}`);
      const result = await response.json();

      console.log('📥 [Admin Chats] Ответ от API:', {
        success: result.success,
        hasData: !!result.data,
        chatsCount: result.data?.chats?.length || 0,
        fullResponse: result,
      });

      if (!response.ok) {
        const errorMsg = result.error || result.message || 'Ошибка загрузки чатов';
        console.error('❌ [Admin Chats] Ошибка API:', errorMsg);
        setError(errorMsg);
        setChats([]);
        return;
      }
      
      setError(null);

      if (result.data?.success === false || result.data?.message) {
        const errorMsg = result.data.message || 'Ошибка сервера';
        console.error('❌ [Admin Chats] Ошибка от сервера:', errorMsg);
        setError(errorMsg);
        setChats([]);
        return;
      }

      if (result.success && result.data?.chats) {
        setChats(result.data.chats);
        setTotalPages(result.data.pagination?.totalPages || 1);
        setTotalItems(result.data.pagination?.total || 0);
        console.log('✅ [Admin Chats] Чаты загружены:', result.data.chats.length);
      } else if (result.data?.chats) {
        setChats(result.data.chats);
        setTotalPages(result.data.pagination?.totalPages || 1);
        setTotalItems(result.data.pagination?.total || 0);
      } else {
        console.warn('⚠️ [Admin Chats] Неожиданная структура ответа:', result);
        setChats([]);
      }
    } catch (error) {
      console.error('❌ [Admin Chats] Критическая ошибка:', error);
      setError('Не удалось загрузить чаты. Проверьте подключение к серверу.');
      setChats([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Добавляем таймаут для запроса статистики (5 секунд)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('/api/admin/chats/stats', {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.warn('⚠️ [Admin Chats] Ошибка загрузки статистики:', response.status);
        return;
      }

      const result = await response.json();
      if (result.data) {
        setStats(result.data);
      } else if (result.success && result) {
        // Если данные на верхнем уровне
        setStats(result);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn('⚠️ [Admin Chats] Таймаут загрузки статистики');
      } else {
        console.error('❌ [Admin Chats] Ошибка загрузки статистики:', error);
      }
      // Не показываем ошибку пользователю, просто не обновляем статистику
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setPage(1); // Сбрасываем на первую страницу при сортировке
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

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortOrder === 'asc' ? (
      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  // Генерируем массив страниц для пагинации
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <DashboardLayout
      userRole="admin"
      userName="Aidar"
      userEmail="aidar1910main@gmail.com"
    >
      <Breadcrumbs items={[
        { label: 'Главная', path: '/' },
        { label: 'Панель управления', path: '/admin/dashboard' },
        { label: 'Чаты' }
      ]} />

      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-light tracking-wide text-gray-900 dark:text-gray-100 mb-2">
          Чаты с ботом
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-light">
          Просмотр и управление всеми чатами
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
        {!stats ? (
          <>
            {[...Array(4)].map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-lg sm:rounded-xl p-3 sm:p-5 border border-gray-200/50 dark:border-gray-800/50 animate-pulse"
              >
                <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 sm:w-24 mb-2 sm:mb-3"></div>
                <div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded w-12 sm:w-16"></div>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 backdrop-blur-xl rounded-lg sm:rounded-xl p-3 sm:p-5 border border-blue-200/50 dark:border-blue-800/50 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-light mb-1">Всего чатов</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-light text-gray-900 dark:text-gray-100">{stats.total || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 backdrop-blur-xl rounded-lg sm:rounded-xl p-3 sm:p-5 border border-green-200/50 dark:border-green-800/50 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-light mb-1">С телефоном</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-light text-green-600 dark:text-green-400">{stats.withContact?.withPhone || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 backdrop-blur-xl rounded-lg sm:rounded-xl p-3 sm:p-5 border border-purple-200/50 dark:border-purple-800/50 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-light mb-1">С именем</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-light text-purple-600 dark:text-purple-400">{stats.withContact?.withName || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10 backdrop-blur-xl rounded-lg sm:rounded-xl p-3 sm:p-5 border border-orange-200/50 dark:border-orange-800/50 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-light mb-1">Новых</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-light text-orange-600 dark:text-orange-400">{stats.byStatus?.new || 0}</p>
            </div>
          </>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl p-5 mb-6 border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Статус
            </label>
            <select
              value={filters.status}
              onChange={(e) => {
                setFilters({ ...filters, status: e.target.value });
                setPage(1);
              }}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-light focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Все статусы</option>
              <option value="new">Новый</option>
              <option value="contacted">Связались</option>
              <option value="in_progress">В работе</option>
              <option value="completed">Завершен</option>
              <option value="archived">Архив</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Поиск
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Имя, телефон, проект..."
                value={filters.search}
                onChange={(e) => {
                  setFilters({ ...filters, search: e.target.value });
                  setPage(1);
                }}
                className="w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-light focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.hasPhone}
                onChange={(e) => {
                  setFilters({ ...filters, hasPhone: e.target.checked });
                  setPage(1);
                }}
                className="w-5 h-5 rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                С телефоном
              </span>
            </label>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.hasName}
                onChange={(e) => {
                  setFilters({ ...filters, hasName: e.target.checked });
                  setPage(1);
                }}
                className="w-5 h-5 rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                С именем
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
          <p className="text-red-800 dark:text-red-300 font-light">{error}</p>
          <p className="text-sm text-red-600 dark:text-red-400 font-light mt-2">
            Убедитесь, что бэкенд сервер доступен и переменная окружения BACKEND_API_URL настроена корректно
          </p>
        </div>
      )}

      {/* Chats Table */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={`skeleton-${index}`} className="animate-pulse">
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-16">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-gray-600 dark:text-gray-400 font-light mb-2 text-lg">Чаты не найдены</p>
            {filters.status || filters.search || filters.hasPhone || filters.hasName ? (
              <p className="text-sm text-gray-500 dark:text-gray-500 font-light">
                Попробуйте изменить фильтры
              </p>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-500 font-light">
                Чаты появятся здесь после сохранения диалогов с ботом
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th
                      className="px-4 xl:px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-2">
                        Имя
                        <SortIcon field="name" />
                      </div>
                    </th>
                    <th
                      className="px-4 xl:px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => handleSort('phone')}
                    >
                      <div className="flex items-center gap-2">
                        Телефон
                        <SortIcon field="phone" />
                      </div>
                    </th>
                    <th className="px-4 xl:px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Проект
                    </th>
                    <th
                      className="px-4 xl:px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-2">
                        Статус
                        <SortIcon field="status" />
                      </div>
                    </th>
                    <th className="px-4 xl:px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Последнее сообщение
                    </th>
                    <th
                      className="px-4 xl:px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => handleSort('messageCount')}
                    >
                      <div className="flex items-center gap-2">
                        Сообщений
                        <SortIcon field="messageCount" />
                      </div>
                    </th>
                    <th
                      className="px-4 xl:px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center gap-2">
                        Дата
                        <SortIcon field="createdAt" />
                      </div>
                    </th>
                    <th className="px-4 xl:px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Теги
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {chats.map((chat) => (
                    <tr
                      key={chat.id}
                      onClick={() => router.push(`/admin/chats/${chat.id}`)}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {chat.name || (
                            <span className="text-gray-400 dark:text-gray-500 italic">Без имени</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                        {chat.phone ? (
                          <div className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                            {chat.phone}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
                        )}
                      </td>
                      <td className="px-4 xl:px-6 py-4">
                        {chat.projectType ? (
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {chat.projectType}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
                        )}
                      </td>
                      <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(chat.status)}`}>
                          {getStatusText(chat.status)}
                        </span>
                      </td>
                      <td className="px-4 xl:px-6 py-4">
                        {chat.lastMessage ? (
                          <div className="max-w-xs">
                            <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                              <span className={chat.lastMessage.sender === 'user' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-500'}>
                                {chat.lastMessage.sender === 'user' ? '👤' : '🤖'}
                              </span>{' '}
                              {chat.lastMessage.text}
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
                        )}
                      </td>
                      <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {chat.messageCount}
                        </span>
                      </td>
                      <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDateShort(chat.createdAt)}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {formatDate(chat.createdAt).split(',')[0]}
                        </div>
                      </td>
                      <td className="px-4 xl:px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {chat.hasName && (
                            <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                              Имя
                            </span>
                          )}
                          {chat.phone && (
                            <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">
                              Телефон
                            </span>
                          )}
                          {chat.hasPriceObjection && (
                            <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full">
                              Возражение
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4 p-4">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => router.push(`/admin/chats/${chat.id}`)}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">
                        {chat.name || <span className="text-gray-400 dark:text-gray-500 italic">Без имени</span>}
                      </h3>
                      {chat.phone && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-mono mb-2">
                          {chat.phone}
                        </p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(chat.status)}`}>
                      {getStatusText(chat.status)}
                    </span>
                  </div>

                  {chat.projectType && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Проект: {chat.projectType}
                    </p>
                  )}

                  {chat.lastMessage && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                      <span className={chat.lastMessage.sender === 'user' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-500'}>
                        {chat.lastMessage.sender === 'user' ? '👤' : '🤖'}
                      </span>{' '}
                      {chat.lastMessage.text}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>{chat.messageCount} сообщений</span>
                      <span>{formatDateShort(chat.createdAt)}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {chat.hasName && (
                        <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                          Имя
                        </span>
                      )}
                      {chat.phone && (
                        <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">
                          Телефон
                        </span>
                      )}
                      {chat.hasPriceObjection && (
                        <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full">
                          Возражение
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
                    Показано {((page - 1) * 20) + 1} - {Math.min(page * 20, totalItems)} из {totalItems}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-light disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {getPageNumbers().map((pageNum, index) => (
                        pageNum === '...' ? (
                          <span key={`ellipsis-${index}`} className="px-2 text-gray-400 dark:text-gray-500">
                            ...
                          </span>
                        ) : (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum as number)}
                            className={`px-4 py-2 rounded-lg font-light transition-colors ${
                              page === pageNum
                                ? 'bg-blue-600 text-white dark:bg-blue-500'
                                : 'border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      ))}
                    </div>

                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-light disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
