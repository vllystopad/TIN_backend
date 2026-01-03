# Database Schema - Barbershop Booking System

## Overview

Default working hours: **Monday-Friday, 9:00-17:00**

Barbers are available by default, and we store only their **unavailable periods** (days off, vacations, etc.)

**One appointment = One barber + One customer + Multiple services**

---

## Tables

### 1. **customers**
Stores customer accounts (guest or registered).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar | PRIMARY KEY | UUID |
| email | varchar | UNIQUE, NOT NULL | Customer email |
| password | varchar | NOT NULL | Hashed password |
| firstName | varchar | NOT NULL | First name |
| lastName | varchar | NOT NULL | Last name |
| type | text | NOT NULL, DEFAULT 'registered' | guest / registered |
| isActive | boolean | NOT NULL, DEFAULT 1 | Account status |
| createdAt | datetime | NOT NULL | Creation timestamp |
| updatedAt | datetime | NOT NULL | Update timestamp |

**Indexes:**
- `IDX_CUSTOMER_EMAIL` on `email`
- `IDX_CUSTOMER_TYPE` on `type`

---

### 2. **barbers**
Stores barber profiles (barbers are admins).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar | PRIMARY KEY | UUID |
| email | varchar | UNIQUE, NOT NULL | Barber email |
| password | varchar | NOT NULL | Hashed password |
| firstName | varchar | NOT NULL | First name |
| lastName | varchar | NOT NULL | Last name |
| bio | text | NULL | Biography/description |
| photo | varchar | NULL | Photo URL |
| experienceYears | integer | NOT NULL, DEFAULT 0 | Years of experience |
| role | text | NOT NULL, DEFAULT 'admin' | admin (barbers are admins) |
| isActive | boolean | NOT NULL, DEFAULT 1 | Active status |
| createdAt | datetime | NOT NULL | Creation timestamp |
| updatedAt | datetime | NOT NULL | Update timestamp |

**Indexes:**
- `IDX_BARBER_EMAIL` on `email`
- `IDX_BARBER_ACTIVE` on `isActive`

**Default Schedule:** Monday-Friday, 9:00-17:00

---

### 3. **services**
Available barbershop services (NO PRICE - price is per barber).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar | PRIMARY KEY | UUID |
| name | varchar | NOT NULL | Service name |
| description | text | NOT NULL | Service description |
| durationMinutes | integer | NOT NULL | Base duration in minutes |
| isActive | boolean | NOT NULL, DEFAULT 1 | Active status |
| createdAt | datetime | NOT NULL | Creation timestamp |
| updatedAt | datetime | NOT NULL | Update timestamp |

**Indexes:**
- `IDX_SERVICE_ACTIVE` on `isActive`

**Note:** Price is NOT stored here - each barber sets their own price!

---

### 4. **barber_services** (Junction Table)
Links barbers with services they can perform, with THEIR pricing.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar | PRIMARY KEY | UUID |
| barberId | varchar | NOT NULL, FK → barbers.id | Barber reference |
| serviceId | varchar | NOT NULL, FK → services.id | Service reference |
| price | decimal(10,2) | NOT NULL | Barber's price for this service |
| isAvailable | boolean | NOT NULL, DEFAULT 1 | Availability flag |
| createdAt | datetime | NOT NULL | Creation timestamp |
| updatedAt | datetime | NOT NULL | Update timestamp |

**Foreign Keys:**
- `barberId` → `barbers(id)` ON DELETE CASCADE
- `serviceId` → `services(id)` ON DELETE CASCADE

**Indexes:**
- `IDX_BARBER_SERVICE_BARBER` on `barberId`
- `IDX_BARBER_SERVICE_SERVICE` on `serviceId`

**Note:** Duration comes from `services.durationMinutes`

---

### 5. **unavailable_periods**
Stores barber unavailability (days off, vacations, sick leave).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar | PRIMARY KEY | UUID |
| barberId | varchar | NOT NULL, FK → barbers.id | Barber reference |
| startDate | date | NOT NULL | Start date of unavailability |
| endDate | date | NOT NULL | End date of unavailability |
| type | text | NOT NULL, DEFAULT 'day_off' | day_off / vacation / sick_leave / personal |
| reason | text | NULL | Optional reason |
| createdAt | datetime | NOT NULL | Creation timestamp |
| updatedAt | datetime | NOT NULL | Update timestamp |

**Foreign Keys:**
- `barberId` → `barbers(id)` ON DELETE CASCADE

**Indexes:**
- `IDX_UNAVAILABLE_PERIOD_BARBER` on `barberId`
- `IDX_UNAVAILABLE_PERIOD_DATES` on `(startDate, endDate)`

---

### 6. **appointments**
Customer appointment bookings (1 barber + 1 customer + multiple services).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar | PRIMARY KEY | UUID |
| customerId | varchar | NOT NULL, FK → customers.id | Customer reference |
| barberId | varchar | NOT NULL, FK → barbers.id | Barber reference |
| appointmentDate | date | NOT NULL | Appointment date |
| startTime | time | NOT NULL | Start time |
| endTime | time | NOT NULL | End time |
| status | text | NOT NULL, DEFAULT 'pending' | pending / confirmed / cancelled / completed / no_show |
| totalPrice | decimal(10,2) | NOT NULL | Total price (sum of all services) |
| notes | text | NULL | Customer notes |
| cancellationReason | text | NULL | Reason for cancellation |
| createdAt | datetime | NOT NULL | Creation timestamp |
| updatedAt | datetime | NOT NULL | Update timestamp |

