import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarberServicesService } from './barber-services.service';
import { BarberServicesController } from './barber-services.controller';
import { BarberService } from './entities/barber-service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BarberService])],
  controllers: [BarberServicesController],
  providers: [BarberServicesService],
  exports: [BarberServicesService],
})
export class BarberServicesModule {}


