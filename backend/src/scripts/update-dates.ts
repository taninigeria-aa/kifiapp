
import { query } from '../config/db';

async function updateDates() {
    try {
        console.log('--- Updating Dates ---');
        // Shift dates forward by 10 days to bring them into the current week (approx)
        // Current date is Dec 17. Latest data is Dec 8. Dec 8 + 10 = Dec 18.

        await query("UPDATE spawns SET spawn_date = spawn_date + INTERVAL '10 days'");
        await query("UPDATE sales SET sale_date = sale_date + INTERVAL '10 days'");

        console.log('Dates updated successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error updating dates:', error);
        process.exit(1);
    }
}

updateDates();
