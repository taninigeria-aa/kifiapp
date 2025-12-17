
import { Request, Response } from 'express';
import { query } from '../config/db';

export const getCustomers = async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT *, full_name as name, phone_number as phone, location as address FROM customers ORDER BY full_name ASC');
        res.json({ success: true, data: result.rows });
    } catch (error: any) {
        console.error('Get customers error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const createCustomer = async (req: Request, res: Response) => {
    try {
        const { name, phone, email, address, notes } = req.body;

        if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

        // Generate a simple customer code
        const customer_code = `CUST-${Date.now().toString().slice(-6)}`;

        const result = await query(
            'INSERT INTO customers (full_name, phone_number, email, location, notes, customer_code) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, phone, email, address, notes, customer_code]
        );
        res.status(201).json({ success: true, data: result.rows[0], message: 'Customer created' });
    } catch (error: any) {
        console.error('Create customer error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

export const updateCustomer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, phone, email, address, notes } = req.body;

        if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

        const result = await query(
            `UPDATE customers 
             SET full_name = $1, phone_number = $2, email = $3, location = $4, notes = $5
             WHERE customer_id = $6
             RETURNING *`,
            [name, phone, email, address, notes, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        res.json({ success: true, data: result.rows[0], message: 'Customer updated successfully' });
    } catch (error: any) {
        console.error('Update customer error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};
