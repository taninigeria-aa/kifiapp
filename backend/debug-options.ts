import { getBroodstockOptions } from './src/controllers/spawn.controller';
import { Request, Response } from 'express';

const req = {} as Request;
const res = {
    json: (data: any) => console.log(JSON.stringify(data, null, 2)),
    status: (code: number) => ({ json: (data: any) => console.log(`Status ${code}:`, data) })
} as unknown as Response;

// We can't easily invoke the controller directly without mocking DB query if it relies on app context, 
// but since it imports 'query' from config/db which uses dotenv, we can try running a small script that calls the DB directly 
// or just re-verify the seed script logic.

import { query } from './src/config/db';

async function checkOptions() {
    try {
        const females = await query("SELECT broodstock_id, broodstock_code FROM broodstock WHERE sex = 'Female' AND health_status = 'Active'");
        const males = await query("SELECT broodstock_id, broodstock_code FROM broodstock WHERE sex = 'Male' AND health_status = 'Active'");
        console.log('Females:', females.rows);
        console.log('Males:', males.rows);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkOptions();
