import { queryDB } from '../utils/db';

export class RestaurantService {
    public async getRestaurantById(id: string) {
        const query = `
            SELECT id, name, cuisine, location, average_spend, country, description, rating, rating_color
            FROM restaurants
            WHERE id = $1
        `;
        const params = [id];
        const result = await queryDB(query, params);
        return result[0];
    }

    public async getRestaurants(page: number, limit: number) {
        const offset = (page - 1) * limit;

        // Query to fetch paginated restaurants
        const restaurantsQuery = `
            SELECT id, name, cuisine, location, average_spend, country, description, rating, rating_color
            FROM restaurants
            LIMIT $1 OFFSET $2
        `;
        const restaurantsParams = [limit, offset];
        const restaurants = await queryDB(restaurantsQuery, restaurantsParams);

        // Query to fetch total count of restaurants
        const countQuery = `SELECT COUNT(*) AS total FROM restaurants`;
        const countResult = await queryDB(countQuery, []);
        const totalCount = parseInt(countResult[0].total, 10);

        return { restaurants, totalCount };
    }

    public async searchRestaurantsByLocation(latitude: number, longitude: number, radius: number) {
        const query = `
            SELECT id, name, cuisine, location, average_spend, country, description, rating, rating_color
            FROM restaurants
            WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3)
        `;
        const params = [longitude, latitude, radius * 1000]; 
        return await queryDB(query, params);
    }

    public async searchRestaurants(query: string) {
        const sql = `
            SELECT id, name, cuisine, location, average_spend, country, description, rating, rating_color
            FROM restaurants
            WHERE name ILIKE $1 OR description ILIKE $2
        `;
        const params = [`%${query}%`, `%${query}%`];
        return await queryDB(sql, params);
    }

    public async filterRestaurantsByCuisine(cuisine: string, page: number, limit: number) {
        const offset = (page - 1) * limit;

        // Query to fetch paginated restaurants with the specified cuisine
        const restaurantsQuery = `
            SELECT id, name, cuisine, location, average_spend, country, description, rating, rating_color
            FROM restaurants
            WHERE $1 = ANY(cuisine)
            LIMIT $2 OFFSET $3
        `;
        const restaurantsParams = [cuisine, limit, offset];
        const restaurants = await queryDB(restaurantsQuery, restaurantsParams);

        // Query to fetch the total count of restaurants with the specified cuisine
        const countQuery = `
            SELECT COUNT(*) AS total
            FROM restaurants
            WHERE $1 = ANY(cuisine)
        `;
        const countResult = await queryDB(countQuery, [cuisine]);
        const totalCount = parseInt(countResult[0].total, 10);

        return { restaurants, totalCount };
    }
}


