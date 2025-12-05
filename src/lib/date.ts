import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
} from 'date-fns';

/**
 * Format a timestamp for display in note cards
 * Shows relative time for recent dates, absolute for older
 */
export function formatNoteDate(timestamp: number): string {
  const date = new Date(timestamp);

  if (isToday(date)) {
    return `Today at ${format(date, 'h:mm a')}`;
  }

  if (isYesterday(date)) {
    return `Yesterday at ${format(date, 'h:mm a')}`;
  }

  // For dates within the last week, show relative time
  const daysDiff = Math.floor(
    (Date.now() - timestamp) / (1000 * 60 * 60 * 24)
  );

  if (daysDiff < 7) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  // For older dates, show full date
  return format(date, 'MMM d, yyyy');
}

/**
 * Format a timestamp for detailed view (e.g., note editor)
 */
export function formatNoteDateFull(timestamp: number): string {
  return format(new Date(timestamp), 'MMMM d, yyyy \'at\' h:mm a');
}

