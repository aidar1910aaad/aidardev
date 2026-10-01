import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import {
  parseMarketingPlan,
  applyCheckedState,
  getNextTask,
} from '@/app/lib/marketing-plan-parser';
import {
  readMarketingPlanProgress,
  saveMarketingPlanProgress,
  resetMarketingPlanProgress,
} from '@/app/lib/marketing-plan-storage';
import { isAuthorizedBlogAdmin } from '@/app/lib/blog-admin';

const PLAN_PATH = path.join(process.cwd(), 'docs', 'MARKETING_ACTION_PLAN.md');

function buildPlanResponse(
  parsed: ReturnType<typeof parseMarketingPlan>,
  progress: Record<string, boolean>,
  storage: 'backend' | 'local-fallback'
) {
  const withStatus = applyCheckedState(parsed, progress);
  const nextTask = getNextTask(withStatus.sectionsWithStatus);

  return {
    success: true,
    source: 'docs/MARKETING_ACTION_PLAN.md',
    progressStorage: storage,
    title: parsed.title,
    updatedAt: parsed.updatedAt,
    totalTasks: parsed.totalTasks,
    completedCount: withStatus.completedCount,
    progressPercent:
      parsed.totalTasks > 0
        ? Math.round((withStatus.completedCount / parsed.totalTasks) * 100)
        : 0,
    nextTask,
    sections: withStatus.sectionsWithStatus,
    progress,
  };
}

export async function GET(request: NextRequest) {
  try {
    if (!isAuthorizedBlogAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const markdown = await readFile(PLAN_PATH, 'utf-8');
    const parsed = parseMarketingPlan(markdown);
    const { progress, storage } = await readMarketingPlanProgress();

    return NextResponse.json(buildPlanResponse(parsed, progress, storage));
  } catch (error) {
    console.error('marketing-plan GET:', error);
    return NextResponse.json(
      { success: false, error: 'Не удалось загрузить план' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthorizedBlogAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (
      body.taskId === undefined &&
      (!body.progress || typeof body.progress !== 'object')
    ) {
      return NextResponse.json(
        { success: false, error: 'Нужны taskId + checked или progress' },
        { status: 400 }
      );
    }

    const payload =
      body.taskId !== undefined && typeof body.checked === 'boolean'
        ? { taskId: body.taskId as string, checked: body.checked as boolean }
        : { progress: body.progress as Record<string, boolean> };

    const { progress, storage } = await saveMarketingPlanProgress(payload);

    const markdown = await readFile(PLAN_PATH, 'utf-8');
    const parsed = parseMarketingPlan(markdown);
    const withStatus = applyCheckedState(parsed, progress);

    return NextResponse.json({
      success: true,
      progressStorage: storage,
      completedCount: withStatus.completedCount,
      progressPercent:
        parsed.totalTasks > 0
          ? Math.round((withStatus.completedCount / parsed.totalTasks) * 100)
          : 0,
      progress,
    });
  } catch (error) {
    console.error('marketing-plan POST:', error);
    return NextResponse.json(
      { success: false, error: 'Не удалось сохранить прогресс' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!isAuthorizedBlogAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { progress, storage } = await resetMarketingPlanProgress();
    return NextResponse.json({
      success: true,
      progressStorage: storage,
      progress,
    });
  } catch (error) {
    console.error('marketing-plan DELETE:', error);
    return NextResponse.json(
      { success: false, error: 'Не удалось сбросить прогресс' },
      { status: 500 }
    );
  }
}
