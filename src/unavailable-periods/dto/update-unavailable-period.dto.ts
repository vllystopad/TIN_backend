import { IsString, IsEnum, IsOptional } from 'class-validator';
import { UnavailabilityType } from '../../barbers/barber.types';

export class UpdateUnavailablePeriodDto {
  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsEnum(UnavailabilityType)
  @IsOptional()
  type?: UnavailabilityType;

  @IsString()
  @IsOptional()
  reason?: string;
}


