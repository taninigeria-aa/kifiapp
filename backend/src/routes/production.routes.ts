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
router.get('/batches', authenticateToken, getBatches);
router.post('/batches', authenticateToken, createBatch);
router.get('/batches/:id', authenticateToken, getBatchById);
router.put('/batches/:id', authenticateToken, updateBatch);
router.get('/batches/report/production', authenticateToken, getProductionReport);

// Growth & Movements
router.post('/batches/:id/growth', authenticateToken, addGrowthSample);
router.get('/batches/:id/growth', authenticateToken, getGrowthSamples);
router.post('/batches/:id/move', authenticateToken, moveBatch);
router.get('/batches/:id/movements', authenticateToken, getBatchMovements);

export default router;
