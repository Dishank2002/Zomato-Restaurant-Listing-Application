import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export const getRestaurantById = async (id: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/restaurants/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching restaurant by ID');
    }
};

export const getRestaurants = async (page: number = 1, limit: number = 10) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/restaurants`, {
            params: { page, limit }
        });
        return response.data;
    } catch (error) {
        throw new Error('Error fetching restaurants list');
    }
};

export const searchRestaurantsByLocation = async (latitude: number, longitude: number, radius: number) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/restaurants/search/location`, {
            params: { latitude, longitude, radius }
        });
        return response.data;
    } catch (error) {
        throw new Error('Error searching restaurants by location');
    }
};

export const searchRestaurantsByImage = async (image: File) => {
    const formData = new FormData();
    formData.append('image', image);

    try {
        const response = await axios.post(`${API_BASE_URL}/restaurants/image-search`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Error searching restaurants by image');
    }
};

export const detectFoodAndCuisine = async (image: File) => {
    const formData = new FormData();
    formData.append('image', image);

    try {
        const response = await axios.post(`${API_BASE_URL}/restaurants/food-detection`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Error detecting food and cuisine');
    }
};

export const getRestaurantsByCuisine = async (cuisine: string, page: number, limit: number) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/restaurants/filter`, {
            params: { cuisine, page, limit },
        });
        return response.data;
    } catch (error) {
        throw new Error('Error fetching restaurants by cuisine');
    }
};

