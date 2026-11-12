# ShopSphere – Enterprise E-Commerce & Analytics Platform

## 1. Project Overview

ShopSphere is a full-stack enterprise e-commerce platform developed as part of the Cognevance Level 3 Advanced Full Stack Development project.

The platform provides a complete online shopping experience, allowing customers to browse products, manage shopping carts, place orders, and make secure online payments.

It also includes an administrative dashboard that enables administrators to manage products, categories, customers, and orders while monitoring business performance through analytics.

### Project Objectives

- Develop a responsive and user-friendly e-commerce storefront.
- Implement secure authentication and role-based access control.
- Build product, category, customer, and order management modules.
- Integrate Razorpay for online payment processing.
- Implement automated order confirmation email notifications.
- Support product image uploads using Cloudinary.
- Provide an administrative dashboard with business analytics.
- Deploy the application using cloud-based services.

### Project Deliverables

- Full-stack web application.
- Backend REST API.
- PostgreSQL database.
- Administrative dashboard.
- Payment and email integrations.
- Cloud deployment.
- Technical documentation.

---

## 2. System Architecture

ShopSphere follows a client-server architecture with a React-based frontend communicating with a RESTful backend API.

### Architecture Components

**1. Frontend**
- Provides the customer storefront and administrative interface.
- Handles navigation, product browsing, cart management, and checkout.
- Communicates with backend APIs using HTTP requests.

**2. Backend**
- Provides REST APIs using Node.js and Express.
- Handles authentication, authorization, business logic, and order processing.
- Validates incoming requests and communicates with the database.

**3. Database**
- PostgreSQL stores users, products, categories, addresses, orders, and payment records.
- Prisma ORM manages database queries and schema migrations.

**4. External Services**
- Razorpay – Payment processing.
- Resend – Order confirmation email notifications.
- Cloudinary – Product image storage.

### Application Architecture Flow

Customer / Administrator  
↓  
React Frontend  
↓  
Express REST API  
↓  
Business Logic and Authentication  
↓  
Prisma ORM  
↓  
Neon PostgreSQL Database

External integrations are connected through the backend API.

## 3. Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling and Animation | CSS, Framer Motion |
| Icons | Lucide React |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Authentication | JWT, bcryptjs |
| Validation | Zod |
| Security | Helmet, CORS,|
| Payment Gateway | Razorpay |
| Email Service | Resend |
| Image Storage | Cloudinary |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Version Control | Git and GitHub |

---

## 4. Database Design

ShopSphere uses PostgreSQL as its relational database, hosted on Neon. Prisma ORM manages database queries, schema definitions, and migrations.

### Database Models

The database consists of eight main models:

| Model | Purpose |
|---|---|
| User | Stores customer and administrator accounts. |
| Address | Stores customer delivery addresses. |
| Category | Organizes products into categories. |
| Product | Stores product details, prices, stock, and image URLs. |
| Order | Stores customer purchases and shipping information. |
| OrderItem | Stores products, quantities, and prices within orders. |
| Payment | Stores payment provider and transaction information. |
| Review | Stores product ratings and customer comments. |

### Database Relationships

- A user can have multiple addresses.
- A user can place multiple orders.
- The database supports multiple product reviews associated with a user.
- A category can contain multiple products.
- An order contains multiple order items.
- Each order item references a product.
- Each order can have one associated payment record.
- A product can have multiple reviews.
- A unique constraint prevents a user from having multiple review records for the same product.

### Enums and Constraints

The schema defines two enums:

- **UserRole:** CUSTOMER, ADMIN.
- **OrderStatus:** PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED.
- **PaymentStatus:** PENDING, COMPLETED, FAILED, REFUNDED.

The schema also uses unique constraints for email addresses, product SKUs, slugs, order numbers, and payment provider identifiers.

Indexes are used to support efficient product queries.

### Database Management

Prisma ORM provides structured database access and helps maintain consistency between application models and PostgreSQL tables.

Database migrations are used to apply schema changes in a controlled manner. Neon provides the cloud-hosted PostgreSQL database used by the deployed application.


