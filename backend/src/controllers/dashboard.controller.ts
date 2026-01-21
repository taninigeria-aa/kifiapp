import { Request, Response } from 'express';
import { query } from '../config/db';

export const getDashboardSummary = async (req: Request, res: Response) => {
    try {
        // These queries align with the schema views or direct table counts
        const activeBatchesResult = await query(`SELECT COUNT(*) as count FROM batches WHERE status = 'Active'`);
        const totalFishResult = await query(`SELECT SUM(current_count) as total FROM batches WHERE status = 'Active'`);
        const recentSpawnsResult = await query(`SELECT COUNT(*) as count FROM spawns WHERE spawn_date >= CURRENT_DATE - INTERVAL '60 days'`);
        const recentSalesResult = await query(`SELECT COALESCE(SUM(total_amount_ngn), 0) as total FROM sales WHERE sale_date >= CURRENT_DATE - INTERVAL '60 days'`);

        let recentExpenses = 0;
        try {
            const recentExpensesResult = await query(`SELECT COALESCE(SUM(amount_ngn), 0) as total FROM expenses WHERE expense_date >= CURRENT_DATE - INTERVAL '60 days'`);
            recentExpenses = parseFloat(recentExpensesResult.rows[0]?.total || '0');
        } catch (e) {
            console.warn('Could not fetch recent expenses:', e);
        }

        const summary = {
            active_batches: parseInt(activeBatchesResult.rows[0]?.count || '0'),
            total_fish: parseInt(totalFishResult.rows[0]?.total || '0'),
            recent_spawns: parseInt(recentSpawnsResult.rows[0]?.count || '0'),
            recent_sales: parseFloat(recentSalesResult.rows[0]?.total || '0'),
            recent_expenses: recentExpenses,
            low_stock_items: 0,
            active_health_issues: 0
        };

        res.json({ success: true, data: summary });
    } catch (error: any) {
        console.error('Dashboard summary error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getDashboardTasks = async (req: Request, res: Response) => {
    try {
        // Mocked tasks for now as per plan
        const tasks = {
            spawning_scheduled: [],
            tanks_to_sample: [
                { tank_id: 1, tank_code: 'TOP-1', batch_code: 'BATCH-2024-001', days_since_last_sample: 7 }
            ],
            deliveries_due: [],
            feed_to_reorder: []
        };

        res.json({ success: true, data: tasks });
    } catch (error: any) {
        console.error('Dashboard tasks error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
