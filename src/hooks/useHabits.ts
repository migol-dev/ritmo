import { useState, useEffect, useMemo, useCallback } from 'react';
import { Habit, EnrichedHabit, Discipline, Period } from '../types/habit.types';
import { LensMode, ThemeMode, TelemetrySummary } from '../types/telemetry.types';
import { HabitRepository } from '../services/repository';
import { buildWeekDays, formatDateISO, ANCHOR_TODAY } from '../utils/date.utils';
import { computeHabitMetrics } from '../utils/metrics.utils';
import { exportHabitsToCSV } from '../utils/csv.utils';
import { ClientStorageService } from '../services/local-storage.service';

export function useHabits(playTactileSound?: (type: 'check' | 'uncheck' | 'pop') => void) {
  const [habits, setHabits] = useState<Habit[]>(() => ClientStorageService.getHabits());
  const [theme, setTheme] = useState<ThemeMode>('paper');
  const [weekOffset, setWeekOffset] = useState(0);
  const [activeDiscipline, setActiveDiscipline] = useState<'Todas' | Discipline>('Todas');
  const [analyticalLens, setAnalyticalLens] = useState<LensMode>('cadence');
  const [selectedDayISO, setSelectedDayISO] = useState<string>(formatDateISO(ANCHOR_TODAY));
  const [inspectedHabitId, setInspectedHabitId] = useState<string | null>(null);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  // Cargar estado inicial desde el repositorio (Offline-First)
  useEffect(() => {
    let isMounted = true;
    HabitRepository.loadInitial().then((loaded) => {
      if (isMounted && loaded.length > 0) {
        setHabits(loaded);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const notify = useCallback((msg: string) => {
    setStatusBanner(msg);
    setTimeout(() => {
      setStatusBanner((prev) => (prev === msg ? null : prev));
    }, 2800);
  }, []);

  const todayISO = formatDateISO(ANCHOR_TODAY);
  const weekDays = useMemo(() => buildWeekDays(ANCHOR_TODAY, weekOffset), [weekOffset]);

  // Mantener coherencia del día seleccionado al navegar de semana
  useEffect(() => {
    const existsInWeek = weekDays.some((d) => d.iso === selectedDayISO);
    if (!existsInWeek) {
      const fallback = weekDays.find((d) => d.isToday) || weekDays[weekDays.length - 1];
      setSelectedDayISO(fallback.iso);
    }
  }, [weekDays, selectedDayISO]);

  const enrichedHabits: EnrichedHabit[] = useMemo(() => {
    return habits.map((h, index) => ({
      ...h,
      code: String(index + 1).padStart(2, '0'),
      metrics: computeHabitMetrics(h, weekDays)
    }));
  }, [habits, weekDays]);

  const filteredHabits = useMemo(() => {
    if (activeDiscipline === 'Todas') return enrichedHabits;
    return enrichedHabits.filter((h) => h.discipline === activeDiscipline);
  }, [enrichedHabits, activeDiscipline]);

  const telemetry: TelemetrySummary = useMemo(() => {
    const total = enrichedHabits.length;
    const doneToday = enrichedHabits.filter((h) => h.metrics.completedToday).length;
    const todayPct = total > 0 ? Math.round((doneToday / total) * 100) : 0;

    let totalWeekDone = 0;
    let totalWeekTarget = 0;
    let longestActiveStreak = 0;
    let longestStreakHabit = '—';

    enrichedHabits.forEach((h) => {
      totalWeekDone += h.metrics.weekCount;
      totalWeekTarget += h.metrics.target;
      if (h.metrics.currentStreak > longestActiveStreak) {
        longestActiveStreak = h.metrics.currentStreak;
        longestStreakHabit = h.name;
      }
    });

    const weeklyCadencePct =
      totalWeekTarget > 0 ? Math.min(100, Math.round((totalWeekDone / totalWeekTarget) * 100)) : 0;

    const dailyBreakdown = weekDays.map((d) => {
      const completedList = enrichedHabits.filter((h) => !!h.history[d.iso]);
      const count = completedList.length;
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
      return {
        ...d,
        count,
        total,
        pct,
        completedList
      };
    });

    const perfectDays = dailyBreakdown.filter((d) => d.total > 0 && d.count === d.total).length;

    let sum28 = 0;
    enrichedHabits.forEach((h) => {
      sum28 += h.metrics.rate28;
    });
    const avgRate28 = total > 0 ? Math.round(sum28 / total) : 0;

    return {
      total,
      doneToday,
      todayPct,
      totalWeekDone,
      totalWeekTarget,
      weeklyCadencePct,
      longestActiveStreak,
      longestStreakHabit,
      dailyBreakdown,
      perfectDays,
      avgRate28
    };
  }, [enrichedHabits, weekDays]);

  const inspectedHabit = useMemo(
    () => enrichedHabits.find((h) => h.id === inspectedHabitId) || null,
    [enrichedHabits, inspectedHabitId]
  );

  const selectedDayDetails = useMemo(() => {
    return (
      telemetry.dailyBreakdown.find((d) => d.iso === selectedDayISO) ||
      telemetry.dailyBreakdown[0]
    );
  }, [telemetry.dailyBreakdown, selectedDayISO]);

  // Mutaciones de datos
  const toggleHabitDay = useCallback(
    (habitId: string, isoDate: string) => {
      const target = habits.find((h) => h.id === habitId);
      const wasDone = target?.history[isoDate];
      if (wasDone) {
        playTactileSound?.('uncheck');
      } else {
        playTactileSound?.('check');
      }

      HabitRepository.toggleDay(habitId, isoDate, habits).then((next) => {
        setHabits(next);
      });
    },
    [habits, playTactileSound]
  );

  const addHabit = useCallback(
    (name: string, discipline: Discipline, cadenceTarget: number, period: Period) => {
      const clean = name.trim();
      if (!clean) return;

      const created: Habit = {
        id: `rit-${Date.now()}`,
        name: clean,
        discipline,
        cadenceTarget,
        timeCue: period === 'Mañana' ? '08:00' : period === 'Tarde' ? '15:30' : '21:00',
        period,
        protocol: 'Definir disparador ambiental y criterio mínimo de victoria diaria.',
        history: { [todayISO]: true }
      };

      HabitRepository.addHabit(created, habits).then((next) => {
        setHabits(next);
        playTactileSound?.('check');
        notify(`Ritual registrado: "${clean}"`);
      });
    },
    [habits, todayISO, playTactileSound, notify]
  );

  const updateHabitField = useCallback(
    (habitId: string, field: keyof Habit, value: unknown) => {
      HabitRepository.updateHabit(habitId, { [field]: value }, habits).then((next) => {
        setHabits(next);
      });
    },
    [habits]
  );

  const duplicateHabit = useCallback(
    (habit: Habit) => {
      const copy: Habit = {
        ...habit,
        id: `rit-${Date.now()}`,
        name: `${habit.name} (Copia)`,
        history: { ...habit.history }
      };
      HabitRepository.addHabit(copy, habits).then((next) => {
        setHabits(next);
        playTactileSound?.('pop');
        notify(`Ritual duplicado: "${copy.name}"`);
      });
    },
    [habits, playTactileSound, notify]
  );

  const deleteHabit = useCallback(
    (habitId: string) => {
      const target = habits.find((h) => h.id === habitId);
      HabitRepository.deleteHabit(habitId, habits).then((next) => {
        setHabits(next);
        if (inspectedHabitId === habitId) setInspectedHabitId(null);
        playTactileSound?.('uncheck');
        if (target) notify(`Ritual archivado: "${target.name}"`);
      });
    },
    [habits, inspectedHabitId, playTactileSound, notify]
  );

  const toggleAllToday = useCallback(() => {
    const allDone = enrichedHabits.every((h) => h.metrics.completedToday);
    const updated = habits.map((h) => {
      const nextHistory = { ...h.history };
      if (allDone) {
        delete nextHistory[todayISO];
      } else {
        nextHistory[todayISO] = true;
      }
      return { ...h, history: nextHistory };
    });

    HabitRepository.persist(updated).then(() => {
      setHabits(updated);
      playTactileSound?.(allDone ? 'uncheck' : 'check');
      notify(allDone ? 'Registros de hoy reiniciados a pendiente' : 'Todos los rituales de hoy sellados');
    });
  }, [habits, enrichedHabits, todayISO, playTactileSound, notify]);

  const exportCSV = useCallback(() => {
    exportHabitsToCSV(enrichedHabits, todayISO);
    playTactileSound?.('pop');
    notify(`Exportados ${enrichedHabits.length} rituales en .CSV`);
  }, [enrichedHabits, todayISO, playTactileSound, notify]);

  const resetDefaults = useCallback(() => {
    HabitRepository.resetToDefaults().then((resetted) => {
      setHabits(resetted);
      setWeekOffset(0);
      playTactileSound?.('pop');
      notify('Cuaderno reestablecido a valores canónicos iniciales');
    });
  }, [playTactileSound, notify]);

  return {
    habits: enrichedHabits,
    filteredHabits,
    theme,
    setTheme,
    weekOffset,
    setWeekOffset,
    weekDays,
    todayISO,
    activeDiscipline,
    setActiveDiscipline,
    analyticalLens,
    setAnalyticalLens,
    selectedDayISO,
    setSelectedDayISO,
    selectedDayDetails,
    inspectedHabit,
    inspectedHabitId,
    setInspectedHabitId,
    telemetry,
    statusBanner,
    notify,
    toggleHabitDay,
    addHabit,
    updateHabitField,
    duplicateHabit,
    deleteHabit,
    toggleAllToday,
    exportCSV,
    resetDefaults
  };
}
