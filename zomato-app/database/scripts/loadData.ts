const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const { queryDB } = require('../../backend/src/utils/db');

interface RestaurantData {
    'Restaurant ID': string;
    'Restaurant Name': string;
    'Cuisines': string;
    'Longitude': string;
    'Latitude': string;
    'Average Cost for two': string;
    'Country Code': string;
    'Has Table booking': string;
    'Aggregate rating': string;
    'Rating color': string;
}

const preprocessData = (data: RestaurantData) => {
    return {
        id: parseInt(data['Restaurant ID'], 10) || null,
        name: data['Restaurant Name']?.trim() || 'Unknown',
        cuisine: data['Cuisines']?.split(',').map((c: string) => c.trim()) || [],
        longitude: parseFloat(data['Longitude']) || 0,
        latitude: parseFloat(data['Latitude']) || 0,
        averageSpend: parseFloat(data['Average Cost for two']) || 0,
        country: data['Country Code']?.trim() || 'Unknown',
        description: data['Has Table booking'] === 'Yes' ? 'Table booking available' : 'No table booking',
        rating: parseFloat(data['Aggregate rating']) || null,
        ratingColor: data['Rating color']?.trim() || null,
    };
};

async function loadData() {
    const filePath = path.join(__dirname, 'zomato.csv');
    const results: any[] = [];

    fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data: RestaurantData) => {
            const cleanedData = preprocessData(data);
            if (cleanedData.id && cleanedData.name) {
                results.push(cleanedData);
            }
        })
        .on('end', async () => {
            try {
                for (const restaurant of results) {
                    const query = `
                        INSERT INTO restaurants (id, name, cuisine, location, average_spend, country, description, rating, rating_color)
                        VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($4, $5), 4326), $6, $7, $8, $9, $10)
                        ON CONFLICT (id) DO UPDATE
                        SET rating = EXCLUDED.rating,
                            rating_color = EXCLUDED.rating_color;
                    `;
                    const params = [
                        restaurant.id,
                        restaurant.name,
                        restaurant.cuisine,
                        restaurant.longitude,
                        restaurant.latitude,
                        restaurant.averageSpend,
                        restaurant.country,
                        restaurant.description,
                        restaurant.rating,
                        restaurant.ratingColor,
                    ];
                    await queryDB(query, params);
                }
            } catch (error) {
                console.error('Error loading data:', error);
            }
        });
}

loadData();