## 5. Application Modules and Features

ShopSphere consists of customer-facing modules and administrative modules designed to support the complete e-commerce workflow.

### 5.1 Customer Module

- Customer registration and login.
- Secure password hashing using bcryptjs.
- JWT-based authentication.
- Product browsing and category filtering.
- Product search and sorting.
- Shopping cart management.
- Delivery address management.
- Checkout and order placement.
- Online payment integration through Razorpay.
- Order confirmation and email notifications.
- Viewing personal order history.

### 5.2 Product Management Module

- Create and manage products.
- Organize products into categories.
- Update product prices and stock quantities.
- Manage featured products and product visibility.
- Upload product images using Cloudinary.
- Display product information on the storefront.
- Deactivate products through soft deletion instead of permanently removing their database records.

### 5.3 Order Management Module

- Create customer orders.
- Maintain order items, quantities, and prices.
- Track order status through different stages.
- Manage payment status.
- Automatically deduct inventory when an order is created.
- Restore inventory when an eligible order is cancelled.
- View and manage orders through the administrative interface.

### 5.4 Admin Module

- Secure administrator authentication.
- Role-based access control.
- Product and category management.
- Customer listing and search.
- Order management and status updates.
- Dashboard statistics and business analytics.
- Recent order monitoring.
- Seven-day sales trend based on completed payments.

### 5.5 Shopping Experience

The frontend provides a responsive shopping interface with animated interactions and product-focused layouts.

Key features include:

- Product listings organized by category.
- Product search and sorting options.
- Interactive shopping cart with quantity controls.
- Cart drawer with order total calculation.
- Navigation between storefront sections.
- Responsive layouts for different screen sizes.

The application connects the frontend to the backend REST API to retrieve product information, manage customer operations, and process orders and payments.

## 6. Backend API and Security

ShopSphere uses a RESTful API built with Node.js, Express.js, and TypeScript. The backend organizes its endpoints into separate route modules for authentication, users, products, categories, addresses, orders, payments, and administration.

All application endpoints use the `/api` base path.

### 6.1 API Endpoints

| Module | HTTP Method | Endpoint | Access |
|---|---|---|---|
| Authentication | POST | `/api/auth/register` | Public |
| Authentication | POST | `/api/auth/login` | Public |
| Users | GET | `/api/users/profile` | Authenticated |
| Products | GET | `/api/products` | Public |
| Products | GET | `/api/products/search` | Public |
| Products | GET | `/api/products/:id` | Public |
| Products | GET | `/api/products/admin/all` | Admin |
| Products | POST | `/api/products` | Admin |
| Products | PUT | `/api/products/:id` | Admin |
| Products | DELETE | `/api/products/:id` | Admin |
| Products | POST | `/api/products/upload-image` | Admin |
| Categories | GET | `/api/categories` | Public |
| Categories | POST | `/api/categories` | Admin |
| Addresses | GET | `/api/addresses` | Authenticated |
| Addresses | POST | `/api/addresses` | Authenticated |
| Orders | POST | `/api/orders` | Authenticated |
| Orders | GET | `/api/orders/my-orders` | Authenticated |
| Orders | GET | `/api/orders` | Admin |
| Orders | PATCH | `/api/orders/:id/status` | Admin |
| Payments | POST | `/api/payments/create-order` | Authenticated |
| Payments | POST | `/api/payments/verify` | Authenticated |
| Administration | GET | `/api/admin/dashboard` | Admin |
| Administration | GET | `/api/admin/customers` | Admin |
| System | GET | `/api/health` | Public |

### 6.2 Authentication and Authorization

- JWT-based authentication protects customer and administrative endpoints.
- Passwords are hashed using bcryptjs before being stored in the database.
- Role-based access control distinguishes between CUSTOMER and ADMIN users.
- Authentication middleware verifies user credentials through JWT tokens.
- Admin authorization middleware restricts administrative operations to users with the ADMIN role.
- JWT tokens are configured with a one-day expiration period.

