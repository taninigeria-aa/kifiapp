import { query } from './src/config/db';

async function cleanupDemo() {
  try {
    console.log('Starting demo data cleanup...');

    // Delete broodstock seeded by seed-broodstock.ts (codes starting with BRD-)
    const res1 = await query("DELETE FROM broodstock WHERE broodstock_code LIKE 'BRD-%' RETURNING *;");
    console.log(`Deleted ${res1.rowCount} broodstock rows`);

    // Delete tanks seeded by seed-tanks.ts (codes starting with TNK-)
    const res2 = await query("DELETE FROM tanks WHERE tank_code LIKE 'TNK-%' RETURNING *;");
    console.log(`Deleted ${res2.rowCount} tank rows`);

    console.log('Demo data cleanup completed.');
    process.exit(0);
  } catch (err: any) {
    console.error('Cleanup failed:', err);
    process.exit(1);
  }
}

cleanupDemo();
