'use client';

import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import Breadcrumbs from '@/app/components/dashboard/Breadcrumbs';
import MarketingPlanViewer from '@/app/components/admin/MarketingPlanViewer';

export default function AdminMarketingPlanPage() {
  return (
    <DashboardLayout
      userRole="admin"
      userName="Aidar"
      userEmail="aidar1910main@gmail.com"
      userPhone="+7 706 670 36 96"
      userTelegram="@opunksnoo"
      userCreatedAt="2024-01-01"
    >
      <Breadcrumbs
        items={[
          { label: 'Админ', path: '/admin/dashboard' },
          { label: 'Маркетинг-план' },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-3xl font-light text-gray-900 dark:text-white">
          Маркетинг-план
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400 font-light">
          Задачи из{' '}
          <code className="text-sm px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">
            docs/MARKETING_ACTION_PLAN.md
          </code>
          — отмечай по мере выполнения. Прогресс сохраняется на{' '}
          <strong>бэкенде</strong> (<code className="text-sm">/api/marketing-plan/progress</code>
          ), локальный JSON — только fallback в dev.
        </p>
      </div>

      <MarketingPlanViewer />
    </DashboardLayout>
  );
}
