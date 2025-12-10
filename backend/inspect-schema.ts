
import { query } from './src/config/db';

const inspectSchema = async () => {
    try {
        const res = await query(
            "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'batch_movements';"
        );
        console.log('Batch Movements Columns:', res.rows);
    } catch (err) {
        console.error('Error inspecting schema', err);
    }
};

inspectSchema();
