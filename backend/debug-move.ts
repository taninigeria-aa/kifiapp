
import { query } from './src/config/db';

const debugMove = async () => {
    try {
        // 1. Get a batch
        const batchRes = await query('SELECT * FROM batches LIMIT 1');
        if (batchRes.rows.length === 0) {
            console.log('No batches found');
            return;
        }
        const batch = batchRes.rows[0];
        console.log('Batch:', batch);

        // 2. Get a tank (different from current if possible, or same)
        const tankRes = await query('SELECT * FROM tanks LIMIT 1');
        if (tankRes.rows.length === 0) {
            console.log('No tanks found');
            return;
        }
        const tank = tankRes.rows[0];
        console.log('Target Tank:', tank);

        // 3. Try to insert into batch_movements manually
        console.log('Attempting manual insert...');
        const from_tank_id = batch.current_tank_id;
        const to_tank_id = tank.tank_id;
        const batch_id = batch.batch_id;

        try {
            const res = await query(
                'INSERT INTO batch_movements (batch_id, from_tank_id, to_tank_id, movement_date, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [batch_id, from_tank_id, to_tank_id, '2025-12-08', 'Debug Move']
            );
            console.log('Manual Insert Success:', res.rows[0]);
        } catch (err: any) {
            console.error('Manual Insert Error:', err.message);
        }

    } catch (error) {
        console.error('Debug Error:', error);
    }
};

debugMove();
