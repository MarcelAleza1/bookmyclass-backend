# Class Booking Information Management System - Backend

This is the backend server for the Class Booking Information Management System. It provides API endpoints to manage classes, users, and bookings for a class booking platform. The backend is built using Node.js, Express.js, and MongoDB as the database.

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Database](#database)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

To get started with the backend server, follow the installation instructions in the [Installation](#installation) section. After setting up the server, you can use the provided API endpoints to interact with the class booking information system.

## Prerequisites

Before running the backend server, make sure you have the following installed on your system:

- Node.js (v12 or higher)
- MongoDB (v4 or higher)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/MarcelAleza1/bookmyclass-backend.git
cd bookmyclass-backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Copy the `.env.example` file and rename it to `.env`. Replace the placeholder values with your MongoDB connection URI and other configurations if needed.

4. Start the server:

```bash
npm start
```

The server will start running at http://localhost:8080.

## Project Structure

The backend project is organized as follows:

```
- backend
  - models
    - Class.js
    - User.js
    - Booking.js
  - routes
    - classRoutes.js
    - userRoutes.js
    - bookingRoutes.js
  - index.js
```

- `models`: Contains the Mongoose models for Class, User, and Booking entities.
- `routes`: Contains the API routes for handling class, user, and booking operations.
- `index.js`: The entry point of the server.

## API Endpoints

The following API endpoints are available:

- **Classes**:
  - GET `/api/classes`: Get all classes
  - POST `/api/classes`: Create a new class
  <!-- - PUT `/api/classes/:id`: Update a class
  - DELETE `/api/classes/:id`: Delete a class -->

- **Users**:
  - POST `/api/register`:  Register a new user
  - POST `/api/login`: LogIn user
  <!-- - POST `/api/users`: Create a new user -->
  - GET `/api/profile`: Get user profile (Protected with Token)
  - POST `/api/logout`: Logout user
  <!-- - PUT `/api/users/:id`: Update a user
  - DELETE `/api/users/:id`: Delete a user -->

- **Bookings**:
  - GET `/api/bookings`: Get all bookings with user data (userId, firstName, lastName, email) and class data (name, schedule, instructor, availableSeats)
  - POST `/api/bookings`: Create a new booking
  <!-- - DELETE `/api/bookings/:id`: Delete a booking -->

## Database

The backend uses MongoDB as the database to store classes, users, and bookings. Mongoose is used as the ODM (Object Data Modeling) library to define models and interact with the database.

Ensure you have MongoDB installed and running on your system. The database connection URI should be set in the `.env` file.

## Environment Variables

The following environment variables are used:

- `PORT`: The port on which the server will run (default: 5000)
- `MONGODB_URI`: The MongoDB connection URI
- `SECRET`: Used for JWT authentication
<!-- - `NODE_ENV`: The Node.js environment (development, production, test) -->

## Register and Login Endpoints

The following are examples of the request bodies for the `POST` requests to the `/api/register` and `/api/login` endpoints:

### Register a New User

**Request**

```
POST /api/register
Content-Type: application/json

{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmpassword": "password123"
}
```

**Response (Success)**

```
HTTP/1.1 201 Created
Content-Type: application/json

{
   "message": "User registered successfully",
    "newUserDetails": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "test@gmail.com"
    }
}
```

### Login User

**Request**

```
POST /api/login
Content-Type: application/json

{
  "email": "johndoe@gmail.com",
  "password": "password123"
}
```

**Response (Success)**

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "token": "<YOUR_GENERATED_TOKEN>"
}
```

### Get Profile

**Request**
The server will validate the token using the secret key specified in the .env file. If the token is valid, the user is considered authenticated, and they can access the protected /api/profile endpoint.

Here's an example using cURL:
```bash
curl -X GET http://localhost:8080/api/profile -H "Authorization: Bearer <YOUR_TOKEN>"
```

Replace <YOUR_TOKEN> with the actual token received after successful login.

The server will validate the token using the secret key specified in the .env file. If the token is valid, the user is considered authenticated, and they can access the protected /api/profile endpoint.

## Contributing

Contributions to this project are welcome. Feel free to open issues and submit pull requests.

## License

This project is licensed under the [MIT License](LICENSE).

## Authors

- Your Name - [Mazi Essoloani Aleza](https://github.com/MarcelAleza2)

