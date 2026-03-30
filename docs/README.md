# GoviHanda: Full Project Documentation

## 1. Project Title

**GoviHanda – A Direct Digital Marketplace for Sri Lankan Farmers**

---

## 2. Project Overview

GoviHanda is a web-based digital marketplace designed to connect Sri Lankan farmers directly with buyers and agricultural service providers such as transport and cold storage providers. The main goal of the platform is to reduce the dependency on middlemen and create a more transparent, efficient, and profitable agricultural trading system.

The system allows farmers to list their products with quantity, quality, price, and photos, while buyers can browse listings and place bids. In addition, service providers can register their logistics and storage services, helping farmers and buyers complete transactions more efficiently.

This project is developed using the **MERN stack**:

* **MongoDB** – database
* **Express.js** – backend framework
* **Next.js** – frontend library
* **Node.js** – server environment

---

## 3. Problem Statement

In Sri Lanka, many farmers face difficulties when selling their harvest. They often depend on intermediaries who reduce their profit margins. Farmers also face problems such as:

* limited direct access to buyers
* lack of transparent pricing
* poor access to transport and storage services
* no proper digital platform for agricultural trade
* lack of reliable market information

Because of these issues, farmers may not receive a fair price for their products, while buyers also struggle to find trustworthy suppliers directly.

GoviHanda is designed to solve these issues by creating a direct, digital, role-based marketplace.

---

## 4. Project Objectives

### Main Objective

To build a digital platform that connects farmers, buyers, and service providers directly, reducing the role of middlemen and improving the agricultural supply chain in Sri Lanka.

### Specific Objectives

* allow farmers to list and promote their products online
* allow buyers to browse products and place bids
* provide a verified service provider directory for transport and cold storage
* provide market information to support price decisions
* establish a ratings and reviews system to build trust
* manage users and providers through an admin approval system

---

## 5. Scope of the System

GoviHanda includes the following major functions:

* user registration and login
* role-based access control
* farmer product listing and management
* buyer bidding system
* service provider registration and approval
* transaction management
* ratings and reviews
* market information dashboard
* admin monitoring and control

The system will be delivered as a **web-based application**.

---

## 6. User Roles

### 6.1 Farmer

Farmers are the main sellers in the system. They can:

* create an account
* log in to the platform
* manage their profile
* list agricultural products
* upload product images
* set quantity, quality, and expected price
* view bids placed by buyers
* accept or reject bids
* view completed transactions
* rate buyers and service providers

### 6.2 Buyer

Buyers are the users who purchase agricultural products. They can:

* create an account
* log in to the platform
* browse products
* filter and search listings
* place bids on products
* view their bid history
* track accepted transactions
* rate farmers and service providers

### 6.3 Service Provider

Service providers offer additional services such as transport and cold storage. They can:

* register on the platform
* create a business profile
* enter service details
* advertise transport or storage services
* wait for admin approval before activation
* manage service availability
* view service-related transaction information

### 6.4 Admin

Admins manage and monitor the system. They can:

* manage users
* approve or reject service providers
* monitor listings and bids
* manage market information records
* moderate ratings and reviews
* oversee payments and transactions

---

## 7. Functional Requirements

### 7.1 Authentication and Authorization

The system must:

* allow users to register
* allow users to log in securely
* hash passwords using bcrypt
* generate JWT tokens for authentication
* restrict access based on user roles
* protect private routes

### 7.2 Product Listing Management

The system must allow farmers to:

* create product listings
* add title, description, category, quantity, unit, quality, and expected price
* upload product images
* edit listings
* remove listings
* mark listings as open, sold, or closed

### 7.3 Bidding System

The system must allow buyers to:

* place bids on products
* enter bid amount and requested quantity
* view bid status

The system must allow farmers to:

* view all bids placed on their products
* accept a bid
* reject a bid

### 7.4 Transaction Management

The system must:

* create a transaction when a bid is accepted
* store agreed price and quantity
* track payment status
* track delivery status
* track storage support if needed
* allow users to view transaction history

### 7.5 Service Provider Module

The system must allow service providers to:

* register their company
* provide business and service details
* indicate service type such as transport or cold storage
* wait for admin approval

The system must allow admins to:

* verify details
* approve providers
* reject providers

### 7.6 Market Information Dashboard

The system must:

* show product market prices
* show district-wise or crop-wise pricing data
* show demand level and trend data
* allow admins to add or update market information

### 7.7 Ratings and Reviews

The system must:

* allow users to rate other users after transactions
* allow users to write reviews
* display ratings on relevant profiles

### 7.8 Admin Management

The system must allow admins to:

* manage all users
* monitor product listings
* monitor bids and transactions
* manage service provider approval
* manage market information
* moderate reviews if needed

---

## 8. Non-Functional Requirements

### Performance

* the system should load pages within a reasonable time under normal use
* API responses should be efficient and optimized

### Security

