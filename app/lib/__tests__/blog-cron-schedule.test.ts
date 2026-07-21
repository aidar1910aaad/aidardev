import { formatBlogAutoGenerateSchedule, getNextBlogAutoGenerateAt } from '../blog-cron-schedule';

describe('blog-cron-schedule', () => {
  it('picks next Mon/Wed/Fri 06:00 UTC', () => {
    // Sunday 2026-07-19 12:00 UTC → next is Monday 06:00
    const from = new Date(Date.UTC(2026, 6, 19, 12, 0, 0));
    const next = getNextBlogAutoGenerateAt(from);
    expect(next.toISOString()).toBe('2026-07-20T06:00:00.000Z');
  });

  it('skips past monday slot on monday afternoon', () => {
    const from = new Date(Date.UTC(2026, 6, 20, 7, 0, 0)); // Mon 07:00 UTC
    const next = getNextBlogAutoGenerateAt(from);
    expect(next.toISOString()).toBe('2026-07-22T06:00:00.000Z'); // Wed
  });

  it('formats almaty-friendly label', () => {
    const next = new Date('2026-07-22T06:00:00.000Z');
    const formatted = formatBlogAutoGenerateSchedule(next, new Date('2026-07-20T12:00:00.000Z'));
    expect(formatted.weeklyNote).toContain('пн / ср / пт');
    expect(formatted.utcLabel).toContain('UTC');
    expect(formatted.almatyLabel.length).toBeGreaterThan(5);
  });
});
