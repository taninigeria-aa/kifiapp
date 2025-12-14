import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: any; // Using any to match existing usage, or explicitly: { user_id: number; role: string; username: string }
        }
    }
}
