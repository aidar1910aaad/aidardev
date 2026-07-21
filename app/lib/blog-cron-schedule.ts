/** Vercel cron: `0 6 * * 1,3,5` → Mon/Wed/Fri 06:00 UTC */

const CRON_UTC_HOUR = 6;
const CRON_UTC_MINUTE = 0;
const CRON_WEEKDAYS = [1, 3, 5] as const; // Mon, Wed, Fri

const weekdayRu: Record<number, string> = {
  0: 'воскресенье',
  1: 'понедельник',
  2: 'вторник',
  3: 'среда',
  4: 'четверг',
  5: 'пятница',
  6: 'суббота',
};

export function getNextBlogAutoGenerateAt(from = new Date()): Date {
  const start = new Date(from);
  for (let dayOffset = 0; dayOffset < 8; dayOffset += 1) {
    const candidate = new Date(Date.UTC(
      start.getUTCFullYear(),
      start.getUTCMonth(),
      start.getUTCDate() + dayOffset,
      CRON_UTC_HOUR,
      CRON_UTC_MINUTE,
      0,
      0,
    ));
    if (!CRON_WEEKDAYS.includes(candidate.getUTCDay() as 1 | 3 | 5)) continue;
    if (candidate.getTime() > from.getTime()) return candidate;
  }
  // Fallback: next Monday
  return new Date(Date.UTC(
    start.getUTCFullYear(),
    start.getUTCMonth(),
    start.getUTCDate() + 7,
    CRON_UTC_HOUR,
    CRON_UTC_MINUTE,
    0,
    0,
  ));
}

export function formatBlogAutoGenerateSchedule(nextAt: Date, now = new Date()) {
  const almaty = new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Asia/Almaty',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(nextAt);

  const utc = new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(nextAt);

  const diffMs = nextAt.getTime() - now.getTime();
  const diffHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
  const diffDays = Math.floor(diffHours / 24);
  const remHours = diffHours % 24;

  let relative = '';
  if (diffMs < 60 * 60 * 1000) relative = 'менее чем через час';
  else if (diffDays === 0) relative = `через ${diffHours} ч`;
  else if (diffDays === 1) relative = `завтра · через ${diffHours} ч`;
  else relative = `через ${diffDays} дн. ${remHours} ч`;

  return {
    nextAt,
    almatyLabel: almaty,
    utcLabel: `${utc} UTC`,
    relative,
    weeklyNote: 'Авто: пн / ср / пт в 11:00 по Алматы (06:00 UTC)',
    weekdayRu: weekdayRu[nextAt.getUTCDay()] || '',
  };
}
