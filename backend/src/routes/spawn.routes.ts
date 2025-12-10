import { Router } from 'express';
import { getSpawns, createSpawn, getBroodstockOptions, getSpawnById, updateSpawn } from '../controllers/spawn.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getSpawns);
router.post('/', createSpawn);
router.get('/options', getBroodstockOptions);
router.get('/:id', getSpawnById);
router.put('/:id', updateSpawn);

export default router;
