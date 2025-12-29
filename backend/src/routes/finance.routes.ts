
import { Router } from 'express';
import { getFeedInventory, recordPurchase, logFeedUsage, getFeedLogs, updateFeedItem } from '../controllers/feed.controller';
import {
    getExpenses, recordExpense, deleteExpense,
    getFinancialSummary, getDetailedFinancialReport,
    getCategories, addCategory, updateCategory, deleteCategory
} from '../controllers/finance.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

// Feed
router.get('/feed', getFeedInventory);
router.post('/feed', recordPurchase);
router.put('/feed/:id', updateFeedItem);
router.get('/feed/logs', getFeedLogs);
router.post('/feed/log', logFeedUsage);

// Finance - Expenses
router.get('/expenses', getExpenses);
router.post('/expenses', recordExpense);
router.delete('/expenses/:id', deleteExpense);

// Finance - Categories
router.get('/categories', getCategories);
router.post('/categories', addCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Finance - Reports
router.get('/summary', getFinancialSummary);
router.get('/detailed-report', getDetailedFinancialReport);

export default router;
