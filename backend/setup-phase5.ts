
import { query } from './src/config/db';

const setupPhase5 = async () => {
    try {
        console.log('Setting up Phase 5 tables...');

        // 1. Customers Table
        await query(`
            CREATE TABLE IF NOT EXISTS customers (
                customer_id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                phone VARCHAR(50),
                email VARCHAR(255),
                address TEXT,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Created customers table.');

        // 2. Sales Table
        await query(`
            CREATE TABLE IF NOT EXISTS sales (
                sale_id SERIAL PRIMARY KEY,
                customer_id INTEGER REFERENCES customers(customer_id),
                batch_id INTEGER REFERENCES batches(batch_id),
                sale_date DATE DEFAULT CURRENT_DATE,
                quantity INTEGER, -- Number of fish sold
                weight_kg NUMERIC(10, 2), -- Total weight
                price_per_unit NUMERIC(10, 2), -- Price per fish or per kg
                total_amount NUMERIC(15, 2),
                payment_status VARCHAR(50) DEFAULT 'Pending', -- Pending, Paid, Partial
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Created sales table.');

        console.log('Phase 5 setup completed successfully.');
    } catch (error) {
        console.error('Error setting up Phase 5 tables:', error);
    }
};

setupPhase5();
