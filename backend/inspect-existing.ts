
import { query } from './src/config/db';

const inspectSchemas = async () => {
    try {
        const tables = ['feed_types', 'feeding_logs', 'expenses'];
        for (const t of tables) {
            console.log(`\n--- ${t} ---`);
            const res = await query(
                `SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = '${t}';`
            );
            console.log(res.rows);
        }
    } catch (err) {
        console.error('Error', err);
    }
};

inspectSchemas();
