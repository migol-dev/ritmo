import { Router } from 'express';
import habitsRoutes from './habits.routes';
import telemetryRoutes from './telemetry.routes';
import backupRoutes from './backup.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'ritmo-local-backend',
    version: '3.0.0',
    timestamp: new Date().toISOString()
  });
});

router.use('/habits', habitsRoutes);
router.use('/telemetry', telemetryRoutes);
router.use('/backup', backupRoutes);

export default router;
