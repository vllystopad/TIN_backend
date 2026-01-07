import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { validate } from './config/env.validation';
import { CustomerModule } from './customer/customer.module';
import { SecurityModule } from './shared/security/security.module';
import { CustomerAuthModule } from './features/auth/customerAuth.module';
import { BarbersModule } from './barbers/barbers.module';
import { ServicesModule } from './services/services.module';
import { BarberServicesModule } from './barber-services/barber-services.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { UnavailablePeriodsModule } from './unavailable-periods/unavailable-periods.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate,
    }),
    DatabaseModule,
    SecurityModule,
    CustomerModule,
    CustomerAuthModule,
    BarbersModule,
    ServicesModule,
    BarberServicesModule,
    AppointmentsModule,
    UnavailablePeriodsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
