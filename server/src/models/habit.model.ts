export interface Habit {
  id: string;
  code?: string;
  name: string;
  discipline: 'Enfoque' | 'Cuerpo' | 'Mente' | 'Descanso';
  cadenceTarget: number;
  timeCue: string;
  period: 'Mañana' | 'Tarde' | 'Noche';
  protocol: string;
  history: Record<string, boolean>;
  createdAt?: string;
  updatedAt?: string;
}

export interface HabitStoreData {
  version: string;
  lastSync: string;
  habits: Habit[];
}
