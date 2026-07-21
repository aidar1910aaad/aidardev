'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import Breadcrumbs from '@/app/components/dashboard/Breadcrumbs';

export default function ProjectViewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'spec' | 'comments' | 'files' | 'activity'>('overview');
  const [newComment, setNewComment] = useState('');
  const [commentType, setCommentType] = useState<'comment' | 'question'>('comment');

  // Моковые данные проекта
  const [project] = useState({
    id: params.id,
    title: 'Интернет-магазин',
    description: 'Полнофункциональный интернет-магазин с каталогом товаров, корзиной и системой оплаты',
    goal: 'Увеличить онлайн-продажи на 200% за 6 месяцев',
    type: 'ecommerce',
    status: 'active',
    budgetMin: 300000,
    budgetMax: 500000,
    deadline: '2024-03-15',
    createdAt: '2024-01-15',
  });

  const [stages] = useState([
    {
      id: 1,
      title: 'Консультация и планирование',
      description: 'Обсуждение требований и составление ТЗ',
      status: 'approved',
      order: 1,
      plannedStart: '2024-01-15',
      plannedEnd: '2024-01-18',
      actualEnd: '2024-01-17',
      visible: true,
    },
    {
      id: 2,
      title: 'Дизайн и прототипирование',
      description: 'Создание дизайн-макетов в Figma',
      status: 'approved',
      order: 2,
      plannedStart: '2024-01-18',
      plannedEnd: '2024-01-25',
      actualEnd: '2024-01-24',
      visible: true,
    },
    {
      id: 3,
      title: 'Разработка фронтенда',
      description: 'Верстка и программирование интерфейса',
      status: 'in_progress',
      order: 3,
      plannedStart: '2024-01-25',
      plannedEnd: '2024-02-15',
      actualEnd: null,
      visible: true,
    },
    {
      id: 4,
      title: 'Разработка бэкенда',
      description: 'API и база данных',
      status: 'not_started',
      order: 4,
      plannedStart: '2024-02-10',
      plannedEnd: '2024-02-28',
      actualEnd: null,
      visible: true,
    },
    {
      id: 5,
      title: 'Тестирование и запуск',
      description: 'Финальное тестирование и деплой',
      status: 'not_started',
      order: 5,
      plannedStart: '2024-03-01',
      plannedEnd: '2024-03-15',
      actualEnd: null,
      visible: true,
    },
  ]);

  const [specifications] = useState([
    {
      id: 1,
      version: '1.0',
      content: '# Техническое задание\n\n## Основные функции\n\n- Каталог товаров\n- Корзина\n- Оплата\n- Личный кабинет',
      status: 'approved',
      createdAt: '2024-01-17',
      approvedAt: '2024-01-18',
    },
    {
      id: 2,
      version: '1.1',
      content: '# Техническое задание v1.1\n\n## Обновления\n\n- Добавлена интеграция с Telegram\n- Улучшена система поиска',
      status: 'on_review',
      createdAt: '2024-01-25',
      approvedAt: null,
    },
  ]);

  const [comments] = useState([
    {
      id: 1,
      author: 'Aidar',
      authorRole: 'admin',
      content: 'Начал работу над дизайном. Ожидаю фидбек по макетам.',
      type: 'comment',
      stageId: 2,
      createdAt: '2024-01-20',
    },
    {
      id: 2,
      author: 'Иван Иванов',
      authorRole: 'client',
      content: 'Можно ли добавить фильтр по цвету?',
      type: 'question',
      stageId: null,
      createdAt: '2024-01-22',
    },
    {
      id: 3,
      author: 'Aidar',
      authorRole: 'admin',
      content: 'Конечно, добавлю в следующую версию ТЗ.',
      type: 'comment',
      stageId: null,
      createdAt: '2024-01-22',
    },
  ]);

  const [files] = useState([
    { id: 1, name: 'Дизайн-макеты.pdf', type: 'pdf', uploadedBy: 'Aidar', createdAt: '2024-01-20', stageId: 2 },
    { id: 2, name: 'Техническое задание.docx', type: 'docx', uploadedBy: 'Aidar', createdAt: '2024-01-17', stageId: null },
  ]);

  const [activityLog] = useState([
    { id: 1, action: 'Проект создан', user: 'Иван Иванов', createdAt: '2024-01-15' },
    { id: 2, action: 'Этап "Консультация" завершен', user: 'Aidar', createdAt: '2024-01-17' },
    { id: 3, action: 'ТЗ версии 1.0 утверждено', user: 'Иван Иванов', createdAt: '2024-01-18' },
    { id: 4, action: 'Этап "Дизайн" отправлен на проверку', user: 'Aidar', createdAt: '2024-01-24' },
    { id: 5, action: 'Этап "Дизайн" утвержден', user: 'Иван Иванов', createdAt: '2024-01-25' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'review':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'not_started':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Утвержден';
      case 'in_progress':
        return 'В работе';
      case 'review':
        return 'На проверке';
      case 'not_started':
        return 'Не начат';
      default:
        return status;
    }
  };

  const handleApproveStage = (stageId: number) => {
    // Симуляция утверждения этапа
    alert(`Этап ${stageId} утвержден`);
  };

  const handleApproveSpec = (specId: number) => {
    // Симуляция утверждения ТЗ
    alert(`ТЗ версии ${specifications.find(s => s.id === specId)?.version} утверждено`);
  };

  const handleRequestContact = () => {
    // Симуляция запроса связи
    alert('Запрос на связь отправлен администратору');
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    // Симуляция отправки комментария
    alert('Комментарий отправлен');
    setNewComment('');
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
              <button
                onClick={handleRequestContact}
                className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-xl font-light text-sm hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-all duration-300"
              >
                Запросить связь
              </button>
            </div>
          </div>

          {/* Project Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 font-light">
            <span>Бюджет: {project.budgetMin.toLocaleString()} - {project.budgetMax.toLocaleString()} ₸</span>
            <span>Дедлайн: {new Date(project.deadline).toLocaleDateString('ru-RU')}</span>
            <span className={`px-3 py-1 rounded-lg ${getStatusColor(project.status)}`}>
              {getStatusText(project.status)}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'overview', label: 'Обзор' },
              { id: 'timeline', label: 'Этапы' },
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
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-light text-gray-900 dark:text-gray-100 mb-3">
                  Общая информация
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 font-light">Цель проекта:</span>
                    <p className="text-gray-900 dark:text-gray-100 font-light mt-1">{project.goal}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 font-light">Тип:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-light ml-2">Интернет-магазин</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 font-light">Создан:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-light ml-2">
                      {new Date(project.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-light text-gray-900 dark:text-gray-100 mb-3">
                  Текущий этап
                </h3>
                {stages.find(s => s.status === 'in_progress' || s.status === 'review') ? (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <p className="font-light text-gray-900 dark:text-gray-100">
                      {stages.find(s => s.status === 'in_progress' || s.status === 'review')?.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-light mt-1">
                      {stages.find(s => s.status === 'in_progress' || s.status === 'review')?.description}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 font-light">Нет активных этапов</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h3 className="text-xl font-light text-gray-900 dark:text-gray-100 mb-4">
                Таймлайн этапов
              </h3>
              {stages.map((stage, index) => (
                <div
                  key={stage.id}
                  className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                >
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-light ${
                      stage.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      stage.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      stage.status === 'review' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-lg font-light text-gray-900 dark:text-gray-100">
                        {stage.title}
                      </h4>
                      <span className={`px-3 py-1 rounded-lg text-xs font-light ${getStatusColor(stage.status)}`}>
                        {getStatusText(stage.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-light mb-2">
                      {stage.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500 font-light">
                      <span>Планируется: {new Date(stage.plannedStart).toLocaleDateString('ru-RU')} - {new Date(stage.plannedEnd).toLocaleDateString('ru-RU')}</span>
                      {stage.actualEnd && (
                        <span>Завершен: {new Date(stage.actualEnd).toLocaleDateString('ru-RU')}</span>
                      )}
                    </div>
                    {stage.status === 'review' && (
                      <button
                        onClick={() => handleApproveStage(stage.id)}
                        className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-light transition-all duration-300"
                      >
                        Утвердить этап
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'spec' && (
            <div className="space-y-4">
              <h3 className="text-xl font-light text-gray-900 dark:text-gray-100 mb-4">
                Техническое задание
              </h3>
              {specifications.map((spec) => (
                <div key={spec.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-light">Версия:</span>
                      <span className="ml-2 text-lg font-light text-gray-900 dark:text-gray-100">{spec.version}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-light ${getStatusColor(spec.status)}`}>
                      {spec.status === 'approved' ? 'Утверждено' : spec.status === 'on_review' ? 'На проверке' : 'Черновик'}
                    </span>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none mb-3">
                    <div className="text-sm text-gray-700 dark:text-gray-300 font-light whitespace-pre-line">
                      {spec.content}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 font-light">
                    <span>Создано: {new Date(spec.createdAt).toLocaleDateString('ru-RU')}</span>
                    {spec.approvedAt && (
                      <span>Утверждено: {new Date(spec.approvedAt).toLocaleDateString('ru-RU')}</span>
                    )}
                  </div>
                  {spec.status === 'on_review' && (
                    <button
                      onClick={() => handleApproveSpec(spec.id)}
                      className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-light transition-all duration-300"
                    >
                      Утвердить ТЗ
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-6">
              <h3 className="text-xl font-light text-gray-900 dark:text-gray-100 mb-4">
                Комментарии и вопросы
              </h3>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-4 rounded-xl ${
                      comment.authorRole === 'admin'
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : 'bg-gray-50 dark:bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="font-light text-gray-900 dark:text-gray-100">
                          {comment.author}
                        </span>
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-500 font-light">
                          {comment.type === 'question' ? '❓ Вопрос' : '💬 Комментарий'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-500 font-light">
                        {new Date(comment.createdAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-light">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleSubmitComment} className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCommentType('comment')}
                    className={`px-3 py-1 rounded-lg text-sm font-light transition-all duration-300 ${
                      commentType === 'comment'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Комментарий
                  </button>
                  <button
                    type="button"
                    onClick={() => setCommentType('question')}
                    className={`px-3 py-1 rounded-lg text-sm font-light transition-all duration-300 ${
                      commentType === 'question'
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Вопрос
                  </button>
                </div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  placeholder={commentType === 'question' ? 'Задайте ваш вопрос...' : 'Оставьте комментарий...'}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 font-light resize-none"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white rounded-xl font-light text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Отправить
                </button>
              </form>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-4">
              <h3 className="text-xl font-light text-gray-900 dark:text-gray-100 mb-4">
                Файлы проекта
              </h3>
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📎</span>
                    <div>
                      <p className="font-light text-gray-900 dark:text-gray-100">{file.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 font-light">
                        Загружено {file.uploadedBy} • {new Date(file.createdAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg text-sm font-light hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-300">
                    Скачать
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              <h3 className="text-xl font-light text-gray-900 dark:text-gray-100 mb-4">
                История активности
              </h3>
              <div className="space-y-3">
                {activityLog.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-light text-gray-900 dark:text-gray-100">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 font-light mt-1">
                        {activity.user} • {new Date(activity.createdAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
    </DashboardLayout>
  );
}

