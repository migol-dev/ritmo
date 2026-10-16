import { Habit, HabitMetrics } from '../types/habit.types';
import { formatDateISO, addDays, ANCHOR_TODAY } from './date.utils';

export function computeHabitMetrics(habit: Habit, weekDays: { iso: string }[]): HabitMetrics {
  const todayISO = formatDateISO(ANCHOR_TODAY);
  const yesterdayISO = formatDateISO(addDays(ANCHOR_TODAY, -1));

  // Racha activa continua hacia atrás desde hoy (o ayer si hoy aún está pendiente)
  let currentStreak = 0;
  let cursor = new Date(ANCHOR_TODAY);
  if (!habit.history[todayISO] && habit.history[yesterdayISO]) {
    cursor = addDays(ANCHOR_TODAY, -1);
  }
  while (habit.history[formatDateISO(cursor)]) {
    currentStreak += 1;
    cursor = addDays(cursor, -1);
  }

  // Mejor racha en ventana histórica de 45 días
  let peakStreak = currentStreak;
  let running = 0;
  for (let i = 45; i >= 0; i--) {
    const key = formatDateISO(addDays(ANCHOR_TODAY, -i));
    if (habit.history[key]) {
      running += 1;
      if (running > peakStreak) peakStreak = running;
    } else {
      running = 0;
    }
  }

  // Cumplimiento en la semana actualmente visible
  let weekCount = 0;
  weekDays.forEach((d) => {
    if (habit.history[d.iso]) weekCount += 1;
  });

  // Tasa de los últimos 28 días
  let last28Count = 0;
  for (let i = 0; i < 28; i++) {
    if (habit.history[formatDateISO(addDays(ANCHOR_TODAY, -i))]) {
      last28Count += 1;
    }
  }

  return {
    currentStreak,
    peakStreak,
    weekCount,
    target: habit.cadenceTarget || 7,
    rate28: Math.round((last28Count / 28) * 100),
    completedToday: !!habit.history[todayISO]
  };
}