* passwords must be hashed
* JWT authentication must be used
* user roles must be validated on protected routes
* inputs must be validated and sanitized

### Usability

* the interface should be simple and user friendly
* navigation should be clear for all types of users
* forms should provide clear error messages

### Scalability

* the system should be designed so new modules can be added later
* the backend should support future growth in users and listings

### Reliability

* the system should handle errors properly
* important actions should not fail silently

### Maintainability

* code should follow modular structure
* frontend and backend should be separated clearly
* database schema should be easy to extend

---

## 9. Technology Stack

### Frontend

* React.js
* React Router
* Axios
* Tailwind CSS or Bootstrap

### Backend

* Node.js
* Express.js
* JWT
* bcrypt
* Mongoose

### Database

* MongoDB

### Optional Integrations

* Cloudinary for image storage
* Socket.io for real-time bidding notifications
* Nodemailer for email alerts
* PayHere or Stripe for payment integration

---

## 10. System Architecture

GoviHanda follows a **three-tier architecture**.

### 10.1 Presentation Layer

The presentation layer is the frontend built with React.js. It handles:

* user interface
* forms
* dashboards
* product pages
* routing and navigation

### 10.2 Application Layer

The application layer is the backend built with Node.js and Express.js. It handles:

* business logic
* authentication
* authorization
* API endpoints
* validation
* communication with the database

### 10.3 Data Layer

The data layer is MongoDB. It stores:

* users
* products
* bids
* transactions
* service provider data
* ratings
* market information

### Basic Request Flow

```text
User -> React Frontend -> Express API -> MongoDB Database
```

---

## 11. Database Design

### 11.1 Users Collection

Stores all users with role-based differentiation.

**Fields:**

* _id
* name
* email
* password
* phone
* role
* address
* district
* profileImage
* isVerified
* createdAt
* updatedAt

### 11.2 Products Collection

Stores farmer product listings.

**Fields:**

* _id
* farmerId
* title
* category
* description
* quantity
* unit
* quality
* expectedPrice
* images
* district
* harvestDate
* status
* createdAt
* updatedAt

### 11.3 Bids Collection

Stores buyer bids for products.

**Fields:**

* _id
* productId
* buyerId
* bidAmount
* quantityRequested
* message
* status
* createdAt
* updatedAt

### 11.4 Transactions Collection

Stores transaction records after a bid is accepted.

**Fields:**

* _id
* productId
* bidId
* farmerId
* buyerId
* agreedPrice
* quantity
* paymentStatus
* deliveryStatus
* storageStatus
* transactionStatus
* createdAt
* updatedAt

### 11.5 Service Providers Collection

Stores registered transport and cold storage service providers.

**Fields:**

* _id
* userId
* businessName
* serviceType
* description
* coverageArea
* pricingDetails
* vehicleDetails
* storageCapacity
* approvalStatus
* createdAt
* updatedAt

### 11.6 Service Provider Payments Collection

Stores payment details related to service providers.

**Fields:**

* _id
* providerId
* transactionId
* amount
* paymentMethod
* paymentStatus
* paidAt
* createdAt

### 11.7 Ratings Collection

Stores reviews and ratings.

**Fields:**

* _id
* reviewerId
* targetUserId
* transactionId
* rating
* review
* createdAt

### 11.8 Market Info Collection

Stores agricultural market information.

**Fields:**

* _id
* cropName
* district
* averagePrice
* demandLevel
* trend
* source
* updatedAt

---

## 12. Main System Workflows

### 12.1 Farmer Selling Workflow

1. Farmer registers and logs in
2. Farmer creates a product listing
3. Buyers browse the listing
4. Buyer places a bid
5. Farmer views and evaluates bids
6. Farmer accepts or rejects a bid
7. If accepted, a transaction is created
8. Delivery or storage services may be arranged
9. Payment and transaction are completed
10. Ratings and reviews are submitted

### 12.2 Service Provider Approval Workflow

1. Service provider registers on the platform
2. Provider submits company and service details
3. Admin reviews provider details
4. Admin approves or rejects the provider
5. Approved provider becomes visible in the system

### 12.3 Market Information Workflow

1. Admin adds or updates market information
2. System stores latest pricing and demand data
3. Dashboard displays current market insights
4. Farmers and buyers use the data for decision making

---

## 13. API Plan

### Authentication APIs

* `POST /api/auth/register`
* `POST /api/auth/login`
* `GET /api/auth/profile`

### User APIs

* `GET /api/users/me`
* `PUT /api/users/me`
* `GET /api/users/:id`

### Product APIs

* `POST /api/products`
* `GET /api/products`
* `GET /api/products/:id`
* `PUT /api/products/:id`
* `DELETE /api/products/:id`

### Bid APIs

* `POST /api/bids`
* `GET /api/bids/product/:productId`
* `GET /api/bids/my-bids`
* `PUT /api/bids/:id/accept`
* `PUT /api/bids/:id/reject`

### Transaction APIs

