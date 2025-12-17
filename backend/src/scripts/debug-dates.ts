
import { query } from '../config/db';

async function checkDates() {
    try {
        console.log('--- Checking Spawns ---');
        const spawns = await query('SELECT spawn_date FROM spawns ORDER BY spawn_date DESC LIMIT 5');
        console.log(spawns.rows);

        console.log('\n--- Checking Sales ---');
        const sales = await query('SELECT sale_date FROM sales ORDER BY sale_date DESC LIMIT 5');
        console.log(sales.rows);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkDates();
