
import { query } from './src/config/db';

const inspectSales = async () => {
    try {
        const res = await query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'sales';
        `);
        console.log('Sales Table Columns:', res.rows);
    } catch (error) {
        console.error('Error inspecting sales table:', error);
    }
};

inspectSales();
