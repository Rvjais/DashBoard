import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { createTask, listAllTasks, listMyDeptTasks, updateTask } from '../controllers/task.controller.js';

const router = Router();

// Admin
router.post('/', auth, requireRole('admin'), createTask);
router.get('/all', auth, requireRole('admin'), listAllTasks);

// Dept users
router.get('/mine', auth, listMyDeptTasks);
router.patch('/:id', auth, updateTask);

export default router;
