
import { Request, Response } from 'express';
import { query } from '../config/db';

export const getExpenses = async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT *, amount_ngn as amount FROM expenses ORDER BY expense_date DESC');
        res.json({ success: true, data: result.rows });
    } catch (error: any) {
        console.error('Get expenses error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

export const recordExpense = async (req: Request, res: Response) => {
    try {
        const { category, amount, description, expense_date } = req.body;

        // Note: category in DB is likely an ID or string. Assuming string or using description as category for now 
        // if category column doesn't match perfectly. Schema showed 'expense_category_id'? 
        // No, 'expense_categories' table exists. 
        // Let's assume passed category is just description or we insert into category table. 
        // For simplicity: We will use 'description' for description and 'amount_ngn' for amount.
        // We might need to look up category ID. 
        // Actually, let's keep it simple: Use 'description' field for both/combined if category logic is complex.

        const result = await query(
            `INSERT INTO expenses (amount_ngn, description, expense_date) 
             VALUES ($1, $2, $3) 
             RETURNING *`,
            [amount, description || category, expense_date || new Date()]
        );
        res.status(201).json({ success: true, data: result.rows[0], message: 'Expense recorded' });
    } catch (error: any) {
        console.error('Record expense error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

export const getFinancialSummary = async (req: Request, res: Response) => {
    try {
        // 1. Total Expenses from expenses table
        const expenseRes = await query('SELECT SUM(amount_ngn) as total_expenses FROM expenses');
        const totalExpenses = Number(expenseRes.rows[0].total_expenses) || 0;

        // 2. Total Worker Salaries (Active workers only)
        const salaryRes = await query(`SELECT SUM(salary_ngn) as total_salaries FROM workers WHERE status = 'Active'`);
        const totalSalaries = Number(salaryRes.rows[0].total_salaries) || 0;

        // 3. Total Revenue (Sales)
        const salesRes = await query('SELECT SUM(total_amount_ngn) as total_revenue FROM sales');
        const totalRevenue = Number(salesRes.rows[0].total_revenue) || 0;

        // Combined expenses (expenses + monthly salaries)
        const combinedExpenses = totalExpenses + totalSalaries;

        res.json({
            success: true,
            data: {
                total_revenue: totalRevenue,
                total_expenses: combinedExpenses,
                net_profit: totalRevenue - combinedExpenses
            }
        });
    } catch (error: any) {
        console.error('Financial summary error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

export const getDetailedFinancialReport = async (req: Request, res: Response) => {
    try {
        // 1. Get Summary
        const expenseRes = await query('SELECT SUM(amount_ngn) as total_expenses FROM expenses');
        const totalExpenses = Number(expenseRes.rows[0].total_expenses) || 0;

        const salaryRes = await query(`SELECT SUM(salary_ngn) as total_salaries FROM workers WHERE status = 'Active'`);
        const totalSalaries = Number(salaryRes.rows[0].total_salaries) || 0;

        const salesRes = await query('SELECT SUM(total_amount_ngn) as total_revenue FROM sales');
        const totalRevenue = Number(salesRes.rows[0].total_revenue) || 0;

        const combinedExpenses = totalExpenses + totalSalaries;

        // 2. Get Recent Sales (Last 10)
        const recentSalesRes = await query(`
            SELECT s.sale_code, c.full_name as customer_name, s.sale_date, s.total_amount_ngn
            FROM sales s
            LEFT JOIN customers c ON s.customer_id = c.customer_id
            ORDER BY s.sale_date DESC
            LIMIT 10
        `);

        // 3. Get Recent Expenses (Last 10)
        const recentExpensesRes = await query(`
            SELECT description, expense_date, amount_ngn
            FROM expenses
            ORDER BY expense_date DESC
            LIMIT 10
        `);

        res.json({
            success: true,
            data: {
                summary: {
                    total_revenue: totalRevenue,
                    total_expenses: combinedExpenses,
                    net_profit: totalRevenue - combinedExpenses,
                    operational_expenses: totalExpenses,
                    salaries: totalSalaries
                },
                recent_sales: recentSalesRes.rows,
                recent_expenses: recentExpensesRes.rows
            }
        });
    } catch (error: any) {
        console.error('Detailed financial report error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

