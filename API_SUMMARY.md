# API Summary - All Endpoints

## 1. Barbers (`/barbers`)

### Endpoints:
- **POST** `/barbers` - Create a new barber
- **GET** `/barbers` - Get all barbers
- **GET** `/barbers/:id` - Get barber by ID
- **PATCH** `/barbers/:id` - Update barber information (no relations)
- **DELETE** `/barbers/:id` - Delete barber

### Operations:
- Create, Read, Update, Delete
- Update only barber information (firstName, lastName, bio, photo, experienceYears)
- No relation updates

---

## 2. Services (`/services`)

### Endpoints:
- **POST** `/services` - Create a new service
- **GET** `/services` - Get all services
- **GET** `/services/:id` - Get service by ID
- **PATCH** `/services/:id` - Update service information
- **DELETE** `/services/:id` - Delete service

### Operations:
- Full CRUD operations
- Update service details (name, description, durationMinutes)

---

## 3. Barber Services (`/barber-services`)

### Endpoints:
- **POST** `/barber-services/service/:serviceId/assign/:barberId` - Assign service to barber
- **GET** `/barber-services` - Get all barber-service relationships
- **GET** `/barber-services/:id` - Get barber-service by ID
- **GET** `/barber-services/barber/:barberId` - Get all services for a barber
- **GET** `/barber-services/service/:serviceId` - Get all barbers for a service
- **DELETE** `/barber-services/:id` - Remove barber-service relationship

### Operations:
- Create relationship between barber and service (with price and availability)
- Read relationships with filtering
- Delete relationships
- No update operation

---

## 4. Appointments (`/appointments`)

### Endpoints:
- **POST** `/appointments/barber/:barberId` - Create appointment with barber
- **GET** `/appointments` - Get all appointments
- **GET** `/appointments/:id` - Get appointment by ID
- **GET** `/appointments/customer/:customerId` - Get appointments by customer
- **GET** `/appointments/barber/:barberId` - Get appointments by barber
- **PATCH** `/appointments/:id` - Update appointment (time, date, or barber)
- **DELETE** `/appointments/:id` - Delete appointment

### Operations:
- Create with barber assignment
- Read with filtering by customer or barber
- Update only: appointmentDate, startTime, endTime, barberId
- Delete

---

## 5. Appointment Services (`/appointment-services`)

### Endpoints:
- **POST** `/appointment-services/appointment/:appointmentId/service/:serviceId` - Add service to appointment
- **GET** `/appointment-services` - Get all appointment-service relationships
- **GET** `/appointment-services/:id` - Get appointment-service by ID
- **GET** `/appointment-services/appointment/:appointmentId` - Get services for appointment
- **DELETE** `/appointment-services/:id` - Remove service from appointment

### Operations:
- Create relationship between appointment and service (with price and duration)
- Read relationships with filtering
- Delete relationships
- No update operation

---

## 6. Unavailable Periods (`/unavailable-periods`)

### Endpoints:
- **POST** `/unavailable-periods` - Create unavailable period
- **GET** `/unavailable-periods` - Get all unavailable periods
- **GET** `/unavailable-periods/:id` - Get unavailable period by ID
- **GET** `/unavailable-periods/barber/:barberId` - Get unavailable periods by barber
- **PATCH** `/unavailable-periods/:id` - Update unavailable period
- **DELETE** `/unavailable-periods/:id` - Delete unavailable period

### Operations:
- Full CRUD operations
- Create with barberId
- Update period details (startDate, endDate, type, reason)

---

## 7. Customers (`/customers`)

### Endpoints:
- **POST** `/customers` - Create a new customer
- **GET** `/customers` - Get all customers
- **GET** `/customers/:id` - Get customer by ID
- **PATCH** `/customers/:id` - Update customer information (no relations)
- **DELETE** `/customers/:id` - Delete customer

### Operations:
- Create, Read, Update, Delete
- Update only customer information (firstName, lastName, password)
- No relation updates

---

## Key Features:

### URL Parameters (not query parameters):
- All relation operations use URL parameters
- Examples:
  - `/barber-services/service/:serviceId/assign/:barberId`
  - `/appointments/barber/:barberId`
  - `/appointment-services/appointment/:appointmentId/service/:serviceId`

### Response Codes:
- **201 Created** - Successful creation
- **200 OK** - Successful read/update
- **204 No Content** - Successful deletion
- **404 Not Found** - Resource not found
- **409 Conflict** - Duplicate resource (e.g., email already exists)

### No Transactions:
- All operations are single-entity focused
- No multi-table transactions implemented

### Controllers:
- All controllers return Promises
- All controllers use proper HTTP status codes
- All business logic is in services

### DTOs:
- Validation using class-validator
- Separate DTOs for create and update operations
- Type-safe with TypeScript

