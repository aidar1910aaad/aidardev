import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { getBackendUrl } from '@/app/lib/backend-config';

export type ProgressMap = Record<string, boolean>;
export type StorageMode = 'backend' | 'local-fallback';

const PROGRESS_PATH = path.join(
  process.cwd(),
  'app',
  'data',
  'marketing-plan-progress.json'
);

const BACKEND_PROGRESS_PATH = '/api/marketing-plan/progress';

async function readLocalProgress(): Promise<ProgressMap> {
  try {
    const raw = await readFile(PROGRESS_PATH, 'utf-8');
    return JSON.parse(raw) as ProgressMap;
  } catch {
    return {};
  }
}

async function writeLocalProgress(progress: ProgressMap): Promise<void> {
  await writeFile(PROGRESS_PATH, JSON.stringify(progress, null, 2), 'utf-8');
}

async function fetchBackendProgress(): Promise<ProgressMap | null> {
  try {
    const backendUrl = getBackendUrl();
    const response = await fetch(`${backendUrl}${BACKEND_PROGRESS_PATH}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.warn('[marketing-plan] Backend GET failed:', response.status);
      return null;
    }

    const data = await response.json();
    if (data.progress && typeof data.progress === 'object') {
      return data.progress as ProgressMap;
    }
    if (data.success && data.data?.progress) {
      return data.data.progress as ProgressMap;
    }

    return {};
  } catch (error) {
    console.warn('[marketing-plan] Backend unavailable, using local fallback:', error);
    return null;
  }
}

async function saveBackendProgress(
  payload: { taskId?: string; checked?: boolean; progress?: ProgressMap }
): Promise<boolean> {
  try {
    const backendUrl = getBackendUrl();
    const response = await fetch(`${backendUrl}${BACKEND_PROGRESS_PATH}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn('[marketing-plan] Backend POST failed:', response.status);
      return false;
    }

    return true;
  } catch (error) {
    console.warn('[marketing-plan] Backend POST error:', error);
    return false;
  }
}

async function deleteBackendProgress(): Promise<boolean> {
  try {
    const backendUrl = getBackendUrl();
    const response = await fetch(`${backendUrl}${BACKEND_PROGRESS_PATH}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      console.warn('[marketing-plan] Backend DELETE failed:', response.status);
      return false;
    }

    return true;
  } catch (error) {
    console.warn('[marketing-plan] Backend DELETE error:', error);
    return false;
  }
}

/** Читает прогресс: сначала бэкенд, при недоступности — локальный JSON (dev). */
export async function readMarketingPlanProgress(): Promise<{
  progress: ProgressMap;
  storage: StorageMode;
}> {
  const fromBackend = await fetchBackendProgress();

  if (fromBackend !== null) {
    return { progress: fromBackend, storage: 'backend' };
  }

  const local = await readLocalProgress();
  return { progress: local, storage: 'local-fallback' };
}

/** Сохраняет одну задачу или весь progress. */
export async function saveMarketingPlanProgress(
  payload: { taskId?: string; checked?: boolean; progress?: ProgressMap }
): Promise<{ progress: ProgressMap; storage: StorageMode }> {
  const savedToBackend = await saveBackendProgress(payload);

  if (savedToBackend) {
    const { progress } = await readMarketingPlanProgress();
    return { progress, storage: 'backend' };
  }

  const current = await readLocalProgress();
  let next: ProgressMap;

  if (payload.taskId !== undefined && typeof payload.checked === 'boolean') {
    next = { ...current, [payload.taskId]: payload.checked };
  } else if (payload.progress) {
    next = payload.progress;
  } else {
    next = current;
  }

  await writeLocalProgress(next);
  return { progress: next, storage: 'local-fallback' };
}

/** Сброс прогресса. */
export async function resetMarketingPlanProgress(): Promise<{
  progress: ProgressMap;
  storage: StorageMode;
}> {
  const deleted = await deleteBackendProgress();

  if (deleted) {
    return { progress: {}, storage: 'backend' };
  }

  await writeLocalProgress({});
  return { progress: {}, storage: 'local-fallback' };
}
