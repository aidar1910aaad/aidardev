'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import Breadcrumbs from '@/app/components/dashboard/Breadcrumbs';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats] = useState({
    newProjects: 3,
    noResponse48h: 2,
    pendingReview: 5,
    atRisk: 2,
    totalProjects: 12,
  });

  const [recentProjects] = useState([
    {
      id: 1,
      title: 'Интернет-магазин',
      client: 'Иван Иванов',
      status: 'active',
      deadline: '2024-02-15',
      daysLeft: 5,
    },
    {
      id: 2,
      title: 'Корпоративный сайт',
      client: 'Мария Петрова',
      status: 'review',
      deadline: '2024-02-20',
      daysLeft: 10,
    },
    {
      id: 3,
      title: 'Мобильное приложение',
      client: 'Алексей Сидоров',
      status: 'pending',
      deadline: null,
      daysLeft: null,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'review':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'pending':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
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
      default:
        return status;
    }
  };

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
        { label: 'Панель управления' }
      ]} />
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-light tracking-wide text-gray-900 dark:text-gray-100 mb-2">
            Панель управления
          </h2>
          <p className="text-gray-600 dark:text-gray-400 font-light">
            Обзор всех проектов и задач
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
               onClick={() => router.push('/admin/projects?filter=pending')}>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-light mb-2">
              Новые проекты
            </p>
            <p className="text-3xl font-light text-blue-600 dark:text-blue-400">
              {stats.newProjects}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 font-light mt-2">
              Требуют связи
            </p>
          </div>

          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
               onClick={() => router.push('/admin/projects?filter=no-response')}>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-light mb-2">
              Без ответа &gt;48ч
            </p>
            <p className="text-3xl font-light text-red-600 dark:text-red-400">
              {stats.noResponse48h}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 font-light mt-2">
              Срочно
            </p>
          </div>

          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
               onClick={() => router.push('/admin/projects?filter=review')}>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-light mb-2">
              Этапы на проверке
            </p>
            <p className="text-3xl font-light text-orange-600 dark:text-orange-400">
              {stats.pendingReview}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 font-light mt-2">
              Ожидают клиента
            </p>
          </div>

          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
               onClick={() => router.push('/admin/projects?filter=at-risk')}>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-light mb-2">
              С риском по срокам
            </p>
            <p className="text-3xl font-light text-red-600 dark:text-red-400">
              {stats.atRisk}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 font-light mt-2">
              Внимание
            </p>
          </div>

          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-light mb-2">
              Всего проектов
            </p>
            <p className="text-3xl font-light text-gray-900 dark:text-gray-100">
              {stats.totalProjects}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 font-light mt-2">
              Всего
            </p>
          </div>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Projects */}
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-light text-gray-900 dark:text-gray-100">
                Последние проекты
              </h3>
              <button
                onClick={() => router.push('/admin/projects')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-light"
              >
                Все проекты →
              </button>
            </div>

            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                  onClick={() => router.push(`/admin/projects/${project.id}`)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-light text-gray-900 dark:text-gray-100">
                        {project.title}
                      </h4>
                      <span className={`px-3 py-1 rounded-lg text-xs font-light ${getStatusColor(project.status)}`}>
                        {getStatusText(project.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-light">
                      Клиент: {project.client}
                    </p>
                  </div>

                  <div className="text-right">
                    {project.deadline && (
                      <p className={`text-sm font-light ${
                        project.daysLeft && project.daysLeft <= 7
                          ? 'text-orange-600 dark:text-orange-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {project.daysLeft} дней до дедлайна
                      </p>
                    )}
                    {!project.deadline && (
                      <p className="text-sm text-gray-500 dark:text-gray-500 font-light">
                        Дедлайн не установлен
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions & Alerts */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-6">
              <h3 className="text-xl font-light text-gray-900 dark:text-gray-100 mb-4">
                Быстрые действия
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/admin/projects?filter=pending')}
                  className="w-full flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📋</span>
                    <span className="text-sm font-light text-gray-900 dark:text-gray-100">
                      Новые проекты ({stats.newProjects})
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-500 font-light">→</span>
                </button>
                <button
                  onClick={() => router.push('/admin/projects?filter=review')}
                  className="w-full flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">⏳</span>
                    <span className="text-sm font-light text-gray-900 dark:text-gray-100">
                      Этапы на проверке ({stats.pendingReview})
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-500 font-light">→</span>
                </button>
                <button
                  onClick={() => router.push('/admin/projects?filter=at-risk')}
                  className="w-full flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">⚠️</span>
                    <span className="text-sm font-light text-gray-900 dark:text-gray-100">
                      С риском по срокам ({stats.atRisk})
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-500 font-light">→</span>
                </button>
                <button
                  onClick={() => router.push('/admin/users')}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">👥</span>
                    <span className="text-sm font-light text-gray-900 dark:text-gray-100">
                      Управление пользователями
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-500 font-light">→</span>
                </button>
              </div>
            </div>

            {/* Alerts */}
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-6">
              <h3 className="text-xl font-light text-gray-900 dark:text-gray-100 mb-4">
                Требуют внимания
              </h3>
              <div className="space-y-3">
                {stats.noResponse48h > 0 && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                    <p className="text-sm font-light text-red-800 dark:text-red-300">
                      ⚠️ {stats.noResponse48h} проект(ов) без ответа более 48 часов
                    </p>
                    <button
                      onClick={() => router.push('/admin/projects?filter=no-response')}
                      className="mt-2 text-xs text-red-600 dark:text-red-400 hover:underline font-light"
                    >
                      Посмотреть →
                    </button>
                  </div>
                )}
                {stats.atRisk > 0 && (
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                    <p className="text-sm font-light text-orange-800 dark:text-orange-300">
                      ⏰ {stats.atRisk} проект(ов) с риском по срокам
                    </p>
                    <button
                      onClick={() => router.push('/admin/projects?filter=at-risk')}
                      className="mt-2 text-xs text-orange-600 dark:text-orange-400 hover:underline font-light"
                    >
                      Посмотреть →
                    </button>
                  </div>
                )}
                {stats.noResponse48h === 0 && stats.atRisk === 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-light">
                    ✅ Все проекты в порядке
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
    </DashboardLayout>
  );
}

