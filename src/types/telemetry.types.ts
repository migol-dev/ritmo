import { EnrichedHabit } from './habit.types';

export type LensMode = 'cadence' | 'streaks' | 'matrix28' | 'chronotype';
export type ThemeMode = 'paper' | 'obsidian';

export interface WeekDay {
  date: Date;
  iso: string;
  shortLabel: string;
  dayNum: string;
  monthShort: string;
  isToday: boolean;
  isFuture: boolean;
}

export interface DailyBreakdownItem extends WeekDay {
  count: number;
  total: number;
  pct: number;
  completedList: EnrichedHabit[];
}

export interface TelemetrySummary {
  total: number;
  doneToday: number;
  todayPct: number;
  totalWeekDone: number;
  totalWeekTarget: number;
  weeklyCadencePct: number;
  longestActiveStreak: number;
  longestStreakHabit: string;
  dailyBreakdown: DailyBreakdownItem[];
  perfectDays: number;
  avgRate28: number;
}
