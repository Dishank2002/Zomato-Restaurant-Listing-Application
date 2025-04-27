import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurantById } from '../services/apiService';
import './RestaurantDetailsPage.css';

const RestaurantDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [restaurant, setRestaurant] = useState<any>(null);

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
        <div className="restaurant-details">
            <h1>{restaurant.name}</h1>
            <p><strong>Cuisines:</strong> {restaurant.cuisine.join(', ')}</p>
            <p><strong>Average Spend:</strong> ₹{restaurant.average_spend}</p>
            <p><strong>Country:</strong> {restaurant.country}</p>
            <p><strong>Description:</strong> {restaurant.description}</p>
            <p>
                <strong>Rating:</strong>{' '}
                <span
                    className="rating"
                    style={{ backgroundColor: restaurant.rating_color }}
                >
                    {restaurant.rating}
                </span>
            </p>
        </div>
    );
};

export default RestaurantDetailsPage;