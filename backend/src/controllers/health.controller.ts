import { Request, Response } from 'express';
import { query } from '../config/db';

// Get Health Logs for a Batch (or specific tank)
export const getHealthLogs = async (req: Request, res: Response) => {
    try {
        const { batch_id, tank_id } = req.query;

        let sql = `
            SELECT h.*, u.full_name as logged_by_name, t.tank_name, b.batch_code
            FROM health_logs h
            LEFT JOIN users u ON h.logged_by = u.user_id
            LEFT JOIN tanks t ON h.tank_id = t.tank_id
            LEFT JOIN batches b ON h.batch_id = b.batch_id
            WHERE 1=1
        `;
        const params: any[] = [];

        if (batch_id) {
            params.push(batch_id);
            sql += ` AND h.batch_id = $${params.length}`;
        }
        if (tank_id) {
            params.push(tank_id);
            sql += ` AND h.tank_id = $${params.length}`;
        }

        sql += ' ORDER BY h.log_date DESC, h.log_time DESC';

        const result = await query(sql, params);
        res.json({ success: true, data: result.rows });
    } catch (error: any) {
        console.error('Get health logs error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Log a New Health Issue
export const logHealthIssue = async (req: Request, res: Response) => {
    try {
        const {
            log_date,
            log_time,
            tank_id,
            batch_id,
            issue_type,
            issue_description,
            severity,
            fish_affected,
            mortality_count,
            water_temperature_c,
            water_ph,
            oxygen_level_ppm,
            action_taken,
            notes
        } = req.body;

        const result = await query(
            `INSERT INTO health_logs (
                log_date, log_time, tank_id, batch_id, issue_type, issue_description,
                severity, fish_affected, mortality_count, water_temperature_c, 
                water_ph, oxygen_level_ppm, action_taken, notes, logged_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            RETURNING *`,
            [
                log_date || new Date(),
                log_time || new Date().toLocaleTimeString(),
                tank_id,
                batch_id,
                issue_type,
                issue_description,
                severity || 'Low',
                fish_affected || 0,
                mortality_count || 0,
                water_temperature_c,
                water_ph,
                oxygen_level_ppm,
                action_taken,
                notes,
                (req as any).user?.user_id // Assuming auth middleware adds user
            ]
        );

        res.status(201).json({ success: true, data: result.rows[0], message: 'Health log recorded' });
    } catch (error: any) {
        console.error('Log health issue error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Add Treatment to existing Log
export const addTreatment = async (req: Request, res: Response) => {
    try {
        const { log_id } = req.params;
        const {
            treatment_date,
            treatment_type,
            medication_name,
            dosage_ml,
            dosage_mg_per_liter,
            duration_days,
            cost_ngn,
            supplier,
            notes
        } = req.body;

        const result = await query(
            `INSERT INTO treatments (
                health_log_id, treatment_date, treatment_type, medication_name,
                dosage_ml, dosage_mg_per_liter, duration_days, cost_ngn,
                supplier, notes, applied_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *`,
            [
                log_id,
                treatment_date || new Date(),
                treatment_type,
                medication_name,
                dosage_ml,
                dosage_mg_per_liter,
                duration_days,
                cost_ngn,
                supplier,
                notes,
                (req as any).user?.user_id
            ]
        );

        // Also update the main log with "Treated" status or action
        await query(
            `UPDATE health_logs SET action_taken = 
            COALESCE(action_taken, '') || ' [Treated: ' || $1 || ']' 
            WHERE log_id = $2`,
            [medication_name, log_id]
        );

        res.status(201).json({ success: true, data: result.rows[0], message: 'Treatment recorded' });

    } catch (error: any) {
        console.error('Add treatment error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get treatments for a log
export const getTreatments = async (req: Request, res: Response) => {
    try {
        const { log_id } = req.params;
        const result = await query(
            `SELECT t.*, u.full_name as applied_by_name 
             FROM treatments t
             LEFT JOIN users u ON t.applied_by = u.user_id
             WHERE t.health_log_id = $1
             ORDER BY t.treatment_date DESC`,
            [log_id]
        );
        res.json({ success: true, data: result.rows });
    } catch (error: any) {
        console.error('Get treatments error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
