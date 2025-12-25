import { Request, Response } from 'express';
import { query } from '../config/db';

export const getDashboardSummary = async (req: Request, res: Response) => {
    try {
        // These queries align with the schema views or direct table counts
        const activeBatchesResult = await query(`SELECT COUNT(*) as count FROM batches WHERE status = 'Active'`);
        const totalFishResult = await query(`SELECT SUM(current_count) as total FROM batches WHERE status = 'Active'`);
        const spawnsThisWeekResult = await query(`SELECT COUNT(*) as count FROM spawns WHERE spawn_date >= CURRENT_DATE - INTERVAL '7 days'`);
        const salesThisWeekResult = await query(`SELECT SUM(total_amount_ngn) as total FROM sales WHERE sale_date >= CURRENT_DATE - INTERVAL '7 days'`);

        // Use a safe query that won't fail if table doesn't exist (though it should)
        // Or better yet, wrap in try-catch specifically for this new feature 
        let expensesThisMonth = 0;
        try {
            const expensesThisMonthResult = await query(`SELECT COALESCE(SUM(amount_ngn), 0) as total FROM expenses WHERE expense_date >= DATE_TRUNC('month', CURRENT_DATE)`);
            expensesThisMonth = parseFloat(expensesThisMonthResult.rows[0]?.total || '0');
        } catch (e) {
            console.warn('Could not fetch expenses (table might be missing):', e);
        }

        // For now, mock some data if DB is empty to show UI
        const summary = {
            active_batches: parseInt(activeBatchesResult.rows[0]?.count || '0'),
            total_fish: parseInt(totalFishResult.rows[0]?.total || '0'),
            spawns_this_week: parseInt(spawnsThisWeekResult.rows[0]?.count || '0'),
            sales_this_week: parseInt(salesThisWeekResult.rows[0]?.total || '0'),
            expenses_this_month: expensesThisMonth,
            low_stock_items: 0, // Placeholder
            active_health_issues: 0 // Placeholder
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
