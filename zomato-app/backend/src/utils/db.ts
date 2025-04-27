import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});

const connectDB = async () => {
    try {
        await pool.connect();
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

const queryDB = async (query: string, params: any[]) => {
    try {
        const res = await pool.query(query, params);
        return res.rows;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

export { connectDB, queryDB, pool };