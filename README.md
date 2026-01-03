# Barbershop Appointment Booking - Backend

A modern backend application for managing barbershop appointments built with NestJS, TypeORM, and SQLite.

## Technology Stack

- **Framework**: [NestJS](https://nestjs.com/) - A progressive Node.js framework for building efficient and scalable server-side applications
- **Database**: [SQLite](https://www.sqlite.org/) - Lightweight, serverless database engine
- **ORM**: [TypeORM](https://typeorm.io/) - Object-Relational Mapping library for TypeScript and JavaScript

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
- npm or yarn package manager

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

4. Run database migrations
```bash
npm run migration:run
```

5. Start the development server
```bash
npm run start:dev
```

The API will be available at `http://localhost:5001`

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

- `npm run start` - Start production server
- `npm run start:dev` - Start development server with hot reload
- `npm run start:debug` - Start server in debug mode
- `npm run build` - Build the application
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run migration:generate` - Generate new migration
- `npm run migration:run` - Run pending migrations

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

## License

Bro chill it's uni project (MIT)