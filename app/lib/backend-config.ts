/**
 * Централизованная конфигурация для URL бэкенда
 * Используется во всех местах, где нужен доступ к бэкенд API
 */

export const DEV_FRONTEND_PORT = 5000;
export const DEV_BACKEND_PORT = 5001;
export const DEV_BACKEND_URL = `http://localhost:${DEV_BACKEND_PORT}`;

/**
 * Получает URL бэкенда в зависимости от окружения (для серверных компонентов)
 * 
 * Правила:
 * - В development режиме: использует localhost:5001
 * - В production режиме: требует переменную окружения, иначе выбрасывает ошибку
 * 
 * @returns URL бэкенда
 * @throws Error если в production не установлена переменная окружения
 */
export function getBackendUrl(): string {
  // В development режиме всегда используем localhost
  if (process.env.NODE_ENV === 'development') {
    return DEV_BACKEND_URL;
  }

  // В production режиме требуем переменную окружения
  // Проверяем обе возможные переменные (для серверных и клиентских компонентов)
  const backendUrl = 
    process.env.BACKEND_API_URL || 
    process.env.NEXT_PUBLIC_BACKEND_API_URL;

  if (!backendUrl) {
    // В production не должно быть fallback на localhost
    throw new Error(
      'BACKEND_API_URL or NEXT_PUBLIC_BACKEND_API_URL must be set in production environment'
    );
  }

  // Убеждаемся, что URL использует HTTPS в production
  if (process.env.NODE_ENV === 'production' && backendUrl.startsWith('http://')) {
    console.warn(
      '⚠️ WARNING: Backend URL uses HTTP in production. This may cause Mixed Content errors. ' +
      'Consider using HTTPS: ' + backendUrl.replace('http://', 'https://')
    );
  }

  return backendUrl;
}

/**
 * Получает URL бэкенда для клиентских компонентов
 * 
 * Правила:
 * - В development режиме: использует localhost:5001
 * - В production режиме: требует NEXT_PUBLIC_BACKEND_API_URL
 * - Во время сборки (SSR/SSG): использует переменную окружения или fallback для сборки
 * 
 * @returns URL бэкенда
 */
export function getClientBackendUrl(): string {
  // Проверяем, находимся ли мы в браузере (клиентская сторона)
  const isBrowser = typeof window !== 'undefined';
  
  // В development режиме всегда используем localhost
  if (process.env.NODE_ENV === 'development') {
    return DEV_BACKEND_URL;
  }

  // В production режиме требуем NEXT_PUBLIC_BACKEND_API_URL (доступна на клиенте)
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  if (!backendUrl) {
    // Во время сборки (SSR/SSG) мы можем быть в production режиме, но переменная еще не установлена
    // В этом случае возвращаем пустую строку, чтобы не ломать сборку
    // В реальном браузере это вызовет ошибку при попытке сделать запрос
    if (!isBrowser) {
      // Во время SSR/SSG сборки - возвращаем пустую строку, чтобы не ломать сборку
      // Это безопасно, так как клиентские компоненты не выполняются на сервере во время сборки
      console.warn(
        '⚠️ WARNING: NEXT_PUBLIC_BACKEND_API_URL is not set during build. ' +
        'This is OK for client components, but make sure to set it in your deployment environment.'
      );
      return '';
    }
    
    // В браузере в production без переменной - выбрасываем ошибку
    console.error(
      '❌ ERROR: NEXT_PUBLIC_BACKEND_API_URL is not set in production environment. ' +
      'Please set this environment variable in your deployment platform (Vercel, Railway, etc.)'
    );
    throw new Error(
      'NEXT_PUBLIC_BACKEND_API_URL must be set in production environment. ' +
      'Please configure this environment variable in your deployment settings.'
    );
  }

  // Убеждаемся, что URL использует HTTPS в production
  if (process.env.NODE_ENV === 'production' && backendUrl.startsWith('http://')) {
    console.warn(
      '⚠️ WARNING: Backend URL uses HTTP in production. This may cause Mixed Content errors. ' +
      'Consider using HTTPS: ' + backendUrl.replace('http://', 'https://')
    );
  }

  return backendUrl;
}

/**
 * Проверяет, доступен ли бэкенд (для отладки)
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const url = getBackendUrl();
    const response = await fetch(`${url}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5 секунд таймаут
    });
    return response.ok;
  } catch {
    return false;
  }
}

