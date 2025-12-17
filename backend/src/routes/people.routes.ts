
import { Router } from 'express';
import { getSuppliers, addSupplier, updateSupplier, getWorkers, addWorker } from '../controllers/people.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

// Suppliers
router.get('/suppliers', getSuppliers);
router.post('/suppliers', addSupplier);
router.put('/suppliers/:id', updateSupplier);

// Workers
router.get('/workers', getWorkers);
router.post('/workers', addWorker);

export default router;
