import { Request, Response } from 'express';
import { query } from '../config/db';

export const getTanks = async (req: Request, res: Response) => {
    try {
        const result = await query(`SELECT * FROM tanks ORDER BY tank_name ASC`);
        res.json({ success: true, data: result.rows });
    } catch (error: any) {
        console.error('Get tanks error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
