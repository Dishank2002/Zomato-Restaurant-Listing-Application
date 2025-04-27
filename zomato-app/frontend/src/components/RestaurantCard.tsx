import React from 'react';

interface Restaurant {
    id: number;
    name: string;
    cuisine: string[];
    location: string;
    averageSpend: number;
    description: string;
}

interface RestaurantCardProps {
    restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
    return (
        <div className="restaurant-card">
            <h3>{restaurant.name}</h3>
            <p>Cuisine: {restaurant.cuisine.join(', ')}</p>
            <p>Location: {restaurant.location}</p>
            <p>Average Spend for 2: {restaurant.averageSpend}</p>
            <p>{restaurant.description}</p>
        </div>
    );
};

export default RestaurantCard;