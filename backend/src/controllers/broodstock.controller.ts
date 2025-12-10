import { Request, Response } from 'express';
import { query } from '../config/db';

export const createBroodstock = async (req: Request, res: Response) => {
    const {
        broodstock_code,
        sex,
        species,
        weight_kg,
        health_status
    } = req.body;

    if (!broodstock_code || !sex) {
        return res.status(400).json({ success: false, message: 'Code and Sex are required' });
    }

    try {
        const result = await query(
            `INSERT INTO broodstock 
      (broodstock_code, sex, current_weight_kg, health_status, notes, acquisition_date) 
      VALUES ($1, $2, $3, $4, $5, CURRENT_DATE) 
      RETURNING *`,
            [broodstock_code, sex, weight_kg || 0, health_status || 'Active', `Species: ${species || 'Unknown'}`]
        );

        res.status(201).json({ success: true, data: result.rows[0], message: 'Broodstock created successfully' });

    } catch (error: any) {
        console.error('Create broodstock error:', error);
        if (error.code === '23505') { // Unique violation
            return res.status(400).json({ success: false, message: 'Broodstock code already exists' });
        }
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getBroodstock = async (req: Request, res: Response) => {
    try {
        const result = await query(`SELECT * FROM broodstock ORDER BY created_at DESC`);
        res.json({ success: true, data: result.rows });
    } catch (error: any) {
        console.error('Get broodstock error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
