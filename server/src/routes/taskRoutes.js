import { Router } from 'express';
import { createTask, deleteTask, listTasks, updateTask } from '../controllers/taskController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { taskSchema } from '../validation/schemas.js';

const router = Router();

router.use(requireAuth);
router.get('/', listTasks);
router.post('/', validate(taskSchema), createTask);
router.put('/:id', validate(taskSchema), updateTask);
router.delete('/:id', deleteTask);

export default router;
