import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment } from './entities/appointment.entity';
import { CustomerAuthModule } from 'src/features/auth/customerAuth.module';
import { CustomerService } from 'src/customer/customer.service';
import { CustomerModule } from 'src/customer/customer.module';
import { AppointmentService } from 'src/appointment-services/entities/appointment-service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, AppointmentService]), CustomerAuthModule, CustomerModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule { }

