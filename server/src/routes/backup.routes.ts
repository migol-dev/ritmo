import { Router } from 'express';
import { BackupController } from '../controllers/backup.controller';

const router = Router();

router.get('/export', BackupController.exportData);
router.post('/import', BackupController.importData);
router.post('/reset', BackupController.resetDefaults);

export default router;
