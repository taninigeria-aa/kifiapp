import { Router } from 'express';
import {
    getSuppliers, addSupplier, updateSupplier, deleteSupplier,
    getWorkers, addWorker, updateWorker, deleteWorker
} from '../controllers/people.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

// Suppliers
router.get('/suppliers', getSuppliers);
router.post('/suppliers', addSupplier);
router.put('/suppliers/:id', updateSupplier);
router.delete('/suppliers/:id', deleteSupplier);

// Workers
router.get('/workers', getWorkers);
router.post('/workers', addWorker);
router.put('/workers/:id', updateWorker);
router.delete('/workers/:id', deleteWorker);

export default router;
