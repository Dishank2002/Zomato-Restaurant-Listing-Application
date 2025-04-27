import React, { useEffect, useState } from 'react';
import { getRestaurants, searchRestaurantsByLocation, detectFoodAndCuisine ,getRestaurantsByCuisine} from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

interface Restaurant {
    id: number;
    name: string;
    cuisine: string[];
    location: string;
    averageSpend: number;
    rating: number;
    rating_color: string;
}

const HomePage: React.FC = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); // Dynamically calculated
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [radius, setRadius] = useState('');
    const [food, setFood] = useState<string | null>(null);
    const [cuisine, setCuisine] = useState<string | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [isFilteredByCuisine, setIsFilteredByCuisine] = useState(false); // Track if filtering by cuisine

    const navigate = useNavigate();

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                if (isFilteredByCuisine && cuisine) {
                    // Fetch paginated restaurants with the detected cuisine
                    const { restaurants, totalCount } = await getRestaurantsByCuisine(cuisine, page, 20);
                    setRestaurants(restaurants);
                    setTotalPages(Math.ceil(totalCount / 20)); // Dynamically calculate total pages
                } else {
                    // Fetch all restaurants
                    const { restaurants, totalCount } = await getRestaurants(page, 20);
                    setRestaurants(restaurants);
                    setTotalPages(Math.ceil(totalCount / 20)); // Dynamically calculate total pages
                }
            } catch (error) {
                console.error('Error fetching restaurants:', error);
            }
        };
        fetchRestaurants();
    }, [page, isFilteredByCuisine, cuisine]);

    const handleRestaurantClick = (id: number) => {
        navigate(`/restaurant/${id}`);
    };

    const handleSearch = async () => {
        if (!latitude || !longitude || !radius) {
            alert('Please enter latitude, longitude, and radius');
            return;
        }

        try {
            const { restaurants, totalCount } = await searchRestaurantsByLocation(
                parseFloat(latitude),
                parseFloat(longitude),
                parseFloat(radius)
            );
            setRestaurants(restaurants);
            setTotalPages(Math.ceil(totalCount / 20)); // Dynamically calculate total pages
            setIsFilteredByCuisine(false); // Reset cuisine filtering
        } catch (error) {
            console.error('Error searching restaurants by location:', error);
        }
    };

    const handleImageUpload = async () => {
        if (!image) {
            alert('Please upload an image');
            return;
        }

        try {
            const data = await detectFoodAndCuisine(image);
            setFood(data.food);
            setCuisine(data.cuisine);

            // Fetch all restaurants offering the detected cuisine
            if (data.cuisine) {
                const { restaurants, totalCount } = await getRestaurantsByCuisine(data.cuisine, 1, 20);
                setRestaurants(restaurants);
                setTotalPages(Math.ceil(totalCount / 20)); // Dynamically calculate total pages
                setIsFilteredByCuisine(true); // Enable cuisine filtering
                setPage(1); // Reset to the first page
            }
        } catch (error) {
            console.error('Error detecting food and cuisine:', error);
            alert('Failed to detect food and cuisine. Please try again.');
        }
    };

    return (
        <div className="home-page">
            <h1>Restaurants</h1>

            {/* Search by Latitude, Longitude, and Radius */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Latitude"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Longitude"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Radius (in km)"
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            {/* Image Upload Section */}
            <div className="image-upload-container">
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                />
                <button onClick={handleImageUpload}>Detect Food</button>
            </div>

            {/* Display Detected Food and Cuisine */}
            {food && cuisine && (
                <div className="result">
                    <p><strong>Detected Food:</strong> {food}</p>
                    <p><strong>Cuisine:</strong> {cuisine}</p>
                </div>
            )}

            {/* Restaurant List */}
            <div className="restaurant-list">
                {restaurants.map((restaurant) => (
                    <div
                        key={restaurant.id}
                        className="restaurant-card"
                        onClick={() => handleRestaurantClick(restaurant.id)}
                    >
                        <h2>{restaurant.name}</h2>
                        <p>{restaurant.cuisine.join(', ')}</p>
                        <p>
                            <span
                                className="rating"
                                style={{ backgroundColor: restaurant.rating_color }}
                            >
                                {restaurant.rating}
                            </span>
                        </p>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="pagination">
                <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
                    Previous
                </button>
                <span>Page {page}</span>
                <button onClick={() => setPage((prev) => prev + 1)} disabled={page === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default HomePage;