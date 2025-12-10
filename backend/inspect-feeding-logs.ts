import { query } from './src/config/db';

const inspectFeedingLogs = async () => {
    try {
        const res = await query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'feeding_logs';
        `);
        console.log('Feeding Logs Columns:', res.rows);
    } catch (error) {
        console.error('Error:', error);
    }
};

inspectFeedingLogs();
