
import { query } from './src/config/db';

const setupPhase4 = async () => {
    try {
        console.log('Setting up Phase 4 tables...');

        // 1. Growth Samples Table
        await query(`
            CREATE TABLE IF NOT EXISTS growth_samples (
                sample_id SERIAL PRIMARY KEY,
                batch_id INTEGER REFERENCES batches(batch_id),
                sample_date DATE DEFAULT CURRENT_DATE,
                avg_weight_g NUMERIC(10, 2),
                sample_size INTEGER, -- Number of fish weighed
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Created growth_samples table.');

        // 2. Batch Movements Table
        await query(`
            CREATE TABLE IF NOT EXISTS batch_movements (
                movement_id SERIAL PRIMARY KEY,
                batch_id INTEGER REFERENCES batches(batch_id),
                from_tank_id INTEGER REFERENCES tanks(tank_id),
                to_tank_id INTEGER REFERENCES tanks(tank_id),
                movement_date DATE DEFAULT CURRENT_DATE,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Created batch_movements table.');

        console.log('Phase 4 setup completed successfully.');
    } catch (error) {
        console.error('Error setting up Phase 4 tables:', error);
    }
};

setupPhase4();
