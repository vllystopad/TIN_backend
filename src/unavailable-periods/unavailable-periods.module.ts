import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnavailablePeriodsService } from './unavailable-periods.service';
import { UnavailablePeriodsController } from './unavailable-periods.controller';
import { UnavailablePeriod } from './entities/unavailable-period.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UnavailablePeriod])],
  controllers: [UnavailablePeriodsController],
  providers: [UnavailablePeriodsService],
  exports: [UnavailablePeriodsService],
})
export class UnavailablePeriodsModule {}


