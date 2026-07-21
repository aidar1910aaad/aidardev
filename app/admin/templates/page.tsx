'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import Breadcrumbs from '@/app/components/dashboard/Breadcrumbs';

export default function AdminTemplatesPage() {
  const router = useRouter();
  const [templates] = useState([
    {
      id: 1,
      name: 'Стандартный веб-сайт',
      type: 'site',
      stages: [
        { order: 1, title: 'Консультация и планирование' },
        { order: 2, title: 'Дизайн и прототипирование' },
        { order: 3, title: 'Разработка' },
        { order: 4, title: 'Тестирование' },
        { order: 5, title: 'Запуск' },
      ],
    },
    {
      id: 2,
      name: 'Интернет-магазин',
      type: 'ecommerce',
      stages: [
        { order: 1, title: 'Консультация и планирование' },
        { order: 2, title: 'Дизайн и прототипирование' },
        { order: 3, title: 'Разработка фронтенда' },
        { order: 4, title: 'Разработка бэкенда' },
        { order: 5, title: 'Интеграция платежей' },
        { order: 6, title: 'Тестирование' },
        { order: 7, title: 'Запуск' },
      ],
    },
    {
      id: 3,
      name: 'Мобильное приложение',
      type: 'mobile',
      stages: [
        { order: 1, title: 'Консультация и планирование' },
        { order: 2, title: 'Дизайн UI/UX' },
        { order: 3, title: 'Разработка MVP' },
        { order: 4, title: 'Тестирование' },
        { order: 5, title: 'Публикация' },
      ],
    },
  ]);

  const handleApplyTemplate = (templateId: number, projectId?: number) => {
    // Симуляция применения шаблона
    alert(`Шаблон "${templates.find(t => t.id === templateId)?.name}" будет применен к проекту`);
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
        { label: 'Панель управления', path: '/admin/dashboard' },
        { label: 'Шаблоны этапов' }
      ]} />

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-light tracking-wide text-gray-900 dark:text-gray-100 mb-2">
              Шаблоны этапов
            </h2>
            <p className="text-gray-600 dark:text-gray-400 font-light">
              Управление шаблонами этапов для быстрого создания проектов
            </p>
          </div>
          <button
            onClick={() => alert('Создание нового шаблона - будет реализовано')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white rounded-xl font-light tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            + Создать шаблон
          </button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-light text-gray-900 dark:text-gray-100 mb-1">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-500 font-light">
                  Тип: {template.type}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-light mb-2">
                Этапы ({template.stages.length}):
              </p>
              <div className="space-y-1">
                {template.stages.map((stage) => (
                  <div
                    key={stage.order}
                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 font-light"
                  >
                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 flex items-center justify-center text-xs">
                      {stage.order}
                    </span>
                    <span>{stage.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => handleApplyTemplate(template.id)}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white rounded-lg text-sm font-light transition-all duration-300"
              >
                Применить
              </button>
              <button
                onClick={() => alert('Редактирование шаблона - будет реализовано')}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-light hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
              >
                Редактировать
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

