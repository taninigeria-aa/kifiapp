import { query } from './src/config/db';

async function seedTanks() {
    try {
        console.log("Seeding tanks...");
        const tanks = [
            { name: 'Hatchery Tank A', type: 'Plastic', capacity: 1000, location: 'Indoor' },
            { name: 'Hatchery Tank B', type: 'Plastic', capacity: 1000, location: 'Indoor' },
            { name: 'Pond 1', type: 'Earthen', capacity: 50000, location: 'Outdoor' },
            { name: 'Pond 2', type: 'Earthen', capacity: 50000, location: 'Outdoor' },
            { name: 'Concrete Tank 1', type: 'Concrete', capacity: 5000, location: 'Outdoor' }
        ];

        for (const tank of tanks) {
            // Check if exists
            const exists = await query("SELECT * FROM tanks WHERE tank_name = $1", [tank.name]);
            if (exists.rows.length === 0) {
                await query(
                    `INSERT INTO tanks (tank_code, tank_name, tank_type, capacity_liters, location, is_active)
                     VALUES ($1, $2, $3, $4, $5, true)`,
                    [`TNK-${tank.name.substring(0, 3).toUpperCase()}`, tank.name, tank.type, tank.capacity, tank.location]
                );
                console.log(`Created ${tank.name}`);
            } else {
                console.log(`${tank.name} already exists.`);
            }
        }
    } catch (e: any) {
        console.error("Seeding failed:", e);
    }
    process.exit(0);
}

seedTanks();
