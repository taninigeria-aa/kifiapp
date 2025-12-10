import { Router } from 'express';
import { getDashboardSummary, getDashboardTasks } from '../controllers/dashboard.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken); // Protect all dashboard routes

router.get('/summary', getDashboardSummary);
router.get('/tasks', getDashboardTasks);

export default router;
