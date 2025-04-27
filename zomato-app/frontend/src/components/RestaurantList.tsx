import React, { useEffect, useState } from 'react';
import { getRestaurants } from '../services/apiService';
import RestaurantCard from './RestaurantCard';

interface Restaurant {
    id: number;
    name: string;
    cuisine: string[];
    location: string;
    averageSpend: number;
    description: string;
}

const RestaurantList: React.FC = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const data = await getRestaurants(page, limit);
                setRestaurants(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, [page, limit]);

    if (loading) return <div>Loading restaurants...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div>
            <h2>Restaurant List</h2>
            <div className="restaurant-list">
                {restaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
            </div>
            <div className="pagination">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
            </div>
        </div>
    );
};

export default RestaurantList;