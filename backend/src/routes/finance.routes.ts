
import { Router } from 'express';
import { getFeedInventory, recordPurchase, logFeedUsage, getFeedLogs } from '../controllers/feed.controller';
import { getExpenses, recordExpense, getFinancialSummary, getDetailedFinancialReport } from '../controllers/finance.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

// Feed
router.get('/feed', getFeedInventory);
router.post('/feed', recordPurchase);
router.get('/feed/logs', getFeedLogs);
router.post('/feed/log', logFeedUsage);

// Finance
router.get('/expenses', getExpenses);
router.post('/expenses', recordExpense);
router.get('/summary', getFinancialSummary);
router.get('/detailed-report', getDetailedFinancialReport);

export default router;
