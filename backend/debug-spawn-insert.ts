import { query } from './src/config/db';

async function testSpawnInsert() {
    try {
        console.log("Attempting spawn insert...");
        // This matches the updated query in spawn.controller.ts
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const spawn_code = `TEST-SPN-${dateStr}`;

        const result = await query(
            `INSERT INTO spawns 
            (spawn_code, spawn_date, female1_id, male1_id, injection_time, estimated_egg_count, status, hormone_dose_ml, dose_per_kg) 
            VALUES ($1, $2, $3, $4, $5, $6, 'Injected', $7, $8) 
            RETURNING *`,
            [spawn_code, '2025-12-08', 1, 4, '2025-12-08T10:00:00', 5000, 0.5, 0.5]
            // Assuming IDs 1 and 4 exist from valid seeds/tests
        );
        console.log("Spawn Insert success:", result.rows[0]);
    } catch (e: any) {
        console.log("Spawn Insert failed:");
        console.log(e.message);
    }
    process.exit(0);
}

testSpawnInsert();