* `POST /api/transactions`
* `GET /api/transactions/my`
* `GET /api/transactions/:id`
* `PUT /api/transactions/:id/status`

### Service Provider APIs

* `POST /api/providers/register`
* `GET /api/providers`
* `GET /api/providers/:id`
* `PUT /api/providers/:id`
* `PUT /api/providers/:id/approve`
* `PUT /api/providers/:id/reject`

### Rating APIs

* `POST /api/ratings`
* `GET /api/ratings/:userId`

### Market Info APIs

* `GET /api/market-info`
* `POST /api/market-info`
* `PUT /api/market-info/:id`

---

## 14. Frontend Pages

### Public Pages

* Home page
* About page
* Product marketplace page
* Service providers directory
* Login page
* Register page

### Farmer Pages

* Farmer dashboard
* My products page
* Add product page
* Product bids page
* Transaction history page

### Buyer Pages

* Buyer dashboard
* Browse products page
* Product details page
* My bids page
* Purchase history page

### Service Provider Pages

* Provider dashboard
* Company profile page
* Service management page
* Approval status page
* Payment history page

### Admin Pages

* Admin dashboard
* User management page
* Provider approval page
* Product monitoring page
* Market information management page
* Review moderation page

---

## 15. Suggested Project Structure

### Frontend Structure

```text
client/
  public/
  src/
    api/
    assets/
    components/
    context/
    hooks/
    pages/
      auth/
      farmer/
      buyer/
      provider/
      admin/
    routes/
    utils/
    App.jsx
```

### Backend Structure

```text
server/
  config/
  controllers/
  middleware/
  models/
  routes/
  services/
  utils/
  uploads/
  app.js
  server.js
```

---

## 16. Development Plan

### Phase 1 – Project Setup

* initialize frontend and backend
* setup MongoDB connection
* configure environment variables
* install project dependencies
* create base folder structure

### Phase 2 – Authentication and Authorization

* implement user registration
* implement login
* hash passwords
* issue JWT tokens
* create protected routes
* implement role-based middleware

### Phase 3 – User Dashboards and Profiles

* create dashboards for each role
* create profile pages
* implement profile update functions

### Phase 4 – Product Listing Module

* create add product form
* implement image upload
* create farmer product management page
* create public product browsing page
* create product details page

### Phase 5 – Bidding System

* allow buyers to place bids
* allow farmers to view bids
* allow farmers to accept or reject bids
* display bid history and status

### Phase 6 – Transaction Module

* create transaction records
* show transaction history
* track transaction progress
* update delivery and payment status

### Phase 7 – Service Provider Module

* provider registration flow
* admin approval process
* provider directory page
* service details management

### Phase 8 – Ratings and Reviews

* allow ratings after completed transactions
* display ratings on profile pages

### Phase 9 – Market Information Dashboard

* create market info admin management panel
* display crop prices and demand levels
* add filtering if needed

### Phase 10 – Testing and Security

* validate forms and APIs
* handle errors
* secure routes
* test frontend and backend integration

### Phase 11 – Deployment

* deploy frontend
* deploy backend
* connect production database
* configure environment variables
* perform final QA testing

---

## 17. Security Plan

The following security measures should be included:

* bcrypt password hashing
* JWT authentication
* protected API routes
* role validation middleware
* server-side validation
* file type restrictions for uploads
* input sanitization
* secure environment variables
* error handling without exposing sensitive data

---

## 18. Challenges and Risks

Possible project challenges include:

* fake product listings
* fake service providers
* unreliable market data
* incomplete transactions
* pricing disputes
* image storage issues
* role complexity and access control issues

### Risk Mitigation

* use admin verification for providers
* create review and rating system
* track transaction statuses clearly
* validate data carefully
* restrict unauthorized actions

---

## 19. Future Enhancements

Future improvements can include:

* mobile application version
* Sinhala, Tamil, and English language support
* real-time notifications
* real-time chat between farmer and buyer
* AI-based price recommendations
* online payment gateway integration
* GPS-based logistics matching
* advanced analytics dashboard

---

## 20. Recommended Minimum Viable Product (MVP)

For the first version, the following features are enough:

* user registration and login
* role-based dashboards
* farmer product listing
* buyer bidding system
* farmer accept/reject bids
* service provider registration and admin approval
* ratings and reviews
* basic market information dashboard

This MVP is enough to demonstrate the main business value of the platform.

---

## 21. Conclusion

GoviHanda is a practical and impactful digital solution for Sri Lankan agriculture. By bringing farmers, buyers, and service providers into one platform, the system can reduce middlemen, improve pricing transparency, and make the agricultural supply chain more efficient.

The most important flow of the system is:

**Farmer lists product -> Buyer places bid -> Farmer accepts bid -> Transaction is created -> Service support is arranged if needed -> Payment is completed -> Rating is submitted**

This project is well suited for a MERN stack implementation and can be expanded in the future into a larger agricultural commerce ecosystem.
