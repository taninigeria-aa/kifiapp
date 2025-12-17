
import { Router } from 'express';
import { getCustomers, createCustomer, updateCustomer } from '../controllers/customer.controller';
import { getSales, createSale, getSalesReport } from '../controllers/sales.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

// Customers
router.get('/customers', getCustomers);
router.post('/customers', createCustomer);
router.put('/customers/:id', updateCustomer);

// Sales
router.get('/sales', getSales);
router.post('/sales', createSale);
router.get('/sales/report', getSalesReport);

export default router;
