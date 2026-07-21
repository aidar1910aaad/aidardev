'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import Breadcrumbs from '@/app/components/dashboard/Breadcrumbs';

export default function AdminUsersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const [users] = useState([
    {
      id: 1,
      name: 'Иван Иванов',
      email: 'ivan@example.com',
      phone: '+7 700 123 45 67',
      role: 'client',
      companyName: 'ООО "Компания"',
      projectsCount: 3,
      createdAt: '2024-01-10',
      lastActivity: '2 дня назад',
    },
    {
      id: 2,
      name: 'Мария Петрова',
      email: 'maria@example.com',
      phone: '+7 700 234 56 78',
      role: 'client',
      companyName: null,
      projectsCount: 1,
      createdAt: '2024-01-15',
      lastActivity: '1 день назад',
    },
    {
      id: 3,
      name: 'Алексей Сидоров',
      email: 'alex@example.com',
      phone: '+7 700 345 67 89',
      role: 'client',
      companyName: 'ИП Сидоров',
      projectsCount: 2,
      createdAt: '2024-01-20',
      lastActivity: '3 дня назад',
    },
    {
      id: 4,
      name: 'Aidar',
      email: 'aidar@example.com',
      phone: '+7 700 111 22 33',
      role: 'admin',
      companyName: null,
      projectsCount: 0,
      createdAt: '2024-01-01',
      lastActivity: 'Сегодня',
    },
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.phone && user.phone.includes(searchQuery));
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

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
        { label: 'Пользователи' }
      ]} />

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-light tracking-wide text-gray-900 dark:text-gray-100 mb-2">
              Пользователи
            </h2>
            <p className="text-gray-600 dark:text-gray-400 font-light">
              Управление пользователями системы
            </p>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-light">
            Всего: {filteredUsers.length} из {users.length}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по имени, email, телефону..."
              className="w-full px-4 py-2 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 font-light"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-light"
          >
            <option value="all">Все роли</option>
            <option value="client">Клиенты</option>
            <option value="admin">Администраторы</option>
          </select>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-orange-600 flex items-center justify-center text-white font-light text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-light text-gray-900 dark:text-gray-100">
                    {user.name}
                  </h3>
                  {user.companyName && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 font-light">
                      {user.companyName}
                    </p>
                  )}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-lg text-xs font-light ${
                user.role === 'admin'
                  ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
              }`}>
                {user.role === 'admin' ? 'Админ' : 'Клиент'}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-light">
                <span>📧</span>
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-light">
                  <span>📱</span>
                  <span>{user.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-light">
                <span>📁</span>
                <span>Проектов: {user.projectsCount}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-500 font-light">
                <p>Создан: {new Date(user.createdAt).toLocaleDateString('ru-RU')}</p>
                <p className="mt-1">Активность: {user.lastActivity}</p>
              </div>
              <button
                onClick={() => {
                  if (user.role === 'client') {
                    // Переход к проектам клиента
                    router.push(`/admin/projects?client=${user.id}`);
                  }
                }}
                className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg text-sm font-light hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-300"
              >
                {user.role === 'client' ? 'Проекты' : 'Настройки'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 font-light">
            Пользователи не найдены
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}

