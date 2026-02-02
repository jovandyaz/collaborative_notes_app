import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

/**
 * Type for date values that can come from various sources
 * - number: Unix timestamp in milliseconds
 * - Date: JavaScript Date object
 * - string: ISO 8601 date string (from JSON API)
 */
type DateValue = number | Date | string;

function normalizeToDate(value: DateValue): Date | null {
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'string') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value) || value < 0) {
      return null;
    }
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }

  return null;
}

export function formatNoteDate(timestamp: DateValue): string {
  const date = normalizeToDate(timestamp);

  if (!date) {
    return 'Invalid date';
  }

  const now = Date.now();
  const dateMs = date.getTime();

  if (dateMs > now) {
    return 'Just now';
  }

  if (isToday(date)) {
    return `Today at ${format(date, 'h:mm a')}`;
  }

  if (isYesterday(date)) {
    return `Yesterday at ${format(date, 'h:mm a')}`;
  }

  const daysDiff = Math.floor((now - dateMs) / (1000 * 60 * 60 * 24));

  if (daysDiff < 7) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  return format(date, 'MMM d, yyyy');
}

export function formatNoteDateFull(timestamp: DateValue): string {
  const date = normalizeToDate(timestamp);

  if (!date) {
    return 'Invalid date';
  }

  return format(date, "MMMM d, yyyy 'at' h:mm a");
}
