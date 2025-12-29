import { Router } from 'express';
import { login, register, verifyToken } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify', authenticateToken, verifyToken);
router.get('/me', authenticateToken, verifyToken);

export default router;
