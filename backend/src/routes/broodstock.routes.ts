import { Router } from 'express';
import { createBroodstock, getBroodstock } from '../controllers/broodstock.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getBroodstock);
router.post('/', createBroodstock);

export default router;
