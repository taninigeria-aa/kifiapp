
import { query } from './src/config/db';

const setupPhase6_5 = async () => {
    try {
        console.log('Setting up Feed Purchase table...');

        await query(`
            CREATE TABLE IF NOT EXISTS feed_purchases (
                purchase_id SERIAL PRIMARY KEY,
                inventory_id INTEGER REFERENCES feed_inventory(inventory_id),
                purchase_date DATE DEFAULT CURRENT_DATE,
                bag_size_kg NUMERIC(10, 2),
                num_bags INTEGER,
                total_quantity_kg NUMERIC(10, 2),
                cost_per_bag NUMERIC(15, 2),
                total_cost_ngn NUMERIC(15, 2),
                supplier VARCHAR(255),
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Created feed_purchases table.');
    } catch (error) {
        console.error('Error setting up table:', error);
    }
};

setupPhase6_5();
