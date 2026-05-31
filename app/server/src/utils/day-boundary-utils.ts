export function getUtcDayRange(date: string, timezone = 'UTC') {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('Date must use YYYY-MM-DD format');
  }

  const start = zonedDateToUtc(date, timezone, 0, 0, 0);
  const end = zonedDateToUtc(date, timezone, 23, 59, 59, 999);

  return { start, end };
}

function zonedDateToUtc(date: string, timezone: string, hour: number, minute: number, second: number, millisecond = 0) {
  const [year, month, day] = date.split('-').map(Number);
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, second, millisecond));
  const offset = getTimezoneOffset(utcGuess, timezone);

  return new Date(utcGuess.getTime() - offset);
}

function getTimezoneOffset(date: Date, timezone: string) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );

  return asUtc - date.getTime();
}
