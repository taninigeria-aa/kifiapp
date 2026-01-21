import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Explicitly load .env from the backend directory
const envPath = path.resolve(process.cwd(), '.env');
console.log(`Loading environment from: ${envPath}`);
dotenv.config({ path: envPath });

import app from './app';
import { initializeDatabase } from './utils/initDatabase';

const PORT = process.env.PORT || 3000;

if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined.');
    console.log('Current env variables:', Object.keys(process.env).filter(k => k.includes('JWT') || k.includes('DATABASE')));
    process.exit(1);
}

// Initialize database if needed, then start server
async function startServer() {
    try {
        console.log('Starting server initialization...');

        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) {
            console.error('❌ FATAL ERROR: DATABASE_URL is not defined in process.env');
            process.exit(1);
        }

        console.log(`DATABASE_URL found. Length: ${dbUrl.length}`);
        console.log(`DATABASE_URL starts with: ${dbUrl.substring(0, 15)}...`);

        console.log('Initializing database...');
        await initializeDatabase();

        const host = '0.0.0.0';
        app.listen(Number(PORT), host, () => {
            console.log(`✅ Server is running on http://${host}:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
