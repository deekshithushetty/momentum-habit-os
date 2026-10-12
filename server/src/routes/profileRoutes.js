import { Router } from 'express';
import { exportData, updateProfile } from '../controllers/profileController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { profileSchema } from '../validation/schemas.js';

const router = Router();

router.use(requireAuth);
router.put('/', validate(profileSchema), updateProfile);
router.get('/export', exportData);

export default router;
