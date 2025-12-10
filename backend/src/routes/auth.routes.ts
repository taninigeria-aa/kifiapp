import { Router } from 'express';
import { login, verifyToken } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', login);
router.get('/verify', authenticateToken, verifyToken);

export default router;
