
import { query } from './src/config/db';

const setupPhase6 = async () => {
    try {
        console.log('Setting up Phase 6 tables...');

        // 1. Feed Inventory Table
        await query(`
            CREATE TABLE IF NOT EXISTS feed_inventory (
                feed_id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(50), -- Floating, Sinking, etc.
                quantity_kg NUMERIC(10, 2) DEFAULT 0,
                cost_per_kg NUMERIC(10, 2) DEFAULT 0,
                supplier VARCHAR(255),
                status VARCHAR(50) DEFAULT 'Active', -- Active, Low Stock, Discontinued
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Created feed_inventory table.');

        // 2. Feed Logs Table
        await query(`
            CREATE TABLE IF NOT EXISTS feed_logs (
                log_id SERIAL PRIMARY KEY,
                batch_id INTEGER REFERENCES batches(batch_id), -- Optional
                feed_id INTEGER REFERENCES feed_inventory(feed_id),
                quantity_kg NUMERIC(10, 2) NOT NULL,
                log_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Created feed_logs table.');

        // 3. Expenses Table
        await query(`
            CREATE TABLE IF NOT EXISTS expenses (
                expense_id SERIAL PRIMARY KEY,
                category VARCHAR(100) NOT NULL, -- Labor, Maintenance, Fuel, etc.
                amount NUMERIC(15, 2) NOT NULL,
                expense_date DATE DEFAULT CURRENT_DATE,
                description TEXT,
                created_by INTEGER, -- User ID (optional for now)
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Created expenses table.');

        console.log('Phase 6 setup completed successfully.');
    } catch (error) {
        console.error('Error setting up Phase 6 tables:', error);
    }
};

setupPhase6();
