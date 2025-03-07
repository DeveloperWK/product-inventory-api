# Product Inventory Management API

## Overview

This RESTful API for managing product inventory is built using Node.js, Express.js, and MongoDB. It supports CRUD operations for products, categories, and users with role-based access control.

## Features

- CRUD operations for Products
- CRUD operations for Categories
- CRUD operations for Users with Role-based Access Control (RBAC)
- Pagination, Sorting, and Filtering for Products
- Authentication & Authorization using JWT
- Deployed on Railway

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose ORM)
- JWT Authentication
- Railway Deployment
- CORS, dotenv, express.json()

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/DeveloperWK/product-inventory-api.git
   cd product-inventory-api
   ```

2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Create a `.env` file and add the following:

   ```env
   PORT=
   MONGODB_URI=mongodb_connection_string
   AUTH_SECRET=jwt_secret_key
   ```

4. Start the server:

   ```sh
   pnpm start
   ```

## API Endpoints

### Product Routes

| Method | Endpoint            | Description                                              |
| ------ | ------------------- | -------------------------------------------------------- |
| POST   | `/api/products`     | Add a new product                                        |
| GET    | `/api/products`     | Get all products with pagination, sorting, and filtering |
| GET    | `/api/products/:id` | Get a product by ID                                      |
| PUT    | `/api/products/:id` | Update a product by ID                                   |
| DELETE | `/api/products/:id` | Delete a product by ID                                   |

### Category Routes

| Method | Endpoint              | Description             |
| ------ | --------------------- | ----------------------- |
| POST   | `/api/categories`     | Add a new category      |
| GET    | `/api/categories`     | Get all categories      |
| GET    | `/api/categories/:id` | Get a category by ID    |
| PUT    | `/api/categories/:id` | Update a category by ID |
| DELETE | `/api/categories/:id` | Delete a category by ID |

### User Routes (Role-Based Access)

| Method | Endpoint              | Description             |
| ------ | --------------------- | ----------------------- |
| POST   | `/api/users/register` | Register a new user     |
| POST   | `/api/users/login`    | Login and get JWT token |
| GET    | `/api/users`          | Get all users           |
| GET    | `/api/users/:id`      | Get a user by ID        |
| DELETE | `/api/users/:id`      | Delete a user           |

## Authentication & Authorization

- JWT-based authentication
- Role-based authorization for users (Admin, User)

## Deployment

This API is deployed on **Railway**. You can access it here: [Live API](https://product-inventory-api-production.up.railway.app/api/products)

## Testing

- Use **Postman** to test all endpoints
- Ensure correct status codes and responses

## Bonus Features

✔️ Implemented pagination, sorting, and filtering for GET `/api/products`  
✔️ Role-based access control for managing products and users  
✔️ Secure API with JWT authentication  
✔️ Deployed API on Railway

## Repository

📌 GitHub Repository: [Product Inventory API](https://github.com/DeveloperWK/product-inventory-api)

## Demo Video (Optional)

📌 [Watch Demo](https://your-demo-link.com/)

---

### Author: Developer. WK

Slogan: "ONE STEP AHEAD OF EVERYONE"
