'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import Breadcrumbs from '@/app/components/dashboard/Breadcrumbs';

export default function AdminProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'stages' | 'spec' | 'comments' | 'files' | 'activity'>('overview');
  const [editingStage, setEditingStage] = useState<number | null>(null);
  const [editingSpec, setEditingSpec] = useState<number | null>(null);

  // Моковые данные
  const [project, setProject] = useState({
    id: params.id,
    title: 'Интернет-магазин',
    description: 'Полнофункциональный интернет-магазин',
    goal: 'Увеличить онлайн-продажи на 200%',
    type: 'ecommerce',
    status: 'active',
    owner: 'Иван Иванов',
    ownerEmail: 'ivan@example.com',
    ownerPhone: '+7 700 123 45 67',
    budgetMin: 300000,
    budgetMax: 500000,
    deadline: '2024-03-15',
    createdAt: '2024-01-15',
  });

  const [stages, setStages] = useState([
    {
      id: 1,
      title: 'Консультация и планирование',
      description: 'Обсуждение требований и составление ТЗ',
      status: 'approved',
      order: 1,
      visibleToClient: true,
      plannedStart: '2024-01-15',
      plannedEnd: '2024-01-18',
      actualEnd: '2024-01-17',
    },
    {
      id: 2,
      title: 'Дизайн и прототипирование',
      description: 'Создание дизайн-макетов в Figma',
      status: 'approved',
      order: 2,
      visibleToClient: true,
      plannedStart: '2024-01-18',
      plannedEnd: '2024-01-25',
      actualEnd: '2024-01-24',
    },
    {
      id: 3,
      title: 'Разработка фронтенда',
      description: 'Верстка и программирование интерфейса',
      status: 'in_progress',
      order: 3,
      visibleToClient: true,
      plannedStart: '2024-01-25',
      plannedEnd: '2024-02-15',
      actualEnd: null,
    },
    {
      id: 4,
      title: 'Разработка бэкенда',
      description: 'API и база данных',
      status: 'not_started',
      order: 4,
      visibleToClient: true,
      plannedStart: '2024-02-10',
      plannedEnd: '2024-02-28',
      actualEnd: null,
    },
  ]);

  const [specifications, setSpecifications] = useState([
    {
      id: 1,
      version: '1.0',
      content: '# Техническое задание\n\n## Основные функции\n\n- Каталог товаров\n- Корзина\n- Оплата',
      status: 'approved',
      createdAt: '2024-01-17',
      approvedAt: '2024-01-18',
    },
    {
      id: 2,
      version: '1.1',
      content: '# Техническое задание v1.1\n\n## Обновления\n\n- Добавлена интеграция с Telegram',
      status: 'on_review',
      createdAt: '2024-01-25',
      approvedAt: null,
    },
  ]);

  const handleStatusChange = (newStatus: string) => {
    setProject({ ...project, status: newStatus });
  };

  const handleStageStatusChange = (stageId: number, newStatus: string) => {
    setStages(stages.map(s => s.id === stageId ? { ...s, status: newStatus } : s));
  };

  const handleSendStageToReview = (stageId: number) => {
    handleStageStatusChange(stageId, 'review');
    alert('Этап отправлен на проверку клиенту');
  };

  const handleCreateNewSpecVersion = () => {
    const newVersion = (parseFloat(specifications[0].version) + 0.1).toFixed(1);
    setSpecifications([{
      id: Date.now(),
      version: newVersion,
      content: '# Техническое задание v' + newVersion + '\n\n',
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      approvedAt: null,
    }, ...specifications]);
    setEditingSpec(Date.now());
  };

  const handleSendSpecToReview = (specId: number) => {
    // Только одна версия может быть on_review
    setSpecifications(specifications.map(s => 
      s.id === specId 
        ? { ...s, status: 'on_review' }
        : s.status === 'on_review' 
          ? { ...s, status: 'draft' }
          : s
    ));
    alert('ТЗ отправлено на проверку клиенту');
  };

  const handlePauseProject = () => {
    handleStatusChange('paused');
    alert('Проект поставлен на паузу');
  };

  const handleResumeProject = () => {
    handleStatusChange('active');
    alert('Проект возобновлен');
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
        { label: project.title }
      ]} />
        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-3xl font-light tracking-wide text-gray-900 dark:text-gray-100 mb-2">
                {project.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-light">
                {project.description}
              </p>
            </div>
            <div className="flex gap-2">
              <select
                value={project.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-light text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="draft">Черновик</option>
                <option value="pending">Ожидает</option>
                <option value="active">В работе</option>
                <option value="paused">На паузе</option>
                <option value="completed">Завершен</option>
              </select>
              {project.status === 'active' && (
                <button
                  onClick={handlePauseProject}
                  className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-xl font-light text-sm hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-all duration-300"
                >
                  Пауза
                </button>
              )}
              {project.status === 'paused' && (
                <button
                  onClick={handleResumeProject}
                  className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-xl font-light text-sm hover:bg-green-200 dark:hover:bg-green-900/50 transition-all duration-300"
                >
                  Возобновить
                </button>
              )}
            </div>
          </div>

          {/* Project Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-400 font-light">
                <span className="font-medium">Клиент:</span> {project.owner}
              </p>
              <p className="text-gray-600 dark:text-gray-400 font-light">
                <span className="font-medium">Email:</span> {project.ownerEmail}
              </p>
              <p className="text-gray-600 dark:text-gray-400 font-light">
                <span className="font-medium">Телефон:</span> {project.ownerPhone}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-400 font-light">
                <span className="font-medium">Бюджет:</span> {project.budgetMin.toLocaleString()} - {project.budgetMax.toLocaleString()} ₸
              </p>
              <p className="text-gray-600 dark:text-gray-400 font-light">
                <span className="font-medium">Дедлайн:</span> 
                <input
                  type="date"
                  value={project.deadline}
                  onChange={(e) => setProject({ ...project, deadline: e.target.value })}
                  className="ml-2 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-light"
                />
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'overview', label: 'Обзор' },
              { id: 'stages', label: 'Этапы' },
              { id: 'spec', label: 'ТЗ' },
              { id: 'comments', label: 'Комментарии' },
              { id: 'files', label: 'Файлы' },
              { id: 'activity', label: 'История' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 text-sm font-light transition-all duration-300 border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-6">
          {activeTab === 'stages' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-light text-gray-900 dark:text-gray-100">
                  Управление этапами
                </h3>
                <button
                  onClick={() => alert('Создание нового этапа - будет реализовано')}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white rounded-xl font-light text-sm transition-all duration-300"
                >
                  + Добавить этап
                </button>
              </div>

              {stages.map((stage) => (
                <div
                  key={stage.id}
                  className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-light text-gray-900 dark:text-gray-100">
                          {stage.order}. {stage.title}
                        </h4>
                        <select
                          value={stage.status}
                          onChange={(e) => handleStageStatusChange(stage.id, e.target.value)}
                          className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-light"
                        >
                          <option value="not_started">Не начат</option>
                          <option value="in_progress">В работе</option>
                          <option value="review">На проверке</option>
                          <option value="approved">Утвержден</option>
                        </select>
                      </div>
                      <textarea
                        value={stage.description}
                        onChange={(e) => setStages(stages.map(s => s.id === stage.id ? { ...s, description: e.target.value } : s))}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-light mb-2"
                        rows={2}
                      />
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500 font-light">
                        <div>
                          <span>Начало: </span>
                          <input
                            type="date"
                            value={stage.plannedStart}
                            onChange={(e) => setStages(stages.map(s => s.id === stage.id ? { ...s, plannedStart: e.target.value } : s))}
                            className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs"
                          />
                        </div>
                        <div>
                          <span>Конец: </span>
                          <input
                            type="date"
                            value={stage.plannedEnd}
                            onChange={(e) => setStages(stages.map(s => s.id === stage.id ? { ...s, plannedEnd: e.target.value } : s))}
                            className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs"
                          />
                        </div>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={stage.visibleToClient}
                            onChange={(e) => setStages(stages.map(s => s.id === stage.id ? { ...s, visibleToClient: e.target.checked } : s))}
                            className="rounded"
                          />
                          <span>Видно клиенту</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  {stage.status === 'in_progress' && (
                    <button
                      onClick={() => handleSendStageToReview(stage.id)}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-light transition-all duration-300"
                    >
                      Отправить на проверку
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'spec' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-light text-gray-900 dark:text-gray-100">
                  Управление ТЗ
                </h3>
                <button
                  onClick={handleCreateNewSpecVersion}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white rounded-xl font-light text-sm transition-all duration-300"
                >
                  + Новая версия
                </button>
              </div>

              {specifications.map((spec) => (
                <div key={spec.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-light">Версия:</span>
                      <span className="ml-2 text-lg font-light text-gray-900 dark:text-gray-100">{spec.version}</span>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={spec.status}
                        onChange={(e) => setSpecifications(specifications.map(s => 
                          s.id === spec.id 
                            ? { ...s, status: e.target.value as any }
                            : e.target.value === 'on_review' && s.status === 'on_review'
                              ? { ...s, status: 'draft' }
                              : s
                        ))}
                        className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-light"
                      >
                        <option value="draft">Черновик</option>
                        <option value="on_review">На проверке</option>
                        <option value="approved">Утверждено</option>
                      </select>
                      {spec.status === 'draft' && (
                        <button
                          onClick={() => handleSendSpecToReview(spec.id)}
                          className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-light transition-all duration-300"
                        >
                          Отправить клиенту
                        </button>
                      )}
                    </div>
                  </div>
                  {editingSpec === spec.id ? (
                    <textarea
                      value={spec.content}
                      onChange={(e) => setSpecifications(specifications.map(s => s.id === spec.id ? { ...s, content: e.target.value } : s))}
                      rows={10}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-light font-mono"
                    />
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none mb-3">
                      <div className="text-sm text-gray-700 dark:text-gray-300 font-light whitespace-pre-line">
                        {spec.content}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500 dark:text-gray-500 font-light">
                      Создано: {new Date(spec.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                    <button
                      onClick={() => setEditingSpec(editingSpec === spec.id ? null : spec.id)}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg text-xs font-light hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-300"
                    >
                      {editingSpec === spec.id ? 'Сохранить' : 'Редактировать'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {(activeTab === 'overview' || activeTab === 'comments' || activeTab === 'files' || activeTab === 'activity') && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 font-light">
                {activeTab === 'overview' && 'Общая информация о проекте'}
                {activeTab === 'comments' && 'Комментарии и обсуждения'}
                {activeTab === 'files' && 'Файлы проекта'}
                {activeTab === 'activity' && 'История активности'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 font-light mt-2">
                (Будет реализовано)
              </p>
            </div>
          )}
        </div>
    </DashboardLayout>
  );
}

