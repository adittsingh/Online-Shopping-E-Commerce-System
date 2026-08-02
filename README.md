# Online Shopping (E-Commerce) System

A full-featured **Online Shopping (E-Commerce) System** built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). Users can browse products, search & filter by category/price, manage a shopping cart, place orders, and manage their profile. An admin dashboard enables administrators to manage products, categories, users, and customer orders through a secure role-based interface.

## Features

### User Side
- Home page with featured products, search, category & price filters, and sorting
- Product detail page with image, reviews & ratings
- Shopping cart (add / update quantity / remove)
- Checkout with shipping address and payment method selection
- Order placement with price breakdown (items, tax, shipping)
- Order history and order detail page (mark as paid)
- User profile management (name, email, phone, address, password)
- Secure registration & login (JWT)
- Contact Us page

### Admin Side
- Dashboard with stats (users, products, categories, orders, revenue, low stock)
- Product management (CRUD + image upload via Multer)
- Category management (CRUD with product counts)
- User management (edit role / delete)
- Order management (update status: Pending → Processing → Shipped → Delivered / Cancelled, mark paid)
- Role-based access control (JWT + admin guard)

## Tech Stack

| Layer       | Technology                                   |
| ----------- | -------------------------------------------- |
| Frontend    | React.js, React Router, Bootstrap 5, Axios   |
| Backend     | Node.js, Express.js                          |
| Database    | MongoDB (Mongoose ODM)                       |
| Auth        | JSON Web Tokens (JWT), bcryptjs              |
| File Upload | Multer                                       |

## Project Structure

```
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, error, upload
│   ├── models/          # User, Product, Category, Order
│   ├── routes/          # API routes
│   ├── seed/            # Sample data seeder
│   ├── uploads/         # Uploaded product images
│   └── server.js        # Entry point
└── frontend/
    ├── public/
    └── src/
        ├── components/  # Navbar, ProductCard, Loader, guards...
        ├── context/     # Auth & Cart contexts
        └── pages/       # Store & admin pages
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally on `mongodb://127.0.0.1:27017`)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env        # adjust values if needed
npm run seed                # load sample data
npm run dev                 # start API on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                 # start app on http://localhost:3000
```

Open http://localhost:3000 in your browser.

## Demo Accounts

| Role  | Email               | Password |
| ----- | ------------------- | -------- |
| Admin | admin@example.com   | admin123 |
| User  | john@example.com    | john123  |
| User  | jane@example.com    | jane123  |

## API Overview

| Method | Endpoint                    | Access | Description              |
| ------ | --------------------------- | ------ | ------------------------ |
| POST   | `/api/auth/register`        | Public | Register user            |
| POST   | `/api/auth/login`           | Public | Login user               |
| GET    | `/api/auth/profile`         | User   | Get profile              |
| PUT    | `/api/auth/profile`         | User   | Update profile           |
| GET    | `/api/products`             | Public | List/search/filter       |
| GET    | `/api/products/featured`    | Public | Featured products        |
| GET    | `/api/products/:id`         | Public | Product detail           |
| POST   | `/api/products`             | Admin  | Create product           |
| PUT    | `/api/products/:id`         | Admin  | Update product           |
| DELETE | `/api/products/:id`         | Admin  | Delete product           |
| POST   | `/api/products/:id/reviews` | User   | Review a product         |
| GET    | `/api/categories`           | Public | List categories          |
| POST   | `/api/categories`           | Admin  | Create category          |
| PUT    | `/api/categories/:id`       | Admin  | Update category          |
| DELETE | `/api/categories/:id`       | Admin  | Delete category          |
| POST   | `/api/orders`               | User   | Place order              |
| GET    | `/api/orders/my`            | User   | My orders                |
| GET    | `/api/orders`               | Admin  | All orders               |
| GET    | `/api/orders/:id`           | User   | Order detail             |
| PUT    | `/api/orders/:id/pay`       | User   | Mark order paid          |
| PUT    | `/api/orders/:id/status`    | Admin  | Update order status      |
| POST   | `/api/upload`               | Admin  | Upload product image     |
| GET    | `/api/stats`                | Admin  | Dashboard statistics     |
| GET    | `/api/users`                | Admin  | List users               |
| PUT    | `/api/users/:id`            | Admin  | Update user              |
| DELETE | `/api/users/:id`            | Admin  | Delete user              |

## Security

- Passwords hashed with **bcryptjs**
- JWT-based authentication with protected routes
- Role-based access control (admin vs user)
- Image upload restricted to image MIME types & file size (5MB)
- MongoDB connection using ODM with sanitized queries

## Scripts

Backend:
- `npm run dev` — start with nodemon
- `npm start` — start in production mode
- `npm run seed` — import sample data
- `npm run data:destroy` — wipe database

Frontend:
- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview production build

## License

MIT
