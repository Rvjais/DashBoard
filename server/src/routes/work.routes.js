// server/src/routes/work.routes.js
import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { createWork, myWork } from '../controllers/work.controller.js';

const router = Router();
router.post('/', auth, createWork);
router.get('/me', auth, myWork);

export default router;
