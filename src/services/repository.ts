import { Habit } from '../types/habit.types';
import { ClientStorageService } from './local-storage.service';
import { HabitApiService } from './api.service';

/**
 * Patrón Repository Offline-First:
 * - Lee y escribe primero en el almacenamiento local para latencia cero (<1ms).
 * - Sincroniza asíncronamente con el backend local (http://localhost:3001/api).
 * - Si el backend local no está disponible, la app sigue funcionando fluidamente sin errores.
 */
export const HabitRepository = {
  async loadInitial(): Promise<Habit[]> {
    const cached = ClientStorageService.getHabits();

    try {
      // Intentar sincronizar con el backend local en segundo plano
      const remote = await HabitApiService.fetchHabits();
      if (Array.isArray(remote) && remote.length > 0) {
        ClientStorageService.saveHabits(remote);
        return remote;
      }
    } catch {
      // Backend local desconectado o en arranque, usar caché local silenciosamente
    }

    return cached;
  },

  async persist(habits: Habit[]): Promise<void> {
    // 1. Guardar inmediatamente en cliente
    ClientStorageService.saveHabits(habits);

    // 2. Sincronizar en segundo plano con el backend local
    try {
      await HabitApiService.syncAll(habits);
    } catch {
      // Offline: se mantendrá persistido en el cliente
    }
  },

  async toggleDay(habitId: string, isoDate: string, currentHabits: Habit[]): Promise<Habit[]> {
    const updated = currentHabits.map((h) => {
      if (h.id !== habitId) return h;
      const nextHistory = { ...h.history };
      if (nextHistory[isoDate]) {
        delete nextHistory[isoDate];
      } else {
        nextHistory[isoDate] = true;
      }
      return {
        ...h,
        history: nextHistory,
        updatedAt: new Date().toISOString()
      };
    });

    this.persist(updated);
    return updated;
  },

  async addHabit(newHabit: Habit, currentHabits: Habit[]): Promise<Habit[]> {
    const updated = [...currentHabits, newHabit];
    this.persist(updated);
    return updated;
  },

  async updateHabit(id: string, updates: Partial<Habit>, currentHabits: Habit[]): Promise<Habit[]> {
    const updated = currentHabits.map((h) => (h.id === id ? { ...h, ...updates, updatedAt: new Date().toISOString() } : h));
    this.persist(updated);
    return updated;
  },

  async deleteHabit(id: string, currentHabits: Habit[]): Promise<Habit[]> {
    const updated = currentHabits.filter((h) => h.id !== id);
    this.persist(updated);
    return updated;
  },

  async resetToDefaults(): Promise<Habit[]> {
    ClientStorageService.clear();
    try {
      await HabitApiService.resetDefaults();
      const remote = await HabitApiService.fetchHabits();
      ClientStorageService.saveHabits(remote);
      return remote;
    } catch {
      const fallback = ClientStorageService.getHabits();
      return fallback;
    }
  }
};
