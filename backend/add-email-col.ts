
import { query } from './src/config/db';

const addEmailColumn = async () => {
    try {
        console.log('Adding email column to customers table...');

        await query(`
            ALTER TABLE customers 
            ADD COLUMN IF NOT EXISTS email VARCHAR(255);
        `);

        console.log('Successfully added email column.');
    } catch (error) {
        console.error('Error adding email column:', error);
    }
};

addEmailColumn();
