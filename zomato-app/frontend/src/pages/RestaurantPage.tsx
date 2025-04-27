import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurantById } from '../services/apiService';
import RestaurantDetails from '../components/RestaurantDetails';

interface Restaurant {
    id: number;
    name: string;
    cuisine: string[];
    location: string;
    averageSpend: number;
    description: string;
}

const RestaurantPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRestaurant = async () => {
            if (!id) {
                setError('Restaurant ID is missing');
                setLoading(false);
                return;
            }

            try {
                const response = await getRestaurantById(id);
                setRestaurant(response);
            } catch (err) {
                setError('Failed to fetch restaurant details');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurant();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div>
            {restaurant ? (
                <RestaurantDetails restaurant={restaurant} />
            ) : (
                <div>No restaurant found</div>
            )}
        </div>
    );
};

export default RestaurantPage;