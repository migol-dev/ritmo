import { Request, Response } from 'express';
import { LocalStorageService } from '../services/storage.service';
import { Habit } from '../models/habit.model';

export const HabitsController = {
  getAll: (_req: Request, res: Response) => {
    try {
      const habits = LocalStorageService.getHabits();
      res.json({ success: true, count: habits.length, data: habits });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al recuperar hábitos', error });
    }
  },

  getById: (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const habits = LocalStorageService.getHabits();
      const habit = habits.find((h) => h.id === id);
      if (!habit) {
        return res.status(404).json({ success: false, message: 'Hábito no encontrado' });
      }
      res.json({ success: true, data: habit });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al buscar el hábito', error });
    }
  },

  create: (req: Request, res: Response) => {
    try {
      const { name, discipline, cadenceTarget, timeCue, period, protocol, history } = req.body;
      if (!name || typeof name !== 'string') {
        return res.status(400).json({ success: false, message: 'El nombre del hábito es obligatorio' });
      }

      const habits = LocalStorageService.getHabits();
      const newHabit: Habit = {
        id: `rit-${Date.now()}`,
        name: name.trim(),
        discipline: discipline || 'Enfoque',
        cadenceTarget: Number(cadenceTarget) || 6,
        timeCue: timeCue || '08:00',
        period: period || 'Mañana',
        protocol: protocol || 'Definir disparador ambiental y victoria mínima.',
        history: history || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updated = [...habits, newHabit];
      LocalStorageService.saveHabits(updated);
      res.status(201).json({ success: true, data: newHabit });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al crear el hábito', error });
    }
  },

  update: (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const habits = LocalStorageService.getHabits();
      const index = habits.findIndex((h) => h.id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Hábito no encontrado' });
      }

      const existing = habits[index];
      const updatedHabit: Habit = {
        ...existing,
        ...req.body,
        id: existing.id,
        updatedAt: new Date().toISOString()
      };

      habits[index] = updatedHabit;
      LocalStorageService.saveHabits(habits);
      res.json({ success: true, data: updatedHabit });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al actualizar el hábito', error });
    }
  },

  delete: (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const habits = LocalStorageService.getHabits();
      const filtered = habits.filter((h) => h.id !== id);
      if (filtered.length === habits.length) {
        return res.status(404).json({ success: false, message: 'Hábito no encontrado' });
      }

      LocalStorageService.saveHabits(filtered);
      res.json({ success: true, message: 'Hábito eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al eliminar el hábito', error });
    }
  },

  toggleDay: (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { isoDate } = req.body;
      if (!isoDate || typeof isoDate !== 'string') {
        return res.status(400).json({ success: false, message: 'La fecha isoDate (YYYY-MM-DD) es obligatoria' });
      }

      const habits = LocalStorageService.getHabits();
      const target = habits.find((h) => h.id === id);
      if (!target) {
        return res.status(404).json({ success: false, message: 'Hábito no encontrado' });
      }

      const nextHistory = { ...target.history };
      let action: 'checked' | 'unchecked' = 'checked';
      if (nextHistory[isoDate]) {
        delete nextHistory[isoDate];
        action = 'unchecked';
      } else {
        nextHistory[isoDate] = true;
      }

      target.history = nextHistory;
      target.updatedAt = new Date().toISOString();
      LocalStorageService.saveHabits(habits);

      res.json({ success: true, action, data: target });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al alternar día del hábito', error });
    }
  },

  syncAll: (req: Request, res: Response) => {
    try {
      const { habits } = req.body;
      if (!Array.isArray(habits)) {
        return res.status(400).json({ success: false, message: 'El payload debe contener un array de hábitos' });
      }

      LocalStorageService.saveHabits(habits);
      res.json({ success: true, count: habits.length, message: 'Sincronización completa exitosa' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error durante la sincronización', error });
    }
  }
};
