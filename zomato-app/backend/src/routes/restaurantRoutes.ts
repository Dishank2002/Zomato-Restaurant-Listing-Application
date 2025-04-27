import { Router } from 'express';
import { RestaurantController } from '../controllers/restaurantController';
import multer from 'multer';

const router = Router();
const restaurantController = new RestaurantController();
const upload = multer({ dest: 'uploads/' });

// Define more specific routes first
router.get('/restaurants/search/location', restaurantController.searchRestaurantsByLocation); // Search by location
router.get('/restaurants/filter', restaurantController.filterRestaurants); // Filter restaurants
router.post('/restaurants/food-detection', upload.single('image'), restaurantController.detectFoodAndCuisine);

// Define less specific routes later
router.get('/restaurants/:id', restaurantController.getRestaurantById); // Get restaurant by ID
router.get('/restaurants', restaurantController.getRestaurants); // Get all restaurants



export default router;