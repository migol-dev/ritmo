// Fecha ancla realista de referencia: Miércoles 14 de octubre de 2026
export const ANCHOR_TODAY = new Date(2026, 9, 14);

export const DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
export const MONTH_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(date: Date, amount: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + amount);
  return copy;
}

export function getMondayOfWeek(baseDate: Date, weekOffset: number = 0): Date {
  const day = baseDate.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(baseDate, diff + weekOffset * 7);
}

export function buildWeekDays(baseDate: Date, weekOffset: number = 0) {
  const monday = getMondayOfWeek(baseDate, weekOffset);
  const todayISO = formatDateISO(baseDate);

  return Array.from({ length: 7 }, (_, i) => {
    const d = addDays(monday, i);
    const iso = formatDateISO(d);
    return {
      date: d,
      iso,
      shortLabel: DAY_LABELS[i],
      dayNum: String(d.getDate()).padStart(2, '0'),
      monthShort: MONTH_SHORT[d.getMonth()],
      isToday: iso === todayISO,
      isFuture: d > baseDate
    };
  });
}
