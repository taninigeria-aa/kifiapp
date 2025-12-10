
import { query } from './src/config/db';

const inspectFeedTypes = async () => {
    try {
        const res = await query(
            "SELECT column_name FROM information_schema.columns WHERE table_name = 'feed_types';"
        );
        console.log('Feed Types Columns:', res.rows.map(r => r.column_name));
    } catch (err) {
        console.error('Error', err);
    }
};

inspectFeedTypes();
