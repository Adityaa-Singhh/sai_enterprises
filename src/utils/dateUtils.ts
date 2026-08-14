/**
 * Date Utilities for Sai Enterprises
 * Standardizes date & time formatting across customer forms and admin inbox.
 */

export function formatDateTime(input?: string | number | Date | null): string {
  if (!input) return 'Just now';

  let d: Date;
  if (typeof input === 'number' || typeof input === 'string') {
    d = new Date(input);
  } else if (input instanceof Date) {
    d = input;
  } else {
    return String(input);
  }

  if (isNaN(d.getTime())) return String(input);

  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();

  const timeStr = d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  if (isToday) {
    return `Today, ${timeStr}`;
  }

  if (isYesterday) {
    return `Yesterday, ${timeStr}`;
  }

  const dateStr = d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return `${dateStr}, ${timeStr}`;
}
