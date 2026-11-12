/**
 * Shared Money and Time Formatters
 * Reference: .agents/rules/money-time-format.md
 */

const LAGOS_TIMEZONE = "Africa/Lagos";

/**
 * Formats whole kobo into naira display.
 * ₦85,000 when kobo is 0; ₦91,375.50 when kobo is non-zero.
 */
export function formatMoney(kobo: number): string {
  const isNegative = kobo < 0;
  const absKobo = Math.abs(kobo);
  const naira = Math.floor(absKobo / 100);
  const remKobo = absKobo % 100;

  const nairaStr = naira.toLocaleString("en-NG");
  const prefix = isNegative ? "-₦" : "₦";

  if (remKobo === 0) {
    return `${prefix}${nairaStr}`;
  }
  const koboStr = remKobo.toString().padStart(2, "0");
  return `${prefix}${nairaStr}.${koboStr}`;
}

/**
 * Converts a UTC instant (Date or ISO string) to an Africa/Lagos time string (e.g. "9:14am").
 */
export function formatTime(instant: Date | string): string {
  const date = typeof instant === "string" ? new Date(instant) : instant;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: LAGOS_TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);

  const hour = parts.find((p) => p.type === "hour")?.value ?? "";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "";
  const dayPeriod = (parts.find((p) => p.type === "dayPeriod")?.value ?? "").toLowerCase();

  return `${hour}:${minute}${dayPeriod}`;
}

/**
 * Converts minutes after Lagos midnight into a time string (e.g. 480 -> "8:00am", 1200 -> "8:00pm").
 */
export function formatMinutesAsTime(minutesAfterMidnight: number): string {
  const totalMins = Math.abs(minutesAfterMidnight) % (24 * 60);
  const hour24 = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const dayPeriod = hour24 < 12 ? "am" : "pm";
  const minsStr = mins.toString().padStart(2, "0");
  return `${hour12}:${minsStr}${dayPeriod}`;
}

/**
 * Formats a date in Africa/Lagos time.
 * "30 Nov" for the current calendar year; "30 Nov 2027" for other years.
 */
export function formatDate(instant: Date | string, referenceNow: Date = new Date()): string {
  const date = typeof instant === "string" ? new Date(instant) : instant;

  const currentYearFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: LAGOS_TIMEZONE,
    year: "numeric",
  });
  const nowYear = currentYearFormatter.format(referenceNow);
  const targetYear = currentYearFormatter.format(date);

  const dayMonthFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: LAGOS_TIMEZONE,
    day: "numeric",
    month: "short",
  });
  const dayMonth = dayMonthFormatter.format(date);

  if (targetYear === nowYear) {
    return dayMonth;
  }
  return `${dayMonth} ${targetYear}`;
}

/**
 * Formats room hours used vs total: "3 of 10" or "2.5 of 10" (drops trailing .0).
 */
export function formatRoomHours(usedHours: number, totalHours: number): string {
  const formatHour = (h: number): string => {
    return Number.isInteger(h) ? h.toString() : h.toFixed(1);
  };
  return `${formatHour(usedHours)} of ${formatHour(totalHours)}`;
}

/**
 * Freshness lines for data display.
 */
export function formatFreshness(updatedAt: Date | string, isOffline = false): string {
  const timeStr = formatTime(updatedAt);
  if (isOffline) {
    return `Offline. As of ${timeStr}`;
  }
  return `Updated ${timeStr}`;
}

/**
 * Converts a UTC instant into an Africa/Lagos calendar date string (YYYY-MM-DD).
 */
export function lagosDate(instant: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: LAGOS_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(instant);
}

