
import { query } from './src/config/db';

const checkConstraints = async () => {
    try {
        const constraints = await query(`
            SELECT conname, pg_get_constraintdef(oid)
            FROM pg_constraint
            WHERE conrelid = 'batches'::regclass AND conname LIKE '%check%';
        `);
        console.log('Batches Check Constraints:', constraints.rows);
    } catch (error) {
        console.error('Error:', error);
    }
};

checkConstraints();
