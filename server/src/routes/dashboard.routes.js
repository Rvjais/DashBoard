import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { getMetrics } from '../controllers/dashboard.controller.js';

const router = Router();
router.get('/metrics', auth, getMetrics);
export default router;
