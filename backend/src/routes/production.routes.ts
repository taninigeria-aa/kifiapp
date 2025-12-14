import { Router } from 'express';
import { getTanks } from '../controllers/tank.controller';
import {
    getBatches,
    createBatch,
    getBatchById,
    updateBatch,
    addGrowthSample,
    getGrowthSamples,
    moveBatch,
    getBatchMovements,
    getProductionReport
} from '../controllers/batch.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

// Tanks
router.get('/tanks', getTanks);

// Batches
router.get('/batches', getBatches);
router.post('/batches', createBatch);
router.get('/batches/:id', getBatchById);
router.put('/batches/:id', updateBatch);
router.get('/batches/report/production', getProductionReport);

// Growth & Movements
router.post('/batches/:id/growth', addGrowthSample);
router.get('/batches/:id/growth', getGrowthSamples);
router.post('/batches/:id/move', moveBatch);
router.get('/batches/:id/movements', getBatchMovements);

export default router;
