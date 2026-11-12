# ShopSphere – Enterprise E-Commerce & Analytics Platform

ShopSphere is a full-stack e-commerce platform developed as part of the Cognevance Level 3 Advanced project. It provides customers with an online shopping experience and administrators with tools to manage products, orders, customers, and business analytics.

## Live Demo

- **Frontend:** https://shopsphere-one-azure.vercel.app
- **Backend API:** https://shopsphere-backend-xe4n.onrender.com
- **GitHub Repository:** https://github.com/MohdMasiUddin/ShopSphere

## Features

### Customer Features
- Customer registration and secure login
- Product browsing, search, filtering, and sorting
- Shopping cart management
- Address management
- Order placement and order history
- Razorpay test payment integration
- Order confirmation email notifications

### Admin Features
- Admin authentication and role-based access control
- Dashboard with business analytics
- Product management
- Order management and status updates
- Customer management and search
- Product image uploads using Cloudinary

## Technology Stack

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React

**Backend**
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- JWT Authentication
- bcryptjs
- Zod

**Database and Services**
- PostgreSQL (Neon)
- Razorpay
- Cloudinary
- Resend

**Deployment**
- Vercel
- Render
- Neon PostgreSQL

## Project Structure

```text
ShopSphere/
├── backend/
│   ├── src/
│   ├── prisma/
│   └── package.json
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── docs/
│   ├── screenshots/
│   └── PROJECT_REPORT.md
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/MohdMasiUddin/ShopSphere.git
cd ShopSphere
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Configure the backend environment variables in a `.env` file using the required database, authentication, payment, email, and Cloudinary settings.

Generate the Prisma client and build the backend:

```bash
npx prisma generate
npm run build
```

Start the backend:

```bash
npm run dev
```

### 3. Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Configure the frontend `.env` file:

```env
VITE_API_URL=http://localhost:5001/api
```

Start the frontend:

```bash
npm run dev
```

## API Health Check

The deployed backend health endpoint is:

https://shopsphere-backend-xe4n.onrender.com/api/health

## Documentation and Screenshots

Detailed project documentation and application screenshots are available in the `docs/` directory.

## Security

- Password hashing with bcryptjs
- JWT-based authentication
- Role-based authorization
- Request validation using Zod
- Security headers using Helmet
- Razorpay payment signature verification
- Environment variables for sensitive configuration

## Future Enhancements

- Product review submission
- Advanced sales reporting
- Wishlist functionality
- Enhanced inventory analytics
- Additional payment options

## Project Information

**Project:** ShopSphere – Enterprise E-Commerce & Analytics Platform

**Organization:** Cognevance

**Level:** Level 3 – Advanced

**Developer:** Mohd Masi Uddin

