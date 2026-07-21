'use client';

import { useState } from 'react';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import Breadcrumbs from '@/app/components/dashboard/Breadcrumbs';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: true,
    smsNotifications: false,
    autoBackup: true,
    darkMode: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
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
        { label: 'Настройки' }
      ]} />

      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-light tracking-wide text-gray-900 dark:text-gray-100 mb-2">
          Настройки
        </h2>
        <p className="text-gray-600 dark:text-gray-400 font-light">
          Управление настройками системы
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-6">
          <h3 className="text-xl font-light text-gray-900 dark:text-gray-100 mb-6">
            Общие настройки
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div>
                <p className="text-sm font-light text-gray-900 dark:text-gray-100 mb-1">
                  Уведомления
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 font-light">
                  Включить системные уведомления
                </p>
              </div>
              <button
                onClick={() => handleToggle('notifications')}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                  settings.notifications
                    ? 'bg-blue-600 dark:bg-blue-500'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                    settings.notifications ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div>
                <p className="text-sm font-light text-gray-900 dark:text-gray-100 mb-1">
                  Email уведомления
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 font-light">
                  Получать уведомления на email
                </p>
              </div>
              <button
                onClick={() => handleToggle('emailNotifications')}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                  settings.emailNotifications
                    ? 'bg-blue-600 dark:bg-blue-500'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div>
                <p className="text-sm font-light text-gray-900 dark:text-gray-100 mb-1">
                  SMS уведомления
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 font-light">
                  Получать уведомления по SMS
                </p>
              </div>
              <button
                onClick={() => handleToggle('smsNotifications')}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                  settings.smsNotifications
                    ? 'bg-blue-600 dark:bg-blue-500'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                    settings.smsNotifications ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-6">
          <h3 className="text-xl font-light text-gray-900 dark:text-gray-100 mb-6">
            Системные настройки
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div>
                <p className="text-sm font-light text-gray-900 dark:text-gray-100 mb-1">
                  Автоматическое резервное копирование
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 font-light">
                  Создавать резервные копии ежедневно
                </p>
              </div>
              <button
                onClick={() => handleToggle('autoBackup')}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                  settings.autoBackup
                    ? 'bg-blue-600 dark:bg-blue-500'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                    settings.autoBackup ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-6">
          <h3 className="text-xl font-light text-gray-900 dark:text-gray-100 mb-6">
            Внешний вид
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div>
                <p className="text-sm font-light text-gray-900 dark:text-gray-100 mb-1">
                  Темная тема
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 font-light">
                  Переключить темную тему
                </p>
              </div>
              <button
                onClick={() => handleToggle('darkMode')}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                  settings.darkMode
                    ? 'bg-blue-600 dark:bg-blue-500'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                    settings.darkMode ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => alert('Настройки сохранены')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white rounded-xl font-light tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Сохранить изменения
          </button>
          <button
            onClick={() => alert('Настройки сброшены')}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-light tracking-wide hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
          >
            Сбросить
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}






