import { Habit } from '../types/habit.types';
import { createInitialHabits } from '../constants/initialHabits';

const STORAGE_KEY = 'ritmo_estudio_editorial_v3';

export const ClientStorageService = {
  getHabits(): Habit[] {
    if (typeof window === 'undefined') return createInitialHabits();
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.habits) && parsed.habits.length > 0) {
          return parsed.habits;
        }
      }
    } catch {
      // Ignorar error de parsing
    }
    return createInitialHabits();
  },

  saveHabits(habits: Habit[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ habits }));
    } catch {
      // Ignorar límite de almacenamiento
    }
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
};
