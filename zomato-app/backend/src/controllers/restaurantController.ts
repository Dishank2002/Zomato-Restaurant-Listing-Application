import { Request, Response } from 'express';
import { RestaurantService } from '../services/restaurantService';
import vision from '@google-cloud/vision';
import path from 'path';

export class RestaurantController {
    private restaurantService: RestaurantService;

    constructor() {
        this.restaurantService = new RestaurantService();

        // Bind methods to the instance
        this.getRestaurantById = this.getRestaurantById.bind(this);
        this.getRestaurants = this.getRestaurants.bind(this);
        this.searchRestaurantsByLocation = this.searchRestaurantsByLocation.bind(this);
        this.detectFoodAndCuisine = this.detectFoodAndCuisine.bind(this);
        this.filterRestaurants = this.filterRestaurants.bind(this);
    
    }

    public async getRestaurantById(req: Request, res: Response): Promise<void> {
        const restaurantId = req.params.id;
        if (isNaN(Number(restaurantId))) {
            res.status(400).json({ message: 'Invalid restaurant ID' });
            return;
        }

        try {
            const restaurant = await this.restaurantService.getRestaurantById(restaurantId);
            if (restaurant) {
                res.status(200).json(restaurant);
            } else {
                res.status(404).json({ message: 'Restaurant not found' });
            }
        } catch (error) {
            console.error('Error in getRestaurantById:', error);
            res.status(500).json({ message: 'Internal server error', error });
        }
    }

    public async getRestaurants(req: Request, res: Response): Promise<void> {
        const { page = 1, limit = 10 } = req.query;
        try {
            const { restaurants, totalCount } = await this.restaurantService.getRestaurants(Number(page), Number(limit));
            res.status(200).json({ restaurants, totalCount });
        } catch (error) {
            console.error('Error in getRestaurants:', error);
            res.status(500).json({ message: 'Internal server error', error });
        }
    }

    public async searchRestaurantsByLocation(req: Request, res: Response): Promise<void> {
        const { latitude, longitude, radius } = req.query;

        if (!latitude || !longitude || !radius) {
            res.status(400).json({ message: 'Missing required query parameters: latitude, longitude, radius' });
            return;
        }

        try {
            const restaurants = await this.restaurantService.searchRestaurantsByLocation(
                parseFloat(latitude as string),
                parseFloat(longitude as string),
                parseFloat(radius as string)
            );
            res.status(200).json(restaurants);
        } catch (error) {
            console.error('Error in searchRestaurantsByLocation:', error);
            res.status(500).json({ message: 'Internal server error', error });
        }
    }

    public async detectFoodAndCuisine(req: Request, res: Response): Promise<void> {
        try {
            const image = req.file;
            if (!image) {
                res.status(400).json({ message: 'No image uploaded' });
                return;
            }

            const client = new vision.ImageAnnotatorClient({
                keyFilename: path.join(__dirname, '../../config/google-vision-key.json'),
            });

            const [result] = await client.labelDetection(image.path);
            const labels = result.labelAnnotations?.map((label) => label.description?.toLowerCase()) || [];
            console.log('Detected labels:', labels);

            if (labels.length === 0) {
                res.status(404).json({ message: 'No food detected in the image' });
                return;
            }

            const irrelevantLabels = ['food', 'ingredient', 'recipe', 'dish', 'cuisine', 'fast food', 'comfort food'];
            const detectedFood = labels.find(label => label && !irrelevantLabels.includes(label)) || labels[0] || 'unknown';

            if (!detectedFood) {
                res.status(404).json({ message: 'Unable to detect food from the image' });
                return;
            }

            const cuisine = await this.getCuisineForFood(detectedFood);

            if (cuisine === 'Unknown') {
                res.status(404).json({ message: 'Cuisine could not be determined' });
                return;
            }

            res.status(200).json({ food: detectedFood, cuisine });
        } catch (error) {
            console.error('Error in detectFoodAndCuisine:', error);
            res.status(500).json({ message: 'Internal server error', error });
        }
    }

    private async getCuisineForFood(food: string): Promise<string> {
        const foodToCuisineMap: { [key: string]: string } = {
            pizza: 'Italian',
            pasta: 'Italian',
            lasagna: 'Italian',
            risotto: 'Italian',
            sushi: 'Japanese',
            ramen: 'Japanese',
            tempura: 'Japanese',
            miso: 'Japanese',
            biryani: 'Indian',
            'butter chicken': 'Indian',
            samosa: 'Indian',
            dosa: 'Indian',
            naan: 'Indian',
            tacos: 'Mexican',
            burrito: 'Mexican',
            quesadilla: 'Mexican',
            enchiladas: 'Mexican',
            croissant: 'French',
            baguette: 'French',
            crepe: 'French',
            escargot: 'French',
            shawarma: 'Middle Eastern',
            falafel: 'Middle Eastern',
            hummus: 'Middle Eastern',
            tabbouleh: 'Middle Eastern',
            pho: 'Vietnamese',
            'banh mi': 'Vietnamese',
            'spring roll': 'Vietnamese',
            kimchi: 'Korean',
            bulgogi: 'Korean',
            bibimbap: 'Korean',
            poutine: 'Canadian',
            'fried chicken': 'American',
            hamburger: 'American',
            'hot dog': 'American',
            cheesecake: 'American',
            schnitzel: 'German',
            bratwurst: 'German',
            pretzel: 'German',
            currywurst: 'German',
            paella: 'Spanish',
            churros: 'Spanish',
            tapas: 'Spanish',
            gazpacho: 'Spanish',
            'tom yum': 'Thai',
            'green curry': 'Thai',
            'pad thai': 'Thai',
            'massaman curry': 'Thai',
            kebab: 'Turkish',
            baklava: 'Turkish',
            manti: 'Turkish',
            laksa: 'Malaysian',
            'nasi lemak': 'Malaysian',
            rendang: 'Malaysian',
            'beef stew': 'Irish',
            'fish and chips': 'British',
            'shepherd’s pie': 'British',
            'dim sum': 'Chinese',
            'chow mein': 'Chinese',
            'peking duck': 'Chinese',
            gyoza: 'Chinese',
        };

        return foodToCuisineMap[food.toLowerCase()] || 'Unknown';
    }

    public async filterRestaurants(req: Request, res: Response): Promise<void> {
        const { cuisine, page = 1, limit = 20 } = req.query;

        try {
            if (!cuisine) {
                res.status(400).json({ message: 'Cuisine is required for filtering' });
                return;
            }

            const { restaurants, totalCount } = await this.restaurantService.filterRestaurantsByCuisine(
                cuisine as string,
                Number(page),
                Number(limit)
            );

            res.status(200).json({ restaurants, totalCount });
        } catch (error) {
            console.error('Error in filterRestaurants:', error);
            res.status(500).json({ message: 'Internal server error', error });
        }
    }
}