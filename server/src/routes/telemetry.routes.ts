import { Router } from 'express';
import { TelemetryController } from '../controllers/telemetry.controller';

const router = Router();

router.get('/', TelemetryController.getSummary);
router.get('/summary', TelemetryController.getSummary);

export default router;