**Foreign Keys:**
- `customerId` → `customers(id)` ON DELETE CASCADE
- `barberId` → `barbers(id)` ON DELETE CASCADE

**Indexes:**
- `IDX_APPOINTMENT_CUSTOMER` on `customerId`
- `IDX_APPOINTMENT_BARBER` on `barberId`
- `IDX_APPOINTMENT_DATE` on `appointmentDate`
- `IDX_APPOINTMENT_STATUS` on `status`
- `IDX_APPOINTMENT_BARBER_DATE` on `(barberId, appointmentDate)`

---

### 7. **appointment_services** (Junction Table)
Links appointments with multiple services (e.g., haircut + beard trim).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar | PRIMARY KEY | UUID |
| appointmentId | varchar | NOT NULL, FK → appointments.id | Appointment reference |
| serviceId | varchar | NOT NULL, FK → services.id | Service reference |
| price | decimal(10,2) | NOT NULL | Price at booking time |
| durationMinutes | integer | NOT NULL | Duration at booking time |
| createdAt | datetime | NOT NULL | Creation timestamp |
| updatedAt | datetime | NOT NULL | Update timestamp |

**Foreign Keys:**
- `appointmentId` → `appointments(id)` ON DELETE CASCADE
- `serviceId` → `services(id)` ON DELETE CASCADE

**Indexes:**
- `IDX_APPOINTMENT_SERVICE_APPOINTMENT` on `appointmentId`
- `IDX_APPOINTMENT_SERVICE_SERVICE` on `serviceId`

**Note:** We store price and duration at booking time to preserve historical data

---

## Relationships Diagram

```
┌──────────────┐
│  customers   │
│ (guest/reg)  │
└──────┬───────┘
       │ 1
       │
       │ N
       ▼
┌─────────────────┐           ┌──────────────────────┐
│  appointments   │           │ appointment_services │
└─────────────────┘           │   (junction table)   │
       │                      └──────────┬───────────┘
       │ N                               │ N
       │                                 │
       │ 1                               │ 1
       ▼                                 ▼
┌─────────────┐                  ┌──────────────┐
│   barbers   │                  │   services   │
│   (admin)   │                  └──────┬───────┘
└──────┬──────┘                         │
       │                                │
       │ 1                              │
       │                                │
       │ N                      N       │ N
       ├──────►┌────────────────────────┴──────┐
       │       │    barber_services            │
       │       │   (junction table with price) │
       │       └───────────────────────────────┘
       │
       │ 1
       │
       │ N
       ▼
┌──────────────────────┐
│ unavailable_periods  │
│  (days off, vacation)│
└──────────────────────┘
```

---

## Business Logic

### Barber Availability
1. **Default Schedule**: Monday-Friday, 9:00-17:00
2. **Unavailable Periods**: Check `unavailable_periods` table
3. **Booked Slots**: Check `appointments` table

### Appointment Booking Flow
1. Customer selects barber
2. System shows barber's services and prices via `barber_services`
3. Customer selects multiple services (e.g., haircut + beard trim)
4. System calculates:
   - Total duration = sum of `services.durationMinutes`
   - Total price = sum of `barber_services.price`
5. Check availability:
   - Is date Monday-Friday?
   - Is time between 9:00-17:00?
   - Is barber NOT in `unavailable_periods`?
   - Is time slot NOT in `appointments`?
6. Create appointment with `totalPrice`
7. Create entries in `appointment_services` for each selected service

### Price Logic
- **Service has NO price** - only duration
- **Barber sets price** in `barber_services`
- **Appointment stores snapshot** in `appointment_services` (historical data)

### Duration Logic
- **Service defines base duration**
- **Duration is copied** to `appointment_services` at booking time
- **Total appointment duration** = sum of all service durations

---

## Enums

### CustomerType (`customers/customer.types.ts`)
- `guest` - Guest customer (temporary)
- `registered` - Registered customer

### BarberRole (`barbers/barber.types.ts`)
- `admin` - Admin (all barbers are admins)

### UnavailabilityType (`barbers/barber.types.ts`)
- `day_off` - Regular day off
- `vacation` - Vacation period
- `sick_leave` - Sick leave
- `personal` - Personal reasons

### AppointmentStatus (`appointments/appointment.types.ts`)
- `pending` - Waiting for confirmation
- `confirmed` - Confirmed by barber/admin
- `cancelled` - Cancelled by customer or barber
- `completed` - Service completed
- `no_show` - Customer didn't show up

---

## Example Scenario

**Customer books appointment:**
1. Selects "John the Barber"
2. Sees John's services:
   - Haircut: $30 (30 min)
   - Beard Trim: $15 (15 min)
   - Shave: $20 (20 min)
3. Selects: Haircut + Beard Trim
4. System creates:
   - 1 `appointment` record:
     - barberId = John's ID
     - customerId = Customer's ID
     - totalPrice = $45
     - duration = 45 min
   - 2 `appointment_services` records:
     - Service 1: Haircut, price=$30, duration=30
     - Service 2: Beard Trim, price=$15, duration=15

---

## Migration Scripts

### Run migrations
```bash
npm run migration:run
```

### Revert last migration
```bash
npm run migration:revert
```

### Drop all tables
```bash
npm run schema:drop
```

---

## Notes

- All IDs are UUIDs stored as varchar
- All timestamps use SQLite's `datetime('now')`
- Cascade deletes are enabled for referential integrity
- Indexes are created for frequently queried columns
- No seed data included in migrations
- Phone fields removed from customers and barbers
- Prices are per-barber, not per-service
- Appointments support multiple services
- Customers can be guest or registered
- All barbers are admins

