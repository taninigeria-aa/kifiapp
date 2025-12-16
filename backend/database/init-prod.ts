
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function initProdDb() {
    console.log('Starting Production Database Initialization...');

    try {
        // Read schema
        const schemaPath = path.join(__dirname, 'clean-schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Apply schema
        console.log('Applying schema...');
        await pool.query(schemaSql);
        console.log('Schema applied successfully.');

        // Seed admin user
        console.log('Seeding admin user...');
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Get role ID
        const roleRes = await pool.query("SELECT role_id FROM user_roles WHERE role_name = 'owner'");
        if (roleRes.rows.length === 0) {
            throw new Error("Role 'owner' not found after schema application.");
        }
        const roleId = roleRes.rows[0].role_id;

        // Insert admin
        const userRes = await pool.query(
            `INSERT INTO users (username, full_name, phone_number, password_hash, role_id)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (username) DO NOTHING
             RETURNING user_id`,
            ['admin', 'System Administrator', '08000000000', hashedPassword, roleId]
        );

        if (userRes.rows.length > 0) {
            console.log('Admin user created: admin / admin123');
        } else {
            console.log('Admin user already exists.');
        }

    } catch (err) {
        console.error('Error initializing production database:', err);
    } finally {
        await pool.end();
    }
}

initProdDb();
