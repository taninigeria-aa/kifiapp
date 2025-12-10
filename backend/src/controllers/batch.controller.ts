import { Request, Response } from 'express';
import { query } from '../config/db';

export const getBatches = async (req: Request, res: Response) => {
    try {
        const result = await query(`
        SELECT b.*, t.tank_name, s.spawn_code 
        FROM batches b
        LEFT JOIN tanks t ON b.current_tank_id = t.tank_id
        LEFT JOIN spawns s ON b.spawn_id = s.spawn_id
        ORDER BY b.start_date DESC
    `);
        res.json({ success: true, data: result.rows });
    } catch (error: any) {
        console.error('Get batches error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const createBatch = async (req: Request, res: Response) => {
    const {
        start_date,
        initial_count,
        current_tank_id,
        spawn_id,
        notes,
        source
    } = req.body;

    if (!start_date || !initial_count || !current_tank_id) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
        // Generate Unique Batch Code
        // Format: BAT-{TYPE}-{YYYYMMDD}-{RANDOM}
        const dateStr = start_date.replace(/-/g, '');
        const type = source === 'Spawn' ? 'SP' : 'PUR';
        const randomStr = Math.floor(1000 + Math.random() * 9000); // 4 digit random
        const batch_code = `BAT-${type}-${dateStr}-${randomStr}`;

        const result = await query(
            `INSERT INTO batches 
             (batch_code, start_date, initial_count, current_count, current_tank_id, spawn_id, notes, status, current_stage) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, 'Active', 'Fry') 
             RETURNING *`,
            [batch_code, start_date, initial_count, initial_count, current_tank_id, spawn_id || null, notes]
        );

        res.status(201).json({ success: true, data: result.rows[0], message: 'Batch created successfully' });

    } catch (error: any) {
        console.error('Create batch error:', error);
        if (error.code === '23505') { // Unique violation
            return res.status(400).json({ success: false, message: 'Batch code already exists' });
        }
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
// ... existing imports

export const getBatchById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await query(`
            SELECT b.*, t.tank_name, s.spawn_code 
            FROM batches b
            LEFT JOIN tanks t ON b.current_tank_id = t.tank_id
            LEFT JOIN spawns s ON b.spawn_id = s.spawn_id
            WHERE b.batch_id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Batch not found' });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error: any) {
        console.error('Get batch error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateBatch = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            start_date,
            initial_count,
            current_tank_id,
            notes,
            status,
            current_count,
            current_stage
        } = req.body;

        const result = await query(
            `UPDATE batches SET
                start_date = $1,
                initial_count = $2,
                current_tank_id = $3,
                notes = $4,
                status = $5,
                current_count = $6,
                current_stage = $7
            WHERE batch_id = $8
            RETURNING *`,
            [
                start_date,
                initial_count,
                current_tank_id,
                notes,
                status,
                current_count,
                current_stage,
                id
            ]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Batch not found' });
        }

        res.json({ success: true, data: result.rows[0], message: 'Batch updated successfully' });
    } catch (error: any) {
        console.error('Update batch error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getProductionReport = async (req: Request, res: Response) => {
    try {
        // 1. Production Summary
        const summaryRes = await query(`
            SELECT 
                COUNT(*) FILTER (WHERE status = 'Active') as active_batches,
                COUNT(*) as total_batches,
                COALESCE(SUM(current_count) FILTER (WHERE status = 'Active'), 0)::integer as total_fish_stock,
                COALESCE(SUM(initial_count) FILTER (WHERE status = 'Active'), 0)::integer as initial_stock
            FROM batches
        `);

        const summary = summaryRes.rows[0];
        const survivalRate = summary.initial_stock > 0
            ? ((summary.total_fish_stock / summary.initial_stock) * 100).toFixed(1)
            : '0.0';

        // 2. Batches by Stage
        const stagesRes = await query(`
            SELECT 
                current_stage,
                COUNT(*) as batch_count,
                COALESCE(SUM(current_count), 0)::integer as total_fish
            FROM batches
            WHERE status = 'Active'
            GROUP BY current_stage
            ORDER BY 
                CASE current_stage
                    WHEN 'Fry' THEN 1
                    WHEN 'Fingerling' THEN 2
                    WHEN 'Juvenile' THEN 3
                    WHEN 'Marketable' THEN 4
                    ELSE 5
                END
        `);

        // 3. Batch Performance Details
        const batchesRes = await query(`
            SELECT 
                b.batch_code,
                b.current_stage,
                b.current_count,
                b.initial_count,
                b.start_date,
                t.tank_name,
                b.status,
                CURRENT_DATE - b.start_date::date as days_in_production,
                CASE 
                    WHEN b.initial_count > 0 THEN 
                        ROUND(((b.current_count::numeric / b.initial_count::numeric) * 100), 1)
                    ELSE 0
                END as survival_rate
            FROM batches b
            LEFT JOIN tanks t ON b.current_tank_id = t.tank_id
            WHERE b.status = 'Active'
            ORDER BY b.start_date DESC
        `);

        res.json({
            success: true,
            data: {
                summary: {
                    active_batches: Number(summary.active_batches),
                    total_batches: Number(summary.total_batches),
                    total_fish_stock: Number(summary.total_fish_stock),
                    survival_rate: parseFloat(survivalRate)
                },
                stages: stagesRes.rows,
                batches: batchesRes.rows
            }
        });
    } catch (error: any) {
        console.error('Production report error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};


// Growth Samples
export const addGrowthSample = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { sample_date, avg_weight_g, sample_size, notes } = req.body;

        // 1. Record Sample
        await query(
            'INSERT INTO growth_samples (batch_id, sample_date, avg_weight_g, sample_size, notes) VALUES ($1, $2, $3, $4, $5)',
            [id, sample_date, avg_weight_g, sample_size, notes]
        );

        // 2. Update Batch Current Avg Size
        await query(
            'UPDATE batches SET current_avg_size_g = $1 WHERE batch_id = $2',
            [avg_weight_g, id]
        );

        res.json({ success: true, message: 'Growth sample recorded' });
    } catch (error: any) {
        console.error('Add growth sample error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getGrowthSamples = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await query(
            'SELECT * FROM growth_samples WHERE batch_id = $1 ORDER BY sample_date DESC',
            [id]
        );
        res.json({ success: true, data: result.rows });
    } catch (error: any) {
        console.error('Get growth samples error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Batch Movements
export const moveBatch = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { to_tank_id, movement_date, notes } = req.body;

        // 1. Get Current Tank
        const batchRes = await query('SELECT current_tank_id, current_count FROM batches WHERE batch_id = $1', [id]);
        if (batchRes.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Batch not found' });
        }
        const from_tank_id = batchRes.rows[0].current_tank_id;
        const count_moved = batchRes.rows[0].current_count || 0;

        // 2. Record Movement
        await query(
            'INSERT INTO batch_movements (batch_id, from_tank_id, to_tank_id, movement_date, count_moved, notes) VALUES ($1, $2, $3, $4, $5, $6)',
            [id, from_tank_id, to_tank_id, movement_date, count_moved, notes]
        );

        // 3. Update Batch Current Tank
        await query(
            'UPDATE batches SET current_tank_id = $1 WHERE batch_id = $2',
            [to_tank_id, id]
        );

        res.json({ success: true, message: 'Batch moved successfully' });
    } catch (error: any) {
        console.error('Move batch error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

export const getBatchMovements = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await query(`
            SELECT m.*, t1.tank_name as from_tank_name, t2.tank_name as to_tank_name
            FROM batch_movements m
            LEFT JOIN tanks t1 ON m.from_tank_id = t1.tank_id
            LEFT JOIN tanks t2 ON m.to_tank_id = t2.tank_id
            WHERE m.batch_id = $1
            ORDER BY m.movement_date DESC
        `, [id]);
        res.json({ success: true, data: result.rows });
    } catch (error: any) {
        console.error('Get batch movements error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
