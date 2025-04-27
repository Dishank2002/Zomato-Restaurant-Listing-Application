import express from 'express';
import bodyParser from 'body-parser';
import restaurantRoutes from './routes/restaurantRoutes';
import { connectDB } from './utils/db';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());



// Database connection
connectDB().then(() => {
    console.log('Database connected successfully');

    // Set up routes
    app.use('/api', restaurantRoutes);
    app.use((req, res, next) => {
        res.status(404).json({ message: 'Route not found' });
    });
    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error('Failed to connect to the database:', error);
});