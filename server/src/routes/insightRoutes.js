import { Router } from 'express';
import { insights } from '../controllers/insightsController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.get('/', requireAuth, insights);
export default router;
