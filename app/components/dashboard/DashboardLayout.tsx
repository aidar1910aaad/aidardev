'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import UserProfile from './UserProfile';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: 'client' | 'admin';
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  userCompanyName?: string;
  userTelegram?: string;
  userCreatedAt?: string;
}

export default function DashboardLayout({ 
  children, 
  userRole = 'client',
  userName = 'Пользователь',
  userEmail,
  userPhone,
  userCompanyName,
  userTelegram,
  userCreatedAt
}: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Состояние для мобильного меню
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Состояние для сворачивания меню (начинаем с false для избежания гидратации)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Загружаем состояние из localStorage только на клиенте
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved === 'true') {
      setSidebarCollapsed(true);
    }
  }, []);

  // Сохраняем состояние в localStorage
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('sidebarCollapsed', sidebarCollapsed.toString());
    }
  }, [sidebarCollapsed, isClient]);

  const clientMenuItems = [
    { id: 'dashboard', label: 'Мои проекты', path: '/dashboard', icon: '📊' },
    { id: 'new-project', label: 'Создать проект', path: '/dashboard/projects/new', icon: '➕' },
  ];

  const adminMenuItems = [
    { id: 'dashboard', label: 'Панель управления', path: '/admin/dashboard', icon: '📊' },
    { id: 'chats', label: 'Чаты', path: '/admin/chats', icon: '💬' },
    { id: 'projects', label: 'Все проекты', path: '/admin/projects', icon: '📁' },
    { id: 'blog', label: 'Блог', path: '/admin/blog', icon: '📝' },
    { id: 'users', label: 'Пользователи', path: '/admin/users', icon: '👥' },
    { id: 'templates', label: 'Шаблоны этапов', path: '/admin/templates', icon: '📋' },
    { id: 'plan', label: 'Маркетинг-план', path: '/admin/plan', icon: '🎯' },
    { id: 'analytics', label: 'Аналитика', path: '/admin/analytics', icon: '📈' },
    { id: 'settings', label: 'Настройки', path: '/admin/settings', icon: '⚙️' },
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : clientMenuItems;

  const isActive = (path: string) => {
    if (path === '/dashboard' || path === '/admin/dashboard') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-orange-50/20 dark:from-gray-950 dark:via-blue-950/10 dark:to-orange-950/10">
      {/* Top Header */}
      <header className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-40 h-16">
        <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileSidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => router.push(userRole === 'admin' ? '/admin/dashboard' : '/dashboard')}
            >
              <h1 className="text-xl font-light tracking-wide">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-900 to-orange-900 dark:from-white dark:via-blue-300 dark:to-orange-300">
                  Aidar
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-orange-600 dark:from-blue-400 dark:to-orange-400">
                  .dev
                </span>
              </h1>
              {userRole === 'admin' && (
                <span className="px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-lg font-light">
                  Админ
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <UserProfile
              user={{
                name: userName,
                email: userEmail,
                phone: userPhone,
                role: userRole,
                companyName: userCompanyName,
                telegram: userTelegram,
                createdAt: userCreatedAt,
              }}
            />

            <button
              onClick={() => router.push('/')}
              className="px-3 sm:px-4 py-2 text-sm font-light text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <span className="hidden sm:inline">На главную</span>
              <span className="sm:hidden">🏠</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Sidebar */}
        <aside
          className={`
            fixed
            left-0 top-16 bottom-0 lg:top-16
            z-30
            bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl
            border-r border-gray-200/50 dark:border-gray-800/50
            flex flex-col
            h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)]
            transition-[width] duration-300 ease-out
            ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            ${sidebarCollapsed ? 'w-24' : 'w-72 lg:w-80'}
          `}
        >
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden min-h-0 pt-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  router.push(item.path);
                  setMobileSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl
                  font-light text-sm
                  transition-colors duration-200
                  group relative
                  ${sidebarCollapsed ? 'justify-center px-2' : 'justify-start'}
                  ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-blue-600 to-orange-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                {!sidebarCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
                
                {/* Tooltip для свернутого состояния */}
                {sidebarCollapsed && isClient && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-800"></div>
                  </div>
                )}
              </button>
            ))}
          </nav>

          {/* Collapse Button (только для десктопа) */}
          <div className="hidden lg:block p-4 border-t border-gray-200/50 dark:border-gray-800/50 flex-shrink-0">
            <button
              onClick={toggleSidebar}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl
                text-gray-600 dark:text-gray-400
                hover:bg-gray-100 dark:hover:bg-gray-800
                transition-colors duration-200
                ${sidebarCollapsed ? 'justify-center' : 'justify-start'}
              `}
              aria-label={sidebarCollapsed ? 'Развернуть меню' : 'Свернуть меню'}
            >
              <svg 
                className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
              {!sidebarCollapsed && (
                <span className="text-sm font-light whitespace-nowrap">Свернуть</span>
              )}
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity duration-300"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-24' : 'lg:ml-80'}`}>
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
