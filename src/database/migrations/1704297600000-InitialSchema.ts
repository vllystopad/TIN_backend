import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1704297600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "customers" (
        "id" varchar PRIMARY KEY NOT NULL,
        "email" varchar NOT NULL UNIQUE,
        "password" varchar NOT NULL,
        "firstName" varchar NOT NULL,
        "lastName" varchar NOT NULL,
        "type" text NOT NULL DEFAULT 'registered',
        "isActive" boolean NOT NULL DEFAULT 1,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "barbers" (
        "id" varchar PRIMARY KEY NOT NULL,
        "email" varchar NOT NULL UNIQUE,
        "password" varchar NOT NULL,
        "firstName" varchar NOT NULL,
        "lastName" varchar NOT NULL,
        "bio" text,
        "photo" varchar,
        "experienceYears" integer NOT NULL DEFAULT 0,
        "role" text NOT NULL DEFAULT 'admin',
        "isActive" boolean NOT NULL DEFAULT 1,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "services" (
        "id" varchar PRIMARY KEY NOT NULL,
        "name" varchar NOT NULL,
        "description" text NOT NULL,
        "durationMinutes" integer NOT NULL,
        "isActive" boolean NOT NULL DEFAULT 1,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "barber_services" (
        "id" varchar PRIMARY KEY NOT NULL,
        "barberId" varchar NOT NULL,
        "serviceId" varchar NOT NULL,
        "price" decimal(10,2) NOT NULL,
        "isAvailable" boolean NOT NULL DEFAULT 1,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY ("barberId") REFERENCES "barbers" ("id") ON DELETE CASCADE,
        FOREIGN KEY ("serviceId") REFERENCES "services" ("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "unavailable_periods" (
        "id" varchar PRIMARY KEY NOT NULL,
        "barberId" varchar NOT NULL,
        "startDate" date NOT NULL,
        "endDate" date NOT NULL,
        "type" text NOT NULL DEFAULT 'day_off',
        "reason" text,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY ("barberId") REFERENCES "barbers" ("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "appointments" (
        "id" varchar PRIMARY KEY NOT NULL,
        "customerId" varchar NOT NULL,
        "barberId" varchar NOT NULL,
        "appointmentDate" date NOT NULL,
        "startTime" time NOT NULL,
        "endTime" time NOT NULL,
        "status" text NOT NULL DEFAULT 'pending',
        "totalPrice" decimal(10,2) NOT NULL,
        "notes" text,
        "cancellationReason" text,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY ("customerId") REFERENCES "customers" ("id") ON DELETE CASCADE,
        FOREIGN KEY ("barberId") REFERENCES "barbers" ("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "appointment_services" (
        "id" varchar PRIMARY KEY NOT NULL,
        "appointmentId" varchar NOT NULL,
        "serviceId" varchar NOT NULL,
        "price" decimal(10,2) NOT NULL,
        "durationMinutes" integer NOT NULL,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY ("appointmentId") REFERENCES "appointments" ("id") ON DELETE CASCADE,
        FOREIGN KEY ("serviceId") REFERENCES "services" ("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_CUSTOMER_EMAIL" ON "customers" ("email")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CUSTOMER_TYPE" ON "customers" ("type")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_BARBER_EMAIL" ON "barbers" ("email")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_BARBER_ACTIVE" ON "barbers" ("isActive")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_SERVICE_ACTIVE" ON "services" ("isActive")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_BARBER_SERVICE_BARBER" ON "barber_services" ("barberId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_BARBER_SERVICE_SERVICE" ON "barber_services" ("serviceId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_UNAVAILABLE_PERIOD_BARBER" ON "unavailable_periods" ("barberId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_UNAVAILABLE_PERIOD_DATES" ON "unavailable_periods" ("startDate", "endDate")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_APPOINTMENT_CUSTOMER" ON "appointments" ("customerId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_APPOINTMENT_BARBER" ON "appointments" ("barberId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_APPOINTMENT_DATE" ON "appointments" ("appointmentDate")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_APPOINTMENT_STATUS" ON "appointments" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_APPOINTMENT_BARBER_DATE" ON "appointments" ("barberId", "appointmentDate")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_APPOINTMENT_SERVICE_APPOINTMENT" ON "appointment_services" ("appointmentId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_APPOINTMENT_SERVICE_SERVICE" ON "appointment_services" ("serviceId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_APPOINTMENT_SERVICE_SERVICE"`);
    await queryRunner.query(`DROP INDEX "IDX_APPOINTMENT_SERVICE_APPOINTMENT"`);
    await queryRunner.query(`DROP INDEX "IDX_APPOINTMENT_BARBER_DATE"`);
    await queryRunner.query(`DROP INDEX "IDX_APPOINTMENT_STATUS"`);
    await queryRunner.query(`DROP INDEX "IDX_APPOINTMENT_DATE"`);
    await queryRunner.query(`DROP INDEX "IDX_APPOINTMENT_BARBER"`);
    await queryRunner.query(`DROP INDEX "IDX_APPOINTMENT_CUSTOMER"`);
    await queryRunner.query(`DROP INDEX "IDX_UNAVAILABLE_PERIOD_DATES"`);
    await queryRunner.query(`DROP INDEX "IDX_UNAVAILABLE_PERIOD_BARBER"`);
    await queryRunner.query(`DROP INDEX "IDX_BARBER_SERVICE_SERVICE"`);
    await queryRunner.query(`DROP INDEX "IDX_BARBER_SERVICE_BARBER"`);
    await queryRunner.query(`DROP INDEX "IDX_SERVICE_ACTIVE"`);
    await queryRunner.query(`DROP INDEX "IDX_BARBER_ACTIVE"`);
    await queryRunner.query(`DROP INDEX "IDX_BARBER_EMAIL"`);
    await queryRunner.query(`DROP INDEX "IDX_CUSTOMER_TYPE"`);
    await queryRunner.query(`DROP INDEX "IDX_CUSTOMER_EMAIL"`);
    await queryRunner.query(`DROP TABLE "appointment_services"`);
    await queryRunner.query(`DROP TABLE "appointments"`);
    await queryRunner.query(`DROP TABLE "unavailable_periods"`);
    await queryRunner.query(`DROP TABLE "barber_services"`);
    await queryRunner.query(`DROP TABLE "services"`);
    await queryRunner.query(`DROP TABLE "barbers"`);
    await queryRunner.query(`DROP TABLE "customers"`);
  }
}

