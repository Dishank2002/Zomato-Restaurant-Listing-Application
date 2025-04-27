# Zomato Restaurant Listing Application

## Overview
This project is a full-stack application that allows users to search for restaurants based on various criteria, including **location**, **cuisine**, and **image recognition**. The application is divided into three main components:
- **Backend**: Built with TypeScript and Express, it handles API requests and database interactions.
- **Frontend**: Built with React, it provides a user-friendly interface for interacting with the application.
- **Database**: Stores restaurant data and supports queries for location-based and cuisine-based searches.

---

## Features
- **Restaurant Listing**: View a list of restaurants with pagination support.
- **Restaurant Details**: Get detailed information about a specific restaurant by ID.
- **Search Functionality**: Search for restaurants based on location (latitude, longitude, and radius).
- **Image Search**: Upload an image of food to detect its cuisine and fetch matching restaurants.
- **Dynamic Pagination**: Automatically calculate the total number of pages based on the total count of restaurants.

---

## Project Structure

### Backend
- **Directory**: `zomato-app/backend`
- **Key Features**:
  - Retrieve restaurant details by ID.
  - List restaurants with pagination support.
  - Search restaurants by location (latitude, longitude, and radius).
  - Image-based cuisine detection using Google Vision API.
- **Environment Variables**:
  Create a `.env` file in the `backend` directory and add the following variables:
  ```plaintext
  PORT=5000
  DB_USER=your_database_user
  DB_PASSWORD=your_database_password
  DB_HOST=localhost
  DB_PORT=5432
  DB_NAME=zomato
  GOOGLE_VISION_KEY_PATH=./config/google-vision-key.json
  ```
- **Setup**:
  1. Navigate to the `backend` directory:
     ```bash
     cd backend
     ```
  2. Install dependencies:
     ```bash
     npm install
     ```
  3. Start the server:
     ```bash
     npm start
     ```

---

### Frontend
- **Directory**: `zomato-app/frontend`
- **Key Features**:
  - View a paginated list of restaurants.
  - Search restaurants by location (latitude, longitude, and radius).
  - Upload an image of food to detect its cuisine and fetch matching restaurants.
- **Environment Variables**:
  Create a `.env` file in the `frontend` directory and add the following variable:
  ```plaintext
  REACT_APP_API_BASE_URL=http://localhost:5000/api
  ```
- **Setup**:
  1. Navigate to the `frontend` directory:
     ```bash
     cd frontend
     ```
  2. Install dependencies:
     ```bash
     npm install
     ```
  3. Start the React application:
     ```bash
     npm start
     ```

---

### Database
- **Directory**: `zomato-app/database`
- **Key Features**:
  - Stores restaurant data, including name, cuisine, location, and average spending.
  - Supports geospatial queries for location-based searches.
- **Setup**:
  1. Ensure PostgreSQL is installed and running.
  2. Navigate to the `database/scripts` directory:
     ```bash
     cd database/scripts
     ```
  3. Run the data loading script:
     ```bash
     ts-node loadData.ts
     ```

---

## API Endpoints

### Backend
- `GET /api/restaurants/:id`: Get restaurant by ID.
- `GET /api/restaurants`: Get a list of restaurants with pagination support.
- `POST /api/restaurants/food-detection`: Detect cuisine from an uploaded image and fetch matching restaurants.

---

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Dishank2002/Zomato-Restaurant-Listing-Application.git
   cd zomato-app
   ```

2. Set up the backend:
   ```bash
   cd backend
   npm install
   npm start
   ```

3. Set up the frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. Set up the database:
   ```bash
   cd database/scripts
   ts-node loadData.ts
   ```

---

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.