### 6.3 Security Measures

The backend incorporates the following security technologies and practices:

- **Helmet:** Adds HTTP security headers.
- **CORS:** Restricts cross-origin requests to configured frontend origins.
- **Zod:** Validates incoming request data.
- **JWT:** Supports token-based authentication.
- **bcryptjs:** Protects stored passwords through hashing.
- **Razorpay Signature Verification:** Uses HMAC SHA-256 and constant-time comparison to verify payment signatures.

### 6.4 Health Monitoring

The backend provides a public health-check endpoint at `/api/health`. It verifies database connectivity through Prisma and returns the API and database connection status.

This endpoint is used to confirm that the deployed backend is running and connected to the Neon PostgreSQL database.

## 7. Payment Gateway Integration

ShopSphere integrates Razorpay to support online payments.

### Payment Workflow

1. Customer adds products to the shopping cart.
2. Customer enters delivery details and proceeds to checkout.
3. Backend creates an order and payment record.
4. Backend creates a Razorpay payment order.
5. Razorpay Checkout opens for payment.
6. Customer completes the payment.
7. Frontend receives the Razorpay payment details.
8. Backend verifies the payment signature using HMAC SHA-256.
9. Successful verification updates the payment status to COMPLETED and order status to CONFIRMED.
10. The customer is redirected to the order-success page.

### Payment Security

Payment verification is performed on the backend using the Razorpay secret key. Payment details are not trusted solely because they are returned by the frontend.

The project was tested using Razorpay Test Mode.

## 8. Email Notification Integration

ShopSphere uses Resend to send automated order

---

## 9. Cloudinary Image Storage

ShopSphere integrates Cloudinary for cloud-based product image management.

### Implementation

- Product images are uploaded through the backend.
- Multer handles incoming image uploads.
- Cloudinary stores uploaded product images.
- Image URLs are saved and used by the frontend.
- Product images are displayed dynamically in the storefront and administration interface.

This approach reduces the need to store image files directly on the application server.

## 10. Admin Dashboard and Analytics

ShopSphere provides an administrative dashboard that enables administrators to monitor business performance, manage customers, and track order activity.

### 10.1 Dashboard Overview

The dashboard retrieves the following statistics:

- **Total Revenue:** Calculates revenue from completed payments.
- **Total Orders:** Displays the total number of orders.
- **Total Customers:** Counts registered customer accounts.
- **Total Products:** Counts active products.
- **Pending Orders:** Displays orders awaiting processing.
- **Recent Orders:** Shows the five most recently created orders, including customer and payment information.

### 10.2 Sales Analytics

The dashboard provides a seven-day sales trend based on completed payments. Daily revenue is retrieved from the PostgreSQL database and presented as date-wise sales data.

This helps administrators monitor recent revenue patterns and understand business performance.

### 10.3 Customer Management

The administration module provides customer information, including:

- Customer name and email address.
- Phone number.
- Registration date.
- Total number of orders placed.
- Search functionality using customer name or email.

### 10.4 Access Control

Administrative dashboard and customer-management endpoints are protected by authentication and admin authorization middleware. Only users with the ADMIN role can access these operations.

The dashboard data is retrieved through backend API endpoints and Prisma database queries.

## 11. Deployment

ShopSphere is deployed using cloud hosting platforms and managed services to provide an accessible production environment.

### 11.1 Deployment Infrastructure

| Component | Technology / Hosting Platform |
|---|---|
| Frontend | Vercel |
| Backend API | Render |
| Database | Neon PostgreSQL |
| Product Image Storage | Cloudinary |
| Email Notifications | Resend |
| Source Code Repository | GitHub |

### 11.2 Deployment Links

- **Live Application:** https://shopsphere-one-azure.vercel.app
- **Backend API Health:** https://shopsphere-backend-xe4n.onrender.com/api/health
- **GitHub Repository:** https://github.com/MohdMasiUddin/ShopSphere

### 11.3 Deployment Configuration

