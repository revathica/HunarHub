# HunarHub – Digital Marketplace for Local Micro-Entrepreneurs

HunarHub is a full-stack web application designed to connect local micro-entrepreneurs, artisans, and skilled workers with customers through a digital marketplace.

The platform enables entrepreneurs to showcase their skills, sell handmade products, and receive service requests while helping customers discover and support local businesses.

## Project Overview

Many local micro-entrepreneurs depend on word-of-mouth marketing and physical customer visits. They often lack digital visibility, structured order management, and access to a wider customer base.

HunarHub addresses these challenges by providing a unified platform for product selling, service booking, and local business discovery.

## Objectives

- Provide digital visibility to local micro-entrepreneurs.
- Connect entrepreneurs with potential customers.
- Enable online product browsing and purchasing.
- Support service requests and bookings.
- Promote handmade products and traditional skills.
- Provide role-based dashboards for customers, entrepreneurs, and administrators.

## Features

### Customer Features
- User registration and login
- Browse and search entrepreneurs
- View entrepreneur profiles and business details
- Browse products by category
- Add products to cart
- Place orders and provide delivery details
- View order history and order status
- Submit reviews and ratings

### Entrepreneur Features
- Entrepreneur registration and login
- Create and manage business profiles
- Showcase skills, services, and experience
- Add and manage products
- Manage product prices and stock
- View and manage customer orders
- Receive customer service requests

### Admin Features
- Admin authentication
- Manage registered users
- Manage entrepreneurs
- Verify entrepreneur profiles
- Manage products
- Manage and update orders
- Delete products and orders when required

## Technology Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend development |
| Tailwind CSS | UI styling |
| React Router | Client-side navigation |
| Node.js | Backend runtime |
| Express.js | REST API development |
| MongoDB | Database |
| Mongoose | Database modeling |
| JWT | Authentication |
| bcrypt | Password hashing |
| Git & GitHub | Version control |

## Project Structure

```text
HunarHub/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .gitignore
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routers/
│   ├── middleware/
│   ├── server.js
│   ├── package.json
│   └── .gitignore
│
├── .gitignore
└── README.md
```

## Installation and Setup

### Prerequisites

- Node.js and npm
- MongoDB Atlas account or local MongoDB
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/revathica/HunarHub.git
```

### 2. Navigate to the Project

```bash
cd HunarHub
```

### 3. Install Frontend Dependencies

```bash
cd client
npm install
```

### 4. Install Backend Dependencies

Open another terminal:

```bash
cd HunarHub/server
npm install
```

### 5. Configure Environment Variables

Create a `.env` file inside the `server` folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

Replace the placeholder values with your actual configuration.

**Important:** Never upload your `.env` file, database password, or secret keys to GitHub.

### 6. Start the Backend Server

From the `server` folder:

```bash
node server.js
```

The backend runs at:

```text
https://hunarhub-backend-hjv6.onrender.com
```

### 7. Start the Frontend

From the `client` folder:

```bash
npm run dev
```

Open the local URL displayed in the terminal, usually:

```text
http://localhost:5173
```

## API Modules

The backend provides REST API modules for:

- Authentication – `/api/auth`
- Entrepreneurs – `/api/entrepreneurs`
- Products – `/api/products`
- Service Requests – `/api/service-requests`
- Orders – `/api/orders`
- Reviews – `/api/reviews`
- Users – `/api/users`

## Future Enhancements

- Online payment integration
- Email and order notifications
- Advanced product and entrepreneur search
- Product image upload improvements
- Customer and entrepreneur profile management
- Account deactivation and deletion
- Deployment to a production environment

## Project Information

**Project Name:** HunarHub – Digital Marketplace for Local Micro-Entrepreneurs

**Developer:** Revathi C A

**Internship:** Unified Mentor

**Duration:** 3 Months

**Project Type:** Full-Stack Web Development

## Author

Developed as part of the Unified Mentor internship program to promote local businesses and empower micro-entrepreneurs through digital technology.
## Project Demo Video

Watch the HunarHub Project Demo:

[Click Here to Watch Demo Video]https://youtu.be/8p1bC8ryqeQ