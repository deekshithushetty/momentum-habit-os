import { Router } from 'express';
import { createHabit, deleteHabit, getHabits, habitDetail, updateHabit } from '../controllers/habitController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { habitSchema } from '../validation/schemas.js';

const router = Router();

router.use(requireAuth);
router.get('/', getHabits);
router.post('/', validate(habitSchema), createHabit);
router.get('/:id', habitDetail);
router.put('/:id', validate(habitSchema), updateHabit);
router.delete('/:id', deleteHabit);

export default router;
