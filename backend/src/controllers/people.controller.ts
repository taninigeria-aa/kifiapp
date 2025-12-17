
import { Request, Response } from 'express';
import { query } from '../config/db';

// --- Suppliers ---

export const getSuppliers = async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT * FROM suppliers ORDER BY name ASC');
        res.json({ success: true, data: result.rows });
    } catch (error: any) {
        console.error('Error fetching suppliers:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

export const addSupplier = async (req: Request, res: Response) => {
    try {
        const { name, contact_person, phone, email, category, notes } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Supplier name is required' });
        }

        const result = await query(
            `INSERT INTO suppliers (name, contact_person, phone_number, email, category, notes) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
            [name, contact_person, phone, email, category, notes]
        );
        res.status(201).json({ success: true, data: result.rows[0], message: 'Supplier added successfully' });
    } catch (error: any) {
        console.error('Error adding supplier:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

export const updateSupplier = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, contact_person, phone, email, category, notes } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Supplier name is required' });
        }

        const result = await query(
            `UPDATE suppliers 
             SET name = $1, contact_person = $2, phone_number = $3, email = $4, category = $5, notes = $6
             WHERE supplier_id = $7
             RETURNING *`,
            [name, contact_person, phone, email, category, notes, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Supplier not found' });
        }

        res.json({ success: true, data: result.rows[0], message: 'Supplier updated successfully' });
    } catch (error: any) {
        console.error('Error updating supplier:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

// --- Workers ---

export const getWorkers = async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT * FROM workers ORDER BY full_name ASC');
        res.json({ success: true, data: result.rows });
    } catch (error: any) {
        console.error('Error fetching workers:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

export const addWorker = async (req: Request, res: Response) => {
    try {
        const { full_name, role, phone, start_date, salary_ngn, status } = req.body;

        if (!full_name) {
            return res.status(400).json({ success: false, message: 'Worker name is required' });
        }

        const result = await query(
            `INSERT INTO workers (full_name, role, phone_number, start_date, salary_ngn, status) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
            [full_name, role, phone, start_date || new Date(), salary_ngn || 0, status || 'Active']
        );
        res.status(201).json({ success: true, data: result.rows[0], message: 'Worker added successfully' });
    } catch (error: any) {
        console.error('Error adding worker:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};
