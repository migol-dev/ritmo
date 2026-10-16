export type Discipline = 'Enfoque' | 'Cuerpo' | 'Mente' | 'Descanso';
export type Period = 'Mañana' | 'Tarde' | 'Noche';

export interface Habit {
  id: string;
  code?: string;
  name: string;
  discipline: Discipline;
  cadenceTarget: number;
  timeCue: string;
  period: Period;
  protocol: string;
  history: Record<string, boolean>;
  createdAt?: string;
  updatedAt?: string;
}

export interface HabitMetrics {
  currentStreak: number;
  peakStreak: number;
  weekCount: number;
  target: number;
  rate28: number;
  completedToday: boolean;
}

export interface EnrichedHabit extends Habit {
  code: string;
  metrics: HabitMetrics;
}
