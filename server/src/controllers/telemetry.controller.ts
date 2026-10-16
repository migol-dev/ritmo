import { Request, Response } from 'express';
import { LocalStorageService } from '../services/storage.service';

export const TelemetryController = {
  getSummary: (_req: Request, res: Response) => {
    try {
      const habits = LocalStorageService.getHabits();
      const todayISO = new Date(2026, 9, 14).toISOString().slice(0, 10);
      const total = habits.length;
      const completedToday = habits.filter((h) => !!h.history[todayISO]).length;
      const todayPct = total > 0 ? Math.round((completedToday / total) * 100) : 0;

      res.json({
        success: true,
        data: {
          todayISO,
          totalHabits: total,
          completedToday,
          todayPct,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al obtener telemetría', error });
    }
  }
};
