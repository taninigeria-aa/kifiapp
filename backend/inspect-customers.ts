
import { query } from './src/config/db';

const inspectCustomers = async () => {
    try {
        const res = await query(
            "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'customers';"
        );
        console.log('Customers Columns:', res.rows);
    } catch (err) {
        console.error('Error inspecting schema', err);
    }
};

inspectCustomers();
