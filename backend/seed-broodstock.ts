import { query } from './src/config/db';

async function seedBroodstock() {
    try {
        console.log('Seeding Broodstock...');

        // Check if data exists
        const check = await query('SELECT COUNT(*) FROM broodstock');
        if (parseInt(check.rows[0].count) > 0) {
            console.log('Broodstock already seeded.');
            process.exit(0);
        }

        // Insert 2 Females and 2 Males
        // Note: Assuming 'Species' and 'Strain' columns exist or we just use defaults.
        // Based on schema: 
        // broodstock_code VARCHAR(20) UNIQUE,
        // sex VARCHAR(10) CHECK (sex IN ('Male', 'Female')),
        // species VARCHAR(50),
        // weight_kg NUMERIC(5,2),
        // status VARCHAR(20)

        await query(`
      INSERT INTO broodstock (broodstock_code, sex, species, weight_kg, status)
      VALUES 
      ('BRD-F-001', 'Female', 'Clarias gariepinus', 2.5, 'Active'),
      ('BRD-F-002', 'Female', 'Heterobranchus', 3.0, 'Active'),
      ('BRD-M-001', 'Male', 'Clarias gariepinus', 1.8, 'Active'),
      ('BRD-M-002', 'Male', 'Hybrid', 2.2, 'Active')
    `);

        console.log('Broodstock seeded successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seedBroodstock();
