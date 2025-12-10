
import { Request, Response } from 'express';
import { query } from '../config/db';

export const getSales = async (req: Request, res: Response) => {
    try {
        const result = await query(`
            SELECT s.*, 
                   c.full_name as customer_name, 
                   b.batch_code,
                   s.quantity_sold as quantity,
                   s.total_amount_ngn as total_amount
            FROM sales s
            LEFT JOIN customers c ON s.customer_id = c.customer_id
            LEFT JOIN batches b ON s.batch_id = b.batch_id
            ORDER BY s.sale_date DESC
        `);
        res.json({ success: true, data: result.rows });
    } catch (error: any) {
        console.error('Get sales error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const createSale = async (req: Request, res: Response) => {
    try {
        const {
            customer_id,
            batch_id,
            sale_date,
            quantity,
            weight_kg,
            price_per_unit,
            total_amount,
            payment_status,
            notes
        } = req.body;

        if (!customer_id || !batch_id || !quantity || !total_amount) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Generate Sale Code
        const dateStr = new Date(sale_date).toISOString().slice(0, 10).replace(/-/g, '');
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const sale_code = `SALE-${dateStr}-${randomSuffix}`;

        // Calculate Average Size (g) if weight is provided
        let avg_size_g = 0;
        if (weight_kg && quantity > 0) {
            avg_size_g = (weight_kg * 1000) / quantity;
        }

        // 1. Record Sale
        // Assuming subtotal = total for now (delivery cost = 0)
        const subtotal = total_amount;
        const delivery_cost = 0;

        const saleRes = await query(
            `INSERT INTO sales 
            (customer_id, batch_id, sale_date, quantity_sold, avg_size_g, price_per_piece_ngn, subtotal_ngn, delivery_cost_ngn, total_amount_ngn, payment_status, notes, sale_code) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
            RETURNING *`,
            [
                customer_id,
                batch_id,
                sale_date,
                quantity,
                avg_size_g,
                price_per_unit,
                subtotal,
                delivery_cost,
                total_amount,
                payment_status || 'Pending',
                notes,
                sale_code
            ]
        );

        // 2. Decrement Batch Count
        await query(
            'UPDATE batches SET current_count = current_count - $1 WHERE batch_id = $2',
            [quantity, batch_id]
        );

        res.status(201).json({ success: true, data: saleRes.rows[0], message: 'Sale recorded successfully' });
    } catch (error: any) {
        console.error('Create sale error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

export const getSalesReport = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate } = req.query;

        // Default to last 30 days if no dates provided
        const end = endDate ? new Date(endDate as string) : new Date();
        const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        // 1. Sales Summary
        const summaryRes = await query(`
            SELECT 
                COUNT(*) as total_sales,
                COALESCE(SUM(quantity_sold), 0)::integer as total_quantity,
                COALESCE(SUM(total_amount_ngn), 0) as total_revenue,
                COALESCE(AVG(total_amount_ngn), 0) as avg_sale_value
            FROM sales
            WHERE sale_date BETWEEN $1 AND $2
        `, [start, end]);

        // 2. Top Customers
        const topCustomersRes = await query(`
            SELECT 
                c.full_name as customer_name,
                COUNT(s.sale_id) as purchase_count,
                SUM(s.total_amount_ngn) as total_spent
            FROM sales s
            LEFT JOIN customers c ON s.customer_id = c.customer_id
            WHERE s.sale_date BETWEEN $1 AND $2
            GROUP BY c.customer_id, c.full_name
            ORDER BY total_spent DESC
            LIMIT 10
        `, [start, end]);

        // 3. Sales by Batch
        const salesByBatchRes = await query(`
            SELECT 
                b.batch_code,
                COUNT(s.sale_id) as sales_count,
                SUM(s.quantity_sold) as total_quantity,
                SUM(s.total_amount_ngn) as total_revenue
            FROM sales s
            LEFT JOIN batches b ON s.batch_id = b.batch_id
            WHERE s.sale_date BETWEEN $1 AND $2
            GROUP BY b.batch_id, b.batch_code
            ORDER BY total_revenue DESC
        `, [start, end]);

        // 4. Detailed Sales Transactions
        const salesTransactionsRes = await query(`
            SELECT 
                s.sale_date,
                c.full_name as customer_name,
                b.batch_code,
                s.quantity_sold,
                s.price_per_piece_ngn,
                s.total_amount_ngn,
                s.payment_status
            FROM sales s
            LEFT JOIN customers c ON s.customer_id = c.customer_id
            LEFT JOIN batches b ON s.batch_id = b.batch_id
            WHERE s.sale_date BETWEEN $1 AND $2
            ORDER BY s.sale_date DESC
        `, [start, end]);

        res.json({
            success: true,
            data: {
                period: {
                    start_date: start.toISOString().split('T')[0],
                    end_date: end.toISOString().split('T')[0]
                },
                summary: summaryRes.rows[0],
                top_customers: topCustomersRes.rows,
                sales_by_batch: salesByBatchRes.rows,
                transactions: salesTransactionsRes.rows
            }
        });
    } catch (error: any) {
        console.error('Sales report error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

