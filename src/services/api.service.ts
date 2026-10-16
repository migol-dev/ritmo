import { Habit } from '../types/habit.types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const HabitApiService = {
  async fetchHabits(): Promise<Habit[]> {
    const res = await fetch(`${API_BASE}/habits`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    const json = await res.json();
    return json.data;
  },

  async createHabit(habitData: Partial<Habit>): Promise<Habit> {
    const res = await fetch(`${API_BASE}/habits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(habitData)
    });
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    const json = await res.json();
    return json.data;
  },

  async updateHabit(id: string, updates: Partial<Habit>): Promise<Habit> {
    const res = await fetch(`${API_BASE}/habits/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    const json = await res.json();
    return json.data;
  },

  async deleteHabit(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/habits/${id}`, {
      method: 'DELETE'
    });
    return res.ok;
  },

  async toggleDay(id: string, isoDate: string): Promise<Habit> {
    const res = await fetch(`${API_BASE}/habits/${id}/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isoDate })
    });
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    const json = await res.json();
    return json.data;
  },

  async syncAll(habits: Habit[]): Promise<boolean> {
    const res = await fetch(`${API_BASE}/habits/sync-all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ habits })
    });
    return res.ok;
  },

  async resetDefaults(): Promise<boolean> {
    const res = await fetch(`${API_BASE}/backup/reset`, {
      method: 'POST'
    });
    return res.ok;
  }
};
