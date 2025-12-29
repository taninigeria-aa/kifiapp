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

export const createTank = async (req: Request, res: Response) => {
    try {
        const { tank_name, tank_type, location, capacity_liters, notes } = req.body;

        if (!tank_name || !tank_type || !capacity_liters) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const tank_code = `TNK-${Date.now().toString().slice(-6)}`;

        const result = await query(
            `INSERT INTO tanks (tank_code, tank_name, tank_type, location, capacity_liters, notes) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
            [tank_code, tank_name, tank_type, location, capacity_liters, notes]
        );
        res.status(201).json({ success: true, data: result.rows[0], message: 'Tank created successfully' });
    } catch (error: any) {
        console.error('Create tank error:', error);
        res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
};

export const updateTank = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { tank_name, tank_type, location, capacity_liters, notes, is_active } = req.body;

        const result = await query(
            `UPDATE tanks SET tank_name = $1, tank_type = $2, location = $3, capacity_liters = $4, notes = $5, is_active = $6
             WHERE tank_id = $7 RETURNING *`,
            [tank_name, tank_type, location, capacity_liters, notes, is_active ?? true, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Tank not found' });
        }

        res.json({ success: true, data: result.rows[0], message: 'Tank updated successfully' });
    } catch (error: any) {
        console.error('Update tank error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const deleteTank = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Check for dependencies (batches)
        const dependencies = await query('SELECT batch_id FROM batches WHERE current_tank_id = $1 LIMIT 1', [id]);
        if (dependencies.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Cannot delete tank with active batches. Move batches first.' });
        }

        const result = await query('DELETE FROM tanks WHERE tank_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Tank not found' });
        }

        res.json({ success: true, message: 'Tank deleted successfully' });
    } catch (error: any) {
        console.error('Delete tank error:', error);
        res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
};
