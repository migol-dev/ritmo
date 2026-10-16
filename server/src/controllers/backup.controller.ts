import { Request, Response } from 'express';
import { LocalStorageService } from '../services/storage.service';

export const BackupController = {
  exportData: (_req: Request, res: Response) => {
    try {
      const store = LocalStorageService.readStore();
      res.setHeader('Content-Disposition', `attachment; filename=ritmo-backup-${new Date().toISOString().slice(0, 10)}.json`);
      res.setHeader('Content-Type', 'application/json');
      res.json(store);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al exportar datos', error });
    }
  },

  importData: (req: Request, res: Response) => {
    try {
      const { habits } = req.body;
      if (!Array.isArray(habits)) {
        return res.status(400).json({ success: false, message: 'Formato de importación inválido' });
      }
      LocalStorageService.saveHabits(habits);
      res.json({ success: true, count: habits.length, message: 'Datos importados y guardados con éxito' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al importar datos', error });
    }
  },

  resetDefaults: (_req: Request, res: Response) => {
    try {
      const habits = LocalStorageService.resetToSeed();
      res.json({ success: true, count: habits.length, message: 'Valores de fábrica restablecidos con éxito' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al reiniciar datos', error });
    }
  }
};
