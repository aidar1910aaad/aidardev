'use client';

import { useState } from 'react';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import Breadcrumbs from '@/app/components/dashboard/Breadcrumbs';

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<string>('month');

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
        { label: 'Аналитика' }
      ]} />

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-light tracking-wide text-gray-900 dark:text-gray-100 mb-2">
              Аналитика
            </h2>
            <p className="text-gray-600 dark:text-gray-400 font-light">
              Статистика и аналитика по проектам и пользователям
            </p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-light"
          >
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
            <option value="quarter">Квартал</option>
            <option value="year">Год</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-light mb-2">
            Всего проектов
          </p>
          <p className="text-3xl font-light text-gray-900 dark:text-gray-100">
            0
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 font-light mt-2">
            За выбранный период
          </p>
        </div>

        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-light mb-2">
            Новых пользователей
          </p>
          <p className="text-3xl font-light text-blue-600 dark:text-blue-400">
            0
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 font-light mt-2">
            За выбранный период
          </p>
        </div>

        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-light mb-2">
            Активных проектов
          </p>
          <p className="text-3xl font-light text-green-600 dark:text-green-400">
            0
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 font-light mt-2">
            В работе сейчас
          </p>
        </div>

        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-light mb-2">
            Завершенных проектов
          </p>
          <p className="text-3xl font-light text-orange-600 dark:text-orange-400">
            0
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 font-light mt-2">
            За выбранный период
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-6">
          <h3 className="text-xl font-light text-gray-900 dark:text-gray-100 mb-4">
            Динамика проектов
          </h3>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400 font-light">
              График будет здесь
            </p>
          </div>
        </div>

        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-6">
          <h3 className="text-xl font-light text-gray-900 dark:text-gray-100 mb-4">
            Распределение по статусам
          </h3>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400 font-light">
              График будет здесь
            </p>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-6">
        <h3 className="text-xl font-light text-gray-900 dark:text-gray-100 mb-4">
          Дополнительная статистика
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-light mb-2">
              Среднее время выполнения
            </p>
            <p className="text-2xl font-light text-gray-900 dark:text-gray-100">
              — дней
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-light mb-2">
              Конверсия
            </p>
            <p className="text-2xl font-light text-gray-900 dark:text-gray-100">
              —%
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-light mb-2">
              Активность пользователей
            </p>
            <p className="text-2xl font-light text-gray-900 dark:text-gray-100">
              —%
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}






