import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import dashboardRoutes from './routes/dashboard.routes';
import spawnRoutes from './routes/spawn.routes';
import broodstockRoutes from './routes/broodstock.routes';
import tankRoutes from './routes/tank.routes';
import productionRoutes from './routes/production.routes';
import salesRoutes from './routes/sales.routes';
import financeRoutes from './routes/finance.routes';
import peopleRoutes from './routes/people.routes';
import healthRoutes from './routes/health.routes';

const app: Application = express();

// Security Middleware
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/spawns', spawnRoutes);
app.use('/api/v1/broodstock', broodstockRoutes);
app.use('/api/v1/tanks', tankRoutes);
app.use('/api/v1/production', productionRoutes);
app.use('/api/v1/sales', salesRoutes);
app.use('/api/v1/finance', financeRoutes);
app.use('/api/v1/people', peopleRoutes);
app.use('/api/v1/health', healthRoutes);

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Global Error Handler
interface ErrorWithStatus extends Error {
    status?: number;
}

app.use((err: ErrorWithStatus, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

export default app;
