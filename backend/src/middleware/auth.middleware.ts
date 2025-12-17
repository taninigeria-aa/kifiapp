import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../config/db';

interface AuthRequest extends Request {
    user?: any;
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

        // Verify user exists and is active
        const result = await query('SELECT user_id, username, full_name, role_id, is_active FROM users WHERE user_id = $1', [decoded.user_id]);

        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        const user = result.rows[0];

        if (!user.is_active) {
            return res.status(403).json({ success: false, message: 'User account is inactive. Please contact administrator.' });
        }

        // Attach user + role name (need join potentially, but usually payload has enough,
        // but for safety we used DB. Let's get role_name from payload or DB if we want to be strict.
        // The payload usually has role: role_name.
        // Let's stick to the payload for the role name to avoid extra join unless strictness needed,
        // but we DID verify existence.

        (req as AuthRequest).user = {
            ...user,
            role: decoded.role // Keep role from token or fetch from DB if we want real-time role updates.
        };

        next();
    } catch (error) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
};
