import { Request, Response } from 'express';
import { query } from '../config/db';

export const createSpawn = async (req: Request, res: Response) => {
    // Combine date and time for timestamp fields
    let params_injection_time = null;
    const {
        spawn_date,
        female_code,
        male_code,
        female_weight,
        male_weight,
        injection_time,
        estimated_eggs,
        hormone_type,
        hormone_dose
    } = req.body;

    try {
        // Generate Spawn Code
        const dateStr = spawn_date.replace(/-/g, '');
        const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
        const spawn_code = `SPN-${dateStr}-${randomStr}`;

        // Combine date and time
        const params_injection_time = injection_time ? `${spawn_date}T${injection_time}:00` : null;

        // Validation
        if (!spawn_date || !female_code || !male_code) {
            return res.status(400).json({ success: false, message: 'Missing required fields (Date, Codes)' });
        }

        // Insert Spawn
        const result = await query(
            `INSERT INTO spawns 
      (spawn_code, spawn_date, female_code, male_code, female_weight_kg, male_weight_kg, injection_time, estimated_egg_count, status, hormone_dose_ml, dose_per_kg) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Injected', $9, $10) 
      RETURNING *`,
            [
                spawn_code,
                spawn_date,
                female_code,
                male_code,
                female_weight || 0,
                male_weight || 0,
                params_injection_time,
                estimated_eggs || 0,
                0.5, // Default hormone
                0.5  // Default dose
            ]
        );

        res.status(201).json({ success: true, data: result.rows[0], message: 'Spawn created successfully' });

    } catch (error: any) {
        console.error('Create spawn error:', error);
        res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
};

export const getSpawns = async (req: Request, res: Response) => {
    try {
        const result = await query(`
      SELECT s.*, 
             s.estimated_egg_count as estimated_eggs,
             COALESCE(s.female_code, bf.broodstock_code) as female_code, 
             COALESCE(s.male_code, bm.broodstock_code) as male_code
      FROM spawns s
      LEFT JOIN broodstock bf ON s.female1_id = bf.broodstock_id
      LEFT JOIN broodstock bm ON s.male1_id = bm.broodstock_id
      ORDER BY s.spawn_date DESC
    `);

        res.json({ success: true, data: result.rows });
    } catch (error: any) {
        console.error('Get spawns error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ... existing imports

export const getSpawnById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await query(`
            SELECT s.*, 
                   s.estimated_egg_count as estimated_eggs,
                   COALESCE(s.female_code, bf.broodstock_code) as female_code, 
                   COALESCE(s.male_code, bm.broodstock_code) as male_code
            FROM spawns s
            LEFT JOIN broodstock bf ON s.female1_id = bf.broodstock_id
            LEFT JOIN broodstock bm ON s.male1_id = bm.broodstock_id
            WHERE s.spawn_id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Spawn not found' });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error: any) {
        console.error('Get spawn error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateSpawn = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            spawn_date,
            female_code,
            male_code,
            female_weight,
            male_weight,
            injection_time,
            estimated_eggs
        } = req.body;

        // Combine date and time
        const params_injection_time = injection_time ? `${spawn_date}T${injection_time}` : null;
        // Note: Assuming injection_time from frontend is "HH:mm" and spawn_date is "YYYY-MM-DD". 
        // If injection_time is already full ISO string from DB, we might need parsing logic, 
        // but for edit form usually we just send the updated fields.

        const result = await query(
            `UPDATE spawns SET
                spawn_date = $1,
                female_code = $2,
                male_code = $3,
                female_weight_kg = $4,
                male_weight_kg = $5,
                injection_time = $6,
                estimated_egg_count = $7
            WHERE spawn_id = $8
            RETURNING *`,
            [
                spawn_date,
                female_code,
                male_code,
                female_weight,
                male_weight,
                params_injection_time,
                estimated_eggs,
                id
            ]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Spawn not found' });
        }

        res.json({ success: true, data: result.rows[0], message: 'Spawn updated successfully' });
    } catch (error: any) {
        console.error('Update spawn error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getBroodstockOptions = async (req: Request, res: Response) => {
    // ... existing getBroodstockOptions
    try {
        const females = await query("SELECT broodstock_id, broodstock_code FROM broodstock WHERE sex = 'Female' AND health_status = 'Active'");
        const males = await query("SELECT broodstock_id, broodstock_code FROM broodstock WHERE sex = 'Male' AND health_status = 'Active'");

        res.json({
            success: true,
            data: {
                females: females.rows,
                males: males.rows
            }
        });
    } catch (error: any) {
        console.error('Get broodstock options error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}
