'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import Breadcrumbs from '@/app/components/dashboard/Breadcrumbs';

export default function ClientDashboard() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projects] = useState([
    {
      id: 1,
      title: 'Интернет-магазин',
      status: 'active',
      currentStage: 'Разработка',
      lastUpdate: '2 дня назад',
      requiresAction: true,
      type: 'ecommerce',
    },
    {
      id: 2,
      title: 'Корпоративный сайт',
      status: 'review',
      currentStage: 'Дизайн на проверке',
      lastUpdate: '5 дней назад',
      requiresAction: true,
      type: 'site',
    },
    {
      id: 3,
      title: 'Мобильное приложение',
      status: 'pending',
      currentStage: 'Ожидает связи',
      lastUpdate: '1 неделя назад',
      requiresAction: false,
      type: 'mobile',
    },
    {
      id: 4,
      title: 'CRM система',
      status: 'completed',
      currentStage: 'Завершен',
      lastUpdate: '2 недели назад',
      requiresAction: false,
      type: 'crm',
    },
    {
      id: 5,
      title: 'Telegram бот',
      status: 'paused',
      currentStage: 'Ожидание клиента',
      lastUpdate: '3 дня назад',
      requiresAction: false,
      type: 'automation',
    },
  ]);

  const filteredProjects = statusFilter === 'all' 
    ? projects 
    : projects.filter(p => p.status === statusFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'review':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'pending':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
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
      case 'completed':
        return 'Завершен';
      default:
        return status;
    }
  };

  return (
    <DashboardLayout 
      userRole="client" 
      userName="Иван Иванов"
      userEmail="ivan@example.com"
      userPhone="+7 700 123 45 67"
      userCompanyName="ООО Компания"
      userCreatedAt="2024-01-10"
    >
      <Breadcrumbs items={[
        { label: 'Главная', path: '/' },
        { label: 'Мои проекты' }
      ]} />
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-light tracking-wide text-gray-900 dark:text-gray-100 mb-2">
            Мои проекты
          </h2>
          <p className="text-gray-600 dark:text-gray-400 font-light">
            Управляйте своими проектами и отслеживайте прогресс
          </p>
        </div>

        {/* Action Required Banner */}
        {projects.some(p => p.requiresAction) && (
          <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
            <p className="text-sm text-orange-800 dark:text-orange-300 font-light">
              ⚠️ У вас есть проекты, требующие вашего внимания
            </p>
          </div>
        )}

        {/* Filters and Create Button */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-xl text-sm font-light transition-all duration-300 ${
                statusFilter === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-orange-600 text-white shadow-lg'
                  : 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Все ({projects.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-xl text-sm font-light transition-all duration-300 ${
                statusFilter === 'pending'
                  ? 'bg-gradient-to-r from-blue-600 to-orange-600 text-white shadow-lg'
                  : 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Ожидает ({projects.filter(p => p.status === 'pending').length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-4 py-2 rounded-xl text-sm font-light transition-all duration-300 ${
                statusFilter === 'active'
                  ? 'bg-gradient-to-r from-blue-600 to-orange-600 text-white shadow-lg'
                  : 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              В работе ({projects.filter(p => p.status === 'active').length})
            </button>
            <button
              onClick={() => setStatusFilter('review')}
              className={`px-4 py-2 rounded-xl text-sm font-light transition-all duration-300 ${
                statusFilter === 'review'
                  ? 'bg-gradient-to-r from-blue-600 to-orange-600 text-white shadow-lg'
                  : 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              На проверке ({projects.filter(p => p.status === 'review').length})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-4 py-2 rounded-xl text-sm font-light transition-all duration-300 ${
                statusFilter === 'completed'
                  ? 'bg-gradient-to-r from-blue-600 to-orange-600 text-white shadow-lg'
                  : 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Завершенные ({projects.filter(p => p.status === 'completed').length})
            </button>
          </div>

          {/* Create Project Button */}
          <button
            onClick={() => router.push('/dashboard/projects/new')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white rounded-xl font-light tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
          >
            + Создать новый проект
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => router.push(`/dashboard/projects/${project.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-light text-gray-900 dark:text-gray-100">
                  {project.title}
                </h3>
                {project.requiresAction && (
                  <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 rounded-lg font-light">
                    Требуется ответ
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-lg text-xs font-light ${getStatusColor(project.status)}`}>
                    {getStatusText(project.status)}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-light mb-1">
                    Текущий этап:
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-100 font-light">
                    {project.currentStage}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 font-light">
                    Обновлено {project.lastUpdate}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 font-light mb-4">
              У вас пока нет проектов
            </p>
            <button
              onClick={() => router.push('/dashboard/projects/new')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white rounded-xl font-light tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Создать первый проект
            </button>
          </div>
        )}
    </DashboardLayout>
  );
}

