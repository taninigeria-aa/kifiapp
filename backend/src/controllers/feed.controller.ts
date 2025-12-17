
import { Request, Response } from 'express';
import { query } from '../config/db';

// Get all feed inventory
export const getFeedInventory = async (req: Request, res: Response) => {
    try {
        const result = await query(`
            SELECT i.inventory_id as feed_id, t.feed_name as name, t.category as type, i.current_stock_kg as quantity_kg, 
                   i.unit_cost_ngn as cost_per_kg, i.supplier_name as supplier, i.notes
            FROM feed_inventory i
            LEFT JOIN feed_types t ON i.feed_type_id = t.feed_type_id
            ORDER BY t.feed_name ASC
        `);
        res.json({ success: true, data: result.rows });
    } catch (error: any) {
        console.error('Get feed inventory error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

// Record Feed Purchase
export const recordPurchase = async (req: Request, res: Response) => {
    try {
        const {
            name, // Feed Name (e.g., Skretting 2mm)
            type, // Category (e.g., Floating)
            bag_size_kg,
            num_bags,
            cost_per_bag,
            supplier,
            notes
        } = req.body;

        if (!name || !bag_size_kg || !num_bags || !cost_per_bag) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const total_quantity_kg = Number(bag_size_kg) * Number(num_bags);
        const total_cost_ngn = Number(cost_per_bag) * Number(num_bags);
        const unit_cost_ngn = total_cost_ngn / total_quantity_kg;

        // 1. Check if Feed Type exists (get Type ID)
        let feedTypeId;
        const typeRes = await query('SELECT feed_type_id FROM feed_types WHERE feed_name = $1', [name]);
        if (typeRes.rows.length > 0) {
            feedTypeId = typeRes.rows[0].feed_type_id;
        } else {
            const newTypeRes = await query(
                'INSERT INTO feed_types (feed_name, category) VALUES ($1, $2) RETURNING feed_type_id',
                [name, type || 'Pellets']
            );
            feedTypeId = newTypeRes.rows[0].feed_type_id;
        }

        // 2. Check Inventory (Get current stock & cost for Weighted Avg)
        let inventoryId;
        const invRes = await query('SELECT * FROM feed_inventory WHERE feed_type_id = $1', [feedTypeId]);

        if (invRes.rows.length > 0) {
            const inv = invRes.rows[0];
            inventoryId = inv.inventory_id;

            // Weighted Average Calculation
            const currentStock = Number(inv.current_stock_kg);
            const currentCost = Number(inv.unit_cost_ngn);
            const currentTotalValue = currentStock * currentCost;

            const newTotalStock = currentStock + total_quantity_kg;
            const newTotalValue = currentTotalValue + total_cost_ngn;
            const newUnitCost = newTotalStock > 0 ? (newTotalValue / newTotalStock) : unit_cost_ngn;

            await query(
                'UPDATE feed_inventory SET current_stock_kg = $1, unit_cost_ngn = $2, supplier_name = $3, notes = $4 WHERE inventory_id = $5',
                [newTotalStock, newUnitCost, supplier, notes, inventoryId]
            );
        } else {
            // Create New Inventory Record
            const newInvRes = await query(
                `INSERT INTO feed_inventory (feed_type_id, current_stock_kg, unit_cost_ngn, supplier_name, notes) 
                 VALUES ($1, $2, $3, $4, $5) 
                 RETURNING inventory_id`,
                [feedTypeId, total_quantity_kg, unit_cost_ngn, supplier, notes]
            );
            inventoryId = newInvRes.rows[0].inventory_id;
        }

        // 3. Record Purchase History
        await query(
            `INSERT INTO feed_purchases (inventory_id, bag_size_kg, num_bags, total_quantity_kg, cost_per_bag, total_cost_ngn, supplier, notes) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [inventoryId, bag_size_kg, num_bags, total_quantity_kg, cost_per_bag, total_cost_ngn, supplier, notes]
        );

        // 4. Auto-Record Expense
        await query(
            `INSERT INTO expenses (amount_ngn, description, expense_date) 
             VALUES ($1, $2, CURRENT_DATE)`,
            [total_cost_ngn, `Feed Purchase: ${name} (${num_bags} bags @ ${bag_size_kg}kg)`]
        );

        res.status(201).json({ success: true, message: 'Feed purchase recorded successfully' });
    } catch (error: any) {
        console.error('Record purchase error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

// Log Feed Usage
export const logFeedUsage = async (req: Request, res: Response) => {
    try {
        const { batch_id, feed_id, quantity_kg, notes } = req.body;

        if (!feed_id || !quantity_kg) {
            return res.status(400).json({ success: false, message: 'Feed and quantity are required' });
        }

        // 1. Get feed_type_id from inventory
        const feedRes = await query('SELECT feed_type_id, current_stock_kg FROM feed_inventory WHERE inventory_id = $1', [feed_id]);
        if (feedRes.rows.length === 0) return res.status(404).json({ success: false, message: 'Feed not found' });

        const feedTypeId = feedRes.rows[0].feed_type_id;

        if (Number(feedRes.rows[0].current_stock_kg) < Number(quantity_kg)) {
            return res.status(400).json({ success: false, message: 'Insufficient feed stock' });
        }

        // 2. Deduct from Inventory
        await query(
            'UPDATE feed_inventory SET current_stock_kg = current_stock_kg - $1 WHERE inventory_id = $2',
            [quantity_kg, feed_id]
        );

        // 3. Log Usage (using feed_type_id and amount_kg)
        const logRes = await query(
            `INSERT INTO feeding_logs (batch_id, feed_type_id, amount_kg, notes) 
             VALUES ($1, $2, $3, $4) 
             RETURNING feeding_id as log_id`,
            [batch_id || null, feedTypeId, quantity_kg, notes]
        );

        res.json({ success: true, data: logRes.rows[0], message: 'Feed usage logged' });
    } catch (error: any) {
        console.error('Log feed usage error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

export const getFeedLogs = async (req: Request, res: Response) => {
    try {
        const result = await query(`
            SELECT l.feeding_id as log_id, l.amount_kg as quantity_kg, l.log_date, l.notes,
                   ft.feed_name as feed_name, b.batch_code
            FROM feeding_logs l
            JOIN feed_types ft ON l.feed_type_id = ft.feed_type_id
            LEFT JOIN batches b ON l.batch_id = b.batch_id
            ORDER BY l.log_date DESC
        `);
        res.json({ success: true, data: result.rows });
    } catch (error: any) {
        console.error('Get feed logs error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

// Update Feed Item
export const updateFeedItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            name,
            type,
            cost_per_kg,
            supplier,
            notes
        } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Name is required' });
        }

        // 1. Update Feed Type if name/category changed
        // We need to get the feed_type_id first
        const invRes = await query('SELECT feed_type_id FROM feed_inventory WHERE inventory_id = $1', [id]);
        if (invRes.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Feed item not found' });
        }
        const feedTypeId = invRes.rows[0].feed_type_id;

        await query(
            'UPDATE feed_types SET feed_name = $1, category = $2 WHERE feed_type_id = $3',
            [name, type || 'Pellets', feedTypeId]
        );

        // 2. Update Inventory details
        await query(
            'UPDATE feed_inventory SET unit_cost_ngn = $1, supplier_name = $2, notes = $3 WHERE inventory_id = $4',
            [cost_per_kg, supplier, notes, id]
        );

        res.json({ success: true, message: 'Feed item updated successfully' });
    } catch (error: any) {
        console.error('Update feed item error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};
