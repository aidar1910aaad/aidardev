'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAdminLink, setShowAdminLink] = useState(false);
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  // Скрытая комбинация клавиш для доступа к админ-панели
  // Комбинация: Ctrl+Shift+A или последовательность: A-D-M-I-N
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Вариант 1: Ctrl+Shift+A
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setShowAdminLink(true);
        setTimeout(() => setShowAdminLink(false), 5000); // Скрыть через 5 секунд
        return;
      }

      // Вариант 2: Последовательность A-D-M-I-N
      const sequence = ['a', 'd', 'm', 'i', 'n'];
      setKeySequence(prev => {
        const newSeq = [...prev, e.key.toLowerCase()].slice(-5);
        if (newSeq.join('') === sequence.join('')) {
          setShowAdminLink(true);
          setTimeout(() => setShowAdminLink(false), 5000);
          return [];
        }
        return newSeq;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Симуляция отправки кода (в реальности будет API запрос)
    setTimeout(() => {
      setStep('code');
      setLoading(false);
    }, 1000);
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Симуляция проверки кода (в реальности будет API запрос)
    setTimeout(() => {
      // Редирект на указанный путь или дашборд по умолчанию
      router.push(redirectPath);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-orange-50/20 dark:from-gray-950 dark:via-blue-950/10 dark:to-orange-950/10 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo - двойной клик открывает админ-панель */}
        <div 
          className="text-center mb-8 cursor-pointer"
          onDoubleClick={() => {
            setShowAdminLink(true);
            setTimeout(() => setShowAdminLink(false), 5000);
          }}
          title="Двойной клик для админов"
        >
          <h1 className="text-3xl font-light tracking-wide mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-900 to-orange-900 dark:from-white dark:via-blue-300 dark:to-orange-300">
              Aidar
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-orange-600 dark:from-blue-400 dark:to-orange-400">
              .dev
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-light">
            Личный кабинет клиента
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-800/50 p-8">
          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                  Ваше имя
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 font-light"
                  placeholder="Иван Иванов"
                />
              </div>

              <div>
                <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                  Номер телефона
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 font-light"
                  placeholder="+7 (700) 123-45-67"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white rounded-xl font-light tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Отправка...' : 'Получить код'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleCodeSubmit} className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 font-light">
                  Мы отправили код подтверждения на номер <br />
                  <span className="font-medium text-gray-900 dark:text-gray-100">{phone}</span>
                </p>
                <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                  Код подтверждения
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 font-light text-center text-2xl tracking-widest"
                  placeholder="000000"
                />
              </div>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-light transition-colors"
              >
                Изменить номер
              </button>

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white rounded-xl font-light tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Проверка...' : 'Войти'}
              </button>
            </form>
          )}

          {/* Скрытая ссылка на админ-панель (появляется при Ctrl+Shift+A или последовательности A-D-M-I-N) */}
          {showAdminLink && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 animate-fade-in">
              <button
                onClick={() => router.push('/admin/login')}
                className="w-full px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl font-light text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                🔐 Вход для администратора →
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-2 font-light">
                Ссылка исчезнет через несколько секунд
              </p>
            </div>
          )}

          {/* Альтернатива: Скрытая кнопка при двойном клике на логотип или подсказка */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-600 font-light">
              {/* Скрытая подсказка для админов - можно убрать */}
              {/* Для доступа к админ-панели используйте Ctrl+Shift+A или двойной клик на логотип */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-orange-50/20 dark:from-gray-950 dark:via-blue-950/10 dark:to-orange-950/10 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-800/50 p-8">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 font-light">Загрузка...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

