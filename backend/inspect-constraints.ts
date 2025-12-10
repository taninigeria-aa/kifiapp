
import { query } from './src/config/db';

const inspectConstraints = async () => {
    try {
        const res = await query(`
            SELECT conname, pg_get_constraintdef(oid) 
            FROM pg_constraint 
            WHERE conrelid = 'feed_types'::regclass;
        `);
        console.log('Constraints:', res.rows);
    } catch (err) {
        console.error('Error', err);
    }
};

inspectConstraints();
