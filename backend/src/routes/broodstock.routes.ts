import { Router } from 'express';
import { createBroodstock, getBroodstock, updateBroodstock, deleteBroodstock } from '../controllers/broodstock.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getBroodstock);
router.post('/', createBroodstock);
router.put('/:id', updateBroodstock);
router.delete('/:id', deleteBroodstock);

export default router;
