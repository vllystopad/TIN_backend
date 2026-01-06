import { IsString, IsOptional } from 'class-validator';

export class UpdateAppointmentDto {
  @IsString()
  @IsOptional()
  barberId?: string;

  @IsString()
  @IsOptional()
  appointmentDate?: string;

  @IsString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  endTime?: string;
}

