import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarbersService } from './barbers.service';
import { BarbersController } from './barbers.controller';
import { Barber } from './entities/barber.entity';
import { SecurityModule } from '../shared/security/security.module';

@Module({
  imports: [TypeOrmModule.forFeature([Barber]), SecurityModule],
  controllers: [BarbersController],
  providers: [BarbersService],
  exports: [BarbersService],
})
export class BarbersModule {}

