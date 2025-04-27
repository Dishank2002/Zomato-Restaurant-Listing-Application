import { Request, Response } from 'express';
import { RestaurantService } from '../services/restaurantService';
import { createWorker } from 'tesseract.js';

const worker = createWorker();

export const imageSearch = async (req: Request, res: Response) => {
    try {
        const image = req.file; // Assuming you're using multer for file uploads
        if (!image) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        const { data: { text } } = await worker.recognize(image.path);
        await worker.terminate();

        const cuisines = extractCuisinesFromText(text); // Implement this function to parse cuisines from text
        const restaurantService = new RestaurantService();
        const restaurants = await restaurantService.searchByCuisines(cuisines);

        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ message: 'Error processing image', error });
    }
};

const extractCuisinesFromText = (text: string): string[] => {
    // Implement logic to extract cuisines from recognized text
    return text.split(',').map(cuisine => cuisine.trim());
};