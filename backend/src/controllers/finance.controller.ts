
import { Request, Response } from 'express';
import { query } from '../config/db';

export const getExpenses = async (req: Request, res: Response) => {
    try {
        const result = await query(`
            SELECT e.*, e.amount_ngn as amount, c.category_name 
            FROM expenses e 
            LEFT JOIN expense_categories c ON e.category_id = c.category_id 
            ORDER BY e.expense_date DESC
        `);
        res.json({ success: true, data: result.rows });
    } catch (error: any) {
        console.error('Get expenses error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

export const recordExpense = async (req: Request, res: Response) => {
    try {
        const { category_id, amount, description, expense_date, batch_id } = req.body;

        if (!category_id || !amount) {
            return res.status(400).json({ success: false, message: 'Category and amount are required' });
        }

        const result = await query(
            `INSERT INTO expenses (amount_ngn, description, expense_date, category_id, batch_id) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING *`,
            [amount, description, expense_date || new Date(), category_id, batch_id]
        );
        res.status(201).json({ success: true, data: result.rows[0], message: 'Expense recorded' });
    } catch (error: any) {
        console.error('Record expense error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

export const deleteExpense = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM expenses WHERE expense_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }
        res.json({ success: true, message: 'Expense deleted successfully' });
    } catch (error: any) {
        console.error('Delete expense error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
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
        const expenseRes = await query('SELECT SUM(amount_ngn) as total_expenses FROM expenses');
        const totalExpenses = Number(expenseRes.rows[0].total_expenses) || 0;

        const salaryRes = await query(`SELECT SUM(salary_ngn) as total_salaries FROM workers WHERE status = 'Active'`);
        const totalSalaries = Number(salaryRes.rows[0].total_salaries) || 0;

        const salesRes = await query('SELECT SUM(total_amount_ngn) as total_revenue FROM sales');
        const totalRevenue = Number(salesRes.rows[0].total_revenue) || 0;

        const combinedExpenses = totalExpenses + totalSalaries;

        const recentSalesRes = await query(`
            SELECT s.sale_code, c.full_name as customer_name, s.sale_date, s.total_amount_ngn
            FROM sales s
            LEFT JOIN customers c ON s.customer_id = c.customer_id
            ORDER BY s.sale_date DESC
            LIMIT 10
        `);

        const recentExpensesRes = await query(`
            SELECT e.description, e.expense_date, e.amount_ngn, c.category_name
            FROM expenses e
            LEFT JOIN expense_categories c ON e.category_id = c.category_id
            ORDER BY e.expense_date DESC
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

// --- Categories ---

export const getCategories = async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT * FROM expense_categories ORDER BY category_name ASC');
        res.json({ success: true, data: result.rows });
    } catch (error: any) {
        console.error('Get categories error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const addCategory = async (req: Request, res: Response) => {
    try {
        const { category_name, description } = req.body;
        if (!category_name) {
            return res.status(400).json({ success: false, message: 'Category name is required' });
        }
        const result = await query(
            'INSERT INTO expense_categories (category_name, description) VALUES ($1, $2) RETURNING *',
            [category_name, description]
        );
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error: any) {
        console.error('Add category error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { category_name, description, is_active } = req.body;
        const result = await query(
            'UPDATE expense_categories SET category_name = $1, description = $2, is_active = $3 WHERE category_id = $4 RETURNING *',
            [category_name, description, is_active, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (error: any) {
        console.error('Update category error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deps = await query('SELECT expense_id FROM expenses WHERE category_id = $1 LIMIT 1', [id]);
        if (deps.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Cannot delete category with associated expenses' });
        }
        const result = await query('DELETE FROM expense_categories WHERE category_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.json({ success: true, message: 'Category deleted successfully' });
    } catch (error: any) {
        console.error('Delete category error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
