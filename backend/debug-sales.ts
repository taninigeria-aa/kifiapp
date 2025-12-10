import { query } from './src/config/db';

const checkSalesData = async () => {
    try {
        const end = new Date();
        const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const summaryRes = await query(`
            SELECT 
                COUNT(*) as total_sales,
                COALESCE(SUM(quantity_sold), 0)::integer as total_quantity,
                COALESCE(SUM(total_amount_ngn), 0) as total_revenue,
                COALESCE(AVG(total_amount_ngn), 0) as avg_sale_value
            FROM sales
            WHERE sale_date BETWEEN $1 AND $2
        `, [start, end]);

        console.log('Sales Summary:', summaryRes.rows[0]);
        console.log('Total Quantity Type:', typeof summaryRes.rows[0].total_quantity);
        console.log('Total Quantity Value:', summaryRes.rows[0].total_quantity);

        // Also check individual sales
        const salesRes = await query(`
            SELECT quantity_sold, total_amount_ngn 
            FROM sales 
            WHERE sale_date BETWEEN $1 AND $2
        `, [start, end]);

        console.log('\nIndividual Sales:');
        salesRes.rows.forEach((sale, i) => {
            console.log(`Sale ${i + 1}: Quantity=${sale.quantity_sold}, Amount=${sale.total_amount_ngn}`);
        });

    } catch (error) {
        console.error('Error:', error);
    }
    process.exit(0);
};

checkSalesData();
