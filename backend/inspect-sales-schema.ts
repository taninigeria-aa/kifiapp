
import { query } from './src/config/db';

const inspectSchema = async () => {
    try {
        const salesColumns = await query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'sales';
        `);
        console.log('Sales Table Columns:', salesColumns.rows);

        const batchesColumns = await query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'batches';
        `);
        console.log('Batches Table Columns:', batchesColumns.rows);

        const constraints = await query(`
            SELECT conname, pg_get_constraintdef(oid)
            FROM pg_constraint
            WHERE conrelid = 'batches'::regclass;
        `);
        console.log('Batches Constraints:', constraints.rows);

    } catch (error) {
        console.error('Error:', error);
    }
};

inspectSchema();
