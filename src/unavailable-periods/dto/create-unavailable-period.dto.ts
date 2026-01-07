import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { UnavailabilityType } from '../../barbers/barber.types';

export class CreateUnavailablePeriodDto {
  @IsString()
  @IsNotEmpty()
  barberId: string;

  @IsString()
  @IsNotEmpty()
  startDate: string;

  @IsString()
  @IsNotEmpty()
  endDate: string;

  @IsEnum(UnavailabilityType)
  @IsOptional()
  type?: UnavailabilityType;

  @IsString()
  @IsOptional()
  reason?: string;
}

