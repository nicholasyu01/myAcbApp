import {
  format,
  previousMonday,
  previousFriday,
  isWeekend,
  isSaturday,
  parseISO,
  isValid,
} from "date-fns";

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
  return format(date, "yyyy-MM-dd");
}

/**
 * Formats a date for display
 */
export function formatDateForDisplay(date: Date | string): string {
  let dt: Date;

  if (typeof date === "string") {
    // If the input is a date-only string (YYYY-MM-DD), construct a local Date
    // to avoid timezone shifts that can move the day backward when parsed as UTC.
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [y, m, d] = date.split("-").map(Number);
      dt = new Date(y, m - 1, d);
    } else {
      // Fallback to parseISO for full ISO timestamps
      dt = parseISO(date);
    }
  } else {
    dt = date;
  }

  // If parsed date is invalid, return the original string (if provided) or an empty string
  if (!isValid(dt)) {
    return typeof date === "string" ? date : "";
  }

  // Abbreviated month with comma, e.g. 'Feb, 9, 2026'
  return format(dt, "MMM, d, yyyy");
}
