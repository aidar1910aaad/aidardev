import { formatBlogAutoGenerateSchedule, getNextBlogAutoGenerateAt } from '../blog-cron-schedule';

describe('blog-cron-schedule', () => {
  it('picks the next Tuesday 05:00 UTC', () => {
    // Sunday 2026-07-19 12:00 UTC → Tuesday 05:00
    const from = new Date(Date.UTC(2026, 6, 19, 12, 0, 0));
    const next = getNextBlogAutoGenerateAt(from);
    expect(next.toISOString()).toBe('2026-07-21T05:00:00.000Z');
  });

  it('runs the same Tuesday when it is still before 05:00 UTC', () => {
    const from = new Date(Date.UTC(2026, 6, 21, 4, 59, 0)); // Tue 04:59 UTC
    expect(getNextBlogAutoGenerateAt(from).toISOString()).toBe('2026-07-21T05:00:00.000Z');
  });

  it('skips to next week on Tuesday after the run', () => {
    const from = new Date(Date.UTC(2026, 6, 21, 6, 0, 0)); // Tue 06:00 UTC
    const next = getNextBlogAutoGenerateAt(from);
    expect(next.toISOString()).toBe('2026-07-28T05:00:00.000Z');
  });

  it('formats almaty-friendly label', () => {
    const next = new Date('2026-07-21T05:00:00.000Z');
    const formatted = formatBlogAutoGenerateSchedule(next, new Date('2026-07-20T12:00:00.000Z'));
    expect(formatted.weeklyNote).toBe('Авто: вторник в 10:00 по Алматы (05:00 UTC)');
    expect(formatted.weekdayRu).toBe('вторник');
    expect(formatted.utcLabel).toContain('05:00');
    expect(formatted.almatyLabel).toContain('10:00');
  });
});
