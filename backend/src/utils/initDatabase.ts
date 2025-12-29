import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

export async function initializeDatabase(): Promise<void> {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL
    });

    try {
        console.log('Synchronizing database schema...');

        // Read and apply master schema
        const schemaPath = path.join(__dirname, '../../database/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Applying database schema (IF NOT EXISTS)...');
        await pool.query(schemaSql);
        console.log('Schema synchronized successfully.');

        // Create admin user
        console.log('Ensuring admin user exists...');
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Get owner role ID
        const roleRes = await pool.query("SELECT role_id FROM user_roles WHERE role_name = 'owner'");
        if (roleRes.rows.length === 0) {
            throw new Error("Role 'owner' not found. Please check schema.sql.");
        }
        const roleId = roleRes.rows[0].role_id;

        // Insert admin user
        const userRes = await pool.query(
            `INSERT INTO users (username, full_name, phone_number, password_hash, role_id)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (username) DO NOTHING
             RETURNING user_id`,
            ['admin', 'System Administrator', '08000000000', hashedPassword, roleId]
        );

        if (userRes.rows.length > 0) {
            console.log('✅ Admin user verified/created.');
        }

        console.log('✅ Database synchronization complete!');

    } catch (error) {
        console.error('❌ Error synchronizing database:', error);
        throw error;
    } finally {
        await pool.end();
    }
}
