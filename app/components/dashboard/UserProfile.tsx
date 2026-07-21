'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserProfileProps {
  user: {
    name: string;
    email?: string;
    phone?: string;
    role: 'client' | 'admin';
    companyName?: string;
    telegram?: string;
    createdAt?: string;
  };
}

export default function UserProfile({ user }: UserProfileProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // Симуляция выхода
    router.push('/login');
  };

  return (
    <>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-300"
      >
        <div className="text-right">
          <p className="text-sm font-light text-gray-900 dark:text-gray-100">{user.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 font-light">
            {user.role === 'admin' ? 'Администратор' : 'Клиент'}
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-orange-600 flex items-center justify-center text-white font-light">
          {user.name.charAt(0).toUpperCase()}
        </div>
      </button>

      {/* Mobile Profile Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="sm:hidden w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-orange-600 flex items-center justify-center text-white font-light"
      >
        {user.name.charAt(0).toUpperCase()}
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-light tracking-wide text-gray-900 dark:text-gray-100">
                  Профиль
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                >
                  <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Avatar and Name */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-orange-600 flex items-center justify-center text-white font-light text-2xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-light text-gray-900 dark:text-gray-100">
                    {user.name}
                  </h3>
                  <span className={`inline-block px-3 py-1 rounded-lg text-xs font-light mt-1 ${
                    user.role === 'admin'
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                  }`}>
                    {user.role === 'admin' ? 'Администратор' : 'Клиент'}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-4">
                  Личная информация
                </h3>
                <div className="space-y-3">
                  {user.email && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <span className="text-xl">📧</span>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-500 font-light">Email</p>
                        <p className="text-sm font-light text-gray-900 dark:text-gray-100">{user.email}</p>
                      </div>
                    </div>
                  )}

                  {user.phone && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <span className="text-xl">📱</span>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-500 font-light">Телефон</p>
                        <p className="text-sm font-light text-gray-900 dark:text-gray-100">{user.phone}</p>
                      </div>
                    </div>
                  )}

                  {user.telegram && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <span className="text-xl">✈️</span>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-500 font-light">Telegram</p>
                        <p className="text-sm font-light text-gray-900 dark:text-gray-100">{user.telegram}</p>
                      </div>
                    </div>
                  )}

                  {user.companyName && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <span className="text-xl">🏢</span>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-500 font-light">Компания</p>
                        <p className="text-sm font-light text-gray-900 dark:text-gray-100">{user.companyName}</p>
                      </div>
                    </div>
                  )}

                  {user.createdAt && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <span className="text-xl">📅</span>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-500 font-light">Дата регистрации</p>
                        <p className="text-sm font-light text-gray-900 dark:text-gray-100">
                          {new Date(user.createdAt).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Specific Info */}
              {user.role === 'admin' && (
                <div>
                  <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-4">
                    Административная информация
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                      <span className="text-xl">🔐</span>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-500 font-light">Уровень доступа</p>
                        <p className="text-sm font-light text-gray-900 dark:text-gray-100">Полный доступ</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                      <span className="text-xl">⚙️</span>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-500 font-light">Права</p>
                        <p className="text-sm font-light text-gray-900 dark:text-gray-100">
                          Управление проектами, пользователями, настройками
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Client Specific Info */}
              {user.role === 'client' && (
                <div>
                  <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-4">
                    Статистика
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-500 font-light">Проектов</p>
                      <p className="text-2xl font-light text-gray-900 dark:text-gray-100 mt-1">-</p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-500 font-light">Завершено</p>
                      <p className="text-2xl font-light text-gray-900 dark:text-gray-100 mt-1">-</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    // Переход на страницу настроек (будет реализовано)
                    alert('Настройки профиля - будет реализовано');
                  }}
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-light hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  ⚙️ Настройки профиля
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-xl font-light hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-300"
                >
                  🚪 Выйти
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}







