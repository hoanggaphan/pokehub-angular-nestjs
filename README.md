# PokeHub - Pokémon Management Application

A full-stack Pokémon application built with Angular frontend and NestJS backend, featuring user authentication, Pokémon management, and favorites functionality.

## 🚀 Features

### Frontend (Angular)
- **User Authentication**: Signup/Login with JWT authentication
- **Responsive Layout**: Header, navigation, footer, and main content sections
- **Home Page**: 
  - Carousel with 4 Pokémon YouTube video trailers
  - Display of 10 Pokémon (5 per row) with images and names
- **Pokémon List Page**:
  - CSV import functionality for Pokémon data
  - Search bar with 300ms debounce for name filtering
  - Advanced search with filters (type, legendary status, speed ranges)
  - Pagination (10, 20, 50, 100 items per page)
  - URL query parameter filtering
- **Pokémon Detail Modal**: 
  - Comprehensive Pokémon information display
  - Favorite/unfavorite functionality with heart icon
- **Favorites Management**: Dedicated page for managing favorite Pokémon

### Backend (NestJS)
- **Database**: PostgreSQL with TypeORM for data persistence
- **Authentication**: JWT-based authentication with refresh tokens
- **RESTful API Endpoints**:
  - User registration and authentication
  - Pokémon CSV import functionality
  - Pokémon listing with pagination and filtering
  - Pokémon details retrieval
  - Favorite Pokémon management
  - User favorites list retrieval

## 🛠️ Technology Stack

### Frontend
- **Framework**: Angular 20
- **UI Library**: Angular Material
- **Styling**: Tailwind CSS
- **State Management**: NgRx Signals
- **Carousel**: ngx-owl-carousel-o
- **HTTP Client**: Angular HttpClient

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Authentication**: Passport.js with JWT
- **Validation**: class-validator
- **CSV Processing**: fast-csv, csv-parse
- **Password Hashing**: bcrypt

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)
- **Angular CLI** (for frontend development)

## 🚀 Setup and Running Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd pokehub
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Environment Configuration
Create a `.env` file in the backend directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=pokehub_db

# Application Configuration
APP_PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CLIENT=http://localhost:4200
```

#### Database Setup
1. Create a PostgreSQL database named `pokehub_db`
2. Run the application - TypeORM will automatically create tables

#### Start the Backend
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The backend will be available at `http://localhost:3000`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Environment Configuration
Create a `.env` file in the frontend directory:

```env
NG_APP_SERVER_URL=http://localhost:3000
NG_APP_API_URL=http://localhost:3000/api
```

#### Start the Frontend
```bash
# Development mode
npm start

# Production build
npm run build
```

The frontend will be available at `http://localhost:4200`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Pokémon Endpoints
- `GET /api/pokemon` - Get Pokémon list with pagination and filtering
- `GET /api/pokemon/:id` - Get Pokémon details by ID
- `POST /api/pokemon/import` - Import Pokémon from CSV file

### Favorites Endpoints
- `GET /api/favorites` - Get user's favorite Pokémon
- `POST /api/favorites` - Add Pokémon to favorites
- `DELETE /api/favorites/:id` - Remove Pokémon from favorites

### User Endpoints
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/password` - Update user password

## 🎯 Implemented Features

### ✅ Completed Features

#### Frontend
- [x] User authentication (signup/login) with JWT
- [x] Responsive layout with header, navigation, footer
- [x] Home page with carousel and Pokémon display
- [x] Pokémon list page with search and filtering
- [x] CSV import functionality
- [x] Advanced search with multiple filters
- [x] Pagination with configurable page sizes
- [x] URL query parameter filtering
- [x] Pokémon detail modal
- [x] Favorite/unfavorite functionality
- [x] Favorites management page
- [x] Route guards for authentication
- [x] HTTP interceptors for JWT handling

#### Backend
- [x] PostgreSQL database integration with TypeORM
- [x] User authentication with JWT and refresh tokens
- [x] User registration and login endpoints
- [x] Pokémon CSV import functionality
- [x] Pokémon listing with pagination and filtering
- [x] Pokémon details retrieval
- [x] Favorite Pokémon management
- [x] User favorites list
- [x] Input validation with class-validator
- [x] CORS configuration
- [x] Environment-based configuration

## 🏗️ Design Decisions

### Architecture
- **Monorepo Structure**: Separate frontend and backend directories for clear separation of concerns
- **RESTful API Design**: Standard REST endpoints following best practices
- **JWT Authentication**: Stateless authentication with refresh token mechanism
- **TypeORM**: Object-relational mapping for database operations

### Frontend Design
- **Angular Material**: Consistent UI components and design system
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **NgRx Signals**: Modern state management for reactive data flow
- **Component-based Architecture**: Modular, reusable components
- **Route Guards**: Protected routes for authenticated users
- **HTTP Interceptors**: Centralized JWT token management

### Backend Design
- **NestJS Modules**: Modular architecture with clear separation of concerns
- **DTOs**: Data transfer objects for input validation
- **Guards**: Authentication and authorization guards
- **Services**: Business logic separation
- **Entities**: TypeORM entities for database models

### Database Design
- **User Entity**: Stores user authentication and profile data
- **Pokemon Entity**: Stores Pokémon information with comprehensive attributes
- **Favorite Entity**: Junction table for user-favorite Pokémon relationships

### Security Considerations
- **Password Hashing**: bcrypt for secure password storage
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Comprehensive validation using class-validator
- **CORS Configuration**: Environment-specific CORS settings

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:cov      # Coverage report
```

### Frontend Testing
```bash
cd frontend
npm test              # Unit tests
```

## 📦 Deployment

### Backend Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Build the application: `npm run build`
4. Start production server: `npm run start:prod`

### Frontend Deployment
1. Configure environment variables
2. Build the application: `npm run build`
3. Deploy the `dist` folder to your web server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team.
