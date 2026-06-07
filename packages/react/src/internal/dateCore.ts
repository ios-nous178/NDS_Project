export const DAYS_OF_WEEK = ["일", "월", "화", "수", "목", "금", "토"] as const;

export const DAY_MS = 86400000;

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

export const addDays = (d: Date, n: number) => {
  const r = startOfDay(d);
  r.setDate(r.getDate() + n);
  return r;
};

export const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);

export const addCalendarMonths = (d: Date, n: number) => {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(d.getDate(), lastDay));
  return target;
};

export const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const isBeforeDay = (a: Date, b: Date) => startOfDay(a).getTime() < startOfDay(b).getTime();

export const isAfterDay = (a: Date, b: Date) => startOfDay(a).getTime() > startOfDay(b).getTime();

export const isBetweenDays = (d: Date, from?: Date, to?: Date) => {
  if (!from || !to) return false;
  const t = startOfDay(d).getTime();
  return t > startOfDay(from).getTime() && t < startOfDay(to).getTime();
};

export const formatYM = (d: Date) => `${d.getFullYear()}년 ${d.getMonth() + 1}월`;

export const formatYMD = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const toDateKey = formatYMD;

export function buildMonthGrid(viewDate: Date): Date[] {
  const first = startOfMonth(viewDate);
  const startWeekday = first.getDay();
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - startWeekday);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
}

export const isOutOfBounds = (d: Date, minDate?: Date, maxDate?: Date) => {
  const day = startOfDay(d);
  if (minDate && day < startOfDay(minDate)) return true;
  if (maxDate && day > startOfDay(maxDate)) return true;
  return false;
};

export const clampToBounds = (d: Date, minDate?: Date, maxDate?: Date) => {
  const day = startOfDay(d);
  if (minDate && day < startOfDay(minDate)) return startOfDay(minDate);
  if (maxDate && day > startOfDay(maxDate)) return startOfDay(maxDate);
  return day;
};

export const findEnabledDate = (
  date: Date,
  isDisabled: (d: Date) => boolean,
  direction: 1 | -1 = 1,
): Date => {
  let candidate = startOfDay(date);
  for (let i = 0; i < 370; i += 1) {
    if (!isDisabled(candidate)) return candidate;
    candidate = addDays(candidate, direction);
  }
  return startOfDay(date);
};
