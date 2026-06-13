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

/**
 * 한 달치 6주(42칸) 그리드를 만든다. 모든 날짜 컴포넌트(Calendar/DatePicker/DateRangePicker)가
 * 공유하는 단일 월-그리드 엔진. `weekStartsOn` 으로 주 시작 요일을 정한다(0=일, 1=월).
 * 기본값 0 은 기존 호출부(일요일 시작)와 호환된다.
 */
export function buildMonthGrid(viewDate: Date, weekStartsOn: 0 | 1 = 0): Date[] {
  const first = startOfMonth(viewDate);
  const offset = (first.getDay() - weekStartsOn + 7) % 7;
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - offset);
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
