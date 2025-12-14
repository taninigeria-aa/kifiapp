import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../config/db';

export const register = async (req: Request, res: Response) => {
    const { username, password, phone_number, full_name, role_name } = req.body;

    if (!username || !password || !phone_number || !full_name) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
        // Check if user already exists
        const userCheck = await query('SELECT * FROM users WHERE username = $1 OR phone_number = $2', [username, phone_number]);
        if (userCheck.rows.length > 0) {
            return res.status(409).json({ success: false, message: 'Username or phone number already exists' });
        }

        // Get role ID
        const roleResult = await query('SELECT role_id FROM user_roles WHERE role_name = $1', [role_name || 'junior_assistant']);
        if (roleResult.rows.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid role' });
        }
        const role_id = roleResult.rows[0].role_id;

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const result = await query(
            `INSERT INTO users (username, password_hash, phone_number, full_name, role_id) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING user_id, username, full_name, created_at`,
            [username, hashedPassword, phone_number, full_name, role_id]
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: result.rows[0]
        });

    } catch (error: any) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    const { phone_number, password } = req.body;

    if (!phone_number || !password) {
        return res.status(400).json({ success: false, message: 'Phone number and password are required' });
    }

    try {
        // Check if user exists
        const userResult = await query(
            `SELECT u.*, r.role_name 
       FROM users u 
       JOIN user_roles r ON u.role_id = r.role_id 
       WHERE u.phone_number = $1`,
            [phone_number]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = userResult.rows[0];

        // Verify password
        // NOTE: In production schema, password_hash uses pgcrypto. 
        // If using bcrypt in Node, we need to handle verifying against that or migrating.
        // The schema says: password_hash VARCHAR(255) NOT NULL
        // And sample insert uses: crypt('admin123', gen_salt('bf')) which is bcrypt compatible.
        // So bcrypt.compare should work if the hash format is standard.
        // However, postgres pgcrypto 'bf' salt generates standard bcrypt hashes.

        // For the initial seed, the schema uses pgcrypto. 
        // We will use bcrypt.compare() to verify.
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate Tokens
        const accessToken = jwt.sign(
            {
                user_id: user.user_id,
                role: user.role_name,
                username: user.username
            },
            process.env.JWT_SECRET as string,
            { expiresIn: (process.env.JWT_EXPIRES_IN || '24h') as any }
        );

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    user_id: user.user_id,
                    username: user.username,
                    full_name: user.full_name,
                    role: user.role_name
                },
                token: accessToken
            }
        });

    } catch (error: any) {
        console.error('Login error details:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        res.status(500).json({
            success: false,
            message: 'Server error: ' + error.message
        });
    }
};

export const verifyToken = async (req: Request, res: Response) => {
    // If it reaches here, middleware passed
    // @ts-ignore
    const user = req.user;
    res.json({ success: true, data: { user } });
};
