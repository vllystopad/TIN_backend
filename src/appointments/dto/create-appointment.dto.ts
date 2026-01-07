import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum, Min, IsArray, IsUUID } from 'class-validator';
import { AppointmentStatus } from '../appointment.types';

export class CreateAppointmentDto {
  @IsUUID()
  @IsNotEmpty()
  barberId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  serviceIds: string[];

  @IsString()
  @IsNotEmpty()
  appointmentDate: string;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;

  @IsNumber()
  @Min(0)
  totalPrice: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;
}

