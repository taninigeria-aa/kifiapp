import { query } from './src/config/db';

async function testInsert() {
    try {
        console.log("Attempting insert...");
        // This matches the NEW query in broodstock.controller.ts
        const result = await query(
            `INSERT INTO broodstock 
            (broodstock_code, sex, current_weight_kg, health_status, notes, acquisition_date) 
            VALUES ($1, $2, $3, $4, $5, CURRENT_DATE) 
            RETURNING *`,
            ['TEST-FIX-02', 'Female', 1.5, 'Active', 'Species: Catfish']
        );
        console.log("Insert success:", result.rows[0]);
    } catch (e: any) {
        console.log("Insert failed:");
        console.log(e.message);
    }
    process.exit(0);
}

testInsert();
