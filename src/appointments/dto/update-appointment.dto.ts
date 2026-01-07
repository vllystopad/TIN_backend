import { IsString, IsOptional, IsNumber, Min, IsEnum } from 'class-validator';
import { AppointmentStatus } from '../appointment.types';

export class UpdateAppointmentDto {
  @IsString()
  @IsOptional()
  appointmentDate?: string;

  @IsString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  endTime?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  totalPrice?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;
}

