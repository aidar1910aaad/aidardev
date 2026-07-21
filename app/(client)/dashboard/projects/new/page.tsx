'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import Breadcrumbs from '@/app/components/dashboard/Breadcrumbs';

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'site',
    description: '',
    goal: '',
    deadline: '',
    budgetMin: '',
    budgetMax: '',
    files: [] as File[],
  });

  const projectTypes = [
    { value: 'site', label: 'Веб-сайт' },
    { value: 'crm', label: 'CRM / SaaS' },
    { value: 'automation', label: 'Автоматизация / Боты' },
    { value: 'ai', label: 'ИИ / GPT' },
    { value: 'mobile', label: 'Мобильное приложение' },
    { value: 'other', label: 'Другое' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Симуляция создания проекта
    setTimeout(() => {
      // В реальности здесь будет API запрос
      router.push('/dashboard');
      setLoading(false);
    }, 1000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        files: Array.from(e.target.files),
      });
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
        { label: 'Мои проекты', path: '/dashboard' },
        { label: 'Создать проект' }
      ]} />

      <div className="max-w-3xl">
        <div className="mb-8">
          <h2 className="text-3xl font-light tracking-wide text-gray-900 dark:text-gray-100 mb-2">
            Создать новый проект
          </h2>
          <p className="text-gray-600 dark:text-gray-400 font-light">
            Заполните информацию о вашем проекте
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Название проекта */}
          <div>
            <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
              Название проекта <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 font-light"
              placeholder="Например: Интернет-магазин одежды"
            />
          </div>

          {/* Тип проекта */}
          <div>
            <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
              Тип проекта <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 font-light"
            >
              {projectTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Краткое описание */}
          <div>
            <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
              Краткое описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 font-light resize-none"
              placeholder="Опишите ваш проект..."
            />
          </div>

          {/* Цель проекта */}
          <div>
            <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
              Бизнес-цель проекта
            </label>
            <textarea
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 font-light resize-none"
              placeholder="Какую проблему решает проект? Какие цели вы хотите достичь?"
            />
          </div>

          {/* Сроки и бюджет */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Желаемые сроки */}
            <div>
              <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                Желаемые сроки
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 font-light"
              />
            </div>

            {/* Бюджет */}
            <div>
              <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                Бюджет (диапазон)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={formData.budgetMin}
                  onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                  placeholder="От"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 font-light"
                />
                <input
                  type="number"
                  value={formData.budgetMax}
                  onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                  placeholder="До"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 font-light"
                />
              </div>
            </div>
          </div>

          {/* Загрузка файлов */}
          <div>
            <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
              Загрузка файлов (опционально)
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 font-light"
            />
            {formData.files.length > 0 && (
              <div className="mt-2 space-y-1">
                {formData.files.map((file, index) => (
                  <p key={index} className="text-sm text-gray-600 dark:text-gray-400 font-light">
                    📎 {file.name}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-light tracking-wide transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white rounded-xl font-light tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Создание...' : 'Создать проект'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

