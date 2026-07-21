'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import Breadcrumbs from '@/app/components/dashboard/Breadcrumbs';

function ProjectsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'all';
  
  const [statusFilter, setStatusFilter] = useState<string>(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [clientFilter, setClientFilter] = useState<string>('all');

  const [projects] = useState([
    {
      id: 1,
      title: 'Интернет-магазин',
      client: 'Иван Иванов',
      clientEmail: 'ivan@example.com',
      status: 'active',
      deadline: '2024-02-15',
      daysLeft: 5,
      createdAt: '2024-01-15',
      lastActivity: '2 дня назад',
      requiresAction: false,
    },
    {
      id: 2,
      title: 'Корпоративный сайт',
      client: 'Мария Петрова',
      clientEmail: 'maria@example.com',
      status: 'review',
      deadline: '2024-02-20',
      daysLeft: 10,
      createdAt: '2024-01-10',
      lastActivity: '1 день назад',
      requiresAction: true,
    },
    {
      id: 3,
      title: 'Мобильное приложение',
      client: 'Алексей Сидоров',
      clientEmail: 'alex@example.com',
      status: 'pending',
      deadline: null,
      daysLeft: null,
      createdAt: '2024-01-20',
      lastActivity: '3 дня назад',
      requiresAction: true,
    },
    {
      id: 4,
      title: 'CRM система',
      client: 'Иван Иванов',
      clientEmail: 'ivan@example.com',
      status: 'active',
      deadline: '2024-03-01',
      daysLeft: 20,
      createdAt: '2024-01-05',
      lastActivity: '5 часов назад',
      requiresAction: false,
    },
    {
      id: 5,
      title: 'Telegram бот',
      client: 'Ольга Смирнова',
      clientEmail: 'olga@example.com',
      status: 'paused',
      deadline: '2024-02-10',
      daysLeft: -5,
      createdAt: '2024-01-12',
      lastActivity: '1 неделя назад',
      requiresAction: false,
    },
    {
      id: 6,
      title: 'Landing page',
      client: 'Петр Козлов',
      clientEmail: 'petr@example.com',
      status: 'pending',
      deadline: null,
      daysLeft: null,
      createdAt: '2024-01-25',
      lastActivity: '2 дня назад',
      requiresAction: true,
    },
  ]);

  const clients = Array.from(new Set(projects.map(p => p.client)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'review':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'pending':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'В работе';
      case 'review':
        return 'На проверке';
      case 'pending':
        return 'Ожидает';
      case 'paused':
        return 'На паузе';
      case 'completed':
        return 'Завершен';
      default:
        return status;
    }
  };

  // Фильтрация проектов
  let filteredProjects = projects;

  // Фильтр по статусу
  if (statusFilter !== 'all') {
    if (statusFilter === 'no-response') {
      // Проекты без ответа > 48 часов (симуляция)
      filteredProjects = filteredProjects.filter(p => 
        p.status === 'pending' && p.requiresAction
      );
    } else if (statusFilter === 'at-risk') {
      // Проекты с риском по срокам (дедлайн близко или просрочен)
      filteredProjects = filteredProjects.filter(p => 
        p.daysLeft !== null && (p.daysLeft <= 7 || p.daysLeft < 0)
      );
    } else {
      filteredProjects = filteredProjects.filter(p => p.status === statusFilter);
    }
  }

  // Фильтр по клиенту
  if (clientFilter !== 'all') {
    filteredProjects = filteredProjects.filter(p => p.client === clientFilter);
  }

  // Поиск
  if (searchQuery) {
    filteredProjects = filteredProjects.filter(p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientEmail.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <DashboardLayout 
      userRole="admin" 
      userName="Aidar"
      userEmail="aidar1910main@gmail.com"
      userPhone="+7 700 111 22 33"
      userTelegram="@aidar_dev"
      userCreatedAt="2024-01-01"
    >
      <Breadcrumbs items={[
        { label: 'Главная', path: '/' },
        { label: 'Панель управления', path: '/admin/dashboard' },
        { label: 'Все проекты' }
      ]} />

      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-light tracking-wide text-gray-900 dark:text-gray-100 mb-2">
              Все проекты
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-light">
              Управление всеми проектами клиентов
            </p>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-light">
            Всего: {filteredProjects.length} из {projects.length}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по названию, клиенту, email..."
              className="w-full px-4 py-2 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 font-light"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-light"
          >
            <option value="all">Все статусы</option>
            <option value="pending">Ожидает</option>
            <option value="active">В работе</option>
            <option value="review">На проверке</option>
            <option value="paused">На паузе</option>
            <option value="completed">Завершен</option>
            <option value="no-response">Без ответа &gt;48ч</option>
            <option value="at-risk">С риском по срокам</option>
          </select>

          {/* Client Filter */}
          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-light"
          >
            <option value="all">Все клиенты</option>
            {clients.map((client) => (
              <option key={client} value={client}>
                {client}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-light text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Проект
                </th>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-light text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Клиент
                </th>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-light text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-light text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Дедлайн
                </th>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-light text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Активность
                </th>
                <th className="px-4 xl:px-6 py-3 text-right text-xs font-light text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/admin/projects/${project.id}`)}
                >
                  <td className="px-4 xl:px-6 py-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-light text-gray-900 dark:text-gray-100">
                          {project.title}
                        </p>
                        {project.requiresAction && (
                          <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 rounded font-light">
                            Требует внимания
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500 font-light mt-1">
                        Создан: {new Date(project.createdAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 xl:px-6 py-4">
                    <div>
                      <p className="text-sm font-light text-gray-900 dark:text-gray-100">
                        {project.client}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 font-light">
                        {project.clientEmail}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 xl:px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-light ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </span>
                  </td>
                  <td className="px-4 xl:px-6 py-4">
                    {project.deadline ? (
                      <div>
                        <p className="text-sm font-light text-gray-900 dark:text-gray-100">
                          {new Date(project.deadline).toLocaleDateString('ru-RU')}
                        </p>
                        {project.daysLeft !== null && (
                          <p className={`text-xs font-light ${
                            project.daysLeft < 0
                              ? 'text-red-600 dark:text-red-400'
                              : project.daysLeft <= 7
                              ? 'text-orange-600 dark:text-orange-400'
                              : 'text-gray-500 dark:text-gray-500'
                          }`}>
                            {project.daysLeft < 0
                              ? `Просрочено на ${Math.abs(project.daysLeft)} дн.`
                              : `${project.daysLeft} дней осталось`}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-500 font-light">
                        Не установлен
                      </p>
                    )}
                  </td>
                  <td className="px-4 xl:px-6 py-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-light">
                      {project.lastActivity}
                    </p>
                  </td>
                  <td className="px-4 xl:px-6 py-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/admin/projects/${project.id}`);
                      }}
                      className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg text-sm font-light hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-300"
                    >
                      Открыть
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4 p-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => router.push(`/admin/projects/${project.id}`)}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
                      {project.title}
                    </h3>
                    {project.requiresAction && (
                      <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 rounded font-light">
                        Требует внимания
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 font-light mb-2">
                    Создан: {new Date(project.createdAt).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-light ${getStatusColor(project.status)}`}>
                  {getStatusText(project.status)}
                </span>
              </div>

              <div className="space-y-2 mb-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Клиент</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {project.client}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {project.clientEmail}
                  </p>
                </div>

                {project.deadline && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Дедлайн</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {new Date(project.deadline).toLocaleDateString('ru-RU')}
                    </p>
                    {project.daysLeft !== null && (
                      <p className={`text-xs font-light mt-1 ${
                        project.daysLeft < 0
                          ? 'text-red-600 dark:text-red-400'
                          : project.daysLeft <= 7
                          ? 'text-orange-600 dark:text-orange-400'
                          : 'text-gray-500 dark:text-gray-500'
                      }`}>
                        {project.daysLeft < 0
                          ? `Просрочено на ${Math.abs(project.daysLeft)} дн.`
                          : `${project.daysLeft} дней осталось`}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Активность</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {project.lastActivity}
                  </p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/admin/projects/${project.id}`);
                }}
                className="w-full px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg text-sm font-light hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-300"
              >
                Открыть проект
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12 px-4">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 dark:text-gray-400 font-light mb-2 text-lg">Проекты не найдены</p>
            {(statusFilter !== 'all' || clientFilter !== 'all' || searchQuery) && (
              <p className="text-sm text-gray-500 dark:text-gray-500 font-light">
                Попробуйте изменить фильтры
              </p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function AdminProjectsPage() {
  return (
    <Suspense fallback={
      <DashboardLayout 
        userRole="admin" 
        userName="Aidar"
        userEmail="aidar1910main@gmail.com"
        userPhone="+7 700 111 22 33"
        userTelegram="@aidar_dev"
        userCreatedAt="2024-01-01"
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600 dark:text-gray-400 font-light">Загрузка...</p>
        </div>
      </DashboardLayout>
    }>
      <ProjectsContent />
    </Suspense>
  );
}

