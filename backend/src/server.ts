import app from './app';
import dotenv from 'dotenv';
import { initializeDatabase } from './utils/initDatabase';

dotenv.config();

const PORT = process.env.PORT || 3000;

if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined.');
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
