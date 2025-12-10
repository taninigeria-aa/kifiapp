
import { query } from './src/config/db';

const setupPhase7 = async () => {
    try {
        console.log('Setting up Phase 7: People tables...');

        await query(`
            CREATE TABLE IF NOT EXISTS suppliers (
                supplier_id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                contact_person VARCHAR(255),
                phone_number VARCHAR(50),
                email VARCHAR(255),
                category VARCHAR(100),
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await query(`
            CREATE TABLE IF NOT EXISTS workers (
                worker_id SERIAL PRIMARY KEY,
                full_name VARCHAR(255) NOT NULL,
                role VARCHAR(100),
                phone_number VARCHAR(50),
                start_date DATE DEFAULT CURRENT_DATE,
                salary_ngn NUMERIC(15, 2) DEFAULT 0,
                status VARCHAR(50) DEFAULT 'Active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('Phase 7 tables created successfully.');
    } catch (error) {
        console.error('Error setting up Phase 7 tables:', error);
    }
};

setupPhase7();
