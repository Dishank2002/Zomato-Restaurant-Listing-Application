import React from 'react';

interface Restaurant {
    id: number;
    name: string;
    cuisine: string[];
    location: string;
    averageSpend: number;
    description: string;
}

interface RestaurantDetailsProps {
    restaurant: Restaurant;
}

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({ restaurant }) => {
    return (
        <div>
            <h1>{restaurant.name}</h1>
            <p>Cuisine: {restaurant.cuisine.join(', ')}</p>
            <p>Location: {restaurant.location}</p>
            <p>Average Spend for 2: {restaurant.averageSpend}</p>
            <p>Description: {restaurant.description}</p>
        </div>
    );
};

export default RestaurantDetails;