import { format, previousMonday, previousFriday, isWeekend, isSaturday } from 'date-fns';

/**
 * Adjusts a date to the previous weekday if it falls on a weekend
 * Saturday -> Friday
 * Sunday -> Friday
 */
export function adjustToWeekday(date: Date): Date {
  if (!isWeekend(date)) {
    return date;
  }
  
  // If Saturday, go back to Friday
  // If Sunday, go back to Friday
  return isSaturday(date) ? previousFriday(date) : previousFriday(date);
}

/**
 * Formats a date as YYYY-MM-DD
 */
export function formatDateForApi(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Formats a date for display
 */
export function formatDateForDisplay(date: Date): string {
  return format(date, 'MMMM d, yyyy');
}
