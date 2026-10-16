import { Router } from 'express';
import { HabitsController } from '../controllers/habits.controller';

const router = Router();

router.get('/', HabitsController.getAll);
router.get('/:id', HabitsController.getById);
router.post('/', HabitsController.create);
router.put('/:id', HabitsController.update);
router.delete('/:id', HabitsController.delete);
router.post('/:id/toggle', HabitsController.toggleDay);
router.post('/sync-all', HabitsController.syncAll);

export default router;