- The React frontend is built using Vite and hosted on Vercel.
- The Express and TypeScript backend is deployed on Render.
- Neon PostgreSQL provides the production database.
- Environment variables and application credentials are configured securely through the hosting platform.
- Cloudinary manages uploaded product images.
- Resend handles order confirmation email notifications.
- GitHub maintains the source code and supports deployment updates.

### 11.4 Email Deployment Note

The Resend integration has been tested using its default testing sender. This sender is restricted to the account's own email address. Sending order notifications to arbitrary customer email addresses requires verifying a custom domain in Resend and configuring the sender address accordingly.

### 11.5 Backend Health Monitoring

The deployed backend exposes a health-check endpoint that verifies API availability and database connectivity. A successful response confirms that the backend is running and connected to the Neon PostgreSQL database.

## 12. Testing and Verification

ShopSphere was tested through functional testing of its main customer, administrator, payment, and deployment workflows.

### 12.1 Functional Testing

| Test Area | Verification |
|---|---|
| Customer Registration | Successfully tested |
| Customer Login | Successfully tested |
| Protected API Access | Verified authenticated access and rejection of unauthenticated requests |
| Product Browsing | Successfully tested |
| Product Search and Filtering | Successfully tested |
| Shopping Cart | Add, update, and remove operations tested |
| Address Management | Successfully tested |
| Order Creation | Successfully tested |
| Inventory Management | Stock deduction during order creation verified |
| Razorpay Test Payment | Test payment successfully completed |
| Payment Verification | Backend payment verification and order confirmation tested |
| Admin Dashboard | Dashboard statistics and recent orders verified |
| Customer Management | Customer listing and search functionality tested |
| Order Management | Order status update functionality tested |
| Product Image Upload | Cloudinary upload successfully tested |
| Email Notifications | Resend integration tested using the permitted testing recipient |
| Backend Health Check | API availability and database connectivity verified |

### 12.2 Build Verification

Both frontend and backend production builds were executed successfully.

- **Frontend:** TypeScript compilation and Vite production build completed successfully.
- **Backend:** TypeScript production build completed successfully.

### 12.3 Deployment Verification

The deployed frontend was accessed through Vercel, and the backend health endpoint returned a successful response confirming database connectivity with Neon PostgreSQL.

### 12.4 Testing Limitations

- Email delivery to arbitrary customer addresses requires a verified custom domain in Resend.
- Razorpay payments were tested in Test Mode; live payment processing requires production credentials and configuration.
- Comprehensive load testing and third-party security penetration testing were not performed.

These tests helped verify the main application workflows and the integration between the frontend, backend, database, and external services.

## 13. Conclusion

ShopSphere demonstrates the development of a full-stack enterprise e-commerce application using modern web technologies.

The project combines a responsive React frontend, a secure Node.js and Express backend, and a PostgreSQL database to deliver a complete online shopping experience.

It includes customer authentication and role-based access control, product management, shopping cart functionality, order processing, Razorpay payment integration, email notifications, Cloudinary image storage, and an administrative analytics dashboard.

The application was deployed using Vercel, Render, and Neon, demonstrating practical experience with cloud-based application deployment and integration of external services.

This project strengthened practical skills in frontend development, backend engineering, database management, API development, security, third-party integrations, and production deployment.

## 14. Future Enhancements

Potential improvements include:

- Custom domain and verified production email delivery.
- Advanced sales reports and graphical analytics.
- Product reviews and customer ratings.
- Wishlist and saved products.
- Advanced inventory tracking and low-stock notifications.
- Order tracking and shipment updates.
- Automated testing and continuous integration.
- Additional payment methods and currencies.
- Performance monitoring and caching improvements.

## 15. Project Information

**Project Name:** ShopSphere – Enterprise E-Commerce & Analytics Platform

**Project Type:** Full Stack Web Development

**Project Level:** Cognevance Level 3 Advanced

**Source Code:** https://github.com/MohdMasiUddin/ShopSphere

**Live Website:** https://shopsphere-one-azure.vercel.app

**Backend API:** https://shopsphere-backend-xe4n.onrender.com

