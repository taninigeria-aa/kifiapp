import { Router } from 'express';
import { getHealthLogs, logHealthIssue, addTreatment, getTreatments } from '../controllers/health.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

// Health Logs
router.get('/logs', getHealthLogs);
router.post('/logs', logHealthIssue);

// Treatments (Linked to Logs)
router.get('/logs/:log_id/treatments', getTreatments);
router.post('/logs/:log_id/treatments', addTreatment);

export default router;
