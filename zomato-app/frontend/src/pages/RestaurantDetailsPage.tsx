import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurantById } from '../services/apiService';
import './RestaurantDetailsPage.css';

// Import the Restaurant type from RestaurantDetails.tsx to ensure consistency
import {Restaurant} from '../components/RestaurantDetails';
import RestaurantDetails from '../components/RestaurantDetails';
const RestaurantDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const data = await getRestaurantById(id!);
                setRestaurant(data);
            } catch (error) {
                console.error('Error fetching restaurant details:', error);
            }
        };
        fetchRestaurant();
    }, [id]);

    if (!restaurant) {
        return <p>Loading...</p>;
    }

    return (
        <div className="restaurant-details-page">
            <RestaurantDetails restaurant={restaurant} /> {/* Use the component */}
        </div>
    );
};

export default RestaurantDetailsPage;