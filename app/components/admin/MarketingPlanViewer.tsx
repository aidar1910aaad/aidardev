'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import MarketingPlanMarkdown from './MarketingPlanMarkdown';

interface PlanTask {
  id: string;
  text: string;
  line: number;
  checked: boolean;
}

interface PlanSubsection {
  id: string;
  title: string;
  body: string;
  tasks: PlanTask[];
}

interface PlanSection {
  id: string;
  title: string;
  blockNumber: number | null;
  body: string;
  subsections: PlanSubsection[];
  tasks: PlanTask[];
  completedCount: number;
  totalCount: number;
}

interface PlanData {
  title: string;
  updatedAt: string | null;
  source: string;
  progressStorage?: 'backend' | 'local-fallback';
  totalTasks: number;
  completedCount: number;
  progressPercent: number;
  nextTask: PlanTask | null;
  sections: PlanSection[];
}

export default function MarketingPlanViewer() {
  const [data, setData] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [showOnlyOpen, setShowOnlyOpen] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);

  const loadPlan = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/marketing-plan');
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Ошибка загрузки');
      setData(json);
      setActiveSectionId((prev) => {
        if (prev && json.sections.some((s: PlanSection) => s.id === prev)) {
          return prev;
        }
        const firstBlock = json.sections.find((s: PlanSection) => s.blockNumber === 1);
        return firstBlock?.id ?? json.sections[0]?.id ?? null;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlan();
  }, [loadPlan]);

  const toggleTask = async (taskId: string, checked: boolean) => {
    if (!data) return;
    setSaving(taskId);

    setData((prev) => {
      if (!prev) return prev;
      const sections = prev.sections.map((section) => ({
        ...section,
        subsections: section.subsections.map((sub) => ({
          ...sub,
          tasks: sub.tasks.map((t) =>
            t.id === taskId ? { ...t, checked } : t
          ),
        })),
        tasks: section.tasks.map((t) =>
          t.id === taskId ? { ...t, checked } : t
        ),
      }));

      const allTasks = sections.flatMap((s) => s.tasks);
      const completedCount = allTasks.filter((t) => t.checked).length;

      return {
        ...prev,
        sections: sections.map((s) => ({
          ...s,
          completedCount: s.tasks.filter((t) => t.checked).length,
        })),
        completedCount,
        progressPercent: Math.round((completedCount / prev.totalTasks) * 100),
        nextTask: allTasks.find((t) => !t.checked) ?? null,
      };
    });

    try {
      await fetch('/api/admin/marketing-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, checked }),
      });
    } catch {
      loadPlan();
    } finally {
      setSaving(null);
    }
  };

  const resetProgress = async () => {
    if (!confirm('Сбросить весь прогресс? Задачи снова станут невыполненными.')) return;
    await fetch('/api/admin/marketing-plan', { method: 'DELETE' });
    loadPlan();
  };

  const activeSection = useMemo(
    () => data?.sections.find((s) => s.id === activeSectionId) ?? null,
    [data, activeSectionId]
  );

  const blockSections = useMemo(
    () => data?.sections.filter((s) => s.blockNumber !== null) ?? [],
    [data]
  );

  const introSections = useMemo(
    () => data?.sections.filter((s) => s.blockNumber === null) ?? [],
    [data]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500 dark:text-gray-400 font-light">
          Загрузка плана из документа…
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
        {error ?? 'Не удалось загрузить план'}
        <button
          type="button"
          onClick={loadPlan}
          className="block mt-3 text-sm underline"
        >
          Повторить
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar */}
      <aside className="lg:w-72 flex-shrink-0 space-y-4">
        {/* Progress card */}
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500 dark:text-gray-400">Прогресс</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {data.completedCount}/{data.totalTasks} ({data.progressPercent}%)
            </span>
          </div>
          <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-orange-500 transition-all duration-500"
              style={{ width: `${data.progressPercent}%` }}
            />
          </div>
          {data.nextTask && (
            <div className="mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
                Следующий шаг
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                {data.nextTask.text}
              </p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="p-2 rounded-2xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-800/50 max-h-[50vh] overflow-y-auto">
          {introSections.length > 0 && (
            <p className="px-3 py-2 text-xs uppercase tracking-wider text-gray-400">
              Обзор
            </p>
          )}
          {introSections.map((section) => (
            <SectionNavItem
              key={section.id}
              section={section}
              active={activeSectionId === section.id}
              onClick={() => setActiveSectionId(section.id)}
            />
          ))}

          <p className="px-3 py-2 mt-2 text-xs uppercase tracking-wider text-gray-400">
            Блоки
          </p>
          {blockSections.map((section) => (
            <SectionNavItem
              key={section.id}
              section={section}
              active={activeSectionId === section.id}
              onClick={() => setActiveSectionId(section.id)}
            />
          ))}
        </nav>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={loadPlan}
            className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            ↻ Обновить из документа
          </button>
          <button
            type="button"
            onClick={() => setShowOnlyOpen(!showOnlyOpen)}
            className={`w-full px-4 py-2 text-sm rounded-xl border transition-colors ${
              showOnlyOpen
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {showOnlyOpen ? '✓ Только открытые' : 'Показать все задачи'}
          </button>
          <button
            type="button"
            onClick={resetProgress}
            className="w-full px-4 py-2 text-sm rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Сбросить прогресс
          </button>
        </div>

        <p className="text-xs text-gray-400 px-1">
          Источник: {data.source}
          {data.updatedAt && ` · ${data.updatedAt}`}
          {data.progressStorage && (
            <>
              <br />
              <span
                className={
                  data.progressStorage === 'backend'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-amber-600 dark:text-amber-400'
                }
              >
                Прогресс:{' '}
                {data.progressStorage === 'backend'
                  ? 'сервер (бэкенд)'
                  : 'локально (бэкенд недоступен)'}
              </span>
            </>
          )}
        </p>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {activeSection ? (
          <article className="p-6 sm:p-8 rounded-2xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm">
            <header className="mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-light text-gray-900 dark:text-white">
                {activeSection.title}
              </h2>
              {activeSection.totalCount > 0 && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {activeSection.completedCount}/{activeSection.totalCount} задач
                  {activeSection.completedCount === activeSection.totalCount &&
                    activeSection.totalCount > 0 && (
                      <span className="ml-2 text-green-600 dark:text-green-400">
                        ✓ Готово
                      </span>
                    )}
                </p>
              )}
            </header>

            {activeSection.body && (
              <div className="mb-8">
                <MarketingPlanMarkdown content={activeSection.body} />
              </div>
            )}

            {activeSection.subsections.map((sub) => {
              const visibleTasks = showOnlyOpen
                ? sub.tasks.filter((t) => !t.checked)
                : sub.tasks;

              if (
                !sub.body &&
                sub.title === 'Задачи' &&
                visibleTasks.length === 0
              ) {
                return null;
              }

              if (
                !sub.body &&
                visibleTasks.length === 0 &&
                sub.tasks.length > 0
              ) {
                return null;
              }

              return (
                <section key={sub.id} className="mb-8 last:mb-0">
                  {sub.title !== 'Задачи' && (
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
                      {sub.title}
                    </h3>
                  )}

                  {sub.body && (
                    <div className="mb-4">
                      <MarketingPlanMarkdown content={sub.body} />
                    </div>
                  )}

                  {visibleTasks.length > 0 && (
                    <ul className="space-y-2">
                      {visibleTasks.map((task) => (
                        <li key={task.id}>
                          <label
                            className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                              task.checked
                                ? 'bg-green-50/80 dark:bg-green-900/10 border border-green-200/50 dark:border-green-800/30'
                                : 'bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-700'
                            } ${saving === task.id ? 'opacity-60' : ''}`}
                          >
                            <input
                              type="checkbox"
                              checked={task.checked}
                              onChange={(e) =>
                                toggleTask(task.id, e.target.checked)
                              }
                              className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span
                              className={`text-sm flex-1 ${
                                task.checked
                                  ? 'line-through text-gray-400 dark:text-gray-500'
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {task.text}
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              );
            })}
          </article>
        ) : (
          <div className="p-8 text-center text-gray-500">
            Выберите блок слева
          </div>
        )}
      </div>
    </div>
  );
}

function SectionNavItem({
  section,
  active,
  onClick,
}: {
  section: PlanSection;
  active: boolean;
  onClick: () => void;
}) {
  const pct =
    section.totalCount > 0
      ? Math.round((section.completedCount / section.totalCount) * 100)
      : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 rounded-xl mb-1 text-sm transition-colors ${
        active
          ? 'bg-gradient-to-r from-blue-600 to-orange-600 text-white shadow-md'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate font-light">
          {section.blockNumber ? `Блок ${section.blockNumber}` : '·'}
          {section.blockNumber ? '' : ' '}
          <span className={section.blockNumber ? 'sr-only' : ''}>
            {section.title.replace(/^#+\s*/, '').slice(0, 28)}
          </span>
          {section.blockNumber && (
            <span className="hidden sm:inline">
              {section.title.split('—')[0]?.replace(/БЛОК \d+\s*—?\s*/i, '').trim().slice(0, 20) ??
                section.title.slice(0, 20)}
            </span>
          )}
        </span>
        {pct !== null && (
          <span
            className={`text-xs flex-shrink-0 ${active ? 'text-white/80' : 'text-gray-400'}`}
          >
            {section.completedCount}/{section.totalCount}
          </span>
        )}
      </div>
      {pct !== null && section.totalCount > 0 && (
        <div
          className={`mt-1.5 h-1 rounded-full overflow-hidden ${
            active ? 'bg-white/30' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          <div
            className={`h-full rounded-full ${active ? 'bg-white' : 'bg-blue-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </button>
  );
}
