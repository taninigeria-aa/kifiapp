
import { query } from '../config/db';

const createTable = async () => {
    try {
        await query(`
            CREATE TABLE IF NOT EXISTS feed_purchases (
                purchase_id SERIAL PRIMARY KEY,
                inventory_id INTEGER REFERENCES feed_inventory(inventory_id),
                purchase_date DATE DEFAULT CURRENT_DATE,
                quantity_kg NUMERIC(10, 2),
                cost_ngn NUMERIC(12, 2),
                supplier VARCHAR(100),
                notes TEXT,
                bag_size_kg NUMERIC(8, 2),
                num_bags INTEGER,
                cost_per_bag NUMERIC(10, 2),
                total_quantity_kg NUMERIC(10, 2),
                total_cost_ngn NUMERIC(12, 2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('feed_purchases table created successfully');
    } catch (error) {
        console.error('Error creating table:', error);
    }
};

createTable();
