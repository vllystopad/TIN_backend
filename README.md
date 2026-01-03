# Barbershop Appointment Booking - Backend

A modern backend application for managing barbershop appointments built with NestJS, TypeORM, and SQLite.

## Technology Stack

- **Framework**: [NestJS](https://nestjs.com/) ^11.0.1 - A progressive Node.js framework for building efficient and scalable server-side applications
- **Database**: [SQLite](https://www.sqlite.org/) ^5.1.7 - Lightweight, serverless database engine
- **ORM**: [TypeORM](https://typeorm.io/) ^0.3.28 - Object-Relational Mapping library for TypeScript and JavaScript
- **Authentication**: [Passport](https://www.passportjs.org/) + JWT - Secure authentication system
- **Validation**: [class-validator](https://github.com/typestack/class-validator) + class-transformer - DTO validation

## Project Overview

This application provides a comprehensive backend solution for barbershop appointment management, allowing customers to book appointments and barbershops to manage their schedules efficiently.

### Key Features

- **Customer Management**: Registration, authentication, and profile management
- **Appointment Booking**: Schedule, modify, and cancel appointments
- **Barber Management**: Manage barber profiles, availability, and services
- **Service Catalog**: Define and manage barbershop services with pricing
- **Schedule Management**: Real-time availability tracking and conflict prevention
- **Notification System**: Automated reminders and booking confirmations

### Core Entities

- **Users**: Customers and barbers with role-based access
- **Appointments**: Booking records with time slots and service details
- **Services**: Available barbershop services (haircut, beard trim, etc.)
- **Barbers**: Staff profiles with specializations and availability
- **Time Slots**: Available booking windows for each barber

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm package manager

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd TIN_backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Create database and run migrations**
```bash
npm run db:create
```

5. Start the development server
```bash
npm run start:dev
```

The API will be available at `http://localhost:5001`

### Quick Start (For Teachers/Reviewers)

After cloning the project, run these commands:

```bash
npm install
npm run db:create
npm run start:dev
```

That's it! The database will be created automatically with all tables.

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5001
NODE_ENV=development
DATABASE_PATH=./database.sqlite
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

## Installed Dependencies

### Core Dependencies
- `@nestjs/common` ^11.0.1
- `@nestjs/core` ^11.0.1
- `@nestjs/platform-express` ^11.0.1
- `@nestjs/typeorm` ^11.0.0
- `@nestjs/config` ^4.0.2
- `typeorm` ^0.3.28
- `sqlite3` ^5.1.7

### Authentication & Security
- `@nestjs/jwt` ^11.0.2
- `@nestjs/passport` ^11.0.5
- `passport` ^0.7.0
- `passport-jwt` ^4.0.1
- `bcrypt` ^6.0.0

### Validation & Transformation
- `class-validator` ^0.14.3
- `class-transformer` ^0.5.1

### Utilities
- `reflect-metadata` ^0.2.2

## API Documentation

Once the server is running, you can access the Swagger API documentation at:
`http://localhost:5001/api`

## Database Schema

The application uses SQLite with TypeORM for data persistence. Key tables include:

- `users` - Customer and barber accounts
- `appointments` - Booking records
- `services` - Available barbershop services
- `barbers` - Barber profiles and specializations
- `time_slots` - Available booking windows

## Development

### Available Scripts

#### Development
- `npm run start` - Start production server
- `npm run start:dev` - Start development server with hot reload
- `npm run start:debug` - Start server in debug mode
- `npm run build` - Build the application

#### Database
- `npm run db:create` - Build project and create database with migrations (first time setup)
- `npm run db:init` - Run migrations on already built project
- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert last migration
- `npm run schema:drop` - Drop all database tables

#### Code Quality
- `npm run format` - Format code with Prettier
- `npm run lint` - Lint and fix code with ESLint

#### Testing
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage
- `npm run test:e2e` - Run end-to-end tests

### Project Structure

```
src/
├── app.module.ts          # Main application module
├── main.ts               # Application entry point
├── auth/                 # Authentication module
├── users/                # User management
├── appointments/         # Appointment booking logic
├── barbers/             # Barber management
├── services/            # Service catalog
├── database/            # Database configuration and migrations
└── common/              # Shared utilities and decorators
```

## Code Quality

The project uses:
- **Prettier** for code formatting
- **ESLint** with TypeScript support for linting
- **EditorConfig** for consistent coding styles

Run formatting and linting:
```bash
npm run format
npm run lint
```

## Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## License

Bro chill it's uni project (MIT)
