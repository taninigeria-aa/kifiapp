
import { query } from './src/config/db';

const listTables = async () => {
    try {
        const res = await query(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
        );
        console.log('Tables:', res.rows.map((r: any) => r.table_name));

        // Also get columns for batches to see what we have
        const batchCols = await query(
            "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'batches';"
        );
        console.log('Batch Columns:', batchCols.rows);

    } catch (err) {
        console.error('Error listing tables', err);
    }
};

listTables();
