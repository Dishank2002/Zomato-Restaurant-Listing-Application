import React from 'react';
import '../pages/RestaurantDetailsPage.css';

export interface Restaurant {
    id: number;
    name: string;
    cuisine: string[];
    average_spend: number;
    country: string;
    description: string;
    rating: number;
    rating_color: string;
}

interface RestaurantDetailsProps {
    restaurant: Restaurant;
}

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({ restaurant }) => {
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

export default RestaurantDetails;