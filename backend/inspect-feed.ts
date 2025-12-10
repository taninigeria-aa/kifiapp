
import { query } from './src/config/db';

const inspectFeed = async () => {
    try {
        const res = await query(
            "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'feed_inventory';"
        );
        console.log('Feed Inventory Columns:', res.rows);
    } catch (err) {
        console.error('Error', err);
    }
};

inspectFeed();
