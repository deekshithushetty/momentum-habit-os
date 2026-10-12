import { Router } from 'express';
import { completeHabit, syncQueue, undoHabit } from '../controllers/completionController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { completionSchema } from '../validation/schemas.js';

const router = Router();

router.use(requireAuth);
router.post('/', validate(completionSchema), completeHabit);
router.delete('/', validate(completionSchema), undoHabit);
router.post('/sync', syncQueue);

export default router;
